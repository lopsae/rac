'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Format for drawing a `[Text]{@link Rac.Text}` object.
*
* @alias Rac.Text.Format
*/
class TextFormat {

  static horizontal = {
    left: "left",
    center: "horizontalCenter",
    right: "right"
  };

  static vertical = {
    top: "top",
    bottom: "bottom",
    center: "verticalCenter",
    baseline: "baseline"
  };


  // RELEASE-TODO: document - test
  constructor(
    rac,
    horizontal,
    vertical,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    utils.assertExists(rac);
    utils.assertString(horizontal, vertical);
    utils.assertType(Rac.Angle, angle);
    font !== null && utils.assertString(font);
    size !== null && utils.assertNumber(size);

    this.rac = rac;
    this.horizontal = horizontal;
    this.vertical = vertical;
    this.angle = angle;
    this.font = font;
    this.size = size;
  }

  // Returns a format to draw text in the same position as `self` with
  // the inverse angle.
  // RELEASE-TODO: document - test
  inverse() {
    let hEnum = TextFormat.horizontal;
    let vEnum = TextFormat.vertical;
    let horizontal, vertical;
    switch (this.horizontal) {
      case hEnum.left:  horizontal = hEnum.right; break;
      case hEnum.right: horizontal = hEnum.left; break;
      default:          horizontal = this.horizontal; break;
    }
    switch (this.vertical) {
      case vEnum.top:    vertical = vEnum.bottom; break;
      case vEnum.bottom: vertical = vEnum.top; break;
      default:           vertical = this.vertical; break;
    }

    return new TextFormat(
      this.rac,
      horizontal, vertical,
      this.angle.inverse(),
      this.font,
      this.size)
  }


  // RELEASE-TODO: document - test
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    return new TextFormat(this.rac,
      this.horizontal, this.vertical,
      newAngle,
      this.font,
      this.size);
  }


  // RELEASE-TODO: document - test
  withFont(newFont) {
    return new TextFormat(this.rac,
      this.horizontal, this.vertical,
      this.angle,
      newFont,
      this.size);
  }


  // RELEASE-TODO: document - test
  withSize(newSize) {
    return new TextFormat(this.rac,
      this.horizontal, this.vertical,
      this.angle,
      this.font,
      newSize);
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const angleStr = utils.cutDigits(this.angle.turn, digits);
    const sizeStr = this.size === null
      ? "null"
      : utils.cutDigits(this.size, digits);
    return `Text.Format(ha:${this.horizontal} va:${this.vertical} a:${angleStr} f:${this.font} s:${sizeStr})`;
  }

} // class TextFormat


/**
* String, format, and position to draw a text.
* @alias Rac.Text
*/
class Text {

  static Format = TextFormat;

  // RELEASE-TODO: document - test
  constructor(rac, point, string, format) {
    utils.assertExists(rac, point, string, format);
    utils.assertType(Rac.Point, point);
    utils.assertString(string);
    utils.assertType(Text.Format, format);
    this.rac = rac;
    this.point = point;
    this.string = string;
    this.format = format;
  }


  // RELEASE-TODO: document - test
  withAngle(newAngle) {
    const newFormat = this.format.withAngle(newAngle);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: document - test
  withFont(newFont) {
    const newFormat = this.format.withFont(newFont);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: document - test
  withSize(newSize) {
    const newFormat = this.format.withSize(newSize);
    return new Text(this.rac, this.point, this.string, newFormat);
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

} // class Text


module.exports = Text;

