

const makeRac = require('rulerandcompass');
const rac = makeRac();


test('RAC version', () => {
  expect(makeRac.version).toBeTruthy();
  expect(rac.version).toBeTruthy();
  expect(makeRac.version).toBe(rac.version);
});



expect.extend({
  equalsPoint(point, x, y) {
    const pass = point.x == x && point.y == y;
    if (pass) {
      return {
        message: () =>
          `expected point at (${point.x},${point.y}) not to equal (${x},${y})`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected point at (${point.x},${point.y}) to equal (${x},${y})`,
        pass: false,
      };
    }
  },
});


test('Point', () => {
  let point = new rac.Point(100, 100);
  expect(point.x).toBe(100);
  expect(point.y).toBe(100);
  expect(point).equalsPoint(100, 101);
});


