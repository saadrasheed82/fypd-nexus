import nodemailer from "nodemailer";

export async function sendCredentialsEmail(email, credentials, pdfBuffer) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP credentials not configured.');
    return {
      success: true,
      message: 'Email would be sent in production (SMTP not configured)',
      mockData: { to: email, subject: 'Your FYDP Nexus Login Credentials', credentials },
    };
  }

  try {
    // Determine the base URL based on environment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');
    
    const loginUrl = `${baseUrl}/auth/login`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `FYDP Nexus <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your FYDP Nexus Login Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to FYDP Nexus</h2>
          <p>Hello <strong>${credentials.name}</strong>,</p>
          <p>Your login credentials have been created:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${credentials.email}</p>
            <p><strong>Password:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 4px;">${credentials.password}</code></p>
            <p><strong>Role:</strong> ${credentials.role}</p>
          </div>
          <p style="color: #dc2626; font-weight: bold;">Important: Please change your password after first login.</p>
          <p><a href="${loginUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to FYDP Nexus</a></p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br/>FYDP Nexus Team</p>
        </div>
      `,
      attachments: [{
        filename: `credentials-${credentials.email}.txt`,
        content: pdfBuffer,
      }],
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
