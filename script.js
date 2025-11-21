// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const display = document.getElementById('display');
const history = document.getElementById('history');
const themeToggle = document.getElementById('themeToggle');

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// ✨ Historial de operaciones
let operationHistory = JSON.parse(localStorage.getItem('operationHistory')) || [];

// ==========================================
// INICIALIZACIÓN - Cargar tema guardado
// ==========================================
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('calculatorTheme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '🌙';
  }
});

// ==========================================
// EVENTOS - Tema claro/oscuro
// ==========================================
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? '🌙' : '☀️';
  
  // ✨ Guardar preferencia de tema
  localStorage.setItem('calculatorTheme', isLight ? 'light' : 'dark');
  navigator.vibrate?.(30);
});

// ==========================================
// FUNCIÓN: Agregar número/decimal al display
// ==========================================
/**
 * Agrega un valor (número o punto decimal) al input actual
 * @param {string} value - El valor a agregar (0-9, .)
 */
function appendToDisplay(value) {
  // ✨ VALIDACIÓN: Evita múltiples decimales en el mismo número
  if (value === '.' && currentInput.includes('.')) return;
  
  // Si debe resetear o es el primer dígito
  if (shouldResetDisplay || currentInput === '0') currentInput = '';
  shouldResetDisplay = false;
  
  // Agregar el valor
  currentInput += value;
  display.value = currentInput;
  navigator.vibrate?.(30);
}

// ==========================================
// FUNCIÓN: Limpiar todo (botón C)
// ==========================================
/**
 * Limpia el display, el historial y reinicia todas las variables
 */
function clearDisplay() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  history.textContent = '';
  display.value = '0';
  navigator.vibrate?.(30);
}

// ==========================================
// FUNCIÓN: Eliminar último dígito (botón ⌫)
// ==========================================
/**
 * Elimina el último dígito del input actual
 */
function deleteLast() {
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  display.value = currentInput;
  navigator.vibrate?.(30);
}

// ==========================================
// FUNCIÓN: Cambiar signo (+/−)
// ==========================================
/**
 * Cambia el signo del número actual (positivo a negativo y viceversa)
 */
function changeSign() {
  if (currentInput !== '0') {
    currentInput = (parseFloat(currentInput) * -1).toString();
    display.value = currentInput;
    navigator.vibrate?.(30);
  }
}

// ==========================================
// FUNCIÓN: Calcular porcentaje (%)
// ==========================================
/**
 * Convierte el número actual a su equivalente en porcentaje (divide entre 100)
 */
function percent() {
  currentInput = (parseFloat(currentInput) / 100).toString();
  display.value = currentInput;
  navigator.vibrate?.(30);
}

// ==========================================
// FUNCIÓN: Establecer operador
// ==========================================
/**
 * Guarda el operador seleccionado y el input anterior
 * @param {string} op - El operador (+, -, *, /)
 */
function setOperator(op) {
  // Validación: no permite operador si el input está vacío o es solo un guion
  if (currentInput === '' || currentInput === '-') return;
  
  previousInput = currentInput;
  operator = op;
  history.textContent = currentInput + ' ' + op;
  shouldResetDisplay = true;
  navigator.vibrate?.(30);
}

// ==========================================
// FUNCIÓN: Calcular resultado
// ==========================================
/**
 * Realiza la operación matemática y muestra el resultado
 */
function calculate() {
  // Mostrar operación en historial
  history.textContent = previousInput + ' ' + operator + ' ' + currentInput + ' =';
  
  // Validación: no calcula si no hay operador establecido
  if (!operator || shouldResetDisplay) return;

  let prev = parseFloat(previousInput);
  let current = parseFloat(currentInput);
  let result = 0;

  // ✨ Realizar operación según el operador
  switch (operator) {
    case '+': 
      result = prev + current; 
      break;
    case '-': 
      result = prev - current; 
      break;
    case '*': 
      result = prev * current; 
      break;
    case '/': 
      // ✨ MEJORA: Validación especial para división por cero
      if (current === 0) {
        display.value = 'Error: División por 0';
        currentInput = '0';
        operator = null;
        shouldResetDisplay = true;
        navigator.vibrate?.(100); // Vibración más larga para indicar error
        return; // Detiene la operación
      }
      result = prev / current;
      break;
  }

  // Redondear para evitar errores de precisión flotante
  result = Math.round(result * 100000000) / 100000000;
  
  // ✨ Guardar operación en historial persistente
  const operation = `${previousInput} ${operator} ${currentInput} = ${result}`;
  operationHistory.push(operation);
  localStorage.setItem('operationHistory', JSON.stringify(operationHistory));
  
  // Mostrar resultado final
  history.textContent = previousInput + ' ' + operator + ' ' + currentInput + ' =';
  currentInput = result.toString();
  display.value = currentInput;
  operator = null;
  shouldResetDisplay = true;
  navigator.vibrate?.(30);
}

// ==========================================
// SOPORTE DE TECLADO
// ==========================================
/**
 * Permite usar el teclado de la computadora para operar la calculadora
 * Teclas soportadas:
 * - Números: 0-9
 * - Operadores: +, -, *, /
 * - Enter o =: Calcular resultado
 * - Backspace: Eliminar último dígito
 * - Escape: Limpiar todo
 * - %: Calcular porcentaje
 */
document.addEventListener('keydown', (e) => {
  // Números y punto decimal
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendToDisplay(e.key);
  }
  
  // Operadores
  if (['+', '-', '*', '/'].includes(e.key)) {
    setOperator(e.key === '*' ? '×' : e.key);
  }
  
  // Calcular resultado
  if (e.key === 'Enter' || e.key === '=') {
    calculate();
  }
  
  // Eliminar último dígito
  if (e.key === 'Backspace') {
    deleteLast();
  }
  
  // Limpiar todo
  if (e.key === 'Escape') {
    clearDisplay();
  }
  
  // Porcentaje
  if (e.key === '%') {
    percent();
  }
});