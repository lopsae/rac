'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


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
  describe() {
    return `Point(${this.x},${this.y})`;
  }

  text(string, format, rotation = Rac.Angle.zero) {
    return new Rac.Text(this.rac, string, format, this, rotation);
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

  // Returns a segment that is tangent to `arc` in the `clockwise`
  // orientation from the segment formed by `this` and `arc.center`. The
  // returned segment has `this` as `start` and `end` is a point in `arc`.
  // `arc` is considered as a complete circle.
  // Returns `null` if `this` is inside `arc` and thus no tangent segment
  // is possible.
  segmentTangentToArc(arc, clockwise = true) {
    let hypotenuse = this.segmentToPoint(arc.center);
    let ops = arc.radius;

    let angleSine = ops / hypotenuse.length();
    if (angleSine > 1) {
      return null;
    }

    let angleRadians = Math.asin(angleSine);
    let opsAngle = Rac.Angle.fromRadians(angleRadians);
    let shiftedOpsAngle = hypotenuse.angle().shift(opsAngle, clockwise);

    let end = arc.pointAtAngle(shiftedOpsAngle.perpendicular(clockwise));
    return this.segmentToPoint(end);
  }

} // Point


module.exports = Point;


// TODO: separate into add and addValues, or translate
/**
* Returns a new `Point` adding the given `Point`, or coordinates.
* @param {Rac.Point|number} otherOrX a `Point` or the x coodinate to add
* @param {number} y The y coodinate to add
*/
Point.prototype.add = function(otherOrX, y = undefined) {
  if (otherOrX instanceof Point && y === undefined) {
    return new Point(
      this.rac,
      this.x + otherOrX.x,
      this.y + otherOrX.y);
  }

  if (typeof otherOrX === "number" && typeof y === "number") {
    let x = otherOrX;
    return new Point(
      this.rac,
      this.x + x,
      this.y + y);
  }

  console.trace(`Invalid parameter combination - other-type:${utils.typeName(other)} y-type:${utils.typeName(y)}`);
  throw rac.Error.invalidParameterCombination;
};

Point.prototype.substract = function(other, y = undefined) {
  if (other instanceof Point && y === undefined) {
    return new Point(
      this.rac,
      this.x - other.x,
      this.y - other.y);
  }

  if (typeof other === "number" && typeof y === "number") {
    let x = other;
    return new Point(
      this.rac,
      this.x - x,
      this.y - y);
  }

  console.trace(`Invalid parameter combination - other-type:${utils.typeName(other)} y-type:${utils.typeName(y)}`);
  throw this.rac.Error.invalidParameterCombination;
};


Point.prototype.sub = function(other, y = undefined) {
  return this.substract(other, y);
};

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
  let offset = other.add(this.negative());
  return Rac.Angle.fromPoint(offset);
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
  let angle = Rac.Angle.from(someAngle);
  let distanceX = distance * Math.cos(angle.radians());
  let distanceY = distance * Math.sin(angle.radians());
  return new Point(this.rac, this.x + distanceX, this.y + distanceY);
};

Point.prototype.segmentToPoint = function(point) {
  // TODO: will be Rac.Segment(this.rac, this, point);
  return new Rac.Segment(this, point);
};

Point.prototype.segmentToAngle = function(someAngle, distance) {
  let end = this.pointToAngle(someAngle, distance);
  // TODO: will be Rac.Segment(this.rac, this, end)
  return new Rac.Segment(this, end);
};

Point.prototype.segmentToAngleToIntersectionWithSegment = function(someAngle, segment) {
  let unit = this.segmentToAngle(someAngle, 1);
  return unit.segmentToIntersectionWithSegment(segment);
}

Point.prototype.segmentPerpendicularToSegment = function(segment) {
  let projectedPoint = segment.projectedPoint(this);
  return this.segmentToPoint(projectedPoint);
};

Point.prototype.arc = function(radius, start = rac.Angle.zero, end = start, clockwise = true) {
  // TODO: will be Rac.Arc(this.rac, this, radius, start, end, clockwise);
  return new Rac.Arc(this, radius, start, end, clockwise);
};

