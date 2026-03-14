import Department from "../models/Department.js";

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
        return res.status(200).json({success: true, departments})
    } catch(error) {
        return res.status(500).json({success: false, error: "get department server error"})
    }
}

const addDepartment = async (req, res) => {
    try {
        const {dept_name, description} = req.body;
        const newDep = new Department({
            dept_name,
            description
        })
        await newDep.save()
        return res.status(200).json({success: true, department: newDep})
    } catch (error) {
        return res.status(500).json({success: false, error: "add department server error"})
    }    
}

const getDepartment = async (req, res) => {
    try{
        const {id} = req.params;
        const department = await Department.findById({_id: id})
        return res.status(200).json({success: true, department})
    } catch (error) {
        return res.status(500).json({success: false, error: "get department server error"})
    }
}

const updateDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const {dept_name, description} = req.body;
        const updateDept = await Department.findByIdAndUpdate({_id: id}, {
            dept_name,
            description
        })
        return res.status(200).json({success: true, updateDept})
    } catch (error) {
        return res.status(500).json({success: false, error: "edit department server error"})
    }
}

const deleteDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedept = await Department.findById({_id: id})
        await deletedept.deleteOne()
        return res.status(200).json({success: true, deletedept})
    } catch (error) {
        return res.status(500).json({success: false, error: "delete department server error"})
    }
}

export {addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment}