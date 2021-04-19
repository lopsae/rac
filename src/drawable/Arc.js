'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');



/**
* Arc of a circle from a start angle to an end angle.
*
* Arcs that have the same `start` and `end` angles are considered a
* complete circle.
*
* @alias Rac.Arc
*/
class Arc{

  /**
  * Creates a new `Arc` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Rac.Point} center - The center of the arc
  * @param {number} radius - The radius of the arc
  * @param {Rac.Angle} start - An `Angle` where the arc starts
  * @param {Rac.Angle} end - Ang `Angle` where the arc ends
  * @param {boolean} clockwise - The orientation of the arc
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

    /**
    * Intance of `Rac` used for drawing and passed along to any created
    * object.
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The center `Point` of the arc.
    * @type {Rac.Point}
    */
    this.center = center;

    /**
    * The radius of the arc.
    * @type {number}
    */
    this.radius = radius;

    /**
    * The start `Angle` of the arc. The arc is draw from this angle towards
    * `end` in the `clockwise` orientation.
    *
    * When `start` and `end` are [equal angles]{@link Rac.Angle#equals}
    * the arc is considered a complete circle.
    *
    * @type {Rac.Angle}
    * @see Rac.Angle#equals
    */
    this.start = start

    /**
    * The end `Angle` of the arc. The arc is draw from `start` to this
    * angle in the `clockwise` orientation.
    *
    * When `start` and `end` are [equal angles]{@link Rac.Angle#equals}
    * the arc is considered a complete circle.
    *
    * @type {Rac.Angle}
    * @see Rac.Angle#equals
    */
    this.end = end;

    /**
    * The orientiation of the arc.
    * @type {boolean}
    */
    this.clockwise = clockwise;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const xStr      = utils.cutDigits(this.center.x,   digits);
    const yStr      = utils.cutDigits(this.center.y,   digits);
    const radiusStr = utils.cutDigits(this.radius,     digits);
    const startStr  = utils.cutDigits(this.start.turn, digits);
    const endStr    = utils.cutDigits(this.end.turn,   digits);
    return `Arc((${xStr},${yStr}) r:${radiusStr} s:${startStr} e:${endStr} c:${this.clockwise}})`;
  }


  /**
  * Returns `true` when all members of both arcs are equal.
  *
  * When `otherArc` is any class other that `Rac.Arc`, returns `false`.
  *
  * Arcs' `radius` are compared using `{@link Rac#equals}`.
  *
  * @param {Rac.Segment} otherSegment - A `Segment` to compare
  * @returns {boolean}
  * @see Rac.Point#equals
  * @see Rac.Angle#equals
  * @see Rac#equals
  */
  equals(otherArc) {
    return otherArc instanceof Arc
      && this.rac.equals(this.radius, otherArc.radius)
      && this.clockwise === otherArc.clockwise
      && this.center.equals(otherArc.center)
      && this.start.equals(otherArc.start)
      && this.end.equals(otherArc.end);
  }


  /**
  * Returns the length of the arc: the part of the circumference the arc
  * represents.
  * @returns {number}
  */
  length() {
    return this.angleDistance().turnOne() * this.radius * Rac.TAU;
  }


  /**
  * Returns a new `Angle` that represents the distance between `start` and
  * `end`, in the orientation of the arc.
  * @returns {Rac.Angle}
  */
  angleDistance() {
    return this.start.distance(this.end, this.clockwise);
  }


  /**
  * Returns a new `Point` located where the arc starts.
  * @returns {Rac.Point}
  */
  startPoint() {
    return this.pointAtAngle(this.start);
  }


  /**
  * Returns a new `Point` located where the arc ends.
  * @returns {Rac.Point}
  */
  endPoint() {
    return this.pointAtAngle(this.end);
  }


  /**
  * Returns a new `Ray` from `center` towars `start`.
  * @returns {Rac.Ray}
  */
  startRay() {
    return new Rac.Ray(this.rac, this.center, this.start);
  }


  /**
  * Returns a new `Ray` from `center` towars `end`.
  * @returns {Rac.Ray}
  */
  endRay() {
    return new Rac.Ray(this.rac, this.center, this.end);
  }


  /**
  * Returns a new `Segment` from `center` to `startPoint()`.
  * @returns {Rac.Segment}
  */
  startSegment() {
    return new Rac.Segment(this.rac, this.startRay(), this.radius);
  }


  /**
  * Returns a new `Segment` from `center` to `endPoint()`.
  * @returns {Rac.Segment}
  */
  endSegment() {
    return new Rac.Segment(this.rac, this.endRay(), this.radius);
  }


  /**
  * Returns a new `Segment` from `startPoint()` to `startPoint()`.
  *
  * Note that for complete circle arcs this segment will have a length of
  * zero.
  *
  * @returns {Rac.Segment}
  */
  chordSegment() {
    let perpendicular = this.start.perpendicular(this.clockwise);
    return this.startPoint().segmentToPoint(this.endPoint(), perpendicular);
  }


  /**
  * Returns `true` if the arc is a complete circle, which is when `start`
  * and `end` are [equal angles]{@link Rac.Angle#equals}.
  *
  * @returns {boolean}
  * @see Rac.Angle#equals
  */
  isCircle() {
    return this.start.equals(this.end);
  }


  /**
  * Returns a new `Arc` with center set to `newCenter`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Point} newCenter - The center for the new `Arc`
  * @returns {Rac.Arc}
  */
  withCenter(newCenter) {
    return new Arc(this.rac,
      newCenter, this.radius,
      this.start, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with start set to `newStart`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} newStart - The start for the new `Arc`
  * @returns {Rac.Arc}
  */
  withStart(newStart) {
    let newStartAngle = Rac.Angle.from(this.rac, newStart);
    return new Arc(this.rac,
      this.center, this.radius,
      newStartAngle, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with end set to `newEnd`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} newEnd - The end for the new `Arc`
  * @returns {Rac.Arc}
  */
  withEnd(newEnd) {
    let newEndAngle = Rac.Angle.from(this.rac, newEnd);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEndAngle,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with radius set to `newRadius`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} newRadius - The radius for the new `Arc`
  * @returns {Rac.Arc}
  */
  withRadius(newRadius) {
    return new Arc(this.rac,
      this.center, newRadius,
      this.start, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with its orientation set to `newClockwise`.
  *
  * All other properties are copied from `this`.
  *
  * @param {boolean} newClockwise - The orientation for the new `Arc`
  * @returns {Rac.Arc}
  */
  withClockwise(newClockwise) {
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, this.end,
      newClockwise);
  }


  /**
  * Returns a new `Arc` with the given `angleDistance` as the distance
  * between `start` and `end` in the arc's orientation.
  *
  * All properties except `end` are copied from `this`.
  *
  * @param {Rac.Angle|number} angleDistance - The angle distance of the
  * new `Arc`
  * @returns {Rac.Arc}
  * @see Rac.Arc#angleDistance
  */
  withAngleDistance(angleDistance) {
    let newEnd = this.angleAtAngleDistance(angleDistance);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with the given `length` as the length of the
  * part of the circumference it represents.
  *
  * All properties except `end` are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range `[0,radius*TAU)`. When the given `length` is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {number} length - The length of the new `Arc`
  * @returns {Rac.Arc}
  * @see Rac.Arc#length
  */
  withLength(length) {
    let circumference = this.radius * Rac.TAU;
    let newAngleDistance = newLength / circumference;
    return this.withAngleDistance(newAngleDistance);
  }


  /**
  * Returns a new `Arc` with a `length()` of `this.length() * ratio`.
  *
  * All properties except `end` are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range `[0,radius*TAU)`. When the calculated length is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {number} ratio - The factor to multiply `length()` by
  * @returns {Rac.Arc}
  * @see Rac.Arc#length
  */
  withLengthRatio(ratio) {
    let newLength = this.length() * ratio;
    return this.withLength(newLength);
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


  /**
  * Returns a new `Arc` with its `start` and `end` exchanged, and the
  * opposite clockwise orientation. The center and radius remain be the
  * same as `this`.
  *
  * @returns {Rac.Arc}
  */
  reverse() {
    return new Arc(this.rac,
      this.center, this.radius,
      this.end, this.start,
      !this.clockwise);
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
// `otherArc`; or return `null` if there is no intersection.
// Both arcs are considered complete circles for the calculation of the
// chord, thus the endpoints of the returned segment may not lay inside the
// actual arcs.
Arc.prototype.intersectionChord = function(otherArc) {
  // https://mathworld.wolfram.com/Circle-CircleIntersection.html
  // R=this, r=otherArc

  if (this.center.equals(otherArc.center)) {
    return null;
  }

  let distance = this.center.distanceToPoint(otherArc.center);

  // distanceToChord = (d^2 - r^2 + R^2) / (d*2)
  let distanceToChord = (
      Math.pow(distance, 2)
    - Math.pow(otherArc.radius, 2)
    + Math.pow(this.radius, 2)
    ) / (distance * 2);

  // a = 1/d sqrt|(-d+r-R)(-d-r+R)(-d+r+R)(d+r+R)
  let chordLength = (1 / distance) * Math.sqrt(
      (-distance + otherArc.radius - this.radius)
    * (-distance - otherArc.radius + this.radius)
    * (-distance + otherArc.radius + this.radius)
    * (distance + otherArc.radius + this.radius));

  let rayToChord = this.center.segmentToPoint(otherArc.center)
    .withLength(distanceToChord);
  return rayToChord.nextSegmentPerpendicular(this.clockwise)
    .withLength(chordLength/2)
    .reverse()
    .segmentWithRatioOfLength(2);
};

// Returns the section of `this` that is inside `otherArc`.
// `otherArc` is aways considered as a complete circle.
Arc.prototype.intersectionArc = function(otherArc) {
  let chord = this.intersectionChord(otherArc);
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
Arc.prototype.intersectingPointsWithArc = function(otherArc) {
  let chord = this.intersectionChord(otherArc);
  if (chord === null) { return []; }

  let intersections = [chord.startPoint(), chord.endPoint()].filter(function(item) {
    return this.containsAngle(this.center.segmentToPoint(item))
      && otherArc.containsAngle(otherArc.center.segmentToPoint(item));
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
      .nextSegmentToAngleDistance(this.rac.Angle.square, !this.clockwise, tangent)
      .endPoint();
    let endAnchor = endArcRay
      .nextSegmentToAngleDistance(this.rac.Angle.square, this.clockwise, tangent)
      .endPoint();

    beziers.push(new Rac.Bezier(this.rac,
      startArcRay.endPoint(), startAnchor,
      endAnchor, endArcRay.endPoint()));
  }, this);

  return new Rac.Composite(this.rac, beziers);
};


// TODO: fix uses of someAngle

