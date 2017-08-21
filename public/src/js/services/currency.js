'use strict';

angular.module('explorer.currency').factory('Currency',
  function($resource, Api) {
    return $resource(Api.apiPrefix + '/currency');
});
