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


tools.test( function toString() {
  const arc = rac.Arc(
    1.12345, 2.12345, // point
    3.12345, // radius
    0.12345, 0.23456, // start end
    true);

  const string = arc.toString();
  expect(string).toMatch('Arc');
  expect(string).toMatch('(1.12345,2.12345)');
  expect(string).toMatch('r:3.12345');
  expect(string).toMatch('s:0.12345');
  expect(string).toMatch('e:0.23456');
  expect(string).toMatch('c:true');


  const cutString = arc.toString(2);
  expect(cutString).toMatch('Arc');
  expect(cutString).toMatch('(1.12,2.12)');
  expect(cutString).toMatch('r:3.12');
  expect(cutString).toMatch('s:0.12');
  expect(cutString).toMatch('e:0.23');
  expect(cutString).toMatch('c:true');

  expect(cutString).not.toMatch('1.123');
  expect(cutString).not.toMatch('2.123');
  expect(cutString).not.toMatch('3.123');
  expect(cutString).not.toMatch('0.123');
  expect(cutString).not.toMatch('0.234');
});


tools.test( function errors() {
  const point = rac.Point.zero;
  const start = rac.Angle.zero;
  const end = rac.Angle.half;
  expect(() => {new Rac.Arc(rac, point, 100, start, end, true);})
    .not.toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Missing parameters
  expect(() => {new Rac.Arc(null, point, 100, start, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, null, 100, start, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, point, null, start, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, point, 100, null, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, point, 100, start, null, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, point, 100, start, end, null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid center
  expect(() => {new Rac.Arc(rac, 55, 100, start, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, "nonsense", 100, start, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid radius
  expect(() => {new Rac.Arc(rac, point, NaN, start, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, point, "100", start, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid angles
  expect(() => {new Rac.Arc(rac, point, 100, 0, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, point, 100, NaN, end, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, point, 100, start, 1/2, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Arc(rac, point, 100, start, NaN, true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


test.todo('Check for coverage!');

