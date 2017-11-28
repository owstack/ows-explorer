'use strict';

var modules = [
  'ngAnimate',
  'ngLodash',
  'ngResource',
  'ngRoute',
  'ngProgress',
  'ui.bootstrap',
  'ui.route',
  'monospaced.qrcode',
  'gettext',
  'angularMoment',
  'owsExplorerApp.controllers',
  'owsExplorerApp.directives',
  'owsExplorerApp.filters',
  'owsExplorerApp.models',
  'owsExplorerApp.services',
  'owsExplorerApp.translations',
];

var owsExplorerApp = angular.module('owsExplorerApp', modules);

angular.module('owsExplorerApp.controllers', []);
angular.module('owsExplorerApp.directives', []);
angular.module('owsExplorerApp.filters', []);
angular.module('owsExplorerApp.models', []);
angular.module('owsExplorerApp.services', []);
angular.module('owsExplorerApp.translations', []);
