'use strict';

angular.module('explorer.connection').controller('ConnectionController',
  function($rootScope, $scope, $timeout, $window, Status, socketService, PeerSync, NodeManager) {

    // Set initial values
    $scope.closeAlert = true;
    $scope.apiOnline = true;
    $scope.serverOnline = true;
    $scope.clientOnline = true;

    var socket;

    var _init = function() {
      socket = socketService.getSocket($scope);

      socket.on('connect', function() {
        $scope.serverOnline = true;
        socket.on('disconnect', function() {
          $scope.serverOnline = false;
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

      // Auto close alert after a few seconds
      $scope.closeAlert = false;
      $timeout(function() {
        $scope.closeAlert = true;
      }, 3000);
    };

    $rootScope.$on('Local/SocketChange', function(event) {
      _init();
    });

    // Check for the  api connection
    $scope.getConnStatus = function() {
      $scope.connectedNode = NodeManager.getNode();

      PeerSync.get({},
        function(peer) {
          $scope.apiOnline = peer.connected;
        },
        function() {
          $scope.apiOnline = false;
        });
    };

    // Check for the client connection
    $window.addEventListener('offline', function() {
      $scope.$apply(function() {
        $scope.clientOnline = false;
      });
    }, true);

    $window.addEventListener('online', function() {
      $scope.$apply(function() {
        $scope.clientOnline = true;
      });
    }, true);

    _init();

  });
