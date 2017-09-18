'use strict';

//Global service for global variables
angular.module('explorer.system')
  .factory('Global',[
    function() {
    }
  ])
  .factory('Version',
    function($resource, NodeManager) {
      var root = {};

      root.get = function(success, error) {
        var r = $resource(NodeManager.getNode().api + '/version');
        r.get(success, error);
      };

      return root;
    }
  );
