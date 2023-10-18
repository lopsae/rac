'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const ha = Rac.Text.Format.horizontalAlign;
const va = Rac.Text.Format.verticalAlign;

// With default format, topLeft
const quartz = rac.Text(100, 100, 'black quartz');
// With ready-built format
const zebras = rac.Text(55, 55, 'daft zebras', rac.Text.Format.centered);
// With custom format
const nymph = rac.Text(77, 77, 'quiz nymph',
  rac.Text.Format(ha.right, va.baseline, 3/4, 'sans', 14, 7, 5));


tools.test( function identity() {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Text.sphinx).not.equalsText(0, 0, 'sphinx of black quartz, judge my vow');
  expect(rac.Text.sphinx)         .equalsText(0, 0, 'sphinx of black quartz, judge my vow');

  expect(otherRac.Text.sphinx.equals(rac.Text.sphinx)).toBe(true);

  // Testing Constants
  expect(quartz).equalsText(100, 100, 'black quartz');
  expect(quartz.format).equalsTextFormat(ha.left, va.top);

  expect(zebras).equalsText(55, 55, 'daft zebras');
  expect(zebras.format).equalsTextFormat(ha.center, va.center);

  expect(nymph).equalsText(77, 77, 'quiz nymph');
  expect(nymph.format).equalsTextFormat(ha.right, va.baseline, 3/4, 'sans', 14, 7, 5);

  // Assertion Inequality
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
  expect(zebras.equals(undefined))               .toBe(false);
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


tools.test( function ignoresFormats() {
  // Different formats, same properties
  const rightZebras = rac.Text(55, 55, 'daft zebras', rac.Text.Format.bottomRight);
  expect(rightZebras).equalsText(55, 55, 'daft zebras');
  expect(rightZebras.format).equalsTextFormat(ha.right, va.bottom);

  expect(zebras).equalsText(55, 55, 'daft zebras');
  expect(zebras.format).equalsTextFormat(ha.center, va.center);

  expect(zebras.equals(rightZebras)).toBe(true);

  // Different strings, same formats
  const whiteQuartz = rac.Text(100, 100, 'white quartz');
  expect(whiteQuartz).equalsText(100, 100, 'white quartz');
  expect(whiteQuartz.format).equalsTextFormat(ha.left, va.top);

  expect(quartz).equalsText(100, 100, 'black quartz');
  expect(quartz.format).equalsTextFormat(ha.left, va.top);

  expect(quartz.equals(whiteQuartz)).toBe(false);
});


tools.test(function withAngle_Font_Size() {
  expect(quartz.withAngle(1/2).format)
    .equalsTextFormat(ha.left, va.top, 1/2);
  expect(quartz.withAngle(5/4).format)
    .equalsTextFormat(ha.left, va.top, 1/4);
  expect(quartz.withAngle(rac.Angle.eighth).format)
    .equalsTextFormat(ha.left, va.top, 1/8);

  expect(quartz.withFont('sans').format)
    .equalsTextFormat(ha.left, va.top, 0, 'sans');
  expect(nymph.withFont(null).format)
    .equalsTextFormat(ha.right, va.baseline, 3/4, null, 14, 7, 5);

  expect(quartz.withSize(55).format)
    .equalsTextFormat(ha.left, va.top, 0, null, 55);
  expect(nymph.withSize(null).format)
    .equalsTextFormat(ha.right, va.baseline, 3/4, 'sans', null, 7, 5);
});


tools.test(function withPaddings() {
  expect(quartz.withPaddings(77, 55).format)
    .equalsTextFormat(ha.left, va.top, 0, null, null, 77, 55);
  expect(nymph.withPaddings(77, 55).format)
    .equalsTextFormat(ha.right, va.baseline, 3/4, 'sans', 14, 77, 55);

  expect(quartz.withPaddings(77).format)
    .equalsTextFormat(ha.left, va.top, 0, null, null, 77, 77);
  expect(nymph.withPaddings(55).format)
    .equalsTextFormat(ha.right, va.baseline, 3/4, 'sans', 14, 55, 55);
});


tools.test( function reverse() {
  expect(quartz.reverse().format).equalsTextFormat(ha.right, va.bottom, 1/2);
  expect(zebras.reverse().format).equalsTextFormat(ha.center, va.center, 1/2);
  expect(nymph .reverse().format).equalsTextFormat(ha.left, va.baseline, 1/4, 'sans', 14, 7, 5);

  expect(zebras.withAngle(3/8).reverse().format)
    .equalsTextFormat(ha.center, va.center, 7/8);
});


tools.test( function upright() {
  // None of the constants are reversed, so none change
  expect(quartz.upright().format).equalsTextFormat(ha.left, va.top, 0);
  expect(zebras.upright().format).equalsTextFormat(ha.center, va.center, 0);
  expect(nymph .upright().format).equalsTextFormat(ha.right, va.baseline, 3/4, 'sans', 14, 7, 5);

  expect(quartz.withAngle(1/4).upright().format)
    .equalsTextFormat(ha.right, va.bottom, 3/4);
  expect(zebras.withAngle(3/8).upright().format)
    .equalsTextFormat(ha.center, va.center, 7/8);
  expect(nymph .withAngle(1/2).upright().format)
    .equalsTextFormat(ha.left, va.baseline, 0, 'sans', 14, 7, 5);
});


// Full coverage!

