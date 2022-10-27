'use strict';


/**
* Members and methods attached to the
* [`rac.Stroke` function]{@link Rac#Stroke}.
*
* The function contains ready-made convenience
* [`Stroke`]{@link Rac.Stroke} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Stroke.none // ready-made none stroke
* rac.Stroke.none.rac === rac // true
*
* @namespace instance.Stroke
*/
module.exports = function attachRacStroke(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Stroke` with no weight and no color. Using or applying this stroke
  * will disable stroke drawing.
  *
  * @name none
  * @memberof instance.Stroke#
  */
  rac.Stroke.none = rac.Stroke(null);


  /**
  * A `Stroke` with `weight = 1` and no color. Using or applying this
  * stroke will only set the stroke weight to `1` leaving stroke color
  * unchanged.
  *
  * @name one
  * @memberof instance.Stroke#
  */
  rac.Stroke.one = rac.Stroke(1);

} // attachRacStroke

