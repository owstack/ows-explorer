'use strict';

angular.module('owsExplorerApp.controllers').controller('SettingsController', function($rootScope, $scope, $timeout, lodash, gettextCatalog, ConfigService, NodeService, CurrencyService) {

  $rootScope.$on('Local/NodeConnected', function(e, node) {
    init();
  });

  var init = function(nodeName) {
    $scope.config = ConfigService.getConfig();
    $scope.nodes = NodeService.getAvailableNodes();

    $scope.nodeWarning = null;
    if (!NodeService.isNodeAvailable($scope.config.preferredNodeName)) {
      $scope.nodeWarning = gettextCatalog.getString('Offline');
    }
  };

  $scope.getNodeUnits = function(nodeName) {
    var node = NodeService.getNodeByName(nodeName);
    if (!node) return [];

    // TODO: exclude selection of fiat currencies for now; service needs historical rates.
    return lodash.filter(node.info.units, function(u) {
      return u.kind != 'fiat';
    });
  };

  $scope.isFiatSelected = function() {
    if ($rootScope.currency) {
      return $rootScope.currency.kind == 'fiat';
    }
    return false;
  };

  $scope.hasFiatRateProviders = function() {
    if ($rootScope.currency && $rootScope.currency.availableFiatRateProviders) {
      return $rootScope.currency.availableFiatRateProviders.length > 0;
    }
    return false;
  };

  $scope.updateSettings = function() {
    ConfigService.saveConfig($scope.config, true);

    // Set the current node.
    NodeService.setNode($scope.config.preferredNodeName);
  };

  // Come back to update config and UI if fiat currency is selected; setting of the currency.fiatRateProvider is async.
  var unwatchCurrencyFiatRateProvider = $rootScope.$watch('currency.fiatRateProvider', function() {
    if ($scope.isFiatSelected()) {
      $scope.fiatRateProvider = $rootScope.currency.fiatRateProvider;
      $scope.config.nodes[$scope.config.preferredNodeName].fiatRateProvider = $scope.fiatRateProvider;
      $scope.updateSettings();
    }
  });

  $scope.$on("$destroy", function() {
    if (typeof unwatchCurrencyFiatRateProvider == 'function') {
      unwatchCurrencyFiatRateProvider();
    }
  });

  init();

});
