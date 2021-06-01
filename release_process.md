Release process
===============

Start release branch
```
git flow release start a.b.c
```

Update versions in
+ npm package.json
+ hardcoded in jsdoc.json
+ hardcoded in docs/index.md


Make copy of currend docs
```
cp -Rv docs/docs/latest docs/docs/o.l.d
```


Build dist, test, and commit
```
npm run dist
```

Build docs
```
npm run docs:fresh
```

Push and test online
```

```

Finish tag
```
git flow release finish a.b.c
```

Push to origin
```
git push origin a.b.c
```

Tag in github
```
in github!
```

Publish to npm
```
npm publish
```


