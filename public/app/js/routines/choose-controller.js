'use strict'

App.Controllers.controller('AthleteChooseRoutineController', [
    '$scope',
    '$modalInstance',
    '$filter',
    '$q',
    'Restangular',
    'athlete',
    'routines',
    'AthleteFactory',
    'selectedRoutines',
    'theEvent',

    function($scope, $modalInstance, $filter, $q, Restangular, originalAthlete, routines, AthleteFactory, selectedRoutines, theEvent) {

        $scope.athlete = originalAthlete;

        $scope.routines = routines;

        $scope.routines.unshift({
            id: 0,
            name: 'None'
        });

        $scope.routineLabel = function(routine) {
            return routine.name + ((routine.difficulty) ? ' (' + routine.difficulty + ')' : '');
        };

        $scope.activeRoutine = 0;

        $scope.chosenRoutines = selectedRoutines;

        _.each($scope.athlete[theEvent.routinesKey], function(routine) {
            if (routine && routine.pivot && routine.pivot.routine_type)
                $scope.chosenRoutines[routine.pivot.routine_type] = routine.id;
        });

        $scope.title = $scope.athlete.first_name + '\'s ' + theEvent.title + ' Routines';

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