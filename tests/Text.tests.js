'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


const wizards = rac.Text(55, 55, 'The five boxing wizards jump quickly',
  rac.Text.Format.topLeft);


test('Identity', () => {
  expect(null).not.equalsText(0, 0, "Identity");

  expect(wizards).equalsText(55, 55, 'The five boxing wizards jump quickly');
  expect(wizards).not.equalsText(7, 7, 'The five boxing wizards jump quickly');

  let string = wizards.toString();
  expect(string).toMatch('Text');
  expect(string).toMatch('55,55');
  expect(string).toMatch('The five boxing wizards jump quickly');
});


test.todo('Check for coverage!');

