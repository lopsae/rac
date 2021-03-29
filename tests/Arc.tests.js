'use strict';

const Rac = require('rulerandcompass');
const tools = require('./tools');


const rac = tools.rac;


// let half = rac.Point(100, 100)
//   .arc(55, rac.Angle.n, rac.Angle.s);


test('Identity', () => {
  expect(null).not.equalsArc(0, 0, 100, 0, 1/2, true);

  // expect(half).equalsArc(100, 100, 55, 3/4, 1/4, true);
  // expect(half).not.equalsArc(55, 55, 7, 0, 1/2, false);

  // let string = half.toString();
  // expect(string).toMatch('Arc');
  // expect(string).toMatch('100,100');
  // expect(string).toMatch('55');
  // expect(string).toMatch('0.25');
  // expect(string).toMatch('0.75');
  // expect(string).toMatch('true');
});


test.todo('More!')

