
    
        // Game state variables
        let currentLevel = 1;
        let playerPosition = { x: 1, y: 1 };
        let gameStartTime = null;
        let timerInterval = null;
        let gameWon = false;

        // Maze layouts for different levels
        const mazes = [
            // Level 1 - Easy
            [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,2,0,0,1,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,1,0,1,1,1,1,1,1,1,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
                [1,0,1,1,1,1,1,1,1,0,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
                [1,1,1,1,1,1,1,0,1,0,1,1,1,0,1],
                [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,3,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ],
            // Level 2 - Medium
            [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,2,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
                [1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
                [1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
                [1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1],
                [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
                [1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
                [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
                [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ],
            // Level 3 - Hard
            [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,2,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
                [1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
                [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
                [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
                [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
                [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ]
        ];

        // Initialize the game
        function initGame() {
            createMaze();
            setupEventListeners();
            startTimer();
        }

        // Create the maze grid
        function createMaze() {
            const maze = document.getElementById('maze');
            const currentMaze = mazes[currentLevel - 1];
            
            // Set grid dimensions
            maze.style.gridTemplateColumns = `repeat(${currentMaze[0].length}, 1fr)`;
            maze.innerHTML = '';

            // Create cells and find player/goal positions
            for (let y = 0; y < currentMaze.length; y++) {
                for (let x = 0; x < currentMaze[y].length; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.dataset.x = x;
                    cell.dataset.y = y;

                    const cellType = currentMaze[y][x];
                    
                    if (cellType === 1) {
                        cell.classList.add('wall');
                    } else if (cellType === 0) {
                        cell.classList.add('path');
                    } else if (cellType === 2) {
                        cell.classList.add('start', 'player');
                        playerPosition = { x, y };
                    } else if (cellType === 3) {
                        cell.classList.add('goal');
                    }

                    maze.appendChild(cell);
                }
            }
        }

        // Setup keyboard event listeners
        function setupEventListeners() {
            document.addEventListener('keydown', handleKeyPress);
        }

        // Handle player movement
        function handleKeyPress(event) {
            if (gameWon) return;

            const { x, y } = playerPosition;
            let newX = x;
            let newY = y;

            switch (event.key) {
                case 'ArrowUp':
                    newY = y - 1;
                    break;
                case 'ArrowDown':
                    newY = y + 1;
                    break;
                case 'ArrowLeft':
                    newX = x - 1;
                    break;
                case 'ArrowRight':
                    newX = x + 1;
                    break;
                default:
                    return;
            }

            event.preventDefault();
            movePlayer(newX, newY);
        }

        // Move player to new position if valid
        function movePlayer(newX, newY) {
            const currentMaze = mazes[currentLevel - 1];
            
            // Check bounds and walls
            if (newY < 0 || newY >= currentMaze.length || 
                newX < 0 || newX >= currentMaze[0].length ||
                currentMaze[newY][newX] === 1) {
                return;
            }

            // Remove player from current position
            const currentCell = document.querySelector(`[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
            currentCell.classList.remove('player');
            currentCell.classList.add('moving');

            // Add player to new position
            const newCell = document.querySelector(`[data-x="${newX}"][data-y="${newY}"]`);
            newCell.classList.add('player', 'moving');

            // Update player position
            playerPosition = { x: newX, y: newY };

            // Remove moving animation after transition
            setTimeout(() => {
                currentCell.classList.remove('moving');
                newCell.classList.remove('moving');
            }, 200);

            // Check if player reached the goal
            if (currentMaze[newY][newX] === 3) {
                winGame();
            }
        }

        // Handle game win
        function winGame() {
            gameWon = true;
            stopTimer();
            
            const winMessage = document.createElement('div');
            winMessage.className = 'win-message';
            winMessage.innerHTML = `
                <h2>🎉 Congratulations!</h2>
                <p>You completed Level ${currentLevel}!</p>
                <p>Time: ${document.getElementById('timer').textContent}</p>
                <button onclick="closeWinMessage(); nextLevel();" style="margin-top: 15px;">Next Level</button>
                <button onclick="closeWinMessage(); resetGame();" style="margin-top: 15px; margin-left: 10px;">Play Again</button>
            `;
            
            document.body.appendChild(winMessage);
        }

        // Close win message
        function closeWinMessage() {
            const winMessage = document.querySelector('.win-message');
            if (winMessage) {
                winMessage.remove();
            }
        }

        // Reset current level
        function resetGame() {
            closeWinMessage();
            gameWon = false;
            stopTimer();
            createMaze();
            startTimer();
        }

        // Move to next level
        function nextLevel() {
            if (currentLevel < mazes.length) {
                currentLevel++;
                document.getElementById('currentLevel').textContent = currentLevel;
                resetGame();
            } else {
                // All levels completed
                const winMessage = document.createElement('div');
                winMessage.className = 'win-message';
                winMessage.innerHTML = `
                    <h2>🏆 Amazing!</h2>
                    <p>You've completed all levels!</p>
                    <p>You're a maze master!</p>
                    <button onclick="closeWinMessage(); currentLevel = 1; document.getElementById('currentLevel').textContent = '1'; resetGame();" style="margin-top: 15px;">Play Again</button>
                `;
                document.body.appendChild(winMessage);
            }
        }

        // Timer functions
        function startTimer() {
            gameStartTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }

        function stopTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }

        function updateTimer() {
            if (!gameStartTime) return;
            
            const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }

        // Start the game when page loads
        window.addEventListener('load', initGame);
    (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97822eed407edc2c',t:'MTc1NjcwMjYwOS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();