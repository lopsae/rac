'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;

let fifty = rac.Point(55, 55);
let diagonal = rac.Ray(55, 55, rac.Angle.eighth);
let hunty = rac.Point(100, 100);
let vertical = rac.Ray(100, 100, rac.Angle.square);
let horizontal = rac.Ray(100, 100, rac.Angle.zero);



test('Identity', () => {
  expect(null).not.equalsRay(55, 55, rac.Angle.se);

  expect(diagonal).equalsRay(55, 55, rac.Angle.se);
  expect(diagonal).not.equalsRay(100, 100, rac.Angle.zero);

  expect(55).not.equalsRay(55, 55, 1/8);
  expect(rac.Angle.zero).not.equalsRay(0, 0, 0);
  expect(rac.Point.zero).not.equalsRay(0, 0, 0);

  let string = diagonal.toString();
  expect(string).toMatch('Ray');
  expect(string).toMatch('55');
  expect(string).toMatch('0.125');
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


test('Function withStart/withAngle/withStartAtDistance', () => {
  expect(diagonal.withStart(hunty))
    .equalsRay(100, 100, 1/8);

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


test('Function inverse/perpendicular', () => {
  expect(diagonal.inverse()).equalsRay(55, 55, 5/8);
  expect(horizontal.inverse()).equalsRay(100, 100, 1/2);
  expect(vertical.inverse()).equalsRay(100, 100, 3/4);

  expect(diagonal.perpendicular()).equalsRay(55, 55, 3/8);
  expect(diagonal.perpendicular(false)).equalsRay(55, 55, 7/8);
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
  let distance = tools.hypotenuse(55);

  expect(diagonal.withStartAtDistance(0))
    .equalsRay(55, 55, 1/8);
  expect(diagonal.withStartAtDistance(distance))
    .equalsRay(110, 110, 1/8);
  expect(diagonal.withStartAtDistance(-distance))
    .equalsRay(0, 0, 1/8);

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


test.todo('Check for coverage!');

