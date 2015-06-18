module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        transform: ['debowerify']
      },
      browserifyOptions: {
        debug: true
      },
      buildReporter: {
        files: {
          'dist/scripts/reporter.js': 'lib/reporter.js'
        }
      },
      buildFrontend: {
        files: {
          'dist/scripts/frontend.js': 'lib/frontend.js'
        }
      }
    },
    less: {
      compile: {
        files: [
          {
            expand: true,
            src: ['styles/*.less'],
            dest: 'dist',
            ext: '.css'
          }
        ]
      }
    }
  });

  grunt.registerTask('build', ['less', 'browserify']);
};