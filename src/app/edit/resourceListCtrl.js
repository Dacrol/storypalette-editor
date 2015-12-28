angular.module('sp.editor.edit.resourceListCtrl', [])

.controller('ResourceListCtrl', function($scope, $state, auth, audioPlayer, palettes, resources, dialog, $modal) {
  $scope.isCollapsed = true;

  // TODO is current user available somewhere?
  var currentUser = auth.getCurrentUser();

  resources.all().then(function(data) {
    // TODO Move filtering serverside
    $scope.resources = data.filter(function(resource) {
      if (!resource.restrict) {
        return true;
      }

      switch (resource.restrict.type) {
        case 'organisation':
          return resource.restrict.id === currentUser.organisationId;
        case 'user':
          return resource.restrict.id === currentUser._id;
        default:
          return true;
      }
    });
  });

  console.log(angular.version);

  $scope.iconClasses = {
    sound: 'icon-music',
    image: 'icon-picture',
    light: 'icon-fire'
  };

  $scope.typeFilter = '';

  $scope.filterResources = function(type) {
    $scope.typeFilter = type;
  };

  var dialogOptions = {
    templateUrl: 'edit/addEditResource.tpl.html',
    controller: 'AddEditResourceCtrl',
    resolve: {resource: function() {return undefined;} }
  };

  var loginDialog;

  $scope.newResource = function(resource) {
    dialogOptions.resolve =  {resource: function() {return undefined;}};
    loginDialog = $modal.open(dialogOptions);
  };

  $scope.editResource = function(resource) {
    // Autosave palette since we'll reload the route when saving resource
    palettes.saveCurrent();

    dialogOptions.resolve = {resource: function() {return resource;}};
    openDialog();
  };

  var openDialog = function () {
    console.log(dialog);
    dialog.dialog(dialogOptions, function() {
      console.log('reloading page');
      $state.go($state.current, {}, {reload: true});
    });
  };
})
;