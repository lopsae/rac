'use strict';


/**
* The `instance.Fill` function contains convenience methods and properties
* for `{@link Rac.Fill}` objects setup with the owning `Rac` instance.
* @namespace instance.Fill
*/
module.exports = function attachRacFill(rac) {

  /**
  * A `Fill` without color. Removes the fill color when applied.
  * @name none
  * @memberof rac.Fill#
  */
  rac.Fill.none = rac.Fill(null);

} // attachRacFill

