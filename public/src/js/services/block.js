'use strict';

angular.module('owsExplorerApp.services').factory('Block', function($resource, NodeService) {
  var root = {};

  root.get = function(params, success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/block/:blockHash', {blockHash: '@blockHash'}, {
        get: {
          method: 'GET',
          interceptor: {
            response: function (res) {
              return res.data;
            },
            responseError: function (res) {
              if (res.status === 404) {
                return res;
              }
            }
          }
        }
      });

      r.get({blockHash: params.blockHash}, success, error);
    });
  };

  return root;
})
.factory('Blocks', function($resource, NodeService) {
  var root = {};

  root.get = function(success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/blocks');
      r.get(success, error);
    });
  };

  return root;
})
.factory('BlockByHeight', function($resource, NodeService) {
  var root = {};

  root.get = function(params, success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/block-index/:blockHeight', {blockHeight: '@blockHeight'});
      r.get({blockHeight: params.blockHeight}, success, error);
    });
  };

  return root;
});
