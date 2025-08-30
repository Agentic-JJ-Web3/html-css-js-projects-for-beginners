 
        const emojiCategories = {
            fruits: ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒'],
            symbols: ['⭐', '💎', '🔥', '⚡', '🌟', '💫', '✨', '🎯'],
            flags: ['🏁', '🏳️', '🚩', '🏴', '🏳️‍🌈', '🏴‍☠️', '🎌', '🏳️‍⚧️'],
            sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸'],
            electronics: ['📱', '💻', '⌚', '📷', '🎧', '📺', '🖥️', '⌨️'],
            animals: ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
            vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑'],
            nature: ['🌳', '🌲', '🌴', '🌵', '🌿', '🍀', '🌺', '🌻']
        };
        
        const questions = [
            "What emoji best describes your morning routine?",
            "What's a work skill you're proud of developing?",
            "If you could have any superpower at work, what would it be?",
            "What's your favorite way to celebrate team wins?",
            "What's one thing that always makes you smile during the workday?",
            "If your job was a movie genre, what would it be and why?",
            "What's the best piece of advice you've received from a colleague?",
            "What's your go-to method for staying organized?",
            "If you could swap jobs with anyone on the team for a day, who and why?",
            "What's something new you'd like to learn or try this year?",
            "What's your favorite team-building activity?",
            "How do you prefer to receive feedback?",
            "What's your ideal work environment?",
            "What motivates you most in your daily work?",
            "What's a recent accomplishment you're proud of?"
        ];
        
        let currentCategory = 'fruits';
        let currentLevel = 1;
        let gameBoard = [];
        let flippedCards = [];
        let matchedGroups = 0;
        let moves = 0;
        let startTime = null;
        let timerInterval = null;
        let usedQuestions = [];
        let requiredMatches = 2; // pairs
        
        // Category selection
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                currentCategory = this.dataset.category;
            });
        });
        
        function startGame() {
            document.getElementById('homepage').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            initLevel();
        }
        
        function goHome() {
            document.getElementById('gameContainer').style.display = 'none';
            document.getElementById('homepage').style.display = 'flex';
            resetGame();
        }
        
        function initLevel() {
            // Determine required matches based on level
            if (currentLevel === 1) {
                requiredMatches = 2; // pairs
            } else if (currentLevel === 2) {
                requiredMatches = 3; // triplets
            } else {
                requiredMatches = 4; // quadruplets
            }
            
            updateDifficultyIndicator();
            createGameBoard();
            renderBoard();
            resetStats();
        }
        
        function updateDifficultyIndicator() {
            const indicator = document.getElementById('difficultyIndicator');
            const levelNames = ['Pairs', 'Triplets', 'Quadruplets'];
            indicator.textContent = `Level ${currentLevel}: ${levelNames[currentLevel - 1]}`;
        }
        
        function createGameBoard() {
            const emojis = emojiCategories[currentCategory];
            const numGroups = 6;
            const totalCards = numGroups * requiredMatches;
            
            gameBoard = [];
            
            // Create groups of matching emojis
            for (let i = 0; i < numGroups; i++) {
                for (let j = 0; j < requiredMatches; j++) {
                    gameBoard.push(emojis[i % emojis.length]);
                }
            }
            
            // Shuffle the array
            for (let i = gameBoard.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gameBoard[i], gameBoard[j]] = [gameBoard[j], gameBoard[i]];
            }
        }
        
        function renderBoard() {
            const board = document.getElementById('gameBoard');
            board.innerHTML = '';
            
            // Set grid layout based on level
            const layoutClass = `board-${requiredMatches}x6`;
            board.className = `game-board ${layoutClass}`;
            
            gameBoard.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<div class="card-content">${emoji}</div>`;
                card.addEventListener('click', () => flipCard(index));
                board.appendChild(card);
            });
            
            // Update total matches display
            document.getElementById('totalMatches').textContent = 6;
        }
        
        function flipCard(index) {
            const cards = document.querySelectorAll('.card');
            const card = cards[index];
            
            // Don't flip if already flipped, matched, or max cards are flipped
            if (card.classList.contains('flipped') || 
                card.classList.contains('matched') || 
                flippedCards.length >= requiredMatches) {
                return;
            }
            
            // Start timer on first move
            if (moves === 0) {
                startTimer();
            }
            
            card.classList.add('flipped');
            flippedCards.push(index);
            
            if (flippedCards.length === requiredMatches) {
                moves++;
                document.getElementById('moves').textContent = moves;
                
                setTimeout(() => {
                    checkMatch();
                }, 1000);
            }
        }
        
        function checkMatch() {
            const cards = document.querySelectorAll('.card');
            
            // Check if all flipped cards have the same emoji
            const firstEmoji = gameBoard[flippedCards[0]];
            const isMatch = flippedCards.every(index => gameBoard[index] === firstEmoji);
            
            if (isMatch) {
                // Match found!
                flippedCards.forEach(index => {
                    cards[index].classList.add('matched');
                    cards[index].classList.remove('flipped');
                });
                
                matchedGroups++;
                document.getElementById('matches').textContent = matchedGroups;
                
                // Show conversation starter
                showQuestion();
                
                // Check if level is complete
                if (matchedGroups === 6) {
                    setTimeout(() => {
                        completeLevel();
                    }, 1000);
                }
            } else {
                // No match
                flippedCards.forEach(index => {
                    cards[index].classList.remove('flipped');
                });
            }
            
            flippedCards = [];
        }
        
        function showQuestion() {
            let availableQuestions = questions.filter(q => !usedQuestions.includes(q));
            
            if (availableQuestions.length === 0) {
                usedQuestions = [];
                availableQuestions = questions;
            }
            
            const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
            usedQuestions.push(randomQuestion);
            
            document.getElementById('questionText').textContent = randomQuestion;
            document.getElementById('questionModal').style.display = 'flex';
        }
        
        function closeQuestion() {
            document.getElementById('questionModal').style.display = 'none';
        }
        
        function completeLevel() {
            clearInterval(timerInterval);
            
            const title = document.getElementById('levelCompleteTitle');
            const text = document.getElementById('levelCompleteText');
            
            if (currentLevel < 3) {
                title.textContent = `🎉 Level ${currentLevel} Complete!`;
                text.textContent = `Excellent work! You've mastered ${requiredMatches === 2 ? 'pairs' : 'triplets'}. Ready for the next challenge?`;
            } else {
                title.textContent = '🏆 Congratulations! Game Complete!';
                text.textContent = 'You\'ve mastered all difficulty levels! You\'re a memory matching champion!';
            }
            
            document.getElementById('levelCompleteModal').style.display = 'flex';
        }
        
        function nextLevel() {
            document.getElementById('levelCompleteModal').style.display = 'none';
            
            if (currentLevel < 3) {
                currentLevel++;
                document.getElementById('currentLevel').textContent = currentLevel;
                initLevel();
            } else {
                goHome();
            }
        }
        
        function resetLevel() {
            clearInterval(timerInterval);
            matchedGroups = 0;
            moves = 0;
            flippedCards = [];
            initLevel();
        }
        
        function resetGame() {
            currentLevel = 1;
            document.getElementById('currentLevel').textContent = currentLevel;
            clearInterval(timerInterval);
            matchedGroups = 0;
            moves = 0;
            flippedCards = [];
            usedQuestions = [];
            closeQuestion();
            document.getElementById('levelCompleteModal').style.display = 'none';
        }
        
        function startTimer() {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }
        
        function updateTimer() {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }
        
        function resetStats() {
            document.getElementById('moves').textContent = '0';
            document.getElementById('matches').textContent = '0';
            document.getElementById('timer').textContent = '00:00';
        }
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97366eb57474fea9',t:'MTc1NTkwODMwNC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();