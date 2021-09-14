'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


// TODO: fix uses of someAngle


/**
* Parent class for controls that use an `anchor` object to determine the
* visual position of the control's interactive elements.
*
* A control mantains a current `value` within the range
* `[startValue,endValue]`, which by default is set to *[0,1]*.
*
* Additionally a control can be configured with `markers` to highlight
* the positions of certain values, and with a specific `style`` to use when
* drawing.
*
* ⚠️ The API for controls is **planned to change** in a future minor release. ⚠️
*
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

    /**
    * Style to apply when drawing. This style gets applied after
    * `[rac.controller.controlStyle]{@link Rac.Controller#controlStyle}`.
    *
    * @type {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} [style=null]
    * @default null
    */
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

