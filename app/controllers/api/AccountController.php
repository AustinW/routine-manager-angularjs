<?php

namespace Api;

use \User, \Validator, \Input, \Auth, \Response, \Lang, \App, \Event;

use \DateTime;

class AccountController extends BaseController {
	
	protected $userRepository;

	public function __construct(User $user)
	{
		parent::__construct();

		$this->userRepository = $user;
	}

	public function postLogin()
	{
		$validation = Validator::make(Input::all(), ['email' => 'required|email', 'password' => 'required']);

		if ($validation->fails()) {
			return Response::apiValidationError($validation, Input::all(), Lang::get('auth.invalid'));
		}

		if (Auth::check()) {
			return Response::apiError(Lang::get('auth.logged_in'));
		}

		$credentials = [
			'email'    => Input::get('email'),
			'password' => Input::get('password')
		];

		$attempt = Auth::attempt($credentials, (bool) Input::get('remember'));

		if ($attempt) {

			$user = Auth::user();

			$verified = $user->verified_at != null;
			
			if ( ! $verified) {
				Auth::logout();

				return Response::apiError(Lang::get('auth.not_verified'));
			} else {

				return Response::apiMessage(Lang::get('auth.successful'), ['session_id' => \Session::getId(), 'user' => $user->toArray()]);
			}

		} else {
			return Response::apiError(Lang::get('auth.invalid'), 401);
		}
	}

	public function getLogout()
	{
		Auth::logout();

		return Response::apiMessage(Lang::get('auth.logout'));
	}

	public function getCheck()
	{
		$check = ['logged_in' => Auth::check()];

		return ($check['logged_in'])
			? Response::apiMessage(Lang::get('auth.logged_in'), $check)
			: Response::apiMessage(Lang::get('auth.not_logged_in'), $check);
	}

	public function postRegister()
	{
		$validation = Validator::make(Input::all(), [
			'email'       => 'required|email|unique:users|max:100',
			'password'    => 'required|confirmed',
			'first_name'  => 'required|max:50',
			'last_name'   => 'required|max:50',
			'gym_usag_id' => 'required|digits:6',
			'team'        => 'required|max:100',
			'terms'       => 'accepted',
		]);

		if ($validation->fails()) {

			return Response::apiValidationError($validation, Input::all(), Lang::get('auth.registration_failed'));

		} else {
			$newUser = $this->userRepository->create(Input::only(['email', 'password', 'first_name', 'last_name', 'gym_usag_id', 'team']));

			// Automatically verify the account if it is local
			if (App::environment() == 'local') {
				$newUser->verified_at = new DateTime();
				$newUser->save();
			}

			// Fire off an event that a user is registered (maybe fire off an email?)
			Event::fire('account.registered', [$newUser]);

			// Auth::login($newUser); // <-- must be verified first

			return Response::apiMessage(Lang::get('auth.registered'));
		}
	}

	public function getEmailAvailable()
	{
		$validation = Validator::make(Input::all(), ['email' => 'required|email']);

		if ($validation->fails()) {
			return Response::apiValidationError($validation, Input::all(), Lang::get('auth.missing_fields'));
		}

		$email = Input::get('email');

		return ['available' => ! $this->userRepository->where('email', $email)->count(), 'valid' => true];
	}
}