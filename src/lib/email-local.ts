import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EMAIL] SMTP not configured — skipping: ${subject} to ${to}`);
    return { success: false, error: new Error('SMTP not configured') };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@embir.xyz',
      to,
      subject,
      html,
    });
    console.log(`[EMAIL] Sent: ${subject} to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Error:', error);
    return { success: false, error: error as Error };
  }
}
