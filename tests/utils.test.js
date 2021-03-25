'use strict';


const Rac = require('rulerandcompass');


describe('Utils', () => {

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


  test.todo('addConstant');

});