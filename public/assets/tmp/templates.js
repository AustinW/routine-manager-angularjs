angular.module('application').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/templates/athletes.html',
    "<div class=\"row\">\n" +
    "\t<div class=\"col-md-12\">\n" +
    "\t\t\n" +
    "\t\t<table class=\"table table-striped table-bordered table-hover table-responsive\">\n" +
    "\t\t\t<thead>\n" +
    "\t\t\t\t<tr>\n" +
    "\t\t\t\t\t<th><input type=\"checkbox\" ng-change=\"selectAllCompcards()\" ng-model=\"allCompcards\" checked=\"checked\"></th>\n" +
    "\t\t\t\t\t<th>Name</th>\n" +
    "\t\t\t\t\t<th>Birthdate</th>\n" +
    "\t\t\t\t\t<th>TRA</th>\n" +
    "\t\t\t\t\t<th>TRS</th>\n" +
    "\t\t\t\t\t<th>DMT</th>\n" +
    "\t\t\t\t\t<th>TUM</th>\n" +
    "\t\t\t\t\t<th>Edit</th>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t</thead>\n" +
    "\t\t\t<tbody>\n" +
    "\t\t\t\t<tr ng-repeat=\"athlete in athletes\">\n" +
    "\t\t\t\t\t<td><input type=\"checkbox\" ng-model=\"athlete.compcard\"></td>\n" +
    "\t\t\t\t\t<td><a href=\"/athletes/{{athlete.id}}\">{{ athlete.first_name }} {{ athlete.last_name }}</a></td>\n" +
    "\t\t\t\t\t<td>{{ athlete.birthday }}</td>\n" +
    "\t\t\t\t\t<td>{{ levelLabel(athlete.trampoline_level) }}</td>\n" +
    "\t\t\t\t\t<td>{{ levelLabel(athlete.synchro_level) }}</td>\n" +
    "\t\t\t\t\t<td>{{ levelLabel(athlete.doublemini_level) }}</td>\n" +
    "\t\t\t\t\t<td>{{ levelLabel(athlete.tumbling_level) }}</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<button ng-click=\"delete(athlete)\" class=\"btn btn-danger\"><i class=\"fa fa-trash-o\"></i> Delete</button>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t</tbody>\n" +
    "\t\t</table>\n" +
    "\t\t\n" +
    "\t\t<div class=\"panel panel-default\">\n" +
    "\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t<button class=\"btn btn-success btn-lg\" ng-click=\"downloadCompcards()\" ng-disabled=\"athletesToDownloadCount()\"><i class=\"fa fa-download\"></i> Compcards</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/athletes/view.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-3\">\n" +
    "    <h4>Athletes:</h4>\n" +
    "    <ul class=\"nav nav-pills nav-stacked\">\n" +
    "      <li ng-repeat=\"athlete in athletes\"><a href=\"/athletes/{{athlete.id}}\">{{ athlete.first_name }} {{ athlete.last_name }}</a></li>\n" +
    "      <li><a href=\"/athletes\"><i class=\"fa fa-arrow-circle-left\"></i> View all</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-9\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-sm-6 col-md-2\">\n" +
    "        <i class=\"fa fa-{{ athlete.gender }}\" style=\"font-size:160px\"></i>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-6 col-md-10\">\n" +
    "        <h1 class=\"athlete-header\">{{ athlete.first_name }} {{athlete.last_name}}</h1>\n" +
    "        \n" +
    "        <p style=\"margin-top:20px\">\n" +
    "          <span><i class=\"fa fa-group\"></i> {{ athlete.team }}</span><br />\n" +
    "          <span><i class=\"fa fa-calendar\"></i> {{ athlete.birthday }}</span><br />\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-lg-4\">\n" +
    "          <h3>Levels</h3>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-lg-3\">\n" +
    "          <h4 class=\"trampoline\">Trampoline</h4>\n" +
    "          <label for=\"trampoline_level\">Level:</label>\n" +
    "          {{ levelLabel(athlete.trampoline_level) }}\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-3\">\n" +
    "          <h4 class=\"synchro\">Synchro</h4>\n" +
    "          <label for=\"synchro_level\">Level:</label>\n" +
    "          {{ levelLabel(athlete.synchro_level) }}\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-3\">\n" +
    "          <h4 class=\"double-mini\">Double Mini</h4>\n" +
    "          <label for=\"doublemini_level\">Level:</label>\n" +
    "          {{ levelLabel(athlete.doublemini_level) }}\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-3\">\n" +
    "          <h4 class=\"tumbling\">Tumbling</h4>\n" +
    "          <label for=\"tumbling_level\">Level:</label>\n" +
    "          {{ levelLabel(athlete.tumbling_level) }}\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-lg-4\">\n" +
    "          <h3>Routines</h3>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-lg-3\">\n" +
    "          <h4 class=\"event-panel\">Trampoline</h4>\n" +
    "          <a href=\"#\" ng-click=\"chooseTrampoline()\" class=\"btn btn-xs btn-info\" ng-disabled=\" ! athlete.trampoline_level\">\n" +
    "            <i class=\"fa fa-cog\"></i> Choose\n" +
    "          </a>\n" +
    "\n" +
    "          <dl>\n" +
    "            <dt>Prelim Compulsory:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.tra_prelim_compulsory == true\">\n" +
    "                {{ tra_prelim_compulsory.name }} (<strong>{{ tra_prelim_compulsory.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.tra_prelim_compulsory\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Prelim Optional:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.tra_prelim_optional == true\">\n" +
    "                {{ tra_prelim_optional.name }} (<strong>{{ tra_prelim_optional.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.tra_prelim_optional\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Semi-Final Optional:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.tra_semi_final_optional == true\">\n" +
    "                {{ tra_semi_final_optional.name }} (<strong>{{ tra_semi_final_optional.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.tra_semi_final_optional\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Final Optional:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.tra_final_optional == true\">\n" +
    "                {{ tra_final_optional.name }} (<strong>{{ tra_final_optional.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.tra_final_optional\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "          </dl>\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-3\">\n" +
    "          <h4 class=\"event-panel\">Synchro</h4>\n" +
    "          <a href=\"#\" ng-click=\"chooseSynchro()\" class=\"btn btn-xs btn-info\" ng-disabled=\" ! athlete.synchro_level\">\n" +
    "            <i class=\"fa fa-cog\"></i> Choose\n" +
    "          </a>\n" +
    "          \n" +
    "          <dl>\n" +
    "            <dt>Prelim Compulsory:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.sync_prelim_compulsory == true\">\n" +
    "                {{ sync_prelim_compulsory.name }} (<strong>{{ sync_prelim_compulsory.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.sync_prelim_compulsory\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Prelim Optional:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.sync_prelim_optional == true\">\n" +
    "                {{ sync_prelim_optional.name }} (<strong>{{ sync_prelim_optional.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.sync_prelim_optional\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Final Optional:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.sync_final_optional == true\">\n" +
    "                {{ sync_final_optional.name }} (<strong>{{ sync_final_optional.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.sync_final_optional\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "          </dl>\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-3\">\n" +
    "          <h4 class=\"event-panel\">Double Mini</h4>\n" +
    "          <a href=\"#\" ng-click=\"chooseDoubleMini()\" class=\"btn btn-xs btn-info\" ng-disabled=\" ! athlete.doublemini_level\">\n" +
    "            <i class=\"fa fa-cog\"></i> Choose\n" +
    "          </a>\n" +
    "\n" +
    "          <dl>\n" +
    "            <dt>Pass 1:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.dmt_pass_1 == true\">\n" +
    "                {{ dmt_pass_1.name }} (<strong>{{ dmt_pass_1.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.dmt_pass_1\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Pass 2:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.dmt_pass_2 == true\">\n" +
    "                {{ dmt_pass_2.name }} (<strong>{{ dmt_pass_2.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.dmt_pass_2\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Pass 3:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.dmt_pass_3 == true\">\n" +
    "                {{ dmt_pass_3.name }} (<strong>{{ dmt_pass_3.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.dmt_pass_3\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Pass 4:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.dmt_pass_4 == true\">\n" +
    "                {{ dmt_pass_4.name }} (<strong>{{ dmt_pass_4.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.dmt_pass_4\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "          </dl>\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-3\">\n" +
    "          <h4 class=\"event-panel\">Tumbling</h4>\n" +
    "          <a href=\"#\" ng-click=\"chooseTumbling()\" class=\"btn btn-xs btn-info\" ng-disabled=\" ! athlete.tumbling_level\">\n" +
    "            <i class=\"fa fa-cog\"></i> Choose\n" +
    "          </a>\n" +
    "          \n" +
    "          <dl>\n" +
    "            <dt>Pass 1:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.tum_pass_1 == true\">\n" +
    "                {{ tum_pass_1.name }} (<strong>{{ tum_pass_1.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.tum_pass_1\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Pass 2:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.tum_pass_2 == true\">\n" +
    "                {{ tum_pass_2.name }} (<strong>{{ tum_pass_2.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.tum_pass_2\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Pass 3:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.tum_pass_3 == true\">\n" +
    "                {{ tum_pass_3.name }} (<strong>{{ tum_pass_3.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.tum_pass_3\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "            <dt>Pass 4:</dt>\n" +
    "            <dd>\n" +
    "              <span ng-if=\"hasRoutineTypes.tum_pass_4 == true\">\n" +
    "                {{ tum_pass_4.name }} (<strong>{{ tum_pass_4.difficulty }}</strong>)\n" +
    "              </span>\n" +
    "              <span ng-if=\" ! hasRoutineTypes.tum_pass_4\">\n" +
    "                None\n" +
    "              </span>\n" +
    "            </dd>\n" +
    "          </dl>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "          <div class=\"panel-body\">\n" +
    "            <button class=\"btn btn-success btn-lg\" ng-click=\"downloadCompcards()\"><i class=\"fa fa-download\"></i> Compcards</button>\n" +
    "            <button class=\"btn btn-info btn-lg\" ng-click=\"edit()\"><i class=\"fa fa-edit\"></i> Edit</button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/directives/doublemini-pass.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div ng-if=\"pass && pass.id != 0\" class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <h3 class=\"panel-title\">{{ pass.name }}</h3>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <table class=\"table table-striped table-bordered table-hover table-responsive\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <th>#</th>\n" +
    "                            <th>FIG</th>\n" +
    "                            <th>Difficulty</th>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"skill in pass.skills\">\n" +
    "                            <td ng-switch=\"skill.pivot.order_index\">\n" +
    "                                <span ng-switch-when=\"0\">Mounter</span>\n" +
    "                                <span ng-switch-when=\"1\">Spotter</span>\n" +
    "                                <span ng-switch-when=\"2\">Dismount</span>\n" +
    "                            </td>\n" +
    "                            <td>{{ skill.fig }}</td>\n" +
    "                            <td>{{ skill.doublemini_difficulty }}</td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "            <div class=\"panel-footer\" style=\"text-align:right\">\n" +
    "                Difficulty: <strong>{{ pass.difficulty }}</strong>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"pass.id == 0\">\n" +
    "            <p>No pass to display...</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/directives/synchro-routine.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div ng-if=\"routine && routine.id != 0\" class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <h3 class=\"panel-title\">{{ routine.name }}</h3>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <table class=\"table table-striped table-bordered table-hover table-responsive\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <th>#</th>\n" +
    "                            <th>FIG</th>\n" +
    "                            <th>Difficulty</th>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"skill in routine.skills\">\n" +
    "                            <td>{{ $index + 1 }}</td>\n" +
    "                            <td>{{ skill.fig }}</td>\n" +
    "                            <td>{{ skill.trampoline_difficulty }}</td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "            <div class=\"panel-footer\" style=\"text-align:right\">\n" +
    "                Difficulty: <strong>{{ routine.difficulty }}</strong>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"routine.id == 0\">\n" +
    "            <p>No routine to display...</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/directives/trampoline-routine.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div ng-if=\"routine && routine.id != 0\" class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <h3 class=\"panel-title\">{{ routine.name }}</h3>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <table class=\"table table-striped table-bordered table-hover table-responsive\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <th>#</th>\n" +
    "                            <th>FIG</th>\n" +
    "                            <th>Difficulty</th>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"skill in routine.skills\">\n" +
    "                            <td>{{ $index + 1 }}</td>\n" +
    "                            <td>{{ skill.fig }}</td>\n" +
    "                            <td>{{ skill.trampoline_difficulty }}</td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "            <div class=\"panel-footer\" style=\"text-align:right\">\n" +
    "                Difficulty: <strong>{{ routine.difficulty }}</strong>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"routine.id == 0\">\n" +
    "            <p>No routine to display...</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/directives/tumbling-pass.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div ng-if=\"pass && pass.id != 0\" class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <h3 class=\"panel-title\">{{ pass.name }}</h3>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <table class=\"table table-striped table-bordered table-hover table-responsive\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <th>#</th>\n" +
    "                            <th>FIG</th>\n" +
    "                            <th>Difficulty</th>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"skill in pass.skills\">\n" +
    "                            <td>{{ $index + 1 }}</td>\n" +
    "                            <td>{{ skill.fig }}</td>\n" +
    "                            <td>{{ skill.tumbling_difficulty }}</td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "            <div class=\"panel-footer\" style=\"text-align:right\">\n" +
    "                Difficulty: <strong>{{ pass.difficulty }}</strong>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"pass.id == 0\">\n" +
    "            <p>No pass to display...</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/home.html',
    "<div class=\"row\">\n" +
    "\t<div class=\"col-lg-12\">\n" +
    "\t\t<div class=\"jumbotron\">\n" +
    "\t\t  <h1>Welcome to Routine Manager</h1>\n" +
    "\t\t  <p>...</p>\n" +
    "\t\t  <p><a class=\"btn btn-primary btn-lg\" role=\"button\">Learn more</a></p>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/login.html',
    "<div class=\"row\">\n" +
    "\t<div class=\"col-md-4 col-md-offset-4\">\n" +
    "\t\t<alert ng-repeat=\"alert in alerts\" type=\"alert.type\" close=\"closeAlert($index)\"><strong>{{ alert.title }}</strong> {{ alert.message }}</alert>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"login-container\">\n" +
    "\t<form accept-charset=\"utf-8\" ng-submit=\"login(credentials)\">\n" +
    "\t\t<div id=\"output\"></div>\n" +
    "\t\t<h3>Login</h3>\n" +
    "\t\t<div class=\"form-box\">\n" +
    "\t\t\t<input type=\"email\" id=\"inputEmail\" placeholder=\"email\" ng-model=\"credentials.email\" required>\n" +
    "\t\t\t<input type=\"password\" id=\"inputPassword\" placeholder=\"password\" ng-model=\"credentials.password\" required>\n" +
    "\t\t\t<button class=\"btn btn-info btn-block login\" type=\"submit\">Login</button>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/modals/athlete.html',
    "<form class=\"form-horizontal\" role=\"form\" name=\"athleteForm\" ng-submit=\"save(athleteForm.$valid)\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>{{ title }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div ng-if=\"error\" class=\"alert alert-danger\"><strong>Error!</strong> {{ error }}</div>\n" +
    "        \n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.first_name.$invalid && !athleteForm.first_name.$pristine }\">\n" +
    "            <label for=\"first_name\" class=\"col-sm-4 control-label\">First name</label><!-- ng-class=\"{'error': errorFields.indexOf('first_name') != -1}\" -->\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"first_name\" name=\"first_name\" class=\"form-control\" ng-model=\"athlete.first_name\" required>\n" +
    "                \n" +
    "                <p ng-show=\"athleteForm.first_name.$invalid && !athleteForm.first_name.$pristine\" class=\"help-block\">Athlete's first name is required.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.last_name.$invalid && !athleteForm.last_name.$pristine }\">\n" +
    "            <label for=\"last_name\" class=\"col-sm-4 control-label\">Last name</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"last_name\" name=\"last_name\" class=\"form-control\" ng-model=\"athlete.last_name\" required>\n" +
    "\n" +
    "                <p ng-show=\"athleteForm.last_name.$invalid && !athleteForm.last_name.$pristine\" class=\"help-block\">Athlete's last name is required.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.gender.$invalid && !athleteForm.gender.$pristine }\">\n" +
    "            <label for=\"gender\" class=\"col-sm-4 control-label\"><i class=\"fa fa-{{ athlete.gender }}\"></i> Gender</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <select id=\"gender\" name=\"gender\" ng-model=\"athlete.gender\" ng-options=\"gender for gender in genders\" required></select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.birthday.$invalid && !athleteForm.birthday.$pristine }\">\n" +
    "            <label for=\"birthday\" class=\"col-sm-4 control-label\">Birthday</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"date\" placeholder=\"yyyy-mm-dd\" id=\"birthday\" name=\"birthday\" class=\"form-control\" ng-model=\"athlete.birthday\" required>\n" +
    "\n" +
    "                <p ng-show=\"athleteForm.birthday.$invalid && !athleteForm.birthday.$pristine\" class=\"help-block\">Athlete's birthday is required and must be a valid date (yyyy-mm-dd).</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.team.$invalid && !athleteForm.team.$pristine }\">\n" +
    "            <label for=\"team\" class=\"col-sm-4 control-label\">Team</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"team\" name=\"team\" class=\"form-control\" ng-model=\"athlete.team\" required>\n" +
    "\n" +
    "                <p ng-show=\"athleteForm.team.$invalid && !athleteForm.team.$pristine\" class=\"help-block\">Athlete's team is required.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.trampoline_level.$invalid && !athleteForm.trampoline_level.$pristine }\">\n" +
    "            <label for=\"trampoline_level\" class=\"col-sm-4 control-label\">Trampoline Level</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <select id=\"trampoline_level\" name=\"trampoline_level\" ng-model=\"athlete.trampoline_level\" ng-options=\"level.key as level.value for level in levels\"></select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.synchro_level.$invalid && !athleteForm.synchro_level.$pristine }\">\n" +
    "            <label for=\"synchro_level\" class=\"col-sm-4 control-label\">Synchro Level</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <select id=\"synchro_level\" name=\"synchro_level\" ng-model=\"athlete.synchro_level\" ng-options=\"level.key as level.value for level in levels\"></select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.doublemini_level.$invalid && !athleteForm.doublemini_level.$pristine }\">\n" +
    "            <label for=\"doublemini_level\" class=\"col-sm-4 control-label\">Double Mini Level</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <select id=\"doublemini_level\" name=\"doublemini_level\" ng-model=\"athlete.doublemini_level\" ng-options=\"level.key as level.value for level in levels\"></select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.tumbling_level.$invalid && !athleteForm.tumbling_level.$pristine }\">\n" +
    "            <label for=\"tumbling_level\" class=\"col-sm-4 control-label\">Tumbling Level</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <select id=\"tumbling_level\" name=\"tumbling_level\" ng-model=\"athlete.tumbling_level\" ng-options=\"level.key as level.value for level in levels\"></select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : athleteForm.notes.$invalid && !athleteForm.notes.$pristine }\">\n" +
    "            <label for=\"notes\" class=\"col-sm-4 control-label\">Notes</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <textarea id=\"notes\" name=\"notes\" class=\"form-control\" ng-model=\"athlete.notes\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"athleteForm.$invalid\" value=\"Save\">\n" +
    "        <input type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" value=\"Cancel\">\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('app/templates/modals/choose/doublemini.html',
    "<form class=\"form\" role=\"form\" name=\"chooseDoubleMiniPasses\" ng-submit=\"save(chooseDoubleMiniPasses.$valid)\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>{{ title }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div ng-if=\"error\" class=\"alert alert-danger\"><strong>Error!</strong> {{ error }}</div>\n" +
    "        \n" +
    "        <!-- <div class=\"form-group\" ng-class=\"{'has-error' : chooseTrampolineRoutines.first_name.$invalid && !chooseTrampolineRoutines.first_name.$pristine }\">\n" +
    "            <label for=\"first_name\" class=\"col-sm-4 control-label\">First name</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"first_name\" name=\"first_name\" class=\"form-control\" ng-model=\"athlete.first_name\" required>\n" +
    "                \n" +
    "                <p ng-show=\"chooseTrampolineRoutines.first_name.$invalid && !chooseTrampolineRoutines.first_name.$pristine\" class=\"help-block\">Athlete's first name is required.</p>\n" +
    "            </div>\n" +
    "        </div> -->\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <!-- Chooser -->\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"dmt_pass_1\">Pass 1:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"dmt_pass_1\"\n" +
    "                        name       = \"dmt_pass_1\"\n" +
    "                        ng-model   = \"chosenRoutines.dmt_pass_1\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.dmt_pass_1)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.dmt_pass_1)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"dmt_pass_2\">Pass 2:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"dmt_pass_2\"\n" +
    "                        name       = \"dmt_pass_2\"\n" +
    "                        ng-model   = \"chosenRoutines.dmt_pass_2\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.dmt_pass_2)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.dmt_pass_2)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"dmt_pass_3\">Pass 3:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"dmt_pass_3\"\n" +
    "                        name       = \"dmt_pass_3\"\n" +
    "                        ng-model   = \"chosenRoutines.dmt_pass_3\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.dmt_pass_3)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.dmt_pass_3)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"dmt_pass_4\">Pass 4:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"dmt_pass_4\"\n" +
    "                        name       = \"dmt_pass_4\"\n" +
    "                        ng-model   = \"chosenRoutines.dmt_pass_4\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.dmt_pass_4)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.dmt_pass_4)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Viewer -->\n" +
    "            <div class=\"col-sm-7\" style=\"border-left:1px solid #eee\">\n" +
    "                <div doublemini-pass pass=\"activeRoutine\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"chooseDoubleMiniPasses.$invalid\" value=\"Save\">\n" +
    "        <input type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" value=\"Cancel\">\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('app/templates/modals/choose/synchro.html',
    "<form class=\"form\" role=\"form\" name=\"chooseTrampolineRoutines\" ng-submit=\"save(chooseSynchroRoutines.$valid)\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>{{ title }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div ng-if=\"error\" class=\"alert alert-danger\"><strong>Error!</strong> {{ error }}</div>\n" +
    "        \n" +
    "        <!-- <div class=\"form-group\" ng-class=\"{'has-error' : chooseTrampolineRoutines.first_name.$invalid && !chooseTrampolineRoutines.first_name.$pristine }\">\n" +
    "            <label for=\"first_name\" class=\"col-sm-4 control-label\">First name</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"first_name\" name=\"first_name\" class=\"form-control\" ng-model=\"athlete.first_name\" required>\n" +
    "                \n" +
    "                <p ng-show=\"chooseTrampolineRoutines.first_name.$invalid && !chooseTrampolineRoutines.first_name.$pristine\" class=\"help-block\">Athlete's first name is required.</p>\n" +
    "            </div>\n" +
    "        </div> -->\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <!-- Chooser -->\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"sync_prelim_compulsory\">Prelim compulsory:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"sync_prelim_compulsory\"\n" +
    "                        name       = \"sync_prelim_compulsory\"\n" +
    "                        ng-model   = \"chosenRoutines.sync_prelim_compulsory\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.sync_prelim_compulsory)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.sync_prelim_compulsory)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"sync_prelim_optional\">Prelim optional:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"sync_prelim_optional\"\n" +
    "                        name       = \"sync_prelim_optional\"\n" +
    "                        ng-model   = \"chosenRoutines.sync_prelim_optional\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.sync_prelim_optional)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.sync_prelim_optional)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"sync_final_optional\">Final optional:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"sync_final_optional\"\n" +
    "                        name       = \"sync_final_optional\"\n" +
    "                        ng-model   = \"chosenRoutines.sync_final_optional\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.sync_final_optional)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.sync_final_optional)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Viewer -->\n" +
    "            <div class=\"col-sm-7\" style=\"border-left:1px solid #eee\">\n" +
    "                <div trampoline-routine routine=\"activeRoutine\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"chooseTrampolineRoutines.$invalid\" value=\"Save\">\n" +
    "        <input type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" value=\"Cancel\">\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('app/templates/modals/choose/trampoline.html',
    "<form class=\"form\" role=\"form\" name=\"chooseTrampolineRoutines\" ng-submit=\"save(chooseTrampolineRoutines.$valid)\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>{{ title }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div ng-if=\"error\" class=\"alert alert-danger\"><strong>Error!</strong> {{ error }}</div>\n" +
    "        \n" +
    "        <!-- <div class=\"form-group\" ng-class=\"{'has-error' : chooseTrampolineRoutines.first_name.$invalid && !chooseTrampolineRoutines.first_name.$pristine }\">\n" +
    "            <label for=\"first_name\" class=\"col-sm-4 control-label\">First name</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"first_name\" name=\"first_name\" class=\"form-control\" ng-model=\"athlete.first_name\" required>\n" +
    "                \n" +
    "                <p ng-show=\"chooseTrampolineRoutines.first_name.$invalid && !chooseTrampolineRoutines.first_name.$pristine\" class=\"help-block\">Athlete's first name is required.</p>\n" +
    "            </div>\n" +
    "        </div> -->\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <!-- Chooser -->\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"tra_prelim_compulsory\">Prelim compulsory:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"tra_prelim_compulsory\"\n" +
    "                        name       = \"tra_prelim_compulsory\"\n" +
    "                        ng-model   = \"chosenRoutines.tra_prelim_compulsory\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.tra_prelim_compulsory)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.tra_prelim_compulsory)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"tra_prelim_optional\">Prelim optional:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"tra_prelim_optional\"\n" +
    "                        name       = \"tra_prelim_optional\"\n" +
    "                        ng-model   = \"chosenRoutines.tra_prelim_optional\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.tra_prelim_optional)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.tra_prelim_optional)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"tra_semi_final_optional\">Semi-final optional:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"tra_semi_final_optional\"\n" +
    "                        name       = \"tra_semi_final_optional\"\n" +
    "                        ng-model   = \"chosenRoutines.tra_semi_final_optional\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.tra_semi_final_optional)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.tra_semi_final_optional)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"tra_final_optional\">Final optional:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"tra_final_optional\"\n" +
    "                        name       = \"tra_final_optional\"\n" +
    "                        ng-model   = \"chosenRoutines.tra_final_optional\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.tra_final_optional)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.tra_final_optional)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Viewer -->\n" +
    "            <div class=\"col-sm-7\" style=\"border-left:1px solid #eee\">\n" +
    "                <div trampoline-routine routine=\"activeRoutine\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"chooseTrampolineRoutines.$invalid\" value=\"Save\">\n" +
    "        <input type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" value=\"Cancel\">\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('app/templates/modals/choose/tumbling.html',
    "<form class=\"form\" role=\"form\" name=\"chooseTumblingPasses\" ng-submit=\"save(chooseTumblingPasses.$valid)\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>{{ title }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div ng-if=\"error\" class=\"alert alert-danger\"><strong>Error!</strong> {{ error }}</div>\n" +
    "        \n" +
    "        <!-- <div class=\"form-group\" ng-class=\"{'has-error' : chooseTrampolineRoutines.first_name.$invalid && !chooseTrampolineRoutines.first_name.$pristine }\">\n" +
    "            <label for=\"first_name\" class=\"col-sm-4 control-label\">First name</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"first_name\" name=\"first_name\" class=\"form-control\" ng-model=\"athlete.first_name\" required>\n" +
    "                \n" +
    "                <p ng-show=\"chooseTrampolineRoutines.first_name.$invalid && !chooseTrampolineRoutines.first_name.$pristine\" class=\"help-block\">Athlete's first name is required.</p>\n" +
    "            </div>\n" +
    "        </div> -->\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <!-- Chooser -->\n" +
    "            <div class=\"col-sm-5\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"tum_pass_1\">Pass 1:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"tum_pass_1\"\n" +
    "                        name       = \"tum_pass_1\"\n" +
    "                        ng-model   = \"chosenRoutines.tum_pass_1\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.tum_pass_1)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.tum_pass_1)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"tum_pass_2\">Pass 2:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"tum_pass_2\"\n" +
    "                        name       = \"tum_pass_2\"\n" +
    "                        ng-model   = \"chosenRoutines.tum_pass_2\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.tum_pass_2)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.tum_pass_2)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"tum_pass_3\">Pass 3:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"tum_pass_3\"\n" +
    "                        name       = \"tum_pass_3\"\n" +
    "                        ng-model   = \"chosenRoutines.tum_pass_3\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.tum_pass_3)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.tum_pass_3)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"tum_pass_4\">Pass 4:</label>\n" +
    "                    <select\n" +
    "                        class      = \"form-control\"\n" +
    "                        id         = \"tum_pass_4\"\n" +
    "                        name       = \"tum_pass_4\"\n" +
    "                        ng-model   = \"chosenRoutines.tum_pass_4\"\n" +
    "                        ng-options = \"routine.id as routineLabel(routine) for routine in routines\"\n" +
    "                        ng-change  = \"showRoutine(chosenRoutines.tum_pass_4)\"\n" +
    "                        ng-focus   = \"showRoutine(chosenRoutines.tum_pass_4)\"\n" +
    "                    ></select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Viewer -->\n" +
    "            <div class=\"col-sm-7\" style=\"border-left:1px solid #eee\">\n" +
    "                <div tumbling-pass pass=\"activeRoutine\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"chooseTumblingPasses.$invalid\" value=\"Save\">\n" +
    "        <input type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" value=\"Cancel\">\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('app/templates/modals/routine/doublemini.html',
    "<form class=\"form-horizontal\" role=\"form\" name=\"routineForm\" ng-submit=\"save(routineForm.$valid && allSkillsValid())\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>{{ routine.name || title }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        \n" +
    "        <div ng-if=\"error\" class=\"alert alert-danger\"><strong>Error!</strong> {{ error }}</div>\n" +
    "        \n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : routineForm.name.$invalid && !routineForm.name.$pristine }\">\n" +
    "            <label for=\"name\" class=\"col-sm-4 control-label\">\n" +
    "                <i ng-show=\"routine.name\" class=\"fa fa-check-circle-o status-valid\"></i>\n" +
    "                <i ng-show=\" ! routine.name\" class=\"fa fa-times-circle-o status-invalid\"></i>\n" +
    "                <span>Pass name</span>\n" +
    "            </label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"name\" name=\"name\" class=\"form-control\" ng-model=\"routine.name\" placeholder=\"Name this pass...\" required>\n" +
    "                \n" +
    "                <p ng-show=\"routineForm.name.$invalid && !routineForm.name.$pristine\" class=\"help-block\">Pass name is required.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div ng-show=\" ! skill['spotter']\" class=\"form-group\" ng-class=\"{'has-error' : routineForm.formSkill['mounter'].$invalid && !routineForm.formSkill['mounter'].$pristine }\">\n" +
    "            \n" +
    "            <!-- Mounter -->\n" +
    "            <label class=\"col-sm-4 control-label\">\n" +
    "                <i ng-show=\"form.loading['mounter']\" class=\"fa fa-spinner fa-spin\"></i>\n" +
    "                <i ng-show=\"form.valid['mounter']\" class=\"fa fa-check-circle-o status-valid\"></i>\n" +
    "                <i ng-show=\" ! form.valid['mounter']\" class=\"fa fa-times-circle-o status-invalid\"></i>\n" +
    "                <span>Mounter</span>\n" +
    "            </label>\n" +
    "\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input\n" +
    "                    type=\"text\"\n" +
    "                    name=\"formSkill['mounter']\"\n" +
    "                    ng-change=\"checkValid('mounter')\"\n" +
    "                    ng-model=\"skill['mounter']\"\n" +
    "                    typeahead=\"possibleSkills.fig as possibleSkill for possibleSkills in searchSkills($viewValue, 'mounter')\"\n" +
    "                    typeahead-loading=\"form.loading['mounter']\"\n" +
    "                    typeahead-template-url=\"/app/views/typeahead/skill.html\"\n" +
    "                    typeahead-on-select=\"skillSelected($item, $model, 'mounter')\"\n" +
    "                    placeholder=\"FIG code or skill name...\"\n" +
    "                    class=\"form-control\"\n" +
    "                >\n" +
    "            </div>\n" +
    "        \n" +
    "        </div>\n" +
    "        <div ng-show=\" ! skill['mounter']\" class=\"form-group\" ng-class=\"{'has-error' : routineForm.formSkill['spotter'].$invalid && !routineForm.formSkill['spotter'].$pristine }\">\n" +
    "            \n" +
    "            <!-- Spotter -->\n" +
    "            <label class=\"col-sm-4 control-label\">\n" +
    "                <i ng-show=\"form.loading['spotter']\" class=\"fa fa-spinner fa-spin\"></i>\n" +
    "                <i ng-show=\"form.valid['spotter']\" class=\"fa fa-check-circle-o status-valid\"></i>\n" +
    "                <i ng-show=\" ! form.valid['spotter']\" class=\"fa fa-times-circle-o status-invalid\"></i>\n" +
    "                <span>Spotter</span>\n" +
    "            </label>\n" +
    "\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input\n" +
    "                    type=\"text\"\n" +
    "                    name=\"formSkill['spotter']\"\n" +
    "                    ng-change=\"checkValid('spotter')\"\n" +
    "                    ng-model=\"skill['spotter']\"\n" +
    "                    typeahead=\"possibleSkills.fig as possibleSkill for possibleSkills in searchSkills($viewValue, 'spotter')\"\n" +
    "                    typeahead-loading=\"form.loading['spotter']\"\n" +
    "                    typeahead-template-url=\"/app/views/typeahead/skill.html\"\n" +
    "                    typeahead-on-select=\"skillSelected($item, $model, 'spotter')\"\n" +
    "                    placeholder=\"FIG code or skill name...\"\n" +
    "                    class=\"form-control\"\n" +
    "                >\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : routineForm.formSkill['dismount'].$invalid && !routineForm.formSkill['dismount'].$pristine }\">\n" +
    "\n" +
    "            <!-- Dismount -->\n" +
    "            <label class=\"col-sm-4 control-label\">\n" +
    "                <i ng-show=\"form.loading['dismount']\" class=\"fa fa-spinner fa-spin\"></i>\n" +
    "                <i ng-show=\"form.valid['dismount']\" class=\"fa fa-check-circle-o status-valid\"></i>\n" +
    "                <i ng-show=\" ! form.valid['dismount']\" class=\"fa fa-times-circle-o status-invalid\"></i>\n" +
    "                <span>Dismount</span>\n" +
    "            </label>\n" +
    "\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input\n" +
    "                    type=\"text\"\n" +
    "                    name=\"formSkill['dismount']\"\n" +
    "                    ng-change=\"checkValid('dismount')\"\n" +
    "                    ng-model=\"skill['dismount']\"\n" +
    "                    typeahead=\"possibleSkills.fig as possibleSkill for possibleSkills in searchSkills($viewValue, 'dismount')\"\n" +
    "                    typeahead-loading=\"form.loading['dismount']\"\n" +
    "                    typeahead-template-url=\"/app/views/typeahead/skill.html\"\n" +
    "                    typeahead-on-select=\"skillSelected($item, $model, 'dismount')\"\n" +
    "                    placeholder=\"FIG code or skill name...\"\n" +
    "                    class=\"form-control\"\n" +
    "                >\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : routineForm.description.$invalid && !routineForm.description.$pristine }\">\n" +
    "            <label for=\"description\" class=\"col-sm-4 control-label\">Description</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <textarea id=\"description\" name=\"description\" class=\"form-control\" ng-model=\"routine.description\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"routineForm.$invalid || ! allSkillsValid()\" value=\"Save\">\n" +
    "        <input type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" value=\"Cancel\">\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('app/templates/modals/routine/trampoline.html',
    "<form class=\"form-horizontal\" role=\"form\" name=\"routineForm\" ng-submit=\"save(routineForm.$valid && allSkillsValid())\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>{{ title }}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div ng-if=\"error\" class=\"alert alert-danger\"><strong>Error!</strong> {{ error }}</div>\n" +
    "        \n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : routineForm.name.$invalid && !routineForm.name.$pristine }\">\n" +
    "            <label for=\"name\" class=\"col-sm-4 control-label\">Routine name</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input type=\"text\" id=\"name\" name=\"name\" class=\"form-control\" ng-model=\"routine.name\" required>\n" +
    "                \n" +
    "                <p ng-show=\"routineForm.name.$invalid && !routineForm.name.$pristine\" class=\"help-block\">Routine name is required.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"form-group\" ng-repeat=\"skill in form.skills\" ng-class=\"{'has-error' : routineForm.formSkill[$index].$invalid && !routineForm.formSkill[$index].$pristine }\">\n" +
    "            <label class=\"col-sm-4 control-label\">\n" +
    "                <i ng-show=\"form.loading[$index]\" class=\"fa fa-spinner fa-spin\"></i>\n" +
    "                <i ng-show=\"skillModels[$index].id\" class=\"fa fa-check-circle-o status-valid\"></i>\n" +
    "                <i ng-show=\"! skillModels[$index].id && !! skill[$index]\" class=\"fa fa-times-circle-o status-invalid\"></i>\n" +
    "                Skill {{ $index + 1 }}\n" +
    "            </label>\n" +
    "\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input\n" +
    "                    type=\"text\"\n" +
    "                    name=\"formSkill[$index]\"\n" +
    "                    ng-change=\"form.valid[$index] = false\"\n" +
    "                    ng-model=\"skill[$index]\"\n" +
    "                    typeahead=\"possibleSkills.fig as possibleSkill for possibleSkills in searchSkills($viewValue, $index)\"\n" +
    "                    typeahead-loading=\"form.loading[$index]\"\n" +
    "                    typeahead-template-url=\"/app/views/typeahead/skill.html\"\n" +
    "                    typeahead-on-select=\"skillSelected($item, $model, $index)\"\n" +
    "                    placeholder=\"FIG code or skill name...\"\n" +
    "                    class=\"form-control\"\n" +
    "                >\n" +
    "                <span ng-show=\"routineForm.formSkill[$index].$invalid && !routineForm.formSkill[$index].$pristine\" class=\"help-block\">All skills are required and must be valid.</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\" ng-class=\"{'has-error' : routineForm.description.$invalid && !routineForm.description.$pristine }\">\n" +
    "            <label for=\"description\" class=\"col-sm-4 control-label\">Description</label>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <textarea id=\"description\" name=\"description\" class=\"form-control\" ng-model=\"routine.description\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"routineForm.$invalid || ! allSkillsValid()\" value=\"Save\">\n" +
    "        <input type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\" value=\"Cancel\">\n" +
    "    </div>\n" +
    "</form>"
  );


  $templateCache.put('app/templates/register.html',
    "<div class=\"row\">\n" +
    "\n" +
    "\t<div class=\"col-md-12\">\n" +
    "\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<div class=\"col-md-8 col-md-offset-2\">\n" +
    "\t\t\t\t<alert ng-repeat=\"alert in alerts\" type=\"alert.type\" close=\"closeAlert($index)\">\n" +
    "\t\t\t\t\t<strong>{{ alert.title }}</strong> {{ alert.message }}\n" +
    "\t\t\t\t\t<ul ng-if=\"alert.error_list\">\n" +
    "\t\t\t\t\t\t<li ng-repeat=\"errorField in alert.error_list.fields\">\n" +
    "\t\t\t\t\t\t\t{{ errorField | capitalize }}: {{ alert.error_list.messages[$index] }}\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\t\t\t\t</alert>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<h1>Registration</h1>\n" +
    "\n" +
    "\t\t<form role=\"form\" name=\"accountForm\" ng-submit=\"register(accountForm.$valid)\" novalidate>\n" +
    "\t\t\t<fieldset>\n" +
    "\t\t\t\t<p ng-show=\"accountForm.$pristine\">Welcome to Routine Manager. Please fill out your information.</p>\n" +
    "\n" +
    "\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t<div class=\"col-sm-6\">\n" +
    "\t\t\t\t\t\t<div id=\"legend\">\n" +
    "\t\t\t\t\t\t\t<legend><i class=\"fa fa-key\"></i> Account</legend>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"form-group\" ng-class=\"{'has-error' : accountForm.email.$invalid && !accountForm.email.$pristine }\">\n" +
    "\t\t\t\t\t\t\t<label class=\"control-label\" for=\"email\">E-mail</label>\n" +
    "\t\t\t\t\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t\t\t\t\t<input autocomplete=\"off\" type=\"email\" name=\"email\" id=\"email\" ng-model=\"account.email\" class=\"form-control input-lg\" required email-available/>\n" +
    "\t\t\t\t\t\t\t\t<div ng-show=\"accountForm.email.$dirty\">\n" +
    "\t\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.email.$error.required\" class=\"help-block\"><span class=\"label label-danger\">Error</span> Please enter your email</p>\n" +
    "\t\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.email.$error.email\" class=\"help-block\"><span class=\"label label-danger\">Error</span> This is not a valid email</p>\n" +
    "\t\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.email.$error.checkingEmail\" class=\"help-block\"><span class=\"label label-info\"><i class=\"fa fa-spinner fa-spin\"></i> Checking email...</span></p>\n" +
    "\t\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.email.$error.emailAvailable\" class=\"help-block\"><span class=\"label label-danger\">Error</span> Email not available</p>\n" +
    "\t\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.email.$valid\" class=\"help-block\"><span class=\"label label-success\"><i class=\"fa fa-check\"></i></span> Email is available</p>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"form-group\" ng-class=\"{'has-error' : accountForm.password.$invalid && !accountForm.password.$pristine }\">\n" +
    "\t\t\t\t\t\t\t<!-- Password-->\n" +
    "\t\t\t\t\t\t\t<label class=\"control-label\" for=\"password\" show-valid=\"account.password\">Password <i ng-show=\"accountForm.password.$valid && accountForm.password_confirm.$valid\" class=\"fa fa-check fa-green\"></i></label>\n" +
    "\t\t\t\t\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t\t\t\t\t<input type=\"password\" ng-model=\"account.password\" ng-change=\"checkPassword()\" id=\"password\" name=\"password\" class=\"form-control input-lg\" ng-pattern=\"/^.{7,}$/\" required>\n" +
    "\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.password.$dirty && accountForm.password.$invalid\" class=\"help-block\">Password should be at least 7 characters and match</p>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"form-group\" ng-class=\"{'has-error' : accountForm.password_confirm.$invalid && !accountForm.password_confirm.$pristine }\">\n" +
    "\t\t\t\t\t\t\t<!-- Password -->\n" +
    "\t\t\t\t\t\t\t<label class=\"control-label\"  for=\"password_confirm\">Password (Confirm) <i ng-show=\"accountForm.password.$valid && accountForm.password_confirm.$valid\" class=\"fa fa-check fa-green\"></i></label>\n" +
    "\t\t\t\t\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t\t\t\t\t<input type=\"password\" ng-model=\"password_confirm\" ng-pattern=\"/^.{7,}$/\" pw-match=\"account.password\" id=\"password_confirm\" name=\"password_confirm\" class=\"form-control input-lg\" required>\n" +
    "\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.password_confirm.$error.match\" class=\"help-block\">Passwords do not match!</p>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"col-sm-6\">\n" +
    "\t\t\t\t\t\t<div id=\"legend\">\n" +
    "\t\t\t\t\t\t\t<legend class=\"\"><i class=\"fa fa-user\"></i> Information</legend>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"form-group\" ng-class=\"{'has-error' : (accountForm.first_name.$invalid || accountForm.last_name.$invalid) && ( ! accountForm.first_name.$pristine || ! accountForm.last_name.$pristine) }\">\n" +
    "\t\t\t\t\t\t\t<!-- Name -->\n" +
    "\t\t\t\t\t\t\t<label class=\"control-label\" for=\"email\">Name</label>\n" +
    "\t\t\t\t\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"col-xs-6\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<input type=\"text\" ng-model=\"account.first_name\" id=\"first_name\" name=\"first_name\" placeholder=\"First name\" class=\"form-control input-lg\" required>\n" +
    "\t\t\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.first_name.$dirty && accountForm.first_name.$invalid\" class=\"help-block\">Please provide your first name</p>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"col-xs-6\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<input type=\"text\" ng-model=\"account.last_name\" id=\"last_name\" name=\"last_name\" placeholder=\"Last name\" class=\"form-control input-lg\" required>\n" +
    "\t\t\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.last_name.$dirty && accountForm.last_name.$invalid\" class=\"help-block\">Please provide your last name</p>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"form-group\" ng-class=\"{'has-error' : accountForm.gym_usag_id.$invalid && accountForm.gym_usag_id.$dirty }\">\n" +
    "\t\t\t\t\t\t\t<!-- Gym USAG Number -->\n" +
    "\t\t\t\t\t\t\t<label class=\"control-label\"  for=\"gym_usag_id\">Gym USAG #</label>\n" +
    "\t\t\t\t\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t\t\t\t\t<input type=\"number\" ng-model=\"account.gym_usag_id\" id=\"gym_usag_id\" name=\"gym_usag_id\" class=\"form-control input-lg\" ng-pattern=\"/^\\d{6}$/\" required>\n" +
    "\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.gym_usag_id.$dirty && accountForm.gym_usag_id.$invalid\" class=\"help-block\">Please provide your gym/club usag number (6 digits)</p>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"form-group\" ng-class=\"{'has-error' : accountForm.team.$invalid && !accountForm.team.$pristine }\">\n" +
    "\t\t\t\t\t\t\t<!-- Team -->\n" +
    "\t\t\t\t\t\t\t<label class=\"control-label\"  for=\"team\">Team Name</label>\n" +
    "\t\t\t\t\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t\t\t\t\t<input type=\"text\" ng-model=\"account.team\" id=\"team\" name=\"team\" class=\"form-control input-lg\" required>\n" +
    "\t\t\t\t\t\t\t\t<p ng-show=\"accountForm.team.$dirty && accountForm.team.$invalid\" class=\"help-block\">Please provide your team name</p>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t<div class=\"col-sm-12\">\n" +
    "\t\t\t\t\t\t<div class=\"form-group well\" ng-class=\"{'has-error' : accountForm.terms.$invalid && !accountForm.terms.$pristine }\">\n" +
    "\t\t\t\t\t\t\t<!-- Team -->\n" +
    "\t\t\t\t\t\t\t<label class=\"control-label\"  for=\"terms\">Terms &amp; Conditions</label>\n" +
    "\t\t\t\t\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t\t\t\t\t<label class=\"terms-agreement\">\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" ng-model=\"account.terms\" id=\"terms\" name=\"terms\" class=\"\" required>\n" +
    "\t\t\t\t\t\t\t\t\t&nbsp; Please accept the <a href=\"/terms.html\" target=\"_blank\">Terms and Conditions</a> before proceeding.\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<pre>{{ account }}</pre>\n" +
    "\n" +
    "\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t<div class=\"col-md-12\">\n" +
    "\t\t\t\t\t\t<!-- Button -->\n" +
    "\t\t\t\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t\t\t\t<button class=\"btn btn-success btn-lg\" type=\"submit\" ng-disabled=\"accountForm.$invalid\">Register</button>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</fieldset>\n" +
    "\t\t</form>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('app/templates/typeahead/skill.html',
    "<a>\n" +
    "    <div class=\"row\">\n" +
    "    \t<div class=\"pull-left\" bind-html-unsafe=\"match.model.fig | typeaheadHighlight:query\">{{ match.model.fig }}</div>\n" +
    "    \t<div class=\"pull-right\">DD: {{ $parent.$parent.$parent.difficulty(match.model) }}</div>\n" +
    "    </div>\n" +
    "    <div class=\"row\" bind-html-unsafe=\"match.model.name | typeaheadHighlight:query\"></div>\n" +
    "</a>"
  );

}]);
