'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Segment of a ray up to a given length.
* @alias Rac.Segment
*/
class Segment {

  constructor(rac, ray, length) {
    // TODO: || throw new Error(err.missingParameters)
    utils.assertExists(rac, ray, length);
    utils.assertType(Rac.Ray, ray);
    utils.assertNumber(length);
    this.rac = rac;
    this.ray = ray;
    this.length = length;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Segment((${this.ray.start.x},${this.ray.start.y}) a:${this.ray.angle.turn} l:${this.length})`;
  }

  copy() {
    return new Segment(this.rac, this.ray, this.length);
  }

  angle() {
    return this.ray.angle;
  }

  startPoint() {
    return this.ray.start;
  }

  endPoint() {
    return this.ray.pointAtDistance(this.length);
  }

  withRay(newRay) {
    return new Segment(this.rac, newRay, this.length);
  }

  withStartPoint(newStartPoint) {
    const newRay = this.ray.withStart(newStartPoint);
    return new Segment(this.rac, newRay, this.length);
  }

  withEndPoint(newEndPoint) {
    const newRay = this.ray.rayToPoint(newEndPoint);
    const newLength = this.ray.start.distanceToPoint(newEndPoint);
    return new Segment(this.rac, newRay, newLength);
  }

  withLength(newLength) {
    return new Segment(this.rac, this.ray, newLength);
  }


  // Returns a new segment from `start` to a length determined by
  // `ratio*length`.
  withLengthRatio(ratio) {
    return new Segment(this.rac, this.ray, this.length * ratio);
  }


  withAngleAdd(someAngle) {
    let newAngle = this.angle().add(someAngle);
    let newEnd = this.start.pointToAngle(newAngle, this.length());
    // TODO: needs update
    return new Segment(this.rac, this.start, newEnd);
  }

  // TODO: needs update
  // withAngleShift(someAngle, clockwise = true) {
  //   let newAngle = this.angle().shift(someAngle, clockwise);
  //   let newEnd = this.start.pointToAngle(newAngle, this.length());
  //   return new Segment(this.rac, this.start, newEnd);
  // }

  // TODO: needs update
  // withStartExtended(length) {
  //   let newStart = this.reverse().nextSegmentWithLength(length).end;
  //   return new Segment(this.rac, newStart, this.end);
  // }

  // TODO: needs update
  // withEndExtended(length) {
  //   let newEnd = this.nextSegmentWithLength(length).end;
  //   return new Segment(this.rac, this.start, newEnd);
  // }


  // Returns a new segment from `this.start`, with the same length, that is
  // perpendicular to `this` in the `clockwise` orientation.
  // TODO: needs update
  // withPerpendicularAngle(clockwise = true) {
  //   return this.withAngleShift(this.rac.Angle.square, clockwise);
  // }


  reverse() {
    const end = this.endPoint();
    const inverseRay = new Rac.Ray(this.rac, end, this.ray.angle.inverse());
    return new Segment(this.rac, inverseRay, this.length);
  }


  // TODO: implement moveStartPoint, which retains the position of endPoint


  translateToCoordinates(x, y) {
    const newStart = new Rac.Point(this.rac, x, y);
    return this.withStartPoint(newStart);
  }


  translateToAngle(someAngle, distance) {
    const angle = this.rac.Angle.from(someAngle);
    const newStart = this.ray.start.pointToAngle(angle, distance);
    return this.withStartPoint(newStart);
  }


  translateToLength(distance) {
    const newStart = this.ray.pointAtDistance(distance);
    return this.withStartPoint(newStart);
  }

  translatePerpendicular(distance, clockwise = true) {
    let perpendicular = this.ray.angle.perpendicular(clockwise);
    const newStart = this.ray.start.pointToAngle(perpendicular, distance);
    return this.withStartPoint(newStart);
  }

  // Returns `value` clamped to the given insets from zero and the length
  // of the segment.
  // TODO: invalid range could return a value centered in the insets! more visually congruent
  // If the `min/maxInset` values result in a contradictory range, the
  // returned value will comply with `minInset`.
  // TODO: needs update
  // clampToLengthInsets(value, startInset = 0, endInset = 0) {
  //   let clamped = value;
  //   clamped = Math.min(clamped, this.length() - endInset);
  //   // Comply at least with minClamp
  //   clamped = Math.max(clamped, startInset);
  //   return clamped;
  // }

  pointAtBisector() {
    return this.ray.pointAtDistance(this.length/2);
  }

  // TODO: needs update
  // projectedPoint(point) {
  //   let perpendicular = this.angle().perpendicular();
  //   return point.segmentToAngle(perpendicular, this.rac.arbitraryLength)
  //     .pointAtIntersectionWithSegment(this);
  // }

  // Returns the length of a segment from `start` to `point` being
  // projected in the segment. The returned length may be negative if the
  // projected point falls behind `start`.
  // TODO: needs update
  // lengthToProjectedPoint(point) {
  //   let projected = this.projectedPoint(point);
  //   let segment = this.start.segmentToPoint(projected);

  //   if (segment.length() < this.rac.equalityThreshold) {
  //     return 0;
  //   }

  //   let angleDiff = this.angle().subtract(segment.angle());
  //   if (angleDiff.turn <= 1/4 || angleDiff.turn > 3/4) {
  //     return segment.length();
  //   } else {
  //     return - segment.length();
  //   }
  // }

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


// Returns the slope of the segment, or `null` if the segment is part of a
// vertical line.
Segment.prototype.slope = function() {
  let dx = this.end.x - this.start.x;
  let dy = this.end.y - this.start.y;
  if (Math.abs(dx) < this.rac.equalityThreshold) {
    if(Math.abs(dy) < this.rac.equalityThreshold) {
      // Segment with equal end and start returns a default angle of 0
      // Equivalent slope is 0
      return 0;
    }
    return null;
  }

  return dy / dx;
};

// Returns the y-intercept, or `null` if the segment is part of a
// vertical line.
Segment.prototype.yIntercept = function() {
  let slope = this.slope();
  if (slope === null) {
    return null;
  }
  // y = mx + b
  // y - mx = b
  return this.start.y - slope * this.start.x;
};


Segment.prototype.pointAtX = function(x) {
  let slope = this.slope();
  if (slope === null) {
    return null;
  }

  let y = slope*x + this.yIntercept();
  return new Rac.Point(this.rac, x, y);
}


// Returns the intersecting point of `this` and `other`. Both segments are
// considered lines without endpoints.
Segment.prototype.pointAtIntersectionWithSegment = function(other) {
  // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  let a = this.slope();
  let b = other.slope();
  if (a === b) {
    // Parallel lines, no intersection
    return null;
  }

  let c = this.yIntercept();
  let d = other.yIntercept();

  if (a === null) { return other.pointAtX(this.start.x); }
  if (b === null) { return this.pointAtX(other.start.x); }

  let x = (d - c) / (a - b);
  let y = a * x + c;
  return new Rac.Point(this.rac, x, y);
};

Segment.prototype.pointAtLength = function(length) {
  return this.start.pointToAngle(this.angle(), length);
};

Segment.prototype.pointAtLengthRatio = function(lengthRatio) {
  let newLength = this.length() * lengthRatio;
  return this.start.pointToAngle(this.angle(), newLength);
};


// Returns a new segment from `end` with the given `length` with the same
// angle as `this`.
Segment.prototype.nextSegmentWithLength = function(length) {
  return this.end.segmentToAngle(this.angle(), length);
};

// Returns a new segment from `end` to the given `nextEnd`.
Segment.prototype.nextSegmentToPoint = function(nextEnd) {
  // TODO: needs update
  return new Segment(this.rac, this.end, nextEnd);
}

// Returns a new segment from `end` to the given `someAngle` and `distance`.
Segment.prototype.nextSegmentToAngle = function(someAngle, distance) {
  return this.end.segmentToAngle(someAngle, distance);
}


// Returns a new segment from `this.end`, with the same length, that is
// perpendicular to `this` in the `clockwise` orientation.
Segment.prototype.nextSegmentPerpendicular = function(clockwise = true) {
  let offset = this.start.subtractPoint(this.end);
  let newEnd = this.end.addPoint(offset.perpendicular(clockwise));
  return this.end.segmentToPoint(newEnd);
};


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

// Returns a segment from `this.start` to the intersection between `this`
// and `other`.
Segment.prototype.segmentToIntersectionWithSegment = function(other) {
  let end = this.pointAtIntersectionWithSegment(other);
  if (end === null) {
    return null;
  }
  // TODO: needs update
  return new Segment(this.rac, this.start, end);
};

Segment.prototype.nextSegmentToAngleShift = function(
  angleShift, distance, clockwise = true)
{
  let angle = this.reverseAngle().shift(angleShift, clockwise);
  return this.end.segmentToAngle(angle, distance);
};

Segment.prototype.oppositeWithHyp = function(hypotenuse, clockwise = true) {
  // cos = ady / hyp
  // acos can error if hypotenuse is smaller that length
  let radians = Math.acos(this.length() / hypotenuse);
  let angle = this.rac.Angle.fromRadians(radians);

  let hypSegment = this.reverse()
    .nextSegmentToAngleShift(angle, hypotenuse, !clockwise);
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

