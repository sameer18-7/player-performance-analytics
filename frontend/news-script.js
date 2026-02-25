// ========================================
// CRICKET NEWS PAGE
// Live RSS Feed from Cricbuzz
// ========================================

console.log('📰 Cricket News Page Initialized');

// RSS feeds to try (using CORS proxies)
const RSS_SOURCES = [
    {
        name: 'Cricbuzz Top Stories',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.cricbuzz.com/rss-feeds/cricbuzz-news.xml'
    },
    {
        name: 'Cricbuzz Cricket News',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.cricbuzz.com/rss-feeds/cricket-news.xml'
    },
    {
        name: 'Cricbuzz via AllOrigins',
        url: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.cricbuzz.com/rss-feeds/cricbuzz-news.xml')
    }
];

// Fallback: ESPNcricinfo RSS via proxy
const FALLBACK_SOURCES = [
    {
        name: 'ESPNcricinfo News',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.espncricinfo.com/rss/content/story/feeds/6.xml'
    },
    {
        name: 'ESPN Cricket via proxy',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=http://www.espncricinfo.com/rss/content/story/feeds/6.xml'
    }
];

let allArticles = [];
let currentSourceIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM ready - Fetching live news...');
    
    document.getElementById('retry-btn')?.addEventListener('click', () => {
        currentSourceIndex = 0;
        fetchNews();
    });
    
    fetchNews();
});

// ========================================
// FETCH NEWS
// ========================================

async function fetchNews() {
    showLoading();
    
    // Try all sources
    const allSources = [...RSS_SOURCES, ...FALLBACK_SOURCES];
    
    for (let i = 0; i < allSources.length; i++) {
        try {
            console.log(`📡 Trying source: ${allSources[i].name}`);
            const articles = await fetchFromSource(allSources[i]);
            
            if (articles && articles.length > 0) {
                console.log(`✅ Got ${articles.length} articles from ${allSources[i].name}`);
                allArticles = articles;
                renderMagazine(articles);
                return;
            }
        } catch (err) {
            console.warn(`⚠️ Source failed: ${allSources[i].name}`, err.message);
        }
    }
    
    // All sources failed
    console.error('❌ All sources failed');
    showError();
}

// ========================================
// FETCH FROM SOURCE
// ========================================

async function fetchFromSource(source) {
    const response = await fetch(source.url, {
        method: 'GET',
        headers: { 'Accept': 'application/json, text/plain, */*' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    // rss2json format
    if (data.items && Array.isArray(data.items)) {
        return data.items.map(item => parseRss2JsonItem(item));
    }
    
    // allorigins format (raw XML)
    if (data.contents) {
        return parseRawXML(data.contents);
    }
    
    throw new Error('Unrecognized response format');
}

// ========================================
// PARSE rss2json ITEM
// ========================================

function parseRss2JsonItem(item) {
    return {
        title: stripHTML(item.title || 'No title'),
        description: stripHTML(item.description || item.content || ''),
        link: item.link || item.guid || '#',
        pubDate: item.pubDate || new Date().toISOString(),
        category: detectCategory(item.title || '')
    };
}

// ========================================
// PARSE RAW XML
// ========================================

function parseRawXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    
    return Array.from(items).map(item => ({
        title: stripHTML(item.querySelector('title')?.textContent || 'No title'),
        description: stripHTML(item.querySelector('description')?.textContent || ''),
        link: item.querySelector('link')?.textContent || '#',
        pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
        category: detectCategory(item.querySelector('title')?.textContent || '')
    }));
}

// ========================================
// DETECT CATEGORY
// ========================================

function detectCategory(title) {
    const t = title.toLowerCase();
    if (t.includes('ipl') || t.includes('indian premier')) return 'IPL';
    if (t.includes('ranking') || t.includes('ranked')) return 'RANKINGS';
    if (t.includes('series') || t.includes('tour') || t.includes('test match')) return 'SERIES';
    return 'CRICKET';
}

// ========================================
// RENDER MAGAZINE LAYOUT
// ========================================

function renderMagazine(articles) {
    hideLoading();
    document.getElementById('magazine-layout').style.display = 'grid';
    
    if (articles.length === 0) {
        showError();
        return;
    }
    
    // Hero: first article
    renderHero(articles[0]);
    
    // Article grid: articles 1-6
    renderArticleGrid(articles.slice(1, 7));
    
    // Sidebar: all articles (for latest feed)
    renderSidebar(articles);
    
    // Ticker: all headlines
    renderTicker(articles);
    
    console.log('✅ Magazine layout rendered');
}

// ========================================
// RENDER HERO
// ========================================

function renderHero(article) {
    document.getElementById('hero-category').textContent = article.category;
    document.getElementById('hero-title').textContent = article.title;
    document.getElementById('hero-excerpt').textContent = article.description || 'Click to read the full article on Cricbuzz.';
    document.getElementById('hero-time').textContent = formatTime(article.pubDate);
    
    const link = document.getElementById('hero-link');
    link.href = article.link;
    link.target = '_blank';
}

// ========================================
// RENDER ARTICLE GRID
// ========================================

function renderArticleGrid(articles) {
    const grid = document.getElementById('article-grid');
    grid.innerHTML = '';
    
    articles.forEach(article => {
        const catClass = {
            'IPL': 'cat-ipl',
            'RANKINGS': 'cat-rankings',
            'SERIES': 'cat-series',
            'CRICKET': 'cat-cricket'
        }[article.category] || 'cat-cricket';
        
        const card = document.createElement('a');
        card.className = 'article-card';
        card.href = article.link;
        card.target = '_blank';
        
        card.innerHTML = `
            <span class="article-category ${catClass}">${article.category}</span>
            <h3 class="article-title">${article.title}</h3>
            ${article.description ? `<p class="article-desc">${article.description}</p>` : ''}
            <div class="article-footer">
                <span class="article-time">${formatTime(article.pubDate)}</span>
                <span class="article-read">READ MORE →</span>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ========================================
// RENDER SIDEBAR
// ========================================

function renderSidebar(articles) {
    const feed = document.getElementById('sidebar-feed');
    feed.innerHTML = '';
    
    // Show up to 15 in sidebar
    articles.slice(0, 15).forEach(article => {
        const item = document.createElement('a');
        item.className = 'sidebar-item';
        item.href = article.link;
        item.target = '_blank';
        
        item.innerHTML = `
            <span class="sidebar-item-title">${article.title}</span>
            <span class="sidebar-item-time">${formatTime(article.pubDate)}</span>
        `;
        
        feed.appendChild(item);
    });
}

// ========================================
// RENDER TICKER
// ========================================

function renderTicker(articles) {
    const track = document.getElementById('ticker-track');
    
    // Build ticker items (doubled for seamless loop)
    const headlines = articles.slice(0, 10).map(a => a.title);
    const allHeadlines = [...headlines, ...headlines];
    
    track.innerHTML = allHeadlines
        .map(h => `<span class="ticker-item">${h}</span>`)
        .join('');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function stripHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

function formatTime(dateStr) {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60); // minutes
        
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return '--';
    }
}

function showLoading() {
    document.getElementById('loading-state').style.display = 'flex';
    document.getElementById('error-state').style.display = 'none';
    document.getElementById('magazine-layout').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading-state').style.display = 'none';
}

function showError() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
    document.getElementById('magazine-layout').style.display = 'none';
}

console.log('🚀 News page ready — fetching live Cricbuzz feed');
