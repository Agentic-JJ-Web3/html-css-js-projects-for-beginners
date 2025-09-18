 const scripts = [
            {
                title: "Website Availability Monitor",
                description: "Script that checks if your website is up and running, and sends notifications when it's down.",
                difficulty: "beginner",
                category: "monitoring",
                tags: ["requests", "monitoring", "notifications"],
                code: `import requests
import time
from smtplib import SMTP

def check_website(url):
    try:
        response = requests.get(url, timeout=10)
        return response.status_code == 200
    except:
        return False

def send_alert(email, password, recipient, website):
    # Send email alert
    server = SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(email, password)
    
    message = f"Subject: Website Down!\\n\\nThe website {website} is currently down."
    server.sendmail(email, recipient, message)
    server.quit()

# Monitor a website every 5 minutes
while True:
    if not check_website('https://example.com'):
        send_alert('your_email@gmail.com', 'your_password', 'admin@example.com', 'https://example.com')
    
    time.sleep(300)  # Check every 5 minutes`
            },
            {
                title: "Log File Analyzer",
                description: "Parse and analyze server log files to find patterns, errors, or suspicious activity.",
                difficulty: "intermediate",
                category: "server",
                tags: ["logging", "analysis", "regex"],
                code: `import re
from collections import Counter

def analyze_logs(log_file):
    # Common log format regex
    log_pattern = r'(\\S+) (\\S+) (\\S+) \\[(.*?)\\] "(.*?)" (\\d+) (\\d+)'
    
    status_codes = []
    ip_addresses = []
    
    with open(log_file, 'r') as f:
        for line in f:
            match = re.match(log_pattern, line)
            if match:
                ip, _, _, _, request, status, size = match.groups()
                status_codes.append(status)
                ip_addresses.append(ip)
    
    # Generate report
    print("Top 10 IP Addresses:")
    for ip, count in Counter(ip_addresses).most_common(10):
        print(f"{ip}: {count} requests")
    
    print("\\nStatus Code Distribution:")
    for status, count in Counter(status_codes).most_common():
        print(f"Status {status}: {count} times")

analyze_logs('/var/log/nginx/access.log')`
            },
            {
                title: "Automated Backup Script",
                description: "Create compressed backups of important directories and upload to cloud storage.",
                difficulty: "intermediate",
                category: "automation",
                tags: ["backup", "compression", "cloud"],
                code: `import os
import tarfile
import datetime
from google.cloud import storage  # Example using Google Cloud

def create_backup(source_dir, backup_dir):
    # Create filename with timestamp
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = os.path.join(backup_dir, f'backup_{timestamp}.tar.gz')
    
    # Create compressed tar archive
    with tarfile.open(backup_file, 'w:gz') as tar:
        tar.add(source_dir, arcname=os.path.basename(source_dir))
    
    return backup_file

def upload_to_cloud(file_path, bucket_name):
    # Upload to Google Cloud Storage
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(os.path.basename(file_path))
    blob.upload_from_filename(file_path)

# Example usage
backup_path = create_backup('/important/data', '/backups')
upload_to_cloud(backup_path, 'my-backup-bucket')`
            },
            {
                title: "API Rate Limit Monitor",
                description: "Track your API usage to avoid hitting rate limits and getting blocked.",
                difficulty: "intermediate",
                category: "monitoring",
                tags: ["api", "monitoring", "limits"],
                code: `import time
from collections import deque

class RateLimitMonitor:
    def __init__(self, max_requests, time_window):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = deque()
    
    def add_request(self):
        now = time.time()
        self.requests.append(now)
        
        # Remove requests outside the time window
        while self.requests and self.requests[0] < now - self.time_window:
            self.requests.popleft()
    
    def check_limit(self):
        return len(self.requests) >= self.max_requests
    
    def wait_if_needed(self):
        if self.check_limit():
            # Calculate how long to wait until the oldest request expires
            oldest = self.requests[0]
            wait_time = (oldest + self.time_window) - time.time()
            if wait_time > 0:
                time.sleep(wait_time)
                return True
        return False

# Example: 100 requests per hour
monitor = RateLimitMonitor(100, 3600)

for i in range(200):
    if monitor.wait_if_needed():
        print("Waited for rate limit reset")
    
    monitor.add_request()
    # Make your API call here
    print(f"Making API request {i+1}")`
            },
            {
                title: "Database Cleanup Script",
                description: "Remove old records, optimize tables, and backup before cleanup.",
                difficulty: "intermediate",
                category: "server",
                tags: ["database", "maintenance", "mysql"],
                code: `import mysql.connector
import datetime

def cleanup_database(host, user, password, database):
    # Connect to database
    db = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database
    )
    
    cursor = db.cursor()
    
    # Delete records older than 90 days
    cutoff_date = datetime.datetime.now() - datetime.timedelta(days=90)
    
    cursor.execute("DELETE FROM logs WHERE timestamp < %s", (cutoff_date,))
    deleted_rows = cursor.rowcount
    
    # Optimize table
    cursor.execute("OPTIMIZE TABLE logs")
    
    db.commit()
    cursor.close()
    db.close()
    
    return deleted_rows

# Example usage
deleted = cleanup_database('localhost', 'admin', 'password', 'app_db')
print(f"Deleted {deleted} old records")`
            },
            {
                title: "SSL Certificate Expiry Checker",
                description: "Monitor SSL certificates and alert before they expire.",
                difficulty: "intermediate",
                category: "monitoring",
                tags: ["ssl", "security", "monitoring"],
                code: `import ssl
import socket
import datetime
from dateutil import parser

def get_ssl_expiry_date(hostname, port=443):
    context = ssl.create_default_context()
    with socket.create_connection((hostname, port)) as sock:
        with context.wrap_socket(sock, server_hostname=hostname) as ssock:
            cert = ssock.getpeercert()
    
    # Parse the expiration date from the certificate
    expire_date = parser.parse(cert['notAfter'])
    return expire_date

def check_ssl_expiry(hostname, warning_days=30):
    expiry_date = get_ssl_expiry_date(hostname)
    today = datetime.datetime.now()
    days_until_expiry = (expiry_date - today).days
    
    if days_until_expiry < warning_days:
        print(f"WARNING: SSL certificate for {hostname} expires in {days_until_expiry} days!")
    else:
        print(f"SSL certificate for {hostname} expires on {expiry_date.strftime('%Y-%m-%d')}")
    
    return days_until_expiry

# Check multiple domains
domains = ['example.com', 'github.com', 'google.com']
for domain in domains:
    check_ssl_expiry(domain)`
            },
            {
                title: "System Resource Monitor",
                description: "Track CPU, memory, and disk usage, and alert when thresholds are exceeded.",
                difficulty: "intermediate",
                category: "monitoring",
                tags: ["system", "resources", "psutil"],
                code: `import psutil
import time
import smtplib

def get_system_stats():
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    return {
        'cpu': cpu_percent,
        'memory': memory.percent,
        'disk': disk.percent
    }

def check_thresholds(stats, thresholds):
    alerts = []
    
    if stats['cpu'] > thresholds['cpu']:
        alerts.append(f"CPU usage is {stats['cpu']}% (threshold: {thresholds['cpu']}%)")
    
    if stats['memory'] > thresholds['memory']:
        alerts.append(f"Memory usage is {stats['memory']}% (threshold: {thresholds['memory']}%)")
    
    if stats['disk'] > thresholds['disk']:
        alerts.append(f"Disk usage is {stats['disk']}% (threshold: {thresholds['disk']}%)")
    
    return alerts

def send_alert(alerts):
    # Send email with alerts
    message = "Subject: System Alert\\n\\n" + "\\n".join(alerts)
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login('your_email@gmail.com', 'your_password')
        server.sendmail('your_email@gmail.com', 'admin@example.com', message)

# Monitor every 5 minutes
thresholds = {'cpu': 90, 'memory': 85, 'disk': 80}

while True:
    stats = get_system_stats()
    alerts = check_thresholds(stats, thresholds)
    
    if alerts:
        send_alert(alerts)
    
    time.sleep(300)  # Check every 5 minutes`
            },
            {
                title: "Automated File Organizer",
                description: "Sort files in a directory based on type, date, or other criteria.",
                difficulty: "beginner",
                category: "automation",
                tags: ["files", "organization", "automation"],
                code: `import os
import shutil
from pathlib import Path

def organize_files(directory):
    # Define file type categories
    file_types = {
        'images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
        'documents': ['.pdf', '.docx', '.txt', '.xlsx', '.pptx'],
        'audio': ['.mp3', '.wav', '.flac'],
        'video': ['.mp4', '.mov', '.avi', '.mkv'],
        'archives': ['.zip', '.rar', '.tar', '.gz']
    }
    
    # Create folders for each category
    for category in file_types.keys():
        Path(directory, category).mkdir(exist_ok=True)
    
    # Move files to appropriate folders
    for file_path in Path(directory).iterdir():
        if file_path.is_file():
            file_ext = file_path.suffix.lower()
            
            moved = False
            for category, extensions in file_types.items():
                if file_ext in extensions:
                    shutil.move(str(file_path), str(Path(directory, category, file_path.name)))
                    moved = True
                    break
            
            # If file type doesn't match any category, put in "other"
            if not moved:
                Path(directory, 'other').mkdir(exist_ok=True)
                shutil.move(str(file_path), str(Path(directory, 'other', file_path.name)))

organize_files('/path/to/your/downloads/folder')`
            },
            {
                title: "Web Scraper with Data Export",
                description: "Extract data from websites and save it in structured formats.",
                difficulty: "intermediate",
                category: "data",
                tags: ["scraping", "data", "export"],
                code: `import requests
from bs4 import BeautifulSoup
import csv
import json

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract data - this will vary based on the website structure
    articles = []
    for article in soup.find_all('article'):
        title = article.find('h2').get_text() if article.find('h2') else 'No title'
        summary = article.find('p').get_text() if article.find('p') else 'No summary'
        articles.append({'title': title, 'summary': summary})
    
    return articles

def save_to_csv(data, filename):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title', 'summary']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for article in data:
            writer.writerow(article)

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, ensure_ascii=False, indent=2)

# Example usage
data = scrape_website('https://example-blog.com')
save_to_csv(data, 'articles.csv')
save_to_json(data, 'articles.json')`
            },
            {
                title: "Password Strength Checker",
                description: "Validate password strength and check against known breaches.",
                difficulty: "intermediate",
                category: "security",
                tags: ["security", "passwords", "api"],
                code: `import re
import hashlib
import requests

def check_password_strength(password):
    # Check length
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    # Check for uppercase letters
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    # Check for lowercase letters
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    # Check for numbers
    if not re.search(r'\\d', password):
        return False, "Password must contain at least one number"
    
    # Check for special characters
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    
    return True, "Password is strong"

def check_breached_password(password):
    # Hash the password using SHA-1
    password_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = password_hash[:5], password_hash[5:]
    
    # Check with Have I Been Pwned API
    response = requests.get(f'https://api.pwnedpasswords.com/range/{prefix}')
    
    # Check if the suffix exists in the response
    hashes = (line.split(':') for line in response.text.splitlines())
    for h, count in hashes:
        if h == suffix:
            return True, int(count)
    
    return False, 0

# Example usage
password = "YourPassword123!"
is_strong, message = check_password_strength(password)
is_breached, count = check_breached_password(password)

if is_strong and not is_breached:
    print("Password is strong and not found in any known breaches")
else:
    if not is_strong:
        print(f"Weak password: {message}")
    if is_breached:
        print(f"Password has been breached {count} times")`
            }
            // Additional scripts would be added here in a real implementation
        ];

        document.addEventListener('DOMContentLoaded', function() {
            const scriptGrid = document.getElementById('script-grid');
            const searchInput = document.getElementById('script-search');
            const categoryButtons = document.querySelectorAll('.category-btn');
            
            let currentCategory = 'all';
            let searchQuery = '';
            
            // Generate script cards
            function renderScripts() {
                scriptGrid.innerHTML = '';
                
                const filteredScripts = scripts.filter(script => {
                    const matchesCategory = currentCategory === 'all' || script.category === currentCategory;
                    const matchesSearch = script.title.toLowerCase().includes(searchQuery) || 
                                         script.description.toLowerCase().includes(searchQuery) ||
                                         script.tags.some(tag => tag.toLowerCase().includes(searchQuery));
                    
                    return matchesCategory && matchesSearch;
                });
                
                filteredScripts.forEach(script => {
                    const card = document.createElement('div');
                    card.className = 'script-card';
                    
                    card.innerHTML = `
                        <h2><i class="fas fa-code"></i> ${script.title}</h2>
                        <span class="difficulty ${script.difficulty}">${script.difficulty}</span>
                        <p>${script.description}</p>
                        <div class="tags">
                            ${script.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <button class="toggle-code">Show Code Example</button>
                        <div class="example-code">
                            <pre>${formatCode(script.code)}</pre>
                        </div>
                    `;
                    
                    scriptGrid.appendChild(card);
                });
                
                // Add event listeners to toggle code buttons
                document.querySelectorAll('.toggle-code').forEach(button => {
                    button.addEventListener('click', function() {
                        const codeExample = this.nextElementSibling;
                        const isVisible = codeExample.style.display === 'block';
                        
                        codeExample.style.display = isVisible ? 'none' : 'block';
                        this.textContent = isVisible ? 'Show Code Example' : 'Hide Code Example';
                    });
                });
            }
            
            // Format code with syntax highlighting
            function formatCode(code) {
                return code
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/#(.*?)(\n|$)/g, '<span class="code-comment">#$1</span>$2')
                    .replace(/(def|class|import|from|return|if|else|for|while|try|except|with|as)(\s|$)/g, '<span class="code-keyword">$1</span>$2')
                    .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="code-function">$1</span>(')
                    .replace(/(".*?"|'.*?')/g, '<span class="code-string">$1</span>')
                    .replace(/(self\.|\.|\(|\)|\{|\}|\[|\]|,|:)/g, '<span class="code-variable">$1</span>');
            }
            
            // Event listeners for search and filtering
            searchInput.addEventListener('input', function() {
                searchQuery = this.value.toLowerCase();
                renderScripts();
            });
            
            categoryButtons.forEach(button => {
                button.addEventListener('click', function() {
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    currentCategory = this.dataset.category;
                    renderScripts();
                });
            });
            
            // Initial render
            renderScripts();
        });