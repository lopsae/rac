'use strict';

const Rac = require('rulerandcompass');
const tools = require('./testTools');


const rac = tools.rac;


let diagonal = rac.Point(55, 55)
  .segmentToPoint(rac.Point(100, 100));


test('identity', () => {
  expect(null).not.equalsSegment(55, 55, 100, 100);

  expect(diagonal).equalsSegment(55, 55, 100, 100);
  expect(diagonal).not.equalsSegment(7, 7, 9, 9);


  let string = diagonal.toString();
  expect(string).toMatch('Segment');
  expect(string).toMatch('55');
  expect(string).toMatch('100');
});

