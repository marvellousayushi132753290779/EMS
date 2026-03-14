import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'

const addLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body

        const userId = req.user?._id

        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthenticated user" })
        }

        const employee = await Employee.findOne({ userId })

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee record not found" })
        }

        const newLeave = new Leave({
            employeeId: employee._id, userId, leaveType, startDate, endDate, reason
        })

        await newLeave.save()

        return res.status(200).json({success: true})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, error: "leave add server error"})
    }
}

const getLeaves = async (req, res) => {
    try {
        const userId = req.user?._id
        const role = req.user?.role

        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthenticated user" })
        }

        if (role === 'admin') {
            const leaves = await Leave.find()
                .sort({ appliedAt: -1 })
                .populate({
                    path: 'employeeId',
                    populate: [
                        { path: 'userId', select: 'name profileImage' },
                        { path: 'department', select: 'dept_name' }
                    ]
                })
            return res.status(200).json({ success: true, leaves })
        }

        const employee = await Employee.findOne({ userId })

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee record not found" })
        }

        const leaves = await Leave.find({ employeeId: employee._id })
            .sort({ appliedAt: -1 })
            .populate({
                path: 'employeeId',
                populate: [
                    { path: 'userId', select: 'name profileImage' },
                    { path: 'department', select: 'dept_name' }
                ]
            })
        return res.status(200).json({ success: true, leaves })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, error: "leave fetch server error"})
    }
}

const getLeaveById = async (req, res) => {
    try {
        const userId = req.user?._id
        const { id } = req.params

        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthenticated user" })
        }

        let query = { _id: id }

        if (req.user?.role !== 'admin') {
            const employee = await Employee.findOne({ userId })
            if (!employee) {
                return res.status(404).json({ success: false, error: "Employee record not found" })
            }
            query.employeeId = employee._id
        }

        const leave = await Leave.findOne(query).populate({
            path: 'employeeId',
            populate: [
                { path: 'userId', select: 'name profileImage' },
                { path: 'department', select: 'dept_name' }
            ]
        })

        if (!leave) {
            return res.status(404).json({ success: false, error: "Leave not found" })
        }

        return res.status(200).json({ success: true, leave })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "leave detail fetch server error" })
    }
}

const updateLeaveStatus = async (req, res) => {
    try {
        const userRole = req.user?.role

        if (userRole !== 'admin') {
            return res.status(403).json({ success: false, error: "Only admin can update leave status" })
        }

        const { id } = req.params
        const { status } = req.body

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status value" })
        }

        const leave = await Leave.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        ).populate({
            path: 'employeeId',
            populate: [
                { path: 'userId', select: 'name profileImage' },
                { path: 'department', select: 'dept_name' }
            ]
        })

        if (!leave) {
            return res.status(404).json({ success: false, error: "Leave not found" })
        }

        return res.status(200).json({ success: true, leave })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "leave status update server error" })
    }
}

export {addLeave, getLeaves, getLeaveById, updateLeaveStatus}