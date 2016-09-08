angular.module('sp.editor.admin.usersCtrl', [])

.controller('UsersCtrl', function($scope, users, allUsers, allOrganisations, $state) {

  // From resolve.
  $scope.users = allUsers; 
  $scope.organisations = allOrganisations; 

  $scope.getOrganisationName = function(user) {
    return _.find($scope.organisations, {_id: user.organisationId}).name;
  };

  $scope.roles = ['user', 'admin', 'player'];

  $scope.newUser = {
    username: 'test',
    password: 'test',
    role: $scope.roles[0],
    firstname: 'Testo',
    lastname: 'Testosteronsson',
    organisationId: $scope.organisations[0]._id,
    email: 'testo@testo.com' 
  };

  $scope.addUser = function() {
    users.create($scope.newUser).then(function() {
      console.log('user created. refreshing...'); 
      $state.reinit();
    });
  };

  $scope.removeUser = function(user) {
    users.remove(user._id).then(function() {
      $state.reinit();
    });
  };

})
;
