'use strict'

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