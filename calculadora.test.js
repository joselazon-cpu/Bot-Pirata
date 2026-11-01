const assert = require('assert');
const { evaluar } = require('./calculadora');

const casos = [
  ['2+3', 5], ['2+3*4', 14], ['(2+3)*4', 20], ['10/4', 2.5],
  ['0.1+0.2', 0.3], ['-5+2', -3], ['3*-2', -6], ['50%', 0.5],
  ['200*10%', 20], ['', 0], ['7-2-1', 4], ['8/2/2', 2], ['--3', 3],
];
for (const [expr, esperado] of casos) {
  assert.strictEqual(evaluar(expr), esperado, `${expr} debería ser ${esperado}`);
}
for (const malo of ['1/0', '2+', '(1+2', '1..2', '2)', 'abc']) {
  assert.throws(() => evaluar(malo), `${malo} debería fallar`);
}
console.log(`OK: ${casos.length} casos válidos y 6 inválidos`);
