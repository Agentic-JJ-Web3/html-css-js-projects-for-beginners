class TodoApp {
            constructor() {
                this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
                this.currentFilter = 'all';
                this.searchQuery = '';
                this.draggedElement = null;
                this.editingTaskId = null;
                this.notificationId = 0;
                this.userName = localStorage.getItem('userName') || '';
                
                this.initializeElements();
                this.bindEvents();
                
                if (!this.userName) {
                    this.showWelcomeModal();
                } else {
                    this.updateHeaderTitle();
                    this.render();
                    this.showNotification(`Welcome back, ${this.userName}! 👋`, 'Your tasks are ready to go.', 'info');
                }
            }

            initializeElements() {
                this.taskInput = document.getElementById('taskInput');
                this.addBtn = document.getElementById('addBtn');
                this.prioritySelect = document.getElementById('prioritySelect');
                this.dueDate = document.getElementById('dueDate');
                this.categoryInput = document.getElementById('categoryInput');
                this.tasksContainer = document.getElementById('tasksContainer');
                this.emptyState = document.getElementById('emptyState');
                this.filterBtns = document.querySelectorAll('.filter-btn');
                this.searchInput = document.getElementById('searchInput');
                this.taskStats = document.getElementById('taskStats');
                this.clearCompleted = document.getElementById('clearCompleted');
                this.progressBar = document.getElementById('progressBar');
                this.notificationContainer = document.getElementById('notificationContainer');
                this.welcomeModal = document.getElementById('welcomeModal');
                this.nameInput = document.getElementById('nameInput');
                this.nameSubmitBtn = document.getElementById('nameSubmitBtn');
                this.headerTitle = document.getElementById('headerTitle');
            }

            bindEvents() {
                // Add task events
                this.addBtn.addEventListener('click', () => this.addTask());
                this.taskInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTask();
                });

                // Filter events
                this.filterBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.filterBtns.forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentFilter = e.target.dataset.filter;
                        this.render();
                    });
                });

                // Search event
                this.searchInput.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.render();
                });

                // Clear completed
                this.clearCompleted.addEventListener('click', () => {
                    const completedTasks = this.tasks.filter(task => task.completed);
                    if (completedTasks.length === 0) {
                        this.showNotification('No completed tasks! 🤷‍♀️', 'Complete some tasks first to clear them.', 'warning');
                        return;
                    }
                    
                    if (confirm(`Are you sure you want to clear ${completedTasks.length} completed task${completedTasks.length > 1 ? 's' : ''}?`)) {
                        this.tasks = this.tasks.filter(task => !task.completed);
                        this.saveToStorage();
                        this.render();
                        this.showNotification('Tasks cleared! 🧹', `Removed ${completedTasks.length} completed task${completedTasks.length > 1 ? 's' : ''}.`, 'success');
                    }
                });

                // Welcome modal events
                this.nameSubmitBtn.addEventListener('click', () => this.submitName());
                this.nameInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.submitName();
                });

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.editingTaskId) {
                        this.cancelEdit();
                    }
                });
            }

            addTask() {
                const text = this.taskInput.value.trim();
                if (!text) {
                    this.showNotification('Empty task! 📝', 'Please enter a task description.', 'warning');
                    this.taskInput.focus();
                    return;
                }

                const task = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    priority: this.prioritySelect.value,
                    dueDate: this.dueDate.value,
                    category: this.categoryInput.value.trim(),
                    createdAt: new Date().toISOString()
                };

                this.tasks.unshift(task);
                this.saveToStorage();
                this.clearInputs();
                this.render();
                
                const priorityEmoji = {
                    'high': '🔥',
                    'medium': '⚡',
                    'low': '🌱'
                };
                
                this.showNotification('Task added! ✅', `${priorityEmoji[task.priority]} "${text}" has been added to your list.`, 'success');
            }

            clearInputs() {
                this.taskInput.value = '';
                this.dueDate.value = '';
                this.categoryInput.value = '';
                this.prioritySelect.value = 'medium';
            }

            toggleTask(id) {
                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    this.saveToStorage();
                    this.render();
                    
                    if (task.completed) {
                        this.showNotification('Task completed! 🎉', `Great job finishing "${task.text}"!`, 'success');
                    } else {
                        this.showNotification('Task reopened! 🔄', `"${task.text}" is back on your list.`, 'info');
                    }
                }
            }

            deleteTask(id) {
                const task = this.tasks.find(t => t.id === id);
                if (!task) return;
                
                if (confirm(`Are you sure you want to delete "${task.text}"?`)) {
                    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
                    if (taskElement) {
                        taskElement.classList.add('removing');
                        setTimeout(() => {
                            this.tasks = this.tasks.filter(t => t.id !== id);
                            this.saveToStorage();
                            this.render();
                            this.showNotification('Task deleted! 🗑️', `"${task.text}" has been removed.`, 'info');
                        }, 300);
                    }
                }
            }

            editTask(id) {
                this.editingTaskId = id;
                this.render();
            }

            saveEdit(id, newText) {
                const task = this.tasks.find(t => t.id === id);
                if (task && newText.trim()) {
                    const oldText = task.text;
                    task.text = newText.trim();
                    this.editingTaskId = null;
                    this.saveToStorage();
                    this.render();
                    this.showNotification('Task updated! ✏️', `Changed "${oldText}" to "${task.text}".`, 'success');
                } else if (!newText.trim()) {
                    this.showNotification('Empty task! 📝', 'Task cannot be empty. Please enter some text.', 'warning');
                }
            }

            cancelEdit() {
                this.editingTaskId = null;
                this.render();
                this.showNotification('Edit cancelled! ↩️', 'No changes were made.', 'info');
            }

            getFilteredTasks() {
                let filtered = this.tasks;

                // Apply filter
                if (this.currentFilter === 'active') {
                    filtered = filtered.filter(task => !task.completed);
                } else if (this.currentFilter === 'completed') {
                    filtered = filtered.filter(task => task.completed);
                } else if (this.currentFilter === 'overdue') {
                    const now = new Date();
                    filtered = filtered.filter(task => 
                        !task.completed && 
                        task.dueDate && 
                        new Date(task.dueDate) < now
                    );
                }

                // Apply search
                if (this.searchQuery) {
                    filtered = filtered.filter(task => 
                        task.text.toLowerCase().includes(this.searchQuery) ||
                        (task.category && task.category.toLowerCase().includes(this.searchQuery))
                    );
                }

                return filtered;
            }

            updateStats() {
                const total = this.tasks.length;
                const completed = this.tasks.filter(t => t.completed).length;
                const active = total - completed;

                this.taskStats.textContent = `${total} tasks (${active} active, ${completed} completed)`;
                
                // Update progress bar
                const progress = total > 0 ? (completed / total) * 100 : 0;
                this.progressBar.style.width = `${progress}%`;
            }

            createTaskElement(task) {
                const isEditing = this.editingTaskId === task.id;
                const dueText = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

                return `
                    <div class="task-item ${task.completed ? 'completed' : ''} adding" 
                         data-task-id="${task.id}" 
                         draggable="true">
                        <input type="checkbox" class="task-checkbox" 
                               ${task.completed ? 'checked' : ''} 
                               onchange="todoApp.toggleTask(${task.id})">
                        
                        ${isEditing ? `
                            <input type="text" class="edit-input" value="${task.text}" 
                                   id="editInput${task.id}" autofocus>
                            <div class="edit-actions">
                                <button class="action-btn save-btn" 
                                        onclick="todoApp.saveEdit(${task.id}, document.getElementById('editInput${task.id}').value)">
                                    ✓
                                </button>
                                <button class="action-btn cancel-btn" 
                                        onclick="todoApp.cancelEdit()">
                                    ✕
                                </button>
                            </div>
                        ` : `
                            <div class="task-content">
                                <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                                <div class="task-meta">
                                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                                    ${task.category ? `<span>📁 ${task.category}</span>` : ''}
                                    ${dueText ? `<span ${isOverdue ? 'style="color: #f44336; font-weight: bold;"' : ''}>📅 ${dueText}</span>` : ''}
                                </div>
                            </div>
                            <div class="task-actions">
                                <button class="action-btn edit-btn" onclick="todoApp.editTask(${task.id})">✏️</button>
                                <button class="action-btn delete-btn" onclick="todoApp.deleteTask(${task.id})">🗑️</button>
                            </div>
                        `}
                    </div>
                `;
            }

            setupDragAndDrop() {
                const taskItems = document.querySelectorAll('.task-item');
                
                taskItems.forEach(item => {
                    item.addEventListener('dragstart', (e) => {
                        this.draggedElement = item;
                        item.classList.add('dragging');
                        e.dataTransfer.effectAllowed = 'move';
                    });

                    item.addEventListener('dragend', () => {
                        item.classList.remove('dragging');
                        this.draggedElement = null;
                    });

                    item.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    });

                    item.addEventListener('drop', (e) => {
                        e.preventDefault();
                        if (this.draggedElement && this.draggedElement !== item) {
                            const draggedId = parseInt(this.draggedElement.dataset.taskId);
                            const targetId = parseInt(item.dataset.taskId);
                            
                            const draggedIndex = this.tasks.findIndex(t => t.id === draggedId);
                            const targetIndex = this.tasks.findIndex(t => t.id === targetId);
                            
                            // Reorder tasks
                            const [draggedTask] = this.tasks.splice(draggedIndex, 1);
                            this.tasks.splice(targetIndex, 0, draggedTask);
                            
                            this.saveToStorage();
                            this.render();
                        }
                    });
                });
            }

            render() {
                const filteredTasks = this.getFilteredTasks();
                
                if (filteredTasks.length === 0) {
                    this.tasksContainer.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">${this.tasks.length === 0 ? '📝' : '🔍'}</div>
                            <h3>${this.tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</h3>
                            <p>${this.tasks.length === 0 ? 'Add your first task above to get started!' : 'Try adjusting your search or filter.'}</p>
                        </div>
                    `;
                } else {
                    this.tasksContainer.innerHTML = filteredTasks.map(task => this.createTaskElement(task)).join('');
                    setTimeout(() => this.setupDragAndDrop(), 100);
                }

                this.updateStats();
            }

            saveToStorage() {
                localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
            }

            showNotification(title, message, type = 'info', duration = 4000) {
                const id = ++this.notificationId;
                
                const icons = {
                    success: '✅',
                    error: '❌',
                    warning: '⚠️',
                    info: 'ℹ️'
                };

                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <div class="notification-icon">${icons[type] || icons.info}</div>
                        <div class="notification-text">
                            <strong>${title}</strong><br>
                            ${message}
                        </div>
                        <button class="notification-close" onclick="todoApp.closeNotification(${id})">&times;</button>
                    </div>
                    <div class="notification-progress" style="width: 100%; transition-duration: ${duration}ms;"></div>
                `;
                
                notification.dataset.notificationId = id;
                this.notificationContainer.appendChild(notification);

                // Trigger show animation
                setTimeout(() => {
                    notification.classList.add('show');
                }, 10);

                // Start progress bar animation
                setTimeout(() => {
                    const progressBar = notification.querySelector('.notification-progress');
                    if (progressBar) {
                        progressBar.style.width = '0%';
                    }
                }, 100);

                // Auto-close notification
                setTimeout(() => {
                    this.closeNotification(id);
                }, duration);

                // Click to close
                notification.addEventListener('click', () => {
                    this.closeNotification(id);
                });

                return id;
            }

            closeNotification(id) {
                const notification = document.querySelector(`[data-notification-id="${id}"]`);
                if (notification) {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 400);
                }
            }

            showWelcomeModal() {
                this.welcomeModal.classList.add('show');
                setTimeout(() => {
                    this.nameInput.focus();
                }, 300);
            }

            submitName() {
                const name = this.nameInput.value.trim();
                if (!name) {
                    this.showNotification('Name required! 📝', 'Please enter your name to continue.', 'warning');
                    this.nameInput.focus();
                    return;
                }

                this.userName = name;
                localStorage.setItem('userName', name);
                this.welcomeModal.classList.remove('show');
                this.updateHeaderTitle();
                this.render();
                
                setTimeout(() => {
                    this.showNotification(`Welcome, ${name}! 🎉`, 'Your personalized task manager is ready!', 'success');
                }, 500);
            }

            updateHeaderTitle() {
                if (this.userName) {
                    const hour = new Date().getHours();
                    let greeting = 'Good evening';
                    if (hour < 12) greeting = 'Good morning';
                    else if (hour < 18) greeting = 'Good afternoon';
                    
                    this.headerTitle.textContent = `${greeting}, ${this.userName}! ✨`;
                }
            }

            // Check for overdue tasks and show notifications
            checkOverdueTasks() {
                const now = new Date();
                const overdueTasks = this.tasks.filter(task => 
                    !task.completed && 
                    task.dueDate && 
                    new Date(task.dueDate) < now
                );

                if (overdueTasks.length > 0) {
                    this.showNotification(
                        'Overdue tasks! ⏰', 
                        `${this.userName ? this.userName + ', you' : 'You'} have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}.`, 
                        'warning',
                        6000
                    );
                }
            }
        }

        // Initialize the app
        const todoApp = new TodoApp();
        
        // Check for overdue tasks every 30 seconds
        setInterval(() => {
            todoApp.checkOverdueTasks();
        }, 30000);
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'975f624b97b0946f',t:'MTc1NjMzNzcxMi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();