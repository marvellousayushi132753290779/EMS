import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaBuilding, FaCheckCircle, FaHourglassHalf, FaMoneyBillWave, FaTimesCircle, FaUsers, FaFileAlt } from 'react-icons/fa'
import SummaryCard from './SummaryCard'

const AdminSummary = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    monthlySalary: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveRejected: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/employee/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data?.success && response.data?.stats) {
          setStats(response.data.stats)
        }
      } catch (err) {
        console.error('Dashboard stats error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className='p-6'>
        <h3 className='text-2xl font-bold'>Dashboard Overview</h3>
        <p className='mt-4 text-gray-500'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <h3 className='text-2xl font-bold'>Dashboard Overview</h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
      <SummaryCard icon={<FaUsers />} text='Total Employees' number={stats.totalEmployees} color='bg-teal-600' />
        <SummaryCard icon={<FaBuilding />} text='Total Departments' number={stats.totalDepartments} color='bg-yellow-600' />
        <SummaryCard icon={<FaMoneyBillWave />} text='Monthly Salary' number={`₹${(stats.monthlySalary || 0).toLocaleString()}`} color='bg-red-600' />
        
      </div>

      <div className='mt-12'>
        <h4 className='text-center text-2xl font-bold'>Leave Details</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <SummaryCard icon={<FaFileAlt />} text='Leave Applied' number={stats.leaveApplied} color='bg-teal-600' />
          <SummaryCard icon={<FaCheckCircle />} text='Leave Approved' number={stats.leaveApproved} color='bg-green-600' />
          <SummaryCard icon={<FaHourglassHalf />} text='Leave Pending' number={stats.leavePending} color='bg-yellow-600' />
          <SummaryCard icon={<FaTimesCircle />} text='Leave Rejected' number={stats.leaveRejected} color='bg-red-600' />
        </div>
      </div>
    </div>
  )
}

export default AdminSummary
