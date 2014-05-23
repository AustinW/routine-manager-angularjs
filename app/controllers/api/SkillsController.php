<?php

namespace Api;

use \Skill;

use \Input, \Response, \Lang;

class SkillsController extends BaseController {
	
	protected $skillRepository;

	public function __construct(Skill $skill)
	{
		parent::__construct();

		$this->skillRepository = $skill;
	}

	public function getSearch()
	{
		$query = Input::get('query');

		if ( ! $query) {
			return Response::apiError(Lang::get('skill.required'));
		}

		$skills = $this->skillRepository->search($query);

		return $skills->toArray();
	}

	public function getIsValid($query)
	{

	}
}