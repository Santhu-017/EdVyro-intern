# Secure Application Integration - Internship Portal

A production-ready, full-stack application designed to connect students with internship opportunities. This capstone project emphasizes security, performance, accessibility, and a seamless user journey across both desktop and mobile devices.

## Features

- **Dynamic Job Board**: Filter internships by domain, stipend, duration, and remote availability.
- **Application Flow**: Securely apply for internships with file uploads (PDF/DOC) handled via Multer with stringent checks.
- **Smart Resume Parser**: Upload a resume to automatically extract skills, email, and experience sections using `pdf-parse`.
- **Advanced Security**: Implements `helmet`, `cors`, `express-rate-limit`, and parameterized queries to mitigate XSS, CSRF, DDoS, and SQL Injection.
- **Performance Optimized**: Uses GZIP compression (`compression`) and `express-slow-down` to manage heavy traffic.
- **Robust Logging & Monitoring**: File-based HTTP logging via `morgan` and a `/api/health` endpoint for infrastructure monitoring.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (Serverless database for portability)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (No external frameworks for maximum performance control)
- **Testing**: Jest, Supertest

## Local Setup & Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repo-url>
   cd Secure-Application-Integration
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Application**:
   - For development (with detailed console logging):
     ```bash
     npm start
     ```
   - For tests:
     ```bash
     npm test
     ```

4. **Access the Application**:
   Open `http://localhost:3000` in your web browser.

## Demo

A walkthrough video demonstrating the full functionality of the internship portal—including domain filtering, responsive mobile UI, and dark mode toggling—can be found in the `demo/` folder:
- **[View Walkthrough Video](demo/walkthrough.webp)**

## API Documentation

- `GET /api/health` - Returns the health status and uptime of the server.
- `GET /api/v1/internships` - Fetches a paginated list of internships. Supports query parameters for `search`, `location`, `status`, `sortBy`, and `order`.
- `GET /api/v1/internships/:id` - Fetches details for a specific internship.
- `POST /api/v1/applications` - Submits an application. Requires `multipart/form-data` with `internship_id`, `name`, `email`, and a `resume` file.
- `GET /api/v1/applications` - Fetches a list of submitted applications.
- `POST /api/v1/profile/parse` - Accepts a `resume` file and parses it into JSON extracting skills, email, and education sections.

## Security Overview

Please refer to [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for a comprehensive breakdown of implemented security measures, including parameterized queries, XSS prevention, rate limiting, and HTTP header security.

## Deployment Strategy

This application can be deployed as a standard Node.js application to services like Heroku, Render, or Railway.

### Example Render Deployment:
1. Connect your GitHub repository to Render.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. The SQLite database is local; for a true stateless production deployment, migrate the SQLite file to an external PostgreSQL/MySQL database instance using Sequelize or raw queries.
