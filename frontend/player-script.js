// ========================================
// PLAYER OPTIONS PAGE
// JavaScript for Navigation & Data Display
// ========================================

console.log('🏏 Player Options Page Initialized');

// Mock player database (same as home page)
const mockPlayerData = {
    "virat kohli": {
        total_runs: 25000,
        batting_avg: 53.5,
        strike_rate: 93.2,
        centuries: 76,
        matches_played: 500,
        consistency_index: 12.4,
        
        odi: {
            matches: 275,
            runs: 13500,
            avg: 58.2,
            centuries: 50
        },
        test: {
            matches: 113,
            runs: 8800,
            avg: 48.9,
            centuries: 29
        },
        t20: {
            matches: 115,
            runs: 4000,
            strike_rate: 137.9,
            avg: 52.7
        }
    },
    
    "rohit sharma": {
        total_runs: 18500,
        batting_avg: 48.9,
        strike_rate: 95.8,
        centuries: 48,
        matches_played: 461,
        consistency_index: 11.2,
        
        odi: {
            matches: 265,
            runs: 10500,
            avg: 49.2,
            centuries: 31
        },
        test: {
            matches: 58,
            runs: 3800,
            avg: 46.8,
            centuries: 11
        },
        t20: {
            matches: 148,
            runs: 4000,
            strike_rate: 140.5,
            avg: 32.5
        }
    },
    
    "ms dhoni": {
        total_runs: 17200,
        batting_avg: 50.4,
        strike_rate: 87.6,
        centuries: 16,
        matches_played: 538,
        consistency_index: 10.8,
        
        odi: {
            matches: 350,
            runs: 10773,
            avg: 50.6,
            centuries: 10
        },
        test: {
            matches: 90,
            runs: 4876,
            avg: 38.1,
            centuries: 6
        },
        t20: {
            matches: 98,
            runs: 1617,
            strike_rate: 126.1,
            avg: 37.6
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ DOM Loaded - Player Options Page');
    
    // ========================================
    // GET PLAYER FROM SESSION
    // ========================================
    
    const playerName = sessionStorage.getItem('searchedPlayer');
    
    if (!playerName) {
        console.warn('⚠️ No player selected, redirecting to home');
        window.location.href = 'home.html';
        return;
    }
    
    console.log('🔍 Loading data for:', playerName);
    
    // ========================================
    // LOAD PLAYER DATA
    // ========================================
    
    const playerData = mockPlayerData[playerName.toLowerCase()];
    
    if (!playerData) {
        showNotification('Player data not found. Showing demo for: ' + playerName, 'error');
        // Use default demo data
        loadDemoData(playerName);
    } else {
        loadPlayerData(playerName, playerData);
    }
    
    // ========================================
    // CARD CLICK HANDLERS
    // ========================================
    
    const optionCards = document.querySelectorAll('.option-card');
    
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            console.log('📄 Navigating to:', targetPage);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                // Navigate to the selected page
                window.location.href = targetPage;
            }, 200);
        });
        
        // Hover sound effect simulation (visual feedback)
        card.addEventListener('mouseenter', function() {
            console.log('🎯 Hovering:', this.querySelector('.card-title').textContent);
        });
    });
    
});

// ========================================
// LOAD PLAYER DATA
// ========================================

function loadPlayerData(name, data) {

    const nav = document.getElementById('nav-player-name');
    if (nav) nav.textContent = capitalize(name);

    const initial = name.charAt(0).toUpperCase();

    const avatar = document.getElementById('avatar-initial');
    if (avatar) avatar.textContent = initial;

    const playerTitle = document.getElementById('player-name');
    if (playerTitle) playerTitle.textContent = capitalize(name);

    if (document.getElementById('quick-runs')) {
        animateValue('quick-runs', 0, data.total_runs, 1500, true);
    }

    if (document.getElementById('quick-avg')) {
        animateValue('quick-avg', 0, data.batting_avg, 1500);
    }

    if (document.getElementById('quick-centuries')) {
        animateValue('quick-centuries', 0, data.centuries, 1500);
    }

    if (document.getElementById('quick-matches')) {
        animateValue('quick-matches', 0, data.matches_played, 1500);
    }

    console.log('✅ Player data loaded successfully!');
}
function loadDemoData(name) {

    const nav = document.getElementById('nav-player-name');
    if (nav) nav.textContent = capitalize(name);

    const initial = name.charAt(0).toUpperCase();

    const avatar = document.getElementById('avatar-initial');
    if (avatar) avatar.textContent = initial;

    const playerTitle = document.getElementById('player-name');
    if (playerTitle) playerTitle.textContent = capitalize(name);

    if (document.getElementById('quick-runs')) {
        document.getElementById('quick-runs').textContent = '15,000';
    }

    if (document.getElementById('quick-avg')) {
        document.getElementById('quick-avg').textContent = '42.5';
    }

    if (document.getElementById('quick-centuries')) {
        document.getElementById('quick-centuries').textContent = '35';
    }

    if (document.getElementById('quick-matches')) {
        document.getElementById('quick-matches').textContent = '380';
    }

    console.log('ℹ️ Demo data loaded safely');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function animateValue(elementId, start, end, duration, useComma = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        
        if (useComma) {
            element.textContent = Math.floor(current).toLocaleString();
        } else {
            element.textContent = current.toFixed(1);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (useComma) {
                element.textContent = end.toLocaleString();
            } else {
                element.textContent = end.toFixed(1);
            }
        }
    }
    
    requestAnimationFrame(update);
}

function showNotification(message, type) {
    console.log(`${type === 'success' ? '✅' : '⚠️'} ${message}`);
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 190, 11, 0.2)'};
        border: 1px solid ${type === 'success' ? '#00ff88' : '#ffbe0b'};
        border-radius: 8px;
        color: ${type === 'success' ? '#00ff88' : '#ffbe0b'};
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

console.log('🚀 Player Options Page Ready!');
console.log('📊 Available Options: Records | MAXX PERFORMA | Recent Performance');
