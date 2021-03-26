'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Arc from a start angle to an end angle.
* @alias Rac.Arc
*/
class Arc{

  constructor(
    rac,
    center, radius,
    start = rac.Angle.zero,
    end = start,
    clockwise = true)
  {
    this.rac = rac;
    this.center = center;
    this.radius = radius;
    // Start angle of the arc. Arc will draw from this angle towards `end`
    // in the `clockwise` orientaton.
    this.start = rac.Angle.from(start);
    // End angle of the arc. Arc will draw from `start` to this angle in
    // the `clockwise` orientaton.
    this.end = rac.Angle.from(end);
    // Orientation of the arc
    this.clockwise = clockwise;
  }

  copy() {
    return new Arc(
      this.rac,
      this.center,
      this.radius,
      this.start,
      this.end,
      this.clockwise);
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

  // Returns the segment from `center` to `startPoint()`.
  //
  // Note that the segment starts at `center`, in contrast to
  // `endSegment` which ends at `center`.
  startSegment() {
    return new Rac.Segment(this.rac, this.center, this.startPoint());
  }

  // Returns the segment from `endPoint` to `center`.
  //
  // Note that the segment ends at `center`, in contrast to
  // `startSegment` which starts at `center`.
  endSegment() {
    return new Rac.Segment(this.rac, this.endPoint(), this.center);
  }

  // Returns the segment from `startPoint()` to `endPoint()`. Note that
  // for complete-circle arcs this segment will have a length of zero.
  chordSegment() {
    return new Rac.Segment(this.rac, this.startPoint(), this.endPoint());
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
    let distance = Math.abs(this.end.turn - this.start.turn);
    return distance <= this.rac.equalityThreshold;
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
    let shiftedEndClamp = this.angleDistance().sub(endInset);

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
    let offset = angle.sub(this.start);
    let endOffset = this.end.sub(this.start);
    return offset.turn <= endOffset.turn;
  } else {
    let offset = angle.sub(this.end);
    let startOffset = this.start.sub(this.end);
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

  let distance = this.center.distanceToPoint(other.center);

  if (distance <= this.rac.equalityThreshold) {
    // Distance of zero or too close considered as same center
    return null;
  }

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

  let startAngle = this.center.angleToPoint(chord.start);
  let endAngle = this.center.angleToPoint(chord.end);

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

  let intersections = [chord.start, chord.end].filter(function(item) {
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

  // Segment too close to center, consine calculations may be incorrect
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
    return chord.end;
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
  return this.center.segmentToAngle(angle, this.radius).end;
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

  let lastRay = this.startSegment();
  let segments = [];
  for (let count = 1; count <= segmentCount; count++) {
    let currentAngle = lastRay.angle().add(partAngle);
    let currentRay = this.center.segmentToAngle(currentAngle, this.radius);
    segments.push(new Rac.Segment(this.rac, lastRay.end, currentRay.end));
    lastRay = currentRay;
  }

  return segments;
};

Arc.prototype.divideToBeziers = function(bezierCount) {
  let angleDistance = this.angleDistance();
  let partTurn = angleDistance.turn == 0
  // TODO: use turnOne? when possible to test
    ? 1 / bezierCount
    : angleDistance.turn / bezierCount;

  // length of tangent:
  // https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
  let parsPerTurn = 1 / partTurn;
  let tangent = this.radius * (4/3) * Math.tan(Math.PI/(parsPerTurn*2));

  let beziers = [];
  let segments = this.divideToSegments(bezierCount);
  segments.forEach(function(item) {
    let startRay = new Rac.Segment(this.rac, this.center, item.start);
    let endRay = new Rac.Segment(this.rac, this.center, item.end);

    let startAnchor = startRay
      .nextSegmentToAngleShift(rac.Angle.square, tangent, !this.clockwise)
      .end;
    let endAnchor = endRay
      .nextSegmentToAngleShift(rac.Angle.square, tangent, this.clockwise)
      .end;

    beziers.push(new Rac.Bezier(this.rac,
      startRay.end, startAnchor,
      endAnchor, endRay.end));
  }, this);

  return new Rac.Composite(this.rac, beziers);
};

