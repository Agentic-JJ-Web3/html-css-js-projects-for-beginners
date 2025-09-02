
        class WordSearchGame {
            constructor() {
                this.gridSize = 10;
                this.grid = [];
                this.foundWords = new Set();
                this.placedWords = [];
                this.isSelecting = false;
                this.startCell = null;
                this.currentSelection = [];
                this.startTime = null;
                this.timerInterval = null;
                this.difficulty = 'medium';
                this.currentCategory = 'technology';
                this.wordColors = new Map();
                this.hintsRemaining = 3;
                this.availableColors = [
                    '#e74c3c', '#3498db', '#9b59b6', '#e67e22', 
                    '#1abc9c', '#f39c12', '#2ecc71', '#34495e',
                    '#e91e63', '#ff5722', '#795548', '#607d8b',
                    '#8bc34a', '#ffc107', '#673ab7', '#009688'
                ];

                // Comprehensive word bank organized by categories
                this.wordBank = {
                    technology: {
                        easy: ['CODE', 'DATA', 'WIFI', 'APPS', 'TECH', 'BYTE', 'CHIP', 'DISK'],
                        medium: ['PYTHON', 'CODING', 'LAPTOP', 'SERVER', 'ROUTER', 'MOBILE', 'TABLET', 'GAMING'],
                        hard: ['JAVASCRIPT', 'ALGORITHM', 'DATABASE', 'FRAMEWORK', 'DEBUGGING', 'INTERFACE', 'PROGRAMMING', 'DEVELOPMENT']
                    },
                    animals: {
                        easy: ['CAT', 'DOG', 'FISH', 'BIRD', 'BEAR', 'LION', 'FROG', 'DUCK'],
                        medium: ['TIGER', 'EAGLE', 'SHARK', 'HORSE', 'RABBIT', 'MONKEY', 'TURTLE', 'PENGUIN'],
                        hard: ['ELEPHANT', 'GIRAFFE', 'KANGAROO', 'BUTTERFLY', 'CROCODILE', 'RHINOCEROS', 'CHIMPANZEE', 'FLAMINGO']
                    },
                    food: {
                        easy: ['CAKE', 'RICE', 'SOUP', 'MEAT', 'FISH', 'MILK', 'EGGS', 'BREAD'],
                        medium: ['PIZZA', 'PASTA', 'SALAD', 'BURGER', 'CHEESE', 'CHICKEN', 'COOKIES', 'SANDWICH'],
                        hard: ['SPAGHETTI', 'CHOCOLATE', 'HAMBURGER', 'BREAKFAST', 'RESTAURANT', 'DELICIOUS', 'INGREDIENTS', 'NUTRITION']
                    },
                    nature: {
                        easy: ['TREE', 'LEAF', 'ROCK', 'SAND', 'WIND', 'RAIN', 'SNOW', 'FIRE'],
                        medium: ['FOREST', 'OCEAN', 'MOUNTAIN', 'FLOWER', 'GARDEN', 'SUNSET', 'RAINBOW', 'THUNDER'],
                        hard: ['WATERFALL', 'LIGHTNING', 'BUTTERFLY', 'ECOSYSTEM', 'WILDERNESS', 'LANDSCAPE', 'ADVENTURE', 'BEAUTIFUL']
                    },
                    sports: {
                        easy: ['BALL', 'GAME', 'TEAM', 'WIN', 'PLAY', 'RUN', 'JUMP', 'KICK'],
                        medium: ['SOCCER', 'TENNIS', 'HOCKEY', 'BOXING', 'RACING', 'SWIMMING', 'CYCLING', 'RUNNING'],
                        hard: ['BASKETBALL', 'FOOTBALL', 'VOLLEYBALL', 'BADMINTON', 'WRESTLING', 'GYMNASTICS', 'ATHLETICS', 'CHAMPIONSHIP']
                    },
                    countries: {
                        easy: ['USA', 'UK', 'JAPAN', 'CHINA', 'INDIA', 'ITALY', 'SPAIN', 'FRANCE'],
                        medium: ['CANADA', 'BRAZIL', 'RUSSIA', 'GERMANY', 'MEXICO', 'TURKEY', 'POLAND', 'GREECE'],
                        hard: ['AUSTRALIA', 'ARGENTINA', 'SWITZERLAND', 'NETHERLANDS', 'SINGAPORE', 'PORTUGAL', 'INDONESIA', 'PHILIPPINES']
                    },
                    colors: {
                        easy: ['RED', 'BLUE', 'GREEN', 'BLACK', 'WHITE', 'PINK', 'GRAY', 'BROWN'],
                        medium: ['YELLOW', 'ORANGE', 'PURPLE', 'SILVER', 'GOLDEN', 'VIOLET', 'MAROON', 'INDIGO'],
                        hard: ['TURQUOISE', 'MAGENTA', 'CRIMSON', 'EMERALD', 'SAPPHIRE', 'LAVENDER', 'BURGUNDY', 'CHARTREUSE']
                    },
                    space: {
                        easy: ['SUN', 'MOON', 'STAR', 'MARS', 'EARTH', 'SPACE', 'ORBIT', 'COMET'],
                        medium: ['PLANET', 'GALAXY', 'ROCKET', 'SATURN', 'JUPITER', 'NEPTUNE', 'URANUS', 'MERCURY'],
                        hard: ['ASTRONAUT', 'TELESCOPE', 'SATELLITE', 'ASTEROID', 'UNIVERSE', 'SPACESHIP', 'BLACKHOLE', 'CONSTELLATION']
                    }
                };

                this.words = this.getWordsForDifficulty();
                this.initializeGame();
                this.setupEventListeners();
            }

            getWordsForDifficulty() {
                const categoryWords = this.wordBank[this.currentCategory][this.difficulty];
                // Shuffle and select 6-10 words based on difficulty
                const wordCount = this.difficulty === 'easy' ? 6 : this.difficulty === 'medium' ? 8 : 10;
                const shuffled = [...categoryWords].sort(() => Math.random() - 0.5);
                return shuffled.slice(0, wordCount);
            }

            getRandomCategory() {
                const categories = Object.keys(this.wordBank);
                return categories[Math.floor(Math.random() * categories.length)];
            }

            initializeGame() {
                this.createGrid();
                this.placeWords();
                this.fillEmptyCells();
                this.renderGrid();
                this.renderWordList();
                this.startTimer();
                this.updateProgress();
                this.updateHintDisplay();
            }

            createGrid() {
                this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(''));
            }

            placeWords() {
                this.placedWords = [];
                const directions = [
                    [0, 1],   // horizontal
                    [1, 0],   // vertical
                    [1, 1],   // diagonal down-right
                    [1, -1],  // diagonal down-left
                    [0, -1],  // horizontal backwards
                    [-1, 0],  // vertical backwards
                    [-1, -1], // diagonal up-left
                    [-1, 1]   // diagonal up-right
                ];

                for (const word of this.words) {
                    let placed = false;
                    let attempts = 0;
                    
                    while (!placed && attempts < 100) {
                        const direction = directions[Math.floor(Math.random() * directions.length)];
                        const startRow = Math.floor(Math.random() * this.gridSize);
                        const startCol = Math.floor(Math.random() * this.gridSize);
                        
                        if (this.canPlaceWord(word, startRow, startCol, direction)) {
                            this.placeWord(word, startRow, startCol, direction);
                            placed = true;
                        }
                        attempts++;
                    }
                }
            }

            canPlaceWord(word, row, col, direction) {
                const [dRow, dCol] = direction;
                
                for (let i = 0; i < word.length; i++) {
                    const newRow = row + i * dRow;
                    const newCol = col + i * dCol;
                    
                    if (newRow < 0 || newRow >= this.gridSize || 
                        newCol < 0 || newCol >= this.gridSize) {
                        return false;
                    }
                    
                    if (this.grid[newRow][newCol] !== '' && 
                        this.grid[newRow][newCol] !== word[i]) {
                        return false;
                    }
                }
                return true;
            }

            placeWord(word, row, col, direction) {
                const [dRow, dCol] = direction;
                const positions = [];
                
                for (let i = 0; i < word.length; i++) {
                    const newRow = row + i * dRow;
                    const newCol = col + i * dCol;
                    this.grid[newRow][newCol] = word[i];
                    positions.push([newRow, newCol]);
                }
                
                this.placedWords.push({
                    word: word,
                    positions: positions
                });
            }

            fillEmptyCells() {
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (let row = 0; row < this.gridSize; row++) {
                    for (let col = 0; col < this.gridSize; col++) {
                        if (this.grid[row][col] === '') {
                            this.grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
                        }
                    }
                }
            }

            renderGrid() {
                const gridElement = document.getElementById('puzzle-grid');
                gridElement.innerHTML = '';
                
                for (let row = 0; row < this.gridSize; row++) {
                    for (let col = 0; col < this.gridSize; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'cell';
                        cell.textContent = this.grid[row][col];
                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        gridElement.appendChild(cell);
                    }
                }
            }

            renderWordList() {
                const container = document.getElementById('word-list-container');
                container.innerHTML = '';
                
                this.words.forEach(word => {
                    const wordElement = document.createElement('div');
                    wordElement.className = 'word-item';
                    wordElement.textContent = word;
                    wordElement.dataset.word = word;
                    container.appendChild(wordElement);
                });
                
                document.getElementById('total-count').textContent = this.words.length;
            }

            setupEventListeners() {
                const grid = document.getElementById('puzzle-grid');
                
                // Mouse events
                grid.addEventListener('mousedown', (e) => this.startSelection(e));
                grid.addEventListener('mouseover', (e) => this.updateSelection(e));
                grid.addEventListener('mouseup', () => this.endSelection());
                
                // Touch events for mobile
                grid.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.startSelection(e.touches[0]);
                });
                grid.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (element && element.classList.contains('cell')) {
                        this.updateSelection({ target: element });
                    }
                });
                grid.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.endSelection();
                });
                
                // Prevent context menu
                grid.addEventListener('contextmenu', (e) => e.preventDefault());
            }

            startSelection(e) {
                if (!e.target.classList.contains('cell')) return;
                
                this.isSelecting = true;
                this.startCell = e.target;
                this.currentSelection = [e.target];
                this.updateSelectionDisplay();
            }

            updateSelection(e) {
                if (!this.isSelecting || !e.target.classList.contains('cell')) return;
                
                const endCell = e.target;
                this.currentSelection = this.getSelectionPath(this.startCell, endCell);
                this.updateSelectionDisplay();
            }

            getSelectionPath(startCell, endCell) {
                const startRow = parseInt(startCell.dataset.row);
                const startCol = parseInt(startCell.dataset.col);
                const endRow = parseInt(endCell.dataset.row);
                const endCol = parseInt(endCell.dataset.col);
                
                const path = [];
                const rowDiff = endRow - startRow;
                const colDiff = endCol - startCol;
                
                // Check if selection is in a straight line
                if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
                    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
                    const rowStep = steps === 0 ? 0 : rowDiff / steps;
                    const colStep = steps === 0 ? 0 : colDiff / steps;
                    
                    for (let i = 0; i <= steps; i++) {
                        const row = startRow + Math.round(i * rowStep);
                        const col = startCol + Math.round(i * colStep);
                        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        if (cell) path.push(cell);
                    }
                }
                
                return path.length > 1 ? path : [startCell];
            }

            updateSelectionDisplay() {
                // Clear previous selection
                document.querySelectorAll('.cell.selecting').forEach(cell => {
                    cell.classList.remove('selecting');
                });
                
                // Highlight current selection
                this.currentSelection.forEach(cell => {
                    cell.classList.add('selecting');
                });
            }

            endSelection() {
                if (!this.isSelecting) return;
                
                this.isSelecting = false;
                const selectedWord = this.currentSelection.map(cell => cell.textContent).join('');
                const reversedWord = selectedWord.split('').reverse().join('');
                
                // Check if selected word matches any target word
                let foundWord = null;
                if (this.words.includes(selectedWord) && !this.foundWords.has(selectedWord)) {
                    foundWord = selectedWord;
                } else if (this.words.includes(reversedWord) && !this.foundWords.has(reversedWord)) {
                    foundWord = reversedWord;
                }
                
                if (foundWord) {
                    this.markWordAsFound(foundWord);
                    this.currentSelection.forEach(cell => {
                        cell.classList.add('found');
                        cell.classList.remove('selecting');
                    });
                } else {
                    // Clear selection if word not found
                    this.currentSelection.forEach(cell => {
                        cell.classList.remove('selecting');
                    });
                }
                
                this.currentSelection = [];
                this.startCell = null;
            }

            markWordAsFound(word) {
                this.foundWords.add(word);
                
                // Assign a random color to this word if not already assigned
                if (!this.wordColors.has(word)) {
                    const availableColorsCopy = [...this.availableColors];
                    // Remove colors already used by other words
                    const usedColors = Array.from(this.wordColors.values());
                    const unusedColors = availableColorsCopy.filter(color => !usedColors.includes(color));
                    
                    // If all colors are used, pick any random color
                    const colorPool = unusedColors.length > 0 ? unusedColors : this.availableColors;
                    const randomColor = colorPool[Math.floor(Math.random() * colorPool.length)];
                    this.wordColors.set(word, randomColor);
                }
                
                const wordColor = this.wordColors.get(word);
                const wordElement = document.querySelector(`[data-word="${word}"]`);
                if (wordElement) {
                    wordElement.classList.add('found');
                    wordElement.style.borderLeftColor = wordColor;
                    wordElement.style.background = wordColor + '20'; // Add transparency
                }
                
                // Apply the color to all cells of this word
                this.currentSelection.forEach(cell => {
                    cell.style.background = wordColor;
                });
                
                this.updateProgress();
                
                if (this.foundWords.size === this.words.length) {
                    this.gameComplete();
                }
            }

            updateProgress() {
                const progress = (this.foundWords.size / this.words.length) * 100;
                document.getElementById('progress-fill').style.width = `${progress}%`;
                document.getElementById('found-count').textContent = this.foundWords.size;
            }

            startTimer() {
                this.startTime = Date.now();
                this.timerInterval = setInterval(() => {
                    const elapsed = Date.now() - this.startTime;
                    const minutes = Math.floor(elapsed / 60000);
                    const seconds = Math.floor((elapsed % 60000) / 1000);
                    document.getElementById('timer').textContent = 
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }, 1000);
            }

            gameComplete() {
                clearInterval(this.timerInterval);
                const finalTime = document.getElementById('timer').textContent;
                document.getElementById('final-time').textContent = finalTime;
                document.getElementById('completion-message').style.display = 'block';
            }

            showHint() {
                if (this.hintsRemaining <= 0) {
                    document.getElementById('hint-purchase-message').style.display = 'block';
                    return;
                }
                
                const unFoundWords = this.words.filter(word => !this.foundWords.has(word));
                if (unFoundWords.length === 0) return;
                
                this.hintsRemaining--;
                this.updateHintDisplay();
                
                const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
                const wordData = this.placedWords.find(w => w.word === randomWord);
                
                if (wordData) {
                    // Briefly highlight the first letter of the word
                    const firstPos = wordData.positions[0];
                    const cell = document.querySelector(`[data-row="${firstPos[0]}"][data-col="${firstPos[1]}"]`);
                    cell.style.background = '#ff7675';
                    cell.style.transform = 'scale(1.2)';
                    
                    setTimeout(() => {
                        cell.style.background = '';
                        cell.style.transform = '';
                    }, 1500);
                }
            }

            updateHintDisplay() {
                document.getElementById('hints-remaining').textContent = this.hintsRemaining;
            }

            toggleDifficulty() {
                const difficulties = ['easy', 'medium', 'hard'];
                const currentIndex = difficulties.indexOf(this.difficulty);
                this.difficulty = difficulties[(currentIndex + 1) % difficulties.length];
                
                // Adjust grid size based on difficulty
                switch(this.difficulty) {
                    case 'easy':
                        this.gridSize = 8;
                        break;
                    case 'medium':
                        this.gridSize = 10;
                        break;
                    case 'hard':
                        this.gridSize = 12;
                        break;
                }
                
                // Get new words for current difficulty and category
                this.words = this.getWordsForDifficulty();
                
                document.getElementById('difficulty').textContent = 
                    this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
                
                this.newGame();
            }

            changeDifficultyFromDropdown(newDifficulty) {
                this.difficulty = newDifficulty;
                
                // Adjust grid size based on difficulty
                switch(this.difficulty) {
                    case 'easy':
                        this.gridSize = 8;
                        break;
                    case 'medium':
                        this.gridSize = 10;
                        break;
                    case 'hard':
                        this.gridSize = 12;
                        break;
                }
                
                // Get new words for current difficulty and category
                this.words = this.getWordsForDifficulty();
                
                document.getElementById('difficulty').textContent = 
                    this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
                
                this.newGame();
            }

            changeCategory() {
                const categories = Object.keys(this.wordBank);
                const currentIndex = categories.indexOf(this.currentCategory);
                this.currentCategory = categories[(currentIndex + 1) % categories.length];
                
                // Get new words for current category and difficulty
                this.words = this.getWordsForDifficulty();
                
                document.getElementById('category').textContent = 
                    this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1);
                
                this.newGame();
            }

            changeCategoryFromDropdown(newCategory) {
                this.currentCategory = newCategory;
                
                // Get new words for current category and difficulty
                this.words = this.getWordsForDifficulty();
                
                document.getElementById('category').textContent = 
                    this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1);
                
                this.newGame();
            }

            randomizeEverything() {
                // Pick random category and difficulty
                this.currentCategory = this.getRandomCategory();
                const difficulties = ['easy', 'medium', 'hard'];
                this.difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
                
                // Update grid size
                this.gridSize = this.difficulty === 'easy' ? 8 : this.difficulty === 'medium' ? 10 : 12;
                
                // Get new words
                this.words = this.getWordsForDifficulty();
                
                // Update display
                document.getElementById('difficulty').textContent = 
                    this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
                document.getElementById('category').textContent = 
                    this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1);
                
                // Update dropdown selections
                document.getElementById('difficulty-select').value = this.difficulty;
                document.getElementById('category-select').value = this.currentCategory;
                
                this.newGame();
            }

            newGame() {
                clearInterval(this.timerInterval);
                this.foundWords.clear();
                this.placedWords = [];
                this.wordColors.clear();
                this.hintsRemaining = 3;
                document.getElementById('completion-message').style.display = 'none';
                document.getElementById('hint-purchase-message').style.display = 'none';
                
                // Update grid CSS for different sizes
                const grid = document.getElementById('puzzle-grid');
                grid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
                
                this.initializeGame();
            }
        }

        // Global functions for buttons
        let game;

        function newGame() {
            game.newGame();
        }

        function showHint() {
            game.showHint();
        }

        function toggleDifficulty() {
            game.toggleDifficulty();
        }

        function changeDifficulty() {
            const select = document.getElementById('difficulty-select');
            game.changeDifficultyFromDropdown(select.value);
        }

        function changeCategory() {
            game.changeCategory();
        }

        function changeCategoryFromDropdown() {
            const select = document.getElementById('category-select');
            game.changeCategoryFromDropdown(select.value);
        }

        function randomizeEverything() {
            game.randomizeEverything();
        }

        function buyHints() {
            // Simulate purchase notification
            alert('🛒 Purchase Successful!\n\nYou have received 5 additional hints!\nThank you for your purchase.');
            game.hintsRemaining += 5;
            game.updateHintDisplay();
            document.getElementById('hint-purchase-message').style.display = 'none';
        }

        // Username functionality
        function promptForUsername() {
            let username = localStorage.getItem('wordSearchUsername');
            
            if (!username) {
                username = prompt('🎮 Welcome to Word Search Puzzle!\n\nWhat\'s your name?');
                
                if (username && username.trim()) {
                    username = username.trim();
                    localStorage.setItem('wordSearchUsername', username);
                } else {
                    username = 'Player';
                }
            }
            
            updateWelcomeMessage(username);
            return username;
        }

        function updateWelcomeMessage(username) {
            const welcomeElement = document.getElementById('welcome-message');
            welcomeElement.textContent = `Welcome, ${username}! 👋`;
        }

        function changeUsername() {
            const newUsername = prompt('🎮 Change your name:', localStorage.getItem('wordSearchUsername') || 'Player');
            
            if (newUsername && newUsername.trim()) {
                const username = newUsername.trim();
                localStorage.setItem('wordSearchUsername', username);
                updateWelcomeMessage(username);
            }
        }

        // Initialize game when page loads
        document.addEventListener('DOMContentLoaded', () => {
            promptForUsername();
            game = new WordSearchGame();
        });
    (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'978efafb559063c1',t:'MTc1NjgzNjc5Ni4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();