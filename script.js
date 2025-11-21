const display = document.getElementById('display');
const history = document.getElementById('history');
const themeToggle = document.getElementById('themeToggle');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Tema claro/oscuro + vibración
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
  navigator.vibrate?.(30);
});

function appendToDisplay(value) {
  if (shouldResetDisplay || currentInput === '0') currentInput = '';
  shouldResetDisplay = false;
  currentInput += value;
  display.value = currentInput;
  navigator.vibrate?.(30);
}

function clearDisplay() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  history.textContent = '';
  display.value = '0';
}

function deleteLast() {
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  display.value = currentInput;
}

function changeSign() {
  if (currentInput !== '0') {
    currentInput = (parseFloat(currentInput) * -1).toString();
    display.value = currentInput;
  }
}

function percent() {
  currentInput = (parseFloat(currentInput) / 100).toString();
  display.value = currentInput;
}

function setOperator(op) {
  if (currentInput === '' || currentInput === '-') return;
  previousInput = currentInput;
  operator = op;
  history.textContent = currentInput + ' ' + op;
  shouldResetDisplay = true;
}

function calculate() {
    history.textContent = previousInput + ' ' + operator + ' ' + currentInput + ' =';
  if (!operator || shouldResetDisplay) return;

  let prev = parseFloat(previousInput);
  let current = parseFloat(currentInput);
  let result = 0;

  switch (operator) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '*': result = prev * current; break;
    case '/': result = current === 0 ? 'Error' : prev / current; break;
  }

  result = Math.round(result * 100000000) / 100000000;
  history.textContent = previousInput + ' ' + operator + ' ' + currentInput + ' =';
  currentInput = result.toString();
  display.value = currentInput;
  operator = null;
  shouldResetDisplay = true;
}

// Soporte teclado
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9' || e.key === '.') appendToDisplay(e.key);
  if (['+', '-', '*', '/'].includes(e.key)) setOperator(e.key === '*' ? '×' : e.key);
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Backspace') deleteLast();
  if (e.key === 'Escape') clearDisplay();
  if (e.key === '%') percent();
});