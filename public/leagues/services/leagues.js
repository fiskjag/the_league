'use strict';

//Leagues service used for leagues REST endpoint
angular.module('mean.leagues').factory('Leagues', ['$resource', function($resource) {
    return $resource('leagues/:leagueId', {
        leagueId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);