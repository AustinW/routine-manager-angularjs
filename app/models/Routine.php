<?php

use \App;
use \SkillAnalysis;
use \Skill;

class Routine extends \BaseModel
{
	protected $softDelete = true;

	protected $fillable = ['name', 'description', 'type'];

	protected $appends = ['difficulty'];

	public static $whichRoutineFields = [
		'tra_prelim_compulsory',
		'tra_prelim_optional',
		'tra_semi_final_optional',
		'tra_final_optional',

		'dmt_pass_1',
		'dmt_pass_2',
		'dmt_pass_3',
		'dmt_pass_4',

		'tum_pass_1',
		'tum_pass_2',
		'tum_pass_3',
		'tum_pass_4',

		'syn_prelim_compulsory',
		'syn_prelim_optional',
		'syn_semi_final_optional',
		'syn_final_optional',
	];

	public static $rules = array(
        'type'   => 'in:trampoline,doublemini,tumbling,synchro',
        'name'   => 'required',
    );

	/**
	 * Skill model dependency
	 * @var Skill
	 */
    protected $skillRepository;

    public function __construct()
    {
    	parent::__construct();

    	$this->skillRepository = App::make('Skill');
    }

	/*
	|--------------------------------------------------------------------------
	| Relationships
	|--------------------------------------------------------------------------
	|
	| Eloquent ORM Relationships
	|
	*/
	public function user()     { return $this->belongsTo('User'); }
	public function athletes() { return $this->belongsToMany('Athlete', 'athlete_routines', 'athlete_id', 'routine_id'); }
	
	public function skills()
	{
		return $this->belongsToMany('Skill', 'routine_skill', 'routine_id', 'skill_id')
			->withPivot('order_index')
			->orderBy('routine_skill.order_index', 'asc');
	}

	// Trampoline scoped queries
	public function scopeTraPrelimCompulsory($query)  { return $query->where('routine_type', '=', 'tra_prelim_compulsory'); }
	public function scopeTraPrelimOptional($query)    { return $query->where('routine_type', '=', 'tra_prelim_optional'); }
	public function scopeTraSemiFinalOptional($query) { return $query->where('routine_type', '=', 'tra_semi_final_optional'); }
	public function scopeTraFinalOptional($query)     { return $query->where('routine_type', '=', 'tra_final_optional'); }

	public function routineType()
	{
		if (isset($this->pivot) && isset($this->pivot->routine_type))
			return $this->pivot->routine_type;
		else
			return null;
	}

	public function attachSkills(array $skillIds, $order = array())
	{
		$skillsCollection = new Illuminate\Database\Eloquent\Collection();

		if (empty($order)) {
			$order = range(0, count($skillIds));
		}

        $index = 0;
        foreach ($skillIds as $skillId) {
            $skill = $this->skillRepository->find($skillId);

            $this->skills()->attach($skill->id, array('order_index' => $order[$index] ));

            $skillsCollection->add($skill);

            ++$index;
        }

        return $skillsCollection;
	}

	public function analyzeSkills()
	{
		$skillRepository = App::make('Skill');

		$analysis = new SkillAnalysis();

		// Loop through each skill of the routine
		foreach ($this->skills as $index => $skill) {

			// Perform a fuzzy search to identify the skill given
			$fuzzySkill = $skillRepository->fuzzyFind($skill);

			// If the skill was identified, convert the model to an array and append
			if ($fuzzySkill) {

				// Need to convert to skill object
				$analysis->skills[] = $fuzzySkill->toArray();

			} else {

				$analysis->errors[] = ['index' => $index, 'skill' => $skill];

			}
		}

		if ($analysis->problem()) {
			$analysis->message = 'There was an issue analyzing the inputted skills.';
		}

		return $analysis;
	}

	public function eventDifficulty($event)
	{
		$total = 0.0;

		foreach ($this->skills as $skill) {
			$total += (float) $skill->{$event . '_difficulty'};
		}

		return sprintf('%0.1f', $total);
	}

	public function routinesForUser($user_id)
	{
		return static::where('user_id', $user_id)->whereNull('deleted_at');
	}

	public static function simpleRoutineArray($collection, $withEmpty = true)
	{
		$routines = ($withEmpty) ? ['' => 'None'] : [];

		foreach ($collection as $routine) {
			$routines[$routine->_id] = $routine->name;
		}

		return $routines;
	}

	public static function correctType($routineType, $whichRoutine)
	{
		$routineTypes = self::$whichRoutineFields;

		$routineTypes['tra_prelim_compulsory']   = 'trampoline';
		$routineTypes['tra_prelim_optional']     = 'trampoline';
		$routineTypes['tra_semi_final_optional'] = 'trampoline';
		$routineTypes['tra_final_optional']      = 'trampoline';

		$routineTypes['dmt_pass_1'] = 'doublemini';
		$routineTypes['dmt_pass_2'] = 'doublemini';
		$routineTypes['dmt_pass_3'] = 'doublemini';
		$routineTypes['dmt_pass_4'] = 'doublemini';

		$routineTypes['tum_pass_1'] = 'tumbling';
		$routineTypes['tum_pass_2'] = 'tumbling';
		$routineTypes['tum_pass_3'] = 'tumbling';
		$routineTypes['tum_pass_4'] = 'tumbling';

		$routineTypes['syn_prelim_compulsory']   = 'synchro';
		$routineTypes['syn_prelim_optional']     = 'synchro';
		$routineTypes['syn_semi_final_optional'] = 'synchro';
		$routineTypes['syn_final_optional']      = 'synchro';

		return ($routineType == $routineTypes[$whichRoutine]);
	}

	public static function descriptiveRoutineType($routineType)
	{
		$descriptions = array_combine(self::$whichRoutineFields, array(
			'trampoline prelim compulsory',
			'trampoline prelim optional',
			'trampoline semi final optional',
			'trampoline final optional',

			'double mini pass 1',
			'double mini pass 2',
			'double mini pass 3',
			'double mini pass 4',

			'tumbling pass 1',
			'tumbling pass 2',
			'tumbling pass 3',
			'tumbling pass 4',

			'synchro prelimcompulsory',
			'synchro prelimoptional',
			'synchro semifinaloptional',
			'synchro finaloptional',
		));

		return $descriptions[$routineType];
	}

	public function getDifficultyAttribute()
	{
		return $this->eventDifficulty($this->type);
	}
}