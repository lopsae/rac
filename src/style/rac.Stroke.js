'use strict';


/**
* The `rac.Stroke` function contains methods and properties for convenience
* `{@link Rac.Stroke}` objects with the current `rac` instance.
* @namespace rac.Stroke
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

