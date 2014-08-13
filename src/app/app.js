angular.module('sp.editor', [
  'ui.router',
  'templates-app',
  'templates-common',
  'sp.editor.common.config',
  'sp.editor.common.palettes',
  'sp.editor.common.resources',
  'sp.editor.common.users',
  'sp.editor.palettes',
  'sp.editor.edit',
  'sp.editor.lab',
  'sp.editor.admin',
  'services.httpRequestTracker',
  //'uiEnv',
  'uiDialog',
  'uiNotifications',
  'uiAuth',
  'uiProfile',
  'ui.bootstrap'
])

.config(function($urlRouterProvider, $locationProvider, $stateProvider, socketProvider, authConfigProvider, uiNotificationsProvider, authProvider, config) {
  // Various app-wide settings
  uiNotificationsProvider.setDefaultToastDuration(config.notifications.toastLengthMedium);

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

.run(function(socket, config, auth) {
  console.log('*** Storypalette version ' + config.version.number + ' - ' + config.version.name + ' ***\n');

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

.controller('AppCtrl', function($scope, config, uiNotifications, socket, $http) {

  // Used to point /image and /sound to the correct api url.
  $scope.apiBase = config.apiBase;

  console.log('config', config);

  // Notification handling used throughout the app
  $scope.notifications = uiNotifications;

  $scope.removeNotification = function(notification) {
    uiNotifications.remove(notification);
  };

  $scope.$on('security:userLoggedIn', function(e, user) {
    console.log('EditAppCtrl: on  security:userLoggedIn', user.username);
    //socket.connect();
  });

  $scope.$on('security:userLoggedOut', function(e, user) {
    console.log('Bye bye ' + user.username + '.');
    socket.disconnect();
  });

  $scope.$on('$destroy', function (event) {
    console.log('AppCtrl destroyed: remove socket listeners?');
    ///socket.removeAllListeners();
    // or something like
    // socket.removeListener(this);
  });

  // Outut socket errors
  socket.on('error', function (reason){
    console.error('Unable to connect Socket.IO', reason);
  });
})    

.controller('HeaderCtrl', function ($scope, $location, $route, security, httpRequestTracker) {
  $scope.isAuthenticated = security.isAuthenticated;
  $scope.isAdmin = security.isAdmin;

  $scope.home = function() {
    if (security.isAuthenticated()) {
      console.log('HeaderCtrl: Authenticated');
      $location.path('/edit');
    } else {
      console.log('HeaderCtrl: Not authenticated');
      $location.path('/');
    }
  };

  $scope.hasPendingRequests = function() {
    return httpRequestTracker.hasPendingRequests();
  };
})
;


// TODO: Temp fix for karma.
window.env = window.env || {};
