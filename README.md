# FYDP Nexus Server

## Overview

A complete final year project tracker built with Next.js 16 and Neon PostgreSQL. Students submit proposals, track milestones, and receive supervisor feedback. Teachers review proposals, monitor progress, and guide teams.

## Features

- **Authentication**: Cookie-based sessions with student/teacher roles
- **Student Dashboard**: Submit proposals, track progress, view feedback
- **Teacher Dashboard**: Review proposals, approve/request revisions, monitor teams
- **Neon PostgreSQL**: Persistent database with projects, comments, milestones, tasks
- **Real-time Updates**: API-backed data flow with axios

## Folder Structure

```
Client/
│   .env
│   package.json
│   next.config.mjs
│   jsconfig.json
│   postcss.config.mjs
│   eslint.config.mjs
│
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   ├── not-found.js
│   ├── page.js
│   ├── (default)/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── hooks/
│   ├── tch/
│   └── std/
├── public/
│   ├── icons/
│   ├── logo.svg
│   ├── logotxt.svg
│   └── logotxtwt.svg
└── .next/
    └── ... (build output)
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Neon PostgreSQL account (free tier works)

### Installation

1. **Clone the repository:**
    ```sh
    git clone <repo-url>
    cd Client
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up Neon database:**
    - The database schema and seed data are already applied to project ID `wispy-darkness-79531861`
    - Connection string is in `.env.local` (already configured)
    - Or create your own Neon project and run the migration from the Neon console

4. **Configure environment:**
    - `.env.local` contains `DATABASE_URL` pointing to Neon
    - Copy `.env.example` to `.env.local` if you need to change the connection string

5. **Run the development server:**
    ```sh
    npm run dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm start` – Start the production server
- `npm run lint` – Run ESLint

## Project Structure

- **app/** – Main application pages and layouts (Next.js App Router)
- **app/api/** – Next.js API routes (auth, projects, teachers)
- **app/lib/** – Database connection, auth helpers, project utilities
- **components/** – Reusable UI components (Navbar, Sidebar, Footer, etc.)
- **services/** – Legacy mock data (no longer used in production)
- **public/** – Static assets

## Database Schema

- **users**: Students and teachers with roles, departments, avatars
- **projects**: Proposals with status, progress, supervisor assignments
- **project_comments**: Supervisor feedback on proposals
- **project_milestones**: Project timeline with due dates
- **project_tasks**: Task tracking with completion status

## Demo Credentials

- **Student**: `student@demo.com` / `password123`
- **Teacher**: `teacher@demo.com` / `password123`

## Deployment

- Ready to deploy on Vercel with Neon PostgreSQL
- Set `DATABASE_URL` environment variable in Vercel dashboard
- Vercel will auto-detect Next.js and deploy

## API Endpoints

- `POST /api/auth/login` – Login with email, password, role
- `POST /api/auth/register` – Register new user
- `POST /api/auth/logout` – Clear session cookie
- `GET /api/me` – Get current user from session
- `GET /api/teachers` – List all teachers
- `GET /api/student/project` – Get student's project
- `POST /api/student/project` – Submit/update project proposal
- `PATCH /api/student/project` – Update project progress
- `GET /api/teacher/projects` – Get teacher's supervised projects
- `PATCH /api/teacher/projects` – Review project (approve/revision)

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes, PostgreSQL (Neon)
- **Database**: Neon PostgreSQL with `pg` driver
- **Auth**: Cookie-based sessions (httpOnly)
- **UI**: Framer Motion, GSAP, Lucide Icons, React Hook Form, Zod
- **Charts**: Recharts

## License

This project is licensed under the MIT License.
