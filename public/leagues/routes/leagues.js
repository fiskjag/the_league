'use strict';

//Setting up route
angular.module('mean.leagues').config(['$stateProvider',
    function($stateProvider) {

        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0')
                    $timeout(deferred.resolve, 0);

                // Not Authenticated
                else {
                    $timeout(function() {
                        deferred.reject();
                    }, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        // states for my app
        $stateProvider
            .state('all leagues', {
                url: '/leagues',
                templateUrl: 'public/leagues/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create league', {
                url: '/leagues/create',
                templateUrl: 'public/leagues/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit league', {
                url: '/leagues/:leagueId/edit',
                templateUrl: 'public/leagues/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('league by id', {
                url: '/leagues/:leagueId',
                templateUrl: 'public/leagues/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })

            .state('create group', {
                url: '/leagues/:leagueId/createGroup',
                templateUrl: 'public/leagues/views/createGroup.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('show groups', {
                url: '/leagues/:leagueId/groups/:groupId',
                templateUrl: 'public/leagues/views/viewGroup.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);
