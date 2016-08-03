angular.module('sp.editor.edit.assetCtrl', [])

// Controller for individual assets in palette
// implied scope: $scope.$index; $scope.asset
.controller('AssetCtrl', function ($scope, palettes) {

  // Watch for changes made to the control value from the outside (from the palette interface)
  /* $scope.$watch(function() {
   return palettes.getControlValue($scope.$index)
   },
   function(newVal) {
   console.log('AssetCtrl.watch: ' + $scope.$index + ': controlValue: ', newVal);
   //palettes.setControlValue($scope.index, newVal);
   }); */
  $scope.isCollapsed = true;

  $scope.moveUp = function () {
    palettes.moveAssetUp($scope.$index);
  };

  $scope.moveDown = function () {
    palettes.moveAssetDown($scope.$index);
  };

  $scope.remove = function () {
    palettes.removeAsset($scope.$index);
  };
})
;
