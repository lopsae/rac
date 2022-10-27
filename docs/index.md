---
homeTutorialImg: "https://static.observableusercontent.com/thumbnail/9802bd7d18cde48702d17122d317377618b6ec774200f56bbe10e0d2958ed8a3.jpg"
homeTutorialLink: "https://observablehq.com/@lopsae/rac-tutorial-home?collection=@lopsae/rac-tutorials"
oneTutorialImg: "https://static.observableusercontent.com/thumbnail/1602ac3ccd7fe186b4467ad1c21c85a4e334b89be40e5bd43d51c298069e1146.jpg"
oneTutorialLink: "https://observablehq.com/@lopsae/rac-tutorial-base-drawables?collection=@lopsae/rac-tutorials"
twoTutorialImg: "https://static.observableusercontent.com/thumbnail/9e00d8b24b88e7050b5442ea70b1db0b6bc2dc03ee7627e14599352e7de4a063.jpg"
twoTutorialLink: "https://observablehq.com/@lopsae/rac-tutorial-complex-drawables?collection=@lopsae/rac-tutorials"
threeTutorialImg: "https://static.observableusercontent.com/thumbnail/3d24088ee7c2725872eb76644de8bb787a610c7b27492121d60ce5e1cd551b28.jpg"
threeTutorialLink: "https://observablehq.com/@lopsae/rac-tutorial-styles?collection=@lopsae/rac-tutorials"
---

Library to express geometrical constructions through ruler-and-compass operations.

RAC can be used in browser with drawing done through a [P5.js](https://p5js.org/) instance, or in a node enviroment as a npm package.


### Documentation

[Latest (1.2.0)](./documentation/latest/)

Previous versions:
+ [1.1.0](./documentation/1.1.0/)
+ [1.0.1](./documentation/1.0.1/)
+ [1.0.0](./documentation/1.0.0/)
+ [0.10.3-dev](./documentation/0.10.3-dev/)



### Tutorials

A collection of [interactive tutorials]({{ page.homeTutorialLink }}) is available in [ObservableHQ](https://observablehq.com/).

<table style="display:inline-block; width: auto;">
  <tr>
    <td>
      <a href="{{ page.homeTutorialLink }}">
      <img src="{{ page.homeTutorialImg }}" alt="Tutorials Home Thumbnail" width="200"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <span><a href="{{ page.homeTutorialLink }}">
      Tutorials Home
      </a></span>
    </td>
  </tr>
</table>

<table style="display:inline-block; width: auto;">
  <tr>
    <td>
      <a href="{{ page.oneTutorialLink }}">
      <img src="{{ page.oneTutorialImg }}" alt="Base Drawables Thumbnail" width="200"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <span><a href="{{ page.oneTutorialLink }}">
      One - Base Drawables
      </a></span>
    </td>
  </tr>
</table>

<table style="display:inline-block; width: auto;">
  <tr>
    <td>
      <a href="{{ page.twoTutorialLink }}">
      <img src="{{ page.twoTutorialImg }}" alt="Complex Drawables Thumbnail" width="200"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <span><a href="{{ page.twoTutorialLink }}">
      Two - Complex Drawables
      </a></span>
    </td>
  </tr>
</table>

<table style="display:inline-block; width: auto;">
  <tr>
    <td>
      <a href="{{ page.threeTutorialLink }}">
      <img src="{{ page.threeTutorialImg }}" alt="Styles Thumbnail" width="200"/>
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <span><a href="{{ page.threeTutorialLink }}">
      Three - Styles
      </a></span>
    </td>
  </tr>
</table>



### NPM

RAC is available as an npm package at [npm/ruler-and-compass](https://www.npmjs.com/package/ruler-and-compass):
```
npm install ruler-and-compass@1.2.0
```



### Browser

For browser use, RAC is available as a single file library through [UNPKG](https://unpkg.com/) at [unpkg.com/ruler-and-compass](https://unpkg.com/ruler-and-compass).

It can be imported directly as a script, which will assign the [`Rac` constructor](./documentation/latest/Rac.html) to the `Rac` global variable:
```
<script src="https://unpkg.com/ruler-and-compass@1.2.0"></script>
```

Or imported as an [AMD package](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) with a module loader like [RequireJS](https://requirejs.org/):
```
requirejs(["https://unpkg.com/ruler-and-compass@1.2.0"], Rac => { ... })
```



### License

RAC is licensed under the [MIT License](https://github.com/lopsae/rac/blob/main/LICENSE).

