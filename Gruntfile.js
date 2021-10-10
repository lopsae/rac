
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dev: {
        src: 'src/main.js',
        dest: 'dist/rac.dev.js',
        options: {
          banner: '// RAC - ruler-and-compass - <%= pkg.version %> - development with sourcemaps',
          browserifyOptions: {
            debug: true
          }
        }
      },

      main: {
        src: 'src/main.js',
        dest: 'dist/rac.js',
        options: {
          banner: '// RAC - ruler-and-compass - <%= pkg.version %>',
          browserifyOptions: {}
        }
      }

    }, // browserify

    uglify: {
      options: {
        mangle: false,
        banner: '// RAC - ruler-and-compass - <%= pkg.version %> - minified',
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
      serve: {
        files: ['src/**/*.js'],
        tasks: ['makeVersionFile', 'browserify']
      }
    }, // watch

    jsdoc : {
      dist : {
        src: ['src/*'],
        options: {
          template: "./node_modules/minami-rac",
          readme: "./built/docs_home.md",
          destination: 'docs/documentation/latest',
          verbose: true,
          // pedantic: true,
          // debug: true,
          // explain: true,
          configure: './jsdoc.json'
        }
      }
    } // jsdoc
  });


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


  // Saves the version file with the current version.
  // When there are NO changes in the working tree the version is setup as
  // clean:
  // `{commitCount}-{shortHash}`
  //
  // When there ARE changes in the working tree the version is setup as
  // dirty:
  // `localBuild-{localTime}-{commitCount}-{shortHash}`
  //
  // When `target == "clean"` the version is setup as forced-clean:
  // `{commitCount}-{shortHash}`
  grunt.registerTask('saveVersionFile', function(target) {
    grunt.config.requires(
      'pkg.version',
      'exec.shortHash.value',
      'exec.shortHash.parentHash',
      'exec.commitCount.value',
      'exec.statusCount.value');

    const pkgVersion = grunt.config('pkg.version');
    const shortHash = grunt.config('exec.shortHash.value');
    const parentHash = grunt.config('exec.shortHash.parentHash');
    const commitCount = grunt.config('exec.commitCount.value');
    const statusCount = grunt.config('exec.statusCount.value');
    const clean = target === 'clean';

    const versionString = '' + pkgVersion;

    let buildString;
    if (statusCount == 0 || clean) {
      buildString =`${commitCount}-${shortHash}`;
    } else {
      const now = new Date();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      minutes = minutes >= 10 ? minutes : `0${minutes}`;
      seconds = seconds >= 10 ? seconds : `0${seconds}`;
      const localTime = `${now.getHours()}:${minutes}:${seconds}`;
      buildString =`localBuild-${localTime}-${commitCount}-${shortHash}`;
      grunt.log.writeln(`Built at: ${localTime.green.bold}`);
    }

    const templateContents = grunt.file.read('template/version.js.template');
    const processedTemplate = grunt.template.process(templateContents, {data: {
      versionString: versionString,
      buildString: buildString
    }});

    const saveType = clean ? "forced-clean" : statusCount == 0 ? "clean" : "dirty";

    const outputFile = 'built/version.js';
    grunt.file.write(outputFile, processedTemplate);
    grunt.log.writeln(`Saved ${saveType.green.bold} version file:`);
    grunt.log.writeln(`version: ${versionString.green}`);
    grunt.log.writeln(`build:   ${buildString.green}`);
  });


  // Queues all the tasks required to make the version file.
  grunt.registerTask('makeVersionFile', function(target) {
    let saveVersionFile = target === undefined
      ? 'saveVersionFile'
      : `saveVersionFile:${target}`;
    grunt.task.run(
      'exec:shortHash',
      'exec:commitCount',
      'exec:statusCount',
      saveVersionFile);
    if (target === undefined) {
      grunt.log.writeln(`Queued all tasks to make version file`);
    } else {
      grunt.log.writeln(`Queued all tasks to make version file - target:${target}`);
    }

  });


  grunt.registerTask('default', ['serve']);

  grunt.registerTask('makeDocs', [
    'makeDocsReadme', 'jsdoc']);

  // Builds a dev bundle, serves it, and watches for source changes
  grunt.registerTask('serve', [
    'makeVersionFile',
    'browserify:dev',
    'connect:server',
    'watch:serve']);

  // Builds a dev/main/mini bundle with a clean version, serves it for confirmation
  grunt.registerTask('dist', [
    'makeVersionFile:clean',
    'browserify:dev',
    'browserify:main',
    'uglify',
    'connect:server:keepalive']);

};

