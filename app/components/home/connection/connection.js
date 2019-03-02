'use strict';

angular.module('owsExplorerApp.controllers').controller('ConnectionController', function($rootScope, $scope, $window, Status, SocketService, PeerSync, NodeService) {
  // Set initial values
  $scope.statusUpdate = false;
  $scope.errorAlertDismissed = false;
  $scope.apiOnline = true;
  $scope.serverOnline = true;
  $scope.clientOnline = true;

  var socket;

  var _init = function() {
    socket = SocketService.getSocket($scope);
    if (!socket) return;

    socket.on('connect', function() {
      $scope.serverOnline = true;
      socket.on('disconnect', function() {
        $scope.serverOnline = false;
        $scope.errorAlertDismissed = false;
      });
      _refresh();
    });

    socket.emit('subscribe', 'sync');
    socket.on('status', function(sync) {
      $scope.sync = sync;
      $scope.apiOnline = (sync.status !== 'aborted' && sync.status !== 'error');
    });
  };

  var _refresh = function() {
    $scope.getConnStatus();
  };

  $rootScope.$on('Local/SocketChange', function(event) {
    _init();
  });

  $scope.closeErrorAlert = function() {
    $scope.errorAlertDismissed = true;
  };

  $scope.closeInfoAlert = function() {
    $scope.statusUpdate = false;
  };

  // Check for the  api connection
  $scope.getConnStatus = function() {
    $scope.connectedNode = NodeService.getNode();

    PeerSync.get({},
      function(peer) {
        $scope.apiOnline = peer.connected;
        $scope.statusUpdate = true;
      },
      function() {
        $scope.apiOnline = false;
        $scope.errorAlertDismissed = false;
      });
  };

  // Check for the client connection
  $window.addEventListener('offline', function() {
    $scope.$apply(function() {
      $scope.clientOnline = false;
      $scope.errorAlertDismissed = false;
    });
  }, true);

  $window.addEventListener('online', function() {
    $scope.$apply(function() {
      $scope.clientOnline = true;
      $scope.statusUpdate = true;
    });
  }, true);

  _init();

});
