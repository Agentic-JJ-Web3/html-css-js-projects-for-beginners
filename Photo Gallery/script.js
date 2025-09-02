 
        // Sample image data with Unsplash URLs
        const images = [
            {
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
                caption: 'Mountain Lake Reflection',
                category: 'nature'
            },
            {
                src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop',
                caption: 'City Skyline at Dusk',
                category: 'city'
            },
            {
                src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=650&fit=crop',
                caption: 'Portrait in Golden Hour',
                category: 'people'
            },
            {
                src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=550&fit=crop',
                caption: 'Ocean Waves',
                category: 'nature'
            },
            {
                src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=700&fit=crop',
                caption: 'Modern Architecture',
                category: 'city'
            },
            {
                src: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=450&fit=crop',
                caption: 'Colorful Abstract',
                category: 'abstract'
            },
            {
                src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
                caption: 'Forest Path',
                category: 'nature'
            },
            {
                src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
                caption: 'Street Photography',
                category: 'people'
            },
            {
                src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=650&fit=crop',
                caption: 'Urban Night Lights',
                category: 'city'
            },
            {
                src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=550&fit=crop',
                caption: 'Geometric Patterns',
                category: 'abstract'
            },
            {
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
                caption: 'Sunset Mountains',
                category: 'nature'
            },
            {
                src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=450&fit=crop',
                caption: 'Candid Moment',
                category: 'people'
            }
        ];

        let currentImageIndex = 0;
        let filteredImages = [...images];

        // DOM elements
        const gallery = document.getElementById('gallery');
        const modal = document.getElementById('modal');
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = document.getElementById('closeBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Initialize gallery
        function initGallery() {
            renderGallery(filteredImages);
            setupEventListeners();
        }

        // Render gallery with lazy loading
        function renderGallery(imagesToRender) {
            gallery.innerHTML = '';
            
            imagesToRender.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.dataset.category = image.category;
                item.style.animationDelay = `${index * 0.1}s`;
                
                item.innerHTML = `
                    <img src="${image.src}" alt="${image.caption}" loading="lazy" onerror="this.src=''; this.alt='Image failed to load'; this.style.display='none';">
                    <div class="overlay">
                        <div class="caption">${image.caption}</div>
                    </div>
                    <div class="category">${image.category}</div>
                `;
                
                // Add click event to open modal
                item.addEventListener('click', () => openModal(index));
                
                gallery.appendChild(item);
            });
        }

        // Filter functionality
        function setupFilterButtons() {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active button
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Filter images
                    const filter = btn.dataset.filter;
                    if (filter === 'all') {
                        filteredImages = [...images];
                    } else {
                        filteredImages = images.filter(img => img.category === filter);
                    }
                    
                    renderGallery(filteredImages);
                });
            });
        }

        // Modal functions
        function openModal(index) {
            currentImageIndex = index;
            const image = filteredImages[currentImageIndex];
            
            modalImage.src = image.src;
            modalCaption.textContent = image.caption;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
            const image = filteredImages[currentImageIndex];
            modalImage.src = image.src;
            modalCaption.textContent = image.caption;
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
            const image = filteredImages[currentImageIndex];
            modalImage.src = image.src;
            modalCaption.textContent = image.caption;
        }

        // Event listeners
        function setupEventListeners() {
            // Modal controls
            closeBtn.addEventListener('click', closeModal);
            prevBtn.addEventListener('click', showPrevImage);
            nextBtn.addEventListener('click', showNextImage);
            
            // Close modal on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!modal.classList.contains('active')) return;
                
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowLeft':
                        showPrevImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            });
            
            // Filter buttons
            setupFilterButtons();
        }

        // Initialize the gallery when page loads
        document.addEventListener('DOMContentLoaded', initGallery);
    