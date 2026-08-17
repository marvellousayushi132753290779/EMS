import express from 'express'
import { login, verify, changePassword, forgotPassword, resetPassword } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/login', login)
route.post('/forgot-password', forgotPassword)
route.post('/reset-password', resetPassword)
route.get('/verify', authMiddleware, verify)
route.post('/change-password', authMiddleware, changePassword)

export default route;