'use strict';


const Rac = require('rulerandcompass');
const tools = require('./testTools');


test('assertExists', () => {
  expect(() => {Rac.utils.assertExists();})
    .not.toThrow();
  expect(() => {Rac.utils.assertExists("one", "two");})
    .not.toThrow();
  expect(() => {Rac.utils.assertExists("one", null, "three");})
    .toThrow('FailedAssert');
});


test('typeName', () => {
  let Duck = class Duck {};
  let duck = new Duck();

  expect(Rac.utils.typeName(Duck))
    .toBe('function:Duck');
  expect(Rac.utils.typeName(duck))
    .toBe('Duck');

  let namedFunc = function named() {};
  expect(Rac.utils.typeName(namedFunc))
    .toBe('function:named');

  let unnamedFunc = function() {};
  expect(Rac.utils.typeName(unnamedFunc))
    .toBe('function:unnamedFunc');

  let anonymousFunc = () => {};
  expect(Rac.utils.typeName(anonymousFunc))
    .toBe('function:anonymousFunc');

  expect(Rac.utils.typeName(() => {}))
    .toBe('function');

  expect(Rac.utils.typeName(55))
    .toBe('Number');
  expect(Rac.utils.typeName('string'))
    .toBe('String');
});


test('addConstant', () => {
  let obj = {};
  expect(obj).not.toHaveProperty('prop');

  Rac.utils.addConstant(obj, 'prop', 'value');
  expect(obj).toHaveProperty('prop', 'value');

  let propDesc = Object.getOwnPropertyDescriptor(obj, 'prop');
  expect(propDesc.writable).toBe(false);

  obj.assigned = 'other';
  expect(obj).toHaveProperty('assigned', 'other');
  propDesc = Object.getOwnPropertyDescriptor(obj, 'assigned');
  expect(propDesc.writable).toBe(true);
});

