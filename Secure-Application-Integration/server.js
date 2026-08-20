const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const morgan = require('morgan');
const compression = require('compression');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer Storage Configuration
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'public');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(DATA_DIR, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
        }
    }
});

// Security & Optimization Middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://unpkg.com", "'unsafe-inline'"],
            styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://unpkg.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use(cors());
app.use(compression()); // Gzip compression
const logDir = process.env.DATA_DIR || __dirname;
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream })); // File logging
app.use(morgan('dev')); // Console logging for dev
app.use(express.json());

// Advanced Rate Limiting & Slow Down
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, 
    delayAfter: 50, 
    delayMs: (hits) => (hits - 50) * 100 
});

app.use('/api/', apiLimiter);
app.use('/api/', speedLimiter);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploaded files securely from DATA_DIR (important if DATA_DIR is outside public)
app.use('/uploads', express.static(path.join(DATA_DIR, 'uploads')));

// Centralized Validation Handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there was an uploaded file but validation failed, delete it to prevent orphaned files
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if(err) console.error("Error deleting orphaned file:", err);
            });
        }
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        timestamp: new Date(), 
        uptime: process.uptime() 
    });
});

// V1 INTERNSHIP ROUTES
app.get('/api/v1/internships', (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { search, location, status, sortBy, order } = req.query;

        let whereClauses = [];
        let queryParams = [];

        if (search) {
            whereClauses.push(`(title LIKE ? OR description LIKE ?)`);
            queryParams.push(`%${search}%`, `%${search}%`);
        }
        if (location) {
            whereClauses.push(`location = ?`);
            queryParams.push(location);
        }
        if (status) {
            whereClauses.push(`status = ?`);
            queryParams.push(status);
        }

        const whereString = whereClauses.length > 0 ? `WHERE ` + whereClauses.join(' AND ') : '';
        const allowedSortColumns = ['created_at', 'title', 'company', 'stipend', 'application_deadline'];
        const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const sortOrder = (order && order.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

        const countQuery = `SELECT COUNT(*) AS total FROM internships ${whereString}`;
        
        db.get(countQuery, queryParams, (err, row) => {
            if (err) return next(err);
            
            const total = row.total;
            const totalPages = Math.ceil(total / limit);
            
            const dataQuery = `SELECT * FROM internships ${whereString} ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
            
            db.all(dataQuery, [...queryParams, limit, offset], (err, rows) => {
                if (err) return next(err);
                
                const formattedRows = rows.map(r => ({
                    ...r,
                    skills: r.skills ? JSON.parse(r.skills) : [],
                    is_remote: !!r.is_remote
                }));
                
                res.status(200).json({
                    data: formattedRows,
                    pagination: { total_records: total, current_page: page, total_pages: totalPages, per_page: limit }
                });
            });
        });
    } catch (err) {
        next(err);
    }
});

app.get('/api/v1/internships/:id', (req, res, next) => {
    try {
        db.get(`SELECT * FROM internships WHERE id = ?`, [req.params.id], (err, row) => {
            if (err) return next(err);
            if (!row) return res.status(404).json({ error: 'Internship not found' });
            row.skills = row.skills ? JSON.parse(row.skills) : [];
            row.is_remote = !!row.is_remote;
            res.status(200).json(row);
        });
    } catch (err) {
        next(err);
    }
});

// V1 APPLICATIONS ROUTE
const applicationValidationRules = [
    body('internship_id').isInt().withMessage('Valid internship ID is required'),
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('cover_letter').optional().trim().escape()
];

app.post('/api/v1/applications', (req, res, next) => {
    upload.single('resume')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, applicationValidationRules, handleValidationErrors, (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Resume file is required' });
        }

        const { internship_id, name, email, cover_letter } = req.body;
        const resume_link = `/uploads/${req.file.filename}`;

        // Verify internship exists
        db.get(`SELECT id FROM internships WHERE id = ?`, [internship_id], (err, row) => {
            if (err) return next(err);
            if (!row) {
                fs.unlink(req.file.path, () => {});
                return res.status(404).json({ error: 'Internship not found' });
            }

            const query = `
                INSERT INTO applications (internship_id, name, email, resume_link, cover_letter)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            db.run(query, [internship_id, name, email, resume_link, cover_letter], function(err) {
                if (err) {
                    fs.unlink(req.file.path, () => {});
                    return next(err);
                }
                res.status(201).json({ 
                    message: 'Application submitted successfully',
                    application_id: this.lastID,
                    resume_url: resume_link
                });
            });
        });
    } catch (err) {
        if (req.file) fs.unlink(req.file.path, () => {});
        next(err);
    }
});

app.get('/api/v1/applications', (req, res, next) => {
    try {
        const query = `
            SELECT a.id as application_id, a.internship_id, a.status as application_status, a.applied_at,
                   i.title as role, i.company, i.location
            FROM applications a
            JOIN internships i ON a.internship_id = i.id
            ORDER BY a.applied_at DESC
        `;
        db.all(query, [], (err, rows) => {
            if (err) return next(err);
            const formattedRows = rows.map(r => ({
                id: r.internship_id, // For frontend compatibility
                application_id: r.application_id,
                status: r.application_status.toLowerCase(), // 'pending' -> 'review' for frontend
                date: new Date(r.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                role: r.role,
                company: r.company,
                location: r.location
            }));
            res.status(200).json({ data: formattedRows });
        });
    } catch (err) {
        next(err);
    }
});

// PROFILE PARSER ROUTE
const SKILL_DICTIONARY = [
    'Node.js', 'React', 'SQL', 'Python', 'Java', 'C++', 'AWS', 'Docker', 'Git',
    'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research',
    'SEO', 'Content Writing', 'Social Media', 'Google Analytics', 'Mailchimp', 'Copywriting',
    'Excel', 'Financial Modeling', 'Data Analysis', 'Accounting', 'Valuation',
    'Agile', 'Jira', 'Roadmap', 'A/B Testing', 'HTML', 'CSS', 'JavaScript', 'Vue.js', 'Pandas', 'Machine Learning'
];

app.post('/api/v1/profile/parse', upload.single('resume'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Resume PDF is required' });
        }
        
        const dataBuffer = fs.readFileSync(req.file.path);
        
        try {
            const data = await pdfParse(dataBuffer);
            const text = data.text;
            
            // Delete file after reading into memory
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

            const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
            const email = emailMatch ? emailMatch[1] : '';

            const extractedSkills = SKILL_DICTIONARY.filter(skill => {
                const escapedSkill = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                const regex = new RegExp(`(^|\\W)${escapedSkill}(?=\\W|$)`, 'i');
                return regex.test(text);
            });

            // Extract Sections
            const extractSection = (headerPattern, nextHeaderPattern) => {
                const regex = new RegExp(`(?:${headerPattern})([\\s\\S]*?)(?:${nextHeaderPattern}|$)`, 'i');
                const match = text.match(regex);
                return match && match[1] ? match[1].trim().substring(0, 500) + (match[1].length > 500 ? '...' : '') : '';
            };

            const education = extractSection('EDUCATION|ACADEMIC BACKGROUND', 'EXPERIENCE|PROJECTS|SKILLS|CERTIFICATIONS|AWARDS');
            const experience = extractSection('EXPERIENCE|INTERNSHIPS|EMPLOYMENT', 'EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS|AWARDS');
            const projects = extractSection('PROJECTS|PERSONAL PROJECTS', 'EDUCATION|EXPERIENCE|SKILLS|CERTIFICATIONS|AWARDS');

            res.status(200).json({
                email: email,
                skills: extractedSkills,
                education: education,
                experience: experience,
                projects: projects,
                rawText: text.substring(0, 3000) // limit to avoid localstorage bloat
            });
        } catch (parseError) {
            console.error('PDF Parse Error:', parseError);
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Could not parse PDF file' });
        }
    } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(err);
    }
});

// Fallback for API
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found or unsupported version' });
});

// For any other route, serve index.html (SPA support)
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Only listen if not required as a module (for Jest testing)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Advanced Secure Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
