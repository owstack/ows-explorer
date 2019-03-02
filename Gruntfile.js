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
      components: {
        src: [
          'app/shared/3p/ios-imagefile-megapixel/megapix-image.js',
          'bower_components/qrcode-generator/js/qrcode.js',
          'app/shared/3p/jsqrcode/grid.js',
          'app/shared/3p/jsqrcode/version.js',
          'app/shared/3p/jsqrcode/detector.js',
          'app/shared/3p/jsqrcode/formatinf.js',
          'app/shared/3p/jsqrcode/errorlevel.js',
          'app/shared/3p/jsqrcode/bitmat.js',
          'app/shared/3p/jsqrcode/datablock.js',
          'app/shared/3p/jsqrcode/bmparser.js',
          'app/shared/3p/jsqrcode/datamask.js',
          'app/shared/3p/jsqrcode/rsdecoder.js',
          'app/shared/3p/jsqrcode/gf256poly.js',
          'app/shared/3p/jsqrcode/gf256.js',
          'app/shared/3p/jsqrcode/decoder.js',
          'app/shared/3p/jsqrcode/qrcode.js',
          'app/shared/3p/jsqrcode/findpat.js',
          'app/shared/3p/jsqrcode/alignpat.js',
          'app/shared/3p/jsqrcode/databr.js',
          'bower_components/momentjs/min/moment.min.js',
          'bower_components/moment/lang/es.js',
          'bower_components/zeroclipboard/ZeroClipboard.min.js',
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
          'bower_components/ng-lodash/build/ng-lodash.min.js',
        ],
        dest: 'www/lib/components.js'
      },
      app: {
        src: [
          'app/app.js',
          'app/components/**/*.js',
          'app/model/**/*.js',
          'app/services/**/*.js',
          'app/shared/**/*.js',
          'app/config.js',
          'app/init.js',
          'app/ows-node-config.js'
        ],
        dest: 'www/js/app.js'
      },
      css: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'app/shared/css/*.css',
          'app/shared/css/**/*.css'
        ],
        dest: 'www/css/main.css'
      }
    },
    copy: {
      app_root: {
        expand: true,
        flatten: false,
        cwd: 'app/',
        src: [
          'index.html'
        ],
        dest: 'www/'
      },
      app_views: {
        expand: true,
        flatten: false,
        cwd: 'app/components',
        src: '**/*.html',
        dest: 'www/views/'
      },
      app_shared: {
        expand: true,
        flatten: false,
        cwd: 'app/shared',
        src: '**/*.html',
        dest: 'www/shared/'
      },
      app_fonts: {
        expand: true,
        flatten: false,
        cwd: 'app/assets/fonts',
        src: '**/*',
        dest: 'www/fonts/'
      },
      app_imgs: {
        expand: true,
        flatten: false,
        cwd: 'app/assets/img',
        src: '**/*',
        dest: 'www/img/'
      },
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
      components: {
        src: 'www/lib/components.js',
        dest: 'www/lib/components.min.js'
      },
      app: {
        src: 'www/js/app.js',
        dest: 'www/js/app.min.js'
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
        files: ['app/**/*.js'],
        tasks: ['concat:app', 'uglify:app'],
      },
      css: {
        files: ['app/css/**/*.css'],
        tasks: ['concat:css', 'cssmin'],
      },
    },
    nggettext_extract: {
      pot: {
        files: {
          'i18n/po/template.pot': [
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
          'app/shared/translations/translations.js': [
            'i18n/po/*.po'
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
