'use strict'

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