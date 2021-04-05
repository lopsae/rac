'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Point in a two dimentional coordinate system.
* @alias Rac.Point
*/
class Point{

  /**
  * Creates a new `Point` instance.
  * @param {Rac} rac Instance to use for drawing and creating other objects
  * @param {number} x The x coordinate
  * @param {number} y The y coordinate
  */
  constructor(rac, x, y) {
    utils.assertExists(rac, x, y);
    utils.assertNumber(x, y);
    this.rac = rac;
    this.x = x;
    this.y = y;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Point(${this.x},${this.y})`;
  }


  equals(other) {
    return this.rac.equals(this.x, other.x)
      && this.rac.equals(this.y, other.y);
  }


  /**
  * Returns a new `Point` with `x` set to `newX`.
  */
  withX(newX) {
    return new Point(this.rac, newX, this.y);
  }

  /**
  * Returns a new `Point` with `x` set to `newX`.
  */
  withY(newY) {
    return new Point(this.rac, this.x, newY);
  }

  addX(x) {
    return new Point(this.rac,
      this.x + x, this.y);
  }

  addY(y) {
    return new Point(this.rac,
      this.x, this.y + y);
  }

  /**
  * Returns a new `Point` by adding the components of `other`.
  * @param {Rac.Point} other A `Point` to add
  */
  addPoint(other) {
    return new Point(
      this.rac,
      this.x + other.x,
      this.y + other.y);
  }


  /**
  * Returns a new `Point` by adding the `x` and `y` components.
  * @param {number} x The x coodinate to add
  * @param {number} y The y coodinate to add
  */
  add(x, y) {
    return new Point(this.rac,
      this.x + x, this.y + y);
  }


  /**
  * Returns a new `Point` by subtracting the components of `other`.
  * @param {Rac.Point} other A `Point` to subtract
  */
  subtractPoint(other) {
    return new Point(
      this.rac,
      this.x - other.x,
      this.y - other.y);
  }


  /**
  * Returns a new `Point` by subtracting the `x` and `y` components.
  * @param {number} x The x coodinate to subtract
  * @param {number} y The y coodinate to subtract
  */
  subtract(x, y) {
    return new Point(
      this.rac,
      this.x - x,
      this.y - y);
  }

  negative() {
    return new Point(this.rac, -this.x, -this.y);
  }


  perpendicular(clockwise = true) {
    return clockwise
      ? new Point(this.rac, -this.y, this.x)
      : new Point(this.rac, this.y, -this.x);
  }

  distanceToPoint(other) {
    let x = Math.pow((other.x - this.x), 2);
    let y = Math.pow((other.y - this.y), 2);
    return Math.sqrt(x+y);
  }

  // Returns the angle to the given point. If this and other are considered
  // equal, then the `someAngle` is returned, which by defalt is zero.
  angleToPoint(other, someAngle = this.rac.Angle.zero) {
    if (this.equals(other)) {
      const angle = this.rac.Angle.from(someAngle);
      return angle;
    }
    const offset = other.subtractPoint(this);
    const radians = Math.atan2(offset.y, offset.x);
    return Rac.Angle.fromRadians(this.rac, radians);
  }


  pointToAngle(someAngle, distance) {
    let angle = this.rac.Angle.from(someAngle);
    let distanceX = distance * Math.cos(angle.radians());
    let distanceY = distance * Math.sin(angle.radians());
    return new Point(this.rac, this.x + distanceX, this.y + distanceY);
  }


  ray(someAngle) {
    const angle = this.rac.Angle.from(someAngle);
    return new Rac.Ray(this.rac, this, angle);
  }

  rayToPoint(point, someAngle = this.rac.Angle.zero) {
    const angle = this.angleToPoint(point, someAngle);
    return new Rac.Ray(this.rac, this, angle);
  }

  /**
  * Returns a `Ray` from `this` to the point projected in `ray`. If the
  * projected point is equal to `this` the produced ray will have an angle
  * clockwise-perpendicular to `ray`.
  *
  * @param {Rac.Ray} ray
  * @returns {Rac.Point}
  */
  rayToProjectionInRay(ray) {
    const projected = ray.pointProjected(this);
    const perpendicular = ray.angle.perpendicular();
    return this.rayToPoint(projected, perpendicular);
  }


  // TODO: rayTangentToArc


  segmentToAngle(someAngle, length) {
    const angle = this.rac.Angle.from(someAngle);
    const ray = new Rac.Ray(this.rac, this, angle);
    return new Rac.Segment(this.rac, ray, length);
  }

  segmentToPoint(point, someAngle = this.rac.Angle.zero) {
    const angle = this.angleToPoint(point, someAngle);
    const length = this.distanceToPoint(point);
    const ray = new Rac.Ray(this.rac, this, angle);
    return new Rac.Segment(this.rac, ray, length);
  }

  // Returns a segment from this to the point projected in ray
  segmentToProjectionInRay(ray) {
    const projected = ray.pointProjected(this);
    const perpendicular = ray.angle.perpendicular();
    return this.segmentToPoint(projected, perpendicular);
  }


  /**
  * Returns a `Segment` that is tangent to `arc` in the `clockwise`
  * orientation from the ray formed by `this` and `arc.center`. Returns
  * `null` if `this` is inside `arc` and thus no tangent segment is
  * possible.
  * The returned `Segment` starts at `this` and ends at the contact point
  * with `arc` which is considered as a complete circle.
  *
  * TODO: what happens if the point touches the circle?
  * TODO: what happens if the arc radius is zero and this is equal to center?
  *
  * @param {Rac.Arc} arc
  * @param {boolean=} clockwise=true
  * @return {Rac.Segment}
  */
  segmentTangentToArc(arc, clockwise = true) {
    // Default angle is given for the edge case of a zero-radius arc
    let hypotenuse = this.segmentToPoint(arc.center, arc.start.inverse());
    let ops = arc.radius;

    if (this.rac.equals(hypotenuse.length, arc.radius)) {
      // Point in arc
      const perpendicular = hypotenuse.ray.angle.perpendicular(clockwise);
      return this.segmentToAngle(perpendicular, 0);
    }

    let angleSine = ops / hypotenuse.length;
    if (angleSine > 1) {
      // Point inside arc
      return null;
    }

    let angleRadians = Math.asin(angleSine);
    let opsAngle = Rac.Angle.fromRadians(this.rac, angleRadians);
    let shiftedOpsAngle = hypotenuse.angle().shift(opsAngle, clockwise);

    // TODO: splitting it to ray would actually save some calculations
    let end = arc.pointAtAngle(shiftedOpsAngle.perpendicular(clockwise));
    return this.segmentToPoint(end);
  }


  text(string, format, angle = this.rac.Angle.zero) {
    return new Rac.Text(this.rac, string, format, this, angle);
  }

} // class Point


module.exports = Point;


Point.prototype.arc = function(
  radius,
  start = this.rac.Angle.zero,
  end = start,
  clockwise = true)
{
  return new Rac.Arc(this.rac, this, radius, start, end, clockwise);
};

