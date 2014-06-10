'use strict'

App.Controllers.controller('RegisterController', ['$scope', '$sanitize', '$location', '$http',
    function($scope, $sanitize, $location, $http) {

        /********
         * Alerts
         ********/
        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.register = function(valid) {
            if (valid) {

                $scope.alerts.splice(0, 1);

                var payload = angular.copy($scope.account);
                payload.password_confirmation = $scope.password_confirm;

                $http.post('/api/account/register', payload)
                // Success
                .success(function(response) {
                    console.log('Success: ', response);
                    $scope.alerts.push({
                        type: 'success',
                        title: 'Registration succeeded',
                        message: 'You are now registered, ' + $scope.account.first_name
                    });

                    // Redirect after 3 seconds
                    window.setTimeout(function() {
                        $location.path('/');
                    }, 3000);

                    // Error
                }).error(function(response) {
                    console.log('Error: ', response);
                    $scope.alerts.push({
                        type: 'danger',
                        title: 'Registration Failed',
                        message: 'Registration could not be completed. Please review the following errors before proceeding.',
                        error_list: response.errors
                    });
                });

            } else {
                alert('Form is invalid. Please correct before proceeding.');
            }
        };

        /********
         * Login
         ********/
        // $scope.login = function() {
        //     Authenticate.save({
        //         'email': $sanitize($scope.email),
        //         'password': $sanitize($scope.password)
        //     }, function() {
        //         $location.path('/home')
        //         sessionStorage.authenticated = true;
        //     }, function(response) {
        //         $scope.alerts = [{
        //             type: "warning",
        //             msg: response.data.message
        //         }];
        //     })
        // }


    }
]);