'use strict';

angular.module('mean.leagues').controller('LeaguesController', ['$scope', '$stateParams', '$location', '$filter', 'Global', 'Leagues', function ($scope, $stateParams, $location, $filter, Global, Leagues) {
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
        });
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
        });
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
            var matches = $scope.group.matches;

            for(var i = 0; i < teams.length; i++) {
                var hometeam = teams[i];
                
                for(var j = i+1; j < teams.length; j++) {
                    var awayteam = teams[j];

                    if(hometeam !== awayteam) {
                        matches.push({hometeam: hometeam, awayteam: awayteam});
                        console.log(hometeam.name + ' vs ' + awayteam.name);
                    }
                }
            }
        });
    };
    // --------------------------- END MATCHES -----------------------------------------
}]);