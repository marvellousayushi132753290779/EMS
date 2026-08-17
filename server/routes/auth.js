import express from 'express'
<<<<<<< HEAD
import { login, verify, changePassword, forgotPassword, resetPassword } from '../controllers/authController.js'
=======
import { login, verify, changePassword } from '../controllers/authController.js'
>>>>>>> 95d37c38a6f0020609e071c91f0bebbe75d176b7
import authMiddleware from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/login', login)
<<<<<<< HEAD
route.post('/forgot-password', forgotPassword)
route.post('/reset-password', resetPassword)
=======
>>>>>>> 95d37c38a6f0020609e071c91f0bebbe75d176b7
route.get('/verify', authMiddleware, verify)
route.post('/change-password', authMiddleware, changePassword)

export default route;