'use strict';

angular.module('explorer.api').factory('NodeManager',
  function($rootScope, $resource, $timeout, nodeConfig, lodash) {
  	var root = {};

  	var _nodes = [];
    var _currentNodeId;
    var _queue = [];
    var _waiting = false;

    var _init = function() {
      _currentNodeId = localStorage.getItem('explorer-node-id');
      _currentNodeId = (typeof _currentNodeId == 'string' ? _currentNodeId : '0');

      // Initialize nodes list from configuration.
      for (var i = 0; i < nodeConfig.fullNodes.length; i++) {
        _nodes.push({
          id: _nodes.length.toString(), // An ordinal
          url: nodeConfig.fullNodes[i].url || '',
          api: (nodeConfig.fullNodes[i].url || '') + '/' + (nodeConfig.fullNodes[i].apiPrefix || ''),
          info: {},
          status: 'pending'
        });
        _setNodeInfo(_nodes[_nodes.length-1]); // Asynchronous call
      }

//      root.setNode(_currentNodeId);
    };

    var _setNodeInfo = function(node) {
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

    root.whenAvailable = function(callback) {
      var isReady = function() {
        var node = lodash.find(_nodes, function(n) {
          return n.status != 'ready';
        });
        return node == undefined;
      };

      var wait = function() {
        _waiting = true;

        $timeout(function() {
          if (!isReady()) {
            return wait();
          } else {
            // Make all callbacks and empty the queue.
            lodash.each(_queue, function(x) {
              $timeout(function() {
                return x(root.getNode());
              }, 1);
            });
            _queue = [];
            _waiting = false;
          }
        }, 1);
      };

      if (!isReady()) {
        _queue.push(callback);

        if (_waiting) return;
        wait();
        return;
      }
      return callback(root.getNode());
    };

    root.getNodes = function() {
    	return _nodes;
    };

    root.getNodeById = function(id) {
      var n = lodash.find(_nodes, function(n) {
        return n.id == id;
      });
      return n;
    };

    root.getNodeByProtocol = function(protocol) {
      var n = lodash.find(_nodes, function(n) {
        return n.info.description.protocol == protocol;
      });
      return n;
    };

    // Get the currently selected node.
		root.getNode = function() {
			var n = lodash.find(_nodes, function(n) {
				return n.id == _currentNodeId;
			});
			return n;
	  };

    // Set the current node.
		root.setNode = function(id) {
      var node = root.getNodeById(id);
      if (node) {
        _currentNodeId = id;
        localStorage.setItem('explorer-node-id', id);
        $rootScope.$emit('Local/NodeChange', node);
      } else {
        console.log('Error: ignored attempt to set node using invalid node id (' + id + ')');
      }
	  };

    _init();

  	return root;
  });
