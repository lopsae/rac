'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


// Basic tests for shape, to comply with baseline coverage of drawables


tools.test( function construction() {
  let shape = new Rac.Shape(rac);
  expect(shape.outline.sequence).toEqual([]);
  expect(shape.contour.sequence).toEqual([]);
});


tools.test( function additions() {
  let shape = new Rac.Shape(rac);

  shape.addOutline(rac.Point(55, 55));
  shape.addContour(rac.Point(77, 77));

  expect(shape.outline.sequence).toHaveLength(1);
  expect(shape.contour.sequence).toHaveLength(1);

  expect(shape.outline.sequence[0]).equalsPoint(55, 55);
  expect(shape.contour.sequence[0]).equalsPoint(77, 77);
});

