'use strict'

App.Controllers.controller('AthleteNewController', ['$scope', '$modal', 'Restangular', 'LEVELS',
    function($scope, $modal, Restangular, LEVELS) {

        $scope.athlete = {};

        $scope.open = function() {

            var modalInstance = $modal.open({
                templateUrl: '/app/templates/modals/athlete.html',
                controller: 'AthleteInstanceController',
                resolve: {
                    athlete: function() {
                        return $scope.athlete;
                    },
                    title: function() {
                        return ($scope.athlete.hasOwnProperty('first_name')) ? 'Edit Athlete' : 'Add an athlete';
                    }
                }
            });
        };
    }
])