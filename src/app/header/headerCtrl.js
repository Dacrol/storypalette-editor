import uiAuth from '../../common/uiAuth/index.js';

angular.module('sp.editor.header', [
  'uiAuth'
])

.controller('HeaderCtrl', function ($scope, $location, $route, auth, httpRequestTracker) {
  //$scope.isAuthenticated = security.isAuthenticated;
  //$scope.isAdmin = security.isAdmin;

  /*
  $scope.home = function() {
    if (security.isAuthenticated()) {
      console.log('HeaderCtrl: Authenticated');
      $location.path('/edit');
    } else {
      console.log('HeaderCtrl: Not authenticated');
      $location.path('/');
    }
  };
  */

  // What is this for?
  $scope.hasPendingRequests = function() {
    return httpRequestTracker.hasPendingRequests();
  };
})
;
