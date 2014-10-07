/*global module:false*/

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    qunit: {
      files: ['test/**/*.html']
    },

    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:lib/FILE_NAME.js>'],
        dest: 'dist/FILE_NAME.js'
      }
    },

    stylus: {
      doc: {
        src: ['static/stylus/doc.styl'],
        dest: 'static/css/doc.css'
      }
    },
    cssmin: {
      compress: {
        files: {
          'static/dist/css/doc.min.css': ['static/css/doc.css']
        }
      }
    },
    uglify: {
      site: {
        files: {
          'static/dist/js/console.min.js': ['static/dist/js/console/main.js'],
          'static/dist/js/settings.min.js': ['static/dist/js/settings/main.js'],
        }
      }
    },

    watch: {
      // scripts: {
      //   files: ['static/js/libs/**/*.js',
      //     'static/js/mods/**/*.js',
      //     'static/js/backboneUI/**/*.js',
      //     'static/js/i18n/**/*.js',
      //     'static/js/console/**/*.js',
      //     'static/js/common/**/*.js',
      //     'static/js/settings/**/*.js',
      //   ],
      //   tasks: ['ozma']
      // },
      stylesheets: {
        files: ['static/stylus/mod/**/*.styl',
          'static/stylus/*.styl'],
        tasks: ['stylus', 'cssmin']
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true,
        globals: {
          $: true,
          Console: true,
          console: true,
          Backbone: true,
          define: true,
          _: true,
          io: true,
          d3: true,
          require: true
        }
      }
    },

    ozma: {
      console: {
        src: 'static/js/console/main.js',
        saveConfig: false,
        debounceDelay: 3000,
        config: {
          baseUrl: "static/js/",
          distUrl: "static/dist/js/",
          loader: "libs/oz/oz.js",
          disableAutoSuffix: true
        }
      },
      settings: {
        src: 'static/js/settings/main.js',
        saveConfig: false,
        debounceDelay: 3000,
        config: {
          baseUrl: "static/js/",
          distUrl: "static/dist/js/",
          loader: "libs/oz/oz.js",
          disableAutoSuffix: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-ozjs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['watch']);

};
