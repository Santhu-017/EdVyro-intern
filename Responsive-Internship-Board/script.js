// Extended Mock Data for Internships
const internshipsData = [
    { id: 1, role: "Frontend Developer Intern", company: "TechNova Solutions", location: "Remote", domain: "engineering", stipendRaw: 1200, stipend: "$1,200/mo", durationRaw: 3, duration: "3 Months", isPaid: true, isRemote: true, tags: ["React", "CSS", "HTML"], description: "Join our core product team to build responsive and accessible web interfaces.", requirements: ["Experience with React", "Strong understanding of CSS", "Passion for accessibility"] },
    { id: 2, role: "UI/UX Design Intern", company: "Creative Studio", location: "New York, NY", domain: "design", stipendRaw: 1500, stipend: "$1,500/mo", durationRaw: 6, duration: "6 Months", isPaid: true, isRemote: false, tags: ["Figma", "Prototyping", "Research"], description: "Help craft the future of our enterprise software.", requirements: ["Proficiency in Figma", "Portfolio demonstrating problem-solving skills", "Basic HTML/CSS"] },
    { id: 3, role: "Data Science Intern", company: "DataCorp", location: "San Francisco, CA", domain: "data", stipendRaw: 2000, stipend: "$2,000/mo", durationRaw: 4, duration: "4 Months", isPaid: true, isRemote: false, tags: ["Python", "SQL", "Machine Learning"], description: "Dive deep into big data to uncover insights that drive business decisions.", requirements: ["Strong Python skills", "Knowledge of SQL", "Familiarity with ML libraries"] },
    { id: 4, role: "Digital Marketing Intern", company: "Growth Hackers Inc.", location: "Remote", domain: "marketing", stipendRaw: 1000, stipend: "$1,000/mo", durationRaw: 3, duration: "3 Months", isPaid: true, isRemote: true, tags: ["SEO", "Content", "Social Media"], description: "Assist in executing digital marketing campaigns across various channels.", requirements: ["Understanding of SEO", "Excellent written communication", "Familiarity with Analytics"] },
    { id: 5, role: "Backend Engineer Intern", company: "Cloudify", location: "Austin, TX", domain: "engineering", stipendRaw: 1800, stipend: "$1,800/mo", durationRaw: 6, duration: "6 Months", isPaid: true, isRemote: false, tags: ["Node.js", "MongoDB", "API"], description: "Build scalable APIs and microservices. You will get hands-on experience.", requirements: ["Experience with Node.js", "Understanding of RESTful APIs", "Knowledge of Git"] },
    { id: 6, role: "Graphic Design Intern", company: "Pixel Perfect", location: "Remote", domain: "design", stipendRaw: 0, stipend: "Unpaid", durationRaw: 2, duration: "2 Months", isPaid: false, isRemote: true, tags: ["Illustrator", "Photoshop", "Branding"], description: "Create visual assets for social media and marketing campaigns.", requirements: ["Adobe Creative Suite", "Strong visual design skills", "Ability to meet deadlines"] },
    { id: 7, role: "Product Management Intern", company: "InnovateTech", location: "Seattle, WA", domain: "marketing", stipendRaw: 2200, stipend: "$2,200/mo", durationRaw: 6, duration: "6 Months", isPaid: true, isRemote: false, tags: ["Agile", "Jira", "Strategy"], description: "Assist product managers in defining product requirements and user stories.", requirements: ["Analytical mindset", "Excellent communication", "Understanding of software lifecycle"] },
    { id: 8, role: "Cybersecurity Analyst Intern", company: "SecureNet", location: "Remote", domain: "engineering", stipendRaw: 1600, stipend: "$1,600/mo", durationRaw: 3, duration: "3 Months", isPaid: true, isRemote: true, tags: ["Network Security", "Linux", "Python"], description: "Help secure our infrastructure and perform vulnerability assessments.", requirements: ["Understanding of networking", "Familiarity with security protocols", "Problem-solving skills"] },
    { id: 9, role: "Content Writer Intern", company: "Blogify", location: "Remote", domain: "marketing", stipendRaw: 800, stipend: "$800/mo", durationRaw: 4, duration: "4 Months", isPaid: true, isRemote: true, tags: ["Writing", "Editing", "WordPress"], description: "Write engaging articles and blog posts for our diverse audience.", requirements: ["Flawless grammar", "Creative thinking", "Basic SEO knowledge"] },
    { id: 10, role: "Mobile App Dev Intern", company: "AppWorks", location: "Denver, CO", domain: "engineering", stipendRaw: 1900, stipend: "$1,900/mo", durationRaw: 6, duration: "6 Months", isPaid: true, isRemote: false, tags: ["Flutter", "Dart", "Firebase"], description: "Contribute to the development of our flagship cross-platform mobile app.", requirements: ["Experience with Flutter or React Native", "Understanding of mobile UX"] },
    { id: 11, role: "Data Analytics Intern", company: "Metrics Ltd", location: "Chicago, IL", domain: "data", stipendRaw: 1700, stipend: "$1,700/mo", durationRaw: 3, duration: "3 Months", isPaid: true, isRemote: false, tags: ["Tableau", "Excel", "Data Viz"], description: "Create dashboards and reports to help visualize complex datasets.", requirements: ["Proficiency in Excel", "Experience with BI tools like Tableau or PowerBI"] },
    { id: 12, role: "3D Animation Intern", company: "GameStudios", location: "Remote", domain: "design", stipendRaw: 1100, stipend: "$1,100/mo", durationRaw: 4, duration: "4 Months", isPaid: true, isRemote: true, tags: ["Blender", "Maya", "Animation"], description: "Animate characters and environments for our upcoming indie game.", requirements: ["Portfolio of 3D animations", "Proficiency in Maya or Blender"] }
];

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
const themeToggleBtn = document.getElementById('theme-toggle');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadMoreContainer = document.getElementById('load-more-container');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const viewSections = document.querySelectorAll('.view-section');

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

// State
let savedInternships = JSON.parse(localStorage.getItem('savedInternships')) || [];
let myApplications = JSON.parse(localStorage.getItem('myApplications')) || [];
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

    renderSkeletons(itemsPerPage, boardElement, currentViewMode);
    setTimeout(() => {
        applyFiltersAndRender(true);
        renderRecentlyViewed();
    }, 800);

    // Event Listeners for Filters
    [searchInput, domainFilter, sortFilter, remoteToggle, paidToggle, savedToggle].forEach(el => {
        el.addEventListener('input', () => applyFiltersAndRender(true));
        el.addEventListener('change', () => applyFiltersAndRender(true));
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
        section.style.display = section.id === targetId ? 'block' : 'none';
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
        const hasApplied = myApplications.some(app => app.id === item.id);

        return matchesSearch && matchesDomain && matchesRemote && matchesPaid && matchesSaved && !hasApplied;
    });

    if (sortValue === 'stipend-high') filteredData.sort((a, b) => b.stipendRaw - a.stipendRaw);
    else if (sortValue === 'duration-short') filteredData.sort((a, b) => a.durationRaw - b.durationRaw);
    else filteredData.sort((a, b) => a.id - b.id);

    renderInternships(filteredData, resetPagination);
}

// Render Main Job Board
function renderInternships(data, clearBoard = true) {
    if (clearBoard) boardElement.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!data || data.length === 0) {
        boardElement.innerHTML = `<div class="empty-state"><i class="ph ph-magnifying-glass empty-icon" aria-hidden="true"></i><h3>No internships found</h3><p>Try adjusting your search or filters.</p></div>`;
        loadMoreContainer.style.display = 'none';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);
    const fragment = document.createDocumentFragment();

    pageData.forEach(internship => {
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

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h2 class="role-title">${highlightedRole}</h2>
                    <p class="company-name"><i class="ph ph-buildings detail-icon" aria-hidden="true"></i> ${highlightedCompany}</p>
                </div>
                <button class="save-btn ${isSaved ? 'saved' : ''}" aria-label="${isSaved ? 'Unsave' : 'Save'} internship" data-id="${internship.id}">
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

// Render My Applications
function renderApplications() {
    applicationsBoard.innerHTML = '';
    
    if (myApplications.length === 0) {
        applicationsBoard.innerHTML = `<div class="empty-state"><i class="ph ph-folder-open empty-icon" aria-hidden="true"></i><h3>No Applications Yet</h3><p>Start finding internships on the job board and apply!</p></div>`;
        return;
    }

    const fragment = document.createDocumentFragment();
    const sortedApps = [...myApplications].reverse();

    sortedApps.forEach(app => {
        const internship = internshipsData.find(i => i.id === app.id);
        if(!internship) return; 

        let badgeClass, badgeIcon, badgeText;
        switch(app.status) {
            case 'review': badgeClass = 'review'; badgeIcon = 'ph-clock'; badgeText = 'Under Review'; break;
            case 'interview': badgeClass = 'interview'; badgeIcon = 'ph-calendar-blank'; badgeText = 'Interviewing'; break;
            case 'accepted': badgeClass = 'accepted'; badgeIcon = 'ph-confetti'; badgeText = 'Offer Extended'; break;
            default: badgeClass = 'review'; badgeIcon = 'ph-clock'; badgeText = 'Under Review';
        }

        const card = document.createElement('article');
        card.className = 'internship-card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h2 class="role-title">${internship.role}</h2>
                    <p class="company-name"><i class="ph ph-buildings detail-icon" aria-hidden="true"></i> ${internship.company}</p>
                </div>
            </div>
            <div class="card-body">
                <div class="detail-item"><i class="ph ph-calendar-plus detail-icon" aria-hidden="true"></i><span>Applied ${app.date}</span></div>
                <div class="detail-item"><i class="ph ph-map-pin detail-icon" aria-hidden="true"></i><span>${internship.location}</span></div>
            </div>
            <div class="card-footer" style="justify-content: flex-end;">
                <span class="status-badge ${badgeClass}"><i class="ph ${badgeIcon}"></i> ${badgeText}</span>
            </div>
        `;
        fragment.appendChild(card);
    });

    applicationsBoard.appendChild(fragment);
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
    fileNameDisplay.innerText = '';
    dropZone.classList.remove('dragover');
    fileInput.removeAttribute('required'); // Managed manually
    document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('invalid'));
    
    applyModal.showModal();
}

// Drag and Drop Logic
function setupDragAndDrop() {
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
function handleApplySubmit(e) {
    e.preventDefault();
    let isValid = true;
    
    const nameInput = document.getElementById('applicant-name');
    const emailInput = document.getElementById('applicant-email');
    
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
        applyModal.close();
        
        // Add to My Applications
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        myApplications.push({ id: currentInternshipId, status: 'review', date: today });
        localStorage.setItem('myApplications', JSON.stringify(myApplications));
        
        // Unsave if it was saved
        savedInternships = savedInternships.filter(id => id !== currentInternshipId);
        localStorage.setItem('savedInternships', JSON.stringify(savedInternships));
        
        // Remove from recently viewed if applied
        recentlyViewed = recentlyViewed.filter(id => id !== currentInternshipId);
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        
        showToast('Application submitted successfully!', 'success', 'ph-paper-plane-tilt');
        
        // Refresh board and history
        applyFiltersAndRender(true);
        renderRecentlyViewed();
        currentInternshipId = null;
    }
}
