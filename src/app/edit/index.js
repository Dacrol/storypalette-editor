angular.module('sp.editor.edit', [
  'sp.editor.edit.editCtrl',
  'sp.editor.edit.paletteCtrl',
  'sp.editor.edit.assetCtrl',
  'sp.editor.edit.resourceCtrl',
  'sp.editor.edit.resourceListCtrl',

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

// Controller for adding and editing resources
// Used by modal dialog.
// If resource object is passed we'll go into edit mode
// http://plnkr.co/edit/ktfq0Y?p=preview
.controller('AddEditResourceCtrl', function ($scope, resources, Users, dialog, $state, resource, utils, audioPlayer, uiNotifications) {
  console.log('AddEditResourceCtrl', resource);

  $scope.isEditing = typeof(resource) === 'object';
  $scope.resource = $scope.isEditing ? resource : {};
  $scope.action = $scope.isEditing ? 'Redigera' : 'Lägg till';
  $scope.progress = '';
  $scope.source = false;
  $scope.playMsg = 'play';

  $scope.closeModal = function () {
    dialog.close();
  };

  // These should be in a config somewhere
  $scope.types = ['sound', 'image', 'light'];

  // TODO: Remove this hack once login/authentication is implemented
  // For now we just use the first available user
  Users.all().then(function (data) {
    $scope.users = data;
    $scope.resource.creatorId = $scope.users[0]._id;
  });

  $scope.deleteResource = function () {
    resources.remove($scope.resource).then(function () {
      var index = $scope.resources.indexOf(resource);
      $scope.resources.splice(index, 1);
    });
  };

  $scope.createResource = function () {
    console.log('Create resource raw: ', $scope.resource);
    if (typeof $scope.resource.tags === 'string'){
      $scope.resource.tags = $scope.resource.tags.split(',');
    }
    var tags = $scope.resource.tags ? $scope.resource.tags : [];
    for (var i = 0; i < tags.length; i++) {
      tags[i] = tags[i].trim();
    }
    $scope.resource.tags = tags;
    $scope.resource.created = new Date().getTime();
    $scope.resource.edited = new Date().getTime();

    resources.save($scope.resource).then(function (resource) {
      uiNotifications.pushToast({message: 'Resursen sparad', type: 'success'});

      // Update view and reload resources
      // TODO: Do we really need to do a full GET?
      // TODO: Does this work?
      $state.reload();
    });

    // TODO: We need to notify ResourcesCtrl about the new resource!
    dialog.close();
  };

  $scope.toggleSound = function(resource) {
    var url = resource.source.id + '.' + resource.source.extension;
    $scope.playMsg = ($scope.playMsg === 'play')?'stop':'play';
    audioPlayer.newSound('/sound/'+url);
    if ($scope.playMsg === 'stop'){
        audioPlayer.play('/sound/'+url);
    } else {
        audioPlayer.stop('/sound/'+url);
    }
  };

  $scope.fileUploadChange = function(element) {
    var file = element.files[0];
    if (!file) {return;}

    var name = file.name;
    var ext2type = {
      mp3:'sound',
      ogg:'sound',
      jpg:'image',
      gif:'image',
      jpeg:'image',
      png:'image'
    };
    var source = {
      name:name.substring(0,name.lastIndexOf('.')),
      id:utils.generateGUID(),
      extension:name.substring(name.lastIndexOf('.')+1).toLowerCase()
    };
    var type = ext2type[source.extension];
    if (!type) {
      $scope.progress = 'Otillåten filtyp';
      $scope.$apply();
      return;
    }
    $scope.resource.name = source.name;
    if (type === 'image' || type === 'sound'){
      $scope.label = source.name;
    }
    var xhr = new XMLHttpRequest();
    var upload = xhr.upload;
    $scope.progress = 'Laddar upp';
    $scope.$apply();
    upload.addEventListener("progress", function (ev) {
      if (ev.lengthComputable) {
        console.log((ev.loaded / ev.total) * 100 + "%");
        $scope.progress = 'Laddar upp, '+((ev.loaded / ev.total) * 100) + "% klar";
        $scope.$apply();
      }
    }, false);
    upload.addEventListener("load", function (ev) {
      $scope.progress = 'Uppladdning klar';
      $scope.resource.source = source;
      $scope.resource.type = type;
      $scope.$apply();
    }, false);
    upload.addEventListener("error", function (ev) {console.log(ev);}, false);
    xhr.open("POST","/file");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-File-Name", source.id+'.'+source.extension);
    xhr.send(file);
  };
})
;
