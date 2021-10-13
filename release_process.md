Release process
===============


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
+ npm package.json
+ hardcoded in jsdoc.json
+ hardcoded in docs/index.md

Commit message: `bump version to n.e.w`



Build dev and test locally
--------------------------
```
npm start
```

Commit message: `commit dev build n.e.w count-hash`



Build dist, test, and commit
----------------------------
```
npm run dist
```

Commit message: `commit dist build n.e.w count-hash`



Make copy of current docs
-------------------------
```
mv docs/documentation/latest docs/documentation/o.l.d
```

Commit message: `freeze copy of o.l.d documentation`



Build latest docs
-----------------
```
npm run docs:fresh
```

Commit message: `rebuilt docs`



Check gh-pages locally
----------------------
```
npm run pages
```



Push and test online
--------------------
Pushed release is accesible at:
```
https://cdn.jsdelivr.net/gh/lopsae/rac@release/n.e.w/dist/rac.js
https://cdn.jsdelivr.net/gh/lopsae/rac@release/n.e.w/dist/rac.dev.js
https://cdn.jsdelivr.net/gh/lopsae/rac@release/n.e.w/dist/rac.min.js
```

When a purge is needed:
```
https://purge.jsdelivr.net/gh/lopsae/rac@release/n.e.w/dist/rac.min.js
```



Finish tag
----------
```
git flow release finish a.b.c
```



Push to origin
--------------
```
git push origin n.e.w
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



Rejoice!
--------
🎉🎉🎉

