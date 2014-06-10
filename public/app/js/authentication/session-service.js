'use strict'

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