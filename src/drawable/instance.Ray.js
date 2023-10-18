'use strict';


/**
* Members and methods attached to the
* [`rac.Ray` function]{@link Rac#Ray}.
*
* The function contains ready-made convenience
* [`Ray`]{@link Rac.Ray} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Ray.xAxis // ready-made x-axis ray
* rac.Ray.xAxis.rac === rac // true
*
* @namespace instance.Ray
*/
module.exports = function attachRacRay(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Ray` is attached in `attachInstanceFunctions.js`.

  /**
  * A `Ray` with all values set to zero, starts at
  * [`rac.Point.zero`]{@link instance.Point#zero} and points to
  * [`rac.Angle.zero`]{@link instance.Angle#zero}.
  *
  * @name zero
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  */
  rac.Ray.zero = rac.Ray(0, 0, rac.Angle.zero);


  /**
  * A `Ray` over the x-axis, starts at
  * [`rac.Point.origin`]{@link instance.Point#origin} and points to
  * [`rac.Angle.zero`]{@link instance.Angle#zero}.
  *
  * Equal to [`rac.Ray.zero`]{@link instance.Ray#zero}.
  *
  * @name xAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  */
  rac.Ray.xAxis = rac.Ray.zero;


  /**
  * A `Ray` over the y-axis, starts at
  * [`rac.Point.origin`]{@link instance.Point#origin} and points to
  * [`rac.Angle.quarter`]{@link instance.Angle#quarter}.
  *
  * @name yAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  */
  rac.Ray.yAxis = rac.Ray(0, 0, rac.Angle.quarter);

} // attachRacRay

