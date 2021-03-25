'use strict';


module.exports = function makeSegment(rac) {

  class RacSegment {

    constructor(start, end) {
      this.start = start;
      this.end = end;
    }

    copy() {
      return new RacSegment(this.start, this.end);
    }

    withAngleAdd(someAngle) {
      let newAngle = this.angle().add(someAngle);
      let newEnd = this.start.pointToAngle(newAngle, this.length());
      return new RacSegment(this.start, newEnd);
    }

    withAngleShift(someAngle, clockwise = true) {
      let newAngle = this.angle().shift(someAngle, clockwise);
      let newEnd = this.start.pointToAngle(newAngle, this.length());
      return new RacSegment(this.start, newEnd);
    }

    withStartExtended(length) {
      let newStart = this.reverse().nextSegmentWithLength(length).end;
      return new RacSegment(newStart, this.end);
    }

    withEndExtended(length) {
      let newEnd = this.nextSegmentWithLength(length).end;
      return new RacSegment(this.start, newEnd);
    }


    // Returns a new segment from `this.start`, with the same length, that is
    // perpendicular to `this` in the `clockwise` orientation.
    withPerpendicularAngle(clockwise = true) {
      return this.withAngleShift(rac.Angle.square, clockwise);
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
      return point.segmentToAngle(perpendicular, rac.arbitraryLength)
        .pointAtIntersectionWithSegment(this);
    }

    // Returns the length of a segment from `start` to `point` being
    // projected in the segment. The returned length may be negative if the
    // projected point falls behind `start`.
    lengthToProjectedPoint(point) {
      let projected = this.projectedPoint(point);
      let segment = this.start.segmentToPoint(projected);

      if (segment.length() < rac.equalityThreshold) {
        return 0;
      }

      let angleDiff = this.angle().substract(segment.angle());
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
      let angleDistance = angle.substract(this.angle());
      // [0 to 0.5) is considered clockwise
      // [0.5, 1) is considered counter-clockwise
      return angleDistance.turn < 0.5;
    }

  } // RacSegment


  RacSegment.prototype.withStart = function(newStart) {
    return new RacSegment(newStart, this.end);
  };

  RacSegment.prototype.withEnd = function(newEnd) {
    return new RacSegment(this.start, newEnd);
  };

  RacSegment.prototype.withLength = function(newLength) {
    let newEnd = this.start.pointToAngle(this.angle(), newLength);
    return new RacSegment(this.start, newEnd);
  };

  RacSegment.prototype.pointAtBisector = function() {
    return new rac.Point(
      this.start.x + (this.end.x - this.start.x) /2,
      this.start.y + (this.end.y - this.start.y) /2);
  };

  RacSegment.prototype.length = function() {
    return this.start.distanceToPoint(this.end);
  };

  RacSegment.prototype.angle = function() {
    return rac.Angle.fromSegment(this);
  };

  // Returns the slope of the segment, or `null` if the segment is part of a
  // vertical line.
  RacSegment.prototype.slope = function() {
    let dx = this.end.x - this.start.x;
    let dy = this.end.y - this.start.y;
    if (Math.abs(dx) < rac.equalityThreshold) {
      if(Math.abs(dy) < rac.equalityThreshold) {
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
  RacSegment.prototype.yIntercept = function() {
    let slope = this.slope();
    if (slope === null) {
      return null;
    }
    // y = mx + b
    // y - mx = b
    return this.start.y - slope * this.start.x;
  };


  RacSegment.prototype.pointAtX = function(x) {
    let slope = this.slope();
    if (slope === null) {
      return null;
    }

    let y = slope*x + this.yIntercept();
    return new rac.Point(x, y);
  }

  RacSegment.prototype.reverseAngle = function() {
    return rac.Angle.fromSegment(this).inverse();
  };

  RacSegment.prototype.reverse = function() {
    return new RacSegment(this.end, this.start);
  };

  // Translates the segment by the entire `point`, or by the given `x` and
  // `y` components.
  RacSegment.prototype.translate = function(point, y = undefined) {
    if (point instanceof rac.Point && y === undefined) {
      return new RacSegment(
        this.start.add(point),
        this.end.add(point));
    }

    if (typeof point === "number" && typeof y === "number") {
      let x = point;
      return new RacSegment(
        this.start.add(x, y),
        this.end.add(x, y));
    }

    console.trace(`Invalid parameter combination - point-type:${rac.typeName(point)} y-type:${rac.typeName(y)}`);
    throw rac.Error.invalidParameterCombination;
  }

  RacSegment.prototype.translateToStart = function(newStart) {
    let offset = newStart.substract(this.start);
    return new RacSegment(this.start.add(offset), this.end.add(offset));
  };

  RacSegment.prototype.translateToAngle = function(someAngle, distance) {
    let angle = rac.Angle.from(someAngle);
    let offset = rac.Point.zero.pointToAngle(angle, distance);
    return new RacSegment(this.start.add(offset), this.end.add(offset));
  };

  RacSegment.prototype.translateToLength = function(distance) {
    let offset = rac.Point.zero.pointToAngle(this.angle(), distance);
    return new RacSegment(this.start.add(offset), this.end.add(offset));
  };

  RacSegment.prototype.translatePerpendicular = function(distance, clockwise = true) {
    let perpendicular = this.angle().perpendicular(clockwise);
    return this.translateToAngle(perpendicular, distance);
  };

  // Returns the intersecting point of `this` and `other`. Both segments are
  // considered lines without endpoints.
  RacSegment.prototype.pointAtIntersectionWithSegment = function(other) {
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
    return new rac.Point(x, y);
  };

  RacSegment.prototype.pointAtLength = function(length) {
    return this.start.pointToAngle(this.angle(), length);
  };

  RacSegment.prototype.pointAtLengthRatio = function(lengthRatio) {
    let newLength = this.length() * lengthRatio;
    return this.start.pointToAngle(this.angle(), newLength);
  };

  // Returns a new segment from `start` to `pointAtBisector`.
  RacSegment.prototype.segmentToBisector = function() {
    return new RacSegment(this.start, this.pointAtBisector());
  };

  // Returns a new segment from `start` to a length determined by
  // `ratio*length`.
  RacSegment.prototype.withLengthRatio = function(ratio) {
    return this.start.segmentToAngle(this.angle(), this.length() * ratio);
  };

  // Returns a new segment from `end` with the given `length` with the same
  // angle as `this`.
  RacSegment.prototype.nextSegmentWithLength = function(length) {
    return this.end.segmentToAngle(this.angle(), length);
  };

  // Returns a new segment from `end` to the given `nextEnd`.
  RacSegment.prototype.nextSegmentToPoint = function(nextEnd) {
    return new RacSegment(this.end, nextEnd);
  }

  // Returns a new segment from `end` to the given `someAngle` and `distance`.
  RacSegment.prototype.nextSegmentToAngle = function(someAngle, distance) {
    return this.end.segmentToAngle(someAngle, distance);
  }


  // Returns a new segment from `this.end`, with the same length, that is
  // perpendicular to `this` in the `clockwise` orientation.
  // TODO: rename to nextPerpendicularSegment?
  RacSegment.prototype.nextSegmentPerpendicular = function(clockwise = true) {
    let offset = this.start.add(this.end.negative());
    let newEnd = this.end.add(offset.perpendicular(clockwise));
    return this.end.segmentToPoint(newEnd);
  };

  // Returns an complete circle Arc using this segment `start` as center,
  // `length()` as radiusm, and `angle()` as start and end angles.
  RacSegment.prototype.arc = function(clockwise = true) {
    let angle = this.angle();
    return new rac.Arc(
      this.start, this.length(),
      angle, angle,
      clockwise);
  };

  // Returns an Arc using this segment `start` as center, `length()` as
  // radius, starting from the `angle()` to the given angle and orientation.
  RacSegment.prototype.arcWithEnd = function(
    someAngleEnd = this.angle(),
    clockwise = true)
  {
    let arcEnd = rac.Angle.from(someAngleEnd);
    let arcStart = rac.Angle.fromSegment(this);
    return new rac.Arc(
      this.start, this.length(),
      arcStart, arcEnd,
      clockwise);
  };

  // Returns an Arc using this segment `start` as center, `length()` as
  // radius, starting from the `angle()` to the arc distance of the given
  // angle and orientation.
  RacSegment.prototype.arcWithAngleDistance = function(someAngleDistance, clockwise = true) {
    let angleDistance = rac.Angle.from(someAngleDistance);
    let arcStart = this.angle();
    let arcEnd = arcStart.shift(angleDistance, clockwise);

    return new rac.Arc(
      this.start, this.length(),
      arcStart, arcEnd,
      clockwise);
  };

  // Returns a segment from `this.start` to the intersection between `this`
  // and `other`.
  RacSegment.prototype.segmentToIntersectionWithSegment = function(other) {
    let end = this.pointAtIntersectionWithSegment(other);
    if (end === null) {
      return null;
    }
    return new RacSegment(this.start, end);
  };

  RacSegment.prototype.nextSegmentToAngleShift = function(
    angleShift, distance, clockwise = true)
  {
    let angle = this.reverseAngle().shift(angleShift, clockwise);
    return this.end.segmentToAngle(angle, distance);
  };

  RacSegment.prototype.oppositeWithHyp = function(hypotenuse, clockwise = true) {
    // cos = ady / hyp
    // acos can error if hypotenuse is smaller that length
    let radians = Math.acos(this.length() / hypotenuse);
    let angle = rac.Angle.fromRadians(radians);

    let hypSegment = this.reverse()
      .nextSegmentToAngleShift(angle, hypotenuse, !clockwise);
    return this.end.segmentToPoint(hypSegment.end);
  };

  // Returns a new segment that starts from `pointAtBisector` in the given
  // `clockwise` orientation.
  RacSegment.prototype.segmentFromBisector = function(length, clockwise = true) {
    let angle = clockwise
      ? this.angle().add(rac.Angle.square)
      : this.angle().add(rac.Angle.square.negative());
    return this.pointAtBisector().segmentToAngle(angle, length);
  };

  RacSegment.prototype.bezierCentralAnchor = function(distance, clockwise = true) {
    let bisector = this.segmentFromBisector(distance, clockwise);
    return new rac.Bezier(
      this.start, bisector.end,
      bisector.end, this.end);
  };


  return RacSegment;

} // makeSegment

