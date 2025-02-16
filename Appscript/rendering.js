const ACT = 0;
const SCENE = 1;
const FIRST = 0;
const LAST = 1;

// Input: scene list [scene1, scene2, scene4, ...]
// Output: contiguous range [[scene1, scene2], [scene4, scene6]]
function GroupScenes(scenes) {
  var ranges = [], temp = [];
  for (const i in scenes.sort()) {
    if (i > 0 && scenes[i] - scenes[i-1] != 1) {
      ranges.push([temp[0], temp.slice(-1)[0]]);
      temp = [];
    }
    temp.push(scenes[i]);
  }
  if (temp.length) {
    ranges.push([temp[0], temp.slice(-1)[0]]);
  }
  return ranges;
}

// Input is [[act, scene], [act, scene], [act, scene] ...]
// Output is [[act1, [first_scene, last_scene]], [act2, [first_scene, last_scene]], ...]
function GroupRanges(ranges) {
  if (!ranges.length) { return []; }
 
  var segments = [];  // list of [act, [scenes]]
  var current_act = -1;
  var current_scenes = [];
  for (const scene of ranges.sort((a, b) => { return a[ACT] - b[ACT]; })) {
    if (current_act!=-1 && scene[ACT] != current_act) {
      for (const group of GroupScenes(current_scenes)) {
        segments.push([current_act, group]);
      }
      current_scenes = [];
    }
    current_act = scene[ACT];
    current_scenes.push(scene[SCENE]);
  }

  if (current_scenes.length) {
    for (var group of GroupScenes(current_scenes)) {
      segments.push([current_act, group]);
    }
  }

  return segments;
} 

// Input: [[act1, [first_scene, last_scene]], [act2, [first_scene, last_scene]], ...]
// Output: [ [act1, [[first_scene, last_scene],
//                   [first_scene, last_scene], ... ]
//           ],
//           [act2, [[first_scene, last_scene], ... ]
//           ] 
//         ]
function GroupActs(segments) {
  segments.sort((a, b) => a[ACT] - b[ACT]);

  var acts = [];
  var current_act = -1;
  var current_segments = [];
  for (const segment of segments) {
    if (current_act != -1 && segment[ACT] != current_act) {
      acts.push([current_act, current_segments]);
      current_segments = [];
    }
    current_act = segment[ACT];
    current_segments.push(segment[1]);
  }
  if (segments.length) acts.push([current_act, current_segments]);
  return acts;
}

// Input: Input is [[act, scene], [act, scene], [act, scene] ...]
// Output: String description
function HumanReadable(scene_range, act_names = {1: 'I:', 2: 'II:', 3:'III:', 4: 'IV:', 5:'V:'}) {
  var pieces = [];
  for (const range of GroupRanges(scene_range)) {
    if (range[SCENE][FIRST] == range[SCENE][LAST]) {
      pieces.push(Utilities.formatString("%s%d", act_names[range[ACT]], range[SCENE][FIRST]));
    } else {
      pieces.push(Utilities.formatString("%s%d-%d", act_names[range[ACT]], range[SCENE][FIRST], range[SCENE][LAST]));
    }
  }
  return pieces.join(" ");
}

// Input: Input is [[act, scene], [act, scene], [act, scene] ...]
// Output: String description
function HumanReadable2(scene_range, act_names = {1: 'I:', 2: 'II:', 3:'III:', 4: 'IV:', 5:'V:'}) {
  var segments = GroupActs(GroupRanges(scene_range));
  var pieces = [];
  for (const segment of segments) {
    var act = segment[ACT];
    var ranges = [];
    for (var range of segment[SCENE]) {
      if (range[FIRST] == range[LAST]) {
        ranges.push(Utilities.formatString("%d", range[FIRST]));
      } else {
        ranges.push(Utilities.formatString("%d-%d", range[FIRST], range[LAST]));
      }
    }
    pieces.push(Utilities.formatString("%s(%s)", act_names[act], ranges.join(",")));
  }
  return pieces.join(" ");
}

