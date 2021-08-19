Release process
===============


Start release branch
--------------------
```
git flow release start n.e.w
```


Update versions
---------------
In files:
+ npm package.json
+ hardcoded in jsdoc.json
+ hardcoded in docs/index.md


Build dev and test locally
--------------------------
```
npm start
```

Commit message: `commit dev build n.e.w-hash`


Build dist, test, and commit
----------------------------
```
npm run dist
```

Commit message: `commit dist build n.e.w-hash`


Make copy of currend docs
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


Push and test online
--------------------
```
// TODO
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


Tag in github
-------------
```
in github!
```


Publish to npm
--------------
```
npm publish
```


Rejoice!
--------
🎉🎉🎉

