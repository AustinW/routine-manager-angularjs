var routineManagerProviders = angular.module('routineManager.providers', []);

routineManagerProviders
    .provider('Athlete', function() {
        this.$get = ['$resource',
            function($resource) {
                var Athlete = $resource('http://routine-manager-angular.dev/api/athletes/:id', {}, {
                    update: {
                        method: 'PUT'
                    }
                });

                return Athlete;
            }
        ];
    });