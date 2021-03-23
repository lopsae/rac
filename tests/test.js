
console.log(`✳️  tests running!`);

const makeRac = require('rulerandcompass');
console.log(`Loaded RAC - version:${makeRac.version}`);

// let fail = 1;

test('RAC version', () => {
  expect(makeRac.version).toBeTruthy();
});


// if (makeRac.version === undefined || makeRac.version === null) {
//   process.exit(fail);
// }

let rac = makeRac();


expect.extend({
  equalsPoint(received, x, y) {
    const pass = received.x == x && received.y == y;
    if (pass) {
      return {
        message: () =>
          `passed maic`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `failed maic`,
        pass: false,
      };
    }
  },
});


test('Point', () => {
  let point = new rac.Point(100, 100);
  expect(point.x).toBe(100);
  expect(point.y).toBe(100);
  expect(point).equalsPoint(100, 100);
});




// console.log(`✅ tests finished!`);
// process.exit(0);

