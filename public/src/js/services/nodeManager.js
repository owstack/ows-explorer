'use strict';

angular.module('explorer.api').factory('NodeManager',
  function($resource, nodeConfig, lodash) {
  	var root = {};

  	// Initialize nodes list from configuration.
  	var nodes = [];
  	var selectedNodeId = 0;

		var emptyNode = {
			id: -1,
			url: '',
			api: '',
			info: ''
		};

    var setNodeInfo = function(node) {
      var Status = $resource(node.api + '/status', {q: '@q'});
      Status.get({q: 'getInfo'},
        function(d) {
          node.info = d.info;
        },
        function(e) {
          node.info = {
            error: 'API ERROR: ' + e.data
          }
        });
    };

  	for (var i = 0; i < nodeConfig.fullNodes.length; i++) {
  		if (nodeConfig.fullNodes[i].url && nodeConfig.fullNodes[i].apiPrefix) {
    		nodes.push({
    			id: nodes.length,
    			url: nodeConfig.fullNodes[i].url,
    			api: nodeConfig.fullNodes[i].url + '/' + nodeConfig.fullNodes[i].apiPrefix,
    			info: {}
    		});
    		setNodeInfo(nodes[nodes.length-1]);
  		}
  	}

    root.getNodes = function() {
    	return nodes;
    };

		root.getSelectedNode = function() {
			var n = lodash.find(nodes, function(n) {
				return n.id == selectedNodeId;
			});
			return (n ? n : emptyNode);
	  };

		root.setSelectedNode = function(node) {
	  	selectedNodeId = node.id;
	  };

  	return root;
  });
