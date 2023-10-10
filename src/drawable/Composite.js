'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Container of a sequence of drawable objects that can be drawn together.
*
* Used by `[P5Drawer]{@link Rac.P5Drawer}` to perform specific vertex
* operations with drawables to draw complex shapes.
*
* @alias Rac.Composite
*/
class Composite {

  /**
  * Creates a new `Composite` instance.
  * @param {Rac} rac
  *   Instance to use for drawing and creating other objects
  * @param {Array} [sequence]
  *   An array of drawable objects to contain
  */
  constructor(rac, sequence = []) {
    utils.assertExists(rac, sequence);

    this.rac = rac;
    this.sequence = sequence;
  }

} // class Composite


module.exports = Composite;


Composite.prototype.isNotEmpty = function() {
  return this.sequence.length != 0;
};

Composite.prototype.add = function(element) {
  if (element instanceof Array) {
    element.forEach(item => this.sequence.push(item));
    return
  }
  this.sequence.push(element);
};

Composite.prototype.reverse = function() {
  let reversed = this.sequence.map(item => item.reverse())
    .reverse();
  return new Composite(this.rac, reversed);
};

