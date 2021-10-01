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

