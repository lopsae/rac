'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const ha = Rac.Text.Format.horizontalAlign;
const va = Rac.Text.Format.verticalAlign;

// With all defaults
const centered = rac.Text.Format(ha.center, va.center);
// With default font, size, paddings
const standing = rac.Text.Format(ha.left,   va.baseline, 3/4);
// With default vPadding
const diagonal = rac.Text.Format(ha.right,  va.bottom,   7/8, null, null, 10);
// No defaults
const mono     = rac.Text.Format(ha.left,   va.top,      0, 'mono', 14, 7, 5);


tools.test( function identity() {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Text.Format.centerCenter).not.equalsTextFormat(ha.center, va.center);
  expect(     rac.Text.Format.centerCenter)    .equalsTextFormat(ha.center, va.center);

  expect(otherRac.Text.Format.centerCenter.equals(rac.Text.Format.centerCenter))
    .toBe(true);

  // Testing Constants
  expect(centered).equalsTextFormat(ha.center, va.center);
  expect(standing).equalsTextFormat(ha.left, va.baseline, 3/4);
  expect(diagonal).equalsTextFormat(ha.right, va.bottom, 7/8, null, null, 10);
  expect(mono)    .equalsTextFormat(ha.left, va.top, 0, 'mono', 14, 7, 5);

  // Angle/number parameter
  expect(standing).equalsTextFormat(ha.left, va.baseline, rac.Angle.up);
  expect(standing).equalsTextFormat(ha.left, va.baseline, 3/4);

  // Assertion Inequality
  expect(centered)    .equalsTextFormat(ha.center, va.center, 0,   null,  null, 0, 0);
  expect(centered).not.equalsTextFormat(ha.left,   va.center, 0,   null,  null, 0, 0);
  expect(centered).not.equalsTextFormat(ha.center, va.top,    0,   null,  null, 0, 0);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 1/2, null,  null, 0, 0);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 0,  'sans', null, 0, 0);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 0,   null,  10,   0, 0);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 0,   null,  10,   7, 0);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 0,   null,  10,   0, 7);

  expect(mono)    .equalsTextFormat(ha.left, va.top, 0,   'mono', 14,   7, 5);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 1/2, 'mono', 14,   7, 5);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0 ,   null,  14,   7, 5);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0 ,  'mono', null, 7, 5);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0,   'mono', 14,   0, 5);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0,   'mono', 14,   7, 0);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0,   'mono', 14,   0, 0)
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0,   'mono', 14,   0);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0,   'mono', 14);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0,   'mono');
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0);
  expect(mono).not.equalsTextFormat(ha.left, va.top);

  // Unexpected type for equalsTextFormat
  expect(null)           .not.equalsTextFormat(ha.center, va.center);
  expect(undefined)      .not.equalsTextFormat(ha.center, va.center);
  expect(0)              .not.equalsTextFormat(ha.center, va.center);
  expect('')             .not.equalsTextFormat(ha.center, va.center);
  expect('0')            .not.equalsTextFormat(ha.center, va.center);
  expect(55)             .not.equalsTextFormat(ha.center, va.center);
  expect('55')           .not.equalsTextFormat(ha.center, va.center);
  expect('some')         .not.equalsTextFormat(ha.center, va.center);
  expect(true)           .not.equalsTextFormat(ha.center, va.center);
  expect(false)          .not.equalsTextFormat(ha.center, va.center);
  expect(rac.Angle.zero) .not.equalsTextFormat(ha.center, va.center);
  expect(rac.Point.zero) .not.equalsTextFormat(ha.center, va.center);
  expect(rac.Ray.zero)   .not.equalsTextFormat(ha.center, va.center);
  expect(rac.Text.sphinx).not.equalsTextFormat(ha.center, va.center);

  // Expected type for equals
  expect(centered.equals(rac.Text.Format.centerCenter)).toBe(true);
  expect(centered.equals(rac.Text.Format.bottomRight)) .toBe(false);

  // Unexpected type for equals
  expect(centered.equals(null))            .toBe(false);
  expect(centered.equals(undefined))       .toBe(false);
  expect(centered.equals(0))               .toBe(false);
  expect(centered.equals(''))              .toBe(false);
  expect(centered.equals('0'))             .toBe(false);
  expect(centered.equals(55))              .toBe(false);
  expect(centered.equals('55'))            .toBe(false);
  expect(centered.equals('some'))          .toBe(false);
  expect(centered.equals(true))            .toBe(false);
  expect(centered.equals(false))           .toBe(false);
  expect(centered.equals(rac.Angle.zero))  .toBe(false);
  expect(centered.equals(rac.Point.zero))  .toBe(false);
  expect(centered.equals(rac.Ray.zero))    .toBe(false);
  expect(centered.equals(rac.Text.sphinx)) .toBe(false);
});


tools.test( function toString() {
  const format = rac.Text.Format(
    ha.right, va.bottom,
    0.12345, 'monospace', 14,
    1.23456, 2.34567);
  expect(format.toString())
    .toBe('Text.Format(ha:right va:bottom a:0.12345 f:"monospace" s:14 p:(1.23456,2.34567))');
  expect(format.toString(2))
    .toBe('Text.Format(ha:right va:bottom a:0.12 f:"monospace" s:14.00 p:(1.23,2.35))');

  // To test that nullish size/font are printed as empty/zero, not as null
  const zeroFormat = rac.Text.Format(
    ha.right, va.bottom,
    0.12345, '', 0,
    1.23456, 2.34567);
  expect(zeroFormat.toString())
    .toBe('Text.Format(ha:right va:bottom a:0.12345 f:"" s:0 p:(1.23456,2.34567))');
  expect(zeroFormat.toString(2))
    .toBe('Text.Format(ha:right va:bottom a:0.12 f:"" s:0.00 p:(1.23,2.35))');

  const nullFormat = rac.Text.Format(
    ha.right, va.bottom,
    0.12345, null, null,
    1.23456, 2.34567);
  expect(nullFormat.toString())
    .toBe('Text.Format(ha:right va:bottom a:0.12345 f:null s:null p:(1.23456,2.34567))');
  expect(nullFormat.toString(2))
    .toBe('Text.Format(ha:right va:bottom a:0.12 f:null s:null p:(1.23,2.35))');
});


tools.test( function thrownErrors() {
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', 14, 7, 5);})
    .not.toThrow();
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', 14);})
    .not.toThrow();
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, null, null);})
    .not.toThrow();
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top);})
    .not.toThrow();

  // Missing parameter
  expect(() => {new Rac.Text.Format(null, ha.left, va.top, rac.Angle.zero, 'sans', 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, null, va.top, rac.Angle.zero, 'sans', 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, null, rac.Angle.zero, 'sans', 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, null, 'sans', 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', 14, null, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', 14, 7, null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid parameters
  expect(() => {new Rac.Text.Format('rac', ha.left, va.top, rac.Angle.zero, 'sans', 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.nonsense, va.top, rac.Angle.zero, 'sans', 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.nonsense, rac.Angle.zero, 'sans', 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, 0, 'sans', 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 1337, 14, 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', '14', 7, 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', 14, '7', 5);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', 14, 7, '5');})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


tools.test( function defaultParameters() {
  expect(centered).equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(centered).equalsTextFormat(ha.center, va.center, 0, null);
  expect(centered).equalsTextFormat(ha.center, va.center, 0);
  expect(centered).equalsTextFormat(ha.center, va.center);

  expect(standing)    .equalsTextFormat(ha.left, va.baseline, 3/4);
  expect(standing)    .equalsTextFormat(ha.left, va.baseline, 3/4, null, null, 0, 0);
  expect(standing).not.equalsTextFormat(ha.left, va.baseline);

  expect(diagonal)    .equalsTextFormat(ha.right, va.bottom, 7/8, null, null, 10);
  expect(diagonal)    .equalsTextFormat(ha.right, va.bottom, 7/8, null, null, 10, 0);
  expect(diagonal).not.equalsTextFormat(ha.right, va.bottom, 7/8, null, null);

  expect(mono)    .equalsTextFormat(ha.left, va.top, 0, 'mono', 14, 7, 5);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 0, 'mono', 14);
  expect(mono).not.equalsTextFormat(ha.left, va.top);
});


tools.test( function instanceMembers() {
  expect(rac.Text.Format.topLeft)     .equalsTextFormat(ha.left,   va.top);
  expect(rac.Text.Format.tl)          .equalsTextFormat(ha.left,   va.top);
  expect(rac.Text.Format.topCenter)   .equalsTextFormat(ha.center, va.top);
  expect(rac.Text.Format.tc)          .equalsTextFormat(ha.center, va.top);
  expect(rac.Text.Format.topRight)    .equalsTextFormat(ha.right,  va.top);
  expect(rac.Text.Format.tr)          .equalsTextFormat(ha.right,  va.top);

  expect(rac.Text.Format.centerLeft)  .equalsTextFormat(ha.left,   va.center);
  expect(rac.Text.Format.cl)          .equalsTextFormat(ha.left,   va.center);
  expect(rac.Text.Format.centerCenter).equalsTextFormat(ha.center, va.center);
  expect(rac.Text.Format.centered)    .equalsTextFormat(ha.center, va.center);
  expect(rac.Text.Format.cc)          .equalsTextFormat(ha.center, va.center);
  expect(rac.Text.Format.centerRight) .equalsTextFormat(ha.right,  va.center);
  expect(rac.Text.Format.cr)          .equalsTextFormat(ha.right,  va.center);

  expect(rac.Text.Format.bottomLeft)  .equalsTextFormat(ha.left,   va.bottom);
  expect(rac.Text.Format.bl)          .equalsTextFormat(ha.left,   va.bottom);
  expect(rac.Text.Format.bottomCenter).equalsTextFormat(ha.center, va.bottom);
  expect(rac.Text.Format.bc)          .equalsTextFormat(ha.center, va.bottom);
  expect(rac.Text.Format.bottomRight) .equalsTextFormat(ha.right,  va.bottom);
  expect(rac.Text.Format.br)          .equalsTextFormat(ha.right,  va.bottom);

  expect(rac.Text.Format.baselineLeft)  .equalsTextFormat(ha.left,   va.baseline);
  expect(rac.Text.Format.bll)           .equalsTextFormat(ha.left,   va.baseline);
  expect(rac.Text.Format.baselineCenter).equalsTextFormat(ha.center, va.baseline);
  expect(rac.Text.Format.blc)           .equalsTextFormat(ha.center, va.baseline);
  expect(rac.Text.Format.baselineRight) .equalsTextFormat(ha.right,  va.baseline);
  expect(rac.Text.Format.blr)           .equalsTextFormat(ha.right,  va.baseline);
});


// Test that Text.Format and TextFormat are producing the same results
tools.test( function functionAliasEquality() {
  let aligned   = rac.Text.Format(ha.right, va.baseline);
  let alignedAlt = rac.TextFormat(ha.right, va.baseline);
  expect(aligned)   .equalsTextFormat(ha.right, va.baseline, 0, null, null);
  expect(alignedAlt).equalsTextFormat(ha.right, va.baseline, 0, null, null);
  expect(aligned.equals(alignedAlt)).toBe(true);

  let tilted   = rac.Text.Format(ha.left, va.center, 1/8);
  let tiltedAlt = rac.TextFormat(ha.left, va.center, 1/8);
  expect(tilted)   .equalsTextFormat(ha.left, va.center, 1/8, null, null);
  expect(tiltedAlt).equalsTextFormat(ha.left, va.center, 1/8, null, null);
  expect(tilted.equals(tiltedAlt)).toBe(true);

  let fonted   = rac.Text.Format(ha.center, va.baseline, 0, 'mono', 14);
  let fontedAlt = rac.TextFormat(ha.center, va.baseline, 0, 'mono', 14);
  expect(fonted)   .equalsTextFormat(ha.center, va.baseline, 0, 'mono', 14);
  expect(fontedAlt).equalsTextFormat(ha.center, va.baseline, 0, 'mono', 14);
  expect(fonted.equals(fontedAlt)).toBe(true);

  expect(aligned.equals(tilted)).toBe(false);
  expect(tilted .equals(fonted)).toBe(false);
  expect(fonted .equals(aligned)).toBe(false);
});


tools.test( function withAngleFontSize() {
  expect(standing.withAngle(1/4)).equalsTextFormat(ha.left, va.baseline, 1/4);
  expect(standing.withAngle(rac.Angle.quarter)).equalsTextFormat(ha.left, va.baseline, 1/4);

  expect(standing.withFont('sans')).equalsTextFormat(ha.left, va.baseline, 3/4, 'sans');
  expect(mono.withFont(null)).equalsTextFormat(ha.left, va.top, 0, null, 14, 7, 5);

  expect(standing.withSize(14)).equalsTextFormat(ha.left, va.baseline, 3/4, null, 14);
  expect(mono.withSize(null)).equalsTextFormat(ha.left, va.top, 0, 'mono', null, 7, 5);
});


tools.test( function withPaddings() {
  expect(centered.withPaddings(77, 55)).equalsTextFormat(ha.center, va.center, 0, null, null, 77, 55);
  expect(diagonal.withPaddings(77, 55)).equalsTextFormat(ha.right, va.bottom, 7/8, null, null, 77, 55);

  expect(centered.withPaddings(77)).equalsTextFormat(ha.center, va.center, 0, null, null, 77, 77);
  expect(diagonal.withPaddings(55)).equalsTextFormat(ha.right, va.bottom, 7/8, null, null, 55, 55);
});


tools.test( function reverse() {
  expect(rac.Text.Format.topRight.reverse()).equalsTextFormat(ha.left, va.bottom, 1/2);
  expect(rac.Text.Format.bottomLeft.reverse()).equalsTextFormat(ha.right, va.top, 1/2);
  expect(rac.Text.Format.centerCenter.reverse()).equalsTextFormat(ha.center, va.center, 1/2);
  expect(rac.Text.Format.baselineLeft.reverse()).equalsTextFormat(ha.right, va.baseline, 1/2);

  expect(centered.reverse()).equalsTextFormat(ha.center, va.center, 1/2);
  expect(standing.reverse()).equalsTextFormat(ha.right, va.baseline, 1/4);
  expect(diagonal.reverse()).equalsTextFormat(ha.left, va.top, 3/8, null, null, 10, 0);
  expect(mono    .reverse()).equalsTextFormat(ha.right, va.bottom, 1/2, 'mono', 14, 7, 5);
});


// Full coverage!

