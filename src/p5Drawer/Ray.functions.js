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

    const downEdge  = p5.height - margin;
    const leftEdge  = margin;
    const upEdge    = margin;
    const rightEdge = p5.width - margin;

    // pointing down
    if (turn >= 1/8 && turn < 3/8) {
      let edgePoint = null;
      if (this.start.y < downEdge) {
        edgePoint = this.pointAtY(downEdge);
        if (edgePoint.x > rightEdge) {
          edgePoint = this.pointAtX(rightEdge);
        } else if (edgePoint.x < leftEdge) {
          edgePoint = this.pointAtX(leftEdge);
        }
      }
      return edgePoint;
    }

    // pointing left
    if (turn >= 3/8 && turn < 5/8) {
      let edgePoint = null;
      if (this.start.x >= leftEdge) {
        edgePoint = this.pointAtX(leftEdge);
        if (edgePoint.y > downEdge) {
          edgePoint = this.pointAtY(downEdge);
        } else if (edgePoint.y < upEdge) {
          edgePoint = this.pointAtY(upEdge);
        }
      }
      return edgePoint;
    }

    // pointing up
    if (turn >= 5/8 && turn < 7/8) {
      let edgePoint = null;
      if (this.start.y >= upEdge) {
        edgePoint = this.pointAtY(upEdge);
        if (edgePoint.x > rightEdge) {
          edgePoint = this.pointAtX(rightEdge);
        } else if (edgePoint.x < leftEdge) {
          edgePoint = this.pointAtX(leftEdge);
        }
      }
      return edgePoint;
    }

    // pointing right
    let edgePoint = null;
    if (this.start.x < rightEdge) {
      edgePoint = this.pointAtX(rightEdge);
      if (edgePoint.y > downEdge) {
          edgePoint = this.pointAtY(downEdge);
        } else if (edgePoint.y < upEdge) {
          edgePoint = this.pointAtY(upEdge);
        }
    }
    return edgePoint;
  };

} // attachRayFunctions

