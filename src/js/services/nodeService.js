'use strict';

angular.module('owsExplorerApp.services').factory('NodeService', function($rootScope, $resource, $timeout, lodash, nodeConfig, ConfigService) {
    var root = {};

  var CONNECTION_RETRIES = 1000000;
  var CONNECTION_RETRY_DELAY = 10000;

    var _nodes = [];
  var _currentNodeName = null;
  var _queue = [];
  var _waiting = false;
  var _retries = [];

  var _isStartup = function() {
    return _currentNodeName == null;
  };

  var _init = function() {
    // Initialize nodes list from configuration.
    for (var i = 0; i < nodeConfig.fullNodes.length; i++) {
      _nodes.push({
        url: nodeConfig.fullNodes[i].url || '',
        api: (nodeConfig.fullNodes[i].url || '') + (nodeConfig.fullNodes[i].apiPrefix || ''),
        info: {},
        status: 'pending'
      });
      _tryConnectNode(_nodes[_nodes.length-1]); // Asynchronous call
    }

    // Wait for nodes connect to before setting the current node.
    root.whenAvailable(function(availableNodes) {
      if (_isStartup()) {
        var config = ConfigService.getConfig();

        // Try to set the users preferred node.
        if (root.getNodeByName(config.preferredNodeName)) {
          root.setNode(config.preferredNodeName);
        } else {
          root.setNode(availableNodes[0].info.description.name);
        }
      }
    });

  };

  var _tryConnectNode = function(node) {
    var retry = function(node) {
      $timeout(function() {
        var r = lodash.find(_retries, function(r) {
          return node.url == r.url;
        });

        if (!r) {
          r = { url: node.url, count: 1 };
          _retries.push(r);
        } else {
          r.count++;
        }

        if (r.count <= CONNECTION_RETRIES) {
          _tryConnectNode(node);
        } else {
          console.log('Failed to connect to node at ' + node.url);
        }
      }, CONNECTION_RETRY_DELAY);
    };

    console.log('Attempting to connect to node at ' + node.url);
    var Status = $resource(node.api + '/status', {q: '@q'});
    Status.get({q: 'getInfo'},
      function(d) {
        node.info = d.info;
        node.status = 'ready';
        $rootScope.$emit('Local/NodeConnected', node);
        console.log('Node connected - ' + node.info.description.name + ' @ ' + node.url);
      },
      function(e) {
        node.error = e.data;
        node.status = 'error';
        retry(node);
      });
  };

  root.whenAvailable = function(callback) {
    var isReady = function() {
      // Ready if at least one node is ready
      var ready = false;
      lodash.forEach(_nodes, function(n) {
        if (n.status == 'ready') {
          ready = true;
        }
      });
      return ready;
    };

    var wait = function() {
      _waiting = true;

      $timeout(function() {
        if (!isReady()) {
          return wait();
        } else {
          // Make all callbacks and empty the queue.
          lodash.each(_queue, function(cb) {
            $timeout(function() {
              return cb(root.getAvailableNodes());
            }, 1);
          });
          _queue = [];
          _waiting = false;
        }
      }, 1000);
    };

    if (!isReady()) {
      _queue.push(callback);

      if (_waiting) return;
      wait();
      return;
    }
    return callback(root.getAvailableNodes());
  };

  root.getNodes = function() {
      return _nodes;
  };

  root.getAvailableNodes = function() {
    return lodash.filter(_nodes, function(n) {
      return n.status == 'ready';
    });
  };

  root.getNodeByName = function(name) {
    var n = lodash.find(root.getAvailableNodes(), function(n) {
      return n.info.description.name == name;
    });
    return n;
  };

  root.getNodeByProtocol = function(protocol) {
    var n = lodash.find(root.getAvailableNodes(), function(n) {
      return n.info.description.protocol == protocol;
    });
    return n;
  };

  // Get the currently selected node.
  root.getNode = function() {
    return root.getNodeByName(_currentNodeName);
  };

  root.isNodeAvailable = function(nodeName) {
    var n = root.getNodeByName(nodeName);
    if (n) {
      return n.status == 'ready';
    }
    return false;
  };

  // Set the current node.
  root.setNode = function(name) {
    var node = root.getNodeByName(name);

    if (node) {
      var oldNode = root.getNode();
      _currentNodeName = name;
      $rootScope.node = node;
      $rootScope.$emit('Local/NodeChange', {
        oldNode: oldNode,
        newNode: node
      });
    } else {
      console.log('Error: ignored attempt to set node with unrecognized node name (' + name + ')');
    }
  };

  _init();

    return root;
});
