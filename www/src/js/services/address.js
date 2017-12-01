'use strict';

angular.module('owsExplorerApp.services').factory('Address', function($resource, NodeService) {
  var root = {};

  root.get = function(params, success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/addr/:addrStr/?noTxList=1', {addrStr: '@addrStr'}, {
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
    });
  };

  return root;

});
