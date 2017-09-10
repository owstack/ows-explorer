'use strict';

angular.module('explorer.system').controller('FooterController',
  function($scope, $route, $templateCache, gettextCatalog, amMoment) {

    $scope.defaultLanguage = defaultLanguage;

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
      gettextCatalog.currentLanguage = $scope.defaultLanguage = defaultLanguage = isoCode;
      amMoment.changeLocale(isoCode);
      localStorage.setItem('explorer-language', isoCode);
      var currentPageTemplate = $route.current.templateUrl;
      $templateCache.remove(currentPageTemplate);
      $route.reload();
    };

  });
