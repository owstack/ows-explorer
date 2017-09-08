'use strict';

angular.module('explorer.status')
  .factory('Status',
    function($resource, NodeManager) {
      return $resource(NodeManager.getNode().api + '/status', {
        q: '@q'
      });
    })
  .factory('Sync',
    function($resource, NodeManager) {
      return $resource(NodeManager.getNode().api + '/sync');
    })
  .factory('PeerSync',
    function($resource, NodeManager) {
      return $resource(NodeManager.getNode().api + '/peer');
    });
