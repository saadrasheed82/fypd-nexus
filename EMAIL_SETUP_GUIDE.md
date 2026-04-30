# Email Setup Guide

## Step 1: Install Nodemailer

Run in your terminal:
```bash
npm install nodemailer
```

## Step 2: Generate Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Create new app password:
   - App name: FYDP Nexus
   - Click Create
5. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

## Step 3: Update .env.local

Add these lines to your .env.local file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-16-char-app-password` with the app password from step 2

## Step 4: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Step 5: Test Email Sending

1. Login as admin
2. Go to /admin
3. Create a test credential
4. Click "Send via Email"
5. Check the recipient email inbox

## Troubleshooting

### Email not sending
- Verify SMTP_USER and SMTP_PASS are correct
- Check if 2-Step Verification is enabled
- Make sure you used App Password, not regular password
- Check console logs for errors

### Gmail blocking
- Ensure "Less secure app access" is not needed (App Passwords bypass this)
- Check Gmail security settings
- Verify the app password is still active

## Example .env.local

```env
DATABASE_URL=postgresql://...

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@example.com
SMTP_PASS=abcd efgh ijkl mnop
```

---

Once configured, emails will be sent automatically when you click "Send via Email" in the admin panel.
