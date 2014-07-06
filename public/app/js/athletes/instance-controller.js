'use strict'

App.Controllers.controller('AthleteInstanceController', ['$scope', '$modalInstance', '$location', 'Restangular', 'athlete', 'title', 'LEVELS', 'AthleteFactory',
    function($scope, $modalInstance, $location, Restangular, originalAthlete, title, LEVELS, AthleteFactory) {

        $scope.athlete = Restangular.copy(originalAthlete);

        $scope.athlete.trampoline_level = $scope.athlete.trampoline_level ? $scope.athlete.trampoline_level : '0';
        $scope.athlete.synchro_level = $scope.athlete.synchro_level ? $scope.athlete.synchro_level : '0';
        $scope.athlete.doublemini_level = $scope.athlete.doublemini_level ? $scope.athlete.doublemini_level : '0';
        $scope.athlete.tumbling_level = $scope.athlete.tumbling_level ? $scope.athlete.tumbling_level : '0';

        $scope.genders = ['male', 'female'];

        $scope.athlete.gender = $scope.athlete.gender ? $scope.athlete.gender : 'male';

        $scope.levels = LEVELS;

        $scope.title = title;

        $scope.save = function() {
            console.log($scope.athlete);

            AthleteFactory.save($scope.athlete).then(function(athlete) {
                delete $scope.error;

                $modalInstance.close(athlete);
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
])