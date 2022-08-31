'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const ha = Rac.Text.Format.horizontalAlign;
const va = Rac.Text.Format.verticalAlign;

const centered = rac.Text.Format(ha.center, va.center);


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
  expect(centered).equalsTextFormat(ha.center, va.center, 0, null, null);

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


  // from text

  // expect(null).not.equalsText(0, 0, "Identity");

  // expect(wizards).equalsText(55, 55, 'The five boxing wizards jump quickly');
  // expect(wizards).not.equalsText(7, 7, 'The five boxing wizards jump quickly');

  // let string = wizards.toString();
  // expect(string).toMatch('Text');
  // expect(string).toMatch('55,55');
  // expect(string).toMatch('The five boxing wizards jump quickly');
});


TODO: test.todo('Check for coverage!');

