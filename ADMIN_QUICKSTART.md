# Admin Credential System - Quick Start

## Step 1: Setup Admin User

Run the setup script to create an admin user in your database:

```bash
node scripts/setup-admin.js
```

Default admin credentials:
- Email: admin@fydpnexus.com
- Password: admin123

**IMPORTANT:** Change the password after first login!

## Step 2: Configure Email (Optional)

Add to .env.local:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@fydpnexus.com
```

## Step 3: Access Admin Panel

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Login with admin credentials

3. Navigate to: http://localhost:3000/admin

## Step 4: Create User Credentials

1. Fill in the form with user details
2. Click Create Credentials
3. System generates a random password
4. Send via email or download as PDF

## Features

- Auto-generate secure passwords
- Create student and teacher accounts
- Send credentials via email with PDF
- Download credentials as text file
- Admin-only access protection

## Files Created

- /app/admin/page.js - Admin UI
- /app/api/admin/create-credentials/route.js - API endpoint
- /app/api/admin/send-credentials/route.js - Email API
- /app/lib/utils/pdfGenerator.js - PDF utility
- /app/lib/utils/emailSender.js - Email utility
- /scripts/setup-admin.js - Setup script
- /scripts/setup-admin.sql - SQL script

For detailed documentation, see docs/ADMIN_SYSTEM.md
