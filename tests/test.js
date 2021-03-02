
console.log(`tests running!`);

let makeRac = require('rulerandcompass');
console.log(`Loaded RAC - version:${makeRac.version}`);

let rac = makeRac();

let point = new rac.Point(100, 100);
console.log(`Point at: x:${point.x} y:${point.y}`);


process.exit(0);

