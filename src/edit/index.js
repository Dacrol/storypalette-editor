import template from './edit.tpl.html';
import '../header/header.tpl.html';

import editCtrl from './editCtrl.js';
import paletteCtrl from './paletteCtrl.js'
import assetCtrl from './assetCtrl.js';
import resourceCtrl from './resourceCtrl.js';
import resourceListCtrl from './resourceListCtrl';
import addEditResourceCtrl from './addEditResourceCtrl.js';

import config from '../common/config.js';

import uiAuth from '../common/uiAuth/index.js';
import uiAudioPlayer from '../common/uiAudioPlayer/audioPlayer.js';
import uiDialog from '../common/uiDialog/uiDialog.js';
import utils from  '../common/spUtils/utils.js';
import uiNotifications from '../common/uiNotifications/notifications.js';



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
    templateUrl: template,
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
