'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Angle measured by a `turn` value in the range `[0,1)` that represents the
* amount of turn in a full circle.
*
* When drawing an angle of turn `0` points towards the right of the screen.
* An angle of turn `1/4` points downwards, turn `1/2` towards the left,
* `3/4` points upwards.
*
* @alias Rac.Angle
*/
class Angle {

  /**
  * Creates a new `Angle` instance.
  *
  * The `turn` value is constrained to the rance `[0, 1)`, any value
  * outside is reduced back into range using a modulo operation.
  *
  * ```
  * new Rac.Angle(rac, 1/4)  // turn is 1/4
  * new Rac.Angle(rac, 5/4)  // turn is 1/4
  * new Rac.Angle(rac, -1/4) // turn is 3/4
  * new Rac.Angle(rac, 1)    // turn is 0
  * new Rac.Angle(rac, 4)    // turn is 0
  * ```
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} turn - The turn value
  */
  constructor(rac, turn) {
    utils.assertExists(rac);
    utils.assertNumber(turn);

    /**
    * Intance of `Rac` used for drawing and passed along to any created
    * object.
    * @type {Rac}
    */
    this.rac = rac;

    turn = turn % 1;
    if (turn < 0) {
      turn = (turn + 1) % 1;
    }

    /**
    * Turn value of the angle, constrained to the range `[0, 1)`.
    * @type {number}
    */
    this.turn = turn;
  }

  /**
  * Returns a string representation intended for human consumption.
  * @param {number} [digits] - The number of digits to appear after the
  * decimal point, when ommited all digits are printed.
  * @returns {string}
  */
  toString(digits = null) {
    let turnString = digits === null
      ? this.turn.toString()
      : this.turn.toFixed(digits);
    return `Angle(${turnString})`;
  }

  /**
  * Returns `true` when the difference with the `turn` value of the angle
  * derived {@link Rac.Angle.from from} `someAngle` is under
  * `{@link Rac#unitaryEqualityThreshold}`, otherwise returns `false`.
  *
  * This method will consider turn values in the oposite ends of the range
  * `[0, 1)` as equals. `Angle` objects with `turn` values of `0` and
  * `1 - rac.unitaryEqualityThreshold/2` will be considered equal.
  *
  * @param {Rac.Angle|number} someAngle - An `Angle` to compare
  * @returns {boolean}
  */
  equals(someAngle) {
    const other = Angle.from(this.rac, someAngle);
    const diff = Math.abs(this.turn - other.turn);
    return diff < this.rac.unitaryEqualityThreshold
      // For close values that loop around
      || (1 - diff) < this.rac.unitaryEqualityThreshold;
  }


  /**
  * Returns an `Angle` derived from `something`.
  *
  * + When `something` is an instance of `Angle`, returns that same object.
  * + When `something` is a `number`, returns a new `Angle` with
  *   `something` as `turn`.
  * + When `something` is a `{@link Rac.Ray}`, returns its angle.
  * + When `something` is a `{@link Rac.Segment}`, returns its angle.
  * + Otherwise an error is thrown.
  *
  * @param {Rac} rac Instance to pass along to newly created objects
  * @param {Rac.Angle|Rac.Ray|Rac.Segment|number} something - An object to
  * derive an `Angle` from
  * @returns {Rac.Angle}
  */
  static from(rac, something) {
    if (something instanceof Rac.Angle) {
      return something;
    }
    if (typeof something === 'number') {
      return new Angle(rac, something);
    }
    if (something instanceof Rac.Ray) {
      return something.angle;
    }
    if (something instanceof Rac.Segment) {
      return something.ray.angle;
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Angle - something-type:${utils.typeName(something)}`);
  }

  /**
  * Returns an `Angle` derived from `radians`.
  *
  * @param {Rac} rac Instance to pass along to newly created objects
  * @param {number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  */
  static fromRadians(rac, radians) {
    return new Angle(rac, radians / Rac.TAU);
  }

  /**
  * Returns the measure of the angle in radians.
  * @returns {number}
  */
  radians() {
    return this.turn * Rac.TAU;
  }

  /**
  * Returns the measure of the angle in degrees.
  * @returns {number}
  */
  degrees() {
    return this.turn * 360;
  }

} // class Angle


module.exports = Angle;


// If `turn`` is zero returns 1 instead, otherwise returns `turn`.
Angle.prototype.turnOne = function() {
  if (this.turn === 0) { return 1; }
  return this.turn;
}

Angle.prototype.add = function(someAngle) {
  let other = this.rac.Angle.from(someAngle);
  return new Angle(this.rac, this.turn + other.turn);
};

Angle.prototype.subtract = function(someAngle) {
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
    : this.subtract(angle);
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
  return this.add(this.rac.Angle.inverse);
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
  let distance = other.subtract(this);
  return clockwise
    ? distance
    : distance.negative();
};



