// RAC - ruler-and-compass - 1.1.0-dev - development with sourcemaps
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version
module.exports = {
	version: '1.1.0-dev',
	build: '827-9288d7b'
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

    this.stack = [];
    this.shapeStack = [];
    this.compositeStack = [];

    /**
    * Drawer of the instance. This object handles the drawing of all
    * drawable object using this instance of `Rac`.
    * @type {object}
    */
    this.drawer = null;

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

    /**
    * Controller of the instance. This objecs handles all of the controls
    * and pointer events related to this instance of `Rac`.
    */
    this.controller = new Rac.Controller(this);
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


  pushStack(obj) {
    this.stack.push(obj);
  }


  peekStack() {
    if (this.stack.length <= 0) {
      return null;
    }
    return this.stack[this.stack.length - 1];
  }


  popStack() {
    if (this.stack.length <= 0) {
      return null;
    }
    return this.stack.pop();
  }


  pushShape(shape = null) {
    shape = shape ?? new Rac.Shape(this);
    this.shapeStack.push(shape);
    return shape;
  }


  peekShape() {
    if (this.shapeStack.length <= 0) {
      return null;
    }
    return this.shapeStack[this.shapeStack.length - 1];
  }


  popShape() {
    if (this.shapeStack.length <= 0) {
      return null;
    }
    return this.shapeStack.pop();
  }


  pushComposite(composite) {
    composite = composite ?? new Rac.Composite(this);
    this.compositeStack.push(composite);
    return composite;
  }


  peekComposite() {
    if (this.compositeStack.length <= 0) {
      return null;
    }
    return this.compositeStack[this.compositeStack.length - 1];
  }


  popComposite() {
    if (this.compositeStack.length <= 0) {
      return null;
    }
    return this.compositeStack.pop();
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


// StyleContainer
Rac.StyleContainer = require('./style/StyleContainer');
Rac.setupStyleProtoFunctions(Rac.StyleContainer);


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


// RayControl
Rac.RayControl = require('./control/RayControl');


// ArcControl
Rac.ArcControl = require('./control/ArcControl');


},{"../built/version":1,"./attachInstanceFunctions":3,"./attachProtoFunctions":4,"./control/ArcControl":5,"./control/Control":6,"./control/Controller":7,"./control/RayControl":8,"./drawable/Angle":9,"./drawable/Arc":10,"./drawable/Bezier":11,"./drawable/Composite":12,"./drawable/Point":13,"./drawable/Ray":14,"./drawable/Segment":15,"./drawable/Shape":16,"./drawable/Text":17,"./drawable/instance.Angle":18,"./drawable/instance.Arc":19,"./drawable/instance.Bezier":20,"./drawable/instance.Point":21,"./drawable/instance.Ray":22,"./drawable/instance.Segment":23,"./drawable/instance.Text":24,"./p5Drawer/P5Drawer":26,"./style/Color":32,"./style/Fill":33,"./style/Stroke":34,"./style/StyleContainer":35,"./style/instance.Color":36,"./style/instance.Fill":37,"./style/instance.Stroke":38,"./util/EaseFunction":39,"./util/Exception":40,"./util/utils":41}],3:[function(require,module,exports){
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


  Rac.drawableProtoFunctions.push = function() {
    this.rac.pushStack(this);
    return this;
  }


  Rac.drawableProtoFunctions.pop = function() {
    return this.rac.popStack();
  }


  Rac.drawableProtoFunctions.peek = function() {
    return this.rac.peekStack();
  }


  Rac.drawableProtoFunctions.attachToShape = function() {
    this.rac.peekShape().addOutline(this);
    return this;
  }


  Rac.drawableProtoFunctions.popShape = function() {
    return this.rac.popShape();
  }


  Rac.drawableProtoFunctions.popShapeToComposite = function() {
    let shape = this.rac.popShape();
    this.rac.peekComposite().add(shape);
    return this;
  }


  Rac.drawableProtoFunctions.attachToComposite = function() {
    this.rac.peekComposite().add(this);
    return this;
  }


  Rac.drawableProtoFunctions.popComposite = function() {
    return this.rac.popComposite();
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


  Rac.styleProtoFunctions.log = Rac.drawableProtoFunctions.log;


  Rac.styleProtoFunctions.applyToClass = function(classObj) {
    assertDrawer(this);
    this.rac.drawer.setClassDrawStyle(classObj, this);
  };

}; // attachProtoFunctions


},{"./util/utils":41}],5:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Control that uses an `Arc` as anchor.
*
* ⚠️ The API for controls is **planned to change** in a future minor release. ⚠️
*
* @alias Rac.ArcControl
*/
class ArcControl extends Rac.Control {

  // Creates a new Control instance with the given `value` and an
  // `angleDistance` from `someAngleDistance`.
  // By default the value range is [0,1] and limits are set to be the equal
  // as `startValue` and `endValue`.
  constructor(rac, value, angleDistance) {
    utils.assertExists(rac, angleDistance);
    utils.assertNumber(value);

    super(rac, value);

    // Angle distance for the copied anchor object.
    this.angleDistance = Rac.Angle.from(rac, angleDistance);

    // `Arc`` to which the control will be anchored. When the control is
    // drawn and interacted a copy of the anchor is created with the
    // control's `angleDistance`.
    this.anchor = null;

    if (rac.controller.autoAddControls) {
      rac.controller.add(this);
    }
  }

  setValueWithAngleDistance(valueAngleDistance) {
    valueAngleDistance = Rac.Angle.from(this.rac, valueAngleDistance)
    let distanceRatio = valueAngleDistance.turn / this.angleDistance.turnOne();
    this.value = distanceRatio;
  }

  setLimitsWithAngleDistanceInsets(startInset, endInset) {
    startInset = Rac.Angle.from(this.rac, startInset);
    endInset = Rac.Angle.from(this.rac, endInset);
    this.startLimit = startInset.turn / this.angleDistance.turnOne();
    this.endLimit = (this.angleDistance.turnOne() - endInset.turn) / this.angleDistance.turnOne();
  }

  // Returns the angle distance from `anchor.start` to the control knob.
  distance() {
    return this.angleDistance.multOne(this.value);
  }

  knob() {
    if (this.anchor === null) {
      // Not posible to calculate knob
      return null;
    }
    return this.anchor.pointAtAngleDistance(this.distance());
  }

  // Creates a copy of the current `anchor` with the control's
  // `angleDistance`.
  affixAnchor() {
    if (this.anchor === null) { return null; }
    return this.anchor.withAngleDistance(this.angleDistance);
  }

  draw() {
    if (this.anchor === null) {
      // Unable to draw without anchor
      return;
    }

    let fixedAnchor = this.affixAnchor();

    let controllerStyle = this.rac.controller.controlStyle;
    let controlStyle = controllerStyle !== null
      ? controllerStyle.appendStyle(this.style)
      : this.style;

    // Arc anchor is always drawn without fill
    let anchorStyle = controlStyle !== null
      ? controlStyle.appendStyle(this.rac.Fill.none)
      : this.rac.Fill.none;

    fixedAnchor.draw(anchorStyle);

    let knob = this.knob();
    let angle = fixedAnchor.center.angleToPoint(knob);

    this.rac.pushComposite();

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let markerAngleDistance = this.angleDistance.multOne(item);
      let markerAngle = fixedAnchor.shiftAngle(markerAngleDistance);
      let point = fixedAnchor.pointAtAngle(markerAngle);
      Rac.Control.makeValueMarker(this.rac, point, markerAngle.perpendicular(!fixedAnchor.clockwise))
        .attachToComposite();
    }, this);

    // Control knob
    knob.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    // Negative arrow
    if (this.value >= this.startLimit + this.rac.unitaryEqualityThreshold) {
      let negAngle = angle.perpendicular(fixedAnchor.clockwise).inverse();
      Rac.Control.makeArrowShape(this.rac, knob, negAngle)
        .attachToComposite();
    }

    // Positive arrow
    if (this.value <= this.endLimit - this.rac.unitaryEqualityThreshold) {
      let posAngle = angle.perpendicular(fixedAnchor.clockwise);
      Rac.Control.makeArrowShape(this.rac, knob, posAngle)
        .attachToComposite();
    }

    this.rac.popComposite().draw(controlStyle);

    // Selection
    if (this.isSelected()) {
      let pointerStyle = this.rac.controller.pointerStyle;
      if (pointerStyle !== null) {
        knob.arc(this.rac.controller.knobRadius * 1.5).draw(pointerStyle);
      }
    }
  }

  updateWithPointer(pointerControlCenter, fixedAnchor) {
    let angleDistance = fixedAnchor.angleDistance();
    let startInset = angleDistance.multOne(this.startLimit);
    let endInset = angleDistance.multOne(1 - this.endLimit);

    let selectionAngle = fixedAnchor.center
      .angleToPoint(pointerControlCenter);
    selectionAngle = fixedAnchor.clampToAngles(selectionAngle,
      startInset, endInset);
    let newDistance = fixedAnchor.distanceFromStart(selectionAngle);

    // Update control with new distance
    let distanceRatio = newDistance.turn / this.angleDistance.turnOne();
    this.value = distanceRatio;
  }

  drawSelection(pointerCenter, fixedAnchor, pointerOffset) {
    let pointerStyle = this.rac.controller.pointerStyle;
    if (pointerStyle === null) { return; }

    // Arc anchor is always drawn without fill
    let anchorStyle = pointerStyle.appendStyle(this.rac.Fill.none);
    fixedAnchor.draw(anchorStyle);

    let angleDistance = fixedAnchor.angleDistance();

    this.rac.pushComposite();

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let markerAngle = fixedAnchor.shiftAngle(angleDistance.multOne(item));
      let markerPoint = fixedAnchor.pointAtAngle(markerAngle);
      Rac.Control.makeValueMarker(this.rac, markerPoint, markerAngle.perpendicular(!fixedAnchor.clockwise))
        .attachToComposite();
    });

    // Limit markers
    if (this.startLimit > 0) {
      let minAngle = fixedAnchor.shiftAngle(angleDistance.multOne(this.startLimit));
      let minPoint = fixedAnchor.pointAtAngle(minAngle);
      let markerAngle = minAngle.perpendicular(fixedAnchor.clockwise);
      Rac.Control.makeLimitMarker(this.rac, minPoint, markerAngle)
        .attachToComposite();
    }

    if (this.endLimit < 1) {
      let maxAngle = fixedAnchor.shiftAngle(angleDistance.multOne(this.endLimit));
      let maxPoint = fixedAnchor.pointAtAngle(maxAngle);
      let markerAngle = maxAngle.perpendicular(!fixedAnchor.clockwise);
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

    this.rac.popComposite().draw(pointerStyle);

    // TODO: implement arc control dragging visuals!
  }

} // class ArcControl


module.exports = ArcControl;


},{"../Rac":2,"../util/utils":41}],6:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Abstract class for controls that select a value within a range.
*
* Depending on the implementation, controls may use an `anchor` object
* to determine the visual position of the control's interactive elements.
* The `anchor` is tightly coupled with the specific implementation of a
* control, for example `[ArcControl]{@link Rac.ArcControl}` uses an
* `[Arc]{@link Rac.Arc}` as anchor, which defines where the control is
* drawn, what orientation it uses, and the position of the control knob
* through the range of possible values.
*
* A control keeps a `value` property in the range *[0,1]* for the currently
* selected value.
*
* The `projectionStart` and `projectionEnd` properties can be used to
* project `value` into the range `[projectionStart,projectionEnd]` by using
* the `projectedValue()` method.
*
* The `startLimit` and `endLimit` can be used to restrain the allowable
* values that can be selected through user interaction. Both are set in
* *[0,1]* range.
*
* @alias Rac.Control
*/
class Control {

  /**
  * Creates a new `Control` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} value - The initial value of the control, in the
  *   *[0,1]* range
  */
  constructor(rac, value) {
    utils.assertExists(rac);
    utils.assertNumber(value);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * Current selected value, in the range *[0,1]*.
    *
    * May be further constrained to `[startLimit,endLimit]`.
    *
    * @type {number}
    */
    this.value = value;

    /**
    * [Projected value]{@link Rac.Control#projectedValue} to use when
    * `value` is `0`.
    *
    * @type {number}
    * @default 0
    */
    this.projectionStart = 0;

    /**
    * [Projected value]{@link Rac.Control#projectedValue} to use when
    * `value` is `1`.
    *
    * @type {number}
    * @default 1
    */
    this.projectionEnd = 1;

    /**
    * Minimum `value` that can be selected through user interaction.
    *
    * @type {number}
    * @default 0
    */
    this.startLimit = 0;

    /**
    * Maximum `value` that can be selected through user interaction.
    *
    * @type {number}
    * @default 1
    */
    this.endLimit = 1;

    /**
    * Collection of values at which visual markers are drawn.
    *
    * @type {number[]}
    * @default []
    */
    this.markers = [];

    /**
    * Style to apply when drawing. This style gets applied after
    * `[rac.controller.controlStyle]{@link Rac.Controller#controlStyle}`.
    *
    * @type {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} [style=null]
    * @default null
    */
    this.style = null;
  }


  /**
  * Returns `value` projected into the range
  * `[projectionStart,projectionEnd]`.
  *
  * By default the projection range is *[0,1]*, in which case `value` and
  * `projectedValue()` are the same. Projection ranges with a negative
  * direction (when `projectionStart` is greater that `projectionEnd`) are
  * supported.
  *
  * > E.g.
  * > ```
  * > For a control with a projection range of [100,200]
  * > + when value is 0,   projectionValue() is 100
  * > + when value is 0.5, projectionValue() is 150
  * > + when value is 1,   projectionValue() is 200
  * >
  * > For a control with a projection range of [50, 40]
  * > + when value is 0,   projectionValue() is 50
  * > + when value is 0.5, projectionValue() is 45
  * > + when value is 1,   projectionValue() is 40
  * > ```
  *
  * @returns {number}
  */
  projectedValue() {
    let projectionRange = this.projectionEnd - this.projectionStart;
    return (this.value * projectionRange) + this.projectionStart;
  }

  // TODO: reintroduce when tested
  // Returns the corresponding value in the range *[0,1]* for the
  // `projectedValue` in the range `[projectionStart,projectionEnd]`.
  // valueOfProjected(projectedValue) {
  //   let projectionRange = this.projectionEnd - this.projectionStart;
  //   return (projectedValue - this.projectionStart) / projectionRange;
  // }


  /**
   * Sets both `startLimit` and `endLimit` with the given insets from `0`,
   * `1`, correspondingly.
   *
   * > E.g.
   * > ```
   * > control.setLimitsWithInsets(0.1, 0.2)
   * > // sets startLimit as 0.1
   * > // sets endLimit   as 0.8
   * > ```
   *
   * @param {number} startInset - The inset from `0` to use for `startLimit`
   * @param {number} endInset - The inset from `1` to use for `endLimit`
   */
  setLimitsWithInsets(startInset, endInset) {
    this.startLimit = startInset;
    this.endLimit = 1 - endInset;
  }


  // TODO: reintroduce when tested
  // Sets `startLimit` and `endLimit` with two inset values relative to the
  // [0,1] range.
  // setLimitsWithProjectionInsets(startInset, endInset) {
  //   this.startLimit = this.valueOf(startInset);
  //   this.endLimit = this.valueOf(1 - endInset);
  // }


  /**
  * Adds a marker at the current `value`.
  */
  addMarkerAtCurrentValue() {
    this.markers.push(this.value);
  }

  /**
  * Returns `true` when this control is the currently selected control.
  *
  * @returns {boolean}
  */
  isSelected() {
    if (this.rac.controller.selection === null) {
      return false;
    }
    return this.rac.controller.selection.control === this;
  }


  /**
  * Returns a `Point` at the center of the control knob.
  *
  * > This function must be overriden by an extending class. Calling this
  * implementation throws an error.
  *
  * @abstract
  * @return {Rac.Point}
  */
  knob() {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }


  /**
  * Returns a copy of the anchor be persited during user interaction.
  *
  * The implementation is free to determine the type used for `anchor` and
  * `affixAnchor()`.
  *
  * This fixed anchor is passed back to the control through
  * `[updateWithPointer]{@link Rac.Control#updateWithPointer}` and
  * `[drawSelection]{@link Rac.Control#drawSelection}` during user
  * interaction.
  *
  * > This function must be overriden by an extending class. Calling this
  * implementation throws an error.
  *
  * @abstract
  * @return {object}
  */
  affixAnchor() {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }


  /**
  * Draws the current state.
  *
  * > This method must be overriden by an extending class. Calling this
  * implementation throws an error.
  *
  * @abstract
  */
  draw() {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }

  /**
  * Updates `value` with `pointerCenter` in relation to `fixedAnchor`.
  * Called by `[rac.controller.pointerDragged]{@link Rac.Controller#pointerDragged}`
  * as the user interacts with the control.
  *
  * > This function must be overriden by an extending class. Calling this
  * implementation throws an error.
  *
  * @abstract
  */
  updateWithPointer(pointerCenter, fixedAnchor) {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }

  /**
  * Draws the selection state along with pointer interaction visuals.
  * Called by `[rac.controller.drawControls]{@link Rac.Controller#drawControls}`
  * only for the currently selected control.
  *
  * > This function must be overriden by an extending class. Calling this
  * implementation throws an error.
  *
  * @abstract
  */
  drawSelection(pointerCenter, fixedAnchor, pointerOffset) {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
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
  rac.pushShape();
  point.segmentToPoint(arc.startPoint())
    .attachToShape();
  arc.attachToShape();
  arc.endPoint().segmentToPoint(point)
    .attachToShape();

  return rac.popShape();
};

Control.makeLimitMarker = function(rac, point, angle) {
  angle = rac.Angle.from(angle);
  let perpendicular = angle.perpendicular(false);
  let composite = new Rac.Composite(rac);

  point.segmentToAngle(perpendicular, 4)
    .withStartExtension(4)
    .attachTo(composite);
  point.pointToAngle(perpendicular, 8).arc(3)
    .attachTo(composite);

  return composite;
};

Control.makeValueMarker = function(rac, point, angle) {
  angle = rac.Angle.from(angle);
  return point.segmentToAngle(angle.perpendicular(), 3)
    .withStartExtension(3);
};


},{"../Rac":2,"../util/utils":41}],7:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Container for information regarding the currently selected `Control`.
*
* @alias Rac.Controller.Selection
*/
class ControlSelection{
  constructor(control, pointerCenter) {
    // Selected control instance.
    this.control = control;
    // Copy of the control anchor, so that the control can move tied to
    // the drawing, while the interaction range remains fixed.
    this.fixedAnchor = control.affixAnchor();
    // Segment from the captured pointer position to the contro center,
    // used to attach the control to the point where interaction started.
    // Pointer is at `segment.start` and control center is at `segment.end`.
    this.pointerOffset = pointerCenter.segmentToPoint(control.knob());
  }

  drawSelection(pointerCenter) {
    this.control.drawSelection(pointerCenter, this.fixedAnchor, this.pointerOffset);
  }
}


/**
* Manager of interactive controls for an instance of `Rac`.
*
* Contains a list of all managed controls and coordinates drawing and user
* interaction between them.
*
* For controls to be functional the `pointerPressed`, `pointerReleased`,
* and `pointerDragged` methods have to be called as pointer interactions
* happen. The `drawControls` method handles the drawing of all controls
* and the currently selected control, it is usually called at the very end
* of drawing.
*
* Also contains settings shared between all controls and used for user
* interaction, like `pointerStyle` to draw the pointer, `controlStyle` as
* a default style for drawing controls, and `knobRadius` that defines the
* size of the interactive element of most controls.
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

    /**
    * Collection of all controlls managed by the instance. Controls in this
    * list are considered for pointer hit testing and for drawing.
    *
    * @type {Rac.Control[]}
    * @default []
    */
    this.controls = [];

    /**
    * Indicates controls to add themselves into `this.controls` when
    * created.
    *
    * This property is a shared configuration. The behaviour is implemented
    * independently by each control constructor.
    *
    * @type {boolean}
    * @default true
    */
    this.autoAddControls = true;

    // TODO: separate lastControl from lastPointer

    // Last `Point` of the position when the pointer was pressed, or last
    // Control interacted with. Set to `null` when there has been no
    // interaction yet and while there is a selected control.
    this.lastPointer = null;

    /**
    * Style object used for the visual elements related to pointer
    * interaction and control selection. When `null` no pointer or
    * selection visuals are drawn.
    *
    * By default contains a style that uses the current stroke
    * configuration with no-fill.
    *
    * @type {?Rac.Stroke|Rac.Fill|Rac.StyleContainer}
    * @default {@link instance.Fill#none}
    */
    this.pointerStyle = rac.Fill.none;

    /**
    * Default style to apply for all controls. When set it is applied
    * before control drawing. The individual control style in
    * `[control.style]{@link Rac.Control#style}` is applied afterwards.
    *
    * @type {?Rac.Stroke|Rac.Fill|Rac.StyleContainer}
    * @default null
    */
    this.controlStyle = null

    /**
    * Selection information for the currently selected control, or `null`
    * when there is no selection.
    *
    * @type {?Rac.Controller.Selection}
    */
    this.selection = null;

  } // constructor


  /**
  * Pushes `control` into `this.controls`, allowing the instance to handle
  * pointer interaction and drawing of `control`.
  *
  * @param {Rac.Control} control - A `Control` to add into `controls`
  */
  add(control) {
    this.controls.push(control);
  }


  /**
  * Notifies the instance that the pointer has been pressed at the
  * `pointerCenter` location. All controls are hit tested and the first
  * control to be hit is marked as selected.
  *
  * This function must be called along pointer press interaction for all
  * managed controls to properly work.
  *
  * @param {Rac.Point} pointerCenter - The location where the pointer was
  *   pressed
  */
  pointerPressed(pointerCenter) {
    this.lastPointer = null;

    // Test pointer hit
    const selected = this.controls.find( item => {
      const controlKnob = item.knob();
      if (controlKnob === null) { return false; }
      if (controlKnob.distanceToPoint(pointerCenter) <= this.knobRadius) {
        return true;
      }
      return false;
    });

    if (selected === undefined) {
      return;
    }

    this.selection = new Controller.Selection(selected, pointerCenter);
  }


  /**
  * Notifies the instance that the pointer has been dragged to the
  * `pointerCenter` location. When there is a selected control, user
  * interaction is performed and the control value is updated.
  *
  * This function must be called along pointer drag interaction for all
  * managed controls to properly work.
  *
  * @param {Rac.Point} pointerCenter - The location where the pointer was
  *   dragged
  */
  pointerDragged(pointerCenter){
    if (this.selection === null) {
      return;
    }

    let control = this.selection.control;
    let fixedAnchor = this.selection.fixedAnchor;

    // Center of dragged control in the pointer current position
    let currentPointerControlCenter = this.selection.pointerOffset
      .withStartPoint(pointerCenter)
      .endPoint();

    control.updateWithPointer(currentPointerControlCenter, fixedAnchor);
  }


  /**
  * Notifies the instance that the pointer has been released at the
  * `pointerCenter` location. When there is a selected control, user
  * interaction is finalized and the control selection is cleared.
  *
  * This function must be called along pointer drag interaction for all
  * managed controls to properly work.
  *
  * @param {Rac.Point} pointerCenter - The location where the pointer was
  *   released
  */
  pointerReleased(pointerCenter) {
    if (this.selection === null) {
      this.lastPointer = pointerCenter;
      return;
    }

    this.lastPointer = this.selection.control;
    this.selection = null;
  }


  /**
  * Draws all controls contained in
  * `[controls]{@link Rac.Controller#controls}` along the visual elements
  * for pointer and control selection.
  *
  * Usually called at the end of drawing, as to draw controls on top of
  * other graphics.
  */
  drawControls() {
    let pointerCenter = this.rac.Point.pointer();
    this.drawPointer(pointerCenter);

    // All controls in display
    this.controls.forEach(item => item.draw());

    if (this.selection !== null) {
      this.selection.drawSelection(pointerCenter);
    }
  }


  drawPointer(pointerCenter) {
    let pointerStyle = this.pointerStyle;
    if (pointerStyle === null) {
      return;
    }

    // Last pointer or control
    if (this.lastPointer instanceof Rac.Point) {
      this.lastPointer.arc(12).draw(pointerStyle);
    }
    if (this.lastPointer instanceof Rac.Control) {
      // TODO: implement last selected control state
    }

    // Pointer pressed
    if (this.rac.drawer.p5.mouseIsPressed) {
      if (this.selection === null) {
        pointerCenter.arc(10).draw(pointerStyle);
      } else {
        pointerCenter.arc(5).draw(pointerStyle);
      }
    }
  }


} // class Controller


module.exports = Controller;


},{"../Rac":2,"../util/utils":41}],8:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Control that uses a `Ray` as anchor.
*
* ⚠️ The API for controls is **planned to change** in a future minor release. ⚠️
*
* @alias Rac.RayControl
*/
class RayControl extends Rac.Control {

  // Creates a new Control instance with the given `value` and `length`.
  // By default the value range is [0,1] and limits are set to be the equal
  // as `startValue` and `endValue`.
  constructor(rac, value, length) {
    utils.assertExists(rac, value, length);

    super(rac, value);

    // Length for the copied anchor shape.
    this.length = length;

    // Ray to which the control will be anchored. When the control is
    // drawn and interacted a Segment is created with control's `length`.
    this.anchor = null;

    if (rac.controller.autoAddControls) {
      rac.controller.add(this);
    }
  }

  setValueWithLength(lengthValue) {
    let lengthRatio = lengthValue / this.length;
    this.value = lengthRatio;
  }

  // Sets `startLimit` and `endLimit` with two inset values relative to
  // zero and `length`.
  setLimitsWithLengthInsets(startInset, endInset) {
    this.startLimit = startInset / this.length;
    this.endLimit = (this.length - endInset) / this.length;
  }


  // Returns the distance from `anchor.start` to the control knob.
  distance() {
    return this.length * this.value;
  }

  knob() {
    if (this.anchor === null) {
      // Not posible to calculate the knob
      return null;
    }
    return this.anchor.pointAtDistance(this.distance());
  }

  // Creates a copy of the anchor: a new `Segment` based on `anchor` with
  // the current `length`.
  affixAnchor() {
    if (this.anchor === null) { return null; }
    return this.anchor.segment(this.length);
  }

  draw() {
    if (this.anchor === null) {
      // Unable to draw without anchor
      return;
    }

    let fixedAnchor = this.affixAnchor();

    let controllerStyle = this.rac.controller.controlStyle;
    let controlStyle = controllerStyle !== null
      ? controllerStyle.appendStyle(this.style)
      : this.style;

    fixedAnchor.draw(controlStyle);

    let knob = this.knob();
    let angle = fixedAnchor.angle();

    this.rac.pushComposite();

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let point = fixedAnchor.startPoint().pointToAngle(angle, this.length * item);
      Rac.Control.makeValueMarker(this.rac, point, angle)
        .attachToComposite();
    }, this);

    // Control knob
    knob.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    // Negative arrow
    if (this.value >= this.startLimit + this.rac.unitaryEqualityThreshold) {
      Rac.Control.makeArrowShape(this.rac, knob, angle.inverse())
        .attachToComposite();
    }

    // Positive arrow
    if (this.value <= this.endLimit - this.rac.unitaryEqualityThreshold) {
      Rac.Control.makeArrowShape(this.rac, knob, angle)
        .attachToComposite();
    }

    this.rac.popComposite().draw(controlStyle);

    // Selection
    if (this.isSelected()) {
      let pointerStyle = this.rac.controller.pointerStyle;
      if (pointerStyle !== null) {
        knob.arc(this.rac.controller.knobRadius * 1.5).draw(pointerStyle);
      }
    }
  }

  updateWithPointer(pointerControlCenter, fixedAnchor) {
    let length = fixedAnchor.length;
    let startInset = length * this.startLimit;
    let endInset = length * (1 - this.endLimit);

    // New value from the current pointer position, relative to fixedAnchor
    let newDistance = fixedAnchor
      .ray.distanceToProjectedPoint(pointerControlCenter);
    // Clamping value (javascript has no Math.clamp)
    newDistance = fixedAnchor.clampToLength(newDistance,
      startInset, endInset);

    // Update control with new distance
    let lengthRatio = newDistance / length;
    this.value = lengthRatio;
  }

  drawSelection(pointerCenter, fixedAnchor, pointerOffset) {
    let pointerStyle = this.rac.controller.pointerStyle;
    if (pointerStyle === null) { return; }

    this.rac.pushComposite();
    fixedAnchor.attachToComposite();

    let angle = fixedAnchor.angle();
    let length = fixedAnchor.length;

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let markerPoint = fixedAnchor.startPoint().pointToAngle(angle, length * item);
      Rac.Control.makeValueMarker(this.rac, markerPoint, angle)
        .attachToComposite();
    });

    // Limit markers
    if (this.startLimit > 0) {
      let minPoint = fixedAnchor.startPoint().pointToAngle(angle, length * this.startLimit);
      Rac.Control.makeLimitMarker(this.rac, minPoint, angle)
        .attachToComposite();
    }

    if (this.endLimit < 1) {
      let maxPoint = fixedAnchor.startPoint().pointToAngle(angle, length * this.endLimit);
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
    let constrainedLength = fixedAnchor
      .ray.distanceToProjectedPoint(draggedCenter);
    let startInset = length * this.startLimit;
    let endInset = length * (1 - this.endLimit);
    constrainedLength = fixedAnchor.clampToLength(constrainedLength,
      startInset, endInset);

    let constrainedAnchorCenter = fixedAnchor
      .withLength(constrainedLength)
      .endPoint();

    // Control center constrained to anchor
    constrainedAnchorCenter.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    // Dragged shadow center, semi attached to pointer
    // always perpendicular to anchor
    let draggedShadowCenter = draggedCenter
      .segmentToProjectionInRay(fixedAnchor.ray)
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
    this.rac.popComposite().draw(pointerStyle);
  }

} // class RayControl


module.exports = RayControl;


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
  *
  * @see Rac.Angle.from
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
  * Returns a new `Arc` with `length` added to the part of the
  * circumference `this` represents. This changes `end` for the
  * new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range `[0,radius*TAU)`. When the resulting `length` is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {number} length - The length to add
  * @returns {Rac.Arc}
  * @see Rac.Arc#length
  */
  withLengthAdd(length) {
    const newAngleDistance = (this.length() + length) / this.circumference();
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
  *
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
  withStartExtension(distance) {
    const newRay = this.ray.translateToDistance(-distance);
    return new Segment(this.rac, newRay, this.length + distance);
  }


  /**
  * Returns a new `Segment` with `distance` added to `this.length`, which
  * results in `endPoint()` for the resulting `Segment` moving in the
  * direction of the segment's ray by the given `distance`.
  *
  * All other properties are copied from `this`.
  *
  * Using a positive `distance` results in a longer segment, using a
  * negative `distance` results in a shorter one.
  *
  * This method performs the same operation as
  * `[withLengthAdd]{@link Rac.Segment#withLengthAdd}`.
  *
  * @param {number} distance - The distance to add to `length`
  * @returns {Rac.Segment}
  */
  withEndExtension(distance) {
    return this.withLengthAdd(distance);
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
* ⚠️ The API for Shape is **planned to change** in a future minor release. ⚠️
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


  withAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return new TextFormat(this.rac,
      this.horizontal, this.vertical,
      this.font,
      angle,
      this.size);
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

  rac.Text.Format.topRight = rac.Text.Format(
    Rac.Text.Format.horizontal.right,
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

    /**
    * Factor applied to stroke weight setting. Stroke weight is set to
    * `stroke.weight * strokeWeightFactor` when applicable.
    *
    * @type {number}
    * @default 1
    */
    this.strokeWeightFactor = 1;

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
        drawer.p5.strokeWeight(stroke.weight * drawer.strokeWeightFactor);
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

    // StyleContainer
    this.setApplyFunction(Rac.StyleContainer, (drawer, container) => {
      container.styles.forEach(item => {
        item.apply();
      });
    });

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
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

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
  let turnString = `turn:${angle.turn.toFixed(digits)}`;
  point
    .pointToAngle(angle, markerRadius*2)
    .text(turnString, format)
    .draw(drawer.debugTextStyle);
}; // debugAngle


exports.debugPoint = function(drawer, point, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

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

  let string = `x:${point.x.toFixed(digits)}\ny:${point.y.toFixed(digits)}`;
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
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

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
    .withStartExtension(-pointRadius)
    .draw();
  let endMarkerEnd = segment
    .nextSegmentPerpendicular(false)
    .withLength(markerRadius/2)
    .withStartExtension(-pointRadius)
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
  let lengthString = `length:${segment.length.toFixed(digits)}`;
  segment.startPoint()
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.subtract(1/4), markerRadius/2)
    .text(lengthString, lengthFormat)
    .draw(drawer.debugTextStyle);

    // Angle
  let angleString = `angle:${angle.turn.toFixed(digits)}`;
  segment.startPoint()
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.add(1/4), markerRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

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
    .withStartExtension(-markerRadius/2)
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

  let startString = `start:${arc.start.turn.toFixed(digits)}`;
  let radiusString = `radius:${arc.radius.toFixed(digits)}`;
  let endString = `end:${arc.end.turn.toFixed(digits)}`;

  let angleDistance = arc.angleDistance();
  let distanceString = `distance:${angleDistance.turn.toFixed(digits)}`;

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
  constructor(rac, color) {
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


  /**
  * Returns a new `StyleContainer` containing only `this`.
  *
  * @returns {Rac.StyleContainer}
  */
  container() {
    return new Rac.StyleContainer(this.rac, [this]);
  }


  /**
  * Returns a new `StyleContainer` containing `this` and `style`. When
  * `style` is `null`, returns `this` instead.
  *
  * @param {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} style - A style object
  *   to contain along `this`
  * @returns {Rac.StyleContainer|Rac.Fill}
  */
  appendStyle(style) {
    if (style === null) {
      return this;
    }
    return new Rac.StyleContainer(this.rac, [this, style]);
  }


  /**
  * Returns a new `StyleContainer` containing `this` and the `Stroke`
  * derived [from]{@link Rac.Stroke.from} `someStroke`.
  *
  * @param {Rac.Stroke|Rac.Color|Rac.Fill} someStroke - An object to derive
  *   a `Stroke` from
  * @returns {Rac.StyleContainer}
  *
  * @see Rac.Stroke.from
  */
  appendStroke(someStroke) {
    let stroke = Rac.Stroke.from(this.rac, someStroke);
    return new Rac.StyleContainer(this.rac, [this, stroke]);
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
  * @param {?Rac.Color} [color=null] - A `Color` for the stroke, or `null`
  *   to skip color
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
  *   derive a `Stroke` from
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


  /**
  * Returns a new `StyleContainer` containing only `this`.
  *
  * @returns {Rac.StyleContainer}
  */
  container() {
    return new Rac.StyleContainer(this.rac, [this]);
  }


  /**
  * Returns a new `StyleContainer` containing `this` and `style`. When
  * `style` is `null`, returns `this` instead.
  *
  * @param {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} style - A style object
  *   to contain along `this`
  * @returns {Rac.StyleContainer|Rac.Stroke}
  */
  appendStyle(style) {
    if (style === null) {
      return this;
    }
    return new Rac.StyleContainer(this.rac, [this, style]);
  }


  /**
  * Returns a new `StyleContainer` containing `this` and the `Fill`
  * derived [from]{@link Rac.Fill.from} `someFill`.
  *
  * @param {Rac.Fill|Rac.Color|Rac.Stroke} someFill - An object to derive
  *   a `Fill` from
  * @returns {Rac.StyleContainer}
  *
  * @see Rac.Fill.from
  */
  appendFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Rac.StyleContainer(this.rac, [this, fill]);
  }

} // class Stroke


module.exports = Stroke;


},{"../Rac":2,"../util/utils":41}],35:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Container of `[Stroke]{@link Rac.Stroke}` and `[Fill]{@link Rac.Fill}`
* objects which get applied sequentially when drawing.
*
* Can be used as `container.apply()` to apply the contained styles
* globally, or as the parameter of `drawable.draw(container)` to apply the
* style settings only for that `draw`.
*
* @alias Rac.StyleContainer
*/
class StyleContainer {

  constructor(rac, styles = []) {
    utils.assertExists(rac);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * Container of style objects to apply.
    *
    * Can be manipulated directly to add or remove styles from `this`.
    * Most of the implemented methods like
    * `[add]{@link Rac.StyleContainer#add}` return a new `StyleContainer`
    * with an copy of `this.styles`.
    *
    * @type {Array}
    */
    this.styles = styles;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @returns {string}
  */
  toString() {
    let contents = this.styles.join(' ');
    return `StyleContainer(${contents})`;
  }


  /**
  * Returns a new `StyleContainer` containing a copy of `this.styles`.
  *
  * @returns {Rac.StyleContainer}
  */
  container() {
    return new Rac.StyleContainer(this.rac, this.styles.slice());
  }


  /**
  * Returns a new `StyleContainer` with `style` appended at the end of
  * `styles`. When `style` is `null`, returns `this` instead.
  *
  * `this` is not modified by this method, the new `StyleContainer` is
  * created with a copy of `this.styles`.
  *
  * @param {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} style - A style object
  *   to append to `styles`
  * @returns {Rac.StyleContainer}
  */
  appendStyle(style) {
    if (style === null) {
      return this;
    }

    let stylesCopy = this.styles.slice();
    stylesCopy.push(style);
    return new Rac.StyleContainer(this.rac, stylesCopy);
  }

} // class StyleContainer


module.exports = StyleContainer;


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

  static drawerNotSetup         = Exception.named('DrawerNotSetup');
  static failedAssert           = Exception.named('FailedAssert');
  static invalidObjectType      = Exception.named('InvalidObjectType');
  static abstractFunctionCalled = Exception.named('AbstractFunctionCalled');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sL1JheUNvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BcmMuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlJheS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9wNURyYXdlci9QNURyYXdlci5qcyIsInNyYy9wNURyYXdlci9Qb2ludC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvUmF5LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9TZWdtZW50LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9kZWJ1Zy5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZHJhdy5mdW5jdGlvbnMuanMiLCJzcmMvc3R5bGUvQ29sb3IuanMiLCJzcmMvc3R5bGUvRmlsbC5qcyIsInNyYy9zdHlsZS9TdHJva2UuanMiLCJzcmMvc3R5bGUvU3R5bGVDb250YWluZXIuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuQ29sb3IuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuRmlsbC5qcyIsInNyYy9zdHlsZS9pbnN0YW5jZS5TdHJva2UuanMiLCJzcmMvdXRpbC9FYXNlRnVuY3Rpb24uanMiLCJzcmMvdXRpbC9FeGNlcHRpb24uanMiLCJzcmMvdXRpbC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25TQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9VQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwc0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Z0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlU3RyaWN0JztcblxuLy8gUnVsZXIgYW5kIENvbXBhc3MgLSB2ZXJzaW9uXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0dmVyc2lvbjogJzEuMS4wLWRldicsXG5cdGJ1aWxkOiAnODI3LTkyODhkN2InXG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLy8gUnVsZXIgYW5kIENvbXBhc3NcbmNvbnN0IHZlcnNpb24gPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJykudmVyc2lvbjtcbmNvbnN0IGJ1aWxkICAgPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJykuYnVpbGQ7XG5cblxuLyoqXG4qIFJvb3QgY2xhc3Mgb2YgUkFDLiBBbGwgZHJhd2FibGUsIHN0eWxlLCBjb250cm9sLCBhbmQgZHJhd2VyIGNsYXNzZXMgYXJlXG4qIGNvbnRhaW5lZCBpbiB0aGlzIGNsYXNzLlxuKlxuKiBBbiBpbnN0YW5jZSBtdXN0IGJlIGNyZWF0ZWQgd2l0aCBgbmV3IFJhYygpYCBpbiBvcmRlciB0b1xuKiBidWlsZCBkcmF3YWJsZSwgc3R5bGUsIGFuZCBvdGhlciBvYmplY3RzLlxuKlxuKiBUbyBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucywgYSBkcmF3ZXIgbXVzdCBiZSBzZXR1cCB3aXRoXG4qIGBbc2V0dXBEcmF3ZXJde0BsaW5rIFJhYyNzZXR1cERyYXdlcn1gLiBDdXJyZW50bHkgdGhlIG9ubHkgYXZhaWxhYmxlXG4qIGltcGxlbWVudGF0aW9uIGlzIGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gLlxuKi9cbmNsYXNzIFJhYyB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBSYWMuIFRoZSBuZXcgaW5zdGFuY2UgaGFzIG5vIGBkcmF3ZXJgIHNldHVwLlxuICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICogVmVyc2lvbiBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMudmVyc2lvbn1gLlxuICAgICpcbiAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgKlxuICAgICogQG5hbWUgdmVyc2lvblxuICAgICogQG1lbWJlcm9mIFJhYyNcbiAgICAqL1xuICAgIHV0aWxzLmFkZENvbnN0YW50VG8odGhpcywgJ3ZlcnNpb24nLCB2ZXJzaW9uKTtcblxuXG4gICAgLyoqXG4gICAgKiBCdWlsZCBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMuYnVpbGR9YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICpcbiAgICAqIEBuYW1lIGJ1aWxkXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAnYnVpbGQnLCBidWlsZCk7XG5cblxuICAgIC8qKlxuICAgICogVmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkgYmV0d2VlbiB0d28gbnVtZXJpYyB2YWx1ZXMuIFVzZWQgZm9yXG4gICAgKiB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGJlIGludGVnZXJzLCBsaWtlIHNjcmVlbiBjb29yZGluYXRlcy4gVXNlZCBieVxuICAgICogYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICAgKlxuICAgICogV2hlbiBjaGVja2luZyBmb3IgZXF1YWxpdHkgYHhgIGlzIGVxdWFsIHRvIG5vbi1pbmNsdXNpdmVcbiAgICAqIGAoeC1lcXVhbGl0eVRocmVzaG9sZCwgeCtlcXVhbGl0eVRocmVzaG9sZClgOlxuICAgICogKyBgeGAgaXMgKipub3QgZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZGBcbiAgICAqICsgYHhgIGlzICoqZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZC8yYFxuICAgICpcbiAgICAqIER1ZSB0byBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gc29tZSBvcGVydGF0aW9uIGxpa2UgaW50ZXJzZWN0aW9uc1xuICAgICogY2FuIHJldHVybiBvZGQgb3Igb3NjaWxhdGluZyB2YWx1ZXMuIFRoaXMgdGhyZXNob2xkIGlzIHVzZWQgdG8gc25hcFxuICAgICogdmFsdWVzIHRvbyBjbG9zZSB0byBhIGxpbWl0LCBhcyB0byBwcmV2ZW50IG9zY2lsYXRpbmcgZWZlY3RzIGluXG4gICAgKiB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIERlZmF1bHQgdmFsdWUgaXMgYmFzZWQgb24gYDEvMTAwMGAgb2YgYSBwb2ludC5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5lcXVhbGl0eVRocmVzaG9sZCA9IDAuMDAxO1xuXG5cblxuICAgIC8qKlxuICAgICogVmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkgYmV0d2VlbiB0d28gdW5pdGFyeSBudW1lcmljIHZhbHVlcy5cbiAgICAqIFVzZWQgZm9yIHZhbHVlcyB0aGF0IHRlbmQgdG8gZXhpc3QgaW4gdGhlIGBbMCwgMV1gIHJhbmdlLCBsaWtlXG4gICAgKiBge0BsaW5rIFJhYy5BbmdsZSN0dXJufWAuIFVzZWQgYnkgYHtAbGluayBSYWMjdW5pdGFyeUVxdWFsc31gLlxuICAgICpcbiAgICAqIEVxdWFsaXR5IGxvZ2ljIGlzIHRoZSBzYW1lIGFzIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAuXG4gICAgKlxuICAgICogRGVmYXVsdCB2YWx1ZSBpcyBiYXNlZCBvbiAxLzAwMCBvZiB0aGUgdHVybiBvZiBhbiBhcmMgb2YgcmFkaXVzIDUwMFxuICAgICogYW5kIGxlbmd0aCBvZiAxOiBgMS8oNTAwKjYuMjgpLzEwMDBgXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkID0gMC4wMDAwMDAzO1xuXG4gICAgdGhpcy5zdGFjayA9IFtdO1xuICAgIHRoaXMuc2hhcGVTdGFjayA9IFtdO1xuICAgIHRoaXMuY29tcG9zaXRlU3RhY2sgPSBbXTtcblxuICAgIC8qKlxuICAgICogRHJhd2VyIG9mIHRoZSBpbnN0YW5jZS4gVGhpcyBvYmplY3QgaGFuZGxlcyB0aGUgZHJhd2luZyBvZiBhbGxcbiAgICAqIGRyYXdhYmxlIG9iamVjdCB1c2luZyB0aGlzIGluc3RhbmNlIG9mIGBSYWNgLlxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZHJhd2VyID0gbnVsbDtcblxuICAgIHJlcXVpcmUoJy4vYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMnKSh0aGlzKTtcblxuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuQ29sb3InKSAgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuU3Ryb2tlJykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuRmlsbCcpICAgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQW5nbGUnKSAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuUG9pbnQnKSAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuUmF5JykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuU2VnbWVudCcpKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQXJjJykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyJykgKHRoaXMpO1xuXG4gICAgLy8gRGVwZW5kcyBvbiBpbnN0YW5jZS5Qb2ludCBhbmQgaW5zdGFuY2UuQW5nbGUgYmVpbmcgYWxyZWFkeSBzZXR1cFxuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuVGV4dCcpKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgKiBDb250cm9sbGVyIG9mIHRoZSBpbnN0YW5jZS4gVGhpcyBvYmplY3MgaGFuZGxlcyBhbGwgb2YgdGhlIGNvbnRyb2xzXG4gICAgKiBhbmQgcG9pbnRlciBldmVudHMgcmVsYXRlZCB0byB0aGlzIGluc3RhbmNlIG9mIGBSYWNgLlxuICAgICovXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFJhYy5Db250cm9sbGVyKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZHJhd2VyIGZvciB0aGUgaW5zdGFuY2UuIEN1cnJlbnRseSBvbmx5IGEgcDUuanMgaW5zdGFuY2UgaXNcbiAgKiBzdXBwb3J0ZWQuXG4gICpcbiAgKiBUaGUgZHJhd2VyIHdpbGwgYWxzbyBwb3B1bGF0ZSBzb21lIGNsYXNzZXMgd2l0aCBwcm90b3R5cGUgZnVuY3Rpb25zXG4gICogcmVsZXZhbnQgdG8gdGhlIGRyYXdlci4gRm9yIHA1LmpzIHRoaXMgaW5jbHVkZSBgYXBwbHlgIGZ1bmN0aW9ucyBmb3JcbiAgKiBjb2xvcnMgYW5kIHN0eWxlIG9iamVjdCwgYW5kIGB2ZXJ0ZXhgIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgb2JqZWN0cy5cbiAgKlxuICAqIEBwYXJhbSB7UDV9IHA1SW5zdGFuY2VcbiAgKi9cbiAgc2V0dXBEcmF3ZXIocDVJbnN0YW5jZSkge1xuICAgIHRoaXMuZHJhd2VyID0gbmV3IFJhYy5QNURyYXdlcih0aGlzLCBwNUluc3RhbmNlKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiBgYWAgYW5kIGBiYCBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gYSBGaXJzdCBudW1iZXIgdG8gY29tcGFyZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBiIFNlY29uZCBudW1iZXIgdG8gY29tcGFyZVxuICAqXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICovXG4gIGVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBsZXQgZGlmZiA9IE1hdGguYWJzKGEtYik7XG4gICAgcmV0dXJuIGRpZmYgPCB0aGlzLmVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiBgYWAgYW5kIGBiYCBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI3VuaXRhcnlFcXVhbGl0eVRocmVzaG9sZH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGEgRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge251bWJlcn0gYiBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKlxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICB1bml0YXJ5RXF1YWxzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhhLWIpO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQ7XG4gIH1cblxuXG4gIHB1c2hTdGFjayhvYmopIHtcbiAgICB0aGlzLnN0YWNrLnB1c2gob2JqKTtcbiAgfVxuXG5cbiAgcGVla1N0YWNrKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG5cbiAgcG9wU3RhY2soKSB7XG4gICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGFjay5wb3AoKTtcbiAgfVxuXG5cbiAgcHVzaFNoYXBlKHNoYXBlID0gbnVsbCkge1xuICAgIHNoYXBlID0gc2hhcGUgPz8gbmV3IFJhYy5TaGFwZSh0aGlzKTtcbiAgICB0aGlzLnNoYXBlU3RhY2sucHVzaChzaGFwZSk7XG4gICAgcmV0dXJuIHNoYXBlO1xuICB9XG5cblxuICBwZWVrU2hhcGUoKSB7XG4gICAgaWYgKHRoaXMuc2hhcGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNoYXBlU3RhY2tbdGhpcy5zaGFwZVN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG5cblxuICBwb3BTaGFwZSgpIHtcbiAgICBpZiAodGhpcy5zaGFwZVN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2hhcGVTdGFjay5wb3AoKTtcbiAgfVxuXG5cbiAgcHVzaENvbXBvc2l0ZShjb21wb3NpdGUpIHtcbiAgICBjb21wb3NpdGUgPSBjb21wb3NpdGUgPz8gbmV3IFJhYy5Db21wb3NpdGUodGhpcyk7XG4gICAgdGhpcy5jb21wb3NpdGVTdGFjay5wdXNoKGNvbXBvc2l0ZSk7XG4gICAgcmV0dXJuIGNvbXBvc2l0ZTtcbiAgfVxuXG5cbiAgcGVla0NvbXBvc2l0ZSgpIHtcbiAgICBpZiAodGhpcy5jb21wb3NpdGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBvc2l0ZVN0YWNrW3RoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuXG4gIHBvcENvbXBvc2l0ZSgpIHtcbiAgICBpZiAodGhpcy5jb21wb3NpdGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBvc2l0ZVN0YWNrLnBvcCgpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmFjXG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYWM7XG5cblxuLy8gQWxsIGNsYXNzIChzdGF0aWMpIHByb3BlcnRpZXMgc2hvdWxkIGJlIGRlZmluZWQgb3V0c2lkZSBvZiB0aGUgY2xhc3Ncbi8vIGFzIHRvIHByZXZlbnQgY3ljbGljIGRlcGVuZGVuY3kgd2l0aCBSYWMuXG5cblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKGAuL3V0aWwvdXRpbHNgKTtcbi8qKlxuKiBDb250YWluZXIgb2YgdXRpbGl0eSBmdW5jdGlvbnMuIFNlZSBge0BsaW5rIHV0aWxzfWAgZm9yIHRoZSBhdmFpbGFibGVcbiogbWVtYmVycy5cbipcbiogQHR5cGUge29iamVjdH1cbiovXG5SYWMudXRpbHMgPSB1dGlscztcblxuXG4vKipcbiogVmVyc2lvbiBvZiB0aGUgY2xhc3MuIFNhbWUgYXMgdGhlIHZlcnNpb24gdXNlZCBmb3IgdGhlIG5wbSBwYWNrYWdlLlxuKlxuKiBAdHlwZSB7c3RyaW5nfVxuKlxuKiBAbmFtZSB2ZXJzaW9uXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ3ZlcnNpb24nLCB2ZXJzaW9uKTtcblxuXG4vKipcbiogQnVpbGQgb2YgdGhlIGNsYXNzLiBJbnRlbmRlZCBmb3IgZGVidWdnaW5nIHB1cnBvdXNlcy5cbipcbiogQ29udGFpbnMgYSBjb21taXQtY291bnQgYW5kIHNob3J0LWhhc2ggb2YgdGhlIHJlcG9zaXRvcnkgd2hlbiB0aGUgYnVpbGRcbiogd2FzIGRvbmUuXG4qXG4qIEB0eXBlIHtzdHJpbmd9XG4qXG4qIEBuYW1lIGJ1aWxkXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ2J1aWxkJywgYnVpbGQpO1xuXG5cbi8qKlxuKiBUYXUsIGVxdWFsIHRvIGBNYXRoLlBJICogMmAuXG4qXG4qIFtUYXUgTWFuaWZlc3RvXShodHRwczovL3RhdWRheS5jb20vdGF1LW1hbmlmZXN0bykuXG4qXG4qIEB0eXBlIHtudW1iZXJ9XG4qXG4qIEBuYW1lIFRBVVxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICdUQVUnLCBNYXRoLlBJICogMik7XG5cblxuLy8gRXhjZXB0aW9uXG5SYWMuRXhjZXB0aW9uID0gcmVxdWlyZSgnLi91dGlsL0V4Y2VwdGlvbicpO1xuXG5cbi8vIFByb3RvdHlwZSBmdW5jdGlvbnNcbnJlcXVpcmUoJy4vYXR0YWNoUHJvdG9GdW5jdGlvbnMnKShSYWMpO1xuXG5cbi8vIFA1RHJhd2VyXG5SYWMuUDVEcmF3ZXIgPSByZXF1aXJlKCcuL3A1RHJhd2VyL1A1RHJhd2VyJyk7XG5cblxuLy8gQ29sb3JcblJhYy5Db2xvciA9IHJlcXVpcmUoJy4vc3R5bGUvQ29sb3InKTtcblxuXG4vLyBTdHJva2VcblJhYy5TdHJva2UgPSByZXF1aXJlKCcuL3N0eWxlL1N0cm9rZScpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuU3Ryb2tlKTtcblxuXG4vLyBGaWxsXG5SYWMuRmlsbCA9IHJlcXVpcmUoJy4vc3R5bGUvRmlsbCcpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuRmlsbCk7XG5cblxuLy8gU3R5bGVDb250YWluZXJcblJhYy5TdHlsZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vc3R5bGUvU3R5bGVDb250YWluZXInKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLlN0eWxlQ29udGFpbmVyKTtcblxuXG4vLyBBbmdsZVxuUmFjLkFuZ2xlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9BbmdsZScpO1xuXG5cbi8vIFBvaW50XG5SYWMuUG9pbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1BvaW50Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5Qb2ludCk7XG5cblxuLy8gUmF5XG5SYWMuUmF5ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9SYXknKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlJheSk7XG5cblxuLy8gU2VnbWVudFxuUmFjLlNlZ21lbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1NlZ21lbnQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlNlZ21lbnQpO1xuXG5cbi8vIEFyY1xuUmFjLkFyYyA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQXJjJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5BcmMpO1xuXG5cbi8vIFRleHRcblJhYy5UZXh0ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9UZXh0Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5UZXh0KTtcblxuXG4vLyBCZXppZXJcblJhYy5CZXppZXIgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0JlemllcicpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQmV6aWVyKTtcblxuXG4vLyBDb21wb3NpdGVcblJhYy5Db21wb3NpdGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0NvbXBvc2l0ZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQ29tcG9zaXRlKTtcblxuXG4vLyBTaGFwZVxuUmFjLlNoYXBlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9TaGFwZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuU2hhcGUpO1xuXG5cbi8vIEVhc2VGdW5jdGlvblxuUmFjLkVhc2VGdW5jdGlvbiA9IHJlcXVpcmUoJy4vdXRpbC9FYXNlRnVuY3Rpb24nKTtcblxuXG4vLyBDb250cm9sbGVyXG5SYWMuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbC9Db250cm9sbGVyJyk7XG5cblxuLy8gQ29udHJvbFxuUmFjLkNvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvQ29udHJvbCcpO1xuXG5cbi8vIFJheUNvbnRyb2xcblJhYy5SYXlDb250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL1JheUNvbnRyb2wnKTtcblxuXG4vLyBBcmNDb250cm9sXG5SYWMuQXJjQ29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9BcmNDb250cm9sJyk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuL1JhYycpO1xuXG5cbi8qKlxuKiBUaGlzIG5hbWVzcGFjZSBsaXN0cyB1dGlsaXR5IGZ1bmN0aW9ucyBhdHRhY2hlZCB0byBhbiBpbnN0YW5jZSBvZlxuKiBge0BsaW5rIFJhY31gIHVzZWQgdG8gcHJvZHVjZSBkcmF3YWJsZSBhbmQgb3RoZXIgb2JqZWN0cywgYW5kIHRvIGFjY2Vzc1xuKiByZWFkeS1idWlsZCBjb252ZW5pZW5jZSBvYmplY3RzIGxpa2UgYHtAbGluayBpbnN0YW5jZS5BbmdsZSNub3J0aH1gIG9yXG4qIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb31gLlxuKlxuKiBEcmF3YWJsZSBhbmQgcmVsYXRlZCBvYmplY3RzIHJlcXVpcmUgYSByZWZlcmVuY2UgdG8gYSBgcmFjYCBpbnN0YW5jZSBpblxuKiBvcmRlciB0byBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucy4gVGhlc2UgZnVuY3Rpb25zIGJ1aWxkIG5ldyBvYmplY3RzXG4qIHVzaW5nIHRoZSBjYWxsaW5nIGBSYWNgIGluc3RhbmNlLCBhbmQgY29udGFpbiByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMgdGhhdCBhcmUgYWxzbyBzZXR1cCB3aXRoIHRoZSBzYW1lIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlXG4qL1xuXG5cbi8vIEF0dGFjaGVzIHRoZSBjb252ZW5pZW5jZSBmdW5jdGlvbnMgdG8gY3JlYXRlIG9iamVjdHMgd2l0aCB0aGlzIGluc3RhbmNlXG4vLyBvZiBSYWMuIFRoZXNlIGZ1bmN0aW9ucyBhcmUgYXR0YWNoZWQgYXMgcHJvcGVydGllcyAoaW5zdGVhZCBvZiBpbnRvIHRoZVxuLy8gcHJvdG90eXBlKSBiZWNhdXNlIHRoZXNlIGFyZSBsYXRlciBwb3B1bGF0ZWQgd2l0aCBtb3JlIHByb3BlcnRpZXMgYW5kXG4vLyBtZXRob2RzLCBhbmQgdGh1cyBuZWVkIHRvIGJlIGFuIGluZGVwZW5kZW50IGluc3RhbmNlLlxuLy9cbi8vIEludGVuZGVkIHRvIHJlY2VpdmUgdGhlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBDb2xvcmAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Db2xvcn1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJcbiAgKiBAcGFyYW0ge251bWJlcn0gZ1xuICAqIEBwYXJhbSB7bnVtYmVyfSBiXG4gICogQHBhcmFtIHtudW1iZXI9fSBhXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5Db2xvclxuICAqXG4gICogQGZ1bmN0aW9uIENvbG9yXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkNvbG9yID0gZnVuY3Rpb24gbWFrZUNvbG9yKHIsIGcsIGIsIGEgPSAxKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuQ29sb3IodGhpcywgciwgZywgYiwgYSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFN0cm9rZWAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5TdHJva2V9YC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gd2VpZ2h0XG4gICogQHBhcmFtIHs/UmFjLkNvbG9yfSBjb2xvclxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlN0cm9rZVxuICAqXG4gICogQGZ1bmN0aW9uIFN0cm9rZVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5TdHJva2UgPSBmdW5jdGlvbiBtYWtlU3Ryb2tlKHdlaWdodCwgY29sb3IgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMsIHdlaWdodCwgY29sb3IpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBGaWxsYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkZpbGx9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbG9yPX0gY29sb3JcbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkZpbGxcbiAgKlxuICAqIEBmdW5jdGlvbiBGaWxsXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkZpbGwgPSBmdW5jdGlvbiBtYWtlRmlsbChjb2xvciA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5GaWxsKHRoaXMsIGNvbG9yKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgU3R5bGVgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU3R5bGV9YC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V9IHN0cm9rZVxuICAqIEBwYXJhbSB7P1JhYy5GaWxsfSBmaWxsXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5TdHlsZVxuICAqXG4gICogQGZ1bmN0aW9uIFN0eWxlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlN0eWxlID0gZnVuY3Rpb24gbWFrZVN0eWxlKHN0cm9rZSA9IG51bGwsIGZpbGwgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGUodGhpcywgc3Ryb2tlLCBmaWxsKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQW5nbGVgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGV9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWUgb2YgdGhlIGFuZ2xlLCBpbiB0aGUgcmFuZ2UgYFtPLDEpYFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFuZ2xlXG4gICpcbiAgKiBAZnVuY3Rpb24gQW5nbGVcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQW5nbGUgPSBmdW5jdGlvbiBtYWtlQW5nbGUodHVybikge1xuICAgIHJldHVybiBuZXcgUmFjLkFuZ2xlKHRoaXMsIHR1cm4pO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBQb2ludGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBQb2ludFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5Qb2ludCA9IGZ1bmN0aW9uIG1ha2VQb2ludCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFJheWAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5SYXl9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUmF5XG4gICpcbiAgKiBAZnVuY3Rpb24gUmF5XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlJheSA9IGZ1bmN0aW9uIG1ha2VSYXkoeCwgeSwgYW5nbGUpIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFNlZ21lbnRgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU2VnbWVudH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlNlZ21lbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBTZWdtZW50XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlNlZ21lbnQgPSBmdW5jdGlvbiBtYWtlU2VnbWVudCh4LCB5LCBhbmdsZSwgbGVuZ3RoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcywgYW5nbGUpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLCByYXksIGxlbmd0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEFyY2Agc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BcmN9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IHN0YXJ0XG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfG51bWJlcn0gW2VuZD1udWxsXVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXVxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFyY1xuICAqXG4gICogQGZ1bmN0aW9uIEFyY1xuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5BcmMgPSBmdW5jdGlvbiBtYWtlQXJjKHgsIHksIHJhZGl1cywgc3RhcnQgPSB0aGlzLkFuZ2xlLnplcm8sIGVuZCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHN0YXJ0ID0gUmFjLkFuZ2xlLmZyb20odGhpcywgc3RhcnQpO1xuICAgIGVuZCA9IGVuZCA9PT0gbnVsbFxuICAgICAgPyBzdGFydFxuICAgICAgOiBSYWMuQW5nbGUuZnJvbSh0aGlzLCBlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLCBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgVGV4dGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5UZXh0fWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBmb3JtYXRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuVGV4dFxuICAqXG4gICogQGZ1bmN0aW9uIFRleHRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuVGV4dCA9IGZ1bmN0aW9uIG1ha2VUZXh0KHgsIHksIHN0cmluZywgZm9ybWF0KSB7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcywgcG9pbnQsIHN0cmluZywgZm9ybWF0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQmV6aWVyYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkJlemllcn1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0WFxuICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFlcbiAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRBbmNob3JYXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0QW5jaG9yWVxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRBbmNob3JYXG4gICogQHBhcmFtIHtudW1iZXJ9IGVuZEFuY2hvcllcbiAgKiBAcGFyYW0ge251bWJlcn0gZW5kWFxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRZXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkJlemllcn1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQmV6aWVyXG4gICpcbiAgKiBAZnVuY3Rpb24gQmV6aWVyXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkJlemllciA9IGZ1bmN0aW9uIG1ha2VCZXppZXIoXG4gICAgc3RhcnRYLCBzdGFydFksIHN0YXJ0QW5jaG9yWCwgc3RhcnRBbmNob3JZLFxuICAgIGVuZEFuY2hvclgsIGVuZEFuY2hvclksIGVuZFgsIGVuZFkpXG4gIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgc3RhcnRYLCBzdGFydFkpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBzdGFydEFuY2hvclgsIHN0YXJ0QW5jaG9yWSk7XG4gICAgY29uc3QgZW5kQW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBlbmRBbmNob3JYLCBlbmRBbmNob3JZKTtcbiAgICBjb25zdCBlbmQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIGVuZFgsIGVuZFkpO1xuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gQXR0YWNoZXMgZnVuY3Rpb25zIHRvIGF0dGFjaCBkcmF3aW5nIGFuZCBhcHBseSBtZXRob2RzIHRvIG90aGVyXG4vLyBwcm90b3R5cGVzLlxuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgUmFjIGNsYXNzIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUHJvdG9GdW5jdGlvbnMoUmFjKSB7XG5cbiAgZnVuY3Rpb24gYXNzZXJ0RHJhd2VyKGRyYXdhYmxlKSB7XG4gICAgaWYgKGRyYXdhYmxlLnJhYyA9PSBudWxsIHx8IGRyYXdhYmxlLnJhYy5kcmF3ZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5kcmF3ZXJOb3RTZXR1cChcbiAgICAgICAgYGRyYXdhYmxlLXR5cGU6JHt1dGlscy50eXBlTmFtZShkcmF3YWJsZSl9YCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgY2xhc3Nlcy5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBkcmF3YWJsZSBvYmplY3RzIChFLmcuIGBkcmF3KClgIGFuZCBgZGVidWcoKWApLlxuICBSYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBPYmplY3Qua2V5cyhSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNsYXNzT2JqLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5kcmF3ID0gZnVuY3Rpb24oc3R5bGUgPSBudWxsKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmRyYXdPYmplY3QodGhpcywgc3R5bGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZGVidWcgPSBmdW5jdGlvbihkcmF3c1RleHQgPSBmYWxzZSl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5kZWJ1Z09iamVjdCh0aGlzLCBkcmF3c1RleHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nID0gZnVuY3Rpb24obWVzc2FnZSA9IG51bGwpe1xuICAgIGxldCBjb2FsZXNjZWRNZXNzYWdlID0gbWVzc2FnZSA/PyAnJW8nO1xuICAgIGNvbnNvbGUubG9nKGNvYWxlc2NlZE1lc3NhZ2UsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLnB1c2hTdGFjayh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBvcFN0YWNrKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucGVla1N0YWNrKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wZWVrU2hhcGUoKS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJhYy5wb3BTaGFwZSgpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZVRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNoYXBlID0gdGhpcy5yYWMucG9wU2hhcGUoKTtcbiAgICB0aGlzLnJhYy5wZWVrQ29tcG9zaXRlKCkuYWRkKHNoYXBlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuYXR0YWNoVG9Db21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wZWVrQ29tcG9zaXRlKCkuYWRkKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BDb21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucG9wQ29tcG9zaXRlKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvID0gZnVuY3Rpb24oc29tZUNvbXBvc2l0ZSkge1xuICAgIGlmIChzb21lQ29tcG9zaXRlIGluc3RhbmNlb2YgUmFjLkNvbXBvc2l0ZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGQodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5TaGFwZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgYXR0YWNoVG8gY29tcG9zaXRlIC0gc29tZUNvbXBvc2l0ZS10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZUNvbXBvc2l0ZSl9YCk7XG4gIH07XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3Igc3R5bGUgY2xhc3Nlcy5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuc3R5bGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBzdHlsZSBvYmplY3RzIChFLmcuIGBhcHBseSgpYCkuXG4gIFJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMgPSBmdW5jdGlvbihjbGFzc09iaikge1xuICAgIE9iamVjdC5rZXlzKFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY2xhc3NPYmoucHJvdG90eXBlW25hbWVdID0gUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNbbmFtZV07XG4gICAgfSk7XG4gIH1cblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmFwcGx5ID0gZnVuY3Rpb24oKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmFwcGx5T2JqZWN0KHRoaXMpO1xuICB9O1xuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMubG9nID0gUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nO1xuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMuYXBwbHlUb0NsYXNzID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLnNldENsYXNzRHJhd1N0eWxlKGNsYXNzT2JqLCB0aGlzKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoUHJvdG9GdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IHVzZXMgYW4gYEFyY2AgYXMgYW5jaG9yLlxuKlxuKiDimqDvuI8gVGhlIEFQSSBmb3IgY29udHJvbHMgaXMgKipwbGFubmVkIHRvIGNoYW5nZSoqIGluIGEgZnV0dXJlIG1pbm9yIHJlbGVhc2UuIOKaoO+4j1xuKlxuKiBAYWxpYXMgUmFjLkFyY0NvbnRyb2xcbiovXG5jbGFzcyBBcmNDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8vIENyZWF0ZXMgYSBuZXcgQ29udHJvbCBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBgdmFsdWVgIGFuZCBhblxuICAvLyBgYW5nbGVEaXN0YW5jZWAgZnJvbSBgc29tZUFuZ2xlRGlzdGFuY2VgLlxuICAvLyBCeSBkZWZhdWx0IHRoZSB2YWx1ZSByYW5nZSBpcyBbMCwxXSBhbmQgbGltaXRzIGFyZSBzZXQgdG8gYmUgdGhlIGVxdWFsXG4gIC8vIGFzIGBzdGFydFZhbHVlYCBhbmQgYGVuZFZhbHVlYC5cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgYW5nbGVEaXN0YW5jZSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIGFuZ2xlRGlzdGFuY2UpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSk7XG5cbiAgICBzdXBlcihyYWMsIHZhbHVlKTtcblxuICAgIC8vIEFuZ2xlIGRpc3RhbmNlIGZvciB0aGUgY29waWVkIGFuY2hvciBvYmplY3QuXG4gICAgdGhpcy5hbmdsZURpc3RhbmNlID0gUmFjLkFuZ2xlLmZyb20ocmFjLCBhbmdsZURpc3RhbmNlKTtcblxuICAgIC8vIGBBcmNgYCB0byB3aGljaCB0aGUgY29udHJvbCB3aWxsIGJlIGFuY2hvcmVkLiBXaGVuIHRoZSBjb250cm9sIGlzXG4gICAgLy8gZHJhd24gYW5kIGludGVyYWN0ZWQgYSBjb3B5IG9mIHRoZSBhbmNob3IgaXMgY3JlYXRlZCB3aXRoIHRoZVxuICAgIC8vIGNvbnRyb2wncyBgYW5nbGVEaXN0YW5jZWAuXG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJhYy5jb250cm9sbGVyLmF1dG9BZGRDb250cm9scykge1xuICAgICAgcmFjLmNvbnRyb2xsZXIuYWRkKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHNldFZhbHVlV2l0aEFuZ2xlRGlzdGFuY2UodmFsdWVBbmdsZURpc3RhbmNlKSB7XG4gICAgdmFsdWVBbmdsZURpc3RhbmNlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIHZhbHVlQW5nbGVEaXN0YW5jZSlcbiAgICBsZXQgZGlzdGFuY2VSYXRpbyA9IHZhbHVlQW5nbGVEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gZGlzdGFuY2VSYXRpbztcbiAgfVxuXG4gIHNldExpbWl0c1dpdGhBbmdsZURpc3RhbmNlSW5zZXRzKHN0YXJ0SW5zZXQsIGVuZEluc2V0KSB7XG4gICAgc3RhcnRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzdGFydEluc2V0KTtcbiAgICBlbmRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRJbnNldCk7XG4gICAgdGhpcy5zdGFydExpbWl0ID0gc3RhcnRJbnNldC50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gKHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLSBlbmRJbnNldC50dXJuKSAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIGBhbmNob3Iuc3RhcnRgIHRvIHRoZSBjb250cm9sIGtub2IuXG4gIGRpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIGtub2IoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBOb3QgcG9zaWJsZSB0byBjYWxjdWxhdGUga25vYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5wb2ludEF0QW5nbGVEaXN0YW5jZSh0aGlzLmRpc3RhbmNlKCkpO1xuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgYGFuY2hvcmAgd2l0aCB0aGUgY29udHJvbCdzXG4gIC8vIGBhbmdsZURpc3RhbmNlYC5cbiAgYWZmaXhBbmNob3IoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLndpdGhBbmdsZURpc3RhbmNlKHRoaXMuYW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gVW5hYmxlIHRvIGRyYXcgd2l0aG91dCBhbmNob3JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZml4ZWRBbmNob3IgPSB0aGlzLmFmZml4QW5jaG9yKCk7XG5cbiAgICBsZXQgY29udHJvbGxlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5jb250cm9sU3R5bGU7XG4gICAgbGV0IGNvbnRyb2xTdHlsZSA9IGNvbnRyb2xsZXJTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sbGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5zdHlsZSlcbiAgICAgIDogdGhpcy5zdHlsZTtcblxuICAgIC8vIEFyYyBhbmNob3IgaXMgYWx3YXlzIGRyYXduIHdpdGhvdXQgZmlsbFxuICAgIGxldCBhbmNob3JTdHlsZSA9IGNvbnRyb2xTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5yYWMuRmlsbC5ub25lKVxuICAgICAgOiB0aGlzLnJhYy5GaWxsLm5vbmU7XG5cbiAgICBmaXhlZEFuY2hvci5kcmF3KGFuY2hvclN0eWxlKTtcblxuICAgIGxldCBrbm9iID0gdGhpcy5rbm9iKCk7XG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuY2VudGVyLmFuZ2xlVG9Qb2ludChrbm9iKTtcblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlckFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZShpdGVtKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUobWFya2VyQW5nbGVEaXN0YW5jZSk7XG4gICAgICBsZXQgcG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWFya2VyQW5nbGUpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgbWFya2VyQW5nbGUucGVycGVuZGljdWxhcighZml4ZWRBbmNob3IuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICAvLyBDb250cm9sIGtub2JcbiAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIE5lZ2F0aXZlIGFycm93XG4gICAgaWYgKHRoaXMudmFsdWUgPj0gdGhpcy5zdGFydExpbWl0ICsgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgICBsZXQgbmVnQW5nbGUgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGZpeGVkQW5jaG9yLmNsb2Nrd2lzZSkuaW52ZXJzZSgpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIG5lZ0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGl2ZSBhcnJvd1xuICAgIGlmICh0aGlzLnZhbHVlIDw9IHRoaXMuZW5kTGltaXQgLSB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIGxldCBwb3NBbmdsZSA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoZml4ZWRBbmNob3IuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBrbm9iLCBwb3NBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5yYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhjb250cm9sU3R5bGUpO1xuXG4gICAgLy8gU2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGU7XG4gICAgICBpZiAocG9pbnRlclN0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIGtub2IuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cyAqIDEuNSkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJDb250cm9sQ2VudGVyLCBmaXhlZEFuY2hvcikge1xuICAgIGxldCBhbmdsZURpc3RhbmNlID0gZml4ZWRBbmNob3IuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGxldCBzdGFydEluc2V0ID0gYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuc3RhcnRMaW1pdCk7XG4gICAgbGV0IGVuZEluc2V0ID0gYW5nbGVEaXN0YW5jZS5tdWx0T25lKDEgLSB0aGlzLmVuZExpbWl0KTtcblxuICAgIGxldCBzZWxlY3Rpb25BbmdsZSA9IGZpeGVkQW5jaG9yLmNlbnRlclxuICAgICAgLmFuZ2xlVG9Qb2ludChwb2ludGVyQ29udHJvbENlbnRlcik7XG4gICAgc2VsZWN0aW9uQW5nbGUgPSBmaXhlZEFuY2hvci5jbGFtcFRvQW5nbGVzKHNlbGVjdGlvbkFuZ2xlLFxuICAgICAgc3RhcnRJbnNldCwgZW5kSW5zZXQpO1xuICAgIGxldCBuZXdEaXN0YW5jZSA9IGZpeGVkQW5jaG9yLmRpc3RhbmNlRnJvbVN0YXJ0KHNlbGVjdGlvbkFuZ2xlKTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGRpc3RhbmNlUmF0aW8gPSBuZXdEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gZGlzdGFuY2VSYXRpbztcbiAgfVxuXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgZml4ZWRBbmNob3IsIHBvaW50ZXJPZmZzZXQpIHtcbiAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGU7XG4gICAgaWYgKHBvaW50ZXJTdHlsZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIC8vIEFyYyBhbmNob3IgaXMgYWx3YXlzIGRyYXduIHdpdGhvdXQgZmlsbFxuICAgIGxldCBhbmNob3JTdHlsZSA9IHBvaW50ZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnJhYy5GaWxsLm5vbmUpO1xuICAgIGZpeGVkQW5jaG9yLmRyYXcoYW5jaG9yU3R5bGUpO1xuXG4gICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBmaXhlZEFuY2hvci5hbmdsZURpc3RhbmNlKCk7XG5cbiAgICB0aGlzLnJhYy5wdXNoQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBWYWx1ZSBtYXJrZXJzXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbSA8IDAgfHwgaXRlbSA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKGl0ZW0pKTtcbiAgICAgIGxldCBtYXJrZXJQb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXJrZXJBbmdsZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIG1hcmtlclBvaW50LCBtYXJrZXJBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9KTtcblxuICAgIC8vIExpbWl0IG1hcmtlcnNcbiAgICBpZiAodGhpcy5zdGFydExpbWl0ID4gMCkge1xuICAgICAgbGV0IG1pbkFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy5zdGFydExpbWl0KSk7XG4gICAgICBsZXQgbWluUG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWluQW5nbGUpO1xuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gbWluQW5nbGUucGVycGVuZGljdWxhcihmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtaW5Qb2ludCwgbWFya2VyQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuZExpbWl0IDwgMSkge1xuICAgICAgbGV0IG1heEFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy5lbmRMaW1pdCkpO1xuICAgICAgbGV0IG1heFBvaW50ID0gZml4ZWRBbmNob3IucG9pbnRBdEFuZ2xlKG1heEFuZ2xlKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IG1heEFuZ2xlLnBlcnBlbmRpY3VsYXIoIWZpeGVkQW5jaG9yLmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1heFBvaW50LCBtYXJrZXJBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlck9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHBvaW50ZXJTdHlsZSk7XG5cbiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgYXJjIGNvbnRyb2wgZHJhZ2dpbmcgdmlzdWFscyFcbiAgfVxuXG59IC8vIGNsYXNzIEFyY0NvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyY0NvbnRyb2w7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEFic3RyYWN0IGNsYXNzIGZvciBjb250cm9scyB0aGF0IHNlbGVjdCBhIHZhbHVlIHdpdGhpbiBhIHJhbmdlLlxuKlxuKiBEZXBlbmRpbmcgb24gdGhlIGltcGxlbWVudGF0aW9uLCBjb250cm9scyBtYXkgdXNlIGFuIGBhbmNob3JgIG9iamVjdFxuKiB0byBkZXRlcm1pbmUgdGhlIHZpc3VhbCBwb3NpdGlvbiBvZiB0aGUgY29udHJvbCdzIGludGVyYWN0aXZlIGVsZW1lbnRzLlxuKiBUaGUgYGFuY2hvcmAgaXMgdGlnaHRseSBjb3VwbGVkIHdpdGggdGhlIHNwZWNpZmljIGltcGxlbWVudGF0aW9uIG9mIGFcbiogY29udHJvbCwgZm9yIGV4YW1wbGUgYFtBcmNDb250cm9sXXtAbGluayBSYWMuQXJjQ29udHJvbH1gIHVzZXMgYW5cbiogYFtBcmNde0BsaW5rIFJhYy5BcmN9YCBhcyBhbmNob3IsIHdoaWNoIGRlZmluZXMgd2hlcmUgdGhlIGNvbnRyb2wgaXNcbiogZHJhd24sIHdoYXQgb3JpZW50YXRpb24gaXQgdXNlcywgYW5kIHRoZSBwb3NpdGlvbiBvZiB0aGUgY29udHJvbCBrbm9iXG4qIHRocm91Z2ggdGhlIHJhbmdlIG9mIHBvc3NpYmxlIHZhbHVlcy5cbipcbiogQSBjb250cm9sIGtlZXBzIGEgYHZhbHVlYCBwcm9wZXJ0eSBpbiB0aGUgcmFuZ2UgKlswLDFdKiBmb3IgdGhlIGN1cnJlbnRseVxuKiBzZWxlY3RlZCB2YWx1ZS5cbipcbiogVGhlIGBwcm9qZWN0aW9uU3RhcnRgIGFuZCBgcHJvamVjdGlvbkVuZGAgcHJvcGVydGllcyBjYW4gYmUgdXNlZCB0b1xuKiBwcm9qZWN0IGB2YWx1ZWAgaW50byB0aGUgcmFuZ2UgYFtwcm9qZWN0aW9uU3RhcnQscHJvamVjdGlvbkVuZF1gIGJ5IHVzaW5nXG4qIHRoZSBgcHJvamVjdGVkVmFsdWUoKWAgbWV0aG9kLlxuKlxuKiBUaGUgYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIGNhbiBiZSB1c2VkIHRvIHJlc3RyYWluIHRoZSBhbGxvd2FibGVcbiogdmFsdWVzIHRoYXQgY2FuIGJlIHNlbGVjdGVkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi4gQm90aCBhcmUgc2V0IGluXG4qICpbMCwxXSogcmFuZ2UuXG4qXG4qIEBhbGlhcyBSYWMuQ29udHJvbFxuKi9cbmNsYXNzIENvbnRyb2wge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbnRyb2xgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBjb250cm9sLCBpbiB0aGVcbiAgKiAgICpbMCwxXSogcmFuZ2VcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogQ3VycmVudCBzZWxlY3RlZCB2YWx1ZSwgaW4gdGhlIHJhbmdlICpbMCwxXSouXG4gICAgKlxuICAgICogTWF5IGJlIGZ1cnRoZXIgY29uc3RyYWluZWQgdG8gYFtzdGFydExpbWl0LGVuZExpbWl0XWAuXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIC8qKlxuICAgICogW1Byb2plY3RlZCB2YWx1ZV17QGxpbmsgUmFjLkNvbnRyb2wjcHJvamVjdGVkVmFsdWV9IHRvIHVzZSB3aGVuXG4gICAgKiBgdmFsdWVgIGlzIGAwYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICogQGRlZmF1bHQgMFxuICAgICovXG4gICAgdGhpcy5wcm9qZWN0aW9uU3RhcnQgPSAwO1xuXG4gICAgLyoqXG4gICAgKiBbUHJvamVjdGVkIHZhbHVlXXtAbGluayBSYWMuQ29udHJvbCNwcm9qZWN0ZWRWYWx1ZX0gdG8gdXNlIHdoZW5cbiAgICAqIGB2YWx1ZWAgaXMgYDFgLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLnByb2plY3Rpb25FbmQgPSAxO1xuXG4gICAgLyoqXG4gICAgKiBNaW5pbXVtIGB2YWx1ZWAgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAwXG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0TGltaXQgPSAwO1xuXG4gICAgLyoqXG4gICAgKiBNYXhpbXVtIGB2YWx1ZWAgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLmVuZExpbWl0ID0gMTtcblxuICAgIC8qKlxuICAgICogQ29sbGVjdGlvbiBvZiB2YWx1ZXMgYXQgd2hpY2ggdmlzdWFsIG1hcmtlcnMgYXJlIGRyYXduLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAqIEBkZWZhdWx0IFtdXG4gICAgKi9cbiAgICB0aGlzLm1hcmtlcnMgPSBbXTtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdG8gYXBwbHkgd2hlbiBkcmF3aW5nLiBUaGlzIHN0eWxlIGdldHMgYXBwbGllZCBhZnRlclxuICAgICogYFtyYWMuY29udHJvbGxlci5jb250cm9sU3R5bGVde0BsaW5rIFJhYy5Db250cm9sbGVyI2NvbnRyb2xTdHlsZX1gLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9IFtzdHlsZT1udWxsXVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5zdHlsZSA9IG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHZhbHVlYCBwcm9qZWN0ZWQgaW50byB0aGUgcmFuZ2VcbiAgKiBgW3Byb2plY3Rpb25TdGFydCxwcm9qZWN0aW9uRW5kXWAuXG4gICpcbiAgKiBCeSBkZWZhdWx0IHRoZSBwcm9qZWN0aW9uIHJhbmdlIGlzICpbMCwxXSosIGluIHdoaWNoIGNhc2UgYHZhbHVlYCBhbmRcbiAgKiBgcHJvamVjdGVkVmFsdWUoKWAgYXJlIHRoZSBzYW1lLiBQcm9qZWN0aW9uIHJhbmdlcyB3aXRoIGEgbmVnYXRpdmVcbiAgKiBkaXJlY3Rpb24gKHdoZW4gYHByb2plY3Rpb25TdGFydGAgaXMgZ3JlYXRlciB0aGF0IGBwcm9qZWN0aW9uRW5kYCkgYXJlXG4gICogc3VwcG9ydGVkLlxuICAqXG4gICogPiBFLmcuXG4gICogPiBgYGBcbiAgKiA+IEZvciBhIGNvbnRyb2wgd2l0aCBhIHByb2plY3Rpb24gcmFuZ2Ugb2YgWzEwMCwyMDBdXG4gICogPiArIHdoZW4gdmFsdWUgaXMgMCwgICBwcm9qZWN0aW9uVmFsdWUoKSBpcyAxMDBcbiAgKiA+ICsgd2hlbiB2YWx1ZSBpcyAwLjUsIHByb2plY3Rpb25WYWx1ZSgpIGlzIDE1MFxuICAqID4gKyB3aGVuIHZhbHVlIGlzIDEsICAgcHJvamVjdGlvblZhbHVlKCkgaXMgMjAwXG4gICogPlxuICAqID4gRm9yIGEgY29udHJvbCB3aXRoIGEgcHJvamVjdGlvbiByYW5nZSBvZiBbNTAsIDQwXVxuICAqID4gKyB3aGVuIHZhbHVlIGlzIDAsICAgcHJvamVjdGlvblZhbHVlKCkgaXMgNTBcbiAgKiA+ICsgd2hlbiB2YWx1ZSBpcyAwLjUsIHByb2plY3Rpb25WYWx1ZSgpIGlzIDQ1XG4gICogPiArIHdoZW4gdmFsdWUgaXMgMSwgICBwcm9qZWN0aW9uVmFsdWUoKSBpcyA0MFxuICAqID4gYGBgXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBwcm9qZWN0ZWRWYWx1ZSgpIHtcbiAgICBsZXQgcHJvamVjdGlvblJhbmdlID0gdGhpcy5wcm9qZWN0aW9uRW5kIC0gdGhpcy5wcm9qZWN0aW9uU3RhcnQ7XG4gICAgcmV0dXJuICh0aGlzLnZhbHVlICogcHJvamVjdGlvblJhbmdlKSArIHRoaXMucHJvamVjdGlvblN0YXJ0O1xuICB9XG5cbiAgLy8gVE9ETzogcmVpbnRyb2R1Y2Ugd2hlbiB0ZXN0ZWRcbiAgLy8gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSBpbiB0aGUgcmFuZ2UgKlswLDFdKiBmb3IgdGhlXG4gIC8vIGBwcm9qZWN0ZWRWYWx1ZWAgaW4gdGhlIHJhbmdlIGBbcHJvamVjdGlvblN0YXJ0LHByb2plY3Rpb25FbmRdYC5cbiAgLy8gdmFsdWVPZlByb2plY3RlZChwcm9qZWN0ZWRWYWx1ZSkge1xuICAvLyAgIGxldCBwcm9qZWN0aW9uUmFuZ2UgPSB0aGlzLnByb2plY3Rpb25FbmQgLSB0aGlzLnByb2plY3Rpb25TdGFydDtcbiAgLy8gICByZXR1cm4gKHByb2plY3RlZFZhbHVlIC0gdGhpcy5wcm9qZWN0aW9uU3RhcnQpIC8gcHJvamVjdGlvblJhbmdlO1xuICAvLyB9XG5cblxuICAvKipcbiAgICogU2V0cyBib3RoIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHRoZSBnaXZlbiBpbnNldHMgZnJvbSBgMGAsXG4gICAqIGAxYCwgY29ycmVzcG9uZGluZ2x5LlxuICAgKlxuICAgKiA+IEUuZy5cbiAgICogPiBgYGBcbiAgICogPiBjb250cm9sLnNldExpbWl0c1dpdGhJbnNldHMoMC4xLCAwLjIpXG4gICAqID4gLy8gc2V0cyBzdGFydExpbWl0IGFzIDAuMVxuICAgKiA+IC8vIHNldHMgZW5kTGltaXQgICBhcyAwLjhcbiAgICogPiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMGAgdG8gdXNlIGZvciBgc3RhcnRMaW1pdGBcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDFgIHRvIHVzZSBmb3IgYGVuZExpbWl0YFxuICAgKi9cbiAgc2V0TGltaXRzV2l0aEluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQ7XG4gICAgdGhpcy5lbmRMaW1pdCA9IDEgLSBlbmRJbnNldDtcbiAgfVxuXG5cbiAgLy8gVE9ETzogcmVpbnRyb2R1Y2Ugd2hlbiB0ZXN0ZWRcbiAgLy8gU2V0cyBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0d28gaW5zZXQgdmFsdWVzIHJlbGF0aXZlIHRvIHRoZVxuICAvLyBbMCwxXSByYW5nZS5cbiAgLy8gc2V0TGltaXRzV2l0aFByb2plY3Rpb25JbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgLy8gICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldCk7XG4gIC8vICAgdGhpcy5lbmRMaW1pdCA9IHRoaXMudmFsdWVPZigxIC0gZW5kSW5zZXQpO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBBZGRzIGEgbWFya2VyIGF0IHRoZSBjdXJyZW50IGB2YWx1ZWAuXG4gICovXG4gIGFkZE1hcmtlckF0Q3VycmVudFZhbHVlKCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGlzIGNvbnRyb2wgaXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLlxuICAqXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICovXG4gIGlzU2VsZWN0ZWQoKSB7XG4gICAgaWYgKHRoaXMucmFjLmNvbnRyb2xsZXIuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJhYy5jb250cm9sbGVyLnNlbGVjdGlvbi5jb250cm9sID09PSB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGtub2IuXG4gICpcbiAgKiA+IFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKiBAcmV0dXJuIHtSYWMuUG9pbnR9XG4gICovXG4gIGtub2IoKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgYW5jaG9yIGJlIHBlcnNpdGVkIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAqXG4gICogVGhlIGltcGxlbWVudGF0aW9uIGlzIGZyZWUgdG8gZGV0ZXJtaW5lIHRoZSB0eXBlIHVzZWQgZm9yIGBhbmNob3JgIGFuZFxuICAqIGBhZmZpeEFuY2hvcigpYC5cbiAgKlxuICAqIFRoaXMgZml4ZWQgYW5jaG9yIGlzIHBhc3NlZCBiYWNrIHRvIHRoZSBjb250cm9sIHRocm91Z2hcbiAgKiBgW3VwZGF0ZVdpdGhQb2ludGVyXXtAbGluayBSYWMuQ29udHJvbCN1cGRhdGVXaXRoUG9pbnRlcn1gIGFuZFxuICAqIGBbZHJhd1NlbGVjdGlvbl17QGxpbmsgUmFjLkNvbnRyb2wjZHJhd1NlbGVjdGlvbn1gIGR1cmluZyB1c2VyXG4gICogaW50ZXJhY3Rpb24uXG4gICpcbiAgKiA+IFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICovXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICpcbiAgKiA+IFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICovXG4gIGRyYXcoKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbiAgLyoqXG4gICogVXBkYXRlcyBgdmFsdWVgIHdpdGggYHBvaW50ZXJDZW50ZXJgIGluIHJlbGF0aW9uIHRvIGBmaXhlZEFuY2hvcmAuXG4gICogQ2FsbGVkIGJ5IGBbcmFjLmNvbnRyb2xsZXIucG9pbnRlckRyYWdnZWRde0BsaW5rIFJhYy5Db250cm9sbGVyI3BvaW50ZXJEcmFnZ2VkfWBcbiAgKiBhcyB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aCB0aGUgY29udHJvbC5cbiAgKlxuICAqID4gVGhpcyBmdW5jdGlvbiBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqIGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyQ2VudGVyLCBmaXhlZEFuY2hvcikge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgYWxvbmcgd2l0aCBwb2ludGVyIGludGVyYWN0aW9uIHZpc3VhbHMuXG4gICogQ2FsbGVkIGJ5IGBbcmFjLmNvbnRyb2xsZXIuZHJhd0NvbnRyb2xzXXtAbGluayBSYWMuQ29udHJvbGxlciNkcmF3Q29udHJvbHN9YFxuICAqIG9ubHkgZm9yIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY29udHJvbC5cbiAgKlxuICAqID4gVGhpcyBmdW5jdGlvbiBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqIGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyT2Zmc2V0KSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbDtcblxuXG4vLyBDb250cm9scyBzaGFyZWQgZHJhd2luZyBlbGVtZW50c1xuXG5Db250cm9sLm1ha2VBcnJvd1NoYXBlID0gZnVuY3Rpb24ocmFjLCBjZW50ZXIsIGFuZ2xlKSB7XG4gIC8vIEFyY1xuICBsZXQgYW5nbGVEaXN0YW5jZSA9IHJhYy5BbmdsZS5mcm9tKDEvMjIpO1xuICBsZXQgYXJjID0gY2VudGVyLmFyYyhyYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41LFxuICAgIGFuZ2xlLnN1YnRyYWN0KGFuZ2xlRGlzdGFuY2UpLCBhbmdsZS5hZGQoYW5nbGVEaXN0YW5jZSkpO1xuXG4gIC8vIEFycm93IHdhbGxzXG4gIGxldCBwb2ludEFuZ2xlID0gcmFjLkFuZ2xlLmZyb20oMS84KTtcbiAgbGV0IHJpZ2h0V2FsbCA9IGFyYy5zdGFydFBvaW50KCkucmF5KGFuZ2xlLmFkZChwb2ludEFuZ2xlKSk7XG4gIGxldCBsZWZ0V2FsbCA9IGFyYy5lbmRQb2ludCgpLnJheShhbmdsZS5zdWJ0cmFjdChwb2ludEFuZ2xlKSk7XG5cbiAgLy8gQXJyb3cgcG9pbnRcbiAgbGV0IHBvaW50ID0gcmlnaHRXYWxsLnBvaW50QXRJbnRlcnNlY3Rpb24obGVmdFdhbGwpO1xuXG4gIC8vIFNoYXBlXG4gIHJhYy5wdXNoU2hhcGUoKTtcbiAgcG9pbnQuc2VnbWVudFRvUG9pbnQoYXJjLnN0YXJ0UG9pbnQoKSlcbiAgICAuYXR0YWNoVG9TaGFwZSgpO1xuICBhcmMuYXR0YWNoVG9TaGFwZSgpO1xuICBhcmMuZW5kUG9pbnQoKS5zZWdtZW50VG9Qb2ludChwb2ludClcbiAgICAuYXR0YWNoVG9TaGFwZSgpO1xuXG4gIHJldHVybiByYWMucG9wU2hhcGUoKTtcbn07XG5cbkNvbnRyb2wubWFrZUxpbWl0TWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgYW5nbGUpIHtcbiAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gIGxldCBwZXJwZW5kaWN1bGFyID0gYW5nbGUucGVycGVuZGljdWxhcihmYWxzZSk7XG4gIGxldCBjb21wb3NpdGUgPSBuZXcgUmFjLkNvbXBvc2l0ZShyYWMpO1xuXG4gIHBvaW50LnNlZ21lbnRUb0FuZ2xlKHBlcnBlbmRpY3VsYXIsIDQpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbig0KVxuICAgIC5hdHRhY2hUbyhjb21wb3NpdGUpO1xuICBwb2ludC5wb2ludFRvQW5nbGUocGVycGVuZGljdWxhciwgOCkuYXJjKDMpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG5cbiAgcmV0dXJuIGNvbXBvc2l0ZTtcbn07XG5cbkNvbnRyb2wubWFrZVZhbHVlTWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgYW5nbGUpIHtcbiAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gIHJldHVybiBwb2ludC5zZWdtZW50VG9BbmdsZShhbmdsZS5wZXJwZW5kaWN1bGFyKCksIDMpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigzKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5lciBmb3IgaW5mb3JtYXRpb24gcmVnYXJkaW5nIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgYENvbnRyb2xgLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xsZXIuU2VsZWN0aW9uXG4qL1xuY2xhc3MgQ29udHJvbFNlbGVjdGlvbntcbiAgY29uc3RydWN0b3IoY29udHJvbCwgcG9pbnRlckNlbnRlcikge1xuICAgIC8vIFNlbGVjdGVkIGNvbnRyb2wgaW5zdGFuY2UuXG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICAvLyBDb3B5IG9mIHRoZSBjb250cm9sIGFuY2hvciwgc28gdGhhdCB0aGUgY29udHJvbCBjYW4gbW92ZSB0aWVkIHRvXG4gICAgLy8gdGhlIGRyYXdpbmcsIHdoaWxlIHRoZSBpbnRlcmFjdGlvbiByYW5nZSByZW1haW5zIGZpeGVkLlxuICAgIHRoaXMuZml4ZWRBbmNob3IgPSBjb250cm9sLmFmZml4QW5jaG9yKCk7XG4gICAgLy8gU2VnbWVudCBmcm9tIHRoZSBjYXB0dXJlZCBwb2ludGVyIHBvc2l0aW9uIHRvIHRoZSBjb250cm8gY2VudGVyLFxuICAgIC8vIHVzZWQgdG8gYXR0YWNoIHRoZSBjb250cm9sIHRvIHRoZSBwb2ludCB3aGVyZSBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAgIC8vIFBvaW50ZXIgaXMgYXQgYHNlZ21lbnQuc3RhcnRgIGFuZCBjb250cm9sIGNlbnRlciBpcyBhdCBgc2VnbWVudC5lbmRgLlxuICAgIHRoaXMucG9pbnRlck9mZnNldCA9IHBvaW50ZXJDZW50ZXIuc2VnbWVudFRvUG9pbnQoY29udHJvbC5rbm9iKCkpO1xuICB9XG5cbiAgZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyKSB7XG4gICAgdGhpcy5jb250cm9sLmRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgdGhpcy5maXhlZEFuY2hvciwgdGhpcy5wb2ludGVyT2Zmc2V0KTtcbiAgfVxufVxuXG5cbi8qKlxuKiBNYW5hZ2VyIG9mIGludGVyYWN0aXZlIGNvbnRyb2xzIGZvciBhbiBpbnN0YW5jZSBvZiBgUmFjYC5cbipcbiogQ29udGFpbnMgYSBsaXN0IG9mIGFsbCBtYW5hZ2VkIGNvbnRyb2xzIGFuZCBjb29yZGluYXRlcyBkcmF3aW5nIGFuZCB1c2VyXG4qIGludGVyYWN0aW9uIGJldHdlZW4gdGhlbS5cbipcbiogRm9yIGNvbnRyb2xzIHRvIGJlIGZ1bmN0aW9uYWwgdGhlIGBwb2ludGVyUHJlc3NlZGAsIGBwb2ludGVyUmVsZWFzZWRgLFxuKiBhbmQgYHBvaW50ZXJEcmFnZ2VkYCBtZXRob2RzIGhhdmUgdG8gYmUgY2FsbGVkIGFzIHBvaW50ZXIgaW50ZXJhY3Rpb25zXG4qIGhhcHBlbi4gVGhlIGBkcmF3Q29udHJvbHNgIG1ldGhvZCBoYW5kbGVzIHRoZSBkcmF3aW5nIG9mIGFsbCBjb250cm9sc1xuKiBhbmQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLCBpdCBpcyB1c3VhbGx5IGNhbGxlZCBhdCB0aGUgdmVyeSBlbmRcbiogb2YgZHJhd2luZy5cbipcbiogQWxzbyBjb250YWlucyBzZXR0aW5ncyBzaGFyZWQgYmV0d2VlbiBhbGwgY29udHJvbHMgYW5kIHVzZWQgZm9yIHVzZXJcbiogaW50ZXJhY3Rpb24sIGxpa2UgYHBvaW50ZXJTdHlsZWAgdG8gZHJhdyB0aGUgcG9pbnRlciwgYGNvbnRyb2xTdHlsZWAgYXNcbiogYSBkZWZhdWx0IHN0eWxlIGZvciBkcmF3aW5nIGNvbnRyb2xzLCBhbmQgYGtub2JSYWRpdXNgIHRoYXQgZGVmaW5lcyB0aGVcbiogc2l6ZSBvZiB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudCBvZiBtb3N0IGNvbnRyb2xzLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xsZXJcbiovXG5jbGFzcyBDb250cm9sbGVyIHtcblxuICBzdGF0aWMgU2VsZWN0aW9uID0gQ29udHJvbFNlbGVjdGlvbjtcblxuXG4gIC8qKlxuICAqIEJ1aWxkcyBhIG5ldyBgQ29udHJvbGxlcmAgd2l0aCB0aGUgZ2l2ZW4gYFJhY2AgaW5zdGFuY2UuXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYykge1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIERpc3RhbmNlIGF0IHdoaWNoIHRoZSBwb2ludGVyIGlzIGNvbnNpZGVyZWQgdG8gaW50ZXJhY3Qgd2l0aCBhXG4gICAgKiBjb250cm9sIGtub2IuIEFsc28gdXNlZCBieSBjb250cm9scyBmb3IgZHJhd2luZy5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5rbm9iUmFkaXVzID0gMjI7XG5cbiAgICAvKipcbiAgICAqIENvbGxlY3Rpb24gb2YgYWxsIGNvbnRyb2xscyBtYW5hZ2VkIGJ5IHRoZSBpbnN0YW5jZS4gQ29udHJvbHMgaW4gdGhpc1xuICAgICogbGlzdCBhcmUgY29uc2lkZXJlZCBmb3IgcG9pbnRlciBoaXQgdGVzdGluZyBhbmQgZm9yIGRyYXdpbmcuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5Db250cm9sW119XG4gICAgKiBAZGVmYXVsdCBbXVxuICAgICovXG4gICAgdGhpcy5jb250cm9scyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBJbmRpY2F0ZXMgY29udHJvbHMgdG8gYWRkIHRoZW1zZWx2ZXMgaW50byBgdGhpcy5jb250cm9sc2Agd2hlblxuICAgICogY3JlYXRlZC5cbiAgICAqXG4gICAgKiBUaGlzIHByb3BlcnR5IGlzIGEgc2hhcmVkIGNvbmZpZ3VyYXRpb24uIFRoZSBiZWhhdmlvdXIgaXMgaW1wbGVtZW50ZWRcbiAgICAqIGluZGVwZW5kZW50bHkgYnkgZWFjaCBjb250cm9sIGNvbnN0cnVjdG9yLlxuICAgICpcbiAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICovXG4gICAgdGhpcy5hdXRvQWRkQ29udHJvbHMgPSB0cnVlO1xuXG4gICAgLy8gVE9ETzogc2VwYXJhdGUgbGFzdENvbnRyb2wgZnJvbSBsYXN0UG9pbnRlclxuXG4gICAgLy8gTGFzdCBgUG9pbnRgIG9mIHRoZSBwb3NpdGlvbiB3aGVuIHRoZSBwb2ludGVyIHdhcyBwcmVzc2VkLCBvciBsYXN0XG4gICAgLy8gQ29udHJvbCBpbnRlcmFjdGVkIHdpdGguIFNldCB0byBgbnVsbGAgd2hlbiB0aGVyZSBoYXMgYmVlbiBub1xuICAgIC8vIGludGVyYWN0aW9uIHlldCBhbmQgd2hpbGUgdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLlxuICAgIHRoaXMubGFzdFBvaW50ZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSBvYmplY3QgdXNlZCBmb3IgdGhlIHZpc3VhbCBlbGVtZW50cyByZWxhdGVkIHRvIHBvaW50ZXJcbiAgICAqIGludGVyYWN0aW9uIGFuZCBjb250cm9sIHNlbGVjdGlvbi4gV2hlbiBgbnVsbGAgbm8gcG9pbnRlciBvclxuICAgICogc2VsZWN0aW9uIHZpc3VhbHMgYXJlIGRyYXduLlxuICAgICpcbiAgICAqIEJ5IGRlZmF1bHQgY29udGFpbnMgYSBzdHlsZSB0aGF0IHVzZXMgdGhlIGN1cnJlbnQgc3Ryb2tlXG4gICAgKiBjb25maWd1cmF0aW9uIHdpdGggbm8tZmlsbC5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfVxuICAgICogQGRlZmF1bHQge0BsaW5rIGluc3RhbmNlLkZpbGwjbm9uZX1cbiAgICAqL1xuICAgIHRoaXMucG9pbnRlclN0eWxlID0gcmFjLkZpbGwubm9uZTtcblxuICAgIC8qKlxuICAgICogRGVmYXVsdCBzdHlsZSB0byBhcHBseSBmb3IgYWxsIGNvbnRyb2xzLiBXaGVuIHNldCBpdCBpcyBhcHBsaWVkXG4gICAgKiBiZWZvcmUgY29udHJvbCBkcmF3aW5nLiBUaGUgaW5kaXZpZHVhbCBjb250cm9sIHN0eWxlIGluXG4gICAgKiBgW2NvbnRyb2wuc3R5bGVde0BsaW5rIFJhYy5Db250cm9sI3N0eWxlfWAgaXMgYXBwbGllZCBhZnRlcndhcmRzLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmNvbnRyb2xTdHlsZSA9IG51bGxcblxuICAgIC8qKlxuICAgICogU2VsZWN0aW9uIGluZm9ybWF0aW9uIGZvciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wsIG9yIGBudWxsYFxuICAgICogd2hlbiB0aGVyZSBpcyBubyBzZWxlY3Rpb24uXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuQ29udHJvbGxlci5TZWxlY3Rpb259XG4gICAgKi9cbiAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG5cbiAgfSAvLyBjb25zdHJ1Y3RvclxuXG5cbiAgLyoqXG4gICogUHVzaGVzIGBjb250cm9sYCBpbnRvIGB0aGlzLmNvbnRyb2xzYCwgYWxsb3dpbmcgdGhlIGluc3RhbmNlIHRvIGhhbmRsZVxuICAqIHBvaW50ZXIgaW50ZXJhY3Rpb24gYW5kIGRyYXdpbmcgb2YgYGNvbnRyb2xgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29udHJvbH0gY29udHJvbCAtIEEgYENvbnRyb2xgIHRvIGFkZCBpbnRvIGBjb250cm9sc2BcbiAgKi9cbiAgYWRkKGNvbnRyb2wpIHtcbiAgICB0aGlzLmNvbnRyb2xzLnB1c2goY29udHJvbCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIE5vdGlmaWVzIHRoZSBpbnN0YW5jZSB0aGF0IHRoZSBwb2ludGVyIGhhcyBiZWVuIHByZXNzZWQgYXQgdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBBbGwgY29udHJvbHMgYXJlIGhpdCB0ZXN0ZWQgYW5kIHRoZSBmaXJzdFxuICAqIGNvbnRyb2wgdG8gYmUgaGl0IGlzIG1hcmtlZCBhcyBzZWxlY3RlZC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYWxvbmcgcG9pbnRlciBwcmVzcyBpbnRlcmFjdGlvbiBmb3IgYWxsXG4gICogbWFuYWdlZCBjb250cm9scyB0byBwcm9wZXJseSB3b3JrLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gd2hlcmUgdGhlIHBvaW50ZXIgd2FzXG4gICogICBwcmVzc2VkXG4gICovXG4gIHBvaW50ZXJQcmVzc2VkKHBvaW50ZXJDZW50ZXIpIHtcbiAgICB0aGlzLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAgIC8vIFRlc3QgcG9pbnRlciBoaXRcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuY29udHJvbHMuZmluZCggaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sS25vYiA9IGl0ZW0ua25vYigpO1xuICAgICAgaWYgKGNvbnRyb2xLbm9iID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGNvbnRyb2xLbm9iLmRpc3RhbmNlVG9Qb2ludChwb2ludGVyQ2VudGVyKSA8PSB0aGlzLmtub2JSYWRpdXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBpZiAoc2VsZWN0ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uID0gbmV3IENvbnRyb2xsZXIuU2VsZWN0aW9uKHNlbGVjdGVkLCBwb2ludGVyQ2VudGVyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogTm90aWZpZXMgdGhlIGluc3RhbmNlIHRoYXQgdGhlIHBvaW50ZXIgaGFzIGJlZW4gZHJhZ2dlZCB0byB0aGVcbiAgKiBgcG9pbnRlckNlbnRlcmAgbG9jYXRpb24uIFdoZW4gdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLCB1c2VyXG4gICogaW50ZXJhY3Rpb24gaXMgcGVyZm9ybWVkIGFuZCB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBhbG9uZyBwb2ludGVyIGRyYWcgaW50ZXJhY3Rpb24gZm9yIGFsbFxuICAqIG1hbmFnZWQgY29udHJvbHMgdG8gcHJvcGVybHkgd29yay5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBwb2ludGVyIHdhc1xuICAqICAgZHJhZ2dlZFxuICAqL1xuICBwb2ludGVyRHJhZ2dlZChwb2ludGVyQ2VudGVyKXtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY29udHJvbCA9IHRoaXMuc2VsZWN0aW9uLmNvbnRyb2w7XG4gICAgbGV0IGZpeGVkQW5jaG9yID0gdGhpcy5zZWxlY3Rpb24uZml4ZWRBbmNob3I7XG5cbiAgICAvLyBDZW50ZXIgb2YgZHJhZ2dlZCBjb250cm9sIGluIHRoZSBwb2ludGVyIGN1cnJlbnQgcG9zaXRpb25cbiAgICBsZXQgY3VycmVudFBvaW50ZXJDb250cm9sQ2VudGVyID0gdGhpcy5zZWxlY3Rpb24ucG9pbnRlck9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIGNvbnRyb2wudXBkYXRlV2l0aFBvaW50ZXIoY3VycmVudFBvaW50ZXJDb250cm9sQ2VudGVyLCBmaXhlZEFuY2hvcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIE5vdGlmaWVzIHRoZSBpbnN0YW5jZSB0aGF0IHRoZSBwb2ludGVyIGhhcyBiZWVuIHJlbGVhc2VkIGF0IHRoZVxuICAqIGBwb2ludGVyQ2VudGVyYCBsb2NhdGlvbi4gV2hlbiB0aGVyZSBpcyBhIHNlbGVjdGVkIGNvbnRyb2wsIHVzZXJcbiAgKiBpbnRlcmFjdGlvbiBpcyBmaW5hbGl6ZWQgYW5kIHRoZSBjb250cm9sIHNlbGVjdGlvbiBpcyBjbGVhcmVkLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBhbG9uZyBwb2ludGVyIGRyYWcgaW50ZXJhY3Rpb24gZm9yIGFsbFxuICAqIG1hbmFnZWQgY29udHJvbHMgdG8gcHJvcGVybHkgd29yay5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBwb2ludGVyIHdhc1xuICAqICAgcmVsZWFzZWRcbiAgKi9cbiAgcG9pbnRlclJlbGVhc2VkKHBvaW50ZXJDZW50ZXIpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHRoaXMubGFzdFBvaW50ZXIgPSBwb2ludGVyQ2VudGVyO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFBvaW50ZXIgPSB0aGlzLnNlbGVjdGlvbi5jb250cm9sO1xuICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgYWxsIGNvbnRyb2xzIGNvbnRhaW5lZCBpblxuICAqIGBbY29udHJvbHNde0BsaW5rIFJhYy5Db250cm9sbGVyI2NvbnRyb2xzfWAgYWxvbmcgdGhlIHZpc3VhbCBlbGVtZW50c1xuICAqIGZvciBwb2ludGVyIGFuZCBjb250cm9sIHNlbGVjdGlvbi5cbiAgKlxuICAqIFVzdWFsbHkgY2FsbGVkIGF0IHRoZSBlbmQgb2YgZHJhd2luZywgYXMgdG8gZHJhdyBjb250cm9scyBvbiB0b3Agb2ZcbiAgKiBvdGhlciBncmFwaGljcy5cbiAgKi9cbiAgZHJhd0NvbnRyb2xzKCkge1xuICAgIGxldCBwb2ludGVyQ2VudGVyID0gdGhpcy5yYWMuUG9pbnQucG9pbnRlcigpO1xuICAgIHRoaXMuZHJhd1BvaW50ZXIocG9pbnRlckNlbnRlcik7XG5cbiAgICAvLyBBbGwgY29udHJvbHMgaW4gZGlzcGxheVxuICAgIHRoaXMuY29udHJvbHMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZHJhdygpKTtcblxuICAgIGlmICh0aGlzLnNlbGVjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyKTtcbiAgICB9XG4gIH1cblxuXG4gIGRyYXdQb2ludGVyKHBvaW50ZXJDZW50ZXIpIHtcbiAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5wb2ludGVyU3R5bGU7XG4gICAgaWYgKHBvaW50ZXJTdHlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIExhc3QgcG9pbnRlciBvciBjb250cm9sXG4gICAgaWYgKHRoaXMubGFzdFBvaW50ZXIgaW5zdGFuY2VvZiBSYWMuUG9pbnQpIHtcbiAgICAgIHRoaXMubGFzdFBvaW50ZXIuYXJjKDEyKS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxhc3RQb2ludGVyIGluc3RhbmNlb2YgUmFjLkNvbnRyb2wpIHtcbiAgICAgIC8vIFRPRE86IGltcGxlbWVudCBsYXN0IHNlbGVjdGVkIGNvbnRyb2wgc3RhdGVcbiAgICB9XG5cbiAgICAvLyBQb2ludGVyIHByZXNzZWRcbiAgICBpZiAodGhpcy5yYWMuZHJhd2VyLnA1Lm1vdXNlSXNQcmVzc2VkKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgcG9pbnRlckNlbnRlci5hcmMoMTApLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvaW50ZXJDZW50ZXIuYXJjKDUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG59IC8vIGNsYXNzIENvbnRyb2xsZXJcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRyb2wgdGhhdCB1c2VzIGEgYFJheWAgYXMgYW5jaG9yLlxuKlxuKiDimqDvuI8gVGhlIEFQSSBmb3IgY29udHJvbHMgaXMgKipwbGFubmVkIHRvIGNoYW5nZSoqIGluIGEgZnV0dXJlIG1pbm9yIHJlbGVhc2UuIOKaoO+4j1xuKlxuKiBAYWxpYXMgUmFjLlJheUNvbnRyb2xcbiovXG5jbGFzcyBSYXlDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8vIENyZWF0ZXMgYSBuZXcgQ29udHJvbCBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBgdmFsdWVgIGFuZCBgbGVuZ3RoYC5cbiAgLy8gQnkgZGVmYXVsdCB0aGUgdmFsdWUgcmFuZ2UgaXMgWzAsMV0gYW5kIGxpbWl0cyBhcmUgc2V0IHRvIGJlIHRoZSBlcXVhbFxuICAvLyBhcyBgc3RhcnRWYWx1ZWAgYW5kIGBlbmRWYWx1ZWAuXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGxlbmd0aCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHZhbHVlLCBsZW5ndGgpO1xuXG4gICAgc3VwZXIocmFjLCB2YWx1ZSk7XG5cbiAgICAvLyBMZW5ndGggZm9yIHRoZSBjb3BpZWQgYW5jaG9yIHNoYXBlLlxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXG4gICAgLy8gUmF5IHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIFdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAvLyBkcmF3biBhbmQgaW50ZXJhY3RlZCBhIFNlZ21lbnQgaXMgY3JlYXRlZCB3aXRoIGNvbnRyb2wncyBgbGVuZ3RoYC5cbiAgICB0aGlzLmFuY2hvciA9IG51bGw7XG5cbiAgICBpZiAocmFjLmNvbnRyb2xsZXIuYXV0b0FkZENvbnRyb2xzKSB7XG4gICAgICByYWMuY29udHJvbGxlci5hZGQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgc2V0VmFsdWVXaXRoTGVuZ3RoKGxlbmd0aFZhbHVlKSB7XG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbGVuZ3RoVmFsdWUgLyB0aGlzLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gbGVuZ3RoUmF0aW87XG4gIH1cblxuICAvLyBTZXRzIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHR3byBpbnNldCB2YWx1ZXMgcmVsYXRpdmUgdG9cbiAgLy8gemVybyBhbmQgYGxlbmd0aGAuXG4gIHNldExpbWl0c1dpdGhMZW5ndGhJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSBzdGFydEluc2V0IC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy5lbmRMaW1pdCA9ICh0aGlzLmxlbmd0aCAtIGVuZEluc2V0KSAvIHRoaXMubGVuZ3RoO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIGBhbmNob3Iuc3RhcnRgIHRvIHRoZSBjb250cm9sIGtub2IuXG4gIGRpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCAqIHRoaXMudmFsdWU7XG4gIH1cblxuICBrbm9iKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gTm90IHBvc2libGUgdG8gY2FsY3VsYXRlIHRoZSBrbm9iXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLnBvaW50QXREaXN0YW5jZSh0aGlzLmRpc3RhbmNlKCkpO1xuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIGNvcHkgb2YgdGhlIGFuY2hvcjogYSBuZXcgYFNlZ21lbnRgIGJhc2VkIG9uIGBhbmNob3JgIHdpdGhcbiAgLy8gdGhlIGN1cnJlbnQgYGxlbmd0aGAuXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5zZWdtZW50KHRoaXMubGVuZ3RoKTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBVbmFibGUgdG8gZHJhdyB3aXRob3V0IGFuY2hvclxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuYWZmaXhBbmNob3IoKTtcblxuICAgIGxldCBjb250cm9sbGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLmNvbnRyb2xTdHlsZTtcbiAgICBsZXQgY29udHJvbFN0eWxlID0gY29udHJvbGxlclN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xsZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnN0eWxlKVxuICAgICAgOiB0aGlzLnN0eWxlO1xuXG4gICAgZml4ZWRBbmNob3IuZHJhdyhjb250cm9sU3R5bGUpO1xuXG4gICAgbGV0IGtub2IgPSB0aGlzLmtub2IoKTtcbiAgICBsZXQgYW5nbGUgPSBmaXhlZEFuY2hvci5hbmdsZSgpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgcG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLmxlbmd0aCAqIGl0ZW0pO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLy8gQ29udHJvbCBrbm9iXG4gICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmICh0aGlzLnZhbHVlID49IHRoaXMuc3RhcnRMaW1pdCArIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAodGhpcy52YWx1ZSA8PSB0aGlzLmVuZExpbWl0IC0gdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSh0aGlzLnJhYywga25vYiwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIC8vIFNlbGVjdGlvblxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuICAgICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgICAgaWYgKHBvaW50ZXJTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyQ29udHJvbENlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICBsZXQgbGVuZ3RoID0gZml4ZWRBbmNob3IubGVuZ3RoO1xuICAgIGxldCBzdGFydEluc2V0ID0gbGVuZ3RoICogdGhpcy5zdGFydExpbWl0O1xuICAgIGxldCBlbmRJbnNldCA9IGxlbmd0aCAqICgxIC0gdGhpcy5lbmRMaW1pdCk7XG5cbiAgICAvLyBOZXcgdmFsdWUgZnJvbSB0aGUgY3VycmVudCBwb2ludGVyIHBvc2l0aW9uLCByZWxhdGl2ZSB0byBmaXhlZEFuY2hvclxuICAgIGxldCBuZXdEaXN0YW5jZSA9IGZpeGVkQW5jaG9yXG4gICAgICAucmF5LmRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChwb2ludGVyQ29udHJvbENlbnRlcik7XG4gICAgLy8gQ2xhbXBpbmcgdmFsdWUgKGphdmFzY3JpcHQgaGFzIG5vIE1hdGguY2xhbXApXG4gICAgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvci5jbGFtcFRvTGVuZ3RoKG5ld0Rpc3RhbmNlLFxuICAgICAgc3RhcnRJbnNldCwgZW5kSW5zZXQpO1xuXG4gICAgLy8gVXBkYXRlIGNvbnRyb2wgd2l0aCBuZXcgZGlzdGFuY2VcbiAgICBsZXQgbGVuZ3RoUmF0aW8gPSBuZXdEaXN0YW5jZSAvIGxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gbGVuZ3RoUmF0aW87XG4gIH1cblxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyT2Zmc2V0KSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnJhYy5wdXNoQ29tcG9zaXRlKCk7XG4gICAgZml4ZWRBbmNob3IuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCBhbmdsZSA9IGZpeGVkQW5jaG9yLmFuZ2xlKCk7XG4gICAgbGV0IGxlbmd0aCA9IGZpeGVkQW5jaG9yLmxlbmd0aDtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlclBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogaXRlbSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIG1hcmtlclBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgaWYgKHRoaXMuc3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5Qb2ludCA9IGZpeGVkQW5jaG9yLnN0YXJ0UG9pbnQoKS5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdCk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1pblBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5kTGltaXQgPCAxKSB7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiB0aGlzLmVuZExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWF4UG9pbnQsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlck9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBDb25zdHJhaW5lZCBsZW5ndGggY2xhbXBlZCB0byBsaW1pdHNcbiAgICBsZXQgY29uc3RyYWluZWRMZW5ndGggPSBmaXhlZEFuY2hvclxuICAgICAgLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQoZHJhZ2dlZENlbnRlcik7XG4gICAgbGV0IHN0YXJ0SW5zZXQgPSBsZW5ndGggKiB0aGlzLnN0YXJ0TGltaXQ7XG4gICAgbGV0IGVuZEluc2V0ID0gbGVuZ3RoICogKDEgLSB0aGlzLmVuZExpbWl0KTtcbiAgICBjb25zdHJhaW5lZExlbmd0aCA9IGZpeGVkQW5jaG9yLmNsYW1wVG9MZW5ndGgoY29uc3RyYWluZWRMZW5ndGgsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG5cbiAgICBsZXQgY29uc3RyYWluZWRBbmNob3JDZW50ZXIgPSBmaXhlZEFuY2hvclxuICAgICAgLndpdGhMZW5ndGgoY29uc3RyYWluZWRMZW5ndGgpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgY2VudGVyIGNvbnN0cmFpbmVkIHRvIGFuY2hvclxuICAgIGNvbnN0cmFpbmVkQW5jaG9yQ2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYWdnZWQgc2hhZG93IGNlbnRlciwgc2VtaSBhdHRhY2hlZCB0byBwb2ludGVyXG4gICAgLy8gYWx3YXlzIHBlcnBlbmRpY3VsYXIgdG8gYW5jaG9yXG4gICAgbGV0IGRyYWdnZWRTaGFkb3dDZW50ZXIgPSBkcmFnZ2VkQ2VudGVyXG4gICAgICAuc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KGZpeGVkQW5jaG9yLnJheSlcbiAgICAgIC8vIHJldmVyc2UgYW5kIHRyYW5zbGF0ZWQgdG8gY29uc3RyYWludCB0byBhbmNob3JcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoU3RhcnRQb2ludChjb25zdHJhaW5lZEFuY2hvckNlbnRlcilcbiAgICAgIC8vIFNlZ21lbnQgZnJvbSBjb25zdHJhaW5lZCBjZW50ZXIgdG8gc2hhZG93IGNlbnRlclxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBzaGFkb3cgY2VudGVyXG4gICAgZHJhZ2dlZFNoYWRvd0NlbnRlci5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzIC8gMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRWFzZSBmb3Igc2VnbWVudCB0byBkcmFnZ2VkIHNoYWRvdyBjZW50ZXJcbiAgICBsZXQgZWFzZU91dCA9IFJhYy5FYXNlRnVuY3Rpb24ubWFrZUVhc2VPdXQoKTtcbiAgICBlYXNlT3V0LnBvc3RCZWhhdmlvciA9IFJhYy5FYXNlRnVuY3Rpb24uQmVoYXZpb3IuY2xhbXA7XG5cbiAgICAvLyBUYWlsIHdpbGwgc3RvcCBzdHJldGNoaW5nIGF0IDJ4IHRoZSBtYXggdGFpbCBsZW5ndGhcbiAgICBsZXQgbWF4RHJhZ2dlZFRhaWxMZW5ndGggPSB0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiA1O1xuICAgIGVhc2VPdXQuaW5SYW5nZSA9IG1heERyYWdnZWRUYWlsTGVuZ3RoICogMjtcbiAgICBlYXNlT3V0Lm91dFJhbmdlID0gbWF4RHJhZ2dlZFRhaWxMZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvIGRyYWdnZWQgc2hhZG93IGNlbnRlclxuICAgIGxldCBkcmFnZ2VkVGFpbCA9IGRyYWdnZWRTaGFkb3dDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qb2ludChkcmFnZ2VkQ2VudGVyKTtcblxuICAgIGxldCBlYXNlZExlbmd0aCA9IGVhc2VPdXQuZWFzZVZhbHVlKGRyYWdnZWRUYWlsLmxlbmd0aCk7XG4gICAgZHJhZ2dlZFRhaWwud2l0aExlbmd0aChlYXNlZExlbmd0aCkuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYXcgYWxsIVxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgfVxuXG59IC8vIGNsYXNzIFJheUNvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJheUNvbnRyb2w7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBBbmdsZSBtZWFzdXJlZCBieSBhIGB0dXJuYCB2YWx1ZSBpbiB0aGUgcmFuZ2UgKlswLDEpKiB0aGF0IHJlcHJlc2VudHMgdGhlXG4qIGFtb3VudCBvZiB0dXJuIGluIGEgZnVsbCBjaXJjbGUuXG4qXG4qIE1vc3QgZnVuY3Rpb25zIHRocm91Z2ggUkFDIHRoYXQgY2FuIHJlY2VpdmUgYW4gYEFuZ2xlYCBwYXJhbWV0ZXIgY2FuXG4qIGFsc28gcmVjZWl2ZSBhIGBudW1iZXJgIHZhbHVlIHRoYXQgd2lsbCBiZSB1c2VkIGFzIGB0dXJuYCB0byBpbnN0YW50aWF0ZVxuKiBhIG5ldyBgQW5nbGVgLiBUaGUgbWFpbiBleGNlcHRpb24gdG8gdGhpcyBiZWhhdmlvdXIgYXJlIGNvbnN0cnVjdG9ycyxcbiogd2hpY2ggYWx3YXlzIGV4cGVjdCB0byByZWNlaXZlIGBBbmdsZWAgb2JqZWN0cy5cbipcbiogRm9yIGRyYXdpbmcgb3BlcmF0aW9ucyB0aGUgdHVybiB2YWx1ZSBpcyBpbnRlcnByZXRlZCB0byBiZSBwb2ludGluZyB0b1xuKiB0aGUgZm9sbG93aW5nIGRpcmVjdGlvbnM6XG4qICsgYDAvNGAgLSBwb2ludHMgcmlnaHRcbiogKyBgMS80YCAtIHBvaW50cyBkb3dud2FyZHNcbiogKyBgMi80YCAtIHBvaW50cyBsZWZ0XG4qICsgYDMvNGAgLSBwb2ludHMgdXB3YXJkc1xuKlxuKiBAYWxpYXMgUmFjLkFuZ2xlXG4qL1xuY2xhc3MgQW5nbGUge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFuZ2xlYCBpbnN0YW5jZS5cbiAgKlxuICAqIFRoZSBgdHVybmAgdmFsdWUgaXMgY29uc3RyYWluZWQgdG8gdGhlIHJhbmNlICpbMCwxKSosIGFueSB2YWx1ZVxuICAqIG91dHNpZGUgaXMgcmVkdWNlZCBiYWNrIGludG8gcmFuZ2UgdXNpbmcgYSBtb2R1bG8gb3BlcmF0aW9uLlxuICAqXG4gICogYGBgXG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDEvNCkgIC8vIHR1cm4gaXMgMS80XG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDUvNCkgIC8vIHR1cm4gaXMgMS80XG4gICogbmV3IFJhYy5BbmdsZShyYWMsIC0xLzQpIC8vIHR1cm4gaXMgMy80XG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDEpICAgIC8vIHR1cm4gaXMgMFxuICAqIG5ldyBSYWMuQW5nbGUocmFjLCA0KSAgICAvLyB0dXJuIGlzIDBcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gdHVybiAtIFRoZSB0dXJuIHZhbHVlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdHVybikge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih0dXJuKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgdHVybiA9IHR1cm4gJSAxO1xuICAgIGlmICh0dXJuIDwgMCkge1xuICAgICAgdHVybiA9ICh0dXJuICsgMSkgJSAxO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogVHVybiB2YWx1ZSBvZiB0aGUgYW5nbGUsIGNvbnN0cmFpbmVkIHRvIHRoZSByYW5nZSAqWzAsMSkqLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudHVybiA9IHR1cm47XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBBbmdsZSgke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCB0aGUgYHR1cm5gIHZhbHVlIG9mIHRoZSBhbmdsZVxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5BbmdsZS5mcm9tfSBgYW5nbGVgIGlzIHVuZGVyXG4gICogYHtAbGluayBSYWMjdW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkfWAsIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBGb3IgdGhpcyBtZXRob2QgYG90aGVyQW5nbGVgIGNhbiBvbmx5IGJlIGBBbmdsZWAgb3IgYG51bWJlcmAsIGFueSBvdGhlclxuICAqIHR5cGUgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVGhpcyBtZXRob2Qgd2lsbCBjb25zaWRlciB0dXJuIHZhbHVlcyBpbiB0aGUgb3Bvc2l0ZSBlbmRzIG9mIHRoZSByYW5nZVxuICAqICpbMCwxKSogYXMgZXF1YWxzLiBFLmcuIGBBbmdsZWAgb2JqZWN0cyB3aXRoIGB0dXJuYCB2YWx1ZXMgb2YgYDBgIGFuZFxuICAqIGAxIC0gcmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZC8yYCB3aWxsIGJlIGNvbnNpZGVyZWQgZXF1YWwuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tXG4gICovXG4gIGVxdWFscyhvdGhlckFuZ2xlKSB7XG4gICAgaWYgKG90aGVyQW5nbGUgaW5zdGFuY2VvZiBSYWMuQW5nbGUpIHtcbiAgICAgIC8vIGFsbCBnb29kIVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG90aGVyQW5nbGUgPT09ICdudW1iZXInKSB7XG4gICAgICBvdGhlckFuZ2xlID0gQW5nbGUuZnJvbSh0aGlzLnJhYywgb3RoZXJBbmdsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnModGhpcy50dXJuIC0gb3RoZXJBbmdsZS50dXJuKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZFxuICAgICAgLy8gRm9yIGNsb3NlIHZhbHVlcyB0aGF0IGxvb3AgYXJvdW5kXG4gICAgICB8fCAoMSAtIGRpZmYpIDwgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBBbmdsZWAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBgbnVtYmVyYCwgcmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGhcbiAgKiAgIGBzb21ldGhpbmdgIGFzIGB0dXJuYC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBge0BsaW5rIFJhYy5SYXl9YCwgcmV0dXJucyBpdHMgYW5nbGUuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGEgYHtAbGluayBSYWMuU2VnbWVudH1gLCByZXR1cm5zIGl0cyBhbmdsZS5cbiAgKiArIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24uXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxSYWMuUmF5fFJhYy5TZWdtZW50fG51bWJlcn0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGFuIGBBbmdsZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5BbmdsZSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzb21ldGhpbmcgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgc29tZXRoaW5nKTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5SYXkpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmcuYW5nbGU7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuU2VnbWVudCkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZy5yYXkuYW5nbGU7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgZGVyaXZlIFJhYy5BbmdsZSAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gcmFkaWFuc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tUmFkaWFucyhyYWMsIHJhZGlhbnMpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgcmFkaWFucyAvIFJhYy5UQVUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBkZWdyZWVzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiBkZWdyZWVzXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb21EZWdyZWVzKHJhYywgZGVncmVlcykge1xuICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCBkZWdyZWVzIC8gMzYwKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHBvaW50aW5nIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gdG8gYHRoaXNgLlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgxLzgpLmludmVyc2UoKSAvLyB0dXJuIGlzIDEvOCArIDEvMiA9IDUvOFxuICAqIHJhYy5BbmdsZSg3LzgpLmludmVyc2UoKSAvLyB0dXJuIGlzIDcvOCArIDEvMiA9IDMvOFxuICAqIGBgYFxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgaW52ZXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGQodGhpcy5yYWMuQW5nbGUuaW52ZXJzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGEgdHVybiB2YWx1ZSBlcXVpdmFsZW50IHRvIGAtdHVybmAuXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvNCkubmVnYXRpdmUoKSAvLyAtMS80IGJlY29tZXMgdHVybiAzLzRcbiAgKiByYWMuQW5nbGUoMy84KS5uZWdhdGl2ZSgpIC8vIC0zLzggYmVjb21lcyB0dXJuIDUvOFxuICAqIGBgYFxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgbmVnYXRpdmUoKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgLXRoaXMudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aGljaCBpcyBwZXJwZW5kaWN1bGFyIHRvIGB0aGlzYCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMS84KS5wZXJwZW5kaWN1bGFyKHRydWUpICAvLyB0dXJuIGlzIDEvOCArIDEvNCA9IDMvOFxuICAqIHJhYy5BbmdsZSgxLzgpLnBlcnBlbmRpY3VsYXIoZmFsc2UpIC8vIHR1cm4gaXMgMS84IC0gMS80ID0gNy84XG4gICogYGBgXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlmdCh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlIGluIHJhZGlhbnMuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICByYWRpYW5zKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSBpbiBkZWdyZWVzLlxuICAqXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgZGVncmVlcygpIHtcbiAgICByZXR1cm4gdGhpcy50dXJuICogMzYwO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBzaW5lIG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHNpbigpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4odGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGNvc2luZSBvZiBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBjb3MoKSB7XG4gICAgcmV0dXJuIE1hdGguY29zKHRoaXMucmFkaWFucygpKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB0YW5nZW50IG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHRhbigpIHtcbiAgICByZXR1cm4gTWF0aC50YW4odGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGB0dXJuYCB2YWx1ZSBpbiB0aGUgcmFuZ2UgYCgwLCAxXWAuIFdoZW4gYHR1cm5gIGlzIGVxdWFsIHRvXG4gICogYDBgIHJldHVybnMgYDFgIGluc3RlYWQuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICB0dXJuT25lKCkge1xuICAgIGlmICh0aGlzLnR1cm4gPT09IDApIHsgcmV0dXJuIDE7IH1cbiAgICByZXR1cm4gdGhpcy50dXJuO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCB0aGUgc3VtIG9mIGB0aGlzYCBhbmQgdGhlIGFuZ2xlIGRlcml2ZWQgZnJvbVxuICAqIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBhZGQoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiArIGFuZ2xlLnR1cm4pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tIGBhbmdsZWBcbiAgKiBzdWJ0cmFjdGVkIHRvIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3VidHJhY3QoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiAtIGFuZ2xlLnR1cm4pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgdHVybmBgIHNldCB0byBgdGhpcy50dXJuICogZmFjdG9yYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBmYWN0b3IgLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGB0dXJuYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIG11bHQoZmFjdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuICogZmFjdG9yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYHR1cm5gIHNldCB0b1xuICAqIGB7QGxpbmsgUmFjLkFuZ2xlI3R1cm5PbmUgdGhpcy50dXJuT25lKCl9ICogZmFjdG9yYC5cbiAgKlxuICAqIFVzZWZ1bCB3aGVuIGRvaW5nIHJhdGlvIGNhbGN1bGF0aW9ucyB3aGVyZSBhIHplcm8gYW5nbGUgY29ycmVzcG9uZHMgdG9cbiAgKiBhIGNvbXBsZXRlLWNpcmNsZSBzaW5jZTpcbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMCkubXVsdCgwLjUpICAgIC8vIHR1cm4gaXMgMFxuICAqIC8vIHdoZXJlYXNcbiAgKiByYWMuQW5nbGUoMCkubXVsdE9uZSgwLjUpIC8vIHR1cm4gaXMgMC41XG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZmFjdG9yIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgdHVybmAgYnlcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBtdWx0T25lKGZhY3Rvcikge1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybk9uZSgpICogZmFjdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGRpc3RhbmNlIGZyb20gYHRoaXNgIHRvIHRoZVxuICAqIGFuZ2xlIGRlcml2ZWQgZnJvbSBgYW5nbGVgLlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgxLzQpLmRpc3RhbmNlKDEvMiwgdHJ1ZSkgIC8vIHR1cm4gaXMgMS8yXG4gICogcmFjLkFuZ2xlKDEvNCkuZGlzdGFuY2UoMS8yLCBmYWxzZSkgLy8gdHVybiBpbiAzLzRcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBtZWFzdXJlbWVudFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGRpc3RhbmNlKGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMpO1xuICAgIHJldHVybiBjbG9ja3dpc2VcbiAgICAgID8gZGlzdGFuY2VcbiAgICAgIDogZGlzdGFuY2UubmVnYXRpdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCByZXN1bHQgb2Ygc2hpZnRpbmcgdGhlIGFuZ2xlIGRlcml2ZWQgZnJvbVxuICAqIGBhbmdsZWAgdG8gaGF2ZSBgdGhpc2AgYXMgaXRzIG9yaWdpbi5cbiAgKlxuICAqIFRoaXMgb3BlcmF0aW9uIGlzIHRoZSBlcXVpdmFsZW50IHRvXG4gICogKyBgdGhpcy5hZGQoYW5nbGUpYCB3aGVuIGNsb2Nrd2lzZVxuICAqICsgYHRoaXMuc3VidHJhY3QoYW5nbGUpYCB3aGVuIGNvdW50ZXItY2xvY2t3aXNlXG4gICpcbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMC4xKS5zaGlmdCgwLjMsIHRydWUpICAvLyB0dXJuIGlzIDAuMSArIDAuMyA9IDAuNFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0KDAuMywgZmFsc2UpIC8vIHR1cm4gaXMgMC4xIC0gMC4zID0gMC44XG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBiZSBzaGlmdGVkXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gY2xvY2t3aXNlXG4gICAgICA/IHRoaXMuYWRkKGFuZ2xlKVxuICAgICAgOiB0aGlzLnN1YnRyYWN0KGFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHJlc3VsdCBvZiBzaGlmdGluZyBgdGhpc2AgdG8gaGF2ZSB0aGUgYW5nbGVcbiAgKiBkZXJpdmVkIGZyb20gYG9yaWdpbmAgYXMgaXRzIG9yaWdpbi5cbiAgKlxuICAqIFRoZSByZXN1bHQgb2YgYGFuZ2xlLnNoaWZ0VG9PcmlnaW4ob3JpZ2luKWAgaXMgZXF1aXZhbGVudCB0b1xuICAqIGBvcmlnaW4uc2hpZnQoYW5nbGUpYC5cbiAgKlxuICAqIFRoaXMgb3BlcmF0aW9uIGlzIHRoZSBlcXVpdmFsZW50IHRvXG4gICogKyBgb3JpZ2luLmFkZCh0aGlzKWAgd2hlbiBjbG9ja3dpc2VcbiAgKiArIGBvcmlnaW4uc3VidHJhY3QodGhpcylgIHdoZW4gY291bnRlci1jbG9ja3dpc2VcbiAgKlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0VG9PcmlnaW4oMC4zLCB0cnVlKSAgLy8gdHVybiBpcyAwLjMgKyAwLjEgPSAwLjRcbiAgKiByYWMuQW5nbGUoMC4xKS5zaGlmdFRvT3JpZ2luKDAuMywgZmFsc2UpIC8vIHR1cm4gaXMgMC4zIC0gMC4xID0gMC4yXG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IG9yaWdpbiAtIEFuIGBBbmdsZWAgdG8gdXNlIGFzIG9yaWdpblxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzaGlmdFRvT3JpZ2luKG9yaWdpbiwgY2xvY2t3aXNlKSB7XG4gICAgb3JpZ2luID0gdGhpcy5yYWMuQW5nbGUuZnJvbShvcmlnaW4pO1xuICAgIHJldHVybiBvcmlnaW4uc2hpZnQodGhpcywgY2xvY2t3aXNlKTtcbiAgfVxuXG59IC8vIGNsYXNzIEFuZ2xlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBbmdsZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuXG4vKipcbiogQXJjIG9mIGEgY2lyY2xlIGZyb20gYSBgc3RhcnRgIHRvIGFuIGBlbmRgIFthbmdsZV17QGxpbmsgUmFjLkFuZ2xlfS5cbipcbiogQXJjcyB0aGF0IGhhdmUgW2VxdWFsXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfSBgc3RhcnRgIGFuZCBgZW5kYCBhbmdsZXNcbiogYXJlIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4qXG4qIEBhbGlhcyBSYWMuQXJjXG4qL1xuY2xhc3MgQXJje1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFyY2AgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IGNlbnRlciAtIFRoZSBjZW50ZXIgb2YgdGhlIGFyY1xuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBhcmNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gc3RhcnQgLSBBbiBgQW5nbGVgIHdoZXJlIHRoZSBhcmMgc3RhcnRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGVuZCAtIEFuZyBgQW5nbGVgIHdoZXJlIHRoZSBhcmMgZW5kc1xuICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmNcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLFxuICAgIGNlbnRlciwgcmFkaXVzLFxuICAgIHN0YXJ0LCBlbmQsXG4gICAgY2xvY2t3aXNlKVxuICB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgY2VudGVyLCByYWRpdXMsIHN0YXJ0LCBlbmQsIGNsb2Nrd2lzZSk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIGNlbnRlcik7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHJhZGl1cyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIHN0YXJ0LCBlbmQpO1xuICAgIHV0aWxzLmFzc2VydEJvb2xlYW4oY2xvY2t3aXNlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgY2VudGVyIGBQb2ludGAgb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIC8qKlxuICAgICogVGhlIHJhZGl1cyBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgYEFuZ2xlYCBvZiB0aGUgYXJjLiBUaGUgYXJjIGlzIGRyYXcgZnJvbSB0aGlzIGFuZ2xlIHRvd2FyZHNcbiAgICAqIGBlbmRgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgICAqXG4gICAgKiBXaGVuIGBzdGFydGAgYW5kIGBlbmRgIGFyZSBbZXF1YWwgYW5nbGVzXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAgICogdGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgICAqL1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydFxuXG4gICAgLyoqXG4gICAgKiBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIGFyYy4gVGhlIGFyYyBpcyBkcmF3IGZyb20gYHN0YXJ0YCB0byB0aGlzXG4gICAgKiBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICAgKlxuICAgICogV2hlbiBgc3RhcnRgIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqIHRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICAgKi9cbiAgICB0aGlzLmVuZCA9IGVuZDtcblxuICAgIC8qKlxuICAgICogVGhlIG9yaWVudGlhdGlvbiBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgKi9cbiAgICB0aGlzLmNsb2Nrd2lzZSA9IGNsb2Nrd2lzZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5jZW50ZXIueCwgICBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmNlbnRlci55LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgcmFkaXVzU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmFkaXVzLCAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydFN0ciAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFN0ciAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC50dXJuLCAgIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBBcmMoKCR7eFN0cn0sJHt5U3RyfSkgcjoke3JhZGl1c1N0cn0gczoke3N0YXJ0U3RyfSBlOiR7ZW5kU3RyfSBjOiR7dGhpcy5jbG9ja3dpc2V9fSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGFsbCBtZW1iZXJzIG9mIGJvdGggYXJjcyBhcmUgZXF1YWwuXG4gICpcbiAgKiBXaGVuIGBvdGhlckFyY2AgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5BcmNgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBBcmNzJyBgcmFkaXVzYCBhcmUgY29tcGFyZWQgdXNpbmcgYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBvdGhlclNlZ21lbnQgLSBBIGBTZWdtZW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICogQHNlZSBSYWMjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlckFyYykge1xuICAgIHJldHVybiBvdGhlckFyYyBpbnN0YW5jZW9mIEFyY1xuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMucmFkaXVzLCBvdGhlckFyYy5yYWRpdXMpXG4gICAgICAmJiB0aGlzLmNsb2Nrd2lzZSA9PT0gb3RoZXJBcmMuY2xvY2t3aXNlXG4gICAgICAmJiB0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXJBcmMuc3RhcnQpXG4gICAgICAmJiB0aGlzLmVuZC5lcXVhbHMob3RoZXJBcmMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBhcmM6IHRoZSBwYXJ0IG9mIHRoZSBjaXJjdW1mZXJlbmNlIHRoZSBhcmNcbiAgKiByZXByZXNlbnRzLlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmdsZURpc3RhbmNlKCkudHVybk9uZSgpICogdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGNvbnNpZGVyZWQgYXMgYSBjb21wbGV0ZVxuICAqIGNpcmNsZS5cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBjaXJjdW1mZXJlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnJhZGl1cyAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGRpc3RhbmNlIGJldHdlZW4gYHN0YXJ0YCBhbmRcbiAgKiBgZW5kYCwgaW4gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmMuXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgYW5nbGVEaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5kaXN0YW5jZSh0aGlzLmVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCB3aGVyZSB0aGUgYXJjIHN0YXJ0cy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdGFydFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZSh0aGlzLnN0YXJ0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIGFyYyBlbmRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGVuZFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZSh0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgY2VudGVyYCB0b3dhcnMgYHN0YXJ0YC5cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgc3RhcnRSYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5zdGFydCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgY2VudGVyYCB0b3dhcnMgYGVuZGAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIGVuZFJheSgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYGNlbnRlcmAgdG8gYHN0YXJ0UG9pbnQoKWAuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzdGFydFNlZ21lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcy5zdGFydFJheSgpLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYGNlbnRlcmAgdG8gYGVuZFBvaW50KClgLlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgZW5kU2VnbWVudCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLmVuZFJheSgpLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHN0YXJ0UG9pbnQoKWAgdG8gYGVuZFBvaW50KClgLlxuICAqXG4gICogTm90ZSB0aGF0IGZvciBjb21wbGV0ZSBjaXJjbGUgYXJjcyB0aGlzIHNlZ21lbnQgd2lsbCBoYXZlIGEgbGVuZ3RoIG9mXG4gICogemVybyBhbmQgYmUgcG9pbnRlZCB0b3dhcmRzIHRoZSBwZXJwZW5kaWN1bGFyIG9mIGBzdGFydGAgaW4gdGhlIGFyYydzXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGNob3JkU2VnbWVudCgpIHtcbiAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gdGhpcy5zdGFydC5wZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydFBvaW50KCkuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRQb2ludCgpLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyYyBpcyBhIGNvbXBsZXRlIGNpcmNsZSwgd2hpY2ggaXMgd2hlbiBgc3RhcnRgXG4gICogYW5kIGBlbmRgIGFyZSBbZXF1YWwgYW5nbGVzXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfS5cbiAgKlxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAqL1xuICBpc0NpcmNsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5lcXVhbHModGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIHNldCB0byBgbmV3Q2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3Q2VudGVyIC0gVGhlIGNlbnRlciBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoQ2VudGVyKG5ld0NlbnRlcikge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgbmV3Q2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggc3RhcnQgc2V0IHRvIGBuZXdTdGFydGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdTdGFydCAtIFRoZSBzdGFydCBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoU3RhcnQobmV3U3RhcnQpIHtcbiAgICBjb25zdCBuZXdTdGFydEFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld1N0YXJ0KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0QW5nbGUsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggZW5kIHNldCB0byBgbmV3RW5kYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IG5ld0VuZCAtIFRoZSBlbmQgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aEVuZChuZXdFbmQpIHtcbiAgICBjb25zdCBuZXdFbmRBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdFbmQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kQW5nbGUsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCByYWRpdXMgc2V0IHRvIGBuZXdSYWRpdXNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdSYWRpdXMgLSBUaGUgcmFkaXVzIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhSYWRpdXMobmV3UmFkaXVzKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBpdHMgb3JpZW50YXRpb24gc2V0IHRvIGBuZXdDbG9ja3dpc2VgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gbmV3Q2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhDbG9ja3dpc2UobmV3Q2xvY2t3aXNlKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIG5ld0Nsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCB0aGUgZ2l2ZW4gYGFuZ2xlRGlzdGFuY2VgIGFzIHRoZSBkaXN0YW5jZVxuICAqIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLiBUaGlzIGNoYW5nZXMgYGVuZGBcbiAgKiBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2Ugb2YgdGhlXG4gICogbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBSYWMuQXJjI2FuZ2xlRGlzdGFuY2VcbiAgKi9cbiAgd2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHRoZSBnaXZlbiBgbGVuZ3RoYCBhcyB0aGUgbGVuZ3RoIG9mIHRoZVxuICAqIHBhcnQgb2YgdGhlIGNpcmN1bWZlcmVuY2UgaXQgcmVwcmVzZW50cy4gVGhpcyBjaGFuZ2VzIGBlbmRgIGZvciB0aGVcbiAgKiBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVGhlIGFjdHVhbCBgbGVuZ3RoKClgIG9mIHRoZSByZXN1bHRpbmcgYEFyY2Agd2lsbCBhbHdheXMgYmUgaW4gdGhlXG4gICogcmFuZ2UgYFswLHJhZGl1cypUQVUpYC4gV2hlbiB0aGUgZ2l2ZW4gYGxlbmd0aGAgaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIGN1dCBiYWNrIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBSYWMuQXJjI2xlbmd0aFxuICAqL1xuICB3aXRoTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBsZW5ndGhgIGFkZGVkIHRvIHRoZSBwYXJ0IG9mIHRoZVxuICAqIGNpcmN1bWZlcmVuY2UgYHRoaXNgIHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIHJlc3VsdGluZyBgbGVuZ3RoYCBpcyBsYXJnZXIgdGhhdCB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgYXMgYSBjb21wbGV0ZSBjaXJjbGUsIHRoZSByZXN1bHRpbmcgYXJjIGxlbmd0aFxuICAqIHdpbGwgYmUgY3V0IGJhY2sgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgUmFjLkFyYyNsZW5ndGhcbiAgKi9cbiAgd2l0aExlbmd0aEFkZChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdBbmdsZURpc3RhbmNlID0gKHRoaXMubGVuZ3RoKCkgKyBsZW5ndGgpIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMud2l0aEFuZ2xlRGlzdGFuY2UobmV3QW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBhIGBsZW5ndGgoKWAgb2YgYHRoaXMubGVuZ3RoKCkgKiByYXRpb2AuIFRoaXNcbiAgKiBjaGFuZ2VzIGBlbmRgIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlICpbMCxyYWRpdXMqVEFVKSouIFdoZW4gdGhlIGNhbGN1bGF0ZWQgbGVuZ3RoIGlzIGxhcmdlciB0aGF0IHRoZVxuICAqIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBhcyBhIGNvbXBsZXRlIGNpcmNsZSwgdGhlIHJlc3VsdGluZyBhcmMgbGVuZ3RoXG4gICogd2lsbCBiZSBjdXQgYmFjayBpbnRvIHJhbmdlIHRocm91Z2ggYSBtb2R1bG8gb3BlcmF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoKClgIGJ5XG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFJhYy5BcmMjbGVuZ3RoXG4gICovXG4gIHdpdGhMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IHRoaXMubGVuZ3RoKCkgKiByYXRpbztcbiAgICByZXR1cm4gdGhpcy53aXRoTGVuZ3RoKG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRQb2ludCgpYCBsb2NhdGVkIGF0IGBwb2ludGAuIFRoaXNcbiAgKiBjaGFuZ2VzIGBzdGFydGAgYW5kIGByYWRpdXNgIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBhdCB0aGUgYHN0YXJ0UG9pbnQoKSBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgd2l0aFN0YXJ0UG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3UmFkaXVzID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kUG9pbnQoKWAgbG9jYXRlZCBhdCBgcG9pbnRgLiBUaGlzIGNoYW5nZXNcbiAgKiBgZW5kYCBhbmQgYHJhZGl1c2AgaW4gdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIGF0IHRoZSBgZW5kUG9pbnQoKSBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgd2l0aEVuZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3RW5kID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmVuZCk7XG4gICAgY29uc3QgbmV3UmFkaXVzID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHBvaW50aW5nIHRvd2FyZHMgYHBvaW50YCBmcm9tXG4gICogYGNlbnRlcmAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuc3RhcnRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBzdGFydGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhTdGFydFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLnN0YXJ0KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBlbmRgIHBvaW50aW5nIHRvd2FyZHMgYHBvaW50YCBmcm9tIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLmVuZGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICB3aXRoRW5kVG93YXJkc1BvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3RW5kID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHBvaW50aW5nIHRvd2FyZHMgYHN0YXJ0UG9pbnRgIGFuZFxuICAqIGBlbmRgIHBvaW50aW5nIHRvd2FyZHMgYGVuZFBvaW50YCwgYm90aCBmcm9tIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqICogV2hlbiBgY2VudGVyYCBpcyBjb25zaWRlcmVkIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gdG9cbiAgKiBlaXRoZXIgYHN0YXJ0UG9pbnRgIG9yIGBlbmRQb2ludGAsIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuc3RhcnRgXG4gICogb3IgYHRoaXMuZW5kYCByZXNwZWN0aXZlbHkuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnRQb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0gez9SYWMuUG9pbnR9IFtlbmRQb2ludD1udWxsXSAtIEEgYFBvaW50YCB0byBwb2ludCBgZW5kYCB0b3dhcmRzO1xuICAqIHdoZW4gb21taXRlZCBvciBgbnVsbGAsIGBzdGFydFBvaW50YCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgd2l0aEFuZ2xlc1Rvd2FyZHNQb2ludChzdGFydFBvaW50LCBlbmRQb2ludCA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChzdGFydFBvaW50LCB0aGlzLnN0YXJ0KTtcbiAgICBjb25zdCBuZXdFbmQgPSBlbmRQb2ludCA9PT0gbnVsbFxuICAgICAgPyBuZXdTdGFydFxuICAgICAgOiB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoZW5kUG9pbnQsIHRoaXMuZW5kKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIGBhbmdsZWAgaW4gdGhlXG4gICogYXJjJ3Mgb3Bwb3NpdGUgb3JpZW50YXRpb24uXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhpcyBtZXRob2Qgc2hpZnRzIGBzdGFydGAgdG8gdGhlIGFyYydzICpvcHBvc2l0ZSpcbiAgKiBvcmllbnRhdGlvbiwgaW50ZW5kaW5nIHRvIHJlc3VsdCBpbiBhIG5ldyBgQXJjYCB3aXRoIGFuIGluY3JlYXNlIHRvXG4gICogYGFuZ2xlRGlzdGFuY2UoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0IGBzdGFydGAgYWdhaW5zdFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoU3RhcnRFeHRlbnNpb24oYW5nbGUpIHtcbiAgICBsZXQgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnNoaWZ0KGFuZ2xlLCAhdGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYGVuZGAgc2hpZnRlZCBieSB0aGUgZ2l2ZW4gYGFuZ2xlYCBpbiB0aGVcbiAgKiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBOb3RpY2UgdGhhdCB0aGlzIG1ldGhvZCBzaGlmdHMgYGVuZGAgdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24sXG4gICogaW50ZW5kaW5nIHRvIHJlc3VsdCBpbiBhIG5ldyBgQXJjYCB3aXRoIGFuIGluY3JlYXNlIHRvXG4gICogYGFuZ2xlRGlzdGFuY2UoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0IGBzdGFydGAgYWdhaW5zdFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoRW5kRXh0ZW5zaW9uKGFuZ2xlKSB7XG4gICAgbGV0IG5ld0VuZCA9IHRoaXMuZW5kLnNoaWZ0KGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBpdHMgYHN0YXJ0YCBhbmQgYGVuZGAgZXhjaGFuZ2VkLCBhbmQgdGhlXG4gICogb3Bwb3NpdGUgY2xvY2t3aXNlIG9yaWVudGF0aW9uLiBUaGUgY2VudGVyIGFuZCByYWRpdXMgcmVtYWluIGJlIHRoZVxuICAqIHNhbWUgYXMgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHJldmVyc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLmVuZCwgdGhpcy5zdGFydCxcbiAgICAgICF0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGdpdmVuIGBhbmdsZWAgY2xhbXBlZCB0byB0aGUgcmFuZ2U6XG4gICogYGBgXG4gICogW3N0YXJ0ICsgc3RhcnRJbnNldCwgZW5kIC0gZW5kSW5zZXRdXG4gICogYGBgXG4gICogd2hlcmUgdGhlIGFkZGl0aW9uIGhhcHBlbnMgdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24sIGFuZCB0aGVcbiAgKiBzdWJ0cmFjdGlvbiBhZ2FpbnN0LlxuICAqXG4gICogV2hlbiBgYW5nbGVgIGlzIG91dHNpZGUgdGhlIHJhbmdlLCByZXR1cm5zIHdoaWNoZXZlciByYW5nZSBsaW1pdCBpc1xuICAqIGNsb3Nlci5cbiAgKlxuICAqIFdoZW4gdGhlIHN1bSBvZiB0aGUgZ2l2ZW4gaW5zZXRzIGlzIGxhcmdlciB0aGF0IGB0aGlzLmFyY0Rpc3RhbmNlKClgXG4gICogdGhlIHJhbmdlIGZvciB0aGUgY2xhbXAgaXMgaW1wb3NpYmxlIHRvIGZ1bGZpbGwuIEluIHRoaXMgY2FzZSB0aGVcbiAgKiByZXR1cm5lZCB2YWx1ZSB3aWxsIGJlIHRoZSBjZW50ZXJlZCBiZXR3ZWVuIHRoZSByYW5nZSBsaW1pdHMgYW5kIHN0aWxsXG4gICogY2xhbXBsZWQgdG8gYFtzdGFydCwgZW5kXWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBjbGFtcFxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gW3N0YXJ0SW5zZXQ9e0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XSAtIFRoZSBpbnNldFxuICAqIGZvciB0aGUgbG93ZXIgbGltaXQgb2YgdGhlIGNsYW1waW5nIHJhbmdlXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZW5kSW5zZXQ9e0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XSAtIFRoZSBpbnNldFxuICAqIGZvciB0aGUgaGlnaGVyIGxpbWl0IG9mIHRoZSBjbGFtcGluZyByYW5nZVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGNsYW1wVG9BbmdsZXMoYW5nbGUsIHN0YXJ0SW5zZXQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvLCBlbmRJbnNldCA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgc3RhcnRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzdGFydEluc2V0KTtcbiAgICBlbmRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRJbnNldCk7XG5cbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpICYmIHN0YXJ0SW5zZXQudHVybiA9PSAwICYmIGVuZEluc2V0LnR1cm4gPT0gMCkge1xuICAgICAgLy8gQ29tcGxldGUgY2lyY2xlXG4gICAgICByZXR1cm4gYW5nbGU7XG4gICAgfVxuXG4gICAgLy8gQW5nbGUgaW4gYXJjLCB3aXRoIGFyYyBhcyBvcmlnaW5cbiAgICAvLyBBbGwgY29tcGFyaXNvbnMgYXJlIG1hZGUgaW4gYSBjbG9ja3dpc2Ugb3JpZW50YXRpb25cbiAgICBjb25zdCBzaGlmdGVkQW5nbGUgPSB0aGlzLmRpc3RhbmNlRnJvbVN0YXJ0KGFuZ2xlKTtcbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3Qgc2hpZnRlZFN0YXJ0Q2xhbXAgPSBzdGFydEluc2V0O1xuICAgIGNvbnN0IHNoaWZ0ZWRFbmRDbGFtcCA9IGFuZ2xlRGlzdGFuY2Uuc3VidHJhY3QoZW5kSW5zZXQpO1xuICAgIGNvbnN0IHRvdGFsSW5zZXRUdXJuID0gc3RhcnRJbnNldC50dXJuICsgZW5kSW5zZXQudHVybjtcblxuICAgIGlmICh0b3RhbEluc2V0VHVybiA+PSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSkge1xuICAgICAgLy8gSW52YWxpZCByYW5nZVxuICAgICAgY29uc3QgcmFuZ2VEaXN0YW5jZSA9IHNoaWZ0ZWRFbmRDbGFtcC5kaXN0YW5jZShzaGlmdGVkU3RhcnRDbGFtcCk7XG4gICAgICBsZXQgaGFsZlJhbmdlO1xuICAgICAgaWYgKHRoaXMuaXNDaXJjbGUoKSkge1xuICAgICAgICBoYWxmUmFuZ2UgPSByYW5nZURpc3RhbmNlLm11bHQoMS8yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhhbGZSYW5nZSA9IHRvdGFsSW5zZXRUdXJuID49IDFcbiAgICAgICAgICA/IHJhbmdlRGlzdGFuY2UubXVsdE9uZSgxLzIpXG4gICAgICAgICAgOiByYW5nZURpc3RhbmNlLm11bHQoMS8yKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWlkZGxlUmFuZ2UgPSBzaGlmdGVkRW5kQ2xhbXAuYWRkKGhhbGZSYW5nZSk7XG4gICAgICBjb25zdCBtaWRkbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KG1pZGRsZVJhbmdlLCB0aGlzLmNsb2Nrd2lzZSk7XG5cbiAgICAgIHJldHVybiB0aGlzLmNsYW1wVG9BbmdsZXMobWlkZGxlKTtcbiAgICB9XG5cbiAgICBpZiAoc2hpZnRlZEFuZ2xlLnR1cm4gPj0gc2hpZnRlZFN0YXJ0Q2xhbXAudHVybiAmJiBzaGlmdGVkQW5nbGUudHVybiA8PSBzaGlmdGVkRW5kQ2xhbXAudHVybikge1xuICAgICAgLy8gSW5zaWRlIGNsYW1wIHJhbmdlXG4gICAgICByZXR1cm4gYW5nbGU7XG4gICAgfVxuXG4gICAgLy8gT3V0c2lkZSByYW5nZSwgZmlndXJlIG91dCBjbG9zZXN0IGxpbWl0XG4gICAgbGV0IGRpc3RhbmNlVG9TdGFydENsYW1wID0gc2hpZnRlZFN0YXJ0Q2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlLCBmYWxzZSk7XG4gICAgbGV0IGRpc3RhbmNlVG9FbmRDbGFtcCA9IHNoaWZ0ZWRFbmRDbGFtcC5kaXN0YW5jZShzaGlmdGVkQW5nbGUpO1xuICAgIGlmIChkaXN0YW5jZVRvU3RhcnRDbGFtcC50dXJuIDw9IGRpc3RhbmNlVG9FbmRDbGFtcC50dXJuKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC5zaGlmdChzdGFydEluc2V0LCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZC5zaGlmdChlbmRJbnNldCwgIXRoaXMuY2xvY2t3aXNlKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYGFuZ2xlYCBpcyBiZXR3ZWVuIGBzdGFydGAgYW5kIGBlbmRgIGluIHRoZSBhcmMnc1xuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiB0aGUgYXJjIHJlcHJlc2VudHMgYSBjb21wbGV0ZSBjaXJjbGUsIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBldmFsdWF0ZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICBjb250YWluc0FuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIGlmICh0aGlzLmNsb2Nrd2lzZSkge1xuICAgICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuc3RhcnQpO1xuICAgICAgbGV0IGVuZE9mZnNldCA9IHRoaXMuZW5kLnN1YnRyYWN0KHRoaXMuc3RhcnQpO1xuICAgICAgcmV0dXJuIG9mZnNldC50dXJuIDw9IGVuZE9mZnNldC50dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gYW5nbGUuc3VidHJhY3QodGhpcy5lbmQpO1xuICAgICAgbGV0IHN0YXJ0T2Zmc2V0ID0gdGhpcy5zdGFydC5zdWJ0cmFjdCh0aGlzLmVuZCk7XG4gICAgICByZXR1cm4gb2Zmc2V0LnR1cm4gPD0gc3RhcnRPZmZzZXQudHVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgaW4gdGhlIGFyYyBpcyBwb3NpdGlvbmVkXG4gICogYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBXaGVuIHRoZSBhcmMgcmVwcmVzZW50cyBhIGNvbXBsZXRlIGNpcmNsZSwgYHRydWVgIGlzIGFsd2F5cyByZXR1cm5lZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBldmFsdWF0ZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICBjb250YWluc1Byb2plY3RlZFBvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5zQW5nbGUodGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50KSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGBhbmdsZWAgW3NoaWZ0ZWQgYnlde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKiBgc3RhcnRgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEUuZy5cbiAgKiBGb3IgYSBjbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IGAwLjVgOiBgc2hpZnRBbmdsZSgwLjEpYCBpcyBgMC42YC5cbiAgKiBGb3IgYSBjb3VudGVyLWNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWA6IGBzaGlmdEFuZ2xlKDAuMSlgIGlzIGAwLjRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgUmFjLkFuZ2xlI3NoaWZ0XG4gICovXG4gIHNoaWZ0QW5nbGUoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuc2hpZnQoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYW4gQW5nbGUgdGhhdCByZXByZXNlbnRzIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0YCB0b1xuICAvLyBgYW5nbGVgIHRyYXZlbGluZyBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gIC8vIFVzZWZ1bCB0byBkZXRlcm1pbmUgZm9yIGEgZ2l2ZW4gYW5nbGUsIHdoZXJlIGl0IHNpdHMgaW5zaWRlIHRoZSBhcmMgaWZcbiAgLy8gdGhlIGFyYyB3YXMgdGhlIG9yaWdpbiBjb29yZGluYXRlIHN5c3RlbS5cbiAgLy9cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHRoYXQgcmVwcmVzZW50cyB0aGUgYW5nbGUgZGlzdGFuY2UgZnJvbSBgc3RhcnRgXG4gICogdG8gYGFuZ2xlYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBFLmcuXG4gICogRm9yIGEgY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCBgMC41YDogYGRpc3RhbmNlRnJvbVN0YXJ0KDAuNilgIGlzIGAwLjFgLlxuICAqIEZvciBhIGNvdW50ZXItY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCBgMC41YDogYGRpc3RhbmNlRnJvbVN0YXJ0KDAuNilgIGlzIGAwLjlgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZUZyb21TdGFydChhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5kaXN0YW5jZShhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBgYW5nbGVgLiBUaGlzXG4gICogbWV0aG9kIGRvZXMgbm90IGNvbnNpZGVyIHRoZSBgc3RhcnRgIG5vciBgZW5kYCBvZiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG93YXJkcyB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QW5nbGUoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMuY2VudGVyLnBvaW50VG9BbmdsZShhbmdsZSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBgYW5nbGVgXG4gICogW3NoaWZ0ZWQgYnlde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH0gYHN0YXJ0YCBpbiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gYmUgc2hpZnRlZCBieSBgc3RhcnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEFuZ2xlRGlzdGFuY2UoYW5nbGUpIHtcbiAgICBsZXQgc2hpZnRlZEFuZ2xlID0gdGhpcy5zaGlmdEFuZ2xlKGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUoc2hpZnRlZEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGxlbmd0aGAgZnJvbVxuICAqIGBzdGFydFBvaW50KClgIGluIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggZnJvbSBgc3RhcnRQb2ludCgpYCB0byB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0TGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCBgbGVuZ3RoKCkgKiByYXRpb2AgZnJvbVxuICAqIGBzdGFydFBvaW50KClgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGxldCBuZXdBbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCkubXVsdE9uZShyYXRpbyk7XG4gICAgbGV0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuc2hpZnRBbmdsZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUoc2hpZnRlZEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBhdCB0aGVcbiAgKiBnaXZlbiBgYW5nbGVgLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGUgYHN0YXJ0YCBub3IgYGVuZGAgb2ZcbiAgKiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIFRoZSBkaXJlY3Rpb24gb2YgdGhlIHJhZGl1cyB0byByZXR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJhZGl1c1NlZ21lbnRBdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGluIHRoZVxuICAqIGRpcmVjdGlvbiB0b3dhcmRzIHRoZSBnaXZlbiBgcG9pbnRgLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGVcbiAgKiBgc3RhcnRgIG5vciBgZW5kYCBvZiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMucG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIGluIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJhZGl1cyB0byByZXR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJhZGl1c1NlZ21lbnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBhbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZvciB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZSBpbnRlcnNlY3Rpb24gb2ZcbiAgKiBgdGhpc2AgYW5kIGBvdGhlckFyY2AsIG9yIGBudWxsYCB3aGVuIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgU2VnbWVudGAgd2lsbCBwb2ludCB0b3dhcmRzIHRoZSBgdGhpc2Agb3JpZW50YXRpb24uXG4gICpcbiAgKiBCb3RoIGFyY3MgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcyBmb3IgdGhlIGNhbGN1bGF0aW9uIG9mIHRoZVxuICAqIGNob3JkLCB0aHVzIHRoZSBlbmRwb2ludHMgb2YgdGhlIHJldHVybmVkIHNlZ21lbnQgbWF5IG5vdCBsYXkgaW5zaWRlXG4gICogdGhlIGFjdHVhbCBhcmNzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIGRlc2NyaXB0aW9uXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpIHtcbiAgICAvLyBodHRwczovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9DaXJjbGUtQ2lyY2xlSW50ZXJzZWN0aW9uLmh0bWxcbiAgICAvLyBSPXRoaXMsIHI9b3RoZXJBcmNcblxuICAgIGlmICh0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLmNlbnRlci5kaXN0YW5jZVRvUG9pbnQob3RoZXJBcmMuY2VudGVyKTtcblxuICAgIGlmIChkaXN0YW5jZSA+IHRoaXMucmFkaXVzICsgb3RoZXJBcmMucmFkaXVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBkaXN0YW5jZVRvQ2hvcmQgPSAoZF4yIC0gcl4yICsgUl4yKSAvIChkKjIpXG4gICAgY29uc3QgZGlzdGFuY2VUb0Nob3JkID0gKFxuICAgICAgICBNYXRoLnBvdyhkaXN0YW5jZSwgMilcbiAgICAgIC0gTWF0aC5wb3cob3RoZXJBcmMucmFkaXVzLCAyKVxuICAgICAgKyBNYXRoLnBvdyh0aGlzLnJhZGl1cywgMilcbiAgICAgICkgLyAoZGlzdGFuY2UgKiAyKTtcblxuICAgIC8vIGEgPSAxL2Qgc3FydHwoLWQrci1SKSgtZC1yK1IpKC1kK3IrUikoZCtyK1IpXG4gICAgY29uc3QgY2hvcmRMZW5ndGggPSAoMSAvIGRpc3RhbmNlKSAqIE1hdGguc3FydChcbiAgICAgICAgKC1kaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyAtIHRoaXMucmFkaXVzKVxuICAgICAgKiAoLWRpc3RhbmNlIC0gb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpXG4gICAgICAqICgtZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgKyB0aGlzLnJhZGl1cylcbiAgICAgICogKGRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpKTtcblxuICAgIGNvbnN0IHNlZ21lbnRUb0Nob3JkID0gdGhpcy5jZW50ZXIucmF5VG9Qb2ludChvdGhlckFyYy5jZW50ZXIpXG4gICAgICAuc2VnbWVudChkaXN0YW5jZVRvQ2hvcmQpO1xuICAgIHJldHVybiBzZWdtZW50VG9DaG9yZC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIodGhpcy5jbG9ja3dpc2UsIGNob3JkTGVuZ3RoLzIpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aFJhdGlvKDIpO1xuICB9XG5cblxuICAvLyBUT0RPOiBjb25zaWRlciBpZiBpbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjIGlzIG5lY2Vzc2FyeVxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGludGVyc2VjdGluZyBwb2ludHMgb2YgYHRoaXNgIHdpdGhcbiAgKiBgb3RoZXJBcmNgLlxuICAqXG4gICogV2hlbiB0aGVyZSBhcmUgbm8gaW50ZXJzZWN0aW5nIHBvaW50cywgcmV0dXJucyBhbiBlbXB0eSBhcnJheS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgaW50ZXJzZWN0aW9uIHBvaW50cyB3aXRoXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAaWdub3JlXG4gICovXG4gIC8vIGludGVyc2VjdGluZ1BvaW50c1dpdGhBcmMob3RoZXJBcmMpIHtcbiAgLy8gICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgLy8gICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIFtdOyB9XG5cbiAgLy8gICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtjaG9yZC5zdGFydFBvaW50KCksIGNob3JkLmVuZFBvaW50KCldLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gIC8vICAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0pKVxuICAvLyAgICAgICAmJiBvdGhlckFyYy5jb250YWluc0FuZ2xlKG90aGVyQXJjLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSk7XG4gIC8vICAgfSwgdGhpcyk7XG5cbiAgLy8gICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSBjaG9yZCBmb3JtZWQgYnkgdGhlXG4gICogaW50ZXJzZWN0aW9uIG9mIHRoZSBhcmMgYW5kICdyYXknLCBvciBgbnVsbGAgd2hlbiBubyBjaG9yZCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgU2VnbWVudGAgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSBhbmdsZSBhcyBgcmF5YC5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSBhbmQgYHJheWAgaXMgY29uc2lkZXJlZCBhblxuICAqIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5TZWdtZW50fVxuICAqL1xuICBpbnRlcnNlY3Rpb25DaG9yZFdpdGhSYXkocmF5KSB7XG4gICAgLy8gRmlyc3QgY2hlY2sgaW50ZXJzZWN0aW9uXG4gICAgY29uc3QgYmlzZWN0b3IgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkocmF5KTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IGJpc2VjdG9yLmxlbmd0aDtcblxuICAgIC8vIFNlZ21lbnQgdG9vIGNsb3NlIHRvIGNlbnRlciwgY29zaW5lIGNhbGN1bGF0aW9ucyBtYXkgYmUgaW5jb3JyZWN0XG4gICAgLy8gQ2FsY3VsYXRlIHNlZ21lbnQgdGhyb3VnaCBjZW50ZXJcbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKDAsIGRpc3RhbmNlKSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShyYXkuYW5nbGUuaW52ZXJzZSgpKTtcbiAgICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBzdGFydCwgcmF5LmFuZ2xlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMqMik7XG4gICAgfVxuXG4gICAgLy8gUmF5IGlzIHRhbmdlbnQsIHJldHVybiB6ZXJvLWxlbmd0aCBzZWdtZW50IGF0IGNvbnRhY3QgcG9pbnRcbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKGRpc3RhbmNlLCB0aGlzLnJhZGl1cykpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUoYmlzZWN0b3IucmF5LmFuZ2xlKTtcbiAgICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBzdGFydCwgcmF5LmFuZ2xlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgMCk7XG4gICAgfVxuXG4gICAgLy8gUmF5IGRvZXMgbm90IHRvdWNoIGFyY1xuICAgIGlmIChkaXN0YW5jZSA+IHRoaXMucmFkaXVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpYW5zID0gTWF0aC5hY29zKGRpc3RhbmNlL3RoaXMucmFkaXVzKTtcbiAgICBjb25zdCBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgcmFkaWFucyk7XG5cbiAgICBjb25zdCBjZW50ZXJPcmllbnRhdGlvbiA9IHJheS5wb2ludE9yaWVudGF0aW9uKHRoaXMuY2VudGVyKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLmFuZ2xlKCkuc2hpZnQoYW5nbGUsICFjZW50ZXJPcmllbnRhdGlvbikpO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLmFuZ2xlKCkuc2hpZnQoYW5nbGUsIGNlbnRlck9yaWVudGF0aW9uKSk7XG4gICAgcmV0dXJuIHN0YXJ0LnNlZ21lbnRUb1BvaW50KGVuZCwgcmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHJlcHJlc2VudGluZyB0aGUgZW5kIG9mIHRoZSBjaG9yZCBmb3JtZWQgYnkgdGhlXG4gICogaW50ZXJzZWN0aW9uIG9mIHRoZSBhcmMgYW5kICdyYXknLCBvciBgbnVsbGAgd2hlbiBubyBjaG9yZCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFdoZW4gYHVzZVByb2plY3Rpb25gIGlzIGB0cnVlYCB0aGUgbWV0aG9kIHdpbGwgYWx3YXlzIHJldHVybiBhIGBQb2ludGBcbiAgKiBldmVuIHdoZW4gdGhlcmUgaXMgbm8gY29udGFjdCBiZXR3ZWVuIHRoZSBhcmMgYW5kIGByYXlgLiBJbiB0aGlzIGNhc2VcbiAgKiB0aGUgcG9pbnQgaW4gdGhlIGFyYyBjbG9zZXN0IHRvIGByYXlgIGlzIHJldHVybmVkLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlIGFuZCBgcmF5YCBpcyBjb25zaWRlcmVkIGFuXG4gICogdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLlBvaW50fVxuICAqL1xuICBpbnRlcnNlY3Rpb25DaG9yZEVuZFdpdGhSYXkocmF5LCB1c2VQcm9qZWN0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBjaG9yZCA9IHRoaXMuaW50ZXJzZWN0aW9uQ2hvcmRXaXRoUmF5KHJheSk7XG4gICAgaWYgKGNob3JkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY2hvcmQuZW5kUG9pbnQoKTtcbiAgICB9XG5cbiAgICBpZiAodXNlUHJvamVjdGlvbikge1xuICAgICAgY29uc3QgY2VudGVyT3JpZW50YXRpb24gPSByYXkucG9pbnRPcmllbnRhdGlvbih0aGlzLmNlbnRlcik7XG4gICAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gcmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoIWNlbnRlck9yaWVudGF0aW9uKTtcbiAgICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZShwZXJwZW5kaWN1bGFyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCByZXByZXNlbnRpbmcgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIHRoYXQgaXMgaW5zaWRlXG4gICogYG90aGVyQXJjYCwgb3IgYG51bGxgIHdoZW4gdGhlcmUgaXMgbm8gaW50ZXJzZWN0aW9uLiBUaGUgcmV0dXJuZWQgYXJjXG4gICogd2lsbCBoYXZlIHRoZSBzYW1lIGNlbnRlciwgcmFkaXVzLCBhbmQgb3JpZW50YXRpb24gYXMgYHRoaXNgLlxuICAqXG4gICogQm90aCBhcmNzIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMgZm9yIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGVcbiAgKiBpbnRlcnNlY3Rpb24sIHRodXMgdGhlIGVuZHBvaW50cyBvZiB0aGUgcmV0dXJuZWQgYXJjIG1heSBub3QgbGF5IGluc2lkZVxuICAqIGB0aGlzYC5cbiAgKlxuICAqIEFuIGVkZ2UgY2FzZSBvZiB0aGlzIG1ldGhvZCBpcyB0aGF0IHdoZW4gdGhlIGRpc3RhbmNlIGJldHdlZW4gYHRoaXNgXG4gICogYW5kIGBvdGhlckFyY2AgaXMgdGhlIHN1bSBvZiB0aGVpciByYWRpdXMsIG1lYW5pbmcgdGhlIGFyY3MgdG91Y2ggYXQgYVxuICAqIHNpbmdsZSBwb2ludCwgdGhlIHJlc3VsdGluZyBhcmMgbWF5IGhhdmUgYSBhbmdsZS1kaXN0YW5jZSBvZiB6ZXJvLFxuICAqIHdoaWNoIGlzIGludGVycHJldGVkIGFzIGEgY29tcGxldGUtY2lyY2xlIGFyYy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBpbnRlcnNlY3Qgd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLkFyY31cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQXJjKG90aGVyQXJjKSB7XG4gICAgY29uc3QgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIHJldHVybiB0aGlzLndpdGhBbmdsZXNUb3dhcmRzUG9pbnQoY2hvcmQuc3RhcnRQb2ludCgpLCBjaG9yZC5lbmRQb2ludCgpKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogaW1wbGVtZW50IGludGVyc2VjdGlvbkFyY05vQ2lyY2xlP1xuXG5cbiAgLy8gVE9ETzogZmluaXNoIGJvdW5kZWRJbnRlcnNlY3Rpb25BcmNcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCByZXByZXNlbnRpbmcgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIHRoYXQgaXMgaW5zaWRlXG4gICogYG90aGVyQXJjYCBhbmQgYm91bmRlZCBieSBgdGhpcy5zdGFydGAgYW5kIGB0aGlzLmVuZGAsIG9yIGBudWxsYCB3aGVuXG4gICogdGhlcmUgaXMgbm8gaW50ZXJzZWN0aW9uLiBUaGUgcmV0dXJuZWQgYXJjIHdpbGwgaGF2ZSB0aGUgc2FtZSBjZW50ZXIsXG4gICogcmFkaXVzLCBhbmQgb3JpZW50YXRpb24gYXMgYHRoaXNgLlxuICAqXG4gICogYG90aGVyQXJjYCBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLCB3aGlsZSB0aGUgc3RhcnQgYW5kIGVuZCBvZlxuICAqIGB0aGlzYCBhcmUgY29uc2lkZXJlZCBmb3IgdGhlIHJlc3VsdGluZyBgQXJjYC5cbiAgKlxuICAqIFdoZW4gdGhlcmUgZXhpc3QgdHdvIHNlcGFyYXRlIGFyYyBzZWN0aW9ucyB0aGF0IGludGVyc2VjdCB3aXRoXG4gICogYG90aGVyQXJjYDogb25seSB0aGUgc2VjdGlvbiBvZiBgdGhpc2AgY2xvc2VzdCB0byBgc3RhcnRgIGlzIHJldHVybmVkLlxuICAqIFRoaXMgY2FuIGhhcHBlbiB3aGVuIGB0aGlzYCBzdGFydHMgaW5zaWRlIGBvdGhlckFyY2AsIHRoZW4gZXhpdHMsIGFuZFxuICAqIHRoZW4gZW5kcyBpbnNpZGUgYG90aGVyQXJjYCwgcmVnYXJkbGVzcyBpZiBgdGhpc2AgaXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBvciBub3QuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gaW50ZXJzZWN0IHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5BcmN9XG4gICpcbiAgKiBAaWdub3JlXG4gICovXG4gIC8vIGJvdW5kZWRJbnRlcnNlY3Rpb25BcmMob3RoZXJBcmMpIHtcbiAgLy8gICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgLy8gICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAvLyAgIGxldCBjaG9yZFN0YXJ0QW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoY2hvcmQuc3RhcnRQb2ludCgpKTtcbiAgLy8gICBsZXQgY2hvcmRFbmRBbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChjaG9yZC5lbmRQb2ludCgpKTtcblxuICAvLyAgIC8vIGdldCBhbGwgZGlzdGFuY2VzIGZyb20gdGhpcy5zdGFydFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRFbmRBbmdsZSwgb25seSBzdGFydCBtYXkgYmUgaW5zaWRlIGFyY1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgdGhpcy5lbmQsIHdob2xlIGFyYyBpcyBpbnNpZGUgb3Igb3V0c2lkZVxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRTdGFydEFuZ2xlLCBvbmx5IGVuZCBtYXkgYmUgaW5zaWRlIGFyY1xuICAvLyAgIGNvbnN0IGludGVyU3RhcnREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UoY2hvcmRTdGFydEFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIC8vICAgY29uc3QgaW50ZXJFbmREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UoY2hvcmRFbmRBbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyAgIGNvbnN0IGVuZERpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZSh0aGlzLmVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuXG5cbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkU3RhcnRBbmdsZSwgbm9ybWFsIHJ1bGVzXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgbm90IHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZFN0YXJ0LCByZXR1cm4gbnVsbFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIG5vdCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRlbmQsIHJldHVybiBzZWxmXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkU3RhcnQsIG5vcm1hbCBydWxlc1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZGVuZCwgcmV0dXJuIHN0YXJ0IHRvIGNob3JkZW5kXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZEVuZEFuZ2xlLCByZXR1cm4gc3RhcnQgdG8gY2hvcmRFbmRcblxuXG4gIC8vICAgaWYgKCF0aGlzLmNvbnRhaW5zQW5nbGUoY2hvcmRTdGFydEFuZ2xlKSkge1xuICAvLyAgICAgY2hvcmRTdGFydEFuZ2xlID0gdGhpcy5zdGFydDtcbiAgLy8gICB9XG4gIC8vICAgaWYgKCF0aGlzLmNvbnRhaW5zQW5nbGUoY2hvcmRFbmRBbmdsZSkpIHtcbiAgLy8gICAgIGNob3JkRW5kQW5nbGUgPSB0aGlzLmVuZDtcbiAgLy8gICB9XG5cbiAgLy8gICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgLy8gICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgLy8gICAgIGNob3JkU3RhcnRBbmdsZSxcbiAgLy8gICAgIGNob3JkRW5kQW5nbGUsXG4gIC8vICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHRoYXQgaXMgdGFuZ2VudCB0byBib3RoIGB0aGlzYCBhbmQgYG90aGVyQXJjYCxcbiAgKiBvciBgbnVsbGAgd2hlbiBubyB0YW5nZW50IHNlZ21lbnQgaXMgcG9zc2libGUuIFRoZSBuZXcgYFNlZ21lbnRgIHN0YXJ0c1xuICAqIGF0IHRoZSBjb250YWN0IHBvaW50IHdpdGggYHRoaXNgIGFuZCBlbmRzIGF0IHRoZSBjb250YWN0IHBvaW50IHdpdGhcbiAgKiBgb3RoZXJBcmNgLlxuICAqXG4gICogQ29uc2lkZXJpbmcgX2NlbnRlciBheGlzXyBhIHJheSBmcm9tIGB0aGlzLmNlbnRlcmAgdG93YXJkc1xuICAqIGBvdGhlckFyYy5jZW50ZXJgLCBgc3RhcnRDbG9ja3dpc2VgIGRldGVybWluZXMgdGhlIHNpZGUgb2YgdGhlIHN0YXJ0XG4gICogcG9pbnQgb2YgdGhlIHJldHVybmVkIHNlZ21lbnQgaW4gcmVsYXRpb24gdG8gX2NlbnRlciBheGlzXywgYW5kXG4gICogYGVuZENsb2Nrd2lzZWAgdGhlIHNpZGUgb2YgdGhlIGVuZCBwb2ludC5cbiAgKlxuICAqIEJvdGggYHRoaXNgIGFuZCBgb3RoZXJBcmNgIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCBzZWdtZW50IHRvd2FyZHNcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YXJ0Q2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogc3RhcnQgcG9pbnQgaW4gcmVsYXRpb24gdG8gdGhlIF9jZW50ZXIgYXhpc19cbiAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuZENsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIGVuZCBwb2ludCBpbiByZWxhdGlvbiB0byB0aGUgX2NlbnRlciBheGlzX1xuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIHRhbmdlbnRTZWdtZW50KG90aGVyQXJjLCBzdGFydENsb2Nrd2lzZSA9IHRydWUsIGVuZENsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEh5cG90aGVudXNlIG9mIHRoZSB0cmlhbmdsZSB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgdGFuZ2VudFxuICAgIC8vIG1haW4gYW5nbGUgaXMgYXQgYHRoaXMuY2VudGVyYFxuICAgIGNvbnN0IGh5cFNlZ21lbnQgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChvdGhlckFyYy5jZW50ZXIpO1xuICAgIGNvbnN0IG9wcyA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gb3RoZXJBcmMucmFkaXVzIC0gdGhpcy5yYWRpdXNcbiAgICAgIDogb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXM7XG5cbiAgICAvLyBXaGVuIG9wcyBhbmQgaHlwIGFyZSBjbG9zZSwgc25hcCB0byAxXG4gICAgY29uc3QgYW5nbGVTaW5lID0gdGhpcy5yYWMuZXF1YWxzKE1hdGguYWJzKG9wcyksIGh5cFNlZ21lbnQubGVuZ3RoKVxuICAgICAgPyAob3BzID4gMCA/IDEgOiAtMSlcbiAgICAgIDogb3BzIC8gaHlwU2VnbWVudC5sZW5ndGg7XG4gICAgaWYgKE1hdGguYWJzKGFuZ2xlU2luZSkgPiAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZVJhZGlhbnMgPSBNYXRoLmFzaW4oYW5nbGVTaW5lKTtcbiAgICBjb25zdCBvcHNBbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgYW5nbGVSYWRpYW5zKTtcblxuICAgIGNvbnN0IGFkak9yaWVudGF0aW9uID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgICAgPyBzdGFydENsb2Nrd2lzZVxuICAgICAgOiAhc3RhcnRDbG9ja3dpc2U7XG4gICAgY29uc3Qgc2hpZnRlZE9wc0FuZ2xlID0gaHlwU2VnbWVudC5yYXkuYW5nbGUuc2hpZnQob3BzQW5nbGUsIGFkak9yaWVudGF0aW9uKTtcbiAgICBjb25zdCBzaGlmdGVkQWRqQW5nbGUgPSBzaGlmdGVkT3BzQW5nbGUucGVycGVuZGljdWxhcihhZGpPcmllbnRhdGlvbik7XG5cbiAgICBjb25zdCBzdGFydEFuZ2xlID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgICAgPyBzaGlmdGVkQWRqQW5nbGVcbiAgICAgIDogc2hpZnRlZEFkakFuZ2xlLmludmVyc2UoKVxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUoc3RhcnRBbmdsZSk7XG4gICAgY29uc3QgZW5kID0gb3RoZXJBcmMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBZGpBbmdsZSk7XG4gICAgY29uc3QgZGVmYXVsdEFuZ2xlID0gc3RhcnRBbmdsZS5wZXJwZW5kaWN1bGFyKCFzdGFydENsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHN0YXJ0LnNlZ21lbnRUb1BvaW50KGVuZCwgZGVmYXVsdEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIG5ldyBgQXJjYCBvYmplY3RzIHJlcHJlc2VudGluZyBgdGhpc2BcbiAgKiBkaXZpZGVkIGludG8gYGNvdW50YCBhcmNzLCBhbGwgd2l0aCB0aGUgc2FtZVxuICAqIFthbmdsZSBkaXN0YW5jZV17QGxpbmsgUmFjLkFyYyNhbmdsZURpc3RhbmNlfS5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGFycmF5LiBXaGVuIGBjb3VudGAgaXNcbiAgKiBgMWAgcmV0dXJucyBhbiBhcmMgZXF1aXZhbGVudCB0byBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgLSBOdW1iZXIgb2YgYXJjcyB0byBkaXZpZGUgYHRoaXNgIGludG9cbiAgKiBAcmV0dXJucyB7UmFjLkFyY1tdfVxuICAqL1xuICBkaXZpZGVUb0FyY3MoY291bnQpIHtcbiAgICBpZiAoY291bnQgPD0gMCkgeyByZXR1cm4gW107IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICBjb25zdCBhcmNzID0gW107XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvdW50OyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiBpbmRleCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgZW5kID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIChpbmRleCsxKSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgYXJjID0gbmV3IEFyYyh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLCBzdGFydCwgZW5kLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBhcmNzLnB1c2goYXJjKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJjcztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIG5ldyBgU2VnbWVudGAgb2JqZWN0cyByZXByZXNlbnRpbmcgYHRoaXNgXG4gICogZGl2aWRlZCBpbnRvIGBjb3VudGAgY2hvcmRzLCBhbGwgd2l0aCB0aGUgc2FtZSBsZW5ndGguXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gV2hlbiBgY291bnRgIGlzXG4gICogYDFgIHJldHVybnMgYW4gYXJjIGVxdWl2YWxlbnQgdG9cbiAgKiBgW3RoaXMuY2hvcmRTZWdtZW50KClde0BsaW5rIFJhYy5BcmMjY2hvcmRTZWdtZW50fWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgLSBOdW1iZXIgb2Ygc2VnbWVudHMgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50W119XG4gICovXG4gIGRpdmlkZVRvU2VnbWVudHMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPD0gMCkgeyByZXR1cm4gW107IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICBjb25zdCBzZWdtZW50cyA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3VudDsgaW5kZXggKz0gMSkge1xuICAgICAgY29uc3Qgc3RhcnRBbmdsZSA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiBpbmRleCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgZW5kQW5nbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogKGluZGV4KzEpLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBzdGFydFBvaW50ID0gdGhpcy5wb2ludEF0QW5nbGUoc3RhcnRBbmdsZSk7XG4gICAgICBjb25zdCBlbmRQb2ludCA9IHRoaXMucG9pbnRBdEFuZ2xlKGVuZEFuZ2xlKTtcbiAgICAgIGNvbnN0IHNlZ21lbnQgPSBzdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50KTtcbiAgICAgIHNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb21wb3NpdGVgIHRoYXQgY29udGFpbnMgYEJlemllcmAgb2JqZWN0cyByZXByZXNlbnRpbmdcbiAgKiB0aGUgYXJjIGRpdmlkZWQgaW50byBgY291bnRgIGJlemllcnMgdGhhdCBhcHByb3hpbWF0ZSB0aGUgc2hhcGUgb2YgdGhlXG4gICogYXJjLlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYENvbXBvc2l0ZWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgLSBOdW1iZXIgb2YgYmV6aWVycyB0byBkaXZpZGUgYHRoaXNgIGludG9cbiAgKiBAcmV0dXJucyB7UmFjLkNvbXBvc2l0ZX1cbiAgKlxuICAqIEBzZWUgUmFjLkJlemllclxuICAqL1xuICBkaXZpZGVUb0JlemllcnMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPD0gMCkgeyByZXR1cm4gbmV3IFJhYy5Db21wb3NpdGUodGhpcy5yYWMsIFtdKTsgfVxuXG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHBhcnRUdXJuID0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLyBjb3VudDtcblxuICAgIC8vIGxlbmd0aCBvZiB0YW5nZW50OlxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3MzQ3NDUvaG93LXRvLWNyZWF0ZS1jaXJjbGUtd2l0aC1iJUMzJUE5emllci1jdXJ2ZXNcbiAgICBjb25zdCBwYXJzUGVyVHVybiA9IDEgLyBwYXJ0VHVybjtcbiAgICBjb25zdCB0YW5nZW50ID0gdGhpcy5yYWRpdXMgKiAoNC8zKSAqIE1hdGgudGFuKFJhYy5UQVUvKHBhcnNQZXJUdXJuKjQpKTtcblxuICAgIGNvbnN0IGJlemllcnMgPSBbXTtcbiAgICBjb25zdCBzZWdtZW50cyA9IHRoaXMuZGl2aWRlVG9TZWdtZW50cyhjb3VudCk7XG4gICAgc2VnbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IHN0YXJ0QXJjUmFkaXVzID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbS5zdGFydFBvaW50KCkpO1xuICAgICAgY29uc3QgZW5kQXJjUmFkaXVzID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbS5lbmRQb2ludCgpKTtcblxuICAgICAgbGV0IHN0YXJ0QW5jaG9yID0gc3RhcnRBcmNSYWRpdXNcbiAgICAgICAgLm5leHRTZWdtZW50VG9BbmdsZURpc3RhbmNlKHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgIXRoaXMuY2xvY2t3aXNlLCB0YW5nZW50KVxuICAgICAgICAuZW5kUG9pbnQoKTtcbiAgICAgIGxldCBlbmRBbmNob3IgPSBlbmRBcmNSYWRpdXNcbiAgICAgICAgLm5leHRTZWdtZW50VG9BbmdsZURpc3RhbmNlKHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgdGhpcy5jbG9ja3dpc2UsIHRhbmdlbnQpXG4gICAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgICBjb25zdCBuZXdCZXppZXIgPSBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgc3RhcnRBcmNSYWRpdXMuZW5kUG9pbnQoKSwgc3RhcnRBbmNob3IsXG4gICAgICAgIGVuZEFuY2hvciwgZW5kQXJjUmFkaXVzLmVuZFBvaW50KCkpXG5cbiAgICAgIGJlemllcnMucHVzaChuZXdCZXppZXIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjLCBiZXppZXJzKTtcbiAgfVxuXG59IC8vIGNsYXNzIEFyY1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXJjO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQmV6aWVyIGN1cnZlIHdpdGggc3RhcnQsIGVuZCwgYW5kIHR3byBhbmNob3IgW3BvaW50c117QGxpbmsgUmFjLlBvaW50fS5cbiogQGFsaWFzIFJhYy5CZXppZXJcbiovXG5jbGFzcyBCZXppZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcblxuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLnN0YXJ0QW5jaG9yID0gc3RhcnRBbmNob3I7XG4gICAgdGhpcy5lbmRBbmNob3IgPSBlbmRBbmNob3I7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3Qgc3RhcnRYU3RyICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueCwgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydFlTdHIgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC55LCAgICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yWFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0QW5jaG9yLngsIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRBbmNob3JZU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnRBbmNob3IueSwgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRBbmNob3JYU3RyICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmRBbmNob3IueCwgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZEFuY2hvcllTdHIgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZEFuY2hvci55LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kWFN0ciAgICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLngsICAgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRZU3RyICAgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmQueSwgICAgICAgICBkaWdpdHMpO1xuXG4gICAgcmV0dXJuIGBCZXppZXIoczooJHtzdGFydFhTdHJ9LCR7c3RhcnRZU3RyfSkgc2E6KCR7c3RhcnRBbmNob3JYU3RyfSwke3N0YXJ0QW5jaG9yWVN0cn0pIGVhOigke2VuZEFuY2hvclhTdHJ9LCR7ZW5kQW5jaG9yWVN0cn0pIGU6KCR7ZW5kWFN0cn0sJHtlbmRZU3RyfSkpYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBhbGwgbWVtYmVycyBvZiBib3RoIGJlemllcnMgYXJlXG4gICogW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LlxuICAqXG4gICogV2hlbiBgb3RoZXJCZXppZXJgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuQmV6aWVyYCwgcmV0dXJuc1xuICAqIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5CZXppZXJ9IG90aGVyQmV6aWVyIC0gQSBgQmV6aWVyYCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyQmV6aWVyKSB7XG4gICAgcmV0dXJuIG90aGVyQmV6aWVyIGluc3RhbmNlb2YgQmV6aWVyXG4gICAgICAmJiB0aGlzLnN0YXJ0ICAgICAgLmVxdWFscyhvdGhlckJlemllci5zdGFydClcbiAgICAgICYmIHRoaXMuc3RhcnRBbmNob3IuZXF1YWxzKG90aGVyQmV6aWVyLnN0YXJ0QW5jaG9yKVxuICAgICAgJiYgdGhpcy5lbmRBbmNob3IgIC5lcXVhbHMob3RoZXJCZXppZXIuZW5kQW5jaG9yKVxuICAgICAgJiYgdGhpcy5lbmQgICAgICAgIC5lcXVhbHMob3RoZXJCZXppZXIuZW5kKTtcbiAgfVxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCZXppZXI7XG5cblxuQmV6aWVyLnByb3RvdHlwZS5kcmF3QW5jaG9ycyA9IGZ1bmN0aW9uKHN0eWxlID0gdW5kZWZpbmVkKSB7XG4gIHB1c2goKTtcbiAgaWYgKHN0eWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdHlsZS5hcHBseSgpO1xuICB9XG4gIHRoaXMuc3RhcnQuc2VnbWVudFRvUG9pbnQodGhpcy5zdGFydEFuY2hvcikuZHJhdygpO1xuICB0aGlzLmVuZC5zZWdtZW50VG9Qb2ludCh0aGlzLmVuZEFuY2hvcikuZHJhdygpO1xuICBwb3AoKTtcbn07XG5cbkJlemllci5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IEJlemllcih0aGlzLnJhYyxcbiAgICB0aGlzLmVuZCwgdGhpcy5lbmRBbmNob3IsXG4gICAgdGhpcy5zdGFydEFuY2hvciwgdGhpcy5zdGFydCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udGFpbmVyIG9mIGEgc2VxdWVuY2Ugb2YgZHJhd2FibGUgb2JqZWN0cyB0aGF0IGNhbiBiZSBkcmF3biB0b2dldGhlci5cbipcbiogVXNlZCBieSBgW1A1RHJhd2VyXXtAbGluayBSYWMuUDVEcmF3ZXJ9YCB0byBwZXJmb3JtIHNwZWNpZmljIHZlcnRleFxuKiBvcGVyYXRpb25zIHdpdGggZHJhd2FibGVzIHRvIGRyYXcgY29tcGxleCBzaGFwZXMuXG4qXG4qIEBjbGFzc1xuKiBAYWxpYXMgUmFjLkNvbXBvc2l0ZVxuKi9cbmZ1bmN0aW9uIENvbXBvc2l0ZShyYWMsIHNlcXVlbmNlID0gW10pIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc2VxdWVuY2UpO1xuXG4gIHRoaXMucmFjID0gcmFjO1xuICB0aGlzLnNlcXVlbmNlID0gc2VxdWVuY2U7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRlO1xuXG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuaXNOb3RFbXB0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zZXF1ZW5jZS5sZW5ndGggIT0gMDtcbn07XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgZWxlbWVudC5mb3JFYWNoKGl0ZW0gPT4gdGhpcy5zZXF1ZW5jZS5wdXNoKGl0ZW0pKTtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLnNlcXVlbmNlLnB1c2goZWxlbWVudCk7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHJldmVyc2VkID0gdGhpcy5zZXF1ZW5jZS5tYXAoaXRlbSA9PiBpdGVtLnJldmVyc2UoKSlcbiAgICAucmV2ZXJzZSgpO1xuICByZXR1cm4gbmV3IENvbXBvc2l0ZSh0aGlzLnJhYywgcmV2ZXJzZWQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFBvaW50IGluIGEgdHdvIGRpbWVudGlvbmFsIGNvb3JkaW5hdGUgc3lzdGVtLlxuKlxuKiBTZXZlcmFsIG1ldGhvZHMgd2lsbCByZXR1cm4gYW4gYWRqdXN0ZWQgdmFsdWUgb3IgcGVyZm9ybSBhZGp1c3RtZW50cyBpblxuKiB0aGVpciBvcGVyYXRpb24gd2hlbiB0d28gcG9pbnRzIGFyZSBjbG9zZSBlbm91Z2ggYXMgdG8gYmUgY29uc2lkZXJlZFxuKiBlcXVhbC4gV2hlbiB0aGUgdGhlIGRpZmZlcmVuY2Ugb2YgZWFjaCBjb29yZGluYXRlIG9mIHR3byBwb2ludHNcbiogaXMgdW5kZXIgdGhlIGBbZXF1YWxpdHlUaHJlc2hvbGRde0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH1gIHRoZVxuKiBwb2ludHMgYXJlIGNvbnNpZGVyZWQgZXF1YWwuIFRoZSBgW2VxdWFsc117QGxpbmsgUmFjLlBvaW50I2VxdWFsc31gXG4qIG1ldGhvZCBwZXJmb3JtcyB0aGlzIGNoZWNrLlxuKlxuKiBAYWxpYXMgUmFjLlBvaW50XG4qL1xuY2xhc3MgUG9pbnR7XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBQb2ludGAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZVxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHgsIHkpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCB4LCB5KTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIoeCwgeSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnggPSB4O1xuXG4gICAgLyoqXG4gICAgKiBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnksIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBQb2ludCgke3hTdHJ9LCR7eVN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgZGlmZmVyZW5jZSB3aXRoIGBvdGhlclBvaW50YCBmb3IgZWFjaCBjb29yZGluYXRlIGlzXG4gICogdW5kZXIgYHtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9YCwgb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyUG9pbnRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuUG9pbnRgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBWYWx1ZXMgYXJlIGNvbXBhcmVkIHVzaW5nIGB7QGxpbmsgUmFjI2VxdWFsc31gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG90aGVyUG9pbnQgLSBBIGBQb2ludGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqIEBzZWUgUmFjI2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJQb2ludCkge1xuICAgIHJldHVybiBvdGhlclBvaW50IGluc3RhbmNlb2YgUG9pbnRcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLngsIG90aGVyUG9pbnQueClcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnksIG90aGVyUG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBzZXQgdG8gYG5ld1hgLlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdYIC0gVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgd2l0aFgobmV3WCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIG5ld1gsIHRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBzZXQgdG8gYG5ld1hgLlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdZIC0gVGhlIHkgY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueCwgbmV3WSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBhZGRlZCB0byBgdGhpcy54YC5cbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkWCh4KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHgsIHRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB5YCBhZGRlZCB0byBgdGhpcy55YC5cbiAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkWSh5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCwgdGhpcy55ICsgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBhZGRpbmcgdGhlIGNvbXBvbmVudHMgb2YgYHBvaW50YCB0byBgdGhpc2AuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFBvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgcG9pbnQueCxcbiAgICAgIHRoaXMueSArIHBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzIHRvIGB0aGlzYC5cbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGQoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyB4LCB0aGlzLnkgKyB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IHN1YnRyYWN0aW5nIHRoZSBjb21wb25lbnRzIG9mIGBwb2ludGAuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3VidHJhY3RQb2ludChwb2ludCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHBvaW50LngsXG4gICAgICB0aGlzLnkgLSBwb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IHN1YnRyYWN0aW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzLlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vZGluYXRlIHRvIHN1YnRyYWN0XG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29kaW5hdGUgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdWJ0cmFjdCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54IC0geCxcbiAgICAgIHRoaXMueSAtIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCB0aGUgbmVnYXRpdmUgY29vcmRpbmF0ZSB2YWx1ZXMgb2YgYHRoaXNgLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIG5lZ2F0aXZlKCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIC10aGlzLngsIC10aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzYCB0byBgcG9pbnRgLCBvciByZXR1cm5zIGAwYCB3aGVuXG4gICogYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBkaXN0YW5jZVRvUG9pbnQocG9pbnQpIHtcbiAgICBpZiAodGhpcy5lcXVhbHMocG9pbnQpKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgY29uc3QgeCA9IE1hdGgucG93KChwb2ludC54IC0gdGhpcy54KSwgMik7XG4gICAgY29uc3QgeSA9IE1hdGgucG93KChwb2ludC55IC0gdGhpcy55KSwgMik7XG4gICAgcmV0dXJuIE1hdGguc3FydCh4K3kpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhbmdsZSBmcm9tIGB0aGlzYCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCByZXR1cm5zIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoXG4gICogYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gbWVhc3VyZSB0aGUgYW5nbGUgdG9cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtkZWZhdWx0QW5nbGU9aW5zdGFuY2UuQW5nbGUuWmVyb10gLVxuICAqIEFuIGBBbmdsZWAgdG8gcmV0dXJuIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGlmICh0aGlzLmVxdWFscyhwb2ludCkpIHtcbiAgICAgIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oZGVmYXVsdEFuZ2xlKTtcbiAgICAgIHJldHVybiBkZWZhdWx0QW5nbGU7XG4gICAgfVxuICAgIGNvbnN0IG9mZnNldCA9IHBvaW50LnN1YnRyYWN0UG9pbnQodGhpcyk7XG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYXRhbjIob2Zmc2V0LnksIG9mZnNldC54KTtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCByYWRpYW5zKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IGEgYGRpc3RhbmNlYCBmcm9tIGB0aGlzYCBpbiB0aGUgZGlyZWN0aW9uIG9mXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvd2FycyB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgZGlzdGFuY2VYID0gZGlzdGFuY2UgKiBNYXRoLmNvcyhhbmdsZS5yYWRpYW5zKCkpO1xuICAgIGNvbnN0IGRpc3RhbmNlWSA9IGRpc3RhbmNlICogTWF0aC5zaW4oYW5nbGUucmFkaWFucygpKTtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLnggKyBkaXN0YW5jZVgsIHRoaXMueSArIGRpc3RhbmNlWSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG93YXJkcyBgYW5nbGVgLlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYEFuZ2xlYCBvZiB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheShhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBhbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG93YXJkcyBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWQgZXF1YWwsIHRoZSBuZXcgYFJheWAgd2lsbCB1c2VcbiAgKiB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFJheWAgdG93YXJkc1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gW2RlZmF1bHRBbmdsZT1pbnN0YW5jZS5BbmdsZS5aZXJvXSAtXG4gICogQW4gYEFuZ2xlYCB0byB1c2Ugd2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGVxdWFsXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLmFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGRlZmF1bHRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG8gdGhlIHByb2plY3Rpb24gb2YgYHRoaXNgIGluIGByYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcHJvamVjdGVkIHBvaW50IGlzIGVxdWFsIHRvIGB0aGlzYCB0aGUgcHJvZHVjZWQgcmF5IHdpbGwgaGF2ZVxuICAqIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG8gYHJheWAgaW4gdGhlIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gcHJvamVjdCBgdGhpc2Agb250b1xuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXlUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0aW9uKHRoaXMpO1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiB0aGlzLnJheVRvUG9pbnQocHJvamVjdGVkLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRoYXQgc3RhcnRzIGF0IGB0aGlzYCBhbmQgaXMgdGFuZ2VudCB0byBgYXJjYCwgd2hlblxuICAqIG5vIHRhbmdlbnQgaXMgcG9zc2libGUgcmV0dXJucyBgbnVsbGAuXG4gICpcbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBUaGUgbmV3IGBSYXlgIHdpbGwgYmUgaW4gdGhlIGBjbG9ja3dpc2VgIHNpZGUgb2YgdGhlIHJheSBmb3JtZWRcbiAgKiBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhcmMuY2VudGVyYC4gYGFyY2AgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlXG4gICogY2lyY2xlLlxuICAqXG4gICogV2hlbiBgdGhpc2AgaXMgaW5zaWRlIGBhcmNgIG5vIHRhbmdlbnQgc2VnbWVudCBpcyBwb3NzaWJsZSBhbmQgYG51bGxgXG4gICogaXMgcmV0dXJuZWQuXG4gICpcbiAgKiBBIHNwZWNpYWwgY2FzZSBpcyBjb25zaWRlcmVkIHdoZW4gYGFyYy5yYWRpdXNgIGlzIGNvbnNpZGVyZWQgdG8gYmUgYDBgXG4gICogYW5kIGB0aGlzYCBpcyBlcXVhbCB0byBgYXJjLmNlbnRlcmAuIEluIHRoaXMgY2FzZSB0aGUgYW5nbGUgYmV0d2VlblxuICAqIGB0aGlzYCBhbmQgYGFyYy5jZW50ZXJgIGlzIGFzc3VtZWQgdG8gYmUgdGhlIGludmVyc2Ugb2YgYGFyYy5zdGFydGAsXG4gICogdGh1cyB0aGUgbmV3IGBSYXlgIHdpbGwgaGF2ZSBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvXG4gICogYGFyYy5zdGFydC5pbnZlcnNlKClgLCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IGFyYyAtIEFuIGBBcmNgIHRvIGNhbGN1bGF0ZSBhIHRhbmdlbnQgdG8sIGNvbnNpZGVyZWRcbiAgKiBhcyBhIGNvbXBsZXRlIGNpcmNsZVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybiB7UmFjLlJheT99XG4gICovXG4gIHJheVRhbmdlbnRUb0FyYyhhcmMsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICAvLyBBIGRlZmF1bHQgYW5nbGUgaXMgZ2l2ZW4gZm9yIHRoZSBlZGdlIGNhc2Ugb2YgYSB6ZXJvLXJhZGl1cyBhcmNcbiAgICBsZXQgaHlwb3RlbnVzZSA9IHRoaXMuc2VnbWVudFRvUG9pbnQoYXJjLmNlbnRlciwgYXJjLnN0YXJ0LmludmVyc2UoKSk7XG4gICAgbGV0IG9wcyA9IGFyYy5yYWRpdXM7XG5cbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKGh5cG90ZW51c2UubGVuZ3RoLCBhcmMucmFkaXVzKSkge1xuICAgICAgLy8gUG9pbnQgaW4gYXJjXG4gICAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gaHlwb3RlbnVzZS5yYXkuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBwZXJwZW5kaWN1bGFyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKGh5cG90ZW51c2UubGVuZ3RoLCAwKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGFuZ2xlU2luZSA9IG9wcyAvIGh5cG90ZW51c2UubGVuZ3RoO1xuICAgIGlmIChhbmdsZVNpbmUgPiAxKSB7XG4gICAgICAvLyBQb2ludCBpbnNpZGUgYXJjXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgYW5nbGVSYWRpYW5zID0gTWF0aC5hc2luKGFuZ2xlU2luZSk7XG4gICAgbGV0IG9wc0FuZ2xlID0gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCBhbmdsZVJhZGlhbnMpO1xuICAgIGxldCBzaGlmdGVkT3BzQW5nbGUgPSBoeXBvdGVudXNlLmFuZ2xlKCkuc2hpZnQob3BzQW5nbGUsIGNsb2Nrd2lzZSk7XG5cbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIHNoaWZ0ZWRPcHNBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFuZ2xlYCB3aXRoIHRoZSBnaXZlblxuICAqIGBsZW5ndGhgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gcG9pbnQgdGhlIHNlZ21lbnRcbiAgKiB0b3dhcmRzXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGgpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgcmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzYCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWQgW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZSB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFNlZ21lbnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtkZWZhdWx0QW5nbGU9aW5zdGFuY2UuQW5nbGUuWmVyb10gLVxuICAqIEFuIGBBbmdsZWAgdG8gdXNlIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLmFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlKTtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGRlZmF1bHRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgcmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzYCB0byB0aGUgcHJvamVjdGlvbiBvZiBgdGhpc2AgaW5cbiAgKiBgcmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHByb2plY3RlZCBwb2ludCBpcyBlcXVhbCB0byBgdGhpc2AsIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGxcbiAgKiBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG8gYHJheWAgaW4gdGhlIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gcHJvamVjdCBgdGhpc2Agb250b1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KHJheSkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHJheS5wb2ludFByb2plY3Rpb24odGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VnbWVudFRvUG9pbnQocHJvamVjdGVkLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IHN0YXJ0cyBhdCBgdGhpc2AgYW5kIGlzIHRhbmdlbnQgdG8gYGFyY2AsXG4gICogd2hlbiBubyB0YW5nZW50IGlzIHBvc3NpYmxlIHJldHVybnMgYG51bGxgLlxuICAqXG4gICogQGRlc2NyaXB0aW9uXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBiZSBpbiB0aGUgYGNsb2Nrd2lzZWAgc2lkZSBvZiB0aGUgcmF5IGZvcm1lZFxuICAqIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFyYy5jZW50ZXJgLCBhbmQgaXRzIGVuZCBwb2ludCB3aWxsIGJlIGF0IHRoZVxuICAqIGNvbnRhY3QgcG9pbnQgd2l0aCBgYXJjYCB3aGljaCBpcyBjb25zaWRlcmVkIGFzIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogV2hlbiBgdGhpc2AgaXMgaW5zaWRlIGBhcmNgIG5vIHRhbmdlbnQgc2VnbWVudCBpcyBwb3NzaWJsZSBhbmQgYG51bGxgXG4gICogaXMgcmV0dXJuZWQuXG4gICpcbiAgKiBBIHNwZWNpYWwgY2FzZSBpcyBjb25zaWRlcmVkIHdoZW4gYGFyYy5yYWRpdXNgIGlzIGNvbnNpZGVyZWQgdG8gYmUgYDBgXG4gICogYW5kIGB0aGlzYCBpcyBlcXVhbCB0byBgYXJjLmNlbnRlcmAuIEluIHRoaXMgY2FzZSB0aGUgYW5nbGUgYmV0d2VlblxuICAqIGB0aGlzYCBhbmQgYGFyYy5jZW50ZXJgIGlzIGFzc3VtZWQgdG8gYmUgdGhlIGludmVyc2Ugb2YgYGFyYy5zdGFydGAsXG4gICogdGh1cyB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgYW4gYW5nbGUgcGVycGVuZGljdWxhciB0b1xuICAqIGBhcmMuc3RhcnQuaW52ZXJzZSgpYCwgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBhcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHRvLCBjb25zaWRlcmVkXG4gICogYXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJuIHtSYWMuU2VnbWVudD99XG4gICovXG4gIHNlZ21lbnRUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgdGFuZ2VudFJheSA9IHRoaXMucmF5VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlKTtcbiAgICBpZiAodGFuZ2VudFJheSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdGFuZ2VudFBlcnAgPSB0YW5nZW50UmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICBjb25zdCByYWRpdXNSYXkgPSBhcmMuY2VudGVyLnJheSh0YW5nZW50UGVycCk7XG5cbiAgICByZXR1cm4gdGFuZ2VudFJheS5zZWdtZW50VG9JbnRlcnNlY3Rpb24ocmFkaXVzUmF5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBhdCBgdGhpc2AgYW5kIHRoZSBnaXZlbiBhcmMgcHJvcGVydGllcy5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtzb21lU3RhcnQ9cmFjLkFuZ2xlLnplcm9dIC0gVGhlIHN0YXJ0XG4gICogYEFuZ2xlYCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfG51bWJlcn0gW3NvbWVFbmQ9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqIGBBcmNgOyB3aGVuIGBudWxsYCBvciBvbW1pdGVkLCBgc3RhcnRgIGlzIHVzZWQgaW5zdGVhZFxuICAqIEBwYXJhbSB7Ym9vbGVhbj19IGNsb2Nrd2lzZT10cnVlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKFxuICAgIHJhZGl1cyxcbiAgICBzdGFydCA9IHRoaXMucmFjLkFuZ2xlLnplcm8sXG4gICAgZW5kID0gbnVsbCxcbiAgICBjbG9ja3dpc2UgPSB0cnVlKVxuICB7XG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHN0YXJ0KTtcbiAgICBlbmQgPSBlbmQgPT09IG51bGxcbiAgICAgID8gc3RhcnRcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYywgdGhpcywgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmQgYGZvcm1hdGAuXG4gICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIFRoZSBzdHJpbmcgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcGFyYW0ge1JhYy5UZXh0LkZvcm1hdH0gZm9ybWF0IC0gVGhlIGZvcm1hdCBvZiB0aGUgbmV3IGBUZXh0YFxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgdGV4dChzdHJpbmcsIGZvcm1hdCkge1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcy5yYWMsIHRoaXMsIHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG59IC8vIGNsYXNzIFBvaW50XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFVuYm91bmRlZCByYXkgZnJvbSBhIGBbUG9pbnRde0BsaW5rIFJhYy5Qb2ludH1gIGluIGRpcmVjdGlvbiBvZiBhblxuKiBgW0FuZ2xlXXtAbGluayBSYWMuQW5nbGV9YC5cbipcbiogQGFsaWFzIFJhYy5SYXlcbiovXG5jbGFzcyBSYXkge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFJheWAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnQgLSBBIGBQb2ludGAgd2hlcmUgdGhlIHJheSBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRoZSByYXkgaXMgZGlyZWN0ZWQgdG9cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgYW5nbGUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgYW5nbGUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgcG9pbnQgb2YgdGhlIHJheS5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSByYXkgZXh0ZW5kcy5cbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmFuZ2xlLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBSYXkoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHN0YXJ0YCBhbmQgYGFuZ2xlYCBpbiBib3RoIHJheXMgYXJlIGVxdWFsLlxuICAqXG4gICogV2hlbiBgb3RoZXJSYXlgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuUmF5YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBvdGhlclJheSAtIEEgYFJheWAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJSYXkpIHtcbiAgICByZXR1cm4gb3RoZXJSYXkgaW5zdGFuY2VvZiBSYXlcbiAgICAgICYmIHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyUmF5LnN0YXJ0KVxuICAgICAgJiYgdGhpcy5hbmdsZS5lcXVhbHMob3RoZXJSYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBzbG9wZSBvZiB0aGUgcmF5LCBvciBgbnVsbGAgaWYgdGhlIHJheSBpcyB2ZXJ0aWNhbC5cbiAgKlxuICAqIEluIHRoZSBsaW5lIGZvcm11bGEgYHkgPSBteCArIGJgIHRoZSBzbG9wZSBpcyBgbWAuXG4gICpcbiAgKiBAcmV0dXJucyB7P251bWJlcn1cbiAgKi9cbiAgc2xvcGUoKSB7XG4gICAgbGV0IGlzVmVydGljYWwgPVxuICAgICAgICAgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmFuZ2xlLnR1cm4sIHRoaXMucmFjLkFuZ2xlLmRvd24udHVybilcbiAgICAgIHx8IHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5hbmdsZS50dXJuLCB0aGlzLnJhYy5BbmdsZS51cC50dXJuKTtcbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgudGFuKHRoaXMuYW5nbGUucmFkaWFucygpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgeS1pbnRlcmNlcHQ6IHRoZSBwb2ludCBhdCB3aGljaCB0aGUgcmF5LCBleHRlbmRlZCBpbiBib3RoXG4gICogZGlyZWN0aW9ucywgaW50ZXJjZXB0cyB3aXRoIHRoZSB5LWF4aXM7IG9yIGBudWxsYCBpZiB0aGUgcmF5IGlzXG4gICogdmVydGljYWwuXG4gICpcbiAgKiBJbiB0aGUgbGluZSBmb3JtdWxhIGB5ID0gbXggKyBiYCB0aGUgeS1pbnRlcmNlcHQgaXMgYGJgLlxuICAqXG4gICogQHJldHVybnMgez9udW1iZXJ9XG4gICovXG4gIHlJbnRlcmNlcHQoKSB7XG4gICAgbGV0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIHkgPSBteCArIGJcbiAgICAvLyB5IC0gbXggPSBiXG4gICAgcmV0dXJuIHRoaXMuc3RhcnQueSAtIHNsb3BlICogdGhpcy5zdGFydC54O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBzZXQgdG8gYG5ld1N0YXJ0YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnQgLSBUaGUgc3RhcnQgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFN0YXJ0KG5ld1N0YXJ0KSB7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydC54YCBzZXQgdG8gYG5ld1hgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdYIC0gVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoWChuZXdYKSB7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQud2l0aFgobmV3WCksIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0LnlgIHNldCB0byBgbmV3WWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld1kgLSBUaGUgeSBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhZKG5ld1kpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydC53aXRoWShuZXdZKSwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIHNldCB0byBgbmV3QW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlKG5ld0FuZ2xlKSB7XG4gICAgbmV3QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYGFuZ2xlYCBhZGRlZCB0byBgdGhpcy5hbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlQWRkKGFuZ2xlKSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5hbmdsZS5hZGQoYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIHNldCB0b1xuICAqIGB0aGlzLntAbGluayBSYWMuQW5nbGUjc2hpZnQgYW5nbGUuc2hpZnR9KGFuZ2xlLCBjbG9ja3dpc2UpYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGJlIHNoaWZ0ZWQgYnlcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5hbmdsZS5zaGlmdChhbmdsZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHBvaW50aW5nIHRvd2FyZHNcbiAgKiBge0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlIGFuZ2xlLmludmVyc2UoKX1gLlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICBpbnZlcnNlKCkge1xuICAgIGNvbnN0IGludmVyc2VBbmdsZSA9IHRoaXMuYW5nbGUuaW52ZXJzZSgpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBpbnZlcnNlQW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHBvaW50aW5nIHRvd2FyZHMgdGhlXG4gICogW3BlcnBlbmRpY3VsYXIgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfSBvZlxuICAqIGBhbmdsZWAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydGAgbW92ZWQgYWxvbmcgdGhlIHJheSBieSB0aGUgZ2l2ZW5cbiAgKiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgZGlzdGFuY2VgIGlzIG5lZ2F0aXZlLCBgc3RhcnRgIGlzIG1vdmVkIGluXG4gICogdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVRvRGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuc3RhcnQucG9pbnRUb0FuZ2xlKHRoaXMuYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCB0b3dhcmRzIGBhbmdsZWAgYnkgdGhlIGdpdmVuXG4gICogYGRpc3RhbmNlYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1vdmUgYHN0YXJ0YCB0b3dhcmRzXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgYHN0YXJ0YCBieVxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB0cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCBieSB0aGUgZ2l2ZW4gZGlzdGFuY2UgdG93YXJkIHRoZVxuICAqIGBhbmdsZS5wZXJwZW5kaWN1bGFyKClgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgYHN0YXJ0YCBieVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB0cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVUb0FuZ2xlKHBlcnBlbmRpY3VsYXIsIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYW5nbGUgZnJvbSBgdGhpcy5zdGFydGAgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuc3RhcnRgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgcmV0dXJucyBgdGhpcy5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gbWVhc3VyZSB0aGUgYW5nbGUgdG9cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBhbmdsZVRvUG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgcmF5IHdoZXJlIHRoZSB4IGNvb3JkaW5hdGUgaXMgYHhgLlxuICAqIFdoZW4gdGhlIHJheSBpcyB2ZXJ0aWNhbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gc2luZ2xlIHBvaW50IHdpdGggeFxuICAqIGNvb3JkaW5hdGUgYXQgYHhgIGlzIHBvc3NpYmxlLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGEgdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgdG8gY2FsY3VsYXRlIGEgcG9pbnQgaW4gdGhlIHJheVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRYKHgpIHtcbiAgICBjb25zdCBzbG9wZSA9IHRoaXMuc2xvcGUoKTtcbiAgICBpZiAoc2xvcGUgPT09IG51bGwpIHtcbiAgICAgIC8vIFZlcnRpY2FsIHJheVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoc2xvcGUsIDApKSB7XG4gICAgICAvLyBIb3Jpem9udGFsIHJheVxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQud2l0aFgoeCk7XG4gICAgfVxuXG4gICAgLy8geSA9IG14ICsgYlxuICAgIGNvbnN0IHkgPSBzbG9wZSAqIHggKyB0aGlzLnlJbnRlcmNlcHQoKTtcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLnJhYywgeCwgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSByYXkgd2hlcmUgdGhlIHkgY29vcmRpbmF0ZSBpcyBgeWAuXG4gICogV2hlbiB0aGUgcmF5IGlzIGhvcml6b250YWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIHNpbmdsZSBwb2ludCB3aXRoIHlcbiAgKiBjb29yZGluYXRlIGF0IGB5YCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhbiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSB0byBjYWxjdWxhdGUgYSBwb2ludCBpbiB0aGUgcmF5XG4gICogQHJldHVyc24ge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdFkoeSkge1xuICAgIGNvbnN0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVmVydGljYWwgcmF5XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC53aXRoWSh5KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhzbG9wZSwgMCkpIHtcbiAgICAgIC8vIEhvcml6b250YWwgcmF5XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBteCArIGIgPSB5XG4gICAgLy8geCA9ICh5IC0gYikvbVxuICAgIGNvbnN0IHggPSAoeSAtIHRoaXMueUludGVyY2VwdCgpKSAvIHNsb3BlO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGluIHRoZSByYXkgYXQgdGhlIGdpdmVuIGBkaXN0YW5jZWAgZnJvbVxuICAqIGB0aGlzLnN0YXJ0YC4gV2hlbiBgZGlzdGFuY2VgIGlzIG5lZ2F0aXZlLCB0aGUgbmV3IGBQb2ludGAgaXMgY2FsY3VsYXRlZFxuICAqIGluIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZiBgYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIGZyb20gYHRoaXMuc3RhcnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdERpc3RhbmNlKGRpc3RhbmNlKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQucG9pbnRUb0FuZ2xlKHRoaXMuYW5nbGUsIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBpbnRlcnNlY3Rpb24gb2YgYHRoaXNgIGFuZCBgb3RoZXJSYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcmF5cyBhcmUgcGFyYWxsZWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIGludGVyc2VjdGlvbiBpc1xuICAqIHBvc3NpYmxlLlxuICAqXG4gICogQm90aCByYXlzIGFyZSBjb25zaWRlcmVkIHVuYm91bmRlZCBsaW5lcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0SW50ZXJzZWN0aW9uKG90aGVyUmF5KSB7XG4gICAgY29uc3QgYSA9IHRoaXMuc2xvcGUoKTtcbiAgICBjb25zdCBiID0gb3RoZXJSYXkuc2xvcGUoKTtcbiAgICAvLyBQYXJhbGxlbCBsaW5lcywgbm8gaW50ZXJzZWN0aW9uXG4gICAgaWYgKGEgPT09IG51bGwgJiYgYiA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKGEsIGIpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAvLyBBbnkgdmVydGljYWwgcmF5XG4gICAgaWYgKGEgPT09IG51bGwpIHsgcmV0dXJuIG90aGVyUmF5LnBvaW50QXRYKHRoaXMuc3RhcnQueCk7IH1cbiAgICBpZiAoYiA9PT0gbnVsbCkgeyByZXR1cm4gdGhpcy5wb2ludEF0WChvdGhlclJheS5zdGFydC54KTsgfVxuXG4gICAgY29uc3QgYyA9IHRoaXMueUludGVyY2VwdCgpO1xuICAgIGNvbnN0IGQgPSBvdGhlclJheS55SW50ZXJjZXB0KCk7XG5cbiAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaW5lJUUyJTgwJTkzbGluZV9pbnRlcnNlY3Rpb25cbiAgICBjb25zdCB4ID0gKGQgLSBjKSAvIChhIC0gYik7XG4gICAgY29uc3QgeSA9IGEgKiB4ICsgYztcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLnJhYywgeCwgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgIG9udG8gdGhlIHJheS4gVGhlXG4gICogcHJvamVjdGVkIHBvaW50IGlzIHRoZSBjbG9zZXN0IHBvc3NpYmxlIHBvaW50IHRvIGBwb2ludGAuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYW4gdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcHJvamVjdCBvbnRvIHRoZSByYXlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludFByb2plY3Rpb24ocG9pbnQpIHtcbiAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHBvaW50LnJheShwZXJwZW5kaWN1bGFyKVxuICAgICAgLnBvaW50QXRJbnRlcnNlY3Rpb24odGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gYHRoaXMuc3RhcnRgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGBcbiAgKiBvbnRvIHRoZSByYXkuXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgZGlzdGFuY2UgaXMgcG9zaXRpdmUgd2hlbiB0aGUgcHJvamVjdGVkIHBvaW50IGlzIHRvd2FyZHNcbiAgKiB0aGUgZGlyZWN0aW9uIG9mIHRoZSByYXksIGFuZCBuZWdhdGl2ZSB3aGVuIGl0IGlzIGJlaGluZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwcm9qZWN0IGFuZCBtZWFzdXJlIHRoZVxuICAqIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgZGlzdGFuY2VUb1Byb2plY3RlZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgcHJvamVjdGVkID0gdGhpcy5wb2ludFByb2plY3Rpb24ocG9pbnQpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZVRvUG9pbnQocHJvamVjdGVkKTtcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoZGlzdGFuY2UsIDApKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZVRvUHJvamVjdGVkID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocHJvamVjdGVkKTtcbiAgICBjb25zdCBhbmdsZURpZmYgPSB0aGlzLmFuZ2xlLnN1YnRyYWN0KGFuZ2xlVG9Qcm9qZWN0ZWQpO1xuICAgIGlmIChhbmdsZURpZmYudHVybiA8PSAxLzQgfHwgYW5nbGVEaWZmLnR1cm4gPiAzLzQpIHtcbiAgICAgIHJldHVybiBkaXN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC1kaXN0YW5jZTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGFuZ2xlIHRvIHRoZSBnaXZlbiBgcG9pbnRgIGlzIGxvY2F0ZWQgY2xvY2t3aXNlXG4gICogb2YgdGhlIHJheSBvciBgZmFsc2VgIHdoZW4gbG9jYXRlZCBjb3VudGVyLWNsb2Nrd2lzZS5cbiAgKlxuICAqICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IG9yIGBwb2ludGAgbGFuZHMgb24gdGhlIHJheSwgaXQgaXNcbiAgKiBjb25zaWRlcmVkIGNsb2Nrd2lzZS4gV2hlbiBgcG9pbnRgIGxhbmRzIG9uIHRoZVxuICAqIFtpbnZlcnNlXXtAbGluayBSYWMuUmF5I2ludmVyc2V9IG9mIHRoZSByYXksIGl0IGlzIGNvbnNpZGVyZWRcbiAgKiBjb3VudGVyLWNsb2Nrd2lzZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBvcmllbnRhdGlvbiB0b1xuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuUmF5I2ludmVyc2VcbiAgKi9cbiAgcG9pbnRPcmllbnRhdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBvaW50QW5nbGUgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gICAgaWYgKHRoaXMuYW5nbGUuZXF1YWxzKHBvaW50QW5nbGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gcG9pbnRBbmdsZS5zdWJ0cmFjdCh0aGlzLmFuZ2xlKTtcbiAgICAvLyBbMCB0byAwLjUpIGlzIGNvbnNpZGVyZWQgY2xvY2t3aXNlXG4gICAgLy8gWzAuNSwgMSkgaXMgY29uc2lkZXJlZCBjb3VudGVyLWNsb2Nrd2lzZVxuICAgIHJldHVybiBhbmdsZURpc3RhbmNlLnR1cm4gPCAwLjU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpcy5zdGFydGAgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuc3RhcnRgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgUmF5YCB3aWxsIHVzZSBgdGhpcy5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBSYXlgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgcmF5VG9Qb2ludChwb2ludCkge1xuICAgIGxldCBuZXdBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB1c2luZyBgdGhpc2AgYW5kIHRoZSBnaXZlbiBgbGVuZ3RoYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudChsZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFNlZ21lbnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHNlZ21lbnRUb1BvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuc2VnbWVudFRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBhdCBgdGhpcy5zdGFydGAgYW5kIGVuZGluZyBhdCB0aGVcbiAgKiBpbnRlcnNlY3Rpb24gb2YgYHRoaXNgIGFuZCBgb3RoZXJSYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcmF5cyBhcmUgcGFyYWxsZWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIGludGVyc2VjdGlvbiBpc1xuICAqIHBvc3NpYmxlLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEJvdGggcmF5cyBhcmUgY29uc2lkZXJlZCB1bmJvdW5kZWQgbGluZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VG9JbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBpbnRlcnNlY3Rpb24gPSB0aGlzLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpO1xuICAgIGlmIChpbnRlcnNlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZWdtZW50VG9Qb2ludChpbnRlcnNlY3Rpb24pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgXG4gICogYW5kIHRoZSBnaXZlbiBhcmMgcHJvcGVydGllcy5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV8bnVtYmVyfSBbZW5kQW5nbGU9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqIGBBcmNgOyB3aGVuIGBudWxsYCBvciBvbW1pdGVkLCBgdGhpcy5hbmdsZWAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtib29sZWFuPX0gY2xvY2t3aXNlPXRydWUgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmMocmFkaXVzLCBlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMuYW5nbGVcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgLFxuICAqIGFuZCBlbmQgYXQgdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLnN0YXJ0YCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2UgZnJvbVxuICAqIGB0aGlzLnN0YXJ0YCB0byB0aGUgbmV3IGBBcmNgIGVuZFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyY1RvQW5nbGVEaXN0YW5jZShyYWRpdXMsIGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgZW5kQW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmF5XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYXk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBTZWdtZW50IG9mIGEgYFtSYXlde0BsaW5rIFJhYy5SYXl9YCB1cCB0byBhIGdpdmVuIGxlbmd0aC5cbipcbiogQGFsaWFzIFJhYy5TZWdtZW50XG4qL1xuY2xhc3MgU2VnbWVudCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgU2VnbWVudGAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0aGUgc2VnbWVudCB3aWxsIGJlIGJhc2VkIG9mXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnRcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCByYXksIGxlbmd0aCkge1xuICAgIC8vIFRPRE86IGRpZmZlcmVudCBhcHByb2FjaCB0byBlcnJvciB0aHJvd2luZz9cbiAgICAvLyBhc3NlcnQgfHwgdGhyb3cgbmV3IEVycm9yKGVyci5taXNzaW5nUGFyYW1ldGVycylcbiAgICAvLyBvclxuICAgIC8vIGNoZWNrZXIobXNnID0+IHsgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQobXNnKSk7XG4gICAgLy8gICAuZXhpc3RzKHJhYylcbiAgICAvLyAgIC5pc1R5cGUoUmFjLlJheSwgcmF5KVxuICAgIC8vICAgLmlzTnVtYmVyKGxlbmd0aClcblxuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHJheSwgbGVuZ3RoKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5SYXksIHJheSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKGxlbmd0aCk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGBSYXlgIHRoZSBzZWdtZW50IGlzIGJhc2VkIG9mLlxuICAgICogQHR5cGUge1JhYy5SYXl9XG4gICAgKi9cbiAgICB0aGlzLnJheSA9IHJheTtcblxuICAgIC8qKlxuICAgICogVGhlIGxlbmd0aCBvZiB0aGUgc2VnbWVudC5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LnN0YXJ0LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5zdGFydC55LCBkaWdpdHMpO1xuICAgIGNvbnN0IHR1cm5TdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuYW5nbGUudHVybiwgZGlnaXRzKTtcbiAgICBjb25zdCBsZW5ndGhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5sZW5ndGgsIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBTZWdtZW50KCgke3hTdHJ9LCR7eVN0cn0pIGE6JHt0dXJuU3RyfSBsOiR7bGVuZ3RoU3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGByYXlgIGFuZCBgbGVuZ3RoYCBpbiBib3RoIHNlZ21lbnRzIGFyZSBlcXVhbC5cbiAgKlxuICAqIFdoZW4gYG90aGVyU2VnbWVudGAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5TZWdtZW50YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogU2VnbWVudHMnIGBsZW5ndGhgIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IG90aGVyU2VnbWVudCAtIEEgYFNlZ21lbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYy5SYXkjZXF1YWxzXG4gICogQHNlZSBSYWMjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlclNlZ21lbnQpIHtcbiAgICByZXR1cm4gb3RoZXJTZWdtZW50IGluc3RhbmNlb2YgU2VnbWVudFxuICAgICAgJiYgdGhpcy5yYXkuZXF1YWxzKG90aGVyU2VnbWVudC5yYXkpXG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy5sZW5ndGgsIG90aGVyU2VnbWVudC5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBgW2FuZ2xlXXtAbGluayBSYWMuUmF5I2FuZ2xlfWAgb2YgdGhlIHNlZ21lbnQncyBgcmF5YC5cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBhbmdsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuYW5nbGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGBbc3RhcnRde0BsaW5rIFJhYy5SYXkjc3RhcnR9YCBvZiB0aGUgc2VnbWVudCdzIGByYXlgLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN0YXJ0UG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnN0YXJ0O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2hlcmUgdGhlIHNlZ21lbnQgZW5kcy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBlbmRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBhbmdsZSBzZXQgdG8gYG5ld0FuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IG5ld0FuZ2xlIC0gVGhlIGFuZ2xlIGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEFuZ2xlKG5ld0FuZ2xlKSB7XG4gICAgbmV3QW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3QW5nbGUpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLnJheS5zdGFydCwgbmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYHJheWAgc2V0IHRvIGBuZXdSYXlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gbmV3UmF5IC0gVGhlIHJheSBmb3IgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhSYXkobmV3UmF5KSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBzdGFydCBwb2ludCBzZXQgdG8gYG5ld1N0YXJ0YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnRQb2ludCAtIFRoZSBzdGFydCBwb2ludCBmb3IgdGhlIG5ld1xuICAqIGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFN0YXJ0UG9pbnQobmV3U3RhcnRQb2ludCkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhTdGFydChuZXdTdGFydFBvaW50KTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBsZW5ndGhgIHNldCB0byBgbmV3TGVuZ3RoYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3TGVuZ3RoIC0gVGhlIGxlbmd0aCBmb3IgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhMZW5ndGgobmV3TGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgbGVuZ3RoYCBhZGRlZCB0byBgdGhpcy5sZW5ndGhgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aEFkZChsZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aCArIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgc2V0IHRvIGB0aGlzLmxlbmd0aCAqIHJhdGlvYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGhgIGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aCAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgYW5nbGVgIGFkZGVkIHRvIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGVBZGQoYW5nbGUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoQW5nbGVBZGQoYW5nbGUpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGFuZ2xlYCBzZXQgdG9cbiAgKiBgdGhpcy5yYXkue0BsaW5rIFJhYy5BbmdsZSNzaGlmdCBhbmdsZS5zaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgaW4gdGhlIGludmVyc2VcbiAgKiBkaXJlY3Rpb24gb2YgdGhlIHNlZ21lbnQncyByYXkgYnkgdGhlIGdpdmVuIGBkaXN0YW5jZWAuIFRoZSByZXN1bHRpbmdcbiAgKiBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBzYW1lIGBlbmRQb2ludCgpYCBhbmQgYGFuZ2xlKClgIGFzIGB0aGlzYC5cbiAgKlxuICAqIFVzaW5nIGEgcG9zaXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgbG9uZ2VyIHNlZ21lbnQsIHVzaW5nIGFcbiAgKiBuZWdhdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBzaG9ydGVyIG9uZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBzdGFydCBwb2ludCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFN0YXJ0RXh0ZW5zaW9uKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9EaXN0YW5jZSgtZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCArIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgZGlzdGFuY2VgIGFkZGVkIHRvIGB0aGlzLmxlbmd0aGAsIHdoaWNoXG4gICogcmVzdWx0cyBpbiBgZW5kUG9pbnQoKWAgZm9yIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIG1vdmluZyBpbiB0aGVcbiAgKiBkaXJlY3Rpb24gb2YgdGhlIHNlZ21lbnQncyByYXkgYnkgdGhlIGdpdmVuIGBkaXN0YW5jZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVXNpbmcgYSBwb3NpdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBsb25nZXIgc2VnbWVudCwgdXNpbmcgYVxuICAqIG5lZ2F0aXZlIGBkaXN0YW5jZWAgcmVzdWx0cyBpbiBhIHNob3J0ZXIgb25lLlxuICAqXG4gICogVGhpcyBtZXRob2QgcGVyZm9ybXMgdGhlIHNhbWUgb3BlcmF0aW9uIGFzXG4gICogYFt3aXRoTGVuZ3RoQWRkXXtAbGluayBSYWMuU2VnbWVudCN3aXRoTGVuZ3RoQWRkfWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gYWRkIHRvIGBsZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoRW5kRXh0ZW5zaW9uKGRpc3RhbmNlKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aExlbmd0aEFkZChkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHBvaW50aW5nIHRvd2FyZHMgdGhlXG4gICogW3BlcnBlbmRpY3VsYXIgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfSBvZlxuICAqIGB0aGlzLmFuZ2xlKClgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgc2FtZSBgc3RhcnRQb2ludCgpYCBhbmQgYGxlbmd0aGBcbiAgKiBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBpdHMgc3RhcnQgcG9pbnQgc2V0IGF0XG4gICogYFt0aGlzLmVuZFBvaW50KClde0BsaW5rIFJhYy5TZWdtZW50I2VuZFBvaW50fWAsXG4gICogYW5nbGUgc2V0IHRvIGB0aGlzLmFuZ2xlKCkuW2ludmVyc2UoKV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9YCwgYW5kXG4gICogc2FtZSBsZW5ndGggYXMgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI2ludmVyc2VcbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgaW52ZXJzZVJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBlbmQsIHRoaXMucmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBpbnZlcnNlUmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieVxuICAqIHRoZSBnaXZlbiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnRcbiAgICB0b3dhcmRzXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCBhbG9uZyB0aGUgc2VnbWVudCdzXG4gICogcmF5IGJ5IHRoZSBnaXZlbiBgbGVuZ3RoYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGxlbmd0aGAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0xlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVUb0Rpc3RhbmNlKGxlbmd0aCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgdGhlIGdpdmVuIGBkaXN0YW5jZWBcbiAgKiB0b3dhcmRzIHRoZSBwZXJwZW5kaWN1bGFyIGFuZ2xlIHRvIGB0aGlzLmFuZ2xlKClgIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0b24uIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGdpdmVuIGB2YWx1ZWAgY2xhbXBlZCB0byBbc3RhcnRJbnNldCwgbGVuZ3RoLWVuZEluc2V0XS5cbiAgKlxuICAqIFdoZW4gYHN0YXJ0SW5zZXRgIGlzIGdyZWF0ZXIgdGhhdCBgbGVuZ3RoLWVuZEluc2V0YCB0aGUgcmFuZ2UgZm9yIHRoZVxuICAqIGNsYW1wIGJlY29tZXMgaW1wb3NpYmxlIHRvIGZ1bGZpbGwuIEluIHRoaXMgY2FzZSB0aGUgcmV0dXJuZWQgdmFsdWVcbiAgKiB3aWxsIGJlIHRoZSBjZW50ZXJlZCBiZXR3ZWVuIHRoZSByYW5nZSBsaW1pdHMgYW5kIHN0aWxsIGNsYW1wbGVkIHRvXG4gICogYFswLCBsZW5ndGhdYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIEEgdmFsdWUgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0SW5zZXQ9MF0gLSBUaGUgaW5zZXQgZm9yIHRoZSBsb3dlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7ZW5kSW5zZXR9IFtlbmRJbnNldD0wXSAtIFRoZSBpbnNldCBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGNsYW1wVG9MZW5ndGgodmFsdWUsIHN0YXJ0SW5zZXQgPSAwLCBlbmRJbnNldCA9IDApIHtcbiAgICBjb25zdCBlbmRMaW1pdCA9IHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQ7XG4gICAgaWYgKHN0YXJ0SW5zZXQgPj0gZW5kTGltaXQpIHtcbiAgICAgIC8vIGltcG9zaWJsZSByYW5nZSwgcmV0dXJuIG1pZGRsZSBwb2ludFxuICAgICAgY29uc3QgcmFuZ2VNaWRkbGUgPSAoc3RhcnRJbnNldCAtIGVuZExpbWl0KSAvIDI7XG4gICAgICBjb25zdCBtaWRkbGUgPSBzdGFydEluc2V0IC0gcmFuZ2VNaWRkbGU7XG4gICAgICAvLyBTdGlsbCBjbGFtcCB0byB0aGUgc2VnbWVudCBpdHNlbGZcbiAgICAgIGxldCBjbGFtcGVkID0gbWlkZGxlO1xuICAgICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoKTtcbiAgICAgIGNsYW1wZWQgPSBNYXRoLm1heChjbGFtcGVkLCAwKTtcbiAgICAgIHJldHVybiBjbGFtcGVkO1xuICAgIH1cbiAgICBsZXQgY2xhbXBlZCA9IHZhbHVlO1xuICAgIGNsYW1wZWQgPSBNYXRoLm1pbihjbGFtcGVkLCB0aGlzLmxlbmd0aCAtIGVuZEluc2V0KTtcbiAgICBjbGFtcGVkID0gTWF0aC5tYXgoY2xhbXBlZCwgc3RhcnRJbnNldCk7XG4gICAgcmV0dXJuIGNsYW1wZWQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgc2VnbWVudCdzIHJheSBhdCB0aGUgZ2l2ZW4gYGxlbmd0aGAgZnJvbVxuICAqIGB0aGlzLnN0YXJ0UG9pbnQoKWAuIFdoZW4gYGxlbmd0aGAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpc1xuICAqIGNhbGN1bGF0ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0UG9pbnQoKWBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqIEBzZWUgUmFjLlJheSNwb2ludEF0RGlzdGFuY2VcbiAgKi9cbiAgcG9pbnRBdExlbmd0aChsZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgc2VnbWVudCdzIHJheSBhdCBhIGRpc3RhbmNlIG9mXG4gICogYHRoaXMubGVuZ3RoICogcmF0aW9gIGZyb20gYHRoaXMuc3RhcnRQb2ludCgpYC4gV2hlbiBgcmF0aW9gIGlzXG4gICogbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkIGluIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZlxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoYCBieVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICogQHNlZSBSYWMuUmF5I3BvaW50QXREaXN0YW5jZVxuICAqL1xuICBwb2ludEF0TGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoICogcmF0aW8pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIG1pZGRsZSBwb2ludCB0aGUgc2VnbWVudC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QmlzZWN0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgYXQgYG5ld1N0YXJ0UG9pbnRgIGFuZCBlbmRpbmcgYXRcbiAgKiBgdGhpcy5lbmRQb2ludCgpYC5cbiAgKlxuICAqIFdoZW4gYG5ld1N0YXJ0UG9pbnRgIGFuZCBgdGhpcy5lbmRQb2ludCgpYCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnRQb2ludCAtIFRoZSBzdGFydCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgbW92ZVN0YXJ0UG9pbnQobmV3U3RhcnRQb2ludCkge1xuICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIHJldHVybiBuZXdTdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50LCB0aGlzLnJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0UG9pbnQoKWAgYW5kIGVuZGluZyBhdFxuICAqIGBuZXdFbmRQb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0UG9pbnQoKWAgYW5kIGBuZXdFbmRQb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld0VuZFBvaW50IC0gVGhlIGVuZCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgbW92ZUVuZFBvaW50KG5ld0VuZFBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnNlZ21lbnRUb1BvaW50KG5ld0VuZFBvaW50KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSB0aGUgc3RhcnRpbmcgcG9pbnQgdG8gdGhlIHNlZ21lbnQncyBtaWRkbGVcbiAgKiBwb2ludC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5TZWdtZW50I3BvaW50QXRCaXNlY3RvclxuICAqL1xuICBzZWdtZW50VG9CaXNlY3RvcigpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSB0aGUgc2VnbWVudCdzIG1pZGRsZSBwb2ludCB0b3dhcmRzIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlNlZ21lbnQjcG9pbnRBdEJpc2VjdG9yXG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBzZWdtZW50QmlzZWN0b3IobGVuZ3RoID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5wb2ludEF0QmlzZWN0b3IoKTtcbiAgICBjb25zdCBuZXdBbmdsZSA9IHRoaXMucmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgbmV3U3RhcnQsIG5ld0FuZ2xlKTtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB3aXRoIHRoZSBnaXZlblxuICAqIGBsZW5ndGhgIGFuZCB0aGUgc2FtZSBhbmdsZSBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV4dCBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIG5leHRTZWdtZW50V2l0aExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoU3RhcnQobmV3U3RhcnQpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCBhbmQgdXAgdG8gdGhlIGdpdmVuXG4gICogYG5leHRFbmRQb2ludGAuXG4gICpcbiAgKiBXaGVuIGBlbmRQb2ludCgpYCBhbmQgYG5leHRFbmRQb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5leHRFbmRQb2ludCAtIFRoZSBlbmQgcG9pbnQgb2YgdGhlIG5leHQgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBuZXh0U2VnbWVudFRvUG9pbnQobmV4dEVuZFBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgcmV0dXJuIG5ld1N0YXJ0LnNlZ21lbnRUb1BvaW50KG5leHRFbmRQb2ludCwgdGhpcy5yYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIGBhbmdsZWBcbiAgKiB3aXRoIHRoZSBnaXZlbiBgbGVuZ3RoYC5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHs/bnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIG5leHRTZWdtZW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZSBnaXZlblxuICAqIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLmFuZ2xlKCkuaW52ZXJzZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBOb3RpY2UgdGhhdCB0aGUgYGFuZ2xlRGlzdGFuY2VgIGlzIGFwcGxpZWQgdG8gdGhlIGludmVyc2Ugb2YgdGhlXG4gICogc2VnbWVudCdzIGFuZ2xlLiBFLmcuIHdpdGggYW4gYGFuZ2xlRGlzdGFuY2VgIG9mIGAwYCB0aGUgcmVzdWx0aW5nXG4gICogYFNlZ21lbnRgIHdpbGwgYmUgZGlyZWN0bHkgb3ZlciBhbmQgcG9pbnRpbmcgaW4gdGhlIGludmVyc2UgYW5nbGUgb2ZcbiAgKiBgdGhpc2AuIEFzIHRoZSBgYW5nbGVEaXN0YW5jZWAgaW5jcmVhc2VzIHRoZSB0d28gc2VnbWVudHMgc2VwYXJhdGUgd2l0aFxuICAqIHRoZSBwaXZvdCBhdCBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBBbiBhbmdsZSBkaXN0YW5jZSB0byBhcHBseSB0b1xuICAqIHRoZSBzZWdtZW50J3MgYW5nbGUgaW52ZXJzZVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYW5nbGUgc2hpZnRcbiAgKiBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI2ludmVyc2VcbiAgKi9cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5pbnZlcnNlKClcbiAgICAgIC53aXRoQW5nbGVTaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZVxuICAqIGBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9YCBvZlxuICAqIGB0aGlzLmFuZ2xlKCkuaW52ZXJzZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhlIHBlcnBlbmRpY3VsYXIgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBpbnZlcnNlIG9mIHRoZVxuICAqIHNlZ21lbnQncyBhbmdsZS4gRS5nLiB3aXRoIGBjbG9ja3dpc2VgIGFzIGB0cnVlYCwgdGhlIHJlc3VsdGluZ1xuICAqIGBTZWdtZW50YCB3aWxsIGJlIHBvaW50aW5nIHRvd2FyZHMgYHRoaXMuYW5nbGUoKS5wZXJwZW5kaWN1bGFyKGZhbHNlKWAuXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJcbiAgKi9cbiAgbmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUsIGxlbmd0aCA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5wZXJwZW5kaWN1bGFyKCFjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB3aGljaCBjb3JyZXNwb25kc1xuICAqIHRvIHRoZSBsZWcgb2YgYSByaWdodCB0cmlhbmdsZSB3aGVyZSBgdGhpc2AgaXMgdGhlIG90aGVyIGNhdGhldHVzIGFuZFxuICAqIHRoZSBoeXBvdGVudXNlIGlzIG9mIGxlbmd0aCBgaHlwb3RlbnVzZWAuXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIHBvaW50IHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgYW5nbGUgb2ZcbiAgKiBgW3RoaXMuYW5nbGUoKS5baW52ZXJzZSgpXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1gIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiBgaHlwb3RlbnVzZWAgaXMgc21hbGxlciB0aGF0IHRoZSBzZWdtZW50J3MgYGxlbmd0aGAsIHJldHVybnNcbiAgKiBgbnVsbGAgc2luY2Ugbm8gcmlnaHQgdHJpYW5nbGUgaXMgcG9zc2libGUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gaHlwb3RlbnVzZSAtIFRoZSBsZW5ndGggb2YgdGhlIGh5cG90ZW51c2Ugc2lkZSBvZiB0aGVcbiAgKiByaWdodCB0cmlhbmdsZSBmb3JtZWQgd2l0aCBgdGhpc2AgYW5kIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgZnJvbSBgZW5kUG9pbnQoKWBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjaW52ZXJzZVxuICAqL1xuICBuZXh0U2VnbWVudExlZ1dpdGhIeXAoaHlwb3RlbnVzZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGlmIChoeXBvdGVudXNlIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGNvcyA9IGFkeSAvIGh5cFxuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmFjb3ModGhpcy5sZW5ndGggLyBoeXBvdGVudXNlKTtcbiAgICAvLyB0YW4gPSBvcHMgLyBhZGpcbiAgICAvLyB0YW4gKiBhZGogPSBvcHNcbiAgICBjb25zdCBvcHMgPSBNYXRoLnRhbihyYWRpYW5zKSAqIHRoaXMubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihjbG9ja3dpc2UsIG9wcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgYmFzZWQgb24gdGhpcyBzZWdtZW50LCB3aXRoIHRoZSBnaXZlbiBgZW5kQW5nbGVgXG4gICogYW5kIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIHJldHVybmVkIGBBcmNgIHdpbGwgdXNlIHRoaXMgc2VnbWVudCdzIHN0YXJ0IGFzIGBjZW50ZXJgLCBpdHMgYW5nbGVcbiAgKiBhcyBgc3RhcnRgLCBhbmQgaXRzIGxlbmd0aCBhcyBgcmFkaXVzYC5cbiAgKlxuICAqIFdoZW4gYGVuZEFuZ2xlYCBpcyBvbW1pdGVkIG9yIGBudWxsYCwgdGhlIHNlZ21lbnQncyBhbmdsZSBpcyB1c2VkXG4gICogaW5zdGVhZCByZXN1bHRpbmcgaW4gYSBjb21wbGV0ZS1jaXJjbGUgYXJjLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfSBbZW5kQW5nbGU9bnVsbF0gLSBBbiBgQW5nbGVgIHRvIHVzZSBhcyBlbmQgZm9yIHRoZVxuICAqIG5ldyBgQXJjYCwgb3IgYG51bGxgIHRvIHVzZSBgdGhpcy5hbmdsZSgpYFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMucmF5LmFuZ2xlXG4gICAgICA6IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5yYXkuc3RhcnQsIHRoaXMubGVuZ3RoLFxuICAgICAgdGhpcy5yYXkuYW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCBiYXNlZCBvbiB0aGlzIHNlZ21lbnQsIHdpdGggdGhlIGFyYydzIGVuZCBhdFxuICAqIGBhbmdsZURpc3RhbmNlYCBmcm9tIHRoZSBzZWdtZW50J3MgYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYEFyY2Agd2lsbCB1c2UgdGhpcyBzZWdtZW50J3Mgc3RhcnQgYXMgYGNlbnRlcmAsIGl0cyBhbmdsZVxuICAqIGFzIGBzdGFydGAsIGFuZCBpdHMgbGVuZ3RoIGFzIGByYWRpdXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gdGhlXG4gICogc2VnbWVudCdzIHN0YXJ0IHRvIHRoZSBuZXcgYEFyY2AgZW5kXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjV2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IHN0YXJnQW5nbGUgPSB0aGlzLnJheS5hbmdsZTtcbiAgICBjb25zdCBlbmRBbmdsZSA9IHN0YXJnQW5nbGUuc2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMucmF5LnN0YXJ0LCB0aGlzLmxlbmd0aCxcbiAgICAgIHN0YXJnQW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogdW5jb21tZW50IG9uY2UgYmV6aWVycyBhcmUgdGVzdGVkIGFnYWluXG4gIC8vIGJlemllckNlbnRyYWxBbmNob3IoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgLy8gICBsZXQgYmlzZWN0b3IgPSB0aGlzLnNlZ21lbnRCaXNlY3RvcihkaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgLy8gICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLnN0YXJ0LCBiaXNlY3Rvci5lbmQsXG4gIC8vICAgICBiaXNlY3Rvci5lbmQsIHRoaXMuZW5kKTtcbiAgLy8gfVxuXG5cbn0gLy8gU2VnbWVudFxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VnbWVudDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5zIHR3byBgW0NvbXBvc2l0ZV17QGxpbmsgUmFjLkNvbXBvc2l0ZX1gIG9iamVjdHM6IGBvdXRsaW5lYCBhbmRcbiogYGNvbnRvdXJgLlxuKlxuKiBVc2VkIGJ5IGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gIHRvIGRyYXcgdGhlIGNvbXBvc2l0ZXMgYXMgYVxuKiBjb21wbGV4IHNoYXBlIChgb3V0bGluZWApIHdpdGggYW4gbmVnYXRpdmUgc3BhY2Ugc2hhcGUgaW5zaWRlIChgY29udG91cmApLlxuKlxuKiDimqDvuI8gVGhlIEFQSSBmb3IgU2hhcGUgaXMgKipwbGFubmVkIHRvIGNoYW5nZSoqIGluIGEgZnV0dXJlIG1pbm9yIHJlbGVhc2UuIOKaoO+4j1xuKlxuKiBAY2xhc3NcbiogQGFsaWFzIFJhYy5TaGFwZVxuKi9cbmZ1bmN0aW9uIFNoYXBlKHJhYykge1xuICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcblxuICB0aGlzLnJhYyA9IHJhYztcbiAgdGhpcy5vdXRsaW5lID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcbiAgdGhpcy5jb250b3VyID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlO1xuXG5cblNoYXBlLnByb3RvdHlwZS5hZGRPdXRsaW5lID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICB0aGlzLm91dGxpbmUuYWRkKGVsZW1lbnQpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLmFkZENvbnRvdXIgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIHRoaXMuY29udG91ci5hZGQoZWxlbWVudCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRm9ybWF0IGZvciBkcmF3aW5nIGEgYFtUZXh0XXtAbGluayBSYWMuVGV4dH1gIG9iamVjdC5cbipcbiogQGFsaWFzIFJhYy5UZXh0LkZvcm1hdFxuKi9cbmNsYXNzIFRleHRGb3JtYXQge1xuXG4gIHN0YXRpYyBkZWZhdWx0U2l6ZSA9IDE1O1xuXG4gIHN0YXRpYyBob3Jpem9udGFsID0ge1xuICAgIGxlZnQ6IFwibGVmdFwiLFxuICAgIGNlbnRlcjogXCJob3Jpem9udGFsQ2VudGVyXCIsXG4gICAgcmlnaHQ6IFwicmlnaHRcIlxuICB9O1xuXG4gIHN0YXRpYyB2ZXJ0aWNhbCA9IHtcbiAgICB0b3A6IFwidG9wXCIsXG4gICAgYm90dG9tOiBcImJvdHRvbVwiLFxuICAgIGNlbnRlcjogXCJ2ZXJ0aWNhbENlbnRlclwiLFxuICAgIGJhc2VsaW5lOiBcImJhc2VsaW5lXCJcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByYWMsXG4gICAgaG9yaXpvbnRhbCwgdmVydGljYWwsXG4gICAgZm9udCA9IG51bGwsXG4gICAgYW5nbGUgPSByYWMuQW5nbGUuemVybyxcbiAgICBzaXplID0gVGV4dEZvcm1hdC5kZWZhdWx0U2l6ZSlcbiAge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydFN0cmluZyhob3Jpem9udGFsLCB2ZXJ0aWNhbCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIoc2l6ZSk7XG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5ob3Jpem9udGFsID0gaG9yaXpvbnRhbDtcbiAgICB0aGlzLnZlcnRpY2FsID0gdmVydGljYWw7XG4gICAgdGhpcy5mb250ID0gZm9udDtcbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBmb3JtYXQgdG8gZHJhdyB0ZXh0IGluIHRoZSBzYW1lIHBvc2l0aW9uIGFzIGBzZWxmYCB3aXRoXG4gIC8vIHRoZSBpbnZlcnNlIGFuZ2xlLlxuICBpbnZlcnNlKCkge1xuICAgIGxldCBoRW51bSA9IFRleHRGb3JtYXQuaG9yaXpvbnRhbDtcbiAgICBsZXQgdkVudW0gPSBUZXh0Rm9ybWF0LnZlcnRpY2FsO1xuICAgIGxldCBob3Jpem9udGFsLCB2ZXJ0aWNhbDtcbiAgICBzd2l0Y2ggKHRoaXMuaG9yaXpvbnRhbCkge1xuICAgICAgY2FzZSBoRW51bS5sZWZ0OlxuICAgICAgICBob3Jpem9udGFsID0gaEVudW0ucmlnaHQ7IGJyZWFrO1xuICAgICAgY2FzZSBoRW51bS5yaWdodDpcbiAgICAgICAgaG9yaXpvbnRhbCA9IGhFbnVtLmxlZnQ7IGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaG9yaXpvbnRhbCA9IHRoaXMuaG9yaXpvbnRhbDsgYnJlYWs7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgY2FzZSB2RW51bS50b3A6XG4gICAgICAgIHZlcnRpY2FsID0gdkVudW0uYm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgdkVudW0uYm90dG9tOlxuICAgICAgICB2ZXJ0aWNhbCA9IHZFbnVtLnRvcDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2ZXJ0aWNhbCA9IHRoaXMudmVydGljYWw7IGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgaG9yaXpvbnRhbCwgdmVydGljYWwsXG4gICAgICB0aGlzLmZvbnQsXG4gICAgICB0aGlzLmFuZ2xlLmludmVyc2UoKSxcbiAgICAgIHRoaXMuc2l6ZSlcbiAgfVxuXG5cbiAgd2l0aEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdCh0aGlzLnJhYyxcbiAgICAgIHRoaXMuaG9yaXpvbnRhbCwgdGhpcy52ZXJ0aWNhbCxcbiAgICAgIHRoaXMuZm9udCxcbiAgICAgIGFuZ2xlLFxuICAgICAgdGhpcy5zaXplKTtcbiAgfVxuXG59IC8vIGNsYXNzIFRleHRGb3JtYXRcblxuXG4vKipcbiogU3RyaW5nLCBmb3JtYXQsIGFuZCBwb3NpdGlvbiB0byBkcmF3IGEgdGV4dC5cbiogQGFsaWFzIFJhYy5UZXh0XG4qL1xuY2xhc3MgVGV4dCB7XG5cbiAgc3RhdGljIEZvcm1hdCA9IFRleHRGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IocmFjLCBwb2ludCwgc3RyaW5nLCBmb3JtYXQpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBwb2ludCwgc3RyaW5nLCBmb3JtYXQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBwb2ludCk7XG4gICAgdXRpbHMuYXNzZXJ0U3RyaW5nKHN0cmluZyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShUZXh0LkZvcm1hdCwgZm9ybWF0KTtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnBvaW50ID0gcG9pbnQ7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgdGhpcy5mb3JtYXQgPSBmb3JtYXQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgVGV4dCgoJHt0aGlzLnBvaW50Lnh9LCR7dGhpcy5wb2ludC55fSkgXCIke3RoaXMuc3RyaW5nfVwiKWA7XG4gIH1cblxufSAvLyBjbGFzcyBUZXh0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuQW5nbGVgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkFuZ2xlfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQW5nbGVcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0FuZ2xlKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiBDYWxsc2B7QGxpbmsgUmFjLkFuZ2xlLmZyb219YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcnxSYWMuQW5nbGV8UmFjLlJheXxSYWMuU2VnbWVudH0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGFuIGBBbmdsZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb20gPSBmdW5jdGlvbihzb21ldGhpbmcpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb20ocmFjLCBzb21ldGhpbmcpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBDYWxscyBge0BsaW5rIFJhYy5BbmdsZS5mcm9tUmFkaWFuc31gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21SYWRpYW5zXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gcmFkaWFuc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVJhZGlhbnNcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tUmFkaWFucyA9IGZ1bmN0aW9uKHJhZGlhbnMpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHJhYywgcmFkaWFucyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBkZWdyZWVzYC5cbiAgKlxuICAqIENhbGxzIGB7QGxpbmsgUmFjLkFuZ2xlLmZyb21EZWdyZWVzfWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogQHNlZSBSYWMuQW5nbGUuZnJvbURlZ3JlZXNcbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiBkZWdyZWVzXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tRGVncmVlc1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb21EZWdyZWVzID0gZnVuY3Rpb24oZGVncmVlcykge1xuICAgIHJldHVybiBSYWMuQW5nbGUuZnJvbURlZ3JlZXMocmFjLCBkZWdyZWVzKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAwYC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGByaWdodGAsIGByYCwgYGVhc3RgLCBgZWAuXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS56ZXJvID0gcmFjLkFuZ2xlKDAuMCk7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMmAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgbGVmdGAsIGBsYCwgYHdlc3RgLCBgd2AsIGBpbnZlcnNlYC5cbiAgKlxuICAqIEBuYW1lIGhhbGZcbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmhhbGYgPSByYWMuQW5nbGUoMS8yKTtcbiAgcmFjLkFuZ2xlLmludmVyc2UgPSByYWMuQW5nbGUuaGFsZjtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS80YC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGBkb3duYCwgYGRgLCBgYm90dG9tYCwgYGJgLCBgc291dGhgLCBgc2AsIGBzcXVhcmVgLlxuICAqXG4gICogQG5hbWUgcXVhcnRlclxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUucXVhcnRlciA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUuc3F1YXJlID0gIHJhYy5BbmdsZS5xdWFydGVyO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzhgLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYGJvdHRvbVJpZ2h0YCwgYGJyYCwgYHNlYC5cbiAgKlxuICAqIEBuYW1lIGVpZ2h0aFxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZWlnaHRoID0gIHJhYy5BbmdsZSgxLzgpO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGA3LzhgLCBuZWdhdGl2ZSBhbmdsZSBvZlxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUjZWlnaHRoIGVpZ2h0aH1gLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYHRvcFJpZ2h0YCwgYHRyYCwgYG5lYC5cbiAgKlxuICAqIEBuYW1lIG5laWdodGhcbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLm5laWdodGggPSAgcmFjLkFuZ2xlKC0xLzgpO1xuXG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMTZgLlxuICAqXG4gICogQG5hbWUgc2l4dGVlbnRoXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5zaXh0ZWVudGggPSByYWMuQW5nbGUoMS8xNik7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDMvNGAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgdXBgLCBgdWAsIGB0b3BgLCBgdGAuXG4gICpcbiAgKiBAbmFtZSBub3J0aFxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUubm9ydGggPSByYWMuQW5nbGUoMy80KTtcbiAgcmFjLkFuZ2xlLmVhc3QgID0gcmFjLkFuZ2xlKDAvNCk7XG4gIHJhYy5BbmdsZS5zb3V0aCA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUud2VzdCAgPSByYWMuQW5nbGUoMi80KTtcblxuICByYWMuQW5nbGUuZSA9IHJhYy5BbmdsZS5lYXN0O1xuICByYWMuQW5nbGUucyA9IHJhYy5BbmdsZS5zb3V0aDtcbiAgcmFjLkFuZ2xlLncgPSByYWMuQW5nbGUud2VzdDtcbiAgcmFjLkFuZ2xlLm4gPSByYWMuQW5nbGUubm9ydGg7XG5cbiAgcmFjLkFuZ2xlLm5lID0gcmFjLkFuZ2xlLm4uYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5zZSA9IHJhYy5BbmdsZS5lLmFkZCgxLzgpO1xuICByYWMuQW5nbGUuc3cgPSByYWMuQW5nbGUucy5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLm53ID0gcmFjLkFuZ2xlLncuYWRkKDEvOCk7XG5cbiAgLy8gTm9ydGggbm9ydGgtZWFzdFxuICByYWMuQW5nbGUubm5lID0gcmFjLkFuZ2xlLm5lLmFkZCgtMS8xNik7XG4gIC8vIEVhc3Qgbm9ydGgtZWFzdFxuICByYWMuQW5nbGUuZW5lID0gcmFjLkFuZ2xlLm5lLmFkZCgrMS8xNik7XG4gIC8vIE5vcnRoLWVhc3Qgbm9ydGhcbiAgcmFjLkFuZ2xlLm5lbiA9IHJhYy5BbmdsZS5ubmU7XG4gIC8vIE5vcnRoLWVhc3QgZWFzdFxuICByYWMuQW5nbGUubmVlID0gcmFjLkFuZ2xlLmVuZTtcblxuICAvLyBFYXN0IHNvdXRoLWVhc3RcbiAgcmFjLkFuZ2xlLmVzZSA9IHJhYy5BbmdsZS5zZS5hZGQoLTEvMTYpO1xuICAvLyBTb3V0aCBzb3V0aC1lYXN0XG4gIHJhYy5BbmdsZS5zc2UgPSByYWMuQW5nbGUuc2UuYWRkKCsxLzE2KTtcbiAgLy8gU291dGgtZWFzdCBlYXN0XG4gIHJhYy5BbmdsZS5zZWUgPSByYWMuQW5nbGUuZXNlO1xuICAvLyBTb3V0aC1lYXN0IHNvdXRoXG4gIHJhYy5BbmdsZS5zZXMgPSByYWMuQW5nbGUuc3NlO1xuXG4gIC8vIFNvdXRoIHNvdXRoLXdlc3RcbiAgcmFjLkFuZ2xlLnNzdyA9IHJhYy5BbmdsZS5zdy5hZGQoLTEvMTYpO1xuICAvLyBXZXN0IHNvdXRoLXdlc3RcbiAgcmFjLkFuZ2xlLndzdyA9IHJhYy5BbmdsZS5zdy5hZGQoKzEvMTYpO1xuICAvLyBTb3V0aC13ZXN0IHNvdXRoXG4gIHJhYy5BbmdsZS5zd3MgPSByYWMuQW5nbGUuc3N3O1xuICAvLyBTb3V0aC13ZXN0IHdlc3RcbiAgcmFjLkFuZ2xlLnN3dyA9IHJhYy5BbmdsZS53c3c7XG5cbiAgLy8gV2VzdCBub3J0aC13ZXN0XG4gIHJhYy5BbmdsZS53bncgPSByYWMuQW5nbGUubncuYWRkKC0xLzE2KTtcbiAgLy8gTm9ydGggbm9ydGgtd2VzdFxuICByYWMuQW5nbGUubm53ID0gcmFjLkFuZ2xlLm53LmFkZCgrMS8xNik7XG4gIC8vIE5vcnQtaHdlc3Qgd2VzdFxuICByYWMuQW5nbGUubnd3ID0gcmFjLkFuZ2xlLndudztcbiAgLy8gTm9ydGgtd2VzdCBub3J0aFxuICByYWMuQW5nbGUubnduID0gcmFjLkFuZ2xlLm5udztcblxuICByYWMuQW5nbGUucmlnaHQgPSByYWMuQW5nbGUuZTtcbiAgcmFjLkFuZ2xlLmRvd24gID0gcmFjLkFuZ2xlLnM7XG4gIHJhYy5BbmdsZS5sZWZ0ICA9IHJhYy5BbmdsZS53O1xuICByYWMuQW5nbGUudXAgICAgPSByYWMuQW5nbGUubjtcblxuICByYWMuQW5nbGUuciA9IHJhYy5BbmdsZS5yaWdodDtcbiAgcmFjLkFuZ2xlLmQgPSByYWMuQW5nbGUuZG93bjtcbiAgcmFjLkFuZ2xlLmwgPSByYWMuQW5nbGUubGVmdDtcbiAgcmFjLkFuZ2xlLnUgPSByYWMuQW5nbGUudXA7XG5cbiAgcmFjLkFuZ2xlLnRvcCAgICA9IHJhYy5BbmdsZS51cDtcbiAgcmFjLkFuZ2xlLmJvdHRvbSA9IHJhYy5BbmdsZS5kb3duO1xuICByYWMuQW5nbGUudCAgICAgID0gcmFjLkFuZ2xlLnRvcDtcbiAgcmFjLkFuZ2xlLmIgICAgICA9IHJhYy5BbmdsZS5ib3R0b207XG5cbiAgcmFjLkFuZ2xlLnRvcFJpZ2h0ICAgID0gcmFjLkFuZ2xlLm5lO1xuICByYWMuQW5nbGUudHIgICAgICAgICAgPSByYWMuQW5nbGUubmU7XG4gIHJhYy5BbmdsZS50b3BMZWZ0ICAgICA9IHJhYy5BbmdsZS5udztcbiAgcmFjLkFuZ2xlLnRsICAgICAgICAgID0gcmFjLkFuZ2xlLm53O1xuICByYWMuQW5nbGUuYm90dG9tUmlnaHQgPSByYWMuQW5nbGUuc2U7XG4gIHJhYy5BbmdsZS5iciAgICAgICAgICA9IHJhYy5BbmdsZS5zZTtcbiAgcmFjLkFuZ2xlLmJvdHRvbUxlZnQgID0gcmFjLkFuZ2xlLnN3O1xuICByYWMuQW5nbGUuYmwgICAgICAgICAgPSByYWMuQW5nbGUuc3c7XG5cbn0gLy8gYXR0YWNoUmFjQW5nbGVcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkFyY2AgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQXJjfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQXJjXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNBcmMocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBjbG9ja3dpc2UgYEFyY2Agd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQXJjfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BcmMjXG4gICovXG4gIHJhYy5BcmMuemVybyA9IHJhYy5BcmMoMCwgMCwgMCwgMCwgMCwgdHJ1ZSk7XG5cbn0gLy8gYXR0YWNoUmFjQXJjXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5CZXppZXJgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkJlemllcn1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkJlemllclxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VCZXppZXIocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgQmV6aWVyYCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5CZXppZXJ9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkJlemllciNcbiAgKi9cbiAgcmFjLkJlemllci56ZXJvID0gcmFjLkJlemllcihcbiAgICAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDApO1xuXG59IC8vIGF0dGFjaEluc3RhbmNlQmV6aWVyXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5Qb2ludGAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuUG9pbnR9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Qb2ludFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjUG9pbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lnplcm8gPSByYWMuUG9pbnQoMCwgMCk7XG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIGF0IGAoMCwgMClgLlxuICAqXG4gICogRXF1YWwgdG8gYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAuXG4gICpcbiAgKiBAbmFtZSBvcmlnaW5cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lm9yaWdpbiA9IHJhYy5Qb2ludC56ZXJvO1xuXG5cbn0gLy8gYXR0YWNoUmFjUG9pbnRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlJheWAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuUmF5fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuUmF5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNSYXkocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgUmF5YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sIHN0YXJ0cyBhdFxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb31gIGFuZCBwb2ludHMgdG9cbiAgKiBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99YC5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnQjemVyb1xuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjemVyb1xuICAqL1xuICByYWMuUmF5Lnplcm8gPSByYWMuUmF5KDAsIDAsIHJhYy5BbmdsZS56ZXJvKTtcblxuXG4gIC8qKlxuICAqIEEgYFJheWAgb3ZlciB0aGUgeC1heGlzLCBzdGFydHMgYXQgYHtAbGluayBpbnN0YW5jZS5Qb2ludCNvcmlnaW59YCBhbmRcbiAgKiBwb2ludHMgdG8gYHtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfWAuXG4gICpcbiAgKiBFcXVhbCB0byBge0BsaW5rIGluc3RhbmNlLlJheSN6ZXJvfWAuXG4gICpcbiAgKiBAbmFtZSB4QXhpc1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICogQHNlZSBpbnN0YW5jZS5Qb2ludCNvcmlnaW5cbiAgKiBAc2VlIGluc3RhbmNlLkFuZ2xlI3plcm9cbiAgKi9cbiAgcmFjLlJheS54QXhpcyA9IHJhYy5SYXkuemVybztcblxuXG4gIC8qKlxuICAqIEEgYFJheWAgb3ZlciB0aGUgeS1heGlzLCBzdGFydHMgYXRge0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn1gIGFuZFxuICAqIHBvaW50cyB0byBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3F1YXJ0ZXJ9YC5cbiAgKlxuICAqIEBuYW1lIHlBeGlzXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKiBAc2VlIGluc3RhbmNlLlBvaW50I29yaWdpblxuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjcXVhcnRlclxuICAqL1xuICByYWMuUmF5LnlBeGlzID0gcmFjLlJheSgwLCAwLCByYWMuQW5nbGUucXVhcnRlcik7XG5cbn0gLy8gYXR0YWNoUmFjUmF5XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5TZWdtZW50YCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5TZWdtZW50fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU2VnbWVudFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjU2VnbWVudChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBTZWdtZW50YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sICwgc3RhcnRzIGF0XG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAsIHBvaW50cyB0b1xuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31gLCBhbmQgaGFzIGEgbGVuZ3RoIG9mIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5TZWdtZW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC56ZXJvID0gcmFjLlNlZ21lbnQoMCwgMCwgMCwgMCk7XG5cbn0gLy8gYXR0YWNoUmFjU2VnbWVudFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuVGV4dGAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuVGV4dH1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlRleHRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1RleHQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cblxuICByYWMuVGV4dC5Gb3JtYXQgPSBmdW5jdGlvbihcbiAgICBob3Jpem9udGFsLCB2ZXJ0aWNhbCxcbiAgICBmb250ID0gbnVsbCxcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS56ZXJvLFxuICAgIHNpemUgPSBSYWMuVGV4dC5Gb3JtYXQuZGVmYXVsdFNpemUpXG4gIHtcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICAgIHJhYyxcbiAgICAgIGhvcml6b250YWwsIHZlcnRpY2FsLFxuICAgICAgZm9udCwgYW5nbGUsIHNpemUpO1xuICB9O1xuXG5cbiAgcmFjLlRleHQuRm9ybWF0LnRvcExlZnQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWwubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWwudG9wLFxuICAgIHJhYy5BbmdsZS56ZXJvLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5kZWZhdWx0U2l6ZSk7XG5cbiAgcmFjLlRleHQuRm9ybWF0LnRvcFJpZ2h0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsLnJpZ2h0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbC50b3AsXG4gICAgcmFjLkFuZ2xlLnplcm8sXG4gICAgUmFjLlRleHQuRm9ybWF0LmRlZmF1bHRTaXplKTtcblxuICAvKipcbiAgKiBBIGBUZXh0YCBmb3IgZHJhd2luZyBgaGVsbG8gd29ybGRgIHdpdGggYHRvcExlZnRgIGZvcm1hdCBhdFxuICAqIGBQb2ludC56ZXJvYC5cbiAgKiBAbmFtZSBoZWxsb1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0I1xuICAqL1xuICByYWMuVGV4dC5oZWxsbyA9IHJhYy5UZXh0KDAsIDAsICdoZWxsbyB3b3JsZCEnLFxuICAgIHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KTtcblxuICAvKipcbiAgKiBBIGBUZXh0YCBmb3IgZHJhd2luZyB0aGUgcGFuZ3JhbSBgc3BoaW54IG9mIGJsYWNrIHF1YXJ0eiwganVkZ2UgbXkgdm93YFxuICAqIHdpdGggYHRvcExlZnRgIGZvcm1hdCBhdCBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgc3BoaW54XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LnNwaGlueCA9IHJhYy5UZXh0KDAsIDAsICdzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3cnLFxuICAgIHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KTtcblxufSAvLyBhdHRhY2hSYWNQb2ludFxuXG4iLCJcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci90ZW1wbGF0ZXMvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW1kanMvYW1kanMtYXBpL2Jsb2IvbWFzdGVyL0FNRC5tZFxuICAgIC8vIGh0dHBzOi8vcmVxdWlyZWpzLm9yZy9kb2NzL3doeWFtZC5odG1sXG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXG4gICAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGZvciBBTUQgLSBkZWZpbmU6JHt0eXBlb2YgZGVmaW5lfWApO1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuXG4gICAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGZvciBOb2RlIC0gbW9kdWxlOiR7dHlwZW9mIG1vZHVsZX1gKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuXG4gIC8vIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJBQyBpbnRvIHNlbGYgLSByb290OiR7dHlwZW9mIHJvb3R9YCk7XG4gIHJvb3QuUmFjID0gZmFjdG9yeSgpO1xuXG59KHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHJlcXVpcmUoJy4vUmFjJyk7XG5cbn0pKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIERyYXdlciB0aGF0IHVzZXMgYSBbUDVdKGh0dHBzOi8vcDVqcy5vcmcvKSBpbnN0YW5jZSBmb3IgYWxsIGRyYXdpbmdcbiogb3BlcmF0aW9ucy5cbipcbiogQGFsaWFzIFJhYy5QNURyYXdlclxuKi9cbmNsYXNzIFA1RHJhd2VyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHA1KXtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnA1ID0gcDU7XG4gICAgdGhpcy5kcmF3Um91dGluZXMgPSBbXTtcbiAgICB0aGlzLmRlYnVnUm91dGluZXMgPSBbXTtcbiAgICB0aGlzLmFwcGx5Um91dGluZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdXNlZCBmb3IgZGVidWcgZHJhd2luZywgd2hlbiBgbnVsbGAgdGhlIHN0eWxlIGFscmVhZHkgYXBwbGllZFxuICAgICogaXMgdXNlZC5cbiAgICAqXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1N0eWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdXNlZCBmb3IgdGV4dCBmb3IgZGVidWcgZHJhd2luZywgd2hlbiBgbnVsbGAgdGhlIHN0eWxlIGFscmVhZHlcbiAgICAqIGFwcGxpZWQgaXMgdXNlZC5cbiAgICAqXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1RleHRTdHlsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAqIE9iamVjdCB3aXRoIG9wdGlvbnMgdXNlZCBieSB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZlxuICAgICogYGRyYXdhYmxlLmRlYnVnKClgLlxuICAgICpcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKi9cbiAgICB0aGlzLmRlYnVnVGV4dE9wdGlvbnMgPSB7XG4gICAgICBmb250OiAnbW9ub3NwYWNlJyxcbiAgICAgIHNpemU6IFJhYy5UZXh0LkZvcm1hdC5kZWZhdWx0U2l6ZSxcbiAgICAgIGZpeGVkRGlnaXRzOiAyXG4gICAgfTtcblxuICAgIC8qKlxuICAgICogUmFkaXVzIG9mIHBvaW50IG1hcmtlcnMgZm9yIGRlYnVnIGRyYXdpbmcuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1BvaW50UmFkaXVzID0gNDtcblxuICAgIC8qKlxuICAgICogUmFkaXVzIG9mIHRoZSBtYWluIHZpc3VhbCBlbGVtZW50cyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmRlYnVnTWFya2VyUmFkaXVzID0gMjI7XG5cbiAgICAvKipcbiAgICAqIEZhY3RvciBhcHBsaWVkIHRvIHN0cm9rZSB3ZWlnaHQgc2V0dGluZy4gU3Ryb2tlIHdlaWdodCBpcyBzZXQgdG9cbiAgICAqIGBzdHJva2Uud2VpZ2h0ICogc3Ryb2tlV2VpZ2h0RmFjdG9yYCB3aGVuIGFwcGxpY2FibGUuXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqIEBkZWZhdWx0IDFcbiAgICAqL1xuICAgIHRoaXMuc3Ryb2tlV2VpZ2h0RmFjdG9yID0gMTtcblxuICAgIHRoaXMuc2V0dXBBbGxEcmF3RnVuY3Rpb25zKCk7XG4gICAgdGhpcy5zZXR1cEFsbERlYnVnRnVuY3Rpb25zKCk7XG4gICAgdGhpcy5zZXR1cEFsbEFwcGx5RnVuY3Rpb25zKCk7XG4gIH1cblxuICAvLyBBZGRzIGEgRHJhd1JvdXRpbmUgZm9yIHRoZSBnaXZlbiBjbGFzcy5cbiAgc2V0RHJhd0Z1bmN0aW9uKGNsYXNzT2JqLCBkcmF3RnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmRJbmRleChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcblxuICAgIGxldCByb3V0aW5lO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJvdXRpbmUgPSBuZXcgRHJhd1JvdXRpbmUoY2xhc3NPYmosIGRyYXdGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmRyYXdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd1JvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuICBzZXREcmF3T3B0aW9ucyhjbGFzc09iaiwgb3B0aW9ucykge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgZmluZCByb3V0aW5lIGZvciBjbGFzcyAtIGNsYXNzTmFtZToke2NsYXNzT2JqLm5hbWV9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb25cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yZXF1aXJlc1B1c2hQb3AgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcm91dGluZS5yZXF1aXJlc1B1c2hQb3AgPSBvcHRpb25zLnJlcXVpcmVzUHVzaFBvcDtcbiAgICB9XG4gIH1cblxuICBzZXRDbGFzc0RyYXdTdHlsZShjbGFzc09iaiwgc3R5bGUpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IGZpbmQgcm91dGluZSBmb3IgY2xhc3MgLSBjbGFzc05hbWU6JHtjbGFzc09iai5uYW1lfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gICAgfVxuXG4gICAgcm91dGluZS5zdHlsZSA9IHN0eWxlO1xuICB9XG5cbiAgLy8gQWRkcyBhIERlYnVnUm91dGluZSBmb3IgdGhlIGdpdmVuIGNsYXNzLlxuICBzZXREZWJ1Z0Z1bmN0aW9uKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuXG4gICAgbGV0IHJvdXRpbmU7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcm91dGluZSA9IG5ldyBEZWJ1Z1JvdXRpbmUoY2xhc3NPYmosIGRlYnVnRnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5kZWJ1Z1JvdXRpbmVzW2luZGV4XTtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5kZWJ1Z1JvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1Z1JvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuICAvLyBBZGRzIGEgQXBwbHlSb3V0aW5lIGZvciB0aGUgZ2l2ZW4gY2xhc3MuXG4gIHNldEFwcGx5RnVuY3Rpb24oY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmFwcGx5Um91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IEFwcGx5Um91dGluZShjbGFzc09iaiwgYXBwbHlGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmFwcGx5Um91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5hcHBseVJvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseVJvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuICBkcmF3T2JqZWN0KG9iamVjdCwgc3R5bGUgPSBudWxsKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLnRyYWNlKGBDYW5ub3QgZHJhdyBvYmplY3QgLSBvYmplY3QtdHlwZToke3V0aWxzLnR5cGVOYW1lKG9iamVjdCl9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdFRvRHJhdztcbiAgICB9XG5cbiAgICBpZiAocm91dGluZS5yZXF1aXJlc1B1c2hQb3AgPT09IHRydWVcbiAgICAgIHx8IHN0eWxlICE9PSBudWxsXG4gICAgICB8fCByb3V0aW5lLnN0eWxlICE9PSBudWxsKVxuICAgIHtcbiAgICAgIHRoaXMucDUucHVzaCgpO1xuICAgICAgaWYgKHJvdXRpbmUuc3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgcm91dGluZS5zdHlsZS5hcHBseSgpO1xuICAgICAgfVxuICAgICAgaWYgKHN0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIHN0eWxlLmFwcGx5KCk7XG4gICAgICB9XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICAgICAgdGhpcy5wNS5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gcHVzaC1wdWxsXG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICAgIH1cbiAgfVxuXG5cbiAgZGVidWdPYmplY3Qob2JqZWN0LCBkcmF3c1RleHQpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBObyByb3V0aW5lLCBqdXN0IGRyYXcgb2JqZWN0IHdpdGggZGVidWcgc3R5bGVcbiAgICAgIHRoaXMuZHJhd09iamVjdChvYmplY3QsIHRoaXMuZGVidWdTdHlsZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVidWdTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5wNS5wdXNoKCk7XG4gICAgICB0aGlzLmRlYnVnU3R5bGUuYXBwbHkoKTtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbih0aGlzLCBvYmplY3QsIGRyYXdzVGV4dCk7XG4gICAgICB0aGlzLnA1LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24odGhpcywgb2JqZWN0LCBkcmF3c1RleHQpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5T2JqZWN0KG9iamVjdCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5hcHBseVJvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUudHJhY2UoYENhbm5vdCBhcHBseSBvYmplY3QgLSBvYmplY3QtdHlwZToke3V0aWxzLnR5cGVOYW1lKG9iamVjdCl9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdFRvQXBwbHk7XG4gICAgfVxuXG4gICAgcm91dGluZS5hcHBseUZ1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gIH1cblxuICAvLyBTZXRzIHVwIGFsbCBkcmF3aW5nIHJvdXRpbmVzIGZvciByYWMgZHJhd2FibGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGFuZCBzdGF0aWMgZnVuY3Rpb25zIGluIHJlbGV2YW50XG4gIC8vIGNsYXNzZXMuXG4gIHNldHVwQWxsRHJhd0Z1bmN0aW9ucygpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kcmF3LmZ1bmN0aW9ucycpO1xuXG4gICAgLy8gUG9pbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuUG9pbnQsIGZ1bmN0aW9ucy5kcmF3UG9pbnQpO1xuICAgIHJlcXVpcmUoJy4vUG9pbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gUmF5XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlJheSwgZnVuY3Rpb25zLmRyYXdSYXkpO1xuICAgIHJlcXVpcmUoJy4vUmF5LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIFNlZ21lbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRyYXdTZWdtZW50KTtcbiAgICByZXF1aXJlKCcuL1NlZ21lbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gQXJjXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRyYXdBcmMpO1xuXG4gICAgUmFjLkFyYy5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgICAgbGV0IGJlemllcnNQZXJUdXJuID0gNTtcbiAgICAgIGxldCBkaXZpc2lvbnMgPSBNYXRoLmNlaWwoYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgKiBiZXppZXJzUGVyVHVybik7XG4gICAgICB0aGlzLmRpdmlkZVRvQmV6aWVycyhkaXZpc2lvbnMpLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBCZXppZXJcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQmV6aWVyLCAoZHJhd2VyLCBiZXppZXIpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZXppZXIoXG4gICAgICAgIGJlemllci5zdGFydC54LCBiZXppZXIuc3RhcnQueSxcbiAgICAgICAgYmV6aWVyLnN0YXJ0QW5jaG9yLngsIGJlemllci5zdGFydEFuY2hvci55LFxuICAgICAgICBiZXppZXIuZW5kQW5jaG9yLngsIGJlemllci5lbmRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZC54LCBiZXppZXIuZW5kLnkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkJlemllci5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0YXJ0LnZlcnRleCgpXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuYmV6aWVyVmVydGV4KFxuICAgICAgICB0aGlzLnN0YXJ0QW5jaG9yLngsIHRoaXMuc3RhcnRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmRBbmNob3IueCwgdGhpcy5lbmRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmQueCwgdGhpcy5lbmQueSk7XG4gICAgfTtcblxuICAgIC8vIENvbXBvc2l0ZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5Db21wb3NpdGUsIChkcmF3ZXIsIGNvbXBvc2l0ZSkgPT4ge1xuICAgICAgY29tcG9zaXRlLnNlcXVlbmNlLmZvckVhY2goaXRlbSA9PiBpdGVtLmRyYXcoKSk7XG4gICAgfSk7XG5cbiAgICBSYWMuQ29tcG9zaXRlLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc2VxdWVuY2UuZm9yRWFjaChpdGVtID0+IGl0ZW0udmVydGV4KCkpO1xuICAgIH07XG5cbiAgICAvLyBTaGFwZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5TaGFwZSwgKGRyYXdlciwgc2hhcGUpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZWdpblNoYXBlKCk7XG4gICAgICBzaGFwZS5vdXRsaW5lLnZlcnRleCgpO1xuXG4gICAgICBpZiAoc2hhcGUuY29udG91ci5pc05vdEVtcHR5KCkpIHtcbiAgICAgICAgZHJhd2VyLnA1LmJlZ2luQ29udG91cigpO1xuICAgICAgICBzaGFwZS5jb250b3VyLnZlcnRleCgpO1xuICAgICAgICBkcmF3ZXIucDUuZW5kQ29udG91cigpO1xuICAgICAgfVxuICAgICAgZHJhd2VyLnA1LmVuZFNoYXBlKCk7XG4gICAgfSk7XG5cbiAgICBSYWMuU2hhcGUucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vdXRsaW5lLnZlcnRleCgpO1xuICAgICAgdGhpcy5jb250b3VyLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBUZXh0XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlRleHQsIChkcmF3ZXIsIHRleHQpID0+IHtcbiAgICAgIHRleHQuZm9ybWF0LmFwcGx5KHRleHQucG9pbnQpO1xuICAgICAgZHJhd2VyLnA1LnRleHQodGV4dC5zdHJpbmcsIDAsIDApO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0RHJhd09wdGlvbnMoUmFjLlRleHQsIHtyZXF1aXJlc1B1c2hQb3A6IHRydWV9KTtcblxuICAgIC8vIEFwcGxpZXMgYWxsIHRleHQgcHJvcGVydGllcyBhbmQgdHJhbnNsYXRlcyB0byB0aGUgZ2l2ZW4gYHBvaW50YC5cbiAgICAvLyBBZnRlciB0aGUgZm9ybWF0IGlzIGFwcGxpZWQgdGhlIHRleHQgc2hvdWxkIGJlIGRyYXduIGF0IHRoZSBvcmlnaW4uXG4gICAgUmFjLlRleHQuRm9ybWF0LnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICBsZXQgaEFsaWduO1xuICAgICAgbGV0IGhPcHRpb25zID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWw7XG4gICAgICBzd2l0Y2ggKHRoaXMuaG9yaXpvbnRhbCkge1xuICAgICAgICBjYXNlIGhPcHRpb25zLmxlZnQ6ICAgaEFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkxFRlQ7ICAgYnJlYWs7XG4gICAgICAgIGNhc2UgaE9wdGlvbnMuY2VudGVyOiBoQWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQ0VOVEVSOyBicmVhaztcbiAgICAgICAgY2FzZSBoT3B0aW9ucy5yaWdodDogIGhBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5SSUdIVDsgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgaG9yaXpvbnRhbCBjb25maWd1cmF0aW9uIC0gaG9yaXpvbnRhbDoke3RoaXMuaG9yaXpvbnRhbH1gKTtcbiAgICAgICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgICB9XG5cbiAgICAgIGxldCB2QWxpZ247XG4gICAgICBsZXQgdk9wdGlvbnMgPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWw7XG4gICAgICBzd2l0Y2ggKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgY2FzZSB2T3B0aW9ucy50b3A6ICAgICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LlRPUDsgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB2T3B0aW9ucy5ib3R0b206ICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkJPVFRPTTsgICBicmVhaztcbiAgICAgICAgY2FzZSB2T3B0aW9ucy5jZW50ZXI6ICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkNFTlRFUjsgICBicmVhaztcbiAgICAgICAgY2FzZSB2T3B0aW9ucy5iYXNlbGluZTogdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkJBU0VMSU5FOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHZlcnRpY2FsIGNvbmZpZ3VyYXRpb24gLSB2ZXJ0aWNhbDoke3RoaXMudmVydGljYWx9YCk7XG4gICAgICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgICAgfVxuXG4gICAgICAvLyBUZXh0IHByb3BlcnRpZXNcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50ZXh0QWxpZ24oaEFsaWduLCB2QWxpZ24pO1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRleHRTaXplKHRoaXMuc2l6ZSk7XG4gICAgICBpZiAodGhpcy5mb250ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50ZXh0Rm9udCh0aGlzLmZvbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBQb3NpdGlvbmluZ1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRyYW5zbGF0ZShwb2ludC54LCBwb2ludC55KTtcbiAgICAgIGlmICh0aGlzLmFuZ2xlLnR1cm4gIT0gMCkge1xuICAgICAgICB0aGlzLnJhYy5kcmF3ZXIucDUucm90YXRlKHRoaXMuYW5nbGUucmFkaWFucygpKTtcbiAgICAgIH1cbiAgICB9IC8vIFJhYy5UZXh0LkZvcm1hdC5wcm90b3R5cGUuYXBwbHlcblxuICB9IC8vIHNldHVwQWxsRHJhd0Z1bmN0aW9uc1xuXG5cbiAgLy8gU2V0cyB1cCBhbGwgZGVidWcgcm91dGluZXMgZm9yIHJhYyBkcmF3YWJsZSBjbGFzZXMuXG4gIHNldHVwQWxsRGVidWdGdW5jdGlvbnMoKSB7XG4gICAgbGV0IGZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vZGVidWcuZnVuY3Rpb25zJyk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5Qb2ludCwgZnVuY3Rpb25zLmRlYnVnUG9pbnQpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuUmF5LCBmdW5jdGlvbnMuZGVidWdSYXkpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRlYnVnU2VnbWVudCk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5BcmMsIGZ1bmN0aW9ucy5kZWJ1Z0FyYyk7XG5cbiAgICBSYWMuQW5nbGUucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24ocG9pbnQsIGRyYXdzVGV4dCA9IGZhbHNlKSB7XG4gICAgICBjb25zdCBkcmF3ZXIgPSB0aGlzLnJhYy5kcmF3ZXI7XG4gICAgICBpZiAoZHJhd2VyLmRlYnVnU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1LnB1c2goKTtcbiAgICAgICAgZHJhd2VyLmRlYnVnU3R5bGUuYXBwbHkoKTtcbiAgICAgICAgLy8gVE9ETzogY291bGQgdGhpcyBiZSBhIGdvb2Qgb3B0aW9uIHRvIGltcGxlbWVudCBzcGxhdHRpbmcgYXJndW1lbnRzXG4gICAgICAgIC8vIGludG8gdGhlIGRlYnVnRnVuY3Rpb24/XG4gICAgICAgIGZ1bmN0aW9ucy5kZWJ1Z0FuZ2xlKGRyYXdlciwgdGhpcywgcG9pbnQsIGRyYXdzVGV4dCk7XG4gICAgICAgIGRyYXdlci5wNS5wb3AoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bmN0aW9ucy5kZWJ1Z0FuZ2xlKGRyYXdlciwgdGhpcywgcG9pbnQsIGRyYXdzVGV4dCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFJhYy5Qb2ludC5wcm90b3R5cGUuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGFuZ2xlLCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICAgIGFuZ2xlLmRlYnVnKHRoaXMsIGRyYXdzVGV4dCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9IC8vIHNldHVwQWxsRGVidWdGdW5jdGlvbnNcblxuXG4gIC8vIFNldHMgdXAgYWxsIGFwcGx5aW5nIHJvdXRpbmVzIGZvciByYWMgc3R5bGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGZ1bmN0aW9ucyBpbiByZWxldmFudCBjbGFzc2VzLlxuICBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zKCkge1xuICAgIC8vIENvbG9yIHByb3RvdHlwZSBmdW5jdGlvbnNcbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5QmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmJhY2tncm91bmQodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSk7XG4gICAgfTtcblxuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlGaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuZmlsbCh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1LCB0aGlzLmEgKiAyNTUpO1xuICAgIH07XG5cbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5U3Ryb2tlID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuc3Ryb2tlKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUsIHRoaXMuYSAqIDI1NSk7XG4gICAgfTtcblxuICAgIC8vIFN0cm9rZVxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuU3Ryb2tlLCAoZHJhd2VyLCBzdHJva2UpID0+IHtcbiAgICAgIGlmIChzdHJva2Uud2VpZ2h0ID09PSBudWxsICYmIHN0cm9rZS5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUubm9TdHJva2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLmNvbG9yICE9PSBudWxsKSB7XG4gICAgICAgIHN0cm9rZS5jb2xvci5hcHBseVN0cm9rZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLndlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUuc3Ryb2tlV2VpZ2h0KHN0cm9rZS53ZWlnaHQgKiBkcmF3ZXIuc3Ryb2tlV2VpZ2h0RmFjdG9yKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEZpbGxcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLkZpbGwsIChkcmF3ZXIsIGZpbGwpID0+IHtcbiAgICAgIGlmIChmaWxsLmNvbG9yID09PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5ub0ZpbGwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmaWxsLmNvbG9yLmFwcGx5RmlsbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gU3R5bGVDb250YWluZXJcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLlN0eWxlQ29udGFpbmVyLCAoZHJhd2VyLCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaXRlbS5hcHBseSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgfSAvLyBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zXG5cbn0gLy8gY2xhc3MgUDVEcmF3ZXJcblxubW9kdWxlLmV4cG9ydHMgPSBQNURyYXdlcjtcblxuXG4vLyBFbmNhcHN1bGF0ZXMgdGhlIGRyYXdpbmcgZnVuY3Rpb24gYW5kIG9wdGlvbnMgZm9yIGEgc3BlY2lmaWMgY2xhc3MuXG4vLyBUaGUgZHJhdyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0d28gcGFyYW1ldGVyczogdGhlIGluc3RhbmNlIG9mIHRoZVxuLy8gZHJhd2VyLCBhbmQgdGhlIG9iamVjdCB0byBkcmF3LlxuLy9cbi8vIE9wdGlvbmFsbHkgYSBgc3R5bGVgIGNhbiBiZSBhc2lnbmVkIHRvIGFsd2F5cyBiZSBhcHBsaWVkIGJlZm9yZVxuLy8gZHJhd2luZyBhbiBpbnN0YW5jZSBvZiB0aGUgYXNzb2NpYXRlZCBjbGFzcy4gVGhpcyBzdHlsZSB3aWxsIGJlXG4vLyBhcHBsaWVkIGJlZm9yZSBhbnkgc3R5bGVzIHByb3ZpZGVkIHRvIHRoZSBgZHJhd2AgZnVuY3Rpb24uXG4vL1xuLy8gT3B0aW9uYWxseSBgcmVxdWlyZXNQdXNoUG9wYCBjYW4gYmUgc2V0IHRvIGB0cnVlYCB0byBhbHdheXMgcGVmb3JtXG4vLyBhIGBwdXNoYCBhbmQgYHBvcGAgYmVmb3JlIGFuZCBhZnRlciBhbGwgdGhlIHN0eWxlIGFuZCBkcmF3aW5nIGluXG4vLyB0aGUgcm91dGluZS4gVGhpcyBpcyBpbnRlbmRlZCBmb3Igb2JqZWN0cyB3aGljaCBkcmF3aW5nIG9wZXJhdGlvbnNcbi8vIG1heSBuZWVkIHRvIHB1c2ggdHJhbnNmb3JtYXRpb24gdG8gdGhlIHN0YWNrLlxuY2xhc3MgRHJhd1JvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGRyYXdGdW5jdGlvbikge1xuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcbiAgICB0aGlzLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcblxuICAgIC8vIE9wdGlvbnNcbiAgICB0aGlzLnJlcXVpcmVzUHVzaFBvcCA9IGZhbHNlO1xuICB9XG59IC8vIERyYXdSb3V0aW5lXG5cblxuY2xhc3MgRGVidWdSb3V0aW5lIHtcbiAgY29uc3RydWN0b3IgKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuICAgIHRoaXMuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gIH1cbn1cblxuXG5jbGFzcyBBcHBseVJvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG4gICAgdGhpcy5hcHBseUZ1bmN0aW9uID0gYXBwbHlGdW5jdGlvbjtcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFBvaW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIHRvIHJlcHJlc2VudCB0aGlzIGBQb2ludGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5Qb2ludC5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqL1xuICBSYWMuUG9pbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLmRyYXdlci5wNS52ZXJ0ZXgodGhpcy54LCB0aGlzLnkpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyLlxuICAqXG4gICogQWRkZWQgdG8gYGluc3RhbmNlLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gcG9pbnRlclxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LnBvaW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUubW91c2VYLCByYWMuZHJhd2VyLnA1Lm1vdXNlWSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAqXG4gICogQWRkZWQgdG8gYGluc3RhbmNlLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQ2VudGVyXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuY2FudmFzQ2VudGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLzIsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0LzIpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBlbmQgb2YgdGhlIGNhbnZhcywgdGhhdCBpcywgYXQgdGhlIHBvc2l0aW9uXG4gICogYCh3aWR0aCxoZWlnaHQpYC5cbiAgKlxuICAqIEFkZGVkIHRvIGBpbnN0YW5jZS5Qb2ludGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0VuZFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LmNhbnZhc0VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG59IC8vIGF0dGFjaFBvaW50RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmF5RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSByYXkgdG91Y2hlcyB0aGUgY2FudmFzIGVkZ2UuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCBgbnVsbGAgaXNcbiAgKiByZXR1cm5lZC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqIEByZXR1cm5zIHs/UmFjLlBvaW50fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5wb2ludEF0Q2FudmFzRWRnZSA9IGZ1bmN0aW9uKG1hcmdpbiA9IDApIHtcbiAgICBsZXQgZWRnZVJheSA9IHRoaXMucmF5QXRDYW52YXNFZGdlKG1hcmdpbik7XG4gICAgaWYgKGVkZ2VSYXkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkZ2VSYXkuc3RhcnQ7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRoYXQgc3RhcnRzIGF0IHRoZSBwb2ludCB3aGVyZSB0aGUgYHRoaXNgIHRvdWNoZXNcbiAgKiB0aGUgY2FudmFzIGVkZ2UgYW5kIHBvaW50ZWQgdG93YXJkcyB0aGUgaW5zaWRlIG9mIHRoZSBjYW52YXMuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCBgbnVsbGAgaXNcbiAgKiByZXR1cm5lZC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMgez9SYWMuUmF5fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5yYXlBdENhbnZhc0VkZ2UgPSBmdW5jdGlvbihtYXJnaW4gPSAwKSB7XG4gICAgY29uc3QgdHVybiA9IHRoaXMuYW5nbGUudHVybjtcbiAgICBjb25zdCBwNSA9IHRoaXMucmFjLmRyYXdlci5wNTtcblxuICAgIGNvbnN0IGRvd25FZGdlICA9IHA1LmhlaWdodCAtIG1hcmdpbjtcbiAgICBjb25zdCBsZWZ0RWRnZSAgPSBtYXJnaW47XG4gICAgY29uc3QgdXBFZGdlICAgID0gbWFyZ2luO1xuICAgIGNvbnN0IHJpZ2h0RWRnZSA9IHA1LndpZHRoIC0gbWFyZ2luO1xuXG4gICAgLy8gcG9pbnRpbmcgZG93blxuICAgIGlmICh0dXJuID49IDEvOCAmJiB0dXJuIDwgMy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55IDwgZG93bkVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChyaWdodEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5sZWZ0KTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKGxlZnRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUucmlnaHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyBsZWZ0XG4gICAgaWYgKHR1cm4gPj0gMy84ICYmIHR1cm4gPCA1LzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnggPj0gbGVmdEVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnkgPiBkb3duRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKGRvd25FZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUudXApO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueSA8IHVwRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKHVwRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmRvd24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyB1cFxuICAgIGlmICh0dXJuID49IDUvOCAmJiB0dXJuIDwgNy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55ID49IHVwRWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WSh1cEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5kb3duKTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIHJpZ2h0XG4gICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgIGlmICh0aGlzLnN0YXJ0LnggPCByaWdodEVkZ2UpIHtcbiAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueSA+IGRvd25FZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC55IDwgdXBFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkodXBFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUuZG93bik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVkZ2VSYXk7XG4gIH07XG5cbn0gLy8gYXR0YWNoUmF5RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoU2VnbWVudEZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDYWxscyBgcDUudmVydGV4YCB0byByZXByZXNlbnQgdGhpcyBgU2VnbWVudGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5TZWdtZW50LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICovXG4gIFJhYy5TZWdtZW50LnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXJ0UG9pbnQoKS52ZXJ0ZXgoKTtcbiAgICB0aGlzLmVuZFBvaW50KCkudmVydGV4KCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSB0b3Agb2YgdGhlIGNhbnZhcywgZnJvbSB0b3AtbGVmdCB0b1xuICAqIHRvcC1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzVG9wXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnRcbiAgKiB0byBib3R0b20tbGVmdC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzTGVmdFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNMZWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLXJpZ2h0XG4gICogdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGBpbnN0YW5jZS5TZWdtZW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNSaWdodFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHRvcFJpZ2h0ID0gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUud2lkdGgsIDApO1xuICAgIHJldHVybiB0b3BSaWdodFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5kb3duLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhcywgZnJvbVxuICAqIGJvdHRvbS1sZWZ0IHRvIGJvdHRvbS1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQm90dG9tXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc0JvdHRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBib3R0b21MZWZ0ID0gcmFjLlBvaW50KDAsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgICByZXR1cm4gYm90dG9tTGVmdFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuXG59IC8vIGF0dGFjaFNlZ21lbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbmZ1bmN0aW9uIHJldmVyc2VzVGV4dChhbmdsZSkge1xuICByZXR1cm4gYW5nbGUudHVybiA8IDMvNCAmJiBhbmdsZS50dXJuID49IDEvNDtcbn1cblxuXG5leHBvcnRzLmRlYnVnQW5nbGUgPSBmdW5jdGlvbihkcmF3ZXIsIGFuZ2xlLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG4gIGNvbnN0IGRpZ2l0cyA9ICAgICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIC8vIFplcm8gc2VnbWVudFxuICBwb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUuemVybywgbWFya2VyUmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gQW5nbGUgc2VnbWVudFxuICBsZXQgYW5nbGVTZWdtZW50ID0gcG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYW5nbGUsIG1hcmtlclJhZGl1cyAqIDEuNSk7XG4gIGFuZ2xlU2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhwb2ludFJhZGl1cywgYW5nbGUsIGFuZ2xlLmludmVyc2UoKSwgZmFsc2UpXG4gICAgLmRyYXcoKTtcbiAgYW5nbGVTZWdtZW50XG4gICAgLndpdGhMZW5ndGhBZGQocG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBNaW5pIGFyYyBtYXJrZXJzXG4gIGxldCBhbmdsZUFyYyA9IHBvaW50LmFyYyhtYXJrZXJSYWRpdXMsIHJhYy5BbmdsZS56ZXJvLCBhbmdsZSk7XG4gIGxldCBjb250ZXh0ID0gZHJhd2VyLnA1LmRyYXdpbmdDb250ZXh0O1xuICBsZXQgc3Ryb2tlV2VpZ2h0ID0gY29udGV4dC5saW5lV2lkdGg7XG4gIGNvbnRleHQuc2F2ZSgpOyB7XG4gICAgY29udGV4dC5saW5lQ2FwID0gJ2J1dHQnO1xuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzYsIDRdKTtcbiAgICAvLyBBbmdsZSBhcmNcbiAgICBhbmdsZUFyYy5kcmF3KCk7XG5cbiAgICBpZiAoIWFuZ2xlQXJjLmlzQ2lyY2xlKCkpIHtcbiAgICAgIC8vIE91dHNpZGUgYW5nbGUgYXJjXG4gICAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCA0XSk7XG4gICAgICBhbmdsZUFyY1xuICAgICAgICAud2l0aFJhZGl1cyhtYXJrZXJSYWRpdXMqMy80KVxuICAgICAgICAud2l0aENsb2Nrd2lzZShmYWxzZSlcbiAgICAgICAgLmRyYXcoKTtcbiAgICB9XG4gIH07XG4gIGNvbnRleHQucmVzdG9yZSgpO1xuXG4gIC8vIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IGZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsLmNlbnRlcixcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBmb3JtYXQgPSBmb3JtYXQuaW52ZXJzZSgpO1xuICB9XG5cbiAgLy8gVHVybiB0ZXh0XG4gIGxldCB0dXJuU3RyaW5nID0gYHR1cm46JHthbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBwb2ludFxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIG1hcmtlclJhZGl1cyoyKVxuICAgIC50ZXh0KHR1cm5TdHJpbmcsIGZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdBbmdsZVxuXG5cbmV4cG9ydHMuZGVidWdQb2ludCA9IGZ1bmN0aW9uKGRyYXdlciwgcG9pbnQsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICBwb2ludC5kcmF3KCk7XG5cbiAgLy8gUG9pbnQgbWFya2VyXG4gIHBvaW50LmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuXG4gIC8vIFBvaW50IHJldGljdWxlIG1hcmtlclxuICBsZXQgYXJjID0gcG9pbnRcbiAgICAuYXJjKG1hcmtlclJhZGl1cywgcmFjLkFuZ2xlLnMsIHJhYy5BbmdsZS5lKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDEvMilcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMS8yKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBzdHJpbmcgPSBgeDoke3BvaW50LngudG9GaXhlZChkaWdpdHMpfVxcbnk6JHtwb2ludC55LnRvRml4ZWQoZGlnaXRzKX1gO1xuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWwubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWwudG9wLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgcmFjLkFuZ2xlLmUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG4gIHBvaW50XG4gICAgLnBvaW50VG9BbmdsZShyYWMuQW5nbGUuc2UsIHBvaW50UmFkaXVzKjIpXG4gICAgLnRleHQoc3RyaW5nLCBmb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnUG9pbnRcblxuXG5leHBvcnRzLmRlYnVnUmF5ID0gZnVuY3Rpb24oZHJhd2VyLCByYXksIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9IGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG5cbiAgcmF5LmRyYXcoKTtcblxuICAvLyBMaXR0bGUgY2lyY2xlIGF0IHN0YXJ0IG1hcmtlclxuICByYXkuc3RhcnQuYXJjKHBvaW50UmFkaXVzKS5kcmF3KCk7XG5cbiAgLy8gSGFsZiBjaXJjbGUgYXQgc3RhcnRcbiAgY29uc3QgcGVycEFuZ2xlID0gcmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgY29uc3Qgc3RhcnRBcmMgPSByYXkuc3RhcnRcbiAgICAuYXJjKG1hcmtlclJhZGl1cywgcGVycEFuZ2xlLCBwZXJwQW5nbGUuaW52ZXJzZSgpKVxuICAgIC5kcmF3KCk7XG4gIHN0YXJ0QXJjLnN0YXJ0U2VnbWVudCgpLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG4gIHN0YXJ0QXJjLmVuZFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIEVkZ2UgZW5kIGhhbGYgY2lyY2xlXG4gIGNvbnN0IGVkZ2VSYXkgPSByYXkucmF5QXRDYW52YXNFZGdlKCk7XG4gIGlmIChlZGdlUmF5ICE9IG51bGwpIHtcbiAgICBjb25zdCBlZGdlQXJjID0gZWRnZVJheVxuICAgICAgLnRyYW5zbGF0ZVRvRGlzdGFuY2UocG9pbnRSYWRpdXMpXG4gICAgICAucGVycGVuZGljdWxhcihmYWxzZSlcbiAgICAgIC5hcmNUb0FuZ2xlRGlzdGFuY2UobWFya2VyUmFkaXVzLzIsIDAuNSlcbiAgICAgIC5kcmF3KCk7XG4gICAgZWRnZUFyYy5zdGFydFNlZ21lbnQoKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgICAuZHJhdygpO1xuICAgIGVkZ2VBcmMuZW5kU2VnbWVudCgpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gICAgZWRnZUFyYy5yYWRpdXNTZWdtZW50QXRBbmdsZShlZGdlUmF5LmFuZ2xlKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGNvbnN0IGFuZ2xlICA9IHJheS5hbmdsZTtcbiAgY29uc3QgaEZvcm1hdCA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsO1xuICBjb25zdCB2Rm9ybWF0ID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsO1xuICBjb25zdCBmb250ICAgPSBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250O1xuICBjb25zdCBzaXplICAgPSBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplO1xuICBjb25zdCBkaWdpdHMgPSBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IHN0YXJ0Rm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChyYWMsXG4gICAgaEZvcm1hdC5sZWZ0LCB2Rm9ybWF0LmJvdHRvbSxcbiAgICBmb250LCBhbmdsZSwgc2l6ZSk7XG4gIGxldCBhbmdsZUZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLFxuICAgIGhGb3JtYXQubGVmdCwgdkZvcm1hdC50b3AsXG4gICAgZm9udCwgYW5nbGUsIHNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBzdGFydEZvcm1hdCA9IHN0YXJ0Rm9ybWF0LmludmVyc2UoKTtcbiAgICBhbmdsZUZvcm1hdCA9IGFuZ2xlRm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IHRleHRcbiAgY29uc3Qgc3RhcnRTdHJpbmcgPSBgc3RhcnQ6KCR7cmF5LnN0YXJ0LngudG9GaXhlZChkaWdpdHMpfSwke3JheS5zdGFydC55LnRvRml4ZWQoZGlnaXRzKX0pYDtcbiAgcmF5LnN0YXJ0XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5zdWJ0cmFjdCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChzdGFydFN0cmluZywgc3RhcnRGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAvLyBBbmdsZSB0ZXh0XG4gIGNvbnN0IGFuZ2xlU3RyaW5nID0gYGFuZ2xlOiR7YW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgcmF5LnN0YXJ0XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5hZGQoMS80KSwgbWFya2VyUmFkaXVzLzIpXG4gICAgLnRleHQoYW5nbGVTdHJpbmcsIGFuZ2xlRm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1JheVxuXG5cbmV4cG9ydHMuZGVidWdTZWdtZW50ID0gZnVuY3Rpb24oZHJhd2VyLCBzZWdtZW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgc2VnbWVudC5kcmF3KCk7XG5cbiAgLy8gTGl0dGxlIGNpcmNsZSBhdCBzdGFydCBtYXJrZXJcbiAgc2VnbWVudC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgIC5hcmMoKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gSGFsZiBjaXJjbGUgc3RhcnQgc2VnbWVudFxuICBsZXQgcGVycEFuZ2xlID0gc2VnbWVudC5hbmdsZSgpLnBlcnBlbmRpY3VsYXIoKTtcbiAgbGV0IGFyYyA9IHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHBlcnBBbmdsZSwgcGVycEFuZ2xlLmludmVyc2UoKSlcbiAgICAuZHJhdygpO1xuICBhcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgYXJjLmVuZFNlZ21lbnQoKVxuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIFBlcnBlbmRpY3VsYXIgZW5kIG1hcmtlclxuICBsZXQgZW5kTWFya2VyU3RhcnQgPSBzZWdtZW50XG4gICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcigpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtcG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcbiAgbGV0IGVuZE1hcmtlckVuZCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGZhbHNlKVxuICAgIC53aXRoTGVuZ3RoKG1hcmtlclJhZGl1cy8yKVxuICAgIC53aXRoU3RhcnRFeHRlbnNpb24oLXBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG4gIC8vIExpdHRsZSBlbmQgaGFsZiBjaXJjbGVcbiAgc2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhwb2ludFJhZGl1cywgZW5kTWFya2VyU3RhcnQuYW5nbGUoKSwgZW5kTWFya2VyRW5kLmFuZ2xlKCkpXG4gICAgLmRyYXcoKTtcblxuICAvLyBGb3JtaW5nIGVuZCBhcnJvd1xuICBsZXQgYXJyb3dBbmdsZVNoaWZ0ID0gcmFjLkFuZ2xlLmZyb20oMS83KTtcbiAgbGV0IGVuZEFycm93U3RhcnQgPSBlbmRNYXJrZXJTdGFydFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgZmFsc2UpO1xuICBsZXQgZW5kQXJyb3dFbmQgPSBlbmRNYXJrZXJFbmRcbiAgICAucmV2ZXJzZSgpXG4gICAgLnJheS53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlU2hpZnQsIHRydWUpO1xuICBsZXQgZW5kQXJyb3dQb2ludCA9IGVuZEFycm93U3RhcnRcbiAgICAucG9pbnRBdEludGVyc2VjdGlvbihlbmRBcnJvd0VuZCk7XG4gIC8vIEVuZCBhcnJvd1xuICBlbmRNYXJrZXJTdGFydFxuICAgIC5uZXh0U2VnbWVudFRvUG9pbnQoZW5kQXJyb3dQb2ludClcbiAgICAuZHJhdygpXG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRNYXJrZXJFbmQuZW5kUG9pbnQoKSlcbiAgICAuZHJhdygpO1xuXG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBhbmdsZSA9IHNlZ21lbnQuYW5nbGUoKTtcbiAgLy8gTm9ybWFsIG9yaWVudGF0aW9uXG4gIGxldCBsZW5ndGhGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbC5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbC5ib3R0b20sXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IGFuZ2xlRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWwubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWwudG9wLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgYW5nbGUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG4gIGlmIChyZXZlcnNlc1RleHQoYW5nbGUpKSB7XG4gICAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICAgIGxlbmd0aEZvcm1hdCA9IGxlbmd0aEZvcm1hdC5pbnZlcnNlKCk7XG4gICAgYW5nbGVGb3JtYXQgPSBhbmdsZUZvcm1hdC5pbnZlcnNlKCk7XG4gIH1cblxuICAvLyBMZW5ndGhcbiAgbGV0IGxlbmd0aFN0cmluZyA9IGBsZW5ndGg6JHtzZWdtZW50Lmxlbmd0aC50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgc2VnbWVudC5zdGFydFBvaW50KClcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLnN1YnRyYWN0KDEvNCksIG1hcmtlclJhZGl1cy8yKVxuICAgIC50ZXh0KGxlbmd0aFN0cmluZywgbGVuZ3RoRm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG5cbiAgICAvLyBBbmdsZVxuICBsZXQgYW5nbGVTdHJpbmcgPSBgYW5nbGU6JHthbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIHBvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuYWRkKDEvNCksIG1hcmtlclJhZGl1cy8yKVxuICAgIC50ZXh0KGFuZ2xlU3RyaW5nLCBhbmdsZUZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdTZWdtZW50XG5cblxuZXhwb3J0cy5kZWJ1Z0FyYyA9IGZ1bmN0aW9uKGRyYXdlciwgYXJjLCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgYXJjLmRyYXcoKTtcblxuICAvLyBDZW50ZXIgbWFya2Vyc1xuICBsZXQgY2VudGVyQXJjUmFkaXVzID0gbWFya2VyUmFkaXVzICogMi8zO1xuICBpZiAoYXJjLnJhZGl1cyA+IG1hcmtlclJhZGl1cy8zICYmIGFyYy5yYWRpdXMgPCBtYXJrZXJSYWRpdXMpIHtcbiAgICAvLyBJZiByYWRpdXMgaXMgdG8gY2xvc2UgdG8gdGhlIGNlbnRlci1hcmMgbWFya2Vyc1xuICAgIC8vIE1ha2UgdGhlIGNlbnRlci1hcmMgYmUgb3V0c2lkZSBvZiB0aGUgYXJjXG4gICAgY2VudGVyQXJjUmFkaXVzID0gYXJjLnJhZGl1cyArIG1hcmtlclJhZGl1cy8zO1xuICB9XG5cbiAgLy8gQ2VudGVyIHN0YXJ0IHNlZ21lbnRcbiAgbGV0IGNlbnRlckFyYyA9IGFyYy53aXRoUmFkaXVzKGNlbnRlckFyY1JhZGl1cyk7XG4gIGNlbnRlckFyYy5zdGFydFNlZ21lbnQoKS5kcmF3KCk7XG5cbiAgLy8gUmFkaXVzXG4gIGxldCByYWRpdXNNYXJrZXJMZW5ndGggPSBhcmMucmFkaXVzXG4gICAgLSBjZW50ZXJBcmNSYWRpdXNcbiAgICAtIG1hcmtlclJhZGl1cy8yXG4gICAgLSBwb2ludFJhZGl1cyoyO1xuICBpZiAocmFkaXVzTWFya2VyTGVuZ3RoID4gMCkge1xuICAgIGFyYy5zdGFydFNlZ21lbnQoKVxuICAgICAgLndpdGhMZW5ndGgocmFkaXVzTWFya2VyTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGNlbnRlckFyY1JhZGl1cyArIHBvaW50UmFkaXVzKjIpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gTWluaSBhcmMgbWFya2Vyc1xuICBsZXQgY29udGV4dCA9IGRyYXdlci5wNS5kcmF3aW5nQ29udGV4dDtcbiAgbGV0IHN0cm9rZVdlaWdodCA9IGNvbnRleHQubGluZVdpZHRoO1xuICBjb250ZXh0LnNhdmUoKTsge1xuICAgIGNvbnRleHQubGluZUNhcCA9ICdidXR0JztcbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFs2LCA0XSk7XG4gICAgY2VudGVyQXJjLmRyYXcoKTtcblxuICAgIGlmICghY2VudGVyQXJjLmlzQ2lyY2xlKCkpIHtcbiAgICAgIC8vIE91dHNpZGUgYW5nbGUgYXJjXG4gICAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCA0XSk7XG4gICAgICBjZW50ZXJBcmNcbiAgICAgICAgLndpdGhDbG9ja3dpc2UoIWNlbnRlckFyYy5jbG9ja3dpc2UpXG4gICAgICAgIC5kcmF3KCk7XG4gICAgfVxuICB9O1xuICBjb250ZXh0LnJlc3RvcmUoKTtcblxuICAvLyBDZW50ZXIgZW5kIHNlZ21lbnRcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGNlbnRlckFyYy5lbmRTZWdtZW50KCkucmV2ZXJzZSgpLndpdGhMZW5ndGhSYXRpbygxLzIpLmRyYXcoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IHBvaW50IG1hcmtlclxuICBsZXQgc3RhcnRQb2ludCA9IGFyYy5zdGFydFBvaW50KCk7XG4gIHN0YXJ0UG9pbnRcbiAgICAuYXJjKHBvaW50UmFkaXVzKS5kcmF3KCk7XG4gIHN0YXJ0UG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtbWFya2VyUmFkaXVzLzIpXG4gICAgLmRyYXcoKTtcblxuICAvLyBPcmllbnRhdGlvbiBtYXJrZXJcbiAgbGV0IG9yaWVudGF0aW9uTGVuZ3RoID0gbWFya2VyUmFkaXVzKjI7XG4gIGxldCBvcmllbnRhdGlvbkFyYyA9IGFyY1xuICAgIC5zdGFydFNlZ21lbnQoKVxuICAgIC53aXRoTGVuZ3RoQWRkKG1hcmtlclJhZGl1cylcbiAgICAuYXJjKG51bGwsIGFyYy5jbG9ja3dpc2UpXG4gICAgLndpdGhMZW5ndGgob3JpZW50YXRpb25MZW5ndGgpXG4gICAgLmRyYXcoKTtcbiAgbGV0IGFycm93Q2VudGVyID0gb3JpZW50YXRpb25BcmNcbiAgICAucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLmNob3JkU2VnbWVudCgpO1xuICBsZXQgYXJyb3dBbmdsZSA9IDMvMzI7XG4gIGFycm93Q2VudGVyLndpdGhBbmdsZVNoaWZ0KC1hcnJvd0FuZ2xlKS5kcmF3KCk7XG4gIGFycm93Q2VudGVyLndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGUpLmRyYXcoKTtcblxuICAvLyBJbnRlcm5hbCBlbmQgcG9pbnQgbWFya2VyXG4gIGxldCBlbmRQb2ludCA9IGFyYy5lbmRQb2ludCgpO1xuICBsZXQgaW50ZXJuYWxMZW5ndGggPSBNYXRoLm1pbihtYXJrZXJSYWRpdXMvMiwgYXJjLnJhZGl1cyk7XG4gIGludGVybmFsTGVuZ3RoIC09IHBvaW50UmFkaXVzO1xuICBpZiAoaW50ZXJuYWxMZW5ndGggPiByYWMuZXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICBlbmRQb2ludFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5lbmQuaW52ZXJzZSgpLCBpbnRlcm5hbExlbmd0aClcbiAgICAgIC50cmFuc2xhdGVUb0xlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBFeHRlcm5hbCBlbmQgcG9pbnQgbWFya2VyXG4gIGxldCB0ZXh0Sm9pblRocmVzaG9sZCA9IG1hcmtlclJhZGl1cyozO1xuICBsZXQgbGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA9IG9yaWVudGF0aW9uQXJjXG4gICAgLndpdGhFbmQoYXJjLmVuZClcbiAgICAubGVuZ3RoKCk7XG4gIGxldCBleHRlcm5hbExlbmd0aCA9IGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPiB0ZXh0Sm9pblRocmVzaG9sZCAmJiBkcmF3c1RleHQgPT09IHRydWVcbiAgICA/IG1hcmtlclJhZGl1cyAtIHBvaW50UmFkaXVzXG4gICAgOiBtYXJrZXJSYWRpdXMvMiAtIHBvaW50UmFkaXVzO1xuXG4gIGVuZFBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5lbmQsIGV4dGVybmFsTGVuZ3RoKVxuICAgIC50cmFuc2xhdGVUb0xlbmd0aChwb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIEVuZCBwb2ludCBsaXR0bGUgYXJjXG4gIGlmICghYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBlbmRQb2ludFxuICAgICAgLmFyYyhwb2ludFJhZGl1cywgYXJjLmVuZCwgYXJjLmVuZC5pbnZlcnNlKCksIGFyYy5jbG9ja3dpc2UpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBoRm9ybWF0ID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWw7XG4gIGxldCB2Rm9ybWF0ID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsO1xuXG4gIGxldCBoZWFkVmVydGljYWwgPSBhcmMuY2xvY2t3aXNlXG4gICAgPyB2Rm9ybWF0LnRvcFxuICAgIDogdkZvcm1hdC5ib3R0b207XG4gIGxldCB0YWlsVmVydGljYWwgPSBhcmMuY2xvY2t3aXNlXG4gICAgPyB2Rm9ybWF0LmJvdHRvbVxuICAgIDogdkZvcm1hdC50b3A7XG4gIGxldCByYWRpdXNWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZGb3JtYXQuYm90dG9tXG4gICAgOiB2Rm9ybWF0LnRvcDtcblxuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IGhlYWRGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBoRm9ybWF0LmxlZnQsXG4gICAgaGVhZFZlcnRpY2FsLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgYXJjLnN0YXJ0LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgdGFpbEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhGb3JtYXQubGVmdCxcbiAgICB0YWlsVmVydGljYWwsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhcmMuZW5kLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgcmFkaXVzRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgaEZvcm1hdC5sZWZ0LFxuICAgIHJhZGl1c1ZlcnRpY2FsLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgYXJjLnN0YXJ0LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuXG4gIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgaWYgKHJldmVyc2VzVGV4dChhcmMuc3RhcnQpKSB7XG4gICAgaGVhZEZvcm1hdCA9IGhlYWRGb3JtYXQuaW52ZXJzZSgpO1xuICAgIHJhZGl1c0Zvcm1hdCA9IHJhZGl1c0Zvcm1hdC5pbnZlcnNlKCk7XG4gIH1cbiAgaWYgKHJldmVyc2VzVGV4dChhcmMuZW5kKSkge1xuICAgIHRhaWxGb3JtYXQgPSB0YWlsRm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIGxldCBzdGFydFN0cmluZyA9IGBzdGFydDoke2FyYy5zdGFydC50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBsZXQgcmFkaXVzU3RyaW5nID0gYHJhZGl1czoke2FyYy5yYWRpdXMudG9GaXhlZChkaWdpdHMpfWA7XG4gIGxldCBlbmRTdHJpbmcgPSBgZW5kOiR7YXJjLmVuZC50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuXG4gIGxldCBhbmdsZURpc3RhbmNlID0gYXJjLmFuZ2xlRGlzdGFuY2UoKTtcbiAgbGV0IGRpc3RhbmNlU3RyaW5nID0gYGRpc3RhbmNlOiR7YW5nbGVEaXN0YW5jZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuXG4gIGxldCB0YWlsU3RyaW5nID0gYCR7ZGlzdGFuY2VTdHJpbmd9XFxuJHtlbmRTdHJpbmd9YDtcbiAgbGV0IGhlYWRTdHJpbmc7XG5cbiAgLy8gUmFkaXVzIGxhYmVsXG4gIGlmIChhbmdsZURpc3RhbmNlLnR1cm4gPD0gMy80ICYmICFhcmMuaXNDaXJjbGUoKSkge1xuICAgIC8vIFJhZGl1cyBkcmF3biBzZXBhcmF0ZWx5XG4gICAgbGV0IHBlcnBBbmdsZSA9IGFyYy5zdGFydC5wZXJwZW5kaWN1bGFyKCFhcmMuY2xvY2t3aXNlKTtcbiAgICBhcmMuY2VudGVyXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzKVxuICAgICAgLnBvaW50VG9BbmdsZShwZXJwQW5nbGUsIHBvaW50UmFkaXVzKjIpXG4gICAgICAudGV4dChyYWRpdXNTdHJpbmcsIHJhZGl1c0Zvcm1hdClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gICAgaGVhZFN0cmluZyA9IHN0YXJ0U3RyaW5nO1xuICB9IGVsc2Uge1xuICAgIC8vIFJhZGl1cyBqb2luZWQgdG8gaGVhZFxuICAgIGhlYWRTdHJpbmcgPSBgJHtzdGFydFN0cmluZ31cXG4ke3JhZGl1c1N0cmluZ31gO1xuICB9XG5cbiAgaWYgKGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPiB0ZXh0Sm9pblRocmVzaG9sZCkge1xuICAgIC8vIERyYXcgc3RyaW5ncyBzZXBhcmF0ZWx5XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzLzIpXG4gICAgICAudGV4dChoZWFkU3RyaW5nLCBoZWFkRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgICBvcmllbnRhdGlvbkFyYy5wb2ludEF0QW5nbGUoYXJjLmVuZClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLmVuZCwgbWFya2VyUmFkaXVzLzIpXG4gICAgICAudGV4dCh0YWlsU3RyaW5nLCB0YWlsRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBEcmF3IHN0cmluZ3MgdG9nZXRoZXJcbiAgICBsZXQgYWxsU3RyaW5ncyA9IGAke2hlYWRTdHJpbmd9XFxuJHt0YWlsU3RyaW5nfWA7XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzLzIpXG4gICAgICAudGV4dChhbGxTdHJpbmdzLCBoZWFkRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfVxufTsgLy8gZGVidWdBcmNcblxuXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIEJlemllclxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBDb21wb3NpdGVcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgU2hhcGVcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgVGV4dFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuZXhwb3J0cy5kcmF3UG9pbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHBvaW50KSB7XG4gIGRyYXdlci5wNS5wb2ludChwb2ludC54LCBwb2ludC55KTtcbn07IC8vIGRyYXdQb2ludFxuXG5cbmV4cG9ydHMuZHJhd1JheSA9IGZ1bmN0aW9uKGRyYXdlciwgcmF5KSB7XG4gIGxldCBlZGdlUG9pbnQgPSByYXkucG9pbnRBdENhbnZhc0VkZ2UoKTtcblxuICBpZiAoZWRnZVBvaW50ID09PSBudWxsKSB7XG4gICAgLy8gUmF5IGlzIG91dHNpZGUgY2FudmFzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZHJhd2VyLnA1LmxpbmUoXG4gICAgcmF5LnN0YXJ0LngsIHJheS5zdGFydC55LFxuICAgIGVkZ2VQb2ludC54LCBlZGdlUG9pbnQueSk7XG59OyAvLyBkcmF3UmF5XG5cblxuZXhwb3J0cy5kcmF3U2VnbWVudCA9IGZ1bmN0aW9uKGRyYXdlciwgc2VnbWVudCkge1xuICBjb25zdCBzdGFydCA9IHNlZ21lbnQucmF5LnN0YXJ0O1xuICBjb25zdCBlbmQgPSBzZWdtZW50LmVuZFBvaW50KCk7XG4gIGRyYXdlci5wNS5saW5lKFxuICAgIHN0YXJ0LngsIHN0YXJ0LnksXG4gICAgZW5kLngsICAgZW5kLnkpO1xufTsgLy8gZHJhd1NlZ21lbnRcblxuXG5leHBvcnRzLmRyYXdBcmMgPSBmdW5jdGlvbihkcmF3ZXIsIGFyYykge1xuICBpZiAoYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBsZXQgc3RhcnRSYWQgPSBhcmMuc3RhcnQucmFkaWFucygpO1xuICAgIGxldCBlbmRSYWQgPSBzdGFydFJhZCArIFJhYy5UQVU7XG4gICAgZHJhd2VyLnA1LmFyYyhcbiAgICAgIGFyYy5jZW50ZXIueCwgYXJjLmNlbnRlci55LFxuICAgICAgYXJjLnJhZGl1cyAqIDIsIGFyYy5yYWRpdXMgKiAyLFxuICAgICAgc3RhcnRSYWQsIGVuZFJhZCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHN0YXJ0ID0gYXJjLnN0YXJ0O1xuICBsZXQgZW5kID0gYXJjLmVuZDtcbiAgaWYgKCFhcmMuY2xvY2t3aXNlKSB7XG4gICAgc3RhcnQgPSBhcmMuZW5kO1xuICAgIGVuZCA9IGFyYy5zdGFydDtcbiAgfVxuXG4gIGRyYXdlci5wNS5hcmMoXG4gICAgYXJjLmNlbnRlci54LCBhcmMuY2VudGVyLnksXG4gICAgYXJjLnJhZGl1cyAqIDIsIGFyYy5yYWRpdXMgKiAyLFxuICAgIHN0YXJ0LnJhZGlhbnMoKSwgZW5kLnJhZGlhbnMoKSk7XG59OyAvLyBkcmF3QXJjXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb2xvciB3aXRoIFJCR0EgdmFsdWVzLCBlYWNoIG9uZSBvbiB0aGUgKlswLDFdKiByYW5nZS5cbipcbiogQGFsaWFzIFJhYy5Db2xvclxuKi9cbmNsYXNzIENvbG9yIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gYiAtIFRoZSBibHVlIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IFthPTFdIC0gVGhlIGFscGhhIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgciwgZywgYiwgYSA9IDEpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCByLCBnLCBiLCBhKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIociwgZywgYiwgYSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIHJlZCBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5yID0gcjtcblxuICAgIC8qKlxuICAgICogVGhlIGdyZWVuIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmcgPSBnO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYmx1ZSBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5iID0gYjtcblxuICAgIC8qKlxuICAgICogVGhlIGFscGhhIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmEgPSBhO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgQ29sb3IoJHt0aGlzLnJ9LCR7dGhpcy5nfSwke3RoaXMuYn0sJHt0aGlzLmF9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSB3aXRoIGVhY2ggY2hhbm5lbCByZWNlaXZlZCBpbiB0aGVcbiAgKiAqWzAsMjU1XSogcmFuZ2VcbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gciAtIFRoZSByZWQgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gYiAtIFRoZSBibHVlIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gW2E9MjU1XSAtIFRoZSBhbHBoYSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICBzdGF0aWMgZnJvbVJnYmEocmFjLCByLCBnLCBiLCBhID0gMjU1KSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcihyYWMsIHIvMjU1LCBnLzI1NSwgYi8yNTUsIGEvMjU1KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlIGZyb20gYSBoZXhhZGVjaW1hbCB0cmlwbGV0IHN0cmluZy5cbiAgKlxuICAqIFRoZSBgaGV4U3RyaW5nYCBpcyBleHBlY3RlZCB0byBoYXZlIDYgZGlnaXRzIGFuZCBjYW4gb3B0aW9uYWxseSBzdGFydFxuICAqIHdpdGggYCNgLiBgQUFCQkNDYCBhbmQgYCNEREVFRkZgIGFyZSBib3RoIHZhbGlkIGlucHV0cywgdGhlIHRocmVlIGRpZ2l0XG4gICogc2hvcnRoYW5kIGlzIG5vdCB5ZXQgc3VwcG9ydGVkLlxuICAqXG4gICogQW4gZXJyb3IgaXMgdGhyb3duIGlmIGBoZXhTdHJpbmdgIGlzIG1pc2Zvcm1hdHRlZCBvciBjYW5ub3QgYmUgcGFyc2VkLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHJpbmcgLSBUaGUgUkdCIGhleCB0cmlwbGV0IHRvIGludGVycHJldFxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgc3RhdGljIGZyb21IZXgocmFjLCBoZXhTdHJpbmcpIHtcbiAgICBpZiAoaGV4U3RyaW5nLmNoYXJBdCgwKSA9PSAnIycpIHtcbiAgICAgIGhleFN0cmluZyA9IGhleFN0cmluZy5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgaWYgKGhleFN0cmluZy5sZW5ndGggIT0gNikge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBVbmV4cGVjdGVkIGxlbmd0aCBmb3IgaGV4IHRyaXBsZXQgc3RyaW5nOiAke2hleFN0cmluZ31gKTtcbiAgICB9XG5cbiAgICBsZXQgclN0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoMCwgMik7XG4gICAgbGV0IGdTdHIgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDIsIDQpO1xuICAgIGxldCBiU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZyg0LCA2KTtcblxuICAgIGxldCBuZXdSID0gcGFyc2VJbnQoclN0ciwgMTYpO1xuICAgIGxldCBuZXdHID0gcGFyc2VJbnQoZ1N0ciwgMTYpO1xuICAgIGxldCBuZXdCID0gcGFyc2VJbnQoYlN0ciwgMTYpO1xuXG4gICAgaWYgKGlzTmFOKG5ld1IpIHx8IGlzTmFOKG5ld0cpIHx8IGlzTmFOKG5ld0IpKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYENvdWxkIG5vdCBwYXJzZSBoZXggdHJpcGxldCBzdHJpbmc6ICR7aGV4U3RyaW5nfWApO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQ29sb3IocmFjLCBuZXdSLzI1NSwgbmV3Ry8yNTUsIG5ld0IvMjU1KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgRmlsbGAgdGhhdCB1c2VzIGB0aGlzYCBhcyBgY29sb3JgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqL1xuICBmaWxsKCkge1xuICAgIHJldHVybiBuZXcgUmFjLkZpbGwodGhpcy5yYWMsIHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHRoYXQgdXNlcyBgdGhpc2AgYXMgYGNvbG9yYC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gd2VpZ2h0IC0gVGhlIHdlaWdodCBvZiB0aGUgbmV3IGBTdHJva2VgXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHN0cm9rZSh3ZWlnaHQgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMucmFjLCB3ZWlnaHQsIHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgd2l0aCBgYWAgc2V0IHRvIGBuZXdBbHBoYWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3QWxwaGEgLSBUaGUgYWxwaGEgY2hhbm5lbCBmb3IgdGhlIG5ldyBgQ29sb3JgLCBpbiB0aGVcbiAgKiAgICpbMCwxXSogcmFuZ2VcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICB3aXRoQWxwaGEobmV3QWxwaGEpIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCB0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCBuZXdBbHBoYSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGBhYCBzZXQgdG8gYHRoaXMuYSAqIHJhdGlvYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGFgIGJ5XG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgd2l0aEFscGhhUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCB0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmEgKiByYXRpbyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCBpbiB0aGUgbGluZWFyIHRyYW5zaXRpb24gYmV0d2VlbiBgdGhpc2AgYW5kXG4gICogYHRhcmdldGAgYXQgYSBgcmF0aW9gIGluIHRoZSByYW5nZSAqWzAsMV0qLlxuICAqXG4gICogV2hlbiBgcmF0aW9gIGlzIGAwYCBvciBsZXNzIHRoZSBuZXcgYENvbG9yYCBpcyBlcXVpdmFsZW50IHRvIGB0aGlzYCxcbiAgKiB3aGVuIGByYXRpb2AgaXMgYDFgIG9yIGxhcmdlciB0aGUgbmV3IGBDb2xvcmAgaXMgZXF1aXZhbGVudCB0b1xuICAqIGB0YXJnZXRgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIHRyYW5zaXRpb24gcmF0aW8gZm9yIHRoZSBuZXcgYENvbG9yYFxuICAqIEBwYXJhbSB7UmFjLkNvbG9yfSB0YXJnZXQgLSBUaGUgdHJhbnNpdGlvbiB0YXJnZXQgYENvbG9yYFxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIGxpbmVhclRyYW5zaXRpb24ocmF0aW8sIHRhcmdldCkge1xuICAgIHJhdGlvID0gTWF0aC5tYXgocmF0aW8sIDApO1xuICAgIHJhdGlvID0gTWF0aC5taW4ocmF0aW8sIDEpO1xuXG4gICAgbGV0IG5ld1IgPSB0aGlzLnIgKyAodGFyZ2V0LnIgLSB0aGlzLnIpICogcmF0aW87XG4gICAgbGV0IG5ld0cgPSB0aGlzLmcgKyAodGFyZ2V0LmcgLSB0aGlzLmcpICogcmF0aW87XG4gICAgbGV0IG5ld0IgPSB0aGlzLmIgKyAodGFyZ2V0LmIgLSB0aGlzLmIpICogcmF0aW87XG4gICAgbGV0IG5ld0EgPSB0aGlzLmEgKyAodGFyZ2V0LmEgLSB0aGlzLmEpICogcmF0aW87XG5cbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCBuZXdSLCBuZXdHLCBuZXdCLCBuZXdBKTtcbiAgfVxuXG59IC8vIGNsYXNzIENvbG9yXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcjtcblxuIiwiICAndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRmlsbCBbY29sb3Jde0BsaW5rIFJhYy5Db2xvcn0gZm9yIGRyYXdpbmcuXG4qXG4qIENhbiBiZSB1c2VkIGFzIGBmaWxsLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBmaWxsIHNldHRpbmdzIGdsb2JhbGx5LCBvciBhc1xuKiB0aGUgcGFyYW1ldGVyIG9mIGBkcmF3YWJsZS5kcmF3KGZpbGwpYCB0byBhcHBseSB0aGUgZmlsbCBvbmx5IGZvciB0aGF0XG4qIGBkcmF3YC5cbipcbiogV2hlbiBgY29sb3JgIGlzIGBudWxsYCBhICpuby1maWxsKiBzZXR0aW5nIGlzIGFwcGxpZWQuXG4qXG4qIEBhbGlhcyBSYWMuRmlsbFxuKi9cbmNsYXNzIEZpbGwge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEZpbGxgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gY29sb3IgLSBBIGBDb2xvcmAgZm9yIHRoZSBmaWxsIHNldHRpbmcsIG9yIGBudWxsYFxuICAqICAgdG8gYXBwbHkgYSAqbm8tZmlsbCogc2V0dGluZ1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIGNvbG9yKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgY29sb3IgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQ29sb3IsIGNvbG9yKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBGaWxsYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEZpbGxgLCByZXR1cm5zIHRoYXQgc2FtZSBvYmplY3QuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBDb2xvcmAsIHJldHVybnMgYSBuZXcgYEZpbGxgXG4gICogICB1c2luZyBgc29tZXRoaW5nYCBhcyBgY29sb3JgLlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgU3Ryb2tlYCwgcmV0dXJucyBhIG5ldyBgRmlsbGBcbiAgKiAgIHVzaW5nIGBzdHJva2UuY29sb3JgLlxuICAqICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLkZpbGx8UmFjLkNvbG9yfFJhYy5TdHJva2V9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqIGRlcml2ZSBhIGBGaWxsYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqL1xuICBzdGF0aWMgZnJvbShyYWMsIHNvbWV0aGluZykge1xuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBGaWxsKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkNvbG9yKSB7XG4gICAgICByZXR1cm4gbmV3IEZpbGwocmFjLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlN0cm9rZSkge1xuICAgICAgcmV0dXJuIG5ldyBGaWxsKHJhYywgc29tZXRoaW5nLmNvbG9yKTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLkZpbGwgLSBzb21ldGhpbmctdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWV0aGluZyl9YCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIG9ubHkgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgY29udGFpbmVyKCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpc10pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIGBzdHlsZWAuIFdoZW5cbiAgKiBgc3R5bGVgIGlzIGBudWxsYCwgcmV0dXJucyBgdGhpc2AgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfSBzdHlsZSAtIEEgc3R5bGUgb2JqZWN0XG4gICogICB0byBjb250YWluIGFsb25nIGB0aGlzYFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ8UmFjLkZpbGx9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHlsZV0pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIHRoZSBgU3Ryb2tlYFxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5TdHJva2UuZnJvbX0gYHNvbWVTdHJva2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuU3Ryb2tlfFJhYy5Db2xvcnxSYWMuRmlsbH0gc29tZVN0cm9rZSAtIEFuIG9iamVjdCB0byBkZXJpdmVcbiAgKiAgIGEgYFN0cm9rZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICpcbiAgKiBAc2VlIFJhYy5TdHJva2UuZnJvbVxuICAqL1xuICBhcHBlbmRTdHJva2Uoc29tZVN0cm9rZSkge1xuICAgIGxldCBzdHJva2UgPSBSYWMuU3Ryb2tlLmZyb20odGhpcy5yYWMsIHNvbWVTdHJva2UpO1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpcywgc3Ryb2tlXSk7XG4gIH1cblxufSAvLyBjbGFzcyBGaWxsXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxsO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogU3Ryb2tlIHdlaWdodCBhbmQgW2NvbG9yXXtAbGluayBSYWMuQ29sb3J9IGZvciBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgc3Ryb2tlLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBzdHJva2Ugc2V0dGluZ3MgZ2xvYmFsbHksIG9yXG4qIGFzIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoc3Ryb2tlKWAgdG8gYXBwbHkgdGhlIHN0cm9rZSBvbmx5IGZvclxuKiB0aGF0IGBkcmF3YC5cbipcbiogVGhlIGluc3RhbmNlIGFwcGxpZXMgdGhlIHN0cm9rZSBjb2xvciBhbmQgd2VpZ2h0IHNldHRpbmdzIGluIHRoZVxuKiBmb2xsb3dpbmcgY29tYmluYXRpb25zOlxuKiArIHdoZW4gYGNvbG9yID0gbnVsbGAgYW5kIGB3ZWlnaHQgPSBudWxsYDogYSAqbm8tc3Ryb2tlKiBzZXR0aW5nIGlzXG4qICAgYXBwbGllZFxuKiArIHdoZW4gYGNvbG9yYCBpcyBzZXQgYW5kIGB3ZWlnaHQgPSBudWxsYDogb25seSB0aGUgc3Ryb2tlIGNvbG9yIGlzXG4qICAgYXBwbGllZCwgc3Ryb2tlIHdlaWdodCBpcyBub3QgbW9kaWZpZWRcbiogKyB3aGVuIGB3ZWlnaHRgIGlzIHNldCBhbmQgYGNvbG9yID0gbnVsbGA6IG9ubHkgdGhlIHN0cm9rZSB3ZWlnaHQgaXNcbiogICBhcHBsaWVkLCBzdHJva2UgY29sb3IgaXMgbm90IG1vZGlmaWVkXG4qICsgd2hlbiBib3RoIGBjb2xvcmAgYW5kIGB3ZWlnaHRgIGFyZSBzZXQ6IGJvdGggc3Ryb2tlIGNvbG9yIGFuZCB3ZWlnaHRcbiogICBhcmUgYXBwbGllZFxuKlxuKiBAYWxpYXMgUmFjLlN0cm9rZVxuKi9cbmNsYXNzIFN0cm9rZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgU3Ryb2tlYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHs/bnVtYmVyfSB3ZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwIHdlaWdodFxuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gW2NvbG9yPW51bGxdIC0gQSBgQ29sb3JgIGZvciB0aGUgc3Ryb2tlLCBvciBgbnVsbGBcbiAgKiAgIHRvIHNraXAgY29sb3JcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB3ZWlnaHQsIGNvbG9yID0gbnVsbCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHdlaWdodCAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnROdW1iZXIod2VpZ2h0KTtcbiAgICBjb2xvciAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnRUeXBlKFJhYy5Db2xvciwgY29sb3IpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWNcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy53ZWlnaHQgPSB3ZWlnaHQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU3Ryb2tlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYFN0cm9rZWAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYENvbG9yYCwgcmV0dXJucyBhIG5ldyBgU3Ryb2tlYFxuICAqICAgdXNpbmcgYHNvbWV0aGluZ2AgYXMgYGNvbG9yYCBhbmQgYSBgbnVsbGAgc3Ryb2tlIHdlaWdodC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEZpbGxgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgXG4gICogICB1c2luZyBgZmlsbC5jb2xvcmAgYW5kIGEgYG51bGxgIHN0cm9rZSB3ZWlnaHQuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuU3Ryb2tlfFJhYy5Db2xvcnxSYWMuRmlsbH0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogICBkZXJpdmUgYSBgU3Ryb2tlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFN0cm9rZSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5Db2xvcikge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UocmFjLCBudWxsLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkZpbGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHJhYywgbnVsbCwgc29tZXRoaW5nLmNvbG9yKTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLlN0cm9rZSAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3Ryb2tlYCB3aXRoIGB3ZWlnaHRgIHNldCB0byBgbmV3V2VpZ2h0YC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gbmV3V2VpZ2h0IC0gVGhlIHdlaWdodCBvZiB0aGUgc3Ryb2tlLCBvciBgbnVsbGAgdG8gc2tpcFxuICAqICAgd2VpZ2h0XG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHdpdGhXZWlnaHQobmV3V2VpZ2h0KSB7XG4gICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIG5ld1dlaWdodCwgdGhpcy5jb2xvciwpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHdpdGggYSBjb3B5IG9mIGBjb2xvcmAgc2V0dXAgd2l0aCBgbmV3QWxwaGFgLFxuICAqIGFuZCB0aGUgc2FtZSBgc3Ryb2tlYCBhcyBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGB0aGlzLmNvbG9yYCBpcyBzZXQgdG8gYG51bGxgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgIHRoYXQgaXMgYVxuICAqIGNvcHkgb2YgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld0FscGhhIC0gVGhlIGFscGhhIGNoYW5uZWwgb2YgdGhlIGBjb2xvcmAgb2YgdGhlIG5ld1xuICAqICAgYFN0cm9rZWBcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgd2l0aEFscGhhKG5ld0FscGhhKSB7XG4gICAgaWYgKHRoaXMuY29sb3IgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLndlaWdodCwgbnVsbCk7XG4gICAgfVxuXG4gICAgbGV0IG5ld0NvbG9yID0gdGhpcy5jb2xvci53aXRoQWxwaGEobmV3QWxwaGEpO1xuICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLndlaWdodCwgbmV3Q29sb3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBvbmx5IGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXNdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCBgc3R5bGVgLiBXaGVuXG4gICogYHN0eWxlYCBpcyBgbnVsbGAsIHJldHVybnMgYHRoaXNgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gc3R5bGUgLSBBIHN0eWxlIG9iamVjdFxuICAqICAgdG8gY29udGFpbiBhbG9uZyBgdGhpc2BcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfFJhYy5TdHJva2V9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHlsZV0pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIHRoZSBgRmlsbGBcbiAgKiBkZXJpdmVkIFtmcm9tXXtAbGluayBSYWMuRmlsbC5mcm9tfSBgc29tZUZpbGxgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuRmlsbHxSYWMuQ29sb3J8UmFjLlN0cm9rZX0gc29tZUZpbGwgLSBBbiBvYmplY3QgdG8gZGVyaXZlXG4gICogICBhIGBGaWxsYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKlxuICAqIEBzZWUgUmFjLkZpbGwuZnJvbVxuICAqL1xuICBhcHBlbmRGaWxsKHNvbWVGaWxsKSB7XG4gICAgbGV0IGZpbGwgPSBSYWMuRmlsbC5mcm9tKHRoaXMucmFjLCBzb21lRmlsbCk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBmaWxsXSk7XG4gIH1cblxufSAvLyBjbGFzcyBTdHJva2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cm9rZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiBgW1N0cm9rZV17QGxpbmsgUmFjLlN0cm9rZX1gIGFuZCBgW0ZpbGxde0BsaW5rIFJhYy5GaWxsfWBcbiogb2JqZWN0cyB3aGljaCBnZXQgYXBwbGllZCBzZXF1ZW50aWFsbHkgd2hlbiBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgY29udGFpbmVyLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBjb250YWluZWQgc3R5bGVzXG4qIGdsb2JhbGx5LCBvciBhcyB0aGUgcGFyYW1ldGVyIG9mIGBkcmF3YWJsZS5kcmF3KGNvbnRhaW5lcilgIHRvIGFwcGx5IHRoZVxuKiBzdHlsZSBzZXR0aW5ncyBvbmx5IGZvciB0aGF0IGBkcmF3YC5cbipcbiogQGFsaWFzIFJhYy5TdHlsZUNvbnRhaW5lclxuKi9cbmNsYXNzIFN0eWxlQ29udGFpbmVyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHN0eWxlcyA9IFtdKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogQ29udGFpbmVyIG9mIHN0eWxlIG9iamVjdHMgdG8gYXBwbHkuXG4gICAgKlxuICAgICogQ2FuIGJlIG1hbmlwdWxhdGVkIGRpcmVjdGx5IHRvIGFkZCBvciByZW1vdmUgc3R5bGVzIGZyb20gYHRoaXNgLlxuICAgICogTW9zdCBvZiB0aGUgaW1wbGVtZW50ZWQgbWV0aG9kcyBsaWtlXG4gICAgKiBgW2FkZF17QGxpbmsgUmFjLlN0eWxlQ29udGFpbmVyI2FkZH1gIHJldHVybiBhIG5ldyBgU3R5bGVDb250YWluZXJgXG4gICAgKiB3aXRoIGFuIGNvcHkgb2YgYHRoaXMuc3R5bGVzYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgKi9cbiAgICB0aGlzLnN0eWxlcyA9IHN0eWxlcztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICBsZXQgY29udGVudHMgPSB0aGlzLnN0eWxlcy5qb2luKCcgJyk7XG4gICAgcmV0dXJuIGBTdHlsZUNvbnRhaW5lcigke2NvbnRlbnRzfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBhIGNvcHkgb2YgYHRoaXMuc3R5bGVzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgdGhpcy5zdHlsZXMuc2xpY2UoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCB3aXRoIGBzdHlsZWAgYXBwZW5kZWQgYXQgdGhlIGVuZCBvZlxuICAqIGBzdHlsZXNgLiBXaGVuIGBzdHlsZWAgaXMgYG51bGxgLCByZXR1cm5zIGB0aGlzYCBpbnN0ZWFkLlxuICAqXG4gICogYHRoaXNgIGlzIG5vdCBtb2RpZmllZCBieSB0aGlzIG1ldGhvZCwgdGhlIG5ldyBgU3R5bGVDb250YWluZXJgIGlzXG4gICogY3JlYXRlZCB3aXRoIGEgY29weSBvZiBgdGhpcy5zdHlsZXNgLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9IHN0eWxlIC0gQSBzdHlsZSBvYmplY3RcbiAgKiAgIHRvIGFwcGVuZCB0byBgc3R5bGVzYFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsZXQgc3R5bGVzQ29weSA9IHRoaXMuc3R5bGVzLnNsaWNlKCk7XG4gICAgc3R5bGVzQ29weS5wdXNoKHN0eWxlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgc3R5bGVzQ29weSk7XG4gIH1cblxufSAvLyBjbGFzcyBTdHlsZUNvbnRhaW5lclxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3R5bGVDb250YWluZXI7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5Db2xvcmAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQ29sb3J9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Db2xvclxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjQ29sb3IocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgd2l0aCBlYWNoIGNoYW5uZWwgcmVjZWl2ZWQgaW4gdGhlICpbMCwyNTVdKiByYW5nZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gVGhlIHJlZCBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gVGhlIGJsdWUgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBbYT0yNTVdIC0gVGhlIGFscGhhIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVJnYmFcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5mcm9tUmdiYSA9IGZ1bmN0aW9uKHIsIGcsIGIsIGEgPSAyNTUpIHtcbiAgICByZXR1cm4gUmFjLkNvbG9yLmZyb21SZ2JhKHJhYywgciwgZywgYiwgYSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2UgZnJvbSBhIGhleGFkZWNpbWFsIHRyaXBsZXQgc3RyaW5nLlxuICAqXG4gICogVGhlIGBoZXhTdHJpbmdgIGlzIGV4cGVjdGVkIHRvIGhhdmUgNiBkaWdpdHMgYW5kIGNhbiBvcHRpb25hbGx5IHN0YXJ0XG4gICogd2l0aCBgI2AuIGBBQUJCQ0NgIGFuZCBgI0RERUVGRmAgYXJlIGJvdGggdmFsaWQgaW5wdXRzLCB0aGUgdGhyZWUgZGlnaXRcbiAgKiBzaG9ydGhhbmQgaXMgbm90IHlldCBzdXBwb3J0ZWQuXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGhleFN0cmluZ2AgaXMgbWlzZm9ybWF0dGVkIG9yIGNhbm5vdCBiZSBwYXJzZWQuXG4gICpcbiAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyaW5nIC0gVGhlIFJHQiBoZXggdHJpcGxldCB0byBpbnRlcnByZXRcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICByYWMuQ29sb3IuZnJvbUhleCA9IGZ1bmN0aW9uKGhleFN0cmluZykge1xuICAgIHJldHVybiBSYWMuQ29sb3IuZnJvbUhleChyYWMsIGhleFN0cmluZyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIEEgYmxhY2sgYENvbG9yYC5cbiAgKlxuICAqIEBuYW1lIGJsYWNrXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuYmxhY2sgICA9IHJhYy5Db2xvcigwLCAwLCAwKTtcblxuICAvKipcbiAgKiBBIHJlZCBgQ29sb3JgLlxuICAqXG4gICogQG5hbWUgcmVkXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IucmVkICAgICA9IHJhYy5Db2xvcigxLCAwLCAwKTtcblxuICByYWMuQ29sb3IuZ3JlZW4gICA9IHJhYy5Db2xvcigwLCAxLCAwKTtcbiAgcmFjLkNvbG9yLmJsdWUgICAgPSByYWMuQ29sb3IoMCwgMCwgMSk7XG4gIHJhYy5Db2xvci55ZWxsb3cgID0gcmFjLkNvbG9yKDEsIDEsIDApO1xuICByYWMuQ29sb3IubWFnZW50YSA9IHJhYy5Db2xvcigxLCAwLCAxKTtcbiAgcmFjLkNvbG9yLmN5YW4gICAgPSByYWMuQ29sb3IoMCwgMSwgMSk7XG4gIHJhYy5Db2xvci53aGl0ZSAgID0gcmFjLkNvbG9yKDEsIDEsIDEpO1xuXG59IC8vIGF0dGFjaFJhY0NvbG9yXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5GaWxsYCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5GaWxsfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuRmlsbFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjRmlsbChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBGaWxsYCB3aXRob3V0IGNvbG9yLiBSZW1vdmVzIHRoZSBmaWxsIGNvbG9yIHdoZW4gYXBwbGllZC5cbiAgKiBAbmFtZSBub25lXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkZpbGwjXG4gICovXG4gIHJhYy5GaWxsLm5vbmUgPSByYWMuRmlsbChudWxsKTtcblxufSAvLyBhdHRhY2hSYWNGaWxsXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5TdHJva2VgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLlN0cm9rZX1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlN0cm9rZVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjUG9pbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgU3Ryb2tlYCB3aXRoIG5vIHdlaWdodCBhbmQgbm8gY29sb3IuIFVzaW5nIG9yIGFwcGx5aW5nIHRoaXMgc3Ryb2tlXG4gICogd2lsbCBkaXNhYmxlIHN0cm9rZSBkcmF3aW5nLlxuICAqXG4gICogQG5hbWUgbm9uZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TdHJva2UjXG4gICovXG4gIHJhYy5TdHJva2Uubm9uZSA9IHJhYy5TdHJva2UobnVsbCk7XG5cblxuICAvKipcbiAgKiBBIGBTdHJva2VgIHdpdGggYHdlaWdodGAgb2YgYDFgIGFuZCBubyBjb2xvci4gVXNpbmcgb3IgYXBwbHlpbmcgdGhpc1xuICAqIHN0cm9rZSB3aWxsIG9ubHkgc2V0IHRoZSBzdHJva2Ugd2VpZ2h0IHRvIGAxYC5cbiAgKlxuICAqIEBuYW1lIG9uZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TdHJva2UjXG4gICovXG4gIHJhYy5TdHJva2Uub25lID0gcmFjLlN0cm9rZSgxKTtcblxufSAvLyBhdHRhY2hSYWNTdHJva2VcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gSW1wbGVtZW50YXRpb24gb2YgYW4gZWFzZSBmdW5jdGlvbiB3aXRoIHNldmVyYWwgb3B0aW9ucyB0byB0YWlsb3IgaXRzXG4vLyBiZWhhdmlvdXIuIFRoZSBjYWxjdWxhdGlvbiB0YWtlcyB0aGUgZm9sbG93aW5nIHN0ZXBzOlxuLy8gVmFsdWUgaXMgcmVjZWl2ZWQsIHByZWZpeCBpcyByZW1vdmVkXG4vLyAgIFZhbHVlIC0+IGVhc2VWYWx1ZSh2YWx1ZSlcbi8vICAgICB2YWx1ZSA9IHZhbHVlIC0gcHJlZml4XG4vLyBSYXRpbyBpcyBjYWxjdWxhdGVkXG4vLyAgIHJhdGlvID0gdmFsdWUgLyBpblJhbmdlXG4vLyBSYXRpbyBpcyBhZGp1c3RlZFxuLy8gICByYXRpbyAtPiBlYXNlUmF0aW8ocmF0aW8pXG4vLyAgICAgYWRqdXN0ZWRSYXRpbyA9IChyYXRpbyArIHJhdGlvT2ZzZXQpICogcmF0aW9GYWN0b3Jcbi8vIEVhc2UgaXMgY2FsY3VsYXRlZFxuLy8gICBlYXNlZFJhdGlvID0gZWFzZVVuaXQoYWRqdXN0ZWRSYXRpbylcbi8vIEVhc2VkUmF0aW8gaXMgYWRqdXN0ZWQgYW5kIHJldHVybmVkXG4vLyAgIGVhc2VkUmF0aW8gPSAoZWFzZWRSYXRpbyArIGVhc2VPZnNldCkgKiBlYXNlRmFjdG9yXG4vLyAgIGVhc2VSYXRpbyhyYXRpbykgLT4gZWFzZWRSYXRpb1xuLy8gVmFsdWUgaXMgcHJvamVjdGVkXG4vLyAgIGVhc2VkVmFsdWUgPSB2YWx1ZSAqIGVhc2VkUmF0aW9cbi8vIFZhbHVlIGlzIGFkanVzdGVkIGFuZCByZXR1cm5lZFxuLy8gICBlYXNlZFZhbHVlID0gcHJlZml4ICsgKGVhc2VkVmFsdWUgKiBvdXRSYW5nZSlcbi8vICAgZWFzZVZhbHVlKHZhbHVlKSAtPiBlYXNlZFZhbHVlXG5jbGFzcyBFYXNlRnVuY3Rpb24ge1xuXG4gIC8vIEJlaGF2aW9ycyBmb3IgdGhlIGBlYXNlVmFsdWVgIGZ1bmN0aW9uIHdoZW4gYHZhbHVlYCBmYWxscyBiZWZvcmUgdGhlXG4gIC8vIGBwcmVmaXhgIGFuZCBhZnRlciBgaW5SYW5nZWAuXG4gIHN0YXRpYyBCZWhhdmlvciA9IHtcbiAgICAvLyBgdmFsdWVgIGlzIHJldHVybmVkIHdpdGhvdXQgYW55IGVhc2luZyB0cmFuc2Zvcm1hdGlvbi4gYHByZUZhY3RvcmBcbiAgICAvLyBhbmQgYHBvc3RGYWN0b3JgIGFyZSBhcHBsaWVkLiBUaGlzIGlzIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24uXG4gICAgcGFzczogXCJwYXNzXCIsXG4gICAgLy8gQ2xhbXBzIHRoZSByZXR1cm5lZCB2YWx1ZSB0byBgcHJlZml4YCBvciBgcHJlZml4K2luUmFuZ2VgO1xuICAgIGNsYW1wOiBcImNsYW1wXCIsXG4gICAgLy8gUmV0dXJucyB0aGUgYXBwbGllZCBlYXNpbmcgdHJhbnNmb3JtYXRpb24gdG8gYHZhbHVlYCBmb3IgdmFsdWVzXG4gICAgLy8gYmVmb3JlIGBwcmVmaXhgIGFuZCBhZnRlciBgaW5SYW5nZWAuXG4gICAgY29udGludWU6IFwiY29udGludWVcIlxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYSA9IDI7XG5cbiAgICAvLyBBcHBsaWVkIHRvIHJhdGlvIGJlZm9yZSBlYXNpbmcuXG4gICAgdGhpcy5yYXRpb09mZnNldCA9IDBcbiAgICB0aGlzLnJhdGlvRmFjdG9yID0gMTtcblxuICAgIC8vIEFwcGxpZWQgdG8gZWFzZWRSYXRpby5cbiAgICB0aGlzLmVhc2VPZmZzZXQgPSAwXG4gICAgdGhpcy5lYXNlRmFjdG9yID0gMTtcblxuICAgIC8vIERlZmluZXMgdGhlIGxvd2VyIGxpbWl0IG9mIGB2YWx1ZWBgIHRvIGFwcGx5IGVhc2luZy5cbiAgICB0aGlzLnByZWZpeCA9IDA7XG5cbiAgICAvLyBgdmFsdWVgIGlzIHJlY2VpdmVkIGluIGBpblJhbmdlYCBhbmQgb3V0cHV0IGluIGBvdXRSYW5nZWAuXG4gICAgdGhpcy5pblJhbmdlID0gMTtcbiAgICB0aGlzLm91dFJhbmdlID0gMTtcblxuICAgIC8vIEJlaGF2aW9yIGZvciB2YWx1ZXMgYmVmb3JlIGBwcmVmaXhgLlxuICAgIHRoaXMucHJlQmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3IucGFzcztcbiAgICAvLyBCZWhhdmlvciBmb3IgdmFsdWVzIGFmdGVyIGBwcmVmaXgraW5SYW5nZWAuXG4gICAgdGhpcy5wb3N0QmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3IucGFzcztcblxuICAgIC8vIEZvciBhIGBwcmVCZWhhdmlvcmAgb2YgYHBhc3NgLCB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gdmFsdWVzIGJlZm9yZVxuICAgIC8vIGBwcmVmaXhgLlxuICAgIHRoaXMucHJlRmFjdG9yID0gMTtcbiAgICAvLyBGb3IgYSBgcG9zdEJlaGF2aW9yYCBvZiBgcGFzc2AsIHRoZSBmYWN0b3IgYXBwbGllZCB0byB0aGUgdmFsdWVzXG4gICAgLy8gYWZ0ZXIgYHByZWZpeCtpblJhbmdlYC5cbiAgICB0aGlzLnBvc3RGYWN0b3IgPSAxO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBlYXNlZCB2YWx1ZSBmb3IgYHVuaXRgLiBCb3RoIHRoZSBnaXZlblxuICAvLyBgdW5pdGAgYW5kIHRoZSByZXR1cm5lZCB2YWx1ZSBhcmUgaW4gdGhlIFswLDFdIHJhbmdlLiBJZiBgdW5pdGAgaXNcbiAgLy8gb3V0c2lkZSB0aGUgWzAsMV0gdGhlIHJldHVybmVkIHZhbHVlIGZvbGxvd3MgdGhlIGN1cnZlIG9mIHRoZSBlYXNpbmdcbiAgLy8gZnVuY3Rpb24sIHdoaWNoIG1heSBiZSBpbnZhbGlkIGZvciBzb21lIHZhbHVlcyBvZiBgYWAuXG4gIC8vXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgdGhlIGJhc2UgZWFzaW5nIGZ1bmN0aW9uLCBpdCBkb2VzIG5vdCBhcHBseSBhbnlcbiAgLy8gb2Zmc2V0cyBvciBmYWN0b3JzLlxuICBlYXNlVW5pdCh1bml0KSB7XG4gICAgLy8gU291cmNlOlxuICAgIC8vIGh0dHBzOi8vbWF0aC5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvMTIxNzIwL2Vhc2UtaW4tb3V0LWZ1bmN0aW9uLzEyMTc1NSMxMjE3NTVcbiAgICAvLyBmKHQpID0gKHReYSkvKHReYSsoMS10KV5hKVxuICAgIGxldCByYSA9IE1hdGgucG93KHVuaXQsIHRoaXMuYSk7XG4gICAgbGV0IGlyYSA9IE1hdGgucG93KDEtdW5pdCwgdGhpcy5hKTtcbiAgICByZXR1cm4gcmEgLyAocmEgKyBpcmEpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZWFzZSBmdW5jdGlvbiBhcHBsaWVkIHRvIHRoZSBnaXZlbiByYXRpby4gYHJhdGlvT2Zmc2V0YFxuICAvLyBhbmQgYHJhdGlvRmFjdG9yYCBhcmUgYXBwbGllZCB0byB0aGUgaW5wdXQsIGBlYXNlT2Zmc2V0YCBhbmRcbiAgLy8gYGVhc2VGYWN0b3JgIGFyZSBhcHBsaWVkIHRvIHRoZSBvdXRwdXQuXG4gIGVhc2VSYXRpbyhyYXRpbykge1xuICAgIGxldCBhZGp1c3RlZFJhdGlvID0gKHJhdGlvICsgdGhpcy5yYXRpb09mZnNldCkgKiB0aGlzLnJhdGlvRmFjdG9yO1xuICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlVW5pdChhZGp1c3RlZFJhdGlvKTtcbiAgICByZXR1cm4gKGVhc2VkUmF0aW8gKyB0aGlzLmVhc2VPZmZzZXQpICogdGhpcy5lYXNlRmFjdG9yO1xuICB9XG5cbiAgLy8gQXBwbGllcyB0aGUgZWFzaW5nIGZ1bmN0aW9uIHRvIGB2YWx1ZWAgY29uc2lkZXJpbmcgdGhlIGNvbmZpZ3VyYXRpb25cbiAgLy8gb2YgdGhlIHdob2xlIGluc3RhbmNlLlxuICBlYXNlVmFsdWUodmFsdWUpIHtcbiAgICBsZXQgYmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3I7XG5cbiAgICBsZXQgc2hpZnRlZFZhbHVlID0gdmFsdWUgLSB0aGlzLnByZWZpeDtcbiAgICBsZXQgcmF0aW8gPSBzaGlmdGVkVmFsdWUgLyB0aGlzLmluUmFuZ2U7XG5cbiAgICAvLyBCZWZvcmUgcHJlZml4XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5wcmVmaXgpIHtcbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5wYXNzKSB7XG4gICAgICAgIGxldCBkaXN0YW5jZXRvUHJlZml4ID0gdmFsdWUgLSB0aGlzLnByZWZpeDtcbiAgICAgICAgLy8gV2l0aCBhIHByZUZhY3RvciBvZiAxIHRoaXMgaXMgZXF1aXZhbGVudCB0byBgcmV0dXJuIHJhbmdlYFxuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyAoZGlzdGFuY2V0b1ByZWZpeCAqIHRoaXMucHJlRmFjdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5jbGFtcCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXg7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IuY29udGludWUpIHtcbiAgICAgICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VSYXRpbyhyYXRpbyk7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGVhc2VkUmF0aW8gKiB0aGlzLm91dFJhbmdlO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHByZUJlaGF2aW9yIGNvbmZpZ3VyYXRpb24gLSBwcmVCZWhhdmlvcjoke3RoaXMucG9zdEJlaGF2aW9yfWApO1xuICAgICAgdGhyb3cgcmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgIH1cblxuICAgIC8vIEFmdGVyIHByZWZpeFxuICAgIGlmIChyYXRpbyA8PSAxIHx8IHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5jb250aW51ZSkge1xuICAgICAgLy8gRWFzZSBmdW5jdGlvbiBhcHBsaWVkIHdpdGhpbiByYW5nZSAob3IgYWZ0ZXIpXG4gICAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVJhdGlvKHJhdGlvKTtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGVhc2VkUmF0aW8gKiB0aGlzLm91dFJhbmdlO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLnBhc3MpIHtcbiAgICAgIC8vIFNoaWZ0ZWQgdG8gaGF2ZSBpblJhbmdlIGFzIG9yaWdpblxuICAgICAgbGV0IHNoaWZ0ZWRQb3N0ID0gc2hpZnRlZFZhbHVlIC0gdGhpcy5pblJhbmdlO1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5vdXRSYW5nZSArIHNoaWZ0ZWRQb3N0ICogdGhpcy5wb3N0RmFjdG9yO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLmNsYW1wKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLm91dFJhbmdlO1xuICAgIH1cblxuICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgcG9zdEJlaGF2aW9yIGNvbmZpZ3VyYXRpb24gLSBwb3N0QmVoYXZpb3I6JHt0aGlzLnBvc3RCZWhhdmlvcn1gKTtcbiAgICB0aHJvdyByYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gIH1cblxuXG4gIC8vIFByZWNvbmZpZ3VyZWQgZnVuY3Rpb25zXG5cbiAgLy8gTWFrZXMgYW4gZWFzZUZ1bmN0aW9uIHByZWNvbmZpZ3VyZWQgdG8gYW4gZWFzZSBvdXQgbW90aW9uLlxuICAvL1xuICAvLyBUaGUgYG91dFJhbmdlYCB2YWx1ZSBzaG91bGQgYmUgYGluUmFuZ2UqMmAgaW4gb3JkZXIgZm9yIHRoZSBlYXNlXG4gIC8vIG1vdGlvbiB0byBjb25uZWN0IHdpdGggdGhlIGV4dGVybmFsIG1vdGlvbiBhdCB0aGUgY29ycmVjdCB2ZWxvY2l0eS5cbiAgc3RhdGljIG1ha2VFYXNlT3V0KCkge1xuICAgIGxldCBlYXNlT3V0ID0gbmV3IEVhc2VGdW5jdGlvbigpXG4gICAgZWFzZU91dC5yYXRpb09mZnNldCA9IDE7XG4gICAgZWFzZU91dC5yYXRpb0ZhY3RvciA9IC41O1xuICAgIGVhc2VPdXQuZWFzZU9mZnNldCA9IC0uNTtcbiAgICBlYXNlT3V0LmVhc2VGYWN0b3IgPSAyO1xuICAgIHJldHVybiBlYXNlT3V0O1xuICB9XG5cbn0gLy8gY2xhc3MgRWFzZUZ1bmN0aW9uXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFYXNlRnVuY3Rpb247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogRXhjZXB0aW9uIGJ1aWxkZXIgZm9yIHRocm93YWJsZSBvYmplY3RzLlxuKiBAYWxpYXMgUmFjLkV4Y2VwdGlvblxuKi9cbmNsYXNzIEV4Y2VwdGlvbiB7XG5cbiAgY29uc3RydWN0b3IobmFtZSwgbWVzc2FnZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgRXhjZXB0aW9uOiR7dGhpcy5uYW1lfSAtICR7dGhpcy5tZXNzYWdlfWA7XG4gIH1cblxuICAvKipcbiAgKiBXaGVuIGB0cnVlYCB0aGUgY29udmVuaWVuY2Ugc3RhdGljIGZ1bmN0aW9ucyBvZiB0aGlzIGNsYXNzIHdpbGxcbiAgKiBidWlsZCBgRXJyb3JgIG9iamVjdHMsIG90aGVyd2lzZSBgRXhjZXB0aW9uYCBvYmplY3RzIGFyZSBidWlsdC5cbiAgKlxuICAqIFNldCBhcyBgZmFsc2VgIGJ5IGRlZmF1bHQgZm9yIGJyb3dzZXIgdXNlOiB0aHJvd2luZyBhbiBgRXhjZXB0aW9uYFxuICAqIGluIGNocm9tZSBkaXNwbGF5cyB0aGUgZXJyb3Igc3RhY2sgdXNpbmcgc291cmNlLW1hcHMgd2hlbiBhdmFpbGFibGUsXG4gICogd2hpbGUgdGhyb3dpbmcgYW4gYEVycm9yYCBvYmplY3QgZGlzcGxheXMgdGhlIGVycm9yIHN0YWNrIHJlbGF0aXZlIHRvXG4gICogdGhlIGJ1bmRsZWQgZmlsZSB3aGljaCBpcyBoYXJkZXIgdG8gcmVhZC5cbiAgKlxuICAqIFVzZWQgYXMgYHRydWVgIGZvciB0ZXN0IHJ1bnMgaW4gSmVzdDogdGhyb3dpbmcgYW4gYEVycm9yYCB3aWxsIGJlXG4gICogcmVwb3J0ZWQgaW4gdGhlIHRlc3QgcmVwb3J0LCB3aGlsZSB0aHJvd2luZyBhIGN1c3RvbSBvYmplY3QgKGxpa2VcbiAgKiBgRXhjZXB0aW9uYCkgd2l0aGluIGEgbWF0Y2hlciByZXN1bHRzIGluIHRoZSBleHBlY3RhdGlvbiBoYW5naW5nXG4gICogaW5kZWZpbml0ZWx5LlxuICAqL1xuICBzdGF0aWMgYnVpbGRzRXJyb3JzID0gZmFsc2U7XG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgYnVpbGRpbmcgdGhyb3dhYmxlIG9iamVjdHMuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gY2FuIGNhbiBiZSB1c2VkIGFzIGZvbGxvd2luZzpcbiAgKiBgYGBcbiAgKiBmdW5jKG1lc3NhZ2UpIC8vIHJldHVybnMgYW4gYEV4Y2VwdGlvbmBgIG9iamVjdCB3aXRoIGBuYW1lYCBhbmQgYG1lc3NhZ2VgXG4gICogZnVuYy5leGNlcHRpb25OYW1lIC8vIHJldHVybnMgdGhlIGBuYW1lYCBvZiB0aGUgYnVpbHQgdGhyb3dhYmxlIG9iamVjdHNcbiAgKiBgYGBcbiAgKi9cbiAgc3RhdGljIG5hbWVkKG5hbWUpIHtcbiAgICBsZXQgZnVuYyA9IChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAoRXhjZXB0aW9uLmJ1aWxkc0Vycm9ycykge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgZXJyb3IubmFtZSA9IG5hbWU7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBFeGNlcHRpb24obmFtZSwgbWVzc2FnZSk7XG4gICAgfTtcblxuICAgIGZ1bmMuZXhjZXB0aW9uTmFtZSA9IG5hbWU7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cblxuICBzdGF0aWMgZHJhd2VyTm90U2V0dXAgICAgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnRHJhd2VyTm90U2V0dXAnKTtcbiAgc3RhdGljIGZhaWxlZEFzc2VydCAgICAgICAgICAgPSBFeGNlcHRpb24ubmFtZWQoJ0ZhaWxlZEFzc2VydCcpO1xuICBzdGF0aWMgaW52YWxpZE9iamVjdFR5cGUgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnSW52YWxpZE9iamVjdFR5cGUnKTtcbiAgc3RhdGljIGFic3RyYWN0RnVuY3Rpb25DYWxsZWQgPSBFeGNlcHRpb24ubmFtZWQoJ0Fic3RyYWN0RnVuY3Rpb25DYWxsZWQnKTtcblxuICAvLyBpbnZhbGlkUGFyYW1ldGVyQ29tYmluYXRpb246ICdJbnZhbGlkIHBhcmFtZXRlciBjb21iaW5hdGlvbicsXG4gIC8vIGludmFsaWRPYmplY3RDb25maWd1cmF0aW9uOiAnSW52YWxpZCBvYmplY3QgY29uZmlndXJhdGlvbicsXG4gIC8vIGludmFsaWRPYmplY3RUb0RyYXc6ICdJbnZhbGlkIG9iamVjdCB0byBkcmF3JyxcbiAgLy8gaW52YWxpZE9iamVjdFRvQXBwbHk6ICdJbnZhbGlkIG9iamVjdCB0byBhcHBseScsXG5cbn0gLy8gY2xhc3MgRXhjZXB0aW9uXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFeGNlcHRpb247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogSW50ZXJuYWwgdXRpbGl0aWVzLlxuKiBAbmFtZXNwYWNlIHV0aWxzXG4qL1xuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIHBhc3NlZCBwYXJhbWV0ZXJzIGFyZSBvYmplY3RzIG9yIHByaW1pdGl2ZXMuIElmIGFueVxuKiBwYXJhbWV0ZXIgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gXG4qIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi4oT2JqZWN0fHByaW1pdGl2ZSl9IHBhcmFtZXRlcnNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRFeGlzdHNcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0RXhpc3RzID0gZnVuY3Rpb24oLi4ucGFyYW1ldGVycykge1xuICBwYXJhbWV0ZXJzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRm91bmQgbnVsbCwgZXhwZWN0aW5nIGVsZW1lbnQgdG8gZXhpc3QgYXQgaW5kZXggJHtpbmRleH1gKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBGb3VuZCB1bmRlZmluZWQsIGV4cGVjdGluZyBlbGVtZW50IHRvIGV4aXN0IGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBvYmplY3RzIG9yIHRoZSBnaXZlbiBgdHlwZW9gLCBvdGhlcndpc2UgYVxuKiBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSB0eXBlXG4qIEBwYXJhbSB7Li4uT2JqZWN0fSBlbGVtZW50c1xuKlxuKiBAcmV0dXJucyB7Ym9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydFR5cGVcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0VHlwZSA9IGZ1bmN0aW9uKHR5cGUsIC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIHR5cGUpKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlIC0gZWxlbWVudDoke2l0ZW19IGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBleHBlY3RlZC10eXBlLW5hbWU6JHt0eXBlLm5hbWV9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBudW1iZXIgcHJpbWl0aXZlcyBhbmQgbm90IE5hTiwgb3RoZXJ3aXNlXG4qIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5udW1iZXJ9IGVsZW1lbnRzXG4qIEByZXR1cm5zIHtib29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0TnVtYmVyXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydE51bWJlciA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnbnVtYmVyJyB8fCBpc05hTihpdGVtKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSwgZXhwZWN0aW5nIG51bWJlciBwcmltaXRpdmUgLSBlbGVtZW50OiR7aXRlbX0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBzdHJpbmcgcHJpbWl0aXZlcywgb3RoZXJ3aXNlXG4qIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5zdHJpbmd9IGVsZW1lbnRzXG4qIEByZXR1cm5zIHtib29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0U3RyaW5nXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydFN0cmluZyA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSwgZXhwZWN0aW5nIHN0cmluZyBwcmltaXRpdmUgLSBlbGVtZW50OiR7aXRlbX0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBib29sZWFuIHByaW1pdGl2ZXMsIG90aGVyd2lzZSBhXG4qIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YCBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uYm9vbGVhbn0gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRCb29sZWFuXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydEJvb2xlYW4gPSBmdW5jdGlvbiguLi5lbGVtZW50cykge1xuICBlbGVtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgYm9vbGVhbiBwcmltaXRpdmUgLSBlbGVtZW50OiR7aXRlbX0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogUmV0dXJucyB0aGUgY29uc3RydWN0b3IgbmFtZSBvZiBgb2JqYCwgb3IgaXRzIHR5cGUgbmFtZS5cbiogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGRlYnVnZ2luZyBhbmQgZXJyb3JzLlxuKlxuKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gYE9iamVjdGAgdG8gZ2V0IGl0cyB0eXBlIG5hbWVcbiogQHJldHVybnMge3N0cmluZ31cbipcbiogQGZ1bmN0aW9uIHR5cGVOYW1lXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5mdW5jdGlvbiB0eXBlTmFtZShvYmopIHtcbiAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiAndW5kZWZpbmVkJzsgfVxuICBpZiAob2JqID09PSBudWxsKSB7IHJldHVybiAnbnVsbCc7IH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmoubmFtZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIG9iai5uYW1lID09ICcnXG4gICAgICA/IGBmdW5jdGlvbmBcbiAgICAgIDogYGZ1bmN0aW9uOiR7b2JqLm5hbWV9YDtcbiAgfVxuICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yLm5hbWUgPz8gdHlwZW9mIG9iajtcbn1cbmV4cG9ydHMudHlwZU5hbWUgPSB0eXBlTmFtZTtcblxuXG4vKipcbiogQWRkcyBhIGNvbnN0YW50IHRvIHRoZSBnaXZlbiBvYmplY3QsIHRoZSBjb25zdGFudCBpcyBub3QgZW51bWVyYWJsZSBhbmRcbiogbm90IGNvbmZpZ3VyYWJsZS5cbipcbiogQGZ1bmN0aW9uIGFkZENvbnN0YW50VG9cbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYWRkQ29uc3RhbnRUbyA9IGZ1bmN0aW9uKG9iaiwgcHJvcE5hbWUsIHZhbHVlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IHZhbHVlXG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIGEgc3RyaW5nIG9mIGBudW1iZXJgIGZvcm1hdCB1c2luZyBmaXhlZC1wb2ludCBub3RhdGlvbiBvciB0aGVcbiogY29tcGxldGUgYG51bWJlcmAgc3RyaW5nLlxuKlxuKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gVGhlIG51bWJlciB0byBmb3JtYXRcbiogQHBhcmFtIHs/bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBhbW91bnQgb2YgZGlnaXRzIHRvIHByaW50LCBvciBgbnVsbGAgdG9cbiogcHJpbnQgYWxsIGRpZ2l0cy5cbipcbiogQHJldHVybnMge3N0cmluZ31cbipcbiogQGZ1bmN0aW9uIGN1dERpZ2l0c1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5jdXREaWdpdHMgPSBmdW5jdGlvbihudW1iZXIsIGRpZ2l0cyA9IG51bGwpIHtcbiAgcmV0dXJuIGRpZ2l0cyA9PT0gbnVsbFxuICAgID8gbnVtYmVyLnRvU3RyaW5nKClcbiAgICA6IG51bWJlci50b0ZpeGVkKGRpZ2l0cyk7XG59XG5cbiJdfQ==
