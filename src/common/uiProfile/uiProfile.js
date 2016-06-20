import template from './uiProfile.tpl.html';
import uiAuth from '../uiAuth/index.js';

angular.module('uiProfile', [
  'uiAuth'
])

// Reusable user login/profile widget.
// Depends on uiAuth.
.directive('uiProfile',function(auth) {
  return {
    templateUrl: template,
    restrict: 'AE',
    scope: true,
    link: function(scope, el) {
      scope.isAuthenticated = auth.isAuthenticatedUser;
      scope.login = auth.showLogin;
      scope.auth = auth;
      scope.logout = auth.logout;
      scope.$watch(function() {
        // TODO: perf!
        return auth.getCurrentUser();
      }, function(user) {
        scope.user = user;
        //scope.currentRoom = (currentUser) ? currentUser.organisation.rooms[0] : undefined ;
      });
    }
  };
});
