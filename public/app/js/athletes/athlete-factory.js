'use strict'

App.Factories.factory('AthleteFactory', ['Restangular', 'LEVELS',
    function(Restangular, LEVELS) {

        var AthleteFactory = {
            athletes: [],

            getOne: function(id) {
                return Restangular.one('athletes', id).get();
            },

            getAll: function() {
                return Restangular.all('athletes').getList().then(function (athletesData) {

                    angular.forEach(athletesData, function(athlete) {
                        athlete.compcard = true;
                    });

                    return athletesData;
                });
            },

            levelLabel: function(level) {
                for (var i = 0, s = LEVELS.length; i < s; ++i) {
                    if (LEVELS[i].key === level) {
                        return LEVELS[i].value;
                    }
                }

                return "";
            },

            save: function(athlete) {
                athlete.put().then(function(response) {
                    console.log(response);
                    return response;
                })
            },

            delete: function(athlete) {
                if (confirm('Are you sure you wish to delete this athlete?')) {
                    Restangular.one('athletes', athlete.id).remove().then(function() {
                        AthleteFactory.athletes = _.without(AthleteFactory.athletes, athlete);
                    });
                }
            }
        };

        return AthleteFactory;

    }]
);