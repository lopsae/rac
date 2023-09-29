

// Simple script to check if RAC is installed as a local package.
//
// To be run with
// ```
// cd rac
// npm link # creates global link
// npm link ruler-and-compass # link-install the package
// node test/nodeCheck.js
// ```

let Rac = require('ruler-and-compass');

console.log(`Version: ${Rac.version}`);

let rac = new Rac();
let point = rac.Point(55, 55);
console.log(`A point: ${point}`);

