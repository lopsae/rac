'use strict';


function Shape() {
  this.outline = new rac.Composite();
  this.contour = new rac.Composite();
}


module.exports = Shape;


RacShape.prototype.addOutline = function(element) {
  this.outline.add(element);
};

RacShape.prototype.addContour = function(element) {
  this.contour.add(element);
};

