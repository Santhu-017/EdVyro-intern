let internshipsData = [];

async function fetchInternships() {
    boardElement.innerHTML = '';
    renderSkeletons(itemsPerPage, boardElement, currentViewMode);
    
    try {
        const response = await fetch('/api/v1/internships?limit=100');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        internshipsData = data.data.map(item => ({
            id: item.id,
            role: item.title,
            company: item.company,
            location: item.location,
            domain: item.domain || "engineering",
            stipendRaw: parseInt(item.stipend ? item.stipend.replace(/[^0-9]/g, '') : '0') || 0,
            stipend: item.stipend || 'Unpaid',
            durationRaw: parseInt(item.duration) || 3,
            duration: item.duration || "3 Months",
            isPaid: !!item.stipend && item.stipend !== 'Unpaid',
            isRemote: item.is_remote,
            tags: item.skills || [],
            description: item.description || '',
            requirements: item.skills || []
        }));
        
        applyFiltersAndRender(true);
        renderRecentlyViewed();
        fetchApplications();
    } catch (error) {
        boardElement.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-warning-circle empty-icon" style="color: var(--error-red)"></i>
                <h3>Connection Error</h3>
                <p>We couldn't load the internships. Please try again.</p>
                <button class="primary-btn outline-btn" onclick="fetchInternships()" style="margin-top:1rem;">Retry</button>
            </div>
        `;
        loadMoreContainer.style.display = 'none';
    }
}

// DOM Elements
const boardElement = document.getElementById('internship-board');
const applicationsBoard = document.getElementById('applications-board');
const recentlyViewedSection = document.getElementById('recently-viewed-section');
const recentlyViewedBoard = document.getElementById('recently-viewed-board');
const searchInput = document.getElementById('search-input');
const domainFilter = document.getElementById('domain-filter');
const sortFilter = document.getElementById('sort-filter');
const remoteToggle = document.getElementById('remote-toggle');
const paidToggle = document.getElementById('paid-toggle');
const savedToggle = document.getElementById('saved-toggle');
const stipendSlider = document.getElementById('stipend-slider');
const stipendVal = document.getElementById('stipend-val');
const resultsCount = document.getElementById('results-count');
const themeToggleBtn = document.getElementById('theme-toggle');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadMoreContainer = document.getElementById('load-more-container');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
const advancedSidebar = document.querySelector('.advanced-sidebar');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const viewSections = document.querySelectorAll('.view-section');

// Analytics Elements
const statApplied = document.getElementById('stat-applied');
const statReview = document.getElementById('stat-review');
const statInterview = document.getElementById('stat-interview');
const statAccepted = document.getElementById('stat-accepted');

// Modal Elements
const detailsModal = document.getElementById('internship-modal');
const modalBody = document.getElementById('modal-body');
const closeDetailsBtn = document.getElementById('close-modal-btn');
const shareModalBtn = document.getElementById('share-modal-btn');
const applyModal = document.getElementById('apply-modal');
const closeApplyBtn = document.getElementById('close-apply-btn');
const applyForm = document.getElementById('application-form');

// Drag Drop Elements
const dropZone = document.getElementById('resume-drop-zone');
const fileInput = document.getElementById('applicant-resume');
const fileNameDisplay = document.getElementById('file-name-display');

// Profile Elements
const profileDropZone = document.getElementById('profile-drop-zone');
const profileResumeInput = document.getElementById('profile-resume');
const profileFileName = document.getElementById('profile-file-name');
const parseResumeBtn = document.getElementById('parse-resume-btn');
const profileEmail = document.getElementById('profile-email');
const profileSkillsContainer = document.getElementById('profile-skills-container');

// State
let myProfile = JSON.parse(localStorage.getItem('myProfile')) || null;
let savedInternships = JSON.parse(localStorage.getItem('savedInternships')) || [];
let myApplications = [];
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
let filteredData = [...internshipsData];
let currentViewMode = 'grid'; // grid | list
const itemsPerPage = 6;
let currentPage = 1;
let currentInternshipId = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    themeToggleBtn.addEventListener('click', toggleTheme);

    setupProfileDropZone();
    renderProfile();
    
    // Toggle Filters
    if(toggleFiltersBtn && advancedSidebar) {
        toggleFiltersBtn.addEventListener('click', () => {
            advancedSidebar.classList.toggle('collapsed');
            const isCollapsed = advancedSidebar.classList.contains('collapsed');
            toggleFiltersBtn.classList.toggle('active', !isCollapsed);
        });
    }

    if(parseResumeBtn) parseResumeBtn.addEventListener('click', handleProfileUpload);

    fetchInternships();

    // Event Listeners for Filters
    [searchInput, domainFilter, sortFilter, remoteToggle, paidToggle, savedToggle].forEach(el => {
        el.addEventListener('input', () => applyFiltersAndRender(true));
        el.addEventListener('change', () => applyFiltersAndRender(true));
    });

    stipendSlider.addEventListener('input', (e) => {
        stipendVal.innerText = `$${e.target.value}`;
        applyFiltersAndRender(true);
    });

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderInternships(filteredData, false);
    });

    // View Toggles
    gridViewBtn.addEventListener('click', () => setViewMode('grid'));
    listViewBtn.addEventListener('click', () => setViewMode('list'));

    // Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.currentTarget.dataset.target, e.currentTarget));
    });

    // Recently Viewed
    clearHistoryBtn.addEventListener('click', () => {
        recentlyViewed = [];
        localStorage.setItem('recentlyViewed', JSON.stringify([]));
        renderRecentlyViewed();
        showToast('History cleared', 'info');
    });

    // Modal Event Listeners
    closeDetailsBtn.addEventListener('click', () => detailsModal.close());
    closeApplyBtn.addEventListener('click', () => applyModal.close());
    [detailsModal, applyModal].forEach(m => {
        m.addEventListener('click', (e) => { if (e.target === m) m.close(); });
    });
    
    // Share Button
    shareModalBtn.addEventListener('click', shareInternship);

    // Form Submission
    applyForm.addEventListener('submit', handleApplySubmit);

    // Drag and Drop
    setupDragAndDrop();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}
function toggleTheme() {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info', 'ph-palette');
}
function updateThemeIcon(theme) {
    document.querySelector('.theme-icon-dark').style.display = theme === 'dark' ? 'none' : 'block';
    document.querySelector('.theme-icon-light').style.display = theme === 'dark' ? 'block' : 'none';
}

// Toast System
function showToast(message, type = 'info', iconClass = 'ph-info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = type === 'success' && iconClass === 'ph-info' ? 'ph-check-circle' : iconClass;
    toast.innerHTML = `<i class="ph ${icon} toast-icon" style="font-size: 1.25rem;"></i><span class="toast-message">${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

// Tab Routing
function switchTab(targetId, activeBtn) {
    tabBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    
    viewSections.forEach(section => {
        if (section.id === targetId) {
            section.style.display = section.id === 'board-view' ? 'flex' : 'block';
        } else {
            section.style.display = 'none';
        }
    });

    if (targetId === 'applications-view') {
        renderApplications();
    }
}

// Grid/List View Logic
function setViewMode(mode) {
    currentViewMode = mode;
    if (mode === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        boardElement.className = 'board-grid';
    } else {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        boardElement.className = 'board-list';
    }
}

// Highlight Helper
function highlightText(text, term) {
    if (!term) return text;
    // Escape regex characters
    const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Skeleton Renderer
function renderSkeletons(count, container, mode) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-card';
        if(mode === 'list') {
            skeleton.innerHTML = `
                <div class="skeleton-title" style="width: 30%; margin:0;"></div>
                <div class="skeleton-body"><div class="skeleton-text full"></div></div>
                <div class="skeleton-footer"><div class="skeleton-btn"></div></div>
            `;
        } else {
            skeleton.innerHTML = `
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div style="margin-top: 1rem;"><div class="skeleton-text full" style="margin-bottom: 0.5rem"></div><div class="skeleton-text full"></div></div>
                <div class="skeleton-footer"><div class="tags"><div class="skeleton-tag"></div></div><div class="skeleton-btn"></div></div>
            `;
        }
        fragment.appendChild(skeleton);
    }
    container.appendChild(fragment);
    if(container === boardElement) loadMoreContainer.style.display = 'none';
}

// Filter and Sort Logic
function applyFiltersAndRender(resetPagination = false) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const domainValue = domainFilter.value;
    const sortValue = sortFilter.value;
    const requiresRemote = remoteToggle.checked;
    const requiresPaid = paidToggle.checked;
    const requiresSaved = savedToggle.checked;
    const minStipend = parseInt(stipendSlider.value);

    if (resetPagination) {
        currentPage = 1;
        boardElement.innerHTML = ''; 
    }

    filteredData = internshipsData.filter(item => {
        const matchesSearch = item.role.toLowerCase().includes(searchTerm) || 
                              item.company.toLowerCase().includes(searchTerm) ||
                              item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        const matchesDomain = domainValue === 'all' || item.domain === domainValue;
        const matchesRemote = !requiresRemote || item.isRemote;
        const matchesPaid = !requiresPaid || item.isPaid;
        const matchesSaved = !requiresSaved || savedInternships.includes(item.id);
        const matchesStipend = item.stipendRaw >= minStipend;
        const hasApplied = myApplications.some(app => app.id === item.id);

        return matchesSearch && matchesDomain && matchesRemote && matchesPaid && matchesSaved && matchesStipend && !hasApplied;
    });

    filteredData.forEach(item => {
        if (myProfile && (myProfile.skills || myProfile.rawText)) {
            let matches = 0;
            if (myProfile.skills && myProfile.skills.length > 0) {
                const profileSkillsLower = myProfile.skills.map(s => s.toLowerCase());
                item.tags.forEach(s => {
                    if (profileSkillsLower.includes(s.toLowerCase())) matches++;
                });
            }
            
            // Weighted Scoring System - "Perfect Match" Logic
            let skillScore = 0;
            if (matches > 0) {
                // Instant boost for ANY overlapping skill (base 40 points)
                skillScore = 40 + (matches / item.tags.length) * 20;
            } else if (myProfile.skills.length > 0) {
                // Even if no exact match, give a baseline if they have a profile
                skillScore = 15;
            }
            
            // Role Match (30 points)
            let roleScore = 0;
            if (myProfile.rawText && item.role) {
                const roleRegex = new RegExp(item.role.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
                if (roleRegex.test(myProfile.rawText)) roleScore = 30;
            }

            // Domain Match (30 points)
            let domainScore = 0;
            if (myProfile.rawText && item.domain) {
                const domainRegex = new RegExp(item.domain.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
                if (domainRegex.test(myProfile.rawText)) domainScore = 30;
            }

            let totalScore = skillScore + roleScore + domainScore;
            
            // Small random boost to break ties and make it feel more dynamic (0-2%)
            if (totalScore > 0) totalScore += Math.random() * 2;
            
            item.matchScore = Math.min(100, Math.round(totalScore));
        } else {
            item.matchScore = null;
        }
    });

    if (sortValue === 'stipend-high') filteredData.sort((a, b) => b.stipendRaw - a.stipendRaw);
    else if (sortValue === 'duration-short') filteredData.sort((a, b) => a.durationRaw - b.durationRaw);
    else filteredData.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    renderInternships(filteredData, resetPagination);
}

// Render Main Job Board
function renderInternships(data, clearBoard = true) {
    if (clearBoard) boardElement.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Update Results Count
    resultsCount.innerText = data ? data.length : 0;

    if (!data || data.length === 0) {
        boardElement.innerHTML = `<div class="empty-state"><i class="ph ph-magnifying-glass empty-icon" aria-hidden="true"></i><h3>No internships found</h3><p>Try adjusting your search or filters.</p></div>`;
        loadMoreContainer.style.display = 'none';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);
    const fragment = document.createDocumentFragment();

    pageData.forEach((internship, index) => {
        const isSaved = savedInternships.includes(internship.id);
        const card = document.createElement('article');
        card.className = 'internship-card';
        card.tabIndex = 0;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.save-btn') || e.target.closest('.apply-btn')) return;
            openDetailsModal(internship);
        });
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openDetailsModal(internship); });

        const readableDomain = { engineering: "Engineering", design: "Design", marketing: "Marketing", data: "Data Science" }[internship.domain] || internship.domain;
        const highlightedRole = highlightText(internship.role, searchTerm);
        const highlightedCompany = highlightText(internship.company, searchTerm);
        const isHotMatch = internship.matchScore && internship.matchScore > 80;
        
        if (isHotMatch) {
            card.classList.add('hot-match');
        }

        const matchBadgeHtml = internship.matchScore !== null 
            ? `<div class="match-badge" style="position: absolute; top: 1rem; right: 1rem; background: #fffbeb; color: #b45309; padding: 4px 10px; border: 1px solid #fde68a; border-radius: 6px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); z-index: 10;"><i class="ph ph-sparkle"></i> ${internship.matchScore}% Match</div>` 
            : `<div class="match-badge" style="position: absolute; top: 1rem; right: 1rem; background: #f3f4f6; color: #4b5563; padding: 4px 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.8rem; font-weight: 500; display: flex; align-items: center; gap: 4px; z-index: 10;"><i class="ph ph-sparkle"></i> Match Pending</div>`;

        card.innerHTML = `
            ${matchBadgeHtml}
            <div class="card-header" style="margin-top: 1rem;">
                <div>
                    <h2 class="role-title" style="margin-top: 0;">${highlightedRole}</h2>
                    <p class="company-name"><i class="ph ph-buildings detail-icon" aria-hidden="true"></i> ${highlightedCompany}</p>
                </div>
                <button class="save-btn ${isSaved ? 'saved' : ''}" aria-label="${isSaved ? 'Unsave' : 'Save'} internship" data-id="${internship.id}" style="margin-left: auto;">
                    <i class="ph ${isSaved ? 'ph-heart-fill' : 'ph-heart'}" aria-hidden="true"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="detail-item"><i class="ph ph-map-pin detail-icon" aria-hidden="true"></i><span>${internship.location}</span></div>
                <div class="detail-item"><i class="ph ph-currency-dollar detail-icon" aria-hidden="true"></i><span>${internship.stipend}</span></div>
                <div class="detail-item"><i class="ph ph-briefcase detail-icon" aria-hidden="true"></i><span>${readableDomain}</span></div>
            </div>
            <div class="card-footer">
                <div class="tags" aria-label="Required skills">${internship.tags.map(tag => `<span class="tag">${highlightText(tag, searchTerm)}</span>`).join('')}</div>
                <button class="primary-btn apply-btn" data-id="${internship.id}">Apply <i class="ph ph-arrow-right" aria-hidden="true"></i></button>
            </div>
        `;
        
        // Staggered animation
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);

        fragment.appendChild(card);
    });

    boardElement.appendChild(fragment);

    document.querySelectorAll('#internship-board .save-btn').forEach(btn => btn.addEventListener('click', toggleSave));
    document.querySelectorAll('#internship-board .apply-btn').forEach(btn => btn.addEventListener('click', openApplyModalFromCard));
    loadMoreContainer.style.display = endIndex < data.length ? 'block' : 'none';
}

// Render Recently Viewed
function renderRecentlyViewed() {
    recentlyViewedBoard.innerHTML = '';
    
    // Filter out jobs that have been applied to
    const validRecentlyViewed = recentlyViewed.filter(id => !myApplications.some(app => app.id === id));
    
    if (validRecentlyViewed.length === 0) {
        recentlyViewedSection.style.display = 'none';
        return;
    }
    
    recentlyViewedSection.style.display = 'block';
    const fragment = document.createDocumentFragment();
    
    validRecentlyViewed.forEach(id => {
        const internship = internshipsData.find(i => i.id === id);
        if (!internship) return;
        
        const card = document.createElement('div');
        card.className = 'mini-card';
        card.tabIndex = 0;
        card.addEventListener('click', () => openDetailsModal(internship));
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openDetailsModal(internship); });
        
        card.innerHTML = `
            <div class="mini-title">${internship.role}</div>
            <div class="mini-company"><i class="ph ph-buildings"></i> ${internship.company}</div>
        `;
        fragment.appendChild(card);
    });
    recentlyViewedBoard.appendChild(fragment);
}

async function fetchApplications() {
    try {
        const response = await fetch('/api/v1/applications');
        if (!response.ok) throw new Error('Failed to fetch applications');
        const data = await response.json();
        
        myApplications = data.data.map(app => {
            // Map status from backend to frontend expectations
            let status = app.status;
            if (status === 'pending') status = 'review';
            return {
                id: app.id,
                application_id: app.application_id,
                status: status,
                date: app.date,
                role: app.role,
                company: app.company,
                location: app.location
            };
        });
        
        renderApplications();
    } catch (err) {
        console.error('Error fetching applications:', err);
    }
}

// Render My Applications
function renderApplications() {
    const columns = {
        applied: document.getElementById('column-applied'),
        review: document.getElementById('column-review'),
        interview: document.getElementById('column-interview'),
        accepted: document.getElementById('column-accepted')
    };

    // Clear columns
    Object.values(columns).forEach(col => { if(col) col.innerHTML = ''; });
    
    // Update Dashboard Stats
    const stats = { applied: 0, review: 0, interview: 0, accepted: 0 };
    myApplications.forEach(app => {
        if (stats[app.status] !== undefined) stats[app.status]++;
    });
    
    if(statApplied) statApplied.innerText = stats.applied;
    if(statReview) statReview.innerText = stats.review;
    if(statInterview) statInterview.innerText = stats.interview;
    if(statAccepted) statAccepted.innerText = stats.accepted;

    // Update Kanban Headers
    Object.keys(stats).forEach(key => {
        const countBadge = document.getElementById(`count-${key}`);
        if(countBadge) countBadge.innerText = stats[key];
    });

    const sortedApps = [...myApplications].reverse();

    sortedApps.forEach(app => {
        const internship = internshipsData.find(i => i.id == app.id) || {};

        let badgeClass, badgeIcon, badgeText;
        switch(app.status) {
            case 'review': badgeClass = 'review'; badgeIcon = 'ph-clock'; badgeText = 'Under Review'; break;
            case 'interview': badgeClass = 'interview'; badgeIcon = 'ph-calendar-blank'; badgeText = 'Interviewing'; break;
            case 'accepted': badgeClass = 'accepted'; badgeIcon = 'ph-confetti'; badgeText = 'Offer Extended'; break;
            default: badgeClass = 'info'; badgeIcon = 'ph-paper-plane-tilt'; badgeText = 'Applied';
        }

        const card = document.createElement('article');
        card.className = 'internship-card kanban-item';
        card.draggable = true;
        card.dataset.appId = app.id;
        
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', app.id);
            card.style.opacity = '0.5';
        });
        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });

        const domainVal = internship.domain || 'engineering';
        const readableDomain = { engineering: "Engineering", design: "Design", marketing: "Marketing", data: "Data Science" }[domainVal] || 'Tech';
        
        card.style.padding = '1.25rem';
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">
                <div style="width: 24px; height: 24px; border-radius: 4px; background: var(--border-color); display: flex; align-items: center; justify-content: center;">
                    <i class="ph ph-buildings" style="font-size: 14px; color: var(--text-main);"></i>
                </div>
                ${app.company || 'Unknown Company'}
            </div>
            <h3 style="margin: 0 0 8px 0; font-size: 1rem; color: var(--text-main); font-weight: 600; line-height: 1.3;">${app.role || 'Unknown Role'}</h3>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 0.8rem; color: var(--text-muted);">
                <div style="display: flex; align-items: center; gap: 4px;"><i class="ph ph-map-pin"></i> ${app.location || internship.location || 'Remote'}</div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span style="background: var(--surface-solid); color: var(--text-main); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500; border: 1px solid var(--border-color);">${readableDomain}</span>
                <span class="status-badge ${badgeClass}" style="padding: 4px 8px; font-size: 0.75rem;"><i class="ph ${badgeIcon}"></i> ${badgeText}</span>
            </div>
        `;
        
        if (columns[app.status]) {
            columns[app.status].appendChild(card);
        }
    });

    // Setup Drag and Drop on Columns
    document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        column.addEventListener('drop', e => {
            e.preventDefault();
            column.classList.remove('drag-over');
            const appId = parseInt(e.dataTransfer.getData('text/plain'));
            const newStatus = column.dataset.status;
            
            // Update app status
            const appIndex = myApplications.findIndex(a => a.id === appId);
            if (appIndex !== -1 && myApplications[appIndex].status !== newStatus) {
                myApplications[appIndex].status = newStatus;
                localStorage.setItem('myApplications', JSON.stringify(myApplications));
                renderApplications();
                showToast('Application status updated!', 'success');
            }
        });
    });
}

// Save functionality
function toggleSave(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.getAttribute('data-id'));
    const icon = btn.querySelector('i');
    const isCurrentlySaved = savedInternships.includes(id);
    
    if (isCurrentlySaved) {
        savedInternships = savedInternships.filter(savedId => savedId !== id);
        btn.classList.remove('saved');
        btn.setAttribute('aria-label', 'Save internship');
        icon.classList.replace('ph-heart-fill', 'ph-heart');
        showToast('Removed from saved', 'info', 'ph-bookmark-simple');
    } else {
        savedInternships.push(id);
        btn.classList.add('saved');
        btn.setAttribute('aria-label', 'Unsave internship');
        icon.classList.replace('ph-heart', 'ph-heart-fill');
        showToast('Internship saved!', 'success', 'ph-heart');
    }
    
    localStorage.setItem('savedInternships', JSON.stringify(savedInternships));
    if (savedToggle.checked && isCurrentlySaved) applyFiltersAndRender(true);
}

// Share API
function shareInternship() {
    if (!currentInternshipId) return;
    const link = `https://intern.board/job/${currentInternshipId}`;
    navigator.clipboard.writeText(link).then(() => {
        showToast('Link copied to clipboard!', 'success', 'ph-link');
    }).catch(err => {
        showToast('Failed to copy link', 'error', 'ph-warning-circle');
    });
}

// Modals
function openDetailsModal(internship) {
    currentInternshipId = internship.id;
    
    // Add to recently viewed
    if (!recentlyViewed.includes(internship.id)) {
        recentlyViewed.unshift(internship.id);
        if (recentlyViewed.length > 4) recentlyViewed.pop();
    } else {
        recentlyViewed = recentlyViewed.filter(id => id !== internship.id);
        recentlyViewed.unshift(internship.id);
    }
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    renderRecentlyViewed();

    modalBody.innerHTML = `
        <div class="modal-header" style="margin-bottom:0;">
            <h2 id="modal-title">${internship.role}</h2>
            <p class="company-name" style="margin-bottom: 1.5rem;"><i class="ph ph-buildings" aria-hidden="true"></i> ${internship.company} &bull; ${internship.location}</p>
        </div>
        <div class="modal-section">
            <h3>About the Role</h3><p>${internship.description}</p>
        </div>
        <div class="modal-section">
            <h3>Requirements</h3><ul>${internship.requirements.map(req => `<li>${req}</li>`).join('')}</ul>
        </div>
        <div class="modal-section" style="display: flex; gap: 1rem;">
            <div class="detail-item"><i class="ph ph-currency-dollar detail-icon"></i><span>${internship.stipend}</span></div>
            <div class="detail-item"><i class="ph ph-clock detail-icon"></i><span>${internship.duration}</span></div>
        </div>
        <div style="margin-top: 2rem;">
            <button class="primary-btn" style="width: 100%;" onclick="startApplication(${internship.id})">Apply for this Position</button>
        </div>
    `;
    detailsModal.showModal();
}

function openApplyModalFromCard(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    startApplication(id);
}

window.startApplication = function(id) {
    detailsModal.close();
    currentInternshipId = id;
    const internship = internshipsData.find(i => i.id === id);
    
    document.getElementById('apply-subtitle').innerText = `Applying for ${internship.role} at ${internship.company}`;
    
    // Reset form
    applyForm.reset();
    if(fileNameDisplay) fileNameDisplay.innerText = '';
    if(dropZone) dropZone.classList.remove('dragover');
    if(fileInput) fileInput.removeAttribute('required'); // Managed manually
    document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('invalid'));
    
    applyModal.showModal();
}

// Drag and Drop Logic
function setupDragAndDrop() {
    if (!dropZone || !fileInput) return;
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if(fileInput.files.length > 0) {
            fileNameDisplay.innerText = `Selected: ${fileInput.files[0].name}`;
            dropZone.parentElement.classList.remove('invalid');
        }
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if(files.length > 0) {
            fileInput.files = files;
            fileNameDisplay.innerText = `Selected: ${files[0].name}`;
            dropZone.parentElement.classList.remove('invalid');
        }
    });
}



// Form Submit
async function handleApplySubmit(e) {
    e.preventDefault();
    let isValid = true;
    
    const nameInput = document.getElementById('applicant-name');
    const emailInput = document.getElementById('applicant-email');
    const resumeInput = document.getElementById('applicant-resume');
    const coverLetterInput = document.getElementById('applicant-cover');
    const submitBtn = applyForm.querySelector('.submit-btn');
    
    if (!nameInput.value.trim()) { nameInput.parentElement.classList.add('invalid'); isValid = false; } 
    else { nameInput.parentElement.classList.remove('invalid'); }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) { emailInput.parentElement.classList.add('invalid'); isValid = false; } 
    else { emailInput.parentElement.classList.remove('invalid'); }
    
    if (fileInput.files.length === 0) {
        dropZone.parentElement.classList.add('invalid');
        isValid = false;
    } else {
        dropZone.parentElement.classList.remove('invalid');
    }
    
    if (isValid && currentInternshipId) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        try {
            const formData = new FormData();
            formData.append('internship_id', currentInternshipId);
            formData.append('name', nameInput.value.trim());
            formData.append('email', emailInput.value.trim());
            formData.append('resume', fileInput.files[0]);
            if (coverLetterInput) formData.append('cover_letter', coverLetterInput.value.trim());

            const response = await fetch('/api/v1/applications', {
                method: 'POST',
                body: formData // No content-type header, fetch sets it automatically with boundary
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || (data.errors ? data.errors[0].msg : 'Failed to submit application'));
            }

            applyModal.close();
            
            // Re-fetch applications from backend
            fetchApplications();
            
            // Unsave if it was saved
            savedInternships = savedInternships.filter(id => id !== currentInternshipId);
            localStorage.setItem('savedInternships', JSON.stringify(savedInternships));
            
            recentlyViewed = recentlyViewed.filter(id => id !== currentInternshipId);
            localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
            
            showToast('Application submitted successfully!', 'success', 'ph-paper-plane-tilt');
            
            applyFiltersAndRender(true);
            renderRecentlyViewed();
            currentInternshipId = null;
        } catch (err) {
            showToast(err.message || 'Error submitting application', 'error', 'ph-warning-circle');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit Application";
        }
    }
}

// --- Profile Parsing Logic ---
function setupProfileDropZone() {
    if (!profileDropZone) return;
    profileDropZone.addEventListener('click', () => profileResumeInput.click());
    
    profileResumeInput.addEventListener('change', () => {
        if(profileResumeInput.files.length > 0) {
            profileFileName.innerText = `Selected: ${profileResumeInput.files[0].name}`;
            parseResumeBtn.disabled = false;
        }
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        profileDropZone.addEventListener(eventName, e => { e.preventDefault(); e.stopPropagation(); }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        profileDropZone.addEventListener(eventName, () => profileDropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        profileDropZone.addEventListener(eventName, () => profileDropZone.classList.remove('dragover'), false);
    });

    profileDropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if(dt.files.length > 0 && dt.files[0].name.endsWith('.pdf')) {
            profileResumeInput.files = dt.files;
            profileFileName.innerText = `Selected: ${dt.files[0].name}`;
            parseResumeBtn.disabled = false;
        } else {
            showToast('Only PDF files are supported for parsing', 'error');
        }
    });
}

async function handleProfileUpload() {
    if (profileResumeInput.files.length === 0) return;
    
    parseResumeBtn.disabled = true;
    parseResumeBtn.innerText = "Extracting Profile...";
    
    try {
        const formData = new FormData();
        formData.append('resume', profileResumeInput.files[0]);
        
        const response = await fetch('/api/v1/profile/parse', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Failed to parse resume');
        const data = await response.json();
        
        myProfile = {
            email: data.email || '',
            skills: data.skills || [],
            education: data.education || '',
            experience: data.experience || '',
            projects: data.projects || '',
            rawText: data.rawText || ''
        };
        
        localStorage.setItem('myProfile', JSON.stringify(myProfile));
        showToast('Profile extracted successfully!', 'success');
        
        renderProfile();
        applyFiltersAndRender(true);
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        parseResumeBtn.disabled = false;
        parseResumeBtn.innerText = "Upload & Extract Profile";
    }
}

function renderProfile() {
    if (!myProfile) return;
    
    // Calculate completeness
    let filledFields = 0;
    const totalFields = 5; // Email, Skills, Edu, Exp, Proj
    if (myProfile.email) filledFields++;
    if (myProfile.skills && myProfile.skills.length > 0) filledFields++;
    if (myProfile.education) filledFields++;
    if (myProfile.experience) filledFields++;
    if (myProfile.projects) filledFields++;
    
    const completeness = Math.round((filledFields / totalFields) * 100);
    const ring = document.getElementById('completeness-ring');
    const ringText = document.getElementById('completeness-text');
    if (ring && ringText) {
        // Circumference of r=16 is approx 100.5
        const circumference = 100.5;
        const offset = circumference - (completeness / 100) * circumference;
        ring.style.strokeDashoffset = offset;
        ringText.innerText = `${completeness}%`;
    }

    const setContent = (id, value, emptyMsg) => {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = value || emptyMsg;
            if (value) el.classList.remove('text-muted');
            else el.classList.add('text-muted');
        }
    };

    setContent('profile-email-content', myProfile.email, 'No email extracted yet.');
    setContent('profile-education-content', myProfile.education, 'No education extracted yet.');
    setContent('profile-experience-content', myProfile.experience, 'No experience extracted yet.');
    setContent('profile-projects-content', myProfile.projects, 'No projects extracted yet.');

    const profileRaw = document.getElementById('profile-raw');
    if (profileRaw) profileRaw.value = myProfile.rawText || '';

    const profileSkillsContainer = document.getElementById('profile-skills-container');
    if (profileSkillsContainer) {
        if (myProfile.skills && myProfile.skills.length > 0) {
            profileSkillsContainer.innerHTML = myProfile.skills.map(s => `<span class="badge" style="background: var(--primary-color); color: white;">${s}</span>`).join('');
        } else {
            profileSkillsContainer.innerHTML = `<span class="text-muted" style="font-size: 0.9rem;">No specific technical skills extracted.</span>`;
        }
    }
}
