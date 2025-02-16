const { add, sub } = require('./index'); // Import the function to be tested

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('adds -1 + 1 to equal 0', () => {
  expect(add(-1, 1)).toBe(0);
});

test('subtract 1 from 2 to equal 1', () => {
  expect(sub(2, 1)).toBe(1);
})
