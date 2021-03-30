'use strict';

const Rac = require('rulerandcompass');
const tools = require('./tools');


const rac = tools.rac;


let hunty = rac.Point(100, 100);
let fifty = rac.Point(55, 55);


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
    .toThrow();
  expect(() => {new Rac.Point(rac, null, 100);})
    .toThrow();
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
});


test('Function addX/Y', () => {
  expect(hunty.addX(55)).equalsPoint(155, 100);
  expect(hunty.addY(55)).equalsPoint(100, 155);
  expect(hunty.addX(11).addY(11))
    .equalsPoint(111, 111);
});


test('Transformations', () => {
  expect(hunty.negative()).equalsPoint(-100, -100);

  // Clockwise
  expect(hunty.perpendicular()).equalsPoint(-100, 100);
  // Counter-clockwise
  expect(hunty.perpendicular(false)).equalsPoint(100, -100);

  expect(hunty.pointToAngle(rac.Angle.zero, 100))
    .equalsPoint(200, 100);
  expect(hunty.pointToAngle(rac.Angle.down, 100))
    .equalsPoint(100, 200);
  expect(hunty.pointToAngle(rac.Angle.left, 100))
    .equalsPoint(0, 100);
  expect(hunty.pointToAngle(rac.Angle.up, 100))
    .equalsPoint(100, 0);

  let component = 100 + Math.sqrt(100*100/2);
  expect(hunty.pointToAngle(rac.Angle.eighth, 100))
    .equalsPoint(component, component);
});


test('Transforms to Angle', () => {
  expect(hunty.angleToPoint(fifty)).equalsAngle(rac.Angle.nw);
  expect(fifty.angleToPoint(hunty)).equalsAngle(rac.Angle.se);

  expect(fifty.angleToPoint(fifty)).equalsAngle(rac.Angle.zero);
  expect(fifty.angleToPoint(fifty, rac.Angle.eighth))
    .equalsAngle(rac.Angle.eighth);

});


test.todo('Transforms to Ray');


test('Transforms to Segment', () => {
  expect(hunty.segmentToAngle(rac.Angle.s, 55))
    .equalsSegment(100, 100, 0.25, 55);

  expect(hunty.segmentToPoint(fifty))
    .equalsSegment(100, 100, rac.Angle.eighth.inverse(), Math.sqrt((45*45*2)));

  // vertical ray at x:300
  let vertical = hunty
    .addX(200)
    .ray(rac.Angle.s);
  expect(hunty.segmentToProjectionInRay(vertical))
    .equalsSegment(100, 100, 0, 200);

  // horizontal ray at x:300
  let horizontal = hunty
    .addY(200)
    .ray(rac.Angle.zero);
  expect(hunty.segmentToProjectionInRay(horizontal))
    .equalsSegment(100, 100, 1/4, 200);

  // diagonal at zero
  let diagonal = hunty.ray(rac.Angle.eighth);
  expect(fifty.segmentToProjectionInRay(diagonal))
    .equalsSegment(55, 55, rac.Angle.eighth.perpendicular(), 0);
  expect(hunty.segmentToProjectionInRay(diagonal))
    .equalsSegment(100, 100, rac.Angle.eighth.perpendicular(), 0);
});


test('Miscelaneous', () => {
  expect(hunty.distanceToPoint(rac.Point(100, 200)))
    .toBe(100);
  expect(hunty.distanceToPoint(rac.Point(200, 100)))
    .toBe(100);
});


test.todo('arc');
// expect(hunty.arc(155, rac.Angle.e, rac.Angle.n, false))
//     .equalsArc(100, 100, 155, 0, 3/4, false);
test.todo('segmentTangentToArc');

