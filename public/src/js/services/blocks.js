'use strict';

angular.module('explorer.blocks')
  .factory('Block',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(params, success, error) {
        var r = $resource(NodeManager.getNode().api + '/block/:blockHash', {blockHash: '@blockHash'}, {
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
      };

      return root;
    }
  )
  .factory('Blocks',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(success, error) {
        var r = $resource(NodeManager.getNode().api + '/blocks');
        r.get(success, error);
      };

      return root;
    }
  )
  .factory('BlockByHeight',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(params, success, error) {
        var r = $resource(NodeManager.getNode().api + '/block-index/:blockHeight', {blockHeight: '@blockHeight'});
        r.get({blockHeight: params.blockHeight}, success, error);
      };

      return root;
    }
  );
