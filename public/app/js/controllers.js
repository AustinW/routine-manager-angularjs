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

            $scope.athletes = AthleteService.findAll();
        }
    ])
    .controller('AthleteViewCtrl', ['$scope', '$modal', '$stateParams', 'AthleteService', 'RoutineService', 'Restangular', 'LEVELS', 'ROUTINES',
        function($scope, $modal, $stateParams, AthleteService, RoutineService, Restangular, LEVELS, ROUTINES) {

            $scope.levelLabel = AthleteService.levelLabel;

            $scope.routines = [];

            $scope.hasRoutineTypes = {};

            $scope.athlete = null;

            $scope.athletes = AthleteService.findAll();

            AthleteService.findOne($stateParams.athlete_id).then(function(athlete) {

                $scope.athlete = athlete;

                _.each(['trampoline_routines', 'synchro_routines', 'doublemini_passes', 'tumbling_passes'], function(routineGrouping) {
                    _.each(athlete[routineGrouping], function(routine) {
                        $scope[routine.pivot.routine_type] = routine;
                        $scope.hasRoutineTypes[routine.pivot.routine_type] = true;
                    });
                });

            });

            var athleteResolve = {
                athlete: function() {
                    return $scope.athlete;
                }
            };

            $scope.edit = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/app/views/modals/athlete.html',
                    controller: 'AthleteInstanceCtrl',
                    resolve: athleteResolve
                });

                modalInstance.result.then(function(updatedAthlete) {
                    $scope.athlete = updatedAthlete;
                });
            };

            $scope.chooseTrampoline = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/app/views/modals/choose/trampoline.html',
                    controller: 'AthleteChooseRoutineCtrl',
                    size: 'lg',
                    resolve: {
                        athlete: function() {
                            return $scope.athlete;
                        },
                        routines: function() {
                            return RoutineService.allTrampoline().then(function(routines) {
                                return routines;
                            });
                        },
                        theEvent: function() {
                            return {
                                name: 'trampoline',
                                nameTitle: 'Trampoline',
                                routinesKey: 'trampoline_routines'
                            };
                        },
                        selectedRoutines: function() {
                            return {
                                tra_prelim_compulsory: 0,
                                tra_prelim_optional: 0,
                                tra_semi_final_optional: 0,
                                tra_final_optional: 0
                            };
                        }
                    }
                });

                modalInstance.result.then(function(newlyAssignedRoutines) {
                    $scope.athlete.trampoline_routines = newlyAssignedRoutines;

                    $scope.hasRoutineTypes = [];

                    _.each($scope.athlete.trampoline_routines, function(routine) {
                        if (routine && routine.pivot) {
                            var routineType = routine.pivot.routine_type;

                            $scope[routineType] = routine;
                            $scope.hasRoutineTypes[routineType] = true;
                        }
                    });
                });
            };

            _.each(ROUTINES, function(routineType) {
                $scope.hasRoutineTypes[routineType] = false;
            });
        }
    ])
    .controller('AthleteNewCtrl', ['$scope', '$modal', 'Restangular', 'LEVELS', '$log',
        function($scope, $modal, Restangular, LEVELS, $log) {

            $scope.athlete = {};

            $scope.title = $scope.athlete.hasOwnProperty('first_name') ? 'Edit Athlete' : 'Add an athlete';

            $scope.open = function() {

                var modalInstance = $modal.open({
                    templateUrl: '/app/views/modals/athlete.html',
                    controller: 'AthleteInstanceCtrl',
                    resolve: {
                        athlete: function() {
                            return $scope.athlete;
                        }
                    }
                });
            };
        }
    ])
    .controller('AthleteChooseRoutineCtrl', [
        '$scope',
        '$modalInstance',
        '$filter',
        '$q',
        'Restangular',
        'athlete',
        'routines',
        'AthleteService',
        'selectedRoutines',
        'theEvent',

        function($scope, $modalInstance, $filter, $q, Restangular, originalAthlete, routines, AthleteService, selectedRoutines, theEvent) {

            $scope.athlete = originalAthlete;

            // Refactor done
            $scope.routines = routines;

            // Refactor done
            $scope.routines.unshift({
                id: 0,
                name: 'None'
            });

            $scope.activeRoutine = 0;

            // Refactor done
            $scope.chosenRoutines = selectedRoutines;

            // Refactor done
            _.each($scope.athlete[theEvent.routinesKey], function(routine) {
                if (routine && routine.pivot && routine.pivot.routine_type)
                    $scope.chosenRoutines[routine.pivot.routine_type] = routine.id;
            });

            // Refactor done
            $scope.title = 'Choose ' + theEvent.nameTitle + ' Routines';

            // Refactor done
            $scope.showRoutine = function(routineId) {
                $scope.activeRoutine = $filter('getById')($scope.routines, routineId);
            };

            $scope.save = function(isValid) {

                if (isValid) {

                    var promises = [];

                    _.each($scope.chosenRoutines, function(athleteChosenRoutine, routineType) {
                        console.log(athleteChosenRoutine);
                        // Refactor done
                        var athleteCurrentRoutine = $filter('getRoutine')($scope.athlete[theEvent.routinesKey], routineType) || {
                            id: 0
                        };

                        if (athleteChosenRoutine != athleteCurrentRoutine.id) {

                            if (athleteChosenRoutine) {
                                promises.push(Restangular.one('athletes', $scope.athlete.id).one(routineType, athleteChosenRoutine).put());
                            } else {
                                promises.push(Restangular.one('athletes', $scope.athlete.id).all(routineType).remove());
                            }
                        }
                    });

                    $q.all(promises).then(function(results) {
                        // Refactor done
                        Restangular.one('athletes', $scope.athlete.id).getList(theEvent.name).then(function(routines) {
                            $modalInstance.close(routines);
                        });
                    });

                } else {
                    alert('Form is invalid.');
                    console.log(isValid);
                }
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        }
    ])
    .controller('AthleteInstanceCtrl', ['$scope', '$modalInstance', '$location', 'Restangular', 'athlete', 'LEVELS', 'AthleteService',
        function($scope, $modalInstance, $location, Restangular, originalAthlete, LEVELS, AthleteService) {

            $scope.athlete = Restangular.copy(originalAthlete);

            console.log('Athlete: ', $scope.athlete);

            $scope.athlete.trampoline_level = $scope.athlete.trampoline_level ? $scope.athlete.trampoline_level : '0';
            $scope.athlete.synchro_level = $scope.athlete.synchro_level ? $scope.athlete.synchro_level : '0';
            $scope.athlete.doublemini_level = $scope.athlete.doublemini_level ? $scope.athlete.doublemini_level : '0';
            $scope.athlete.tumbling_level = $scope.athlete.tumbling_level ? $scope.athlete.tumbling_level : '0';

            $scope.genders = ['male', 'female'];

            $scope.athlete.gender = $scope.athlete.gender ? $scope.athlete.gender : 'male';

            $scope.levels = LEVELS;

            if (!$scope.athlete.$fromServer) {
                $scope.title = 'Add an Athlete';
            } else {
                $scope.title = 'Edit ' + $scope.athlete.first_name + ' ' + $scope.athlete.last_name;
            }

            $scope.save = function(isValid) {

                if (isValid) {

                    $scope.athlete.put().then(function(response) {
                        delete $scope.error;
                        $modalInstance.close($scope.athlete);

                        console.log('response', response);
                        $location.path('/athletes/' + response.id);
                    });

                    console.log($scope.athlete);
                } else {
                    alert('form is invalid');
                    console.log(isValid);
                }
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