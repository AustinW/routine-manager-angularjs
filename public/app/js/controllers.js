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
    .controller('AthleteListCtrl', ['$scope', '$window', 'AthleteService', 'Restangular',
        function($scope, $window, AthleteService, Restangular) {

            $scope.levelLabel = AthleteService.levelLabel;

            $scope.allCompcards = true;

            AthleteService.findAll().then(function(athletes) {

                $scope.athletes = athletes;

                _.each(athletes, function(athlete) {

                    athlete.compcard = true;
                });
            });

            $scope.delete = function(athlete) {
                if (confirm('Are you sure you wish to delete this athlete?')) {
                    Restangular.one('athletes', athlete.id).remove().then(function() {
                        $scope.athletes = _.without($scope.athletes, athlete);
                    });
                }
            };

            $scope.selectAllCompcards = function() {
                _.each($scope.athletes, function(athlete) {
                    athlete.compcard = $scope.allCompcards;
                });
            };

            $scope.downloadCompcards = function() {
                var athletesToDownload = _.filter($scope.athletes, function(athlete) {
                    return athlete.compcard;
                });

                $window.location.href = '/api/compcard?athletes=' + _.pluck(athletesToDownload, 'id').join(',');
            };

            $scope.athletesToDownloadCount = function() {
                var count = _.filter($scope.athletes, function(athlete) {
                    return athlete.compcard;
                }).length;

                return count == 0;
            }
        }
    ])
    .controller('AthleteViewCtrl', ['$scope', '$modal', '$stateParams', '$window', 'AthleteService', 'RoutineService', 'Restangular', 'ROUTINES',
        function($scope, $modal, $stateParams, $window, AthleteService, RoutineService, Restangular, ROUTINES) {

            $scope.levelLabel = AthleteService.levelLabel;

            $scope.routines = [];

            $scope.hasRoutineTypes = {};

            $scope.athlete = null;

            $scope.athletes = AthleteService.findAll().$object;

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

            $scope.downloadCompcards = function() {
                $window.location.href = '/api/compcard?athletes=' + $scope.athlete.id;
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

            var resolveNewRoutines = function(eventKey) {
                return function(routinesForEvent) {
                    $scope.athlete[eventKey] = routinesForEvent;

                    $scope.hasRoutineTypes = [];

                    _.each($scope.athlete[eventKey], function(routine) {
                        if (routine && routine.pivot) {
                            var routineType = routine.pivot.routine_type;

                            $scope[routineType] = routine;
                            $scope.hasRoutineTypes[routineType] = true;
                        }
                    });
                };
            };

            var chooseRoutineModal = function(eventParams, specificRoutines) {
                return function() {
                    var modalInstance = $modal.open({
                        templateUrl: '/app/views/modals/choose/' + eventParams.key + '.html',
                        controller: 'AthleteChooseRoutineCtrl',
                        size: 'lg',
                        resolve: {
                            athlete: function() {
                                return $scope.athlete;
                            },
                            routines: function() {
                                var routineSource = eventParams.routineSource || eventParams.key;
                                return RoutineService.allOf(routineSource).then(function(routines) {
                                    return routines;
                                });
                            },
                            theEvent: function() {
                                return eventParams;
                            },
                            selectedRoutines: function() {
                                return specificRoutines;
                            }
                        }
                    });

                    modalInstance.result.then(resolveNewRoutines(eventParams.routinesKey));
                };
            };

            $scope.chooseTrampoline = chooseRoutineModal({
                key: 'trampoline',
                title: 'Trampoline',
                routinesKey: 'trampoline_routines'
            }, {
                tra_prelim_compulsory: 0,
                tra_prelim_optional: 0,
                tra_semi_final_optional: 0,
                tra_final_optional: 0
            });

            $scope.chooseSynchro = chooseRoutineModal({
                key: 'synchro',
                routineSource: 'trampoline',
                title: 'Synchro',
                routinesKey: 'synchro_routines'
            }, {
                sync_prelim_compulsory: 0,
                sync_prelim_optional: 0,
                sync_final_optional: 0
            });

            $scope.chooseDoubleMini = chooseRoutineModal({
                key: 'doublemini',
                title: 'Double Mini',
                routinesKey: 'doublemini_passes'
            }, {
                dmt_pass_1: 0,
                dmt_pass_2: 0,
                dmt_pass_3: 0,
                dmt_pass_4: 0
            });

            $scope.chooseTumbling = chooseRoutineModal({
                key: 'tumbling',
                title: 'Tumbling',
                routinesKey: 'tumbling_passes'
            }, {
                tum_pass_1: 0,
                tum_pass_2: 0,
                tum_pass_3: 0,
                tum_pass_4: 0
            });

            _.each(ROUTINES, function(routineType) {
                $scope.hasRoutineTypes[routineType] = false;
            });
        }
    ])
    .controller('RoutineNewCtrl', ['$scope', '$modal', 'Restangular',
        function($scope, $modal, Restangular) {
            $scope.openTrampoline = function() {

            };

            $scope.openDoubleMini = function() {

            };

            $scope.openTumbling = function() {

            };
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

            $scope.routines = routines;

            $scope.routines.unshift({
                id: 0,
                name: 'None'
            });

            $scope.activeRoutine = 0;

            $scope.chosenRoutines = selectedRoutines;

            _.each($scope.athlete[theEvent.routinesKey], function(routine) {
                if (routine && routine.pivot && routine.pivot.routine_type)
                    $scope.chosenRoutines[routine.pivot.routine_type] = routine.id;
            });

            $scope.title = 'Choose ' + theEvent.title + ' Routines';

            $scope.showRoutine = function(routineId) {
                $scope.activeRoutine = $filter('getById')($scope.routines, routineId);
            };

            $scope.save = function(isValid) {

                if (isValid) {

                    var promises = [];

                    _.each($scope.chosenRoutines, function(athleteChosenRoutine, routineType) {

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

                        Restangular.one('athletes', $scope.athlete.id).getList(theEvent.key).then(function(routines) {
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