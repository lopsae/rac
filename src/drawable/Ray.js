'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


class Ray {

  constructor(rac, start, angle) {
    utils.assertExists(rac, start, angle);
    this.rac = rac;
    this.start = start;
    this.angle = angle;
  }

  copy() {
    return new Ray(this.rac, this.start, this.angle);
  }

  withStart(newStart) {
    return new Ray(this.rac, newStart, this.angle);
  }

  withAngle(someAngle) {
    let newAngle = rac.Angle.from(someAngle);
    return new Ray(this.rac, this.start, newAngle);
  }

  withAngleAdd(someAngle) {
    let newAngle = this.angle.add(someAngle);
    let newEnd = this.start.pointToAngle(newAngle, this.length());
    return new Ray(this.rac, this.start, newEnd);
  }

  withAngleShift(someAngle, clockwise = true) {
    let newAngle = this.angle.shift(someAngle, clockwise);
    return new Ray(this.rac, this.start, newAngle);
  }

  perpendicular(clockwise = true) {
    return this.withAngleShift(rac.Angle.square, clockwise);
  }

  // projectedPoint(point) {
  //   let perpendicular = this.angle.perpendicular();
  //   // TODO: could be ray instead
  //   return point.segmentToAngle(perpendicular, rac.arbitraryLength)
  //     .pointAtIntersectionWithSegment(this);
  // }

  // Returns the length of a segment from `start` to `point` being
  // projected in the segment. The returned length may be negative if the
  // projected point falls behind `start`.
  // distanceToProjectedPoint(point) {
  //   let projected = this.projectedPoint(point);
  //   let segment = this.start.segmentToPoint(projected);

  //   if (segment.length() < rac.equalityThreshold) {
  //     return 0;
  //   }

  //   let angleDiff = this.angle.subtract(segment.angle);
  //   if (angleDiff.turn <= 1/4 || angleDiff.turn > 3/4) {
  //     return segment.length();
  //   } else {
  //     return - segment.length();
  //   }
  // }

  // Returns `true` if the given point is located clockwise of the segment,
  // or `false` if located counter-clockwise.
  // pointOrientation(point) {
  //   let angle = this.start.angleToPoint(point);
  //   let angleDistance = angle.subtract(this.angle);
  //   // [0 to 0.5) is considered clockwise
  //   // [0.5, 1) is considered counter-clockwise
  //   return angleDistance.turn < 0.5;
  // }

  segment(length) {
    let end = this.start.pointToAngle(this.angle, length);
    return new Rac.Segment(this.rac, this.start, end);
  }

} // class Ray


module.exports = Ray;


// Returns the slope of the ray, or `null` if the ray is vertical.
// Ray.prototype.slope = function() {
//   let dx = this.end.x - this.start.x;
//   let dy = this.end.y - this.start.y;
//   if (Math.abs(dx) < rac.equalityThreshold) {
//     if(Math.abs(dy) < rac.equalityThreshold) {
//       // Segment with equal end and start returns a default angle of 0
//       // Equivalent slope is 0
//       return 0;
//     }
//     return null;
//   }

//   return dy / dx;
// };

// Returns the y-intercept, or `null` if the segment is part of a
// vertical line.
// Ray.prototype.yIntercept = function() {
//   let slope = this.slope();
//   if (slope === null) {
//     return null;
//   }
//   // y = mx + b
//   // y - mx = b
//   return this.start.y - slope * this.start.x;
// };


// Ray.prototype.pointAtX = function(x) {
//   let slope = this.slope();
//   if (slope === null) {
//     return null;
//   }

//   let y = slope*x + this.yIntercept();
//   return new Rac.Point(this.rac, x, y);
// }


// Translates the ray by the entire `point`, or by the given `x` and
// `y` components.
Ray.prototype.translate = function(point, y = undefined) {
  if (point instanceof rac.Point && y === undefined) {
    return new Ray(this.rac,
      this.start.addPoint(point),
      this.angle);
  }

  if (typeof point === "number" && typeof y === "number") {
    let x = point;
    return new Ray(this.rac,
      this.start.add(x, y),
      this.angle);
  }

  console.trace(`Invalid parameter combination - point-type:${utils.typeName(point)} y-type:${utils.typeName(y)}`);
  throw rac.Error.invalidParameterCombination;
}

Ray.prototype.translateToStart = function(newStart) {
  let offset = newStart.subtractPoint(this.start);
  return new Ray(this.rac, this.start.addPoint(offset), this.angle);
};

Ray.prototype.translateToAngle = function(someAngle, distance) {
  let angle = rac.Angle.from(someAngle);
  let offset = rac.Point.zero.pointToAngle(angle, distance);
  return new Ray(this.rac, this.start.addPoint(offset), this.angle);
};

Ray.prototype.translateToDistance = function(distance) {
  let offset = rac.Point.zero.pointToAngle(this.angle, distance);
  return new Ray(this.rac, this.start.addPoint(offset), this.angle);
};

Ray.prototype.translatePerpendicular = function(distance, clockwise = true) {
  let perpendicular = this.angle.perpendicular(clockwise);
  return this.translateToAngle(perpendicular, distance);
};

// Returns the intersecting point of `this` and `other`. Both segments are
// considered lines without endpoints.
// Ray.prototype.pointAtIntersectionWithSegment = function(other) {
//   // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
//   let a = this.slope();
//   let b = other.slope();
//   if (a === b) {
//     // Parallel lines, no intersection
//     return null;
//   }

//   let c = this.yIntercept();
//   let d = other.yIntercept();

//   if (a === null) { return other.pointAtX(this.start.x); }
//   if (b === null) { return this.pointAtX(other.start.x); }

//   let x = (d - c) / (a - b);
//   let y = a * x + c;
//   return new Rac.Point(this.rac, x, y);
// };

Ray.prototype.pointAtDistance = function(distance) {
  return this.start.pointToAngle(this.angle, distance);
};


// Returns an complete circle Arc using this segment `start` as center,
// `length()` as radiusm, and `angle` as start and end angles.
Ray.prototype.arc = function(radius, clockwise = true) {
  return new Rac.Arc(this.rac,
    this.start, radius,
    this.angle, this.angle,
    clockwise);
};

// Returns an Arc using this segment `start` as center, `length()` as
// radius, starting from the `angle` to the given angle and orientation.
Ray.prototype.arcWithEnd = function(
  radius,
  someAngleEnd = this.angle,
  clockwise = true)
{
  let arcEnd = rac.Angle.from(someAngleEnd);
  return new Rac.Arc(this.rac,
    this.start, distance,
    this.angle, arcEnd,
    clockwise);
};

// Returns an Arc using this segment `start` as center, `length()` as
// radius, starting from the `angle` to the arc distance of the given
// angle and orientation.
// Ray.prototype.arcWithAngleDistance = function(someAngleDistance, clockwise = true) {
//   let angleDistance = rac.Angle.from(someAngleDistance);
//   let arcStart = this.angle;
//   let arcEnd = arcStart.shift(angleDistance, clockwise);

//   return new Rac.Arc(this.rac,
//     this.start, this.length(),
//     arcStart, arcEnd,
//     clockwise);
// };

// Returns a segment from `this.start` to the intersection between `this`
// and `other`.
// Ray.prototype.segmentToIntersectionWithSegment = function(other) {
//   let end = this.pointAtIntersectionWithSegment(other);
//   if (end === null) {
//     return null;
//   }
//   return new Ray(this.rac, this.start, end);
// };

