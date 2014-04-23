'use strict';

var routineManagerControllers = angular.module('routineManager.controllers', []);
routineManagerControllers
    .controller('AthleteListCtrl', ['$scope', '$route', 'Athlete',
        function($scope, $route, Athlete) {
            $scope.athletes = Athlete.query();
        }
    ])
    .controller('RegisterCtrl', [

        function($scope, $sanitize, $location, Authenticate, Flash) {

            /********
             * Alerts
             ********/
            $scope.alerts = [];
            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            /********
             * Login
             ********/
            $scope.login = function() {
                Authenticate.save({
                    'email': $sanitize($scope.email),
                    'password': $sanitize($scope.password)
                }, function() {
                    $location.path('/home')
                    Flash.clear()
                    sessionStorage.authenticated = true;
                }, function(response) {
                    $scope.alerts = [{
                        type: "warning",
                        msg: response.data.message
                    }];
                })
            }


        }
    ])
    .controller('LoginCtrl', [

        function($scope, $sanitize, $location, Authenticate, Flash, $state, $stateParams, $interpolate) {

            /********
             * Alerts
             ********/
            $scope.alerts = [];
            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            /********
             * Login
             ********/
            $scope.login = function() {
                Authenticate.save({
                    'email': $sanitize($scope.email),
                    'password': $sanitize($scope.password)
                }, function() {
                    $location.path('/home')
                    Flash.clear()
                    sessionStorage.authenticated = true;
                }, function(response) {
                    $scope.alerts = [{
                        type: "warning",
                        msg: response.data.message
                    }];
                })
            }


        }
    ])