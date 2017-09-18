'use strict';

var ScopedSocket = function(socket, $rootScope, $timeout) {
  this.socket = socket;
  this.$rootScope = $rootScope;
  this.$timeout = $timeout;
  this.listeners = [];
};

ScopedSocket.prototype.isConnected = function() {
  return this.socket.connected;
};

ScopedSocket.prototype.disconnect = function() {
  this.socket.disconnect();
};

ScopedSocket.prototype.removeAllListeners = function(opts) {
  if (!opts) opts = {};
  for (var i = 0; i < this.listeners.length; i++) {
    var details = this.listeners[i];
    if (opts.skipConnect && details.event === 'connect') {
      continue;
    }
    this.socket.removeListener(details.event, details.fn);
  }
  this.listeners = [];
};

ScopedSocket.prototype.on = function(event, callback) {
  var socket = this.socket;
  var $rootScope = this.$rootScope;

  var wrapped_callback = function() {
    var args = arguments;
    $rootScope.$apply(function() {
      callback.apply(socket, args);
    });
  };
  socket.on(event, wrapped_callback);

  this.listeners.push({
    event: event,
    fn: wrapped_callback
  });
};

ScopedSocket.prototype.emit = function(event, data, callback) {
  var socket = this.socket;
  var $rootScope = this.$rootScope;
  var args = Array.prototype.slice.call(arguments);

  args.push(function() {
    var args = arguments;
    $rootScope.$apply(function() {
      if (callback) {
        callback.apply(socket, args);
      }
    });
  });

  socket.emit.apply(socket, args);
};

angular.module('explorer.socket').factory('socketService',
  function($rootScope, $timeout, NodeManager) {
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
      scopedSocket.removeAllListeners();
      $timeout(function() {
        scopedSocket.disconnect();
        callback();
      }, 100);
    };

    $rootScope.$on('Local/NodeChange', function(event, node) {
      _disconnect(function() {
        _connect(node);
        $rootScope.$emit('Local/SocketChange');
      });
    });

    root.getSocket = function(scope) {
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

    // Establish initial connection without sending an event.
    _connect(NodeManager.getNode());

    return root;

  });
