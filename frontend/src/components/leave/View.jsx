import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/authContext'

const LeaveView = () => {
  const { id } = useParams()
  const location = useLocation()
  const { user: authUser } = useAuth()
  const [leave, setLeave] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leave/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (response.data.success) {
          setLeave(response.data.leave)
        }
      } catch (error) {
        console.error('Leave detail fetch error:', error?.response?.data || error.message)
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLeave()
  }, [id])

  const handleStatusUpdate = async (status) => {
    if (!leave || updating) return
    try {
      setUpdating(true)
      const response = await axios.patch(
        `http://localhost:5000/api/leave/status/${leave._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (response.data.success) {
        setLeave(response.data.leave)
      }
    } catch (error) {
      console.error('Leave status update error:', error?.response?.data || error.message)
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error)
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className='p-6'>Loading...</div>
  }

  if (!leave) {
    return <div className='p-6'>Leave not found.</div>
  }

  const employee = leave.employeeId
  const employeeUser = employee?.userId
  const department = employee?.department

  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='bg-white rounded-md shadow-md px-14 py-8 w-full max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Leave Details</h2>

        <div className='flex items-center gap-12'>
          <div className='flex-1 flex justify-center'>
            <div className='w-60 h-60 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
              {employeeUser?.profileImage ? (
                <img
                  src={`http://localhost:5000/uploads/${employeeUser.profileImage}`}
                  alt={employeeUser.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-gray-500 text-lg'>No Image</span>
              )}
            </div>
          </div>

          <div className='flex-1'>
            <div className='space-y-2 text-base'>
              <div className='flex'>
                <span className='font-semibold w-40'>Name:</span>
                <span className='ml-3'>{employeeUser?.name}</span>
              </div>
              <div className='flex'>
                <span className='font-semibold w-40'>Employee ID:</span>
                <span className='ml-3'>{employee?.employeeId}</span>
              </div>
              <div className='flex'>
                <span className='font-semibold w-40'>Leave Type:</span>
                <span className='ml-3'>{leave.leaveType}</span>
              </div>
              <div className='flex'>
                <span className='font-semibold w-40'>Reason:</span>
                <span className='ml-3'>{leave.reason}</span>
              </div>
              <div className='flex'>
                <span className='font-semibold w-40'>Department:</span>
                <span className='ml-3'>{department?.dept_name}</span>
              </div>
              <div className='flex'>
                <span className='font-semibold w-40'>Start Date:</span>
                <span className='ml-3'>
                  {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : ''}
                </span>
              </div>
              <div className='flex'>
                <span className='font-semibold w-40'>End Date:</span>
                <span className='ml-3'>
                  {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : ''}
                </span>
              </div>
              <div className='flex'>
                <span className='font-semibold w-40'>Status:</span>
                <span className='ml-3'>{leave.status}</span>
              </div>
            </div>

            {authUser?.role === 'admin' && leave.status === 'Pending' && (
              <div className='mt-6 space-x-3'>
                <button
                  className='px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60'
                  onClick={() => handleStatusUpdate('Approved')}
                  disabled={updating}
                >
                  Approve
                </button>
                <button
                  className='px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60'
                  onClick={() => handleStatusUpdate('Rejected')}
                  disabled={updating}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaveView

