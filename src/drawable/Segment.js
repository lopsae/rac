'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Segment of a `[Ray]{@link Rac.Ray}` with a given length.
*
* ### `instance.Segment`
*
* Instances of `Rac` contain a convenience
* [`rac.Segment` function]{@link Rac#Segment} to create `Segment` objects
* from primitive values. This function also contains ready-made convenience
* objects, like [`rac.Segment.zero`]{@link instance.Segment#zero}, listed
* under [`instance.Segment`]{@link instance.Segment}.
*
* @example
* let rac = new Rac()
* let ray = rac.Ray(55, 77, 1/4)
* // new instance with constructor
* let segment = new Rac.Segment(rac, ray, 100)
* // or convenience function
* let otherSegment = rac.Segment(55, 77, 1/4, 100)
*
* @see [`rac.Segment`]{@link Rac#Segment}
* @see [`instance.Segment`]{@link instance.Segment}
*
* @alias Rac.Segment
*/
class Segment {

  /**
  * Creates a new `Segment` instance.
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Rac.Ray} ray - A `Ray` the segment is based of
  * @param {Number} length - The length of the segment
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
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The `Ray` the segment is based of.
    * @type {Rac.Ray}
    */
    this.ray = ray;

    /**
    * The length of the segment.
    * @type {Number}
    */
    this.length = length;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * rac.Segment(55, 77, 0.2, 100).toString()
  * // returns: 'Segment((55,77) a:0.2 l:100)'
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.ray.start.x, digits);
    const yStr = utils.cutDigits(this.ray.start.y, digits);
    const turnStr = utils.cutDigits(this.ray.angle.turn, digits);
    const lengthStr = utils.cutDigits(this.length, digits);
    return `Segment((${xStr},${yStr}) a:${turnStr} l:${lengthStr})`;
  }


  /**
  * Returns `true` when `ray` and `length` in both segments are equal;
  * otherwise returns `false`.
  *
  * When `otherSegment` is any class other that `Rac.Segment`, returns `false`.
  *
  * Segments' `length` are compared using `{@link Rac#equals}`.
  *
  * @param {Rac.Segment} otherSegment - A `Segment` to compare
  * @returns {Boolean}
  *
  * @see [`ray.equals`]{@link Rac.Ray#equals}
  * @see [`rac.equals`]{@link Rac#equals}
  */
  equals(otherSegment) {
    return otherSegment instanceof Segment
      && this.ray.equals(otherSegment.ray)
      && this.rac.equals(this.length, otherSegment.length);
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
  * Returns a new `Segment` with angle set to `newAngle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} newAngle - The angle for the new `Segment`
  * @returns {Rac.Segment}
  */
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    const newRay = new Rac.Ray(this.rac, this.ray.start, newAngle);
    return new Segment(this.rac, newRay, this.length);
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
  * Returns a new `Segment` with start point set to `newStart`.
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
  * @param {Number} newLength - The length for the new `Segment`
  * @returns {Rac.Segment}
  */
  withLength(newLength) {
    return new Segment(this.rac, this.ray, newLength);
  }


  /**
  * Returns a new `Segment` with `increment` added to `length`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} increment - The length to add
  * @returns {Rac.Segment}
  */
  withLengthAdd(increment) {
    return new Segment(this.rac, this.ray, this.length + increment);
  }


  /**
  * Returns a new `Segment` with a length of `length * ratio`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} ratio - The factor to multiply `length` by
  * @returns {Rac.Segment}
  */
  withLengthRatio(ratio) {
    return new Segment(this.rac, this.ray, this.length * ratio);
  }


  /**
  * Returns a new `Segment` with `increment` added to `ray.angle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} increment - The angle to add
  * @returns {Rac.Segment}
  */
  withAngleAdd(increment) {
    const newRay = this.ray.withAngleAdd(increment);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `angle` set to
  * `ray.[angle.shift]{@link Rac.Angle#shift}(angle, clockwise)`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} angle - The angle to be shifted by
  * @param {Boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Segment}
  */
  withAngleShift(angle, clockwise = true) {
    const newRay = this.ray.withAngleShift(angle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }



  /**
  * Returns a new `Segment` with the start point translated against the
  * segment's ray by the given `distance`, while keeping the same
  * `endPoint()`. The resulting segment keeps the same angle as `this`.
  *
  * Using a positive `distance` results in a longer segment, using a
  * negative `distance` results in a shorter one.
  *
  * @param {Number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  withStartExtension(distance) {
    const newRay = this.ray.translateToDistance(-distance);
    return new Segment(this.rac, newRay, this.length + distance);
  }


  /**
  * Returns a new `Segment` with `distance` added to `length`, which
  * results in `endPoint()` for the resulting `Segment` moving in the
  * direction of the segment's ray by the given `distance`.
  *
  * All other properties are copied from `this`.
  *
  * Using a positive `distance` results in a longer segment, using a
  * negative `distance` results in a shorter one.
  *
  * This method performs the same operation as
  * `[withLengthAdd]{@link Rac.Segment#withLengthAdd}`.
  *
  * @param {Number} distance - The distance to add to `length`
  * @returns {Rac.Segment}
  */
  withEndExtension(distance) {
    return this.withLengthAdd(distance);
  }


  /**
  * Returns a new `Segment` pointing towards
  * `ray.angle.[inverse()]{@link Rac.Angle#inverse}`.
  *
  * The resulting `Segment` keeps the same start and length as `this`.
  *
  * @returns {Rac.Segment}
  */
  inverse() {
    const newRay = this.ray.inverse();
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` pointing towards the
  * [perpendicular angle]{@link Rac.Angle#perpendicular} of
  * `ray.angle` in the `clockwise` orientation.
  *
  * The resulting `Segment` keeps the same start and length as `this`.
  *
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  *
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  */
  perpendicular(clockwise = true) {
    const newRay = this.ray.perpendicular(clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` starting at `endPoint()` and ending at
  * `startPoint()`.
  *
  * The resulting `Segment` uses the [inverse]{@link Rac.Angle#inverse}
  * angle to `ray.angle` and keeps the same length as `this`.
  *
  * @returns {Rac.Segment}
  */
  reverse() {
    const end = this.endPoint();
    const inverseRay = new Rac.Ray(this.rac, end, this.ray.angle.inverse());
    return new Segment(this.rac, inverseRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point translated by `distance`
  * towards the given `angle`, and keeping the same angle and length as
  * `this`.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to move the start point
    towards
  * @param {Number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  translateToAngle(angle, distance) {
    const newRay = this.ray.translateToAngle(angle, distance);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point translated by `distance`
  * along the segment's ray, and keeping the same angle and length as
  * `this`.
  *
  * When `distance` is negative, the resulting `Segment` is translated in
  * the opposite direction of the segment's ray.
  *
  * @see [`ray.translateToDistance`]{@link Rac.Ray#translateToDistance}
  *
  * @param {Number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  translateToLength(distance) {
    const newRay = this.ray.translateToDistance(distance);
    return new Segment(this.rac, newRay, this.length);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Segment` with the start point translated along the
  * segment's ray by a distance of `length * ratio`. The resulting segment
  * keeps the same angle and length as `this`.
  *
  * When `ratio` is negative, the resulting `Segment` is translated in the
  * opposite direction of the segment's ray.
  *
  * @see [`ray.translateToDistance`]{@link Rac.Ray#translateToDistance}
  *
  * @param {Number} ratio - The factor to multiply `length` by
  * @returns {Rac.Segment}
  */
  translateToLengthRatio(ratio) {
    const newRay = this.ray.translateToDistance(this.length * ratio);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point translated by `distance`
  * towards the perpendicular of `ray.angle` in the `clockwise` orientaton.
  * The resulting segment keeps the same angle and length as `this`.
  *
  * @param {Number} distance - The distance to move the start point by
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  */
  translatePerpendicular(distance, clockwise = true) {
    const newRay = this.ray.translatePerpendicular(distance, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns the given `value` clamped to `[startInset, length-endInset]`.
  *
  * When `startInset` is greater that `length-endInset` the range for the
  * clamp becomes imposible to fulfill. In this case the returned value
  * is centered between the range limits and still clampled to `[0, length]`.
  *
  * @param {Number} value - A value to clamp
  * @param {Number} [startInset=0] - The inset for the lower limit of the
  * clamping range
  * @param {endInset} [endInset=0] - The inset for the higher limit of the
  * clamping range
  * @returns {Number}
  */
  clampToLength(value, startInset = 0, endInset = 0) {
    const endLimit = this.length - endInset;
    if (startInset >= endLimit) {
      // imposible range, return middle point
      const rangeMiddle = (startInset - endLimit) / 2;
      const middle = startInset - rangeMiddle;
      // Still clamp to the segment itself
      let clamped = middle;
      clamped = Math.min(clamped, this.length);
      clamped = Math.max(clamped, 0);
      return clamped;
    }
    let clamped = value;
    clamped = Math.min(clamped, this.length - endInset);
    clamped = Math.max(clamped, startInset);
    return clamped;
  }


  /**
  * Returns a new `Point` along the segment's ray at the given `distance`
  * from `ray.start`.
  *
  * When `distance` is negative, the resulting `Point` is located in the
  * opposite direction of the segment's ray.
  *
  * @see [`ray.pointAtDistance`]{@link Rac.Ray#pointAtDistance}
  *
  * @param {Number} distance - The distance from `startPoint()`
  * @returns {Rac.Point}
  */
  pointAtLength(distance) {
    return this.ray.pointAtDistance(distance);
  }


  /**
  * Returns a new `Point` along the segment's ray at a distance of
  * `length * ratio` from `ray.start`.
  *
  * When `ratio` is negative, the resulting `Point` is located in the
  * opposite direction of the segment's ray.
  *
  * @see [`ray.pointAtDistance`]{@link Rac.Ray#pointAtDistance}
  *
  * @param {Number} ratio - The factor to multiply `length` by
  * @returns {Rac.Point}
  */
  pointAtLengthRatio(ratio) {
    return this.ray.pointAtDistance(this.length * ratio);
  }


  /**
  * Returns a new `Point` at the middle point the segment.
  * @returns {Rac.Point}
  */
  pointAtBisector() {
    return this.ray.pointAtDistance(this.length/2);
  }


  /**
  * Returns a new `Segment` starting at `newStartPoint` and ending at
  * `endPoint()`.
  *
  * When `newStartPoint` and `endPoint()` are considered
  * [equal]{@link Rac.Point#equals}, the resulting `Segment` defaults
  * to `ray.angle`.
  *
  * @param {Rac.Point} newStartPoint - The start point of the new `Segment`
  * @returns {Rac.Segment}
  */
  moveStartPoint(newStartPoint) {
    const endPoint = this.endPoint();
    return newStartPoint.segmentToPoint(endPoint, this.ray.angle);
  }


  /**
  * Returns a new `Segment` starting at `startPoint()` and ending at
  * `newEndPoint`.
  *
  * When `startPoint()` and `newEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the resulting `Segment` defaults to
  * `ray.angle`.
  *
  * @param {Rac.Point} newEndPoint - The end point of the new `Segment`
  * @returns {Rac.Segment}
  */
  moveEndPoint(newEndPoint) {
    return this.ray.segmentToPoint(newEndPoint);
  }


  /**
  * Returns a new `Segment` from the starting point to the segment's middle
  * point.
  *
  * @returns {Rac.Segment}
  * @see [`pointAtBisector`]{@link Rac.Segment#pointAtBisector}
  */
  segmentToBisector() {
    return new Segment(this.rac, this.ray, this.length/2);
  }


  /**
  * Returns a new `Segment` from the segment's middle point towards the
  * perpendicular angle in the `clockwise` orientation.
  *
  * The resulting `Segment` uses `newLength`, or when ommited or `null`
  * defaults to `length` instead.
  *
  * @see [`pointAtBisector`]{@link Rac.Segment#pointAtBisector}
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  *
  * @param {?Number} [newLength=null] - The length of the new `Segment`, or
  * `null` to use `length`
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  */
  segmentBisector(newLength = null, clockwise = true) {
    const newStart = this.pointAtBisector();
    const newAngle = this.ray.angle.perpendicular(clockwise);
    const newRay = new Rac.Ray(this.rac, newStart, newAngle);
    newLength = newLength === null
      ? this.length
      : newLength;
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()`, with the given
  * `newLength`, and keeping the same angle as `this`.
  *
  * @param {Number} newLength - The length of the next `Segment`
  * @returns {Rac.Segment}
  */
  nextSegmentWithLength(newLength) {
    const newStart = this.endPoint();
    const newRay = this.ray.withStart(newStart);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` and ending at
  * `nextEndPoint`.
  *
  * When `endPoint()` and `nextEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the resulting `Segment` defaults
  * to `ray.angle`.
  *
  * @param {Rac.Point} nextEndPoint - The end point of the next `Segment`
  * @returns {Rac.Segment}
  * @see [`rac.equals`]{@link Rac.Point#equals}
  */
  nextSegmentToPoint(nextEndPoint) {
    const newStart = this.endPoint();
    return newStart.segmentToPoint(nextEndPoint, this.ray.angle);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` and towards `angle`.
  *
  * The resulting `Segment` uses `newLength`, or when ommited or `null`
  * defaults to `length` instead.
  *
  * @param {Rac.Angle|Number} angle - The angle of the new `Segment`
  * @param {?Number} [newLength=null] - The length of the new `Segment`, or
  * `null` to use `length`
  * @returns {Rac.Segment}
  */
  nextSegmentToAngle(angle, newLength = null) {
    angle = Rac.Angle.from(this.rac, angle);
    newLength = newLength === null
      ? this.length
      : newLength;
    const newStart = this.endPoint();
    const newRay = new Rac.Ray(this.rac, newStart, angle);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` and pointing towards
  * `ray.angle.[inverse()]{@link Rac.Angle#inverse}` shifted by
  * `angleDistance` in the `clockwise` orientation.
  *
  * The resulting `Segment` uses `newLength`, when ommited or
  * `null` defaults to `length` instead.
  *
  * Notice that the `angleDistance` is applied to the
  * [inverse]{@link Rac.Angle#inverse} of the segment's angle. E.g. with
  * an `angleDistance` of `0` the resulting `Segment` is directly over and
  * pointing in the inverse angle of `this`. As the `angleDistance`
  * increases the two segments separate with the pivot at `endPoint()`.
  *
  * @param {Rac.Angle|Number} angleDistance - An angle distance to apply to
  * the segment's angle inverse
  * @param {Boolean} [clockwise=true] - The orientation of the angle shift
  * from `endPoint()`
  * @param {?Number} [newLength=null] - The length of the new `Segment`, or
  * `null` to use `length`
  * @returns {Rac.Segment}
  */
  nextSegmentToAngleDistance(angleDistance, clockwise = true, newLength = null) {
    angleDistance = this.rac.Angle.from(angleDistance);
    newLength = newLength === null ? this.length : newLength;
    const newRay = this.ray
      .translateToDistance(this.length)
      .inverse()
      .withAngleShift(angleDistance, clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` towards the
  * `[perpendicular angle]{@link Rac.Angle#perpendicular}` of
  * `ray.angle.[inverse()]{@link Rac.Angle#inverse}` in the `clockwise`
  * orientation.
  *
  * The resulting `Segment` uses `newLength`, when ommited or `null`
  * defaults to `length` instead.
  *
  * Notice that the perpendicular is calculated from the
  * [inverse]{@link Rac.Angle#inverse} of the segment's angle. E.g. with
  * `clockwise` as `true`, the resulting `Segment` points towards
  * `ray.angle.perpendicular(false)`.
  *
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  *
  * @param {Boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @param {?Number} [newLength=null] - The length of the new `Segment`, or
  * `null` to use `length`
  * @returns {Rac.Segment}
  */
  nextSegmentPerpendicular(clockwise = true, newLength = null) {
    newLength = newLength === null ? this.length : newLength;
    const newRay = this.ray
      .translateToDistance(this.length)
      .perpendicular(!clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` that starts from `endPoint()` and corresponds
  * to the leg of a right triangle where `this` is the other cathetus and
  * the hypotenuse is of length `hypotenuse`.
  *
  * The resulting `Segment` points towards the perpendicular angle of
  * `ray.angle.[inverse()]{@link Rac.Angle#inverse}` in the `clockwise`
  * orientation.
  *
  * When `hypotenuse` is smaller that the segment's `length`, returns
  * `null` since no right triangle is possible.
  *
  * @param {Number} hypotenuse - The length of the hypotenuse side of the
  * right triangle formed with `this` and the new `Segment`
  * @param {Boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @returns {Rac.Segment}
  */
  nextSegmentLegWithHyp(hypotenuse, clockwise = true) {
    if (hypotenuse < this.length) {
      return null;
    }

    // cos = ady / hyp
    const radians = Math.acos(this.length / hypotenuse);
    // tan = ops / adj
    // tan * adj = ops
    const ops = Math.tan(radians) * this.length;
    return this.nextSegmentPerpendicular(clockwise, ops);
  }


  /**
  * Returns a new `Arc` based on this segment, with the given `endAngle`
  * and `clockwise` orientation.
  *
  * The resulting `Arc` is centered at `ray.start`, starting at
  * `ray.angle`, and with a radius of `length`.
  *
  * When `endAngle` is ommited or `null`, the segment's angle is used as
  * default resulting in a complete-circle arc.
  *
  * @param {?Rac.Angle} [endAngle=null] - An `Angle` to use as end for the
  * new `Arc`, or `null` to use `ray.angle`
  * @param {Boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arc(endAngle = null, clockwise = true) {
    endAngle = endAngle === null
      ? this.ray.angle
      : Rac.Angle.from(this.rac, endAngle);
    return new Rac.Arc(this.rac,
      this.ray.start, this.length,
      this.ray.angle, endAngle,
      clockwise);
  }


  /**
  * Returns a new `Arc` based on this segment, with the arc's end at
  * `angleDistance` from the segment's angle in the `clockwise`
  * orientation.
  *
  * The resulting `Arc` is centered at `ray.start`, starting at
  * `ray.angle`, and with a radius of `length`.
  *
  * @param {Rac.Angle|Number} angleDistance - The angle distance from the
  * segment's start to the new `Arc` end
  * @param {Boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arcWithAngleDistance(angleDistance, clockwise = true) {
    angleDistance = this.rac.Angle.from(angleDistance);
    const stargAngle = this.ray.angle;
    const endAngle = stargAngle.shift(angleDistance, clockwise);

    return new Rac.Arc(this.rac,
      this.ray.start, this.length,
      stargAngle, endAngle,
      clockwise);
  }


  // TODO: uncomment once beziers are tested again
  // bezierCentralAnchor(distance, clockwise = true) {
  //   let bisector = this.segmentBisector(distance, clockwise);
  //   return new Rac.Bezier(this.rac,
  //     this.start, bisector.end,
  //     bisector.end, this.end);
  // }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Text` located at `start` and oriented towards `ray.angle`
  * with the given `string` and `format`.
  *
  * When `format` is provided, the angle for the resulting `Text` is still
  * set to `ray.angle`.
  *
  * @param {String} string - The string of the new `Text`
  * @param {Rac.Text.Format} [format=[rac.Text.Format.topLeft]{@link instance.Text.Format#topLeft}]
  *   The format of the new `Text`
  * @returns {Rac.Text}
  */
  text(string, format = this.rac.Text.Format.topLeft) {
    format = format.withAngle(this.ray.angle);
    return new Rac.Text(this.rac, this.ray.start, string, format);
  }


} // Segment


module.exports = Segment;

