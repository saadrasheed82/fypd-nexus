# FYDP Nexus - Admin Credential Management System

## Overview

Complete admin system for creating and managing login credentials for teachers and students with email delivery and PDF generation.

## Quick Start

### 1. Setup Admin User

```bash
npm run setup-admin
```

Default credentials:
- **Email**: admin@fydpnexus.com
- **Password**: admin123 (change after first login!)

### 2. Access Admin Panel

```bash
npm run dev
```

Navigate to: http://localhost:3000/admin

### 3. Create Credentials

1. Login as admin
2. Fill in user details (name, email, role, department)
3. Click Create Credentials
4. System generates random password
5. Send via email or download PDF

## Features

- Auto-generate secure 16-character passwords
- Create student and teacher accounts
- Send credentials via email with PDF attachment
- Download credentials as text file
- Beautiful, responsive UI with animations
- Real-time form validation
- Toast notifications
- Admin-only access protection

## Files Created

### Frontend
- `app/admin/page.js` - Admin UI page

### Backend APIs
- `app/api/admin/create-credentials/route.js` - Create credentials
- `app/api/admin/send-credentials/route.js` - Send email

### Utilities
- `app/lib/utils/pdfGenerator.js` - PDF generation
- `app/lib/utils/emailSender.js` - Email sending

### Scripts
- `scripts/setup-admin.js` - Node.js setup script
- `scripts/setup-admin.sql` - SQL setup script

### Documentation
- `ADMIN_QUICKSTART.md` - Quick start guide
- `ADMIN_IMPLEMENTATION.md` - Implementation details
- `ADMIN_CHECKLIST.md` - Setup checklist
- `ADMIN_ARCHITECTURE.md` - System architecture
- `docs/ADMIN_SYSTEM.md` - Full documentation

## Email Configuration (Optional)

To enable email sending, add to `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@fydpnexus.com
```

Then install nodemailer:

```bash
npm install nodemailer
```

### Gmail Setup

1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `SMTP_PASS`

## API Endpoints

### POST /api/admin/create-credentials

Create new user credentials.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "message": "Credentials created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "password": "a1b2c3d4e5f6g7h8"
  }
}
```

### POST /api/admin/send-credentials

Send credentials via email.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "password": "a1b2c3d4e5f6g7h8"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Security

- Admin-only access (role-based authentication)
- Random password generation using Node.js crypto
- Secure database connections with SSL
- Email encryption via SMTP TLS
- Password change reminders in emails
- Input validation and sanitization

## Technology Stack

- **Frontend**: React 19, Next.js 16, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Neon)
- **Email**: Nodemailer
- **Security**: Cookie-based auth, RBAC

## Troubleshooting

### Cannot access /admin
- Verify you are logged in as admin
- Check user role in database
- Clear cookies and login again

### Email not sending
- Check SMTP credentials in .env.local
- Verify nodemailer is installed
- Check console logs for errors
- System works in mock mode without email config

### Admin user not created
- Check DATABASE_URL in .env.local
- Verify database connection
- Run SQL script manually if needed

## Documentation

- **Quick Start**: ADMIN_QUICKSTART.md
- **Setup Checklist**: ADMIN_CHECKLIST.md
- **Implementation**: ADMIN_IMPLEMENTATION.md
- **Architecture**: ADMIN_ARCHITECTURE.md
- **Full Docs**: docs/ADMIN_SYSTEM.md

## Support

For issues or questions, check the documentation files or review the console logs for error messages.

---

**Created**: April 30, 2026
**Version**: 1.0.0
**Status**: Production Ready
