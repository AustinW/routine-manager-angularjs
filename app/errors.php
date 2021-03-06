<?php

/*
|--------------------------------------------------------------------------
| Application Error Handler
|--------------------------------------------------------------------------
|
| Here you may handle any errors that occur in your application, including
| logging them or displaying custom views for specific errors. You may
| even register several error handlers to handle different types of
| exceptions. If nothing is returned, the default error view is
| shown, which includes a detailed stack trace during debug.
|
*/

App::error(function(Exception $exception, $code)
{
	Log::error($exception);

	if (App::environment('production')) {
		return Response::apiExceptionError($exception, $code);
	}
});

// App::missing(function($exception)
// {
// 	Log::error($exception);
	
//     return Response::apiError(Lang::get('route.not_found'), 404);
// });