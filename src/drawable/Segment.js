'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Segment of a `[Ray]{@link Rac.Ray}` up to a given length.
* @alias Rac.Segment
*/
class Segment {

  /**
  * Creates a new `Segment` instance.
  * @param {Rac} rac Instance to use for drawing and creating other objects
  * @param {Rac.Ray} ray - A `Ray` the segment will be based of
  * @param {number} length - The length of the segment
  */
  constructor(rac, ray, length) {
    // TODO: different approach to error throwing?
    // assert || throw new Error(err.missingParameters)
    // or
    // checker(msg => { throw Rac.Exception.failedAssert(msg));
    //   .exists(rac)
    //   .isType(Rac.Ray, ray)
    //   .isNumber(length)

    utils.assertExists(rac, ray, length);
    utils.assertType(Rac.Ray, ray);
    utils.assertNumber(length);

    /**
    * Intance of `Rac` used for drawing and passed along to any created
    * object.
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The `Ray` of which `this` is a segment of.
    * @type {Rac.Ray}
    */
    this.ray = ray;

    /**
    * The length of the segment.
    * @type {number}
    */
    this.length = length;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.ray.start.x, digits);
    const yStr = utils.cutDigits(this.ray.start.y, digits);
    const turnStr = utils.cutDigits(this.ray.angle.turn, digits);
    const lengthStr = utils.cutDigits(this.length, digits);
    return `Segment((${xStr},${yStr}) a:${turnStr} l:${lengthStr})`;
  }


  /**
  * Returns the `[angle]{@link Rac.Ray#angle}` of the segment's `ray`.
  * @returns {Rac.Angle}
  */
  angle() {
    return this.ray.angle;
  }


  /**
  * Returns the `[start]{@link Rac.Ray#start}` of the segment's `ray`.
  * @returns {Rac.Point}
  */
  startPoint() {
    return this.ray.start;
  }


  /**
  * Returns a new `Point` where the segment ends.
  * @returns {Rac.Point}
  */
  endPoint() {
    return this.ray.pointAtDistance(this.length);
  }


  /**
  * Returns a new `Segment` with `ray` set to `newRay`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Ray} newRay - The ray for the new `Segment`
  * @returns {Rac.Segment}
  */
  withRay(newRay) {
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `ray.start` set to `newStart`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Point} newStartPoint - The start point for the new
  * `Segment`
  * @returns {Rac.Segment}
  */
  withStartPoint(newStartPoint) {
    const newRay = this.ray.withStart(newStartPoint);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `length` set to `newLength`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} newLength - The length for the new `Segment`
  * @returns {Rac.Segment}
  */
  withLength(newLength) {
    return new Segment(this.rac, this.ray, newLength);
  }


  /**
  * Returns a new `Segment` with `length` added to `this.length`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} length - The length to add
  * @returns {Rac.Segment}
  */
  withLengthAdd(length) {
    return new Segment(this.rac, this.ray, this.length + addLength);
  }


  /**
  * Returns a new `Segment` with `length` set to `this.length * ratio`.
  *
  * All other properties are copied from `this`.
  *
  * @param {number} ratio - The factor to multiply `length` by
  * @returns {Rac.Segment}
  */
  withLengthRatio(ratio) {
    return new Segment(this.rac, this.ray, this.length * ratio);
  }


  /**
  * Returns a new `Segment` with `angle` added to `this.ray.angle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - The angle to add
  * @returns {Rac.Segment}
  */
  withAngleAdd(angle) {
    const newRay = this.ray.withAngleAdd(angle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `angle` set to
  * `this.ray.{@link Rac.Angle#shift angle.shift}(angle, clockwise)`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - The angle to be shifted by
  * @param {boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Segment}
  */
  withAngleShift(angle, clockwise = true) {
    const newRay = this.ray.withAngleShift(angle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved in the inverse
  * direction of the segment's ray by the given `distance`. The resulting
  * `Segment` will have the same `endPoint()` and `angle()` as `this`.
  *
  * @param {number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  withStartExtended(distance) {
    const newRay = this.ray.withStartAtDistance(-distance);
    return new Segment(this.rac, newRay, this.length + distance);
  }


  /**
  * Returns a new `Segment` pointing towards the
  * [perpendicular angle]{@link Rac.Angle#perpendicular} of
  * `this.ray.angle` in the `clockwise` orientation.
  *
  * The resulting `Segment` will have the same `startPoint()` and `length`
  * as `this`.
  *
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  * @see Rac.Angle#perpendicular
  */
  perpendicular(clockwise = true) {
    const newRay = this.ray.perpendicular(clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with its start point set at
  * `[this.endPoint()]{@link Rac.Segment#endPoint}`,
  * angle set to `this.angle().[inverse()]{@link Rac.Angle#inverse}`, and
  * same length as `this`.
  *
  * @returns {Rac.Segment}
  * @see Rac.Angle#inverse
  */
  reverse() {
    const end = this.endPoint();
    const inverseRay = new Rac.Ray(this.rac, end, this.ray.angle.inverse());
    return new Segment(this.rac, inverseRay, this.length);
  }


  /**
  * Returns a new `Point` in the segment's ray at the given `length` from
  * `ray.start`. When `length` is negative, the new `Point` is calculated
  * in the inverse direction of `ray.angle`.
  *
  * @param {number} length - The distance from `ray.start`
  * @returns {Rac.Point}
  * @see Rac.Ray#pointAtDistance
  */
  pointAtLength(length) {
    return this.ray.pointAtDistance(length);
  }


  /**
  * Returns a new `Point` in the segment's ray at a distance of
  * `this.length * ratio` from `ray.start`. When `ratio` is negative, the
  * new `Point` is calculated in the inverse direction of `ray.angle`.
  *
  * @param {number} ratio - The factor to multiply `length` by
  * @returns {Rac.Point}
  * @see Rac.Ray#pointAtDistance
  */
  pointAtLengthRatio(ratio) {
    return this.ray.pointAtDistance(this.length * ratio);
  }


  /**
  * Returns a new `Segment` starting at `newStartPoint` and ending at
  * `this.endPoint()`.
  *
  * When `newStartPoint` and `this.endPoint()` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.ray.angle`.
  *
  * @param {Rac.Point} newStartPoint - The start point of the new `Segment`
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
  */
  moveStartPoint(newStartPoint) {
    const endPoint = this.endPoint();
    return newStartPoint.segmentToPoint(endPoint, this.ray.angle);
  }


  /**
  * Returns a new `Segment` starting at `this.ray.start` and ending at
  * `newEndPoint`.
  *
  * When `this.ray.start` and `newEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.ray.angle`.
  *
  * @param {Rac.Point} newEndPoint - The end point of the new `Segment`
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
  */
  moveEndPoint(newEndPoint) {
    return this.ray.segmentToPoint(newEndPoint);
  }


  /**
  * Returns a new `Segment` with the start point moved towards `angle` by
  * the given `distance`. All other properties are copied from `this`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to move the start point
    towards
  * @param {number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  translateToAngle(someAngle, distance) {
    const angle = this.rac.Angle.from(someAngle);
    const newStart = this.ray.start.pointToAngle(angle, distance);
    return this.withStartPoint(newStart);
  }


  /**
  * Returns a new `Segment` with the start point moved along the segment's
  * ray by the given `length`. All other properties are copied from `this`.
  *
  * When `length` is negative, `start` is moved in the inverse direction of
  * `angle`.
  *
  * @param {number} length - The length to move the start point by
  * @returns {Rac.Segment}
  */
  translateToLength(length) {
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

