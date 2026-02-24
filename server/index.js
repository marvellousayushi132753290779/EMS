import { config as loadEnv } from 'dotenv'
loadEnv({ override: true })
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js'
import connectToDatabase from './db/db.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static('public/uploads'))
app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/salary', salaryRouter)

const PORT = process.env.PORT || 5000

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err?.message || err)
    process.exit(1)
  })