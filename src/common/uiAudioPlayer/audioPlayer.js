angular.module('uiAudioPlayer', [])

// Audio play service based on howler.js
// TODO: Error handling and argument checking
// TODO: Wrap howler and inject it.
.factory('audioPlayer', function () {
  var sounds = [];
  var progressInit = {
    loaded: 0,
    count: 0,
    done: true
  };
  var progress = angular.copy(progressInit);
  var events = {};

  // Public API
  var service =  {
    newSound: function(url, options) {
      //console.log('AudioPlayer.newSound:', url, options);

      var id = url;

      if (sounds[id]) {
        return false;
      }
      options = options || {};
      options.urls = [url];
      sounds[id] = new Howl(options);

      // Progress handling
      progress.count++;
      progress.done = false;
      if (events.add) {
        events.add(progress);
      }
      sounds[id]._onload.push(function () {
        progress.loaded++;
        progress.done = (progress.loaded === progress.count);
        if (events.progress) {
            events.progress(progress);
        }
      });
      return true;
    },
    printSounds: function() {
      angular.forEach(sounds, function(sound) {
        console.log('* ', sound._src);
      });
    },

    // Delete all sounds and clear array
    reset: function () {
      console.log("Audioplayer.reset");
      Object.keys(sounds).forEach(function (id) {
          sounds[id].unload();  // stop and destroy
          delete sounds[id];
      });
      sounds = [];

      // reset progress
      progress = angular.copy(progressInit);
    },
    play: function (id) {
      console.log('AudioPlayer.play', id);
      sounds[id].play();
    },
    stop: function (id) {
      console.log('AudioPlayer.stop', id);
      sounds[id].stop();
    },
    // Volume 0.0-1.0
    setVolume: function (id, volume) {
      //console.log('AudioPlayer.setVolume', id, volume);
      sounds[id].volume(volume);
    },
    on: function(event, callback){
      if (!(event instanceof Array)){
        event = [event];
      }
      for (var i = 0; i < event.length; i++){
        events[event[i]] = callback;
      }
    }
  };

  return service;
});
