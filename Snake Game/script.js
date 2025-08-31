
        // Settings Management
        class SettingsManager {
            constructor() {
                this.settings = this.loadSettings();
                this.saveSettings();
            }

            loadSettings() {
                const defaultSettings = {
                    speed: 'normal',
                    bestScore: 0
                };
                
                try {
                    const saved = localStorage.getItem('snakeGameSettings');
                    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
                } catch (e) {
                    return defaultSettings;
                }
            }

            saveSettings() {
                localStorage.setItem('snakeGameSettings', JSON.stringify(this.settings));
            }

            getSpeed() {
                return this.settings.speed;
            }

            setSpeed(speed) {
                this.settings.speed = speed;
                this.saveSettings();
            }

            getBestScore() {
                return this.settings.bestScore;
            }

            setBestScore(score) {
                this.settings.bestScore = score;
                this.saveSettings();
            }

            resetBestScore() {
                this.settings.bestScore = 0;
                this.saveSettings();
            }

            getSpeedMultiplier() {
                const speeds = {
                    slow: 1.5,
                    normal: 1.0,
                    fast: 0.7,
                    extreme: 0.4
                };
                return speeds[this.settings.speed] || 1.0;
            }
        }

        // Score Management
        class ScoreManager {
            constructor() {
                this.currentScore = 0;
                this.settingsManager = new SettingsManager();
                this.bestScore = this.settingsManager.getBestScore();
                this.updateDisplay();
            }

            loadBestScore() {
                return this.settingsManager.getBestScore();
            }

            saveBestScore() {
                this.settingsManager.setBestScore(this.bestScore);
            }

            updateScore(points) {
                this.currentScore += points;
                document.getElementById('score').textContent = this.currentScore;
                
                if (this.currentScore > this.bestScore) {
                    this.bestScore = this.currentScore;
                    this.saveBestScore();
                    this.updateDisplay();
                    return true; // New record
                }
                return false;
            }

            resetCurrentScore() {
                this.currentScore = 0;
                document.getElementById('score').textContent = '0';
            }

            updateDisplay() {
                document.getElementById('bestScore').textContent = this.bestScore;
                document.getElementById('homeHighScore').textContent = `Best Score: ${this.bestScore}`;
            }

            getCurrentScore() {
                return this.currentScore;
            }

            getBestScore() {
                return this.bestScore;
            }

            resetBestScore() {
                this.bestScore = 0;
                this.settingsManager.resetBestScore();
                this.updateDisplay();
            }
        }

        // Game State Management
        class SnakeGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.gridSize = 20;
                this.tileCount = this.canvas.width / this.gridSize;
                
                // Game state
                this.snake = [{ x: 10, y: 10 }];
                this.food = this.generateFood();
                this.dx = 0;
                this.dy = 0;
                this.gameRunning = false;
                this.gamePaused = false;
                this.gameLoopId = null;
                
                // Score manager
                this.scoreManager = new ScoreManager();
                
                this.setupEventListeners();
                this.setupMobileControls();
            }

            generateFood() {
                let food;
                do {
                    food = {
                        x: Math.floor(Math.random() * this.tileCount),
                        y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
                    };
                } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
                
                return food;
            }

            setupEventListeners() {
                // Keyboard controls
                document.addEventListener('keydown', (e) => {
                    if (!this.gameRunning) return;
                    
                    const key = e.key.toLowerCase();
                    
                    // Pause with spacebar
                    if (key === ' ') {
                        e.preventDefault();
                        this.togglePause();
                        return;
                    }
                    
                    if (this.gamePaused) return;
                    
                    // Movement controls - prevent reverse direction
                    if ((key === 'arrowleft' || key === 'a') && this.dx !== 1) {
                        this.dx = -1; this.dy = 0;
                    } else if ((key === 'arrowup' || key === 'w') && this.dy !== 1) {
                        this.dx = 0; this.dy = -1;
                    } else if ((key === 'arrowright' || key === 'd') && this.dx !== -1) {
                        this.dx = 1; this.dy = 0;
                    } else if ((key === 'arrowdown' || key === 's') && this.dy !== -1) {
                        this.dx = 0; this.dy = 1;
                    }
                });
            }

            setupMobileControls() {
                // Touch controls for mobile
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (!this.gameRunning || this.gamePaused) return;
                    
                    const rect = this.canvas.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;
                    
                    const centerX = this.canvas.width / 2;
                    const centerY = this.canvas.height / 2;
                    
                    const deltaX = x - centerX;
                    const deltaY = y - centerY;
                    
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        // Horizontal movement
                        if (deltaX > 0 && this.dx !== -1) {
                            this.dx = 1; this.dy = 0;
                        } else if (deltaX < 0 && this.dx !== 1) {
                            this.dx = -1; this.dy = 0;
                        }
                    } else {
                        // Vertical movement
                        if (deltaY > 0 && this.dy !== -1) {
                            this.dx = 0; this.dy = 1;
                        } else if (deltaY < 0 && this.dy !== 1) {
                            this.dx = 0; this.dy = -1;
                        }
                    }
                });
            }

            start() {
                this.gameRunning = true;
                this.gamePaused = false;
                this.scoreManager.resetCurrentScore();
                document.getElementById('pauseBtn').disabled = false;
                this.gameLoop();
            }

            togglePause() {
                if (!this.gameRunning) return;
                
                this.gamePaused = !this.gamePaused;
                const pauseBtn = document.getElementById('pauseBtn');
                const pauseOverlay = document.getElementById('pauseOverlay');
                
                if (this.gamePaused) {
                    pauseBtn.textContent = 'Resume';
                    pauseOverlay.style.display = 'block';
                    if (this.gameLoopId) {
                        clearTimeout(this.gameLoopId);
                    }
                } else {
                    pauseBtn.textContent = 'Pause';
                    pauseOverlay.style.display = 'none';
                    this.gameLoop();
                }
            }

            restart() {
                // Reset game state
                this.snake = [{ x: 10, y: 10 }];
                this.food = this.generateFood();
                this.dx = 0;
                this.dy = 0;
                this.gameRunning = true;
                this.gamePaused = false;
                
                // Reset UI
                this.scoreManager.resetCurrentScore();
                document.getElementById('gameOver').style.display = 'none';
                document.getElementById('pauseOverlay').style.display = 'none';
                document.getElementById('pauseBtn').textContent = 'Pause';
                document.getElementById('pauseBtn').disabled = false;
                
                // Start game loop
                this.gameLoop();
            }

            gameLoop() {
                if (!this.gameRunning || this.gamePaused) return;

                this.update();
                this.draw();

                // Continue game loop with variable speed based on score and settings
                const baseSpeed = 200;
                const scoreSpeedBonus = Math.floor(this.scoreManager.getCurrentScore() / 50) * 10;
                const settingsMultiplier = this.scoreManager.settingsManager.getSpeedMultiplier();
                const finalSpeed = Math.max(80, (baseSpeed - scoreSpeedBonus) * settingsMultiplier);
                
                this.gameLoopId = setTimeout(() => this.gameLoop(), finalSpeed);
            }

            update() {
                // Don't move if no direction set
                if (this.dx === 0 && this.dy === 0) return;

                // Move snake head
                const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

                // Check wall collision
                if (head.x < 0 || head.x >= this.tileCount || 
                    head.y < 0 || head.y >= (this.canvas.height / this.gridSize)) {
                    this.gameOver();
                    return;
                }

                // Check self collision
                for (let segment of this.snake) {
                    if (head.x === segment.x && head.y === segment.y) {
                        this.gameOver();
                        return;
                    }
                }

                this.snake.unshift(head);

                // Check food collision
                if (head.x === this.food.x && head.y === this.food.y) {
                    const isNewRecord = this.scoreManager.updateScore(10);
                    this.food = this.generateFood();
                    
                    // Visual feedback for new record
                    if (isNewRecord) {
                        document.getElementById('bestScore').style.animation = 'pulse 0.5s';
                        setTimeout(() => {
                            document.getElementById('bestScore').style.animation = '';
                        }, 500);
                    }
                } else {
                    this.snake.pop();
                }
            }

            draw() {
                // Clear canvas with gradient background
                const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
                gradient.addColorStop(0, '#0f0f23');
                gradient.addColorStop(1, '#1a1a2e');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Draw snake with glow effect
                this.ctx.shadowColor = '#00ff88';
                this.ctx.shadowBlur = 10;
                
                this.snake.forEach((segment, index) => {
                    this.ctx.fillStyle = index === 0 ? '#00ff88' : '#00cc6a';
                    this.ctx.fillRect(
                        segment.x * this.gridSize + 2,
                        segment.y * this.gridSize + 2,
                        this.gridSize - 4,
                        this.gridSize - 4
                    );
                });

                // Draw food with pulsing effect
                this.ctx.shadowColor = '#ff6b6b';
                this.ctx.shadowBlur = 15;
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.fillRect(
                    this.food.x * this.gridSize + 2,
                    this.food.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );

                // Reset shadow
                this.ctx.shadowBlur = 0;
            }

            gameOver() {
                this.gameRunning = false;
                if (this.gameLoopId) {
                    clearTimeout(this.gameLoopId);
                }
                
                const finalScore = this.scoreManager.getCurrentScore();
                const bestScore = this.scoreManager.getBestScore();
                const isNewRecord = finalScore === bestScore && finalScore > 0;
                
                // Update game over display
                document.getElementById('finalScore').textContent = finalScore;
                document.getElementById('gameOverBest').textContent = bestScore;
                document.getElementById('newRecord').style.display = isNewRecord ? 'block' : 'none';
                document.getElementById('gameOver').style.display = 'block';
                document.getElementById('pauseBtn').disabled = true;
            }

            stop() {
                this.gameRunning = false;
                this.gamePaused = false;
                if (this.gameLoopId) {
                    clearTimeout(this.gameLoopId);
                }
            }
        }

        // UI Management
        class UIManager {
            constructor() {
                this.game = null;
                this.settingsManager = new SettingsManager();
                this.setupEventListeners();
                this.updateHomeScore();
                this.updateSettingsUI();
            }

            updateHomeScore() {
                const bestScore = this.settingsManager.getBestScore();
                document.getElementById('homeHighScore').textContent = `Best Score: ${bestScore}`;
            }

            updateSettingsUI() {
                // Update speed buttons
                const speedButtons = document.querySelectorAll('.speed-btn');
                const currentSpeed = this.settingsManager.getSpeed();
                
                speedButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.speed === currentSpeed) {
                        btn.classList.add('active');
                    }
                });
            }

            setupEventListeners() {
                // Start button
                document.getElementById('startBtn').addEventListener('click', () => {
                    this.startGame();
                });

                // Settings button
                document.getElementById('settingsBtn').addEventListener('click', () => {
                    this.openSettings();
                });

                // Settings modal
                document.getElementById('closeSettings').addEventListener('click', () => {
                    this.closeSettings();
                });

                // Speed buttons
                document.querySelectorAll('.speed-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        this.setSpeed(btn.dataset.speed);
                    });
                });

                // Reset score button
                document.getElementById('resetScoreBtn').addEventListener('click', () => {
                    this.showResetConfirmation();
                });

                // Confirmation modal
                document.getElementById('confirmReset').addEventListener('click', () => {
                    this.confirmReset();
                });

                document.getElementById('cancelReset').addEventListener('click', () => {
                    this.cancelReset();
                });

                // Control buttons
                document.getElementById('pauseBtn').addEventListener('click', () => {
                    if (this.game) {
                        this.game.togglePause();
                    }
                });

                document.getElementById('homeBtn').addEventListener('click', () => {
                    this.goHome();
                });

                document.getElementById('restartBtn').addEventListener('click', () => {
                    if (this.game) {
                        this.game.restart();
                    }
                });

                // Close modals when clicking outside
                document.getElementById('settingsModal').addEventListener('click', (e) => {
                    if (e.target.id === 'settingsModal') {
                        this.closeSettings();
                    }
                });

                document.getElementById('confirmationModal').addEventListener('click', (e) => {
                    if (e.target.id === 'confirmationModal') {
                        this.cancelReset();
                    }
                });
            }

            openSettings() {
                document.getElementById('settingsModal').style.display = 'flex';
                this.updateSettingsUI();
            }

            closeSettings() {
                document.getElementById('settingsModal').style.display = 'none';
            }

            setSpeed(speed) {
                this.settingsManager.setSpeed(speed);
                this.updateSettingsUI();
            }

            showResetConfirmation() {
                const bestScore = this.settingsManager.getBestScore();
                document.getElementById('confirmScore').textContent = bestScore;
                document.getElementById('confirmationModal').style.display = 'flex';
            }

            confirmReset() {
                this.settingsManager.resetBestScore();
                this.updateHomeScore();
                document.getElementById('confirmationModal').style.display = 'none';
                document.getElementById('settingsModal').style.display = 'none';
                
                // Update game display if active
                if (this.game && this.game.scoreManager) {
                    this.game.scoreManager.bestScore = 0;
                    this.game.scoreManager.updateDisplay();
                }
            }

            cancelReset() {
                document.getElementById('confirmationModal').style.display = 'none';
            }

            startGame() {
                // Show and trigger curtain animation
                const curtain = document.getElementById('curtain');
                curtain.classList.add('active');
                
                setTimeout(() => {
                    curtain.classList.add('opening');
                }, 50);

                // Hide homepage and show game after animation
                setTimeout(() => {
                    document.getElementById('homepage').classList.add('hidden');
                    document.getElementById('gameContainer').style.display = 'flex';
                    curtain.classList.remove('active');
                    
                    // Initialize and start game
                    this.game = new SnakeGame();
                    this.game.start();
                }, 1600);
            }

            goHome() {
                // Stop game
                if (this.game) {
                    this.game.stop();
                }

                // Show curtain and transition back
                const curtain = document.getElementById('curtain');
                curtain.classList.add('active');
                curtain.classList.remove('opening');

                setTimeout(() => {
                    document.getElementById('gameContainer').style.display = 'none';
                    document.getElementById('homepage').classList.remove('hidden');
                    document.getElementById('gameOver').style.display = 'none';
                    document.getElementById('pauseOverlay').style.display = 'none';
                    document.getElementById('pauseBtn').textContent = 'Pause';
                    
                    // Update home screen score
                    this.updateHomeScore();
                    
                    // Reset curtain for next time
                    setTimeout(() => {
                        curtain.classList.add('opening');
                        setTimeout(() => {
                            curtain.classList.remove('active', 'opening');
                        }, 1500);
                    }, 100);
                }, 100);
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            new UIManager();
        });

        // Prevent scrolling on mobile
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9778e146c548fd92',t:'MTc1NjYwNTA1Ny4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();