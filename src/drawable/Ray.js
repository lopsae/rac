'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Unbounded ray from a point in direction of an angle.
* @alias Rac.Ray
*/
class Ray {

  constructor(rac, start, angle) {
    utils.assertExists(rac, start, angle);
    this.rac = rac;
    this.start = start;
    this.angle = angle;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Ray((${this.start.x},${this.start.y}) a:${this.angle.turn})`;
  }

  copy() {
    return new Ray(this.rac, this.start, this.angle);
  }


  /**
  * Returns the slope of the ray, or `null` if the ray is vertical.
  *
  * `slope` is `m` in the formula `y = mx + b`.
  *
  * @returns {?number}
  */
  slope() {
    let isVertical =
         this.rac.unitaryEquals(this.angle.turn, this.rac.Angle.down.turn)
      || this.rac.unitaryEquals(this.angle.turn, this.rac.Angle.up.turn);
    if (isVertical) {
      return null;
    }

    return Math.tan(this.angle.radians());
  }


  /**
  * Returns the y-intercept (the point at which the ray, extended in both
  * directions, would intercept with the y-axis), or `null` if the ray is
  * vertical.
  *
  * `yIntercept` is `b` in the formula `y = mx + b`.
  *
  * @returns {?number}
  */
  yIntercept() {
    let slope = this.slope();
    if (slope === null) {
      return null;
    }
    // y = mx + b
    // y - mx = b
    return this.start.y - slope * this.start.x;
  }


  withStart(newStart) {
    return new Ray(this.rac, newStart, this.angle);
  }

  withAngle(someAngle) {
    let newAngle = this.rac.Angle.from(someAngle);
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

  // Ray.prototype.pointAtDistance = function(distance) {
  //   return this.start.pointToAngle(this.angle, distance);
  // };

  segment(length) {
    return new Rac.Segment(this.rac, this, length);
  }


  pointAtIntersectionWithX(x) {
    const slope = this.slope();
    if (slope === null) {
      // Vertical ray
      return null;
    }

    if (this.rac.unitaryEquals(slope, 0)) {
      // Horizontal ray
      return this.start.withX(x);
    }

    // y = mx + b
    const y = slope * x + this.yIntercept();
    return new Rac.Point(this.rac, x, y);
  }


  pointAtIntersectionWithY(y) {
    const slope = this.slope();
    if (slope === null) {
      // Vertical ray
      return this.start.withY(y);
    }

    if (this.rac.unitaryEquals(slope, 0)) {
      // Horizontal ray
      return null;
    }

    // mx + b = y
    // x = (y - b)/m
    const x = (y - this.yIntercept()) / slope;
    return new Rac.Point(this.rac, x, y);
  }

} // class Ray


module.exports = Ray;


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
// Ray.prototype.translate = function(point, y = undefined) {
//   if (point instanceof rac.Point && y === undefined) {
//     return new Ray(this.rac,
//       this.start.addPoint(point),
//       this.angle);
//   }

//   if (typeof point === "number" && typeof y === "number") {
//     let x = point;
//     return new Ray(this.rac,
//       this.start.add(x, y),
//       this.angle);
//   }

//   console.trace(`Invalid parameter combination - point-type:${utils.typeName(point)} y-type:${utils.typeName(y)}`);
//   throw rac.Error.invalidParameterCombination;
// }

// Ray.prototype.translateToStart = function(newStart) {
//   let offset = newStart.subtractPoint(this.start);
//   return new Ray(this.rac, this.start.addPoint(offset), this.angle);
// };

// Ray.prototype.translateToAngle = function(someAngle, distance) {
//   let angle = rac.Angle.from(someAngle);
//   let offset = rac.Point.zero.pointToAngle(angle, distance);
//   return new Ray(this.rac, this.start.addPoint(offset), this.angle);
// };

// Ray.prototype.translateToDistance = function(distance) {
//   let offset = rac.Point.zero.pointToAngle(this.angle, distance);
//   return new Ray(this.rac, this.start.addPoint(offset), this.angle);
// };

// Ray.prototype.translatePerpendicular = function(distance, clockwise = true) {
//   let perpendicular = this.angle.perpendicular(clockwise);
//   return this.translateToAngle(perpendicular, distance);
// };



// Returns an complete circle Arc using this segment `start` as center,
// `length()` as radiusm, and `angle` as start and end angles.
// Ray.prototype.arc = function(radius, clockwise = true) {
//   return new Rac.Arc(this.rac,
//     this.start, radius,
//     this.angle, this.angle,
//     clockwise);
// };

// Returns an Arc using this segment `start` as center, `length()` as
// radius, starting from the `angle` to the given angle and orientation.
// Ray.prototype.arcWithEnd = function(
//   radius,
//   someAngleEnd = this.angle,
//   clockwise = true)
// {
//   let arcEnd = rac.Angle.from(someAngleEnd);
//   return new Rac.Arc(this.rac,
//     this.start, distance,
//     this.angle, arcEnd,
//     clockwise);
// };

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

