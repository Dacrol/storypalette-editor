import access from '../common/access.js';
import uiAuth from '../../common/uiAuth/index.js';
import uiDialog from '../../common/uiDialog/uiDialog.js';
import uiNotifications from '../../common/uiNotifications/notifications.js';

import uiBootstrap from 'angular-ui-bootstrap'; 

angular.module('sp.editor.palettes', [
  'sp.editor.common.access',

  'uiAuth',
  'uiDialog',
  'uiNotifications',
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

.controller('PaletteListCtrl', function($scope, allPalettes, palettes, access, $location, user, dialog, notifications) {
  $scope.palettes = access.filterRestrictedData(allPalettes);
  $scope.user = user;
  $scope.userFilter = '';

  $scope.filterPalettes = function(filter) {
    $scope.userFilter = (filter === 'user') ? user._id : '';
    $scope.organisationFilter = (filter === 'organisation') ? user.organisationId : '';
  };

  $scope.newPalette = function () {
    console.log('newPalette');
    palettes.newPalette().then(function(palette) {
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
        notifications.pushToast({message: 'Palett "' + palette.name + '" borttagen.', type: 'success'});

        // Remove palette from client array as well
        $scope.palettes.splice($scope.palettes.indexOf(palette), 1);
      });
    });
  };
})
;
