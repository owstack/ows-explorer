'use strict';

angular.module('explorer.address')
  .factory('Address',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(params, success, error) {
        var r = $resource(NodeManager.getNode().api + '/addr/:addrStr/?noTxList=1', {addrStr: '@addrStr'}, {
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

        r.get({addrStr: params.addrStr}, success, error);
      };

      return root;
    }
  );
