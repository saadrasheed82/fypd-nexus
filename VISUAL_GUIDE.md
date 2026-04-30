# FYDP Nexus - Admin System Visual Guide

## System Overview

```
+------------------+
|  Admin Login     |
+--------+---------+
         |
         v
+------------------+     +----------------------+
|   Dashboard      |<--->|  Create Credentials  |
|  /admin/dashboard|     |  /admin              |
+------------------+     +----------------------+
         |                        |
         |                        |
    View Users              Create User
    Search/Filter           Generate Password
    Delete Users            Send Email/PDF
```

## Dashboard Features

### Statistics Cards
```
+-------------+  +-------------+  +-------------+  +-------------+
| Total Users |  |  Students   |  |  Teachers   |  |   Admins    |
|     50      |  |     35      |  |     12      |  |      3      |
+-------------+  +-------------+  +-------------+  +-------------+
```

### User Table
```
+--------+------------------+----------+-------------+------------+---------+
| Avatar | Name             | Email    | Role        | Department | Actions |
+--------+------------------+----------+-------------+------------+---------+
| [img]  | John Doe         | john@... | Student     | CS         | [Del]   |
| [img]  | Jane Smith       | jane@... | Teacher     | CS         | [Del]   |
| [img]  | Admin User       | admin@.. | Admin       | Admin      | [Del]   |
+--------+------------------+----------+-------------+------------+---------+
```

### Search & Filter
```
+---------------------------+  +----------------+  +------------------+
| [Search] Search users...  |  | [Filter] Role  |  | [+] Create User  |
+---------------------------+  +----------------+  +------------------+
```

## Credential Creation Flow

```
1. Fill Form
   +------------------+
   | Name: _______    |
   | Email: ______    |
   | Role: [v]        |
   | Dept: _______    |
   +------------------+
          |
          v
2. Create
   +------------------+
   | [Create Button]  |
   +------------------+
          |
          v
3. Display Credentials
   +------------------+
   | Name: John Doe   |
   | Email: john@...  |
   | Pass: a1b2c3d4   |
   | Role: Student    |
   +------------------+
          |
          v
4. Actions
   +------------------+  +------------------+
   | [Send Email]     |  | [Download PDF]   |
   +------------------+  +------------------+
```

## API Endpoints

```
POST /api/admin/create-credentials
  Input: { name, email, role, department }
  Output: { user: { id, name, email, role, password } }

POST /api/admin/send-credentials
  Input: { name, email, role, password }
  Output: { success: true, message: "Email sent" }

GET /api/admin/users?role=student&search=john
  Output: { users: [...], total: 10 }

DELETE /api/admin/users?id=5
  Output: { message: "User deleted", user: {...} }
```

## File Organization

```
app/
  admin/
    page.js ..................... Create Credentials UI
    dashboard/
      page.js ................... Dashboard UI
  api/
    admin/
      create-credentials/
        route.js ................ Create API
      send-credentials/
        route.js ................ Email API
      users/
        route.js ................ User Management API
  lib/
    utils/
      pdfGenerator.js ........... PDF Utility
      emailSender.js ............ Email Utility
```

## Color Coding

```
Role Badges:
  Student .... Green
  Teacher .... Purple
  Admin ...... Orange

Stat Cards:
  Total ...... Blue
  Students ... Green
  Teachers ... Purple
  Admins ..... Orange
```

## User Journey

```
Step 1: Admin logs in
  -> Email: admin@fydpnexus.com
  -> Password: admin123

Step 2: Access dashboard
  -> URL: /admin/dashboard
  -> View statistics
  -> See all users

Step 3: Search/Filter
  -> Type in search box
  -> Select role filter
  -> View filtered results

Step 4: Create new user
  -> Click "Create Credentials"
  -> Fill form
  -> Submit

Step 5: Send credentials
  -> Click "Send via Email"
  -> Or "Download PDF"
  -> User receives credentials

Step 6: Return to dashboard
  -> Click "View Dashboard"
  -> See new user in list
```

## Security Flow

```
Request
  |
  v
Check Cookie
  |
  v
Get User from DB
  |
  v
Verify Role = Admin
  |
  +-- Yes --> Allow Access
  |
  +-- No --> 401 Unauthorized
```

## Quick Reference

### URLs
- Dashboard: http://localhost:3000/admin/dashboard
- Create: http://localhost:3000/admin

### Commands
```bash
npm run setup-admin    # Create admin user
npm run dev            # Start server
```

### Default Credentials
```
Email: admin@fydpnexus.com
Password: admin123
```

### Documentation
```
ADMIN_README.md ........... Main guide
ADMIN_DASHBOARD.md ........ Dashboard features
ADMIN_QUICKSTART.md ....... Quick setup
ADMIN_CHECKLIST.md ........ Setup checklist
```

---

Created: April 30, 2026
Status: Production Ready
