'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const quarter = rac.Arc(0, 0, 36, rac.Angle.up, rac.Angle.left, false);
const semi = rac.Arc(0, 0, 36, rac.Angle.up, rac.Angle.left, true);
const half = rac.Arc(100, 100, 55, rac.Angle.up, rac.Angle.down);
const circle = rac.Arc(72, 72, 72, rac.Angle.down);


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

  // Unexpected type for equalsArc
  expect(null)            .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(0)               .not.equalsArc(0, 0, 0, 0, 0, true);
  expect('0')             .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(rac.Angle.zero)  .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(rac.Point.zero)  .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(rac.Ray.zero)    .not.equalsArc(0, 0, 0, 0, 0, true);
  expect(rac.Segment.zero).not.equalsArc(0, 0, 0, 0, 0, true);

  // Expected type for equals
  expect(half.equals(half))        .toBe(true);
  expect(half.equals(rac.Arc.Zero)).toBe(false);

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


tools.test( function accesors() {
  expect(quarter.length()).toBe(36 * Rac.TAU / 4);
  expect(semi.length())   .toBe(36 * Rac.TAU * 3 / 4);
  expect(half.length())   .toBe(55 * Rac.TAU / 2);
  expect(circle.length()) .toBe(72 * Rac.TAU);

  expect(quarter.circumference()).toBe(36 * Rac.TAU);
  expect(semi.circumference())   .toBe(36 * Rac.TAU);
  expect(half.circumference())   .toBe(55 * Rac.TAU);
  expect(circle.circumference()) .toBe(72 * Rac.TAU);

  expect(quarter.angleDistance()).equalsAngle(1/4);
  expect(semi.angleDistance())   .equalsAngle(3/4);
  expect(half.angleDistance())   .equalsAngle(1/2);
  expect(circle.angleDistance()) .equalsAngle(0);

  expect(quarter.startPoint())  .equalsPoint(0,-36);
  expect(quarter.endPoint())    .equalsPoint(-36,0);
  expect(quarter.startRay())    .equalsRay(0, 0, rac.Angle.up);
  expect(quarter.endRay())      .equalsRay(0, 0, rac.Angle.left);
  expect(quarter.startSegment()).equalsSegment(0, 0, rac.Angle.up, 36);
  expect(quarter.endSegment())  .equalsSegment(0, 0, rac.Angle.left, 36);
  expect(quarter.chordSegment()).equalsSegment(0, -36, rac.Angle.sw, tools.hypotenuse(36));

  expect(circle.startPoint())  .equalsPoint(72, 144);
  expect(circle.endPoint())    .equalsPoint(72, 144);
  expect(circle.startRay())    .equalsRay(72, 72, rac.Angle.down);
  expect(circle.endRay())      .equalsRay(72, 72, rac.Angle.down);
  expect(circle.startSegment()).equalsSegment(72, 72, rac.Angle.down, 72);
  expect(circle.endSegment())  .equalsSegment(72, 72, rac.Angle.down, 72);
  expect(circle.chordSegment()).equalsSegment(72, 144, rac.Angle.left, 0);
});


tools.test( function isCircle() {
  expect(quarter.isCircle()).toBe(false);
  expect(circle.isCircle()).toBe(true);

  const threshold = rac.unitaryEqualityThreshold;
  const bump = threshold/16;
  const aboveThreshold = threshold + bump;
  const belowThreshold = threshold - bump;

  expect(circle.withStart(1/4 + belowThreshold).isCircle()).toBe(true);
  expect(circle.withStart(1/4 + aboveThreshold).isCircle()).toBe(false);

  expect(circle.withEnd(1/4 - belowThreshold).isCircle()).toBe(true);
  expect(circle.withEnd(1/4 - aboveThreshold).isCircle()).toBe(false);
});


tools.test( function withCenterStartEndRadiusClockwise() {
  expect(half.withCenter(rac.Point.zero))
    .equalsArc(0, 0, 55, rac.Angle.up, rac.Angle.down, true);

  expect(half.withStart(0))
    .equalsArc(100, 100, 55, rac.Angle.zero, rac.Angle.down, true);
  expect(half.withStart(rac.Angle.zero))
    .equalsArc(100, 100, 55, rac.Angle.zero, rac.Angle.down, true);

  expect(half.withEnd(0))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.zero, true);
  expect(half.withEnd(rac.Angle.zero))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.zero, true);

  expect(half.withRadius(72))
    .equalsArc(100, 100, 72, rac.Angle.up, rac.Angle.down, true);

  expect(half.withClockwise(false))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.down, false);
});


tools.test( function withAngleDistance() {
  // Angle/number parameter
  expect(quarter.withAngleDistance(rac.Angle.zero))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.up, false);
  expect(quarter.withAngleDistance(0))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.up, false);

  expect(quarter.withAngleDistance(1/2))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.down, false);
  expect(quarter.withAngleDistance(1))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.up, false);
  expect(quarter.withAngleDistance(7))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.up, false);

  expect(quarter.withAngleDistance(-1/4))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.right, false);
});


tools.test( function withLengthAndRatio() {
  const circumference = 55 * Rac.TAU;
  expect(half.withLength(0))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.up, true);
  expect(half.withLength(circumference))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.up, true);
  expect(half.withLength(-circumference))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.up, true);
  expect(half.withLength(7 * circumference))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.up, true);

  expect(half.withLength(circumference / 4))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.right, true);
  expect(half.withLength(-circumference / 4))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.left, true);

  expect(half.withLengthRatio(0))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.up, true);
  expect(half.withLengthRatio(1/2))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.right, true);
  expect(half.withLengthRatio(-1/2))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.left, true);
  expect(half.withLengthRatio(2))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.up, true);
  expect(half.withLengthRatio(-2))
    .equalsArc(100, 100, 55, rac.Angle.up, rac.Angle.up, true);


  expect(circle.withLengthRatio(0))
    .equalsArc(72, 72, 72, rac.Angle.down, rac.Angle.down, true);
  expect(circle.withLengthRatio(1/4))
    .equalsArc(72, 72, 72, rac.Angle.down, rac.Angle.left, true);
  expect(circle.withLengthRatio(-1/4))
    .equalsArc(72, 72, 72, rac.Angle.down, rac.Angle.right, true);
  expect(circle.withLengthRatio(2))
    .equalsArc(72, 72, 72, rac.Angle.down, rac.Angle.down, true);
  expect(circle.withLengthRatio(-2))
    .equalsArc(72, 72, 72, rac.Angle.down, rac.Angle.down, true);
});


tools.test( function withStartEndAnglesTowardsPoint() {
  const fifty = rac.Point(55, 55);
  const eighth = rac.Angle.eighth;

  expect(quarter.withStartTowardsPoint(fifty))
    .equalsArc(0, 0, 36, eighth, rac.Angle.left, false);
  expect(quarter.withEndTowardsPoint(fifty))
    .equalsArc(0, 0, 36, rac.Angle.up, eighth, false);
  expect(quarter.withAnglesTowardsPoint(fifty, fifty))
    .equalsArc(0, 0, 36, eighth, eighth, false);

  expect(quarter.withStartTowardsPoint(rac.Point.zero))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.left, false);
  expect(quarter.withEndTowardsPoint(rac.Point.zero))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.left, false);
  expect(quarter.withAnglesTowardsPoint(rac.Point.zero, rac.Point.zero))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.left, false);

  // nullable parameter
  expect(quarter.withAnglesTowardsPoint(fifty))
    .equalsArc(0, 0, 36, eighth, eighth, false);
  expect(quarter.withAnglesTowardsPoint(fifty, null))
    .equalsArc(0, 0, 36, eighth, eighth, false);
  expect(quarter.withAnglesTowardsPoint(rac.Point.zero))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.up, false);
  expect(quarter.withAnglesTowardsPoint(rac.Point.zero, null))
    .equalsArc(0, 0, 36, rac.Angle.up, rac.Angle.up, false);
});


tools.test( function reverse() {
  expect(quarter.reverse())
    .equalsArc(0, 0, 36, rac.Angle.left, rac.Angle.up, true);
  expect(semi.reverse())
    .equalsArc(0, 0, 36, rac.Angle.left, rac.Angle.up, false);
  expect(half.reverse())
    .equalsArc(100, 100, 55, rac.Angle.down, rac.Angle.up, false);
  expect(circle.reverse())
    .equalsArc(72, 72, 72, rac.Angle.down, rac.Angle.down, false);
});


tools.test( function clampToAngles() {
  const sixteenth = rac.Angle.sixteenth;
  const endLimit = rac.Angle(1/2 + 1/16);
  const startLimit = rac.Angle(3/4 - 1/16);
  // Angle/number parameters
  expect(quarter.clampToAngles(rac.Angle(5/8)))
    .equalsAngle(5/8);
  expect(quarter.clampToAngles(5/8))
    .equalsAngle(5/8);
  expect(quarter.clampToAngles(rac.Angle.left, sixteenth, sixteenth))
    .equalsAngle(endLimit);
  expect(quarter.clampToAngles(rac.Angle.left, 1/16, 1/16))
    .equalsAngle(endLimit);
  expect(quarter.clampToAngles(rac.Angle.up, sixteenth, sixteenth))
    .equalsAngle(startLimit);
  expect(quarter.clampToAngles(rac.Angle.up, 1/16, 1/16))
    .equalsAngle(startLimit);

  // Outside range, closer to end
  expect(quarter.clampToAngles(rac.Angle.sw))
    .equalsAngle(rac.Angle.left);
  expect(quarter.clampToAngles(rac.Angle.sw, 0, sixteenth))
    .equalsAngle(endLimit);

  // Outside range, closer to start
  expect(quarter.clampToAngles(rac.Angle.ne))
    .equalsAngle(rac.Angle.up);
  expect(quarter.clampToAngles(rac.Angle.ne, sixteenth))
    .equalsAngle(startLimit);

  // Outside range, right in middle, snaps to start
  expect(quarter.clampToAngles(rac.Angle.se, sixteenth, sixteenth))
    .equalsAngle(startLimit);

  // TODO: Invalid range, centered on insets

  // TODO: Invalid range, clamped to start

  // TODO: Invalid range, clamped to end
});


tools.test.todo( function containsAngle() {
});


tools.test.todo( function containsProjectedPoint() {
});


tools.test.todo( function shiftAngle() {
});


tools.test.todo( function distanceFromStart() {
});


tools.test.todo( function pointAtAngle() {
});



tools.test.todo( function pointAtAngleDistanceAndRatio() {
});


test.todo('Check for coverage!');

