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
    .directive('emailAvailable', function($http, $timeout) {
        // http://plnkr.co/edit/6r7y0R441ffhGkqqOZ6P?p=preview
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                ctrl.$parsers.push(function(viewValue) {

                    // Set it to true here, otherwise it will not 
                    // clear out when previous validators fail.
                    ctrl.$setValidity('emailAvailable', true);

                    if (ctrl.$valid) {
                        // Set it to false here, because if we need to check 
                        // the validity of the email, it's invalid until the 
                        // AJAX responds.
                        ctrl.$setValidity('checkingEmail', false);

                        if (viewValue !== "" && typeof viewValue !== "undefined") {
                            $http.get('/api/account/email-available?email=' + viewValue)
                                .success(function(data, status, headers, config) {
                                    ctrl.$setValidity('emailAvailable', data.available);
                                    ctrl.$setValidity('checkingEmail', true);
                                })
                                .error(function(data, status, headers, config) {
                                    ctrl.$setValidity('emailAvailable', false);
                                    ctrl.$setValidity('checkingEmail', true);
                                });
                        } else {
                            ctrl.$setValidity('emailAvailable', false);
                            ctrl.$setValidity('checkingEmail', true);
                        }
                    }
                    return viewValue;
                });

            }
        };
    })
    .directive('pwMatch', [

        function() {
            return {
                require: 'ngModel',
                restrict: 'A',
                scope: {
                    match: '='
                },
                link: function(scope, elem, attrs, ctrl) {
                    scope.$watch(function() {
                        return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
                    }, function(currentValue) {
                        ctrl.$setValidity('match', currentValue);
                    });
                }
            };
        }
    ]);