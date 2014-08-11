angular.module('sp.editor.common.resources', [
  'sp.editor.common.config' 
])

// Resource REST abstraction
.factory('resources', function($http, config) {
  var resources;
  var apiBase = config.apiBase + 'resources/';

  return {
    all: function() {
      //console.log('Getting all resources...');
      return $http.get(apiBase).then(function(response) {
        return response.data;
      });
    },
    save: function(resource) {
      console.log('Saving resource: ' + resource.name);
      return $http.post(apiBase, resource).then(function(response) {
        console.log(response.data);
        return response.data;
      });
    },
    update: function(resource) {
      console.log('Updating resource: ' + resource.name);
      return $http.put(apiBase + resource._id, resource).then(function(response) {
        console.log(response.data);
        return response.data;
      });
    },
    remove: function(resource) {
      console.log('deleting resource: ' + resource.name);
      return $http.delete(apiBase + resource._id).then(function(response) {
          return response.data;
      });
    }
  };
});
