'use strict';

angular.module('mean.leagues').controller('LeaguesController', ['$scope', '$stateParams', '$location', '$filter', 'Global', 'Leagues', function ($scope, $stateParams, $location, $filter, Global, Leagues) {
    $scope.global = Global;

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

    $scope.createGroup = function() {
        var league = $scope.league;
        var group = $scope.group;
        
        league.groups.push({name: group});

        league.$update(function() {
            $location.path('leagues/' + league._id);
        });
    };

    $scope.findOneGroup = function() {
        var leagueId = $stateParams.leagueId;
        var groupId = $stateParams.groupId;

        Leagues.get({
            leagueId: leagueId
        }, function(league) {
            var groups = league.groups;
            $scope.group = $filter('filter')(groups, {_id: groupId});
        });
    };
}]);