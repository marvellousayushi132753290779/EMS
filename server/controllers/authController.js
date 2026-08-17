import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { sendPasswordResetEmail } from '../utils/sendEmail.js'

const findUserByEmail = (email) => {
    const trimmed = email.trim()
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return User.findOne({ email: { $regex: new RegExp(`^${escaped}$`, 'i') } })
}

const isBcryptHash = (str) => {
    return typeof str === 'string' && (str.startsWith('$2a$') || str.startsWith('$2b$') || str.startsWith('$2y$'))
}

const login = async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        const {email, password} = req.body;
        
        if(!email || !password) {
            return res.status(400).json({success: false, message: "Email and password are required"})
        }
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        const user = await User.findOne({email: trimmedEmail})
        if(!user) {
            return res.status(404).json({success: false, message: "User Not Found"})
        }
        if(!user.password) {
            console.error('User found but password field is missing');
            return res.status(500).json({success: false, message: "User account error"})
        }

        let isMatch = false;
        
        if(isBcryptHash(user.password)) {
            isMatch = await bcrypt.compare(trimmedPassword, user.password);
        } else {
            console.warn(`User ${user.email} has unhashed password. Please migrate to hashed passwords.`);
            isMatch = trimmedPassword === user.password;

            if(isMatch) {
                const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
                await User.findByIdAndUpdate(user._id, { password: hashedPassword });
                console.log(`Password hashed and updated for user ${user.email}`);
            }
        }
        
        if(!isMatch) {
            return res.status(401).json({success: false, message: "Wrong Password"})
        }

        const token = jwt.sign(
            {_id: user._id, role: user.role},
            process.env.JWT_KEY, 
            { expiresIn: "10d" }
        )

        res
        .status(200)
        .json({
            success: true, 
            token, 
            user: {_id: user._id, name: user.name, role: user.role, email: user.email },
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
};

const verify = (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            _id: req.user._id,
            name: req.user.name,
            role: req.user.role,
            email: req.user.email,
        },
    })
}

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, error: "Old and new password are required" })
        }

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Old password is incorrect" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({ success: true, message: "Password changed successfully" })
    } catch (error) {
        console.error('Change password error:', error)
        return res.status(500).json({ success: false, error: error.message || "Server error" })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }

        const user = await findUserByEmail(email)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "This email is not registered. Please use the email given when your account was created, or contact your admin.",
            })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
        await user.save()

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

        const emailResult = await sendPasswordResetEmail(user.email, resetUrl)

        if (emailResult.sent) {
            console.log(`Password reset email sent to ${user.email}`)
            return res.status(200).json({
                success: true,
                message: "Password reset link has been sent to your email. Please check your inbox and spam folder.",
                emailSent: true,
            })
        }

        console.log(`SMTP not configured. Reset link for ${user.email}: ${resetUrl}`)
        return res.status(200).json({
            success: true,
            message: "Email is not configured on the server. Use the link below to reset your password.",
            resetUrl,
            emailSent: false,
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        return res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again later.' })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" })
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset link" })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        return res.status(200).json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        console.error('Reset password error:', error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export {login, verify, changePassword, forgotPassword, resetPassword}