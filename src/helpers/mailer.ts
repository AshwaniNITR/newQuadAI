// helpers/mailer.ts
import nodemailer from 'nodemailer';

// Interface for email options
interface MailOptions {
    email: string;
    emailType: string;
    userId: string;
}

export const sendemail = async ({ email, emailType, userId }: MailOptions) => {
    try {
        // Create a transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD, // Use App Password for better security
            },
        });

        // Determine email subject and HTML based on email type
        let subject = '';
        let html = '';

        if (emailType === "VERIFY") {
            subject = "Verify your email";
            html = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${userId}">here</a> to verify your email or copy and paste the link below in your browser.<br>${process.env.DOMAIN}/verifyemail?token=${userId}</p>`;
        } else if (emailType === "RESET") {
            subject = "Reset your password";
            html = `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${userId}">here</a> to reset your password.</p>`;
        }

        // Mail options
        const mailOptions = {
            from: `"Your App Name" <${process.env.GMAIL_USER}>`,
            to: email,
            subject,
            html,
        };

        // Send email
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(error instanceof Error ? error.message : "Email sending failed");
    }
};