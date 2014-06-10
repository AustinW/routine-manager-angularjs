'use strict'

App.Filters.filter('capitalize', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.toLowerCase().substr(1);
    };
});