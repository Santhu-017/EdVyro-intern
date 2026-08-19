const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const internshipValidationRules = [
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('company').notEmpty().withMessage('Company is required').trim().escape(),
    body('location').notEmpty().withMessage('Location is required').trim().escape(),
    body('stipend').optional().trim().escape(),
    body('description').optional().trim().escape(),
    body('skills').optional().isJSON().withMessage('Skills must be a valid JSON array string'),
    body('status').optional().isIn(['Open', 'Closed', 'Draft']).withMessage('Status must be Open, Closed, or Draft'),
    body('application_deadline').optional().isISO8601().withMessage('Application deadline must be a valid date'),
    body('is_remote').optional().isBoolean().withMessage('is_remote must be a boolean')
];

// 1. GET /api/internships - List with pagination, search, filter, sort
app.get('/api/internships', (req, res) => {
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
        if (err) {
            return res.status(500).json({ error: 'Database error while counting records' });
        }
        
        const total = row.total;
        const totalPages = Math.ceil(total / limit);
        
        const dataQuery = `SELECT * FROM internships ${whereString} ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
        const dataParams = [...queryParams, limit, offset];
        
        db.all(dataQuery, dataParams, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error while fetching records' });
            }
            
            // Parse skills JSON for better API response
            const formattedRows = rows.map(r => ({
                ...r,
                skills: r.skills ? JSON.parse(r.skills) : [],
                is_remote: !!r.is_remote
            }));
            
            res.status(200).json({
                data: formattedRows,
                pagination: {
                    total_records: total,
                    current_page: page,
                    total_pages: totalPages,
                    per_page: limit
                }
            });
        });
    });
});

// 2. GET /api/internships/:id - Detail view
app.get('/api/internships/:id', (req, res) => {
    const { id } = req.params;
    
    db.get(`SELECT * FROM internships WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while fetching record' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Internship not found' });
        }
        
        row.skills = row.skills ? JSON.parse(row.skills) : [];
        row.is_remote = !!row.is_remote;
        
        res.status(200).json(row);
    });
});

// 3. POST /api/internships - Create new internship
app.post('/api/internships', internshipValidationRules, handleValidationErrors, (req, res) => {
    const { title, company, location, stipend, description, skills, status, application_deadline, is_remote } = req.body;
    
    const query = `
        INSERT INTO internships (title, company, location, stipend, description, skills, status, application_deadline, is_remote)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [title, company, location, stipend, description, skills, status || 'Open', application_deadline, is_remote ? 1 : 0], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error while creating record' });
        }
        
        db.get(`SELECT * FROM internships WHERE id = ?`, [this.lastID], (err, row) => {
            row.skills = row.skills ? JSON.parse(row.skills) : [];
            row.is_remote = !!row.is_remote;
            res.status(201).json(row);
        });
    });
});

// 4. PUT /api/internships/:id - Update existing internship
app.put('/api/internships/:id', internshipValidationRules, handleValidationErrors, (req, res) => {
    const { id } = req.params;
    const { title, company, location, stipend, description, skills, status, application_deadline, is_remote } = req.body;
    
    db.get(`SELECT * FROM internships WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Internship not found' });
        
        const query = `
            UPDATE internships 
            SET title = ?, company = ?, location = ?, stipend = ?, description = ?, skills = ?, status = ?, application_deadline = ?, is_remote = ?
            WHERE id = ?
        `;
        
        db.run(query, [title, company, location, stipend, description, skills, status || 'Open', application_deadline, is_remote ? 1 : 0, id], function(err) {
            if (err) return res.status(500).json({ error: 'Database error while updating' });
            
            db.get(`SELECT * FROM internships WHERE id = ?`, [id], (err, updatedRow) => {
                updatedRow.skills = updatedRow.skills ? JSON.parse(updatedRow.skills) : [];
                updatedRow.is_remote = !!updatedRow.is_remote;
                res.status(200).json(updatedRow);
            });
        });
    });
});

// 5. DELETE /api/internships/:id - Delete an internship
app.delete('/api/internships/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM internships WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error while deleting' });
        if (this.changes === 0) return res.status(404).json({ error: 'Internship not found' });
        res.status(200).json({ message: 'Internship deleted successfully' });
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Advanced Internship API! Visit /api/internships to see the records.' });
});

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
