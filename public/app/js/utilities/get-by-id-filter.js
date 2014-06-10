'use strict'

App.Filters.filter('getById', function() {
    return function(input, id) {
        for (var i = 0, len = input.length; i < len; i++) {
            if (+input[i].id == +id) {
                return input[i];
            }
        }
        return null;
    }
});