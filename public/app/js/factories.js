var routineManagerFactories = angular.module('routineManager.factories', ['ngResource']);

routineManagerFactories
    .factory('AuthService', function($rootScope, $http, Session, AUTH_EVENTS) {
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
    })
    .factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
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
    })
    .factory('AthleteService', ['Restangular', 'LEVELS',
        function(Restangular, LEVELS) {
            return {
                findAll: function() {
                    return Restangular.all('athletes').getList().$object;
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
    ])
    .factory('RoutineService', ['Restangular', 'AthleteService',
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

                allTrampoline: function() {
                    return Restangular.all('routines').getList({
                        type: 'trampoline'
                    });
                },

                findOne: function(id) {
                    return Restangular.one('routines', id).get();
                }
            };
        }
    ])