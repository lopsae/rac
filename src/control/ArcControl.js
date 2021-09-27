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

  // Returns the angle distance from `anchor.start` to the control center.
  distance() {
    return this.angleDistance.multOne(this.value);
  }

  // TODO: rename control.center to control.knob or similar
  center() {
    if (this.anchor === null) {
      // Not posible to calculate a center
      return null;
    }
    return this.anchor.withAngleDistance(this.distance()).endPoint();
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

    let anchorStyle = controlStyle !== null
      ? controlStyle.appendStyle(this.rac.Fill.none)
      : this.rac.Fill.none;

    // Arc anchor is always drawn without fill
    fixedAnchor.draw(anchorStyle);

    let center = this.center();
    let angle = fixedAnchor.center.angleToPoint(center);

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let markerAngleDistance = this.angleDistance.multOne(item);
      let markerAngle = fixedAnchor.shiftAngle(markerAngleDistance);
      let point = fixedAnchor.pointAtAngle(markerAngle);
      Rac.Control.makeValueMarker(this.rac, point, markerAngle.perpendicular(!fixedAnchor.clockwise))
        .attachToComposite();
    }, this);

    // Control button
    center.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    // Negative arrow
    if (this.value >= this.startLimit + this.rac.unitaryEqualityThreshold) {
      let negAngle = angle.perpendicular(fixedAnchor.clockwise).inverse();
      Rac.Control.makeArrowShape(this.rac, center, negAngle)
        .attachToComposite();
    }

    // Positive arrow
    if (this.value <= this.endLimit - this.rac.unitaryEqualityThreshold) {
      let posAngle = angle.perpendicular(fixedAnchor.clockwise);
      Rac.Control.makeArrowShape(this.rac, center, posAngle)
        .attachToComposite();
    }

    Rac.popComposite().draw(controlStyle);

    // Selection
    if (this.isSelected()) {
      let pointerStyle = this.rac.controller.pointerStyle;
      if (pointerStyle !== null) {
        center.arc(this.rac.controller.knobRadius * 1.5).draw(pointerStyle);
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
    fixedAnchor.attachToComposite();

    let angleDistance = fixedAnchor.angleDistance();

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

    let composite = Rac.popComposite();

    // TODO: implement arc control dragging visuals!
    let pointerStyle = this.rac.controller.pointerStyle;
    if (pointerStyle !== null) {
      composite.draw(pointerStyle);
    }
  }

} // class ArcControl


module.exports = ArcControl;

