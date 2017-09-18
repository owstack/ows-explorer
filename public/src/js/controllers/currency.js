'use strict';

angular.module('explorer.currency').controller('CurrencyController',
  function($scope, $rootScope, lodash, Currency, NodeManager) {

    // Initialize currencies for the current node.
    var initialized = false;

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
        initialized = true;
      });
    };

    $rootScope.$on('Local/NodeChange', function(e, nodeId) {
      _initCurrency();
    });

    $scope.setCurrency = function(currencyId) {
      if (!currencyId) {
        currencyId = localStorage.getItem('explorer-currency-id');
        currencyId = (typeof currencyId == 'string' ? currencyId : '0');
      }

      $rootScope.currency = $scope.availableCurrencies[parseInt(currencyId)];
      localStorage.setItem('explorer-currency-id', currencyId);


      // Currency conversions (non-fiat) are relative to the standard unit value.
      // Attach the standard unit to the selected currency.
      $rootScope.currency.standardUnit = lodash.find($scope.availableCurrencies, function(c) {
        return c.kind == 'standard';
      });

      // For fiat currencies get the market exchange rate for conversions.
      if ($rootScope.currency.kind == 'fiat') {
        Currency.get({}, function(res) {
          $rootScope.currency.value = res.data.rates[$rootScope.currency.code].rate;
          // Exchange rate status info.
          $rootScope.currency.source = res.data.rates[$rootScope.currency.code].name;
          $rootScope.currency.rateStr = '1 ' + $rootScope.currency.standardUnit.shortName + ' = ' +
            $rootScope.currency.value.toFixed($rootScope.currency.decimals) + ' ' + $rootScope.currency.shortName;
        });
      }
    };

    // Convert from standard unit to selected currency unit.
    // This function needed globally.
    $rootScope.getCurrencyConversion = function(value) {

      // Wait for currency to be initialized.
      if (!initialized) {
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

    _initCurrency();
  });
