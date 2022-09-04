'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const ha = Rac.Text.Format.horizontalAlign;
const va = Rac.Text.Format.verticalAlign;

const centered = rac.Text.Format(ha.center, va.center);
const upright =  rac.Text.Format(ha.left, va.baseline, 3/4);
const mono =     rac.Text.Format(ha.left, va.top, 0, 'mono', 14);

tools.test( function identity() {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Text.Format.centerCenter).not.equalsTextFormat(ha.center, va.center);
  expect(rac.Text.Format.centerCenter)         .equalsTextFormat(ha.center, va.center);

  expect(otherRac.Text.Format.centerCenter.equals(rac.Text.Format.centerCenter))
    .toBe(true);

  // Testing Constants
  expect(centered).equalsTextFormat(ha.center, va.center);
  expect(upright) .equalsTextFormat(ha.left, va.baseline, 3/4);
  expect(mono)    .equalsTextFormat(ha.left, va.top, 0, 'mono', 14);

  // Angle/number parameter
  expect(upright).equalsTextFormat(ha.left, va.baseline, rac.Angle.up);
  expect(upright).equalsTextFormat(ha.left, va.baseline, 3/4);

  // Inequality
  expect(centered).not.equalsTextFormat(ha.left,   va.center, 0,   null,  null);
  expect(centered).not.equalsTextFormat(ha.center, va.top,    0,   null,  null);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 1/2, null,  null);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 0,  'sans', null);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 0,   null,  10);

  expect(mono).not.equalsTextFormat(ha.left, va.top, 1/2, 'mono', 14);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 1/2, null, 14);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 1/2, 'mono', null);
  expect(mono).not.equalsTextFormat(ha.left, va.top);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 1/2);
  expect(mono).not.equalsTextFormat(ha.left, va.top, 1/2, null);


  // Unexpected type for equalsTextFormat
  expect(null)            .not.equalsTextFormat(ha.center, va.center);
  expect(0)               .not.equalsTextFormat(ha.center, va.center);
  expect('')              .not.equalsTextFormat(ha.center, va.center);
  expect('0')             .not.equalsTextFormat(ha.center, va.center);
  expect(true)            .not.equalsTextFormat(ha.center, va.center);
  expect(false)           .not.equalsTextFormat(ha.center, va.center);
  expect(rac.Point.zero)  .not.equalsTextFormat(ha.center, va.center);
  expect(rac.Ray.zero)    .not.equalsTextFormat(ha.center, va.center);
  expect(rac.Segment.zero).not.equalsTextFormat(ha.center, va.center);
  expect(rac.Text.sphinx) .not.equalsTextFormat(ha.center, va.center);

  // Expected type for equals
  expect(centered.equals(rac.Text.Format.centerCenter)).toBe(true);
  expect(centered.equals(rac.Text.Format.bottomRight))     .toBe(false);

  // Unexpected type for equals
  expect(centered.equals(null)).toBe(false);
  expect(centered.equals(0)).toBe(false);
  expect(centered.equals('')).toBe(false);
  expect(centered.equals('0')).toBe(false);
  expect(centered.equals(100)).toBe(false);
  expect(centered.equals('100')).toBe(false);
  expect(centered.equals(true)).toBe(false);
  expect(centered.equals(false)).toBe(false);
  expect(centered.equals(rac.Point.zero)).toBe(false);
  expect(centered.equals(rac.Ray.zero)).toBe(false);
  expect(centered.equals(rac.Segment.zero)).toBe(false);
  expect(centered.equals(rac.Text.sphinx)).toBe(false);
});


tools.test( function toString() {
  const format = rac.Text.Format(ha.right, va.bottom, 0.12345, 'monospace', 14);
  expect(format.toString()) .toBe('Text.Format(ha:right va:bottom a:0.12345 f:"monospace" s:14)');
  expect(format.toString(2)).toBe('Text.Format(ha:right va:bottom a:0.12 f:"monospace" s:14.00)');

  const zeroFormat = rac.Text.Format(ha.right, va.bottom, 0.12345, '', 0);
  expect(zeroFormat.toString()) .toBe('Text.Format(ha:right va:bottom a:0.12345 f:"" s:0)');
  expect(zeroFormat.toString(2)).toBe('Text.Format(ha:right va:bottom a:0.12 f:"" s:0.00)');

  const nullFormat = rac.Text.Format(ha.right, va.bottom, 0.12345, null, null);
  expect(nullFormat.toString()) .toBe('Text.Format(ha:right va:bottom a:0.12345 f:null s:null)');
  expect(nullFormat.toString(2)).toBe('Text.Format(ha:right va:bottom a:0.12 f:null s:null)');
});


tools.test( function thrownErrors() {
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', 14);})
    .not.toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, null, null);})
    .not.toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top);})
    .not.toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Missing parameter
  expect(() => {new Rac.Text.Format(null, ha.left, va.top, rac.Angle.zero, 'sans', 14);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, null, va.top, rac.Angle.zero, 'sans', 14);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, null, rac.Angle.zero, 'sans', 14);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid parameters
  expect(() => {new Rac.Text.Format('rac', ha.left, va.top, rac.Angle.zero, 'sans', 14);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.nonsense, va.top, rac.Angle.zero, 'sans', 14);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.nonsense, rac.Angle.zero, 'sans', 14);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, 0, 'sans', 14);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 1337, 14);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text.Format(rac, ha.left, va.top, rac.Angle.zero, 'sans', '14');})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


tools.test( function instanceMembers() {
  expect(rac.TextFormat(ha.left, va.baseline, 1/8, 'mono', 14))
    .equalsTextFormat(ha.left, va.baseline, 1/8, 'mono', 14);

  expect(rac.Text.Format.topLeft)     .equalsTextFormat(ha.left, va.top);
  expect(rac.Text.Format.topRight)    .equalsTextFormat(ha.right, va.top);

  expect(rac.Text.Format.centerLeft)  .equalsTextFormat(ha.left, va.center);
  expect(rac.Text.Format.centerCenter).equalsTextFormat(ha.center, va.center);
  expect(rac.Text.Format.centered)    .equalsTextFormat(ha.center, va.center);
  expect(rac.Text.Format.centerRight) .equalsTextFormat(ha.right, va.center);

  expect(rac.Text.Format.bottomLeft)  .equalsTextFormat(ha.left, va.bottom);
  expect(rac.Text.Format.bottomRight) .equalsTextFormat(ha.right, va.bottom);
});


tools.test( function withAngleFontSize() {
  expect(upright.withAngle(1/4)).equalsTextFormat(ha.left, va.baseline, 1/4);
  expect(upright.withAngle(rac.Angle.quarter)).equalsTextFormat(ha.left, va.baseline, 1/4);

  expect(upright.withFont('sans')).equalsTextFormat(ha.left, va.baseline, 3/4, 'sans');
  expect(mono.withFont(null)).equalsTextFormat(ha.left, va.top, 0, null, 14);

  expect(upright.withSize(14)).equalsTextFormat(ha.left, va.baseline, 3/4, null, 14);
  expect(mono.withSize(null)).equalsTextFormat(ha.left, va.top, 0, 'mono', null);
});


tools.test( function reverse() {
  expect(rac.Text.Format.topRight.reverse()).equalsTextFormat(ha.left, va.bottom, 1/2);
  expect(rac.Text.Format.bottomLeft.reverse()).equalsTextFormat(ha.right, va.top, 1/2);
  expect(rac.Text.Format.centerCenter.reverse()).equalsTextFormat(ha.center, va.center, 1/2);

  expect(upright.reverse()).equalsTextFormat(ha.right, va.baseline, 1/4);
});


// Full coverage!

