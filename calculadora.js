// Motor de la calculadora: analiza y evalúa expresiones sin usar eval().
// Soporta + - * / %, signo negativo unario, paréntesis y decimales.
(function (global) {
  'use strict';

  function tokenizar(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      const c = expr[i];
      if (c === ' ') { i++; continue; }
      if (/[0-9.]/.test(c)) {
        let num = '';
        while (i < expr.length && /[0-9.]/.test(expr[i])) num += expr[i++];
        if ((num.match(/\./g) || []).length > 1 || num === '.') throw new Error('Número inválido');
        tokens.push({ tipo: 'num', valor: parseFloat(num) });
        continue;
      }
      if ('+-*/%()'.includes(c)) { tokens.push({ tipo: 'op', valor: c }); i++; continue; }
      throw new Error('Carácter inválido: ' + c);
    }
    return tokens;
  }

  // Gramática:
  //   expr    := termino (('+' | '-') termino)*
  //   termino := factor (('*' | '/') factor)*
  //   factor  := ('-' | '+') factor | primario '%'*
  //   primario:= numero | '(' expr ')'
  function evaluar(expr) {
    const tokens = tokenizar(expr);
    if (tokens.length === 0) return 0;
    let pos = 0;
    const ver = () => tokens[pos];
    const esOp = (v) => ver() && ver().tipo === 'op' && ver().valor === v;

    function parseExpr() {
      let v = parseTermino();
      while (esOp('+') || esOp('-')) {
        const op = tokens[pos++].valor;
        const d = parseTermino();
        v = op === '+' ? v + d : v - d;
      }
      return v;
    }
    function parseTermino() {
      let v = parseFactor();
      while (esOp('*') || esOp('/')) {
        const op = tokens[pos++].valor;
        const d = parseFactor();
        if (op === '/' && d === 0) throw new Error('División entre cero');
        v = op === '*' ? v * d : v / d;
      }
      return v;
    }
    function parseFactor() {
      if (esOp('-')) { pos++; return -parseFactor(); }
      if (esOp('+')) { pos++; return parseFactor(); }
      let v = parsePrimario();
      while (esOp('%')) { pos++; v = v / 100; }
      return v;
    }
    function parsePrimario() {
      const t = ver();
      if (!t) throw new Error('Expresión incompleta');
      if (t.tipo === 'num') { pos++; return t.valor; }
      if (esOp('(')) {
        pos++;
        const v = parseExpr();
        if (!esOp(')')) throw new Error('Falta ")"');
        pos++;
        return v;
      }
      throw new Error('Expresión inválida');
    }

    const resultado = parseExpr();
    if (pos < tokens.length) throw new Error('Expresión inválida');
    if (!isFinite(resultado)) throw new Error('Resultado no finito');
    return redondear(resultado);
  }

  // Elimina errores de coma flotante (p. ej. 0.1 + 0.2 = 0.3).
  function redondear(n) {
    return parseFloat(n.toPrecision(12));
  }

  const api = { evaluar, tokenizar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Calculadora = api;
})(this);
