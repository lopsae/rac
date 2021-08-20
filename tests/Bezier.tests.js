'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const hunty = rac.Bezier(100, 0, 74, 36, 36, 74, 0, 100);


tools.test( function identity() {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Bezier.zero).not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);

  // Instance members
  expect(rac.Bezier.zero).equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);
  expect(hunty).equalsBezier(100, 0, 74, 36, 36, 74, 0, 100);

  // Inequality
  expect(rac.Bezier.zero).not.equalsBezier(7, 0, 0, 0, 0, 0, 0, 0);
  expect(rac.Bezier.zero).not.equalsBezier(0, 7, 0, 0, 0, 0, 0, 0);
  expect(rac.Bezier.zero).not.equalsBezier(0, 0, 7, 0, 0, 0, 0, 0);
  expect(rac.Bezier.zero).not.equalsBezier(0, 0, 0, 7, 0, 0, 0, 0);
  expect(rac.Bezier.zero).not.equalsBezier(0, 0, 0, 0, 7, 0, 0, 0);
  expect(rac.Bezier.zero).not.equalsBezier(0, 0, 0, 0, 0, 7, 0, 0);
  expect(rac.Bezier.zero).not.equalsBezier(0, 0, 0, 0, 0, 0, 7, 0);
  expect(rac.Bezier.zero).not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 7);

  // Unexpected type for equalsBezier
  expect(null)            .not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);
  expect(0)               .not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);
  expect('0')             .not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);
  expect(rac.Angle.zero)  .not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);
  expect(rac.Point.zero)  .not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);
  expect(rac.Ray.zero)    .not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);
  expect(rac.Segment.zero).not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);
  expect(rac.Arc.zero)    .not.equalsBezier(0, 0, 0, 0, 0, 0, 0, 0);

  // Expected type for equals
  expect(hunty.equals(hunty)).toBe(true);
  expect(hunty.equals(rac.Bezier.zero)).toBe(false);

  // Unexpected type for equals
  expect(hunty.equals(null))            .toBe(false);
  expect(hunty.equals(100))             .toBe(false);
  expect(hunty.equals('100'))           .toBe(false);
  expect(hunty.equals(rac.Angle.zero))  .toBe(false);
  expect(hunty.equals(rac.Point.zero))  .toBe(false);
  expect(hunty.equals(rac.Ray.zero))    .toBe(false);
  expect(hunty.equals(rac.Segment.zero)).toBe(false);
  expect(hunty.equals(rac.Arc.zero))    .toBe(false);
});


tools.test( function toString() {
  const bezier = rac.Bezier(
    1.12345, 2.12345, 3.12345, 4.12345,
    5.12345, 6.12345, 7.12345, 8.12345);

  const string = bezier.toString();
  expect(string).toMatch('Bezier');
  expect(string).toMatch( 's:(1.12345,2.12345)');
  expect(string).toMatch('sa:(3.12345,4.12345)');
  expect(string).toMatch('ea:(5.12345,6.12345)');
  expect(string).toMatch( 'e:(7.12345,8.12345)');

  const cutString = bezier.toString(2);
  expect(cutString).toMatch('Bezier');
  expect(cutString).toMatch( 's:(1.12,2.12)');
  expect(cutString).toMatch('sa:(3.12,4.12)');
  expect(cutString).toMatch('ea:(5.12,6.12)');
  expect(cutString).toMatch( 'e:(7.12,8.12)');

  expect(cutString).not.toMatch('1.123');
  expect(cutString).not.toMatch('2.123');
  expect(cutString).not.toMatch('3.123');
  expect(cutString).not.toMatch('4.123');
  expect(cutString).not.toMatch('5.123');
  expect(cutString).not.toMatch('6.123');
  expect(cutString).not.toMatch('7.123');
  expect(cutString).not.toMatch('8.123');
});


// TODO: test.todo('Check for coverage!');

