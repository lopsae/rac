'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


let half = rac.Arc(100, 100, 55, rac.Angle.up, rac.Angle.down);


test('Identity', () => {
  // Instance members
  expect(rac.Arc.zero).equalsArc(0, 0, 0, 0, 0, true);

  // Inequality
  expect(rac.Arc.zero).not.equalsArc(7, 0, 0, 0.0, 0.0, true);
  expect(rac.Arc.zero).not.equalsArc(0, 7, 0, 0.0, 0.0, true);
  expect(rac.Arc.zero).not.equalsArc(0, 0, 7, 0.0, 0.0, true);
  expect(rac.Arc.zero).not.equalsArc(0, 0, 0, 0.7, 0.0, true);
  expect(rac.Arc.zero).not.equalsArc(0, 0, 0, 0.0, 0.7, true);
  expect(rac.Arc.zero).not.equalsArc(0, 0, 0, 0.0, 0.0, true);

  expect(null).not.equalsArc(0, 0, 100, 0, 1/2, true);

  expect(half).equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.down, true);
  expect(half).not.equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.down, false);

  let string = half.toString();
  expect(string).toMatch('Arc');
  expect(string).toMatch('100,100');
  expect(string).toMatch('55');
  expect(string).toMatch('0.25');
  expect(string).toMatch('0.75');
  expect(string).toMatch('true');
});


test.todo('Check for coverage!');

