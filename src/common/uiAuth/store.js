angular.module('uiAuth.store', [])

.factory('store', function($window) {
  return {
    get: function(key) {
      return $window.localStorage.getItem(key);
    },
    set: function(key, val) {
      return $window.localStorage.setItem(key, val);
    },
    unset: function(key) {
      return $window.localStorage.removeItem(key);
    }
  };
});
