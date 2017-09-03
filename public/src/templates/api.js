'use strict';

angular.module('explorer.api')
  .factory('Api',
    function() {
      return {
        apiPrefix: '/EXPLORER_API_PREFIX'
      }
    });
