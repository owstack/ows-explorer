'use strict';

angular.module('explorer.currency').factory('Currency',
  function($resource, NodeManager) {
    var root = {};

    root.get = function(success, error) {
      var r = $resource(NodeManager.getNode().api + '/currency');
      r.get(success, error);
    };

    return root;
	}
);
