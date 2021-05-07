'use strict';


/**
* The `instance.Stroke` function contains convenience methods and members
* for `{@link Rac.Stroke}` objects setup with the owning `Rac` instance.
* @namespace instance.Stroke
*/
module.exports = function attachRacPoint(rac) {

  /**
  * A `Stroke` with no weight and no color. Using or applying this stroke
  * will disable stroke drawing.
  *
  * @name none
  * @memberof rac.Stroke#
  */
  rac.Stroke.none = rac.Stroke(null);


  /**
  * A `Stroke` with `weight` of `1` and no color. Using or applying this
  * stroke will only set the stroke weight to `1`.
  *
  * @name one
  * @memberof rac.Stroke#
  */
  rac.Stroke.one = rac.Stroke(1);

} // attachRacStroke

