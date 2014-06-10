'use strict'

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