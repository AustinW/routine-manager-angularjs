'use strict'

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