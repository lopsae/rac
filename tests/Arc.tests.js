'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const half = rac.Arc(100, 100, 55, rac.Angle.up, rac.Angle.down);


tools.test( function identity() {
  // Instance members
  expect(rac.Arc.zero).equalsArc(0, 0, 0, 0, 0, true);
  expect(half).equalsArc(100, 100, 55, 3/4, 1/4, true);

  // Angle/number parameter
  expect(half).equalsArc(100, 100, 55, 3/4, 1/4, true);
  expect(half).equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.down, true);

  // Inequality
  expect(rac.Arc.zero).not.equalsArc(7, 0, 0, 0.0, 0.0, true);
  expect(rac.Arc.zero).not.equalsArc(0, 7, 0, 0.0, 0.0, true);
  expect(rac.Arc.zero).not.equalsArc(0, 0, 7, 0.0, 0.0, true);
  expect(rac.Arc.zero).not.equalsArc(0, 0, 0, 0.7, 0.0, true);
  expect(rac.Arc.zero).not.equalsArc(0, 0, 0, 0.0, 0.7, true);
  expect(rac.Arc.zero).not.equalsArc(0, 0, 0, 0.0, 0.0, false);

  // Unexpected type for equalsRay
  expect(null)            .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(0)               .not.equalsArc(0, 0, 0, 0, 0, true);
  expect('0')             .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(rac.Angle.zero)  .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(rac.Point.zero)  .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(rac.Ray.zero)    .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(rac.Segment.zero).not.equalsArc(0, 0, 0, 0, 0, true);

  // Unexpected type for equals
  expect(half.equals(null))            .toBe(false);
  expect(half.equals(0))               .toBe(false);
  expect(half.equals('0'))             .toBe(false);
  expect(half.equals(rac.Angle.zero))  .toBe(false);
  expect(half.equals(rac.Point.zero))  .toBe(false);
  expect(half.equals(rac.Ray.zero))    .toBe(false);
  expect(half.equals(rac.Segment.zero)).toBe(false);


  let string = half.toString();
  expect(string).toMatch('Arc');
  expect(string).toMatch('100,100');
  expect(string).toMatch('55');
  expect(string).toMatch('0.25');
  expect(string).toMatch('0.75');
  expect(string).toMatch('true');
});


test.todo('Check for coverage!');

