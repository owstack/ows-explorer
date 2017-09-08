'use strict';

angular.module('explorer.currency').factory('Currency',
  function($resource, NodeManager) {
    return $resource(NodeManager.getNode().api + '/currency');
});
