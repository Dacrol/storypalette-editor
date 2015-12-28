angular.module('sp.editor.edit.addEditResourceCtrl', [])

// Controller for adding and editing resources
// Used by modal dialog.
// If resource object is passed we'll go into edit mode
// http://plnkr.co/edit/ktfq0Y?p=preview
.controller('AddEditResourceCtrl', function($scope, resources, auth, $modalInstance, $state, resource, utils, audioPlayer, notifications, config) {
  console.log('AddEditResourceCtrl', resource);
  console.log('AddEditResourceCtrl config', config);

  // TODO is current user available somewhere?
  var currentUser = auth.getCurrentUser();

  $scope.isEditing = typeof(resource) === 'object';
  $scope.resource = $scope.isEditing ? resource : {};
  $scope.action = $scope.isEditing ? 'Redigera' : 'Lägg till';
  $scope.progress = '';
  $scope.source = false;
  $scope.imagefound = $scope.isEditing;
  $scope.playMsg = 'play';
  $scope.types = ['sound', 'image', 'light'];
  $scope.apiBase = config.apiBase;

  $scope.restrictOptions = [
    {
      label: 'Alla',
      value: null
    },
    {
      label: currentUser.organisation.name,
      value: {
        type: 'organisation',
        id:   currentUser.organisationId
      }
    }
  ];

  // Creator
  $scope.resource.creatorId = currentUser._id;

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.deleteResource = function() {
    resources.remove($scope.resource);
    $modalInstance.close();
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

    // FIXME går inte att uppdatera resurser?
    resources.save($scope.resource).then(function (resource) {
      notifications.pushToast({message: 'Resursen sparad', type: 'success'});

      // Update view and reload resources
      // TODO: Do we really need to do a full GET?
      // TODO: Does this work?
      $state.reload();
    });

    // TODO: We need to notify ResourcesCtrl about the new resource!
    $modalInstance.close();
  };

  $scope.toggleSound = function(resource) {
    var url = $scope.apiBase + 'sound/' + resource.source.id + '/' + resource.source.extension;
    $scope.playMsg = ($scope.playMsg === 'play') ? 'stop':'play';
    audioPlayer.newSound(url);
    if ($scope.playMsg === 'stop'){
        audioPlayer.play(url);
    } else {
        audioPlayer.stop(url);
    }
  };

  $scope.fileUploadChange = function(element) {
    var url = config.apiBase + 'file';
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
      name: name.substring(0,name.lastIndexOf('.')),
      id: utils.generateGUID(),
      extension: name.substring(name.lastIndexOf('.')+1).toLowerCase()
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

      if (type != 'image') {
        $scope.progress = 'Uppladdning klar';
        $scope.resource.source = source;
        $scope.resource.type = type;
        $scope.$apply();
      }
      else {
        // wait till image is loaded
        var pollImage = new Image();

        $scope.progress = 'Uppladdning klar. Det kan ibland dröja något innan bilden är visningsklar.';
        $scope.resource.found = true;
        $scope.$apply();

        pollImage.onload = function () {
          window.clearInterval(timer);
          $scope.progress = 'Uppladdning klar';
          $scope.resource.source = source;
          $scope.resource.type = type;
          $scope.imagefound = true;
          console.log($scope);
          $scope.$apply();
        };

        var timer = window.setInterval(function () {
          console.log('sending the request again');
          pollImage.src = $scope.apiBase + "image/" + source.id + "." + source.extension;
        }, 2000);

      }

    }, false);
    upload.addEventListener("error", function (ev) {console.log(ev);}, false);
    xhr.open("POST", url);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-File-Name", source.id + '.' + source.extension);
    xhr.send(file);
  };
});
