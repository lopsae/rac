'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


// TODO: fix uses of someAngle


/**
* Abstract class for controls that use an `anchor` object to determine the
* visual position of the control's interactive elements. The `anchor` is
* tightly coupled with the specific implementation of a control, for
* example `[ArcControl]{@link Rac.ArcControl}` uses an
* `[Arc]{@link Rac.Arc}` as anchor, which defines where the control is
* drawn, what orientation it uses, and the position of the starting and
* ending values.
*
* The main outputs of a control are:
* + `value`, which is in the range `[startValue,endValue]`
* + `ratioValue()`, which is the range *[0,1]*
* + `distance()`, depending on the implementation, the distance between
*   the control initial position and its current
*
* Internally a control keeps a `value` to represent to track the position
* of the control within a range of posible values.
*
* Internally a control keeps a `value` as its single point of truth. This
* `value` is a number between `startValue` and `endValue`, both inclusive.
* By default `[startValue,endValue]` is set to *[0,1]*. This range can be
* set to any range, including toward negative-direction. This allows to
* modify the `value` produced by the control to a specific range,
* independently of its graphical representation.
*
* For example:
* ```
* For a control set with startValue,endValue of 100,200
* + start position:  valueRatio is 0,   value is 100
* + middle position: valueRatio is 0.5, value is 150
*
* For a control set with startValue,endValue of 0,1
* + start position:  valueRatio = 0,   value = 0
* + middle position: valueRatio = 0.5, value = 0.5
*
* For a control set with startValue,endValue of 50,40
* + start position:  valueRatio = 0,   value = 50
* + middle position: valueRatio = 0.5, value = 45
* ```
*
*
* // MAICTODO: older docs below
* A control mantains a current `value` within the range
* `[startValue,endValue]`, which by default is set to *[0,1]*. This range
* can be used to translate the value read from a
*
* Additionally a control can be configured with `markers` to highlight
* the positions of certain values, and with a specific `style` to use when
* drawing.
*
* ⚠️ The API for controls is **planned to change** in a future minor release. ⚠️
*
* @alias Rac.Control
*/
class Control {

  /**
  * Creates a new `Control` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} value - The initial value of the control
  * @param {number} [startValue=0] - The lowest value the control can have
  * @param {number} [endValue=1] - The highest value the control can have
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

    // Value is a number between startValue and endValue.
    /**
    * Current value of the control, in the range `[startValue, endValue]`
    */
    this.value = value;

    // Start and end of the value range.
    /**
    *
    */
    this.projectionStart = 0;

    /**
    *
    */
    this.projectionEnd = 1;

    // Limits to which the control can be dragged. Interpreted as values in
    // the value-range.
    /**
    *
    */
    this.startLimit = 0;

    /**
    *
    */
    this.endLimit = 1;

    // Collection of values at which markers are drawn.
    /**
    *
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


  valueProjection() {
    let projectionRange = this.projectionEnd - this.projectionStart;
    return (this.value * projectionRange) + this.projectionStart;
  }

  // Returns the equivalent of the given ratio in the range [0,1] to a value
  // in the value range.
  valueOf(projection) {
    let projectionRange = this.projectionEnd - this.projectionStart;
    return (projection - this.projectionStart) / projectionRange;
  }


  // MAICTODO: setLimitsWithProjectionInsets
  // Sets `startLimit` and `endLimit` with two inset values relative to the
  // [0,1] range.
  // setLimitsWithRatioInsets(startInset, endInset) {
  //   this.startLimit = this.valueOf(startInset);
  //   this.endLimit = this.valueOf(1 - endInset);
  // }

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
  // interaction visuals. Called by `drawControls` only for the currently
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

