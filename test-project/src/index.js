/**
 * Workflow Test Project
 * =====================
 * Entry point for the test project.
 */

const calculator = require('./calculator');

console.log('Workflow Test Project');
console.log('=====================');
console.log('');
console.log('Calculator Demo:');
console.log(`  2 + 3 = ${calculator.add(2, 3)}`);
console.log(`  10 - 4 = ${calculator.subtract(10, 4)}`);
console.log(`  5 * 6 = ${calculator.multiply(5, 6)}`);
console.log(`  20 / 4 = ${calculator.divide(20, 4)}`);
