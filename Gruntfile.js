
module.exports = function(grunt) {

  const bannerHead =
    '// RAC - ruler-and-compass - <%= pkg.version %> <%= makeBuildString.buildString %>'

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dev: {
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
        banner: '// RAC - ruler-and-compass - minified - <%= pkg.version %> <%= makeBuildString.buildString %>'
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
        tasks: ['makeVersionFile', 'browserify:dev']
      }
    }, // watch

    jsdoc : {
      dist : {
        src: ['src/*'],
        options: {
          template: "./node_modules/minami-rac",
          readme: "./built/docs_home.md",
          destination: 'docs/documentation/<%= pkg.version %>',
          verbose: true,
          // pedantic: true,
          // debug: true,
          // explain: true,
          configure: './jsdoc.json'
        }
      }
    } // jsdoc
  });


  // Stores in this task config:
  // + in `value` the last git commit short-hash
  // + in `parentHash` the parent-of-last git commit short-hash
  grunt.config.set('exec.shortHash', {
    cmd: 'git --no-pager log --max-count=2 --format="%h"',
    stdout: false,
    callback: function(error, stdout, stderr) {
      if (error !== null) return;

      let hashes = stdout.trim().split('\n');
      let shortHash = hashes[0];
      let parentHash = hashes[1];
      grunt.config('exec.shortHash.value', shortHash);
      grunt.config('exec.shortHash.parentHash', parentHash);
      grunt.log.writeln(`Git short hashes - value:${shortHash} parent:${parentHash}`);
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
    let versionString = grunt.config('pkg.version');

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
  // When there are NO changes in the working tree the build is setup as
  // *clean*:
  // `{commitCount}-{shortHash}`
  //
  // When there ARE changes in the working tree the build is setup as
  // *dirty*:
  // `localBuild-{localTime}-{commitCount}-{shortHash}`
  //
  // When `target == "clean"` the build is setup as *forced-clean*:
  // `{commitCount}-{shortHash}`
  grunt.registerTask('makeBuildString', function(target) {
    grunt.config.requires(
      'pkg.version',
      'exec.shortHash.value',
      'exec.shortHash.parentHash',
      'exec.commitCount.value',
      'exec.statusCount.value');

    const pkgVersion  = grunt.config('pkg.version');
    const shortHash   = grunt.config('exec.shortHash.value');
    const parentHash  = grunt.config('exec.shortHash.parentHash');
    const commitCount = grunt.config('exec.commitCount.value');
    const statusCount = grunt.config('exec.statusCount.value');
    const clean = target === 'clean';

    const versionString = '' + pkgVersion;

    let buildString;
    let localTime = null;
    if (statusCount == 0 || clean) {
      buildString =`${commitCount}-${shortHash}`;
    } else {
      const now = new Date();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      minutes = minutes >= 10 ? minutes : `0${minutes}`;
      seconds = seconds >= 10 ? seconds : `0${seconds}`;
      localTime = `${now.getHours()}:${minutes}:${seconds}`;
      buildString =`localBuild-${localTime}-${commitCount}-${shortHash}`;
    }

    const makeType = clean ? "forced-clean" : statusCount == 0 ? "clean" : "dirty";

    grunt.config('makeBuildString.buildString', buildString);

    grunt.log.writeln(`Stored ${makeType.green.bold} buildString:`);
    if (localTime !== null) {
    grunt.log.writeln(`Built at:    ${localTime.green.bold}`);
    }
    grunt.log.writeln(`buildString: ${buildString.green}`);
  });



  // Saves the version file with the current version and build, saved into
  // `built/version.js`.
  grunt.registerTask('saveVersionFile', function() {
    grunt.config.requires(
      'pkg.version',
      'makeBuildString.buildString');

    const pkgVersion  = grunt.config('pkg.version');
    const buildString = grunt.config('makeBuildString.buildString');

    const versionString = '' + pkgVersion;

    const templateContents = grunt.file.read('template/version.js.template');
    const processedTemplate = grunt.template.process(templateContents, {data: {
      versionString: versionString,
      buildString: buildString
    }});

    const outputFile = 'built/version.js';
    grunt.file.write(outputFile, processedTemplate);

    grunt.log.writeln(`Saved version file ${versionString.green} ${buildString.green}`);
  });


  // Queues all the tasks required to make the version file.
  grunt.registerTask('makeVersionFile', function(target) {
    let makeBuildStringTask = target === undefined
      ? 'makeBuildString'
      : `makeBuildString:${target}`;
    grunt.task.run(
      'exec:shortHash',
      'exec:commitCount',
      'exec:statusCount',
      makeBuildStringTask,
      'saveVersionFile');
    if (target === undefined) {
      grunt.log.writeln(`Queued all tasks to make version file`);
    } else {
      grunt.log.writeln(`Queued all tasks to make version file - target:${target}`);
    }

  });


  // Queues the tasks to produce all documentation.
  grunt.registerTask('makeDocs', [
    'makeDocsReadme', 'jsdoc']);


  // Builds a dev bundle, serves it, and watches for source changes
  grunt.registerTask('serve', [
    'makeVersionFile',
    'browserify:dev',
    'connect:server',
    'watch:serve_again']);


  // Builds a dev/main/mini bundle with a clean version, serves it for
  // confirmation.
  grunt.registerTask('dist', [
    'makeVersionFile:clean',
    'browserify:dev_clean',
    'browserify:main',
    'uglify',
    'connect:server:keepalive']);


  grunt.registerTask('default', ['serve']);

};

