angular.module('sp.editor.edit.resourceCtrl', [])

.controller('ResourceCtrl', function($scope, audioPlayer, palettes, config) {
  $scope.playMsg = 'play';
  $scope.isCollapsed = true;

  $scope.addToPalette = function(resource) {
    console.log('Adding ' + resource.name + ' to palette...');
    var a = palettes.addAsset(resource);
    console.log('Asset created: ', a);
  };

  $scope.toggleSound = function(resource) {
    var url = config.apiBase + 'sound/' + resource.source.id + '/' + resource.source.extension;
    $scope.playMsg = ($scope.playMsg === 'play') ? 'stop':'play';
    audioPlayer.newSound(url, {format: resource.source.extension});
    if ($scope.playMsg === 'stop'){
      audioPlayer.play(url);
    } else {
      audioPlayer.stop(url);            
    }
  };
  
  $scope.dropCallback = function(event, index, item, external, type, allowedType) {
    console.log('test');
    return false;
  };
    
  $scope.getClass = function() {
    return $scope.isPlaying ? 'icon-stop' : 'icon-play';
  };
  
    $scope.dropCallback = function(event, index, item, external, type, allowedType) {
    console.log('test');
    return false;
  };
})
;
