Development Setup
=================

Steps for setting up a development environment for RAC.



RAC Repository
--------------
Clone the RAC repository:
```
git clone https://github.com/lopsae/rac.git
```



Node and NPM
------------
Install nvm:
https://github.com/nvm-sh/nvm#installing-and-updating
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

Set the latest node version as default:
```
nvm use node
```



Install npm packages
--------------------
In the `rac` folder, run `npm` to install the required packages:
```
cd rac
npm install
```

Test that packages are installed by running tests:
```
npm test
```



Run github.io docs
------------------
The `docs` folder may need an updated version of bundle:
```
cd rac/docs
gem install bundler:2.3.9 # may need sudo
```

With the updated `bundle`, run it to check for the installed bundles:
```
cd rac/docs
bundle
```

Back in the `rac` directory, run the github.io pages to see these working locally:
```
cd rac
npm run pages
```

Pages should be available at: `http://127.0.0.1:4000/`



Run debug Pages
---------------
The pages in `docs/debug/*.html` can be accessed through the github.io local server described above.

To desploy to pages a locally built version of rac:
```
cd rac
npm run pagesSetup
```

Update the debug page to load the new version of the distribution file.

