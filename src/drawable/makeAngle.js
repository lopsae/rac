'use strict';


module.exports = function makeAngle(rac) {

  let RacAngle = function RacAngle(turn) {
    this.setTurn(turn);
  };

  RacAngle.from = function(something) {
    if (something instanceof RacAngle) {
      return something;
    }
    if (typeof something === "number") {
      return new RacAngle(something);
    }
    if (something instanceof rac.Segment) {
      return something.angle();
    }

    console.trace(`Cannot convert to rac.Angle - something-type:${rac.typeName(something)}`);
    throw rac.Error.invalidObjectToConvert;
  }

  RacAngle.fromRadians = function(radians) {
    return new RacAngle(radians / rac.TAU);
  };

  RacAngle.fromPoint = function(point) {
    return RacAngle.fromRadians(Math.atan2(point.y, point.x));
  };

  RacAngle.fromSegment = function(segment) {
    return segment.start.angleToPoint(segment.end);
  };

  RacAngle.prototype.setTurn = function(turn) {
    this.turn = turn % 1;
    if (this.turn < 0) {
      this.turn = (this.turn + 1) % 1;
    }
    return this;
  };

  // If `turn`` is zero returns 1 instead, otherwise returns `turn`.
  RacAngle.prototype.turnOne = function() {
    if (this.turn === 0) { return 1; }
    return this.turn;
  }

  RacAngle.prototype.add = function(someAngle) {
    let other = RacAngle.from(someAngle);
    return new RacAngle(this.turn + other.turn);
  };

  RacAngle.prototype.substract = function(someAngle) {
    let other = RacAngle.from(someAngle);
    return new RacAngle(this.turn - other.turn);
  };

  RacAngle.prototype.sub = function(someAngle) {
    return this.substract(someAngle);
  };

  // Returns the equivalent to `someAngle` shifted to have `this` as the
  // origin, in the `clockwise` orientation.
  //
  // For angle at `0.1`, `shift(0.5)` will return a `0.6` angle.
  // For a clockwise orientation, equivalent to `this + someAngle`.
  RacAngle.prototype.shift = function(someAngle, clockwise = true) {
    let angle = RacAngle.from(someAngle);
    return clockwise
      ? this.add(angle)
      : this.sub(angle);
  };

  // Returns the equivalent of `this` when `someOrigin` is considered the
  // origin, in the `clockwise` orientation.
  RacAngle.prototype.shiftToOrigin = function(someOrigin, clockwise) {
    let origin = RacAngle.from(someOrigin);
    return origin.shift(this, clockwise);
  };

  // Returns `factor * turn`.
  RacAngle.prototype.mult = function(factor) {
    return new RacAngle(this.turn * factor);
  };

  // Returns `factor * turnOne()`, where `turn` is considered in the
  // range (0, 1].
  // Useful when doing ratio calculation where a zero angle corresponds to
  // a complete-circle since:
  // ```
  // rac.Angle(0).mult(0.5) // returns rac.Angle(0)
  // // whereas
  // rac.Angle(0).multOne(0.5) // return rac.Angle(0.5)
  // ```
  RacAngle.prototype.multOne = function(factor) {
    return new RacAngle(this.turnOne() * factor);
  };

  // Returns `this` adding half a turn.
  RacAngle.prototype.inverse = function() {
    return this.add(RacAngle.inverse);
  };

  RacAngle.prototype.negative = function() {
    return new RacAngle(-this.turn);
  };

  RacAngle.prototype.perpendicular = function(clockwise = true) {
    return this.shift(RacAngle.square, clockwise);
  };

  // Returns an Angle that represents the distance from `this` to `someAngle`
  // traveling in the `clockwise` orientation.
  RacAngle.prototype.distance = function(someAngle, clockwise = true) {
    let other = RacAngle.from(someAngle);
    let distance = other.substract(this);
    return clockwise
      ? distance
      : distance.negative();
  };

  RacAngle.prototype.radians = function() {
    return this.turn * rac.TAU;
  };

  RacAngle.prototype.degrees = function() {
    return this.turn * 360;
  };

  RacAngle.zero =    new RacAngle(0.0);
  RacAngle.square =  new RacAngle(1/4);
  RacAngle.inverse = new RacAngle(1/2);

  RacAngle.half =    new RacAngle(1/2);
  RacAngle.quarter = new RacAngle(1/4);
  RacAngle.eighth =  new RacAngle(1/8);

  RacAngle.e = new RacAngle(0/4);
  RacAngle.s = new RacAngle(1/4);
  RacAngle.w = new RacAngle(2/4);
  RacAngle.n = new RacAngle(3/4);

  RacAngle.east  = RacAngle.e;
  RacAngle.south = RacAngle.s;
  RacAngle.west  = RacAngle.w;
  RacAngle.north = RacAngle.n;

  RacAngle.ne = RacAngle.n.add(1/8);
  RacAngle.se = RacAngle.e.add(1/8);
  RacAngle.sw = RacAngle.s.add(1/8);
  RacAngle.nw = RacAngle.w.add(1/8);

  RacAngle.nne = RacAngle.ne.add(-1/16);
  RacAngle.ene = RacAngle.ne.add(+1/16);
  RacAngle.nen = RacAngle.nne;
  RacAngle.nee = RacAngle.ene;

  RacAngle.ese = RacAngle.se.add(-1/16);
  RacAngle.sse = RacAngle.se.add(+1/16);
  RacAngle.ese = RacAngle.see;
  RacAngle.sse = RacAngle.ses;

  RacAngle.ssw = RacAngle.sw.add(-1/16);
  RacAngle.wsw = RacAngle.sw.add(+1/16);
  RacAngle.ssw = RacAngle.sws;
  RacAngle.wsw = RacAngle.sww;

  RacAngle.wnw = RacAngle.nw.add(-1/16);
  RacAngle.nnw = RacAngle.nw.add(+1/16);
  RacAngle.wnw = RacAngle.nww;
  RacAngle.nnw = RacAngle.nwn;

  RacAngle.right = RacAngle.e;
  RacAngle.down  = RacAngle.s;
  RacAngle.left  = RacAngle.w;
  RacAngle.up    = RacAngle.n;


  return RacAngle;

} // makeAngle

