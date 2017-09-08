'use strict';

angular.module('explorer.api').factory('NodeManager',
  function($rootScope, $resource, $timeout, nodeConfig, lodash) {
  	var root = {};

  	// Initialize nodes list from configuration.
  	var nodes = [];
    var currentNodeId = localStorage.getItem('explorer-node-id');
    currentNodeId = (typeof currentNodeId != 'string' ? currentNodeId : '0');

    var setNodeInfo = function(node) {
      var Status = $resource(node.api + '/status', {q: '@q'});
      Status.get({q: 'getInfo'},
        function(d) {
          node.info = d.info;
          node.status = 'ready';
        },
        function(e) {
          node.error = e.data;
          node.status = 'error';
        });
    };

  	for (var i = 0; i < nodeConfig.fullNodes.length; i++) {
  		nodes.push({
  			id: nodes.length.toString(), // An ordinal
  			url: nodeConfig.fullNodes[i].url || '',
  			api: (nodeConfig.fullNodes[i].url || '') + '/' + (nodeConfig.fullNodes[i].apiPrefix || ''),
  			info: {},
        status: 'pending'
  		});
  		setNodeInfo(nodes[nodes.length-1]); // Asynchronous call
  	}

    root._queue = [];
    root._waiting = false;

    root.whenAvailable = function(callback) {
      var isReady = function() {
        var node = lodash.find(nodes, function(n) {
          return n.status != 'ready';
        });
        return node == undefined;
      };

      var wait = function() {
        root._waiting = true;

        $timeout(function() {
          if (!isReady()) {
            return wait();
          } else {
            // Make all callbacks and empty the queue.
            lodash.each(root._queue, function(x) {
              $timeout(function() {
                return x(root.getNode());
              }, 1);
            });
            root._queue = [];
            root._waiting = false;
          }
        }, 1);
      };

      if (!isReady()) {
        root._queue.push(callback);

        if (root._waiting) return;
        wait();
        return;
      }
      return callback(root.getNode());
    };

    root.getNodes = function() {
    	return nodes;
    };

    root.getNodeById = function(id) {
      var n = lodash.find(nodes, function(n) {
        return n.id == id;
      });
      return n;
    };

    root.getNodeByProtocol = function(protocol) {
      var n = lodash.find(nodes, function(n) {
        return n.info.description.protocol == protocol;
      });
      return n;
    };

    // Get the currently selected node.
		root.getNode = function() {
			var n = lodash.find(nodes, function(n) {
				return n.id == currentNodeId;
			});
			return n;
	  };

    // Set the current node.
		root.setNode = function(id) {
      if (root.getNodeById(id)) {
        currentNodeId = id;
        localStorage.setItem('explorer-node-id', id);
        $rootScope.$emit('Local/NodeChange', id);
      } else {
        console.log('Error: ignored attempt to set node using invalid node id (' + id + ')');
      }
	  };

  	return root;
  });
