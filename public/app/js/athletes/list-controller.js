App.Controllers.controller('AthleteListController', ['$scope', '$window', 'AthleteService', 'Restangular',
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