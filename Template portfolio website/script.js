            // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = mobileMenuBtn.querySelector('.hamburger-icon');
        let isMenuOpen = false;
        
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // Open menu
                hamburgerIcon.classList.add('hamburger-active');
                mobileMenu.classList.remove('mobile-menu-hidden');
                mobileMenu.classList.add('mobile-menu-visible');
            } else {
                // Close menu
                hamburgerIcon.classList.remove('hamburger-active');
                mobileMenu.classList.remove('mobile-menu-visible');
                mobileMenu.classList.add('mobile-menu-hidden');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    if (isMenuOpen) {
                        isMenuOpen = false;
                        hamburgerIcon.classList.remove('hamburger-active');
                        mobileMenu.classList.remove('mobile-menu-visible');
                        mobileMenu.classList.add('mobile-menu-hidden');
                    }
                }
            });
        });

        // Typing animation
        const typingText = document.getElementById('typing-text');
        const typingTextDesktop = document.getElementById('typing-text-desktop');
        const texts = ['Full Stack Developer', 'Problem Solver', 'Creative Thinker', 'Code Enthusiast'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                if (typingText) typingText.textContent = currentText.substring(0, charIndex - 1);
                if (typingTextDesktop) typingTextDesktop.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                if (typingText) typingText.textContent = currentText.substring(0, charIndex + 1);
                if (typingTextDesktop) typingTextDesktop.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }

            setTimeout(typeWriter, isDeleting ? 50 : 100);
        }

        typeWriter();

        // Contact form handling
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const messageDiv = document.getElementById('form-message');
            messageDiv.className = 'mt-4 text-center p-4 bg-green-100 text-green-700 rounded-lg';
            messageDiv.textContent = 'Thank you for your message! I\'ll get back to you soon.';
            messageDiv.classList.remove('hidden');
            this.reset();
            
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        });

        // Animate skill bars on scroll
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-bar');
                    skillBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 200);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('#skills .card-hover').forEach(card => {
            observer.observe(card);
        });

        // Dark mode toggle functionality
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const body = document.body;

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        if (currentTheme === 'dark') {
            body.classList.add('dark');
            themeIcon.className = 'fas fa-moon text-blue-400 text-lg';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            
            if (body.classList.contains('dark')) {
                themeIcon.className = 'fas fa-moon text-blue-400 text-lg';
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.className = 'fas fa-sun text-yellow-500 text-lg';
                localStorage.setItem('theme', 'light');
            }
        });

        // Navigation hover effects
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.color = 'var(--primary)';
                this.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.color = 'var(--text-secondary)';
                this.style.transform = 'translateY(0)';
            });
        });

        // Mobile menu hover effects
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.background = 'var(--bg-secondary)';
                this.style.color = 'var(--primary)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
                this.style.color = 'var(--text-secondary)';
            });
        });

        // Scroll reveal animation
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97b0f0c8e4d6c4f0',t:'MTc1NzE5Mjg5NS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();