
module.exports = function(grunt) {

  grunt.initConfig({
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
            options: {
              icons: true,
              view: 'detail'
            }
          },
          keepalive: true,
          debug: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');


  grunt.registerTask('default', ['browserify']);

};
