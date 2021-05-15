# RAC — Ruler and Compass

Documentation for RAC version: `0.10.3-dev`

`{@link Rac}` is the main class and container of all other classes.

`[P5Drawer]{@link Rac.P5Drawer}` is the currently implemented drawer, which supports drawing using a [P5.js](https://p5js.org/) instance.



### NPM

RAC is available at [npm](https://www.npmjs.com/) at [npm/ruler-and-compass](https://www.npmjs.com/package/ruler-and-compass):
```
npm install ruler-and-compass@0.10.3-dev
```



### UNPKG, Browser

For browser use, RAC is available as a single file library through [UNPKG](https://unpkg.com/) at [unpkg.com/ruler-and-compass](https://unpkg.com/ruler-and-compass).

This can be imported directly as a script, which will assign the [`Rac` constructor]{@link Rac} to the `Rac` global variable:
```
<script src="https://unpkg.com/ruler-and-compass@0.10.3-dev"></script>
```

Or imported as a AMD package with a module loader like [RequireJS](https://requirejs.org/):
```
requirejs(["https://unpkg.com/ruler-and-compass@0.10.3-dev"], Rac => { ... })
```



### Git

Project repository: [github.com/lopsae/rac](https://github.com/lopsae/rac)
```
git clone https://github.com/lopsae/rac.git
```



### License

RAC is licensed under the MIT License: <https://github.com/lopsae/rac/blob/main/LICENSE>

