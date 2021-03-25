'use strict';

const Rac = require('rulerandcompass');
const tools = require('./testTools');


const rac = tools.rac;


let hunty = rac.Point(100, 100);
let fifty = rac.Point(55, 55);

test('identity', () => {
  expect(null).not.equalsPoint(100, 100);

  expect(hunty).equalsPoint(100, 100);
  expect(fifty).not.equalsPoint(100, 100);
  expect(rac.Point.zero).equalsPoint(0, 0);
  expect(rac.Point.origin).equalsPoint(0, 0);
});

test('withX functions', () => {
  expect(hunty.withX(77))
    .equalsPoint(77, 100);
  expect(hunty.withY(77))
    .equalsPoint(100, 77);

  expect(hunty).equalsPoint(100, 100);
});


test('add/sub', () => {
  expect(hunty.add(fifty))
    .equalsPoint(155, 155);
  expect(hunty.add(11, 11))
    .equalsPoint(111, 111);

  expect(hunty.sub(fifty))
    .equalsPoint(45, 45);
  expect(hunty.sub(1, 1))
    .equalsPoint(99, 99);

  expect(hunty).equalsPoint(100, 100);
});


test('addX/Y', () => {
  expect(hunty.addX(55)).equalsPoint(155, 100);
  expect(hunty.addY(55)).equalsPoint(100, 155);
  expect(hunty.addX(11).addY(11))
    .equalsPoint(111, 111);
  expect(hunty).equalsPoint(100, 100);
});


test('transforms', () => {
  expect(hunty.negative()).equalsPoint(-100, -100);

  // Clockwise
  expect(hunty.perpendicular(true)).equalsPoint(-100, 100);
  // Counter-clockwise
  expect(hunty.perpendicular(false)).equalsPoint(100, -100);

  expect(hunty.pointToAngle(Rac.Angle.zero, 100))
    .equalsPoint(200, 100);
  expect(hunty.pointToAngle(Rac.Angle.half, 100))
    .equalsPoint(0, 100);

  expect(hunty).equalsPoint(100, 100);
});

test('misc', () => {
  expect(hunty.angleToPoint(fifty)).equalsAngle(Rac.Angle.nw);

  expect(hunty.distanceToPoint(rac.Point(100, 200)))
    .toBe(100);
  expect(hunty.distanceToPoint(rac.Point(200, 100)))
    .toBe(100);

  expect(hunty.segmentToPoint(fifty))
    .equalsSegment(100, 100, 55, 55);

  expect(hunty.segmentToAngle(Rac.Angle.s, 55))
    .equalsSegment(100, 100, 100, 155);

  let intersector = hunty
    .addX(200) // x is 300
    .segmentToAngle(Rac.Angle.s, 100);

  expect(hunty.segmentToAngleToIntersectionWithSegment(Rac.Angle.zero, intersector))
    .equalsSegment(100, 100, 300, 100);

  expect(hunty.segmentPerpendicularToSegment(intersector))
    .equalsSegment(100, 100, 300, 100);

  expect(hunty.arc(155, Rac.Angle.e, Rac.Angle.n, false))
    .equalsArc(100, 100, 155, 0, 3/4, false);
});

