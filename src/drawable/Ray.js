'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Unbounded ray from a point in direction of an angle.
* @alias Rac.Ray
*/
class Ray {

  /**
  * Creates a new `Ray` instance.
  * @param {Rac} rac Instance to use for drawing and creating other objects
  * @param {Rac.Point} start - A `Point` where the ray starts
  * @param {Rac.Angle} angle - An `Angle` the ray is directed to
  */
  constructor(rac, start, angle) {
    utils.assertExists(rac, start, angle);
    utils.assertType(Rac.Point, start)
    utils.assertTyoe(Rac.Angle, angle)
    this.rac = rac;
    this.start = start;
    this.angle = angle;
  }

  /**
  * Returns a string representation intended for human consumption.
  * @returns {string}
  */
  toString() {
    return `Ray((${this.start.x},${this.start.y}) a:${this.angle.turn})`;
  }


  /**
  * Returns the slope of the ray, or `null` if the ray is vertical.
  *
  * In the line formula `y = mx + b` the slope is `m`.
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
  * Returns the y-intercept: the point at which the ray, extended in both
  * directions, intercepts with the y-axis; or `null` if the ray is
  * vertical.
  *
  * In the line formula `y = mx + b` the y-intercept is `b`.
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

  /**
  * Returns a new `Ray` with `start` set to `newStart`.
  * @param {Rac.Point} newStart - The start for the new `Ray`
  * @returns {Rac.Ray}
  */
  withStart(newStart) {
    return new Ray(this.rac, newStart, this.angle);
  }

  /**
  * Returns a new `Ray` with `angle` set to `newAngle`.
  * @param {Rac.Angle|number} newAngle - The angle for the new `Ray`
  * @returns {Rac.Ray}
  */
  withAngle(newAngle) {
    newAngle = this.rac.Angle.from(newAngle);
    return new Ray(this.rac, this.start, newAngle);
  }

  /**
  * Returns a new `Ray` with `angle` added to `this.angle`.
  * @param {Rac.Angle|number} newAngle - The angle for to add
  * @returns {Rac.Ray}
  */
  withAngleAdd(angle) {
    let newAngle = this.angle.add(angle);
    let newEnd = this.start.pointToAngle(newAngle, this.length());
    return new Ray(this.rac, this.start, newEnd);
  }

  /**
  * Returns a new `Ray` with `this.angle` [shifted by]{@link Rac.Angle#shift}
  * `angle`.
  * @param {Rac.Angle|number} newAngle - The angle to be shifted by
  * @param {boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Ray}
  */
  withAngleShift(angle, clockwise = true) {
    let newAngle = this.angle.shift(angle, clockwise);
    return new Ray(this.rac, this.start, newAngle);
  }

  /**
  * Returns a new `Ray` with `start` moved along the ray by the given
  * `distance`. When `distance` is negative, `start` is moved in
  * the direction inverse of `angle`.
  *
  * @param {number} distance - The distance to move `start` by
  * @returns {Rac.Ray}
  */
  withStartAtDistance(distance) {
    const newStart = this.start.pointToAngle(this.angle, distance);
    return new Ray(this.rac, newStart, this.angle);
  }

  /**
  * Returns a new `Ray` pointing towards
  * `{@link Rac.Angle#inverse angle.inverse()}`.
  * @returns {Rac.Ray}
  */
  inverse() {
    const inverseAngle = this.angle.inverse();
    return new Ray(this.rac, this.start, inverseAngle);
  }

  /**
  * Returns a new `Ray` pointing towards
  * `{@link Rac.Angle#perpendicular angle.perpendicular()}` in the
  * `clockwise` orientation.
  *
  * @param {boolean} [clockwise=true]
  * @returns {Rac.Ray}
  */
  perpendicular(clockwise = true) {
    let perpendicular = this.angle.perpendicular(clockwise);
    return new Ray(this.rac, this.start, perpendicular);
  }

  /**
  * Returns a new `Point` located in the ray where the x coordinate is `x`.
  * When the ray is vertical, returns `null` since there is no single point
  * with x coordinate at `x`.
  *
  * The ray is considered a unbounded line.
  *
  * @param {number} x - The x coordinate to calculate a point in the ray
  * @retursn {Rac.Point}
  */
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

  /**
  * Returns a new `Point` located in the ray where the y coordinate is `y`.
  * When the ray is horizontal, returns `null` since there is no single
  * point with y coordinate at `y`.
  *
  * The ray is considered a unbounded line.
  *
  * @param {number} y - The y coordinate to calculate a point in the ray
  * @retursn {Rac.Point}
  */
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

  /**
  * Returns a new `Point` in the ray at the given `distance` from
  * `this.start`. When `distance` is negative, the new `Point` is calculated
  * in the direction inverse of `angle`.
  *
  * @param {number} distance - The distance from `this.start`
  * @returns {Rac.Point}
  */
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

