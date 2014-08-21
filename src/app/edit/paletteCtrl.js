angular.module('sp.editor.edit.paletteCtrl', [])

.controller('PaletteCtrl', function ($scope, $location, palettes, uiNotifications) {
  $scope.run = function () {
    $location.path('/play/' + $scope.palette._id);
  };

  $scope.savePalette = function () {
    palettes.saveCurrent().then(function () {
      uiNotifications.pushToast({message: 'Palett "' + $scope.palette.name + '" sparad.', type: 'success'});
    });
  };
})
;
