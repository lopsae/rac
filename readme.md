# RAC - Ruler and Compass

Library to express geometrical constructions through ruler-and-compass operations.

RAC can be used in browser with drawing done through a [P5.js](https://p5js.org/) instance, or in a node enviroment as a npm package.

+ [Project Page](https://lopsae.github.io/rac)
+ [Latest Documentation (1.2.0)](https://lopsae.github.io/rac/documentation/1.2.0/)



### Tutorials

A collection of [interactive tutorials](https://observablehq.com/@lopsae/rac-tutorial-home?collection=@lopsae/rac-tutorials) is available in [ObservableHQ](https://observablehq.com/).

[<img src="https://static.observableusercontent.com/thumbnail/9802bd7d18cde48702d17122d317377618b6ec774200f56bbe10e0d2958ed8a3.jpg" alt="Tutorials Home Thumbnail" width="150px"/> Tutorials Home](https://observablehq.com/@lopsae/rac-tutorial-home?collection=@lopsae/rac-tutorials)

[<img src="https://static.observableusercontent.com/thumbnail/1602ac3ccd7fe186b4467ad1c21c85a4e334b89be40e5bd43d51c298069e1146.jpg" alt="Base Drawables Thumbnail" width="150px"/> One - Base Drawables](https://observablehq.com/@lopsae/rac-tutorial-base-drawables?collection=@lopsae/rac-tutorials)

[<img src="https://static.observableusercontent.com/thumbnail/9e00d8b24b88e7050b5442ea70b1db0b6bc2dc03ee7627e14599352e7de4a063.jpg" alt="Complex Drawables Thumbnail" width="150px"/> Two - Complex Drawables](https://observablehq.com/@lopsae/rac-tutorial-complex-drawables?collection=@lopsae/rac-tutorials)

[<img src="https://static.observableusercontent.com/thumbnail/3d24088ee7c2725872eb76644de8bb787a610c7b27492121d60ce5e1cd551b28.jpg" alt="Styles Thumbnail" width="150px"/> Three - Styles](https://observablehq.com/@lopsae/rac-tutorial-styles?collection=@lopsae/rac-tutorials)



### NPM

RAC is available as an npm package at [npm/ruler-and-compass](https://www.npmjs.com/package/ruler-and-compass):
```
npm install ruler-and-compass
```



### UNPKG, Browser

For browser use, RAC is available as a single file library through [UNPKG](https://unpkg.com/) at [unpkg.com/ruler-and-compass](https://unpkg.com/ruler-and-compass).

It can be imported directly as a script, which will assign the [`Rac` constructor](./documentation/1.2.0/Rac.html) to the `Rac` global variable:
```
<script src="https://unpkg.com/ruler-and-compass"></script>
```

Or imported as an [AMD package](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) with a module loader like [RequireJS](https://requirejs.org/):
```
requirejs(["https://unpkg.com/ruler-and-compass"], Rac => { ... })
```



### License

RAC is licensed under the [MIT License](https://github.com/lopsae/rac/blob/main/LICENSE).

