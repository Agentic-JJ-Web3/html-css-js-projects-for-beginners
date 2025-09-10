
        class FileUploadDashboard {
            constructor() {
                this.files = [];
                this.currentSort = 'name';
                this.isDarkTheme = true;
                this.sidebarCollapsed = false;
                this.currentPage = 'uploads';
                this.profile = this.loadProfile();
                this.settings = this.loadSettings();
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.updateFileDisplay();
                this.updateProfileDisplay();
                this.applySettings();
            }

            loadSettings() {
                const stored = localStorage.getItem('fileFlowSettings');
                if (stored) {
                    return { ...this.getDefaultSettings(), ...JSON.parse(stored) };
                }
                return this.getDefaultSettings();
            }

            getDefaultSettings() {
                return {
                    // Upload Settings
                    maxFileSize: 50, // MB
                    allowedTypes: {
                        images: true,
                        documents: true,
                        videos: true,
                        audio: true
                    },
                    uploadBehavior: 'auto',
                    concurrentUploads: 3,
                    
                    // Interface Preferences
                    defaultView: 'list',
                    defaultSort: 'name',
                    listSpacing: 'comfortable',
                    showPreviews: true,
                    toastDuration: 3,
                    
                    // Advanced Features
                    autoRename: true,
                    compressImages: false,
                    autoClearHistory: 'never',
                    maxHistoryItems: 100,
                    
                    // Privacy & Security
                    privacyMode: false,
                    autoLogout: 'never'
                };
            }

            saveSettings() {
                try {
                    localStorage.setItem('fileFlowSettings', JSON.stringify(this.settings));
                    return true;
                } catch (error) {
                    console.error('Failed to save settings:', error);
                    return false;
                }
            }

            applySettings() {
                // Apply current settings to the interface
                this.currentSort = this.settings.defaultSort;
                
                // Update sort buttons
                document.querySelectorAll('.sort-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.sort === this.currentSort);
                });
                
                // Apply list spacing
                const fileItems = document.querySelectorAll('.file-item');
                fileItems.forEach(item => {
                    if (this.settings.listSpacing === 'compact') {
                        item.style.padding = '0.5rem';
                    } else {
                        item.style.padding = '1rem';
                    }
                });
            }

            setupEventListeners() {
                // File input and upload area
                const fileInput = document.getElementById('fileInput');
                const uploadArea = document.getElementById('uploadArea');
                const uploadButton = document.getElementById('uploadButton');
                const uploadSection = document.getElementById('uploadSection');

                // Click to upload
                uploadArea.addEventListener('click', () => fileInput.click());
                uploadButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    fileInput.click();
                });

                // File selection
                fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

                // Drag and drop
                uploadSection.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadSection.classList.add('drag-over');
                });

                uploadSection.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    uploadSection.classList.remove('drag-over');
                });

                uploadSection.addEventListener('drop', (e) => {
                    e.preventDefault();
                    uploadSection.classList.remove('drag-over');
                    this.handleFiles(e.dataTransfer.files);
                });

                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

                // Sidebar toggle
                document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());

                // Sort buttons
                document.querySelectorAll('.sort-btn').forEach(btn => {
                    btn.addEventListener('click', () => this.sortFiles(btn.dataset.sort));
                });

                // Navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.switchPage(item.dataset.page);
                    });
                });

                // Profile modal
                document.querySelector('.user-avatar').addEventListener('click', () => this.openProfileModal());
                document.getElementById('closeProfileModal').addEventListener('click', () => this.closeProfileModal());
                document.getElementById('cancelProfileBtn').addEventListener('click', () => this.closeProfileModal());
                document.getElementById('profileForm').addEventListener('submit', (e) => this.saveProfile(e));
                
                // Profile picture
                document.getElementById('uploadPictureBtn').addEventListener('click', () => {
                    document.getElementById('profilePictureInput').click();
                });
                document.getElementById('pictureOverlay').addEventListener('click', () => {
                    document.getElementById('profilePictureInput').click();
                });
                document.getElementById('removePictureBtn').addEventListener('click', () => this.removeProfilePicture());
                document.getElementById('profilePictureInput').addEventListener('change', (e) => this.handleProfilePicture(e));

                // Close modal on overlay click
                document.getElementById('profileModal').addEventListener('click', (e) => {
                    if (e.target.id === 'profileModal') {
                        this.closeProfileModal();
                    }
                });

                // File viewer modal
                document.getElementById('closeFileViewer').addEventListener('click', () => this.closeFileViewer());
                document.getElementById('downloadFileBtn').addEventListener('click', () => this.downloadCurrentFile());
                
                // Close file viewer on overlay click
                document.getElementById('fileViewerModal').addEventListener('click', (e) => {
                    if (e.target.id === 'fileViewerModal') {
                        this.closeFileViewer();
                    }
                });
            }

            setupSettingsEventListeners() {
                // File size slider
                const maxFileSizeSlider = document.getElementById('maxFileSize');
                if (maxFileSizeSlider) {
                    maxFileSizeSlider.addEventListener('input', (e) => {
                        document.querySelector('#maxFileSize + .setting-value').textContent = e.target.value + ' MB';
                    });
                }

                // Toast duration slider
                const toastDurationSlider = document.getElementById('toastDuration');
                if (toastDurationSlider) {
                    toastDurationSlider.addEventListener('input', (e) => {
                        document.querySelector('#toastDuration + .setting-value').textContent = e.target.value + ' seconds';
                    });
                }

                // Max history items slider
                const maxHistorySlider = document.getElementById('maxHistoryItems');
                if (maxHistorySlider) {
                    maxHistorySlider.addEventListener('input', (e) => {
                        document.querySelector('#maxHistoryItems + .setting-value').textContent = e.target.value + ' items';
                    });
                }

                // Save settings button
                const saveBtn = document.getElementById('saveSettings');
                if (saveBtn) {
                    saveBtn.addEventListener('click', () => this.saveSettingsFromForm());
                }

                // Reset settings button
                const resetBtn = document.getElementById('resetSettings');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => this.resetSettings());
                }

                // Clear all data button
                const clearBtn = document.getElementById('clearAllData');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => this.clearAllData());
                }

                // Export data button
                const exportBtn = document.getElementById('exportData');
                if (exportBtn) {
                    exportBtn.addEventListener('click', () => this.exportData());
                }
            }

            saveSettingsFromForm() {
                // Collect all settings from the form
                this.settings.maxFileSize = parseInt(document.getElementById('maxFileSize')?.value || 50);
                this.settings.uploadBehavior = document.getElementById('uploadBehavior')?.value || 'auto';
                this.settings.concurrentUploads = parseInt(document.getElementById('concurrentUploads')?.value || 3);
                this.settings.defaultSort = document.getElementById('defaultSort')?.value || 'name';
                this.settings.toastDuration = parseInt(document.getElementById('toastDuration')?.value || 3);
                this.settings.maxHistoryItems = parseInt(document.getElementById('maxHistoryItems')?.value || 100);
                this.settings.autoClearHistory = document.getElementById('autoClearHistory')?.value || 'never';
                this.settings.autoLogout = document.getElementById('autoLogout')?.value || 'never';

                // Checkboxes and toggles
                this.settings.showPreviews = document.getElementById('showPreviews')?.checked || false;
                this.settings.autoRename = document.getElementById('autoRename')?.checked || false;
                this.settings.compressImages = document.getElementById('compressImages')?.checked || false;
                this.settings.privacyMode = document.getElementById('privacyMode')?.checked || false;

                // File types
                const typeCheckboxes = document.querySelectorAll('[data-type]');
                typeCheckboxes.forEach(checkbox => {
                    const type = checkbox.dataset.type;
                    this.settings.allowedTypes[type] = checkbox.checked;
                });

                // Radio buttons
                const defaultViewRadio = document.querySelector('input[name="defaultView"]:checked');
                if (defaultViewRadio) {
                    this.settings.defaultView = defaultViewRadio.value;
                }

                const listSpacingRadio = document.querySelector('input[name="listSpacing"]:checked');
                if (listSpacingRadio) {
                    this.settings.listSpacing = listSpacingRadio.value;
                }

                // Save to localStorage
                if (this.saveSettings()) {
                    this.showToast('Settings saved successfully!', 'success');
                    this.applySettings();
                } else {
                    this.showToast('Failed to save settings', 'error');
                }
            }

            resetSettings() {
                if (confirm('Are you sure you want to reset all settings to defaults?')) {
                    this.settings = this.getDefaultSettings();
                    this.saveSettings();
                    this.renderSettingsPage();
                    this.applySettings();
                    this.showToast('Settings reset to defaults', 'success');
                }
            }

            clearAllData() {
                if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
                    localStorage.removeItem('fileUploadHistory');
                    localStorage.removeItem('userProfile');
                    localStorage.removeItem('fileFlowSettings');
                    
                    // Reset to defaults
                    this.profile = this.loadProfile();
                    this.settings = this.getDefaultSettings();
                    this.files = [];
                    
                    this.updateProfileDisplay();
                    this.updateFileDisplay();
                    this.showToast('All data cleared', 'success');
                }
            }

            exportData() {
                const data = {
                    profile: this.profile,
                    settings: this.settings,
                    history: this.loadHistoryFromStorage(),
                    exportDate: new Date().toISOString()
                };

                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fileflow-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.showToast('Data exported successfully', 'success');
            }

            validateFile(file) {
                // Check file size
                const maxSizeBytes = this.settings.maxFileSize * 1024 * 1024;
                if (file.size > maxSizeBytes) {
                    this.showToast(`File "${file.name}" is too large (max ${this.settings.maxFileSize}MB)`, 'error');
                    return false;
                }

                // Check file type
                const fileType = this.getFileType(file.name);
                const typeMap = {
                    'Image': 'images',
                    'PDF Document': 'documents',
                    'Word Document': 'documents',
                    'Excel Spreadsheet': 'documents',
                    'PowerPoint': 'documents',
                    'Document': 'documents',
                    'Archive': 'documents',
                    'Video': 'videos',
                    'Audio': 'audio'
                };

                const category = typeMap[fileType] || 'documents';
                if (!this.settings.allowedTypes[category]) {
                    this.showToast(`File type "${fileType}" is not allowed`, 'error');
                    return false;
                }

                return true;
            }

            handleFiles(fileList) {
                const validFiles = Array.from(fileList).filter(file => this.validateFile(file));
                
                if (validFiles.length === 0) {
                    return;
                }

                validFiles.forEach(file => {
                    let fileName = file.name;
                    
                    // Auto-rename duplicates if enabled
                    if (this.settings.autoRename) {
                        const existingNames = this.files.map(f => f.name);
                        let counter = 1;
                        const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
                        const extension = fileName.substring(fileName.lastIndexOf('.')) || '';
                        
                        while (existingNames.includes(fileName)) {
                            fileName = `${baseName} (${counter})${extension}`;
                            counter++;
                        }
                    }

                    const fileObj = {
                        id: Date.now() + Math.random(),
                        file: file,
                        name: fileName,
                        size: this.formatFileSize(file.size),
                        type: this.getFileType(file.name),
                        status: 'uploading',
                        progress: 0,
                        preview: null
                    };

                    // Generate preview for images if enabled
                    if (file.type.startsWith('image/') && this.settings.showPreviews) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            fileObj.preview = e.target.result;
                            this.updateFileDisplay();
                        };
                        reader.readAsDataURL(file);
                    }

                    this.files.unshift(fileObj);
                    this.simulateUpload(fileObj);
                });

                this.updateFileDisplay();
                this.showToast(`${validFiles.length} file(s) added to upload queue`, 'success');
            }

            simulateUpload(fileObj) {
                const duration = 2000 + Math.random() * 3000; // 2-5 seconds
                const interval = 50;
                const increment = 100 / (duration / interval);

                const progressInterval = setInterval(() => {
                    fileObj.progress += increment;
                    
                    if (fileObj.progress >= 100) {
                        fileObj.progress = 100;
                        fileObj.status = Math.random() > 0.1 ? 'success' : 'error'; // 90% success rate
                        clearInterval(progressInterval);
                        
                        // Save completed uploads to history (unless privacy mode is on)
                        if (!this.settings.privacyMode) {
                            this.saveToHistory(fileObj);
                        }
                        
                        // Remove from current uploads after a short delay
                        setTimeout(() => {
                            this.files = this.files.filter(f => f.id !== fileObj.id);
                            if (this.currentPage === 'uploads') {
                                this.updateFileDisplay();
                            }
                        }, 2000);
                        
                        const message = fileObj.status === 'success' 
                            ? `${fileObj.name} uploaded successfully${this.settings.privacyMode ? '' : ' - moved to history'}`
                            : `Failed to upload ${fileObj.name}${this.settings.privacyMode ? '' : ' - moved to history'}`;
                        this.showToast(message, fileObj.status);
                    }
                    
                    this.updateFileDisplay();
                }, interval);
            }

            updateFileDisplay() {
                const container = document.getElementById('fileListContainer');
                
                if (this.currentPage === 'history') {
                    const history = this.loadHistoryFromStorage();
                    const sortedHistory = this.getSortedHistory(history);
                    
                    if (sortedHistory.length === 0) {
                        container.innerHTML = `
                            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                                <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                                <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">No upload history yet</div>
                                <div style="font-size: 0.9rem;">Files you upload will appear here</div>
                            </div>
                        `;
                        return;
                    }
                    
                    container.innerHTML = sortedHistory.map(file => `
                        <div class="file-item" style="padding: ${this.settings.listSpacing === 'compact' ? '0.5rem' : '1rem'}">
                            <div class="file-preview">
                                ${file.preview && this.settings.showPreviews
                                    ? `<img src="${file.preview}" alt="${file.name}">` 
                                    : `<div class="file-icon">${this.getFileIcon(file.type)}</div>`
                                }
                            </div>
                            <div class="file-info">
                                <div class="file-name">${file.name}</div>
                                <div class="file-details">${file.size} • ${file.type} • ${file.completedAt}</div>
                            </div>
                            <div class="file-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 100%"></div>
                                </div>
                                <div class="progress-text">Completed</div>
                            </div>
                            <div class="file-status">
                                <div class="status-icon status-${file.status}">
                                    ${this.getStatusIcon(file.status)}
                                </div>
                            </div>
                            <div class="file-actions">
                                <button class="action-btn view-btn" onclick="dashboard.viewFile('${file.id}', true)" title="View file">
                                    👁️
                                </button>
                                <button class="action-btn download-btn" onclick="dashboard.downloadFile('${file.id}', true)" title="Download file">
                                    💾
                                </button>
                                <button class="action-btn remove-btn" onclick="dashboard.removeFromHistory('${file.id}')" title="Remove from history">
                                    ✖
                                </button>
                            </div>
                        </div>
                    `).join('');
                } else {
                    // Current uploads view
                    const sortedFiles = this.getSortedFiles();
                    
                    if (sortedFiles.length === 0) {
                        container.innerHTML = `
                            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                                <div style="font-size: 3rem; margin-bottom: 1rem;">📤</div>
                                <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">No active uploads</div>
                                <div style="font-size: 0.9rem;">Upload files to see them here</div>
                            </div>
                        `;
                        return;
                    }
                    
                    container.innerHTML = sortedFiles.map(file => `
                        <div class="file-item" style="padding: ${this.settings.listSpacing === 'compact' ? '0.5rem' : '1rem'}">
                            <div class="file-preview">
                                ${file.preview && this.settings.showPreviews
                                    ? `<img src="${file.preview}" alt="${file.name}">` 
                                    : `<div class="file-icon">${this.getFileIcon(file.type)}</div>`
                                }
                            </div>
                            <div class="file-info">
                                <div class="file-name">${file.name}</div>
                                <div class="file-details">${file.size} • ${file.type}</div>
                            </div>
                            <div class="file-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${file.progress}%"></div>
                                </div>
                                <div class="progress-text">${Math.round(file.progress)}%</div>
                            </div>
                            <div class="file-status">
                                <div class="status-icon status-${file.status}">
                                    ${this.getStatusIcon(file.status)}
                                </div>
                            </div>
                            <div class="file-actions">
                                ${file.status === 'success' ? `
                                    <button class="action-btn view-btn" onclick="dashboard.viewFile('${file.id}', false)" title="View file">
                                        👁️
                                    </button>
                                    <button class="action-btn download-btn" onclick="dashboard.downloadFile('${file.id}', false)" title="Download file">
                                        💾
                                    </button>
                                ` : ''}
                                <button class="action-btn remove-btn" onclick="dashboard.removeFile('${file.id}')" title="Remove file">
                                    ✖
                                </button>
                            </div>
                        </div>
                    `).join('');
                }
            }

            getSortedFiles() {
                return [...this.files].sort((a, b) => {
                    switch (this.currentSort) {
                        case 'name':
                            return a.name.localeCompare(b.name);
                        case 'size':
                            return a.file.size - b.file.size;
                        case 'type':
                            return a.type.localeCompare(b.type);
                        case 'status':
                            return a.status.localeCompare(b.status);
                        default:
                            return 0;
                    }
                });
            }

            getSortedHistory(history) {
                return [...history].sort((a, b) => {
                    switch (this.currentSort) {
                        case 'name':
                            return a.name.localeCompare(b.name);
                        case 'size':
                            // Parse size strings for comparison
                            const sizeA = this.parseSizeString(a.size);
                            const sizeB = this.parseSizeString(b.size);
                            return sizeA - sizeB;
                        case 'type':
                            return a.type.localeCompare(b.type);
                        case 'status':
                            return a.status.localeCompare(b.status);
                        default:
                            return new Date(b.uploadDate) - new Date(a.uploadDate); // Most recent first
                    }
                });
            }

            parseSizeString(sizeStr) {
                const units = { 'Bytes': 1, 'KB': 1024, 'MB': 1024*1024, 'GB': 1024*1024*1024 };
                const parts = sizeStr.split(' ');
                const value = parseFloat(parts[0]);
                const unit = parts[1];
                return value * (units[unit] || 1);
            }

            removeFromHistory(fileId) {
                const history = this.loadHistoryFromStorage();
                const updatedHistory = history.filter(file => file.id != fileId);
                localStorage.setItem('fileUploadHistory', JSON.stringify(updatedHistory));
                this.updateFileDisplay();
                this.showToast('File removed from history', 'success');
            }

            sortFiles(sortBy) {
                this.currentSort = sortBy;
                
                // Update active sort button
                document.querySelectorAll('.sort-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.sort === sortBy);
                });
                
                this.updateFileDisplay();
            }

            removeFile(fileId) {
                this.files = this.files.filter(file => file.id != fileId);
                this.updateFileDisplay();
                this.showToast('File removed', 'success');
            }

            getFileType(filename) {
                const ext = filename.split('.').pop().toLowerCase();
                const types = {
                    'pdf': 'PDF Document',
                    'doc': 'Word Document',
                    'docx': 'Word Document',
                    'xls': 'Excel Spreadsheet',
                    'xlsx': 'Excel Spreadsheet',
                    'ppt': 'PowerPoint',
                    'pptx': 'PowerPoint',
                    'zip': 'Archive',
                    'rar': 'Archive',
                    'jpg': 'Image',
                    'jpeg': 'Image',
                    'png': 'Image',
                    'gif': 'Image',
                    'mp4': 'Video',
                    'avi': 'Video',
                    'mp3': 'Audio',
                    'wav': 'Audio'
                };
                return types[ext] || 'Document';
            }

            getFileIcon(type) {
                const icons = {
                    'PDF Document': '📄',
                    'Word Document': '📝',
                    'Excel Spreadsheet': '📊',
                    'PowerPoint': '📋',
                    'Archive': '🗜️',
                    'Image': '🖼️',
                    'Video': '🎥',
                    'Audio': '🎵',
                    'Document': '📄'
                };
                return icons[type] || '📄';
            }

            getStatusIcon(status) {
                const icons = {
                    'uploading': '⏳',
                    'success': '✅',
                    'error': '❌'
                };
                return icons[status] || '⏳';
            }

            formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }

            toggleTheme() {
                this.isDarkTheme = !this.isDarkTheme;
                document.body.classList.toggle('light-theme', !this.isDarkTheme);
                document.getElementById('themeToggle').textContent = this.isDarkTheme ? '🌙' : '☀️';
            }

            toggleSidebar() {
                this.sidebarCollapsed = !this.sidebarCollapsed;
                const sidebar = document.getElementById('sidebar');
                
                if (window.innerWidth <= 768) {
                    // Mobile behavior - show/hide with overlay
                    sidebar.classList.toggle('open', !this.sidebarCollapsed);
                } else {
                    // Desktop behavior - collapse/expand
                    sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
                }
            }

            switchPage(page) {
                this.currentPage = page;
                
                // Update active nav item
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.toggle('active', item.dataset.page === page);
                });

                // Update page content
                const titles = {
                    'uploads': 'File Uploads',
                    'history': 'Upload History',
                    'settings': 'Settings'
                };

                const subtitles = {
                    'uploads': 'Drag and drop files or click to upload',
                    'history': 'View your previously uploaded files',
                    'settings': 'Configure your upload preferences'
                };

                document.querySelector('.page-title').textContent = titles[page] || 'File Uploads';
                document.querySelector('.page-subtitle').textContent = subtitles[page] || '';

                // Update file list header
                const listHeaders = {
                    'uploads': 'Current Uploads',
                    'history': 'Upload History',
                    'settings': 'Configuration'
                };

                const headerElement = document.querySelector('.file-list-header h2');
                if (headerElement) {
                    headerElement.textContent = listHeaders[page] || 'Files';
                }

                // Show/hide upload section based on page
                const uploadSection = document.getElementById('uploadSection');
                if (page === 'uploads') {
                    uploadSection.style.display = 'block';
                } else {
                    uploadSection.style.display = 'none';
                }

                // Add clear history button for history page
                this.updatePageSpecificControls(page);

                // Refresh display
                this.updateFileDisplay();
            }

            updatePageSpecificControls(page) {
                const sortControls = document.querySelector('.sort-controls');
                const fileListSection = document.querySelector('.file-list');
                
                // Always hide settings container first
                const settingsContainer = document.getElementById('settingsContainer');
                if (settingsContainer) {
                    settingsContainer.style.display = 'none';
                }
                
                if (page === 'history') {
                    // Show file list section
                    fileListSection.style.display = 'block';
                    
                    // Add clear history button if not exists
                    if (!document.getElementById('clearHistoryBtn')) {
                        const clearBtn = document.createElement('button');
                        clearBtn.id = 'clearHistoryBtn';
                        clearBtn.className = 'sort-btn';
                        clearBtn.textContent = 'Clear All';
                        clearBtn.style.backgroundColor = 'var(--error)';
                        clearBtn.style.borderColor = 'var(--error)';
                        clearBtn.style.color = 'white';
                        clearBtn.addEventListener('click', () => this.clearHistory());
                        sortControls.appendChild(clearBtn);
                    }
                    
                    // Remove clear history button from other pages
                    const clearBtn = document.getElementById('clearHistoryBtn');
                    if (clearBtn && page !== 'history') {
                        clearBtn.remove();
                    }
                } else if (page === 'uploads') {
                    // Show file list section
                    fileListSection.style.display = 'block';
                    
                    // Remove clear history button if exists
                    const clearBtn = document.getElementById('clearHistoryBtn');
                    if (clearBtn) {
                        clearBtn.remove();
                    }
                } else if (page === 'settings') {
                    // Hide file list section completely for settings
                    fileListSection.style.display = 'none';
                    
                    // Remove clear history button if exists
                    const clearBtn = document.getElementById('clearHistoryBtn');
                    if (clearBtn) {
                        clearBtn.remove();
                    }
                    
                    // Create settings container if it doesn't exist
                    let settingsContainer = document.getElementById('settingsContainer');
                    if (!settingsContainer) {
                        settingsContainer = document.createElement('div');
                        settingsContainer.id = 'settingsContainer';
                        settingsContainer.className = 'settings-container';
                        fileListSection.parentNode.insertBefore(settingsContainer, fileListSection.nextSibling);
                    }
                    
                    // Show settings content only for settings page
                    settingsContainer.style.display = 'block';
                    this.renderSettingsPage();
                }
                
                // Ensure file list is visible for non-settings pages
                if (page !== 'settings') {
                    fileListSection.style.display = 'block';
                }
            }

            renderSettingsPage() {
                const container = document.getElementById('settingsContainer');
                container.innerHTML = `
                    <div class="settings-container">
                        <!-- Upload Settings -->
                        <div class="settings-section">
                            <h3 class="settings-title">📤 Upload Settings</h3>
                            
                            <div class="setting-item">
                                <label class="setting-label">Maximum File Size</label>
                                <div class="setting-control">
                                    <input type="range" id="maxFileSize" min="1" max="100" value="${this.settings.maxFileSize}" class="slider">
                                    <span class="setting-value">${this.settings.maxFileSize} MB</span>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Allowed File Types</label>
                                <div class="setting-control checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" ${this.settings.allowedTypes.images ? 'checked' : ''} data-type="images">
                                        <span class="checkmark">🖼️</span> Images
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" ${this.settings.allowedTypes.documents ? 'checked' : ''} data-type="documents">
                                        <span class="checkmark">📄</span> Documents
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" ${this.settings.allowedTypes.videos ? 'checked' : ''} data-type="videos">
                                        <span class="checkmark">🎥</span> Videos
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" ${this.settings.allowedTypes.audio ? 'checked' : ''} data-type="audio">
                                        <span class="checkmark">🎵</span> Audio
                                    </label>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Upload Behavior</label>
                                <div class="setting-control">
                                    <select id="uploadBehavior" class="setting-select">
                                        <option value="auto" ${this.settings.uploadBehavior === 'auto' ? 'selected' : ''}>Auto-upload immediately</option>
                                        <option value="manual" ${this.settings.uploadBehavior === 'manual' ? 'selected' : ''}>Manual confirmation</option>
                                    </select>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Concurrent Uploads</label>
                                <div class="setting-control">
                                    <select id="concurrentUploads" class="setting-select">
                                        <option value="1" ${this.settings.concurrentUploads === 1 ? 'selected' : ''}>1 file at a time</option>
                                        <option value="3" ${this.settings.concurrentUploads === 3 ? 'selected' : ''}>3 files at a time</option>
                                        <option value="5" ${this.settings.concurrentUploads === 5 ? 'selected' : ''}>5 files at a time</option>
                                        <option value="10" ${this.settings.concurrentUploads === 10 ? 'selected' : ''}>10 files at a time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Interface Preferences -->
                        <div class="settings-section">
                            <h3 class="settings-title">🎨 Interface Preferences</h3>
                            
                            <div class="setting-item">
                                <label class="setting-label">Default View</label>
                                <div class="setting-control">
                                    <div class="radio-group">
                                        <label class="radio-label">
                                            <input type="radio" name="defaultView" value="list" ${this.settings.defaultView === 'list' ? 'checked' : ''}>
                                            <span class="radio-mark"></span> List View
                                        </label>
                                        <label class="radio-label">
                                            <input type="radio" name="defaultView" value="grid" ${this.settings.defaultView === 'grid' ? 'checked' : ''}>
                                            <span class="radio-mark"></span> Grid View
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Default Sort Order</label>
                                <div class="setting-control">
                                    <select id="defaultSort" class="setting-select">
                                        <option value="name" ${this.settings.defaultSort === 'name' ? 'selected' : ''}>Name</option>
                                        <option value="size" ${this.settings.defaultSort === 'size' ? 'selected' : ''}>Size</option>
                                        <option value="type" ${this.settings.defaultSort === 'type' ? 'selected' : ''}>Type</option>
                                        <option value="date" ${this.settings.defaultSort === 'date' ? 'selected' : ''}>Date</option>
                                    </select>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">File List Spacing</label>
                                <div class="setting-control">
                                    <div class="radio-group">
                                        <label class="radio-label">
                                            <input type="radio" name="listSpacing" value="compact" ${this.settings.listSpacing === 'compact' ? 'checked' : ''}>
                                            <span class="radio-mark"></span> Compact
                                        </label>
                                        <label class="radio-label">
                                            <input type="radio" name="listSpacing" value="comfortable" ${this.settings.listSpacing === 'comfortable' ? 'checked' : ''}>
                                            <span class="radio-mark"></span> Comfortable
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Show File Previews</label>
                                <div class="setting-control">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="showPreviews" ${this.settings.showPreviews ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Toast Duration</label>
                                <div class="setting-control">
                                    <input type="range" id="toastDuration" min="1" max="10" value="${this.settings.toastDuration}" class="slider">
                                    <span class="setting-value">${this.settings.toastDuration} seconds</span>
                                </div>
                            </div>
                        </div>

                        <!-- Advanced Features -->
                        <div class="settings-section">
                            <h3 class="settings-title">⚡ Advanced Features</h3>
                            
                            <div class="setting-item">
                                <label class="setting-label">Auto-rename Duplicates</label>
                                <div class="setting-control">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="autoRename" ${this.settings.autoRename ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <span class="setting-description">Automatically add numbers to duplicate filenames</span>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Compress Images</label>
                                <div class="setting-control">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="compressImages" ${this.settings.compressImages ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <span class="setting-description">Reduce image file sizes automatically</span>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Auto-clear History</label>
                                <div class="setting-control">
                                    <select id="autoClearHistory" class="setting-select">
                                        <option value="never" ${this.settings.autoClearHistory === 'never' ? 'selected' : ''}>Never</option>
                                        <option value="7" ${this.settings.autoClearHistory === '7' ? 'selected' : ''}>After 7 days</option>
                                        <option value="30" ${this.settings.autoClearHistory === '30' ? 'selected' : ''}>After 30 days</option>
                                        <option value="90" ${this.settings.autoClearHistory === '90' ? 'selected' : ''}>After 90 days</option>
                                    </select>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Maximum History Items</label>
                                <div class="setting-control">
                                    <input type="range" id="maxHistoryItems" min="10" max="500" step="10" value="${this.settings.maxHistoryItems}" class="slider">
                                    <span class="setting-value">${this.settings.maxHistoryItems} items</span>
                                </div>
                            </div>
                        </div>

                        <!-- Privacy & Security -->
                        <div class="settings-section">
                            <h3 class="settings-title">🔒 Privacy & Security</h3>
                            
                            <div class="setting-item">
                                <label class="setting-label">Privacy Mode</label>
                                <div class="setting-control">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="privacyMode" ${this.settings.privacyMode ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <span class="setting-description">Don't save upload history or file previews</span>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Auto-logout Timer</label>
                                <div class="setting-control">
                                    <select id="autoLogout" class="setting-select">
                                        <option value="never" ${this.settings.autoLogout === 'never' ? 'selected' : ''}>Never</option>
                                        <option value="15" ${this.settings.autoLogout === '15' ? 'selected' : ''}>15 minutes</option>
                                        <option value="30" ${this.settings.autoLogout === '30' ? 'selected' : ''}>30 minutes</option>
                                        <option value="60" ${this.settings.autoLogout === '60' ? 'selected' : ''}>1 hour</option>
                                        <option value="240" ${this.settings.autoLogout === '240' ? 'selected' : ''}>4 hours</option>
                                    </select>
                                </div>
                            </div>

                            <div class="setting-item danger-zone">
                                <label class="setting-label">Data Management</label>
                                <div class="setting-control">
                                    <button class="danger-btn" id="clearAllData">Clear All Data</button>
                                    <button class="export-btn" id="exportData">Export Data</button>
                                    <span class="setting-description">Clear all stored data or export for backup</span>
                                </div>
                            </div>
                        </div>

                        <!-- Save Settings -->
                        <div class="settings-actions">
                            <button class="btn btn-secondary" id="resetSettings">Reset to Defaults</button>
                            <button class="btn btn-primary" id="saveSettings">Save Settings</button>
                        </div>
                    </div>
                `;

                // Setup settings event listeners
                this.setupSettingsEventListeners();
            }

            showToast(message, type = 'info') {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.textContent = message;

                document.getElementById('toastContainer').appendChild(toast);

                // Auto remove after duration from settings
                const duration = this.settings.toastDuration * 1000;
                setTimeout(() => {
                    toast.style.animation = 'slideIn 0.3s ease reverse';
                    setTimeout(() => toast.remove(), 300);
                }, duration);
            }

            loadHistoryFromStorage() {
                const stored = localStorage.getItem('fileUploadHistory');
                return stored ? JSON.parse(stored) : [];
            }

            saveToHistory(fileObj) {
                const history = this.loadHistoryFromStorage();
                
                // Convert file to base64 for storage and download
                const reader = new FileReader();
                reader.onload = (e) => {
                    const historyItem = {
                        id: fileObj.id,
                        name: fileObj.name,
                        size: fileObj.size,
                        type: fileObj.type,
                        status: fileObj.status,
                        progress: 100,
                        uploadDate: new Date().toISOString(),
                        completedAt: new Date().toLocaleString(),
                        preview: fileObj.preview || null,
                        fileData: e.target.result, // Store file as base64
                        mimeType: fileObj.file.type
                    };
                    
                    history.unshift(historyItem);
                    
                    // Keep only max items from settings
                    if (history.length > this.settings.maxHistoryItems) {
                        history.splice(this.settings.maxHistoryItems);
                    }
                    
                    try {
                        localStorage.setItem('fileUploadHistory', JSON.stringify(history));
                        console.log('File saved to history:', historyItem.name);
                    } catch (error) {
                        console.error('Failed to save to localStorage:', error);
                        // If storage fails due to size, try without file data
                        if (historyItem.fileData) {
                            historyItem.fileData = null;
                            try {
                                localStorage.setItem('fileUploadHistory', JSON.stringify(history));
                                this.showToast(`${historyItem.name} saved to history (file too large for download)`, 'success');
                            } catch (e) {
                                console.error('Failed to save even without file data:', e);
                            }
                        }
                    }
                };
                
                // Read file as data URL for storage
                if (fileObj.file) {
                    reader.readAsDataURL(fileObj.file);
                } else {
                    // Fallback without file data
                    const historyItem = {
                        id: fileObj.id,
                        name: fileObj.name,
                        size: fileObj.size,
                        type: fileObj.type,
                        status: fileObj.status,
                        progress: 100,
                        uploadDate: new Date().toISOString(),
                        completedAt: new Date().toLocaleString(),
                        preview: fileObj.preview || null,
                        fileData: null,
                        mimeType: null
                    };
                    
                    history.unshift(historyItem);
                    
                    if (history.length > this.settings.maxHistoryItems) {
                        history.splice(this.settings.maxHistoryItems);
                    }
                    
                    try {
                        localStorage.setItem('fileUploadHistory', JSON.stringify(history));
                    } catch (error) {
                        console.error('Failed to save to localStorage:', error);
                    }
                }
            }

            clearHistory() {
                localStorage.removeItem('fileUploadHistory');
                if (this.currentPage === 'history') {
                    this.updateFileDisplay();
                }
                this.showToast('Upload history cleared', 'success');
            }

            // Profile Management Methods
            loadProfile() {
                const stored = localStorage.getItem('userProfile');
                if (stored) {
                    return JSON.parse(stored);
                }
                return {
                    firstName: '',
                    lastName: '',
                    email: '',
                    bio: '',
                    profilePicture: null,
                    initials: 'JD'
                };
            }

            saveProfileToStorage() {
                try {
                    localStorage.setItem('userProfile', JSON.stringify(this.profile));
                    return true;
                } catch (error) {
                    console.error('Failed to save profile:', error);
                    // If saving fails due to large image, try without profile picture
                    if (this.profile.profilePicture) {
                        const profileCopy = { ...this.profile };
                        profileCopy.profilePicture = null;
                        try {
                            localStorage.setItem('userProfile', JSON.stringify(profileCopy));
                            this.showToast('Profile saved (image too large, removed)', 'success');
                            return false;
                        } catch (e) {
                            console.error('Failed to save even without image:', e);
                            return false;
                        }
                    }
                    return false;
                }
            }

            updateProfileDisplay() {
                const avatar = document.querySelector('.user-avatar');
                const modalPicture = document.getElementById('modalProfilePicture');
                
                if (this.profile.profilePicture) {
                    avatar.innerHTML = `<img src="${this.profile.profilePicture}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                    modalPicture.innerHTML = `<img src="${this.profile.profilePicture}" alt="Profile">`;
                } else {
                    const initials = this.getInitials();
                    avatar.textContent = initials;
                    modalPicture.textContent = initials;
                }
            }

            getInitials() {
                if (this.profile.firstName || this.profile.lastName) {
                    const first = this.profile.firstName ? this.profile.firstName.charAt(0).toUpperCase() : '';
                    const last = this.profile.lastName ? this.profile.lastName.charAt(0).toUpperCase() : '';
                    return first + last || 'U';
                }
                return this.profile.initials || 'JD';
            }

            openProfileModal() {
                // Populate form with current profile data
                document.getElementById('firstName').value = this.profile.firstName || '';
                document.getElementById('lastName').value = this.profile.lastName || '';
                document.getElementById('email').value = this.profile.email || '';
                document.getElementById('bio').value = this.profile.bio || '';
                
                // Update modal profile picture
                this.updateModalProfilePicture();
                
                // Show modal
                document.getElementById('profileModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeProfileModal() {
                document.getElementById('profileModal').classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Reset form
                document.getElementById('profileForm').reset();
            }

            updateModalProfilePicture() {
                const modalPicture = document.getElementById('modalProfilePicture');
                
                if (this.profile.profilePicture) {
                    modalPicture.innerHTML = `<img src="${this.profile.profilePicture}" alt="Profile">`;
                } else {
                    modalPicture.textContent = this.getInitials();
                }
            }

            handleProfilePicture(event) {
                const file = event.target.files[0];
                if (!file) return;

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    this.showToast('Please select an image file', 'error');
                    return;
                }

                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    this.showToast('Image too large. Please choose a file under 5MB', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.profile.profilePicture = e.target.result;
                    this.updateModalProfilePicture();
                    this.showToast('Profile picture updated', 'success');
                };
                reader.readAsDataURL(file);
            }

            removeProfilePicture() {
                this.profile.profilePicture = null;
                this.updateModalProfilePicture();
                this.showToast('Profile picture removed', 'success');
            }

            saveProfile(event) {
                event.preventDefault();
                
                // Get form data
                const formData = new FormData(event.target);
                this.profile.firstName = document.getElementById('firstName').value.trim();
                this.profile.lastName = document.getElementById('lastName').value.trim();
                this.profile.email = document.getElementById('email').value.trim();
                this.profile.bio = document.getElementById('bio').value.trim();
                
                // Validate required fields
                if (!this.profile.firstName && !this.profile.lastName) {
                    this.showToast('Please enter at least your first or last name', 'error');
                    return;
                }

                // Save to localStorage
                const saved = this.saveProfileToStorage();
                
                if (saved) {
                    this.showToast('Profile saved successfully!', 'success');
                } else {
                    this.showToast('Profile saved (some data may have been reduced)', 'success');
                }
                
                // Update displays
                this.updateProfileDisplay();
                this.closeProfileModal();
            }

            // File Viewer Methods
            viewFile(fileId, isFromHistory = false) {
                let file;
                
                if (isFromHistory) {
                    const history = this.loadHistoryFromStorage();
                    file = history.find(f => f.id == fileId);
                } else {
                    file = this.files.find(f => f.id == fileId);
                }
                
                if (!file) {
                    this.showToast('File not found', 'error');
                    return;
                }

                this.currentViewingFile = file;
                this.openFileViewer(file);
            }

            openFileViewer(file) {
                const modal = document.getElementById('fileViewerModal');
                const fileName = document.getElementById('viewerFileName');
                const content = document.getElementById('fileViewerContent');
                
                fileName.textContent = file.name;
                content.innerHTML = '<div class="loading-spinner"></div>';
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Load file content based on type
                setTimeout(() => {
                    this.loadFileContent(file, content);
                }, 100);
            }

            loadFileContent(file, container) {
                const fileType = file.type;
                const fileName = file.name.toLowerCase();
                
                // For current uploads, we have the actual file object
                const actualFile = this.files.find(f => f.id === file.id)?.file;
                
                if (file.preview && (fileType === 'Image' || fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/))) {
                    // Display image from preview
                    container.innerHTML = `
                        <img src="${file.preview}" alt="${file.name}" class="image-viewer">
                    `;
                } else if (file.fileData && (fileType === 'Image' || fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/))) {
                    // Display image from stored file data
                    container.innerHTML = `
                        <img src="${file.fileData}" alt="${file.name}" class="image-viewer">
                    `;
                } else if (actualFile && actualFile.type.startsWith('image/')) {
                    // Load image from file object
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        container.innerHTML = `
                            <img src="${e.target.result}" alt="${file.name}" class="image-viewer">
                        `;
                    };
                    reader.readAsDataURL(actualFile);
                } else if (file.fileData && (file.mimeType && file.mimeType.startsWith('text/') || fileName.match(/\.(txt|md|json|xml|csv|log)$/))) {
                    // Load text from stored file data
                    try {
                        // Convert base64 to text
                        const base64Data = file.fileData.split(',')[1];
                        const textContent = atob(base64Data);
                        container.innerHTML = `
                            <textarea class="text-viewer" readonly>${textContent}</textarea>
                        `;
                    } catch (error) {
                        console.error('Error loading text content:', error);
                        this.showUnsupportedViewer(container, fileType);
                    }
                } else if (actualFile && actualFile.type.startsWith('text/')) {
                    // Load text file from actual file
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        container.innerHTML = `
                            <textarea class="text-viewer" readonly>${e.target.result}</textarea>
                        `;
                    };
                    reader.readAsText(actualFile);
                } else if (actualFile && fileName.match(/\.(txt|md|json|xml|csv|log)$/)) {
                    // Load text-based files from actual file
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        container.innerHTML = `
                            <textarea class="text-viewer" readonly>${e.target.result}</textarea>
                        `;
                    };
                    reader.readAsText(actualFile);
                } else if (file.fileData && (file.mimeType === 'application/pdf' || fileName.endsWith('.pdf'))) {
                    // Display PDF from stored data
                    container.innerHTML = `
                        <object data="${file.fileData}" type="application/pdf" class="document-viewer">
                            <div class="unsupported-viewer">
                                <div class="unsupported-icon">📄</div>
                                <div class="unsupported-text">PDF Preview Not Available</div>
                                <div class="unsupported-subtext">Your browser doesn't support PDF preview</div>
                                <button class="download-suggestion" onclick="dashboard.downloadCurrentFile()">
                                    Download to View
                                </button>
                            </div>
                        </object>
                    `;
                } else if (actualFile && actualFile.type === 'application/pdf') {
                    // Display PDF using object tag from actual file
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        container.innerHTML = `
                            <object data="${e.target.result}" type="application/pdf" class="document-viewer">
                                <div class="unsupported-viewer">
                                    <div class="unsupported-icon">📄</div>
                                    <div class="unsupported-text">PDF Preview Not Available</div>
                                    <div class="unsupported-subtext">Your browser doesn't support PDF preview</div>
                                    <button class="download-suggestion" onclick="dashboard.downloadCurrentFile()">
                                        Download to View
                                    </button>
                                </div>
                            </object>
                        `;
                    };
                    reader.readAsDataURL(actualFile);
                } else {
                    // Unsupported file type
                    this.showUnsupportedViewer(container, fileType);
                }
            }

            showUnsupportedViewer(container, fileType) {
                const icon = this.getFileIcon(fileType);
                container.innerHTML = `
                    <div class="unsupported-viewer">
                        <div class="unsupported-icon">${icon}</div>
                        <div class="unsupported-text">Preview Not Available</div>
                        <div class="unsupported-subtext">This file type cannot be previewed in the browser</div>
                        <button class="download-suggestion" onclick="dashboard.downloadCurrentFile()">
                            Download File
                        </button>
                    </div>
                `;
            }

            closeFileViewer() {
                const modal = document.getElementById('fileViewerModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                this.currentViewingFile = null;
            }

            downloadFile(fileId, isFromHistory = false) {
                let file;
                
                if (isFromHistory) {
                    const history = this.loadHistoryFromStorage();
                    file = history.find(f => f.id == fileId);
                } else {
                    file = this.files.find(f => f.id == fileId);
                }
                
                if (!file) {
                    this.showToast('File not found', 'error');
                    return;
                }

                this.downloadFileContent(file);
            }

            downloadCurrentFile() {
                if (this.currentViewingFile) {
                    this.downloadFileContent(this.currentViewingFile);
                }
            }

            downloadFileContent(file) {
                // For current uploads, we have the actual file object
                const actualFile = this.files.find(f => f.id === file.id)?.file;
                
                if (actualFile) {
                    // Download the actual file
                    const url = URL.createObjectURL(actualFile);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    this.showToast(`Downloading ${file.name}`, 'success');
                } else if (file.fileData) {
                    // Download from stored base64 data (for history files)
                    const a = document.createElement('a');
                    a.href = file.fileData;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    this.showToast(`Downloading ${file.name}`, 'success');
                } else if (file.preview && (file.type === 'Image' || file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/))) {
                    // Download image from preview data
                    const a = document.createElement('a');
                    a.href = file.preview;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    this.showToast(`Downloading ${file.name}`, 'success');
                } else {
                    // File data not available for download
                    this.showToast('File data is no longer available for download (file may have been too large to store)', 'error');
                }
            }
        }

        // Initialize the dashboard
        const dashboard = new FileUploadDashboard();
    (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97cc90b5637dcd86',t:'MTc1NzQ4MjU2MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();