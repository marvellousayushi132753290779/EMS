import express from 'express'
import { login, verify, changePassword } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/login', login)
route.get('/verify', authMiddleware, verify)
route.post('/change-password', authMiddleware, changePassword)

export default route;