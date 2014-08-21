angular.module('sp.editor.edit.editCtrl', [])

// Main Editor controller
// Palette variable is injected from route resolve, but we won't use it since Palettes stores it
.controller('EditCtrl', function($scope, palettes, $location,uiNotifications) {
  // Palette is loaded when page is loaded
  $scope.palette = palettes.getPalette();
})
;
