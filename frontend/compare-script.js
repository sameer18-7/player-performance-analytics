// ========================================
// PLAYER COMPARISON PAGE
// Liquid Glass Water Effect Animation
// ========================================

console.log('⚖️ Compare Page Initialized');

// Mock player database
const playerDatabase = {
    "virat kohli": {
        name: "Virat Kohli",
        initial: "V",
        
        // Career Overview
        total_runs: 26300,
        batting_avg: 53.5,
        strike_rate: 93.2,
        centuries: 80,
        matches: 503,
        
        // Format Breakdown
        odi: { matches: 275, runs: 13500, avg: 58.2, centuries: 50 },
        test: { matches: 113, runs: 8800, avg: 48.9, centuries: 29 },
        t20i: { matches: 115, runs: 4000, avg: 52.7, strike_rate: 137.9 },
        
        // Additional Info
        batting_style: "Right-hand bat",
        bowling_style: "Right-arm medium",
        role: "Batsman",
        
        // MAXX PERFORMA
        impact_score: 87,
        prime_years: "2016 - 2019",
        prime_avg_runs: 2450,
        fastest_century: "52 balls",
        best_odi_score: "183",
        career_timeline: [2200, 2100, 2400, 2650, 2450, 1820]
    },
    
    "rohit sharma": {
        name: "Rohit Sharma",
        initial: "R",
        
        total_runs: 18500,
        batting_avg: 48.9,
        strike_rate: 95.8,
        centuries: 48,
        matches: 461,
        
        odi: { matches: 265, runs: 10500, avg: 49.2, centuries: 31 },
        test: { matches: 58, runs: 3800, avg: 46.8, centuries: 11 },
        t20i: { matches: 148, runs: 4000, avg: 32.5, strike_rate: 140.5 },
        
        batting_style: "Right-hand bat",
        bowling_style: "Right-arm off-break",
        role: "Batsman",
        
        impact_score: 82,
        prime_years: "2017 - 2020",
        prime_avg_runs: 2150,
        fastest_century: "45 balls",
        best_odi_score: "264",
        career_timeline: [1800, 1900, 2300, 2400, 2200, 1950]
    },
    
    "ms dhoni": {
        name: "MS Dhoni",
        initial: "M",
        
        total_runs: 17200,
        batting_avg: 50.4,
        strike_rate: 87.6,
        centuries: 16,
        matches: 538,
        
        odi: { matches: 350, runs: 10773, avg: 50.6, centuries: 10 },
        test: { matches: 90, runs: 4876, avg: 38.1, centuries: 6 },
        t20i: { matches: 98, runs: 1617, avg: 37.6, strike_rate: 126.1 },
        
        batting_style: "Right-hand bat",
        bowling_style: "Right-arm medium",
        role: "Wicketkeeper-Batsman",
        
        impact_score: 79,
        prime_years: "2008 - 2012",
        prime_avg_runs: 1950,
        fastest_century: "75 balls",
        best_odi_score: "183*",
        career_timeline: [2100, 2300, 2200, 1900, 1700, 1400]
    }
};

let selectedPlayers = [];
let isMaxxPerformaActive = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Loaded - Compare Page');
    
    setupEventListeners();
    autoAddPlayerFromSession();
});

// ========================================
// SETUP EVENT LISTENERS
// ========================================

function setupEventListeners() {
    const searchInput = document.getElementById('player-search-input');
    const maxButton = document.getElementById('maxx-performa-btn');
    const backButton = document.getElementById('back-to-normal-btn');
    
    // Search input with autocomplete
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleSearchInput);
    
    // Click outside to close dropdown
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-wrapper')) {
            closeAutocomplete();
        }
    });
    
    // MAXX PERFORMA button
    if (maxButton) {
        maxButton.addEventListener('click', activateMaxxPerforma);
    }
    
    // Back button
    if (backButton) {
        backButton.addEventListener('click', deactivateMaxxPerforma);
    }
}

// ========================================
// AUTO-ADD PLAYER FROM SESSION
// ========================================

function autoAddPlayerFromSession() {
    const currentPlayer = sessionStorage.getItem('searchedPlayer');
    
    if (currentPlayer) {
        const playerKey = currentPlayer.toLowerCase();
        
        if (playerDatabase[playerKey]) {
            addPlayerToSlot(playerKey);
            console.log('✅ Auto-added player from session:', currentPlayer);
        }
    }
}

// ========================================
// SEARCH INPUT & AUTOCOMPLETE
// ========================================

function handleSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();
    const dropdown = document.getElementById('autocomplete-dropdown');
    
    if (!query) {
        closeAutocomplete();
        return;
    }
    
    // Filter players
    const matches = Object.keys(playerDatabase).filter(key => 
        key.includes(query) && !selectedPlayers.includes(key)
    );
    
    if (matches.length === 0) {
        closeAutocomplete();
        return;
    }
    
    // Show dropdown
    dropdown.innerHTML = '';
    matches.forEach(key => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = playerDatabase[key].name;
        item.onclick = () => selectPlayerFromAutocomplete(key);
        dropdown.appendChild(item);
    });
    
    dropdown.classList.add('active');
}

function selectPlayerFromAutocomplete(playerKey) {
    if (selectedPlayers.length >= 3) {
        showNotification('Maximum 3 players allowed', 'error');
        return;
    }
    
    addPlayerToSlot(playerKey);
    
    // Clear input and close dropdown
    document.getElementById('player-search-input').value = '';
    closeAutocomplete();
}

function closeAutocomplete() {
    const dropdown = document.getElementById('autocomplete-dropdown');
    dropdown.classList.remove('active');
}

// ========================================
// ADD PLAYER TO SLOT
// ========================================

function addPlayerToSlot(playerKey) {
    if (selectedPlayers.includes(playerKey)) {
        showNotification('Player already added', 'error');
        return;
    }
    
    if (selectedPlayers.length >= 3) {
        showNotification('Maximum 3 players allowed', 'error');
        return;
    }
    
    selectedPlayers.push(playerKey);
    const player = playerDatabase[playerKey];
    const slotIndex = selectedPlayers.length;
    const slot = document.getElementById(`slot-${slotIndex}`);
    
    // Update slot
    slot.className = 'player-slot filled';
    slot.innerHTML = `
        <div class="player-avatar-slot">
            <span class="player-initial-slot">${player.initial}</span>
        </div>
        <div class="player-name-slot">${player.name}</div>
        <button class="remove-slot-btn" onclick="removePlayerFromSlot('${playerKey}')">✕</button>
    `;
    
    renderComparison();
    showNotification(`Added ${player.name}`, 'success');
    console.log('✅ Player added:', player.name);
}

// ========================================
// REMOVE PLAYER FROM SLOT
// ========================================

function removePlayerFromSlot(playerKey) {
    const index = selectedPlayers.indexOf(playerKey);
    if (index === -1) return;
    
    selectedPlayers.splice(index, 1);
    
    // Reset all slots
    for (let i = 1; i <= 3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        slot.className = 'player-slot empty';
        slot.innerHTML = '<span class="add-placeholder">+ Add Player</span>';
    }
    
    // Re-add remaining players
    const tempPlayers = [...selectedPlayers];
    selectedPlayers = [];
    tempPlayers.forEach(key => addPlayerToSlot(key));
    
    renderComparison();
    showNotification(`Removed ${playerDatabase[playerKey].name}`, 'info');
}

// ========================================
// RENDER COMPARISON (NORMAL STATS VIEW)
// ========================================

function renderComparison() {
    const grid = document.getElementById('comparison-grid');
    const emptyState = document.getElementById('empty-state');
    const maxButton = document.getElementById('maxx-performa-btn');
    
    if (selectedPlayers.length === 0) {
        emptyState.style.display = 'block';
        maxButton.style.display = 'none';
        grid.className = 'comparison-grid';
        
        // Clear columns
        const columns = grid.querySelectorAll('.player-stats-column');
        columns.forEach(col => col.remove());
        
        return;
    }
    
    emptyState.style.display = 'none';
    maxButton.style.display = 'inline-flex';
    
    // Set grid class
    if (selectedPlayers.length === 2) {
        grid.className = 'comparison-grid two-players';
    } else if (selectedPlayers.length === 3) {
        grid.className = 'comparison-grid three-players';
    } else {
        grid.className = 'comparison-grid';
    }
    
    // Clear existing columns
    const columns = grid.querySelectorAll('.player-stats-column');
    columns.forEach(col => col.remove());
    
    // Create column for each player
    selectedPlayers.forEach(playerKey => {
        const player = playerDatabase[playerKey];
        const column = createStatsColumn(player);
        grid.appendChild(column);
    });
    
    console.log('🔄 Comparison rendered:', selectedPlayers.length, 'players');
}

// ========================================
// CREATE STATS COLUMN
// ========================================

function createStatsColumn(player) {
    const column = document.createElement('div');
    column.className = 'player-stats-column';
    
    column.innerHTML = `
        <div class="stats-column-header">
            <h2 class="player-name-header">${player.name}</h2>
        </div>
        
        <!-- Career Overview -->
        <div class="stat-row">
            <h3 class="stat-row-title">Career Overview</h3>
            <div class="stat-items-grid">
                <div class="stat-item-card">
                    <div class="stat-item-label">Total Runs</div>
                    <div class="stat-item-value">${player.total_runs.toLocaleString()}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Average</div>
                    <div class="stat-item-value">${player.batting_avg}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Strike Rate</div>
                    <div class="stat-item-value">${player.strike_rate}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Centuries</div>
                    <div class="stat-item-value">${player.centuries}</div>
                </div>
            </div>
        </div>
        
        <!-- ODI Stats -->
        <div class="stat-row">
            <h3 class="stat-row-title">ODI Cricket</h3>
            <div class="stat-items-grid">
                <div class="stat-item-card">
                    <div class="stat-item-label">Matches</div>
                    <div class="stat-item-value">${player.odi.matches}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Runs</div>
                    <div class="stat-item-value">${player.odi.runs.toLocaleString()}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Average</div>
                    <div class="stat-item-value">${player.odi.avg}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Centuries</div>
                    <div class="stat-item-value">${player.odi.centuries}</div>
                </div>
            </div>
        </div>
        
        <!-- Test Stats -->
        <div class="stat-row">
            <h3 class="stat-row-title">Test Cricket</h3>
            <div class="stat-items-grid">
                <div class="stat-item-card">
                    <div class="stat-item-label">Matches</div>
                    <div class="stat-item-value">${player.test.matches}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Runs</div>
                    <div class="stat-item-value">${player.test.runs.toLocaleString()}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Average</div>
                    <div class="stat-item-value">${player.test.avg}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Centuries</div>
                    <div class="stat-item-value">${player.test.centuries}</div>
                </div>
            </div>
        </div>
        
        <!-- T20I Stats -->
        <div class="stat-row">
            <h3 class="stat-row-title">T20 International</h3>
            <div class="stat-items-grid">
                <div class="stat-item-card">
                    <div class="stat-item-label">Matches</div>
                    <div class="stat-item-value">${player.t20i.matches}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Runs</div>
                    <div class="stat-item-value">${player.t20i.runs.toLocaleString()}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Average</div>
                    <div class="stat-item-value">${player.t20i.avg}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Strike Rate</div>
                    <div class="stat-item-value">${player.t20i.strike_rate}</div>
                </div>
            </div>
        </div>
        
        <!-- Player Info -->
        <div class="stat-row">
            <h3 class="stat-row-title">Player Info</h3>
            <div class="stat-items-grid">
                <div class="stat-item-card">
                    <div class="stat-item-label">Role</div>
                    <div class="stat-item-value" style="font-size: 1rem;">${player.role}</div>
                </div>
                <div class="stat-item-card">
                    <div class="stat-item-label">Batting</div>
                    <div class="stat-item-value" style="font-size: 1rem;">${player.batting_style}</div>
                </div>
            </div>
        </div>
    `;
    
    return column;
}

// ========================================
// ACTIVATE MAXX PERFORMA (LIQUID GLASS)
// ========================================

function activateMaxxPerforma(e) {
    if (isMaxxPerformaActive) return;
    
    isMaxxPerformaActive = true;
    
    // Get button position for animation origin
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate percentage position
    const percentX = (centerX / window.innerWidth) * 100;
    const percentY = (centerY / window.innerHeight) * 100;
    
    // Set CSS variables for animation origin
    const overlay = document.getElementById('liquid-glass-overlay');
    overlay.style.setProperty('--mouse-x', `${percentX}%`);
    overlay.style.setProperty('--mouse-y', `${percentY}%`);
    
    // Hide normal stats view and button
    document.getElementById('normal-stats-view').style.opacity = '0';
    button.style.opacity = '0';
    
    // Add class to remove padding
    document.querySelector('.comparison-main').classList.add('maxx-active');
    
    // Activate liquid glass
    setTimeout(() => {
        overlay.classList.add('active');
    }, 100);
    
    // Show MAXX PERFORMA view after animation
    setTimeout(() => {
        document.getElementById('normal-stats-view').style.display = 'none';
        button.style.display = 'none';
        document.getElementById('maxx-performa-view').style.display = 'block';
        
        renderMaxxPerforma();
    }, 1500);
    
    console.log('⚡ MAXX PERFORMA activated');
}

// ========================================
// DEACTIVATE MAXX PERFORMA (REVERSE)
// ========================================

function deactivateMaxxPerforma() {
    if (!isMaxxPerformaActive) return;
    
    const overlay = document.getElementById('liquid-glass-overlay');
    const maxButton = document.getElementById('maxx-performa-btn');
    
    // Hide MAXX view
    document.getElementById('maxx-performa-view').style.opacity = '0';
    
    // Reverse liquid glass animation
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 300);
    
    // Show normal view after animation
    setTimeout(() => {
        document.getElementById('maxx-performa-view').style.display = 'none';
        document.getElementById('maxx-performa-view').style.opacity = '1';
        
        document.getElementById('normal-stats-view').style.display = 'block';
        maxButton.style.display = 'inline-flex';
        
        // Remove class to restore padding
        document.querySelector('.comparison-main').classList.remove('maxx-active');
        
        setTimeout(() => {
            document.getElementById('normal-stats-view').style.opacity = '1';
            maxButton.style.opacity = '1';
        }, 50);
        
        isMaxxPerformaActive = false;
    }, 1500);
    
    console.log('📊 Normal stats view restored');
}

// ========================================
// RENDER MAXX PERFORMA VIEW
// ========================================

function renderMaxxPerforma() {
    const grid = document.getElementById('maxx-comparison-grid');
    grid.innerHTML = '';
    
    if (selectedPlayers.length === 2) {
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '1fr 1fr';
        grid.style.gap = '2rem';
    } else if (selectedPlayers.length === 3) {
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '1fr 1fr 1fr';
        grid.style.gap = '2rem';
    }
    
    selectedPlayers.forEach(playerKey => {
        const player = playerDatabase[playerKey];
        const card = createMaxxCard(player);
        grid.appendChild(card);
    });
    
    // Initialize charts
    setTimeout(() => {
        selectedPlayers.forEach(playerKey => {
            initializeMaxxChart(playerKey);
        });
    }, 100);
}

// ========================================
// CREATE MAXX CARD
// ========================================

function createMaxxCard(player) {
    const card = document.createElement('div');
    card.style.cssText = `
        background: rgba(22, 27, 34, 0.6);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(0, 245, 255, 0.3);
        border-radius: 16px;
        padding: 2rem;
    `;
    
    card.innerHTML = `
        <h2 style="font-family: Orbitron; font-size: 1.5rem; color: var(--neon-cyan); text-align: center; margin-bottom: 2rem; text-transform: uppercase;">
            ${player.name}
        </h2>
        
        <!-- Impact Score -->
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Impact Index Score</div>
            <div style="font-family: Orbitron; font-size: 3.5rem; font-weight: 900; color: var(--neon-cyan); text-shadow: 0 0 20px rgba(0, 245, 255, 0.5);">${player.impact_score}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">/100</div>
        </div>
        
        <!-- Prime Phase -->
        <div style="background: linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(255, 0, 110, 0.1)); border: 1px solid rgba(0, 245, 255, 0.3); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">🌟 Prime Phase</div>
            <div style="font-family: Orbitron; font-size: 1.8rem; font-weight: 900; background: linear-gradient(135deg, #00f5ff, #ffbe0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">${player.prime_years}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">Strongest 3-year span</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div style="background: rgba(13, 17, 23, 0.6); border-radius: 8px; padding: 0.75rem; text-align: center;">
                    <div style="font-size: 0.7rem; color: var(--text-muted);">AVG RUNS/YEAR</div>
                    <div style="font-family: Orbitron; font-size: 1.3rem; font-weight: 900; color: var(--neon-cyan);">${player.prime_avg_runs}</div>
                </div>
                <div style="background: rgba(13, 17, 23, 0.6); border-radius: 8px; padding: 0.75rem; text-align: center;">
                    <div style="font-size: 0.7rem; color: var(--text-muted);">AVERAGE</div>
                    <div style="font-family: Orbitron; font-size: 1.3rem; font-weight: 900; color: var(--neon-cyan);">${player.batting_avg}</div>
                </div>
            </div>
        </div>
        
        <!-- Elite Performance Stats Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
            <div style="background: rgba(13, 17, 23, 0.8); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; padding: 1.25rem; text-align: center; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.borderColor='var(--neon-cyan)'" onmouseout="this.style.borderColor='rgba(0, 245, 255, 0.2)'">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎯</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Fastest Century</div>
                <div style="font-family: Orbitron; font-size: 1.3rem; font-weight: 900; color: var(--neon-cyan);">${player.fastest_century}</div>
            </div>
            <div style="background: rgba(13, 17, 23, 0.8); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; padding: 1.25rem; text-align: center; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.borderColor='var(--neon-cyan)'" onmouseout="this.style.borderColor='rgba(0, 245, 255, 0.2)'">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔥</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Best ODI Score</div>
                <div style="font-family: Orbitron; font-size: 1.3rem; font-weight: 900; color: var(--neon-cyan);">${player.best_odi_score}</div>
            </div>
            <div style="background: rgba(13, 17, 23, 0.8); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; padding: 1.25rem; text-align: center; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.borderColor='var(--neon-cyan)'" onmouseout="this.style.borderColor='rgba(0, 245, 255, 0.2)'">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">💯</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Centuries</div>
                <div style="font-family: Orbitron; font-size: 1.3rem; font-weight: 900; color: var(--neon-cyan);">${player.centuries}</div>
            </div>
            <div style="background: rgba(13, 17, 23, 0.8); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; padding: 1.25rem; text-align: center; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.borderColor='var(--neon-cyan)'" onmouseout="this.style.borderColor='rgba(0, 245, 255, 0.2)'">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚡</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Strike Rate</div>
                <div style="font-family: Orbitron; font-size: 1.3rem; font-weight: 900; color: var(--neon-cyan);">${player.strike_rate}</div>
            </div>
        </div>
        
        <!-- Format Distribution Chart -->
        <div style="background: rgba(0, 245, 255, 0.05); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
            <div style="font-size: 0.9rem; font-family: Orbitron; color: var(--neon-cyan); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">International Runs by Format</div>
            <div style="height: 200px;">
                <canvas id="format-chart-${player.name.replace(/\s+/g, '-').toLowerCase()}"></canvas>
            </div>
        </div>
        
        <!-- Career Timeline Chart -->
        <div style="background: rgba(0, 245, 255, 0.05); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; padding: 1.5rem;">
            <div style="font-size: 0.9rem; font-family: Orbitron; color: var(--neon-cyan); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">Career Performance Timeline</div>
            <div style="height: 200px;">
                <canvas id="timeline-chart-${player.name.replace(/\s+/g, '-').toLowerCase()}"></canvas>
            </div>
        </div>
    `;
    
    return card;
}

// ========================================
// INITIALIZE MAXX CHARTS
// ========================================

function initializeMaxxChart(playerKey) {
    const player = playerDatabase[playerKey];
    const playerSlug = player.name.replace(/\s+/g, '-').toLowerCase();
    
    // Format Distribution Pie Chart
    const formatCtx = document.getElementById(`format-chart-${playerSlug}`);
    if (formatCtx) {
        new Chart(formatCtx, {
            type: 'doughnut',
            data: {
                labels: ['Test', 'ODI', 'T20I'],
                datasets: [{
                    data: [player.test.runs, player.odi.runs, player.t20i.runs],
                    backgroundColor: [
                        'rgba(255, 0, 110, 0.8)',
                        'rgba(0, 245, 255, 0.8)',
                        'rgba(255, 190, 11, 0.8)'
                    ],
                    borderColor: [
                        '#ff006e',
                        '#00f5ff',
                        '#ffbe0b'
                    ],
                    borderWidth: 2
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
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': ' + value.toLocaleString() + ' runs';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Career Timeline Line Chart
    const timelineCtx = document.getElementById(`timeline-chart-${playerSlug}`);
    if (timelineCtx) {
        new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Runs per Year',
                    data: player.career_timeline,
                    borderColor: '#00f5ff',
                    backgroundColor: 'rgba(0, 245, 255, 0.15)',
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
                    legend: { display: false },
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
                        beginAtZero: false,
                        ticks: { 
                            color: '#8b949e',
                            font: {
                                family: 'Space Mono',
                                size: 11
                            }
                        },
                        grid: { color: 'rgba(0, 245, 255, 0.1)' }
                    },
                    x: {
                        ticks: { 
                            color: '#8b949e',
                            font: {
                                family: 'Space Mono',
                                size: 11
                            }
                        },
                        grid: { color: 'rgba(0, 245, 255, 0.1)' }
                    }
                }
            }
        });
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function showNotification(message, type) {
    const colors = {
        success: { bg: 'rgba(0, 255, 136, 0.2)', border: '#00ff88', text: '#00ff88' },
        error: { bg: 'rgba(255, 0, 110, 0.2)', border: '#ff006e', text: '#ff006e' },
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
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(toastStyle);

console.log('🚀 Compare Page Ready!');
console.log('⚖️ Add players to compare');
