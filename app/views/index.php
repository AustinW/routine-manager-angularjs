<!DOCTYPE html>
<html lang="en" ng-app="myApp">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">

	<title>Routine Manager</title>
	<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
	<link href="assets/style.min.css" rel="stylesheet">

</head>

<body>

<div class="container">
  <div class="header">

    <!-- Static navbar -->
    <div class="navbar navbar-default">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a href="/" class="navbar-brand">Routine Manager</a>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Athletes <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li><a href="#">New</a></li>
              <li><a href="/athletes">View</a></li>
              <li><a href="#">Search</a></li>
            </ul>
          </li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Routines <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li>
                <a href="#">New</a>
                <ul class="dropdown-menu">
                  <li><a href="#">Trampoline</a></li>
                  <li><a href="#">Synchro</a></li>
                  <li><a href="#">Double-Mini</a></li>
                  <li><a href="#">Tumbling</a></li>
                </ul>
              </li>
              <li>
                <a href="#">View</a>
                <ul class="dropdown-menu">
                  <li><a href="#">Trampoline</a></li>
                  <li><a href="#">Synchro</a></li>
                  <li><a href="#">Double-Mini</a></li>
                  <li><a href="#">Tumbling</a></li>
                </ul>
              </li>
              <li><a href="#">Search</a></li>
            </ul>
          </li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Compcards <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li><a href="#">New</a></li>
              <li><a href="#">View</a></li>
            </ul>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Account <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <!-- {{#if session.isAuthenticated }} -->
              <li><a href="#"><i class="fa fa-user"></i> <strong>User name</strong></a></li>
              <li><a href="#"><i class="fa fa-sign-out"></i> Logout</a></li>
              <!-- {{else}} -->
              <li><a href="#"><i class="fa fa-sign-in"></i> Login</a></li>
              <li><a href="#"><i class="fa fa-edit"></i> Register</a></li>
              <!-- {{/if}} -->
            </ul>
          </li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </div>

  <div class="container">
  	<div ng-view></div>
  </div>

  <div class="footer">
    <hr>
    <p class="pull-left">&copy; 2013 Austin White</p>
    <p class="pull-right">
      <a href="http://www.facebook.com/" target="_blank"><i class="icon-facebook"></i></a>
      <a href="http://www.twitter.com/" target="_blank"><i class="icon-twitter"></i></a>
      <a href="http://plus.google.com/" target="_blank"><i class="icon-google-plus"></i></a>
    </p>
  </div>
</div>

<script src="assets/tmp/concat.js"></script>

<script src="app/js/app.js"></script>
<script src="app/js/controllers.js"></script>
<script src="app/js/directives.js"></script>
<script src="app/js/providers.js"></script>
<!-- <script src="app/js/filters.js"></script> -->
<script src="app/js/services.js"></script>
<script>
	var myApp = angular.module('myApp');
	myApp.constant("CSRF_TOKEN", '<?php echo csrf_token(); ?>');

	//Chrome passes the error object (5th param) which we must use since it now truncates the Msg (1st param).
    window.onerror = function (errorMsg, url, lineNumber, columnNumber, errorObject) {
        var errMsg;
        //check the errorObject as IE and FF don't pass it through (yet)
        if (errorObject && errorObject !== undefined) {
                errMsg = errorObject.message;
            }
            else {
                errMsg = errorMsg;
            }
        console.error(errMsg);
    }

    var throwError = function () {
        throw new Error(
        'Something went wrong. Something went wrong. Something went wrong. Something went wrong. ' +
        'Something went wrong. Something went wrong. Something went wrong. Something went wrong. ' + 
        'Something went wrong. Something went wrong. Something went wrong. Something went wrong. ' + 
        'Text does not get truncated! :-)');
    }
</script>

</body>

</html>