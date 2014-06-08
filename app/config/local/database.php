<?php

return array(

	'default' => 'mysql',

	'log'     => true,

	'connections' => array(

		'mysql' => array(
			'driver'    => 'mysql',
			'host'      => 'localhost',
			'database'  => 'routine_manager',
			'username'  => 'homestead',
			'password'  => 'secret', // KqAn/h(CN32+Fy!dxgZq
			'charset'   => 'utf8',
			'collation' => 'utf8_unicode_ci',
			'prefix'    => '',
		),
	)
);