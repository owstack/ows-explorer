'use strict';

angular.module('explorer.transactions')
  .factory('Transaction',
    function($resource, NodeManager) {
    return $resource(NodeManager.getNode().api + '/tx/:txId', {
      txId: '@txId'
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
  .factory('TransactionsByBlock',
    function($resource, NodeManager) {
    return $resource(NodeManager.getNode().api + '/txs', {
      block: '@block'
    });
  })
  .factory('TransactionsByAddress',
    function($resource, NodeManager) {
    return $resource(NodeManager.getNode().api + '/txs', {
      address: '@address'
    });
  })
  .factory('Transactions',
    function($resource, NodeManager) {
      return $resource(NodeManager.getNode().api + '/txs');
  });
