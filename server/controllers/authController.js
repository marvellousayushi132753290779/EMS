import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import bcrypt from 'bcrypt'

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
            user: {_id: user._id, name: user.name, role: user.role },
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
};

const verify = (req, res) => {
    return res.status(200).json({success: true, user: req.user})
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

export {login, verify, changePassword}