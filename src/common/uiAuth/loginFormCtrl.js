angular.module('uiAuth.loginFormCtrl', [])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the auth service.
.controller('LoginFormCtrl', function($scope, auth, login) {
  $scope.user = {};
  $scope.authError = null;
  $scope.authReason = 'Authreason not implemented yet';// null;
  //if (auth.getLoginReason()) {
    //$scope.authReason = (security.isAuthenticated()) ? 'Du har inte rättigheter till den här sidan' : 'Du är inte inloggad';
  //}

  // Attempt to authenticate the user specified in the form's model
  $scope.login = function() {
    // Clear any previous security errors
    $scope.authError = null;

    // Try to login
    auth.login($scope.user.username, $scope.user.password).then(function(user) {
      if (!user) {
        $scope.authError = 'Fel namn eller lösenord';
      }
    }, function(err) {
      $scope.authError = 'Serverfel'; 
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };

  $scope.cancelLogin = function() {
    login.cancel();
  };
});
