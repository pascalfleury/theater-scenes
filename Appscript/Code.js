// Parses the entire piece plan
// Returns a plan: {'Valentin': [[1,1], [1,2], ...], 'Oskar': [[1,3], [2,4]]}
// for each actor there is a sequence of [act, scene]
function ParsePlan(range_values) {
  // Fist line is set of acts/scenes
  var index_to_scene = [];
  var current_act = 1;
  var previous_scene = -1;
  for (var column in range_values[0]) {
    var scene_name = range_values[0][column]
    var value = parseInt(scene_name);
    if (isNaN(value)) {
       index_to_scene.push(null);
    } else {
      if (value < previous_scene) { current_act += 1; }
      previous_scene = value;
      index_to_scene.push([current_act, value]);  // scene_name
    }
  }

  // first column is rolename
  var plan = {};
  for (var row_idx in range_values) {
    if (row_idx == 0) continue;  // line with the scene numbers

    var actor = range_values[row_idx][0];
    plan[actor] = [];
    for (var i = 1; i < range_values[row_idx].length; i++) {
      var tick = range_values[row_idx][i];
      if (tick == "") continue;
      plan[actor].push(index_to_scene[i]);
    }
  }

  return plan;
}

function GetActors(actors, absences) {
  var present_actors = [];
  for (var i = 0; i < actors.length; i++) {
    if (absences[i] == "") present_actors.push(actors[i]);
  }
  return present_actors;
}

/**
 * Given a range for scenes, it can compute the valid set of scenes given the list of actors.
 * @param {range} scene_spec The range where the scenes and present actors is defined.
 * @param {list} actors range of actor names.
 * @param {list} absences range with absence markings (empty means present).
 * @return A human-readable set of scenes that can be rehearsed.
 * @customfunction
 */
function POSSIBLE_SCENES(scene_spec, actor_names, actor_presence) {
  var actors = GetActors(actor_names[0], actor_presence[0]);
  //return JSON.stringify(actors);
  var values = SpreadsheetApp.getActiveSpreadsheet().getRange(scene_spec).getValues();
  var plan = ParsePlan(values);
  var scenes = ValidScenes(plan, actors);
  var desc = HumanReadable2(scenes, {1:"Akt1", 2:"Akt2", 3:"Akt3"});
  return desc.length ? desc : "Keine Szene";
}
