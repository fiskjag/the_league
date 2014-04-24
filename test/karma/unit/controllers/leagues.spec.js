'use strict';

(function() {
    // Leagues Controller Spec
    describe('MEAN controllers', function() {
        describe('LeaguesController', function() {
            // The $resource service augments the response object with methods for updating and deleting the resource.
            // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
            // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
            // When the toEqualData matcher compares two objects, it takes only object properties into
            // account and ignores methods.
            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            // Load the controllers module
            beforeEach(module('mean'));

            // Initialize the controller and a mock scope
            var LeaguesController,
                scope,
                $httpBackend,
                $stateParams,
                $location;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

                scope = $rootScope.$new();

                LeaguesController = $controller('LeaguesController', {
                    $scope: scope
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;

            }));

            it('$scope.find() should create an array with at least one league object ' +
                'fetched from XHR', function() {

                    // test expected GET request
                    $httpBackend.expectGET('leagues').respond([{
                        name: 'SL 2014'
                    }]);

                    // run controller
                    scope.find();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.leagues).toEqualData([{
                        name: 'SL 2014'
                    }]);

                });

            it('$scope.findOne() should create an array with one league object fetched ' +
                'from XHR using a leagueId URL parameter', function() {
                    // fixture URL parament
                    $stateParams.leagueId = '525a8422f6d0f87f0e407a33';

                    // fixture response object
                    var testLeagueData = function() {
                        return {
                            name: 'SL 2014'
                        };
                    };

                    // test expected GET request with response object
                    $httpBackend.expectGET(/leagues\/([0-9a-fA-F]{24})$/).respond(testLeagueData());

                    // run controller
                    scope.findOne();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.league).toEqualData(testLeagueData());

                });

            // it('$scope.create() with valid form data should send a POST request ' +
            //     'with the form input values and then ' +
            //     'locate to new object URL', function() {

            //         // fixture expected POST data
            //         var postLeagueData = function() {
            //             return {
            //                 name: 'SL 2014'
            //             };
            //         };

            //         // fixture expected response data
            //         var responseLeagueData = function() {
            //             return {
            //                 _id: '525cf20451979dea2c000001',
            //                 name: 'SL 2014'
            //             };
            //         };

            //         // fixture mock form input values
            //         scope.name = 'SL 2014';

            //         // test post request is sent
            //         $httpBackend.expectPOST('leagues', postLeagueData()).respond(responseLeagueData());

            //         // Run controller
            //         scope.create();
            //         $httpBackend.flush();

            //         // test form input(s) are reset
            //         expect(scope.name).toEqual('SL 2014');

            //         // test URL location to new object
            //         expect($location.path()).toBe('/leagues/' + responseLeagueData()._id);
            //     });

            it('$scope.update() should update a valid league', inject(function(Leagues) {

                // fixture rideshare
                var putLeagueData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'SL 2014'
                    };
                };

                // mock league object from form
                var league = new Leagues(putLeagueData());

                // mock league in scope
                scope.league = league;

                // test PUT happens correctly
                $httpBackend.expectPUT(/leagues\/([0-9a-fA-F]{24})$/).respond();

                // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
                //$httpBackend.expectPUT(/leagues\/([0-9a-fA-F]{24})$/, putLeagueData()).respond();
                /*
                Error: Expected PUT /leagues\/([0-9a-fA-F]{24})$/ with different data
                EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An League about MEAN","to":"MEAN is great!"}
                GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An League about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                */

                // run controller
                scope.update();
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/leagues/' + putLeagueData()._id);

            }));

            it('$scope.remove() should send a DELETE request with a valid leagueId' +
                'and remove the league from the scope', inject(function(Leagues) {

                    // fixture rideshare
                    var league = new Leagues({
                        _id: '525a8422f6d0f87f0e407a33'
                    });

                    // mock rideshares in scope
                    scope.leagues = [];
                    scope.leagues.push(league);

                    // test expected rideshare DELETE request
                    $httpBackend.expectDELETE(/leagues\/([0-9a-fA-F]{24})$/).respond(204);

                    // run controller
                    scope.remove(league);
                    $httpBackend.flush();

                    // test after successful delete URL location leagues lis
                    //expect($location.path()).toBe('/leagues');
                    expect(scope.leagues.length).toBe(0);

                }));
        });
    });
}());