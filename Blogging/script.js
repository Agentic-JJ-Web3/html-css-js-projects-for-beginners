
        let selectedMood = '';
        let selectedAvatarGradient = 'from-purple-500 to-pink-500';
        let isDarkTheme = false;
        let activityChart = null;
        let moodChart = null;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            loadProfile();
            loadPosts();
            updateAllStats();
            updateAchievements();
            
            // Event listeners
            document.getElementById('postContent').addEventListener('input', updateWritingStats);
            document.getElementById('searchInput').addEventListener('input', filterPosts);
            document.getElementById('sortFilter').addEventListener('change', filterPosts);
            document.getElementById('moodFilter').addEventListener('change', filterPosts);
            
            // Mood selector
            document.querySelectorAll('.mood-emoji').forEach(emoji => {
                emoji.addEventListener('click', function() {
                    document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedMood = this.dataset.mood;
                });
            });
            
            // Avatar color selector
            document.querySelectorAll('.avatar-color').forEach(color => {
                color.addEventListener('click', function() {
                    document.querySelectorAll('.avatar-color').forEach(c => c.classList.remove('selected', 'ring-4', 'ring-purple-300'));
                    this.classList.add('selected', 'ring-4', 'ring-purple-300');
                    selectedAvatarGradient = this.dataset.gradient;
                });
            });
            
            // Typing effect for header
            typeWriter();
        });

        // Enhanced Profile Management
        function loadProfile() {
            const profile = localStorage.getItem('diaryProfile');
            if (profile) {
                const profileData = JSON.parse(profile);
                document.getElementById('profileDisplayName').textContent = profileData.name;
                document.getElementById('profileDisplayBio').textContent = profileData.bio || 'Living life one day at a time ✨';
                document.getElementById('profileAvatar').textContent = profileData.name.charAt(0).toUpperCase();
                document.getElementById('profileAvatar').className = `w-24 h-24 bg-gradient-to-r ${profileData.avatarGradient || 'from-purple-500 to-pink-500'} rounded-full flex items-center justify-center text-white text-4xl font-bold mr-8 shadow-xl mb-4 md:mb-0`;
                document.getElementById('joinDate').textContent = formatDate(profileData.createdAt, true);
                
                // Calculate user level and favorites
                const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
                const level = Math.floor(posts.length / 5) + 1;
                const favorites = posts.filter(post => post.favorite).length;
                
                document.getElementById('profileLevel').textContent = level;
                document.getElementById('totalFavorites').textContent = favorites;
                
                document.getElementById('profileSetup').classList.add('hidden');
                document.getElementById('mainApp').classList.remove('hidden');
            } else {
                document.getElementById('profileSetup').classList.remove('hidden');
                document.getElementById('mainApp').classList.add('hidden');
            }
        }

        function saveProfile() {
            const name = document.getElementById('profileName').value.trim();
            if (!name) {
                showToast('Please enter your name', 'error');
                return;
            }

            const bio = document.getElementById('profileBio').value.trim();
            const profile = {
                name: name,
                bio: bio,
                avatarGradient: selectedAvatarGradient,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('diaryProfile', JSON.stringify(profile));
            showToast('Profile created successfully! 🎉');
            setTimeout(() => loadProfile(), 1000);
        }

        function editProfile() {
            const profile = JSON.parse(localStorage.getItem('diaryProfile'));
            document.getElementById('profileName').value = profile.name;
            document.getElementById('profileBio').value = profile.bio || '';
            selectedAvatarGradient = profile.avatarGradient || 'from-purple-500 to-pink-500';
            
            // Update selected avatar color
            document.querySelectorAll('.avatar-color').forEach(color => {
                color.classList.remove('selected', 'ring-4', 'ring-purple-300');
                if (color.dataset.gradient === selectedAvatarGradient) {
                    color.classList.add('selected', 'ring-4', 'ring-purple-300');
                }
            });
            
            document.getElementById('mainApp').classList.add('hidden');
            document.getElementById('profileSetup').classList.remove('hidden');
        }

        // Enhanced Post Management
        function savePost() {
            const title = document.getElementById('postTitle').value.trim();
            const content = document.getElementById('postContent').value.trim();

            if (!title || !content) {
                showToast('Please fill in both title and content', 'error');
                return;
            }

            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
            const newPost = {
                id: Date.now(),
                title: title,
                content: content,
                mood: selectedMood,
                createdAt: new Date().toISOString(),
                wordCount: wordCount,
                readTime: Math.ceil(wordCount / 200),
                favorite: false
            };

            posts.unshift(newPost);
            localStorage.setItem('diaryPosts', JSON.stringify(posts));

            // Clear form
            document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';
            selectedMood = '';
            document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('selected'));
            updateWritingStats();

            showToast('Entry saved successfully! 📝');
            loadPosts();
            updateAllStats();
            updateAchievements();
            checkForNewAchievements(posts.length, wordCount);
        }

        function loadPosts() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const postsList = document.getElementById('postsList');

            if (posts.length === 0) {
                postsList.innerHTML = `
                    <div class="glass-effect rounded-3xl shadow-xl p-16 text-center fade-in">
                        <div class="text-9xl mb-8">📝</div>
                        <h3 class="text-3xl font-bold text-gray-800 mb-6 gradient-text">No entries yet</h3>
                        <p class="text-gray-600 text-xl mb-4">Start writing your first diary entry above!</p>
                        <p class="text-gray-500 text-lg">✨ Tip: Try using one of the writing templates to get started</p>
                    </div>
                `;
                return;
            }

            postsList.innerHTML = posts.map((post, index) => `
                <div class="glass-effect rounded-3xl shadow-xl p-10 hover-lift fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex items-center space-x-4">
                            <h3 class="text-2xl font-bold text-gray-800">${escapeHtml(post.title)}</h3>
                            ${post.mood ? `<span class="text-3xl">${post.mood}</span>` : ''}
                        </div>
                        <div class="flex space-x-3">
                            <button onclick="toggleFavorite(${post.id})" class="text-yellow-500 hover:text-yellow-600 text-2xl transition-all duration-300 hover:scale-125">
                                ${post.favorite ? '⭐' : '☆'}
                            </button>
                            <button onclick="deletePost(${post.id})" class="text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-125">
                                🗑️
                            </button>
                        </div>
                    </div>
                    <p class="text-gray-700 mb-8 leading-relaxed text-lg" id="post-content-${post.id}">${escapeHtml(post.content).replace(/\n/g, '<br>')}</p>
                    <div class="flex justify-between items-center text-sm text-gray-500 border-t pt-6">
                        <div class="flex space-x-6">
                            <span class="flex items-center">📅 ${formatDate(post.createdAt)}</span>
                            <span class="flex items-center">📝 ${post.wordCount} words</span>
                            <span class="flex items-center">⏱️ ${post.readTime} min read</span>
                        </div>
                        <button onclick="sharePost(${post.id})" class="text-purple-600 hover:text-purple-800 font-bold transition-all duration-300 hover:scale-105">
                            📤 Share
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function deletePost(postId) {
            if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
                const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
                const filteredPosts = posts.filter(post => post.id !== postId);
                localStorage.setItem('diaryPosts', JSON.stringify(filteredPosts));
                showToast('Entry deleted successfully');
                loadPosts();
                updateAllStats();
                updateAchievements();
            }
        }

        function toggleFavorite(postId) {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.favorite = !post.favorite;
                localStorage.setItem('diaryPosts', JSON.stringify(posts));
                loadPosts();
                updateAllStats();
                showToast(post.favorite ? 'Added to favorites ⭐' : 'Removed from favorites');
            }
        }

        function sharePost(postId) {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const post = posts.find(p => p.id === postId);
            if (post) {
                const shareText = `${post.title}\n\n${post.content}\n\n- From my digital diary`;
                if (navigator.share) {
                    navigator.share({
                        title: post.title,
                        text: shareText
                    });
                } else {
                    navigator.clipboard.writeText(shareText);
                    showToast('Entry copied to clipboard! 📋');
                }
            }
        }

        // Enhanced Stats and Analytics
        function updateAllStats() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);
            const currentStreak = calculateCurrentStreak(posts);
            const bestStreak = calculateBestStreak(posts);
            const level = Math.floor(posts.length / 5) + 1;
            const progressInLevel = posts.length % 5;
            const progressPercentage = (progressInLevel / 5) * 100;
            
            // Update main stats
            document.getElementById('totalPosts').textContent = posts.length;
            document.getElementById('totalWords').textContent = totalWords.toLocaleString();
            document.getElementById('currentStreak').textContent = currentStreak;
            document.getElementById('bestStreak').textContent = bestStreak;
            
            // Update level info
            document.getElementById('userLevel').textContent = level;
            document.getElementById('levelProgress').style.width = `${progressPercentage}%`;
            document.getElementById('levelProgressText').textContent = `${progressInLevel}/5 entries to next level`;
            
            // Update level title
            const levelTitles = {
                1: 'Beginner Writer',
                2: 'Casual Journaler',
                3: 'Regular Writer',
                4: 'Dedicated Diarist',
                5: 'Prolific Author',
                6: 'Master Storyteller',
                7: 'Writing Virtuoso',
                8: 'Literary Genius'
            };
            document.getElementById('levelTitle').textContent = levelTitles[Math.min(level, 8)] || 'Legendary Writer';
        }

        function calculateCurrentStreak(posts) {
            if (posts.length === 0) return 0;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const dates = posts.map(post => {
                const date = new Date(post.createdAt);
                date.setHours(0, 0, 0, 0);
                return date.getTime();
            });
            
            const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
            
            let streak = 0;
            let currentDate = today.getTime();
            
            for (let dateTime of uniqueDates) {
                const diffDays = Math.floor((currentDate - dateTime) / (1000 * 60 * 60 * 24));
                
                if (diffDays === streak) {
                    streak++;
                    currentDate -= (1000 * 60 * 60 * 24);
                } else if (diffDays > streak) {
                    break;
                }
            }
            
            return streak;
        }

        function calculateBestStreak(posts) {
            if (posts.length === 0) return 0;
            
            const dates = posts.map(post => {
                const date = new Date(post.createdAt);
                date.setHours(0, 0, 0, 0);
                return date.getTime();
            });
            
            const uniqueDates = [...new Set(dates)].sort((a, b) => a - b);
            
            let bestStreak = 0;
            let currentStreak = 1;
            
            for (let i = 1; i < uniqueDates.length; i++) {
                const diffDays = Math.floor((uniqueDates[i] - uniqueDates[i-1]) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    bestStreak = Math.max(bestStreak, currentStreak);
                    currentStreak = 1;
                }
            }
            
            return Math.max(bestStreak, currentStreak);
        }

        // Analytics Functions
        function showAnalytics() {
            document.getElementById('analyticsModal').classList.remove('hidden');
            updateAnalyticsData();
            setTimeout(() => {
                createActivityChart();
                createMoodChart();
                createStreakCalendar();
            }, 100);
        }

        function hideAnalytics() {
            document.getElementById('analyticsModal').classList.add('hidden');
        }

        function updateAnalyticsData() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            
            // Calculate analytics
            const avgWords = posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + post.wordCount, 0) / posts.length) : 0;
            const writingDays = new Set(posts.map(post => new Date(post.createdAt).toDateString())).size;
            const totalReadTime = posts.reduce((sum, post) => sum + post.readTime, 0);
            
            // Find favorite mood
            const moodCounts = {};
            posts.forEach(post => {
                if (post.mood) {
                    moodCounts[post.mood] = (moodCounts[post.mood] || 0) + 1;
                }
            });
            const favoriteEmoji = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, '😊');
            
            // Update analytics display
            document.getElementById('avgWordsPerEntry').textContent = avgWords;
            document.getElementById('writingDays').textContent = writingDays;
            document.getElementById('totalReadTime').textContent = `${totalReadTime} min`;
            document.getElementById('favoriteEmoji').textContent = favoriteEmoji;
        }

        function createActivityChart() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const ctx = document.getElementById('activityChart').getContext('2d');
            
            // Get last 30 days
            const last30Days = [];
            const today = new Date();
            for (let i = 29; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                last30Days.push(date.toDateString());
            }
            
            // Count posts per day
            const dailyCounts = last30Days.map(dateStr => {
                return posts.filter(post => new Date(post.createdAt).toDateString() === dateStr).length;
            });
            
            if (activityChart) {
                activityChart.destroy();
            }
            
            activityChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: last30Days.map(date => new Date(date).getDate()),
                    datasets: [{
                        label: 'Entries',
                        data: dailyCounts,
                        borderColor: 'rgb(102, 126, 234)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        function createMoodChart() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const ctx = document.getElementById('moodChart').getContext('2d');
            
            // Count moods
            const moodCounts = {};
            posts.forEach(post => {
                if (post.mood) {
                    moodCounts[post.mood] = (moodCounts[post.mood] || 0) + 1;
                }
            });
            
            if (moodChart) {
                moodChart.destroy();
            }
            
            moodChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(moodCounts),
                    datasets: [{
                        data: Object.values(moodCounts),
                        backgroundColor: [
                            '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
                            '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        function createStreakCalendar() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const calendar = document.getElementById('streakCalendar');
            
            // Get last 90 days
            const last90Days = [];
            const today = new Date();
            for (let i = 89; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                last90Days.push(date);
            }
            
            // Count posts per day
            const dailyCounts = {};
            posts.forEach(post => {
                const dateStr = new Date(post.createdAt).toDateString();
                dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
            });
            
            calendar.innerHTML = last90Days.map(date => {
                const dateStr = date.toDateString();
                const count = dailyCounts[dateStr] || 0;
                let colorClass = 'bg-gray-200';
                
                if (count >= 5) colorClass = 'bg-green-600';
                else if (count >= 3) colorClass = 'bg-green-400';
                else if (count >= 1) colorClass = 'bg-green-200';
                
                return `<div class="w-3 h-3 ${colorClass} rounded" title="${dateStr}: ${count} entries"></div>`;
            }).join('');
        }

        // Achievement System
        function updateAchievements() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const achievements = [];
            
            // First Entry
            if (posts.length >= 1) {
                achievements.push({ emoji: '🎉', title: 'First Entry', description: 'Welcome to your diary!' });
            }
            
            // Milestone entries
            if (posts.length >= 10) {
                achievements.push({ emoji: '📚', title: 'Storyteller', description: '10 entries written' });
            }
            if (posts.length >= 50) {
                achievements.push({ emoji: '✍️', title: 'Prolific Writer', description: '50 entries written' });
            }
            if (posts.length >= 100) {
                achievements.push({ emoji: '🏆', title: 'Century Club', description: '100 entries written' });
            }
            
            // Word count achievements
            const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);
            if (totalWords >= 1000) {
                achievements.push({ emoji: '📖', title: 'Wordsmith', description: '1,000 words written' });
            }
            if (totalWords >= 10000) {
                achievements.push({ emoji: '📝', title: 'Author', description: '10,000 words written' });
            }
            
            // Streak achievements
            const currentStreak = calculateCurrentStreak(posts);
            if (currentStreak >= 7) {
                achievements.push({ emoji: '🔥', title: 'Week Warrior', description: '7-day writing streak' });
            }
            if (currentStreak >= 30) {
                achievements.push({ emoji: '💪', title: 'Monthly Master', description: '30-day writing streak' });
            }
            
            // Display achievements
            const badgeContainer = document.getElementById('achievementBadges');
            badgeContainer.innerHTML = achievements.map(achievement => 
                `<div class="achievement-badge rounded-full p-2 text-2xl" title="${achievement.title}: ${achievement.description}">
                    ${achievement.emoji}
                </div>`
            ).join('');
        }

        function checkForNewAchievements(entryCount, wordCount) {
            const milestones = [1, 5, 10, 25, 50, 100];
            const wordMilestones = [100, 500, 1000, 5000, 10000];
            
            if (milestones.includes(entryCount)) {
                showToast(`🎉 Achievement unlocked! ${entryCount} entries written!`, 'achievement');
            }
            
            const totalWords = JSON.parse(localStorage.getItem('diaryPosts') || '[]')
                .reduce((sum, post) => sum + post.wordCount, 0);
            
            if (wordMilestones.includes(totalWords)) {
                showToast(`📚 Achievement unlocked! ${totalWords.toLocaleString()} words written!`, 'achievement');
            }
        }

        // Enhanced UI Features
        function updateWritingStats() {
            const content = document.getElementById('postContent').value;
            const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
            const charCount = content.length;
            const readTime = Math.ceil(wordCount / 200);
            
            document.getElementById('wordCount').textContent = `${wordCount} words`;
            document.getElementById('charCount').textContent = `${charCount} characters`;
            document.getElementById('readTime').textContent = `~${readTime} min read`;
        }

        function filterPosts() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const sortBy = document.getElementById('sortFilter').value;
            const moodFilter = document.getElementById('moodFilter').value;
            let posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            
            // Filter by search term
            if (searchTerm) {
                posts = posts.filter(post => 
                    post.title.toLowerCase().includes(searchTerm) || 
                    post.content.toLowerCase().includes(searchTerm)
                );
            }
            
            // Filter by mood
            if (moodFilter) {
                posts = posts.filter(post => post.mood === moodFilter);
            }
            
            // Filter favorites only
            if (sortBy === 'favorites') {
                posts = posts.filter(post => post.favorite);
            }
            
            // Sort posts
            switch (sortBy) {
                case 'oldest':
                    posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    break;
                case 'longest':
                    posts.sort((a, b) => b.wordCount - a.wordCount);
                    break;
                case 'shortest':
                    posts.sort((a, b) => a.wordCount - b.wordCount);
                    break;
                default: // newest or favorites
                    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            
            // Re-render filtered posts
            const postsList = document.getElementById('postsList');
            if (posts.length === 0) {
                postsList.innerHTML = `
                    <div class="glass-effect rounded-3xl shadow-xl p-16 text-center">
                        <div class="text-8xl mb-6">🔍</div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">No entries found</h3>
                        <p class="text-gray-600 text-lg">Try adjusting your search or filters</p>
                    </div>
                `;
                return;
            }
            
            postsList.innerHTML = posts.map((post, index) => {
                let highlightedTitle = post.title;
                let highlightedContent = post.content;
                
                if (searchTerm) {
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    highlightedTitle = highlightedTitle.replace(regex, '<span class="bg-yellow-200 px-1 rounded">$1</span>');
                    highlightedContent = highlightedContent.replace(regex, '<span class="bg-yellow-200 px-1 rounded">$1</span>');
                }
                
                return `
                    <div class="glass-effect rounded-3xl shadow-xl p-10 hover-lift fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="flex justify-between items-start mb-6">
                            <div class="flex items-center space-x-4">
                                <h3 class="text-2xl font-bold text-gray-800">${highlightedTitle}</h3>
                                ${post.mood ? `<span class="text-3xl">${post.mood}</span>` : ''}
                            </div>
                            <div class="flex space-x-3">
                                <button onclick="toggleFavorite(${post.id})" class="text-yellow-500 hover:text-yellow-600 text-2xl transition-all duration-300 hover:scale-125">
                                    ${post.favorite ? '⭐' : '☆'}
                                </button>
                                <button onclick="deletePost(${post.id})" class="text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-125">
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <p class="text-gray-700 mb-8 leading-relaxed text-lg">${highlightedContent.replace(/\n/g, '<br>')}</p>
                        <div class="flex justify-between items-center text-sm text-gray-500 border-t pt-6">
                            <div class="flex space-x-6">
                                <span class="flex items-center">📅 ${formatDate(post.createdAt)}</span>
                                <span class="flex items-center">📝 ${post.wordCount} words</span>
                                <span class="flex items-center">⏱️ ${post.readTime} min read</span>
                            </div>
                            <button onclick="sharePost(${post.id})" class="text-purple-600 hover:text-purple-800 font-bold transition-all duration-300 hover:scale-105">
                                📤 Share
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function insertTemplate(type) {
            const templates = {
                gratitude: "Today I'm grateful for:\n• \n• \n• \n\nThese things made me smile because...",
                goals: "My goals for today/this week:\n□ \n□ \n□ \n\nI will achieve these by...",
                reflection: "Today I learned:\n\nSomething that challenged me:\n\nHow I grew:\n\nTomorrow I want to focus on:"
            };
            
            const textarea = document.getElementById('postContent');
            const template = templates[type];
            if (template) {
                textarea.value = template;
                updateWritingStats();
                textarea.focus();
            }
        }

        function toggleTheme() {
            isDarkTheme = !isDarkTheme;
            const body = document.getElementById('mainBody');
            const themeIcon = document.getElementById('themeIcon');
            
            if (isDarkTheme) {
                body.classList.add('theme-dark');
                themeIcon.textContent = '☀️';
            } else {
                body.classList.remove('theme-dark');
                themeIcon.textContent = '🌙';
            }
        }

        function showToast(message, type = 'success') {
            const toast = document.getElementById('successToast');
            const toastMessage = document.getElementById('toastMessage');
            
            toastMessage.textContent = message;
            
            // Set toast color based on type
            toast.className = toast.className.replace(/bg-gradient-to-r from-\w+-\d+ to-\w+-\d+/, '');
            if (type === 'error') {
                toast.classList.add('bg-gradient-to-r', 'from-red-500', 'to-red-600');
            } else if (type === 'achievement') {
                toast.classList.add('bg-gradient-to-r', 'from-yellow-500', 'to-orange-500');
            } else {
                toast.classList.add('bg-gradient-to-r', 'from-green-500', 'to-emerald-500');
            }
            
            toast.classList.remove('translate-y-full');
            
            setTimeout(() => {
                toast.classList.add('translate-y-full');
            }, 4000);
        }

        function typeWriter() {
            const texts = [
                "Your personal space for thoughts and memories",
                "Where every word matters ✨",
                "Capture life's beautiful moments 🌟",
                "Your digital sanctuary 🏡",
                "Track your journey, one entry at a time 📈"
            ];
            
            let textIndex = 0;
            let charIndex = 0;
            const element = document.getElementById('headerSubtext');
            
            function type() {
                if (charIndex < texts[textIndex].length) {
                    element.textContent = texts[textIndex].substring(0, charIndex + 1);
                    charIndex++;
                    setTimeout(type, 100);
                } else {
                    setTimeout(() => {
                        charIndex = 0;
                        textIndex = (textIndex + 1) % texts.length;
                        element.textContent = '';
                        type();
                    }, 3000);
                }
            }
            
            type();
        }

        // Utility functions
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function formatDate(dateString, short = false) {
            const date = new Date(dateString);
            if (short) {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                });
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9798eec5947bcd92',t:'MTc1Njk0MTE1NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();