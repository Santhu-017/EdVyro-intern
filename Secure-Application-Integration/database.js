const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dataDir = process.env.DATA_DIR || __dirname;
const dbPath = path.resolve(dataDir, 'internships.sqlite');

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
                domain TEXT DEFAULT 'engineering',
                duration TEXT DEFAULT '3 Months',
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
                db.run(`
                    CREATE TABLE IF NOT EXISTS applications (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        internship_id INTEGER NOT NULL,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL,
                        resume_link TEXT NOT NULL,
                        cover_letter TEXT,
                        status TEXT DEFAULT 'Pending',
                        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (internship_id) REFERENCES internships(id)
                    )
                `, (err2) => {
                    if (err2) {
                        console.error('Error creating applications table:', err2.message);
                    } else {
                        seedDb();
                    }
                });
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
            console.log('Seeding 50+ diverse records...');
            const stmt = db.prepare(`
                INSERT INTO internships (title, company, location, domain, duration, stipend, description, skills, status, application_deadline, is_remote)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const domains = ['engineering', 'design', 'marketing', 'finance', 'product'];
            const companies = ['TechCorp', 'Innovate LLC', 'WebWorks', 'DataSolutions Inc.', 'Creative Agency', 'FinTech Solutions', 'HealthTech Innovations', 'EcoSystems', 'Global Logistics', 'NextGen Media'];
            const roles = {
                engineering: ['Software Engineering Intern', 'Frontend Developer Intern', 'Backend Intern', 'Data Science Intern', 'DevOps Intern', 'QA Tester Intern', 'Security Intern'],
                design: ['UX/UI Design Intern', 'Graphic Design Intern', 'Product Design Intern', 'Visual Design Intern', 'Interaction Design Intern'],
                marketing: ['Marketing Intern', 'Social Media Intern', 'SEO Intern', 'Content Writing Intern', 'Digital Marketing Intern'],
                finance: ['Financial Analyst Intern', 'Accounting Intern', 'Investment Banking Intern', 'Risk Management Intern'],
                product: ['Product Management Intern', 'Business Analyst Intern', 'Strategy Intern', 'Growth Intern']
            };
            const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'London, UK', 'Berlin, Germany', 'Toronto, Canada', 'Sydney, Australia', 'Bangalore, India', 'Singapore'];
            const stipends = ['$2000/mo', '$3000/mo', '$4000/mo', '$5000/mo', '$1500/mo', 'Unpaid', '$25/hr', '$30/hr'];
            const skillsMap = {
                engineering: ['Node.js', 'React', 'SQL', 'Python', 'Java', 'C++', 'AWS', 'Docker', 'Git'],
                design: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research'],
                marketing: ['SEO', 'Content Writing', 'Social Media', 'Google Analytics', 'Mailchimp', 'Copywriting'],
                finance: ['Excel', 'Financial Modeling', 'Data Analysis', 'Accounting', 'Valuation'],
                product: ['Agile', 'Jira', 'User Research', 'Roadmap', 'Data Analysis', 'A/B Testing']
            };
            const durations = ['2 Months', '3 Months', '4 Months', '6 Months', 'Flexible'];

            for (let i = 0; i < 55; i++) {
                const domain = domains[Math.floor(Math.random() * domains.length)];
                const roleList = roles[domain];
                const role = roleList[Math.floor(Math.random() * roleList.length)];
                const company = companies[Math.floor(Math.random() * companies.length)];
                const location = locations[Math.floor(Math.random() * locations.length)];
                const stipend = stipends[Math.floor(Math.random() * stipends.length)];
                const duration = durations[Math.floor(Math.random() * durations.length)];
                const isRemote = location === 'Remote' ? 1 : (Math.random() > 0.7 ? 1 : 0);
                
                const domainSkills = skillsMap[domain];
                const shuffledSkills = [...domainSkills].sort(() => 0.5 - Math.random());
                const skills = shuffledSkills.slice(0, 3);
                
                stmt.run(
                    role,
                    company,
                    location,
                    domain,
                    duration,
                    stipend,
                    `Join ${company} as a ${role} to work on exciting projects and learn from industry experts.`,
                    JSON.stringify(skills),
                    Math.random() > 0.1 ? 'Open' : 'Closed',
                    new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    isRemote
                );
            }
            
            stmt.finalize();
            console.log('Seed data inserted successfully.');
        }
    });
}

module.exports = db;
