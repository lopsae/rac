## Commands

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
Produces a debug build and starts localhost server, rebuilds whenever a source file changes.


### `npm run docs`
Produces documentation for the current package version and opens its index.

+ `npm run docs:open` - Opens the documentation index for the current package version
+ `npm run docs:clean` - Checks-out HEAD into the documentation files for the current package version
+ `npm run docs:delete` - Deletes the documentation folder for the current package version
+ `npm run docs:fresh` - Deletes and produces the documentation for the current package version, and opens its index
+ `docs:repack` - Updates the `minami-rac` package, builds and opens the documentation; used during development after running `npm pack` in a local version of `minami-rac`


Documentation uses a custom Minami theme package. For modification or development the `package.json` dependency can be pointed to a local buld:
```
"minami-rac": "file:../minami-rac/minami-rac-1.4.0-dev.tgz"
```

Run in the minami-rac directory:
```
npm pack
```

And afterwards reinstall in RAC directory
```
npm run docs:repack
# or
npm update minami-rac && npm run docs
```

