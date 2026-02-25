// ========================================
// RECENT PERFORMANCE PAGE
// Latest Matches & Form Analysis
// ========================================

console.log('📈 Recent Performance Analytics Initialized');

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ DOM Loaded - Recent Performance');
    
    // ========================================
    // GET PLAYER FROM SESSION
    // ========================================
    
    const playerName = sessionStorage.getItem('searchedPlayer');
    
    if (!playerName) {
        console.warn('⚠️ No player selected, redirecting to home');
        window.location.href = 'home.html';
        return;
    }
    
    console.log('📊 Loading recent performance for:', playerName);
    
    // Update navigation
    document.getElementById('nav-player-name').textContent = capitalize(playerName);
    
    // Load profile
    loadPlayerProfile(playerName);
    
    // Initialize charts
    setTimeout(() => {
        initializeCharts();
    }, 100);
    
    // Setup floating heart button
    setupHeartButton(playerName);
});

// ========================================
// LOAD PLAYER PROFILE
// ========================================

function loadPlayerProfile(name) {
    const initial = name.charAt(0).toUpperCase();
    document.getElementById('photo-initial').textContent = initial;
    
    const profiles = {
        "virat kohli": {
            fullName: "Virat Kohli",
            dob: "November 5, 1988 (36 years)",
            birthplace: "Delhi, India",
            nickname: "King Kohli, Chikoo",
            role: "Batsman",
            battingStyle: "Right-hand bat",
            bowlingStyle: "Right-arm medium",
            nationalTeam: "India",
            iplTeams: "Royal Challengers Bangalore",
            otherTeams: "Delhi, South Delhi"
        },
        "rohit sharma": {
            fullName: "Rohit Sharma",
            dob: "April 30, 1987 (37 years)",
            birthplace: "Nagpur, India",
            nickname: "Hitman, Ro",
            role: "Batsman",
            battingStyle: "Right-hand bat",
            bowlingStyle: "Right-arm off-break",
            nationalTeam: "India",
            iplTeams: "Mumbai Indians",
            otherTeams: "Mumbai, Deccan Chargers"
        },
        "ms dhoni": {
            fullName: "Mahendra Singh Dhoni",
            dob: "July 7, 1981 (43 years)",
            birthplace: "Ranchi, India",
            nickname: "Captain Cool, Mahi",
            role: "Wicketkeeper-Batsman",
            battingStyle: "Right-hand bat",
            bowlingStyle: "Right-arm medium",
            nationalTeam: "India",
            iplTeams: "Chennai Super Kings",
            otherTeams: "Bihar, Jharkhand"
        }
    };
    
    const profile = profiles[name.toLowerCase()];
    
    if (profile) {
        document.getElementById('full-name').textContent = profile.fullName;
        document.getElementById('dob').textContent = profile.dob;
        document.getElementById('birthplace').textContent = profile.birthplace;
        document.getElementById('nickname').textContent = profile.nickname;
        document.getElementById('role').textContent = profile.role;
        document.getElementById('batting-style').textContent = profile.battingStyle;
        document.getElementById('bowling-style').textContent = profile.bowlingStyle;
        document.getElementById('national-team').textContent = profile.nationalTeam;
        document.getElementById('ipl-teams').textContent = profile.iplTeams;
        document.getElementById('other-teams').textContent = profile.otherTeams;
    }
    
    console.log('✅ Profile loaded');
}

// ========================================
// INITIALIZE CHARTS
// ========================================

function initializeCharts() {
    // Last 10 Matches Performance
    createLast10Chart();
    
    // Scoring Rate Progression
    createScoringRateChart();
    
    console.log('✅ Charts initialized');
}

function createLast10Chart() {
    const ctx = document.getElementById('last-10-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 
                     'Match 6', 'Match 7', 'Match 8', 'Match 9', 'Match 10'],
            datasets: [{
                label: 'Runs Scored',
                data: [56, 92, 34, 87, 103, 79, 45, 68, 91, 72],
                backgroundColor: function(context) {
                    const value = context.parsed.y;
                    if (value >= 80) return 'rgba(0, 255, 136, 0.6)';
                    if (value >= 50) return 'rgba(0, 245, 255, 0.6)';
                    return 'rgba(255, 190, 11, 0.6)';
                },
                borderColor: function(context) {
                    const value = context.parsed.y;
                    if (value >= 80) return '#00ff88';
                    if (value >= 50) return '#00f5ff';
                    return '#ffbe0b';
                },
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    titleColor: '#00f5ff',
                    bodyColor: '#e6edf3',
                    borderColor: '#00f5ff',
                    borderWidth: 1,
                    titleFont: {
                        family: 'Orbitron',
                        size: 13
                    },
                    bodyFont: {
                        family: 'Space Mono',
                        size: 12
                    },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'Runs: ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 120,
                    grid: {
                        color: 'rgba(0, 245, 255, 0.1)'
                    },
                    ticks: {
                        color: '#8b949e',
                        font: {
                            family: 'Space Mono',
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: {
                            family: 'Space Mono',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function createScoringRateChart() {
    const ctx = document.getElementById('scoring-rate-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 
                     'Match 6', 'Match 7', 'Match 8', 'Match 9', 'Match 10'],
            datasets: [{
                label: 'Strike Rate',
                data: [147.4, 117.9, 121.4, 120.8, 121.2, 164.6, 135.6, 142.1, 139.8, 133.3],
                borderColor: '#ff006e',
                backgroundColor: 'rgba(255, 0, 110, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ff006e',
                pointBorderColor: '#0a0e14',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    titleColor: '#ff006e',
                    bodyColor: '#e6edf3',
                    borderColor: '#ff006e',
                    borderWidth: 1,
                    titleFont: {
                        family: 'Orbitron',
                        size: 13
                    },
                    bodyFont: {
                        family: 'Space Mono',
                        size: 12
                    },
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 100,
                    max: 180,
                    grid: {
                        color: 'rgba(255, 0, 110, 0.1)'
                    },
                    ticks: {
                        color: '#8b949e',
                        font: {
                            family: 'Space Mono',
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 0, 110, 0.1)'
                    },
                    ticks: {
                        color: '#8b949e',
                        font: {
                            family: 'Space Mono',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// ========================================
// FLOATING HEART BUTTON
// ========================================

function setupHeartButton(playerName) {
    const floatingHeartBtn = document.getElementById('floating-heart-btn');
    const heartIcon = floatingHeartBtn.querySelector('.heart-icon');
    
    const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    const isLiked = favourites.includes(playerName.toLowerCase());
    
    if (isLiked) {
        floatingHeartBtn.classList.add('liked');
        heartIcon.textContent = '♥';
    }
    
    floatingHeartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const currentFavourites = JSON.parse(localStorage.getItem('favourites') || '[]');
        const playerKey = playerName.toLowerCase();
        
        if (currentFavourites.includes(playerKey)) {
            const updated = currentFavourites.filter(p => p !== playerKey);
            localStorage.setItem('favourites', JSON.stringify(updated));
            
            floatingHeartBtn.classList.remove('liked');
            heartIcon.textContent = '♡';
            
            showNotification(`Removed ${capitalize(playerName)} from favourites`, 'info');
        } else {
            currentFavourites.push(playerKey);
            localStorage.setItem('favourites', JSON.stringify(currentFavourites));
            
            floatingHeartBtn.classList.add('liked');
            heartIcon.textContent = '♥';
            
            createFloatingHeartAnimation(e);
            showNotification(`Added ${capitalize(playerName)} to favourites`, 'success');
        }
    });
}

function createFloatingHeartAnimation(event) {
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    
    const heart = document.createElement('div');
    heart.textContent = '♥';
    heart.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        font-size: 2rem;
        color: #ff006e;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
        animation: floatHeartNew 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    `;
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
}

// Add heart animation
const heartAnimStyle = document.createElement('style');
heartAnimStyle.textContent = `
    @keyframes floatHeartNew {
        0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
        }
        20% {
            transform: translate(-50%, -60px) scale(1.4) rotate(54deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -200px) scale(0.6) rotate(270deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartAnimStyle);

// ========================================
// UTILITY FUNCTIONS
// ========================================

function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function showNotification(message, type) {
    const colors = {
        success: { bg: 'rgba(0, 255, 136, 0.2)', border: '#00ff88', text: '#00ff88' },
        info: { bg: 'rgba(0, 245, 255, 0.2)', border: '#00f5ff', text: '#00f5ff' }
    };
    
    const color = colors[type] || colors.info;
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${color.bg};
        border: 1px solid ${color.border};
        border-radius: 8px;
        color: ${color.text};
        font-family: 'Space Mono', monospace;
        font-size: 0.9rem;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyle);

console.log('🚀 Recent Performance Page Ready!');
console.log('📊 Charts and timeline loaded');
