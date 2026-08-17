import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addLeave, getLeaves, getLeaveById, updateLeaveStatus } from '../controllers/leaveController.js'

const router = express.Router()

router.post('/add', authMiddleware, addLeave)
router.get('/', authMiddleware, getLeaves)
router.get('/:id', authMiddleware, getLeaveById)
router.patch('/status/:id', authMiddleware, updateLeaveStatus)

export default router