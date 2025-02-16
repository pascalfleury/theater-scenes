function gastTestRunner() {
  'use strict'

  var test = new GasTap()
  Logger.log("CalendarEventLibrary version: " + CalendarEventLibrary.libVersion());

  test('ParseSimplePlan', function (t) {
    var plan = [
      ["Rolle", "1", "2", "", "1"],
      ["Valentin", "x", "x", "", "x"],
    ];

    t.deepEqual(ParsePlan(plan),
      {
        "Valentin": [[1, 1], [1, 2], [2, 1]],
      },
      "plain parsing");
  })

  test('ParsePlan', function (t) {
    var plan = [
      ["Rolle", "1", "2", "3", "", "1", "2", "3", "4"],
      ["Valentin", "x", "x", "x", "", "", "", "x", "x"],
      ["Oskar", "", "x", "x", "", "x", "", "", "x"],
      ["Lilly", "", "", "x", "", "x", "x", "", "x"],
    ];

    t.deepEqual(ParsePlan(plan),
      {
        "Valentin": [[1, 1], [1, 2], [1, 3], [2, 3], [2, 4]],
        "Oskar": [[1, 2], [1, 3], [2, 1], [2, 4]],
        "Lilly": [[1, 3], [2, 1], [2, 2], [2, 4]],
      },
      "plain parsing");
  })

  test.finish()
}