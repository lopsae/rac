'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Segment of a ray up to a given length.
* @alias Rac.Segment
*/
class Segment {

  constructor(rac, ray, length) {
    // TODO: || throw new Error(err.missingParameters)
    // or
    // checker(msg => { throw Rac.Exception.failedAssert(msg));
    //   .exists(rac)
    //   .isType(Rac.Ray, ray)
    //   .isNumber(length)

    utils.assertExists(rac, ray, length);
    utils.assertType(Rac.Ray, ray);
    utils.assertNumber(length);
    this.rac = rac;
    this.ray = ray;
    this.length = length;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Segment((${this.ray.start.x},${this.ray.start.y}) a:${this.ray.angle.turn} l:${this.length})`;
  }

  angle() {
    return this.ray.angle;
  }

  startPoint() {
    return this.ray.start;
  }

  endPoint() {
    return this.ray.pointAtDistance(this.length);
  }

  /**
  * Returns the [slope]{@link Rac.Ray#slope} of the segment's `ray`.
  * @returns {?number}
  */
  slope() {
    return this.ray.slope();
  }

  /**
  * Returns the [y-intercept]{@link Rac.Ray#yIntercept} of the segment's
  * `ray`.
  * @returns {?number}
  */
  yIntercept() {
    return this.ray.yIntercept();
  }

  withRay(newRay) {
    return new Segment(this.rac, newRay, this.length);
  }

  withStartPoint(newStartPoint) {
    const newRay = this.ray.withStart(newStartPoint);
    return new Segment(this.rac, newRay, this.length);
  }

  withEndPoint(newEndPoint) {
    const newRay = this.ray.rayToPoint(newEndPoint);
    const newLength = this.ray.start.distanceToPoint(newEndPoint);
    return new Segment(this.rac, newRay, newLength);
  }

  withLength(newLength) {
    return new Segment(this.rac, this.ray, newLength);
  }


  withLengthAdd(addLength) {
    return new Segment(this.rac, this.ray, this.length + addLength);
  }


  // Returns a new segment from `start` to a length determined by
  // `ratio*length`.
  withLengthRatio(ratio) {
    return new Segment(this.rac, this.ray, this.length * ratio);
  }


  withAngleAdd(someAngle) {
    const newRay = this.ray.withAngleAdd(someAngle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  withAngleShift(someAngle, clockwise = true) {
    const newRay = this.ray.withAngleShift(someAngle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  withStartExtended(length) {
    const newRay = this.ray.withStartAtDistance(-length);
    return new Segment(this.rac, newRay, this.length + length);
  }


  // Returns a new segment from `this.start`, with the same length, that is
  // perpendicular to `this` in the `clockwise` orientation.
  // TODO: needs update
  // withPerpendicularAngle(clockwise = true) {
  //   return this.withAngleShift(this.rac.Angle.square, clockwise);
  // }


  reverse() {
    const end = this.endPoint();
    const inverseRay = new Rac.Ray(this.rac, end, this.ray.angle.inverse());
    return new Segment(this.rac, inverseRay, this.length);
  }


  pointAtX(x) {
    return this.ray.pointAtX(x);
  }


  pointAtLength(length) {
    return this.start.pointToAngle(this.angle(), length);
  }


  pointAtLengthRatio(lengthRatio) {
    let newLength = this.length() * lengthRatio;
    return this.start.pointToAngle(this.angle(), newLength);
  }


  // Returns the intersecting point of `this` and the ray `other`. Both are
  // considered lines without endpoints. Returns null if the lines are
  // parallel.
  pointAtIntersectionWithRay(other) {
    return this.ray.pointAtIntersection(other);
  }


  // TODO: implement moveStartPoint, which retains the position of endPoint


  translateToCoordinates(x, y) {
    const newStart = new Rac.Point(this.rac, x, y);
    return this.withStartPoint(newStart);
  }


  translateToAngle(someAngle, distance) {
    const angle = this.rac.Angle.from(someAngle);
    const newStart = this.ray.start.pointToAngle(angle, distance);
    return this.withStartPoint(newStart);
  }


  translateToLength(distance) {
    const newStart = this.ray.pointAtDistance(distance);
    return this.withStartPoint(newStart);
  }

  translatePerpendicular(distance, clockwise = true) {
    let perpendicular = this.ray.angle.perpendicular(clockwise);
    const newStart = this.ray.start.pointToAngle(perpendicular, distance);
    return this.withStartPoint(newStart);
  }


  // Returns a new segment from `end` with the given `length` with the same
  // angle as `this`.
  // TODO: needs update
  // nextSegmentWithLength(length) {
  //   return this.end.segmentToAngle(this.angle(), length);
  // }

  // Returns a new segment from `end` to the given `nextEnd`.
  nextSegmentToPoint(nextEnd) {
    const newStart = this.endPoint();
    return newStart.segmentToPoint(nextEnd, this.ray.angle);
  }

  // Returns a new segment from `end` to the given `someAngle` and `distance`.
  // TODO: needs update
  // nextSegmentToAngle(someAngle, distance) {
  //   return this.end.segmentToAngle(someAngle, distance);
  // }

  // Returns a new segment from `endPoint()`, with an angle shifted from
  // `angle().inverse()` in the `clockwise` orientation.
  //
  // This means that with an angle shift of `0` the next segment will have
  // the inverse angle of `this`, as the angle shift increases the next
  // segment separates from `this`.
  nextSegmentToAngleShift(someAngle, clockwise = true, length = null) {
    const newLength = length === null ? this.length : length;
    const angle = this.rac.Angle.from(someAngle);
    const newRay = this.ray
      .withStartAtDistance(this.length)
      .inverse()
      .withAngleShift(angle, clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  // Returns a new segment from `this.end`, with the same length, that is
  // perpendicular to `angle().inverse()` in the `clockwise` orientation.
  nextSegmentPerpendicular(clockwise = true, length = null) {
    const newLength = length === null ? this.length : length;
    const newRay = this.ray
      .withStartAtDistance(this.length)
      .perpendicular(!clockwise);
    return new Segment(this.rac, newRay, newLength);
  }

  // Returns `value` clamped to the given insets from zero and the length
  // of the segment.
  // TODO: invalid range could return a value centered in the insets! more visually congruent
  // If the `start/endInset` values result in a contradictory range, the
  // returned value will comply with `startInset`.
  clampToLengthInsets(value, startInset = 0, endInset = 0) {
    let clamped = value;
    clamped = Math.min(clamped, this.length - endInset);
    // Comply at least with startInset
    clamped = Math.max(clamped, startInset);
    return clamped;
  }

  pointAtBisector() {
    return this.ray.pointAtDistance(this.length/2);
  }

  projectedPoint(point) {
    return this.ray.projectedPoint(point);
  }

  // Returns the length from `startPoint()` to the projection of `point` in
  // the segment.
  // The length is positive if the projected point is in the direction
  // of the segment ray, and negative if it is behind.
  lengthToProjectedPoint(point) {
    return this.ray.distanceToProjectedPoint(point);
  }

  // Returns `true` if the given point is located clockwise of the segment,
  // or `false` if located counter-clockwise.
  // TODO: needs update
  // pointOrientation(point) {
  //   let angle = this.start.angleToPoint(point);
  //   let angleDistance = angle.subtract(this.angle());
  //   // [0 to 0.5) is considered clockwise
  //   // [0.5, 1) is considered counter-clockwise
  //   return angleDistance.turn < 0.5;
  // }


  // Returns a new segment from `start` to `pointAtBisector`.
  segmentToBisector() {
    return new Segment(this.rac, this.ray, this.length/2);
  }


  // Returns a segment from `this.start` to the intersection between `this`
  // and `other`.
  segmentToIntersectionWithRay(ray) {
    let intersection = this.pointAtIntersectionWithRay(ray);
    if (intersection === null) {
      return null;
    }
    return this.ray.segmentToPoint(intersection);
  }


  // Returns an complete circle Arc using this segment `start` as center,
  // `length()` as radiusm, and `angle()` as start and end angles.
  // Returns an Arc using this segment `start` as center, `length()` as
  // radius, starting from the `angle()` to the given angle and orientation.
  arc(someAngleEnd = null, clockwise = true) {
    let angleEnd = someAngleEnd === null
      ? this.ray.angle
      :this.rac.Angle.from(someAngleEnd);
    return new Rac.Arc(this.rac,
      this.ray.start, this.length,
      this.ray.angle, angleEnd,
      clockwise);
  }

} // Segment


module.exports = Segment;


// Returns an Arc using this segment `start` as center, `length()` as
// radius, starting from the `angle()` to the arc distance of the given
// angle and orientation.
Segment.prototype.arcWithAngleDistance = function(someAngleDistance, clockwise = true) {
  let angleDistance = this.rac.Angle.from(someAngleDistance);
  let arcStart = this.angle();
  let arcEnd = arcStart.shift(angleDistance, clockwise);

  return new Rac.Arc(this.rac,
    this.start, this.length(),
    arcStart, arcEnd,
    clockwise);
};


Segment.prototype.oppositeWithHyp = function(hypotenuse, clockwise = true) {
  // cos = ady / hyp
  // acos can error if hypotenuse is smaller that length
  let radians = Math.acos(this.length() / hypotenuse);
  let angle = this.rac.Angle.fromRadians(radians);

  let hypSegment = this.reverse()
    .nextSegmentToAngleShift(angle, !clockwise, hypotenuse);
  return this.end.segmentToPoint(hypSegment.end);
};

// Returns a new segment that starts from `pointAtBisector` in the given
// `clockwise` orientation.
Segment.prototype.segmentFromBisector = function(length, clockwise = true) {
  let angle = clockwise
    ? this.angle().add(this.rac.Angle.square)
    : this.angle().add(this.rac.Angle.square.negative());
  return this.pointAtBisector().segmentToAngle(angle, length);
};

Segment.prototype.bezierCentralAnchor = function(distance, clockwise = true) {
  let bisector = this.segmentFromBisector(distance, clockwise);
  return new Rac.Bezier(this.rac,
    this.start, bisector.end,
    bisector.end, this.end);
};

