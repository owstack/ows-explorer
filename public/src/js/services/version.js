'use strict';

angular.module('owsExplorerApp.services').factory('Version', function($resource, NodeService) {
  var root = {};

  root.get = function(success, error) {
    NodeService.whenAvailable(function() {
	    var r = $resource(NodeService.getNode().api + '/version');
	    r.get(success, error);
	  });
  };

  return root;
});
