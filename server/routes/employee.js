import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
<<<<<<< HEAD
import adminMiddleware from '../middleware/adminMiddleware.js'
=======
>>>>>>> 95d37c38a6f0020609e071c91f0bebbe75d176b7
import {addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDeptId, getDashboardStats} from '../controllers/employeeController.js'

const router = express.Router()

router.get('/stats', authMiddleware, getDashboardStats)
router.get('/', authMiddleware, getEmployees)
<<<<<<< HEAD
router.post('/add', authMiddleware, adminMiddleware, upload.single('image'), addEmployee)
=======
router.post('/add', authMiddleware, upload.single('image'), addEmployee)
>>>>>>> 95d37c38a6f0020609e071c91f0bebbe75d176b7

router.get('/department/:id', authMiddleware, fetchEmployeesByDeptId)

router.get('/:id', authMiddleware, getEmployee)
<<<<<<< HEAD
router.put('/:id', authMiddleware, adminMiddleware, updateEmployee)
=======
router.put('/:id', authMiddleware, updateEmployee)
>>>>>>> 95d37c38a6f0020609e071c91f0bebbe75d176b7

export default router