'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


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


  static Selection = class ControlSelection{
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
    angle.sub(angleDistance), angle.add(angleDistance));

  // Arrow walls
  let pointAngle = rac.Angle.from(1/8);
  let rightWall = arc.startPoint().segmentToAngle(angle.add(pointAngle), 100);
  let leftWall = arc.endPoint().segmentToAngle(angle.sub(pointAngle), 100);

  // Arrow point
  let point = rightWall.pointAtIntersectionWithSegment(leftWall);

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
    .translateToStart(pointerCenter)
    .end;

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

