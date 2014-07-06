'use strict'

App.Directives
    .directive('trampolineRoutine', [

        function() {
            return {
                templateUrl: '/app/templates/directives/trampoline-routine.html',
                scope: {
                    routine: '='
                }
            }
        }
    ])
    .directive('doubleminiPass', [

        function() {
            return {
                templateUrl: '/app/templates/directives/doublemini-pass.html',
                scope: {
                    pass: '='
                }
            }
        }
    ])
    .directive('tumblingPass', [

        function() {
            return {
                templateUrl: '/app/templates/directives/tumbling-pass.html',
                scope: {
                    pass: '='
                }
            }
        }
    ]);