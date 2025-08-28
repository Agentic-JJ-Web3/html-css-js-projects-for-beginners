 
        // Element data with comprehensive information including trend data
        const elements = [
            {
                number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, group: 'nonmetal', icon: 'fas fa-atom',
                facts: 'Most abundant element in the universe. Powers the sun through nuclear fusion.',
                applications: 'Fuel cells, rocket fuel, industrial processes, potential clean energy source.',
                pronunciation: 'HY-druh-jen',
                atomicRadius: 25, ionizationEnergy: 1312, electronegativity: 2.2
            },
            {
                number: 2, symbol: 'He', name: 'Helium', mass: 4.003, group: 'noble-gas', icon: 'fas fa-wind',
                facts: 'Second most abundant element in the universe. Never forms chemical compounds naturally.',
                applications: 'Party balloons, medical imaging (MRI), deep-sea diving, cooling systems.',
                pronunciation: 'HEE-lee-um',
                atomicRadius: 31, ionizationEnergy: 2372, electronegativity: null
            },
            {
                number: 3, symbol: 'Li', name: 'Lithium', mass: 6.941, group: 'alkali-metal', icon: 'fas fa-battery-full',
                facts: 'Lightest metal. Can cut with a knife. Floats on water.',
                applications: 'Rechargeable batteries, mood stabilizing medication, ceramics.',
                pronunciation: 'LITH-ee-um',
                atomicRadius: 145, ionizationEnergy: 520, electronegativity: 0.98
            },
            {
                number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.012, group: 'alkaline-earth', icon: 'fas fa-rocket',
                facts: 'Extremely toxic but incredibly strong. Used in spacecraft.',
                applications: 'Aerospace components, X-ray windows, nuclear reactors.',
                pronunciation: 'buh-RIL-ee-um',
                atomicRadius: 105, ionizationEnergy: 899, electronegativity: 1.57
            },
            {
                number: 5, symbol: 'B', name: 'Boron', mass: 10.811, group: 'metalloid', icon: 'fas fa-seedling',
                facts: 'Essential for plant growth. Makes glass heat-resistant.',
                applications: 'Fiberglass, detergents, agriculture, nuclear control rods.',
                pronunciation: 'BOR-on',
                atomicRadius: 85, ionizationEnergy: 801, electronegativity: 2.04
            },
            {
                number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, group: 'nonmetal', icon: 'fas fa-gem',
                facts: 'Basis of all life on Earth. Forms more compounds than any other element.',
                applications: 'Diamonds, graphite, carbon fiber, all organic compounds.',
                pronunciation: 'KAR-bon',
                atomicRadius: 70, ionizationEnergy: 1086, electronegativity: 2.55
            },
            {
                number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, group: 'nonmetal', icon: 'fas fa-cloud',
                facts: 'Makes up 78% of Earth\'s atmosphere. Essential for proteins.',
                applications: 'Fertilizers, explosives, food preservation, liquid nitrogen cooling.',
                pronunciation: 'NY-truh-jen',
                atomicRadius: 65, ionizationEnergy: 1402, electronegativity: 3.04
            },
            {
                number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, group: 'nonmetal', icon: 'fas fa-lungs',
                facts: 'Essential for combustion and respiration. Most abundant element in Earth\'s crust.',
                applications: 'Breathing, combustion, steel production, medical treatments.',
                pronunciation: 'OK-si-jen',
                atomicRadius: 60, ionizationEnergy: 1314, electronegativity: 3.44
            },
            {
                number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, group: 'halogen', icon: 'fas fa-tooth',
                facts: 'Most reactive element. Can react with almost anything, even noble gases.',
                applications: 'Toothpaste, non-stick coatings, refrigerants, uranium enrichment.',
                pronunciation: 'FLOOR-een',
                atomicRadius: 50, ionizationEnergy: 1681, electronegativity: 3.98
            },
            {
                number: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, group: 'noble-gas', icon: 'fas fa-lightbulb',
                facts: 'Gives off orange-red light when electrified. Very rare on Earth.',
                applications: 'Neon signs, high-voltage indicators, laser technology.',
                pronunciation: 'NEE-on',
                atomicRadius: 38, ionizationEnergy: 2081, electronegativity: null
            },
            {
                number: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, group: 'alkali-metal', icon: 'fas fa-fire',
                facts: 'Explodes in water. Essential for nerve function. Symbol from Latin "natrium".',
                applications: 'Table salt, soap, street lights, nuclear reactors.',
                pronunciation: 'SO-dee-um',
                atomicRadius: 180, ionizationEnergy: 496, electronegativity: 0.93
            },
            {
                number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, group: 'alkaline-earth', icon: 'fas fa-fire-flame-curved',
                facts: 'Burns with brilliant white light. Essential for chlorophyll in plants.',
                applications: 'Fireworks, lightweight alloys, medicine (antacids), photography.',
                pronunciation: 'mag-NEE-zee-um',
                atomicRadius: 150, ionizationEnergy: 738, electronegativity: 1.31
            },
            {
                number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.982, group: 'post-transition', icon: 'fas fa-plane',
                facts: 'Most abundant metal in Earth\'s crust. Never rusts.',
                applications: 'Cans, foil, aircraft, construction, electrical wiring.',
                pronunciation: 'uh-LOO-mi-num',
                atomicRadius: 125, ionizationEnergy: 578, electronegativity: 1.61
            },
            {
                number: 14, symbol: 'Si', name: 'Silicon', mass: 28.086, group: 'metalloid', icon: 'fas fa-microchip',
                facts: 'Second most abundant element in Earth\'s crust. Basis of computer chips.',
                applications: 'Computer processors, glass, solar panels, silicone rubber.',
                pronunciation: 'SIL-i-kon',
                atomicRadius: 110, ionizationEnergy: 787, electronegativity: 1.90
            },
            {
                number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, group: 'nonmetal', icon: 'fas fa-dna',
                facts: 'Glows in the dark. Essential for DNA and bones.',
                applications: 'Matches, fertilizers, detergents, DNA/RNA, bones and teeth.',
                pronunciation: 'FOS-for-us',
                atomicRadius: 100, ionizationEnergy: 1012, electronegativity: 2.19
            },
            {
                number: 16, symbol: 'S', name: 'Sulfur', mass: 32.065, group: 'nonmetal', icon: 'fas fa-volcano',
                facts: 'Smells like rotten eggs. Known since ancient times.',
                applications: 'Gunpowder, rubber vulcanization, medicines, fertilizers.',
                pronunciation: 'SUL-fur',
                atomicRadius: 100, ionizationEnergy: 1000, electronegativity: 2.58
            },
            {
                number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.453, group: 'halogen', icon: 'fas fa-swimming-pool',
                facts: 'Deadly gas that makes swimming pools safe. Greenish-yellow color.',
                applications: 'Water purification, bleach, PVC plastic, disinfectants.',
                pronunciation: 'KLOR-een',
                atomicRadius: 100, ionizationEnergy: 1251, electronegativity: 3.16
            },
            {
                number: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, group: 'noble-gas', icon: 'fas fa-lightbulb',
                facts: 'Makes up 1% of Earth\'s atmosphere. Completely inert.',
                applications: 'Light bulbs, welding, wine preservation, insulation.',
                pronunciation: 'AR-gon',
                atomicRadius: 71, ionizationEnergy: 1521, electronegativity: null
            }
        ];

        // Complete periodic table data with proper positioning
        const periodicTableLayout = {
            // Row 1
            1: { row: 1, col: 1 }, // H
            2: { row: 1, col: 18 }, // He
            
            // Row 2
            3: { row: 2, col: 1 }, // Li
            4: { row: 2, col: 2 }, // Be
            5: { row: 2, col: 13 }, // B
            6: { row: 2, col: 14 }, // C
            7: { row: 2, col: 15 }, // N
            8: { row: 2, col: 16 }, // O
            9: { row: 2, col: 17 }, // F
            10: { row: 2, col: 18 }, // Ne
            
            // Row 3
            11: { row: 3, col: 1 }, // Na
            12: { row: 3, col: 2 }, // Mg
            13: { row: 3, col: 13 }, // Al
            14: { row: 3, col: 14 }, // Si
            15: { row: 3, col: 15 }, // P
            16: { row: 3, col: 16 }, // S
            17: { row: 3, col: 17 }, // Cl
            18: { row: 3, col: 18 }, // Ar
            
            // Row 4 (adding more elements)
            19: { row: 4, col: 1 }, // K
            20: { row: 4, col: 2 }, // Ca
            21: { row: 4, col: 3 }, // Sc
            22: { row: 4, col: 4 }, // Ti
            23: { row: 4, col: 5 }, // V
            24: { row: 4, col: 6 }, // Cr
            25: { row: 4, col: 7 }, // Mn
            26: { row: 4, col: 8 }, // Fe
            27: { row: 4, col: 9 }, // Co
            28: { row: 4, col: 10 }, // Ni
            29: { row: 4, col: 11 }, // Cu
            30: { row: 4, col: 12 }, // Zn
            31: { row: 4, col: 13 }, // Ga
            32: { row: 4, col: 14 }, // Ge
            33: { row: 4, col: 15 }, // As
            34: { row: 4, col: 16 }, // Se
            35: { row: 4, col: 17 }, // Br
            36: { row: 4, col: 18 }, // Kr
            
            // Row 5 (partial)
            37: { row: 5, col: 1 }, // Rb
            38: { row: 5, col: 2 }, // Sr
            47: { row: 5, col: 11 }, // Ag
            53: { row: 5, col: 17 }, // I
            54: { row: 5, col: 18 }, // Xe
            
            // Row 6 (partial)
            55: { row: 6, col: 1 }, // Cs
            56: { row: 6, col: 2 }, // Ba
            79: { row: 6, col: 11 }, // Au
            82: { row: 6, col: 14 }, // Pb
            85: { row: 6, col: 17 }, // At
            86: { row: 6, col: 18 }, // Rn
        };
        
        // Extended elements with more complete data and trend values
        const allElements = [
            ...elements,
            { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, group: 'alkali-metal', icon: 'fas fa-fire', atomicRadius: 220, ionizationEnergy: 419, electronegativity: 0.82 },
            { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, group: 'alkaline-earth', icon: 'fas fa-bone', atomicRadius: 180, ionizationEnergy: 590, electronegativity: 1.00 },
            { number: 21, symbol: 'Sc', name: 'Scandium', mass: 44.956, group: 'transition-metal', icon: 'fas fa-cog', atomicRadius: 160, ionizationEnergy: 633, electronegativity: 1.36 },
            { number: 22, symbol: 'Ti', name: 'Titanium', mass: 47.867, group: 'transition-metal', icon: 'fas fa-shield-alt', atomicRadius: 140, ionizationEnergy: 658, electronegativity: 1.54 },
            { number: 23, symbol: 'V', name: 'Vanadium', mass: 50.942, group: 'transition-metal', icon: 'fas fa-cog', atomicRadius: 135, ionizationEnergy: 650, electronegativity: 1.63 },
            { number: 24, symbol: 'Cr', name: 'Chromium', mass: 51.996, group: 'transition-metal', icon: 'fas fa-gem', atomicRadius: 140, ionizationEnergy: 653, electronegativity: 1.66 },
            { number: 25, symbol: 'Mn', name: 'Manganese', mass: 54.938, group: 'transition-metal', icon: 'fas fa-cog', atomicRadius: 140, ionizationEnergy: 717, electronegativity: 1.55 },
            { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, group: 'transition-metal', icon: 'fas fa-hammer', atomicRadius: 140, ionizationEnergy: 762, electronegativity: 1.83 },
            { number: 27, symbol: 'Co', name: 'Cobalt', mass: 58.933, group: 'transition-metal', icon: 'fas fa-magnet', atomicRadius: 135, ionizationEnergy: 760, electronegativity: 1.88 },
            { number: 28, symbol: 'Ni', name: 'Nickel', mass: 58.693, group: 'transition-metal', icon: 'fas fa-coins', atomicRadius: 135, ionizationEnergy: 737, electronegativity: 1.91 },
            { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, group: 'transition-metal', icon: 'fas fa-bolt', atomicRadius: 135, ionizationEnergy: 745, electronegativity: 1.90 },
            { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, group: 'transition-metal', icon: 'fas fa-shield-alt', atomicRadius: 135, ionizationEnergy: 906, electronegativity: 1.65 },
            { number: 31, symbol: 'Ga', name: 'Gallium', mass: 69.723, group: 'post-transition', icon: 'fas fa-microchip', atomicRadius: 130, ionizationEnergy: 579, electronegativity: 1.81 },
            { number: 32, symbol: 'Ge', name: 'Germanium', mass: 72.630, group: 'metalloid', icon: 'fas fa-microchip', atomicRadius: 125, ionizationEnergy: 762, electronegativity: 2.01 },
            { number: 33, symbol: 'As', name: 'Arsenic', mass: 74.922, group: 'metalloid', icon: 'fas fa-skull-crossbones', atomicRadius: 115, ionizationEnergy: 947, electronegativity: 2.18 },
            { number: 34, symbol: 'Se', name: 'Selenium', mass: 78.971, group: 'nonmetal', icon: 'fas fa-sun', atomicRadius: 115, ionizationEnergy: 941, electronegativity: 2.55 },
            { number: 35, symbol: 'Br', name: 'Bromine', mass: 79.904, group: 'halogen', icon: 'fas fa-flask', atomicRadius: 115, ionizationEnergy: 1140, electronegativity: 2.96 },
            { number: 36, symbol: 'Kr', name: 'Krypton', mass: 83.798, group: 'noble-gas', icon: 'fas fa-lightbulb', atomicRadius: 88, ionizationEnergy: 1351, electronegativity: 3.00 },
            { number: 37, symbol: 'Rb', name: 'Rubidium', mass: 85.468, group: 'alkali-metal', icon: 'fas fa-fire', atomicRadius: 235, ionizationEnergy: 403, electronegativity: 0.82 },
            { number: 38, symbol: 'Sr', name: 'Strontium', mass: 87.62, group: 'alkaline-earth', icon: 'fas fa-fire-flame-curved', atomicRadius: 200, ionizationEnergy: 549, electronegativity: 0.95 },
            { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.868, group: 'transition-metal', icon: 'fas fa-medal', atomicRadius: 160, ionizationEnergy: 731, electronegativity: 1.93 },
            { number: 53, symbol: 'I', name: 'Iodine', mass: 126.904, group: 'halogen', icon: 'fas fa-tint', atomicRadius: 140, ionizationEnergy: 1008, electronegativity: 2.66 },
            { number: 54, symbol: 'Xe', name: 'Xenon', mass: 131.293, group: 'noble-gas', icon: 'fas fa-lightbulb', atomicRadius: 108, ionizationEnergy: 1170, electronegativity: 2.60 },
            { number: 55, symbol: 'Cs', name: 'Cesium', mass: 132.905, group: 'alkali-metal', icon: 'fas fa-fire', atomicRadius: 260, ionizationEnergy: 376, electronegativity: 0.79 },
            { number: 56, symbol: 'Ba', name: 'Barium', mass: 137.327, group: 'alkaline-earth', icon: 'fas fa-fire-flame-curved', atomicRadius: 215, ionizationEnergy: 503, electronegativity: 0.89 },
            { number: 79, symbol: 'Au', name: 'Gold', mass: 196.967, group: 'transition-metal', icon: 'fas fa-crown', atomicRadius: 166, ionizationEnergy: 890, electronegativity: 2.54 },
            { number: 82, symbol: 'Pb', name: 'Lead', mass: 207.2, group: 'post-transition', icon: 'fas fa-weight-hanging', atomicRadius: 180, ionizationEnergy: 716, electronegativity: 2.33 },
            { number: 85, symbol: 'At', name: 'Astatine', mass: 210, group: 'halogen', icon: 'fas fa-radiation', atomicRadius: 150, ionizationEnergy: 920, electronegativity: 2.20 },
            { number: 86, symbol: 'Rn', name: 'Radon', mass: 222, group: 'noble-gas', icon: 'fas fa-radiation', atomicRadius: 120, ionizationEnergy: 1037, electronegativity: null }
        ];

        let currentQuizElement = null;
        let quizScore = 0;
        let quizCount = 0;
        let currentTrend = null;

        // Initialize the application
        function init() {
            createParticles();
            generatePeriodicTable();
            generateTrendsTable();
            setupEventListeners();
        }

        // Section management
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            const targetSection = document.getElementById(sectionName + 'Section');
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }

        // Create floating particles
        function createParticles() {
            const container = document.getElementById('particleContainer');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                container.appendChild(particle);
            }
        }

        // Generate the periodic table
        function generatePeriodicTable() {
            const table = document.getElementById('periodicTable');
            
            allElements.forEach(element => {
                const position = periodicTableLayout[element.number];
                if (position) {
                    const cell = document.createElement('div');
                    cell.className = `element-card ${element.group} text-center font-semibold text-white shadow-lg flex flex-col items-center justify-center`;
                    cell.style.gridRow = position.row;
                    cell.style.gridColumn = position.col;
                    
                    cell.innerHTML = `
                        <div class="text-[6px] md:text-[7px] opacity-75 leading-none mb-0.5">${element.number}</div>
                        <div class="text-sm md:text-lg font-bold leading-none mb-0.5">${element.symbol}</div>
                        <div class="text-[5px] md:text-[6px] opacity-75 leading-none truncate w-full text-center px-0.5">${element.name}</div>
                        <div class="text-[5px] md:text-[6px] opacity-60 leading-none">${element.mass}</div>
                        ${element.icon ? `<i class="${element.icon} text-[6px] md:text-[8px] opacity-60 mt-0.5"></i>` : ''}
                    `;
                    
                    cell.addEventListener('click', () => showElementModal(element));
                    table.appendChild(cell);
                }
            });
        }

        // Generate trends table
        function generateTrendsTable() {
            const table = document.getElementById('trendsTable');
            
            allElements.forEach(element => {
                const position = periodicTableLayout[element.number];
                if (position) {
                    const cell = document.createElement('div');
                    cell.className = `element-card text-center font-semibold text-white shadow-lg flex flex-col items-center justify-center`;
                    cell.style.gridRow = position.row;
                    cell.style.gridColumn = position.col;
                    cell.id = `trend-${element.number}`;
                    
                    cell.innerHTML = `
                        <div class="text-[6px] md:text-[7px] opacity-75 leading-none mb-0.5">${element.number}</div>
                        <div class="text-sm md:text-lg font-bold leading-none mb-0.5">${element.symbol}</div>
                        <div class="text-[5px] md:text-[6px] opacity-75 leading-none truncate w-full text-center px-0.5">${element.name}</div>
                        <div id="trend-value-${element.number}" class="text-[5px] md:text-[6px] opacity-60 leading-none"></div>
                    `;
                    
                    cell.addEventListener('click', () => showElementModal(element));
                    table.appendChild(cell);
                }
            });
        }

        // Show periodic trends
        function showTrend(trendType) {
            currentTrend = trendType;
            const explanations = {
                'atomic-radius': {
                    title: 'Atomic Radius Trends',
                    description: 'Atomic radius decreases across a period (left to right) due to increasing nuclear charge, and increases down a group due to additional electron shells.',
                    unit: 'pm'
                },
                'ionization-energy': {
                    title: 'Ionization Energy Trends', 
                    description: 'Ionization energy increases across a period and decreases down a group. It represents the energy needed to remove an electron.',
                    unit: 'kJ/mol'
                },
                'electronegativity': {
                    title: 'Electronegativity Trends',
                    description: 'Electronegativity increases across a period and decreases down a group. It measures how strongly atoms attract electrons in bonds.',
                    unit: 'Pauling scale'
                }
            };
            
            const explanation = explanations[trendType];
            document.getElementById('trendExplanation').innerHTML = `
                <h3 class="text-lg font-semibold mb-2 text-blue-300">${explanation.title}</h3>
                <p class="text-gray-300">${explanation.description}</p>
            `;
            
            // Update trend visualization
            allElements.forEach(element => {
                const cell = document.getElementById(`trend-${element.number}`);
                const valueElement = document.getElementById(`trend-value-${element.number}`);
                
                if (cell && valueElement) {
                    let value = element[trendType.replace('-', '')];
                    let trendClass = 'trend-low';
                    
                    if (value === null || value === undefined) {
                        valueElement.textContent = 'N/A';
                        cell.className = cell.className.replace(/trend-\w+/g, '') + ' trend-low';
                        return;
                    }
                    
                    valueElement.textContent = value + (explanation.unit === 'Pauling scale' ? '' : ' ' + explanation.unit);
                    
                    // Determine trend class based on value ranges
                    if (trendType === 'atomic-radius') {
                        if (value < 75) trendClass = 'trend-low';
                        else if (value < 125) trendClass = 'trend-medium';
                        else if (value < 175) trendClass = 'trend-high';
                        else trendClass = 'trend-very-high';
                    } else if (trendType === 'ionization-energy') {
                        if (value < 600) trendClass = 'trend-low';
                        else if (value < 1000) trendClass = 'trend-medium';
                        else if (value < 1500) trendClass = 'trend-high';
                        else trendClass = 'trend-very-high';
                    } else if (trendType === 'electronegativity') {
                        if (value < 1.5) trendClass = 'trend-low';
                        else if (value < 2.5) trendClass = 'trend-medium';
                        else if (value < 3.5) trendClass = 'trend-high';
                        else trendClass = 'trend-very-high';
                    }
                    
                    cell.className = cell.className.replace(/trend-\w+/g, '') + ' ' + trendClass;
                }
            });
        }

        // Show element modal
        function showElementModal(element) {
            const modal = document.getElementById('elementModal');
            const title = document.getElementById('modalTitle');
            const subtitle = document.getElementById('modalSubtitle');
            const properties = document.getElementById('modalProperties');
            const facts = document.getElementById('modalFacts');
            const applications = document.getElementById('modalApplications');
            
            title.textContent = element.name;
            subtitle.textContent = `${element.symbol} - Atomic Number ${element.number}`;
            
            properties.innerHTML = `
                <div class="flex justify-between"><span>Symbol:</span><span class="font-semibold">${element.symbol}</span></div>
                <div class="flex justify-between"><span>Atomic Number:</span><span class="font-semibold">${element.number}</span></div>
                <div class="flex justify-between"><span>Atomic Mass:</span><span class="font-semibold">${element.mass}</span></div>
                <div class="flex justify-between"><span>Group:</span><span class="font-semibold capitalize">${element.group.replace('-', ' ')}</span></div>
                ${element.pronunciation ? `<div class="flex justify-between"><span>Pronunciation:</span><span class="font-semibold">${element.pronunciation}</span></div>` : ''}
                ${element.atomicRadius ? `<div class="flex justify-between"><span>Atomic Radius:</span><span class="font-semibold">${element.atomicRadius} pm</span></div>` : ''}
                ${element.ionizationEnergy ? `<div class="flex justify-between"><span>Ionization Energy:</span><span class="font-semibold">${element.ionizationEnergy} kJ/mol</span></div>` : ''}
                ${element.electronegativity ? `<div class="flex justify-between"><span>Electronegativity:</span><span class="font-semibold">${element.electronegativity}</span></div>` : ''}
            `;
            
            facts.textContent = element.facts || 'Fascinating element with unique properties.';
            applications.textContent = element.applications || 'Used in various industrial and scientific applications.';
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        // Setup event listeners
        function setupEventListeners() {
            // Close modal
            document.getElementById('closeModal').addEventListener('click', () => {
                document.getElementById('elementModal').classList.add('hidden');
                document.getElementById('elementModal').classList.remove('flex');
            });
            
            // Search functionality
            document.getElementById('searchInput').addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const elementCards = document.querySelectorAll('#periodicTable .element-card');
                
                elementCards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    if (text.includes(query) || query === '') {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.opacity = '0.3';
                        card.style.transform = 'scale(0.9)';
                    }
                });
            });
            
            // Quiz mode
            document.getElementById('quizMode').addEventListener('click', startQuiz);
            document.getElementById('closeQuiz').addEventListener('click', () => {
                document.getElementById('quizModal').classList.add('hidden');
                document.getElementById('quizModal').classList.remove('flex');
            });
            
            // Reset view
            document.getElementById('resetView').addEventListener('click', () => {
                document.getElementById('searchInput').value = '';
                const elementCards = document.querySelectorAll('#periodicTable .element-card');
                elementCards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                });
            });
            
            // Close modals when clicking outside
            document.getElementById('elementModal').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    e.currentTarget.classList.add('hidden');
                    e.currentTarget.classList.remove('flex');
                }
            });
            
            document.getElementById('quizModal').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    e.currentTarget.classList.add('hidden');
                    e.currentTarget.classList.remove('flex');
                }
            });
        }

        // Start quiz
        function startQuiz() {
            quizScore = 0;
            quizCount = 0;
            document.getElementById('quizScore').textContent = '0';
            nextQuizQuestion();
            document.getElementById('quizModal').classList.remove('hidden');
            document.getElementById('quizModal').classList.add('flex');
        }

        // Generate next quiz question
        function nextQuizQuestion() {
            if (quizCount >= 10) {
                document.getElementById('quizContent').innerHTML = `
                    <h3 class="text-xl font-bold mb-4">Quiz Complete! 🎉</h3>
                    <p class="text-lg mb-4">Final Score: ${quizScore}/10</p>
                    <p class="text-sm text-gray-300">${getScoreMessage(quizScore)}</p>
                `;
                return;
            }
            
            currentQuizElement = allElements[Math.floor(Math.random() * allElements.length)];
            const options = generateQuizOptions(currentQuizElement);
            
            document.getElementById('quizSymbol').textContent = currentQuizElement.symbol;
            
            const optionsContainer = document.getElementById('quizOptions');
            optionsContainer.innerHTML = '';
            
            options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all';
                button.textContent = option;
                button.addEventListener('click', () => checkQuizAnswer(option));
                optionsContainer.appendChild(button);
            });
        }

        // Generate quiz options
        function generateQuizOptions(correctElement) {
            const options = [correctElement.name];
            const otherElements = allElements.filter(e => e.number !== correctElement.number);
            
            while (options.length < 4) {
                const randomElement = otherElements[Math.floor(Math.random() * otherElements.length)];
                if (!options.includes(randomElement.name)) {
                    options.push(randomElement.name);
                }
            }
            
            return options.sort(() => Math.random() - 0.5);
        }

        // Check quiz answer
        function checkQuizAnswer(selectedAnswer) {
            const buttons = document.querySelectorAll('#quizOptions button');
            buttons.forEach(button => {
                button.disabled = true;
                if (button.textContent === currentQuizElement.name) {
                    button.className = 'w-full p-3 bg-green-600 rounded-lg';
                } else if (button.textContent === selectedAnswer && selectedAnswer !== currentQuizElement.name) {
                    button.className = 'w-full p-3 bg-red-600 rounded-lg';
                } else {
                    button.className = 'w-full p-3 bg-gray-600 rounded-lg';
                }
            });
            
            if (selectedAnswer === currentQuizElement.name) {
                quizScore++;
                document.getElementById('quizScore').textContent = quizScore;
            }
            
            quizCount++;
            
            setTimeout(() => {
                nextQuizQuestion();
            }, 1500);
        }

        // Get score message
        function getScoreMessage(score) {
            if (score >= 9) return "Outstanding! You're a chemistry master! 🏆";
            if (score >= 7) return "Great job! You know your elements well! 🌟";
            if (score >= 5) return "Good work! Keep studying and you'll improve! 📚";
            return "Don't give up! Practice makes perfect! 💪";
        }

        // Initialize the app when page loads
        document.addEventListener('DOMContentLoaded', init);
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9760563747e3cd99',t:'MTc1NjM0NzcwMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();