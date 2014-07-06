'use strict'

App.Controllers.controller('AthleteViewController', ['$scope', '$modal', '$stateParams', '$window', 'AthleteFactory', 'RoutineService', 'Restangular', 'ROUTINES',
    function($scope, $modal, $stateParams, $window, AthleteFactory, RoutineService, Restangular, ROUTINES) {

        $scope.levelLabel = AthleteFactory.levelLabel;

        $scope.routines = [];

        $scope.hasRoutineTypes = {};

        $scope.athlete = null;

        $scope.athletes = AthleteFactory.athletes;

        AthleteFactory.getAll().then(function(data) {
            AthleteFactory.athletes = data;
            $scope.athletes = AthleteFactory.athletes;
        });

        AthleteFactory.getOne($stateParams.athlete_id).then(function(athlete) {

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
                templateUrl: '/app/templates/modals/athlete.html',
                controller: 'AthleteInstanceController',
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
                    templateUrl: '/app/templates/modals/choose/' + eventParams.key + '.html',
                    controller: 'AthleteChooseRoutineController',
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
]);