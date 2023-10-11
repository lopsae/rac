
module.exports = function(grunt) {

  const bannerHead =
    '// RAC - ruler-and-compass - <%= pkg.version %> <%= makeBuildString.buildString %> <%= makeDatedString.datedString %>'

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dev_dirty: {
        src: 'src/main.js',
        dest: 'dist/rac.dev.js',
        options: {
          banner: bannerHead + '\n'
            + '// Development distribution with sourcemaps \n'
            + '// DIRTY BUILD - DO NOT COMMIT',
          browserifyOptions: {
            debug: true
          }
        }
      },

      dev_clean: {
        src: 'src/main.js',
        dest: 'dist/rac.dev.js',
        options: {
          banner: bannerHead + '\n'
            + '// Development distribution with sourcemaps',
          browserifyOptions: {
            debug: true
          }
        }
      },

      main: {
        src: 'src/main.js',
        dest: 'dist/rac.js',
        options: {
          banner: bannerHead + '\n'
            + '// Production distribution',
          browserifyOptions: {}
        }
      }

    }, // browserify

    uglify: {
      options: {
        mangle: false,
        banner: '// RAC - ruler-and-compass - minified - <%= pkg.version %> <%= makeBuildString.buildString %> <%= makeDatedString.datedString %>'
      },
      main: {
        files: {
          'dist/rac.min.js': ['dist/rac.js']
        }
      }
    }, // uglify

    // Exposes the bundled library in `./dist`
    connect: {
      server: {
        options: {
          port: 9001,
          base: './dist',
          directory: {
            path: './',
            options: {icons: true, view: 'detail'}
          },
          debug: true
        }
      } // server
    }, // connect

    watch: {
      serve_again: {
        files: ['src/**/*.js'],
        tasks: [
          'makeVersioningFile:local',
          'browserify:dev_dirty']
      },
      copy_dist_to_pages_again: {
        files: ['src/**/*.js'],
        tasks: [
          'makeVersioningFile:local',
          'browserify:dev_dirty',
          'copyDistToPages:dev']
      }
    }, // watch

    jsdoc : {
      dist : {
        src: ['src/**/*.js', 'built/*.js'],
        options: {
          template: "./node_modules/minami-rac",
          readme: "./built/docs_home.md",
          destination: 'docs/documentation/<%= pkg.version %>',
          verbose: true,
          pedantic: true,
          // debug: true,
          // explain: true,
          configure: './jsdoc.json',
          // Not needed, using the actual package changes the output dir
          package: '',
        }
      }
    } // jsdoc
  });


  // Stores in this task config:
  // + in `value` the last git commit short-hash
  grunt.config.set('exec.shortHash', {
    cmd: 'git --no-pager log --max-count=1 --format="%h"',
    stdout: false,
    callback: function(error, stdout, stderr) {
      if (error !== null) return;

      let shortHash = stdout.trim();
      grunt.config('exec.shortHash.value', shortHash);
      grunt.log.writeln(`Git short hashe: ${shortHash}`);
    }
  }); // exec.shortHash


  // Stores in this task config in `value` the current git commit count.
  grunt.config.set('exec.commitCount', {
    cmd: 'git rev-list --count HEAD',
    stdout: false,
    callback: function(error, stdout, stderr) {
      if (error !== null) return;

      let commitCount = stdout.trim();
      grunt.config('exec.commitCount.value', commitCount);
      grunt.log.writeln(`Git commit count: ${commitCount}`);
    }
  }); // exec.commitCount


  // Stores in this task config in `value` the count of files with a git
  // status in the workspace and index. When there are no workspace changes
  // `value` would be `0`.
  grunt.config.set('exec.statusCount', {
    cmd: 'git status --porcelain | wc -l',
    stdout: false,
    callback: function(error, stdout, stderr) {
      if (error !== null) return;

      let statusCount = parseInt(stdout.trim());
      grunt.config('exec.statusCount.value', statusCount);
      grunt.log.writeln(`Git status count: ${statusCount}`);
    }
  }); // exec.statusCount


  // Opens the documentation index for the current package version.
  grunt.config.set('exec.openDocs', {
    cmd: 'open ./docs/documentation/<%= pkg.version %>/index.html',
    stdout: false,
    callback: function(error, stdout, stderr) {
      if (error !== null) return;

      grunt.config.requires('pkg.version');
      const pkgVersion = grunt.config('pkg.version');

      grunt.log.writeln(`Opened docs for: ${pkgVersion.green}`);
    }
  }); // exec.openDocs


  // Checks out the commited version of the the documentation and its home.
  grunt.config.set('exec.cleanDocs', {
    cmd: 'git checkout HEAD -- docs/documentation/<%= pkg.version %> built/docs_home.md',
    stdout: true,
    callback: function(error, stdout, stderr) {
      if (error !== null) return;

      grunt.config.requires('pkg.version');
      const pkgVersion = grunt.config('pkg.version');

      grunt.log.writeln(`Cleaned docs for: ${pkgVersion.green}`);
    }
  }); // exec.cleanDocs


  // Deletes all documentation files of the current package version.
  grunt.config.set('exec.deleteDocs', {
    cmd: 'rm -rfv docs/documentation/<%= pkg.version %>/*',
    stdout: true,
    callback: function(error, stdout, stderr) {
      if (error !== null) return;

      grunt.config.requires('pkg.version');
      const pkgVersion = grunt.config('pkg.version');

      let deleted = 'Deleted'.red.bold;
      grunt.log.writeln(`${deleted} docs for: ${pkgVersion.green}`);
    }
  }); // exec.deleteDocs



  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');


  // Recreates the templated file for the documentation home, saved in
  // `built/docs_home.md`.
  grunt.registerTask('makeDocsReadme', function() {
    grunt.config.requires('pkg.version');
    const pkgVersion = grunt.config('pkg.version');

    const versionString = '' + pkgVersion;

    let templateContents = grunt.file.read('template/docs_home.md.template');
    let processedTemplate = grunt.template.process(templateContents, {data: {
      versionString: versionString}});

    let outputFile = 'built/docs_home.md';
    grunt.file.write(outputFile, processedTemplate);
    grunt.log.writeln(`Saved docs_home.md with version ${versionString.green}`);
  });


  // Makes and stores the full version into the config value
  // `makeBuildString.buildString`.
  //
  // Available targets:
  // + `local` - Makes a version value using the current local files, even
  //   if modifications are present in the workspace. The value is always
  //   prefixed with `localBuild-`.
  // + `production` - Makes a production version value, the workspace MUST
  //   be clean of any modifications.
  grunt.registerTask('makeBuildString', function(target) {
    let validTargets = ['local', 'production'];
    if (!validTargets.includes(target)) {
      grunt.fatal(`Unsupported target: ${target}`)
      return
    }
    let isProduction = target === 'production';

    grunt.config.requires(
      'exec.shortHash.value',
      'exec.commitCount.value',
      'exec.statusCount.value');

    const shortHash   = grunt.config('exec.shortHash.value');
    const commitCount = grunt.config('exec.commitCount.value');
    const statusCount = grunt.config('exec.statusCount.value');

    if (isProduction && statusCount != 0) {
      grunt.fatal(`Production build string must have a clean workspace - statusCount:${statusCount}`)
      return
    }

    let buildString;
    if (isProduction) {
      buildString =`${commitCount}-${shortHash}`;
    } else {
      buildString =`localBuild-${commitCount}-${shortHash}`;
    }

    grunt.config('makeBuildString.buildString', buildString);
    grunt.log.writeln(`Stored ${target.green.bold} buildString: ${buildString.green}`);
  });


  // Makes and stores the build date into the config value
  // `makeDatedString.datedString`.
  //
  // The date string uses the ISO-8601 standard.
  //
  // E.g. `2022-10-13T23:06:12.500Z`
  grunt.registerTask('makeDatedString', function() {
    grunt.config.requires();

    const now = new Date();
    const datedString = now.toISOString();
    const timed = datedString.split('T').at(-1);
    grunt.config('makeDatedString.datedString', datedString);
    grunt.log.writeln(`Time: ${timed.green.bold}`);
    grunt.log.writeln(`Stored datedString: ${datedString.green}`);
  });


  // Saves the version file with the current version and build, saved into
  // `built/versioning.js`.
  grunt.registerTask('saveVersioningFile', function() {
    grunt.config.requires(
      'pkg.version',
      'makeBuildString.buildString',
      'makeDatedString.datedString');

    const pkgVersion  = grunt.config('pkg.version');
    const buildString = grunt.config('makeBuildString.buildString');
    const datedString = grunt.config('makeDatedString.datedString');

    const versionString = '' + pkgVersion;

    const templateContents = grunt.file.read('template/versioning.js.template');
    const processedTemplate = grunt.template.process(templateContents, {data: {
      versionString: versionString,
      buildString:   buildString,
      datedString:   datedString
    }});

    const outputFile = 'built/versioning.js';
    grunt.file.write(outputFile, processedTemplate);

    grunt.log.writeln(`Saved versioning file ${versionString.green} ${buildString.green} ${datedString.green}`);
  });


  // Queues all the tasks required to make the version file.
  // Available targets:
  // + `local` - Makes a version using the current local files, even if
  //   modifications are present in the workspace.
  // + `production` - Makes a production version file, the workspace MUST
  //   be clean of any modifications.
  grunt.registerTask('makeVersioningFile', function(target) {
    let validTargets = ['local', 'production'];
    if (!validTargets.includes(target)) {
      grunt.fatal(`Unsupported target: ${target}`)
      return
    }

    grunt.task.run(
      'exec:shortHash',
      'exec:commitCount',
      'exec:statusCount',
      `makeBuildString:${target}`,
      'makeDatedString',
      'saveVersioningFile');
    if (target === undefined) {
      grunt.log.writeln(`Queued all tasks to make version file`);
    } else {
      grunt.log.writeln(`Queued all tasks to make version file - target:${target}`);
    }

  });


  // Copies files present in `dist` to the `docs/dist/version` folder, to
  // make these available to the pages server.
  grunt.registerTask('copyDistToPages', function(target) {
    let validTargets = ['dev', 'production'];
    if (!validTargets.includes(target)) {
      grunt.fatal(`Unsupported target: ${target}`)
      return
    }

    grunt.config.requires('pkg.version');
    const pkgVersion  = grunt.config('pkg.version');
    const versionString = '' + pkgVersion;

    const versionFolder = `docs/dist/${versionString}`;

    // `dev` target files are default
    grunt.file.copy('dist/rac.dev.js', `${versionFolder}/rac.dev.js`);

    if (target === 'production') {
      grunt.file.copy('dist/rac.min.js', `${versionFolder}/rac.min.js`);
      grunt.file.copy('dist/rac.js', `${versionFolder}/rac.js`);
    }
  });


  // Queues the tasks to produce all documentation.
  grunt.registerTask('makeDocs', [
    'makeDocsReadme', 'jsdoc']);


  grunt.registerTask('openDocs', ['exec:openDocs']);
  grunt.registerTask('cleanDocs', ['exec:cleanDocs']);
  grunt.registerTask('deleteDocs', ['exec:deleteDocs']);



  // Builds a dev bundle, serves it though a web-server, and watches for
  // source changes to update the served files
  grunt.registerTask('serve', [
    'makeVersioningFile:local',
    'browserify:dev_dirty',
    'connect:server',
    'watch:serve_again']);


  // Builds a dev bundle, copies it to pages, and watches to rebuild and
  // update the copied files
  grunt.registerTask('serveToPages', [
    'makeVersioningFile:local',
    'browserify:dev_dirty',
    'copyDistToPages:dev',
    'watch:copy_dist_to_pages_again']);


  // Builds a dev/main/mini bundle with a clean version, serves it for
  // confirmation.
  grunt.registerTask('dist', [
    'makeVersioningFile:production',
    'browserify:dev_clean',
    'browserify:main',
    'uglify',
    'connect:server:keepalive']);


  grunt.registerTask('default', ['serve']);

};

