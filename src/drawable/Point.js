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

  text(string, format, angle = this.rac.Angle.zero) {
    return new Rac.Text(this.rac, string, format, this, angle);
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
    return new Point(
      this.rac,
      this.x + x,
      this.y + y);
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

  // Returns a segment that is tangent to `arc` in the `clockwise`
  // orientation from the segment formed by `this` and `arc.center`. The
  // returned segment has `this` as `start` and `end` is a point in `arc`.
  // `arc` is considered as a complete circle.
  // Returns `null` if `this` is inside `arc` and thus no tangent segment
  // is possible.
  segmentTangentToArc(arc, clockwise = true) {
    // TODO: recheck after segment migration
    let hypotenuse = this.segmentToPoint(arc.center);
    let ops = arc.radius;

    let angleSine = ops / hypotenuse.length();
    if (angleSine > 1) {
      return null;
    }

    let angleRadians = Math.asin(angleSine);
    let opsAngle = Rac.Angle.fromRadians(this.rac, angleRadians);
    let shiftedOpsAngle = hypotenuse.angle().shift(opsAngle, clockwise);

    let end = arc.pointAtAngle(shiftedOpsAngle.perpendicular(clockwise));
    return this.segmentToPoint(end);
  }

} // class Point


module.exports = Point;


Point.prototype.addX = function(x) {
  return new Point(
    this.rac,
    this.x + x,
    this.y);
};

Point.prototype.addY = function(y) {
  return new Point(
    this.rac,
    this.x,
    this.y + y);
};


Point.prototype.negative = function() {
  return new Point(this.rac, -this.x, -this.y);
};

Point.prototype.angleToPoint = function(other) {
  let offset = other.subtractPoint(this);
  let radians = Math.atan2(offset.y, offset.x);
  return Rac.Angle.fromRadians(this.rac, radians);
};

Point.prototype.distanceToPoint = function(other) {
  let x = Math.pow((other.x - this.x), 2);
  let y = Math.pow((other.y - this.y), 2);
  return Math.sqrt(x+y);
};

Point.prototype.perpendicular = function(clockwise = true) {
  return clockwise
    ? new Point(this.rac, -this.y, this.x)
    : new Point(this.rac, this.y, -this.x);
};

Point.prototype.pointToAngle = function(someAngle, distance) {
  let angle = this.rac.Angle.from(someAngle);
  let distanceX = distance * Math.cos(angle.radians());
  let distanceY = distance * Math.sin(angle.radians());
  return new Point(this.rac, this.x + distanceX, this.y + distanceY);
};


Point.prototype.ray = function(someAngle) {
  const angle = this.rac.Angle.from(someAngle);
  return new Rac.Ray(this.rac, this, angle);
};

Point.prototype.rayToPoint = function(point) {
  const angle = this.angleToPoint(point);
  return new Rac.Ray(this.rac, this, angle);
};

Point.prototype.segmentToAngle = function(someAngle, length) {
  const angle = this.rac.Angle.from(someAngle);
  const ray = new Rac.Ray(this.rac, this, angle);
  return new Rac.Segment(this.rac, ray, length);
};

// TODO: what happens if points are equal?
Point.prototype.segmentToPoint = function(point) {
  const angle = this.angleToPoint(point);
  const length = this.distanceToPoint(point);
  const ray = new Rac.Ray(this.rac, this, angle);
  return new Rac.Segment(this.rac, ray, length);
};

// Returns a segment from this to the point projected in ray
Point.prototype.segmentToRayProjection = function(ray) {
  let projectedPoint = ray.pointProjected(this);
  return this.segmentToPoint(projectedPoint);
};

Point.prototype.arc = function(
  radius,
  start = this.rac.Angle.zero,
  end = start,
  clockwise = true)
{
  return new Rac.Arc(this.rac, this, radius, start, end, clockwise);
};

