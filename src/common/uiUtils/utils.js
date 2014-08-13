angular.module('uiUtils', [])

// Collection of utility functions
.factory('utils', function($http) {
  var api = {

    // Socket utils. 
    getSocketNamespace: function(user) {
      return '/' + user.organisation._id;
    },
    getSocketRoom: function(user) {

      if (user.role === 'player') {
        return user._id;  
      } else {
        // TODO: Temp hardcoded: ui-hq
        return '51ac6ecbf54d7d411c000002';
        // Connect to player room. 
        /*
        return $http.get('http://api.storypalette.dev:8888/v1/users/' + user._id + '/players').then(function(res) {
          var player = res.data[0];
          console.log('Got player', player, 'for user', user);
          var roomName = player._id;
          return roomName;
        });
        */
      }
    },

    // Move element within array
    moveInArray: function (arr, from, to) {
      //console.log('Before: ', arr, from, to);
      // More than one element, different positions, within range
      if (arr.length > 1 && from !== to && to >= 0 && to < arr.length) {
        var i, tmp;
        // save element from position 1
        tmp = arr[from];
        // move element down and shift other elements up
        if (from < to) {
          for (i = from; i < to; i++) {
              arr[i] = arr[i + 1];
          }
        }
        // move element up and shift other elements down
        else {
          for (i = from; i > to; i--) {
            arr[i] = arr[i - 1];
          }
        }
        // put element in destination position
        arr[to] = tmp;
      }
      //console.log('After: ', arr);
      return arr;
    },
    generateGUID: function() {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4();
    }
  };

  return api;

});
