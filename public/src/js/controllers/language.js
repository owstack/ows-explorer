'use strict';

angular.module('owsExplorerApp.controllers').controller('LanguageController', function($scope, $route, $templateCache, gettextCatalog, amMoment, ConfigService) {

  var config = ConfigService.getConfig();
  $scope.defaultLanguage = config.language || 'en';

  $scope.availableLanguages = [{
    name: 'Deutsch',
    isoCode: 'de_DE',
  }, {
    name: 'English',
    isoCode: 'en',
  }, {
    name: 'Spanish',
    isoCode: 'es',
  }, {
    name: 'Japanese',
    isoCode: 'ja',
  }];

  $scope.setLanguage = function(isoCode) {
    gettextCatalog.currentLanguage = $scope.defaultLanguage = isoCode;
    amMoment.changeLocale(isoCode);

    var config = {
      language: isoCode
    };
    ConfigService.saveConfig(config);

    var currentPageTemplate = $route.current.templateUrl;
    $templateCache.remove(currentPageTemplate);
    $route.reload();
  };

});
