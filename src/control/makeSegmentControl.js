'use strict';


module.exports = function makeSegmentControl(rac) {

  // Control that uses a Segment as anchor.
  return class RacSegmentControl extends rac.Control {

    // Creates a new Control instance with the given `value` and `length`.
    // By default the value range is [0,1] and limits are set to be the equal
    // as `startValue` and `endValue`.
    constructor(value, length, startValue = 0, endValue = 1) {
      super(value, startValue, endValue);

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
      return this.anchor.withLength(this.distance()).end;
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
        rac.Control.makeValueMarker(point, angle)
          .attachToComposite();
      }, this);

      // Control button
      center.arc(rac.Control.radius)
        .attachToComposite();

      let ratioValue = this.ratioValue();

      // Negative arrow
      if (ratioValue >= this.ratioStartLimit() + rac.equalityThreshold) {
        rac.Control.makeArrowShape(center, angle.inverse())
          .attachToComposite();
      }

      // Positive arrow
      if (ratioValue <= this.ratioEndLimit() - rac.equalityThreshold) {
        rac.Control.makeArrowShape(center, angle)
          .attachToComposite();
      }

      rac.popComposite().draw(this.style);

      // Selection
      if (this.isSelected()) {
        center.arc(rac.Control.radius * 1.5).draw(rac.Control.pointerStyle);
      }
    }

    updateWithPointer(pointerControlCenter, anchorCopy) {
      let length = anchorCopy.length();
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
      let length = anchorCopy.length();

      // Value markers
      this.markers.forEach(item => {
        let markerRatio = this.ratioOf(item);
        if (markerRatio < 0 || markerRatio > 1) { return }
        let markerPoint = anchorCopy.start.pointToAngle(angle, length * markerRatio);
        rac.Control.makeValueMarker(markerPoint, angle)
          .attachToComposite();
      });

      // Limit markers
      let ratioStartLimit = this.ratioStartLimit();
      if (ratioStartLimit > 0) {
        let minPoint = anchorCopy.start.pointToAngle(angle, length * ratioStartLimit);
        rac.Control.makeLimitMarker(minPoint, angle)
          .attachToComposite();
      }

      let ratioEndLimit = this.ratioEndLimit();
      if (ratioEndLimit < 1) {
        let maxPoint = anchorCopy.start.pointToAngle(angle, length * ratioEndLimit);
        rac.Control.makeLimitMarker(maxPoint, angle.inverse())
          .attachToComposite();
      }

      // Segment from pointer to control dragged center
      let draggedCenter = pointerOffset
        .translateToStart(pointerCenter)
        .end;

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
        .end;

      // Control center constrained to anchor
      constrainedAnchorCenter.arc(rac.Control.radius)
        .attachToComposite();

      // Dragged shadow center, semi attached to pointer
      // always perpendicular to anchor
      let draggedShadowCenter = draggedCenter
        .segmentPerpendicularToSegment(anchorCopy)
        // reverse and translated to constraint to anchor
        .reverse()
        .translateToStart(constrainedAnchorCenter)
        // Segment from constrained center to shadow center
        .attachToComposite()
        .end;

      // Control shadow center
      draggedShadowCenter.arc(rac.Control.radius / 2)
        .attachToComposite();

      // Ease for segment to dragged shadow center
      let easeOut = rac.EaseFunction.makeEaseOut();
      easeOut.postBehavior = rac.EaseFunction.Behavior.clamp;

      // Tail will stop stretching at 2x the max tail length
      let maxDraggedTailLength = rac.Control.radius * 5;
      easeOut.inRange = maxDraggedTailLength * 2;
      easeOut.outRange = maxDraggedTailLength;

      // Segment to dragged shadow center
      let draggedTail = draggedShadowCenter
        .segmentToPoint(draggedCenter);

      let easedLength = easeOut.easeValue(draggedTail.length());
      draggedTail.withLength(easedLength).attachToComposite();

      // Draw all!
      rac.popComposite().draw(rac.Control.pointerStyle);
    }

  } // RacSegmentControl

} // makeSegmentControl
