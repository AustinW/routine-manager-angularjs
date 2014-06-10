'use strict'

App.Directives
    .directive('trampolineRoutine', [

        function() {
            return {
                templateUrl: '/app/views/directives/trampoline-routine.html',
                scope: {
                    routine: '='
                }
            }
        }
    ])
    .directive('doubleminiPass', [

        function() {
            return {
                templateUrl: '/app/views/directives/doublemini-pass.html',
                scope: {
                    pass: '='
                }
            }
        }
    ])
    .directive('tumblingPass', [

        function() {
            return {
                templateUrl: '/app/views/directives/tumbling-pass.html',
                scope: {
                    pass: '='
                }
            }
        }
    ]);