import express from 'express'
import { changePassword } from '../controllers/settingController.js'
import verifyUser from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/change-password', verifyUser, changePassword)

<<<<<<< HEAD
=======

>>>>>>> 95d37c38a6f0020609e071c91f0bebbe75d176b7
export default router