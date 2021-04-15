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

