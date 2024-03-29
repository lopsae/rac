'use strict';


const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


tools.test(function errorsExceptionCatched() {
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


tools.test(function assertExists() {
  expect(() => {Rac.utils.assertExists();})
    .not.toThrow();
  expect(() => {Rac.utils.assertExists(1, true);})
    .not.toThrow();
  expect(() => {Rac.utils.assertExists(0, "one", "two", false);})
    .not.toThrow();

  expect(() => {Rac.utils.assertExists(null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertExists("one", null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertExists("one", null, "three");})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertExists("one", 2, undefined);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


tools.test(function assertType() {
  expect(() => {Rac.utils.assertType(Rac.Point);})
    .not.toThrow();
  expect(() => {Rac.utils.assertType(Rac.Point, rac.Point(55, 55));})
    .not.toThrow();
  expect(() => {Rac.utils.assertType(Rac.Angle, rac.Angle.half, rac.Angle(1/2));})
    .not.toThrow();

  expect(() => {Rac.utils.assertType(Rac.Point, null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, undefined);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, rac.Point(1, 1), null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, rac.Point(2, 2), undefined);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  expect(() => {Rac.utils.assertType(Rac.Point, '');})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, 0);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, '0');})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, 100);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, '100');})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, 'nonsense');})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, rac.Angle.zero);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, rac.Ray.zero);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  expect(() => {Rac.utils.assertType(Rac.Point, rac.Point.zero, rac.Angle.zero);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {Rac.utils.assertType(Rac.Point, rac.Angle.zero, rac.Point.zero);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  expect(() => {Rac.utils.assertType(Rac.Point, rac.nonsense);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


tools.test(function assertNumber() {
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


tools.test(function typeName() {
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


tools.test(function addConstantTo() {
  let obj = {};
  expect(obj).not.toHaveProperty('prop');

  Rac.utils.addConstantTo(obj, 'prop', 'value');
  expect(obj).toHaveProperty('prop', 'value');

  let propDesc = Object.getOwnPropertyDescriptor(obj, 'prop');
  expect(propDesc.writable).toBe(false);

  obj.assigned = 'other';
  expect(obj).toHaveProperty('assigned', 'other');
  propDesc = Object.getOwnPropertyDescriptor(obj, 'assigned');
  expect(propDesc.writable).toBe(true);
});


tools.test(function cutDigits() {
  const string = Rac.utils.cutDigits(0.12345);
  expect(string).toMatch('0.12345');

  const cutString = Rac.utils.cutDigits(0.12345, 2);
  expect(cutString).toMatch('0.12');
  expect(cutString).not.toMatch('0.123');
});


// TODO: test.todo('assertBoolean');


