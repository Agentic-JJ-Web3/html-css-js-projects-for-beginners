 
        let selectedMood = '';
        let selectedAvatarGradient = 'from-purple-500 to-pink-500';
        let isDarkTheme = false;
        let activityChart = null;
        let moodChart = null;
        let selectedPostId = null;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            loadProfile();
            loadPostsSidebar();
            updateAllStats();
            updateAchievements();
            
            // Event listeners
            document.getElementById('postContent').addEventListener('input', function() {
                updateWritingStats();
                updatePreview();
            });
            document.getElementById('searchInput').addEventListener('input', filterPosts);
            document.getElementById('sortFilter').addEventListener('change', filterPosts);
            document.getElementById('moodFilter').addEventListener('change', filterPosts);
            
            // Mobile sidebar event listeners
            document.getElementById('mobileSearchInput').addEventListener('input', filterMobilePosts);
            document.getElementById('mobileSortFilter').addEventListener('change', filterMobilePosts);
            document.getElementById('mobileMoodFilter').addEventListener('change', filterMobilePosts);
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                const dropdown = document.getElementById('profileDropdown');
                const button = document.getElementById('profileButton');
                if (!dropdown.contains(event.target) && !button.contains(event.target)) {
                    dropdown.classList.remove('profile-dropdown-show');
                    dropdown.classList.add('hidden');
                }
            });
            
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
                
                // Update navigation avatar
                const navAvatar = document.getElementById('navProfileAvatar');
                const dropdownAvatar = document.getElementById('dropdownProfileAvatar');
                const initial = profileData.name.charAt(0).toUpperCase();
                const gradient = profileData.avatarGradient || 'from-purple-500 to-pink-500';
                
                navAvatar.textContent = initial;
                navAvatar.className = `w-8 h-8 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center text-white text-sm font-bold`;
                
                dropdownAvatar.textContent = initial;
                dropdownAvatar.className = `w-16 h-16 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg`;
                
                // Update dropdown profile info
                document.getElementById('dropdownProfileName').textContent = profileData.name;
                document.getElementById('dropdownProfileBio').textContent = profileData.bio || 'Living life one day at a time ✨';
                document.getElementById('dropdownJoinDate').textContent = formatDate(profileData.createdAt, true);
                
                // Calculate user level and favorites
                const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
                const level = Math.floor(posts.length / 5) + 1;
                const favorites = posts.filter(post => post.favorite).length;
                const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);
                const currentStreak = calculateCurrentStreak(posts);
                
                document.getElementById('dropdownLevel').textContent = level;
                document.getElementById('dropdownFavorites').textContent = favorites;
                document.getElementById('dropdownTotalPosts').textContent = posts.length;
                document.getElementById('dropdownTotalWords').textContent = totalWords > 999 ? `${(totalWords/1000).toFixed(1)}k` : totalWords;
                document.getElementById('dropdownStreak').textContent = currentStreak;
                
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

        function toggleProfileDropdown() {
            const dropdown = document.getElementById('profileDropdown');
            const isHidden = dropdown.classList.contains('hidden');
            
            if (isHidden) {
                dropdown.classList.remove('hidden');
                // Update dropdown stats before showing
                updateDropdownStats();
                setTimeout(() => {
                    dropdown.classList.add('profile-dropdown-show');
                }, 10);
            } else {
                dropdown.classList.remove('profile-dropdown-show');
                setTimeout(() => {
                    dropdown.classList.add('hidden');
                }, 300);
            }
        }
        
        function updateDropdownStats() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);
            const currentStreak = calculateCurrentStreak(posts);
            
            document.getElementById('dropdownTotalPosts').textContent = posts.length;
            document.getElementById('dropdownTotalWords').textContent = totalWords > 999 ? `${(totalWords/1000).toFixed(1)}k` : totalWords;
            document.getElementById('dropdownStreak').textContent = currentStreak;
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

        // Sidebar Post Management
        function loadPostsSidebar() {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const sidebar = document.getElementById('postsSidebar');
            const mobileSidebar = document.getElementById('mobilePostsSidebar');

            const emptyContent = `
                <div class="text-center py-8 text-gray-500">
                    <div class="text-4xl mb-3">📝</div>
                    <p class="text-sm">No entries yet</p>
                    <p class="text-xs mt-1">Create your first entry below!</p>
                </div>
            `;

            const postContent = posts.map(post => `
                <div class="post-item p-4 rounded-xl cursor-pointer transition-all duration-300" onclick="selectPost(${post.id}); closeMobileSidebar();" data-post-id="${post.id}">
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="font-bold text-gray-800 text-sm leading-tight line-clamp-2">${escapeHtml(post.title)}</h4>
                        ${post.mood ? `<span class="text-lg ml-2 flex-shrink-0">${post.mood}</span>` : ''}
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>${formatDate(post.createdAt, true)}</span>
                        <div class="flex items-center space-x-2">
                            ${post.favorite ? '<span class="text-yellow-500">⭐</span>' : ''}
                            <span>${post.wordCount} words</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-600 mt-2 line-clamp-2">${escapeHtml(post.content.substring(0, 80))}...</p>
                </div>
            `).join('');

            if (posts.length === 0) {
                sidebar.innerHTML = emptyContent;
                mobileSidebar.innerHTML = emptyContent;
                return;
            }

            sidebar.innerHTML = postContent;
            mobileSidebar.innerHTML = postContent;
        }

        function selectPost(postId) {
            const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
            const post = posts.find(p => p.id === postId);
            
            if (!post) return;

            selectedPostId = postId;

            // Update sidebar selection
            document.querySelectorAll('.post-item').forEach(item => {
                item.classList.remove('selected');
            });
            document.querySelector(`[data-post-id="${postId}"]`).classList.add('selected');

            // Hide welcome message and show post content
            document.getElementById('welcomeMessage').classList.add('hidden');
            document.getElementById('selectedPostContent').classList.remove('hidden');

            // Display the selected post
            document.getElementById('selectedPostContent').innerHTML = `
                <div class="fade-in">
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex items-center space-x-4">
                            <h2 class="text-3xl font-bold text-gray-800">${escapeHtml(post.title)}</h2>
                            ${post.mood ? `<span class="text-4xl">${post.mood}</span>` : ''}
                        </div>
                        <div class="flex space-x-3">
                            <button onclick="toggleFavorite(${post.id})" class="text-yellow-500 hover:text-yellow-600 text-3xl transition-all duration-300 hover:scale-125">
                                ${post.favorite ? '⭐' : '☆'}
                            </button>
                            <button onclick="deletePost(${post.id})" class="text-red-500 hover:text-red-700 text-2xl transition-all duration-300 hover:scale-125">
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div class="text-gray-700 mb-8 leading-relaxed text-lg prose prose-lg max-w-none">${formatPostContent(post.content)}</div>
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
        }

        // Rich Text Editor Functions
        function formatText(format) {
            const textarea = document.getElementById('postContent');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            let formattedText = '';
            
            switch (format) {
                case 'bold':
                    formattedText = `**${selectedText || 'bold text'}**`;
                    break;
                case 'italic':
                    formattedText = `*${selectedText || 'italic text'}*`;
                    break;
                case 'underline':
                    formattedText = `__${selectedText || 'underlined text'}__`;
                    break;
                case 'h1':
                    formattedText = `# ${selectedText || 'Large Header'}`;
                    break;
                case 'h2':
                    formattedText = `## ${selectedText || 'Medium Header'}`;
                    break;
                case 'h3':
                    formattedText = `### ${selectedText || 'Small Header'}`;
                    break;
                case 'ul':
                    if (selectedText) {
                        formattedText = selectedText.split('\n').map(line => `• ${line}`).join('\n');
                    } else {
                        formattedText = '• List item 1\n• List item 2\n• List item 3';
                    }
                    break;
                case 'ol':
                    if (selectedText) {
                        formattedText = selectedText.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
                    } else {
                        formattedText = '1. First item\n2. Second item\n3. Third item';
                    }
                    break;
                case 'quote':
                    if (selectedText) {
                        formattedText = selectedText.split('\n').map(line => `> ${line}`).join('\n');
                    } else {
                        formattedText = '> This is a quote';
                    }
                    break;
                case 'highlight':
                    formattedText = `==${selectedText || 'highlighted text'}==`;
                    break;
            }
            
            // Replace selected text with formatted text
            const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
            textarea.value = newValue;
            
            // Update cursor position
            const newCursorPos = start + formattedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
            
            updateWritingStats();
            updatePreview();
        }
        
        function insertEmoji() {
            const emojis = ['😊', '😢', '😍', '🤔', '😴', '😤', '😌', '🥳', '❤️', '🎉', '🌟', '✨', '🔥', '💪', '🙏', '🎯', '📚', '✍️', '💭', '🌈', '🎨', '🎵', '☀️', '🌙', '⭐', '🌸', '🍀', '🦋', '🌺', '🎪'];
            
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const textarea = document.getElementById('postContent');
            const cursorPos = textarea.selectionStart;
            
            const newValue = textarea.value.substring(0, cursorPos) + randomEmoji + textarea.value.substring(cursorPos);
            textarea.value = newValue;
            textarea.setSelectionRange(cursorPos + randomEmoji.length, cursorPos + randomEmoji.length);
            textarea.focus();
            
            updateWritingStats();
            updatePreview();
        }
        
        function togglePreview() {
            const previewArea = document.getElementById('previewArea');
            const isHidden = previewArea.classList.contains('hidden');
            
            if (isHidden) {
                previewArea.classList.remove('hidden');
                updatePreview();
            } else {
                previewArea.classList.add('hidden');
            }
        }
        
        function updatePreview() {
            const content = document.getElementById('postContent').value;
            const previewContent = document.getElementById('previewContent');
            
            if (!content.trim()) {
                previewContent.innerHTML = '<p class="text-gray-500 italic">Start typing to see a preview...</p>';
                return;
            }
            
            // Simple markdown-like parser
            let html = content
                // Headers
                .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-3 mt-6">$1</h3>')
                .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>')
                .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 mt-10">$1</h1>')
                
                // Bold and Italic
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
                
                // Highlights
                .replace(/==(.*?)==/g, '<span class="highlight bg-yellow-200 px-1 rounded">$1</span>')
                
                // Quotes
                .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 bg-purple-50 italic">$1</blockquote>')
                
                // Lists
                .replace(/^• (.*$)/gm, '<li class="ml-4">$1</li>')
                .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4" style="list-style-type: decimal;">$1. $2</li>')
                
                // Line breaks
                .replace(/\n/g, '<br>');
            
            // Wrap lists
            html = html.replace(/((<li.*?>.*?<\/li>)+)/g, '<ul class="my-4">$1</ul>');
            
            previewContent.innerHTML = html;
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
            loadPostsSidebar();
            updateAllStats();
            updateAchievements();
            checkForNewAchievements(posts.length, wordCount);
        }

        function deletePost(postId) {
            if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
                const posts = JSON.parse(localStorage.getItem('diaryPosts') || '[]');
                const filteredPosts = posts.filter(post => post.id !== postId);
                localStorage.setItem('diaryPosts', JSON.stringify(filteredPosts));
                showToast('Entry deleted successfully');
                
                // If the deleted post was selected, show welcome message
                if (selectedPostId === postId) {
                    document.getElementById('selectedPostContent').classList.add('hidden');
                    document.getElementById('welcomeMessage').classList.remove('hidden');
                    selectedPostId = null;
                }
                
                loadPostsSidebar();
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
                
                // Refresh the selected post if it's currently displayed
                if (selectedPostId === postId) {
                    selectPost(postId);
                }
                
                loadPostsSidebar();
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
            
            const isDark = document.getElementById('mainBody').classList.contains('theme-dark');
            const textColor = isDark ? '#e2e8f0' : '#374151';
            const gridColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            
            activityChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: last30Days.map(date => new Date(date).getDate()),
                    datasets: [{
                        label: 'Entries',
                        data: dailyCounts,
                        borderColor: isDark ? 'rgb(167, 139, 250)' : 'rgb(102, 126, 234)',
                        backgroundColor: isDark ? 'rgba(167, 139, 250, 0.1)' : 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: isDark ? 'rgb(192, 132, 252)' : 'rgb(102, 126, 234)',
                        pointBorderColor: isDark ? 'rgb(232, 121, 249)' : 'rgb(79, 70, 229)',
                        pointHoverBackgroundColor: isDark ? 'rgb(232, 121, 249)' : 'rgb(79, 70, 229)',
                        pointHoverBorderColor: isDark ? '#ffffff' : '#000000'
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
                        x: {
                            ticks: {
                                color: textColor
                            },
                            grid: {
                                color: gridColor
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                color: textColor
                            },
                            grid: {
                                color: gridColor
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
            
            const isDark = document.getElementById('mainBody').classList.contains('theme-dark');
            const textColor = isDark ? '#e2e8f0' : '#374151';
            
            moodChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(moodCounts),
                    datasets: [{
                        data: Object.values(moodCounts),
                        backgroundColor: isDark ? [
                            '#fbbf24', '#f87171', '#34d399', '#60a5fa',
                            '#a78bfa', '#fb923c', '#f472b6', '#10b981'
                        ] : [
                            '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
                            '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
                        ],
                        borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : '#ffffff',
                        borderWidth: isDark ? 2 : 3,
                        hoverBorderColor: isDark ? 'rgba(139, 92, 246, 0.8)' : '#000000',
                        hoverBorderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                font: {
                                    size: 14
                                },
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: isDark ? 'rgba(15, 15, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            titleColor: textColor,
                            bodyColor: textColor,
                            borderColor: isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                            borderWidth: 1
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

        // Mobile Sidebar Functions
        function toggleMobileSidebar() {
            const sidebar = document.getElementById('mobileSidebar');
            const overlay = document.getElementById('mobileSidebarOverlay');
            
            sidebar.classList.add('open');
            overlay.classList.add('open');
            
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = 'hidden';
        }
        
        function closeMobileSidebar() {
            const sidebar = document.getElementById('mobileSidebar');
            const overlay = document.getElementById('mobileSidebarOverlay');
            
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
        
        function filterMobilePosts() {
            const searchTerm = document.getElementById('mobileSearchInput').value.toLowerCase();
            const sortBy = document.getElementById('mobileSortFilter').value;
            const moodFilter = document.getElementById('mobileMoodFilter').value;
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
            
            // Re-render filtered posts in mobile sidebar
            const mobileSidebar = document.getElementById('mobilePostsSidebar');
            if (posts.length === 0) {
                mobileSidebar.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-4xl mb-3">🔍</div>
                        <p class="text-sm">No entries found</p>
                        <p class="text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                `;
                return;
            }
            
            mobileSidebar.innerHTML = posts.map(post => {
                let highlightedTitle = post.title;
                let highlightedContent = post.content;
                
                if (searchTerm) {
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    highlightedTitle = highlightedTitle.replace(regex, '<span class="bg-yellow-200 px-1 rounded">$1</span>');
                    highlightedContent = highlightedContent.replace(regex, '<span class="bg-yellow-200 px-1 rounded">$1</span>');
                }
                
                return `
                    <div class="post-item p-4 rounded-xl cursor-pointer transition-all duration-300 ${selectedPostId === post.id ? 'selected' : ''}" onclick="selectPost(${post.id}); closeMobileSidebar();" data-post-id="${post.id}">
                        <div class="flex items-start justify-between mb-2">
                            <h4 class="font-bold text-gray-800 text-sm leading-tight line-clamp-2">${highlightedTitle}</h4>
                            ${post.mood ? `<span class="text-lg ml-2 flex-shrink-0">${post.mood}</span>` : ''}
                        </div>
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span>${formatDate(post.createdAt, true)}</span>
                            <div class="flex items-center space-x-2">
                                ${post.favorite ? '<span class="text-yellow-500">⭐</span>' : ''}
                                <span>${post.wordCount} words</span>
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mt-2 line-clamp-2">${highlightedContent.substring(0, 80)}...</p>
                    </div>
                `;
            }).join('');
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
            
            // Re-render filtered posts in sidebar
            const sidebar = document.getElementById('postsSidebar');
            if (posts.length === 0) {
                sidebar.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-4xl mb-3">🔍</div>
                        <p class="text-sm">No entries found</p>
                        <p class="text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                `;
                return;
            }
            
            sidebar.innerHTML = posts.map(post => {
                let highlightedTitle = post.title;
                let highlightedContent = post.content;
                
                if (searchTerm) {
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    highlightedTitle = highlightedTitle.replace(regex, '<span class="bg-yellow-200 px-1 rounded">$1</span>');
                    highlightedContent = highlightedContent.replace(regex, '<span class="bg-yellow-200 px-1 rounded">$1</span>');
                }
                
                return `
                    <div class="post-item p-4 rounded-xl cursor-pointer transition-all duration-300 ${selectedPostId === post.id ? 'selected' : ''}" onclick="selectPost(${post.id})" data-post-id="${post.id}">
                        <div class="flex items-start justify-between mb-2">
                            <h4 class="font-bold text-gray-800 text-sm leading-tight line-clamp-2">${highlightedTitle}</h4>
                            ${post.mood ? `<span class="text-lg ml-2 flex-shrink-0">${post.mood}</span>` : ''}
                        </div>
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span>${formatDate(post.createdAt, true)}</span>
                            <div class="flex items-center space-x-2">
                                ${post.favorite ? '<span class="text-yellow-500">⭐</span>' : ''}
                                <span>${post.wordCount} words</span>
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mt-2 line-clamp-2">${highlightedContent.substring(0, 80)}...</p>
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
            
            // Show the toast by sliding in from the right
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
            
            // Hide the toast after 5 seconds
            setTimeout(() => {
                toast.classList.remove('translate-x-0', 'opacity-100');
                toast.classList.add('translate-x-full', 'opacity-0');
            }, 5000);
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

        function formatPostContent(content) {
            // Simple markdown-like parser for displaying posts
            let html = escapeHtml(content)
                // Headers
                .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-3 mt-6">$1</h3>')
                .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>')
                .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 mt-10">$1</h1>')
                
                // Bold and Italic
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
                
                // Highlights
                .replace(/==(.*?)==/g, '<span class="bg-yellow-200 px-1 rounded">$1</span>')
                
                // Quotes
                .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 bg-purple-50 italic">$1</blockquote>')
                
                // Lists
                .replace(/^• (.*$)/gm, '<li class="ml-4">$1</li>')
                .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4" style="list-style-type: decimal;">$1. $2</li>')
                
                // Line breaks
                .replace(/\n/g, '<br>');
            
            // Wrap lists
            html = html.replace(/((<li.*?>.*?<\/li>)+)/g, '<ul class="my-4">$1</ul>');
            
            return html;
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
                    day: 'numeric'
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
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97a0ea0ab4477753',t:'MTc1NzAyNDg0Ni4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();