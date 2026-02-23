import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import bcrypt from 'bcrypt'

// Helper function to check if a string is a bcrypt hash
const isBcryptHash = (str) => {
    return typeof str === 'string' && (str.startsWith('$2a$') || str.startsWith('$2b$') || str.startsWith('$2y$'))
}

const login = async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        const {email, password} = req.body;
        
        // Validate input
        if(!email || !password) {
            return res.status(400).json({success: false, message: "Email and password are required"})
        }

        // Trim whitespace from email and password
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        const user = await User.findOne({email: trimmedEmail})
        if(!user) {
            return res.status(404).json({success: false, message: "User Not Found"})
        }

        // Check if user has a password (should be hashed)
        if(!user.password) {
            console.error('User found but password field is missing');
            return res.status(500).json({success: false, message: "User account error"})
        }

        // Compare password
        let isMatch = false;
        
        // Check if password is hashed (bcrypt hash starts with $2a$, $2b$, or $2y$)
        if(isBcryptHash(user.password)) {
            // Password is hashed, use bcrypt.compare
            isMatch = await bcrypt.compare(trimmedPassword, user.password);
        } else {
            // Password is not hashed (backward compatibility - should be migrated)
            console.warn(`User ${user.email} has unhashed password. Please migrate to hashed passwords.`);
            isMatch = trimmedPassword === user.password;
            
            // If match found, hash the password and update in database
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

export {login, verify}