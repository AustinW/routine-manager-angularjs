'use strict';

var routineManagerControllers = angular.module('routineManager.controllers', []);
routineManagerControllers
    .controller('ApplicationCtrl', ['$scope', '$rootScope', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService', 'flash',
        function($scope, $rootScope, USER_ROLES, AUTH_EVENTS, AuthService) {
            $scope.currentUser = null;
            $scope.userRoles = USER_ROLES;
            $scope.isAuthorized = AuthService.isAuthorized;
            $scope.isAuthenticated = AuthService.isAuthenticated;



            var sessionListener = function(ev, user) {
                $scope.currentUser = user;
            }

            $rootScope.$on(AUTH_EVENTS.loginSuccess, sessionListener);
            $rootScope.$on(AUTH_EVENTS.sessionReestablished, sessionListener);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(ev) {
                $scope.currentUser = null;
            });
        }
    ])
    .controller('HomeCtrl', ['$scope',
        function($scope) {

        }
    ])
    .controller('AthleteListCtrl', ['$scope', 'AthleteService', 'Restangular', 'LEVELS',
        function($scope, AthleteService, Restangular, LEVELS) {

            $scope.levelLabel = AthleteService.levelLabel;

            $scope.delete = function(athlete) {
                if (confirm('Are you sure you wish to delete this athlete?')) {
                    Restangular.one('athletes', athlete.id).remove().then(function() {
                        $scope.athletes = _.without($scope.athletes, athlete);
                    });
                }
            };

            AthleteService.findAll().then(function(athletes) {
                $scope.athletes = athletes;
            });
        }
    ])
    .controller('AthleteViewCtrl', ['$scope', '$stateParams', 'AthleteService', 'RoutineService', 'Restangular', 'LEVELS', 'ROUTINES',
        function($scope, $stateParams, AthleteService, RoutineService, Restangular, LEVELS, ROUTINES) {

            $scope.levelLabel = AthleteService.levelLabel;

            $scope.routines = [];

            $scope.hasRoutineTypes = {};

            _.each(ROUTINES, function(routineType) {
                $scope.hasRoutineTypes[routineType] = false;
            });


            AthleteService.findAll().then(function(athletes) {
                $scope.athletes = athletes;

                $scope.athlete = _.find(athletes, function(athlete) {
                    return athlete.id === $stateParams.athlete_id;
                });

                _.each(ROUTINES, function(routineType) {
                    if ($scope.athlete[routineType] != null) {

                        RoutineService.findOne($scope.athlete[routineType]).then(function(routine) {

                            $scope[routineType] = routine;

                            $scope.hasRoutineTypes[routineType] = true;
                        });
                    }
                });

            });
        }
    ])
    .controller('AthleteNewCtrl', ['$scope', '$modal', 'Restangular', 'LEVELS', '$log',
        function($scope, $modal, Restangular, LEVELS, $log) {

            $scope.athlete = {};

            $scope.title = 'Add an athlete';

            $scope.open = function() {

                var modalInstance = $modal.open({
                    templateUrl: 'app/views/modals/athlete.html',
                    controller: 'AthleteInstanceCtrl',
                    resolve: {
                        athlete: function() {
                            return $scope.athlete;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    ])
    .controller('AthleteInstanceCtrl', ['$scope', '$modalInstance', 'athlete',
        function($scope, $modalInstance, athlete) {

            $scope.athlete = athlete;

            $scope.genders = ['male', 'female'];

            if (!$scope.athlete.length) {
                $scope.title = 'Add an Athlete';
            } else {
                $scope.title = 'Edit ' + $scope.athlete.first_name + ' ' + $scope.athlete.last_name;
            }

            $scope.save = function() {
                console.log($scope.athlete);
                $modalInstance.close();

            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        }
    ])
    .controller('RegisterCtrl', [

        function($scope, $sanitize, $location, Authenticate) {

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
    .controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AUTH_EVENTS', 'AuthService', 'Session', 'flash',
        function($scope, $rootScope, $location, AUTH_EVENTS, AuthService, Session, flash) {
            $scope.credentials = {
                email: '',
                password: ''
            };

            $scope.alerts = [];

            $scope.$on(AUTH_EVENTS.loginFailed, function(ev, message) {
                $scope.alerts.push({
                    type: 'danger',
                    title: 'Login failed',
                    message: message || 'Invalid email or password.'
                });

                $scope.credentials.password = '';
            });

            $scope.$on(AUTH_EVENTS.notAuthorized, function(ev) {
                $scope.alerts.push({
                    type: 'danger',
                    title: 'Not Authorized',
                    message: 'Please login before accessing that page.'
                });
            });

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            $scope.login = function(credentials) {

                $scope.alerts = [];

                AuthService.login(credentials).then(function() {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, Session.user);
                    flash.success = 'You are now logged in, ' + Session.user.first_name;
                    $location.path('/');
                }, function(response) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed, response.data.message);
                });
            };
        }
    ])
    .controller('LogoutCtrl', ['$scope', '$rootScope', '$location', 'AUTH_EVENTS', 'AuthService',
        function($scope, $rootScope, $location, AUTH_EVENTS, AuthService) {
            AuthService.logout().then(function() {
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                $location.path('/');
            }, function() {
                $rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
            });
        }
    ])