'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const hunty = rac.Point(100, 100);
const fifty = rac.Point(55, 55);


test('Identity', () => {
  expect(null).not.equalsPoint(100, 100);

  expect(rac.Point.zero).equalsPoint(0, 0);
  expect(rac.Point.origin).equalsPoint(0, 0);

  expect(hunty).equalsPoint(100, 100);
  expect(fifty).not.equalsPoint(100, 100);

  let string = rac.Point(111, 222).toString();
  expect(string).toMatch('Point');
  expect(string).toMatch('111');
  expect(string).toMatch('222');
});


test('Errors', () => {
  expect(() => {new Rac.Point(null, 100, 100);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Point(rac, null, 100);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Point(rac, 100, "nonsense");})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Point(rac, NaN, 100);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


test('Function withX/Y', () => {
  expect(hunty.withX(77))
    .equalsPoint(77, 100);
  expect(hunty.withY(77))
    .equalsPoint(100, 77);
});


test('Function add/sub', () => {
  expect(hunty.addPoint(fifty))
    .equalsPoint(155, 155);
  expect(hunty.add(11, 11))
    .equalsPoint(111, 111);

  expect(hunty.subtractPoint(fifty))
    .equalsPoint(45, 45);
  expect(hunty.subtract(1, 1))
    .equalsPoint(99, 99);

  expect(hunty.addX(55)).equalsPoint(155, 100);
  expect(hunty.addY(55)).equalsPoint(100, 155);
  expect(hunty.addX(11).addY(11))
    .equalsPoint(111, 111);
});


test('Transformations', () => {
  expect(hunty.negative()).equalsPoint(-100, -100);

  expect(hunty.pointToAngle(rac.Angle.zero, 100))
    .equalsPoint(200, 100);
  expect(hunty.pointToAngle(rac.Angle.down, 100))
    .equalsPoint(100, 200);
  expect(hunty.pointToAngle(rac.Angle.left, 100))
    .equalsPoint(0, 100);
  expect(hunty.pointToAngle(rac.Angle.up, 100))
    .equalsPoint(100, 0);

  let side = tools.sides(100);
  expect(hunty.pointToAngle(rac.Angle.eighth, 100))
    .equalsPoint(100+side, 100+side);
});


test('Transforms to Angle', () => {
  expect(hunty.angleToPoint(fifty)).equalsAngle(rac.Angle.nw);
  expect(fifty.angleToPoint(hunty)).equalsAngle(rac.Angle.se);

  expect(fifty.angleToPoint(fifty)).equalsAngle(rac.Angle.zero);
  expect(fifty.angleToPoint(fifty, rac.Angle.eighth))
    .equalsAngle(rac.Angle.eighth);

});


test('Transforms to Ray', () => {
  expect(hunty.ray(rac.Angle.zero))
    .equalsRay(100, 100, rac.Angle.zero);
  expect(hunty.ray(rac.Angle.up))
    .equalsRay(100, 100, rac.Angle.up);

  expect(hunty.rayToPoint(hunty.addX(100)))
    .equalsRay(100, 100, rac.Angle.zero);
  expect(hunty.rayToPoint(hunty.addY(100)))
    .equalsRay(100, 100, rac.Angle.down);

  const horizontalRay = rac.Ray(0, 0, rac.Angle.zero);
  const verticalRay = rac.Ray(0, 0, rac.Angle.down);
  expect(hunty.rayToProjectionInRay(horizontalRay))
    .equalsRay(100, 100, rac.Angle.up);
  expect(hunty.rayToProjectionInRay(verticalRay))
    .equalsRay(100, 100, rac.Angle.left);

  const diagonalRay = rac.Ray(0, 0, rac.Angle.eighth);
  expect(rac.Point(100, 0).rayToProjectionInRay(diagonalRay))
    .equalsRay(100, 0, rac.Angle.sw);
  expect(rac.Point(0, 100).rayToProjectionInRay(diagonalRay))
    .equalsRay(0, 100, rac.Angle.ne);
  // Point in ray, perpendicular angle
  expect(hunty.rayToProjectionInRay(diagonalRay))
    .equalsRay(100, 100, rac.Angle.sw);
});


test('Transforms to Segment', () => {
  expect(hunty.segmentToAngle(rac.Angle.s, 55))
    .equalsSegment(100, 100, rac.Angle.s, 55);

  expect(hunty.segmentToAngle(rac.Angle.ne, 0))
    .equalsSegment(100, 100, rac.Angle.ne, 0);

  expect(hunty.segmentToPoint(fifty))
    .equalsSegment(100, 100, rac.Angle.eighth.inverse(), tools.hypotenuse(45));

  // vertical ray at x:300
  const vertical = hunty
    .addX(200)
    .ray(rac.Angle.s);
  expect(hunty.segmentToProjectionInRay(vertical))
    .equalsSegment(100, 100, rac.Angle.zero, 200);

  // horizontal ray at x:300
  const horizontal = hunty
    .addY(200)
    .ray(rac.Angle.zero);
  expect(hunty.segmentToProjectionInRay(horizontal))
    .equalsSegment(100, 100, rac.Angle.down, 200);

  // diagonal at zero
  const diagonal = hunty.ray(rac.Angle.eighth);
  expect(fifty.segmentToProjectionInRay(diagonal))
    .equalsSegment(55, 55, rac.Angle.eighth.perpendicular(), 0);
  expect(hunty.segmentToProjectionInRay(diagonal))
    .equalsSegment(100, 100, rac.Angle.eighth.perpendicular(), 0);
});


test('Arc Tangents', () => {
  // Circle at 50,50, touches x-axis and y-axis
  const circle = rac.Arc(50, 50, 50);

  // Point inside circle
  expect(fifty.segmentTangentToArc(circle)).toBe(null);

  // Vertical tangent
  expect(hunty.segmentTangentToArc(circle))
    .equalsSegment(100, 100, rac.Angle.up, 50);
  // Horizontal tangent
  expect(hunty.segmentTangentToArc(circle, false))
    .equalsSegment(100, 100, rac.Angle.left, 50);

  const diagonalX = 50 + tools.sides(50) * 2;
  const diagonalPoint = rac.Point(diagonalX, 50);
  // Diagonal tangents
  expect(diagonalPoint.segmentTangentToArc(circle))
    .equalsSegment(diagonalX, 50, rac.Angle.nw, 50);
  expect(diagonalPoint.segmentTangentToArc(circle, false))
    .equalsSegment(diagonalX, 50, rac.Angle.sw, 50);
});


test('Arc Tangents in circumference', () => {
  const circle = rac.Arc(50, 50, 50);

  // Vertical tangent
  expect(rac.Point(100, 50).segmentTangentToArc(circle))
    .equalsSegment(100, 50, rac.Angle.up, 0);
  expect(rac.Point(100, 50).segmentTangentToArc(circle, false))
    .equalsSegment(100, 50, rac.Angle.down, 0);
  // Horizontal tangent
  expect(rac.Point(50, 100).segmentTangentToArc(circle))
    .equalsSegment(50, 100, rac.Angle.right, 0);
  expect(rac.Point(50, 100).segmentTangentToArc(circle, false))
    .equalsSegment(50, 100, rac.Angle.left, 0);

  const circleEdge = 50 + tools.sides(50);
  expect(circle.pointAtAngle(rac.Angle.eighth))
    .equalsPoint(circleEdge, circleEdge);
  const circumferencePoint = rac.Point(circleEdge, circleEdge);

  // Diagonal
  expect(circumferencePoint.segmentTangentToArc(circle))
    .equalsSegment(circleEdge, circleEdge, rac.Angle.ne, 0);
  expect(circumferencePoint.segmentTangentToArc(circle, false))
    .equalsSegment(circleEdge, circleEdge, rac.Angle.sw, 0);

});


test('Arc Tangents edge cases', () => {
  let zeroCircle = rac.Arc(55, 55, 0, rac.Angle.left);

  // Point to zero-radius circle
  expect(hunty.segmentTangentToArc(zeroCircle))
    .equalsSegment(100, 100, rac.Angle.nw, tools.hypotenuse(45));
  expect(hunty.segmentTangentToArc(zeroCircle, false))
    .equalsSegment(100, 100, rac.Angle.nw, tools.hypotenuse(45));

  // Point at zero-radius circle, left start
  expect(fifty.segmentTangentToArc(zeroCircle))
    .equalsSegment(55, 55, rac.Angle.down, 0);
  expect(fifty.segmentTangentToArc(zeroCircle, false))
    .equalsSegment(55, 55, rac.Angle.up, 0);

  // Point at zero-radius circle, top start
  zeroCircle = rac.Arc(55, 55, 0, rac.Angle.top);
  expect(fifty.segmentTangentToArc(zeroCircle))
    .equalsSegment(55, 55, rac.Angle.left, 0);
  expect(fifty.segmentTangentToArc(zeroCircle, false))
    .equalsSegment(55, 55, rac.Angle.right, 0);

  // Point at zero-radius circle, ne start
  zeroCircle = rac.Arc(55, 55, 0, rac.Angle.ne);
  expect(fifty.segmentTangentToArc(zeroCircle))
    .equalsSegment(55, 55, rac.Angle.nw, 0);
  expect(fifty.segmentTangentToArc(zeroCircle, false))
    .equalsSegment(55, 55, rac.Angle.se, 0);
});


test('Transforms to Arc', () => {
  expect(hunty.arc(155))
    .equalsArc(100, 100, 155, rac.Angle.zero, rac.Angle.zero, true);

  expect(hunty.arc(155, rac.Angle.up))
    .equalsArc(100, 100, 155, rac.Angle.up, rac.Angle.up, true);
  expect(hunty.arc(155, rac.Angle.up, null, false))
    .equalsArc(100, 100, 155, rac.Angle.up, rac.Angle.up, false);

  expect(hunty.arc(155, rac.Angle.down, rac.Angle.left, true))
    .equalsArc(100, 100, 155, rac.Angle.down, rac.Angle.left, true);
  expect(hunty.arc(7, rac.Angle.up, rac.Angle.left, false))
    .equalsArc(100, 100, 7, rac.Angle.up, rac.Angle.left, false);
});

test.todo('distanceToPoint for equal points');
test('Miscelaneous', () => {
  expect(hunty.distanceToPoint(rac.Point(100, 200)))
    .toBe(100);
  expect(hunty.distanceToPoint(rac.Point(200, 100)))
    .toBe(100);

  expect(hunty.text("sphinx", rac.Text.Format.topLeft))
    .equalsText(100, 100, 'sphinx');
});

