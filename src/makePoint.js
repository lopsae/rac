'use strict';


module.exports = function makePoint(rac) {

  class RacPoint{

    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    text(string, format, rotation = rac.Angle.zero) {
      return new rac.Text(string, format, this, rotation);
    }

    withX(newX) {
      return new RacPoint(newX, this.y);
    }

    withY(newY) {
      return new RacPoint(this.x, newY);
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
      let opsAngle = rac.Angle.fromRadians(angleRadians);
      let shiftedOpsAngle = hypotenuse.angle().shift(opsAngle, clockwise);

      let end = arc.pointAtAngle(shiftedOpsAngle.perpendicular(clockwise));
      return this.segmentToPoint(end);
    }

  } // RacPoint


  RacPoint.prototype.add = function(other, y = undefined) {
    if (other instanceof RacPoint && y === undefined) {
      return new RacPoint(
      this.x + other.x,
      this.y + other.y);
    }

    if (typeof other === "number" && typeof y === "number") {
      let x = other;
      return new RacPoint(
        this.x + x,
        this.y + y);
    }

    console.trace(`Invalid parameter combination - other-type:${rac.typeName(other)} y-type:${rac.typeName(y)}`);
    throw rac.Error.invalidParameterCombination;
  };

  RacPoint.prototype.substract = function(other, y = undefined) {
    if (other instanceof RacPoint && y === undefined) {
      return new RacPoint(
      this.x - other.x,
      this.y - other.y);
    }

    if (typeof other === "number" && typeof y === "number") {
      let x = other;
      return new RacPoint(
        this.x - x,
        this.y - y);
    }

    console.trace(`Invalid parameter combination - other-type:${rac.typeName(other)} y-type:${rac.typeName(y)}`);
    throw rac.Error.invalidParameterCombination;
  };


  RacPoint.prototype.sub = function(other, y = undefined) {
    this.substract(other, y);
  };

  RacPoint.prototype.addX = function(x) {
    return new RacPoint(
      this.x + x,
      this.y);
  };

  RacPoint.prototype.addY = function(y) {
    return new RacPoint(
      this.x,
      this.y + y);
  };


  RacPoint.prototype.negative = function() {
    return new RacPoint(-this.x, -this.y);
  };

  RacPoint.prototype.angleToPoint = function(other) {
    let offset = other.add(this.negative());
    return rac.Angle.fromPoint(offset);
  };

  RacPoint.prototype.distanceToPoint = function(other) {
    let x = Math.pow((other.x - this.x), 2);
    let y = Math.pow((other.y - this.y), 2);
    return Math.sqrt(x+y);
  };

  RacPoint.prototype.pointPerpendicular = function(clockwise = true) {
    return clockwise
      ? new RacPoint(-this.y, this.x)
      : new RacPoint(this.y, -this.x);
  };

  RacPoint.prototype.pointToAngle = function(someAngle, distance) {
    let angle = rac.Angle.from(someAngle);
    let distanceX = distance * Math.cos(angle.radians());
    let distanceY = distance * Math.sin(angle.radians());
    return new RacPoint(this.x + distanceX, this.y + distanceY);
  };

  RacPoint.prototype.segmentToPoint = function(point) {
    return new rac.Segment(this, point);
  };

  RacPoint.prototype.segmentToAngle = function(someAngle, distance) {
    let end = this.pointToAngle(someAngle, distance);
    return new rac.Segment(this, end);
  };

  RacPoint.prototype.segmentToAngleToIntersectionWithSegment = function(someAngle, segment) {
    let unit = this.segmentToAngle(someAngle, 1);
    return unit.segmentToIntersectionWithSegment(segment);
  }

  RacPoint.prototype.segmentPerpendicularToSegment = function(segment) {
    let projectedPoint = segment.projectedPoint(this);
    return this.segmentToPoint(projectedPoint);
  };

  RacPoint.prototype.arc = function(radius, start = rac.Angle.zero, end = start, clockwise = true) {
    return new rac.Arc(this, radius, start, end, clockwise);
  };


  RacPoint.zero = new RacPoint(0, 0);
  RacPoint.origin = RacPoint.zero;


  return RacPoint;

} // makePoint

