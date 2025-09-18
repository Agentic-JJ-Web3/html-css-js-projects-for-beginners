 <script>
        document.addEventListener('DOMContentLoaded', function() {
            const activityGrid = document.getElementById('activity-grid');
            const simulateButton = document.getElementById('simulate-activity');
            
            // Generate initial activity grid (7x52 for a year)
            function generateActivityGrid() {
                activityGrid.innerHTML = '';
                for (let i = 0; i < 365; i++) {
                    const day = document.createElement('div');
                    day.className = 'activity-day';
                    // Randomly set some days as active for initial display
                    if (Math.random() > 0.7) {
                        const level = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
                        day.classList.add('active', level);
                    }
                    activityGrid.appendChild(day);
                }
            }
            
            // Simulate 30 days of activity
            simulateButton.addEventListener('click', function() {
                const days = activityGrid.querySelectorAll('.activity-day');
                
                // Clear all existing activity
                days.forEach(day => {
                    day.className = 'activity-day';
                });
                
                // Generate new activity for the last 30 days
                for (let i = 0; i < 30; i++) {
                    const index = 365 - 30 + i;
                    const level = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
                    days[index].classList.add('active', level);
                }
                
                // Show notification
                alert('Simulated 30 days of GitHub activity!');
            });
            
            // Initialize the activity grid
            generateActivityGrid();
        });
    </script>