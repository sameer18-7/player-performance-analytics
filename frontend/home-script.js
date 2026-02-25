// ========================================
// CRICKET ANALYTICS PLATFORM - HOME PAGE
// JavaScript with Counter Animations
// ========================================

console.log('🏏 Cricket Analytics Platform Initialized');

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ DOM Loaded - Initializing animations');
    
    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    // Intersection Observer for stat blocks
    const blockObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all stat blocks
    const statBlocks = document.querySelectorAll('.stat-block');
    statBlocks.forEach(block => {
        blockObserver.observe(block);
    });
    
    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    
    const searchInput = document.getElementById('player-search');
    const searchBtn = document.querySelector('.search-btn');
    
    function handleSearch() {
        const playerName = searchInput.value.trim();
        
        if (!playerName) {
            showNotification('Please enter a player name', 'error');
            return;
        }
        
        console.log('🔍 Searching for:', playerName);
        
        // Store player name in sessionStorage
        sessionStorage.setItem('searchedPlayer', playerName);
        
        // Redirect to player options page
        window.location.href = 'player.html';
    }
    
    // Search button click
    searchBtn.addEventListener('click', handleSearch);
    
    // Enter key press
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    function showNotification(message, type) {
        console.log(`${type === 'success' ? '✅' : '❌'} ${message}`);
        
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 0, 110, 0.2)'};
            border: 1px solid ${type === 'success' ? '#00ff88' : '#ff006e'};
            border-radius: 8px;
            color: ${type === 'success' ? '#00ff88' : '#ff006e'};
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
    
    console.log('🎮 Event listeners attached');
    console.log('💫 Animations ready');
    console.log('🔍 Search for a player to begin');
});

// Add CSS animations dynamically
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

console.log('🚀 Cricket Analytics Platform ready!');
