import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addLeave, getLeaves, updateLeaveStatus } from '../controllers/leaveController.js'

const router = express.Router()

router.post('/add', authMiddleware, addLeave)
router.get('/:id', authMiddleware, getLeaves)
router.patch('/status/:id', authMiddleware, updateLeaveStatus)

export default router