angular.module('sp.editor.common.users', [
])

.factory('users', function($http, config) {
  var apiBase = config.apiBase + 'users/'; 

  return {
    all: function () {
      return $http.get(apiBase).then(function(res) {
        return res.data;
      });
    },
    create: function(user) {
      return $http.post(apiBase, user).then(function(res) {
        return res.data;
      });
    },
    update: function(user) {
      return $http.put(apiBase + user._id, user).then(function(res) {
        return res.data;   // {result: 1}
      });
    },
    remove: function(userId) {
      return $http.delete(apiBase + userId).then(function(res) {
        return res;
      });
    }
  };
});
