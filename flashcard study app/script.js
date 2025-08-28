 
        let currentSubject = '';
        let currentCardIndex = 0;
        let isFlipped = false;
        let favorites = new Set();
        let selectedQuestions = [];
        let studyQuestions = [];
        let userProgress = {
            math: { completed: 0, total: 20 },
            science: { completed: 0, total: 20 },
            history: { completed: 0, total: 20 }
        };
        let userPoints = 0;
        let userStreak = 0;
        let achievements = {
            firstSteps: false,
            speedLearner: false,
            perfectScore: false,
            knowledgeSeeker: false
        };
        
        const flashcards = {
            math: [
                { question: "What is the derivative of x²?", answer: "2x", explanation: "Using the power rule: d/dx(x²) = 2x¹ = 2x", difficulty: "Intermediate", icon: "🧮" },
                { question: "What is the area of a circle?", answer: "πr²", explanation: "The area of a circle is π times the radius squared", difficulty: "Beginner", icon: "⭕" },
                { question: "What is the quadratic formula?", answer: "x = (-b ± √(b²-4ac)) / 2a", explanation: "Used to solve quadratic equations of the form ax² + bx + c = 0", difficulty: "Advanced", icon: "📐" },
                { question: "What is the slope-intercept form?", answer: "y = mx + b", explanation: "Where m is the slope and b is the y-intercept", difficulty: "Beginner", icon: "📈" },
                { question: "What is the Pythagorean theorem?", answer: "a² + b² = c²", explanation: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides", difficulty: "Beginner", icon: "📐" },
                { question: "What is the integral of 2x?", answer: "x² + C", explanation: "The antiderivative of 2x is x² plus a constant", difficulty: "Intermediate", icon: "∫" },
                { question: "What is sin(90°)?", answer: "1", explanation: "The sine of 90 degrees (π/2 radians) equals 1", difficulty: "Beginner", icon: "📊" },
                { question: "What is the volume of a sphere?", answer: "(4/3)πr³", explanation: "The volume of a sphere with radius r", difficulty: "Intermediate", icon: "🌐" },
                { question: "What is log₁₀(100)?", answer: "2", explanation: "10 to the power of 2 equals 100", difficulty: "Intermediate", icon: "📊" },
                { question: "What is the sum of angles in a triangle?", answer: "180°", explanation: "The interior angles of any triangle always sum to 180 degrees", difficulty: "Beginner", icon: "🔺" },
                { question: "What is e^(ln(x))?", answer: "x", explanation: "The exponential and natural logarithm are inverse functions", difficulty: "Advanced", icon: "📈" },
                { question: "What is the discriminant formula?", answer: "b² - 4ac", explanation: "Used to determine the nature of roots in a quadratic equation", difficulty: "Advanced", icon: "🔢" },
                { question: "What is cos(0°)?", answer: "1", explanation: "The cosine of 0 degrees (0 radians) equals 1", difficulty: "Beginner", icon: "📊" },
                { question: "What is the perimeter of a rectangle?", answer: "2(l + w)", explanation: "Where l is length and w is width", difficulty: "Beginner", icon: "▭" },
                { question: "What is the limit of (sin x)/x as x approaches 0?", answer: "1", explanation: "This is a fundamental limit in calculus", difficulty: "Advanced", icon: "∞" },
                { question: "What is the surface area of a cube?", answer: "6s²", explanation: "Where s is the side length", difficulty: "Intermediate", icon: "🧊" },
                { question: "What is tan(45°)?", answer: "1", explanation: "The tangent of 45 degrees (π/4 radians) equals 1", difficulty: "Beginner", icon: "📊" },
                { question: "What is the factorial of 5?", answer: "120", explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120", difficulty: "Intermediate", icon: "!" },
                { question: "What is the distance formula?", answer: "√[(x₂-x₁)² + (y₂-y₁)²]", explanation: "Distance between two points in a coordinate plane", difficulty: "Intermediate", icon: "📏" },
                { question: "What is the binomial theorem for (a+b)²?", answer: "a² + 2ab + b²", explanation: "The expansion of a binomial squared", difficulty: "Intermediate", icon: "🔢" }
            ],
            science: [
                { question: "What is the chemical symbol for gold?", answer: "Au", explanation: "From the Latin word 'aurum' meaning gold", difficulty: "Beginner", icon: "🧪" },
                { question: "What is Newton's second law?", answer: "F = ma", explanation: "Force equals mass times acceleration", difficulty: "Intermediate", icon: "⚡" },
                { question: "What is photosynthesis?", answer: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂", explanation: "Plants convert carbon dioxide and water into glucose using sunlight", difficulty: "Advanced", icon: "🌱" },
                { question: "What is the speed of light?", answer: "299,792,458 m/s", explanation: "The speed of light in a vacuum", difficulty: "Intermediate", icon: "💡" },
                { question: "What is the atomic number of carbon?", answer: "6", explanation: "Carbon has 6 protons in its nucleus", difficulty: "Beginner", icon: "⚛️" },
                { question: "What is DNA?", answer: "Deoxyribonucleic acid", explanation: "The molecule that carries genetic information", difficulty: "Intermediate", icon: "🧬" },
                { question: "What is the formula for water?", answer: "H₂O", explanation: "Two hydrogen atoms bonded to one oxygen atom", difficulty: "Beginner", icon: "💧" },
                { question: "What is the powerhouse of the cell?", answer: "Mitochondria", explanation: "Organelles that produce ATP energy for the cell", difficulty: "Intermediate", icon: "🔋" },
                { question: "What is the pH of pure water?", answer: "7", explanation: "Pure water is neutral on the pH scale", difficulty: "Beginner", icon: "🧪" },
                { question: "What is the first law of thermodynamics?", answer: "Energy cannot be created or destroyed", explanation: "Also known as conservation of energy", difficulty: "Advanced", icon: "⚡" },
                { question: "What gas do plants absorb during photosynthesis?", answer: "Carbon dioxide", explanation: "CO₂ is converted into glucose and oxygen", difficulty: "Beginner", icon: "🌿" },
                { question: "What is the chemical symbol for sodium?", answer: "Na", explanation: "From the Latin word 'natrium'", difficulty: "Beginner", icon: "🧂" },
                { question: "What is the hardest natural substance?", answer: "Diamond", explanation: "Diamond has the highest hardness on the Mohs scale", difficulty: "Beginner", icon: "💎" },
                { question: "What is the unit of electric current?", answer: "Ampere", explanation: "Named after André-Marie Ampère", difficulty: "Intermediate", icon: "⚡" },
                { question: "What is the most abundant gas in Earth's atmosphere?", answer: "Nitrogen", explanation: "About 78% of the atmosphere is nitrogen", difficulty: "Intermediate", icon: "🌍" },
                { question: "What is the chemical formula for table salt?", answer: "NaCl", explanation: "Sodium chloride", difficulty: "Beginner", icon: "🧂" },
                { question: "What is the process of cell division called?", answer: "Mitosis", explanation: "The process by which cells divide to create new cells", difficulty: "Intermediate", icon: "🔬" },
                { question: "What is the boiling point of water at sea level?", answer: "100°C", explanation: "Water boils at 100 degrees Celsius at standard atmospheric pressure", difficulty: "Beginner", icon: "🌡️" },
                { question: "What is the chemical symbol for iron?", answer: "Fe", explanation: "From the Latin word 'ferrum'", difficulty: "Beginner", icon: "🔩" },
                { question: "What is the study of earthquakes called?", answer: "Seismology", explanation: "The scientific study of earthquakes and seismic waves", difficulty: "Advanced", icon: "🌋" }
            ],
            history: [
                { question: "When did World War II end?", answer: "1945", explanation: "World War II ended on September 2, 1945 with Japan's surrender", difficulty: "Beginner", icon: "📜" },
                { question: "Who was the first Roman Emperor?", answer: "Augustus", explanation: "Augustus Caesar became the first Roman Emperor in 27 BCE", difficulty: "Intermediate", icon: "🏛️" },
                { question: "What caused the fall of the Byzantine Empire?", answer: "Ottoman conquest of Constantinople in 1453", explanation: "The Ottoman Empire captured Constantinople, ending the Byzantine Empire", difficulty: "Advanced", icon: "⚔️" },
                { question: "When did the American Civil War begin?", answer: "1861", explanation: "The war began on April 12, 1861 with the attack on Fort Sumter", difficulty: "Intermediate", icon: "🇺🇸" },
                { question: "Who wrote the Declaration of Independence?", answer: "Thomas Jefferson", explanation: "Jefferson was the primary author of this founding document", difficulty: "Beginner", icon: "📝" },
                { question: "When did the Berlin Wall fall?", answer: "1989", explanation: "The Berlin Wall fell on November 9, 1989", difficulty: "Intermediate", icon: "🧱" },
                { question: "Who was the first President of the United States?", answer: "George Washington", explanation: "Washington served from 1789 to 1797", difficulty: "Beginner", icon: "🎩" },
                { question: "When did the French Revolution begin?", answer: "1789", explanation: "The revolution began with the storming of the Bastille", difficulty: "Intermediate", icon: "🇫🇷" },
                { question: "What empire did Genghis Khan found?", answer: "Mongol Empire", explanation: "The largest contiguous land empire in history", difficulty: "Intermediate", icon: "🏹" },
                { question: "When did Christopher Columbus reach the Americas?", answer: "1492", explanation: "Columbus landed in the Caribbean on October 12, 1492", difficulty: "Beginner", icon: "⛵" },
                { question: "Who was the last Pharaoh of Egypt?", answer: "Cleopatra VII", explanation: "She ruled until 30 BCE when Egypt became a Roman province", difficulty: "Advanced", icon: "👑" },
                { question: "When did the Industrial Revolution begin?", answer: "1760s", explanation: "Started in Britain in the mid-18th century", difficulty: "Intermediate", icon: "⚙️" },
                { question: "What was the Black Death?", answer: "Bubonic plague pandemic", explanation: "Devastated Europe in the 14th century", difficulty: "Intermediate", icon: "💀" },
                { question: "Who painted the Sistine Chapel ceiling?", answer: "Michelangelo", explanation: "Completed between 1508 and 1512", difficulty: "Beginner", icon: "🎨" },
                { question: "When did World War I begin?", answer: "1914", explanation: "Started on July 28, 1914 with Austria-Hungary's declaration of war", difficulty: "Beginner", icon: "⚔️" },
                { question: "What was the Renaissance?", answer: "Cultural rebirth in Europe", explanation: "Period of renewed interest in art, science, and learning (14th-17th centuries)", difficulty: "Intermediate", icon: "🎭" },
                { question: "Who was Julius Caesar?", answer: "Roman general and dictator", explanation: "Played a critical role in the fall of the Roman Republic", difficulty: "Intermediate", icon: "🏛️" },
                { question: "When did the Great Depression begin?", answer: "1929", explanation: "Started with the stock market crash in October 1929", difficulty: "Intermediate", icon: "📉" },
                { question: "What was the Cold War?", answer: "Ideological conflict between US and USSR", explanation: "Lasted from 1947 to 1991", difficulty: "Advanced", icon: "🧊" },
                { question: "Who invented the printing press?", answer: "Johannes Gutenberg", explanation: "Around 1440 in Germany", difficulty: "Intermediate", icon: "📚" }
            ]
        };

        // Theme management
        function toggleTheme() {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        // Initialize theme
        function initTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                document.getElementById('themeIcon').textContent = '☀️';
            }
        }

        // Navigation functions
        function showDashboard() {
            document.getElementById('homepage').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            document.getElementById('subjectSelection').classList.add('hidden');
            document.getElementById('studyMode').classList.add('hidden');
            updateProgressDisplay();
        }

        function showSubjectSelection(subject) {
            currentSubject = subject;
            selectedQuestions = [];
            
            document.getElementById('dashboard').classList.add('hidden');
            document.getElementById('subjectSelection').classList.remove('hidden');
            
            const subjectTitles = {
                math: 'Mathematics',
                science: 'Science',
                history: 'History'
            };
            
            document.getElementById('selectionTitle').textContent = `Select ${subjectTitles[subject]} Questions`;
            
            const questionSelection = document.getElementById('questionSelection');
            questionSelection.innerHTML = '';
            
            flashcards[subject].forEach((card, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'bg-gray-50 dark:bg-gray-700 p-4 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all border-2 border-transparent';
                questionDiv.innerHTML = `
                    <div class="text-2xl mb-2">${card.icon}</div>
                    <p class="text-sm font-medium text-gray-800 dark:text-white mb-2">${card.question.substring(0, 50)}...</p>
                    <span class="text-xs px-2 py-1 rounded-full ${getDifficultyColor(card.difficulty)}">${card.difficulty}</span>
                `;
                questionDiv.onclick = () => toggleQuestionSelection(index, questionDiv);
                questionSelection.appendChild(questionDiv);
            });
        }

        function getDifficultyColor(difficulty) {
            switch(difficulty) {
                case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
                case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
                case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
                default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
            }
        }

        function toggleQuestionSelection(index, element) {
            const isSelected = selectedQuestions.includes(index);
            
            if (isSelected) {
                selectedQuestions = selectedQuestions.filter(i => i !== index);
                element.classList.remove('border-purple-500', 'bg-purple-50', 'dark:bg-purple-900');
            } else {
                selectedQuestions.push(index);
                element.classList.add('border-purple-500', 'bg-purple-50', 'dark:bg-purple-900');
            }
            
            const startBtn = document.getElementById('startStudyBtn');
            startBtn.disabled = selectedQuestions.length === 0;
            startBtn.textContent = `Start Studying (${selectedQuestions.length} selected)`;
        }

        function startStudying() {
            if (selectedQuestions.length === 0) return;
            
            studyQuestions = selectedQuestions.map(index => flashcards[currentSubject][index]);
            currentCardIndex = 0;
            isFlipped = false;
            
            document.getElementById('subjectSelection').classList.add('hidden');
            document.getElementById('studyMode').classList.remove('hidden');
            
            const subjectTitles = {
                math: 'Mathematics',
                science: 'Science',
                history: 'History'
            };
            
            document.getElementById('subjectTitle').textContent = subjectTitles[currentSubject];
            document.getElementById('totalCards').textContent = studyQuestions.length;
            
            loadCard();
        }

        function loadCard() {
            const card = studyQuestions[currentCardIndex];
            const flashcardElement = document.getElementById('flashcard');
            
            flashcardElement.classList.remove('flipped');
            isFlipped = false;
            
            document.getElementById('questionIcon').textContent = card.icon;
            document.getElementById('questionText').textContent = card.question;
            document.getElementById('answerText').textContent = card.answer;
            document.getElementById('explanationText').textContent = card.explanation;
            document.getElementById('cardDifficulty').textContent = card.difficulty;
            document.getElementById('cardNumber').textContent = currentCardIndex + 1;
            
            const progress = ((currentCardIndex + 1) / studyQuestions.length) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
            
            document.getElementById('prevBtn').disabled = currentCardIndex === 0;
            document.getElementById('nextBtn').disabled = currentCardIndex === studyQuestions.length - 1;
            
            const cardId = `${currentSubject}-${selectedQuestions[currentCardIndex]}`;
            const favoriteBtn = document.getElementById('favoriteBtn');
            favoriteBtn.innerHTML = favorites.has(cardId) ? '<span class="text-2xl">❤️</span>' : '<span class="text-2xl">🤍</span>';
        }

        function flipCard() {
            const flashcardElement = document.getElementById('flashcard');
            flashcardElement.classList.toggle('flipped');
            isFlipped = !isFlipped;
        }

        function nextCard() {
            if (currentCardIndex < studyQuestions.length - 1) {
                currentCardIndex++;
                loadCard();
            }
        }

        function previousCard() {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                loadCard();
            }
        }

        function toggleFavorite() {
            const cardId = `${currentSubject}-${selectedQuestions[currentCardIndex]}`;
            if (favorites.has(cardId)) {
                favorites.delete(cardId);
            } else {
                favorites.add(cardId);
            }
            loadCard();
        }

        function markCard(difficulty) {
            const points = { easy: 5, medium: 10, hard: 15 };
            userPoints += points[difficulty];
            userProgress[currentSubject].completed++;
            
            updateProgressDisplay();
            checkAchievements();
            
            const flashcard = document.getElementById('flashcard');
            flashcard.classList.add('bounce-in');
            
            setTimeout(() => {
                flashcard.classList.remove('bounce-in');
                if (currentCardIndex < studyQuestions.length - 1) {
                    nextCard();
                } else {
                    // Study session complete
                    showDashboard();
                    showAchievement('Study session completed! 🎉');
                }
            }, 500);
        }

        function updateProgressDisplay() {
            document.getElementById('pointsDisplay').textContent = userPoints;
            document.getElementById('streakDisplay').textContent = `🔥 ${userStreak}`;
            
            // Update progress circles
            Object.keys(userProgress).forEach(subject => {
                const progress = userProgress[subject];
                const percentage = Math.round((progress.completed / progress.total) * 100);
                document.getElementById(`${subject}Progress`).textContent = `${percentage}%`;
                document.getElementById(`${subject}Stats`).textContent = `${progress.completed}/${progress.total} cards mastered`;
            });
        }

        function checkAchievements() {
            if (!achievements.firstSteps && userPoints >= 10) {
                achievements.firstSteps = true;
                unlockAchievement('firstSteps', 'First Steps - Earned your first 10 points!');
            }
            
            if (!achievements.speedLearner && userPoints >= 100) {
                achievements.speedLearner = true;
                unlockAchievement('speedLearner', 'Speed Learner - Reached 100 points!');
            }
            
            if (!achievements.knowledgeSeeker && userPoints >= 250) {
                achievements.knowledgeSeeker = true;
                unlockAchievement('knowledgeSeeker', 'Knowledge Seeker - Reached 250 points!');
            }
            
            const totalCompleted = Object.values(userProgress).reduce((sum, p) => sum + p.completed, 0);
            if (!achievements.perfectScore && totalCompleted >= 30) {
                achievements.perfectScore = true;
                unlockAchievement('perfectScore', 'Perfect Score - Completed 30 cards!');
            }
        }

        function unlockAchievement(achievementKey, message) {
            const achievementsList = document.getElementById('achievementsList');
            const achievementElements = achievementsList.children;
            
            const achievementMap = {
                firstSteps: 0,
                speedLearner: 1,
                perfectScore: 2,
                knowledgeSeeker: 3
            };
            
            const element = achievementElements[achievementMap[achievementKey]];
            element.classList.remove('opacity-50');
            element.querySelector('.bg-gray-300, .bg-gray-600').className = 'w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mb-2';
            
            showAchievement(message);
        }

        function showAchievement(message) {
            const notification = document.getElementById('achievementNotification');
            document.getElementById('achievementText').textContent = message;
            notification.classList.remove('hidden');
            
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }

        // Add click event to flip card
        document.getElementById('flashcard').addEventListener('click', flipCard);
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (document.getElementById('studyMode').classList.contains('hidden')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    previousCard();
                    break;
                case 'ArrowRight':
                    nextCard();
                    break;
                case ' ':
                    e.preventDefault();
                    flipCard();
                    break;
            }
        });

        // Initialize app
        initTheme();
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'975ee72dd6ee63e4',t:'MTc1NjMzMjY2OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();