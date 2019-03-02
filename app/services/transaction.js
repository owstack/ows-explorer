'use strict';

angular.module('owsExplorerApp.services').factory('Transaction', function($resource, NodeService) {
  var root = {};

  root.get = function(params, success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/tx/:txId', {txId: '@txId'}, {
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

      r.get({txId: params.txId}, success, error);
    });
  };

  return root;
})
.factory('TransactionsByBlock', function($resource, NodeService) {
  var root = {};

  root.get = function(params, success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/txs', {block: '@block'});
      r.get({block: params.block}, success, error);
    });
  };

  return root;
})
.factory('TransactionsByAddress', function($resource, NodeService) {
  var root = {};

  root.get = function(params, success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/txs', {address: '@address'});
      r.get({address: params.address}, success, error);
    });
  };

  return root;
})
.factory('Transactions', function($resource, NodeService) {
  var root = {};

  root.get = function(success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/txs');
      r.get(success, error);
    });
  };

  return root;
});
