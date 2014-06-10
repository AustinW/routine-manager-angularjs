'use strict'

App.Services.factory('CompcardService', ['Restangular',
    function(Restangular) {
        return {
            all: function() {
                return Restangular.one('compcard').one('download');
            }
        }
    }
]);