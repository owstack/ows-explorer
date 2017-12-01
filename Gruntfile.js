'use strict';

// var config = require('explorer-config.json');

module.exports = function(grunt) {

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-macreload');
  grunt.loadNpmTasks('grunt-angular-gettext');
  grunt.loadNpmTasks('grunt-replace');

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        process: function(src, filepath) {
          if (filepath.substr(filepath.length - 2) === 'js') {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          } else {
            return src;
          }
        }
      },
      vendors: {
        src: [
          'www/src/js/ios-imagefile-megapixel/megapix-image.js',
          'bower_components/qrcode-generator/js/qrcode.js',
          'www/src/js/jsqrcode/grid.js',
          'www/src/js/jsqrcode/version.js',
          'www/src/js/jsqrcode/detector.js',
          'www/src/js/jsqrcode/formatinf.js',
          'www/src/js/jsqrcode/errorlevel.js',
          'www/src/js/jsqrcode/bitmat.js',
          'www/src/js/jsqrcode/datablock.js',
          'www/src/js/jsqrcode/bmparser.js',
          'www/src/js/jsqrcode/datamask.js',
          'www/src/js/jsqrcode/rsdecoder.js',
          'www/src/js/jsqrcode/gf256poly.js',
          'www/src/js/jsqrcode/gf256.js',
          'www/src/js/jsqrcode/decoder.js',
          'www/src/js/jsqrcode/qrcode.js',
          'www/src/js/jsqrcode/findpat.js',
          'www/src/js/jsqrcode/alignpat.js',
          'www/src/js/jsqrcode/databr.js',
          'bower_components/momentjs/min/moment.min.js',
          'bower_components/moment/lang/es.js',
          'bower_components/zeroclipboard/ZeroClipboard.min.js'
        ],
        dest: 'www/js/vendors.js'
      },
      angular: {
        src: [
          'bower_components/angular/angular.min.js',
          'bower_components/angular-resource/angular-resource.min.js',
          'bower_components/angular-route/angular-route.min.js',
          'bower_components/angular-qrcode/qrcode.js',
          'bower_components/angular-animate/angular-animate.min.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          'bower_components/angular-ui-utils/ui-utils.min.js',
          'bower_components/ngprogress/build/ngProgress.min.js',
          'bower_components/angular-gettext/dist/angular-gettext.min.js',
          'bower_components/angular-moment/angular-moment.min.js',
          'bower_components/ng-lodash/build/ng-lodash.min.js'
        ],
        dest: 'www/js/angularjs-all.js'
      },
      main: {
        src: [
          'www/src/js/app.js',
          'www/src/js/controllers/*.js',
          'www/src/js/models/*.js',
          'www/src/js/services/*.js',
          'www/src/js/directives.js',
          'www/src/js/filters.js',
          'www/src/js/config.js',
          'www/src/js/config-node.js',
          'www/src/js/init.js',
          'www/src/js/translations.js'
        ],
        dest: 'www/js/main.js'
      },
      css: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'www/src/css/**/*.css'
        ],
        dest: 'www/css/main.css'
      }
    },
    copy: {
      zeroclipboard: {
        expand: true,
        flatten: true,
        src: 'bower_components/zeroclipboard/ZeroClipboard.swf',
        dest: 'www/lib/zeroclipboard/'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n',
        mangle: false
      },
      vendors: {
        src: 'www/js/vendors.js',
        dest: 'www/js/vendors.min.js'
      },
      angular: {
        src: 'www/js/angularjs-all.js',
        dest: 'www/js/angularjs-all.min.js'
      },
      main: {
        src: 'www/js/main.js',
        dest: 'www/js/main.min.js'
      }
    },
    cssmin: {
      css: {
        src: 'www/css/main.css',
        dest: 'www/css/main.min.css'
      }
    },
    markdown: {
      all: {
        files: [
         {
           expand: true,
           src: 'README.md',
           dest: '.',
           ext: '.html'
         }
        ]
      }
    },
    macreload: {
      chrome: {
        browser: 'chrome',
        editor: 'macvim'
      }
    },
    watch: {
      main: {
        files: ['www/src/js/**/*.js'],
        tasks: ['concat:main', 'uglify:main'],
      },
      css: {
        files: ['www/src/css/**/*.css'],
        tasks: ['concat:css', 'cssmin'],
      },
    },
    nggettext_extract: {
      pot: {
        files: {
          'po/template.pot': [
            'www/views/*.html',
            'www/views/**/*.html'
          ]
        }
      },
    },
    nggettext_compile: {
      all: {
        options: {
          module: 'owsExplorerApp.translations'
        },
        files: {
          'www/src/js/translations.js': [
            'po/*.po'
          ]
        }
      },
    }
  });

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['watch']);

  //Update .pot file
  grunt.registerTask('translate', ['nggettext_extract']);

  //Compile task (concat + minify)
  grunt.registerTask('compile', ['nggettext_compile', 'concat', 'copy', 'uglify', 'cssmin']);


};
