
    
        // Add staggered fade-in animation
        document.addEventListener('DOMContentLoaded', function() {
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.animationDelay = `${index * 0.1}s`;
                    element.classList.add('fade-in');
                }, index * 100);
            });
        });

        // Smooth scroll for navigation
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

        // News API Configuration
        const API_KEY = 'pub_6c3454b336d04db1aae68d20c08b3a02';
        const BASE_URL = 'https://newsdata.io/api/1/latest';
        let currentCategory = 'technology';

        // News fetching function
        async function fetchNews(query = null, category = null) {
            const loadingIndicator = document.getElementById('loadingIndicator');
            const newsGrid = document.getElementById('newsGrid');
            
            try {
                // Show loading indicator
                loadingIndicator.classList.remove('hidden');
                
                // Build URL with parameters
                let url = `${BASE_URL}?apikey=${API_KEY}&language=en&size=10`;
                if (query) {
                    url += `&q=${encodeURIComponent(query)}`;
                } else if (category) {
                    url += `&q=${encodeURIComponent(category)}`;
                }
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.status === 'success' && data.results) {
                    displayNews(data.results);
                } else {
                    throw new Error('No news found');
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                showError('Failed to load news. Please try again later.');
            } finally {
                // Hide loading indicator
                loadingIndicator.classList.add('hidden');
            }
        }

        // Display news function
        function displayNews(articles) {
            const newsGrid = document.getElementById('newsGrid');
            
            if (!articles || articles.length === 0) {
                newsGrid.innerHTML = '<div class="col-span-full text-center text-slate-600 dark:text-gray-400 py-12">No articles found. Try a different search term.</div>';
                return;
            }
            
            newsGrid.innerHTML = articles.slice(0, 6).map((article, index) => {
                const isFeature = index === 0;
                const categoryColors = {
                    'technology': 'from-green-400 to-blue-500',
                    'business': 'from-yellow-400 to-orange-500',
                    'sports': 'from-pink-400 to-red-500',
                    'health': 'from-teal-400 to-blue-500',
                    'science': 'from-indigo-400 to-purple-500',
                    'entertainment': 'from-purple-400 to-pink-500'
                };
                
                const gradientClass = categoryColors[currentCategory] || 'from-blue-500 to-purple-600';
                const colSpan = isFeature ? 'md:col-span-2 lg:col-span-2' : '';
                const imageHeight = isFeature ? 'h-64' : 'h-48';
                const titleSize = isFeature ? 'text-2xl' : 'text-lg';
                
                return `
                    <article class="${colSpan} news-card glass-effect rounded-2xl overflow-hidden shadow-xl fade-in">
                        <div class="${imageHeight} bg-gradient-to-r ${gradientClass} relative">
                            ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}" class="w-full h-full object-cover" onerror="this.style.display='none';">` : ''}
                            <div class="absolute inset-0 bg-black/20"></div>
                            <div class="absolute bottom-4 left-4">
                                <span class="category-tag text-white px-3 py-1 rounded-full text-sm font-medium">
                                    ${article.category ? article.category[0] : currentCategory}
                                </span>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="${titleSize} font-bold text-slate-900 dark:text-gray-100 mb-3 line-clamp-2">
                                ${article.title || 'No title available'}
                            </h3>
                            <p class="text-slate-700 dark:text-gray-300 mb-4 text-sm line-clamp-3">
                                ${article.description || article.content || 'No description available'}
                            </p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-gradient-to-r ${gradientClass} rounded-full"></div>
                                    <div>
                                        <p class="text-sm font-medium text-slate-900 dark:text-gray-200">
                                            ${article.source_id || 'Unknown Source'}
                                        </p>
                                        <p class="text-xs text-slate-600 dark:text-gray-400">
                                            ${article.pubDate ? new Date(article.pubDate).toLocaleDateString() : 'Unknown date'}
                                        </p>
                                    </div>
                                </div>
                                <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm">
                                    Read ${isFeature ? 'More' : ''} →
                                </a>
                            </div>
                        </div>
                    </article>
                `;
            }).join('');
        }

        // Show error function
        function showError(message) {
            const newsGrid = document.getElementById('newsGrid');
            newsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="glass-effect rounded-2xl p-8 max-w-md mx-auto">
                        <div class="text-red-500 mb-4">
                            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-2">Oops! Something went wrong</h3>
                        <p class="text-slate-600 dark:text-gray-400">${message}</p>
                    </div>
                </div>
            `;
        }

        // Category button functionality
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update current category and fetch news
                currentCategory = this.dataset.category;
                fetchNews(null, currentCategory);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query) {
                // Remove active class from category buttons when searching
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                fetchNews(query);
            } else {
                fetchNews(null, currentCategory);
            }
        }
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Load initial news on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Load technology news by default
            fetchNews(null, currentCategory);
        });

        // Dark Mode Toggle Functionality
        const themeToggle = document.getElementById('themeToggle');
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');
        const html = document.documentElement;

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Apply the saved theme on page load
        if (currentTheme === 'dark') {
            html.classList.add('dark');
            sunIcon.classList.add('rotate-90', 'scale-0');
            sunIcon.classList.remove('rotate-0', 'scale-100');
            moonIcon.classList.add('rotate-0', 'scale-100');
            moonIcon.classList.remove('rotate-90', 'scale-0');
        }

        // Toggle theme function
        function toggleTheme() {
            const isDark = html.classList.contains('dark');
            
            if (isDark) {
                // Switch to light mode
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                
                // Animate icons
                sunIcon.classList.remove('rotate-90', 'scale-0');
                sunIcon.classList.add('rotate-0', 'scale-100');
                moonIcon.classList.remove('rotate-0', 'scale-100');
                moonIcon.classList.add('rotate-90', 'scale-0');
            } else {
                // Switch to dark mode
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                
                // Animate icons
                sunIcon.classList.add('rotate-90', 'scale-0');
                sunIcon.classList.remove('rotate-0', 'scale-100');
                moonIcon.classList.add('rotate-0', 'scale-100');
                moonIcon.classList.remove('rotate-90', 'scale-0');
            }
        }

        // Add click event listener to toggle button
        themeToggle.addEventListener('click', toggleTheme);

        // Load more functionality
        document.addEventListener('DOMContentLoaded', function() {
            const loadMoreBtn = document.querySelector('button:contains("Load More")') || 
                Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Load More'));
            
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', function() {
                    // Fetch more news with current category or search term
                    const query = searchInput.value.trim();
                    if (query) {
                        fetchNews(query);
                    } else {
                        fetchNews(null, currentCategory);
                    }
                });
            }
        });
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9804095b629d48c7',t:'MTc1ODA2NDIxOS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();