'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


tools.test.todo( function identity() {
})


tools.test( function toString() {
  const bezier = rac.Bezier(
    1.12345, 2.12345, 3.12345, 4.12345,
    5.12345, 6.12345, 7.12345, 8.12345);

  const string = bezier.toString();
  expect(string).toMatch('Bezier');
  expect(string).toMatch('1.12345');
  expect(string).toMatch('2.12345');
  expect(string).toMatch('3.12345');
  expect(string).toMatch('4.12345');
  expect(string).toMatch('5.12345');
  expect(string).toMatch('6.12345');
  expect(string).toMatch('7.12345');
  expect(string).toMatch('8.12345');

  const cutString = bezier.toString(2);
  expect(cutString).toMatch('Bezier');
  expect(cutString).toMatch('1.12');
  expect(cutString).toMatch('2.12');
  expect(cutString).toMatch('3.12');
  expect(cutString).toMatch('4.12');
  expect(cutString).toMatch('5.12');
  expect(cutString).toMatch('6.12');
  expect(cutString).toMatch('7.12');
  expect(cutString).toMatch('8.12');

  expect(cutString).not.toMatch('1.123');
  expect(cutString).not.toMatch('2.123');
  expect(cutString).not.toMatch('3.123');
  expect(cutString).not.toMatch('4.123');
  expect(cutString).not.toMatch('5.123');
  expect(cutString).not.toMatch('6.123');
  expect(cutString).not.toMatch('7.123');
  expect(cutString).not.toMatch('8.123');
});


test.todo('Check for coverage!');

