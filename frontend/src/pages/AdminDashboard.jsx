import React from 'react'
import { useAuth } from '../context/authContext'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/Navbar'
import AdminSummary from '../components/dashboard/AdminSummary'

const AdminDashboard = () => {
  const {user} = useAuth()
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className='flex-1 ml-64 bg-gray-100 min-h-screen' style={{ paddingTop: '40px', marginTop: 0 }}>
          <Navbar />
          <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard