'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Determines the alignment, angle, font, and size for drawing a
* [`Text`]{@link Rac.Text} object.
*
* @alias Rac.Text.Format
*/
class TextFormat {

  /**
  * Supported values for [`hAlign`]{@link Rac.Text.Format#hAlign} which
  * dermines the left-to-right alignment of the drawn `Text` in relation
  * to its [`text.point`]{@link Rac.Text#point}.
  *
  * @property {String} left
  *   aligns `text.point` to the left edge of the drawn text
  * @property {String} center
  *   aligns `text.point` to the center, from side to
  * @property {String} right
  *   aligns `text.point` to the right edge of the drawn text
  *
  * @type {object}
  * @memberof Rac.Text.Format
  */
  static horizontalAlign = {
    left: "left",
    center: "horizontalCenter",
    right: "right"
  };

  /**
  * Supported values for [`vAlign`]{@link Rac.Text.Format#vAlign} which
  * dermines the top-to-bottom alignment of the drawn `Text` in relation
  * to its [`text.point`]{@link Rac.Text#point}.
  *
  * @property {String} top
  *   aligns `text.point` to the top edge of the drawn text
  * @property {String} center
  *   aligns `text.point` to the center, from top to bottom, of the drawn text
  * @property {String} baseline
  *   aligns `text.point` to the baseline of the drawn text
  * @property {String} bottom
  *   aligns `text.point` to the bottom edge of the drawn text
  *
  * @type {object}
  * @memberof Rac.Text.Format
  */
  static verticalAlign = {
    top: "top",
    center: "verticalCenter",
    baseline: "baseline",
    bottom: "bottom"
  };


  /**
  * Creates a new `Text.Format` instance.
  *
  * @param {Rac} rac
  *   Instance to use for drawing and creating other objects
  * @param {String} hAlign
  *   The horizontal alignment, left-to-right; one of the values from
  *   [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {String} vAlign
  *   The vertical alignment, top-to-bottom; one of the values from
  *   [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The angle towards which the text is drawn
  * @param {String} [font=null]
  *   The font name
  * @param {number} [size=null]
  *   The font size
  */
  constructor(
    rac,
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    utils.assertType(Rac, rac);
    utils.assertString(hAlign, vAlign);
    utils.assertType(Rac.Angle, angle);
    font !== null && utils.assertString(font);
    size !== null && utils.assertNumber(size);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The horizontal alignment, left-to-right, to position a `Text`
    * relative to its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign} object.
    *
    * @type {String}
    */
    this.hAlign = hAlign;

    /**
    * The vertical alignment, top-to-bottom, to position a `Text` relative
    * to its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`verticalAlign`]{@link Rac.Text.Format.verticalAlign} object.
    *
    * @type {String}
    */
    this.vAlign = vAlign;

    /**
    * The angle towards which the text is drawn.
    *
    * An angle of [`zero`]{@link instance.Angle#zero} wil draw the text
    * towards the right of the screen.
    *
    * @type {Rac.Angle}
    */
    this.angle = angle;

    /**
    * The font name of the text to draw.
    *
    * When set to `null` the font defined in
    * [`rac.textFormatDefaults.font`]{@link Rac#textFormatDefaults} is
    * used instead upon drawing.
    *
    * @type {?String}
    */
    this.font = font;

    /**
    * The font size of the text to draw.
    *
    * When set to `null` the size defined in
    * [`rac.textFormatDefaults.size`]{@link Rac#textFormatDefaults} is
    * used instead upon drawing.
    *
    * @type {?number}
    */
    this.size = size;
  } // constructor


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * // returns: 'Text.Format(ha:left va:top a:0.5 f:"sans" s:14)'
  * rac.Text.Format('left', 'top', 0.5, 'sans', 14)).toString()
  *
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const angleStr = utils.cutDigits(this.angle.turn, digits);
    const sizeStr = this.size === null
      ? 'null'
      : utils.cutDigits(this.size, digits);
    const fontStr = this.font === null
      ? 'null'
      : `"${this.font}"`;
    return `Text.Format(ha:${this.hAlign} va:${this.vAlign} a:${angleStr} f:${fontStr} s:${sizeStr})`;
  }


  /**
  * Returns `true` when all members, except `rac`, of both formats are
  * equal, otherwise returns `false`.
  *
  * When `otherFormat` is any class other that `Rac.Text.Format`, returns
  * `false`.
  *
  * @param {Rac.Text.Format} otherFormat - A `Text.Format` to compare
  * @returns {boolean}
  * @see Rac.Angle#equals
  */
  equals(otherFormat) {
    return otherFormat instanceof TextFormat
      && this.hAlign === otherFormat.hAlign
      && this.vAlign === otherFormat.vAlign
      && this.angle.equals(otherFormat.angle)
      && this.font === otherFormat.font
      && this.size === otherFormat.size;
  }


  /**
  * Returns a new `Text.Format` with `angle` set to the `Angle` derived
  * from `newAngle`.
  * @param {Rac.Angle|number} newAngle - The angle for the new `Text.Format`
  * @returns {Rac.Text.Format}
  */
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      newAngle,
      this.font,
      this.size);
  }


  /**
  * Returns a new `Text.Format` with `font` set to `newFont`.
  * @param {?String} newFont - The font name for the new `Text.Format`;
  *   can be set to `null`.
  * @returns {Rac.Text.Format}
  */
  withFont(newFont) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      newFont,
      this.size);
  }


  /**
  * Returns a new `Text.Format` with `size` set to `newSize`.
  * @param {?number} newSize - The font size for the new `Text.Format`;
  *   can be set to `null`.
  * @returns {Rac.Text.Format}
  */
  withSize(newSize) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      this.font,
      newSize);
  }


  /**
  * Returns a new `Text.Format` that will draw a text reversed, upside-down,
  * in generally the same position as `this` would draw the same text.
  * @returns {Rac.Text.Format}
  */
  reverse() {
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

} // class TextFormat


module.exports = TextFormat;

