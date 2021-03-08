
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dev: {
        src: 'src/main.js',
        dest: 'dist/rac.js',
        options: {}
      }
    },

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

    exec: {
      shortHash: {
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
      }, // shortHash
      commitCount: {
        cmd: 'git rev-list --count HEAD',
        stdout: false,
        callback: function(error, stdout, stderr) {
          if (error !== null) return;

          let commitCount = stdout.trim();
          grunt.config('exec.commitCount.value', commitCount);
          grunt.log.writeln(`Git commit count: ${commitCount}`);
        }
      }, // commitCount
      statusCount: {
        cmd: 'git status --porcelain | wc -l',
        stdout: false,
        callback: function(error, stdout, stderr) {
          if (error !== null) return;

          let statusCount = parseInt(stdout.trim());
          grunt.config('exec.statusCount.value', statusCount);
          grunt.log.writeln(`Git status count: ${statusCount}`);
        }
      } // statusCount
    }, // exec
    watch: {
      serve: {
        files: ['src/**/*.js'],
        tasks: ['versionFile', 'browserify']
      }
    } // watch
  });


  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');


  grunt.registerTask('makeVersionFile', function(target) {
    grunt.config.requires(
      'pkg.version',
      'exec.shortHash.value',
      'exec.shortHash.parentHash',
      'exec.commitCount.value',
      'exec.statusCount.value');

    let pkgVersion = grunt.config('pkg.version');
    let shortHash = grunt.config('exec.shortHash.value');
    let parentHash = grunt.config('exec.shortHash.parentHash');
    let commitCount = grunt.config('exec.commitCount.value');
    let statusCount = grunt.config('exec.statusCount.value');
    let clean = target === 'clean';

    let versionString;
    if (statusCount == 0 || clean) {
      versionString =`${pkgVersion}-${commitCount}-${shortHash}`;
    } else {
      let now = new Date();
      let localTime = `${now.getHours()}:${now.getMinutes()}`;
      versionString =`${pkgVersion}-${localTime}-${commitCount}-${shortHash}`;
    }

    let templateContents = grunt.file.read('template/version.js.template');
    let processedTemplate = grunt.template.process(templateContents, {data: {
      versionString: versionString}});

    let outputFile = 'built/version.js';
    grunt.file.write(outputFile, processedTemplate);
    grunt.log.writeln(`Saved ${clean?"clean ":""}version file: ${versionString}`);
  });


  grunt.registerTask('versionFile', function(target) {
    let makeVersionFile = target === undefined
      ? 'makeVersionFile'
      : `makeVersionFile:${target}`;
    grunt.task.run(
      'exec:shortHash',
      'exec:commitCount',
      'exec:statusCount',
      makeVersionFile);
    if (target === undefined) {
      grunt.log.writeln(`Queued versionFile tasks`);
    } else {
      grunt.log.writeln(`Queued versionFile tasks - target:${target}`);
    }

  });


  grunt.registerTask('default', ['browserify']);

  grunt.registerTask('serve', [
    'versionFile', 'browserify', 'connect:server', 'watch:serve']);

  grunt.registerTask('dist', ['versionFile', 'browserify', 'connect:server']);

};

// TODO: task that makes bundle and commits it for the current hash, make version
// bundle file, commit, serve. check for no modified files when bundling, check for bundle producing an aleady commited file
