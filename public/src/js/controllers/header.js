'use strict';

angular.module('owsExplorerApp.controllers').controller('HeaderController', function($scope, $rootScope, $uibModal, SocketService, Block, NodeService, CurrencyService) {
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
    socket = SocketService.getSocket($scope);
    if (!socket) return;

    socket.emit('subscribe', 'inv');

    socket.on('block', function(block) {
      var blockHash = block.toString();
      _getBlock(blockHash);
    });
  };

  $rootScope.$on('Local/NodeChange', function(event, data) {
    $scope.node = data.newNode;
  });

  $rootScope.$on('Local/SocketChange', function(event) {
    _init();
  });

  $rootScope.getCurrencyConversion = function(value) {
    return CurrencyService.getCurrencyConversion(value);
  };

  $scope.openScannerModal = function() {
    var modalInstance = $uibModal.open({
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
