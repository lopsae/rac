'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


let diagonal = rac.Segment(55, 55, rac.Angle.eighth, 100);
let vertical = rac.Segment(100, 100, rac.Angle.down, 100);
let horizontal = rac.Segment(100, 100, rac.Angle.zero, 100);


test('Identity', () => {
  expect(null).not.equalsSegment(55, 55, rac.Angle.eighth, 100);

  expect(diagonal).equalsSegment(55, 55, rac.Angle.eighth, 100);
  expect(diagonal).not.equalsSegment(7, 7, 0, 7);
});


test('Function toString', () => {
  const segment = rac.Segment(1.12345, 2.12345, 0.12345, 3.12345);

  const string = segment.toString();
  expect(string).toMatch('Segment');
  expect(string).toMatch('0.12345');
  expect(string).toMatch('1.12345');
  expect(string).toMatch('2.12345');
  expect(string).toMatch('3.12345');

  const cutString = segment.toString(2);
  expect(cutString).toMatch('Segment');
  expect(cutString).toMatch('0.12');
  expect(cutString).toMatch('1.12');
  expect(cutString).toMatch('2.12');
  expect(cutString).toMatch('3.12');
  expect(cutString).not.toMatch('0.123');
  expect(cutString).not.toMatch('1.123');
  expect(cutString).not.toMatch('2.123');
  expect(cutString).not.toMatch('3.123');
});


test('Properties', () => {
  expect(diagonal.startPoint()).equalsPoint(55, 55);
  expect(diagonal.angle()).equalsAngle(1/8);

  let side = tools.sides(100);
  expect(diagonal.endPoint()).equalsPoint(55+side, 55+side);
});


test('Transforms to Arc', () => {
  expect(diagonal.arc()).equalsArc(55, 55, 100, 1/8, 1/8, true);

  expect(diagonal.arc(rac.Angle.half))
    .equalsArc(55, 55, 100, 1/8, 1/2, true);

  expect(diagonal.arc(rac.Angle.half, false))
    .equalsArc(55, 55, 100, 1/8, 1/2, false);

  expect(diagonal.arc(null, false))
    .equalsArc(55, 55, 100, 1/8, 1/8, false);
});


test.todo('Check for coverage!');

