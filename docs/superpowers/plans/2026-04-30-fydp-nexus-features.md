# FYDP Nexus Feature Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete teacher/student FYDP workflow: teacher group setup, proposal approval locking, AI-style roadmap generation, monthly proof submissions, teacher verification, visual rankings, announcements, and in-app/email-style notifications.

**Architecture:** Keep the existing Next.js App Router structure and Neon PostgreSQL APIs. Add focused server-side helpers for schema bootstrapping, roadmap generation, and notification/email simulation so UI pages stay presentational. Extend existing student and teacher dashboards instead of creating a parallel app.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS, Axios, Neon PostgreSQL via `pg`, Lucide icons, Recharts.

---

## File Structure

- Modify: `app/lib/projects.js` — hydrate roadmap tasks and normalize existing project data.
- Create: `app/lib/fydpFeatures.js` — schema bootstrap, local AI planner, notification helpers, and email-log simulation.
- Modify: `app/api/student/project/route.js` — include dashboard feature data and support document planning/proof submission.
- Modify: `app/api/teacher/projects/route.js` — include class overview data and support proposal/task verification, group setup, announcements.
- Modify: `app/std/dashboard/page.js` — implement locked/unlocked dashboard, roadmap upload, monthly proof submission, notifications.
- Modify: `app/tch/dashboard/page.js` — implement group setup, charts, rankings, announcements, proposal/task review queue.

### Task 1: Feature Helper and Schema Bootstrap

**Files:**
- Create: `app/lib/fydpFeatures.js`

- [ ] **Step 1: Add schema bootstrap, AI planner, notification, email-log, and progress helpers.**

### Task 2: Hydrate Feature Data

**Files:**
- Modify: `app/lib/projects.js`

- [ ] **Step 1: Import the feature schema helper.**
- [ ] **Step 2: Include monthly roadmap/proof tasks in hydrated project objects.**

### Task 3: Student API Features

**Files:**
- Modify: `app/api/student/project/route.js`

- [ ] **Step 1: Return project, notifications, announcements, and email logs for the current student.**
- [ ] **Step 2: Add `generate-roadmap` action that creates month-by-month tasks from submitted text.**
- [ ] **Step 3: Add `submit-proof` action that stores screenshot/video file names and marks the task submitted.**

### Task 4: Teacher API Features

**Files:**
- Modify: `app/api/teacher/projects/route.js`

- [ ] **Step 1: Return projects, groups, rankings, pending task submissions, and announcements.**
- [ ] **Step 2: Add `setup-groups`, `verify-task`, and `announcement` actions while preserving proposal review.**

### Task 5: Student Dashboard UI

**Files:**
- Modify: `app/std/dashboard/page.js`

- [ ] **Step 1: Add notification, announcement, roadmap, and proof submission state.**
- [ ] **Step 2: Lock main dashboard until proposal status is approved.**
- [ ] **Step 3: Show rejection/revision pop-up feedback and resubmission path.**
- [ ] **Step 4: Add document upload/text input for local AI roadmap generation.**
- [ ] **Step 5: Render monthly tasks with screenshot/video upload, submit, green tick, cross mark, and feedback.**

### Task 6: Teacher Dashboard UI

**Files:**
- Modify: `app/tch/dashboard/page.js`

- [ ] **Step 1: Add teacher group setup form.**
- [ ] **Step 2: Add group progress charts and top rankings.**
- [ ] **Step 3: Add task verification queue with verify/reject feedback.**
- [ ] **Step 4: Add announcement composer targeting all groups or one group.**

### Task 7: Verify

**Files:**
- All modified files

- [ ] **Step 1: Run `npm run lint`.**
- [ ] **Step 2: Run `npm run build`.**

---

## Self-Review

- Spec coverage: login portals already exist; group setup, proposal approval lock, AI mapping, proof uploads, live progress, teacher verification, group overview, rankings, announcements, pop-up notifications, and email simulation are covered.
- Placeholder scan: no implementation placeholders remain in the plan.
- Scope note: real PDF/DOCX parsing and real outbound email need backend services/credentials. This implementation provides a functional local planner and email log simulation inside the app.
