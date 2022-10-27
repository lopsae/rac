# RAC — Ruler and Compass

Documentation for RAC version: `1.2.1-dev`

`{@link Rac}` is the main class and container of all other classes.

`[P5Drawer]{@link Rac.P5Drawer}` is the currently implemented drawer, which supports drawing using a [P5.js](https://p5js.org/) instance.



### Tutorials

A collection of [interactive tutorials](https://observablehq.com/@lopsae/rac-tutorial-home?collection=@lopsae/rac-tutorials) is available in [ObservableHQ](https://observablehq.com/).

  <table style="display:inline-block">
    <tr>
      <td>
        <a href="https://observablehq.com/@lopsae/rac-tutorial-home?collection=@lopsae/rac-tutorials">
        <img src="https://static.observableusercontent.com/thumbnail/9802bd7d18cde48702d17122d317377618b6ec774200f56bbe10e0d2958ed8a3.jpg" alt="Tutorials Home Thumbnail" width="200"/>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <span><a href="https://observablehq.com/@lopsae/rac-tutorial-home?collection=@lopsae/rac-tutorials">
        Tutorials Home
        </a></span>
      </td>
    </tr>
  </table>

<table style="display:inline-block">
  <tr>
    <td>
      <a href="https://observablehq.com/@lopsae/rac-tutorial-base-drawables?collection=@lopsae/rac-tutorials">
      <img src="https://static.observableusercontent.com/thumbnail/1602ac3ccd7fe186b4467ad1c21c85a4e334b89be40e5bd43d51c298069e1146.jpg" alt="Base Drawables Thumbnail" width="200"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <span><a href="https://observablehq.com/@lopsae/rac-tutorial-base-drawables?collection=@lopsae/rac-tutorials">
      One - Base Drawables
      </a></span>
    </td>
  </tr>
</table>

<table style="display:inline-block">
  <tr>
    <td>
      <a href="https://observablehq.com/@lopsae/rac-tutorial-complex-drawables?collection=@lopsae/rac-tutorials">
      <img src="https://static.observableusercontent.com/thumbnail/9e00d8b24b88e7050b5442ea70b1db0b6bc2dc03ee7627e14599352e7de4a063.jpg" alt="Complex Drawables Thumbnail" width="200"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <span><a href="https://observablehq.com/@lopsae/rac-tutorial-complex-drawables?collection=@lopsae/rac-tutorials">
      Two - Complex Drawables
      </a></span>
    </td>
  </tr>
</table>

<table style="display:inline-block">
  <tr>
    <td>
      <a href="https://observablehq.com/@lopsae/rac-tutorial-styles?collection=@lopsae/rac-tutorials">
      <img src="https://static.observableusercontent.com/thumbnail/3d24088ee7c2725872eb76644de8bb787a610c7b27492121d60ce5e1cd551b28.jpg" alt="Styles Thumbnail" width="200"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <span><a href="https://observablehq.com/@lopsae/rac-tutorial-styles?collection=@lopsae/rac-tutorials">
      Three - Styles
      </a></span>
    </td>
  </tr>
</table>



### NPM

RAC is available as an [npm](https://www.npmjs.com/) package at [npm/ruler-and-compass](https://www.npmjs.com/package/ruler-and-compass):
```
npm install ruler-and-compass@1.2.1-dev
```



### Browser

For browser use, RAC is available as a single file library through [UNPKG](https://unpkg.com/) at [unpkg.com/ruler-and-compass](https://unpkg.com/ruler-and-compass).

This can be imported directly as a script, which will assign the [`Rac` constructor]{@link Rac} to the `Rac` global variable:
```
<script src="https://unpkg.com/ruler-and-compass@1.2.1-dev"></script>
```

Or imported as an [AMD package](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) with a module loader like [RequireJS](https://requirejs.org/):
```
requirejs(["https://unpkg.com/ruler-and-compass@1.2.1-dev"], Rac => { ... })
```



### Git

Project repository: [github.com/lopsae/rac](https://github.com/lopsae/rac)
```
git clone https://github.com/lopsae/rac.git
```



### License

RAC is licensed under the [MIT License](https://github.com/lopsae/rac/blob/main/LICENSE).

