// RAC - ruler-and-compass - 1.0.1-dev - development with sourcemaps
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version
module.exports = {
	version: '1.0.1-dev',
	build: '772-27894a7'
};


},{}],2:[function(require,module,exports){
'use strict';


// Ruler and Compass
const version = require('../built/version').version;
const build   = require('../built/version').build;


/**
* Root class of RAC. All drawable, style, control, and drawer classes are
* contained in this class.
*
* An instance must be created with `new Rac()` in order to
* build drawable, style, and other objects.
*
* To perform drawing operations, a drawer must be setup with
* `[setupDrawer]{@link Rac#setupDrawer}`. Currently the only available
* implementation is `[P5Drawer]{@link Rac.P5Drawer}`.
*/
class Rac {

  /**
  * Creates a new instance of Rac. The new instance has no `drawer` setup.
  */
  constructor() {

    /**
    * Version of the instance, same as `{@link Rac.version}`.
    *
    * @type {string}
    *
    * @name version
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'version', version);


    /**
    * Build of the instance, same as `{@link Rac.build}`.
    *
    * @type {string}
    *
    * @name build
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'build', build);


    /**
    * Value used to determine equality between two numeric values. Used for
    * values that tend to be integers, like screen coordinates. Used by
    * `{@link Rac#equals}`.
    *
    * When checking for equality `x` is equal to non-inclusive
    * `(x-equalityThreshold, x+equalityThreshold)`:
    * + `x` is **not equal** to `x ± equalityThreshold`
    * + `x` is **equal** to `x ± equalityThreshold/2`
    *
    * Due to floating point precision some opertation like intersections
    * can return odd or oscilating values. This threshold is used to snap
    * values too close to a limit, as to prevent oscilating efects in
    * user interaction.
    *
    * Default value is based on `1/1000` of a point.
    *
    * @type {number}
    */
    this.equalityThreshold = 0.001;



    /**
    * Value used to determine equality between two unitary numeric values.
    * Used for values that tend to exist in the `[0, 1]` range, like
    * `{@link Rac.Angle#turn}`. Used by `{@link Rac#unitaryEquals}`.
    *
    * Equality logic is the same as `{@link Rac#equalityThreshold}`.
    *
    * Default value is based on 1/000 of the turn of an arc of radius 500
    * and length of 1: `1/(500*6.28)/1000`
    *
    * @type {number}
    */
    this.unitaryEqualityThreshold = 0.0000003;

    /**
    * Drawer of the instance. This object handles the drawing of all
    * drawable object using this instance of `Rac`.
    * @type {object}
    */
    this.drawer = null;

    /**
    * Controller of the instance. This objecs handles all of the controls
    * and pointer events related to this instance of `Rac`.
    */
    this.controller = new Rac.Controller(this);


    require('./attachInstanceFunctions')(this);

    require('./style/instance.Color')     (this);
    require('./style/instance.Stroke')    (this);
    require('./style/instance.Fill')      (this);
    require('./drawable/instance.Angle')  (this);
    require('./drawable/instance.Point')  (this);
    require('./drawable/instance.Ray')    (this);
    require('./drawable/instance.Segment')(this);
    require('./drawable/instance.Arc')    (this);
    require('./drawable/instance.Bezier') (this);

    // Depends on instance.Point and instance.Angle being already setup
    require('./drawable/instance.Text')(this);
  }

  /**
  * Sets the drawer for the instance. Currently only a p5.js instance is
  * supported.
  *
  * The drawer will also populate some classes with prototype functions
  * relevant to the drawer. For p5.js this include `apply` functions for
  * colors and style object, and `vertex` functions for drawable objects.
  *
  * @param {P5} p5Instance
  */
  setupDrawer(p5Instance) {
    this.drawer = new Rac.P5Drawer(this, p5Instance)
  }


  /**
  * Returns `true` if the absolute distance between `a` and `b` is
  * under `{@link Rac#equalityThreshold}`.
  *
  * @param {number} a First number to compare
  * @param {number} b Second number to compare
  *
  * @returns {boolean}
  */
  equals(a, b) {
    if (a === null || b === null) { return false; }
    let diff = Math.abs(a-b);
    return diff < this.equalityThreshold;
  }


  /**
  * Returns `true` if the absolute distance between `a` and `b` is
  * under `{@link Rac#unitaryEqualityThreshold}`.
  *
  * @param {number} a First number to compare
  * @param {number} b Second number to compare
  *
  * @returns {boolean}
  */
  unitaryEquals(a, b) {
    if (a === null || b === null) { return false; }
    const diff = Math.abs(a-b);
    return diff < this.unitaryEqualityThreshold;
  }

} // class Rac


module.exports = Rac;


// All class (static) properties should be defined outside of the class
// as to prevent cyclic dependency with Rac.


const utils = require(`./util/utils`);
/**
* Container of utility functions. See `{@link utils}` for the available
* members.
*
* @type {object}
*/
Rac.utils = utils;


/**
* Version of the class. Same as the version used for the npm package.
*
* @type {string}
*
* @name version
* @memberof Rac
*/
utils.addConstantTo(Rac, 'version', version);


/**
* Build of the class. Intended for debugging purpouses.
*
* Contains a commit-count and short-hash of the repository when the build
* was done.
*
* @type {string}
*
* @name build
* @memberof Rac
*/
utils.addConstantTo(Rac, 'build', build);


/**
* Tau, equal to `Math.PI * 2`.
*
* [Tau Manifesto](https://tauday.com/tau-manifesto).
*
* @type {number}
*
* @name TAU
* @memberof Rac
*/
utils.addConstantTo(Rac, 'TAU', Math.PI * 2);


// Exception
Rac.Exception = require('./util/Exception');


// Prototype functions
require('./attachProtoFunctions')(Rac);


// P5Drawer
Rac.P5Drawer = require('./p5Drawer/P5Drawer');


// Color
Rac.Color = require('./style/Color');


// Stroke
Rac.Stroke = require('./style/Stroke');
Rac.setupStyleProtoFunctions(Rac.Stroke);


// Fill
Rac.Fill = require('./style/Fill');
Rac.setupStyleProtoFunctions(Rac.Fill);


// Style
Rac.Style = require('./style/Style');
Rac.setupStyleProtoFunctions(Rac.Style);


// Angle
Rac.Angle = require('./drawable/Angle');


// Point
Rac.Point = require('./drawable/Point');
Rac.setupDrawableProtoFunctions(Rac.Point);


// Ray
Rac.Ray = require('./drawable/Ray');
Rac.setupDrawableProtoFunctions(Rac.Ray);


// Segment
Rac.Segment = require('./drawable/Segment');
Rac.setupDrawableProtoFunctions(Rac.Segment);


// Arc
Rac.Arc = require('./drawable/Arc');
Rac.setupDrawableProtoFunctions(Rac.Arc);


// Text
Rac.Text = require('./drawable/Text');
Rac.setupDrawableProtoFunctions(Rac.Text);


// Bezier
Rac.Bezier = require('./drawable/Bezier');
Rac.setupDrawableProtoFunctions(Rac.Bezier);


// Composite
Rac.Composite = require('./drawable/Composite');
Rac.setupDrawableProtoFunctions(Rac.Composite);


// Shape
Rac.Shape = require('./drawable/Shape');
Rac.setupDrawableProtoFunctions(Rac.Shape);


// EaseFunction
Rac.EaseFunction = require('./util/EaseFunction');


// Controller
Rac.Controller = require('./control/Controller');


// Control
Rac.Control = require('./control/Control');


// SegmentControl
Rac.SegmentControl = require('./control/SegmentControl');


// ArcControl
Rac.ArcControl = require('./control/ArcControl');


},{"../built/version":1,"./attachInstanceFunctions":3,"./attachProtoFunctions":4,"./control/ArcControl":5,"./control/Control":6,"./control/Controller":7,"./control/SegmentControl":8,"./drawable/Angle":9,"./drawable/Arc":10,"./drawable/Bezier":11,"./drawable/Composite":12,"./drawable/Point":13,"./drawable/Ray":14,"./drawable/Segment":15,"./drawable/Shape":16,"./drawable/Text":17,"./drawable/instance.Angle":18,"./drawable/instance.Arc":19,"./drawable/instance.Bezier":20,"./drawable/instance.Point":21,"./drawable/instance.Ray":22,"./drawable/instance.Segment":23,"./drawable/instance.Text":24,"./p5Drawer/P5Drawer":26,"./style/Color":32,"./style/Fill":33,"./style/Stroke":34,"./style/Style":35,"./style/instance.Color":36,"./style/instance.Fill":37,"./style/instance.Stroke":38,"./util/EaseFunction":39,"./util/Exception":40,"./util/utils":41}],3:[function(require,module,exports){
'use strict';


const Rac = require('./Rac');


/**
* This namespace lists utility functions attached to an instance of
* `{@link Rac}` used to produce drawable and other objects, and to access
* ready-build convenience objects like `{@link instance.Angle#north}` or
* `{@link instance.Point#zero}`.
*
* Drawable and related objects require a reference to a `rac` instance in
* order to perform drawing operations. These functions build new objects
* using the calling `Rac` instance, and contain ready-made convenience
* objects that are also setup with the same `Rac` instance.
*
* @namespace instance
*/


// Attaches the convenience functions to create objects with this instance
// of Rac. These functions are attached as properties (instead of into the
// prototype) because these are later populated with more properties and
// methods, and thus need to be an independent instance.
//
// Intended to receive the a Rac instance as parameter.
module.exports = function attachInstanceFunctions(rac) {

  /**
  * Convenience function that creates a new `Color` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Color}`.
  *
  * @param {number} r
  * @param {number} g
  * @param {number} b
  * @param {number=} a
  *
  * @returns {Rac.Color}
  *
  * @see instance.Color
  *
  * @function Color
  * @memberof Rac#
  */
  rac.Color = function makeColor(r, g, b, a = 1) {
    return new Rac.Color(this, r, g, b, a);
  };


  /**
  * Convenience function that creates a new `Stroke` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Stroke}`.
  *
  * @param {?number} weight
  * @param {?Rac.Color} color
  *
  * @returns {Rac.Stroke}
  *
  * @see instance.Stroke
  *
  * @function Stroke
  * @memberof Rac#
  */
  rac.Stroke = function makeStroke(weight, color = null) {
    return new Rac.Stroke(this, weight, color);
  };


  /**
  * Convenience function that creates a new `Fill` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Fill}`.
  *
  * @param {Rac.Color=} color
  * @returns {Rac.Fill}
  *
  * @see instance.Fill
  *
  * @function Fill
  * @memberof Rac#
  */
  rac.Fill = function makeFill(color = null) {
    return new Rac.Fill(this, color);
  };


  /**
  * Convenience function that creates a new `Style` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Style}`.
  *
  * @param {?Rac.Stroke} stroke
  * @param {?Rac.Fill} fill
  *
  * @returns {Rac.Style}
  *
  * @see instance.Style
  *
  * @function Style
  * @memberof Rac#
  */
  rac.Style = function makeStyle(stroke = null, fill = null) {
    return new Rac.Style(this, stroke, fill);
  };


  /**
  * Convenience function that creates a new `Angle` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Angle}`.
  *
  * @param {number} turn - The turn value of the angle, in the range `[O,1)`
  * @returns {Rac.Angle}
  *
  * @see instance.Angle
  *
  * @function Angle
  * @memberof Rac#
  */
  rac.Angle = function makeAngle(turn) {
    return new Rac.Angle(this, turn);
  };


  /**
  * Convenience function that creates a new `Point` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Point}`.
  *
  * @param {number} x
  * @param {number} y
  *
  * @returns {Rac.Point}
  *
  * @see instance.Point
  *
  * @function Point
  * @memberof Rac#
  */
  rac.Point = function makePoint(x, y) {
    return new Rac.Point(this, x, y);
  };


  /**
  * Convenience function that creates a new `Ray` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Ray}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} angle
  *
  * @returns {Rac.Ray}
  *
  * @see instance.Ray
  *
  * @function Ray
  * @memberof Rac#
  */
  rac.Ray = function makeRay(x, y, angle) {
    const start = new Rac.Point(this, x, y);
    angle = Rac.Angle.from(this, angle);
    return new Rac.Ray(this, start, angle);
  };


  /**
  * Convenience function that creates a new `Segment` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Segment}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} angle
  * @param {number} length
  *
  * @returns {Rac.Segment}
  *
  * @see instance.Segment
  *
  * @function Segment
  * @memberof Rac#
  */
  rac.Segment = function makeSegment(x, y, angle, length) {
    const start = new Rac.Point(this, x, y);
    angle = Rac.Angle.from(this, angle);
    const ray = new Rac.Ray(this, start, angle);
    return new Rac.Segment(this, ray, length);
  };


  /**
  * Convenience function that creates a new `Arc` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Arc}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} start
  * @param {?Rac.Angle|number} [end=null]
  * @param {boolean} [clockwise=true]
  *
  * @returns {Rac.Arc}
  *
  * @see instance.Arc
  *
  * @function Arc
  * @memberof Rac#
  */
  rac.Arc = function makeArc(x, y, radius, start = this.Angle.zero, end = null, clockwise = true) {
    const center = new Rac.Point(this, x, y);
    start = Rac.Angle.from(this, start);
    end = end === null
      ? start
      : Rac.Angle.from(this, end);
    return new Rac.Arc(this, center, radius, start, end, clockwise);
  };


  /**
  * Convenience function that creates a new `Text` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Text}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {string} string
  * @param {Rac.Text.Format} format
  *
  * @returns {Rac.Text}
  *
  * @see instance.Text
  *
  * @function Text
  * @memberof Rac#
  */
  rac.Text = function makeText(x, y, string, format) {
    const point = new Rac.Point(this, x, y);
    return new Rac.Text(this, point, string, format);
  };


  /**
  * Convenience function that creates a new `Bezier` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Bezier}`.
  *
  * @param {number} startX
  * @param {number} startY
  * @param {number} startAnchorX
  * @param {number} startAnchorY
  * @param {number} endAnchorX
  * @param {number} endAnchorY
  * @param {number} endX
  * @param {number} endY
  *
  * @returns {Rac.Bezier}
  *
  * @see instance.Bezier
  *
  * @function Bezier
  * @memberof Rac#
  */
  rac.Bezier = function makeBezier(
    startX, startY, startAnchorX, startAnchorY,
    endAnchorX, endAnchorY, endX, endY)
  {
    const start = new Rac.Point(this, startX, startY);
    const startAnchor = new Rac.Point(this, startAnchorX, startAnchorY);
    const endAnchor = new Rac.Point(this, endAnchorX, endAnchorY);
    const end = new Rac.Point(this, endX, endY);
    return new Rac.Bezier(this, start, startAnchor, endAnchor, end);
  };

}; // attachInstanceFunctions


},{"./Rac":2}],4:[function(require,module,exports){
'use strict';


const utils = require('./util/utils');


// Attaches functions to attach drawing and apply methods to other
// prototypes.
// Intended to receive the Rac class as parameter.
module.exports = function attachProtoFunctions(Rac) {

  function assertDrawer(drawable) {
    if (drawable.rac == null || drawable.rac.drawer == null) {
      throw Rac.Exception.drawerNotSetup(
        `drawable-type:${utils.typeName(drawable)}`);
    }
  }


  // Container of prototype functions for drawable classes.
  Rac.drawableProtoFunctions = {};

  // Adds to the given class prototype all the functions contained in
  // `Rac.drawableProtoFunctions`. These are functions shared by all
  // drawable objects (E.g. `draw()` and `debug()`).
  Rac.setupDrawableProtoFunctions = function(classObj) {
    Object.keys(Rac.drawableProtoFunctions).forEach(name => {
      classObj.prototype[name] = Rac.drawableProtoFunctions[name];
    });
  }


  Rac.drawableProtoFunctions.draw = function(style = null){
    assertDrawer(this);
    this.rac.drawer.drawObject(this, style);
    return this;
  };


  Rac.drawableProtoFunctions.debug = function(drawsText = false){
    assertDrawer(this);
    this.rac.drawer.debugObject(this, drawsText);
    return this;
  };


  Rac.drawableProtoFunctions.log = function(message = null){
    let coalescedMessage = message ?? '%o';
    console.log(coalescedMessage, this);
    return this;
  };


  // TODO: has to be moved to rac instance
  Rac.stack = [];

  Rac.stack.peek = function() {
    return Rac.stack[Rac.stack.length - 1];
  }

  Rac.drawableProtoFunctions.push = function() {
    Rac.stack.push(this);
    return this;
  }

  Rac.drawableProtoFunctions.pop = function() {
    return Rac.stack.pop();
  }

  Rac.drawableProtoFunctions.peek = function() {
    return Rac.stack.peek();
  }

  // TODO: shape and composite should be stacks, so that several can be
  // started in different contexts
  // TODO: has to be moved to rac instance
  Rac.currentShape = null;
  Rac.currentComposite = null;

  Rac.popShape = function() {
    let shape = Rac.currentShape;
    Rac.currentShape = null;
    return shape;
  }

  Rac.popComposite = function() {
    let composite = Rac.currentComposite;
    Rac.currentComposite = null;
    return composite;
  }

  Rac.drawableProtoFunctions.attachToShape = function() {
    if (Rac.currentShape === null) {
      Rac.currentShape = new Rac.Shape(this.rac);
    }

    this.attachTo(Rac.currentShape);
    return this;
  }

  Rac.drawableProtoFunctions.popShape = function() {
    return Rac.popShape();
  }

  Rac.drawableProtoFunctions.popShapeToComposite = function() {
    let shape = Rac.popShape();
    shape.attachToComposite();
    return this;
  }

  Rac.drawableProtoFunctions.attachToComposite = function() {
    if (Rac.currentComposite === null) {
      Rac.currentComposite = new Rac.Composite(this.rac);
    }

    this.attachTo(Rac.currentComposite);
    return this;
  }

  Rac.drawableProtoFunctions.popComposite = function() {
    return Rac.popComposite();
  }

  Rac.drawableProtoFunctions.attachTo = function(someComposite) {
    if (someComposite instanceof Rac.Composite) {
      someComposite.add(this);
      return this;
    }

    if (someComposite instanceof Rac.Shape) {
      someComposite.addOutline(this);
      return this;
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot attachTo composite - someComposite-type:${utils.typeName(someComposite)}`);
  };


  // Container of prototype functions for style classes.
  Rac.styleProtoFunctions = {};

  // Adds to the given class prototype all the functions contained in
  // `Rac.styleProtoFunctions`. These are functions shared by all
  // style objects (E.g. `apply()`).
  Rac.setupStyleProtoFunctions = function(classObj) {
    Object.keys(Rac.styleProtoFunctions).forEach(name => {
      classObj.prototype[name] = Rac.styleProtoFunctions[name];
    });
  }


  Rac.styleProtoFunctions.apply = function(){
    assertDrawer(this);
    this.rac.drawer.applyObject(this);
  };

}; // attachProtoFunctions


},{"./util/utils":41}],5:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


// TODO: fix uses of someAngle


/**
* Control that uses an `Arc` as anchor.
* @alias Rac.ArcControl
*/
class ArcControl extends Rac.Control {

  // Creates a new Control instance with the given `value` and an
  // `angleDistance` from `someAngleDistance`.
  // By default the value range is [0,1] and limits are set to be the equal
  // as `startValue` and `endValue`.
  constructor(rac, value, someAngleDistance, startValue = 0, endValue = 1) {
    utils.assertExists(rac, value, someAngleDistance, startValue, endValue);

    super(rac, value, startValue, endValue);

    // Angle distance for the copied anchor object.
    this.angleDistance = Rac.Angle.from(rac, someAngleDistance);

    // `Arc`` to which the control will be anchored. When the control is
    // drawn and interacted a copy of the anchor is created with the
    // control's `angleDistance`.
    this.anchor = null;
  }

  setValueWithAngleDistance(someAngleDistance) {
    let angleDistance = Rac.Angle.from(this.rac, someAngleDistance)
    let angleDistanceRatio = angleDistance.turn / this.angleDistance.turnOne();
    this.value = this.valueOf(angleDistanceRatio);
  }

  setLimitsWithAngleDistanceInsets(startInset, endInset) {
    startInset = Rac.Angle.from(this.rac, startInset);
    endInset = Rac.Angle.from(this.rac, endInset);
    this.startLimit = this.valueOf(startInset.turn / this.angleDistance.turnOne());
    this.endLimit = this.valueOf((this.angleDistance.turnOne() - endInset.turn) / this.angleDistance.turnOne());
  }

  // Returns the angle distance from `anchor.start` to the control center.
  distance() {
    return this.angleDistance.multOne(this.ratioValue());
  }

  // TODO: rename control.center to control.knob or similar
  center() {
    // Not posible to calculate a center
    if (this.anchor === null) { return null; }
    return this.anchor.withAngleDistance(this.distance()).endPoint();
  }

  // Creates a copy of the current `anchor` with the control's
  // `angleDistance`.
  copyAnchor() {
    // No anchor to copy
    if (this.anchor === null) { return null; }
    return this.anchor.withAngleDistance(this.angleDistance);
  }

  draw() {
    let anchorCopy = this.copyAnchor();

    let anchorStyle = this.style !== null
      ? this.style.withFill(this.rac.Fill.none)
      : null;
    anchorCopy.draw(anchorStyle);

    let center = this.center();
    let angle = anchorCopy.center.angleToPoint(center);

    // Value markers
    this.markers.forEach(item => {
      let markerRatio = this.ratioOf(item);
      if (markerRatio < 0 || markerRatio > 1) { return }
      let markerAngleDistance = this.angleDistance.multOne(markerRatio);
      let markerAngle = anchorCopy.shiftAngle(markerAngleDistance);
      let point = anchorCopy.pointAtAngle(markerAngle);
      Rac.Control.makeValueMarker(this.rac, point, markerAngle.perpendicular(!anchorCopy.clockwise))
        .attachToComposite();
    }, this);

    // Control button
    center.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    let ratioValue = this.ratioValue();

    // Negative arrow
    if (ratioValue >= this.ratioStartLimit() + this.rac.unitaryEqualityThreshold) {
      let negAngle = angle.perpendicular(anchorCopy.clockwise).inverse();
      Rac.Control.makeArrowShape(this.rac, center, negAngle)
        .attachToComposite();
    }

    // Positive arrow
    if (ratioValue <= this.ratioEndLimit() - this.rac.unitaryEqualityThreshold) {
      let posAngle = angle.perpendicular(anchorCopy.clockwise);
      Rac.Control.makeArrowShape(this.rac, center, posAngle)
        .attachToComposite();
    }

    Rac.popComposite().draw(this.style);

    // Selection
    if (this.isSelected()) {
      center.arc(this.rac.controller.knobRadius * 1.5).draw(this.rac.controller.pointerStyle);
    }
  }

  updateWithPointer(pointerControlCenter, anchorCopy) {
    let angleDistance = anchorCopy.angleDistance();
    let startInset = angleDistance.multOne(this.ratioStartLimit());
    let endInset = angleDistance.multOne(1 - this.ratioEndLimit());

    let selectionAngle = anchorCopy.center
      .angleToPoint(pointerControlCenter);
    selectionAngle = anchorCopy.clampToAngles(selectionAngle,
      startInset, endInset);
    let newDistance = anchorCopy.distanceFromStart(selectionAngle);

    // Update control with new distance
    let lengthRatio = newDistance.turn / this.angleDistance.turnOne();
    this.value = this.valueOf(lengthRatio);
  }

  drawSelection(pointerCenter, anchorCopy, pointerOffset) {
    anchorCopy.attachToComposite();

    let angleDistance = anchorCopy.angleDistance();

    // Value markers
    this.markers.forEach(item => {
      let markerRatio = this.ratioOf(item);
      if (markerRatio < 0 || markerRatio > 1) { return }
      let markerAngle = anchorCopy.shiftAngle(angleDistance.multOne(markerRatio));
      let markerPoint = anchorCopy.pointAtAngle(markerAngle);
      Rac.Control.makeValueMarker(this.rac, markerPoint, markerAngle.perpendicular(!anchorCopy.clockwise))
        .attachToComposite();
    });

    // Limit markers
    let ratioStartLimit = this.ratioStartLimit();
    if (ratioStartLimit > 0) {
      let minAngle = anchorCopy.shiftAngle(angleDistance.multOne(ratioStartLimit));
      let minPoint = anchorCopy.pointAtAngle(minAngle);
      let markerAngle = minAngle.perpendicular(anchorCopy.clockwise);
      Rac.Control.makeLimitMarker(this.rac, minPoint, markerAngle)
        .attachToComposite();
    }

    let ratioEndLimit = this.ratioEndLimit();
    if (ratioEndLimit < 1) {
      let maxAngle = anchorCopy.shiftAngle(angleDistance.multOne(ratioEndLimit));
      let maxPoint = anchorCopy.pointAtAngle(maxAngle);
      let markerAngle = maxAngle.perpendicular(!anchorCopy.clockwise);
      Rac.Control.makeLimitMarker(this.rac, maxPoint, markerAngle)
        .attachToComposite();
    }

    // Segment from pointer to control dragged center
    let draggedCenter = pointerOffset
      .withStartPoint(pointerCenter)
      .endPoint();

    // Control dragged center, attached to pointer
    draggedCenter.arc(2)
      .attachToComposite();

    // TODO: implement arc control dragging visuals!

    Rac.popComposite().draw(this.rac.controller.pointerStyle);
  }

} // class ArcControl


module.exports = ArcControl;


},{"../Rac":2,"../util/utils":41}],6:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


// TODO: fix uses of someAngle


/**
* Parent class for all controls for manipulating a value with the pointer.
* Represents a control with a value, value-range, limits, markers, and
* drawing style. By default the control returns a `value` in the range
* [0,1] coresponding to the location of the control center in relation to
* the anchor shape. The value-range is defined by `startValue` and
* `endValue`.
* @alias Rac.Control
*/
class Control {

  // Creates a new Control instance with the given `value`, a default
  // value-range of [0,1], and limits set equal to the value-range.
  constructor(rac, value, startValue = 0, endValue = 1) {
    utils.assertExists(rac, value, startValue, endValue);

    this.rac = rac;

    // Value is a number between startValue and endValue.
    this.value = value;

    // Start and end of the value range.
    this.startValue = startValue;
    this.endValue = endValue;

    // Limits to which the control can be dragged. Interpreted as values in
    // the value-range.
    this.startLimit = startValue;
    this.endLimit = endValue;

    // Collection of values at which markers are drawn.
    this.markers = [];

    this.style = null;
  }

  // Returns the `value` of the control in a [0,1] range.
  ratioValue() {
    return this.ratioOf(this.value);
  }

  // Returns the `startLimit` of the control in a [0,1] range.
  ratioStartLimit() {
    return this.ratioOf(this.startLimit);
  }

  // Returns the `endLimit` of the control in a [0,1] range.
  ratioEndLimit() {
    return this.ratioOf(this.endLimit);
  }

  // Returns the equivalent of the given `value` in a [0,1] range.
  ratioOf(value) {
    return (value - this.startValue) / this.valueRange();
  }

  // Returns the equivalent of the given ratio in the range [0,1] to a value
  // in the value range.
  valueOf(ratio) {
    return (ratio * this.valueRange()) + this.startValue;
  }

  valueRange() {
    return this.endValue - this.startValue;
  }

  // Sets `startLimit` and `endLimit` with two inset values relative to
  // `startValue` and `endValue`.
  setLimitsWithValueInsets(startInset, endInset) {
    let rangeDirection = this.valueRange() >= 0 ? 1 : -1;

    this.startLimit = this.startValue + (startInset * rangeDirection);
    this.endLimit = this.endValue - (endInset * rangeDirection);
  }

  // Sets `startLimit` and `endLimit` with two inset values relative to the
  // [0,1] range.
  setLimitsWithRatioInsets(startInset, endInset) {
    this.startLimit = this.valueOf(startInset);
    this.endLimit = this.valueOf(1 - endInset);
  }

  // Adds a marker at the current `value`.
  addMarkerAtCurrentValue() {
    this.markers.push(this.value);
  }

  // Returns `true` if this control is the currently selected control.
  isSelected() {
    if (this.rac.controller.selection === null) {
      return false;
    }
    return this.rac.controller.selection.control === this;
  }

  // Abstract function.
  // Returns the center of the control hitpoint.
  center() {
    console.trace(`Abstract function called - this-type:${utils.typeName(this)}`);
    throw rac.Error.abstractFunctionCalled;
  }

  // Abstract function.
  // Returns the persistent copy of the control anchor to be used during
  // user interaction.
  copyAnchor() {
    console.trace(`Abstract function called - this-type:${utils.typeName(this)}`);
    throw rac.Error.abstractFunctionCalled;
  }

  // Abstract function.
  // Draws the current state of the control.
  draw() {
    console.trace(`Abstract function called - this-type:${utils.typeName(this)}`);
    throw rac.Error.abstractFunctionCalled;
  }

  // Abstract function.
  // Updates the control value with `pointerControlCenter` in relation to
  // `anchorCopy`. Called by `pointerDragged` as the user interacts with a
  // selected control.
  updateWithPointer(pointerControlCenter, anchorCopy) {
    console.trace(`Abstract function called - this-type:${utils.typeName(this)}`);
    throw rac.Error.abstractFunctionCalled;
  }

  // Abstract function.
  // Draws the selection state for the control, along with pointer
  // interaction visuals. Called by `drawControls` for the currently
  // selected control.
  drawSelection(pointerCenter, anchorCopy, pointerOffset) {
    console.trace(`Abstract function called - this-type:${utils.typeName(this)}`);
    throw rac.Error.abstractFunctionCalled;
  }

} // class Control


module.exports = Control;


// Controls shared drawing elements

Control.makeArrowShape = function(rac, center, angle) {
  // Arc
  let angleDistance = rac.Angle.from(1/22);
  let arc = center.arc(rac.controller.knobRadius * 1.5,
    angle.subtract(angleDistance), angle.add(angleDistance));

  // Arrow walls
  let pointAngle = rac.Angle.from(1/8);
  let rightWall = arc.startPoint().ray(angle.add(pointAngle));
  let leftWall = arc.endPoint().ray(angle.subtract(pointAngle));

  // Arrow point
  let point = rightWall.pointAtIntersection(leftWall);

  // Shape
  let arrow = new Rac.Shape(rac);
  point.segmentToPoint(arc.startPoint())
    .attachTo(arrow);
  arc.attachTo(arrow)
    .endPoint().segmentToPoint(point)
    .attachTo(arrow);

    return arrow;
};

Control.makeLimitMarker = function(rac, point, someAngle) {
  let angle = rac.Angle.from(someAngle);
  let perpendicular = angle.perpendicular(false);
  let composite = new Rac.Composite(rac);

  point.segmentToAngle(perpendicular, 4)
    .withStartExtended(4)
    .attachTo(composite);
  point.pointToAngle(perpendicular, 8).arc(3)
    .attachTo(composite);

  return composite;
};

Control.makeValueMarker = function(rac, point, someAngle) {
  let angle = rac.Angle.from(someAngle);
  return point.segmentToAngle(angle.perpendicular(), 3)
    .withStartExtended(3);
};


},{"../Rac":2,"../util/utils":41}],7:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Information regarding the currently selected `Control`.
* @alias Rac.Controller.Selection
*/
class ControlSelection{
  constructor(control, pointerCenter) {
    // Selected control instance.
    this.control = control;
    // Copy of the control anchor, so that the control can move tied to
    // the drawing, while the interaction range remains fixed.
    this.anchorCopy = control.copyAnchor();
    // Segment from the captured pointer position to the contro center,
    // used to attach the control to the point where interaction started.
    // Pointer is at `segment.start` and control center is at `segment.end`.
    this.pointerOffset = pointerCenter.segmentToPoint(control.center());
  }

  drawSelection(pointerCenter) {
    this.control.drawSelection(pointerCenter, this.anchorCopy, this.pointerOffset);
  }
}


/**
* The `Controller` is the object that manages the control system for an
* instance of `Rac`.
*
* This instance holds control settings like pointer style or the
* knob radius. It also mantains the state of the control system, like the
* currently selected control, last pointer, and the collection of all
* available controls.
*
* @alias Rac.Controller
*/
class Controller {

  static Selection = ControlSelection;


  /**
  * Builds a new `Controller` with the given `Rac` instance.
  */
  constructor(rac) {

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * Distance at which the pointer is considered to interact with a
    * control knob. Also used by controls for drawing.
    *
    * @type {number}
    */
    this.knobRadius = 22;

    // Collection of all controls that are drawn with `drawControls()`
    // and evaluated for selection with the `pointer...()` functions.
    this.controls = [];

    // Last `Point` of the position when the pointer was pressed, or last
    // Control interacted with. Set to `null` when there has been no
    // interaction yet and while there is a selected control.
    // TODO: separate lastControl from lastPointer
    this.lastPointer = null;

    // Style used for visual elements related to selection and pointer
    // interaction.
    this.pointerStyle = null;

    /**
    * Selection information for the currently selected control, or `null`
    * when there is no selection.
    * @type {?Rac.Controller.Selection}
    */
    this.selection = null;

  } // constructor


  // Call to signal the pointer being pressed. If the ponter hits a control
  // it will be considered selected. When a control is selected a copy of its
  // anchor is stored as to allow interaction with a fixed anchor.
  pointerPressed(pointerCenter) {
    this.lastPointer = null;

    // Test pointer hit
    const selected = this.controls.find( item => {
      const controlCenter = item.center();
      if (controlCenter === null) { return false; }
      if (controlCenter.distanceToPoint(pointerCenter) <= this.knobRadius) {
        return true;
      }
      return false;
    });

    if (selected === undefined) {
      return;
    }

    this.selection = new Controller.Selection(selected, pointerCenter);
  }


  // Call to signal the pointer being dragged. As the pointer moves the
  // selected control is updated with a new `distance`.
  pointerDragged(pointerCenter){
    if (this.selection === null) {
      return;
    }

    let control = this.selection.control;
    let anchorCopy = this.selection.anchorCopy;

    // Center of dragged control in the pointer current position
    let currentPointerControlCenter = this.selection.pointerOffset
      .withStartPoint(pointerCenter)
      .endPoint();

    control.updateWithPointer(currentPointerControlCenter, anchorCopy);
  }


  // Call to signal the pointer being released. Upon release the selected
  // control is cleared.
  pointerReleased(pointerCenter) {
    if (this.selection === null) {
      this.lastPointer = pointerCenter;
      return;
    }

    this.lastPointer = this.selection.control;
    this.selection = null;
  }


  // Draws controls and the visuals of pointer and control selection. Usually
  // called at the end of `draw` so that controls sits on top of the drawing.
  drawControls() {
    let pointerStyle = this.pointerStyle;

    // Last pointer or control
    if (this.lastPointer instanceof Rac.Point) {
      this.lastPointer.arc(12).draw(pointerStyle);
    }
    if (this.lastPointer instanceof Rac.Control) {
      // TODO: implement last selected control state
    }

    // Pointer pressed
    let pointerCenter = this.rac.Point.pointer();
    if (this.rac.drawer.p5.mouseIsPressed) {
      if (this.selection === null) {
        pointerCenter.arc(10).draw(pointerStyle);
      } else {
        pointerCenter.arc(5).draw(pointerStyle);
      }
    }

    // All controls in display
    this.controls.forEach(item => item.draw());

    if (this.selection !== null) {
      this.selection.drawSelection(pointerCenter);
    }
  }


} // class Controller


module.exports = Controller;


},{"../Rac":2,"../util/utils":41}],8:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Control that uses a `Segment` as anchor.
* @alias Rac.SegmentControl
*/
class SegmentControl extends Rac.Control {

  // Creates a new Control instance with the given `value` and `length`.
  // By default the value range is [0,1] and limits are set to be the equal
  // as `startValue` and `endValue`.
  constructor(rac, value, length, startValue = 0, endValue = 1) {
    utils.assertExists(rac, value, length, startValue, endValue);

    super(rac, value, startValue, endValue);

    // Length for the copied anchor shape.
    this.length = length;

    // Segment to which the control will be anchored. When the control is
    // drawn and interacted a copy of the anchor is created with the
    // control's `length`.
    this.anchor = null;
  }

  setValueWithLength(lengthValue) {
    let lengthRatio = lengthValue / this.length;
    this.value = this.valueOf(lengthRatio);
  }

  // Sets `startLimit` and `endLimit` with two inset values relative to
  // zero and `length`.
  setLimitsWithLengthInsets(startInset, endInset) {
    this.startLimit = this.valueOf(startInset / this.length);
    this.endLimit = this.valueOf((this.length - endInset) / this.length);
  }


  // Returns the distance from `anchor.start` to the control center.
  distance() {
    return this.length * this.ratioValue();
  }

  center() {
    // Not posible to calculate a center
    if (this.anchor === null) { return null; }
    return this.anchor.withLength(this.distance()).endPoint();
  }

  // Creates a copy of the current `anchor` with the control `length`.
  copyAnchor() {
    // No anchor to copy
    if (this.anchor === null) { return null; }
    return this.anchor.withLength(this.length);
  }

  draw() {
    let anchorCopy = this.copyAnchor();
    anchorCopy.draw(this.style);

    let center = this.center();
    let angle = anchorCopy.angle();

    // Value markers
    this.markers.forEach(item => {
      let markerRatio = this.ratioOf(item);
      if (markerRatio < 0 || markerRatio > 1) { return }
      let point = anchorCopy.start.pointToAngle(angle, this.length * markerRatio);
      Rac.Control.makeValueMarker(this.rac, point, angle)
        .attachToComposite();
    }, this);

    // Control button
    center.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    let ratioValue = this.ratioValue();

    // Negative arrow
    if (ratioValue >= this.ratioStartLimit() + this.rac.unitaryEqualityThreshold) {
      Rac.Control.makeArrowShape(this.rac, center, angle.inverse())
        .attachToComposite();
    }

    // Positive arrow
    if (ratioValue <= this.ratioEndLimit() - this.rac.unitaryEqualityThreshold) {
      Rac.Control.makeArrowShape(this.rac, center, angle)
        .attachToComposite();
    }

    Rac.popComposite().draw(this.style);

    // Selection
    if (this.isSelected()) {
      center.arc(this.rac.controller.knobRadius * 1.5).draw(this.rac.controller.pointerStyle);
    }
  }

  updateWithPointer(pointerControlCenter, anchorCopy) {
    let length = anchorCopy.length;
    let startInset = length * this.ratioStartLimit();
    let endInset = length * (1 - this.ratioEndLimit());

    // New value from the current pointer position, relative to anchorCopy
    let newDistance = anchorCopy
      .ray.distanceToProjectedPoint(pointerControlCenter);
    // Clamping value (javascript has no Math.clamp)
    newDistance = anchorCopy.clampToLength(newDistance,
      startInset, endInset);

    // Update control with new distance
    let lengthRatio = newDistance / length;
    this.value = this.valueOf(lengthRatio);
  }

  drawSelection(pointerCenter, anchorCopy, pointerOffset) {
    anchorCopy.attachToComposite();

    let angle = anchorCopy.angle();
    let length = anchorCopy.length;

    // Value markers
    this.markers.forEach(item => {
      let markerRatio = this.ratioOf(item);
      if (markerRatio < 0 || markerRatio > 1) { return }
      let markerPoint = anchorCopy.start.pointToAngle(angle, length * markerRatio);
      Rac.Control.makeValueMarker(this.rac, markerPoint, angle)
        .attachToComposite();
    });

    // Limit markers
    let ratioStartLimit = this.ratioStartLimit();
    if (ratioStartLimit > 0) {
      let minPoint = anchorCopy.start.pointToAngle(angle, length * ratioStartLimit);
      Rac.Control.makeLimitMarker(this.rac, minPoint, angle)
        .attachToComposite();
    }

    let ratioEndLimit = this.ratioEndLimit();
    if (ratioEndLimit < 1) {
      let maxPoint = anchorCopy.start.pointToAngle(angle, length * ratioEndLimit);
      Rac.Control.makeLimitMarker(this.rac, maxPoint, angle.inverse())
        .attachToComposite();
    }

    // Segment from pointer to control dragged center
    let draggedCenter = pointerOffset
      .withStartPoint(pointerCenter)
      .endPoint();

    // Control dragged center, attached to pointer
    draggedCenter.arc(2)
      .attachToComposite();

    // Constrained length clamped to limits
    let constrainedLength = anchorCopy
      .ray.distanceToProjectedPoint(draggedCenter);
    let startInset = length * ratioStartLimit;
    let endInset = length * (1 - ratioEndLimit);
    constrainedLength = anchorCopy.clampToLength(constrainedLength,
      startInset, endInset);

    let constrainedAnchorCenter = anchorCopy
      .withLength(constrainedLength)
      .endPoint();

    // Control center constrained to anchor
    constrainedAnchorCenter.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    // Dragged shadow center, semi attached to pointer
    // always perpendicular to anchor
    let draggedShadowCenter = draggedCenter
      .segmentToProjectionInRay(anchorCopy.ray)
      // reverse and translated to constraint to anchor
      .reverse()
      .withStartPoint(constrainedAnchorCenter)
      // Segment from constrained center to shadow center
      .attachToComposite()
      .endPoint();

    // Control shadow center
    draggedShadowCenter.arc(this.rac.controller.knobRadius / 2)
      .attachToComposite();

    // Ease for segment to dragged shadow center
    let easeOut = Rac.EaseFunction.makeEaseOut();
    easeOut.postBehavior = Rac.EaseFunction.Behavior.clamp;

    // Tail will stop stretching at 2x the max tail length
    let maxDraggedTailLength = this.rac.controller.knobRadius * 5;
    easeOut.inRange = maxDraggedTailLength * 2;
    easeOut.outRange = maxDraggedTailLength;

    // Segment to dragged shadow center
    let draggedTail = draggedShadowCenter
      .segmentToPoint(draggedCenter);

    let easedLength = easeOut.easeValue(draggedTail.length);
    draggedTail.withLength(easedLength).attachToComposite();

    // Draw all!
    Rac.popComposite().draw(this.rac.controller.pointerStyle);
  }

} // class SegmentControl


module.exports = SegmentControl;


},{"../Rac":2,"../util/utils":41}],9:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Angle measured by a `turn` value in the range *[0,1)* that represents the
* amount of turn in a full circle.
*
* Most functions through RAC that can receive an `Angle` parameter can
* also receive a `number` value that will be used as `turn` to instantiate
* a new `Angle`. The main exception to this behaviour are constructors,
* which always expect to receive `Angle` objects.
*
* For drawing operations the turn value is interpreted to be pointing to
* the following directions:
* + `0/4` - points right
* + `1/4` - points downwards
* + `2/4` - points left
* + `3/4` - points upwards
*
* @alias Rac.Angle
*/
class Angle {

  /**
  * Creates a new `Angle` instance.
  *
  * The `turn` value is constrained to the rance *[0,1)*, any value
  * outside is reduced back into range using a modulo operation.
  *
  * ```
  * new Rac.Angle(rac, 1/4)  // turn is 1/4
  * new Rac.Angle(rac, 5/4)  // turn is 1/4
  * new Rac.Angle(rac, -1/4) // turn is 3/4
  * new Rac.Angle(rac, 1)    // turn is 0
  * new Rac.Angle(rac, 4)    // turn is 0
  * ```
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} turn - The turn value
  */
  constructor(rac, turn) {
    utils.assertExists(rac);
    utils.assertNumber(turn);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    turn = turn % 1;
    if (turn < 0) {
      turn = (turn + 1) % 1;
    }

    /**
    * Turn value of the angle, constrained to the range *[0,1)*.
    * @type {number}
    */
    this.turn = turn;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const turnStr = utils.cutDigits(this.turn, digits);
    return `Angle(${turnStr})`;
  }


  /**
  * Returns `true` when the difference with the `turn` value of the angle
  * derived [from]{@link Rac.Angle.from} `angle` is under
  * `{@link Rac#unitaryEqualityThreshold}`, otherwise returns `false`.
  *
  * For this method `otherAngle` can only be `Angle` or `number`, any other
  * type returns `false`.
  *
  * This method will consider turn values in the oposite ends of the range
  * *[0,1)* as equals. E.g. `Angle` objects with `turn` values of `0` and
  * `1 - rac.unitaryEqualityThreshold/2` will be considered equal.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to compare
  * @returns {boolean}
  */
  equals(otherAngle) {
    if (otherAngle instanceof Rac.Angle) {
      // all good!
    } else if (typeof otherAngle === 'number') {
      otherAngle = Angle.from(this.rac, otherAngle);
    } else {
      return false;
    }

    const diff = Math.abs(this.turn - otherAngle.turn);
    return diff < this.rac.unitaryEqualityThreshold
      // For close values that loop around
      || (1 - diff) < this.rac.unitaryEqualityThreshold;
  }


  /**
  * Returns an `Angle` derived from `something`.
  *
  * + When `something` is an instance of `Angle`, returns that same object.
  * + When `something` is a `number`, returns a new `Angle` with
  *   `something` as `turn`.
  * + When `something` is a `{@link Rac.Ray}`, returns its angle.
  * + When `something` is a `{@link Rac.Segment}`, returns its angle.
  * + Otherwise an error is thrown.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {Rac.Angle|Rac.Ray|Rac.Segment|number} something - An object to
  * derive an `Angle` from
  * @returns {Rac.Angle}
  */
  static from(rac, something) {
    if (something instanceof Rac.Angle) {
      return something;
    }
    if (typeof something === 'number') {
      return new Angle(rac, something);
    }
    if (something instanceof Rac.Ray) {
      return something.angle;
    }
    if (something instanceof Rac.Segment) {
      return something.ray.angle;
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Angle - something-type:${utils.typeName(something)}`);
  }


  /**
  * Returns an `Angle` derived from `radians`.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  */
  static fromRadians(rac, radians) {
    return new Angle(rac, radians / Rac.TAU);
  }


  /**
  * Returns an `Angle` derived from `degrees`.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {number} degrees - The measure of the angle, in degrees
  * @returns {Rac.Angle}
  */
  static fromDegrees(rac, degrees) {
    return new Angle(rac, degrees / 360);
  }


  /**
  * Returns a new `Angle` pointing in the opposite direction to `this`.
  * ```
  * rac.Angle(1/8).inverse() // turn is 1/8 + 1/2 = 5/8
  * rac.Angle(7/8).inverse() // turn is 7/8 + 1/2 = 3/8
  * ```
  *
  * @returns {Rac.Angle}
  */
  inverse() {
    return this.add(this.rac.Angle.inverse);
  }


  /**
  * Returns a new `Angle` with a turn value equivalent to `-turn`.
  * ```
  * rac.Angle(1/4).negative() // -1/4 becomes turn 3/4
  * rac.Angle(3/8).negative() // -3/8 becomes turn 5/8
  * ```
  *
  * @returns {Rac.Angle}
  */
  negative() {
    return new Angle(this.rac, -this.turn);
  }


  /**
  * Returns a new `Angle` which is perpendicular to `this` in the
  * `clockwise` orientation.
  * ```
  * rac.Angle(1/8).perpendicular(true)  // turn is 1/8 + 1/4 = 3/8
  * rac.Angle(1/8).perpendicular(false) // turn is 1/8 - 1/4 = 7/8
  * ```
  *
  * @returns {Rac.Angle}
  */
  perpendicular(clockwise = true) {
    return this.shift(this.rac.Angle.square, clockwise);
  }


  /**
  * Returns the measure of the angle in radians.
  *
  * @returns {number}
  */
  radians() {
    return this.turn * Rac.TAU;
  }


  /**
  * Returns the measure of the angle in degrees.
  *
  * @returns {number}
  */
  degrees() {
    return this.turn * 360;
  }


  /**
  * Returns the sine of `this`.
  *
  * @returns {number}
  */
  sin() {
    return Math.sin(this.radians())
  }


  /**
  * Returns the cosine of `this`.
  *
  * @returns {number}
  */
  cos() {
    return Math.cos(this.radians())
  }


  /**
  * Returns the tangent of `this`.
  *
  * @returns {number}
  */
  tan() {
    return Math.tan(this.radians())
  }


  /**
  * Returns the `turn` value in the range `(0, 1]`. When `turn` is equal to
  * `0` returns `1` instead.
  *
  * @returns {number}
  */
  turnOne() {
    if (this.turn === 0) { return 1; }
    return this.turn;
  }


  /**
  * Returns a new `Angle` with the sum of `this` and the angle derived from
  * `angle`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to add
  * @returns {Rac.Angle}
  */
  add(angle) {
    angle = this.rac.Angle.from(angle);
    return new Angle(this.rac, this.turn + angle.turn);
  }


  /**
  * Returns a new `Angle` with the angle derived from `angle`
  * subtracted to `this`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to subtract
  * @returns {Rac.Angle}
  */
  subtract(angle) {
    angle = this.rac.Angle.from(angle);
    return new Angle(this.rac, this.turn - angle.turn);
  }


  /**
  * Returns a new `Angle` with `turn`` set to `this.turn * factor`.
  *
  * @param {number} factor - The factor to multiply `turn` by
  * @returns {Rac.Angle}
  */
  mult(factor) {
    return new Angle(this.rac, this.turn * factor);
  }


  /**
  * Returns a new `Angle` with `turn` set to
  * `{@link Rac.Angle#turnOne this.turnOne()} * factor`.
  *
  * Useful when doing ratio calculations where a zero angle corresponds to
  * a complete-circle since:
  * ```
  * rac.Angle(0).mult(0.5)    // turn is 0
  * // whereas
  * rac.Angle(0).multOne(0.5) // turn is 0.5
  * ```
  *
  * @param {number} factor - The factor to multiply `turn` by
  * @returns {number}
  */
  multOne(factor) {
    return new Angle(this.rac, this.turnOne() * factor);
  }

  /**
  * Returns a new `Angle` that represents the distance from `this` to the
  * angle derived from `angle`.
  * ```
  * rac.Angle(1/4).distance(1/2, true)  // turn is 1/2
  * rac.Angle(1/4).distance(1/2, false) // turn in 3/4
  * ```
  *
  * @param {Rac.Angle|number} angle - An `Angle` to measure the distance to
  * @param {boolean} [clockwise=true] - The orientation of the measurement
  * @returns {Rac.Angle}
  */
  distance(angle, clockwise = true) {
    angle = this.rac.Angle.from(angle);
    const distance = angle.subtract(this);
    return clockwise
      ? distance
      : distance.negative();
  }

  /**
  * Returns a new `Angle` result of shifting the angle derived from
  * `angle` to have `this` as its origin.
  *
  * This operation is the equivalent to
  * + `this.add(angle)` when clockwise
  * + `this.subtract(angle)` when counter-clockwise
  *
  * ```
  * rac.Angle(0.1).shift(0.3, true)  // turn is 0.1 + 0.3 = 0.4
  * rac.Angle(0.1).shift(0.3, false) // turn is 0.1 - 0.3 = 0.8
  * ```
  *
  * @param {Rac.Angle|number} angle - An `Angle` to be shifted
  * @param {boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Angle}
  */
  shift(angle, clockwise = true) {
    angle = this.rac.Angle.from(angle);
    return clockwise
      ? this.add(angle)
      : this.subtract(angle);
  }


  /**
  * Returns a new `Angle` result of shifting `this` to have the angle
  * derived from `origin` as its origin.
  *
  * The result of `angle.shiftToOrigin(origin)` is equivalent to
  * `origin.shift(angle)`.
  *
  * This operation is the equivalent to
  * + `origin.add(this)` when clockwise
  * + `origin.subtract(this)` when counter-clockwise
  *
  * ```
  * rac.Angle(0.1).shiftToOrigin(0.3, true)  // turn is 0.3 + 0.1 = 0.4
  * rac.Angle(0.1).shiftToOrigin(0.3, false) // turn is 0.3 - 0.1 = 0.2
  * ```
  *
  * @param {Rac.Angle|number} origin - An `Angle` to use as origin
  * @param {boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Angle}
  */
  shiftToOrigin(origin, clockwise) {
    origin = this.rac.Angle.from(origin);
    return origin.shift(this, clockwise);
  }

} // class Angle


module.exports = Angle;


},{"../Rac":2,"../util/utils":41}],10:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');



/**
* Arc of a circle from a `start` to an `end` [angle]{@link Rac.Angle}.
*
* Arcs that have [equal]{@link Rac.Angle#equals} `start` and `end` angles
* are considered a complete circle.
*
* @alias Rac.Arc
*/
class Arc{

  /**
  * Creates a new `Arc` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Rac.Point} center - The center of the arc
  * @param {number} radius - The radius of the arc
  * @param {Rac.Angle} start - An `Angle` where the arc starts
  * @param {Rac.Angle} end - Ang `Angle` where the arc ends
  * @param {boolean} clockwise - The orientation of the arc
  */
  constructor(rac,
    center, radius,
    start, end,
    clockwise)
  {
    utils.assertExists(rac, center, radius, start, end, clockwise);
    utils.assertType(Rac.Point, center);
    utils.assertNumber(radius);
    utils.assertType(Rac.Angle, start, end);
    utils.assertBoolean(clockwise);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The center `Point` of the arc.
    * @type {Rac.Point}
    */
    this.center = center;

    /**
    * The radius of the arc.
    * @type {number}
    */
    this.radius = radius;

    /**
    * The start `Angle` of the arc. The arc is draw from this angle towards
    * `end` in the `clockwise` orientation.
    *
    * When `start` and `end` are [equal angles]{@link Rac.Angle#equals}
    * the arc is considered a complete circle.
    *
    * @type {Rac.Angle}
    * @see Rac.Angle#equals
    */
    this.start = start

    /**
    * The end `Angle` of the arc. The arc is draw from `start` to this
    * angle in the `clockwise` orientation.
    *
    * When `start` and `end` are [equal angles]{@link Rac.Angle#equals}
    * the arc is considered a complete circle.
    *
    * @type {Rac.Angle}
    * @see Rac.Angle#equals
    */
    this.end = end;

    /**
    * The orientiation of the arc.
    * @type {boolean}
    */
    this.clockwise = clockwise;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const xStr      = utils.cutDigits(this.center.x,   digits);
    const yStr      = utils.cutDigits(this.center.y,   digits);
    const radiusStr = utils.cutDigits(this.radius,     digits);
    const startStr  = utils.cutDigits(this.start.turn, digits);
    const endStr    = utils.cutDigits(this.end.turn,   digits);
    return `Arc((${xStr},${yStr}) r:${radiusStr} s:${startStr} e:${endStr} c:${this.clockwise}})`;
  }


  /**
  * Returns `true` when all members of both arcs are equal.
  *
  * When `otherArc` is any class other that `Rac.Arc`, returns `false`.
  *
  * Arcs' `radius` are compared using `{@link Rac#equals}`.
  *
  * @param {Rac.Segment} otherSegment - A `Segment` to compare
  * @returns {boolean}
  * @see Rac.Point#equals
  * @see Rac.Angle#equals
  * @see Rac#equals
  */
  equals(otherArc) {
    return otherArc instanceof Arc
      && this.rac.equals(this.radius, otherArc.radius)
      && this.clockwise === otherArc.clockwise
      && this.center.equals(otherArc.center)
      && this.start.equals(otherArc.start)
      && this.end.equals(otherArc.end);
  }


  /**
  * Returns the length of the arc: the part of the circumference the arc
  * represents.
  * @returns {number}
  */
  length() {
    return this.angleDistance().turnOne() * this.radius * Rac.TAU;
  }


  /**
  * Returns the length of circumference of the arc considered as a complete
  * circle.
  * @returns {number}
  */
  circumference() {
    return this.radius * Rac.TAU;
  }


  /**
  * Returns a new `Angle` that represents the distance between `start` and
  * `end`, in the orientation of the arc.
  * @returns {Rac.Angle}
  */
  angleDistance() {
    return this.start.distance(this.end, this.clockwise);
  }


  /**
  * Returns a new `Point` located where the arc starts.
  * @returns {Rac.Point}
  */
  startPoint() {
    return this.pointAtAngle(this.start);
  }


  /**
  * Returns a new `Point` located where the arc ends.
  * @returns {Rac.Point}
  */
  endPoint() {
    return this.pointAtAngle(this.end);
  }


  /**
  * Returns a new `Ray` from `center` towars `start`.
  * @returns {Rac.Ray}
  */
  startRay() {
    return new Rac.Ray(this.rac, this.center, this.start);
  }


  /**
  * Returns a new `Ray` from `center` towars `end`.
  * @returns {Rac.Ray}
  */
  endRay() {
    return new Rac.Ray(this.rac, this.center, this.end);
  }


  /**
  * Returns a new `Segment` from `center` to `startPoint()`.
  * @returns {Rac.Segment}
  */
  startSegment() {
    return new Rac.Segment(this.rac, this.startRay(), this.radius);
  }


  /**
  * Returns a new `Segment` from `center` to `endPoint()`.
  * @returns {Rac.Segment}
  */
  endSegment() {
    return new Rac.Segment(this.rac, this.endRay(), this.radius);
  }


  /**
  * Returns a new `Segment` from `startPoint()` to `endPoint()`.
  *
  * Note that for complete circle arcs this segment will have a length of
  * zero and be pointed towards the perpendicular of `start` in the arc's
  * orientation.
  *
  * @returns {Rac.Segment}
  */
  chordSegment() {
    const perpendicular = this.start.perpendicular(this.clockwise);
    return this.startPoint().segmentToPoint(this.endPoint(), perpendicular);
  }


  /**
  * Returns `true` if the arc is a complete circle, which is when `start`
  * and `end` are [equal angles]{@link Rac.Angle#equals}.
  *
  * @returns {boolean}
  * @see Rac.Angle#equals
  */
  isCircle() {
    return this.start.equals(this.end);
  }


  /**
  * Returns a new `Arc` with center set to `newCenter`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Point} newCenter - The center for the new `Arc`
  * @returns {Rac.Arc}
  */
  withCenter(newCenter) {
    return new Arc(this.rac,
      newCenter, this.radius,
      this.start, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with start set to `newStart`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} newStart - The start for the new `Arc`
  * @returns {Rac.Arc}
  */
  withStart(newStart) {
    const newStartAngle = Rac.Angle.from(this.rac, newStart);
    return new Arc(this.rac,
      this.center, this.radius,
      newStartAngle, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with end set to `newEnd`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} newEnd - The end for the new `Arc`
  * @returns {Rac.Arc}
  */
  withEnd(newEnd) {
    const newEndAngle = Rac.Angle.from(this.rac, newEnd);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEndAngle,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with radius set to `newRadius`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} newRadius - The radius for the new `Arc`
  * @returns {Rac.Arc}
  */
  withRadius(newRadius) {
    return new Arc(this.rac,
      this.center, newRadius,
      this.start, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with its orientation set to `newClockwise`.
  *
  * All other properties are copied from `this`.
  *
  * @param {boolean} newClockwise - The orientation for the new `Arc`
  * @returns {Rac.Arc}
  */
  withClockwise(newClockwise) {
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, this.end,
      newClockwise);
  }


  /**
  * Returns a new `Arc` with the given `angleDistance` as the distance
  * between `start` and `end` in the arc's orientation. This changes `end`
  * for the new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angleDistance - The angle distance of the
  * new `Arc`
  * @returns {Rac.Arc}
  * @see Rac.Arc#angleDistance
  */
  withAngleDistance(angleDistance) {
    const newEnd = this.shiftAngle(angleDistance);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with the given `length` as the length of the
  * part of the circumference it represents. This changes `end` for the
  * new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range `[0,radius*TAU)`. When the given `length` is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {number} length - The length of the new `Arc`
  * @returns {Rac.Arc}
  * @see Rac.Arc#length
  */
  withLength(length) {
    const newAngleDistance = length / this.circumference();
    return this.withAngleDistance(newAngleDistance);
  }


  /**
  * Returns a new `Arc` with a `length()` of `this.length() * ratio`. This
  * changes `end` for the new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range *[0,radius*TAU)*. When the calculated length is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {number} ratio - The factor to multiply `length()` by
  * @returns {Rac.Arc}
  *
  * @see Rac.Arc#length
  */
  withLengthRatio(ratio) {
    const newLength = this.length() * ratio;
    return this.withLength(newLength);
  }


  /**
  * Returns a new `Arc` with `startPoint()` located at `point`. This
  * changes `start` and `radius` for the new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * When `center` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Arc` will use `this.start`.
  *
  * @param {Rac.Point} point - A `Point` at the `startPoint() of the new `Arc`
  * @returns {Rac.Arc}
  *
  * @see Rac.Point#equals
  */
  withStartPoint(point) {
    const newStart = this.center.angleToPoint(point, this.start);
    const newRadius = this.center.distanceToPoint(point);
    return new Arc(this.rac,
      this.center, newRadius,
      newStart, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `endPoint()` located at `point`. This changes
  * `end` and `radius` in the new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * When `center` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Arc` will use `this.end`.
  *
  * @param {Rac.Point} point - A `Point` at the `endPoint() of the new `Arc`
  * @returns {Rac.Arc}
  *
  * @see Rac.Point#equals
  */
  withEndPoint(point) {
    const newEnd = this.center.angleToPoint(point, this.end);
    const newRadius = this.center.distanceToPoint(point);
    return new Arc(this.rac,
      this.center, newRadius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `start` pointing towards `point` from
  * `center`.
  *
  * All other properties are copied from `this`.
  *
  * When `center` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Arc` will use `this.start`.
  *
  * @param {Rac.Point} point - A `Point` to point `start` towards
  * @returns {Rac.Arc}
  *
  * @see Rac.Point#equals
  */
  withStartTowardsPoint(point) {
    const newStart = this.center.angleToPoint(point, this.start);
    return new Arc(this.rac,
      this.center, this.radius,
      newStart, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `end` pointing towards `point` from `center`.
  *
  * All other properties are copied from `this`.
  *
  * When `center` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Arc` will use `this.end`.
  *
  * @param {Rac.Point} point - A `Point` to point `end` towards
  * @returns {Rac.Arc}
  * @see Rac.Point#equals
  */
  withEndTowardsPoint(point) {
    const newEnd = this.center.angleToPoint(point, this.end);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `start` pointing towards `startPoint` and
  * `end` pointing towards `endPoint`, both from `center`.
  *
  * All other properties are copied from `this`.
  *
  * * When `center` is considered [equal]{@link Rac.Point#equals} to
  * either `startPoint` or `endPoint`, the new `Arc` will use `this.start`
  * or `this.end` respectively.
  *
  * @param {Rac.Point} startPoint - A `Point` to point `start` towards
  * @param {?Rac.Point} [endPoint=null] - A `Point` to point `end` towards;
  * when ommited or `null`, `startPoint` is used instead
  * @returns {Rac.Arc}
  * @see Rac.Point#equals
  */
  withAnglesTowardsPoint(startPoint, endPoint = null) {
    const newStart = this.center.angleToPoint(startPoint, this.start);
    const newEnd = endPoint === null
      ? newStart
      : this.center.angleToPoint(endPoint, this.end);
    return new Arc(this.rac,
      this.center, this.radius,
      newStart, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `start` shifted by the given `angle` in the
  * arc's opposite orientation.
  *
  * All other properties are copied from `this`.
  *
  * Notice that this method shifts `start` to the arc's *opposite*
  * orientation, intending to result in a new `Arc` with an increase to
  * `angleDistance()`.
  *
  * @param {Rac.Angle} angle - An `Angle` to shift `start` against
  * @returns {Rac.Arc}
  */
  withStartExtension(angle) {
    let newStart = this.start.shift(angle, !this.clockwise);
    return new Arc(this.rac,
      this.center, this.radius,
      newStart, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `end` shifted by the given `angle` in the
  * arc's orientation.
  *
  * All other properties are copied from `this`.
  *
  * Notice that this method shifts `end` towards the arc's orientation,
  * intending to result in a new `Arc` with an increase to
  * `angleDistance()`.
  *
  * @param {Rac.Angle} angle - An `Angle` to shift `start` against
  * @returns {Rac.Arc}
  */
  withEndExtension(angle) {
    let newEnd = this.end.shift(angle, this.clockwise);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with its `start` and `end` exchanged, and the
  * opposite clockwise orientation. The center and radius remain be the
  * same as `this`.
  *
  * @returns {Rac.Arc}
  */
  reverse() {
    return new Arc(this.rac,
      this.center, this.radius,
      this.end, this.start,
      !this.clockwise);
  }


  /**
  * Returns the given `angle` clamped to the range:
  * ```
  * [start + startInset, end - endInset]
  * ```
  * where the addition happens towards the arc's orientation, and the
  * subtraction against.
  *
  * When `angle` is outside the range, returns whichever range limit is
  * closer.
  *
  * When the sum of the given insets is larger that `this.arcDistance()`
  * the range for the clamp is imposible to fulfill. In this case the
  * returned value will be the centered between the range limits and still
  * clampled to `[start, end]`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to clamp
  * @param {Rac.Angle|number} [startInset={@link instance.Angle#zero}] - The inset
  * for the lower limit of the clamping range
  * @param {Rac.Angle|number} [endInset={@link instance.Angle#zero}] - The inset
  * for the higher limit of the clamping range
  * @returns {Rac.Angle}
  */
  clampToAngles(angle, startInset = this.rac.Angle.zero, endInset = this.rac.Angle.zero) {
    angle = Rac.Angle.from(this.rac, angle);
    startInset = Rac.Angle.from(this.rac, startInset);
    endInset = Rac.Angle.from(this.rac, endInset);

    if (this.isCircle() && startInset.turn == 0 && endInset.turn == 0) {
      // Complete circle
      return angle;
    }

    // Angle in arc, with arc as origin
    // All comparisons are made in a clockwise orientation
    const shiftedAngle = this.distanceFromStart(angle);
    const angleDistance = this.angleDistance();
    const shiftedStartClamp = startInset;
    const shiftedEndClamp = angleDistance.subtract(endInset);
    const totalInsetTurn = startInset.turn + endInset.turn;

    if (totalInsetTurn >= angleDistance.turnOne()) {
      // Invalid range
      const rangeDistance = shiftedEndClamp.distance(shiftedStartClamp);
      let halfRange;
      if (this.isCircle()) {
        halfRange = rangeDistance.mult(1/2);
      } else {
        halfRange = totalInsetTurn >= 1
          ? rangeDistance.multOne(1/2)
          : rangeDistance.mult(1/2);
      }

      const middleRange = shiftedEndClamp.add(halfRange);
      const middle = this.start.shift(middleRange, this.clockwise);

      return this.clampToAngles(middle);
    }

    if (shiftedAngle.turn >= shiftedStartClamp.turn && shiftedAngle.turn <= shiftedEndClamp.turn) {
      // Inside clamp range
      return angle;
    }

    // Outside range, figure out closest limit
    let distanceToStartClamp = shiftedStartClamp.distance(shiftedAngle, false);
    let distanceToEndClamp = shiftedEndClamp.distance(shiftedAngle);
    if (distanceToStartClamp.turn <= distanceToEndClamp.turn) {
      return this.start.shift(startInset, this.clockwise);
    } else {
      return this.end.shift(endInset, !this.clockwise);
    }
  }


  /**
  * Returns `true` when `angle` is between `start` and `end` in the arc's
  * orientation.
  *
  * When the arc represents a complete circle, `true` is always returned.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to evaluate
  * @returns {boolean}
  */
  containsAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    if (this.isCircle()) { return true; }

    if (this.clockwise) {
      let offset = angle.subtract(this.start);
      let endOffset = this.end.subtract(this.start);
      return offset.turn <= endOffset.turn;
    } else {
      let offset = angle.subtract(this.end);
      let startOffset = this.start.subtract(this.end);
      return offset.turn <= startOffset.turn;
    }
  }

  /**
  * Returns `true` when the projection of `point` in the arc is positioned
  * between `start` and `end` in the arc's orientation.
  *
  * When the arc represents a complete circle, `true` is always returned.
  *
  * @param {Rac.Point} point - A `Point` to evaluate
  * @returns {boolean}
  */
  containsProjectedPoint(point) {
    if (this.isCircle()) { return true; }
    return this.containsAngle(this.center.angleToPoint(point));
  }


  /**
  * Returns a new `Angle` with `angle` [shifted by]{@link Rac.Angle#shift}
  * `start` in the arc's orientation.
  *
  * E.g.
  * For a clockwise arc starting at `0.5`: `shiftAngle(0.1)` is `0.6`.
  * For a counter-clockwise arc starting at `0.5`: `shiftAngle(0.1)` is `0.4`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to shift
  * @returns {Rac.Angle}
  * @see Rac.Angle#shift
  */
  shiftAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return this.start.shift(angle, this.clockwise);
  }

  // Returns an Angle that represents the distance from `this.start` to
  // `angle` traveling in the `clockwise` orientation.
  // Useful to determine for a given angle, where it sits inside the arc if
  // the arc was the origin coordinate system.
  //
  /**
  * Returns a new `Angle` that represents the angle distance from `start`
  * to `angle` in the arc's orientation.
  *
  * E.g.
  * For a clockwise arc starting at `0.5`: `distanceFromStart(0.6)` is `0.1`.
  * For a counter-clockwise arc starting at `0.5`: `distanceFromStart(0.6)` is `0.9`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to measure the distance to
  * @returns {Rac.Angle}
  */
  distanceFromStart(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return this.start.distance(angle, this.clockwise);
  }


  /**
  * Returns a new `Point` located in the arc at the given `angle`. This
  * method does not consider the `start` nor `end` of the arc.
  *
  * The arc is considered a complete circle.
  *
  * @param {Rac.Angle|number} angle - An `Angle` towards the new `Point`
  * @returns {Rac.Point}
  */
  pointAtAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return this.center.pointToAngle(angle, this.radius);
  }


  /**
  * Returns a new `Point` located in the arc at the given `angle`
  * [shifted by]{@link Rac.Angle#shift} `start` in arc's orientation.
  *
  * The arc is considered a complete circle.
  *
  * @param {Rac.Angle} angle - An `Angle` to be shifted by `start`
  * @returns {Rac.Point}
  */
  pointAtAngleDistance(angle) {
    let shiftedAngle = this.shiftAngle(angle);
    return this.pointAtAngle(shiftedAngle);
  }


  /**
  * Returns a new `Point` located in the arc at the given `length` from
  * `startPoint()` in arc's orientation.
  *
  * The arc is considered a complete circle.
  *
  * @param {number} length - The length from `startPoint()` to the new `Point`
  * @returns {Rac.Point}
  */
  pointAtLength(length) {
    const angleDistance = length / this.circumference();
    return this.pointAtAngleDistance(angleDistance);
  }


  /**
  * Returns a new `Point` located in the arc at `length() * ratio` from
  * `startPoint()` in the arc's orientation.
  *
  * The arc is considered a complete circle.
  *
  * @param {number} ratio - The factor to multiply `length()` by
  * @returns {Rac.Point}
  */
  pointAtLengthRatio(ratio) {
    let newAngleDistance = this.angleDistance().multOne(ratio);
    let shiftedAngle = this.shiftAngle(newAngleDistance);
    return this.pointAtAngle(shiftedAngle);
  }


  /**
  * Returns a new `Segment` representing the radius of the arc at the
  * given `angle`. This method does not consider the `start` nor `end` of
  * the arc.
  *
  * The arc is considered a complete circle.
  *
  * @param {Rac.Angle|number} angle - The direction of the radius to return
  * @returns {Rac.Segment}
  */
  radiusSegmentAtAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    const newRay = new Rac.Ray(this.rac, this.center, angle);
    return new Rac.Segment(this.rac, newRay, this.radius);
  }


  /**
  * Returns a new `Segment` representing the radius of the arc in the
  * direction towards the given `point`. This method does not consider the
  * `start` nor `end` of the arc.
  *
  * The arc is considered a complete circle.
  *
  * @param {Rac.point} point - A `Point` in the direction of the radius to return
  * @returns {Rac.Segment}
  */
  radiusSegmentTowardsPoint(point) {
    const angle = this.center.angleToPoint(point);
    const newRay = new Rac.Ray(this.rac, this.center, angle);
    return new Rac.Segment(this.rac, newRay, this.radius);
  }


  /**
  * Returns a new `Segment` for the chord formed by the intersection of
  * `this` and `otherArc`, or `null` when there is no intersection.
  *
  * The returned `Segment` will point towards the `this` orientation.
  *
  * Both arcs are considered complete circles for the calculation of the
  * chord, thus the endpoints of the returned segment may not lay inside
  * the actual arcs.
  *
  * @param {Rac.Arc} otherArc - description
  * @returns {?Rac.Segment}
  */
  intersectionChord(otherArc) {
    // https://mathworld.wolfram.com/Circle-CircleIntersection.html
    // R=this, r=otherArc

    if (this.center.equals(otherArc.center)) {
      return null;
    }

    const distance = this.center.distanceToPoint(otherArc.center);

    if (distance > this.radius + otherArc.radius) {
      return null;
    }

    // distanceToChord = (d^2 - r^2 + R^2) / (d*2)
    const distanceToChord = (
        Math.pow(distance, 2)
      - Math.pow(otherArc.radius, 2)
      + Math.pow(this.radius, 2)
      ) / (distance * 2);

    // a = 1/d sqrt|(-d+r-R)(-d-r+R)(-d+r+R)(d+r+R)
    const chordLength = (1 / distance) * Math.sqrt(
        (-distance + otherArc.radius - this.radius)
      * (-distance - otherArc.radius + this.radius)
      * (-distance + otherArc.radius + this.radius)
      * (distance + otherArc.radius + this.radius));

    const segmentToChord = this.center.rayToPoint(otherArc.center)
      .segment(distanceToChord);
    return segmentToChord.nextSegmentPerpendicular(this.clockwise, chordLength/2)
      .reverse()
      .withLengthRatio(2);
  }


  // TODO: consider if intersectingPointsWithArc is necessary
  /**
  * Returns an array containing the intersecting points of `this` with
  * `otherArc`.
  *
  * When there are no intersecting points, returns an empty array.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to calculate intersection points with
  * @returns {Rac.Arc}
  *
  * @ignore
  */
  // intersectingPointsWithArc(otherArc) {
  //   let chord = this.intersectionChord(otherArc);
  //   if (chord === null) { return []; }

  //   let intersections = [chord.startPoint(), chord.endPoint()].filter(function(item) {
  //     return this.containsAngle(this.center.segmentToPoint(item))
  //       && otherArc.containsAngle(otherArc.center.segmentToPoint(item));
  //   }, this);

  //   return intersections;
  // }


  /**
  * Returns a new `Segment` representing the chord formed by the
  * intersection of the arc and 'ray', or `null` when no chord is possible.
  *
  * The returned `Segment` will always have the same angle as `ray`.
  *
  * The arc is considered a complete circle and `ray` is considered an
  * unbounded line.
  *
  * @param {Rac.Ray} ray - A `Ray` to calculate the intersection with
  * @returns {?Rac.Segment}
  */
  intersectionChordWithRay(ray) {
    // First check intersection
    const bisector = this.center.segmentToProjectionInRay(ray);
    const distance = bisector.length;

    // Segment too close to center, cosine calculations may be incorrect
    // Calculate segment through center
    if (this.rac.equals(0, distance)) {
      const start = this.pointAtAngle(ray.angle.inverse());
      const newRay = new Rac.Ray(this.rac, start, ray.angle);
      return new Rac.Segment(this.rac, newRay, this.radius*2);
    }

    // Ray is tangent, return zero-length segment at contact point
    if (this.rac.equals(distance, this.radius)) {
      const start = this.pointAtAngle(bisector.ray.angle);
      const newRay = new Rac.Ray(this.rac, start, ray.angle);
      return new Rac.Segment(this.rac, newRay, 0);
    }

    // Ray does not touch arc
    if (distance > this.radius) {
      return null;
    }

    const radians = Math.acos(distance/this.radius);
    const angle = Rac.Angle.fromRadians(this.rac, radians);

    const centerOrientation = ray.pointOrientation(this.center);
    const start = this.pointAtAngle(bisector.angle().shift(angle, !centerOrientation));
    const end = this.pointAtAngle(bisector.angle().shift(angle, centerOrientation));
    return start.segmentToPoint(end, ray.angle);
  }


  /**
  * Returns a new `Point` representing the end of the chord formed by the
  * intersection of the arc and 'ray', or `null` when no chord is possible.
  *
  * When `useProjection` is `true` the method will always return a `Point`
  * even when there is no contact between the arc and `ray`. In this case
  * the point in the arc closest to `ray` is returned.
  *
  * The arc is considered a complete circle and `ray` is considered an
  * unbounded line.
  *
  * @param {Rac.Ray} ray - A `Ray` to calculate the intersection with
  * @returns {?Rac.Point}
  */
  intersectionChordEndWithRay(ray, useProjection = false) {
    const chord = this.intersectionChordWithRay(ray);
    if (chord !== null) {
      return chord.endPoint();
    }

    if (useProjection) {
      const centerOrientation = ray.pointOrientation(this.center);
      const perpendicular = ray.angle.perpendicular(!centerOrientation);
      return this.pointAtAngle(perpendicular);
    }

    return null;
  }


  /**
  * Returns a new `Arc` representing the section of `this` that is inside
  * `otherArc`, or `null` when there is no intersection. The returned arc
  * will have the same center, radius, and orientation as `this`.
  *
  * Both arcs are considered complete circles for the calculation of the
  * intersection, thus the endpoints of the returned arc may not lay inside
  * `this`.
  *
  * An edge case of this method is that when the distance between `this`
  * and `otherArc` is the sum of their radius, meaning the arcs touch at a
  * single point, the resulting arc may have a angle-distance of zero,
  * which is interpreted as a complete-circle arc.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to intersect with
  * @returns {?Rac.Arc}
  */
  intersectionArc(otherArc) {
    const chord = this.intersectionChord(otherArc);
    if (chord === null) { return null; }

    return this.withAnglesTowardsPoint(chord.startPoint(), chord.endPoint());
  }


  // TODO: implement intersectionArcNoCircle?


  // TODO: finish boundedIntersectionArc
  /**
  * Returns a new `Arc` representing the section of `this` that is inside
  * `otherArc` and bounded by `this.start` and `this.end`, or `null` when
  * there is no intersection. The returned arc will have the same center,
  * radius, and orientation as `this`.
  *
  * `otherArc` is considered a complete circle, while the start and end of
  * `this` are considered for the resulting `Arc`.
  *
  * When there exist two separate arc sections that intersect with
  * `otherArc`: only the section of `this` closest to `start` is returned.
  * This can happen when `this` starts inside `otherArc`, then exits, and
  * then ends inside `otherArc`, regardless if `this` is a complete circle
  * or not.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to intersect with
  * @returns {?Rac.Arc}
  *
  * @ignore
  */
  // boundedIntersectionArc(otherArc) {
  //   let chord = this.intersectionChord(otherArc);
  //   if (chord === null) { return null; }

  //   let chordStartAngle = this.center.angleToPoint(chord.startPoint());
  //   let chordEndAngle = this.center.angleToPoint(chord.endPoint());

  //   // get all distances from this.start
  //   // if closest is chordEndAngle, only start may be inside arc
  //   // if closest is this.end, whole arc is inside or outside
  //   // if closest is chordStartAngle, only end may be inside arc
  //   const interStartDistance = this.start.distance(chordStartAngle, this.clockwise);
  //   const interEndDistance = this.start.distance(chordEndAngle, this.clockwise);
  //   const endDistance = this.start.distance(this.end, this.clockwise);


  //   // if closest is chordStartAngle, normal rules
  //   // if closest is end not zero, if following is chordStart, return null
  //   // if closest is end not zero, if following is chordend, return self
  //   // if closest is end zero, if following is chordStart, normal rules
  //   // if closest is end zero, if following is chordend, return start to chordend
  //   // if closest is chordEndAngle, return start to chordEnd


  //   if (!this.containsAngle(chordStartAngle)) {
  //     chordStartAngle = this.start;
  //   }
  //   if (!this.containsAngle(chordEndAngle)) {
  //     chordEndAngle = this.end;
  //   }

  //   return new Arc(this.rac,
  //     this.center, this.radius,
  //     chordStartAngle,
  //     chordEndAngle,
  //     this.clockwise);
  // }


  /**
  * Returns a new `Segment` that is tangent to both `this` and `otherArc`,
  * or `null` when no tangent segment is possible. The new `Segment` starts
  * at the contact point with `this` and ends at the contact point with
  * `otherArc`.
  *
  * Considering _center axis_ a ray from `this.center` towards
  * `otherArc.center`, `startClockwise` determines the side of the start
  * point of the returned segment in relation to _center axis_, and
  * `endClockwise` the side of the end point.
  *
  * Both `this` and `otherArc` are considered complete circles.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to calculate a tangent segment towards
  * @param {boolean} startClockwise - The orientation of the new `Segment`
  * start point in relation to the _center axis_
  * @param {boolean} endClockwise - The orientation of the new `Segment`
  * end point in relation to the _center axis_
  * @returns {?Rac.Segment}
  */
  tangentSegment(otherArc, startClockwise = true, endClockwise = true) {
    if (this.center.equals(otherArc.center)) {
      return null;
    }

    // Hypothenuse of the triangle used to calculate the tangent
    // main angle is at `this.center`
    const hypSegment = this.center.segmentToPoint(otherArc.center);
    const ops = startClockwise === endClockwise
      ? otherArc.radius - this.radius
      : otherArc.radius + this.radius;

    // When ops and hyp are close, snap to 1
    const angleSine = this.rac.equals(Math.abs(ops), hypSegment.length)
      ? (ops > 0 ? 1 : -1)
      : ops / hypSegment.length;
    if (Math.abs(angleSine) > 1) {
      return null;
    }

    const angleRadians = Math.asin(angleSine);
    const opsAngle = Rac.Angle.fromRadians(this.rac, angleRadians);

    const adjOrientation = startClockwise === endClockwise
      ? startClockwise
      : !startClockwise;
    const shiftedOpsAngle = hypSegment.ray.angle.shift(opsAngle, adjOrientation);
    const shiftedAdjAngle = shiftedOpsAngle.perpendicular(adjOrientation);

    const startAngle = startClockwise === endClockwise
      ? shiftedAdjAngle
      : shiftedAdjAngle.inverse()
    const start = this.pointAtAngle(startAngle);
    const end = otherArc.pointAtAngle(shiftedAdjAngle);
    const defaultAngle = startAngle.perpendicular(!startClockwise);
    return start.segmentToPoint(end, defaultAngle);
  }


  /**
  * Returns an array containing new `Arc` objects representing `this`
  * divided into `count` arcs, all with the same
  * [angle distance]{@link Rac.Arc#angleDistance}.
  *
  * When `count` is zero or lower, returns an empty array. When `count` is
  * `1` returns an arc equivalent to `this`.
  *
  * @param {number} count - Number of arcs to divide `this` into
  * @returns {Rac.Arc[]}
  */
  divideToArcs(count) {
    if (count <= 0) { return []; }

    const angleDistance = this.angleDistance();
    const partTurn = angleDistance.turnOne() / count;

    const arcs = [];
    for (let index = 0; index < count; index += 1) {
      const start = this.start.shift(partTurn * index, this.clockwise);
      const end = this.start.shift(partTurn * (index+1), this.clockwise);
      const arc = new Arc(this.rac, this.center, this.radius, start, end, this.clockwise);
      arcs.push(arc);
    }

    return arcs;
  }


  /**
  * Returns an array containing new `Segment` objects representing `this`
  * divided into `count` chords, all with the same length.
  *
  * When `count` is zero or lower, returns an empty array. When `count` is
  * `1` returns an arc equivalent to
  * `[this.chordSegment()]{@link Rac.Arc#chordSegment}`.
  *
  * @param {number} count - Number of segments to divide `this` into
  * @returns {Rac.Segment[]}
  */
  divideToSegments(count) {
    if (count <= 0) { return []; }

    const angleDistance = this.angleDistance();
    const partTurn = angleDistance.turnOne() / count;

    const segments = [];
    for (let index = 0; index < count; index += 1) {
      const startAngle = this.start.shift(partTurn * index, this.clockwise);
      const endAngle = this.start.shift(partTurn * (index+1), this.clockwise);
      const startPoint = this.pointAtAngle(startAngle);
      const endPoint = this.pointAtAngle(endAngle);
      const segment = startPoint.segmentToPoint(endPoint);
      segments.push(segment);
    }

    return segments;
  }


  /**
  * Returns a new `Composite` that contains `Bezier` objects representing
  * the arc divided into `count` beziers that approximate the shape of the
  * arc.
  *
  * When `count` is zero or lower, returns an empty `Composite`.
  *
  * @param {number} count - Number of beziers to divide `this` into
  * @returns {Rac.Composite}
  *
  * @see Rac.Bezier
  */
  divideToBeziers(count) {
    if (count <= 0) { return new Rac.Composite(this.rac, []); }

    const angleDistance = this.angleDistance();
    const partTurn = angleDistance.turnOne() / count;

    // length of tangent:
    // https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
    const parsPerTurn = 1 / partTurn;
    const tangent = this.radius * (4/3) * Math.tan(Rac.TAU/(parsPerTurn*4));

    const beziers = [];
    const segments = this.divideToSegments(count);
    segments.forEach(item => {
      const startArcRadius = this.center.segmentToPoint(item.startPoint());
      const endArcRadius = this.center.segmentToPoint(item.endPoint());

      let startAnchor = startArcRadius
        .nextSegmentToAngleDistance(this.rac.Angle.square, !this.clockwise, tangent)
        .endPoint();
      let endAnchor = endArcRadius
        .nextSegmentToAngleDistance(this.rac.Angle.square, this.clockwise, tangent)
        .endPoint();

      const newBezier = new Rac.Bezier(this.rac,
        startArcRadius.endPoint(), startAnchor,
        endAnchor, endArcRadius.endPoint())

      beziers.push(newBezier);
    });

    return new Rac.Composite(this.rac, beziers);
  }

} // class Arc


module.exports = Arc;


},{"../Rac":2,"../util/utils":41}],11:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Bezier curve with start, end, and two anchor [points]{@link Rac.Point}.
* @alias Rac.Bezier
*/
class Bezier {

  constructor(rac, start, startAnchor, endAnchor, end) {
    utils.assertExists(rac, start, startAnchor, endAnchor, end);
    utils.assertType(Rac.Point, start, startAnchor, endAnchor, end);

    this.rac = rac;
    this.start = start;
    this.startAnchor = startAnchor;
    this.endAnchor = endAnchor;
    this.end = end;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const startXStr       = utils.cutDigits(this.start.x,       digits);
    const startYStr       = utils.cutDigits(this.start.y,       digits);
    const startAnchorXStr = utils.cutDigits(this.startAnchor.x, digits);
    const startAnchorYStr = utils.cutDigits(this.startAnchor.y, digits);
    const endAnchorXStr   = utils.cutDigits(this.endAnchor.x,   digits);
    const endAnchorYStr   = utils.cutDigits(this.endAnchor.y,   digits);
    const endXStr         = utils.cutDigits(this.end.x,         digits);
    const endYStr         = utils.cutDigits(this.end.y,         digits);

    return `Bezier(s:(${startXStr},${startYStr}) sa:(${startAnchorXStr},${startAnchorYStr}) ea:(${endAnchorXStr},${endAnchorYStr}) e:(${endXStr},${endYStr}))`;
  }


  /**
  * Returns `true` when all members of both beziers are
  * [considered equal]{@link Rac.Point#equals}.
  *
  * When `otherBezier` is any class other that `Rac.Bezier`, returns
  * `false`.
  *
  * @param {Rac.Bezier} otherBezier - A `Bezier` to compare
  * @returns {boolean}
  *
  * @see Rac.Point#equals
  */
  equals(otherBezier) {
    return otherBezier instanceof Bezier
      && this.start      .equals(otherBezier.start)
      && this.startAnchor.equals(otherBezier.startAnchor)
      && this.endAnchor  .equals(otherBezier.endAnchor)
      && this.end        .equals(otherBezier.end);
  }

}


module.exports = Bezier;


Bezier.prototype.drawAnchors = function(style = undefined) {
  push();
  if (style !== undefined) {
    style.apply();
  }
  this.start.segmentToPoint(this.startAnchor).draw();
  this.end.segmentToPoint(this.endAnchor).draw();
  pop();
};

Bezier.prototype.reverse = function() {
  return new Bezier(this.rac,
    this.end, this.endAnchor,
    this.startAnchor, this.start);
};


},{"../Rac":2,"../util/utils":41}],12:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Container of a sequence of drawable objects that can be drawn together.
*
* Used by `[P5Drawer]{@link Rac.P5Drawer}` to perform specific vertex
* operations with drawables to draw complex shapes.
*
* @class
* @alias Rac.Composite
*/
function Composite(rac, sequence = []) {
  utils.assertExists(rac, sequence);

  this.rac = rac;
  this.sequence = sequence;
};


module.exports = Composite;


Composite.prototype.isNotEmpty = function() {
  return this.sequence.length != 0;
};

Composite.prototype.add = function(element) {
  if (element instanceof Array) {
    element.forEach(item => this.sequence.push(item));
    return
  }
  this.sequence.push(element);
};

Composite.prototype.reverse = function() {
  let reversed = this.sequence.map(item => item.reverse())
    .reverse();
  return new Composite(this.rac, reversed);
};


},{"../Rac":2,"../util/utils":41}],13:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Point in a two dimentional coordinate system.
*
* Several methods will return an adjusted value or perform adjustments in
* their operation when two points are close enough as to be considered
* equal. When the the difference of each coordinate of two points
* is under the `[equalityThreshold]{@link Rac#equalityThreshold}` the
* points are considered equal. The `[equals]{@link Rac.Point#equals}`
* method performs this check.
*
* @alias Rac.Point
*/
class Point{


  /**
  * Creates a new `Point` instance.
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} x - The x coordinate
  * @param {number} y - The y coordinate
  */
  constructor(rac, x, y) {
    utils.assertExists(rac, x, y);
    utils.assertNumber(x, y);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * X coordinate of the point.
    * @type {number}
    */
    this.x = x;

    /**
    * Y coordinate of the point.
    * @type {number}
    */
    this.y = y;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.x, digits);
    const yStr = utils.cutDigits(this.y, digits);
    return `Point(${xStr},${yStr})`;
  }


  /**
  * Returns `true` when the difference with `otherPoint` for each coordinate is
  * under `{@link Rac#equalityThreshold}`, otherwise returns `false`.
  *
  * When `otherPoint` is any class other that `Rac.Point`, returns `false`.
  *
  * Values are compared using `{@link Rac#equals}`.
  *
  * @param {Rac.Point} otherPoint - A `Point` to compare
  * @returns {boolean}
  * @see Rac#equals
  */
  equals(otherPoint) {
    return otherPoint instanceof Point
      && this.rac.equals(this.x, otherPoint.x)
      && this.rac.equals(this.y, otherPoint.y);
  }


  /**
  * Returns a new `Point` with `x` set to `newX`.
  * @param {number} newX - The x coordinate for the new `Point`
  * @returns {Rac.Point}
  */
  withX(newX) {
    return new Point(this.rac, newX, this.y);
  }


  /**
  * Returns a new `Point` with `x` set to `newX`.
  * @param {number} newY - The y coordinate for the new `Point`
  * @returns {Rac.Point}
  */
  withY(newY) {
    return new Point(this.rac, this.x, newY);
  }


  /**
  * Returns a new `Point` with `x` added to `this.x`.
  * @param {number} x - The x coordinate to add
  * @returns {Rac.Point}
  */
  addX(x) {
    return new Point(this.rac,
      this.x + x, this.y);
  }


  /**
  * Returns a new `Point` with `y` added to `this.y`.
  * @param {number} y - The y coordinate to add
  * @returns {Rac.Point}
  */
  addY(y) {
    return new Point(this.rac,
      this.x, this.y + y);
  }


  /**
  * Returns a new `Point` by adding the components of `point` to `this`.
  * @param {Rac.Point} point - A `Point` to add
  * @returns {Rac.Point}
  */
  addPoint(point) {
    return new Point(
      this.rac,
      this.x + point.x,
      this.y + point.y);
  }


  /**
  * Returns a new `Point` by adding the `x` and `y` components to `this`.
  * @param {number} x - The x coodinate to add
  * @param {number} y - The y coodinate to add
  * @returns {Rac.Point}
  */
  add(x, y) {
    return new Point(this.rac,
      this.x + x, this.y + y);
  }


  /**
  * Returns a new `Point` by subtracting the components of `point`.
  * @param {Rac.Point} point - A `Point` to subtract
  * @returns {Rac.Point}
  */
  subtractPoint(point) {
    return new Point(
      this.rac,
      this.x - point.x,
      this.y - point.y);
  }


  /**
  * Returns a new `Point` by subtracting the `x` and `y` components.
  * @param {number} x - The x coodinate to subtract
  * @param {number} y - The y coodinate to subtract
  * @returns {Rac.Point}
  */
  subtract(x, y) {
    return new Point(
      this.rac,
      this.x - x,
      this.y - y);
  }


  /**
  * Returns a new `Point` with the negative coordinate values of `this`.
  * @returns {Rac.Point}
  */
  negative() {
    return new Point(this.rac, -this.x, -this.y);
  }


  /**
  * Returns the distance from `this` to `point`, or returns `0` when
  * `this` and `point` are considered [equal]{@link Rac.Point#equals}.
  *
  * @param {Rac.Point} point - A `Point` to measure the distance to
  * @returns {number}
  * @see Rac.Point#equals
  */
  distanceToPoint(point) {
    if (this.equals(point)) {
      return 0;
    }
    const x = Math.pow((point.x - this.x), 2);
    const y = Math.pow((point.y - this.y), 2);
    return Math.sqrt(x+y);
  }


  /**
  * Returns the angle from `this` to `point`.
  *
  * When `this` and `point` are considered
  * [equal]{@link Rac.Point#equals}, returns the angle produced with
  * `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to measure the angle to
  * @param {Rac.Angle|number} [defaultAngle=instance.Angle.Zero] -
  * An `Angle` to return when `this` and `point` are equal
  * @returns {Rac.Angle}
  * @see Rac.Point#equals
  */
  angleToPoint(point, defaultAngle = this.rac.Angle.zero) {
    if (this.equals(point)) {
      defaultAngle = this.rac.Angle.from(defaultAngle);
      return defaultAngle;
    }
    const offset = point.subtractPoint(this);
    const radians = Math.atan2(offset.y, offset.x);
    return Rac.Angle.fromRadians(this.rac, radians);
  }


  /**
  * Returns a new `Point` at a `distance` from `this` in the direction of
  * `angle`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` towars the new `Point`
  * @param {number} distance - The distance to the new `Point`
  * @returns {Rac.Point}
  */
  pointToAngle(angle, distance) {
    angle = this.rac.Angle.from(angle);
    const distanceX = distance * Math.cos(angle.radians());
    const distanceY = distance * Math.sin(angle.radians());
    return new Point(this.rac, this.x + distanceX, this.y + distanceY);
  }


  /**
  * Returns a new `Ray` from `this` towards `angle`.
  * @param {Rac.Angle|number} angle - The `Angle` of the new `Ray`
  * @returns {Rac.Ray}
  */
  ray(angle) {
    angle = this.rac.Angle.from(angle);
    return new Rac.Ray(this.rac, this, angle);
  }


  /**
  * Returns a new `Ray` from `this` towards `point`.
  *
  * When `this` and `point` are considered equal, the new `Ray` will use
  * the angle produced with `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Ray` towards
  * @param {Rac.Angle|number} [defaultAngle=instance.Angle.Zero] -
  * An `Angle` to use when `this` and `point` are equal
  * @returns {Rac.Ray}
  */
  rayToPoint(point, defaultAngle = this.rac.Angle.zero) {
    defaultAngle = this.angleToPoint(point, defaultAngle);
    return new Rac.Ray(this.rac, this, defaultAngle);
  }


  /**
  * Returns a new `Ray` from `this` to the projection of `this` in `ray`.
  *
  * When the projected point is equal to `this` the produced ray will have
  * an angle perpendicular to `ray` in the clockwise direction.
  *
  * @param {Rac.Ray} ray - A `Ray` to project `this` onto
  * @returns {Rac.Ray}
  */
  rayToProjectionInRay(ray) {
    const projected = ray.pointProjection(this);
    const perpendicular = ray.angle.perpendicular();
    return this.rayToPoint(projected, perpendicular);
  }


  /**
  * @summary
  * Returns a new `Ray` that starts at `this` and is tangent to `arc`, when
  * no tangent is possible returns `null`.
  *
  * @description
  * The new `Ray` will be in the `clockwise` side of the ray formed
  * from `this` towards `arc.center`. `arc` is considered a complete
  * circle.
  *
  * When `this` is inside `arc` no tangent segment is possible and `null`
  * is returned.
  *
  * A special case is considered when `arc.radius` is considered to be `0`
  * and `this` is equal to `arc.center`. In this case the angle between
  * `this` and `arc.center` is assumed to be the inverse of `arc.start`,
  * thus the new `Ray` will have an angle perpendicular to
  * `arc.start.inverse()`, in the `clockwise` orientation.
  *
  * @param {Rac.Arc} arc - An `Arc` to calculate a tangent to, considered
  * as a complete circle
  * @param {boolean} [clockwise=true] - the orientation of the new `Ray`
  * @return {Rac.Ray?}
  */
  rayTangentToArc(arc, clockwise = true) {
    // A default angle is given for the edge case of a zero-radius arc
    let hypotenuse = this.segmentToPoint(arc.center, arc.start.inverse());
    let ops = arc.radius;

    if (this.rac.equals(hypotenuse.length, arc.radius)) {
      // Point in arc
      const perpendicular = hypotenuse.ray.angle.perpendicular(clockwise);
      return new Rac.Ray(this.rac, this, perpendicular);
    }

    if (this.rac.equals(hypotenuse.length, 0)) {
      return null;
    }

    let angleSine = ops / hypotenuse.length;
    if (angleSine > 1) {
      // Point inside arc
      return null;
    }

    let angleRadians = Math.asin(angleSine);
    let opsAngle = Rac.Angle.fromRadians(this.rac, angleRadians);
    let shiftedOpsAngle = hypotenuse.angle().shift(opsAngle, clockwise);

    return new Rac.Ray(this.rac, this, shiftedOpsAngle);
  }


  /**
  * Returns a new `Segment` from `this` towards `angle` with the given
  * `length`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to point the segment
  * towards
  * @param {number} length - The length of the new `Segment`
  * @returns {Rac.Segment}
  */
  segmentToAngle(angle, length) {
    angle = this.rac.Angle.from(angle);
    const ray = new Rac.Ray(this.rac, this, angle);
    return new Rac.Segment(this.rac, ray, length);
  }


  /**
  * Returns a new `Segment` from `this` to `point`.
  *
  * When `this` and `point` are considered [equal]{@link Rac.Point#equals},
  * the new `Segment` will use the angle produced with `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Segment` towards
  * @param {Rac.Angle|number} [defaultAngle=instance.Angle.Zero] -
  * An `Angle` to use when `this` and `point` are equal
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
  */
  segmentToPoint(point, defaultAngle = this.rac.Angle.zero) {
    defaultAngle = this.angleToPoint(point, defaultAngle);
    const length = this.distanceToPoint(point);
    const ray = new Rac.Ray(this.rac, this, defaultAngle);
    return new Rac.Segment(this.rac, ray, length);
  }


  /**
  * Returns a new `Segment` from `this` to the projection of `this` in
  * `ray`.
  *
  * When the projected point is equal to `this`, the new `Segment` will
  * have an angle perpendicular to `ray` in the clockwise direction.
  *
  * @param {Rac.Ray} ray - A `Ray` to project `this` onto
  * @returns {Rac.Segment}
  */
  segmentToProjectionInRay(ray) {
    const projected = ray.pointProjection(this);
    const perpendicular = ray.angle.perpendicular();
    return this.segmentToPoint(projected, perpendicular);
  }


  /**
  * @summary
  * Returns a new `Segment` that starts at `this` and is tangent to `arc`,
  * when no tangent is possible returns `null`.
  *
  * @description
  * The new `Segment` will be in the `clockwise` side of the ray formed
  * from `this` towards `arc.center`, and its end point will be at the
  * contact point with `arc` which is considered as a complete circle.
  *
  * When `this` is inside `arc` no tangent segment is possible and `null`
  * is returned.
  *
  * A special case is considered when `arc.radius` is considered to be `0`
  * and `this` is equal to `arc.center`. In this case the angle between
  * `this` and `arc.center` is assumed to be the inverse of `arc.start`,
  * thus the new `Segment` will have an angle perpendicular to
  * `arc.start.inverse()`, in the `clockwise` orientation.
  *
  * @param {Rac.Arc} arc - An `Arc` to calculate a tangent to, considered
  * as a complete circle
  * @param {boolean} [clockwise=true] - the orientation of the new `Segment`
  * @return {Rac.Segment?}
  */
  segmentTangentToArc(arc, clockwise = true) {
    const tangentRay = this.rayTangentToArc(arc, clockwise);
    if (tangentRay === null) {
      return null;
    }

    const tangentPerp = tangentRay.angle.perpendicular(clockwise);
    const radiusRay = arc.center.ray(tangentPerp);

    return tangentRay.segmentToIntersection(radiusRay);
  }


  /**
  * Returns a new `Arc` with center at `this` and the given arc properties.
  *
  * @param {number} radius - The radius of the new `Arc`
  * @param {Rac.Angle|number} [someStart=rac.Angle.zero] - The start
  * `Angle` of the new `Arc`
  * @param {?Rac.Angle|number} [someEnd=null] - The end `Angle` of the new
  * `Arc`; when `null` or ommited, `start` is used instead
  * @param {boolean=} clockwise=true - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arc(
    radius,
    start = this.rac.Angle.zero,
    end = null,
    clockwise = true)
  {
    start = this.rac.Angle.from(start);
    end = end === null
      ? start
      : this.rac.Angle.from(end);
    return new Rac.Arc(this.rac, this, radius, start, end, clockwise);
  }


  /**
  * Returns a new `Text` with the given `string` and `format`.
  * @param {string} string - The string of the new `Text`
  * @param {Rac.Text.Format} format - The format of the new `Text`
  * @returns {Rac.Text}
  */
  text(string, format) {
    return new Rac.Text(this.rac, this, string, format);
  }

} // class Point


module.exports = Point;


},{"../Rac":2,"../util/utils":41}],14:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Unbounded ray from a `[Point]{@link Rac.Point}` in direction of an
* `[Angle]{@link Rac.Angle}`.
*
* @alias Rac.Ray
*/
class Ray {

  /**
  * Creates a new `Ray` instance.
  * @param {Rac} rac Instance to use for drawing and creating other objects
  * @param {Rac.Point} start - A `Point` where the ray starts
  * @param {Rac.Angle} angle - An `Angle` the ray is directed to
  */
  constructor(rac, start, angle) {
    utils.assertExists(rac, start, angle);
    utils.assertType(Rac.Point, start);
    utils.assertType(Rac.Angle, angle);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The start point of the ray.
    * @type {Rac.Point}
    */
    this.start = start;

    /**
    * The angle towards which the ray extends.
    * @type {Rac.Angle}
    */
    this.angle = angle;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.start.x, digits);
    const yStr = utils.cutDigits(this.start.y, digits);
    const turnStr = utils.cutDigits(this.angle.turn, digits);
    return `Ray((${xStr},${yStr}) a:${turnStr})`;
  }


  /**
  * Returns `true` when `start` and `angle` in both rays are equal.
  *
  * When `otherRay` is any class other that `Rac.Ray`, returns `false`.
  *
  * @param {Rac.Ray} otherRay - A `Ray` to compare
  * @returns {boolean}
  * @see Rac.Point#equals
  * @see Rac.Angle#equals
  */
  equals(otherRay) {
    return otherRay instanceof Ray
      && this.start.equals(otherRay.start)
      && this.angle.equals(otherRay.angle);
  }


  /**
  * Returns the slope of the ray, or `null` if the ray is vertical.
  *
  * In the line formula `y = mx + b` the slope is `m`.
  *
  * @returns {?number}
  */
  slope() {
    let isVertical =
         this.rac.unitaryEquals(this.angle.turn, this.rac.Angle.down.turn)
      || this.rac.unitaryEquals(this.angle.turn, this.rac.Angle.up.turn);
    if (isVertical) {
      return null;
    }

    return Math.tan(this.angle.radians());
  }


  /**
  * Returns the y-intercept: the point at which the ray, extended in both
  * directions, intercepts with the y-axis; or `null` if the ray is
  * vertical.
  *
  * In the line formula `y = mx + b` the y-intercept is `b`.
  *
  * @returns {?number}
  */
  yIntercept() {
    let slope = this.slope();
    if (slope === null) {
      return null;
    }
    // y = mx + b
    // y - mx = b
    return this.start.y - slope * this.start.x;
  }


  /**
  * Returns a new `Ray` with `start` set to `newStart`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Point} newStart - The start for the new `Ray`
  * @returns {Rac.Ray}
  */
  withStart(newStart) {
    return new Ray(this.rac, newStart, this.angle);
  }


  /**
  * Returns a new `Ray` with `start.x` set to `newX`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} newX - The x coordinate for the new `Ray`
  * @returns {Rac.Ray}
  */
  withX(newX) {
    return new Ray(this.rac, this.start.withX(newX), this.angle);
  }


  /**
  * Returns a new `Ray` with `start.y` set to `newY`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} newY - The y coordinate for the new `Ray`
  * @returns {Rac.Ray}
  */
  withY(newY) {
    return new Ray(this.rac, this.start.withY(newY), this.angle);
  }


  /**
  * Returns a new `Ray` with `angle` set to `newAngle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} newAngle - The angle for the new `Ray`
  * @returns {Rac.Ray}
  */
  withAngle(newAngle) {
    newAngle = this.rac.Angle.from(newAngle);
    return new Ray(this.rac, this.start, newAngle);
  }


  /**
  * Returns a new `Ray` with `angle` added to `this.angle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - The angle to add
  * @returns {Rac.Ray}
  */
  withAngleAdd(angle) {
    let newAngle = this.angle.add(angle);
    return new Ray(this.rac, this.start, newAngle);
  }


  /**
  * Returns a new `Ray` with `angle` set to
  * `this.{@link Rac.Angle#shift angle.shift}(angle, clockwise)`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - The angle to be shifted by
  * @param {boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Ray}
  */
  withAngleShift(angle, clockwise = true) {
    let newAngle = this.angle.shift(angle, clockwise);
    return new Ray(this.rac, this.start, newAngle);
  }


  /**
  * Returns a new `Ray` pointing towards
  * `{@link Rac.Angle#inverse angle.inverse()}`.
  * @returns {Rac.Ray}
  */
  inverse() {
    const inverseAngle = this.angle.inverse();
    return new Ray(this.rac, this.start, inverseAngle);
  }


  /**
  * Returns a new `Ray` pointing towards the
  * [perpendicular angle]{@link Rac.Angle#perpendicular} of
  * `angle` in the `clockwise` orientation.
  *
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Ray}
  * @see Rac.Angle#perpendicular
  */
  perpendicular(clockwise = true) {
    let perpendicular = this.angle.perpendicular(clockwise);
    return new Ray(this.rac, this.start, perpendicular);
  }


  /**
  * Returns a new `Ray` with `start` moved along the ray by the given
  * `distance`. All other properties are copied from `this`.
  *
  * When `distance` is negative, `start` is moved in
  * the inverse direction of `angle`.
  *
  * @param {number} distance - The distance to move `start` by
  * @returns {Rac.Ray}
  */
  translateToDistance(distance) {
    const newStart = this.start.pointToAngle(this.angle, distance);
    return new Ray(this.rac, newStart, this.angle);
  }


  /**
  * Returns a new `Ray` with `start` moved towards `angle` by the given
  * `distance`. All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to move `start` towards
  * @param {number} distance - The distance to move `start` by
  * @returns {Rac.Ray}
  */
  translateToAngle(angle, distance) {
    const newStart = this.start.pointToAngle(angle, distance);
    return new Ray(this.rac, newStart, this.angle);
  }


  /**
  * Returns a new `Ray` with `start` moved by the given distance toward the
  * `angle.perpendicular()`. All other properties are copied from `this`.
  *
  * @param {number} distance - The distance to move `start` by
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Ray}
  */
  translatePerpendicular(distance, clockwise = true) {
    let perpendicular = this.angle.perpendicular(clockwise);
    return this.translateToAngle(perpendicular, distance);
  }


  /**
  * Returns the angle from `this.start` to `point`.
  *
  * When `this.start` and `point` are considered
  * [equal]{@link Rac.Point#equals}, returns `this.angle`.
  *
  * @param {Rac.Point} point - A `Point` to measure the angle to
  * @returns {Rac.Angle}
  * @see Rac.Point#equals
  */
  angleToPoint(point) {
    return this.start.angleToPoint(point, this.angle);
  }


  /**
  * Returns a new `Point` located in the ray where the x coordinate is `x`.
  * When the ray is vertical, returns `null` since no single point with x
  * coordinate at `x` is possible.
  *
  * The ray is considered a unbounded line.
  *
  * @param {number} x - The x coordinate to calculate a point in the ray
  * @returns {Rac.Point}
  */
  pointAtX(x) {
    const slope = this.slope();
    if (slope === null) {
      // Vertical ray
      return null;
    }

    if (this.rac.unitaryEquals(slope, 0)) {
      // Horizontal ray
      return this.start.withX(x);
    }

    // y = mx + b
    const y = slope * x + this.yIntercept();
    return new Rac.Point(this.rac, x, y);
  }


  /**
  * Returns a new `Point` located in the ray where the y coordinate is `y`.
  * When the ray is horizontal, returns `null` since no single point with y
  * coordinate at `y` is possible.
  *
  * The ray is considered an unbounded line.
  *
  * @param {number} y - The y coordinate to calculate a point in the ray
  * @retursn {Rac.Point}
  */
  pointAtY(y) {
    const slope = this.slope();
    if (slope === null) {
      // Vertical ray
      return this.start.withY(y);
    }

    if (this.rac.unitaryEquals(slope, 0)) {
      // Horizontal ray
      return null;
    }

    // mx + b = y
    // x = (y - b)/m
    const x = (y - this.yIntercept()) / slope;
    return new Rac.Point(this.rac, x, y);
  }


  /**
  * Returns a new `Point` in the ray at the given `distance` from
  * `this.start`. When `distance` is negative, the new `Point` is calculated
  * in the inverse direction of `angle`.
  *
  * @param {number} distance - The distance from `this.start`
  * @returns {Rac.Point}
  */
  pointAtDistance(distance) {
    return this.start.pointToAngle(this.angle, distance);
  }


  /**
  * Returns a new `Point` at the intersection of `this` and `otherRay`.
  *
  * When the rays are parallel, returns `null` since no intersection is
  * possible.
  *
  * Both rays are considered unbounded lines.
  *
  * @param {Rac.Ray} otherRay - A `Ray` to calculate the intersection with
  * @returns {Rac.Point}
  */
  pointAtIntersection(otherRay) {
    const a = this.slope();
    const b = otherRay.slope();
    // Parallel lines, no intersection
    if (a === null && b === null) { return null; }
    if (this.rac.unitaryEquals(a, b)) { return null; }

    // Any vertical ray
    if (a === null) { return otherRay.pointAtX(this.start.x); }
    if (b === null) { return this.pointAtX(otherRay.start.x); }

    const c = this.yIntercept();
    const d = otherRay.yIntercept();

    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const x = (d - c) / (a - b);
    const y = a * x + c;
    return new Rac.Point(this.rac, x, y);
  }


  /**
  * Returns a new `Point` at the projection of `point` onto the ray. The
  * projected point is the closest possible point to `point`.
  *
  * The ray is considered an unbounded line.
  *
  * @param {Rac.Point} point - A `Point` to project onto the ray
  * @returns {Rac.Point}
  */
  pointProjection(point) {
    const perpendicular = this.angle.perpendicular();
    return point.ray(perpendicular)
      .pointAtIntersection(this);
  }


  /**
  * Returns the distance from `this.start` to the projection of `point`
  * onto the ray.
  *
  * The returned distance is positive when the projected point is towards
  * the direction of the ray, and negative when it is behind.
  *
  * @param {Rac.Point} point - A `Point` to project and measure the
  * distance to
  * @returns {number}
  */
  distanceToProjectedPoint(point) {
    const projected = this.pointProjection(point);
    const distance = this.start.distanceToPoint(projected);

    if (this.rac.equals(distance, 0)) {
      return 0;
    }

    const angleToProjected = this.start.angleToPoint(projected);
    const angleDiff = this.angle.subtract(angleToProjected);
    if (angleDiff.turn <= 1/4 || angleDiff.turn > 3/4) {
      return distance;
    } else {
      return -distance;
    }
  }


  /**
  * Returns `true` when the angle to the given `point` is located clockwise
  * of the ray or `false` when located counter-clockwise.
  *
  * * When `this.start` and `point` are considered
  * [equal]{@link Rac.Point#equals} or `point` lands on the ray, it is
  * considered clockwise. When `point` lands on the
  * [inverse]{@link Rac.Ray#inverse} of the ray, it is considered
  * counter-clockwise.
  *
  * @param {Rac.Point} point - A `Point` to measure the orientation to
  * @returns {boolean}
  * @see Rac.Point#equals
  * @see Rac.Ray#inverse
  */
  pointOrientation(point) {
    const pointAngle = this.start.angleToPoint(point, this.angle);
    if (this.angle.equals(pointAngle)) {
      return true;
    }

    const angleDistance = pointAngle.subtract(this.angle);
    // [0 to 0.5) is considered clockwise
    // [0.5, 1) is considered counter-clockwise
    return angleDistance.turn < 0.5;
  }


  /**
  * Returns a new `Ray` from `this.start` to `point`.
  *
  * When `this.start` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Ray` will use `this.angle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Ray` towards
  * @returns {Rac.Ray}
  * @see Rac.Point#equals
  */
  rayToPoint(point) {
    let newAngle = this.start.angleToPoint(point, this.angle);
    return new Ray(this.rac, this.start, newAngle);
  }


  /**
  * Returns a new `Segment` using `this` and the given `length`.
  * @param {number} length - The length of the new `Segment`
  * @returns {Rac.Segment}
  */
  segment(length) {
    return new Rac.Segment(this.rac, this, length);
  }


  /**
  * Returns a new `Segment` from `this.start` to `point`.
  *
  * When `this.start` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Segment` towards
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
  */
  segmentToPoint(point) {
    return this.start.segmentToPoint(point, this.angle);
  }


  /**
  * Returns a new `Segment` starting at `this.start` and ending at the
  * intersection of `this` and `otherRay`.
  *
  * When the rays are parallel, returns `null` since no intersection is
  * possible.
  *
  * When `this.start` and the intersection point are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle`.
  *
  * Both rays are considered unbounded lines.
  *
  * @param {Rac.Ray} otherRay - A `Ray` to calculate the intersection with
  * @returns {Rac.Segment}
  */
  segmentToIntersection(otherRay) {
    const intersection = this.pointAtIntersection(otherRay);
    if (intersection === null) {
      return null;
    }
    return this.segmentToPoint(intersection);
  }


  /**
  * Returns a new `Arc` with center at `this.start`, start at `this.angle`
  * and the given arc properties.
  *
  * @param {number} radius - The radius of the new `Arc`
  * @param {?Rac.Angle|number} [endAngle=null] - The end `Angle` of the new
  * `Arc`; when `null` or ommited, `this.angle` is used instead
  * @param {boolean=} clockwise=true - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arc(radius, endAngle = null, clockwise = true) {
    endAngle = endAngle === null
      ? this.angle
      : this.rac.Angle.from(endAngle);
    return new Rac.Arc(this.rac,
      this.start, radius,
      this.angle, endAngle,
      clockwise);
  }


  /**
  * Returns a new `Arc` with center at `this.start`, start at `this.angle`,
  * and end at the given `angleDistance` from `this.start` in the
  * `clockwise` orientation.
  *
  * @param {number} radius - The radius of the new `Arc`
  * @param {Rac.Angle|number} angleDistance - The angle distance from
  * `this.start` to the new `Arc` end
  * @param {boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arcToAngleDistance(radius, angleDistance, clockwise = true) {
    let endAngle = this.angle.shift(angleDistance, clockwise);
    return new Rac.Arc(this.rac,
      this.start, radius,
      this.angle, endAngle,
      clockwise);
  }

} // class Ray


module.exports = Ray;


},{"../Rac":2,"../util/utils":41}],15:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Segment of a `[Ray]{@link Rac.Ray}` up to a given length.
*
* @alias Rac.Segment
*/
class Segment {

  /**
  * Creates a new `Segment` instance.
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Rac.Ray} ray - A `Ray` the segment will be based of
  * @param {number} length - The length of the segment
  */
  constructor(rac, ray, length) {
    // TODO: different approach to error throwing?
    // assert || throw new Error(err.missingParameters)
    // or
    // checker(msg => { throw Rac.Exception.failedAssert(msg));
    //   .exists(rac)
    //   .isType(Rac.Ray, ray)
    //   .isNumber(length)

    utils.assertExists(rac, ray, length);
    utils.assertType(Rac.Ray, ray);
    utils.assertNumber(length);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The `Ray` the segment is based of.
    * @type {Rac.Ray}
    */
    this.ray = ray;

    /**
    * The length of the segment.
    * @type {number}
    */
    this.length = length;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.ray.start.x, digits);
    const yStr = utils.cutDigits(this.ray.start.y, digits);
    const turnStr = utils.cutDigits(this.ray.angle.turn, digits);
    const lengthStr = utils.cutDigits(this.length, digits);
    return `Segment((${xStr},${yStr}) a:${turnStr} l:${lengthStr})`;
  }


  /**
  * Returns `true` when `ray` and `length` in both segments are equal.
  *
  * When `otherSegment` is any class other that `Rac.Segment`, returns `false`.
  *
  * Segments' `length` are compared using `{@link Rac#equals}`.
  *
  * @param {Rac.Segment} otherSegment - A `Segment` to compare
  * @returns {boolean}
  * @see Rac.Ray#equals
  * @see Rac#equals
  */
  equals(otherSegment) {
    return otherSegment instanceof Segment
      && this.ray.equals(otherSegment.ray)
      && this.rac.equals(this.length, otherSegment.length);
  }


  /**
  * Returns the `[angle]{@link Rac.Ray#angle}` of the segment's `ray`.
  * @returns {Rac.Angle}
  */
  angle() {
    return this.ray.angle;
  }


  /**
  * Returns the `[start]{@link Rac.Ray#start}` of the segment's `ray`.
  * @returns {Rac.Point}
  */
  startPoint() {
    return this.ray.start;
  }


  /**
  * Returns a new `Point` where the segment ends.
  * @returns {Rac.Point}
  */
  endPoint() {
    return this.ray.pointAtDistance(this.length);
  }


  /**
  * Returns a new `Segment` with angle set to `newAngle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} newAngle - The angle for the new `Segment`
  * @returns {Rac.Segment}
  */
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    const newRay = new Rac.Ray(this.rac, this.ray.start, newAngle);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `ray` set to `newRay`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Ray} newRay - The ray for the new `Segment`
  * @returns {Rac.Segment}
  */
  withRay(newRay) {
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with start point set to `newStart`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Point} newStartPoint - The start point for the new
  * `Segment`
  * @returns {Rac.Segment}
  */
  withStartPoint(newStartPoint) {
    const newRay = this.ray.withStart(newStartPoint);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `length` set to `newLength`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} newLength - The length for the new `Segment`
  * @returns {Rac.Segment}
  */
  withLength(newLength) {
    return new Segment(this.rac, this.ray, newLength);
  }


  /**
  * Returns a new `Segment` with `length` added to `this.length`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} length - The length to add
  * @returns {Rac.Segment}
  */
  withLengthAdd(length) {
    return new Segment(this.rac, this.ray, this.length + length);
  }


  /**
  * Returns a new `Segment` with `length` set to `this.length * ratio`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} ratio - The factor to multiply `length` by
  * @returns {Rac.Segment}
  */
  withLengthRatio(ratio) {
    return new Segment(this.rac, this.ray, this.length * ratio);
  }


  /**
  * Returns a new `Segment` with `angle` added to `this.angle()`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - The angle to add
  * @returns {Rac.Segment}
  */
  withAngleAdd(angle) {
    const newRay = this.ray.withAngleAdd(angle);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `angle` set to
  * `this.ray.{@link Rac.Angle#shift angle.shift}(angle, clockwise)`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - The angle to be shifted by
  * @param {boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Segment}
  */
  withAngleShift(angle, clockwise = true) {
    const newRay = this.ray.withAngleShift(angle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved in the inverse
  * direction of the segment's ray by the given `distance`. The resulting
  * `Segment` will have the same `endPoint()` and `angle()` as `this`.
  *
  * Using a positive `distance` results in a longer segment, using a
  * negative `distance` results in a shorter one.
  *
  * @param {number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  withStartExtended(distance) {
    const newRay = this.ray.translateToDistance(-distance);
    return new Segment(this.rac, newRay, this.length + distance);
  }


  /**
  * Returns a new `Segment` pointing towards the
  * [perpendicular angle]{@link Rac.Angle#perpendicular} of
  * `this.angle()` in the `clockwise` orientation.
  *
  * The resulting `Segment` will have the same `startPoint()` and `length`
  * as `this`.
  *
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  * @see Rac.Angle#perpendicular
  */
  perpendicular(clockwise = true) {
    const newRay = this.ray.perpendicular(clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with its start point set at
  * `[this.endPoint()]{@link Rac.Segment#endPoint}`,
  * angle set to `this.angle().[inverse()]{@link Rac.Angle#inverse}`, and
  * same length as `this`.
  *
  * @returns {Rac.Segment}
  * @see Rac.Angle#inverse
  */
  reverse() {
    const end = this.endPoint();
    const inverseRay = new Rac.Ray(this.rac, end, this.ray.angle.inverse());
    return new Segment(this.rac, inverseRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved towards `angle` by
  * the given `distance`. All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to move the start point
    towards
  * @param {number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  translateToAngle(angle, distance) {
    const newRay = this.ray.translateToAngle(angle, distance);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved along the segment's
  * ray by the given `length`. All other properties are copied from `this`.
  *
  * When `length` is negative, `start` is moved in the inverse direction of
  * `angle`.
  *
  * @param {number} length - The length to move the start point by
  * @returns {Rac.Segment}
  */
  translateToLength(length) {
    const newRay = this.ray.translateToDistance(length);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved the given `distance`
  * towards the perpendicular angle to `this.angle()` in the `clockwise`
  * orientaton. All other properties are copied from `this`.
  *
  * @param {number} distance - The distance to move the start point by
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  */
  translatePerpendicular(distance, clockwise = true) {
    const newRay = this.ray.translatePerpendicular(distance, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns the given `value` clamped to [startInset, length-endInset].
  *
  * When `startInset` is greater that `length-endInset` the range for the
  * clamp becomes imposible to fulfill. In this case the returned value
  * will be the centered between the range limits and still clampled to
  * `[0, length]`.
  *
  * @param {number} value - A value to clamp
  * @param {number} [startInset=0] - The inset for the lower limit of the
  * clamping range
  * @param {endInset} [endInset=0] - The inset for the higher limit of the
  * clamping range
  * @returns {number}
  */
  clampToLength(value, startInset = 0, endInset = 0) {
    const endLimit = this.length - endInset;
    if (startInset >= endLimit) {
      // imposible range, return middle point
      const rangeMiddle = (startInset - endLimit) / 2;
      const middle = startInset - rangeMiddle;
      // Still clamp to the segment itself
      let clamped = middle;
      clamped = Math.min(clamped, this.length);
      clamped = Math.max(clamped, 0);
      return clamped;
    }
    let clamped = value;
    clamped = Math.min(clamped, this.length - endInset);
    clamped = Math.max(clamped, startInset);
    return clamped;
  }


  /**
  * Returns a new `Point` in the segment's ray at the given `length` from
  * `this.startPoint()`. When `length` is negative, the new `Point` is
  * calculated in the inverse direction of `this.angle()`.
  *
  * @param {number} length - The distance from `this.startPoint()`
  * @returns {Rac.Point}
  * @see Rac.Ray#pointAtDistance
  */
  pointAtLength(length) {
    return this.ray.pointAtDistance(length);
  }


  /**
  * Returns a new `Point` in the segment's ray at a distance of
  * `this.length * ratio` from `this.startPoint()`. When `ratio` is
  * negative, the new `Point` is calculated in the inverse direction of
  * `this.angle()`.
  *
  * @param {number} ratio - The factor to multiply `length` by
  * @returns {Rac.Point}
  * @see Rac.Ray#pointAtDistance
  */
  pointAtLengthRatio(ratio) {
    return this.ray.pointAtDistance(this.length * ratio);
  }


  /**
  * Returns a new `Point` at the middle point the segment.
  * @returns {Rac.Point}
  */
  pointAtBisector() {
    return this.ray.pointAtDistance(this.length/2);
  }


  /**
  * Returns a new `Segment` starting at `newStartPoint` and ending at
  * `this.endPoint()`.
  *
  * When `newStartPoint` and `this.endPoint()` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle()`.
  *
  * @param {Rac.Point} newStartPoint - The start point of the new `Segment`
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
  */
  moveStartPoint(newStartPoint) {
    const endPoint = this.endPoint();
    return newStartPoint.segmentToPoint(endPoint, this.ray.angle);
  }


  /**
  * Returns a new `Segment` starting at `this.startPoint()` and ending at
  * `newEndPoint`.
  *
  * When `this.startPoint()` and `newEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle()`.
  *
  * @param {Rac.Point} newEndPoint - The end point of the new `Segment`
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
  */
  moveEndPoint(newEndPoint) {
    return this.ray.segmentToPoint(newEndPoint);
  }


  /**
  * Returns a new `Segment` from the starting point to the segment's middle
  * point.
  *
  * @returns {Rac.Segment}
  * @see Rac.Segment#pointAtBisector
  */
  segmentToBisector() {
    return new Segment(this.rac, this.ray, this.length/2);
  }


  /**
  * Returns a new `Segment` from the segment's middle point towards the
  * perpendicular angle in the `clockwise` orientation.
  *
  * The new `Segment` will have the given `length`, or when ommited or
  * `null` will use `this.length` instead.
  *
  * @param {?number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  * @see Rac.Segment#pointAtBisector
  * @see Rac.Angle#perpendicular
  */
  segmentBisector(length = null, clockwise = true) {
    const newStart = this.pointAtBisector();
    const newAngle = this.ray.angle.perpendicular(clockwise);
    const newRay = new Rac.Ray(this.rac, newStart, newAngle);
    const newLength = length === null
      ? this.length
      : length;
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` with the given
  * `length` and the same angle as `this`.
  *
  * @param {number} length - The length of the next `Segment`
  * @returns {Rac.Segment}
  */
  nextSegmentWithLength(length) {
    const newStart = this.endPoint();
    const newRay = this.ray.withStart(newStart);
    return new Segment(this.rac, newRay, length);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` and up to the given
  * `nextEndPoint`.
  *
  * When `endPoint()` and `nextEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle()`.
  *
  * @param {Rac.Point} nextEndPoint - The end point of the next `Segment`
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
  */
  nextSegmentToPoint(nextEndPoint) {
    const newStart = this.endPoint();
    return newStart.segmentToPoint(nextEndPoint, this.ray.angle);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` towards `angle`
  * with the given `length`.
  *
  * The new `Segment` will have the given `length`, or when ommited or
  * `null` will use `this.length` instead.
  *
  * @param {Rac.Angle|number} angle - The angle of the new `Segment`
  * @param {?number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @returns {Rac.Segment}
  */
  nextSegmentToAngle(angle, length = null) {
    angle = Rac.Angle.from(this.rac, angle);
    const newLength = length === null
      ? this.length
      : length;
    const newStart = this.endPoint();
    const newRay = new Rac.Ray(this.rac, newStart, angle);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` towards the given
  * `angleDistance` from `this.angle().inverse()` in the `clockwise`
  * orientation.
  *
  * The new `Segment` will have the given `length`, or when ommited or
  * `null` will use `this.length` instead.
  *
  * Notice that the `angleDistance` is applied to the inverse of the
  * segment's angle. E.g. with an `angleDistance` of `0` the resulting
  * `Segment` will be directly over and pointing in the inverse angle of
  * `this`. As the `angleDistance` increases the two segments separate with
  * the pivot at `endPoint()`.
  *
  * @param {Rac.Angle|number} angleDistance - An angle distance to apply to
  * the segment's angle inverse
  * @param {boolean} [clockwise=true] - The orientation of the angle shift
  * from `endPoint()`
  * @param {?number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @returns {Rac.Segment}
  * @see Rac.Angle#inverse
  */
  nextSegmentToAngleDistance(angleDistance, clockwise = true, length = null) {
    angleDistance = this.rac.Angle.from(angleDistance);
    const newLength = length === null ? this.length : length;
    const newRay = this.ray
      .translateToDistance(this.length)
      .inverse()
      .withAngleShift(angleDistance, clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` towards the
  * `[perpendicular angle]{@link Rac.Angle#perpendicular}` of
  * `this.angle().inverse()` in the `clockwise` orientation.
  *
  * The new `Segment` will have the given `length`, or when ommited or
  * `null` will use `this.length` instead.
  *
  * Notice that the perpendicular is calculated from the inverse of the
  * segment's angle. E.g. with `clockwise` as `true`, the resulting
  * `Segment` will be pointing towards `this.angle().perpendicular(false)`.
  *
  * @param {boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @param {?number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @returns {Rac.Segment}
  * @see Rac.Angle#perpendicular
  */
  nextSegmentPerpendicular(clockwise = true, length = null) {
    const newLength = length === null
      ? this.length
      : length;
    const newRay = this.ray
      .translateToDistance(this.length)
      .perpendicular(!clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` which corresponds
  * to the leg of a right triangle where `this` is the other cathetus and
  * the hypotenuse is of length `hypotenuse`.
  *
  * The new `Segment` will point towards the perpendicular angle of
  * `[this.angle().[inverse()]{@link Rac.Angle#inverse}` in the `clockwise`
  * orientation.
  *
  * When `hypotenuse` is smaller that the segment's `length`, returns
  * `null` since no right triangle is possible.
  *
  * @param {number} hypotenuse - The length of the hypotenuse side of the
  * right triangle formed with `this` and the new `Segment`
  * @param {boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @returns {Rac.Segment}
  * @see Rac.Angle#inverse
  */
  nextSegmentLegWithHyp(hypotenuse, clockwise = true) {
    if (hypotenuse < this.length) {
      return null;
    }

    // cos = ady / hyp
    const radians = Math.acos(this.length / hypotenuse);
    // tan = ops / adj
    // tan * adj = ops
    const ops = Math.tan(radians) * this.length;
    return this.nextSegmentPerpendicular(clockwise, ops);
  }


  /**
  * Returns a new `Arc` based on this segment, with the given `endAngle`
  * and `clockwise` orientation.
  *
  * The returned `Arc` will use this segment's start as `center`, its angle
  * as `start`, and its length as `radius`.
  *
  * When `endAngle` is ommited or `null`, the segment's angle is used
  * instead resulting in a complete-circle arc.
  *
  * @param {?Rac.Angle} [endAngle=null] - An `Angle` to use as end for the
  * new `Arc`, or `null` to use `this.angle()`
  * @param {boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arc(endAngle = null, clockwise = true) {
    endAngle = endAngle === null
      ? this.ray.angle
      : Rac.Angle.from(this.rac, endAngle);
    return new Rac.Arc(this.rac,
      this.ray.start, this.length,
      this.ray.angle, endAngle,
      clockwise);
  }


  /**
  * Returns a new `Arc` based on this segment, with the arc's end at
  * `angleDistance` from the segment's angle in the `clockwise`
  * orientation.
  *
  * The returned `Arc` will use this segment's start as `center`, its angle
  * as `start`, and its length as `radius`.
  *
  * @param {Rac.Angle|number} angleDistance - The angle distance from the
  * segment's start to the new `Arc` end
  * @param {boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arcWithAngleDistance(angleDistance, clockwise = true) {
    angleDistance = this.rac.Angle.from(angleDistance);
    const stargAngle = this.ray.angle;
    const endAngle = stargAngle.shift(angleDistance, clockwise);

    return new Rac.Arc(this.rac,
      this.ray.start, this.length,
      stargAngle, endAngle,
      clockwise);
  }


  // TODO: uncomment once beziers are tested again
  // bezierCentralAnchor(distance, clockwise = true) {
  //   let bisector = this.segmentBisector(distance, clockwise);
  //   return new Rac.Bezier(this.rac,
  //     this.start, bisector.end,
  //     bisector.end, this.end);
  // }


} // Segment


module.exports = Segment;


},{"../Rac":2,"../util/utils":41}],16:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Contains two `[Composite]{@link Rac.Composite}` objects: `outline` and
* `contour`.
*
* Used by `[P5Drawer]{@link Rac.P5Drawer}` to draw the composites as a
* complex shape (`outline`) with an negative space shape inside (`contour`).
*
* @class
* @alias Rac.Shape
*/
function Shape(rac) {
  utils.assertExists(rac);

  this.rac = rac;
  this.outline = new Rac.Composite(rac);
  this.contour = new Rac.Composite(rac);
}


module.exports = Shape;


Shape.prototype.addOutline = function(element) {
  this.outline.add(element);
};

Shape.prototype.addContour = function(element) {
  this.contour.add(element);
};


},{"../Rac":2,"../util/utils":41}],17:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Format for drawing a `[Text]{@link Rac.Text}` object.
*
* @alias Rac.Text.Format
*/
class TextFormat {

  static defaultSize = 15;

  static horizontal = {
    left: "left",
    center: "horizontalCenter",
    right: "right"
  };

  static vertical = {
    top: "top",
    bottom: "bottom",
    center: "verticalCenter",
    baseline: "baseline"
  };

  constructor(
    rac,
    horizontal, vertical,
    font = null,
    angle = rac.Angle.zero,
    size = TextFormat.defaultSize)
  {
    utils.assertExists(rac);
    utils.assertString(horizontal, vertical);
    utils.assertType(Rac.Angle, angle);
    utils.assertNumber(size);
    this.rac = rac;
    this.horizontal = horizontal;
    this.vertical = vertical;
    this.font = font;
    this.angle = angle;
    this.size = size;
  }

  // Returns a format to draw text in the same position as `self` with
  // the inverse angle.
  inverse() {
    let hEnum = TextFormat.horizontal;
    let vEnum = TextFormat.vertical;
    let horizontal, vertical;
    switch (this.horizontal) {
      case hEnum.left:
        horizontal = hEnum.right; break;
      case hEnum.right:
        horizontal = hEnum.left; break;
      default:
        horizontal = this.horizontal; break;
    }
    switch (this.vertical) {
      case vEnum.top:
        vertical = vEnum.bottom; break;
      case vEnum.bottom:
        vertical = vEnum.top; break;
      default:
        vertical = this.vertical; break;
    }

    return new TextFormat(
      this.rac,
      horizontal, vertical,
      this.font,
      this.angle.inverse(),
      this.size)
  }

} // class TextFormat


/**
* String, format, and position to draw a text.
* @alias Rac.Text
*/
class Text {

  static Format = TextFormat;

  constructor(rac, point, string, format) {
    utils.assertExists(rac, point, string, format);
    utils.assertType(Rac.Point, point);
    utils.assertString(string);
    utils.assertType(Text.Format, format);
    this.rac = rac;
    this.point = point;
    this.string = string;
    this.format = format;
  }


  /**
  * Returns a string representation intended for human consumption.
  * @returns {string}
  */
  toString() {
    return `Text((${this.point.x},${this.point.y}) "${this.string}")`;
  }

} // class Text


module.exports = Text;


},{"../Rac":2,"../util/utils":41}],18:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `instance.Angle` function contains convenience methods and members
* for `{@link Rac.Angle}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Angle
*/
module.exports = function attachRacAngle(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * Returns an `Angle` derived from `something`.
  *
  * Calls`{@link Rac.Angle.from}` using `this`.
  *
  * @see Rac.Angle.from
  *
  * @param {number|Rac.Angle|Rac.Ray|Rac.Segment} something - An object to
  * derive an `Angle` from
  * @returns {Rac.Angle}
  *
  * @function from
  * @memberof instance.Angle#
  */
  rac.Angle.from = function(something) {
    return Rac.Angle.from(rac, something);
  };


  /**
  * Returns an `Angle` derived from `radians`.
  *
  * Calls `{@link Rac.Angle.fromRadians}` using `this`.
  *
  * @see Rac.Angle.fromRadians
  *
  * @param {number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  *
  * @function fromRadians
  * @memberof instance.Angle#
  */
  rac.Angle.fromRadians = function(radians) {
    return Rac.Angle.fromRadians(rac, radians);
  };


  /**
  * Returns an `Angle` derived from `degrees`.
  *
  * Calls `{@link Rac.Angle.fromDegrees}` using `this`.
  *
  * @see Rac.Angle.fromDegrees
  *
  * @param {number} degrees - The measure of the angle, in degrees
  * @returns {Rac.Angle}
  *
  * @function fromDegrees
  * @memberof instance.Angle#
  */
  rac.Angle.fromDegrees = function(degrees) {
    return Rac.Angle.fromDegrees(rac, degrees);
  };


  /**
  * An `Angle` with turn `0`.
  *
  * Also named as: `right`, `r`, `east`, `e`.
  *
  * @name zero
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.zero = rac.Angle(0.0);

  /**
  * An `Angle` with turn `1/2`.
  *
  * Also named as: `left`, `l`, `west`, `w`, `inverse`.
  *
  * @name half
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.half = rac.Angle(1/2);
  rac.Angle.inverse = rac.Angle.half;

  /**
  * An `Angle` with turn `1/4`.
  *
  * Also named as: `down`, `d`, `bottom`, `b`, `south`, `s`, `square`.
  *
  * @name quarter
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.quarter = rac.Angle(1/4);
  rac.Angle.square =  rac.Angle.quarter;

  /**
  * An `Angle` with turn `1/8`.
  *
  * Also named as: `bottomRight`, `br`, `se`.
  *
  * @name eighth
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.eighth =  rac.Angle(1/8);

  /**
  * An `Angle` with turn `7/8`, negative angle of
  * `{@link instance.Angle#eighth eighth}`.
  *
  * Also named as: `topRight`, `tr`, `ne`.
  *
  * @name neighth
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.neighth =  rac.Angle(-1/8);


  /**
  * An `Angle` with turn `1/16`.
  *
  * @name sixteenth
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.sixteenth = rac.Angle(1/16);

  /**
  * An `Angle` with turn `3/4`.
  *
  * Also named as: `up`, `u`, `top`, `t`.
  *
  * @name north
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.north = rac.Angle(3/4);
  rac.Angle.east  = rac.Angle(0/4);
  rac.Angle.south = rac.Angle(1/4);
  rac.Angle.west  = rac.Angle(2/4);

  rac.Angle.e = rac.Angle.east;
  rac.Angle.s = rac.Angle.south;
  rac.Angle.w = rac.Angle.west;
  rac.Angle.n = rac.Angle.north;

  rac.Angle.ne = rac.Angle.n.add(1/8);
  rac.Angle.se = rac.Angle.e.add(1/8);
  rac.Angle.sw = rac.Angle.s.add(1/8);
  rac.Angle.nw = rac.Angle.w.add(1/8);

  // North north-east
  rac.Angle.nne = rac.Angle.ne.add(-1/16);
  // East north-east
  rac.Angle.ene = rac.Angle.ne.add(+1/16);
  // North-east north
  rac.Angle.nen = rac.Angle.nne;
  // North-east east
  rac.Angle.nee = rac.Angle.ene;

  // East south-east
  rac.Angle.ese = rac.Angle.se.add(-1/16);
  // South south-east
  rac.Angle.sse = rac.Angle.se.add(+1/16);
  // South-east east
  rac.Angle.see = rac.Angle.ese;
  // South-east south
  rac.Angle.ses = rac.Angle.sse;

  // South south-west
  rac.Angle.ssw = rac.Angle.sw.add(-1/16);
  // West south-west
  rac.Angle.wsw = rac.Angle.sw.add(+1/16);
  // South-west south
  rac.Angle.sws = rac.Angle.ssw;
  // South-west west
  rac.Angle.sww = rac.Angle.wsw;

  // West north-west
  rac.Angle.wnw = rac.Angle.nw.add(-1/16);
  // North north-west
  rac.Angle.nnw = rac.Angle.nw.add(+1/16);
  // Nort-hwest west
  rac.Angle.nww = rac.Angle.wnw;
  // North-west north
  rac.Angle.nwn = rac.Angle.nnw;

  rac.Angle.right = rac.Angle.e;
  rac.Angle.down  = rac.Angle.s;
  rac.Angle.left  = rac.Angle.w;
  rac.Angle.up    = rac.Angle.n;

  rac.Angle.r = rac.Angle.right;
  rac.Angle.d = rac.Angle.down;
  rac.Angle.l = rac.Angle.left;
  rac.Angle.u = rac.Angle.up;

  rac.Angle.top    = rac.Angle.up;
  rac.Angle.bottom = rac.Angle.down;
  rac.Angle.t      = rac.Angle.top;
  rac.Angle.b      = rac.Angle.bottom;

  rac.Angle.topRight    = rac.Angle.ne;
  rac.Angle.tr          = rac.Angle.ne;
  rac.Angle.topLeft     = rac.Angle.nw;
  rac.Angle.tl          = rac.Angle.nw;
  rac.Angle.bottomRight = rac.Angle.se;
  rac.Angle.br          = rac.Angle.se;
  rac.Angle.bottomLeft  = rac.Angle.sw;
  rac.Angle.bl          = rac.Angle.sw;

} // attachRacAngle


},{"../Rac":2}],19:[function(require,module,exports){
'use strict';


/**
* The `instance.Arc` function contains convenience methods and members
* for `{@link Rac.Arc}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Arc
*/
module.exports = function attachRacArc(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A clockwise `Arc` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Arc}
  * @memberof instance.Arc#
  */
  rac.Arc.zero = rac.Arc(0, 0, 0, 0, 0, true);

} // attachRacArc


},{}],20:[function(require,module,exports){
'use strict';


/**
* The `instance.Bezier` function contains convenience methods and members
* for `{@link Rac.Bezier}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Bezier
*/
module.exports = function attachInstanceBezier(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Bezier` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Bezier}
  * @memberof instance.Bezier#
  */
  rac.Bezier.zero = rac.Bezier(
    0, 0, 0, 0,
    0, 0, 0, 0);

} // attachInstanceBezier


},{}],21:[function(require,module,exports){
'use strict';


/**
* The `instance.Point` function contains convenience methods and members
* for `{@link Rac.Point}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Point
*/
module.exports = function attachRacPoint(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Point` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Point}
  * @memberof instance.Point#
  */
  rac.Point.zero = rac.Point(0, 0);

  /**
  * A `Point` at `(0, 0)`.
  *
  * Equal to `{@link instance.Point#zero}`.
  *
  * @name origin
  * @type {Rac.Point}
  * @memberof instance.Point#
  */
  rac.Point.origin = rac.Point.zero;


} // attachRacPoint


},{}],22:[function(require,module,exports){
'use strict';


/**
* The `instance.Ray` function contains convenience methods and members
* for `{@link Rac.Ray}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Ray
*/
module.exports = function attachRacRay(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Ray` with all values set to zero, starts at
  * `{@link instance.Point#zero}` and points to
  * `{@link instance.Angle#zero}`.
  *
  * @name zero
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#zero
  * @see instance.Angle#zero
  */
  rac.Ray.zero = rac.Ray(0, 0, rac.Angle.zero);


  /**
  * A `Ray` over the x-axis, starts at `{@link instance.Point#origin}` and
  * points to `{@link instance.Angle#zero}`.
  *
  * Equal to `{@link instance.Ray#zero}`.
  *
  * @name xAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#zero
  */
  rac.Ray.xAxis = rac.Ray.zero;


  /**
  * A `Ray` over the y-axis, starts at`{@link instance.Point#origin}` and
  * points to `{@link instance.Angle#quarter}`.
  *
  * @name yAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#quarter
  */
  rac.Ray.yAxis = rac.Ray(0, 0, rac.Angle.quarter);

} // attachRacRay


},{}],23:[function(require,module,exports){
'use strict';


/**
* The `instance.Segment` function contains convenience methods and members
* for `{@link Rac.Segment}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Segment
*/
module.exports = function attachRacSegment(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Segment` with all values set to zero, , starts at
  * `{@link instance.Point#zero}`, points to
  * `{@link instance.Angle#zero}`, and has a length of zero.
  *
  * @name zero
  * @type {Rac.Segment}
  * @memberof instance.Segment#
  */
  rac.Segment.zero = rac.Segment(0, 0, 0, 0);

} // attachRacSegment


},{}],24:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `instance.Text` function contains convenience methods and members
* for `{@link Rac.Text}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Text
*/
module.exports = function attachRacText(rac) {
  // Intended to receive a Rac instance as parameter


  rac.Text.Format = function(
    horizontal, vertical,
    font = null,
    angle = rac.Angle.zero,
    size = Rac.Text.Format.defaultSize)
  {
    angle = rac.Angle.from(angle);
    return new Rac.Text.Format(
      rac,
      horizontal, vertical,
      font, angle, size);
  };


  rac.Text.Format.topLeft = rac.Text.Format(
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.top,
    rac.Angle.zero,
    Rac.Text.Format.defaultSize);

  /**
  * A `Text` for drawing `hello world` with `topLeft` format at
  * `Point.zero`.
  * @name hello
  * @memberof instance.Text#
  */
  rac.Text.hello = rac.Text(0, 0, 'hello world!',
    rac.Text.Format.topLeft);

  /**
  * A `Text` for drawing the pangram `sphinx of black quartz, judge my vow`
  * with `topLeft` format at `Point.zero`.
  * @name sphinx
  * @memberof instance.Text#
  */
  rac.Text.sphinx = rac.Text(0, 0, 'sphinx of black quartz, judge my vow',
    rac.Text.Format.topLeft);

} // attachRacPoint


},{"../Rac":2}],25:[function(require,module,exports){


// https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // https://github.com/amdjs/amdjs-api/blob/master/AMD.md
    // https://requirejs.org/docs/whyamd.html
    // AMD. Register as an anonymous module.

    // console.log(`Loading RAC for AMD - define:${typeof define}`);
    define([], factory);
    return;
  }

  if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.

    // console.log(`Loading RAC for Node - module:${typeof module}`);
    module.exports = factory();
    return;
  }

  // Browser globals (root is window)

  // console.log(`Loading RAC into self - root:${typeof root}`);
  root.Rac = factory();

}(typeof self !== 'undefined' ? self : this, function () {

  return require('./Rac');

}));


},{"./Rac":2}],26:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Drawer that uses a [P5](https://p5js.org/) instance for all drawing
* operations.
*
* @alias Rac.P5Drawer
*/
class P5Drawer {

  constructor(rac, p5){
    this.rac = rac;
    this.p5 = p5;
    this.drawRoutines = [];
    this.debugRoutines = [];
    this.applyRoutines = [];

    /**
    * Style used for debug drawing, when `null` the style already applied
    * is used.
    *
    * @type {object}
    */
    this.debugStyle = null;

    /**
    * Style used for text for debug drawing, when `null` the style already
    * applied is used.
    *
    * @type {object}
    */
    this.debugTextStyle = null;

    /**
    * Object with options used by the default implementation of
    * `drawable.debug()`.
    *
    * @type {object}
    */
    this.debugTextOptions = {
      font: 'monospace',
      size: Rac.Text.Format.defaultSize,
      fixedDigits: 2
    };

    /**
    * Radius of point markers for debug drawing.
    * @type {number}
    */
    this.debugPointRadius = 4;

    /**
    * Radius of the main visual elements for debug drawing.
    * @type {number}
    */
    this.debugMarkerRadius = 22;

    this.setupAllDrawFunctions();
    this.setupAllDebugFunctions();
    this.setupAllApplyFunctions();
  }

  // Adds a DrawRoutine for the given class.
  setDrawFunction(classObj, drawFunction) {
    let index = this.drawRoutines
      .findIndex(routine => routine.classObj === classObj);

    let routine;
    if (index === -1) {
      routine = new DrawRoutine(classObj, drawFunction);
    } else {
      routine = this.drawRoutines[index];
      routine.drawFunction = drawFunction;
      // Delete routine
      this.drawRoutines.splice(index, 1);
    }

    this.drawRoutines.push(routine);
  }

  setDrawOptions(classObj, options) {
    let routine = this.drawRoutines
      .find(routine => routine.classObj === classObj);
    if (routine === undefined) {
      console.log(`Cannot find routine for class - className:${classObj.name}`);
      throw Rac.Error.invalidObjectConfiguration
    }

    if (options.requiresPushPop !== undefined) {
      routine.requiresPushPop = options.requiresPushPop;
    }
  }

  setClassDrawStyle(classObj, style) {
    let routine = this.drawRoutines
      .find(routine => routine.classObj === classObj);
    if (routine === undefined) {
      console.log(`Cannot find routine for class - className:${classObj.name}`);
      throw Rac.Error.invalidObjectConfiguration
    }

    routine.style = style;
  }

  // Adds a DebugRoutine for the given class.
  setDebugFunction(classObj, debugFunction) {
    let index = this.debugRoutines
      .findIndex(routine => routine.classObj === classObj);

    let routine;
    if (index === -1) {
      routine = new DebugRoutine(classObj, debugFunction);
    } else {
      routine = this.debugRoutines[index];
      routine.debugFunction = debugFunction;
      // Delete routine
      this.debugRoutines.splice(index, 1);
    }

    this.debugRoutines.push(routine);
  }

  // Adds a ApplyRoutine for the given class.
  setApplyFunction(classObj, applyFunction) {
    let index = this.applyRoutines
      .findIndex(routine => routine.classObj === classObj);

    let routine;
    if (index === -1) {
      routine = new ApplyRoutine(classObj, applyFunction);
    } else {
      routine = this.applyRoutines[index];
      routine.drawFunction = drawFunction;
      // Delete routine
      this.applyRoutines.splice(index, 1);
    }

    this.applyRoutines.push(routine);
  }

  drawObject(object, style = null) {
    let routine = this.drawRoutines
      .find(routine => object instanceof routine.classObj);
    if (routine === undefined) {
      console.trace(`Cannot draw object - object-type:${utils.typeName(object)}`);
      throw Rac.Error.invalidObjectToDraw;
    }

    if (routine.requiresPushPop === true
      || style !== null
      || routine.style !== null)
    {
      this.p5.push();
      if (routine.style !== null) {
        routine.style.apply();
      }
      if (style !== null) {
        style.apply();
      }
      routine.drawFunction(this, object);
      this.p5.pop();
    } else {
      // No push-pull
      routine.drawFunction(this, object);
    }
  }

  // TODO: use directly number.toFixed
  debugNumber(number) {
    return number.toFixed(this.debugTextOptions.fixedDigits);
  }

  debugObject(object, drawsText) {
    let routine = this.debugRoutines
      .find(routine => object instanceof routine.classObj);
    if (routine === undefined) {
      // No routine, just draw object with debug style
      this.drawObject(object, this.debugStyle);
      return;
    }

    if (this.debugStyle !== null) {
      this.p5.push();
      this.debugStyle.apply();
      routine.debugFunction(this, object, drawsText);
      this.p5.pop();
    } else {
      routine.debugFunction(this, object, drawsText);
    }
  }

  applyObject(object) {
    let routine = this.applyRoutines
      .find(routine => object instanceof routine.classObj);
    if (routine === undefined) {
      console.trace(`Cannot apply object - object-type:${utils.typeName(object)}`);
      throw Rac.Error.invalidObjectToApply;
    }

    routine.applyFunction(this, object);
  }

  // Sets up all drawing routines for rac drawable clases.
  // Also attaches additional prototype and static functions in relevant
  // classes.
  setupAllDrawFunctions() {
    let functions = require('./draw.functions');

    // Point
    this.setDrawFunction(Rac.Point, functions.drawPoint);
    require('./Point.functions')(this.rac);

    // Ray
    this.setDrawFunction(Rac.Ray, functions.drawRay);
    require('./Ray.functions')(this.rac);

    // Segment
    this.setDrawFunction(Rac.Segment, functions.drawSegment);
    require('./Segment.functions')(this.rac);

    // Arc
    this.setDrawFunction(Rac.Arc, functions.drawArc);

    Rac.Arc.prototype.vertex = function() {
      let angleDistance = this.angleDistance();
      let beziersPerTurn = 5;
      let divisions = Math.ceil(angleDistance.turnOne() * beziersPerTurn);
      this.divideToBeziers(divisions).vertex();
    };

    // Bezier
    this.setDrawFunction(Rac.Bezier, (drawer, bezier) => {
      drawer.p5.bezier(
        bezier.start.x, bezier.start.y,
        bezier.startAnchor.x, bezier.startAnchor.y,
        bezier.endAnchor.x, bezier.endAnchor.y,
        bezier.end.x, bezier.end.y);
    });

    Rac.Bezier.prototype.vertex = function() {
      this.start.vertex()
      this.rac.drawer.p5.bezierVertex(
        this.startAnchor.x, this.startAnchor.y,
        this.endAnchor.x, this.endAnchor.y,
        this.end.x, this.end.y);
    };

    // Composite
    this.setDrawFunction(Rac.Composite, (drawer, composite) => {
      composite.sequence.forEach(item => item.draw());
    });

    Rac.Composite.prototype.vertex = function() {
      this.sequence.forEach(item => item.vertex());
    };

    // Shape
    this.setDrawFunction(Rac.Shape, (drawer, shape) => {
      drawer.p5.beginShape();
      shape.outline.vertex();

      if (shape.contour.isNotEmpty()) {
        drawer.p5.beginContour();
        shape.contour.vertex();
        drawer.p5.endContour();
      }
      drawer.p5.endShape();
    });

    Rac.Shape.prototype.vertex = function() {
      this.outline.vertex();
      this.contour.vertex();
    };

    // Text
    this.setDrawFunction(Rac.Text, (drawer, text) => {
      text.format.apply(text.point);
      drawer.p5.text(text.string, 0, 0);
    });
    this.setDrawOptions(Rac.Text, {requiresPushPop: true});

    // Applies all text properties and translates to the given `point`.
    // After the format is applied the text should be drawn at the origin.
    Rac.Text.Format.prototype.apply = function(point) {
      let hAlign;
      let hOptions = Rac.Text.Format.horizontal;
      switch (this.horizontal) {
        case hOptions.left:   hAlign = this.rac.drawer.p5.LEFT;   break;
        case hOptions.center: hAlign = this.rac.drawer.p5.CENTER; break;
        case hOptions.right:  hAlign = this.rac.drawer.p5.RIGHT;  break;
        default:
          console.trace(`Invalid horizontal configuration - horizontal:${this.horizontal}`);
          throw Rac.Error.invalidObjectConfiguration;
      }

      let vAlign;
      let vOptions = Rac.Text.Format.vertical;
      switch (this.vertical) {
        case vOptions.top:      vAlign = this.rac.drawer.p5.TOP;      break;
        case vOptions.bottom:   vAlign = this.rac.drawer.p5.BOTTOM;   break;
        case vOptions.center:   vAlign = this.rac.drawer.p5.CENTER;   break;
        case vOptions.baseline: vAlign = this.rac.drawer.p5.BASELINE; break;
        default:
          console.trace(`Invalid vertical configuration - vertical:${this.vertical}`);
          throw Rac.Error.invalidObjectConfiguration;
      }

      // Text properties
      this.rac.drawer.p5.textAlign(hAlign, vAlign);
      this.rac.drawer.p5.textSize(this.size);
      if (this.font !== null) {
        this.rac.drawer.p5.textFont(this.font);
      }

      // Positioning
      this.rac.drawer.p5.translate(point.x, point.y);
      if (this.angle.turn != 0) {
        this.rac.drawer.p5.rotate(this.angle.radians());
      }
    } // Rac.Text.Format.prototype.apply

  } // setupAllDrawFunctions


  // Sets up all debug routines for rac drawable clases.
  setupAllDebugFunctions() {
    let functions = require('./debug.functions');
    this.setDebugFunction(Rac.Point, functions.debugPoint);
    this.setDebugFunction(Rac.Ray, functions.debugRay);
    this.setDebugFunction(Rac.Segment, functions.debugSegment);
    this.setDebugFunction(Rac.Arc, functions.debugArc);

    Rac.Angle.prototype.debug = function(point, drawsText = false) {
      const drawer = this.rac.drawer;
      if (drawer.debugStyle !== null) {
        drawer.p5.push();
        drawer.debugStyle.apply();
        // TODO: could this be a good option to implement splatting arguments
        // into the debugFunction?
        functions.debugAngle(drawer, this, point, drawsText);
        drawer.p5.pop();
      } else {
        functions.debugAngle(drawer, this, point, drawsText);
      }
    };

    Rac.Point.prototype.debugAngle = function(angle, drawsText = false) {
      angle = this.rac.Angle.from(angle);
      angle.debug(this, drawsText);
      return this;
    };
  } // setupAllDebugFunctions


  // Sets up all applying routines for rac style clases.
  // Also attaches additional prototype functions in relevant classes.
  setupAllApplyFunctions() {
    // Color prototype functions
    Rac.Color.prototype.applyBackground = function() {
      this.rac.drawer.p5.background(this.r * 255, this.g * 255, this.b * 255);
    };

    Rac.Color.prototype.applyFill = function() {
      this.rac.drawer.p5.fill(this.r * 255, this.g * 255, this.b * 255, this.a * 255);
    };

    Rac.Color.prototype.applyStroke = function() {
      this.rac.drawer.p5.stroke(this.r * 255, this.g * 255, this.b * 255, this.a * 255);
    };

    // Stroke
    this.setApplyFunction(Rac.Stroke, (drawer, stroke) => {
      if (stroke.weight === null && stroke.color === null) {
        drawer.p5.noStroke();
        return;
      }

      if (stroke.color !== null) {
        stroke.color.applyStroke();
      }

      if (stroke.weight !== null) {
        drawer.p5.strokeWeight(stroke.weight);
      }
    });

    // Fill
    this.setApplyFunction(Rac.Fill, (drawer, fill) => {
      if (fill.color === null) {
        drawer.p5.noFill();
        return;
      }

      fill.color.applyFill();
    });

    // Style
    this.setApplyFunction(Rac.Style, (drawer, style) => {
      if (style.stroke !== null) {
        style.stroke.apply();
      }
      if (style.fill !== null) {
        style.fill.apply();
      }
    });

    Rac.Style.prototype.applyToClass = function(classObj) {
      this.rac.drawer.setClassDrawStyle(classObj, this);
    }

  } // setupAllApplyFunctions

} // class P5Drawer

module.exports = P5Drawer;


// Encapsulates the drawing function and options for a specific class.
// The draw function is called with two parameters: the instance of the
// drawer, and the object to draw.
//
// Optionally a `style` can be asigned to always be applied before
// drawing an instance of the associated class. This style will be
// applied before any styles provided to the `draw` function.
//
// Optionally `requiresPushPop` can be set to `true` to always peform
// a `push` and `pop` before and after all the style and drawing in
// the routine. This is intended for objects which drawing operations
// may need to push transformation to the stack.
class DrawRoutine {
  constructor (classObj, drawFunction) {
    this.classObj = classObj;
    this.drawFunction = drawFunction;
    this.style = null;

    // Options
    this.requiresPushPop = false;
  }
} // DrawRoutine


class DebugRoutine {
  constructor (classObj, debugFunction) {
    this.classObj = classObj;
    this.debugFunction = debugFunction;
  }
}


class ApplyRoutine {
  constructor (classObj, applyFunction) {
    this.classObj = classObj;
    this.applyFunction = applyFunction;
  }
}


},{"../Rac":2,"../util/utils":41,"./Point.functions":27,"./Ray.functions":28,"./Segment.functions":29,"./debug.functions":30,"./draw.functions":31}],27:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachPointFunctions(rac) {

  /**
  * Calls `p5.vertex` to represent this `Point`.
  *
  * Added  to `Rac.Point.prototype` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  */
  Rac.Point.prototype.vertex = function() {
    this.rac.drawer.p5.vertex(this.x, this.y);
  };

  /**
  * Returns a `Point` at the current position of the pointer.
  *
  * Added to `instance.Point` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Point}
  *
  * @function pointer
  * @memberof instance.Point#
  */
  rac.Point.pointer = function() {
    return rac.Point(rac.drawer.p5.mouseX, rac.drawer.p5.mouseY);
  };

  /**
  * Returns a `Point` at the center of the canvas.
  *
  * Added to `instance.Point` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Point}
  *
  * @function canvasCenter
  * @memberof instance.Point#
  */
  rac.Point.canvasCenter = function() {
    return rac.Point(rac.drawer.p5.width/2, rac.drawer.p5.height/2);
  };

  /**
  * Returns a `Point` at the end of the canvas, that is, at the position
  * `(width,height)`.
  *
  * Added to `instance.Point` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Point}
  *
  * @function canvasEnd
  * @memberof instance.Point#
  */
  rac.Point.canvasEnd = function() {
    return rac.Point(rac.drawer.p5.width, rac.drawer.p5.height);
  };

} // attachPointFunctions


},{"../Rac":2,"../util/utils":41}],28:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachRayFunctions(rac) {

  /**
  * Returns a new `Point` located where the ray touches the canvas edge.
  *
  * When the ray is outside the canvas and pointing away, `null` is
  * returned.
  *
  * Added  to `Rac.Ray.prototype` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  * @returns {?Rac.Point}
  */
  Rac.Ray.prototype.pointAtCanvasEdge = function(margin = 0) {
    let edgeRay = this.rayAtCanvasEdge(margin);
    if (edgeRay == null) {
      return null;
    }

    return edgeRay.start;
  };


  /**
  * Returns a new `Ray` that starts at the point where the `this` touches
  * the canvas edge and pointed towards the inside of the canvas.
  *
  * When the ray is outside the canvas and pointing away, `null` is
  * returned.
  *
  * Added  to `Rac.Ray.prototype` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {?Rac.Ray}
  */
  Rac.Ray.prototype.rayAtCanvasEdge = function(margin = 0) {
    const turn = this.angle.turn;
    const p5 = this.rac.drawer.p5;

    const downEdge  = p5.height - margin;
    const leftEdge  = margin;
    const upEdge    = margin;
    const rightEdge = p5.width - margin;

    // pointing down
    if (turn >= 1/8 && turn < 3/8) {
      let edgeRay = null;
      if (this.start.y < downEdge) {
        edgeRay = this.pointAtY(downEdge).ray(this.rac.Angle.up);
        if (edgeRay.start.x > rightEdge) {
          edgeRay = this.pointAtX(rightEdge).ray(this.rac.Angle.left);
        } else if (edgeRay.start.x < leftEdge) {
          edgeRay = this.pointAtX(leftEdge).ray(this.rac.Angle.right);
        }
      }
      return edgeRay;
    }

    // pointing left
    if (turn >= 3/8 && turn < 5/8) {
      let edgeRay = null;
      if (this.start.x >= leftEdge) {
        edgeRay = this.pointAtX(leftEdge).ray(this.rac.Angle.right);
        if (edgeRay.start.y > downEdge) {
          edgeRay = this.pointAtY(downEdge).ray(this.rac.Angle.up);
        } else if (edgeRay.start.y < upEdge) {
          edgeRay = this.pointAtY(upEdge).ray(this.rac.Angle.down);
        }
      }
      return edgeRay;
    }

    // pointing up
    if (turn >= 5/8 && turn < 7/8) {
      let edgeRay = null;
      if (this.start.y >= upEdge) {
        edgeRay = this.pointAtY(upEdge).ray(this.rac.Angle.down);
        if (edgeRay.start.x > rightEdge) {
          edgeRay = this.pointAtX(rightEdge).ray(this.rac.Angle.left);
        } else if (edgeRay.start.x < leftEdge) {
          edgeRay = this.pointAtX(leftEdge).ray(this.rac.Angle.right);
        }
      }
      return edgeRay;
    }

    // pointing right
    let edgeRay = null;
    if (this.start.x < rightEdge) {
      edgeRay = this.pointAtX(rightEdge).ray(this.rac.Angle.left);
      if (edgeRay.start.y > downEdge) {
          edgeRay = this.pointAtY(downEdge).ray(this.rac.Angle.up);
        } else if (edgeRay.start.y < upEdge) {
          edgeRay = this.pointAtY(upEdge).ray(this.rac.Angle.down);
        }
    }
    return edgeRay;
  };

} // attachRayFunctions


},{"../Rac":2,"../util/utils":41}],29:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachSegmentFunctions(rac) {

  /**
  * Calls `p5.vertex` to represent this `Segment`.
  *
  * Added  to `Rac.Segment.prototype` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  */
  Rac.Segment.prototype.vertex = function() {
    this.startPoint().vertex();
    this.endPoint().vertex();
  };


  /**
  * Returns a `Segment` that covers the top of the canvas, from top-left to
  * top-right.
  *
  * Added  to `instance.Segment` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Segment}
  *
  * @function canvasTop
  * @memberof instance.Segment#
  */
  rac.Segment.canvasTop = function() {
    return rac.Point.zero
      .segmentToAngle(rac.Angle.right, rac.drawer.p5.width);
  };


  /**
  * Returns a `Segment` that covers the left of the canvas, from top-left
  * to bottom-left.
  *
  * Added  to `instance.Segment` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Segment}
  *
  * @function canvasLeft
  * @memberof instance.Segment#
  */
  rac.Segment.canvasLeft = function() {
    return rac.Point.zero
      .segmentToAngle(rac.Angle.down, rac.drawer.p5.height);
  };


  /**
  * Returns a `Segment` that covers the right of the canvas, from top-right
  * to bottom-right.
  *
  * Added  to `instance.Segment` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Segment}
  *
  * @function canvasRight
  * @memberof instance.Segment#
  */
  rac.Segment.canvasRight = function() {
    const topRight = rac.Point(rac.drawer.p5.width, 0);
    return topRight
      .segmentToAngle(rac.Angle.down, rac.drawer.p5.height);
  };


  /**
  * Returns a `Segment` that covers the bottom of the canvas, from
  * bottom-left to bottom-right.
  *
  * Added  to `instance.Segment` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Segment}
  *
  * @function canvasBottom
  * @memberof instance.Segment#
  */
  rac.Segment.canvasBottom = function() {
    let bottomLeft = rac.Point(0, rac.drawer.p5.height);
    return bottomLeft
      .segmentToAngle(rac.Angle.right, rac.drawer.p5.width);
  };



} // attachSegmentFunctions


},{"../Rac":2,"../util/utils":41}],30:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


function reversesText(angle) {
  return angle.turn < 3/4 && angle.turn >= 1/4;
}


exports.debugAngle = function(drawer, angle, point, drawsText) {
  const rac = drawer.rac;
  const pointRadius = drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  // Zero segment
  point
    .segmentToAngle(rac.Angle.zero, markerRadius)
    .draw();

  // Angle segment
  let angleSegment = point
    .segmentToAngle(angle, markerRadius * 1.5);
  angleSegment.endPoint()
    .arc(pointRadius, angle, angle.inverse(), false)
    .draw();
  angleSegment
    .withLengthAdd(pointRadius)
    .draw();

  // Mini arc markers
  let angleArc = point.arc(markerRadius, rac.Angle.zero, angle);
  let context = drawer.p5.drawingContext;
  let strokeWeight = context.lineWidth;
  context.save(); {
    context.lineCap = 'butt';
    context.setLineDash([6, 4]);
    // Angle arc
    angleArc.draw();

    if (!angleArc.isCircle()) {
      // Outside angle arc
      context.setLineDash([2, 4]);
      angleArc
        .withRadius(markerRadius*3/4)
        .withClockwise(false)
        .draw();
    }
  };
  context.restore();

  // Text
  if (drawsText !== true) { return; }

  // Normal orientation
  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.center,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    format = format.inverse();
  }

  // Turn text
  let turnString = `turn:${drawer.debugNumber(angle.turn)}`;
  point
    .pointToAngle(angle, markerRadius*2)
    .text(turnString, format)
    .draw(drawer.debugTextStyle);
}; // debugAngle


exports.debugPoint = function(drawer, point, drawsText) {
  const rac = drawer.rac;
  const pointRadius = drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  point.draw();

  // Point marker
  point.arc(pointRadius).draw();

  // Point reticule marker
  let arc = point
    .arc(markerRadius, rac.Angle.s, rac.Angle.e)
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(1/2)
    .draw();
  arc.endSegment()
    .reverse()
    .withLengthRatio(1/2)
    .draw();

  // Text
  if (drawsText !== true) { return; }

  let string = `x:${drawer.debugNumber(point.x)}\ny:${drawer.debugNumber(point.y)}`;
  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.top,
    drawer.debugTextOptions.font,
    rac.Angle.e,
    drawer.debugTextOptions.size);
  point
    .pointToAngle(rac.Angle.se, pointRadius*2)
    .text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


exports.debugRay = function(drawer, ray, drawsText) {
  const rac = drawer.rac;
  const pointRadius = drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  ray.draw();

  // Little circle at start marker
  ray.start.arc(pointRadius).draw();

  // Half circle at start
  const perpAngle = ray.angle.perpendicular();
  const startArc = ray.start
    .arc(markerRadius, perpAngle, perpAngle.inverse())
    .draw();
  startArc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  startArc.endSegment().reverse()
    .withLengthRatio(0.5)
    .draw();

  // Edge end half circle
  const edgeRay = ray.rayAtCanvasEdge();
  if (edgeRay != null) {
    const edgeArc = edgeRay
      .translateToDistance(pointRadius)
      .perpendicular(false)
      .arcToAngleDistance(markerRadius/2, 0.5)
      .draw();
    edgeArc.startSegment()
      .reverse()
      .withLength(pointRadius)
      .draw();
    edgeArc.endSegment()
      .reverse()
      .withLength(pointRadius)
      .draw();
    edgeArc.radiusSegmentAtAngle(edgeRay.angle)
      .reverse()
      .withLength(pointRadius)
      .draw();
  }

  // Text
  if (drawsText !== true) { return; }

  const angle  = ray.angle;
  const hFormat = Rac.Text.Format.horizontal;
  const vFormat = Rac.Text.Format.vertical;
  const font   = drawer.debugTextOptions.font;
  const size   = drawer.debugTextOptions.size;
  const digits = drawer.debugTextOptions.fixedDigits;

  // Normal orientation
  let startFormat = new Rac.Text.Format(rac,
    hFormat.left, vFormat.bottom,
    font, angle, size);
  let angleFormat = new Rac.Text.Format(rac,
    hFormat.left, vFormat.top,
    font, angle, size);
  if (reversesText(angle)) {
    // Reverse orientation
    startFormat = startFormat.inverse();
    angleFormat = angleFormat.inverse();
  }

  // Start text
  const startString = `start:(${ray.start.x.toFixed(digits)},${ray.start.y.toFixed(digits)})`;
  ray.start
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.subtract(1/4), markerRadius/2)
    .text(startString, startFormat)
    .draw(drawer.debugTextStyle);

  // Angle text
  const angleString = `angle:${angle.turn.toFixed(digits)}`;
  ray.start
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.add(1/4), markerRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugRay


exports.debugSegment = function(drawer, segment, drawsText) {
  const rac = drawer.rac;
  const pointRadius = drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  segment.draw();

  // Little circle at start marker
  segment.withLength(pointRadius)
    .arc()
    .draw();

  // Half circle start segment
  let perpAngle = segment.angle().perpendicular();
  let arc = segment.startPoint()
    .arc(markerRadius, perpAngle, perpAngle.inverse())
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  arc.endSegment()
    .reverse()
    .withLengthRatio(0.5)
    .draw();

  // Perpendicular end marker
  let endMarkerStart = segment
    .nextSegmentPerpendicular()
    .withLength(markerRadius/2)
    .withStartExtended(-pointRadius)
    .draw();
  let endMarkerEnd = segment
    .nextSegmentPerpendicular(false)
    .withLength(markerRadius/2)
    .withStartExtended(-pointRadius)
    .draw();
  // Little end half circle
  segment.endPoint()
    .arc(pointRadius, endMarkerStart.angle(), endMarkerEnd.angle())
    .draw();

  // Forming end arrow
  let arrowAngleShift = rac.Angle.from(1/7);
  let endArrowStart = endMarkerStart
    .reverse()
    .ray.withAngleShift(arrowAngleShift, false);
  let endArrowEnd = endMarkerEnd
    .reverse()
    .ray.withAngleShift(arrowAngleShift, true);
  let endArrowPoint = endArrowStart
    .pointAtIntersection(endArrowEnd);
  // End arrow
  endMarkerStart
    .nextSegmentToPoint(endArrowPoint)
    .draw()
    .nextSegmentToPoint(endMarkerEnd.endPoint())
    .draw();


  // Text
  if (drawsText !== true) { return; }

  let angle = segment.angle();
  // Normal orientation
  let lengthFormat = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.bottom,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  let angleFormat = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.top,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    lengthFormat = lengthFormat.inverse();
    angleFormat = angleFormat.inverse();
  }

  // Length
  let lengthString = `length:${drawer.debugNumber(segment.length)}`;
  segment.startPoint()
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.subtract(1/4), markerRadius/2)
    .text(lengthString, lengthFormat)
    .draw(drawer.debugTextStyle);

    // Angle
  let angleString = `angle:${drawer.debugNumber(angle.turn)}`;
  segment.startPoint()
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.add(1/4), markerRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  const rac = drawer.rac;
  const pointRadius = drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  arc.draw();

  // Center markers
  let centerArcRadius = markerRadius * 2/3;
  if (arc.radius > markerRadius/3 && arc.radius < markerRadius) {
    // If radius is to close to the center-arc markers
    // Make the center-arc be outside of the arc
    centerArcRadius = arc.radius + markerRadius/3;
  }

  // Center start segment
  let centerArc = arc.withRadius(centerArcRadius);
  centerArc.startSegment().draw();

  // Radius
  let radiusMarkerLength = arc.radius
    - centerArcRadius
    - markerRadius/2
    - pointRadius*2;
  if (radiusMarkerLength > 0) {
    arc.startSegment()
      .withLength(radiusMarkerLength)
      .translateToLength(centerArcRadius + pointRadius*2)
      .draw();
  }

  // Mini arc markers
  let context = drawer.p5.drawingContext;
  let strokeWeight = context.lineWidth;
  context.save(); {
    context.lineCap = 'butt';
    context.setLineDash([6, 4]);
    centerArc.draw();

    if (!centerArc.isCircle()) {
      // Outside angle arc
      context.setLineDash([2, 4]);
      centerArc
        .withClockwise(!centerArc.clockwise)
        .draw();
    }
  };
  context.restore();

  // Center end segment
  if (!arc.isCircle()) {
    centerArc.endSegment().reverse().withLengthRatio(1/2).draw();
  }

  // Start point marker
  let startPoint = arc.startPoint();
  startPoint
    .arc(pointRadius).draw();
  startPoint
    .segmentToAngle(arc.start, markerRadius)
    .withStartExtended(-markerRadius/2)
    .draw();

  // Orientation marker
  let orientationLength = markerRadius*2;
  let orientationArc = arc
    .startSegment()
    .withLengthAdd(markerRadius)
    .arc(null, arc.clockwise)
    .withLength(orientationLength)
    .draw();
  let arrowCenter = orientationArc
    .reverse()
    .withLength(markerRadius/2)
    .chordSegment();
  let arrowAngle = 3/32;
  arrowCenter.withAngleShift(-arrowAngle).draw();
  arrowCenter.withAngleShift(arrowAngle).draw();

  // Internal end point marker
  let endPoint = arc.endPoint();
  let internalLength = Math.min(markerRadius/2, arc.radius);
  internalLength -= pointRadius;
  if (internalLength > rac.equalityThreshold) {
    endPoint
      .segmentToAngle(arc.end.inverse(), internalLength)
      .translateToLength(pointRadius)
      .draw();
  }

  // External end point marker
  let textJoinThreshold = markerRadius*3;
  let lengthAtOrientationArc = orientationArc
    .withEnd(arc.end)
    .length();
  let externalLength = lengthAtOrientationArc > textJoinThreshold && drawsText === true
    ? markerRadius - pointRadius
    : markerRadius/2 - pointRadius;

  endPoint
    .segmentToAngle(arc.end, externalLength)
    .translateToLength(pointRadius)
    .draw();

  // End point little arc
  if (!arc.isCircle()) {
    endPoint
      .arc(pointRadius, arc.end, arc.end.inverse(), arc.clockwise)
      .draw();
  }

  // Text
  if (drawsText !== true) { return; }

  let hFormat = Rac.Text.Format.horizontal;
  let vFormat = Rac.Text.Format.vertical;

  let headVertical = arc.clockwise
    ? vFormat.top
    : vFormat.bottom;
  let tailVertical = arc.clockwise
    ? vFormat.bottom
    : vFormat.top;
  let radiusVertical = arc.clockwise
    ? vFormat.bottom
    : vFormat.top;

  // Normal orientation
  let headFormat = new Rac.Text.Format(
    rac,
    hFormat.left,
    headVertical,
    drawer.debugTextOptions.font,
    arc.start,
    drawer.debugTextOptions.size);
  let tailFormat = new Rac.Text.Format(
    rac,
    hFormat.left,
    tailVertical,
    drawer.debugTextOptions.font,
    arc.end,
    drawer.debugTextOptions.size);
  let radiusFormat = new Rac.Text.Format(
    rac,
    hFormat.left,
    radiusVertical,
    drawer.debugTextOptions.font,
    arc.start,
    drawer.debugTextOptions.size);

  // Reverse orientation
  if (reversesText(arc.start)) {
    headFormat = headFormat.inverse();
    radiusFormat = radiusFormat.inverse();
  }
  if (reversesText(arc.end)) {
    tailFormat = tailFormat.inverse();
  }

  let startString = `start:${drawer.debugNumber(arc.start.turn)}`;
  let radiusString = `radius:${drawer.debugNumber(arc.radius)}`;
  let endString = `end:${drawer.debugNumber(arc.end.turn)}`;

  let angleDistance = arc.angleDistance();
  let distanceString = `distance:${drawer.debugNumber(angleDistance.turn)}`;

  let tailString = `${distanceString}\n${endString}`;
  let headString;

  // Radius label
  if (angleDistance.turn <= 3/4 && !arc.isCircle()) {
    // Radius drawn separately
    let perpAngle = arc.start.perpendicular(!arc.clockwise);
    arc.center
      .pointToAngle(arc.start, markerRadius)
      .pointToAngle(perpAngle, pointRadius*2)
      .text(radiusString, radiusFormat)
      .draw(drawer.debugTextStyle);
    headString = startString;
  } else {
    // Radius joined to head
    headString = `${startString}\n${radiusString}`;
  }

  if (lengthAtOrientationArc > textJoinThreshold) {
    // Draw strings separately
    orientationArc.startPoint()
      .pointToAngle(arc.start, markerRadius/2)
      .text(headString, headFormat)
      .draw(drawer.debugTextStyle);
    orientationArc.pointAtAngle(arc.end)
      .pointToAngle(arc.end, markerRadius/2)
      .text(tailString, tailFormat)
      .draw(drawer.debugTextStyle);
  } else {
    // Draw strings together
    let allStrings = `${headString}\n${tailString}`;
    orientationArc.startPoint()
      .pointToAngle(arc.start, markerRadius/2)
      .text(allStrings, headFormat)
      .draw(drawer.debugTextStyle);
  }
}; // debugArc


// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape
// TODO: debug routine of Text


},{"../Rac":2}],31:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


exports.drawPoint = function(drawer, point) {
  drawer.p5.point(point.x, point.y);
}; // drawPoint


exports.drawRay = function(drawer, ray) {
  let edgePoint = ray.pointAtCanvasEdge();

  if (edgePoint === null) {
    // Ray is outside canvas
    return;
  }

  drawer.p5.line(
    ray.start.x, ray.start.y,
    edgePoint.x, edgePoint.y);
}; // drawRay


exports.drawSegment = function(drawer, segment) {
  const start = segment.ray.start;
  const end = segment.endPoint();
  drawer.p5.line(
    start.x, start.y,
    end.x,   end.y);
}; // drawSegment


exports.drawArc = function(drawer, arc) {
  if (arc.isCircle()) {
    let startRad = arc.start.radians();
    let endRad = startRad + Rac.TAU;
    drawer.p5.arc(
      arc.center.x, arc.center.y,
      arc.radius * 2, arc.radius * 2,
      startRad, endRad);
    return;
  }

  let start = arc.start;
  let end = arc.end;
  if (!arc.clockwise) {
    start = arc.end;
    end = arc.start;
  }

  drawer.p5.arc(
    arc.center.x, arc.center.y,
    arc.radius * 2, arc.radius * 2,
    start.radians(), end.radians());
}; // drawArc


},{"../Rac":2}],32:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Color with RBGA values, each one on the *[0,1]* range.
*
* @alias Rac.Color
*/
class Color {

  /**
  * Creates a new `Color` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} r - The red channel value, in the *[0,1]* range
  * @param {number} g - The green channel value, in the *[0,1]* range
  * @param {number} b - The blue channel value, in the *[0,1]* range
  * @param {number} [a=1] - The alpha channel value, in the *[0,1]* range
  */
  constructor(rac, r, g, b, a = 1) {
    utils.assertExists(rac, r, g, b, a);
    utils.assertNumber(r, g, b, a);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The red channel of the color, in the *[0,1]* range.
    * @type {number}
    */
    this.r = r;

    /**
    * The green channel of the color, in the *[0,1]* range.
    * @type {number}
    */
    this.g = g;

    /**
    * The blue channel of the color, in the *[0,1]* range.
    * @type {number}
    */
    this.b = b;

    /**
    * The alpha channel of the color, in the *[0,1]* range.
    * @type {number}
    */
    this.a = a;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @returns {string}
  */
  toString() {
    return `Color(${this.r},${this.g},${this.b},${this.a})`;
  }


  /**
  * Creates a new `Color` instance with each channel received in the
  * *[0,255]* range
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} r - The red channel value, in the *[0,255]* range
  * @param {number} g - The green channel value, in the *[0,255]* range
  * @param {number} b - The blue channel value, in the *[0,255]* range
  * @param {number} [a=255] - The alpha channel value, in the *[0,255]* range
  *
  * @returns {Rac.Color}
  */
  static fromRgba(rac, r, g, b, a = 255) {
    return new Color(rac, r/255, g/255, b/255, a/255);
  }


  /**
  * Creates a new `Color` instance from a hexadecimal triplet string.
  *
  * The `hexString` is expected to have 6 digits and can optionally start
  * with `#`. `AABBCC` and `#DDEEFF` are both valid inputs, the three digit
  * shorthand is not yet supported.
  *
  * An error is thrown if `hexString` is misformatted or cannot be parsed.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {string} hexString - The RGB hex triplet to interpret
  *
  * @returns {Rac.Color}
  */
  static fromHex(rac, hexString) {
    if (hexString.charAt(0) == '#') {
      hexString = hexString.substring(1);
    }

    if (hexString.length != 6) {
      throw Rac.Exception.failedAssert(
        `Unexpected length for hex triplet string: ${hexString}`);
    }

    let rStr = hexString.substring(0, 2);
    let gStr = hexString.substring(2, 4);
    let bStr = hexString.substring(4, 6);

    let newR = parseInt(rStr, 16);
    let newG = parseInt(gStr, 16);
    let newB = parseInt(bStr, 16);

    if (isNaN(newR) || isNaN(newG) || isNaN(newB)) {
      throw Rac.Exception.failedAssert(
        `Could not parse hex triplet string: ${hexString}`);
    }

    return new Color(rac, newR/255, newG/255, newB/255);
  }


  /**
  * Returns a new `Fill` that uses `this` as `color`.
  *
  * @returns {Rac.Fill}
  */
  fill() {
    return new Rac.Fill(this.rac, this);
  }


  /**
  * Returns a new `Stroke` that uses `this` as `color`.
  *
  * @param {?number} weight - The weight of the new `Stroke`
  * @returns {Rac.Stroke}
  */
  stroke(weight = null) {
    return new Rac.Stroke(this.rac, weight, this);
  }


  /**
  * Returns a new `Color` with `a` set to `newAlpha`.
  *
  * @param {number} newAlpha - The alpha channel for the new `Color`, in the
  *   *[0,1]* range
  * @returns {Rac.Color}
  */
  withAlpha(newAlpha) {
    return new Color(this.rac, this.r, this.g, this.b, newAlpha);
  }


  /**
  * Returns a new `Color` with `a` set to `this.a * ratio`.
  *
  * @param {number} ratio - The factor to multiply `a` by
  * @returns {Rac.Color}
  */
  withAlphaRatio(ratio) {
    return new Color(this.rac, this.r, this.g, this.b, this.a * ratio);
  }


  /**
  * Returns a new `Color` in the linear transition between `this` and
  * `target` at a `ratio` in the range *[0,1]*.
  *
  * When `ratio` is `0` or less the new `Color` is equivalent to `this`,
  * when `ratio` is `1` or larger the new `Color` is equivalent to
  * `target`.
  *
  * @param {number} ratio - The transition ratio for the new `Color`
  * @param {Rac.Color} target - The transition target `Color`
  * @returns {Rac.Color}
  */
  linearTransition(ratio, target) {
    ratio = Math.max(ratio, 0);
    ratio = Math.min(ratio, 1);

    let newR = this.r + (target.r - this.r) * ratio;
    let newG = this.g + (target.g - this.g) * ratio;
    let newB = this.b + (target.b - this.b) * ratio;
    let newA = this.a + (target.a - this.a) * ratio;

    return new Color(this.rac, newR, newG, newB, newA);
  }

} // class Color


module.exports = Color;


},{"../Rac":2,"../util/utils":41}],33:[function(require,module,exports){
  'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Fill [color]{@link Rac.Color} for drawing.
*
* Can be used as `fill.apply()` to apply the fill settings globally, or as
* the parameter of `drawable.draw(fill)` to apply the fill only for that
* `draw`.
*
* When `color` is `null` a *no-fill* setting is applied.
*
* @alias Rac.Fill
*/
class Fill {

  /**
  * Creates a new `Fill` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {?Rac.Color} color - A `Color` for the fill setting, or `null`
  *   to apply a *no-fill* setting
  */
  constructor(rac, color = null) {
    utils.assertExists(rac);
    color !== null && utils.assertType(Rac.Color, color);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;
    this.color = color;
  }


  /**
  * Returns a `Fill` derived from `something`.
  *
  * + When `something` is an instance of `Fill`, returns that same object.
  * + When `something` is an instance of `Color`, returns a new `Fill`
  *   using `something` as `color`.
  * + When `something` is an instance of `Stroke`, returns a new `Fill`
  *   using `stroke.color`.
  * + Otherwise an error is thrown.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {Rac.Fill|Rac.Color|Rac.Stroke} something - An object to
  * derive a `Fill` from
  * @returns {Rac.Fill}
  */
  static from(rac, something) {
    if (something instanceof Fill) {
      return something;
    }
    if (something instanceof Rac.Color) {
      return new Fill(rac, something);
    }
    if (something instanceof Rac.Stroke) {
      return new Fill(rac, something.color);
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Fill - something-type:${utils.typeName(something)}`);
  }

  styleWithStroke(someStroke) {
    let stroke = Rac.Stroke.from(this.rac, someStroke);
    return new Rac.Style(this.rac, stroke, this);
  }

} // class Fill


module.exports = Fill;


},{"../Rac":2,"../util/utils":41}],34:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Stroke weight and [color]{@link Rac.Color} for drawing.
*
* Can be used as `stroke.apply()` to apply the stroke settings globally, or
* as the parameter of `drawable.draw(stroke)` to apply the stroke only for
* that `draw`.
*
* The instance applies the stroke color and weight settings in the
* following combinations:
* + when `color = null` and `weight = null`: a *no-stroke* setting is
*   applied
* + when `color` is set and `weight = null`: only the stroke color is
*   applied, stroke weight is not modified
* + when `weight` is set and `color = null`: only the stroke weight is
*   applied, stroke color is not modified
* + when both `color` and `weight` are set: both stroke color and weight
*   are applied
*
* @alias Rac.Stroke
*/
class Stroke {

  /**
  * Creates a new `Stroke` instance.
  *
  * @param {Rac} rac -  Instance to use for drawing and creating other objects
  * @param {?number} weight - The weight of the stroke, or `null` to skip weight
  * @param {?Rac.Color} color - A `Color` for the stroke, or `null` to skip color
  */
  constructor(rac, weight, color = null) {
    utils.assertExists(rac);
    weight !== null && utils.assertNumber(weight);
    color !== null && utils.assertType(Rac.Color, color);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac
    this.color = color;
    this.weight = weight;
  }


  /**
  * Returns a `Stroke` derived from `something`.
  *
  * + When `something` is an instance of `Stroke`, returns that same object.
  * + When `something` is an instance of `Color`, returns a new `Stroke`
  *   using `something` as `color` and a `null` stroke weight.
  * + When `something` is an instance of `Fill`, returns a new `Stroke`
  *   using `fill.color` and a `null` stroke weight.
  * + Otherwise an error is thrown.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {Rac.Stroke|Rac.Color|Rac.Fill} something - An object to
  * derive a `Stroke` from
  * @returns {Rac.Stroke}
  */
  static from(rac, something) {
    if (something instanceof Stroke) {
      return something;
    }
    if (something instanceof Rac.Color) {
      return new Stroke(rac, null, something);
    }
    if (something instanceof Rac.Fill) {
      return new Stroke(rac, null, something.color);
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Stroke - something-type:${utils.typeName(something)}`);
  }


  /**
  * Returns a new `Stroke` with `weight` set to `newWeight`.
  *
  * @param {?number} newWeight - The weight of the stroke, or `null` to skip
  *   weight
  * @returns {Rac.Stroke}
  */
  withWeight(newWeight) {
    return new Stroke(this.rac, newWeight, this.color,);
  }


  /**
  * Returns a new `Stroke` with a copy of `color` setup with `newAlpha`,
  * and the same `stroke` as `this`.
  *
  * When `this.color` is set to `null`, returns a new `Stroke` that is a
  * copy of `this`.
  *
  * @param {number} newAlpha - The alpha channel of the `color` of the new
  *   `Stroke`
  * @returns {Rac.Stroke}
  */
  withAlpha(newAlpha) {
    if (this.color === null) {
      return new Stroke(this.rac, this.weight, null);
    }

    let newColor = this.color.withAlpha(newAlpha);
    return new Stroke(this.rac, this.weight, newColor);
  }


  styleWithFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Rac.Style(this.rac, this, fill);
  }

} // class Stroke


module.exports = Stroke;


},{"../Rac":2,"../util/utils":41}],35:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* `[Stroke]{@link Rac.Stroke}` and `[Fill]{@link Rac.Fill}` style to apply
* for drawing.
*
* Can be used as `style.apply()` to apply the stroke and fill settings
* globally, or as the parameter of `drawable.draw(style)` to apply the
* settings only for that `draw`.
*
* Applies whichever `stroke` or `fill` styles are present, any set to
* `null` is individually skipped.
*
* @alias Rac.Style
*/
class Style {

  constructor(rac, stroke = null, fill = null) {
    utils.assertExists(rac);
    this.rac = rac;
    this.stroke = stroke;
    this.fill = fill;
  }


  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    let strokeString = 'null';
    if (this.stroke !== null) {
      let colorString = this.stroke.color === null
        ? 'null-color'
        : this.stroke.color.toString();
      strokeString = `${colorString},${this.stroke.weight}`;
    }

    let fillString = 'null';
    if (this.fill !== null) {
      let colorString = this.fill.color === null
        ? 'null-color'
        : this.fill.color.toString();
      fillString = colorString;
    }

    return `Style(s:(${strokeString}) f:${fillString})`;
  }


  withStroke(stroke) {
    return new Style(this.rac, stroke, this.fill);
  }

  withFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Style(this.rac, this.stroke, fill);
  }

} // class Style


module.exports = Style;


},{"../Rac":2,"../util/utils":41}],36:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `instance.Color` function contains convenience methods and members
* for `{@link Rac.Color}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Color
*/
module.exports = function attachRacColor(rac) {
  // Intended to receive a Rac instance as parameter


  /**
  * Returns a new `Color` with each channel received in the *[0,255]* range.
  *
  * @param {number} r - The red channel value, in the *[0,255]* range
  * @param {number} g - The green channel value, in the *[0,255]* range
  * @param {number} b - The blue channel value, in the *[0,255]* range
  * @param {number} [a=255] - The alpha channel value, in the *[0,255]* range
  *
  * @returns {Rac.Color}
  *
  * @function fromRgba
  * @memberof instance.Color#
  */
  rac.Color.fromRgba = function(r, g, b, a = 255) {
    return Rac.Color.fromRgba(rac, r, g, b, a);
  };


  /**
  * Returns a new `Color` instance from a hexadecimal triplet string.
  *
  * The `hexString` is expected to have 6 digits and can optionally start
  * with `#`. `AABBCC` and `#DDEEFF` are both valid inputs, the three digit
  * shorthand is not yet supported.
  *
  * An error is thrown if `hexString` is misformatted or cannot be parsed.
  *
  * @param {string} hexString - The RGB hex triplet to interpret
  * @returns {Rac.Color}
  */
  rac.Color.fromHex = function(hexString) {
    return Rac.Color.fromHex(rac, hexString);
  }


  /**
  * A black `Color`.
  *
  * @name black
  * @memberof instance.Color#
  */
  rac.Color.black   = rac.Color(0, 0, 0);

  /**
  * A red `Color`.
  *
  * @name red
  * @memberof instance.Color#
  */
  rac.Color.red     = rac.Color(1, 0, 0);

  rac.Color.green   = rac.Color(0, 1, 0);
  rac.Color.blue    = rac.Color(0, 0, 1);
  rac.Color.yellow  = rac.Color(1, 1, 0);
  rac.Color.magenta = rac.Color(1, 0, 1);
  rac.Color.cyan    = rac.Color(0, 1, 1);
  rac.Color.white   = rac.Color(1, 1, 1);

} // attachRacColor


},{"../Rac":2}],37:[function(require,module,exports){
'use strict';


/**
* The `instance.Fill` function contains convenience methods and members
* for `{@link Rac.Fill}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Fill
*/
module.exports = function attachRacFill(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Fill` without color. Removes the fill color when applied.
  * @name none
  * @memberof instance.Fill#
  */
  rac.Fill.none = rac.Fill(null);

} // attachRacFill


},{}],38:[function(require,module,exports){
'use strict';


/**
* The `instance.Stroke` function contains convenience methods and members
* for `{@link Rac.Stroke}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Stroke
*/
module.exports = function attachRacPoint(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Stroke` with no weight and no color. Using or applying this stroke
  * will disable stroke drawing.
  *
  * @name none
  * @memberof instance.Stroke#
  */
  rac.Stroke.none = rac.Stroke(null);


  /**
  * A `Stroke` with `weight` of `1` and no color. Using or applying this
  * stroke will only set the stroke weight to `1`.
  *
  * @name one
  * @memberof instance.Stroke#
  */
  rac.Stroke.one = rac.Stroke(1);

} // attachRacStroke


},{}],39:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


// Implementation of an ease function with several options to tailor its
// behaviour. The calculation takes the following steps:
// Value is received, prefix is removed
//   Value -> easeValue(value)
//     value = value - prefix
// Ratio is calculated
//   ratio = value / inRange
// Ratio is adjusted
//   ratio -> easeRatio(ratio)
//     adjustedRatio = (ratio + ratioOfset) * ratioFactor
// Ease is calculated
//   easedRatio = easeUnit(adjustedRatio)
// EasedRatio is adjusted and returned
//   easedRatio = (easedRatio + easeOfset) * easeFactor
//   easeRatio(ratio) -> easedRatio
// Value is projected
//   easedValue = value * easedRatio
// Value is adjusted and returned
//   easedValue = prefix + (easedValue * outRange)
//   easeValue(value) -> easedValue
class EaseFunction {

  // Behaviors for the `easeValue` function when `value` falls before the
  // `prefix` and after `inRange`.
  static Behavior = {
    // `value` is returned without any easing transformation. `preFactor`
    // and `postFactor` are applied. This is the default configuration.
    pass: "pass",
    // Clamps the returned value to `prefix` or `prefix+inRange`;
    clamp: "clamp",
    // Returns the applied easing transformation to `value` for values
    // before `prefix` and after `inRange`.
    continue: "continue"
  };

  constructor() {
    this.a = 2;

    // Applied to ratio before easing.
    this.ratioOffset = 0
    this.ratioFactor = 1;

    // Applied to easedRatio.
    this.easeOffset = 0
    this.easeFactor = 1;

    // Defines the lower limit of `value`` to apply easing.
    this.prefix = 0;

    // `value` is received in `inRange` and output in `outRange`.
    this.inRange = 1;
    this.outRange = 1;

    // Behavior for values before `prefix`.
    this.preBehavior = EaseFunction.Behavior.pass;
    // Behavior for values after `prefix+inRange`.
    this.postBehavior = EaseFunction.Behavior.pass;

    // For a `preBehavior` of `pass`, the factor applied to values before
    // `prefix`.
    this.preFactor = 1;
    // For a `postBehavior` of `pass`, the factor applied to the values
    // after `prefix+inRange`.
    this.postFactor = 1;
  }

  // Returns the corresponding eased value for `unit`. Both the given
  // `unit` and the returned value are in the [0,1] range. If `unit` is
  // outside the [0,1] the returned value follows the curve of the easing
  // function, which may be invalid for some values of `a`.
  //
  // This function is the base easing function, it does not apply any
  // offsets or factors.
  easeUnit(unit) {
    // Source:
    // https://math.stackexchange.com/questions/121720/ease-in-out-function/121755#121755
    // f(t) = (t^a)/(t^a+(1-t)^a)
    let ra = Math.pow(unit, this.a);
    let ira = Math.pow(1-unit, this.a);
    return ra / (ra + ira);
  }

  // Returns the ease function applied to the given ratio. `ratioOffset`
  // and `ratioFactor` are applied to the input, `easeOffset` and
  // `easeFactor` are applied to the output.
  easeRatio(ratio) {
    let adjustedRatio = (ratio + this.ratioOffset) * this.ratioFactor;
    let easedRatio = this.easeUnit(adjustedRatio);
    return (easedRatio + this.easeOffset) * this.easeFactor;
  }

  // Applies the easing function to `value` considering the configuration
  // of the whole instance.
  easeValue(value) {
    let behavior = EaseFunction.Behavior;

    let shiftedValue = value - this.prefix;
    let ratio = shiftedValue / this.inRange;

    // Before prefix
    if (value < this.prefix) {
      if (this.preBehavior === behavior.pass) {
        let distancetoPrefix = value - this.prefix;
        // With a preFactor of 1 this is equivalent to `return range`
        return this.prefix + (distancetoPrefix * this.preFactor);
      }
      if (this.preBehavior === behavior.clamp) {
        return this.prefix;
      }
      if (this.preBehavior === behavior.continue) {
        let easedRatio = this.easeRatio(ratio);
        return this.prefix + easedRatio * this.outRange;
      }

      console.trace(`Invalid preBehavior configuration - preBehavior:${this.postBehavior}`);
      throw rac.Error.invalidObjectConfiguration;
    }

    // After prefix
    if (ratio <= 1 || this.postBehavior === behavior.continue) {
      // Ease function applied within range (or after)
      let easedRatio = this.easeRatio(ratio);
      return this.prefix + easedRatio * this.outRange;
    }
    if (this.postBehavior === behavior.pass) {
      // Shifted to have inRange as origin
      let shiftedPost = shiftedValue - this.inRange;
      return this.prefix + this.outRange + shiftedPost * this.postFactor;
    }
    if (this.postBehavior === behavior.clamp) {
      return this.prefix + this.outRange;
    }

    console.trace(`Invalid postBehavior configuration - postBehavior:${this.postBehavior}`);
    throw rac.Error.invalidObjectConfiguration;
  }


  // Preconfigured functions

  // Makes an easeFunction preconfigured to an ease out motion.
  //
  // The `outRange` value should be `inRange*2` in order for the ease
  // motion to connect with the external motion at the correct velocity.
  static makeEaseOut() {
    let easeOut = new EaseFunction()
    easeOut.ratioOffset = 1;
    easeOut.ratioFactor = .5;
    easeOut.easeOffset = -.5;
    easeOut.easeFactor = 2;
    return easeOut;
  }

} // class EaseFunction


module.exports = EaseFunction;


},{"../Rac":2,"../util/utils":41}],40:[function(require,module,exports){
'use strict';


/**
* Exception builder for throwable objects.
* @alias Rac.Exception
*/
class Exception {

  constructor(name, message) {
    this.name = name;
    this.message = message;
  }

  toString() {
    return `Exception:${this.name} - ${this.message}`;
  }

  /**
  * When `true` the convenience static functions of this class will
  * build `Error` objects, otherwise `Exception` objects are built.
  *
  * Set as `false` by default for browser use: throwing an `Exception`
  * in chrome displays the error stack using source-maps when available,
  * while throwing an `Error` object displays the error stack relative to
  * the bundled file which is harder to read.
  *
  * Used as `true` for test runs in Jest: throwing an `Error` will be
  * reported in the test report, while throwing a custom object (like
  * `Exception`) within a matcher results in the expectation hanging
  * indefinitely.
  */
  static buildsErrors = false;

  /**
  * Returns an convenience function for building throwable objects.
  *
  * The function can can be used as following:
  * ```
  * func(message) // returns an `Exception`` object with `name` and `message`
  * func.exceptionName // returns the `name` of the built throwable objects
  * ```
  */
  static named(name) {
    let func = (message) => {
      if (Exception.buildsErrors) {
        const error = new Error(message);
        error.name = name;
        return error;
      }

      return new Exception(name, message);
    };

    func.exceptionName = name;
    return func;
  }

  static drawerNotSetup =    Exception.named('DrawerNotSetup');
  static failedAssert =      Exception.named('FailedAssert');
  static invalidObjectType = Exception.named('invalidObjectType');

  // abstractFunctionCalled: 'Abstract function called',
  // invalidParameterCombination: 'Invalid parameter combination',
  // invalidObjectConfiguration: 'Invalid object configuration',
  // invalidObjectToDraw: 'Invalid object to draw',
  // invalidObjectToApply: 'Invalid object to apply',

} // class Exception


module.exports = Exception;


},{}],41:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* Internal utilities.
* @namespace utils
*/


/**
* Asserts that all passed parameters are objects or primitives. If any
* parameter is `null` or `undefined` a `{@link Rac.Exception.failedAssert}`
* is thrown.
*
* @param {...(Object|primitive)} parameters
* @returns {boolean}
*
* @function assertExists
* @memberof utils#
*/
exports.assertExists = function(...parameters) {
  parameters.forEach((item, index) => {
    if (item === null) {
      throw Rac.Exception.failedAssert(
        `Found null, expecting element to exist at index ${index}`);
    }
    if (item === undefined) {
      throw Rac.Exception.failedAssert(
        `Found undefined, expecting element to exist at index ${index}`);
    }
  });
}


/**
* Asserts that all `elements` are objects or the given `typeo`, otherwise a
* `{@link Rac.Exception.failedAssert}` is thrown.
*
* @param {function} type
* @param {...Object} elements
*
* @returns {boolean}
*
* @function assertType
* @memberof utils#
*/
exports.assertType = function(type, ...elements) {
  elements.forEach(item => {
    if (!(item instanceof type)) {
      throw Rac.Exception.failedAssert(
        `Element is unexpected type - element:${item} element-type:${typeName(item)} expected-type-name:${type.name}`);
    }
  });
}


/**
* Asserts that all `elements` are number primitives and not NaN, otherwise
* a `{@link Rac.Exception.failedAssert}` is thrown.
*
* @param {...number} elements
* @returns {boolean}
*
* @function assertNumber
* @memberof utils#
*/
exports.assertNumber = function(...elements) {
  elements.forEach(item => {
    if (typeof item !== 'number' || isNaN(item)) {
      throw Rac.Exception.failedAssert(
        `Element is unexpected type, expecting number primitive - element:${item} element-type:${typeName(item)}`);
    }
  });
}


/**
* Asserts that all `elements` are string primitives, otherwise
* a `{@link Rac.Exception.failedAssert}` is thrown.
*
* @param {...string} elements
* @returns {boolean}
*
* @function assertString
* @memberof utils#
*/
exports.assertString = function(...elements) {
  elements.forEach(item => {
    if (typeof item !== 'string') {
      throw Rac.Exception.failedAssert(
        `Element is unexpected type, expecting string primitive - element:${item} element-type:${typeName(item)}`);
    }
  });
}


/**
* Asserts that all `elements` are boolean primitives, otherwise a
* `{@link Rac.Exception.failedAssert}` is thrown.
*
* @param {...boolean} elements
* @returns {boolean}
*
* @function assertBoolean
* @memberof utils#
*/
exports.assertBoolean = function(...elements) {
  elements.forEach(item => {
    if (typeof item !== 'boolean') {
      throw Rac.Exception.failedAssert(
        `Element is unexpected type, expecting boolean primitive - element:${item} element-type:${typeName(item)}`);
    }
  });
}


/**
* Returns the constructor name of `obj`, or its type name.
* Convenience function for debugging and errors.
*
* @param {object} obj - An `Object` to get its type name
* @returns {string}
*
* @function typeName
* @memberof utils#
*/
function typeName(obj) {
  if (obj === undefined) { return 'undefined'; }
  if (obj === null) { return 'null'; }

  if (typeof obj === 'function' && obj.name != null) {
    return obj.name == ''
      ? `function`
      : `function:${obj.name}`;
  }
  return obj.constructor.name ?? typeof obj;
}
exports.typeName = typeName;


/**
* Adds a constant to the given object, the constant is not enumerable and
* not configurable.
*
* @function addConstantTo
* @memberof utils#
*/
exports.addConstantTo = function(obj, propName, value) {
  Object.defineProperty(obj, propName, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });
}


/**
* Returns a string of `number` format using fixed-point notation or the
* complete `number` string.
*
* @param {number} number - The number to format
* @param {?number} [digits] - The amount of digits to print, or `null` to
* print all digits.
*
* @returns {string}
*
* @function cutDigits
* @memberof utils#
*/
exports.cutDigits = function(number, digits = null) {
  return digits === null
    ? number.toString()
    : number.toFixed(digits);
}


},{"../Rac":2}]},{},[25])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sL1NlZ21lbnRDb250cm9sLmpzIiwic3JjL2RyYXdhYmxlL0FuZ2xlLmpzIiwic3JjL2RyYXdhYmxlL0FyYy5qcyIsInNyYy9kcmF3YWJsZS9CZXppZXIuanMiLCJzcmMvZHJhd2FibGUvQ29tcG9zaXRlLmpzIiwic3JjL2RyYXdhYmxlL1BvaW50LmpzIiwic3JjL2RyYXdhYmxlL1JheS5qcyIsInNyYy9kcmF3YWJsZS9TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL1NoYXBlLmpzIiwic3JjL2RyYXdhYmxlL1RleHQuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQXJjLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLkJlemllci5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5Qb2ludC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5SYXkuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuU2VnbWVudC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5UZXh0LmpzIiwic3JjL21haW4uanMiLCJzcmMvcDVEcmF3ZXIvUDVEcmF3ZXIuanMiLCJzcmMvcDVEcmF3ZXIvUG9pbnQuZnVuY3Rpb25zLmpzIiwic3JjL3A1RHJhd2VyL1JheS5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvU2VnbWVudC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZGVidWcuZnVuY3Rpb25zLmpzIiwic3JjL3A1RHJhd2VyL2RyYXcuZnVuY3Rpb25zLmpzIiwic3JjL3N0eWxlL0NvbG9yLmpzIiwic3JjL3N0eWxlL0ZpbGwuanMiLCJzcmMvc3R5bGUvU3Ryb2tlLmpzIiwic3JjL3N0eWxlL1N0eWxlLmpzIiwic3JjL3N0eWxlL2luc3RhbmNlLkNvbG9yLmpzIiwic3JjL3N0eWxlL2luc3RhbmNlLkZpbGwuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuU3Ryb2tlLmpzIiwic3JjL3V0aWwvRWFzZUZ1bmN0aW9uLmpzIiwic3JjL3V0aWwvRXhjZXB0aW9uLmpzIiwic3JjL3V0aWwvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOWpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvcUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlU3RyaWN0JztcblxuLy8gUnVsZXIgYW5kIENvbXBhc3MgLSB2ZXJzaW9uXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0dmVyc2lvbjogJzEuMC4xLWRldicsXG5cdGJ1aWxkOiAnNzcyLTI3ODk0YTcnXG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLy8gUnVsZXIgYW5kIENvbXBhc3NcbmNvbnN0IHZlcnNpb24gPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJykudmVyc2lvbjtcbmNvbnN0IGJ1aWxkICAgPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJykuYnVpbGQ7XG5cblxuLyoqXG4qIFJvb3QgY2xhc3Mgb2YgUkFDLiBBbGwgZHJhd2FibGUsIHN0eWxlLCBjb250cm9sLCBhbmQgZHJhd2VyIGNsYXNzZXMgYXJlXG4qIGNvbnRhaW5lZCBpbiB0aGlzIGNsYXNzLlxuKlxuKiBBbiBpbnN0YW5jZSBtdXN0IGJlIGNyZWF0ZWQgd2l0aCBgbmV3IFJhYygpYCBpbiBvcmRlciB0b1xuKiBidWlsZCBkcmF3YWJsZSwgc3R5bGUsIGFuZCBvdGhlciBvYmplY3RzLlxuKlxuKiBUbyBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucywgYSBkcmF3ZXIgbXVzdCBiZSBzZXR1cCB3aXRoXG4qIGBbc2V0dXBEcmF3ZXJde0BsaW5rIFJhYyNzZXR1cERyYXdlcn1gLiBDdXJyZW50bHkgdGhlIG9ubHkgYXZhaWxhYmxlXG4qIGltcGxlbWVudGF0aW9uIGlzIGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gLlxuKi9cbmNsYXNzIFJhYyB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBSYWMuIFRoZSBuZXcgaW5zdGFuY2UgaGFzIG5vIGBkcmF3ZXJgIHNldHVwLlxuICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICogVmVyc2lvbiBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMudmVyc2lvbn1gLlxuICAgICpcbiAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgKlxuICAgICogQG5hbWUgdmVyc2lvblxuICAgICogQG1lbWJlcm9mIFJhYyNcbiAgICAqL1xuICAgIHV0aWxzLmFkZENvbnN0YW50VG8odGhpcywgJ3ZlcnNpb24nLCB2ZXJzaW9uKTtcblxuXG4gICAgLyoqXG4gICAgKiBCdWlsZCBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMuYnVpbGR9YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICpcbiAgICAqIEBuYW1lIGJ1aWxkXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAnYnVpbGQnLCBidWlsZCk7XG5cblxuICAgIC8qKlxuICAgICogVmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkgYmV0d2VlbiB0d28gbnVtZXJpYyB2YWx1ZXMuIFVzZWQgZm9yXG4gICAgKiB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGJlIGludGVnZXJzLCBsaWtlIHNjcmVlbiBjb29yZGluYXRlcy4gVXNlZCBieVxuICAgICogYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICAgKlxuICAgICogV2hlbiBjaGVja2luZyBmb3IgZXF1YWxpdHkgYHhgIGlzIGVxdWFsIHRvIG5vbi1pbmNsdXNpdmVcbiAgICAqIGAoeC1lcXVhbGl0eVRocmVzaG9sZCwgeCtlcXVhbGl0eVRocmVzaG9sZClgOlxuICAgICogKyBgeGAgaXMgKipub3QgZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZGBcbiAgICAqICsgYHhgIGlzICoqZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZC8yYFxuICAgICpcbiAgICAqIER1ZSB0byBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gc29tZSBvcGVydGF0aW9uIGxpa2UgaW50ZXJzZWN0aW9uc1xuICAgICogY2FuIHJldHVybiBvZGQgb3Igb3NjaWxhdGluZyB2YWx1ZXMuIFRoaXMgdGhyZXNob2xkIGlzIHVzZWQgdG8gc25hcFxuICAgICogdmFsdWVzIHRvbyBjbG9zZSB0byBhIGxpbWl0LCBhcyB0byBwcmV2ZW50IG9zY2lsYXRpbmcgZWZlY3RzIGluXG4gICAgKiB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIERlZmF1bHQgdmFsdWUgaXMgYmFzZWQgb24gYDEvMTAwMGAgb2YgYSBwb2ludC5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5lcXVhbGl0eVRocmVzaG9sZCA9IDAuMDAxO1xuXG5cblxuICAgIC8qKlxuICAgICogVmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkgYmV0d2VlbiB0d28gdW5pdGFyeSBudW1lcmljIHZhbHVlcy5cbiAgICAqIFVzZWQgZm9yIHZhbHVlcyB0aGF0IHRlbmQgdG8gZXhpc3QgaW4gdGhlIGBbMCwgMV1gIHJhbmdlLCBsaWtlXG4gICAgKiBge0BsaW5rIFJhYy5BbmdsZSN0dXJufWAuIFVzZWQgYnkgYHtAbGluayBSYWMjdW5pdGFyeUVxdWFsc31gLlxuICAgICpcbiAgICAqIEVxdWFsaXR5IGxvZ2ljIGlzIHRoZSBzYW1lIGFzIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAuXG4gICAgKlxuICAgICogRGVmYXVsdCB2YWx1ZSBpcyBiYXNlZCBvbiAxLzAwMCBvZiB0aGUgdHVybiBvZiBhbiBhcmMgb2YgcmFkaXVzIDUwMFxuICAgICogYW5kIGxlbmd0aCBvZiAxOiBgMS8oNTAwKjYuMjgpLzEwMDBgXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkID0gMC4wMDAwMDAzO1xuXG4gICAgLyoqXG4gICAgKiBEcmF3ZXIgb2YgdGhlIGluc3RhbmNlLiBUaGlzIG9iamVjdCBoYW5kbGVzIHRoZSBkcmF3aW5nIG9mIGFsbFxuICAgICogZHJhd2FibGUgb2JqZWN0IHVzaW5nIHRoaXMgaW5zdGFuY2Ugb2YgYFJhY2AuXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy5kcmF3ZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBDb250cm9sbGVyIG9mIHRoZSBpbnN0YW5jZS4gVGhpcyBvYmplY3MgaGFuZGxlcyBhbGwgb2YgdGhlIGNvbnRyb2xzXG4gICAgKiBhbmQgcG9pbnRlciBldmVudHMgcmVsYXRlZCB0byB0aGlzIGluc3RhbmNlIG9mIGBSYWNgLlxuICAgICovXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFJhYy5Db250cm9sbGVyKHRoaXMpO1xuXG5cbiAgICByZXF1aXJlKCcuL2F0dGFjaEluc3RhbmNlRnVuY3Rpb25zJykodGhpcyk7XG5cbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkNvbG9yJykgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLlN0cm9rZScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkZpbGwnKSAgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFuZ2xlJykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50JykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlJheScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlNlZ21lbnQnKSh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFyYycpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkJlemllcicpICh0aGlzKTtcblxuICAgIC8vIERlcGVuZHMgb24gaW5zdGFuY2UuUG9pbnQgYW5kIGluc3RhbmNlLkFuZ2xlIGJlaW5nIGFscmVhZHkgc2V0dXBcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlRleHQnKSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAqIFNldHMgdGhlIGRyYXdlciBmb3IgdGhlIGluc3RhbmNlLiBDdXJyZW50bHkgb25seSBhIHA1LmpzIGluc3RhbmNlIGlzXG4gICogc3VwcG9ydGVkLlxuICAqXG4gICogVGhlIGRyYXdlciB3aWxsIGFsc28gcG9wdWxhdGUgc29tZSBjbGFzc2VzIHdpdGggcHJvdG90eXBlIGZ1bmN0aW9uc1xuICAqIHJlbGV2YW50IHRvIHRoZSBkcmF3ZXIuIEZvciBwNS5qcyB0aGlzIGluY2x1ZGUgYGFwcGx5YCBmdW5jdGlvbnMgZm9yXG4gICogY29sb3JzIGFuZCBzdHlsZSBvYmplY3QsIGFuZCBgdmVydGV4YCBmdW5jdGlvbnMgZm9yIGRyYXdhYmxlIG9iamVjdHMuXG4gICpcbiAgKiBAcGFyYW0ge1A1fSBwNUluc3RhbmNlXG4gICovXG4gIHNldHVwRHJhd2VyKHA1SW5zdGFuY2UpIHtcbiAgICB0aGlzLmRyYXdlciA9IG5ldyBSYWMuUDVEcmF3ZXIodGhpcywgcDVJbnN0YW5jZSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBge0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGEgRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge251bWJlcn0gYiBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKlxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICBlcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgbGV0IGRpZmYgPSBNYXRoLmFicyhhLWIpO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy5lcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBge0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBhIEZpcnN0IG51bWJlciB0byBjb21wYXJlXG4gICogQHBhcmFtIHtudW1iZXJ9IGIgU2Vjb25kIG51bWJlciB0byBjb21wYXJlXG4gICpcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgdW5pdGFyeUVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoYS1iKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cbn0gLy8gY2xhc3MgUmFjXG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYWM7XG5cblxuLy8gQWxsIGNsYXNzIChzdGF0aWMpIHByb3BlcnRpZXMgc2hvdWxkIGJlIGRlZmluZWQgb3V0c2lkZSBvZiB0aGUgY2xhc3Ncbi8vIGFzIHRvIHByZXZlbnQgY3ljbGljIGRlcGVuZGVuY3kgd2l0aCBSYWMuXG5cblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKGAuL3V0aWwvdXRpbHNgKTtcbi8qKlxuKiBDb250YWluZXIgb2YgdXRpbGl0eSBmdW5jdGlvbnMuIFNlZSBge0BsaW5rIHV0aWxzfWAgZm9yIHRoZSBhdmFpbGFibGVcbiogbWVtYmVycy5cbipcbiogQHR5cGUge29iamVjdH1cbiovXG5SYWMudXRpbHMgPSB1dGlscztcblxuXG4vKipcbiogVmVyc2lvbiBvZiB0aGUgY2xhc3MuIFNhbWUgYXMgdGhlIHZlcnNpb24gdXNlZCBmb3IgdGhlIG5wbSBwYWNrYWdlLlxuKlxuKiBAdHlwZSB7c3RyaW5nfVxuKlxuKiBAbmFtZSB2ZXJzaW9uXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ3ZlcnNpb24nLCB2ZXJzaW9uKTtcblxuXG4vKipcbiogQnVpbGQgb2YgdGhlIGNsYXNzLiBJbnRlbmRlZCBmb3IgZGVidWdnaW5nIHB1cnBvdXNlcy5cbipcbiogQ29udGFpbnMgYSBjb21taXQtY291bnQgYW5kIHNob3J0LWhhc2ggb2YgdGhlIHJlcG9zaXRvcnkgd2hlbiB0aGUgYnVpbGRcbiogd2FzIGRvbmUuXG4qXG4qIEB0eXBlIHtzdHJpbmd9XG4qXG4qIEBuYW1lIGJ1aWxkXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ2J1aWxkJywgYnVpbGQpO1xuXG5cbi8qKlxuKiBUYXUsIGVxdWFsIHRvIGBNYXRoLlBJICogMmAuXG4qXG4qIFtUYXUgTWFuaWZlc3RvXShodHRwczovL3RhdWRheS5jb20vdGF1LW1hbmlmZXN0bykuXG4qXG4qIEB0eXBlIHtudW1iZXJ9XG4qXG4qIEBuYW1lIFRBVVxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICdUQVUnLCBNYXRoLlBJICogMik7XG5cblxuLy8gRXhjZXB0aW9uXG5SYWMuRXhjZXB0aW9uID0gcmVxdWlyZSgnLi91dGlsL0V4Y2VwdGlvbicpO1xuXG5cbi8vIFByb3RvdHlwZSBmdW5jdGlvbnNcbnJlcXVpcmUoJy4vYXR0YWNoUHJvdG9GdW5jdGlvbnMnKShSYWMpO1xuXG5cbi8vIFA1RHJhd2VyXG5SYWMuUDVEcmF3ZXIgPSByZXF1aXJlKCcuL3A1RHJhd2VyL1A1RHJhd2VyJyk7XG5cblxuLy8gQ29sb3JcblJhYy5Db2xvciA9IHJlcXVpcmUoJy4vc3R5bGUvQ29sb3InKTtcblxuXG4vLyBTdHJva2VcblJhYy5TdHJva2UgPSByZXF1aXJlKCcuL3N0eWxlL1N0cm9rZScpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuU3Ryb2tlKTtcblxuXG4vLyBGaWxsXG5SYWMuRmlsbCA9IHJlcXVpcmUoJy4vc3R5bGUvRmlsbCcpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuRmlsbCk7XG5cblxuLy8gU3R5bGVcblJhYy5TdHlsZSA9IHJlcXVpcmUoJy4vc3R5bGUvU3R5bGUnKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLlN0eWxlKTtcblxuXG4vLyBBbmdsZVxuUmFjLkFuZ2xlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9BbmdsZScpO1xuXG5cbi8vIFBvaW50XG5SYWMuUG9pbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1BvaW50Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5Qb2ludCk7XG5cblxuLy8gUmF5XG5SYWMuUmF5ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9SYXknKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlJheSk7XG5cblxuLy8gU2VnbWVudFxuUmFjLlNlZ21lbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1NlZ21lbnQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlNlZ21lbnQpO1xuXG5cbi8vIEFyY1xuUmFjLkFyYyA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQXJjJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5BcmMpO1xuXG5cbi8vIFRleHRcblJhYy5UZXh0ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9UZXh0Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5UZXh0KTtcblxuXG4vLyBCZXppZXJcblJhYy5CZXppZXIgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0JlemllcicpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQmV6aWVyKTtcblxuXG4vLyBDb21wb3NpdGVcblJhYy5Db21wb3NpdGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0NvbXBvc2l0ZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQ29tcG9zaXRlKTtcblxuXG4vLyBTaGFwZVxuUmFjLlNoYXBlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9TaGFwZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuU2hhcGUpO1xuXG5cbi8vIEVhc2VGdW5jdGlvblxuUmFjLkVhc2VGdW5jdGlvbiA9IHJlcXVpcmUoJy4vdXRpbC9FYXNlRnVuY3Rpb24nKTtcblxuXG4vLyBDb250cm9sbGVyXG5SYWMuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbC9Db250cm9sbGVyJyk7XG5cblxuLy8gQ29udHJvbFxuUmFjLkNvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvQ29udHJvbCcpO1xuXG5cbi8vIFNlZ21lbnRDb250cm9sXG5SYWMuU2VnbWVudENvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvU2VnbWVudENvbnRyb2wnKTtcblxuXG4vLyBBcmNDb250cm9sXG5SYWMuQXJjQ29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9BcmNDb250cm9sJyk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuL1JhYycpO1xuXG5cbi8qKlxuKiBUaGlzIG5hbWVzcGFjZSBsaXN0cyB1dGlsaXR5IGZ1bmN0aW9ucyBhdHRhY2hlZCB0byBhbiBpbnN0YW5jZSBvZlxuKiBge0BsaW5rIFJhY31gIHVzZWQgdG8gcHJvZHVjZSBkcmF3YWJsZSBhbmQgb3RoZXIgb2JqZWN0cywgYW5kIHRvIGFjY2Vzc1xuKiByZWFkeS1idWlsZCBjb252ZW5pZW5jZSBvYmplY3RzIGxpa2UgYHtAbGluayBpbnN0YW5jZS5BbmdsZSNub3J0aH1gIG9yXG4qIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb31gLlxuKlxuKiBEcmF3YWJsZSBhbmQgcmVsYXRlZCBvYmplY3RzIHJlcXVpcmUgYSByZWZlcmVuY2UgdG8gYSBgcmFjYCBpbnN0YW5jZSBpblxuKiBvcmRlciB0byBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucy4gVGhlc2UgZnVuY3Rpb25zIGJ1aWxkIG5ldyBvYmplY3RzXG4qIHVzaW5nIHRoZSBjYWxsaW5nIGBSYWNgIGluc3RhbmNlLCBhbmQgY29udGFpbiByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMgdGhhdCBhcmUgYWxzbyBzZXR1cCB3aXRoIHRoZSBzYW1lIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlXG4qL1xuXG5cbi8vIEF0dGFjaGVzIHRoZSBjb252ZW5pZW5jZSBmdW5jdGlvbnMgdG8gY3JlYXRlIG9iamVjdHMgd2l0aCB0aGlzIGluc3RhbmNlXG4vLyBvZiBSYWMuIFRoZXNlIGZ1bmN0aW9ucyBhcmUgYXR0YWNoZWQgYXMgcHJvcGVydGllcyAoaW5zdGVhZCBvZiBpbnRvIHRoZVxuLy8gcHJvdG90eXBlKSBiZWNhdXNlIHRoZXNlIGFyZSBsYXRlciBwb3B1bGF0ZWQgd2l0aCBtb3JlIHByb3BlcnRpZXMgYW5kXG4vLyBtZXRob2RzLCBhbmQgdGh1cyBuZWVkIHRvIGJlIGFuIGluZGVwZW5kZW50IGluc3RhbmNlLlxuLy9cbi8vIEludGVuZGVkIHRvIHJlY2VpdmUgdGhlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBDb2xvcmAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Db2xvcn1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJcbiAgKiBAcGFyYW0ge251bWJlcn0gZ1xuICAqIEBwYXJhbSB7bnVtYmVyfSBiXG4gICogQHBhcmFtIHtudW1iZXI9fSBhXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5Db2xvclxuICAqXG4gICogQGZ1bmN0aW9uIENvbG9yXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkNvbG9yID0gZnVuY3Rpb24gbWFrZUNvbG9yKHIsIGcsIGIsIGEgPSAxKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuQ29sb3IodGhpcywgciwgZywgYiwgYSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFN0cm9rZWAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5TdHJva2V9YC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gd2VpZ2h0XG4gICogQHBhcmFtIHs/UmFjLkNvbG9yfSBjb2xvclxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlN0cm9rZVxuICAqXG4gICogQGZ1bmN0aW9uIFN0cm9rZVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5TdHJva2UgPSBmdW5jdGlvbiBtYWtlU3Ryb2tlKHdlaWdodCwgY29sb3IgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMsIHdlaWdodCwgY29sb3IpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBGaWxsYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkZpbGx9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbG9yPX0gY29sb3JcbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkZpbGxcbiAgKlxuICAqIEBmdW5jdGlvbiBGaWxsXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkZpbGwgPSBmdW5jdGlvbiBtYWtlRmlsbChjb2xvciA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5GaWxsKHRoaXMsIGNvbG9yKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgU3R5bGVgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU3R5bGV9YC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V9IHN0cm9rZVxuICAqIEBwYXJhbSB7P1JhYy5GaWxsfSBmaWxsXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5TdHlsZVxuICAqXG4gICogQGZ1bmN0aW9uIFN0eWxlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlN0eWxlID0gZnVuY3Rpb24gbWFrZVN0eWxlKHN0cm9rZSA9IG51bGwsIGZpbGwgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGUodGhpcywgc3Ryb2tlLCBmaWxsKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQW5nbGVgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGV9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWUgb2YgdGhlIGFuZ2xlLCBpbiB0aGUgcmFuZ2UgYFtPLDEpYFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFuZ2xlXG4gICpcbiAgKiBAZnVuY3Rpb24gQW5nbGVcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQW5nbGUgPSBmdW5jdGlvbiBtYWtlQW5nbGUodHVybikge1xuICAgIHJldHVybiBuZXcgUmFjLkFuZ2xlKHRoaXMsIHR1cm4pO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBQb2ludGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBQb2ludFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5Qb2ludCA9IGZ1bmN0aW9uIG1ha2VQb2ludCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFJheWAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5SYXl9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUmF5XG4gICpcbiAgKiBAZnVuY3Rpb24gUmF5XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlJheSA9IGZ1bmN0aW9uIG1ha2VSYXkoeCwgeSwgYW5nbGUpIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFNlZ21lbnRgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU2VnbWVudH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlNlZ21lbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBTZWdtZW50XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlNlZ21lbnQgPSBmdW5jdGlvbiBtYWtlU2VnbWVudCh4LCB5LCBhbmdsZSwgbGVuZ3RoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcywgYW5nbGUpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLCByYXksIGxlbmd0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEFyY2Agc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BcmN9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IHN0YXJ0XG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfG51bWJlcn0gW2VuZD1udWxsXVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXVxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFyY1xuICAqXG4gICogQGZ1bmN0aW9uIEFyY1xuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5BcmMgPSBmdW5jdGlvbiBtYWtlQXJjKHgsIHksIHJhZGl1cywgc3RhcnQgPSB0aGlzLkFuZ2xlLnplcm8sIGVuZCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHN0YXJ0ID0gUmFjLkFuZ2xlLmZyb20odGhpcywgc3RhcnQpO1xuICAgIGVuZCA9IGVuZCA9PT0gbnVsbFxuICAgICAgPyBzdGFydFxuICAgICAgOiBSYWMuQW5nbGUuZnJvbSh0aGlzLCBlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLCBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgVGV4dGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5UZXh0fWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBmb3JtYXRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuVGV4dFxuICAqXG4gICogQGZ1bmN0aW9uIFRleHRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuVGV4dCA9IGZ1bmN0aW9uIG1ha2VUZXh0KHgsIHksIHN0cmluZywgZm9ybWF0KSB7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcywgcG9pbnQsIHN0cmluZywgZm9ybWF0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQmV6aWVyYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkJlemllcn1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0WFxuICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFlcbiAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRBbmNob3JYXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0QW5jaG9yWVxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRBbmNob3JYXG4gICogQHBhcmFtIHtudW1iZXJ9IGVuZEFuY2hvcllcbiAgKiBAcGFyYW0ge251bWJlcn0gZW5kWFxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRZXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkJlemllcn1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQmV6aWVyXG4gICpcbiAgKiBAZnVuY3Rpb24gQmV6aWVyXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkJlemllciA9IGZ1bmN0aW9uIG1ha2VCZXppZXIoXG4gICAgc3RhcnRYLCBzdGFydFksIHN0YXJ0QW5jaG9yWCwgc3RhcnRBbmNob3JZLFxuICAgIGVuZEFuY2hvclgsIGVuZEFuY2hvclksIGVuZFgsIGVuZFkpXG4gIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgc3RhcnRYLCBzdGFydFkpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBzdGFydEFuY2hvclgsIHN0YXJ0QW5jaG9yWSk7XG4gICAgY29uc3QgZW5kQW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBlbmRBbmNob3JYLCBlbmRBbmNob3JZKTtcbiAgICBjb25zdCBlbmQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIGVuZFgsIGVuZFkpO1xuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gQXR0YWNoZXMgZnVuY3Rpb25zIHRvIGF0dGFjaCBkcmF3aW5nIGFuZCBhcHBseSBtZXRob2RzIHRvIG90aGVyXG4vLyBwcm90b3R5cGVzLlxuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgUmFjIGNsYXNzIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUHJvdG9GdW5jdGlvbnMoUmFjKSB7XG5cbiAgZnVuY3Rpb24gYXNzZXJ0RHJhd2VyKGRyYXdhYmxlKSB7XG4gICAgaWYgKGRyYXdhYmxlLnJhYyA9PSBudWxsIHx8IGRyYXdhYmxlLnJhYy5kcmF3ZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5kcmF3ZXJOb3RTZXR1cChcbiAgICAgICAgYGRyYXdhYmxlLXR5cGU6JHt1dGlscy50eXBlTmFtZShkcmF3YWJsZSl9YCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgY2xhc3Nlcy5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBkcmF3YWJsZSBvYmplY3RzIChFLmcuIGBkcmF3KClgIGFuZCBgZGVidWcoKWApLlxuICBSYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBPYmplY3Qua2V5cyhSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNsYXNzT2JqLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5kcmF3ID0gZnVuY3Rpb24oc3R5bGUgPSBudWxsKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmRyYXdPYmplY3QodGhpcywgc3R5bGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZGVidWcgPSBmdW5jdGlvbihkcmF3c1RleHQgPSBmYWxzZSl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5kZWJ1Z09iamVjdCh0aGlzLCBkcmF3c1RleHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nID0gZnVuY3Rpb24obWVzc2FnZSA9IG51bGwpe1xuICAgIGxldCBjb2FsZXNjZWRNZXNzYWdlID0gbWVzc2FnZSA/PyAnJW8nO1xuICAgIGNvbnNvbGUubG9nKGNvYWxlc2NlZE1lc3NhZ2UsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLy8gVE9ETzogaGFzIHRvIGJlIG1vdmVkIHRvIHJhYyBpbnN0YW5jZVxuICBSYWMuc3RhY2sgPSBbXTtcblxuICBSYWMuc3RhY2sucGVlayA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBSYWMuc3RhY2tbUmFjLnN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgIFJhYy5zdGFjay5wdXNoKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFJhYy5zdGFjay5wb3AoKTtcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUmFjLnN0YWNrLnBlZWsoKTtcbiAgfVxuXG4gIC8vIFRPRE86IHNoYXBlIGFuZCBjb21wb3NpdGUgc2hvdWxkIGJlIHN0YWNrcywgc28gdGhhdCBzZXZlcmFsIGNhbiBiZVxuICAvLyBzdGFydGVkIGluIGRpZmZlcmVudCBjb250ZXh0c1xuICAvLyBUT0RPOiBoYXMgdG8gYmUgbW92ZWQgdG8gcmFjIGluc3RhbmNlXG4gIFJhYy5jdXJyZW50U2hhcGUgPSBudWxsO1xuICBSYWMuY3VycmVudENvbXBvc2l0ZSA9IG51bGw7XG5cbiAgUmFjLnBvcFNoYXBlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNoYXBlID0gUmFjLmN1cnJlbnRTaGFwZTtcbiAgICBSYWMuY3VycmVudFNoYXBlID0gbnVsbDtcbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cblxuICBSYWMucG9wQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGNvbXBvc2l0ZSA9IFJhYy5jdXJyZW50Q29tcG9zaXRlO1xuICAgIFJhYy5jdXJyZW50Q29tcG9zaXRlID0gbnVsbDtcbiAgICByZXR1cm4gY29tcG9zaXRlO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuYXR0YWNoVG9TaGFwZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChSYWMuY3VycmVudFNoYXBlID09PSBudWxsKSB7XG4gICAgICBSYWMuY3VycmVudFNoYXBlID0gbmV3IFJhYy5TaGFwZSh0aGlzLnJhYyk7XG4gICAgfVxuXG4gICAgdGhpcy5hdHRhY2hUbyhSYWMuY3VycmVudFNoYXBlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBvcFNoYXBlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFJhYy5wb3BTaGFwZSgpO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wU2hhcGVUb0NvbXBvc2l0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzaGFwZSA9IFJhYy5wb3BTaGFwZSgpO1xuICAgIHNoYXBlLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUb0NvbXBvc2l0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChSYWMuY3VycmVudENvbXBvc2l0ZSA9PT0gbnVsbCkge1xuICAgICAgUmFjLmN1cnJlbnRDb21wb3NpdGUgPSBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzLnJhYyk7XG4gICAgfVxuXG4gICAgdGhpcy5hdHRhY2hUbyhSYWMuY3VycmVudENvbXBvc2l0ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BDb21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUmFjLnBvcENvbXBvc2l0ZSgpO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuYXR0YWNoVG8gPSBmdW5jdGlvbihzb21lQ29tcG9zaXRlKSB7XG4gICAgaWYgKHNvbWVDb21wb3NpdGUgaW5zdGFuY2VvZiBSYWMuQ29tcG9zaXRlKSB7XG4gICAgICBzb21lQ29tcG9zaXRlLmFkZCh0aGlzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmIChzb21lQ29tcG9zaXRlIGluc3RhbmNlb2YgUmFjLlNoYXBlKSB7XG4gICAgICBzb21lQ29tcG9zaXRlLmFkZE91dGxpbmUodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBhdHRhY2hUbyBjb21wb3NpdGUgLSBzb21lQ29tcG9zaXRlLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21lQ29tcG9zaXRlKX1gKTtcbiAgfTtcblxuXG4gIC8vIENvbnRhaW5lciBvZiBwcm90b3R5cGUgZnVuY3Rpb25zIGZvciBzdHlsZSBjbGFzc2VzLlxuICBSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucyA9IHt9O1xuXG4gIC8vIEFkZHMgdG8gdGhlIGdpdmVuIGNsYXNzIHByb3RvdHlwZSBhbGwgdGhlIGZ1bmN0aW9ucyBjb250YWluZWQgaW5cbiAgLy8gYFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zYC4gVGhlc2UgYXJlIGZ1bmN0aW9ucyBzaGFyZWQgYnkgYWxsXG4gIC8vIHN0eWxlIG9iamVjdHMgKEUuZy4gYGFwcGx5KClgKS5cbiAgUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKGNsYXNzT2JqKSB7XG4gICAgT2JqZWN0LmtleXMoUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBjbGFzc09iai5wcm90b3R5cGVbbmFtZV0gPSBSYWMuc3R5bGVQcm90b0Z1bmN0aW9uc1tuYW1lXTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMuYXBwbHkgPSBmdW5jdGlvbigpe1xuICAgIGFzc2VydERyYXdlcih0aGlzKTtcbiAgICB0aGlzLnJhYy5kcmF3ZXIuYXBwbHlPYmplY3QodGhpcyk7XG4gIH07XG5cbn07IC8vIGF0dGFjaFByb3RvRnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gVE9ETzogZml4IHVzZXMgb2Ygc29tZUFuZ2xlXG5cblxuLyoqXG4qIENvbnRyb2wgdGhhdCB1c2VzIGFuIGBBcmNgIGFzIGFuY2hvci5cbiogQGFsaWFzIFJhYy5BcmNDb250cm9sXG4qL1xuY2xhc3MgQXJjQ29udHJvbCBleHRlbmRzIFJhYy5Db250cm9sIHtcblxuICAvLyBDcmVhdGVzIGEgbmV3IENvbnRyb2wgaW5zdGFuY2Ugd2l0aCB0aGUgZ2l2ZW4gYHZhbHVlYCBhbmQgYW5cbiAgLy8gYGFuZ2xlRGlzdGFuY2VgIGZyb20gYHNvbWVBbmdsZURpc3RhbmNlYC5cbiAgLy8gQnkgZGVmYXVsdCB0aGUgdmFsdWUgcmFuZ2UgaXMgWzAsMV0gYW5kIGxpbWl0cyBhcmUgc2V0IHRvIGJlIHRoZSBlcXVhbFxuICAvLyBhcyBgc3RhcnRWYWx1ZWAgYW5kIGBlbmRWYWx1ZWAuXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIHNvbWVBbmdsZURpc3RhbmNlLCBzdGFydFZhbHVlID0gMCwgZW5kVmFsdWUgPSAxKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgdmFsdWUsIHNvbWVBbmdsZURpc3RhbmNlLCBzdGFydFZhbHVlLCBlbmRWYWx1ZSk7XG5cbiAgICBzdXBlcihyYWMsIHZhbHVlLCBzdGFydFZhbHVlLCBlbmRWYWx1ZSk7XG5cbiAgICAvLyBBbmdsZSBkaXN0YW5jZSBmb3IgdGhlIGNvcGllZCBhbmNob3Igb2JqZWN0LlxuICAgIHRoaXMuYW5nbGVEaXN0YW5jZSA9IFJhYy5BbmdsZS5mcm9tKHJhYywgc29tZUFuZ2xlRGlzdGFuY2UpO1xuXG4gICAgLy8gYEFyY2BgIHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIFdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAvLyBkcmF3biBhbmQgaW50ZXJhY3RlZCBhIGNvcHkgb2YgdGhlIGFuY2hvciBpcyBjcmVhdGVkIHdpdGggdGhlXG4gICAgLy8gY29udHJvbCdzIGBhbmdsZURpc3RhbmNlYC5cbiAgICB0aGlzLmFuY2hvciA9IG51bGw7XG4gIH1cblxuICBzZXRWYWx1ZVdpdGhBbmdsZURpc3RhbmNlKHNvbWVBbmdsZURpc3RhbmNlKSB7XG4gICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc29tZUFuZ2xlRGlzdGFuY2UpXG4gICAgbGV0IGFuZ2xlRGlzdGFuY2VSYXRpbyA9IGFuZ2xlRGlzdGFuY2UudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVPZihhbmdsZURpc3RhbmNlUmF0aW8pO1xuICB9XG5cbiAgc2V0TGltaXRzV2l0aEFuZ2xlRGlzdGFuY2VJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICBzdGFydEluc2V0ID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIHN0YXJ0SW5zZXQpO1xuICAgIGVuZEluc2V0ID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGVuZEluc2V0KTtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldC50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKSk7XG4gICAgdGhpcy5lbmRMaW1pdCA9IHRoaXMudmFsdWVPZigodGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAtIGVuZEluc2V0LnR1cm4pIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIGBhbmNob3Iuc3RhcnRgIHRvIHRoZSBjb250cm9sIGNlbnRlci5cbiAgZGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMucmF0aW9WYWx1ZSgpKTtcbiAgfVxuXG4gIC8vIFRPRE86IHJlbmFtZSBjb250cm9sLmNlbnRlciB0byBjb250cm9sLmtub2Igb3Igc2ltaWxhclxuICBjZW50ZXIoKSB7XG4gICAgLy8gTm90IHBvc2libGUgdG8gY2FsY3VsYXRlIGEgY2VudGVyXG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLndpdGhBbmdsZURpc3RhbmNlKHRoaXMuZGlzdGFuY2UoKSkuZW5kUG9pbnQoKTtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGBhbmNob3JgIHdpdGggdGhlIGNvbnRyb2wnc1xuICAvLyBgYW5nbGVEaXN0YW5jZWAuXG4gIGNvcHlBbmNob3IoKSB7XG4gICAgLy8gTm8gYW5jaG9yIHRvIGNvcHlcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aEFuZ2xlRGlzdGFuY2UodGhpcy5hbmdsZURpc3RhbmNlKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgbGV0IGFuY2hvckNvcHkgPSB0aGlzLmNvcHlBbmNob3IoKTtcblxuICAgIGxldCBhbmNob3JTdHlsZSA9IHRoaXMuc3R5bGUgIT09IG51bGxcbiAgICAgID8gdGhpcy5zdHlsZS53aXRoRmlsbCh0aGlzLnJhYy5GaWxsLm5vbmUpXG4gICAgICA6IG51bGw7XG4gICAgYW5jaG9yQ29weS5kcmF3KGFuY2hvclN0eWxlKTtcblxuICAgIGxldCBjZW50ZXIgPSB0aGlzLmNlbnRlcigpO1xuICAgIGxldCBhbmdsZSA9IGFuY2hvckNvcHkuY2VudGVyLmFuZ2xlVG9Qb2ludChjZW50ZXIpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IG1hcmtlclJhdGlvID0gdGhpcy5yYXRpb09mKGl0ZW0pO1xuICAgICAgaWYgKG1hcmtlclJhdGlvIDwgMCB8fCBtYXJrZXJSYXRpbyA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBtYXJrZXJBbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlLm11bHRPbmUobWFya2VyUmF0aW8pO1xuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gYW5jaG9yQ29weS5zaGlmdEFuZ2xlKG1hcmtlckFuZ2xlRGlzdGFuY2UpO1xuICAgICAgbGV0IHBvaW50ID0gYW5jaG9yQ29weS5wb2ludEF0QW5nbGUobWFya2VyQW5nbGUpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgbWFya2VyQW5nbGUucGVycGVuZGljdWxhcighYW5jaG9yQ29weS5jbG9ja3dpc2UpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wgYnV0dG9uXG4gICAgY2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCByYXRpb1ZhbHVlID0gdGhpcy5yYXRpb1ZhbHVlKCk7XG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmIChyYXRpb1ZhbHVlID49IHRoaXMucmF0aW9TdGFydExpbWl0KCkgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIGxldCBuZWdBbmdsZSA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoYW5jaG9yQ29weS5jbG9ja3dpc2UpLmludmVyc2UoKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBjZW50ZXIsIG5lZ0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGl2ZSBhcnJvd1xuICAgIGlmIChyYXRpb1ZhbHVlIDw9IHRoaXMucmF0aW9FbmRMaW1pdCgpIC0gdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgICBsZXQgcG9zQW5nbGUgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGFuY2hvckNvcHkuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBjZW50ZXIsIHBvc0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBSYWMucG9wQ29tcG9zaXRlKCkuZHJhdyh0aGlzLnN0eWxlKTtcblxuICAgIC8vIFNlbGVjdGlvblxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuICAgICAgY2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUpLmRyYXcodGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJDb250cm9sQ2VudGVyLCBhbmNob3JDb3B5KSB7XG4gICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhbmNob3JDb3B5LmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnJhdGlvU3RhcnRMaW1pdCgpKTtcbiAgICBsZXQgZW5kSW5zZXQgPSBhbmdsZURpc3RhbmNlLm11bHRPbmUoMSAtIHRoaXMucmF0aW9FbmRMaW1pdCgpKTtcblxuICAgIGxldCBzZWxlY3Rpb25BbmdsZSA9IGFuY2hvckNvcHkuY2VudGVyXG4gICAgICAuYW5nbGVUb1BvaW50KHBvaW50ZXJDb250cm9sQ2VudGVyKTtcbiAgICBzZWxlY3Rpb25BbmdsZSA9IGFuY2hvckNvcHkuY2xhbXBUb0FuZ2xlcyhzZWxlY3Rpb25BbmdsZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBhbmNob3JDb3B5LmRpc3RhbmNlRnJvbVN0YXJ0KHNlbGVjdGlvbkFuZ2xlKTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbmV3RGlzdGFuY2UudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVPZihsZW5ndGhSYXRpbyk7XG4gIH1cblxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGFuY2hvckNvcHksIHBvaW50ZXJPZmZzZXQpIHtcbiAgICBhbmNob3JDb3B5LmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IGFuY2hvckNvcHkuYW5nbGVEaXN0YW5jZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IG1hcmtlclJhdGlvID0gdGhpcy5yYXRpb09mKGl0ZW0pO1xuICAgICAgaWYgKG1hcmtlclJhdGlvIDwgMCB8fCBtYXJrZXJSYXRpbyA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGFuY2hvckNvcHkuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUobWFya2VyUmF0aW8pKTtcbiAgICAgIGxldCBtYXJrZXJQb2ludCA9IGFuY2hvckNvcHkucG9pbnRBdEFuZ2xlKG1hcmtlckFuZ2xlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgbWFya2VyUG9pbnQsIG1hcmtlckFuZ2xlLnBlcnBlbmRpY3VsYXIoIWFuY2hvckNvcHkuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgbGV0IHJhdGlvU3RhcnRMaW1pdCA9IHRoaXMucmF0aW9TdGFydExpbWl0KCk7XG4gICAgaWYgKHJhdGlvU3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5BbmdsZSA9IGFuY2hvckNvcHkuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUocmF0aW9TdGFydExpbWl0KSk7XG4gICAgICBsZXQgbWluUG9pbnQgPSBhbmNob3JDb3B5LnBvaW50QXRBbmdsZShtaW5BbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtaW5BbmdsZS5wZXJwZW5kaWN1bGFyKGFuY2hvckNvcHkuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIG1hcmtlckFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBsZXQgcmF0aW9FbmRMaW1pdCA9IHRoaXMucmF0aW9FbmRMaW1pdCgpO1xuICAgIGlmIChyYXRpb0VuZExpbWl0IDwgMSkge1xuICAgICAgbGV0IG1heEFuZ2xlID0gYW5jaG9yQ29weS5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UubXVsdE9uZShyYXRpb0VuZExpbWl0KSk7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBhbmNob3JDb3B5LnBvaW50QXRBbmdsZShtYXhBbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtYXhBbmdsZS5wZXJwZW5kaWN1bGFyKCFhbmNob3JDb3B5LmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1heFBvaW50LCBtYXJrZXJBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlck9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgYXJjIGNvbnRyb2wgZHJhZ2dpbmcgdmlzdWFscyFcblxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlKTtcbiAgfVxuXG59IC8vIGNsYXNzIEFyY0NvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyY0NvbnRyb2w7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gVE9ETzogZml4IHVzZXMgb2Ygc29tZUFuZ2xlXG5cblxuLyoqXG4qIFBhcmVudCBjbGFzcyBmb3IgYWxsIGNvbnRyb2xzIGZvciBtYW5pcHVsYXRpbmcgYSB2YWx1ZSB3aXRoIHRoZSBwb2ludGVyLlxuKiBSZXByZXNlbnRzIGEgY29udHJvbCB3aXRoIGEgdmFsdWUsIHZhbHVlLXJhbmdlLCBsaW1pdHMsIG1hcmtlcnMsIGFuZFxuKiBkcmF3aW5nIHN0eWxlLiBCeSBkZWZhdWx0IHRoZSBjb250cm9sIHJldHVybnMgYSBgdmFsdWVgIGluIHRoZSByYW5nZVxuKiBbMCwxXSBjb3Jlc3BvbmRpbmcgdG8gdGhlIGxvY2F0aW9uIG9mIHRoZSBjb250cm9sIGNlbnRlciBpbiByZWxhdGlvbiB0b1xuKiB0aGUgYW5jaG9yIHNoYXBlLiBUaGUgdmFsdWUtcmFuZ2UgaXMgZGVmaW5lZCBieSBgc3RhcnRWYWx1ZWAgYW5kXG4qIGBlbmRWYWx1ZWAuXG4qIEBhbGlhcyBSYWMuQ29udHJvbFxuKi9cbmNsYXNzIENvbnRyb2wge1xuXG4gIC8vIENyZWF0ZXMgYSBuZXcgQ29udHJvbCBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBgdmFsdWVgLCBhIGRlZmF1bHRcbiAgLy8gdmFsdWUtcmFuZ2Ugb2YgWzAsMV0sIGFuZCBsaW1pdHMgc2V0IGVxdWFsIHRvIHRoZSB2YWx1ZS1yYW5nZS5cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgc3RhcnRWYWx1ZSA9IDAsIGVuZFZhbHVlID0gMSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHZhbHVlLCBzdGFydFZhbHVlLCBlbmRWYWx1ZSk7XG5cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8vIFZhbHVlIGlzIGEgbnVtYmVyIGJldHdlZW4gc3RhcnRWYWx1ZSBhbmQgZW5kVmFsdWUuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgLy8gU3RhcnQgYW5kIGVuZCBvZiB0aGUgdmFsdWUgcmFuZ2UuXG4gICAgdGhpcy5zdGFydFZhbHVlID0gc3RhcnRWYWx1ZTtcbiAgICB0aGlzLmVuZFZhbHVlID0gZW5kVmFsdWU7XG5cbiAgICAvLyBMaW1pdHMgdG8gd2hpY2ggdGhlIGNvbnRyb2wgY2FuIGJlIGRyYWdnZWQuIEludGVycHJldGVkIGFzIHZhbHVlcyBpblxuICAgIC8vIHRoZSB2YWx1ZS1yYW5nZS5cbiAgICB0aGlzLnN0YXJ0TGltaXQgPSBzdGFydFZhbHVlO1xuICAgIHRoaXMuZW5kTGltaXQgPSBlbmRWYWx1ZTtcblxuICAgIC8vIENvbGxlY3Rpb24gb2YgdmFsdWVzIGF0IHdoaWNoIG1hcmtlcnMgYXJlIGRyYXduLlxuICAgIHRoaXMubWFya2VycyA9IFtdO1xuXG4gICAgdGhpcy5zdHlsZSA9IG51bGw7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBgdmFsdWVgIG9mIHRoZSBjb250cm9sIGluIGEgWzAsMV0gcmFuZ2UuXG4gIHJhdGlvVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF0aW9PZih0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGBzdGFydExpbWl0YCBvZiB0aGUgY29udHJvbCBpbiBhIFswLDFdIHJhbmdlLlxuICByYXRpb1N0YXJ0TGltaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF0aW9PZih0aGlzLnN0YXJ0TGltaXQpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgYGVuZExpbWl0YCBvZiB0aGUgY29udHJvbCBpbiBhIFswLDFdIHJhbmdlLlxuICByYXRpb0VuZExpbWl0KCkge1xuICAgIHJldHVybiB0aGlzLnJhdGlvT2YodGhpcy5lbmRMaW1pdCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBlcXVpdmFsZW50IG9mIHRoZSBnaXZlbiBgdmFsdWVgIGluIGEgWzAsMV0gcmFuZ2UuXG4gIHJhdGlvT2YodmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlIC0gdGhpcy5zdGFydFZhbHVlKSAvIHRoaXMudmFsdWVSYW5nZSgpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZXF1aXZhbGVudCBvZiB0aGUgZ2l2ZW4gcmF0aW8gaW4gdGhlIHJhbmdlIFswLDFdIHRvIGEgdmFsdWVcbiAgLy8gaW4gdGhlIHZhbHVlIHJhbmdlLlxuICB2YWx1ZU9mKHJhdGlvKSB7XG4gICAgcmV0dXJuIChyYXRpbyAqIHRoaXMudmFsdWVSYW5nZSgpKSArIHRoaXMuc3RhcnRWYWx1ZTtcbiAgfVxuXG4gIHZhbHVlUmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kVmFsdWUgLSB0aGlzLnN0YXJ0VmFsdWU7XG4gIH1cblxuICAvLyBTZXRzIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHR3byBpbnNldCB2YWx1ZXMgcmVsYXRpdmUgdG9cbiAgLy8gYHN0YXJ0VmFsdWVgIGFuZCBgZW5kVmFsdWVgLlxuICBzZXRMaW1pdHNXaXRoVmFsdWVJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICBsZXQgcmFuZ2VEaXJlY3Rpb24gPSB0aGlzLnZhbHVlUmFuZ2UoKSA+PSAwID8gMSA6IC0xO1xuXG4gICAgdGhpcy5zdGFydExpbWl0ID0gdGhpcy5zdGFydFZhbHVlICsgKHN0YXJ0SW5zZXQgKiByYW5nZURpcmVjdGlvbik7XG4gICAgdGhpcy5lbmRMaW1pdCA9IHRoaXMuZW5kVmFsdWUgLSAoZW5kSW5zZXQgKiByYW5nZURpcmVjdGlvbik7XG4gIH1cblxuICAvLyBTZXRzIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHR3byBpbnNldCB2YWx1ZXMgcmVsYXRpdmUgdG8gdGhlXG4gIC8vIFswLDFdIHJhbmdlLlxuICBzZXRMaW1pdHNXaXRoUmF0aW9JbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldCk7XG4gICAgdGhpcy5lbmRMaW1pdCA9IHRoaXMudmFsdWVPZigxIC0gZW5kSW5zZXQpO1xuICB9XG5cbiAgLy8gQWRkcyBhIG1hcmtlciBhdCB0aGUgY3VycmVudCBgdmFsdWVgLlxuICBhZGRNYXJrZXJBdEN1cnJlbnRWYWx1ZSgpIHtcbiAgICB0aGlzLm1hcmtlcnMucHVzaCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYHRydWVgIGlmIHRoaXMgY29udHJvbCBpcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wuXG4gIGlzU2VsZWN0ZWQoKSB7XG4gICAgaWYgKHRoaXMucmFjLmNvbnRyb2xsZXIuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJhYy5jb250cm9sbGVyLnNlbGVjdGlvbi5jb250cm9sID09PSB0aGlzO1xuICB9XG5cbiAgLy8gQWJzdHJhY3QgZnVuY3Rpb24uXG4gIC8vIFJldHVybnMgdGhlIGNlbnRlciBvZiB0aGUgY29udHJvbCBoaXRwb2ludC5cbiAgY2VudGVyKCkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbiAgLy8gQWJzdHJhY3QgZnVuY3Rpb24uXG4gIC8vIFJldHVybnMgdGhlIHBlcnNpc3RlbnQgY29weSBvZiB0aGUgY29udHJvbCBhbmNob3IgdG8gYmUgdXNlZCBkdXJpbmdcbiAgLy8gdXNlciBpbnRlcmFjdGlvbi5cbiAgY29weUFuY2hvcigpIHtcbiAgICBjb25zb2xlLnRyYWNlKGBBYnN0cmFjdCBmdW5jdGlvbiBjYWxsZWQgLSB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgICB0aHJvdyByYWMuRXJyb3IuYWJzdHJhY3RGdW5jdGlvbkNhbGxlZDtcbiAgfVxuXG4gIC8vIEFic3RyYWN0IGZ1bmN0aW9uLlxuICAvLyBEcmF3cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgY29udHJvbC5cbiAgZHJhdygpIHtcbiAgICBjb25zb2xlLnRyYWNlKGBBYnN0cmFjdCBmdW5jdGlvbiBjYWxsZWQgLSB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgICB0aHJvdyByYWMuRXJyb3IuYWJzdHJhY3RGdW5jdGlvbkNhbGxlZDtcbiAgfVxuXG4gIC8vIEFic3RyYWN0IGZ1bmN0aW9uLlxuICAvLyBVcGRhdGVzIHRoZSBjb250cm9sIHZhbHVlIHdpdGggYHBvaW50ZXJDb250cm9sQ2VudGVyYCBpbiByZWxhdGlvbiB0b1xuICAvLyBgYW5jaG9yQ29weWAuIENhbGxlZCBieSBgcG9pbnRlckRyYWdnZWRgIGFzIHRoZSB1c2VyIGludGVyYWN0cyB3aXRoIGFcbiAgLy8gc2VsZWN0ZWQgY29udHJvbC5cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlckNvbnRyb2xDZW50ZXIsIGFuY2hvckNvcHkpIHtcbiAgICBjb25zb2xlLnRyYWNlKGBBYnN0cmFjdCBmdW5jdGlvbiBjYWxsZWQgLSB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgICB0aHJvdyByYWMuRXJyb3IuYWJzdHJhY3RGdW5jdGlvbkNhbGxlZDtcbiAgfVxuXG4gIC8vIEFic3RyYWN0IGZ1bmN0aW9uLlxuICAvLyBEcmF3cyB0aGUgc2VsZWN0aW9uIHN0YXRlIGZvciB0aGUgY29udHJvbCwgYWxvbmcgd2l0aCBwb2ludGVyXG4gIC8vIGludGVyYWN0aW9uIHZpc3VhbHMuIENhbGxlZCBieSBgZHJhd0NvbnRyb2xzYCBmb3IgdGhlIGN1cnJlbnRseVxuICAvLyBzZWxlY3RlZCBjb250cm9sLlxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGFuY2hvckNvcHksIHBvaW50ZXJPZmZzZXQpIHtcbiAgICBjb25zb2xlLnRyYWNlKGBBYnN0cmFjdCBmdW5jdGlvbiBjYWxsZWQgLSB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgICB0aHJvdyByYWMuRXJyb3IuYWJzdHJhY3RGdW5jdGlvbkNhbGxlZDtcbiAgfVxuXG59IC8vIGNsYXNzIENvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2w7XG5cblxuLy8gQ29udHJvbHMgc2hhcmVkIGRyYXdpbmcgZWxlbWVudHNcblxuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSA9IGZ1bmN0aW9uKHJhYywgY2VudGVyLCBhbmdsZSkge1xuICAvLyBBcmNcbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSByYWMuQW5nbGUuZnJvbSgxLzIyKTtcbiAgbGV0IGFyYyA9IGNlbnRlci5hcmMocmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cyAqIDEuNSxcbiAgICBhbmdsZS5zdWJ0cmFjdChhbmdsZURpc3RhbmNlKSwgYW5nbGUuYWRkKGFuZ2xlRGlzdGFuY2UpKTtcblxuICAvLyBBcnJvdyB3YWxsc1xuICBsZXQgcG9pbnRBbmdsZSA9IHJhYy5BbmdsZS5mcm9tKDEvOCk7XG4gIGxldCByaWdodFdhbGwgPSBhcmMuc3RhcnRQb2ludCgpLnJheShhbmdsZS5hZGQocG9pbnRBbmdsZSkpO1xuICBsZXQgbGVmdFdhbGwgPSBhcmMuZW5kUG9pbnQoKS5yYXkoYW5nbGUuc3VidHJhY3QocG9pbnRBbmdsZSkpO1xuXG4gIC8vIEFycm93IHBvaW50XG4gIGxldCBwb2ludCA9IHJpZ2h0V2FsbC5wb2ludEF0SW50ZXJzZWN0aW9uKGxlZnRXYWxsKTtcblxuICAvLyBTaGFwZVxuICBsZXQgYXJyb3cgPSBuZXcgUmFjLlNoYXBlKHJhYyk7XG4gIHBvaW50LnNlZ21lbnRUb1BvaW50KGFyYy5zdGFydFBvaW50KCkpXG4gICAgLmF0dGFjaFRvKGFycm93KTtcbiAgYXJjLmF0dGFjaFRvKGFycm93KVxuICAgIC5lbmRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHBvaW50KVxuICAgIC5hdHRhY2hUbyhhcnJvdyk7XG5cbiAgICByZXR1cm4gYXJyb3c7XG59O1xuXG5Db250cm9sLm1ha2VMaW1pdE1hcmtlciA9IGZ1bmN0aW9uKHJhYywgcG9pbnQsIHNvbWVBbmdsZSkge1xuICBsZXQgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICBsZXQgcGVycGVuZGljdWxhciA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoZmFsc2UpO1xuICBsZXQgY29tcG9zaXRlID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcblxuICBwb2ludC5zZWdtZW50VG9BbmdsZShwZXJwZW5kaWN1bGFyLCA0KVxuICAgIC53aXRoU3RhcnRFeHRlbmRlZCg0KVxuICAgIC5hdHRhY2hUbyhjb21wb3NpdGUpO1xuICBwb2ludC5wb2ludFRvQW5nbGUocGVycGVuZGljdWxhciwgOCkuYXJjKDMpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG5cbiAgcmV0dXJuIGNvbXBvc2l0ZTtcbn07XG5cbkNvbnRyb2wubWFrZVZhbHVlTWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgc29tZUFuZ2xlKSB7XG4gIGxldCBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKHNvbWVBbmdsZSk7XG4gIHJldHVybiBwb2ludC5zZWdtZW50VG9BbmdsZShhbmdsZS5wZXJwZW5kaWN1bGFyKCksIDMpXG4gICAgLndpdGhTdGFydEV4dGVuZGVkKDMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogSW5mb3JtYXRpb24gcmVnYXJkaW5nIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgYENvbnRyb2xgLlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xsZXIuU2VsZWN0aW9uXG4qL1xuY2xhc3MgQ29udHJvbFNlbGVjdGlvbntcbiAgY29uc3RydWN0b3IoY29udHJvbCwgcG9pbnRlckNlbnRlcikge1xuICAgIC8vIFNlbGVjdGVkIGNvbnRyb2wgaW5zdGFuY2UuXG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICAvLyBDb3B5IG9mIHRoZSBjb250cm9sIGFuY2hvciwgc28gdGhhdCB0aGUgY29udHJvbCBjYW4gbW92ZSB0aWVkIHRvXG4gICAgLy8gdGhlIGRyYXdpbmcsIHdoaWxlIHRoZSBpbnRlcmFjdGlvbiByYW5nZSByZW1haW5zIGZpeGVkLlxuICAgIHRoaXMuYW5jaG9yQ29weSA9IGNvbnRyb2wuY29weUFuY2hvcigpO1xuICAgIC8vIFNlZ21lbnQgZnJvbSB0aGUgY2FwdHVyZWQgcG9pbnRlciBwb3NpdGlvbiB0byB0aGUgY29udHJvIGNlbnRlcixcbiAgICAvLyB1c2VkIHRvIGF0dGFjaCB0aGUgY29udHJvbCB0byB0aGUgcG9pbnQgd2hlcmUgaW50ZXJhY3Rpb24gc3RhcnRlZC5cbiAgICAvLyBQb2ludGVyIGlzIGF0IGBzZWdtZW50LnN0YXJ0YCBhbmQgY29udHJvbCBjZW50ZXIgaXMgYXQgYHNlZ21lbnQuZW5kYC5cbiAgICB0aGlzLnBvaW50ZXJPZmZzZXQgPSBwb2ludGVyQ2VudGVyLnNlZ21lbnRUb1BvaW50KGNvbnRyb2wuY2VudGVyKCkpO1xuICB9XG5cbiAgZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyKSB7XG4gICAgdGhpcy5jb250cm9sLmRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgdGhpcy5hbmNob3JDb3B5LCB0aGlzLnBvaW50ZXJPZmZzZXQpO1xuICB9XG59XG5cblxuLyoqXG4qIFRoZSBgQ29udHJvbGxlcmAgaXMgdGhlIG9iamVjdCB0aGF0IG1hbmFnZXMgdGhlIGNvbnRyb2wgc3lzdGVtIGZvciBhblxuKiBpbnN0YW5jZSBvZiBgUmFjYC5cbipcbiogVGhpcyBpbnN0YW5jZSBob2xkcyBjb250cm9sIHNldHRpbmdzIGxpa2UgcG9pbnRlciBzdHlsZSBvciB0aGVcbioga25vYiByYWRpdXMuIEl0IGFsc28gbWFudGFpbnMgdGhlIHN0YXRlIG9mIHRoZSBjb250cm9sIHN5c3RlbSwgbGlrZSB0aGVcbiogY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wsIGxhc3QgcG9pbnRlciwgYW5kIHRoZSBjb2xsZWN0aW9uIG9mIGFsbFxuKiBhdmFpbGFibGUgY29udHJvbHMuXG4qXG4qIEBhbGlhcyBSYWMuQ29udHJvbGxlclxuKi9cbmNsYXNzIENvbnRyb2xsZXIge1xuXG4gIHN0YXRpYyBTZWxlY3Rpb24gPSBDb250cm9sU2VsZWN0aW9uO1xuXG5cbiAgLyoqXG4gICogQnVpbGRzIGEgbmV3IGBDb250cm9sbGVyYCB3aXRoIHRoZSBnaXZlbiBgUmFjYCBpbnN0YW5jZS5cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjKSB7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogRGlzdGFuY2UgYXQgd2hpY2ggdGhlIHBvaW50ZXIgaXMgY29uc2lkZXJlZCB0byBpbnRlcmFjdCB3aXRoIGFcbiAgICAqIGNvbnRyb2wga25vYi4gQWxzbyB1c2VkIGJ5IGNvbnRyb2xzIGZvciBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmtub2JSYWRpdXMgPSAyMjtcblxuICAgIC8vIENvbGxlY3Rpb24gb2YgYWxsIGNvbnRyb2xzIHRoYXQgYXJlIGRyYXduIHdpdGggYGRyYXdDb250cm9scygpYFxuICAgIC8vIGFuZCBldmFsdWF0ZWQgZm9yIHNlbGVjdGlvbiB3aXRoIHRoZSBgcG9pbnRlci4uLigpYCBmdW5jdGlvbnMuXG4gICAgdGhpcy5jb250cm9scyA9IFtdO1xuXG4gICAgLy8gTGFzdCBgUG9pbnRgIG9mIHRoZSBwb3NpdGlvbiB3aGVuIHRoZSBwb2ludGVyIHdhcyBwcmVzc2VkLCBvciBsYXN0XG4gICAgLy8gQ29udHJvbCBpbnRlcmFjdGVkIHdpdGguIFNldCB0byBgbnVsbGAgd2hlbiB0aGVyZSBoYXMgYmVlbiBub1xuICAgIC8vIGludGVyYWN0aW9uIHlldCBhbmQgd2hpbGUgdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLlxuICAgIC8vIFRPRE86IHNlcGFyYXRlIGxhc3RDb250cm9sIGZyb20gbGFzdFBvaW50ZXJcbiAgICB0aGlzLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAgIC8vIFN0eWxlIHVzZWQgZm9yIHZpc3VhbCBlbGVtZW50cyByZWxhdGVkIHRvIHNlbGVjdGlvbiBhbmQgcG9pbnRlclxuICAgIC8vIGludGVyYWN0aW9uLlxuICAgIHRoaXMucG9pbnRlclN0eWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU2VsZWN0aW9uIGluZm9ybWF0aW9uIGZvciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wsIG9yIGBudWxsYFxuICAgICogd2hlbiB0aGVyZSBpcyBubyBzZWxlY3Rpb24uXG4gICAgKiBAdHlwZSB7P1JhYy5Db250cm9sbGVyLlNlbGVjdGlvbn1cbiAgICAqL1xuICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbDtcblxuICB9IC8vIGNvbnN0cnVjdG9yXG5cblxuICAvLyBDYWxsIHRvIHNpZ25hbCB0aGUgcG9pbnRlciBiZWluZyBwcmVzc2VkLiBJZiB0aGUgcG9udGVyIGhpdHMgYSBjb250cm9sXG4gIC8vIGl0IHdpbGwgYmUgY29uc2lkZXJlZCBzZWxlY3RlZC4gV2hlbiBhIGNvbnRyb2wgaXMgc2VsZWN0ZWQgYSBjb3B5IG9mIGl0c1xuICAvLyBhbmNob3IgaXMgc3RvcmVkIGFzIHRvIGFsbG93IGludGVyYWN0aW9uIHdpdGggYSBmaXhlZCBhbmNob3IuXG4gIHBvaW50ZXJQcmVzc2VkKHBvaW50ZXJDZW50ZXIpIHtcbiAgICB0aGlzLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAgIC8vIFRlc3QgcG9pbnRlciBoaXRcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuY29udHJvbHMuZmluZCggaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sQ2VudGVyID0gaXRlbS5jZW50ZXIoKTtcbiAgICAgIGlmIChjb250cm9sQ2VudGVyID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGNvbnRyb2xDZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50ZXJDZW50ZXIpIDw9IHRoaXMua25vYlJhZGl1cykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIGlmIChzZWxlY3RlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBuZXcgQ29udHJvbGxlci5TZWxlY3Rpb24oc2VsZWN0ZWQsIHBvaW50ZXJDZW50ZXIpO1xuICB9XG5cblxuICAvLyBDYWxsIHRvIHNpZ25hbCB0aGUgcG9pbnRlciBiZWluZyBkcmFnZ2VkLiBBcyB0aGUgcG9pbnRlciBtb3ZlcyB0aGVcbiAgLy8gc2VsZWN0ZWQgY29udHJvbCBpcyB1cGRhdGVkIHdpdGggYSBuZXcgYGRpc3RhbmNlYC5cbiAgcG9pbnRlckRyYWdnZWQocG9pbnRlckNlbnRlcil7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLnNlbGVjdGlvbi5jb250cm9sO1xuICAgIGxldCBhbmNob3JDb3B5ID0gdGhpcy5zZWxlY3Rpb24uYW5jaG9yQ29weTtcblxuICAgIC8vIENlbnRlciBvZiBkcmFnZ2VkIGNvbnRyb2wgaW4gdGhlIHBvaW50ZXIgY3VycmVudCBwb3NpdGlvblxuICAgIGxldCBjdXJyZW50UG9pbnRlckNvbnRyb2xDZW50ZXIgPSB0aGlzLnNlbGVjdGlvbi5wb2ludGVyT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgY29udHJvbC51cGRhdGVXaXRoUG9pbnRlcihjdXJyZW50UG9pbnRlckNvbnRyb2xDZW50ZXIsIGFuY2hvckNvcHkpO1xuICB9XG5cblxuICAvLyBDYWxsIHRvIHNpZ25hbCB0aGUgcG9pbnRlciBiZWluZyByZWxlYXNlZC4gVXBvbiByZWxlYXNlIHRoZSBzZWxlY3RlZFxuICAvLyBjb250cm9sIGlzIGNsZWFyZWQuXG4gIHBvaW50ZXJSZWxlYXNlZChwb2ludGVyQ2VudGVyKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICB0aGlzLmxhc3RQb2ludGVyID0gcG9pbnRlckNlbnRlcjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RQb2ludGVyID0gdGhpcy5zZWxlY3Rpb24uY29udHJvbDtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG4gIH1cblxuXG4gIC8vIERyYXdzIGNvbnRyb2xzIGFuZCB0aGUgdmlzdWFscyBvZiBwb2ludGVyIGFuZCBjb250cm9sIHNlbGVjdGlvbi4gVXN1YWxseVxuICAvLyBjYWxsZWQgYXQgdGhlIGVuZCBvZiBgZHJhd2Agc28gdGhhdCBjb250cm9scyBzaXRzIG9uIHRvcCBvZiB0aGUgZHJhd2luZy5cbiAgZHJhd0NvbnRyb2xzKCkge1xuICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnBvaW50ZXJTdHlsZTtcblxuICAgIC8vIExhc3QgcG9pbnRlciBvciBjb250cm9sXG4gICAgaWYgKHRoaXMubGFzdFBvaW50ZXIgaW5zdGFuY2VvZiBSYWMuUG9pbnQpIHtcbiAgICAgIHRoaXMubGFzdFBvaW50ZXIuYXJjKDEyKS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxhc3RQb2ludGVyIGluc3RhbmNlb2YgUmFjLkNvbnRyb2wpIHtcbiAgICAgIC8vIFRPRE86IGltcGxlbWVudCBsYXN0IHNlbGVjdGVkIGNvbnRyb2wgc3RhdGVcbiAgICB9XG5cbiAgICAvLyBQb2ludGVyIHByZXNzZWRcbiAgICBsZXQgcG9pbnRlckNlbnRlciA9IHRoaXMucmFjLlBvaW50LnBvaW50ZXIoKTtcbiAgICBpZiAodGhpcy5yYWMuZHJhd2VyLnA1Lm1vdXNlSXNQcmVzc2VkKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgcG9pbnRlckNlbnRlci5hcmMoMTApLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvaW50ZXJDZW50ZXIuYXJjKDUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBbGwgY29udHJvbHMgaW4gZGlzcGxheVxuICAgIHRoaXMuY29udHJvbHMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZHJhdygpKTtcblxuICAgIGlmICh0aGlzLnNlbGVjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyKTtcbiAgICB9XG4gIH1cblxuXG59IC8vIGNsYXNzIENvbnRyb2xsZXJcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRyb2wgdGhhdCB1c2VzIGEgYFNlZ21lbnRgIGFzIGFuY2hvci5cbiogQGFsaWFzIFJhYy5TZWdtZW50Q29udHJvbFxuKi9cbmNsYXNzIFNlZ21lbnRDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8vIENyZWF0ZXMgYSBuZXcgQ29udHJvbCBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBgdmFsdWVgIGFuZCBgbGVuZ3RoYC5cbiAgLy8gQnkgZGVmYXVsdCB0aGUgdmFsdWUgcmFuZ2UgaXMgWzAsMV0gYW5kIGxpbWl0cyBhcmUgc2V0IHRvIGJlIHRoZSBlcXVhbFxuICAvLyBhcyBgc3RhcnRWYWx1ZWAgYW5kIGBlbmRWYWx1ZWAuXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGxlbmd0aCwgc3RhcnRWYWx1ZSA9IDAsIGVuZFZhbHVlID0gMSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHZhbHVlLCBsZW5ndGgsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIC8vIExlbmd0aCBmb3IgdGhlIGNvcGllZCBhbmNob3Igc2hhcGUuXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIFdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAvLyBkcmF3biBhbmQgaW50ZXJhY3RlZCBhIGNvcHkgb2YgdGhlIGFuY2hvciBpcyBjcmVhdGVkIHdpdGggdGhlXG4gICAgLy8gY29udHJvbCdzIGBsZW5ndGhgLlxuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcbiAgfVxuXG4gIHNldFZhbHVlV2l0aExlbmd0aChsZW5ndGhWYWx1ZSkge1xuICAgIGxldCBsZW5ndGhSYXRpbyA9IGxlbmd0aFZhbHVlIC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVPZihsZW5ndGhSYXRpbyk7XG4gIH1cblxuICAvLyBTZXRzIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHR3byBpbnNldCB2YWx1ZXMgcmVsYXRpdmUgdG9cbiAgLy8gemVybyBhbmQgYGxlbmd0aGAuXG4gIHNldExpbWl0c1dpdGhMZW5ndGhJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldCAvIHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKCh0aGlzLmxlbmd0aCAtIGVuZEluc2V0KSAvIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLy8gUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgYW5jaG9yLnN0YXJ0YCB0byB0aGUgY29udHJvbCBjZW50ZXIuXG4gIGRpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCAqIHRoaXMucmF0aW9WYWx1ZSgpO1xuICB9XG5cbiAgY2VudGVyKCkge1xuICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSBhIGNlbnRlclxuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci53aXRoTGVuZ3RoKHRoaXMuZGlzdGFuY2UoKSkuZW5kUG9pbnQoKTtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGBhbmNob3JgIHdpdGggdGhlIGNvbnRyb2wgYGxlbmd0aGAuXG4gIGNvcHlBbmNob3IoKSB7XG4gICAgLy8gTm8gYW5jaG9yIHRvIGNvcHlcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aExlbmd0aCh0aGlzLmxlbmd0aCk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGxldCBhbmNob3JDb3B5ID0gdGhpcy5jb3B5QW5jaG9yKCk7XG4gICAgYW5jaG9yQ29weS5kcmF3KHRoaXMuc3R5bGUpO1xuXG4gICAgbGV0IGNlbnRlciA9IHRoaXMuY2VudGVyKCk7XG4gICAgbGV0IGFuZ2xlID0gYW5jaG9yQ29weS5hbmdsZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IG1hcmtlclJhdGlvID0gdGhpcy5yYXRpb09mKGl0ZW0pO1xuICAgICAgaWYgKG1hcmtlclJhdGlvIDwgMCB8fCBtYXJrZXJSYXRpbyA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBwb2ludCA9IGFuY2hvckNvcHkuc3RhcnQucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLmxlbmd0aCAqIG1hcmtlclJhdGlvKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgcG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wgYnV0dG9uXG4gICAgY2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCByYXRpb1ZhbHVlID0gdGhpcy5yYXRpb1ZhbHVlKCk7XG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmIChyYXRpb1ZhbHVlID49IHRoaXMucmF0aW9TdGFydExpbWl0KCkgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBjZW50ZXIsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAocmF0aW9WYWx1ZSA8PSB0aGlzLnJhdGlvRW5kTGltaXQoKSAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGNlbnRlciwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHRoaXMuc3R5bGUpO1xuXG4gICAgLy8gU2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBjZW50ZXIuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cyAqIDEuNSkuZHJhdyh0aGlzLnJhYy5jb250cm9sbGVyLnBvaW50ZXJTdHlsZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlckNvbnRyb2xDZW50ZXIsIGFuY2hvckNvcHkpIHtcbiAgICBsZXQgbGVuZ3RoID0gYW5jaG9yQ29weS5sZW5ndGg7XG4gICAgbGV0IHN0YXJ0SW5zZXQgPSBsZW5ndGggKiB0aGlzLnJhdGlvU3RhcnRMaW1pdCgpO1xuICAgIGxldCBlbmRJbnNldCA9IGxlbmd0aCAqICgxIC0gdGhpcy5yYXRpb0VuZExpbWl0KCkpO1xuXG4gICAgLy8gTmV3IHZhbHVlIGZyb20gdGhlIGN1cnJlbnQgcG9pbnRlciBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gYW5jaG9yQ29weVxuICAgIGxldCBuZXdEaXN0YW5jZSA9IGFuY2hvckNvcHlcbiAgICAgIC5yYXkuZGlzdGFuY2VUb1Byb2plY3RlZFBvaW50KHBvaW50ZXJDb250cm9sQ2VudGVyKTtcbiAgICAvLyBDbGFtcGluZyB2YWx1ZSAoamF2YXNjcmlwdCBoYXMgbm8gTWF0aC5jbGFtcClcbiAgICBuZXdEaXN0YW5jZSA9IGFuY2hvckNvcHkuY2xhbXBUb0xlbmd0aChuZXdEaXN0YW5jZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbmV3RGlzdGFuY2UgLyBsZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVPZihsZW5ndGhSYXRpbyk7XG4gIH1cblxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGFuY2hvckNvcHksIHBvaW50ZXJPZmZzZXQpIHtcbiAgICBhbmNob3JDb3B5LmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICBsZXQgYW5nbGUgPSBhbmNob3JDb3B5LmFuZ2xlKCk7XG4gICAgbGV0IGxlbmd0aCA9IGFuY2hvckNvcHkubGVuZ3RoO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IG1hcmtlclJhdGlvID0gdGhpcy5yYXRpb09mKGl0ZW0pO1xuICAgICAgaWYgKG1hcmtlclJhdGlvIDwgMCB8fCBtYXJrZXJSYXRpbyA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBtYXJrZXJQb2ludCA9IGFuY2hvckNvcHkuc3RhcnQucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiBtYXJrZXJSYXRpbyk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIG1hcmtlclBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgbGV0IHJhdGlvU3RhcnRMaW1pdCA9IHRoaXMucmF0aW9TdGFydExpbWl0KCk7XG4gICAgaWYgKHJhdGlvU3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5Qb2ludCA9IGFuY2hvckNvcHkuc3RhcnQucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiByYXRpb1N0YXJ0TGltaXQpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtaW5Qb2ludCwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIGxldCByYXRpb0VuZExpbWl0ID0gdGhpcy5yYXRpb0VuZExpbWl0KCk7XG4gICAgaWYgKHJhdGlvRW5kTGltaXQgPCAxKSB7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBhbmNob3JDb3B5LnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogcmF0aW9FbmRMaW1pdCk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1heFBvaW50LCBhbmdsZS5pbnZlcnNlKCkpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFNlZ21lbnQgZnJvbSBwb2ludGVyIHRvIGNvbnRyb2wgZHJhZ2dlZCBjZW50ZXJcbiAgICBsZXQgZHJhZ2dlZENlbnRlciA9IHBvaW50ZXJPZmZzZXRcbiAgICAgIC53aXRoU3RhcnRQb2ludChwb2ludGVyQ2VudGVyKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAvLyBDb250cm9sIGRyYWdnZWQgY2VudGVyLCBhdHRhY2hlZCB0byBwb2ludGVyXG4gICAgZHJhZ2dlZENlbnRlci5hcmMoMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gQ29uc3RyYWluZWQgbGVuZ3RoIGNsYW1wZWQgdG8gbGltaXRzXG4gICAgbGV0IGNvbnN0cmFpbmVkTGVuZ3RoID0gYW5jaG9yQ29weVxuICAgICAgLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQoZHJhZ2dlZENlbnRlcik7XG4gICAgbGV0IHN0YXJ0SW5zZXQgPSBsZW5ndGggKiByYXRpb1N0YXJ0TGltaXQ7XG4gICAgbGV0IGVuZEluc2V0ID0gbGVuZ3RoICogKDEgLSByYXRpb0VuZExpbWl0KTtcbiAgICBjb25zdHJhaW5lZExlbmd0aCA9IGFuY2hvckNvcHkuY2xhbXBUb0xlbmd0aChjb25zdHJhaW5lZExlbmd0aCxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcblxuICAgIGxldCBjb25zdHJhaW5lZEFuY2hvckNlbnRlciA9IGFuY2hvckNvcHlcbiAgICAgIC53aXRoTGVuZ3RoKGNvbnN0cmFpbmVkTGVuZ3RoKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAvLyBDb250cm9sIGNlbnRlciBjb25zdHJhaW5lZCB0byBhbmNob3JcbiAgICBjb25zdHJhaW5lZEFuY2hvckNlbnRlci5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBEcmFnZ2VkIHNoYWRvdyBjZW50ZXIsIHNlbWkgYXR0YWNoZWQgdG8gcG9pbnRlclxuICAgIC8vIGFsd2F5cyBwZXJwZW5kaWN1bGFyIHRvIGFuY2hvclxuICAgIGxldCBkcmFnZ2VkU2hhZG93Q2VudGVyID0gZHJhZ2dlZENlbnRlclxuICAgICAgLnNlZ21lbnRUb1Byb2plY3Rpb25JblJheShhbmNob3JDb3B5LnJheSlcbiAgICAgIC8vIHJldmVyc2UgYW5kIHRyYW5zbGF0ZWQgdG8gY29uc3RyYWludCB0byBhbmNob3JcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoU3RhcnRQb2ludChjb25zdHJhaW5lZEFuY2hvckNlbnRlcilcbiAgICAgIC8vIFNlZ21lbnQgZnJvbSBjb25zdHJhaW5lZCBjZW50ZXIgdG8gc2hhZG93IGNlbnRlclxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBzaGFkb3cgY2VudGVyXG4gICAgZHJhZ2dlZFNoYWRvd0NlbnRlci5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzIC8gMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRWFzZSBmb3Igc2VnbWVudCB0byBkcmFnZ2VkIHNoYWRvdyBjZW50ZXJcbiAgICBsZXQgZWFzZU91dCA9IFJhYy5FYXNlRnVuY3Rpb24ubWFrZUVhc2VPdXQoKTtcbiAgICBlYXNlT3V0LnBvc3RCZWhhdmlvciA9IFJhYy5FYXNlRnVuY3Rpb24uQmVoYXZpb3IuY2xhbXA7XG5cbiAgICAvLyBUYWlsIHdpbGwgc3RvcCBzdHJldGNoaW5nIGF0IDJ4IHRoZSBtYXggdGFpbCBsZW5ndGhcbiAgICBsZXQgbWF4RHJhZ2dlZFRhaWxMZW5ndGggPSB0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiA1O1xuICAgIGVhc2VPdXQuaW5SYW5nZSA9IG1heERyYWdnZWRUYWlsTGVuZ3RoICogMjtcbiAgICBlYXNlT3V0Lm91dFJhbmdlID0gbWF4RHJhZ2dlZFRhaWxMZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvIGRyYWdnZWQgc2hhZG93IGNlbnRlclxuICAgIGxldCBkcmFnZ2VkVGFpbCA9IGRyYWdnZWRTaGFkb3dDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qb2ludChkcmFnZ2VkQ2VudGVyKTtcblxuICAgIGxldCBlYXNlZExlbmd0aCA9IGVhc2VPdXQuZWFzZVZhbHVlKGRyYWdnZWRUYWlsLmxlbmd0aCk7XG4gICAgZHJhZ2dlZFRhaWwud2l0aExlbmd0aChlYXNlZExlbmd0aCkuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYXcgYWxsIVxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlKTtcbiAgfVxuXG59IC8vIGNsYXNzIFNlZ21lbnRDb250cm9sXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTZWdtZW50Q29udHJvbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEFuZ2xlIG1lYXN1cmVkIGJ5IGEgYHR1cm5gIHZhbHVlIGluIHRoZSByYW5nZSAqWzAsMSkqIHRoYXQgcmVwcmVzZW50cyB0aGVcbiogYW1vdW50IG9mIHR1cm4gaW4gYSBmdWxsIGNpcmNsZS5cbipcbiogTW9zdCBmdW5jdGlvbnMgdGhyb3VnaCBSQUMgdGhhdCBjYW4gcmVjZWl2ZSBhbiBgQW5nbGVgIHBhcmFtZXRlciBjYW5cbiogYWxzbyByZWNlaXZlIGEgYG51bWJlcmAgdmFsdWUgdGhhdCB3aWxsIGJlIHVzZWQgYXMgYHR1cm5gIHRvIGluc3RhbnRpYXRlXG4qIGEgbmV3IGBBbmdsZWAuIFRoZSBtYWluIGV4Y2VwdGlvbiB0byB0aGlzIGJlaGF2aW91ciBhcmUgY29uc3RydWN0b3JzLFxuKiB3aGljaCBhbHdheXMgZXhwZWN0IHRvIHJlY2VpdmUgYEFuZ2xlYCBvYmplY3RzLlxuKlxuKiBGb3IgZHJhd2luZyBvcGVyYXRpb25zIHRoZSB0dXJuIHZhbHVlIGlzIGludGVycHJldGVkIHRvIGJlIHBvaW50aW5nIHRvXG4qIHRoZSBmb2xsb3dpbmcgZGlyZWN0aW9uczpcbiogKyBgMC80YCAtIHBvaW50cyByaWdodFxuKiArIGAxLzRgIC0gcG9pbnRzIGRvd253YXJkc1xuKiArIGAyLzRgIC0gcG9pbnRzIGxlZnRcbiogKyBgMy80YCAtIHBvaW50cyB1cHdhcmRzXG4qXG4qIEBhbGlhcyBSYWMuQW5nbGVcbiovXG5jbGFzcyBBbmdsZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQW5nbGVgIGluc3RhbmNlLlxuICAqXG4gICogVGhlIGB0dXJuYCB2YWx1ZSBpcyBjb25zdHJhaW5lZCB0byB0aGUgcmFuY2UgKlswLDEpKiwgYW55IHZhbHVlXG4gICogb3V0c2lkZSBpcyByZWR1Y2VkIGJhY2sgaW50byByYW5nZSB1c2luZyBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBgYGBcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgMS80KSAgLy8gdHVybiBpcyAxLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgNS80KSAgLy8gdHVybiBpcyAxLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgLTEvNCkgLy8gdHVybiBpcyAzLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgMSkgICAgLy8gdHVybiBpcyAwXG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDQpICAgIC8vIHR1cm4gaXMgMFxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWVcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB0dXJuKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHR1cm4pO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICB0dXJuID0gdHVybiAlIDE7XG4gICAgaWYgKHR1cm4gPCAwKSB7XG4gICAgICB0dXJuID0gKHR1cm4gKyAxKSAlIDE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBUdXJuIHZhbHVlIG9mIHRoZSBhbmdsZSwgY29uc3RyYWluZWQgdG8gdGhlIHJhbmdlICpbMCwxKSouXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy50dXJuID0gdHVybjtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB0dXJuU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMudHVybiwgZGlnaXRzKTtcbiAgICByZXR1cm4gYEFuZ2xlKCR7dHVyblN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgZGlmZmVyZW5jZSB3aXRoIHRoZSBgdHVybmAgdmFsdWUgb2YgdGhlIGFuZ2xlXG4gICogZGVyaXZlZCBbZnJvbV17QGxpbmsgUmFjLkFuZ2xlLmZyb219IGBhbmdsZWAgaXMgdW5kZXJcbiAgKiBge0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9YCwgb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIEZvciB0aGlzIG1ldGhvZCBgb3RoZXJBbmdsZWAgY2FuIG9ubHkgYmUgYEFuZ2xlYCBvciBgbnVtYmVyYCwgYW55IG90aGVyXG4gICogdHlwZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBUaGlzIG1ldGhvZCB3aWxsIGNvbnNpZGVyIHR1cm4gdmFsdWVzIGluIHRoZSBvcG9zaXRlIGVuZHMgb2YgdGhlIHJhbmdlXG4gICogKlswLDEpKiBhcyBlcXVhbHMuIEUuZy4gYEFuZ2xlYCBvYmplY3RzIHdpdGggYHR1cm5gIHZhbHVlcyBvZiBgMGAgYW5kXG4gICogYDEgLSByYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkLzJgIHdpbGwgYmUgY29uc2lkZXJlZCBlcXVhbC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgZXF1YWxzKG90aGVyQW5nbGUpIHtcbiAgICBpZiAob3RoZXJBbmdsZSBpbnN0YW5jZW9mIFJhYy5BbmdsZSkge1xuICAgICAgLy8gYWxsIGdvb2QhXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3RoZXJBbmdsZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIG90aGVyQW5nbGUgPSBBbmdsZS5mcm9tKHRoaXMucmFjLCBvdGhlckFuZ2xlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyh0aGlzLnR1cm4gLSBvdGhlckFuZ2xlLnR1cm4pO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkXG4gICAgICAvLyBGb3IgY2xvc2UgdmFsdWVzIHRoYXQgbG9vcCBhcm91bmRcbiAgICAgIHx8ICgxIC0gZGlmZikgPCB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEFuZ2xlYCwgcmV0dXJucyB0aGF0IHNhbWUgb2JqZWN0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhIGBudW1iZXJgLCByZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aFxuICAqICAgYHNvbWV0aGluZ2AgYXMgYHR1cm5gLlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhIGB7QGxpbmsgUmFjLlJheX1gLCByZXR1cm5zIGl0cyBhbmdsZS5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBge0BsaW5rIFJhYy5TZWdtZW50fWAsIHJldHVybnMgaXRzIGFuZ2xlLlxuICAqICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfFJhYy5SYXl8UmFjLlNlZ21lbnR8bnVtYmVyfSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiBkZXJpdmUgYW4gYEFuZ2xlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkFuZ2xlKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNvbWV0aGluZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlJheSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZy5hbmdsZTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5TZWdtZW50KSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nLnJheS5hbmdsZTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLkFuZ2xlIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGByYWRpYW5zYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW5zIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiByYWRpYW5zXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb21SYWRpYW5zKHJhYywgcmFkaWFucykge1xuICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCByYWRpYW5zIC8gUmFjLlRBVSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYGRlZ3JlZXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IGRlZ3JlZXMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIGRlZ3JlZXNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdGF0aWMgZnJvbURlZ3JlZXMocmFjLCBkZWdyZWVzKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZShyYWMsIGRlZ3JlZXMgLyAzNjApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcG9pbnRpbmcgaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvbiB0byBgdGhpc2AuXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvOCkuaW52ZXJzZSgpIC8vIHR1cm4gaXMgMS84ICsgMS8yID0gNS84XG4gICogcmFjLkFuZ2xlKDcvOCkuaW52ZXJzZSgpIC8vIHR1cm4gaXMgNy84ICsgMS8yID0gMy84XG4gICogYGBgXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBpbnZlcnNlKCkge1xuICAgIHJldHVybiB0aGlzLmFkZCh0aGlzLnJhYy5BbmdsZS5pbnZlcnNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYSB0dXJuIHZhbHVlIGVxdWl2YWxlbnQgdG8gYC10dXJuYC5cbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMS80KS5uZWdhdGl2ZSgpIC8vIC0xLzQgYmVjb21lcyB0dXJuIDMvNFxuICAqIHJhYy5BbmdsZSgzLzgpLm5lZ2F0aXZlKCkgLy8gLTMvOCBiZWNvbWVzIHR1cm4gNS84XG4gICogYGBgXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBuZWdhdGl2ZSgpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCAtdGhpcy50dXJuKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdoaWNoIGlzIHBlcnBlbmRpY3VsYXIgdG8gYHRoaXNgIGluIHRoZVxuICAqIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgxLzgpLnBlcnBlbmRpY3VsYXIodHJ1ZSkgIC8vIHR1cm4gaXMgMS84ICsgMS80ID0gMy84XG4gICogcmFjLkFuZ2xlKDEvOCkucGVycGVuZGljdWxhcihmYWxzZSkgLy8gdHVybiBpcyAxLzggLSAxLzQgPSA3LzhcbiAgKiBgYGBcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIHJldHVybiB0aGlzLnNoaWZ0KHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUgaW4gcmFkaWFucy5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHJhZGlhbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMudHVybiAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlIGluIGRlZ3JlZXMuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBkZWdyZWVzKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiAzNjA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNpbmUgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgc2luKCkge1xuICAgIHJldHVybiBNYXRoLnNpbih0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgY29zaW5lIG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGNvcygpIHtcbiAgICByZXR1cm4gTWF0aC5jb3ModGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHRhbmdlbnQgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgdGFuKCkge1xuICAgIHJldHVybiBNYXRoLnRhbih0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYHR1cm5gIHZhbHVlIGluIHRoZSByYW5nZSBgKDAsIDFdYC4gV2hlbiBgdHVybmAgaXMgZXF1YWwgdG9cbiAgKiBgMGAgcmV0dXJucyBgMWAgaW5zdGVhZC5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHR1cm5PbmUoKSB7XG4gICAgaWYgKHRoaXMudHVybiA9PT0gMCkgeyByZXR1cm4gMTsgfVxuICAgIHJldHVybiB0aGlzLnR1cm47XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBzdW0gb2YgYHRoaXNgIGFuZCB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFkZChhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuICsgYW5nbGUudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBhbmdsZSBkZXJpdmVkIGZyb20gYGFuZ2xlYFxuICAqIHN1YnRyYWN0ZWQgdG8gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdWJ0cmFjdChhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuIC0gYW5nbGUudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGB0dXJuYGAgc2V0IHRvIGB0aGlzLnR1cm4gKiBmYWN0b3JgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGZhY3RvciAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYHR1cm5gIGJ5XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgbXVsdChmYWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm4gKiBmYWN0b3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgdHVybmAgc2V0IHRvXG4gICogYHtAbGluayBSYWMuQW5nbGUjdHVybk9uZSB0aGlzLnR1cm5PbmUoKX0gKiBmYWN0b3JgLlxuICAqXG4gICogVXNlZnVsIHdoZW4gZG9pbmcgcmF0aW8gY2FsY3VsYXRpb25zIHdoZXJlIGEgemVybyBhbmdsZSBjb3JyZXNwb25kcyB0b1xuICAqIGEgY29tcGxldGUtY2lyY2xlIHNpbmNlOlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgwKS5tdWx0KDAuNSkgICAgLy8gdHVybiBpcyAwXG4gICogLy8gd2hlcmVhc1xuICAqIHJhYy5BbmdsZSgwKS5tdWx0T25lKDAuNSkgLy8gdHVybiBpcyAwLjVcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBmYWN0b3IgLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGB0dXJuYCBieVxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIG11bHRPbmUoZmFjdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuT25lKCkgKiBmYWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gdGhlXG4gICogYW5nbGUgZGVyaXZlZCBmcm9tIGBhbmdsZWAuXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvNCkuZGlzdGFuY2UoMS8yLCB0cnVlKSAgLy8gdHVybiBpcyAxLzJcbiAgKiByYWMuQW5nbGUoMS80KS5kaXN0YW5jZSgxLzIsIGZhbHNlKSAvLyB0dXJuIGluIDMvNFxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG1lYXN1cmVtZW50XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgZGlzdGFuY2UoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gYW5nbGUuc3VidHJhY3QodGhpcyk7XG4gICAgcmV0dXJuIGNsb2Nrd2lzZVxuICAgICAgPyBkaXN0YW5jZVxuICAgICAgOiBkaXN0YW5jZS5uZWdhdGl2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHJlc3VsdCBvZiBzaGlmdGluZyB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tXG4gICogYGFuZ2xlYCB0byBoYXZlIGB0aGlzYCBhcyBpdHMgb3JpZ2luLlxuICAqXG4gICogVGhpcyBvcGVyYXRpb24gaXMgdGhlIGVxdWl2YWxlbnQgdG9cbiAgKiArIGB0aGlzLmFkZChhbmdsZSlgIHdoZW4gY2xvY2t3aXNlXG4gICogKyBgdGhpcy5zdWJ0cmFjdChhbmdsZSlgIHdoZW4gY291bnRlci1jbG9ja3dpc2VcbiAgKlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0KDAuMywgdHJ1ZSkgIC8vIHR1cm4gaXMgMC4xICsgMC4zID0gMC40XG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnQoMC4zLCBmYWxzZSkgLy8gdHVybiBpcyAwLjEgLSAwLjMgPSAwLjhcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGJlIHNoaWZ0ZWRcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBjbG9ja3dpc2VcbiAgICAgID8gdGhpcy5hZGQoYW5nbGUpXG4gICAgICA6IHRoaXMuc3VidHJhY3QoYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcmVzdWx0IG9mIHNoaWZ0aW5nIGB0aGlzYCB0byBoYXZlIHRoZSBhbmdsZVxuICAqIGRlcml2ZWQgZnJvbSBgb3JpZ2luYCBhcyBpdHMgb3JpZ2luLlxuICAqXG4gICogVGhlIHJlc3VsdCBvZiBgYW5nbGUuc2hpZnRUb09yaWdpbihvcmlnaW4pYCBpcyBlcXVpdmFsZW50IHRvXG4gICogYG9yaWdpbi5zaGlmdChhbmdsZSlgLlxuICAqXG4gICogVGhpcyBvcGVyYXRpb24gaXMgdGhlIGVxdWl2YWxlbnQgdG9cbiAgKiArIGBvcmlnaW4uYWRkKHRoaXMpYCB3aGVuIGNsb2Nrd2lzZVxuICAqICsgYG9yaWdpbi5zdWJ0cmFjdCh0aGlzKWAgd2hlbiBjb3VudGVyLWNsb2Nrd2lzZVxuICAqXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnRUb09yaWdpbigwLjMsIHRydWUpICAvLyB0dXJuIGlzIDAuMyArIDAuMSA9IDAuNFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0VG9PcmlnaW4oMC4zLCBmYWxzZSkgLy8gdHVybiBpcyAwLjMgLSAwLjEgPSAwLjJcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gb3JpZ2luIC0gQW4gYEFuZ2xlYCB0byB1c2UgYXMgb3JpZ2luXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHNoaWZ0VG9PcmlnaW4ob3JpZ2luLCBjbG9ja3dpc2UpIHtcbiAgICBvcmlnaW4gPSB0aGlzLnJhYy5BbmdsZS5mcm9tKG9yaWdpbik7XG4gICAgcmV0dXJuIG9yaWdpbi5zaGlmdCh0aGlzLCBjbG9ja3dpc2UpO1xuICB9XG5cbn0gLy8gY2xhc3MgQW5nbGVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFuZ2xlO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5cbi8qKlxuKiBBcmMgb2YgYSBjaXJjbGUgZnJvbSBhIGBzdGFydGAgdG8gYW4gYGVuZGAgW2FuZ2xlXXtAbGluayBSYWMuQW5nbGV9LlxuKlxuKiBBcmNzIHRoYXQgaGF2ZSBbZXF1YWxde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9IGBzdGFydGAgYW5kIGBlbmRgIGFuZ2xlc1xuKiBhcmUgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbipcbiogQGFsaWFzIFJhYy5BcmNcbiovXG5jbGFzcyBBcmN7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQXJjYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gY2VudGVyIC0gVGhlIGNlbnRlciBvZiB0aGUgYXJjXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIGFyY1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBzdGFydCAtIEFuIGBBbmdsZWAgd2hlcmUgdGhlIGFyYyBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gZW5kIC0gQW5nIGBBbmdsZWAgd2hlcmUgdGhlIGFyYyBlbmRzXG4gICogQHBhcmFtIHtib29sZWFufSBjbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIGFyY1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsXG4gICAgY2VudGVyLCByYWRpdXMsXG4gICAgc3RhcnQsIGVuZCxcbiAgICBjbG9ja3dpc2UpXG4gIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgY2VudGVyKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIocmFkaXVzKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5BbmdsZSwgc3RhcnQsIGVuZCk7XG4gICAgdXRpbHMuYXNzZXJ0Qm9vbGVhbihjbG9ja3dpc2UpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBjZW50ZXIgYFBvaW50YCBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge1JhYy5Qb2ludH1cbiAgICAqL1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgcmFkaXVzIG9mIHRoZSBhcmMuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBzdGFydCBgQW5nbGVgIG9mIHRoZSBhcmMuIFRoZSBhcmMgaXMgZHJhdyBmcm9tIHRoaXMgYW5nbGUgdG93YXJkc1xuICAgICogYGVuZGAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAgICpcbiAgICAqIFdoZW4gYHN0YXJ0YCBhbmQgYGVuZGAgYXJlIFtlcXVhbCBhbmdsZXNde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKiB0aGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAgICovXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG5cbiAgICAvKipcbiAgICAqIFRoZSBlbmQgYEFuZ2xlYCBvZiB0aGUgYXJjLiBUaGUgYXJjIGlzIGRyYXcgZnJvbSBgc3RhcnRgIHRvIHRoaXNcbiAgICAqIGFuZ2xlIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgICAqXG4gICAgKiBXaGVuIGBzdGFydGAgYW5kIGBlbmRgIGFyZSBbZXF1YWwgYW5nbGVzXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAgICogdGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgICAqL1xuICAgIHRoaXMuZW5kID0gZW5kO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgb3JpZW50aWF0aW9uIG9mIHRoZSBhcmMuXG4gICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAqL1xuICAgIHRoaXMuY2xvY2t3aXNlID0gY2xvY2t3aXNlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmNlbnRlci54LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuY2VudGVyLnksICAgZGlnaXRzKTtcbiAgICBjb25zdCByYWRpdXNTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYWRpdXMsICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0U3RyICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnR1cm4sIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kU3RyICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLnR1cm4sICAgZGlnaXRzKTtcbiAgICByZXR1cm4gYEFyYygoJHt4U3RyfSwke3lTdHJ9KSByOiR7cmFkaXVzU3RyfSBzOiR7c3RhcnRTdHJ9IGU6JHtlbmRTdHJ9IGM6JHt0aGlzLmNsb2Nrd2lzZX19KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMgb2YgYm90aCBhcmNzIGFyZSBlcXVhbC5cbiAgKlxuICAqIFdoZW4gYG90aGVyQXJjYCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLkFyY2AsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIEFyY3MnIGByYWRpdXNgIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IG90aGVyU2VnbWVudCAtIEEgYFNlZ21lbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgKiBAc2VlIFJhYyNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyQXJjKSB7XG4gICAgcmV0dXJuIG90aGVyQXJjIGluc3RhbmNlb2YgQXJjXG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy5yYWRpdXMsIG90aGVyQXJjLnJhZGl1cylcbiAgICAgICYmIHRoaXMuY2xvY2t3aXNlID09PSBvdGhlckFyYy5jbG9ja3dpc2VcbiAgICAgICYmIHRoaXMuY2VudGVyLmVxdWFscyhvdGhlckFyYy5jZW50ZXIpXG4gICAgICAmJiB0aGlzLnN0YXJ0LmVxdWFscyhvdGhlckFyYy5zdGFydClcbiAgICAgICYmIHRoaXMuZW5kLmVxdWFscyhvdGhlckFyYy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIGFyYzogdGhlIHBhcnQgb2YgdGhlIGNpcmN1bWZlcmVuY2UgdGhlIGFyY1xuICAqIHJlcHJlc2VudHMuXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmFuZ2xlRGlzdGFuY2UoKS50dXJuT25lKCkgKiB0aGlzLnJhZGl1cyAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgY29uc2lkZXJlZCBhcyBhIGNvbXBsZXRlXG4gICogY2lyY2xlLlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGNpcmN1bWZlcmVuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucmFkaXVzICogUmFjLlRBVTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgYmV0d2VlbiBgc3RhcnRgIGFuZFxuICAqIGBlbmRgLCBpbiB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGFyYy5cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBhbmdsZURpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmRpc3RhbmNlKHRoaXMuZW5kLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSBhcmMgc3RhcnRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN0YXJ0UG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHRoaXMuc3RhcnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCB3aGVyZSB0aGUgYXJjIGVuZHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgZW5kUG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHRoaXMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGBjZW50ZXJgIHRvd2FycyBgc3RhcnRgLlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICBzdGFydFJheSgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLnN0YXJ0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGBjZW50ZXJgIHRvd2FycyBgZW5kYC5cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgZW5kUmF5KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgY2VudGVyYCB0byBgc3RhcnRQb2ludCgpYC5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHN0YXJ0U2VnbWVudCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLnN0YXJ0UmF5KCksIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgY2VudGVyYCB0byBgZW5kUG9pbnQoKWAuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBlbmRTZWdtZW50KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMuZW5kUmF5KCksIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgc3RhcnRQb2ludCgpYCB0byBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBOb3RlIHRoYXQgZm9yIGNvbXBsZXRlIGNpcmNsZSBhcmNzIHRoaXMgc2VnbWVudCB3aWxsIGhhdmUgYSBsZW5ndGggb2ZcbiAgKiB6ZXJvIGFuZCBiZSBwb2ludGVkIHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgb2YgYHN0YXJ0YCBpbiB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgY2hvcmRTZWdtZW50KCkge1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLnN0YXJ0LnBlcnBlbmRpY3VsYXIodGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0UG9pbnQoKS5zZWdtZW50VG9Qb2ludCh0aGlzLmVuZFBvaW50KCksIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJjIGlzIGEgY29tcGxldGUgY2lyY2xlLCB3aGljaCBpcyB3aGVuIGBzdGFydGBcbiAgKiBhbmQgYGVuZGAgYXJlIFtlcXVhbCBhbmdsZXNde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9LlxuICAqXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICovXG4gIGlzQ2lyY2xlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmVxdWFscyh0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgc2V0IHRvIGBuZXdDZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdDZW50ZXIgLSBUaGUgY2VudGVyIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhDZW50ZXIobmV3Q2VudGVyKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICBuZXdDZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBzdGFydCBzZXQgdG8gYG5ld1N0YXJ0YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IG5ld1N0YXJ0IC0gVGhlIHN0YXJ0IGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhTdGFydChuZXdTdGFydCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0QW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3U3RhcnQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgbmV3U3RhcnRBbmdsZSwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBlbmQgc2V0IHRvIGBuZXdFbmRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gbmV3RW5kIC0gVGhlIGVuZCBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoRW5kKG5ld0VuZCkge1xuICAgIGNvbnN0IG5ld0VuZEFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0VuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmRBbmdsZSxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHJhZGl1cyBzZXQgdG8gYG5ld1JhZGl1c2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld1JhZGl1cyAtIFRoZSByYWRpdXMgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFJhZGl1cyhuZXdSYWRpdXMpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGl0cyBvcmllbnRhdGlvbiBzZXQgdG8gYG5ld0Nsb2Nrd2lzZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtib29sZWFufSBuZXdDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aENsb2Nrd2lzZShuZXdDbG9ja3dpc2UpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgbmV3Q2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHRoZSBnaXZlbiBgYW5nbGVEaXN0YW5jZWAgYXMgdGhlIGRpc3RhbmNlXG4gICogYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uIFRoaXMgY2hhbmdlcyBgZW5kYFxuICAqIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBvZiB0aGVcbiAgKiBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5BcmMjYW5nbGVEaXN0YW5jZVxuICAqL1xuICB3aXRoQW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3RW5kID0gdGhpcy5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggdGhlIGdpdmVuIGBsZW5ndGhgIGFzIHRoZSBsZW5ndGggb2YgdGhlXG4gICogcGFydCBvZiB0aGUgY2lyY3VtZmVyZW5jZSBpdCByZXByZXNlbnRzLiBUaGlzIGNoYW5nZXMgYGVuZGAgZm9yIHRoZVxuICAqIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBUaGUgYWN0dWFsIGBsZW5ndGgoKWAgb2YgdGhlIHJlc3VsdGluZyBgQXJjYCB3aWxsIGFsd2F5cyBiZSBpbiB0aGVcbiAgKiByYW5nZSBgWzAscmFkaXVzKlRBVSlgLiBXaGVuIHRoZSBnaXZlbiBgbGVuZ3RoYCBpcyBsYXJnZXIgdGhhdCB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgYXMgYSBjb21wbGV0ZSBjaXJjbGUsIHRoZSByZXN1bHRpbmcgYXJjIGxlbmd0aFxuICAqIHdpbGwgYmUgY3V0IGJhY2sgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5BcmMjbGVuZ3RoXG4gICovXG4gIHdpdGhMZW5ndGgobGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3QW5nbGVEaXN0YW5jZSA9IGxlbmd0aCAvIHRoaXMuY2lyY3VtZmVyZW5jZSgpO1xuICAgIHJldHVybiB0aGlzLndpdGhBbmdsZURpc3RhbmNlKG5ld0FuZ2xlRGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYSBgbGVuZ3RoKClgIG9mIGB0aGlzLmxlbmd0aCgpICogcmF0aW9gLiBUaGlzXG4gICogY2hhbmdlcyBgZW5kYCBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBUaGUgYWN0dWFsIGBsZW5ndGgoKWAgb2YgdGhlIHJlc3VsdGluZyBgQXJjYCB3aWxsIGFsd2F5cyBiZSBpbiB0aGVcbiAgKiByYW5nZSAqWzAscmFkaXVzKlRBVSkqLiBXaGVuIHRoZSBjYWxjdWxhdGVkIGxlbmd0aCBpcyBsYXJnZXIgdGhhdCB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgYXMgYSBjb21wbGV0ZSBjaXJjbGUsIHRoZSByZXN1bHRpbmcgYXJjIGxlbmd0aFxuICAqIHdpbGwgYmUgY3V0IGJhY2sgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuQXJjI2xlbmd0aFxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSB0aGlzLmxlbmd0aCgpICogcmF0aW87XG4gICAgcmV0dXJuIHRoaXMud2l0aExlbmd0aChuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0UG9pbnQoKWAgbG9jYXRlZCBhdCBgcG9pbnRgLiBUaGlzXG4gICogY2hhbmdlcyBgc3RhcnRgIGFuZCBgcmFkaXVzYCBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5zdGFydGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgYXQgdGhlIGBzdGFydFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhTdGFydFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuc3RhcnQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYGVuZFBvaW50KClgIGxvY2F0ZWQgYXQgYHBvaW50YC4gVGhpcyBjaGFuZ2VzXG4gICogYGVuZGAgYW5kIGByYWRpdXNgIGluIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuZW5kYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBhdCB0aGUgYGVuZFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhFbmRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbVxuICAqIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKlxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICB3aXRoU3RhcnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBlbmRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgd2l0aEVuZFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBzdGFydFBvaW50YCBhbmRcbiAgKiBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBlbmRQb2ludGAsIGJvdGggZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiAqIFdoZW4gYGNlbnRlcmAgaXMgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IHRvXG4gICogZWl0aGVyIGBzdGFydFBvaW50YCBvciBgZW5kUG9pbnRgLCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YFxuICAqIG9yIGB0aGlzLmVuZGAgcmVzcGVjdGl2ZWx5LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0UG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYHN0YXJ0YCB0b3dhcmRzXG4gICogQHBhcmFtIHs/UmFjLlBvaW50fSBbZW5kUG9pbnQ9bnVsbF0gLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkcztcbiAgKiB3aGVuIG9tbWl0ZWQgb3IgYG51bGxgLCBgc3RhcnRQb2ludGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhBbmdsZXNUb3dhcmRzUG9pbnQoc3RhcnRQb2ludCwgZW5kUG9pbnQgPSBudWxsKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoc3RhcnRQb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3RW5kID0gZW5kUG9pbnQgPT09IG51bGxcbiAgICAgID8gbmV3U3RhcnRcbiAgICAgIDogdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGVuZFBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBgYW5nbGVgIGluIHRoZVxuICAqIGFyYydzIG9wcG9zaXRlIG9yaWVudGF0aW9uLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoaXMgbWV0aG9kIHNoaWZ0cyBgc3RhcnRgIHRvIHRoZSBhcmMncyAqb3Bwb3NpdGUqXG4gICogb3JpZW50YXRpb24sIGludGVuZGluZyB0byByZXN1bHQgaW4gYSBuZXcgYEFyY2Agd2l0aCBhbiBpbmNyZWFzZSB0b1xuICAqIGBhbmdsZURpc3RhbmNlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzaGlmdCBgc3RhcnRgIGFnYWluc3RcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFN0YXJ0RXh0ZW5zaW9uKGFuZ2xlKSB7XG4gICAgbGV0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5zaGlmdChhbmdsZSwgIXRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBlbmRgIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIGBhbmdsZWAgaW4gdGhlXG4gICogYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhpcyBtZXRob2Qgc2hpZnRzIGBlbmRgIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLFxuICAqIGludGVuZGluZyB0byByZXN1bHQgaW4gYSBuZXcgYEFyY2Agd2l0aCBhbiBpbmNyZWFzZSB0b1xuICAqIGBhbmdsZURpc3RhbmNlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzaGlmdCBgc3RhcnRgIGFnYWluc3RcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aEVuZEV4dGVuc2lvbihhbmdsZSkge1xuICAgIGxldCBuZXdFbmQgPSB0aGlzLmVuZC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggaXRzIGBzdGFydGAgYW5kIGBlbmRgIGV4Y2hhbmdlZCwgYW5kIHRoZVxuICAqIG9wcG9zaXRlIGNsb2Nrd2lzZSBvcmllbnRhdGlvbi4gVGhlIGNlbnRlciBhbmQgcmFkaXVzIHJlbWFpbiBiZSB0aGVcbiAgKiBzYW1lIGFzIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5lbmQsIHRoaXMuc3RhcnQsXG4gICAgICAhdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBnaXZlbiBgYW5nbGVgIGNsYW1wZWQgdG8gdGhlIHJhbmdlOlxuICAqIGBgYFxuICAqIFtzdGFydCArIHN0YXJ0SW5zZXQsIGVuZCAtIGVuZEluc2V0XVxuICAqIGBgYFxuICAqIHdoZXJlIHRoZSBhZGRpdGlvbiBoYXBwZW5zIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLCBhbmQgdGhlXG4gICogc3VidHJhY3Rpb24gYWdhaW5zdC5cbiAgKlxuICAqIFdoZW4gYGFuZ2xlYCBpcyBvdXRzaWRlIHRoZSByYW5nZSwgcmV0dXJucyB3aGljaGV2ZXIgcmFuZ2UgbGltaXQgaXNcbiAgKiBjbG9zZXIuXG4gICpcbiAgKiBXaGVuIHRoZSBzdW0gb2YgdGhlIGdpdmVuIGluc2V0cyBpcyBsYXJnZXIgdGhhdCBgdGhpcy5hcmNEaXN0YW5jZSgpYFxuICAqIHRoZSByYW5nZSBmb3IgdGhlIGNsYW1wIGlzIGltcG9zaWJsZSB0byBmdWxmaWxsLiBJbiB0aGlzIGNhc2UgdGhlXG4gICogcmV0dXJuZWQgdmFsdWUgd2lsbCBiZSB0aGUgY2VudGVyZWQgYmV0d2VlbiB0aGUgcmFuZ2UgbGltaXRzIGFuZCBzdGlsbFxuICAqIGNsYW1wbGVkIHRvIGBbc3RhcnQsIGVuZF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtzdGFydEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV0gLSBUaGUgaW5zZXRcbiAgKiBmb3IgdGhlIGxvd2VyIGxpbWl0IG9mIHRoZSBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gW2VuZEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV0gLSBUaGUgaW5zZXRcbiAgKiBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGUgY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBjbGFtcFRvQW5nbGVzKGFuZ2xlLCBzdGFydEluc2V0ID0gdGhpcy5yYWMuQW5nbGUuemVybywgZW5kSW5zZXQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuXG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSAmJiBzdGFydEluc2V0LnR1cm4gPT0gMCAmJiBlbmRJbnNldC50dXJuID09IDApIHtcbiAgICAgIC8vIENvbXBsZXRlIGNpcmNsZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIEFuZ2xlIGluIGFyYywgd2l0aCBhcmMgYXMgb3JpZ2luXG4gICAgLy8gQWxsIGNvbXBhcmlzb25zIGFyZSBtYWRlIGluIGEgY2xvY2t3aXNlIG9yaWVudGF0aW9uXG4gICAgY29uc3Qgc2hpZnRlZEFuZ2xlID0gdGhpcy5kaXN0YW5jZUZyb21TdGFydChhbmdsZSk7XG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHNoaWZ0ZWRTdGFydENsYW1wID0gc3RhcnRJbnNldDtcbiAgICBjb25zdCBzaGlmdGVkRW5kQ2xhbXAgPSBhbmdsZURpc3RhbmNlLnN1YnRyYWN0KGVuZEluc2V0KTtcbiAgICBjb25zdCB0b3RhbEluc2V0VHVybiA9IHN0YXJ0SW5zZXQudHVybiArIGVuZEluc2V0LnR1cm47XG5cbiAgICBpZiAodG90YWxJbnNldFR1cm4gPj0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkpIHtcbiAgICAgIC8vIEludmFsaWQgcmFuZ2VcbiAgICAgIGNvbnN0IHJhbmdlRGlzdGFuY2UgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZFN0YXJ0Q2xhbXApO1xuICAgICAgbGV0IGhhbGZSYW5nZTtcbiAgICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHtcbiAgICAgICAgaGFsZlJhbmdlID0gcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoYWxmUmFuZ2UgPSB0b3RhbEluc2V0VHVybiA+PSAxXG4gICAgICAgICAgPyByYW5nZURpc3RhbmNlLm11bHRPbmUoMS8yKVxuICAgICAgICAgIDogcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1pZGRsZVJhbmdlID0gc2hpZnRlZEVuZENsYW1wLmFkZChoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgbWlkZGxlID0gdGhpcy5zdGFydC5zaGlmdChtaWRkbGVSYW5nZSwgdGhpcy5jbG9ja3dpc2UpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jbGFtcFRvQW5nbGVzKG1pZGRsZSk7XG4gICAgfVxuXG4gICAgaWYgKHNoaWZ0ZWRBbmdsZS50dXJuID49IHNoaWZ0ZWRTdGFydENsYW1wLnR1cm4gJiYgc2hpZnRlZEFuZ2xlLnR1cm4gPD0gc2hpZnRlZEVuZENsYW1wLnR1cm4pIHtcbiAgICAgIC8vIEluc2lkZSBjbGFtcCByYW5nZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIE91dHNpZGUgcmFuZ2UsIGZpZ3VyZSBvdXQgY2xvc2VzdCBsaW1pdFxuICAgIGxldCBkaXN0YW5jZVRvU3RhcnRDbGFtcCA9IHNoaWZ0ZWRTdGFydENsYW1wLmRpc3RhbmNlKHNoaWZ0ZWRBbmdsZSwgZmFsc2UpO1xuICAgIGxldCBkaXN0YW5jZVRvRW5kQ2xhbXAgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlKTtcbiAgICBpZiAoZGlzdGFuY2VUb1N0YXJ0Q2xhbXAudHVybiA8PSBkaXN0YW5jZVRvRW5kQ2xhbXAudHVybikge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQuc2hpZnQoc3RhcnRJbnNldCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQuc2hpZnQoZW5kSW5zZXQsICF0aGlzLmNsb2Nrd2lzZSk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGBhbmdsZWAgaXMgYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFdoZW4gdGhlIGFyYyByZXByZXNlbnRzIGEgY29tcGxldGUgY2lyY2xlLCBgdHJ1ZWAgaXMgYWx3YXlzIHJldHVybmVkLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICBpZiAodGhpcy5jbG9ja3dpc2UpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBhbmdsZS5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIGxldCBlbmRPZmZzZXQgPSB0aGlzLmVuZC5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJldHVybiBvZmZzZXQudHVybiA8PSBlbmRPZmZzZXQudHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuZW5kKTtcbiAgICAgIGxldCBzdGFydE9mZnNldCA9IHRoaXMuc3RhcnQuc3VidHJhY3QodGhpcy5lbmQpO1xuICAgICAgcmV0dXJuIG9mZnNldC50dXJuIDw9IHN0YXJ0T2Zmc2V0LnR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgIGluIHRoZSBhcmMgaXMgcG9zaXRpb25lZFxuICAqIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiB0aGUgYXJjIHJlcHJlc2VudHMgYSBjb21wbGV0ZSBjaXJjbGUsIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNQcm9qZWN0ZWRQb2ludChwb2ludCkge1xuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgYW5nbGVgIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICogYHN0YXJ0YCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBFLmcuXG4gICogRm9yIGEgY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCBgMC41YDogYHNoaWZ0QW5nbGUoMC4xKWAgaXMgYDAuNmAuXG4gICogRm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IGAwLjVgOiBgc2hpZnRBbmdsZSgwLjEpYCBpcyBgMC40YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKiBAc2VlIFJhYy5BbmdsZSNzaGlmdFxuICAqL1xuICBzaGlmdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnNoaWZ0KGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIGFuIEFuZ2xlIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG9cbiAgLy8gYGFuZ2xlYCB0cmF2ZWxpbmcgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAvLyBVc2VmdWwgdG8gZGV0ZXJtaW5lIGZvciBhIGdpdmVuIGFuZ2xlLCB3aGVyZSBpdCBzaXRzIGluc2lkZSB0aGUgYXJjIGlmXG4gIC8vIHRoZSBhcmMgd2FzIHRoZSBvcmlnaW4gY29vcmRpbmF0ZSBzeXN0ZW0uXG4gIC8vXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gYHN0YXJ0YFxuICAqIHRvIGBhbmdsZWAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogRS5nLlxuICAqIEZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWA6IGBkaXN0YW5jZUZyb21TdGFydCgwLjYpYCBpcyBgMC4xYC5cbiAgKiBGb3IgYSBjb3VudGVyLWNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWA6IGBkaXN0YW5jZUZyb21TdGFydCgwLjYpYCBpcyBgMC45YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgZGlzdGFuY2VGcm9tU3RhcnQoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZGlzdGFuY2UoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGFuZ2xlYC4gVGhpc1xuICAqIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGUgYHN0YXJ0YCBub3IgYGVuZGAgb2YgdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvd2FyZHMgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLmNlbnRlci5wb2ludFRvQW5nbGUoYW5nbGUsIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGFuZ2xlYFxuICAqIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9IGBzdGFydGAgaW4gYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGJlIHNoaWZ0ZWQgYnkgYHN0YXJ0YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRBbmdsZURpc3RhbmNlKGFuZ2xlKSB7XG4gICAgbGV0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuc2hpZnRBbmdsZShhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgdGhlIGdpdmVuIGBsZW5ndGhgIGZyb21cbiAgKiBgc3RhcnRQb2ludCgpYCBpbiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIGZyb20gYHN0YXJ0UG9pbnQoKWAgdG8gdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gbGVuZ3RoIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgYGxlbmd0aCgpICogcmF0aW9gIGZyb21cbiAgKiBgc3RhcnRQb2ludCgpYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGgoKWAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0TGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBsZXQgbmV3QW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpLm11bHRPbmUocmF0aW8pO1xuICAgIGxldCBzaGlmdGVkQW5nbGUgPSB0aGlzLnNoaWZ0QW5nbGUobmV3QW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgcmFkaXVzIG9mIHRoZSBhcmMgYXQgdGhlXG4gICogZ2l2ZW4gYGFuZ2xlYC4gVGhpcyBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlIGBzdGFydGAgbm9yIGBlbmRgIG9mXG4gICogdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgZGlyZWN0aW9uIG9mIHRoZSByYWRpdXMgdG8gcmV0dXJuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICByYWRpdXNTZWdtZW50QXRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBpbiB0aGVcbiAgKiBkaXJlY3Rpb24gdG93YXJkcyB0aGUgZ2l2ZW4gYHBvaW50YC4gVGhpcyBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlXG4gICogYHN0YXJ0YCBub3IgYGVuZGAgb2YgdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLnBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBpbiB0aGUgZGlyZWN0aW9uIG9mIHRoZSByYWRpdXMgdG8gcmV0dXJuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICByYWRpdXNTZWdtZW50VG93YXJkc1BvaW50KHBvaW50KSB7XG4gICAgY29uc3QgYW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmb3IgdGhlIGNob3JkIGZvcm1lZCBieSB0aGUgaW50ZXJzZWN0aW9uIG9mXG4gICogYHRoaXNgIGFuZCBgb3RoZXJBcmNgLCBvciBgbnVsbGAgd2hlbiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYFNlZ21lbnRgIHdpbGwgcG9pbnQgdG93YXJkcyB0aGUgYHRoaXNgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQm90aCBhcmNzIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMgZm9yIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGVcbiAgKiBjaG9yZCwgdGh1cyB0aGUgZW5kcG9pbnRzIG9mIHRoZSByZXR1cm5lZCBzZWdtZW50IG1heSBub3QgbGF5IGluc2lkZVxuICAqIHRoZSBhY3R1YWwgYXJjcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBkZXNjcmlwdGlvblxuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIGludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKSB7XG4gICAgLy8gaHR0cHM6Ly9tYXRod29ybGQud29sZnJhbS5jb20vQ2lyY2xlLUNpcmNsZUludGVyc2VjdGlvbi5odG1sXG4gICAgLy8gUj10aGlzLCByPW90aGVyQXJjXG5cbiAgICBpZiAodGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KG90aGVyQXJjLmNlbnRlcik7XG5cbiAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnJhZGl1cyArIG90aGVyQXJjLnJhZGl1cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gZGlzdGFuY2VUb0Nob3JkID0gKGReMiAtIHJeMiArIFJeMikgLyAoZCoyKVxuICAgIGNvbnN0IGRpc3RhbmNlVG9DaG9yZCA9IChcbiAgICAgICAgTWF0aC5wb3coZGlzdGFuY2UsIDIpXG4gICAgICAtIE1hdGgucG93KG90aGVyQXJjLnJhZGl1cywgMilcbiAgICAgICsgTWF0aC5wb3codGhpcy5yYWRpdXMsIDIpXG4gICAgICApIC8gKGRpc3RhbmNlICogMik7XG5cbiAgICAvLyBhID0gMS9kIHNxcnR8KC1kK3ItUikoLWQtcitSKSgtZCtyK1IpKGQrcitSKVxuICAgIGNvbnN0IGNob3JkTGVuZ3RoID0gKDEgLyBkaXN0YW5jZSkgKiBNYXRoLnNxcnQoXG4gICAgICAgICgtZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgLSB0aGlzLnJhZGl1cylcbiAgICAgICogKC1kaXN0YW5jZSAtIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKVxuICAgICAgKiAoLWRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpXG4gICAgICAqIChkaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKSk7XG5cbiAgICBjb25zdCBzZWdtZW50VG9DaG9yZCA9IHRoaXMuY2VudGVyLnJheVRvUG9pbnQob3RoZXJBcmMuY2VudGVyKVxuICAgICAgLnNlZ21lbnQoZGlzdGFuY2VUb0Nob3JkKTtcbiAgICByZXR1cm4gc2VnbWVudFRvQ2hvcmQubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlLCBjaG9yZExlbmd0aC8yKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGhSYXRpbygyKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgaWYgaW50ZXJzZWN0aW5nUG9pbnRzV2l0aEFyYyBpcyBuZWNlc3NhcnlcbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpbnRlcnNlY3RpbmcgcG9pbnRzIG9mIGB0aGlzYCB3aXRoXG4gICogYG90aGVyQXJjYC5cbiAgKlxuICAqIFdoZW4gdGhlcmUgYXJlIG5vIGludGVyc2VjdGluZyBwb2ludHMsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGludGVyc2VjdGlvbiBwb2ludHMgd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQGlnbm9yZVxuICAqL1xuICAvLyBpbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjKG90aGVyQXJjKSB7XG4gIC8vICAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gIC8vICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBbXTsgfVxuXG4gIC8vICAgbGV0IGludGVyc2VjdGlvbnMgPSBbY2hvcmQuc3RhcnRQb2ludCgpLCBjaG9yZC5lbmRQb2ludCgpXS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAvLyAgICAgcmV0dXJuIHRoaXMuY29udGFpbnNBbmdsZSh0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSlcbiAgLy8gICAgICAgJiYgb3RoZXJBcmMuY29udGFpbnNBbmdsZShvdGhlckFyYy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbSkpO1xuICAvLyAgIH0sIHRoaXMpO1xuXG4gIC8vICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiB0aGUgYXJjIGFuZCAncmF5Jywgb3IgYG51bGxgIHdoZW4gbm8gY2hvcmQgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYFNlZ21lbnRgIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgYW5nbGUgYXMgYHJheWAuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUgYW5kIGByYXlgIGlzIGNvbnNpZGVyZWQgYW5cbiAgKiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmRXaXRoUmF5KHJheSkge1xuICAgIC8vIEZpcnN0IGNoZWNrIGludGVyc2VjdGlvblxuICAgIGNvbnN0IGJpc2VjdG9yID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KHJheSk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBiaXNlY3Rvci5sZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvbyBjbG9zZSB0byBjZW50ZXIsIGNvc2luZSBjYWxjdWxhdGlvbnMgbWF5IGJlIGluY29ycmVjdFxuICAgIC8vIENhbGN1bGF0ZSBzZWdtZW50IHRocm91Z2ggY2VudGVyXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscygwLCBkaXN0YW5jZSkpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUocmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgc3RhcnQsIHJheS5hbmdsZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKjIpO1xuICAgIH1cblxuICAgIC8vIFJheSBpcyB0YW5nZW50LCByZXR1cm4gemVyby1sZW5ndGggc2VnbWVudCBhdCBjb250YWN0IHBvaW50XG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgdGhpcy5yYWRpdXMpKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLnJheS5hbmdsZSk7XG4gICAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgc3RhcnQsIHJheS5hbmdsZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIDApO1xuICAgIH1cblxuICAgIC8vIFJheSBkb2VzIG5vdCB0b3VjaCBhcmNcbiAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnJhZGl1cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYWNvcyhkaXN0YW5jZS90aGlzLnJhZGl1cyk7XG4gICAgY29uc3QgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIHJhZGlhbnMpO1xuXG4gICAgY29uc3QgY2VudGVyT3JpZW50YXRpb24gPSByYXkucG9pbnRPcmllbnRhdGlvbih0aGlzLmNlbnRlcik7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5hbmdsZSgpLnNoaWZ0KGFuZ2xlLCAhY2VudGVyT3JpZW50YXRpb24pKTtcbiAgICBjb25zdCBlbmQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5hbmdsZSgpLnNoaWZ0KGFuZ2xlLCBjZW50ZXJPcmllbnRhdGlvbikpO1xuICAgIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQsIHJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCByZXByZXNlbnRpbmcgdGhlIGVuZCBvZiB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiB0aGUgYXJjIGFuZCAncmF5Jywgb3IgYG51bGxgIHdoZW4gbm8gY2hvcmQgaXMgcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB1c2VQcm9qZWN0aW9uYCBpcyBgdHJ1ZWAgdGhlIG1ldGhvZCB3aWxsIGFsd2F5cyByZXR1cm4gYSBgUG9pbnRgXG4gICogZXZlbiB3aGVuIHRoZXJlIGlzIG5vIGNvbnRhY3QgYmV0d2VlbiB0aGUgYXJjIGFuZCBgcmF5YC4gSW4gdGhpcyBjYXNlXG4gICogdGhlIHBvaW50IGluIHRoZSBhcmMgY2xvc2VzdCB0byBgcmF5YCBpcyByZXR1cm5lZC5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSBhbmQgYHJheWAgaXMgY29uc2lkZXJlZCBhblxuICAqIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5Qb2ludH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmRFbmRXaXRoUmF5KHJheSwgdXNlUHJvamVjdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkV2l0aFJheShyYXkpO1xuICAgIGlmIChjaG9yZCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNob3JkLmVuZFBvaW50KCk7XG4gICAgfVxuXG4gICAgaWYgKHVzZVByb2plY3Rpb24pIHtcbiAgICAgIGNvbnN0IGNlbnRlck9yaWVudGF0aW9uID0gcmF5LnBvaW50T3JpZW50YXRpb24odGhpcy5jZW50ZXIpO1xuICAgICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCFjZW50ZXJPcmllbnRhdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUocGVycGVuZGljdWxhcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcmVwcmVzZW50aW5nIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZVxuICAqIGBvdGhlckFyY2AsIG9yIGBudWxsYCB3aGVuIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi4gVGhlIHJldHVybmVkIGFyY1xuICAqIHdpbGwgaGF2ZSB0aGUgc2FtZSBjZW50ZXIsIHJhZGl1cywgYW5kIG9yaWVudGF0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIEJvdGggYXJjcyBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzIGZvciB0aGUgY2FsY3VsYXRpb24gb2YgdGhlXG4gICogaW50ZXJzZWN0aW9uLCB0aHVzIHRoZSBlbmRwb2ludHMgb2YgdGhlIHJldHVybmVkIGFyYyBtYXkgbm90IGxheSBpbnNpZGVcbiAgKiBgdGhpc2AuXG4gICpcbiAgKiBBbiBlZGdlIGNhc2Ugb2YgdGhpcyBtZXRob2QgaXMgdGhhdCB3aGVuIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGB0aGlzYFxuICAqIGFuZCBgb3RoZXJBcmNgIGlzIHRoZSBzdW0gb2YgdGhlaXIgcmFkaXVzLCBtZWFuaW5nIHRoZSBhcmNzIHRvdWNoIGF0IGFcbiAgKiBzaW5nbGUgcG9pbnQsIHRoZSByZXN1bHRpbmcgYXJjIG1heSBoYXZlIGEgYW5nbGUtZGlzdGFuY2Ugb2YgemVybyxcbiAgKiB3aGljaCBpcyBpbnRlcnByZXRlZCBhcyBhIGNvbXBsZXRlLWNpcmNsZSBhcmMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gaW50ZXJzZWN0IHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5BcmN9XG4gICovXG4gIGludGVyc2VjdGlvbkFyYyhvdGhlckFyYykge1xuICAgIGNvbnN0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVzVG93YXJkc1BvaW50KGNob3JkLnN0YXJ0UG9pbnQoKSwgY2hvcmQuZW5kUG9pbnQoKSk7XG4gIH1cblxuXG4gIC8vIFRPRE86IGltcGxlbWVudCBpbnRlcnNlY3Rpb25BcmNOb0NpcmNsZT9cblxuXG4gIC8vIFRPRE86IGZpbmlzaCBib3VuZGVkSW50ZXJzZWN0aW9uQXJjXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcmVwcmVzZW50aW5nIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZVxuICAqIGBvdGhlckFyY2AgYW5kIGJvdW5kZWQgYnkgYHRoaXMuc3RhcnRgIGFuZCBgdGhpcy5lbmRgLCBvciBgbnVsbGAgd2hlblxuICAqIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi4gVGhlIHJldHVybmVkIGFyYyB3aWxsIGhhdmUgdGhlIHNhbWUgY2VudGVyLFxuICAqIHJhZGl1cywgYW5kIG9yaWVudGF0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIGBvdGhlckFyY2AgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSwgd2hpbGUgdGhlIHN0YXJ0IGFuZCBlbmQgb2ZcbiAgKiBgdGhpc2AgYXJlIGNvbnNpZGVyZWQgZm9yIHRoZSByZXN1bHRpbmcgYEFyY2AuXG4gICpcbiAgKiBXaGVuIHRoZXJlIGV4aXN0IHR3byBzZXBhcmF0ZSBhcmMgc2VjdGlvbnMgdGhhdCBpbnRlcnNlY3Qgd2l0aFxuICAqIGBvdGhlckFyY2A6IG9ubHkgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIGNsb3Nlc3QgdG8gYHN0YXJ0YCBpcyByZXR1cm5lZC5cbiAgKiBUaGlzIGNhbiBoYXBwZW4gd2hlbiBgdGhpc2Agc3RhcnRzIGluc2lkZSBgb3RoZXJBcmNgLCB0aGVuIGV4aXRzLCBhbmRcbiAgKiB0aGVuIGVuZHMgaW5zaWRlIGBvdGhlckFyY2AsIHJlZ2FyZGxlc3MgaWYgYHRoaXNgIGlzIGEgY29tcGxldGUgY2lyY2xlXG4gICogb3Igbm90LlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGludGVyc2VjdCB3aXRoXG4gICogQHJldHVybnMgez9SYWMuQXJjfVxuICAqXG4gICogQGlnbm9yZVxuICAqL1xuICAvLyBib3VuZGVkSW50ZXJzZWN0aW9uQXJjKG90aGVyQXJjKSB7XG4gIC8vICAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gIC8vICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgLy8gICBsZXQgY2hvcmRTdGFydEFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGNob3JkLnN0YXJ0UG9pbnQoKSk7XG4gIC8vICAgbGV0IGNob3JkRW5kQW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoY2hvcmQuZW5kUG9pbnQoKSk7XG5cbiAgLy8gICAvLyBnZXQgYWxsIGRpc3RhbmNlcyBmcm9tIHRoaXMuc3RhcnRcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkRW5kQW5nbGUsIG9ubHkgc3RhcnQgbWF5IGJlIGluc2lkZSBhcmNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIHRoaXMuZW5kLCB3aG9sZSBhcmMgaXMgaW5zaWRlIG9yIG91dHNpZGVcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkU3RhcnRBbmdsZSwgb25seSBlbmQgbWF5IGJlIGluc2lkZSBhcmNcbiAgLy8gICBjb25zdCBpbnRlclN0YXJ0RGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKGNob3JkU3RhcnRBbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyAgIGNvbnN0IGludGVyRW5kRGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKGNob3JkRW5kQW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgLy8gICBjb25zdCBlbmREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UodGhpcy5lbmQsIHRoaXMuY2xvY2t3aXNlKTtcblxuXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZFN0YXJ0QW5nbGUsIG5vcm1hbCBydWxlc1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIG5vdCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRTdGFydCwgcmV0dXJuIG51bGxcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCBub3QgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkZW5kLCByZXR1cm4gc2VsZlxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZFN0YXJ0LCBub3JtYWwgcnVsZXNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRlbmQsIHJldHVybiBzdGFydCB0byBjaG9yZGVuZFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRFbmRBbmdsZSwgcmV0dXJuIHN0YXJ0IHRvIGNob3JkRW5kXG5cblxuICAvLyAgIGlmICghdGhpcy5jb250YWluc0FuZ2xlKGNob3JkU3RhcnRBbmdsZSkpIHtcbiAgLy8gICAgIGNob3JkU3RhcnRBbmdsZSA9IHRoaXMuc3RhcnQ7XG4gIC8vICAgfVxuICAvLyAgIGlmICghdGhpcy5jb250YWluc0FuZ2xlKGNob3JkRW5kQW5nbGUpKSB7XG4gIC8vICAgICBjaG9yZEVuZEFuZ2xlID0gdGhpcy5lbmQ7XG4gIC8vICAgfVxuXG4gIC8vICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gIC8vICAgICBjaG9yZFN0YXJ0QW5nbGUsXG4gIC8vICAgICBjaG9yZEVuZEFuZ2xlLFxuICAvLyAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IGlzIHRhbmdlbnQgdG8gYm90aCBgdGhpc2AgYW5kIGBvdGhlckFyY2AsXG4gICogb3IgYG51bGxgIHdoZW4gbm8gdGFuZ2VudCBzZWdtZW50IGlzIHBvc3NpYmxlLiBUaGUgbmV3IGBTZWdtZW50YCBzdGFydHNcbiAgKiBhdCB0aGUgY29udGFjdCBwb2ludCB3aXRoIGB0aGlzYCBhbmQgZW5kcyBhdCB0aGUgY29udGFjdCBwb2ludCB3aXRoXG4gICogYG90aGVyQXJjYC5cbiAgKlxuICAqIENvbnNpZGVyaW5nIF9jZW50ZXIgYXhpc18gYSByYXkgZnJvbSBgdGhpcy5jZW50ZXJgIHRvd2FyZHNcbiAgKiBgb3RoZXJBcmMuY2VudGVyYCwgYHN0YXJ0Q2xvY2t3aXNlYCBkZXRlcm1pbmVzIHRoZSBzaWRlIG9mIHRoZSBzdGFydFxuICAqIHBvaW50IG9mIHRoZSByZXR1cm5lZCBzZWdtZW50IGluIHJlbGF0aW9uIHRvIF9jZW50ZXIgYXhpc18sIGFuZFxuICAqIGBlbmRDbG9ja3dpc2VgIHRoZSBzaWRlIG9mIHRoZSBlbmQgcG9pbnQuXG4gICpcbiAgKiBCb3RoIGB0aGlzYCBhbmQgYG90aGVyQXJjYCBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGNhbGN1bGF0ZSBhIHRhbmdlbnQgc2VnbWVudCB0b3dhcmRzXG4gICogQHBhcmFtIHtib29sZWFufSBzdGFydENsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIHN0YXJ0IHBvaW50IGluIHJlbGF0aW9uIHRvIHRoZSBfY2VudGVyIGF4aXNfXG4gICogQHBhcmFtIHtib29sZWFufSBlbmRDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBlbmQgcG9pbnQgaW4gcmVsYXRpb24gdG8gdGhlIF9jZW50ZXIgYXhpc19cbiAgKiBAcmV0dXJucyB7P1JhYy5TZWdtZW50fVxuICAqL1xuICB0YW5nZW50U2VnbWVudChvdGhlckFyYywgc3RhcnRDbG9ja3dpc2UgPSB0cnVlLCBlbmRDbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuY2VudGVyLmVxdWFscyhvdGhlckFyYy5jZW50ZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBIeXBvdGhlbnVzZSBvZiB0aGUgdHJpYW5nbGUgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHRhbmdlbnRcbiAgICAvLyBtYWluIGFuZ2xlIGlzIGF0IGB0aGlzLmNlbnRlcmBcbiAgICBjb25zdCBoeXBTZWdtZW50ID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQob3RoZXJBcmMuY2VudGVyKTtcbiAgICBjb25zdCBvcHMgPSBzdGFydENsb2Nrd2lzZSA9PT0gZW5kQ2xvY2t3aXNlXG4gICAgICA/IG90aGVyQXJjLnJhZGl1cyAtIHRoaXMucmFkaXVzXG4gICAgICA6IG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzO1xuXG4gICAgLy8gV2hlbiBvcHMgYW5kIGh5cCBhcmUgY2xvc2UsIHNuYXAgdG8gMVxuICAgIGNvbnN0IGFuZ2xlU2luZSA9IHRoaXMucmFjLmVxdWFscyhNYXRoLmFicyhvcHMpLCBoeXBTZWdtZW50Lmxlbmd0aClcbiAgICAgID8gKG9wcyA+IDAgPyAxIDogLTEpXG4gICAgICA6IG9wcyAvIGh5cFNlZ21lbnQubGVuZ3RoO1xuICAgIGlmIChNYXRoLmFicyhhbmdsZVNpbmUpID4gMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYW5nbGVSYWRpYW5zID0gTWF0aC5hc2luKGFuZ2xlU2luZSk7XG4gICAgY29uc3Qgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG5cbiAgICBjb25zdCBhZGpPcmllbnRhdGlvbiA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gc3RhcnRDbG9ja3dpc2VcbiAgICAgIDogIXN0YXJ0Q2xvY2t3aXNlO1xuICAgIGNvbnN0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cFNlZ21lbnQucmF5LmFuZ2xlLnNoaWZ0KG9wc0FuZ2xlLCBhZGpPcmllbnRhdGlvbik7XG4gICAgY29uc3Qgc2hpZnRlZEFkakFuZ2xlID0gc2hpZnRlZE9wc0FuZ2xlLnBlcnBlbmRpY3VsYXIoYWRqT3JpZW50YXRpb24pO1xuXG4gICAgY29uc3Qgc3RhcnRBbmdsZSA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gc2hpZnRlZEFkakFuZ2xlXG4gICAgICA6IHNoaWZ0ZWRBZGpBbmdsZS5pbnZlcnNlKClcbiAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICAgIGNvbnN0IGVuZCA9IG90aGVyQXJjLnBvaW50QXRBbmdsZShzaGlmdGVkQWRqQW5nbGUpO1xuICAgIGNvbnN0IGRlZmF1bHRBbmdsZSA9IHN0YXJ0QW5nbGUucGVycGVuZGljdWxhcighc3RhcnRDbG9ja3dpc2UpO1xuICAgIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQsIGRlZmF1bHRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBuZXcgYEFyY2Agb2JqZWN0cyByZXByZXNlbnRpbmcgYHRoaXNgXG4gICogZGl2aWRlZCBpbnRvIGBjb3VudGAgYXJjcywgYWxsIHdpdGggdGhlIHNhbWVcbiAgKiBbYW5nbGUgZGlzdGFuY2Vde0BsaW5rIFJhYy5BcmMjYW5nbGVEaXN0YW5jZX0uXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gV2hlbiBgY291bnRgIGlzXG4gICogYDFgIHJldHVybnMgYW4gYXJjIGVxdWl2YWxlbnQgdG8gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIGFyY3MgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5BcmNbXX1cbiAgKi9cbiAgZGl2aWRlVG9BcmNzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIFtdOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgY29uc3QgYXJjcyA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3VudDsgaW5kZXggKz0gMSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogaW5kZXgsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiAoaW5kZXgrMSksIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGFyYyA9IG5ldyBBcmModGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cywgc3RhcnQsIGVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgYXJjcy5wdXNoKGFyYyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyY3M7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBuZXcgYFNlZ21lbnRgIG9iamVjdHMgcmVwcmVzZW50aW5nIGB0aGlzYFxuICAqIGRpdmlkZWQgaW50byBgY291bnRgIGNob3JkcywgYWxsIHdpdGggdGhlIHNhbWUgbGVuZ3RoLlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuIFdoZW4gYGNvdW50YCBpc1xuICAqIGAxYCByZXR1cm5zIGFuIGFyYyBlcXVpdmFsZW50IHRvXG4gICogYFt0aGlzLmNob3JkU2VnbWVudCgpXXtAbGluayBSYWMuQXJjI2Nob3JkU2VnbWVudH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIHNlZ21lbnRzIHRvIGRpdmlkZSBgdGhpc2AgaW50b1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudFtdfVxuICAqL1xuICBkaXZpZGVUb1NlZ21lbnRzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIFtdOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgY29uc3Qgc2VnbWVudHMgPSBbXTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY291bnQ7IGluZGV4ICs9IDEpIHtcbiAgICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogaW5kZXgsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGVuZEFuZ2xlID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIChpbmRleCsxKSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3Qgc3RhcnRQb2ludCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICAgICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLnBvaW50QXRBbmdsZShlbmRBbmdsZSk7XG4gICAgICBjb25zdCBzZWdtZW50ID0gc3RhcnRQb2ludC5zZWdtZW50VG9Qb2ludChlbmRQb2ludCk7XG4gICAgICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50cztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29tcG9zaXRlYCB0aGF0IGNvbnRhaW5zIGBCZXppZXJgIG9iamVjdHMgcmVwcmVzZW50aW5nXG4gICogdGhlIGFyYyBkaXZpZGVkIGludG8gYGNvdW50YCBiZXppZXJzIHRoYXQgYXBwcm94aW1hdGUgdGhlIHNoYXBlIG9mIHRoZVxuICAqIGFyYy5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGBDb21wb3NpdGVgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIGJlemllcnMgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5Db21wb3NpdGV9XG4gICpcbiAgKiBAc2VlIFJhYy5CZXppZXJcbiAgKi9cbiAgZGl2aWRlVG9CZXppZXJzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjLCBbXSk7IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICAvLyBsZW5ndGggb2YgdGFuZ2VudDpcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzM0NzQ1L2hvdy10by1jcmVhdGUtY2lyY2xlLXdpdGgtYiVDMyVBOXppZXItY3VydmVzXG4gICAgY29uc3QgcGFyc1BlclR1cm4gPSAxIC8gcGFydFR1cm47XG4gICAgY29uc3QgdGFuZ2VudCA9IHRoaXMucmFkaXVzICogKDQvMykgKiBNYXRoLnRhbihSYWMuVEFVLyhwYXJzUGVyVHVybio0KSk7XG5cbiAgICBjb25zdCBiZXppZXJzID0gW107XG4gICAgY29uc3Qgc2VnbWVudHMgPSB0aGlzLmRpdmlkZVRvU2VnbWVudHMoY291bnQpO1xuICAgIHNlZ21lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBzdGFydEFyY1JhZGl1cyA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0uc3RhcnRQb2ludCgpKTtcbiAgICAgIGNvbnN0IGVuZEFyY1JhZGl1cyA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0uZW5kUG9pbnQoKSk7XG5cbiAgICAgIGxldCBzdGFydEFuY2hvciA9IHN0YXJ0QXJjUmFkaXVzXG4gICAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZSh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsICF0aGlzLmNsb2Nrd2lzZSwgdGFuZ2VudClcbiAgICAgICAgLmVuZFBvaW50KCk7XG4gICAgICBsZXQgZW5kQW5jaG9yID0gZW5kQXJjUmFkaXVzXG4gICAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZSh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIHRoaXMuY2xvY2t3aXNlLCB0YW5nZW50KVxuICAgICAgICAuZW5kUG9pbnQoKTtcblxuICAgICAgY29uc3QgbmV3QmV6aWVyID0gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgIHN0YXJ0QXJjUmFkaXVzLmVuZFBvaW50KCksIHN0YXJ0QW5jaG9yLFxuICAgICAgICBlbmRBbmNob3IsIGVuZEFyY1JhZGl1cy5lbmRQb2ludCgpKVxuXG4gICAgICBiZXppZXJzLnB1c2gobmV3QmV6aWVyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzLnJhYywgYmV6aWVycyk7XG4gIH1cblxufSAvLyBjbGFzcyBBcmNcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyYztcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEJlemllciBjdXJ2ZSB3aXRoIHN0YXJ0LCBlbmQsIGFuZCB0d28gYW5jaG9yIFtwb2ludHNde0BsaW5rIFJhYy5Qb2ludH0uXG4qIEBhbGlhcyBSYWMuQmV6aWVyXG4qL1xuY2xhc3MgQmV6aWVyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCk7XG5cbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5zdGFydEFuY2hvciA9IHN0YXJ0QW5jaG9yO1xuICAgIHRoaXMuZW5kQW5jaG9yID0gZW5kQW5jaG9yO1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHN0YXJ0WFN0ciAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRZU3RyICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueSwgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydEFuY2hvclhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydEFuY2hvci54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yWVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0QW5jaG9yLnksIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kQW5jaG9yWFN0ciAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kQW5jaG9yLngsICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRBbmNob3JZU3RyICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmRBbmNob3IueSwgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFhTdHIgICAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC54LCAgICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kWVN0ciAgICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLnksICAgICAgICAgZGlnaXRzKTtcblxuICAgIHJldHVybiBgQmV6aWVyKHM6KCR7c3RhcnRYU3RyfSwke3N0YXJ0WVN0cn0pIHNhOigke3N0YXJ0QW5jaG9yWFN0cn0sJHtzdGFydEFuY2hvcllTdHJ9KSBlYTooJHtlbmRBbmNob3JYU3RyfSwke2VuZEFuY2hvcllTdHJ9KSBlOigke2VuZFhTdHJ9LCR7ZW5kWVN0cn0pKWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMgb2YgYm90aCBiZXppZXJzIGFyZVxuICAqIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfS5cbiAgKlxuICAqIFdoZW4gYG90aGVyQmV6aWVyYCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLkJlemllcmAsIHJldHVybnNcbiAgKiBgZmFsc2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQmV6aWVyfSBvdGhlckJlemllciAtIEEgYEJlemllcmAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlckJlemllcikge1xuICAgIHJldHVybiBvdGhlckJlemllciBpbnN0YW5jZW9mIEJlemllclxuICAgICAgJiYgdGhpcy5zdGFydCAgICAgIC5lcXVhbHMob3RoZXJCZXppZXIuc3RhcnQpXG4gICAgICAmJiB0aGlzLnN0YXJ0QW5jaG9yLmVxdWFscyhvdGhlckJlemllci5zdGFydEFuY2hvcilcbiAgICAgICYmIHRoaXMuZW5kQW5jaG9yICAuZXF1YWxzKG90aGVyQmV6aWVyLmVuZEFuY2hvcilcbiAgICAgICYmIHRoaXMuZW5kICAgICAgICAuZXF1YWxzKG90aGVyQmV6aWVyLmVuZCk7XG4gIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQmV6aWVyO1xuXG5cbkJlemllci5wcm90b3R5cGUuZHJhd0FuY2hvcnMgPSBmdW5jdGlvbihzdHlsZSA9IHVuZGVmaW5lZCkge1xuICBwdXNoKCk7XG4gIGlmIChzdHlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3R5bGUuYXBwbHkoKTtcbiAgfVxuICB0aGlzLnN0YXJ0LnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnRBbmNob3IpLmRyYXcoKTtcbiAgdGhpcy5lbmQuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRBbmNob3IpLmRyYXcoKTtcbiAgcG9wKCk7XG59O1xuXG5CZXppZXIucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCZXppZXIodGhpcy5yYWMsXG4gICAgdGhpcy5lbmQsIHRoaXMuZW5kQW5jaG9yLFxuICAgIHRoaXMuc3RhcnRBbmNob3IsIHRoaXMuc3RhcnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiBhIHNlcXVlbmNlIG9mIGRyYXdhYmxlIG9iamVjdHMgdGhhdCBjYW4gYmUgZHJhd24gdG9nZXRoZXIuXG4qXG4qIFVzZWQgYnkgYFtQNURyYXdlcl17QGxpbmsgUmFjLlA1RHJhd2VyfWAgdG8gcGVyZm9ybSBzcGVjaWZpYyB2ZXJ0ZXhcbiogb3BlcmF0aW9ucyB3aXRoIGRyYXdhYmxlcyB0byBkcmF3IGNvbXBsZXggc2hhcGVzLlxuKlxuKiBAY2xhc3NcbiogQGFsaWFzIFJhYy5Db21wb3NpdGVcbiovXG5mdW5jdGlvbiBDb21wb3NpdGUocmFjLCBzZXF1ZW5jZSA9IFtdKSB7XG4gIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHNlcXVlbmNlKTtcblxuICB0aGlzLnJhYyA9IHJhYztcbiAgdGhpcy5zZXF1ZW5jZSA9IHNlcXVlbmNlO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0ZTtcblxuXG5Db21wb3NpdGUucHJvdG90eXBlLmlzTm90RW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc2VxdWVuY2UubGVuZ3RoICE9IDA7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGVsZW1lbnQuZm9yRWFjaChpdGVtID0+IHRoaXMuc2VxdWVuY2UucHVzaChpdGVtKSk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdGhpcy5zZXF1ZW5jZS5wdXNoKGVsZW1lbnQpO1xufTtcblxuQ29tcG9zaXRlLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gIGxldCByZXZlcnNlZCA9IHRoaXMuc2VxdWVuY2UubWFwKGl0ZW0gPT4gaXRlbS5yZXZlcnNlKCkpXG4gICAgLnJldmVyc2UoKTtcbiAgcmV0dXJuIG5ldyBDb21wb3NpdGUodGhpcy5yYWMsIHJldmVyc2VkKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBQb2ludCBpbiBhIHR3byBkaW1lbnRpb25hbCBjb29yZGluYXRlIHN5c3RlbS5cbipcbiogU2V2ZXJhbCBtZXRob2RzIHdpbGwgcmV0dXJuIGFuIGFkanVzdGVkIHZhbHVlIG9yIHBlcmZvcm0gYWRqdXN0bWVudHMgaW5cbiogdGhlaXIgb3BlcmF0aW9uIHdoZW4gdHdvIHBvaW50cyBhcmUgY2xvc2UgZW5vdWdoIGFzIHRvIGJlIGNvbnNpZGVyZWRcbiogZXF1YWwuIFdoZW4gdGhlIHRoZSBkaWZmZXJlbmNlIG9mIGVhY2ggY29vcmRpbmF0ZSBvZiB0d28gcG9pbnRzXG4qIGlzIHVuZGVyIHRoZSBgW2VxdWFsaXR5VGhyZXNob2xkXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9YCB0aGVcbiogcG9pbnRzIGFyZSBjb25zaWRlcmVkIGVxdWFsLiBUaGUgYFtlcXVhbHNde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9YFxuKiBtZXRob2QgcGVyZm9ybXMgdGhpcyBjaGVjay5cbipcbiogQGFsaWFzIFJhYy5Qb2ludFxuKi9cbmNsYXNzIFBvaW50e1xuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgUG9pbnRgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGVcbiAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGVcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB4LCB5KSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgeCwgeSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHgsIHkpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy54ID0geDtcblxuICAgIC8qKlxuICAgICogWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy55LCBkaWdpdHMpO1xuICAgIHJldHVybiBgUG9pbnQoJHt4U3RyfSwke3lTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCBgb3RoZXJQb2ludGAgZm9yIGVhY2ggY29vcmRpbmF0ZSBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAsIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclBvaW50YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlBvaW50YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVmFsdWVzIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBvdGhlclBvaW50IC0gQSBgUG9pbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYyNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyUG9pbnQpIHtcbiAgICByZXR1cm4gb3RoZXJQb2ludCBpbnN0YW5jZW9mIFBvaW50XG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy54LCBvdGhlclBvaW50LngpXG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy55LCBvdGhlclBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WCAtIFRoZSB4IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHdpdGhYKG5ld1gpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCBuZXdYLCB0aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WSAtIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHdpdGhZKG5ld1kpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLngsIG5ld1kpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgYWRkZWQgdG8gYHRoaXMueGAuXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFgoeCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyB4LCB0aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeWAgYWRkZWQgdG8gYHRoaXMueWAuXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFkoeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLngsIHRoaXMueSArIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBjb21wb25lbnRzIG9mIGBwb2ludGAgdG8gYHRoaXNgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGRQb2ludChwb2ludCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHBvaW50LngsXG4gICAgICB0aGlzLnkgKyBwb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IGFkZGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cyB0byBgdGhpc2AuXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29kaW5hdGUgdG8gYWRkXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29kaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkKHgsIHkpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgeCwgdGhpcy55ICsgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgY29tcG9uZW50cyBvZiBgcG9pbnRgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBzdWJ0cmFjdFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN1YnRyYWN0UG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KFxuICAgICAgdGhpcy5yYWMsXG4gICAgICB0aGlzLnggLSBwb2ludC54LFxuICAgICAgdGhpcy55IC0gcG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cy5cbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb2RpbmF0ZSB0byBzdWJ0cmFjdFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vZGluYXRlIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3VidHJhY3QoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHgsXG4gICAgICB0aGlzLnkgLSB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdpdGggdGhlIG5lZ2F0aXZlIGNvb3JkaW5hdGUgdmFsdWVzIG9mIGB0aGlzYC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBuZWdhdGl2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCAtdGhpcy54LCAtdGhpcy55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gYHBvaW50YCwgb3IgcmV0dXJucyBgMGAgd2hlblxuICAqIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgZGlzdGFuY2VUb1BvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuZXF1YWxzKHBvaW50KSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbnN0IHggPSBNYXRoLnBvdygocG9pbnQueCAtIHRoaXMueCksIDIpO1xuICAgIGNvbnN0IHkgPSBNYXRoLnBvdygocG9pbnQueSAtIHRoaXMueSksIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCt5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYW5nbGUgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgcmV0dXJucyB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aFxuICAqIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGFuZ2xlIHRvXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZGVmYXVsdEFuZ2xlPWluc3RhbmNlLkFuZ2xlLlplcm9dIC1cbiAgKiBBbiBgQW5nbGVgIHRvIHJldHVybiB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBhbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBpZiAodGhpcy5lcXVhbHMocG9pbnQpKSB7XG4gICAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGRlZmF1bHRBbmdsZSk7XG4gICAgICByZXR1cm4gZGVmYXVsdEFuZ2xlO1xuICAgIH1cbiAgICBjb25zdCBvZmZzZXQgPSBwb2ludC5zdWJ0cmFjdFBvaW50KHRoaXMpO1xuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmF0YW4yKG9mZnNldC55LCBvZmZzZXQueCk7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgcmFkaWFucyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCBhIGBkaXN0YW5jZWAgZnJvbSBgdGhpc2AgaW4gdGhlIGRpcmVjdGlvbiBvZlxuICAqIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0b3dhcnMgdGhlIG5ldyBgUG9pbnRgXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IGRpc3RhbmNlWCA9IGRpc3RhbmNlICogTWF0aC5jb3MoYW5nbGUucmFkaWFucygpKTtcbiAgICBjb25zdCBkaXN0YW5jZVkgPSBkaXN0YW5jZSAqIE1hdGguc2luKGFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgdGhpcy54ICsgZGlzdGFuY2VYLCB0aGlzLnkgKyBkaXN0YW5jZVkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFuZ2xlYC5cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGBBbmdsZWAgb2YgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXkoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvd2FyZHMgYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkIGVxdWFsLCB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlXG4gICogdGhlIGFuZ2xlIHByb2R1Y2VkIHdpdGggYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBSYXlgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtkZWZhdWx0QW5nbGU9aW5zdGFuY2UuQW5nbGUuWmVyb10gLVxuICAqIEFuIGBBbmdsZWAgdG8gdXNlIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXlUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBkZWZhdWx0QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGB0aGlzYCBpbiBgcmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHByb2plY3RlZCBwb2ludCBpcyBlcXVhbCB0byBgdGhpc2AgdGhlIHByb2R1Y2VkIHJheSB3aWxsIGhhdmVcbiAgKiBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvIGByYXlgIGluIHRoZSBjbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIHByb2plY3QgYHRoaXNgIG9udG9cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgcmF5VG9Qcm9qZWN0aW9uSW5SYXkocmF5KSB7XG4gICAgY29uc3QgcHJvamVjdGVkID0gcmF5LnBvaW50UHJvamVjdGlvbih0aGlzKTtcbiAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gcmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgICByZXR1cm4gdGhpcy5yYXlUb1BvaW50KHByb2plY3RlZCwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB0aGF0IHN0YXJ0cyBhdCBgdGhpc2AgYW5kIGlzIHRhbmdlbnQgdG8gYGFyY2AsIHdoZW5cbiAgKiBubyB0YW5nZW50IGlzIHBvc3NpYmxlIHJldHVybnMgYG51bGxgLlxuICAqXG4gICogQGRlc2NyaXB0aW9uXG4gICogVGhlIG5ldyBgUmF5YCB3aWxsIGJlIGluIHRoZSBgY2xvY2t3aXNlYCBzaWRlIG9mIHRoZSByYXkgZm9ybWVkXG4gICogZnJvbSBgdGhpc2AgdG93YXJkcyBgYXJjLmNlbnRlcmAuIGBhcmNgIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZVxuICAqIGNpcmNsZS5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGlzIGluc2lkZSBgYXJjYCBubyB0YW5nZW50IHNlZ21lbnQgaXMgcG9zc2libGUgYW5kIGBudWxsYFxuICAqIGlzIHJldHVybmVkLlxuICAqXG4gICogQSBzcGVjaWFsIGNhc2UgaXMgY29uc2lkZXJlZCB3aGVuIGBhcmMucmFkaXVzYCBpcyBjb25zaWRlcmVkIHRvIGJlIGAwYFxuICAqIGFuZCBgdGhpc2AgaXMgZXF1YWwgdG8gYGFyYy5jZW50ZXJgLiBJbiB0aGlzIGNhc2UgdGhlIGFuZ2xlIGJldHdlZW5cbiAgKiBgdGhpc2AgYW5kIGBhcmMuY2VudGVyYCBpcyBhc3N1bWVkIHRvIGJlIHRoZSBpbnZlcnNlIG9mIGBhcmMuc3RhcnRgLFxuICAqIHRodXMgdGhlIG5ldyBgUmF5YCB3aWxsIGhhdmUgYW4gYW5nbGUgcGVycGVuZGljdWxhciB0b1xuICAqIGBhcmMuc3RhcnQuaW52ZXJzZSgpYCwgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBhcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHRvLCBjb25zaWRlcmVkXG4gICogYXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm4ge1JhYy5SYXk/fVxuICAqL1xuICByYXlUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgLy8gQSBkZWZhdWx0IGFuZ2xlIGlzIGdpdmVuIGZvciB0aGUgZWRnZSBjYXNlIG9mIGEgemVyby1yYWRpdXMgYXJjXG4gICAgbGV0IGh5cG90ZW51c2UgPSB0aGlzLnNlZ21lbnRUb1BvaW50KGFyYy5jZW50ZXIsIGFyYy5zdGFydC5pbnZlcnNlKCkpO1xuICAgIGxldCBvcHMgPSBhcmMucmFkaXVzO1xuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhoeXBvdGVudXNlLmxlbmd0aCwgYXJjLnJhZGl1cykpIHtcbiAgICAgIC8vIFBvaW50IGluIGFyY1xuICAgICAgY29uc3QgcGVycGVuZGljdWxhciA9IGh5cG90ZW51c2UucmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgcGVycGVuZGljdWxhcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhoeXBvdGVudXNlLmxlbmd0aCwgMCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBhbmdsZVNpbmUgPSBvcHMgLyBoeXBvdGVudXNlLmxlbmd0aDtcbiAgICBpZiAoYW5nbGVTaW5lID4gMSkge1xuICAgICAgLy8gUG9pbnQgaW5zaWRlIGFyY1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGFuZ2xlUmFkaWFucyA9IE1hdGguYXNpbihhbmdsZVNpbmUpO1xuICAgIGxldCBvcHNBbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgYW5nbGVSYWRpYW5zKTtcbiAgICBsZXQgc2hpZnRlZE9wc0FuZ2xlID0gaHlwb3RlbnVzZS5hbmdsZSgpLnNoaWZ0KG9wc0FuZ2xlLCBjbG9ja3dpc2UpO1xuXG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBzaGlmdGVkT3BzQW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhbmdsZWAgd2l0aCB0aGUgZ2l2ZW5cbiAgKiBgbGVuZ3RoYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHBvaW50IHRoZSBzZWdtZW50XG4gICogdG93YXJkc1xuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICBjb25zdCByYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHJheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sXG4gICogdGhlIG5ldyBgU2VnbWVudGAgd2lsbCB1c2UgdGhlIGFuZ2xlIHByb2R1Y2VkIHdpdGggYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBTZWdtZW50YCB0b3dhcmRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZGVmYXVsdEFuZ2xlPWluc3RhbmNlLkFuZ2xlLlplcm9dIC1cbiAgKiBBbiBgQW5nbGVgIHRvIHVzZSB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHNlZ21lbnRUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSk7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBkZWZhdWx0QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHJheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG8gdGhlIHByb2plY3Rpb24gb2YgYHRoaXNgIGluXG4gICogYHJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgZXF1YWwgdG8gYHRoaXNgLCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsXG4gICogaGF2ZSBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvIGByYXlgIGluIHRoZSBjbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIHByb2plY3QgYHRoaXNgIG9udG9cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0aW9uKHRoaXMpO1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KHByb2plY3RlZCwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgdGhhdCBzdGFydHMgYXQgYHRoaXNgIGFuZCBpcyB0YW5nZW50IHRvIGBhcmNgLFxuICAqIHdoZW4gbm8gdGFuZ2VudCBpcyBwb3NzaWJsZSByZXR1cm5zIGBudWxsYC5cbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgYmUgaW4gdGhlIGBjbG9ja3dpc2VgIHNpZGUgb2YgdGhlIHJheSBmb3JtZWRcbiAgKiBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhcmMuY2VudGVyYCwgYW5kIGl0cyBlbmQgcG9pbnQgd2lsbCBiZSBhdCB0aGVcbiAgKiBjb250YWN0IHBvaW50IHdpdGggYGFyY2Agd2hpY2ggaXMgY29uc2lkZXJlZCBhcyBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGlzIGluc2lkZSBgYXJjYCBubyB0YW5nZW50IHNlZ21lbnQgaXMgcG9zc2libGUgYW5kIGBudWxsYFxuICAqIGlzIHJldHVybmVkLlxuICAqXG4gICogQSBzcGVjaWFsIGNhc2UgaXMgY29uc2lkZXJlZCB3aGVuIGBhcmMucmFkaXVzYCBpcyBjb25zaWRlcmVkIHRvIGJlIGAwYFxuICAqIGFuZCBgdGhpc2AgaXMgZXF1YWwgdG8gYGFyYy5jZW50ZXJgLiBJbiB0aGlzIGNhc2UgdGhlIGFuZ2xlIGJldHdlZW5cbiAgKiBgdGhpc2AgYW5kIGBhcmMuY2VudGVyYCBpcyBhc3N1bWVkIHRvIGJlIHRoZSBpbnZlcnNlIG9mIGBhcmMuc3RhcnRgLFxuICAqIHRodXMgdGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG9cbiAgKiBgYXJjLnN0YXJ0LmludmVyc2UoKWAsIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gYXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCB0bywgY29uc2lkZXJlZFxuICAqIGFzIGEgY29tcGxldGUgY2lyY2xlXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybiB7UmFjLlNlZ21lbnQ/fVxuICAqL1xuICBzZWdtZW50VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHRhbmdlbnRSYXkgPSB0aGlzLnJheVRhbmdlbnRUb0FyYyhhcmMsIGNsb2Nrd2lzZSk7XG4gICAgaWYgKHRhbmdlbnRSYXkgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHRhbmdlbnRQZXJwID0gdGFuZ2VudFJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgcmFkaXVzUmF5ID0gYXJjLmNlbnRlci5yYXkodGFuZ2VudFBlcnApO1xuXG4gICAgcmV0dXJuIHRhbmdlbnRSYXkuc2VnbWVudFRvSW50ZXJzZWN0aW9uKHJhZGl1c1JheSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXNgIGFuZCB0aGUgZ2l2ZW4gYXJjIHByb3BlcnRpZXMuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbc29tZVN0YXJ0PXJhYy5BbmdsZS56ZXJvXSAtIFRoZSBzdGFydFxuICAqIGBBbmdsZWAgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxudW1iZXJ9IFtzb21lRW5kPW51bGxdIC0gVGhlIGVuZCBgQW5nbGVgIG9mIHRoZSBuZXdcbiAgKiBgQXJjYDsgd2hlbiBgbnVsbGAgb3Igb21taXRlZCwgYHN0YXJ0YCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge2Jvb2xlYW49fSBjbG9ja3dpc2U9dHJ1ZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhcbiAgICByYWRpdXMsXG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvLFxuICAgIGVuZCA9IG51bGwsXG4gICAgY2xvY2t3aXNlID0gdHJ1ZSlcbiAge1xuICAgIHN0YXJ0ID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzdGFydCk7XG4gICAgZW5kID0gZW5kID09PSBudWxsXG4gICAgICA/IHN0YXJ0XG4gICAgICA6IHRoaXMucmFjLkFuZ2xlLmZyb20oZW5kKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsIHRoaXMsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgd2l0aCB0aGUgZ2l2ZW4gYHN0cmluZ2AgYW5kIGBmb3JtYXRgLlxuICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IGZvcm1hdCAtIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMucmFjLCB0aGlzLCBzdHJpbmcsIGZvcm1hdCk7XG4gIH1cblxufSAvLyBjbGFzcyBQb2ludFxuXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBVbmJvdW5kZWQgcmF5IGZyb20gYSBgW1BvaW50XXtAbGluayBSYWMuUG9pbnR9YCBpbiBkaXJlY3Rpb24gb2YgYW5cbiogYFtBbmdsZV17QGxpbmsgUmFjLkFuZ2xlfWAuXG4qXG4qIEBhbGlhcyBSYWMuUmF5XG4qL1xuY2xhc3MgUmF5IHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBSYXlgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWMgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0IC0gQSBgUG9pbnRgIHdoZXJlIHRoZSByYXkgc3RhcnRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0aGUgcmF5IGlzIGRpcmVjdGVkIHRvXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgc3RhcnQsIGFuZ2xlKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc3RhcnQsIGFuZ2xlKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgc3RhcnQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBhbmdsZSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIHN0YXJ0IHBvaW50IG9mIHRoZSByYXkuXG4gICAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAgICovXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYW5nbGUgdG93YXJkcyB3aGljaCB0aGUgcmF5IGV4dGVuZHMuXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICovXG4gICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC55LCBkaWdpdHMpO1xuICAgIGNvbnN0IHR1cm5TdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIHJldHVybiBgUmF5KCgke3hTdHJ9LCR7eVN0cn0pIGE6JHt0dXJuU3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGBzdGFydGAgYW5kIGBhbmdsZWAgaW4gYm90aCByYXlzIGFyZSBlcXVhbC5cbiAgKlxuICAqIFdoZW4gYG90aGVyUmF5YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlJheWAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyUmF5KSB7XG4gICAgcmV0dXJuIG90aGVyUmF5IGluc3RhbmNlb2YgUmF5XG4gICAgICAmJiB0aGlzLnN0YXJ0LmVxdWFscyhvdGhlclJheS5zdGFydClcbiAgICAgICYmIHRoaXMuYW5nbGUuZXF1YWxzKG90aGVyUmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgc2xvcGUgb2YgdGhlIHJheSwgb3IgYG51bGxgIGlmIHRoZSByYXkgaXMgdmVydGljYWwuXG4gICpcbiAgKiBJbiB0aGUgbGluZSBmb3JtdWxhIGB5ID0gbXggKyBiYCB0aGUgc2xvcGUgaXMgYG1gLlxuICAqXG4gICogQHJldHVybnMgez9udW1iZXJ9XG4gICovXG4gIHNsb3BlKCkge1xuICAgIGxldCBpc1ZlcnRpY2FsID1cbiAgICAgICAgIHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5hbmdsZS50dXJuLCB0aGlzLnJhYy5BbmdsZS5kb3duLnR1cm4pXG4gICAgICB8fCB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYW5nbGUudHVybiwgdGhpcy5yYWMuQW5nbGUudXAudHVybik7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLnRhbih0aGlzLmFuZ2xlLnJhZGlhbnMoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHktaW50ZXJjZXB0OiB0aGUgcG9pbnQgYXQgd2hpY2ggdGhlIHJheSwgZXh0ZW5kZWQgaW4gYm90aFxuICAqIGRpcmVjdGlvbnMsIGludGVyY2VwdHMgd2l0aCB0aGUgeS1heGlzOyBvciBgbnVsbGAgaWYgdGhlIHJheSBpc1xuICAqIHZlcnRpY2FsLlxuICAqXG4gICogSW4gdGhlIGxpbmUgZm9ybXVsYSBgeSA9IG14ICsgYmAgdGhlIHktaW50ZXJjZXB0IGlzIGBiYC5cbiAgKlxuICAqIEByZXR1cm5zIHs/bnVtYmVyfVxuICAqL1xuICB5SW50ZXJjZXB0KCkge1xuICAgIGxldCBzbG9wZSA9IHRoaXMuc2xvcGUoKTtcbiAgICBpZiAoc2xvcGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyB5ID0gbXggKyBiXG4gICAgLy8geSAtIG14ID0gYlxuICAgIHJldHVybiB0aGlzLnN0YXJ0LnkgLSBzbG9wZSAqIHRoaXMuc3RhcnQueDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydGAgc2V0IHRvIGBuZXdTdGFydGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld1N0YXJ0IC0gVGhlIHN0YXJ0IGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhTdGFydChuZXdTdGFydCkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnQueGAgc2V0IHRvIGBuZXdYYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WCAtIFRoZSB4IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFgobmV3WCkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LndpdGhYKG5ld1gpLCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydC55YCBzZXQgdG8gYG5ld1lgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdZIC0gVGhlIHkgY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoWShuZXdZKSB7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQud2l0aFkobmV3WSksIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYGFuZ2xlYCBzZXQgdG8gYG5ld0FuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IG5ld0FuZ2xlIC0gVGhlIGFuZ2xlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIG5ld0FuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgYWRkZWQgdG8gYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhBbmdsZUFkZChhbmdsZSkge1xuICAgIGxldCBuZXdBbmdsZSA9IHRoaXMuYW5nbGUuYWRkKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYGFuZ2xlYCBzZXQgdG9cbiAgKiBgdGhpcy57QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0IGFuZ2xlLnNoaWZ0fShhbmdsZSwgY2xvY2t3aXNlKWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSB0byBiZSBzaGlmdGVkIGJ5XG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGVTaGlmdChhbmdsZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBuZXdBbmdsZSA9IHRoaXMuYW5nbGUuc2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBwb2ludGluZyB0b3dhcmRzXG4gICogYHtAbGluayBSYWMuQW5nbGUjaW52ZXJzZSBhbmdsZS5pbnZlcnNlKCl9YC5cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgaW52ZXJzZSgpIHtcbiAgICBjb25zdCBpbnZlcnNlQW5nbGUgPSB0aGlzLmFuZ2xlLmludmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgaW52ZXJzZUFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBwb2ludGluZyB0b3dhcmRzIHRoZVxuICAqIFtwZXJwZW5kaWN1bGFyIGFuZ2xlXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn0gb2ZcbiAgKiBgYW5nbGVgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqIEBzZWUgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJcbiAgKi9cbiAgcGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIGFsb25nIHRoZSByYXkgYnkgdGhlIGdpdmVuXG4gICogYGRpc3RhbmNlYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGRpc3RhbmNlYCBpcyBuZWdhdGl2ZSwgYHN0YXJ0YCBpcyBtb3ZlZCBpblxuICAqIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZiBgYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgYHN0YXJ0YCBieVxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB0cmFuc2xhdGVUb0Rpc3RhbmNlKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZSh0aGlzLmFuZ2xlLCBkaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydGAgbW92ZWQgdG93YXJkcyBgYW5nbGVgIGJ5IHRoZSBnaXZlblxuICAqIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBtb3ZlIGBzdGFydGAgdG93YXJkc1xuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlVG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuc3RhcnQucG9pbnRUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydGAgbW92ZWQgYnkgdGhlIGdpdmVuIGRpc3RhbmNlIHRvd2FyZCB0aGVcbiAgKiBgYW5nbGUucGVycGVuZGljdWxhcigpYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlUGVycGVuZGljdWxhcihkaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlVG9BbmdsZShwZXJwZW5kaWN1bGFyLCBkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGFuZ2xlIGZyb20gYHRoaXMuc3RhcnRgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHJldHVybnMgYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGFuZ2xlIHRvXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgYW5nbGVUb1BvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIHJheSB3aGVyZSB0aGUgeCBjb29yZGluYXRlIGlzIGB4YC5cbiAgKiBXaGVuIHRoZSByYXkgaXMgdmVydGljYWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIHNpbmdsZSBwb2ludCB3aXRoIHhcbiAgKiBjb29yZGluYXRlIGF0IGB4YCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIHRvIGNhbGN1bGF0ZSBhIHBvaW50IGluIHRoZSByYXlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0WCh4KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhYKHgpO1xuICAgIH1cblxuICAgIC8vIHkgPSBteCArIGJcbiAgICBjb25zdCB5ID0gc2xvcGUgKiB4ICsgdGhpcy55SW50ZXJjZXB0KCk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgcmF5IHdoZXJlIHRoZSB5IGNvb3JkaW5hdGUgaXMgYHlgLlxuICAqIFdoZW4gdGhlIHJheSBpcyBob3Jpem9udGFsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBzaW5nbGUgcG9pbnQgd2l0aCB5XG4gICogY29vcmRpbmF0ZSBhdCBgeWAgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYW4gdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgdG8gY2FsY3VsYXRlIGEgcG9pbnQgaW4gdGhlIHJheVxuICAqIEByZXR1cnNuIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRZKHkpIHtcbiAgICBjb25zdCBzbG9wZSA9IHRoaXMuc2xvcGUoKTtcbiAgICBpZiAoc2xvcGUgPT09IG51bGwpIHtcbiAgICAgIC8vIFZlcnRpY2FsIHJheVxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQud2l0aFkoeSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoc2xvcGUsIDApKSB7XG4gICAgICAvLyBIb3Jpem9udGFsIHJheVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gbXggKyBiID0geVxuICAgIC8vIHggPSAoeSAtIGIpL21cbiAgICBjb25zdCB4ID0gKHkgLSB0aGlzLnlJbnRlcmNlcHQoKSkgLyBzbG9wZTtcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLnJhYywgeCwgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgcmF5IGF0IHRoZSBnaXZlbiBgZGlzdGFuY2VgIGZyb21cbiAgKiBgdGhpcy5zdGFydGAuIFdoZW4gYGRpc3RhbmNlYCBpcyBuZWdhdGl2ZSwgdGhlIG5ldyBgUG9pbnRgIGlzIGNhbGN1bGF0ZWRcbiAgKiBpbiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXREaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZSh0aGlzLmFuZ2xlLCBkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCB0aGUgaW50ZXJzZWN0aW9uIG9mIGB0aGlzYCBhbmQgYG90aGVyUmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHJheXMgYXJlIHBhcmFsbGVsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBpbnRlcnNlY3Rpb24gaXNcbiAgKiBwb3NzaWJsZS5cbiAgKlxuICAqIEJvdGggcmF5cyBhcmUgY29uc2lkZXJlZCB1bmJvdW5kZWQgbGluZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheSkge1xuICAgIGNvbnN0IGEgPSB0aGlzLnNsb3BlKCk7XG4gICAgY29uc3QgYiA9IG90aGVyUmF5LnNsb3BlKCk7XG4gICAgLy8gUGFyYWxsZWwgbGluZXMsIG5vIGludGVyc2VjdGlvblxuICAgIGlmIChhID09PSBudWxsICYmIGIgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhhLCBiKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgLy8gQW55IHZlcnRpY2FsIHJheVxuICAgIGlmIChhID09PSBudWxsKSB7IHJldHVybiBvdGhlclJheS5wb2ludEF0WCh0aGlzLnN0YXJ0LngpOyB9XG4gICAgaWYgKGIgPT09IG51bGwpIHsgcmV0dXJuIHRoaXMucG9pbnRBdFgob3RoZXJSYXkuc3RhcnQueCk7IH1cblxuICAgIGNvbnN0IGMgPSB0aGlzLnlJbnRlcmNlcHQoKTtcbiAgICBjb25zdCBkID0gb3RoZXJSYXkueUludGVyY2VwdCgpO1xuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGluZSVFMiU4MCU5M2xpbmVfaW50ZXJzZWN0aW9uXG4gICAgY29uc3QgeCA9IChkIC0gYykgLyAoYSAtIGIpO1xuICAgIGNvbnN0IHkgPSBhICogeCArIGM7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YCBvbnRvIHRoZSByYXkuIFRoZVxuICAqIHByb2plY3RlZCBwb2ludCBpcyB0aGUgY2xvc2VzdCBwb3NzaWJsZSBwb2ludCB0byBgcG9pbnRgLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGFuIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHByb2plY3Qgb250byB0aGUgcmF5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRQcm9qZWN0aW9uKHBvaW50KSB7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiBwb2ludC5yYXkocGVycGVuZGljdWxhcilcbiAgICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0YCB0byB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgXG4gICogb250byB0aGUgcmF5LlxuICAqXG4gICogVGhlIHJldHVybmVkIGRpc3RhbmNlIGlzIHBvc2l0aXZlIHdoZW4gdGhlIHByb2plY3RlZCBwb2ludCBpcyB0b3dhcmRzXG4gICogdGhlIGRpcmVjdGlvbiBvZiB0aGUgcmF5LCBhbmQgbmVnYXRpdmUgd2hlbiBpdCBpcyBiZWhpbmQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcHJvamVjdCBhbmQgbWVhc3VyZSB0aGVcbiAgKiBkaXN0YW5jZSB0b1xuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHRoaXMucG9pbnRQcm9qZWN0aW9uKHBvaW50KTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2VUb1BvaW50KHByb2plY3RlZCk7XG5cbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKGRpc3RhbmNlLCAwKSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgYW5nbGVUb1Byb2plY3RlZCA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHByb2plY3RlZCk7XG4gICAgY29uc3QgYW5nbGVEaWZmID0gdGhpcy5hbmdsZS5zdWJ0cmFjdChhbmdsZVRvUHJvamVjdGVkKTtcbiAgICBpZiAoYW5nbGVEaWZmLnR1cm4gPD0gMS80IHx8IGFuZ2xlRGlmZi50dXJuID4gMy80KSB7XG4gICAgICByZXR1cm4gZGlzdGFuY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAtZGlzdGFuY2U7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBhbmdsZSB0byB0aGUgZ2l2ZW4gYHBvaW50YCBpcyBsb2NhdGVkIGNsb2Nrd2lzZVxuICAqIG9mIHRoZSByYXkgb3IgYGZhbHNlYCB3aGVuIGxvY2F0ZWQgY291bnRlci1jbG9ja3dpc2UuXG4gICpcbiAgKiAqIFdoZW4gYHRoaXMuc3RhcnRgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSBvciBgcG9pbnRgIGxhbmRzIG9uIHRoZSByYXksIGl0IGlzXG4gICogY29uc2lkZXJlZCBjbG9ja3dpc2UuIFdoZW4gYHBvaW50YCBsYW5kcyBvbiB0aGVcbiAgKiBbaW52ZXJzZV17QGxpbmsgUmFjLlJheSNpbnZlcnNlfSBvZiB0aGUgcmF5LCBpdCBpcyBjb25zaWRlcmVkXG4gICogY291bnRlci1jbG9ja3dpc2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gbWVhc3VyZSB0aGUgb3JpZW50YXRpb24gdG9cbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKiBAc2VlIFJhYy5SYXkjaW52ZXJzZVxuICAqL1xuICBwb2ludE9yaWVudGF0aW9uKHBvaW50KSB7XG4gICAgY29uc3QgcG9pbnRBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICBpZiAodGhpcy5hbmdsZS5lcXVhbHMocG9pbnRBbmdsZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBwb2ludEFuZ2xlLnN1YnRyYWN0KHRoaXMuYW5nbGUpO1xuICAgIC8vIFswIHRvIDAuNSkgaXMgY29uc2lkZXJlZCBjbG9ja3dpc2VcbiAgICAvLyBbMC41LCAxKSBpcyBjb25zaWRlcmVkIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgcmV0dXJuIGFuZ2xlRGlzdGFuY2UudHVybiA8IDAuNTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFJheWAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICByYXlUb1BvaW50KHBvaW50KSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHVzaW5nIGB0aGlzYCBhbmQgdGhlIGdpdmVuIGBsZW5ndGhgLlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50KGxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMsIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXMuc3RhcnRgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgU2VnbWVudGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zZWdtZW50VG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0YCBhbmQgZW5kaW5nIGF0IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgdGhlIGludGVyc2VjdGlvbiBwb2ludCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQm90aCByYXlzIGFyZSBjb25zaWRlcmVkIHVuYm91bmRlZCBsaW5lcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb0ludGVyc2VjdGlvbihvdGhlclJheSkge1xuICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IHRoaXMucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheSk7XG4gICAgaWYgKGludGVyc2VjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KGludGVyc2VjdGlvbik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXMuc3RhcnRgLCBzdGFydCBhdCBgdGhpcy5hbmdsZWBcbiAgKiBhbmQgdGhlIGdpdmVuIGFyYyBwcm9wZXJ0aWVzLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxudW1iZXJ9IFtlbmRBbmdsZT1udWxsXSAtIFRoZSBlbmQgYEFuZ2xlYCBvZiB0aGUgbmV3XG4gICogYEFyY2A7IHdoZW4gYG51bGxgIG9yIG9tbWl0ZWQsIGB0aGlzLmFuZ2xlYCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge2Jvb2xlYW49fSBjbG9ja3dpc2U9dHJ1ZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhyYWRpdXMsIGVuZEFuZ2xlID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGVuZEFuZ2xlID0gZW5kQW5nbGUgPT09IG51bGxcbiAgICAgID8gdGhpcy5hbmdsZVxuICAgICAgOiB0aGlzLnJhYy5BbmdsZS5mcm9tKGVuZEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnN0YXJ0LCByYWRpdXMsXG4gICAgICB0aGlzLmFuZ2xlLCBlbmRBbmdsZSxcbiAgICAgIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXMuc3RhcnRgLCBzdGFydCBhdCBgdGhpcy5hbmdsZWAsXG4gICogYW5kIGVuZCBhdCB0aGUgZ2l2ZW4gYGFuZ2xlRGlzdGFuY2VgIGZyb20gYHRoaXMuc3RhcnRgIGluIHRoZVxuICAqIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tXG4gICogYHRoaXMuc3RhcnRgIHRvIHRoZSBuZXcgYEFyY2AgZW5kXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjVG9BbmdsZURpc3RhbmNlKHJhZGl1cywgYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBlbmRBbmdsZSA9IHRoaXMuYW5nbGUuc2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnN0YXJ0LCByYWRpdXMsXG4gICAgICB0aGlzLmFuZ2xlLCBlbmRBbmdsZSxcbiAgICAgIGNsb2Nrd2lzZSk7XG4gIH1cblxufSAvLyBjbGFzcyBSYXlcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJheTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFNlZ21lbnQgb2YgYSBgW1JheV17QGxpbmsgUmFjLlJheX1gIHVwIHRvIGEgZ2l2ZW4gbGVuZ3RoLlxuKlxuKiBAYWxpYXMgUmFjLlNlZ21lbnRcbiovXG5jbGFzcyBTZWdtZW50IHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBTZWdtZW50YCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRoZSBzZWdtZW50IHdpbGwgYmUgYmFzZWQgb2ZcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgc2VnbWVudFxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHJheSwgbGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogZGlmZmVyZW50IGFwcHJvYWNoIHRvIGVycm9yIHRocm93aW5nP1xuICAgIC8vIGFzc2VydCB8fCB0aHJvdyBuZXcgRXJyb3IoZXJyLm1pc3NpbmdQYXJhbWV0ZXJzKVxuICAgIC8vIG9yXG4gICAgLy8gY2hlY2tlcihtc2cgPT4geyB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChtc2cpKTtcbiAgICAvLyAgIC5leGlzdHMocmFjKVxuICAgIC8vICAgLmlzVHlwZShSYWMuUmF5LCByYXkpXG4gICAgLy8gICAuaXNOdW1iZXIobGVuZ3RoKVxuXG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgcmF5LCBsZW5ndGgpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlJheSwgcmF5KTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIobGVuZ3RoKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYFJheWAgdGhlIHNlZ21lbnQgaXMgYmFzZWQgb2YuXG4gICAgKiBAdHlwZSB7UmFjLlJheX1cbiAgICAqL1xuICAgIHRoaXMucmF5ID0gcmF5O1xuXG4gICAgLyoqXG4gICAgKiBUaGUgbGVuZ3RoIG9mIHRoZSBzZWdtZW50LlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuc3RhcnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGxlbmd0aFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmxlbmd0aCwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFNlZ21lbnQoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9IGw6JHtsZW5ndGhTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHJheWAgYW5kIGBsZW5ndGhgIGluIGJvdGggc2VnbWVudHMgYXJlIGVxdWFsLlxuICAqXG4gICogV2hlbiBgb3RoZXJTZWdtZW50YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlNlZ21lbnRgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBTZWdtZW50cycgYGxlbmd0aGAgYXJlIGNvbXBhcmVkIHVzaW5nIGB7QGxpbmsgUmFjI2VxdWFsc31gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gb3RoZXJTZWdtZW50IC0gQSBgU2VnbWVudGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqIEBzZWUgUmFjLlJheSNlcXVhbHNcbiAgKiBAc2VlIFJhYyNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyU2VnbWVudCkge1xuICAgIHJldHVybiBvdGhlclNlZ21lbnQgaW5zdGFuY2VvZiBTZWdtZW50XG4gICAgICAmJiB0aGlzLnJheS5lcXVhbHMob3RoZXJTZWdtZW50LnJheSlcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLmxlbmd0aCwgb3RoZXJTZWdtZW50Lmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGBbYW5nbGVde0BsaW5rIFJhYy5SYXkjYW5nbGV9YCBvZiB0aGUgc2VnbWVudCdzIGByYXlgLlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFuZ2xlKCkge1xuICAgIHJldHVybiB0aGlzLnJheS5hbmdsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYFtzdGFydF17QGxpbmsgUmFjLlJheSNzdGFydH1gIG9mIHRoZSBzZWdtZW50J3MgYHJheWAuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc3RhcnQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aGVyZSB0aGUgc2VnbWVudCBlbmRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGVuZFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGFuZ2xlIHNldCB0byBgbmV3QW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdBbmdsZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMucmF5LnN0YXJ0LCBuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgcmF5YCBzZXQgdG8gYG5ld1JheWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBuZXdSYXkgLSBUaGUgcmF5IGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFJheShuZXdSYXkpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHN0YXJ0IHBvaW50IHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydFBvaW50IC0gVGhlIHN0YXJ0IHBvaW50IGZvciB0aGUgbmV3XG4gICogYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoU3RhcnRQb2ludChuZXdTdGFydFBvaW50KSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aFN0YXJ0KG5ld1N0YXJ0UG9pbnQpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgc2V0IHRvIGBuZXdMZW5ndGhgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdMZW5ndGggLSBUaGUgbGVuZ3RoIGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aChuZXdMZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBsZW5ndGhgIGFkZGVkIHRvIGB0aGlzLmxlbmd0aGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoQWRkKGxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoICsgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgbGVuZ3RoYCBzZXQgdG8gYHRoaXMubGVuZ3RoICogcmF0aW9gLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoICogcmF0aW8pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBhbmdsZWAgYWRkZWQgdG8gYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZUFkZChhbmdsZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhBbmdsZUFkZChhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgYW5nbGVgIHNldCB0b1xuICAqIGB0aGlzLnJheS57QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0IGFuZ2xlLnNoaWZ0fShhbmdsZSwgY2xvY2t3aXNlKWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSB0byBiZSBzaGlmdGVkIGJ5XG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoQW5nbGVTaGlmdChhbmdsZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCBpbiB0aGUgaW52ZXJzZVxuICAqIGRpcmVjdGlvbiBvZiB0aGUgc2VnbWVudCdzIHJheSBieSB0aGUgZ2l2ZW4gYGRpc3RhbmNlYC4gVGhlIHJlc3VsdGluZ1xuICAqIGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIHNhbWUgYGVuZFBvaW50KClgIGFuZCBgYW5nbGUoKWAgYXMgYHRoaXNgLlxuICAqXG4gICogVXNpbmcgYSBwb3NpdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBsb25nZXIgc2VnbWVudCwgdXNpbmcgYVxuICAqIG5lZ2F0aXZlIGBkaXN0YW5jZWAgcmVzdWx0cyBpbiBhIHNob3J0ZXIgb25lLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoU3RhcnRFeHRlbmRlZChkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvRGlzdGFuY2UoLWRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGggKyBkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHBvaW50aW5nIHRvd2FyZHMgdGhlXG4gICogW3BlcnBlbmRpY3VsYXIgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfSBvZlxuICAqIGB0aGlzLmFuZ2xlKClgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgc2FtZSBgc3RhcnRQb2ludCgpYCBhbmQgYGxlbmd0aGBcbiAgKiBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBpdHMgc3RhcnQgcG9pbnQgc2V0IGF0XG4gICogYFt0aGlzLmVuZFBvaW50KClde0BsaW5rIFJhYy5TZWdtZW50I2VuZFBvaW50fWAsXG4gICogYW5nbGUgc2V0IHRvIGB0aGlzLmFuZ2xlKCkuW2ludmVyc2UoKV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9YCwgYW5kXG4gICogc2FtZSBsZW5ndGggYXMgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI2ludmVyc2VcbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgaW52ZXJzZVJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBlbmQsIHRoaXMucmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBpbnZlcnNlUmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieVxuICAqIHRoZSBnaXZlbiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnRcbiAgICB0b3dhcmRzXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCBhbG9uZyB0aGUgc2VnbWVudCdzXG4gICogcmF5IGJ5IHRoZSBnaXZlbiBgbGVuZ3RoYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGxlbmd0aGAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0xlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVUb0Rpc3RhbmNlKGxlbmd0aCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgdGhlIGdpdmVuIGBkaXN0YW5jZWBcbiAgKiB0b3dhcmRzIHRoZSBwZXJwZW5kaWN1bGFyIGFuZ2xlIHRvIGB0aGlzLmFuZ2xlKClgIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0b24uIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGdpdmVuIGB2YWx1ZWAgY2xhbXBlZCB0byBbc3RhcnRJbnNldCwgbGVuZ3RoLWVuZEluc2V0XS5cbiAgKlxuICAqIFdoZW4gYHN0YXJ0SW5zZXRgIGlzIGdyZWF0ZXIgdGhhdCBgbGVuZ3RoLWVuZEluc2V0YCB0aGUgcmFuZ2UgZm9yIHRoZVxuICAqIGNsYW1wIGJlY29tZXMgaW1wb3NpYmxlIHRvIGZ1bGZpbGwuIEluIHRoaXMgY2FzZSB0aGUgcmV0dXJuZWQgdmFsdWVcbiAgKiB3aWxsIGJlIHRoZSBjZW50ZXJlZCBiZXR3ZWVuIHRoZSByYW5nZSBsaW1pdHMgYW5kIHN0aWxsIGNsYW1wbGVkIHRvXG4gICogYFswLCBsZW5ndGhdYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIEEgdmFsdWUgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0SW5zZXQ9MF0gLSBUaGUgaW5zZXQgZm9yIHRoZSBsb3dlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7ZW5kSW5zZXR9IFtlbmRJbnNldD0wXSAtIFRoZSBpbnNldCBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGNsYW1wVG9MZW5ndGgodmFsdWUsIHN0YXJ0SW5zZXQgPSAwLCBlbmRJbnNldCA9IDApIHtcbiAgICBjb25zdCBlbmRMaW1pdCA9IHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQ7XG4gICAgaWYgKHN0YXJ0SW5zZXQgPj0gZW5kTGltaXQpIHtcbiAgICAgIC8vIGltcG9zaWJsZSByYW5nZSwgcmV0dXJuIG1pZGRsZSBwb2ludFxuICAgICAgY29uc3QgcmFuZ2VNaWRkbGUgPSAoc3RhcnRJbnNldCAtIGVuZExpbWl0KSAvIDI7XG4gICAgICBjb25zdCBtaWRkbGUgPSBzdGFydEluc2V0IC0gcmFuZ2VNaWRkbGU7XG4gICAgICAvLyBTdGlsbCBjbGFtcCB0byB0aGUgc2VnbWVudCBpdHNlbGZcbiAgICAgIGxldCBjbGFtcGVkID0gbWlkZGxlO1xuICAgICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoKTtcbiAgICAgIGNsYW1wZWQgPSBNYXRoLm1heChjbGFtcGVkLCAwKTtcbiAgICAgIHJldHVybiBjbGFtcGVkO1xuICAgIH1cbiAgICBsZXQgY2xhbXBlZCA9IHZhbHVlO1xuICAgIGNsYW1wZWQgPSBNYXRoLm1pbihjbGFtcGVkLCB0aGlzLmxlbmd0aCAtIGVuZEluc2V0KTtcbiAgICBjbGFtcGVkID0gTWF0aC5tYXgoY2xhbXBlZCwgc3RhcnRJbnNldCk7XG4gICAgcmV0dXJuIGNsYW1wZWQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgc2VnbWVudCdzIHJheSBhdCB0aGUgZ2l2ZW4gYGxlbmd0aGAgZnJvbVxuICAqIGB0aGlzLnN0YXJ0UG9pbnQoKWAuIFdoZW4gYGxlbmd0aGAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpc1xuICAqIGNhbGN1bGF0ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0UG9pbnQoKWBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqIEBzZWUgUmFjLlJheSNwb2ludEF0RGlzdGFuY2VcbiAgKi9cbiAgcG9pbnRBdExlbmd0aChsZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgc2VnbWVudCdzIHJheSBhdCBhIGRpc3RhbmNlIG9mXG4gICogYHRoaXMubGVuZ3RoICogcmF0aW9gIGZyb20gYHRoaXMuc3RhcnRQb2ludCgpYC4gV2hlbiBgcmF0aW9gIGlzXG4gICogbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkIGluIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZlxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoYCBieVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICogQHNlZSBSYWMuUmF5I3BvaW50QXREaXN0YW5jZVxuICAqL1xuICBwb2ludEF0TGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoICogcmF0aW8pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIG1pZGRsZSBwb2ludCB0aGUgc2VnbWVudC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QmlzZWN0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgYXQgYG5ld1N0YXJ0UG9pbnRgIGFuZCBlbmRpbmcgYXRcbiAgKiBgdGhpcy5lbmRQb2ludCgpYC5cbiAgKlxuICAqIFdoZW4gYG5ld1N0YXJ0UG9pbnRgIGFuZCBgdGhpcy5lbmRQb2ludCgpYCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnRQb2ludCAtIFRoZSBzdGFydCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgbW92ZVN0YXJ0UG9pbnQobmV3U3RhcnRQb2ludCkge1xuICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIHJldHVybiBuZXdTdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50LCB0aGlzLnJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0UG9pbnQoKWAgYW5kIGVuZGluZyBhdFxuICAqIGBuZXdFbmRQb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0UG9pbnQoKWAgYW5kIGBuZXdFbmRQb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld0VuZFBvaW50IC0gVGhlIGVuZCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgbW92ZUVuZFBvaW50KG5ld0VuZFBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnNlZ21lbnRUb1BvaW50KG5ld0VuZFBvaW50KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSB0aGUgc3RhcnRpbmcgcG9pbnQgdG8gdGhlIHNlZ21lbnQncyBtaWRkbGVcbiAgKiBwb2ludC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5TZWdtZW50I3BvaW50QXRCaXNlY3RvclxuICAqL1xuICBzZWdtZW50VG9CaXNlY3RvcigpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSB0aGUgc2VnbWVudCdzIG1pZGRsZSBwb2ludCB0b3dhcmRzIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlNlZ21lbnQjcG9pbnRBdEJpc2VjdG9yXG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBzZWdtZW50QmlzZWN0b3IobGVuZ3RoID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5wb2ludEF0QmlzZWN0b3IoKTtcbiAgICBjb25zdCBuZXdBbmdsZSA9IHRoaXMucmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgbmV3U3RhcnQsIG5ld0FuZ2xlKTtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB3aXRoIHRoZSBnaXZlblxuICAqIGBsZW5ndGhgIGFuZCB0aGUgc2FtZSBhbmdsZSBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV4dCBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIG5leHRTZWdtZW50V2l0aExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoU3RhcnQobmV3U3RhcnQpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCBhbmQgdXAgdG8gdGhlIGdpdmVuXG4gICogYG5leHRFbmRQb2ludGAuXG4gICpcbiAgKiBXaGVuIGBlbmRQb2ludCgpYCBhbmQgYG5leHRFbmRQb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5leHRFbmRQb2ludCAtIFRoZSBlbmQgcG9pbnQgb2YgdGhlIG5leHQgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBuZXh0U2VnbWVudFRvUG9pbnQobmV4dEVuZFBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgcmV0dXJuIG5ld1N0YXJ0LnNlZ21lbnRUb1BvaW50KG5leHRFbmRQb2ludCwgdGhpcy5yYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIGBhbmdsZWBcbiAgKiB3aXRoIHRoZSBnaXZlbiBgbGVuZ3RoYC5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHs/bnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIG5leHRTZWdtZW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZSBnaXZlblxuICAqIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLmFuZ2xlKCkuaW52ZXJzZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBOb3RpY2UgdGhhdCB0aGUgYGFuZ2xlRGlzdGFuY2VgIGlzIGFwcGxpZWQgdG8gdGhlIGludmVyc2Ugb2YgdGhlXG4gICogc2VnbWVudCdzIGFuZ2xlLiBFLmcuIHdpdGggYW4gYGFuZ2xlRGlzdGFuY2VgIG9mIGAwYCB0aGUgcmVzdWx0aW5nXG4gICogYFNlZ21lbnRgIHdpbGwgYmUgZGlyZWN0bHkgb3ZlciBhbmQgcG9pbnRpbmcgaW4gdGhlIGludmVyc2UgYW5nbGUgb2ZcbiAgKiBgdGhpc2AuIEFzIHRoZSBgYW5nbGVEaXN0YW5jZWAgaW5jcmVhc2VzIHRoZSB0d28gc2VnbWVudHMgc2VwYXJhdGUgd2l0aFxuICAqIHRoZSBwaXZvdCBhdCBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBBbiBhbmdsZSBkaXN0YW5jZSB0byBhcHBseSB0b1xuICAqIHRoZSBzZWdtZW50J3MgYW5nbGUgaW52ZXJzZVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYW5nbGUgc2hpZnRcbiAgKiBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI2ludmVyc2VcbiAgKi9cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5pbnZlcnNlKClcbiAgICAgIC53aXRoQW5nbGVTaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZVxuICAqIGBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9YCBvZlxuICAqIGB0aGlzLmFuZ2xlKCkuaW52ZXJzZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhlIHBlcnBlbmRpY3VsYXIgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBpbnZlcnNlIG9mIHRoZVxuICAqIHNlZ21lbnQncyBhbmdsZS4gRS5nLiB3aXRoIGBjbG9ja3dpc2VgIGFzIGB0cnVlYCwgdGhlIHJlc3VsdGluZ1xuICAqIGBTZWdtZW50YCB3aWxsIGJlIHBvaW50aW5nIHRvd2FyZHMgYHRoaXMuYW5nbGUoKS5wZXJwZW5kaWN1bGFyKGZhbHNlKWAuXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJcbiAgKi9cbiAgbmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUsIGxlbmd0aCA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5wZXJwZW5kaWN1bGFyKCFjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB3aGljaCBjb3JyZXNwb25kc1xuICAqIHRvIHRoZSBsZWcgb2YgYSByaWdodCB0cmlhbmdsZSB3aGVyZSBgdGhpc2AgaXMgdGhlIG90aGVyIGNhdGhldHVzIGFuZFxuICAqIHRoZSBoeXBvdGVudXNlIGlzIG9mIGxlbmd0aCBgaHlwb3RlbnVzZWAuXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIHBvaW50IHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgYW5nbGUgb2ZcbiAgKiBgW3RoaXMuYW5nbGUoKS5baW52ZXJzZSgpXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1gIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiBgaHlwb3RlbnVzZWAgaXMgc21hbGxlciB0aGF0IHRoZSBzZWdtZW50J3MgYGxlbmd0aGAsIHJldHVybnNcbiAgKiBgbnVsbGAgc2luY2Ugbm8gcmlnaHQgdHJpYW5nbGUgaXMgcG9zc2libGUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gaHlwb3RlbnVzZSAtIFRoZSBsZW5ndGggb2YgdGhlIGh5cG90ZW51c2Ugc2lkZSBvZiB0aGVcbiAgKiByaWdodCB0cmlhbmdsZSBmb3JtZWQgd2l0aCBgdGhpc2AgYW5kIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgZnJvbSBgZW5kUG9pbnQoKWBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjaW52ZXJzZVxuICAqL1xuICBuZXh0U2VnbWVudExlZ1dpdGhIeXAoaHlwb3RlbnVzZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGlmIChoeXBvdGVudXNlIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGNvcyA9IGFkeSAvIGh5cFxuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmFjb3ModGhpcy5sZW5ndGggLyBoeXBvdGVudXNlKTtcbiAgICAvLyB0YW4gPSBvcHMgLyBhZGpcbiAgICAvLyB0YW4gKiBhZGogPSBvcHNcbiAgICBjb25zdCBvcHMgPSBNYXRoLnRhbihyYWRpYW5zKSAqIHRoaXMubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihjbG9ja3dpc2UsIG9wcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgYmFzZWQgb24gdGhpcyBzZWdtZW50LCB3aXRoIHRoZSBnaXZlbiBgZW5kQW5nbGVgXG4gICogYW5kIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIHJldHVybmVkIGBBcmNgIHdpbGwgdXNlIHRoaXMgc2VnbWVudCdzIHN0YXJ0IGFzIGBjZW50ZXJgLCBpdHMgYW5nbGVcbiAgKiBhcyBgc3RhcnRgLCBhbmQgaXRzIGxlbmd0aCBhcyBgcmFkaXVzYC5cbiAgKlxuICAqIFdoZW4gYGVuZEFuZ2xlYCBpcyBvbW1pdGVkIG9yIGBudWxsYCwgdGhlIHNlZ21lbnQncyBhbmdsZSBpcyB1c2VkXG4gICogaW5zdGVhZCByZXN1bHRpbmcgaW4gYSBjb21wbGV0ZS1jaXJjbGUgYXJjLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfSBbZW5kQW5nbGU9bnVsbF0gLSBBbiBgQW5nbGVgIHRvIHVzZSBhcyBlbmQgZm9yIHRoZVxuICAqIG5ldyBgQXJjYCwgb3IgYG51bGxgIHRvIHVzZSBgdGhpcy5hbmdsZSgpYFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMucmF5LmFuZ2xlXG4gICAgICA6IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5yYXkuc3RhcnQsIHRoaXMubGVuZ3RoLFxuICAgICAgdGhpcy5yYXkuYW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCBiYXNlZCBvbiB0aGlzIHNlZ21lbnQsIHdpdGggdGhlIGFyYydzIGVuZCBhdFxuICAqIGBhbmdsZURpc3RhbmNlYCBmcm9tIHRoZSBzZWdtZW50J3MgYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYEFyY2Agd2lsbCB1c2UgdGhpcyBzZWdtZW50J3Mgc3RhcnQgYXMgYGNlbnRlcmAsIGl0cyBhbmdsZVxuICAqIGFzIGBzdGFydGAsIGFuZCBpdHMgbGVuZ3RoIGFzIGByYWRpdXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gdGhlXG4gICogc2VnbWVudCdzIHN0YXJ0IHRvIHRoZSBuZXcgYEFyY2AgZW5kXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjV2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IHN0YXJnQW5nbGUgPSB0aGlzLnJheS5hbmdsZTtcbiAgICBjb25zdCBlbmRBbmdsZSA9IHN0YXJnQW5nbGUuc2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMucmF5LnN0YXJ0LCB0aGlzLmxlbmd0aCxcbiAgICAgIHN0YXJnQW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogdW5jb21tZW50IG9uY2UgYmV6aWVycyBhcmUgdGVzdGVkIGFnYWluXG4gIC8vIGJlemllckNlbnRyYWxBbmNob3IoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgLy8gICBsZXQgYmlzZWN0b3IgPSB0aGlzLnNlZ21lbnRCaXNlY3RvcihkaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgLy8gICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLnN0YXJ0LCBiaXNlY3Rvci5lbmQsXG4gIC8vICAgICBiaXNlY3Rvci5lbmQsIHRoaXMuZW5kKTtcbiAgLy8gfVxuXG5cbn0gLy8gU2VnbWVudFxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VnbWVudDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5zIHR3byBgW0NvbXBvc2l0ZV17QGxpbmsgUmFjLkNvbXBvc2l0ZX1gIG9iamVjdHM6IGBvdXRsaW5lYCBhbmRcbiogYGNvbnRvdXJgLlxuKlxuKiBVc2VkIGJ5IGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gIHRvIGRyYXcgdGhlIGNvbXBvc2l0ZXMgYXMgYVxuKiBjb21wbGV4IHNoYXBlIChgb3V0bGluZWApIHdpdGggYW4gbmVnYXRpdmUgc3BhY2Ugc2hhcGUgaW5zaWRlIChgY29udG91cmApLlxuKlxuKiBAY2xhc3NcbiogQGFsaWFzIFJhYy5TaGFwZVxuKi9cbmZ1bmN0aW9uIFNoYXBlKHJhYykge1xuICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcblxuICB0aGlzLnJhYyA9IHJhYztcbiAgdGhpcy5vdXRsaW5lID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcbiAgdGhpcy5jb250b3VyID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlO1xuXG5cblNoYXBlLnByb3RvdHlwZS5hZGRPdXRsaW5lID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICB0aGlzLm91dGxpbmUuYWRkKGVsZW1lbnQpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLmFkZENvbnRvdXIgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIHRoaXMuY29udG91ci5hZGQoZWxlbWVudCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRm9ybWF0IGZvciBkcmF3aW5nIGEgYFtUZXh0XXtAbGluayBSYWMuVGV4dH1gIG9iamVjdC5cbipcbiogQGFsaWFzIFJhYy5UZXh0LkZvcm1hdFxuKi9cbmNsYXNzIFRleHRGb3JtYXQge1xuXG4gIHN0YXRpYyBkZWZhdWx0U2l6ZSA9IDE1O1xuXG4gIHN0YXRpYyBob3Jpem9udGFsID0ge1xuICAgIGxlZnQ6IFwibGVmdFwiLFxuICAgIGNlbnRlcjogXCJob3Jpem9udGFsQ2VudGVyXCIsXG4gICAgcmlnaHQ6IFwicmlnaHRcIlxuICB9O1xuXG4gIHN0YXRpYyB2ZXJ0aWNhbCA9IHtcbiAgICB0b3A6IFwidG9wXCIsXG4gICAgYm90dG9tOiBcImJvdHRvbVwiLFxuICAgIGNlbnRlcjogXCJ2ZXJ0aWNhbENlbnRlclwiLFxuICAgIGJhc2VsaW5lOiBcImJhc2VsaW5lXCJcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByYWMsXG4gICAgaG9yaXpvbnRhbCwgdmVydGljYWwsXG4gICAgZm9udCA9IG51bGwsXG4gICAgYW5nbGUgPSByYWMuQW5nbGUuemVybyxcbiAgICBzaXplID0gVGV4dEZvcm1hdC5kZWZhdWx0U2l6ZSlcbiAge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydFN0cmluZyhob3Jpem9udGFsLCB2ZXJ0aWNhbCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIoc2l6ZSk7XG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5ob3Jpem9udGFsID0gaG9yaXpvbnRhbDtcbiAgICB0aGlzLnZlcnRpY2FsID0gdmVydGljYWw7XG4gICAgdGhpcy5mb250ID0gZm9udDtcbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmb3JtYXQgdG8gZHJhdyB0ZXh0IGluIHRoZSBzYW1lIHBvc2l0aW9uIGFzIGBzZWxmYCB3aXRoXG4gIC8vIHRoZSBpbnZlcnNlIGFuZ2xlLlxuICBpbnZlcnNlKCkge1xuICAgIGxldCBoRW51bSA9IFRleHRGb3JtYXQuaG9yaXpvbnRhbDtcbiAgICBsZXQgdkVudW0gPSBUZXh0Rm9ybWF0LnZlcnRpY2FsO1xuICAgIGxldCBob3Jpem9udGFsLCB2ZXJ0aWNhbDtcbiAgICBzd2l0Y2ggKHRoaXMuaG9yaXpvbnRhbCkge1xuICAgICAgY2FzZSBoRW51bS5sZWZ0OlxuICAgICAgICBob3Jpem9udGFsID0gaEVudW0ucmlnaHQ7IGJyZWFrO1xuICAgICAgY2FzZSBoRW51bS5yaWdodDpcbiAgICAgICAgaG9yaXpvbnRhbCA9IGhFbnVtLmxlZnQ7IGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaG9yaXpvbnRhbCA9IHRoaXMuaG9yaXpvbnRhbDsgYnJlYWs7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgY2FzZSB2RW51bS50b3A6XG4gICAgICAgIHZlcnRpY2FsID0gdkVudW0uYm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgdkVudW0uYm90dG9tOlxuICAgICAgICB2ZXJ0aWNhbCA9IHZFbnVtLnRvcDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2ZXJ0aWNhbCA9IHRoaXMudmVydGljYWw7IGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgaG9yaXpvbnRhbCwgdmVydGljYWwsXG4gICAgICB0aGlzLmZvbnQsXG4gICAgICB0aGlzLmFuZ2xlLmludmVyc2UoKSxcbiAgICAgIHRoaXMuc2l6ZSlcbiAgfVxuXG59IC8vIGNsYXNzIFRleHRGb3JtYXRcblxuXG4vKipcbiogU3RyaW5nLCBmb3JtYXQsIGFuZCBwb3NpdGlvbiB0byBkcmF3IGEgdGV4dC5cbiogQGFsaWFzIFJhYy5UZXh0XG4qL1xuY2xhc3MgVGV4dCB7XG5cbiAgc3RhdGljIEZvcm1hdCA9IFRleHRGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IocmFjLCBwb2ludCwgc3RyaW5nLCBmb3JtYXQpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBwb2ludCwgc3RyaW5nLCBmb3JtYXQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBwb2ludCk7XG4gICAgdXRpbHMuYXNzZXJ0U3RyaW5nKHN0cmluZyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShUZXh0LkZvcm1hdCwgZm9ybWF0KTtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnBvaW50ID0gcG9pbnQ7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgdGhpcy5mb3JtYXQgPSBmb3JtYXQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgVGV4dCgoJHt0aGlzLnBvaW50Lnh9LCR7dGhpcy5wb2ludC55fSkgXCIke3RoaXMuc3RyaW5nfVwiKWA7XG4gIH1cblxufSAvLyBjbGFzcyBUZXh0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuQW5nbGVgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkFuZ2xlfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQW5nbGVcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0FuZ2xlKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiBDYWxsc2B7QGxpbmsgUmFjLkFuZ2xlLmZyb219YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcnxSYWMuQW5nbGV8UmFjLlJheXxSYWMuU2VnbWVudH0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGFuIGBBbmdsZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb20gPSBmdW5jdGlvbihzb21ldGhpbmcpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb20ocmFjLCBzb21ldGhpbmcpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBDYWxscyBge0BsaW5rIFJhYy5BbmdsZS5mcm9tUmFkaWFuc31gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21SYWRpYW5zXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gcmFkaWFuc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVJhZGlhbnNcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tUmFkaWFucyA9IGZ1bmN0aW9uKHJhZGlhbnMpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHJhYywgcmFkaWFucyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBkZWdyZWVzYC5cbiAgKlxuICAqIENhbGxzIGB7QGxpbmsgUmFjLkFuZ2xlLmZyb21EZWdyZWVzfWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogQHNlZSBSYWMuQW5nbGUuZnJvbURlZ3JlZXNcbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiBkZWdyZWVzXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tRGVncmVlc1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb21EZWdyZWVzID0gZnVuY3Rpb24oZGVncmVlcykge1xuICAgIHJldHVybiBSYWMuQW5nbGUuZnJvbURlZ3JlZXMocmFjLCBkZWdyZWVzKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAwYC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGByaWdodGAsIGByYCwgYGVhc3RgLCBgZWAuXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS56ZXJvID0gcmFjLkFuZ2xlKDAuMCk7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMmAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgbGVmdGAsIGBsYCwgYHdlc3RgLCBgd2AsIGBpbnZlcnNlYC5cbiAgKlxuICAqIEBuYW1lIGhhbGZcbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmhhbGYgPSByYWMuQW5nbGUoMS8yKTtcbiAgcmFjLkFuZ2xlLmludmVyc2UgPSByYWMuQW5nbGUuaGFsZjtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS80YC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGBkb3duYCwgYGRgLCBgYm90dG9tYCwgYGJgLCBgc291dGhgLCBgc2AsIGBzcXVhcmVgLlxuICAqXG4gICogQG5hbWUgcXVhcnRlclxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUucXVhcnRlciA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUuc3F1YXJlID0gIHJhYy5BbmdsZS5xdWFydGVyO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzhgLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYGJvdHRvbVJpZ2h0YCwgYGJyYCwgYHNlYC5cbiAgKlxuICAqIEBuYW1lIGVpZ2h0aFxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZWlnaHRoID0gIHJhYy5BbmdsZSgxLzgpO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGA3LzhgLCBuZWdhdGl2ZSBhbmdsZSBvZlxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUjZWlnaHRoIGVpZ2h0aH1gLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYHRvcFJpZ2h0YCwgYHRyYCwgYG5lYC5cbiAgKlxuICAqIEBuYW1lIG5laWdodGhcbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLm5laWdodGggPSAgcmFjLkFuZ2xlKC0xLzgpO1xuXG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMTZgLlxuICAqXG4gICogQG5hbWUgc2l4dGVlbnRoXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5zaXh0ZWVudGggPSByYWMuQW5nbGUoMS8xNik7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDMvNGAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgdXBgLCBgdWAsIGB0b3BgLCBgdGAuXG4gICpcbiAgKiBAbmFtZSBub3J0aFxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUubm9ydGggPSByYWMuQW5nbGUoMy80KTtcbiAgcmFjLkFuZ2xlLmVhc3QgID0gcmFjLkFuZ2xlKDAvNCk7XG4gIHJhYy5BbmdsZS5zb3V0aCA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUud2VzdCAgPSByYWMuQW5nbGUoMi80KTtcblxuICByYWMuQW5nbGUuZSA9IHJhYy5BbmdsZS5lYXN0O1xuICByYWMuQW5nbGUucyA9IHJhYy5BbmdsZS5zb3V0aDtcbiAgcmFjLkFuZ2xlLncgPSByYWMuQW5nbGUud2VzdDtcbiAgcmFjLkFuZ2xlLm4gPSByYWMuQW5nbGUubm9ydGg7XG5cbiAgcmFjLkFuZ2xlLm5lID0gcmFjLkFuZ2xlLm4uYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5zZSA9IHJhYy5BbmdsZS5lLmFkZCgxLzgpO1xuICByYWMuQW5nbGUuc3cgPSByYWMuQW5nbGUucy5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLm53ID0gcmFjLkFuZ2xlLncuYWRkKDEvOCk7XG5cbiAgLy8gTm9ydGggbm9ydGgtZWFzdFxuICByYWMuQW5nbGUubm5lID0gcmFjLkFuZ2xlLm5lLmFkZCgtMS8xNik7XG4gIC8vIEVhc3Qgbm9ydGgtZWFzdFxuICByYWMuQW5nbGUuZW5lID0gcmFjLkFuZ2xlLm5lLmFkZCgrMS8xNik7XG4gIC8vIE5vcnRoLWVhc3Qgbm9ydGhcbiAgcmFjLkFuZ2xlLm5lbiA9IHJhYy5BbmdsZS5ubmU7XG4gIC8vIE5vcnRoLWVhc3QgZWFzdFxuICByYWMuQW5nbGUubmVlID0gcmFjLkFuZ2xlLmVuZTtcblxuICAvLyBFYXN0IHNvdXRoLWVhc3RcbiAgcmFjLkFuZ2xlLmVzZSA9IHJhYy5BbmdsZS5zZS5hZGQoLTEvMTYpO1xuICAvLyBTb3V0aCBzb3V0aC1lYXN0XG4gIHJhYy5BbmdsZS5zc2UgPSByYWMuQW5nbGUuc2UuYWRkKCsxLzE2KTtcbiAgLy8gU291dGgtZWFzdCBlYXN0XG4gIHJhYy5BbmdsZS5zZWUgPSByYWMuQW5nbGUuZXNlO1xuICAvLyBTb3V0aC1lYXN0IHNvdXRoXG4gIHJhYy5BbmdsZS5zZXMgPSByYWMuQW5nbGUuc3NlO1xuXG4gIC8vIFNvdXRoIHNvdXRoLXdlc3RcbiAgcmFjLkFuZ2xlLnNzdyA9IHJhYy5BbmdsZS5zdy5hZGQoLTEvMTYpO1xuICAvLyBXZXN0IHNvdXRoLXdlc3RcbiAgcmFjLkFuZ2xlLndzdyA9IHJhYy5BbmdsZS5zdy5hZGQoKzEvMTYpO1xuICAvLyBTb3V0aC13ZXN0IHNvdXRoXG4gIHJhYy5BbmdsZS5zd3MgPSByYWMuQW5nbGUuc3N3O1xuICAvLyBTb3V0aC13ZXN0IHdlc3RcbiAgcmFjLkFuZ2xlLnN3dyA9IHJhYy5BbmdsZS53c3c7XG5cbiAgLy8gV2VzdCBub3J0aC13ZXN0XG4gIHJhYy5BbmdsZS53bncgPSByYWMuQW5nbGUubncuYWRkKC0xLzE2KTtcbiAgLy8gTm9ydGggbm9ydGgtd2VzdFxuICByYWMuQW5nbGUubm53ID0gcmFjLkFuZ2xlLm53LmFkZCgrMS8xNik7XG4gIC8vIE5vcnQtaHdlc3Qgd2VzdFxuICByYWMuQW5nbGUubnd3ID0gcmFjLkFuZ2xlLndudztcbiAgLy8gTm9ydGgtd2VzdCBub3J0aFxuICByYWMuQW5nbGUubnduID0gcmFjLkFuZ2xlLm5udztcblxuICByYWMuQW5nbGUucmlnaHQgPSByYWMuQW5nbGUuZTtcbiAgcmFjLkFuZ2xlLmRvd24gID0gcmFjLkFuZ2xlLnM7XG4gIHJhYy5BbmdsZS5sZWZ0ICA9IHJhYy5BbmdsZS53O1xuICByYWMuQW5nbGUudXAgICAgPSByYWMuQW5nbGUubjtcblxuICByYWMuQW5nbGUuciA9IHJhYy5BbmdsZS5yaWdodDtcbiAgcmFjLkFuZ2xlLmQgPSByYWMuQW5nbGUuZG93bjtcbiAgcmFjLkFuZ2xlLmwgPSByYWMuQW5nbGUubGVmdDtcbiAgcmFjLkFuZ2xlLnUgPSByYWMuQW5nbGUudXA7XG5cbiAgcmFjLkFuZ2xlLnRvcCAgICA9IHJhYy5BbmdsZS51cDtcbiAgcmFjLkFuZ2xlLmJvdHRvbSA9IHJhYy5BbmdsZS5kb3duO1xuICByYWMuQW5nbGUudCAgICAgID0gcmFjLkFuZ2xlLnRvcDtcbiAgcmFjLkFuZ2xlLmIgICAgICA9IHJhYy5BbmdsZS5ib3R0b207XG5cbiAgcmFjLkFuZ2xlLnRvcFJpZ2h0ICAgID0gcmFjLkFuZ2xlLm5lO1xuICByYWMuQW5nbGUudHIgICAgICAgICAgPSByYWMuQW5nbGUubmU7XG4gIHJhYy5BbmdsZS50b3BMZWZ0ICAgICA9IHJhYy5BbmdsZS5udztcbiAgcmFjLkFuZ2xlLnRsICAgICAgICAgID0gcmFjLkFuZ2xlLm53O1xuICByYWMuQW5nbGUuYm90dG9tUmlnaHQgPSByYWMuQW5nbGUuc2U7XG4gIHJhYy5BbmdsZS5iciAgICAgICAgICA9IHJhYy5BbmdsZS5zZTtcbiAgcmFjLkFuZ2xlLmJvdHRvbUxlZnQgID0gcmFjLkFuZ2xlLnN3O1xuICByYWMuQW5nbGUuYmwgICAgICAgICAgPSByYWMuQW5nbGUuc3c7XG5cbn0gLy8gYXR0YWNoUmFjQW5nbGVcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkFyY2AgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQXJjfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQXJjXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNBcmMocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBjbG9ja3dpc2UgYEFyY2Agd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQXJjfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BcmMjXG4gICovXG4gIHJhYy5BcmMuemVybyA9IHJhYy5BcmMoMCwgMCwgMCwgMCwgMCwgdHJ1ZSk7XG5cbn0gLy8gYXR0YWNoUmFjQXJjXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5CZXppZXJgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkJlemllcn1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkJlemllclxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VCZXppZXIocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgQmV6aWVyYCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5CZXppZXJ9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkJlemllciNcbiAgKi9cbiAgcmFjLkJlemllci56ZXJvID0gcmFjLkJlemllcihcbiAgICAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDApO1xuXG59IC8vIGF0dGFjaEluc3RhbmNlQmV6aWVyXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5Qb2ludGAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuUG9pbnR9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Qb2ludFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjUG9pbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lnplcm8gPSByYWMuUG9pbnQoMCwgMCk7XG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIGF0IGAoMCwgMClgLlxuICAqXG4gICogRXF1YWwgdG8gYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAuXG4gICpcbiAgKiBAbmFtZSBvcmlnaW5cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lm9yaWdpbiA9IHJhYy5Qb2ludC56ZXJvO1xuXG5cbn0gLy8gYXR0YWNoUmFjUG9pbnRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlJheWAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuUmF5fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuUmF5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNSYXkocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgUmF5YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sIHN0YXJ0cyBhdFxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb31gIGFuZCBwb2ludHMgdG9cbiAgKiBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99YC5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnQjemVyb1xuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjemVyb1xuICAqL1xuICByYWMuUmF5Lnplcm8gPSByYWMuUmF5KDAsIDAsIHJhYy5BbmdsZS56ZXJvKTtcblxuXG4gIC8qKlxuICAqIEEgYFJheWAgb3ZlciB0aGUgeC1heGlzLCBzdGFydHMgYXQgYHtAbGluayBpbnN0YW5jZS5Qb2ludCNvcmlnaW59YCBhbmRcbiAgKiBwb2ludHMgdG8gYHtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfWAuXG4gICpcbiAgKiBFcXVhbCB0byBge0BsaW5rIGluc3RhbmNlLlJheSN6ZXJvfWAuXG4gICpcbiAgKiBAbmFtZSB4QXhpc1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICogQHNlZSBpbnN0YW5jZS5Qb2ludCNvcmlnaW5cbiAgKiBAc2VlIGluc3RhbmNlLkFuZ2xlI3plcm9cbiAgKi9cbiAgcmFjLlJheS54QXhpcyA9IHJhYy5SYXkuemVybztcblxuXG4gIC8qKlxuICAqIEEgYFJheWAgb3ZlciB0aGUgeS1heGlzLCBzdGFydHMgYXRge0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn1gIGFuZFxuICAqIHBvaW50cyB0byBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3F1YXJ0ZXJ9YC5cbiAgKlxuICAqIEBuYW1lIHlBeGlzXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKiBAc2VlIGluc3RhbmNlLlBvaW50I29yaWdpblxuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjcXVhcnRlclxuICAqL1xuICByYWMuUmF5LnlBeGlzID0gcmFjLlJheSgwLCAwLCByYWMuQW5nbGUucXVhcnRlcik7XG5cbn0gLy8gYXR0YWNoUmFjUmF5XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5TZWdtZW50YCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5TZWdtZW50fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU2VnbWVudFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjU2VnbWVudChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBTZWdtZW50YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sICwgc3RhcnRzIGF0XG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAsIHBvaW50cyB0b1xuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31gLCBhbmQgaGFzIGEgbGVuZ3RoIG9mIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5TZWdtZW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC56ZXJvID0gcmFjLlNlZ21lbnQoMCwgMCwgMCwgMCk7XG5cbn0gLy8gYXR0YWNoUmFjU2VnbWVudFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuVGV4dGAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuVGV4dH1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlRleHRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1RleHQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cblxuICByYWMuVGV4dC5Gb3JtYXQgPSBmdW5jdGlvbihcbiAgICBob3Jpem9udGFsLCB2ZXJ0aWNhbCxcbiAgICBmb250ID0gbnVsbCxcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS56ZXJvLFxuICAgIHNpemUgPSBSYWMuVGV4dC5Gb3JtYXQuZGVmYXVsdFNpemUpXG4gIHtcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICAgIHJhYyxcbiAgICAgIGhvcml6b250YWwsIHZlcnRpY2FsLFxuICAgICAgZm9udCwgYW5nbGUsIHNpemUpO1xuICB9O1xuXG5cbiAgcmFjLlRleHQuRm9ybWF0LnRvcExlZnQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWwubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWwudG9wLFxuICAgIHJhYy5BbmdsZS56ZXJvLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5kZWZhdWx0U2l6ZSk7XG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgYGhlbGxvIHdvcmxkYCB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXRcbiAgKiBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgaGVsbG9cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dCNcbiAgKi9cbiAgcmFjLlRleHQuaGVsbG8gPSByYWMuVGV4dCgwLCAwLCAnaGVsbG8gd29ybGQhJyxcbiAgICByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCk7XG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgdGhlIHBhbmdyYW0gYHNwaGlueCBvZiBibGFjayBxdWFydHosIGp1ZGdlIG15IHZvd2BcbiAgKiB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXQgYFBvaW50Lnplcm9gLlxuICAqIEBuYW1lIHNwaGlueFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0I1xuICAqL1xuICByYWMuVGV4dC5zcGhpbnggPSByYWMuVGV4dCgwLCAwLCAnc3BoaW54IG9mIGJsYWNrIHF1YXJ0eiwganVkZ2UgbXkgdm93JyxcbiAgICByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCk7XG5cbn0gLy8gYXR0YWNoUmFjUG9pbnRcblxuIiwiXG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvdGVtcGxhdGVzL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FtZGpzL2FtZGpzLWFwaS9ibG9iL21hc3Rlci9BTUQubWRcbiAgICAvLyBodHRwczovL3JlcXVpcmVqcy5vcmcvZG9jcy93aHlhbWQuaHRtbFxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cblxuICAgIC8vIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJBQyBmb3IgQU1EIC0gZGVmaW5lOiR7dHlwZW9mIGRlZmluZX1gKTtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cblxuICAgIC8vIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJBQyBmb3IgTm9kZSAtIG1vZHVsZToke3R5cGVvZiBtb2R1bGV9YCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcblxuICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgaW50byBzZWxmIC0gcm9vdDoke3R5cGVvZiByb290fWApO1xuICByb290LlJhYyA9IGZhY3RvcnkoKTtcblxufSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiByZXF1aXJlKCcuL1JhYycpO1xuXG59KSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBEcmF3ZXIgdGhhdCB1c2VzIGEgW1A1XShodHRwczovL3A1anMub3JnLykgaW5zdGFuY2UgZm9yIGFsbCBkcmF3aW5nXG4qIG9wZXJhdGlvbnMuXG4qXG4qIEBhbGlhcyBSYWMuUDVEcmF3ZXJcbiovXG5jbGFzcyBQNURyYXdlciB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBwNSl7XG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5wNSA9IHA1O1xuICAgIHRoaXMuZHJhd1JvdXRpbmVzID0gW107XG4gICAgdGhpcy5kZWJ1Z1JvdXRpbmVzID0gW107XG4gICAgdGhpcy5hcHBseVJvdXRpbmVzID0gW107XG5cbiAgICAvKipcbiAgICAqIFN0eWxlIHVzZWQgZm9yIGRlYnVnIGRyYXdpbmcsIHdoZW4gYG51bGxgIHRoZSBzdHlsZSBhbHJlYWR5IGFwcGxpZWRcbiAgICAqIGlzIHVzZWQuXG4gICAgKlxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdTdHlsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAqIFN0eWxlIHVzZWQgZm9yIHRleHQgZm9yIGRlYnVnIGRyYXdpbmcsIHdoZW4gYG51bGxgIHRoZSBzdHlsZSBhbHJlYWR5XG4gICAgKiBhcHBsaWVkIGlzIHVzZWQuXG4gICAgKlxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdUZXh0U3R5bGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBPYmplY3Qgd2l0aCBvcHRpb25zIHVzZWQgYnkgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2ZcbiAgICAqIGBkcmF3YWJsZS5kZWJ1ZygpYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1RleHRPcHRpb25zID0ge1xuICAgICAgZm9udDogJ21vbm9zcGFjZScsXG4gICAgICBzaXplOiBSYWMuVGV4dC5Gb3JtYXQuZGVmYXVsdFNpemUsXG4gICAgICBmaXhlZERpZ2l0czogMlxuICAgIH07XG5cbiAgICAvKipcbiAgICAqIFJhZGl1cyBvZiBwb2ludCBtYXJrZXJzIGZvciBkZWJ1ZyBkcmF3aW5nLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdQb2ludFJhZGl1cyA9IDQ7XG5cbiAgICAvKipcbiAgICAqIFJhZGl1cyBvZiB0aGUgbWFpbiB2aXN1YWwgZWxlbWVudHMgZm9yIGRlYnVnIGRyYXdpbmcuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z01hcmtlclJhZGl1cyA9IDIyO1xuXG4gICAgdGhpcy5zZXR1cEFsbERyYXdGdW5jdGlvbnMoKTtcbiAgICB0aGlzLnNldHVwQWxsRGVidWdGdW5jdGlvbnMoKTtcbiAgICB0aGlzLnNldHVwQWxsQXBwbHlGdW5jdGlvbnMoKTtcbiAgfVxuXG4gIC8vIEFkZHMgYSBEcmF3Um91dGluZSBmb3IgdGhlIGdpdmVuIGNsYXNzLlxuICBzZXREcmF3RnVuY3Rpb24oY2xhc3NPYmosIGRyYXdGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuXG4gICAgbGV0IHJvdXRpbmU7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcm91dGluZSA9IG5ldyBEcmF3Um91dGluZShjbGFzc09iaiwgZHJhd0Z1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzW2luZGV4XTtcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uID0gZHJhd0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuZHJhd1JvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3Um91dGluZXMucHVzaChyb3V0aW5lKTtcbiAgfVxuXG4gIHNldERyYXdPcHRpb25zKGNsYXNzT2JqLCBvcHRpb25zKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnJlcXVpcmVzUHVzaFBvcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByb3V0aW5lLnJlcXVpcmVzUHVzaFBvcCA9IG9wdGlvbnMucmVxdWlyZXNQdXNoUG9wO1xuICAgIH1cbiAgfVxuXG4gIHNldENsYXNzRHJhd1N0eWxlKGNsYXNzT2JqLCBzdHlsZSkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgZmluZCByb3V0aW5lIGZvciBjbGFzcyAtIGNsYXNzTmFtZToke2NsYXNzT2JqLm5hbWV9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb25cbiAgICB9XG5cbiAgICByb3V0aW5lLnN0eWxlID0gc3R5bGU7XG4gIH1cblxuICAvLyBBZGRzIGEgRGVidWdSb3V0aW5lIGZvciB0aGUgZ2l2ZW4gY2xhc3MuXG4gIHNldERlYnVnRnVuY3Rpb24oY2xhc3NPYmosIGRlYnVnRnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmRlYnVnUm91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERlYnVnUm91dGluZShjbGFzc09iaiwgZGVidWdGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmRlYnVnUm91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kZWJ1Z0Z1bmN0aW9uID0gZGVidWdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmRlYnVnUm91dGluZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnUm91dGluZXMucHVzaChyb3V0aW5lKTtcbiAgfVxuXG4gIC8vIEFkZHMgYSBBcHBseVJvdXRpbmUgZm9yIHRoZSBnaXZlbiBjbGFzcy5cbiAgc2V0QXBwbHlGdW5jdGlvbihjbGFzc09iaiwgYXBwbHlGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuYXBwbHlSb3V0aW5lc1xuICAgICAgLmZpbmRJbmRleChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcblxuICAgIGxldCByb3V0aW5lO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJvdXRpbmUgPSBuZXcgQXBwbHlSb3V0aW5lKGNsYXNzT2JqLCBhcHBseUZ1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuYXBwbHlSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmFwcGx5Um91dGluZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGx5Um91dGluZXMucHVzaChyb3V0aW5lKTtcbiAgfVxuXG4gIGRyYXdPYmplY3Qob2JqZWN0LCBzdHlsZSA9IG51bGwpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUudHJhY2UoYENhbm5vdCBkcmF3IG9iamVjdCAtIG9iamVjdC10eXBlOiR7dXRpbHMudHlwZU5hbWUob2JqZWN0KX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0VG9EcmF3O1xuICAgIH1cblxuICAgIGlmIChyb3V0aW5lLnJlcXVpcmVzUHVzaFBvcCA9PT0gdHJ1ZVxuICAgICAgfHwgc3R5bGUgIT09IG51bGxcbiAgICAgIHx8IHJvdXRpbmUuc3R5bGUgIT09IG51bGwpXG4gICAge1xuICAgICAgdGhpcy5wNS5wdXNoKCk7XG4gICAgICBpZiAocm91dGluZS5zdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICByb3V0aW5lLnN0eWxlLmFwcGx5KCk7XG4gICAgICB9XG4gICAgICBpZiAoc3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgc3R5bGUuYXBwbHkoKTtcbiAgICAgIH1cbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gICAgICB0aGlzLnA1LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwdXNoLXB1bGxcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETzogdXNlIGRpcmVjdGx5IG51bWJlci50b0ZpeGVkXG4gIGRlYnVnTnVtYmVyKG51bWJlcikge1xuICAgIHJldHVybiBudW1iZXIudG9GaXhlZCh0aGlzLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHMpO1xuICB9XG5cbiAgZGVidWdPYmplY3Qob2JqZWN0LCBkcmF3c1RleHQpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBObyByb3V0aW5lLCBqdXN0IGRyYXcgb2JqZWN0IHdpdGggZGVidWcgc3R5bGVcbiAgICAgIHRoaXMuZHJhd09iamVjdChvYmplY3QsIHRoaXMuZGVidWdTdHlsZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVidWdTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5wNS5wdXNoKCk7XG4gICAgICB0aGlzLmRlYnVnU3R5bGUuYXBwbHkoKTtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbih0aGlzLCBvYmplY3QsIGRyYXdzVGV4dCk7XG4gICAgICB0aGlzLnA1LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24odGhpcywgb2JqZWN0LCBkcmF3c1RleHQpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5T2JqZWN0KG9iamVjdCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5hcHBseVJvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUudHJhY2UoYENhbm5vdCBhcHBseSBvYmplY3QgLSBvYmplY3QtdHlwZToke3V0aWxzLnR5cGVOYW1lKG9iamVjdCl9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdFRvQXBwbHk7XG4gICAgfVxuXG4gICAgcm91dGluZS5hcHBseUZ1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gIH1cblxuICAvLyBTZXRzIHVwIGFsbCBkcmF3aW5nIHJvdXRpbmVzIGZvciByYWMgZHJhd2FibGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGFuZCBzdGF0aWMgZnVuY3Rpb25zIGluIHJlbGV2YW50XG4gIC8vIGNsYXNzZXMuXG4gIHNldHVwQWxsRHJhd0Z1bmN0aW9ucygpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kcmF3LmZ1bmN0aW9ucycpO1xuXG4gICAgLy8gUG9pbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuUG9pbnQsIGZ1bmN0aW9ucy5kcmF3UG9pbnQpO1xuICAgIHJlcXVpcmUoJy4vUG9pbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gUmF5XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlJheSwgZnVuY3Rpb25zLmRyYXdSYXkpO1xuICAgIHJlcXVpcmUoJy4vUmF5LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIFNlZ21lbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRyYXdTZWdtZW50KTtcbiAgICByZXF1aXJlKCcuL1NlZ21lbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gQXJjXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRyYXdBcmMpO1xuXG4gICAgUmFjLkFyYy5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgICAgbGV0IGJlemllcnNQZXJUdXJuID0gNTtcbiAgICAgIGxldCBkaXZpc2lvbnMgPSBNYXRoLmNlaWwoYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgKiBiZXppZXJzUGVyVHVybik7XG4gICAgICB0aGlzLmRpdmlkZVRvQmV6aWVycyhkaXZpc2lvbnMpLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBCZXppZXJcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQmV6aWVyLCAoZHJhd2VyLCBiZXppZXIpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZXppZXIoXG4gICAgICAgIGJlemllci5zdGFydC54LCBiZXppZXIuc3RhcnQueSxcbiAgICAgICAgYmV6aWVyLnN0YXJ0QW5jaG9yLngsIGJlemllci5zdGFydEFuY2hvci55LFxuICAgICAgICBiZXppZXIuZW5kQW5jaG9yLngsIGJlemllci5lbmRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZC54LCBiZXppZXIuZW5kLnkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkJlemllci5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0YXJ0LnZlcnRleCgpXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuYmV6aWVyVmVydGV4KFxuICAgICAgICB0aGlzLnN0YXJ0QW5jaG9yLngsIHRoaXMuc3RhcnRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmRBbmNob3IueCwgdGhpcy5lbmRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmQueCwgdGhpcy5lbmQueSk7XG4gICAgfTtcblxuICAgIC8vIENvbXBvc2l0ZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5Db21wb3NpdGUsIChkcmF3ZXIsIGNvbXBvc2l0ZSkgPT4ge1xuICAgICAgY29tcG9zaXRlLnNlcXVlbmNlLmZvckVhY2goaXRlbSA9PiBpdGVtLmRyYXcoKSk7XG4gICAgfSk7XG5cbiAgICBSYWMuQ29tcG9zaXRlLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc2VxdWVuY2UuZm9yRWFjaChpdGVtID0+IGl0ZW0udmVydGV4KCkpO1xuICAgIH07XG5cbiAgICAvLyBTaGFwZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5TaGFwZSwgKGRyYXdlciwgc2hhcGUpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZWdpblNoYXBlKCk7XG4gICAgICBzaGFwZS5vdXRsaW5lLnZlcnRleCgpO1xuXG4gICAgICBpZiAoc2hhcGUuY29udG91ci5pc05vdEVtcHR5KCkpIHtcbiAgICAgICAgZHJhd2VyLnA1LmJlZ2luQ29udG91cigpO1xuICAgICAgICBzaGFwZS5jb250b3VyLnZlcnRleCgpO1xuICAgICAgICBkcmF3ZXIucDUuZW5kQ29udG91cigpO1xuICAgICAgfVxuICAgICAgZHJhd2VyLnA1LmVuZFNoYXBlKCk7XG4gICAgfSk7XG5cbiAgICBSYWMuU2hhcGUucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vdXRsaW5lLnZlcnRleCgpO1xuICAgICAgdGhpcy5jb250b3VyLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBUZXh0XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlRleHQsIChkcmF3ZXIsIHRleHQpID0+IHtcbiAgICAgIHRleHQuZm9ybWF0LmFwcGx5KHRleHQucG9pbnQpO1xuICAgICAgZHJhd2VyLnA1LnRleHQodGV4dC5zdHJpbmcsIDAsIDApO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0RHJhd09wdGlvbnMoUmFjLlRleHQsIHtyZXF1aXJlc1B1c2hQb3A6IHRydWV9KTtcblxuICAgIC8vIEFwcGxpZXMgYWxsIHRleHQgcHJvcGVydGllcyBhbmQgdHJhbnNsYXRlcyB0byB0aGUgZ2l2ZW4gYHBvaW50YC5cbiAgICAvLyBBZnRlciB0aGUgZm9ybWF0IGlzIGFwcGxpZWQgdGhlIHRleHQgc2hvdWxkIGJlIGRyYXduIGF0IHRoZSBvcmlnaW4uXG4gICAgUmFjLlRleHQuRm9ybWF0LnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICBsZXQgaEFsaWduO1xuICAgICAgbGV0IGhPcHRpb25zID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWw7XG4gICAgICBzd2l0Y2ggKHRoaXMuaG9yaXpvbnRhbCkge1xuICAgICAgICBjYXNlIGhPcHRpb25zLmxlZnQ6ICAgaEFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkxFRlQ7ICAgYnJlYWs7XG4gICAgICAgIGNhc2UgaE9wdGlvbnMuY2VudGVyOiBoQWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQ0VOVEVSOyBicmVhaztcbiAgICAgICAgY2FzZSBoT3B0aW9ucy5yaWdodDogIGhBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5SSUdIVDsgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgaG9yaXpvbnRhbCBjb25maWd1cmF0aW9uIC0gaG9yaXpvbnRhbDoke3RoaXMuaG9yaXpvbnRhbH1gKTtcbiAgICAgICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgICB9XG5cbiAgICAgIGxldCB2QWxpZ247XG4gICAgICBsZXQgdk9wdGlvbnMgPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWw7XG4gICAgICBzd2l0Y2ggKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgY2FzZSB2T3B0aW9ucy50b3A6ICAgICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LlRPUDsgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB2T3B0aW9ucy5ib3R0b206ICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkJPVFRPTTsgICBicmVhaztcbiAgICAgICAgY2FzZSB2T3B0aW9ucy5jZW50ZXI6ICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkNFTlRFUjsgICBicmVhaztcbiAgICAgICAgY2FzZSB2T3B0aW9ucy5iYXNlbGluZTogdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkJBU0VMSU5FOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHZlcnRpY2FsIGNvbmZpZ3VyYXRpb24gLSB2ZXJ0aWNhbDoke3RoaXMudmVydGljYWx9YCk7XG4gICAgICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgICAgfVxuXG4gICAgICAvLyBUZXh0IHByb3BlcnRpZXNcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50ZXh0QWxpZ24oaEFsaWduLCB2QWxpZ24pO1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRleHRTaXplKHRoaXMuc2l6ZSk7XG4gICAgICBpZiAodGhpcy5mb250ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50ZXh0Rm9udCh0aGlzLmZvbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBQb3NpdGlvbmluZ1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRyYW5zbGF0ZShwb2ludC54LCBwb2ludC55KTtcbiAgICAgIGlmICh0aGlzLmFuZ2xlLnR1cm4gIT0gMCkge1xuICAgICAgICB0aGlzLnJhYy5kcmF3ZXIucDUucm90YXRlKHRoaXMuYW5nbGUucmFkaWFucygpKTtcbiAgICAgIH1cbiAgICB9IC8vIFJhYy5UZXh0LkZvcm1hdC5wcm90b3R5cGUuYXBwbHlcblxuICB9IC8vIHNldHVwQWxsRHJhd0Z1bmN0aW9uc1xuXG5cbiAgLy8gU2V0cyB1cCBhbGwgZGVidWcgcm91dGluZXMgZm9yIHJhYyBkcmF3YWJsZSBjbGFzZXMuXG4gIHNldHVwQWxsRGVidWdGdW5jdGlvbnMoKSB7XG4gICAgbGV0IGZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vZGVidWcuZnVuY3Rpb25zJyk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5Qb2ludCwgZnVuY3Rpb25zLmRlYnVnUG9pbnQpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuUmF5LCBmdW5jdGlvbnMuZGVidWdSYXkpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRlYnVnU2VnbWVudCk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5BcmMsIGZ1bmN0aW9ucy5kZWJ1Z0FyYyk7XG5cbiAgICBSYWMuQW5nbGUucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24ocG9pbnQsIGRyYXdzVGV4dCA9IGZhbHNlKSB7XG4gICAgICBjb25zdCBkcmF3ZXIgPSB0aGlzLnJhYy5kcmF3ZXI7XG4gICAgICBpZiAoZHJhd2VyLmRlYnVnU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1LnB1c2goKTtcbiAgICAgICAgZHJhd2VyLmRlYnVnU3R5bGUuYXBwbHkoKTtcbiAgICAgICAgLy8gVE9ETzogY291bGQgdGhpcyBiZSBhIGdvb2Qgb3B0aW9uIHRvIGltcGxlbWVudCBzcGxhdHRpbmcgYXJndW1lbnRzXG4gICAgICAgIC8vIGludG8gdGhlIGRlYnVnRnVuY3Rpb24/XG4gICAgICAgIGZ1bmN0aW9ucy5kZWJ1Z0FuZ2xlKGRyYXdlciwgdGhpcywgcG9pbnQsIGRyYXdzVGV4dCk7XG4gICAgICAgIGRyYXdlci5wNS5wb3AoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bmN0aW9ucy5kZWJ1Z0FuZ2xlKGRyYXdlciwgdGhpcywgcG9pbnQsIGRyYXdzVGV4dCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFJhYy5Qb2ludC5wcm90b3R5cGUuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGFuZ2xlLCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICAgIGFuZ2xlLmRlYnVnKHRoaXMsIGRyYXdzVGV4dCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9IC8vIHNldHVwQWxsRGVidWdGdW5jdGlvbnNcblxuXG4gIC8vIFNldHMgdXAgYWxsIGFwcGx5aW5nIHJvdXRpbmVzIGZvciByYWMgc3R5bGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGZ1bmN0aW9ucyBpbiByZWxldmFudCBjbGFzc2VzLlxuICBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zKCkge1xuICAgIC8vIENvbG9yIHByb3RvdHlwZSBmdW5jdGlvbnNcbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5QmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmJhY2tncm91bmQodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSk7XG4gICAgfTtcblxuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlGaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuZmlsbCh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1LCB0aGlzLmEgKiAyNTUpO1xuICAgIH07XG5cbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5U3Ryb2tlID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuc3Ryb2tlKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUsIHRoaXMuYSAqIDI1NSk7XG4gICAgfTtcblxuICAgIC8vIFN0cm9rZVxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuU3Ryb2tlLCAoZHJhd2VyLCBzdHJva2UpID0+IHtcbiAgICAgIGlmIChzdHJva2Uud2VpZ2h0ID09PSBudWxsICYmIHN0cm9rZS5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUubm9TdHJva2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLmNvbG9yICE9PSBudWxsKSB7XG4gICAgICAgIHN0cm9rZS5jb2xvci5hcHBseVN0cm9rZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLndlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUuc3Ryb2tlV2VpZ2h0KHN0cm9rZS53ZWlnaHQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRmlsbFxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuRmlsbCwgKGRyYXdlciwgZmlsbCkgPT4ge1xuICAgICAgaWYgKGZpbGwuY29sb3IgPT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1Lm5vRmlsbCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZpbGwuY29sb3IuYXBwbHlGaWxsKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdHlsZVxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuU3R5bGUsIChkcmF3ZXIsIHN0eWxlKSA9PiB7XG4gICAgICBpZiAoc3R5bGUuc3Ryb2tlICE9PSBudWxsKSB7XG4gICAgICAgIHN0eWxlLnN0cm9rZS5hcHBseSgpO1xuICAgICAgfVxuICAgICAgaWYgKHN0eWxlLmZpbGwgIT09IG51bGwpIHtcbiAgICAgICAgc3R5bGUuZmlsbC5hcHBseSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgUmFjLlN0eWxlLnByb3RvdHlwZS5hcHBseVRvQ2xhc3MgPSBmdW5jdGlvbihjbGFzc09iaikge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnNldENsYXNzRHJhd1N0eWxlKGNsYXNzT2JqLCB0aGlzKTtcbiAgICB9XG5cbiAgfSAvLyBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zXG5cbn0gLy8gY2xhc3MgUDVEcmF3ZXJcblxubW9kdWxlLmV4cG9ydHMgPSBQNURyYXdlcjtcblxuXG4vLyBFbmNhcHN1bGF0ZXMgdGhlIGRyYXdpbmcgZnVuY3Rpb24gYW5kIG9wdGlvbnMgZm9yIGEgc3BlY2lmaWMgY2xhc3MuXG4vLyBUaGUgZHJhdyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0d28gcGFyYW1ldGVyczogdGhlIGluc3RhbmNlIG9mIHRoZVxuLy8gZHJhd2VyLCBhbmQgdGhlIG9iamVjdCB0byBkcmF3LlxuLy9cbi8vIE9wdGlvbmFsbHkgYSBgc3R5bGVgIGNhbiBiZSBhc2lnbmVkIHRvIGFsd2F5cyBiZSBhcHBsaWVkIGJlZm9yZVxuLy8gZHJhd2luZyBhbiBpbnN0YW5jZSBvZiB0aGUgYXNzb2NpYXRlZCBjbGFzcy4gVGhpcyBzdHlsZSB3aWxsIGJlXG4vLyBhcHBsaWVkIGJlZm9yZSBhbnkgc3R5bGVzIHByb3ZpZGVkIHRvIHRoZSBgZHJhd2AgZnVuY3Rpb24uXG4vL1xuLy8gT3B0aW9uYWxseSBgcmVxdWlyZXNQdXNoUG9wYCBjYW4gYmUgc2V0IHRvIGB0cnVlYCB0byBhbHdheXMgcGVmb3JtXG4vLyBhIGBwdXNoYCBhbmQgYHBvcGAgYmVmb3JlIGFuZCBhZnRlciBhbGwgdGhlIHN0eWxlIGFuZCBkcmF3aW5nIGluXG4vLyB0aGUgcm91dGluZS4gVGhpcyBpcyBpbnRlbmRlZCBmb3Igb2JqZWN0cyB3aGljaCBkcmF3aW5nIG9wZXJhdGlvbnNcbi8vIG1heSBuZWVkIHRvIHB1c2ggdHJhbnNmb3JtYXRpb24gdG8gdGhlIHN0YWNrLlxuY2xhc3MgRHJhd1JvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGRyYXdGdW5jdGlvbikge1xuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcbiAgICB0aGlzLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcblxuICAgIC8vIE9wdGlvbnNcbiAgICB0aGlzLnJlcXVpcmVzUHVzaFBvcCA9IGZhbHNlO1xuICB9XG59IC8vIERyYXdSb3V0aW5lXG5cblxuY2xhc3MgRGVidWdSb3V0aW5lIHtcbiAgY29uc3RydWN0b3IgKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuICAgIHRoaXMuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gIH1cbn1cblxuXG5jbGFzcyBBcHBseVJvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG4gICAgdGhpcy5hcHBseUZ1bmN0aW9uID0gYXBwbHlGdW5jdGlvbjtcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFBvaW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIHRvIHJlcHJlc2VudCB0aGlzIGBQb2ludGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5Qb2ludC5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqL1xuICBSYWMuUG9pbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLmRyYXdlci5wNS52ZXJ0ZXgodGhpcy54LCB0aGlzLnkpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyLlxuICAqXG4gICogQWRkZWQgdG8gYGluc3RhbmNlLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gcG9pbnRlclxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LnBvaW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUubW91c2VYLCByYWMuZHJhd2VyLnA1Lm1vdXNlWSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAqXG4gICogQWRkZWQgdG8gYGluc3RhbmNlLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQ2VudGVyXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuY2FudmFzQ2VudGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLzIsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0LzIpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBlbmQgb2YgdGhlIGNhbnZhcywgdGhhdCBpcywgYXQgdGhlIHBvc2l0aW9uXG4gICogYCh3aWR0aCxoZWlnaHQpYC5cbiAgKlxuICAqIEFkZGVkIHRvIGBpbnN0YW5jZS5Qb2ludGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0VuZFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LmNhbnZhc0VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG59IC8vIGF0dGFjaFBvaW50RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmF5RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSByYXkgdG91Y2hlcyB0aGUgY2FudmFzIGVkZ2UuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCBgbnVsbGAgaXNcbiAgKiByZXR1cm5lZC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqIEByZXR1cm5zIHs/UmFjLlBvaW50fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5wb2ludEF0Q2FudmFzRWRnZSA9IGZ1bmN0aW9uKG1hcmdpbiA9IDApIHtcbiAgICBsZXQgZWRnZVJheSA9IHRoaXMucmF5QXRDYW52YXNFZGdlKG1hcmdpbik7XG4gICAgaWYgKGVkZ2VSYXkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkZ2VSYXkuc3RhcnQ7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRoYXQgc3RhcnRzIGF0IHRoZSBwb2ludCB3aGVyZSB0aGUgYHRoaXNgIHRvdWNoZXNcbiAgKiB0aGUgY2FudmFzIGVkZ2UgYW5kIHBvaW50ZWQgdG93YXJkcyB0aGUgaW5zaWRlIG9mIHRoZSBjYW52YXMuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCBgbnVsbGAgaXNcbiAgKiByZXR1cm5lZC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMgez9SYWMuUmF5fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5yYXlBdENhbnZhc0VkZ2UgPSBmdW5jdGlvbihtYXJnaW4gPSAwKSB7XG4gICAgY29uc3QgdHVybiA9IHRoaXMuYW5nbGUudHVybjtcbiAgICBjb25zdCBwNSA9IHRoaXMucmFjLmRyYXdlci5wNTtcblxuICAgIGNvbnN0IGRvd25FZGdlICA9IHA1LmhlaWdodCAtIG1hcmdpbjtcbiAgICBjb25zdCBsZWZ0RWRnZSAgPSBtYXJnaW47XG4gICAgY29uc3QgdXBFZGdlICAgID0gbWFyZ2luO1xuICAgIGNvbnN0IHJpZ2h0RWRnZSA9IHA1LndpZHRoIC0gbWFyZ2luO1xuXG4gICAgLy8gcG9pbnRpbmcgZG93blxuICAgIGlmICh0dXJuID49IDEvOCAmJiB0dXJuIDwgMy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55IDwgZG93bkVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChyaWdodEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5sZWZ0KTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKGxlZnRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUucmlnaHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyBsZWZ0XG4gICAgaWYgKHR1cm4gPj0gMy84ICYmIHR1cm4gPCA1LzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnggPj0gbGVmdEVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnkgPiBkb3duRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKGRvd25FZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUudXApO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueSA8IHVwRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKHVwRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmRvd24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyB1cFxuICAgIGlmICh0dXJuID49IDUvOCAmJiB0dXJuIDwgNy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55ID49IHVwRWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WSh1cEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5kb3duKTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIHJpZ2h0XG4gICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgIGlmICh0aGlzLnN0YXJ0LnggPCByaWdodEVkZ2UpIHtcbiAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueSA+IGRvd25FZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC55IDwgdXBFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkodXBFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUuZG93bik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVkZ2VSYXk7XG4gIH07XG5cbn0gLy8gYXR0YWNoUmF5RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoU2VnbWVudEZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDYWxscyBgcDUudmVydGV4YCB0byByZXByZXNlbnQgdGhpcyBgU2VnbWVudGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5TZWdtZW50LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICovXG4gIFJhYy5TZWdtZW50LnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXJ0UG9pbnQoKS52ZXJ0ZXgoKTtcbiAgICB0aGlzLmVuZFBvaW50KCkudmVydGV4KCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSB0b3Agb2YgdGhlIGNhbnZhcywgZnJvbSB0b3AtbGVmdCB0b1xuICAqIHRvcC1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzVG9wXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnRcbiAgKiB0byBib3R0b20tbGVmdC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzTGVmdFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNMZWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLXJpZ2h0XG4gICogdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGBpbnN0YW5jZS5TZWdtZW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNSaWdodFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHRvcFJpZ2h0ID0gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUud2lkdGgsIDApO1xuICAgIHJldHVybiB0b3BSaWdodFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5kb3duLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhcywgZnJvbVxuICAqIGJvdHRvbS1sZWZ0IHRvIGJvdHRvbS1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQm90dG9tXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc0JvdHRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBib3R0b21MZWZ0ID0gcmFjLlBvaW50KDAsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgICByZXR1cm4gYm90dG9tTGVmdFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuXG59IC8vIGF0dGFjaFNlZ21lbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbmZ1bmN0aW9uIHJldmVyc2VzVGV4dChhbmdsZSkge1xuICByZXR1cm4gYW5nbGUudHVybiA8IDMvNCAmJiBhbmdsZS50dXJuID49IDEvNDtcbn1cblxuXG5leHBvcnRzLmRlYnVnQW5nbGUgPSBmdW5jdGlvbihkcmF3ZXIsIGFuZ2xlLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9IGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcblxuICAvLyBaZXJvIHNlZ21lbnRcbiAgcG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLnplcm8sIG1hcmtlclJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIEFuZ2xlIHNlZ21lbnRcbiAgbGV0IGFuZ2xlU2VnbWVudCA9IHBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKGFuZ2xlLCBtYXJrZXJSYWRpdXMgKiAxLjUpO1xuICBhbmdsZVNlZ21lbnQuZW5kUG9pbnQoKVxuICAgIC5hcmMocG9pbnRSYWRpdXMsIGFuZ2xlLCBhbmdsZS5pbnZlcnNlKCksIGZhbHNlKVxuICAgIC5kcmF3KCk7XG4gIGFuZ2xlU2VnbWVudFxuICAgIC53aXRoTGVuZ3RoQWRkKHBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gTWluaSBhcmMgbWFya2Vyc1xuICBsZXQgYW5nbGVBcmMgPSBwb2ludC5hcmMobWFya2VyUmFkaXVzLCByYWMuQW5nbGUuemVybywgYW5nbGUpO1xuICBsZXQgY29udGV4dCA9IGRyYXdlci5wNS5kcmF3aW5nQ29udGV4dDtcbiAgbGV0IHN0cm9rZVdlaWdodCA9IGNvbnRleHQubGluZVdpZHRoO1xuICBjb250ZXh0LnNhdmUoKTsge1xuICAgIGNvbnRleHQubGluZUNhcCA9ICdidXR0JztcbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFs2LCA0XSk7XG4gICAgLy8gQW5nbGUgYXJjXG4gICAgYW5nbGVBcmMuZHJhdygpO1xuXG4gICAgaWYgKCFhbmdsZUFyYy5pc0NpcmNsZSgpKSB7XG4gICAgICAvLyBPdXRzaWRlIGFuZ2xlIGFyY1xuICAgICAgY29udGV4dC5zZXRMaW5lRGFzaChbMiwgNF0pO1xuICAgICAgYW5nbGVBcmNcbiAgICAgICAgLndpdGhSYWRpdXMobWFya2VyUmFkaXVzKjMvNClcbiAgICAgICAgLndpdGhDbG9ja3dpc2UoZmFsc2UpXG4gICAgICAgIC5kcmF3KCk7XG4gICAgfVxuICB9O1xuICBjb250ZXh0LnJlc3RvcmUoKTtcblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgLy8gTm9ybWFsIG9yaWVudGF0aW9uXG4gIGxldCBmb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbC5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbC5jZW50ZXIsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgaWYgKHJldmVyc2VzVGV4dChhbmdsZSkpIHtcbiAgICAvLyBSZXZlcnNlIG9yaWVudGF0aW9uXG4gICAgZm9ybWF0ID0gZm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIC8vIFR1cm4gdGV4dFxuICBsZXQgdHVyblN0cmluZyA9IGB0dXJuOiR7ZHJhd2VyLmRlYnVnTnVtYmVyKGFuZ2xlLnR1cm4pfWA7XG4gIHBvaW50XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgbWFya2VyUmFkaXVzKjIpXG4gICAgLnRleHQodHVyblN0cmluZywgZm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z0FuZ2xlXG5cblxuZXhwb3J0cy5kZWJ1Z1BvaW50ID0gZnVuY3Rpb24oZHJhd2VyLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9IGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcblxuICBwb2ludC5kcmF3KCk7XG5cbiAgLy8gUG9pbnQgbWFya2VyXG4gIHBvaW50LmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuXG4gIC8vIFBvaW50IHJldGljdWxlIG1hcmtlclxuICBsZXQgYXJjID0gcG9pbnRcbiAgICAuYXJjKG1hcmtlclJhZGl1cywgcmFjLkFuZ2xlLnMsIHJhYy5BbmdsZS5lKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDEvMilcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMS8yKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBzdHJpbmcgPSBgeDoke2RyYXdlci5kZWJ1Z051bWJlcihwb2ludC54KX1cXG55OiR7ZHJhd2VyLmRlYnVnTnVtYmVyKHBvaW50LnkpfWA7XG4gIGxldCBmb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbC5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbC50b3AsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICByYWMuQW5nbGUuZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgcG9pbnRcbiAgICAucG9pbnRUb0FuZ2xlKHJhYy5BbmdsZS5zZSwgcG9pbnRSYWRpdXMqMilcbiAgICAudGV4dChzdHJpbmcsIGZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdQb2ludFxuXG5cbmV4cG9ydHMuZGVidWdSYXkgPSBmdW5jdGlvbihkcmF3ZXIsIHJheSwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9IGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcblxuICByYXkuZHJhdygpO1xuXG4gIC8vIExpdHRsZSBjaXJjbGUgYXQgc3RhcnQgbWFya2VyXG4gIHJheS5zdGFydC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBhdCBzdGFydFxuICBjb25zdCBwZXJwQW5nbGUgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICBjb25zdCBzdGFydEFyYyA9IHJheS5zdGFydFxuICAgIC5hcmMobWFya2VyUmFkaXVzLCBwZXJwQW5nbGUsIHBlcnBBbmdsZS5pbnZlcnNlKCkpXG4gICAgLmRyYXcoKTtcbiAgc3RhcnRBcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgc3RhcnRBcmMuZW5kU2VnbWVudCgpLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRWRnZSBlbmQgaGFsZiBjaXJjbGVcbiAgY29uc3QgZWRnZVJheSA9IHJheS5yYXlBdENhbnZhc0VkZ2UoKTtcbiAgaWYgKGVkZ2VSYXkgIT0gbnVsbCkge1xuICAgIGNvbnN0IGVkZ2VBcmMgPSBlZGdlUmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZShwb2ludFJhZGl1cylcbiAgICAgIC5wZXJwZW5kaWN1bGFyKGZhbHNlKVxuICAgICAgLmFyY1RvQW5nbGVEaXN0YW5jZShtYXJrZXJSYWRpdXMvMiwgMC41KVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLnN0YXJ0U2VnbWVudCgpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gICAgZWRnZUFyYy5lbmRTZWdtZW50KClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLnJhZGl1c1NlZ21lbnRBdEFuZ2xlKGVkZ2VSYXkuYW5nbGUpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgY29uc3QgYW5nbGUgID0gcmF5LmFuZ2xlO1xuICBjb25zdCBoRm9ybWF0ID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWw7XG4gIGNvbnN0IHZGb3JtYXQgPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWw7XG4gIGNvbnN0IGZvbnQgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQ7XG4gIGNvbnN0IHNpemUgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemU7XG4gIGNvbnN0IGRpZ2l0cyA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgc3RhcnRGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYyxcbiAgICBoRm9ybWF0LmxlZnQsIHZGb3JtYXQuYm90dG9tLFxuICAgIGZvbnQsIGFuZ2xlLCBzaXplKTtcbiAgbGV0IGFuZ2xlRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChyYWMsXG4gICAgaEZvcm1hdC5sZWZ0LCB2Rm9ybWF0LnRvcCxcbiAgICBmb250LCBhbmdsZSwgc2l6ZSk7XG4gIGlmIChyZXZlcnNlc1RleHQoYW5nbGUpKSB7XG4gICAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICAgIHN0YXJ0Rm9ybWF0ID0gc3RhcnRGb3JtYXQuaW52ZXJzZSgpO1xuICAgIGFuZ2xlRm9ybWF0ID0gYW5nbGVGb3JtYXQuaW52ZXJzZSgpO1xuICB9XG5cbiAgLy8gU3RhcnQgdGV4dFxuICBjb25zdCBzdGFydFN0cmluZyA9IGBzdGFydDooJHtyYXkuc3RhcnQueC50b0ZpeGVkKGRpZ2l0cyl9LCR7cmF5LnN0YXJ0LnkudG9GaXhlZChkaWdpdHMpfSlgO1xuICByYXkuc3RhcnRcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLnN1YnRyYWN0KDEvNCksIG1hcmtlclJhZGl1cy8yKVxuICAgIC50ZXh0KHN0YXJ0U3RyaW5nLCBzdGFydEZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuXG4gIC8vIEFuZ2xlIHRleHRcbiAgY29uc3QgYW5nbGVTdHJpbmcgPSBgYW5nbGU6JHthbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICByYXkuc3RhcnRcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLmFkZCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChhbmdsZVN0cmluZywgYW5nbGVGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnUmF5XG5cblxuZXhwb3J0cy5kZWJ1Z1NlZ21lbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHNlZ21lbnQsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9IGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG5cbiAgc2VnbWVudC5kcmF3KCk7XG5cbiAgLy8gTGl0dGxlIGNpcmNsZSBhdCBzdGFydCBtYXJrZXJcbiAgc2VnbWVudC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgIC5hcmMoKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gSGFsZiBjaXJjbGUgc3RhcnQgc2VnbWVudFxuICBsZXQgcGVycEFuZ2xlID0gc2VnbWVudC5hbmdsZSgpLnBlcnBlbmRpY3VsYXIoKTtcbiAgbGV0IGFyYyA9IHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHBlcnBBbmdsZSwgcGVycEFuZ2xlLmludmVyc2UoKSlcbiAgICAuZHJhdygpO1xuICBhcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgYXJjLmVuZFNlZ21lbnQoKVxuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIFBlcnBlbmRpY3VsYXIgZW5kIG1hcmtlclxuICBsZXQgZW5kTWFya2VyU3RhcnQgPSBzZWdtZW50XG4gICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcigpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuZGVkKC1wb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuICBsZXQgZW5kTWFya2VyRW5kID0gc2VnbWVudFxuICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoZmFsc2UpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuZGVkKC1wb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuICAvLyBMaXR0bGUgZW5kIGhhbGYgY2lyY2xlXG4gIHNlZ21lbnQuZW5kUG9pbnQoKVxuICAgIC5hcmMocG9pbnRSYWRpdXMsIGVuZE1hcmtlclN0YXJ0LmFuZ2xlKCksIGVuZE1hcmtlckVuZC5hbmdsZSgpKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRm9ybWluZyBlbmQgYXJyb3dcbiAgbGV0IGFycm93QW5nbGVTaGlmdCA9IHJhYy5BbmdsZS5mcm9tKDEvNyk7XG4gIGxldCBlbmRBcnJvd1N0YXJ0ID0gZW5kTWFya2VyU3RhcnRcbiAgICAucmV2ZXJzZSgpXG4gICAgLnJheS53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlU2hpZnQsIGZhbHNlKTtcbiAgbGV0IGVuZEFycm93RW5kID0gZW5kTWFya2VyRW5kXG4gICAgLnJldmVyc2UoKVxuICAgIC5yYXkud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZVNoaWZ0LCB0cnVlKTtcbiAgbGV0IGVuZEFycm93UG9pbnQgPSBlbmRBcnJvd1N0YXJ0XG4gICAgLnBvaW50QXRJbnRlcnNlY3Rpb24oZW5kQXJyb3dFbmQpO1xuICAvLyBFbmQgYXJyb3dcbiAgZW5kTWFya2VyU3RhcnRcbiAgICAubmV4dFNlZ21lbnRUb1BvaW50KGVuZEFycm93UG9pbnQpXG4gICAgLmRyYXcoKVxuICAgIC5uZXh0U2VnbWVudFRvUG9pbnQoZW5kTWFya2VyRW5kLmVuZFBvaW50KCkpXG4gICAgLmRyYXcoKTtcblxuXG4gIC8vIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICBsZXQgYW5nbGUgPSBzZWdtZW50LmFuZ2xlKCk7XG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgbGVuZ3RoRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWwubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWwuYm90dG9tLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgYW5nbGUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG4gIGxldCBhbmdsZUZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsLnRvcCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBsZW5ndGhGb3JtYXQgPSBsZW5ndGhGb3JtYXQuaW52ZXJzZSgpO1xuICAgIGFuZ2xlRm9ybWF0ID0gYW5nbGVGb3JtYXQuaW52ZXJzZSgpO1xuICB9XG5cbiAgLy8gTGVuZ3RoXG4gIGxldCBsZW5ndGhTdHJpbmcgPSBgbGVuZ3RoOiR7ZHJhd2VyLmRlYnVnTnVtYmVyKHNlZ21lbnQubGVuZ3RoKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIHBvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuc3VidHJhY3QoMS80KSwgbWFya2VyUmFkaXVzLzIpXG4gICAgLnRleHQobGVuZ3RoU3RyaW5nLCBsZW5ndGhGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAgIC8vIEFuZ2xlXG4gIGxldCBhbmdsZVN0cmluZyA9IGBhbmdsZToke2RyYXdlci5kZWJ1Z051bWJlcihhbmdsZS50dXJuKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIHBvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuYWRkKDEvNCksIG1hcmtlclJhZGl1cy8yKVxuICAgIC50ZXh0KGFuZ2xlU3RyaW5nLCBhbmdsZUZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdTZWdtZW50XG5cblxuZXhwb3J0cy5kZWJ1Z0FyYyA9IGZ1bmN0aW9uKGRyYXdlciwgYXJjLCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuXG4gIGFyYy5kcmF3KCk7XG5cbiAgLy8gQ2VudGVyIG1hcmtlcnNcbiAgbGV0IGNlbnRlckFyY1JhZGl1cyA9IG1hcmtlclJhZGl1cyAqIDIvMztcbiAgaWYgKGFyYy5yYWRpdXMgPiBtYXJrZXJSYWRpdXMvMyAmJiBhcmMucmFkaXVzIDwgbWFya2VyUmFkaXVzKSB7XG4gICAgLy8gSWYgcmFkaXVzIGlzIHRvIGNsb3NlIHRvIHRoZSBjZW50ZXItYXJjIG1hcmtlcnNcbiAgICAvLyBNYWtlIHRoZSBjZW50ZXItYXJjIGJlIG91dHNpZGUgb2YgdGhlIGFyY1xuICAgIGNlbnRlckFyY1JhZGl1cyA9IGFyYy5yYWRpdXMgKyBtYXJrZXJSYWRpdXMvMztcbiAgfVxuXG4gIC8vIENlbnRlciBzdGFydCBzZWdtZW50XG4gIGxldCBjZW50ZXJBcmMgPSBhcmMud2l0aFJhZGl1cyhjZW50ZXJBcmNSYWRpdXMpO1xuICBjZW50ZXJBcmMuc3RhcnRTZWdtZW50KCkuZHJhdygpO1xuXG4gIC8vIFJhZGl1c1xuICBsZXQgcmFkaXVzTWFya2VyTGVuZ3RoID0gYXJjLnJhZGl1c1xuICAgIC0gY2VudGVyQXJjUmFkaXVzXG4gICAgLSBtYXJrZXJSYWRpdXMvMlxuICAgIC0gcG9pbnRSYWRpdXMqMjtcbiAgaWYgKHJhZGl1c01hcmtlckxlbmd0aCA+IDApIHtcbiAgICBhcmMuc3RhcnRTZWdtZW50KClcbiAgICAgIC53aXRoTGVuZ3RoKHJhZGl1c01hcmtlckxlbmd0aClcbiAgICAgIC50cmFuc2xhdGVUb0xlbmd0aChjZW50ZXJBcmNSYWRpdXMgKyBwb2ludFJhZGl1cyoyKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIE1pbmkgYXJjIG1hcmtlcnNcbiAgbGV0IGNvbnRleHQgPSBkcmF3ZXIucDUuZHJhd2luZ0NvbnRleHQ7XG4gIGxldCBzdHJva2VXZWlnaHQgPSBjb250ZXh0LmxpbmVXaWR0aDtcbiAgY29udGV4dC5zYXZlKCk7IHtcbiAgICBjb250ZXh0LmxpbmVDYXAgPSAnYnV0dCc7XG4gICAgY29udGV4dC5zZXRMaW5lRGFzaChbNiwgNF0pO1xuICAgIGNlbnRlckFyYy5kcmF3KCk7XG5cbiAgICBpZiAoIWNlbnRlckFyYy5pc0NpcmNsZSgpKSB7XG4gICAgICAvLyBPdXRzaWRlIGFuZ2xlIGFyY1xuICAgICAgY29udGV4dC5zZXRMaW5lRGFzaChbMiwgNF0pO1xuICAgICAgY2VudGVyQXJjXG4gICAgICAgIC53aXRoQ2xvY2t3aXNlKCFjZW50ZXJBcmMuY2xvY2t3aXNlKVxuICAgICAgICAuZHJhdygpO1xuICAgIH1cbiAgfTtcbiAgY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgLy8gQ2VudGVyIGVuZCBzZWdtZW50XG4gIGlmICghYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBjZW50ZXJBcmMuZW5kU2VnbWVudCgpLnJldmVyc2UoKS53aXRoTGVuZ3RoUmF0aW8oMS8yKS5kcmF3KCk7XG4gIH1cblxuICAvLyBTdGFydCBwb2ludCBtYXJrZXJcbiAgbGV0IHN0YXJ0UG9pbnQgPSBhcmMuc3RhcnRQb2ludCgpO1xuICBzdGFydFBvaW50XG4gICAgLmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuICBzdGFydFBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzKVxuICAgIC53aXRoU3RhcnRFeHRlbmRlZCgtbWFya2VyUmFkaXVzLzIpXG4gICAgLmRyYXcoKTtcblxuICAvLyBPcmllbnRhdGlvbiBtYXJrZXJcbiAgbGV0IG9yaWVudGF0aW9uTGVuZ3RoID0gbWFya2VyUmFkaXVzKjI7XG4gIGxldCBvcmllbnRhdGlvbkFyYyA9IGFyY1xuICAgIC5zdGFydFNlZ21lbnQoKVxuICAgIC53aXRoTGVuZ3RoQWRkKG1hcmtlclJhZGl1cylcbiAgICAuYXJjKG51bGwsIGFyYy5jbG9ja3dpc2UpXG4gICAgLndpdGhMZW5ndGgob3JpZW50YXRpb25MZW5ndGgpXG4gICAgLmRyYXcoKTtcbiAgbGV0IGFycm93Q2VudGVyID0gb3JpZW50YXRpb25BcmNcbiAgICAucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLmNob3JkU2VnbWVudCgpO1xuICBsZXQgYXJyb3dBbmdsZSA9IDMvMzI7XG4gIGFycm93Q2VudGVyLndpdGhBbmdsZVNoaWZ0KC1hcnJvd0FuZ2xlKS5kcmF3KCk7XG4gIGFycm93Q2VudGVyLndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGUpLmRyYXcoKTtcblxuICAvLyBJbnRlcm5hbCBlbmQgcG9pbnQgbWFya2VyXG4gIGxldCBlbmRQb2ludCA9IGFyYy5lbmRQb2ludCgpO1xuICBsZXQgaW50ZXJuYWxMZW5ndGggPSBNYXRoLm1pbihtYXJrZXJSYWRpdXMvMiwgYXJjLnJhZGl1cyk7XG4gIGludGVybmFsTGVuZ3RoIC09IHBvaW50UmFkaXVzO1xuICBpZiAoaW50ZXJuYWxMZW5ndGggPiByYWMuZXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICBlbmRQb2ludFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5lbmQuaW52ZXJzZSgpLCBpbnRlcm5hbExlbmd0aClcbiAgICAgIC50cmFuc2xhdGVUb0xlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBFeHRlcm5hbCBlbmQgcG9pbnQgbWFya2VyXG4gIGxldCB0ZXh0Sm9pblRocmVzaG9sZCA9IG1hcmtlclJhZGl1cyozO1xuICBsZXQgbGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA9IG9yaWVudGF0aW9uQXJjXG4gICAgLndpdGhFbmQoYXJjLmVuZClcbiAgICAubGVuZ3RoKCk7XG4gIGxldCBleHRlcm5hbExlbmd0aCA9IGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPiB0ZXh0Sm9pblRocmVzaG9sZCAmJiBkcmF3c1RleHQgPT09IHRydWVcbiAgICA/IG1hcmtlclJhZGl1cyAtIHBvaW50UmFkaXVzXG4gICAgOiBtYXJrZXJSYWRpdXMvMiAtIHBvaW50UmFkaXVzO1xuXG4gIGVuZFBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5lbmQsIGV4dGVybmFsTGVuZ3RoKVxuICAgIC50cmFuc2xhdGVUb0xlbmd0aChwb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIEVuZCBwb2ludCBsaXR0bGUgYXJjXG4gIGlmICghYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBlbmRQb2ludFxuICAgICAgLmFyYyhwb2ludFJhZGl1cywgYXJjLmVuZCwgYXJjLmVuZC5pbnZlcnNlKCksIGFyYy5jbG9ja3dpc2UpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBoRm9ybWF0ID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWw7XG4gIGxldCB2Rm9ybWF0ID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsO1xuXG4gIGxldCBoZWFkVmVydGljYWwgPSBhcmMuY2xvY2t3aXNlXG4gICAgPyB2Rm9ybWF0LnRvcFxuICAgIDogdkZvcm1hdC5ib3R0b207XG4gIGxldCB0YWlsVmVydGljYWwgPSBhcmMuY2xvY2t3aXNlXG4gICAgPyB2Rm9ybWF0LmJvdHRvbVxuICAgIDogdkZvcm1hdC50b3A7XG4gIGxldCByYWRpdXNWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZGb3JtYXQuYm90dG9tXG4gICAgOiB2Rm9ybWF0LnRvcDtcblxuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IGhlYWRGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBoRm9ybWF0LmxlZnQsXG4gICAgaGVhZFZlcnRpY2FsLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgYXJjLnN0YXJ0LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgdGFpbEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhGb3JtYXQubGVmdCxcbiAgICB0YWlsVmVydGljYWwsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhcmMuZW5kLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgcmFkaXVzRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgaEZvcm1hdC5sZWZ0LFxuICAgIHJhZGl1c1ZlcnRpY2FsLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgYXJjLnN0YXJ0LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuXG4gIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgaWYgKHJldmVyc2VzVGV4dChhcmMuc3RhcnQpKSB7XG4gICAgaGVhZEZvcm1hdCA9IGhlYWRGb3JtYXQuaW52ZXJzZSgpO1xuICAgIHJhZGl1c0Zvcm1hdCA9IHJhZGl1c0Zvcm1hdC5pbnZlcnNlKCk7XG4gIH1cbiAgaWYgKHJldmVyc2VzVGV4dChhcmMuZW5kKSkge1xuICAgIHRhaWxGb3JtYXQgPSB0YWlsRm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIGxldCBzdGFydFN0cmluZyA9IGBzdGFydDoke2RyYXdlci5kZWJ1Z051bWJlcihhcmMuc3RhcnQudHVybil9YDtcbiAgbGV0IHJhZGl1c1N0cmluZyA9IGByYWRpdXM6JHtkcmF3ZXIuZGVidWdOdW1iZXIoYXJjLnJhZGl1cyl9YDtcbiAgbGV0IGVuZFN0cmluZyA9IGBlbmQ6JHtkcmF3ZXIuZGVidWdOdW1iZXIoYXJjLmVuZC50dXJuKX1gO1xuXG4gIGxldCBhbmdsZURpc3RhbmNlID0gYXJjLmFuZ2xlRGlzdGFuY2UoKTtcbiAgbGV0IGRpc3RhbmNlU3RyaW5nID0gYGRpc3RhbmNlOiR7ZHJhd2VyLmRlYnVnTnVtYmVyKGFuZ2xlRGlzdGFuY2UudHVybil9YDtcblxuICBsZXQgdGFpbFN0cmluZyA9IGAke2Rpc3RhbmNlU3RyaW5nfVxcbiR7ZW5kU3RyaW5nfWA7XG4gIGxldCBoZWFkU3RyaW5nO1xuXG4gIC8vIFJhZGl1cyBsYWJlbFxuICBpZiAoYW5nbGVEaXN0YW5jZS50dXJuIDw9IDMvNCAmJiAhYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICAvLyBSYWRpdXMgZHJhd24gc2VwYXJhdGVseVxuICAgIGxldCBwZXJwQW5nbGUgPSBhcmMuc3RhcnQucGVycGVuZGljdWxhcighYXJjLmNsb2Nrd2lzZSk7XG4gICAgYXJjLmNlbnRlclxuICAgICAgLnBvaW50VG9BbmdsZShhcmMuc3RhcnQsIG1hcmtlclJhZGl1cylcbiAgICAgIC5wb2ludFRvQW5nbGUocGVycEFuZ2xlLCBwb2ludFJhZGl1cyoyKVxuICAgICAgLnRleHQocmFkaXVzU3RyaW5nLCByYWRpdXNGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICAgIGhlYWRTdHJpbmcgPSBzdGFydFN0cmluZztcbiAgfSBlbHNlIHtcbiAgICAvLyBSYWRpdXMgam9pbmVkIHRvIGhlYWRcbiAgICBoZWFkU3RyaW5nID0gYCR7c3RhcnRTdHJpbmd9XFxuJHtyYWRpdXNTdHJpbmd9YDtcbiAgfVxuXG4gIGlmIChsZW5ndGhBdE9yaWVudGF0aW9uQXJjID4gdGV4dEpvaW5UaHJlc2hvbGQpIHtcbiAgICAvLyBEcmF3IHN0cmluZ3Mgc2VwYXJhdGVseVxuICAgIG9yaWVudGF0aW9uQXJjLnN0YXJ0UG9pbnQoKVxuICAgICAgLnBvaW50VG9BbmdsZShhcmMuc3RhcnQsIG1hcmtlclJhZGl1cy8yKVxuICAgICAgLnRleHQoaGVhZFN0cmluZywgaGVhZEZvcm1hdClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gICAgb3JpZW50YXRpb25BcmMucG9pbnRBdEFuZ2xlKGFyYy5lbmQpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5lbmQsIG1hcmtlclJhZGl1cy8yKVxuICAgICAgLnRleHQodGFpbFN0cmluZywgdGFpbEZvcm1hdClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRHJhdyBzdHJpbmdzIHRvZ2V0aGVyXG4gICAgbGV0IGFsbFN0cmluZ3MgPSBgJHtoZWFkU3RyaW5nfVxcbiR7dGFpbFN0cmluZ31gO1xuICAgIG9yaWVudGF0aW9uQXJjLnN0YXJ0UG9pbnQoKVxuICAgICAgLnBvaW50VG9BbmdsZShhcmMuc3RhcnQsIG1hcmtlclJhZGl1cy8yKVxuICAgICAgLnRleHQoYWxsU3RyaW5ncywgaGVhZEZvcm1hdClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gIH1cbn07IC8vIGRlYnVnQXJjXG5cblxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBCZXppZXJcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgQ29tcG9zaXRlXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIFNoYXBlXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIFRleHRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbmV4cG9ydHMuZHJhd1BvaW50ID0gZnVuY3Rpb24oZHJhd2VyLCBwb2ludCkge1xuICBkcmF3ZXIucDUucG9pbnQocG9pbnQueCwgcG9pbnQueSk7XG59OyAvLyBkcmF3UG9pbnRcblxuXG5leHBvcnRzLmRyYXdSYXkgPSBmdW5jdGlvbihkcmF3ZXIsIHJheSkge1xuICBsZXQgZWRnZVBvaW50ID0gcmF5LnBvaW50QXRDYW52YXNFZGdlKCk7XG5cbiAgaWYgKGVkZ2VQb2ludCA9PT0gbnVsbCkge1xuICAgIC8vIFJheSBpcyBvdXRzaWRlIGNhbnZhc1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRyYXdlci5wNS5saW5lKFxuICAgIHJheS5zdGFydC54LCByYXkuc3RhcnQueSxcbiAgICBlZGdlUG9pbnQueCwgZWRnZVBvaW50LnkpO1xufTsgLy8gZHJhd1JheVxuXG5cbmV4cG9ydHMuZHJhd1NlZ21lbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHNlZ21lbnQpIHtcbiAgY29uc3Qgc3RhcnQgPSBzZWdtZW50LnJheS5zdGFydDtcbiAgY29uc3QgZW5kID0gc2VnbWVudC5lbmRQb2ludCgpO1xuICBkcmF3ZXIucDUubGluZShcbiAgICBzdGFydC54LCBzdGFydC55LFxuICAgIGVuZC54LCAgIGVuZC55KTtcbn07IC8vIGRyYXdTZWdtZW50XG5cblxuZXhwb3J0cy5kcmF3QXJjID0gZnVuY3Rpb24oZHJhd2VyLCBhcmMpIHtcbiAgaWYgKGFyYy5pc0NpcmNsZSgpKSB7XG4gICAgbGV0IHN0YXJ0UmFkID0gYXJjLnN0YXJ0LnJhZGlhbnMoKTtcbiAgICBsZXQgZW5kUmFkID0gc3RhcnRSYWQgKyBSYWMuVEFVO1xuICAgIGRyYXdlci5wNS5hcmMoXG4gICAgICBhcmMuY2VudGVyLngsIGFyYy5jZW50ZXIueSxcbiAgICAgIGFyYy5yYWRpdXMgKiAyLCBhcmMucmFkaXVzICogMixcbiAgICAgIHN0YXJ0UmFkLCBlbmRSYWQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBzdGFydCA9IGFyYy5zdGFydDtcbiAgbGV0IGVuZCA9IGFyYy5lbmQ7XG4gIGlmICghYXJjLmNsb2Nrd2lzZSkge1xuICAgIHN0YXJ0ID0gYXJjLmVuZDtcbiAgICBlbmQgPSBhcmMuc3RhcnQ7XG4gIH1cblxuICBkcmF3ZXIucDUuYXJjKFxuICAgIGFyYy5jZW50ZXIueCwgYXJjLmNlbnRlci55LFxuICAgIGFyYy5yYWRpdXMgKiAyLCBhcmMucmFkaXVzICogMixcbiAgICBzdGFydC5yYWRpYW5zKCksIGVuZC5yYWRpYW5zKCkpO1xufTsgLy8gZHJhd0FyY1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29sb3Igd2l0aCBSQkdBIHZhbHVlcywgZWFjaCBvbmUgb24gdGhlICpbMCwxXSogcmFuZ2UuXG4qXG4qIEBhbGlhcyBSYWMuQ29sb3JcbiovXG5jbGFzcyBDb2xvciB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gVGhlIHJlZCBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBbYT0xXSAtIFRoZSBhbHBoYSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHIsIGcsIGIsIGEgPSAxKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgciwgZywgYiwgYSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHIsIGcsIGIsIGEpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSByZWQgY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuciA9IHI7XG5cbiAgICAvKipcbiAgICAqIFRoZSBncmVlbiBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5nID0gZztcblxuICAgIC8qKlxuICAgICogVGhlIGJsdWUgY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuYiA9IGI7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbHBoYSBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5hID0gYTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYENvbG9yKCR7dGhpcy5yfSwke3RoaXMuZ30sJHt0aGlzLmJ9LCR7dGhpcy5hfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2Ugd2l0aCBlYWNoIGNoYW5uZWwgcmVjZWl2ZWQgaW4gdGhlXG4gICogKlswLDI1NV0qIHJhbmdlXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IFthPTI1NV0gLSBUaGUgYWxwaGEgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgc3RhdGljIGZyb21SZ2JhKHJhYywgciwgZywgYiwgYSA9IDI1NSkge1xuICAgIHJldHVybiBuZXcgQ29sb3IocmFjLCByLzI1NSwgZy8yNTUsIGIvMjU1LCBhLzI1NSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSBmcm9tIGEgaGV4YWRlY2ltYWwgdHJpcGxldCBzdHJpbmcuXG4gICpcbiAgKiBUaGUgYGhleFN0cmluZ2AgaXMgZXhwZWN0ZWQgdG8gaGF2ZSA2IGRpZ2l0cyBhbmQgY2FuIG9wdGlvbmFsbHkgc3RhcnRcbiAgKiB3aXRoIGAjYC4gYEFBQkJDQ2AgYW5kIGAjRERFRUZGYCBhcmUgYm90aCB2YWxpZCBpbnB1dHMsIHRoZSB0aHJlZSBkaWdpdFxuICAqIHNob3J0aGFuZCBpcyBub3QgeWV0IHN1cHBvcnRlZC5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgaGV4U3RyaW5nYCBpcyBtaXNmb3JtYXR0ZWQgb3IgY2Fubm90IGJlIHBhcnNlZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyaW5nIC0gVGhlIFJHQiBoZXggdHJpcGxldCB0byBpbnRlcnByZXRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHN0YXRpYyBmcm9tSGV4KHJhYywgaGV4U3RyaW5nKSB7XG4gICAgaWYgKGhleFN0cmluZy5jaGFyQXQoMCkgPT0gJyMnKSB7XG4gICAgICBoZXhTdHJpbmcgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIGlmIChoZXhTdHJpbmcubGVuZ3RoICE9IDYpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgVW5leHBlY3RlZCBsZW5ndGggZm9yIGhleCB0cmlwbGV0IHN0cmluZzogJHtoZXhTdHJpbmd9YCk7XG4gICAgfVxuXG4gICAgbGV0IHJTdHIgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDAsIDIpO1xuICAgIGxldCBnU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZygyLCA0KTtcbiAgICBsZXQgYlN0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoNCwgNik7XG5cbiAgICBsZXQgbmV3UiA9IHBhcnNlSW50KHJTdHIsIDE2KTtcbiAgICBsZXQgbmV3RyA9IHBhcnNlSW50KGdTdHIsIDE2KTtcbiAgICBsZXQgbmV3QiA9IHBhcnNlSW50KGJTdHIsIDE2KTtcblxuICAgIGlmIChpc05hTihuZXdSKSB8fCBpc05hTihuZXdHKSB8fCBpc05hTihuZXdCKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBDb3VsZCBub3QgcGFyc2UgaGV4IHRyaXBsZXQgc3RyaW5nOiAke2hleFN0cmluZ31gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IENvbG9yKHJhYywgbmV3Ui8yNTUsIG5ld0cvMjU1LCBuZXdCLzI1NSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEZpbGxgIHRoYXQgdXNlcyBgdGhpc2AgYXMgYGNvbG9yYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuRmlsbH1cbiAgKi9cbiAgZmlsbCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5GaWxsKHRoaXMucmFjLCB0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3Ryb2tlYCB0aGF0IHVzZXMgYHRoaXNgIGFzIGBjb2xvcmAuXG4gICpcbiAgKiBAcGFyYW0gez9udW1iZXJ9IHdlaWdodCAtIFRoZSB3ZWlnaHQgb2YgdGhlIG5ldyBgU3Ryb2tlYFxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqL1xuICBzdHJva2Uod2VpZ2h0ID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0cm9rZSh0aGlzLnJhYywgd2VpZ2h0LCB0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIHdpdGggYGFgIHNldCB0byBgbmV3QWxwaGFgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld0FscGhhIC0gVGhlIGFscGhhIGNoYW5uZWwgZm9yIHRoZSBuZXcgYENvbG9yYCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgd2l0aEFscGhhKG5ld0FscGhhKSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzLnJhYywgdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgbmV3QWxwaGEpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgd2l0aCBgYWAgc2V0IHRvIGB0aGlzLmEgKiByYXRpb2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBhYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHdpdGhBbHBoYVJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzLnJhYywgdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hICogcmF0aW8pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgaW4gdGhlIGxpbmVhciB0cmFuc2l0aW9uIGJldHdlZW4gYHRoaXNgIGFuZFxuICAqIGB0YXJnZXRgIGF0IGEgYHJhdGlvYCBpbiB0aGUgcmFuZ2UgKlswLDFdKi5cbiAgKlxuICAqIFdoZW4gYHJhdGlvYCBpcyBgMGAgb3IgbGVzcyB0aGUgbmV3IGBDb2xvcmAgaXMgZXF1aXZhbGVudCB0byBgdGhpc2AsXG4gICogd2hlbiBgcmF0aW9gIGlzIGAxYCBvciBsYXJnZXIgdGhlIG5ldyBgQ29sb3JgIGlzIGVxdWl2YWxlbnQgdG9cbiAgKiBgdGFyZ2V0YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSB0cmFuc2l0aW9uIHJhdGlvIGZvciB0aGUgbmV3IGBDb2xvcmBcbiAgKiBAcGFyYW0ge1JhYy5Db2xvcn0gdGFyZ2V0IC0gVGhlIHRyYW5zaXRpb24gdGFyZ2V0IGBDb2xvcmBcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICBsaW5lYXJUcmFuc2l0aW9uKHJhdGlvLCB0YXJnZXQpIHtcbiAgICByYXRpbyA9IE1hdGgubWF4KHJhdGlvLCAwKTtcbiAgICByYXRpbyA9IE1hdGgubWluKHJhdGlvLCAxKTtcblxuICAgIGxldCBuZXdSID0gdGhpcy5yICsgKHRhcmdldC5yIC0gdGhpcy5yKSAqIHJhdGlvO1xuICAgIGxldCBuZXdHID0gdGhpcy5nICsgKHRhcmdldC5nIC0gdGhpcy5nKSAqIHJhdGlvO1xuICAgIGxldCBuZXdCID0gdGhpcy5iICsgKHRhcmdldC5iIC0gdGhpcy5iKSAqIHJhdGlvO1xuICAgIGxldCBuZXdBID0gdGhpcy5hICsgKHRhcmdldC5hIC0gdGhpcy5hKSAqIHJhdGlvO1xuXG4gICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzLnJhYywgbmV3UiwgbmV3RywgbmV3QiwgbmV3QSk7XG4gIH1cblxufSAvLyBjbGFzcyBDb2xvclxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XG5cbiIsIiAgJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEZpbGwgW2NvbG9yXXtAbGluayBSYWMuQ29sb3J9IGZvciBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgZmlsbC5hcHBseSgpYCB0byBhcHBseSB0aGUgZmlsbCBzZXR0aW5ncyBnbG9iYWxseSwgb3IgYXNcbiogdGhlIHBhcmFtZXRlciBvZiBgZHJhd2FibGUuZHJhdyhmaWxsKWAgdG8gYXBwbHkgdGhlIGZpbGwgb25seSBmb3IgdGhhdFxuKiBgZHJhd2AuXG4qXG4qIFdoZW4gYGNvbG9yYCBpcyBgbnVsbGAgYSAqbm8tZmlsbCogc2V0dGluZyBpcyBhcHBsaWVkLlxuKlxuKiBAYWxpYXMgUmFjLkZpbGxcbiovXG5jbGFzcyBGaWxsIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBGaWxsYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0gez9SYWMuQ29sb3J9IGNvbG9yIC0gQSBgQ29sb3JgIGZvciB0aGUgZmlsbCBzZXR0aW5nLCBvciBgbnVsbGBcbiAgKiAgIHRvIGFwcGx5IGEgKm5vLWZpbGwqIHNldHRpbmdcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBjb2xvciA9IG51bGwpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICBjb2xvciAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnRUeXBlKFJhYy5Db2xvciwgY29sb3IpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYEZpbGxgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgRmlsbGAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYENvbG9yYCwgcmV0dXJucyBhIG5ldyBgRmlsbGBcbiAgKiAgIHVzaW5nIGBzb21ldGhpbmdgIGFzIGBjb2xvcmAuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBTdHJva2VgLCByZXR1cm5zIGEgbmV3IGBGaWxsYFxuICAqICAgdXNpbmcgYHN0cm9rZS5jb2xvcmAuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuRmlsbHxSYWMuQ29sb3J8UmFjLlN0cm9rZX0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGEgYEZpbGxgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEZpbGwpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmc7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuQ29sb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRmlsbChyYWMsIHNvbWV0aGluZyk7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuU3Ryb2tlKSB7XG4gICAgICByZXR1cm4gbmV3IEZpbGwocmFjLCBzb21ldGhpbmcuY29sb3IpO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGRlcml2ZSBSYWMuRmlsbCAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG4gIHN0eWxlV2l0aFN0cm9rZShzb21lU3Ryb2tlKSB7XG4gICAgbGV0IHN0cm9rZSA9IFJhYy5TdHJva2UuZnJvbSh0aGlzLnJhYywgc29tZVN0cm9rZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGUodGhpcy5yYWMsIHN0cm9rZSwgdGhpcyk7XG4gIH1cblxufSAvLyBjbGFzcyBGaWxsXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxsO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogU3Ryb2tlIHdlaWdodCBhbmQgW2NvbG9yXXtAbGluayBSYWMuQ29sb3J9IGZvciBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgc3Ryb2tlLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBzdHJva2Ugc2V0dGluZ3MgZ2xvYmFsbHksIG9yXG4qIGFzIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoc3Ryb2tlKWAgdG8gYXBwbHkgdGhlIHN0cm9rZSBvbmx5IGZvclxuKiB0aGF0IGBkcmF3YC5cbipcbiogVGhlIGluc3RhbmNlIGFwcGxpZXMgdGhlIHN0cm9rZSBjb2xvciBhbmQgd2VpZ2h0IHNldHRpbmdzIGluIHRoZVxuKiBmb2xsb3dpbmcgY29tYmluYXRpb25zOlxuKiArIHdoZW4gYGNvbG9yID0gbnVsbGAgYW5kIGB3ZWlnaHQgPSBudWxsYDogYSAqbm8tc3Ryb2tlKiBzZXR0aW5nIGlzXG4qICAgYXBwbGllZFxuKiArIHdoZW4gYGNvbG9yYCBpcyBzZXQgYW5kIGB3ZWlnaHQgPSBudWxsYDogb25seSB0aGUgc3Ryb2tlIGNvbG9yIGlzXG4qICAgYXBwbGllZCwgc3Ryb2tlIHdlaWdodCBpcyBub3QgbW9kaWZpZWRcbiogKyB3aGVuIGB3ZWlnaHRgIGlzIHNldCBhbmQgYGNvbG9yID0gbnVsbGA6IG9ubHkgdGhlIHN0cm9rZSB3ZWlnaHQgaXNcbiogICBhcHBsaWVkLCBzdHJva2UgY29sb3IgaXMgbm90IG1vZGlmaWVkXG4qICsgd2hlbiBib3RoIGBjb2xvcmAgYW5kIGB3ZWlnaHRgIGFyZSBzZXQ6IGJvdGggc3Ryb2tlIGNvbG9yIGFuZCB3ZWlnaHRcbiogICBhcmUgYXBwbGllZFxuKlxuKiBAYWxpYXMgUmFjLlN0cm9rZVxuKi9cbmNsYXNzIFN0cm9rZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgU3Ryb2tlYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHs/bnVtYmVyfSB3ZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwIHdlaWdodFxuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gY29sb3IgLSBBIGBDb2xvcmAgZm9yIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwIGNvbG9yXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgd2VpZ2h0LCBjb2xvciA9IG51bGwpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB3ZWlnaHQgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0TnVtYmVyKHdlaWdodCk7XG4gICAgY29sb3IgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQ29sb3IsIGNvbG9yKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMud2VpZ2h0ID0gd2VpZ2h0O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFN0cm9rZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBTdHJva2VgLCByZXR1cm5zIHRoYXQgc2FtZSBvYmplY3QuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBDb2xvcmAsIHJldHVybnMgYSBuZXcgYFN0cm9rZWBcbiAgKiAgIHVzaW5nIGBzb21ldGhpbmdgIGFzIGBjb2xvcmAgYW5kIGEgYG51bGxgIHN0cm9rZSB3ZWlnaHQuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBGaWxsYCwgcmV0dXJucyBhIG5ldyBgU3Ryb2tlYFxuICAqICAgdXNpbmcgYGZpbGwuY29sb3JgIGFuZCBhIGBudWxsYCBzdHJva2Ugd2VpZ2h0LlxuICAqICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlN0cm9rZXxSYWMuQ29sb3J8UmFjLkZpbGx9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqIGRlcml2ZSBhIGBTdHJva2VgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgU3Ryb2tlKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkNvbG9yKSB7XG4gICAgICByZXR1cm4gbmV3IFN0cm9rZShyYWMsIG51bGwsIHNvbWV0aGluZyk7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuRmlsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UocmFjLCBudWxsLCBzb21ldGhpbmcuY29sb3IpO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGRlcml2ZSBSYWMuU3Ryb2tlIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHdpdGggYHdlaWdodGAgc2V0IHRvIGBuZXdXZWlnaHRgLlxuICAqXG4gICogQHBhcmFtIHs/bnVtYmVyfSBuZXdXZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwXG4gICogICB3ZWlnaHRcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgd2l0aFdlaWdodChuZXdXZWlnaHQpIHtcbiAgICByZXR1cm4gbmV3IFN0cm9rZSh0aGlzLnJhYywgbmV3V2VpZ2h0LCB0aGlzLmNvbG9yLCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0cm9rZWAgd2l0aCBhIGNvcHkgb2YgYGNvbG9yYCBzZXR1cCB3aXRoIGBuZXdBbHBoYWAsXG4gICogYW5kIHRoZSBzYW1lIGBzdHJva2VgIGFzIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuY29sb3JgIGlzIHNldCB0byBgbnVsbGAsIHJldHVybnMgYSBuZXcgYFN0cm9rZWAgdGhhdCBpcyBhXG4gICogY29weSBvZiBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3QWxwaGEgLSBUaGUgYWxwaGEgY2hhbm5lbCBvZiB0aGUgYGNvbG9yYCBvZiB0aGUgbmV3XG4gICogICBgU3Ryb2tlYFxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqL1xuICB3aXRoQWxwaGEobmV3QWxwaGEpIHtcbiAgICBpZiAodGhpcy5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIHRoaXMud2VpZ2h0LCBudWxsKTtcbiAgICB9XG5cbiAgICBsZXQgbmV3Q29sb3IgPSB0aGlzLmNvbG9yLndpdGhBbHBoYShuZXdBbHBoYSk7XG4gICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIHRoaXMud2VpZ2h0LCBuZXdDb2xvcik7XG4gIH1cblxuXG4gIHN0eWxlV2l0aEZpbGwoc29tZUZpbGwpIHtcbiAgICBsZXQgZmlsbCA9IFJhYy5GaWxsLmZyb20odGhpcy5yYWMsIHNvbWVGaWxsKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZSh0aGlzLnJhYywgdGhpcywgZmlsbCk7XG4gIH1cblxufSAvLyBjbGFzcyBTdHJva2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cm9rZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIGBbU3Ryb2tlXXtAbGluayBSYWMuU3Ryb2tlfWAgYW5kIGBbRmlsbF17QGxpbmsgUmFjLkZpbGx9YCBzdHlsZSB0byBhcHBseVxuKiBmb3IgZHJhd2luZy5cbipcbiogQ2FuIGJlIHVzZWQgYXMgYHN0eWxlLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBzdHJva2UgYW5kIGZpbGwgc2V0dGluZ3NcbiogZ2xvYmFsbHksIG9yIGFzIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoc3R5bGUpYCB0byBhcHBseSB0aGVcbiogc2V0dGluZ3Mgb25seSBmb3IgdGhhdCBgZHJhd2AuXG4qXG4qIEFwcGxpZXMgd2hpY2hldmVyIGBzdHJva2VgIG9yIGBmaWxsYCBzdHlsZXMgYXJlIHByZXNlbnQsIGFueSBzZXQgdG9cbiogYG51bGxgIGlzIGluZGl2aWR1YWxseSBza2lwcGVkLlxuKlxuKiBAYWxpYXMgUmFjLlN0eWxlXG4qL1xuY2xhc3MgU3R5bGUge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgc3Ryb2tlID0gbnVsbCwgZmlsbCA9IG51bGwpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnN0cm9rZSA9IHN0cm9rZTtcbiAgICB0aGlzLmZpbGwgPSBmaWxsO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHN0cm9rZVN0cmluZyA9ICdudWxsJztcbiAgICBpZiAodGhpcy5zdHJva2UgIT09IG51bGwpIHtcbiAgICAgIGxldCBjb2xvclN0cmluZyA9IHRoaXMuc3Ryb2tlLmNvbG9yID09PSBudWxsXG4gICAgICAgID8gJ251bGwtY29sb3InXG4gICAgICAgIDogdGhpcy5zdHJva2UuY29sb3IudG9TdHJpbmcoKTtcbiAgICAgIHN0cm9rZVN0cmluZyA9IGAke2NvbG9yU3RyaW5nfSwke3RoaXMuc3Ryb2tlLndlaWdodH1gO1xuICAgIH1cblxuICAgIGxldCBmaWxsU3RyaW5nID0gJ251bGwnO1xuICAgIGlmICh0aGlzLmZpbGwgIT09IG51bGwpIHtcbiAgICAgIGxldCBjb2xvclN0cmluZyA9IHRoaXMuZmlsbC5jb2xvciA9PT0gbnVsbFxuICAgICAgICA/ICdudWxsLWNvbG9yJ1xuICAgICAgICA6IHRoaXMuZmlsbC5jb2xvci50b1N0cmluZygpO1xuICAgICAgZmlsbFN0cmluZyA9IGNvbG9yU3RyaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBgU3R5bGUoczooJHtzdHJva2VTdHJpbmd9KSBmOiR7ZmlsbFN0cmluZ30pYDtcbiAgfVxuXG5cbiAgd2l0aFN0cm9rZShzdHJva2UpIHtcbiAgICByZXR1cm4gbmV3IFN0eWxlKHRoaXMucmFjLCBzdHJva2UsIHRoaXMuZmlsbCk7XG4gIH1cblxuICB3aXRoRmlsbChzb21lRmlsbCkge1xuICAgIGxldCBmaWxsID0gUmFjLkZpbGwuZnJvbSh0aGlzLnJhYywgc29tZUZpbGwpO1xuICAgIHJldHVybiBuZXcgU3R5bGUodGhpcy5yYWMsIHRoaXMuc3Ryb2tlLCBmaWxsKTtcbiAgfVxuXG59IC8vIGNsYXNzIFN0eWxlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHlsZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkNvbG9yYCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5Db2xvcn1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkNvbG9yXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNDb2xvcihyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGVhY2ggY2hhbm5lbCByZWNlaXZlZCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IFthPTI1NV0gLSBUaGUgYWxwaGEgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tUmdiYVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLmZyb21SZ2JhID0gZnVuY3Rpb24ociwgZywgYiwgYSA9IDI1NSkge1xuICAgIHJldHVybiBSYWMuQ29sb3IuZnJvbVJnYmEocmFjLCByLCBnLCBiLCBhKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSBmcm9tIGEgaGV4YWRlY2ltYWwgdHJpcGxldCBzdHJpbmcuXG4gICpcbiAgKiBUaGUgYGhleFN0cmluZ2AgaXMgZXhwZWN0ZWQgdG8gaGF2ZSA2IGRpZ2l0cyBhbmQgY2FuIG9wdGlvbmFsbHkgc3RhcnRcbiAgKiB3aXRoIGAjYC4gYEFBQkJDQ2AgYW5kIGAjRERFRUZGYCBhcmUgYm90aCB2YWxpZCBpbnB1dHMsIHRoZSB0aHJlZSBkaWdpdFxuICAqIHNob3J0aGFuZCBpcyBub3QgeWV0IHN1cHBvcnRlZC5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgaGV4U3RyaW5nYCBpcyBtaXNmb3JtYXR0ZWQgb3IgY2Fubm90IGJlIHBhcnNlZC5cbiAgKlxuICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHJpbmcgLSBUaGUgUkdCIGhleCB0cmlwbGV0IHRvIGludGVycHJldFxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHJhYy5Db2xvci5mcm9tSGV4ID0gZnVuY3Rpb24oaGV4U3RyaW5nKSB7XG4gICAgcmV0dXJuIFJhYy5Db2xvci5mcm9tSGV4KHJhYywgaGV4U3RyaW5nKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQSBibGFjayBgQ29sb3JgLlxuICAqXG4gICogQG5hbWUgYmxhY2tcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5ibGFjayAgID0gcmFjLkNvbG9yKDAsIDAsIDApO1xuXG4gIC8qKlxuICAqIEEgcmVkIGBDb2xvcmAuXG4gICpcbiAgKiBAbmFtZSByZWRcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5yZWQgICAgID0gcmFjLkNvbG9yKDEsIDAsIDApO1xuXG4gIHJhYy5Db2xvci5ncmVlbiAgID0gcmFjLkNvbG9yKDAsIDEsIDApO1xuICByYWMuQ29sb3IuYmx1ZSAgICA9IHJhYy5Db2xvcigwLCAwLCAxKTtcbiAgcmFjLkNvbG9yLnllbGxvdyAgPSByYWMuQ29sb3IoMSwgMSwgMCk7XG4gIHJhYy5Db2xvci5tYWdlbnRhID0gcmFjLkNvbG9yKDEsIDAsIDEpO1xuICByYWMuQ29sb3IuY3lhbiAgICA9IHJhYy5Db2xvcigwLCAxLCAxKTtcbiAgcmFjLkNvbG9yLndoaXRlICAgPSByYWMuQ29sb3IoMSwgMSwgMSk7XG5cbn0gLy8gYXR0YWNoUmFjQ29sb3JcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkZpbGxgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkZpbGx9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5GaWxsXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNGaWxsKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIEEgYEZpbGxgIHdpdGhvdXQgY29sb3IuIFJlbW92ZXMgdGhlIGZpbGwgY29sb3Igd2hlbiBhcHBsaWVkLlxuICAqIEBuYW1lIG5vbmVcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuRmlsbCNcbiAgKi9cbiAgcmFjLkZpbGwubm9uZSA9IHJhYy5GaWxsKG51bGwpO1xuXG59IC8vIGF0dGFjaFJhY0ZpbGxcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlN0cm9rZWAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuU3Ryb2tlfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU3Ryb2tlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNQb2ludChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBTdHJva2VgIHdpdGggbm8gd2VpZ2h0IGFuZCBubyBjb2xvci4gVXNpbmcgb3IgYXBwbHlpbmcgdGhpcyBzdHJva2VcbiAgKiB3aWxsIGRpc2FibGUgc3Ryb2tlIGRyYXdpbmcuXG4gICpcbiAgKiBAbmFtZSBub25lXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlN0cm9rZSNcbiAgKi9cbiAgcmFjLlN0cm9rZS5ub25lID0gcmFjLlN0cm9rZShudWxsKTtcblxuXG4gIC8qKlxuICAqIEEgYFN0cm9rZWAgd2l0aCBgd2VpZ2h0YCBvZiBgMWAgYW5kIG5vIGNvbG9yLiBVc2luZyBvciBhcHBseWluZyB0aGlzXG4gICogc3Ryb2tlIHdpbGwgb25seSBzZXQgdGhlIHN0cm9rZSB3ZWlnaHQgdG8gYDFgLlxuICAqXG4gICogQG5hbWUgb25lXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlN0cm9rZSNcbiAgKi9cbiAgcmFjLlN0cm9rZS5vbmUgPSByYWMuU3Ryb2tlKDEpO1xuXG59IC8vIGF0dGFjaFJhY1N0cm9rZVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vLyBJbXBsZW1lbnRhdGlvbiBvZiBhbiBlYXNlIGZ1bmN0aW9uIHdpdGggc2V2ZXJhbCBvcHRpb25zIHRvIHRhaWxvciBpdHNcbi8vIGJlaGF2aW91ci4gVGhlIGNhbGN1bGF0aW9uIHRha2VzIHRoZSBmb2xsb3dpbmcgc3RlcHM6XG4vLyBWYWx1ZSBpcyByZWNlaXZlZCwgcHJlZml4IGlzIHJlbW92ZWRcbi8vICAgVmFsdWUgLT4gZWFzZVZhbHVlKHZhbHVlKVxuLy8gICAgIHZhbHVlID0gdmFsdWUgLSBwcmVmaXhcbi8vIFJhdGlvIGlzIGNhbGN1bGF0ZWRcbi8vICAgcmF0aW8gPSB2YWx1ZSAvIGluUmFuZ2Vcbi8vIFJhdGlvIGlzIGFkanVzdGVkXG4vLyAgIHJhdGlvIC0+IGVhc2VSYXRpbyhyYXRpbylcbi8vICAgICBhZGp1c3RlZFJhdGlvID0gKHJhdGlvICsgcmF0aW9PZnNldCkgKiByYXRpb0ZhY3RvclxuLy8gRWFzZSBpcyBjYWxjdWxhdGVkXG4vLyAgIGVhc2VkUmF0aW8gPSBlYXNlVW5pdChhZGp1c3RlZFJhdGlvKVxuLy8gRWFzZWRSYXRpbyBpcyBhZGp1c3RlZCBhbmQgcmV0dXJuZWRcbi8vICAgZWFzZWRSYXRpbyA9IChlYXNlZFJhdGlvICsgZWFzZU9mc2V0KSAqIGVhc2VGYWN0b3Jcbi8vICAgZWFzZVJhdGlvKHJhdGlvKSAtPiBlYXNlZFJhdGlvXG4vLyBWYWx1ZSBpcyBwcm9qZWN0ZWRcbi8vICAgZWFzZWRWYWx1ZSA9IHZhbHVlICogZWFzZWRSYXRpb1xuLy8gVmFsdWUgaXMgYWRqdXN0ZWQgYW5kIHJldHVybmVkXG4vLyAgIGVhc2VkVmFsdWUgPSBwcmVmaXggKyAoZWFzZWRWYWx1ZSAqIG91dFJhbmdlKVxuLy8gICBlYXNlVmFsdWUodmFsdWUpIC0+IGVhc2VkVmFsdWVcbmNsYXNzIEVhc2VGdW5jdGlvbiB7XG5cbiAgLy8gQmVoYXZpb3JzIGZvciB0aGUgYGVhc2VWYWx1ZWAgZnVuY3Rpb24gd2hlbiBgdmFsdWVgIGZhbGxzIGJlZm9yZSB0aGVcbiAgLy8gYHByZWZpeGAgYW5kIGFmdGVyIGBpblJhbmdlYC5cbiAgc3RhdGljIEJlaGF2aW9yID0ge1xuICAgIC8vIGB2YWx1ZWAgaXMgcmV0dXJuZWQgd2l0aG91dCBhbnkgZWFzaW5nIHRyYW5zZm9ybWF0aW9uLiBgcHJlRmFjdG9yYFxuICAgIC8vIGFuZCBgcG9zdEZhY3RvcmAgYXJlIGFwcGxpZWQuIFRoaXMgaXMgdGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbi5cbiAgICBwYXNzOiBcInBhc3NcIixcbiAgICAvLyBDbGFtcHMgdGhlIHJldHVybmVkIHZhbHVlIHRvIGBwcmVmaXhgIG9yIGBwcmVmaXgraW5SYW5nZWA7XG4gICAgY2xhbXA6IFwiY2xhbXBcIixcbiAgICAvLyBSZXR1cm5zIHRoZSBhcHBsaWVkIGVhc2luZyB0cmFuc2Zvcm1hdGlvbiB0byBgdmFsdWVgIGZvciB2YWx1ZXNcbiAgICAvLyBiZWZvcmUgYHByZWZpeGAgYW5kIGFmdGVyIGBpblJhbmdlYC5cbiAgICBjb250aW51ZTogXCJjb250aW51ZVwiXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hID0gMjtcblxuICAgIC8vIEFwcGxpZWQgdG8gcmF0aW8gYmVmb3JlIGVhc2luZy5cbiAgICB0aGlzLnJhdGlvT2Zmc2V0ID0gMFxuICAgIHRoaXMucmF0aW9GYWN0b3IgPSAxO1xuXG4gICAgLy8gQXBwbGllZCB0byBlYXNlZFJhdGlvLlxuICAgIHRoaXMuZWFzZU9mZnNldCA9IDBcbiAgICB0aGlzLmVhc2VGYWN0b3IgPSAxO1xuXG4gICAgLy8gRGVmaW5lcyB0aGUgbG93ZXIgbGltaXQgb2YgYHZhbHVlYGAgdG8gYXBwbHkgZWFzaW5nLlxuICAgIHRoaXMucHJlZml4ID0gMDtcblxuICAgIC8vIGB2YWx1ZWAgaXMgcmVjZWl2ZWQgaW4gYGluUmFuZ2VgIGFuZCBvdXRwdXQgaW4gYG91dFJhbmdlYC5cbiAgICB0aGlzLmluUmFuZ2UgPSAxO1xuICAgIHRoaXMub3V0UmFuZ2UgPSAxO1xuXG4gICAgLy8gQmVoYXZpb3IgZm9yIHZhbHVlcyBiZWZvcmUgYHByZWZpeGAuXG4gICAgdGhpcy5wcmVCZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvci5wYXNzO1xuICAgIC8vIEJlaGF2aW9yIGZvciB2YWx1ZXMgYWZ0ZXIgYHByZWZpeCtpblJhbmdlYC5cbiAgICB0aGlzLnBvc3RCZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvci5wYXNzO1xuXG4gICAgLy8gRm9yIGEgYHByZUJlaGF2aW9yYCBvZiBgcGFzc2AsIHRoZSBmYWN0b3IgYXBwbGllZCB0byB2YWx1ZXMgYmVmb3JlXG4gICAgLy8gYHByZWZpeGAuXG4gICAgdGhpcy5wcmVGYWN0b3IgPSAxO1xuICAgIC8vIEZvciBhIGBwb3N0QmVoYXZpb3JgIG9mIGBwYXNzYCwgdGhlIGZhY3RvciBhcHBsaWVkIHRvIHRoZSB2YWx1ZXNcbiAgICAvLyBhZnRlciBgcHJlZml4K2luUmFuZ2VgLlxuICAgIHRoaXMucG9zdEZhY3RvciA9IDE7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGVhc2VkIHZhbHVlIGZvciBgdW5pdGAuIEJvdGggdGhlIGdpdmVuXG4gIC8vIGB1bml0YCBhbmQgdGhlIHJldHVybmVkIHZhbHVlIGFyZSBpbiB0aGUgWzAsMV0gcmFuZ2UuIElmIGB1bml0YCBpc1xuICAvLyBvdXRzaWRlIHRoZSBbMCwxXSB0aGUgcmV0dXJuZWQgdmFsdWUgZm9sbG93cyB0aGUgY3VydmUgb2YgdGhlIGVhc2luZ1xuICAvLyBmdW5jdGlvbiwgd2hpY2ggbWF5IGJlIGludmFsaWQgZm9yIHNvbWUgdmFsdWVzIG9mIGBhYC5cbiAgLy9cbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB0aGUgYmFzZSBlYXNpbmcgZnVuY3Rpb24sIGl0IGRvZXMgbm90IGFwcGx5IGFueVxuICAvLyBvZmZzZXRzIG9yIGZhY3RvcnMuXG4gIGVhc2VVbml0KHVuaXQpIHtcbiAgICAvLyBTb3VyY2U6XG4gICAgLy8gaHR0cHM6Ly9tYXRoLnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy8xMjE3MjAvZWFzZS1pbi1vdXQtZnVuY3Rpb24vMTIxNzU1IzEyMTc1NVxuICAgIC8vIGYodCkgPSAodF5hKS8odF5hKygxLXQpXmEpXG4gICAgbGV0IHJhID0gTWF0aC5wb3codW5pdCwgdGhpcy5hKTtcbiAgICBsZXQgaXJhID0gTWF0aC5wb3coMS11bml0LCB0aGlzLmEpO1xuICAgIHJldHVybiByYSAvIChyYSArIGlyYSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBlYXNlIGZ1bmN0aW9uIGFwcGxpZWQgdG8gdGhlIGdpdmVuIHJhdGlvLiBgcmF0aW9PZmZzZXRgXG4gIC8vIGFuZCBgcmF0aW9GYWN0b3JgIGFyZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCwgYGVhc2VPZmZzZXRgIGFuZFxuICAvLyBgZWFzZUZhY3RvcmAgYXJlIGFwcGxpZWQgdG8gdGhlIG91dHB1dC5cbiAgZWFzZVJhdGlvKHJhdGlvKSB7XG4gICAgbGV0IGFkanVzdGVkUmF0aW8gPSAocmF0aW8gKyB0aGlzLnJhdGlvT2Zmc2V0KSAqIHRoaXMucmF0aW9GYWN0b3I7XG4gICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VVbml0KGFkanVzdGVkUmF0aW8pO1xuICAgIHJldHVybiAoZWFzZWRSYXRpbyArIHRoaXMuZWFzZU9mZnNldCkgKiB0aGlzLmVhc2VGYWN0b3I7XG4gIH1cblxuICAvLyBBcHBsaWVzIHRoZSBlYXNpbmcgZnVuY3Rpb24gdG8gYHZhbHVlYCBjb25zaWRlcmluZyB0aGUgY29uZmlndXJhdGlvblxuICAvLyBvZiB0aGUgd2hvbGUgaW5zdGFuY2UuXG4gIGVhc2VWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCBiZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvcjtcblxuICAgIGxldCBzaGlmdGVkVmFsdWUgPSB2YWx1ZSAtIHRoaXMucHJlZml4O1xuICAgIGxldCByYXRpbyA9IHNoaWZ0ZWRWYWx1ZSAvIHRoaXMuaW5SYW5nZTtcblxuICAgIC8vIEJlZm9yZSBwcmVmaXhcbiAgICBpZiAodmFsdWUgPCB0aGlzLnByZWZpeCkge1xuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLnBhc3MpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNldG9QcmVmaXggPSB2YWx1ZSAtIHRoaXMucHJlZml4O1xuICAgICAgICAvLyBXaXRoIGEgcHJlRmFjdG9yIG9mIDEgdGhpcyBpcyBlcXVpdmFsZW50IHRvIGByZXR1cm4gcmFuZ2VgXG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIChkaXN0YW5jZXRvUHJlZml4ICogdGhpcy5wcmVGYWN0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLmNsYW1wKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5jb250aW51ZSkge1xuICAgICAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVJhdGlvKHJhdGlvKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgZWFzZWRSYXRpbyAqIHRoaXMub3V0UmFuZ2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgcHJlQmVoYXZpb3IgY29uZmlndXJhdGlvbiAtIHByZUJlaGF2aW9yOiR7dGhpcy5wb3N0QmVoYXZpb3J9YCk7XG4gICAgICB0aHJvdyByYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgfVxuXG4gICAgLy8gQWZ0ZXIgcHJlZml4XG4gICAgaWYgKHJhdGlvIDw9IDEgfHwgdGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLmNvbnRpbnVlKSB7XG4gICAgICAvLyBFYXNlIGZ1bmN0aW9uIGFwcGxpZWQgd2l0aGluIHJhbmdlIChvciBhZnRlcilcbiAgICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlUmF0aW8ocmF0aW8pO1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgZWFzZWRSYXRpbyAqIHRoaXMub3V0UmFuZ2U7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IucGFzcykge1xuICAgICAgLy8gU2hpZnRlZCB0byBoYXZlIGluUmFuZ2UgYXMgb3JpZ2luXG4gICAgICBsZXQgc2hpZnRlZFBvc3QgPSBzaGlmdGVkVmFsdWUgLSB0aGlzLmluUmFuZ2U7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLm91dFJhbmdlICsgc2hpZnRlZFBvc3QgKiB0aGlzLnBvc3RGYWN0b3I7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IuY2xhbXApIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMub3V0UmFuZ2U7XG4gICAgfVxuXG4gICAgY29uc29sZS50cmFjZShgSW52YWxpZCBwb3N0QmVoYXZpb3IgY29uZmlndXJhdGlvbiAtIHBvc3RCZWhhdmlvcjoke3RoaXMucG9zdEJlaGF2aW9yfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgfVxuXG5cbiAgLy8gUHJlY29uZmlndXJlZCBmdW5jdGlvbnNcblxuICAvLyBNYWtlcyBhbiBlYXNlRnVuY3Rpb24gcHJlY29uZmlndXJlZCB0byBhbiBlYXNlIG91dCBtb3Rpb24uXG4gIC8vXG4gIC8vIFRoZSBgb3V0UmFuZ2VgIHZhbHVlIHNob3VsZCBiZSBgaW5SYW5nZSoyYCBpbiBvcmRlciBmb3IgdGhlIGVhc2VcbiAgLy8gbW90aW9uIHRvIGNvbm5lY3Qgd2l0aCB0aGUgZXh0ZXJuYWwgbW90aW9uIGF0IHRoZSBjb3JyZWN0IHZlbG9jaXR5LlxuICBzdGF0aWMgbWFrZUVhc2VPdXQoKSB7XG4gICAgbGV0IGVhc2VPdXQgPSBuZXcgRWFzZUZ1bmN0aW9uKClcbiAgICBlYXNlT3V0LnJhdGlvT2Zmc2V0ID0gMTtcbiAgICBlYXNlT3V0LnJhdGlvRmFjdG9yID0gLjU7XG4gICAgZWFzZU91dC5lYXNlT2Zmc2V0ID0gLS41O1xuICAgIGVhc2VPdXQuZWFzZUZhY3RvciA9IDI7XG4gICAgcmV0dXJuIGVhc2VPdXQ7XG4gIH1cblxufSAvLyBjbGFzcyBFYXNlRnVuY3Rpb25cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEVhc2VGdW5jdGlvbjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBFeGNlcHRpb24gYnVpbGRlciBmb3IgdGhyb3dhYmxlIG9iamVjdHMuXG4qIEBhbGlhcyBSYWMuRXhjZXB0aW9uXG4qL1xuY2xhc3MgRXhjZXB0aW9uIHtcblxuICBjb25zdHJ1Y3RvcihuYW1lLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBFeGNlcHRpb246JHt0aGlzLm5hbWV9IC0gJHt0aGlzLm1lc3NhZ2V9YDtcbiAgfVxuXG4gIC8qKlxuICAqIFdoZW4gYHRydWVgIHRoZSBjb252ZW5pZW5jZSBzdGF0aWMgZnVuY3Rpb25zIG9mIHRoaXMgY2xhc3Mgd2lsbFxuICAqIGJ1aWxkIGBFcnJvcmAgb2JqZWN0cywgb3RoZXJ3aXNlIGBFeGNlcHRpb25gIG9iamVjdHMgYXJlIGJ1aWx0LlxuICAqXG4gICogU2V0IGFzIGBmYWxzZWAgYnkgZGVmYXVsdCBmb3IgYnJvd3NlciB1c2U6IHRocm93aW5nIGFuIGBFeGNlcHRpb25gXG4gICogaW4gY2hyb21lIGRpc3BsYXlzIHRoZSBlcnJvciBzdGFjayB1c2luZyBzb3VyY2UtbWFwcyB3aGVuIGF2YWlsYWJsZSxcbiAgKiB3aGlsZSB0aHJvd2luZyBhbiBgRXJyb3JgIG9iamVjdCBkaXNwbGF5cyB0aGUgZXJyb3Igc3RhY2sgcmVsYXRpdmUgdG9cbiAgKiB0aGUgYnVuZGxlZCBmaWxlIHdoaWNoIGlzIGhhcmRlciB0byByZWFkLlxuICAqXG4gICogVXNlZCBhcyBgdHJ1ZWAgZm9yIHRlc3QgcnVucyBpbiBKZXN0OiB0aHJvd2luZyBhbiBgRXJyb3JgIHdpbGwgYmVcbiAgKiByZXBvcnRlZCBpbiB0aGUgdGVzdCByZXBvcnQsIHdoaWxlIHRocm93aW5nIGEgY3VzdG9tIG9iamVjdCAobGlrZVxuICAqIGBFeGNlcHRpb25gKSB3aXRoaW4gYSBtYXRjaGVyIHJlc3VsdHMgaW4gdGhlIGV4cGVjdGF0aW9uIGhhbmdpbmdcbiAgKiBpbmRlZmluaXRlbHkuXG4gICovXG4gIHN0YXRpYyBidWlsZHNFcnJvcnMgPSBmYWxzZTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBidWlsZGluZyB0aHJvd2FibGUgb2JqZWN0cy5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBjYW4gY2FuIGJlIHVzZWQgYXMgZm9sbG93aW5nOlxuICAqIGBgYFxuICAqIGZ1bmMobWVzc2FnZSkgLy8gcmV0dXJucyBhbiBgRXhjZXB0aW9uYGAgb2JqZWN0IHdpdGggYG5hbWVgIGFuZCBgbWVzc2FnZWBcbiAgKiBmdW5jLmV4Y2VwdGlvbk5hbWUgLy8gcmV0dXJucyB0aGUgYG5hbWVgIG9mIHRoZSBidWlsdCB0aHJvd2FibGUgb2JqZWN0c1xuICAqIGBgYFxuICAqL1xuICBzdGF0aWMgbmFtZWQobmFtZSkge1xuICAgIGxldCBmdW5jID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChFeGNlcHRpb24uYnVpbGRzRXJyb3JzKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICBlcnJvci5uYW1lID0gbmFtZTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEV4Y2VwdGlvbihuYW1lLCBtZXNzYWdlKTtcbiAgICB9O1xuXG4gICAgZnVuYy5leGNlcHRpb25OYW1lID0gbmFtZTtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxuXG4gIHN0YXRpYyBkcmF3ZXJOb3RTZXR1cCA9ICAgIEV4Y2VwdGlvbi5uYW1lZCgnRHJhd2VyTm90U2V0dXAnKTtcbiAgc3RhdGljIGZhaWxlZEFzc2VydCA9ICAgICAgRXhjZXB0aW9uLm5hbWVkKCdGYWlsZWRBc3NlcnQnKTtcbiAgc3RhdGljIGludmFsaWRPYmplY3RUeXBlID0gRXhjZXB0aW9uLm5hbWVkKCdpbnZhbGlkT2JqZWN0VHlwZScpO1xuXG4gIC8vIGFic3RyYWN0RnVuY3Rpb25DYWxsZWQ6ICdBYnN0cmFjdCBmdW5jdGlvbiBjYWxsZWQnLFxuICAvLyBpbnZhbGlkUGFyYW1ldGVyQ29tYmluYXRpb246ICdJbnZhbGlkIHBhcmFtZXRlciBjb21iaW5hdGlvbicsXG4gIC8vIGludmFsaWRPYmplY3RDb25maWd1cmF0aW9uOiAnSW52YWxpZCBvYmplY3QgY29uZmlndXJhdGlvbicsXG4gIC8vIGludmFsaWRPYmplY3RUb0RyYXc6ICdJbnZhbGlkIG9iamVjdCB0byBkcmF3JyxcbiAgLy8gaW52YWxpZE9iamVjdFRvQXBwbHk6ICdJbnZhbGlkIG9iamVjdCB0byBhcHBseScsXG5cbn0gLy8gY2xhc3MgRXhjZXB0aW9uXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFeGNlcHRpb247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogSW50ZXJuYWwgdXRpbGl0aWVzLlxuKiBAbmFtZXNwYWNlIHV0aWxzXG4qL1xuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIHBhc3NlZCBwYXJhbWV0ZXJzIGFyZSBvYmplY3RzIG9yIHByaW1pdGl2ZXMuIElmIGFueVxuKiBwYXJhbWV0ZXIgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gXG4qIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi4oT2JqZWN0fHByaW1pdGl2ZSl9IHBhcmFtZXRlcnNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRFeGlzdHNcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0RXhpc3RzID0gZnVuY3Rpb24oLi4ucGFyYW1ldGVycykge1xuICBwYXJhbWV0ZXJzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRm91bmQgbnVsbCwgZXhwZWN0aW5nIGVsZW1lbnQgdG8gZXhpc3QgYXQgaW5kZXggJHtpbmRleH1gKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBGb3VuZCB1bmRlZmluZWQsIGV4cGVjdGluZyBlbGVtZW50IHRvIGV4aXN0IGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBvYmplY3RzIG9yIHRoZSBnaXZlbiBgdHlwZW9gLCBvdGhlcndpc2UgYVxuKiBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSB0eXBlXG4qIEBwYXJhbSB7Li4uT2JqZWN0fSBlbGVtZW50c1xuKlxuKiBAcmV0dXJucyB7Ym9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydFR5cGVcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0VHlwZSA9IGZ1bmN0aW9uKHR5cGUsIC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIHR5cGUpKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlIC0gZWxlbWVudDoke2l0ZW19IGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBleHBlY3RlZC10eXBlLW5hbWU6JHt0eXBlLm5hbWV9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBudW1iZXIgcHJpbWl0aXZlcyBhbmQgbm90IE5hTiwgb3RoZXJ3aXNlXG4qIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5udW1iZXJ9IGVsZW1lbnRzXG4qIEByZXR1cm5zIHtib29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0TnVtYmVyXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydE51bWJlciA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnbnVtYmVyJyB8fCBpc05hTihpdGVtKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSwgZXhwZWN0aW5nIG51bWJlciBwcmltaXRpdmUgLSBlbGVtZW50OiR7aXRlbX0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBzdHJpbmcgcHJpbWl0aXZlcywgb3RoZXJ3aXNlXG4qIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5zdHJpbmd9IGVsZW1lbnRzXG4qIEByZXR1cm5zIHtib29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0U3RyaW5nXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydFN0cmluZyA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSwgZXhwZWN0aW5nIHN0cmluZyBwcmltaXRpdmUgLSBlbGVtZW50OiR7aXRlbX0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBib29sZWFuIHByaW1pdGl2ZXMsIG90aGVyd2lzZSBhXG4qIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YCBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uYm9vbGVhbn0gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRCb29sZWFuXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydEJvb2xlYW4gPSBmdW5jdGlvbiguLi5lbGVtZW50cykge1xuICBlbGVtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgYm9vbGVhbiBwcmltaXRpdmUgLSBlbGVtZW50OiR7aXRlbX0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogUmV0dXJucyB0aGUgY29uc3RydWN0b3IgbmFtZSBvZiBgb2JqYCwgb3IgaXRzIHR5cGUgbmFtZS5cbiogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGRlYnVnZ2luZyBhbmQgZXJyb3JzLlxuKlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gYE9iamVjdGAgdG8gZ2V0IGl0cyB0eXBlIG5hbWVcbiogQHJldHVybnMge3N0cmluZ31cbipcbiogQGZ1bmN0aW9uIHR5cGVOYW1lXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5mdW5jdGlvbiB0eXBlTmFtZShvYmopIHtcbiAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiAndW5kZWZpbmVkJzsgfVxuICBpZiAob2JqID09PSBudWxsKSB7IHJldHVybiAnbnVsbCc7IH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmoubmFtZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIG9iai5uYW1lID09ICcnXG4gICAgICA/IGBmdW5jdGlvbmBcbiAgICAgIDogYGZ1bmN0aW9uOiR7b2JqLm5hbWV9YDtcbiAgfVxuICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yLm5hbWUgPz8gdHlwZW9mIG9iajtcbn1cbmV4cG9ydHMudHlwZU5hbWUgPSB0eXBlTmFtZTtcblxuXG4vKipcbiogQWRkcyBhIGNvbnN0YW50IHRvIHRoZSBnaXZlbiBvYmplY3QsIHRoZSBjb25zdGFudCBpcyBub3QgZW51bWVyYWJsZSBhbmRcbiogbm90IGNvbmZpZ3VyYWJsZS5cbipcbiogQGZ1bmN0aW9uIGFkZENvbnN0YW50VG9cbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYWRkQ29uc3RhbnRUbyA9IGZ1bmN0aW9uKG9iaiwgcHJvcE5hbWUsIHZhbHVlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IHZhbHVlXG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIGEgc3RyaW5nIG9mIGBudW1iZXJgIGZvcm1hdCB1c2luZyBmaXhlZC1wb2ludCBub3RhdGlvbiBvciB0aGVcbiogY29tcGxldGUgYG51bWJlcmAgc3RyaW5nLlxuKlxuKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gVGhlIG51bWJlciB0byBmb3JtYXRcbiogQHBhcmFtIHs/bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBhbW91bnQgb2YgZGlnaXRzIHRvIHByaW50LCBvciBgbnVsbGAgdG9cbiogcHJpbnQgYWxsIGRpZ2l0cy5cbipcbiogQHJldHVybnMge3N0cmluZ31cbipcbiogQGZ1bmN0aW9uIGN1dERpZ2l0c1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5jdXREaWdpdHMgPSBmdW5jdGlvbihudW1iZXIsIGRpZ2l0cyA9IG51bGwpIHtcbiAgcmV0dXJuIGRpZ2l0cyA9PT0gbnVsbFxuICAgID8gbnVtYmVyLnRvU3RyaW5nKClcbiAgICA6IG51bWJlci50b0ZpeGVkKGRpZ2l0cyk7XG59XG5cbiJdfQ==
