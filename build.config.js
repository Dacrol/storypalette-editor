// Configuration for the build process.
module.exports = {
  // Compile to this folder during development.
  build_dir: 'build',

  // Minified code is deployed here.
  compile_dir: 'dist',

  // Our application code.
  app_files: {
    js: ['src/**/*.js', '!src/**/*.spec.js'],
    jsunit: ['src/**/*.spec.js'],
    atpl: ['src/app/**/*.tpl.html'],
    ctpl: ['src/common/**/*.tpl.html'],
    html: ['src/index.html'],
    less: 'src/less/main.less'
  },

  // Files used during testing only.
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/lodash/dist/lodash/js'
    ]
  },

  // Stuff in `vendor` directory to be used in the build process.
  vendor_files: {
    js: [
      'vendor/lodash/dist/lodash.js',
      'vendor/angular/angular.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-route/angular-route.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.js'
      //'vendor/angular-bootstrap/ui-bootstrap.js'
    ],
    css: [],
    assets: [
      //'vendor/bootstrap/fonts/*'    
    ]
  }
};
