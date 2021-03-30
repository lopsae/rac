'use strict';

const Rac = require('rulerandcompass');
const tools = require('./tools');


const rac = tools.rac;

let fifty = rac.Point(55, 55);
let diagonal = rac.Ray(fifty, rac.Angle.eighth);
let hunty = rac.Point(100, 100);
let vertical = rac.Ray(hunty, rac.Angle.square);
let horizontal = rac.Ray(hunty, rac.Angle.zero);



test('Identity', () => {
  expect(null).not.equalsRay(55, 55, rac.Angle.se);

  expect(diagonal).equalsRay(55, 55, rac.Angle.se);
  expect(diagonal).not.equalsRay(100, 100, rac.Angle.zero);

  let string = diagonal.toString();
  expect(string).toMatch('Ray');
  expect(string).toMatch('55');
  expect(string).toMatch('0.125');
});


test('Slope, yIntercept', () => {

  expect(rac.Ray(hunty, rac.Angle.zero).slope()).thresEquals(0);
  expect(rac.Ray(hunty, rac.Angle.half).slope()).thresEquals(0);

  expect(rac.Ray(hunty, rac.Angle.down).slope()).toBe(null);
  expect(rac.Ray(hunty, rac.Angle.up).slope()).toBe(null);

  expect(rac.Ray(hunty, rac.Angle.bottomRight).slope()).thresEquals(1);
  expect(rac.Ray(hunty, rac.Angle.topLeft).slope()).thresEquals(1);

  expect(rac.Ray(hunty, rac.Angle.topRight).slope()).thresEquals(-1);
  expect(rac.Ray(hunty, rac.Angle.bottomLeft).slope()).thresEquals(-1);

  expect(rac.Ray(hunty, rac.Angle.tr).yIntercept())
    .thresEquals(200);
  expect(rac.Ray(hunty.negative(), rac.Angle.bl).yIntercept())
    .thresEquals(-200);

  expect(rac.Ray(hunty, rac.Angle.br).yIntercept())
    .thresEquals(0);
  expect(rac.Ray(hunty.negative(), rac.Angle.tl).yIntercept())
    .thresEquals(0);

  expect(rac.Ray(hunty, rac.Angle.u).yIntercept()).toBe(null);
  expect(rac.Ray(hunty.negative(), rac.Angle.d).yIntercept()).toBe(null);
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


test ('Ray intersection', () => {
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


test ('Ray parallel intersection', () => {
  let shiftedVertical = vertical.withStart(rac.Point.zero);
  expect(shiftedVertical.pointAtIntersection(vertical))
    .toBe(null);
  expect(shiftedVertical.pointAtIntersection(vertical.inverse()))
    .toBe(null);

  let shiftedHorizontal = horizontal.withStart(rac.Point.zero);
  expect(shiftedHorizontal.pointAtIntersection(horizontal))
    .toBe(null);
  expect(shiftedHorizontal.pointAtIntersection(horizontal.inverse()))
    .toBe(null);

  let shiftedDiagonal = diagonal.withStart(hunty);
  expect(shiftedDiagonal.pointAtIntersection(diagonal))
    .toBe(null);
  expect(shiftedDiagonal.pointAtIntersection(diagonal.inverse()))
    .toBe(null);
});


test ('Point projection', () => {
  let distance = Math.sqrt(20*20*2);
  expect(diagonal.pointAtDistance(distance)).equalsPoint(55+20, 55+20);
  expect(diagonal.pointAtDistance(-distance)).equalsPoint(55-20, 55-20);

  expect(diagonal.pointProjected(hunty)).equalsPoint(100, 100);
  expect(diagonal.inverse().pointProjected(fifty)).equalsPoint(55, 55);

  expect(vertical.pointProjected(fifty)).equalsPoint(100, 55);
  expect(vertical.inverse().pointProjected(fifty)).equalsPoint(100, 55);

  expect(horizontal.pointProjected(fifty)).equalsPoint(55, 100);
  expect(horizontal.inverse().pointProjected(fifty)).equalsPoint(55, 100);
});


test.todo('More!')

