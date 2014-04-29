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
            // ---------------------- START LEAGUE ROUTES ---------------------
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
            .state('league by id', { // list groups in league here
                url: '/leagues/:leagueId',
                templateUrl: 'public/leagues/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            // ---------------------- END LEAGUE ROUTES ----------------------

            // ---------------------- START GROUP ROUTES ---------------------
            // .state('all groups', {
            //     url: '/leagues/:leagueId/groups',
            //     templateUrl: 'public/leagues/views/groupsList.html',
            //     resolve: {
            //         loggedin: checkLoggedin
            //     }
            // })
            .state('create group', {
                url: '/leagues/:leagueId/createGroup',
                templateUrl: 'public/leagues/views/groupCreate.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('group', { // list teams in group here
                url: '/leagues/:leagueId/groups/:groupId',
                templateUrl: 'public/leagues/views/groupView.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            // ---------------------- END GROUP ROUTES ----------------------

            // ---------------------- START TEAM ROUTES ---------------------
            .state('all teams (by group)', {
                url: '/leagues/:leagueId/groups/:groupId/teams',
                templateUrl: 'public/leagues/views/teamsList.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('add new team to a group', {
                url: '/leagues/:leagueId/groups/:groupId/createTeam',
                templateUrl: 'public/leagues/views/teamCreate.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('team', {
                url: '/leagues/:leagueId/groups/:groupId/teams/:teamId',
                templateUrl: 'public/leagues/views/teamView.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            // ---------------------- END TEAM ROUTES -----------------------
            
            // ---------------------- START PLAYER ROUTES -------------------
            .state('all players (by team)', {
                url: '/leagues/:leagueId/groups/:groupId/teams/:teamId/players',
                templateUrl: 'public/leagues/views/playersList.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create player', {
                url: '/leagues/:leagueId/groups/:groupId/teams/:teamId/createPlayer',
                templateUrl: 'public/leagues/views/playerCreate.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit player', {
                url: '/leagues/:leagueId/groups/:groupId/teams/:teamId/editPlayer',
                templateUrl: 'public/leagues/views/playerEdit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('player', {
                url: '/leagues/:leagueId/groups/:groupId/teams/:teamId/players/:playerId',
                templateUrl: 'public/leagues/views/playerView.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
            // ---------------------- END PLAYER ROUTES ---------------------

            // ---------------------- START MATCH ROUTES --------------------
            
            // ---------------------- END MATCH ROUTES ----------------------
    }
]);