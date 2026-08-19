const request = require('supertest');
const app = require('../server');
const fs = require('fs');
const path = require('path');

describe('Applications API V1', () => {
    let testInternshipId;
    let dummyPdfPath;

    beforeAll(async () => {
        const res = await request(app).get('/api/v1/internships');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        testInternshipId = res.body.data[0].id;

        // Create a dummy pdf for testing
        dummyPdfPath = path.join(__dirname, 'dummy.pdf');
        fs.writeFileSync(dummyPdfPath, 'dummy pdf content');
    });

    afterAll(() => {
        if (fs.existsSync(dummyPdfPath)) {
            fs.unlinkSync(dummyPdfPath);
        }
    });

    it('should successfully submit a valid application with a resume file', async () => {
        const res = await request(app)
            .post('/api/v1/applications')
            .field('internship_id', testInternshipId)
            .field('name', 'Test User')
            .field('email', 'test@example.com')
            .field('cover_letter', 'I am a great fit.')
            .attach('resume', dummyPdfPath);
            
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Application submitted successfully');
        expect(res.body).toHaveProperty('application_id');
        expect(res.body).toHaveProperty('resume_url');
        expect(res.body.resume_url).toMatch(/^\/uploads\//);
    });

    it('should reject application without a resume file', async () => {
        const res = await request(app)
            .post('/api/v1/applications')
            .field('internship_id', testInternshipId)
            .field('name', 'Test User')
            .field('email', 'test@example.com');
            
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Resume file is required');
    });

    it('should reject application with invalid file type', async () => {
        const dummyTxtPath = path.join(__dirname, 'dummy.txt');
        fs.writeFileSync(dummyTxtPath, 'dummy txt content');

        const res = await request(app)
            .post('/api/v1/applications')
            .field('internship_id', testInternshipId)
            .field('name', 'Test User')
            .field('email', 'test@example.com')
            .attach('resume', dummyTxtPath);
            
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toContain('Invalid file type');

        fs.unlinkSync(dummyTxtPath);
    });

    it('should reject application with invalid email', async () => {
        const res = await request(app)
            .post('/api/v1/applications')
            .field('internship_id', testInternshipId)
            .field('name', 'Test User')
            .field('email', 'not-an-email')
            .attach('resume', dummyPdfPath);
            
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].path).toEqual('email');
    });

    it('should return 404 if applying to non-existent internship', async () => {
        const res = await request(app)
            .post('/api/v1/applications')
            .field('internship_id', 9999)
            .field('name', 'Test User')
            .field('email', 'test@example.com')
            .attach('resume', dummyPdfPath);
            
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual('Internship not found');
    });
});
