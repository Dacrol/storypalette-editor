angular.module('sp.editor.palettes', [
  'uiAuth',
  'spUtils',

  'uiDialog',
  'ui.bootstrap'
])

.config(function($stateProvider, $locationProvider, authProvider, config) {
  // Select palette or create new
  $stateProvider.state('user.palettes', {
    url: '/palettes', 
    templateUrl: 'palettes/palettes.tpl.html',
    controller: 'PaletteListCtrl',
    resolve: {
      allPalettes: function(palettes) {
        return palettes.all();
      }
    }
  });
})

.controller('PaletteListCtrl', function ($scope, allPalettes, palettes, $location, user,dialog, utils, auth, info) {
  console.log('PaletteListCtrl user:', user);

  console.log('socket info', info);

  $scope.palettes = allPalettes;
  $scope.userFilter = '';

  $scope.filterPalettes = function(filter) {
    $scope.userFilter = (filter === 'user') ? user._id : '';
  };

  $scope.newPalette = function () {
    palettes.newPalette().then(function (palette) {
      $location.path('/palettes/' + palette._id);
    });
  };

  $scope.duplicatePalette = function (srcPalette, $index) {
    palettes.newPalette(srcPalette).then(function (palette) {
        $location.path('/palettes/' + palette._id);
    });
  };

  $scope.deletePalette = function(palette) {
    dialog.confirm({
      title: 'Ta bort palett',
      message: 'Vill du ta bort "' + palette.name + '"?'
    }).then(function ok() {
      palettes.deletePalette(palette._id).then(function() {
        // Remove palette from client array as well
        $scope.palettes.splice($scope.palettes.indexOf(palette), 1);
      });
    });
  };
})
;
