'use strict';

angular.module('explorer.status')
  .factory('Status',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(params, success, error) {
        var r = $resource(NodeManager.getNode().api + '/status', {q: '@q'});
        r.get({q: params.query}, success, error);
      };

      return root;
    }
  )
  .factory('Sync',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(success, error) {
        var r = $resource(NodeManager.getNode().api + '/sync');
        r.get({}, success, error);
      };

      return root;
    }
  )
  .factory('PeerSync',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(success, error) {
        var r = $resource(NodeManager.getNode().api + '/peer');
        r.get({}, success, error);
      };

      return root;
    }
  );
