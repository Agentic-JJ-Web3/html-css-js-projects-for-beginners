 
        // Player state
        let isPlaying = false;
        let currentProgress = 35; // Starting at 35%

        // Get elements
        const playPauseBtn = document.getElementById('playPauseBtn');
        const waveform = document.getElementById('waveform');
        const progressFill = document.getElementById('progressFill');
        const progressBar = document.getElementById('progressBar');
        const currentTimeEl = document.getElementById('currentTime');

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playPauseBtn.textContent = '⏸️';
                waveform.classList.remove('paused');
                startProgressAnimation();
            } else {
                playPauseBtn.textContent = '▶️';
                waveform.classList.add('paused');
                stopProgressAnimation();
            }
        });

        // Progress bar interaction
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newProgress = (clickX / rect.width) * 100;
            
            currentProgress = Math.max(0, Math.min(100, newProgress));
            progressFill.style.width = currentProgress + '%';
            
            // Update time display based on progress
            const totalSeconds = 225; // 3:45 in seconds
            const currentSeconds = Math.floor((currentProgress / 100) * totalSeconds);
            const minutes = Math.floor(currentSeconds / 60);
            const seconds = currentSeconds % 60;
            currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        });

        // Progress animation
        let progressInterval;

        function startProgressAnimation() {
            progressInterval = setInterval(() => {
                if (currentProgress < 100) {
                    currentProgress += 0.2; // Slow progress increment
                    progressFill.style.width = currentProgress + '%';
                    
                    // Update time display
                    const totalSeconds = 225; // 3:45 in seconds
                    const currentSeconds = Math.floor((currentProgress / 100) * totalSeconds);
                    const minutes = Math.floor(currentSeconds / 60);
                    const seconds = currentSeconds % 60;
                    currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    // Song ended
                    isPlaying = false;
                    playPauseBtn.textContent = '▶️';
                    waveform.classList.add('paused');
                    stopProgressAnimation();
                    currentProgress = 0;
                    progressFill.style.width = '0%';
                    currentTimeEl.textContent = '0:00';
                }
            }, 100);
        }

        function stopProgressAnimation() {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        }

        // Previous/Next button hover effects (non-functional as requested)
        document.getElementById('prevBtn').addEventListener('click', () => {
            // Visual feedback only - button animation handled by CSS
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            // Visual feedback only - button animation handled by CSS
        });
    (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97820c9290650014',t:'MTc1NjcwMTIwMi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();