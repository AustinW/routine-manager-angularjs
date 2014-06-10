App.Controllers.controller('RoutineNewInstanceController', ['$scope', '$location', '$modalInstance', 'Restangular', 'event',
    function($scope, $location, $modalInstance, Restangular, event) {
        $scope.title = event.title;

        $scope.event = event.key;
        $scope.routine = {};
        $scope.skill = [];

        $scope.form = {
            skills: [],
            loading: [],
            valid: []
        };

        $scope.skillModels = event.models;

        $scope.form.skills = event.emptySkillObjects;
        $scope.form.loading = event.loadingStatuses;

        $scope.allSkillsValid = event.skillValidator($scope.skillModels);

        $scope.difficulty = function(skill) {
            return skill[event.key + '_difficulty'];
        };

        $scope.checkValid = function(index) {
            $scope.form.valid[index] = false;
            $scope.skillModels[index] = null;
        };

        $scope.skillSelected = function($item, $model, $index) {
            $scope.form.valid[$index] = true;
            $scope.skillModels[$index] = $item;
        };

        $scope.searchSkills = function(query, index) {
            $scope.form.loading[index] = true;

            return Restangular.all('skills').one('search').get({
                query: query
            }).then(function(response) {
                $scope.form.loading[index] = false;

                return response;
            });
        };

        $scope.save = function(isValid) {
            if (isValid) {

                Restangular.all('routines').post({
                    name: $scope.routine.name,
                    description: $scope.routine.description,
                    type: event.key,
                    skills: _.filter(_.map($scope.skillModels, function(skillModel) {
                        return (skillModel) ? skillModel.id : skillModel;
                    }), function(skillModel) {
                        return !!skillModel;
                    }),
                    order: event.setOrder($scope.skillModels)
                }).then(function(response) {
                    delete $scope.error;
                    $modalInstance.close(response);

                    console.log('response', response);
                    $location.path('/routines/' + response.id);
                });
            } else {
                alert('form is invalid');
                console.log(isValid);
            }
        };
    }
]);