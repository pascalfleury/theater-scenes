function gastTestRunner() {
  'use strict'
  
  var test = new GasTap()
  
  test('SortUnique', function (t) {
    t.deepEqual(SortUnique([[1,1], [1,2]]), [[1,1], [1,2]], "if already ready");
    t.deepEqual(SortUnique([[1,1], [1,1], [1,2]]), [[1,1], [1,2]], "sorted with dups");
    t.deepEqual(SortUnique([[1,2], [1,1]]), [[1,1], [1,2]], "unsorted no dups");
    t.deepEqual(SortUnique([[1,2], [1,1], [1,2]]), [[1,1], [1,2]], "unsorted with dups");
  })

  test('isInSceneList', function (t) { 
    t.ok(isInSceneList([[1,1], [1,3]], [1,3]), "Simple inclusion test");
    t.notOk(isInSceneList([[1,1], [1,3]], [1,2]), "Simple exclusion test");
  })

  test('removeFromList', function (t) {
    t.deepEqual(removeFromList([[1,1], [2,2]], [[2,2]]), [[1,1]], "Single removal");
    t.deepEqual(removeFromList([[1,1], [1,2], [2,2]], [[1,2], [2,2]]), [[1,1]], "Multiple removal");

    t.deepEqual(removeFromList([[1,1], [2,2]], [[3,2], [3,2]]), [[1,1], [2,2]], "No match");
  })

  test('ValidScenes', function (t) {
    var plan = {
      'Valentin': [ [1,1], [1,2], [1,3],   [2,1], [2,2],        [2,4] ],
      'Oskar':    [ [1,1],        [1,3],          [2,2], [2,3], [2,4] ],
      'Lilly':    [        [1,2], [1,3],                 [2,3], [2,4] ],
    };

    t.deepEqual(ValidScenes(plan, ['Valentin', 'Oskar', 'Lilly']),
                [[1,1], [1,2], [1,3], [2,1], [2,2], [2,3], [2,4]], "All actors");

    t.deepEqual(ValidScenes(plan, ['Lilly', 'Oskar']), [[2,3]], "Valentin missing");
    t.deepEqual(ValidScenes(plan, ['Valentin', 'Lilly']), [[1,2], [2,1]], "Oskar missing");
    t.deepEqual(ValidScenes(plan, ['Valentin']), [[2,1]], "Oskar & Lilly missing");
  })

  test.finish()
}