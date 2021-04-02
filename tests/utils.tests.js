'use strict';


const Rac = require('rulerandcompass');
const tools = require('./tools');


test('Errors/Exception catched', () => {
  let storedBuildErrors = Rac.Exception.buildsErrors;

  Rac.Exception.buildsErrors = true;
  // Throwing error objects
  expect(() => {Rac.utils.assertExists("one");})
    .not.toThrow();
  expect(() => {Rac.utils.assertExists(null);})
    .toThrow();
  expect(() => {Rac.utils.assertExists(null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  Rac.Exception.buildsErrors = false;
  // Throwing Exception objects
  expect(() => {Rac.utils.assertExists("one");})
    .not.toThrow();
  expect(() => {Rac.utils.assertExists(null);})
    .toThrow();
  expect(() => {Rac.utils.assertExists(null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName, false);

  Rac.Exception.buildsErrors = storedBuildErrors;
});


test('Function assertExists', () => {
  expect(() => {Rac.utils.assertExists();})
    .not.toThrow();
  expect(() => {Rac.utils.assertExists(1, true);})
    .not.toThrow();
  expect(() => {Rac.utils.assertExists(0, "one", "two", false);})
    .not.toThrow();

  expect(() => {Rac.utils.assertExists("one", null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertExists("one", null, "three");})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
    expect(() => {Rac.utils.assertExists("one", 2, undefined);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


test('Function assertNumber', () => {
  expect(() => {Rac.utils.assertNumber(-1, 0, 1, 2);})
    .not.toThrow();

  expect(() => {Rac.utils.assertNumber(null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertNumber(undefined);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertNumber(true);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertNumber(false);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertNumber(NaN);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


test('Function typeName', () => {
  let Duck = class Duck {};
  let duck = new Duck();

  expect(Rac.utils.typeName(Duck))
    .toBe('function:Duck');
  expect(Rac.utils.typeName(duck))
    .toBe('Duck');

  let namedFunc = function named() {};
  expect(Rac.utils.typeName(namedFunc))
    .toBe('function:named');

  // Uses container name
  let unnamedFunc = function() {};
  expect(Rac.utils.typeName(unnamedFunc))
    .toBe('function:unnamedFunc');

  // Uses container name
  let anonymousFunc = () => {};
  expect(Rac.utils.typeName(anonymousFunc))
    .toBe('function:anonymousFunc');

  // Without any name
  expect(Rac.utils.typeName(() => {}))
    .toBe('function');

  expect(Rac.utils.typeName(55))
    .toBe('Number');
  expect(Rac.utils.typeName('string'))
    .toBe('String');

  expect(Rac.utils.typeName(null))
    .toBe('null');
  expect(Rac.utils.typeName(undefined))
    .toBe('undefined');
});


test('Function addConstant', () => {
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


test.todo('assertType');
test.todo('assertBoolean');


