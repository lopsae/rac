'use strict';


const Rac = require('../Rac');


/**
  * Members and methods attached to the
  * [`rac.Text.Format` function]{@link Rac#TextFormat}.
  *
  * The function contains ready-made convenience
  * [`Text.Format`]{@link Rac.Text.Format} objects for usual values, all
  * setup with the owning `Rac` instance.
  *
  * @example
  * let rac = new Rac()
  * rac.Text.Format.topLeft // ready-made top-left text format
  * rac.Text.Format.topLeft.rac === rac // true
  *
  * @namespace instance.Text.Format
  */
module.exports = function attachRacTextFormat(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.TextFormat` and `rac.Text.Format` are attached in
  // `attachInstanceFunctions.js`.


  // ======================================================================
  // Tops =================================================================
  // ======================================================================

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to the
  * top-left edge of the drawn text.
  *
  * Also available as: `tl`.
  *
  * @name topLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top);
  rac.Text.Format.tl = rac.Text.Format.topLeft;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center-left edge of the drawn text.
  *
  * Also available as: `tc`.
  *
  * @name topCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.top);
  rac.Text.Format.tc = rac.Text.Format.topCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center-right edge of the drawn text.
  *
  * Also available as: `tr`.
  *
  * @name topRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.top);
  rac.Text.Format.tr = rac.Text.Format.topRight;


  // ======================================================================
  // Centers ==============================================================
  // ======================================================================

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center-left edge of the drawn text.
  *
  * Also available as: `cl`.
  *
  * @name centerLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center);
  rac.Text.Format.cl = rac.Text.Format.centerLeft;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center of the drawn text.
  *
  * Also available as: `cc`, `centered`.
  *
  * @name centerCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.center);
  rac.Text.Format.centered = rac.Text.Format.centerCenter;
  rac.Text.Format.cc       = rac.Text.Format.centerCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center-right of the drawn text.
  *
  * Also available as: `cr`.
  *
  * @name centerRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.center);
  rac.Text.Format.cr = rac.Text.Format.centerRight;


  // ======================================================================
  // Bottoms ==============================================================
  // ======================================================================

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the bottom-left of the drawn text.
  *
  * Also available as: `bl`.
  *
  * @name bottomLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.bottom);
  rac.Text.Format.bl = rac.Text.Format.bottomLeft;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the bottom-center of the drawn text.
  *
  * Also available as: `bc`.
  *
  * @name bottomCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.bottom);
  rac.Text.Format.bc = rac.Text.Format.bottomCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the bottom-right of the drawn text.
  *
  * Also available as: `br`.
  *
  * @name bottomRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.bottom);
  rac.Text.Format.br = rac.Text.Format.bottomRight;


  // ======================================================================
  // Baselines ============================================================
  // ======================================================================

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the baseline and left of the drawn text.
  *
  * Also available as: `bll`.
  *
  * @name baselineLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.baselineLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.baseline);
  rac.Text.Format.bll = rac.Text.Format.baselineLeft;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the baseline and center of the drawn text.
  *
  * Also available as: `blc`.
  *
  * @name baselineCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.baselineCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.baseline);
  rac.Text.Format.blc = rac.Text.Format.baselineCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the baseline and right of the drawn text.
  *
  * Also available as: `blr`.
  *
  * @name baselineRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.baselineRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.baseline);
  rac.Text.Format.blr = rac.Text.Format.baselineRight;

} // attachRacTextFormat

