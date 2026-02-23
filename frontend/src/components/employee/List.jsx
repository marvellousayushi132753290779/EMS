import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const List = () => {
    const [employees, setEmployees] = useState([])
    const [empLoading, setEmpLoading] = useState(false)

    useEffect(() => {
    const fetchEmployees = async () => {
    setEmpLoading(true)
    try {
      const response = await axios.get('http://localhost:5000/api/employee', {
        headers: {
          "Authorization" : `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(response.data)
      if (response.data.success) {
        let sno = 1
        const data = response.data.employees.map((emp) => ({
          _id: emp._id,
          sno: sno++,
          dept_name: emp.department.dept_name,
          name: emp.userId.name,
          dob: new Date(emp.dob).toLocaleDateString(),
          profileImage: <img width={60} className='rounded-full' src={`http://localhost:5000/uploads/${emp.userId.profileImage}`}/>,
          action: (<EmployeeButtons Id={emp._id}/>),
        }))
        setEmployees(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error || 'Failed to load departments')
      }
    } finally {
      setEmpLoading(false)
    }
  };

    fetchEmployees()
  }, [])
  return (
    <div className='p-6'>
        <div className='text-center'>
            <h3 className='text-2xl font-bold'>Manage Employee</h3>
        </div>
        <div className='flex justify-between items-center'>
            <input 
                type="text" 
                placeholder='Search by Dept Name' 
                className="px-4 py-0.5 border"
            />
            <Link 
             to = "/admin-dashboard/add-employee" 
             className='px-4 py-1 bg-teal-600 rounded text-white'
            >
             Add New Employee
            </Link>
        </div>
        <div>
            <DataTable columns={columns} data={employees}/>
        </div>
    </div>
  )
}

export default List