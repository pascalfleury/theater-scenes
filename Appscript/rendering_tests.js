function TestRunnerRendering() {
  'use strict'
  
  var test = new GasTap()
  
  test('GroupScenes', function (t) {
    t.deepEqual(GroupScenes([1, 2, 3, 4, 5, 6, 7, 8, 9]), [[1, 9]], "Entire act");
    t.deepEqual(GroupScenes([1, 2, 3, 7, 8, 9]), [[1, 3], [7, 9]], "Simple 2-ranges");
    t.deepEqual(GroupScenes([1, 7, 8, 9]), [[1, 1], [7, 9]], "Lone scene at start");
    t.deepEqual(GroupScenes([1, 2, 3, 9]), [[1, 3], [9, 9]], "Lone scene at end");
    t.deepEqual(GroupScenes([1]), [[1, 1]], "only one scene");

    t.deepEqual(GroupScenes([1, 7, 3, 2, 8, 9]), [[1, 3], [7, 9]], "Simple 2-ranges unsorted");
  })

  test('GroupRanges', function (t) {
    t.deepEqual(GroupRanges([[1,1], [1,2], [1,3], [1,4]]), [[1, [1, 4]]], "Single act")
    t.deepEqual(GroupRanges([[1,1], [1,2], [1,3], [2,4], [2,5]]), [[1, [1, 3]], [2, [4, 5]]], "Multiple acts")
  })

  test('GroupActs', function (t) {
    t.deepEqual(GroupActs([[1, [1, 3]], [2, [1, 4]]]),
    [[1, [[1,3]]], [2, [[1,4]]]],
    "Single segments");
    t.deepEqual(GroupActs([[1, [1, 3]], [1, [5, 7]], [2, [1, 4]]]),
    [[1, [[1,3], [5,7]]], [2, [[1,4]]]],
    "Multiple segments");
    t.deepEqual(GroupActs([[1, [1, 3]], [2, [1, 4]], [1, [5, 7]]]),
    [[1, [[1,3], [5,7]]], [2, [[1,4]]]],
    "unsorted segments");
  })

  test('HumanReadable', function (t) {
    t.equal(HumanReadable([[1,1], [1,2], [1,3]]), "I:1-3", "Simple one act");
    t.equal(HumanReadable([[1,1], [1,2], [1,4], [1,5], [1,6]]), "I:1-2 I:4-6", "one act 2 streaks");
    t.equal(HumanReadable([[1,1], [1,2], [1,3], [2,5], [2,6]]), "I:1-3 II:5-6", "Simple two acts");

    t.equal(HumanReadable([[1,1], [1,2], [1,3]], {1:'A.'}), "A.1-3", "Simple one act");
    t.equal(HumanReadable([[1,1], [1,2], [1,3], [2,5], [2,6]], {1:"I:", 2:"II:"}), "I:1-3 II:5-6", "Simple two acts");
  })

  test('HumanReadable2', function (t) {
    t.equal(HumanReadable2([[1,1]]), "I:(1)", "Simple one scene");
    t.equal(HumanReadable2([[1,1], [1,2], [1,3]]), "I:(1-3)", "Simple one act");
    t.equal(HumanReadable2([[1,1], [1,2], [1,4], [1,5], [1,6]]), "I:(1-2,4-6)", "one act 2 streaks");
    t.equal(HumanReadable2([[1,1], [1,2], [1,3], [2,5], [2,6]]), "I:(1-3) II:(5-6)", "Simple two acts");

    t.equal(HumanReadable2([[1,1], [1,2], [1,3]], {1:'A.'}), "A.(1-3)", "Simple one act");
    t.equal(HumanReadable2([[1,1], [1,2], [1,3], [2,5], [2,6]], {1:"I:", 2:"II:"}), "I:(1-3) II:(5-6)", "Simple two acts");
  })

  test.finish()
}
