'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Angle measured with a `turn` value in the range *[0,1)* that represents
* the amount of turn in a full circle.
*
* Most functions through RAC that can receive an `Angle` parameter can
* also receive a `number` value that will be used as `turn` to instantiate
* a new `Angle`. The main exception to this behaviour are constructors,
* which always expect to receive `Angle` objects.
*
* For drawing operations the turn value is interpreted to be pointing to
* the following directions:
* ```
* rac.Angle(0/4) // points right
* rac.Angle(1/4) // points downwards
* rac.Angle(2/4) // points left
* rac.Angle(3/4) // points upwards
* ```
*
* @alias Rac.Angle
*/
class Angle {

  /**
  * Creates a new `Angle` instance.
  *
  * The `turn` value is constrained to the range *[0,1)*, any value
  * outside is reduced back into range using a modulo operation.
  *
  * @example
  * (new Rac.Angle(rac, 1/4)) .turn // returns 1/4
  * (new Rac.Angle(rac, 5/4)) .turn // returns 1/4
  * (new Rac.Angle(rac, -1/4)).turn // returns 3/4
  * (new Rac.Angle(rac, 1))   .turn // returns 0
  * (new Rac.Angle(rac, 4))   .turn // returns 0
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} turn - The turn value
  */
  constructor(rac, turn) {
    // TODO: changed to assertType, add tests
    utils.assertType(Rac, rac);
    utils.assertNumber(turn);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    turn = turn % 1;
    if (turn < 0) {
      turn = (turn + 1) % 1;
    }

    /**
    * Turn value of the angle, constrained to the range *[0,1)*.
    * @type {number}
    */
    this.turn = turn;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * // returns 'Angle(0.2)'
  * rac.Angle(0.2)).toString()
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const turnStr = utils.cutDigits(this.turn, digits);
    return `Angle(${turnStr})`;
  }


  /**
  * Returns `true` when the difference with the `turn` value of the angle
  * derived [from]{@link Rac.Angle.from} `angle` is under
  * `{@link Rac#unitaryEqualityThreshold}`; otherwise returns `false`.
  *
  * For this method `otherAngle` can only be `Angle` or `number`, any other
  * type returns `false`.
  *
  * This method will consider turn values in the oposite ends of the range
  * *[0,1)* as equals. E.g. `Angle` objects with `turn` values of `0` and
  * `1 - rac.unitaryEqualityThreshold/2` will be considered equal.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to compare
  * @returns {boolean}
  *
  * @see Rac.Angle.from
  */
  equals(otherAngle) {
    if (otherAngle instanceof Rac.Angle) {
      // all good!
    } else if (typeof otherAngle === 'number') {
      otherAngle = Angle.from(this.rac, otherAngle);
    } else {
      return false;
    }

    const diff = Math.abs(this.turn - otherAngle.turn);
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
  * @param {Rac} rac - Instance to pass along to newly created objects
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
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  */
  static fromRadians(rac, radians) {
    return new Angle(rac, radians / Rac.TAU);
  }


  /**
  * Returns an `Angle` derived from `degrees`.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {number} degrees - The measure of the angle, in degrees
  * @returns {Rac.Angle}
  */
  static fromDegrees(rac, degrees) {
    return new Angle(rac, degrees / 360);
  }


  /**
  * Returns a new `Angle` pointing in the opposite direction to `this`.
  *
  * @example
  * // returns 3/8, since 1/8 + 1/2 = 5/8
  * rac.Angle(1/8).inverse().turn
  * // returns 3/8, since 7/8 + 1/2 = 3/8
  * rac.Angle(7/8).inverse().turn
  *
  * @returns {Rac.Angle}
  */
  inverse() {
    return this.add(this.rac.Angle.inverse);
  }


  /**
  * Returns a new `Angle` with a turn value equivalent to `-turn`.
  *
  * @example
  * // returns 3/4, since -1/4 mod 1 = 3/4
  * rac.Angle(1/4).negative().turn
  * // returns 5/8, since -3/8 mod 1 = 5/8
  * rac.Angle(3/8).negative().turn
  *
  * @returns {Rac.Angle}
  */
  negative() {
    return new Angle(this.rac, -this.turn);
  }


  /**
  * Returns a new `Angle` which is perpendicular to `this` in the
  * `clockwise` orientation.
  *
  * @example
  * // returns 3/8, since 1/8 + 1/4 = 3/8
  * rac.Angle(1/8).perpendicular(true).turn
  * // returns 7/8, since 1/8 - 1/4 = 7/8
  * rac.Angle(1/8).perpendicular(false).turn
  *
  * @returns {Rac.Angle}
  */
  perpendicular(clockwise = true) {
    return this.shift(this.rac.Angle.square, clockwise);
  }


  /**
  * Returns the measure of the angle in radians.
  *
  * @returns {number}
  */
  radians() {
    return this.turn * Rac.TAU;
  }


  /**
  * Returns the measure of the angle in degrees.
  *
  * @returns {number}
  */
  degrees() {
    return this.turn * 360;
  }


  /**
  * Returns the sine of `this`.
  *
  * @returns {number}
  */
  sin() {
    return Math.sin(this.radians())
  }


  /**
  * Returns the cosine of `this`.
  *
  * @returns {number}
  */
  cos() {
    return Math.cos(this.radians())
  }


  /**
  * Returns the tangent of `this`.
  *
  * @returns {number}
  */
  tan() {
    return Math.tan(this.radians())
  }


  /**
  * Returns the `turn` value in the range `(0, 1]`. When `turn` is equal to
  * `0` returns `1` instead.
  *
  * @returns {number}
  */
  turnOne() {
    if (this.turn === 0) { return 1; }
    return this.turn;
  }


  /**
  * Returns a new `Angle` with the sum of `this` and the angle derived from
  * `angle`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to add
  * @returns {Rac.Angle}
  */
  add(angle) {
    angle = this.rac.Angle.from(angle);
    return new Angle(this.rac, this.turn + angle.turn);
  }


  /**
  * Returns a new `Angle` with the angle derived from `angle`
  * subtracted to `this`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to subtract
  * @returns {Rac.Angle}
  */
  subtract(angle) {
    angle = this.rac.Angle.from(angle);
    return new Angle(this.rac, this.turn - angle.turn);
  }


  /**
  * Returns a new `Angle` with `turn` set to `this.turn * factor`.
  *
  * @param {number} factor - The factor to multiply `turn` by
  * @returns {Rac.Angle}
  */
  mult(factor) {
    return new Angle(this.rac, this.turn * factor);
  }


  /**
  * Returns a new `Angle` with `turn` set to
  * `{@link Rac.Angle#turnOne this.turnOne()} * factor`.
  *
  * Useful when doing ratio calculations where a zero angle corresponds to
  * a complete-circle.
  *
  * @example
  * rac.Angle(0).mult(0.5).turn    // returns 0
  * // whereas
  * rac.Angle(0).multOne(0.5).turn // returns 0.5
  *
  * @param {number} factor - The factor to multiply `turn` by
  * @returns {number}
  */
  multOne(factor) {
    return new Angle(this.rac, this.turnOne() * factor);
  }

  /**
  * Returns a new `Angle` that represents the distance from `this` to the
  * angle derived from `angle`.
  *
  * @example
  * rac.Angle(1/4).distance(1/2, true) .turn // returns 1/2
  * rac.Angle(1/4).distance(1/2, false).turn // returns 3/4
  *
  * @param {Rac.Angle|number} angle - An `Angle` to measure the distance to
  * @param {boolean} [clockwise=true] - The orientation of the measurement
  * @returns {Rac.Angle}
  */
  distance(angle, clockwise = true) {
    angle = this.rac.Angle.from(angle);
    const distance = angle.subtract(this);
    return clockwise
      ? distance
      : distance.negative();
  }

  /**
  * Returns a new `Angle` result of shifting the angle derived from
  * `angle` to have `this` as its origin.
  *
  * This operation is the equivalent to
  * + `this.add(angle)` when clockwise
  * + `this.subtract(angle)` when counter-clockwise
  *
  * @example
  * // returns 0.4, since 0.1 + 0.3 = 0.4
  * rac.Angle(0.1).shift(0.3, true).turn
  * // returns 0.8, since 0.1 - 0.3 = 0.8
  * rac.Angle(0.1).shift(0.3, false).turn
  *
  * @param {Rac.Angle|number} angle - An `Angle` to be shifted
  * @param {boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Angle}
  */
  shift(angle, clockwise = true) {
    angle = this.rac.Angle.from(angle);
    return clockwise
      ? this.add(angle)
      : this.subtract(angle);
  }


  /**
  * Returns a new `Angle` result of shifting `this` to have the angle
  * derived from `origin` as its origin.
  *
  * The result of `angle.shiftToOrigin(origin)` is equivalent to
  * `origin.shift(angle)`.
  *
  * This operation is the equivalent to
  * + `origin.add(this)` when clockwise
  * + `origin.subtract(this)` when counter-clockwise
  *
  * @example
  * // returns 0.4, since 0.3 + 0.1 = 0.4
  * rac.Angle(0.1).shiftToOrigin(0.3, true).turn
  * // returns 0.2, since 0.3 - 0.1 = 0.2
  * rac.Angle(0.1).shiftToOrigin(0.3, false).turn
  *
  * @param {Rac.Angle|number} origin - An `Angle` to use as origin
  * @param {boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Angle}
  */
  shiftToOrigin(origin, clockwise) {
    origin = this.rac.Angle.from(origin);
    return origin.shift(this, clockwise);
  }

} // class Angle


module.exports = Angle;

