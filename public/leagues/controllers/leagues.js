'use strict';

angular.module('mean.leagues')
    .controller('LeaguesController', ['$scope', '$stateParams', '$location', '$filter', '$http', 'Global', 'Leagues', function ($scope, $stateParams, $location, $filter, $http, Global, Leagues) {
    $scope.global = Global;

    // --------------------------- START LEAGUE ---------------------------------------
    $scope.create = function() {
        var league = new Leagues({
            name: this.name
        });

        league.$save(function(response) {
            $location.path('leagues/' + response._id);
        });

        this.name = '';
    };

    $scope.remove = function(league) {
        if (league) {
            league.$remove();

            for (var i in $scope.leagues) {
                if ($scope.leagues[i] === league) {
                    $scope.leagues.splice(i, 1);
                }
            }
        }
        else {
            $scope.league.$remove();
            $location.path('leagues');
        }
    };

    $scope.update = function() {
        var league = $scope.league;
        if (!league.updated) {
            league.updated = [];
        }
        league.updated.push(new Date().getTime());

        league.$update(function() {
            $location.path('leagues/' + league._id);
        });
    };

    $scope.find = function() {
        Leagues.query(function(leagues) {
            $scope.leagues = leagues;
        });
    };

    $scope.findOne = function() {
        Leagues.get({
            leagueId: $stateParams.leagueId
        }, function(league) {
            $scope.league = league;

            var groups = league.groups;
            $scope.playoffs = $filter('filter')(league);

            var scorers = [];

            for(var i = 0; i < groups.length; i++) {
                var teams = groups[i].teams;

                for(var j = 0; j < teams.length; j++) {
                    var players = teams[j].players;

                    for(var k = 0; k < players.length; k++) {
                        var scorer = {name: players[k].name, team: teams[j].name, goalsscored: players[k].goalsscored};
                        scorers.push(scorer);
                    }
                }
            }

            // Auto-update when match result / dates are changed
            // TODO: First update qf results + make sure to save
            // Then generate semi-finals based on the results.
            $scope.$watch('playoffs', function() {
                // if($scope.league.playoffs.quarterfinals.length > 0) {
                //     var q = $scope.updatePlayoffResults($scope.league.playoffs.quarterfinals);
                //     console.log(q);
                //     for(var i = 0; i < q.length; i++) {
                //         var x = i % 1;
                //         if(x === 0) {
                //             $scope.league.playoffs.semifinals[x].hometeam = q[i];
                //         } else {
                //             $scope.league.playoffs.semifinals[x].awayteam = q[i];
                //         }
                //     }
                // }

                // for(i = 0; i < $scope.league.playoffs.semifinals.length; i++) {
                //     if($scope.league.playoffs.semifinals.length > 0)
                //     console.log('SF ' + $scope.league.playoffs.semifinals[i].hometeam + ' vs ' +
                //         $scope.league.playoffs.semifinals[i].awayteam);
                // }

                // for(i = 0; i < $scope.league.playoffs.leaguefinal.length; i++) {
                //     if($scope.league.playoffs.leaguefinal.length > 0)
                //     console.log('FF ' + $scope.league.playoffs.leaguefinal[i].hometeam + ' vs ' +
                //         $scope.league.playoffs.leaguefinal[i].awayteam);
                // }
            }, true);
            
            scorers = scorers.sort(function(p1, p2) {
                return p2.goalsscored - p1.goalsscored;
            });

            $scope.topscorers = scorers;
        });
    };
    // --------------------------- END LEAGUE -----------------------------------------

    $scope.updatePlayoffResults = function(stage) {
        var winners = [];
        for(var i = 0; i < stage.length; i++) {
            if(stage[i].homegoals > stage[i].awaygoals) {
                winners.push(stage[i].hometeam);
            } else if (stage[i].homegoals < stage[i].awaygoals) {
                winners.push(stage[i].awayteam);
            } else {
                winners.push('DRAW');
            }
        }

        return winners;
    };

    // --------------------------- START GROUP ----------------------------------------
    $scope.createGroup = function() {
        var league = $scope.league;
        var group = $scope.group;
        
        league.groups.push({_id: group, name: group});

        league.$update(function() {
            $location.path('leagues/' + league._id + '/groups/' + group);
        });
    };

    $scope.findOneGroup = function() {
        var leagueId = $stateParams.leagueId;
        var groupId = $stateParams.groupId;

        Leagues.get({
            leagueId: leagueId
        }, function(league) {
            $scope.league = league;

            var groups = league.groups;
            $scope.group = $filter('filter')(groups, {_id: groupId})[0];

            // Auto-update when match result / dates are changed
            $scope.$watch('group', function() {
                for(var i = 0; i < $scope.league.groups.length; i++) {
                    if($scope.league.groups[i]._id === groupId) {
                        $scope.league.groups[i] = $scope.group;
                        $scope.resetResults($scope.group);
                        $scope.updateResults($scope.group);
                    }
                }

                //$scope.resetPlayoffs($scope.league);
                $scope.updatePlayoffs($scope.league);
                $scope.league.$update();        

            }, true);
        });
    };

    $scope.updateResults = function(group) {
        var teams = group.teams;
        var matches = group.matches;

        for(var j = 0; j < matches.length; j++) {
            var hometeam = $filter('filter')(teams, {_id: matches[j].hometeam})[0];
            var awayteam = $filter('filter')(teams, {_id: matches[j].awayteam})[0];

            var hometeamwin = (matches[j].homegoals > matches[j].awaygoals ? true : false);
            var draw = (matches[j].homegoals === matches[j].awaygoals ? true : false);
            var awayteamwin = (matches[j].homegoals < matches[j].awaygoals ? true : false);

            if((matches[j].homegoals !== null && matches[j].homegoals !== '' && !isNaN(matches[j].homegoals)) ||
               (matches[j].awaygoals !== null && matches[j].awaygoals !== '' && !isNaN(matches[j].awaygoals))) {
                var hometeamgoalsscored = (matches[j].homegoals !== null && matches[j].homegoals !== '' && !isNaN(matches[j].homegoals)) ? parseInt(matches[j].homegoals) : 0;
                var hometeamgoalsagainst = (matches[j].awaygoals !== null && matches[j].awaygoals !== '' && !isNaN(matches[j].awaygoals)) ? parseInt(matches[j].awaygoals) : 0;
                var awayteamgoalsscored = (matches[j].awaygoals !== null && matches[j].awaygoals !== '' && !isNaN(matches[j].awaygoals)) ? parseInt(matches[j].awaygoals) : 0;
                var awayteamgoalsagainst = (matches[j].homegoals !== null && matches[j].homegoals !== '' && !isNaN(matches[j].homegoals)) ? parseInt(matches[j].homegoals) : 0;

                hometeam.gamesplayed++;
                hometeam.wins += (hometeamwin ? 1 : 0);
                hometeam.ties += (draw ? 1 : 0);
                hometeam.losses += (awayteamwin ? 1 : 0);
                hometeam.goalsscored += hometeamgoalsscored;
                hometeam.goalsagainst += hometeamgoalsagainst;
                hometeam.goaldiff += hometeamgoalsscored - hometeamgoalsagainst;
                hometeam.points += (hometeamwin ? 3 : (draw ? 1 : 0));

                awayteam.gamesplayed++;
                awayteam.wins += (awayteamwin ? 1 : 0);
                awayteam.ties += (draw ? 1 : 0);
                awayteam.losses += (hometeamwin ? 1 : 0);
                awayteam.goalsscored += awayteamgoalsscored;
                awayteam.goalsagainst += awayteamgoalsagainst;
                awayteam.goaldiff += awayteamgoalsscored - awayteamgoalsagainst;
                awayteam.points += (awayteamwin ? 3 : (draw ? 1 : 0));

                $filter('filter')(teams, {_id: matches[j].hometeam})[0] = hometeam;
                $filter('filter')(teams, {_id: matches[j].awayteam})[0] = awayteam;
            }
        }
    };

    $scope.resetResults = function(group) {
        var teams = group.teams;

        for(var j = 0; j < teams.length; j++) {
            teams[j].gamesplayed = 0;
            teams[j].wins = 0;
            teams[j].ties = 0;
            teams[j].losses = 0;
            teams[j].goalsscored = 0;
            teams[j].goalsagainst = 0;
            teams[j].goaldiff = 0;
            teams[j].points = 0;
        }
    };

    $scope.updatePlayoffs = function(league) {
        var groups = league.groups;
        var playoffs = league.playoffs;
        var qf = playoffs.quarterfinals;

        var hometeams, awayteams;

        for (var i = 0; i < groups.length; i++) {
            var teams = $filter('filter')(groups[i].teams);
            teams = $filter('orderBy')(teams, 'points', true);
            teams = $filter('limitTo')(teams, 4);
            
            if(i === 0) {
                hometeams = teams;
            } else {
                awayteams = teams;
            }
        }

        for (i = 0; i < hometeams.length; i++) {
            qf[i].hometeam = hometeams[i].name;
            qf[i].awayteam = awayteams[3 - i].name;
        }

        playoffs.quarterfinals = qf;
    };

    $scope.resetPlayoffs = function(league) {
        var playoffs = league.playoffs;

        for(var i = 0; i < playoffs.length; i++) {
            playoffs.quarterfinals[i].date = new Date(); 
            playoffs.quarterfinals[i].hometeam = '';
            playoffs.quarterfinals[i].awayteam = '';
            playoffs.quarterfinals[i].homegoals = 0;
            playoffs.quarterfinals[i].awaygoals = 0;
        }
    };
    // --------------------------- END GROUP ----------------------------------------

    // --------------------------- START TEAM ----------------------------------------
    $scope.createTeam = function() {
        var league = $scope.league;
        var group = $scope.group;
        var team = $scope.team;

        group.teams.push({_id: team, name: team});

        league.$update(function() {
            $location.path('leagues/' + league._id + '/groups/' + group._id + '/teams/' + team);
        });
    };

    $scope.findOneTeam = function() {
        var leagueId = $stateParams.leagueId;
        var groupId = $stateParams.groupId;
        var teamId = $stateParams.teamId;

        Leagues.get({
            leagueId: leagueId
        }, function(league) {
            $scope.league = league;

            var groups = league.groups;
            $scope.group = $filter('filter')(groups, {_id: groupId})[0];

            var teams = $scope.group.teams;
            $scope.team = $filter('filter')(teams, {_id: teamId})[0];

            // Auto-update when match result / dates are changed
            $scope.$watch('team', function() {
                var groupIndex = $scope.getObjectIndex(groups, groupId);
                var teamIndex = $scope.getObjectIndex(teams, teamId);

                $scope.league.groups[groupIndex].teams[teamIndex].players = $scope.team.players;
                $scope.league.$update();        
            }, true);
        });
    };

    $scope.getObjectIndex = function(array, id) {
        var index = -1;

        for(var i = 0; i < array.length; i++) {
            if(array[i]._id === id) {
                return i;
            }
        }

        return index;
    };
    // --------------------------- END TEAM ------------------------------------------

    // --------------------------- START PLAYER ----------------------------------------
    $scope.createPlayer = function() {
        var league = $scope.league;
        var group = $scope.group;
        var team = $scope.team;
        var player = $scope.player;
        
        team.players.push({name: player});

        league.$update(function() {
            $location.path('leagues/' + league._id + '/groups/' + group._id + '/teams/' + team._id); // + '/players/' + player._id);
        });
    };

    $scope.findOnePlayer = function() {
        var leagueId = $stateParams.leagueId;
        var groupId = $stateParams.groupId;
        var teamId = $stateParams.teamId;
        var playerId = $stateParams.playerId;

        Leagues.get({
            leagueId: leagueId
        }, function(league) {
            $scope.league = league;

            var groups = league.groups;
            $scope.group = $filter('filter')(groups, {_id: groupId})[0];

            var teams = $scope.group.teams;
            $scope.team = $filter('filter')(teams, {_id: teamId})[0];

            var players = $scope.team.players;
            $scope.player = $filter('filter')(players, {_id: playerId})[0];
        });
    };
    // --------------------------- END PLAYER ------------------------------------------

    // --------------------------- START MATCHES ---------------------------------------
    $scope.generateMatches = function() {
        var leagueId = $stateParams.leagueId;
        var groupId = $stateParams.groupId;
        console.log('Genererar matcher för grupp ' + groupId);

        Leagues.get({
            leagueId: leagueId
        }, function(league) {
            $scope.league = league;

            var groups = league.groups;
            $scope.group = $filter('filter')(groups, {_id: groupId})[0];

            var teams = $scope.group.teams;

            $scope.group.matches = []; // clear previously generated
            
            for(var i = 0; i < teams.length; i++) {
                var home = teams[i];
                
                for(var j = i+1; j < teams.length; j++) {
                    var away = teams[j];

                    if(home !== away) {
                        $scope.group.matches.push({hometeam: home.name, awayteam: away.name});
                        console.log(home.name + ' vs ' + away.name);
                    }
                }
            }

            league.$update(function() {
                $location.path('leagues/' + league._id + '/groups/' + groupId);
            });
        });
    };
    // --------------------------- END MATCHES -----------------------------------------
}]);

// Directive to handle date formatting (currently for match dates)
angular.module('mean.leagues').directive('dateHandler', function() {
    return {
        restrict: 'A',
        template: '{{matchDate}}',
        scope: {
            matchDate: '='
        },
        link: function (scope) {
            scope.matchDate = window.moment(scope.matchDate).format('YYYY-MM-DD');
        }
    };
}).directive('ngModelOnblur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 1, // needed for angular 1.2.x
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });         
            });
        }
    };
});