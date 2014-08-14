angular.module('sp.editor.edit.resourceListCtrl', [])

.controller('ResourceListCtrl', function($scope, audioPlayer, palettes, resources, dialog) {
  $scope.isCollapsed = true;

  resources.all().then(function(data) {
    $scope.resources = data;
  });

  $scope.iconClasses = {};
  $scope.iconClasses['sound'] = 'icon-music';
  $scope.iconClasses['image'] = 'icon-picture';
  $scope.iconClasses['light'] = 'icon-fire';

  // TODO: Move to app.config
  $scope.dialogOptions = {
    backdrop: true,
    backdropFade: true,
    dialogFade: true,
    keyboard: true,     // ESC to close
    templateUrl: 'edit/add-resource.tpl.html',
    controller: 'AddEditResourceCtrl',
    resolve: {resource: function() {return undefined;} }
  };

  $scope.typeFilter = '';

  $scope.filterResources = function(type) {
    $scope.typeFilter = type;
  };

  $scope.newResource = function () {
    openDialog();
  };

  $scope.editResource = function(resource) {
    // Autosave palette since we'll reload the route when saving resource
    palettes.saveCurrent();

    $scope.dialogOptions.resolve = {resource: function() {return resource;}};
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
