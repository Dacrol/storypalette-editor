angular.module('uiAuth.interceptor', [])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('interceptor');
})

.factory('interceptor', function($rootScope, $q, $window, store, authConfig) {
  return {
    request: function(config) {
      //console.log('requestInterceptor', config);
      config.header = config.header || {}; 

      var token = store.get(authConfig.tokenKey);
      if (token) {
        config.headers.Authorization = 'Bearer ' + token; 
      }
      return config;
    },
    response: function(response) {
      //console.log('responseInterceptor', response.status);
      if (response.status === 401) {
        console.log('user not authenticated');
      } 
      return response || $q.when(response);
    }
  };
})
;
