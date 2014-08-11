module.exports = function(karma) {
  karma.set({

    // Where to look for files, starting with this one (in build/).
    basePath: '../',

    // Frameworks to use.
    frameworks: ['jasmine'],

    // File patterns to load into the browser during testing.
    files: [
      <% scripts.forEach(function(file) { %>'<%= file %>',
      <% }); %>
      'src/**/*.js'
    ],

    // List of files to exclude.
    exclude: [], 

    // Test result reporter to use.
    // Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],

    // Web server port.
    port: 9025,
    //port: 9018,

    // Test runner port.
    runnerPort: 9100,

    // Browser URL path.
    urlRoot: '/',

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: karma.LOG_WARN,

    // Browser URL path.
    urlRoot: '/',

    // Disable file watching by default.
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],

    // If browser does not capture in given timeout (ms), kill it.
    captureTimeout: 60000,

    // Continuous Integration mode.
    // If true, it captures browsers, run tests and exit.
    //singleRun: false
  });
};

