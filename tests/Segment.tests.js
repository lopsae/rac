'use strict';

const Rac = require('rulerandcompass');
const tools = require('./tools');


const rac = tools.rac;


let fifty = rac.Point(55, 55);
let diagonal = rac.Segment(rac.Ray(fifty, rac.Angle.eighth), 100);


test('Identity', () => {
  expect(null).not.equalsSegment(55, 55, rac.Angle.eighth, 100);

  expect(diagonal).equalsSegment(55, 55, rac.Angle.eighth, 100);
  expect(diagonal).not.equalsSegment(7, 7, 0, 7);


  let string = diagonal.toString();
  expect(string).toMatch('Segment');
  expect(string).toMatch('55');
  expect(string).toMatch('0.125');
  expect(string).toMatch('100');
});


test.todo('More!')

