'use strict';

angular.module('explorer.address').controller('AddressController',
  function($scope, $rootScope, $routeParams, $location, Global, Address, socketService) {
    $scope.global = Global;

    var addrStr = $routeParams.addrStr;
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
      $scope.findOne();
    };

    $rootScope.$on('Local/SocketChange', function(event) {
      _init();
    });

    $scope.$on('$destroy', function() {
      _stopSocket();
    });

    var _startSocket = function() {
      socket.on('node/addresstxid', function(data) {
        if (data.address === addrStr) {
          $rootScope.$broadcast('tx', data.txid);
          var base = document.querySelector('base');
          var beep = new Audio(base.href + '/sound/transaction.mp3');
          beep.play();
        }
      });
      socket.emit('subscribe', 'node/addresstxid', [addrStr]);
    };

    var _stopSocket = function () {
      socket.emit('unsubscribe', 'node/addresstxid', [addrStr]);
    };

    $scope.findOne = function() {
      $rootScope.currentAddr = $routeParams.addrStr;
      _startSocket();

      Address.get({
          addrStr: $routeParams.addrStr
        },
        function(address) {
          $rootScope.titleDetail = address.addrStr.substring(0, 7) + '...';
          $rootScope.flashMessage = null;
          $scope.address = address;
        },
        function(e) {
          if (e.status === 400) {
            $rootScope.flashMessage = 'Invalid Address: ' + $routeParams.addrStr;
          } else if (e.status === 503) {
            $rootScope.flashMessage = 'Backend Error. ' + e.data;
          } else {
            $rootScope.flashMessage = 'Address Not Found';
          }
          $location.path('/');
        });
    };

    _init();

  });
