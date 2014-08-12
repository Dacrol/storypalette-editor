angular.module('sp.editor.edit', [
  'uiSocket',
  'uiAuth',
  'uiAudioPlayer',
  'uiDialog',
  'uiUtils',
  'uiNotifications'
])

.config(function($stateProvider, $locationProvider, authProvider, socketProvider, config) {

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

// Main Editor controller
// Palette variable is injected from route resolve, but we won't use it since Palettes stores it
.controller('EditCtrl', function ($scope, palettes, socket, $location,uiNotifications) {
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

// Palette controller
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


// List of Resources
.controller('ResourceListCtrl', function($scope, audioPlayer, palettes, resources, dialog) {
  $scope.isCollapsed = true;

  resources.all().then(function(data) {
    console.log('resources', data);
    $scope.resources = data;
  });

  $scope.iconClasses = {};
  $scope.iconClasses['sound'] = 'icon-music';
  $scope.iconClasses['image'] = 'icon-picture';
  $scope.iconClasses['light'] = 'icon-fire';

  // TODO: Move to app.config
  $scope.dialogOptions = {
    backdrop: true,
    backdropFade: true,
    dialogFade: true,
    keyboard: true,     // ESC to close
    templateUrl: 'edit/add-resource.tpl.html',
    controller: 'AddEditResourceCtrl',
    resolve: {resource: function() {return undefined;} }
  };

  $scope.typeFilter = '';

  $scope.filterResources = function(type) {
    $scope.typeFilter = type;
  };

  $scope.newResource = function () {
    openDialog();
  };

  $scope.editResource = function(resource) {
    // Autosave palette since we'll reload the route when saving resource
    palettes.saveCurrent();

    $scope.dialogOptions.resolve = {resource: function() {return resource;}};
    openDialog();
  };

  var openDialog = function () {
    var dialog = dialog.dialog($scope.dialogOptions);
    dialog.open().then(function(result) {
      if (result) {
        console.log('Dialog closed with result: ' + result);
      }
    });
  };
})

.controller('ResourceCtrl', function($scope, audioPlayer, palettes) {
  $scope.playMsg = 'play';
  $scope.isCollapsed = true;

  $scope.addToPalette = function(resource) {
    console.log('Adding ' + resource.name + ' to palette...');
    var a = palettes.addAsset(resource);
    console.log('Asset created: ', a);
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
  
  $scope.getClass = function() {
    return $scope.isPlaying ? 'icon-stop' : 'icon-play';
  };

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

  $scope.toggleSound = function (resource) {
    var url = resource.source.id + '.' + resource.source.extension;
    $scope.playMsg = ($scope.playMsg === 'play')?'stop':'play';
    audioPlayer.newSound('/sound/'+url);
    if ($scope.playMsg === 'stop'){
        audioPlayer.play('/sound/'+url);
    } else {
        audioPlayer.stop('/sound/'+url);
    }
  };

  $scope.fileUploadChange = function (element) {
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
