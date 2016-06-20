import angular from 'angular';
import uirouter from 'angular-ui-router';

import config from './common/config.js';
import palettes from './common/palettes.js';
import resources from './common/resources.js';
import access from './common/access.js';
import users from './common/users.js';

import httpRequestTracker from '../common/services/httpRequestTracker.js';
import uiDialog from '../common/uiDialog/uiDialog.js';
import uiNotifications from '../common/uiNotifications/notifications.js';
import uiAuth from '../common/uiAuth/index.js';
import uiProfile from '../common/uiProfile/uiProfile.js'
import uiBootstrap from 'angular-ui-bootstrap';

angular.module('sp.editor', [
  'ui.router',
  'templates-app',
  'templates-common',

  'sp.editor.common.config',
  'sp.editor.common.palettes',
  'sp.editor.common.resources',
  'sp.editor.common.access',
  'sp.editor.common.users',

  'sp.editor.header',
  'sp.editor.palettes',
  'sp.editor.edit',
  'sp.editor.admin',

  'services.httpRequestTracker',
  'uiDialog',
  'uiNotifications',
  'uiAuth',
  'uiProfile',

  'ui.bootstrap'
])

.config(function($urlRouterProvider, $locationProvider, $stateProvider, authConfigProvider, notificationsProvider, authProvider, config) {
  // Various app-wide settings
  notificationsProvider.setDefaultToastDuration(config.notifications.toastLengthMedium);

  authConfigProvider.setTokenKey('spToken');
  authConfigProvider.setApiBase(config.apiBase);

  // Route configuration
  $locationProvider.html5Mode(true);  // no hash-urls

  // Abstract state for different access levels
  $stateProvider
    .state('user', {
      abstract: true,
      template: '<ui-view/>',
      resolve: {
        user: authProvider.requireUser,
      }
    })
    .state('admin', {
      abstract: true,
      template: '<ui-view/>',
      resolve: {
        // TODO: Make admin work
        //user: authProvider.requireAdmin,
        user: authProvider.requireUser,
      }
    });

  // Redirect to palette list.
  $urlRouterProvider.when('/', '/palettes');

  // TODO: 404
  //$routeProvider.otherwise({template: 'Bad route. Go <a href="/">home.</a>'});
})

.run(function($rootScope, $state, $window, config) {
  console.log('*** Storypalette Editor version ' + config.version.number + ' - ' + config.version.name + ' ***\n');
  
  $rootScope.$on('auth:userLoggedOut', function(user){
    $window.location.reload();
  });
  
  $rootScope.$on('$stateChangeError',
function(event, toState, toParams, fromState, fromParams, error){
    console.warn('$stateChangeError', error);
  });

  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  //security.requestCurrentUser().then(function() {
    //if (security.isAuthenticated()) {
      // User is logged in: create socket connection
      //console.log('isconn?', socket.isConnected());
      //socket.connect();
    //}
  //});
})

.controller('AppCtrl', function($scope, config, notifications, $http) {
  // Used to point /image and /sound to the correct api url.
  $scope.apiBase = config.apiBase;

  // Notification handling used throughout the app
  $scope.notifications = notifications;

  $scope.removeNotification = function(notification) {
    notifications.remove(notification);
  };
})
;

// TODO: Temp fix for karma.
window.env = window.env || {};
