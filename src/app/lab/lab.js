angular.module('sp.editor.lab', [
  'uiAuth'
])


.config(function ($stateProvider) {
  $stateProvider.state('lab', {
    url: '/lab', 
    templateUrl: 'lab/lab.tpl.html',
    controller: 'LabCtrl' 
  });
})

.controller('LabCtrl', function($scope, auth, $http, $window) {
  $scope.message = 'Please login!';

  $scope.submit = function() {
    auth.login($scope.user.username, $scope.user.password).then(function(user) {
      if (!user) {
        console.log('login failed'); 
      } else {
        console.log('logged in!', user); 
      }
    }, function(err) {
      console.log('serverfel');
    });
  };

  /*
  $scope.submitOld = function() {
    $http
      .post('http://api.storypalette.dev:8888/v1/authenticate', $scope.user) 
      .success(function(data, status, headers, config) {
        console.log('success', data);
        $window.sessionStorage.token = data.token; 
        
        //console.log(authUtils.userFromToken(data.token));
        $scope.message = 'Welcome!';
      })
      .error(function(data, status, headers, config) {
        console.log('fail', data);
        // Erase the token if the user fails to log in. 
        delete $window.sessionStorage.token; 

        // Handle login errors.
        $scope.message = 'Error: Invalid user or password.'; 
      });
  };


  $scope.testAccess = function() {
    $http({url: 'http://api.storypalette.dev:8888/v1/palettes', method: 'GET'}) 
    .success(function(data, status, headers, config) {
      console.log('data', data); 
    }).error(function() {
      console.log('error', data); 
    });
  };
  */

})
;
