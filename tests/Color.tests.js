'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const grayish = rac.Color(0.5, 0.5, 0.5, 0.5);
const blackish = rac.Color(0.9, 0.9, 0.9, 0.9);


tools.test( function identity() {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Color.zero).not.equalsColor(0, 0, 0, 0);
  expect(rac.Color.zero)         .equalsColor(0, 0, 0, 0);

  expect(otherRac.Color.zero.equals(rac.Color.zero)).toBe(true);

  // Testing Constants
  expect(grayish) .equalsColor(0.5, 0.5, 0.5, 0.5);
  expect(blackish).equalsColor(0.9, 0.9, 0.9, 0.9);

  // Assertion Inequality
  expect(rac.Color.zero).not.equalsColor(1, 0, 0, 0);
  expect(rac.Color.zero).not.equalsColor(0, 1, 0, 0);
  expect(rac.Color.zero).not.equalsColor(0, 0, 1, 0);
  expect(rac.Color.zero).not.equalsColor(0, 0, 0, 1);


  // Unexpected type for equalsColor
  expect(null)            .not.equalsColor(0, 0, 0, 0);
  expect(undefined)       .not.equalsColor(0, 0, 0, 0);
  expect(0)               .not.equalsColor(0, 0, 0, 0);
  expect('')              .not.equalsColor(0, 0, 0, 0);
  expect('0')             .not.equalsColor(0, 0, 0, 0);
  expect(55)              .not.equalsColor(0, 0, 0, 0);
  expect('55')            .not.equalsColor(0, 0, 0, 0);
  expect('some')          .not.equalsColor(0, 0, 0, 0);
  expect(true)            .not.equalsColor(0, 0, 0, 0);
  expect(false)           .not.equalsColor(0, 0, 0, 0);
  expect(rac.Point.zero)  .not.equalsColor(0, 0, 0, 0);
  expect(rac.Angle.zero)  .not.equalsColor(0, 0, 0, 0);
  expect(rac.Ray.zero)    .not.equalsColor(0, 0, 0, 0);
  expect(rac.Segment.zero).not.equalsColor(0, 0, 0, 0);

  // Expected type for equals
  expect(grayish.equals(grayish)) .toBe(true);
  expect(grayish.equals(blackish)).toBe(false);

  // Unexpected type for equals
  expect(grayish.equals(null))            .toBe(false);
  expect(grayish.equals(undefined))       .toBe(false);
  expect(grayish.equals(''))              .toBe(false);
  expect(grayish.equals(0))               .toBe(false);
  expect(grayish.equals('0'))             .toBe(false);
  expect(grayish.equals(55))              .toBe(false);
  expect(grayish.equals('55'))            .toBe(false);
  expect(grayish.equals('some'))          .toBe(false);
  expect(grayish.equals(true))            .toBe(false);
  expect(grayish.equals(false))           .toBe(false);
  expect(grayish.equals(rac.Point.zero))  .toBe(false);
  expect(grayish.equals(rac.Angle.zero))  .toBe(false);
  expect(grayish.equals(rac.Ray.zero))    .toBe(false);
  expect(grayish.equals(rac.Segment.zero)).toBe(false);
});


tools.test( function toString() {
  const color = rac.Color(0.12345, 0.23456, 0.34567, 0.45678)

  expect(color.toString()) .toBe('Color(0.12345,0.23456,0.34567,0.45678)');
  expect(color.toString(2)).toBe('Color(0.12,0.23,0.34,0.45)');
});


// RELEASE-TODO: Full Coverage!

