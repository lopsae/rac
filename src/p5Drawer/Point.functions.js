'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachPointFunctions(rac) {

  /**
  * Calls the `p5.vertex` function for this `Point`.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  */
  Rac.Point.prototype.vertex = function() {
    rac.drawer.p5.vertex(this.x, this.y);
  };

  /**
  * Returns the `Point` at the current position of the pointer.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name pointer
  * @memberof rac.Point#
  * @function
  */
  rac.Point.pointer = function() {
    return rac.Point(rac.drawer.p5.mouseX, rac.drawer.p5.mouseY);
  };

  /**
  * Returns a `Point` at the center of the canvas.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasCenter
  * @memberof rac.Point#
  * @function
  */
  rac.Point.canvasCenter = function() {
  // Rac.Point.canvasCenter = function() {
    return rac.Point(rac.drawer.p5.width/2, rac.drawer.p5.height/2);
  };

  /**
  * Returns a `Point` at the end of the canvas, that is, at the position
  * `(width,height)`.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasEnd
  * @memberof rac.Point#
  * @function
  */
  Rac.Point.canvasEnd = function() {
    return new Rac.Point(rac.drawer.p5.width, rac.drawer.p5.height);
  };

} // attachPointFunctions

