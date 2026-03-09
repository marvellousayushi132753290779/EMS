import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/authContext'

const Table = () => {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])

  let sno = 1

  const fetchLeaves = async () => {
    if (!user?._id) return

    try {
      const response = await axios.get(`http://localhost:5000/api/leave/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.data.success) {
        const items = response.data.leaves || []
        console.log('Leaves for table:', items)
        setLeaves(items)
      }
    } catch (error) {
      console.error('Leave fetch error:', error?.response?.data || error.message)
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error)
      }
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [user])

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/leave/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.data.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave._id === id ? { ...leave, status: response.data.leave.status } : leave
          )
        )
      }
    } catch (error) {
      console.error('Leave status update error:', error?.response?.data || error.message)
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error)
      }
    }
  }

  return (
    <div className='p-6'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold'>Manage Leaves</h3>
      </div>

      <table className='w-full text-sm text-left text-gray-500 mt-6'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200'>
          <tr>
            <th className='px-6 py-3'>SNO</th>
            <th className='px-6 py-3'>Leave Type</th>
            <th className='px-6 py-3'>From</th>
            <th className='px-6 py-3'>To</th>
            <th className='px-6 py-3'>Description</th>
            <th className='px-6 py-3'>Status</th>
            {user?.role === 'admin' && <th className='px-6 py-3'>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr
              key={leave._id}
              className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
            >
              <td className='px-6 py-3'>{sno++}</td>
              <td className='px-6 py-3'>{leave.leaveType || 'N/A'}</td>
              <td className='px-6 py-3'>
                {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : ''}
              </td>
              <td className='px-6 py-3'>
                {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : ''}
              </td>
              <td className='px-6 py-3'>{leave.reason}</td>
              <td className='px-6 py-3'>{leave.status}</td>
              {user?.role === 'admin' && (
                <td className='px-6 py-3 space-x-2'>
                  <button
                    onClick={() => handleStatusChange(leave._id, 'Approved')}
                    className='px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700'
                    disabled={leave.status === 'Approved'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(leave._id, 'Rejected')}
                    className='px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700'
                    disabled={leave.status === 'Rejected'}
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table