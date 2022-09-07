'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


const TextFormat = require('./Text.Format')


/**
* String, position and [format]{@link Rac.Text.Format} to draw a text.
*
* An instance of this object contains the string and a `Point` used to
* determine the location of the drawn text. The
* [`Text.Format`]{@link Rac.Text.Format} object determines the font, size,
* orientation angle, and the alignment relative to `point` to draw the text.
*
* @alias Rac.Text
*/
class Text {

  static Format = TextFormat;

  // RELEASE-TODO: document
  constructor(rac, point, string, format) {
    utils.assertType(Rac, rac);
    utils.assertType(Rac.Point, point);
    utils.assertString(string);
    utils.assertType(Text.Format, format);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The location where the text will be drawn.
    *
    * The text will be drawn relative to this point based on the
    * alignment and angle configuration of
    * [`format`]{@link Rac.Text#format}.
    *
    * @type {Rac.Point}
    */
    this.point = point;

    /**
    * The string to draw.
    * @type {string}
    */
    this.string = string;

    /**
    * The alignment, angle, font, and size to use to draw the text.
    * @type {Rac.Text.Format}
    */
    this.format = format;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.point.x, digits);
    const yStr = utils.cutDigits(this.point.y, digits);
    return `Text((${xStr},${yStr}) "${this.string}")`;
  }


  // RELEASE-TODO: check docs
  /**
  * Returns `true` when the `string` and `point` of both texts are equal;
  * otherwise returns `false`.
  *
  * When `otherText` is any class other that `Rac.Text`, returns `false`.
  *
  * `point`s are compared using [`point.equals`]{@link Rac.Point#equals}.
  *
  * The `format` objects are ignored in this comparison.
  *
  * @param {Rac.Text} otherText - A `Text` to compare
  * @returns {boolean}
  * @see Rac.Point#equals
  */
  equals(otherText) {
    return otherText instanceof Text
      && this.string === otherText.string
      && this.point.equals(otherText.point);
  }


  // RELEASE-TODO: document
  withAngle(newAngle) {
    const newFormat = this.format.withAngle(newAngle);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: document
  withFont(newFont) {
    const newFormat = this.format.withFont(newFont);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: document
  withSize(newSize) {
    const newFormat = this.format.withSize(newSize);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


} // class Text


module.exports = Text;

