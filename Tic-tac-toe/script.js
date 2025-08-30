
        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true;
        let gameStartTime = Date.now();
        let timerInterval;
        let soundEnabled = true;

        const gameStats = {
            player1: { wins: 0, losses: 0, draws: 0, streak: 0, name: 'Player 1' },
            player2: { wins: 0, losses: 0, draws: 0, streak: 0, name: 'Player 2' }
        };

        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        const themes = {
            classic: { primary: '#667eea', secondary: '#764ba2' },
            neon: { primary: '#ff006e', secondary: '#8338ec' },
            minimal: { primary: '#2c3e50', secondary: '#34495e' }
        };

        // Sound URLs from freesound.org (royalty-free)
        const sounds = {
            move: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            win: 'https://www.soundjay.com/misc/sounds/success-fanfare-trumpets.wav',
            draw: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav'
        };

        function checkNames() {
            const player1Name = document.getElementById('homepagePlayer1').value.trim();
            const player2Name = document.getElementById('homepagePlayer2').value.trim();
            const startBtn = document.getElementById('startBtn');
            
            if (player1Name && player2Name) {
                startBtn.disabled = false;
                startBtn.textContent = 'Start Playing!';
                startBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            } else {
                startBtn.disabled = true;
                startBtn.textContent = 'Enter Names to Start!';
                startBtn.style.background = 'linear-gradient(45deg, #666, #555)';
            }
        }

        function checkNamesAndStart() {
            const player1Name = document.getElementById('homepagePlayer1').value.trim();
            const player2Name = document.getElementById('homepagePlayer2').value.trim();
            
            if (player1Name && player2Name) {
                // Set the names in the game
                gameStats.player1.name = player1Name;
                gameStats.player2.name = player2Name;
                document.getElementById('player1Name').value = player1Name + ' (X)';
                document.getElementById('player2Name').value = player2Name + ' (O)';
                
                startGame();
            }
        }

        function startGame() {
            document.getElementById('homepage').style.display = 'none';
            document.getElementById('gameContainer').classList.add('active');
            document.getElementById('backBtn').classList.add('show');
            updateCurrentPlayerDisplay();
            startTimer();
        }

        function showHomepage() {
            document.getElementById('homepage').style.display = 'flex';
            document.getElementById('gameContainer').classList.remove('active');
            document.getElementById('backBtn').classList.remove('show');
            stopTimer();
        }

        function startTimer() {
            gameStartTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }

        function updateTimer() {
            const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }

        function stopTimer() {
            clearInterval(timerInterval);
        }

        function playSound(type) {
            if (!soundEnabled) return;
            
            // Fallback to Web Audio API for cross-platform compatibility
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'move':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    break;
                case 'win':
                    // Play a victory melody
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                    break;
                case 'draw':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    break;
            }
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        }

        function createBubbles() {
            const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
            
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const bubble = document.createElement('div');
                    bubble.className = 'bubble';
                    
                    const size = Math.random() * 30 + 10;
                    bubble.style.width = size + 'px';
                    bubble.style.height = size + 'px';
                    bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    bubble.style.left = Math.random() * window.innerWidth + 'px';
                    bubble.style.top = window.innerHeight + 'px';
                    
                    document.body.appendChild(bubble);
                    
                    setTimeout(() => {
                        if (document.body.contains(bubble)) {
                            document.body.removeChild(bubble);
                        }
                    }, 3000);
                }, i * 100);
            }
        }

        function makeMove(cellIndex) {
            if (board[cellIndex] !== '' || !gameActive) return;

            board[cellIndex] = currentPlayer;
            const cell = document.querySelectorAll('.cell')[cellIndex];
            cell.textContent = currentPlayer;
            cell.classList.add('taken', currentPlayer.toLowerCase());
            
            playSound('move');

            if (checkWinner()) {
                handleGameEnd('win');
            } else if (board.every(cell => cell !== '')) {
                handleGameEnd('draw');
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateCurrentPlayerDisplay();
            }
        }

        function checkWinner() {
            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    highlightWinningCells(condition);
                    return true;
                }
            }
            return false;
        }

        function highlightWinningCells(winningCells) {
            const cells = document.querySelectorAll('.cell');
            winningCells.forEach(index => {
                cells[index].classList.add('winning');
            });
        }

        function handleGameEnd(result) {
            gameActive = false;
            stopTimer();

            if (result === 'win') {
                const winner = currentPlayer === 'X' ? 'player1' : 'player2';
                const loser = currentPlayer === 'X' ? 'player2' : 'player1';
                
                gameStats[winner].wins++;
                gameStats[winner].streak++;
                gameStats[loser].losses++;
                gameStats[loser].streak = 0;
                
                showCelebration(currentPlayer === 'X' ? '🎉' : '🎊');
                createBubbles();
                playSound('win');
                
                setTimeout(() => {
                    const playerName = gameStats[winner].name || `Player ${winner === 'player1' ? '1' : '2'}`;
                    document.getElementById('currentPlayer').textContent = `${playerName} Wins! 🏆`;
                }, 500);
            } else {
                gameStats.player1.draws++;
                gameStats.player2.draws++;
                gameStats.player1.streak = 0;
                gameStats.player2.streak = 0;
                
                showCelebration('🤝');
                playSound('draw');
                document.getElementById('currentPlayer').textContent = "It's a Draw! 🤝";
            }

            updateStats();
        }

        function showCelebration(emoji) {
            const celebration = document.createElement('div');
            celebration.className = 'celebration';
            celebration.textContent = emoji;
            document.body.appendChild(celebration);
            
            setTimeout(() => {
                if (document.body.contains(celebration)) {
                    document.body.removeChild(celebration);
                }
            }, 2000);
        }

        function updateStats() {
            // Player 1 stats
            document.getElementById('p1Wins').textContent = gameStats.player1.wins;
            document.getElementById('p1Losses').textContent = gameStats.player1.losses;
            document.getElementById('p1Draws').textContent = gameStats.player1.draws;
            document.getElementById('p1Streak').textContent = gameStats.player1.streak;
            
            const p1Total = gameStats.player1.wins + gameStats.player1.losses + gameStats.player1.draws;
            const p1Percentage = p1Total > 0 ? Math.round((gameStats.player1.wins / p1Total) * 100) : 0;
            document.getElementById('p1Percentage').textContent = p1Percentage + '%';

            // Player 2 stats
            document.getElementById('p2Wins').textContent = gameStats.player2.wins;
            document.getElementById('p2Losses').textContent = gameStats.player2.losses;
            document.getElementById('p2Draws').textContent = gameStats.player2.draws;
            document.getElementById('p2Streak').textContent = gameStats.player2.streak;
            
            const p2Total = gameStats.player2.wins + gameStats.player2.losses + gameStats.player2.draws;
            const p2Percentage = p2Total > 0 ? Math.round((gameStats.player2.wins / p2Total) * 100) : 0;
            document.getElementById('p2Percentage').textContent = p2Percentage + '%';
        }

        function newGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.textContent = '';
                cell.className = 'cell';
            });
            
            updateCurrentPlayerDisplay();
            startTimer();
        }

        function updateCurrentPlayerDisplay() {
            const playerName = currentPlayer === 'X' ? 
                (gameStats.player1.name || 'Player 1') : 
                (gameStats.player2.name || 'Player 2');
            document.getElementById('currentPlayer').textContent = `${playerName}'s Turn (${currentPlayer})`;
        }

        function updatePlayerName(playerNum, name) {
            gameStats[`player${playerNum}`].name = name.trim() || `Player ${playerNum}`;
            updateCurrentPlayerDisplay();
        }

        function showResetModal() {
            document.getElementById('resetModal').style.display = 'flex';
        }

        function hideResetModal() {
            document.getElementById('resetModal').style.display = 'none';
        }

        function resetScores() {
            gameStats.player1 = { wins: 0, losses: 0, draws: 0, streak: 0, name: gameStats.player1.name };
            gameStats.player2 = { wins: 0, losses: 0, draws: 0, streak: 0, name: gameStats.player2.name };
            updateStats();
            hideResetModal();
            newGame();
        }

        function setTheme(themeName) {
            const theme = themes[themeName];
            document.body.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
            
            document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.theme-${themeName}`).classList.add('active');
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById('soundBtn').textContent = soundEnabled ? '🔊' : '🔇';
        }

        // Initialize game
        updateStats();
        updateCurrentPlayerDisplay();
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'975f25b47237eefd',t:'MTc1NjMzNTIzMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();