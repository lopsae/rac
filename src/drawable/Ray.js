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

  withStartAtDistance(distance) {
    const newStart = this.start.pointToAngle(this.angle, distance);
    return new Ray(this.rac, newStart, this.angle);
  }

  inverse() {
    const inverseAngle = this.angle.inverse();
    return new Ray(this.rac, this.start, inverseAngle);
  }

  perpendicular(clockwise = true) {
    let perpendicular = this.angle.perpendicular(clockwise);
    return new Ray(this.rac, this.start, perpendicular);
  }


  pointAtX(x) {
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


  pointAtY(y) {
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


  pointAtDistance(distance) {
    return this.start.pointToAngle(this.angle, distance);
  }


  // Returns the intersecting point of `this` and `other`. Both rays are
  // considered lines without endpoints. Returns null if the rays are
  // parallel.
  pointAtIntersection(other) {
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const a = this.slope();
    const b = other.slope();
    // Parallel lines, no intersection
    if (a === null && b === null) { return null; }
    if (this.rac.unitaryEquals(a, b)) { return null; }

    const c = this.yIntercept();
    const d = other.yIntercept();


    if (a === null) { return other.pointAtX(this.start.x); }
    if (b === null) { return this.pointAtX(other.start.x); }

    const x = (d - c) / (a - b);
    const y = a * x + c;
    return new Rac.Point(this.rac, x, y);
  }


  pointProjected(point) {
    const perpendicular = this.angle.perpendicular();
    return point.ray(perpendicular)
      .pointAtIntersection(this);
  }


  // Returns the distance from `start` to the projection of `point` in the
  // ray.
  // The distance is positive if the projected point is in the direction
  // of the ray, and negative if it is behind.
  distanceToProjectedPoint(point) {
    const projected = this.pointProjected(point);
    const distance = this.start.distanceToPoint(projected);

    if (this.rac.equals(distance, 0)) {
      return 0;
    }

    const angleToProjected = this.start.angleToPoint(projected);
    const angleDiff = this.angle.subtract(angleToProjected);
    if (angleDiff.turn <= 1/4 || angleDiff.turn > 3/4) {
      return distance;
    } else {
      return -distance;
    }
  }

  // Returns `true` if the given point is located clockwise of the segment,
  // or `false` if located counter-clockwise.
  // pointOrientation(point) {
  //   let angle = this.start.angleToPoint(point);
  //   let angleDistance = angle.subtract(this.angle);
  //   // [0 to 0.5) is considered clockwise
  //   // [0.5, 1) is considered counter-clockwise
  //   return angleDistance.turn < 0.5;
  // }


  rayToPoint(point) {
    const newAngle = this.start.angleToPoint(point, this.angle);
    return new Ray(this.rac, this.start, newAngle);
  }


  segment(length) {
    return new Rac.Segment(this.rac, this, length);
  }


  segmentToPoint(point) {
    const newRay = this.rayToPoint(point);
    const length = this.start.distanceToPoint(point);
    return new Rac.Segment(this.rac, newRay, length);
  }


  // TODO: segmentToIntersectionWithRay

} // class Ray


module.exports = Ray;


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
// Ray.prototype.segmentToIntersectionWithRay = function(ray) {
//   let end = this.pointAtIntersectionWithRay(ray.ray);
//   if (end === null) {
//     return null;
//   }
//   return new Ray(this.rac, this.start, end);
// };

