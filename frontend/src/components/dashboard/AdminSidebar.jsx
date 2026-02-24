import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {FaBuilding, FaTachometerAlt, FaCogs, FaMoneyBillWave, FaUsers, FaCalendarAlt, FaSignOutAlt} from 'react-icons/fa'
import { useAuth } from '../../context/authContext'

const AdminSidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
        <div className='bg-teal-600 h-16 w-screen absolute left-0 top-0 flex items-center justify-between px-4'>
            <div className="w-1/3">
              <h3 className='text-xl font-pacifico text-white'>Employee MS</h3>
            </div>
            <div className="w-1/3 text-center">
              <span className="text-sm font-medium">Welcome, {user?.name}</span>
            </div>
            <div className="w-1/3 flex justify-end items-center">
              <button onClick={handleLogout} className="text-white hover:text-gray-200 p-2 flex items-center space-x-1">
                <FaSignOutAlt />
                <span className="text-sm">Logout</span>
              </button>
            </div>
        </div>
        <div className="mt-16">
            <NavLink to = "/admin-dashboard"
                className= {({isActive}) => `${isActive ? "bg-teal-500" : " " } flex items-center space-x-4 block py-2.5 px-4 rounded`}
                end
                >
                <FaTachometerAlt />
                <span>Dashboard</span>
            </NavLink>
            <NavLink to = "/admin-dashboard/employees"
                className= {({isActive}) => `${isActive ? "bg-teal-500" : " " } flex items-center space-x-4 block py-2.5 px-4 rounded`}
                >
                <FaUsers />
                <span>Employee</span>
            </NavLink>
            <NavLink to = "/admin-dashboard/departments"
                className={({isActive}) => `${isActive ? "bg-teal-500 " : " "} flex items-center space-x-4 block py-2.5 px-4 rounded`}>
                <FaBuilding />
                <span>Department</span>
            </NavLink>
            <NavLink to = "/admin-dashboard"
                className="flex items-center space-x-4 block py-2.5 px-4 rounded">
                <FaCalendarAlt />
                <span>Leave</span>
            </NavLink>
            <NavLink to = "/admin-dashboard/salary/add"
                className={({isActive}) => `${isActive ? "bg-teal-500 " : " "} flex items-center space-x-4 block py-2.5 px-4 rounded`}>
                <FaMoneyBillWave />
                <span>Salary</span>
            </NavLink>
            <NavLink to = "/admin-dashboard"
                className="flex items-center space-x-4 block py-2.5 px-4 rounded">
                <FaCogs />
                <span>Setting</span>
            </NavLink>
        </div>
    </div>
  )
}

export default AdminSidebar