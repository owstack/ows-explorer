'use strict';

angular.module('owsExplorerApp.services').factory('SocketService', function($rootScope, $timeout, NodeService) {
  var root = {};
  var socket;
  var scopedSocket;

  var _connect = function(node) {
    socket = io.connect(node.url, {
      'reconnect': true,
      'reconnection delay': 500
    });
  };

  var _disconnect = function(callback) {
    if (scopedSocket) {
      scopedSocket.removeAllListeners();
      $timeout(function() {
        scopedSocket.disconnect();
        callback();
      }, 100);
    } else {
      callback();
    }
  };

  $rootScope.$on('Local/NodeChange', function(event, data) {
    // Only re-establish socket if node has really changed.
    if (data.oldNode != data.newNode) {
      _disconnect(function() {
        _connect(data.newNode);
        $rootScope.$emit('Local/SocketChange');
      });
    }
  });

  root.getSocket = function(scope) {
    // Return if no socket connected.
    if (!socket) return null;

    scopedSocket = new ScopedSocket(socket, $rootScope, $timeout);

    scope.$on('$destroy', function() {
      scopedSocket.removeAllListeners();
    });

    socket.on('connect', function() {
      scopedSocket.removeAllListeners({
        skipConnect: true
      });
    });

    return scopedSocket;
  };

  return root;

});
