Release process
===============

Set dev version
---------------
Update `package.json`, set `version` to `n.e.w-dev`

Commit with message: `bump version to n.e.w-dev`



Create new documentation
------------------------
Update `jsdoc.json`, set `versionNavItem` from `o.l.d` to `n.e.w-dev`

Commit with message: `update jsdoc versionNavItem with n.e.w-dev`

Build docs for `n.e.w-dev` to create the new folder:
```
npm run docs
```

Commit with message: `build new docs for n.e.w-dev`



Start changelog update
----------------------
+ Start or update `changelog.md` section with `n.e.w-dev`



Develop!
--------
🛠🛠🛠

As documentation changes:
Commit with message: `rebuild docs with {short description}`



Start release branch
--------------------
```
git flow release start n.e.w
```



Check changelog update
----------------------
+ Update and date `changelog.md` section with `n.e.w` version



Update versions
---------------
In files:
+ npm `package.json`
+ hardcoded in `jsdoc.json`
+ hardcoded in `docs/index.md`
+ hardcoded in `readme.md`
+ `changelog.md`

Update `package-lock.json` by running:
```
npm install
```

Commit with message: `bump version to n.e.w`



Promote docs to current version
-------------------------------
```
mv docs/documentation/n.e.w-dev docs/documentation/n.e.w
mv docs/dist/n.e.w-dev docs/dist/n.e.w
```

Update `latest` symlink
```
cd docs/documentation
rm latest
ln -s n.e.w latest
```

Commit with message: `promote documentation to n.e.w`

And rebuild to take version change:
```
npm run docs
```

Commit with message: `rebuild docs for n.e.w`



Build dev and test locally
--------------------------
Build a dev distribution for the github-io local server:
```
npm start
```

Start the github-io local server for visual testing at `http://127.0.0.1:4000/debug/`:
```
npm run pages
```



Build dist, test, and commit
----------------------------
```
npm run dist
```

Built files are copied to github-io pages, verify at `http://127.0.0.1:4000/debug/`

Commit with message: `commit dist build n.e.w count-hash`



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



Rebuild current docs
--------------------
```
npm run docs:fresh
```

Commit with message: `rebuild docs for n.e.w`



Check gh-pages local server
---------------------------
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

