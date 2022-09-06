'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const zebras = rac.Text(55, 55, 'daft zebras',
  rac.Text.Format.centered);
const quartz = rac.Text(100, 100, 'black quartz');
// RELEASE-TODO: test that equalsText is ignoring format

const ha = Rac.Text.Format.horizontalAlign;
const va = Rac.Text.Format.verticalAlign;


tools.test( function identity() {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Text.sphinx).not.equalsText(0, 0, 'sphinx of black quartz, judge my vow');
  expect(rac.Text.sphinx)         .equalsText(0, 0, 'sphinx of black quartz, judge my vow');

  expect(otherRac.Text.sphinx.equals(rac.Text.sphinx)).toBe(true);

  // Testing Constants
  expect(zebras).equalsText(55, 55, 'daft zebras');
  expect(zebras.format).equalsTextFormat(ha.center, va.center);

  expect(quartz).equalsText(100, 100, 'black quartz');
  expect(quartz.format).equalsTextFormat(ha.left, va.top);

  // Inequality
  expect(zebras).not.equalsText(0,  55, 'daft zebras');
  expect(zebras).not.equalsText(55, 0,  'daft zebras');
  expect(zebras).not.equalsText(55, 55, 'boxing wizards');

  // Unexpected type for equalsText
  expect(null)                    .not.equalsText(0, 0, '');
  expect(undefined)               .not.equalsText(0, 0, '');
  expect(0)                       .not.equalsText(0, 0, '');
  expect('')                      .not.equalsText(0, 0, '');
  expect('0')                     .not.equalsText(0, 0, '');
  expect(55)                      .not.equalsText(0, 0, '');
  expect('55')                    .not.equalsText(0, 0, '');
  expect('some')                  .not.equalsText(0, 0, '');
  expect(true)                    .not.equalsText(0, 0, '');
  expect(false)                   .not.equalsText(0, 0, '');
  expect(rac.Angle.zero)          .not.equalsText(0, 0, '');
  expect(rac.Ray.zero)            .not.equalsText(0, 0, '');
  expect(rac.Segment.zero)        .not.equalsText(0, 0, '');
  expect(rac.Text.Format.centered).not.equalsText(0, 0, '');

  // Expected type for equals
  expect(quartz.equals(quartz)).toBe(true);
  expect(quartz.equals(zebras)).toBe(false);

  // Unexpected type for equals
  expect(zebras.equals(null))                    .toBe(false);
  expect(zebras.equals(undefined))                    .toBe(false);
  expect(zebras.equals(''))                      .toBe(false);
  expect(zebras.equals(0))                       .toBe(false);
  expect(zebras.equals('0'))                     .toBe(false);
  expect(zebras.equals(55))                      .toBe(false);
  expect(zebras.equals('55'))                    .toBe(false);
  expect(zebras.equals('some'))                  .toBe(false);
  expect(zebras.equals(true))                    .toBe(false);
  expect(zebras.equals(false))                   .toBe(false);
  expect(zebras.equals(rac.Angle.zero))          .toBe(false);
  expect(zebras.equals(rac.Point.zero))          .toBe(false);
  expect(zebras.equals(rac.Ray.zero))            .toBe(false);
  expect(zebras.equals(rac.Text.Format.centered)).toBe(false);
});


tools.test( function toString() {
  const formatLessText = rac.Text(3.12345, 4.12345, 'sphinx of black quartz');
  expect(formatLessText.toString()) .toBe('Text((3.12345,4.12345) "sphinx of black quartz")');
  expect(formatLessText.toString(2)).toBe('Text((3.12,4.12) "sphinx of black quartz")');

  const text = rac.Text(1.12345, 2.12345, 'judge my vow', rac.Text.Format.bottomRight);
  expect(text.toString()) .toBe('Text((1.12345,2.12345) "judge my vow")');
  expect(text.toString(2)).toBe('Text((1.12,2.12) "judge my vow")');
});


tools.test( function thrownErrors() {
  const zero = rac.Point.zero;
  const centered = rac.Text.Format.centered;

  expect(() => {new Rac.Text(rac, zero, 'string', centered);})
    .not.toThrow();

  // Missing parameter
  expect(() => {new Rac.Text(null, zero, 'string', centered);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text(rac, null, 'string', centered);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text(rac, zero, null, centered);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text(rac, zero, 'string', null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid parameters
  expect(() => {new Rac.Text('rac', zero, 'string', centered);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text(rac, rac.Angle.zero, 'string', centered);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text(rac, zero, 1337, centered);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Text(rac, zero, 'string', `centered`);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


tools.test( function instanceMembers() {
  expect(rac.Text.hello).equalsText(0, 0, 'hello world!');
  expect(rac.Text.hello.format).equalsTextFormat(ha.left, va.top);

  expect(rac.Text.sphinx).equalsText(0, 0, 'sphinx of black quartz, judge my vow');
  expect(rac.Text.sphinx.format).equalsTextFormat(ha.left, va.top);
});



// RELEASE-TODO: test!
test.todo('Check for coverage!');
// NOT Full coverage!

