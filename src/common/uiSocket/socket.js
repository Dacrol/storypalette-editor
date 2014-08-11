angular.module('uiSocket', [
])

// Socket.io integration
// http://stackoverflow.com/questions/8588689/node-js-socket-io-client-connect-failed-event
.provider('socket', function() {

  var getNamespace = function(user) {
    return '/' + user.organisation._id;
  };

  return {
    // Provider methods intented for route/state resolves.
    requireConnection: function(socket) {
      return socket.connect();
    },

    requireAuthenticatedConnection: function(socket, user) {
      console.log('socket.requireAuthenticatedConnection', user);
      var namespace = getNamespace(user);
      var roomName = user._id;
      return socket.connect(namespace, roomName, user);
    },

    /* TODO: Ugly. Hrrm... used to connect to Player computer
    requireAuthenticatedUserAndSocketConnectionToPlayer: function(securityAuthorization, socket, $http, $q) {
      return securityAuthorization.requireAuthenticatedUser()
      .then(function (user) {
        var namespace = getNamespace(user);
        return $http.get('/api/users/' + user._id + '/players').then(function (response) {
          var player = response.data[0];
          var roomName = player._id;
          return socket.connect(namespace, roomName, user);
        });
      });
    },
    */

    // The service singleton
    $get: function($rootScope, $q, $location) {
        var socketManager;         // socket namespace
        //var socket;            // the actual socket

        // Public API
        var api = {
            // Tries to connect to server.
            // Returns a promise that is resolved when connection is established
            connect: function(namespace, roomName, user) {
              console.log('socket connecting...', namespace, roomName, user);
              var start = new Date().getTime();
              var deferred = $q.defer();

              //if (api.isConnected()) {
                //return $q.when({info: 'Already connected'});
              //}

              // HACKY: Build connection url
              //var host = $location.host();  // 'localhost', 'storypalette.net', 'palette.uidev.se'

              // connect to socket server
              console.log('socket about to connect to: ' + namespace);
              socketManager = io.connect(namespace);
              //socketManager = io.connect('http://localhost');
              console.log('socket connecting to: ' + namespace);

              // Wait for connect event.
              socketManager.on('connect', function() {
                console.log('socket connected! in ms:', new Date().getTime() - start);

                // Join a room!
                socketManager.emit('join', roomName);
                socketManager.on('onJoin', function(data) {
                    console.log('User joined room ' + roomName);
                    $rootScope.$apply(function () {
                        deferred.resolve(user);
                    });
                });
              });

              return deferred.promise;
            },

            disconnect: function() {
              console.log('socket.disconnect()');
              socketManager.disconnect();
            },

            removeListeners: function () {
              console.log('socket.removeListeners');
              socketManager.removeAllListeners();
            },

            isConnected: function() {
              return !!socketManager;
            },

            on: function(eventName, callback) {
               if (api.isConnected()) {
                 socketManager.on(eventName, function() {
                    //console.log('socket.on: ', eventName);
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socketManager, args);
                    });
                  });
               } else {
                  console.log('socket failed to receive: ', eventName);
               }
            },

            emit: function(eventName, data, callback) {
              if (api.isConnected()) {
                socketManager.emit(eventName, data, function() {
                  //console.log('socket.emit: ', eventName);
                  var args = arguments;
                  $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socketManager, args);
                    }
                  });
                });
              } else {
                console.log('socket failed to emit: ', eventName);
              }
            }
          }; 
          return api;

        } // $get
      };
 })
 ;
