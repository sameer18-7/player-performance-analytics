// ========================================
// FAVOURITES PAGE
// Bookmark Bar & Dynamic Stats Display
// ========================================

console.log('⭐ Favourites Page Initialized');

// Mock player database
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

let currentSelectedPlayer = null;

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ DOM Loaded - Favourites Page');
    
    loadBookmarks();
    setupRemoveButton();
});

// ========================================
// LOAD BOOKMARKS
// ========================================

function loadBookmarks() {
    const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    
    console.log('📚 Loading bookmarks:', favourites);
    
    if (favourites.length === 0) {
        showEmptyState();
        return;
    }
    
    // Sort alphabetically
    favourites.sort();
    
    const bookmarkItems = document.getElementById('bookmark-items');
    bookmarkItems.innerHTML = '';
    
    favourites.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'bookmark-item';
        if (index === 0) item.classList.add('active');
        item.textContent = capitalize(player);
        item.dataset.player = player;
        
        item.addEventListener('click', function() {
            selectPlayer(player, this);
        });
        
        bookmarkItems.appendChild(item);
    });
    
    // Load first player by default
    if (favourites.length > 0) {
        selectPlayer(favourites[0]);
    }
    
    console.log('✅ Bookmarks loaded');
}

// ========================================
// SELECT PLAYER
// ========================================

function selectPlayer(playerName, clickedElement = null) {
    currentSelectedPlayer = playerName;
    
    // Update active bookmark
    document.querySelectorAll('.bookmark-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (clickedElement) {
        clickedElement.classList.add('active');
    } else {
        const firstItem = document.querySelector(`.bookmark-item[data-player="${playerName}"]`);
        if (firstItem) firstItem.classList.add('active');
    }
    
    // Load player stats
    loadPlayerStats(playerName);
    
    // Show stats section, hide empty state
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('player-stats-section').style.display = 'block';
    
    // Store in session for other pages
    sessionStorage.setItem('searchedPlayer', playerName);
    
    console.log('👤 Selected player:', playerName);
}

// ========================================
// LOAD PLAYER STATS
// ========================================

function loadPlayerStats(playerName) {
    const data = mockPlayerData[playerName.toLowerCase()];
    
    if (!data) {
        console.warn('⚠️ No data for player:', playerName);
        showNotification('Player data not available', 'error');
        return;
    }
    
    // Update title
    document.getElementById('stats-player-name').textContent = capitalize(playerName);
    
    // Update quick stats
    document.getElementById('qstat-runs').textContent = data.total_runs.toLocaleString();
    document.getElementById('qstat-avg').textContent = data.batting_avg.toFixed(1);
    document.getElementById('qstat-sr').textContent = data.strike_rate.toFixed(1);
    document.getElementById('qstat-centuries').textContent = data.centuries;
    document.getElementById('qstat-matches').textContent = data.matches_played;
    document.getElementById('qstat-consistency').textContent = data.consistency_index.toFixed(1);
    
    // Update ODI stats
    document.getElementById('odi-matches').textContent = data.odi.matches;
    document.getElementById('odi-runs').textContent = data.odi.runs.toLocaleString();
    document.getElementById('odi-avg').textContent = data.odi.avg.toFixed(1);
    document.getElementById('odi-centuries').textContent = data.odi.centuries;
    
    // Update Test stats
    document.getElementById('test-matches').textContent = data.test.matches;
    document.getElementById('test-runs').textContent = data.test.runs.toLocaleString();
    document.getElementById('test-avg').textContent = data.test.avg.toFixed(1);
    document.getElementById('test-centuries').textContent = data.test.centuries;
    
    // Update T20I stats
    document.getElementById('t20-matches').textContent = data.t20.matches;
    document.getElementById('t20-runs').textContent = data.t20.runs.toLocaleString();
    document.getElementById('t20-sr').textContent = data.t20.strike_rate.toFixed(1);
    document.getElementById('t20-avg').textContent = data.t20.avg.toFixed(1);
    
    console.log('✅ Stats loaded for:', playerName);
}

// ========================================
// SHOW EMPTY STATE
// ========================================

function showEmptyState() {
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('player-stats-section').style.display = 'none';
    document.querySelector('.bookmark-bar').style.display = 'none';
}

// ========================================
// REMOVE FROM FAVOURITES
// ========================================

function setupRemoveButton() {
    const removeBtn = document.getElementById('remove-fav-btn');
    
    removeBtn.addEventListener('click', function() {
        if (!currentSelectedPlayer) return;
        
        const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
        const updated = favourites.filter(p => p !== currentSelectedPlayer.toLowerCase());
        
        localStorage.setItem('favourites', JSON.stringify(updated));
        
        showNotification(`Removed ${capitalize(currentSelectedPlayer)} from favourites`, 'success');
        
        console.log('💔 Removed from favourites:', currentSelectedPlayer);
        
        // Reload bookmarks
        setTimeout(() => {
            loadBookmarks();
        }, 500);
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function showNotification(message, type) {
    const colors = {
        success: { bg: 'rgba(0, 255, 136, 0.2)', border: '#00ff88', text: '#00ff88' },
        error: { bg: 'rgba(255, 0, 110, 0.2)', border: '#ff006e', text: '#ff006e' }
    };
    
    const color = colors[type] || colors.success;
    
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

console.log('🚀 Favourites Page Ready!');
console.log('⭐ Your favourite players await');
