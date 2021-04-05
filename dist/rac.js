(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version
module.exports = '0.10.0-dev-342-ad5617e'


},{}],2:[function(require,module,exports){
'use strict';


// Ruler and Compass
const version = require('../built/version');


/**
* This namespace contains functions attached to an instance of
* `{@link Rac}` that in turn contain convenience methods and properties.
*
* Drawable and related objects require a reference to a `rac` instance in
* order to perform drawing operations. These functions contain convenience
* methods and properties that provide objects already setup with a `rac`
* instance.
* @namespace rac
*/


/**
* Root class of RAC. All drawable, style, control, and drawer classes are
* contained in this class.
*/
class Rac {

  /**
  * Builds a new instance of Rac. The new instance will not contain a `drawer`.
  * In order to enable drawing operations call `setupDrawer` with a valid
  * object.
  */
  constructor () {

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
    * Drawer of the instance. This object handles the drawing of any
    * drawable object.
    */
    this.drawer = null;

    require('./style/rac.Color')(this);
    require('./style/rac.Stroke')(this);
    require('./style/rac.Fill')(this);
    require('./drawable/rac.Angle')(this);
    require('./drawable/rac.Point')(this);

    // Depends on rac.Point and rac.Angle being already setup
    require('./drawable/rac.Text')(this);
  }

  /**
  * Sets the drawer for the instance. Currently only a p5.js instance is
  * supported.
  *
  * The drawer will also populate some classes with prototype functions
  * relevant to the drawer. For p5.js this include `apply` functions for
  * colors and style object, and `vertex` functions for drawable objects.
  */
  setupDrawer(p5Instance) {
    this.drawer = new Rac.P5Drawer(this, p5Instance)
  }


  /**
  * Returns `true` if the absolute distance between `a` and `b` is
  * under `{@link Rac#equalityThreshold}`.
  * @param {number} a First number to compare
  * @param {number} b Second number to compare
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
  * @param {number} a First number to compare
  * @param {number} b Second number to compare
  * @returns {boolean}
  */
  unitaryEquals(a, b) {
    if (a === null || b === null) { return false; }
    const diff = Math.abs(a-b);
    return diff < this.unitaryEqualityThreshold;
  }


  /**
  * Convenience function that creates a new `Color` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Color}`.
  *
  * @param {number} r
  * @param {number} g
  * @param {number} b
  * @param {number=} a
  * @returns {Rac.Color}
  */
  Color(r, g, b, alpha = 1) {
    return new Rac.Color(this, r, g, b, alpha);
  }


  /**
  * Convenience function that creates a new `Stroke` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Stroke}`.
  *
  * @param {Rac.Color=} color
  * @param {number=} weight
  * @returns {Rac.Stroke}
  */
  Stroke(color = null, weight = 1) {
    return new Rac.Stroke(this, color, weight);
  }


  /**
  * Convenience function that creates a new `Fill` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Fill}`.
  *
  * @param {Rac.Color=} color
  * @returns {Rac.Fill}
  */
  Fill(color = null) {
    return new Rac.Fill(this, color);
  }


  /**
  * Convenience function that creates a new `Style` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Style}`.
  *
  * @param {Rac.Stroke=} stroke
  * @param {Rac.Fill=} fill
  * @returns {Rac.Style}
  */
  Style(stroke = null, fill = null) {
    return new Rac.Style(this, stroke, fill);
  }


  /**
  * Convenience function that creates a new `Angle` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Angle}`.
  *
  * @param {number} turn
  * @returns {Rac.Angle}
  */
  Angle(turn) {
    return new Rac.Angle(this, turn);
  }


  /**
  * Convenience function that creates a new `Point` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Point}`.
  *
  * @param {number} x
  * @param {number} y
  * @returns {Rac.Point}
  */
  Point(x, y) {
    return new Rac.Point(this, x, y);
  }


  /**
  * Convenience function that creates a new `Ray` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Ray}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} angle
  * @returns {Rac.Ray}
  */
  Ray(x, y, someAngle) {
    const start = new Rac.Point(this, x, y);
    const angle = Rac.Angle.from(this, someAngle);
    return new Rac.Ray(this, start, angle);
  }


  /**
  * The `rac.Segment` function-container holds several convenience methods
  * and properties for creating `{@link Rac.Segment}` objects.
  * @namespace rac.Segment
  */

  /**
  * Convenience function that creates a new `Segment` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Segment}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} someAngle
  * @param {number} length
  * @returns {Rac.Segment}
  */
  Segment(x, y, someAngle, length) {
    const start = new Rac.Point(this, x, y);
    const angle = Rac.Angle.from(this, someAngle);
    const ray = new Rac.Ray(this, start, angle);
    return new Rac.Segment(this, ray, length);
  }


  /**
  * The `rac.Arc` function-container holds several convenience methods
  * and properties for creating `{@link Rac.Arc}` objects.
  * @namespace rac.Arc
  */

  /**
  * Convenience function that creates a new `Arc` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Arc}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} someStart
  * @param {Rac.Angle|number=} someEnd=someStart
  * @param {boolean=} clockwise=true
  * @returns {Rac.Arc}
  */
  Arc(x, y, radius, someStart = this.Angle.zero, someEnd = someStart, clockwise = true) {
    const center = new Rac.Point(this, x, y);
    const start = Rac.Angle.from(this, someStart);
    const end = Rac.Angle.from(this, someEnd);
    return new Rac.Arc(this, center, radius, start, end, clockwise);
  }


  /**
  * Convenience function that creates a new `Text` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Text}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {string} string
  * @param {Rac.Text.Format} format
  * @returns {Rac.Text}
  */
  Text(x, y, string, format) {
    const point = new Rac.Point(this, x, y);
    return new Rac.Text(this, point, string, format);
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


},{"../built/version":1,"./attachProtoFunctions":3,"./control/ArcControl":4,"./control/Control":5,"./control/SegmentControl":6,"./drawable/Angle":7,"./drawable/Arc":8,"./drawable/Bezier":9,"./drawable/Composite":10,"./drawable/Point":11,"./drawable/Ray":12,"./drawable/Segment":13,"./drawable/Shape":14,"./drawable/Text":15,"./drawable/rac.Angle":16,"./drawable/rac.Point":17,"./drawable/rac.Text":18,"./p5Drawer/P5Drawer":20,"./style/Color":25,"./style/Fill":26,"./style/Stroke":27,"./style/Style":28,"./style/rac.Color":29,"./style/rac.Fill":30,"./style/rac.Stroke":31,"./util/EaseFunction":32,"./util/Exception":33,"./util/utils":34}],3:[function(require,module,exports){
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

} // attachProtoFunctions


},{"./util/utils":34}],4:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


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
    selectionAngle = anchorCopy.clampToInsets(selectionAngle,
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


},{"../Rac":2,"../util/utils":34}],5:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


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


},{"../Rac":2,"../util/utils":34}],6:[function(require,module,exports){
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
      .lengthToProjectedPoint(pointerControlCenter);
    // Clamping value (javascript has no Math.clamp)
    newDistance = anchorCopy.clampToLengthInsets(newDistance,
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
      .lengthToProjectedPoint(draggedCenter);
    let startInset = length * ratioStartLimit;
    let endInset = length * (1 - ratioEndLimit);
    constrainedLength = anchorCopy.clampToLengthInsets(constrainedLength,
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


},{"../Rac":2,"../util/utils":34}],7:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Angle measured with a `turn` value in the `[0,1)` range.
* @alias Rac.Angle
*/
class Angle {

  constructor(rac, turn) {
    utils.assertExists(rac);
    utils.assertNumber(turn);
    this.rac = rac;
    this.setTurn(turn);
  }


  /**
  * Returns a string representation intended for human consumption.
  * @param {number=} digits The number of digits to appear after the
  * decimal point, if ommited all digits are printed.
  */
  toString(digits = null) {
    let turnString = digits === null
      ? this.turn.toString()
      : this.turn.toFixed(digits);
    return `Angle(${turnString})`;
  }


  equals(someAngle) {
    const other = Angle.from(this.rac, someAngle);
    const diff = Math.abs(this.turn - other.turn);
    return diff < this.rac.unitaryEqualityThreshold
      // For close values that loop around
      || (1 - diff) < this.rac.unitaryEqualityThreshold;
  }


  setTurn(turn) {
    this.turn = turn % 1;
    if (this.turn < 0) {
      this.turn = (this.turn + 1) % 1;
    }
    return this;
  }

} // class Angle

module.exports = Angle;

/**
* Returns an `Angle` produced with `something`.
*
* + If `something` is an instance of `Angle` that same object is returned.
* + If `something` is a `number`, it is used as `turn` value.
* + If `something` is a `{@link Rac.Segment}`, returns its angle.
* + Otherwise an error is thrown.
*
* @param {Rac} rac Instance to pass along to newly created objects
* @param {number|Rac.Angle|Rac.Segment} something Object to use to produce
* an `Angle`.
*/
Angle.from = function(rac, something) {
  if (something instanceof Rac.Angle) {
    return something;
  }
  if (typeof something === 'number') {
    return new Angle(rac, something);
  }
  if (something instanceof Rac.Segment) {
    return something.angle();
  }

  throw Rac.Exception.invalidObjectType(
    `Cannot derive Rac.Angle - something-type:${utils.typeName(something)}`);
};


Angle.fromRadians = function(rac, radians) {
  return new Angle(rac, radians / Rac.TAU);
};


// If `turn`` is zero returns 1 instead, otherwise returns `turn`.
Angle.prototype.turnOne = function() {
  if (this.turn === 0) { return 1; }
  return this.turn;
}

Angle.prototype.add = function(someAngle) {
  let other = this.rac.Angle.from(someAngle);
  return new Angle(this.rac, this.turn + other.turn);
};

Angle.prototype.subtract = function(someAngle) {
  let other = this.rac.Angle.from(someAngle);
  return new Angle(this.rac, this.turn - other.turn);
};


// Returns the equivalent to `someAngle` shifted to have `this` as the
// origin, in the `clockwise` orientation.
//
// For angle at `0.1`, `shift(0.5)` will return a `0.6` angle.
// For a clockwise orientation, equivalent to `this + someAngle`.
Angle.prototype.shift = function(someAngle, clockwise = true) {
  let angle = this.rac.Angle.from(someAngle);
  return clockwise
    ? this.add(angle)
    : this.subtract(angle);
};

// Returns the equivalent of `this` when `someOrigin` is considered the
// origin, in the `clockwise` orientation.
// TODO: add example and difference to shift
Angle.prototype.shiftToOrigin = function(someOrigin, clockwise) {
  let origin = this.rac.Angle.from(someOrigin);
  return origin.shift(this, clockwise);
};

// Returns `factor * turn`.
Angle.prototype.mult = function(factor) {
  return new Angle(this.rac, this.turn * factor);
};

// Returns `factor * turnOne()`, where `turn` is considered in the
// range (0, 1].
// Useful when doing ratio calculation where a zero angle corresponds to
// a complete-circle since:
// ```
// rac.Angle(0).mult(0.5) // returns rac.Angle(0)
// // whereas
// rac.Angle(0).multOne(0.5) // return rac.Angle(0.5)
// ```
Angle.prototype.multOne = function(factor) {
  return new Angle(this.rac, this.turnOne() * factor);
};

// Returns `this` adding half a turn.
Angle.prototype.inverse = function() {
  return this.add(this.rac.Angle.inverse);
};

Angle.prototype.negative = function() {
  return new Angle(this.rac, -this.turn);
};

Angle.prototype.perpendicular = function(clockwise = true) {
  return this.shift(this.rac.Angle.square, clockwise);
};

// Returns an Angle that represents the distance from `this` to `someAngle`
// traveling in the `clockwise` orientation.
Angle.prototype.distance = function(someAngle, clockwise = true) {
  let other = this.rac.Angle.from(someAngle);
  let distance = other.subtract(this);
  return clockwise
    ? distance
    : distance.negative();
};

Angle.prototype.radians = function() {
  return this.turn * Rac.TAU;
};

Angle.prototype.degrees = function() {
  return this.turn * 360;
};


},{"../Rac":2,"../util/utils":34}],8:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Arc from a start angle to an end angle.
* @alias Rac.Arc
*/
class Arc{

  /**
  * Creates a new `Arc` instance.
  *
  * @param {Rac} rac
  * @param {Rac.Point} center
  * @param {number} radius
  * @param {Rac.Angle} start
  * @param {Rac.Angle} end
  * @param {boolean} clockwise
  */
  constructor(rac,
    center, radius,
    start, end,
    clockwise = true)
  {
    utils.assertExists(rac, center, radius, start, end, clockwise);
    utils.assertType(Rac.Point, center);
    utils.assertNumber(radius);
    utils.assertType(Rac.Angle, start, end);
    utils.assertBoolean(clockwise);

    this.rac = rac;
    this.center = center;
    this.radius = radius;
    // Start angle of the arc. Arc will draw from this angle towards `end`
    // in the `clockwise` orientaton.
    this.start = start
    // End angle of the arc. Arc will draw from `start` to this angle in
    // the `clockwise` orientaton.
    this.end = end;
    // Orientation of the arc
    this.clockwise = clockwise;
  }


  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Arc((${this.center.x},${this.center.y}) r:${this.radius} s:${this.start.turn} e:${this.end.turn} c:${this.clockwise}})`;
  }


  equals(other) {
    return this.center.equals(other.center)
      && this.rac.equals(this.radius, other.radius)
      && this.start.equals(other.start)
      && this.end.equals(other.end)
      && this.clockwise === other.clockwise;
  }


  reverse() {
    return new Arc(this.rac,
      this.center, this.radius,
      this.end, this.start,
      !this.clockwise);
  }

  length() {
    return this.angleDistance().turnOne() * this.radius * Rac.TAU;
  }

  // Returns an Angle that represents the distance between `this.start`
  // and `this.end`, in the orientation of the arc.
  angleDistance() {
    return this.start.distance(this.end, this.clockwise);
  }

  startPoint() {
    return this.pointAtAngle(this.start);
  }

  endPoint() {
    return this.pointAtAngle(this.end);
  }


  startRay() {
    return new Rac.Ray(this.rac, this.center, this.start);
  }


  endRay() {
    return new Rac.Ray(this.rac, this.center, this.end);
  }

  // Returns the segment from `center` to `startPoint()`.
  startSegment() {
    return new Rac.Segment(this.rac, this.startRay(), this.radius);
  }

  // Returns the segment from `center` to `endPoint()`.
  endSegment() {
    return new Rac.Segment(this.rac, this.endRay(), this.radius);
  }

  // Returns the segment from `startPoint()` to `endPoint()`. Note that
  // for complete-circle arcs this segment will have a length of zero.
  chordSegment() {
    let perpendicular = this.start.perpendicular(this.clockwise);
    return this.startPoint().segmentToPoint(this.endPoint(), perpendicular);
  }

  withCenter(newCenter) {
    return new Arc(this.rac,
      newCenter, this.radius,
      this.start, this.end,
      this.clockwise);
  }

  withStart(newStart) {
    let newStartAngle = Rac.Angle.from(this.rac, newStart);
    return new Arc(this.rac,
      this.center, this.radius,
      newStartAngle, this.end,
      this.clockwise);
  }

  withEnd(newEnd) {
    let newEndAngle = Rac.Angle.from(this.rac, newEnd);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEndAngle,
      this.clockwise);
  }

  withRadius(newRadius) {
    return new Arc(this.rac,
      this.center, newRadius,
      this.start, this.end,
      this.clockwise);
  }

  withAngleDistance(newAngleDistance) {
    let newEnd = this.angleAtAngleDistance(newAngleDistance);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }

  withLength(newLength) {
    let circumference = this.radius * Rac.TAU;
    let newAngleDistance = newLength / circumference;
    return this.withAngleDistance(newAngleDistance);
  }

  withLengthRatio(ratio) {
    let newLength = this.length() * ratio;
    return this.withLength(newLength);
  }

  withClockwise(newClockwise) {
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, this.end,
      newClockwise);
  }

  withStartTowardsPoint(point) {
    let newStart = this.center.angleToPoint(point);
    return new Arc(this.rac,
      this.center, this.radius,
      newStart, this.end,
      this.clockwise);
  }

  withEndTowardsPoint(point) {
    let newEnd = this.center.angleToPoint(point);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }

  withStartEndTowardsPoint(startPoint, endPoint) {
    let newStart = this.center.angleToPoint(startPoint);
    let newEnd = this.center.angleToPoint(endPoint);
    return new Arc(this.rac,
      this.center, this.radius,
      newStart, newEnd,
      this.clockwise);
  }

  // Returns `true` if this arc is a complete circle.
  isCircle() {
    return this.start.equals(this.end);
  }

  // Returns `value` clamped to the given insets from zero and the length
  // of the segment.

  // Returns `someAngle` clamped to the given insets from `this.start` and
  // `this.end`, whichever is closest in distance if `someAngle` is outside
  // the arc.
  // TODO: invalid range could return a value centered in the insets? more visually congruent
  // If the `start/endInset` values result in a contradictory range, the
  // returned value will comply with `startInset + this.start`.
  clampToInsets(someAngle, someAngleStartInset = this.rac.Angle.zero, someAngleEndInset = this.rac.Angle.zero) {
    let angle = Rac.Angle.from(this.rac, someAngle);
    let startInset = Rac.Angle.from(this.rac, someAngleStartInset);
    let endInset = Rac.Angle.from(this.rac, someAngleEndInset);

    if (this.isCircle() && startInset.turn == 0 && endInset.turn == 0) {
      // Complete circle
      return angle;
    }

    // Angle in arc, with arc as origin
    // All comparisons are made in a clockwise orientation
    let shiftedAngle = this.distanceFromStart(angle);
    let shiftedStartClamp = startInset;
    let shiftedEndClamp = this.angleDistance().subtract(endInset);

    if (shiftedAngle.turn >= shiftedStartClamp.turn && shiftedAngle.turn <= shiftedEndClamp.turn) {
      // Inside clamp range
      return angle;
    }

    // Outside range, figure out closest limit
    let distanceToStartClamp = shiftedStartClamp.distance(shiftedAngle, false);
    let distanceToEndClamp = shiftedEndClamp.distance(shiftedAngle);
    if (distanceToStartClamp.turn <= distanceToEndClamp.turn) {
      return this.shiftAngle(startInset);
    } else {
      return this.reverse().shiftAngle(endInset);
    }
  }

} // class Arc


module.exports = Arc;


// Returns `true` if the given angle is positioned between `start` and
// `end` in the `clockwise` orientation. For complete circle arcs `true` is
// always returned.
Arc.prototype.containsAngle = function(someAngle) {
  let angle = Rac.Angle.from(this.rac, someAngle);
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
};

// Returns `true` if the projection of `point` in the arc is positioned
// between `start` and `end` in the `clockwise` orientation. For complete
// circle arcs `true` is always returned.
Arc.prototype.containsProjectedPoint = function(point) {
  if (this.isCircle()) { return true; }
  return this.containsAngle(this.center.angleToPoint(point));
}

// Returns a segment for the chord formed by the intersection of `this` and
// `other`; or return `null` if there is no intersection.
// Both arcs are considered complete circles for the calculation of the
// chord, thus the endpoints of the returned segment may not lay inside the
// actual arcs.
Arc.prototype.intersectionChord = function(other) {
  // https://mathworld.wolfram.com/Circle-CircleIntersection.html
  // R=this, r=other

  if (this.center.equals(other.center)) {
    return null;
  }

  let distance = this.center.distanceToPoint(other.center);

  // distanceToChord = (d^2 - r^2 + R^2) / (d*2)
  let distanceToChord = (
      Math.pow(distance, 2)
    - Math.pow(other.radius, 2)
    + Math.pow(this.radius, 2)
    ) / (distance * 2);

  // a = 1/d sqrt|(-d+r-R)(-d-r+R)(-d+r+R)(d+r+R)
  let chordLength = (1 / distance) * Math.sqrt(
      (-distance + other.radius - this.radius)
    * (-distance - other.radius + this.radius)
    * (-distance + other.radius + this.radius)
    * (distance + other.radius + this.radius));

  let rayToChord = this.center.segmentToPoint(other.center)
    .withLength(distanceToChord);
  return rayToChord.nextSegmentPerpendicular(this.clockwise)
    .withLength(chordLength/2)
    .reverse()
    .segmentWithRatioOfLength(2);
};

// Returns the section of `this` that is inside `other`.
// `other` is aways considered as a complete circle.
Arc.prototype.intersectionArc = function(other) {
  let chord = this.intersectionChord(other);
  if (chord === null) { return null; }

  let startAngle = this.center.angleToPoint(chord.startPoint());
  let endAngle = this.center.angleToPoint(chord.endPoint());

  if (!this.containsAngle(startAngle)) {
    startAngle = this.start;
  }
  if (!this.containsAngle(endAngle)) {
    endAngle = this.end;
  }

  return new Arc(this.rac,
    this.center, this.radius,
    startAngle,
    endAngle,
    this.clockwise);
};

// Returns only intersecting points.
Arc.prototype.intersectingPointsWithArc = function(other) {
  let chord = this.intersectionChord(other);
  if (chord === null) { return []; }

  let intersections = [chord.startPoint(), chord.endPoint()].filter(function(item) {
    return this.containsAngle(this.center.segmentToPoint(item))
      && other.containsAngle(other.center.segmentToPoint(item));
  }, this);

  return intersections;
};

// Returns a segment for the chord formed by the intersection of `this` and
// `segment`; or return `null` if there is no intersection. The returned
// segment will have the same angle as `segment`.
//
// For this function `this` is considered a complete circle, and `segment`
// is considered a line without endpoints.
Arc.prototype.intersectionChordWithSegment = function(segment) {
  // First check intersection
  let projectedCenter = segment.projectedPoint(this.center);
  let bisector = this.center.segmentToPoint(projectedCenter);
  let distance = bisector.length();
  if (distance > this.radius - this.rac.equalityThreshold) {
    // projectedCenter outside or too close to arc edge
    return null;
  }

  // Segment too close to center, cosine calculations may be incorrect
  if (distance < this.rac.equalityThreshold) {
    let segmentAngle = segment.angle();
    let start = this.pointAtAngle(segmentAngle.inverse());
    let end = this.pointAtAngle(segmentAngle);
    return new Rac.Segment(start, end);
  }

  let radians = Math.acos(distance/this.radius);
  let angle = Rac.Angle.fromRadians(this.rac, radians);

  let centerOrientation = segment.pointOrientation(this.center);
  let start = this.pointAtAngle(bisector.angle().shift(angle, !centerOrientation));
  let end = this.pointAtAngle(bisector.angle().shift(angle, centerOrientation));
  return new Rac.Segment(start, end);
};

// Returns the `end` point of `intersectionChordWithSegment` for `segment`.
// If `segment` does not intersect with `self`, returns the point in the
// arc closest to `segment`.
//
// For this function `this` is considered a complete circle, and `segment`
// is considered a line without endpoints.
Arc.prototype.chordEndOrProjectionWithSegment = function(segment) {
  let chord = this.intersectionChordWithSegment(segment);
  if (chord !== null) {
    return chord.endPoint();
  }

  let centerOrientation = segment.pointOrientation(this.center);
  let perpendicular = segment.angle().perpendicular(!centerOrientation);
  return this.pointAtAngle(perpendicular);
};

Arc.prototype.radiusSegmentAtAngle = function(someAngle) {
  let angle = Rac.Angle.from(this.rac, someAngle);
  return this.center.segmentToAngle(angle, this.radius);
}

Arc.prototype.radiusSegmentTowardsPoint = function(point) {
  let angle = this.center.angleToPoint(point);
  return this.center.segmentToAngle(angle, this.radius);
}

// Returns the equivalent to `someAngle` shifted to have `this.start` as
// origin, in the orientation of the arc.
// Useful to determine an angle inside the arc, where the arc is considered
// the origin coordinate system.
// For a clockwise arc starting at `0.5`, a `shiftAngle(0.1)` is `0.6`.
// For a clockwise orientation, equivalent to `this.start + someAngle`.
Arc.prototype.shiftAngle = function(someAngle) {
  let angle = Rac.Angle.from(this.rac, someAngle);
  return this.start.shift(angle, this.clockwise);
}

// Returns an Angle that represents the distance from `this.start` to
// `someAngle` traveling in the `clockwise` orientation.
// Useful to determine for a given angle, where it sits inside the arc if
// the arc was the origin coordinate system.
// For a clockwise arc starting at `0.1`, a `distanceFromStart(0.5)` is `0.4`.
// For a clockwise orientation, equivalent to `someAngle - this.start`.
Arc.prototype.distanceFromStart = function(someAngle) {
  let angle = Rac.Angle.from(this.rac, someAngle);
  return this.start.distance(angle, this.clockwise);
}

// Returns the Angle at the given arc length from `start`. Equivalent to
// `shiftAngle(someAngle)`.
Arc.prototype.angleAtAngleDistance = function(someAngle) {
  return this.shiftAngle(someAngle);
}

// Returns the point in the arc at the given angle shifted by `this.start`
// in the arc orientation. The arc is considered a complete circle.
Arc.prototype.pointAtAngleDistance = function(someAngle) {
  let shiftedAngle = this.shiftAngle(someAngle);
  return this.pointAtAngle(shiftedAngle);
};

// Returns the point in the arc at the current arc length multiplied by
// `angleDistanceRatio` and then shifted by `this.start` in the arc
// orientation. The arc is considered a complete circle.
Arc.prototype.pointAtAngleDistanceRatio = function(angleDistanceRatio) {
  let newAngleDistance = this.angleDistance().multOne(angleDistanceRatio);
  let shiftedAngle = this.shiftAngle(newAngleDistance);
  return this.pointAtAngle(shiftedAngle);
};

// Returns the point in the arc at the given angle. The arc is considered
// a complete circle.
Arc.prototype.pointAtAngle = function(someAngle) {
  let angle = Rac.Angle.from(this.rac, someAngle);
  return this.center.pointToAngle(angle, this.radius);
};

// Returns a segment that is tangent to both `this` and `otherArc`,
// considering both as complete circles.
// With a segment from `this.center` to `otherArc.center`: `startClockwise`
// determines the starting side returned tangent segment, `endClocwise`
// determines the end side.
// Returns `null` if `this` is inside `otherArc` and thus no tangent segment
// is possible.
Arc.prototype.segmentTangentToArc = function(otherArc, startClockwise = true, endClockwise = true) {
  let hypSegment = this.center.segmentToPoint(otherArc.center);
  let ops = startClockwise === endClockwise
    ? otherArc.radius - this.radius
    : otherArc.radius + this.radius;

  let angleSine = ops / hypSegment.length();
  if (angleSine > 1) {
    return null;
  }

  let angleRadians = Math.asin(angleSine);
  let opsAngle = Rac.Angle.fromRadians(this.rac, angleRadians);

  let adjOrientation = startClockwise === endClockwise
    ? startClockwise
    : !startClockwise;
  let shiftedOpsAngle = hypSegment.angle().shift(opsAngle, adjOrientation);
  let shiftedAdjAngle = shiftedOpsAngle.perpendicular(adjOrientation);

  let startAngle = startClockwise === endClockwise
    ? shiftedAdjAngle
    : shiftedAdjAngle.inverse()
  let start = this.pointAtAngle(startAngle);
  let end = otherArc.pointAtAngle(shiftedAdjAngle);
  return start.segmentToPoint(end);
};

// Returns an array containing the arc divided into `arcCount` arcs, each
// with the same `angleDistance`.
Arc.prototype.divideToArcs = function(arcCount) {
  if (arcCount <= 0) { return []; }

  let angleDistance = this.angleDistance();
  let partTurn = angleDistance.turnOne() / arcCount;

  let partAngleDistance = new Rac.Angle(this.rac, partTurn);

  let arcs = [];
  for (let index = 0; index < arcCount; index++) {
    let start = this.start.shift(partTurn * index, this.clockwise);
    let end = this.start.shift(partTurn * (index+1), this.clockwise);
    let arc = new Arc(this.rac, this.center, this.radius, start, end, this.clockwise);
    arcs.push(arc);
  }

  return arcs;
};

Arc.prototype.divideToSegments = function(segmentCount) {
  let angleDistance = this.angleDistance();
  let partTurn = angleDistance.turnOne() / segmentCount;

  let partAngle = new Rac.Angle(this.rac, partTurn);
  if (!this.clockwise) {
    partAngle = partAngle.negative();
  }

  let lastArcRay = this.startSegment();
  let segments = [];
  for (let count = 1; count <= segmentCount; count++) {
    let currentAngle = lastArcRay.angle().add(partAngle);
    let currentArcRay = this.center.segmentToAngle(currentAngle, this.radius);
    let chord = lastArcRay.endPoint()
      .segmentToPoint(currentArcRay.endPoint());
    segments.push(chord);
    lastArcRay = currentArcRay;
  }

  return segments;
};

Arc.prototype.divideToBeziers = function(bezierCount) {
  let angleDistance = this.angleDistance();
  let partTurn = angleDistance.turnOne() / bezierCount;

  // length of tangent:
  // https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
  let parsPerTurn = 1 / partTurn;
  let tangent = this.radius * (4/3) * Math.tan(Math.PI/(parsPerTurn*2));

  let beziers = [];
  let segments = this.divideToSegments(bezierCount);
  segments.forEach(function(item) {
    let startArcRay =  this.center.segmentToPoint(item.startPoint());
    let endArcRay = this.center.segmentToPoint(item.endPoint());

    let startAnchor = startArcRay
      .nextSegmentToAngleShift(this.rac.Angle.square, !this.clockwise, tangent)
      .endPoint();
    let endAnchor = endArcRay
      .nextSegmentToAngleShift(this.rac.Angle.square, this.clockwise, tangent)
      .endPoint();

    beziers.push(new Rac.Bezier(this.rac,
      startArcRay.endPoint(), startAnchor,
      endAnchor, endArcRay.endPoint()));
  }, this);

  return new Rac.Composite(this.rac, beziers);
};


},{"../Rac":2,"../util/utils":34}],9:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


function Bezier(rac, start, startAnchor, endAnchor, end) {
  utils.assertExists(rac, start, startAnchor, endAnchor, end);

  this.rac = rac;
  this.start = start;
  this.startAnchor = startAnchor;
  this.endAnchor = endAnchor;
  this.end = end;
};


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


module.exports = Bezier;


},{"../Rac":2,"../util/utils":34}],10:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],11:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Point in a two dimentional coordinate system.
* @alias Rac.Point
*/
class Point{

  /**
  * Creates a new `Point` instance.
  * @param {Rac} rac Instance to use for drawing and creating other objects
  * @param {number} x The x coordinate
  * @param {number} y The y coordinate
  */
  constructor(rac, x, y) {
    utils.assertExists(rac, x, y);
    utils.assertNumber(x, y);
    this.rac = rac;
    this.x = x;
    this.y = y;
  }

  /**
  * Returns a string representation intended for human consumption.
  * @returns {string}
  */
  toString() {
    return `Point(${this.x},${this.y})`;
  }


  equals(other) {
    return this.rac.equals(this.x, other.x)
      && this.rac.equals(this.y, other.y);
  }


  /**
  * Returns a new `Point` with `x` set to `newX`.
  */
  withX(newX) {
    return new Point(this.rac, newX, this.y);
  }

  /**
  * Returns a new `Point` with `x` set to `newX`.
  */
  withY(newY) {
    return new Point(this.rac, this.x, newY);
  }

  addX(x) {
    return new Point(this.rac,
      this.x + x, this.y);
  }

  addY(y) {
    return new Point(this.rac,
      this.x, this.y + y);
  }

  /**
  * Returns a new `Point` by adding the components of `other`.
  * @param {Rac.Point} other A `Point` to add
  */
  addPoint(other) {
    return new Point(
      this.rac,
      this.x + other.x,
      this.y + other.y);
  }


  /**
  * Returns a new `Point` by adding the `x` and `y` components.
  * @param {number} x The x coodinate to add
  * @param {number} y The y coodinate to add
  */
  add(x, y) {
    return new Point(this.rac,
      this.x + x, this.y + y);
  }


  /**
  * Returns a new `Point` by subtracting the components of `other`.
  * @param {Rac.Point} other A `Point` to subtract
  */
  subtractPoint(other) {
    return new Point(
      this.rac,
      this.x - other.x,
      this.y - other.y);
  }


  /**
  * Returns a new `Point` by subtracting the `x` and `y` components.
  * @param {number} x The x coodinate to subtract
  * @param {number} y The y coodinate to subtract
  */
  subtract(x, y) {
    return new Point(
      this.rac,
      this.x - x,
      this.y - y);
  }

  negative() {
    return new Point(this.rac, -this.x, -this.y);
  }


  perpendicular(clockwise = true) {
    return clockwise
      ? new Point(this.rac, -this.y, this.x)
      : new Point(this.rac, this.y, -this.x);
  }

  distanceToPoint(other) {
    let x = Math.pow((other.x - this.x), 2);
    let y = Math.pow((other.y - this.y), 2);
    return Math.sqrt(x+y);
  }

  // Returns the angle to the given point. If this and other are considered
  // equal, then the `someAngle` is returned, which by defalt is zero.
  angleToPoint(other, someAngle = this.rac.Angle.zero) {
    if (this.equals(other)) {
      const angle = this.rac.Angle.from(someAngle);
      return angle;
    }
    const offset = other.subtractPoint(this);
    const radians = Math.atan2(offset.y, offset.x);
    return Rac.Angle.fromRadians(this.rac, radians);
  }


  pointToAngle(someAngle, distance) {
    let angle = this.rac.Angle.from(someAngle);
    let distanceX = distance * Math.cos(angle.radians());
    let distanceY = distance * Math.sin(angle.radians());
    return new Point(this.rac, this.x + distanceX, this.y + distanceY);
  }


  ray(someAngle) {
    const angle = this.rac.Angle.from(someAngle);
    return new Rac.Ray(this.rac, this, angle);
  }

  rayToPoint(point, someAngle = this.rac.Angle.zero) {
    const angle = this.angleToPoint(point, someAngle);
    return new Rac.Ray(this.rac, this, angle);
  }

  /**
  * Returns a `Ray` from `this` to the point projected in `ray`. If the
  * projected point is equal to `this` the produced ray will have an angle
  * clockwise-perpendicular to `ray`.
  *
  * @param {Rac.Ray} ray
  * @returns {Rac.Point}
  */
  rayToProjectionInRay(ray) {
    const projected = ray.pointProjected(this);
    const perpendicular = ray.angle.perpendicular();
    return this.rayToPoint(projected, perpendicular);
  }


  // TODO: rayTangentToArc


  segmentToAngle(someAngle, length) {
    const angle = this.rac.Angle.from(someAngle);
    const ray = new Rac.Ray(this.rac, this, angle);
    return new Rac.Segment(this.rac, ray, length);
  }

  segmentToPoint(point, someAngle = this.rac.Angle.zero) {
    const angle = this.angleToPoint(point, someAngle);
    const length = this.distanceToPoint(point);
    const ray = new Rac.Ray(this.rac, this, angle);
    return new Rac.Segment(this.rac, ray, length);
  }

  // Returns a segment from this to the point projected in ray
  segmentToProjectionInRay(ray) {
    const projected = ray.pointProjected(this);
    const perpendicular = ray.angle.perpendicular();
    return this.segmentToPoint(projected, perpendicular);
  }


  /**
  * Returns a new `Segment` that is tangent to `arc` in the `clockwise`
  * orientation from the ray formed by `this` and `arc.center`. Returns
  * `null` if `this` is inside `arc` and thus no tangent segment is
  * possible.
  * The returned `Segment` starts at `this` and ends at the contact point
  * with `arc` which is considered as a complete circle.
  *
  * TODO: what happens if the point touches the circle?
  * TODO: what happens if the arc radius is zero and this is equal to center?
  *
  * @param {Rac.Arc} arc
  * @param {boolean=} clockwise=true
  * @return {Rac.Segment}
  */
  segmentTangentToArc(arc, clockwise = true) {
    // Default angle is given for the edge case of a zero-radius arc
    let hypotenuse = this.segmentToPoint(arc.center, arc.start.inverse());
    let ops = arc.radius;

    if (this.rac.equals(hypotenuse.length, arc.radius)) {
      // Point in arc
      const perpendicular = hypotenuse.ray.angle.perpendicular(clockwise);
      return this.segmentToAngle(perpendicular, 0);
    }

    let angleSine = ops / hypotenuse.length;
    if (angleSine > 1) {
      // Point inside arc
      return null;
    }

    let angleRadians = Math.asin(angleSine);
    let opsAngle = Rac.Angle.fromRadians(this.rac, angleRadians);
    let shiftedOpsAngle = hypotenuse.angle().shift(opsAngle, clockwise);

    // TODO: splitting it to ray would actually save some calculations
    let end = arc.pointAtAngle(shiftedOpsAngle.perpendicular(clockwise));
    return this.segmentToPoint(end);
  }


  /**
  * Returns a new `Arc` with center at `this` and the given parameters.
  *
  * @param {number} radius
  * @param {Rac.Angle|number=} someStart=rac.Angle.zero
  * @param {?Rac.Angle|number=} someEnd
  * @param {boolean=} clockwise=true
  * @returns {Rac.Arc}
  */
  arc(
    radius,
    someStart = this.rac.Angle.zero,
    someEnd = null,
    clockwise = true)
  {
    const start = this.rac.Angle.from(someStart);
    const end = someEnd === null
      ? start
      : this.rac.Angle.from(someEnd);
    return new Rac.Arc(this.rac, this, radius, start, end, clockwise);
  }


  text(string, format) {
    return new Rac.Text(this.rac, this, string, format);
  }

} // class Point


module.exports = Point;


},{"../Rac":2,"../util/utils":34}],12:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Unbounded ray from a point in direction of an angle.
* @alias Rac.Ray
*/
class Ray {

  constructor(rac, start, angle) {
    utils.assertExists(rac, start, angle);
    this.rac = rac;
    this.start = start;
    this.angle = angle;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Ray((${this.start.x},${this.start.y}) a:${this.angle.turn})`;
  }


  /**
  * Returns the slope of the ray, or `null` if the ray is vertical.
  *
  * `slope` is `m` in the formula `y = mx + b`.
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
  * Returns the y-intercept (the point at which the ray, extended in both
  * directions, would intercept with the y-axis), or `null` if the ray is
  * vertical.
  *
  * `yIntercept` is `b` in the formula `y = mx + b`.
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


  withStart(newStart) {
    return new Ray(this.rac, newStart, this.angle);
  }

  withAngle(someAngle) {
    let newAngle = this.rac.Angle.from(someAngle);
    return new Ray(this.rac, this.start, newAngle);
  }

  withAngleAdd(someAngle) {
    let newAngle = this.angle.add(someAngle);
    let newEnd = this.start.pointToAngle(newAngle, this.length());
    return new Ray(this.rac, this.start, newEnd);
  }

  withAngleShift(someAngle, clockwise = true) {
    let newAngle = this.angle.shift(someAngle, clockwise);
    return new Ray(this.rac, this.start, newAngle);
  }

  withStartAtDistance(distance) {
    const newStart = this.start.pointToAngle(this.angle, distance);
    return new Ray(this.rac, newStart, this.angle);
  }

  inverse() {
    const inverseAngle = this.angle.inverse();
    return new Ray(this.rac, this.start, inverseAngle);
  }

  perpendicular(clockwise = true) {
    let perpendicular = this.angle.perpendicular(clockwise);
    return new Ray(this.rac, this.start, perpendicular);
  }


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


  pointAtDistance(distance) {
    return this.start.pointToAngle(this.angle, distance);
  }


  // Returns the intersecting point of `this` and `other`. Both rays are
  // considered lines without endpoints. Returns null if the rays are
  // parallel.
  pointAtIntersection(other) {
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const a = this.slope();
    const b = other.slope();
    // Parallel lines, no intersection
    if (a === null && b === null) { return null; }
    if (this.rac.unitaryEquals(a, b)) { return null; }

    const c = this.yIntercept();
    const d = other.yIntercept();


    if (a === null) { return other.pointAtX(this.start.x); }
    if (b === null) { return this.pointAtX(other.start.x); }

    const x = (d - c) / (a - b);
    const y = a * x + c;
    return new Rac.Point(this.rac, x, y);
  }


  pointProjected(point) {
    const perpendicular = this.angle.perpendicular();
    return point.ray(perpendicular)
      .pointAtIntersection(this);
  }


  // Returns the distance from `start` to the projection of `point` in the
  // ray.
  // The distance is positive if the projected point is in the direction
  // of the ray, and negative if it is behind.
  distanceToProjectedPoint(point) {
    const projected = this.pointProjected(point);
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

  // Returns `true` if the given point is located clockwise of the segment,
  // or `false` if located counter-clockwise.
  // pointOrientation(point) {
  //   let angle = this.start.angleToPoint(point);
  //   let angleDistance = angle.subtract(this.angle);
  //   // [0 to 0.5) is considered clockwise
  //   // [0.5, 1) is considered counter-clockwise
  //   return angleDistance.turn < 0.5;
  // }


  rayToPoint(point) {
    const newAngle = this.start.angleToPoint(point, this.angle);
    return new Ray(this.rac, this.start, newAngle);
  }


  segment(length) {
    return new Rac.Segment(this.rac, this, length);
  }


  segmentToPoint(point) {
    const newRay = this.rayToPoint(point);
    const length = this.start.distanceToPoint(point);
    return new Rac.Segment(this.rac, newRay, length);
  }


  // TODO: segmentToIntersectionWithRay

} // class Ray


module.exports = Ray;


// Ray.prototype.translateToAngle = function(someAngle, distance) {
//   let angle = rac.Angle.from(someAngle);
//   let offset = rac.Point.zero.pointToAngle(angle, distance);
//   return new Ray(this.rac, this.start.addPoint(offset), this.angle);
// };

// Ray.prototype.translateToDistance = function(distance) {
//   let offset = rac.Point.zero.pointToAngle(this.angle, distance);
//   return new Ray(this.rac, this.start.addPoint(offset), this.angle);
// };

// Ray.prototype.translatePerpendicular = function(distance, clockwise = true) {
//   let perpendicular = this.angle.perpendicular(clockwise);
//   return this.translateToAngle(perpendicular, distance);
// };



// Returns an complete circle Arc using this segment `start` as center,
// `length()` as radiusm, and `angle` as start and end angles.
// Ray.prototype.arc = function(radius, clockwise = true) {
//   return new Rac.Arc(this.rac,
//     this.start, radius,
//     this.angle, this.angle,
//     clockwise);
// };


// Returns an Arc using this segment `start` as center, `length()` as
// radius, starting from the `angle` to the arc distance of the given
// angle and orientation.
// Ray.prototype.arcWithAngleDistance = function(someAngleDistance, clockwise = true) {
//   let angleDistance = rac.Angle.from(someAngleDistance);
//   let arcStart = this.angle;
//   let arcEnd = arcStart.shift(angleDistance, clockwise);

//   return new Rac.Arc(this.rac,
//     this.start, this.length(),
//     arcStart, arcEnd,
//     clockwise);
// };

// Returns a segment from `this.start` to the intersection between `this`
// and `other`.
// Ray.prototype.segmentToIntersectionWithRay = function(ray) {
//   let end = this.pointAtIntersectionWithRay(ray.ray);
//   if (end === null) {
//     return null;
//   }
//   return new Ray(this.rac, this.start, end);
// };


},{"../Rac":2,"../util/utils":34}],13:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Segment of a ray up to a given length.
* @alias Rac.Segment
*/
class Segment {

  constructor(rac, ray, length) {
    // TODO: || throw new Error(err.missingParameters)
    // or
    // checker(msg => { throw Rac.Exception.failedAssert(msg));
    //   .exists(rac)
    //   .isType(Rac.Ray, ray)
    //   .isNumber(length)

    utils.assertExists(rac, ray, length);
    utils.assertType(Rac.Ray, ray);
    utils.assertNumber(length);
    this.rac = rac;
    this.ray = ray;
    this.length = length;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Segment((${this.ray.start.x},${this.ray.start.y}) a:${this.ray.angle.turn} l:${this.length})`;
  }

  angle() {
    return this.ray.angle;
  }

  startPoint() {
    return this.ray.start;
  }

  endPoint() {
    return this.ray.pointAtDistance(this.length);
  }

  // Returns the slope of the segment, or `null` if the segment is part of a
  // vertical line.
  slope() {
    return this.ray.slope();
  }

  // Returns the y-intercept, or `null` if the segment is part of a
  // vertical line.
  yIntercept() {
    return this.ray.yIntercept();
  }

  withRay(newRay) {
    return new Segment(this.rac, newRay, this.length);
  }

  withStartPoint(newStartPoint) {
    const newRay = this.ray.withStart(newStartPoint);
    return new Segment(this.rac, newRay, this.length);
  }

  withEndPoint(newEndPoint) {
    const newRay = this.ray.rayToPoint(newEndPoint);
    const newLength = this.ray.start.distanceToPoint(newEndPoint);
    return new Segment(this.rac, newRay, newLength);
  }

  withLength(newLength) {
    return new Segment(this.rac, this.ray, newLength);
  }


  withLengthAdd(addLength) {
    return new Segment(this.rac, this.ray, this.length + addLength);
  }


  // Returns a new segment from `start` to a length determined by
  // `ratio*length`.
  withLengthRatio(ratio) {
    return new Segment(this.rac, this.ray, this.length * ratio);
  }


  withAngleAdd(someAngle) {
    const newRay = this.ray.withAngleAdd(someAngle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  withAngleShift(someAngle, clockwise = true) {
    const newRay = this.ray.withAngleShift(someAngle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  withStartExtended(length) {
    const newRay = this.ray.withStartAtDistance(-length);
    return new Segment(this.rac, newRay, this.length + length);
  }


  // Returns a new segment from `this.start`, with the same length, that is
  // perpendicular to `this` in the `clockwise` orientation.
  // TODO: needs update
  // withPerpendicularAngle(clockwise = true) {
  //   return this.withAngleShift(this.rac.Angle.square, clockwise);
  // }


  reverse() {
    const end = this.endPoint();
    const inverseRay = new Rac.Ray(this.rac, end, this.ray.angle.inverse());
    return new Segment(this.rac, inverseRay, this.length);
  }


  pointAtX(x) {
    return this.ray.pointAtX(x);
  }


  pointAtLength(length) {
    return this.start.pointToAngle(this.angle(), length);
  }


  pointAtLengthRatio(lengthRatio) {
    let newLength = this.length() * lengthRatio;
    return this.start.pointToAngle(this.angle(), newLength);
  }


  // Returns the intersecting point of `this` and the ray `other`. Both are
  // considered lines without endpoints. Returns null if the lines are
  // parallel.
  pointAtIntersectionWithRay(other) {
    return this.ray.pointAtIntersection(other);
  }


  // TODO: implement moveStartPoint, which retains the position of endPoint


  translateToCoordinates(x, y) {
    const newStart = new Rac.Point(this.rac, x, y);
    return this.withStartPoint(newStart);
  }


  translateToAngle(someAngle, distance) {
    const angle = this.rac.Angle.from(someAngle);
    const newStart = this.ray.start.pointToAngle(angle, distance);
    return this.withStartPoint(newStart);
  }


  translateToLength(distance) {
    const newStart = this.ray.pointAtDistance(distance);
    return this.withStartPoint(newStart);
  }

  translatePerpendicular(distance, clockwise = true) {
    let perpendicular = this.ray.angle.perpendicular(clockwise);
    const newStart = this.ray.start.pointToAngle(perpendicular, distance);
    return this.withStartPoint(newStart);
  }


  // Returns a new segment from `end` with the given `length` with the same
  // angle as `this`.
  // TODO: needs update
  // nextSegmentWithLength(length) {
  //   return this.end.segmentToAngle(this.angle(), length);
  // }

  // Returns a new segment from `end` to the given `nextEnd`.
  nextSegmentToPoint(nextEnd) {
    const newStart = this.endPoint();
    return newStart.segmentToPoint(nextEnd, this.ray.angle);
  }

  // Returns a new segment from `end` to the given `someAngle` and `distance`.
  // TODO: needs update
  // nextSegmentToAngle(someAngle, distance) {
  //   return this.end.segmentToAngle(someAngle, distance);
  // }

  // Returns a new segment from `endPoint()`, with an angle shifted from
  // `angle().inverse()` in the `clockwise` orientation.
  //
  // This means that with an angle shift of `0` the next segment will have
  // the inverse angle of `this`, as the angle shift increases the next
  // segment separates from `this`.
  nextSegmentToAngleShift(someAngle, clockwise = true, length = null) {
    const newLength = length === null ? this.length : length;
    const angle = this.rac.Angle.from(someAngle);
    const newRay = this.ray
      .withStartAtDistance(this.length)
      .inverse()
      .withAngleShift(angle, clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  // Returns a new segment from `this.end`, with the same length, that is
  // perpendicular to `angle().inverse()` in the `clockwise` orientation.
  nextSegmentPerpendicular(clockwise = true, length = null) {
    const newLength = length === null ? this.length : length;
    const newRay = this.ray
      .withStartAtDistance(this.length)
      .perpendicular(!clockwise);
    return new Segment(this.rac, newRay, newLength);
  }

  // Returns `value` clamped to the given insets from zero and the length
  // of the segment.
  // TODO: invalid range could return a value centered in the insets! more visually congruent
  // If the `start/endInset` values result in a contradictory range, the
  // returned value will comply with `startInset`.
  clampToLengthInsets(value, startInset = 0, endInset = 0) {
    let clamped = value;
    clamped = Math.min(clamped, this.length - endInset);
    // Comply at least with startInset
    clamped = Math.max(clamped, startInset);
    return clamped;
  }

  pointAtBisector() {
    return this.ray.pointAtDistance(this.length/2);
  }

  projectedPoint(point) {
    return this.ray.projectedPoint(point);
  }

  // Returns the length from `startPoint()` to the projection of `point` in
  // the segment.
  // The length is positive if the projected point is in the direction
  // of the segment ray, and negative if it is behind.
  lengthToProjectedPoint(point) {
    return this.ray.distanceToProjectedPoint(point);
  }

  // Returns `true` if the given point is located clockwise of the segment,
  // or `false` if located counter-clockwise.
  // TODO: needs update
  // pointOrientation(point) {
  //   let angle = this.start.angleToPoint(point);
  //   let angleDistance = angle.subtract(this.angle());
  //   // [0 to 0.5) is considered clockwise
  //   // [0.5, 1) is considered counter-clockwise
  //   return angleDistance.turn < 0.5;
  // }


  // Returns a new segment from `start` to `pointAtBisector`.
  segmentToBisector() {
    return new Segment(this.rac, this.ray, this.length/2);
  }


  // Returns a segment from `this.start` to the intersection between `this`
  // and `other`.
  segmentToIntersectionWithRay(ray) {
    let intersection = this.pointAtIntersectionWithRay(ray);
    if (intersection === null) {
      return null;
    }
    return this.ray.segmentToPoint(intersection);
  }


  // Returns an complete circle Arc using this segment `start` as center,
  // `length()` as radiusm, and `angle()` as start and end angles.
  // Returns an Arc using this segment `start` as center, `length()` as
  // radius, starting from the `angle()` to the given angle and orientation.
  arc(someAngleEnd = null, clockwise = true) {
    let angleEnd = someAngleEnd === null
      ? this.ray.angle
      :this.rac.Angle.from(someAngleEnd);
    return new Rac.Arc(this.rac,
      this.ray.start, this.length,
      this.ray.angle, angleEnd,
      clockwise);
  }

} // Segment


module.exports = Segment;


// Returns an Arc using this segment `start` as center, `length()` as
// radius, starting from the `angle()` to the arc distance of the given
// angle and orientation.
Segment.prototype.arcWithAngleDistance = function(someAngleDistance, clockwise = true) {
  let angleDistance = this.rac.Angle.from(someAngleDistance);
  let arcStart = this.angle();
  let arcEnd = arcStart.shift(angleDistance, clockwise);

  return new Rac.Arc(this.rac,
    this.start, this.length(),
    arcStart, arcEnd,
    clockwise);
};


Segment.prototype.oppositeWithHyp = function(hypotenuse, clockwise = true) {
  // cos = ady / hyp
  // acos can error if hypotenuse is smaller that length
  let radians = Math.acos(this.length() / hypotenuse);
  let angle = this.rac.Angle.fromRadians(radians);

  let hypSegment = this.reverse()
    .nextSegmentToAngleShift(angle, !clockwise, hypotenuse);
  return this.end.segmentToPoint(hypSegment.end);
};

// Returns a new segment that starts from `pointAtBisector` in the given
// `clockwise` orientation.
Segment.prototype.segmentFromBisector = function(length, clockwise = true) {
  let angle = clockwise
    ? this.angle().add(this.rac.Angle.square)
    : this.angle().add(this.rac.Angle.square.negative());
  return this.pointAtBisector().segmentToAngle(angle, length);
};

Segment.prototype.bezierCentralAnchor = function(distance, clockwise = true) {
  let bisector = this.segmentFromBisector(distance, clockwise);
  return new Rac.Bezier(this.rac,
    this.start, bisector.end,
    bisector.end, this.end);
};


},{"../Rac":2,"../util/utils":34}],14:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],15:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],16:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* The `rac.Angle` function contains methods and properties for convenience
* `{@link Rac.Angle}` objects with the current `rac` instance.
* @namespace rac.Angle
*/
module.exports = function attachRacAngle(rac) {

  /**
  * Returns an `Angle` produced with `something`. Calls
  * `{@link Rac.Angle.from}` using `this`.
  * @name from
  * @memberof rac.Angle#
  * @function
  */
  rac.Angle.from = function(something) {
    return Rac.Angle.from(rac, something);
  };

  /**
  * An `Angle` with turn `0`.
  * @name zero
  * @memberof rac.Angle#
  */
  rac.Angle.zero =    rac.Angle(0.0);
  rac.Angle.square =  rac.Angle(1/4);
  rac.Angle.inverse = rac.Angle(1/2);

  rac.Angle.half =    rac.Angle(1/2);
  rac.Angle.quarter = rac.Angle(1/4);
  rac.Angle.eighth =  rac.Angle(1/8);
  rac.Angle.neighth =  rac.Angle(-1/8);

  rac.Angle.e = rac.Angle(0/4);
  rac.Angle.s = rac.Angle(1/4);
  rac.Angle.w = rac.Angle(2/4);
  rac.Angle.n = rac.Angle(3/4);

  rac.Angle.east  = rac.Angle.e;
  rac.Angle.south = rac.Angle.s;
  rac.Angle.west  = rac.Angle.w;
  rac.Angle.north = rac.Angle.n;

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


},{"../Rac":2,"../util/utils":34}],17:[function(require,module,exports){
'use strict';


/**
* The `rac.Point` function contains methods and properties for convenience
* `{@link Rac.Point}` objects with the current `rac` instance.
* @namespace rac.Point
*/
module.exports = function attachRacPoint(rac) {

  /**
  * A `Point` at `(0, 0)`.
  * @name zero
  * @memberof rac.Point#
  */
  rac.Point.zero = rac.Point(0, 0);

  /**
  * A `Point` at `(0, 0)`.
  * @name origin
  * @memberof rac.Point#
  */
  rac.Point.origin = rac.Point.zero;

} // attachRacPoint


},{}],18:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `rac.Text` function contains methods and properties for convenience
* `{@link Rac.Text}` objects with the current `rac` instance.
* @namespace rac.Text
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


},{"../Rac":2}],19:[function(require,module,exports){


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


},{"./Rac":2}],20:[function(require,module,exports){
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

    Rac.Point.prototype.debugAngle = function(someAngle, drawsText = false) {
      let angle = rac.Angle.from(someAngle);
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


},{"../Rac":2,"../util/utils":34,"./Point.functions":21,"./Segment.functions":22,"./debug.functions":23,"./draw.functions":24}],21:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],22:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],23:[function(require,module,exports){
'use strict';

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


},{}],24:[function(require,module,exports){
'use strict';


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


},{}],25:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],26:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],27:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],28:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],29:[function(require,module,exports){
'use strict';


/**
* The `rac.Color` function contains methods and properties for convenience
* `{@link Rac.Color}` objects with the current `rac` instance.
* @namespace rac.Color
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


},{}],30:[function(require,module,exports){
'use strict';


/**
* The `rac.Fill` function contains methods and properties for convenience
* `{@link Rac.Fill}` objects with the current `rac` instance.
* @namespace rac.Fill
*/
module.exports = function attachRacFill(rac) {

  /**
  * A `Fill` without color. Removes the fill color when applied.
  * @name none
  * @memberof rac.Fill#
  */
  rac.Fill.none = rac.Fill(null);

} // attachRacFill


},{}],31:[function(require,module,exports){
'use strict';


/**
* The `rac.Stroke` function contains methods and properties for convenience
* `{@link Rac.Stroke}` objects with the current `rac` instance.
* @namespace rac.Stroke
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


},{}],32:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":34}],33:[function(require,module,exports){
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


},{}],34:[function(require,module,exports){
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
    if (item === null || item === undefined) {
      throw Rac.Exception.failedAssert(
        `Missing element at index ${index}`);
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
        `Element is unexpected type - element:${item} element-type:${typeName(item)} expected-name:${type.name}`);
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


},{"../Rac":2}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvU2VnbWVudENvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9yYWMuQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvcmFjLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL3JhYy5UZXh0LmpzIiwic3JjL21haW4uanMiLCJzcmMvcDVEcmF3ZXIvUDVEcmF3ZXIuanMiLCJzcmMvcDVEcmF3ZXIvUG9pbnQuZnVuY3Rpb25zLmpzIiwic3JjL3A1RHJhd2VyL1NlZ21lbnQuZnVuY3Rpb25zLmpzIiwic3JjL3A1RHJhd2VyL2RlYnVnLmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9kcmF3LmZ1bmN0aW9ucy5qcyIsInNyYy9zdHlsZS9Db2xvci5qcyIsInNyYy9zdHlsZS9GaWxsLmpzIiwic3JjL3N0eWxlL1N0cm9rZS5qcyIsInNyYy9zdHlsZS9TdHlsZS5qcyIsInNyYy9zdHlsZS9yYWMuQ29sb3IuanMiLCJzcmMvc3R5bGUvcmFjLkZpbGwuanMiLCJzcmMvc3R5bGUvcmFjLlN0cm9rZS5qcyIsInNyYy91dGlsL0Vhc2VGdW5jdGlvbi5qcyIsInNyYy91dGlsL0V4Y2VwdGlvbi5qcyIsInNyYy91dGlsL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4akJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlU3RyaWN0JztcblxuLy8gUnVsZXIgYW5kIENvbXBhc3MgLSB2ZXJzaW9uXG5tb2R1bGUuZXhwb3J0cyA9ICcwLjEwLjAtZGV2LTM0Mi1hZDU2MTdlJ1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLy8gUnVsZXIgYW5kIENvbXBhc3NcbmNvbnN0IHZlcnNpb24gPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJyk7XG5cblxuLyoqXG4qIFRoaXMgbmFtZXNwYWNlIGNvbnRhaW5zIGZ1bmN0aW9ucyBhdHRhY2hlZCB0byBhbiBpbnN0YW5jZSBvZlxuKiBge0BsaW5rIFJhY31gIHRoYXQgaW4gdHVybiBjb250YWluIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMuXG4qXG4qIERyYXdhYmxlIGFuZCByZWxhdGVkIG9iamVjdHMgcmVxdWlyZSBhIHJlZmVyZW5jZSB0byBhIGByYWNgIGluc3RhbmNlIGluXG4qIG9yZGVyIHRvIHBlcmZvcm0gZHJhd2luZyBvcGVyYXRpb25zLiBUaGVzZSBmdW5jdGlvbnMgY29udGFpbiBjb252ZW5pZW5jZVxuKiBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIHRoYXQgcHJvdmlkZSBvYmplY3RzIGFscmVhZHkgc2V0dXAgd2l0aCBhIGByYWNgXG4qIGluc3RhbmNlLlxuKiBAbmFtZXNwYWNlIHJhY1xuKi9cblxuXG4vKipcbiogUm9vdCBjbGFzcyBvZiBSQUMuIEFsbCBkcmF3YWJsZSwgc3R5bGUsIGNvbnRyb2wsIGFuZCBkcmF3ZXIgY2xhc3NlcyBhcmVcbiogY29udGFpbmVkIGluIHRoaXMgY2xhc3MuXG4qL1xuY2xhc3MgUmFjIHtcblxuICAvKipcbiAgKiBCdWlsZHMgYSBuZXcgaW5zdGFuY2Ugb2YgUmFjLiBUaGUgbmV3IGluc3RhbmNlIHdpbGwgbm90IGNvbnRhaW4gYSBgZHJhd2VyYC5cbiAgKiBJbiBvcmRlciB0byBlbmFibGUgZHJhd2luZyBvcGVyYXRpb25zIGNhbGwgYHNldHVwRHJhd2VyYCB3aXRoIGEgdmFsaWRcbiAgKiBvYmplY3QuXG4gICovXG4gIGNvbnN0cnVjdG9yICgpIHtcblxuICAgIC8qKlxuICAgICogVmVyc2lvbiBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMudmVyc2lvbn1gLlxuICAgICogQG5hbWUgdmVyc2lvblxuICAgICogQG1lbWJlcm9mIFJhYyNcbiAgICAqL1xuICAgIHV0aWxzLmFkZENvbnN0YW50KHRoaXMsICd2ZXJzaW9uJywgdmVyc2lvbik7XG5cblxuICAgIC8qKlxuICAgICogVmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkgYmV0d2VlbiB0d28gbnVtZXJpYyB2YWx1ZXMuIFVzZWQgZm9yXG4gICAgKiB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGJlIGludGVnZXJzLCBsaWtlIHNjcmVlbiBjb29yZGluYXRlcy4gVXNlZCBieVxuICAgICogYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICAgKlxuICAgICogV2hlbiBjaGVja2luZyBmb3IgZXF1YWxpdHkgYHhgIGlzIGVxdWFsIHRvIG5vbi1pbmNsdXNpdmVcbiAgICAqIGAoeC1lcXVhbGl0eVRocmVzaG9sZCwgeCtlcXVhbGl0eVRocmVzaG9sZClgOlxuICAgICogKyBgeGAgaXMgKipub3QgZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZGBcbiAgICAqICsgYHhgIGlzICoqZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZC8yYFxuICAgICpcbiAgICAqIER1ZSB0byBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gc29tZSBvcGVydGF0aW9uIGxpa2UgaW50ZXJzZWN0aW9uc1xuICAgICogY2FuIHJldHVybiBvZGQgb3Igb3NjaWxhdGluZyB2YWx1ZXMuIFRoaXMgdGhyZXNob2xkIGlzIHVzZWQgdG8gc25hcFxuICAgICogdmFsdWVzIHRvbyBjbG9zZSB0byBhIGxpbWl0LCBhcyB0byBwcmV2ZW50IG9zY2lsYXRpbmcgZWZlY3RzIGluXG4gICAgKiB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIFZhbHVlIGlzIGJhc2VkIG9uIDEvMTAwMCBvZiBhIHBvaW50LCB0aGUgbWluaW1hbCBwZXJjZXB0aWJsZSBkaXN0YW5jZVxuICAgICogdGhlIHVzZXIgY2FuIHNlZS5cbiAgICAqL1xuICAgIHRoaXMuZXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMTtcblxuXG5cbiAgICAvKipcbiAgICAqIFZhbHVlIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5IGJldHdlZW4gdHdvIHVuaXRhcnkgbnVtZXJpYyB2YWx1ZXMuXG4gICAgKiBVc2VkIGZvciB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGV4aXN0IGluIHRoZSBgWzAsIDFdYCByYW5nZSwgbGlrZVxuICAgICogYHtAbGluayBSYWMuQW5nbGUjdHVybn1gLiBVc2VkIGJ5IGB7QGxpbmsgUmFjI3VuaXRhcnlFcXVhbHN9YC5cbiAgICAqXG4gICAgKiBFcXVhbGl0eSBsb2dpYyBpcyB0aGUgc2FtZSBhcyBge0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH1gLlxuICAgICpcbiAgICAqIFZhbHVlIGlzIGJhc2VkIG9uIDEvMDAwIG9mIHRoZSB0dXJuIG9mIGFuIGFyYyBvZiByYWRpdXMgNTAwIGFuZFxuICAgICogbGVuZ2h0IG9mIDE6IGAxLyg1MDAqNi4yOCkvMTAwMGBcbiAgICAqL1xuICAgIHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkID0gMC4wMDAwMDAzO1xuXG4gICAgLyoqXG4gICAgKiBEcmF3ZXIgb2YgdGhlIGluc3RhbmNlLiBUaGlzIG9iamVjdCBoYW5kbGVzIHRoZSBkcmF3aW5nIG9mIGFueVxuICAgICogZHJhd2FibGUgb2JqZWN0LlxuICAgICovXG4gICAgdGhpcy5kcmF3ZXIgPSBudWxsO1xuXG4gICAgcmVxdWlyZSgnLi9zdHlsZS9yYWMuQ29sb3InKSh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL3JhYy5TdHJva2UnKSh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL3JhYy5GaWxsJykodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9yYWMuQW5nbGUnKSh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL3JhYy5Qb2ludCcpKHRoaXMpO1xuXG4gICAgLy8gRGVwZW5kcyBvbiByYWMuUG9pbnQgYW5kIHJhYy5BbmdsZSBiZWluZyBhbHJlYWR5IHNldHVwXG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9yYWMuVGV4dCcpKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZHJhd2VyIGZvciB0aGUgaW5zdGFuY2UuIEN1cnJlbnRseSBvbmx5IGEgcDUuanMgaW5zdGFuY2UgaXNcbiAgKiBzdXBwb3J0ZWQuXG4gICpcbiAgKiBUaGUgZHJhd2VyIHdpbGwgYWxzbyBwb3B1bGF0ZSBzb21lIGNsYXNzZXMgd2l0aCBwcm90b3R5cGUgZnVuY3Rpb25zXG4gICogcmVsZXZhbnQgdG8gdGhlIGRyYXdlci4gRm9yIHA1LmpzIHRoaXMgaW5jbHVkZSBgYXBwbHlgIGZ1bmN0aW9ucyBmb3JcbiAgKiBjb2xvcnMgYW5kIHN0eWxlIG9iamVjdCwgYW5kIGB2ZXJ0ZXhgIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgb2JqZWN0cy5cbiAgKi9cbiAgc2V0dXBEcmF3ZXIocDVJbnN0YW5jZSkge1xuICAgIHRoaXMuZHJhd2VyID0gbmV3IFJhYy5QNURyYXdlcih0aGlzLCBwNUluc3RhbmNlKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiBgYWAgYW5kIGBiYCBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAuXG4gICogQHBhcmFtIHtudW1iZXJ9IGEgRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge251bWJlcn0gYiBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgZXF1YWxzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGxldCBkaWZmID0gTWF0aC5hYnMoYS1iKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMuZXF1YWxpdHlUaHJlc2hvbGQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhYnNvbHV0ZSBkaXN0YW5jZSBiZXR3ZWVuIGBhYCBhbmQgYGJgIGlzXG4gICogdW5kZXIgYHtAbGluayBSYWMjdW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkfWAuXG4gICogQHBhcmFtIHtudW1iZXJ9IGEgRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge251bWJlcn0gYiBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgdW5pdGFyeUVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoYS1iKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYENvbG9yYCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgbW9yZSBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG4gICogbGlzdGVkIGluIGB7QGxpbmsgcmFjLkNvbG9yfWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gclxuICAqIEBwYXJhbSB7bnVtYmVyfSBnXG4gICogQHBhcmFtIHtudW1iZXJ9IGJcbiAgKiBAcGFyYW0ge251bWJlcj19IGFcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICBDb2xvcihyLCBnLCBiLCBhbHBoYSA9IDEpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5Db2xvcih0aGlzLCByLCBnLCBiLCBhbHBoYSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgU3Ryb2tlYCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgbW9yZSBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG4gICogbGlzdGVkIGluIGB7QGxpbmsgcmFjLlN0cm9rZX1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29sb3I9fSBjb2xvclxuICAqIEBwYXJhbSB7bnVtYmVyPX0gd2VpZ2h0XG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIFN0cm9rZShjb2xvciA9IG51bGwsIHdlaWdodCA9IDEpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHJva2UodGhpcywgY29sb3IsIHdlaWdodCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgRmlsbGAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIG1vcmUgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuICAqIGxpc3RlZCBpbiBge0BsaW5rIHJhYy5GaWxsfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Db2xvcj19IGNvbG9yXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqL1xuICBGaWxsKGNvbG9yID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLkZpbGwodGhpcywgY29sb3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFN0eWxlYCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgbW9yZSBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG4gICogbGlzdGVkIGluIGB7QGxpbmsgcmFjLlN0eWxlfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TdHJva2U9fSBzdHJva2VcbiAgKiBAcGFyYW0ge1JhYy5GaWxsPX0gZmlsbFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGV9XG4gICovXG4gIFN0eWxlKHN0cm9rZSA9IG51bGwsIGZpbGwgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGUodGhpcywgc3Ryb2tlLCBmaWxsKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBBbmdsZWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIG1vcmUgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuICAqIGxpc3RlZCBpbiBge0BsaW5rIHJhYy5BbmdsZX1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBBbmdsZSh0dXJuKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuQW5nbGUodGhpcywgdHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgUG9pbnRgIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyBtb3JlIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcbiAgKiBsaXN0ZWQgaW4gYHtAbGluayByYWMuUG9pbnR9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBQb2ludCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgUmF5YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgbW9yZSBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG4gICogbGlzdGVkIGluIGB7QGxpbmsgcmFjLlJheX1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgUmF5KHgsIHksIHNvbWVBbmdsZSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBjb25zdCBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIHNvbWVBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFRoZSBgcmFjLlNlZ21lbnRgIGZ1bmN0aW9uLWNvbnRhaW5lciBob2xkcyBzZXZlcmFsIGNvbnZlbmllbmNlIG1ldGhvZHNcbiAgKiBhbmQgcHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYHtAbGluayBSYWMuU2VnbWVudH1gIG9iamVjdHMuXG4gICogQG5hbWVzcGFjZSByYWMuU2VnbWVudFxuICAqL1xuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgU2VnbWVudGAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIG1vcmUgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuICAqIGxpc3RlZCBpbiBge0BsaW5rIHJhYy5TZWdtZW50fWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBzb21lQW5nbGVcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBTZWdtZW50KHgsIHksIHNvbWVBbmdsZSwgbGVuZ3RoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIGNvbnN0IGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcywgc29tZUFuZ2xlKTtcbiAgICBjb25zdCByYXkgPSBuZXcgUmFjLlJheSh0aGlzLCBzdGFydCwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcywgcmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBUaGUgYHJhYy5BcmNgIGZ1bmN0aW9uLWNvbnRhaW5lciBob2xkcyBzZXZlcmFsIGNvbnZlbmllbmNlIG1ldGhvZHNcbiAgKiBhbmQgcHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYHtAbGluayBSYWMuQXJjfWAgb2JqZWN0cy5cbiAgKiBAbmFtZXNwYWNlIHJhYy5BcmNcbiAgKi9cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEFyY2AgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIG1vcmUgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuICAqIGxpc3RlZCBpbiBge0BsaW5rIHJhYy5BcmN9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IHNvbWVTdGFydFxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcj19IHNvbWVFbmQ9c29tZVN0YXJ0XG4gICogQHBhcmFtIHtib29sZWFuPX0gY2xvY2t3aXNlPXRydWVcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgQXJjKHgsIHksIHJhZGl1cywgc29tZVN0YXJ0ID0gdGhpcy5BbmdsZS56ZXJvLCBzb21lRW5kID0gc29tZVN0YXJ0LCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgY2VudGVyID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBjb25zdCBzdGFydCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIHNvbWVTdGFydCk7XG4gICAgY29uc3QgZW5kID0gUmFjLkFuZ2xlLmZyb20odGhpcywgc29tZUVuZCk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMsIGNlbnRlciwgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFRleHRgIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyBtb3JlIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcbiAgKiBsaXN0ZWQgaW4gYHtAbGluayByYWMuVGV4dH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgKiBAcGFyYW0ge1JhYy5UZXh0LkZvcm1hdH0gZm9ybWF0XG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICBUZXh0KHgsIHksIHN0cmluZywgZm9ybWF0KSB7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcywgcG9pbnQsIHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG59IC8vIGNsYXNzIFJhY1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmFjO1xuXG5cbi8vIEFsbCBjbGFzcyAoc3RhdGljKSBwcm9wZXJ0aWVzIHNob3VsZCBiZSBkZWZpbmVkIG91dHNpZGUgb2YgdGhlIGNsYXNzXG4vLyBhcyB0byBwcmV2ZW50IGN5Y2xpYyBkZXBlbmRlbmN5IHdpdGggUmFjLlxuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZShgLi91dGlsL3V0aWxzYCk7XG4vKipcbiogQ29udGFpbmVyIG9mIHV0aWxpdHkgZnVuY3Rpb25zLiBTZWUgYHtAbGluayB1dGlsc31gIGZvciB0aGUgYXZhaWxhYmxlXG4qIG1lbWJlcnMuXG4qL1xuUmFjLnV0aWxzID0gdXRpbHM7XG5cblxuLyoqXG4qIFZlcnNpb24gb2YgdGhlIGNsYXNzLlxuKiBAbmFtZSB2ZXJzaW9uXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudChSYWMsICd2ZXJzaW9uJywgdmVyc2lvbik7XG5cblxuLyoqXG4qIFRhdSwgZXF1YWwgdG8gYE1hdGguUEkgKiAyYC5cbiogaHR0cHM6Ly90YXVkYXkuY29tL3RhdS1tYW5pZmVzdG9cbiogQG5hbWUgVEFVXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudChSYWMsICdUQVUnLCBNYXRoLlBJICogMik7XG5cblxuLy8gRXhjZXB0aW9uXG5SYWMuRXhjZXB0aW9uID0gcmVxdWlyZSgnLi91dGlsL0V4Y2VwdGlvbicpO1xuXG5cbi8vIFByb3RvdHlwZSBmdW5jdGlvbnNcbnJlcXVpcmUoJy4vYXR0YWNoUHJvdG9GdW5jdGlvbnMnKShSYWMpO1xuXG5cbi8vIFA1RHJhd2VyXG5SYWMuUDVEcmF3ZXIgPSByZXF1aXJlKCcuL3A1RHJhd2VyL1A1RHJhd2VyJyk7XG5cblxuLy8gQ29sb3JcblJhYy5Db2xvciA9IHJlcXVpcmUoJy4vc3R5bGUvQ29sb3InKTtcblxuXG4vLyBTdHJva2VcblJhYy5TdHJva2UgPSByZXF1aXJlKCcuL3N0eWxlL1N0cm9rZScpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuU3Ryb2tlKTtcblxuXG4vLyBGaWxsXG5SYWMuRmlsbCA9IHJlcXVpcmUoJy4vc3R5bGUvRmlsbCcpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuRmlsbCk7XG5cblxuLy8gU3R5bGVcblJhYy5TdHlsZSA9IHJlcXVpcmUoJy4vc3R5bGUvU3R5bGUnKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLlN0eWxlKTtcblxuXG4vLyBBbmdsZVxuUmFjLkFuZ2xlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9BbmdsZScpO1xuXG5cbi8vIFBvaW50XG5SYWMuUG9pbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1BvaW50Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5Qb2ludCk7XG5cblxuLy8gUmF5XG5SYWMuUmF5ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9SYXknKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlJheSk7XG5cblxuLy8gU2VnbWVudFxuUmFjLlNlZ21lbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1NlZ21lbnQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlNlZ21lbnQpO1xuXG5cbi8vIEFyY1xuUmFjLkFyYyA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQXJjJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5BcmMpO1xuXG5cbi8vIFRleHRcblJhYy5UZXh0ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9UZXh0Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5UZXh0KTtcblxuXG4vLyBCZXppZXJcblJhYy5CZXppZXIgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0JlemllcicpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQmV6aWVyKTtcblxuXG4vLyBDb21wb3NpdGVcblJhYy5Db21wb3NpdGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0NvbXBvc2l0ZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQ29tcG9zaXRlKTtcblxuXG4vLyBTaGFwZVxuUmFjLlNoYXBlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9TaGFwZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuU2hhcGUpO1xuXG5cbi8vIEVhc2VGdW5jdGlvblxuUmFjLkVhc2VGdW5jdGlvbiA9IHJlcXVpcmUoJy4vdXRpbC9FYXNlRnVuY3Rpb24nKTtcblxuXG4vLyBDb250cm9sXG5SYWMuQ29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9Db250cm9sJyk7XG5cblxuLy8gU2VnbWVudENvbnRyb2xcblJhYy5TZWdtZW50Q29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9TZWdtZW50Q29udHJvbCcpO1xuXG5cbi8vIEFyY0NvbnRyb2xcblJhYy5BcmNDb250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL0FyY0NvbnRyb2wnKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gQXR0YWNoZXMgZnVuY3Rpb25zIHRvIGF0dGFjaCBkcmF3aW5nIGFuZCBhcHBseSBtZXRob2RzIHRvIG90aGVyXG4vLyBwcm90b3R5cGVzLlxuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgUmFjIGNsYXNzIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUHJvdG9GdW5jdGlvbnMoUmFjKSB7XG5cbiAgZnVuY3Rpb24gYXNzZXJ0RHJhd2VyKGRyYXdhYmxlKSB7XG4gICAgaWYgKGRyYXdhYmxlLnJhYyA9PSBudWxsIHx8IGRyYXdhYmxlLnJhYy5kcmF3ZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5kcmF3ZXJOb3RTZXR1cChcbiAgICAgICAgYGRyYXdhYmxlLXR5cGU6JHt1dGlscy50eXBlTmFtZShkcmF3YWJsZSl9YCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgY2xhc3Nlcy5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBkcmF3YWJsZSBvYmplY3RzIChFLmcuIGBkcmF3KClgIGFuZCBgZGVidWcoKWApLlxuICBSYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBPYmplY3Qua2V5cyhSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNsYXNzT2JqLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5kcmF3ID0gZnVuY3Rpb24oc3R5bGUgPSBudWxsKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmRyYXdPYmplY3QodGhpcywgc3R5bGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZGVidWcgPSBmdW5jdGlvbihkcmF3c1RleHQgPSBmYWxzZSl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuXG4gICAgdGhpcy5yYWMuZHJhd2VyLmRlYnVnT2JqZWN0KHRoaXMsIGRyYXdzVGV4dCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5sb2cgPSBmdW5jdGlvbihtZXNzYWdlID0gbnVsbCl7XG4gICAgbGV0IGNvYWxlc2NlZE1lc3NhZ2UgPSBtZXNzYWdlID8/ICclbyc7XG4gICAgY29uc29sZS5sb2coY29hbGVzY2VkTWVzc2FnZSwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvLyBUT0RPOiBoYXMgdG8gYmUgbW92ZWQgdG8gcmFjIGluc3RhbmNlXG4gIFJhYy5zdGFjayA9IFtdO1xuXG4gIFJhYy5zdGFjay5wZWVrID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFJhYy5zdGFja1tSYWMuc3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wdXNoID0gZnVuY3Rpb24oKSB7XG4gICAgUmFjLnN0YWNrLnB1c2godGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3AgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUmFjLnN0YWNrLnBvcCgpO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucGVlayA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBSYWMuc3RhY2sucGVlaygpO1xuICB9XG5cbiAgLy8gVE9ETzogc2hhcGUgYW5kIGNvbXBvc2l0ZSBzaG91bGQgYmUgc3RhY2tzLCBzbyB0aGF0IHNldmVyYWwgY2FuIGJlXG4gIC8vIHN0YXJ0ZWQgaW4gZGlmZmVyZW50IGNvbnRleHRzXG4gIC8vIFRPRE86IGhhcyB0byBiZSBtb3ZlZCB0byByYWMgaW5zdGFuY2VcbiAgUmFjLmN1cnJlbnRTaGFwZSA9IG51bGw7XG4gIFJhYy5jdXJyZW50Q29tcG9zaXRlID0gbnVsbDtcblxuICBSYWMucG9wU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2hhcGUgPSBSYWMuY3VycmVudFNoYXBlO1xuICAgIFJhYy5jdXJyZW50U2hhcGUgPSBudWxsO1xuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuXG4gIFJhYy5wb3BDb21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgY29tcG9zaXRlID0gUmFjLmN1cnJlbnRDb21wb3NpdGU7XG4gICAgUmFjLmN1cnJlbnRDb21wb3NpdGUgPSBudWxsO1xuICAgIHJldHVybiBjb21wb3NpdGU7XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUb1NoYXBlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFJhYy5jdXJyZW50U2hhcGUgPT09IG51bGwpIHtcbiAgICAgIFJhYy5jdXJyZW50U2hhcGUgPSBuZXcgUmFjLlNoYXBlKHRoaXMucmFjKTtcbiAgICB9XG5cbiAgICB0aGlzLmF0dGFjaFRvKFJhYy5jdXJyZW50U2hhcGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUmFjLnBvcFNoYXBlKCk7XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZVRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNoYXBlID0gUmFjLnBvcFNoYXBlKCk7XG4gICAgc2hhcGUuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFJhYy5jdXJyZW50Q29tcG9zaXRlID09PSBudWxsKSB7XG4gICAgICBSYWMuY3VycmVudENvbXBvc2l0ZSA9IG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjKTtcbiAgICB9XG5cbiAgICB0aGlzLmF0dGFjaFRvKFJhYy5jdXJyZW50Q29tcG9zaXRlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBvcENvbXBvc2l0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBSYWMucG9wQ29tcG9zaXRlKCk7XG4gIH1cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUbyA9IGZ1bmN0aW9uKHNvbWVDb21wb3NpdGUpIHtcbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5Db21wb3NpdGUpIHtcbiAgICAgIHNvbWVDb21wb3NpdGUuYWRkKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHNvbWVDb21wb3NpdGUgaW5zdGFuY2VvZiBSYWMuU2hhcGUpIHtcbiAgICAgIHNvbWVDb21wb3NpdGUuYWRkT3V0bGluZSh0aGlzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGF0dGFjaFRvIGNvbXBvc2l0ZSAtIHNvbWVDb21wb3NpdGUtdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWVDb21wb3NpdGUpfWApO1xuICB9O1xuXG5cbiAgLy8gQ29udGFpbmVyIG9mIHByb3RvdHlwZSBmdW5jdGlvbnMgZm9yIHN0eWxlIGNsYXNzZXMuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zID0ge307XG5cbiAgLy8gQWRkcyB0byB0aGUgZ2l2ZW4gY2xhc3MgcHJvdG90eXBlIGFsbCB0aGUgZnVuY3Rpb25zIGNvbnRhaW5lZCBpblxuICAvLyBgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNgLiBUaGVzZSBhcmUgZnVuY3Rpb25zIHNoYXJlZCBieSBhbGxcbiAgLy8gc3R5bGUgb2JqZWN0cyAoRS5nLiBgYXBwbHkoKWApLlxuICBSYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBPYmplY3Qua2V5cyhSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNsYXNzT2JqLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucy5hcHBseSA9IGZ1bmN0aW9uKCl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5hcHBseU9iamVjdCh0aGlzKTtcbiAgfTtcblxufSAvLyBhdHRhY2hQcm90b0Z1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250cm9sIHRoYXQgdXNlcyBhbiBBcmMgYXMgYW5jaG9yLlxuKiBAYWxpYXMgUmFjLkFyY0NvbnRyb2xcbiovXG5jbGFzcyBBcmNDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8vIENyZWF0ZXMgYSBuZXcgQ29udHJvbCBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBgdmFsdWVgIGFuZCBhblxuICAvLyBgYW5nbGVEaXN0YW5jZWAgZnJvbSBgc29tZUFuZ2xlRGlzdGFuY2VgLlxuICAvLyBCeSBkZWZhdWx0IHRoZSB2YWx1ZSByYW5nZSBpcyBbMCwxXSBhbmQgbGltaXRzIGFyZSBzZXQgdG8gYmUgdGhlIGVxdWFsXG4gIC8vIGFzIGBzdGFydFZhbHVlYCBhbmQgYGVuZFZhbHVlYC5cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgc29tZUFuZ2xlRGlzdGFuY2UsIHN0YXJ0VmFsdWUgPSAwLCBlbmRWYWx1ZSA9IDEpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCB2YWx1ZSwgc29tZUFuZ2xlRGlzdGFuY2UsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIC8vIEFuZ2xlIGRpc3RhbmNlIGZvciB0aGUgY29waWVkIGFuY2hvciBvYmplY3QuXG4gICAgdGhpcy5hbmdsZURpc3RhbmNlID0gUmFjLkFuZ2xlLmZyb20ocmFjLCBzb21lQW5nbGVEaXN0YW5jZSk7XG5cbiAgICAvLyBgQXJjYGAgdG8gd2hpY2ggdGhlIGNvbnRyb2wgd2lsbCBiZSBhbmNob3JlZC4gV2hlbiB0aGUgY29udHJvbCBpc1xuICAgIC8vIGRyYXduIGFuZCBpbnRlcmFjdGVkIGEgY29weSBvZiB0aGUgYW5jaG9yIGlzIGNyZWF0ZWQgd2l0aCB0aGVcbiAgICAvLyBjb250cm9sJ3MgYGFuZ2xlRGlzdGFuY2VgLlxuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcbiAgfVxuXG4gIHNldFZhbHVlV2l0aEFuZ2xlRGlzdGFuY2Uoc29tZUFuZ2xlRGlzdGFuY2UpIHtcbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzb21lQW5nbGVEaXN0YW5jZSlcbiAgICBsZXQgYW5nbGVEaXN0YW5jZVJhdGlvID0gYW5nbGVEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZU9mKGFuZ2xlRGlzdGFuY2VSYXRpbyk7XG4gIH1cblxuICBzZXRMaW1pdHNXaXRoQW5nbGVEaXN0YW5jZUluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHRoaXMudmFsdWVPZihzdGFydEluc2V0LnR1cm4gLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKCh0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC0gZW5kSW5zZXQudHVybikgLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpKTtcbiAgfVxuXG4gIC8vIFRPRE86IHJlbmFtZSBjb250cm9sLmNlbnRlciB0byBjb250cm9sLmtub2Igb3Igc2ltaWxhclxuICAvLyBSZXR1cm5zIHRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIGBhbmNob3Iuc3RhcnRgIHRvIHRoZSBjb250cm9sIGNlbnRlci5cbiAgZGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMucmF0aW9WYWx1ZSgpKTtcbiAgfVxuXG4gIGNlbnRlcigpIHtcbiAgICAvLyBOb3QgcG9zaWJsZSB0byBjYWxjdWxhdGUgYSBjZW50ZXJcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aEFuZ2xlRGlzdGFuY2UodGhpcy5kaXN0YW5jZSgpKS5lbmRQb2ludCgpO1xuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgYGFuY2hvcmAgd2l0aCB0aGUgY29udHJvbCdzXG4gIC8vIGBhbmdsZURpc3RhbmNlYC5cbiAgY29weUFuY2hvcigpIHtcbiAgICAvLyBObyBhbmNob3IgdG8gY29weVxuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci53aXRoQW5nbGVEaXN0YW5jZSh0aGlzLmFuZ2xlRGlzdGFuY2UpO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICBsZXQgYW5jaG9yQ29weSA9IHRoaXMuY29weUFuY2hvcigpO1xuXG4gICAgbGV0IGFuY2hvclN0eWxlID0gdGhpcy5zdHlsZSAhPT0gbnVsbFxuICAgICAgPyB0aGlzLnN0eWxlLndpdGhGaWxsKHRoaXMucmFjLkZpbGwubm9uZSlcbiAgICAgIDogbnVsbDtcbiAgICBhbmNob3JDb3B5LmRyYXcoYW5jaG9yU3R5bGUpO1xuXG4gICAgbGV0IGNlbnRlciA9IHRoaXMuY2VudGVyKCk7XG4gICAgbGV0IGFuZ2xlID0gYW5jaG9yQ29weS5jZW50ZXIuYW5nbGVUb1BvaW50KGNlbnRlcik7XG5cbiAgICAvLyBWYWx1ZSBtYXJrZXJzXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBsZXQgbWFya2VyUmF0aW8gPSB0aGlzLnJhdGlvT2YoaXRlbSk7XG4gICAgICBpZiAobWFya2VyUmF0aW8gPCAwIHx8IG1hcmtlclJhdGlvID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlckFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZShtYXJrZXJSYXRpbyk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBhbmNob3JDb3B5LnNoaWZ0QW5nbGUobWFya2VyQW5nbGVEaXN0YW5jZSk7XG4gICAgICBsZXQgcG9pbnQgPSBhbmNob3JDb3B5LnBvaW50QXRBbmdsZShtYXJrZXJBbmdsZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIHBvaW50LCBtYXJrZXJBbmdsZS5wZXJwZW5kaWN1bGFyKCFhbmNob3JDb3B5LmNsb2Nrd2lzZSkpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLy8gQ29udHJvbCBidXR0b25cbiAgICBjZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IHJhdGlvVmFsdWUgPSB0aGlzLnJhdGlvVmFsdWUoKTtcblxuICAgIC8vIE5lZ2F0aXZlIGFycm93XG4gICAgaWYgKHJhdGlvVmFsdWUgPj0gdGhpcy5yYXRpb1N0YXJ0TGltaXQoKSArIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgbGV0IG5lZ0FuZ2xlID0gYW5nbGUucGVycGVuZGljdWxhcihhbmNob3JDb3B5LmNsb2Nrd2lzZSkuaW52ZXJzZSgpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGNlbnRlciwgbmVnQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aXZlIGFycm93XG4gICAgaWYgKHJhdGlvVmFsdWUgPD0gdGhpcy5yYXRpb0VuZExpbWl0KCkgLSB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIGxldCBwb3NBbmdsZSA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoYW5jaG9yQ29weS5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGNlbnRlciwgcG9zQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHRoaXMuc3R5bGUpO1xuXG4gICAgLy8gU2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBjZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cyAqIDEuNSkuZHJhdyhSYWMuQ29udHJvbC5wb2ludGVyU3R5bGUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJDb250cm9sQ2VudGVyLCBhbmNob3JDb3B5KSB7XG4gICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhbmNob3JDb3B5LmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnJhdGlvU3RhcnRMaW1pdCgpKTtcbiAgICBsZXQgZW5kSW5zZXQgPSBhbmdsZURpc3RhbmNlLm11bHRPbmUoMSAtIHRoaXMucmF0aW9FbmRMaW1pdCgpKTtcblxuICAgIGxldCBzZWxlY3Rpb25BbmdsZSA9IGFuY2hvckNvcHkuY2VudGVyXG4gICAgICAuYW5nbGVUb1BvaW50KHBvaW50ZXJDb250cm9sQ2VudGVyKTtcbiAgICBzZWxlY3Rpb25BbmdsZSA9IGFuY2hvckNvcHkuY2xhbXBUb0luc2V0cyhzZWxlY3Rpb25BbmdsZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBhbmNob3JDb3B5LmRpc3RhbmNlRnJvbVN0YXJ0KHNlbGVjdGlvbkFuZ2xlKTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbmV3RGlzdGFuY2UudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVPZihsZW5ndGhSYXRpbyk7XG4gIH1cblxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGFuY2hvckNvcHksIHBvaW50ZXJPZmZzZXQpIHtcbiAgICBhbmNob3JDb3B5LmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IGFuY2hvckNvcHkuYW5nbGVEaXN0YW5jZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IG1hcmtlclJhdGlvID0gdGhpcy5yYXRpb09mKGl0ZW0pO1xuICAgICAgaWYgKG1hcmtlclJhdGlvIDwgMCB8fCBtYXJrZXJSYXRpbyA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGFuY2hvckNvcHkuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUobWFya2VyUmF0aW8pKTtcbiAgICAgIGxldCBtYXJrZXJQb2ludCA9IGFuY2hvckNvcHkucG9pbnRBdEFuZ2xlKG1hcmtlckFuZ2xlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgbWFya2VyUG9pbnQsIG1hcmtlckFuZ2xlLnBlcnBlbmRpY3VsYXIoIWFuY2hvckNvcHkuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgbGV0IHJhdGlvU3RhcnRMaW1pdCA9IHRoaXMucmF0aW9TdGFydExpbWl0KCk7XG4gICAgaWYgKHJhdGlvU3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5BbmdsZSA9IGFuY2hvckNvcHkuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUocmF0aW9TdGFydExpbWl0KSk7XG4gICAgICBsZXQgbWluUG9pbnQgPSBhbmNob3JDb3B5LnBvaW50QXRBbmdsZShtaW5BbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtaW5BbmdsZS5wZXJwZW5kaWN1bGFyKGFuY2hvckNvcHkuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIG1hcmtlckFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBsZXQgcmF0aW9FbmRMaW1pdCA9IHRoaXMucmF0aW9FbmRMaW1pdCgpO1xuICAgIGlmIChyYXRpb0VuZExpbWl0IDwgMSkge1xuICAgICAgbGV0IG1heEFuZ2xlID0gYW5jaG9yQ29weS5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UubXVsdE9uZShyYXRpb0VuZExpbWl0KSk7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBhbmNob3JDb3B5LnBvaW50QXRBbmdsZShtYXhBbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtYXhBbmdsZS5wZXJwZW5kaWN1bGFyKCFhbmNob3JDb3B5LmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1heFBvaW50LCBtYXJrZXJBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlck9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgYXJjIGNvbnRyb2wgZHJhZ2dpbmcgdmlzdWFscyFcblxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KFJhYy5Db250cm9sLnBvaW50ZXJTdHlsZSk7XG4gIH1cblxufSAvLyBjbGFzcyBBcmNDb250cm9sXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmNDb250cm9sO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbmNsYXNzIENvbnRyb2xTZWxlY3Rpb257XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHBvaW50ZXJDZW50ZXIpIHtcbiAgICAvLyBTZWxlY3RlZCBjb250cm9sIGluc3RhbmNlLlxuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgLy8gQ29weSBvZiB0aGUgY29udHJvbCBhbmNob3IsIHNvIHRoYXQgdGhlIGNvbnRyb2wgY2FuIG1vdmUgdGllZCB0b1xuICAgIC8vIHRoZSBkcmF3aW5nLCB3aGlsZSB0aGUgaW50ZXJhY3Rpb24gcmFuZ2UgcmVtYWlucyBmaXhlZC5cbiAgICB0aGlzLmFuY2hvckNvcHkgPSBjb250cm9sLmNvcHlBbmNob3IoKTtcbiAgICAvLyBTZWdtZW50IGZyb20gdGhlIGNhcHR1cmVkIHBvaW50ZXIgcG9zaXRpb24gdG8gdGhlIGNvbnRybyBjZW50ZXIsXG4gICAgLy8gdXNlZCB0byBhdHRhY2ggdGhlIGNvbnRyb2wgdG8gdGhlIHBvaW50IHdoZXJlIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICAgLy8gUG9pbnRlciBpcyBhdCBgc2VnbWVudC5zdGFydGAgYW5kIGNvbnRyb2wgY2VudGVyIGlzIGF0IGBzZWdtZW50LmVuZGAuXG4gICAgdGhpcy5wb2ludGVyT2Zmc2V0ID0gcG9pbnRlckNlbnRlci5zZWdtZW50VG9Qb2ludChjb250cm9sLmNlbnRlcigpKTtcbiAgfVxuXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlcikge1xuICAgIHRoaXMuY29udHJvbC5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIHRoaXMuYW5jaG9yQ29weSwgdGhpcy5wb2ludGVyT2Zmc2V0KTtcbiAgfVxufVxuXG5cbi8qKlxuKiBQYXJlbnQgY2xhc3MgZm9yIGFsbCBjb250cm9scyBmb3IgbWFuaXB1bGF0aW5nIGEgdmFsdWUgd2l0aCB0aGUgcG9pbnRlci5cbiogUmVwcmVzZW50cyBhIGNvbnRyb2wgd2l0aCBhIHZhbHVlLCB2YWx1ZS1yYW5nZSwgbGltaXRzLCBtYXJrZXJzLCBhbmRcbiogZHJhd2luZyBzdHlsZS4gQnkgZGVmYXVsdCB0aGUgY29udHJvbCByZXR1cm5zIGEgYHZhbHVlYCBpbiB0aGUgcmFuZ2VcbiogWzAsMV0gY29yZXNwb25kaW5nIHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgY29udHJvbCBjZW50ZXIgaW4gcmVsYXRpb24gdG9cbiogdGhlIGFuY2hvciBzaGFwZS4gVGhlIHZhbHVlLXJhbmdlIGlzIGRlZmluZWQgYnkgYHN0YXJ0VmFsdWVgIGFuZFxuKiBgZW5kVmFsdWVgLlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xcbiovXG5cbmNsYXNzIENvbnRyb2wge1xuXG4gIC8vIFJhZGl1cyBvZiB0aGUgY2ljbGUgZHJhd24gZm9yIHRoZSBjb250cm9sIGNlbnRlci5cbiAgc3RhdGljIHJhZGl1cyA9IDIyO1xuXG4gIC8vIENvbGxlY3Rpb24gb2YgYWxsIGNvbnRyb2xzIHRoYXQgYXJlIGRyYXduIHdpdGggYGRyYXdDb250cm9scygpYFxuICAvLyBhbmQgZXZhbHVhdGVkIGZvciBzZWxlY3Rpb24gd2l0aCB0aGUgYHBvaW50ZXIuLi4oKWAgZnVuY3Rpb25zLlxuICBzdGF0aWMgY29udHJvbHMgPSBbXTtcblxuICAvLyBMYXN0IFBvaW50IG9mIHRoZSBwb2ludGVyIHBvc2l0aW9uIHdoZW4gaXQgd2FzIHByZXNzZWQsIG9yIGxhc3RcbiAgLy8gQ29udHJvbCBpbnRlcmFjdGVkIHdpdGguIFNldCB0byBgbnVsbGAgd2hlbiB0aGVyZSBoYXMgYmVlbiBub1xuICAvLyBpbnRlcmFjdGlvbiB5ZXQgYW5kIHdoaWxlIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbC5cbiAgc3RhdGljIGxhc3RQb2ludGVyID0gbnVsbDtcblxuICAvLyBTdHlsZSB1c2VkIGZvciB2aXN1YWwgZWxlbWVudHMgcmVsYXRlZCB0byBzZWxlY3Rpb24gYW5kIHBvaW50ZXJcbiAgLy8gaW50ZXJhY3Rpb24uXG4gIHN0YXRpYyBwb2ludGVyU3R5bGUgPSBudWxsO1xuXG4gIC8vIFNlbGVjdGlvbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLCBvciBgbnVsbGAgaWZcbiAgLy8gdGhlcmUgaXMgbm8gc2VsZWN0aW9uLlxuICBzdGF0aWMgc2VsZWN0aW9uID0gbnVsbDtcblxuXG4gIHN0YXRpYyBTZWxlY3Rpb24gPSBDb250cm9sU2VsZWN0aW9uO1xuXG5cbiAgLy8gQ3JlYXRlcyBhIG5ldyBDb250cm9sIGluc3RhbmNlIHdpdGggdGhlIGdpdmVuIGB2YWx1ZWAsIGEgZGVmYXVsdFxuICAvLyB2YWx1ZS1yYW5nZSBvZiBbMCwxXSwgYW5kIGxpbWl0cyBzZXQgZXF1YWwgdG8gdGhlIHZhbHVlLXJhbmdlLlxuICBjb25zdHJ1Y3RvcihyYWMsIHZhbHVlLCBzdGFydFZhbHVlID0gMCwgZW5kVmFsdWUgPSAxKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgdmFsdWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLy8gVmFsdWUgaXMgYSBudW1iZXIgYmV0d2VlbiBzdGFydFZhbHVlIGFuZCBlbmRWYWx1ZS5cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAvLyBTdGFydCBhbmQgZW5kIG9mIHRoZSB2YWx1ZSByYW5nZS5cbiAgICB0aGlzLnN0YXJ0VmFsdWUgPSBzdGFydFZhbHVlO1xuICAgIHRoaXMuZW5kVmFsdWUgPSBlbmRWYWx1ZTtcblxuICAgIC8vIExpbWl0cyB0byB3aGljaCB0aGUgY29udHJvbCBjYW4gYmUgZHJhZ2dlZC4gSW50ZXJwcmV0ZWQgYXMgdmFsdWVzIGluXG4gICAgLy8gdGhlIHZhbHVlLXJhbmdlLlxuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0VmFsdWU7XG4gICAgdGhpcy5lbmRMaW1pdCA9IGVuZFZhbHVlO1xuXG4gICAgLy8gQ29sbGVjdGlvbiBvZiB2YWx1ZXMgYXQgd2hpY2ggbWFya2VycyBhcmUgZHJhd24uXG4gICAgdGhpcy5tYXJrZXJzID0gW107XG5cbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGB2YWx1ZWAgb2YgdGhlIGNvbnRyb2wgaW4gYSBbMCwxXSByYW5nZS5cbiAgcmF0aW9WYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXRpb09mKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgYHN0YXJ0TGltaXRgIG9mIHRoZSBjb250cm9sIGluIGEgWzAsMV0gcmFuZ2UuXG4gIHJhdGlvU3RhcnRMaW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXRpb09mKHRoaXMuc3RhcnRMaW1pdCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBgZW5kTGltaXRgIG9mIHRoZSBjb250cm9sIGluIGEgWzAsMV0gcmFuZ2UuXG4gIHJhdGlvRW5kTGltaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF0aW9PZih0aGlzLmVuZExpbWl0KTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgb2YgdGhlIGdpdmVuIGB2YWx1ZWAgaW4gYSBbMCwxXSByYW5nZS5cbiAgcmF0aW9PZih2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgLSB0aGlzLnN0YXJ0VmFsdWUpIC8gdGhpcy52YWx1ZVJhbmdlKCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBlcXVpdmFsZW50IG9mIHRoZSBnaXZlbiByYXRpbyBpbiB0aGUgcmFuZ2UgWzAsMV0gdG8gYSB2YWx1ZVxuICAvLyBpbiB0aGUgdmFsdWUgcmFuZ2UuXG4gIHZhbHVlT2YocmF0aW8pIHtcbiAgICByZXR1cm4gKHJhdGlvICogdGhpcy52YWx1ZVJhbmdlKCkpICsgdGhpcy5zdGFydFZhbHVlO1xuICB9XG5cbiAgdmFsdWVSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmRWYWx1ZSAtIHRoaXMuc3RhcnRWYWx1ZTtcbiAgfVxuXG4gIC8vIFNldHMgYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdHdvIGluc2V0IHZhbHVlcyByZWxhdGl2ZSB0b1xuICAvLyBgc3RhcnRWYWx1ZWAgYW5kIGBlbmRWYWx1ZWAuXG4gIHNldExpbWl0c1dpdGhWYWx1ZUluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIGxldCByYW5nZURpcmVjdGlvbiA9IHRoaXMudmFsdWVSYW5nZSgpID49IDAgPyAxIDogLTE7XG5cbiAgICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnN0YXJ0VmFsdWUgKyAoc3RhcnRJbnNldCAqIHJhbmdlRGlyZWN0aW9uKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy5lbmRWYWx1ZSAtIChlbmRJbnNldCAqIHJhbmdlRGlyZWN0aW9uKTtcbiAgfVxuXG4gIC8vIFNldHMgYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdHdvIGluc2V0IHZhbHVlcyByZWxhdGl2ZSB0byB0aGVcbiAgLy8gWzAsMV0gcmFuZ2UuXG4gIHNldExpbWl0c1dpdGhSYXRpb0luc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHRoaXMudmFsdWVPZihzdGFydEluc2V0KTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKDEgLSBlbmRJbnNldCk7XG4gIH1cblxuICAvLyBBZGRzIGEgbWFya2VyIGF0IHRoZSBjdXJyZW50IGB2YWx1ZWAuXG4gIGFkZE1hcmtlckF0Q3VycmVudFZhbHVlKCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBjb250cm9sIGlzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY29udHJvbC5cbiAgaXNTZWxlY3RlZCgpIHtcbiAgICBpZiAoQ29udHJvbC5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIENvbnRyb2wuc2VsZWN0aW9uLmNvbnRyb2wgPT09IHRoaXM7XG4gIH1cblxuICAvLyBBYnN0cmFjdCBmdW5jdGlvbi5cbiAgLy8gUmV0dXJucyB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGhpdHBvaW50LlxuICBjZW50ZXIoKSB7XG4gICAgY29uc29sZS50cmFjZShgQWJzdHJhY3QgZnVuY3Rpb24gY2FsbGVkIC0gdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gICAgdGhyb3cgcmFjLkVycm9yLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQ7XG4gIH1cblxuICAvLyBBYnN0cmFjdCBmdW5jdGlvbi5cbiAgLy8gUmV0dXJucyB0aGUgcGVyc2lzdGVudCBjb3B5IG9mIHRoZSBjb250cm9sIGFuY2hvciB0byBiZSB1c2VkIGR1cmluZ1xuICAvLyB1c2VyIGludGVyYWN0aW9uLlxuICBjb3B5QW5jaG9yKCkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbiAgLy8gQWJzdHJhY3QgZnVuY3Rpb24uXG4gIC8vIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBjb250cm9sLlxuICBkcmF3KCkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbiAgLy8gQWJzdHJhY3QgZnVuY3Rpb24uXG4gIC8vIFVwZGF0ZXMgdGhlIGNvbnRyb2wgdmFsdWUgd2l0aCBgcG9pbnRlckNvbnRyb2xDZW50ZXJgIGluIHJlbGF0aW9uIHRvXG4gIC8vIGBhbmNob3JDb3B5YC4gQ2FsbGVkIGJ5IGBwb2ludGVyRHJhZ2dlZGAgYXMgdGhlIHVzZXIgaW50ZXJhY3RzIHdpdGggYVxuICAvLyBzZWxlY3RlZCBjb250cm9sLlxuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyQ29udHJvbENlbnRlciwgYW5jaG9yQ29weSkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbiAgLy8gQWJzdHJhY3QgZnVuY3Rpb24uXG4gIC8vIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgZm9yIHRoZSBjb250cm9sLCBhbG9uZyB3aXRoIHBvaW50ZXJcbiAgLy8gaW50ZXJhY3Rpb24gdmlzdWFscy4gQ2FsbGVkIGJ5IGBkcmF3Q29udHJvbHNgIGZvciB0aGUgY3VycmVudGx5XG4gIC8vIHNlbGVjdGVkIGNvbnRyb2wuXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgYW5jaG9yQ29weSwgcG9pbnRlck9mZnNldCkge1xuICAgIGNvbnNvbGUudHJhY2UoYEFic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCAtIHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbDtcblxuXG4vLyBDb250cm9scyBzaGFyZWQgZHJhd2luZyBlbGVtZW50c1xuXG5Db250cm9sLm1ha2VBcnJvd1NoYXBlID0gZnVuY3Rpb24ocmFjLCBjZW50ZXIsIGFuZ2xlKSB7XG4gIC8vIEFyY1xuICBsZXQgYW5nbGVEaXN0YW5jZSA9IHJhYy5BbmdsZS5mcm9tKDEvMjIpO1xuICBsZXQgYXJjID0gY2VudGVyLmFyYyhDb250cm9sLnJhZGl1cyAqIDEuNSxcbiAgICBhbmdsZS5zdWJ0cmFjdChhbmdsZURpc3RhbmNlKSwgYW5nbGUuYWRkKGFuZ2xlRGlzdGFuY2UpKTtcblxuICAvLyBBcnJvdyB3YWxsc1xuICBsZXQgcG9pbnRBbmdsZSA9IHJhYy5BbmdsZS5mcm9tKDEvOCk7XG4gIGxldCByaWdodFdhbGwgPSBhcmMuc3RhcnRQb2ludCgpLnJheShhbmdsZS5hZGQocG9pbnRBbmdsZSkpO1xuICBsZXQgbGVmdFdhbGwgPSBhcmMuZW5kUG9pbnQoKS5yYXkoYW5nbGUuc3VidHJhY3QocG9pbnRBbmdsZSkpO1xuXG4gIC8vIEFycm93IHBvaW50XG4gIGxldCBwb2ludCA9IHJpZ2h0V2FsbC5wb2ludEF0SW50ZXJzZWN0aW9uKGxlZnRXYWxsKTtcblxuICAvLyBTaGFwZVxuICBsZXQgYXJyb3cgPSBuZXcgUmFjLlNoYXBlKHJhYyk7XG4gIHBvaW50LnNlZ21lbnRUb1BvaW50KGFyYy5zdGFydFBvaW50KCkpXG4gICAgLmF0dGFjaFRvKGFycm93KTtcbiAgYXJjLmF0dGFjaFRvKGFycm93KVxuICAgIC5lbmRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHBvaW50KVxuICAgIC5hdHRhY2hUbyhhcnJvdyk7XG5cbiAgICByZXR1cm4gYXJyb3c7XG59O1xuXG5Db250cm9sLm1ha2VMaW1pdE1hcmtlciA9IGZ1bmN0aW9uKHJhYywgcG9pbnQsIHNvbWVBbmdsZSkge1xuICBsZXQgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICBsZXQgcGVycGVuZGljdWxhciA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoZmFsc2UpO1xuICBsZXQgY29tcG9zaXRlID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcblxuICBwb2ludC5zZWdtZW50VG9BbmdsZShwZXJwZW5kaWN1bGFyLCA0KVxuICAgIC53aXRoU3RhcnRFeHRlbmRlZCg0KVxuICAgIC5hdHRhY2hUbyhjb21wb3NpdGUpO1xuICBwb2ludC5wb2ludFRvQW5nbGUocGVycGVuZGljdWxhciwgOCkuYXJjKDMpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG5cbiAgcmV0dXJuIGNvbXBvc2l0ZTtcbn07XG5cbkNvbnRyb2wubWFrZVZhbHVlTWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgc29tZUFuZ2xlKSB7XG4gIGxldCBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKHNvbWVBbmdsZSk7XG4gIHJldHVybiBwb2ludC5zZWdtZW50VG9BbmdsZShhbmdsZS5wZXJwZW5kaWN1bGFyKCksIDMpXG4gICAgLndpdGhTdGFydEV4dGVuZGVkKDMpO1xufTtcblxuXG4vLyBDb250cm9sIHBvaW50ZXIgYW5kIGludGVyYWN0aW9uXG5cbi8vIENhbGwgdG8gc2lnbmFsIHRoZSBwb2ludGVyIGJlaW5nIHByZXNzZWQuIElmIHRoZSBwb250ZXIgaGl0cyBhIGNvbnRyb2xcbi8vIGl0IHdpbGwgYmUgY29uc2lkZXJlZCBzZWxlY3RlZC4gV2hlbiBhIGNvbnRyb2wgaXMgc2VsZWN0ZWQgYSBjb3B5IG9mIGl0c1xuLy8gYW5jaG9yIGlzIHN0b3JlZCBhcyB0byBhbGxvdyBpbnRlcmFjdGlvbiB3aXRoIGEgZml4ZWQgYW5jaG9yLlxuQ29udHJvbC5wb2ludGVyUHJlc3NlZCA9IGZ1bmN0aW9uKHJhYywgcG9pbnRlckNlbnRlcikge1xuICBDb250cm9sLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAvLyBUZXN0IHBvaW50ZXIgaGl0XG4gIGxldCBzZWxlY3RlZCA9IENvbnRyb2wuY29udHJvbHMuZmluZChpdGVtID0+IHtcbiAgICBsZXQgY29udHJvbENlbnRlciA9IGl0ZW0uY2VudGVyKCk7XG4gICAgaWYgKGNvbnRyb2xDZW50ZXIgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKGNvbnRyb2xDZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50ZXJDZW50ZXIpIDw9IENvbnRyb2wucmFkaXVzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICBpZiAoc2VsZWN0ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIENvbnRyb2wuc2VsZWN0aW9uID0gbmV3IENvbnRyb2wuU2VsZWN0aW9uKHNlbGVjdGVkLCBwb2ludGVyQ2VudGVyKTtcbn07XG5cblxuLy8gQ2FsbCB0byBzaWduYWwgdGhlIHBvaW50ZXIgYmVpbmcgZHJhZ2dlZC4gQXMgdGhlIHBvaW50ZXIgbW92ZXMgdGhlXG4vLyBzZWxlY3RlZCBjb250cm9sIGlzIHVwZGF0ZWQgd2l0aCBhIG5ldyBgZGlzdGFuY2VgLlxuQ29udHJvbC5wb2ludGVyRHJhZ2dlZCA9IGZ1bmN0aW9uKHJhYywgcG9pbnRlckNlbnRlcil7XG4gIGlmIChDb250cm9sLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBjb250cm9sID0gQ29udHJvbC5zZWxlY3Rpb24uY29udHJvbDtcbiAgbGV0IGFuY2hvckNvcHkgPSBDb250cm9sLnNlbGVjdGlvbi5hbmNob3JDb3B5O1xuXG4gIC8vIENlbnRlciBvZiBkcmFnZ2VkIGNvbnRyb2wgaW4gdGhlIHBvaW50ZXIgY3VycmVudCBwb3NpdGlvblxuICBsZXQgY3VycmVudFBvaW50ZXJDb250cm9sQ2VudGVyID0gQ29udHJvbC5zZWxlY3Rpb24ucG9pbnRlck9mZnNldFxuICAgIC53aXRoU3RhcnRQb2ludChwb2ludGVyQ2VudGVyKVxuICAgIC5lbmRQb2ludCgpO1xuXG4gIGNvbnRyb2wudXBkYXRlV2l0aFBvaW50ZXIoY3VycmVudFBvaW50ZXJDb250cm9sQ2VudGVyLCBhbmNob3JDb3B5KTtcbn07XG5cblxuLy8gQ2FsbCB0byBzaWduYWwgdGhlIHBvaW50ZXIgYmVpbmcgcmVsZWFzZWQuIFVwb24gcmVsZWFzZSB0aGUgc2VsZWN0ZWRcbi8vIGNvbnRyb2wgaXMgY2xlYXJlZC5cbkNvbnRyb2wucG9pbnRlclJlbGVhc2VkID0gZnVuY3Rpb24ocmFjLCBwb2ludGVyQ2VudGVyKSB7XG4gIGlmIChDb250cm9sLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgIENvbnRyb2wubGFzdFBvaW50ZXIgPSBwb2ludGVyQ2VudGVyO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIENvbnRyb2wubGFzdFBvaW50ZXIgPSBDb250cm9sLnNlbGVjdGlvbi5jb250cm9sO1xuICBDb250cm9sLnNlbGVjdGlvbiA9IG51bGw7XG59O1xuXG5cbi8vIERyYXdzIGNvbnRyb2xzIGFuZCB0aGUgdmlzdWFscyBvZiBwb2ludGVyIGFuZCBjb250cm9sIHNlbGVjdGlvbi4gVXN1YWxseVxuLy8gY2FsbGVkIGF0IHRoZSBlbmQgb2YgYGRyYXdgIHNvIHRoYXQgY29udHJvbHMgc2l0cyBvbiB0b3Agb2YgdGhlIGRyYXdpbmcuXG5Db250cm9sLmRyYXdDb250cm9scyA9IGZ1bmN0aW9uKHJhYykge1xuICBsZXQgcG9pbnRlclN0eWxlID0gQ29udHJvbC5wb2ludGVyU3R5bGU7XG5cbiAgLy8gTGFzdCBwb2ludGVyIG9yIGNvbnRyb2xcbiAgaWYgKENvbnRyb2wubGFzdFBvaW50ZXIgaW5zdGFuY2VvZiBSYWMuUG9pbnQpIHtcbiAgICBDb250cm9sLmxhc3RQb2ludGVyLmFyYygxMikuZHJhdyhwb2ludGVyU3R5bGUpO1xuICB9XG4gIGlmIChDb250cm9sLmxhc3RQb2ludGVyIGluc3RhbmNlb2YgQ29udHJvbCkge1xuICAgIC8vIFRPRE86IGltcGxlbWVudCBsYXN0IHNlbGVjdGVkIGNvbnRyb2wgc3RhdGVcbiAgfVxuXG4gIC8vIFBvaW50ZXIgcHJlc3NlZFxuICBsZXQgcG9pbnRlckNlbnRlciA9IHJhYy5Qb2ludC5wb2ludGVyKCk7XG4gIGlmIChyYWMuZHJhd2VyLnA1Lm1vdXNlSXNQcmVzc2VkKSB7XG4gICAgaWYgKENvbnRyb2wuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICBwb2ludGVyQ2VudGVyLmFyYygxMCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb2ludGVyQ2VudGVyLmFyYyg1KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWxsIGNvbnRyb2xzIGluIGRpc3BsYXlcbiAgQ29udHJvbC5jb250cm9scy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kcmF3KCkpO1xuXG4gIC8vIFJlc3QgaXMgQ29udHJvbCBzZWxlY3Rpb24gdmlzdWFsc1xuICBpZiAoQ29udHJvbC5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBDb250cm9sLnNlbGVjdGlvbi5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IHVzZXMgYSBTZWdtZW50IGFzIGFuY2hvci5cbiogQGFsaWFzIFJhYy5TZWdtZW50Q29udHJvbFxuKi9cbmNsYXNzIFNlZ21lbnRDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8vIENyZWF0ZXMgYSBuZXcgQ29udHJvbCBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBgdmFsdWVgIGFuZCBgbGVuZ3RoYC5cbiAgLy8gQnkgZGVmYXVsdCB0aGUgdmFsdWUgcmFuZ2UgaXMgWzAsMV0gYW5kIGxpbWl0cyBhcmUgc2V0IHRvIGJlIHRoZSBlcXVhbFxuICAvLyBhcyBgc3RhcnRWYWx1ZWAgYW5kIGBlbmRWYWx1ZWAuXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGxlbmd0aCwgc3RhcnRWYWx1ZSA9IDAsIGVuZFZhbHVlID0gMSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHZhbHVlLCBsZW5ndGgsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlKTtcblxuICAgIC8vIExlbmd0aCBmb3IgdGhlIGNvcGllZCBhbmNob3Igc2hhcGUuXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIFdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICAvLyBkcmF3biBhbmQgaW50ZXJhY3RlZCBhIGNvcHkgb2YgdGhlIGFuY2hvciBpcyBjcmVhdGVkIHdpdGggdGhlXG4gICAgLy8gY29udHJvbCdzIGBsZW5ndGhgLlxuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcbiAgfVxuXG4gIHNldFZhbHVlV2l0aExlbmd0aChsZW5ndGhWYWx1ZSkge1xuICAgIGxldCBsZW5ndGhSYXRpbyA9IGxlbmd0aFZhbHVlIC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVPZihsZW5ndGhSYXRpbyk7XG4gIH1cblxuICAvLyBTZXRzIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHR3byBpbnNldCB2YWx1ZXMgcmVsYXRpdmUgdG9cbiAgLy8gemVybyBhbmQgYGxlbmd0aGAuXG4gIHNldExpbWl0c1dpdGhMZW5ndGhJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldCAvIHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKCh0aGlzLmxlbmd0aCAtIGVuZEluc2V0KSAvIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLy8gUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgYW5jaG9yLnN0YXJ0YCB0byB0aGUgY29udHJvbCBjZW50ZXIuXG4gIGRpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCAqIHRoaXMucmF0aW9WYWx1ZSgpO1xuICB9XG5cbiAgY2VudGVyKCkge1xuICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSBhIGNlbnRlclxuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci53aXRoTGVuZ3RoKHRoaXMuZGlzdGFuY2UoKSkuZW5kUG9pbnQoKTtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGBhbmNob3JgIHdpdGggdGhlIGNvbnRyb2wgYGxlbmd0aGAuXG4gIGNvcHlBbmNob3IoKSB7XG4gICAgLy8gTm8gYW5jaG9yIHRvIGNvcHlcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aExlbmd0aCh0aGlzLmxlbmd0aCk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGxldCBhbmNob3JDb3B5ID0gdGhpcy5jb3B5QW5jaG9yKCk7XG4gICAgYW5jaG9yQ29weS5kcmF3KHRoaXMuc3R5bGUpO1xuXG4gICAgbGV0IGNlbnRlciA9IHRoaXMuY2VudGVyKCk7XG4gICAgbGV0IGFuZ2xlID0gYW5jaG9yQ29weS5hbmdsZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbGV0IG1hcmtlclJhdGlvID0gdGhpcy5yYXRpb09mKGl0ZW0pO1xuICAgICAgaWYgKG1hcmtlclJhdGlvIDwgMCB8fCBtYXJrZXJSYXRpbyA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBwb2ludCA9IGFuY2hvckNvcHkuc3RhcnQucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLmxlbmd0aCAqIG1hcmtlclJhdGlvKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgcG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wgYnV0dG9uXG4gICAgY2VudGVyLmFyYyhSYWMuQ29udHJvbC5yYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCByYXRpb1ZhbHVlID0gdGhpcy5yYXRpb1ZhbHVlKCk7XG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmIChyYXRpb1ZhbHVlID49IHRoaXMucmF0aW9TdGFydExpbWl0KCkgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBjZW50ZXIsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAocmF0aW9WYWx1ZSA8PSB0aGlzLnJhdGlvRW5kTGltaXQoKSAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGNlbnRlciwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIFJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHRoaXMuc3R5bGUpO1xuXG4gICAgLy8gU2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBjZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cyAqIDEuNSkuZHJhdyhSYWMuQ29udHJvbC5wb2ludGVyU3R5bGUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJDb250cm9sQ2VudGVyLCBhbmNob3JDb3B5KSB7XG4gICAgbGV0IGxlbmd0aCA9IGFuY2hvckNvcHkubGVuZ3RoO1xuICAgIGxldCBzdGFydEluc2V0ID0gbGVuZ3RoICogdGhpcy5yYXRpb1N0YXJ0TGltaXQoKTtcbiAgICBsZXQgZW5kSW5zZXQgPSBsZW5ndGggKiAoMSAtIHRoaXMucmF0aW9FbmRMaW1pdCgpKTtcblxuICAgIC8vIE5ldyB2YWx1ZSBmcm9tIHRoZSBjdXJyZW50IHBvaW50ZXIgcG9zaXRpb24sIHJlbGF0aXZlIHRvIGFuY2hvckNvcHlcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBhbmNob3JDb3B5XG4gICAgICAubGVuZ3RoVG9Qcm9qZWN0ZWRQb2ludChwb2ludGVyQ29udHJvbENlbnRlcik7XG4gICAgLy8gQ2xhbXBpbmcgdmFsdWUgKGphdmFzY3JpcHQgaGFzIG5vIE1hdGguY2xhbXApXG4gICAgbmV3RGlzdGFuY2UgPSBhbmNob3JDb3B5LmNsYW1wVG9MZW5ndGhJbnNldHMobmV3RGlzdGFuY2UsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG5cbiAgICAvLyBVcGRhdGUgY29udHJvbCB3aXRoIG5ldyBkaXN0YW5jZVxuICAgIGxldCBsZW5ndGhSYXRpbyA9IG5ld0Rpc3RhbmNlIC8gbGVuZ3RoO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlT2YobGVuZ3RoUmF0aW8pO1xuICB9XG5cbiAgZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyLCBhbmNob3JDb3B5LCBwb2ludGVyT2Zmc2V0KSB7XG4gICAgYW5jaG9yQ29weS5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IGFuZ2xlID0gYW5jaG9yQ29weS5hbmdsZSgpO1xuICAgIGxldCBsZW5ndGggPSBhbmNob3JDb3B5Lmxlbmd0aDtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGxldCBtYXJrZXJSYXRpbyA9IHRoaXMucmF0aW9PZihpdGVtKTtcbiAgICAgIGlmIChtYXJrZXJSYXRpbyA8IDAgfHwgbWFya2VyUmF0aW8gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyUG9pbnQgPSBhbmNob3JDb3B5LnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogbWFya2VyUmF0aW8pO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBtYXJrZXJQb2ludCwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gTGltaXQgbWFya2Vyc1xuICAgIGxldCByYXRpb1N0YXJ0TGltaXQgPSB0aGlzLnJhdGlvU3RhcnRMaW1pdCgpO1xuICAgIGlmIChyYXRpb1N0YXJ0TGltaXQgPiAwKSB7XG4gICAgICBsZXQgbWluUG9pbnQgPSBhbmNob3JDb3B5LnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogcmF0aW9TdGFydExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBsZXQgcmF0aW9FbmRMaW1pdCA9IHRoaXMucmF0aW9FbmRMaW1pdCgpO1xuICAgIGlmIChyYXRpb0VuZExpbWl0IDwgMSkge1xuICAgICAgbGV0IG1heFBvaW50ID0gYW5jaG9yQ29weS5zdGFydC5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHJhdGlvRW5kTGltaXQpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtYXhQb2ludCwgYW5nbGUuaW52ZXJzZSgpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBTZWdtZW50IGZyb20gcG9pbnRlciB0byBjb250cm9sIGRyYWdnZWQgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRDZW50ZXIgPSBwb2ludGVyT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBkcmFnZ2VkIGNlbnRlciwgYXR0YWNoZWQgdG8gcG9pbnRlclxuICAgIGRyYWdnZWRDZW50ZXIuYXJjKDIpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIENvbnN0cmFpbmVkIGxlbmd0aCBjbGFtcGVkIHRvIGxpbWl0c1xuICAgIGxldCBjb25zdHJhaW5lZExlbmd0aCA9IGFuY2hvckNvcHlcbiAgICAgIC5sZW5ndGhUb1Byb2plY3RlZFBvaW50KGRyYWdnZWRDZW50ZXIpO1xuICAgIGxldCBzdGFydEluc2V0ID0gbGVuZ3RoICogcmF0aW9TdGFydExpbWl0O1xuICAgIGxldCBlbmRJbnNldCA9IGxlbmd0aCAqICgxIC0gcmF0aW9FbmRMaW1pdCk7XG4gICAgY29uc3RyYWluZWRMZW5ndGggPSBhbmNob3JDb3B5LmNsYW1wVG9MZW5ndGhJbnNldHMoY29uc3RyYWluZWRMZW5ndGgsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG5cbiAgICBsZXQgY29uc3RyYWluZWRBbmNob3JDZW50ZXIgPSBhbmNob3JDb3B5XG4gICAgICAud2l0aExlbmd0aChjb25zdHJhaW5lZExlbmd0aClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBjZW50ZXIgY29uc3RyYWluZWQgdG8gYW5jaG9yXG4gICAgY29uc3RyYWluZWRBbmNob3JDZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRHJhZ2dlZCBzaGFkb3cgY2VudGVyLCBzZW1pIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICAvLyBhbHdheXMgcGVycGVuZGljdWxhciB0byBhbmNob3JcbiAgICBsZXQgZHJhZ2dlZFNoYWRvd0NlbnRlciA9IGRyYWdnZWRDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkoYW5jaG9yQ29weS5yYXkpXG4gICAgICAvLyByZXZlcnNlIGFuZCB0cmFuc2xhdGVkIHRvIGNvbnN0cmFpbnQgdG8gYW5jaG9yXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aFN0YXJ0UG9pbnQoY29uc3RyYWluZWRBbmNob3JDZW50ZXIpXG4gICAgICAvLyBTZWdtZW50IGZyb20gY29uc3RyYWluZWQgY2VudGVyIHRvIHNoYWRvdyBjZW50ZXJcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgc2hhZG93IGNlbnRlclxuICAgIGRyYWdnZWRTaGFkb3dDZW50ZXIuYXJjKFJhYy5Db250cm9sLnJhZGl1cyAvIDIpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIEVhc2UgZm9yIHNlZ21lbnQgdG8gZHJhZ2dlZCBzaGFkb3cgY2VudGVyXG4gICAgbGV0IGVhc2VPdXQgPSBSYWMuRWFzZUZ1bmN0aW9uLm1ha2VFYXNlT3V0KCk7XG4gICAgZWFzZU91dC5wb3N0QmVoYXZpb3IgPSBSYWMuRWFzZUZ1bmN0aW9uLkJlaGF2aW9yLmNsYW1wO1xuXG4gICAgLy8gVGFpbCB3aWxsIHN0b3Agc3RyZXRjaGluZyBhdCAyeCB0aGUgbWF4IHRhaWwgbGVuZ3RoXG4gICAgbGV0IG1heERyYWdnZWRUYWlsTGVuZ3RoID0gUmFjLkNvbnRyb2wucmFkaXVzICogNTtcbiAgICBlYXNlT3V0LmluUmFuZ2UgPSBtYXhEcmFnZ2VkVGFpbExlbmd0aCAqIDI7XG4gICAgZWFzZU91dC5vdXRSYW5nZSA9IG1heERyYWdnZWRUYWlsTGVuZ3RoO1xuXG4gICAgLy8gU2VnbWVudCB0byBkcmFnZ2VkIHNoYWRvdyBjZW50ZXJcbiAgICBsZXQgZHJhZ2dlZFRhaWwgPSBkcmFnZ2VkU2hhZG93Q2VudGVyXG4gICAgICAuc2VnbWVudFRvUG9pbnQoZHJhZ2dlZENlbnRlcik7XG5cbiAgICBsZXQgZWFzZWRMZW5ndGggPSBlYXNlT3V0LmVhc2VWYWx1ZShkcmFnZ2VkVGFpbC5sZW5ndGgpO1xuICAgIGRyYWdnZWRUYWlsLndpdGhMZW5ndGgoZWFzZWRMZW5ndGgpLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBEcmF3IGFsbCFcbiAgICBSYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhSYWMuQ29udHJvbC5wb2ludGVyU3R5bGUpO1xuICB9XG5cbn0gLy8gY2xhc3MgU2VnbWVudENvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlZ21lbnRDb250cm9sO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQW5nbGUgbWVhc3VyZWQgd2l0aCBhIGB0dXJuYCB2YWx1ZSBpbiB0aGUgYFswLDEpYCByYW5nZS5cbiogQGFsaWFzIFJhYy5BbmdsZVxuKi9cbmNsYXNzIEFuZ2xlIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHR1cm4pIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodHVybik7XG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5zZXRUdXJuKHR1cm4pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKiBAcGFyYW0ge251bWJlcj19IGRpZ2l0cyBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBhcHBlYXIgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgaWYgb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkLlxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgbGV0IHR1cm5TdHJpbmcgPSBkaWdpdHMgPT09IG51bGxcbiAgICAgID8gdGhpcy50dXJuLnRvU3RyaW5nKClcbiAgICAgIDogdGhpcy50dXJuLnRvRml4ZWQoZGlnaXRzKTtcbiAgICByZXR1cm4gYEFuZ2xlKCR7dHVyblN0cmluZ30pYDtcbiAgfVxuXG5cbiAgZXF1YWxzKHNvbWVBbmdsZSkge1xuICAgIGNvbnN0IG90aGVyID0gQW5nbGUuZnJvbSh0aGlzLnJhYywgc29tZUFuZ2xlKTtcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnModGhpcy50dXJuIC0gb3RoZXIudHVybik7XG4gICAgcmV0dXJuIGRpZmYgPCB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGRcbiAgICAgIC8vIEZvciBjbG9zZSB2YWx1ZXMgdGhhdCBsb29wIGFyb3VuZFxuICAgICAgfHwgKDEgLSBkaWZmKSA8IHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgc2V0VHVybih0dXJuKSB7XG4gICAgdGhpcy50dXJuID0gdHVybiAlIDE7XG4gICAgaWYgKHRoaXMudHVybiA8IDApIHtcbiAgICAgIHRoaXMudHVybiA9ICh0aGlzLnR1cm4gKyAxKSAlIDE7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn0gLy8gY2xhc3MgQW5nbGVcblxubW9kdWxlLmV4cG9ydHMgPSBBbmdsZTtcblxuLyoqXG4qIFJldHVybnMgYW4gYEFuZ2xlYCBwcm9kdWNlZCB3aXRoIGBzb21ldGhpbmdgLlxuKlxuKiArIElmIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBBbmdsZWAgdGhhdCBzYW1lIG9iamVjdCBpcyByZXR1cm5lZC5cbiogKyBJZiBgc29tZXRoaW5nYCBpcyBhIGBudW1iZXJgLCBpdCBpcyB1c2VkIGFzIGB0dXJuYCB2YWx1ZS5cbiogKyBJZiBgc29tZXRoaW5nYCBpcyBhIGB7QGxpbmsgUmFjLlNlZ21lbnR9YCwgcmV0dXJucyBpdHMgYW5nbGUuXG4qICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHtSYWN9IHJhYyBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuKiBAcGFyYW0ge251bWJlcnxSYWMuQW5nbGV8UmFjLlNlZ21lbnR9IHNvbWV0aGluZyBPYmplY3QgdG8gdXNlIHRvIHByb2R1Y2VcbiogYW4gYEFuZ2xlYC5cbiovXG5BbmdsZS5mcm9tID0gZnVuY3Rpb24ocmFjLCBzb21ldGhpbmcpIHtcbiAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5BbmdsZSkge1xuICAgIHJldHVybiBzb21ldGhpbmc7XG4gIH1cbiAgaWYgKHR5cGVvZiBzb21ldGhpbmcgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZShyYWMsIHNvbWV0aGluZyk7XG4gIH1cbiAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5TZWdtZW50KSB7XG4gICAgcmV0dXJuIHNvbWV0aGluZy5hbmdsZSgpO1xuICB9XG5cbiAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICBgQ2Fubm90IGRlcml2ZSBSYWMuQW5nbGUgLSBzb21ldGhpbmctdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWV0aGluZyl9YCk7XG59O1xuXG5cbkFuZ2xlLmZyb21SYWRpYW5zID0gZnVuY3Rpb24ocmFjLCByYWRpYW5zKSB7XG4gIHJldHVybiBuZXcgQW5nbGUocmFjLCByYWRpYW5zIC8gUmFjLlRBVSk7XG59O1xuXG5cbi8vIElmIGB0dXJuYGAgaXMgemVybyByZXR1cm5zIDEgaW5zdGVhZCwgb3RoZXJ3aXNlIHJldHVybnMgYHR1cm5gLlxuQW5nbGUucHJvdG90eXBlLnR1cm5PbmUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMudHVybiA9PT0gMCkgeyByZXR1cm4gMTsgfVxuICByZXR1cm4gdGhpcy50dXJuO1xufVxuXG5BbmdsZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oc29tZUFuZ2xlKSB7XG4gIGxldCBvdGhlciA9IHRoaXMucmFjLkFuZ2xlLmZyb20oc29tZUFuZ2xlKTtcbiAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuICsgb3RoZXIudHVybik7XG59O1xuXG5BbmdsZS5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbihzb21lQW5nbGUpIHtcbiAgbGV0IG90aGVyID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm4gLSBvdGhlci50dXJuKTtcbn07XG5cblxuLy8gUmV0dXJucyB0aGUgZXF1aXZhbGVudCB0byBgc29tZUFuZ2xlYCBzaGlmdGVkIHRvIGhhdmUgYHRoaXNgIGFzIHRoZVxuLy8gb3JpZ2luLCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4vL1xuLy8gRm9yIGFuZ2xlIGF0IGAwLjFgLCBgc2hpZnQoMC41KWAgd2lsbCByZXR1cm4gYSBgMC42YCBhbmdsZS5cbi8vIEZvciBhIGNsb2Nrd2lzZSBvcmllbnRhdGlvbiwgZXF1aXZhbGVudCB0byBgdGhpcyArIHNvbWVBbmdsZWAuXG5BbmdsZS5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbihzb21lQW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgbGV0IGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICByZXR1cm4gY2xvY2t3aXNlXG4gICAgPyB0aGlzLmFkZChhbmdsZSlcbiAgICA6IHRoaXMuc3VidHJhY3QoYW5nbGUpO1xufTtcblxuLy8gUmV0dXJucyB0aGUgZXF1aXZhbGVudCBvZiBgdGhpc2Agd2hlbiBgc29tZU9yaWdpbmAgaXMgY29uc2lkZXJlZCB0aGVcbi8vIG9yaWdpbiwgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuLy8gVE9ETzogYWRkIGV4YW1wbGUgYW5kIGRpZmZlcmVuY2UgdG8gc2hpZnRcbkFuZ2xlLnByb3RvdHlwZS5zaGlmdFRvT3JpZ2luID0gZnVuY3Rpb24oc29tZU9yaWdpbiwgY2xvY2t3aXNlKSB7XG4gIGxldCBvcmlnaW4gPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHNvbWVPcmlnaW4pO1xuICByZXR1cm4gb3JpZ2luLnNoaWZ0KHRoaXMsIGNsb2Nrd2lzZSk7XG59O1xuXG4vLyBSZXR1cm5zIGBmYWN0b3IgKiB0dXJuYC5cbkFuZ2xlLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24oZmFjdG9yKSB7XG4gIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiAqIGZhY3Rvcik7XG59O1xuXG4vLyBSZXR1cm5zIGBmYWN0b3IgKiB0dXJuT25lKClgLCB3aGVyZSBgdHVybmAgaXMgY29uc2lkZXJlZCBpbiB0aGVcbi8vIHJhbmdlICgwLCAxXS5cbi8vIFVzZWZ1bCB3aGVuIGRvaW5nIHJhdGlvIGNhbGN1bGF0aW9uIHdoZXJlIGEgemVybyBhbmdsZSBjb3JyZXNwb25kcyB0b1xuLy8gYSBjb21wbGV0ZS1jaXJjbGUgc2luY2U6XG4vLyBgYGBcbi8vIHJhYy5BbmdsZSgwKS5tdWx0KDAuNSkgLy8gcmV0dXJucyByYWMuQW5nbGUoMClcbi8vIC8vIHdoZXJlYXNcbi8vIHJhYy5BbmdsZSgwKS5tdWx0T25lKDAuNSkgLy8gcmV0dXJuIHJhYy5BbmdsZSgwLjUpXG4vLyBgYGBcbkFuZ2xlLnByb3RvdHlwZS5tdWx0T25lID0gZnVuY3Rpb24oZmFjdG9yKSB7XG4gIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybk9uZSgpICogZmFjdG9yKTtcbn07XG5cbi8vIFJldHVybnMgYHRoaXNgIGFkZGluZyBoYWxmIGEgdHVybi5cbkFuZ2xlLnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmFkZCh0aGlzLnJhYy5BbmdsZS5pbnZlcnNlKTtcbn07XG5cbkFuZ2xlLnByb3RvdHlwZS5uZWdhdGl2ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCAtdGhpcy50dXJuKTtcbn07XG5cbkFuZ2xlLnByb3RvdHlwZS5wZXJwZW5kaWN1bGFyID0gZnVuY3Rpb24oY2xvY2t3aXNlID0gdHJ1ZSkge1xuICByZXR1cm4gdGhpcy5zaGlmdCh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIGNsb2Nrd2lzZSk7XG59O1xuXG4vLyBSZXR1cm5zIGFuIEFuZ2xlIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gYHNvbWVBbmdsZWBcbi8vIHRyYXZlbGluZyBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG5BbmdsZS5wcm90b3R5cGUuZGlzdGFuY2UgPSBmdW5jdGlvbihzb21lQW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgbGV0IG90aGVyID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICBsZXQgZGlzdGFuY2UgPSBvdGhlci5zdWJ0cmFjdCh0aGlzKTtcbiAgcmV0dXJuIGNsb2Nrd2lzZVxuICAgID8gZGlzdGFuY2VcbiAgICA6IGRpc3RhbmNlLm5lZ2F0aXZlKCk7XG59O1xuXG5BbmdsZS5wcm90b3R5cGUucmFkaWFucyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50dXJuICogUmFjLlRBVTtcbn07XG5cbkFuZ2xlLnByb3RvdHlwZS5kZWdyZWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR1cm4gKiAzNjA7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQXJjIGZyb20gYSBzdGFydCBhbmdsZSB0byBhbiBlbmQgYW5nbGUuXG4qIEBhbGlhcyBSYWMuQXJjXG4qL1xuY2xhc3MgQXJje1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFyY2AgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IGNlbnRlclxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gc3RhcnRcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gZW5kXG4gICogQHBhcmFtIHtib29sZWFufSBjbG9ja3dpc2VcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLFxuICAgIGNlbnRlciwgcmFkaXVzLFxuICAgIHN0YXJ0LCBlbmQsXG4gICAgY2xvY2t3aXNlID0gdHJ1ZSlcbiAge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIGNlbnRlciwgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBjZW50ZXIpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihyYWRpdXMpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBzdGFydCwgZW5kKTtcbiAgICB1dGlscy5hc3NlcnRCb29sZWFuKGNsb2Nrd2lzZSk7XG5cbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICAvLyBTdGFydCBhbmdsZSBvZiB0aGUgYXJjLiBBcmMgd2lsbCBkcmF3IGZyb20gdGhpcyBhbmdsZSB0b3dhcmRzIGBlbmRgXG4gICAgLy8gaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0b24uXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG4gICAgLy8gRW5kIGFuZ2xlIG9mIHRoZSBhcmMuIEFyYyB3aWxsIGRyYXcgZnJvbSBgc3RhcnRgIHRvIHRoaXMgYW5nbGUgaW5cbiAgICAvLyB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRvbi5cbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAvLyBPcmllbnRhdGlvbiBvZiB0aGUgYXJjXG4gICAgdGhpcy5jbG9ja3dpc2UgPSBjbG9ja3dpc2U7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEFyYygoJHt0aGlzLmNlbnRlci54fSwke3RoaXMuY2VudGVyLnl9KSByOiR7dGhpcy5yYWRpdXN9IHM6JHt0aGlzLnN0YXJ0LnR1cm59IGU6JHt0aGlzLmVuZC50dXJufSBjOiR7dGhpcy5jbG9ja3dpc2V9fSlgO1xuICB9XG5cblxuICBlcXVhbHMob3RoZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyLmNlbnRlcilcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnJhZGl1cywgb3RoZXIucmFkaXVzKVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXIuc3RhcnQpXG4gICAgICAmJiB0aGlzLmVuZC5lcXVhbHMob3RoZXIuZW5kKVxuICAgICAgJiYgdGhpcy5jbG9ja3dpc2UgPT09IG90aGVyLmNsb2Nrd2lzZTtcbiAgfVxuXG5cbiAgcmV2ZXJzZSgpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuZW5kLCB0aGlzLnN0YXJ0LFxuICAgICAgIXRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmdsZURpc3RhbmNlKCkudHVybk9uZSgpICogdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhbiBBbmdsZSB0aGF0IHJlcHJlc2VudHMgdGhlIGRpc3RhbmNlIGJldHdlZW4gYHRoaXMuc3RhcnRgXG4gIC8vIGFuZCBgdGhpcy5lbmRgLCBpbiB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGFyYy5cbiAgYW5nbGVEaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5kaXN0YW5jZSh0aGlzLmVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5zdGFydCk7XG4gIH1cblxuICBlbmRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5lbmQpO1xuICB9XG5cblxuICBzdGFydFJheSgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLnN0YXJ0KTtcbiAgfVxuXG5cbiAgZW5kUmF5KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIHNlZ21lbnQgZnJvbSBgY2VudGVyYCB0byBgc3RhcnRQb2ludCgpYC5cbiAgc3RhcnRTZWdtZW50KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMuc3RhcnRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgc2VnbWVudCBmcm9tIGBjZW50ZXJgIHRvIGBlbmRQb2ludCgpYC5cbiAgZW5kU2VnbWVudCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLmVuZFJheSgpLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBzZWdtZW50IGZyb20gYHN0YXJ0UG9pbnQoKWAgdG8gYGVuZFBvaW50KClgLiBOb3RlIHRoYXRcbiAgLy8gZm9yIGNvbXBsZXRlLWNpcmNsZSBhcmNzIHRoaXMgc2VnbWVudCB3aWxsIGhhdmUgYSBsZW5ndGggb2YgemVyby5cbiAgY2hvcmRTZWdtZW50KCkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5zdGFydC5wZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydFBvaW50KCkuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRQb2ludCgpLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG4gIHdpdGhDZW50ZXIobmV3Q2VudGVyKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICBuZXdDZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuICB3aXRoU3RhcnQobmV3U3RhcnQpIHtcbiAgICBsZXQgbmV3U3RhcnRBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdTdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydEFuZ2xlLCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG4gIHdpdGhFbmQobmV3RW5kKSB7XG4gICAgbGV0IG5ld0VuZEFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0VuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmRBbmdsZSxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG4gIHdpdGhSYWRpdXMobmV3UmFkaXVzKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuICB3aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKSB7XG4gICAgbGV0IG5ld0VuZCA9IHRoaXMuYW5nbGVBdEFuZ2xlRGlzdGFuY2UobmV3QW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuICB3aXRoTGVuZ3RoKG5ld0xlbmd0aCkge1xuICAgIGxldCBjaXJjdW1mZXJlbmNlID0gdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICAgIGxldCBuZXdBbmdsZURpc3RhbmNlID0gbmV3TGVuZ3RoIC8gY2lyY3VtZmVyZW5jZTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG4gIHdpdGhMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGxldCBuZXdMZW5ndGggPSB0aGlzLmxlbmd0aCgpICogcmF0aW87XG4gICAgcmV0dXJuIHRoaXMud2l0aExlbmd0aChuZXdMZW5ndGgpO1xuICB9XG5cbiAgd2l0aENsb2Nrd2lzZShuZXdDbG9ja3dpc2UpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgbmV3Q2xvY2t3aXNlKTtcbiAgfVxuXG4gIHdpdGhTdGFydFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGxldCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuICB3aXRoRW5kVG93YXJkc1BvaW50KHBvaW50KSB7XG4gICAgbGV0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuICB3aXRoU3RhcnRFbmRUb3dhcmRzUG9pbnQoc3RhcnRQb2ludCwgZW5kUG9pbnQpIHtcbiAgICBsZXQgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoc3RhcnRQb2ludCk7XG4gICAgbGV0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChlbmRQb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBhcmMgaXMgYSBjb21wbGV0ZSBjaXJjbGUuXG4gIGlzQ2lyY2xlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmVxdWFscyh0aGlzLmVuZCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIGB2YWx1ZWAgY2xhbXBlZCB0byB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gemVybyBhbmQgdGhlIGxlbmd0aFxuICAvLyBvZiB0aGUgc2VnbWVudC5cblxuICAvLyBSZXR1cm5zIGBzb21lQW5nbGVgIGNsYW1wZWQgdG8gdGhlIGdpdmVuIGluc2V0cyBmcm9tIGB0aGlzLnN0YXJ0YCBhbmRcbiAgLy8gYHRoaXMuZW5kYCwgd2hpY2hldmVyIGlzIGNsb3Nlc3QgaW4gZGlzdGFuY2UgaWYgYHNvbWVBbmdsZWAgaXMgb3V0c2lkZVxuICAvLyB0aGUgYXJjLlxuICAvLyBUT0RPOiBpbnZhbGlkIHJhbmdlIGNvdWxkIHJldHVybiBhIHZhbHVlIGNlbnRlcmVkIGluIHRoZSBpbnNldHM/IG1vcmUgdmlzdWFsbHkgY29uZ3J1ZW50XG4gIC8vIElmIHRoZSBgc3RhcnQvZW5kSW5zZXRgIHZhbHVlcyByZXN1bHQgaW4gYSBjb250cmFkaWN0b3J5IHJhbmdlLCB0aGVcbiAgLy8gcmV0dXJuZWQgdmFsdWUgd2lsbCBjb21wbHkgd2l0aCBgc3RhcnRJbnNldCArIHRoaXMuc3RhcnRgLlxuICBjbGFtcFRvSW5zZXRzKHNvbWVBbmdsZSwgc29tZUFuZ2xlU3RhcnRJbnNldCA9IHRoaXMucmFjLkFuZ2xlLnplcm8sIHNvbWVBbmdsZUVuZEluc2V0ID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGxldCBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzb21lQW5nbGUpO1xuICAgIGxldCBzdGFydEluc2V0ID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIHNvbWVBbmdsZVN0YXJ0SW5zZXQpO1xuICAgIGxldCBlbmRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzb21lQW5nbGVFbmRJbnNldCk7XG5cbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpICYmIHN0YXJ0SW5zZXQudHVybiA9PSAwICYmIGVuZEluc2V0LnR1cm4gPT0gMCkge1xuICAgICAgLy8gQ29tcGxldGUgY2lyY2xlXG4gICAgICByZXR1cm4gYW5nbGU7XG4gICAgfVxuXG4gICAgLy8gQW5nbGUgaW4gYXJjLCB3aXRoIGFyYyBhcyBvcmlnaW5cbiAgICAvLyBBbGwgY29tcGFyaXNvbnMgYXJlIG1hZGUgaW4gYSBjbG9ja3dpc2Ugb3JpZW50YXRpb25cbiAgICBsZXQgc2hpZnRlZEFuZ2xlID0gdGhpcy5kaXN0YW5jZUZyb21TdGFydChhbmdsZSk7XG4gICAgbGV0IHNoaWZ0ZWRTdGFydENsYW1wID0gc3RhcnRJbnNldDtcbiAgICBsZXQgc2hpZnRlZEVuZENsYW1wID0gdGhpcy5hbmdsZURpc3RhbmNlKCkuc3VidHJhY3QoZW5kSW5zZXQpO1xuXG4gICAgaWYgKHNoaWZ0ZWRBbmdsZS50dXJuID49IHNoaWZ0ZWRTdGFydENsYW1wLnR1cm4gJiYgc2hpZnRlZEFuZ2xlLnR1cm4gPD0gc2hpZnRlZEVuZENsYW1wLnR1cm4pIHtcbiAgICAgIC8vIEluc2lkZSBjbGFtcCByYW5nZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIE91dHNpZGUgcmFuZ2UsIGZpZ3VyZSBvdXQgY2xvc2VzdCBsaW1pdFxuICAgIGxldCBkaXN0YW5jZVRvU3RhcnRDbGFtcCA9IHNoaWZ0ZWRTdGFydENsYW1wLmRpc3RhbmNlKHNoaWZ0ZWRBbmdsZSwgZmFsc2UpO1xuICAgIGxldCBkaXN0YW5jZVRvRW5kQ2xhbXAgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlKTtcbiAgICBpZiAoZGlzdGFuY2VUb1N0YXJ0Q2xhbXAudHVybiA8PSBkaXN0YW5jZVRvRW5kQ2xhbXAudHVybikge1xuICAgICAgcmV0dXJuIHRoaXMuc2hpZnRBbmdsZShzdGFydEluc2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLnNoaWZ0QW5nbGUoZW5kSW5zZXQpO1xuICAgIH1cbiAgfVxuXG59IC8vIGNsYXNzIEFyY1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXJjO1xuXG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBnaXZlbiBhbmdsZSBpcyBwb3NpdGlvbmVkIGJldHdlZW4gYHN0YXJ0YCBhbmRcbi8vIGBlbmRgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi4gRm9yIGNvbXBsZXRlIGNpcmNsZSBhcmNzIGB0cnVlYCBpc1xuLy8gYWx3YXlzIHJldHVybmVkLlxuQXJjLnByb3RvdHlwZS5jb250YWluc0FuZ2xlID0gZnVuY3Rpb24oc29tZUFuZ2xlKSB7XG4gIGxldCBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzb21lQW5nbGUpO1xuICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgaWYgKHRoaXMuY2xvY2t3aXNlKSB7XG4gICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuc3RhcnQpO1xuICAgIGxldCBlbmRPZmZzZXQgPSB0aGlzLmVuZC5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICByZXR1cm4gb2Zmc2V0LnR1cm4gPD0gZW5kT2Zmc2V0LnR1cm47XG4gIH0gZWxzZSB7XG4gICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuZW5kKTtcbiAgICBsZXQgc3RhcnRPZmZzZXQgPSB0aGlzLnN0YXJ0LnN1YnRyYWN0KHRoaXMuZW5kKTtcbiAgICByZXR1cm4gb2Zmc2V0LnR1cm4gPD0gc3RhcnRPZmZzZXQudHVybjtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YCBpbiB0aGUgYXJjIGlzIHBvc2l0aW9uZWRcbi8vIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLiBGb3IgY29tcGxldGVcbi8vIGNpcmNsZSBhcmNzIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG5BcmMucHJvdG90eXBlLmNvbnRhaW5zUHJvamVjdGVkUG9pbnQgPSBmdW5jdGlvbihwb2ludCkge1xuICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7IHJldHVybiB0cnVlOyB9XG4gIHJldHVybiB0aGlzLmNvbnRhaW5zQW5nbGUodGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50KSk7XG59XG5cbi8vIFJldHVybnMgYSBzZWdtZW50IGZvciB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZSBpbnRlcnNlY3Rpb24gb2YgYHRoaXNgIGFuZFxuLy8gYG90aGVyYDsgb3IgcmV0dXJuIGBudWxsYCBpZiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uXG4vLyBCb3RoIGFyY3MgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcyBmb3IgdGhlIGNhbGN1bGF0aW9uIG9mIHRoZVxuLy8gY2hvcmQsIHRodXMgdGhlIGVuZHBvaW50cyBvZiB0aGUgcmV0dXJuZWQgc2VnbWVudCBtYXkgbm90IGxheSBpbnNpZGUgdGhlXG4vLyBhY3R1YWwgYXJjcy5cbkFyYy5wcm90b3R5cGUuaW50ZXJzZWN0aW9uQ2hvcmQgPSBmdW5jdGlvbihvdGhlcikge1xuICAvLyBodHRwczovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9DaXJjbGUtQ2lyY2xlSW50ZXJzZWN0aW9uLmh0bWxcbiAgLy8gUj10aGlzLCByPW90aGVyXG5cbiAgaWYgKHRoaXMuY2VudGVyLmVxdWFscyhvdGhlci5jZW50ZXIpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZGlzdGFuY2UgPSB0aGlzLmNlbnRlci5kaXN0YW5jZVRvUG9pbnQob3RoZXIuY2VudGVyKTtcblxuICAvLyBkaXN0YW5jZVRvQ2hvcmQgPSAoZF4yIC0gcl4yICsgUl4yKSAvIChkKjIpXG4gIGxldCBkaXN0YW5jZVRvQ2hvcmQgPSAoXG4gICAgICBNYXRoLnBvdyhkaXN0YW5jZSwgMilcbiAgICAtIE1hdGgucG93KG90aGVyLnJhZGl1cywgMilcbiAgICArIE1hdGgucG93KHRoaXMucmFkaXVzLCAyKVxuICAgICkgLyAoZGlzdGFuY2UgKiAyKTtcblxuICAvLyBhID0gMS9kIHNxcnR8KC1kK3ItUikoLWQtcitSKSgtZCtyK1IpKGQrcitSKVxuICBsZXQgY2hvcmRMZW5ndGggPSAoMSAvIGRpc3RhbmNlKSAqIE1hdGguc3FydChcbiAgICAgICgtZGlzdGFuY2UgKyBvdGhlci5yYWRpdXMgLSB0aGlzLnJhZGl1cylcbiAgICAqICgtZGlzdGFuY2UgLSBvdGhlci5yYWRpdXMgKyB0aGlzLnJhZGl1cylcbiAgICAqICgtZGlzdGFuY2UgKyBvdGhlci5yYWRpdXMgKyB0aGlzLnJhZGl1cylcbiAgICAqIChkaXN0YW5jZSArIG90aGVyLnJhZGl1cyArIHRoaXMucmFkaXVzKSk7XG5cbiAgbGV0IHJheVRvQ2hvcmQgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChvdGhlci5jZW50ZXIpXG4gICAgLndpdGhMZW5ndGgoZGlzdGFuY2VUb0Nob3JkKTtcbiAgcmV0dXJuIHJheVRvQ2hvcmQubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlKVxuICAgIC53aXRoTGVuZ3RoKGNob3JkTGVuZ3RoLzIpXG4gICAgLnJldmVyc2UoKVxuICAgIC5zZWdtZW50V2l0aFJhdGlvT2ZMZW5ndGgoMik7XG59O1xuXG4vLyBSZXR1cm5zIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZSBgb3RoZXJgLlxuLy8gYG90aGVyYCBpcyBhd2F5cyBjb25zaWRlcmVkIGFzIGEgY29tcGxldGUgY2lyY2xlLlxuQXJjLnByb3RvdHlwZS5pbnRlcnNlY3Rpb25BcmMgPSBmdW5jdGlvbihvdGhlcikge1xuICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyKTtcbiAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoY2hvcmQuc3RhcnRQb2ludCgpKTtcbiAgbGV0IGVuZEFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGNob3JkLmVuZFBvaW50KCkpO1xuXG4gIGlmICghdGhpcy5jb250YWluc0FuZ2xlKHN0YXJ0QW5nbGUpKSB7XG4gICAgc3RhcnRBbmdsZSA9IHRoaXMuc3RhcnQ7XG4gIH1cbiAgaWYgKCF0aGlzLmNvbnRhaW5zQW5nbGUoZW5kQW5nbGUpKSB7XG4gICAgZW5kQW5nbGUgPSB0aGlzLmVuZDtcbiAgfVxuXG4gIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICBzdGFydEFuZ2xlLFxuICAgIGVuZEFuZ2xlLFxuICAgIHRoaXMuY2xvY2t3aXNlKTtcbn07XG5cbi8vIFJldHVybnMgb25seSBpbnRlcnNlY3RpbmcgcG9pbnRzLlxuQXJjLnByb3RvdHlwZS5pbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjID0gZnVuY3Rpb24ob3RoZXIpIHtcbiAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlcik7XG4gIGlmIChjaG9yZCA9PT0gbnVsbCkgeyByZXR1cm4gW107IH1cblxuICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtjaG9yZC5zdGFydFBvaW50KCksIGNob3JkLmVuZFBvaW50KCldLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbnNBbmdsZSh0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSlcbiAgICAgICYmIG90aGVyLmNvbnRhaW5zQW5nbGUob3RoZXIuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0pKTtcbiAgfSwgdGhpcyk7XG5cbiAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG59O1xuXG4vLyBSZXR1cm5zIGEgc2VnbWVudCBmb3IgdGhlIGNob3JkIGZvcm1lZCBieSB0aGUgaW50ZXJzZWN0aW9uIG9mIGB0aGlzYCBhbmRcbi8vIGBzZWdtZW50YDsgb3IgcmV0dXJuIGBudWxsYCBpZiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uIFRoZSByZXR1cm5lZFxuLy8gc2VnbWVudCB3aWxsIGhhdmUgdGhlIHNhbWUgYW5nbGUgYXMgYHNlZ21lbnRgLlxuLy9cbi8vIEZvciB0aGlzIGZ1bmN0aW9uIGB0aGlzYCBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLCBhbmQgYHNlZ21lbnRgXG4vLyBpcyBjb25zaWRlcmVkIGEgbGluZSB3aXRob3V0IGVuZHBvaW50cy5cbkFyYy5wcm90b3R5cGUuaW50ZXJzZWN0aW9uQ2hvcmRXaXRoU2VnbWVudCA9IGZ1bmN0aW9uKHNlZ21lbnQpIHtcbiAgLy8gRmlyc3QgY2hlY2sgaW50ZXJzZWN0aW9uXG4gIGxldCBwcm9qZWN0ZWRDZW50ZXIgPSBzZWdtZW50LnByb2plY3RlZFBvaW50KHRoaXMuY2VudGVyKTtcbiAgbGV0IGJpc2VjdG9yID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQocHJvamVjdGVkQ2VudGVyKTtcbiAgbGV0IGRpc3RhbmNlID0gYmlzZWN0b3IubGVuZ3RoKCk7XG4gIGlmIChkaXN0YW5jZSA+IHRoaXMucmFkaXVzIC0gdGhpcy5yYWMuZXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAvLyBwcm9qZWN0ZWRDZW50ZXIgb3V0c2lkZSBvciB0b28gY2xvc2UgdG8gYXJjIGVkZ2VcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNlZ21lbnQgdG9vIGNsb3NlIHRvIGNlbnRlciwgY29zaW5lIGNhbGN1bGF0aW9ucyBtYXkgYmUgaW5jb3JyZWN0XG4gIGlmIChkaXN0YW5jZSA8IHRoaXMucmFjLmVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgbGV0IHNlZ21lbnRBbmdsZSA9IHNlZ21lbnQuYW5nbGUoKTtcbiAgICBsZXQgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShzZWdtZW50QW5nbGUuaW52ZXJzZSgpKTtcbiAgICBsZXQgZW5kID0gdGhpcy5wb2ludEF0QW5nbGUoc2VnbWVudEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgbGV0IHJhZGlhbnMgPSBNYXRoLmFjb3MoZGlzdGFuY2UvdGhpcy5yYWRpdXMpO1xuICBsZXQgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIHJhZGlhbnMpO1xuXG4gIGxldCBjZW50ZXJPcmllbnRhdGlvbiA9IHNlZ21lbnQucG9pbnRPcmllbnRhdGlvbih0aGlzLmNlbnRlcik7XG4gIGxldCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLmFuZ2xlKCkuc2hpZnQoYW5nbGUsICFjZW50ZXJPcmllbnRhdGlvbikpO1xuICBsZXQgZW5kID0gdGhpcy5wb2ludEF0QW5nbGUoYmlzZWN0b3IuYW5nbGUoKS5zaGlmdChhbmdsZSwgY2VudGVyT3JpZW50YXRpb24pKTtcbiAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudChzdGFydCwgZW5kKTtcbn07XG5cbi8vIFJldHVybnMgdGhlIGBlbmRgIHBvaW50IG9mIGBpbnRlcnNlY3Rpb25DaG9yZFdpdGhTZWdtZW50YCBmb3IgYHNlZ21lbnRgLlxuLy8gSWYgYHNlZ21lbnRgIGRvZXMgbm90IGludGVyc2VjdCB3aXRoIGBzZWxmYCwgcmV0dXJucyB0aGUgcG9pbnQgaW4gdGhlXG4vLyBhcmMgY2xvc2VzdCB0byBgc2VnbWVudGAuXG4vL1xuLy8gRm9yIHRoaXMgZnVuY3Rpb24gYHRoaXNgIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUsIGFuZCBgc2VnbWVudGBcbi8vIGlzIGNvbnNpZGVyZWQgYSBsaW5lIHdpdGhvdXQgZW5kcG9pbnRzLlxuQXJjLnByb3RvdHlwZS5jaG9yZEVuZE9yUHJvamVjdGlvbldpdGhTZWdtZW50ID0gZnVuY3Rpb24oc2VnbWVudCkge1xuICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkV2l0aFNlZ21lbnQoc2VnbWVudCk7XG4gIGlmIChjaG9yZCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBjaG9yZC5lbmRQb2ludCgpO1xuICB9XG5cbiAgbGV0IGNlbnRlck9yaWVudGF0aW9uID0gc2VnbWVudC5wb2ludE9yaWVudGF0aW9uKHRoaXMuY2VudGVyKTtcbiAgbGV0IHBlcnBlbmRpY3VsYXIgPSBzZWdtZW50LmFuZ2xlKCkucGVycGVuZGljdWxhcighY2VudGVyT3JpZW50YXRpb24pO1xuICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUocGVycGVuZGljdWxhcik7XG59O1xuXG5BcmMucHJvdG90eXBlLnJhZGl1c1NlZ21lbnRBdEFuZ2xlID0gZnVuY3Rpb24oc29tZUFuZ2xlKSB7XG4gIGxldCBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzb21lQW5nbGUpO1xuICByZXR1cm4gdGhpcy5jZW50ZXIuc2VnbWVudFRvQW5nbGUoYW5nbGUsIHRoaXMucmFkaXVzKTtcbn1cblxuQXJjLnByb3RvdHlwZS5yYWRpdXNTZWdtZW50VG93YXJkc1BvaW50ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgbGV0IGFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50KTtcbiAgcmV0dXJuIHRoaXMuY2VudGVyLnNlZ21lbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLnJhZGl1cyk7XG59XG5cbi8vIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgdG8gYHNvbWVBbmdsZWAgc2hpZnRlZCB0byBoYXZlIGB0aGlzLnN0YXJ0YCBhc1xuLy8gb3JpZ2luLCBpbiB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGFyYy5cbi8vIFVzZWZ1bCB0byBkZXRlcm1pbmUgYW4gYW5nbGUgaW5zaWRlIHRoZSBhcmMsIHdoZXJlIHRoZSBhcmMgaXMgY29uc2lkZXJlZFxuLy8gdGhlIG9yaWdpbiBjb29yZGluYXRlIHN5c3RlbS5cbi8vIEZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWAsIGEgYHNoaWZ0QW5nbGUoMC4xKWAgaXMgYDAuNmAuXG4vLyBGb3IgYSBjbG9ja3dpc2Ugb3JpZW50YXRpb24sIGVxdWl2YWxlbnQgdG8gYHRoaXMuc3RhcnQgKyBzb21lQW5nbGVgLlxuQXJjLnByb3RvdHlwZS5zaGlmdEFuZ2xlID0gZnVuY3Rpb24oc29tZUFuZ2xlKSB7XG4gIGxldCBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzb21lQW5nbGUpO1xuICByZXR1cm4gdGhpcy5zdGFydC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xufVxuXG4vLyBSZXR1cm5zIGFuIEFuZ2xlIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG9cbi8vIGBzb21lQW5nbGVgIHRyYXZlbGluZyBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4vLyBVc2VmdWwgdG8gZGV0ZXJtaW5lIGZvciBhIGdpdmVuIGFuZ2xlLCB3aGVyZSBpdCBzaXRzIGluc2lkZSB0aGUgYXJjIGlmXG4vLyB0aGUgYXJjIHdhcyB0aGUgb3JpZ2luIGNvb3JkaW5hdGUgc3lzdGVtLlxuLy8gRm9yIGEgY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCBgMC4xYCwgYSBgZGlzdGFuY2VGcm9tU3RhcnQoMC41KWAgaXMgYDAuNGAuXG4vLyBGb3IgYSBjbG9ja3dpc2Ugb3JpZW50YXRpb24sIGVxdWl2YWxlbnQgdG8gYHNvbWVBbmdsZSAtIHRoaXMuc3RhcnRgLlxuQXJjLnByb3RvdHlwZS5kaXN0YW5jZUZyb21TdGFydCA9IGZ1bmN0aW9uKHNvbWVBbmdsZSkge1xuICBsZXQgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc29tZUFuZ2xlKTtcbiAgcmV0dXJuIHRoaXMuc3RhcnQuZGlzdGFuY2UoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbn1cblxuLy8gUmV0dXJucyB0aGUgQW5nbGUgYXQgdGhlIGdpdmVuIGFyYyBsZW5ndGggZnJvbSBgc3RhcnRgLiBFcXVpdmFsZW50IHRvXG4vLyBgc2hpZnRBbmdsZShzb21lQW5nbGUpYC5cbkFyYy5wcm90b3R5cGUuYW5nbGVBdEFuZ2xlRGlzdGFuY2UgPSBmdW5jdGlvbihzb21lQW5nbGUpIHtcbiAgcmV0dXJuIHRoaXMuc2hpZnRBbmdsZShzb21lQW5nbGUpO1xufVxuXG4vLyBSZXR1cm5zIHRoZSBwb2ludCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBhbmdsZSBzaGlmdGVkIGJ5IGB0aGlzLnN0YXJ0YFxuLy8gaW4gdGhlIGFyYyBvcmllbnRhdGlvbi4gVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuQXJjLnByb3RvdHlwZS5wb2ludEF0QW5nbGVEaXN0YW5jZSA9IGZ1bmN0aW9uKHNvbWVBbmdsZSkge1xuICBsZXQgc2hpZnRlZEFuZ2xlID0gdGhpcy5zaGlmdEFuZ2xlKHNvbWVBbmdsZSk7XG4gIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZShzaGlmdGVkQW5nbGUpO1xufTtcblxuLy8gUmV0dXJucyB0aGUgcG9pbnQgaW4gdGhlIGFyYyBhdCB0aGUgY3VycmVudCBhcmMgbGVuZ3RoIG11bHRpcGxpZWQgYnlcbi8vIGBhbmdsZURpc3RhbmNlUmF0aW9gIGFuZCB0aGVuIHNoaWZ0ZWQgYnkgYHRoaXMuc3RhcnRgIGluIHRoZSBhcmNcbi8vIG9yaWVudGF0aW9uLiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG5BcmMucHJvdG90eXBlLnBvaW50QXRBbmdsZURpc3RhbmNlUmF0aW8gPSBmdW5jdGlvbihhbmdsZURpc3RhbmNlUmF0aW8pIHtcbiAgbGV0IG5ld0FuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKS5tdWx0T25lKGFuZ2xlRGlzdGFuY2VSYXRpbyk7XG4gIGxldCBzaGlmdGVkQW5nbGUgPSB0aGlzLnNoaWZ0QW5nbGUobmV3QW5nbGVEaXN0YW5jZSk7XG4gIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZShzaGlmdGVkQW5nbGUpO1xufTtcblxuLy8gUmV0dXJucyB0aGUgcG9pbnQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYW5nbGUuIFRoZSBhcmMgaXMgY29uc2lkZXJlZFxuLy8gYSBjb21wbGV0ZSBjaXJjbGUuXG5BcmMucHJvdG90eXBlLnBvaW50QXRBbmdsZSA9IGZ1bmN0aW9uKHNvbWVBbmdsZSkge1xuICBsZXQgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc29tZUFuZ2xlKTtcbiAgcmV0dXJuIHRoaXMuY2VudGVyLnBvaW50VG9BbmdsZShhbmdsZSwgdGhpcy5yYWRpdXMpO1xufTtcblxuLy8gUmV0dXJucyBhIHNlZ21lbnQgdGhhdCBpcyB0YW5nZW50IHRvIGJvdGggYHRoaXNgIGFuZCBgb3RoZXJBcmNgLFxuLy8gY29uc2lkZXJpbmcgYm90aCBhcyBjb21wbGV0ZSBjaXJjbGVzLlxuLy8gV2l0aCBhIHNlZ21lbnQgZnJvbSBgdGhpcy5jZW50ZXJgIHRvIGBvdGhlckFyYy5jZW50ZXJgOiBgc3RhcnRDbG9ja3dpc2VgXG4vLyBkZXRlcm1pbmVzIHRoZSBzdGFydGluZyBzaWRlIHJldHVybmVkIHRhbmdlbnQgc2VnbWVudCwgYGVuZENsb2N3aXNlYFxuLy8gZGV0ZXJtaW5lcyB0aGUgZW5kIHNpZGUuXG4vLyBSZXR1cm5zIGBudWxsYCBpZiBgdGhpc2AgaXMgaW5zaWRlIGBvdGhlckFyY2AgYW5kIHRodXMgbm8gdGFuZ2VudCBzZWdtZW50XG4vLyBpcyBwb3NzaWJsZS5cbkFyYy5wcm90b3R5cGUuc2VnbWVudFRhbmdlbnRUb0FyYyA9IGZ1bmN0aW9uKG90aGVyQXJjLCBzdGFydENsb2Nrd2lzZSA9IHRydWUsIGVuZENsb2Nrd2lzZSA9IHRydWUpIHtcbiAgbGV0IGh5cFNlZ21lbnQgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChvdGhlckFyYy5jZW50ZXIpO1xuICBsZXQgb3BzID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgID8gb3RoZXJBcmMucmFkaXVzIC0gdGhpcy5yYWRpdXNcbiAgICA6IG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzO1xuXG4gIGxldCBhbmdsZVNpbmUgPSBvcHMgLyBoeXBTZWdtZW50Lmxlbmd0aCgpO1xuICBpZiAoYW5nbGVTaW5lID4gMSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGFuZ2xlUmFkaWFucyA9IE1hdGguYXNpbihhbmdsZVNpbmUpO1xuICBsZXQgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG5cbiAgbGV0IGFkak9yaWVudGF0aW9uID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgID8gc3RhcnRDbG9ja3dpc2VcbiAgICA6ICFzdGFydENsb2Nrd2lzZTtcbiAgbGV0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cFNlZ21lbnQuYW5nbGUoKS5zaGlmdChvcHNBbmdsZSwgYWRqT3JpZW50YXRpb24pO1xuICBsZXQgc2hpZnRlZEFkakFuZ2xlID0gc2hpZnRlZE9wc0FuZ2xlLnBlcnBlbmRpY3VsYXIoYWRqT3JpZW50YXRpb24pO1xuXG4gIGxldCBzdGFydEFuZ2xlID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgID8gc2hpZnRlZEFkakFuZ2xlXG4gICAgOiBzaGlmdGVkQWRqQW5nbGUuaW52ZXJzZSgpXG4gIGxldCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICBsZXQgZW5kID0gb3RoZXJBcmMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBZGpBbmdsZSk7XG4gIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQpO1xufTtcblxuLy8gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBhcmMgZGl2aWRlZCBpbnRvIGBhcmNDb3VudGAgYXJjcywgZWFjaFxuLy8gd2l0aCB0aGUgc2FtZSBgYW5nbGVEaXN0YW5jZWAuXG5BcmMucHJvdG90eXBlLmRpdmlkZVRvQXJjcyA9IGZ1bmN0aW9uKGFyY0NvdW50KSB7XG4gIGlmIChhcmNDb3VudCA8PSAwKSB7IHJldHVybiBbXTsgfVxuXG4gIGxldCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gIGxldCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gYXJjQ291bnQ7XG5cbiAgbGV0IHBhcnRBbmdsZURpc3RhbmNlID0gbmV3IFJhYy5BbmdsZSh0aGlzLnJhYywgcGFydFR1cm4pO1xuXG4gIGxldCBhcmNzID0gW107XG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhcmNDb3VudDsgaW5kZXgrKykge1xuICAgIGxldCBzdGFydCA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiBpbmRleCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIGxldCBlbmQgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogKGluZGV4KzEpLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgbGV0IGFyYyA9IG5ldyBBcmModGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cywgc3RhcnQsIGVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIGFyY3MucHVzaChhcmMpO1xuICB9XG5cbiAgcmV0dXJuIGFyY3M7XG59O1xuXG5BcmMucHJvdG90eXBlLmRpdmlkZVRvU2VnbWVudHMgPSBmdW5jdGlvbihzZWdtZW50Q291bnQpIHtcbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgbGV0IHBhcnRUdXJuID0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLyBzZWdtZW50Q291bnQ7XG5cbiAgbGV0IHBhcnRBbmdsZSA9IG5ldyBSYWMuQW5nbGUodGhpcy5yYWMsIHBhcnRUdXJuKTtcbiAgaWYgKCF0aGlzLmNsb2Nrd2lzZSkge1xuICAgIHBhcnRBbmdsZSA9IHBhcnRBbmdsZS5uZWdhdGl2ZSgpO1xuICB9XG5cbiAgbGV0IGxhc3RBcmNSYXkgPSB0aGlzLnN0YXJ0U2VnbWVudCgpO1xuICBsZXQgc2VnbWVudHMgPSBbXTtcbiAgZm9yIChsZXQgY291bnQgPSAxOyBjb3VudCA8PSBzZWdtZW50Q291bnQ7IGNvdW50KyspIHtcbiAgICBsZXQgY3VycmVudEFuZ2xlID0gbGFzdEFyY1JheS5hbmdsZSgpLmFkZChwYXJ0QW5nbGUpO1xuICAgIGxldCBjdXJyZW50QXJjUmF5ID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvQW5nbGUoY3VycmVudEFuZ2xlLCB0aGlzLnJhZGl1cyk7XG4gICAgbGV0IGNob3JkID0gbGFzdEFyY1JheS5lbmRQb2ludCgpXG4gICAgICAuc2VnbWVudFRvUG9pbnQoY3VycmVudEFyY1JheS5lbmRQb2ludCgpKTtcbiAgICBzZWdtZW50cy5wdXNoKGNob3JkKTtcbiAgICBsYXN0QXJjUmF5ID0gY3VycmVudEFyY1JheTtcbiAgfVxuXG4gIHJldHVybiBzZWdtZW50cztcbn07XG5cbkFyYy5wcm90b3R5cGUuZGl2aWRlVG9CZXppZXJzID0gZnVuY3Rpb24oYmV6aWVyQ291bnQpIHtcbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgbGV0IHBhcnRUdXJuID0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLyBiZXppZXJDb3VudDtcblxuICAvLyBsZW5ndGggb2YgdGFuZ2VudDpcbiAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTczNDc0NS9ob3ctdG8tY3JlYXRlLWNpcmNsZS13aXRoLWIlQzMlQTl6aWVyLWN1cnZlc1xuICBsZXQgcGFyc1BlclR1cm4gPSAxIC8gcGFydFR1cm47XG4gIGxldCB0YW5nZW50ID0gdGhpcy5yYWRpdXMgKiAoNC8zKSAqIE1hdGgudGFuKE1hdGguUEkvKHBhcnNQZXJUdXJuKjIpKTtcblxuICBsZXQgYmV6aWVycyA9IFtdO1xuICBsZXQgc2VnbWVudHMgPSB0aGlzLmRpdmlkZVRvU2VnbWVudHMoYmV6aWVyQ291bnQpO1xuICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBsZXQgc3RhcnRBcmNSYXkgPSAgdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbS5zdGFydFBvaW50KCkpO1xuICAgIGxldCBlbmRBcmNSYXkgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtLmVuZFBvaW50KCkpO1xuXG4gICAgbGV0IHN0YXJ0QW5jaG9yID0gc3RhcnRBcmNSYXlcbiAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVTaGlmdCh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsICF0aGlzLmNsb2Nrd2lzZSwgdGFuZ2VudClcbiAgICAgIC5lbmRQb2ludCgpO1xuICAgIGxldCBlbmRBbmNob3IgPSBlbmRBcmNSYXlcbiAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVTaGlmdCh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIHRoaXMuY2xvY2t3aXNlLCB0YW5nZW50KVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICBiZXppZXJzLnB1c2gobmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICBzdGFydEFyY1JheS5lbmRQb2ludCgpLCBzdGFydEFuY2hvcixcbiAgICAgIGVuZEFuY2hvciwgZW5kQXJjUmF5LmVuZFBvaW50KCkpKTtcbiAgfSwgdGhpcyk7XG5cbiAgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjLCBiZXppZXJzKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbmZ1bmN0aW9uIEJlemllcihyYWMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCk7XG5cbiAgdGhpcy5yYWMgPSByYWM7XG4gIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgdGhpcy5zdGFydEFuY2hvciA9IHN0YXJ0QW5jaG9yO1xuICB0aGlzLmVuZEFuY2hvciA9IGVuZEFuY2hvcjtcbiAgdGhpcy5lbmQgPSBlbmQ7XG59O1xuXG5cbkJlemllci5wcm90b3R5cGUuZHJhd0FuY2hvcnMgPSBmdW5jdGlvbihzdHlsZSA9IHVuZGVmaW5lZCkge1xuICBwdXNoKCk7XG4gIGlmIChzdHlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3R5bGUuYXBwbHkoKTtcbiAgfVxuICB0aGlzLnN0YXJ0LnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnRBbmNob3IpLmRyYXcoKTtcbiAgdGhpcy5lbmQuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRBbmNob3IpLmRyYXcoKTtcbiAgcG9wKCk7XG59O1xuXG5CZXppZXIucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCZXppZXIodGhpcy5yYWMsXG4gICAgdGhpcy5lbmQsIHRoaXMuZW5kQW5jaG9yLFxuICAgIHRoaXMuc3RhcnRBbmNob3IsIHRoaXMuc3RhcnQpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJlemllcjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuICAvLyBDb250YWlucyBhIHNlcXVlbmNlIG9mIGdlb21ldHJ5IG9iamVjdHMgd2hpY2ggY2FuIGJlIGRyYXduIG9yIHZlcnRleFxuICAvLyB0b2dldGhlci5cbmZ1bmN0aW9uIENvbXBvc2l0ZShyYWMsIHNlcXVlbmNlID0gW10pIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc2VxdWVuY2UpO1xuXG4gIHRoaXMucmFjID0gcmFjO1xuICB0aGlzLnNlcXVlbmNlID0gc2VxdWVuY2U7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRlO1xuXG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuaXNOb3RFbXB0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zZXF1ZW5jZS5sZW5ndGggIT0gMDtcbn07XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgZWxlbWVudC5mb3JFYWNoKGl0ZW0gPT4gdGhpcy5zZXF1ZW5jZS5wdXNoKGl0ZW0pKTtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLnNlcXVlbmNlLnB1c2goZWxlbWVudCk7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHJldmVyc2VkID0gdGhpcy5zZXF1ZW5jZS5tYXAoaXRlbSA9PiBpdGVtLnJldmVyc2UoKSlcbiAgICAucmV2ZXJzZSgpO1xuICByZXR1cm4gbmV3IENvbXBvc2l0ZSh0aGlzLnJhYywgcmV2ZXJzZWQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFBvaW50IGluIGEgdHdvIGRpbWVudGlvbmFsIGNvb3JkaW5hdGUgc3lzdGVtLlxuKiBAYWxpYXMgUmFjLlBvaW50XG4qL1xuY2xhc3MgUG9pbnR7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgUG9pbnRgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWMgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHggY29vcmRpbmF0ZVxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IFRoZSB5IGNvb3JkaW5hdGVcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB4LCB5KSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgeCwgeSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHgsIHkpO1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgUG9pbnQoJHt0aGlzLnh9LCR7dGhpcy55fSlgO1xuICB9XG5cblxuICBlcXVhbHMob3RoZXIpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMuZXF1YWxzKHRoaXMueCwgb3RoZXIueClcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnksIG90aGVyLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKi9cbiAgd2l0aFgobmV3WCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIG5ld1gsIHRoaXMueSk7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueCwgbmV3WSk7XG4gIH1cblxuICBhZGRYKHgpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgeCwgdGhpcy55KTtcbiAgfVxuXG4gIGFkZFkoeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLngsIHRoaXMueSArIHkpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IGFkZGluZyB0aGUgY29tcG9uZW50cyBvZiBgb3RoZXJgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBvdGhlciBBIGBQb2ludGAgdG8gYWRkXG4gICovXG4gIGFkZFBvaW50KG90aGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgb3RoZXIueCxcbiAgICAgIHRoaXMueSArIG90aGVyLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzLlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB4IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcGFyYW0ge251bWJlcn0geSBUaGUgeSBjb29kaW5hdGUgdG8gYWRkXG4gICovXG4gIGFkZCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHgsIHRoaXMueSArIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgc3VidHJhY3RpbmcgdGhlIGNvbXBvbmVudHMgb2YgYG90aGVyYC5cbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gb3RoZXIgQSBgUG9pbnRgIHRvIHN1YnRyYWN0XG4gICovXG4gIHN1YnRyYWN0UG9pbnQob3RoZXIpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KFxuICAgICAgdGhpcy5yYWMsXG4gICAgICB0aGlzLnggLSBvdGhlci54LFxuICAgICAgdGhpcy55IC0gb3RoZXIueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cy5cbiAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgeCBjb29kaW5hdGUgdG8gc3VidHJhY3RcbiAgKiBAcGFyYW0ge251bWJlcn0geSBUaGUgeSBjb29kaW5hdGUgdG8gc3VidHJhY3RcbiAgKi9cbiAgc3VidHJhY3QoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHgsXG4gICAgICB0aGlzLnkgLSB5KTtcbiAgfVxuXG4gIG5lZ2F0aXZlKCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIC10aGlzLngsIC10aGlzLnkpO1xuICB9XG5cblxuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICByZXR1cm4gY2xvY2t3aXNlXG4gICAgICA/IG5ldyBQb2ludCh0aGlzLnJhYywgLXRoaXMueSwgdGhpcy54KVxuICAgICAgOiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueSwgLXRoaXMueCk7XG4gIH1cblxuICBkaXN0YW5jZVRvUG9pbnQob3RoZXIpIHtcbiAgICBsZXQgeCA9IE1hdGgucG93KChvdGhlci54IC0gdGhpcy54KSwgMik7XG4gICAgbGV0IHkgPSBNYXRoLnBvdygob3RoZXIueSAtIHRoaXMueSksIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCt5KTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGFuZ2xlIHRvIHRoZSBnaXZlbiBwb2ludC4gSWYgdGhpcyBhbmQgb3RoZXIgYXJlIGNvbnNpZGVyZWRcbiAgLy8gZXF1YWwsIHRoZW4gdGhlIGBzb21lQW5nbGVgIGlzIHJldHVybmVkLCB3aGljaCBieSBkZWZhbHQgaXMgemVyby5cbiAgYW5nbGVUb1BvaW50KG90aGVyLCBzb21lQW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgaWYgKHRoaXMuZXF1YWxzKG90aGVyKSkge1xuICAgICAgY29uc3QgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHNvbWVBbmdsZSk7XG4gICAgICByZXR1cm4gYW5nbGU7XG4gICAgfVxuICAgIGNvbnN0IG9mZnNldCA9IG90aGVyLnN1YnRyYWN0UG9pbnQodGhpcyk7XG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYXRhbjIob2Zmc2V0LnksIG9mZnNldC54KTtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCByYWRpYW5zKTtcbiAgfVxuXG5cbiAgcG9pbnRUb0FuZ2xlKHNvbWVBbmdsZSwgZGlzdGFuY2UpIHtcbiAgICBsZXQgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHNvbWVBbmdsZSk7XG4gICAgbGV0IGRpc3RhbmNlWCA9IGRpc3RhbmNlICogTWF0aC5jb3MoYW5nbGUucmFkaWFucygpKTtcbiAgICBsZXQgZGlzdGFuY2VZID0gZGlzdGFuY2UgKiBNYXRoLnNpbihhbmdsZS5yYWRpYW5zKCkpO1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueCArIGRpc3RhbmNlWCwgdGhpcy55ICsgZGlzdGFuY2VZKTtcbiAgfVxuXG5cbiAgcmF5KHNvbWVBbmdsZSkge1xuICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgYW5nbGUpO1xuICB9XG5cbiAgcmF5VG9Qb2ludChwb2ludCwgc29tZUFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIHNvbWVBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBhbmdsZSk7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFJheWAgZnJvbSBgdGhpc2AgdG8gdGhlIHBvaW50IHByb2plY3RlZCBpbiBgcmF5YC4gSWYgdGhlXG4gICogcHJvamVjdGVkIHBvaW50IGlzIGVxdWFsIHRvIGB0aGlzYCB0aGUgcHJvZHVjZWQgcmF5IHdpbGwgaGF2ZSBhbiBhbmdsZVxuICAqIGNsb2Nrd2lzZS1wZXJwZW5kaWN1bGFyIHRvIGByYXlgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICByYXlUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0ZWQodGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMucmF5VG9Qb2ludChwcm9qZWN0ZWQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvLyBUT0RPOiByYXlUYW5nZW50VG9BcmNcblxuXG4gIHNlZ21lbnRUb0FuZ2xlKHNvbWVBbmdsZSwgbGVuZ3RoKSB7XG4gICAgY29uc3QgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHNvbWVBbmdsZSk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCByYXksIGxlbmd0aCk7XG4gIH1cblxuICBzZWdtZW50VG9Qb2ludChwb2ludCwgc29tZUFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIHNvbWVBbmdsZSk7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgcmF5LCBsZW5ndGgpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHNlZ21lbnQgZnJvbSB0aGlzIHRvIHRoZSBwb2ludCBwcm9qZWN0ZWQgaW4gcmF5XG4gIHNlZ21lbnRUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0ZWQodGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VnbWVudFRvUG9pbnQocHJvamVjdGVkLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgdGhhdCBpcyB0YW5nZW50IHRvIGBhcmNgIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uIGZyb20gdGhlIHJheSBmb3JtZWQgYnkgYHRoaXNgIGFuZCBgYXJjLmNlbnRlcmAuIFJldHVybnNcbiAgKiBgbnVsbGAgaWYgYHRoaXNgIGlzIGluc2lkZSBgYXJjYCBhbmQgdGh1cyBubyB0YW5nZW50IHNlZ21lbnQgaXNcbiAgKiBwb3NzaWJsZS5cbiAgKiBUaGUgcmV0dXJuZWQgYFNlZ21lbnRgIHN0YXJ0cyBhdCBgdGhpc2AgYW5kIGVuZHMgYXQgdGhlIGNvbnRhY3QgcG9pbnRcbiAgKiB3aXRoIGBhcmNgIHdoaWNoIGlzIGNvbnNpZGVyZWQgYXMgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBUT0RPOiB3aGF0IGhhcHBlbnMgaWYgdGhlIHBvaW50IHRvdWNoZXMgdGhlIGNpcmNsZT9cbiAgKiBUT0RPOiB3aGF0IGhhcHBlbnMgaWYgdGhlIGFyYyByYWRpdXMgaXMgemVybyBhbmQgdGhpcyBpcyBlcXVhbCB0byBjZW50ZXI/XG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IGFyY1xuICAqIEBwYXJhbSB7Ym9vbGVhbj19IGNsb2Nrd2lzZT10cnVlXG4gICogQHJldHVybiB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgLy8gRGVmYXVsdCBhbmdsZSBpcyBnaXZlbiBmb3IgdGhlIGVkZ2UgY2FzZSBvZiBhIHplcm8tcmFkaXVzIGFyY1xuICAgIGxldCBoeXBvdGVudXNlID0gdGhpcy5zZWdtZW50VG9Qb2ludChhcmMuY2VudGVyLCBhcmMuc3RhcnQuaW52ZXJzZSgpKTtcbiAgICBsZXQgb3BzID0gYXJjLnJhZGl1cztcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIGFyYy5yYWRpdXMpKSB7XG4gICAgICAvLyBQb2ludCBpbiBhcmNcbiAgICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSBoeXBvdGVudXNlLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgICByZXR1cm4gdGhpcy5zZWdtZW50VG9BbmdsZShwZXJwZW5kaWN1bGFyLCAwKTtcbiAgICB9XG5cbiAgICBsZXQgYW5nbGVTaW5lID0gb3BzIC8gaHlwb3RlbnVzZS5sZW5ndGg7XG4gICAgaWYgKGFuZ2xlU2luZSA+IDEpIHtcbiAgICAgIC8vIFBvaW50IGluc2lkZSBhcmNcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBhbmdsZVJhZGlhbnMgPSBNYXRoLmFzaW4oYW5nbGVTaW5lKTtcbiAgICBsZXQgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG4gICAgbGV0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cG90ZW51c2UuYW5nbGUoKS5zaGlmdChvcHNBbmdsZSwgY2xvY2t3aXNlKTtcblxuICAgIC8vIFRPRE86IHNwbGl0dGluZyBpdCB0byByYXkgd291bGQgYWN0dWFsbHkgc2F2ZSBzb21lIGNhbGN1bGF0aW9uc1xuICAgIGxldCBlbmQgPSBhcmMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRPcHNBbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSkpO1xuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KGVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXNgIGFuZCB0aGUgZ2l2ZW4gcGFyYW1ldGVycy5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXI9fSBzb21lU3RhcnQ9cmFjLkFuZ2xlLnplcm9cbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV8bnVtYmVyPX0gc29tZUVuZFxuICAqIEBwYXJhbSB7Ym9vbGVhbj19IGNsb2Nrd2lzZT10cnVlXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhcbiAgICByYWRpdXMsXG4gICAgc29tZVN0YXJ0ID0gdGhpcy5yYWMuQW5nbGUuemVybyxcbiAgICBzb21lRW5kID0gbnVsbCxcbiAgICBjbG9ja3dpc2UgPSB0cnVlKVxuICB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHNvbWVTdGFydCk7XG4gICAgY29uc3QgZW5kID0gc29tZUVuZCA9PT0gbnVsbFxuICAgICAgPyBzdGFydFxuICAgICAgOiB0aGlzLnJhYy5BbmdsZS5mcm9tKHNvbWVFbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYywgdGhpcywgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICB9XG5cblxuICB0ZXh0KHN0cmluZywgZm9ybWF0KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuVGV4dCh0aGlzLnJhYywgdGhpcywgc3RyaW5nLCBmb3JtYXQpO1xuICB9XG5cbn0gLy8gY2xhc3MgUG9pbnRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogVW5ib3VuZGVkIHJheSBmcm9tIGEgcG9pbnQgaW4gZGlyZWN0aW9uIG9mIGFuIGFuZ2xlLlxuKiBAYWxpYXMgUmFjLlJheVxuKi9cbmNsYXNzIFJheSB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgYW5nbGUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgYW5nbGUpO1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBSYXkoKCR7dGhpcy5zdGFydC54fSwke3RoaXMuc3RhcnQueX0pIGE6JHt0aGlzLmFuZ2xlLnR1cm59KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNsb3BlIG9mIHRoZSByYXksIG9yIGBudWxsYCBpZiB0aGUgcmF5IGlzIHZlcnRpY2FsLlxuICAqXG4gICogYHNsb3BlYCBpcyBgbWAgaW4gdGhlIGZvcm11bGEgYHkgPSBteCArIGJgLlxuICAqXG4gICogQHJldHVybnMgez9udW1iZXJ9XG4gICovXG4gIHNsb3BlKCkge1xuICAgIGxldCBpc1ZlcnRpY2FsID1cbiAgICAgICAgIHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5hbmdsZS50dXJuLCB0aGlzLnJhYy5BbmdsZS5kb3duLnR1cm4pXG4gICAgICB8fCB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYW5nbGUudHVybiwgdGhpcy5yYWMuQW5nbGUudXAudHVybik7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLnRhbih0aGlzLmFuZ2xlLnJhZGlhbnMoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHktaW50ZXJjZXB0ICh0aGUgcG9pbnQgYXQgd2hpY2ggdGhlIHJheSwgZXh0ZW5kZWQgaW4gYm90aFxuICAqIGRpcmVjdGlvbnMsIHdvdWxkIGludGVyY2VwdCB3aXRoIHRoZSB5LWF4aXMpLCBvciBgbnVsbGAgaWYgdGhlIHJheSBpc1xuICAqIHZlcnRpY2FsLlxuICAqXG4gICogYHlJbnRlcmNlcHRgIGlzIGBiYCBpbiB0aGUgZm9ybXVsYSBgeSA9IG14ICsgYmAuXG4gICpcbiAgKiBAcmV0dXJucyB7P251bWJlcn1cbiAgKi9cbiAgeUludGVyY2VwdCgpIHtcbiAgICBsZXQgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8geSA9IG14ICsgYlxuICAgIC8vIHkgLSBteCA9IGJcbiAgICByZXR1cm4gdGhpcy5zdGFydC55IC0gc2xvcGUgKiB0aGlzLnN0YXJ0Lng7XG4gIH1cblxuXG4gIHdpdGhTdGFydChuZXdTdGFydCkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuICB3aXRoQW5nbGUoc29tZUFuZ2xlKSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuICB3aXRoQW5nbGVBZGQoc29tZUFuZ2xlKSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5hbmdsZS5hZGQoc29tZUFuZ2xlKTtcbiAgICBsZXQgbmV3RW5kID0gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUobmV3QW5nbGUsIHRoaXMubGVuZ3RoKCkpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdFbmQpO1xuICB9XG5cbiAgd2l0aEFuZ2xlU2hpZnQoc29tZUFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5hbmdsZS5zaGlmdChzb21lQW5nbGUsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG4gIHdpdGhTdGFydEF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuc3RhcnQucG9pbnRUb0FuZ2xlKHRoaXMuYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cbiAgaW52ZXJzZSgpIHtcbiAgICBjb25zdCBpbnZlcnNlQW5nbGUgPSB0aGlzLmFuZ2xlLmludmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgaW52ZXJzZUFuZ2xlKTtcbiAgfVxuXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICBwb2ludEF0WCh4KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhYKHgpO1xuICAgIH1cblxuICAgIC8vIHkgPSBteCArIGJcbiAgICBjb25zdCB5ID0gc2xvcGUgKiB4ICsgdGhpcy55SW50ZXJjZXB0KCk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICBwb2ludEF0WSh5KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhZKHkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIG14ICsgYiA9IHlcbiAgICAvLyB4ID0gKHkgLSBiKS9tXG4gICAgY29uc3QgeCA9ICh5IC0gdGhpcy55SW50ZXJjZXB0KCkpIC8gc2xvcGU7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICBwb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIHRoZSBpbnRlcnNlY3RpbmcgcG9pbnQgb2YgYHRoaXNgIGFuZCBgb3RoZXJgLiBCb3RoIHJheXMgYXJlXG4gIC8vIGNvbnNpZGVyZWQgbGluZXMgd2l0aG91dCBlbmRwb2ludHMuIFJldHVybnMgbnVsbCBpZiB0aGUgcmF5cyBhcmVcbiAgLy8gcGFyYWxsZWwuXG4gIHBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXIpIHtcbiAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaW5lJUUyJTgwJTkzbGluZV9pbnRlcnNlY3Rpb25cbiAgICBjb25zdCBhID0gdGhpcy5zbG9wZSgpO1xuICAgIGNvbnN0IGIgPSBvdGhlci5zbG9wZSgpO1xuICAgIC8vIFBhcmFsbGVsIGxpbmVzLCBubyBpbnRlcnNlY3Rpb25cbiAgICBpZiAoYSA9PT0gbnVsbCAmJiBiID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoYSwgYikpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIGNvbnN0IGMgPSB0aGlzLnlJbnRlcmNlcHQoKTtcbiAgICBjb25zdCBkID0gb3RoZXIueUludGVyY2VwdCgpO1xuXG5cbiAgICBpZiAoYSA9PT0gbnVsbCkgeyByZXR1cm4gb3RoZXIucG9pbnRBdFgodGhpcy5zdGFydC54KTsgfVxuICAgIGlmIChiID09PSBudWxsKSB7IHJldHVybiB0aGlzLnBvaW50QXRYKG90aGVyLnN0YXJ0LngpOyB9XG5cbiAgICBjb25zdCB4ID0gKGQgLSBjKSAvIChhIC0gYik7XG4gICAgY29uc3QgeSA9IGEgKiB4ICsgYztcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLnJhYywgeCwgeSk7XG4gIH1cblxuXG4gIHBvaW50UHJvamVjdGVkKHBvaW50KSB7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiBwb2ludC5yYXkocGVycGVuZGljdWxhcilcbiAgICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKHRoaXMpO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIGBzdGFydGAgdG8gdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YCBpbiB0aGVcbiAgLy8gcmF5LlxuICAvLyBUaGUgZGlzdGFuY2UgaXMgcG9zaXRpdmUgaWYgdGhlIHByb2plY3RlZCBwb2ludCBpcyBpbiB0aGUgZGlyZWN0aW9uXG4gIC8vIG9mIHRoZSByYXksIGFuZCBuZWdhdGl2ZSBpZiBpdCBpcyBiZWhpbmQuXG4gIGRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHRoaXMucG9pbnRQcm9qZWN0ZWQocG9pbnQpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZVRvUG9pbnQocHJvamVjdGVkKTtcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoZGlzdGFuY2UsIDApKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZVRvUHJvamVjdGVkID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocHJvamVjdGVkKTtcbiAgICBjb25zdCBhbmdsZURpZmYgPSB0aGlzLmFuZ2xlLnN1YnRyYWN0KGFuZ2xlVG9Qcm9qZWN0ZWQpO1xuICAgIGlmIChhbmdsZURpZmYudHVybiA8PSAxLzQgfHwgYW5nbGVEaWZmLnR1cm4gPiAzLzQpIHtcbiAgICAgIHJldHVybiBkaXN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC1kaXN0YW5jZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZ2l2ZW4gcG9pbnQgaXMgbG9jYXRlZCBjbG9ja3dpc2Ugb2YgdGhlIHNlZ21lbnQsXG4gIC8vIG9yIGBmYWxzZWAgaWYgbG9jYXRlZCBjb3VudGVyLWNsb2Nrd2lzZS5cbiAgLy8gcG9pbnRPcmllbnRhdGlvbihwb2ludCkge1xuICAvLyAgIGxldCBhbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50KTtcbiAgLy8gICBsZXQgYW5nbGVEaXN0YW5jZSA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuYW5nbGUpO1xuICAvLyAgIC8vIFswIHRvIDAuNSkgaXMgY29uc2lkZXJlZCBjbG9ja3dpc2VcbiAgLy8gICAvLyBbMC41LCAxKSBpcyBjb25zaWRlcmVkIGNvdW50ZXItY2xvY2t3aXNlXG4gIC8vICAgcmV0dXJuIGFuZ2xlRGlzdGFuY2UudHVybiA8IDAuNTtcbiAgLy8gfVxuXG5cbiAgcmF5VG9Qb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIHNlZ21lbnQobGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcywgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc3RhcnQuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8vIFRPRE86IHNlZ21lbnRUb0ludGVyc2VjdGlvbldpdGhSYXlcblxufSAvLyBjbGFzcyBSYXlcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJheTtcblxuXG4vLyBSYXkucHJvdG90eXBlLnRyYW5zbGF0ZVRvQW5nbGUgPSBmdW5jdGlvbihzb21lQW5nbGUsIGRpc3RhbmNlKSB7XG4vLyAgIGxldCBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKHNvbWVBbmdsZSk7XG4vLyAgIGxldCBvZmZzZXQgPSByYWMuUG9pbnQuemVyby5wb2ludFRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbi8vICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQuYWRkUG9pbnQob2Zmc2V0KSwgdGhpcy5hbmdsZSk7XG4vLyB9O1xuXG4vLyBSYXkucHJvdG90eXBlLnRyYW5zbGF0ZVRvRGlzdGFuY2UgPSBmdW5jdGlvbihkaXN0YW5jZSkge1xuLy8gICBsZXQgb2Zmc2V0ID0gcmFjLlBvaW50Lnplcm8ucG9pbnRUb0FuZ2xlKHRoaXMuYW5nbGUsIGRpc3RhbmNlKTtcbi8vICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQuYWRkUG9pbnQob2Zmc2V0KSwgdGhpcy5hbmdsZSk7XG4vLyB9O1xuXG4vLyBSYXkucHJvdG90eXBlLnRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIgPSBmdW5jdGlvbihkaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuLy8gICBsZXQgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuLy8gICByZXR1cm4gdGhpcy50cmFuc2xhdGVUb0FuZ2xlKHBlcnBlbmRpY3VsYXIsIGRpc3RhbmNlKTtcbi8vIH07XG5cblxuXG4vLyBSZXR1cm5zIGFuIGNvbXBsZXRlIGNpcmNsZSBBcmMgdXNpbmcgdGhpcyBzZWdtZW50IGBzdGFydGAgYXMgY2VudGVyLFxuLy8gYGxlbmd0aCgpYCBhcyByYWRpdXNtLCBhbmQgYGFuZ2xlYCBhcyBzdGFydCBhbmQgZW5kIGFuZ2xlcy5cbi8vIFJheS5wcm90b3R5cGUuYXJjID0gZnVuY3Rpb24ocmFkaXVzLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4vLyAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbi8vICAgICB0aGlzLnN0YXJ0LCByYWRpdXMsXG4vLyAgICAgdGhpcy5hbmdsZSwgdGhpcy5hbmdsZSxcbi8vICAgICBjbG9ja3dpc2UpO1xuLy8gfTtcblxuXG4vLyBSZXR1cm5zIGFuIEFyYyB1c2luZyB0aGlzIHNlZ21lbnQgYHN0YXJ0YCBhcyBjZW50ZXIsIGBsZW5ndGgoKWAgYXNcbi8vIHJhZGl1cywgc3RhcnRpbmcgZnJvbSB0aGUgYGFuZ2xlYCB0byB0aGUgYXJjIGRpc3RhbmNlIG9mIHRoZSBnaXZlblxuLy8gYW5nbGUgYW5kIG9yaWVudGF0aW9uLlxuLy8gUmF5LnByb3RvdHlwZS5hcmNXaXRoQW5nbGVEaXN0YW5jZSA9IGZ1bmN0aW9uKHNvbWVBbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4vLyAgIGxldCBhbmdsZURpc3RhbmNlID0gcmFjLkFuZ2xlLmZyb20oc29tZUFuZ2xlRGlzdGFuY2UpO1xuLy8gICBsZXQgYXJjU3RhcnQgPSB0aGlzLmFuZ2xlO1xuLy8gICBsZXQgYXJjRW5kID0gYXJjU3RhcnQuc2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcblxuLy8gICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4vLyAgICAgdGhpcy5zdGFydCwgdGhpcy5sZW5ndGgoKSxcbi8vICAgICBhcmNTdGFydCwgYXJjRW5kLFxuLy8gICAgIGNsb2Nrd2lzZSk7XG4vLyB9O1xuXG4vLyBSZXR1cm5zIGEgc2VnbWVudCBmcm9tIGB0aGlzLnN0YXJ0YCB0byB0aGUgaW50ZXJzZWN0aW9uIGJldHdlZW4gYHRoaXNgXG4vLyBhbmQgYG90aGVyYC5cbi8vIFJheS5wcm90b3R5cGUuc2VnbWVudFRvSW50ZXJzZWN0aW9uV2l0aFJheSA9IGZ1bmN0aW9uKHJheSkge1xuLy8gICBsZXQgZW5kID0gdGhpcy5wb2ludEF0SW50ZXJzZWN0aW9uV2l0aFJheShyYXkucmF5KTtcbi8vICAgaWYgKGVuZCA9PT0gbnVsbCkge1xuLy8gICAgIHJldHVybiBudWxsO1xuLy8gICB9XG4vLyAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBlbmQpO1xuLy8gfTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFNlZ21lbnQgb2YgYSByYXkgdXAgdG8gYSBnaXZlbiBsZW5ndGguXG4qIEBhbGlhcyBSYWMuU2VnbWVudFxuKi9cbmNsYXNzIFNlZ21lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgcmF5LCBsZW5ndGgpIHtcbiAgICAvLyBUT0RPOiB8fCB0aHJvdyBuZXcgRXJyb3IoZXJyLm1pc3NpbmdQYXJhbWV0ZXJzKVxuICAgIC8vIG9yXG4gICAgLy8gY2hlY2tlcihtc2cgPT4geyB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChtc2cpKTtcbiAgICAvLyAgIC5leGlzdHMocmFjKVxuICAgIC8vICAgLmlzVHlwZShSYWMuUmF5LCByYXkpXG4gICAgLy8gICAuaXNOdW1iZXIobGVuZ3RoKVxuXG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgcmF5LCBsZW5ndGgpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlJheSwgcmF5KTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIobGVuZ3RoKTtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnJheSA9IHJheTtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYFNlZ21lbnQoKCR7dGhpcy5yYXkuc3RhcnQueH0sJHt0aGlzLnJheS5zdGFydC55fSkgYToke3RoaXMucmF5LmFuZ2xlLnR1cm59IGw6JHt0aGlzLmxlbmd0aH0pYDtcbiAgfVxuXG4gIGFuZ2xlKCkge1xuICAgIHJldHVybiB0aGlzLnJheS5hbmdsZTtcbiAgfVxuXG4gIHN0YXJ0UG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnN0YXJ0O1xuICB9XG5cbiAgZW5kUG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBzbG9wZSBvZiB0aGUgc2VnbWVudCwgb3IgYG51bGxgIGlmIHRoZSBzZWdtZW50IGlzIHBhcnQgb2YgYVxuICAvLyB2ZXJ0aWNhbCBsaW5lLlxuICBzbG9wZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc2xvcGUoKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIHktaW50ZXJjZXB0LCBvciBgbnVsbGAgaWYgdGhlIHNlZ21lbnQgaXMgcGFydCBvZiBhXG4gIC8vIHZlcnRpY2FsIGxpbmUuXG4gIHlJbnRlcmNlcHQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnlJbnRlcmNlcHQoKTtcbiAgfVxuXG4gIHdpdGhSYXkobmV3UmF5KSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG4gIHdpdGhTdGFydFBvaW50KG5ld1N0YXJ0UG9pbnQpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoU3RhcnQobmV3U3RhcnRQb2ludCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG4gIHdpdGhFbmRQb2ludChuZXdFbmRQb2ludCkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnJheVRvUG9pbnQobmV3RW5kUG9pbnQpO1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IHRoaXMucmF5LnN0YXJ0LmRpc3RhbmNlVG9Qb2ludChuZXdFbmRQb2ludCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuICB3aXRoTGVuZ3RoKG5ld0xlbmd0aCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIHdpdGhMZW5ndGhBZGQoYWRkTGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgdGhpcy5sZW5ndGggKyBhZGRMZW5ndGgpO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIGEgbmV3IHNlZ21lbnQgZnJvbSBgc3RhcnRgIHRvIGEgbGVuZ3RoIGRldGVybWluZWQgYnlcbiAgLy8gYHJhdGlvKmxlbmd0aGAuXG4gIHdpdGhMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoICogcmF0aW8pO1xuICB9XG5cblxuICB3aXRoQW5nbGVBZGQoc29tZUFuZ2xlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aEFuZ2xlQWRkKHNvbWVBbmdsZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICB3aXRoQW5nbGVTaGlmdChzb21lQW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoQW5nbGVTaGlmdChzb21lQW5nbGUsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgd2l0aFN0YXJ0RXh0ZW5kZWQobGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aFN0YXJ0QXREaXN0YW5jZSgtbGVuZ3RoKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGggKyBsZW5ndGgpO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIGEgbmV3IHNlZ21lbnQgZnJvbSBgdGhpcy5zdGFydGAsIHdpdGggdGhlIHNhbWUgbGVuZ3RoLCB0aGF0IGlzXG4gIC8vIHBlcnBlbmRpY3VsYXIgdG8gYHRoaXNgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgLy8gVE9ETzogbmVlZHMgdXBkYXRlXG4gIC8vIHdpdGhQZXJwZW5kaWN1bGFyQW5nbGUoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAvLyAgIHJldHVybiB0aGlzLndpdGhBbmdsZVNoaWZ0KHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgY2xvY2t3aXNlKTtcbiAgLy8gfVxuXG5cbiAgcmV2ZXJzZSgpIHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgaW52ZXJzZVJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBlbmQsIHRoaXMucmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBpbnZlcnNlUmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIHBvaW50QXRYKHgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdFgoeCk7XG4gIH1cblxuXG4gIHBvaW50QXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQucG9pbnRUb0FuZ2xlKHRoaXMuYW5nbGUoKSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgcG9pbnRBdExlbmd0aFJhdGlvKGxlbmd0aFJhdGlvKSB7XG4gICAgbGV0IG5ld0xlbmd0aCA9IHRoaXMubGVuZ3RoKCkgKiBsZW5ndGhSYXRpbztcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSgpLCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIHRoZSBpbnRlcnNlY3RpbmcgcG9pbnQgb2YgYHRoaXNgIGFuZCB0aGUgcmF5IGBvdGhlcmAuIEJvdGggYXJlXG4gIC8vIGNvbnNpZGVyZWQgbGluZXMgd2l0aG91dCBlbmRwb2ludHMuIFJldHVybnMgbnVsbCBpZiB0aGUgbGluZXMgYXJlXG4gIC8vIHBhcmFsbGVsLlxuICBwb2ludEF0SW50ZXJzZWN0aW9uV2l0aFJheShvdGhlcikge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0SW50ZXJzZWN0aW9uKG90aGVyKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogaW1wbGVtZW50IG1vdmVTdGFydFBvaW50LCB3aGljaCByZXRhaW5zIHRoZSBwb3NpdGlvbiBvZiBlbmRQb2ludFxuXG5cbiAgdHJhbnNsYXRlVG9Db29yZGluYXRlcyh4LCB5KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgICByZXR1cm4gdGhpcy53aXRoU3RhcnRQb2ludChuZXdTdGFydCk7XG4gIH1cblxuXG4gIHRyYW5zbGF0ZVRvQW5nbGUoc29tZUFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5yYXkuc3RhcnQucG9pbnRUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSk7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN0YXJ0UG9pbnQobmV3U3RhcnQpO1xuICB9XG5cblxuICB0cmFuc2xhdGVUb0xlbmd0aChkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKGRpc3RhbmNlKTtcbiAgICByZXR1cm4gdGhpcy53aXRoU3RhcnRQb2ludChuZXdTdGFydCk7XG4gIH1cblxuICB0cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnJheS5zdGFydC5wb2ludFRvQW5nbGUocGVycGVuZGljdWxhciwgZGlzdGFuY2UpO1xuICAgIHJldHVybiB0aGlzLndpdGhTdGFydFBvaW50KG5ld1N0YXJ0KTtcbiAgfVxuXG5cbiAgLy8gUmV0dXJucyBhIG5ldyBzZWdtZW50IGZyb20gYGVuZGAgd2l0aCB0aGUgZ2l2ZW4gYGxlbmd0aGAgd2l0aCB0aGUgc2FtZVxuICAvLyBhbmdsZSBhcyBgdGhpc2AuXG4gIC8vIFRPRE86IG5lZWRzIHVwZGF0ZVxuICAvLyBuZXh0U2VnbWVudFdpdGhMZW5ndGgobGVuZ3RoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuZW5kLnNlZ21lbnRUb0FuZ2xlKHRoaXMuYW5nbGUoKSwgbGVuZ3RoKTtcbiAgLy8gfVxuXG4gIC8vIFJldHVybnMgYSBuZXcgc2VnbWVudCBmcm9tIGBlbmRgIHRvIHRoZSBnaXZlbiBgbmV4dEVuZGAuXG4gIG5leHRTZWdtZW50VG9Qb2ludChuZXh0RW5kKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgcmV0dXJuIG5ld1N0YXJ0LnNlZ21lbnRUb1BvaW50KG5leHRFbmQsIHRoaXMucmF5LmFuZ2xlKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBuZXcgc2VnbWVudCBmcm9tIGBlbmRgIHRvIHRoZSBnaXZlbiBgc29tZUFuZ2xlYCBhbmQgYGRpc3RhbmNlYC5cbiAgLy8gVE9ETzogbmVlZHMgdXBkYXRlXG4gIC8vIG5leHRTZWdtZW50VG9BbmdsZShzb21lQW5nbGUsIGRpc3RhbmNlKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuZW5kLnNlZ21lbnRUb0FuZ2xlKHNvbWVBbmdsZSwgZGlzdGFuY2UpO1xuICAvLyB9XG5cbiAgLy8gUmV0dXJucyBhIG5ldyBzZWdtZW50IGZyb20gYGVuZFBvaW50KClgLCB3aXRoIGFuIGFuZ2xlIHNoaWZ0ZWQgZnJvbVxuICAvLyBgYW5nbGUoKS5pbnZlcnNlKClgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgLy9cbiAgLy8gVGhpcyBtZWFucyB0aGF0IHdpdGggYW4gYW5nbGUgc2hpZnQgb2YgYDBgIHRoZSBuZXh0IHNlZ21lbnQgd2lsbCBoYXZlXG4gIC8vIHRoZSBpbnZlcnNlIGFuZ2xlIG9mIGB0aGlzYCwgYXMgdGhlIGFuZ2xlIHNoaWZ0IGluY3JlYXNlcyB0aGUgbmV4dFxuICAvLyBzZWdtZW50IHNlcGFyYXRlcyBmcm9tIGB0aGlzYC5cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlU2hpZnQoc29tZUFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlLCBsZW5ndGggPSBudWxsKSB7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsID8gdGhpcy5sZW5ndGggOiBsZW5ndGg7XG4gICAgY29uc3QgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHNvbWVBbmdsZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXlcbiAgICAgIC53aXRoU3RhcnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoKVxuICAgICAgLmludmVyc2UoKVxuICAgICAgLndpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIGEgbmV3IHNlZ21lbnQgZnJvbSBgdGhpcy5lbmRgLCB3aXRoIHRoZSBzYW1lIGxlbmd0aCwgdGhhdCBpc1xuICAvLyBwZXJwZW5kaWN1bGFyIHRvIGBhbmdsZSgpLmludmVyc2UoKWAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICBuZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAud2l0aFN0YXJ0QXREaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5wZXJwZW5kaWN1bGFyKCFjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBgdmFsdWVgIGNsYW1wZWQgdG8gdGhlIGdpdmVuIGluc2V0cyBmcm9tIHplcm8gYW5kIHRoZSBsZW5ndGhcbiAgLy8gb2YgdGhlIHNlZ21lbnQuXG4gIC8vIFRPRE86IGludmFsaWQgcmFuZ2UgY291bGQgcmV0dXJuIGEgdmFsdWUgY2VudGVyZWQgaW4gdGhlIGluc2V0cyEgbW9yZSB2aXN1YWxseSBjb25ncnVlbnRcbiAgLy8gSWYgdGhlIGBzdGFydC9lbmRJbnNldGAgdmFsdWVzIHJlc3VsdCBpbiBhIGNvbnRyYWRpY3RvcnkgcmFuZ2UsIHRoZVxuICAvLyByZXR1cm5lZCB2YWx1ZSB3aWxsIGNvbXBseSB3aXRoIGBzdGFydEluc2V0YC5cbiAgY2xhbXBUb0xlbmd0aEluc2V0cyh2YWx1ZSwgc3RhcnRJbnNldCA9IDAsIGVuZEluc2V0ID0gMCkge1xuICAgIGxldCBjbGFtcGVkID0gdmFsdWU7XG4gICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQpO1xuICAgIC8vIENvbXBseSBhdCBsZWFzdCB3aXRoIHN0YXJ0SW5zZXRcbiAgICBjbGFtcGVkID0gTWF0aC5tYXgoY2xhbXBlZCwgc3RhcnRJbnNldCk7XG4gICAgcmV0dXJuIGNsYW1wZWQ7XG4gIH1cblxuICBwb2ludEF0QmlzZWN0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG4gIHByb2plY3RlZFBvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnByb2plY3RlZFBvaW50KHBvaW50KTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGxlbmd0aCBmcm9tIGBzdGFydFBvaW50KClgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgaW5cbiAgLy8gdGhlIHNlZ21lbnQuXG4gIC8vIFRoZSBsZW5ndGggaXMgcG9zaXRpdmUgaWYgdGhlIHByb2plY3RlZCBwb2ludCBpcyBpbiB0aGUgZGlyZWN0aW9uXG4gIC8vIG9mIHRoZSBzZWdtZW50IHJheSwgYW5kIG5lZ2F0aXZlIGlmIGl0IGlzIGJlaGluZC5cbiAgbGVuZ3RoVG9Qcm9qZWN0ZWRQb2ludChwb2ludCkge1xuICAgIHJldHVybiB0aGlzLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnQpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGdpdmVuIHBvaW50IGlzIGxvY2F0ZWQgY2xvY2t3aXNlIG9mIHRoZSBzZWdtZW50LFxuICAvLyBvciBgZmFsc2VgIGlmIGxvY2F0ZWQgY291bnRlci1jbG9ja3dpc2UuXG4gIC8vIFRPRE86IG5lZWRzIHVwZGF0ZVxuICAvLyBwb2ludE9yaWVudGF0aW9uKHBvaW50KSB7XG4gIC8vICAgbGV0IGFuZ2xlID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQpO1xuICAvLyAgIGxldCBhbmdsZURpc3RhbmNlID0gYW5nbGUuc3VidHJhY3QodGhpcy5hbmdsZSgpKTtcbiAgLy8gICAvLyBbMCB0byAwLjUpIGlzIGNvbnNpZGVyZWQgY2xvY2t3aXNlXG4gIC8vICAgLy8gWzAuNSwgMSkgaXMgY29uc2lkZXJlZCBjb3VudGVyLWNsb2Nrd2lzZVxuICAvLyAgIHJldHVybiBhbmdsZURpc3RhbmNlLnR1cm4gPCAwLjU7XG4gIC8vIH1cblxuXG4gIC8vIFJldHVybnMgYSBuZXcgc2VnbWVudCBmcm9tIGBzdGFydGAgdG8gYHBvaW50QXRCaXNlY3RvcmAuXG4gIHNlZ21lbnRUb0Jpc2VjdG9yKCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoLzIpO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIGEgc2VnbWVudCBmcm9tIGB0aGlzLnN0YXJ0YCB0byB0aGUgaW50ZXJzZWN0aW9uIGJldHdlZW4gYHRoaXNgXG4gIC8vIGFuZCBgb3RoZXJgLlxuICBzZWdtZW50VG9JbnRlcnNlY3Rpb25XaXRoUmF5KHJheSkge1xuICAgIGxldCBpbnRlcnNlY3Rpb24gPSB0aGlzLnBvaW50QXRJbnRlcnNlY3Rpb25XaXRoUmF5KHJheSk7XG4gICAgaWYgKGludGVyc2VjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJheS5zZWdtZW50VG9Qb2ludChpbnRlcnNlY3Rpb24pO1xuICB9XG5cblxuICAvLyBSZXR1cm5zIGFuIGNvbXBsZXRlIGNpcmNsZSBBcmMgdXNpbmcgdGhpcyBzZWdtZW50IGBzdGFydGAgYXMgY2VudGVyLFxuICAvLyBgbGVuZ3RoKClgIGFzIHJhZGl1c20sIGFuZCBgYW5nbGUoKWAgYXMgc3RhcnQgYW5kIGVuZCBhbmdsZXMuXG4gIC8vIFJldHVybnMgYW4gQXJjIHVzaW5nIHRoaXMgc2VnbWVudCBgc3RhcnRgIGFzIGNlbnRlciwgYGxlbmd0aCgpYCBhc1xuICAvLyByYWRpdXMsIHN0YXJ0aW5nIGZyb20gdGhlIGBhbmdsZSgpYCB0byB0aGUgZ2l2ZW4gYW5nbGUgYW5kIG9yaWVudGF0aW9uLlxuICBhcmMoc29tZUFuZ2xlRW5kID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBhbmdsZUVuZCA9IHNvbWVBbmdsZUVuZCA9PT0gbnVsbFxuICAgICAgPyB0aGlzLnJheS5hbmdsZVxuICAgICAgOnRoaXMucmFjLkFuZ2xlLmZyb20oc29tZUFuZ2xlRW5kKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnJheS5zdGFydCwgdGhpcy5sZW5ndGgsXG4gICAgICB0aGlzLnJheS5hbmdsZSwgYW5nbGVFbmQsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cbn0gLy8gU2VnbWVudFxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VnbWVudDtcblxuXG4vLyBSZXR1cm5zIGFuIEFyYyB1c2luZyB0aGlzIHNlZ21lbnQgYHN0YXJ0YCBhcyBjZW50ZXIsIGBsZW5ndGgoKWAgYXNcbi8vIHJhZGl1cywgc3RhcnRpbmcgZnJvbSB0aGUgYGFuZ2xlKClgIHRvIHRoZSBhcmMgZGlzdGFuY2Ugb2YgdGhlIGdpdmVuXG4vLyBhbmdsZSBhbmQgb3JpZW50YXRpb24uXG5TZWdtZW50LnByb3RvdHlwZS5hcmNXaXRoQW5nbGVEaXN0YW5jZSA9IGZ1bmN0aW9uKHNvbWVBbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gIGxldCBhbmdsZURpc3RhbmNlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzb21lQW5nbGVEaXN0YW5jZSk7XG4gIGxldCBhcmNTdGFydCA9IHRoaXMuYW5nbGUoKTtcbiAgbGV0IGFyY0VuZCA9IGFyY1N0YXJ0LnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG5cbiAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgIHRoaXMuc3RhcnQsIHRoaXMubGVuZ3RoKCksXG4gICAgYXJjU3RhcnQsIGFyY0VuZCxcbiAgICBjbG9ja3dpc2UpO1xufTtcblxuXG5TZWdtZW50LnByb3RvdHlwZS5vcHBvc2l0ZVdpdGhIeXAgPSBmdW5jdGlvbihoeXBvdGVudXNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gIC8vIGNvcyA9IGFkeSAvIGh5cFxuICAvLyBhY29zIGNhbiBlcnJvciBpZiBoeXBvdGVudXNlIGlzIHNtYWxsZXIgdGhhdCBsZW5ndGhcbiAgbGV0IHJhZGlhbnMgPSBNYXRoLmFjb3ModGhpcy5sZW5ndGgoKSAvIGh5cG90ZW51c2UpO1xuICBsZXQgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tUmFkaWFucyhyYWRpYW5zKTtcblxuICBsZXQgaHlwU2VnbWVudCA9IHRoaXMucmV2ZXJzZSgpXG4gICAgLm5leHRTZWdtZW50VG9BbmdsZVNoaWZ0KGFuZ2xlLCAhY2xvY2t3aXNlLCBoeXBvdGVudXNlKTtcbiAgcmV0dXJuIHRoaXMuZW5kLnNlZ21lbnRUb1BvaW50KGh5cFNlZ21lbnQuZW5kKTtcbn07XG5cbi8vIFJldHVybnMgYSBuZXcgc2VnbWVudCB0aGF0IHN0YXJ0cyBmcm9tIGBwb2ludEF0QmlzZWN0b3JgIGluIHRoZSBnaXZlblxuLy8gYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG5TZWdtZW50LnByb3RvdHlwZS5zZWdtZW50RnJvbUJpc2VjdG9yID0gZnVuY3Rpb24obGVuZ3RoLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gIGxldCBhbmdsZSA9IGNsb2Nrd2lzZVxuICAgID8gdGhpcy5hbmdsZSgpLmFkZCh0aGlzLnJhYy5BbmdsZS5zcXVhcmUpXG4gICAgOiB0aGlzLmFuZ2xlKCkuYWRkKHRoaXMucmFjLkFuZ2xlLnNxdWFyZS5uZWdhdGl2ZSgpKTtcbiAgcmV0dXJuIHRoaXMucG9pbnRBdEJpc2VjdG9yKCkuc2VnbWVudFRvQW5nbGUoYW5nbGUsIGxlbmd0aCk7XG59O1xuXG5TZWdtZW50LnByb3RvdHlwZS5iZXppZXJDZW50cmFsQW5jaG9yID0gZnVuY3Rpb24oZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgbGV0IGJpc2VjdG9yID0gdGhpcy5zZWdtZW50RnJvbUJpc2VjdG9yKGRpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgdGhpcy5zdGFydCwgYmlzZWN0b3IuZW5kLFxuICAgIGJpc2VjdG9yLmVuZCwgdGhpcy5lbmQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuZnVuY3Rpb24gU2hhcGUocmFjKSB7XG4gIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuXG4gIHRoaXMucmFjID0gcmFjO1xuICB0aGlzLm91dGxpbmUgPSBuZXcgUmFjLkNvbXBvc2l0ZShyYWMpO1xuICB0aGlzLmNvbnRvdXIgPSBuZXcgUmFjLkNvbXBvc2l0ZShyYWMpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGU7XG5cblxuU2hhcGUucHJvdG90eXBlLmFkZE91dGxpbmUgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIHRoaXMub3V0bGluZS5hZGQoZWxlbWVudCk7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuYWRkQ29udG91ciA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgdGhpcy5jb250b3VyLmFkZChlbGVtZW50KTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBGb3JtYXQgZm9yIGRyYXdpbmcgYSBgVGV4dGAgb2JqZWN0LlxuKiBAYWxpYXMgUmFjLlRleHQuRm9ybWF0XG4qL1xuY2xhc3MgVGV4dEZvcm1hdCB7XG5cbiAgc3RhdGljIGRlZmF1bHRTaXplID0gMTU7XG5cbiAgc3RhdGljIGhvcml6b250YWwgPSB7XG4gICAgbGVmdDogXCJsZWZ0XCIsXG4gICAgY2VudGVyOiBcImhvcml6b250YWxDZW50ZXJcIixcbiAgICByaWdodDogXCJyaWdodFwiXG4gIH07XG5cbiAgc3RhdGljIHZlcnRpY2FsID0ge1xuICAgIHRvcDogXCJ0b3BcIixcbiAgICBib3R0b206IFwiYm90dG9tXCIsXG4gICAgY2VudGVyOiBcInZlcnRpY2FsQ2VudGVyXCIsXG4gICAgYmFzZWxpbmU6IFwiYmFzZWxpbmVcIlxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGhvcml6b250YWwsIHZlcnRpY2FsLFxuICAgIGZvbnQgPSBudWxsLFxuICAgIGFuZ2xlID0gcmFjLkFuZ2xlLnplcm8sXG4gICAgc2l6ZSA9IFRleHRGb3JtYXQuZGVmYXVsdFNpemUpXG4gIHtcbiAgICB0aGlzLmhvcml6b250YWwgPSBob3Jpem9udGFsO1xuICAgIHRoaXMudmVydGljYWwgPSB2ZXJ0aWNhbDtcbiAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgICB0aGlzLnNpemUgPSBzaXplO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIGZvcm1hdCB0byBkcmF3IHRleHQgaW4gdGhlIHNhbWUgcG9zaXRpb24gYXMgYHNlbGZgIHdpdGhcbiAgLy8gdGhlIGludmVyc2UgYW5nbGUuXG4gIGludmVyc2UoKSB7XG4gICAgbGV0IGhFbnVtID0gVGV4dEZvcm1hdC5ob3Jpem9udGFsO1xuICAgIGxldCB2RW51bSA9IFRleHRGb3JtYXQudmVydGljYWw7XG4gICAgbGV0IGhvcml6b250YWwsIHZlcnRpY2FsO1xuICAgIHN3aXRjaCAodGhpcy5ob3Jpem9udGFsKSB7XG4gICAgICBjYXNlIGhFbnVtLmxlZnQ6XG4gICAgICAgIGhvcml6b250YWwgPSBoRW51bS5yaWdodDsgYnJlYWs7XG4gICAgICBjYXNlIGhFbnVtLnJpZ2h0OlxuICAgICAgICBob3Jpem9udGFsID0gaEVudW0ubGVmdDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBob3Jpem9udGFsID0gdGhpcy5ob3Jpem9udGFsOyBicmVhaztcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICBjYXNlIHZFbnVtLnRvcDpcbiAgICAgICAgdmVydGljYWwgPSB2RW51bS5ib3R0b207IGJyZWFrO1xuICAgICAgY2FzZSB2RW51bS5ib3R0b206XG4gICAgICAgIHZlcnRpY2FsID0gdkVudW0udG9wOyBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZlcnRpY2FsID0gdGhpcy52ZXJ0aWNhbDsgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KFxuICAgICAgaG9yaXpvbnRhbCwgdmVydGljYWwsXG4gICAgICB0aGlzLmZvbnQsXG4gICAgICB0aGlzLmFuZ2xlLmludmVyc2UoKSxcbiAgICAgIHRoaXMuc2l6ZSlcbiAgfVxuXG59IC8vIGNsYXNzIFRleHRGb3JtYXRcblxuXG4vKipcbiogU3RyaW5nLCBmb3JtYXQsIGFuZCBwb3NpdGlvbiB0byBkcmF3IGEgdGV4dC5cbiogQGFsaWFzIFJhYy5UZXh0XG4qL1xuY2xhc3MgVGV4dCB7XG5cbiAgc3RhdGljIEZvcm1hdCA9IFRleHRGb3JtYXQ7XG5cbiAgY29uc3RydWN0b3IocmFjLCBwb2ludCwgc3RyaW5nLCBmb3JtYXQpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBwb2ludCwgc3RyaW5nLCBmb3JtYXQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBwb2ludCk7XG4gICAgdXRpbHMuYXNzZXJ0U3RyaW5nKHN0cmluZyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShUZXh0LkZvcm1hdCwgZm9ybWF0KTtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnBvaW50ID0gcG9pbnQ7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgdGhpcy5mb3JtYXQgPSBmb3JtYXQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgVGV4dCgoJHt0aGlzLnBvaW50Lnh9LCR7dGhpcy5wb2ludC55fSkgXCIke3RoaXMuc3RyaW5nfVwiKWA7XG4gIH1cblxufSAvLyBjbGFzcyBUZXh0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogVGhlIGByYWMuQW5nbGVgIGZ1bmN0aW9uIGNvbnRhaW5zIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgZm9yIGNvbnZlbmllbmNlXG4qIGB7QGxpbmsgUmFjLkFuZ2xlfWAgb2JqZWN0cyB3aXRoIHRoZSBjdXJyZW50IGByYWNgIGluc3RhbmNlLlxuKiBAbmFtZXNwYWNlIHJhYy5BbmdsZVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjQW5nbGUocmFjKSB7XG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIHByb2R1Y2VkIHdpdGggYHNvbWV0aGluZ2AuIENhbGxzXG4gICogYHtAbGluayBSYWMuQW5nbGUuZnJvbX1gIHVzaW5nIGB0aGlzYC5cbiAgKiBAbmFtZSBmcm9tXG4gICogQG1lbWJlcm9mIHJhYy5BbmdsZSNcbiAgKiBAZnVuY3Rpb25cbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb20gPSBmdW5jdGlvbihzb21ldGhpbmcpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb20ocmFjLCBzb21ldGhpbmcpO1xuICB9O1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAwYC5cbiAgKiBAbmFtZSB6ZXJvXG4gICogQG1lbWJlcm9mIHJhYy5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnplcm8gPSAgICByYWMuQW5nbGUoMC4wKTtcbiAgcmFjLkFuZ2xlLnNxdWFyZSA9ICByYWMuQW5nbGUoMS80KTtcbiAgcmFjLkFuZ2xlLmludmVyc2UgPSByYWMuQW5nbGUoMS8yKTtcblxuICByYWMuQW5nbGUuaGFsZiA9ICAgIHJhYy5BbmdsZSgxLzIpO1xuICByYWMuQW5nbGUucXVhcnRlciA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUuZWlnaHRoID0gIHJhYy5BbmdsZSgxLzgpO1xuICByYWMuQW5nbGUubmVpZ2h0aCA9ICByYWMuQW5nbGUoLTEvOCk7XG5cbiAgcmFjLkFuZ2xlLmUgPSByYWMuQW5nbGUoMC80KTtcbiAgcmFjLkFuZ2xlLnMgPSByYWMuQW5nbGUoMS80KTtcbiAgcmFjLkFuZ2xlLncgPSByYWMuQW5nbGUoMi80KTtcbiAgcmFjLkFuZ2xlLm4gPSByYWMuQW5nbGUoMy80KTtcblxuICByYWMuQW5nbGUuZWFzdCAgPSByYWMuQW5nbGUuZTtcbiAgcmFjLkFuZ2xlLnNvdXRoID0gcmFjLkFuZ2xlLnM7XG4gIHJhYy5BbmdsZS53ZXN0ICA9IHJhYy5BbmdsZS53O1xuICByYWMuQW5nbGUubm9ydGggPSByYWMuQW5nbGUubjtcblxuICByYWMuQW5nbGUubmUgPSByYWMuQW5nbGUubi5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLnNlID0gcmFjLkFuZ2xlLmUuYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5zdyA9IHJhYy5BbmdsZS5zLmFkZCgxLzgpO1xuICByYWMuQW5nbGUubncgPSByYWMuQW5nbGUudy5hZGQoMS84KTtcblxuICAvLyBOb3J0aCBub3J0aC1lYXN0XG4gIHJhYy5BbmdsZS5ubmUgPSByYWMuQW5nbGUubmUuYWRkKC0xLzE2KTtcbiAgLy8gRWFzdCBub3J0aC1lYXN0XG4gIHJhYy5BbmdsZS5lbmUgPSByYWMuQW5nbGUubmUuYWRkKCsxLzE2KTtcbiAgLy8gTm9ydGgtZWFzdCBub3J0aFxuICByYWMuQW5nbGUubmVuID0gcmFjLkFuZ2xlLm5uZTtcbiAgLy8gTm9ydGgtZWFzdCBlYXN0XG4gIHJhYy5BbmdsZS5uZWUgPSByYWMuQW5nbGUuZW5lO1xuXG4gIC8vIEVhc3Qgc291dGgtZWFzdFxuICByYWMuQW5nbGUuZXNlID0gcmFjLkFuZ2xlLnNlLmFkZCgtMS8xNik7XG4gIC8vIFNvdXRoIHNvdXRoLWVhc3RcbiAgcmFjLkFuZ2xlLnNzZSA9IHJhYy5BbmdsZS5zZS5hZGQoKzEvMTYpO1xuICAvLyBTb3V0aC1lYXN0IGVhc3RcbiAgcmFjLkFuZ2xlLnNlZSA9IHJhYy5BbmdsZS5lc2U7XG4gIC8vIFNvdXRoLWVhc3Qgc291dGhcbiAgcmFjLkFuZ2xlLnNlcyA9IHJhYy5BbmdsZS5zc2U7XG5cbiAgLy8gU291dGggc291dGgtd2VzdFxuICByYWMuQW5nbGUuc3N3ID0gcmFjLkFuZ2xlLnN3LmFkZCgtMS8xNik7XG4gIC8vIFdlc3Qgc291dGgtd2VzdFxuICByYWMuQW5nbGUud3N3ID0gcmFjLkFuZ2xlLnN3LmFkZCgrMS8xNik7XG4gIC8vIFNvdXRoLXdlc3Qgc291dGhcbiAgcmFjLkFuZ2xlLnN3cyA9IHJhYy5BbmdsZS5zc3c7XG4gIC8vIFNvdXRoLXdlc3Qgd2VzdFxuICByYWMuQW5nbGUuc3d3ID0gcmFjLkFuZ2xlLndzdztcblxuICAvLyBXZXN0IG5vcnRoLXdlc3RcbiAgcmFjLkFuZ2xlLndudyA9IHJhYy5BbmdsZS5udy5hZGQoLTEvMTYpO1xuICAvLyBOb3J0aCBub3J0aC13ZXN0XG4gIHJhYy5BbmdsZS5ubncgPSByYWMuQW5nbGUubncuYWRkKCsxLzE2KTtcbiAgLy8gTm9ydC1od2VzdCB3ZXN0XG4gIHJhYy5BbmdsZS5ud3cgPSByYWMuQW5nbGUud253O1xuICAvLyBOb3J0aC13ZXN0IG5vcnRoXG4gIHJhYy5BbmdsZS5ud24gPSByYWMuQW5nbGUubm53O1xuXG4gIHJhYy5BbmdsZS5yaWdodCA9IHJhYy5BbmdsZS5lO1xuICByYWMuQW5nbGUuZG93biAgPSByYWMuQW5nbGUucztcbiAgcmFjLkFuZ2xlLmxlZnQgID0gcmFjLkFuZ2xlLnc7XG4gIHJhYy5BbmdsZS51cCAgICA9IHJhYy5BbmdsZS5uO1xuXG4gIHJhYy5BbmdsZS5yID0gcmFjLkFuZ2xlLnJpZ2h0O1xuICByYWMuQW5nbGUuZCA9IHJhYy5BbmdsZS5kb3duO1xuICByYWMuQW5nbGUubCA9IHJhYy5BbmdsZS5sZWZ0O1xuICByYWMuQW5nbGUudSA9IHJhYy5BbmdsZS51cDtcblxuICByYWMuQW5nbGUudG9wICAgID0gcmFjLkFuZ2xlLnVwO1xuICByYWMuQW5nbGUuYm90dG9tID0gcmFjLkFuZ2xlLmRvd247XG4gIHJhYy5BbmdsZS50ICAgICAgPSByYWMuQW5nbGUudG9wO1xuICByYWMuQW5nbGUuYiAgICAgID0gcmFjLkFuZ2xlLmJvdHRvbTtcblxuICByYWMuQW5nbGUudG9wUmlnaHQgICAgPSByYWMuQW5nbGUubmU7XG4gIHJhYy5BbmdsZS50ciAgICAgICAgICA9IHJhYy5BbmdsZS5uZTtcbiAgcmFjLkFuZ2xlLnRvcExlZnQgICAgID0gcmFjLkFuZ2xlLm53O1xuICByYWMuQW5nbGUudGwgICAgICAgICAgPSByYWMuQW5nbGUubnc7XG4gIHJhYy5BbmdsZS5ib3R0b21SaWdodCA9IHJhYy5BbmdsZS5zZTtcbiAgcmFjLkFuZ2xlLmJyICAgICAgICAgID0gcmFjLkFuZ2xlLnNlO1xuICByYWMuQW5nbGUuYm90dG9tTGVmdCAgPSByYWMuQW5nbGUuc3c7XG4gIHJhYy5BbmdsZS5ibCAgICAgICAgICA9IHJhYy5BbmdsZS5zdztcblxufSAvLyBhdHRhY2hSYWNBbmdsZVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIFRoZSBgcmFjLlBvaW50YCBmdW5jdGlvbiBjb250YWlucyBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGZvciBjb252ZW5pZW5jZVxuKiBge0BsaW5rIFJhYy5Qb2ludH1gIG9iamVjdHMgd2l0aCB0aGUgY3VycmVudCBgcmFjYCBpbnN0YW5jZS5cbiogQG5hbWVzcGFjZSByYWMuUG9pbnRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1BvaW50KHJhYykge1xuXG4gIC8qKlxuICAqIEEgYFBvaW50YCBhdCBgKDAsIDApYC5cbiAgKiBAbmFtZSB6ZXJvXG4gICogQG1lbWJlcm9mIHJhYy5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lnplcm8gPSByYWMuUG9pbnQoMCwgMCk7XG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIGF0IGAoMCwgMClgLlxuICAqIEBuYW1lIG9yaWdpblxuICAqIEBtZW1iZXJvZiByYWMuUG9pbnQjXG4gICovXG4gIHJhYy5Qb2ludC5vcmlnaW4gPSByYWMuUG9pbnQuemVybztcblxufSAvLyBhdHRhY2hSYWNQb2ludFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBgcmFjLlRleHRgIGZ1bmN0aW9uIGNvbnRhaW5zIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgZm9yIGNvbnZlbmllbmNlXG4qIGB7QGxpbmsgUmFjLlRleHR9YCBvYmplY3RzIHdpdGggdGhlIGN1cnJlbnQgYHJhY2AgaW5zdGFuY2UuXG4qIEBuYW1lc3BhY2UgcmFjLlRleHRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1RleHQocmFjKSB7XG5cblxuICByYWMuVGV4dC5Gb3JtYXQgPSBmdW5jdGlvbihcbiAgICBob3Jpem9udGFsLCB2ZXJ0aWNhbCxcbiAgICBmb250ID0gbnVsbCxcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS56ZXJvLFxuICAgIHNpemUgPSBSYWMuVGV4dC5Gb3JtYXQuZGVmYXVsdFNpemUpXG4gIHtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICAgIGhvcml6b250YWwsIHZlcnRpY2FsLFxuICAgICAgZm9udCwgYW5nbGUsIHNpemUpO1xuICB9O1xuXG5cbiAgcmFjLlRleHQuRm9ybWF0LnRvcExlZnQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWwubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWwudG9wLFxuICAgIHJhYy5BbmdsZS56ZXJvLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5kZWZhdWx0U2l6ZSk7XG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgYGhlbGxvIHdvcmxkYCB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXRcbiAgKiBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgaGVsbG9cbiAgKiBAbWVtYmVyb2YgcmFjLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LmhlbGxvID0gcmFjLlRleHQoMCwgMCwgJ2hlbGxvIHdvcmxkIScsXG4gICAgcmFjLlRleHQuRm9ybWF0LnRvcExlZnQpO1xuXG4gIC8qKlxuICAqIEEgYFRleHRgIGZvciBkcmF3aW5nIHRoZSBwYW5ncmFtIGBzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3dgXG4gICogd2l0aCBgdG9wTGVmdGAgZm9ybWF0IGF0IGBQb2ludC56ZXJvYC5cbiAgKiBAbmFtZSBzcGhpbnhcbiAgKiBAbWVtYmVyb2YgcmFjLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LnNwaGlueCA9IHJhYy5UZXh0KDAsIDAsICdzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3cnLFxuICAgIHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KTtcblxufSAvLyBhdHRhY2hSYWNQb2ludFxuXG4iLCJcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci90ZW1wbGF0ZXMvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW1kanMvYW1kanMtYXBpL2Jsb2IvbWFzdGVyL0FNRC5tZFxuICAgIC8vIGh0dHBzOi8vcmVxdWlyZWpzLm9yZy9kb2NzL3doeWFtZC5odG1sXG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXG4gICAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGZvciBBTUQgLSBkZWZpbmU6JHt0eXBlb2YgZGVmaW5lfWApO1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuXG4gICAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGZvciBOb2RlIC0gbW9kdWxlOiR7dHlwZW9mIG1vZHVsZX1gKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuXG4gIC8vIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJBQyBpbnRvIHNlbGYgLSByb290OiR7dHlwZW9mIHJvb3R9YCk7XG4gIHJvb3QubWFrZVJhYyA9IGZhY3RvcnkoKTtcblxufSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiByZXF1aXJlKCcuL1JhYycpO1xuXG59KSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBEcmF3ZXIgdGhhdCB1c2VzIGEgUDUgaW5zdGFuY2UgZm9yIGFsbCBkcmF3aW5nIG9wZXJhdGlvbnMuXG4qIEBhbGlhcyBSYWMuUDVEcmF3ZXJcbiovXG5jbGFzcyBQNURyYXdlciB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBwNSl7XG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5wNSA9IHA1O1xuICAgIHRoaXMuZHJhd1JvdXRpbmVzID0gW107XG4gICAgdGhpcy5kZWJ1Z1JvdXRpbmVzID0gW107XG4gICAgdGhpcy5hcHBseVJvdXRpbmVzID0gW107XG5cbiAgICAvLyBTdHlsZSB1c2VkIGZvciBkZWJ1ZyBkcmF3aW5nLCBpZiBudWxsIHRoaXNlIHN0eWxlIGFscmVhZHkgYXBwbGllZFxuICAgIC8vIGlzIHVzZWQuXG4gICAgdGhpcy5kZWJ1Z1N0eWxlID0gbnVsbDtcbiAgICAvLyBTdHlsZSB1c2VkIGZvciB0ZXh0IGZvciBkZWJ1ZyBkcmF3aW5nLCBpZiBudWxsIHRoZSBzdHlsZSBhbHJlYWR5XG4gICAgLy8gYXBwbGllZCBpcyB1c2VkLlxuICAgIHRoaXMuZGVidWdUZXh0U3R5bGUgPSBudWxsO1xuICAgIC8vIFJhZGl1cyBvZiBwb2ludCBtYXJrZXJzIGZvciBkZWJ1ZyBkcmF3aW5nLlxuICAgIHRoaXMuZGVidWdUZXh0T3B0aW9ucyA9IHtcbiAgICAgIGZvbnQ6ICdtb25vc3BhY2UnLFxuICAgICAgc2l6ZTogUmFjLlRleHQuRm9ybWF0LmRlZmF1bHRTaXplLFxuICAgICAgdG9GaXhlZDogMlxuICAgIH07XG5cbiAgICB0aGlzLmRlYnVnUG9pbnRSYWRpdXMgPSA0O1xuICAgIC8vIFJhZGl1cyBvZiBtYWluIHZpc3VhbCBlbGVtZW50cyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICB0aGlzLmRlYnVnUmFkaXVzID0gMjI7XG5cbiAgICB0aGlzLnNldHVwQWxsRHJhd0Z1bmN0aW9ucyhyYWMpO1xuICAgIHRoaXMuc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucyhyYWMpO1xuICAgIHRoaXMuc2V0dXBBbGxBcHBseUZ1bmN0aW9ucyhyYWMpO1xuICB9XG5cbiAgLy8gQWRkcyBhIERyYXdSb3V0aW5lIGZvciB0aGUgZ2l2ZW4gY2xhc3MuXG4gIHNldERyYXdGdW5jdGlvbihjbGFzc09iaiwgZHJhd0Z1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERyYXdSb3V0aW5lKGNsYXNzT2JqLCBkcmF3RnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5kcmF3Um91dGluZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cbiAgc2V0RHJhd09wdGlvbnMoY2xhc3NPYmosIG9wdGlvbnMpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IGZpbmQgcm91dGluZSBmb3IgY2xhc3MgLSBjbGFzc05hbWU6JHtjbGFzc09iai5uYW1lfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucmVxdWlyZXNQdXNoUG9wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJvdXRpbmUucmVxdWlyZXNQdXNoUG9wID0gb3B0aW9ucy5yZXF1aXJlc1B1c2hQb3A7XG4gICAgfVxuICB9XG5cbiAgc2V0Q2xhc3NEcmF3U3R5bGUoY2xhc3NPYmosIHN0eWxlKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIHJvdXRpbmUuc3R5bGUgPSBzdHlsZTtcbiAgfVxuXG4gIC8vIEFkZHMgYSBEZWJ1Z1JvdXRpbmUgZm9yIHRoZSBnaXZlbiBjbGFzcy5cbiAgc2V0RGVidWdGdW5jdGlvbihjbGFzc09iaiwgZGVidWdGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZGVidWdSb3V0aW5lc1xuICAgICAgLmZpbmRJbmRleChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcblxuICAgIGxldCByb3V0aW5lO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJvdXRpbmUgPSBuZXcgRGVidWdSb3V0aW5lKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24gPSBkZWJ1Z0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuZGVidWdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZGVidWdSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cbiAgLy8gQWRkcyBhIEFwcGx5Um91dGluZSBmb3IgdGhlIGdpdmVuIGNsYXNzLlxuICBzZXRBcHBseUZ1bmN0aW9uKGNsYXNzT2JqLCBhcHBseUZ1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5hcHBseVJvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuXG4gICAgbGV0IHJvdXRpbmU7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcm91dGluZSA9IG5ldyBBcHBseVJvdXRpbmUoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5hcHBseVJvdXRpbmVzW2luZGV4XTtcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uID0gZHJhd0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuYXBwbHlSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuYXBwbHlSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cbiAgZHJhd09iamVjdChvYmplY3QsIHN0eWxlID0gbnVsbCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gb2JqZWN0IGluc3RhbmNlb2Ygcm91dGluZS5jbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS50cmFjZShgQ2Fubm90IGRyYXcgb2JqZWN0IC0gb2JqZWN0LXR5cGU6JHt1dGlscy50eXBlTmFtZShvYmplY3QpfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RUb0RyYXc7XG4gICAgfVxuXG4gICAgaWYgKHJvdXRpbmUucmVxdWlyZXNQdXNoUG9wID09PSB0cnVlXG4gICAgICB8fCBzdHlsZSAhPT0gbnVsbFxuICAgICAgfHwgcm91dGluZS5zdHlsZSAhPT0gbnVsbClcbiAgICB7XG4gICAgICB0aGlzLnA1LnB1c2goKTtcbiAgICAgIGlmIChyb3V0aW5lLnN0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIHJvdXRpbmUuc3R5bGUuYXBwbHkoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBzdHlsZS5hcHBseSgpO1xuICAgICAgfVxuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24odGhpcywgb2JqZWN0KTtcbiAgICAgIHRoaXMucDUucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHB1c2gtcHVsbFxuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24odGhpcywgb2JqZWN0KTtcbiAgICB9XG4gIH1cblxuICBkZWJ1Z051bWJlcihudW1iZXIpIHtcbiAgICByZXR1cm4gbnVtYmVyLnRvRml4ZWQodGhpcy5kZWJ1Z1RleHRPcHRpb25zLnRvRml4ZWQpO1xuICB9XG5cbiAgZGVidWdPYmplY3Qob2JqZWN0LCBkcmF3c1RleHQpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBObyByb3V0aW5lLCBqdXN0IGRyYXcgb2JqZWN0IHdpdGggZGVidWcgc3R5bGVcbiAgICAgIHRoaXMuZHJhd09iamVjdChvYmplY3QsIHRoaXMuZGVidWdTdHlsZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVidWdTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5wNS5wdXNoKCk7XG4gICAgICB0aGlzLmRlYnVnU3R5bGUuYXBwbHkoKTtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbih0aGlzLCBvYmplY3QsIGRyYXdzVGV4dCk7XG4gICAgICB0aGlzLnA1LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24odGhpcywgb2JqZWN0LCBkcmF3c1RleHQpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5T2JqZWN0KG9iamVjdCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5hcHBseVJvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUudHJhY2UoYENhbm5vdCBhcHBseSBvYmplY3QgLSBvYmplY3QtdHlwZToke3V0aWxzLnR5cGVOYW1lKG9iamVjdCl9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdFRvQXBwbHk7XG4gICAgfVxuXG4gICAgcm91dGluZS5hcHBseUZ1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gIH1cblxuICAvLyBTZXRzIHVwIGFsbCBkcmF3aW5nIHJvdXRpbmVzIGZvciByYWMgZHJhd2FibGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGFuZCBzdGF0aWMgZnVuY3Rpb25zIGluIHJlbGV2YW50XG4gIC8vIGNsYXNzZXMuXG4gIHNldHVwQWxsRHJhd0Z1bmN0aW9ucyhyYWMpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kcmF3LmZ1bmN0aW9ucycpO1xuXG4gICAgLy8gUG9pbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuUG9pbnQsIGZ1bmN0aW9ucy5kcmF3UG9pbnQpO1xuICAgIHJlcXVpcmUoJy4vUG9pbnQuZnVuY3Rpb25zJykocmFjKTtcblxuICAgIC8vIFJheVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5SYXksIGZ1bmN0aW9ucy5kcmF3UmF5KTtcblxuICAgIC8vIFNlZ21lbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRyYXdTZWdtZW50KTtcbiAgICByZXF1aXJlKCcuL1NlZ21lbnQuZnVuY3Rpb25zJykocmFjKTtcblxuICAgIC8vIEFyY1xuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5BcmMsIGZ1bmN0aW9ucy5kcmF3QXJjKTtcblxuICAgIFJhYy5BcmMucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICAgIGxldCBiZXppZXJzUGVyVHVybiA9IDU7XG4gICAgICBsZXQgZGl2aXNpb25zID0gTWF0aC5jZWlsKGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpICogYmV6aWVyc1BlclR1cm4pO1xuICAgICAgdGhpcy5kaXZpZGVUb0JlemllcnMoZGl2aXNpb25zKS52ZXJ0ZXgoKTtcbiAgICB9O1xuXG4gICAgLy8gQmV6aWVyXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkJlemllciwgKGRyYXdlciwgYmV6aWVyKSA9PiB7XG4gICAgICBkcmF3ZXIucDUuYmV6aWVyKFxuICAgICAgICBiZXppZXIuc3RhcnQueCwgYmV6aWVyLnN0YXJ0LnksXG4gICAgICAgIGJlemllci5zdGFydEFuY2hvci54LCBiZXppZXIuc3RhcnRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZEFuY2hvci54LCBiZXppZXIuZW5kQW5jaG9yLnksXG4gICAgICAgIGJlemllci5lbmQueCwgYmV6aWVyLmVuZC55KTtcbiAgICB9KTtcblxuICAgIFJhYy5CZXppZXIucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zdGFydC52ZXJ0ZXgoKVxuICAgICAgcmFjLmRyYXdlci5wNS5iZXppZXJWZXJ0ZXgoXG4gICAgICAgIHRoaXMuc3RhcnRBbmNob3IueCwgdGhpcy5zdGFydEFuY2hvci55LFxuICAgICAgICB0aGlzLmVuZEFuY2hvci54LCB0aGlzLmVuZEFuY2hvci55LFxuICAgICAgICB0aGlzLmVuZC54LCB0aGlzLmVuZC55KTtcbiAgICB9O1xuXG4gICAgLy8gQ29tcG9zaXRlXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkNvbXBvc2l0ZSwgKGRyYXdlciwgY29tcG9zaXRlKSA9PiB7XG4gICAgICBjb21wb3NpdGUuc2VxdWVuY2UuZm9yRWFjaChpdGVtID0+IGl0ZW0uZHJhdygpKTtcbiAgICB9KTtcblxuICAgIFJhYy5Db21wb3NpdGUucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zZXF1ZW5jZS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS52ZXJ0ZXgoKSk7XG4gICAgfTtcblxuICAgIC8vIFNoYXBlXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlNoYXBlLCAoZHJhd2VyLCBzaGFwZSkgPT4ge1xuICAgICAgZHJhd2VyLnA1LmJlZ2luU2hhcGUoKTtcbiAgICAgIHNoYXBlLm91dGxpbmUudmVydGV4KCk7XG5cbiAgICAgIGlmIChzaGFwZS5jb250b3VyLmlzTm90RW1wdHkoKSkge1xuICAgICAgICBkcmF3ZXIucDUuYmVnaW5Db250b3VyKCk7XG4gICAgICAgIHNoYXBlLmNvbnRvdXIudmVydGV4KCk7XG4gICAgICAgIGRyYXdlci5wNS5lbmRDb250b3VyKCk7XG4gICAgICB9XG4gICAgICBkcmF3ZXIucDUuZW5kU2hhcGUoKTtcbiAgICB9KTtcblxuICAgIFJhYy5TaGFwZS5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm91dGxpbmUudmVydGV4KCk7XG4gICAgICB0aGlzLmNvbnRvdXIudmVydGV4KCk7XG4gICAgfTtcblxuICAgIC8vIFRleHRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuVGV4dCwgKGRyYXdlciwgdGV4dCkgPT4ge1xuICAgICAgdGV4dC5mb3JtYXQuYXBwbHkodGV4dC5wb2ludCk7XG4gICAgICBkcmF3ZXIucDUudGV4dCh0ZXh0LnN0cmluZywgMCwgMCk7XG4gICAgfSk7XG4gICAgdGhpcy5zZXREcmF3T3B0aW9ucyhSYWMuVGV4dCwge3JlcXVpcmVzUHVzaFBvcDogdHJ1ZX0pO1xuXG4gICAgLy8gQXBwbGllcyBhbGwgdGV4dCBwcm9wZXJ0aWVzIGFuZCB0cmFuc2xhdGVzIHRvIHRoZSBnaXZlbiBgcG9pbnRgLlxuICAgIC8vIEFmdGVyIHRoZSBmb3JtYXQgaXMgYXBwbGllZCB0aGUgdGV4dCBzaG91bGQgYmUgZHJhd24gYXQgdGhlIG9yaWdpbi5cbiAgICBSYWMuVGV4dC5Gb3JtYXQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIGxldCBoQWxpZ247XG4gICAgICBsZXQgaE9wdGlvbnMgPSBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbDtcbiAgICAgIHN3aXRjaCAodGhpcy5ob3Jpem9udGFsKSB7XG4gICAgICAgIGNhc2UgaE9wdGlvbnMubGVmdDogICBoQWxpZ24gPSByYWMuZHJhd2VyLnA1LkxFRlQ7ICAgYnJlYWs7XG4gICAgICAgIGNhc2UgaE9wdGlvbnMuY2VudGVyOiBoQWxpZ24gPSByYWMuZHJhd2VyLnA1LkNFTlRFUjsgYnJlYWs7XG4gICAgICAgIGNhc2UgaE9wdGlvbnMucmlnaHQ6ICBoQWxpZ24gPSByYWMuZHJhd2VyLnA1LlJJR0hUOyAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS50cmFjZShgSW52YWxpZCBob3Jpem9udGFsIGNvbmZpZ3VyYXRpb24gLSBob3Jpem9udGFsOiR7dGhpcy5ob3Jpem9udGFsfWApO1xuICAgICAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgICAgIH1cblxuICAgICAgbGV0IHZBbGlnbjtcbiAgICAgIGxldCB2T3B0aW9ucyA9IFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbDtcbiAgICAgIHN3aXRjaCAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICBjYXNlIHZPcHRpb25zLnRvcDogICAgICB2QWxpZ24gPSByYWMuZHJhd2VyLnA1LlRPUDsgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB2T3B0aW9ucy5ib3R0b206ICAgdkFsaWduID0gcmFjLmRyYXdlci5wNS5CT1RUT007ICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugdk9wdGlvbnMuY2VudGVyOiAgIHZBbGlnbiA9IHJhYy5kcmF3ZXIucDUuQ0VOVEVSOyAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZPcHRpb25zLmJhc2VsaW5lOiB2QWxpZ24gPSByYWMuZHJhd2VyLnA1LkJBU0VMSU5FOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHZlcnRpY2FsIGNvbmZpZ3VyYXRpb24gLSB2ZXJ0aWNhbDoke3RoaXMudmVydGljYWx9YCk7XG4gICAgICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgICAgfVxuXG4gICAgICAvLyBUZXh0IHByb3BlcnRpZXNcbiAgICAgIHJhYy5kcmF3ZXIucDUudGV4dEFsaWduKGhBbGlnbiwgdkFsaWduKTtcbiAgICAgIHJhYy5kcmF3ZXIucDUudGV4dFNpemUodGhpcy5zaXplKTtcbiAgICAgIGlmICh0aGlzLmZvbnQgIT09IG51bGwpIHtcbiAgICAgICAgcmFjLmRyYXdlci5wNS50ZXh0Rm9udCh0aGlzLmZvbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBQb3NpdGlvbmluZ1xuICAgICAgcmFjLmRyYXdlci5wNS50cmFuc2xhdGUocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICBpZiAodGhpcy5hbmdsZS50dXJuICE9IDApIHtcbiAgICAgICAgcmFjLmRyYXdlci5wNS5yb3RhdGUodGhpcy5hbmdsZS5yYWRpYW5zKCkpO1xuICAgICAgfVxuICAgIH0gLy8gUmFjLlRleHQuRm9ybWF0LnByb3RvdHlwZS5hcHBseVxuXG4gIH0gLy8gc2V0dXBBbGxEcmF3RnVuY3Rpb25zXG5cblxuICAvLyBTZXRzIHVwIGFsbCBkZWJ1ZyByb3V0aW5lcyBmb3IgcmFjIGRyYXdhYmxlIGNsYXNlcy5cbiAgc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucyhyYWMpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kZWJ1Zy5mdW5jdGlvbnMnKTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlBvaW50LCBmdW5jdGlvbnMuZGVidWdQb2ludCk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5TZWdtZW50LCBmdW5jdGlvbnMuZGVidWdTZWdtZW50KTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRlYnVnQXJjKTtcblxuICAgIC8vIFRPRE86IHVzaW5nIGFuIGV4dGVybmFsIHJlZmVyZW5jZSB0byBkcmF3ZXIsIHNob3VsZCB1c2UgaW50ZXJuYWwgb25lXG4gICAgbGV0IGRyYXdlciA9IHRoaXM7XG4gICAgUmFjLkFuZ2xlLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKHBvaW50LCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgaWYgKGRyYXdlci5kZWJ1Z1N0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5wdXNoKCk7XG4gICAgICAgIGRyYXdlci5kZWJ1Z1N0eWxlLmFwcGx5KCk7XG4gICAgICAgIC8vIFRPRE86IGNvdWxkIHRoaXMgYmUgYSBnb29kIG9wdGlvbiB0byBpbXBsZW1lbnQgc3BsYXR0aW5nIGFyZ3VtZW50c1xuICAgICAgICAvLyBpbnRvIHRoZSBkZWJ1Z0Z1bmN0aW9uP1xuICAgICAgICBmdW5jdGlvbnMuZGVidWdBbmdsZShkcmF3ZXIsIHRoaXMsIHBvaW50LCBkcmF3c1RleHQpO1xuICAgICAgICBkcmF3ZXIucDUucG9wKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdW5jdGlvbnMuZGVidWdBbmdsZShkcmF3ZXIsIHRoaXMsIHBvaW50LCBkcmF3c1RleHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBSYWMuUG9pbnQucHJvdG90eXBlLmRlYnVnQW5nbGUgPSBmdW5jdGlvbihzb21lQW5nbGUsIGRyYXdzVGV4dCA9IGZhbHNlKSB7XG4gICAgICBsZXQgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShzb21lQW5nbGUpO1xuICAgICAgYW5nbGUuZGVidWcodGhpcywgZHJhd3NUZXh0KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gIH0gLy8gc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9uc1xuXG5cbiAgLy8gU2V0cyB1cCBhbGwgYXBwbHlpbmcgcm91dGluZXMgZm9yIHJhYyBzdHlsZSBjbGFzZXMuXG4gIC8vIEFsc28gYXR0YWNoZXMgYWRkaXRpb25hbCBwcm90b3R5cGUgZnVuY3Rpb25zIGluIHJlbGV2YW50IGNsYXNzZXMuXG4gIHNldHVwQWxsQXBwbHlGdW5jdGlvbnMocmFjKSB7XG4gICAgLy8gQ29sb3IgcHJvdG90eXBlIGZ1bmN0aW9uc1xuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlCYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByYWMuZHJhd2VyLnA1LmJhY2tncm91bmQodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSk7XG4gICAgfTtcblxuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlGaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICByYWMuZHJhd2VyLnA1LmZpbGwodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSwgdGhpcy5hbHBoYSAqIDI1NSk7XG4gICAgfTtcblxuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlTdHJva2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJhYy5kcmF3ZXIucDUuc3Ryb2tlKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUsIHRoaXMuYWxwaGEgKiAyNTUpO1xuICAgIH07XG5cbiAgICAvLyBTdHJva2VcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLlN0cm9rZSwgKGRyYXdlciwgc3Ryb2tlKSA9PiB7XG4gICAgICBpZiAoc3Ryb2tlLmNvbG9yID09PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5ub1N0cm9rZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHN0cm9rZS5jb2xvci5hcHBseVN0cm9rZSgpO1xuICAgICAgZHJhd2VyLnA1LnN0cm9rZVdlaWdodChzdHJva2Uud2VpZ2h0KTtcbiAgICB9KTtcblxuICAgIC8vIEZpbGxcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLkZpbGwsIChkcmF3ZXIsIGZpbGwpID0+IHtcbiAgICAgIGlmIChmaWxsLmNvbG9yID09PSBudWxsKSB7XG4gICAgICAgIHJhYy5kcmF3ZXIucDUubm9GaWxsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZmlsbC5jb2xvci5hcHBseUZpbGwoKTtcbiAgICB9KTtcblxuICAgIC8vIFN0eWxlXG4gICAgdGhpcy5zZXRBcHBseUZ1bmN0aW9uKFJhYy5TdHlsZSwgKGRyYXdlciwgc3R5bGUpID0+IHtcbiAgICAgIGlmIChzdHlsZS5zdHJva2UgIT09IG51bGwpIHtcbiAgICAgICAgc3R5bGUuc3Ryb2tlLmFwcGx5KCk7XG4gICAgICB9XG4gICAgICBpZiAoc3R5bGUuZmlsbCAhPT0gbnVsbCkge1xuICAgICAgICBzdHlsZS5maWxsLmFwcGx5KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBSYWMuU3R5bGUucHJvdG90eXBlLmFwcGx5VG9DbGFzcyA9IGZ1bmN0aW9uKGNsYXNzT2JqKSB7XG4gICAgICByYWMuZHJhd2VyLnNldENsYXNzRHJhd1N0eWxlKGNsYXNzT2JqLCB0aGlzKTtcbiAgICB9XG5cbiAgfSAvLyBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zXG5cbn0gLy8gY2xhc3MgUDVEcmF3ZXJcblxubW9kdWxlLmV4cG9ydHMgPSBQNURyYXdlcjtcblxuXG4vLyBFbmNhcHN1bGF0ZXMgdGhlIGRyYXdpbmcgZnVuY3Rpb24gYW5kIG9wdGlvbnMgZm9yIGEgc3BlY2lmaWMgY2xhc3MuXG4vLyBUaGUgZHJhdyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0d28gcGFyYW1ldGVyczogdGhlIGluc3RhbmNlIG9mIHRoZVxuLy8gZHJhd2VyLCBhbmQgdGhlIG9iamVjdCB0byBkcmF3LlxuLy9cbi8vIE9wdGlvbmFsbHkgYSBgc3R5bGVgIGNhbiBiZSBhc2lnbmVkIHRvIGFsd2F5cyBiZSBhcHBsaWVkIGJlZm9yZVxuLy8gZHJhd2luZyBhbiBpbnN0YW5jZSBvZiB0aGUgYXNzb2NpYXRlZCBjbGFzcy4gVGhpcyBzdHlsZSB3aWxsIGJlXG4vLyBhcHBsaWVkIGJlZm9yZSBhbnkgc3R5bGVzIHByb3ZpZGVkIHRvIHRoZSBgZHJhd2AgZnVuY3Rpb24uXG4vL1xuLy8gT3B0aW9uYWxseSBgcmVxdWlyZXNQdXNoUG9wYCBjYW4gYmUgc2V0IHRvIGB0cnVlYCB0byBhbHdheXMgcGVmb3JtXG4vLyBhIGBwdXNoYCBhbmQgYHBvcGAgYmVmb3JlIGFuZCBhZnRlciBhbGwgdGhlIHN0eWxlIGFuZCBkcmF3aW5nIGluXG4vLyB0aGUgcm91dGluZS4gVGhpcyBpcyBpbnRlbmRlZCBmb3Igb2JqZWN0cyB3aGljaCBkcmF3aW5nIG9wZXJhdGlvbnNcbi8vIG1heSBuZWVkIHRvIHB1c2ggdHJhbnNmb3JtYXRpb24gdG8gdGhlIHN0YWNrLlxuY2xhc3MgRHJhd1JvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGRyYXdGdW5jdGlvbikge1xuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcbiAgICB0aGlzLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcblxuICAgIC8vIE9wdGlvbnNcbiAgICB0aGlzLnJlcXVpcmVzUHVzaFBvcCA9IGZhbHNlO1xuICB9XG59IC8vIERyYXdSb3V0aW5lXG5cblxuY2xhc3MgRGVidWdSb3V0aW5lIHtcbiAgY29uc3RydWN0b3IgKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuICAgIHRoaXMuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gIH1cbn1cblxuXG5jbGFzcyBBcHBseVJvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG4gICAgdGhpcy5hcHBseUZ1bmN0aW9uID0gYXBwbHlGdW5jdGlvbjtcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFBvaW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIGFzIHRvIHJlcHJlc2VudCB0aGlzIGBQb2ludGAuXG4gICpcbiAgKiBBZGRlZCB3aGVuIGBSYWMuUDVEcmF3ZXJgIGlzIHNldHVwIGFzIGByYWMuZHJhd2VyYC5cbiAgKi9cbiAgUmFjLlBvaW50LnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICByYWMuZHJhd2VyLnA1LnZlcnRleCh0aGlzLngsIHRoaXMueSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIuXG4gICpcbiAgKiBBZGRlZCB3aGVuIGBSYWMuUDVEcmF3ZXJgIGlzIHNldHVwIGFzIGByYWMuZHJhd2VyYC5cbiAgKlxuICAqIEBuYW1lIHBvaW50ZXJcbiAgKiBAbWVtYmVyb2YgcmFjLlBvaW50I1xuICAqIEBmdW5jdGlvblxuICAqL1xuICByYWMuUG9pbnQucG9pbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS5tb3VzZVgsIHJhYy5kcmF3ZXIucDUubW91c2VZKTtcbiAgfTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXG4gICpcbiAgKiBBZGRlZCB3aGVuIGBSYWMuUDVEcmF3ZXJgIGlzIHNldHVwIGFzIGByYWMuZHJhd2VyYC5cbiAgKlxuICAqIEBuYW1lIGNhbnZhc0NlbnRlclxuICAqIEBtZW1iZXJvZiByYWMuUG9pbnQjXG4gICogQGZ1bmN0aW9uXG4gICovXG4gIHJhYy5Qb2ludC5jYW52YXNDZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUud2lkdGgvMiwgcmFjLmRyYXdlci5wNS5oZWlnaHQvMik7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGVuZCBvZiB0aGUgY2FudmFzLCB0aGF0IGlzLCBhdCB0aGUgcG9zaXRpb25cbiAgKiBgKHdpZHRoLGhlaWdodClgLlxuICAqXG4gICogQWRkZWQgd2hlbiBgUmFjLlA1RHJhd2VyYCBpcyBzZXR1cCBhcyBgcmFjLmRyYXdlcmAuXG4gICpcbiAgKiBAbmFtZSBjYW52YXNFbmRcbiAgKiBAbWVtYmVyb2YgcmFjLlBvaW50I1xuICAqIEBmdW5jdGlvblxuICAqL1xuICBSYWMuUG9pbnQuY2FudmFzRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG59IC8vIGF0dGFjaFBvaW50RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoU2VnbWVudEZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDYWxscyBgcDUudmVydGV4YCBhcyB0byByZXByZXNlbnQgdGhpcyBgU2VnbWVudGAuXG4gICpcbiAgKiBBZGRlZCB3aGVuIGBSYWMuUDVEcmF3ZXJgIGlzIHNldHVwIGFzIGByYWMuZHJhd2VyYC5cbiAgKi9cbiAgUmFjLlNlZ21lbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3RhcnRQb2ludCgpLnZlcnRleCgpO1xuICAgIHRoaXMuZW5kUG9pbnQoKS52ZXJ0ZXgoKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHRvcCBvZiB0aGUgY2FudmFzLCBmcm9tIHRvcC1sZWZ0IHRvXG4gICogdG9wLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgd2hlbiBgUmFjLlA1RHJhd2VyYCBpcyBzZXR1cCBhcyBgcmFjLmRyYXdlcmAuXG4gICpcbiAgKiBAbmFtZSBjYW52YXNUb3BcbiAgKiBAbWVtYmVyb2YgcmFjLlNlZ21lbnQjXG4gICogQGZ1bmN0aW9uXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnRcbiAgKiB0byBib3R0b20tbGVmdC5cbiAgKlxuICAqIEFkZGVkIHdoZW4gYFJhYy5QNURyYXdlcmAgaXMgc2V0dXAgYXMgYHJhYy5kcmF3ZXJgLlxuICAqXG4gICogQG5hbWUgY2FudmFzTGVmdFxuICAqIEBtZW1iZXJvZiByYWMuU2VnbWVudCNcbiAgKiBAZnVuY3Rpb25cbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzTGVmdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5kb3duLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSByaWdodCBvZiB0aGUgY2FudmFzLCBmcm9tIHRvcC1yaWdodFxuICAqIHRvIGJvdHRvbS1yaWdodC5cbiAgKlxuICAqIEFkZGVkIHdoZW4gYFJhYy5QNURyYXdlcmAgaXMgc2V0dXAgYXMgYHJhYy5kcmF3ZXJgLlxuICAqXG4gICogQG5hbWUgY2FudmFzUmlnaHRcbiAgKiBAbWVtYmVyb2YgcmFjLlNlZ21lbnQjXG4gICogQGZ1bmN0aW9uXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1JpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdG9wUmlnaHQgPSByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgMCk7XG4gICAgcmV0dXJuIHRvcFJpZ2h0XG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIGJvdHRvbSBvZiB0aGUgY2FudmFzLCBmcm9tXG4gICogYm90dG9tLWxlZnQgdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgd2hlbiBgUmFjLlA1RHJhd2VyYCBpcyBzZXR1cCBhcyBgcmFjLmRyYXdlcmAuXG4gICpcbiAgKiBAbmFtZSBjYW52YXNCb3R0b21cbiAgKiBAbWVtYmVyb2YgcmFjLlNlZ21lbnQjXG4gICogQGZ1bmN0aW9uXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc0JvdHRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBib3R0b21MZWZ0ID0gcmFjLlBvaW50KDAsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgICByZXR1cm4gYm90dG9tTGVmdFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuXG59IC8vIGF0dGFjaFNlZ21lbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiByZXZlcnNlc1RleHQoYW5nbGUpIHtcbiAgcmV0dXJuIGFuZ2xlLnR1cm4gPCAzLzQgJiYgYW5nbGUudHVybiA+PSAxLzQ7XG59XG5cbmV4cG9ydHMuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGRyYXdlciwgYW5nbGUsIHBvaW50LCBkcmF3c1RleHQpIHtcbiAgbGV0IHJhYyA9IGRyYXdlci5yYWM7XG5cbiAgLy8gWmVybyBzZWdtZW50XG4gIHBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS56ZXJvLCBkcmF3ZXIuZGVidWdSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBBbmdsZSBzZWdtZW50XG4gIGxldCBhbmdsZVNlZ21lbnQgPSBwb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhbmdsZSwgZHJhd2VyLmRlYnVnUmFkaXVzICogMS41KTtcbiAgYW5nbGVTZWdtZW50LmVuZFBvaW50KClcbiAgICAuYXJjKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzLCBhbmdsZSwgYW5nbGUuaW52ZXJzZSgpLCBmYWxzZSlcbiAgICAuZHJhdygpO1xuICBhbmdsZVNlZ21lbnRcbiAgICAud2l0aExlbmd0aEFkZChkcmF3ZXIuZGVidWdQb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIE1pbmkgYXJjIG1hcmtlcnNcbiAgbGV0IGFuZ2xlQXJjID0gcG9pbnQuYXJjKGRyYXdlci5kZWJ1Z1JhZGl1cywgcmFjLkFuZ2xlLnplcm8sIGFuZ2xlKTtcbiAgbGV0IGNvbnRleHQgPSBkcmF3ZXIucDUuZHJhd2luZ0NvbnRleHQ7XG4gIGxldCBzdHJva2VXZWlnaHQgPSBjb250ZXh0LmxpbmVXaWR0aDtcbiAgY29udGV4dC5zYXZlKCk7IHtcbiAgICBjb250ZXh0LmxpbmVDYXAgPSAnYnV0dCc7XG4gICAgY29udGV4dC5zZXRMaW5lRGFzaChbNiwgNF0pO1xuICAgIC8vIEFuZ2xlIGFyY1xuICAgIGFuZ2xlQXJjLmRyYXcoKTtcblxuICAgIGlmICghYW5nbGVBcmMuaXNDaXJjbGUoKSkge1xuICAgICAgLy8gT3V0c2lkZSBhbmdsZSBhcmNcbiAgICAgIGNvbnRleHQuc2V0TGluZURhc2goWzIsIDRdKTtcbiAgICAgIGFuZ2xlQXJjXG4gICAgICAgIC53aXRoUmFkaXVzKGRyYXdlci5kZWJ1Z1JhZGl1cyozLzQpXG4gICAgICAgIC53aXRoQ2xvY2t3aXNlKGZhbHNlKVxuICAgICAgICAuZHJhdygpO1xuICAgIH1cbiAgfTtcbiAgY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbC5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbC5jZW50ZXIsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgaWYgKHJldmVyc2VzVGV4dChhbmdsZSkpIHtcbiAgICAvLyBSZXZlcnNlIG9yaWVudGF0aW9uXG4gICAgZm9ybWF0ID0gZm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIC8vIFR1cm4gdGV4dFxuICBsZXQgdHVyblN0cmluZyA9IGB0dXJuOiR7ZHJhd2VyLmRlYnVnTnVtYmVyKGFuZ2xlLnR1cm4pfWA7XG4gIHBvaW50XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgZHJhd2VyLmRlYnVnUmFkaXVzKjIpXG4gICAgLnRleHQodHVyblN0cmluZywgZm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z0FuZ2xlXG5cblxuZXhwb3J0cy5kZWJ1Z1BvaW50ID0gZnVuY3Rpb24oZHJhd2VyLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGxldCByYWMgPSBkcmF3ZXIucmFjO1xuXG4gIHBvaW50LmRyYXcoKTtcblxuICAvLyBQb2ludCBtYXJrZXJcbiAgcG9pbnQuYXJjKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKS5kcmF3KCk7XG5cbiAgLy8gUG9pbnQgcmV0aWN1bGUgbWFya2VyXG4gIGxldCBhcmMgPSBwb2ludFxuICAgIC5hcmMoZHJhd2VyLmRlYnVnUmFkaXVzLCByYWMuQW5nbGUucywgcmFjLkFuZ2xlLmUpXG4gICAgLmRyYXcoKTtcbiAgYXJjLnN0YXJ0U2VnbWVudCgpLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMS8yKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5lbmRTZWdtZW50KClcbiAgICAucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygxLzIpXG4gICAgLmRyYXcoKTtcblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgbGV0IHN0cmluZyA9IGB4OiR7ZHJhd2VyLmRlYnVnTnVtYmVyKHBvaW50LngpfVxcbnk6JHtkcmF3ZXIuZGVidWdOdW1iZXIocG9pbnQueSl9YDtcbiAgbGV0IGZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWwubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWwudG9wLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgcmFjLkFuZ2xlLmUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG4gIHBvaW50XG4gICAgLnBvaW50VG9BbmdsZShyYWMuQW5nbGUuc2UsIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKjIpXG4gICAgLnRleHQoc3RyaW5nLCBmb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnUG9pbnRcblxuXG5leHBvcnRzLmRlYnVnU2VnbWVudCA9IGZ1bmN0aW9uKGRyYXdlciwgc2VnbWVudCwgZHJhd3NUZXh0KSB7XG4gIGxldCByYWMgPSBkcmF3ZXIucmFjO1xuXG4gIHNlZ21lbnQuZHJhdygpO1xuXG4gIC8vIEhhbGYgY2lyY2xlIHN0YXJ0IG1hcmtlclxuICBzZWdtZW50LndpdGhMZW5ndGgoZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXMpXG4gICAgLmFyYygpXG4gICAgLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBzdGFydCBzZWdtZW50XG4gIGxldCBwZXJwQW5nbGUgPSBzZWdtZW50LmFuZ2xlKCkucGVycGVuZGljdWxhcigpO1xuICBsZXQgYXJjID0gc2VnbWVudC5zdGFydFBvaW50KClcbiAgICAuYXJjKGRyYXdlci5kZWJ1Z1JhZGl1cywgcGVycEFuZ2xlLCBwZXJwQW5nbGUuaW52ZXJzZSgpKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gUGVycGVuZGljdWxhciBlbmQgbWFya2VyXG4gIGxldCBlbmRNYXJrZXJTdGFydCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKClcbiAgICAud2l0aExlbmd0aChkcmF3ZXIuZGVidWdSYWRpdXMvMilcbiAgICAud2l0aFN0YXJ0RXh0ZW5kZWQoLWRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG4gIGxldCBlbmRNYXJrZXJFbmQgPSBzZWdtZW50XG4gICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihmYWxzZSlcbiAgICAud2l0aExlbmd0aChkcmF3ZXIuZGVidWdSYWRpdXMvMilcbiAgICAud2l0aFN0YXJ0RXh0ZW5kZWQoLWRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG4gIC8vIExpdHRsZSBlbmQgaGFsZiBjaXJjbGVcbiAgc2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhkcmF3ZXIuZGVidWdQb2ludFJhZGl1cywgZW5kTWFya2VyU3RhcnQuYW5nbGUoKSwgZW5kTWFya2VyRW5kLmFuZ2xlKCkpXG4gICAgLmRyYXcoKTtcblxuICAvLyBGb3JtaW5nIGVuZCBhcnJvd1xuICBsZXQgYXJyb3dBbmdsZVNoaWZ0ID0gcmFjLkFuZ2xlLmZyb20oMS83KTtcbiAgbGV0IGVuZEFycm93U3RhcnQgPSBlbmRNYXJrZXJTdGFydFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgZmFsc2UpO1xuICBsZXQgZW5kQXJyb3dFbmQgPSBlbmRNYXJrZXJFbmRcbiAgICAucmV2ZXJzZSgpXG4gICAgLnJheS53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlU2hpZnQsIHRydWUpO1xuICBsZXQgZW5kQXJyb3dQb2ludCA9IGVuZEFycm93U3RhcnRcbiAgICAucG9pbnRBdEludGVyc2VjdGlvbihlbmRBcnJvd0VuZCk7XG4gIC8vIEVuZCBhcnJvd1xuICBlbmRNYXJrZXJTdGFydFxuICAgIC5uZXh0U2VnbWVudFRvUG9pbnQoZW5kQXJyb3dQb2ludClcbiAgICAuZHJhdygpXG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRNYXJrZXJFbmQuZW5kUG9pbnQoKSlcbiAgICAuZHJhdygpO1xuXG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBhbmdsZSA9IHNlZ21lbnQuYW5nbGUoKTtcbiAgLy8gTm9ybWFsIG9yaWVudGF0aW9uXG4gIGxldCBsZW5ndGhGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsLmJvdHRvbSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgYW5nbGVGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsLnRvcCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBsZW5ndGhGb3JtYXQgPSBsZW5ndGhGb3JtYXQuaW52ZXJzZSgpO1xuICAgIGFuZ2xlRm9ybWF0ID0gYW5nbGVGb3JtYXQuaW52ZXJzZSgpO1xuICB9XG5cbiAgLy8gTGVuZ3RoXG4gIGxldCBsZW5ndGhTdHJpbmcgPSBgbGVuZ3RoOiR7ZHJhd2VyLmRlYnVnTnVtYmVyKHNlZ21lbnQubGVuZ3RoKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuc3VidHJhY3QoMS80KSwgZHJhd2VyLmRlYnVnUmFkaXVzLzIpXG4gICAgLnRleHQobGVuZ3RoU3RyaW5nLCBsZW5ndGhGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAgIC8vIEFuZ2xlXG4gIGxldCBhbmdsZVN0cmluZyA9IGBhbmdsZToke2RyYXdlci5kZWJ1Z051bWJlcihhbmdsZS50dXJuKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuYWRkKDEvNCksIGRyYXdlci5kZWJ1Z1JhZGl1cy8yKVxuICAgIC50ZXh0KGFuZ2xlU3RyaW5nLCBhbmdsZUZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdTZWdtZW50XG5cblxuZXhwb3J0cy5kZWJ1Z0FyYyA9IGZ1bmN0aW9uKGRyYXdlciwgYXJjLCBkcmF3c1RleHQpIHtcbiAgbGV0IHJhYyA9IGRyYXdlci5yYWM7XG5cbiAgYXJjLmRyYXcoKTtcblxuICAvLyBDZW50ZXIgbWFya2Vyc1xuICBsZXQgY2VudGVyQXJjUmFkaXVzID0gZHJhd2VyLmRlYnVnUmFkaXVzICogMi8zO1xuICBpZiAoYXJjLnJhZGl1cyA+IGRyYXdlci5kZWJ1Z1JhZGl1cy8zICYmIGFyYy5yYWRpdXMgPCBkcmF3ZXIuZGVidWdSYWRpdXMpIHtcbiAgICAvLyBJZiByYWRpdXMgaXMgdG8gY2xvc2UgdG8gdGhlIGNlbnRlci1hcmMgbWFya2Vyc1xuICAgIC8vIE1ha2UgdGhlIGNlbnRlci1hcmMgYmUgb3V0c2lkZSBvZiB0aGUgYXJjXG4gICAgY2VudGVyQXJjUmFkaXVzID0gYXJjLnJhZGl1cyArIGRyYXdlci5kZWJ1Z1JhZGl1cy8zO1xuICB9XG5cbiAgLy8gQ2VudGVyIHN0YXJ0IHNlZ21lbnRcbiAgbGV0IGNlbnRlckFyYyA9IGFyYy53aXRoUmFkaXVzKGNlbnRlckFyY1JhZGl1cyk7XG4gIGNlbnRlckFyYy5zdGFydFNlZ21lbnQoKS5kcmF3KCk7XG5cbiAgLy8gUmFkaXVzXG4gIGxldCByYWRpdXNNYXJrZXJMZW5ndGggPSBhcmMucmFkaXVzXG4gICAgLSBjZW50ZXJBcmNSYWRpdXNcbiAgICAtIGRyYXdlci5kZWJ1Z1JhZGl1cy8yXG4gICAgLSBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cyoyO1xuICBpZiAocmFkaXVzTWFya2VyTGVuZ3RoID4gMCkge1xuICAgIGFyYy5zdGFydFNlZ21lbnQoKVxuICAgICAgLndpdGhMZW5ndGgocmFkaXVzTWFya2VyTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGNlbnRlckFyY1JhZGl1cyArIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKjIpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gTWluaSBhcmMgbWFya2Vyc1xuICBsZXQgY29udGV4dCA9IGRyYXdlci5wNS5kcmF3aW5nQ29udGV4dDtcbiAgbGV0IHN0cm9rZVdlaWdodCA9IGNvbnRleHQubGluZVdpZHRoO1xuICBjb250ZXh0LnNhdmUoKTsge1xuICAgIGNvbnRleHQubGluZUNhcCA9ICdidXR0JztcbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFs2LCA0XSk7XG4gICAgY2VudGVyQXJjLmRyYXcoKTtcblxuICAgIGlmICghY2VudGVyQXJjLmlzQ2lyY2xlKCkpIHtcbiAgICAgIC8vIE91dHNpZGUgYW5nbGUgYXJjXG4gICAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCA0XSk7XG4gICAgICBjZW50ZXJBcmNcbiAgICAgICAgLndpdGhDbG9ja3dpc2UoIWNlbnRlckFyYy5jbG9ja3dpc2UpXG4gICAgICAgIC5kcmF3KCk7XG4gICAgfVxuICB9O1xuICBjb250ZXh0LnJlc3RvcmUoKTtcblxuICAvLyBDZW50ZXIgZW5kIHNlZ21lbnRcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGNlbnRlckFyYy5lbmRTZWdtZW50KCkucmV2ZXJzZSgpLndpdGhMZW5ndGhSYXRpbygxLzIpLmRyYXcoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IHBvaW50IG1hcmtlclxuICBsZXQgc3RhcnRQb2ludCA9IGFyYy5zdGFydFBvaW50KCk7XG4gIHN0YXJ0UG9pbnRcbiAgICAuYXJjKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKS5kcmF3KCk7XG4gIHN0YXJ0UG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLnN0YXJ0LCBkcmF3ZXIuZGVidWdSYWRpdXMpXG4gICAgLndpdGhTdGFydEV4dGVuZGVkKC1kcmF3ZXIuZGVidWdSYWRpdXMvMilcbiAgICAuZHJhdygpO1xuXG4gIC8vIE9yaWVudGF0aW9uIG1hcmtlclxuICBsZXQgb3JpZW50YXRpb25MZW5ndGggPSBkcmF3ZXIuZGVidWdSYWRpdXMqMjtcbiAgbGV0IG9yaWVudGF0aW9uQXJjID0gYXJjXG4gICAgLnN0YXJ0U2VnbWVudCgpXG4gICAgLndpdGhMZW5ndGhBZGQoZHJhd2VyLmRlYnVnUmFkaXVzKVxuICAgIC5hcmMobnVsbCwgYXJjLmNsb2Nrd2lzZSlcbiAgICAud2l0aExlbmd0aChvcmllbnRhdGlvbkxlbmd0aClcbiAgICAuZHJhdygpO1xuICBsZXQgYXJyb3dDZW50ZXIgPSBvcmllbnRhdGlvbkFyY1xuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aChkcmF3ZXIuZGVidWdSYWRpdXMvMilcbiAgICAuY2hvcmRTZWdtZW50KCk7XG4gIGxldCBhcnJvd0FuZ2xlID0gMy8zMjtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoLWFycm93QW5nbGUpLmRyYXcoKTtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZSkuZHJhdygpO1xuXG4gIC8vIEludGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IGVuZFBvaW50ID0gYXJjLmVuZFBvaW50KCk7XG4gIGxldCBpbnRlcm5hbExlbmd0aCA9IE1hdGgubWluKGRyYXdlci5kZWJ1Z1JhZGl1cy8yLCBhcmMucmFkaXVzKTtcbiAgaW50ZXJuYWxMZW5ndGggLT0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGlmIChpbnRlcm5hbExlbmd0aCA+IHJhYy5lcXVhbGl0eVRocmVzaG9sZCkge1xuICAgIGVuZFBvaW50XG4gICAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZC5pbnZlcnNlKCksIGludGVybmFsTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIEV4dGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IHRleHRKb2luVGhyZXNob2xkID0gZHJhd2VyLmRlYnVnUmFkaXVzKjM7XG4gIGxldCBsZW5ndGhBdE9yaWVudGF0aW9uQXJjID0gb3JpZW50YXRpb25BcmNcbiAgICAud2l0aEVuZChhcmMuZW5kKVxuICAgIC5sZW5ndGgoKTtcbiAgbGV0IGV4dGVybmFsTGVuZ3RoID0gbGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkICYmIGRyYXdzVGV4dCA9PT0gdHJ1ZVxuICAgID8gZHJhd2VyLmRlYnVnUmFkaXVzIC0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXNcbiAgICA6IGRyYXdlci5kZWJ1Z1JhZGl1cy8yIC0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG5cbiAgZW5kUG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZCwgZXh0ZXJuYWxMZW5ndGgpXG4gICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRW5kIHBvaW50IGxpdHRsZSBhcmNcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGVuZFBvaW50XG4gICAgICAuYXJjKGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzLCBhcmMuZW5kLCBhcmMuZW5kLmludmVyc2UoKSwgYXJjLmNsb2Nrd2lzZSlcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgbGV0IGhGb3JtYXQgPSBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbDtcbiAgbGV0IHZGb3JtYXQgPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWw7XG5cbiAgbGV0IGhlYWRWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZGb3JtYXQudG9wXG4gICAgOiB2Rm9ybWF0LmJvdHRvbTtcbiAgbGV0IHRhaWxWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZGb3JtYXQuYm90dG9tXG4gICAgOiB2Rm9ybWF0LnRvcDtcbiAgbGV0IHJhZGl1c1ZlcnRpY2FsID0gYXJjLmNsb2Nrd2lzZVxuICAgID8gdkZvcm1hdC5ib3R0b21cbiAgICA6IHZGb3JtYXQudG9wO1xuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgaGVhZEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgaEZvcm1hdC5sZWZ0LFxuICAgIGhlYWRWZXJ0aWNhbCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGFyYy5zdGFydCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IHRhaWxGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIGhGb3JtYXQubGVmdCxcbiAgICB0YWlsVmVydGljYWwsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhcmMuZW5kLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgcmFkaXVzRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICBoRm9ybWF0LmxlZnQsXG4gICAgcmFkaXVzVmVydGljYWwsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBhcmMuc3RhcnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG5cbiAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5zdGFydCkpIHtcbiAgICBoZWFkRm9ybWF0ID0gaGVhZEZvcm1hdC5pbnZlcnNlKCk7XG4gICAgcmFkaXVzRm9ybWF0ID0gcmFkaXVzRm9ybWF0LmludmVyc2UoKTtcbiAgfVxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5lbmQpKSB7XG4gICAgdGFpbEZvcm1hdCA9IHRhaWxGb3JtYXQuaW52ZXJzZSgpO1xuICB9XG5cbiAgbGV0IHN0YXJ0U3RyaW5nID0gYHN0YXJ0OiR7ZHJhd2VyLmRlYnVnTnVtYmVyKGFyYy5zdGFydC50dXJuKX1gO1xuICBsZXQgcmFkaXVzU3RyaW5nID0gYHJhZGl1czoke2RyYXdlci5kZWJ1Z051bWJlcihhcmMucmFkaXVzKX1gO1xuICBsZXQgZW5kU3RyaW5nID0gYGVuZDoke2RyYXdlci5kZWJ1Z051bWJlcihhcmMuZW5kLnR1cm4pfWA7XG5cbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhcmMuYW5nbGVEaXN0YW5jZSgpO1xuICBsZXQgZGlzdGFuY2VTdHJpbmcgPSBgZGlzdGFuY2U6JHtkcmF3ZXIuZGVidWdOdW1iZXIoYW5nbGVEaXN0YW5jZS50dXJuKX1gO1xuXG4gIGxldCB0YWlsU3RyaW5nID0gYCR7ZGlzdGFuY2VTdHJpbmd9XFxuJHtlbmRTdHJpbmd9YDtcbiAgbGV0IGhlYWRTdHJpbmc7XG5cbiAgLy8gUmFkaXVzIGxhYmVsXG4gIGlmIChhbmdsZURpc3RhbmNlLnR1cm4gPD0gMy80ICYmICFhcmMuaXNDaXJjbGUoKSkge1xuICAgIC8vIFJhZGl1cyBkcmF3biBzZXBhcmF0ZWx5XG4gICAgbGV0IHBlcnBBbmdsZSA9IGFyYy5zdGFydC5wZXJwZW5kaWN1bGFyKCFhcmMuY2xvY2t3aXNlKTtcbiAgICBhcmMuY2VudGVyXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgZHJhd2VyLmRlYnVnUmFkaXVzKVxuICAgICAgLnBvaW50VG9BbmdsZShwZXJwQW5nbGUsIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzKjIpXG4gICAgICAudGV4dChyYWRpdXNTdHJpbmcsIHJhZGl1c0Zvcm1hdClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gICAgaGVhZFN0cmluZyA9IHN0YXJ0U3RyaW5nO1xuICB9IGVsc2Uge1xuICAgIC8vIFJhZGl1cyBqb2luZWQgdG8gaGVhZFxuICAgIGhlYWRTdHJpbmcgPSBgJHtzdGFydFN0cmluZ31cXG4ke3JhZGl1c1N0cmluZ31gO1xuICB9XG5cbiAgaWYgKGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPiB0ZXh0Sm9pblRocmVzaG9sZCkge1xuICAgIC8vIERyYXcgc3RyaW5ncyBzZXBhcmF0ZWx5XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgZHJhd2VyLmRlYnVnUmFkaXVzLzIpXG4gICAgICAudGV4dChoZWFkU3RyaW5nLCBoZWFkRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgICBvcmllbnRhdGlvbkFyYy5wb2ludEF0QW5nbGUoYXJjLmVuZClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLmVuZCwgZHJhd2VyLmRlYnVnUmFkaXVzLzIpXG4gICAgICAudGV4dCh0YWlsU3RyaW5nLCB0YWlsRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBEcmF3IHN0cmluZ3MgdG9nZXRoZXJcbiAgICBsZXQgYWxsU3RyaW5ncyA9IGAke2hlYWRTdHJpbmd9XFxuJHt0YWlsU3RyaW5nfWA7XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgZHJhd2VyLmRlYnVnUmFkaXVzLzIpXG4gICAgICAudGV4dChhbGxTdHJpbmdzLCBoZWFkRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfVxuXG5cblxufTsgLy8gZGVidWdBcmNcblxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBCZXppZXJcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgQ29tcG9zaXRlXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIFNoYXBlXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIFRleHRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmV4cG9ydHMuZHJhd1BvaW50ID0gZnVuY3Rpb24oZHJhd2VyLCBwb2ludCkge1xuICBkcmF3ZXIucDUucG9pbnQocG9pbnQueCwgcG9pbnQueSk7XG59OyAvLyBkcmF3UG9pbnRcblxuXG5leHBvcnRzLmRyYXdSYXkgPSBmdW5jdGlvbihkcmF3ZXIsIHJheSkge1xuICBjb25zdCBlZGdlTWFyZ2luID0gMDsgLy8gVXNlZCBmb3IgZGVidWdnaW5nXG4gIGNvbnN0IHR1cm4gPSByYXkuYW5nbGUudHVybjtcbiAgbGV0IGVuZFBvaW50ID0gbnVsbDtcbiAgaWZcbiAgICAodHVybiA+PSAxLzggJiYgdHVybiA8IDMvOClcbiAge1xuICAgIC8vIHBvaW50aW5nIGRvd25cbiAgICBjb25zdCBkb3duRWRnZSA9IGRyYXdlci5wNS5oZWlnaHQgLSBlZGdlTWFyZ2luO1xuICAgIGlmIChyYXkuc3RhcnQueSA8IGRvd25FZGdlKSB7XG4gICAgICBlbmRQb2ludCA9IHJheS5wb2ludEF0WShkb3duRWRnZSk7XG4gICAgfVxuICB9IGVsc2UgaWZcbiAgICAodHVybiA+PSAzLzggJiYgdHVybiA8IDUvOClcbiAge1xuICAgIC8vIHBvaW50aW5nIGxlZnRcbiAgICBjb25zdCBsZWZ0RWRnZSA9IGVkZ2VNYXJnaW47XG4gICAgaWYgKHJheS5zdGFydC54ID49IGxlZnRFZGdlKSB7XG4gICAgICBlbmRQb2ludCA9IHJheS5wb2ludEF0WChsZWZ0RWRnZSk7XG4gICAgfVxuICB9IGVsc2UgaWZcbiAgICAodHVybiA+PSA1LzggJiYgdHVybiA8IDcvOClcbiAge1xuICAgIC8vIHBvaW50aW5nIHVwXG4gICAgY29uc3QgdXBFZGdlID0gZWRnZU1hcmdpbjtcbiAgICBpZiAocmF5LnN0YXJ0LnkgPj0gdXBFZGdlKSB7XG4gICAgICBlbmRQb2ludCA9IHJheS5wb2ludEF0WSh1cEVkZ2UpO1xuICAgIH1cbiAgICAvLyByZXR1cm47XG4gIH0gZWxzZSB7XG4gICAgLy8gcG9pbnRpbmcgcmlnaHRcbiAgICBjb25zdCByaWdodEVkZ2UgPSBkcmF3ZXIucDUud2lkdGggLSBlZGdlTWFyZ2luO1xuICAgIGlmIChyYXkuc3RhcnQueCA8IHJpZ2h0RWRnZSkge1xuICAgICAgZW5kUG9pbnQgPSByYXkucG9pbnRBdFgocmlnaHRFZGdlKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kUG9pbnQgPT09IG51bGwpIHtcbiAgICAvLyBSYXkgaXMgb3V0c2lkZSBjYW52YXNcbiAgICByZXR1cm47XG4gIH1cblxuICBkcmF3ZXIucDUubGluZShcbiAgICByYXkuc3RhcnQueCwgcmF5LnN0YXJ0LnksXG4gICAgZW5kUG9pbnQueCwgIGVuZFBvaW50LnkpO1xufTsgLy8gZHJhd1JheVxuXG5cbmV4cG9ydHMuZHJhd1NlZ21lbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHNlZ21lbnQpIHtcbiAgY29uc3Qgc3RhcnQgPSBzZWdtZW50LnJheS5zdGFydDtcbiAgY29uc3QgZW5kID0gc2VnbWVudC5lbmRQb2ludCgpO1xuICBkcmF3ZXIucDUubGluZShcbiAgICBzdGFydC54LCBzdGFydC55LFxuICAgIGVuZC54LCAgIGVuZC55KTtcbn07IC8vIGRyYXdTZWdtZW50XG5cblxuZXhwb3J0cy5kcmF3QXJjID0gZnVuY3Rpb24oZHJhd2VyLCBhcmMpIHtcbiAgaWYgKGFyYy5pc0NpcmNsZSgpKSB7XG4gICAgbGV0IHN0YXJ0UmFkID0gYXJjLnN0YXJ0LnJhZGlhbnMoKTtcbiAgICBsZXQgZW5kUmFkID0gc3RhcnRSYWQgKyBSYWMuVEFVO1xuICAgIGRyYXdlci5wNS5hcmMoXG4gICAgICBhcmMuY2VudGVyLngsIGFyYy5jZW50ZXIueSxcbiAgICAgIGFyYy5yYWRpdXMgKiAyLCBhcmMucmFkaXVzICogMixcbiAgICAgIHN0YXJ0UmFkLCBlbmRSYWQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBzdGFydCA9IGFyYy5zdGFydDtcbiAgbGV0IGVuZCA9IGFyYy5lbmQ7XG4gIGlmICghYXJjLmNsb2Nrd2lzZSkge1xuICAgIHN0YXJ0ID0gYXJjLmVuZDtcbiAgICBlbmQgPSBhcmMuc3RhcnQ7XG4gIH1cblxuICBkcmF3ZXIucDUuYXJjKFxuICAgIGFyYy5jZW50ZXIueCwgYXJjLmNlbnRlci55LFxuICAgIGFyYy5yYWRpdXMgKiAyLCBhcmMucmFkaXVzICogMixcbiAgICBzdGFydC5yYWRpYW5zKCksIGVuZC5yYWRpYW5zKCkpO1xufTsgLy8gZHJhd0FyY1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29sb3Igd2l0aCBSQkdBIHZhbHVlcywgZWFjaCBvbiB0aGUgYFswLDFdYCByYW5nZS5cbiogQGFsaWFzIFJhYy5Db2xvclxuKi9cbmNsYXNzIENvbG9yIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHIsIGcsIGIsIGFscGhhID0gMSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHIsIGcsIGIsIGFscGhhKTtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnIgPSByO1xuICAgIHRoaXMuZyA9IGc7XG4gICAgdGhpcy5iID0gYjtcbiAgICB0aGlzLmFscGhhID0gYWxwaGE7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBDb2xvcigke3RoaXMucn0sJHt0aGlzLmd9LCR7dGhpcy5ifSwke3RoaXMuYWxwaGF9KWA7XG4gIH1cblxuICBzdGF0aWMgZnJvbVJnYmEocmFjLCByLCBnLCBiLCBhID0gMjU1KSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcihyYWMsIHIvMjU1LCBnLzI1NSwgYi8yNTUsIGEvMjU1KTtcbiAgfVxuXG4gIGZpbGwoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuRmlsbCh0aGlzLnJhYywgdGhpcyk7XG4gIH1cblxuICBzdHJva2Uod2VpZ2h0ID0gMSkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0cm9rZSh0aGlzLnJhYywgdGhpcywgd2VpZ2h0KTtcbiAgfVxuXG4gIHdpdGhBbHBoYShuZXdBbHBoYSkge1xuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIG5ld0FscGhhKTtcbiAgfVxuXG4gIHdpdGhBbHBoYVJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzLnJhYywgdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hbHBoYSAqIHJhdGlvKTtcbiAgfVxuXG59IC8vIGNsYXNzIENvbG9yXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEZpbGwgY29sb3Igc3R5bGUgZm9yIGRyYXdpbmcuXG4qIEBhbGlhcyBSYWMuRmlsbFxuKi9cbmNsYXNzIEZpbGwge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgY29sb3IgPSBudWxsKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgRmlsbCkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5TdHJva2UpIHtcbiAgICAgIHJldHVybiBuZXcgRmlsbChyYWMsIHNvbWV0aGluZy5jb2xvcik7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuQ29sb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRmlsbChyYWMsIHNvbWV0aGluZyk7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgZGVyaXZlIFJhYy5GaWxsIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cbiAgc3R5bGVXaXRoU3Ryb2tlKHN0cm9rZSkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlKHRoaXMucmFjLCBzdHJva2UsIHRoaXMpO1xuICB9XG5cbn0gLy8gY2xhc3MgRmlsbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gRmlsbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFN0cm9rZSBjb2xvciBhbmQgd2VpZ2h0IHN0eWxlIGZvciBkcmF3aW5nLlxuKiBAYWxpYXMgUmFjLlN0cm9rZVxuKi9cbmNsYXNzIFN0cm9rZSB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBjb2xvciA9IG51bGwsIHdlaWdodCA9IDEpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCB3ZWlnaHQpO1xuICAgIHRoaXMucmFjID0gcmFjXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMud2VpZ2h0ID0gd2VpZ2h0O1xuICB9XG5cbiAgd2l0aFdlaWdodChuZXdXZWlnaHQpIHtcbiAgICByZXR1cm4gbmV3IFN0cm9rZSh0aGlzLnJhYywgdGhpcy5jb2xvciwgbmV3V2VpZ2h0KTtcbiAgfVxuXG4gIHdpdGhBbHBoYShuZXdBbHBoYSkge1xuICAgIGlmICh0aGlzLmNvbG9yID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFN0cm9rZSh0aGlzLnJhYywgbnVsbCwgdGhpcy53ZWlnaHQpO1xuICAgIH1cblxuICAgIGxldCBuZXdDb2xvciA9IHRoaXMuY29sb3Iud2l0aEFscGhhKG5ld0FscGhhKTtcbiAgICByZXR1cm4gbmV3IFN0cm9rZSh0aGlzLnJhYywgbmV3Q29sb3IsIHRoaXMud2VpZ2h0KTtcbiAgfVxuXG4gIHN0eWxlV2l0aEZpbGwoc29tZUZpbGwpIHtcbiAgICBsZXQgZmlsbCA9IFJhYy5GaWxsLmZyb20odGhpcy5yYWMsIHNvbWVGaWxsKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZSh0aGlzLnJhYywgdGhpcywgZmlsbCk7XG4gIH1cblxufSAvLyBjbGFzcyBTdHJva2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cm9rZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuY2xhc3MgU3R5bGUge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgc3Ryb2tlID0gbnVsbCwgZmlsbCA9IG51bGwpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnN0cm9rZSA9IHN0cm9rZTtcbiAgICB0aGlzLmZpbGwgPSBmaWxsO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHN0cm9rZVN0cmluZyA9ICdudWxsJztcbiAgICBpZiAodGhpcy5zdHJva2UgIT09IG51bGwpIHtcbiAgICAgIGxldCBjb2xvclN0cmluZyA9IHRoaXMuc3Ryb2tlLmNvbG9yID09PSBudWxsXG4gICAgICAgID8gJ251bGwtY29sb3InXG4gICAgICAgIDogdGhpcy5zdHJva2UuY29sb3IudG9TdHJpbmcoKTtcbiAgICAgIHN0cm9rZVN0cmluZyA9IGAke2NvbG9yU3RyaW5nfSwke3RoaXMuc3Ryb2tlLndlaWdodH1gO1xuICAgIH1cblxuICAgIGxldCBmaWxsU3RyaW5nID0gJ251bGwnO1xuICAgIGlmICh0aGlzLmZpbGwgIT09IG51bGwpIHtcbiAgICAgIGxldCBjb2xvclN0cmluZyA9IHRoaXMuZmlsbC5jb2xvciA9PT0gbnVsbFxuICAgICAgICA/ICdudWxsLWNvbG9yJ1xuICAgICAgICA6IHRoaXMuZmlsbC5jb2xvci50b1N0cmluZygpO1xuICAgICAgZmlsbFN0cmluZyA9IGNvbG9yU3RyaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBgU3R5bGUoczooJHtzdHJva2VTdHJpbmd9KSBmOiR7ZmlsbFN0cmluZ30pYDtcbiAgfVxuXG5cbiAgd2l0aFN0cm9rZShzdHJva2UpIHtcbiAgICByZXR1cm4gbmV3IFN0eWxlKHRoaXMucmFjLCBzdHJva2UsIHRoaXMuZmlsbCk7XG4gIH1cblxuICB3aXRoRmlsbChzb21lRmlsbCkge1xuICAgIGxldCBmaWxsID0gUmFjLkZpbGwuZnJvbSh0aGlzLnJhYywgc29tZUZpbGwpO1xuICAgIHJldHVybiBuZXcgU3R5bGUodGhpcy5yYWMsIHRoaXMuc3Ryb2tlLCBmaWxsKTtcbiAgfVxuXG59IC8vIGNsYXNzIFN0eWxlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHlsZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYHJhYy5Db2xvcmAgZnVuY3Rpb24gY29udGFpbnMgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBmb3IgY29udmVuaWVuY2VcbiogYHtAbGluayBSYWMuQ29sb3J9YCBvYmplY3RzIHdpdGggdGhlIGN1cnJlbnQgYHJhY2AgaW5zdGFuY2UuXG4qIEBuYW1lc3BhY2UgcmFjLkNvbG9yXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNDb2xvcihyYWMpIHtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYENvbG9yYCB3aXRoIHRoZSBnaXZlbiBgcmdiYWAgdmFsdWVzIGluIHRoZSBgWzAsMjU1XWAgcmFuZ2UuXG4gICogQG5hbWUgZnJvbVJnYmFcbiAgKiBAbWVtYmVyb2YgcmFjLkNvbG9yI1xuICAqIEBmdW5jdGlvblxuICAqL1xuICByYWMuQ29sb3IuZnJvbVJnYmEgPSBmdW5jdGlvbihyLCBnLCBiLCBhID0gMjU1KSB7XG4gICAgcmV0dXJuIFJhYy5Db2xvci5mcm9tUmdiYShyYWMsIHIsIGcsIGIsIGEpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQSBibGFjayBgQ29sb3JgLlxuICAqIEBuYW1lIGJsYWNrXG4gICogQG1lbWJlcm9mIHJhYy5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLmJsYWNrICAgPSByYWMuQ29sb3IoMCwgMCwgMCk7XG5cbiAgLyoqXG4gICogQSByZWQgYENvbG9yYC5cbiAgKiBAbmFtZSBibGFja1xuICAqIEBtZW1iZXJvZiByYWMuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5yZWQgICAgID0gcmFjLkNvbG9yKDEsIDAsIDApO1xuXG4gIHJhYy5Db2xvci5ncmVlbiAgID0gcmFjLkNvbG9yKDAsIDEsIDApO1xuICByYWMuQ29sb3IuYmx1ZSAgICA9IHJhYy5Db2xvcigwLCAwLCAxKTtcbiAgcmFjLkNvbG9yLnllbGxvdyAgPSByYWMuQ29sb3IoMSwgMSwgMCk7XG4gIHJhYy5Db2xvci5tYWdlbnRhID0gcmFjLkNvbG9yKDEsIDAsIDEpO1xuICByYWMuQ29sb3IuY3lhbiAgICA9IHJhYy5Db2xvcigwLCAxLCAxKTtcbiAgcmFjLkNvbG9yLndoaXRlICAgPSByYWMuQ29sb3IoMSwgMSwgMSk7XG5cbn0gLy8gYXR0YWNoUmFjQ29sb3JcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYHJhYy5GaWxsYCBmdW5jdGlvbiBjb250YWlucyBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGZvciBjb252ZW5pZW5jZVxuKiBge0BsaW5rIFJhYy5GaWxsfWAgb2JqZWN0cyB3aXRoIHRoZSBjdXJyZW50IGByYWNgIGluc3RhbmNlLlxuKiBAbmFtZXNwYWNlIHJhYy5GaWxsXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNGaWxsKHJhYykge1xuXG4gIC8qKlxuICAqIEEgYEZpbGxgIHdpdGhvdXQgY29sb3IuIFJlbW92ZXMgdGhlIGZpbGwgY29sb3Igd2hlbiBhcHBsaWVkLlxuICAqIEBuYW1lIG5vbmVcbiAgKiBAbWVtYmVyb2YgcmFjLkZpbGwjXG4gICovXG4gIHJhYy5GaWxsLm5vbmUgPSByYWMuRmlsbChudWxsKTtcblxufSAvLyBhdHRhY2hSYWNGaWxsXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGByYWMuU3Ryb2tlYCBmdW5jdGlvbiBjb250YWlucyBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGZvciBjb252ZW5pZW5jZVxuKiBge0BsaW5rIFJhYy5TdHJva2V9YCBvYmplY3RzIHdpdGggdGhlIGN1cnJlbnQgYHJhY2AgaW5zdGFuY2UuXG4qIEBuYW1lc3BhY2UgcmFjLlN0cm9rZVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjUG9pbnQocmFjKSB7XG5cbiAgLyoqXG4gICogQSBgU3Ryb2tlYCB3aXRob3V0IGFueSBjb2xvci4gVXNpbmcgb3IgYXBwbHlpbmcgdGhpcyBzdHJva2Ugd2lsbFxuICAqIGRpc2FibGUgc3Ryb2tlIGRyYXdpbmcuXG4gICpcbiAgKiBAbmFtZSBub25lXG4gICogQG1lbWJlcm9mIHJhYy5TdHJva2UjXG4gICovXG4gIHJhYy5TdHJva2Uubm9uZSA9IHJhYy5TdHJva2UobnVsbClcblxufSAvLyBhdHRhY2hSYWNTdHJva2VcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gSW1wbGVtZW50YXRpb24gb2YgYW4gZWFzZSBmdW5jdGlvbiB3aXRoIHNldmVyYWwgb3B0aW9ucyB0byB0YWlsb3IgaXRzXG4vLyBiZWhhdmlvdXIuIFRoZSBjYWxjdWxhdGlvbiB0YWtlcyB0aGUgZm9sbG93aW5nIHN0ZXBzOlxuLy8gVmFsdWUgaXMgcmVjZWl2ZWQsIHByZWZpeCBpcyByZW1vdmVkXG4vLyAgIFZhbHVlIC0+IGVhc2VWYWx1ZSh2YWx1ZSlcbi8vICAgICB2YWx1ZSA9IHZhbHVlIC0gcHJlZml4XG4vLyBSYXRpbyBpcyBjYWxjdWxhdGVkXG4vLyAgIHJhdGlvID0gdmFsdWUgLyBpblJhbmdlXG4vLyBSYXRpbyBpcyBhZGp1c3RlZFxuLy8gICByYXRpbyAtPiBlYXNlUmF0aW8ocmF0aW8pXG4vLyAgICAgYWRqdXN0ZWRSYXRpbyA9IChyYXRpbyArIHJhdGlvT2ZzZXQpICogcmF0aW9GYWN0b3Jcbi8vIEVhc2UgaXMgY2FsY3VsYXRlZFxuLy8gICBlYXNlZFJhdGlvID0gZWFzZVVuaXQoYWRqdXN0ZWRSYXRpbylcbi8vIEVhc2VkUmF0aW8gaXMgYWRqdXN0ZWQgYW5kIHJldHVybmVkXG4vLyAgIGVhc2VkUmF0aW8gPSAoZWFzZWRSYXRpbyArIGVhc2VPZnNldCkgKiBlYXNlRmFjdG9yXG4vLyAgIGVhc2VSYXRpbyhyYXRpbykgLT4gZWFzZWRSYXRpb1xuLy8gVmFsdWUgaXMgcHJvamVjdGVkXG4vLyAgIGVhc2VkVmFsdWUgPSB2YWx1ZSAqIGVhc2VkUmF0aW9cbi8vIFZhbHVlIGlzIGFkanVzdGVkIGFuZCByZXR1cm5lZFxuLy8gICBlYXNlZFZhbHVlID0gcHJlZml4ICsgKGVhc2VkVmFsdWUgKiBvdXRSYW5nZSlcbi8vICAgZWFzZVZhbHVlKHZhbHVlKSAtPiBlYXNlZFZhbHVlXG5jbGFzcyBFYXNlRnVuY3Rpb24ge1xuXG4gIC8vIEJlaGF2aW9ycyBmb3IgdGhlIGBlYXNlVmFsdWVgIGZ1bmN0aW9uIHdoZW4gYHZhbHVlYCBmYWxscyBiZWZvcmUgdGhlXG4gIC8vIGBwcmVmaXhgIGFuZCBhZnRlciBgaW5SYW5nZWAuXG4gIHN0YXRpYyBCZWhhdmlvciA9IHtcbiAgICAvLyBgdmFsdWVgIGlzIHJldHVybmVkIHdpdGhvdXQgYW55IGVhc2luZyB0cmFuc2Zvcm1hdGlvbi4gYHByZUZhY3RvcmBcbiAgICAvLyBhbmQgYHBvc3RGYWN0b3JgIGFyZSBhcHBsaWVkLiBUaGlzIGlzIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24uXG4gICAgcGFzczogXCJwYXNzXCIsXG4gICAgLy8gQ2xhbXBzIHRoZSByZXR1cm5lZCB2YWx1ZSB0byBgcHJlZml4YCBvciBgcHJlZml4K2luUmFuZ2VgO1xuICAgIGNsYW1wOiBcImNsYW1wXCIsXG4gICAgLy8gUmV0dXJucyB0aGUgYXBwbGllZCBlYXNpbmcgdHJhbnNmb3JtYXRpb24gdG8gYHZhbHVlYCBmb3IgdmFsdWVzXG4gICAgLy8gYmVmb3JlIGBwcmVmaXhgIGFuZCBhZnRlciBgaW5SYW5nZWAuXG4gICAgY29udGludWU6IFwiY29udGludWVcIlxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYSA9IDI7XG5cbiAgICAvLyBBcHBsaWVkIHRvIHJhdGlvIGJlZm9yZSBlYXNpbmcuXG4gICAgdGhpcy5yYXRpb09mZnNldCA9IDBcbiAgICB0aGlzLnJhdGlvRmFjdG9yID0gMTtcblxuICAgIC8vIEFwcGxpZWQgdG8gZWFzZWRSYXRpby5cbiAgICB0aGlzLmVhc2VPZmZzZXQgPSAwXG4gICAgdGhpcy5lYXNlRmFjdG9yID0gMTtcblxuICAgIC8vIERlZmluZXMgdGhlIGxvd2VyIGxpbWl0IG9mIGB2YWx1ZWBgIHRvIGFwcGx5IGVhc2luZy5cbiAgICB0aGlzLnByZWZpeCA9IDA7XG5cbiAgICAvLyBgdmFsdWVgIGlzIHJlY2VpdmVkIGluIGBpblJhbmdlYCBhbmQgb3V0cHV0IGluIGBvdXRSYW5nZWAuXG4gICAgdGhpcy5pblJhbmdlID0gMTtcbiAgICB0aGlzLm91dFJhbmdlID0gMTtcblxuICAgIC8vIEJlaGF2aW9yIGZvciB2YWx1ZXMgYmVmb3JlIGBwcmVmaXhgLlxuICAgIHRoaXMucHJlQmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3IucGFzcztcbiAgICAvLyBCZWhhdmlvciBmb3IgdmFsdWVzIGFmdGVyIGBwcmVmaXgraW5SYW5nZWAuXG4gICAgdGhpcy5wb3N0QmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3IucGFzcztcblxuICAgIC8vIEZvciBhIGBwcmVCZWhhdmlvcmAgb2YgYHBhc3NgLCB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gdmFsdWVzIGJlZm9yZVxuICAgIC8vIGBwcmVmaXhgLlxuICAgIHRoaXMucHJlRmFjdG9yID0gMTtcbiAgICAvLyBGb3IgYSBgcG9zdEJlaGF2aW9yYCBvZiBgcGFzc2AsIHRoZSBmYWN0b3IgYXBwbGllZCB0byB0aGUgdmFsdWVzXG4gICAgLy8gYWZ0ZXIgYHByZWZpeCtpblJhbmdlYC5cbiAgICB0aGlzLnBvc3RGYWN0b3IgPSAxO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBlYXNlZCB2YWx1ZSBmb3IgYHVuaXRgLiBCb3RoIHRoZSBnaXZlblxuICAvLyBgdW5pdGAgYW5kIHRoZSByZXR1cm5lZCB2YWx1ZSBhcmUgaW4gdGhlIFswLDFdIHJhbmdlLiBJZiBgdW5pdGAgaXNcbiAgLy8gb3V0c2lkZSB0aGUgWzAsMV0gdGhlIHJldHVybmVkIHZhbHVlIGZvbGxvd3MgdGhlIGN1cnZlIG9mIHRoZSBlYXNpbmdcbiAgLy8gZnVuY3Rpb24sIHdoaWNoIG1heSBiZSBpbnZhbGlkIGZvciBzb21lIHZhbHVlcyBvZiBgYWAuXG4gIC8vXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgdGhlIGJhc2UgZWFzaW5nIGZ1bmN0aW9uLCBpdCBkb2VzIG5vdCBhcHBseSBhbnlcbiAgLy8gb2Zmc2V0cyBvciBmYWN0b3JzLlxuICBlYXNlVW5pdCh1bml0KSB7XG4gICAgLy8gU291cmNlOlxuICAgIC8vIGh0dHBzOi8vbWF0aC5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvMTIxNzIwL2Vhc2UtaW4tb3V0LWZ1bmN0aW9uLzEyMTc1NSMxMjE3NTVcbiAgICAvLyBmKHQpID0gKHReYSkvKHReYSsoMS10KV5hKVxuICAgIGxldCByYSA9IE1hdGgucG93KHVuaXQsIHRoaXMuYSk7XG4gICAgbGV0IGlyYSA9IE1hdGgucG93KDEtdW5pdCwgdGhpcy5hKTtcbiAgICByZXR1cm4gcmEgLyAocmEgKyBpcmEpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZWFzZSBmdW5jdGlvbiBhcHBsaWVkIHRvIHRoZSBnaXZlbiByYXRpby4gYHJhdGlvT2Zmc2V0YFxuICAvLyBhbmQgYHJhdGlvRmFjdG9yYCBhcmUgYXBwbGllZCB0byB0aGUgaW5wdXQsIGBlYXNlT2Zmc2V0YCBhbmRcbiAgLy8gYGVhc2VGYWN0b3JgIGFyZSBhcHBsaWVkIHRvIHRoZSBvdXRwdXQuXG4gIGVhc2VSYXRpbyhyYXRpbykge1xuICAgIGxldCBhZGp1c3RlZFJhdGlvID0gKHJhdGlvICsgdGhpcy5yYXRpb09mZnNldCkgKiB0aGlzLnJhdGlvRmFjdG9yO1xuICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlVW5pdChhZGp1c3RlZFJhdGlvKTtcbiAgICByZXR1cm4gKGVhc2VkUmF0aW8gKyB0aGlzLmVhc2VPZmZzZXQpICogdGhpcy5lYXNlRmFjdG9yO1xuICB9XG5cbiAgLy8gQXBwbGllcyB0aGUgZWFzaW5nIGZ1bmN0aW9uIHRvIGB2YWx1ZWAgY29uc2lkZXJpbmcgdGhlIGNvbmZpZ3VyYXRpb25cbiAgLy8gb2YgdGhlIHdob2xlIGluc3RhbmNlLlxuICBlYXNlVmFsdWUodmFsdWUpIHtcbiAgICBsZXQgYmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3I7XG5cbiAgICBsZXQgc2hpZnRlZFZhbHVlID0gdmFsdWUgLSB0aGlzLnByZWZpeDtcbiAgICBsZXQgcmF0aW8gPSBzaGlmdGVkVmFsdWUgLyB0aGlzLmluUmFuZ2U7XG5cbiAgICAvLyBCZWZvcmUgcHJlZml4XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5wcmVmaXgpIHtcbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5wYXNzKSB7XG4gICAgICAgIGxldCBkaXN0YW5jZXRvUHJlZml4ID0gdmFsdWUgLSB0aGlzLnByZWZpeDtcbiAgICAgICAgLy8gV2l0aCBhIHByZUZhY3RvciBvZiAxIHRoaXMgaXMgZXF1aXZhbGVudCB0byBgcmV0dXJuIHJhbmdlYFxuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyAoZGlzdGFuY2V0b1ByZWZpeCAqIHRoaXMucHJlRmFjdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5jbGFtcCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXg7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IuY29udGludWUpIHtcbiAgICAgICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VSYXRpbyhyYXRpbyk7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGVhc2VkUmF0aW8gKiB0aGlzLm91dFJhbmdlO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHByZUJlaGF2aW9yIGNvbmZpZ3VyYXRpb24gLSBwcmVCZWhhdmlvcjoke3RoaXMucG9zdEJlaGF2aW9yfWApO1xuICAgICAgdGhyb3cgcmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgIH1cblxuICAgIC8vIEFmdGVyIHByZWZpeFxuICAgIGlmIChyYXRpbyA8PSAxIHx8IHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5jb250aW51ZSkge1xuICAgICAgLy8gRWFzZSBmdW5jdGlvbiBhcHBsaWVkIHdpdGhpbiByYW5nZSAob3IgYWZ0ZXIpXG4gICAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVJhdGlvKHJhdGlvKTtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGVhc2VkUmF0aW8gKiB0aGlzLm91dFJhbmdlO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLnBhc3MpIHtcbiAgICAgIC8vIFNoaWZ0ZWQgdG8gaGF2ZSBpblJhbmdlIGFzIG9yaWdpblxuICAgICAgbGV0IHNoaWZ0ZWRQb3N0ID0gc2hpZnRlZFZhbHVlIC0gdGhpcy5pblJhbmdlO1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5vdXRSYW5nZSArIHNoaWZ0ZWRQb3N0ICogdGhpcy5wb3N0RmFjdG9yO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLmNsYW1wKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLm91dFJhbmdlO1xuICAgIH1cblxuICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgcG9zdEJlaGF2aW9yIGNvbmZpZ3VyYXRpb24gLSBwb3N0QmVoYXZpb3I6JHt0aGlzLnBvc3RCZWhhdmlvcn1gKTtcbiAgICB0aHJvdyByYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gIH1cblxuXG4gIC8vIFByZWNvbmZpZ3VyZWQgZnVuY3Rpb25zXG5cbiAgLy8gTWFrZXMgYW4gZWFzZUZ1bmN0aW9uIHByZWNvbmZpZ3VyZWQgdG8gYW4gZWFzZSBvdXQgbW90aW9uLlxuICAvL1xuICAvLyBUaGUgYG91dFJhbmdlYCB2YWx1ZSBzaG91bGQgYmUgYGluUmFuZ2UqMmAgaW4gb3JkZXIgZm9yIHRoZSBlYXNlXG4gIC8vIG1vdGlvbiB0byBjb25uZWN0IHdpdGggdGhlIGV4dGVybmFsIG1vdGlvbiBhdCB0aGUgY29ycmVjdCB2ZWxvY2l0eS5cbiAgc3RhdGljIG1ha2VFYXNlT3V0KCkge1xuICAgIGxldCBlYXNlT3V0ID0gbmV3IEVhc2VGdW5jdGlvbigpXG4gICAgZWFzZU91dC5yYXRpb09mZnNldCA9IDE7XG4gICAgZWFzZU91dC5yYXRpb0ZhY3RvciA9IC41O1xuICAgIGVhc2VPdXQuZWFzZU9mZnNldCA9IC0uNTtcbiAgICBlYXNlT3V0LmVhc2VGYWN0b3IgPSAyO1xuICAgIHJldHVybiBlYXNlT3V0O1xuICB9XG5cbn0gLy8gY2xhc3MgRWFzZUZ1bmN0aW9uXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFYXNlRnVuY3Rpb247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogRXhjZXB0aW9uIGJ1aWxkZXIgZm9yIHRocm93YWJsZSBvYmplY3RzLlxuKiBAYWxpYXMgUmFjLkV4Y2VwdGlvblxuKi9cbmNsYXNzIEV4Y2VwdGlvbiB7XG5cbiAgY29uc3RydWN0b3IobmFtZSwgbWVzc2FnZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgRXhjZXB0aW9uOiR7dGhpcy5uYW1lfSAtICR7dGhpcy5tZXNzYWdlfWA7XG4gIH1cblxuICAvKipcbiAgKiBXaGVuIGVuYWJsZWQgdGhlIGNvbnZlbmllbmNlIHN0YXRpYyBmdW5jdGlvbnMgb2YgdGhpcyBjbGFzcyB3aWxsXG4gICogYnVpbGQgYEVycm9yYCBvYmplY3RzLCBpbnN0ZWFkIG9mIGBFeGNlcHRpb25gIG9iamVjdHMuXG4gICpcbiAgKiBVc2VkIGZvciB0ZXN0cyBydW5zIGluIEplc3QsIHNpbmNlIHRocm93aW5nIGEgY3VzdG9tIG9iamVjdCBsaWtlXG4gICogYEV4Y2VwdGlvbmAgd2l0aGluIGEgbWF0Y2hlciByZXN1bHRzIGluIHRoZSBleHBlY3RhdGlvbiBoYW5naW5nXG4gICogaW5kZWZpbml0ZWx5LlxuICAqXG4gICogT24gdGhlIG90aGVyIGhhbmQsIHRocm93aW5nIGFuIGBFcnJvcmAgb2JqZWN0IGluIGNocm9tZSBjYXVzZXMgdGhlXG4gICogZGlzcGxheWVkIHN0YWNrIHRvIGJlIHJlbGF0aXZlIHRvIHRoZSBidW5kbGVkIGZpbGUsIGluc3RlYWQgb2YgdGhlXG4gICogc291cmNlIG1hcC5cbiAgKi9cbiAgc3RhdGljIGJ1aWxkc0Vycm9ycyA9IGZhbHNlO1xuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGJ1aWxkaW5nIHRocm93YWJsZSBvYmplY3RzLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGNhbiBjYW4gYmUgdXNlZCBhcyBmb2xsb3dpbmc6XG4gICogYGBgXG4gICogZnVuYyhtZXNzYWdlKSAvLyByZXR1cm5zIGFuIGBFeGNlcHRpb25gYCBvYmplY3Qgd2l0aCBgbmFtZWAgYW5kIGBtZXNzYWdlYFxuICAqIGZ1bmMuZXhjZXB0aW9uTmFtZSAvLyByZXR1cm5zIHRoZSBgbmFtZWAgb2YgdGhlIGJ1aWx0IHRocm93YWJsZSBvYmplY3RzXG4gICogYGBgXG4gICovXG4gIHN0YXRpYyBuYW1lZChuYW1lKSB7XG4gICAgbGV0IGZ1bmMgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKEV4Y2VwdGlvbi5idWlsZHNFcnJvcnMpIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgIGVycm9yLm5hbWUgPSBuYW1lO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgRXhjZXB0aW9uKG5hbWUsIG1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICBmdW5jLmV4Y2VwdGlvbk5hbWUgPSBuYW1lO1xuICAgIHJldHVybiBmdW5jO1xuICB9XG5cbiAgc3RhdGljIGRyYXdlck5vdFNldHVwID0gICAgRXhjZXB0aW9uLm5hbWVkKCdEcmF3ZXJOb3RTZXR1cCcpO1xuICBzdGF0aWMgZmFpbGVkQXNzZXJ0ID0gICAgICBFeGNlcHRpb24ubmFtZWQoJ0ZhaWxlZEFzc2VydCcpO1xuICBzdGF0aWMgaW52YWxpZE9iamVjdFR5cGUgPSBFeGNlcHRpb24ubmFtZWQoJ2ludmFsaWRPYmplY3RUeXBlJyk7XG5cbiAgLy8gYWJzdHJhY3RGdW5jdGlvbkNhbGxlZDogJ0Fic3RyYWN0IGZ1bmN0aW9uIGNhbGxlZCcsXG4gIC8vIGludmFsaWRQYXJhbWV0ZXJDb21iaW5hdGlvbjogJ0ludmFsaWQgcGFyYW1ldGVyIGNvbWJpbmF0aW9uJyxcbiAgLy8gaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb246ICdJbnZhbGlkIG9iamVjdCBjb25maWd1cmF0aW9uJyxcbiAgLy8gaW52YWxpZE9iamVjdFRvRHJhdzogJ0ludmFsaWQgb2JqZWN0IHRvIGRyYXcnLFxuICAvLyBpbnZhbGlkT2JqZWN0VG9BcHBseTogJ0ludmFsaWQgb2JqZWN0IHRvIGFwcGx5JyxcblxufSAvLyBjbGFzcyBFeGNlcHRpb25cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEV4Y2VwdGlvbjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBJbnRlcm5hbCB1dGlsaXRpZXMuXG4qIEBuYW1lc3BhY2UgdXRpbHNcbiovXG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgcGFzc2VkIHBhcmFtZXRlcnMgYXJlIG9iamVjdHMgb3IgcHJpbWl0aXZlcy4gSWYgYW55XG4qIHBhcmFtZXRlciBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWBcbiogaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLk9iamVjdHxwcmltaXRpdmV9IHBhcmFtZXRlcnNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qIEBuYW1lIGFzc2VydEV4aXN0c1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYXNzZXJ0RXhpc3RzID0gZnVuY3Rpb24oLi4ucGFyYW1ldGVycykge1xuICBwYXJhbWV0ZXJzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGl0ZW0gPT09IG51bGwgfHwgaXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYE1pc3NpbmcgZWxlbWVudCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgYGVsZW1lbnRzYCBhcmUgb2JqZWN0cyBvciB0aGUgZ2l2ZW4gYHR5cGVvYCwgb3RoZXJ3aXNlIGFcbiogYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHtmdW5jdGlvbn0gdHlwZVxuKiBAcGFyYW0gey4uLk9iamVjdH0gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qIEBuYW1lIGFzc2VydFR5cGVcbiogQG1lbWJlcm9mIHV0aWxzI1xuKiBAZnVuY3Rpb25cbiovXG5leHBvcnRzLmFzc2VydFR5cGUgPSBmdW5jdGlvbih0eXBlLCAuLi5lbGVtZW50cykge1xuICBlbGVtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiB0eXBlKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX0gZXhwZWN0ZWQtbmFtZToke3R5cGUubmFtZX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG51bWJlciBwcmltaXRpdmVzIGFuZCBub3QgTmFOLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLm51bWJlcn0gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qIEBuYW1lIGFzc2VydE51bWJlclxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYXNzZXJ0TnVtYmVyID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdudW1iZXInIHx8IGlzTmFOKGl0ZW0pKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgbnVtYmVyIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIHN0cmluZyBwcmltaXRpdmVzLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLnN0cmluZ30gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qIEBuYW1lIGFzc2VydFN0cmluZ1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYXNzZXJ0U3RyaW5nID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3Rpbmcgc3RyaW5nIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIGJvb2xlYW4gcHJpbWl0aXZlcywgb3RoZXJ3aXNlIGFcbiogYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5ib29sZWFufSBlbGVtZW50c1xuKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiogQG5hbWUgYXNzZXJ0Qm9vbGVhblxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYXNzZXJ0Qm9vbGVhbiA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUsIGV4cGVjdGluZyBib29sZWFuIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBjb25zdHJ1Y3RvciBuYW1lIG9mIGBvYmpgLCBvciBpdHMgdHlwZSBuYW1lLlxuKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgZGVidWdnaW5nLlxuKlxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKiBAbmFtZSB0eXBlTmFtZVxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKG9iaikge1xuICBpZiAob2JqID09PSB1bmRlZmluZWQpIHsgcmV0dXJuICd1bmRlZmluZWQnOyB9XG4gIGlmIChvYmogPT09IG51bGwpIHsgcmV0dXJuICdudWxsJzsgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIG9iai5uYW1lICE9IG51bGwpIHtcbiAgICByZXR1cm4gb2JqLm5hbWUgPT0gJydcbiAgICAgID8gYGZ1bmN0aW9uYFxuICAgICAgOiBgZnVuY3Rpb246JHtvYmoubmFtZX1gO1xuICB9XG4gIHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZSA/PyB0eXBlb2Ygb2JqO1xufVxuZXhwb3J0cy50eXBlTmFtZSA9IHR5cGVOYW1lO1xuXG5cbi8qKlxuKiBBZGRzIGEgY29uc3RhbnQgdG8gdGhlIGdpdmVuIG9iamVjdCwgdGhlIGNvbnN0YW50IGlzIG5vdCBlbnVtZXJhYmxlIGFuZFxuKiBub3QgY29uZmlndXJhYmxlLlxuKlxuKiBAbmFtZSBhZGRDb25zdGFudFxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qIEBmdW5jdGlvblxuKi9cbmV4cG9ydHMuYWRkQ29uc3RhbnQgPSBmdW5jdGlvbihvYmosIHByb3BOYW1lLCB2YWx1ZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wTmFtZSwge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9KTtcbn1cblxuIl19
