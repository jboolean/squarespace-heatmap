module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      build: {
        files: {
          'dist/tracker.js': 'lib/tracker.js'
        }
      }
    }
  });

  grunt.registerTask('build', ['browserify']);
};