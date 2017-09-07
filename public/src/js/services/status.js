'use strict';

angular.module('explorer.status')
  .factory('Status',
    function($resource, NodeManager) {
      return $resource(NodeManager.getSelectedNode().api + '/status', {
        q: '@q'
      });
    })
  .factory('Sync',
    function($resource, NodeManager) {
      return $resource(NodeManager.getSelectedNode().api + '/sync');
    })
  .factory('PeerSync',
    function($resource, NodeManager) {
      return $resource(NodeManager.getSelectedNode().api + '/peer');
    });
