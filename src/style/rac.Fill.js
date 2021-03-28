'use strict';


/**
* The `rac.Fill` function contains methods and properties for convenience
* `{@link Rac.Fill}` objects with the current `rac` instance.
* @namespace rac.Fill
*/
module.exports = function attachRacFill(rac) {

  /**
  * A `Fill` without color. Removes the fill color when applied.
  * @name none
  * @memberof rac.Fill#
  */
  rac.Fill.none = rac.Fill(null);

} // attachRacFill

