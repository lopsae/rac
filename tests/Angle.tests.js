'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


tools.test( function identity() {
  // Instance members
  expect(rac.Angle.east) .equalsAngle(0/4);
  expect(rac.Angle.south).equalsAngle(1/4);
  expect(rac.Angle.west) .equalsAngle(2/4);
  expect(rac.Angle.north).equalsAngle(3/4);

  // equalsAngle with angle
  expect(rac.Angle.right) .equalsAngle(rac.Angle.zero);
  expect(rac.Angle.down)  .equalsAngle(rac.Angle.quarter);
  expect(rac.Angle.left)  .equalsAngle(rac.Angle.half);
  expect(rac.Angle.up)    .equalsAngle(rac.Angle.top);

  // Unexpected type for equalsAngle
  expect(null)            .not.equalsAngle(0);
  expect(0)               .not.equalsAngle(0);
  expect('0')             .not.equalsAngle(0);
  expect(rac.Point.zero)  .not.equalsAngle(0);
  expect(rac.Ray.zero)    .not.equalsAngle(0);
  expect(rac.Segment.zero).not.equalsAngle(0);

  const zero = rac.Angle.zero;

  // Expected type for equals
  expect(zero.equals(0))             .toBe(true);
  expect(zero.equals(zero))          .toBe(true);
  expect(zero.equals(rac.Angle.half)).toBe(false);
  expect(rac.Angle.half.equals(1/2))           .toBe(true);
  expect(rac.Angle.half.equals(rac.Angle.half)).toBe(true);
  expect(rac.Angle.half.equals(zero))          .toBe(false);

  // Unexpected type for equals
  expect(zero.equals(null))            .toBe(false);
  expect(zero.equals('0'))             .toBe(false);
  expect(zero.equals(rac.Point.zero))  .toBe(false);
  expect(zero.equals(rac.Ray.zero))    .toBe(false);
  expect(zero.equals(rac.Segment.zero)).toBe(false);

  // Turn constrain
  expect(new Rac.Angle(rac, 0)) .equalsAngle(zero);
  expect(new Rac.Angle(rac, 1)) .equalsAngle(zero);
  expect(new Rac.Angle(rac, 55)).equalsAngle(zero);
  expect(new Rac.Angle(rac, -7)).equalsAngle(zero);

  expect(new Rac.Angle(rac, 1/2)) .equalsAngle(1/2);
  expect(new Rac.Angle(rac, 2.5)) .equalsAngle(1/2);
  expect(new Rac.Angle(rac, -0.5)).equalsAngle(1/2);
  expect(new Rac.Angle(rac, -7.5)).equalsAngle(1/2);
});


tools.test( function toString() {
  const angle = rac.Angle(0.12345);

  expect(angle.toString()) .toBe('Angle(0.12345)');
  expect(angle.toString(2)).toBe('Angle(0.12)');
});


tools.test( function thrownErrors() {
  expect(() => { new Rac.Angle(rac, 1/2); })
    .not.toThrow();

  expect(() => { new Rac.Angle(null, 1/2); })
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => { new Rac.Angle(rac, null); })
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => { new Rac.Angle(rac, NaN); })
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


tools.test( function instanceMembers() {
  expect(rac.Angle.zero).equalsAngle(0.0);

  expect(rac.Angle.half).equalsAngle(0.5);
  expect(rac.Angle.inverse).equalsAngle(0.5);

  expect(rac.Angle.quarter).equalsAngle(0.25);
  expect(rac.Angle.square).equalsAngle(0.25);

  expect(rac.Angle.eighth).equalsAngle(0.125);
  expect(rac.Angle.neighth).equalsAngle(-0.125);

  expect(rac.Angle.sixteenth).equalsAngle(0.0625);

  expect(rac.Angle.tenth).equalsAngle(0.1);

  // TODO: is there an easy way to check for a collection of angles
  // to match a single one? to test the rest of instance members
});


tools.test( function equalityThresholds() {
  const threshold = rac.unitaryEqualityThreshold;
  const bump = threshold/16;
  const aboveThreshold = threshold + bump;
  const belowThreshold = threshold - bump;

  const otherRac = new Rac();
  expect(otherRac.Angle.zero).not.equalsAngle(rac.Angle.zero);

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


tools.test( function fromFunctions() {
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


tools.test( function radianDegreesTransforms() {
  expect(rac.Angle.zero.radians())   .toBe(0);
  expect(rac.Angle.quarter.radians()).toBe(Rac.TAU/4);
  expect(rac.Angle.half.radians())   .toBe(Rac.TAU/2);
  expect(rac.Angle.neighth.radians()).toBe(Rac.TAU * 7/8);

  expect(rac.Angle.fromRadians(0))
    .equalsAngle(rac.Angle.zero);
  expect(rac.Angle.fromRadians(Rac.TAU))
    .equalsAngle(rac.Angle.zero);
  expect(rac.Angle.fromRadians(Rac.TAU*7))
    .equalsAngle(rac.Angle.zero);

  expect(rac.Angle.fromRadians(Rac.TAU/8))
    .equalsAngle(rac.Angle.eighth);
  expect(rac.Angle.fromRadians(Rac.TAU/8 + Rac.TAU))
    .equalsAngle(rac.Angle.eighth);
  expect(rac.Angle.fromRadians(Rac.TAU/8 - Rac.TAU))
    .equalsAngle(rac.Angle.eighth);

  expect(rac.Angle.fromRadians(-Rac.TAU/8))
    .equalsAngle(rac.Angle.neighth);
  expect(rac.Angle.fromRadians(-Rac.TAU/8 - Rac.TAU))
    .equalsAngle(rac.Angle.neighth);

  expect(rac.Angle.zero.degrees())   .toBe(0);
  expect(rac.Angle.quarter.degrees()).toBe(360/4);
  expect(rac.Angle.half.degrees())   .toBe(360/2);
  expect(rac.Angle.neighth.degrees()).toBe(360 * 7/8);

  expect(rac.Angle.fromDegrees(0))
    .equalsAngle(rac.Angle.zero);
  expect(rac.Angle.fromDegrees(360))
    .equalsAngle(rac.Angle.zero);
  expect(rac.Angle.fromDegrees(360*7))
    .equalsAngle(rac.Angle.zero);

  expect(rac.Angle.fromDegrees(45))
    .equalsAngle(rac.Angle.eighth);
  expect(rac.Angle.fromDegrees(45 + 360))
    .equalsAngle(rac.Angle.eighth);
  expect(rac.Angle.fromDegrees(45 - 360))
    .equalsAngle(rac.Angle.eighth);

  expect(rac.Angle.fromDegrees(-45))
    .equalsAngle(rac.Angle.neighth);
  expect(rac.Angle.fromDegrees(-45 - 360))
    .equalsAngle(rac.Angle.neighth);
});


tools.test( function sinCosTan() {
  expect(rac.Angle.zero.sin())   .uniThresEquals(0)
  expect(rac.Angle.quarter.sin()).uniThresEquals(1)
  expect(rac.Angle.half.sin())   .uniThresEquals(0)
  expect(rac.Angle.neighth.sin()).uniThresEquals(-Math.sqrt(1/2))

  expect(rac.Angle.zero.cos())   .uniThresEquals(1)
  expect(rac.Angle.quarter.cos()).uniThresEquals(0)
  expect(rac.Angle.half.cos())   .uniThresEquals(-1)
  expect(rac.Angle.neighth.cos()).uniThresEquals(Math.sqrt(1/2))

  expect(rac.Angle.zero.tan())   .uniThresEquals(0)
  expect(rac.Angle.eighth.tan()) .uniThresEquals(1)
  expect(rac.Angle.half.tan())   .uniThresEquals(0)
  expect(rac.Angle.neighth.tan()).uniThresEquals(-1)
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
  expect(rac.Angle.zero.add(rac.Angle.zero))
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

  expect(rac.Angle.zero.subtract(rac.Angle.zero))
    .equalsAngle(0);
  expect(rac.Angle.zero.subtract(1/4))
    .equalsAngle(3/4);
  expect(rac.Angle.zero.subtract(-1/4))
    .equalsAngle(1/4);

  expect(rac.Angle.half.subtract(rac.Angle.zero))
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


tools.test( function shiftAndShiftToOrigin() {
  expect(rac.Angle.zero.shift(rac.Angle.zero))
    .equalsAngle(0.0);
  expect(rac.Angle.zero.shift(0.0, false))
    .equalsAngle(0.0);

  expect(rac.Angle.zero.shift(rac.Angle.tenth))
    .equalsAngle(0.1);
  expect(rac.Angle.zero.shift(0.1, false))
    .equalsAngle(0.9);

  expect(rac.Angle.half.shift(rac.Angle.tenth))
    .equalsAngle(0.6);
  expect(rac.Angle.half.shift(0.1, false))
    .equalsAngle(0.4);

  expect(rac.Angle.zero.shiftToOrigin(rac.Angle.zero))
    .equalsAngle(0.0);
  expect(rac.Angle.zero.shiftToOrigin(0.0, false))
    .equalsAngle(0.0);

  expect(rac.Angle.tenth.shiftToOrigin(rac.Angle.zero))
    .equalsAngle(0.1);
  expect(rac.Angle.tenth.shiftToOrigin(0.0, false))
    .equalsAngle(0.9);

  expect(rac.Angle.tenth.shiftToOrigin(rac.Angle.half))
    .equalsAngle(0.6);
  expect(rac.Angle.tenth.shiftToOrigin(0.5, false))
    .equalsAngle(0.4);
});


// Full coverage!

