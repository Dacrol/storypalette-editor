angular.module('security.authorization', [
  'security.service'
])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
.provider('securityAuthorization', {
  requireAdminUser: function (securityAuthorization) {
    return securityAuthorization.requireAdminUser();
  },
  requireAuthenticatedUser: function(securityAuthorization) {
    console.log('requireAuthenticatedUser in provider');
    return securityAuthorization.requireAuthenticatedUser();
  },
  requireAuthenticatedUser2: function(securityAuthorization) {
    console.log('requireAuthenticatedUser2 in provider');
    return 'yes';
  },
  $get: function (security, securityRetryQueue) {
    var service = {
      // Require that there is an authenticated user
      // (use this in a route resolve to prevent non-authenticated users from entering that route)
      requireAuthenticatedUser: function() {
        console.log('requireAuthenticatedUser in api');
        var promise = security.requestCurrentUser().then(function (userInfo) {
          if (!security.isAuthenticated()) {
            return securityRetryQueue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
          } else {
            return userInfo;
          }
        });
        return promise;
      },
      // Require that there is an administrator logged in
      // (use this in a route resolve to prevent non-administrators from entering that route)
      requireAdminUser: function () {
        var promise = security.requestCurrentUser().then(function (userInfo) {
          if (!security.isAdmin()) {
            return securityRetryQueue.pushRetryFn('unauthorized-client', service.requireAdminUser);
          } else {
            return userInfo;
          }
        });
        return promise;
      }
    };
    return service;
  }
})
;
