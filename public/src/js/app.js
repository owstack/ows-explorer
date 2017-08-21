'use strict';

var defaultLanguage = localStorage.getItem('explorer-language') || 'en';
var defaultCurrency = localStorage.getItem('explorer-currency') || 'BTC';

angular.module('explorer',[
  'ngAnimate',
  'ngResource',
  'ngRoute',
  'ngProgress',
  'ui.bootstrap',
  'ui.route',
  'monospaced.qrcode',
  'gettext',
  'angularMoment',
  'explorer.system',
  'explorer.socket',
  'explorer.api',
  'explorer.blocks',
  'explorer.transactions',
  'explorer.address',
  'explorer.search',
  'explorer.status',
  'explorer.connection',
  'explorer.currency',
  'explorer.messages'
]);

angular.module('explorer.system', []);
angular.module('explorer.socket', []);
angular.module('explorer.api', []);
angular.module('explorer.blocks', []);
angular.module('explorer.transactions', []);
angular.module('explorer.address', []);
angular.module('explorer.search', []);
angular.module('explorer.status', []);
angular.module('explorer.connection', []);
angular.module('explorer.currency', []);
angular.module('explorer.messages', []);
