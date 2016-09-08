import btFordSocketIo from 'angular-socket-io';

angular.module('spConnection', [
  'btford.socket-io'
])

// Storypalette socket utils - wraps btfords implemenetation.
.provider('connection', function() {
  return {

  // requireAuthenticatedConnection: function(socket, user) {
    requireRoomConnection: function(socket, namespace, room, token) {
      return socket.requireRoomConnection(namespace, room, token);
    },

    $get: function($rootScope, $q, $location, socketFactory) {

      var api = {
        connect: function(ns, room, token) {
          console.log('Socket connecting...', ns, room, token.substr(0,3));
          var ioSocket = io.connect(ns, {
            query: 'token=' + token,
            forceNew: true  // important! :)
          });

          return socketFactory({
            ioSocket: ioSocket
          });
        },

        // Returns a promise that is resolved when 'onJoin' is received.
        // TODO: Timeout rejects promise? 
        requireRoomConnection: function(ns, room, token) {
          var start = new Date().getTime();
          var deferred = $q.defer();

          var socket = api.connect(ns, room, token);

          socket.on('connect', function() {
            console.log('Socket connected in:', new Date().getTime() - start, 'ms');
            // Join a room!
            socket.emit('join', room);
            socket.on('onJoin', function() {
              console.log('Socket joined room ' + room);
              deferred.resolve(socket);
            });
          });

          return deferred.promise;
        }
      }; 
      return api;

      } // $get
    };
 })
 ;
