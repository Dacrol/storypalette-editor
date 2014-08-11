angular.module('sp.editor.palettes', [
  'uiSocket',
  'uiAuth'
])

.config(function($stateProvider, $locationProvider, authProvider, socketProvider, config) {
  // Select palette or create new
  $stateProvider.state('palettes', {
    url: '/palettes', 
    templateUrl: 'palettes/palettes.tpl.html',
    controller: 'PaletteListCtrl',
    resolve: {
      user: authProvider.requireUser,
      socketInfo: function(user, socket) {
        return socketProvider.requireAuthenticatedConnection(socket, user);
      },
      allPalettes: function(palettes) {
        return palettes.all();
      }
    }
  });
})

.controller('PaletteListCtrl', function ($scope, allPalettes, palettes, $location, user, dialog) {
  console.log('PaletteListCtrl user:', user);
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

  $scope.deletePalette = function (palette) {
    var title = 'Ta bort palett';
    var msg = 'Radera <strong>' + palette.name + '</strong> permanent?';
    var btns = [{result:'cancel', label: 'Nej, jag ångrar mig'}, {result:'ok', label: 'Ok, ta bort', cssClass: 'btn-danger'}];
    
    dialog.messageBox(title, msg, btns) 
      .open()
      .then(function(result) {
        if (result === 'ok') {
          palettes.deletePalette(palette._id).then(function () {
            console.log('Palette deleted');
            // Remove palette from client array as well
            $scope.palettes.splice($scope.palettes.indexOf(palette), 1);
          });
        }
      });
  };
})
;
