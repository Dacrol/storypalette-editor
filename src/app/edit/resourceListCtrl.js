angular.module('sp.editor.edit.resourceListCtrl', [
  'sp.editor.common.access'
])

.controller('ResourceListCtrl', function($scope, $state, access, audioPlayer, palettes, resources, dialog, $modal) {
  $scope.isCollapsed = true;

  resources.all().then(function(data) {
    // TODO Move filtering serverside
    $scope.resources = access.filterRestrictedData(data);
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