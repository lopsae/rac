
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
          keepalive: true,
          debug: true
        }
      } // server
    }, // connect

    exec: {
      shortHash: {
        cmd: 'git --no-pager log --max-count=1 --format="%h"',
        stdout: false,
        callback: function(error, stdout, stderr) {
          if (error !== null) return;

          let shortHash = stdout.trim();
          grunt.config('exec.shortHash.value', shortHash);
          grunt.log.writeln(`Git short hash: ${shortHash}`);
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
      } // commitCount
    } // exec

  });


  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');


  grunt.registerTask('makeVersionFile', function() {
    grunt.config.requires(
      'exec.shortHash.value',
      'exec.commitCount.value',
      'pkg.version');

    let shortHash = grunt.config('exec.shortHash.value');
    let commitCount = grunt.config('exec.commitCount.value');
    let pkgVersion = grunt.config('pkg.version');

    let templateContents = grunt.file.read('template/version.js.template');
    let processedTemplate = grunt.template.process(templateContents, {data: {
      pkgVersion: pkgVersion,
      shortHash: shortHash,
      commitCount: commitCount}});

    let outputFile = 'built/version.js';
    grunt.file.write(outputFile, processedTemplate);
    grunt.log.writeln(`Saved version file: ${pkgVersion}-${commitCount}-${shortHash}`);
  });


  grunt.registerTask('default', ['browserify']);

  grunt.registerTask('versionFile', [
    'exec:shortHash', 'exec:commitCount', 'makeVersionFile']);

  grunt.registerTask('dist', ['versionFile', 'browserify', 'connect:server']);


};
