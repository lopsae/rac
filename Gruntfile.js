
module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9001,
          directory: {
            path: './',
            options: {
              icons: true,
              view: "detail"
            }
          },
          keepalive: true,
          debug: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');

  // grunt.registerTask('default', ['uglify']);

};
