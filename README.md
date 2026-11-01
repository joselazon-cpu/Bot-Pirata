# Calculadora

Calculadora web sin dependencias. Abre `index.html` en el navegador.

- Operaciones: suma, resta, multiplicación, división, porcentaje y cambio de signo.
- Respeta la precedencia de operadores (`2+3×4 = 14`) y admite paréntesis desde el teclado.
- Atajos de teclado: números, `+ - * / % ( )`, `Enter`/`=` para calcular, `Backspace` para borrar, `Esc` para limpiar.
- No usa `eval()`: `calculadora.js` contiene un analizador propio.

Pruebas del motor: `node calculadora.test.js`
