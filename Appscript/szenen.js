function isSameScene(s1, s2) {
  return s1[0] == s2[0] && s1[1] == s2[1];
}
// function to filter for unique values.
function keepUniqueScenes(value, index, array) {
  return array.findIndex((e) => isSameScene(e, value) ) === index;
}

function isInSceneList(scenes, given_scene) {
  return scenes.find((e) => isSameScene(e, given_scene));
}

function SortUnique(scenes) {
  // sort by act, then by scene
  scenes.sort((a, b) => { return (a[0] - b[0] != 0) ? a[0] - b[0] : a[1] - b[1]; });
  return scenes.filter(keepUniqueScenes);
}

function removeFromList(scenes, removed_scenes) {
  return scenes.filter((v, i, a) => !isInSceneList(removed_scenes, v));
}

// Input plan: {'Valentin': [[1,1], [1,2], ...], 'Oskar': [[1,3], [2,4]]}
//       available_actors: ['Valentin', 'Lilly']
// Output: [[1,1], [1,2], ...]   [[act, scene], [act, scene]]
function ValidScenes(plan, available_actors) {
  var scenes = [];
  for (const actor of available_actors) {
    scenes = scenes.concat(plan[actor])
  }

  for (actor in plan) {
    if (available_actors.includes(actor)) continue;
    Logger.log("removing scenes of " + actor)
    scenes = removeFromList(scenes, plan[actor]);
  }

  return SortUnique(scenes);
}
