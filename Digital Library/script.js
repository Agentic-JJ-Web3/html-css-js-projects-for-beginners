
        // Sample book data - realistic library collection with Unsplash images
        const booksData = [
            {
                id: 1,
                title: "The Midnight Library",
                author: "Matt Haig",
                genre: "Fiction",
                year: 2020,
                status: "available",
                description: "A magical story about life's infinite possibilities and the choices we make.",
                cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&auto=format",
                fallback: "📖"
            },
            {
                id: 2,
                title: "Dune",
                author: "Frank Herbert",
                genre: "Science Fiction",
                year: 1965,
                status: "borrowed",
                description: "Epic tale of politics, religion, and ecology on the desert planet Arrakis.",
                cover: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=400&fit=crop&auto=format",
                fallback: "🏜️"
            },
            {
                id: 3,
                title: "The Seven Husbands of Evelyn Hugo",
                author: "Taylor Jenkins Reid",
                genre: "Romance",
                year: 2017,
                status: "available",
                description: "A reclusive Hollywood icon reveals her secrets to an unknown journalist.",
                cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&auto=format",
                fallback: "💫"
            },
            {
                id: 4,
                title: "Educated",
                author: "Tara Westover",
                genre: "Biography",
                year: 2018,
                status: "available",
                description: "A memoir about education, family, and the struggle for self-invention.",
                cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format",
                fallback: "🎓"
            },
            {
                id: 5,
                title: "The Silent Patient",
                author: "Alex Michaelides",
                genre: "Mystery",
                year: 2019,
                status: "borrowed",
                description: "A woman refuses to speak after allegedly murdering her husband.",
                cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format",
                fallback: "🤐"
            },
            {
                id: 6,
                title: "Circe",
                author: "Madeline Miller",
                genre: "Fantasy",
                year: 2018,
                status: "available",
                description: "The story of the Greek goddess who transforms from nymph to witch.",
                cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop&auto=format",
                fallback: "🌙"
            },
            {
                id: 7,
                title: "Atomic Habits",
                author: "James Clear",
                genre: "Non-Fiction",
                year: 2018,
                status: "available",
                description: "Practical strategies for forming good habits and breaking bad ones.",
                cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop&auto=format",
                fallback: "⚛️"
            },
            {
                id: 8,
                title: "The Thursday Murder Club",
                author: "Richard Osman",
                genre: "Mystery",
                year: 2020,
                status: "available",
                description: "Four retirees meet weekly to investigate cold cases.",
                cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format",
                fallback: "🔍"
            },
            {
                id: 9,
                title: "Project Hail Mary",
                author: "Andy Weir",
                genre: "Science Fiction",
                year: 2021,
                status: "borrowed",
                description: "A lone astronaut must save humanity from extinction.",
                cover: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=400&fit=crop&auto=format",
                fallback: "🚀"
            },
            {
                id: 10,
                title: "The Invisible Life of Addie LaRue",
                author: "V.E. Schwab",
                genre: "Fantasy",
                year: 2020,
                status: "available",
                description: "A young woman makes a Faustian bargain for immortality.",
                cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop&auto=format",
                fallback: "✨"
            },
            {
                id: 11,
                title: "Where the Crawdads Sing",
                author: "Delia Owens",
                genre: "Fiction",
                year: 2018,
                status: "available",
                description: "A mystery set in the marshlands of North Carolina.",
                cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&auto=format",
                fallback: "🦢"
            },
            {
                id: 12,
                title: "Becoming",
                author: "Michelle Obama",
                genre: "Biography",
                year: 2018,
                status: "borrowed",
                description: "The former First Lady's deeply personal memoir.",
                cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&auto=format",
                fallback: "👑"
            }
        ];

        // DOM elements
        let searchInput, genreFilter, yearFilter, availableFilter, borrowedFilter, clearFiltersBtn, booksGrid, sidebarToggle, sidebar;
        let filteredBooks = [...booksData];

        // Door opening animation
        function enterLibrary() {
            const doorContainer = document.getElementById('doorContainer');
            const homepage = document.getElementById('homepage');
            const libraryContainer = document.getElementById('libraryContainer');

            // Show door
            doorContainer.classList.add('active');
            
            // Start door opening animation
            setTimeout(() => {
                doorContainer.classList.add('opening');
            }, 100);

            // Hide homepage and show library
            setTimeout(() => {
                homepage.style.display = 'none';
                libraryContainer.classList.add('active');
                initLibrary();
            }, 1600);

            // Hide door
            setTimeout(() => {
                doorContainer.classList.remove('active');
                doorContainer.classList.remove('opening');
            }, 2500);
        }

        // Initialize library functionality
        function initLibrary() {
            // Get DOM elements
            searchInput = document.getElementById('searchInput');
            genreFilter = document.getElementById('genreFilter');
            yearFilter = document.getElementById('yearFilter');
            availableFilter = document.getElementById('availableFilter');
            borrowedFilter = document.getElementById('borrowedFilter');
            clearFiltersBtn = document.getElementById('clearFilters');
            booksGrid = document.getElementById('booksGrid');
            sidebarToggle = document.getElementById('sidebarToggle');
            sidebar = document.getElementById('sidebar');

            displayBooks(booksData);
            setupEventListeners();
            loadTheme(); // Load saved theme
        }

        // Set up all event listeners
        function setupEventListeners() {
            searchInput.addEventListener('input', handleSearch);
            genreFilter.addEventListener('change', applyFilters);
            yearFilter.addEventListener('change', applyFilters);
            availableFilter.addEventListener('change', applyFilters);
            borrowedFilter.addEventListener('change', applyFilters);
            clearFiltersBtn.addEventListener('click', clearAllFilters);
            sidebarToggle.addEventListener('click', toggleSidebar);
        }

        // Display books in the grid
        function displayBooks(books) {
            if (books.length === 0) {
                booksGrid.innerHTML = `
                    <div class="no-results">
                        <h3>📚 No books found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                `;
                return;
            }

            booksGrid.innerHTML = books.map(book => `
                <div class="book-card">
                    <div class="book-cover">
                        <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="book-cover-fallback" style="display: none;">${book.fallback}</div>
                    </div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <div class="book-author">by ${book.author}</div>
                        <div class="book-description">${book.description}</div>
                        <div class="book-meta">
                            <span class="book-genre">${book.genre}</span>
                            <span class="book-status ${book.status}">${book.status}</span>
                        </div>
                        <div class="book-actions">
                            ${book.status === 'available' ? 
                                `<button class="btn btn-primary" onclick="borrowBook(${book.id})">📚 Borrow</button>
                                 <button class="btn btn-secondary" onclick="readBook(${book.id})">👁️ Read</button>` :
                                `<button class="btn" disabled>📚 Borrowed</button>
                                 <button class="btn btn-secondary" onclick="readBook(${book.id})">👁️ Read</button>`
                            }
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Handle search functionality
        function handleSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                applyFilters();
                return;
            }

            const searchResults = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm)
            );

            displayBooks(searchResults);
        }

        // Apply all active filters
        function applyFilters() {
            let filtered = [...booksData];

            // Genre filter
            const selectedGenre = genreFilter.value;
            if (selectedGenre) {
                filtered = filtered.filter(book => book.genre === selectedGenre);
            }

            // Year filter
            const selectedYear = yearFilter.value;
            if (selectedYear) {
                filtered = filtered.filter(book => {
                    const bookYear = book.year;
                    switch (selectedYear) {
                        case '2020s': return bookYear >= 2020;
                        case '2010s': return bookYear >= 2010 && bookYear < 2020;
                        case '2000s': return bookYear >= 2000 && bookYear < 2010;
                        case '1990s': return bookYear >= 1990 && bookYear < 2000;
                        case 'Classic': return bookYear < 1990;
                        default: return true;
                    }
                });
            }

            // Availability filters
            const showAvailable = availableFilter.checked;
            const showBorrowed = borrowedFilter.checked;
            
            if (showAvailable && !showBorrowed) {
                filtered = filtered.filter(book => book.status === 'available');
            } else if (showBorrowed && !showAvailable) {
                filtered = filtered.filter(book => book.status === 'borrowed');
            }

            filteredBooks = filtered;
            
            // Apply search to filtered results
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm) {
                filtered = filtered.filter(book => 
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm)
                );
            }

            displayBooks(filtered);
        }

        // Clear all filters and search
        function clearAllFilters() {
            searchInput.value = '';
            genreFilter.value = '';
            yearFilter.value = '';
            availableFilter.checked = false;
            borrowedFilter.checked = false;
            
            filteredBooks = [...booksData];
            displayBooks(booksData);
        }

        // Toggle sidebar on mobile
        function toggleSidebar() {
            sidebar.classList.toggle('active');
        }

        // Handle window resize for responsive behavior
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (sidebar) sidebar.classList.remove('active');
            }
        });

        // Book action functions
        function borrowBook(bookId) {
            const book = booksData.find(b => b.id === bookId);
            if (book && book.status === 'available') {
                book.status = 'borrowed';
                
                // Show success message
                showNotification(`📚 "${book.title}" has been borrowed successfully!`, 'success');
                
                // Refresh the display
                applyFilters();
            }
        }

        function readBook(bookId) {
            const book = booksData.find(b => b.id === bookId);
            if (book) {
                // Show reading interface (demo)
                showNotification(`👁️ Opening "${book.title}" for reading...`, 'info');
                
                // In a real app, this would open a reading interface
                setTimeout(() => {
                    alert(`📖 Reading "${book.title}" by ${book.author}\n\n${book.description}\n\nThis is a demo - in a real library app, this would open the full book reader!`);
                }, 1000);
            }
        }

        // Theme toggle functionality
        function toggleTheme() {
            const body = document.body;
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle.querySelector('.theme-icon');
            
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                themeIcon.className = 'fas fa-sun theme-icon';
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.className = 'fas fa-moon theme-icon';
                localStorage.setItem('theme', 'light');
            }
        }

        // Load saved theme on page load
        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            const themeToggle = document.getElementById('themeToggle');
            
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                if (themeToggle) {
                    const themeIcon = themeToggle.querySelector('.theme-icon');
                    themeIcon.className = 'fas fa-sun theme-icon';
                }
            }
        }

        // Notification system
        function showNotification(message, type = 'info') {
            // Remove existing notifications
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; margin-left: 10px;">&times;</button>
            `;

            // Add notification styles
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                display: flex;
                align-items: center;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            `;

            // Add animation keyframes
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Auto remove after 4 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 4000);
        }
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9777154b23ea29c1',t:'MTc1NjU4NjIxNi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();