'use strict';

angular.module('explorer.api').factory('NodeManager',
  function(nodeConfig, lodash) {
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

    var setNodeInfo = function(node) {
      Status.get({
          q: 'getInfo'
        },
        function(d) {
          node.info = d;
        },
        function(e) {
          var error = 'API ERROR: ' + e.data;
        });
    };
    root.getNodes = function() {
    	return nodes;
    };

		root.getSelectedNode = function() {
			var n = lodash.find(node, function(n) {
				return n.index == selectedNodeId;
			});
			return (n ? n : emptyNode);
	  };

		root.setSelectedNode = function(node) {
	  	selectedNodeId = node.id;
	  };

  	return root;
  });
