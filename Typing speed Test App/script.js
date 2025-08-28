
        // Text samples for different categories and difficulties
        const textSamples = {
            quotes: {
                beginner: [
                    "The only way to do great work is to love what you do.",
                    "Life is what happens to you while you are busy making other plans.",
                    "The future belongs to those who believe in the beauty of their dreams."
                ],
                intermediate: [
                    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                    "The only impossible journey is the one you never begin. Take the first step today.",
                    "Innovation distinguishes between a leader and a follower in every field of endeavor."
                ],
                advanced: [
                    "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty, and that makes all the difference in achieving success.",
                    "It is during our darkest moments that we must focus to see the light, for it is in these times that our true character is revealed and tested.",
                    "The greatest glory in living lies not in never falling, but in rising every time we fall with renewed determination and unwavering spirit."
                ]
            },
            literature: {
                beginner: [
                    "It was the best of times, it was the worst of times.",
                    "To be or not to be, that is the question.",
                    "All that glitters is not gold, but dreams can be."
                ],
                intermediate: [
                    "In the beginning was the Word, and the Word was with God, and the Word was God.",
                    "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse.",
                    "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."
                ],
                advanced: [
                    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
                    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat.",
                    "Last night I dreamt I went to Manderley again. It seemed to me I stood by the iron gate leading to the drive, and for a while I could not enter, for the way was barred to me."
                ]
            },
            news: {
                beginner: [
                    "Today marks a new chapter in technology advancement.",
                    "Scientists discover new ways to help the environment.",
                    "Local community comes together to support education."
                ],
                intermediate: [
                    "Researchers at the university have developed a breakthrough technology that could revolutionize renewable energy production.",
                    "The global economy shows signs of recovery as markets respond positively to new trade agreements and policy changes.",
                    "Climate change initiatives gain momentum as world leaders commit to ambitious carbon reduction targets for the next decade."
                ],
                advanced: [
                    "The unprecedented collaboration between international space agencies has resulted in groundbreaking discoveries about exoplanets that could potentially harbor life, fundamentally changing our understanding of the universe.",
                    "Artificial intelligence continues to transform industries at an exponential rate, with machine learning algorithms now capable of performing complex tasks that were previously thought to require human intuition and creativity.",
                    "The intersection of biotechnology and quantum computing promises to unlock new frontiers in medical research, potentially leading to personalized treatments that could revolutionize healthcare delivery systems worldwide."
                ]
            },
            programming: {
                beginner: [
                    "function hello() { return 'Hello World'; }",
                    "const name = 'JavaScript'; console.log(name);",
                    "if (true) { alert('This works!'); }"
                ],
                intermediate: [
                    "const fetchData = async () => { const response = await fetch('/api/data'); return response.json(); };",
                    "class Calculator { constructor() { this.result = 0; } add(num) { this.result += num; return this; } }",
                    "const numbers = [1, 2, 3, 4, 5]; const doubled = numbers.map(n => n * 2).filter(n => n > 5);"
                ],
                advanced: [
                    "const memoize = (fn) => { const cache = new Map(); return (...args) => { const key = JSON.stringify(args); return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)).get(key); }; };",
                    "function* fibonacci() { let [a, b] = [0, 1]; while (true) { yield a; [a, b] = [b, a + b]; } } const fib = fibonacci(); console.log([...Array(10)].map(() => fib.next().value));",
                    "const createObservable = (producer) => ({ subscribe: (observer) => { producer(observer); return { unsubscribe: () => console.log('Unsubscribed') }; } });"
                ]
            }
        };

        // Global variables
        let currentTest = {
            text: '',
            startTime: null,
            endTime: null,
            duration: 60,
            isActive: false,
            currentIndex: 0,
            errors: 0,
            correctChars: 0,
            timer: null
        };

        // Navigation
        function showSection(sectionName) {
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(sectionName).classList.remove('hidden');
            
            if (sectionName === 'leaderboard') {
                updateLeaderboard();
                updateStats();
            }
        }

        // Test functionality
        function startTest() {
            const duration = parseInt(document.getElementById('duration').value);
            const difficulty = document.getElementById('difficulty').value;
            const category = document.getElementById('category').value;
            
            // Get random text sample
            const samples = textSamples[category][difficulty];
            const randomText = samples[Math.floor(Math.random() * samples.length)];
            
            // Initialize test
            currentTest = {
                text: randomText,
                startTime: Date.now(),
                endTime: null,
                duration: duration,
                isActive: true,
                currentIndex: 0,
                errors: 0,
                correctChars: 0,
                timer: null
            };
            
            // Setup UI
            document.getElementById('textDisplay').innerHTML = formatText(randomText);
            document.getElementById('textInput').value = '';
            document.getElementById('textInput').disabled = false;
            document.getElementById('textInput').focus();
            document.getElementById('startBtn').textContent = 'Test in Progress...';
            document.getElementById('startBtn').disabled = true;
            
            // Start timer
            updateTimer();
            currentTest.timer = setInterval(updateTimer, 100);
            
            // Add input listener
            document.getElementById('textInput').addEventListener('input', handleInput);
        }

        function formatText(text) {
            return text.split('').map((char, index) => {
                let className = '';
                if (index < currentTest.currentIndex) {
                    className = 'correct';
                } else if (index === currentTest.currentIndex) {
                    className = 'current';
                }
                return `<span class="${className}">${char === ' ' ? '&nbsp;' : char}</span>`;
            }).join('');
        }

        function handleInput(e) {
            if (!currentTest.isActive) return;
            
            const input = e.target.value;
            const currentChar = currentTest.text[currentTest.currentIndex];
            const inputChar = input[input.length - 1];
            
            if (input.length > currentTest.currentIndex + 1) {
                e.target.value = input.slice(0, currentTest.currentIndex + 1);
                return;
            }
            
            if (inputChar === currentChar) {
                currentTest.correctChars++;
                currentTest.currentIndex++;
                createParticle();
            } else if (inputChar !== undefined) {
                currentTest.errors++;
                currentTest.currentIndex++;
            }
            
            // Update display
            document.getElementById('textDisplay').innerHTML = formatText(currentTest.text);
            updateStats();
            
            // Check if test is complete
            if (currentTest.currentIndex >= currentTest.text.length) {
                endTest();
            }
        }

        function updateTimer() {
            const elapsed = (Date.now() - currentTest.startTime) / 1000;
            const remaining = Math.max(0, currentTest.duration - elapsed);
            
            document.getElementById('timeDisplay').textContent = Math.ceil(remaining);
            
            if (remaining <= 0) {
                endTest();
            }
        }

        function updateStats() {
            const elapsed = (Date.now() - currentTest.startTime) / 1000;
            const minutes = elapsed / 60;
            
            // Calculate WPM (assuming 5 characters per word)
            const wpm = Math.round((currentTest.correctChars / 5) / minutes) || 0;
            
            // Calculate accuracy
            const totalTyped = currentTest.correctChars + currentTest.errors;
            const accuracy = totalTyped > 0 ? Math.round((currentTest.correctChars / totalTyped) * 100) : 100;
            
            // Calculate progress
            const progress = Math.round((currentTest.currentIndex / currentTest.text.length) * 100);
            
            // Update displays
            document.getElementById('wpmDisplay').textContent = wpm;
            document.getElementById('accuracyDisplay').textContent = accuracy + '%';
            document.getElementById('errorsDisplay').textContent = currentTest.errors;
            document.getElementById('progressText').textContent = progress + '%';
            document.getElementById('progressBar').style.width = progress + '%';
        }

        function endTest() {
            currentTest.isActive = false;
            currentTest.endTime = Date.now();
            
            clearInterval(currentTest.timer);
            document.getElementById('textInput').disabled = true;
            document.getElementById('startBtn').textContent = 'Start Test';
            document.getElementById('startBtn').disabled = false;
            
            // Calculate final stats
            const elapsed = (currentTest.endTime - currentTest.startTime) / 1000;
            const minutes = elapsed / 60;
            const wpm = Math.round((currentTest.correctChars / 5) / minutes) || 0;
            const totalTyped = currentTest.correctChars + currentTest.errors;
            const accuracy = totalTyped > 0 ? Math.round((currentTest.correctChars / totalTyped) * 100) : 100;
            
            // Show results modal
            document.getElementById('finalWPM').textContent = wpm;
            document.getElementById('finalAccuracy').textContent = accuracy + '%';
            document.getElementById('finalErrors').textContent = currentTest.errors;
            document.getElementById('finalChars').textContent = currentTest.correctChars;
            document.getElementById('resultsModal').classList.remove('hidden');
            document.getElementById('resultsModal').classList.add('flex');
        }

        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }

        function saveScore() {
            const playerName = document.getElementById('playerName').value.trim() || 'Anonymous';
            const elapsed = (currentTest.endTime - currentTest.startTime) / 1000;
            const minutes = elapsed / 60;
            const wpm = Math.round((currentTest.correctChars / 5) / minutes) || 0;
            const totalTyped = currentTest.correctChars + currentTest.errors;
            const accuracy = totalTyped > 0 ? Math.round((currentTest.correctChars / totalTyped) * 100) : 100;
            
            const score = {
                name: playerName,
                wpm: wpm,
                accuracy: accuracy,
                errors: currentTest.errors,
                duration: currentTest.duration,
                date: new Date().toISOString(),
                characters: currentTest.correctChars
            };
            
            // Save to localStorage
            let scores = JSON.parse(localStorage.getItem('typingScores') || '[]');
            scores.push(score);
            localStorage.setItem('typingScores', JSON.stringify(scores));
            
            // Update user statistics
            StorageManager.updateUserStats({
                wpm: wpm,
                accuracy: accuracy,
                errors: currentTest.errors,
                duration: elapsed,
                characters: currentTest.correctChars
            });
            
            closeResults();
            showSection('leaderboard');
        }

        function closeResults() {
            document.getElementById('resultsModal').classList.add('hidden');
            document.getElementById('resultsModal').classList.remove('flex');
            document.getElementById('playerName').value = '';
        }

        // Leaderboard functionality
        function updateLeaderboard() {
            const scores = JSON.parse(localStorage.getItem('typingScores') || '[]');
            const sortBy = document.getElementById('sortBy').value;
            const filterDuration = document.getElementById('filterDuration').value;
            
            // Filter scores
            let filteredScores = scores;
            if (filterDuration !== 'all') {
                filteredScores = scores.filter(score => score.duration === parseInt(filterDuration));
            }
            
            // Sort scores
            filteredScores.sort((a, b) => {
                switch (sortBy) {
                    case 'wpm':
                        return b.wpm - a.wpm;
                    case 'accuracy':
                        return b.accuracy - a.accuracy;
                    case 'date':
                        return new Date(b.date) - new Date(a.date);
                    default:
                        return b.wpm - a.wpm;
                }
            });
            
            // Update table
            const tbody = document.getElementById('leaderboardBody');
            if (filteredScores.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-8 text-center text-white/70">
                            No scores found for the selected criteria.
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = filteredScores.map((score, index) => {
                const date = new Date(score.date).toLocaleDateString();
                const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                
                return `
                    <tr class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                        <td class="px-6 py-4 text-white font-semibold">${rankEmoji} #${index + 1}</td>
                        <td class="px-6 py-4 text-white">${score.name}</td>
                        <td class="px-6 py-4 text-blue-400 font-bold">${score.wpm}</td>
                        <td class="px-6 py-4 text-green-400 font-bold">${score.accuracy}%</td>
                        <td class="px-6 py-4 text-white/70">${score.duration}s</td>
                        <td class="px-6 py-4 text-white/70">${date}</td>
                    </tr>
                `;
            }).join('');
        }

        function updateStats() {
            const scores = JSON.parse(localStorage.getItem('typingScores') || '[]');
            
            if (scores.length === 0) {
                document.getElementById('avgWPM').textContent = '-';
                document.getElementById('bestWPM').textContent = '-';
                document.getElementById('avgAccuracy').textContent = '-';
                document.getElementById('testsCompleted').textContent = '0';
                return;
            }
            
            const avgWPM = Math.round(scores.reduce((sum, score) => sum + score.wpm, 0) / scores.length);
            const bestWPM = Math.max(...scores.map(score => score.wpm));
            const avgAccuracy = Math.round(scores.reduce((sum, score) => sum + score.accuracy, 0) / scores.length);
            
            document.getElementById('avgWPM').textContent = avgWPM;
            document.getElementById('bestWPM').textContent = bestWPM;
            document.getElementById('avgAccuracy').textContent = avgAccuracy + '%';
            document.getElementById('testsCompleted').textContent = scores.length;
        }

        function clearLeaderboard() {
            if (confirm('Are you sure you want to clear all scores? This action cannot be undone.')) {
                localStorage.removeItem('typingScores');
                updateLeaderboard();
                updateStats();
            }
        }

        // Theme functionality
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            document.getElementById('themeIcon').textContent = newTheme === 'light' ? '☀️' : '🌙';
            
            // Save theme preference
            localStorage.setItem('theme', newTheme);
            
            // Update preferences
            StorageManager.saveTestSettings();
        }

        function initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            document.getElementById('themeIcon').textContent = savedTheme === 'light' ? '☀️' : '🌙';
        }

        // Enhanced Local Storage Management
        const StorageManager = {
            // Save user preferences
            savePreferences: function(preferences) {
                localStorage.setItem('typingPreferences', JSON.stringify(preferences));
            },
            
            // Load user preferences
            loadPreferences: function() {
                const saved = localStorage.getItem('typingPreferences');
                return saved ? JSON.parse(saved) : {
                    duration: '60',
                    difficulty: 'intermediate',
                    category: 'quotes',
                    theme: 'dark'
                };
            },
            
            // Save test settings
            saveTestSettings: function() {
                const preferences = {
                    duration: document.getElementById('duration').value,
                    difficulty: document.getElementById('difficulty').value,
                    category: document.getElementById('category').value,
                    theme: document.documentElement.getAttribute('data-theme') || 'dark'
                };
                this.savePreferences(preferences);
            },
            
            // Load test settings
            loadTestSettings: function() {
                const preferences = this.loadPreferences();
                document.getElementById('duration').value = preferences.duration;
                document.getElementById('difficulty').value = preferences.difficulty;
                document.getElementById('category').value = preferences.category;
                return preferences;
            },
            
            // Save user statistics
            saveUserStats: function(stats) {
                localStorage.setItem('userStats', JSON.stringify(stats));
            },
            
            // Load user statistics
            loadUserStats: function() {
                const saved = localStorage.getItem('userStats');
                return saved ? JSON.parse(saved) : {
                    totalTests: 0,
                    totalTime: 0,
                    bestWPM: 0,
                    averageWPM: 0,
                    bestAccuracy: 0,
                    averageAccuracy: 0,
                    totalCharacters: 0,
                    totalErrors: 0
                };
            },
            
            // Update user statistics
            updateUserStats: function(testResult) {
                const stats = this.loadUserStats();
                stats.totalTests++;
                stats.totalTime += testResult.duration;
                stats.bestWPM = Math.max(stats.bestWPM, testResult.wpm);
                stats.averageWPM = Math.round(((stats.averageWPM * (stats.totalTests - 1)) + testResult.wpm) / stats.totalTests);
                stats.bestAccuracy = Math.max(stats.bestAccuracy, testResult.accuracy);
                stats.averageAccuracy = Math.round(((stats.averageAccuracy * (stats.totalTests - 1)) + testResult.accuracy) / stats.totalTests);
                stats.totalCharacters += testResult.characters;
                stats.totalErrors += testResult.errors;
                this.saveUserStats(stats);
                return stats;
            },
            
            // Export all data
            exportData: function() {
                return {
                    preferences: this.loadPreferences(),
                    scores: JSON.parse(localStorage.getItem('typingScores') || '[]'),
                    stats: this.loadUserStats(),
                    exportDate: new Date().toISOString()
                };
            },
            
            // Import data
            importData: function(data) {
                try {
                    if (data.preferences) this.savePreferences(data.preferences);
                    if (data.scores) localStorage.setItem('typingScores', JSON.stringify(data.scores));
                    if (data.stats) this.saveUserStats(data.stats);
                    return true;
                } catch (error) {
                    console.error('Import failed:', error);
                    return false;
                }
            }
        };

        // Typewriter effect
        function initTypewriter() {
            const phrases = [
                "Master Your ",
                "Improve Your ",
                "Perfect Your ",
                "Enhance Your ",
                "Boost Your "
            ];
            
            let currentPhrase = 0;
            let currentChar = 0;
            let isDeleting = false;
            const typewriterElement = document.getElementById('typewriter-text');
            const cursor = document.getElementById('cursor');
            
            function type() {
                const current = phrases[currentPhrase];
                
                if (isDeleting) {
                    typewriterElement.textContent = current.substring(0, currentChar - 1);
                    currentChar--;
                } else {
                    typewriterElement.textContent = current.substring(0, currentChar + 1);
                    currentChar++;
                }
                
                let typeSpeed = isDeleting ? 50 : 100;
                
                if (!isDeleting && currentChar === current.length) {
                    typeSpeed = 2000; // Pause at end
                    isDeleting = true;
                } else if (isDeleting && currentChar === 0) {
                    isDeleting = false;
                    currentPhrase = (currentPhrase + 1) % phrases.length;
                    typeSpeed = 500; // Pause before next phrase
                }
                
                setTimeout(type, typeSpeed);
            }
            
            // Start typewriter effect
            setTimeout(type, 1000);
        }

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            initializeTheme();
            initTypewriter();
            
            // Load saved preferences
            const preferences = StorageManager.loadTestSettings();
            
            // Set theme from preferences
            if (preferences.theme) {
                document.documentElement.setAttribute('data-theme', preferences.theme);
                document.getElementById('themeIcon').textContent = preferences.theme === 'light' ? '☀️' : '🌙';
            }
            
            showSection('home');
            
            // Save settings when changed
            document.getElementById('duration').addEventListener('change', StorageManager.saveTestSettings);
            document.getElementById('difficulty').addEventListener('change', StorageManager.saveTestSettings);
            document.getElementById('category').addEventListener('change', StorageManager.saveTestSettings);
            
            // Add smooth scrolling
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
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        showSection('home');
                        break;
                    case '2':
                        e.preventDefault();
                        showSection('test');
                        break;
                    case '3':
                        e.preventDefault();
                        showSection('leaderboard');
                        break;
                    case '4':
                        e.preventDefault();
                        showSection('about');
                        break;
                }
            }
        });
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'976014e5b52e001a',t:'MTc1NjM0NTAyNy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();