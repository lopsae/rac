'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const ha = Rac.Text.Format.horizontalAlign;
const va = Rac.Text.Format.verticalAlign;

const centered = rac.Text.Format(ha.center, va.center);
const upright = rac.Text.Format(ha.left, va.baseline, 3/4);


test('Identity', () => {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Text.Format.centerCenter)
    .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(rac.Text.Format.centerCenter).equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(otherRac.Text.Format.centerCenter.equals(rac.Text.Format.centerCenter))
    .toBe(true);

  // Instance members
  expect(rac.Text.Format.topLeft).equalsTextFormat(ha.left, va.top, 0, null, null);
  expect(rac.Text.Format.centerCenter).equalsTextFormat(ha.center, va.center, 0, null, null);

  // Testing Constants
  expect(centered).equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(upright).equalsTextFormat(ha.left, va.baseline, 3/4, null, null);

  // Angle/number parameter
  expect(upright).equalsTextFormat(ha.left, va.baseline, rac.Angle.up, null, null);
  expect(upright).equalsTextFormat(ha.left, va.baseline, 3/4, null, null);

  // Inequality
  expect(centered).not.equalsTextFormat(ha.left,   va.center, 0,   null,  null);
  expect(centered).not.equalsTextFormat(ha.center, va.top,    0,   null,  null);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 1/2, null,  null);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 0,  'sans', null);
  expect(centered).not.equalsTextFormat(ha.center, va.center, 0,   null,  10);

  // Unexpected type for equalsTextFormat
  expect(null)            .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(0)               .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect('')              .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect('0')             .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(true)            .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(false)           .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(rac.Point.zero)  .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(rac.Ray.zero)    .not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(rac.Segment.zero).not.equalsTextFormat(ha.center, va.center, 0, null, null);
  expect(rac.Text.sphinx) .not.equalsTextFormat(ha.center, va.center, 0, null, null);

  // Expected type for equals
  expect(centered.equals(rac.Text.Format.centerCenter)).toBe(true);
  expect(centered.equals(rac.Text.Format.topLeft))     .toBe(false);

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
  const format = rac.Text.Format(ha.right, va.bottom, 0.12345, 'monospace', 15);
  expect(format.toString()) .toBe('Text.Format(ha:right va:bottom a:0.12345 f:"monospace" s:15)');
  expect(format.toString(2)).toBe('Text.Format(ha:right va:bottom a:0.12 f:"monospace" s:15.00)');

  const zeroFormat = rac.Text.Format(ha.right, va.bottom, 0.12345, '', 0);
  expect(zeroFormat.toString()) .toBe('Text.Format(ha:right va:bottom a:0.12345 f:"" s:0)');
  expect(zeroFormat.toString(2)).toBe('Text.Format(ha:right va:bottom a:0.12 f:"" s:0.00)');

  const nullFormat = rac.Text.Format(ha.right, va.bottom, 0.12345, null, null);
  expect(nullFormat.toString()) .toBe('Text.Format(ha:right va:bottom a:0.12345 f:null s:null)');
  expect(nullFormat.toString(2)).toBe('Text.Format(ha:right va:bottom a:0.12 f:null s:null)');
});


TODO: test.todo('Check for coverage!');

