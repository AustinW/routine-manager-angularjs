'use strict';
// Source: public/app/js/application/application.js
var App = App || {};

App.Constants = angular.module('application.constants', []);
App.Services = angular.module('application.services', []);
App.Controllers = angular.module('application.controllers', []);
App.Filters = angular.module('application.filters', []);
App.Directives = angular.module('application.directives', []);

angular.module('application', [
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
    'angular-flash.service',
    'angular-flash.flash-alert-directive',
    'restangular',

    'application.filters',
    'application.services',
    'application.directives',
    'application.constants',
    'application.controllers'
])
    .config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'USER_ROLES',

        function($locationProvider, $urlRouterProvider, $stateProvider, USER_ROLES) {

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: '/app/views/home.html',
                    controller: 'HomeController',
                    data: {
                        authorizedRoles: null // any
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/app/views/login.html',
                    controller: 'LoginController',
                    data: {
                        authorizedRoles: null
                    }
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/app/views/register.html',
                    controller: 'RegisterController',
                    data: {
                        authorizedRoles: null
                    }
                })
                .state('logout', {
                    url: '/logout',
                    controller: 'LogoutController',
                    data: {
                        authorizedRoles: null
                    }
                })
                .state('athletes', {
                    url: '/athletes',
                    templateUrl: '/app/views/athletes.html',
                    controller: 'AthleteListController',
                    data: {
                        authorizedRoles: [USER_ROLES.coach]
                    }
                })
                .state('athletes-view', {
                    url: '/athletes/:athlete_id',
                    templateUrl: '/app/views/athletes/view.html',
                    controller: 'AthleteViewController',
                    data: {
                        authorizedRoles: [USER_ROLES.coach]
                    }
                })

            $locationProvider.html5Mode(true);

            $urlRouterProvider.otherwise("/");
        }
    ])
    .config(['RestangularProvider',
        function(RestangularProvider) {
            // Set Restangular base url
            RestangularProvider.setBaseUrl('/api');

        }
    ])
    .config(['flashProvider',
        function(flashProvider) {
            flashProvider.errorClassnames.push('alert-danger');
            flashProvider.warnClassnames.push('alert-warn');
            flashProvider.infoClassnames.push('alert-info');
            flashProvider.successClassnames.push('alert-success');
        }
    ])
    .config(['$httpProvider',
        function($httpProvider) {
            var interceptor = function($rootScope, $location, $q, flash) {

                var success = function(response) {
                    return response;
                }

                var error = function(response) {
                    if (response.status == 401) {
                        delete sessionStorage.authenticated;
                        $location.path('/login');

                        flash.error = 'You must be logged in before accessing that feature.';
                    }

                    return $q.reject(response)
                }
                return function(promise) {
                    return promise.then(success, error)
                }
            }
            $httpProvider.responseInterceptors.push(interceptor)

        }
    ])
    .config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push([
                '$injector',
                function($injector) {
                    return $injector.get('AuthInterceptor');
                }
            ]);
        }
    ])
    .run(['$rootScope', '$http', 'CSRF_TOKEN', 'AuthService', 'AUTH_EVENTS',
        function($rootScope, $http, CSRF_TOKEN, AuthService, AUTH_EVENTS) {
            $http.defaults.headers.common['csrf_token'] = CSRF_TOKEN;

            AuthService.isAuthenticated();

            $rootScope.$on('$stateChangeStart', function(event, next) {

                var authorizedRoles = next.data.authorizedRoles;

                if (!AuthService.isAuthorized(authorizedRoles)) {

                    event.preventDefault();

                    if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    } else {
                        // user is not logged in
                        flash.error = 'You must be logged in before accessing that feature.';
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            });
        }
    ])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionReestablished: 'auth-session-reestablished',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        coach: 'coach',
        guest: 'guest'
    })
    .constant('LEVELS', [{
        key: '0',
        value: 'None'
    }, {
        key: '1',
        value: '1'
    }, {
        key: '2',
        value: '2'
    }, {
        key: '3',
        value: '3'
    }, {
        key: '4',
        value: '4'
    }, {
        key: '5',
        value: '5'
    }, {
        key: '6',
        value: '6'
    }, {
        key: '7',
        value: '7'
    }, {
        key: '8',
        value: '8'
    }, {
        key: '9',
        value: '9'
    }, {
        key: '10',
        value: '10'
    }, {
        key: 'ye',
        value: 'Youth Elite'
    }, {
        key: 'jr',
        value: 'Junior Elite'
    }, {
        key: 'oe',
        value: 'Open Elite'
    }, {
        key: 'sr',
        value: 'Senior Elite'
    }])
    .constant('ROUTINES', [
        'tra_prelim_compulsory', 'tra_prelim_optional', 'tra_semi_final_optional', 'tra_final_optional',
        'sync_prelim_compulsory', 'sync_prelim_optional', 'sync_final_optional',
        'dmt_pass_1', 'dmt_pass_2', 'dmt_pass_3', 'dmt_pass_4',
        'tum_pass_1', 'tum_pass_2', 'tum_pass_3', 'tum_pass_4'
    ]);
// Source: public/app/js/application/application-controller.js
App.Controllers.controller('ApplicationController', ['$scope', '$rootScope', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService',
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
// Source: public/app/js/application/configuration-constants.js
App.Constants.constant('configuration', {
    ITEMS_URL: 'menu/items.json'
});
// Source: public/app/js/athletes/athlete-service.js
App.Services.factory('AthleteService', ['Restangular', 'LEVELS',
    function(Restangular, LEVELS) {
        return {
            findAll: function() {
                return Restangular.all('athletes').getList();
            },
            findOne: function(id) {
                return Restangular.one('athletes', id).get();
            },
            levelLabel: function(level) {
                for (var i = 0, s = LEVELS.length; i < s; ++i) {
                    if (LEVELS[i].key === level) {
                        return LEVELS[i].value;
                    }
                }

                return "";
            }
        };
    }
]);
// Source: public/app/js/athletes/instance-controller.js
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
// Source: public/app/js/athletes/list-controller.js
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
// Source: public/app/js/athletes/new-controller.js
App.Controllers.controller('AthleteNewController', ['$scope', '$modal', 'Restangular', 'LEVELS',
    function($scope, $modal, Restangular, LEVELS) {

        $scope.athlete = {};

        $scope.title = $scope.athlete.hasOwnProperty('first_name') ? 'Edit Athlete' : 'Add an athlete';

        $scope.open = function() {

            var modalInstance = $modal.open({
                templateUrl: '/app/views/modals/athlete.html',
                controller: 'AthleteInstanceController',
                resolve: {
                    athlete: function() {
                        return $scope.athlete;
                    }
                }
            });
        };
    }
])
// Source: public/app/js/athletes/view-controller.js
App.Controllers.controller('AthleteViewController', ['$scope', '$modal', '$stateParams', '$window', 'AthleteService', 'RoutineService', 'Restangular', 'ROUTINES',
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
]);
// Source: public/app/js/authentication/auth-interceptor-service.js
App.Services.factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS',
    function($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function(response) {
                if (response.status === 401) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated,
                        response);
                }
                if (response.status === 403) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized,
                        response);
                }
                if (response.status === 419 || response.status === 440) {
                    $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,
                        response);
                }
                return $q.reject(response);
            }
        };
    }
]);
// Source: public/app/js/authentication/auth-service.js
App.Services.factory('AuthService', ['$rootScope', '$http', 'Session', 'AUTH_EVENTS',
    function($rootScope, $http, Session, AUTH_EVENTS) {
        return {
            login: function(credentials) {
                return $http.post('/api/account/login', credentials).then(function(response) {
                    console.log("Response: ", response.data);
                    Session.create(response.data.data.session_id, response.data.data.user);
                });
            },
            logout: function() {
                return $http.get('/api/account/logout').then(function(response) {
                    console.log("Response: ", response);
                    Session.destroy();
                });
            },
            isAuthenticated: function() {
                if (!Session.user) {
                    $http.get('/api/account/check').then(function(checkResponse) {

                        if (checkResponse.data.data.logged_in) {

                            $http.get('/api/user').then(function(userResponse) {
                                $rootScope.$broadcast(AUTH_EVENTS.sessionReestablished, userResponse.data);
                                Session.create(userResponse.data);
                            });

                        }
                    });
                }
                return !!Session.user;
            },
            isAuthorized: function(authorizedRoles) {
                // No user roles implemented
                return true;

                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }

                return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
            }
        }
    }
]);
// Source: public/app/js/authentication/session-service.js
App.Services.service('Session', ['USER_ROLES',
    function(USER_ROLES) {
        this.create = function(sessionId, user) {
            this.id = sessionId;
            this.user = user;
            // Hardcoded user role
            this.userRole = USER_ROLES.coach;
        };

        this.destroy = function() {
            this.id = null;
            this.user = null;
            this.userRole = null;
        };

        return this;
    }
]);
// Source: public/app/js/compcards/compcard-service.js
App.Services.factory('CompcardService', ['Restangular',
    function(Restangular) {
        return {
            all: function() {
                return Restangular.one('compcard').one('download');
            }
        }
    }
]);
// Source: public/app/js/home/home-controller.js
App.Controllers.controller('HomeController', ['$scope',
    function($scope) {

    }
]);
// Source: public/app/js/routines/choose-controller.js
App.Controllers.controller('AthleteChooseRoutineController', [
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
// Source: public/app/js/routines/new-controller.js
App.Controllers.controller('RoutineNewController', ['$scope', '$modal', 'Restangular',
    function($scope, $modal, Restangular) {
        $scope.openTrampoline = function() {
            var modalInstance = $modal.open({
                templateUrl: '/app/views/modals/routine/trampoline.html',
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
                templateUrl: '/app/views/modals/routine/doublemini.html',
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
// Source: public/app/js/routines/new-instance-controller.js
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
// Source: public/app/js/routines/routine-directives.js
App.Directives
    .directive('trampolineRoutine', [

        function() {
            return {
                templateUrl: '/app/views/directives/trampoline-routine.html',
                scope: {
                    routine: '='
                }
            }
        }
    ])
    .directive('doubleminiPass', [

        function() {
            return {
                templateUrl: '/app/views/directives/doublemini-pass.html',
                scope: {
                    pass: '='
                }
            }
        }
    ])
    .directive('tumblingPass', [

        function() {
            return {
                templateUrl: '/app/views/directives/tumbling-pass.html',
                scope: {
                    pass: '='
                }
            }
        }
    ]);
// Source: public/app/js/routines/routine-service.js
App.Services.factory('RoutineService', ['Restangular', 'AthleteService',
    function(Restangular, AthleteService) {
        return {
            all: function() {
                return Restangular.all('routines').getList();
            },

            allOf: function(eventName) {
                return Restangular.all('routines').getList({
                    type: eventName
                });
            },

            findOne: function(id) {
                return Restangular.one('routines', id).get();
            }
        };
    }
]);
// Source: public/app/js/user/email-available-directive.js
App.Directives.directive('emailAvailable', function($http, $timeout) {
    // http://plnkr.co/edit/6r7y0R441ffhGkqqOZ6P?p=preview
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            ctrl.$parsers.push(function(viewValue) {

                // Set it to true here, otherwise it will not 
                // clear out when previous validators fail.
                ctrl.$setValidity('emailAvailable', true);

                if (ctrl.$valid) {
                    // Set it to false here, because if we need to check 
                    // the validity of the email, it's invalid until the 
                    // AJAX responds.
                    ctrl.$setValidity('checkingEmail', false);

                    if (viewValue !== "" && typeof viewValue !== "undefined") {
                        $http.get('/api/account/email-available?email=' + viewValue)
                            .success(function(data, status, headers, config) {
                                ctrl.$setValidity('emailAvailable', data.available);
                                ctrl.$setValidity('checkingEmail', true);
                            })
                            .error(function(data, status, headers, config) {
                                ctrl.$setValidity('emailAvailable', false);
                                ctrl.$setValidity('checkingEmail', true);
                            });
                    } else {
                        ctrl.$setValidity('emailAvailable', false);
                        ctrl.$setValidity('checkingEmail', true);
                    }
                }
                return viewValue;
            });

        }
    };
});
// Source: public/app/js/user/login-controller.js
App.Controllers.controller('LoginController', ['$scope', '$rootScope', '$location', 'AUTH_EVENTS', 'AuthService', 'Session', 'flash',
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
]);
// Source: public/app/js/user/logout-controller.js
App.Controllers.controller('LogoutController', ['$scope', '$rootScope', '$location', 'AUTH_EVENTS', 'AuthService',
    function($scope, $rootScope, $location, AUTH_EVENTS, AuthService) {
        AuthService.logout().then(function() {
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            $location.path('/');
        }, function() {
            $rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
        });
    }
]);
// Source: public/app/js/user/pw-match-directive.js
App.Directives.directive('pwMatch', [

    function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                match: '='
            },
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(function() {
                    return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
                }, function(currentValue) {
                    ctrl.$setValidity('match', currentValue);
                });
            }
        };
    }
]);
// Source: public/app/js/user/registration-controller.js
App.Controllers.controller('RegisterController', ['$scope', '$sanitize', '$location', '$http',
    function($scope, $sanitize, $location, $http) {

        /********
         * Alerts
         ********/
        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.register = function(valid) {
            if (valid) {

                $scope.alerts.splice(0, 1);

                var payload = angular.copy($scope.account);
                payload.password_confirmation = $scope.password_confirm;

                $http.post('/api/account/register', payload)
                // Success
                .success(function(response) {
                    console.log('Success: ', response);
                    $scope.alerts.push({
                        type: 'success',
                        title: 'Registration succeeded',
                        message: 'You are now registered, ' + $scope.account.first_name
                    });

                    // Redirect after 3 seconds
                    window.setTimeout(function() {
                        $location.path('/');
                    }, 3000);

                    // Error
                }).error(function(response) {
                    console.log('Error: ', response);
                    $scope.alerts.push({
                        type: 'danger',
                        title: 'Registration Failed',
                        message: 'Registration could not be completed. Please review the following errors before proceeding.',
                        error_list: response.errors
                    });
                });

            } else {
                alert('Form is invalid. Please correct before proceeding.');
            }
        };

        /********
         * Login
         ********/
        // $scope.login = function() {
        //     Authenticate.save({
        //         'email': $sanitize($scope.email),
        //         'password': $sanitize($scope.password)
        //     }, function() {
        //         $location.path('/home')
        //         sessionStorage.authenticated = true;
        //     }, function(response) {
        //         $scope.alerts = [{
        //             type: "warning",
        //             msg: response.data.message
        //         }];
        //     })
        // }


    }
]);
// Source: public/app/js/utilities/capitalize-filter.js
App.Filters.filter('capitalize', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.toLowerCase().substr(1);
    };
});
// Source: public/app/js/utilities/get-by-id-filter.js
App.Filters.filter('getById', function() {
    return function(input, id) {
        for (var i = 0, len = input.length; i < len; i++) {
            if (+input[i].id == +id) {
                return input[i];
            }
        }
        return null;
    }
});
// Source: public/app/js/utilities/get-routine-filter.js
App.Filters.filter('getRoutine', function() {
    return function(input, key) {
        for (var i = 0, len = input.length; i < len; ++i) {
            if (input[i].pivot != undefined) {
                if (input[i].pivot.routine_type == key) {
                    return input[i];
                }
            } else {
                return null;
            }
        }

        return null;
    }
});