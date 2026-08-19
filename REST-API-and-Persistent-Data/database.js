const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'internships.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS internships (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                company TEXT NOT NULL,
                location TEXT NOT NULL,
                stipend TEXT,
                description TEXT,
                skills TEXT,
                status TEXT DEFAULT 'Open',
                application_deadline DATETIME,
                is_remote INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating internships table:', err.message);
            } else {
                seedDb();
            }
        });
    });
}

function seedDb() {
    db.get("SELECT COUNT(*) AS count FROM internships", (err, row) => {
        if (err) {
            console.error('Error checking internship count:', err.message);
            return;
        }
        
        if (row.count === 0) {
            console.log('Seeding initial advanced data...');
            const stmt = db.prepare(`
                INSERT INTO internships (title, company, location, stipend, description, skills, status, application_deadline, is_remote)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const seedData = [
                {
                    title: 'Software Engineering Intern',
                    company: 'TechCorp',
                    location: 'Remote',
                    stipend: '$3000/month',
                    description: 'Work on our core product using Node.js and React.',
                    skills: JSON.stringify(["Node.js", "React", "SQL"]),
                    status: 'Open',
                    application_deadline: '2026-12-31',
                    is_remote: 1
                },
                {
                    title: 'Data Science Intern',
                    company: 'DataSolutions Inc.',
                    location: 'New York, NY',
                    stipend: '$3500/month',
                    description: 'Analyze large datasets and build predictive models.',
                    skills: JSON.stringify(["Python", "Pandas", "Machine Learning"]),
                    status: 'Open',
                    application_deadline: '2026-11-15',
                    is_remote: 0
                },
                {
                    title: 'Marketing Intern',
                    company: 'Creative Agency',
                    location: 'San Francisco, CA',
                    stipend: 'Unpaid',
                    description: 'Assist with social media campaigns and content creation.',
                    skills: JSON.stringify(["SEO", "Content Writing", "Social Media"]),
                    status: 'Closed',
                    application_deadline: '2026-07-01',
                    is_remote: 0
                },
                {
                    title: 'Frontend Developer Intern',
                    company: 'WebWorks',
                    location: 'Austin, TX',
                    stipend: '$2500/month',
                    description: 'Help build responsive UI components.',
                    skills: JSON.stringify(["HTML", "CSS", "JavaScript", "Vue.js"]),
                    status: 'Open',
                    application_deadline: '2026-10-31',
                    is_remote: 0
                },
                {
                    title: 'Product Management Intern',
                    company: 'Innovate LLC',
                    location: 'Remote',
                    stipend: '$4000/month',
                    description: 'Assist PMs with user research and roadmap planning.',
                    skills: JSON.stringify(["Agile", "User Research", "Jira"]),
                    status: 'Open',
                    application_deadline: '2026-09-30',
                    is_remote: 1
                }
            ];
            
            seedData.forEach(internship => {
                stmt.run(
                    internship.title,
                    internship.company,
                    internship.location,
                    internship.stipend,
                    internship.description,
                    internship.skills,
                    internship.status,
                    internship.application_deadline,
                    internship.is_remote
                );
            });
            
            stmt.finalize();
            console.log('Seed data inserted successfully.');
        }
    });
}

module.exports = db;
