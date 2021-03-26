'use strict';


  // Contains a sequence of geometry objects which can be drawn or vertex
  // together.
function Composite(sequence = []) {
  this.sequence = sequence;
};


module.exports = Composite;


RacComposite.prototype.isNotEmpty = function() {
  return this.sequence.length != 0;
};

RacComposite.prototype.add = function(element) {
  if (element instanceof Array) {
    element.forEach(item => this.sequence.push(item));
    return
  }
  this.sequence.push(element);
};

RacComposite.prototype.reverse = function() {
  let reversed = this.sequence.map(item => item.reverse())
    .reverse();
  return new RacComposite(reversed);
};

