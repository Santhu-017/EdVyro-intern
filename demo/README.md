# Secure Application Integration - Walkthrough Demo

This directory contains the `walkthrough.webp` file, which is a recorded demonstration of the **Secure Application Integration Internship Portal**.

## What is Demonstrated?

The video walks through the complete user journey and highlights the core engineering and design decisions that went into building this production-ready capstone project.

### 1. Dynamic Job Board & Filtering
- **Navigation**: The seamless transition between different views (Find Internships, My Applications, My Profile) without page reloads.
- **Advanced Filtering**: Real-time filtering of internship opportunities. The demo shows selecting specific domains (e.g., Engineering) and toggling the "Remote Only" switch to dynamically update the available listings.

### 2. Application Flow & Security
- **Submitting Applications**: The secure application modal that accepts user details and resume uploads (PDF/DOC/DOCX). 
- **Validation in Action**: The backend actively validates email formats, ensures required fields are present, and enforces a strict 5MB limit on resume uploads, immediately rejecting malicious or invalid files.

### 3. Smart Profile Parser
- **Resume Extraction**: The "My Profile" tab demonstrates the `pdf-parse` integration. When a resume is uploaded, the backend extracts the email address, academic background, and relevant technical skills to automatically build a user profile.

### 4. Polished UI & Accessibility
- **Theme Toggling**: The built-in Dark/Light mode switcher that instantly adjusts the CSS variables to provide a high-contrast, accessible viewing experience in low-light environments.
- **Responsive Design**: The CSS grid and flexbox layouts naturally adjust, demonstrating the mobile-friendly constraints applied to sidebars, modals, and navigation tabs.

## How to View the Video

The recording is saved as an animated WebP file (`walkthrough.webp`), which offers high quality at a small file size.
- **Windows/Mac**: Simply double-click the file to open it in your default web browser (Chrome, Edge, Safari, Firefox).
- **In Editor**: If you are using VS Code or a similar IDE, you can click on the file to view the animation directly within the editor.
