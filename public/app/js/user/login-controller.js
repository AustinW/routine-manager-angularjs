'use strict'

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