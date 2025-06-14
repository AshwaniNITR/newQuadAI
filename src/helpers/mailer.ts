import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

interface EmailOptions {
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: EmailOptions) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });

    // Generate token
    const token = jwt.sign(
      { userId, emailType },
      process.env.TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    // Email content
    let subject = '';
    let html = '';
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    if (emailType === 'VERIFY') {
      subject = 'Verify Your Email Address';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Our App!</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${baseUrl}/verifyEmail?token=${token}" 
             style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; 
                    text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0;">
            Verify Email
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
      `;
    } else {
      subject = 'Password Reset Request';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Password Reset</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${baseUrl}/reset-password?token=${token}" 
             style="display: inline-block; padding: 12px 24px; background: #dc2626; color: white; 
                    text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
      `;
    }

    // Send email
    await transporter.sendMail({
      from: `"HexaDepth" <${process.env.MAILER_FROM}>`,
      to: email,
      subject,
      html,
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email sending failed');
  }
};