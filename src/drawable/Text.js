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

  // RELEASE-TODO: document
  static defaultSize = 15;
  static defaultHorizAlign = TextFormat.horizontal.left;
  static defaultVertAlign = TextFormat.vertical.top;
  static defaultFont = null;

  // RELEASE-TODO: document and test
  constructor(
    rac,
    horizontal = TextFormat.defaultHorizAlign,
    vertical = TextFormat.defaultVertAlign,
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


  withAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return new TextFormat(this.rac,
      this.horizontal, this.vertical,
      angle,
      this.font,
      this.size);
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

  // RELEASE-TODO make text format optional
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

