// Main JavaScript for dynamically loading and rendering content

let siteData = {};

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        siteData = await response.json();
        console.log('Data loaded successfully:', siteData);
        renderContent();
    } catch (error) {
        console.error('Error loading data:', error);
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
                <h1>Error Loading Website Data</h1>
                <p>There was a problem loading the website content. Please try refreshing or check back later.</p>
                <p style="color: #666; font-size: 0.9rem;">Details: ${error.message}</p>
            </div>
        `;
    }
}

// Render all content sections
function renderContent() {
    renderAbout();
    renderNews();
    renderAwards();
    renderPublications();
    renderSidebar();
    updateFooter();

    // Re-initialize Twitter widgets if available
    if (typeof twttr !== 'undefined' && twttr.widgets) {
        twttr.widgets.load();
    }
}

// Render About Section
function renderAbout() {
    const personal = siteData.personal;
    const bio = siteData.bio;

    // Update profile image
    const profileImg = document.querySelector('.profile-image');
    if (profileImg) {
        profileImg.src = personal.photo;
        profileImg.alt = personal.name;
    }

    // Update photo caption
    const caption = document.querySelector('.photo-caption');
    if (caption) {
        caption.innerHTML = `
            ${personal.photoCaption}<br>
            ${personal.photoCredit} <a href="${personal.photoCreditLink}">${personal.photoCreditName}</a>
        `;
    }

    // Update name and title
    const nameEl = document.querySelector('.profile-name');
    if (nameEl) {
        nameEl.innerHTML = `
            ${personal.name}
            ${renderSocialLinks()}
        `;
    }

    const titleEl = document.querySelector('.profile-title');
    if (titleEl) {
        titleEl.textContent = personal.title;
    }

    // Update integrated bio
    const bioEl = document.querySelector('.bio-text');
    if (bioEl && bio.paragraphs) {
        bioEl.innerHTML = bio.paragraphs
            .map(p => `<p>${formatTextWithLinks(p, bio.links)}</p>`)
            .join('');
    } else if (bioEl && bio.text) {
        bioEl.innerHTML = formatTextWithLinks(bio.text, bio.links);
    }



    // Update contact email
    const contactEmail = document.querySelector('.contact-email');
    if (contactEmail && personal.email) {
        contactEmail.href = `mailto:${personal.email}`;
        contactEmail.textContent = personal.email;
    }
}

// Render Sidebar content (Interests, Education, Hobbies)
function renderSidebar() {
    const sidebar = siteData.sidebar;
    const sidebarContainer = document.querySelector('.sidebar-content');
    if (!sidebarContainer || !sidebar) return;

    let html = '';

    // Research Interests
    if (sidebar.interests) {
        html += `
            <div class="sidebar-info-block">
                <h3 class="sidebar-info-title">Research Interests</h3>
                <div class="interests-tags">
                    ${sidebar.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                </div>
            </div>
        `;
    }

    sidebarContainer.innerHTML = html;
}

// Render social links
function renderSocialLinks() {
    const social = siteData.personal.social;
    return `
        <a href="${social.twitter.url}" class="twitter-follow-button" data-show-count="true" data-size="medium" target="_blank" rel="noopener noreferrer">
            Follow ${social.twitter.handle}
        </a>
        <a href="${social.scholar.url}" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar">
            <img src="${social.scholar.icon}" alt="Google Scholar" width="28" height="28">
        </a>
        <a href="${social.linkedin.url}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <img src="${social.linkedin.icon}" alt="LinkedIn" width="28" height="28">
        </a>
        <a href="${social.github.url}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <img src="${social.github.icon}" alt="GitHub" width="28" height="28">
        </a>
        
    `;
}

// Format text with links
function formatTextWithLinks(text, links) {
    let formatted = text;
    if (links) {
        Object.keys(links).forEach(key => {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            formatted = formatted.replace(regex, `<a href="${links[key]}" target="_blank" rel="noopener noreferrer">${key}</a>`);
        });
    }
    return formatted;
}



// Render News Section (Folded/Scrollable in Right Panel)
function renderNews() {
    const newsContainer = document.querySelector('.news-list');
    if (!newsContainer || !siteData.news) return;

    newsContainer.innerHTML = siteData.news.map(item => {
        const datePart = item.date ? `<span class="news-date">${item.date}</span>` : '';
        const className = item.important ? 'news-item important' : 'news-item';
        return `<li class="${className}">${datePart}${item.text}</li>`;
    }).join('');
}



// Render Awards Section
function renderAwards() {
    const awardsContainer = document.querySelector('#awards .awards-list');
    if (!awardsContainer) return;

    if (!siteData.awards || siteData.awards.length === 0) {
        document.querySelector('#awards').style.display = 'none';
        return;
    }

    awardsContainer.innerHTML = siteData.awards.map(award => `
        <div class="work-block">
            <div class="work-period">${award.year}</div>
            <div class="work-content">
                <h4>${award.award}</h4>
                ${award.paper ? `<p>${award.paper}</p>` : ''}
            </div>
        </div>
    `).join('');
}



// Render Publications Section
function renderPublications() {
    const pubContainer = document.querySelector('#includedPubs');
    if (!pubContainer) return;

    if (!siteData.publications || siteData.publications.length === 0) {
        document.querySelector('#publication').style.display = 'none';
        return;
    }

    // Group publications by year
    const grouped = siteData.publications.reduce((acc, pub) => {
        const year = pub.year || 'Unknown';
        if (!acc[year]) acc[year] = [];
        acc[year].push(pub);
        return acc;
    }, {});

    // Get sorted years (descending)
    const years = Object.keys(grouped).sort((a, b) => {
        if (a === 'Before 2021') return 1;
        if (b === 'Before 2021') return -1;
        return b - a;
    });

    let html = '<div id="publication"><h2 class="section-title">Publications</h2>';

    years.forEach(year => {
        html += `<h3 class="subsection-title">${year}</h3>`;
        grouped[year].forEach(pub => {
            html += renderPublicationItem(pub);
        });
    });

    html += '</div>';
    pubContainer.innerHTML = html;
}

// Render individual publication item
function renderPublicationItem(pub) {
    const venueClass = pub.venueClass ? ` ${pub.venueClass}` : '';
    const authors = pub.authors.map(author =>
        author.includes('Jiao Sun') ? `<strong>${author}</strong>` : author
    ).join(', ');

    let linksHtml = '';
    if (pub.links) {
        linksHtml = '<div class="publication-links">' +
            Object.keys(pub.links).map(label => {
                const icon = label.toLowerCase().includes('github') ? 'github_square.png' :
                    label.toLowerCase().includes('video') ? 'video.png' :
                        label.toLowerCase().includes('demo') ? 'video_new.png' : 'link.png';
                return `
                    <a href="${pub.links[label]}" target="_blank" rel="noopener noreferrer" aria-label="${label}">
                        <img src="images/icon/${icon}" alt="${label}" width="24" height="24">
                    </a>
                `;
            }).join('') +
            '</div>';
    }

    return `
        <div class="publication-item">
            <div class="publication-venue">
                <span class="badge${venueClass}">${pub.venue}</span>
            </div>
            <div class="publication-content">
                <div class="publication-authors">${authors}</div>
                <div class="publication-title">
                    <a href="${pub.url || '#'}" target="_blank" rel="noopener noreferrer">
                        ${pub.title}
                    </a>
                </div>
                ${pub.tags ? `<div class="publication-tags">${pub.tags.join(', ')}</div>` : ''}
                ${pub.note ? `<div class="publication-note">${pub.note}</div>` : ''}
                ${pub.award ? `
                    <div class="award-badge">
                        <img src="images/icon/award.png" alt="Award">
                        ${pub.award}
                    </div>
                ` : ''}
                ${linksHtml}
            </div>
        </div>
    `;
}



// Update Footer
function updateFooter() {
    const footerDate = document.querySelector('.footer-date');
    if (footerDate) {
        footerDate.textContent = siteData.lastUpdate;
    }
}

// Navbar scroll effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initNavbar();
    initSmoothScroll();
});

