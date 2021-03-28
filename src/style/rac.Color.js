'use strict';


/**
* The `rac.Color` function contains methods and properties for convenience
* `{@link Rac.Color}` objects with the current `rac` instance.
* @namespace rac.Color
*/
module.exports = function attachRacColor(rac) {


  /**
  * Returns an `Color` with the given `rgba` values in the `[0,255]` range.
  * @name fromRgba
  * @memberof rac.Color#
  * @function
  */
  rac.Color.fromRgba = function(r, g, b, a = 255) {
    return Rac.Color.fromRgba(rac, r, g, b, a);
  };


  /**
  * A black `Color`.
  * @name black
  * @memberof rac.Color#
  */
  rac.Color.black   = rac.Color(0, 0, 0);

  /**
  * A red `Color`.
  * @name black
  * @memberof rac.Color#
  */
  rac.Color.red     = rac.Color(1, 0, 0);

  rac.Color.green   = rac.Color(0, 1, 0);
  rac.Color.blue    = rac.Color(0, 0, 1);
  rac.Color.yellow  = rac.Color(1, 1, 0);
  rac.Color.magenta = rac.Color(1, 0, 1);
  rac.Color.cyan    = rac.Color(0, 1, 1);
  rac.Color.white   = rac.Color(1, 1, 1);

} // attachRacColor

