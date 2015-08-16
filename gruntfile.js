module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dev: {
        options: {
          debug: true,
          transform: ['reactify']
        },
        files: {
          'build/build.js': 'modules/**/*.react.js'
        }
      },
      build: {
        options: {
          debug: false,
          transform: ['reactify']
        },
        files: {
          'build/build.js': 'modules/**/*.react.js'
        }
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          flatten: true,
          src: ['modules/app/build.scss'],
          dest: './build/',
          ext: '.css',
          rename: function(dest, src) { return 'build/build.css'; }
        }]
      }
    },

    watch: {
      browserify: {
        files: ['modules/**/*.js', 'dispatcher/*.js', 'stores/*.js'],
        tasks: ['browserify:dev']
      },
      css: {
        files: ['modules/**/*.scss'],
        tasks: ['sass', 'replace']
      }
    },

    cssmin: {
      combine: {
        files: {'build/build.css': ['build/build.css']}
      }
    },

    uglify: {
      options: {
        mangle: true,
        compress: true,
      },
      target: {
        files: {'build/build.js': ['build/build.js']}
      }
    },

    copy: {
      fa: {
        expand: true,
        cwd: './node_modules/font-awesome/fonts/',
        src: '**',
        dest: 'build/fonts/'
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /...fonts/,
              replacement: 'fonts'
            }
          ]
        },
        files: {'build/build.css': ['build/build.css']}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('default', ['dev', 'watch']);
  grunt.registerTask('dev', ['browserify:dev', 'sass', 'replace', 'copy']);
  grunt.registerTask('build', ['browserify:build', 'sass', 'replace', 'copy', 'cssmin', 'uglify']);


};
