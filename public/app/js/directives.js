var routineManagerDirectives = angular.module('routineManager.directives', []);

routineManagerDirectives
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
    ])
    .directive('pwCheck', [

        function() {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    var firstPassword = '#' + attrs.pwCheck;
                    elem.add(firstPassword).on('keyup', function() {
                        scope.$apply(function() {
                            var v = elem.val() === $(firstPassword).val();
                            ctrl.$setValidity('pwmatch', v);
                        });
                    });
                }
            }
        }
    ]);