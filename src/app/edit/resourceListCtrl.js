angular.module('sp.editor.edit.resourceListCtrl', [])

.controller('ResourceListCtrl', function($scope, audioPlayer, palettes, resources, dialog, $modal) {
  $scope.isCollapsed = true;

  resources.all().then(function(data) {
    $scope.resources = data;
  });

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

  $scope.newResource = function() {
    loginDialog = $modal.open(dialogOptions);
  };

  $scope.editResource = function(resource) {
    // Autosave palette since we'll reload the route when saving resource
    palettes.saveCurrent();

    dialogOptions.resolve = {resource: function() {return resource;}};
    openDialog();
  };

  var openDialog = function () {
    var dialog = dialog.dialog($scope.dialogOptions);
    dialog.open().then(function(result) {
      if (result) {
        console.log('Dialog closed with result: ' + result);
      }
    });
  };
})
;
