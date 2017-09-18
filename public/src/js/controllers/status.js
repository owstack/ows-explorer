'use strict';

angular.module('explorer.status').controller('StatusController',
  function($rootScope, $scope, $routeParams, $location, Global, Status, Sync, socketService, Version) {
    $scope.global = Global;

    var socket;

    var _init = function() {
      socket = socketService.getSocket($scope);

      if (!socket.isConnected()) {
        socket.on('connect', function() {
          _startSocket();
          _refresh();
        });
      } else {
        _startSocket();
        _refresh();
      }
    };

    var _refresh = function() {
      $scope.getStatus('Info');
      $scope.getStatus('LastBlockHash');
      $scope.getSync();
      $scope.version = _getVersion();
    };

    $rootScope.$on('Local/SocketChange', function(event) {
      _init();
    });

    $scope.getStatus = function(q) {
      Status.get({
        query: 'get' + q
      },
      function(d) {
        $scope.loaded = 1;
        angular.extend($scope, d);
      },
      function(e) {
        $scope.error = 'API ERROR: ' + e.data;
      });
    };

    $scope.humanSince = function(time) {
      var m = moment.unix(time / 1000);
      return m.max().fromNow();
    };

    var _onSyncUpdate = function(sync) {
      $scope.sync = sync;
    };

    var _startSocket = function () {
      socket.emit('subscribe', 'sync');
      socket.on('status', function(sync) {
        _onSyncUpdate(sync);
      });
    };
    
    $scope.getSync = function() {
      Sync.get(
        function(sync) {
          _onSyncUpdate(sync);
        },
        function(e) {
          var err = 'Could not get sync information' + e.toString();
          $scope.sync = {
            error: err
          };
        });
    };

    var _getVersion = function() {
      Version.get({},
        function(res) {
          $scope.version = res.version;
        });
    };

    _init();
    
  });
