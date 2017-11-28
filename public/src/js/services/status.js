'use strict';

angular.module('owsExplorerApp.services').factory('Status', function($resource, NodeService) {
  var root = {};

  root.get = function(params, success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/status', {q: '@q'});
      r.get({q: params.query}, success, error);
    });
  };

  return root;
})
.factory('Sync', function($resource, NodeService) {
  var root = {};

  root.get = function(success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/sync');
      r.get({}, success, error);
    });
  };

  return root;
})
.factory('PeerSync', function($resource, NodeService) {
  var root = {};

  root.get = function(success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/peer');
      r.get({}, success, error);
    });
  };

  return root;
});
