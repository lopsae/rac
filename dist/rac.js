(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version
module.exports = '0.10.1-dev-601-1ad8d86'


},{}],2:[function(require,module,exports){
'use strict';


// Ruler and Compass
const version = require('../built/version');


/**
* This namespace lists utility functions attached to an instance of
* `{@link Rac}` used produce drawable and other objects, and to access
* ready-build convenience objects like {@link instance.Angle.north} or
* `{@link instance.Point.zero}`.
*
* Drawable and related objects require a reference to a `rac` instance in
* order to perform drawing operations. These functions build new objects
* using the calling `Rac` instance, and contain ready-made convenience
* objects that are also setup with the same `Rac` instance.
*
* @namespace instance
*/


/**
* Root class of RAC. All drawable, style, control, and drawer classes are
* contained in this class.
*
* An instance must be created with `new Rac()` in order to
* build drawable and most other objects.
*
* To perform drawing operations, a drawer must be setup with
* `{@link Rac#setupDrawer}.`
*/
class Rac {

  /**
  * Creates a new instance of Rac. The new instance has no `drawer` setup.
  */
  constructor() {

    /**
    * Version of the instance, same as `{@link Rac.version}`.
    * @name version
    * @memberof Rac#
    */
    utils.addConstant(this, 'version', version);


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
    * Value is based on 1/1000 of a point, the minimal perceptible distance
    * the user can see.
    */
    this.equalityThreshold = 0.001;



    /**
    * Value used to determine equality between two unitary numeric values.
    * Used for values that tend to exist in the `[0, 1]` range, like
    * `{@link Rac.Angle#turn}`. Used by `{@link Rac#unitaryEquals}`.
    *
    * Equality logic is the same as `{@link Rac#equalityThreshold}`.
    *
    * Value is based on 1/000 of the turn of an arc of radius 500 and
    * lenght of 1: `1/(500*6.28)/1000`
    */
    this.unitaryEqualityThreshold = 0.0000003;

    /**
    * Drawer of the instance. This object handles the drawing of all
    * drawable object using to this instance of `Rac`.
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
*/
Rac.utils = utils;


/**
* Version of the class.
* @name version
* @memberof Rac
*/
utils.addConstant(Rac, 'version', version);


/**
* Tau, equal to `Math.PI * 2`.
* https://tauday.com/tau-manifesto
* @name TAU
* @memberof Rac
*/
utils.addConstant(Rac, 'TAU', Math.PI * 2);


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


// Control
Rac.Control = require('./control/Control');


// SegmentControl
Rac.SegmentControl = require('./control/SegmentControl');


// ArcControl
Rac.ArcControl = require('./control/ArcControl');


},{"../built/version":1,"./attachInstanceFunctions":3,"./attachProtoFunctions":4,"./control/ArcControl":5,"./control/Control":6,"./control/SegmentControl":7,"./drawable/Angle":8,"./drawable/Arc":9,"./drawable/Bezier":10,"./drawable/Composite":11,"./drawable/Point":12,"./drawable/Ray":13,"./drawable/Segment":14,"./drawable/Shape":15,"./drawable/Text":16,"./drawable/instance.Angle":17,"./drawable/instance.Arc":18,"./drawable/instance.Bezier":19,"./drawable/instance.Point":20,"./drawable/instance.Ray":21,"./drawable/instance.Segment":22,"./drawable/instance.Text":23,"./p5Drawer/P5Drawer":25,"./style/Color":30,"./style/Fill":31,"./style/Stroke":32,"./style/Style":33,"./style/instance.Color":34,"./style/instance.Fill":35,"./style/instance.Stroke":36,"./util/EaseFunction":37,"./util/Exception":38,"./util/utils":39}],3:[function(require,module,exports){
'use strict';


const Rac = require('./Rac');


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
  */
  rac.Color = function makeColor(r, g, b, alpha = 1) {
    return new Rac.Color(this, r, g, b, alpha);
  }


  /**
  * Convenience function that creates a new `Stroke` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Stroke}`.
  *
  * @param {Rac.Color=} color
  * @param {number=} weight
  *
  * @returns {Rac.Stroke}
  *
  * @see instance.Stroke
  */
  rac.Stroke = function makeStroke(color = null, weight = 1) {
    return new Rac.Stroke(this, color, weight);
  }


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
  */
  rac.Fill = function makeFill(color = null) {
    return new Rac.Fill(this, color);
  }


  /**
  * Convenience function that creates a new `Style` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Style}`.
  *
  * @param {Rac.Stroke=} stroke
  * @param {Rac.Fill=} fill
  *
  * @returns {Rac.Style}
  *
  * @see instance.Style
  */
  rac.Style = function makeStyle(stroke = null, fill = null) {
    return new Rac.Style(this, stroke, fill);
  }


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
  */
  rac.Angle = function makeAngle(turn) {
    return new Rac.Angle(this, turn);
  }


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
  */
  rac.Point = function makePoint(x, y) {
    return new Rac.Point(this, x, y);
  }


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
  */
  rac.Ray = function makeRay(x, y, angle) {
    const start = new Rac.Point(this, x, y);
    angle = Rac.Angle.from(this, angle);
    return new Rac.Ray(this, start, angle);
  }


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
  */
  rac.Segment = function makeSegment(x, y, angle, length) {
    const start = new Rac.Point(this, x, y);
    angle = Rac.Angle.from(this, angle);
    const ray = new Rac.Ray(this, start, angle);
    return new Rac.Segment(this, ray, length);
  }


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
  */
  rac.Arc = function makeArc(x, y, radius, start = this.Angle.zero, end = null, clockwise = true) {
    const center = new Rac.Point(this, x, y);
    start = Rac.Angle.from(this, start);
    end = end === null
      ? start
      : Rac.Angle.from(this, end);
    return new Rac.Arc(this, center, radius, start, end, clockwise);
  }


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
  */
  rac.Text = function makeText(x, y, string, format) {
    const point = new Rac.Point(this, x, y);
    return new Rac.Text(this, point, string, format);
  }


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
  }

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


},{"./util/utils":39}],5:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


// TODO: fix uses of someAngle


/**
* Control that uses an Arc as anchor.
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

  // TODO: rename control.center to control.knob or similar
  // Returns the angle distance from `anchor.start` to the control center.
  distance() {
    return this.angleDistance.multOne(this.ratioValue());
  }

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
    center.arc(Rac.Control.radius)
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
      center.arc(Rac.Control.radius * 1.5).draw(Rac.Control.pointerStyle);
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

    Rac.popComposite().draw(Rac.Control.pointerStyle);
  }

} // class ArcControl


module.exports = ArcControl;


},{"../Rac":2,"../util/utils":39}],6:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


// TODO: fix uses of someAngle


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
* Parent class for all controls for manipulating a value with the pointer.
* Represents a control with a value, value-range, limits, markers, and
* drawing style. By default the control returns a `value` in the range
* [0,1] coresponding to the location of the control center in relation to
* the anchor shape. The value-range is defined by `startValue` and
* `endValue`.
* @alias Rac.Control
*/

class Control {

  // Radius of the cicle drawn for the control center.
  static radius = 22;

  // Collection of all controls that are drawn with `drawControls()`
  // and evaluated for selection with the `pointer...()` functions.
  static controls = [];

  // Last Point of the pointer position when it was pressed, or last
  // Control interacted with. Set to `null` when there has been no
  // interaction yet and while there is a selected control.
  static lastPointer = null;

  // Style used for visual elements related to selection and pointer
  // interaction.
  static pointerStyle = null;

  // Selection information for the currently selected control, or `null` if
  // there is no selection.
  static selection = null;


  static Selection = ControlSelection;


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
    if (Control.selection === null) {
      return false;
    }
    return Control.selection.control === this;
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
  let arc = center.arc(Control.radius * 1.5,
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


// Control pointer and interaction

// Call to signal the pointer being pressed. If the ponter hits a control
// it will be considered selected. When a control is selected a copy of its
// anchor is stored as to allow interaction with a fixed anchor.
Control.pointerPressed = function(rac, pointerCenter) {
  Control.lastPointer = null;

  // Test pointer hit
  let selected = Control.controls.find(item => {
    let controlCenter = item.center();
    if (controlCenter === null) { return false; }
    if (controlCenter.distanceToPoint(pointerCenter) <= Control.radius) {
      return true;
    }
    return false;
  });

  if (selected === undefined) {
    return;
  }

  Control.selection = new Control.Selection(selected, pointerCenter);
};


// Call to signal the pointer being dragged. As the pointer moves the
// selected control is updated with a new `distance`.
Control.pointerDragged = function(rac, pointerCenter){
  if (Control.selection === null) {
    return;
  }

  let control = Control.selection.control;
  let anchorCopy = Control.selection.anchorCopy;

  // Center of dragged control in the pointer current position
  let currentPointerControlCenter = Control.selection.pointerOffset
    .withStartPoint(pointerCenter)
    .endPoint();

  control.updateWithPointer(currentPointerControlCenter, anchorCopy);
};


// Call to signal the pointer being released. Upon release the selected
// control is cleared.
Control.pointerReleased = function(rac, pointerCenter) {
  if (Control.selection === null) {
    Control.lastPointer = pointerCenter;
    return;
  }

  Control.lastPointer = Control.selection.control;
  Control.selection = null;
};


// Draws controls and the visuals of pointer and control selection. Usually
// called at the end of `draw` so that controls sits on top of the drawing.
Control.drawControls = function(rac) {
  let pointerStyle = Control.pointerStyle;

  // Last pointer or control
  if (Control.lastPointer instanceof Rac.Point) {
    Control.lastPointer.arc(12).draw(pointerStyle);
  }
  if (Control.lastPointer instanceof Control) {
    // TODO: implement last selected control state
  }

  // Pointer pressed
  let pointerCenter = rac.Point.pointer();
  if (rac.drawer.p5.mouseIsPressed) {
    if (Control.selection === null) {
      pointerCenter.arc(10).draw(pointerStyle);
    } else {
      pointerCenter.arc(5).draw(pointerStyle);
    }
  }

  // All controls in display
  Control.controls.forEach(item => item.draw());

  // Rest is Control selection visuals
  if (Control.selection === null) {
    return;
  }

  Control.selection.drawSelection(pointerCenter);
};


},{"../Rac":2,"../util/utils":39}],7:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Control that uses a Segment as anchor.
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
    center.arc(Rac.Control.radius)
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
      center.arc(Rac.Control.radius * 1.5).draw(Rac.Control.pointerStyle);
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
    constrainedAnchorCenter.arc(Rac.Control.radius)
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
    draggedShadowCenter.arc(Rac.Control.radius / 2)
      .attachToComposite();

    // Ease for segment to dragged shadow center
    let easeOut = Rac.EaseFunction.makeEaseOut();
    easeOut.postBehavior = Rac.EaseFunction.Behavior.clamp;

    // Tail will stop stretching at 2x the max tail length
    let maxDraggedTailLength = Rac.Control.radius * 5;
    easeOut.inRange = maxDraggedTailLength * 2;
    easeOut.outRange = maxDraggedTailLength;

    // Segment to dragged shadow center
    let draggedTail = draggedShadowCenter
      .segmentToPoint(draggedCenter);

    let easedLength = easeOut.easeValue(draggedTail.length);
    draggedTail.withLength(easedLength).attachToComposite();

    // Draw all!
    Rac.popComposite().draw(Rac.Control.pointerStyle);
  }

} // class SegmentControl


module.exports = SegmentControl;


},{"../Rac":2,"../util/utils":39}],8:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


// TODO: add note about: most functions that receive an angle can also
// receive the turn value directly as a number. The main exception are
// constructors, which always expect Angle objects.


/**
* Angle measured by a `turn` value in the range `[0,1)` that represents the
* amount of turn in a full circle.
*
* When drawing an angle of turn `0` points towards the right of the screen.
* An angle of turn `1/4` points downwards, turn `1/2` towards the left,
* `3/4` points upwards.
*
* @alias Rac.Angle
*/
class Angle {

  /**
  * Creates a new `Angle` instance.
  *
  * The `turn` value is constrained to the rance `[0, 1)`, any value
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
    * Intance of `Rac` used for drawing and passed along to any created
    * object.
    * @type {Rac}
    */
    this.rac = rac;

    turn = turn % 1;
    if (turn < 0) {
      turn = (turn + 1) % 1;
    }

    /**
    * Turn value of the angle, constrained to the range `[0, 1)`.
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
  * `[0, 1)` as equals. E.g. `Angle` objects with `turn` values of `0` and
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
  * @param {Rac} rac Instance to pass along to newly created objects
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
  * @param {Rac} rac Instance to pass along to newly created objects
  * @param {number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  */
  static fromRadians(rac, radians) {
    return new Angle(rac, radians / Rac.TAU);
  }


  // TODO: implement fromDegrees


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
  * @returns {number}
  */
  radians() {
    return this.turn * Rac.TAU;
  }

  /**
  * Returns the measure of the angle in degrees.
  * @returns {number}
  */
  degrees() {
    return this.turn * 360;
  }

  /**
  * Returns the `turn` value in the range `(0, 1]`. When `turn` is equal to
  * `0` returns `1` instead.
  * @returns {number}
  */
  turnOne() {
    if (this.turn === 0) { return 1; }
    return this.turn;
  }

  /**
  * Returns a new `Angle` with the sum of `this` and the angle derived from
  * `angle`.
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
  * @param {Rac.Angle|number} angle - An `Angle` to subtract
  * @returns {Rac.Angle}
  */
  subtract(angle) {
    angle = this.rac.Angle.from(angle);
    return new Angle(this.rac, this.turn - angle.turn);
  }

  /**
  * Returns a new `Angle` with `turn`` set to `this.turn * factor`.
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


},{"../Rac":2,"../util/utils":39}],9:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');



/**
* Arc of a circle from a start angle to an end angle.
*
* Arcs that have the same `start` and `end` angles are considered a
* complete circle.
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
    * Intance of `Rac` used for drawing and passed along to any created
    * object.
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
  * between `start` and `end` in the arc's orientation.
  *
  * All properties except `end` are copied from `this`.
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
  * part of the circumference it represents.
  *
  * All properties except `end` are copied from `this`.
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
  * Returns a new `Arc` with a `length()` of `this.length() * ratio`.
  *
  * All properties except `end` are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range `[0,radius*TAU)`. When the calculated length is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {number} ratio - The factor to multiply `length()` by
  * @returns {Rac.Arc}
  * @see Rac.Arc#length
  */
  withLengthRatio(ratio) {
    const newLength = this.length() * ratio;
    return this.withLength(newLength);
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
  * @ignore
  *
  * Returns an array containing the intersecting points of `this` with
  * `otherArc`.
  *
  * When there are no intersecting points, returns an empty array.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to calculate intersection points with
  * @returns {Rac.Arc}
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
  * @ignore
  *
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
    // TODO: use TAU instead
    const tangent = this.radius * (4/3) * Math.tan(Math.PI/(parsPerTurn*2));

    const beziers = [];
    const segments = this.divideToSegments(count);
    // TODO: use anonymous function
    segments.forEach(function(item) {
      // TODO: use Rays?
      const startArcRay =  this.center.segmentToPoint(item.startPoint());
      const endArcRay = this.center.segmentToPoint(item.endPoint());

      let startAnchor = startArcRay
        .nextSegmentToAngleDistance(this.rac.Angle.square, !this.clockwise, tangent)
        .endPoint();
      let endAnchor = endArcRay
        .nextSegmentToAngleDistance(this.rac.Angle.square, this.clockwise, tangent)
        .endPoint();

      beziers.push(new Rac.Bezier(this.rac,
        startArcRay.endPoint(), startAnchor,
        endAnchor, endArcRay.endPoint()));
    }, this);

    return new Rac.Composite(this.rac, beziers);
  }

} // class Arc


module.exports = Arc;


},{"../Rac":2,"../util/utils":39}],10:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Bezier curve with start, end, and two anchor points.
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


},{"../Rac":2,"../util/utils":39}],11:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


  // Contains a sequence of geometry objects which can be drawn or vertex
  // together.
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


},{"../Rac":2,"../util/utils":39}],12:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Point in a two dimentional coordinate system.
*
* Several methods will return an adjusted value or perform adjustments in
* their operation when two points are close enough as to be considered
* equal. When the the difference of each coordinate of two points
* is under `{@link Rac#equalityThreshold}` the points are considered equal.
* The method `{@link Rac.Point#equals}` performs this check.
*
* @alias Rac.Point
*/
class Point{


  /**
  * Creates a new `Point` instance.
  * @param {Rac} rac Instance to use for drawing and creating other objects
  * @param {number} x - The x coordinate
  * @param {number} y - The y coordinate
  */
  constructor(rac, x, y) {
    utils.assertExists(rac, x, y);
    utils.assertNumber(x, y);

    /**
    * Intance of `Rac` used for drawing and passed along to any created
    * object.
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


},{"../Rac":2,"../util/utils":39}],13:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Unbounded ray from a `[Point]{@link Rac.Point}` in direction of an
* `[Angle]{@link Rac.Angle}`.
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
    * Intance of `Rac` used for drawing and passed along to any created
    * object.
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
    * @type {Rac.Point}
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


},{"../Rac":2,"../util/utils":39}],14:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Segment of a `[Ray]{@link Rac.Ray}` up to a given length.
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
    * Intance of `Rac` used for drawing and passed along to any created
    * object.
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


},{"../Rac":2,"../util/utils":39}],15:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


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


},{"../Rac":2,"../util/utils":39}],16:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Format for drawing a `Text` object.
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
    horizontal, vertical,
    font = null,
    angle = rac.Angle.zero,
    size = TextFormat.defaultSize)
  {
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


},{"../Rac":2,"../util/utils":39}],17:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `instance.Angle` function contains convenience methods and members
* for `{@link Rac.Angle}` objects setup with the owning `Rac` instance.
* @namespace instance.Angle
*/
module.exports = function attachRacAngle(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * Returns an `Angle` derived from `something`.
  *
  * Calls`{@link Rac.Angle.from}` using `this`.
  *
  * @param {number|Rac.Angle|Rac.Ray|Rac.Segment} something - An object to
  * derive an `Angle` from
  * @returns {Rac.Angle}
  *
  * @function from
  * @memberof instance.Angle#
  * @see Rac.Angle.from
  */
  rac.Angle.from = function(something) {
    return Rac.Angle.from(rac, something);
  };


  /**
  * Returns an `Angle` derived from `radians`.
  *
  * Calls `{@link Rac.Angle.fromRadians}` using `this`.
  *
  * @param {number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  *
  * @function fromRadians
  * @memberof instance.Angle#
  * @see Rac.Angle.fromRadians
  */
  rac.Angle.fromRadians = function(radians) {
    return Rac.Angle.fromRadians(rac, radians);
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


},{"../Rac":2}],18:[function(require,module,exports){
'use strict';


/**
* The `instance.Arc` function contains convenience methods and members
* for `{@link Rac.Arc}` objects setup with the owning `Rac` instance.
* @namespace instance.Arc
*/
module.exports = function attachRacArc(rac) {

  /**
  * A clockwise `Arc` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Arc}
  * @memberof instance.Arc#
  */
  rac.Arc.zero = rac.Arc(0, 0, 0, 0, 0, true);

} // attachRacArc


},{}],19:[function(require,module,exports){
'use strict';


/**
* The `instance.Bezier` function contains convenience methods and members
* for `{@link Rac.Bezier}` objects setup with the owning `Rac` instance.
* @namespace instance.Bezier
*/
module.exports = function attachInstanceBezier(rac) {

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


},{}],20:[function(require,module,exports){
'use strict';


/**
* The `instance.Point` function contains convenience methods and members
* for `{@link Rac.Point}` objects setup with the owning `Rac` instance.
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


},{}],21:[function(require,module,exports){
'use strict';


/**
* The `instance.Ray` function contains convenience methods and members
* for `{@link Rac.Ray}` objects setup with the owning `Rac` instance.
* @namespace instance.Ray
*/
module.exports = function attachRacRay(rac) {

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
  * A `Ray` over the y-axis, starts at`{@link instance.Point.origin}` and
  * points to `{@link instance.Angle.quarter}`.
  *
  * @name yAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#quarter
  */
  rac.Ray.yAxis = rac.Ray(0, 0, rac.Angle.quarter);

} // attachRacRay


},{}],22:[function(require,module,exports){
'use strict';


/**
* The `instance.Segment` function contains convenience methods and members
* for `{@link Rac.Segment}` objects setup with the owning `Rac` instance.
* @namespace instance.Segment
*/
module.exports = function attachRacSegment(rac) {

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


},{}],23:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `instance.Text` function contains convenience methods and members
* for `{@link Rac.Text}` objects setup with the owning `Rac` instance.
* @namespace instance.Text
*/
module.exports = function attachRacText(rac) {


  rac.Text.Format = function(
    horizontal, vertical,
    font = null,
    angle = rac.Angle.zero,
    size = Rac.Text.Format.defaultSize)
  {
    return new Rac.Text.Format(
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
  * @memberof rac.Text#
  */
  rac.Text.hello = rac.Text(0, 0, 'hello world!',
    rac.Text.Format.topLeft);

  /**
  * A `Text` for drawing the pangram `sphinx of black quartz, judge my vow`
  * with `topLeft` format at `Point.zero`.
  * @name sphinx
  * @memberof rac.Text#
  */
  rac.Text.sphinx = rac.Text(0, 0, 'sphinx of black quartz, judge my vow',
    rac.Text.Format.topLeft);

} // attachRacPoint


},{"../Rac":2}],24:[function(require,module,exports){


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
  root.makeRac = factory();

}(typeof self !== 'undefined' ? self : this, function () {

  return require('./Rac');

}));


},{"./Rac":2}],25:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Drawer that uses a P5 instance for all drawing operations.
* @alias Rac.P5Drawer
*/
class P5Drawer {

  constructor(rac, p5){
    this.rac = rac;
    this.p5 = p5;
    this.drawRoutines = [];
    this.debugRoutines = [];
    this.applyRoutines = [];

    // Style used for debug drawing, if null thise style already applied
    // is used.
    this.debugStyle = null;
    // Style used for text for debug drawing, if null the style already
    // applied is used.
    this.debugTextStyle = null;
    // Radius of point markers for debug drawing.
    this.debugTextOptions = {
      font: 'monospace',
      size: Rac.Text.Format.defaultSize,
      toFixed: 2
    };

    this.debugPointRadius = 4;
    // Radius of main visual elements for debug drawing.
    this.debugRadius = 22;

    this.setupAllDrawFunctions(rac);
    this.setupAllDebugFunctions(rac);
    this.setupAllApplyFunctions(rac);
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

  debugNumber(number) {
    return number.toFixed(this.debugTextOptions.toFixed);
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
  setupAllDrawFunctions(rac) {
    let functions = require('./draw.functions');

    // Point
    this.setDrawFunction(Rac.Point, functions.drawPoint);
    require('./Point.functions')(rac);

    // Ray
    this.setDrawFunction(Rac.Ray, functions.drawRay);

    // Segment
    this.setDrawFunction(Rac.Segment, functions.drawSegment);
    require('./Segment.functions')(rac);

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
      rac.drawer.p5.bezierVertex(
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
        case hOptions.left:   hAlign = rac.drawer.p5.LEFT;   break;
        case hOptions.center: hAlign = rac.drawer.p5.CENTER; break;
        case hOptions.right:  hAlign = rac.drawer.p5.RIGHT;  break;
        default:
          console.trace(`Invalid horizontal configuration - horizontal:${this.horizontal}`);
          throw Rac.Error.invalidObjectConfiguration;
      }

      let vAlign;
      let vOptions = Rac.Text.Format.vertical;
      switch (this.vertical) {
        case vOptions.top:      vAlign = rac.drawer.p5.TOP;      break;
        case vOptions.bottom:   vAlign = rac.drawer.p5.BOTTOM;   break;
        case vOptions.center:   vAlign = rac.drawer.p5.CENTER;   break;
        case vOptions.baseline: vAlign = rac.drawer.p5.BASELINE; break;
        default:
          console.trace(`Invalid vertical configuration - vertical:${this.vertical}`);
          throw Rac.Error.invalidObjectConfiguration;
      }

      // Text properties
      rac.drawer.p5.textAlign(hAlign, vAlign);
      rac.drawer.p5.textSize(this.size);
      if (this.font !== null) {
        rac.drawer.p5.textFont(this.font);
      }

      // Positioning
      rac.drawer.p5.translate(point.x, point.y);
      if (this.angle.turn != 0) {
        rac.drawer.p5.rotate(this.angle.radians());
      }
    } // Rac.Text.Format.prototype.apply

  } // setupAllDrawFunctions


  // Sets up all debug routines for rac drawable clases.
  setupAllDebugFunctions(rac) {
    let functions = require('./debug.functions');
    this.setDebugFunction(Rac.Point, functions.debugPoint);
    this.setDebugFunction(Rac.Segment, functions.debugSegment);
    this.setDebugFunction(Rac.Arc, functions.debugArc);

    // TODO: using an external reference to drawer, should use internal one
    let drawer = this;
    Rac.Angle.prototype.debug = function(point, drawsText = false) {
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
      angle = rac.Angle.from(angle);
      angle.debug(this, drawsText);
      return this;
    };
  } // setupAllDebugFunctions


  // Sets up all applying routines for rac style clases.
  // Also attaches additional prototype functions in relevant classes.
  setupAllApplyFunctions(rac) {
    // Color prototype functions
    Rac.Color.prototype.applyBackground = function() {
      rac.drawer.p5.background(this.r * 255, this.g * 255, this.b * 255);
    };

    Rac.Color.prototype.applyFill = function() {
      rac.drawer.p5.fill(this.r * 255, this.g * 255, this.b * 255, this.alpha * 255);
    };

    Rac.Color.prototype.applyStroke = function() {
      rac.drawer.p5.stroke(this.r * 255, this.g * 255, this.b * 255, this.alpha * 255);
    };

    // Stroke
    this.setApplyFunction(Rac.Stroke, (drawer, stroke) => {
      if (stroke.color === null) {
        drawer.p5.noStroke();
        return;
      }

      stroke.color.applyStroke();
      drawer.p5.strokeWeight(stroke.weight);
    });

    // Fill
    this.setApplyFunction(Rac.Fill, (drawer, fill) => {
      if (fill.color === null) {
        rac.drawer.p5.noFill();
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
      rac.drawer.setClassDrawStyle(classObj, this);
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


},{"../Rac":2,"../util/utils":39,"./Point.functions":26,"./Segment.functions":27,"./debug.functions":28,"./draw.functions":29}],26:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachPointFunctions(rac) {

  /**
  * Calls `p5.vertex` as to represent this `Point`.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  */
  Rac.Point.prototype.vertex = function() {
    rac.drawer.p5.vertex(this.x, this.y);
  };

  /**
  * Returns a `Point` at the current position of the pointer.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name pointer
  * @memberof rac.Point#
  * @function
  */
  rac.Point.pointer = function() {
    return rac.Point(rac.drawer.p5.mouseX, rac.drawer.p5.mouseY);
  };

  /**
  * Returns a `Point` at the center of the canvas.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasCenter
  * @memberof rac.Point#
  * @function
  */
  rac.Point.canvasCenter = function() {
    return rac.Point(rac.drawer.p5.width/2, rac.drawer.p5.height/2);
  };

  /**
  * Returns a `Point` at the end of the canvas, that is, at the position
  * `(width,height)`.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasEnd
  * @memberof rac.Point#
  * @function
  */
  Rac.Point.canvasEnd = function() {
    return new Rac.Point(rac.drawer.p5.width, rac.drawer.p5.height);
  };

} // attachPointFunctions


},{"../Rac":2,"../util/utils":39}],27:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachSegmentFunctions(rac) {

  /**
  * Calls `p5.vertex` as to represent this `Segment`.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  */
  Rac.Segment.prototype.vertex = function() {
    this.startPoint().vertex();
    this.endPoint().vertex();
  };


  /**
  * Returns a `Segment` that covers the top of the canvas, from top-left to
  * top-right.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasTop
  * @memberof rac.Segment#
  * @function
  */
  rac.Segment.canvasTop = function() {
    return rac.Point.zero
      .segmentToAngle(rac.Angle.right, rac.drawer.p5.width);
  };


  /**
  * Returns a `Segment` that covers the left of the canvas, from top-left
  * to bottom-left.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasLeft
  * @memberof rac.Segment#
  * @function
  */
  rac.Segment.canvasLeft = function() {
    return rac.Point.zero
      .segmentToAngle(rac.Angle.down, rac.drawer.p5.height);
  };


  /**
  * Returns a `Segment` that covers the right of the canvas, from top-right
  * to bottom-right.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasRight
  * @memberof rac.Segment#
  * @function
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
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasBottom
  * @memberof rac.Segment#
  * @function
  */
  rac.Segment.canvasBottom = function() {
    let bottomLeft = rac.Point(0, rac.drawer.p5.height);
    return bottomLeft
      .segmentToAngle(rac.Angle.right, rac.drawer.p5.width);
  };



} // attachSegmentFunctions


},{"../Rac":2,"../util/utils":39}],28:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


function reversesText(angle) {
  return angle.turn < 3/4 && angle.turn >= 1/4;
}


exports.debugAngle = function(drawer, angle, point, drawsText) {
  let rac = drawer.rac;

  // Zero segment
  point
    .segmentToAngle(rac.Angle.zero, drawer.debugRadius)
    .draw();

  // Angle segment
  let angleSegment = point
    .segmentToAngle(angle, drawer.debugRadius * 1.5);
  angleSegment.endPoint()
    .arc(drawer.debugPointRadius, angle, angle.inverse(), false)
    .draw();
  angleSegment
    .withLengthAdd(drawer.debugPointRadius)
    .draw();

  // Mini arc markers
  let angleArc = point.arc(drawer.debugRadius, rac.Angle.zero, angle);
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
        .withRadius(drawer.debugRadius*3/4)
        .withClockwise(false)
        .draw();
    }
  };
  context.restore();

  // Text
  if (drawsText !== true) { return; }

  // Normal orientation
  let format = new Rac.Text.Format(
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
    .pointToAngle(angle, drawer.debugRadius*2)
    .text(turnString, format)
    .draw(drawer.debugTextStyle);
}; // debugAngle


exports.debugPoint = function(drawer, point, drawsText) {
  let rac = drawer.rac;

  point.draw();

  // Point marker
  point.arc(drawer.debugPointRadius).draw();

  // Point reticule marker
  let arc = point
    .arc(drawer.debugRadius, rac.Angle.s, rac.Angle.e)
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
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.top,
    drawer.debugTextOptions.font,
    rac.Angle.e,
    drawer.debugTextOptions.size);
  point
    .pointToAngle(rac.Angle.se, drawer.debugPointRadius*2)
    .text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


exports.debugSegment = function(drawer, segment, drawsText) {
  let rac = drawer.rac;

  segment.draw();

  // Half circle start marker
  segment.withLength(drawer.debugPointRadius)
    .arc()
    .draw();

  // Half circle start segment
  let perpAngle = segment.angle().perpendicular();
  let arc = segment.startPoint()
    .arc(drawer.debugRadius, perpAngle, perpAngle.inverse())
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
    .withLength(drawer.debugRadius/2)
    .withStartExtended(-drawer.debugPointRadius)
    .draw();
  let endMarkerEnd = segment
    .nextSegmentPerpendicular(false)
    .withLength(drawer.debugRadius/2)
    .withStartExtended(-drawer.debugPointRadius)
    .draw();
  // Little end half circle
  segment.endPoint()
    .arc(drawer.debugPointRadius, endMarkerStart.angle(), endMarkerEnd.angle())
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
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.bottom,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  let angleFormat = new Rac.Text.Format(
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
    .pointToAngle(angle, drawer.debugPointRadius)
    .pointToAngle(angle.subtract(1/4), drawer.debugRadius/2)
    .text(lengthString, lengthFormat)
    .draw(drawer.debugTextStyle);

    // Angle
  let angleString = `angle:${drawer.debugNumber(angle.turn)}`;
  segment.startPoint()
    .pointToAngle(angle, drawer.debugPointRadius)
    .pointToAngle(angle.add(1/4), drawer.debugRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  let rac = drawer.rac;

  arc.draw();

  // Center markers
  let centerArcRadius = drawer.debugRadius * 2/3;
  if (arc.radius > drawer.debugRadius/3 && arc.radius < drawer.debugRadius) {
    // If radius is to close to the center-arc markers
    // Make the center-arc be outside of the arc
    centerArcRadius = arc.radius + drawer.debugRadius/3;
  }

  // Center start segment
  let centerArc = arc.withRadius(centerArcRadius);
  centerArc.startSegment().draw();

  // Radius
  let radiusMarkerLength = arc.radius
    - centerArcRadius
    - drawer.debugRadius/2
    - drawer.debugPointRadius*2;
  if (radiusMarkerLength > 0) {
    arc.startSegment()
      .withLength(radiusMarkerLength)
      .translateToLength(centerArcRadius + drawer.debugPointRadius*2)
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
    .arc(drawer.debugPointRadius).draw();
  startPoint
    .segmentToAngle(arc.start, drawer.debugRadius)
    .withStartExtended(-drawer.debugRadius/2)
    .draw();

  // Orientation marker
  let orientationLength = drawer.debugRadius*2;
  let orientationArc = arc
    .startSegment()
    .withLengthAdd(drawer.debugRadius)
    .arc(null, arc.clockwise)
    .withLength(orientationLength)
    .draw();
  let arrowCenter = orientationArc
    .reverse()
    .withLength(drawer.debugRadius/2)
    .chordSegment();
  let arrowAngle = 3/32;
  arrowCenter.withAngleShift(-arrowAngle).draw();
  arrowCenter.withAngleShift(arrowAngle).draw();

  // Internal end point marker
  let endPoint = arc.endPoint();
  let internalLength = Math.min(drawer.debugRadius/2, arc.radius);
  internalLength -= drawer.debugPointRadius;
  if (internalLength > rac.equalityThreshold) {
    endPoint
      .segmentToAngle(arc.end.inverse(), internalLength)
      .translateToLength(drawer.debugPointRadius)
      .draw();
  }

  // External end point marker
  let textJoinThreshold = drawer.debugRadius*3;
  let lengthAtOrientationArc = orientationArc
    .withEnd(arc.end)
    .length();
  let externalLength = lengthAtOrientationArc > textJoinThreshold && drawsText === true
    ? drawer.debugRadius - drawer.debugPointRadius
    : drawer.debugRadius/2 - drawer.debugPointRadius;

  endPoint
    .segmentToAngle(arc.end, externalLength)
    .translateToLength(drawer.debugPointRadius)
    .draw();

  // End point little arc
  if (!arc.isCircle()) {
    endPoint
      .arc(drawer.debugPointRadius, arc.end, arc.end.inverse(), arc.clockwise)
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
    hFormat.left,
    headVertical,
    drawer.debugTextOptions.font,
    arc.start,
    drawer.debugTextOptions.size);
  let tailFormat = new Rac.Text.Format(
    hFormat.left,
    tailVertical,
    drawer.debugTextOptions.font,
    arc.end,
    drawer.debugTextOptions.size);
  let radiusFormat = new Rac.Text.Format(
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
      .pointToAngle(arc.start, drawer.debugRadius)
      .pointToAngle(perpAngle, drawer.debugPointRadius*2)
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
      .pointToAngle(arc.start, drawer.debugRadius/2)
      .text(headString, headFormat)
      .draw(drawer.debugTextStyle);
    orientationArc.pointAtAngle(arc.end)
      .pointToAngle(arc.end, drawer.debugRadius/2)
      .text(tailString, tailFormat)
      .draw(drawer.debugTextStyle);
  } else {
    // Draw strings together
    let allStrings = `${headString}\n${tailString}`;
    orientationArc.startPoint()
      .pointToAngle(arc.start, drawer.debugRadius/2)
      .text(allStrings, headFormat)
      .draw(drawer.debugTextStyle);
  }
}; // debugArc


// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape
// TODO: debug routine of Text


},{"../Rac":2}],29:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


exports.drawPoint = function(drawer, point) {
  drawer.p5.point(point.x, point.y);
}; // drawPoint


exports.drawRay = function(drawer, ray) {
  const edgeMargin = 0; // Used for debugging
  const turn = ray.angle.turn;
  let endPoint = null;
  if
    (turn >= 1/8 && turn < 3/8)
  {
    // pointing down
    const downEdge = drawer.p5.height - edgeMargin;
    if (ray.start.y < downEdge) {
      endPoint = ray.pointAtY(downEdge);
    }
  } else if
    (turn >= 3/8 && turn < 5/8)
  {
    // pointing left
    const leftEdge = edgeMargin;
    if (ray.start.x >= leftEdge) {
      endPoint = ray.pointAtX(leftEdge);
    }
  } else if
    (turn >= 5/8 && turn < 7/8)
  {
    // pointing up
    const upEdge = edgeMargin;
    if (ray.start.y >= upEdge) {
      endPoint = ray.pointAtY(upEdge);
    }
    // return;
  } else {
    // pointing right
    const rightEdge = drawer.p5.width - edgeMargin;
    if (ray.start.x < rightEdge) {
      endPoint = ray.pointAtX(rightEdge);
    }
  }

  if (endPoint === null) {
    // Ray is outside canvas
    return;
  }

  drawer.p5.line(
    ray.start.x, ray.start.y,
    endPoint.x,  endPoint.y);
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


},{"../Rac":2}],30:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Color with RBGA values, each on the `[0,1]` range.
* @alias Rac.Color
*/
class Color {

  constructor(rac, r, g, b, alpha = 1) {
    utils.assertExists(rac, r, g, b, alpha);
    this.rac = rac;
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = alpha;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Color(${this.r},${this.g},${this.b},${this.alpha})`;
  }

  static fromRgba(rac, r, g, b, a = 255) {
    return new Color(rac, r/255, g/255, b/255, a/255);
  }

  fill() {
    return new Rac.Fill(this.rac, this);
  }

  stroke(weight = 1) {
    return new Rac.Stroke(this.rac, this, weight);
  }

  withAlpha(newAlpha) {
    return new Color(this.rac, this.r, this.g, this.b, newAlpha);
  }

  withAlphaRatio(ratio) {
    return new Color(this.rac, this.r, this.g, this.b, this.alpha * ratio);
  }

} // class Color


module.exports = Color;


},{"../Rac":2,"../util/utils":39}],31:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Fill color style for drawing.
* @alias Rac.Fill
*/
class Fill {

  constructor(rac, color = null) {
    utils.assertExists(rac);
    this.rac = rac;
    this.color = color;
  }

  static from(rac, something) {
    if (something instanceof Fill) {
      return something;
    }
    if (something instanceof Rac.Stroke) {
      return new Fill(rac, something.color);
    }
    if (something instanceof Rac.Color) {
      return new Fill(rac, something);
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Fill - something-type:${utils.typeName(something)}`);
  }

  styleWithStroke(stroke) {
    return new Rac.Style(this.rac, stroke, this);
  }

} // class Fill


module.exports = Fill;


},{"../Rac":2,"../util/utils":39}],32:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Stroke color and weight style for drawing.
* @alias Rac.Stroke
*/
class Stroke {

  constructor(rac, color = null, weight = 1) {
    utils.assertExists(rac, weight);
    this.rac = rac
    this.color = color;
    this.weight = weight;
  }

  withWeight(newWeight) {
    return new Stroke(this.rac, this.color, newWeight);
  }

  withAlpha(newAlpha) {
    if (this.color === null) {
      return new Stroke(this.rac, null, this.weight);
    }

    let newColor = this.color.withAlpha(newAlpha);
    return new Stroke(this.rac, newColor, this.weight);
  }

  styleWithFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Rac.Style(this.rac, this, fill);
  }

} // class Stroke


module.exports = Stroke;


},{"../Rac":2,"../util/utils":39}],33:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


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


},{"../Rac":2,"../util/utils":39}],34:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `instance.Color` function contains convenience methods and members
* for `{@link Rac.Color}` objects setup with the owning `Rac` instance.
* @namespace instance.Color
*/
module.exports = function attachRacColor(rac) {


  /**
  * Returns an `Color` with the given `rgba` values in the `[0,255]` range.
  * @name fromRgba
  * @memberof rac.Color#
  * @function
  */
  rac.Color.fromRgba = function(r, g, b, a = 255) {
    return Rac.Color.fromRgba(rac, r, g, b, a);
  };


  /**
  * A black `Color`.
  * @name black
  * @memberof rac.Color#
  */
  rac.Color.black   = rac.Color(0, 0, 0);

  /**
  * A red `Color`.
  * @name black
  * @memberof rac.Color#
  */
  rac.Color.red     = rac.Color(1, 0, 0);

  rac.Color.green   = rac.Color(0, 1, 0);
  rac.Color.blue    = rac.Color(0, 0, 1);
  rac.Color.yellow  = rac.Color(1, 1, 0);
  rac.Color.magenta = rac.Color(1, 0, 1);
  rac.Color.cyan    = rac.Color(0, 1, 1);
  rac.Color.white   = rac.Color(1, 1, 1);

} // attachRacColor


},{"../Rac":2}],35:[function(require,module,exports){
'use strict';


/**
* The `instance.Fill` function contains convenience methods and members
* for `{@link Rac.Fill}` objects setup with the owning `Rac` instance.
* @namespace instance.Fill
*/
module.exports = function attachRacFill(rac) {

  /**
  * A `Fill` without color. Removes the fill color when applied.
  * @name none
  * @memberof rac.Fill#
  */
  rac.Fill.none = rac.Fill(null);

} // attachRacFill


},{}],36:[function(require,module,exports){
'use strict';


/**
* The `instance.Stroke` function contains convenience methods and members
* for `{@link Rac.Stroke}` objects setup with the owning `Rac` instance.
* @namespace instance.Stroke
*/
module.exports = function attachRacPoint(rac) {

  /**
  * A `Stroke` without any color. Using or applying this stroke will
  * disable stroke drawing.
  *
  * @name none
  * @memberof rac.Stroke#
  */
  rac.Stroke.none = rac.Stroke(null)

} // attachRacStroke


},{}],37:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":39}],38:[function(require,module,exports){
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
  * When enabled the convenience static functions of this class will
  * build `Error` objects, instead of `Exception` objects.
  *
  * Used for tests runs in Jest, since throwing a custom object like
  * `Exception` within a matcher results in the expectation hanging
  * indefinitely.
  *
  * On the other hand, throwing an `Error` object in chrome causes the
  * displayed stack to be relative to the bundled file, instead of the
  * source map.
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


},{}],39:[function(require,module,exports){
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
* @param {...Object|primitive} parameters
* @returns {boolean}
* @name assertExists
* @memberof utils#
* @function
*/
exports.assertExists = function(...parameters) {
  parameters.forEach((item, index) => {
    if (item === null) {
      throw Rac.Exception.failedAssert(
        `Unexpected null element at index ${index}`);
    }
    if (item === undefined) {
      throw Rac.Exception.failedAssert(
        `Unexpected undefined element at index ${index}`);
    }
  });
}


/**
* Asserts that all `elements` are objects or the given `typeo`, otherwise a
* `{@link Rac.Exception.failedAssert}` is thrown.
*
* @param {function} type
* @param {...Object} elements
* @returns {boolean}
* @name assertType
* @memberof utils#
* @function
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
* @name assertNumber
* @memberof utils#
* @function
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
* @name assertString
* @memberof utils#
* @function
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
* @name assertBoolean
* @memberof utils#
* @function
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
* Convenience function for debugging.
*
* @returns {string}
* @name typeName
* @memberof utils#
* @function
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
* @name addConstant
* @memberof utils#
* @function
*/
exports.addConstant = function(obj, propName, value) {
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
* @returns {string}
*
* @name cutDigits
* @memberof utils#
* @function
*/
exports.cutDigits = function(number, digits = null) {
  return digits === null
    ? number.toString()
    : number.toFixed(digits);
}


},{"../Rac":2}]},{},[24])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvU2VnbWVudENvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BcmMuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlJheS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9wNURyYXdlci9QNURyYXdlci5qcyIsInNyYy9wNURyYXdlci9Qb2ludC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvU2VnbWVudC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZGVidWcuZnVuY3Rpb25zLmpzIiwic3JjL3A1RHJhd2VyL2RyYXcuZnVuY3Rpb25zLmpzIiwic3JjL3N0eWxlL0NvbG9yLmpzIiwic3JjL3N0eWxlL0ZpbGwuanMiLCJzcmMvc3R5bGUvU3Ryb2tlLmpzIiwic3JjL3N0eWxlL1N0eWxlLmpzIiwic3JjL3N0eWxlL2luc3RhbmNlLkNvbG9yLmpzIiwic3JjL3N0eWxlL2luc3RhbmNlLkZpbGwuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuU3Ryb2tlLmpzIiwic3JjL3V0aWwvRWFzZUZ1bmN0aW9uLmpzIiwic3JjL3V0aWwvRXhjZXB0aW9uLmpzIiwic3JjL3V0aWwvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeG1DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlU3RyaWN0JztcblxuLy8gUnVsZXIgYW5kIENvbXBhc3MgLSB2ZXJzaW9uXG5tb2R1bGUuZXhwb3J0cyA9ICcwLjEwLjEtZGV2LTYwMS0xYWQ4ZDg2J1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLy8gUnVsZXIgYW5kIENvbXBhc3NcbmNvbnN0IHZlcnNpb24gPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJyk7XG5cblxuLyoqXG4qIFRoaXMgbmFtZXNwYWNlIGxpc3RzIHV0aWxpdHkgZnVuY3Rpb25zIGF0dGFjaGVkIHRvIGFuIGluc3RhbmNlIG9mXG4qIGB7QGxpbmsgUmFjfWAgdXNlZCBwcm9kdWNlIGRyYXdhYmxlIGFuZCBvdGhlciBvYmplY3RzLCBhbmQgdG8gYWNjZXNzXG4qIHJlYWR5LWJ1aWxkIGNvbnZlbmllbmNlIG9iamVjdHMgbGlrZSB7QGxpbmsgaW5zdGFuY2UuQW5nbGUubm9ydGh9IG9yXG4qIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQuemVyb31gLlxuKlxuKiBEcmF3YWJsZSBhbmQgcmVsYXRlZCBvYmplY3RzIHJlcXVpcmUgYSByZWZlcmVuY2UgdG8gYSBgcmFjYCBpbnN0YW5jZSBpblxuKiBvcmRlciB0byBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucy4gVGhlc2UgZnVuY3Rpb25zIGJ1aWxkIG5ldyBvYmplY3RzXG4qIHVzaW5nIHRoZSBjYWxsaW5nIGBSYWNgIGluc3RhbmNlLCBhbmQgY29udGFpbiByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMgdGhhdCBhcmUgYWxzbyBzZXR1cCB3aXRoIHRoZSBzYW1lIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlXG4qL1xuXG5cbi8qKlxuKiBSb290IGNsYXNzIG9mIFJBQy4gQWxsIGRyYXdhYmxlLCBzdHlsZSwgY29udHJvbCwgYW5kIGRyYXdlciBjbGFzc2VzIGFyZVxuKiBjb250YWluZWQgaW4gdGhpcyBjbGFzcy5cbipcbiogQW4gaW5zdGFuY2UgbXVzdCBiZSBjcmVhdGVkIHdpdGggYG5ldyBSYWMoKWAgaW4gb3JkZXIgdG9cbiogYnVpbGQgZHJhd2FibGUgYW5kIG1vc3Qgb3RoZXIgb2JqZWN0cy5cbipcbiogVG8gcGVyZm9ybSBkcmF3aW5nIG9wZXJhdGlvbnMsIGEgZHJhd2VyIG11c3QgYmUgc2V0dXAgd2l0aFxuKiBge0BsaW5rIFJhYyNzZXR1cERyYXdlcn0uYFxuKi9cbmNsYXNzIFJhYyB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBSYWMuIFRoZSBuZXcgaW5zdGFuY2UgaGFzIG5vIGBkcmF3ZXJgIHNldHVwLlxuICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICogVmVyc2lvbiBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMudmVyc2lvbn1gLlxuICAgICogQG5hbWUgdmVyc2lvblxuICAgICogQG1lbWJlcm9mIFJhYyNcbiAgICAqL1xuICAgIHV0aWxzLmFkZENvbnN0YW50KHRoaXMsICd2ZXJzaW9uJywgdmVyc2lvbik7XG5cblxuICAgIC8qKlxuICAgICogVmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkgYmV0d2VlbiB0d28gbnVtZXJpYyB2YWx1ZXMuIFVzZWQgZm9yXG4gICAgKiB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGJlIGludGVnZXJzLCBsaWtlIHNjcmVlbiBjb29yZGluYXRlcy4gVXNlZCBieVxuICAgICogYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICAgKlxuICAgICogV2hlbiBjaGVja2luZyBmb3IgZXF1YWxpdHkgYHhgIGlzIGVxdWFsIHRvIG5vbi1pbmNsdXNpdmVcbiAgICAqIGAoeC1lcXVhbGl0eVRocmVzaG9sZCwgeCtlcXVhbGl0eVRocmVzaG9sZClgOlxuICAgICogKyBgeGAgaXMgKipub3QgZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZGBcbiAgICAqICsgYHhgIGlzICoqZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZC8yYFxuICAgICpcbiAgICAqIER1ZSB0byBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gc29tZSBvcGVydGF0aW9uIGxpa2UgaW50ZXJzZWN0aW9uc1xuICAgICogY2FuIHJldHVybiBvZGQgb3Igb3NjaWxhdGluZyB2YWx1ZXMuIFRoaXMgdGhyZXNob2xkIGlzIHVzZWQgdG8gc25hcFxuICAgICogdmFsdWVzIHRvbyBjbG9zZSB0byBhIGxpbWl0LCBhcyB0byBwcmV2ZW50IG9zY2lsYXRpbmcgZWZlY3RzIGluXG4gICAgKiB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIFZhbHVlIGlzIGJhc2VkIG9uIDEvMTAwMCBvZiBhIHBvaW50LCB0aGUgbWluaW1hbCBwZXJjZXB0aWJsZSBkaXN0YW5jZVxuICAgICogdGhlIHVzZXIgY2FuIHNlZS5cbiAgICAqL1xuICAgIHRoaXMuZXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMTtcblxuXG5cbiAgICAvKipcbiAgICAqIFZhbHVlIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5IGJldHdlZW4gdHdvIHVuaXRhcnkgbnVtZXJpYyB2YWx1ZXMuXG4gICAgKiBVc2VkIGZvciB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGV4aXN0IGluIHRoZSBgWzAsIDFdYCByYW5nZSwgbGlrZVxuICAgICogYHtAbGluayBSYWMuQW5nbGUjdHVybn1gLiBVc2VkIGJ5IGB7QGxpbmsgUmFjI3VuaXRhcnlFcXVhbHN9YC5cbiAgICAqXG4gICAgKiBFcXVhbGl0eSBsb2dpYyBpcyB0aGUgc2FtZSBhcyBge0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH1gLlxuICAgICpcbiAgICAqIFZhbHVlIGlzIGJhc2VkIG9uIDEvMDAwIG9mIHRoZSB0dXJuIG9mIGFuIGFyYyBvZiByYWRpdXMgNTAwIGFuZFxuICAgICogbGVuZ2h0IG9mIDE6IGAxLyg1MDAqNi4yOCkvMTAwMGBcbiAgICAqL1xuICAgIHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkID0gMC4wMDAwMDAzO1xuXG4gICAgLyoqXG4gICAgKiBEcmF3ZXIgb2YgdGhlIGluc3RhbmNlLiBUaGlzIG9iamVjdCBoYW5kbGVzIHRoZSBkcmF3aW5nIG9mIGFsbFxuICAgICogZHJhd2FibGUgb2JqZWN0IHVzaW5nIHRvIHRoaXMgaW5zdGFuY2Ugb2YgYFJhY2AuXG4gICAgKi9cbiAgICB0aGlzLmRyYXdlciA9IG51bGw7XG5cbiAgICByZXF1aXJlKCcuL2F0dGFjaEluc3RhbmNlRnVuY3Rpb25zJykodGhpcyk7XG5cbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkNvbG9yJykgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLlN0cm9rZScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkZpbGwnKSAgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFuZ2xlJykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50JykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlJheScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlNlZ21lbnQnKSh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFyYycpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkJlemllcicpICh0aGlzKTtcblxuICAgIC8vIERlcGVuZHMgb24gaW5zdGFuY2UuUG9pbnQgYW5kIGluc3RhbmNlLkFuZ2xlIGJlaW5nIGFscmVhZHkgc2V0dXBcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlRleHQnKSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAqIFNldHMgdGhlIGRyYXdlciBmb3IgdGhlIGluc3RhbmNlLiBDdXJyZW50bHkgb25seSBhIHA1LmpzIGluc3RhbmNlIGlzXG4gICogc3VwcG9ydGVkLlxuICAqXG4gICogVGhlIGRyYXdlciB3aWxsIGFsc28gcG9wdWxhdGUgc29tZSBjbGFzc2VzIHdpdGggcHJvdG90eXBlIGZ1bmN0aW9uc1xuICAqIHJlbGV2YW50IHRvIHRoZSBkcmF3ZXIuIEZvciBwNS5qcyB0aGlzIGluY2x1ZGUgYGFwcGx5YCBmdW5jdGlvbnMgZm9yXG4gICogY29sb3JzIGFuZCBzdHlsZSBvYmplY3QsIGFuZCBgdmVydGV4YCBmdW5jdGlvbnMgZm9yIGRyYXdhYmxlIG9iamVjdHMuXG4gICpcbiAgKiBAcGFyYW0ge1A1fSBwNUluc3RhbmNlXG4gICovXG4gIHNldHVwRHJhd2VyKHA1SW5zdGFuY2UpIHtcbiAgICB0aGlzLmRyYXdlciA9IG5ldyBSYWMuUDVEcmF3ZXIodGhpcywgcDVJbnN0YW5jZSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBge0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGEgRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge251bWJlcn0gYiBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKlxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICBlcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgbGV0IGRpZmYgPSBNYXRoLmFicyhhLWIpO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy5lcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBge0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBhIEZpcnN0IG51bWJlciB0byBjb21wYXJlXG4gICogQHBhcmFtIHtudW1iZXJ9IGIgU2Vjb25kIG51bWJlciB0byBjb21wYXJlXG4gICpcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgdW5pdGFyeUVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoYS1iKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cbn0gLy8gY2xhc3MgUmFjXG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYWM7XG5cblxuLy8gQWxsIGNsYXNzIChzdGF0aWMpIHByb3BlcnRpZXMgc2hvdWxkIGJlIGRlZmluZWQgb3V0c2lkZSBvZiB0aGUgY2xhc3Ncbi8vIGFzIHRvIHByZXZlbnQgY3ljbGljIGRlcGVuZGVuY3kgd2l0aCBSYWMuXG5cblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKGAuL3V0aWwvdXRpbHNgKTtcbi8qKlxuKiBDb250YWluZXIgb2YgdXRpbGl0eSBmdW5jdGlvbnMuIFNlZSBge0BsaW5rIHV0aWxzfWAgZm9yIHRoZSBhdmFpbGFibGVcbiogbWVtYmVycy5cbiovXG5SYWMudXRpbHMgPSB1dGlscztcblxuXG4vKipcbiogVmVyc2lvbiBvZiB0aGUgY2xhc3MuXG4qIEBuYW1lIHZlcnNpb25cbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50KFJhYywgJ3ZlcnNpb24nLCB2ZXJzaW9uKTtcblxuXG4vKipcbiogVGF1LCBlcXVhbCB0byBgTWF0aC5QSSAqIDJgLlxuKiBodHRwczovL3RhdWRheS5jb20vdGF1LW1hbmlmZXN0b1xuKiBAbmFtZSBUQVVcbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50KFJhYywgJ1RBVScsIE1hdGguUEkgKiAyKTtcblxuXG4vLyBFeGNlcHRpb25cblJhYy5FeGNlcHRpb24gPSByZXF1aXJlKCcuL3V0aWwvRXhjZXB0aW9uJyk7XG5cblxuLy8gUHJvdG90eXBlIGZ1bmN0aW9uc1xucmVxdWlyZSgnLi9hdHRhY2hQcm90b0Z1bmN0aW9ucycpKFJhYyk7XG5cblxuLy8gUDVEcmF3ZXJcblJhYy5QNURyYXdlciA9IHJlcXVpcmUoJy4vcDVEcmF3ZXIvUDVEcmF3ZXInKTtcblxuXG4vLyBDb2xvclxuUmFjLkNvbG9yID0gcmVxdWlyZSgnLi9zdHlsZS9Db2xvcicpO1xuXG5cbi8vIFN0cm9rZVxuUmFjLlN0cm9rZSA9IHJlcXVpcmUoJy4vc3R5bGUvU3Ryb2tlJyk7XG5SYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zKFJhYy5TdHJva2UpO1xuXG5cbi8vIEZpbGxcblJhYy5GaWxsID0gcmVxdWlyZSgnLi9zdHlsZS9GaWxsJyk7XG5SYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zKFJhYy5GaWxsKTtcblxuXG4vLyBTdHlsZVxuUmFjLlN0eWxlID0gcmVxdWlyZSgnLi9zdHlsZS9TdHlsZScpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuU3R5bGUpO1xuXG5cbi8vIEFuZ2xlXG5SYWMuQW5nbGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0FuZ2xlJyk7XG5cblxuLy8gUG9pbnRcblJhYy5Qb2ludCA9IHJlcXVpcmUoJy4vZHJhd2FibGUvUG9pbnQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlBvaW50KTtcblxuXG4vLyBSYXlcblJhYy5SYXkgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1JheScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuUmF5KTtcblxuXG4vLyBTZWdtZW50XG5SYWMuU2VnbWVudCA9IHJlcXVpcmUoJy4vZHJhd2FibGUvU2VnbWVudCcpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuU2VnbWVudCk7XG5cblxuLy8gQXJjXG5SYWMuQXJjID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9BcmMnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLkFyYyk7XG5cblxuLy8gVGV4dFxuUmFjLlRleHQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1RleHQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlRleHQpO1xuXG5cbi8vIEJlemllclxuUmFjLkJlemllciA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQmV6aWVyJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5CZXppZXIpO1xuXG5cbi8vIENvbXBvc2l0ZVxuUmFjLkNvbXBvc2l0ZSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQ29tcG9zaXRlJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5Db21wb3NpdGUpO1xuXG5cbi8vIFNoYXBlXG5SYWMuU2hhcGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1NoYXBlJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5TaGFwZSk7XG5cblxuLy8gRWFzZUZ1bmN0aW9uXG5SYWMuRWFzZUZ1bmN0aW9uID0gcmVxdWlyZSgnLi91dGlsL0Vhc2VGdW5jdGlvbicpO1xuXG5cbi8vIENvbnRyb2xcblJhYy5Db250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL0NvbnRyb2wnKTtcblxuXG4vLyBTZWdtZW50Q29udHJvbFxuUmFjLlNlZ21lbnRDb250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL1NlZ21lbnRDb250cm9sJyk7XG5cblxuLy8gQXJjQ29udHJvbFxuUmFjLkFyY0NvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvQXJjQ29udHJvbCcpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi9SYWMnKTtcblxuXG4vLyBBdHRhY2hlcyB0aGUgY29udmVuaWVuY2UgZnVuY3Rpb25zIHRvIGNyZWF0ZSBvYmplY3RzIHdpdGggdGhpcyBpbnN0YW5jZVxuLy8gb2YgUmFjLiBUaGVzZSBmdW5jdGlvbnMgYXJlIGF0dGFjaGVkIGFzIHByb3BlcnRpZXMgKGluc3RlYWQgb2YgaW50byB0aGVcbi8vIHByb3RvdHlwZSkgYmVjYXVzZSB0aGVzZSBhcmUgbGF0ZXIgcG9wdWxhdGVkIHdpdGggbW9yZSBwcm9wZXJ0aWVzIGFuZFxuLy8gbWV0aG9kcywgYW5kIHRodXMgbmVlZCB0byBiZSBhbiBpbmRlcGVuZGVudCBpbnN0YW5jZS5cbi8vXG4vLyBJbnRlbmRlZCB0byByZWNlaXZlIHRoZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQ29sb3JgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQ29sb3J9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByXG4gICogQHBhcmFtIHtudW1iZXJ9IGdcbiAgKiBAcGFyYW0ge251bWJlcn0gYlxuICAqIEBwYXJhbSB7bnVtYmVyPX0gYVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQ29sb3JcbiAgKi9cbiAgcmFjLkNvbG9yID0gZnVuY3Rpb24gbWFrZUNvbG9yKHIsIGcsIGIsIGFscGhhID0gMSkge1xuICAgIHJldHVybiBuZXcgUmFjLkNvbG9yKHRoaXMsIHIsIGcsIGIsIGFscGhhKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBTdHJva2VgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU3Ryb2tlfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Db2xvcj19IGNvbG9yXG4gICogQHBhcmFtIHtudW1iZXI9fSB3ZWlnaHRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5TdHJva2VcbiAgKi9cbiAgcmFjLlN0cm9rZSA9IGZ1bmN0aW9uIG1ha2VTdHJva2UoY29sb3IgPSBudWxsLCB3ZWlnaHQgPSAxKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMsIGNvbG9yLCB3ZWlnaHQpO1xuICB9XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEZpbGxgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuRmlsbH1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29sb3I9fSBjb2xvclxuICAqIEByZXR1cm5zIHtSYWMuRmlsbH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuRmlsbFxuICAqL1xuICByYWMuRmlsbCA9IGZ1bmN0aW9uIG1ha2VGaWxsKGNvbG9yID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLkZpbGwodGhpcywgY29sb3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFN0eWxlYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlN0eWxlfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TdHJva2U9fSBzdHJva2VcbiAgKiBAcGFyYW0ge1JhYy5GaWxsPX0gZmlsbFxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuU3R5bGVcbiAgKi9cbiAgcmFjLlN0eWxlID0gZnVuY3Rpb24gbWFrZVN0eWxlKHN0cm9rZSA9IG51bGwsIGZpbGwgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGUodGhpcywgc3Ryb2tlLCBmaWxsKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBBbmdsZWAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BbmdsZX1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHR1cm4gLSBUaGUgdHVybiB2YWx1ZSBvZiB0aGUgYW5nbGUsIGluIHRoZSByYW5nZSBgW08sMSlgXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGVcbiAgKi9cbiAgcmFjLkFuZ2xlID0gZnVuY3Rpb24gbWFrZUFuZ2xlKHR1cm4pIHtcbiAgICByZXR1cm4gbmV3IFJhYy5BbmdsZSh0aGlzLCB0dXJuKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBQb2ludGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnRcbiAgKi9cbiAgcmFjLlBvaW50ID0gZnVuY3Rpb24gbWFrZVBvaW50KHgsIHkpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBSYXlgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUmF5fWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZVxuICAqXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlJheVxuICAqL1xuICByYWMuUmF5ID0gZnVuY3Rpb24gbWFrZVJheSh4LCB5LCBhbmdsZSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcywgc3RhcnQsIGFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBTZWdtZW50YCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlNlZ21lbnR9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aFxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5TZWdtZW50XG4gICovXG4gIHJhYy5TZWdtZW50ID0gZnVuY3Rpb24gbWFrZVNlZ21lbnQoeCwgeSwgYW5nbGUsIGxlbmd0aCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIGFuZ2xlKTtcbiAgICBjb25zdCByYXkgPSBuZXcgUmFjLlJheSh0aGlzLCBzdGFydCwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcywgcmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEFyY2Agc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BcmN9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IHN0YXJ0XG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfG51bWJlcn0gW2VuZD1udWxsXVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXVxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFyY1xuICAqL1xuICByYWMuQXJjID0gZnVuY3Rpb24gbWFrZUFyYyh4LCB5LCByYWRpdXMsIHN0YXJ0ID0gdGhpcy5BbmdsZS56ZXJvLCBlbmQgPSBudWxsLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgY2VudGVyID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBzdGFydCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIHN0YXJ0KTtcbiAgICBlbmQgPSBlbmQgPT09IG51bGxcbiAgICAgID8gc3RhcnRcbiAgICAgIDogUmFjLkFuZ2xlLmZyb20odGhpcywgZW5kKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0LCBlbmQsIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgVGV4dGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5UZXh0fWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBmb3JtYXRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuVGV4dFxuICAqL1xuICByYWMuVGV4dCA9IGZ1bmN0aW9uIG1ha2VUZXh0KHgsIHksIHN0cmluZywgZm9ybWF0KSB7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcywgcG9pbnQsIHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBCZXppZXJgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQmV6aWVyfWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRYXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0WVxuICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydEFuY2hvclhcbiAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRBbmNob3JZXG4gICogQHBhcmFtIHtudW1iZXJ9IGVuZEFuY2hvclhcbiAgKiBAcGFyYW0ge251bWJlcn0gZW5kQW5jaG9yWVxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRYXG4gICogQHBhcmFtIHtudW1iZXJ9IGVuZFlcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQmV6aWVyfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5CZXppZXJcbiAgKi9cbiAgcmFjLkJlemllciA9IGZ1bmN0aW9uIG1ha2VCZXppZXIoXG4gICAgc3RhcnRYLCBzdGFydFksIHN0YXJ0QW5jaG9yWCwgc3RhcnRBbmNob3JZLFxuICAgIGVuZEFuY2hvclgsIGVuZEFuY2hvclksIGVuZFgsIGVuZFkpXG4gIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgc3RhcnRYLCBzdGFydFkpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBzdGFydEFuY2hvclgsIHN0YXJ0QW5jaG9yWSk7XG4gICAgY29uc3QgZW5kQW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBlbmRBbmNob3JYLCBlbmRBbmNob3JZKTtcbiAgICBjb25zdCBlbmQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIGVuZFgsIGVuZFkpO1xuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgfVxuXG59OyAvLyBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWwvdXRpbHMnKTtcblxuXG4vLyBBdHRhY2hlcyBmdW5jdGlvbnMgdG8gYXR0YWNoIGRyYXdpbmcgYW5kIGFwcGx5IG1ldGhvZHMgdG8gb3RoZXJcbi8vIHByb3RvdHlwZXMuXG4vLyBJbnRlbmRlZCB0byByZWNlaXZlIHRoZSBSYWMgY2xhc3MgYXMgcGFyYW1ldGVyLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hQcm90b0Z1bmN0aW9ucyhSYWMpIHtcblxuICBmdW5jdGlvbiBhc3NlcnREcmF3ZXIoZHJhd2FibGUpIHtcbiAgICBpZiAoZHJhd2FibGUucmFjID09IG51bGwgfHwgZHJhd2FibGUucmFjLmRyYXdlciA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmRyYXdlck5vdFNldHVwKFxuICAgICAgICBgZHJhd2FibGUtdHlwZToke3V0aWxzLnR5cGVOYW1lKGRyYXdhYmxlKX1gKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIENvbnRhaW5lciBvZiBwcm90b3R5cGUgZnVuY3Rpb25zIGZvciBkcmF3YWJsZSBjbGFzc2VzLlxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucyA9IHt9O1xuXG4gIC8vIEFkZHMgdG8gdGhlIGdpdmVuIGNsYXNzIHByb3RvdHlwZSBhbGwgdGhlIGZ1bmN0aW9ucyBjb250YWluZWQgaW5cbiAgLy8gYFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zYC4gVGhlc2UgYXJlIGZ1bmN0aW9ucyBzaGFyZWQgYnkgYWxsXG4gIC8vIGRyYXdhYmxlIG9iamVjdHMgKEUuZy4gYGRyYXcoKWAgYW5kIGBkZWJ1ZygpYCkuXG4gIFJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSBmdW5jdGlvbihjbGFzc09iaikge1xuICAgIE9iamVjdC5rZXlzKFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY2xhc3NPYmoucHJvdG90eXBlW25hbWVdID0gUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnNbbmFtZV07XG4gICAgfSk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmRyYXcgPSBmdW5jdGlvbihzdHlsZSA9IG51bGwpe1xuICAgIGFzc2VydERyYXdlcih0aGlzKTtcbiAgICB0aGlzLnJhYy5kcmF3ZXIuZHJhd09iamVjdCh0aGlzLCBzdHlsZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5kZWJ1ZyA9IGZ1bmN0aW9uKGRyYXdzVGV4dCA9IGZhbHNlKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG5cbiAgICB0aGlzLnJhYy5kcmF3ZXIuZGVidWdPYmplY3QodGhpcywgZHJhd3NUZXh0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZyA9IGZ1bmN0aW9uKG1lc3NhZ2UgPSBudWxsKXtcbiAgICBsZXQgY29hbGVzY2VkTWVzc2FnZSA9IG1lc3NhZ2UgPz8gJyVvJztcbiAgICBjb25zb2xlLmxvZyhjb2FsZXNjZWRNZXNzYWdlLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8vIFRPRE86IGhhcyB0byBiZSBtb3ZlZCB0byByYWMgaW5zdGFuY2VcbiAgUmFjLnN0YWNrID0gW107XG5cbiAgUmFjLnN0YWNrLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUmFjLnN0YWNrW1JhYy5zdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnB1c2ggPSBmdW5jdGlvbigpIHtcbiAgICBSYWMuc3RhY2sucHVzaCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBSYWMuc3RhY2sucG9wKCk7XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wZWVrID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFJhYy5zdGFjay5wZWVrKCk7XG4gIH1cblxuICAvLyBUT0RPOiBzaGFwZSBhbmQgY29tcG9zaXRlIHNob3VsZCBiZSBzdGFja3MsIHNvIHRoYXQgc2V2ZXJhbCBjYW4gYmVcbiAgLy8gc3RhcnRlZCBpbiBkaWZmZXJlbnQgY29udGV4dHNcbiAgLy8gVE9ETzogaGFzIHRvIGJlIG1vdmVkIHRvIHJhYyBpbnN0YW5jZVxuICBSYWMuY3VycmVudFNoYXBlID0gbnVsbDtcbiAgUmFjLmN1cnJlbnRDb21wb3NpdGUgPSBudWxsO1xuXG4gIFJhYy5wb3BTaGFwZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzaGFwZSA9IFJhYy5jdXJyZW50U2hhcGU7XG4gICAgUmFjLmN1cnJlbnRTaGFwZSA9IG51bGw7XG4gICAgcmV0dXJuIHNoYXBlO1xuICB9XG5cbiAgUmFjLnBvcENvbXBvc2l0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjb21wb3NpdGUgPSBSYWMuY3VycmVudENvbXBvc2l0ZTtcbiAgICBSYWMuY3VycmVudENvbXBvc2l0ZSA9IG51bGw7XG4gICAgcmV0dXJuIGNvbXBvc2l0ZTtcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoUmFjLmN1cnJlbnRTaGFwZSA9PT0gbnVsbCkge1xuICAgICAgUmFjLmN1cnJlbnRTaGFwZSA9IG5ldyBSYWMuU2hhcGUodGhpcy5yYWMpO1xuICAgIH1cblxuICAgIHRoaXMuYXR0YWNoVG8oUmFjLmN1cnJlbnRTaGFwZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBSYWMucG9wU2hhcGUoKTtcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBvcFNoYXBlVG9Db21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2hhcGUgPSBSYWMucG9wU2hhcGUoKTtcbiAgICBzaGFwZS5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuYXR0YWNoVG9Db21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoUmFjLmN1cnJlbnRDb21wb3NpdGUgPT09IG51bGwpIHtcbiAgICAgIFJhYy5jdXJyZW50Q29tcG9zaXRlID0gbmV3IFJhYy5Db21wb3NpdGUodGhpcy5yYWMpO1xuICAgIH1cblxuICAgIHRoaXMuYXR0YWNoVG8oUmFjLmN1cnJlbnRDb21wb3NpdGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFJhYy5wb3BDb21wb3NpdGUoKTtcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvID0gZnVuY3Rpb24oc29tZUNvbXBvc2l0ZSkge1xuICAgIGlmIChzb21lQ29tcG9zaXRlIGluc3RhbmNlb2YgUmFjLkNvbXBvc2l0ZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGQodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5TaGFwZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgYXR0YWNoVG8gY29tcG9zaXRlIC0gc29tZUNvbXBvc2l0ZS10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZUNvbXBvc2l0ZSl9YCk7XG4gIH07XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3Igc3R5bGUgY2xhc3Nlcy5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuc3R5bGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBzdHlsZSBvYmplY3RzIChFLmcuIGBhcHBseSgpYCkuXG4gIFJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMgPSBmdW5jdGlvbihjbGFzc09iaikge1xuICAgIE9iamVjdC5rZXlzKFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY2xhc3NPYmoucHJvdG90eXBlW25hbWVdID0gUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNbbmFtZV07XG4gICAgfSk7XG4gIH1cblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmFwcGx5ID0gZnVuY3Rpb24oKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmFwcGx5T2JqZWN0KHRoaXMpO1xuICB9O1xuXG59OyAvLyBhdHRhY2hQcm90b0Z1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8vIFRPRE86IGZpeCB1c2VzIG9mIHNvbWVBbmdsZVxuXG5cbi8qKlxuKiBDb250cm9sIHRoYXQgdXNlcyBhbiBBcmMgYXMgYW5jaG9yLlxuKiBAYWxpYXMgUmFjLkFyY0NvbnRyb2xcbiovXG5jbGFzcyBBcmNDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8vIENyZWF0ZXMgYSBuZXcgQ29udHJvbCBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBgdmFsdWVgIGFuZCBhblxuICAvLyBgYW5nbGVEaXN0YW5jZWAgZnJvbSBgc29tZUFuZ2xlRGlzdGFuY2VgLlxuICAvLyBCeSBkZWZhdWx0IHRoZSB2YWx1ZSByYW5nZSBpcyBbMCwxXSBhbmQgbGltaXRzIGFyZSBzZXQgdG8gYmUgdGhlIGVxdWFsXG4gIC8vIGFzIGBzdGFydFZhbHVlYCBhbmQgYGVuZFZhbHVlYC5cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgc29tZUFuZ2xlRGlzdGFuY2UsIHN0YXJ0VmFsdWUgPSAwLCBlbmRWYWx1ZSA9IDEpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCB2YWx1ZSwgc29tZUFuZ2xlRGlzdGFuY2UsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIC8vIEFuZ2xlIGRpc3RhbmNlIGZvciB0aGUgY29waWVkIGFuY2hvciBvYmplY3QuXG4gICAgdGhpcy5hbmdsZURpc3RhbmNlID0gUmFjLkFuZ2xlLmZyb20ocmFjLCBzb21lQW5nbGVEaXN0YW5jZSk7XG5cbiAgICAvLyBgQXJjYGAgdG8gd2hpY2ggdGhlIGNvbnRyb2wgd2lsbCBiZSBhbmNob3JlZC4gV2hlbiB0aGUgY29udHJvbCBpc1xuICAgIC8vIGRyYXduIGFuZCBpbnRlcmFjdGVkIGEgY29weSBvZiB0aGUgYW5jaG9yIGlzIGNyZWF0ZWQgd2l0aCB0aGVcbiAgICAvLyBjb250cm9sJ3MgYGFuZ2xlRGlzdGFuY2VgLlxuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcbiAgfVxuXG4gIHNldFZhbHVlV2l0aEFuZ2xlRGlzdGFuY2Uoc29tZUFuZ2xlRGlzdGFuY2UpIHtcbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzb21lQW5nbGVEaXN0YW5jZSlcbiAgICBsZXQgYW5nbGVEaXN0YW5jZVJhdGlvID0gYW5nbGVEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZU9mKGFuZ2xlRGlzdGFuY2VSYXRpbyk7XG4gIH1cblxuICBzZXRMaW1pdHNXaXRoQW5nbGVEaXN0YW5jZUluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHRoaXMudmFsdWVPZihzdGFydEluc2V0LnR1cm4gLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKCh0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC0gZW5kSW5zZXQudHVybikgLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpKTtcbiAgfVxuXG4gIC8vIFRPRE86IHJlbmFtZSBjb250cm9sLmNlbnRlciB0byBjb250cm9sLmtub2Igb3Igc2ltaWxhclxuICAvLyBSZXR1cm5zIHRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIGBhbmNob3Iuc3RhcnRgIHRvIHRoZSBjb250cm9sIGNlbnRlci5cbiAgZGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMucmF0aW9WYWx1ZSgpKTtcbiAgfVxuXG4gIGNlbnRlcigpIHtcbiAgICAvLyBOb3QgcG9zaWJsZSB0byBjYWxjdWxhdGUgYSBjZW50ZXJcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aEFuZ2xlRGlzdGFuY2UodGhpcy5kaXN0YW5jZSgpKS5lbmRQb2ludCgpO1xuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgYGFuY2hvcmAgd2l0aCB0aGUgY29udHJvbCdzXG4gIC8vIGBhbmdsZURpc3RhbmNlYC5cbiAgY29weUFuY2hvcigpIHtcbiAgICAvLyBObyBhbmNob3IgdG8gY29weVxuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci53aXRoQW5nbGVEaXN0YW5jZSh0aGlzLmFuZ2xlRGlzdGFuY2UpO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICBsZXQgYW5jaG9yQ29weSA9IHRoaXMuY29weUFuY2hvcigpO1xuXG4gICAgbGV0IGFuY2hvclN0eWxlID0gdGhpcy5zdHlsZSAhPT0gbnVsbFxuICAgICAgPyB0aGlzLnN0eWxlLndpdGhGaWxsKHRoaXMucmFjLkZpbGwubm9uZSlcbiAgICAgIDogbnVsbDtcbiAgICBhbmNob3JDb3B5LmRyYXcoYW5jaG9yU3R5bGUpO1xuXG4gICAgbGV0IGNlbnRlciA9IHRoaXMuY2VudGVyKCk7XG4gICAgbGV0IGFuZ2xlID0gYW5jaG9yQ29weS5jZW50ZXIuYW5nbGVUb1BvaW50KGNlbnRlcik7XG5cbiAgICAvLyBWYWx1ZSBtYXJrZXJzXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBsZXQgbWFya2VyUmF0aW8gPSB0aGlzLnJhdGlvT2YoaXRlbSk7XG4gICAgICBpZiAobWFya2VyUmF0aW8gPCAwIHx8IG1hcmtlclJhdGlvID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlckFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZShtYXJrZXJSYXRpbyk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBhbmNob3JDb3B5LnNoaWZ0QW5nbGUobWFya2VyQW5nbGVEaXN0YW5jZSk7XG4gICAgICBsZXQgcG9pbnQgPSBhbmNob3JDb3B5LnBvaW50QXRBbmdsZShtYXJrZXJBbmdsZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIHBvaW50LCBtYXJrZXJBbmdsZS5wZXJwZW5kaWN1bGFyKCFhbmNob3JDb3B5LmNsb2Nrd2lzZSkpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLy8gQ29udHJvbCBidXR0b25cbiAgICBjZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IHJhdGlvVmFsdWUgPSB0aGlzLnJhdGlvVmFsdWUoKTtcblxuICAgIC8vIE5lZ2F0aXZlIGFycm93XG4gICAgaWYgKHJhdGlvVmFsdWUgPj0gdGhpcy5yYXRpb1N0YXJ0TGltaXQoKSArIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgbGV0IG5lZ0FuZ2xlID0gYW5nbGUucGVycGVuZGljdWxhcihhbmNob3JDb3B5LmNsb2Nrd2lzZSkuaW52ZXJzZSgpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGNlbnRlciwgbmVnQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aXZlIGFycm93XG4gICAgaWYgKHJhdGlvVmFsdWUgPD0gdGhpcy5yYXRpb0VuZExpbWl0KCkgLSB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIGxldCBwb3NBbmdsZSA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoYW5jaG9yQ29weS5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGNlbnRlciwgcG9zQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHRoaXMuc3R5bGUpO1xuXG4gICAgLy8gU2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBjZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cyAqIDEuNSkuZHJhdyhSYWMuQ29udHJvbC5wb2ludGVyU3R5bGUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJDb250cm9sQ2VudGVyLCBhbmNob3JDb3B5KSB7XG4gICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhbmNob3JDb3B5LmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnJhdGlvU3RhcnRMaW1pdCgpKTtcbiAgICBsZXQgZW5kSW5zZXQgPSBhbmdsZURpc3RhbmNlLm11bHRPbmUoMSAtIHRoaXMucmF0aW9FbmRMaW1pdCgpKTtcblxuICAgIGxldCBzZWxlY3Rpb25BbmdsZSA9IGFuY2hvckNvcHkuY2VudGVyXG4gICAgICAuYW5nbGVUb1BvaW50KHBvaW50ZXJDb250cm9sQ2VudGVyKTtcbiAgICBzZWxlY3Rpb25BbmdsZSA9IGFuY2hvckNvcHkuY2xhbXBUb0FuZ2xlcyhzZWxlY3Rpb25BbmdsZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBhbmNob3JDb3B5LmRpc3RhbmNlRnJvbVN0YXJ0KHNlbGVjdGlvbkFuZ2xlKTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbmV3RGlzdGFuY2UudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVPZihsZW5ndGhSYXRpbyk7XG4gIH1cblxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGFuY2hvckNvcHksIHBvaW50ZXJPZmZzZXQpIHtcbiAgICBhbmNob3JDb3B5LmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IGFuY2hvckNvcHkuYW5nbGVEaXN0YW5jZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IG1hcmtlclJhdGlvID0gdGhpcy5yYXRpb09mKGl0ZW0pO1xuICAgICAgaWYgKG1hcmtlclJhdGlvIDwgMCB8fCBtYXJrZXJSYXRpbyA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGFuY2hvckNvcHkuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUobWFya2VyUmF0aW8pKTtcbiAgICAgIGxldCBtYXJrZXJQb2ludCA9IGFuY2hvckNvcHkucG9pbnRBdEFuZ2xlKG1hcmtlckFuZ2xlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgbWFya2VyUG9pbnQsIG1hcmtlckFuZ2xlLnBlcnBlbmRpY3VsYXIoIWFuY2hvckNvcHkuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgbGV0IHJhdGlvU3RhcnRMaW1pdCA9IHRoaXMucmF0aW9TdGFydExpbWl0KCk7XG4gICAgaWYgKHJhdGlvU3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5BbmdsZSA9IGFuY2hvckNvcHkuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUocmF0aW9TdGFydExpbWl0KSk7XG4gICAgICBsZXQgbWluUG9pbnQgPSBhbmNob3JDb3B5LnBvaW50QXRBbmdsZShtaW5BbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtaW5BbmdsZS5wZXJwZW5kaWN1bGFyKGFuY2hvckNvcHkuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIG1hcmtlckFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBsZXQgcmF0aW9FbmRMaW1pdCA9IHRoaXMucmF0aW9FbmRMaW1pdCgpO1xuICAgIGlmIChyYXRpb0VuZExpbWl0IDwgMSkge1xuICAgICAgbGV0IG1heEFuZ2xlID0gYW5jaG9yQ29weS5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UubXVsdE9uZShyYXRpb0VuZExpbWl0KSk7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBhbmNob3JDb3B5LnBvaW50QXRBbmdsZShtYXhBbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtYXhBbmdsZS5wZXJwZW5kaWN1bGFyKCFhbmNob3JDb3B5LmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1heFBvaW50LCBtYXJrZXJBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlck9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgYXJjIGNvbnRyb2wgZHJhZ2dpbmcgdmlzdWFscyFcblxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KFJhYy5Db250cm9sLnBvaW50ZXJTdHlsZSk7XG4gIH1cblxufSAvLyBjbGFzcyBBcmNDb250cm9sXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmNDb250cm9sO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8vIFRPRE86IGZpeCB1c2VzIG9mIHNvbWVBbmdsZVxuXG5cbmNsYXNzIENvbnRyb2xTZWxlY3Rpb257XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHBvaW50ZXJDZW50ZXIpIHtcbiAgICAvLyBTZWxlY3RlZCBjb250cm9sIGluc3RhbmNlLlxuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgLy8gQ29weSBvZiB0aGUgY29udHJvbCBhbmNob3IsIHNvIHRoYXQgdGhlIGNvbnRyb2wgY2FuIG1vdmUgdGllZCB0b1xuICAgIC8vIHRoZSBkcmF3aW5nLCB3aGlsZSB0aGUgaW50ZXJhY3Rpb24gcmFuZ2UgcmVtYWlucyBmaXhlZC5cbiAgICB0aGlzLmFuY2hvckNvcHkgPSBjb250cm9sLmNvcHlBbmNob3IoKTtcbiAgICAvLyBTZWdtZW50IGZyb20gdGhlIGNhcHR1cmVkIHBvaW50ZXIgcG9zaXRpb24gdG8gdGhlIGNvbnRybyBjZW50ZXIsXG4gICAgLy8gdXNlZCB0byBhdHRhY2ggdGhlIGNvbnRyb2wgdG8gdGhlIHBvaW50IHdoZXJlIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICAgLy8gUG9pbnRlciBpcyBhdCBgc2VnbWVudC5zdGFydGAgYW5kIGNvbnRyb2wgY2VudGVyIGlzIGF0IGBzZWdtZW50LmVuZGAuXG4gICAgdGhpcy5wb2ludGVyT2Zmc2V0ID0gcG9pbnRlckNlbnRlci5zZWdtZW50VG9Qb2ludChjb250cm9sLmNlbnRlcigpKTtcbiAgfVxuXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlcikge1xuICAgIHRoaXMuY29udHJvbC5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIHRoaXMuYW5jaG9yQ29weSwgdGhpcy5wb2ludGVyT2Zmc2V0KTtcbiAgfVxufVxuXG5cbi8qKlxuKiBQYXJlbnQgY2xhc3MgZm9yIGFsbCBjb250cm9scyBmb3IgbWFuaXB1bGF0aW5nIGEgdmFsdWUgd2l0aCB0aGUgcG9pbnRlci5cbiogUmVwcmVzZW50cyBhIGNvbnRyb2wgd2l0aCBhIHZhbHVlLCB2YWx1ZS1yYW5nZSwgbGltaXRzLCBtYXJrZXJzLCBhbmRcbiogZHJhd2luZyBzdHlsZS4gQnkgZGVmYXVsdCB0aGUgY29udHJvbCByZXR1cm5zIGEgYHZhbHVlYCBpbiB0aGUgcmFuZ2VcbiogWzAsMV0gY29yZXNwb25kaW5nIHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgY29udHJvbCBjZW50ZXIgaW4gcmVsYXRpb24gdG9cbiogdGhlIGFuY2hvciBzaGFwZS4gVGhlIHZhbHVlLXJhbmdlIGlzIGRlZmluZWQgYnkgYHN0YXJ0VmFsdWVgIGFuZFxuKiBgZW5kVmFsdWVgLlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xcbiovXG5cbmNsYXNzIENvbnRyb2wge1xuXG4gIC8vIFJhZGl1cyBvZiB0aGUgY2ljbGUgZHJhd24gZm9yIHRoZSBjb250cm9sIGNlbnRlci5cbiAgc3RhdGljIHJhZGl1cyA9IDIyO1xuXG4gIC8vIENvbGxlY3Rpb24gb2YgYWxsIGNvbnRyb2xzIHRoYXQgYXJlIGRyYXduIHdpdGggYGRyYXdDb250cm9scygpYFxuICAvLyBhbmQgZXZhbHVhdGVkIGZvciBzZWxlY3Rpb24gd2l0aCB0aGUgYHBvaW50ZXIuLi4oKWAgZnVuY3Rpb25zLlxuICBzdGF0aWMgY29udHJvbHMgPSBbXTtcblxuICAvLyBMYXN0IFBvaW50IG9mIHRoZSBwb2ludGVyIHBvc2l0aW9uIHdoZW4gaXQgd2FzIHByZXNzZWQsIG9yIGxhc3RcbiAgLy8gQ29udHJvbCBpbnRlcmFjdGVkIHdpdGguIFNldCB0byBgbnVsbGAgd2hlbiB0aGVyZSBoYXMgYmVlbiBub1xuICAvLyBpbnRlcmFjdGlvbiB5ZXQgYW5kIHdoaWxlIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbC5cbiAgc3RhdGljIGxhc3RQb2ludGVyID0gbnVsbDtcblxuICAvLyBTdHlsZSB1c2VkIGZvciB2aXN1YWwgZWxlbWVudHMgcmVsYXRlZCB0byBzZWxlY3Rpb24gYW5kIHBvaW50ZXJcbiAgLy8gaW50ZXJhY3Rpb24uXG4gIHN0YXRpYyBwb2ludGVyU3R5bGUgPSBudWxsO1xuXG4gIC8vIFNlbGVjdGlvbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLCBvciBgbnVsbGAgaWZcbiAgLy8gdGhlcmUgaXMgbm8gc2VsZWN0aW9uLlxuICBzdGF0aWMgc2VsZWN0aW9uID0gbnVsbDtcblxuXG4gIHN0YXRpYyBTZWxlY3Rpb24gPSBDb250cm9sU2VsZWN0aW9uO1xuXG5cbiAgLy8gQ3JlYXRlcyBhIG5ldyBDb250cm9sIGluc3RhbmNlIHdpdGggdGhlIGdpdmVuIGB2YWx1ZWAsIGEgZGVmYXVsdFxuICAvLyB2YWx1ZS1yYW5nZSBvZiBbMCwxXSwgYW5kIGxpbWl0cyBzZXQgZXF1YWwgdG8gdGhlIHZhbHVlLXJhbmdlLlxuICBjb25zdHJ1Y3RvcihyYWMsIHZhbHVlLCBzdGFydFZhbHVlID0gMCwgZW5kVmFsdWUgPSAxKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgdmFsdWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLy8gVmFsdWUgaXMgYSBudW1iZXIgYmV0d2VlbiBzdGFydFZhbHVlIGFuZCBlbmRWYWx1ZS5cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAvLyBTdGFydCBhbmQgZW5kIG9mIHRoZSB2YWx1ZSByYW5nZS5cbiAgICB0aGlzLnN0YXJ0VmFsdWUgPSBzdGFydFZhbHVlO1xuICAgIHRoaXMuZW5kVmFsdWUgPSBlbmRWYWx1ZTtcblxuICAgIC8vIExpbWl0cyB0byB3aGljaCB0aGUgY29udHJvbCBjYW4gYmUgZHJhZ2dlZC4gSW50ZXJwcmV0ZWQgYXMgdmFsdWVzIGluXG4gICAgLy8gdGhlIHZhbHVlLXJhbmdlLlxuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0VmFsdWU7XG4gICAgdGhpcy5lbmRMaW1pdCA9IGVuZFZhbHVlO1xuXG4gICAgLy8gQ29sbGVjdGlvbiBvZiB2YWx1ZXMgYXQgd2hpY2ggbWFya2VycyBhcmUgZHJhd24uXG4gICAgdGhpcy5tYXJrZXJzID0gW107XG5cbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGB2YWx1ZWAgb2YgdGhlIGNvbnRyb2wgaW4gYSBbMCwxXSByYW5nZS5cbiAgcmF0aW9WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXRpb09mKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgYHN0YXJ0TGltaXRgIG9mIHRoZSBjb250cm9sIGluIGEgWzAsMV0gcmFuZ2UuXG4gIHJhdGlvU3RhcnRMaW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXRpb09mKHRoaXMuc3RhcnRMaW1pdCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBgZW5kTGltaXRgIG9mIHRoZSBjb250cm9sIGluIGEgWzAsMV0gcmFuZ2UuXG4gIHJhdGlvRW5kTGltaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF0aW9PZih0aGlzLmVuZExpbWl0KTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgb2YgdGhlIGdpdmVuIGB2YWx1ZWAgaW4gYSBbMCwxXSByYW5nZS5cbiAgcmF0aW9PZih2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgLSB0aGlzLnN0YXJ0VmFsdWUpIC8gdGhpcy52YWx1ZVJhbmdlKCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBlcXVpdmFsZW50IG9mIHRoZSBnaXZlbiByYXRpbyBpbiB0aGUgcmFuZ2UgWzAsMV0gdG8gYSB2YWx1ZVxuICAvLyBpbiB0aGUgdmFsdWUgcmFuZ2UuXG4gIHZhbHVlT2YocmF0aW8pIHtcbiAgICByZXR1cm4gKHJhdGlvICogdGhpcy52YWx1ZVJhbmdlKCkpICsgdGhpcy5zdGFydFZhbHVlO1xuICB9XG5cbiAgdmFsdWVSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmRWYWx1ZSAtIHRoaXMuc3RhcnRWYWx1ZTtcbiAgfVxuXG4gIC8vIFNldHMgYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdHdvIGluc2V0IHZhbHVlcyByZWxhdGl2ZSB0b1xuICAvLyBgc3RhcnRWYWx1ZWAgYW5kIGBlbmRWYWx1ZWAuXG4gIHNldExpbWl0c1dpdGhWYWx1ZUluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIGxldCByYW5nZURpcmVjdGlvbiA9IHRoaXMudmFsdWVSYW5nZSgpID49IDAgPyAxIDogLTE7XG5cbiAgICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnN0YXJ0VmFsdWUgKyAoc3RhcnRJbnNldCAqIHJhbmdlRGlyZWN0aW9uKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy5lbmRWYWx1ZSAtIChlbmRJbnNldCAqIHJhbmdlRGlyZWN0aW9uKTtcbiAgfVxuXG4gIC8vIFNldHMgYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdHdvIGluc2V0IHZhbHVlcyByZWxhdGl2ZSB0byB0aGVcbiAgLy8gWzAsMV0gcmFuZ2UuXG4gIHNldExpbWl0c1dpdGhSYXRpb0luc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHRoaXMudmFsdWVPZihzdGFydEluc2V0KTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKDEgLSBlbmRJbnNldCk7XG4gIH1cblxuICAvLyBBZGRzIGEgbWFya2VyIGF0IHRoZSBjdXJyZW50IGB2YWx1ZWAuXG4gIGFkZE1hcmtlckF0Q3VycmVudFZhbHVlKCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBjb250cm9sIGlzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY29udHJvbC5cbiAgaXNTZWxlY3RlZCgpIHtcbiAgICBpZiAoQ29udHJvbC5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIENvbnRyb2wuc2VsZWN0aW9uLmNvbnRyb2wgPT09IHRoaXM7XG4gIH1cblxuICAvLyBBYnN0cmFjdCBmdW5jdGlvbi5cbiAgLy8gUmV0dXJucyB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGhpdHBvaW50LlxuICBjZW50ZXIoKSB7XG4gICAgY29uc29sZS50cmFjZShgQWJzdHJhY3QgZnVuY3Rpb24gY2FsbGVkIC0gdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gICAgdGhyb3cgcmFjLkVycm9yLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQ7XG4gIH1cblxuICAvLyBBYnN0cmFjdCBmdW5jdGlvbi5cbiAgLy8gUmV0dXJucyB0aGUgcGVyc2lzdGVudCBjb3B5IG9mIHRoZSBjb250cm9sIGFuY2hvciB0byBiZSB1c2VkIGR1cmluZ1xuICAvLyB1c2VyIGludGVyYWN0aW9uLlxuICBjb3B5QW5jaG9yKCkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbiAgLy8gQWJzdHJhY3QgZnVuY3Rpb24uXG4gIC8vIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBjb250cm9sLlxuICBkcmF3KCkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbiAgLy8gQWJzdHJhY3QgZnVuY3Rpb24uXG4gIC8vIFVwZGF0ZXMgdGhlIGNvbnRyb2wgdmFsdWUgd2l0aCBgcG9pbnRlckNvbnRyb2xDZW50ZXJgIGluIHJlbGF0aW9uIHRvXG4gIC8vIGBhbmNob3JDb3B5YC4gQ2FsbGVkIGJ5IGBwb2ludGVyRHJhZ2dlZGAgYXMgdGhlIHVzZXIgaW50ZXJhY3RzIHdpdGggYVxuICAvLyBzZWxlY3RlZCBjb250cm9sLlxuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyQ29udHJvbENlbnRlciwgYW5jaG9yQ29weSkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbiAgLy8gQWJzdHJhY3QgZnVuY3Rpb24uXG4gIC8vIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgZm9yIHRoZSBjb250cm9sLCBhbG9uZyB3aXRoIHBvaW50ZXJcbiAgLy8gaW50ZXJhY3Rpb24gdmlzdWFscy4gQ2FsbGVkIGJ5IGBkcmF3Q29udHJvbHNgIGZvciB0aGUgY3VycmVudGx5XG4gIC8vIHNlbGVjdGVkIGNvbnRyb2wuXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgYW5jaG9yQ29weSwgcG9pbnRlck9mZnNldCkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbDtcblxuXG4vLyBDb250cm9scyBzaGFyZWQgZHJhd2luZyBlbGVtZW50c1xuXG5Db250cm9sLm1ha2VBcnJvd1NoYXBlID0gZnVuY3Rpb24ocmFjLCBjZW50ZXIsIGFuZ2xlKSB7XG4gIC8vIEFyY1xuICBsZXQgYW5nbGVEaXN0YW5jZSA9IHJhYy5BbmdsZS5mcm9tKDEvMjIpO1xuICBsZXQgYXJjID0gY2VudGVyLmFyYyhDb250cm9sLnJhZGl1cyAqIDEuNSxcbiAgICBhbmdsZS5zdWJ0cmFjdChhbmdsZURpc3RhbmNlKSwgYW5nbGUuYWRkKGFuZ2xlRGlzdGFuY2UpKTtcblxuICAvLyBBcnJvdyB3YWxsc1xuICBsZXQgcG9pbnRBbmdsZSA9IHJhYy5BbmdsZS5mcm9tKDEvOCk7XG4gIGxldCByaWdodFdhbGwgPSBhcmMuc3RhcnRQb2ludCgpLnJheShhbmdsZS5hZGQocG9pbnRBbmdsZSkpO1xuICBsZXQgbGVmdFdhbGwgPSBhcmMuZW5kUG9pbnQoKS5yYXkoYW5nbGUuc3VidHJhY3QocG9pbnRBbmdsZSkpO1xuXG4gIC8vIEFycm93IHBvaW50XG4gIGxldCBwb2ludCA9IHJpZ2h0V2FsbC5wb2ludEF0SW50ZXJzZWN0aW9uKGxlZnRXYWxsKTtcblxuICAvLyBTaGFwZVxuICBsZXQgYXJyb3cgPSBuZXcgUmFjLlNoYXBlKHJhYyk7XG4gIHBvaW50LnNlZ21lbnRUb1BvaW50KGFyYy5zdGFydFBvaW50KCkpXG4gICAgLmF0dGFjaFRvKGFycm93KTtcbiAgYXJjLmF0dGFjaFRvKGFycm93KVxuICAgIC5lbmRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHBvaW50KVxuICAgIC5hdHRhY2hUbyhhcnJvdyk7XG5cbiAgICByZXR1cm4gYXJyb3c7XG59O1xuXG5Db250cm9sLm1ha2VMaW1pdE1hcmtlciA9IGZ1bmN0aW9uKHJhYywgcG9pbnQsIHNvbWVBbmdsZSkge1xuICBsZXQgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICBsZXQgcGVycGVuZGljdWxhciA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoZmFsc2UpO1xuICBsZXQgY29tcG9zaXRlID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcblxuICBwb2ludC5zZWdtZW50VG9BbmdsZShwZXJwZW5kaWN1bGFyLCA0KVxuICAgIC53aXRoU3RhcnRFeHRlbmRlZCg0KVxuICAgIC5hdHRhY2hUbyhjb21wb3NpdGUpO1xuICBwb2ludC5wb2ludFRvQW5nbGUocGVycGVuZGljdWxhciwgOCkuYXJjKDMpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG5cbiAgcmV0dXJuIGNvbXBvc2l0ZTtcbn07XG5cbkNvbnRyb2wubWFrZVZhbHVlTWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgc29tZUFuZ2xlKSB7XG4gIGxldCBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKHNvbWVBbmdsZSk7XG4gIHJldHVybiBwb2ludC5zZWdtZW50VG9BbmdsZShhbmdsZS5wZXJwZW5kaWN1bGFyKCksIDMpXG4gICAgLndpdGhTdGFydEV4dGVuZGVkKDMpO1xufTtcblxuXG4vLyBDb250cm9sIHBvaW50ZXIgYW5kIGludGVyYWN0aW9uXG5cbi8vIENhbGwgdG8gc2lnbmFsIHRoZSBwb2ludGVyIGJlaW5nIHByZXNzZWQuIElmIHRoZSBwb250ZXIgaGl0cyBhIGNvbnRyb2xcbi8vIGl0IHdpbGwgYmUgY29uc2lkZXJlZCBzZWxlY3RlZC4gV2hlbiBhIGNvbnRyb2wgaXMgc2VsZWN0ZWQgYSBjb3B5IG9mIGl0c1xuLy8gYW5jaG9yIGlzIHN0b3JlZCBhcyB0byBhbGxvdyBpbnRlcmFjdGlvbiB3aXRoIGEgZml4ZWQgYW5jaG9yLlxuQ29udHJvbC5wb2ludGVyUHJlc3NlZCA9IGZ1bmN0aW9uKHJhYywgcG9pbnRlckNlbnRlcikge1xuICBDb250cm9sLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAvLyBUZXN0IHBvaW50ZXIgaGl0XG4gIGxldCBzZWxlY3RlZCA9IENvbnRyb2wuY29udHJvbHMuZmluZChpdGVtID0+IHtcbiAgICBsZXQgY29udHJvbENlbnRlciA9IGl0ZW0uY2VudGVyKCk7XG4gICAgaWYgKGNvbnRyb2xDZW50ZXIgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKGNvbnRyb2xDZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50ZXJDZW50ZXIpIDw9IENvbnRyb2wucmFkaXVzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICBpZiAoc2VsZWN0ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIENvbnRyb2wuc2VsZWN0aW9uID0gbmV3IENvbnRyb2wuU2VsZWN0aW9uKHNlbGVjdGVkLCBwb2ludGVyQ2VudGVyKTtcbn07XG5cblxuLy8gQ2FsbCB0byBzaWduYWwgdGhlIHBvaW50ZXIgYmVpbmcgZHJhZ2dlZC4gQXMgdGhlIHBvaW50ZXIgbW92ZXMgdGhlXG4vLyBzZWxlY3RlZCBjb250cm9sIGlzIHVwZGF0ZWQgd2l0aCBhIG5ldyBgZGlzdGFuY2VgLlxuQ29udHJvbC5wb2ludGVyRHJhZ2dlZCA9IGZ1bmN0aW9uKHJhYywgcG9pbnRlckNlbnRlcil7XG4gIGlmIChDb250cm9sLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBjb250cm9sID0gQ29udHJvbC5zZWxlY3Rpb24uY29udHJvbDtcbiAgbGV0IGFuY2hvckNvcHkgPSBDb250cm9sLnNlbGVjdGlvbi5hbmNob3JDb3B5O1xuXG4gIC8vIENlbnRlciBvZiBkcmFnZ2VkIGNvbnRyb2wgaW4gdGhlIHBvaW50ZXIgY3VycmVudCBwb3NpdGlvblxuICBsZXQgY3VycmVudFBvaW50ZXJDb250cm9sQ2VudGVyID0gQ29udHJvbC5zZWxlY3Rpb24ucG9pbnRlck9mZnNldFxuICAgIC53aXRoU3RhcnRQb2ludChwb2ludGVyQ2VudGVyKVxuICAgIC5lbmRQb2ludCgpO1xuXG4gIGNvbnRyb2wudXBkYXRlV2l0aFBvaW50ZXIoY3VycmVudFBvaW50ZXJDb250cm9sQ2VudGVyLCBhbmNob3JDb3B5KTtcbn07XG5cblxuLy8gQ2FsbCB0byBzaWduYWwgdGhlIHBvaW50ZXIgYmVpbmcgcmVsZWFzZWQuIFVwb24gcmVsZWFzZSB0aGUgc2VsZWN0ZWRcbi8vIGNvbnRyb2wgaXMgY2xlYXJlZC5cbkNvbnRyb2wucG9pbnRlclJlbGVhc2VkID0gZnVuY3Rpb24ocmFjLCBwb2ludGVyQ2VudGVyKSB7XG4gIGlmIChDb250cm9sLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgIENvbnRyb2wubGFzdFBvaW50ZXIgPSBwb2ludGVyQ2VudGVyO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIENvbnRyb2wubGFzdFBvaW50ZXIgPSBDb250cm9sLnNlbGVjdGlvbi5jb250cm9sO1xuICBDb250cm9sLnNlbGVjdGlvbiA9IG51bGw7XG59O1xuXG5cbi8vIERyYXdzIGNvbnRyb2xzIGFuZCB0aGUgdmlzdWFscyBvZiBwb2ludGVyIGFuZCBjb250cm9sIHNlbGVjdGlvbi4gVXN1YWxseVxuLy8gY2FsbGVkIGF0IHRoZSBlbmQgb2YgYGRyYXdgIHNvIHRoYXQgY29udHJvbHMgc2l0cyBvbiB0b3Agb2YgdGhlIGRyYXdpbmcuXG5Db250cm9sLmRyYXdDb250cm9scyA9IGZ1bmN0aW9uKHJhYykge1xuICBsZXQgcG9pbnRlclN0eWxlID0gQ29udHJvbC5wb2ludGVyU3R5bGU7XG5cbiAgLy8gTGFzdCBwb2ludGVyIG9yIGNvbnRyb2xcbiAgaWYgKENvbnRyb2wubGFzdFBvaW50ZXIgaW5zdGFuY2VvZiBSYWMuUG9pbnQpIHtcbiAgICBDb250cm9sLmxhc3RQb2ludGVyLmFyYygxMikuZHJhdyhwb2ludGVyU3R5bGUpO1xuICB9XG4gIGlmIChDb250cm9sLmxhc3RQb2ludGVyIGluc3RhbmNlb2YgQ29udHJvbCkge1xuICAgIC8vIFRPRE86IGltcGxlbWVudCBsYXN0IHNlbGVjdGVkIGNvbnRyb2wgc3RhdGVcbiAgfVxuXG4gIC8vIFBvaW50ZXIgcHJlc3NlZFxuICBsZXQgcG9pbnRlckNlbnRlciA9IHJhYy5Qb2ludC5wb2ludGVyKCk7XG4gIGlmIChyYWMuZHJhd2VyLnA1Lm1vdXNlSXNQcmVzc2VkKSB7XG4gICAgaWYgKENvbnRyb2wuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICBwb2ludGVyQ2VudGVyLmFyYygxMCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb2ludGVyQ2VudGVyLmFyYyg1KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWxsIGNvbnRyb2xzIGluIGRpc3BsYXlcbiAgQ29udHJvbC5jb250cm9scy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kcmF3KCkpO1xuXG4gIC8vIFJlc3QgaXMgQ29udHJvbCBzZWxlY3Rpb24gdmlzdWFsc1xuICBpZiAoQ29udHJvbC5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBDb250cm9sLnNlbGVjdGlvbi5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IHVzZXMgYSBTZWdtZW50IGFzIGFuY2hvci5cbiogQGFsaWFzIFJhYy5TZWdtZW50Q29udHJvbFxuKi9cbmNsYXNzIFNlZ21lbnRDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8vIENyZWF0ZXMgYSBuZXcgQ29udHJvbCBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBgdmFsdWVgIGFuZCBgbGVuZ3RoYC5cbiAgLy8gQnkgZGVmYXVsdCB0aGUgdmFsdWUgcmFuZ2UgaXMgWzAsMV0gYW5kIGxpbWl0cyBhcmUgc2V0IHRvIGJlIHRoZSBlcXVhbFxuICAvLyBhcyBgc3RhcnRWYWx1ZWAgYW5kIGBlbmRWYWx1ZWAuXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGxlbmd0aCwgc3RhcnRWYWx1ZSA9IDAsIGVuZFZhbHVlID0gMSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHZhbHVlLCBsZW5ndGgsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIC8vIExlbmd0aCBmb3IgdGhlIGNvcGllZCBhbmNob3Igc2hhcGUuXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIFdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAvLyBkcmF3biBhbmQgaW50ZXJhY3RlZCBhIGNvcHkgb2YgdGhlIGFuY2hvciBpcyBjcmVhdGVkIHdpdGggdGhlXG4gICAgLy8gY29udHJvbCdzIGBsZW5ndGhgLlxuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcbiAgfVxuXG4gIHNldFZhbHVlV2l0aExlbmd0aChsZW5ndGhWYWx1ZSkge1xuICAgIGxldCBsZW5ndGhSYXRpbyA9IGxlbmd0aFZhbHVlIC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVPZihsZW5ndGhSYXRpbyk7XG4gIH1cblxuICAvLyBTZXRzIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHR3byBpbnNldCB2YWx1ZXMgcmVsYXRpdmUgdG9cbiAgLy8gemVybyBhbmQgYGxlbmd0aGAuXG4gIHNldExpbWl0c1dpdGhMZW5ndGhJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldCAvIHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKCh0aGlzLmxlbmd0aCAtIGVuZEluc2V0KSAvIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLy8gUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgYW5jaG9yLnN0YXJ0YCB0byB0aGUgY29udHJvbCBjZW50ZXIuXG4gIGRpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCAqIHRoaXMucmF0aW9WYWx1ZSgpO1xuICB9XG5cbiAgY2VudGVyKCkge1xuICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSBhIGNlbnRlclxuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci53aXRoTGVuZ3RoKHRoaXMuZGlzdGFuY2UoKSkuZW5kUG9pbnQoKTtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGBhbmNob3JgIHdpdGggdGhlIGNvbnRyb2wgYGxlbmd0aGAuXG4gIGNvcHlBbmNob3IoKSB7XG4gICAgLy8gTm8gYW5jaG9yIHRvIGNvcHlcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aExlbmd0aCh0aGlzLmxlbmd0aCk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGxldCBhbmNob3JDb3B5ID0gdGhpcy5jb3B5QW5jaG9yKCk7XG4gICAgYW5jaG9yQ29weS5kcmF3KHRoaXMuc3R5bGUpO1xuXG4gICAgbGV0IGNlbnRlciA9IHRoaXMuY2VudGVyKCk7XG4gICAgbGV0IGFuZ2xlID0gYW5jaG9yQ29weS5hbmdsZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IG1hcmtlclJhdGlvID0gdGhpcy5yYXRpb09mKGl0ZW0pO1xuICAgICAgaWYgKG1hcmtlclJhdGlvIDwgMCB8fCBtYXJrZXJSYXRpbyA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBwb2ludCA9IGFuY2hvckNvcHkuc3RhcnQucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLmxlbmd0aCAqIG1hcmtlclJhdGlvKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgcG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wgYnV0dG9uXG4gICAgY2VudGVyLmFyYyhSYWMuQ29udHJvbC5yYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCByYXRpb1ZhbHVlID0gdGhpcy5yYXRpb1ZhbHVlKCk7XG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmIChyYXRpb1ZhbHVlID49IHRoaXMucmF0aW9TdGFydExpbWl0KCkgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBjZW50ZXIsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAocmF0aW9WYWx1ZSA8PSB0aGlzLnJhdGlvRW5kTGltaXQoKSAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGNlbnRlciwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHRoaXMuc3R5bGUpO1xuXG4gICAgLy8gU2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBjZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cyAqIDEuNSkuZHJhdyhSYWMuQ29udHJvbC5wb2ludGVyU3R5bGUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJDb250cm9sQ2VudGVyLCBhbmNob3JDb3B5KSB7XG4gICAgbGV0IGxlbmd0aCA9IGFuY2hvckNvcHkubGVuZ3RoO1xuICAgIGxldCBzdGFydEluc2V0ID0gbGVuZ3RoICogdGhpcy5yYXRpb1N0YXJ0TGltaXQoKTtcbiAgICBsZXQgZW5kSW5zZXQgPSBsZW5ndGggKiAoMSAtIHRoaXMucmF0aW9FbmRMaW1pdCgpKTtcblxuICAgIC8vIE5ldyB2YWx1ZSBmcm9tIHRoZSBjdXJyZW50IHBvaW50ZXIgcG9zaXRpb24sIHJlbGF0aXZlIHRvIGFuY2hvckNvcHlcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBhbmNob3JDb3B5XG4gICAgICAucmF5LmRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChwb2ludGVyQ29udHJvbENlbnRlcik7XG4gICAgLy8gQ2xhbXBpbmcgdmFsdWUgKGphdmFzY3JpcHQgaGFzIG5vIE1hdGguY2xhbXApXG4gICAgbmV3RGlzdGFuY2UgPSBhbmNob3JDb3B5LmNsYW1wVG9MZW5ndGgobmV3RGlzdGFuY2UsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG5cbiAgICAvLyBVcGRhdGUgY29udHJvbCB3aXRoIG5ldyBkaXN0YW5jZVxuICAgIGxldCBsZW5ndGhSYXRpbyA9IG5ld0Rpc3RhbmNlIC8gbGVuZ3RoO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlT2YobGVuZ3RoUmF0aW8pO1xuICB9XG5cbiAgZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyLCBhbmNob3JDb3B5LCBwb2ludGVyT2Zmc2V0KSB7XG4gICAgYW5jaG9yQ29weS5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IGFuZ2xlID0gYW5jaG9yQ29weS5hbmdsZSgpO1xuICAgIGxldCBsZW5ndGggPSBhbmNob3JDb3B5Lmxlbmd0aDtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGxldCBtYXJrZXJSYXRpbyA9IHRoaXMucmF0aW9PZihpdGVtKTtcbiAgICAgIGlmIChtYXJrZXJSYXRpbyA8IDAgfHwgbWFya2VyUmF0aW8gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyUG9pbnQgPSBhbmNob3JDb3B5LnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogbWFya2VyUmF0aW8pO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBtYXJrZXJQb2ludCwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gTGltaXQgbWFya2Vyc1xuICAgIGxldCByYXRpb1N0YXJ0TGltaXQgPSB0aGlzLnJhdGlvU3RhcnRMaW1pdCgpO1xuICAgIGlmIChyYXRpb1N0YXJ0TGltaXQgPiAwKSB7XG4gICAgICBsZXQgbWluUG9pbnQgPSBhbmNob3JDb3B5LnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogcmF0aW9TdGFydExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBsZXQgcmF0aW9FbmRMaW1pdCA9IHRoaXMucmF0aW9FbmRMaW1pdCgpO1xuICAgIGlmIChyYXRpb0VuZExpbWl0IDwgMSkge1xuICAgICAgbGV0IG1heFBvaW50ID0gYW5jaG9yQ29weS5zdGFydC5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHJhdGlvRW5kTGltaXQpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtYXhQb2ludCwgYW5nbGUuaW52ZXJzZSgpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBTZWdtZW50IGZyb20gcG9pbnRlciB0byBjb250cm9sIGRyYWdnZWQgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRDZW50ZXIgPSBwb2ludGVyT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBkcmFnZ2VkIGNlbnRlciwgYXR0YWNoZWQgdG8gcG9pbnRlclxuICAgIGRyYWdnZWRDZW50ZXIuYXJjKDIpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIENvbnN0cmFpbmVkIGxlbmd0aCBjbGFtcGVkIHRvIGxpbWl0c1xuICAgIGxldCBjb25zdHJhaW5lZExlbmd0aCA9IGFuY2hvckNvcHlcbiAgICAgIC5yYXkuZGlzdGFuY2VUb1Byb2plY3RlZFBvaW50KGRyYWdnZWRDZW50ZXIpO1xuICAgIGxldCBzdGFydEluc2V0ID0gbGVuZ3RoICogcmF0aW9TdGFydExpbWl0O1xuICAgIGxldCBlbmRJbnNldCA9IGxlbmd0aCAqICgxIC0gcmF0aW9FbmRMaW1pdCk7XG4gICAgY29uc3RyYWluZWRMZW5ndGggPSBhbmNob3JDb3B5LmNsYW1wVG9MZW5ndGgoY29uc3RyYWluZWRMZW5ndGgsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG5cbiAgICBsZXQgY29uc3RyYWluZWRBbmNob3JDZW50ZXIgPSBhbmNob3JDb3B5XG4gICAgICAud2l0aExlbmd0aChjb25zdHJhaW5lZExlbmd0aClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBjZW50ZXIgY29uc3RyYWluZWQgdG8gYW5jaG9yXG4gICAgY29uc3RyYWluZWRBbmNob3JDZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRHJhZ2dlZCBzaGFkb3cgY2VudGVyLCBzZW1pIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICAvLyBhbHdheXMgcGVycGVuZGljdWxhciB0byBhbmNob3JcbiAgICBsZXQgZHJhZ2dlZFNoYWRvd0NlbnRlciA9IGRyYWdnZWRDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkoYW5jaG9yQ29weS5yYXkpXG4gICAgICAvLyByZXZlcnNlIGFuZCB0cmFuc2xhdGVkIHRvIGNvbnN0cmFpbnQgdG8gYW5jaG9yXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aFN0YXJ0UG9pbnQoY29uc3RyYWluZWRBbmNob3JDZW50ZXIpXG4gICAgICAvLyBTZWdtZW50IGZyb20gY29uc3RyYWluZWQgY2VudGVyIHRvIHNoYWRvdyBjZW50ZXJcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgc2hhZG93IGNlbnRlclxuICAgIGRyYWdnZWRTaGFkb3dDZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cyAvIDIpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIEVhc2UgZm9yIHNlZ21lbnQgdG8gZHJhZ2dlZCBzaGFkb3cgY2VudGVyXG4gICAgbGV0IGVhc2VPdXQgPSBSYWMuRWFzZUZ1bmN0aW9uLm1ha2VFYXNlT3V0KCk7XG4gICAgZWFzZU91dC5wb3N0QmVoYXZpb3IgPSBSYWMuRWFzZUZ1bmN0aW9uLkJlaGF2aW9yLmNsYW1wO1xuXG4gICAgLy8gVGFpbCB3aWxsIHN0b3Agc3RyZXRjaGluZyBhdCAyeCB0aGUgbWF4IHRhaWwgbGVuZ3RoXG4gICAgbGV0IG1heERyYWdnZWRUYWlsTGVuZ3RoID0gUmFjLkNvbnRyb2wucmFkaXVzICogNTtcbiAgICBlYXNlT3V0LmluUmFuZ2UgPSBtYXhEcmFnZ2VkVGFpbExlbmd0aCAqIDI7XG4gICAgZWFzZU91dC5vdXRSYW5nZSA9IG1heERyYWdnZWRUYWlsTGVuZ3RoO1xuXG4gICAgLy8gU2VnbWVudCB0byBkcmFnZ2VkIHNoYWRvdyBjZW50ZXJcbiAgICBsZXQgZHJhZ2dlZFRhaWwgPSBkcmFnZ2VkU2hhZG93Q2VudGVyXG4gICAgICAuc2VnbWVudFRvUG9pbnQoZHJhZ2dlZENlbnRlcik7XG5cbiAgICBsZXQgZWFzZWRMZW5ndGggPSBlYXNlT3V0LmVhc2VWYWx1ZShkcmFnZ2VkVGFpbC5sZW5ndGgpO1xuICAgIGRyYWdnZWRUYWlsLndpdGhMZW5ndGgoZWFzZWRMZW5ndGgpLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBEcmF3IGFsbCFcbiAgICBSYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhSYWMuQ29udHJvbC5wb2ludGVyU3R5bGUpO1xuICB9XG5cbn0gLy8gY2xhc3MgU2VnbWVudENvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlZ21lbnRDb250cm9sO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vLyBUT0RPOiBhZGQgbm90ZSBhYm91dDogbW9zdCBmdW5jdGlvbnMgdGhhdCByZWNlaXZlIGFuIGFuZ2xlIGNhbiBhbHNvXG4vLyByZWNlaXZlIHRoZSB0dXJuIHZhbHVlIGRpcmVjdGx5IGFzIGEgbnVtYmVyLiBUaGUgbWFpbiBleGNlcHRpb24gYXJlXG4vLyBjb25zdHJ1Y3RvcnMsIHdoaWNoIGFsd2F5cyBleHBlY3QgQW5nbGUgb2JqZWN0cy5cblxuXG4vKipcbiogQW5nbGUgbWVhc3VyZWQgYnkgYSBgdHVybmAgdmFsdWUgaW4gdGhlIHJhbmdlIGBbMCwxKWAgdGhhdCByZXByZXNlbnRzIHRoZVxuKiBhbW91bnQgb2YgdHVybiBpbiBhIGZ1bGwgY2lyY2xlLlxuKlxuKiBXaGVuIGRyYXdpbmcgYW4gYW5nbGUgb2YgdHVybiBgMGAgcG9pbnRzIHRvd2FyZHMgdGhlIHJpZ2h0IG9mIHRoZSBzY3JlZW4uXG4qIEFuIGFuZ2xlIG9mIHR1cm4gYDEvNGAgcG9pbnRzIGRvd253YXJkcywgdHVybiBgMS8yYCB0b3dhcmRzIHRoZSBsZWZ0LFxuKiBgMy80YCBwb2ludHMgdXB3YXJkcy5cbipcbiogQGFsaWFzIFJhYy5BbmdsZVxuKi9cbmNsYXNzIEFuZ2xlIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBBbmdsZWAgaW5zdGFuY2UuXG4gICpcbiAgKiBUaGUgYHR1cm5gIHZhbHVlIGlzIGNvbnN0cmFpbmVkIHRvIHRoZSByYW5jZSBgWzAsIDEpYCwgYW55IHZhbHVlXG4gICogb3V0c2lkZSBpcyByZWR1Y2VkIGJhY2sgaW50byByYW5nZSB1c2luZyBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBgYGBcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgMS80KSAgLy8gdHVybiBpcyAxLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgNS80KSAgLy8gdHVybiBpcyAxLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgLTEvNCkgLy8gdHVybiBpcyAzLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgMSkgICAgLy8gdHVybiBpcyAwXG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDQpICAgIC8vIHR1cm4gaXMgMFxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWVcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB0dXJuKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHR1cm4pO1xuXG4gICAgLyoqXG4gICAgKiBJbnRhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgdHVybiA9IHR1cm4gJSAxO1xuICAgIGlmICh0dXJuIDwgMCkge1xuICAgICAgdHVybiA9ICh0dXJuICsgMSkgJSAxO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogVHVybiB2YWx1ZSBvZiB0aGUgYW5nbGUsIGNvbnN0cmFpbmVkIHRvIHRoZSByYW5nZSBgWzAsIDEpYC5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnR1cm4gPSB0dXJuO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB0dXJuU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMudHVybiwgZGlnaXRzKTtcbiAgICByZXR1cm4gYEFuZ2xlKCR7dHVyblN0cn0pYDtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCB0aGUgYHR1cm5gIHZhbHVlIG9mIHRoZSBhbmdsZVxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5BbmdsZS5mcm9tfSBgYW5nbGVgIGlzIHVuZGVyXG4gICogYHtAbGluayBSYWMjdW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkfWAsIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBGb3IgdGhpcyBtZXRob2QgYG90aGVyQW5nbGVgIGNhbiBvbmx5IGJlIGBBbmdsZWAgb3IgYG51bWJlcmAsIGFueSBvdGhlclxuICAqIHR5cGUgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVGhpcyBtZXRob2Qgd2lsbCBjb25zaWRlciB0dXJuIHZhbHVlcyBpbiB0aGUgb3Bvc2l0ZSBlbmRzIG9mIHRoZSByYW5nZVxuICAqIGBbMCwgMSlgIGFzIGVxdWFscy4gRS5nLiBgQW5nbGVgIG9iamVjdHMgd2l0aCBgdHVybmAgdmFsdWVzIG9mIGAwYCBhbmRcbiAgKiBgMSAtIHJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQvMmAgd2lsbCBiZSBjb25zaWRlcmVkIGVxdWFsLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICBlcXVhbHMob3RoZXJBbmdsZSkge1xuICAgIGlmIChvdGhlckFuZ2xlIGluc3RhbmNlb2YgUmFjLkFuZ2xlKSB7XG4gICAgICAvLyBhbGwgZ29vZCFcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvdGhlckFuZ2xlID09PSAnbnVtYmVyJykge1xuICAgICAgb3RoZXJBbmdsZSA9IEFuZ2xlLmZyb20odGhpcy5yYWMsIG90aGVyQW5nbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKHRoaXMudHVybiAtIG90aGVyQW5nbGUudHVybik7XG4gICAgcmV0dXJuIGRpZmYgPCB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGRcbiAgICAgIC8vIEZvciBjbG9zZSB2YWx1ZXMgdGhhdCBsb29wIGFyb3VuZFxuICAgICAgfHwgKDEgLSBkaWZmKSA8IHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgQW5nbGVgLCByZXR1cm5zIHRoYXQgc2FtZSBvYmplY3QuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGEgYG51bWJlcmAsIHJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoXG4gICogICBgc29tZXRoaW5nYCBhcyBgdHVybmAuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGEgYHtAbGluayBSYWMuUmF5fWAsIHJldHVybnMgaXRzIGFuZ2xlLlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhIGB7QGxpbmsgUmFjLlNlZ21lbnR9YCwgcmV0dXJucyBpdHMgYW5nbGUuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfFJhYy5SYXl8UmFjLlNlZ21lbnR8bnVtYmVyfSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiBkZXJpdmUgYW4gYEFuZ2xlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkFuZ2xlKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNvbWV0aGluZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlJheSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZy5hbmdsZTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5TZWdtZW50KSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nLnJheS5hbmdsZTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLkFuZ2xlIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIHJhZGlhbnNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdGF0aWMgZnJvbVJhZGlhbnMocmFjLCByYWRpYW5zKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZShyYWMsIHJhZGlhbnMgLyBSYWMuVEFVKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogaW1wbGVtZW50IGZyb21EZWdyZWVzXG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcG9pbnRpbmcgaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvbiB0byBgdGhpc2AuXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvOCkuaW52ZXJzZSgpIC8vIHR1cm4gaXMgMS84ICsgMS8yID0gNS84XG4gICogcmFjLkFuZ2xlKDcvOCkuaW52ZXJzZSgpIC8vIHR1cm4gaXMgNy84ICsgMS8yID0gMy84XG4gICogYGBgXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBpbnZlcnNlKCkge1xuICAgIHJldHVybiB0aGlzLmFkZCh0aGlzLnJhYy5BbmdsZS5pbnZlcnNlKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGEgdHVybiB2YWx1ZSBlcXVpdmFsZW50IHRvIGAtdHVybmAuXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvNCkubmVnYXRpdmUoKSAvLyAtMS80IGJlY29tZXMgdHVybiAzLzRcbiAgKiByYWMuQW5nbGUoMy84KS5uZWdhdGl2ZSgpIC8vIC0zLzggYmVjb21lcyB0dXJuIDUvOFxuICAqIGBgYFxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgbmVnYXRpdmUoKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgLXRoaXMudHVybik7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2hpY2ggaXMgcGVycGVuZGljdWxhciB0byBgdGhpc2AgaW4gdGhlXG4gICogYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvOCkucGVycGVuZGljdWxhcih0cnVlKSAgLy8gdHVybiBpcyAxLzggKyAxLzQgPSAzLzhcbiAgKiByYWMuQW5nbGUoMS84KS5wZXJwZW5kaWN1bGFyKGZhbHNlKSAvLyB0dXJuIGlzIDEvOCAtIDEvNCA9IDcvOFxuICAqIGBgYFxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgcGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpZnQodGhpcy5yYWMuQW5nbGUuc3F1YXJlLCBjbG9ja3dpc2UpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUgaW4gcmFkaWFucy5cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICByYWRpYW5zKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiBSYWMuVEFVO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUgaW4gZGVncmVlcy5cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBkZWdyZWVzKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiAzNjA7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBgdHVybmAgdmFsdWUgaW4gdGhlIHJhbmdlIGAoMCwgMV1gLiBXaGVuIGB0dXJuYCBpcyBlcXVhbCB0b1xuICAqIGAwYCByZXR1cm5zIGAxYCBpbnN0ZWFkLlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHR1cm5PbmUoKSB7XG4gICAgaWYgKHRoaXMudHVybiA9PT0gMCkgeyByZXR1cm4gMTsgfVxuICAgIHJldHVybiB0aGlzLnR1cm47XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCB0aGUgc3VtIG9mIGB0aGlzYCBhbmQgdGhlIGFuZ2xlIGRlcml2ZWQgZnJvbVxuICAqIGBhbmdsZWAuXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgYWRkKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm4gKyBhbmdsZS50dXJuKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBhbmdsZSBkZXJpdmVkIGZyb20gYGFuZ2xlYFxuICAqIHN1YnRyYWN0ZWQgdG8gYHRoaXNgLlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3VidHJhY3QoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiAtIGFuZ2xlLnR1cm4pO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYHR1cm5gYCBzZXQgdG8gYHRoaXMudHVybiAqIGZhY3RvcmAuXG4gICogQHBhcmFtIHtudW1iZXJ9IGZhY3RvciAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYHR1cm5gIGJ5XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgbXVsdChmYWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm4gKiBmYWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYHR1cm5gIHNldCB0b1xuICAqIGB7QGxpbmsgUmFjLkFuZ2xlI3R1cm5PbmUgdGhpcy50dXJuT25lKCl9ICogZmFjdG9yYC5cbiAgKlxuICAqIFVzZWZ1bCB3aGVuIGRvaW5nIHJhdGlvIGNhbGN1bGF0aW9ucyB3aGVyZSBhIHplcm8gYW5nbGUgY29ycmVzcG9uZHMgdG9cbiAgKiBhIGNvbXBsZXRlLWNpcmNsZSBzaW5jZTpcbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMCkubXVsdCgwLjUpICAgIC8vIHR1cm4gaXMgMFxuICAqIC8vIHdoZXJlYXNcbiAgKiByYWMuQW5nbGUoMCkubXVsdE9uZSgwLjUpIC8vIHR1cm4gaXMgMC41XG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZmFjdG9yIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgdHVybmAgYnlcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBtdWx0T25lKGZhY3Rvcikge1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybk9uZSgpICogZmFjdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGRpc3RhbmNlIGZyb20gYHRoaXNgIHRvIHRoZVxuICAqIGFuZ2xlIGRlcml2ZWQgZnJvbSBgYW5nbGVgLlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgxLzQpLmRpc3RhbmNlKDEvMiwgdHJ1ZSkgIC8vIHR1cm4gaXMgMS8yXG4gICogcmFjLkFuZ2xlKDEvNCkuZGlzdGFuY2UoMS8yLCBmYWxzZSkgLy8gdHVybiBpbiAzLzRcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBtZWFzdXJlbWVudFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGRpc3RhbmNlKGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMpO1xuICAgIHJldHVybiBjbG9ja3dpc2VcbiAgICAgID8gZGlzdGFuY2VcbiAgICAgIDogZGlzdGFuY2UubmVnYXRpdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCByZXN1bHQgb2Ygc2hpZnRpbmcgdGhlIGFuZ2xlIGRlcml2ZWQgZnJvbVxuICAqIGBhbmdsZWAgdG8gaGF2ZSBgdGhpc2AgYXMgaXRzIG9yaWdpbi5cbiAgKlxuICAqIFRoaXMgb3BlcmF0aW9uIGlzIHRoZSBlcXVpdmFsZW50IHRvXG4gICogKyBgdGhpcy5hZGQoYW5nbGUpYCB3aGVuIGNsb2Nrd2lzZVxuICAqICsgYHRoaXMuc3VidHJhY3QoYW5nbGUpYCB3aGVuIGNvdW50ZXItY2xvY2t3aXNlXG4gICpcbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMC4xKS5zaGlmdCgwLjMsIHRydWUpICAvLyB0dXJuIGlzIDAuMSArIDAuMyA9IDAuNFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0KDAuMywgZmFsc2UpIC8vIHR1cm4gaXMgMC4xIC0gMC4zID0gMC44XG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBiZSBzaGlmdGVkXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gY2xvY2t3aXNlXG4gICAgICA/IHRoaXMuYWRkKGFuZ2xlKVxuICAgICAgOiB0aGlzLnN1YnRyYWN0KGFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHJlc3VsdCBvZiBzaGlmdGluZyBgdGhpc2AgdG8gaGF2ZSB0aGUgYW5nbGVcbiAgKiBkZXJpdmVkIGZyb20gYG9yaWdpbmAgYXMgaXRzIG9yaWdpbi5cbiAgKlxuICAqIFRoaXMgb3BlcmF0aW9uIGlzIHRoZSBlcXVpdmFsZW50IHRvXG4gICogKyBgb3JpZ2luLmFkZCh0aGlzKWAgd2hlbiBjbG9ja3dpc2VcbiAgKiArIGBvcmlnaW4uc3VidHJhY3QodGhpcylgIHdoZW4gY291bnRlci1jbG9ja3dpc2VcbiAgKlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0VG9PcmlnaW4oMC4zLCB0cnVlKSAgLy8gdHVybiBpcyAwLjMgKyAwLjEgPSAwLjRcbiAgKiByYWMuQW5nbGUoMC4xKS5zaGlmdFRvT3JpZ2luKDAuMywgZmFsc2UpIC8vIHR1cm4gaXMgMC4zIC0gMC4xID0gMC4yXG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IG9yaWdpbiAtIEFuIGBBbmdsZWAgdG8gdXNlIGFzIG9yaWdpblxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzaGlmdFRvT3JpZ2luKG9yaWdpbiwgY2xvY2t3aXNlKSB7XG4gICAgb3JpZ2luID0gdGhpcy5yYWMuQW5nbGUuZnJvbShvcmlnaW4pO1xuICAgIHJldHVybiBvcmlnaW4uc2hpZnQodGhpcywgY2xvY2t3aXNlKTtcbiAgfVxuXG59IC8vIGNsYXNzIEFuZ2xlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBbmdsZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuXG4vKipcbiogQXJjIG9mIGEgY2lyY2xlIGZyb20gYSBzdGFydCBhbmdsZSB0byBhbiBlbmQgYW5nbGUuXG4qXG4qIEFyY3MgdGhhdCBoYXZlIHRoZSBzYW1lIGBzdGFydGAgYW5kIGBlbmRgIGFuZ2xlcyBhcmUgY29uc2lkZXJlZCBhXG4qIGNvbXBsZXRlIGNpcmNsZS5cbipcbiogQGFsaWFzIFJhYy5BcmNcbiovXG5jbGFzcyBBcmN7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQXJjYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gY2VudGVyIC0gVGhlIGNlbnRlciBvZiB0aGUgYXJjXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIGFyY1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBzdGFydCAtIEFuIGBBbmdsZWAgd2hlcmUgdGhlIGFyYyBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gZW5kIC0gQW5nIGBBbmdsZWAgd2hlcmUgdGhlIGFyYyBlbmRzXG4gICogQHBhcmFtIHtib29sZWFufSBjbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIGFyY1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsXG4gICAgY2VudGVyLCByYWRpdXMsXG4gICAgc3RhcnQsIGVuZCxcbiAgICBjbG9ja3dpc2UpXG4gIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgY2VudGVyKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIocmFkaXVzKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5BbmdsZSwgc3RhcnQsIGVuZCk7XG4gICAgdXRpbHMuYXNzZXJ0Qm9vbGVhbihjbG9ja3dpc2UpO1xuXG4gICAgLyoqXG4gICAgKiBJbnRhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgY2VudGVyIGBQb2ludGAgb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIC8qKlxuICAgICogVGhlIHJhZGl1cyBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgYEFuZ2xlYCBvZiB0aGUgYXJjLiBUaGUgYXJjIGlzIGRyYXcgZnJvbSB0aGlzIGFuZ2xlIHRvd2FyZHNcbiAgICAqIGBlbmRgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgICAqXG4gICAgKiBXaGVuIGBzdGFydGAgYW5kIGBlbmRgIGFyZSBbZXF1YWwgYW5nbGVzXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAgICogdGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgICAqL1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydFxuXG4gICAgLyoqXG4gICAgKiBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIGFyYy4gVGhlIGFyYyBpcyBkcmF3IGZyb20gYHN0YXJ0YCB0byB0aGlzXG4gICAgKiBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICAgKlxuICAgICogV2hlbiBgc3RhcnRgIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqIHRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICAgKi9cbiAgICB0aGlzLmVuZCA9IGVuZDtcblxuICAgIC8qKlxuICAgICogVGhlIG9yaWVudGlhdGlvbiBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgKi9cbiAgICB0aGlzLmNsb2Nrd2lzZSA9IGNsb2Nrd2lzZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5jZW50ZXIueCwgICBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmNlbnRlci55LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgcmFkaXVzU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmFkaXVzLCAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydFN0ciAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFN0ciAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC50dXJuLCAgIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBBcmMoKCR7eFN0cn0sJHt5U3RyfSkgcjoke3JhZGl1c1N0cn0gczoke3N0YXJ0U3RyfSBlOiR7ZW5kU3RyfSBjOiR7dGhpcy5jbG9ja3dpc2V9fSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGFsbCBtZW1iZXJzIG9mIGJvdGggYXJjcyBhcmUgZXF1YWwuXG4gICpcbiAgKiBXaGVuIGBvdGhlckFyY2AgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5BcmNgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBBcmNzJyBgcmFkaXVzYCBhcmUgY29tcGFyZWQgdXNpbmcgYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBvdGhlclNlZ21lbnQgLSBBIGBTZWdtZW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICogQHNlZSBSYWMjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlckFyYykge1xuICAgIHJldHVybiBvdGhlckFyYyBpbnN0YW5jZW9mIEFyY1xuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMucmFkaXVzLCBvdGhlckFyYy5yYWRpdXMpXG4gICAgICAmJiB0aGlzLmNsb2Nrd2lzZSA9PT0gb3RoZXJBcmMuY2xvY2t3aXNlXG4gICAgICAmJiB0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXJBcmMuc3RhcnQpXG4gICAgICAmJiB0aGlzLmVuZC5lcXVhbHMob3RoZXJBcmMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBhcmM6IHRoZSBwYXJ0IG9mIHRoZSBjaXJjdW1mZXJlbmNlIHRoZSBhcmNcbiAgKiByZXByZXNlbnRzLlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmdsZURpc3RhbmNlKCkudHVybk9uZSgpICogdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGNvbnNpZGVyZWQgYXMgYSBjb21wbGV0ZVxuICAqIGNpcmNsZS5cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBjaXJjdW1mZXJlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnJhZGl1cyAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGRpc3RhbmNlIGJldHdlZW4gYHN0YXJ0YCBhbmRcbiAgKiBgZW5kYCwgaW4gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmMuXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgYW5nbGVEaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5kaXN0YW5jZSh0aGlzLmVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCB3aGVyZSB0aGUgYXJjIHN0YXJ0cy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdGFydFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZSh0aGlzLnN0YXJ0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIGFyYyBlbmRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGVuZFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZSh0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgY2VudGVyYCB0b3dhcnMgYHN0YXJ0YC5cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgc3RhcnRSYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5zdGFydCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgY2VudGVyYCB0b3dhcnMgYGVuZGAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIGVuZFJheSgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYGNlbnRlcmAgdG8gYHN0YXJ0UG9pbnQoKWAuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzdGFydFNlZ21lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcy5zdGFydFJheSgpLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYGNlbnRlcmAgdG8gYGVuZFBvaW50KClgLlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgZW5kU2VnbWVudCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLmVuZFJheSgpLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHN0YXJ0UG9pbnQoKWAgdG8gYGVuZFBvaW50KClgLlxuICAqXG4gICogTm90ZSB0aGF0IGZvciBjb21wbGV0ZSBjaXJjbGUgYXJjcyB0aGlzIHNlZ21lbnQgd2lsbCBoYXZlIGEgbGVuZ3RoIG9mXG4gICogemVybyBhbmQgYmUgcG9pbnRlZCB0b3dhcmRzIHRoZSBwZXJwZW5kaWN1bGFyIG9mIGBzdGFydGAgaW4gdGhlIGFyYydzXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGNob3JkU2VnbWVudCgpIHtcbiAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gdGhpcy5zdGFydC5wZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydFBvaW50KCkuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRQb2ludCgpLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyYyBpcyBhIGNvbXBsZXRlIGNpcmNsZSwgd2hpY2ggaXMgd2hlbiBgc3RhcnRgXG4gICogYW5kIGBlbmRgIGFyZSBbZXF1YWwgYW5nbGVzXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfS5cbiAgKlxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAqL1xuICBpc0NpcmNsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5lcXVhbHModGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIHNldCB0byBgbmV3Q2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3Q2VudGVyIC0gVGhlIGNlbnRlciBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoQ2VudGVyKG5ld0NlbnRlcikge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgbmV3Q2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggc3RhcnQgc2V0IHRvIGBuZXdTdGFydGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdTdGFydCAtIFRoZSBzdGFydCBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoU3RhcnQobmV3U3RhcnQpIHtcbiAgICBjb25zdCBuZXdTdGFydEFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld1N0YXJ0KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0QW5nbGUsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggZW5kIHNldCB0byBgbmV3RW5kYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IG5ld0VuZCAtIFRoZSBlbmQgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aEVuZChuZXdFbmQpIHtcbiAgICBjb25zdCBuZXdFbmRBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdFbmQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kQW5nbGUsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCByYWRpdXMgc2V0IHRvIGBuZXdSYWRpdXNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdSYWRpdXMgLSBUaGUgcmFkaXVzIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhSYWRpdXMobmV3UmFkaXVzKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBpdHMgb3JpZW50YXRpb24gc2V0IHRvIGBuZXdDbG9ja3dpc2VgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gbmV3Q2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhDbG9ja3dpc2UobmV3Q2xvY2t3aXNlKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIG5ld0Nsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCB0aGUgZ2l2ZW4gYGFuZ2xlRGlzdGFuY2VgIGFzIHRoZSBkaXN0YW5jZVxuICAqIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogQWxsIHByb3BlcnRpZXMgZXhjZXB0IGBlbmRgIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2Ugb2YgdGhlXG4gICogbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBSYWMuQXJjI2FuZ2xlRGlzdGFuY2VcbiAgKi9cbiAgd2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHRoZSBnaXZlbiBgbGVuZ3RoYCBhcyB0aGUgbGVuZ3RoIG9mIHRoZVxuICAqIHBhcnQgb2YgdGhlIGNpcmN1bWZlcmVuY2UgaXQgcmVwcmVzZW50cy5cbiAgKlxuICAqIEFsbCBwcm9wZXJ0aWVzIGV4Y2VwdCBgZW5kYCBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVGhlIGFjdHVhbCBgbGVuZ3RoKClgIG9mIHRoZSByZXN1bHRpbmcgYEFyY2Agd2lsbCBhbHdheXMgYmUgaW4gdGhlXG4gICogcmFuZ2UgYFswLHJhZGl1cypUQVUpYC4gV2hlbiB0aGUgZ2l2ZW4gYGxlbmd0aGAgaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIGN1dCBiYWNrIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBSYWMuQXJjI2xlbmd0aFxuICAqL1xuICB3aXRoTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGEgYGxlbmd0aCgpYCBvZiBgdGhpcy5sZW5ndGgoKSAqIHJhdGlvYC5cbiAgKlxuICAqIEFsbCBwcm9wZXJ0aWVzIGV4Y2VwdCBgZW5kYCBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVGhlIGFjdHVhbCBgbGVuZ3RoKClgIG9mIHRoZSByZXN1bHRpbmcgYEFyY2Agd2lsbCBhbHdheXMgYmUgaW4gdGhlXG4gICogcmFuZ2UgYFswLHJhZGl1cypUQVUpYC4gV2hlbiB0aGUgY2FsY3VsYXRlZCBsZW5ndGggaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIGN1dCBiYWNrIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGgoKWAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5BcmMjbGVuZ3RoXG4gICovXG4gIHdpdGhMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IHRoaXMubGVuZ3RoKCkgKiByYXRpbztcbiAgICByZXR1cm4gdGhpcy53aXRoTGVuZ3RoKG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHBvaW50aW5nIHRvd2FyZHMgYHBvaW50YCBmcm9tXG4gICogYGNlbnRlcmAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuc3RhcnRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBzdGFydGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICB3aXRoU3RhcnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBlbmRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgd2l0aEVuZFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBzdGFydFBvaW50YCBhbmRcbiAgKiBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBlbmRQb2ludGAsIGJvdGggZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiAqIFdoZW4gYGNlbnRlcmAgaXMgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IHRvXG4gICogZWl0aGVyIGBzdGFydFBvaW50YCBvciBgZW5kUG9pbnRgLCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YFxuICAqIG9yIGB0aGlzLmVuZGAgcmVzcGVjdGl2ZWx5LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0UG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYHN0YXJ0YCB0b3dhcmRzXG4gICogQHBhcmFtIHs/UmFjLlBvaW50fSBbZW5kUG9pbnQ9bnVsbF0gLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkcztcbiAgKiB3aGVuIG9tbWl0ZWQgb3IgYG51bGxgLCBgc3RhcnRQb2ludGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhBbmdsZXNUb3dhcmRzUG9pbnQoc3RhcnRQb2ludCwgZW5kUG9pbnQgPSBudWxsKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoc3RhcnRQb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3RW5kID0gZW5kUG9pbnQgPT09IG51bGxcbiAgICAgID8gbmV3U3RhcnRcbiAgICAgIDogdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGVuZFBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggaXRzIGBzdGFydGAgYW5kIGBlbmRgIGV4Y2hhbmdlZCwgYW5kIHRoZVxuICAqIG9wcG9zaXRlIGNsb2Nrd2lzZSBvcmllbnRhdGlvbi4gVGhlIGNlbnRlciBhbmQgcmFkaXVzIHJlbWFpbiBiZSB0aGVcbiAgKiBzYW1lIGFzIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5lbmQsIHRoaXMuc3RhcnQsXG4gICAgICAhdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBnaXZlbiBgYW5nbGVgIGNsYW1wZWQgdG8gdGhlIHJhbmdlOlxuICAqIGBgYFxuICAqIFtzdGFydCArIHN0YXJ0SW5zZXQsIGVuZCAtIGVuZEluc2V0XVxuICAqIGBgYFxuICAqIHdoZXJlIHRoZSBhZGRpdGlvbiBoYXBwZW5zIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLCBhbmQgdGhlXG4gICogc3VidHJhY3Rpb24gYWdhaW5zdC5cbiAgKlxuICAqIFdoZW4gYGFuZ2xlYCBpcyBvdXRzaWRlIHRoZSByYW5nZSwgcmV0dXJucyB3aGljaGV2ZXIgcmFuZ2UgbGltaXQgaXNcbiAgKiBjbG9zZXIuXG4gICpcbiAgKiBXaGVuIHRoZSBzdW0gb2YgdGhlIGdpdmVuIGluc2V0cyBpcyBsYXJnZXIgdGhhdCBgdGhpcy5hcmNEaXN0YW5jZSgpYFxuICAqIHRoZSByYW5nZSBmb3IgdGhlIGNsYW1wIGlzIGltcG9zaWJsZSB0byBmdWxmaWxsLiBJbiB0aGlzIGNhc2UgdGhlXG4gICogcmV0dXJuZWQgdmFsdWUgd2lsbCBiZSB0aGUgY2VudGVyZWQgYmV0d2VlbiB0aGUgcmFuZ2UgbGltaXRzIGFuZCBzdGlsbFxuICAqIGNsYW1wbGVkIHRvIGBbc3RhcnQsIGVuZF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtzdGFydEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV0gLSBUaGUgaW5zZXRcbiAgKiBmb3IgdGhlIGxvd2VyIGxpbWl0IG9mIHRoZSBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gW2VuZEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV0gLSBUaGUgaW5zZXRcbiAgKiBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGUgY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBjbGFtcFRvQW5nbGVzKGFuZ2xlLCBzdGFydEluc2V0ID0gdGhpcy5yYWMuQW5nbGUuemVybywgZW5kSW5zZXQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuXG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSAmJiBzdGFydEluc2V0LnR1cm4gPT0gMCAmJiBlbmRJbnNldC50dXJuID09IDApIHtcbiAgICAgIC8vIENvbXBsZXRlIGNpcmNsZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIEFuZ2xlIGluIGFyYywgd2l0aCBhcmMgYXMgb3JpZ2luXG4gICAgLy8gQWxsIGNvbXBhcmlzb25zIGFyZSBtYWRlIGluIGEgY2xvY2t3aXNlIG9yaWVudGF0aW9uXG4gICAgY29uc3Qgc2hpZnRlZEFuZ2xlID0gdGhpcy5kaXN0YW5jZUZyb21TdGFydChhbmdsZSk7XG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHNoaWZ0ZWRTdGFydENsYW1wID0gc3RhcnRJbnNldDtcbiAgICBjb25zdCBzaGlmdGVkRW5kQ2xhbXAgPSBhbmdsZURpc3RhbmNlLnN1YnRyYWN0KGVuZEluc2V0KTtcbiAgICBjb25zdCB0b3RhbEluc2V0VHVybiA9IHN0YXJ0SW5zZXQudHVybiArIGVuZEluc2V0LnR1cm47XG5cbiAgICBpZiAodG90YWxJbnNldFR1cm4gPj0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkpIHtcbiAgICAgIC8vIEludmFsaWQgcmFuZ2VcbiAgICAgIGNvbnN0IHJhbmdlRGlzdGFuY2UgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZFN0YXJ0Q2xhbXApO1xuICAgICAgbGV0IGhhbGZSYW5nZTtcbiAgICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHtcbiAgICAgICAgaGFsZlJhbmdlID0gcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoYWxmUmFuZ2UgPSB0b3RhbEluc2V0VHVybiA+PSAxXG4gICAgICAgICAgPyByYW5nZURpc3RhbmNlLm11bHRPbmUoMS8yKVxuICAgICAgICAgIDogcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1pZGRsZVJhbmdlID0gc2hpZnRlZEVuZENsYW1wLmFkZChoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgbWlkZGxlID0gdGhpcy5zdGFydC5zaGlmdChtaWRkbGVSYW5nZSwgdGhpcy5jbG9ja3dpc2UpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jbGFtcFRvQW5nbGVzKG1pZGRsZSk7XG4gICAgfVxuXG4gICAgaWYgKHNoaWZ0ZWRBbmdsZS50dXJuID49IHNoaWZ0ZWRTdGFydENsYW1wLnR1cm4gJiYgc2hpZnRlZEFuZ2xlLnR1cm4gPD0gc2hpZnRlZEVuZENsYW1wLnR1cm4pIHtcbiAgICAgIC8vIEluc2lkZSBjbGFtcCByYW5nZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIE91dHNpZGUgcmFuZ2UsIGZpZ3VyZSBvdXQgY2xvc2VzdCBsaW1pdFxuICAgIGxldCBkaXN0YW5jZVRvU3RhcnRDbGFtcCA9IHNoaWZ0ZWRTdGFydENsYW1wLmRpc3RhbmNlKHNoaWZ0ZWRBbmdsZSwgZmFsc2UpO1xuICAgIGxldCBkaXN0YW5jZVRvRW5kQ2xhbXAgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlKTtcbiAgICBpZiAoZGlzdGFuY2VUb1N0YXJ0Q2xhbXAudHVybiA8PSBkaXN0YW5jZVRvRW5kQ2xhbXAudHVybikge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQuc2hpZnQoc3RhcnRJbnNldCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQuc2hpZnQoZW5kSW5zZXQsICF0aGlzLmNsb2Nrd2lzZSk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGBhbmdsZWAgaXMgYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFdoZW4gdGhlIGFyYyByZXByZXNlbnRzIGEgY29tcGxldGUgY2lyY2xlLCBgdHJ1ZWAgaXMgYWx3YXlzIHJldHVybmVkLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICBpZiAodGhpcy5jbG9ja3dpc2UpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBhbmdsZS5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIGxldCBlbmRPZmZzZXQgPSB0aGlzLmVuZC5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJldHVybiBvZmZzZXQudHVybiA8PSBlbmRPZmZzZXQudHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuZW5kKTtcbiAgICAgIGxldCBzdGFydE9mZnNldCA9IHRoaXMuc3RhcnQuc3VidHJhY3QodGhpcy5lbmQpO1xuICAgICAgcmV0dXJuIG9mZnNldC50dXJuIDw9IHN0YXJ0T2Zmc2V0LnR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgIGluIHRoZSBhcmMgaXMgcG9zaXRpb25lZFxuICAqIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiB0aGUgYXJjIHJlcHJlc2VudHMgYSBjb21wbGV0ZSBjaXJjbGUsIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNQcm9qZWN0ZWRQb2ludChwb2ludCkge1xuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgYW5nbGVgIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICogYHN0YXJ0YCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBFLmcuXG4gICogRm9yIGEgY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCBgMC41YDogYHNoaWZ0QW5nbGUoMC4xKWAgaXMgYDAuNmAuXG4gICogRm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IGAwLjVgOiBgc2hpZnRBbmdsZSgwLjEpYCBpcyBgMC40YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKiBAc2VlIFJhYy5BbmdsZSNzaGlmdFxuICAqL1xuICBzaGlmdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnNoaWZ0KGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIGFuIEFuZ2xlIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG9cbiAgLy8gYGFuZ2xlYCB0cmF2ZWxpbmcgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAvLyBVc2VmdWwgdG8gZGV0ZXJtaW5lIGZvciBhIGdpdmVuIGFuZ2xlLCB3aGVyZSBpdCBzaXRzIGluc2lkZSB0aGUgYXJjIGlmXG4gIC8vIHRoZSBhcmMgd2FzIHRoZSBvcmlnaW4gY29vcmRpbmF0ZSBzeXN0ZW0uXG4gIC8vXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gYHN0YXJ0YFxuICAqIHRvIGBhbmdsZWAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogRS5nLlxuICAqIEZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWA6IGBkaXN0YW5jZUZyb21TdGFydCgwLjYpYCBpcyBgMC4xYC5cbiAgKiBGb3IgYSBjb3VudGVyLWNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWA6IGBkaXN0YW5jZUZyb21TdGFydCgwLjYpYCBpcyBgMC45YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgZGlzdGFuY2VGcm9tU3RhcnQoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZGlzdGFuY2UoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGFuZ2xlYC4gVGhpc1xuICAqIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGUgYHN0YXJ0YCBub3IgYGVuZGAgb2YgdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvd2FyZHMgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLmNlbnRlci5wb2ludFRvQW5nbGUoYW5nbGUsIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGFuZ2xlYFxuICAqIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9IGBzdGFydGAgaW4gYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGJlIHNoaWZ0ZWQgYnkgYHN0YXJ0YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRBbmdsZURpc3RhbmNlKGFuZ2xlKSB7XG4gICAgbGV0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuc2hpZnRBbmdsZShhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgdGhlIGdpdmVuIGBsZW5ndGhgIGZyb21cbiAgKiBgc3RhcnRQb2ludCgpYCBpbiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIGZyb20gYHN0YXJ0UG9pbnQoKWAgdG8gdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gbGVuZ3RoIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgYGxlbmd0aCgpICogcmF0aW9gIGZyb21cbiAgKiBgc3RhcnRQb2ludCgpYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGgoKWAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0TGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBsZXQgbmV3QW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpLm11bHRPbmUocmF0aW8pO1xuICAgIGxldCBzaGlmdGVkQW5nbGUgPSB0aGlzLnNoaWZ0QW5nbGUobmV3QW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgcmFkaXVzIG9mIHRoZSBhcmMgYXQgdGhlXG4gICogZ2l2ZW4gYGFuZ2xlYC4gVGhpcyBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlIGBzdGFydGAgbm9yIGBlbmRgIG9mXG4gICogdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgZGlyZWN0aW9uIG9mIHRoZSByYWRpdXMgdG8gcmV0dXJuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICByYWRpdXNTZWdtZW50QXRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBpbiB0aGVcbiAgKiBkaXJlY3Rpb24gdG93YXJkcyB0aGUgZ2l2ZW4gYHBvaW50YC4gVGhpcyBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlXG4gICogYHN0YXJ0YCBub3IgYGVuZGAgb2YgdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLnBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBpbiB0aGUgZGlyZWN0aW9uIG9mIHRoZSByYWRpdXMgdG8gcmV0dXJuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICByYWRpdXNTZWdtZW50VG93YXJkc1BvaW50KHBvaW50KSB7XG4gICAgY29uc3QgYW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmb3IgdGhlIGNob3JkIGZvcm1lZCBieSB0aGUgaW50ZXJzZWN0aW9uIG9mXG4gICogYHRoaXNgIGFuZCBgb3RoZXJBcmNgLCBvciBgbnVsbGAgd2hlbiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYFNlZ21lbnRgIHdpbGwgcG9pbnQgdG93YXJkcyB0aGUgYHRoaXNgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQm90aCBhcmNzIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMgZm9yIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGVcbiAgKiBjaG9yZCwgdGh1cyB0aGUgZW5kcG9pbnRzIG9mIHRoZSByZXR1cm5lZCBzZWdtZW50IG1heSBub3QgbGF5IGluc2lkZVxuICAqIHRoZSBhY3R1YWwgYXJjcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBkZXNjcmlwdGlvblxuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIGludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKSB7XG4gICAgLy8gaHR0cHM6Ly9tYXRod29ybGQud29sZnJhbS5jb20vQ2lyY2xlLUNpcmNsZUludGVyc2VjdGlvbi5odG1sXG4gICAgLy8gUj10aGlzLCByPW90aGVyQXJjXG5cbiAgICBpZiAodGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KG90aGVyQXJjLmNlbnRlcik7XG5cbiAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnJhZGl1cyArIG90aGVyQXJjLnJhZGl1cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gZGlzdGFuY2VUb0Nob3JkID0gKGReMiAtIHJeMiArIFJeMikgLyAoZCoyKVxuICAgIGNvbnN0IGRpc3RhbmNlVG9DaG9yZCA9IChcbiAgICAgICAgTWF0aC5wb3coZGlzdGFuY2UsIDIpXG4gICAgICAtIE1hdGgucG93KG90aGVyQXJjLnJhZGl1cywgMilcbiAgICAgICsgTWF0aC5wb3codGhpcy5yYWRpdXMsIDIpXG4gICAgICApIC8gKGRpc3RhbmNlICogMik7XG5cbiAgICAvLyBhID0gMS9kIHNxcnR8KC1kK3ItUikoLWQtcitSKSgtZCtyK1IpKGQrcitSKVxuICAgIGNvbnN0IGNob3JkTGVuZ3RoID0gKDEgLyBkaXN0YW5jZSkgKiBNYXRoLnNxcnQoXG4gICAgICAgICgtZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgLSB0aGlzLnJhZGl1cylcbiAgICAgICogKC1kaXN0YW5jZSAtIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKVxuICAgICAgKiAoLWRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpXG4gICAgICAqIChkaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKSk7XG5cbiAgICBjb25zdCBzZWdtZW50VG9DaG9yZCA9IHRoaXMuY2VudGVyLnJheVRvUG9pbnQob3RoZXJBcmMuY2VudGVyKVxuICAgICAgLnNlZ21lbnQoZGlzdGFuY2VUb0Nob3JkKTtcbiAgICByZXR1cm4gc2VnbWVudFRvQ2hvcmQubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlLCBjaG9yZExlbmd0aC8yKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGhSYXRpbygyKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgaWYgaW50ZXJzZWN0aW5nUG9pbnRzV2l0aEFyYyBpcyBuZWNlc3NhcnlcbiAgLyoqXG4gICogQGlnbm9yZVxuICAqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpbnRlcnNlY3RpbmcgcG9pbnRzIG9mIGB0aGlzYCB3aXRoXG4gICogYG90aGVyQXJjYC5cbiAgKlxuICAqIFdoZW4gdGhlcmUgYXJlIG5vIGludGVyc2VjdGluZyBwb2ludHMsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGludGVyc2VjdGlvbiBwb2ludHMgd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICAvLyBpbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjKG90aGVyQXJjKSB7XG4gIC8vICAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gIC8vICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBbXTsgfVxuXG4gIC8vICAgbGV0IGludGVyc2VjdGlvbnMgPSBbY2hvcmQuc3RhcnRQb2ludCgpLCBjaG9yZC5lbmRQb2ludCgpXS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAvLyAgICAgcmV0dXJuIHRoaXMuY29udGFpbnNBbmdsZSh0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSlcbiAgLy8gICAgICAgJiYgb3RoZXJBcmMuY29udGFpbnNBbmdsZShvdGhlckFyYy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbSkpO1xuICAvLyAgIH0sIHRoaXMpO1xuXG4gIC8vICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiB0aGUgYXJjIGFuZCAncmF5Jywgb3IgYG51bGxgIHdoZW4gbm8gY2hvcmQgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYFNlZ21lbnRgIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgYW5nbGUgYXMgYHJheWAuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUgYW5kIGByYXlgIGlzIGNvbnNpZGVyZWQgYW5cbiAgKiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmRXaXRoUmF5KHJheSkge1xuICAgIC8vIEZpcnN0IGNoZWNrIGludGVyc2VjdGlvblxuICAgIGNvbnN0IGJpc2VjdG9yID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KHJheSk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBiaXNlY3Rvci5sZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvbyBjbG9zZSB0byBjZW50ZXIsIGNvc2luZSBjYWxjdWxhdGlvbnMgbWF5IGJlIGluY29ycmVjdFxuICAgIC8vIENhbGN1bGF0ZSBzZWdtZW50IHRocm91Z2ggY2VudGVyXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscygwLCBkaXN0YW5jZSkpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUocmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgc3RhcnQsIHJheS5hbmdsZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKjIpO1xuICAgIH1cblxuICAgIC8vIFJheSBpcyB0YW5nZW50LCByZXR1cm4gemVyby1sZW5ndGggc2VnbWVudCBhdCBjb250YWN0IHBvaW50XG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgdGhpcy5yYWRpdXMpKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLnJheS5hbmdsZSk7XG4gICAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgc3RhcnQsIHJheS5hbmdsZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIDApO1xuICAgIH1cblxuICAgIC8vIFJheSBkb2VzIG5vdCB0b3VjaCBhcmNcbiAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnJhZGl1cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYWNvcyhkaXN0YW5jZS90aGlzLnJhZGl1cyk7XG4gICAgY29uc3QgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIHJhZGlhbnMpO1xuXG4gICAgY29uc3QgY2VudGVyT3JpZW50YXRpb24gPSByYXkucG9pbnRPcmllbnRhdGlvbih0aGlzLmNlbnRlcik7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5hbmdsZSgpLnNoaWZ0KGFuZ2xlLCAhY2VudGVyT3JpZW50YXRpb24pKTtcbiAgICBjb25zdCBlbmQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5hbmdsZSgpLnNoaWZ0KGFuZ2xlLCBjZW50ZXJPcmllbnRhdGlvbikpO1xuICAgIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQsIHJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCByZXByZXNlbnRpbmcgdGhlIGVuZCBvZiB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiB0aGUgYXJjIGFuZCAncmF5Jywgb3IgYG51bGxgIHdoZW4gbm8gY2hvcmQgaXMgcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB1c2VQcm9qZWN0aW9uYCBpcyBgdHJ1ZWAgdGhlIG1ldGhvZCB3aWxsIGFsd2F5cyByZXR1cm4gYSBgUG9pbnRgXG4gICogZXZlbiB3aGVuIHRoZXJlIGlzIG5vIGNvbnRhY3QgYmV0d2VlbiB0aGUgYXJjIGFuZCBgcmF5YC4gSW4gdGhpcyBjYXNlXG4gICogdGhlIHBvaW50IGluIHRoZSBhcmMgY2xvc2VzdCB0byBgcmF5YCBpcyByZXR1cm5lZC5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSBhbmQgYHJheWAgaXMgY29uc2lkZXJlZCBhblxuICAqIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5Qb2ludH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmRFbmRXaXRoUmF5KHJheSwgdXNlUHJvamVjdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkV2l0aFJheShyYXkpO1xuICAgIGlmIChjaG9yZCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNob3JkLmVuZFBvaW50KCk7XG4gICAgfVxuXG4gICAgaWYgKHVzZVByb2plY3Rpb24pIHtcbiAgICAgIGNvbnN0IGNlbnRlck9yaWVudGF0aW9uID0gcmF5LnBvaW50T3JpZW50YXRpb24odGhpcy5jZW50ZXIpO1xuICAgICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCFjZW50ZXJPcmllbnRhdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUocGVycGVuZGljdWxhcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcmVwcmVzZW50aW5nIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZVxuICAqIGBvdGhlckFyY2AsIG9yIGBudWxsYCB3aGVuIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi4gVGhlIHJldHVybmVkIGFyY1xuICAqIHdpbGwgaGF2ZSB0aGUgc2FtZSBjZW50ZXIsIHJhZGl1cywgYW5kIG9yaWVudGF0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIEJvdGggYXJjcyBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzIGZvciB0aGUgY2FsY3VsYXRpb24gb2YgdGhlXG4gICogaW50ZXJzZWN0aW9uLCB0aHVzIHRoZSBlbmRwb2ludHMgb2YgdGhlIHJldHVybmVkIGFyYyBtYXkgbm90IGxheSBpbnNpZGVcbiAgKiBgdGhpc2AuXG4gICpcbiAgKiBBbiBlZGdlIGNhc2Ugb2YgdGhpcyBtZXRob2QgaXMgdGhhdCB3aGVuIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGB0aGlzYFxuICAqIGFuZCBgb3RoZXJBcmNgIGlzIHRoZSBzdW0gb2YgdGhlaXIgcmFkaXVzLCBtZWFuaW5nIHRoZSBhcmNzIHRvdWNoIGF0IGFcbiAgKiBzaW5nbGUgcG9pbnQsIHRoZSByZXN1bHRpbmcgYXJjIG1heSBoYXZlIGEgYW5nbGUtZGlzdGFuY2Ugb2YgemVybyxcbiAgKiB3aGljaCBpcyBpbnRlcnByZXRlZCBhcyBhIGNvbXBsZXRlLWNpcmNsZSBhcmMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gaW50ZXJzZWN0IHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5BcmN9XG4gICovXG4gIGludGVyc2VjdGlvbkFyYyhvdGhlckFyYykge1xuICAgIGNvbnN0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVzVG93YXJkc1BvaW50KGNob3JkLnN0YXJ0UG9pbnQoKSwgY2hvcmQuZW5kUG9pbnQoKSk7XG4gIH1cblxuXG4gIC8vIFRPRE86IGltcGxlbWVudCBpbnRlcnNlY3Rpb25BcmNOb0NpcmNsZT9cblxuXG4gIC8vIFRPRE86IGZpbmlzaCBib3VuZGVkSW50ZXJzZWN0aW9uQXJjXG4gIC8qKlxuICAqIEBpZ25vcmVcbiAgKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcmVwcmVzZW50aW5nIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZVxuICAqIGBvdGhlckFyY2AgYW5kIGJvdW5kZWQgYnkgYHRoaXMuc3RhcnRgIGFuZCBgdGhpcy5lbmRgLCBvciBgbnVsbGAgd2hlblxuICAqIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi4gVGhlIHJldHVybmVkIGFyYyB3aWxsIGhhdmUgdGhlIHNhbWUgY2VudGVyLFxuICAqIHJhZGl1cywgYW5kIG9yaWVudGF0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIGBvdGhlckFyY2AgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSwgd2hpbGUgdGhlIHN0YXJ0IGFuZCBlbmQgb2ZcbiAgKiBgdGhpc2AgYXJlIGNvbnNpZGVyZWQgZm9yIHRoZSByZXN1bHRpbmcgYEFyY2AuXG4gICpcbiAgKiBXaGVuIHRoZXJlIGV4aXN0IHR3byBzZXBhcmF0ZSBhcmMgc2VjdGlvbnMgdGhhdCBpbnRlcnNlY3Qgd2l0aFxuICAqIGBvdGhlckFyY2A6IG9ubHkgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIGNsb3Nlc3QgdG8gYHN0YXJ0YCBpcyByZXR1cm5lZC5cbiAgKiBUaGlzIGNhbiBoYXBwZW4gd2hlbiBgdGhpc2Agc3RhcnRzIGluc2lkZSBgb3RoZXJBcmNgLCB0aGVuIGV4aXRzLCBhbmRcbiAgKiB0aGVuIGVuZHMgaW5zaWRlIGBvdGhlckFyY2AsIHJlZ2FyZGxlc3MgaWYgYHRoaXNgIGlzIGEgY29tcGxldGUgY2lyY2xlXG4gICogb3Igbm90LlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGludGVyc2VjdCB3aXRoXG4gICogQHJldHVybnMgez9SYWMuQXJjfVxuICAqL1xuICAvLyBib3VuZGVkSW50ZXJzZWN0aW9uQXJjKG90aGVyQXJjKSB7XG4gIC8vICAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gIC8vICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgLy8gICBsZXQgY2hvcmRTdGFydEFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGNob3JkLnN0YXJ0UG9pbnQoKSk7XG4gIC8vICAgbGV0IGNob3JkRW5kQW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoY2hvcmQuZW5kUG9pbnQoKSk7XG5cbiAgLy8gICAvLyBnZXQgYWxsIGRpc3RhbmNlcyBmcm9tIHRoaXMuc3RhcnRcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkRW5kQW5nbGUsIG9ubHkgc3RhcnQgbWF5IGJlIGluc2lkZSBhcmNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIHRoaXMuZW5kLCB3aG9sZSBhcmMgaXMgaW5zaWRlIG9yIG91dHNpZGVcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkU3RhcnRBbmdsZSwgb25seSBlbmQgbWF5IGJlIGluc2lkZSBhcmNcbiAgLy8gICBjb25zdCBpbnRlclN0YXJ0RGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKGNob3JkU3RhcnRBbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyAgIGNvbnN0IGludGVyRW5kRGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKGNob3JkRW5kQW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgLy8gICBjb25zdCBlbmREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UodGhpcy5lbmQsIHRoaXMuY2xvY2t3aXNlKTtcblxuXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZFN0YXJ0QW5nbGUsIG5vcm1hbCBydWxlc1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIG5vdCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRTdGFydCwgcmV0dXJuIG51bGxcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCBub3QgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkZW5kLCByZXR1cm4gc2VsZlxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZFN0YXJ0LCBub3JtYWwgcnVsZXNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRlbmQsIHJldHVybiBzdGFydCB0byBjaG9yZGVuZFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRFbmRBbmdsZSwgcmV0dXJuIHN0YXJ0IHRvIGNob3JkRW5kXG5cblxuICAvLyAgIGlmICghdGhpcy5jb250YWluc0FuZ2xlKGNob3JkU3RhcnRBbmdsZSkpIHtcbiAgLy8gICAgIGNob3JkU3RhcnRBbmdsZSA9IHRoaXMuc3RhcnQ7XG4gIC8vICAgfVxuICAvLyAgIGlmICghdGhpcy5jb250YWluc0FuZ2xlKGNob3JkRW5kQW5nbGUpKSB7XG4gIC8vICAgICBjaG9yZEVuZEFuZ2xlID0gdGhpcy5lbmQ7XG4gIC8vICAgfVxuXG4gIC8vICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gIC8vICAgICBjaG9yZFN0YXJ0QW5nbGUsXG4gIC8vICAgICBjaG9yZEVuZEFuZ2xlLFxuICAvLyAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IGlzIHRhbmdlbnQgdG8gYm90aCBgdGhpc2AgYW5kIGBvdGhlckFyY2AsXG4gICogb3IgYG51bGxgIHdoZW4gbm8gdGFuZ2VudCBzZWdtZW50IGlzIHBvc3NpYmxlLiBUaGUgbmV3IGBTZWdtZW50YCBzdGFydHNcbiAgKiBhdCB0aGUgY29udGFjdCBwb2ludCB3aXRoIGB0aGlzYCBhbmQgZW5kcyBhdCB0aGUgY29udGFjdCBwb2ludCB3aXRoXG4gICogYG90aGVyQXJjYC5cbiAgKlxuICAqIENvbnNpZGVyaW5nIF9jZW50ZXIgYXhpc18gYSByYXkgZnJvbSBgdGhpcy5jZW50ZXJgIHRvd2FyZHNcbiAgKiBgb3RoZXJBcmMuY2VudGVyYCwgYHN0YXJ0Q2xvY2t3aXNlYCBkZXRlcm1pbmVzIHRoZSBzaWRlIG9mIHRoZSBzdGFydFxuICAqIHBvaW50IG9mIHRoZSByZXR1cm5lZCBzZWdtZW50IGluIHJlbGF0aW9uIHRvIF9jZW50ZXIgYXhpc18sIGFuZFxuICAqIGBlbmRDbG9ja3dpc2VgIHRoZSBzaWRlIG9mIHRoZSBlbmQgcG9pbnQuXG4gICpcbiAgKiBCb3RoIGB0aGlzYCBhbmQgYG90aGVyQXJjYCBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGNhbGN1bGF0ZSBhIHRhbmdlbnQgc2VnbWVudCB0b3dhcmRzXG4gICogQHBhcmFtIHtib29sZWFufSBzdGFydENsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIHN0YXJ0IHBvaW50IGluIHJlbGF0aW9uIHRvIHRoZSBfY2VudGVyIGF4aXNfXG4gICogQHBhcmFtIHtib29sZWFufSBlbmRDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBlbmQgcG9pbnQgaW4gcmVsYXRpb24gdG8gdGhlIF9jZW50ZXIgYXhpc19cbiAgKiBAcmV0dXJucyB7P1JhYy5TZWdtZW50fVxuICAqL1xuICB0YW5nZW50U2VnbWVudChvdGhlckFyYywgc3RhcnRDbG9ja3dpc2UgPSB0cnVlLCBlbmRDbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuY2VudGVyLmVxdWFscyhvdGhlckFyYy5jZW50ZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBIeXBvdGhlbnVzZSBvZiB0aGUgdHJpYW5nbGUgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHRhbmdlbnRcbiAgICAvLyBtYWluIGFuZ2xlIGlzIGF0IGB0aGlzLmNlbnRlcmBcbiAgICBjb25zdCBoeXBTZWdtZW50ID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQob3RoZXJBcmMuY2VudGVyKTtcbiAgICBjb25zdCBvcHMgPSBzdGFydENsb2Nrd2lzZSA9PT0gZW5kQ2xvY2t3aXNlXG4gICAgICA/IG90aGVyQXJjLnJhZGl1cyAtIHRoaXMucmFkaXVzXG4gICAgICA6IG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzO1xuXG4gICAgLy8gV2hlbiBvcHMgYW5kIGh5cCBhcmUgY2xvc2UsIHNuYXAgdG8gMVxuICAgIGNvbnN0IGFuZ2xlU2luZSA9IHRoaXMucmFjLmVxdWFscyhNYXRoLmFicyhvcHMpLCBoeXBTZWdtZW50Lmxlbmd0aClcbiAgICAgID8gKG9wcyA+IDAgPyAxIDogLTEpXG4gICAgICA6IG9wcyAvIGh5cFNlZ21lbnQubGVuZ3RoO1xuICAgIGlmIChNYXRoLmFicyhhbmdsZVNpbmUpID4gMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYW5nbGVSYWRpYW5zID0gTWF0aC5hc2luKGFuZ2xlU2luZSk7XG4gICAgY29uc3Qgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG5cbiAgICBjb25zdCBhZGpPcmllbnRhdGlvbiA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gc3RhcnRDbG9ja3dpc2VcbiAgICAgIDogIXN0YXJ0Q2xvY2t3aXNlO1xuICAgIGNvbnN0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cFNlZ21lbnQucmF5LmFuZ2xlLnNoaWZ0KG9wc0FuZ2xlLCBhZGpPcmllbnRhdGlvbik7XG4gICAgY29uc3Qgc2hpZnRlZEFkakFuZ2xlID0gc2hpZnRlZE9wc0FuZ2xlLnBlcnBlbmRpY3VsYXIoYWRqT3JpZW50YXRpb24pO1xuXG4gICAgY29uc3Qgc3RhcnRBbmdsZSA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gc2hpZnRlZEFkakFuZ2xlXG4gICAgICA6IHNoaWZ0ZWRBZGpBbmdsZS5pbnZlcnNlKClcbiAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICAgIGNvbnN0IGVuZCA9IG90aGVyQXJjLnBvaW50QXRBbmdsZShzaGlmdGVkQWRqQW5nbGUpO1xuICAgIGNvbnN0IGRlZmF1bHRBbmdsZSA9IHN0YXJ0QW5nbGUucGVycGVuZGljdWxhcighc3RhcnRDbG9ja3dpc2UpO1xuICAgIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQsIGRlZmF1bHRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBuZXcgYEFyY2Agb2JqZWN0cyByZXByZXNlbnRpbmcgYHRoaXNgXG4gICogZGl2aWRlZCBpbnRvIGBjb3VudGAgYXJjcywgYWxsIHdpdGggdGhlIHNhbWVcbiAgKiBbYW5nbGUgZGlzdGFuY2Vde0BsaW5rIFJhYy5BcmMjYW5nbGVEaXN0YW5jZX0uXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gV2hlbiBgY291bnRgIGlzXG4gICogYDFgIHJldHVybnMgYW4gYXJjIGVxdWl2YWxlbnQgdG8gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIGFyY3MgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5BcmNbXX1cbiAgKi9cbiAgZGl2aWRlVG9BcmNzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIFtdOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgY29uc3QgYXJjcyA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3VudDsgaW5kZXggKz0gMSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogaW5kZXgsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiAoaW5kZXgrMSksIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGFyYyA9IG5ldyBBcmModGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cywgc3RhcnQsIGVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgYXJjcy5wdXNoKGFyYyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyY3M7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBuZXcgYFNlZ21lbnRgIG9iamVjdHMgcmVwcmVzZW50aW5nIGB0aGlzYFxuICAqIGRpdmlkZWQgaW50byBgY291bnRgIGNob3JkcywgYWxsIHdpdGggdGhlIHNhbWUgbGVuZ3RoLlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuIFdoZW4gYGNvdW50YCBpc1xuICAqIGAxYCByZXR1cm5zIGFuIGFyYyBlcXVpdmFsZW50IHRvXG4gICogYFt0aGlzLmNob3JkU2VnbWVudCgpXXtAbGluayBSYWMuQXJjI2Nob3JkU2VnbWVudH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIHNlZ21lbnRzIHRvIGRpdmlkZSBgdGhpc2AgaW50b1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudFtdfVxuICAqL1xuICBkaXZpZGVUb1NlZ21lbnRzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIFtdOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgY29uc3Qgc2VnbWVudHMgPSBbXTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY291bnQ7IGluZGV4ICs9IDEpIHtcbiAgICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogaW5kZXgsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGVuZEFuZ2xlID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIChpbmRleCsxKSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3Qgc3RhcnRQb2ludCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICAgICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLnBvaW50QXRBbmdsZShlbmRBbmdsZSk7XG4gICAgICBjb25zdCBzZWdtZW50ID0gc3RhcnRQb2ludC5zZWdtZW50VG9Qb2ludChlbmRQb2ludCk7XG4gICAgICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50cztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29tcG9zaXRlYCB0aGF0IGNvbnRhaW5zIGBCZXppZXJgIG9iamVjdHMgcmVwcmVzZW50aW5nXG4gICogdGhlIGFyYyBkaXZpZGVkIGludG8gYGNvdW50YCBiZXppZXJzIHRoYXQgYXBwcm94aW1hdGUgdGhlIHNoYXBlIG9mIHRoZVxuICAqIGFyYy5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGBDb21wb3NpdGVgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIGJlemllcnMgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5Db21wb3NpdGV9XG4gICpcbiAgKiBAc2VlIFJhYy5CZXppZXJcbiAgKi9cbiAgZGl2aWRlVG9CZXppZXJzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjLCBbXSk7IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICAvLyBsZW5ndGggb2YgdGFuZ2VudDpcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzM0NzQ1L2hvdy10by1jcmVhdGUtY2lyY2xlLXdpdGgtYiVDMyVBOXppZXItY3VydmVzXG4gICAgY29uc3QgcGFyc1BlclR1cm4gPSAxIC8gcGFydFR1cm47XG4gICAgLy8gVE9ETzogdXNlIFRBVSBpbnN0ZWFkXG4gICAgY29uc3QgdGFuZ2VudCA9IHRoaXMucmFkaXVzICogKDQvMykgKiBNYXRoLnRhbihNYXRoLlBJLyhwYXJzUGVyVHVybioyKSk7XG5cbiAgICBjb25zdCBiZXppZXJzID0gW107XG4gICAgY29uc3Qgc2VnbWVudHMgPSB0aGlzLmRpdmlkZVRvU2VnbWVudHMoY291bnQpO1xuICAgIC8vIFRPRE86IHVzZSBhbm9ueW1vdXMgZnVuY3Rpb25cbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIC8vIFRPRE86IHVzZSBSYXlzP1xuICAgICAgY29uc3Qgc3RhcnRBcmNSYXkgPSAgdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbS5zdGFydFBvaW50KCkpO1xuICAgICAgY29uc3QgZW5kQXJjUmF5ID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbS5lbmRQb2ludCgpKTtcblxuICAgICAgbGV0IHN0YXJ0QW5jaG9yID0gc3RhcnRBcmNSYXlcbiAgICAgICAgLm5leHRTZWdtZW50VG9BbmdsZURpc3RhbmNlKHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgIXRoaXMuY2xvY2t3aXNlLCB0YW5nZW50KVxuICAgICAgICAuZW5kUG9pbnQoKTtcbiAgICAgIGxldCBlbmRBbmNob3IgPSBlbmRBcmNSYXlcbiAgICAgICAgLm5leHRTZWdtZW50VG9BbmdsZURpc3RhbmNlKHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgdGhpcy5jbG9ja3dpc2UsIHRhbmdlbnQpXG4gICAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgICBiZXppZXJzLnB1c2gobmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgIHN0YXJ0QXJjUmF5LmVuZFBvaW50KCksIHN0YXJ0QW5jaG9yLFxuICAgICAgICBlbmRBbmNob3IsIGVuZEFyY1JheS5lbmRQb2ludCgpKSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gbmV3IFJhYy5Db21wb3NpdGUodGhpcy5yYWMsIGJlemllcnMpO1xuICB9XG5cbn0gLy8gY2xhc3MgQXJjXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmM7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBCZXppZXIgY3VydmUgd2l0aCBzdGFydCwgZW5kLCBhbmQgdHdvIGFuY2hvciBwb2ludHMuXG4qIEBhbGlhcyBSYWMuQmV6aWVyXG4qL1xuY2xhc3MgQmV6aWVyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCk7XG5cbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5zdGFydEFuY2hvciA9IHN0YXJ0QW5jaG9yO1xuICAgIHRoaXMuZW5kQW5jaG9yID0gZW5kQW5jaG9yO1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHN0YXJ0WFN0ciAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRZU3RyICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueSwgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydEFuY2hvclhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydEFuY2hvci54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yWVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0QW5jaG9yLnksIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kQW5jaG9yWFN0ciAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kQW5jaG9yLngsICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRBbmNob3JZU3RyICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmRBbmNob3IueSwgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFhTdHIgICAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC54LCAgICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kWVN0ciAgICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLnksICAgICAgICAgZGlnaXRzKTtcblxuICAgIHJldHVybiBgQmV6aWVyKHM6KCR7c3RhcnRYU3RyfSwke3N0YXJ0WVN0cn0pIHNhOigke3N0YXJ0QW5jaG9yWFN0cn0sJHtzdGFydEFuY2hvcllTdHJ9KSBlYTooJHtlbmRBbmNob3JYU3RyfSwke2VuZEFuY2hvcllTdHJ9KSBlOigke2VuZFhTdHJ9LCR7ZW5kWVN0cn0pKWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMgb2YgYm90aCBiZXppZXJzIGFyZVxuICAqIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfS5cbiAgKlxuICAqIFdoZW4gYG90aGVyQmV6aWVyYCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLkJlemllcmAsIHJldHVybnNcbiAgKiBgZmFsc2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQmV6aWVyfSBvdGhlckJlemllciAtIEEgYEJlemllcmAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlckJlemllcikge1xuICAgIHJldHVybiBvdGhlckJlemllciBpbnN0YW5jZW9mIEJlemllclxuICAgICAgJiYgdGhpcy5zdGFydCAgICAgIC5lcXVhbHMob3RoZXJCZXppZXIuc3RhcnQpXG4gICAgICAmJiB0aGlzLnN0YXJ0QW5jaG9yLmVxdWFscyhvdGhlckJlemllci5zdGFydEFuY2hvcilcbiAgICAgICYmIHRoaXMuZW5kQW5jaG9yICAuZXF1YWxzKG90aGVyQmV6aWVyLmVuZEFuY2hvcilcbiAgICAgICYmIHRoaXMuZW5kICAgICAgICAuZXF1YWxzKG90aGVyQmV6aWVyLmVuZCk7XG4gIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQmV6aWVyO1xuXG5cbkJlemllci5wcm90b3R5cGUuZHJhd0FuY2hvcnMgPSBmdW5jdGlvbihzdHlsZSA9IHVuZGVmaW5lZCkge1xuICBwdXNoKCk7XG4gIGlmIChzdHlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3R5bGUuYXBwbHkoKTtcbiAgfVxuICB0aGlzLnN0YXJ0LnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnRBbmNob3IpLmRyYXcoKTtcbiAgdGhpcy5lbmQuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRBbmNob3IpLmRyYXcoKTtcbiAgcG9wKCk7XG59O1xuXG5CZXppZXIucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCZXppZXIodGhpcy5yYWMsXG4gICAgdGhpcy5lbmQsIHRoaXMuZW5kQW5jaG9yLFxuICAgIHRoaXMuc3RhcnRBbmNob3IsIHRoaXMuc3RhcnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuICAvLyBDb250YWlucyBhIHNlcXVlbmNlIG9mIGdlb21ldHJ5IG9iamVjdHMgd2hpY2ggY2FuIGJlIGRyYXduIG9yIHZlcnRleFxuICAvLyB0b2dldGhlci5cbmZ1bmN0aW9uIENvbXBvc2l0ZShyYWMsIHNlcXVlbmNlID0gW10pIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc2VxdWVuY2UpO1xuXG4gIHRoaXMucmFjID0gcmFjO1xuICB0aGlzLnNlcXVlbmNlID0gc2VxdWVuY2U7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRlO1xuXG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuaXNOb3RFbXB0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zZXF1ZW5jZS5sZW5ndGggIT0gMDtcbn07XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgZWxlbWVudC5mb3JFYWNoKGl0ZW0gPT4gdGhpcy5zZXF1ZW5jZS5wdXNoKGl0ZW0pKTtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLnNlcXVlbmNlLnB1c2goZWxlbWVudCk7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHJldmVyc2VkID0gdGhpcy5zZXF1ZW5jZS5tYXAoaXRlbSA9PiBpdGVtLnJldmVyc2UoKSlcbiAgICAucmV2ZXJzZSgpO1xuICByZXR1cm4gbmV3IENvbXBvc2l0ZSh0aGlzLnJhYywgcmV2ZXJzZWQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFBvaW50IGluIGEgdHdvIGRpbWVudGlvbmFsIGNvb3JkaW5hdGUgc3lzdGVtLlxuKlxuKiBTZXZlcmFsIG1ldGhvZHMgd2lsbCByZXR1cm4gYW4gYWRqdXN0ZWQgdmFsdWUgb3IgcGVyZm9ybSBhZGp1c3RtZW50cyBpblxuKiB0aGVpciBvcGVyYXRpb24gd2hlbiB0d28gcG9pbnRzIGFyZSBjbG9zZSBlbm91Z2ggYXMgdG8gYmUgY29uc2lkZXJlZFxuKiBlcXVhbC4gV2hlbiB0aGUgdGhlIGRpZmZlcmVuY2Ugb2YgZWFjaCBjb29yZGluYXRlIG9mIHR3byBwb2ludHNcbiogaXMgdW5kZXIgYHtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9YCB0aGUgcG9pbnRzIGFyZSBjb25zaWRlcmVkIGVxdWFsLlxuKiBUaGUgbWV0aG9kIGB7QGxpbmsgUmFjLlBvaW50I2VxdWFsc31gIHBlcmZvcm1zIHRoaXMgY2hlY2suXG4qXG4qIEBhbGlhcyBSYWMuUG9pbnRcbiovXG5jbGFzcyBQb2ludHtcblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFBvaW50YCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZVxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHgsIHkpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCB4LCB5KTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIoeCwgeSk7XG5cbiAgICAvKipcbiAgICAqIEludGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy54ID0geDtcblxuICAgIC8qKlxuICAgICogWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy55LCBkaWdpdHMpO1xuICAgIHJldHVybiBgUG9pbnQoJHt4U3RyfSwke3lTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCBgb3RoZXJQb2ludGAgZm9yIGVhY2ggY29vcmRpbmF0ZSBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAsIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclBvaW50YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlBvaW50YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVmFsdWVzIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBvdGhlclBvaW50IC0gQSBgUG9pbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYyNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyUG9pbnQpIHtcbiAgICByZXR1cm4gb3RoZXJQb2ludCBpbnN0YW5jZW9mIFBvaW50XG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy54LCBvdGhlclBvaW50LngpXG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy55LCBvdGhlclBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WCAtIFRoZSB4IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHdpdGhYKG5ld1gpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCBuZXdYLCB0aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WSAtIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHdpdGhZKG5ld1kpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLngsIG5ld1kpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgYWRkZWQgdG8gYHRoaXMueGAuXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFgoeCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyB4LCB0aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeWAgYWRkZWQgdG8gYHRoaXMueWAuXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFkoeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLngsIHRoaXMueSArIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBjb21wb25lbnRzIG9mIGBwb2ludGAgdG8gYHRoaXNgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGRQb2ludChwb2ludCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHBvaW50LngsXG4gICAgICB0aGlzLnkgKyBwb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IGFkZGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cyB0byBgdGhpc2AuXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29kaW5hdGUgdG8gYWRkXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29kaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkKHgsIHkpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgeCwgdGhpcy55ICsgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgY29tcG9uZW50cyBvZiBgcG9pbnRgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBzdWJ0cmFjdFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN1YnRyYWN0UG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KFxuICAgICAgdGhpcy5yYWMsXG4gICAgICB0aGlzLnggLSBwb2ludC54LFxuICAgICAgdGhpcy55IC0gcG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cy5cbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb2RpbmF0ZSB0byBzdWJ0cmFjdFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vZGluYXRlIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3VidHJhY3QoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHgsXG4gICAgICB0aGlzLnkgLSB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdpdGggdGhlIG5lZ2F0aXZlIGNvb3JkaW5hdGUgdmFsdWVzIG9mIGB0aGlzYC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBuZWdhdGl2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCAtdGhpcy54LCAtdGhpcy55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gYHBvaW50YCwgb3IgcmV0dXJucyBgMGAgd2hlblxuICAqIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgZGlzdGFuY2VUb1BvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuZXF1YWxzKHBvaW50KSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbnN0IHggPSBNYXRoLnBvdygocG9pbnQueCAtIHRoaXMueCksIDIpO1xuICAgIGNvbnN0IHkgPSBNYXRoLnBvdygocG9pbnQueSAtIHRoaXMueSksIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCt5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYW5nbGUgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgcmV0dXJucyB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aFxuICAqIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGFuZ2xlIHRvXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZGVmYXVsdEFuZ2xlPWluc3RhbmNlLkFuZ2xlLlplcm9dIC1cbiAgKiBBbiBgQW5nbGVgIHRvIHJldHVybiB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBhbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBpZiAodGhpcy5lcXVhbHMocG9pbnQpKSB7XG4gICAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGRlZmF1bHRBbmdsZSk7XG4gICAgICByZXR1cm4gZGVmYXVsdEFuZ2xlO1xuICAgIH1cbiAgICBjb25zdCBvZmZzZXQgPSBwb2ludC5zdWJ0cmFjdFBvaW50KHRoaXMpO1xuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmF0YW4yKG9mZnNldC55LCBvZmZzZXQueCk7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgcmFkaWFucyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCBhIGBkaXN0YW5jZWAgZnJvbSBgdGhpc2AgaW4gdGhlIGRpcmVjdGlvbiBvZlxuICAqIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0b3dhcnMgdGhlIG5ldyBgUG9pbnRgXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IGRpc3RhbmNlWCA9IGRpc3RhbmNlICogTWF0aC5jb3MoYW5nbGUucmFkaWFucygpKTtcbiAgICBjb25zdCBkaXN0YW5jZVkgPSBkaXN0YW5jZSAqIE1hdGguc2luKGFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgdGhpcy54ICsgZGlzdGFuY2VYLCB0aGlzLnkgKyBkaXN0YW5jZVkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFuZ2xlYC5cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGBBbmdsZWAgb2YgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXkoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvd2FyZHMgYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkIGVxdWFsLCB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlXG4gICogdGhlIGFuZ2xlIHByb2R1Y2VkIHdpdGggYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBSYXlgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtkZWZhdWx0QW5nbGU9aW5zdGFuY2UuQW5nbGUuWmVyb10gLVxuICAqIEFuIGBBbmdsZWAgdG8gdXNlIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXlUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBkZWZhdWx0QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGB0aGlzYCBpbiBgcmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHByb2plY3RlZCBwb2ludCBpcyBlcXVhbCB0byBgdGhpc2AgdGhlIHByb2R1Y2VkIHJheSB3aWxsIGhhdmVcbiAgKiBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvIGByYXlgIGluIHRoZSBjbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIHByb2plY3QgYHRoaXNgIG9udG9cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgcmF5VG9Qcm9qZWN0aW9uSW5SYXkocmF5KSB7XG4gICAgY29uc3QgcHJvamVjdGVkID0gcmF5LnBvaW50UHJvamVjdGlvbih0aGlzKTtcbiAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gcmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgICByZXR1cm4gdGhpcy5yYXlUb1BvaW50KHByb2plY3RlZCwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB0aGF0IHN0YXJ0cyBhdCBgdGhpc2AgYW5kIGlzIHRhbmdlbnQgdG8gYGFyY2AsIHdoZW5cbiAgKiBubyB0YW5nZW50IGlzIHBvc3NpYmxlIHJldHVybnMgYG51bGxgLlxuICAqXG4gICogQGRlc2NyaXB0aW9uXG4gICogVGhlIG5ldyBgUmF5YCB3aWxsIGJlIGluIHRoZSBgY2xvY2t3aXNlYCBzaWRlIG9mIHRoZSByYXkgZm9ybWVkXG4gICogZnJvbSBgdGhpc2AgdG93YXJkcyBgYXJjLmNlbnRlcmAuIGBhcmNgIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZVxuICAqIGNpcmNsZS5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGlzIGluc2lkZSBgYXJjYCBubyB0YW5nZW50IHNlZ21lbnQgaXMgcG9zc2libGUgYW5kIGBudWxsYFxuICAqIGlzIHJldHVybmVkLlxuICAqXG4gICogQSBzcGVjaWFsIGNhc2UgaXMgY29uc2lkZXJlZCB3aGVuIGBhcmMucmFkaXVzYCBpcyBjb25zaWRlcmVkIHRvIGJlIGAwYFxuICAqIGFuZCBgdGhpc2AgaXMgZXF1YWwgdG8gYGFyYy5jZW50ZXJgLiBJbiB0aGlzIGNhc2UgdGhlIGFuZ2xlIGJldHdlZW5cbiAgKiBgdGhpc2AgYW5kIGBhcmMuY2VudGVyYCBpcyBhc3N1bWVkIHRvIGJlIHRoZSBpbnZlcnNlIG9mIGBhcmMuc3RhcnRgLFxuICAqIHRodXMgdGhlIG5ldyBgUmF5YCB3aWxsIGhhdmUgYW4gYW5nbGUgcGVycGVuZGljdWxhciB0b1xuICAqIGBhcmMuc3RhcnQuaW52ZXJzZSgpYCwgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBhcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHRvLCBjb25zaWRlcmVkXG4gICogYXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm4ge1JhYy5SYXk/fVxuICAqL1xuICByYXlUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgLy8gQSBkZWZhdWx0IGFuZ2xlIGlzIGdpdmVuIGZvciB0aGUgZWRnZSBjYXNlIG9mIGEgemVyby1yYWRpdXMgYXJjXG4gICAgbGV0IGh5cG90ZW51c2UgPSB0aGlzLnNlZ21lbnRUb1BvaW50KGFyYy5jZW50ZXIsIGFyYy5zdGFydC5pbnZlcnNlKCkpO1xuICAgIGxldCBvcHMgPSBhcmMucmFkaXVzO1xuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhoeXBvdGVudXNlLmxlbmd0aCwgYXJjLnJhZGl1cykpIHtcbiAgICAgIC8vIFBvaW50IGluIGFyY1xuICAgICAgY29uc3QgcGVycGVuZGljdWxhciA9IGh5cG90ZW51c2UucmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgcGVycGVuZGljdWxhcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhoeXBvdGVudXNlLmxlbmd0aCwgMCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBhbmdsZVNpbmUgPSBvcHMgLyBoeXBvdGVudXNlLmxlbmd0aDtcbiAgICBpZiAoYW5nbGVTaW5lID4gMSkge1xuICAgICAgLy8gUG9pbnQgaW5zaWRlIGFyY1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGFuZ2xlUmFkaWFucyA9IE1hdGguYXNpbihhbmdsZVNpbmUpO1xuICAgIGxldCBvcHNBbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgYW5nbGVSYWRpYW5zKTtcbiAgICBsZXQgc2hpZnRlZE9wc0FuZ2xlID0gaHlwb3RlbnVzZS5hbmdsZSgpLnNoaWZ0KG9wc0FuZ2xlLCBjbG9ja3dpc2UpO1xuXG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBzaGlmdGVkT3BzQW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhbmdsZWAgd2l0aCB0aGUgZ2l2ZW5cbiAgKiBgbGVuZ3RoYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHBvaW50IHRoZSBzZWdtZW50XG4gICogdG93YXJkc1xuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICBjb25zdCByYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHJheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sXG4gICogdGhlIG5ldyBgU2VnbWVudGAgd2lsbCB1c2UgdGhlIGFuZ2xlIHByb2R1Y2VkIHdpdGggYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBTZWdtZW50YCB0b3dhcmRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZGVmYXVsdEFuZ2xlPWluc3RhbmNlLkFuZ2xlLlplcm9dIC1cbiAgKiBBbiBgQW5nbGVgIHRvIHVzZSB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHNlZ21lbnRUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSk7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBkZWZhdWx0QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHJheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG8gdGhlIHByb2plY3Rpb24gb2YgYHRoaXNgIGluXG4gICogYHJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgZXF1YWwgdG8gYHRoaXNgLCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsXG4gICogaGF2ZSBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvIGByYXlgIGluIHRoZSBjbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIHByb2plY3QgYHRoaXNgIG9udG9cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0aW9uKHRoaXMpO1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KHByb2plY3RlZCwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgdGhhdCBzdGFydHMgYXQgYHRoaXNgIGFuZCBpcyB0YW5nZW50IHRvIGBhcmNgLFxuICAqIHdoZW4gbm8gdGFuZ2VudCBpcyBwb3NzaWJsZSByZXR1cm5zIGBudWxsYC5cbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgYmUgaW4gdGhlIGBjbG9ja3dpc2VgIHNpZGUgb2YgdGhlIHJheSBmb3JtZWRcbiAgKiBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhcmMuY2VudGVyYCwgYW5kIGl0cyBlbmQgcG9pbnQgd2lsbCBiZSBhdCB0aGVcbiAgKiBjb250YWN0IHBvaW50IHdpdGggYGFyY2Agd2hpY2ggaXMgY29uc2lkZXJlZCBhcyBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGlzIGluc2lkZSBgYXJjYCBubyB0YW5nZW50IHNlZ21lbnQgaXMgcG9zc2libGUgYW5kIGBudWxsYFxuICAqIGlzIHJldHVybmVkLlxuICAqXG4gICogQSBzcGVjaWFsIGNhc2UgaXMgY29uc2lkZXJlZCB3aGVuIGBhcmMucmFkaXVzYCBpcyBjb25zaWRlcmVkIHRvIGJlIGAwYFxuICAqIGFuZCBgdGhpc2AgaXMgZXF1YWwgdG8gYGFyYy5jZW50ZXJgLiBJbiB0aGlzIGNhc2UgdGhlIGFuZ2xlIGJldHdlZW5cbiAgKiBgdGhpc2AgYW5kIGBhcmMuY2VudGVyYCBpcyBhc3N1bWVkIHRvIGJlIHRoZSBpbnZlcnNlIG9mIGBhcmMuc3RhcnRgLFxuICAqIHRodXMgdGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG9cbiAgKiBgYXJjLnN0YXJ0LmludmVyc2UoKWAsIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gYXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCB0bywgY29uc2lkZXJlZFxuICAqIGFzIGEgY29tcGxldGUgY2lyY2xlXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybiB7UmFjLlNlZ21lbnQ/fVxuICAqL1xuICBzZWdtZW50VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHRhbmdlbnRSYXkgPSB0aGlzLnJheVRhbmdlbnRUb0FyYyhhcmMsIGNsb2Nrd2lzZSk7XG4gICAgaWYgKHRhbmdlbnRSYXkgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHRhbmdlbnRQZXJwID0gdGFuZ2VudFJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgcmFkaXVzUmF5ID0gYXJjLmNlbnRlci5yYXkodGFuZ2VudFBlcnApO1xuXG4gICAgcmV0dXJuIHRhbmdlbnRSYXkuc2VnbWVudFRvSW50ZXJzZWN0aW9uKHJhZGl1c1JheSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXNgIGFuZCB0aGUgZ2l2ZW4gYXJjIHByb3BlcnRpZXMuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbc29tZVN0YXJ0PXJhYy5BbmdsZS56ZXJvXSAtIFRoZSBzdGFydFxuICAqIGBBbmdsZWAgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxudW1iZXJ9IFtzb21lRW5kPW51bGxdIC0gVGhlIGVuZCBgQW5nbGVgIG9mIHRoZSBuZXdcbiAgKiBgQXJjYDsgd2hlbiBgbnVsbGAgb3Igb21taXRlZCwgYHN0YXJ0YCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge2Jvb2xlYW49fSBjbG9ja3dpc2U9dHJ1ZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhcbiAgICByYWRpdXMsXG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvLFxuICAgIGVuZCA9IG51bGwsXG4gICAgY2xvY2t3aXNlID0gdHJ1ZSlcbiAge1xuICAgIHN0YXJ0ID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzdGFydCk7XG4gICAgZW5kID0gZW5kID09PSBudWxsXG4gICAgICA/IHN0YXJ0XG4gICAgICA6IHRoaXMucmFjLkFuZ2xlLmZyb20oZW5kKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsIHRoaXMsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgd2l0aCB0aGUgZ2l2ZW4gYHN0cmluZ2AgYW5kIGBmb3JtYXRgLlxuICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IGZvcm1hdCAtIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMucmFjLCB0aGlzLCBzdHJpbmcsIGZvcm1hdCk7XG4gIH1cblxufSAvLyBjbGFzcyBQb2ludFxuXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBVbmJvdW5kZWQgcmF5IGZyb20gYSBgW1BvaW50XXtAbGluayBSYWMuUG9pbnR9YCBpbiBkaXJlY3Rpb24gb2YgYW5cbiogYFtBbmdsZV17QGxpbmsgUmFjLkFuZ2xlfWAuXG4qIEBhbGlhcyBSYWMuUmF5XG4qL1xuY2xhc3MgUmF5IHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBSYXlgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWMgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0IC0gQSBgUG9pbnRgIHdoZXJlIHRoZSByYXkgc3RhcnRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0aGUgcmF5IGlzIGRpcmVjdGVkIHRvXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgc3RhcnQsIGFuZ2xlKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc3RhcnQsIGFuZ2xlKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgc3RhcnQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBhbmdsZSk7XG5cbiAgICAvKipcbiAgICAqIEludGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBzdGFydCBwb2ludCBvZiB0aGUgcmF5LlxuICAgICogQHR5cGUge1JhYy5Qb2ludH1cbiAgICAqL1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcblxuICAgIC8qKlxuICAgICogVGhlIGFuZ2xlIHRvd2FyZHMgd2hpY2ggdGhlIHJheSBleHRlbmRzLlxuICAgICogQHR5cGUge1JhYy5Qb2ludH1cbiAgICAqL1xuICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueSwgZGlnaXRzKTtcbiAgICBjb25zdCB0dXJuU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuYW5nbGUudHVybiwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFJheSgoJHt4U3RyfSwke3lTdHJ9KSBhOiR7dHVyblN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBgc3RhcnRgIGFuZCBgYW5nbGVgIGluIGJvdGggcmF5cyBhcmUgZXF1YWwuXG4gICpcbiAgKiBXaGVuIGBvdGhlclJheWAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5SYXlgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlclJheSkge1xuICAgIHJldHVybiBvdGhlclJheSBpbnN0YW5jZW9mIFJheVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXJSYXkuc3RhcnQpXG4gICAgICAmJiB0aGlzLmFuZ2xlLmVxdWFscyhvdGhlclJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNsb3BlIG9mIHRoZSByYXksIG9yIGBudWxsYCBpZiB0aGUgcmF5IGlzIHZlcnRpY2FsLlxuICAqXG4gICogSW4gdGhlIGxpbmUgZm9ybXVsYSBgeSA9IG14ICsgYmAgdGhlIHNsb3BlIGlzIGBtYC5cbiAgKlxuICAqIEByZXR1cm5zIHs/bnVtYmVyfVxuICAqL1xuICBzbG9wZSgpIHtcbiAgICBsZXQgaXNWZXJ0aWNhbCA9XG4gICAgICAgICB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYW5nbGUudHVybiwgdGhpcy5yYWMuQW5nbGUuZG93bi50dXJuKVxuICAgICAgfHwgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmFuZ2xlLnR1cm4sIHRoaXMucmFjLkFuZ2xlLnVwLnR1cm4pO1xuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC50YW4odGhpcy5hbmdsZS5yYWRpYW5zKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB5LWludGVyY2VwdDogdGhlIHBvaW50IGF0IHdoaWNoIHRoZSByYXksIGV4dGVuZGVkIGluIGJvdGhcbiAgKiBkaXJlY3Rpb25zLCBpbnRlcmNlcHRzIHdpdGggdGhlIHktYXhpczsgb3IgYG51bGxgIGlmIHRoZSByYXkgaXNcbiAgKiB2ZXJ0aWNhbC5cbiAgKlxuICAqIEluIHRoZSBsaW5lIGZvcm11bGEgYHkgPSBteCArIGJgIHRoZSB5LWludGVyY2VwdCBpcyBgYmAuXG4gICpcbiAgKiBAcmV0dXJucyB7P251bWJlcn1cbiAgKi9cbiAgeUludGVyY2VwdCgpIHtcbiAgICBsZXQgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8geSA9IG14ICsgYlxuICAgIC8vIHkgLSBteCA9IGJcbiAgICByZXR1cm4gdGhpcy5zdGFydC55IC0gc2xvcGUgKiB0aGlzLnN0YXJ0Lng7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydCAtIFRoZSBzdGFydCBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoU3RhcnQobmV3U3RhcnQpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0LnhgIHNldCB0byBgbmV3WGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld1ggLSBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhYKG5ld1gpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydC53aXRoWChuZXdYKSwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnQueWAgc2V0IHRvIGBuZXdZYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WSAtIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LndpdGhZKG5ld1kpLCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvIGBuZXdBbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20obmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIGFkZGVkIHRvIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGVBZGQoYW5nbGUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLmFkZChhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHRoaXMue0BsaW5rIFJhYy5BbmdsZSNzaGlmdCBhbmdsZS5zaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkc1xuICAqIGB7QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2UgYW5nbGUuaW52ZXJzZSgpfWAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgY29uc3QgaW52ZXJzZUFuZ2xlID0gdGhpcy5hbmdsZS5pbnZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIGludmVyc2VBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkcyB0aGVcbiAgKiBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9IG9mXG4gICogYGFuZ2xlYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyXG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCBhbG9uZyB0aGUgcmF5IGJ5IHRoZSBnaXZlblxuICAqIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW5cbiAgKiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlVG9EaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieSB0aGUgZ2l2ZW5cbiAgKiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIGJ5IHRoZSBnaXZlbiBkaXN0YW5jZSB0b3dhcmQgdGhlXG4gICogYGFuZ2xlLnBlcnBlbmRpY3VsYXIoKWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVRvQW5nbGUocGVycGVuZGljdWxhciwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhbmdsZSBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCByZXR1cm5zIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBhbmdsZSB0b1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSByYXkgd2hlcmUgdGhlIHggY29vcmRpbmF0ZSBpcyBgeGAuXG4gICogV2hlbiB0aGUgcmF5IGlzIHZlcnRpY2FsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBzaW5nbGUgcG9pbnQgd2l0aCB4XG4gICogY29vcmRpbmF0ZSBhdCBgeGAgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYSB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSB0byBjYWxjdWxhdGUgYSBwb2ludCBpbiB0aGUgcmF5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdFgoeCkge1xuICAgIGNvbnN0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVmVydGljYWwgcmF5XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhzbG9wZSwgMCkpIHtcbiAgICAgIC8vIEhvcml6b250YWwgcmF5XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC53aXRoWCh4KTtcbiAgICB9XG5cbiAgICAvLyB5ID0gbXggKyBiXG4gICAgY29uc3QgeSA9IHNsb3BlICogeCArIHRoaXMueUludGVyY2VwdCgpO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIHJheSB3aGVyZSB0aGUgeSBjb29yZGluYXRlIGlzIGB5YC5cbiAgKiBXaGVuIHRoZSByYXkgaXMgaG9yaXpvbnRhbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gc2luZ2xlIHBvaW50IHdpdGggeVxuICAqIGNvb3JkaW5hdGUgYXQgYHlgIGlzIHBvc3NpYmxlLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGFuIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGNhbGN1bGF0ZSBhIHBvaW50IGluIHRoZSByYXlcbiAgKiBAcmV0dXJzbiB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0WSh5KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhZKHkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIG14ICsgYiA9IHlcbiAgICAvLyB4ID0gKHkgLSBiKS9tXG4gICAgY29uc3QgeCA9ICh5IC0gdGhpcy55SW50ZXJjZXB0KCkpIC8gc2xvcGU7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgaW4gdGhlIHJheSBhdCB0aGUgZ2l2ZW4gYGRpc3RhbmNlYCBmcm9tXG4gICogYHRoaXMuc3RhcnRgLiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkXG4gICogaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBCb3RoIHJheXMgYXJlIGNvbnNpZGVyZWQgdW5ib3VuZGVkIGxpbmVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBvdGhlclJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBhID0gdGhpcy5zbG9wZSgpO1xuICAgIGNvbnN0IGIgPSBvdGhlclJheS5zbG9wZSgpO1xuICAgIC8vIFBhcmFsbGVsIGxpbmVzLCBubyBpbnRlcnNlY3Rpb25cbiAgICBpZiAoYSA9PT0gbnVsbCAmJiBiID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoYSwgYikpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIC8vIEFueSB2ZXJ0aWNhbCByYXlcbiAgICBpZiAoYSA9PT0gbnVsbCkgeyByZXR1cm4gb3RoZXJSYXkucG9pbnRBdFgodGhpcy5zdGFydC54KTsgfVxuICAgIGlmIChiID09PSBudWxsKSB7IHJldHVybiB0aGlzLnBvaW50QXRYKG90aGVyUmF5LnN0YXJ0LngpOyB9XG5cbiAgICBjb25zdCBjID0gdGhpcy55SW50ZXJjZXB0KCk7XG4gICAgY29uc3QgZCA9IG90aGVyUmF5LnlJbnRlcmNlcHQoKTtcblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpbmUlRTIlODAlOTNsaW5lX2ludGVyc2VjdGlvblxuICAgIGNvbnN0IHggPSAoZCAtIGMpIC8gKGEgLSBiKTtcbiAgICBjb25zdCB5ID0gYSAqIHggKyBjO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgb250byB0aGUgcmF5LiBUaGVcbiAgKiBwcm9qZWN0ZWQgcG9pbnQgaXMgdGhlIGNsb3Nlc3QgcG9zc2libGUgcG9pbnQgdG8gYHBvaW50YC5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhbiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwcm9qZWN0IG9udG8gdGhlIHJheVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50UHJvamVjdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgICByZXR1cm4gcG9pbnQucmF5KHBlcnBlbmRpY3VsYXIpXG4gICAgICAucG9pbnRBdEludGVyc2VjdGlvbih0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG8gdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YFxuICAqIG9udG8gdGhlIHJheS5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBkaXN0YW5jZSBpcyBwb3NpdGl2ZSB3aGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgdG93YXJkc1xuICAqIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJheSwgYW5kIG5lZ2F0aXZlIHdoZW4gaXQgaXMgYmVoaW5kLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHByb2plY3QgYW5kIG1lYXN1cmUgdGhlXG4gICogZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBkaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSB0aGlzLnBvaW50UHJvamVjdGlvbihwb2ludCk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlVG9Qb2ludChwcm9qZWN0ZWQpO1xuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgMCkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlVG9Qcm9qZWN0ZWQgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwcm9qZWN0ZWQpO1xuICAgIGNvbnN0IGFuZ2xlRGlmZiA9IHRoaXMuYW5nbGUuc3VidHJhY3QoYW5nbGVUb1Byb2plY3RlZCk7XG4gICAgaWYgKGFuZ2xlRGlmZi50dXJuIDw9IDEvNCB8fCBhbmdsZURpZmYudHVybiA+IDMvNCkge1xuICAgICAgcmV0dXJuIGRpc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLWRpc3RhbmNlO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgYW5nbGUgdG8gdGhlIGdpdmVuIGBwb2ludGAgaXMgbG9jYXRlZCBjbG9ja3dpc2VcbiAgKiBvZiB0aGUgcmF5IG9yIGBmYWxzZWAgd2hlbiBsb2NhdGVkIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gb3IgYHBvaW50YCBsYW5kcyBvbiB0aGUgcmF5LCBpdCBpc1xuICAqIGNvbnNpZGVyZWQgY2xvY2t3aXNlLiBXaGVuIGBwb2ludGAgbGFuZHMgb24gdGhlXG4gICogW2ludmVyc2Vde0BsaW5rIFJhYy5SYXkjaW52ZXJzZX0gb2YgdGhlIHJheSwgaXQgaXMgY29uc2lkZXJlZFxuICAqIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIG9yaWVudGF0aW9uIHRvXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuUmF5I2ludmVyc2VcbiAgKi9cbiAgcG9pbnRPcmllbnRhdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBvaW50QW5nbGUgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gICAgaWYgKHRoaXMuYW5nbGUuZXF1YWxzKHBvaW50QW5nbGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gcG9pbnRBbmdsZS5zdWJ0cmFjdCh0aGlzLmFuZ2xlKTtcbiAgICAvLyBbMCB0byAwLjUpIGlzIGNvbnNpZGVyZWQgY2xvY2t3aXNlXG4gICAgLy8gWzAuNSwgMSkgaXMgY29uc2lkZXJlZCBjb3VudGVyLWNsb2Nrd2lzZVxuICAgIHJldHVybiBhbmdsZURpc3RhbmNlLnR1cm4gPCAwLjU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpcy5zdGFydGAgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuc3RhcnRgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgUmF5YCB3aWxsIHVzZSBgdGhpcy5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBSYXlgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgcmF5VG9Qb2ludChwb2ludCkge1xuICAgIGxldCBuZXdBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB1c2luZyBgdGhpc2AgYW5kIHRoZSBnaXZlbiBgbGVuZ3RoYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudChsZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFNlZ21lbnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHNlZ21lbnRUb1BvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuc2VnbWVudFRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBhdCBgdGhpcy5zdGFydGAgYW5kIGVuZGluZyBhdCB0aGVcbiAgKiBpbnRlcnNlY3Rpb24gb2YgYHRoaXNgIGFuZCBgb3RoZXJSYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcmF5cyBhcmUgcGFyYWxsZWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIGludGVyc2VjdGlvbiBpc1xuICAqIHBvc3NpYmxlLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEJvdGggcmF5cyBhcmUgY29uc2lkZXJlZCB1bmJvdW5kZWQgbGluZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VG9JbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBpbnRlcnNlY3Rpb24gPSB0aGlzLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpO1xuICAgIGlmIChpbnRlcnNlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZWdtZW50VG9Qb2ludChpbnRlcnNlY3Rpb24pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgXG4gICogYW5kIHRoZSBnaXZlbiBhcmMgcHJvcGVydGllcy5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV8bnVtYmVyfSBbZW5kQW5nbGU9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqIGBBcmNgOyB3aGVuIGBudWxsYCBvciBvbW1pdGVkLCBgdGhpcy5hbmdsZWAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtib29sZWFuPX0gY2xvY2t3aXNlPXRydWUgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmMocmFkaXVzLCBlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMuYW5nbGVcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgLFxuICAqIGFuZCBlbmQgYXQgdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLnN0YXJ0YCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2UgZnJvbVxuICAqIGB0aGlzLnN0YXJ0YCB0byB0aGUgbmV3IGBBcmNgIGVuZFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyY1RvQW5nbGVEaXN0YW5jZShyYWRpdXMsIGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgZW5kQW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmF5XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYXk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBTZWdtZW50IG9mIGEgYFtSYXlde0BsaW5rIFJhYy5SYXl9YCB1cCB0byBhIGdpdmVuIGxlbmd0aC5cbiogQGFsaWFzIFJhYy5TZWdtZW50XG4qL1xuY2xhc3MgU2VnbWVudCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgU2VnbWVudGAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0aGUgc2VnbWVudCB3aWxsIGJlIGJhc2VkIG9mXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnRcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCByYXksIGxlbmd0aCkge1xuICAgIC8vIFRPRE86IGRpZmZlcmVudCBhcHByb2FjaCB0byBlcnJvciB0aHJvd2luZz9cbiAgICAvLyBhc3NlcnQgfHwgdGhyb3cgbmV3IEVycm9yKGVyci5taXNzaW5nUGFyYW1ldGVycylcbiAgICAvLyBvclxuICAgIC8vIGNoZWNrZXIobXNnID0+IHsgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQobXNnKSk7XG4gICAgLy8gICAuZXhpc3RzKHJhYylcbiAgICAvLyAgIC5pc1R5cGUoUmFjLlJheSwgcmF5KVxuICAgIC8vICAgLmlzTnVtYmVyKGxlbmd0aClcblxuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHJheSwgbGVuZ3RoKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5SYXksIHJheSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKGxlbmd0aCk7XG5cbiAgICAvKipcbiAgICAqIEludGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBgUmF5YCB0aGUgc2VnbWVudCBpcyBiYXNlZCBvZi5cbiAgICAqIEB0eXBlIHtSYWMuUmF5fVxuICAgICovXG4gICAgdGhpcy5yYXkgPSByYXk7XG5cbiAgICAvKipcbiAgICAqIFRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnQuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5zdGFydC54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuc3RhcnQueSwgZGlnaXRzKTtcbiAgICBjb25zdCB0dXJuU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LmFuZ2xlLnR1cm4sIGRpZ2l0cyk7XG4gICAgY29uc3QgbGVuZ3RoU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMubGVuZ3RoLCBkaWdpdHMpO1xuICAgIHJldHVybiBgU2VnbWVudCgoJHt4U3RyfSwke3lTdHJ9KSBhOiR7dHVyblN0cn0gbDoke2xlbmd0aFN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBgcmF5YCBhbmQgYGxlbmd0aGAgaW4gYm90aCBzZWdtZW50cyBhcmUgZXF1YWwuXG4gICpcbiAgKiBXaGVuIGBvdGhlclNlZ21lbnRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuU2VnbWVudGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFNlZ21lbnRzJyBgbGVuZ3RoYCBhcmUgY29tcGFyZWQgdXNpbmcgYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBvdGhlclNlZ21lbnQgLSBBIGBTZWdtZW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuUmF5I2VxdWFsc1xuICAqIEBzZWUgUmFjI2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJTZWdtZW50KSB7XG4gICAgcmV0dXJuIG90aGVyU2VnbWVudCBpbnN0YW5jZW9mIFNlZ21lbnRcbiAgICAgICYmIHRoaXMucmF5LmVxdWFscyhvdGhlclNlZ21lbnQucmF5KVxuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMubGVuZ3RoLCBvdGhlclNlZ21lbnQubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYFthbmdsZV17QGxpbmsgUmFjLlJheSNhbmdsZX1gIG9mIHRoZSBzZWdtZW50J3MgYHJheWAuXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgYW5nbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LmFuZ2xlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBgW3N0YXJ0XXtAbGluayBSYWMuUmF5I3N0YXJ0fWAgb2YgdGhlIHNlZ21lbnQncyBgcmF5YC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdGFydFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnJheS5zdGFydDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdoZXJlIHRoZSBzZWdtZW50IGVuZHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgZW5kUG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYW5nbGUgc2V0IHRvIGBuZXdBbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIG5ld0FuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0FuZ2xlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5yYXkuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGByYXlgIHNldCB0byBgbmV3UmF5YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG5ld1JheSAtIFRoZSByYXkgZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoUmF5KG5ld1JheSkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggc3RhcnQgcG9pbnQgc2V0IHRvIGBuZXdTdGFydGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld1N0YXJ0UG9pbnQgLSBUaGUgc3RhcnQgcG9pbnQgZm9yIHRoZSBuZXdcbiAgKiBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhTdGFydFBvaW50KG5ld1N0YXJ0UG9pbnQpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoU3RhcnQobmV3U3RhcnRQb2ludCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgbGVuZ3RoYCBzZXQgdG8gYG5ld0xlbmd0aGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld0xlbmd0aCAtIFRoZSBsZW5ndGggZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoKG5ld0xlbmd0aCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgYWRkZWQgdG8gYHRoaXMubGVuZ3RoYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhMZW5ndGhBZGQobGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgdGhpcy5sZW5ndGggKyBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBsZW5ndGhgIHNldCB0byBgdGhpcy5sZW5ndGggKiByYXRpb2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoYCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aFJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgdGhpcy5sZW5ndGggKiByYXRpbyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGFuZ2xlYCBhZGRlZCB0byBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEFuZ2xlQWRkKGFuZ2xlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aEFuZ2xlQWRkKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHRoaXMucmF5LntAbGluayBSYWMuQW5nbGUjc2hpZnQgYW5nbGUuc2hpZnR9KGFuZ2xlLCBjbG9ja3dpc2UpYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGJlIHNoaWZ0ZWQgYnlcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGVTaGlmdChhbmdsZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIGluIHRoZSBpbnZlcnNlXG4gICogZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5IGJ5IHRoZSBnaXZlbiBgZGlzdGFuY2VgLiBUaGUgcmVzdWx0aW5nXG4gICogYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgc2FtZSBgZW5kUG9pbnQoKWAgYW5kIGBhbmdsZSgpYCBhcyBgdGhpc2AuXG4gICpcbiAgKiBVc2luZyBhIHBvc2l0aXZlIGBkaXN0YW5jZWAgcmVzdWx0cyBpbiBhIGxvbmdlciBzZWdtZW50LCB1c2luZyBhXG4gICogbmVnYXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgc2hvcnRlciBvbmUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhTdGFydEV4dGVuZGVkKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9EaXN0YW5jZSgtZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCArIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcG9pbnRpbmcgdG93YXJkcyB0aGVcbiAgKiBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9IG9mXG4gICogYHRoaXMuYW5nbGUoKWAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBzYW1lIGBzdGFydFBvaW50KClgIGFuZCBgbGVuZ3RoYFxuICAqIGFzIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyXG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGl0cyBzdGFydCBwb2ludCBzZXQgYXRcbiAgKiBgW3RoaXMuZW5kUG9pbnQoKV17QGxpbmsgUmFjLlNlZ21lbnQjZW5kUG9pbnR9YCxcbiAgKiBhbmdsZSBzZXQgdG8gYHRoaXMuYW5nbGUoKS5baW52ZXJzZSgpXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1gLCBhbmRcbiAgKiBzYW1lIGxlbmd0aCBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjaW52ZXJzZVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBpbnZlcnNlUmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIGVuZCwgdGhpcy5yYXkuYW5nbGUuaW52ZXJzZSgpKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIGludmVyc2VSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgdG93YXJkcyBgYW5nbGVgIGJ5XG4gICogdGhlIGdpdmVuIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBtb3ZlIHRoZSBzdGFydCBwb2ludFxuICAgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIGFsb25nIHRoZSBzZWdtZW50J3NcbiAgKiByYXkgYnkgdGhlIGdpdmVuIGBsZW5ndGhgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgbGVuZ3RoYCBpcyBuZWdhdGl2ZSwgYHN0YXJ0YCBpcyBtb3ZlZCBpbiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2ZcbiAgKiBgYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVRvTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvRGlzdGFuY2UobGVuZ3RoKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCB0aGUgZ2l2ZW4gYGRpc3RhbmNlYFxuICAqIHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgYW5nbGUgdG8gYHRoaXMuYW5nbGUoKWAgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRvbi4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBzdGFydCBwb2ludCBieVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgdHJhbnNsYXRlUGVycGVuZGljdWxhcihkaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZ2l2ZW4gYHZhbHVlYCBjbGFtcGVkIHRvIFtzdGFydEluc2V0LCBsZW5ndGgtZW5kSW5zZXRdLlxuICAqXG4gICogV2hlbiBgc3RhcnRJbnNldGAgaXMgZ3JlYXRlciB0aGF0IGBsZW5ndGgtZW5kSW5zZXRgIHRoZSByYW5nZSBmb3IgdGhlXG4gICogY2xhbXAgYmVjb21lcyBpbXBvc2libGUgdG8gZnVsZmlsbC4gSW4gdGhpcyBjYXNlIHRoZSByZXR1cm5lZCB2YWx1ZVxuICAqIHdpbGwgYmUgdGhlIGNlbnRlcmVkIGJldHdlZW4gdGhlIHJhbmdlIGxpbWl0cyBhbmQgc3RpbGwgY2xhbXBsZWQgdG9cbiAgKiBgWzAsIGxlbmd0aF1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gQSB2YWx1ZSB0byBjbGFtcFxuICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnRJbnNldD0wXSAtIFRoZSBpbnNldCBmb3IgdGhlIGxvd2VyIGxpbWl0IG9mIHRoZVxuICAqIGNsYW1waW5nIHJhbmdlXG4gICogQHBhcmFtIHtlbmRJbnNldH0gW2VuZEluc2V0PTBdIC0gVGhlIGluc2V0IGZvciB0aGUgaGlnaGVyIGxpbWl0IG9mIHRoZVxuICAqIGNsYW1waW5nIHJhbmdlXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgY2xhbXBUb0xlbmd0aCh2YWx1ZSwgc3RhcnRJbnNldCA9IDAsIGVuZEluc2V0ID0gMCkge1xuICAgIGNvbnN0IGVuZExpbWl0ID0gdGhpcy5sZW5ndGggLSBlbmRJbnNldDtcbiAgICBpZiAoc3RhcnRJbnNldCA+PSBlbmRMaW1pdCkge1xuICAgICAgLy8gaW1wb3NpYmxlIHJhbmdlLCByZXR1cm4gbWlkZGxlIHBvaW50XG4gICAgICBjb25zdCByYW5nZU1pZGRsZSA9IChzdGFydEluc2V0IC0gZW5kTGltaXQpIC8gMjtcbiAgICAgIGNvbnN0IG1pZGRsZSA9IHN0YXJ0SW5zZXQgLSByYW5nZU1pZGRsZTtcbiAgICAgIC8vIFN0aWxsIGNsYW1wIHRvIHRoZSBzZWdtZW50IGl0c2VsZlxuICAgICAgbGV0IGNsYW1wZWQgPSBtaWRkbGU7XG4gICAgICBjbGFtcGVkID0gTWF0aC5taW4oY2xhbXBlZCwgdGhpcy5sZW5ndGgpO1xuICAgICAgY2xhbXBlZCA9IE1hdGgubWF4KGNsYW1wZWQsIDApO1xuICAgICAgcmV0dXJuIGNsYW1wZWQ7XG4gICAgfVxuICAgIGxldCBjbGFtcGVkID0gdmFsdWU7XG4gICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQpO1xuICAgIGNsYW1wZWQgPSBNYXRoLm1heChjbGFtcGVkLCBzdGFydEluc2V0KTtcbiAgICByZXR1cm4gY2xhbXBlZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGluIHRoZSBzZWdtZW50J3MgcmF5IGF0IHRoZSBnaXZlbiBgbGVuZ3RoYCBmcm9tXG4gICogYHRoaXMuc3RhcnRQb2ludCgpYC4gV2hlbiBgbGVuZ3RoYCBpcyBuZWdhdGl2ZSwgdGhlIG5ldyBgUG9pbnRgIGlzXG4gICogY2FsY3VsYXRlZCBpbiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGRpc3RhbmNlIGZyb20gYHRoaXMuc3RhcnRQb2ludCgpYFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICogQHNlZSBSYWMuUmF5I3BvaW50QXREaXN0YW5jZVxuICAqL1xuICBwb2ludEF0TGVuZ3RoKGxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UobGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGluIHRoZSBzZWdtZW50J3MgcmF5IGF0IGEgZGlzdGFuY2Ugb2ZcbiAgKiBgdGhpcy5sZW5ndGggKiByYXRpb2AgZnJvbSBgdGhpcy5zdGFydFBvaW50KClgLiBXaGVuIGByYXRpb2AgaXNcbiAgKiBuZWdhdGl2ZSwgdGhlIG5ldyBgUG9pbnRgIGlzIGNhbGN1bGF0ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGhgIGJ5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKiBAc2VlIFJhYy5SYXkjcG9pbnRBdERpc3RhbmNlXG4gICovXG4gIHBvaW50QXRMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGggKiByYXRpbyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCB0aGUgbWlkZGxlIHBvaW50IHRoZSBzZWdtZW50LlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRCaXNlY3RvcigpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoLzIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBhdCBgbmV3U3RhcnRQb2ludGAgYW5kIGVuZGluZyBhdFxuICAqIGB0aGlzLmVuZFBvaW50KClgLlxuICAqXG4gICogV2hlbiBgbmV3U3RhcnRQb2ludGAgYW5kIGB0aGlzLmVuZFBvaW50KClgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgU2VnbWVudGAgd2lsbCB1c2VcbiAgKiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydFBvaW50IC0gVGhlIHN0YXJ0IHBvaW50IG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBtb3ZlU3RhcnRQb2ludChuZXdTdGFydFBvaW50KSB7XG4gICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgcmV0dXJuIG5ld1N0YXJ0UG9pbnQuc2VnbWVudFRvUG9pbnQoZW5kUG9pbnQsIHRoaXMucmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgYXQgYHRoaXMuc3RhcnRQb2ludCgpYCBhbmQgZW5kaW5nIGF0XG4gICogYG5ld0VuZFBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuc3RhcnRQb2ludCgpYCBhbmQgYG5ld0VuZFBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3RW5kUG9pbnQgLSBUaGUgZW5kIHBvaW50IG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBtb3ZlRW5kUG9pbnQobmV3RW5kUG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc2VnbWVudFRvUG9pbnQobmV3RW5kUG9pbnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIHRoZSBzdGFydGluZyBwb2ludCB0byB0aGUgc2VnbWVudCdzIG1pZGRsZVxuICAqIHBvaW50LlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlNlZ21lbnQjcG9pbnRBdEJpc2VjdG9yXG4gICovXG4gIHNlZ21lbnRUb0Jpc2VjdG9yKCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoLzIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIHRoZSBzZWdtZW50J3MgbWlkZGxlIHBvaW50IHRvd2FyZHMgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogQHBhcmFtIHs/bnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuU2VnbWVudCNwb2ludEF0QmlzZWN0b3JcbiAgKiBAc2VlIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyXG4gICovXG4gIHNlZ21lbnRCaXNlY3RvcihsZW5ndGggPSBudWxsLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnBvaW50QXRCaXNlY3RvcigpO1xuICAgIGNvbnN0IG5ld0FuZ2xlID0gdGhpcy5yYXkuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgbmV3QW5nbGUpO1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbFxuICAgICAgPyB0aGlzLmxlbmd0aFxuICAgICAgOiBsZW5ndGg7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIHdpdGggdGhlIGdpdmVuXG4gICogYGxlbmd0aGAgYW5kIHRoZSBzYW1lIGFuZ2xlIGFzIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXh0IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRXaXRoTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhTdGFydChuZXdTdGFydCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIGFuZCB1cCB0byB0aGUgZ2l2ZW5cbiAgKiBgbmV4dEVuZFBvaW50YC5cbiAgKlxuICAqIFdoZW4gYGVuZFBvaW50KClgIGFuZCBgbmV4dEVuZFBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV4dEVuZFBvaW50IC0gVGhlIGVuZCBwb2ludCBvZiB0aGUgbmV4dCBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIG5leHRTZWdtZW50VG9Qb2ludChuZXh0RW5kUG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICByZXR1cm4gbmV3U3RhcnQuc2VnbWVudFRvUG9pbnQobmV4dEVuZFBvaW50LCB0aGlzLnJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIHRvd2FyZHMgYGFuZ2xlYFxuICAqIHdpdGggdGhlIGdpdmVuIGBsZW5ndGhgLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcGFyYW0gez9udW1iZXJ9IFtsZW5ndGg9bnVsbF0gLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgLCBvclxuICAqIGBudWxsYCB0byB1c2UgYHRoaXMubGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggPSBudWxsKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbFxuICAgICAgPyB0aGlzLmxlbmd0aFxuICAgICAgOiBsZW5ndGg7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIHRvd2FyZHMgdGhlIGdpdmVuXG4gICogYGFuZ2xlRGlzdGFuY2VgIGZyb20gYHRoaXMuYW5nbGUoKS5pbnZlcnNlKClgIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoZSBgYW5nbGVEaXN0YW5jZWAgaXMgYXBwbGllZCB0byB0aGUgaW52ZXJzZSBvZiB0aGVcbiAgKiBzZWdtZW50J3MgYW5nbGUuIEUuZy4gd2l0aCBhbiBgYW5nbGVEaXN0YW5jZWAgb2YgYDBgIHRoZSByZXN1bHRpbmdcbiAgKiBgU2VnbWVudGAgd2lsbCBiZSBkaXJlY3RseSBvdmVyIGFuZCBwb2ludGluZyBpbiB0aGUgaW52ZXJzZSBhbmdsZSBvZlxuICAqIGB0aGlzYC4gQXMgdGhlIGBhbmdsZURpc3RhbmNlYCBpbmNyZWFzZXMgdGhlIHR3byBzZWdtZW50cyBzZXBhcmF0ZSB3aXRoXG4gICogdGhlIHBpdm90IGF0IGBlbmRQb2ludCgpYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIEFuIGFuZ2xlIGRpc3RhbmNlIHRvIGFwcGx5IHRvXG4gICogdGhlIHNlZ21lbnQncyBhbmdsZSBpbnZlcnNlXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhbmdsZSBzaGlmdFxuICAqIGZyb20gYGVuZFBvaW50KClgXG4gICogQHBhcmFtIHs/bnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjaW52ZXJzZVxuICAqL1xuICBuZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlLCBsZW5ndGggPSBudWxsKSB7XG4gICAgYW5nbGVEaXN0YW5jZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGVEaXN0YW5jZSk7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsID8gdGhpcy5sZW5ndGggOiBsZW5ndGg7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHRoaXMubGVuZ3RoKVxuICAgICAgLmludmVyc2UoKVxuICAgICAgLndpdGhBbmdsZVNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIHRvd2FyZHMgdGhlXG4gICogYFtwZXJwZW5kaWN1bGFyIGFuZ2xlXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1gIG9mXG4gICogYHRoaXMuYW5nbGUoKS5pbnZlcnNlKClgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBOb3RpY2UgdGhhdCB0aGUgcGVycGVuZGljdWxhciBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIGludmVyc2Ugb2YgdGhlXG4gICogc2VnbWVudCdzIGFuZ2xlLiBFLmcuIHdpdGggYGNsb2Nrd2lzZWAgYXMgYHRydWVgLCB0aGUgcmVzdWx0aW5nXG4gICogYFNlZ21lbnRgIHdpbGwgYmUgcG9pbnRpbmcgdG93YXJkcyBgdGhpcy5hbmdsZSgpLnBlcnBlbmRpY3VsYXIoZmFsc2UpYC5cbiAgKlxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGVcbiAgKiBwZXJwZW5kaWN1bGFyIGFuZ2xlIGZyb20gYGVuZFBvaW50KClgXG4gICogQHBhcmFtIHs/bnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBuZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbFxuICAgICAgPyB0aGlzLmxlbmd0aFxuICAgICAgOiBsZW5ndGg7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHRoaXMubGVuZ3RoKVxuICAgICAgLnBlcnBlbmRpY3VsYXIoIWNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIHdoaWNoIGNvcnJlc3BvbmRzXG4gICogdG8gdGhlIGxlZyBvZiBhIHJpZ2h0IHRyaWFuZ2xlIHdoZXJlIGB0aGlzYCBpcyB0aGUgb3RoZXIgY2F0aGV0dXMgYW5kXG4gICogdGhlIGh5cG90ZW51c2UgaXMgb2YgbGVuZ3RoIGBoeXBvdGVudXNlYC5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgcG9pbnQgdG93YXJkcyB0aGUgcGVycGVuZGljdWxhciBhbmdsZSBvZlxuICAqIGBbdGhpcy5hbmdsZSgpLltpbnZlcnNlKClde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfWAgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBXaGVuIGBoeXBvdGVudXNlYCBpcyBzbWFsbGVyIHRoYXQgdGhlIHNlZ21lbnQncyBgbGVuZ3RoYCwgcmV0dXJuc1xuICAqIGBudWxsYCBzaW5jZSBubyByaWdodCB0cmlhbmdsZSBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBoeXBvdGVudXNlIC0gVGhlIGxlbmd0aCBvZiB0aGUgaHlwb3RlbnVzZSBzaWRlIG9mIHRoZVxuICAqIHJpZ2h0IHRyaWFuZ2xlIGZvcm1lZCB3aXRoIGB0aGlzYCBhbmQgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5BbmdsZSNpbnZlcnNlXG4gICovXG4gIG5leHRTZWdtZW50TGVnV2l0aEh5cChoeXBvdGVudXNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgaWYgKGh5cG90ZW51c2UgPCB0aGlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gY29zID0gYWR5IC8gaHlwXG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYWNvcyh0aGlzLmxlbmd0aCAvIGh5cG90ZW51c2UpO1xuICAgIC8vIHRhbiA9IG9wcyAvIGFkalxuICAgIC8vIHRhbiAqIGFkaiA9IG9wc1xuICAgIGNvbnN0IG9wcyA9IE1hdGgudGFuKHJhZGlhbnMpICogdGhpcy5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSwgb3BzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCBiYXNlZCBvbiB0aGlzIHNlZ21lbnQsIHdpdGggdGhlIGdpdmVuIGBlbmRBbmdsZWBcbiAgKiBhbmQgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYEFyY2Agd2lsbCB1c2UgdGhpcyBzZWdtZW50J3Mgc3RhcnQgYXMgYGNlbnRlcmAsIGl0cyBhbmdsZVxuICAqIGFzIGBzdGFydGAsIGFuZCBpdHMgbGVuZ3RoIGFzIGByYWRpdXNgLlxuICAqXG4gICogV2hlbiBgZW5kQW5nbGVgIGlzIG9tbWl0ZWQgb3IgYG51bGxgLCB0aGUgc2VnbWVudCdzIGFuZ2xlIGlzIHVzZWRcbiAgKiBpbnN0ZWFkIHJlc3VsdGluZyBpbiBhIGNvbXBsZXRlLWNpcmNsZSBhcmMuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV9IFtlbmRBbmdsZT1udWxsXSAtIEFuIGBBbmdsZWAgdG8gdXNlIGFzIGVuZCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLCBvciBgbnVsbGAgdG8gdXNlIGB0aGlzLmFuZ2xlKClgXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKGVuZEFuZ2xlID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGVuZEFuZ2xlID0gZW5kQW5nbGUgPT09IG51bGxcbiAgICAgID8gdGhpcy5yYXkuYW5nbGVcbiAgICAgIDogUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGVuZEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnJheS5zdGFydCwgdGhpcy5sZW5ndGgsXG4gICAgICB0aGlzLnJheS5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIGJhc2VkIG9uIHRoaXMgc2VnbWVudCwgd2l0aCB0aGUgYXJjJ3MgZW5kIGF0XG4gICogYGFuZ2xlRGlzdGFuY2VgIGZyb20gdGhlIHNlZ21lbnQncyBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgQXJjYCB3aWxsIHVzZSB0aGlzIHNlZ21lbnQncyBzdGFydCBhcyBgY2VudGVyYCwgaXRzIGFuZ2xlXG4gICogYXMgYHN0YXJ0YCwgYW5kIGl0cyBsZW5ndGggYXMgYHJhZGl1c2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2UgZnJvbSB0aGVcbiAgKiBzZWdtZW50J3Mgc3RhcnQgdG8gdGhlIG5ldyBgQXJjYCBlbmRcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmNXaXRoQW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGVEaXN0YW5jZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGVEaXN0YW5jZSk7XG4gICAgY29uc3Qgc3RhcmdBbmdsZSA9IHRoaXMucmF5LmFuZ2xlO1xuICAgIGNvbnN0IGVuZEFuZ2xlID0gc3RhcmdBbmdsZS5zaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuXG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5yYXkuc3RhcnQsIHRoaXMubGVuZ3RoLFxuICAgICAgc3RhcmdBbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvLyBUT0RPOiB1bmNvbW1lbnQgb25jZSBiZXppZXJzIGFyZSB0ZXN0ZWQgYWdhaW5cbiAgLy8gYmV6aWVyQ2VudHJhbEFuY2hvcihkaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAvLyAgIGxldCBiaXNlY3RvciA9IHRoaXMuc2VnbWVudEJpc2VjdG9yKGRpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAvLyAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgLy8gICAgIHRoaXMuc3RhcnQsIGJpc2VjdG9yLmVuZCxcbiAgLy8gICAgIGJpc2VjdG9yLmVuZCwgdGhpcy5lbmQpO1xuICAvLyB9XG5cblxufSAvLyBTZWdtZW50XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTZWdtZW50O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5mdW5jdGlvbiBTaGFwZShyYWMpIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG5cbiAgdGhpcy5yYWMgPSByYWM7XG4gIHRoaXMub3V0bGluZSA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG4gIHRoaXMuY29udG91ciA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTtcblxuXG5TaGFwZS5wcm90b3R5cGUuYWRkT3V0bGluZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgdGhpcy5vdXRsaW5lLmFkZChlbGVtZW50KTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5hZGRDb250b3VyID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICB0aGlzLmNvbnRvdXIuYWRkKGVsZW1lbnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEZvcm1hdCBmb3IgZHJhd2luZyBhIGBUZXh0YCBvYmplY3QuXG4qIEBhbGlhcyBSYWMuVGV4dC5Gb3JtYXRcbiovXG5jbGFzcyBUZXh0Rm9ybWF0IHtcblxuICBzdGF0aWMgZGVmYXVsdFNpemUgPSAxNTtcblxuICBzdGF0aWMgaG9yaXpvbnRhbCA9IHtcbiAgICBsZWZ0OiBcImxlZnRcIixcbiAgICBjZW50ZXI6IFwiaG9yaXpvbnRhbENlbnRlclwiLFxuICAgIHJpZ2h0OiBcInJpZ2h0XCJcbiAgfTtcblxuICBzdGF0aWMgdmVydGljYWwgPSB7XG4gICAgdG9wOiBcInRvcFwiLFxuICAgIGJvdHRvbTogXCJib3R0b21cIixcbiAgICBjZW50ZXI6IFwidmVydGljYWxDZW50ZXJcIixcbiAgICBiYXNlbGluZTogXCJiYXNlbGluZVwiXG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaG9yaXpvbnRhbCwgdmVydGljYWwsXG4gICAgZm9udCA9IG51bGwsXG4gICAgYW5nbGUgPSByYWMuQW5nbGUuemVybyxcbiAgICBzaXplID0gVGV4dEZvcm1hdC5kZWZhdWx0U2l6ZSlcbiAge1xuICAgIHRoaXMuaG9yaXpvbnRhbCA9IGhvcml6b250YWw7XG4gICAgdGhpcy52ZXJ0aWNhbCA9IHZlcnRpY2FsO1xuICAgIHRoaXMuZm9udCA9IGZvbnQ7XG4gICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgZm9ybWF0IHRvIGRyYXcgdGV4dCBpbiB0aGUgc2FtZSBwb3NpdGlvbiBhcyBgc2VsZmAgd2l0aFxuICAvLyB0aGUgaW52ZXJzZSBhbmdsZS5cbiAgaW52ZXJzZSgpIHtcbiAgICBsZXQgaEVudW0gPSBUZXh0Rm9ybWF0Lmhvcml6b250YWw7XG4gICAgbGV0IHZFbnVtID0gVGV4dEZvcm1hdC52ZXJ0aWNhbDtcbiAgICBsZXQgaG9yaXpvbnRhbCwgdmVydGljYWw7XG4gICAgc3dpdGNoICh0aGlzLmhvcml6b250YWwpIHtcbiAgICAgIGNhc2UgaEVudW0ubGVmdDpcbiAgICAgICAgaG9yaXpvbnRhbCA9IGhFbnVtLnJpZ2h0OyBicmVhaztcbiAgICAgIGNhc2UgaEVudW0ucmlnaHQ6XG4gICAgICAgIGhvcml6b250YWwgPSBoRW51bS5sZWZ0OyBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGhvcml6b250YWwgPSB0aGlzLmhvcml6b250YWw7IGJyZWFrO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMudmVydGljYWwpIHtcbiAgICAgIGNhc2UgdkVudW0udG9wOlxuICAgICAgICB2ZXJ0aWNhbCA9IHZFbnVtLmJvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlIHZFbnVtLmJvdHRvbTpcbiAgICAgICAgdmVydGljYWwgPSB2RW51bS50b3A7IGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmVydGljYWwgPSB0aGlzLnZlcnRpY2FsOyBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQoXG4gICAgICBob3Jpem9udGFsLCB2ZXJ0aWNhbCxcbiAgICAgIHRoaXMuZm9udCxcbiAgICAgIHRoaXMuYW5nbGUuaW52ZXJzZSgpLFxuICAgICAgdGhpcy5zaXplKVxuICB9XG5cbn0gLy8gY2xhc3MgVGV4dEZvcm1hdFxuXG5cbi8qKlxuKiBTdHJpbmcsIGZvcm1hdCwgYW5kIHBvc2l0aW9uIHRvIGRyYXcgYSB0ZXh0LlxuKiBAYWxpYXMgUmFjLlRleHRcbiovXG5jbGFzcyBUZXh0IHtcblxuICBzdGF0aWMgRm9ybWF0ID0gVGV4dEZvcm1hdDtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHBvaW50LCBzdHJpbmcsIGZvcm1hdCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHBvaW50LCBzdHJpbmcsIGZvcm1hdCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIHBvaW50KTtcbiAgICB1dGlscy5hc3NlcnRTdHJpbmcoc3RyaW5nKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFRleHQuRm9ybWF0LCBmb3JtYXQpO1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMucG9pbnQgPSBwb2ludDtcbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICB0aGlzLmZvcm1hdCA9IGZvcm1hdDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBUZXh0KCgke3RoaXMucG9pbnQueH0sJHt0aGlzLnBvaW50Lnl9KSBcIiR7dGhpcy5zdHJpbmd9XCIpYDtcbiAgfVxuXG59IC8vIGNsYXNzIFRleHRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5BbmdsZWAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQW5nbGV9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5BbmdsZVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjQW5nbGUocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqIENhbGxzYHtAbGluayBSYWMuQW5nbGUuZnJvbX1gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfFJhYy5BbmdsZXxSYWMuUmF5fFJhYy5TZWdtZW50fSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiBkZXJpdmUgYW4gYEFuZ2xlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21cbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb20gPSBmdW5jdGlvbihzb21ldGhpbmcpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb20ocmFjLCBzb21ldGhpbmcpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBDYWxscyBge0BsaW5rIFJhYy5BbmdsZS5mcm9tUmFkaWFuc31gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW5zIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiByYWRpYW5zXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tUmFkaWFuc1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tUmFkaWFuc1xuICAqL1xuICByYWMuQW5nbGUuZnJvbVJhZGlhbnMgPSBmdW5jdGlvbihyYWRpYW5zKSB7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tUmFkaWFucyhyYWMsIHJhZGlhbnMpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDBgLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYHJpZ2h0YCwgYHJgLCBgZWFzdGAsIGBlYC5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnplcm8gPSByYWMuQW5nbGUoMC4wKTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS8yYC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGBsZWZ0YCwgYGxgLCBgd2VzdGAsIGB3YCwgYGludmVyc2VgLlxuICAqXG4gICogQG5hbWUgaGFsZlxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuaGFsZiA9IHJhYy5BbmdsZSgxLzIpO1xuICByYWMuQW5nbGUuaW52ZXJzZSA9IHJhYy5BbmdsZS5oYWxmO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzRgLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYGRvd25gLCBgZGAsIGBib3R0b21gLCBgYmAsIGBzb3V0aGAsIGBzYCwgYHNxdWFyZWAuXG4gICpcbiAgKiBAbmFtZSBxdWFydGVyXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5xdWFydGVyID0gcmFjLkFuZ2xlKDEvNCk7XG4gIHJhYy5BbmdsZS5zcXVhcmUgPSAgcmFjLkFuZ2xlLnF1YXJ0ZXI7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvOGAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgYm90dG9tUmlnaHRgLCBgYnJgLCBgc2VgLlxuICAqXG4gICogQG5hbWUgZWlnaHRoXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5laWdodGggPSAgcmFjLkFuZ2xlKDEvOCk7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDcvOGAsIG5lZ2F0aXZlIGFuZ2xlIG9mXG4gICogYHtAbGluayBpbnN0YW5jZS5BbmdsZSNlaWdodGggZWlnaHRofWAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgdG9wUmlnaHRgLCBgdHJgLCBgbmVgLlxuICAqXG4gICogQG5hbWUgbmVpZ2h0aFxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUubmVpZ2h0aCA9ICByYWMuQW5nbGUoLTEvOCk7XG5cblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS8xNmAuXG4gICpcbiAgKiBAbmFtZSBzaXh0ZWVudGhcbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnNpeHRlZW50aCA9IHJhYy5BbmdsZSgxLzE2KTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMy80YC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGB1cGAsIGB1YCwgYHRvcGAsIGB0YC5cbiAgKlxuICAqIEBuYW1lIG5vcnRoXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5ub3J0aCA9IHJhYy5BbmdsZSgzLzQpO1xuICByYWMuQW5nbGUuZWFzdCAgPSByYWMuQW5nbGUoMC80KTtcbiAgcmFjLkFuZ2xlLnNvdXRoID0gcmFjLkFuZ2xlKDEvNCk7XG4gIHJhYy5BbmdsZS53ZXN0ICA9IHJhYy5BbmdsZSgyLzQpO1xuXG4gIHJhYy5BbmdsZS5lID0gcmFjLkFuZ2xlLmVhc3Q7XG4gIHJhYy5BbmdsZS5zID0gcmFjLkFuZ2xlLnNvdXRoO1xuICByYWMuQW5nbGUudyA9IHJhYy5BbmdsZS53ZXN0O1xuICByYWMuQW5nbGUubiA9IHJhYy5BbmdsZS5ub3J0aDtcblxuICByYWMuQW5nbGUubmUgPSByYWMuQW5nbGUubi5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLnNlID0gcmFjLkFuZ2xlLmUuYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5zdyA9IHJhYy5BbmdsZS5zLmFkZCgxLzgpO1xuICByYWMuQW5nbGUubncgPSByYWMuQW5nbGUudy5hZGQoMS84KTtcblxuICAvLyBOb3J0aCBub3J0aC1lYXN0XG4gIHJhYy5BbmdsZS5ubmUgPSByYWMuQW5nbGUubmUuYWRkKC0xLzE2KTtcbiAgLy8gRWFzdCBub3J0aC1lYXN0XG4gIHJhYy5BbmdsZS5lbmUgPSByYWMuQW5nbGUubmUuYWRkKCsxLzE2KTtcbiAgLy8gTm9ydGgtZWFzdCBub3J0aFxuICByYWMuQW5nbGUubmVuID0gcmFjLkFuZ2xlLm5uZTtcbiAgLy8gTm9ydGgtZWFzdCBlYXN0XG4gIHJhYy5BbmdsZS5uZWUgPSByYWMuQW5nbGUuZW5lO1xuXG4gIC8vIEVhc3Qgc291dGgtZWFzdFxuICByYWMuQW5nbGUuZXNlID0gcmFjLkFuZ2xlLnNlLmFkZCgtMS8xNik7XG4gIC8vIFNvdXRoIHNvdXRoLWVhc3RcbiAgcmFjLkFuZ2xlLnNzZSA9IHJhYy5BbmdsZS5zZS5hZGQoKzEvMTYpO1xuICAvLyBTb3V0aC1lYXN0IGVhc3RcbiAgcmFjLkFuZ2xlLnNlZSA9IHJhYy5BbmdsZS5lc2U7XG4gIC8vIFNvdXRoLWVhc3Qgc291dGhcbiAgcmFjLkFuZ2xlLnNlcyA9IHJhYy5BbmdsZS5zc2U7XG5cbiAgLy8gU291dGggc291dGgtd2VzdFxuICByYWMuQW5nbGUuc3N3ID0gcmFjLkFuZ2xlLnN3LmFkZCgtMS8xNik7XG4gIC8vIFdlc3Qgc291dGgtd2VzdFxuICByYWMuQW5nbGUud3N3ID0gcmFjLkFuZ2xlLnN3LmFkZCgrMS8xNik7XG4gIC8vIFNvdXRoLXdlc3Qgc291dGhcbiAgcmFjLkFuZ2xlLnN3cyA9IHJhYy5BbmdsZS5zc3c7XG4gIC8vIFNvdXRoLXdlc3Qgd2VzdFxuICByYWMuQW5nbGUuc3d3ID0gcmFjLkFuZ2xlLndzdztcblxuICAvLyBXZXN0IG5vcnRoLXdlc3RcbiAgcmFjLkFuZ2xlLndudyA9IHJhYy5BbmdsZS5udy5hZGQoLTEvMTYpO1xuICAvLyBOb3J0aCBub3J0aC13ZXN0XG4gIHJhYy5BbmdsZS5ubncgPSByYWMuQW5nbGUubncuYWRkKCsxLzE2KTtcbiAgLy8gTm9ydC1od2VzdCB3ZXN0XG4gIHJhYy5BbmdsZS5ud3cgPSByYWMuQW5nbGUud253O1xuICAvLyBOb3J0aC13ZXN0IG5vcnRoXG4gIHJhYy5BbmdsZS5ud24gPSByYWMuQW5nbGUubm53O1xuXG4gIHJhYy5BbmdsZS5yaWdodCA9IHJhYy5BbmdsZS5lO1xuICByYWMuQW5nbGUuZG93biAgPSByYWMuQW5nbGUucztcbiAgcmFjLkFuZ2xlLmxlZnQgID0gcmFjLkFuZ2xlLnc7XG4gIHJhYy5BbmdsZS51cCAgICA9IHJhYy5BbmdsZS5uO1xuXG4gIHJhYy5BbmdsZS5yID0gcmFjLkFuZ2xlLnJpZ2h0O1xuICByYWMuQW5nbGUuZCA9IHJhYy5BbmdsZS5kb3duO1xuICByYWMuQW5nbGUubCA9IHJhYy5BbmdsZS5sZWZ0O1xuICByYWMuQW5nbGUudSA9IHJhYy5BbmdsZS51cDtcblxuICByYWMuQW5nbGUudG9wICAgID0gcmFjLkFuZ2xlLnVwO1xuICByYWMuQW5nbGUuYm90dG9tID0gcmFjLkFuZ2xlLmRvd247XG4gIHJhYy5BbmdsZS50ICAgICAgPSByYWMuQW5nbGUudG9wO1xuICByYWMuQW5nbGUuYiAgICAgID0gcmFjLkFuZ2xlLmJvdHRvbTtcblxuICByYWMuQW5nbGUudG9wUmlnaHQgICAgPSByYWMuQW5nbGUubmU7XG4gIHJhYy5BbmdsZS50ciAgICAgICAgICA9IHJhYy5BbmdsZS5uZTtcbiAgcmFjLkFuZ2xlLnRvcExlZnQgICAgID0gcmFjLkFuZ2xlLm53O1xuICByYWMuQW5nbGUudGwgICAgICAgICAgPSByYWMuQW5nbGUubnc7XG4gIHJhYy5BbmdsZS5ib3R0b21SaWdodCA9IHJhYy5BbmdsZS5zZTtcbiAgcmFjLkFuZ2xlLmJyICAgICAgICAgID0gcmFjLkFuZ2xlLnNlO1xuICByYWMuQW5nbGUuYm90dG9tTGVmdCAgPSByYWMuQW5nbGUuc3c7XG4gIHJhYy5BbmdsZS5ibCAgICAgICAgICA9IHJhYy5BbmdsZS5zdztcblxufSAvLyBhdHRhY2hSYWNBbmdsZVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuQXJjYCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5BcmN9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5BcmNcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0FyYyhyYWMpIHtcblxuICAvKipcbiAgKiBBIGNsb2Nrd2lzZSBgQXJjYCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5BcmN9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFyYyNcbiAgKi9cbiAgcmFjLkFyYy56ZXJvID0gcmFjLkFyYygwLCAwLCAwLCAwLCAwLCB0cnVlKTtcblxufSAvLyBhdHRhY2hSYWNBcmNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkJlemllcmAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQmV6aWVyfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQmV6aWVyXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hJbnN0YW5jZUJlemllcihyYWMpIHtcblxuICAvKipcbiAgKiBBIGBCZXppZXJgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLkJlemllcn1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQmV6aWVyI1xuICAqL1xuICByYWMuQmV6aWVyLnplcm8gPSByYWMuQmV6aWVyKFxuICAgIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCk7XG5cbn0gLy8gYXR0YWNoSW5zdGFuY2VCZXppZXJcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlBvaW50YCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5Qb2ludH1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlBvaW50XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNQb2ludChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBQb2ludGAgd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuemVybyA9IHJhYy5Qb2ludCgwLCAwKTtcblxuICAvKipcbiAgKiBBIGBQb2ludGAgYXQgYCgwLCAwKWAuXG4gICpcbiAgKiBFcXVhbCB0byBge0BsaW5rIGluc3RhbmNlLlBvaW50I3plcm99YC5cbiAgKlxuICAqIEBuYW1lIG9yaWdpblxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQub3JpZ2luID0gcmFjLlBvaW50Lnplcm87XG5cblxufSAvLyBhdHRhY2hSYWNQb2ludFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuUmF5YCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5SYXl9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5SYXlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1JheShyYWMpIHtcblxuICAvKipcbiAgKiBBIGBSYXlgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVybywgc3RhcnRzIGF0XG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAgYW5kIHBvaW50cyB0b1xuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31gLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICogQHNlZSBpbnN0YW5jZS5Qb2ludCN6ZXJvXG4gICogQHNlZSBpbnN0YW5jZS5BbmdsZSN6ZXJvXG4gICovXG4gIHJhYy5SYXkuemVybyA9IHJhYy5SYXkoMCwgMCwgcmFjLkFuZ2xlLnplcm8pO1xuXG5cbiAgLyoqXG4gICogQSBgUmF5YCBvdmVyIHRoZSB4LWF4aXMsIHN0YXJ0cyBhdCBge0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn1gIGFuZFxuICAqIHBvaW50cyB0byBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99YC5cbiAgKlxuICAqIEVxdWFsIHRvIGB7QGxpbmsgaW5zdGFuY2UuUmF5I3plcm99YC5cbiAgKlxuICAqIEBuYW1lIHhBeGlzXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKiBAc2VlIGluc3RhbmNlLlBvaW50I29yaWdpblxuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjemVyb1xuICAqL1xuICByYWMuUmF5LnhBeGlzID0gcmFjLlJheS56ZXJvO1xuXG5cbiAgLyoqXG4gICogQSBgUmF5YCBvdmVyIHRoZSB5LWF4aXMsIHN0YXJ0cyBhdGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQub3JpZ2lufWAgYW5kXG4gICogcG9pbnRzIHRvIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUucXVhcnRlcn1gLlxuICAqXG4gICogQG5hbWUgeUF4aXNcbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnQjb3JpZ2luXG4gICogQHNlZSBpbnN0YW5jZS5BbmdsZSNxdWFydGVyXG4gICovXG4gIHJhYy5SYXkueUF4aXMgPSByYWMuUmF5KDAsIDAsIHJhYy5BbmdsZS5xdWFydGVyKTtcblxufSAvLyBhdHRhY2hSYWNSYXlcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlNlZ21lbnRgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLlNlZ21lbnR9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5TZWdtZW50XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNTZWdtZW50KHJhYykge1xuXG4gIC8qKlxuICAqIEEgYFNlZ21lbnRgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVybywgLCBzdGFydHMgYXRcbiAgKiBge0BsaW5rIGluc3RhbmNlLlBvaW50I3plcm99YCwgcG9pbnRzIHRvXG4gICogYHtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfWAsIGFuZCBoYXMgYSBsZW5ndGggb2YgemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlNlZ21lbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50Lnplcm8gPSByYWMuU2VnbWVudCgwLCAwLCAwLCAwKTtcblxufSAvLyBhdHRhY2hSYWNTZWdtZW50XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5UZXh0YCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5UZXh0fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuVGV4dFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjVGV4dChyYWMpIHtcblxuXG4gIHJhYy5UZXh0LkZvcm1hdCA9IGZ1bmN0aW9uKFxuICAgIGhvcml6b250YWwsIHZlcnRpY2FsLFxuICAgIGZvbnQgPSBudWxsLFxuICAgIGFuZ2xlID0gcmFjLkFuZ2xlLnplcm8sXG4gICAgc2l6ZSA9IFJhYy5UZXh0LkZvcm1hdC5kZWZhdWx0U2l6ZSlcbiAge1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgICAgaG9yaXpvbnRhbCwgdmVydGljYWwsXG4gICAgICBmb250LCBhbmdsZSwgc2l6ZSk7XG4gIH07XG5cblxuICByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbC5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbC50b3AsXG4gICAgcmFjLkFuZ2xlLnplcm8sXG4gICAgUmFjLlRleHQuRm9ybWF0LmRlZmF1bHRTaXplKTtcblxuICAvKipcbiAgKiBBIGBUZXh0YCBmb3IgZHJhd2luZyBgaGVsbG8gd29ybGRgIHdpdGggYHRvcExlZnRgIGZvcm1hdCBhdFxuICAqIGBQb2ludC56ZXJvYC5cbiAgKiBAbmFtZSBoZWxsb1xuICAqIEBtZW1iZXJvZiByYWMuVGV4dCNcbiAgKi9cbiAgcmFjLlRleHQuaGVsbG8gPSByYWMuVGV4dCgwLCAwLCAnaGVsbG8gd29ybGQhJyxcbiAgICByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCk7XG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgdGhlIHBhbmdyYW0gYHNwaGlueCBvZiBibGFjayBxdWFydHosIGp1ZGdlIG15IHZvd2BcbiAgKiB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXQgYFBvaW50Lnplcm9gLlxuICAqIEBuYW1lIHNwaGlueFxuICAqIEBtZW1iZXJvZiByYWMuVGV4dCNcbiAgKi9cbiAgcmFjLlRleHQuc3BoaW54ID0gcmFjLlRleHQoMCwgMCwgJ3NwaGlueCBvZiBibGFjayBxdWFydHosIGp1ZGdlIG15IHZvdycsXG4gICAgcmFjLlRleHQuRm9ybWF0LnRvcExlZnQpO1xuXG59IC8vIGF0dGFjaFJhY1BvaW50XG5cbiIsIlxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3RlbXBsYXRlcy9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbWRqcy9hbWRqcy1hcGkvYmxvYi9tYXN0ZXIvQU1ELm1kXG4gICAgLy8gaHR0cHM6Ly9yZXF1aXJlanMub3JnL2RvY3Mvd2h5YW1kLmh0bWxcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cbiAgICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgZm9yIEFNRCAtIGRlZmluZToke3R5cGVvZiBkZWZpbmV9YCk7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG5cbiAgICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgZm9yIE5vZGUgLSBtb2R1bGU6JHt0eXBlb2YgbW9kdWxlfWApO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG5cbiAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGludG8gc2VsZiAtIHJvb3Q6JHt0eXBlb2Ygcm9vdH1gKTtcbiAgcm9vdC5tYWtlUmFjID0gZmFjdG9yeSgpO1xuXG59KHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHJlcXVpcmUoJy4vUmFjJyk7XG5cbn0pKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIERyYXdlciB0aGF0IHVzZXMgYSBQNSBpbnN0YW5jZSBmb3IgYWxsIGRyYXdpbmcgb3BlcmF0aW9ucy5cbiogQGFsaWFzIFJhYy5QNURyYXdlclxuKi9cbmNsYXNzIFA1RHJhd2VyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHA1KXtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnA1ID0gcDU7XG4gICAgdGhpcy5kcmF3Um91dGluZXMgPSBbXTtcbiAgICB0aGlzLmRlYnVnUm91dGluZXMgPSBbXTtcbiAgICB0aGlzLmFwcGx5Um91dGluZXMgPSBbXTtcblxuICAgIC8vIFN0eWxlIHVzZWQgZm9yIGRlYnVnIGRyYXdpbmcsIGlmIG51bGwgdGhpc2Ugc3R5bGUgYWxyZWFkeSBhcHBsaWVkXG4gICAgLy8gaXMgdXNlZC5cbiAgICB0aGlzLmRlYnVnU3R5bGUgPSBudWxsO1xuICAgIC8vIFN0eWxlIHVzZWQgZm9yIHRleHQgZm9yIGRlYnVnIGRyYXdpbmcsIGlmIG51bGwgdGhlIHN0eWxlIGFscmVhZHlcbiAgICAvLyBhcHBsaWVkIGlzIHVzZWQuXG4gICAgdGhpcy5kZWJ1Z1RleHRTdHlsZSA9IG51bGw7XG4gICAgLy8gUmFkaXVzIG9mIHBvaW50IG1hcmtlcnMgZm9yIGRlYnVnIGRyYXdpbmcuXG4gICAgdGhpcy5kZWJ1Z1RleHRPcHRpb25zID0ge1xuICAgICAgZm9udDogJ21vbm9zcGFjZScsXG4gICAgICBzaXplOiBSYWMuVGV4dC5Gb3JtYXQuZGVmYXVsdFNpemUsXG4gICAgICB0b0ZpeGVkOiAyXG4gICAgfTtcblxuICAgIHRoaXMuZGVidWdQb2ludFJhZGl1cyA9IDQ7XG4gICAgLy8gUmFkaXVzIG9mIG1haW4gdmlzdWFsIGVsZW1lbnRzIGZvciBkZWJ1ZyBkcmF3aW5nLlxuICAgIHRoaXMuZGVidWdSYWRpdXMgPSAyMjtcblxuICAgIHRoaXMuc2V0dXBBbGxEcmF3RnVuY3Rpb25zKHJhYyk7XG4gICAgdGhpcy5zZXR1cEFsbERlYnVnRnVuY3Rpb25zKHJhYyk7XG4gICAgdGhpcy5zZXR1cEFsbEFwcGx5RnVuY3Rpb25zKHJhYyk7XG4gIH1cblxuICAvLyBBZGRzIGEgRHJhd1JvdXRpbmUgZm9yIHRoZSBnaXZlbiBjbGFzcy5cbiAgc2V0RHJhd0Z1bmN0aW9uKGNsYXNzT2JqLCBkcmF3RnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmRJbmRleChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcblxuICAgIGxldCByb3V0aW5lO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJvdXRpbmUgPSBuZXcgRHJhd1JvdXRpbmUoY2xhc3NPYmosIGRyYXdGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmRyYXdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd1JvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuICBzZXREcmF3T3B0aW9ucyhjbGFzc09iaiwgb3B0aW9ucykge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgZmluZCByb3V0aW5lIGZvciBjbGFzcyAtIGNsYXNzTmFtZToke2NsYXNzT2JqLm5hbWV9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb25cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yZXF1aXJlc1B1c2hQb3AgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcm91dGluZS5yZXF1aXJlc1B1c2hQb3AgPSBvcHRpb25zLnJlcXVpcmVzUHVzaFBvcDtcbiAgICB9XG4gIH1cblxuICBzZXRDbGFzc0RyYXdTdHlsZShjbGFzc09iaiwgc3R5bGUpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IGZpbmQgcm91dGluZSBmb3IgY2xhc3MgLSBjbGFzc05hbWU6JHtjbGFzc09iai5uYW1lfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gICAgfVxuXG4gICAgcm91dGluZS5zdHlsZSA9IHN0eWxlO1xuICB9XG5cbiAgLy8gQWRkcyBhIERlYnVnUm91dGluZSBmb3IgdGhlIGdpdmVuIGNsYXNzLlxuICBzZXREZWJ1Z0Z1bmN0aW9uKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuXG4gICAgbGV0IHJvdXRpbmU7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcm91dGluZSA9IG5ldyBEZWJ1Z1JvdXRpbmUoY2xhc3NPYmosIGRlYnVnRnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5kZWJ1Z1JvdXRpbmVzW2luZGV4XTtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5kZWJ1Z1JvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1Z1JvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuICAvLyBBZGRzIGEgQXBwbHlSb3V0aW5lIGZvciB0aGUgZ2l2ZW4gY2xhc3MuXG4gIHNldEFwcGx5RnVuY3Rpb24oY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmFwcGx5Um91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IEFwcGx5Um91dGluZShjbGFzc09iaiwgYXBwbHlGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmFwcGx5Um91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5hcHBseVJvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseVJvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuICBkcmF3T2JqZWN0KG9iamVjdCwgc3R5bGUgPSBudWxsKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLnRyYWNlKGBDYW5ub3QgZHJhdyBvYmplY3QgLSBvYmplY3QtdHlwZToke3V0aWxzLnR5cGVOYW1lKG9iamVjdCl9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdFRvRHJhdztcbiAgICB9XG5cbiAgICBpZiAocm91dGluZS5yZXF1aXJlc1B1c2hQb3AgPT09IHRydWVcbiAgICAgIHx8IHN0eWxlICE9PSBudWxsXG4gICAgICB8fCByb3V0aW5lLnN0eWxlICE9PSBudWxsKVxuICAgIHtcbiAgICAgIHRoaXMucDUucHVzaCgpO1xuICAgICAgaWYgKHJvdXRpbmUuc3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgcm91dGluZS5zdHlsZS5hcHBseSgpO1xuICAgICAgfVxuICAgICAgaWYgKHN0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIHN0eWxlLmFwcGx5KCk7XG4gICAgICB9XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICAgICAgdGhpcy5wNS5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gcHVzaC1wdWxsXG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICAgIH1cbiAgfVxuXG4gIGRlYnVnTnVtYmVyKG51bWJlcikge1xuICAgIHJldHVybiBudW1iZXIudG9GaXhlZCh0aGlzLmRlYnVnVGV4dE9wdGlvbnMudG9GaXhlZCk7XG4gIH1cblxuICBkZWJ1Z09iamVjdChvYmplY3QsIGRyYXdzVGV4dCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIHJvdXRpbmUsIGp1c3QgZHJhdyBvYmplY3Qgd2l0aCBkZWJ1ZyBzdHlsZVxuICAgICAgdGhpcy5kcmF3T2JqZWN0KG9iamVjdCwgdGhpcy5kZWJ1Z1N0eWxlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Z1N0eWxlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnA1LnB1c2goKTtcbiAgICAgIHRoaXMuZGVidWdTdHlsZS5hcHBseSgpO1xuICAgICAgcm91dGluZS5kZWJ1Z0Z1bmN0aW9uKHRoaXMsIG9iamVjdCwgZHJhd3NUZXh0KTtcbiAgICAgIHRoaXMucDUucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbih0aGlzLCBvYmplY3QsIGRyYXdzVGV4dCk7XG4gICAgfVxuICB9XG5cbiAgYXBwbHlPYmplY3Qob2JqZWN0KSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmFwcGx5Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gb2JqZWN0IGluc3RhbmNlb2Ygcm91dGluZS5jbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS50cmFjZShgQ2Fubm90IGFwcGx5IG9iamVjdCAtIG9iamVjdC10eXBlOiR7dXRpbHMudHlwZU5hbWUob2JqZWN0KX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0VG9BcHBseTtcbiAgICB9XG5cbiAgICByb3V0aW5lLmFwcGx5RnVuY3Rpb24odGhpcywgb2JqZWN0KTtcbiAgfVxuXG4gIC8vIFNldHMgdXAgYWxsIGRyYXdpbmcgcm91dGluZXMgZm9yIHJhYyBkcmF3YWJsZSBjbGFzZXMuXG4gIC8vIEFsc28gYXR0YWNoZXMgYWRkaXRpb25hbCBwcm90b3R5cGUgYW5kIHN0YXRpYyBmdW5jdGlvbnMgaW4gcmVsZXZhbnRcbiAgLy8gY2xhc3Nlcy5cbiAgc2V0dXBBbGxEcmF3RnVuY3Rpb25zKHJhYykge1xuICAgIGxldCBmdW5jdGlvbnMgPSByZXF1aXJlKCcuL2RyYXcuZnVuY3Rpb25zJyk7XG5cbiAgICAvLyBQb2ludFxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5Qb2ludCwgZnVuY3Rpb25zLmRyYXdQb2ludCk7XG4gICAgcmVxdWlyZSgnLi9Qb2ludC5mdW5jdGlvbnMnKShyYWMpO1xuXG4gICAgLy8gUmF5XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlJheSwgZnVuY3Rpb25zLmRyYXdSYXkpO1xuXG4gICAgLy8gU2VnbWVudFxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5TZWdtZW50LCBmdW5jdGlvbnMuZHJhd1NlZ21lbnQpO1xuICAgIHJlcXVpcmUoJy4vU2VnbWVudC5mdW5jdGlvbnMnKShyYWMpO1xuXG4gICAgLy8gQXJjXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRyYXdBcmMpO1xuXG4gICAgUmFjLkFyYy5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgICAgbGV0IGJlemllcnNQZXJUdXJuID0gNTtcbiAgICAgIGxldCBkaXZpc2lvbnMgPSBNYXRoLmNlaWwoYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgKiBiZXppZXJzUGVyVHVybik7XG4gICAgICB0aGlzLmRpdmlkZVRvQmV6aWVycyhkaXZpc2lvbnMpLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBCZXppZXJcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQmV6aWVyLCAoZHJhd2VyLCBiZXppZXIpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZXppZXIoXG4gICAgICAgIGJlemllci5zdGFydC54LCBiZXppZXIuc3RhcnQueSxcbiAgICAgICAgYmV6aWVyLnN0YXJ0QW5jaG9yLngsIGJlemllci5zdGFydEFuY2hvci55LFxuICAgICAgICBiZXppZXIuZW5kQW5jaG9yLngsIGJlemllci5lbmRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZC54LCBiZXppZXIuZW5kLnkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkJlemllci5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0YXJ0LnZlcnRleCgpXG4gICAgICByYWMuZHJhd2VyLnA1LmJlemllclZlcnRleChcbiAgICAgICAgdGhpcy5zdGFydEFuY2hvci54LCB0aGlzLnN0YXJ0QW5jaG9yLnksXG4gICAgICAgIHRoaXMuZW5kQW5jaG9yLngsIHRoaXMuZW5kQW5jaG9yLnksXG4gICAgICAgIHRoaXMuZW5kLngsIHRoaXMuZW5kLnkpO1xuICAgIH07XG5cbiAgICAvLyBDb21wb3NpdGVcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQ29tcG9zaXRlLCAoZHJhd2VyLCBjb21wb3NpdGUpID0+IHtcbiAgICAgIGNvbXBvc2l0ZS5zZXF1ZW5jZS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kcmF3KCkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkNvbXBvc2l0ZS5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnNlcXVlbmNlLmZvckVhY2goaXRlbSA9PiBpdGVtLnZlcnRleCgpKTtcbiAgICB9O1xuXG4gICAgLy8gU2hhcGVcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2hhcGUsIChkcmF3ZXIsIHNoYXBlKSA9PiB7XG4gICAgICBkcmF3ZXIucDUuYmVnaW5TaGFwZSgpO1xuICAgICAgc2hhcGUub3V0bGluZS52ZXJ0ZXgoKTtcblxuICAgICAgaWYgKHNoYXBlLmNvbnRvdXIuaXNOb3RFbXB0eSgpKSB7XG4gICAgICAgIGRyYXdlci5wNS5iZWdpbkNvbnRvdXIoKTtcbiAgICAgICAgc2hhcGUuY29udG91ci52ZXJ0ZXgoKTtcbiAgICAgICAgZHJhd2VyLnA1LmVuZENvbnRvdXIoKTtcbiAgICAgIH1cbiAgICAgIGRyYXdlci5wNS5lbmRTaGFwZSgpO1xuICAgIH0pO1xuXG4gICAgUmFjLlNoYXBlLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub3V0bGluZS52ZXJ0ZXgoKTtcbiAgICAgIHRoaXMuY29udG91ci52ZXJ0ZXgoKTtcbiAgICB9O1xuXG4gICAgLy8gVGV4dFxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5UZXh0LCAoZHJhd2VyLCB0ZXh0KSA9PiB7XG4gICAgICB0ZXh0LmZvcm1hdC5hcHBseSh0ZXh0LnBvaW50KTtcbiAgICAgIGRyYXdlci5wNS50ZXh0KHRleHQuc3RyaW5nLCAwLCAwKTtcbiAgICB9KTtcbiAgICB0aGlzLnNldERyYXdPcHRpb25zKFJhYy5UZXh0LCB7cmVxdWlyZXNQdXNoUG9wOiB0cnVlfSk7XG5cbiAgICAvLyBBcHBsaWVzIGFsbCB0ZXh0IHByb3BlcnRpZXMgYW5kIHRyYW5zbGF0ZXMgdG8gdGhlIGdpdmVuIGBwb2ludGAuXG4gICAgLy8gQWZ0ZXIgdGhlIGZvcm1hdCBpcyBhcHBsaWVkIHRoZSB0ZXh0IHNob3VsZCBiZSBkcmF3biBhdCB0aGUgb3JpZ2luLlxuICAgIFJhYy5UZXh0LkZvcm1hdC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbihwb2ludCkge1xuICAgICAgbGV0IGhBbGlnbjtcbiAgICAgIGxldCBoT3B0aW9ucyA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsO1xuICAgICAgc3dpdGNoICh0aGlzLmhvcml6b250YWwpIHtcbiAgICAgICAgY2FzZSBoT3B0aW9ucy5sZWZ0OiAgIGhBbGlnbiA9IHJhYy5kcmF3ZXIucDUuTEVGVDsgICBicmVhaztcbiAgICAgICAgY2FzZSBoT3B0aW9ucy5jZW50ZXI6IGhBbGlnbiA9IHJhYy5kcmF3ZXIucDUuQ0VOVEVSOyBicmVhaztcbiAgICAgICAgY2FzZSBoT3B0aW9ucy5yaWdodDogIGhBbGlnbiA9IHJhYy5kcmF3ZXIucDUuUklHSFQ7ICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIGhvcml6b250YWwgY29uZmlndXJhdGlvbiAtIGhvcml6b250YWw6JHt0aGlzLmhvcml6b250YWx9YCk7XG4gICAgICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgICAgfVxuXG4gICAgICBsZXQgdkFsaWduO1xuICAgICAgbGV0IHZPcHRpb25zID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsO1xuICAgICAgc3dpdGNoICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICAgIGNhc2Ugdk9wdGlvbnMudG9wOiAgICAgIHZBbGlnbiA9IHJhYy5kcmF3ZXIucDUuVE9QOyAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZPcHRpb25zLmJvdHRvbTogICB2QWxpZ24gPSByYWMuZHJhd2VyLnA1LkJPVFRPTTsgICBicmVhaztcbiAgICAgICAgY2FzZSB2T3B0aW9ucy5jZW50ZXI6ICAgdkFsaWduID0gcmFjLmRyYXdlci5wNS5DRU5URVI7ICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugdk9wdGlvbnMuYmFzZWxpbmU6IHZBbGlnbiA9IHJhYy5kcmF3ZXIucDUuQkFTRUxJTkU7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgdmVydGljYWwgY29uZmlndXJhdGlvbiAtIHZlcnRpY2FsOiR7dGhpcy52ZXJ0aWNhbH1gKTtcbiAgICAgICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgICB9XG5cbiAgICAgIC8vIFRleHQgcHJvcGVydGllc1xuICAgICAgcmFjLmRyYXdlci5wNS50ZXh0QWxpZ24oaEFsaWduLCB2QWxpZ24pO1xuICAgICAgcmFjLmRyYXdlci5wNS50ZXh0U2l6ZSh0aGlzLnNpemUpO1xuICAgICAgaWYgKHRoaXMuZm9udCAhPT0gbnVsbCkge1xuICAgICAgICByYWMuZHJhd2VyLnA1LnRleHRGb250KHRoaXMuZm9udCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFBvc2l0aW9uaW5nXG4gICAgICByYWMuZHJhd2VyLnA1LnRyYW5zbGF0ZShwb2ludC54LCBwb2ludC55KTtcbiAgICAgIGlmICh0aGlzLmFuZ2xlLnR1cm4gIT0gMCkge1xuICAgICAgICByYWMuZHJhd2VyLnA1LnJvdGF0ZSh0aGlzLmFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgICB9XG4gICAgfSAvLyBSYWMuVGV4dC5Gb3JtYXQucHJvdG90eXBlLmFwcGx5XG5cbiAgfSAvLyBzZXR1cEFsbERyYXdGdW5jdGlvbnNcblxuXG4gIC8vIFNldHMgdXAgYWxsIGRlYnVnIHJvdXRpbmVzIGZvciByYWMgZHJhd2FibGUgY2xhc2VzLlxuICBzZXR1cEFsbERlYnVnRnVuY3Rpb25zKHJhYykge1xuICAgIGxldCBmdW5jdGlvbnMgPSByZXF1aXJlKCcuL2RlYnVnLmZ1bmN0aW9ucycpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuUG9pbnQsIGZ1bmN0aW9ucy5kZWJ1Z1BvaW50KTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlNlZ21lbnQsIGZ1bmN0aW9ucy5kZWJ1Z1NlZ21lbnQpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuQXJjLCBmdW5jdGlvbnMuZGVidWdBcmMpO1xuXG4gICAgLy8gVE9ETzogdXNpbmcgYW4gZXh0ZXJuYWwgcmVmZXJlbmNlIHRvIGRyYXdlciwgc2hvdWxkIHVzZSBpbnRlcm5hbCBvbmVcbiAgICBsZXQgZHJhd2VyID0gdGhpcztcbiAgICBSYWMuQW5nbGUucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24ocG9pbnQsIGRyYXdzVGV4dCA9IGZhbHNlKSB7XG4gICAgICBpZiAoZHJhd2VyLmRlYnVnU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1LnB1c2goKTtcbiAgICAgICAgZHJhd2VyLmRlYnVnU3R5bGUuYXBwbHkoKTtcbiAgICAgICAgLy8gVE9ETzogY291bGQgdGhpcyBiZSBhIGdvb2Qgb3B0aW9uIHRvIGltcGxlbWVudCBzcGxhdHRpbmcgYXJndW1lbnRzXG4gICAgICAgIC8vIGludG8gdGhlIGRlYnVnRnVuY3Rpb24/XG4gICAgICAgIGZ1bmN0aW9ucy5kZWJ1Z0FuZ2xlKGRyYXdlciwgdGhpcywgcG9pbnQsIGRyYXdzVGV4dCk7XG4gICAgICAgIGRyYXdlci5wNS5wb3AoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bmN0aW9ucy5kZWJ1Z0FuZ2xlKGRyYXdlciwgdGhpcywgcG9pbnQsIGRyYXdzVGV4dCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFJhYy5Qb2ludC5wcm90b3R5cGUuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGFuZ2xlLCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgICBhbmdsZS5kZWJ1Zyh0aGlzLCBkcmF3c1RleHQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgfSAvLyBzZXR1cEFsbERlYnVnRnVuY3Rpb25zXG5cblxuICAvLyBTZXRzIHVwIGFsbCBhcHBseWluZyByb3V0aW5lcyBmb3IgcmFjIHN0eWxlIGNsYXNlcy5cbiAgLy8gQWxzbyBhdHRhY2hlcyBhZGRpdGlvbmFsIHByb3RvdHlwZSBmdW5jdGlvbnMgaW4gcmVsZXZhbnQgY2xhc3Nlcy5cbiAgc2V0dXBBbGxBcHBseUZ1bmN0aW9ucyhyYWMpIHtcbiAgICAvLyBDb2xvciBwcm90b3R5cGUgZnVuY3Rpb25zXG4gICAgUmFjLkNvbG9yLnByb3RvdHlwZS5hcHBseUJhY2tncm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJhYy5kcmF3ZXIucDUuYmFja2dyb3VuZCh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1KTtcbiAgICB9O1xuXG4gICAgUmFjLkNvbG9yLnByb3RvdHlwZS5hcHBseUZpbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJhYy5kcmF3ZXIucDUuZmlsbCh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1LCB0aGlzLmFscGhhICogMjU1KTtcbiAgICB9O1xuXG4gICAgUmFjLkNvbG9yLnByb3RvdHlwZS5hcHBseVN0cm9rZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmFjLmRyYXdlci5wNS5zdHJva2UodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSwgdGhpcy5hbHBoYSAqIDI1NSk7XG4gICAgfTtcblxuICAgIC8vIFN0cm9rZVxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuU3Ryb2tlLCAoZHJhd2VyLCBzdHJva2UpID0+IHtcbiAgICAgIGlmIChzdHJva2UuY29sb3IgPT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1Lm5vU3Ryb2tlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3Ryb2tlLmNvbG9yLmFwcGx5U3Ryb2tlKCk7XG4gICAgICBkcmF3ZXIucDUuc3Ryb2tlV2VpZ2h0KHN0cm9rZS53ZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgLy8gRmlsbFxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuRmlsbCwgKGRyYXdlciwgZmlsbCkgPT4ge1xuICAgICAgaWYgKGZpbGwuY29sb3IgPT09IG51bGwpIHtcbiAgICAgICAgcmFjLmRyYXdlci5wNS5ub0ZpbGwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmaWxsLmNvbG9yLmFwcGx5RmlsbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gU3R5bGVcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLlN0eWxlLCAoZHJhd2VyLCBzdHlsZSkgPT4ge1xuICAgICAgaWYgKHN0eWxlLnN0cm9rZSAhPT0gbnVsbCkge1xuICAgICAgICBzdHlsZS5zdHJva2UuYXBwbHkoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHlsZS5maWxsICE9PSBudWxsKSB7XG4gICAgICAgIHN0eWxlLmZpbGwuYXBwbHkoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFJhYy5TdHlsZS5wcm90b3R5cGUuYXBwbHlUb0NsYXNzID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICAgIHJhYy5kcmF3ZXIuc2V0Q2xhc3NEcmF3U3R5bGUoY2xhc3NPYmosIHRoaXMpO1xuICAgIH1cblxuICB9IC8vIHNldHVwQWxsQXBwbHlGdW5jdGlvbnNcblxufSAvLyBjbGFzcyBQNURyYXdlclxuXG5tb2R1bGUuZXhwb3J0cyA9IFA1RHJhd2VyO1xuXG5cbi8vIEVuY2Fwc3VsYXRlcyB0aGUgZHJhd2luZyBmdW5jdGlvbiBhbmQgb3B0aW9ucyBmb3IgYSBzcGVjaWZpYyBjbGFzcy5cbi8vIFRoZSBkcmF3IGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIHR3byBwYXJhbWV0ZXJzOiB0aGUgaW5zdGFuY2Ugb2YgdGhlXG4vLyBkcmF3ZXIsIGFuZCB0aGUgb2JqZWN0IHRvIGRyYXcuXG4vL1xuLy8gT3B0aW9uYWxseSBhIGBzdHlsZWAgY2FuIGJlIGFzaWduZWQgdG8gYWx3YXlzIGJlIGFwcGxpZWQgYmVmb3JlXG4vLyBkcmF3aW5nIGFuIGluc3RhbmNlIG9mIHRoZSBhc3NvY2lhdGVkIGNsYXNzLiBUaGlzIHN0eWxlIHdpbGwgYmVcbi8vIGFwcGxpZWQgYmVmb3JlIGFueSBzdHlsZXMgcHJvdmlkZWQgdG8gdGhlIGBkcmF3YCBmdW5jdGlvbi5cbi8vXG4vLyBPcHRpb25hbGx5IGByZXF1aXJlc1B1c2hQb3BgIGNhbiBiZSBzZXQgdG8gYHRydWVgIHRvIGFsd2F5cyBwZWZvcm1cbi8vIGEgYHB1c2hgIGFuZCBgcG9wYCBiZWZvcmUgYW5kIGFmdGVyIGFsbCB0aGUgc3R5bGUgYW5kIGRyYXdpbmcgaW5cbi8vIHRoZSByb3V0aW5lLiBUaGlzIGlzIGludGVuZGVkIGZvciBvYmplY3RzIHdoaWNoIGRyYXdpbmcgb3BlcmF0aW9uc1xuLy8gbWF5IG5lZWQgdG8gcHVzaCB0cmFuc2Zvcm1hdGlvbiB0byB0aGUgc3RhY2suXG5jbGFzcyBEcmF3Um91dGluZSB7XG4gIGNvbnN0cnVjdG9yIChjbGFzc09iaiwgZHJhd0Z1bmN0aW9uKSB7XG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuICAgIHRoaXMuZHJhd0Z1bmN0aW9uID0gZHJhd0Z1bmN0aW9uO1xuICAgIHRoaXMuc3R5bGUgPSBudWxsO1xuXG4gICAgLy8gT3B0aW9uc1xuICAgIHRoaXMucmVxdWlyZXNQdXNoUG9wID0gZmFsc2U7XG4gIH1cbn0gLy8gRHJhd1JvdXRpbmVcblxuXG5jbGFzcyBEZWJ1Z1JvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGRlYnVnRnVuY3Rpb24pIHtcbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG4gICAgdGhpcy5kZWJ1Z0Z1bmN0aW9uID0gZGVidWdGdW5jdGlvbjtcbiAgfVxufVxuXG5cbmNsYXNzIEFwcGx5Um91dGluZSB7XG4gIGNvbnN0cnVjdG9yIChjbGFzc09iaiwgYXBwbHlGdW5jdGlvbikge1xuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcbiAgICB0aGlzLmFwcGx5RnVuY3Rpb24gPSBhcHBseUZ1bmN0aW9uO1xuICB9XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUG9pbnRGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogQ2FsbHMgYHA1LnZlcnRleGAgYXMgdG8gcmVwcmVzZW50IHRoaXMgYFBvaW50YC5cbiAgKlxuICAqIEFkZGVkIHdoZW4gYFJhYy5QNURyYXdlcmAgaXMgc2V0dXAgYXMgYHJhYy5kcmF3ZXJgLlxuICAqL1xuICBSYWMuUG9pbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHJhYy5kcmF3ZXIucDUudmVydGV4KHRoaXMueCwgdGhpcy55KTtcbiAgfTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcG9pbnRlci5cbiAgKlxuICAqIEFkZGVkIHdoZW4gYFJhYy5QNURyYXdlcmAgaXMgc2V0dXAgYXMgYHJhYy5kcmF3ZXJgLlxuICAqXG4gICogQG5hbWUgcG9pbnRlclxuICAqIEBtZW1iZXJvZiByYWMuUG9pbnQjXG4gICogQGZ1bmN0aW9uXG4gICovXG4gIHJhYy5Qb2ludC5wb2ludGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1Lm1vdXNlWCwgcmFjLmRyYXdlci5wNS5tb3VzZVkpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAgKlxuICAqIEFkZGVkIHdoZW4gYFJhYy5QNURyYXdlcmAgaXMgc2V0dXAgYXMgYHJhYy5kcmF3ZXJgLlxuICAqXG4gICogQG5hbWUgY2FudmFzQ2VudGVyXG4gICogQG1lbWJlcm9mIHJhYy5Qb2ludCNcbiAgKiBAZnVuY3Rpb25cbiAgKi9cbiAgcmFjLlBvaW50LmNhbnZhc0NlbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aC8yLCByYWMuZHJhd2VyLnA1LmhlaWdodC8yKTtcbiAgfTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgZW5kIG9mIHRoZSBjYW52YXMsIHRoYXQgaXMsIGF0IHRoZSBwb3NpdGlvblxuICAqIGAod2lkdGgsaGVpZ2h0KWAuXG4gICpcbiAgKiBBZGRlZCB3aGVuIGBSYWMuUDVEcmF3ZXJgIGlzIHNldHVwIGFzIGByYWMuZHJhd2VyYC5cbiAgKlxuICAqIEBuYW1lIGNhbnZhc0VuZFxuICAqIEBtZW1iZXJvZiByYWMuUG9pbnQjXG4gICogQGZ1bmN0aW9uXG4gICovXG4gIFJhYy5Qb2ludC5jYW52YXNFbmQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cbn0gLy8gYXR0YWNoUG9pbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hTZWdtZW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIGFzIHRvIHJlcHJlc2VudCB0aGlzIGBTZWdtZW50YC5cbiAgKlxuICAqIEFkZGVkIHdoZW4gYFJhYy5QNURyYXdlcmAgaXMgc2V0dXAgYXMgYHJhYy5kcmF3ZXJgLlxuICAqL1xuICBSYWMuU2VnbWVudC5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGFydFBvaW50KCkudmVydGV4KCk7XG4gICAgdGhpcy5lbmRQb2ludCgpLnZlcnRleCgpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBTZWdtZW50YCB0aGF0IGNvdmVycyB0aGUgdG9wIG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnQgdG9cbiAgKiB0b3AtcmlnaHQuXG4gICpcbiAgKiBBZGRlZCB3aGVuIGBSYWMuUDVEcmF3ZXJgIGlzIHNldHVwIGFzIGByYWMuZHJhd2VyYC5cbiAgKlxuICAqIEBuYW1lIGNhbnZhc1RvcFxuICAqIEBtZW1iZXJvZiByYWMuU2VnbWVudCNcbiAgKiBAZnVuY3Rpb25cbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzVG9wID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLnJpZ2h0LCByYWMuZHJhd2VyLnA1LndpZHRoKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIGxlZnQgb2YgdGhlIGNhbnZhcywgZnJvbSB0b3AtbGVmdFxuICAqIHRvIGJvdHRvbS1sZWZ0LlxuICAqXG4gICogQWRkZWQgd2hlbiBgUmFjLlA1RHJhd2VyYCBpcyBzZXR1cCBhcyBgcmFjLmRyYXdlcmAuXG4gICpcbiAgKiBAbmFtZSBjYW52YXNMZWZ0XG4gICogQG1lbWJlcm9mIHJhYy5TZWdtZW50I1xuICAqIEBmdW5jdGlvblxuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNMZWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLXJpZ2h0XG4gICogdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgd2hlbiBgUmFjLlA1RHJhd2VyYCBpcyBzZXR1cCBhcyBgcmFjLmRyYXdlcmAuXG4gICpcbiAgKiBAbmFtZSBjYW52YXNSaWdodFxuICAqIEBtZW1iZXJvZiByYWMuU2VnbWVudCNcbiAgKiBAZnVuY3Rpb25cbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzUmlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0b3BSaWdodCA9IHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLCAwKTtcbiAgICByZXR1cm4gdG9wUmlnaHRcbiAgICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUuZG93biwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBTZWdtZW50YCB0aGF0IGNvdmVycyB0aGUgYm90dG9tIG9mIHRoZSBjYW52YXMsIGZyb21cbiAgKiBib3R0b20tbGVmdCB0byBib3R0b20tcmlnaHQuXG4gICpcbiAgKiBBZGRlZCB3aGVuIGBSYWMuUDVEcmF3ZXJgIGlzIHNldHVwIGFzIGByYWMuZHJhd2VyYC5cbiAgKlxuICAqIEBuYW1lIGNhbnZhc0JvdHRvbVxuICAqIEBtZW1iZXJvZiByYWMuU2VnbWVudCNcbiAgKiBAZnVuY3Rpb25cbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzQm90dG9tID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGJvdHRvbUxlZnQgPSByYWMuUG9pbnQoMCwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICAgIHJldHVybiBib3R0b21MZWZ0XG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLnJpZ2h0LCByYWMuZHJhd2VyLnA1LndpZHRoKTtcbiAgfTtcblxuXG5cbn0gLy8gYXR0YWNoU2VnbWVudEZ1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuZnVuY3Rpb24gcmV2ZXJzZXNUZXh0KGFuZ2xlKSB7XG4gIHJldHVybiBhbmdsZS50dXJuIDwgMy80ICYmIGFuZ2xlLnR1cm4gPj0gMS80O1xufVxuXG5cbmV4cG9ydHMuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGRyYXdlciwgYW5nbGUsIHBvaW50LCBkcmF3c1RleHQpIHtcbiAgbGV0IHJhYyA9IGRyYXdlci5yYWM7XG5cbiAgLy8gWmVybyBzZWdtZW50XG4gIHBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS56ZXJvLCBkcmF3ZXIuZGVidWdSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBBbmdsZSBzZWdtZW50XG4gIGxldCBhbmdsZVNlZ21lbnQgPSBwb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhbmdsZSwgZHJhd2VyLmRlYnVnUmFkaXVzICogMS41KTtcbiAgYW5nbGVTZWdtZW50LmVuZFBvaW50KClcbiAgICAuYXJjKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzLCBhbmdsZSwgYW5nbGUuaW52ZXJzZSgpLCBmYWxzZSlcbiAgICAuZHJhdygpO1xuICBhbmdsZVNlZ21lbnRcbiAgICAud2l0aExlbmd0aEFkZChkcmF3ZXIuZGVidWdQb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIE1pbmkgYXJjIG1hcmtlcnNcbiAgbGV0IGFuZ2xlQXJjID0gcG9pbnQuYXJjKGRyYXdlci5kZWJ1Z1JhZGl1cywgcmFjLkFuZ2xlLnplcm8sIGFuZ2xlKTtcbiAgbGV0IGNvbnRleHQgPSBkcmF3ZXIucDUuZHJhd2luZ0NvbnRleHQ7XG4gIGxldCBzdHJva2VXZWlnaHQgPSBjb250ZXh0LmxpbmVXaWR0aDtcbiAgY29udGV4dC5zYXZlKCk7IHtcbiAgICBjb250ZXh0LmxpbmVDYXAgPSAnYnV0dCc7XG4gICAgY29udGV4dC5zZXRMaW5lRGFzaChbNiwgNF0pO1xuICAgIC8vIEFuZ2xlIGFyY1xuICAgIGFuZ2xlQXJjLmRyYXcoKTtcblxuICAgIGlmICghYW5nbGVBcmMuaXNDaXJjbGUoKSkge1xuICAgICAgLy8gT3V0c2lkZSBhbmdsZSBhcmNcbiAgICAgIGNvbnRleHQuc2V0TGluZURhc2goWzIsIDRdKTtcbiAgICAgIGFuZ2xlQXJjXG4gICAgICAgIC53aXRoUmFkaXVzKGRyYXdlci5kZWJ1Z1JhZGl1cyozLzQpXG4gICAgICAgIC53aXRoQ2xvY2t3aXNlKGZhbHNlKVxuICAgICAgICAuZHJhdygpO1xuICAgIH1cbiAgfTtcbiAgY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbC5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbC5jZW50ZXIsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgaWYgKHJldmVyc2VzVGV4dChhbmdsZSkpIHtcbiAgICAvLyBSZXZlcnNlIG9yaWVudGF0aW9uXG4gICAgZm9ybWF0ID0gZm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIC8vIFR1cm4gdGV4dFxuICBsZXQgdHVyblN0cmluZyA9IGB0dXJuOiR7ZHJhd2VyLmRlYnVnTnVtYmVyKGFuZ2xlLnR1cm4pfWA7XG4gIHBvaW50XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgZHJhd2VyLmRlYnVnUmFkaXVzKjIpXG4gICAgLnRleHQodHVyblN0cmluZywgZm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z0FuZ2xlXG5cblxuZXhwb3J0cy5kZWJ1Z1BvaW50ID0gZnVuY3Rpb24oZHJhd2VyLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGxldCByYWMgPSBkcmF3ZXIucmFjO1xuXG4gIHBvaW50LmRyYXcoKTtcblxuICAvLyBQb2ludCBtYXJrZXJcbiAgcG9pbnQuYXJjKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKS5kcmF3KCk7XG5cbiAgLy8gUG9pbnQgcmV0aWN1bGUgbWFya2VyXG4gIGxldCBhcmMgPSBwb2ludFxuICAgIC5hcmMoZHJhd2VyLmRlYnVnUmFkaXVzLCByYWMuQW5nbGUucywgcmFjLkFuZ2xlLmUpXG4gICAgLmRyYXcoKTtcbiAgYXJjLnN0YXJ0U2VnbWVudCgpLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMS8yKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5lbmRTZWdtZW50KClcbiAgICAucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygxLzIpXG4gICAgLmRyYXcoKTtcblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgbGV0IHN0cmluZyA9IGB4OiR7ZHJhd2VyLmRlYnVnTnVtYmVyKHBvaW50LngpfVxcbnk6JHtkcmF3ZXIuZGVidWdOdW1iZXIocG9pbnQueSl9YDtcbiAgbGV0IGZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWwubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWwudG9wLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgcmFjLkFuZ2xlLmUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG4gIHBvaW50XG4gICAgLnBvaW50VG9BbmdsZShyYWMuQW5nbGUuc2UsIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKjIpXG4gICAgLnRleHQoc3RyaW5nLCBmb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnUG9pbnRcblxuXG5leHBvcnRzLmRlYnVnU2VnbWVudCA9IGZ1bmN0aW9uKGRyYXdlciwgc2VnbWVudCwgZHJhd3NUZXh0KSB7XG4gIGxldCByYWMgPSBkcmF3ZXIucmFjO1xuXG4gIHNlZ21lbnQuZHJhdygpO1xuXG4gIC8vIEhhbGYgY2lyY2xlIHN0YXJ0IG1hcmtlclxuICBzZWdtZW50LndpdGhMZW5ndGgoZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXMpXG4gICAgLmFyYygpXG4gICAgLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBzdGFydCBzZWdtZW50XG4gIGxldCBwZXJwQW5nbGUgPSBzZWdtZW50LmFuZ2xlKCkucGVycGVuZGljdWxhcigpO1xuICBsZXQgYXJjID0gc2VnbWVudC5zdGFydFBvaW50KClcbiAgICAuYXJjKGRyYXdlci5kZWJ1Z1JhZGl1cywgcGVycEFuZ2xlLCBwZXJwQW5nbGUuaW52ZXJzZSgpKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gUGVycGVuZGljdWxhciBlbmQgbWFya2VyXG4gIGxldCBlbmRNYXJrZXJTdGFydCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKClcbiAgICAud2l0aExlbmd0aChkcmF3ZXIuZGVidWdSYWRpdXMvMilcbiAgICAud2l0aFN0YXJ0RXh0ZW5kZWQoLWRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG4gIGxldCBlbmRNYXJrZXJFbmQgPSBzZWdtZW50XG4gICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihmYWxzZSlcbiAgICAud2l0aExlbmd0aChkcmF3ZXIuZGVidWdSYWRpdXMvMilcbiAgICAud2l0aFN0YXJ0RXh0ZW5kZWQoLWRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG4gIC8vIExpdHRsZSBlbmQgaGFsZiBjaXJjbGVcbiAgc2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhkcmF3ZXIuZGVidWdQb2ludFJhZGl1cywgZW5kTWFya2VyU3RhcnQuYW5nbGUoKSwgZW5kTWFya2VyRW5kLmFuZ2xlKCkpXG4gICAgLmRyYXcoKTtcblxuICAvLyBGb3JtaW5nIGVuZCBhcnJvd1xuICBsZXQgYXJyb3dBbmdsZVNoaWZ0ID0gcmFjLkFuZ2xlLmZyb20oMS83KTtcbiAgbGV0IGVuZEFycm93U3RhcnQgPSBlbmRNYXJrZXJTdGFydFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgZmFsc2UpO1xuICBsZXQgZW5kQXJyb3dFbmQgPSBlbmRNYXJrZXJFbmRcbiAgICAucmV2ZXJzZSgpXG4gICAgLnJheS53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlU2hpZnQsIHRydWUpO1xuICBsZXQgZW5kQXJyb3dQb2ludCA9IGVuZEFycm93U3RhcnRcbiAgICAucG9pbnRBdEludGVyc2VjdGlvbihlbmRBcnJvd0VuZCk7XG4gIC8vIEVuZCBhcnJvd1xuICBlbmRNYXJrZXJTdGFydFxuICAgIC5uZXh0U2VnbWVudFRvUG9pbnQoZW5kQXJyb3dQb2ludClcbiAgICAuZHJhdygpXG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRNYXJrZXJFbmQuZW5kUG9pbnQoKSlcbiAgICAuZHJhdygpO1xuXG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBhbmdsZSA9IHNlZ21lbnQuYW5nbGUoKTtcbiAgLy8gTm9ybWFsIG9yaWVudGF0aW9uXG4gIGxldCBsZW5ndGhGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsLmJvdHRvbSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgYW5nbGVGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsLnRvcCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBsZW5ndGhGb3JtYXQgPSBsZW5ndGhGb3JtYXQuaW52ZXJzZSgpO1xuICAgIGFuZ2xlRm9ybWF0ID0gYW5nbGVGb3JtYXQuaW52ZXJzZSgpO1xuICB9XG5cbiAgLy8gTGVuZ3RoXG4gIGxldCBsZW5ndGhTdHJpbmcgPSBgbGVuZ3RoOiR7ZHJhd2VyLmRlYnVnTnVtYmVyKHNlZ21lbnQubGVuZ3RoKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuc3VidHJhY3QoMS80KSwgZHJhd2VyLmRlYnVnUmFkaXVzLzIpXG4gICAgLnRleHQobGVuZ3RoU3RyaW5nLCBsZW5ndGhGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAgIC8vIEFuZ2xlXG4gIGxldCBhbmdsZVN0cmluZyA9IGBhbmdsZToke2RyYXdlci5kZWJ1Z051bWJlcihhbmdsZS50dXJuKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuYWRkKDEvNCksIGRyYXdlci5kZWJ1Z1JhZGl1cy8yKVxuICAgIC50ZXh0KGFuZ2xlU3RyaW5nLCBhbmdsZUZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdTZWdtZW50XG5cblxuZXhwb3J0cy5kZWJ1Z0FyYyA9IGZ1bmN0aW9uKGRyYXdlciwgYXJjLCBkcmF3c1RleHQpIHtcbiAgbGV0IHJhYyA9IGRyYXdlci5yYWM7XG5cbiAgYXJjLmRyYXcoKTtcblxuICAvLyBDZW50ZXIgbWFya2Vyc1xuICBsZXQgY2VudGVyQXJjUmFkaXVzID0gZHJhd2VyLmRlYnVnUmFkaXVzICogMi8zO1xuICBpZiAoYXJjLnJhZGl1cyA+IGRyYXdlci5kZWJ1Z1JhZGl1cy8zICYmIGFyYy5yYWRpdXMgPCBkcmF3ZXIuZGVidWdSYWRpdXMpIHtcbiAgICAvLyBJZiByYWRpdXMgaXMgdG8gY2xvc2UgdG8gdGhlIGNlbnRlci1hcmMgbWFya2Vyc1xuICAgIC8vIE1ha2UgdGhlIGNlbnRlci1hcmMgYmUgb3V0c2lkZSBvZiB0aGUgYXJjXG4gICAgY2VudGVyQXJjUmFkaXVzID0gYXJjLnJhZGl1cyArIGRyYXdlci5kZWJ1Z1JhZGl1cy8zO1xuICB9XG5cbiAgLy8gQ2VudGVyIHN0YXJ0IHNlZ21lbnRcbiAgbGV0IGNlbnRlckFyYyA9IGFyYy53aXRoUmFkaXVzKGNlbnRlckFyY1JhZGl1cyk7XG4gIGNlbnRlckFyYy5zdGFydFNlZ21lbnQoKS5kcmF3KCk7XG5cbiAgLy8gUmFkaXVzXG4gIGxldCByYWRpdXNNYXJrZXJMZW5ndGggPSBhcmMucmFkaXVzXG4gICAgLSBjZW50ZXJBcmNSYWRpdXNcbiAgICAtIGRyYXdlci5kZWJ1Z1JhZGl1cy8yXG4gICAgLSBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cyoyO1xuICBpZiAocmFkaXVzTWFya2VyTGVuZ3RoID4gMCkge1xuICAgIGFyYy5zdGFydFNlZ21lbnQoKVxuICAgICAgLndpdGhMZW5ndGgocmFkaXVzTWFya2VyTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGNlbnRlckFyY1JhZGl1cyArIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKjIpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gTWluaSBhcmMgbWFya2Vyc1xuICBsZXQgY29udGV4dCA9IGRyYXdlci5wNS5kcmF3aW5nQ29udGV4dDtcbiAgbGV0IHN0cm9rZVdlaWdodCA9IGNvbnRleHQubGluZVdpZHRoO1xuICBjb250ZXh0LnNhdmUoKTsge1xuICAgIGNvbnRleHQubGluZUNhcCA9ICdidXR0JztcbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFs2LCA0XSk7XG4gICAgY2VudGVyQXJjLmRyYXcoKTtcblxuICAgIGlmICghY2VudGVyQXJjLmlzQ2lyY2xlKCkpIHtcbiAgICAgIC8vIE91dHNpZGUgYW5nbGUgYXJjXG4gICAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCA0XSk7XG4gICAgICBjZW50ZXJBcmNcbiAgICAgICAgLndpdGhDbG9ja3dpc2UoIWNlbnRlckFyYy5jbG9ja3dpc2UpXG4gICAgICAgIC5kcmF3KCk7XG4gICAgfVxuICB9O1xuICBjb250ZXh0LnJlc3RvcmUoKTtcblxuICAvLyBDZW50ZXIgZW5kIHNlZ21lbnRcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGNlbnRlckFyYy5lbmRTZWdtZW50KCkucmV2ZXJzZSgpLndpdGhMZW5ndGhSYXRpbygxLzIpLmRyYXcoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IHBvaW50IG1hcmtlclxuICBsZXQgc3RhcnRQb2ludCA9IGFyYy5zdGFydFBvaW50KCk7XG4gIHN0YXJ0UG9pbnRcbiAgICAuYXJjKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKS5kcmF3KCk7XG4gIHN0YXJ0UG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLnN0YXJ0LCBkcmF3ZXIuZGVidWdSYWRpdXMpXG4gICAgLndpdGhTdGFydEV4dGVuZGVkKC1kcmF3ZXIuZGVidWdSYWRpdXMvMilcbiAgICAuZHJhdygpO1xuXG4gIC8vIE9yaWVudGF0aW9uIG1hcmtlclxuICBsZXQgb3JpZW50YXRpb25MZW5ndGggPSBkcmF3ZXIuZGVidWdSYWRpdXMqMjtcbiAgbGV0IG9yaWVudGF0aW9uQXJjID0gYXJjXG4gICAgLnN0YXJ0U2VnbWVudCgpXG4gICAgLndpdGhMZW5ndGhBZGQoZHJhd2VyLmRlYnVnUmFkaXVzKVxuICAgIC5hcmMobnVsbCwgYXJjLmNsb2Nrd2lzZSlcbiAgICAud2l0aExlbmd0aChvcmllbnRhdGlvbkxlbmd0aClcbiAgICAuZHJhdygpO1xuICBsZXQgYXJyb3dDZW50ZXIgPSBvcmllbnRhdGlvbkFyY1xuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aChkcmF3ZXIuZGVidWdSYWRpdXMvMilcbiAgICAuY2hvcmRTZWdtZW50KCk7XG4gIGxldCBhcnJvd0FuZ2xlID0gMy8zMjtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoLWFycm93QW5nbGUpLmRyYXcoKTtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZSkuZHJhdygpO1xuXG4gIC8vIEludGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IGVuZFBvaW50ID0gYXJjLmVuZFBvaW50KCk7XG4gIGxldCBpbnRlcm5hbExlbmd0aCA9IE1hdGgubWluKGRyYXdlci5kZWJ1Z1JhZGl1cy8yLCBhcmMucmFkaXVzKTtcbiAgaW50ZXJuYWxMZW5ndGggLT0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGlmIChpbnRlcm5hbExlbmd0aCA+IHJhYy5lcXVhbGl0eVRocmVzaG9sZCkge1xuICAgIGVuZFBvaW50XG4gICAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZC5pbnZlcnNlKCksIGludGVybmFsTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIEV4dGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IHRleHRKb2luVGhyZXNob2xkID0gZHJhd2VyLmRlYnVnUmFkaXVzKjM7XG4gIGxldCBsZW5ndGhBdE9yaWVudGF0aW9uQXJjID0gb3JpZW50YXRpb25BcmNcbiAgICAud2l0aEVuZChhcmMuZW5kKVxuICAgIC5sZW5ndGgoKTtcbiAgbGV0IGV4dGVybmFsTGVuZ3RoID0gbGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkICYmIGRyYXdzVGV4dCA9PT0gdHJ1ZVxuICAgID8gZHJhd2VyLmRlYnVnUmFkaXVzIC0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXNcbiAgICA6IGRyYXdlci5kZWJ1Z1JhZGl1cy8yIC0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG5cbiAgZW5kUG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZCwgZXh0ZXJuYWxMZW5ndGgpXG4gICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRW5kIHBvaW50IGxpdHRsZSBhcmNcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGVuZFBvaW50XG4gICAgICAuYXJjKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzLCBhcmMuZW5kLCBhcmMuZW5kLmludmVyc2UoKSwgYXJjLmNsb2Nrd2lzZSlcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgbGV0IGhGb3JtYXQgPSBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbDtcbiAgbGV0IHZGb3JtYXQgPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWw7XG5cbiAgbGV0IGhlYWRWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZGb3JtYXQudG9wXG4gICAgOiB2Rm9ybWF0LmJvdHRvbTtcbiAgbGV0IHRhaWxWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZGb3JtYXQuYm90dG9tXG4gICAgOiB2Rm9ybWF0LnRvcDtcbiAgbGV0IHJhZGl1c1ZlcnRpY2FsID0gYXJjLmNsb2Nrd2lzZVxuICAgID8gdkZvcm1hdC5ib3R0b21cbiAgICA6IHZGb3JtYXQudG9wO1xuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgaGVhZEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgaEZvcm1hdC5sZWZ0LFxuICAgIGhlYWRWZXJ0aWNhbCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGFyYy5zdGFydCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IHRhaWxGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIGhGb3JtYXQubGVmdCxcbiAgICB0YWlsVmVydGljYWwsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhcmMuZW5kLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgcmFkaXVzRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICBoRm9ybWF0LmxlZnQsXG4gICAgcmFkaXVzVmVydGljYWwsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhcmMuc3RhcnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG5cbiAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5zdGFydCkpIHtcbiAgICBoZWFkRm9ybWF0ID0gaGVhZEZvcm1hdC5pbnZlcnNlKCk7XG4gICAgcmFkaXVzRm9ybWF0ID0gcmFkaXVzRm9ybWF0LmludmVyc2UoKTtcbiAgfVxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5lbmQpKSB7XG4gICAgdGFpbEZvcm1hdCA9IHRhaWxGb3JtYXQuaW52ZXJzZSgpO1xuICB9XG5cbiAgbGV0IHN0YXJ0U3RyaW5nID0gYHN0YXJ0OiR7ZHJhd2VyLmRlYnVnTnVtYmVyKGFyYy5zdGFydC50dXJuKX1gO1xuICBsZXQgcmFkaXVzU3RyaW5nID0gYHJhZGl1czoke2RyYXdlci5kZWJ1Z051bWJlcihhcmMucmFkaXVzKX1gO1xuICBsZXQgZW5kU3RyaW5nID0gYGVuZDoke2RyYXdlci5kZWJ1Z051bWJlcihhcmMuZW5kLnR1cm4pfWA7XG5cbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhcmMuYW5nbGVEaXN0YW5jZSgpO1xuICBsZXQgZGlzdGFuY2VTdHJpbmcgPSBgZGlzdGFuY2U6JHtkcmF3ZXIuZGVidWdOdW1iZXIoYW5nbGVEaXN0YW5jZS50dXJuKX1gO1xuXG4gIGxldCB0YWlsU3RyaW5nID0gYCR7ZGlzdGFuY2VTdHJpbmd9XFxuJHtlbmRTdHJpbmd9YDtcbiAgbGV0IGhlYWRTdHJpbmc7XG5cbiAgLy8gUmFkaXVzIGxhYmVsXG4gIGlmIChhbmdsZURpc3RhbmNlLnR1cm4gPD0gMy80ICYmICFhcmMuaXNDaXJjbGUoKSkge1xuICAgIC8vIFJhZGl1cyBkcmF3biBzZXBhcmF0ZWx5XG4gICAgbGV0IHBlcnBBbmdsZSA9IGFyYy5zdGFydC5wZXJwZW5kaWN1bGFyKCFhcmMuY2xvY2t3aXNlKTtcbiAgICBhcmMuY2VudGVyXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgZHJhd2VyLmRlYnVnUmFkaXVzKVxuICAgICAgLnBvaW50VG9BbmdsZShwZXJwQW5nbGUsIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKjIpXG4gICAgICAudGV4dChyYWRpdXNTdHJpbmcsIHJhZGl1c0Zvcm1hdClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gICAgaGVhZFN0cmluZyA9IHN0YXJ0U3RyaW5nO1xuICB9IGVsc2Uge1xuICAgIC8vIFJhZGl1cyBqb2luZWQgdG8gaGVhZFxuICAgIGhlYWRTdHJpbmcgPSBgJHtzdGFydFN0cmluZ31cXG4ke3JhZGl1c1N0cmluZ31gO1xuICB9XG5cbiAgaWYgKGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPiB0ZXh0Sm9pblRocmVzaG9sZCkge1xuICAgIC8vIERyYXcgc3RyaW5ncyBzZXBhcmF0ZWx5XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgZHJhd2VyLmRlYnVnUmFkaXVzLzIpXG4gICAgICAudGV4dChoZWFkU3RyaW5nLCBoZWFkRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgICBvcmllbnRhdGlvbkFyYy5wb2ludEF0QW5nbGUoYXJjLmVuZClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLmVuZCwgZHJhd2VyLmRlYnVnUmFkaXVzLzIpXG4gICAgICAudGV4dCh0YWlsU3RyaW5nLCB0YWlsRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBEcmF3IHN0cmluZ3MgdG9nZXRoZXJcbiAgICBsZXQgYWxsU3RyaW5ncyA9IGAke2hlYWRTdHJpbmd9XFxuJHt0YWlsU3RyaW5nfWA7XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgZHJhd2VyLmRlYnVnUmFkaXVzLzIpXG4gICAgICAudGV4dChhbGxTdHJpbmdzLCBoZWFkRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfVxufTsgLy8gZGVidWdBcmNcblxuXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIEJlemllclxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBDb21wb3NpdGVcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgU2hhcGVcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgVGV4dFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuZXhwb3J0cy5kcmF3UG9pbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHBvaW50KSB7XG4gIGRyYXdlci5wNS5wb2ludChwb2ludC54LCBwb2ludC55KTtcbn07IC8vIGRyYXdQb2ludFxuXG5cbmV4cG9ydHMuZHJhd1JheSA9IGZ1bmN0aW9uKGRyYXdlciwgcmF5KSB7XG4gIGNvbnN0IGVkZ2VNYXJnaW4gPSAwOyAvLyBVc2VkIGZvciBkZWJ1Z2dpbmdcbiAgY29uc3QgdHVybiA9IHJheS5hbmdsZS50dXJuO1xuICBsZXQgZW5kUG9pbnQgPSBudWxsO1xuICBpZlxuICAgICh0dXJuID49IDEvOCAmJiB0dXJuIDwgMy84KVxuICB7XG4gICAgLy8gcG9pbnRpbmcgZG93blxuICAgIGNvbnN0IGRvd25FZGdlID0gZHJhd2VyLnA1LmhlaWdodCAtIGVkZ2VNYXJnaW47XG4gICAgaWYgKHJheS5zdGFydC55IDwgZG93bkVkZ2UpIHtcbiAgICAgIGVuZFBvaW50ID0gcmF5LnBvaW50QXRZKGRvd25FZGdlKTtcbiAgICB9XG4gIH0gZWxzZSBpZlxuICAgICh0dXJuID49IDMvOCAmJiB0dXJuIDwgNS84KVxuICB7XG4gICAgLy8gcG9pbnRpbmcgbGVmdFxuICAgIGNvbnN0IGxlZnRFZGdlID0gZWRnZU1hcmdpbjtcbiAgICBpZiAocmF5LnN0YXJ0LnggPj0gbGVmdEVkZ2UpIHtcbiAgICAgIGVuZFBvaW50ID0gcmF5LnBvaW50QXRYKGxlZnRFZGdlKTtcbiAgICB9XG4gIH0gZWxzZSBpZlxuICAgICh0dXJuID49IDUvOCAmJiB0dXJuIDwgNy84KVxuICB7XG4gICAgLy8gcG9pbnRpbmcgdXBcbiAgICBjb25zdCB1cEVkZ2UgPSBlZGdlTWFyZ2luO1xuICAgIGlmIChyYXkuc3RhcnQueSA+PSB1cEVkZ2UpIHtcbiAgICAgIGVuZFBvaW50ID0gcmF5LnBvaW50QXRZKHVwRWRnZSk7XG4gICAgfVxuICAgIC8vIHJldHVybjtcbiAgfSBlbHNlIHtcbiAgICAvLyBwb2ludGluZyByaWdodFxuICAgIGNvbnN0IHJpZ2h0RWRnZSA9IGRyYXdlci5wNS53aWR0aCAtIGVkZ2VNYXJnaW47XG4gICAgaWYgKHJheS5zdGFydC54IDwgcmlnaHRFZGdlKSB7XG4gICAgICBlbmRQb2ludCA9IHJheS5wb2ludEF0WChyaWdodEVkZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmRQb2ludCA9PT0gbnVsbCkge1xuICAgIC8vIFJheSBpcyBvdXRzaWRlIGNhbnZhc1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRyYXdlci5wNS5saW5lKFxuICAgIHJheS5zdGFydC54LCByYXkuc3RhcnQueSxcbiAgICBlbmRQb2ludC54LCAgZW5kUG9pbnQueSk7XG59OyAvLyBkcmF3UmF5XG5cblxuZXhwb3J0cy5kcmF3U2VnbWVudCA9IGZ1bmN0aW9uKGRyYXdlciwgc2VnbWVudCkge1xuICBjb25zdCBzdGFydCA9IHNlZ21lbnQucmF5LnN0YXJ0O1xuICBjb25zdCBlbmQgPSBzZWdtZW50LmVuZFBvaW50KCk7XG4gIGRyYXdlci5wNS5saW5lKFxuICAgIHN0YXJ0LngsIHN0YXJ0LnksXG4gICAgZW5kLngsICAgZW5kLnkpO1xufTsgLy8gZHJhd1NlZ21lbnRcblxuXG5leHBvcnRzLmRyYXdBcmMgPSBmdW5jdGlvbihkcmF3ZXIsIGFyYykge1xuICBpZiAoYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBsZXQgc3RhcnRSYWQgPSBhcmMuc3RhcnQucmFkaWFucygpO1xuICAgIGxldCBlbmRSYWQgPSBzdGFydFJhZCArIFJhYy5UQVU7XG4gICAgZHJhd2VyLnA1LmFyYyhcbiAgICAgIGFyYy5jZW50ZXIueCwgYXJjLmNlbnRlci55LFxuICAgICAgYXJjLnJhZGl1cyAqIDIsIGFyYy5yYWRpdXMgKiAyLFxuICAgICAgc3RhcnRSYWQsIGVuZFJhZCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHN0YXJ0ID0gYXJjLnN0YXJ0O1xuICBsZXQgZW5kID0gYXJjLmVuZDtcbiAgaWYgKCFhcmMuY2xvY2t3aXNlKSB7XG4gICAgc3RhcnQgPSBhcmMuZW5kO1xuICAgIGVuZCA9IGFyYy5zdGFydDtcbiAgfVxuXG4gIGRyYXdlci5wNS5hcmMoXG4gICAgYXJjLmNlbnRlci54LCBhcmMuY2VudGVyLnksXG4gICAgYXJjLnJhZGl1cyAqIDIsIGFyYy5yYWRpdXMgKiAyLFxuICAgIHN0YXJ0LnJhZGlhbnMoKSwgZW5kLnJhZGlhbnMoKSk7XG59OyAvLyBkcmF3QXJjXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb2xvciB3aXRoIFJCR0EgdmFsdWVzLCBlYWNoIG9uIHRoZSBgWzAsMV1gIHJhbmdlLlxuKiBAYWxpYXMgUmFjLkNvbG9yXG4qL1xuY2xhc3MgQ29sb3Ige1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgciwgZywgYiwgYWxwaGEgPSAxKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgciwgZywgYiwgYWxwaGEpO1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuciA9IHI7XG4gICAgdGhpcy5nID0gZztcbiAgICB0aGlzLmIgPSBiO1xuICAgIHRoaXMuYWxwaGEgPSBhbHBoYTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYENvbG9yKCR7dGhpcy5yfSwke3RoaXMuZ30sJHt0aGlzLmJ9LCR7dGhpcy5hbHBoYX0pYDtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tUmdiYShyYWMsIHIsIGcsIGIsIGEgPSAyNTUpIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHJhYywgci8yNTUsIGcvMjU1LCBiLzI1NSwgYS8yNTUpO1xuICB9XG5cbiAgZmlsbCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5GaWxsKHRoaXMucmFjLCB0aGlzKTtcbiAgfVxuXG4gIHN0cm9rZSh3ZWlnaHQgPSAxKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMucmFjLCB0aGlzLCB3ZWlnaHQpO1xuICB9XG5cbiAgd2l0aEFscGhhKG5ld0FscGhhKSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzLnJhYywgdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgbmV3QWxwaGEpO1xuICB9XG5cbiAgd2l0aEFscGhhUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCB0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFscGhhICogcmF0aW8pO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29sb3JcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRmlsbCBjb2xvciBzdHlsZSBmb3IgZHJhd2luZy5cbiogQGFsaWFzIFJhYy5GaWxsXG4qL1xuY2xhc3MgRmlsbCB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBjb2xvciA9IG51bGwpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gIH1cblxuICBzdGF0aWMgZnJvbShyYWMsIHNvbWV0aGluZykge1xuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBGaWxsKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlN0cm9rZSkge1xuICAgICAgcmV0dXJuIG5ldyBGaWxsKHJhYywgc29tZXRoaW5nLmNvbG9yKTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5Db2xvcikge1xuICAgICAgcmV0dXJuIG5ldyBGaWxsKHJhYywgc29tZXRoaW5nKTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLkZpbGwgLSBzb21ldGhpbmctdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWV0aGluZyl9YCk7XG4gIH1cblxuICBzdHlsZVdpdGhTdHJva2Uoc3Ryb2tlKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGUodGhpcy5yYWMsIHN0cm9rZSwgdGhpcyk7XG4gIH1cblxufSAvLyBjbGFzcyBGaWxsXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxsO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogU3Ryb2tlIGNvbG9yIGFuZCB3ZWlnaHQgc3R5bGUgZm9yIGRyYXdpbmcuXG4qIEBhbGlhcyBSYWMuU3Ryb2tlXG4qL1xuY2xhc3MgU3Ryb2tlIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIGNvbG9yID0gbnVsbCwgd2VpZ2h0ID0gMSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHdlaWdodCk7XG4gICAgdGhpcy5yYWMgPSByYWNcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy53ZWlnaHQgPSB3ZWlnaHQ7XG4gIH1cblxuICB3aXRoV2VpZ2h0KG5ld1dlaWdodCkge1xuICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLmNvbG9yLCBuZXdXZWlnaHQpO1xuICB9XG5cbiAgd2l0aEFscGhhKG5ld0FscGhhKSB7XG4gICAgaWYgKHRoaXMuY29sb3IgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCBudWxsLCB0aGlzLndlaWdodCk7XG4gICAgfVxuXG4gICAgbGV0IG5ld0NvbG9yID0gdGhpcy5jb2xvci53aXRoQWxwaGEobmV3QWxwaGEpO1xuICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCBuZXdDb2xvciwgdGhpcy53ZWlnaHQpO1xuICB9XG5cbiAgc3R5bGVXaXRoRmlsbChzb21lRmlsbCkge1xuICAgIGxldCBmaWxsID0gUmFjLkZpbGwuZnJvbSh0aGlzLnJhYywgc29tZUZpbGwpO1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlKHRoaXMucmFjLCB0aGlzLCBmaWxsKTtcbiAgfVxuXG59IC8vIGNsYXNzIFN0cm9rZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3Ryb2tlO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5jbGFzcyBTdHlsZSB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBzdHJva2UgPSBudWxsLCBmaWxsID0gbnVsbCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuc3Ryb2tlID0gc3Ryb2tlO1xuICAgIHRoaXMuZmlsbCA9IGZpbGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICBsZXQgc3Ryb2tlU3RyaW5nID0gJ251bGwnO1xuICAgIGlmICh0aGlzLnN0cm9rZSAhPT0gbnVsbCkge1xuICAgICAgbGV0IGNvbG9yU3RyaW5nID0gdGhpcy5zdHJva2UuY29sb3IgPT09IG51bGxcbiAgICAgICAgPyAnbnVsbC1jb2xvcidcbiAgICAgICAgOiB0aGlzLnN0cm9rZS5jb2xvci50b1N0cmluZygpO1xuICAgICAgc3Ryb2tlU3RyaW5nID0gYCR7Y29sb3JTdHJpbmd9LCR7dGhpcy5zdHJva2Uud2VpZ2h0fWA7XG4gICAgfVxuXG4gICAgbGV0IGZpbGxTdHJpbmcgPSAnbnVsbCc7XG4gICAgaWYgKHRoaXMuZmlsbCAhPT0gbnVsbCkge1xuICAgICAgbGV0IGNvbG9yU3RyaW5nID0gdGhpcy5maWxsLmNvbG9yID09PSBudWxsXG4gICAgICAgID8gJ251bGwtY29sb3InXG4gICAgICAgIDogdGhpcy5maWxsLmNvbG9yLnRvU3RyaW5nKCk7XG4gICAgICBmaWxsU3RyaW5nID0gY29sb3JTdHJpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBTdHlsZShzOigke3N0cm9rZVN0cmluZ30pIGY6JHtmaWxsU3RyaW5nfSlgO1xuICB9XG5cblxuICB3aXRoU3Ryb2tlKHN0cm9rZSkge1xuICAgIHJldHVybiBuZXcgU3R5bGUodGhpcy5yYWMsIHN0cm9rZSwgdGhpcy5maWxsKTtcbiAgfVxuXG4gIHdpdGhGaWxsKHNvbWVGaWxsKSB7XG4gICAgbGV0IGZpbGwgPSBSYWMuRmlsbC5mcm9tKHRoaXMucmFjLCBzb21lRmlsbCk7XG4gICAgcmV0dXJuIG5ldyBTdHlsZSh0aGlzLnJhYywgdGhpcy5zdHJva2UsIGZpbGwpO1xuICB9XG5cbn0gLy8gY2xhc3MgU3R5bGVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0eWxlO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuQ29sb3JgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkNvbG9yfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQ29sb3JcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0NvbG9yKHJhYykge1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQ29sb3JgIHdpdGggdGhlIGdpdmVuIGByZ2JhYCB2YWx1ZXMgaW4gdGhlIGBbMCwyNTVdYCByYW5nZS5cbiAgKiBAbmFtZSBmcm9tUmdiYVxuICAqIEBtZW1iZXJvZiByYWMuQ29sb3IjXG4gICogQGZ1bmN0aW9uXG4gICovXG4gIHJhYy5Db2xvci5mcm9tUmdiYSA9IGZ1bmN0aW9uKHIsIGcsIGIsIGEgPSAyNTUpIHtcbiAgICByZXR1cm4gUmFjLkNvbG9yLmZyb21SZ2JhKHJhYywgciwgZywgYiwgYSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBBIGJsYWNrIGBDb2xvcmAuXG4gICogQG5hbWUgYmxhY2tcbiAgKiBAbWVtYmVyb2YgcmFjLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuYmxhY2sgICA9IHJhYy5Db2xvcigwLCAwLCAwKTtcblxuICAvKipcbiAgKiBBIHJlZCBgQ29sb3JgLlxuICAqIEBuYW1lIGJsYWNrXG4gICogQG1lbWJlcm9mIHJhYy5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLnJlZCAgICAgPSByYWMuQ29sb3IoMSwgMCwgMCk7XG5cbiAgcmFjLkNvbG9yLmdyZWVuICAgPSByYWMuQ29sb3IoMCwgMSwgMCk7XG4gIHJhYy5Db2xvci5ibHVlICAgID0gcmFjLkNvbG9yKDAsIDAsIDEpO1xuICByYWMuQ29sb3IueWVsbG93ICA9IHJhYy5Db2xvcigxLCAxLCAwKTtcbiAgcmFjLkNvbG9yLm1hZ2VudGEgPSByYWMuQ29sb3IoMSwgMCwgMSk7XG4gIHJhYy5Db2xvci5jeWFuICAgID0gcmFjLkNvbG9yKDAsIDEsIDEpO1xuICByYWMuQ29sb3Iud2hpdGUgICA9IHJhYy5Db2xvcigxLCAxLCAxKTtcblxufSAvLyBhdHRhY2hSYWNDb2xvclxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuRmlsbGAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuRmlsbH1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkZpbGxcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0ZpbGwocmFjKSB7XG5cbiAgLyoqXG4gICogQSBgRmlsbGAgd2l0aG91dCBjb2xvci4gUmVtb3ZlcyB0aGUgZmlsbCBjb2xvciB3aGVuIGFwcGxpZWQuXG4gICogQG5hbWUgbm9uZVxuICAqIEBtZW1iZXJvZiByYWMuRmlsbCNcbiAgKi9cbiAgcmFjLkZpbGwubm9uZSA9IHJhYy5GaWxsKG51bGwpO1xuXG59IC8vIGF0dGFjaFJhY0ZpbGxcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlN0cm9rZWAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuU3Ryb2tlfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU3Ryb2tlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNQb2ludChyYWMpIHtcblxuICAvKipcbiAgKiBBIGBTdHJva2VgIHdpdGhvdXQgYW55IGNvbG9yLiBVc2luZyBvciBhcHBseWluZyB0aGlzIHN0cm9rZSB3aWxsXG4gICogZGlzYWJsZSBzdHJva2UgZHJhd2luZy5cbiAgKlxuICAqIEBuYW1lIG5vbmVcbiAgKiBAbWVtYmVyb2YgcmFjLlN0cm9rZSNcbiAgKi9cbiAgcmFjLlN0cm9rZS5ub25lID0gcmFjLlN0cm9rZShudWxsKVxuXG59IC8vIGF0dGFjaFJhY1N0cm9rZVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vLyBJbXBsZW1lbnRhdGlvbiBvZiBhbiBlYXNlIGZ1bmN0aW9uIHdpdGggc2V2ZXJhbCBvcHRpb25zIHRvIHRhaWxvciBpdHNcbi8vIGJlaGF2aW91ci4gVGhlIGNhbGN1bGF0aW9uIHRha2VzIHRoZSBmb2xsb3dpbmcgc3RlcHM6XG4vLyBWYWx1ZSBpcyByZWNlaXZlZCwgcHJlZml4IGlzIHJlbW92ZWRcbi8vICAgVmFsdWUgLT4gZWFzZVZhbHVlKHZhbHVlKVxuLy8gICAgIHZhbHVlID0gdmFsdWUgLSBwcmVmaXhcbi8vIFJhdGlvIGlzIGNhbGN1bGF0ZWRcbi8vICAgcmF0aW8gPSB2YWx1ZSAvIGluUmFuZ2Vcbi8vIFJhdGlvIGlzIGFkanVzdGVkXG4vLyAgIHJhdGlvIC0+IGVhc2VSYXRpbyhyYXRpbylcbi8vICAgICBhZGp1c3RlZFJhdGlvID0gKHJhdGlvICsgcmF0aW9PZnNldCkgKiByYXRpb0ZhY3RvclxuLy8gRWFzZSBpcyBjYWxjdWxhdGVkXG4vLyAgIGVhc2VkUmF0aW8gPSBlYXNlVW5pdChhZGp1c3RlZFJhdGlvKVxuLy8gRWFzZWRSYXRpbyBpcyBhZGp1c3RlZCBhbmQgcmV0dXJuZWRcbi8vICAgZWFzZWRSYXRpbyA9IChlYXNlZFJhdGlvICsgZWFzZU9mc2V0KSAqIGVhc2VGYWN0b3Jcbi8vICAgZWFzZVJhdGlvKHJhdGlvKSAtPiBlYXNlZFJhdGlvXG4vLyBWYWx1ZSBpcyBwcm9qZWN0ZWRcbi8vICAgZWFzZWRWYWx1ZSA9IHZhbHVlICogZWFzZWRSYXRpb1xuLy8gVmFsdWUgaXMgYWRqdXN0ZWQgYW5kIHJldHVybmVkXG4vLyAgIGVhc2VkVmFsdWUgPSBwcmVmaXggKyAoZWFzZWRWYWx1ZSAqIG91dFJhbmdlKVxuLy8gICBlYXNlVmFsdWUodmFsdWUpIC0+IGVhc2VkVmFsdWVcbmNsYXNzIEVhc2VGdW5jdGlvbiB7XG5cbiAgLy8gQmVoYXZpb3JzIGZvciB0aGUgYGVhc2VWYWx1ZWAgZnVuY3Rpb24gd2hlbiBgdmFsdWVgIGZhbGxzIGJlZm9yZSB0aGVcbiAgLy8gYHByZWZpeGAgYW5kIGFmdGVyIGBpblJhbmdlYC5cbiAgc3RhdGljIEJlaGF2aW9yID0ge1xuICAgIC8vIGB2YWx1ZWAgaXMgcmV0dXJuZWQgd2l0aG91dCBhbnkgZWFzaW5nIHRyYW5zZm9ybWF0aW9uLiBgcHJlRmFjdG9yYFxuICAgIC8vIGFuZCBgcG9zdEZhY3RvcmAgYXJlIGFwcGxpZWQuIFRoaXMgaXMgdGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbi5cbiAgICBwYXNzOiBcInBhc3NcIixcbiAgICAvLyBDbGFtcHMgdGhlIHJldHVybmVkIHZhbHVlIHRvIGBwcmVmaXhgIG9yIGBwcmVmaXgraW5SYW5nZWA7XG4gICAgY2xhbXA6IFwiY2xhbXBcIixcbiAgICAvLyBSZXR1cm5zIHRoZSBhcHBsaWVkIGVhc2luZyB0cmFuc2Zvcm1hdGlvbiB0byBgdmFsdWVgIGZvciB2YWx1ZXNcbiAgICAvLyBiZWZvcmUgYHByZWZpeGAgYW5kIGFmdGVyIGBpblJhbmdlYC5cbiAgICBjb250aW51ZTogXCJjb250aW51ZVwiXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hID0gMjtcblxuICAgIC8vIEFwcGxpZWQgdG8gcmF0aW8gYmVmb3JlIGVhc2luZy5cbiAgICB0aGlzLnJhdGlvT2Zmc2V0ID0gMFxuICAgIHRoaXMucmF0aW9GYWN0b3IgPSAxO1xuXG4gICAgLy8gQXBwbGllZCB0byBlYXNlZFJhdGlvLlxuICAgIHRoaXMuZWFzZU9mZnNldCA9IDBcbiAgICB0aGlzLmVhc2VGYWN0b3IgPSAxO1xuXG4gICAgLy8gRGVmaW5lcyB0aGUgbG93ZXIgbGltaXQgb2YgYHZhbHVlYGAgdG8gYXBwbHkgZWFzaW5nLlxuICAgIHRoaXMucHJlZml4ID0gMDtcblxuICAgIC8vIGB2YWx1ZWAgaXMgcmVjZWl2ZWQgaW4gYGluUmFuZ2VgIGFuZCBvdXRwdXQgaW4gYG91dFJhbmdlYC5cbiAgICB0aGlzLmluUmFuZ2UgPSAxO1xuICAgIHRoaXMub3V0UmFuZ2UgPSAxO1xuXG4gICAgLy8gQmVoYXZpb3IgZm9yIHZhbHVlcyBiZWZvcmUgYHByZWZpeGAuXG4gICAgdGhpcy5wcmVCZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvci5wYXNzO1xuICAgIC8vIEJlaGF2aW9yIGZvciB2YWx1ZXMgYWZ0ZXIgYHByZWZpeCtpblJhbmdlYC5cbiAgICB0aGlzLnBvc3RCZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvci5wYXNzO1xuXG4gICAgLy8gRm9yIGEgYHByZUJlaGF2aW9yYCBvZiBgcGFzc2AsIHRoZSBmYWN0b3IgYXBwbGllZCB0byB2YWx1ZXMgYmVmb3JlXG4gICAgLy8gYHByZWZpeGAuXG4gICAgdGhpcy5wcmVGYWN0b3IgPSAxO1xuICAgIC8vIEZvciBhIGBwb3N0QmVoYXZpb3JgIG9mIGBwYXNzYCwgdGhlIGZhY3RvciBhcHBsaWVkIHRvIHRoZSB2YWx1ZXNcbiAgICAvLyBhZnRlciBgcHJlZml4K2luUmFuZ2VgLlxuICAgIHRoaXMucG9zdEZhY3RvciA9IDE7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGVhc2VkIHZhbHVlIGZvciBgdW5pdGAuIEJvdGggdGhlIGdpdmVuXG4gIC8vIGB1bml0YCBhbmQgdGhlIHJldHVybmVkIHZhbHVlIGFyZSBpbiB0aGUgWzAsMV0gcmFuZ2UuIElmIGB1bml0YCBpc1xuICAvLyBvdXRzaWRlIHRoZSBbMCwxXSB0aGUgcmV0dXJuZWQgdmFsdWUgZm9sbG93cyB0aGUgY3VydmUgb2YgdGhlIGVhc2luZ1xuICAvLyBmdW5jdGlvbiwgd2hpY2ggbWF5IGJlIGludmFsaWQgZm9yIHNvbWUgdmFsdWVzIG9mIGBhYC5cbiAgLy9cbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB0aGUgYmFzZSBlYXNpbmcgZnVuY3Rpb24sIGl0IGRvZXMgbm90IGFwcGx5IGFueVxuICAvLyBvZmZzZXRzIG9yIGZhY3RvcnMuXG4gIGVhc2VVbml0KHVuaXQpIHtcbiAgICAvLyBTb3VyY2U6XG4gICAgLy8gaHR0cHM6Ly9tYXRoLnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy8xMjE3MjAvZWFzZS1pbi1vdXQtZnVuY3Rpb24vMTIxNzU1IzEyMTc1NVxuICAgIC8vIGYodCkgPSAodF5hKS8odF5hKygxLXQpXmEpXG4gICAgbGV0IHJhID0gTWF0aC5wb3codW5pdCwgdGhpcy5hKTtcbiAgICBsZXQgaXJhID0gTWF0aC5wb3coMS11bml0LCB0aGlzLmEpO1xuICAgIHJldHVybiByYSAvIChyYSArIGlyYSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBlYXNlIGZ1bmN0aW9uIGFwcGxpZWQgdG8gdGhlIGdpdmVuIHJhdGlvLiBgcmF0aW9PZmZzZXRgXG4gIC8vIGFuZCBgcmF0aW9GYWN0b3JgIGFyZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCwgYGVhc2VPZmZzZXRgIGFuZFxuICAvLyBgZWFzZUZhY3RvcmAgYXJlIGFwcGxpZWQgdG8gdGhlIG91dHB1dC5cbiAgZWFzZVJhdGlvKHJhdGlvKSB7XG4gICAgbGV0IGFkanVzdGVkUmF0aW8gPSAocmF0aW8gKyB0aGlzLnJhdGlvT2Zmc2V0KSAqIHRoaXMucmF0aW9GYWN0b3I7XG4gICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VVbml0KGFkanVzdGVkUmF0aW8pO1xuICAgIHJldHVybiAoZWFzZWRSYXRpbyArIHRoaXMuZWFzZU9mZnNldCkgKiB0aGlzLmVhc2VGYWN0b3I7XG4gIH1cblxuICAvLyBBcHBsaWVzIHRoZSBlYXNpbmcgZnVuY3Rpb24gdG8gYHZhbHVlYCBjb25zaWRlcmluZyB0aGUgY29uZmlndXJhdGlvblxuICAvLyBvZiB0aGUgd2hvbGUgaW5zdGFuY2UuXG4gIGVhc2VWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCBiZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvcjtcblxuICAgIGxldCBzaGlmdGVkVmFsdWUgPSB2YWx1ZSAtIHRoaXMucHJlZml4O1xuICAgIGxldCByYXRpbyA9IHNoaWZ0ZWRWYWx1ZSAvIHRoaXMuaW5SYW5nZTtcblxuICAgIC8vIEJlZm9yZSBwcmVmaXhcbiAgICBpZiAodmFsdWUgPCB0aGlzLnByZWZpeCkge1xuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLnBhc3MpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNldG9QcmVmaXggPSB2YWx1ZSAtIHRoaXMucHJlZml4O1xuICAgICAgICAvLyBXaXRoIGEgcHJlRmFjdG9yIG9mIDEgdGhpcyBpcyBlcXVpdmFsZW50IHRvIGByZXR1cm4gcmFuZ2VgXG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIChkaXN0YW5jZXRvUHJlZml4ICogdGhpcy5wcmVGYWN0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLmNsYW1wKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5jb250aW51ZSkge1xuICAgICAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVJhdGlvKHJhdGlvKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgZWFzZWRSYXRpbyAqIHRoaXMub3V0UmFuZ2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgcHJlQmVoYXZpb3IgY29uZmlndXJhdGlvbiAtIHByZUJlaGF2aW9yOiR7dGhpcy5wb3N0QmVoYXZpb3J9YCk7XG4gICAgICB0aHJvdyByYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgfVxuXG4gICAgLy8gQWZ0ZXIgcHJlZml4XG4gICAgaWYgKHJhdGlvIDw9IDEgfHwgdGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLmNvbnRpbnVlKSB7XG4gICAgICAvLyBFYXNlIGZ1bmN0aW9uIGFwcGxpZWQgd2l0aGluIHJhbmdlIChvciBhZnRlcilcbiAgICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlUmF0aW8ocmF0aW8pO1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgZWFzZWRSYXRpbyAqIHRoaXMub3V0UmFuZ2U7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IucGFzcykge1xuICAgICAgLy8gU2hpZnRlZCB0byBoYXZlIGluUmFuZ2UgYXMgb3JpZ2luXG4gICAgICBsZXQgc2hpZnRlZFBvc3QgPSBzaGlmdGVkVmFsdWUgLSB0aGlzLmluUmFuZ2U7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLm91dFJhbmdlICsgc2hpZnRlZFBvc3QgKiB0aGlzLnBvc3RGYWN0b3I7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IuY2xhbXApIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMub3V0UmFuZ2U7XG4gICAgfVxuXG4gICAgY29uc29sZS50cmFjZShgSW52YWxpZCBwb3N0QmVoYXZpb3IgY29uZmlndXJhdGlvbiAtIHBvc3RCZWhhdmlvcjoke3RoaXMucG9zdEJlaGF2aW9yfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgfVxuXG5cbiAgLy8gUHJlY29uZmlndXJlZCBmdW5jdGlvbnNcblxuICAvLyBNYWtlcyBhbiBlYXNlRnVuY3Rpb24gcHJlY29uZmlndXJlZCB0byBhbiBlYXNlIG91dCBtb3Rpb24uXG4gIC8vXG4gIC8vIFRoZSBgb3V0UmFuZ2VgIHZhbHVlIHNob3VsZCBiZSBgaW5SYW5nZSoyYCBpbiBvcmRlciBmb3IgdGhlIGVhc2VcbiAgLy8gbW90aW9uIHRvIGNvbm5lY3Qgd2l0aCB0aGUgZXh0ZXJuYWwgbW90aW9uIGF0IHRoZSBjb3JyZWN0IHZlbG9jaXR5LlxuICBzdGF0aWMgbWFrZUVhc2VPdXQoKSB7XG4gICAgbGV0IGVhc2VPdXQgPSBuZXcgRWFzZUZ1bmN0aW9uKClcbiAgICBlYXNlT3V0LnJhdGlvT2Zmc2V0ID0gMTtcbiAgICBlYXNlT3V0LnJhdGlvRmFjdG9yID0gLjU7XG4gICAgZWFzZU91dC5lYXNlT2Zmc2V0ID0gLS41O1xuICAgIGVhc2VPdXQuZWFzZUZhY3RvciA9IDI7XG4gICAgcmV0dXJuIGVhc2VPdXQ7XG4gIH1cblxufSAvLyBjbGFzcyBFYXNlRnVuY3Rpb25cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEVhc2VGdW5jdGlvbjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBFeGNlcHRpb24gYnVpbGRlciBmb3IgdGhyb3dhYmxlIG9iamVjdHMuXG4qIEBhbGlhcyBSYWMuRXhjZXB0aW9uXG4qL1xuY2xhc3MgRXhjZXB0aW9uIHtcblxuICBjb25zdHJ1Y3RvcihuYW1lLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBFeGNlcHRpb246JHt0aGlzLm5hbWV9IC0gJHt0aGlzLm1lc3NhZ2V9YDtcbiAgfVxuXG4gIC8qKlxuICAqIFdoZW4gZW5hYmxlZCB0aGUgY29udmVuaWVuY2Ugc3RhdGljIGZ1bmN0aW9ucyBvZiB0aGlzIGNsYXNzIHdpbGxcbiAgKiBidWlsZCBgRXJyb3JgIG9iamVjdHMsIGluc3RlYWQgb2YgYEV4Y2VwdGlvbmAgb2JqZWN0cy5cbiAgKlxuICAqIFVzZWQgZm9yIHRlc3RzIHJ1bnMgaW4gSmVzdCwgc2luY2UgdGhyb3dpbmcgYSBjdXN0b20gb2JqZWN0IGxpa2VcbiAgKiBgRXhjZXB0aW9uYCB3aXRoaW4gYSBtYXRjaGVyIHJlc3VsdHMgaW4gdGhlIGV4cGVjdGF0aW9uIGhhbmdpbmdcbiAgKiBpbmRlZmluaXRlbHkuXG4gICpcbiAgKiBPbiB0aGUgb3RoZXIgaGFuZCwgdGhyb3dpbmcgYW4gYEVycm9yYCBvYmplY3QgaW4gY2hyb21lIGNhdXNlcyB0aGVcbiAgKiBkaXNwbGF5ZWQgc3RhY2sgdG8gYmUgcmVsYXRpdmUgdG8gdGhlIGJ1bmRsZWQgZmlsZSwgaW5zdGVhZCBvZiB0aGVcbiAgKiBzb3VyY2UgbWFwLlxuICAqL1xuICBzdGF0aWMgYnVpbGRzRXJyb3JzID0gZmFsc2U7XG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgYnVpbGRpbmcgdGhyb3dhYmxlIG9iamVjdHMuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gY2FuIGNhbiBiZSB1c2VkIGFzIGZvbGxvd2luZzpcbiAgKiBgYGBcbiAgKiBmdW5jKG1lc3NhZ2UpIC8vIHJldHVybnMgYW4gYEV4Y2VwdGlvbmBgIG9iamVjdCB3aXRoIGBuYW1lYCBhbmQgYG1lc3NhZ2VgXG4gICogZnVuYy5leGNlcHRpb25OYW1lIC8vIHJldHVybnMgdGhlIGBuYW1lYCBvZiB0aGUgYnVpbHQgdGhyb3dhYmxlIG9iamVjdHNcbiAgKiBgYGBcbiAgKi9cbiAgc3RhdGljIG5hbWVkKG5hbWUpIHtcbiAgICBsZXQgZnVuYyA9IChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAoRXhjZXB0aW9uLmJ1aWxkc0Vycm9ycykge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgZXJyb3IubmFtZSA9IG5hbWU7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBFeGNlcHRpb24obmFtZSwgbWVzc2FnZSk7XG4gICAgfTtcblxuICAgIGZ1bmMuZXhjZXB0aW9uTmFtZSA9IG5hbWU7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cblxuICBzdGF0aWMgZHJhd2VyTm90U2V0dXAgPSAgICBFeGNlcHRpb24ubmFtZWQoJ0RyYXdlck5vdFNldHVwJyk7XG4gIHN0YXRpYyBmYWlsZWRBc3NlcnQgPSAgICAgIEV4Y2VwdGlvbi5uYW1lZCgnRmFpbGVkQXNzZXJ0Jyk7XG4gIHN0YXRpYyBpbnZhbGlkT2JqZWN0VHlwZSA9IEV4Y2VwdGlvbi5uYW1lZCgnaW52YWxpZE9iamVjdFR5cGUnKTtcblxuICAvLyBhYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkOiAnQWJzdHJhY3QgZnVuY3Rpb24gY2FsbGVkJyxcbiAgLy8gaW52YWxpZFBhcmFtZXRlckNvbWJpbmF0aW9uOiAnSW52YWxpZCBwYXJhbWV0ZXIgY29tYmluYXRpb24nLFxuICAvLyBpbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjogJ0ludmFsaWQgb2JqZWN0IGNvbmZpZ3VyYXRpb24nLFxuICAvLyBpbnZhbGlkT2JqZWN0VG9EcmF3OiAnSW52YWxpZCBvYmplY3QgdG8gZHJhdycsXG4gIC8vIGludmFsaWRPYmplY3RUb0FwcGx5OiAnSW52YWxpZCBvYmplY3QgdG8gYXBwbHknLFxuXG59IC8vIGNsYXNzIEV4Y2VwdGlvblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRXhjZXB0aW9uO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIEludGVybmFsIHV0aWxpdGllcy5cbiogQG5hbWVzcGFjZSB1dGlsc1xuKi9cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBwYXNzZWQgcGFyYW1ldGVycyBhcmUgb2JqZWN0cyBvciBwcmltaXRpdmVzLiBJZiBhbnlcbiogcGFyYW1ldGVyIGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYCBhIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YFxuKiBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uT2JqZWN0fHByaW1pdGl2ZX0gcGFyYW1ldGVyc1xuKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiogQG5hbWUgYXNzZXJ0RXhpc3RzXG4qIEBtZW1iZXJvZiB1dGlscyNcbiogQGZ1bmN0aW9uXG4qL1xuZXhwb3J0cy5hc3NlcnRFeGlzdHMgPSBmdW5jdGlvbiguLi5wYXJhbWV0ZXJzKSB7XG4gIHBhcmFtZXRlcnMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBVbmV4cGVjdGVkIG51bGwgZWxlbWVudCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgIH1cbiAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYFVuZXhwZWN0ZWQgdW5kZWZpbmVkIGVsZW1lbnQgYXQgaW5kZXggJHtpbmRleH1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG9iamVjdHMgb3IgdGhlIGdpdmVuIGB0eXBlb2AsIG90aGVyd2lzZSBhXG4qIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YCBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7ZnVuY3Rpb259IHR5cGVcbiogQHBhcmFtIHsuLi5PYmplY3R9IGVsZW1lbnRzXG4qIEByZXR1cm5zIHtib29sZWFufVxuKiBAbmFtZSBhc3NlcnRUeXBlXG4qIEBtZW1iZXJvZiB1dGlscyNcbiogQGZ1bmN0aW9uXG4qL1xuZXhwb3J0cy5hc3NlcnRUeXBlID0gZnVuY3Rpb24odHlwZSwgLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUgLSBlbGVtZW50OiR7aXRlbX0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9IGV4cGVjdGVkLXR5cGUtbmFtZToke3R5cGUubmFtZX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG51bWJlciBwcmltaXRpdmVzIGFuZCBub3QgTmFOLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLm51bWJlcn0gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qIEBuYW1lIGFzc2VydE51bWJlclxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYXNzZXJ0TnVtYmVyID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdudW1iZXInIHx8IGlzTmFOKGl0ZW0pKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgbnVtYmVyIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIHN0cmluZyBwcmltaXRpdmVzLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLnN0cmluZ30gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qIEBuYW1lIGFzc2VydFN0cmluZ1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYXNzZXJ0U3RyaW5nID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3Rpbmcgc3RyaW5nIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIGJvb2xlYW4gcHJpbWl0aXZlcywgb3RoZXJ3aXNlIGFcbiogYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5ib29sZWFufSBlbGVtZW50c1xuKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiogQG5hbWUgYXNzZXJ0Qm9vbGVhblxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYXNzZXJ0Qm9vbGVhbiA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUsIGV4cGVjdGluZyBib29sZWFuIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBjb25zdHJ1Y3RvciBuYW1lIG9mIGBvYmpgLCBvciBpdHMgdHlwZSBuYW1lLlxuKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgZGVidWdnaW5nLlxuKlxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKiBAbmFtZSB0eXBlTmFtZVxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKG9iaikge1xuICBpZiAob2JqID09PSB1bmRlZmluZWQpIHsgcmV0dXJuICd1bmRlZmluZWQnOyB9XG4gIGlmIChvYmogPT09IG51bGwpIHsgcmV0dXJuICdudWxsJzsgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIG9iai5uYW1lICE9IG51bGwpIHtcbiAgICByZXR1cm4gb2JqLm5hbWUgPT0gJydcbiAgICAgID8gYGZ1bmN0aW9uYFxuICAgICAgOiBgZnVuY3Rpb246JHtvYmoubmFtZX1gO1xuICB9XG4gIHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZSA/PyB0eXBlb2Ygb2JqO1xufVxuZXhwb3J0cy50eXBlTmFtZSA9IHR5cGVOYW1lO1xuXG5cbi8qKlxuKiBBZGRzIGEgY29uc3RhbnQgdG8gdGhlIGdpdmVuIG9iamVjdCwgdGhlIGNvbnN0YW50IGlzIG5vdCBlbnVtZXJhYmxlIGFuZFxuKiBub3QgY29uZmlndXJhYmxlLlxuKlxuKiBAbmFtZSBhZGRDb25zdGFudFxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYWRkQ29uc3RhbnQgPSBmdW5jdGlvbihvYmosIHByb3BOYW1lLCB2YWx1ZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wTmFtZSwge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9KTtcbn1cblxuXG4vKipcbiogUmV0dXJucyBhIHN0cmluZyBvZiBgbnVtYmVyYCBmb3JtYXQgdXNpbmcgZml4ZWQtcG9pbnQgbm90YXRpb24gb3IgdGhlXG4qIGNvbXBsZXRlIGBudW1iZXJgIHN0cmluZy5cbipcbiogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIFRoZSBudW1iZXIgdG8gZm9ybWF0XG4qIEBwYXJhbSB7P251bWJlcn0gW2RpZ2l0c10gLSBUaGUgYW1vdW50IG9mIGRpZ2l0cyB0byBwcmludCwgb3IgYG51bGxgIHRvXG4qIHByaW50IGFsbCBkaWdpdHMuXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qXG4qIEBuYW1lIGN1dERpZ2l0c1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuY3V0RGlnaXRzID0gZnVuY3Rpb24obnVtYmVyLCBkaWdpdHMgPSBudWxsKSB7XG4gIHJldHVybiBkaWdpdHMgPT09IG51bGxcbiAgICA/IG51bWJlci50b1N0cmluZygpXG4gICAgOiBudW1iZXIudG9GaXhlZChkaWdpdHMpO1xufVxuXG4iXX0=
