# Student Dashboard

A full-stack student result management system built with TypeScript.

## Features
- Student registration with class and section
- Marks entry for Maths, Science, English, and Computer
- Automatic total, percentage, and grade calculation
- Rank calculation
- Class-wise and section-wise leaderboard
- Responsive frontend UI
- Local login/signup flow for dashboard access
- PostgreSQL database support via Neon

## Tech Stack
- Backend: Node.js, Express, TypeScript, PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Database: Neon PostgreSQL

## Project Structure
- [Backend](Backend) — Express API and database logic
- [Frontend](Frontend) — frontend runner
- [Frontend/school](Frontend/school) — React application

## Environment Setup
Create [Backend/.env](Backend/.env) with:

PORT=5000
DATABASE_URL=your_neon_connection_string

Do not commit real credentials.

## Install Dependencies
### Backend
1. Open [Backend](Backend)
2. Run:
   - `npm install`

### Frontend
1. Open [Frontend/school](Frontend/school)
2. Run:
   - `npm install`

## Run Locally
### Start backend
From [Backend](Backend):
- `npm run dev`

### Start frontend
From [Frontend](Frontend):
- `npm run dev`

Frontend runs on Vite, backend runs on port `5000`.

## Build
### Backend
From [Backend](Backend):
- `npm run build`

### Frontend
From [Frontend/school](Frontend/school):
- `npm run build`

## API Overview
### Students
- `GET /api/students`
- `POST /api/students`

### Results
- `GET /api/results`
- `GET /api/results/:studentId`
- `POST /api/results/marks`

## Notes
- Ranking supports tied percentages.
- Class and section filters are available in the dashboard.
- The leaderboard updates from saved result data.
