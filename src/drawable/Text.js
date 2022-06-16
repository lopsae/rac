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

  // RELEASE-TODO: make font and size optional?
  constructor(
    rac,
    horizontal = TextFormat.defaultHorizAlign,
    vertical = TextFormat.defaultVertAlign,
    font = TextFormat.defaultFont,
    angle = rac.Angle.zero,
    size = TextFormat.defaultSize)
  {
    utils.assertExists(rac);
    utils.assertString(horizontal, vertical);
    utils.assertType(Rac.Angle, angle);
    utils.assertNumber(size);
    this.rac = rac;
    this.horizontal = horizontal;
    this.vertical = vertical;
    this.font = font;
    this.angle = angle;
    this.size = size;
  }

  // Returns a format to draw text in the same position as `self` with
  // the inverse angle.
  inverse() {
    let hEnum = TextFormat.horizontal;
    let vEnum = TextFormat.vertical;
    let horizontal, vertical;
    switch (this.horizontal) {
      case hEnum.left:
        horizontal = hEnum.right; break;
      case hEnum.right:
        horizontal = hEnum.left; break;
      default:
        horizontal = this.horizontal; break;
    }
    switch (this.vertical) {
      case vEnum.top:
        vertical = vEnum.bottom; break;
      case vEnum.bottom:
        vertical = vEnum.top; break;
      default:
        vertical = this.vertical; break;
    }

    return new TextFormat(
      this.rac,
      horizontal, vertical,
      this.font,
      this.angle.inverse(),
      this.size)
  }


  withAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return new TextFormat(this.rac,
      this.horizontal, this.vertical,
      this.font,
      angle,
      this.size);
  }

  /**
  * Returns a string representation intended for human consumption.
  * @returns {string}
  */
  toString(digits = null) {
    const angleStr = utils.cutDigits(this.angle.turn, digits);
    const sizeStr = utils.cutDigits(this.size, digits);
    return `Text.Format(ha:${this.horizontal} va:${this.vertical} f:${this.font} a:${angleStr} s:${sizeStr})`;
  }

} // class TextFormat


/**
* String, format, and position to draw a text.
* @alias Rac.Text
*/
class Text {

  static Format = TextFormat;

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
  * @returns {string}
  */
  toString() {
    return `Text((${this.point.x},${this.point.y}) "${this.string}")`;
  }

} // class Text


module.exports = Text;

