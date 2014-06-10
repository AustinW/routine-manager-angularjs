'use strict'

App.Controllers.controller('AthleteInstanceController', ['$scope', '$modalInstance', '$location', 'Restangular', 'athlete', 'LEVELS', 'AthleteService',
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