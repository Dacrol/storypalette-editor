angular.module('sp.editor.edit', [
  'sp.editor.edit.editCtrl',
  'sp.editor.edit.paletteCtrl',
  'sp.editor.edit.assetCtrl',
  'sp.editor.edit.resourceCtrl',
  'sp.editor.edit.resourceListCtrl',
  'sp.editor.edit.addEditResourceCtrl',

  'sp.editor.common.config',

  'uiAuth',
  'uiAudioPlayer',
  'uiDialog',
  'spUtils',
  'uiNotifications'
])

.config(function($stateProvider, $locationProvider, authProvider, config) {

  // Edit a palette
  $stateProvider.state('user.editor', {
    url: '/palettes/:paletteId',
    templateUrl: 'edit/edit.tpl.html',
    controller: 'EditCtrl',
    resolve: {
      palette: function(palettes, $stateParams) {
        var paletteId = $stateParams['paletteId'];
        return palettes.one(paletteId).then(function(palette) {
          palettes.setPalette(palette);
          return palette;  // not really used
        });
      }
    }
  });
})
;
