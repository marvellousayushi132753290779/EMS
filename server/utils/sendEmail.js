import nodemailer from 'nodemailer'

const createTransporter = () => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })
}

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    const transporter = createTransporter()

    if (!transporter) {
        return { sent: false, reason: 'SMTP not configured' }
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject: 'Password Reset - Employee Management System',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0d9488;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You requested to reset your password for the Employee Management System.</p>
                <p>Click the button below to set a new password. This link expires in 1 hour.</p>
                <a href="${resetUrl}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                    Reset Password
                </a>
                <p>Or copy this link into your browser:</p>
                <p style="word-break: break-all; color: #555;">${resetUrl}</p>
                <p>If you did not request this, you can ignore this email.</p>
            </div>
        `,
    })

    return { sent: true }
}

export { sendPasswordResetEmail }
