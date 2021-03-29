'use strict';

const Rac = require('rulerandcompass');
const tools = require('./tools');


const rac = tools.rac;

let diagonal = rac.Ray(rac.Point(55, 55), rac.Angle.eighth);

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
  expect(vertical.pointAtIntersectionWithX(55)).toBe(null);
  expect(vertical.pointAtIntersectionWithY(55)).equalsPoint(100, 55);

  expect(horizontal.pointAtIntersectionWithY(55)).toBe(null);
  expect(horizontal.pointAtIntersectionWithX(55)).equalsPoint(55, 100);

  expect(diagonal.pointAtIntersectionWithY(55)).equalsPoint(55, 55);
  expect(diagonal.pointAtIntersectionWithX(55)).equalsPoint(55, 55);

  expect(diagonal.withAngle(rac.Angle.neighth).pointAtIntersectionWithX(0))
    .equalsPoint(0, 55*2);
  expect(diagonal.withAngle(rac.Angle.neighth).pointAtIntersectionWithY(0))
    .equalsPoint(55*2, 0);
});


test.todo('More!')

