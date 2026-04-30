export function generateCredentialsPDF(credentials) {
  const { name, email, password, role } = credentials;
  
  const pdfContent = `
FYDP Nexus - Login Credentials
================================

Name: ${name}
Email: ${email}
Password: ${password}
Role: ${role}

Please keep these credentials safe and change your password after first login.

Generated on: ${new Date().toLocaleString()}
  `;
  
  return pdfContent;
}

export function generateCredentialsPDFBuffer(credentials) {
  const content = generateCredentialsPDF(credentials);
  return Buffer.from(content, 'utf-8');
}
