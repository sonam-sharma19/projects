// Simple calculator logic
(() => {
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');

  let expr = ''; // expression string

  // helpers
  const isOperator = ch => ['+','-','*','/'].includes(ch);
  const updateDisplay = () => display.textContent = expr || '0';

  const appendValue = v => {
    if (isOperator(v)) {
      if (!expr) {
        // allow leading negative
        if (v === '-') { expr = '-'; updateDisplay(); }
        return;
      }
      // replace last operator with new operator (avoid duplicates)
      if (isOperator(expr.slice(-1))) {
        expr = expr.slice(0,-1) + v;
        updateDisplay();
        return;
      }
      expr += v;
      updateDisplay();
      return;
    }

    if (v === '.') {
      // prevent multiple decimals in the current number
      const match = expr.match(/(\d+\.?\d*)$/);
      if (match && match[0].includes('.')) return;
      // if expression empty or ends with operator, append '0.' for readability
      if (!expr || isOperator(expr.slice(-1))) expr += '0.';
      else expr += '.';
      updateDisplay();
      return;
    }

    // digits
    expr += v;
    updateDisplay();
  };

  const clearAll = () => { expr = ''; updateDisplay(); };
  const deleteLast = () => { expr = expr.slice(0,-1); updateDisplay(); };

  const applyPercentToLastNumber = () => {
    // find the last number in expr and replace it with number/100
    const m = expr.match(/(\d+(\.\d*)?)$/);
    if (!m) return;
    const num = parseFloat(m[0]);
    const replacement = (num / 100).toString();
    expr = expr.slice(0, m.index) + replacement;
    updateDisplay();
  };

  const evaluateExpression = () => {
    if (!expr) return;
    // sanitize: allow digits, operators, parentheses, decimal point and spaces only
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      display.textContent = 'Error';
      expr = '';
      return;
    }
    try {
      // Use Function to evaluate in a clean scope
      // Replace accidental leading operator like "×" or "÷" if present (not expected)
      const safeExpr = expr.replace(/÷/g,'/').replace(/×/g,'*');
      const result = Function('"use strict"; return (' + safeExpr + ')')();
      // handle non-finite results
      if (!isFinite(result)) {
        display.textContent = 'Error';
        expr = '';
        return;
      }
      expr = String(result);
      updateDisplay();
    } catch (e) {
      display.textContent = 'Error';
      expr = '';
    }
  };

  // click handler
  keys.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === 'clear') { clearAll(); return; }
    if (action === 'backspace') { deleteLast(); return; }
    if (action === 'percent') { applyPercentToLastNumber(); return; }
    if (action === 'equals') { evaluateExpression(); return; }
    if (value) appendValue(value);
  });

  // keyboard support
  window.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') { appendValue(e.key); e.preventDefault(); return; }
    if (['+','-','*','/','(',')'].includes(e.key)) { appendValue(e.key); e.preventDefault(); return; }
    if (e.key === 'Enter' || e.key === '=') { evaluateExpression(); e.preventDefault(); return; }
    if (e.key === '.' || e.key === ',') { appendValue('.'); e.preventDefault(); return; }
    if (e.key === 'Backspace') { deleteLast(); e.preventDefault(); return; }
    if (e.key === 'Escape') { clearAll(); e.preventDefault(); return; }
    if (e.key === '%') { applyPercentToLastNumber(); e.preventDefault(); return; }
  });

  // initialize
  updateDisplay();
})();