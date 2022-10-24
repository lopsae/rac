Release process
===============

Set dev version
---------------
Update `package.json`, set `version` to `n.e.w-dev`

Commit message: `bump version to n.e.w-dev`



Create new documentation
------------------------
Update `jsdoc.json`, set `o.l.d` to `n.e.w-dev`

Commit message: `update jsdoc homelabel with n.e.w-dev`

```
npm run docs
```

Commit message: `build new docs for n.e.w-dev`

As documentation changes:

Commit message: `rebuild docs with ...`



Develop!
--------
🛠🛠🛠



Start release branch
--------------------
```
git flow release start n.e.w
```



Check changelog update
----------------------
+ update and date n.e.w version



Update versions
---------------
In files:
+ npm `package.json`
+ hardcoded in `jsdoc.json`
+ hardcoded in `docs/index.md`
+ hardcoded in `readme.md`

Update `package-lock.json` by running:
```
npm install
```

Commit message: `bump version to n.e.w`



Build dev and test locally
--------------------------
```
npm start
```

Built file is available at:
```
http://localhost:9001/rac.dev.js
```



Build dist, test, and commit
----------------------------
```
npm run dist
```

Built files are available at:
```
http://localhost:9001/rac.js
http://localhost:9001/rac.min.js
```

Commit message: `commit dist build n.e.w count-hash`



Push and test online
--------------------
Pushed release is accesible at:
```
https://cdn.jsdelivr.net/gh/lopsae/rac@release/n.e.w/dist/rac.js
https://cdn.jsdelivr.net/gh/lopsae/rac@release/n.e.w/dist/rac.dev.js
https://cdn.jsdelivr.net/gh/lopsae/rac@release/n.e.w/dist/rac.min.js
```

Or with a commit:
```
https://cdn.jsdelivr.net/gh/lopsae/rac@commit/dist/rac.min.js
```

When a purge is needed:
```
https://purge.jsdelivr.net/gh/lopsae/rac@release/n.e.w/dist/rac.min.js
```

or
```
curl -v -X POST 'https://purge.jsdelivr.net/' \
  -H 'cache-control: no-cache' -H 'content-type: application/json' \
  -d '{ "path": [
    "/gh/lopsae/rac@release/n.e.w/dist/rac.js",
    "/gh/lopsae/rac@release/n.e.w/dist/rac.dev.js",
    "/gh/lopsae/rac@release/n.e.w/dist/rac.min.js"
  ]}'
```



Promote docs to current version
-------------------------------
```
mv docs/documentation/n.e.w-dev docs/documentation/n.e.w
```

Commit message: `promote documentation to n.e.w`



Rebuild current docs
--------------------
```
npm run docs:fresh
```

Commit message: `rebuild docs for n.e.w`



Check gh-pages locally
----------------------
```
npm run pages
```

Pages are available at:
```
http://127.0.0.1:4000
```



Finish tag
----------
```
git flow release finish a.b.c
```



Push tag to origin
------------------
Notice that the tag is prefixed with 'v':
```
git push origin vn.e.w
```



Publish to npm
--------------
```
git checkout main
npm publish
```



Tag in github
-------------
+ In https://github.com/lopsae/rac/releases



Update gh-pages
---------------
+ Hard reset of `gp-pages` to `n.e.w` tag
+ Push `gp-pages`
+ Check at https://rulerandcompass.org/



Rejoice!
--------
🎉🎉🎉

