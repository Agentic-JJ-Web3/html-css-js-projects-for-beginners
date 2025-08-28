
        // Global variables
        let currentUnit = 'celsius';
        let currentWeatherData = null;
        const API_KEY = 'ad3ad70e69684cf389f234922251502'; // Your WeatherAPI.com key
        const BASE_URL = 'https://api.weatherapi.com/v1';

        // WeatherAPI.com endpoints
        const ENDPOINTS = {
            current: `${BASE_URL}/current.json`,
            forecast: `${BASE_URL}/forecast.json`,
            search: `${BASE_URL}/search.json`
        };

        // Weather icons mapping for WeatherAPI conditions
        const weatherIcons = {
            1000: '☀️', // Sunny
            1003: '🌤️', // Partly cloudy
            1006: '☁️', // Cloudy
            1009: '☁️', // Overcast
            1030: '🌫️', // Mist
            1063: '🌦️', // Patchy rain possible
            1066: '🌨️', // Patchy snow possible
            1069: '🌨️', // Patchy sleet possible
            1072: '🌨️', // Patchy freezing drizzle possible
            1087: '⛈️', // Thundery outbreaks possible
            1114: '❄️', // Blowing snow
            1117: '❄️', // Blizzard
            1135: '🌫️', // Fog
            1147: '🌫️', // Freezing fog
            1150: '🌦️', // Patchy light drizzle
            1153: '🌦️', // Light drizzle
            1168: '🌨️', // Freezing drizzle
            1171: '🌨️', // Heavy freezing drizzle
            1180: '🌦️', // Patchy light rain
            1183: '🌧️', // Light rain
            1186: '🌦️', // Moderate rain at times
            1189: '🌧️', // Moderate rain
            1192: '🌧️', // Heavy rain at times
            1195: '🌧️', // Heavy rain
            1198: '🌨️', // Light freezing rain
            1201: '🌨️', // Moderate or heavy freezing rain
            1204: '🌨️', // Light sleet
            1207: '🌨️', // Moderate or heavy sleet
            1210: '🌨️', // Patchy light snow
            1213: '❄️', // Light snow
            1216: '🌨️', // Patchy moderate snow
            1219: '❄️', // Moderate snow
            1222: '🌨️', // Patchy heavy snow
            1225: '❄️', // Heavy snow
            1237: '🌨️', // Ice pellets
            1240: '🌦️', // Light rain shower
            1243: '🌧️', // Moderate or heavy rain shower
            1246: '🌧️', // Torrential rain shower
            1249: '🌨️', // Light sleet showers
            1252: '🌨️', // Moderate or heavy sleet showers
            1255: '🌨️', // Light snow showers
            1258: '❄️', // Moderate or heavy snow showers
            1261: '🌨️', // Light showers of ice pellets
            1264: '🌨️', // Moderate or heavy showers of ice pellets
            1273: '⛈️', // Patchy light rain with thunder
            1276: '⛈️', // Moderate or heavy rain with thunder
            1279: '⛈️', // Patchy light snow with thunder
            1282: '⛈️'  // Moderate or heavy snow with thunder
        };

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
            setupEventListeners();
        });

        function initializeApp() {
            // Check for saved theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }

            // Check for saved unit
            const savedUnit = localStorage.getItem('unit');
            if (savedUnit) {
                currentUnit = savedUnit;
                updateUnitButtons();
            }

            // Get initial weather
            getCurrentLocation();
        }

        function setupEventListeners() {
            // City search
            const searchInput = document.getElementById('citySearch');
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchWeather(this.value);
                }
            });

            // Unit toggle
            document.querySelectorAll('.unit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    currentUnit = this.dataset.unit;
                    localStorage.setItem('unit', currentUnit);
                    updateUnitButtons();
                    if (currentWeatherData) {
                        displayWeatherData(currentWeatherData);
                    }
                });
            });
        }

        function updateUnitButtons() {
            document.querySelectorAll('.unit-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.unit === currentUnit);
            });
        }

        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        function getCurrentLocation() {
            if (navigator.geolocation) {
                showLocationPermissionRequest();
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        fetchWeatherByCoords(lat, lon);
                    },
                    error => {
                        console.error('Geolocation error:', error);
                        handleLocationError(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000 // 5 minutes
                    }
                );
            } else {
                showError('Geolocation is not supported by this browser. Please search for a city manually.');
            }
        }

        function showLocationPermissionRequest() {
            const weatherCard = document.getElementById('weatherCard');
            weatherCard.innerHTML = `
                <div class="loading">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📍</div>
                    <p>🔐 Requesting location permission...</p>
                    <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8); margin-top: 10px;">
                        Please allow location access to get weather for your current location
                    </p>
                </div>
            `;
        }

        function handleLocationError(error) {
            let errorMessage = '';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Location access denied. Please search for a city manually or enable location permissions in your browser settings.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable. Please search for a city manually.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "Location request timed out. Please try again or search for a city manually.";
                    break;
                default:
                    errorMessage = "An unknown error occurred while retrieving location. Please search for a city manually.";
                    break;
            }
            showError(errorMessage);
        }

        async function searchWeather(city) {
            if (!city.trim()) return;
            
            showLoading();
            
            try {
                const response = await fetch(`${ENDPOINTS.forecast}?key=${API_KEY}&q=${encodeURIComponent(city)}&days=3&aqi=yes&alerts=yes`);
                
                if (!response.ok) {
                    throw new Error(`Weather data not found for "${city}"`);
                }
                
                const data = await response.json();
                processWeatherData(data);
                
                // Fetch additional location information
                await fetchLocationInfo(data.location.name, data.location.country);
                
            } catch (error) {
                console.error('Weather API error:', error);
                showError(`Unable to fetch weather data for "${city}". Please check the city name and try again.`);
            }
        }

        async function fetchWeatherByCoords(lat, lon) {
            try {
                const response = await fetch(`${ENDPOINTS.forecast}?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=yes&alerts=yes`);
                
                if (!response.ok) {
                    throw new Error('Weather data not available for your location');
                }
                
                const data = await response.json();
                processWeatherData(data);
                
                // Fetch additional location information
                await fetchLocationInfo(data.location.name, data.location.country);
                
            } catch (error) {
                console.error('Weather API error:', error);
                showError('Unable to fetch weather data for your location. Please try searching for a city instead.');
            }
        }

        function processWeatherData(data) {
            // Transform WeatherAPI data to our format
            const current = data.current;
            const location = data.location;
            const forecast = data.forecast.forecastday;
            
            const processedData = {
                location: `${location.name}, ${location.country}`,
                temperature: current.temp_c,
                condition: current.condition.text.toLowerCase(),
                conditionCode: current.condition.code,
                description: current.condition.text,
                humidity: current.humidity,
                windSpeed: Math.round(current.wind_kph),
                uvIndex: current.uv,
                airQuality: getAirQualityText(data.current.air_quality?.['us-epa-index'] || 1),
                pressure: current.pressure_mb,
                visibility: current.vis_km,
                feelsLike: current.feelslike_c,
                forecast: forecast.map((day, index) => {
                    const date = new Date(day.date);
                    const dayName = index === 0 ? 'Today' : 
                                   index === 1 ? 'Tomorrow' : 
                                   date.toLocaleDateString('en', { weekday: 'short' });
                    
                    return {
                        day: dayName,
                        icon: weatherIcons[day.day.condition.code] || '🌤️',
                        high: Math.round(day.day.maxtemp_c),
                        low: Math.round(day.day.mintemp_c),
                        condition: day.day.condition.text,
                        conditionCode: day.day.condition.code
                    };
                })
            };

            currentWeatherData = processedData;
            displayWeatherData(processedData);
            updateBackground(processedData.conditionCode);
            createWeatherAnimation(processedData.conditionCode);
        }

        function getAirQualityText(index) {
            const qualities = {
                1: 'Good',
                2: 'Moderate', 
                3: 'Unhealthy for Sensitive',
                4: 'Unhealthy',
                5: 'Very Unhealthy',
                6: 'Hazardous'
            };
            return qualities[index] || 'Unknown';
        }

        function displayWeatherData(data) {
            const weatherCard = document.getElementById('weatherCard');
            const temp = currentUnit === 'celsius' ? data.temperature : (data.temperature * 9/5) + 32;
            const feelsLike = currentUnit === 'celsius' ? data.feelsLike : (data.feelsLike * 9/5) + 32;
            const unit = currentUnit === 'celsius' ? '°C' : '°F';
            
            weatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="weather-info">
                        <h2>${data.location}</h2>
                        <p>${data.description}</p>
                        <div class="temperature">${Math.round(temp)}${unit}</div>
                        <p>Feels like ${Math.round(feelsLike)}${unit}</p>
                    </div>
                    <div class="weather-icon">${weatherIcons[data.conditionCode] || weatherIcons[1000]}</div>
                </div>
                <div class="weather-details">
                    <div class="detail-card">
                        <h4>Humidity</h4>
                        <p>${data.humidity}%</p>
                    </div>
                    <div class="detail-card">
                        <h4>Wind Speed</h4>
                        <p>${data.windSpeed} km/h</p>
                    </div>
                    <div class="detail-card">
                        <h4>UV Index</h4>
                        <p>${data.uvIndex}</p>
                    </div>
                    <div class="detail-card">
                        <h4>Air Quality</h4>
                        <p>${data.airQuality}</p>
                    </div>
                    <div class="detail-card">
                        <h4>Pressure</h4>
                        <p>${data.pressure} mb</p>
                    </div>
                    <div class="detail-card">
                        <h4>Visibility</h4>
                        <p>${data.visibility} km</p>
                    </div>
                </div>
            `;

            displayForecast(data.forecast);
            document.getElementById('forecastSection').style.display = 'block';
        }

        async function fetchLocationInfo(city, country) {
            try {
                // Use REST Countries API for country information
                const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=true`);
                
                let countryData = null;
                if (countryResponse.ok) {
                    const countries = await countryResponse.json();
                    countryData = countries[0];
                }

                // Use a combination of APIs for city data
                let cityData = null;
                try {
                    // Try to get city data from a public API
                    const cityResponse = await fetch(`https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(city)}`, {
                        headers: {
                            'X-Api-Key': 'demo' // This would need a real API key for production
                        }
                    });
                    if (cityResponse.ok) {
                        cityData = await cityResponse.json();
                    }
                } catch (error) {
                    console.log('City API not available, using country data only');
                }

                displayLocationInfo(city, country, countryData, cityData);
                
            } catch (error) {
                console.error('Location info error:', error);
                // Display basic location info even if APIs fail
                displayLocationInfo(city, country, null, null);
            }
        }

        function displayLocationInfo(city, country, countryData, cityData) {
            const locationInfoSection = document.getElementById('locationInfoSection');
            const locationInfoGrid = document.getElementById('locationInfoGrid');
            
            let locationCards = '';

            // Country Information Card
            if (countryData) {
                const languages = countryData.languages ? Object.values(countryData.languages).join(', ') : 'N/A';
                const currencies = countryData.currencies ? 
                    Object.values(countryData.currencies).map(curr => `${curr.name} (${curr.symbol || 'N/A'})`).join(', ') : 'N/A';
                const flag = countryData.flag || '🏳️';
                
                locationCards += `
                    <div class="location-info-card">
                        <h4><span class="flag-emoji">${flag}</span>Country Information</h4>
                        <div class="info-item">
                            <span class="info-label">Country</span>
                            <span class="info-value">${countryData.name.common}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Capital</span>
                            <span class="info-value">${countryData.capital ? countryData.capital[0] : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Population</span>
                            <span class="info-value">${countryData.population ? countryData.population.toLocaleString() : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Languages</span>
                            <span class="info-value">${languages}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Currency</span>
                            <span class="info-value">${currencies}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Region</span>
                            <span class="info-value">${countryData.region || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }

            // Geographic Information Card
            locationCards += `
                <div class="location-info-card">
                    <h4>🌍 Geographic Details</h4>
                    <div class="info-item">
                        <span class="info-label">City</span>
                        <span class="info-value">${city}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Country</span>
                        <span class="info-value">${country}</span>
                    </div>
                    ${cityData && cityData.length > 0 ? `
                        <div class="info-item">
                            <span class="info-label">Population</span>
                            <span class="info-value">${cityData[0].population ? cityData[0].population.toLocaleString() : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Latitude</span>
                            <span class="info-value">${cityData[0].latitude ? cityData[0].latitude.toFixed(4) : 'N/A'}°</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Longitude</span>
                            <span class="info-value">${cityData[0].longitude ? cityData[0].longitude.toFixed(4) : 'N/A'}°</span>
                        </div>
                    ` : `
                        <div class="info-item">
                            <span class="info-label">Status</span>
                            <span class="info-value">Weather Available</span>
                        </div>
                    `}
                    <div class="info-item">
                        <span class="info-label">Time Zone</span>
                        <span class="info-value">${Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Local Time</span>
                        <span class="info-value">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            `;

            // Additional Info Card
            if (countryData) {
                locationCards += `
                    <div class="location-info-card">
                        <h4>📊 Additional Information</h4>
                        <div class="info-item">
                            <span class="info-label">Area</span>
                            <span class="info-value">${countryData.area ? countryData.area.toLocaleString() + ' km²' : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Subregion</span>
                            <span class="info-value">${countryData.subregion || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Calling Code</span>
                            <span class="info-value">${countryData.idd && countryData.idd.root ? countryData.idd.root + (countryData.idd.suffixes ? countryData.idd.suffixes[0] : '') : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Internet TLD</span>
                            <span class="info-value">${countryData.tld ? countryData.tld[0] : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Driving Side</span>
                            <span class="info-value">${countryData.car && countryData.car.side ? countryData.car.side.charAt(0).toUpperCase() + countryData.car.side.slice(1) : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">UN Member</span>
                            <span class="info-value">${countryData.unMember ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                `;
            }

            locationInfoGrid.innerHTML = locationCards;
            locationInfoSection.style.display = 'block';
        }

        function displayForecast(forecast) {
            const forecastGrid = document.getElementById('forecastGrid');
            forecastGrid.innerHTML = forecast.map(day => {
                const high = currentUnit === 'celsius' ? day.high : (day.high * 9/5) + 32;
                const low = currentUnit === 'celsius' ? day.low : (day.low * 9/5) + 32;
                const unit = currentUnit === 'celsius' ? '°C' : '°F';
                
                return `
                    <div class="forecast-card">
                        <h4>${day.day}</h4>
                        <div class="forecast-icon">${day.icon}</div>
                        <div class="forecast-temp">${Math.round(high)}° / ${Math.round(low)}°${unit}</div>
                        <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-top: 5px;">${day.condition}</p>
                    </div>
                `;
            }).join('');
        }

        function updateBackground(conditionCode) {
            const body = document.body;
            const hour = new Date().getHours();
            
            // Remove existing weather classes
            body.classList.remove('sunny', 'cloudy', 'rainy', 'night', 'default');
            
            if (hour < 6 || hour > 20) {
                body.classList.add('night');
            } else if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246, 1273, 1276].includes(conditionCode)) {
                body.classList.add('rainy');
            } else if ([1003, 1006, 1009, 1030, 1135, 1147].includes(conditionCode)) {
                body.classList.add('cloudy');
            } else if (conditionCode === 1000) {
                body.classList.add('sunny');
            } else {
                body.classList.add('default');
            }
        }

        function createWeatherAnimation(conditionCode) {
            const animationContainer = document.getElementById('weatherAnimation');
            animationContainer.innerHTML = '';

            // Rain animation for rainy conditions
            if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246, 1273, 1276].includes(conditionCode)) {
                createRainAnimation();
            } 
            // Cloud animation for cloudy conditions
            else if ([1003, 1006, 1009, 1030, 1135, 1147].includes(conditionCode)) {
                createCloudAnimation();
            }
        }

        function createRainAnimation() {
            const animationContainer = document.getElementById('weatherAnimation');
            
            for (let i = 0; i < 50; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.left = Math.random() * 100 + '%';
                drop.style.animationDelay = Math.random() * 2 + 's';
                drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
                animationContainer.appendChild(drop);
            }
        }

        function createCloudAnimation() {
            const animationContainer = document.getElementById('weatherAnimation');
            
            for (let i = 0; i < 3; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                cloud.style.top = Math.random() * 30 + '%';
                cloud.style.width = (Math.random() * 100 + 80) + 'px';
                cloud.style.height = (Math.random() * 40 + 40) + 'px';
                cloud.style.animationDelay = Math.random() * 20 + 's';
                cloud.style.animationDuration = (Math.random() * 10 + 15) + 's';
                animationContainer.appendChild(cloud);
            }
        }

        function refreshWeather() {
            const refreshBtn = document.getElementById('refreshBtn');
            refreshBtn.classList.add('spinning');
            
            const searchInput = document.getElementById('citySearch');
            if (searchInput.value.trim()) {
                searchWeather(searchInput.value);
            } else {
                getCurrentLocation();
            }
            
            setTimeout(() => {
                refreshBtn.classList.remove('spinning');
            }, 1000);
        }

        function showLoading() {
            const weatherCard = document.getElementById('weatherCard');
            weatherCard.innerHTML = `
                <div class="loading">
                    <p>🌍 Fetching real-time weather data...</p>
                </div>
            `;
            document.getElementById('forecastSection').style.display = 'none';
            document.getElementById('locationInfoSection').style.display = 'none';
        }

        function showError(message) {
            const weatherCard = document.getElementById('weatherCard');
            weatherCard.innerHTML = `
                <div class="error">
                    <h3>⚠️ Weather Data Unavailable</h3>
                    <p>${message}</p>
                    <button class="btn" onclick="getCurrentLocation()" style="margin-top: 15px;">Try My Location</button>
                </div>
            `;
        }
    
 (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'975fce9472dbe3ca',t:'MTc1NjM0MjE0Ny4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();