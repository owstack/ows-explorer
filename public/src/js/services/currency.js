'use strict';

angular.module('owsExplorerApp.services').factory('CurrencyService', function($rootScope, $resource, lodash, NodeService, ConfigService) {
  var root = {};

  $rootScope.$on('Local/NodeChange', function(e, data) {
    root.setCurrency(data.newNode);
  });

  var get = function(success, error) {
    NodeService.whenAvailable(function() {
      var r = $resource(NodeService.getNode().api + '/currency');
      r.get(success, error);
    });
  };

  root.setCurrency = function(node) {
  	// Set currency based on user config.
    var configNode = ConfigService.getConfigForNode(node);

    if (configNode) {
      $rootScope.currency = lodash.find(node.info.units, function(u) {
        return u.shortName == configNode.currencyUnitName;
      });
  	} else {
      // No config set, use currency standard unit.
      $rootScope.currency = lodash.find(node.info.units, function(u) {
        return u.kind == 'standard';
      });
  	}

    // Currency conversions (non-fiat) are relative to the standard unit value.
    // Attach the standard unit to the selected currency.
  	$rootScope.currency.standardUnit = lodash.find(node.info.units, function(u) {
  		return u.kind == 'standard';
  	});

    // For fiat currencies get the market exchange rate for conversions.
    if ($rootScope.currency.kind == 'fiat') {
      get({}, function(res) {
/*
 * TODO - uncomment when explorer-api has been upgraded
 * 
        var providerRates = res.data.rates[$rootScope.currency.code];
        $rootScope.currency.availableFiatRateProviders = lodash.map(providerRates, function(p) {
          return p.name;
        });

        // Default to first entry in response if user has not configured provider.
        var provider = configNode.fiatRateProvider || res.data.rates[$rootScope.currency.code][0].name;
        $rootScope.currency.fiatRateProvider = provider;
        $rootScope.currency.value = res.data.rates[$rootScope.currency.code][provider].rate;

        $rootScope.currency.rateStr = '1 ' + $rootScope.currency.standardUnit.shortName + ' = ' +
          $rootScope.currency.value.toFixed($rootScope.currency.decimals) + ' ' + $rootScope.currency.shortName;
*/
        $rootScope.currency.availableFiatRateProviders = [res.data.rates[$rootScope.currency.code].name];

        $rootScope.currency.value = res.data.rates[$rootScope.currency.code].rate;
        // Exchange rate status info.
        $rootScope.currency.fiatRateProvider = res.data.rates[$rootScope.currency.code].name;
        $rootScope.currency.rateStr = '1 ' + $rootScope.currency.standardUnit.shortName + ' = ' +
          $rootScope.currency.value.toFixed($rootScope.currency.decimals) + ' ' + $rootScope.currency.shortName;
      });
    }
  };

  // Convert from standard unit to selected currency unit.
  // This function needed globally.
  root.getCurrencyConversion = function(value) {
    // Wait for currency to be initialized.
    if (!$rootScope.currency) {
      return '';
    }

    var _roundFloat = function(x, n) {
      if(!parseInt(n, 10) || !parseFloat(x)) n = 0;
      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    };

    value = value * 1; // Convert to number

    if (isNaN(value) || typeof value == 'undefined' || value == null) {
      return 'value error';
    }

    if (value === 0.00000000) {
      return value.toFixed($rootScope.currency.decimals) + ' '+ $rootScope.currency.shortName;
    }

    var response;
    if ($rootScope.currency.kind == 'fiat') {
      response = _roundFloat((value * $rootScope.currency.value), $rootScope.currency.decimals);
    } else {
      response = _roundFloat((value * $rootScope.currency.standardUnit.value / $rootScope.currency.value), $rootScope.currency.decimals);
    }

    return response.toFixed($rootScope.currency.decimals) + ' ' + $rootScope.currency.shortName;
  };

  return root;
});
