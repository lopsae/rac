'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachRayFunctions(rac) {

  /**
  * Returns a new `Point` located where the ray touches the canvas edge.
  * When the ray is outside the canvas and pointing away, `null` is
  * returned.
  *
  * * Added  to `Rac.Ray.prototype` when `Rac.P5Drawer` is setup as
  * `rac.drawer`.
  *
  * @returns {?Rac.Point}
  */
  Rac.Ray.prototype.pointAtCanvasEdge = function(margin = 0) {
    const turn = this.angle.turn;
    const p5 = this.rac.drawer.p5;

    let edgePoint = null;

    if
      (turn >= 1/8 && turn < 3/8)
    {
      // pointing down
      const downEdge = p5.height - margin;
      if (this.start.y < downEdge) {
        edgePoint = this.pointAtY(downEdge);
      }
    } else if
      (turn >= 3/8 && turn < 5/8)
    {
      // pointing left
      const leftEdge = margin;
      if (this.start.x >= leftEdge) {
        edgePoint = this.pointAtX(leftEdge);
      }
    } else if
      (turn >= 5/8 && turn < 7/8)
    {
      // pointing up
      const upEdge = margin;
      if (this.start.y >= upEdge) {
        edgePoint = this.pointAtY(upEdge);
      }
    } else {
      // pointing right
      const rightEdge = p5.width - margin;
      if (this.start.x < rightEdge) {
        edgePoint = this.pointAtX(rightEdge);
      }
    }

    return edgePoint;
  };

} // attachRayFunctions

