
console.log(`✳️  tests running!`);

let makeRac = require('rulerandcompass');
console.log(`Loaded RAC - version:${makeRac.version}`);

let fail = 1;

if (makeRac.version === undefined || makeRac.version === null) {
  process.exit(fail);
}

let rac = makeRac();

let point = new rac.Point(100, 100);
if (point.x !== 100 && point.y !== 100) {
  process.exit(fail);
}


console.log(`✅ tests finished!`);
process.exit(0);

