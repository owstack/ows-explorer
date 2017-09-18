'use strict';

angular.module('explorer.system').controller('HeaderController',
  function($scope, $rootScope, $modal, socketService, Global, Block, NodeManager) {
    $scope.global = Global;
    $rootScope.isCollapsed = true;

    $scope.menu = [{
      'title': 'Blocks',
      'link': 'blocks'
    }, {
      'title': 'Status',
      'link': 'status'
    }];

    var socket;

    var _init = function() {
      socket = socketService.getSocket($scope);

      socket.emit('subscribe', 'inv');

      socket.on('block', function(block) {
        var blockHash = block.toString();
        _getBlock(blockHash);
      });
    };

    $rootScope.$on('Local/SocketChange', function(event) {
      _init();
    });

    $scope.openScannerModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'scannerModal.html',
        controller: 'ScannerController'
      });
    };

    var _getBlock = function(hash) {
      Block.get({
        blockHash: hash
      },
      function(res) {
        $scope.totalBlocks = res.height;
      });
    };

    _init();

  });
