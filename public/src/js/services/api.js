'use strict';

angular.module('explorer.api')
  .factory('Api',
    function() {
      return {
        apiPrefix: '/explorer-api'
      }
    });
