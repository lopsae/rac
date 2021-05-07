# RAC - Ruler and Compass

Library than can be used along p5.js to express drawings through ruler-and-compass operations.


## Command reminders

### `npm test`
Runs tests for RAC.

+ `npm run test:clean` - Deletes any existing coverage files
+ `npm run test:fresh` - Deletes any existing coverage files and runs tests
+ `npm run test:coverage` - Runs tests with coverage
+ `npm run test:open` - Opens the coverage index
+ `npm run test:cc` - Deletes any existing coverage files and runs test:coverage


### `npm run dist`
Produces a distribution build and starts localhost server.


### `npm start`
Produces a debug build and starts localhost server, rebuilds whenever a file changes.


### `npm run docs`
Produces documentation and opens its index.

+ `npm run docs:clean` - Checks-out HEAD into the latest documentation files
+ `npm run docs:fresh` - Runs `docs:clean` and produces documentation

Documentation uses a custom theme package. Run in the directory of the theme
```
npm pack
```
And afterwards reinstall in RAC directory
```
npm update minami-rac && npm run docs
```


