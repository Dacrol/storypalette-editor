angular.module('sp.editor.common.palettes', [
  'sp.editor.common.config', 
  'spUtils',
  'uiAuth'
])

.factory('palettes', function($http, utils, auth, config) {
  // Palette being currently edited or played
  var currentPalette;
  var apiBase = config.apiBase + 'palettes/'; // http://api.storypalette.net/palettes

  // Move "private" methods our here
  var create = function(palette) {
    console.log('Creating palette: ' + palette.name);
    return $http.post(apiBase, palette).then(function(response) {
      console.log('got response from create', response);
      return response.data;
    });
  };

  var update = function(palette) {
    console.log('Updating palette: ' + palette.name);
    return $http.put(apiBase + palette._id, palette).then(function (response) {
      return response.data;   // {result: 1}
    });
  };

  // Public API
  var service = {
    setName: function(name) {
      currentPalette.name = name;
    },
    getPalette: function() {
      return currentPalette;
    },
    setValue: function(assetId, value) {
      currentPalette.assets[assetId].value = value;
    },

    // Use this palette
    setPalette: function(newPalette) {
      currentPalette = newPalette;
    },

    // Create new palette
    // If srcPalette is provided, copy properties of srcPalette to new palette
    // Returns a promise that will resolve with the new palette
    newPalette: function(srcPalette) {
      if (srcPalette) {
        currentPalette = angular.copy(srcPalette);
        currentPalette.name = 'Kopia av ' + currentPalette.name;
        delete currentPalette._id;
      } else {
        currentPalette = {
          name: 'Ny palett',
          created: new Date().getTime(),
          edited: new Date().getTime(),
          creatorId: auth.getCurrentUser()._id,
          assets: []
        };
      }
      return service.saveCurrent();
    },

    all: function() {
      //console.log('Get all palettes...');
      return $http.get(apiBase).then(function(res) {
        return res.data;
      });
    },

    // Returns a promise
    one: function(id) {
      console.log('Get palette with id: ' + id);
      // TODO: what is returned here?
      return $http.get(apiBase + id)
        .then(function(response) {
          return response.data;
        })
        .then(function(rawPalette) {
          // Create empty value for all assets
          angular.forEach(rawPalette.assets, function(asset) {
            asset.value = {raw: 0};
          });
          return rawPalette;
        });
    },

    saveCurrent: function() {
      if (currentPalette._id) {
        return update(currentPalette);
      } else {
        return create(currentPalette);
      }
    },

    deletePalette: function(id) {
      return $http.delete(apiBase + id).then(function(res) {
        return res;
      });
    },
    moveAssetUp: function(index) {
      currentPalette.assets = utils.moveInArray(currentPalette.assets, index, index - 1);
    },
    moveAssetDown: function(index) {
      currentPalette.assets = utils.moveInArray(currentPalette.assets, index, index + 1);
    },
    removeAsset: function(index) {
      currentPalette.assets.splice(index, 1);
    },
    addAsset: function(resource) {
      var asset = angular.copy(resource);
      delete asset._id;

      asset.id = utils.generateGUID();
      asset.resourceId = resource._id;
      asset.value = {raw: 0};

      currentPalette.assets.unshift(asset);
      return asset;
    }
  };
  return service;
});
