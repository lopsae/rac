'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Line segment between two points.
* @alias Rac.Segment
*/
class Segment {

  constructor(rac, start, end) {
    // TODO: || throw new Error(err.missingParameters)
    utils.assertExists(rac, start, end);
    this.rac = rac;
    this.start = start;
    this.end = end;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Segment((${this.start.x},${this.start.y}),(${this.end.x},${this.end.y}))`;
  }

  copy() {
    return new Segment(this.rac, this.start, this.end);
  }

  withAngleAdd(someAngle) {
    let newAngle = this.angle().add(someAngle);
    let newEnd = this.start.pointToAngle(newAngle, this.length());
    return new Segment(this.rac, this.start, newEnd);
  }

  withAngleShift(someAngle, clockwise = true) {
    let newAngle = this.angle().shift(someAngle, clockwise);
    let newEnd = this.start.pointToAngle(newAngle, this.length());
    return new Segment(this.rac, this.start, newEnd);
  }

  withStartExtended(length) {
    let newStart = this.reverse().nextSegmentWithLength(length).end;
    return new Segment(this.rac, newStart, this.end);
  }

  withEndExtended(length) {
    let newEnd = this.nextSegmentWithLength(length).end;
    return new Segment(this.rac, this.start, newEnd);
  }


  // Returns a new segment from `this.start`, with the same length, that is
  // perpendicular to `this` in the `clockwise` orientation.
  withPerpendicularAngle(clockwise = true) {
    return this.withAngleShift(this.rac.Angle.square, clockwise);
  };

  // Returns `value` clamped to the given insets from zero and the length
  // of the segment.
  // TODO: invalid range could return a value centered in the insets! more visually congruent
  // If the `min/maxInset` values result in a contradictory range, the
  // returned value will comply with `minInset`.
  clampToLengthInsets(value, startInset = 0, endInset = 0) {
    let clamped = value;
    clamped = Math.min(clamped, this.length() - endInset);
    // Comply at least with minClamp
    clamped = Math.max(clamped, startInset);
    return clamped;
  }

  projectedPoint(point) {
    let perpendicular = this.angle().perpendicular();
    return point.segmentToAngle(perpendicular, this.rac.arbitraryLength)
      .pointAtIntersectionWithSegment(this);
  }

  // Returns the length of a segment from `start` to `point` being
  // projected in the segment. The returned length may be negative if the
  // projected point falls behind `start`.
  lengthToProjectedPoint(point) {
    let projected = this.projectedPoint(point);
    let segment = this.start.segmentToPoint(projected);

    if (segment.length() < this.rac.equalityThreshold) {
      return 0;
    }

    let angleDiff = this.angle().sub(segment.angle());
    if (angleDiff.turn <= 1/4 || angleDiff.turn > 3/4) {
      return segment.length();
    } else {
      return - segment.length();
    }
  }

  // Returns `true` if the given point is located clockwise of the segment,
  // or `false` if located counter-clockwise.
  pointOrientation(point) {
    let angle = this.start.angleToPoint(point);
    let angleDistance = angle.sub(this.angle());
    // [0 to 0.5) is considered clockwise
    // [0.5, 1) is considered counter-clockwise
    return angleDistance.turn < 0.5;
  }

} // Segment


module.exports = Segment;


Segment.prototype.withStart = function(newStart) {
  return new Segment(this.rac, newStart, this.end);
};

Segment.prototype.withEnd = function(newEnd) {
  return new Segment(this.rac, this.start, newEnd);
};

Segment.prototype.withLength = function(newLength) {
  let newEnd = this.start.pointToAngle(this.angle(), newLength);
  return new Segment(this.rac, this.start, newEnd);
};

Segment.prototype.pointAtBisector = function() {
  return new Rac.Point(this.rac,
    this.start.x + (this.end.x - this.start.x) /2,
    this.start.y + (this.end.y - this.start.y) /2);
};

Segment.prototype.length = function() {
  return this.start.distanceToPoint(this.end);
};

Segment.prototype.angle = function() {
  return this.start.angleToPoint(this.end);
};

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

Segment.prototype.reverseAngle = function() {
  return this.angle().inverse();
};

Segment.prototype.reverse = function() {
  return new Segment(this.rac, this.end, this.start);
};

// Translates the segment by the entire `point`, or by the given `x` and
// `y` components.
Segment.prototype.translate = function(point, y = undefined) {
  if (point instanceof Rac.Point && y === undefined) {
    return new Segment(this.rac,
      this.start.addPoint(point),
      this.end.addPoint(point));
  }

  if (typeof point === "number" && typeof y === "number") {
    let x = point;
    return new Segment(this.rac,
      this.start.add(x, y),
      this.end.add(x, y));
  }

  console.trace(`Invalid parameter combination - point-type:${utils.typeName(point)} y-type:${utils.typeName(y)}`);
  throw this.rac.Error.invalidParameterCombination;
}

Segment.prototype.translateToStart = function(newStart) {
  let offset = newStart.subPoint(this.start);
  let transStart = this.start.addPoint(offset);
  let transEnd = this.end.addPoint(offset)
  return new Segment(this.rac, transStart, transEnd);
};

Segment.prototype.translateToAngle = function(someAngle, distance) {
  let angle = this.rac.Angle.from(someAngle);
  let offset = this.rac.Point.zero.pointToAngle(angle, distance);
  let transStart = this.start.addPoint(offset);
  let transEnd = this.end.addPoint(offset)
  return new Segment(this.rac, transStart, transEnd);
};

Segment.prototype.translateToLength = function(distance) {
  let offset = this.rac.Point.zero.pointToAngle(this.angle(), distance);
  return new Segment(this.rac, this.start.add(offset), this.end.add(offset));
};

Segment.prototype.translatePerpendicular = function(distance, clockwise = true) {
  let perpendicular = this.angle().perpendicular(clockwise);
  return this.translateToAngle(perpendicular, distance);
};

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

// Returns a new segment from `start` to `pointAtBisector`.
Segment.prototype.segmentToBisector = function() {
  return new Segment(this.rac, this.start, this.pointAtBisector());
};

// Returns a new segment from `start` to a length determined by
// `ratio*length`.
Segment.prototype.withLengthRatio = function(ratio) {
  return this.start.segmentToAngle(this.angle(), this.length() * ratio);
};

// Returns a new segment from `end` with the given `length` with the same
// angle as `this`.
Segment.prototype.nextSegmentWithLength = function(length) {
  return this.end.segmentToAngle(this.angle(), length);
};

// Returns a new segment from `end` to the given `nextEnd`.
Segment.prototype.nextSegmentToPoint = function(nextEnd) {
  return new Segment(this.rac, this.end, nextEnd);
}

// Returns a new segment from `end` to the given `someAngle` and `distance`.
Segment.prototype.nextSegmentToAngle = function(someAngle, distance) {
  return this.end.segmentToAngle(someAngle, distance);
}


// Returns a new segment from `this.end`, with the same length, that is
// perpendicular to `this` in the `clockwise` orientation.
// TODO: rename to nextPerpendicularSegment?
Segment.prototype.nextSegmentPerpendicular = function(clockwise = true) {
  let offset = this.start.subPoint(this.end);
  let newEnd = this.end.addPoint(offset.perpendicular(clockwise));
  return this.end.segmentToPoint(newEnd);
};

// Returns an complete circle Arc using this segment `start` as center,
// `length()` as radiusm, and `angle()` as start and end angles.
Segment.prototype.arc = function(clockwise = true) {
  let angle = this.angle();
  return new Rac.Arc(this.rac,
    this.start, this.length(),
    angle, angle,
    clockwise);
};

// Returns an Arc using this segment `start` as center, `length()` as
// radius, starting from the `angle()` to the given angle and orientation.
Segment.prototype.arcWithEnd = function(
  someAngleEnd = this.angle(),
  clockwise = true)
{
  let arcEnd = this.rac.Angle.from(someAngleEnd);
  let arcStart = this.angle();
  return new Rac.Arc(this.rac,
    this.start, this.length(),
    arcStart, arcEnd,
    clockwise);
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

