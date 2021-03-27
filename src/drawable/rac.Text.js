'use strict';


const Rac = require('../Rac');


/**
* The `rac.Text` function contains methods and properties for convenience
* `{@link Rac.Text}` objects.
* @namespace rac.Text
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
  rac.Text.hello = rac.Text('hello world!',
    rac.Text.Format.topLeft, rac.Point.zero);

  /**
  * A `Text` for drawing the pangram `sphinx of black quartz judge my vow`
  * with `topLeft` format at `Point.zero`.
  * @name sphinx
  * @memberof rac.Text#
  */
  rac.Text.sphinx = rac.Text('sphinx of black quartz judge my vow',
    rac.Text.Format.topLeft, rac.Point.zero);

} // attachRacPoint

