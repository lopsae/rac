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
    this.startPoint().vertex();
    this.endPoint().vertex();
  };


  /**
  * Returns a `Segment` that covers the top of the canvas, from top-left to
  * top-right.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @function canvasTop
  * @memberof rac.Segment#
  */
  rac.Segment.canvasTop = function() {
    return rac.Point.zero
      .segmentToAngle(rac.Angle.right, rac.drawer.p5.width);
  };


  /**
  * Returns a `Segment` that covers the left of the canvas, from top-left
  * to bottom-left.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @function canvasLeft
  * @memberof rac.Segment#
  */
  rac.Segment.canvasLeft = function() {
    return rac.Point.zero
      .segmentToAngle(rac.Angle.down, rac.drawer.p5.height);
  };


  /**
  * Returns a `Segment` that covers the right of the canvas, from top-right
  * to bottom-right.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @function canvasRight
  * @memberof rac.Segment#
  */
  rac.Segment.canvasRight = function() {
    const topRight = rac.Point(rac.drawer.p5.width, 0);
    return topRight
      .segmentToAngle(rac.Angle.down, rac.drawer.p5.height);
  };


  /**
  * Returns a `Segment` that covers the bottom of the canvas, from
  * bottom-left to bottom-right.
  *
  * Added when `Rac.P5Drawer` is setup as `rac.drawer`.
  *
  * @function canvasBottom
  * @memberof rac.Segment#
  */
  rac.Segment.canvasBottom = function() {
    let bottomLeft = rac.Point(0, rac.drawer.p5.height);
    return bottomLeft
      .segmentToAngle(rac.Angle.right, rac.drawer.p5.width);
  };



} // attachSegmentFunctions

