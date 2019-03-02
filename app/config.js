'use strict';

//Setting up route
angular.module('owsExplorerApp').config(function($routeProvider) {
  $routeProvider.
    when('/block/:blockHash', {
      templateUrl: 'views/block/block.html',
      title: 'Block '
    }).
    when('/block-index/:blockHeight', {
      controller: 'BlocksController',
      templateUrl: 'views/home/redirect.html'
    }).
    when('/tx/send', {
      templateUrl: 'views/transaction/transaction-sendraw.html',
      title: 'Broadcast Raw Transaction'
    }).
    when('/tx/:txId/:v_type?/:v_index?', {
      templateUrl: 'views/transaction/transaction.html',
      title: 'Transaction '
    }).
    when('/', {
      templateUrl: 'views/home/home.html',
      title: 'Home'
    }).
    when('/blocks', {
      templateUrl: 'views/block/block-list/block-list.html',
      title: 'Blocks solved Today'
    }).
    when('/blocks-date/:blockDate/:startTimestamp?', {
      templateUrl: 'views/block/block-list/block-list.html',
      title: 'Blocks solved '
    }).
    when('/address/:addrStr', {
      templateUrl: 'views/address/address.html',
      title: 'Address '
    }).
    when('/status', {
      templateUrl: 'views/status/status.html',
      title: 'Status'
    }).
    when('/messages/verify', {
      templateUrl: 'views/message/messages-verify.html',
      title: 'Verify Message'
    }).
    when('/tools', {
      templateUrl: 'views/tools/tools.html',
      title: 'Tools'
    }).
    when('/settings', {
      templateUrl: 'views/settings/settings.html',
      title: 'Settings'
    })
    .otherwise({
      templateUrl: 'views/home/404.html',
      title: 'Error'
    });
});

//Setting HTML5 Location Mode
angular.module('owsExplorerApp')
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  })
  .run(function($rootScope, $route, $location, $routeParams, $anchorScroll, ngProgress, gettextCatalog, amMoment) {
    var defaultLanguage = 'en';
    gettextCatalog.currentLanguage = defaultLanguage;
    amMoment.changeLocale(defaultLanguage);
    $rootScope.$on('$routeChangeStart', function() {
      ngProgress.start();
    });

    $rootScope.$on('$routeChangeSuccess', function() {
      ngProgress.complete();

      //Change page title, based on Route information
      $rootScope.titleDetail = '';
      $rootScope.title = $route.current.title;
      $rootScope.isCollapsed = true;
      $rootScope.currentAddr = null;

      $location.hash($routeParams.scrollTo);
      $anchorScroll();
    });
  });
