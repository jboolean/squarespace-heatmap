module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      build: {
        files: {
          'dist/reporter.js': 'lib/reporter.js'
        }
      }
    }
  });

  grunt.registerTask('build', ['browserify']);
};