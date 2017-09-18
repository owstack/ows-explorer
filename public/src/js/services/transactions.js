'use strict';

angular.module('explorer.transactions')
  .factory('Transaction',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(params, success, error) {
        var r = $resource(NodeManager.getNode().api + '/tx/:txId', {txId: '@txId'}, {
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
      };

      return root;
    }
  )
  .factory('TransactionsByBlock',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(params, success, error) {
        var r = $resource(NodeManager.getNode().api + '/txs', {block: '@block'});
        r.get({block: params.block}, success, error);
      };

      return root;
    }
  )
  .factory('TransactionsByAddress',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(params, success, error) {
        var r = $resource(NodeManager.getNode().api + '/txs', {address: '@address'});
        r.get({address: params.address}, success, error);
      };

      return root;
    }
  )
  .factory('Transactions',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(success, error) {
        var r = $resource(NodeManager.getNode().api + '/txs');
        r.get(success, error);
      };

      return root;
    }
  );
