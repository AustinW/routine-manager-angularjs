<?php

namespace Api;

use Controller;
use Auth;

class BaseController extends Controller {
	
	protected $user;

	public function __construct()
	{
		$this->user = Auth::user();
	}

	public function userId()
	{
		return $this->user->getKey();
	}
}