'use strict';

angular.module('owsExplorerApp.services').factory('ConfigService', function($rootScope, lodash) {
  var root = {};

  // localStorage
  //
  // config = {
  //   language = 'en',
  //   preferredNodeName = 'Bitcoin',
  //   nodes: {
  //     'Bitcoin': {
  //       currencyUnit: 'BTC'
  //     },
  //     'Bitcoin Cash': {
  //       currencyUnit: 'bits'
  //     },
  //     ...
  //   }
  // }

  $rootScope.$on('Local/NodeConnected', function(e, node) {
    var config = lodash.merge(getDefaultNodeConfig(node), root.getConfig());
    if (!config.preferredNodeName) {
      // No preferred node configured, initialize to the first node to connect.
      config.preferredNodeName = node.info.description.name;
    }
    root.saveConfig(config);
  });

  root.getConfig = function() {
    return JSON.parse(localStorage.getItem('config')) || {};
  };

  root.getConfigForNode = function(node) {
    var config = root.getConfig();
    return config.nodes[node.info.description.name] || {};
  };

  root.saveConfig = function(config, replace) {
    replace = replace || false;
    if (config) {
      if (replace) {
        config = lodash.assign(root.getConfig(), config);
      } else {
        config = lodash.merge(root.getConfig(), config);
      }
      localStorage.setItem('config', JSON.stringify(config));
    }
  };

  var init = function() {
    var config = JSON.parse(localStorage.getItem('config'));
    if (config == null) {
      config = {
        language: 'en',
      }
      root.saveConfig(config, true);
    }
  };

  var getDefaultNodeConfig = function(node) {
    var defaultConfig = {
      nodes: {}
    };

    if (node) {
      // Default to select standard currency.
      var standardCurrencyUnit = lodash.find(node.info.units, function(u) {
        return u.kind == 'standard';
      });

      defaultConfig.nodes[node.info.description.name] = {
        currencyUnitName: standardCurrencyUnit.shortName
      };
    }

    return defaultConfig;
  };

  init();

  return root;

});
