

// To be run with
// ```
// node test/nodeCheck.js
// ```
// Just to check if RAC package is installed

let Rac = require('ruler-and-compass');

console.log(`Version: ${Rac.version}`);

let rac = new Rac();
let point = rac.Point(55, 55);
console.log(`A point: ${point}`);

