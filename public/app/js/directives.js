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
    .directive('emailAvailable', function($http, $timeout) { // available
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                console.log(ctrl);
                ctrl.$parsers.push(function(viewValue) {
                    // set it to true here, otherwise it will not 
                    // clear out when previous validators fail.
                    ctrl.$setValidity('emailAvailable', true);
                    if (ctrl.$valid) {
                        // set it to false here, because if we need to check 
                        // the validity of the email, it's invalid until the 
                        // AJAX responds.
                        ctrl.$setValidity('checkingEmail', false);

                        // now do your thing, chicken wing.
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