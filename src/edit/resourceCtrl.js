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
    var url = config.apiBase + 'sound/' + resource.source.id + '/' + 'ogg';
    $scope.playMsg = ($scope.playMsg === 'play') ? 'stop':'play';
    audioPlayer.newSound(url, {format: 'ogg'});
    if ($scope.playMsg === 'stop'){
      audioPlayer.play(url);
    } else {
      audioPlayer.stop(url);            
    }
  };
      
  $scope.getClass = function() {
    return $scope.isPlaying ? 'icon-stop' : 'icon-play';
  };
  
})
;
