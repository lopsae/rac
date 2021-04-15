'use strict';


/**
* The `instance.Ray` function contains convenience methods and properties
* for `{@link Rac.Ray}` objects setup with the owning `Rac` instance.
* @namespace instance.Ray
*/
module.exports = function attachRacRay(rac) {

  /**
  * A `Ray` over the x-axis, starting at `{@link instance.Point#origin}`
  * and poiting to `{@link instance.Angle#zero}`.
  *
  * @name xAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#zero
  */
  rac.Ray.xAxis = rac.Ray(0, 0, rac.Angle.zero);


  /**
  * A `Ray` over the y-axis, starting at`{@link instance.Point.origin}`
  * and poiting to `{@link instance.Angle.quarter}`.
  *
  * @name yAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#quarter
  */
  rac.Ray.yAxis = rac.Ray(0, 0, rac.Angle.quarter);

} // attachRacRay

