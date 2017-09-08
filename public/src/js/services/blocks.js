'use strict';

angular.module('explorer.blocks')
  .factory('Block',
    function($resource, NodeManager) {
    return $resource(NodeManager.getNode().api + '/block/:blockHash', {
      blockHash: '@blockHash'
    }, {
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
  })
  .factory('Blocks',
    function($resource, NodeManager) {
      return $resource(NodeManager.getNode().api + '/blocks');
  })
  .factory('BlockByHeight',
    function($resource, NodeManager) {
      return $resource(NodeManager.getNode().api + '/block-index/:blockHeight');
  });
