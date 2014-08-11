module.exports = function (grunt) {

  // Display execution time of grunt tasks.
  //require('time-grunt')(grunt);

  // Load Grunt tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-banner');

  // Load our build configuration.
  var userConfig = require('./build.config.js');

  // Grunt config object with instructions for each plugin.
  var taskConfig = {

    // Use metadata from package.json.
    pkg: grunt.file.readJSON("package.json"),

    // Banner for compiled source files.
    meta: {
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    // Directories to delete when `grunt clean` is executed.
    clean: [ 
      '<%= build_dir %>', 
      '<%= compile_dir %>'
    ],

    // The `copy` task just copies files from A to B.
    // We copy assets and js to `build_dir`, and then we copy the assets to `compile_dir`.
    copy: {
      build_assets: {
        files: [
          { 
            src: ['**'],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
       ]   
      },
      build_vendor_assets: {
        files: [
          { 
            src: [ '<%= vendor_files.assets %>' ],
            dest: '<%= build_dir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
       ]   
      },
      build_appjs: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: ['<%= vendor_files.js %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
            expand: true
          }
        ]
      }
    },

    // `grunt concat` concatenates multiple source files into a single file.
    concat: {

      // The `compile_js` target is the concatenation of our application source
      // code and all specified vendor source code into a single file.
      compile_js: {
        options: {
         // banner: '<%= meta.banner %>'
        },
        src: [ 
          '<%= vendor_files.js %>', 
          'module.prefix', 
          '<%= build_dir %>/src/**/*.js', 
          '<%= html2js.app.dest %>', 
          '<%= html2js.common.dest %>', 
          '<%= vendor_files.js %>', 
          'module.suffix' 
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>.js'
      }
    },

    // `ng-min` annotates the sources before minifying. That is, it allows us
    // to code without the array syntax.
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    // Minify the sources.
    uglify: {
      compile: {
        options: {
          //banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    // `less` handles our LESS compilation and uglification automatically.
    // Only our `main.less` file is included in compilation; all other files
    // must be imported from this file.
    less: {
      build: {
        src: ['<%= app_files.less %>'],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>.css',
        options: {
          compress: false
        }
      },
      compile: {
        src: ['<%= less.build.dest %>'],
        dest: '<%= less.build.dest %>',
        options: {
          compress: true,
          cleancss: true
        }
      }
    },

    // `jshint` defines the rules of our linter and which files to check.
    jshint: {
      src: [ 
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        debug: true,
        globals: {
          angular: true,
          console: true
        }
      }
    },

    // HTML2JS converts template files into strings in JS files and adds them to $templateCache.
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= app_files.atpl %>'],
        dest: '<%= build_dir %>/templates-app.js'
      },

      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= app_files.ctpl %>'],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },

    // The Karma configurations.
    // These settings will override those in the configFile.
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma.config.js'
      },
      unit: {
        //runnerPort: 9101,
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    // The `index` task compiles the `index.html` file as a Grunt template. CSS
    // and JS files co-exist here but they get split apart later.
    index: {

      // Add script files to `<head>` during development.
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= less.build.dest %>'
        ]
      },

      // For compilation we only include a single JS and a single CSS file.
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= vendor_files.css %>',
          '<%= less.compile.dest %>'
        ]
      }
    },

    // Compile the karma template.
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [ 
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },

    // TODO:  Add 'use strict' to all javascript files when developing.
    usebanner: {
      strict: {
        options: {
          position: 'top',
          banner: '// HELLO!'
        },
        files: {
          src: ['<%= app_files.js %>']
        }
      }
    },

    // Execute specific tasks depending on what has changed.
    delta: {

      // Per default, Live Reload should work for all tasks.
      // It runs by default on port 35729.
      options: {
        //livereload: true
        livereload: 35730
      },

      // When the Gruntfile changes, we just want to lint it.
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          //livereload: false
          livereload: 35730
        }
      },

      // When our JS files change, lint and run unit tests.
      jssrc: {
        files: [ 
          '<%= app_files.js %>'
        ],
        tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs']
      },

      // When assets are changed, copy them.
      assets: {
        files: [ 
          'src/assets/**/*'
        ],
        tasks: ['copy:build_assets', 'copy:build_vendor_assets']
      },

      // When index.html changes, rebuild it.
      html: {
        files: ['<%= app_files.html %>' ],
        tasks: ['index:build']
      },

      // When our templates change, we only rewrite the template cache.
      tpls: {
        files: [ 
          '<%= app_files.atpl %>', 
          '<%= app_files.ctpl %>'
        ],
        tasks: ['html2js']
      },

      // When the LESS files change, we need to compile and minify them.
      less: {
        files: ['src/**/*.less'],
        tasks: ['less:build']
      },

      // When a JS unit test file changes, lint it and run tests.
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: ['jshint:test', 'karma:unit:run'],
        options: {
          livereload: false
        }
      }
    }
  };

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig ));

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', [
    'collate',
    'test',
    'karma:unit',
    'delta'
  ]);

  // Watch without tests.
  grunt.registerTask('watch-notest', [
    'collate',
    'delta'
  ]);

  // The default task is to build and compile.
  grunt.registerTask('default', [
    'build',
    'compile'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'karmaconfig',
    'karma:continuous'
  ]);

  // The `collate` task gets your app ready to run for development. 
  grunt.registerTask('collate', [
    'clean',
    'html2js',
    'jshint',
    //'usebanner',
    'less:build',
    'copy:build_assets',
    'copy:build_vendor_assets',
    'copy:build_appjs',
    'copy:build_vendorjs',
    'index:build'
  ]);

  // Collate and get ready for testing.
  grunt.registerTask('build', [
      'collate',
      'test'
  ]);
  
  // The `compile` task concatenates and minifies your code.
  // Use this for deployment.
  grunt.registerTask('compile', [
    'less:compile',
    'copy:compile_assets',
    'ngmin',
    'concat',
    'uglify',
    'index:compile'
  ]);

  // A utility function to get all app JavaScript sources.
  function filterForJS(files) {
    return files.filter(function(file) {
      return file.match(/\.js$/);
    });
  }

  // A utility function to get all app CSS sources.
  function filterForCSS (files) {
    return files.filter(function(file) {
      return file.match(/\.css$/);
    });
  }

  // The index.html template includes the stylesheet and javascript sources
  // based on dynamic names calculated in this Gruntfile. This task assembles
  // the list into variables for the template to use and then runs thei compilation.
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
    var jsFiles = filterForJS(this.filesSrc ).map(function(file) {
      return file.replace(dirRE, '');
    });
    var cssFiles = filterForCSS(this.filesSrc ).map(function(file) {
      return file.replace(dirRE, '');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', { 
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version')
          }
        });
      }
    });
  });

  // Compile `karma/*` files as grunt templates for use by Karma.
  grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS(this.filesSrc);
    
    grunt.file.copy('karma.config.tpl.js', grunt.config('build_dir') + '/karma.config.js', { 
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

};

