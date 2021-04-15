'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;

const fifty = rac.Point(55, 55);
const hunty = rac.Point(100, 100);

const diagonal = rac.Segment(55, 55, rac.Angle.eighth, 72);
const vertical = rac.Segment(100, 100, rac.Angle.down, 72);
const horizontal = rac.Segment(100, 100, rac.Angle.zero, 72);


test('Identity', function identity() {
  // Instance members
  expect(rac.Segment.zero).equalsSegment(0, 0, 0, 0);

  // Angle/number parameter
  expect(diagonal).equalsSegment(55, 55, 1/8, 72);
  expect(diagonal).equalsSegment(55, 55, rac.Angle.eighth, 72);

  // Inequality
  expect(rac.Segment.zero).not.equalsSegment(7, 0, .0, 0);
  expect(rac.Segment.zero).not.equalsSegment(0, 7, .0, 0);
  expect(rac.Segment.zero).not.equalsSegment(0, 0, .7, 0);
  expect(rac.Segment.zero).not.equalsSegment(0, 0, .0, 7);

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
  expect(diagonal.equals(rac.Ray.zero))    .toBe(false);
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


test('Errors', function errors() {
  const ray = rac.Ray.yAxis;
  expect(() => {new Rac.Segment(rac, ray, 72);})
    .not.toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Missing parameters
  expect(() => {new Rac.Segment(null, ray, 72);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Segment(rac, null, 72);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Segment(rac, ray, null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);


  // Invalid ray
  expect(() => {new Rac.Segment(rac, 100, 72);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Segment(rac, "nonsense", 72);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid length
  expect(() => {new Rac.Segment(rac, ray, "nonsense");})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Segment(rac, ray, NaN);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


test('Accesors', function accesors() {
  expect(diagonal.startPoint()).equalsPoint(55, 55);
  expect(diagonal.angle()).equalsAngle(1/8);

  let cathetus = tools.cathetus(72);
  expect(diagonal.endPoint()).equalsPoint(55+cathetus, 55+cathetus);
});


test('Function withStartPoint/Extended', function withStartAndExtended() {
  expect(diagonal.withStartPoint(hunty))
    .equalsSegment(100, 100, 1/8, 72);

  const hyp = tools.hypotenuse(55);
  expect(diagonal.withStartExtended(0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withStartExtended(hyp))
    .equalsSegment(0, 0, 1/8, 72+hyp);
  expect(diagonal.withStartExtended(-hyp))
    .equalsSegment(110, 110, 1/8, 72-hyp);
});


test('Function withRay/Length', function withRayAndLength() {
  expect(diagonal.withRay(rac.Ray.zero)).equalsSegment(0, 0, 0, 72);
  expect(diagonal.withRay(rac.Ray.yAxis)).equalsSegment(0, 0, 1/4, 72);

  expect(diagonal.withLength(0)).equalsSegment(55, 55, 1/8, 0);
  expect(diagonal.withLength(100)).equalsSegment(55, 55, 1/8, 100);
});


test('Function withLengthAdd/Ratio', function withLenghtAddAndRatio() {
  expect(diagonal.withLengthAdd(0)).equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withLengthAdd(28)).equalsSegment(55, 55, 1/8, 100);
  expect(diagonal.withLengthAdd(-72)).equalsSegment(55, 55, 1/8, 0);

  expect(diagonal.withLengthRatio(0)).equalsSegment(55, 55, 1/8, 0);
  expect(diagonal.withLengthRatio(1/2)).equalsSegment(55, 55, 1/8, 36);
  expect(diagonal.withLengthRatio(1)).equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withLengthRatio(2)).equalsSegment(55, 55, 1/8, 144);
});


test('Function withAngleAdd/Shift', function withAngleAddAndShift() {
  expect(diagonal.withAngleAdd(0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withAngleAdd(rac.Angle.zero))
    .equalsSegment(55, 55, 1/8, 72);

  expect(diagonal.withAngleAdd(1/4))
    .equalsSegment(55, 55, 3/8, 72);
  expect(diagonal.withAngleAdd(-1/4))
    .equalsSegment(55, 55, 7/8, 72);

  expect(diagonal.withAngleShift(0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withAngleShift(rac.Angle.zero))
    .equalsSegment(55, 55, 1/8, 72);

  expect(diagonal.withAngleShift(1/4))
    .equalsSegment(55, 55, 3/8, 72);
  expect(diagonal.withAngleShift(1/4, false))
    .equalsSegment(55, 55, 7/8, 72);
});


test('Transforms to Arc', () => {
  expect(diagonal.arc()).equalsArc(55, 55, 72, 1/8, 1/8, true);

  expect(diagonal.arc(rac.Angle.half))
    .equalsArc(55, 55, 72, 1/8, 1/2, true);

  expect(diagonal.arc(rac.Angle.half, false))
    .equalsArc(55, 55, 72, 1/8, 1/2, false);

  expect(diagonal.arc(null, false))
    .equalsArc(55, 55, 72, 1/8, 1/8, false);
});


test.todo('Check for coverage!');

