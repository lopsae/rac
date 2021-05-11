# RAC - Ruler and Compass

Library to express geometrical constructions through ruler-and-compass operations.

RAC can be used in browser with drawing done through a [P5.js](https://p5js.org/) instance, or in a node enviroment as a npm package.

+ [Project Page](https://lopsae.github.io/rac)
+ [Latest documentation](https://lopsae.github.io/rac/docs/latest/)



### NPM

RAC is available as an npm package at [npm/ruler-and-compass](https://www.npmjs.com/package/ruler-and-compass):
```
npm install ruler-and-compass
```



### Browser use - UNPKG

For browser use, RAC is available as a single file library through [UNPKG](https://unpkg.com/) at [unpkg.com/ruler-and-compass](https://unpkg.com/ruler-and-compass).

It can be imported directly as a script, which will create the [`Rac` constructor](./docs/latest/Rac.html) into the `Rac` global variable:
```
<script src="https://unpkg.com/ruler-and-compass"></script>
```

Or imported as a AMD package with a module loader like [RequireJS](https://requirejs.org/):
```
requirejs(["https://unpkg.com/ruler-and-compass"], Rac => { ... })
```



### License

RAC is licensed under the MIT License: <https://github.com/lopsae/rac/blob/main/LICENSE>

