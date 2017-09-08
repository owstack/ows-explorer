'use strict';

angular.module('explorer.currency').controller('CurrencyController',
  function($scope, $rootScope, lodash, Currency, NodeManager) {

    // Initialize currencies for the current node.
    var standardUnitValue;

    var _initCurrency = function() {
      $scope.availableCurrencies = [];
      $rootScope.currency = {};

      NodeManager.whenAvailable(function(node) {
        for (var i = 0; i < node.info.units.length; i++) {
          var unit = node.info.units[i];
          if (unit.userSelectable) {
            // Add an id to track selection.
            unit.id = $scope.availableCurrencies.length.toString(); // An ordinal
            $scope.availableCurrencies.push(unit);
          }
        }

        $scope.setCurrency();

        // Currency conversions are relative to the standard unit value.
        standardUnitValue = lodash.find($scope.availableCurrencies, function(c) {
          return c.kind == 'standard';
        }).value;
      });
    };

    $rootScope.$on('Local/NodeChange', function(e, nodeId) {
      _initCurrency();
    });

    $scope.setCurrency = function(currencyId) {
      if (!currencyId) {
        currencyId = localStorage.getItem('explorer-currency-id');
        currencyId = (currencyId != 'undefined' ? currencyId : '0');
      }

      $rootScope.currency = $scope.availableCurrencies[parseInt(currencyId)];
      localStorage.setItem('explorer-currency-id', currencyId);
    };

    // Convert from standard unit to selected currency unit.
    // This function needed globally.
    $rootScope.getCurrencyConversion = function(value) {

      var _roundFloat = function(x, n) {
        if(!parseInt(n, 10) || !parseFloat(x)) n = 0;
        return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
      };

      value = value * 1; // Convert to number

      if (isNaN(value) || typeof value == 'undefined' || value == null) {
        return 'value error';
      }

      if (value === 0.00000000) {
        return '0 ' + $rootScope.currency.shortName;
      }

      var response = _roundFloat((value * standardUnitValue / $rootScope.currency.value), $rootScope.currency.decimals);

      // Prevent sci notation displayed
      if (response < 1e-7) {
        response = response.toFixed(8);
      }

      return response + ' ' + $rootScope.currency.shortName;
    };

    _initCurrency();
  });
