import express from 'express'
import { changePassword } from '../controllers/settingController.js'
import verifyUser from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/change-password', verifyUser, changePassword)


export default router