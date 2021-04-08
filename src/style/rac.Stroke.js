'use strict';


/**
* The `instance.Stroke` function contains convenience methods and properties
* for `{@link Rac.Stroke}` objects setup with the owning `Rac` instance.
* @namespace instance.Stroke
*/
module.exports = function attachRacPoint(rac) {

  /**
  * A `Stroke` without any color. Using or applying this stroke will
  * disable stroke drawing.
  *
  * @name none
  * @memberof rac.Stroke#
  */
  rac.Stroke.none = rac.Stroke(null)

} // attachRacStroke

