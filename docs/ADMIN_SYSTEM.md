# Admin Credential Management System

This system allows administrators to create login credentials for teachers and students, send them via email, and generate PDF documents.

## Features

- Create user credentials with auto-generated passwords
- Send credentials via email with PDF attachment
- Download credentials as PDF/text file
- Support for both teacher and student roles
- Secure admin-only access

## Setup

### 1. Database Setup

Ensure your users table supports the admin role. Run the setup script:

```bash
node scripts/setup-admin.js
```

Or manually execute the SQL in scripts/setup-admin.sql

### 2. Environment Variables

Add these to your .env.local file for email functionality:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@fydpnexus.com
```

### 3. Install Dependencies

The system uses built-in Node.js modules. For production email sending, install:

```bash
npm install nodemailer
```

## Usage

### Access the Admin Page

1. Login as admin user:
   - Email: admin@fydpnexus.com
   - Password: admin123 (change after first login)

2. Navigate to /admin

### Create Credentials

1. Fill in the form:
   - Full Name
   - Email Address
   - Role (Student/Teacher)
   - Department

2. Click Create Credentials

3. The system will:
   - Generate a secure random password
   - Create the user account
   - Display the credentials

### Send Credentials

After creating credentials:

1. Click Send via Email to email the credentials with PDF attachment
2. Click Download PDF to save credentials locally

## API Endpoints

### POST /api/admin/create-credentials

Create new user credentials.

### POST /api/admin/send-credentials

Send credentials via email with PDF attachment.

## Security Notes

- Only users with admin role can access these endpoints
- Passwords are randomly generated (16 characters)
- Users should change passwords after first login
- Email credentials are sent securely via SMTP
- PDF files contain sensitive information - handle carefully

## File Structure

app/admin/page.js - Admin UI page
app/api/admin/create-credentials/route.js - Create credentials API
app/api/admin/send-credentials/route.js - Send email API
app/lib/utils/pdfGenerator.js - PDF generation utility
app/lib/utils/emailSender.js - Email sending utility
scripts/setup-admin.sql - SQL setup script
scripts/setup-admin.js - Node.js setup script
