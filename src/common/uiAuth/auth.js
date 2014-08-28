angular.module('uiAuth.auth', [])

.provider('auth', function authProvider() {
  
  // Resolve methods to guard states.
  this.requireAdmin = function(auth) {
    return auth.requireAdmin();
  };

  this.requireUser = function(auth) {
    console.log('requireUser');
    return auth.requireUser(); 
  };

  // auth service. 
  this.$get = function ($q, $http, $rootScope, queue, login, store, authUtils, authConfig) {
    var user = null;

    // Register a handler for when an item is added to the retry queue
    queue.onItemAddedCallbacks.push(function(retryItem) {
      if (queue.hasMore()) {
        login.show();
      }
    });

    var api = {
      getToken: function() {
        return store.get(authConfig.tokenKey);
      },
      getCurrentUser: function() {
        if (!user) {
          var token = store.get(authConfig.tokenKey);
          user = token ? authUtils.userFromToken(token) : null;
        }
        return user;
      },
      requireUser: function() {
        var user = api.getCurrentUser();
        if (!user) {
          return queue.pushRetryFn('user', api.requireUser);
        } else {
          return user;
        }
      },
      isAuthenticatedUser: function() {
        return !!api.getCurrentUser(); 
      },
      isAuthenticatedAdmin: function() {
        var user = api.getCurrentUser();
        return !!(user && user.role && user.role === 'admin');
      },

      requestCurrentUser: function() {
      
      },

      login: function(username, password) {
        return $http
          // TODO: Dynamic api url!
          .post(authConfig.apiBase + 'authenticate', {username: username, password: password}) 
          .then(function(res) {
            store.set(authConfig.tokenKey, res.data.token);
            var user = api.getCurrentUser();
            $rootScope.$broadcast('auth:userLoggedIn', user);
            return user;
          });
      },
      logout: function() {
        user = null;
        store.unset(authConfig.tokenKey); 
        $rootScope.$broadcast('auth:userLoggedOut', user);
      },
      showLogin: function() {
        login.show(); 
      }

    };
    return api;
  };
});
