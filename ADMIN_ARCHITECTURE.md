# Admin Credential System - Architecture

## System Flow

```
+-------------------+
|   Admin Login     |
|  (admin role)     |
+--------+----------+
         |
         v
+-------------------+
|   /admin Page     |
|   (React Form)    |
+--------+----------+
         |
         | Fill form & submit
         v
+-------------------+
| POST /api/admin/  |
| create-credentials|
+--------+----------+
         |
         | 1. Validate input
         | 2. Generate password
         | 3. Insert to DB
         v
+-------------------+
|  Neon Database    |
|   (PostgreSQL)    |
+--------+----------+
         |
         | Return user data
         v
+-------------------+
|  Display Results  |
|  on Admin Page    |
+--------+----------+
         |
         +----------+----------+
         |                     |
         v                     v
+-------------------+  +-------------------+
|  Download PDF     |  |  Send via Email   |
+-------------------+  +--------+----------+
                              |
                              v
                     +-------------------+
                     | POST /api/admin/ |
                     | send-credentials |
                     +--------+----------+
                              |
                              | 1. Generate PDF
                              | 2. Send email
                              v
                     +-------------------+
                     |  SMTP Server      |
                     |  (Gmail, etc)     |
                     +--------+----------+
                              |
                              v
                     +-------------------+
                     | User Email Inbox  |
                     | (with PDF)        |
                     +-------------------+
```

## Component Breakdown

### 1. Frontend (app/admin/page.js)
- React component with form
- State management for form data
- API calls to backend
- Toast notifications
- PDF download functionality

### 2. Backend APIs

#### Create Credentials API
```
POST /api/admin/create-credentials

Input: { name, email, role, department }
Process:
  1. Check admin authentication
  2. Validate input data
  3. Generate random password (16 chars)
  4. Insert user into database
  5. Return user data with password

Output: { user: { id, name, email, role, password } }
```

#### Send Credentials API
```
POST /api/admin/send-credentials

Input: { name, email, role, password }
Process:
  1. Check admin authentication
  2. Generate PDF content
  3. Create email with HTML template
  4. Attach PDF to email
  5. Send via SMTP

Output: { success, message }
```

### 3. Utilities

#### PDF Generator (app/lib/utils/pdfGenerator.js)
```javascript
generateCredentialsPDF(credentials)
  -> Returns formatted text content

generateCredentialsPDFBuffer(credentials)
  -> Returns Buffer for email attachment
```

#### Email Sender (app/lib/utils/emailSender.js)
```javascript
sendCredentialsEmail(email, credentials, pdfBuffer)
  -> Sends email via nodemailer
  -> Falls back to mock mode if not configured
```

### 4. Database

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  department VARCHAR(255),
  student_group VARCHAR(255),
  designation VARCHAR(255),
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Model

```
Request -> Middleware -> requireUser("admin") -> Handler
                              |
                              v
                         Check cookie
                              |
                              v
                         Query database
                              |
                              v
                         Verify role = admin
                              |
                    +---------+---------+
                    |                   |
                    v                   v
                 Allowed           Unauthorized
                 (200/201)            (401)
```

## Data Flow

### Creating Credentials
```
Admin Form
  -> { name, email, role, department }
  -> API validates input
  -> Generate password: crypto.randomBytes(8).toString("hex")
  -> Insert to database
  -> Return credentials with password
  -> Display on UI
```

### Sending Email
```
Credentials Object
  -> Generate PDF content
  -> Create Buffer
  -> Build HTML email
  -> Attach PDF
  -> Send via SMTP
  -> Confirm delivery
```

## Technology Stack

- **Frontend**: React 19, Next.js 16, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Neon)
- **Email**: Nodemailer, SMTP
- **Security**: Cookie-based auth, Role-based access control
- **Utilities**: Node.js crypto, Buffer API

## Environment Variables

```
DATABASE_URL          -> Neon PostgreSQL connection
SMTP_HOST             -> Email server host
SMTP_PORT             -> Email server port
SMTP_USER             -> Email username
SMTP_PASS             -> Email password
SMTP_FROM             -> Sender email address
```

## API Authentication

All admin endpoints use the same authentication pattern:

```javascript
const user = await requireUser("admin");
if (!user) return unauthorized();
```

This checks:
1. User is logged in (has valid cookie)
2. User role is "admin"
3. Returns 401 if either check fails

## Error Handling

```
API Errors:
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (not admin)
  - 500: Server Error (database/email errors)

UI Errors:
  - Toast notifications
  - Form validation
  - Loading states
```

---

This architecture provides a secure, scalable system for managing user credentials with email delivery and PDF generation capabilities.
