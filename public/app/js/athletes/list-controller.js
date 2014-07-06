'use strict'

App.Controllers.controller('AthleteListController', ['$scope', '$window', 'Restangular', 'AthleteFactory',
    function($scope, $window, Restangular, AthleteFactory) {

        $scope.levelLabel = AthleteFactory.levelLabel;

        $scope.athletes = AthleteFactory.athletes;

        AthleteFactory.getAll().then(function(data) {
            AthleteFactory.athletes = data;
            $scope.athletes = AthleteFactory.athletes;
        });

        $scope.delete = AthleteFactory.delete;

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
]);