// ========================================
// MAXX PERFORMA PAGE
// Advanced Analytics Engine with Charts
// ========================================

console.log('⚡ MAXX PERFORMA Analytics Engine Initialized');

let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ DOM Loaded - MAXX PERFORMA');
    
    // ========================================
    // GET PLAYER FROM SESSION
    // ========================================
    
    const playerName = sessionStorage.getItem('searchedPlayer');
    
    if (!playerName) {
        console.warn('⚠️ No player selected, redirecting to home');
        window.location.href = 'home.html';
        return;
    }
    
    console.log('📊 Loading MAXX PERFORMA for:', playerName);
    
    // Update navigation
    document.getElementById('nav-player-name').textContent = capitalize(playerName);
    
    // Load profile
    loadPlayerProfile(playerName);
    
    // Initialize Impact Ring
    initializeImpactRing(87);
    
    // Initialize all charts
    setTimeout(() => {
        initializeCharts();
    }, 100);
    
    // Setup chart zoom functionality
    setupChartZoom();
    
    // Setup floating heart button
    setupHeartButton(playerName);
});

// ========================================
// LOAD PLAYER PROFILE (SAME AS RECORDS)
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
// IMPACT RING ANIMATION
// ========================================

function initializeImpactRing(score) {
    const ring = document.getElementById('impact-ring-progress');
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (score / 100) * circumference;
    
    // Add gradient
    const svg = ring.closest('svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'impact-gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#00f5ff;stop-opacity:1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('style', 'stop-color:#ff006e;stop-opacity:1');
    
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('style', 'stop-color:#ffbe0b;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
    
    // Animate ring
    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
    }, 300);
    
    console.log('✅ Impact ring initialized');
}

// ========================================
// INITIALIZE ALL CHARTS
// ========================================

function initializeCharts() {
    // International Runs Distribution
    charts.international = createPieChart('chart-international', {
        labels: ['Test Cricket', 'ODI Cricket', 'T20 International'],
        data: [8800, 13500, 4000],
        colors: ['#ff006e', '#00f5ff', '#ffbe0b']
    });
    
    // IPL Teams Distribution
    charts.iplTeams = createPieChart('chart-ipl-teams', {
        labels: ['Royal Challengers Bangalore'],
        data: [7263],
        colors: ['#ec1c24']
    });
    
    // IPL Opposition Distribution
    charts.iplOpposition = createPieChart('chart-ipl-opposition', {
        labels: ['MI', 'CSK', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT'],
        data: [1200, 1050, 980, 890, 850, 720, 673, 900],
        colors: ['#004ba0', '#fdb913', '#3a225d', '#282968', '#ed1b24', '#254aa5', '#f26522', '#1e4087']
    });
    
    // ICC Ranking Distribution
    charts.ranking = createPieChart('chart-ranking', {
        labels: ['Top 10', 'Top 20', 'Outside Top 20'],
        data: [75, 20, 5],
        colors: ['#00ff88', '#ffbe0b', '#ff006e']
    });
    
    // Peak Performance Distribution
    charts.peak = createPieChart('chart-peak', {
        labels: ['Test Peak', 'ODI Peak', 'T20I Peak'],
        data: [3200, 4500, 1800],
        colors: ['#b042ff', '#00f5ff', '#ff006e']
    });
    
    // Career Timeline
    charts.timeline = createLineChart('chart-timeline', {
        labels: ['2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
        data: [450, 890, 1450, 1980, 2650, 2450, 1820, 1650, 1200],
        label: 'Runs per Year'
    });
    
    console.log('✅ All charts initialized');
}

// ========================================
// CREATE PIE CHART
// ========================================

function createPieChart(canvasId, config) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: config.labels,
            datasets: [{
                data: config.data,
                backgroundColor: config.colors,
                borderColor: '#0a0e14',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#8b949e',
                        font: {
                            family: 'Space Mono',
                            size: 11
                        },
                        padding: 15
                    }
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
                    padding: 12
                }
            }
        }
    });
}

// ========================================
// CREATE LINE CHART
// ========================================

function createLineChart(canvasId, config) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: config.labels,
            datasets: [{
                label: config.label,
                data: config.data,
                borderColor: '#00f5ff',
                backgroundColor: 'rgba(0, 245, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00f5ff',
                pointBorderColor: '#0a0e14',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
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
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
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
                        color: 'rgba(0, 245, 255, 0.1)'
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
// CHART ZOOM FUNCTIONALITY
// ========================================

function setupChartZoom() {
    const expandButtons = document.querySelectorAll('.expand-chart-btn');
    const modal = document.getElementById('chart-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalCanvas = document.getElementById('modal-chart');
    
    let modalChart = null;
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const chartId = this.getAttribute('data-chart-id');
            openChartModal(chartId);
        });
    });
    
    function openChartModal(chartId) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Destroy existing modal chart
        if (modalChart) {
            modalChart.destroy();
        }
        
        // Clone chart configuration
        const sourceChart = charts[getChartKey(chartId)];
        if (!sourceChart) return;
        
        // Create enlarged chart
        const config = sourceChart.config;
        modalChart = new Chart(modalCanvas, {
            type: config.type,
            data: JSON.parse(JSON.stringify(config.data)),
            options: JSON.parse(JSON.stringify(config.options))
        });
        
        console.log('📊 Chart zoomed:', chartId);
    }
    
    function closeChartModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        if (modalChart) {
            modalChart.destroy();
            modalChart = null;
        }
    }
    
    modalClose.addEventListener('click', closeChartModal);
    modalBackdrop.addEventListener('click', closeChartModal);
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeChartModal();
        }
    });
}

function getChartKey(chartId) {
    const mapping = {
        'international': 'international',
        'ipl-teams': 'iplTeams',
        'ipl-opposition': 'iplOpposition',
        'ranking': 'ranking',
        'peak': 'peak',
        'timeline': 'timeline'
    };
    return mapping[chartId];
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

console.log('🚀 MAXX PERFORMA Ready!');
console.log('📊 Advanced analytics engine loaded');
console.log('⚡ Interactive charts active');
