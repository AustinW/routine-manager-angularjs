'use strict';

var App = App || {};

App.Constants = angular.module('application.constants', []);
App.Services = angular.module('application.services', []);
App.Factories = angular.module('application.factories', []);
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
    'application.factories',
    'application.directives',
    'application.constants',
    'application.controllers'
])
    .config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'USER_ROLES',

        function($locationProvider, $urlRouterProvider, $stateProvider, USER_ROLES) {

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: '/app/templates/home.html',
                    controller: 'HomeController',
                    data: {
                        authorizedRoles: null // any
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/app/templates/login.html',
                    controller: 'LoginController',
                    data: {
                        authorizedRoles: null
                    }
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/app/templates/register.html',
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
                    templateUrl: '/app/templates/athletes.html',
                    controller: 'AthleteListController',
                    data: {
                        authorizedRoles: [USER_ROLES.coach]
                    }
                })
                .state('athletes-view', {
                    url: '/athletes/:athlete_id',
                    templateUrl: '/app/templates/athletes/view.html',
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