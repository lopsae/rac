'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const wizards = rac.Text(55, 55, 'The five boxing wizards jump quickly',
  rac.Text.Format.topLeft);


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
  // RELEASE-TODO: topLeft may be made optional
  const text = rac.Text(1.12345, 2.12345, 'judge my vow', rac.Text.Format.topLeft);

  const string = text.toString();
  expect(string).toMatch('Text');
  expect(string).toMatch('(1.12345,2.12345)');
  expect(string).toMatch('"judge my vow"');

  const cutString = text.toString(2);
  expect(cutString).toMatch('Text');
  expect(cutString).toMatch('(1.12,2.12)');
  expect(cutString).toMatch('"judge my vow"');

  expect(cutString).not.toMatch('1.123');
  expect(cutString).not.toMatch('2.123');
});


TODO: test.todo('Check for coverage!');

