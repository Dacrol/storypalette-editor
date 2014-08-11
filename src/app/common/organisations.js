angular.module('sp.editor.common.organisations', [
])

.factory('organisations', function($http, config) {
  var apiBase = config.apiBase + 'organisations/'; 

  return {
    all: function () {
      return $http.get(apiBase).then(function(res) {
        return res.data;
      });
    },
    create: function(organisation) {
      return $http.post(apiBase, organisation).then(function(res) {
        return res.data;
      });
    },
  };
});
