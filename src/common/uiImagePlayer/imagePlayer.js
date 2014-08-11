angular.module('uiImagePlayer', [])

// Basic image shower/hider with preload functionality
// TODO: Make this independent of Storypalette.
.factory('imagePlayer', function () {
  var images = [];
  var currentImageId;
  var progress = {
    loaded:0,
    count:0,
    done:true
  };
  var events = {};

  // Public API
  var service =  {
    preloadPaletteImages: function(palette) {
      angular.forEach(palette.assets, function (asset, idx) {
        if (asset.type === 'image') {
          progress.count++;
          progress.done = false;
          if (events.add) {
              events.add(progress);
          }
          var imageUrl = service.getImageUrl(asset);
          images[asset.source.id] = new Image();
          images[asset.source.id].src = imageUrl;
          images[asset.source.id].visible = false;   // our own property
          images[asset.source.id].onload = function() {
            progress.loaded++;
            progress.done = progress.loaded === progress.count;
            if (progress.done && events.done) {
                events.done(progress);
            }
            if (events.progress) {
                events.progress(progress);
            }
          };
        }
      });
    },

    getImageUrl: function(asset) {
        return '/image/' + asset.source.id + '.' + asset.source.extension;
    },

    // Delete all images and clear array
    reset: function() {
      images = [];
      progress = {
        loaded:0,
        count:0,
        done:true
      };
    },
    on: function(event, callback) {
      if (!(event instanceof Array)){
        event = [event];
      }
      for (var i=0;i<event.length;i++){
        events[event[i]] = callback;
      }
    }
  };

  return service;
});
