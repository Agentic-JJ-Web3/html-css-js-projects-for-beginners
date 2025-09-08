
    <script>
        // User profile data
        let userProfile = {
            name: '',
            avatar: '',
            joinDate: new Date().toISOString().split('T')[0],
            preferences: {
                theme: 'light'
            }
        };

        // Available courses catalog
        const availableCourses = [
            {
                id: 1,
                title: "Generative AI Fundamentals",
                description: "Master the basics of GenAI, from GPT to image generation",
                lessons: 12,
                duration: "6 weeks",
                difficulty: "Beginner",
                icon: "🎨",
                category: "GenAI",
                topics: ["Large Language Models", "Prompt Engineering", "Image Generation", "AI Ethics"]
            },
            {
                id: 2,
                title: "Introduction to Machine Learning",
                description: "Learn the fundamentals of ML algorithms and applications",
                lessons: 15,
                duration: "8 weeks",
                difficulty: "Beginner",
                icon: "🤖",
                category: "Machine Learning",
                topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Feature Engineering"]
            },
            {
                id: 3,
                title: "Deep Learning Fundamentals",
                description: "Dive deep into neural networks and deep learning",
                lessons: 20,
                duration: "10 weeks",
                difficulty: "Intermediate",
                icon: "🧠",
                category: "Deep Learning",
                topics: ["Neural Networks", "Backpropagation", "CNNs", "RNNs"]
            },
            {
                id: 4,
                title: "Natural Language Processing",
                description: "Process and understand human language with AI",
                lessons: 18,
                duration: "9 weeks",
                difficulty: "Advanced",
                icon: "💬",
                category: "NLP",
                topics: ["Text Processing", "Sentiment Analysis", "Named Entity Recognition", "Transformers"]
            },
            {
                id: 5,
                title: "Computer Vision Basics",
                description: "Teach machines to see and understand images",
                lessons: 12,
                duration: "7 weeks",
                difficulty: "Intermediate",
                icon: "👁️",
                category: "Computer Vision",
                topics: ["Image Processing", "Object Detection", "Face Recognition", "Image Classification"]
            },
            {
                id: 6,
                title: "AI Ethics & Bias",
                description: "Build responsible and fair AI systems",
                lessons: 8,
                duration: "4 weeks",
                difficulty: "Essential",
                icon: "⚖️",
                category: "Ethics",
                topics: ["Algorithmic Bias", "Fairness Metrics", "Privacy", "Transparency"]
            }
        ];

        // User's enrolled courses (stored in localStorage)
        let enrolledCourses = [];

        // Notification system
        let notifications = [];
        let notificationCount = 0;



        // Notification system functions
        function addNotification(type, message, courseTitle = '') {
            const notification = {
                id: Date.now(),
                type: type,
                message: message,
                courseTitle: courseTitle,
                timestamp: new Date(),
                read: false
            };
            
            notifications.unshift(notification);
            notificationCount++;
            updateNotificationBadge();
            renderNotifications();
            
            // Auto-save notifications
            localStorage.setItem('aiAcademyNotifications', JSON.stringify(notifications));
        }

        function updateNotificationBadge() {
            const badge = document.getElementById('notificationBadge');
            const unreadCount = notifications.filter(n => !n.read).length;
            
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        function toggleNotifications() {
            const panel = document.getElementById('notificationPanel');
            panel.classList.toggle('active');
            
            // Mark all as read when opened
            if (panel.classList.contains('active')) {
                markAllAsRead();
            }
        }

        function markAllAsRead() {
            notifications.forEach(n => n.read = true);
            updateNotificationBadge();
            renderNotifications();
            localStorage.setItem('aiAcademyNotifications', JSON.stringify(notifications));
        }

        function clearAllNotifications() {
            notifications = [];
            notificationCount = 0;
            updateNotificationBadge();
            renderNotifications();
            localStorage.removeItem('aiAcademyNotifications');
        }

        function renderNotifications() {
            const notificationList = document.getElementById('notificationList');
            
            if (notifications.length === 0) {
                notificationList.innerHTML = '<div class="no-notifications">No notifications yet</div>';
                return;
            }
            
            notificationList.innerHTML = '';
            
            notifications.forEach(notification => {
                const notificationItem = document.createElement('div');
                notificationItem.className = `notification-item ${!notification.read ? 'unread' : ''}`;
                
                const icon = getNotificationIcon(notification.type);
                const timeAgo = getTimeAgo(notification.timestamp);
                
                notificationItem.innerHTML = `
                    <div class="notification-content">
                        <div class="notification-icon">${icon}</div>
                        <div class="notification-text">
                            <div class="notification-message">${notification.message}</div>
                            <div class="notification-time">${timeAgo}</div>
                        </div>
                    </div>
                `;
                
                notificationList.appendChild(notificationItem);
            });
        }

        function getNotificationIcon(type) {
            const icons = {
                'enrollment': '📚',
                'completion': '✅',
                'achievement': '🏆',
                'goal': '🎯',
                'course_complete': '🎉',
                'welcome': '👋'
            };
            return icons[type] || '📢';
        }

        function getTimeAgo(timestamp) {
            const now = new Date();
            const diff = now - new Date(timestamp);
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            
            if (minutes < 1) return 'Just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            return `${days}d ago`;
        }

        function loadNotifications() {
            const saved = localStorage.getItem('aiAcademyNotifications');
            if (saved) {
                notifications = JSON.parse(saved);
                updateNotificationBadge();
                renderNotifications();
            }
        }

        // Course enrollment functions
        function enrollInCourse(courseId) {
            const course = availableCourses.find(c => c.id === courseId);
            if (!course) return;

            const enrolledCourse = {
                ...course,
                enrolledDate: new Date().toISOString(),
                completedLessons: 0,
                progress: 0,
                currentLesson: 1,
                lastAccessed: new Date().toISOString()
            };

            enrolledCourses.push(enrolledCourse);
            saveEnrolledCourses();
            renderCourses();
            updateStats();
            
            // Add notification
            addNotification('enrollment', `Successfully enrolled in "${course.title}"! Ready to start learning?`, course.title);
            
            alert(`🎉 Successfully enrolled in "${course.title}"!\n\nYou can now start your learning journey. Good luck!`);
        }

        function saveEnrolledCourses() {
            localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        }

        function loadEnrolledCourses() {
            const saved = localStorage.getItem('enrolledCourses');
            if (saved) {
                enrolledCourses = JSON.parse(saved);
            }
        }

        function completeLesson(courseId) {
            const courseIndex = enrolledCourses.findIndex(c => c.id === courseId);
            if (courseIndex === -1) return;

            const course = enrolledCourses[courseIndex];
            if (course.completedLessons < course.lessons) {
                course.completedLessons++;
                course.currentLesson = course.completedLessons + 1;
                course.progress = Math.round((course.completedLessons / course.lessons) * 100);
                course.lastAccessed = new Date().toISOString();
                
                saveEnrolledCourses();
                renderCourses();
                updateStats();
                
                if (course.progress === 100) {
                    // Course completed notification
                    addNotification('course_complete', `🎊 Course completed! You've mastered "${course.title}" with all ${course.lessons} lessons!`, course.title);
                    alert(`🎊 Congratulations! You've completed "${course.title}"!\n\nYou've mastered all ${course.lessons} lessons. Well done!`);
                } else {
                    // Lesson completed notification
                    addNotification('completion', `Lesson ${course.completedLessons} completed in "${course.title}"! Progress: ${course.progress}%`, course.title);
                    alert(`✅ Lesson ${course.completedLessons} completed!\n\nProgress: ${course.progress}%\nNext: Lesson ${course.currentLesson}`);
                }
            }
        }

        // Render enrolled courses on dashboard
        function renderCourses() {
            const courseGrid = document.getElementById('enrolledCoursesGrid');
            courseGrid.innerHTML = '';

            if (enrolledCourses.length === 0) {
                courseGrid.innerHTML = `
                    <div class="no-courses">
                        <h3>No courses enrolled yet! 📚</h3>
                        <p>Visit the Courses section to browse and enroll in available courses.</p>
                    </div>
                `;
                return;
            }

            // Show enrolled courses
            enrolledCourses.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card enrolled';
                courseCard.innerHTML = `
                    <div class="course-header">
                        <div class="course-icon">${course.icon}</div>
                        <div>
                            <h3 class="course-title">${course.title}</h3>
                            <p class="course-lessons">${course.lessons} lessons • ${course.difficulty}</p>
                        </div>
                        <div class="enrolled-badge">Enrolled ✓</div>
                    </div>
                    <div class="course-description">${course.description}</div>
                    <div class="progress-section">
                        <div class="progress-label">
                            <span>Progress</span>
                            <span>${course.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                        <div class="lesson-info">
                            Lesson ${course.currentLesson} of ${course.lessons}
                        </div>
                    </div>
                    <div class="course-actions">
                        <button class="continue-btn" onclick="continueCourse(${course.id})">
                            ${course.progress === 0 ? 'Start Learning' : course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                        </button>
                        ${course.progress < 100 ? `<button class="lesson-btn" onclick="completeLesson(${course.id})">Complete Current Lesson</button>` : ''}
                    </div>
                `;
                courseGrid.appendChild(courseCard);
            });
        }

        // Render all courses in courses section
        function renderAllCourses() {
            const courseGrid = document.getElementById('allCoursesGrid');
            courseGrid.innerHTML = '';
            
            const enrolledIds = enrolledCourses.map(c => c.id);
            
            availableCourses.forEach(course => {
                const isEnrolled = enrolledIds.includes(course.id);
                const enrolledCourse = enrolledCourses.find(c => c.id === course.id);
                
                const courseCard = document.createElement('div');
                courseCard.className = `course-card ${isEnrolled ? 'enrolled' : 'available'}`;
                courseCard.setAttribute('data-difficulty', course.difficulty);
                
                courseCard.innerHTML = `
                    <div class="course-header">
                        <div class="course-icon">${course.icon}</div>
                        <div>
                            <h3 class="course-title">${course.title}</h3>
                            <p class="course-lessons">${course.lessons} lessons • ${course.difficulty}</p>
                        </div>
                        ${isEnrolled ? '<div class="enrolled-badge">Enrolled ✓</div>' : ''}
                    </div>
                    <div class="course-description">${course.description}</div>
                    ${isEnrolled ? `
                        <div class="progress-section">
                            <div class="progress-label">
                                <span>Progress</span>
                                <span>${enrolledCourse.progress}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${enrolledCourse.progress}%"></div>
                            </div>
                            <div class="lesson-info">
                                Lesson ${enrolledCourse.currentLesson} of ${enrolledCourse.lessons}
                            </div>
                        </div>
                        <div class="course-actions">
                            <button class="continue-btn" onclick="continueCourse(${course.id})">
                                ${enrolledCourse.progress === 0 ? 'Start Learning' : enrolledCourse.progress === 100 ? 'Review Course' : 'Continue Learning'}
                            </button>
                            ${enrolledCourse.progress < 100 ? `<button class="lesson-btn" onclick="completeLesson(${course.id})">Complete Current Lesson</button>` : ''}
                        </div>
                    ` : `
                        <div class="course-details">
                            <div class="detail-item">
                                <span class="detail-label">Duration:</span>
                                <span class="detail-value">${course.duration}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Topics:</span>
                                <span class="detail-value">${course.topics.slice(0, 2).join(', ')}${course.topics.length > 2 ? '...' : ''}</span>
                            </div>
                        </div>
                        <button class="enroll-btn" onclick="enrollInCourse(${course.id})">
                            Enroll Now 🚀
                        </button>
                    `}
                `;
                courseGrid.appendChild(courseCard);
            });
        }

        // Course filtering
        function filterCourses(difficulty) {
            const courseCards = document.querySelectorAll('#allCoursesGrid .course-card');
            
            courseCards.forEach(card => {
                if (difficulty === 'all' || card.getAttribute('data-difficulty') === difficulty) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-filter="${difficulty}"]`).classList.add('active');
        }

        // Progress section
        function renderProgressSection() {
            updateProgressStats();
            renderProgressDetails();
        }

        function updateProgressStats() {
            const totalCourses = enrolledCourses.length;
            const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
            const completedLessons = enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0);
            const averageProgress = totalCourses > 0 ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses) : 0;
            
            document.getElementById('progressTotalCourses').textContent = totalCourses;
            document.getElementById('progressCompletedCourses').textContent = completedCourses;
            document.getElementById('progressCompletedLessons').textContent = completedLessons;
            document.getElementById('progressAverage').textContent = averageProgress + '%';
        }

        function renderProgressDetails() {
            const progressGrid = document.getElementById('progressDetailsGrid');
            progressGrid.innerHTML = '';
            
            if (enrolledCourses.length === 0) {
                progressGrid.innerHTML = '<div class="no-courses">No enrolled courses to track yet!</div>';
                return;
            }
            
            enrolledCourses.forEach(course => {
                const progressCard = document.createElement('div');
                progressCard.className = 'course-card';
                progressCard.innerHTML = `
                    <div class="course-header">
                        <div class="course-icon">${course.icon}</div>
                        <div>
                            <h3 class="course-title">${course.title}</h3>
                            <p class="course-lessons">${course.completedLessons}/${course.lessons} lessons completed</p>
                        </div>
                    </div>
                    <div class="progress-section">
                        <div class="progress-label">
                            <span>Progress</span>
                            <span>${course.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                        <div class="lesson-info">
                            ${course.progress === 100 ? 'Course Completed! 🎉' : `Next: Lesson ${course.currentLesson}`}
                        </div>
                    </div>
                `;
                progressGrid.appendChild(progressCard);
            });
        }

        // Goals section
        let weeklyGoal = 5;
        let weeklyProgress = 0;

        function renderGoalsSection() {
            updateWeeklyProgress();
            renderAchievements();
        }

        function setWeeklyGoal() {
            const goalInput = document.getElementById('weeklyGoal');
            weeklyGoal = parseInt(goalInput.value) || 5;
            localStorage.setItem('weeklyGoal', weeklyGoal);
            updateWeeklyProgress();
            
            // Add notification
            addNotification('goal', `Weekly learning goal set to ${weeklyGoal} lessons! Stay motivated! 🎯`);
            
            alert(`Weekly goal set to ${weeklyGoal} lessons! 🎯`);
        }

        function updateWeeklyProgress() {
            // Calculate lessons completed this week (simplified)
            weeklyProgress = Math.min(enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0) % 7, weeklyGoal);
            
            const progressPercentage = (weeklyProgress / weeklyGoal) * 100;
            document.getElementById('weeklyProgressFill').style.width = progressPercentage + '%';
            document.getElementById('weeklyProgressText').textContent = `${weeklyProgress} / ${weeklyGoal} lessons completed`;
        }

        function renderAchievements() {
            const achievements = [
                { id: 1, title: "First Steps", description: "Complete your first lesson", icon: "🎯", earned: enrolledCourses.some(c => c.completedLessons > 0) },
                { id: 2, title: "Course Starter", description: "Enroll in your first course", icon: "📚", earned: enrolledCourses.length > 0 },
                { id: 3, title: "Dedicated Learner", description: "Complete 10 lessons", icon: "🔥", earned: enrolledCourses.reduce((sum, c) => sum + c.completedLessons, 0) >= 10 },
                { id: 4, title: "Course Master", description: "Complete your first course", icon: "🏆", earned: enrolledCourses.some(c => c.progress === 100) },
                { id: 5, title: "AI Explorer", description: "Enroll in 3 different courses", icon: "🚀", earned: enrolledCourses.length >= 3 },
                { id: 6, title: "Knowledge Seeker", description: "Complete 25 lessons", icon: "🧠", earned: enrolledCourses.reduce((sum, c) => sum + c.completedLessons, 0) >= 25 }
            ];
            
            const achievementGrid = document.getElementById('achievementGrid');
            achievementGrid.innerHTML = '';
            
            achievements.forEach(achievement => {
                const badge = document.createElement('div');
                badge.className = `achievement-badge ${achievement.earned ? 'earned' : 'locked'}`;
                badge.innerHTML = `
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                `;
                achievementGrid.appendChild(badge);
            });
        }

        // Settings section
        function loadSettings() {
            const displayName = document.getElementById('displayName');
            displayName.value = userProfile.name || '';
            
            // Load saved settings
            const savedGoal = localStorage.getItem('weeklyGoal');
            if (savedGoal) {
                weeklyGoal = parseInt(savedGoal);
                document.getElementById('weeklyGoal').value = weeklyGoal;
            }
        }

        function updateDisplayName() {
            const newName = document.getElementById('displayName').value.trim();
            if (newName) {
                userProfile.name = newName;
                userProfile.avatar = generateAvatar(newName);
                localStorage.setItem('aiAcademyProfile', JSON.stringify(userProfile));
                updateUserInterface();
                alert('Display name updated successfully! ✅');
            }
        }

        function resetProgress() {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                enrolledCourses = [];
                localStorage.removeItem('enrolledCourses');
                updateStats();
                renderCourses();
                alert('All progress has been reset. 🔄');
            }
        }

        // Render recent activity
        function renderRecentActivity() {
            const activityContainer = document.getElementById('recentActivity');
            activityContainer.innerHTML = '';

            if (notifications.length === 0) {
                activityContainer.innerHTML = '<div class="no-courses">No recent activity yet. Start learning to see your progress!</div>';
                return;
            }

            // Show last 3 notifications as recent activity
            const recentNotifications = notifications.slice(0, 3);
            
            recentNotifications.forEach(notification => {
                const activityItem = document.createElement('div');
                activityItem.className = 'lesson-item';
                
                const icon = getNotificationIcon(notification.type);
                const timeAgo = getTimeAgo(notification.timestamp);
                
                activityItem.innerHTML = `
                    <div class="lesson-info">
                        <h4>${icon} ${notification.message}</h4>
                        <p class="lesson-course">${notification.courseTitle || 'System'}</p>
                    </div>
                    <div class="lesson-date">
                        ${timeAgo}
                    </div>
                `;
                activityContainer.appendChild(activityItem);
            });
        }

        // Helper functions
        function formatDate(date) {
            const options = { month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        function continueCourse(courseId) {
            const course = enrolledCourses.find(c => c.id === courseId);
            if (!course) return;
            
            alert(`Continuing "${course.title}"! 🚀\n\nLesson ${course.currentLesson}: Ready to learn!\n\nThis would normally open the lesson content.`);
        }

        function toggleTheme() {
            document.body.classList.toggle('dark');
            const themeToggle = document.querySelector('.theme-toggle');
            themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
        }

        // Navigation functionality
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionName + '-section').classList.add('active');
            
            // Update navigation
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
            
            // Load section-specific content
            if (sectionName === 'courses') {
                renderAllCourses();
            } else if (sectionName === 'progress') {
                renderProgressSection();
            } else if (sectionName === 'goals') {
                renderGoalsSection();
            } else if (sectionName === 'settings') {
                loadSettings();
            }
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = link.getAttribute('data-section');
                if (sectionName) {
                    showSection(sectionName);
                }
            });
        });

        // Search functionality
        document.querySelector('.search-input').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const courseCards = document.querySelectorAll('.course-card');
            
            courseCards.forEach(card => {
                const title = card.querySelector('.course-title').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Profile setup functions
        function generateAvatar(name) {
            if (!name) return 'U';
            const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
            return initials.substring(0, 2);
        }

        function startLearning() {
            const nameInput = document.getElementById('nameInput');
            const name = nameInput.value.trim();
            
            if (!name) {
                nameInput.style.borderColor = '#ff6b6b';
                nameInput.placeholder = 'Please enter your name';
                return;
            }

            // Update user profile
            userProfile.name = name;
            userProfile.avatar = generateAvatar(name);
            
            // Save to localStorage
            localStorage.setItem('aiAcademyProfile', JSON.stringify(userProfile));
            
            // Update UI
            updateUserInterface();
            
            // Hide modal with animation
            const modal = document.getElementById('welcomeModal');
            modal.classList.remove('active');
            
            // Add welcome notification for new users
            addNotification('welcome', `Welcome to AI Academy, ${userProfile.name}! Start your learning journey today! 🚀`);
            
            // Initialize dashboard after modal closes
            setTimeout(() => {
                initializeDashboard();
            }, 300);
        }

        function updateUserInterface() {
            // Update user name in topbar
            document.querySelector('.user-name').textContent = userProfile.name;
            
            // Update user avatar
            document.querySelector('.user-avatar').textContent = userProfile.avatar;
            
            // Update welcome message
            const welcomeTitle = document.querySelector('.welcome-title');
            welcomeTitle.innerHTML = `Welcome back, ${userProfile.name}! 👋`;
        }

        function loadExistingProfile() {
            const savedProfile = localStorage.getItem('aiAcademyProfile');
            if (savedProfile) {
                userProfile = JSON.parse(savedProfile);
                updateUserInterface();
                document.getElementById('welcomeModal').classList.remove('active');
                return true;
            }
            return false;
        }

        function initializeDashboard() {
            renderCourses();
            renderRecentActivity();
            
            // Animate progress bars
            setTimeout(() => {
                document.querySelectorAll('.progress-fill').forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }, 500);
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', () => {
            // Load enrolled courses first
            loadEnrolledCourses();
            
            // Load notifications
            loadNotifications();
            
            // Check if user already has a profile
            if (!loadExistingProfile()) {
                // Show welcome modal for new users
                setTimeout(() => {
                    document.getElementById('welcomeModal').classList.add('active');
                }, 100);
            } else {
                // Initialize dashboard for returning users
                initializeDashboard();
            }
            
            // Enable Enter key for name input
            document.getElementById('nameInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    startLearning();
                }
            });
            
            // Real-time validation for name input
            document.getElementById('nameInput').addEventListener('input', (e) => {
                const startBtn = document.getElementById('startBtn');
                if (e.target.value.trim()) {
                    startBtn.disabled = false;
                    e.target.style.borderColor = '#ff6b35';
                } else {
                    startBtn.disabled = true;
                    e.target.style.borderColor = '#e0e0e0';
                }
            });

            // Add filter button event listeners
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-filter');
                    filterCourses(filter);
                });
            });

            // Close notification panel when clicking outside
            document.addEventListener('click', (e) => {
                const panel = document.getElementById('notificationPanel');
                const notificationBtn = document.querySelector('.notifications');
                
                if (!panel.contains(e.target) && !notificationBtn.contains(e.target)) {
                    panel.classList.remove('active');
                }
            });
        });

        // Update stats dynamically
        function updateStats() {
            const totalCourses = enrolledCourses.length;
            const completedLessons = enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0);
            const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
            const totalHours = Math.floor(completedLessons * 1.5); // Estimate 1.5 hours per lesson
            
            document.getElementById('totalCourses').textContent = totalCourses;
            document.getElementById('completedLessons').textContent = completedLessons;
            document.getElementById('learningStreak').textContent = Math.min(completedLessons, 30); // Cap at 30 days
            document.getElementById('totalHours').textContent = totalHours;
        }
    </script>
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97b2f56705e247cf',t:'MTc1NzIxNDA1NS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();