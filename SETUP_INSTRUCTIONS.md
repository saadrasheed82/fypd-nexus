# FINAL SETUP INSTRUCTIONS

## Admin System Setup - Easy Method

Since the npm script has issues, use this simple API endpoint method:

### Step 1: Start Your Dev Server

```bash
npm run dev
```

### Step 2: Create Admin User

Open your browser and visit:

```
http://localhost:3000/api/setup-admin-once
```

You should see a success message with:
- Admin user created
- Email: admin@fydpnexus.com
- Password: admin123

### Step 3: Login

1. Go to: http://localhost:3000/auth/login
2. Login with:
   - Email: admin@fydpnexus.com
   - Password: admin123

### Step 4: Access Dashboard

Visit: http://localhost:3000/admin/dashboard

You should see:
- Statistics cards (users, students, teachers, admins)
- User table with all users
- Search and filter options

### Step 5: Create Credentials

Click "Create Credentials" button or visit:
http://localhost:3000/admin

Fill in the form to create student/teacher accounts.

### Step 6: Clean Up (Optional)

After creating the admin user, you can delete the setup endpoint:

```bash
rmdir /s app\api\setup-admin-once
```

## Alternative Setup Methods

If the API method doesn't work, see ADMIN_SETUP_MANUAL.md for other options including:
- Using Neon Console SQL Editor
- Using psql command line
- Using the register endpoint

## What You Can Do Now

### Dashboard Features
- View all users
- Search by name or email
- Filter by role (student/teacher/admin)
- Delete users
- See real-time statistics

### Create Credentials
- Create student accounts
- Create teacher accounts
- Auto-generate passwords
- Send via email (if SMTP configured)
- Download as PDF/text

## Email Configuration (Optional)

To enable email sending, add to .env.local:

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

## Troubleshooting

### Cannot access /api/setup-admin-once
- Make sure dev server is running
- Check console for errors
- Verify DATABASE_URL in .env.local

### Admin user not created
- Check the API response for error messages
- Verify users table exists in database
- Try using Neon Console SQL method

### Cannot login
- Verify admin user was created
- Check email and password are correct
- Clear browser cookies and try again

### Dashboard not loading
- Ensure you are logged in as admin
- Check browser console for errors
- Verify API endpoints are working

## Documentation

- ADMIN_README.md - Complete guide
- ADMIN_DASHBOARD.md - Dashboard features
- ADMIN_SETUP_MANUAL.md - Alternative setup methods
- VISUAL_GUIDE.md - Visual reference

## Support

If you encounter issues:
1. Check the documentation files
2. Review browser console logs
3. Check network tab for API errors
4. Verify database connection

---

Created: April 30, 2026
Status: Ready to use!
