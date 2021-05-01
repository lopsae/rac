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
  expect(quarter.clampToAngles(5/8, sixteenth, sixteenth))
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

  // Exact range, centered on insets
  expect(quarter.clampToAngles(rac.Angle.nw, 1/8, 1/8))
    .equalsAngle(rac.Angle.nw);
  expect(quarter.clampToAngles(rac.Angle.ne, 1/8, 1/8))
    .equalsAngle(rac.Angle.nw);
  expect(quarter.clampToAngles(rac.Angle.sw, 1/8, 1/8))
    .equalsAngle(rac.Angle.nw);

  // Invalid range, centered on insets
  expect(quarter.clampToAngles(rac.Angle.nw, 1/8, 1/4))
    .equalsAngle(rac.Angle.nwn);
  expect(quarter.clampToAngles(rac.Angle.ne, 1/8, 1/4))
    .equalsAngle(rac.Angle.nwn);
  expect(quarter.clampToAngles(rac.Angle.sw, 1/8, 1/4))
    .equalsAngle(rac.Angle.nwn);

  expect(quarter.clampToAngles(rac.Angle.nw, 1/4, 1/8))
    .equalsAngle(rac.Angle.nww);
  expect(quarter.clampToAngles(rac.Angle.ne, 1/4, 1/8))
    .equalsAngle(rac.Angle.nww);
  expect(quarter.clampToAngles(rac.Angle.sw, 1/4, 1/8))
    .equalsAngle(rac.Angle.nww);

  // Invalid range, clamped to start
  expect(quarter.clampToAngles(rac.Angle.nw, 0, 3/4))
    .equalsAngle(rac.Angle.up);
  expect(quarter.clampToAngles(rac.Angle.ne, 0, 3/4))
    .equalsAngle(rac.Angle.up);
  expect(quarter.clampToAngles(rac.Angle.sw, 0, 3/4))
    .equalsAngle(rac.Angle.up);

  // Invalid range, clamped to end
  expect(quarter.clampToAngles(rac.Angle.nw, 3/4, 0))
    .equalsAngle(rac.Angle.left);
  expect(quarter.clampToAngles(rac.Angle.ne, 3/4, 0))
    .equalsAngle(rac.Angle.left);
  expect(quarter.clampToAngles(rac.Angle.sw, 3/4, 0))
    .equalsAngle(rac.Angle.left);
});


tools.test( function clampToAnglesCircle() {
  // Inside range
  expect(circle.clampToAngles(rac.Angle.down))
    .equalsAngle(rac.Angle.down);
  expect(circle.clampToAngles(rac.Angle.eighth))
    .equalsAngle(rac.Angle.eighth);
  expect(circle.clampToAngles(rac.Angle.neighth))
    .equalsAngle(rac.Angle.neighth);

  // Inside range with insets
  expect(circle.clampToAngles(rac.Angle.up, 1/4, 1/4))
    .equalsAngle(rac.Angle.up);
  expect(circle.clampToAngles(rac.Angle.left, 1/4, 1/4))
    .equalsAngle(rac.Angle.left);
  expect(circle.clampToAngles(rac.Angle.right, 1/4, 1/4))
    .equalsAngle(rac.Angle.right);

  // Outside range, closer to start
  expect(circle.clampToAngles(rac.Angle.sww, 1/4))
    .equalsAngle(rac.Angle.left);
  expect(circle.clampToAngles(rac.Angle.sww, 1/4, 1/4))
    .equalsAngle(rac.Angle.left);

  // Outside range, closer to end
  expect(circle.clampToAngles(rac.Angle.see, 0, 1/4))
    .equalsAngle(rac.Angle.right);
  expect(circle.clampToAngles(rac.Angle.see, 1/4, 1/4))
    .equalsAngle(rac.Angle.right);

  // Outside range, right in middle, snaps to start
  expect(circle.clampToAngles(rac.Angle.down, 1/4, 1/4))
    .equalsAngle(rac.Angle.left);

  // Exact range, centered on insets
  expect(circle.clampToAngles(rac.Angle.down, 3/4, 1/4))
    .equalsAngle(rac.Angle.right);
  expect(circle.clampToAngles(rac.Angle.up, 3/4, 1/4))
    .equalsAngle(rac.Angle.right);
  expect(circle.clampToAngles(rac.Angle.right, 3/4, 1/4))
    .equalsAngle(rac.Angle.right);
  expect(circle.clampToAngles(rac.Angle.left, 3/4, 1/4))
    .equalsAngle(rac.Angle.right);

  // Invalid range, centered on insets
  expect(circle.clampToAngles(rac.Angle.down, 3/4, 1/2))
    .equalsAngle(rac.Angle.ne);
  expect(circle.clampToAngles(rac.Angle.up, 3/4, 1/2))
    .equalsAngle(rac.Angle.ne);
  expect(circle.clampToAngles(rac.Angle.right, 3/4, 1/2))
    .equalsAngle(rac.Angle.ne);
  expect(circle.clampToAngles(rac.Angle.left, 3/4, 1/2))
    .equalsAngle(rac.Angle.ne);
});


tools.test( function containsAngle() {
  expect(circle.containsAngle(rac.Angle.right)).toBe(true);
  expect(circle.containsAngle(rac.Angle.down)) .toBe(true);
  expect(circle.containsAngle(rac.Angle.left)) .toBe(true);
  expect(circle.containsAngle(rac.Angle.up))   .toBe(true);

  expect(quarter.containsAngle(rac.Angle.right)).toBe(false);
  expect(quarter.containsAngle(rac.Angle.down)) .toBe(false);
  expect(quarter.containsAngle(rac.Angle.left)) .toBe(true);
  expect(quarter.containsAngle(rac.Angle.up))   .toBe(true);
});


tools.test( function containsProjectedPoint() {
  const hunty = rac.Point(100, 100);
  const nunty = rac.Point(-100, -100);
  const above = rac.Point(0, -100);
  const below = rac.Point(0, 100);

  expect(circle.containsProjectedPoint(hunty)).toBe(true);
  expect(circle.containsProjectedPoint(nunty)).toBe(true);
  expect(circle.containsProjectedPoint(above)).toBe(true);
  expect(circle.containsProjectedPoint(below)).toBe(true);

  expect(quarter.containsProjectedPoint(hunty)).toBe(false);
  expect(quarter.containsProjectedPoint(nunty)).toBe(true);
  expect(quarter.containsProjectedPoint(above)).toBe(true);
  expect(quarter.containsProjectedPoint(below)).toBe(false);
});


tools.test( function shiftAngle() {
  // Angle/number parameter
  expect(quarter.shiftAngle(rac.Angle.eighth)).equalsAngle(5/8);
  expect(quarter.shiftAngle(1/8))             .equalsAngle(5/8);

  expect(circle.shiftAngle(0))  .equalsAngle(rac.Angle.down);
  expect(circle.shiftAngle(1/4)).equalsAngle(rac.Angle.left);
});


tools.test( function distanceFromStart() {
  // Angle/number parameter
  expect(quarter.distanceFromStart(rac.Angle.zero)).equalsAngle(3/4);
  expect(quarter.distanceFromStart(0))             .equalsAngle(3/4);

  expect(circle.distanceFromStart(rac.Angle.down)) .equalsAngle(0/4);
  expect(circle.distanceFromStart(rac.Angle.left)) .equalsAngle(1/4);
  expect(circle.distanceFromStart(rac.Angle.right)).equalsAngle(3/4);
});


tools.test( function pointAtAngle() {
  // Angle/number parameter
  expect(quarter.pointAtAngle(rac.Angle.zero)).equalsPoint(36, 0);
  expect(quarter.pointAtAngle(0))             .equalsPoint(36, 0);

  const cathetus = tools.cathetus(36);
  expect(quarter.pointAtAngle(rac.Angle.eighth)).equalsPoint(cathetus, cathetus);
  expect(quarter.pointAtAngle(rac.Angle.left)).equalsPoint(-36, 0);
});



tools.test( function pointAtAngleDistance() {
  // Angle/number parameter
  expect(quarter.pointAtAngleDistance(rac.Angle.zero)).equalsPoint(0, -36);
  expect(quarter.pointAtAngleDistance(0))             .equalsPoint(0, -36);

  expect(quarter.pointAtAngleDistance(1/4)).equalsPoint(-36, 0);
  expect(quarter.pointAtAngleDistance(3/4)).equalsPoint(36, 0);

  expect(circle.pointAtAngleDistance(0/4)).equalsPoint(72, 144);
  expect(circle.pointAtAngleDistance(1/4)).equalsPoint(0, 72);
  expect(circle.pointAtAngleDistance(3/4)).equalsPoint(144, 72);
});


tools.test( function pointAtLengthAndRatio() {
  const circumference = 36 * Rac.TAU;
  expect(quarter.pointAtLength(0))               .equalsPoint(0, -36);
  expect(quarter.pointAtLength(circumference))   .equalsPoint(0, -36);
  expect(quarter.pointAtLength(circumference*7)) .equalsPoint(0, -36);
  expect(quarter.pointAtLength(circumference/4)) .equalsPoint(-36, 0);
  expect(quarter.pointAtLength(-circumference/4)).equalsPoint(36, 0);

  expect(quarter.pointAtLengthRatio(0)) .equalsPoint(0, -36);
  expect(quarter.pointAtLengthRatio(1)) .equalsPoint(-36, 0);
  expect(quarter.pointAtLengthRatio(2)) .equalsPoint(0, 36);
  expect(quarter.pointAtLengthRatio(-1)).equalsPoint(36, 0);

  expect(circle.pointAtLengthRatio(0))   .equalsPoint(72, 144);
  expect(circle.pointAtLengthRatio(1))   .equalsPoint(72, 144);
  expect(circle.pointAtLengthRatio(-7))  .equalsPoint(72, 144);
  expect(circle.pointAtLengthRatio(7))   .equalsPoint(72, 144);
  expect(circle.pointAtLengthRatio(1/2)) .equalsPoint(72, 0);
  expect(circle.pointAtLengthRatio(1/4)) .equalsPoint(0, 72);
  expect(circle.pointAtLengthRatio(-1/4)).equalsPoint(144, 72);
});


tools.test( function radiusSegmentAtAngleAndTowardsPoint() {
  // Angle/number parameter
  expect(quarter.radiusSegmentAtAngle(rac.Angle.eighth))
    .equalsSegment(0, 0, 1/8, 36);
  expect(quarter.radiusSegmentAtAngle(1/8))
    .equalsSegment(0, 0, 1/8, 36);

  expect(quarter.radiusSegmentAtAngle(7/8))
    .equalsSegment(0, 0, 7/8, 36);
  expect(rac.Arc.zero.radiusSegmentAtAngle(5/8))
    .equalsSegment(0, 0, 5/8, 0);

  expect(quarter.radiusSegmentTowardsPoint(rac.Point(55, 55)))
    .equalsSegment(0, 0, 1/8, 36);
  expect(quarter.radiusSegmentTowardsPoint(rac.Point(55, -55)))
    .equalsSegment(0, 0, 7/8, 36);
  expect(rac.Arc.zero.radiusSegmentTowardsPoint(rac.Point(-55, -55)))
    .equalsSegment(0, 0, 5/8, 0);
});


tools.test( function intersectionChord() {
  const cathetus = tools.cathetus(55);
  const aArc = rac.Arc(cathetus, cathetus, 55, rac.Angle.up, rac.Angle.down, true);
  const bArc = rac.Arc(-cathetus, cathetus, 55, rac.Angle.up, rac.Angle.down, false);
  const outside = rac.Arc(0, -cathetus*2, 55, rac.Angle.up, rac.Angle.down, true);
  const inside = rac.Arc(cathetus, cathetus, 22, rac.Angle.up, rac.Angle.down, false);
  const edge = rac.Arc.zero;

  // Intersection
  expect(aArc.intersectionChord(bArc))
    .equalsSegment(0, cathetus*2, rac.Angle.up, cathetus*2);
  expect(aArc.reverse().intersectionChord(bArc))
    .equalsSegment(0, 0, rac.Angle.down, cathetus*2);

  expect(bArc.intersectionChord(aArc))
    .equalsSegment(0, cathetus*2, rac.Angle.up, cathetus*2);
  expect(bArc.reverse().intersectionChord(aArc))
    .equalsSegment(0, 0, rac.Angle.down, cathetus*2);

  // Same arc
  expect(aArc.intersectionChord(aArc)).toBe(null);
  expect(bArc.intersectionChord(bArc)).toBe(null);

  // No intersection, outside
  expect(aArc.intersectionChord(outside)).toBe(null);
  expect(bArc.intersectionChord(outside)).toBe(null);

  // No intersection, inside
  expect(aArc.intersectionChord(inside)).toBe(null);

  // Zero arc at edge
  expect(aArc.intersectionChord(edge))
    .equalsSegment(0, 0, rac.Angle.ne, 0);
  expect(bArc.intersectionChord(edge))
    .equalsSegment(0, 0, rac.Angle.nw, 0);
});


tools.test( function intersectionChordWithRay() {
  const cathetus = tools.cathetus(55);
  const touchesOrigin = rac.Arc(cathetus, cathetus, 55, 1/4, 3/4, false);
  // Intersection
  expect(touchesOrigin.intersectionChordWithRay(rac.Ray.xAxis))
    .equalsSegment(0, 0, 0, cathetus*2);
  expect(touchesOrigin.intersectionChordWithRay(rac.Ray.yAxis))
    .equalsSegment(0, 0, 1/4, cathetus*2);

  // No intersection
  expect(half.intersectionChordWithRay(rac.Ray.xAxis)).toBe(null);
  expect(half.intersectionChordWithRay(rac.Ray.yAxis)).toBe(null);

  // Through center
  expect(quarter.intersectionChordWithRay(rac.Ray.xAxis))
    .equalsSegment(-36, 0, 0, 36*2);
  expect(quarter.intersectionChordWithRay(rac.Ray.yAxis))
    .equalsSegment(0, -36, 1/4, 36*2);

  // Tangent intersection
  expect(circle.intersectionChordWithRay(rac.Ray.xAxis))
    .equalsSegment(72, 0, 0, 0);
  expect(circle.intersectionChordWithRay(rac.Ray.yAxis))
    .equalsSegment(0, 72, 1/4, 0);

  // Zero arc
  expect(rac.Arc.zero.intersectionChordWithRay(rac.Ray.xAxis))
    .equalsSegment(0, 0, 0, 0);
  expect(rac.Arc.zero.intersectionChordWithRay(rac.Ray.yAxis))
    .equalsSegment(0, 0, 1/4, 0);

  // Zero arc, no intersection
  const inverseDiag = rac.Ray(55, 55, 3/8);
  expect(rac.Arc.zero.intersectionChordWithRay(inverseDiag)).toBe(null);
});


tools.test( function intersectionChordEndWithRay() {
  const cathetus = tools.cathetus(55);
  const touchesOrigin = rac.Arc(cathetus, cathetus, 55, 1/4, 3/4, false);
  // Intersection
  expect(touchesOrigin.intersectionChordEndWithRay(rac.Ray.xAxis))
    .equalsPoint(cathetus*2, 0);
  expect(touchesOrigin.intersectionChordEndWithRay(rac.Ray.yAxis))
    .equalsPoint(0, cathetus*2);

  // No intersection
  expect(half.intersectionChordEndWithRay(rac.Ray.xAxis)).toBe(null);
  expect(half.intersectionChordEndWithRay(rac.Ray.yAxis)).toBe(null);

  // No intersection, projected
  expect(half.intersectionChordEndWithRay(rac.Ray.xAxis, true))
    .equalsPoint(100, 45);
  expect(half.intersectionChordEndWithRay(rac.Ray.yAxis, true))
    .equalsPoint(45, 100);

  // Through center
  expect(quarter.intersectionChordEndWithRay(rac.Ray.xAxis))
    .equalsPoint(36, 0);
  expect(quarter.intersectionChordEndWithRay(rac.Ray.yAxis))
    .equalsPoint(0, 36);

  // Tangent intersection
  expect(circle.intersectionChordEndWithRay(rac.Ray.xAxis))
    .equalsPoint(72, 0);
  expect(circle.intersectionChordEndWithRay(rac.Ray.yAxis))
    .equalsPoint(0, 72);

  // Zero arc
  expect(rac.Arc.zero.intersectionChordEndWithRay(rac.Ray.xAxis))
    .equalsPoint(0, 0);
  expect(rac.Arc.zero.intersectionChordEndWithRay(rac.Ray.yAxis))
    .equalsPoint(0, 0);

  // Zero arc, no intersection
  const inverseDiag = rac.Ray(55, 55, 3/8);
  expect(rac.Arc.zero.intersectionChordEndWithRay(inverseDiag)).toBe(null);
  expect(rac.Arc.zero.intersectionChordEndWithRay(inverseDiag, true))
    .equalsPoint(0, 0);
});


tools.test( function intersectionArc() {
  const cathetus = tools.cathetus(55);
  const aArc = rac.Arc(cathetus, cathetus, 55, rac.Angle.up, rac.Angle.down, true);
  const bArc = rac.Arc(-cathetus, cathetus, 55, rac.Angle.up, rac.Angle.down, false);
  const outside = rac.Arc(0, -cathetus*2, 55, rac.Angle.up, rac.Angle.down, true);
  const inside = rac.Arc(cathetus, cathetus, 22, rac.Angle.up, rac.Angle.down, false);
  const edge = rac.Arc.zero;

  // Intersection
  expect(aArc.intersectionArc(bArc))
    .equalsArc(cathetus, cathetus, 55, rac.Angle.sw, rac.Angle.nw, true);
  expect(aArc.reverse().intersectionArc(bArc))
    .equalsArc(cathetus, cathetus, 55, rac.Angle.nw, rac.Angle.sw, false);

  expect(bArc.intersectionArc(aArc))
    .equalsArc(-cathetus, cathetus, 55, rac.Angle.se, rac.Angle.ne, false);
  expect(bArc.reverse().intersectionArc(aArc))
    .equalsArc(-cathetus, cathetus, 55, rac.Angle.ne, rac.Angle.se, true);

  // Same arc
  expect(aArc.intersectionArc(aArc)).toBe(null);
  expect(bArc.intersectionArc(bArc)).toBe(null);

  // No intersection, outside
  expect(aArc.intersectionArc(outside)).toBe(null);
  expect(bArc.intersectionArc(outside)).toBe(null);

  // No intersection, inside
  expect(aArc.intersectionArc(inside)).toBe(null);

  // Zero arc at edge
  expect(aArc.intersectionArc(edge))
    .equalsArc(cathetus, cathetus, 55, rac.Angle.nw, rac.Angle.nw, true);
  expect(bArc.intersectionArc(edge))
    .equalsArc(-cathetus, cathetus, 55, rac.Angle.ne, rac.Angle.ne, false);
});


tools.test( function segmentTangentToArc() {
  const cathetus = tools.cathetus(36);
  const otherArc = rac.Arc(0, cathetus*4, 36, 0, 1/2, true);
  const edgeQuarter = rac.Arc(36, 0, 0);

  // Same side tangent
  expect(quarter.segmentTangentToArc(otherArc))
    .equalsSegment(-36, 0, 1/4, cathetus*4);
  expect(otherArc.segmentTangentToArc(quarter, false, false))
    .equalsSegment(-36, cathetus*4, 3/4, cathetus*4);

  expect(quarter.segmentTangentToArc(otherArc, false, false))
    .equalsSegment(36, 0, 1/4, cathetus*4);
  expect(otherArc.segmentTangentToArc(quarter))
    .equalsSegment(36, cathetus*4, 3/4, cathetus*4);


  // Same side, zero length tangent
  const insideQuarter = rac.Arc(-26, 0, 10);
  expect(quarter.segmentTangentToArc(insideQuarter))
    .equalsSegment(-36, 0, 1/4, 0);
  expect(insideQuarter.segmentTangentToArc(quarter, false, false))
    .equalsSegment(-36, 0, 3/4, 0);

  expect(quarter.segmentTangentToArc(insideQuarter, false, false))
    .equalsSegment(-36, 0, 3/4, 0);
  expect(insideQuarter.segmentTangentToArc(quarter))
    .equalsSegment(-36, 0, 1/4, 0);

  // Same side, zero arc, zero length tangent
  expect(quarter.segmentTangentToArc(edgeQuarter))
    .equalsSegment(36, 0, 3/4, 0);
  expect(edgeQuarter.segmentTangentToArc(quarter, false, false))
    .equalsSegment(36, 0, 1/4, 0);

  expect(quarter.segmentTangentToArc(edgeQuarter, false, false))
    .equalsSegment(36, 0, 1/4, 0);
  expect(edgeQuarter.segmentTangentToArc(quarter))
    .equalsSegment(36, 0, 3/4, 0);

  // Opposite side tangent
  expect(quarter.segmentTangentToArc(otherArc, true, false))
    .equalsSegment(-cathetus, cathetus, 1/8, 72);
  expect(otherArc.segmentTangentToArc(quarter, true, false))
    .equalsSegment(cathetus, cathetus*3, 5/8, 72);

  expect(quarter.segmentTangentToArc(otherArc, false, true))
    .equalsSegment(cathetus, cathetus, 3/8, 72);
  expect(otherArc.segmentTangentToArc(quarter, false, true))
    .equalsSegment(-cathetus, cathetus*3, 7/8, 72);

  // Opposite side, zero length tangent
  const outsideQuarter = rac.Arc(-46, 0, 10);
  expect(quarter.segmentTangentToArc(outsideQuarter, true, false))
    .equalsSegment(-36, 0, 1/4, 0);
  expect(outsideQuarter.segmentTangentToArc(quarter, true, false))
    .equalsSegment(-36, 0, 3/4, 0);

  expect(quarter.segmentTangentToArc(outsideQuarter, false, true))
    .equalsSegment(-36, 0, 3/4, 0);
  expect(outsideQuarter.segmentTangentToArc(quarter, false, true))
    .equalsSegment(-36, 0, 1/4, 0);

  // Opposite side, zero arc, zero length tangent
  expect(quarter.segmentTangentToArc(edgeQuarter, true, false))
    .equalsSegment(36, 0, 3/4, 0);
  expect(edgeQuarter.segmentTangentToArc(quarter, true, false))
    .equalsSegment(36, 0, 1/4, 0);

  expect(quarter.segmentTangentToArc(edgeQuarter, false, true))
    .equalsSegment(36, 0, 1/4, 0);
  expect(edgeQuarter.segmentTangentToArc(quarter, false, true))
    .equalsSegment(36, 0, 3/4, 0);

  // Invalid, same center
  expect(quarter.segmentTangentToArc(quarter)).toBe(null);
  expect(rac.Arc.zero.segmentTangentToArc(rac.Arc.zero)).toBe(null);

  // Invalid same side tangent (arc in arc)

  // Invalid opposite side tangent (arcs touch)

  // Zero arc start

  // Zero arc end
});


tools.test.todo( function divideToArcs() {
});


tools.test.todo( function divideToSegments() {
});


tools.test.todo( function divideToBeziers() {
});


// tools.test.only( function testor() {
// });


test.todo('Check for coverage!');

