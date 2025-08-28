
        let celebrationCount = 0;
        let isDark = false;

        // Typewriter effect for "Happy Birthday"
        function typeWriter() {
            const text = "Happy Birthday";
            const mainTextElement = document.getElementById('main-text');
            mainTextElement.innerHTML = '';
            
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = text[i] === ' ' ? '\u00A0' : text[i]; // Non-breaking space
                span.style.animationDelay = (i * 0.1) + 's';
                mainTextElement.appendChild(span);
            }
        }

        // Theme toggle function
        function toggleTheme() {
            isDark = !isDark;
            document.body.classList.toggle('dark', isDark);
            document.querySelector('.theme-toggle').textContent = isDark ? '☀️' : '🌙';
        }

        function celebrate() {
            celebrationCount++;
            
            // Add celebration animation to card
            const card = document.querySelector('.card');
            card.classList.add('celebrating');
            setTimeout(() => card.classList.remove('celebrating'), 600);

            // Create confetti
            createConfetti();
            
            // Create balloons every 3rd click
            if (celebrationCount % 3 === 0) {
                createBalloons();
            }

            // Update click hint after first celebration
            if (celebrationCount === 1) {
                document.querySelector('.click-hint').textContent = 'Keep clicking for more surprises! 🎈';
            }
        }

        function createConfetti() {
            const colors = ['#FF69B4', '#4A90E2', '#FFD700', '#87CEEB', '#FF4500', '#98FB98'];
            
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                    confetti.style.animationDelay = Math.random() * 0.5 + 's';
                    
                    document.body.appendChild(confetti);
                    confetti.classList.add('active');
                    
                    setTimeout(() => confetti.remove(), 3000);
                }, i * 20);
            }
        }

        function createBalloons() {
            const balloonColors = ['#FF69B4', '#4A90E2', '#FFD700', '#87CEEB', '#98FB98'];
            
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const balloon = document.createElement('div');
                    balloon.className = 'balloon';
                    balloon.style.left = (20 + i * 15) + '%';
                    
                    const color = balloonColors[i];
                    balloon.innerHTML = `
                        <svg width="40" height="60" viewBox="0 0 40 60">
                            <ellipse cx="20" cy="20" rx="15" ry="20" fill="${color}" stroke="#fff" stroke-width="2"/>
                            <line x1="20" y1="40" x2="20" y2="55" stroke="#333" stroke-width="1"/>
                            <polygon points="18,55 22,55 20,58" fill="#333"/>
                        </svg>
                    `;
                    
                    document.body.appendChild(balloon);
                    balloon.classList.add('active');
                    
                    setTimeout(() => balloon.remove(), 4000);
                }, i * 200);
            }
        }

        // Initialize page
        window.addEventListener('load', () => {
            // Start typewriter effect
            setTimeout(typeWriter, 500);
            
            // Add some sparkle on page load
            setTimeout(() => {
                for (let i = 0; i < 20; i++) {
                    setTimeout(() => {
                        const sparkle = document.createElement('div');
                        sparkle.className = 'confetti';
                        sparkle.style.left = Math.random() * 100 + 'vw';
                        sparkle.style.backgroundColor = '#FFD700';
                        sparkle.style.borderRadius = '50%';
                        sparkle.style.width = '6px';
                        sparkle.style.height = '6px';
                        
                        document.body.appendChild(sparkle);
                        sparkle.classList.add('active');
                        
                        setTimeout(() => sparkle.remove(), 3000);
                    }, i * 100);
                }
            }, 2000);
        });
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'973659d91359ef03',t:'MTc1NTkwNzQ0OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();