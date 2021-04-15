'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;

const fifty = rac.Point(55, 55);
const hunty = rac.Point(100, 100);

const diagonal = rac.Ray(55, 55, rac.Angle.eighth);
const horizontal = rac.Ray(100, 100, rac.Angle.zero);
const vertical = rac.Ray(100, 100, rac.Angle.square);


test('Identity', () => {
  // Instance members
  expect(rac.Ray.zero).equalsRay(0, 0, 0);
  expect(rac.Ray.xAxis).equalsRay(0, 0, 0);
  expect(rac.Ray.yAxis).equalsRay(0, 0, 1/4);

  // Angle/number parameter
  expect(diagonal).equalsRay(55, 55, 1/8);
  expect(diagonal).equalsRay(55, 55, rac.Angle.eighth);

  // Inequality
  expect(rac.Ray.zero).not.equalsRay(7, 0, .0);
  expect(rac.Ray.zero).not.equalsRay(0, 7, .0);
  expect(rac.Ray.zero).not.equalsRay(0, 0, .7);

  // Unexpected type for equalsRay
  expect(null)            .not.equalsRay(0, 0, 0);
  expect(0)               .not.equalsRay(0, 0, 0);
  expect(rac.Angle.zero)  .not.equalsRay(0, 0, 0);
  expect(rac.Point.zero)  .not.equalsRay(0, 0, 0);
  expect(rac.Segment.zero).not.equalsRay(0, 0, 0);

  // Unexpected type for equals
  expect(diagonal.equals(null))            .toBe(false);
  expect(diagonal.equals(55))              .toBe(false);
  expect(diagonal.equals(rac.Angle.eighth)).toBe(false);
  expect(diagonal.equals(rac.Point.zero))  .toBe(false);
  expect(diagonal.equals(rac.Segment.zero)).toBe(false);
});


test('Function toString', () => {
  const ray = rac.Ray(1.12345, 2.12345, 0.12345);

  const string = ray.toString();
  expect(string).toMatch('Ray');
  expect(string).toMatch('0.12345');
  expect(string).toMatch('1.12345');
  expect(string).toMatch('2.12345');

  const cutString = ray.toString(2);
  expect(cutString).toMatch('Ray');
  expect(cutString).toMatch('0.12');
  expect(cutString).toMatch('1.12');
  expect(cutString).toMatch('2.12');
  expect(cutString).not.toMatch('0.123');
  expect(cutString).not.toMatch('1.123');
  expect(cutString).not.toMatch('2.123');
});


test('Errors', () => {
  const eighth = rac.Angle.eighth;
  expect(() => {new Rac.Ray(rac, fifty, eighth);})
    .not.toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Missing parameters
  expect(() => {new Rac.Ray(null, fifty, eighth);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Ray(rac, null, eighth);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Ray(rac, fifty, null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid start
  expect(() => {new Rac.Ray(rac, 55, eighth);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Ray(rac, "nonsense", eighth);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid angle
  expect(() => {new Rac.Ray(rac, fifty, "nonsense");})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Ray(rac, fifty, NaN);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


test('Function slope/yIntercept', () => {
  expect(hunty.ray(rac.Angle.zero).slope()).thresEquals(0);
  expect(hunty.ray(rac.Angle.half).slope()).thresEquals(0);

  expect(hunty.ray(rac.Angle.down).slope()).toBe(null);
  expect(hunty.ray(rac.Angle.up).slope()).toBe(null);

  expect(hunty.ray(rac.Angle.bottomRight).slope()).thresEquals(1);
  expect(hunty.ray(rac.Angle.topLeft).slope()).thresEquals(1);

  expect(hunty.ray(rac.Angle.topRight).slope()).thresEquals(-1);
  expect(hunty.ray(rac.Angle.bottomLeft).slope()).thresEquals(-1);

  expect(hunty.ray(rac.Angle.tr).yIntercept())
    .thresEquals(200);
  expect(hunty.ray(rac.Angle.bl).yIntercept())
    .thresEquals(200);

  expect(hunty.ray(rac.Angle.br).yIntercept())
    .thresEquals(0);
  expect(hunty.ray(rac.Angle.tl).yIntercept())
    .thresEquals(0);

  expect(hunty.ray(rac.Angle.zero).yIntercept())
    .thresEquals(100);
  expect(hunty.ray(rac.Angle.half).yIntercept())
    .thresEquals(100);

  expect(hunty.ray(rac.Angle.u).yIntercept()).toBe(null);
  expect(hunty.ray(rac.Angle.d).yIntercept()).toBe(null);
});


test('Function withStart/withAngle/withX/withY', () => {
  expect(diagonal.withStart(hunty))
    .equalsRay(100, 100, 1/8);

  expect(diagonal.withX(0)).equalsRay(0, 55, 1/8);
  expect(diagonal.withY(0)).equalsRay(55, 0, 1/8);

  expect(diagonal.withAngle(rac.Angle.half))
    .equalsRay(55, 55, 1/2);
  expect(diagonal.withAngle(1/4))
    .equalsRay(55, 55, 1/4);
});


test('Function withAngleAdd/withAngleShift', () => {
  expect(diagonal.withAngleAdd(rac.Angle.zero))
    .equalsRay(55, 55, 1/8);
  expect(diagonal.withAngleAdd(1/4))
    .equalsRay(55, 55, 3/8);
  expect(diagonal.withAngleAdd(7/8))
    .equalsRay(55, 55, 0);

  expect(diagonal.withAngleShift(rac.Angle.zero))
    .equalsRay(55, 55, 1/8);
  expect(diagonal.withAngleShift(rac.Angle.zero, false))
    .equalsRay(55, 55, 1/8);

  expect(diagonal.withAngleShift(1/4))
    .equalsRay(55, 55, 3/8);
  expect(diagonal.withAngleShift(1/4, false))
    .equalsRay(55, 55, 7/8);
});


test('Transformations', () => {
  expect(diagonal.inverse()).equalsRay(55, 55, 5/8);
  expect(horizontal.inverse()).equalsRay(100, 100, 1/2);
  expect(vertical.inverse()).equalsRay(100, 100, 3/4);

  expect(diagonal.perpendicular()).equalsRay(55, 55, 3/8);
  expect(diagonal.perpendicular(false)).equalsRay(55, 55, 7/8);
});


test('Translations', () => {
  const distance = tools.hypotenuse(55);

  expect(diagonal.translateToDistance(0))
    .equalsRay(55, 55, 1/8);
  expect(diagonal.translateToDistance(distance))
    .equalsRay(110, 110, 1/8);
  expect(diagonal.translateToDistance(-distance))
    .equalsRay(0, 0, 1/8);

  expect(diagonal.translateToAngle(rac.Angle.right, 0))
    .equalsRay(55, 55, 1/8);
  expect(diagonal.translateToAngle(rac.Angle.down, 0))
    .equalsRay(55, 55, 1/8);
  expect(diagonal.translateToAngle(rac.Angle.left, 55))
    .equalsRay(0, 55, 1/8);
  expect(diagonal.translateToAngle(rac.Angle.up, 55))
    .equalsRay(55, 0, 1/8);
  expect(diagonal.translateToAngle(rac.Angle.eighth, distance))
    .equalsRay(110, 110, 1/8);

  expect(diagonal.translatePerpendicular(0))
    .equalsRay(55, 55, 1/8);
  expect(diagonal.translatePerpendicular(distance))
    .equalsRay(0, 110, 1/8);
  expect(diagonal.translatePerpendicular(distance, false))
    .equalsRay(110, 0, 1/8);

  expect(vertical.translatePerpendicular(55))
    .equalsRay(45, 100, rac.Angle.down);
  expect(vertical.translatePerpendicular(55, false))
    .equalsRay(155, 100, rac.Angle.down);

  expect(horizontal.translatePerpendicular(55))
    .equalsRay(100, 155, rac.Angle.zero);
  expect(horizontal.translatePerpendicular(55, false))
    .equalsRay(100, 45, rac.Angle.zero);
});


test('Point operations', () => {
  expect(diagonal.angleToPoint(rac.Point.zero))
    .equalsAngle(rac.Angle.nw);
  expect(diagonal.angleToPoint(rac.Point(0, 55)))
    .equalsAngle(rac.Angle.w);
  expect(diagonal.angleToPoint(fifty))
    .equalsAngle(1/8);

  expect(diagonal.pointOrientation(hunty)).toBe(true);
  expect(diagonal.pointOrientation(fifty)).toBe(true);
  expect(diagonal.pointOrientation(rac.Point.zero)).toBe(false);

  expect(diagonal.pointOrientation(hunty.withX(0))).toBe(true);
  expect(diagonal.pointOrientation(hunty.withY(0))).toBe(false);

  expect(vertical.rayToPoint(fifty))
    .equalsRay(100, 100, rac.Angle.nw);
  expect(vertical.rayToPoint(hunty.withX(0)))
    .equalsRay(100, 100, rac.Angle.left);
  expect(vertical.rayToPoint(hunty))
    .equalsRay(100, 100, rac.Angle.down);
});


test('Axis intersection', () => {
  expect(vertical.pointAtX(55)).toBe(null);
  expect(vertical.pointAtY(55)).equalsPoint(100, 55);

  expect(horizontal.pointAtY(55)).toBe(null);
  expect(horizontal.pointAtX(55)).equalsPoint(55, 100);

  expect(diagonal.pointAtY(55)).equalsPoint(55, 55);
  expect(diagonal.pointAtX(55)).equalsPoint(55, 55);

  expect(diagonal.perpendicular().pointAtX(0))
    .equalsPoint(0, 55*2);
    expect(diagonal.perpendicular(false).pointAtX(0))
    .equalsPoint(0, 55*2);

  expect(diagonal.perpendicular().pointAtY(0))
    .equalsPoint(55*2, 0);
  expect(diagonal.perpendicular(false).pointAtY(0))
    .equalsPoint(55*2, 0);
});


test('Ray intersection', () => {
  // diagonal-vertical
  expect(diagonal.pointAtIntersection(vertical))
    .equalsPoint(100, 100);
  expect(diagonal.inverse().pointAtIntersection(vertical))
    .equalsPoint(100, 100);
  expect(vertical.pointAtIntersection(diagonal))
    .equalsPoint(100, 100);
  expect(vertical.inverse().pointAtIntersection(diagonal))
    .equalsPoint(100, 100);

  // diagonal-horizontal
  expect(diagonal.pointAtIntersection(horizontal))
    .equalsPoint(100, 100);
  expect(diagonal.inverse().pointAtIntersection(horizontal))
    .equalsPoint(100, 100);
  expect(horizontal.pointAtIntersection(diagonal))
    .equalsPoint(100, 100);
  expect(horizontal.inverse().pointAtIntersection(diagonal))
    .equalsPoint(100, 100);

  // vertical-horizontal
  expect(vertical.pointAtIntersection(horizontal))
    .equalsPoint(100, 100);
  expect(vertical.inverse().pointAtIntersection(horizontal))
    .equalsPoint(100, 100);
  expect(horizontal.pointAtIntersection(vertical))
    .equalsPoint(100, 100);
  expect(horizontal.inverse().pointAtIntersection(vertical))
    .equalsPoint(100, 100);
});


test('Ray parallel intersection', () => {
  const shiftedVertical = vertical.withStart(rac.Point.zero);
  expect(shiftedVertical.pointAtIntersection(vertical))
    .toBe(null);
  expect(shiftedVertical.pointAtIntersection(vertical.inverse()))
    .toBe(null);

  const shiftedHorizontal = horizontal.withStart(rac.Point.zero);
  expect(shiftedHorizontal.pointAtIntersection(horizontal))
    .toBe(null);
  expect(shiftedHorizontal.pointAtIntersection(horizontal.inverse()))
    .toBe(null);

  const shiftedDiagonal = diagonal.withStart(hunty);
  expect(shiftedDiagonal.pointAtIntersection(diagonal))
    .toBe(null);
  expect(shiftedDiagonal.pointAtIntersection(diagonal.inverse()))
    .toBe(null);
});


test('Point projection', () => {
  const distance = tools.hypotenuse(55);

  expect(diagonal.pointAtDistance(0)).equalsPoint(55, 55);
  expect(diagonal.pointAtDistance(distance)).equalsPoint(110, 110);
  expect(diagonal.pointAtDistance(-distance)).equalsPoint(0, 0);

  expect(diagonal.pointProjected(hunty)).equalsPoint(100, 100);
  expect(diagonal.inverse().pointProjected(fifty)).equalsPoint(55, 55);

  expect(diagonal.distanceToProjectedPoint(fifty)).thresEquals(0);
  expect(diagonal.inverse().distanceToProjectedPoint(fifty)).thresEquals(0);

  expect(diagonal.distanceToProjectedPoint(hunty))
    .thresEquals(tools.hypotenuse(45));
  expect(diagonal.inverse().distanceToProjectedPoint(hunty))
    .thresEquals(-tools.hypotenuse(45));

  expect(vertical.pointProjected(fifty)).equalsPoint(100, 55);
  expect(vertical.inverse().pointProjected(fifty)).equalsPoint(100, 55);

  expect(vertical.distanceToProjectedPoint(fifty)).thresEquals(-45)
  expect(vertical.inverse().distanceToProjectedPoint(fifty)).thresEquals(45)

  expect(horizontal.pointProjected(fifty)).equalsPoint(55, 100);
  expect(horizontal.inverse().pointProjected(fifty)).equalsPoint(55, 100);

  expect(horizontal.distanceToProjectedPoint(fifty)).thresEquals(-45)
  expect(horizontal.inverse().distanceToProjectedPoint(fifty)).thresEquals(45)
});


test('Transforms to Segment', () => {
  expect(diagonal.segment(100)).equalsSegment(55, 55, 1/8, 100);
  expect(diagonal.segment(0)).equalsSegment(55, 55, 1/8, 0);

  expect(diagonal.segmentToPoint(fifty))
    .equalsSegment(55, 55, 1/8, 0);
  expect(diagonal.segmentToPoint(rac.Point.zero))
    .equalsSegment(55, 55, rac.Angle.nw, tools.hypotenuse(55));
  expect(diagonal.segmentToPoint(hunty))
    .equalsSegment(55, 55, 1/8, tools.hypotenuse(45));

  const shiftedVertical = vertical.withY(0);
  const shiftedHorizontal = horizontal.withX(0);
  expect(shiftedHorizontal.segmentToIntersection(shiftedVertical))
    .equalsSegment(0, 100, rac.Angle.right, 100);
  expect(shiftedVertical.segmentToIntersection(shiftedHorizontal))
    .equalsSegment(100, 0, rac.Angle.down, 100);

  // Parallels
  expect(vertical.segmentToIntersection(shiftedVertical))
    .toBe(null);
  expect(horizontal.segmentToIntersection(shiftedHorizontal))
    .toBe(null);

  // Intersecion in rays
  expect(vertical.segmentToIntersection(diagonal))
    .equalsSegment(100, 100, rac.Angle.down, 0);
  expect(vertical.segmentToIntersection(horizontal))
    .equalsSegment(100, 100, rac.Angle.down, 0);
  expect(vertical.segmentToIntersection(diagonal))
    .equalsSegment(100, 100, rac.Angle.down, 0);
});


test('Transforms to Arc', () => {
  // Angle/Number parameter
  expect(diagonal.arc(100, 1/2))
    .equalsArc(55, 55, 100, 1/8, 1/2, true);
  expect(diagonal.arc(100, rac.Angle.half))
    .equalsArc(55, 55, 100, 1/8, 1/2, true);

  // Default/Nullable parameters
  expect(diagonal.arc(100))
    .equalsArc(55, 55, 100, 1/8, 1/8, true);
  expect(diagonal.arc(100, null, false))
    .equalsArc(55, 55, 100, 1/8, 1/8, false);
  expect(diagonal.arc(100, 1/2))
    .equalsArc(55, 55, 100, 1/8, 1/2, true);
  expect(diagonal.arc(100, 3/4, false))
    .equalsArc(55, 55, 100, 1/8, 3/4, false);

  // Extra check horizonta/vertical
  expect(horizontal.arc(55))
    .equalsArc(100, 100, 55, 0, 0, true);
  expect(vertical.arc(55))
    .equalsArc(100, 100, 55, 1/4, 1/4, true);

  // Angle/Number parameter
  expect(diagonal.arcToAngleDistance(100, 0))
    .equalsArc(55, 55, 100, 1/8, 1/8, true);
  expect(diagonal.arcToAngleDistance(100, rac.Angle.zero))
    .equalsArc(55, 55, 100, 1/8, 1/8, true);

  // Zero distance
  expect(diagonal.arcToAngleDistance(100, 0))
    .equalsArc(55, 55, 100, 1/8, 1/8, true);
  expect(diagonal.arcToAngleDistance(100, 0, false))
    .equalsArc(55, 55, 100, 1/8, 1/8, false);

  // Default/Nullable parameters
  expect(diagonal.arcToAngleDistance(100, 1/4))
    .equalsArc(55, 55, 100, 1/8, 3/8, true);
  expect(diagonal.arcToAngleDistance(100, 1/4, false))
    .equalsArc(55, 55, 100, 1/8, 7/8, false);
});

