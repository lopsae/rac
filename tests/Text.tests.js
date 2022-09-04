'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const wizards = rac.Text(55, 55, 'The five boxing wizards jump quickly',
  rac.Text.Format.centered);
const example = rac.Text(100, 100, 'example');
// RELEASE-TODO: test that equalsText is ignoring format


test('Identity', () => {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Text.sphinx).not.equalsText(0, 0, 'sphinx of black quartz, judge my vow');
  expect(rac.Text.sphinx)         .equalsText(0, 0, 'sphinx of black quartz, judge my vow');

  expect(null).not.equalsText(0, 0, "Identity");

  expect(wizards).equalsText(55, 55, 'The five boxing wizards jump quickly');
  expect(wizards).not.equalsText(7, 7, 'The five boxing wizards jump quickly');

  let string = wizards.toString();
  expect(string).toMatch('Text');
  expect(string).toMatch('55,55');
  expect(string).toMatch('The five boxing wizards jump quickly');
});


tools.test( function toString() {
  const formatLessText = rac.Text(3.12345, 4.12345, 'sphinx of black quartz');

  expect(formatLessText.toString()) .toBe('Text((3.12345,4.12345) "sphinx of black quartz")');
  expect(formatLessText.toString(2)).toBe('Text((3.12,4.12) "sphinx of black quartz")');

  const text = rac.Text(1.12345, 2.12345, 'judge my vow', rac.Text.Format.bottomRight);

  expect(text.toString()) .toBe('Text((1.12345,2.12345) "judge my vow")');
  expect(text.toString(2)).toBe('Text((1.12,2.12) "judge my vow")');
});


// RELEASE-TODO: test!
test.todo('Check for coverage!');
// NOT Full coverage!

