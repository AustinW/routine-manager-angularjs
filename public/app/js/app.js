'use strict';

angular.module('myApp', [
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ui.router',

    'routineManager.controllers',
    'routineManager.services',
    'routineManager.directives',
    'routineManager.providers',
])
    .config(['$routeProvider', '$locationProvider', '$urlRouterProvider',

        function($routeProvider, $locationProvider, $urlRouterProvider) {
            console.log("Initializing router...");

            $routeProvider.when('/athletes', {
                templateUrl: 'app/views/athletes.html',
                controller: 'AthleteListCtrl'
            });

            $locationProvider.html5Mode(true);

            $urlRouterProvider.otherwise("/");
        }
    ])
    .config(function($httpProvider) {
        var interceptor = function($rootScope, $location, $q, Flash) {
            console.log('Registering interceptor...');
            var success = function(response) {
                return response;
            }

            var error = function(response) {
                if (response.status = 401) {
                    delete sessionStorage.authenticated
                    $location.path('/login')
                    Flash.show(response.data.flash)
                }
                return $q.reject(response)
            }
            return function(promise) {
                return promise.then(success, error)
            }
        }
        $httpProvider.responseInterceptors.push(interceptor)

    })
    .run(function($rootScope, $http, CSRF_TOKEN) {
        $http.defaults.headers.common['csrf_token'] = CSRF_TOKEN;
    })