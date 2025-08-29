
        for(let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'stars';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(star);
        }

        
    