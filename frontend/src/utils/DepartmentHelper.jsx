import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
    },
    {
        name: "Department Name",
        selector: (row) => row.dept_name,
        sortable: true
    },
    {
        name: "Action",
        selector: (row) => row.action,
    },
]

const API_BASE = 'http://localhost:5000/api/department';

export const DepartmentButtons = ({ DeptId, onDepartmentDelete }) => {
    const navigate = useNavigate()

    const handleEdit = () => {
        if (DeptId) navigate(`/admin-dashboard/department/${DeptId}`)
    }

    const handleDelete = async () => {
        if (!DeptId) return
        if (!window.confirm('Are you sure you want to delete this department?')) return
        try {
            const token = localStorage.getItem('token')
            const res = await axios.delete(`${API_BASE}/${DeptId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success && typeof onDepartmentDelete === 'function') {
                onDepartmentDelete()
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Delete failed'
            alert(msg)
        }
    }

    return (
        <div className="flex space-x-3">
            <button
                type="button"
                className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
                onClick={handleEdit}
            >
                Edit
            </button>
            <button
                type="button"
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
            >
                Delete
            </button>
        </div>
    )
};