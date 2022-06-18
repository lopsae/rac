'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Format for drawing a `[Text]{@link Rac.Text}` object.
*
* @alias Rac.Text.Format
*/
class TextFormat {

  // RELEASE-TODO: document
  static horizontalAlign = {
    left: "left",
    center: "horizontalCenter",
    right: "right"
  };

  // RELEASE-TODO: document
  static verticalAlign = {
    top: "top",
    bottom: "bottom",
    center: "verticalCenter",
    baseline: "baseline"
  };


  // RELEASE-TODO: document - test
  constructor(
    rac,
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    utils.assertExists(rac);
    utils.assertString(hAlign, vAlign);
    utils.assertType(Rac.Angle, angle);
    font !== null && utils.assertString(font);
    size !== null && utils.assertNumber(size);

    this.rac = rac;
    this.hAlign = hAlign;
    this.vAlign = vAlign;
    this.angle = angle;
    this.font = font;
    this.size = size;
  }

  // Returns a format to draw text in the same position as `self` with
  // the inverse angle.
  // RELEASE-TODO: document - test
  inverse() {
    let hEnum = TextFormat.horizontalAlign;
    let vEnum = TextFormat.verticalAlign;
    let hAlign, vAlign;
    switch (this.hAlign) {
      case hEnum.left:  hAlign = hEnum.right; break;
      case hEnum.right: hAlign = hEnum.left; break;
      default:          hAlign = this.hAlign; break;
    }
    switch (this.vAlign) {
      case vEnum.top:    vAlign = vEnum.bottom; break;
      case vEnum.bottom: vAlign = vEnum.top; break;
      default:           vAlign = this.vAlign; break;
    }

    return new TextFormat(
      this.rac,
      hAlign, vAlign,
      this.angle.inverse(),
      this.font,
      this.size)
  }


  // RELEASE-TODO: document - test
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      newAngle,
      this.font,
      this.size);
  }


  // RELEASE-TODO: document - test
  withFont(newFont) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      newFont,
      this.size);
  }


  // RELEASE-TODO: document - test
  withSize(newSize) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
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
    return `Text.Format(ha:${this.hAlign} va:${this.vAlign} a:${angleStr} f:${this.font} s:${sizeStr})`;
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

