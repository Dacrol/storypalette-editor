angular.module('sp.editor.edit.editCtrl', [])

// Main Editor controller
// Palette variable is injected from route resolve, but we won't use it since Palettes stores it
.controller('EditCtrl', function($scope, palettes, socket, $location,uiNotifications) {
  // Palette is loaded when page is loaded
  $scope.palette = palettes.getPalette();
  $scope.valueUpdate = false;

  // Let any previewing performer know that we're editing a palette
  socket.emit('activePalette', $scope.palette);

  $scope.$watch('palette', function (newPalette, oldPalette) {
    //console.log('WATCH ' + ($scope.i++))
    if (!$scope.valueUpdate) {
      socket.emit('paletteUpdate', $scope.palette);
    } else {
      $scope.valueUpdate = false;
    }
  }, true);

  // Notify Performer if we navigate away (no palette active)
  $scope.$on('$locationChangeStart', function (event, next, current) {
      socket.emit('paletteDeactivate');
  });

  // Incoming: Palette value has been updated by Palette Interface
  socket.on('onValueUpdate', function (data) {
    //console.log('EditCtrl.onValueUpdate: ', data.paletteId, data.assetId, data.value);
    $scope.valueUpdate = true;
    $scope.palette.assets[data.assetId].value.raw = data.value.raw;
    //palettes.setValue(data.assetId, data.value);
  });

  // Performer in Preview mode wants to, ehm, preview the palette we're editing
  socket.on('onRequestPalette', function () {
    socket.emit('activePalette', $scope.palette);
  });
})
;
