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
  this.$get = function ($q, $http, queue, login, store, authUtils, authConfig) {
    var user = null;

    // Register a handler for when an item is added to the retry queue
    queue.onItemAddedCallbacks.push(function(retryItem) {
      if (queue.hasMore()) {
        login.show();
      }
    });

    var api = {
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
          .post('http://api.storypalette.dev:8888/v1/authenticate', {username: username, password: password}) 
          .then(function(res) {
            console.log('result', res);
            store.set(authConfig.tokenKey, res.data.token);
            return api.getCurrentUser();
          });
      },
      logout: function() {
        user = null;
        store.unset(authConfig.tokenKey); 
      },
      showLogin: function() {
        login.show(); 
      }

    };
    return api;
  };
});
