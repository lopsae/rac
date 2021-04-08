'use strict';


const Rac = require('../Rac');


/**
* The `instance.Text` function contains convenience methods and properties
* for `{@link Rac.Text}` objects setup with the owning `Rac` instance.
* @namespace instance.Text
*/
module.exports = function attachRacText(rac) {


  rac.Text.Format = function(
    horizontal, vertical,
    font = null,
    angle = rac.Angle.zero,
    size = Rac.Text.Format.defaultSize)
  {
    return new Rac.Text.Format(
      horizontal, vertical,
      font, angle, size);
  };


  rac.Text.Format.topLeft = rac.Text.Format(
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.top,
    rac.Angle.zero,
    Rac.Text.Format.defaultSize);

  /**
  * A `Text` for drawing `hello world` with `topLeft` format at
  * `Point.zero`.
  * @name hello
  * @memberof rac.Text#
  */
  rac.Text.hello = rac.Text(0, 0, 'hello world!',
    rac.Text.Format.topLeft);

  /**
  * A `Text` for drawing the pangram `sphinx of black quartz, judge my vow`
  * with `topLeft` format at `Point.zero`.
  * @name sphinx
  * @memberof rac.Text#
  */
  rac.Text.sphinx = rac.Text(0, 0, 'sphinx of black quartz, judge my vow',
    rac.Text.Format.topLeft);

} // attachRacPoint

