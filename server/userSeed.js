import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from './models/User.js'
import connectToDatabase from './db/db.js'

const userRegister = async () => {
    try {
        await connectToDatabase()

        const existing = await User.findOne({ email: 'admin@gmail.com' })
        if (existing) {
            console.log('Admin user already exists')
            return
        }

        const hashedPassword = await bcrypt.hash('admin', 10)
        const newUser = new User({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin'
        })
        await newUser.save()
        console.log('Admin user created')
    } catch (error) {
        console.log(error)
    } finally {
        await mongoose.connection.close()
    }
}

userRegister();