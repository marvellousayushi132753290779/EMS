import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'

const addLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body

        // Always trust authenticated user from token, not from request body
        const userId = req.user?._id

        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthenticated user" })
        }

        const employee = await Employee.findOne({ userId })
        const newLeave = new Leave({
            employeeId: employee._id, userId, leaveType, startDate, endDate, reason
        })

        console.log("leave")

        await newLeave.save()

        return res.status(200).json({success: true})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, error: "leave add server error"})
    }
}

const getLeaves = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await Employee.findOne({userId: id})

        const leaves = await Leave.find({employeeId: employee._id})
        return res.status(200).json({success: true, leaves})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, error: "leave add server error"})
    }
}

export {addLeave, getLeaves}