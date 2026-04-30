# Admin System Setup Checklist

## Pre-Setup
- [ ] Ensure your Next.js app is running
- [ ] Verify DATABASE_URL is set in .env.local
- [ ] Backup your database (optional but recommended)

## Step 1: Create Admin User

Run the setup script:
```bash
npm run setup-admin
```

Expected output:
- Admin user created/updated successfully
- Login credentials displayed

Default credentials:
- Email: admin@fydpnexus.com
- Password: admin123

## Step 2: Test Admin Login

- [ ] Start dev server: npm run dev
- [ ] Go to http://localhost:3000/auth/login
- [ ] Login with admin credentials
- [ ] Verify you are logged in

## Step 3: Access Admin Panel

- [ ] Navigate to http://localhost:3000/admin
- [ ] Verify the admin page loads
- [ ] Check that the form is displayed

## Step 4: Test Credential Creation

- [ ] Fill in the form with test data:
  - Name: Test Student
  - Email: test@example.com
  - Role: Student
  - Department: Computer Science
- [ ] Click Create Credentials
- [ ] Verify credentials are displayed
- [ ] Note the generated password

## Step 5: Test PDF Download

- [ ] Click Download PDF button
- [ ] Verify file downloads
- [ ] Open file and check contents

## Step 6: Configure Email (Optional)

If you want to send emails:

1. Install nodemailer:
```bash
npm install nodemailer
```

2. Add to .env.local:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@fydpnexus.com
```

3. For Gmail:
   - [ ] Enable 2-factor authentication
   - [ ] Generate App Password
   - [ ] Use App Password in SMTP_PASS

4. Test email sending:
   - [ ] Create new credentials
   - [ ] Click Send via Email
   - [ ] Check recipient inbox
   - [ ] Verify email received with attachment

## Step 7: Security

- [ ] Change admin password after first login
- [ ] Test that non-admin users cannot access /admin
- [ ] Verify API endpoints require admin role

## Step 8: Production Preparation

- [ ] Change default admin password
- [ ] Configure production SMTP settings
- [ ] Test in production environment
- [ ] Set up email monitoring
- [ ] Document admin procedures for your team

## Troubleshooting

### Admin user not created
- Check DATABASE_URL in .env.local
- Verify database connection
- Check console for errors
- Try running SQL script manually

### Cannot access /admin page
- Verify you are logged in as admin
- Check user role in database
- Clear browser cookies and login again

### Email not sending
- Check SMTP credentials
- Verify nodemailer is installed
- Check console logs for errors
- Test SMTP connection separately

### Credentials not created
- Check for duplicate email
- Verify all required fields
- Check API response in browser console
- Review server logs

## Files Created

```
app/
  admin/
    page.js                              # Admin UI
  api/
    admin/
      create-credentials/
        route.js                           # Create API
      send-credentials/
        route.js                           # Email API
  lib/
    utils/
      pdfGenerator.js                      # PDF utility
      emailSender.js                       # Email utility

scripts/
  setup-admin.js                           # Setup script
  setup-admin.sql                          # SQL script

docs/
  ADMIN_SYSTEM.md                          # Full documentation

ADMIN_QUICKSTART.md                        # Quick start guide
ADMIN_IMPLEMENTATION.md                    # Implementation summary
ADMIN_CHECKLIST.md                         # This file
```

## Next Steps After Setup

1. Create real teacher accounts
2. Create real student accounts
3. Send credentials to users
4. Monitor email delivery
5. Collect feedback from users
6. Customize email templates if needed
7. Add bulk import feature (future enhancement)

## Support Resources

- Full Documentation: docs/ADMIN_SYSTEM.md
- Quick Start: ADMIN_QUICKSTART.md
- Implementation Details: ADMIN_IMPLEMENTATION.md
- Database Setup: scripts/setup-admin.js

---

Last Updated: April 30, 2026
