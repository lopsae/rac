'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


let diagonal = rac.Segment(55, 55, rac.Angle.eighth, 100);
let vertical = rac.Segment(100, 100, rac.Angle.down, 100);
let horizontal = rac.Segment(100, 100, rac.Angle.zero, 100);


test('Identity', function identity() {
  // Angle/number parameter
  expect(diagonal).equalsSegment(55, 55, 1/8, 100);
  expect(diagonal).equalsSegment(55, 55, rac.Angle.eighth, 100);

  // Inequality
  expect(diagonal).not.equalsSegment(0, 55, 1/8, 100);
  expect(diagonal).not.equalsSegment(55, 0, 1/8, 100);
  expect(diagonal).not.equalsSegment(55, 55, 0, 100);
  expect(diagonal).not.equalsSegment(55, 55, 1/8, 0);

  // Unexpected type for equalsSegment
  expect(null)          .not.equalsSegment(0, 0, 0, 0);
  expect(55)            .not.equalsSegment(0, 0, 0, 0);
  expect(rac.Point.zero).not.equalsSegment(0, 0, 0, 0);
  expect(rac.Angle.zero).not.equalsSegment(0, 0, 0, 0);
  expect(rac.Ray.zero)  .not.equalsSegment(0, 0, 0, 0);

  // Unexpected type for equals
  expect(diagonal.equals(null))            .toBe(false);
  expect(diagonal.equals(55))              .toBe(false);
  expect(diagonal.equals(rac.Point.zero))  .toBe(false);
  expect(diagonal.equals(rac.Angle.eighth)).toBe(false);
});


test('Function toString', function toString() {
  const segment = rac.Segment(1.12345, 2.12345, 0.12345, 3.12345);

  const string = segment.toString();
  expect(string).toMatch('Segment');
  expect(string).toMatch('(1.12345,2.12345)');
  expect(string).toMatch('a:0.12345');
  expect(string).toMatch('l:3.12345');

  const cutString = segment.toString(2);
  expect(cutString).toMatch('Segment');
  expect(cutString).toMatch('(1.12,2.12)');
  expect(cutString).toMatch('a:0.12');
  expect(cutString).toMatch('l:3.12');
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

