angular.module('uiAuth.loginFormCtrl', [
  'ui.bootstrap'
])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the auth service.
.controller('LoginFormCtrl', function($scope, $modalInstance, auth, login) {
  $scope.user = {};
  $scope.authError = null;

  $scope.login = function() {
    // Clear any previous security errors
    $scope.authError = null;

    // Try to login
    auth.login($scope.user.username, $scope.user.password).then(function(user) {
      if (!user) {
        $scope.authError = 'Fel namn eller lösenord';
      } else {
        $modalInstance.close(user);
      }
    }, function(err) {
      $scope.authError = 'Serverfel'; 
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };

  $scope.cancelLogin = function() {
    $modalInstance.dismiss('Cancel');
  };
})
;
