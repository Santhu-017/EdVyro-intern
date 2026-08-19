# Advanced Internship Records REST API

A highly capable Node.js and Express RESTful API for managing internship records. This API uses SQLite for persistent data storage and includes advanced features such as strict validation, searching, filtering, sorting, and pagination.

## Features
- **Advanced CRUD Operations**: Create, Read, Update, and Delete internship records.
- **Search & Filtering**: Filter internships by location, status, or search through titles and descriptions.
- **Pagination & Sorting**: Robust list endpoints with support for `page`, `limit`, `sortBy`, and `order`.
- **Strict Validation**: Utilizes `express-validator` to sanitize and strictly validate all incoming data.
- **Persistent Data**: Uses SQLite for an out-of-the-box persistent database with zero server setup.
- **Auto-Seeding**: The database automatically creates the required tables and seeds 5 initial realistic records on first startup.

## Prerequisites
- Node.js installed on your machine.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`. You will see output confirming connection to the SQLite database and seed data insertion.

## Database Schema (SQLite)
The `internships` table has the following structure:
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `title` (TEXT NOT NULL)
- `company` (TEXT NOT NULL)
- `location` (TEXT NOT NULL)
- `stipend` (TEXT) - Optional
- `description` (TEXT) - Optional
- `skills` (TEXT) - Stores a JSON array of skills (e.g. `["Node.js", "React"]`)
- `status` (TEXT) - `'Open'`, `'Closed'`, or `'Draft'` (Defaults to `'Open'`)
- `application_deadline` (DATETIME) - Optional
- `is_remote` (INTEGER) - `1` (true) or `0` (false)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

---

## API Endpoints & Examples

### 1. List Internships (With Filtering & Search)
Retrieve a paginated list of internships. You can also filter, search, and sort the results.
- **URL**: `/api/internships`
- **Method**: `GET`
- **Query Params**: 
  - Pagination: `page` (default: 1), `limit` (default: 10)
  - Search & Filter: `search` (searches title/description), `location`, `status`
  - Sorting: `sortBy` (default: created_at), `order` (ASC or DESC)
- **Curl Example**:
  ```bash
  curl -X GET "http://localhost:3000/api/internships?location=Remote&status=Open&search=software"
  ```
- **Expected Output**:
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "Software Engineering Intern",
        "company": "TechCorp",
        "location": "Remote",
        "stipend": "$3000/month",
        "description": "Work on our core product using Node.js and React.",
        "skills": ["Node.js", "React", "SQL"],
        "status": "Open",
        "application_deadline": "2026-12-31",
        "is_remote": true,
        "created_at": "2026-08-19 03:50:09"
      }
    ],
    "pagination": {
      "total_records": 1,
      "current_page": 1,
      "total_pages": 1,
      "per_page": 10
    }
  }
  ```

### 2. Get Internship Detail
Retrieve a single internship by its ID.
- **URL**: `/api/internships/:id`
- **Method**: `GET`
- **Curl Example**:
  ```bash
  curl -X GET "http://localhost:3000/api/internships/1"
  ```
- **Expected Output**:
  ```json
  {
    "id": 1,
    "title": "Software Engineering Intern",
    "company": "TechCorp",
    "location": "Remote",
    "stipend": "$3000/month",
    "description": "Work on our core product using Node.js and React.",
    "skills": ["Node.js", "React", "SQL"],
    "status": "Open",
    "application_deadline": "2026-12-31",
    "is_remote": true,
    "created_at": "2026-08-19 03:50:09"
  }
  ```

### 3. Create Internship
Create a new internship record.
- **URL**: `/api/internships`
- **Method**: `POST`
- **Body**: JSON
  ```json
  {
    "title": "Backend Intern",
    "company": "Tech Innovations",
    "location": "Remote",
    "stipend": "$2000",
    "description": "Work with Node.js and Express.",
    "skills": "[\"Node.js\", \"Express\", \"MongoDB\"]",
    "status": "Open",
    "application_deadline": "2027-01-15",
    "is_remote": true
  }
  ```
- **Curl Example**:
  ```bash
  curl -X POST http://localhost:3000/api/internships \
  -H "Content-Type: application/json" \
  -d '{"title":"Backend Intern","company":"Tech Innovations","location":"Remote","stipend":"$2000","description":"Work with Node.js and Express.","skills":"[\"Node.js\", \"Express\", \"MongoDB\"]","status":"Open","application_deadline":"2027-01-15","is_remote":true}'
  ```
- **Expected Output**:
  ```json
  {
    "id": 6,
    "title": "Backend Intern",
    "company": "Tech Innovations",
    "location": "Remote",
    "stipend": "$2000",
    "description": "Work with Node.js and Express.",
    "skills": ["Node.js", "Express", "MongoDB"],
    "status": "Open",
    "application_deadline": "2027-01-15",
    "is_remote": true,
    "created_at": "2026-08-19 03:55:00"
  }
  ```

### 4. Update Internship
Update an existing internship record completely.
- **URL**: `/api/internships/:id`
- **Method**: `PUT`
- **Body**: JSON (Requires all mandatory fields: `title`, `company`, `location`)
- **Curl Example**:
  ```bash
  curl -X PUT http://localhost:3000/api/internships/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Senior Software Engineering Intern","company":"TechCorp Updated","location":"San Francisco, CA","stipend":"$5000/month","description":"Updated description.","skills":"[\"Node.js\", \"React\", \"AWS\"]","status":"Closed","application_deadline":"2026-12-31","is_remote":false}'
  ```
- **Expected Output**:
  ```json
  {
    "id": 1,
    "title": "Senior Software Engineering Intern",
    "company": "TechCorp Updated",
    "location": "San Francisco, CA",
    "stipend": "$5000/month",
    "description": "Updated description.",
    "skills": ["Node.js", "React", "AWS"],
    "status": "Closed",
    "application_deadline": "2026-12-31",
    "is_remote": false,
    "created_at": "2026-08-19 03:50:09"
  }
  ```

### 5. Delete Internship
Delete an internship by ID.
- **URL**: `/api/internships/:id`
- **Method**: `DELETE`
- **Curl Example**:
  ```bash
  curl -X DELETE http://localhost:3000/api/internships/1
  ```
- **Expected Output**:
  ```json
  {
    "message": "Internship deleted successfully"
  }
  ```

---

## Validation & Error Handling
- **Required fields**: `title`, `company`, `location`.
- Attempting to POST or PUT without these fields will return a `400 Bad Request` with an array of validation errors.
  ```json
  {
    "errors": [
      {
        "type": "field",
        "value": "",
        "msg": "Title is required",
        "path": "title",
        "location": "body"
      }
    ]
  }
  ```
- Fetching, updating, or deleting a non-existent ID returns a `404 Not Found`.
- Any internal server errors return a `500 Internal Server Error`.
