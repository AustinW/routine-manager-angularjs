'use strict'

App.Services.factory('RoutineService', ['Restangular', 'AthleteFactory',
    function(Restangular, AthleteFactory) {
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