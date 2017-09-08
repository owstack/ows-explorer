'use strict';

angular.module('explorer.system').controller('NodeController',
  function($rootScope, $scope, $timeout, NodeManager) {

    NodeManager.whenAvailable(function(node) {
      $scope.availableNodes = NodeManager.getNodes();
      $rootScope.node = node;
    });

    $scope.setNode = function(id) {
      NodeManager.setNode(id);
      $rootScope.node = NodeManager.getNodeById(id);
    };

  });
