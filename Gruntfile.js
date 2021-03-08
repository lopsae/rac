
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
          grunt.log.writeln(`Git short hash: ${shortHash}`);
          grunt.config('exec.shortHash.value', shortHash);
        }
      }, // shortHash
      commitCount: {
        cmd: 'git rev-list --count HEAD',
        stdout: false,
        callback: function(error, stdout, stderr) {
          if (error !== null) return;

          let commitCount = stdout.trim();
          grunt.log.write(`Git commit count: ${commitCount}`);
          grunt.config('exec.commitCount.value', commitCount);
        }
      } // commitCount
    } // exec

  });


  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');


  grunt.registerTask('default', ['browserify']);

  grunt.registerTask('makeVersionFile', [
    'exec:shortHash', 'exec:commitCount', 'buildVersion']);

  grunt.registerTask('buildVersion', function() {
    grunt.config.requires(
      'exec.shortHash.value',
      'exec.commitCount.value',
      'pkg.version');
    grunt.log.writeln(`Making a version file!`);
    let templateContents = grunt.file.read('template/version.js.template');
    // grunt.log.write(`Template: ${templateContents}`);
    let processedTemplate = grunt.template.process(templateContents, {data: {
      pkgVersion: grunt.config('pkg.version'),
      shortHash: grunt.config('exec.shortHash.value'),
      commitCount: grunt.config('exec.commitCount.value')}});

    // grunt.log.write(`processedTemplate: ${processedTemplate}`);
    let outputFile = 'built/version.js';
    grunt.log.writeln(`Saving to file: ${outputFile}`);
    grunt.file.write(outputFile, processedTemplate);
  });

};
