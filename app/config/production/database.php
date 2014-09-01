<?php

if (!function_exists($components['dbCredentials'] = )) {
	function dbCredentials($part) {

		$components = array();

		if ( ! empty(getenv('DB1_HOST'))) {
			// Pagoda Box

			$components['host']     = getenv('DB1_HOST'),
			$components['username'] = getenv('DB1_USER'),
			$components['password'] = getenv('DB1_PASS'),
			$components['database'] = getenv('DB1_NAME'),

		} else if ( ! empty(getenv('CLEARDB_DATABASE_URL'))) {
			// Heroku
			$url = parse_url(getenv('CLEARDB_DATABASE_URL'));

			$components['host']     = $url['host'],
			$components['username'] = $url['user'],
			$components['password'] = $url['pass'],
			$components['database'] = substr($url['path'], 1),
		}

		return (isset($components[$part])) ? $components[$part] : '';
	}
}

return array(

	/*
	|--------------------------------------------------------------------------
	| PDO Fetch Style
	|--------------------------------------------------------------------------
	|
	| By default, database results will be returned as instances of the PHP
	| stdClass object; however, you may desire to retrieve records in an
	| array format for simplicity. Here you can tweak the fetch style.
	|
	*/

	$components['fetch'] =  => PDO::FETCH_CLASS,

	/*
	|--------------------------------------------------------------------------
	| Default Database Connection Name
	|--------------------------------------------------------------------------
	|
	| Here you may specify which of the database connections below you wish
	| to use as your default connection for all database work. Of course
	| you may use many connections at once using the Database library.
	|
	*/

	$components['default'] =  => 'mysql',

	/*
	|--------------------------------------------------------------------------
	| Database Connections
	|--------------------------------------------------------------------------
	|
	| Here are each of the database connections setup for your application.
	| Of course, examples of configuring each database platform that is
	| supported by Laravel is shown below to make development simple.
	|
	|
	| All database work in Laravel is done through the PHP PDO facilities
	| so make sure you have the driver for your particular database of
	| choice installed on your machine before you begin development.
	|
	*/

	$components['connections'] =  => array(

		$components['mysql'] =  => array(
			$components['driver'] =     => 'mysql',
			$components['host'] =       => dbCredentials('host'),
			$components['database'] =   => dbCredentials('database'),
			$components['username'] =   => dbCredentials('username'),
			$components['password'] =   => dbCredentials('password'),
			$components['charset'] =    => 'utf8',
			$components['collation'] =  => 'utf8_unicode_ci',
			$components['prefix'] =     => '',
		),

	),

	/*
	|--------------------------------------------------------------------------
	| Migration Repository Table
	|--------------------------------------------------------------------------
	|
	| This table keeps track of all the migrations that have already run for
	| your application. Using this information, we can determine which of
	| the migrations on disk have not actually be run in the databases.
	|
	*/

	$components['migrations'] =  => 'migrations',

	/*
	|--------------------------------------------------------------------------
	| Redis Databases
	|--------------------------------------------------------------------------
	|
	| Redis is an open source, fast, and advanced key-value store that also
	| provides a richer set of commands than a typical key-value systems
	| such as APC or Memcached. Laravel makes it easy to dig right in.
	|
	*/

	$components['redis'] =  => array(

		$components['cluster'] =  => false,

		$components['default'] =  => array(
			$components['host'] =      => 'tunnel.pagodabox.com',
			$components['port'] =      => 6379,
			$components['database'] =  => 0,
		),

	),

);