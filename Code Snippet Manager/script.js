 
        // Application State
        let snippets = [];
        let currentEditId = null;
        let activeTagFilter = null;
        let hiddenTags = [];
        let filterMode = 'show'; // 'show' or 'hide'

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            loadSnippets();
            loadFilterSettings();
            setupEventListeners();
            createSampleData();
            renderSnippets();
            renderTagsFilter();
        });

        // Load snippets from localStorage
        function loadSnippets() {
            const stored = localStorage.getItem('codeSnippets');
            if (stored) {
                snippets = JSON.parse(stored);
            }
        }

        // Save snippets to localStorage
        function saveSnippets() {
            localStorage.setItem('codeSnippets', JSON.stringify(snippets));
        }

        // Load filter settings from localStorage
        function loadFilterSettings() {
            const stored = localStorage.getItem('filterSettings');
            if (stored) {
                const settings = JSON.parse(stored);
                hiddenTags = settings.hiddenTags || [];
                filterMode = settings.filterMode || 'show';
            }
        }

        // Save filter settings to localStorage
        function saveFilterSettingsToStorage() {
            const settings = {
                hiddenTags,
                filterMode
            };
            localStorage.setItem('filterSettings', JSON.stringify(settings));
        }

        // Create sample data if no snippets exist
        function createSampleData() {
            if (snippets.length === 0) {
                snippets = [
                    {
                        id: 1,
                        title: "Array Shuffle Function",
                        language: "JavaScript",
                        tags: ["array", "utility", "random"],
                        code: `function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Usage
const numbers = [1, 2, 3, 4, 5];
console.log(shuffleArray(numbers));`,
                        favorite: false,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        title: "CSS Flexbox Center",
                        language: "CSS",
                        tags: ["css", "layout", "flexbox"],
                        code: `.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.centered-content {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`,
                        favorite: true,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 3,
                        title: "Python List Comprehension",
                        language: "Python",
                        tags: ["python", "list", "comprehension"],
                        code: `# Basic list comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]

# Dictionary comprehension
word_lengths = {word: len(word) for word in ['hello', 'world', 'python']}`,
                        favorite: false,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 4,
                        title: "React Functional Component",
                        language: "JavaScript",
                        tags: ["react", "component", "hooks"],
                        code: `import React, { useState, useEffect } from 'react';

const MyComponent = ({ title, initialCount = 0 }) => {
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log('Component mounted or count changed:', count);
    }, [count]);

    const handleIncrement = () => {
        setCount(prev => prev + 1);
    };

    return (
        <div className="component">
            <h2>{title}</h2>
            <p>Count: {count}</p>
            <button onClick={handleIncrement} disabled={loading}>
                Increment
            </button>
        </div>
    );
};

export default MyComponent;`,
                        favorite: true,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 5,
                        title: "Java Generic Class",
                        language: "Java",
                        tags: ["java", "generics", "class"],
                        code: `public class GenericContainer<T> {
    private T item;
    
    public GenericContainer(T item) {
        this.item = item;
    }
    
    public T getItem() {
        return item;
    }
    
    public void setItem(T item) {
        this.item = item;
    }
    
    public boolean isEmpty() {
        return item == null;
    }
    
    @Override
    public String toString() {
        return "Container{" + "item=" + item + '}';
    }
}

// Usage
GenericContainer<String> stringContainer = new GenericContainer<>("Hello");
GenericContainer<Integer> intContainer = new GenericContainer<>(42);`,
                        favorite: false,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 6,
                        title: "Python Decorator Pattern",
                        language: "Python",
                        tags: ["python", "decorator", "pattern"],
                        code: `import functools
import time

def timer(func):
    """Decorator to measure function execution time"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

def retry(max_attempts=3, delay=1):
    """Decorator to retry function on failure"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise e
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

# Usage
@timer
@retry(max_attempts=3, delay=0.5)
def api_call():
    # Simulate API call
    import random
    if random.random() < 0.7:
        raise Exception("API Error")
    return "Success"`,
                        favorite: false,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 7,
                        title: "Go HTTP Server",
                        language: "Go",
                        tags: ["go", "http", "server", "api"],
                        code: `package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"
)

type Response struct {
    Message   string    \`json:"message"\`
    Timestamp time.Time \`json:"timestamp"\`
    Status    string    \`json:"status"\`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    response := Response{
        Message:   "Server is healthy",
        Timestamp: time.Now(),
        Status:    "OK",
    }
    
    json.NewEncoder(w).Encode(response)
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/health", healthHandler)
    
    server := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  15 * time.Second,
        WriteTimeout: 15 * time.Second,
    }
    
    fmt.Println("Server starting on :8080")
    log.Fatal(server.ListenAndServe())
}`,
                        favorite: false,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 8,
                        title: "SQL Query Optimization",
                        language: "SQL",
                        tags: ["sql", "optimization", "index", "performance"],
                        code: `-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_date ON orders(created_at);
CREATE INDEX idx_product_category ON products(category_id, price);

-- Optimized query with proper joins and conditions
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total_amount) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id 
    AND o.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
WHERE u.status = 'active'
    AND u.created_at >= '2023-01-01'
GROUP BY u.id, u.name, u.email
HAVING order_count > 0
ORDER BY total_spent DESC
LIMIT 100;

-- Use EXPLAIN to analyze query performance
EXPLAIN SELECT * FROM orders 
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'
    AND status IN ('completed', 'shipped');`,
                        favorite: true,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 9,
                        title: "Docker Multi-stage Build",
                        language: "Docker",
                        tags: ["docker", "build", "optimization", "nodejs"],
                        code: `# Multi-stage build for Node.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]`,
                        favorite: false,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 10,
                        title: "TypeScript Interface & Type Guards",
                        language: "TypeScript",
                        tags: ["typescript", "interface", "types", "guards"],
                        code: `// Define interfaces
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
    profile?: UserProfile;
}

interface UserProfile {
    avatar: string;
    bio: string;
    socialLinks: Record<string, string>;
}

// Type guards
function isUser(obj: any): obj is User {
    return obj && 
           typeof obj.id === 'number' &&
           typeof obj.name === 'string' &&
           typeof obj.email === 'string' &&
           ['admin', 'user', 'moderator'].includes(obj.role);
}

function hasProfile(user: User): user is User & { profile: UserProfile } {
    return user.profile !== undefined;
}

// Generic utility types
type ApiResponse<T> = {
    data: T;
    status: 'success' | 'error';
    message?: string;
};

type PartialUser = Partial<User>;
type RequiredProfile = Required<UserProfile>;

// Usage example
function processUser(userData: unknown): ApiResponse<User> {
    if (!isUser(userData)) {
        return {
            data: {} as User,
            status: 'error',
            message: 'Invalid user data'
        };
    }

    if (hasProfile(userData)) {
        console.log('User has profile:', userData.profile.bio);
    }

    return {
        data: userData,
        status: 'success'
    };
}`,
                        favorite: true,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 11,
                        title: "Rust Error Handling",
                        language: "Rust",
                        tags: ["rust", "error", "result", "option"],
                        code: `use std::fs::File;
use std::io::{self, Read};
use std::num::ParseIntError;

// Custom error type
#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(ParseIntError),
    Custom(String),
}

impl From<io::Error> for AppError {
    fn from(error: io::Error) -> Self {
        AppError::Io(error)
    }
}

impl From<ParseIntError> for AppError {
    fn from(error: ParseIntError) -> Self {
        AppError::Parse(error)
    }
}

// Function that returns Result
fn read_number_from_file(filename: &str) -> Result<i32, AppError> {
    let mut file = File::open(filename)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    
    let number: i32 = contents.trim().parse()?;
    
    if number < 0 {
        return Err(AppError::Custom("Number must be positive".to_string()));
    }
    
    Ok(number)
}

// Using Option for nullable values
fn find_user_by_id(id: u32) -> Option<String> {
    let users = vec![
        (1, "Alice".to_string()),
        (2, "Bob".to_string()),
        (3, "Charlie".to_string()),
    ];
    
    users.into_iter()
        .find(|(user_id, _)| *user_id == id)
        .map(|(_, name)| name)
}

fn main() {
    // Handle Result with match
    match read_number_from_file("number.txt") {
        Ok(num) => println!("Number: {}", num),
        Err(e) => eprintln!("Error: {:?}", e),
    }
    
    // Handle Option with if let
    if let Some(user) = find_user_by_id(2) {
        println!("Found user: {}", user);
    } else {
        println!("User not found");
    }
}`,
                        favorite: false,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 12,
                        title: "Swift SwiftUI View",
                        language: "Swift",
                        tags: ["swift", "swiftui", "ios", "view"],
                        code: `import SwiftUI

struct ContentView: View {
    @State private var counter = 0
    @State private var isAnimating = false
    @State private var showAlert = false
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Counter App")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text("\\(counter)")
                .font(.system(size: 60, weight: .bold, design: .rounded))
                .foregroundColor(.blue)
                .scaleEffect(isAnimating ? 1.2 : 1.0)
                .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isAnimating)
            
            HStack(spacing: 20) {
                Button(action: decrementCounter) {
                    Image(systemName: "minus.circle.fill")
                        .font(.title)
                        .foregroundColor(.red)
                }
                .disabled(counter <= 0)
                
                Button(action: resetCounter) {
                    Text("Reset")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.horizontal, 20)
                        .padding(.vertical, 10)
                        .background(Color.gray)
                        .cornerRadius(10)
                }
                
                Button(action: incrementCounter) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title)
                        .foregroundColor(.green)
                }
            }
        }
        .padding()
        .alert("Counter Reset", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text("Counter has been reset to 0")
        }
    }
    
    private func incrementCounter() {
        counter += 1
        animateCounter()
    }
    
    private func decrementCounter() {
        if counter > 0 {
            counter -= 1
            animateCounter()
        }
    }
    
    private func resetCounter() {
        counter = 0
        showAlert = true
        animateCounter()
    }
    
    private func animateCounter() {
        isAnimating = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            isAnimating = false
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}`,
                        favorite: false,
                        createdAt: new Date().toISOString()
                    }
                ];
                saveSnippets();
            }
        }

        // Setup event listeners
        function setupEventListeners() {
            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', handleSearch);

            const snippetForm = document.getElementById('snippetForm');
            snippetForm.addEventListener('submit', handleFormSubmit);

            // Close modals when clicking outside
            window.addEventListener('click', function(e) {
                const snippetModal = document.getElementById('snippetModal');
                const viewModal = document.getElementById('viewModal');
                const filterModal = document.getElementById('filterModal');
                if (e.target === snippetModal) closeModal();
                if (e.target === viewModal) closeViewModal();
                if (e.target === filterModal) closeFilterModal();
            });
        }

        // Handle search functionality
        function handleSearch(e) {
            const query = e.target.value.toLowerCase();
            renderSnippets(query);
        }

        // Handle form submission
        function handleFormSubmit(e) {
            e.preventDefault();
            
            const title = document.getElementById('titleInput').value;
            const language = document.getElementById('languageSelect').value;
            const tags = document.getElementById('tagsInput').value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const code = document.getElementById('codeInput').value;

            if (currentEditId) {
                // Update existing snippet
                const index = snippets.findIndex(s => s.id === currentEditId);
                snippets[index] = {
                    ...snippets[index],
                    title,
                    language,
                    tags,
                    code,
                    updatedAt: new Date().toISOString()
                };
            } else {
                // Create new snippet
                const newSnippet = {
                    id: Date.now(),
                    title,
                    language,
                    tags,
                    code,
                    favorite: false,
                    createdAt: new Date().toISOString()
                };
                snippets.unshift(newSnippet);
            }

            saveSnippets();
            renderSnippets();
            renderTagsFilter();
            closeModal();
        }

        // Render snippets grid
        function renderSnippets(searchQuery = '') {
            const grid = document.getElementById('snippetsGrid');
            let filteredSnippets = snippets;

            // Apply search filter
            if (searchQuery) {
                filteredSnippets = snippets.filter(snippet => 
                    snippet.title.toLowerCase().includes(searchQuery) ||
                    snippet.language.toLowerCase().includes(searchQuery) ||
                    snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery))
                );
            }

            // Apply tag filter
            if (activeTagFilter) {
                filteredSnippets = filteredSnippets.filter(snippet => 
                    snippet.tags.includes(activeTagFilter)
                );
            }

            if (filteredSnippets.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <h3>No snippets found</h3>
                        <p>Try adjusting your search or add a new snippet</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = filteredSnippets.map(snippet => `
                <div class="snippet-card" onclick="viewSnippet(${snippet.id})">
                    <div class="snippet-header">
                        <div>
                            <div class="snippet-title">${snippet.title}</div>
                        </div>
                        <div class="snippet-language">${snippet.language}</div>
                    </div>
                    <div class="snippet-tags">
                        ${snippet.tags.map(tag => `<span class="snippet-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="snippet-preview">${snippet.code.substring(0, 100)}${snippet.code.length > 100 ? '...' : ''}</div>
                    <div class="snippet-actions" onclick="event.stopPropagation()">
                        <button class="action-btn favorite-btn" onclick="toggleFavorite(${snippet.id})" title="Toggle Favorite">
                            ${snippet.favorite ? '⭐' : '☆'}
                        </button>
                        <button class="action-btn copy-btn" onclick="copySnippetCode(${snippet.id})" title="Copy Code">
                            📋
                        </button>
                        <button class="action-btn edit-btn" onclick="editSnippet(${snippet.id})">Edit</button>
                        <button class="action-btn delete-btn" onclick="confirmDeleteSnippet(${snippet.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        // Render tags filter
        function renderTagsFilter() {
            const tagsFilter = document.getElementById('tagsFilter');
            const allTags = [...new Set(snippets.flatMap(snippet => snippet.tags))];
            
            if (allTags.length === 0) {
                tagsFilter.innerHTML = '<p style="color: #9ca3af; font-style: italic;">No tags available</p>';
                return;
            }

            // Filter tags based on user preferences
            const visibleTags = allTags.filter(tag => !hiddenTags.includes(tag));
            
            if (visibleTags.length === 0) {
                tagsFilter.innerHTML = '<p style="color: #9ca3af; font-style: italic;">All tags are hidden. <button class="customize-btn" onclick="openFilterModal()">Customize filters</button></p>';
                return;
            }

            tagsFilter.innerHTML = `
                ${visibleTags.map(tag => `
                    <span class="tag-chip ${activeTagFilter === tag ? 'active' : ''}" 
                          onclick="filterByTag('${tag}')">${tag}</span>
                `).join('')}
                ${activeTagFilter ? '<span class="tag-chip" onclick="clearTagFilter()">✕ Clear Filter</span>' : ''}
            `;
        }

        // Filter by tag
        function filterByTag(tag) {
            activeTagFilter = activeTagFilter === tag ? null : tag;
            renderSnippets();
            renderTagsFilter();
        }

        // Clear tag filter
        function clearTagFilter() {
            activeTagFilter = null;
            renderSnippets();
            renderTagsFilter();
        }

        // View snippet in modal
        function viewSnippet(id) {
            const snippet = snippets.find(s => s.id === id);
            if (!snippet) return;

            document.getElementById('viewTitle').textContent = snippet.title;
            document.getElementById('viewContent').innerHTML = `
                <div style="margin-bottom: 15px;">
                    <strong>Language:</strong> <span class="snippet-language">${snippet.language}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Tags:</strong> ${snippet.tags.map(tag => `<span class="snippet-tag">${tag}</span>`).join(' ')}
                </div>
                <div class="code-header">
                    <strong>Code:</strong>
                    <button class="copy-code-btn" onclick="copyCodeToClipboard(\`${snippet.code.replace(/`/g, '\\`')}\`, this)">
                        📋 Copy Code
                    </button>
                </div>
                <pre style="background: #f8f9fa; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'Monaco', 'Menlo', monospace; font-size: 14px; line-height: 1.5;">${snippet.code}</pre>
            `;
            document.getElementById('viewModal').style.display = 'block';
        }

        // Open add modal
        function openAddModal() {
            currentEditId = null;
            document.getElementById('modalTitle').textContent = 'Add New Snippet';
            document.getElementById('snippetForm').reset();
            document.getElementById('snippetModal').style.display = 'block';
        }

        // Edit snippet
        function editSnippet(id) {
            const snippet = snippets.find(s => s.id === id);
            if (!snippet) return;

            currentEditId = id;
            document.getElementById('modalTitle').textContent = 'Edit Snippet';
            document.getElementById('titleInput').value = snippet.title;
            document.getElementById('languageSelect').value = snippet.language;
            document.getElementById('tagsInput').value = snippet.tags.join(', ');
            document.getElementById('codeInput').value = snippet.code;
            document.getElementById('snippetModal').style.display = 'block';
        }

        // Copy snippet code from card
        function copySnippetCode(id) {
            const snippet = snippets.find(s => s.id === id);
            if (!snippet) return;

            copyCodeToClipboard(snippet.code);
        }

        // Copy code to clipboard
        async function copyCodeToClipboard(code, buttonElement = null) {
            try {
                await navigator.clipboard.writeText(code);
                
                if (buttonElement) {
                    const originalText = buttonElement.textContent;
                    buttonElement.textContent = '✅ Copied!';
                    buttonElement.classList.add('success');
                    
                    setTimeout(() => {
                        buttonElement.textContent = originalText;
                        buttonElement.classList.remove('success');
                    }, 2000);
                } else {
                    // Show a temporary notification for card copy
                    showCopyNotification();
                }
            } catch (err) {
                console.error('Failed to copy code: ', err);
                // Fallback for older browsers
                fallbackCopyTextToClipboard(code, buttonElement);
            }
        }

        // Fallback copy method for older browsers
        function fallbackCopyTextToClipboard(text, buttonElement = null) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful && buttonElement) {
                    const originalText = buttonElement.textContent;
                    buttonElement.textContent = '✅ Copied!';
                    buttonElement.classList.add('success');
                    
                    setTimeout(() => {
                        buttonElement.textContent = originalText;
                        buttonElement.classList.remove('success');
                    }, 2000);
                } else if (successful) {
                    showCopyNotification();
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        }

        // Show copy notification
        function showCopyNotification() {
            const notification = document.createElement('div');
            notification.textContent = '✅ Code copied to clipboard!';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-weight: 500;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }

        // Confirm delete snippet
        function confirmDeleteSnippet(id) {
            const snippet = snippets.find(s => s.id === id);
            if (!snippet) return;

            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'block';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2 class="modal-title">Delete Snippet</h2>
                        <button class="close-btn" onclick="closeDeleteModal()">&times;</button>
                    </div>
                    <div class="delete-confirmation">
                        <p>Are you sure you want to delete "${snippet.title}"?</p>
                        <p style="font-size: 14px; color: #6b7280;">This action cannot be undone.</p>
                        <div class="delete-actions">
                            <button class="cancel-delete-btn" onclick="closeDeleteModal()">Cancel</button>
                            <button class="confirm-delete-btn" onclick="deleteSnippet(${id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            window.currentDeleteModal = modal;
        }

        // Close delete modal
        function closeDeleteModal() {
            if (window.currentDeleteModal) {
                document.body.removeChild(window.currentDeleteModal);
                window.currentDeleteModal = null;
            }
        }

        // Delete snippet
        function deleteSnippet(id) {
            snippets = snippets.filter(s => s.id !== id);
            saveSnippets();
            renderSnippets();
            renderTagsFilter();
            closeDeleteModal();
        }

        // Toggle favorite
        function toggleFavorite(id) {
            const snippet = snippets.find(s => s.id === id);
            if (snippet) {
                snippet.favorite = !snippet.favorite;
                saveSnippets();
                renderSnippets();
            }
        }

        // Close modal
        function closeModal() {
            document.getElementById('snippetModal').style.display = 'none';
            currentEditId = null;
        }

        // Close view modal
        function closeViewModal() {
            document.getElementById('viewModal').style.display = 'none';
        }

        // Open filter customization modal
        function openFilterModal() {
            renderTagCustomizationList();
            document.getElementById('filterModal').style.display = 'block';
        }

        // Close filter modal
        function closeFilterModal() {
            document.getElementById('filterModal').style.display = 'none';
        }

        // Render tag customization list
        function renderTagCustomizationList() {
            const container = document.getElementById('tagCustomizationList');
            const allTags = [...new Set(snippets.flatMap(snippet => snippet.tags))].sort();
            
            if (allTags.length === 0) {
                container.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 20px;">No tags available to customize</p>';
                return;
            }

            container.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; max-height: 300px; overflow-y: auto; padding: 10px; border: 1px solid #e1e5e9; border-radius: 8px;">
                    ${allTags.map(tag => {
                        const isHidden = hiddenTags.includes(tag);
                        const snippetCount = snippets.filter(s => s.tags.includes(tag)).length;
                        return `
                            <label style="display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 6px; cursor: pointer; transition: background-color 0.2s;" 
                                   onmouseover="this.style.backgroundColor='#f8f9fa'" 
                                   onmouseout="this.style.backgroundColor='transparent'">
                                <input type="checkbox" 
                                       ${isHidden ? '' : 'checked'} 
                                       onchange="toggleTagVisibility('${tag}')"
                                       style="margin: 0;">
                                <span style="flex: 1; font-size: 14px;">${tag}</span>
                                <span style="font-size: 12px; color: #6b7280; background: #f1f3f4; padding: 2px 6px; border-radius: 10px;">${snippetCount}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px; font-size: 14px; color: #6b7280;">
                    💡 <strong>Tip:</strong> Uncheck tags you don't use to keep your filter bar clean and focused on your preferred tech stack.
                </div>
            `;
        }

        // Toggle tag visibility
        function toggleTagVisibility(tag) {
            const index = hiddenTags.indexOf(tag);
            if (index > -1) {
                hiddenTags.splice(index, 1);
            } else {
                hiddenTags.push(tag);
            }
        }

        // Toggle filter mode
        function toggleFilterMode(mode) {
            filterMode = mode;
            document.querySelectorAll('.filter-mode-toggle').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update the list display based on mode
            renderTagCustomizationList();
        }

        // Select all tags
        function selectAllTags() {
            hiddenTags = [];
            renderTagCustomizationList();
        }

        // Clear all tags (hide all)
        function clearAllTags() {
            const allTags = [...new Set(snippets.flatMap(snippet => snippet.tags))];
            hiddenTags = [...allTags];
            renderTagCustomizationList();
        }

        // Reset filter settings
        function resetFilterSettings() {
            hiddenTags = [];
            filterMode = 'show';
            renderTagCustomizationList();
        }

        // Save filter settings
        function saveFilterSettings() {
            saveFilterSettingsToStorage();
            renderTagsFilter();
            closeFilterModal();
            
            // Show success message
            const notification = document.createElement('div');
            notification.textContent = '✅ Filter settings saved!';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-weight: 500;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }

        // Toggle theme
        function toggleTheme() {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('darkTheme', isDark);
            
            const themeToggle = document.querySelector('.theme-toggle');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        }

        // Load theme preference
        document.addEventListener('DOMContentLoaded', function() {
            const isDark = localStorage.getItem('darkTheme') === 'true';
            if (isDark) {
                document.body.classList.add('dark');
                document.querySelector('.theme-toggle').textContent = '☀️';
            }
        });

        // Export snippets
        function exportSnippets() {
            const dataStr = JSON.stringify(snippets, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'code-snippets.json';
            link.click();
            URL.revokeObjectURL(url);
        }

        // Import snippets
        function importSnippets(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedSnippets = JSON.parse(e.target.result);
                    snippets = [...snippets, ...importedSnippets];
                    saveSnippets();
                    renderSnippets();
                    renderTagsFilter();
                    alert('Snippets imported successfully!');
                } catch (error) {
                    alert('Error importing snippets. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'97b136cbc3bd134c',t:'MTc1NzE5NTc2Mi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();