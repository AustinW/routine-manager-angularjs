<?php

namespace Api;

use \User, \Validator, \Input, \Auth, \Response, \Lang;

class UserController extends BaseController {
	
	protected $userRepository;

	public function __construct(User $user)
	{
		parent::__construct();

		$this->userRepository = $user;
	}

	public function getIndex($id = null)
	{
		if ( ! $id) {
			if (Auth::check()) {
				return $this->user;
			} else {
				return Response::apiError(Lang::get('auth.not_logged_in'), 403);
			}
		}
		
	}
}