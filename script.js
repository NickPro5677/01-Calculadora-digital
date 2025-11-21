let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function appendToDisplay(value) {
  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
  }

  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }
  display.value = currentInput;
}

function clearDisplay() {
  currentInput = '0';
  display.value = currentInput;
}

function deleteLast() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  display.value = currentInput;
}

function calculate() {
  try {
    // Reemplazar símbolo × por *
    let expression = currentInput.replace(/×/g, '*').replace(/−/g, '-');
    currentInput = eval(expression).toString();

    // Limitar decimales y evitar notación científica fea
    if (currentInput.includes('.')) {
      currentInput = parseFloat(currentInput).toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
    }

    display.value = currentInput;
    shouldResetDisplay = true;
  } catch (error) {
    display.value = 'Error';
    currentInput = '0';
    shouldResetDisplay = true;
  }
}

// Soporte para teclado físico (perfecto en móvil también)
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendToDisplay(e.key);
  if (e.key === '.') appendToDisplay('.');
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') appendToDisplay(e.key === '*' ? '×' : e.key);
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Backspace') deleteLast();
  if (e.key === 'Escape') clearDisplay();
});