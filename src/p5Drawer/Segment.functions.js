'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachSegmentFunctions(rac) {

  /**
  * Calls `p5.vertex` as to represent this `Segment`.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  */
  Rac.Segment.prototype.vertex = function() {
    this.start.vertex();
    this.end.vertex();
  };


  /**
  * Returns a `Segment` that covers the top of the canvas, from top-left to
  * top-right.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasTop
  * @memberof rac.Segment#
  * @function
  */
  rac.Segment.canvasTop = function() {
    let topLeft = rac.Point.zero;
    let topRight = rac.Point(rac.drawer.p5.width, 0);
    return rac.Segment(topLeft, topRight);
  };


  /**
  * Returns a `Segment` that covers the left of the canvas, from top-left
  * to bottom-left.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasLeft
  * @memberof rac.Segment#
  * @function
  */
  rac.Segment.canvasLeft = function() {
    let topLeft = rac.Point.zero;
    let bottomLeft = rac.Point(0, rac.drawer.p5.height);
    return rac.Segment(topLeft, bottomLeft);
  };


  /**
  * Returns a `Segment` that covers the right of the canvas, from top-right
  * to bottom-right.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasRight
  * @memberof rac.Segment#
  * @function
  */
  rac.Segment.canvasRight = function() {
    let topRight = rac.Point(rac.drawer.p5.width, 0);
    let bottomRight = rac.Point(rac.drawer.p5.width, rac.drawer.p5.height);
    return rac.Segment(topRight, bottomRight);
  };


  /**
  * Returns a `Segment` that covers the bottom of the canvas, from
  * bottom-left to bottom-right.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @name canvasBottom
  * @memberof rac.Segment#
  * @function
  */
  rac.Segment.canvasBottom = function() {
    let bottomLeft = rac.Point(0, rac.drawer.p5.height);
    let bottomRight = rac.Point(rac.drawer.p5.width, rac.drawer.p5.height);
    return rac.Segment(bottomLeft, bottomRight);
  };



} // attachSegmentFunctions

