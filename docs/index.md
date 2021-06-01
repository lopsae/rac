Library to express geometrical constructions through ruler-and-compass operations.

RAC can be used in browser with drawing done through a [P5.js](https://p5js.org/) instance, or in a node enviroment as a npm package.


### Documentation

[Latest (1.0.0)](./docs/latest/)

Older docs:
+ [0.10.3-dev](./docs/0.10.3-dev/)



### Tutorials

A collection of [interactive tutorials](https://observablehq.com/@lopsae/rac-tutorial-home) is available in [ObservableHQ](https://observablehq.com/).



### NPM

RAC is available as an npm package at [npm/ruler-and-compass](https://www.npmjs.com/package/ruler-and-compass):
```
npm install ruler-and-compass@0.10.3-dev
```



### UNPKG, Browser

For browser use, RAC is available as a single file library through [UNPKG](https://unpkg.com/) at [unpkg.com/ruler-and-compass](https://unpkg.com/ruler-and-compass).

It can be imported directly as a script, which will assign the [`Rac` constructor](./docs/latest/Rac.html) to the `Rac` global variable:
```
<script src="https://unpkg.com/ruler-and-compass@0.10.3-dev"></script>
```

Or imported as an [AMD package](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) with a module loader like [RequireJS](https://requirejs.org/):
```
requirejs(["https://unpkg.com/ruler-and-compass@0.10.3-dev"], Rac => { ... })
```



### License

RAC is licensed under the [MIT License](https://github.com/lopsae/rac/blob/main/LICENSE).

