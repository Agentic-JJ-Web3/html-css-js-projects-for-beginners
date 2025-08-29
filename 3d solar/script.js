
        for(let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'stars';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(star);
        }

         
        // Available celestial bodies with detailed information
        const availableBodies = {
            sun: {
                name: "Sun", radius: 30, color: "#FFD700", x: 0, y: 0,
                mass: "1.989 × 10³⁰ kg", type: "Star",
                info: "The Sun contains 99.86% of the Solar System's mass and generates energy through nuclear fusion.",
                facts: ["Surface temperature: 5,778 K (5,505°C)", "Core temperature: 15 million°C", "Age: 4.6 billion years", "Rotates once every 25-35 days"],
                default: true
            },
            mercury: {
                name: "Mercury", radius: 4, color: "#8C7853", orbitRadius: 80, orbitSpeed: 0.04, angle: 0,
                mass: "3.301 × 10²³ kg", type: "Rocky Planet",
                info: "The smallest planet and closest to the Sun, with extreme temperature variations.",
                facts: ["Distance from Sun: 57.9 million km", "Orbital period: 88 Earth days", "Day length: 59 Earth days", "No atmosphere or moons"]
            },
            venus: {
                name: "Venus", radius: 7, color: "#FFC649", orbitRadius: 110, orbitSpeed: 0.025, angle: Math.PI/3,
                mass: "4.867 × 10²⁴ kg", type: "Rocky Planet",
                info: "The hottest planet due to its thick atmosphere and greenhouse effect.",
                facts: ["Distance from Sun: 108.2 million km", "Orbital period: 225 Earth days", "Rotates backwards", "Surface temperature: 462°C"]
            },
            earth: {
                name: "Earth", radius: 8, color: "#4A90E2", orbitRadius: 150, orbitSpeed: 0.02, angle: 0,
                mass: "5.972 × 10²⁴ kg", type: "Rocky Planet",
                info: "Our home planet, the only known celestial body to harbor life.",
                facts: ["Distance from Sun: 149.6 million km", "Orbital period: 365.25 days", "Rotational period: 23h 56m 4s", "Atmosphere: 78% N₂, 21% O₂"],
                default: true
            },
            moon: {
                name: "Moon", radius: 3, color: "#C0C0C0", orbitRadius: 25, orbitSpeed: 0.15, angle: 0, parentBody: 'earth',
                mass: "7.342 × 10²² kg", type: "Natural Satellite",
                info: "Earth's only natural satellite, responsible for tides and stabilizing Earth's axial tilt.",
                facts: ["Distance from Earth: 384,400 km", "Orbital period: 27.3 days", "Same side always faces Earth", "Causes tides through gravity"],
                default: true
            },
            mars: {
                name: "Mars", radius: 6, color: "#CD5C5C", orbitRadius: 220, orbitSpeed: 0.011, angle: Math.PI,
                mass: "6.39 × 10²³ kg", type: "Rocky Planet",
                info: "The Red Planet, target for future human exploration missions.",
                facts: ["Distance from Sun: 227.9 million km", "Orbital period: 687 Earth days", "Day length: 24h 37m", "Has two small moons: Phobos and Deimos"],
                default: true
            },
            jupiter: {
                name: "Jupiter", radius: 20, color: "#D8CA9D", orbitRadius: 350, orbitSpeed: 0.005, angle: Math.PI/2,
                mass: "1.898 × 10²⁷ kg", type: "Gas Giant",
                info: "The largest planet, a gas giant that protects inner planets from asteroids.",
                facts: ["Distance from Sun: 778.5 million km", "Orbital period: 12 Earth years", "Has 95 known moons", "Great Red Spot is a giant storm"]
            },
            saturn: {
                name: "Saturn", radius: 18, color: "#FAD5A5", orbitRadius: 450, orbitSpeed: 0.003, angle: Math.PI*1.5,
                mass: "5.683 × 10²⁶ kg", type: "Gas Giant",
                info: "Famous for its prominent ring system made of ice and rock particles.",
                facts: ["Distance from Sun: 1.43 billion km", "Orbital period: 29 Earth years", "Has 146 known moons", "Less dense than water"]
            },
            uranus: {
                name: "Uranus", radius: 12, color: "#4FD0E7", orbitRadius: 550, orbitSpeed: 0.002, angle: 0,
                mass: "8.681 × 10²⁵ kg", type: "Ice Giant",
                info: "An ice giant that rotates on its side, likely due to an ancient collision.",
                facts: ["Distance from Sun: 2.87 billion km", "Orbital period: 84 Earth years", "Rotates on its side", "Has faint rings"]
            },
            neptune: {
                name: "Neptune", radius: 11, color: "#4B70DD", orbitRadius: 650, orbitSpeed: 0.001, angle: Math.PI/4,
                mass: "1.024 × 10²⁶ kg", type: "Ice Giant",
                info: "The windiest planet with speeds up to 2,100 km/h, discovered through mathematics.",
                facts: ["Distance from Sun: 4.5 billion km", "Orbital period: 165 Earth years", "Strongest winds in solar system", "Has 16 known moons"]
            }
        };

        // Current selection state
        let selectedBodies = {};

        // Initialize with default selection
        function initializeSelection() {
            Object.keys(availableBodies).forEach(key => {
                selectedBodies[key] = availableBodies[key].default || false;
            });
            updatePlanetGrid();
        }

        // Create planet cards
        function updatePlanetGrid() {
            const grid = document.getElementById('planetGrid');
            grid.innerHTML = '';

            Object.entries(availableBodies).forEach(([key, body]) => {
                const card = document.createElement('div');
                card.className = `planet-card ${selectedBodies[key] ? 'selected' : 'removed'}`;
                card.onclick = () => toggleBody(key);

                const visual = document.createElement('div');
                visual.className = 'planet-visual';
                visual.style.background = `radial-gradient(circle at 30% 30%, ${body.color}, ${body.color}88)`;
                visual.style.boxShadow = `0 0 15px ${body.color}66`;

                const badge = document.createElement('div');
                badge.className = `status-badge ${selectedBodies[key] ? 'status-included' : 'status-removed'}`;
                badge.textContent = selectedBodies[key] ? 'INCLUDED' : 'REMOVED';

                card.innerHTML = `
                    <h3>${body.name}</h3>
                    <p><strong>Type:</strong> ${body.type}</p>
                    <p><strong>Mass:</strong> ${body.mass}</p>
                    <p style="margin-top: 10px; font-size: 0.8rem;">${body.info}</p>
                `;

                card.insertBefore(visual, card.firstChild);
                card.appendChild(badge);
                grid.appendChild(card);
            });
        }

        // Toggle body selection
        function toggleBody(key) {
            selectedBodies[key] = !selectedBodies[key];
            updatePlanetGrid();
        }

        // Control functions
        function selectAll() {
            Object.keys(selectedBodies).forEach(key => {
                selectedBodies[key] = true;
            });
            updatePlanetGrid();
        }

        function clearAll() {
            Object.keys(selectedBodies).forEach(key => {
                selectedBodies[key] = false;
            });
            updatePlanetGrid();
        }

        function resetToDefault() {
            Object.keys(availableBodies).forEach(key => {
                selectedBodies[key] = availableBodies[key].default || false;
            });
            updatePlanetGrid();
        }

        // Start the game
        function startExploration() {
            // Ensure at least the Sun is selected
            if (!selectedBodies.sun) {
                selectedBodies.sun = true;
            }

            document.getElementById('homepage').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            initializeGame();
        }

        function returnToHomepage() {
            document.getElementById('gameContainer').style.display = 'none';
            document.getElementById('homepage').style.display = 'block';
        }

        // Game variables
        let gameState = {
            camera: { x: 0, y: 0, zoom: 0.3 },
            time: 0,
            speed: 1,
            paused: false,
            showOrbits: false,
            showDistances: false,
            showPhysics: false,
            selectedBody: null,
            isDragging: false,
            lastMouse: { x: 0, y: 0 }
        };

        let celestialBodies = {};
        let canvas, ctx;

        // Initialize the game with selected bodies
        function initializeGame() {
            // Filter celestial bodies based on selection
            celestialBodies = {};
            Object.entries(availableBodies).forEach(([key, body]) => {
                if (selectedBodies[key]) {
                    celestialBodies[key] = { ...body };
                    // Set initial positions
                    if (body.orbitRadius) {
                        celestialBodies[key].x = Math.cos(body.angle) * body.orbitRadius;
                        celestialBodies[key].y = Math.sin(body.angle) * body.orbitRadius;
                    }
                }
            });

            // Update navigation buttons
            updateNavigationButtons();

            // Setup canvas
            canvas = document.getElementById('spaceCanvas');
            ctx = canvas.getContext('2d');
            resizeCanvas();
            
            // Add event listeners
            setupEventListeners();
            
            // Start game loop
            gameLoop();
        }

        function updateNavigationButtons() {
            const container = document.getElementById('navigationButtons');
            container.innerHTML = '';
            
            // Add reset button
            const resetBtn = document.createElement('button');
            resetBtn.className = 'button';
            resetBtn.textContent = 'Reset View';
            resetBtn.onclick = resetView;
            container.appendChild(resetBtn);

            // Add focus buttons for each selected body
            Object.keys(celestialBodies).forEach(key => {
                const btn = document.createElement('button');
                btn.className = 'button';
                btn.textContent = `Focus ${celestialBodies[key].name}`;
                btn.onclick = () => focusOnBody(key);
                container.appendChild(btn);
            });
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function setupEventListeners() {
            window.addEventListener('resize', resizeCanvas);

            canvas.addEventListener('mousedown', (e) => {
                gameState.isDragging = true;
                gameState.lastMouse = { x: e.clientX, y: e.clientY };
            });

            canvas.addEventListener('mousemove', (e) => {
                if (gameState.isDragging) {
                    const dx = e.clientX - gameState.lastMouse.x;
                    const dy = e.clientY - gameState.lastMouse.y;
                    gameState.camera.x += dx / gameState.camera.zoom;
                    gameState.camera.y += dy / gameState.camera.zoom;
                    gameState.lastMouse = { x: e.clientX, y: e.clientY };
                }
            });

            canvas.addEventListener('mouseup', () => {
                gameState.isDragging = false;
            });

            canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                gameState.camera.zoom = Math.max(0.05, Math.min(5, gameState.camera.zoom * zoomFactor));
                document.getElementById('zoomSlider').value = gameState.camera.zoom;
                document.getElementById('zoomValue').textContent = gameState.camera.zoom.toFixed(2) + 'x';
            });

            canvas.addEventListener('click', (e) => {
                if (!gameState.isDragging) {
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = (e.clientX - rect.left - canvas.width/2 + gameState.camera.x) / gameState.camera.zoom;
                    const mouseY = (e.clientY - rect.top - canvas.height/2 + gameState.camera.y) / gameState.camera.zoom;
                    
                    for (const [key, body] of Object.entries(celestialBodies)) {
                        const distance = Math.sqrt((mouseX - body.x) ** 2 + (mouseY - body.y) ** 2);
                        if (distance <= body.radius) {
                            selectBody(key);
                            break;
                        }
                    }
                }
            });
        }

        // Game functions
        function updatePositions() {
            if (gameState.paused) return;
            
            gameState.time += gameState.speed;
            
            Object.entries(celestialBodies).forEach(([key, body]) => {
                if (body.orbitRadius && body.orbitSpeed) {
                    if (body.parentBody && celestialBodies[body.parentBody]) {
                        // Satellite orbiting another body
                        const parent = celestialBodies[body.parentBody];
                        body.angle += body.orbitSpeed * gameState.speed;
                        body.x = parent.x + Math.cos(body.angle) * body.orbitRadius;
                        body.y = parent.y + Math.sin(body.angle) * body.orbitRadius;
                    } else {
                        // Planet orbiting the sun
                        body.angle += body.orbitSpeed * gameState.speed;
                        body.x = Math.cos(body.angle) * body.orbitRadius;
                        body.y = Math.sin(body.angle) * body.orbitRadius;
                    }
                }
            });
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.save();
            ctx.translate(canvas.width/2 - gameState.camera.x, canvas.height/2 - gameState.camera.y);
            ctx.scale(gameState.camera.zoom, gameState.camera.zoom);
            
            // Draw orbit paths
            if (gameState.showOrbits) {
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
                ctx.lineWidth = 1 / gameState.camera.zoom;
                
                Object.values(celestialBodies).forEach(body => {
                    if (body.orbitRadius) {
                        ctx.beginPath();
                        if (body.parentBody && celestialBodies[body.parentBody]) {
                            const parent = celestialBodies[body.parentBody];
                            ctx.arc(parent.x, parent.y, body.orbitRadius, 0, Math.PI * 2);
                        } else {
                            ctx.arc(0, 0, body.orbitRadius, 0, Math.PI * 2);
                        }
                        ctx.stroke();
                    }
                });
            }
            
            // Draw distance lines
            if (gameState.showDistances && celestialBodies.sun) {
                ctx.strokeStyle = 'rgba(255, 102, 0, 0.5)';
                ctx.lineWidth = 1 / gameState.camera.zoom;
                
                Object.entries(celestialBodies).forEach(([key, body]) => {
                    if (key !== 'sun' && !body.parentBody) {
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(body.x, body.y);
                        ctx.stroke();
                    }
                });
            }
            
            // Draw celestial bodies
            Object.entries(celestialBodies).forEach(([key, body]) => {
                // Main body
                ctx.fillStyle = body.color;
                ctx.beginPath();
                ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Glow effect
                const gradient = ctx.createRadialGradient(body.x, body.y, body.radius * 0.3, body.x, body.y, body.radius * 1.5);
                gradient.addColorStop(0, body.color + '80');
                gradient.addColorStop(1, body.color + '00');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(body.x, body.y, body.radius * 1.5, 0, Math.PI * 2);
                ctx.fill();
                
                // Highlight selected body
                if (gameState.selectedBody === key) {
                    ctx.strokeStyle = '#00ffff';
                    ctx.lineWidth = 2 / gameState.camera.zoom;
                    ctx.beginPath();
                    ctx.arc(body.x, body.y, body.radius + 5, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Labels
                ctx.fillStyle = 'white';
                ctx.font = `${12 / gameState.camera.zoom}px Orbitron`;
                ctx.textAlign = 'center';
                ctx.fillText(body.name, body.x, body.y + body.radius + 15 / gameState.camera.zoom);
            });
            
            ctx.restore();
        }

        // UI Functions
        function selectBody(bodyKey) {
            gameState.selectedBody = bodyKey;
            const body = celestialBodies[bodyKey];
            
            let infoHTML = `
                <div style="background: rgba(0, 40, 80, 0.8); border-left: 4px solid #00ffff; padding: 10px; margin: 10px 0; border-radius: 5px;">
                    <h3 style="color: #00ffff; margin-bottom: 8px; font-size: 14px;">${body.name}</h3>
                    <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;"><strong>Type:</strong> ${body.type}</p>
                    <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;"><strong>Mass:</strong> ${body.mass}</p>
                    <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">${body.info}</p>
                </div>
                <div style="background: rgba(0, 40, 80, 0.8); border-left: 4px solid #00ffff; padding: 10px; margin: 10px 0; border-radius: 5px;">
                    <h3 style="color: #00ffff; margin-bottom: 8px; font-size: 14px;">Key Facts</h3>
                    ${body.facts.map(fact => `<p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• ${fact}</p>`).join('')}
                </div>
            `;
            
            if (gameState.showPhysics) {
                // Calculate physics data for the selected body
                let physicsData = '';
                if (body.orbitRadius && celestialBodies.sun) {
                    const distanceKm = (body.orbitRadius * 1000000).toLocaleString(); // Convert to km scale
                    const orbitalPeriod = Math.round(2 * Math.PI / body.orbitSpeed);
                    const orbitalVelocity = Math.round(body.orbitRadius * body.orbitSpeed * 10);
                    
                    physicsData = `
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Distance from Sun:</strong> ~${distanceKm} km</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Orbital Period:</strong> ~${orbitalPeriod} simulation days</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Orbital Velocity:</strong> ~${orbitalVelocity} km/s (scaled)</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Current Angle:</strong> ${(body.angle * 180 / Math.PI).toFixed(1)}°</p>
                    `;
                } else if (key === 'sun') {
                    physicsData = `
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Gravitational Influence:</strong> Controls all planetary orbits</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Nuclear Fusion:</strong> Converts 4 million tons of mass to energy per second</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Escape Velocity:</strong> 617.5 km/s</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Surface Gravity:</strong> 274 m/s² (28x Earth's gravity)</p>
                    `;
                }
                
                infoHTML += `
                    <div style="background: rgba(0, 40, 80, 0.8); border-left: 4px solid #00ffff; padding: 10px; margin: 10px 0; border-radius: 5px;">
                        <h3 style="color: #00ffff; margin-bottom: 8px; font-size: 14px;">Physics Data</h3>
                        ${physicsData}
                    </div>
                    <div style="background: rgba(0, 40, 80, 0.8); border-left: 4px solid #00ffff; padding: 10px; margin: 10px 0; border-radius: 5px;">
                        <h3 style="color: #00ffff; margin-bottom: 8px; font-size: 14px;">Physics Concepts</h3>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Orbital Velocity:</strong> Speed needed to maintain orbit</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Gravitational Force:</strong> F = G(m₁m₂)/r²</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Kepler's Laws:</strong> Planetary motion principles</p>
                        <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">• <strong>Tidal Forces:</strong> Gravitational effects on nearby objects</p>
                    </div>
                `;
            }
            
            document.getElementById('infoContent').innerHTML = infoHTML;
        }

        function focusOnBody(bodyKey) {
            const body = celestialBodies[bodyKey];
            gameState.camera.x = -body.x * gameState.camera.zoom;
            gameState.camera.y = -body.y * gameState.camera.zoom;
            selectBody(bodyKey);
        }

        function resetView() {
            gameState.camera.x = 0;
            gameState.camera.y = 0;
            gameState.camera.zoom = 0.3;
            document.getElementById('zoomSlider').value = 0.3;
            document.getElementById('zoomValue').textContent = '0.30x';
            gameState.selectedBody = null;
            document.getElementById('infoContent').innerHTML = `
                <div style="background: rgba(0, 40, 80, 0.8); border-left: 4px solid #00ffff; padding: 10px; margin: 10px 0; border-radius: 5px;">
                    <h3 style="color: #00ffff; margin-bottom: 8px; font-size: 14px;">🌍 Welcome to Solar System Explorer!</h3>
                    <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;">Click and drag to navigate through space. Click on celestial bodies to learn more about them.</p>
                    <p style="font-size: 11px; line-height: 1.4; margin-bottom: 5px;"><strong>Controls:</strong> Mouse to pan, scroll to zoom, buttons for quick navigation.</p>
                </div>
            `;
        }

        function toggleOrbits() {
            gameState.showOrbits = !gameState.showOrbits;
            document.getElementById('orbitsBtn').classList.toggle('active', gameState.showOrbits);
        }

        function toggleDistances() {
            gameState.showDistances = !gameState.showDistances;
            document.getElementById('distanceBtn').classList.toggle('active', gameState.showDistances);
        }

        function togglePhysics() {
            gameState.showPhysics = !gameState.showPhysics;
            document.getElementById('physicsBtn').classList.toggle('active', gameState.showPhysics);
            if (gameState.selectedBody) {
                selectBody(gameState.selectedBody);
            }
        }

        function updateZoom(value) {
            gameState.camera.zoom = parseFloat(value);
            document.getElementById('zoomValue').textContent = parseFloat(value).toFixed(2) + 'x';
        }

        function updateSpeed(value) {
            gameState.speed = parseFloat(value);
        }

        function togglePause() {
            gameState.paused = !gameState.paused;
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                // Enter fullscreen
                const gameContainer = document.getElementById('gameContainer');
                if (gameContainer.requestFullscreen) {
                    gameContainer.requestFullscreen();
                } else if (gameContainer.webkitRequestFullscreen) {
                    gameContainer.webkitRequestFullscreen();
                } else if (gameContainer.msRequestFullscreen) {
                    gameContainer.msRequestFullscreen();
                }
                document.getElementById('fullscreenBtn').innerHTML = '🔲 Exit Fullscreen';
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                document.getElementById('fullscreenBtn').innerHTML = '🔳 Fullscreen';
            }
        }

        // Listen for fullscreen changes to update button text
        document.addEventListener('fullscreenchange', updateFullscreenButton);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
        document.addEventListener('msfullscreenchange', updateFullscreenButton);

        function updateFullscreenButton() {
            const btn = document.getElementById('fullscreenBtn');
            if (btn) {
                if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                    btn.innerHTML = '🔲 Exit Fullscreen';
                } else {
                    btn.innerHTML = '🔳 Fullscreen';
                }
            }
            // Resize canvas when entering/exiting fullscreen
            setTimeout(resizeCanvas, 100);
        }

        // Game loop
        function gameLoop() {
            if (document.getElementById('gameContainer').style.display !== 'none') {
                updatePositions();
                render();
            }
            requestAnimationFrame(gameLoop);
        }

        // Add button styles
        const style = document.createElement('style');
        style.textContent = `
            .button {
                background: linear-gradient(45deg, #0066cc, #00aaff);
                border: none;
                color: white;
                padding: 8px 15px;
                margin: 2px;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                font-size: 11px;
                transition: all 0.3s;
            }
            
            .button:hover {
                background: linear-gradient(45deg, #0088ff, #00ccff);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 136, 255, 0.3);
            }
            
            .button.active {
                background: linear-gradient(45deg, #ff6600, #ff9900);
            }
        `;
        document.head.appendChild(style);

        // Initialize the homepage
        initializeSelection();
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97362df456efdff7',t:'MTc1NTkwNTY1Mi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
    