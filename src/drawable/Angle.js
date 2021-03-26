'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


class Angle {

  constructor(rac, turn) {
    utils.assertExists(rac, turn);
    this.rac = rac;
    this.setTurn(turn);
  }


  setTurn(turn) {
    this.turn = turn % 1;
    if (this.turn < 0) {
      this.turn = (this.turn + 1) % 1;
    }
    return this;
  }

} // class Angle

module.exports = Angle;


Angle.fromRadians = function(rac, radians) {
  return new Angle(rac, radians / Rac.TAU);
};

// TODO: ambiguous? delete?
// Angle.fromPoint = function(rac, point) {
//   return Angle.fromRadians(rac, Math.atan2(point.y, point.x));
// };

// Angle.fromSegment = function(rac, segment) {
//   return segment.start.angleToPoint(rac, segment.end);
// };


// If `turn`` is zero returns 1 instead, otherwise returns `turn`.
Angle.prototype.turnOne = function() {
  if (this.turn === 0) { return 1; }
  return this.turn;
}

Angle.prototype.add = function(someAngle) {
  let other = this.rac.Angle.from(someAngle);
  return new Angle(this.rac, this.turn + other.turn);
};

Angle.prototype.sub = function(someAngle) {
  let other = this.rac.Angle.from(someAngle);
  return new Angle(this.rac, this.turn - other.turn);
};


// Returns the equivalent to `someAngle` shifted to have `this` as the
// origin, in the `clockwise` orientation.
//
// For angle at `0.1`, `shift(0.5)` will return a `0.6` angle.
// For a clockwise orientation, equivalent to `this + someAngle`.
Angle.prototype.shift = function(someAngle, clockwise = true) {
  let angle = this.rac.Angle.from(someAngle);
  return clockwise
    ? this.add(angle)
    : this.sub(angle);
};

// Returns the equivalent of `this` when `someOrigin` is considered the
// origin, in the `clockwise` orientation.
// TODO: add example and difference to shift
Angle.prototype.shiftToOrigin = function(someOrigin, clockwise) {
  let origin = this.rac.Angle.from(someOrigin);
  return origin.shift(this, clockwise);
};

// Returns `factor * turn`.
Angle.prototype.mult = function(factor) {
  return new Angle(this.rac, this.turn * factor);
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
Angle.prototype.multOne = function(factor) {
  return new Angle(this.rac, this.turnOne() * factor);
};

// Returns `this` adding half a turn.
Angle.prototype.inverse = function() {
  return this.add(Angle.inverse);
};

Angle.prototype.negative = function() {
  return new Angle(this.rac, -this.turn);
};

Angle.prototype.perpendicular = function(clockwise = true) {
  return this.shift(this.rac.Angle.square, clockwise);
};

// Returns an Angle that represents the distance from `this` to `someAngle`
// traveling in the `clockwise` orientation.
Angle.prototype.distance = function(someAngle, clockwise = true) {
  let other = this.rac.Angle.from(someAngle);
  let distance = other.sub(this);
  return clockwise
    ? distance
    : distance.negative();
};

Angle.prototype.radians = function() {
  return this.turn * Rac.TAU;
};

Angle.prototype.degrees = function() {
  return this.turn * 360;
};

