
        let displayExpression = document.getElementById('displayExpression');
        let displayResult = document.getElementById('displayResult');
        let memoryDisplay = document.getElementById('memoryDisplay');
        let historyList = document.getElementById('historyList');
        
        let currentInput = '0';
        let operator = null;
        let previousInput = null;
        let waitingForOperand = false;
        let memory = 0;
        let history = [];
        let expression = '';

        // Theme functionality
        function toggleTheme() {
            const body = document.body;
            const themeIcon = document.getElementById('themeIcon');
            const themeText = document.getElementById('themeText');
            
            body.classList.toggle('light-theme');
            
            if (body.classList.contains('light-theme')) {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Light';
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Dark';
                localStorage.setItem('theme', 'dark');
            }
        }

        // Load saved theme
        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            const body = document.body;
            const themeIcon = document.getElementById('themeIcon');
            const themeText = document.getElementById('themeText');
            
            if (savedTheme === 'light') {
                body.classList.add('light-theme');
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Light';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Dark';
            }
        }

        function updateDisplay() {
            displayResult.textContent = formatNumber(currentInput);
            displayExpression.textContent = expression;
        }

        function updateMemoryDisplay() {
            memoryDisplay.textContent = `Memory: ${formatNumber(memory)}`;
        }

        function formatNumber(num) {
            if (num.toString().length > 12) {
                return parseFloat(num).toExponential(6);
            }
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        function inputNumber(num) {
            if (waitingForOperand) {
                currentInput = num;
                waitingForOperand = false;
            } else {
                currentInput = currentInput === '0' ? num : currentInput + num;
            }
            updateDisplay();
        }

        function inputDecimal() {
            if (waitingForOperand) {
                currentInput = '0.';
                waitingForOperand = false;
            } else if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
            }
            updateDisplay();
        }

        function inputOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);

            if (previousInput === null) {
                previousInput = inputValue;
                expression = formatNumber(inputValue) + ' ' + getOperatorSymbol(nextOperator) + ' ';
            } else if (operator) {
                const currentValue = previousInput || 0;
                const newValue = performCalculation(currentValue, inputValue, operator);

                if (newValue === 'Error') {
                    currentInput = 'Error';
                    expression = 'Error';
                    updateDisplay();
                    return;
                }

                currentInput = String(newValue);
                previousInput = newValue;
                expression = formatNumber(newValue) + ' ' + getOperatorSymbol(nextOperator) + ' ';
                updateDisplay();
            }

            waitingForOperand = true;
            operator = nextOperator;
        }

        function calculate() {
            const inputValue = parseFloat(currentInput);

            if (previousInput !== null && operator) {
                const currentValue = previousInput || 0;
                const newValue = performCalculation(currentValue, inputValue, operator);

                if (newValue === 'Error') {
                    currentInput = 'Error';
                    expression = 'Error';
                    updateDisplay();
                    return;
                }

                // Add to history
                const calculation = `${formatNumber(currentValue)} ${getOperatorSymbol(operator)} ${formatNumber(inputValue)} = ${formatNumber(newValue)}`;
                addToHistory(calculation);

                currentInput = String(newValue);
                expression = '';
                previousInput = null;
                operator = null;
                waitingForOperand = true;
                updateDisplay();
            }
        }

        function performCalculation(firstOperand, secondOperand, operator) {
            switch (operator) {
                case '+':
                    return firstOperand + secondOperand;
                case '-':
                    return firstOperand - secondOperand;
                case '*':
                    return firstOperand * secondOperand;
                case '/':
                    if (secondOperand === 0) {
                        return 'Error';
                    }
                    return firstOperand / secondOperand;
                case '%':
                    return (firstOperand * secondOperand) / 100;
                default:
                    return secondOperand;
            }
        }

        function getOperatorSymbol(op) {
            switch (op) {
                case '+': return '+';
                case '-': return '-';
                case '*': return '×';
                case '/': return '÷';
                case '%': return '%';
                default: return op;
            }
        }

        function clearEntry() {
            currentInput = '0';
            updateDisplay();
        }

        function clearAll() {
            currentInput = '0';
            expression = '';
            previousInput = null;
            operator = null;
            waitingForOperand = false;
            updateDisplay();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function memoryFunction(func) {
            const currentValue = parseFloat(currentInput);
            
            switch (func) {
                case 'MC':
                    memory = 0;
                    break;
                case 'MR':
                    currentInput = String(memory);
                    waitingForOperand = true;
                    break;
                case 'M+':
                    memory += currentValue;
                    break;
                case 'M-':
                    memory -= currentValue;
                    break;
            }
            
            updateMemoryDisplay();
            updateDisplay();
        }

        function addToHistory(calculation) {
            history.unshift(calculation);
            if (history.length > 50) {
                history = history.slice(0, 50);
            }
            updateHistoryDisplay();
        }

        function updateHistoryDisplay() {
            historyList.innerHTML = '';
            if (history.length === 0) {
                historyList.innerHTML = '<div class="history-item">No calculations yet...</div>';
                return;
            }
            
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.textContent = item;
                historyItem.onclick = () => {
                    const result = item.split(' = ')[1];
                    if (result) {
                        currentInput = result.replace(/,/g, '');
                        updateDisplay();
                    }
                };
                historyList.appendChild(historyItem);
            });
        }

        function clearHistory() {
            history = [];
            updateHistoryDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if (key >= '0' && key <= '9') {
                inputNumber(key);
            } else if (key === '.') {
                inputDecimal();
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                inputOperator(key);
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                clearAll();
            } else if (key === 'Backspace') {
                event.preventDefault();
                deleteLast();
            } else if (key === '%') {
                inputOperator('%');
            }
        });

        // Initialize
        loadTheme();
        updateDisplay();
        updateMemoryDisplay();
        updateHistoryDisplay();

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'975f82919647ef3b',t:'MTc1NjMzOTAzMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
