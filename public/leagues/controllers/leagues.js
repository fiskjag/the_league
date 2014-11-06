'use strict';

angular.module('mean.leagues')
    .controller('LeaguesController', ['$scope', '$stateParams', '$location', '$filter', 'Global', 'Leagues', function ($scope, $stateParams, $location, $filter, Global, Leagues) {
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
        });
    };
    // --------------------------- END LEAGUE -----------------------------------------

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
                // $scope.league.groups = groups;
                // $scope.league.$update();

                for(var i = 0; i < $scope.league.groups.length; i++) {
                    if($scope.league.groups[i]._id === groupId) {
                        $scope.league.groups[i] = $scope.group;
                        $scope.resetResults($scope.group);
                        $scope.updateResults($scope.group);
                    }
                }

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

            hometeam.gamesplayed++;
            hometeam.wins += (hometeamwin ? 1 : 0);
            hometeam.ties += (draw ? 1 : 0);
            hometeam.losses += (awayteamwin ? 1 : 0);
            hometeam.goalsscored += matches[j].homegoals !== null ? parseInt(matches[j].homegoals) : 0;
            hometeam.goalsagainst += matches[j].awaygoals !== null ? parseInt(matches[j].awaygoals) : 0;
            hometeam.points += (hometeamwin ? 3 : (draw ? 1 : 0));

            awayteam.gamesplayed++;
            awayteam.wins += (awayteamwin ? 1 : 0);
            awayteam.ties += (draw ? 1 : 0);
            awayteam.losses += (hometeamwin ? 1 : 0);
            awayteam.goalsscored += matches[j].awaygoals !== null ? parseInt(matches[j].awaygoals) : 0;
            awayteam.goalsagainst += matches[j].homegoals !== null ? parseInt(matches[j].homegoals) : 0;
            awayteam.points += (awayteamwin ? 3 : (draw ? 1 : 0));

            $filter('filter')(teams, {_id: matches[j].hometeam})[0] = hometeam;
            $filter('filter')(teams, {_id: matches[j].awayteam})[0] = awayteam;
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
            teams[j].points = 0;
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
        
        team.players.push({_id: player, name: player});

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
});