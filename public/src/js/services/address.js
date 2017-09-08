'use strict';

angular.module('explorer.address').factory('Address',
  function($resource, NodeManager) {
  return $resource(NodeManager.getNode().api + '/addr/:addrStr/?noTxList=1', {
    addrStr: '@addStr'
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
});

 
