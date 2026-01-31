/**
 * Calculator Tests
 * ================
 * Simple test suite for the calculator module.
 */

const calculator = require('../src/calculator');

// Simple test framework
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

function assertThrows(fn, expectedMessage) {
  try {
    fn();
    throw new Error('Expected function to throw');
  } catch (error) {
    if (expectedMessage && !error.message.includes(expectedMessage)) {
      throw new Error(`Expected error message to include "${expectedMessage}", got "${error.message}"`);
    }
  }
}

// Tests
console.log('Calculator Tests');
console.log('================\n');

// Addition tests
test('add: should add two positive numbers', () => {
  assertEqual(calculator.add(2, 3), 5);
});

test('add: should add negative numbers', () => {
  assertEqual(calculator.add(-1, -2), -3);
});

test('add: should handle zero', () => {
  assertEqual(calculator.add(5, 0), 5);
});

test('add: should throw on non-number input', () => {
  assertThrows(() => calculator.add('a', 2), 'must be numbers');
});

// Subtraction tests
test('subtract: should subtract two numbers', () => {
  assertEqual(calculator.subtract(10, 4), 6);
});

test('subtract: should handle negative results', () => {
  assertEqual(calculator.subtract(4, 10), -6);
});

// Multiplication tests
test('multiply: should multiply two numbers', () => {
  assertEqual(calculator.multiply(5, 6), 30);
});

test('multiply: should handle zero', () => {
  assertEqual(calculator.multiply(5, 0), 0);
});

// Division tests
test('divide: should divide two numbers', () => {
  assertEqual(calculator.divide(20, 4), 5);
});

test('divide: should throw on division by zero', () => {
  assertThrows(() => calculator.divide(10, 0), 'Cannot divide by zero');
});

test('divide: should handle decimal results', () => {
  assertEqual(calculator.divide(5, 2), 2.5);
});

// Summary
console.log('\n================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
