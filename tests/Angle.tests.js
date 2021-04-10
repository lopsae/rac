'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


test('Identity', () => {
  expect(null).not.equalsAngle(0);
  expect(null).not.equalsAngle(1/2);

  expect(rac.Angle.zero).equalsAngle(0);
  expect(rac.Angle.zero).equalsAngle(rac.Angle.east);
  expect(rac.Angle.zero).equalsAngle(1);
  expect(rac.Angle.zero).equalsAngle(55);
  expect(rac.Angle.zero).equalsAngle(-7);

  expect(rac.Angle.half).equalsAngle(1/2);
  expect(rac.Angle.half).equalsAngle(rac.Angle.left);
  expect(rac.Angle.half).equalsAngle(2.5);
  expect(rac.Angle.half).equalsAngle(-0.5);
  expect(rac.Angle.half).equalsAngle(-7.5);

  let string = rac.Angle(0.12345).toString();
  expect(string).toMatch('Angle');
  expect(string).toMatch('0.12345');

  string = rac.Angle(0.12345).toString(2);
  expect(string).toMatch('Angle');
  expect(string).toMatch('0.12');
  expect(string).not.toMatch('0.123');
});


test('Errors', () => {
  expect(() => { new Rac.Angle(rac, 1/2); })
    .not.toThrow();

  expect(() => { new Rac.Angle(null, 1/2); })
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => { new Rac.Angle(rac, null); })
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => { new Rac.Angle(rac, NaN); })
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


test('Equality', () => {
  const threshold = rac.unitaryEqualityThreshold;
  const bump = threshold/16;
  const aboveThreshold = threshold + bump;
  const belowThreshold = threshold - bump;

  expect(rac.Angle.zero).equalsAngle(rac.Angle.zero);
  expect(rac.Angle.half).equalsAngle(rac.Angle.west);
  expect(rac.Angle.up).not.equalsAngle(rac.Angle.down);

  expect(rac.Angle.down).equalsAngle(1/4);
  expect(rac.Angle.down).equalsAngle(1/4 + belowThreshold);
  expect(rac.Angle.down).equalsAngle(1/4 - belowThreshold);

  expect(rac.Angle.down).not.equalsAngle(1/4 + aboveThreshold);
  expect(rac.Angle.down).not.equalsAngle(1/4 - aboveThreshold);

  expect(rac.Angle.zero).equalsAngle(0);
  expect(rac.Angle.zero).equalsAngle(1);
  expect(rac.Angle.zero).equalsAngle(0 + belowThreshold);
  expect(rac.Angle.zero).equalsAngle(0 - belowThreshold);
  expect(rac.Angle.zero).equalsAngle(1 + belowThreshold);
  expect(rac.Angle.zero).equalsAngle(1 - belowThreshold);

  expect(rac.Angle.zero).not.equalsAngle(0 + aboveThreshold);
  expect(rac.Angle.zero).not.equalsAngle(0 - aboveThreshold);
  expect(rac.Angle.zero).not.equalsAngle(1 + aboveThreshold);
  expect(rac.Angle.zero).not.equalsAngle(1 - aboveThreshold);

  const closeToOne = 1 - bump;
  const angleCloseToOne = rac.Angle.from(closeToOne);
  expect(angleCloseToOne).equalsAngle(1);
  expect(angleCloseToOne).equalsAngle(0);
  expect(angleCloseToOne).equalsAngle(closeToOne + belowThreshold);
  expect(angleCloseToOne).equalsAngle(closeToOne - belowThreshold);
  expect(angleCloseToOne).not.equalsAngle(closeToOne + aboveThreshold);
  expect(angleCloseToOne).not.equalsAngle(closeToOne - aboveThreshold);
});

test('Function from', () => {
  expect(Rac.Angle.from(rac, rac.Angle.quarter))
    .equalsAngle(rac.Angle.quarter);
  expect(Rac.Angle.from(rac, 1/2))
    .equalsAngle(rac.Angle.half);
  expect(Rac.Angle.from(rac, rac.Ray(55, 55, 3/4)))
    .equalsAngle(3/4);
  expect(Rac.Angle.from(rac, rac.Segment(55, 55, 3/4, 100)))
    .equalsAngle(3/4);

  expect(() => { Rac.Angle.from(null, 1/2); })
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => { Rac.Angle.from(rac, 'unsuported'); })
    .toThrowNamed(Rac.Exception.invalidObjectType.exceptionName);
  expect(() => { Rac.Angle.from(rac, NaN); })
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


test('Transforms to radian/degrees', () => {
  expect(rac.Angle.zero.radians()).toBe(0);
  expect(rac.Angle.half.radians()).toBe(Rac.TAU/2);

  expect(rac.Angle.zero.degrees()).toBe(0);
  expect(rac.Angle.half.degrees()).toBe(360/2);

  expect(Rac.Angle.fromRadians(rac, 0))
    .equalsAngle(rac.Angle.zero);
  expect(Rac.Angle.fromRadians(rac, Rac.TAU/2))
    .equalsAngle(rac.Angle.half);
  expect(Rac.Angle.fromRadians(rac, Rac.TAU))
    .equalsAngle(rac.Angle.zero);
});


test('Transformations', () => {
  expect(rac.Angle.zero.inverse())
    .equalsAngle(rac.Angle.half);
  expect(rac.Angle.down.inverse())
    .equalsAngle(rac.Angle.up);
  expect(rac.Angle.se.inverse())
    .equalsAngle(rac.Angle.nw);

  expect(rac.Angle.zero.negative())
    .equalsAngle(rac.Angle.zero);
  expect(rac.Angle.half.negative())
    .equalsAngle(rac.Angle.half);
  expect(rac.Angle.se.negative())
    .equalsAngle(rac.Angle.ne);
  expect(rac.Angle.nw.negative())
    .equalsAngle(rac.Angle.sw);

  expect(rac.Angle.zero.perpendicular())
    .equalsAngle(rac.Angle.down);
  expect(rac.Angle.zero.perpendicular(false))
    .equalsAngle(rac.Angle.up);

  expect(rac.Angle.down.perpendicular())
    .equalsAngle(rac.Angle.left);
  expect(rac.Angle.down.perpendicular(false))
    .equalsAngle(rac.Angle.right);

  expect(rac.Angle.se.perpendicular())
    .equalsAngle(rac.Angle.sw);
  expect(rac.Angle.se.perpendicular(false))
    .equalsAngle(rac.Angle.ne);

});


test('Function add/subtract', () => {
  expect(rac.Angle.zero.add(0))
    .equalsAngle(0);
  expect(rac.Angle.zero.add(1/4))
    .equalsAngle(1/4);
  expect(rac.Angle.zero.add(-1/4))
    .equalsAngle(3/4);

  expect(rac.Angle.half.add(0))
    .equalsAngle(1/2);
  expect(rac.Angle.half.add(1/4))
    .equalsAngle(3/4);
  expect(rac.Angle.half.add(-1/4))
    .equalsAngle(1/4);

  expect(rac.Angle.zero.subtract(0))
    .equalsAngle(0);
  expect(rac.Angle.zero.subtract(1/4))
    .equalsAngle(3/4);
  expect(rac.Angle.zero.subtract(-1/4))
    .equalsAngle(1/4);

  expect(rac.Angle.half.subtract(0))
    .equalsAngle(1/2);
  expect(rac.Angle.half.subtract(1/4))
    .equalsAngle(1/4);
  expect(rac.Angle.half.subtract(-1/4))
    .equalsAngle(3/4);
});


test('Function mult', () => {
  expect(rac.Angle.zero.mult(0))
    .equalsAngle(0);
  expect(rac.Angle.zero.mult(1/2))
    .equalsAngle(0);
  expect(rac.Angle.zero.mult(-1/2))
    .equalsAngle(0);

  expect(rac.Angle.half.mult(1/2))
    .equalsAngle(1/4);
  expect(rac.Angle.half.mult(-1/2))
    .equalsAngle(3/4);
  expect(rac.Angle.half.mult(0))
    .equalsAngle(0);
  expect(rac.Angle.half.mult(1))
    .equalsAngle(1/2);
  expect(rac.Angle.half.mult(2))
    .equalsAngle(0);
});



test('Function turnOne/multOne', () => {
  expect(rac.Angle.zero.turnOne()).uniThresEquals(1);
  expect(rac.Angle.half.turnOne()).uniThresEquals(1/2);

  expect(rac.Angle.zero.multOne(0))
    .equalsAngle(0);
  expect(rac.Angle.zero.multOne(1/2))
    .equalsAngle(1/2);
  expect(rac.Angle.zero.multOne(-1/2))
    .equalsAngle(1/2);

  expect(rac.Angle.half.multOne(1/2))
    .equalsAngle(1/4);
  expect(rac.Angle.half.multOne(-1/2))
    .equalsAngle(3/4);
  expect(rac.Angle.half.multOne(0))
    .equalsAngle(0);
  expect(rac.Angle.half.multOne(1))
    .equalsAngle(1/2);
  expect(rac.Angle.half.multOne(2))
    .equalsAngle(0);
});


test('Function distance', () => {
  expect(rac.Angle.zero.distance(0))
    .equalsAngle(0);
  expect(rac.Angle.zero.distance(0, false))
    .equalsAngle(0);

  expect(rac.Angle.half.distance(rac.Angle.half))
    .equalsAngle(0);
  expect(rac.Angle.half.distance(rac.Angle.half, false))
    .equalsAngle(0);

  expect(rac.Angle.down.distance(0))
    .equalsAngle(3/4);
  expect(rac.Angle.down.distance(0, false))
    .equalsAngle(1/4);
  expect(rac.Angle.down.distance(1/2))
    .equalsAngle(1/4);
  expect(rac.Angle.down.distance(1/2, false))
    .equalsAngle(3/4);

  expect(rac.Angle.up.distance(0))
    .equalsAngle(1/4);
  expect(rac.Angle.up.distance(0, false))
    .equalsAngle(3/4);
  expect(rac.Angle.up.distance(1/2))
    .equalsAngle(3/4);
  expect(rac.Angle.up.distance(1/2, false))
    .equalsAngle(1/4);
});


test.todo('Function shift');
test.todo('Function shiftToOrigin');


test.todo('Check for coverage');

