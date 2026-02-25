// ========================================
// PLAYER RECORDS PAGE
// Sliding Format Tabs Animation
// ========================================

console.log('🏏 Player Records Page Initialized');

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ DOM Loaded - Records Page');
    
    // ========================================
    // GET PLAYER FROM SESSION
    // ========================================
    
    const playerName = sessionStorage.getItem('searchedPlayer');
    
    if (!playerName) {
        console.warn('⚠️ No player selected, redirecting to home');
        window.location.href = 'home.html';
        return;
    }
    
    console.log('📊 Loading records for:', playerName);
    
    // Update navigation
    document.getElementById('nav-player-name').textContent = capitalize(playerName);
    
    // Update profile
    loadPlayerProfile(playerName);
    
    // ========================================
    // FORMAT TAB SWITCHING WITH SLIDING ANIMATION
    // ========================================
    
    const tabButtons = document.querySelectorAll('.tab-button');
    const statsSlider = document.getElementById('stats-slider');
    const statsSections = document.querySelectorAll('.stats-section');
    
    let currentIndex = 0;
    const formats = ['odi', 'test', 't20i', 'overall'];
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const newIndex = formats.indexOf(format);
            
            console.log(`🔄 Switching format: ${formats[currentIndex]} → ${format}`);
            
            // Determine slide direction
            const direction = newIndex > currentIndex ? -100 : 100;
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Remove active class from all sections
            statsSections.forEach(section => section.classList.remove('active'));
            
            // CRITICAL: SLIDING ANIMATION USING TRANSFORM
            // This creates the smooth horizontal slide effect
            const translateX = -(newIndex * 100);
            statsSlider.style.transform = `translateX(${translateX}%)`;
            
            // Add active class to new section after slight delay
            setTimeout(() => {
                statsSections[newIndex].classList.add('active');
            }, 100);
            
            // Update current index
            currentIndex = newIndex;
            
            console.log(`✅ Active format: ${format} (index: ${newIndex})`);
        });
    });
    
    // ========================================
    // FLOATING HEART BUTTON FUNCTIONALITY
    // ========================================
    
    const floatingHeartBtn = document.getElementById('floating-heart-btn');
    const heartIcon = floatingHeartBtn.querySelector('.heart-icon');
    
    // Check if player is already liked
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
            // Remove from favourites
            const updated = currentFavourites.filter(p => p !== playerKey);
            localStorage.setItem('favourites', JSON.stringify(updated));
            
            floatingHeartBtn.classList.remove('liked');
            heartIcon.textContent = '♡';
            
            showNotification(`Removed ${capitalize(playerName)} from favourites`, 'info');
            console.log('💔 Removed from favourites');
        } else {
            // Add to favourites
            currentFavourites.push(playerKey);
            localStorage.setItem('favourites', JSON.stringify(currentFavourites));
            
            floatingHeartBtn.classList.add('liked');
            heartIcon.textContent = '♥';
            
            // NEW ANIMATION: Pop out, float up, rotate 270°, fade away
            createFloatingHeartAnimation(e);
            
            showNotification(`Added ${capitalize(playerName)} to favourites`, 'success');
            console.log('❤️ Added to favourites');
        }
    });
    
});

// ========================================
// LOAD PLAYER PROFILE
// ========================================

function loadPlayerProfile(name) {
    // Update player photo initial
    const initial = name.charAt(0).toUpperCase();
    document.getElementById('photo-initial').textContent = initial;
    
    // Mock data - in production, fetch from backend
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
    } else {
        // Use default values
        document.getElementById('full-name').textContent = capitalize(name);
    }
    
    console.log('✅ Profile loaded');
}

// ========================================
// FLOATING HEART ANIMATION (270° ROTATION)
// ========================================

function createFloatingHeartAnimation(event) {
    // Get button position
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    
    // Create animated heart
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

// Add new heart animation CSS
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
    console.log(`${type === 'success' ? '✅' : 'ℹ️'} ${message}`);
    
    const colors = {
        success: { bg: 'rgba(0, 255, 136, 0.2)', border: '#00ff88', text: '#00ff88' },
        info: { bg: 'rgba(0, 245, 255, 0.2)', border: '#00f5ff', text: '#00f5ff' },
        error: { bg: 'rgba(255, 0, 110, 0.2)', border: '#ff006e', text: '#ff006e' }
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

// Add toast animations
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

console.log('🚀 Records Page Ready!');
console.log('📊 Format tabs: ODI | TEST | T20I | OVERALL');
console.log('💫 Sliding animation active');
