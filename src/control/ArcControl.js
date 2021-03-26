'use strict';


module.exports = function makeArcControl(rac) {

  // Control that uses an Arc as anchor.
  return class RacArcControl extends rac.Control {

    // Creates a new Control instance with the given `value` and an
    // `angleDistance` from `someAngleDistance`.
    // By default the value range is [0,1] and limits are set to be the equal
    // as `startValue` and `endValue`.
    constructor(value, someAngleDistance, startValue = 0, endValue = 1) {
      super(value, startValue, endValue);

      // Angle distance for the copied anchor object.
      this.angleDistance = rac.Angle.from(someAngleDistance);

      // `Arc`` to which the control will be anchored. When the control is
      // drawn and interacted a copy of the anchor is created with the
      // control's `angleDistance`.
      this.anchor = null;
    }

    setValueWithAngleDistance(someAngleDistance) {
      let angleDistance = rac.Angle.from(someAngleDistance)
      let angleDistanceRatio = angleDistance.turn / this.angleDistance.turnOne();
      this.value = this.valueOf(angleDistanceRatio);
    }

    setLimitsWithAngleDistanceInsets(startInset, endInset) {
      startInset = rac.Angle.from(startInset);
      endInset = rac.Angle.from(endInset);
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
        ? this.style.withFill(rac.Fill.none)
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
        rac.Control.makeValueMarker(point, markerAngle.perpendicular(!anchorCopy.clockwise))
          .attachToComposite();
      }, this);

      // Control button
      center.arc(rac.Control.radius)
        .attachToComposite();

      let ratioValue = this.ratioValue();

      // Negative arrow
      if (ratioValue >= this.ratioStartLimit() + rac.equalityThreshold) {
        let negAngle = angle.perpendicular(anchorCopy.clockwise).inverse();
        rac.Control.makeArrowShape(center, negAngle)
          .attachToComposite();
      }

      // Positive arrow
      if (ratioValue <= this.ratioEndLimit() - rac.equalityThreshold) {
        let posAngle = angle.perpendicular(anchorCopy.clockwise);
        rac.Control.makeArrowShape(center, posAngle)
          .attachToComposite();
      }

      rac.popComposite().draw(this.style);

      // Selection
      if (this.isSelected()) {
        center.arc(rac.Control.radius * 1.5).draw(rac.Control.pointerStyle);
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
        rac.Control.makeValueMarker(markerPoint, markerAngle.perpendicular(!anchorCopy.clockwise))
          .attachToComposite();
      });

      // Limit markers
      let ratioStartLimit = this.ratioStartLimit();
      if (ratioStartLimit > 0) {
        let minAngle = anchorCopy.shiftAngle(angleDistance.multOne(ratioStartLimit));
        let minPoint = anchorCopy.pointAtAngle(minAngle);
        let markerAngle = minAngle.perpendicular(anchorCopy.clockwise);
        rac.Control.makeLimitMarker(minPoint, markerAngle)
          .attachToComposite();
      }

      let ratioEndLimit = this.ratioEndLimit();
      if (ratioEndLimit < 1) {
        let maxAngle = anchorCopy.shiftAngle(angleDistance.multOne(ratioEndLimit));
        let maxPoint = anchorCopy.pointAtAngle(maxAngle);
        let markerAngle = maxAngle.perpendicular(!anchorCopy.clockwise);
        rac.Control.makeLimitMarker(maxPoint, markerAngle)
          .attachToComposite();
      }

      // Segment from pointer to control dragged center
      let draggedCenter = pointerOffset
        .translateToStart(pointerCenter)
        .end;

      // Control dragged center, attached to pointer
      draggedCenter.arc(2)
        .attachToComposite();

      // TODO: implement arc control dragging visuals!

      rac.popComposite().draw(rac.Control.pointerStyle);
    }

  } // RacArcControl

} // makeArcControl

