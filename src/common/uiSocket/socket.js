angular.module('uiSocket', [])


// Socket.io integration
// http://stackoverflow.com/questions/8588689/node-js-socket-io-client-connect-failed-event
.provider('socket', function() {

  return {
    // Provider methods intented for route/state resolves.
    requireConnection: function(socket) {
      return socket.connect();
    },

  // requireAuthenticatedConnection: function(socket, user) {
    requireAuthenticatedConnection: function(socket, namespace, room, token) {
      return socket.connect(namespace, room, token);
    },

    $get: function($rootScope, $q, $location) {
      var socketManager;         // socket namespace
      //var socket;            // the actual socket

      // Public API
      var api = {
        // Tries to connect to server.
        // Returns a promise that is resolved when connection is established
        connect: function(namespace, room, token) {
          console.log('socket.connectng to namespace=' + namespace + ' room=' + room + 'token=' + token.substr(0,5));
          var start = new Date().getTime();
          var deferred = $q.defer();

          //if (api.isConnected()) {
            //return $q.when({info: 'Already connected'});
          //}

          // connect to socket server
          socketManager = io.connect(namespace, {
            'query': 'token=' + token
          });

          // Wait for connect event.
          socketManager.on('connect', function() {
            console.log('socket connected! in ms:', new Date().getTime() - start);

            // Join a room!
            socketManager.emit('join', room);
            socketManager.on('onJoin', function(data) {
              console.log('User joined room ' + room);
              $rootScope.$apply(function () {
                deferred.resolve({info: 'Connected to ' + room});
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
