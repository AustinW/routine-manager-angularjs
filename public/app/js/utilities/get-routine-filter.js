'use strict'

App.Filters.filter('getRoutine', function() {
    return function(input, key) {
        for (var i = 0, len = input.length; i < len; ++i) {
            if (input[i].pivot != undefined) {
                if (input[i].pivot.routine_type == key) {
                    return input[i];
                }
            } else {
                return null;
            }
        }

        return null;
    }
});