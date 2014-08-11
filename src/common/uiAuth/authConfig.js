angular.module('uiAuth.authConfig', [])

.provider('authConfig', function authConfig() {
  
  // Key used for token client store.
  var tokenKey = 'uiAuthToken';

  // API base path, e.g. 'http://api.sp.com/v1/'
  var apiBase;

  // Provider methods
  this.setTokenKey = function(tk)  {
    tokenKey = tk;  
  };

  this.setApiBase = function(url)  {
    apiBase = url;
  };

  this.$get = function() {
    return {
      get tokenKey() {
        return tokenKey; 
      },
      get apiBase() {
        if (!apiBase) {
          throw 'authConfig: no apiBase specified';
        }
        return apiBase;
      }
    }; 
  };

});
