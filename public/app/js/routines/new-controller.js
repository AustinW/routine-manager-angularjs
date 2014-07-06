'use strict'

App.Controllers.controller('RoutineNewController', ['$scope', '$modal', 'Restangular',
    function($scope, $modal, Restangular) {
        $scope.openTrampoline = function() {
            var modalInstance = $modal.open({
                templateUrl: '/app/templates/modals/routine/trampoline.html',
                controller: 'RoutineNewInstanceController',
                resolve: {
                    event: function() {
                        var emptySkillObjects = [],
                            loadingStatuses = [],
                            skillCount = 10;

                        for (var i = 0; i < skillCount; ++i) {
                            emptySkillObjects[i] = {};
                            loadingStatuses[i] = false;
                        }

                        return {
                            key: 'trampoline',
                            title: 'New Trampoline Routine',
                            emptySkillObjects: emptySkillObjects,
                            loadingStatuses: loadingStatuses,
                            skillCount: skillCount,
                            models: [],
                            setOrder: function(skillModels) {
                                return null;
                            },
                            skillValidator: function(skillModels) {
                                return function() {
                                    if (skillModels.length < skillCount)
                                        return false;

                                    return skillCount == _.filter(skillModels, function(skillModel) {
                                        return !!skillModel;
                                    }).length;
                                };
                            }
                        };
                    }
                }
            });

            modalInstance.result.then(function(trampolineRoutine) {

            });
        };

        $scope.openDoubleMini = function() {
            var modalInstance = $modal.open({
                templateUrl: '/app/templates/modals/routine/doublemini.html',
                controller: 'RoutineNewInstanceController',
                resolve: {
                    event: function() {
                        var emptySkillObjects = {
                            0: null,
                            1: null,
                            2: null
                        },
                            loadingStatuses = [],
                            skillCount = 2;

                        for (var i = 0; i < skillCount; ++i) {
                            loadingStatuses[i] = false;
                        }

                        return {
                            key: 'doublemini',
                            title: 'New Double Mini Pass',
                            emptySkillObjects: emptySkillObjects,
                            loadingStatuses: loadingStatuses,
                            skillCount: skillCount,
                            models: {
                                mounter: null,
                                spotter: null,
                                dismount: null
                            },
                            setOrder: function(skillModels) {
                                var order = [];

                                if (skillModels.mounter)
                                    order.push(0);
                                else
                                    order.push(1);

                                order.push(2);

                                return order;
                            },
                            skillValidator: function(skillModels) {
                                return function() {
                                    if (skillModels.length < 2)
                                        return false;

                                    return ( !! skillModels.mounter || !! skillModels.spotter) && !! skillModels.dismount;
                                };
                            }
                        };
                    }
                }
            })
        };

        $scope.openTumbling = function() {

        };
    }
])