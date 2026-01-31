/**
 * Simple Calculator Module
 * ========================
 * A minimal module for testing the workflow.
 */

/**
 * Add two numbers together.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a + b;
}

/**
 * Subtract b from a.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function subtract(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a - b;
}

/**
 * Multiply two numbers.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a * b;
}

/**
 * Divide a by b.
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a divided by b
 * @throws {Error} If b is zero
 */
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide
};
