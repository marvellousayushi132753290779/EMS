import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import axios from 'axios'

const Add = () => {
    const navigate = useNavigate()
    const [departments, setDepartments] = useState([])
    const [formData, setFormData] = useState({})

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const data = await fetchDepartments()
                setDepartments(data || [])
            } catch (err) {
                setDepartments([])
            }
        }
        getDepartments()
    }, [])

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if(name === "image") {
            setFormData((prevData) => ({...prevData, [name] : files[0]}))
        } else {
            setFormData((prevData) => ({...prevData, [name] : value}))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData()
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key])
        })

        try {
            const response = await axios.post('http://localhost:5000/api/employee/add', formDataObj, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success) {
                navigate("/admin-dashboard/employees")
            }
        } catch (error) {
            const msg = error.response?.data?.error || error.message || 'Failed to add employee'
            alert(msg)
        }
    }
    
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Employees</h2>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        placeholder="Insert Name"
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Insert Email"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Employee ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Employee ID
                    </label>
                    <input
                        type="text"
                        name="employeeId"
                        onChange={handleChange}
                        placeholder="Employee ID"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        name="dob"
                        onChange={handleChange}
                        placeholder="DOB"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Gender
                    </label>
                    <select
                        name="gender"
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Marital Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Marital Status
                    </label>
                    <select
                        name="maritalStatus"
                        placeholder="Marital Status"
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select Marital Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                    </select>
                </div>

                {/* Designation */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Designation
                    </label>
                    <input
                        type="text"
                        name="designation"
                        onChange={handleChange}
                        placeholder="Designation"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Department
                    </label>
                    <select
                        name="department"
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select Department</option>
                        {(departments || []).map(dept => (
                            <option key={dept._id} value={dept._id}>{dept.dept_name}</option>
                        ))}
                    </select>
                </div>

                {/* Salary */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Salary
                    </label>
                    <input
                        type="number"
                        name="salary"
                        onChange={handleChange}
                        placeholder="Salary"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="******"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <select
                        name="role"
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Image
                    </label>
                    <div className="mt-1 p-3 block w-full border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            placeholder="Upload Image"
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-600 file:text-white hover:file:bg-teal-700 file:cursor-pointer cursor-pointer"
                            required
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg"
            >
                Add Employee
            </button>
        </form>
    </div>
  );
};

export default Add