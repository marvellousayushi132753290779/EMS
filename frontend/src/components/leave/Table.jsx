import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

const Table = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')

  const calculateDays = (start, end) => {
    if (!start || !end) return ''
    const s = new Date(start)
    const e = new Date(end)
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1
    return diff
  }

  const fetchLeaves = async () => {
    if (!user?._id) return

    try {
      const response = await axios.get('http://localhost:5000/api/leave', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.data.success) {
        const items = response.data.leaves || []
        setLeaves(items)
        setFilteredLeaves(items)
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

  // apply search + status filters
  useEffect(() => {
    let data = [...leaves]

    if (statusFilter !== 'All') {
      data = data.filter((l) => l.status === statusFilter)
    }

    if (search.trim()) {
      data = data.filter((l) =>
        l.employeeId?.employeeId?.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredLeaves(data)
  }, [statusFilter, search, leaves])

  const columns = [
    {
      name: 'S No',
      selector: (row) => row.sno,
      width: '70px',
    },
    {
      name: 'Emp ID',
      selector: (row) => row.empId,
      sortable: true,
      width: '110px',
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      width: '130px',
    },
    {
      name: 'Leave Type',
      selector: (row) => row.leaveType,
      width: '150px',
    },
    {
      name: 'Department',
      selector: (row) => row.department,
      width: '120px',
    },
    {
      name: 'Days',
      selector: (row) => row.days,
      width: '80px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      width: '120px',
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          type='button'
          className='px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700'
          onClick={() =>
            navigate(`/admin-dashboard/leaves/${row.id}`, {
              state: { leave: row._rawLeave },
            })
          }
        >
          View
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '100px',
    },
  ]

  const tableData = filteredLeaves.map((leave, index) => ({
    id: leave._id,
    sno: index + 1,
    empId: leave.employeeId?.employeeId || '',
    name: leave.employeeId?.userId?.name || '',
    leaveType: leave.leaveType || 'N/A',
    department: leave.employeeId?.department?.dept_name || '',
    days: calculateDays(leave.startDate, leave.endDate),
    status: leave.status,
    from: leave.startDate ? new Date(leave.startDate).toLocaleDateString() : '',
    to: leave.endDate ? new Date(leave.endDate).toLocaleDateString() : '',
    reason: leave.reason || '',
    _rawLeave: leave,
  }))

  return (
    <div className='min-h-screen flex items-start justify-center p-6'>
      <div className='w-full max-w-5xl'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold'>Manage Leaves</h3>
        </div>

        <div className='flex justify-between items-center mt-4'>
          <input
            type='text'
            placeholder='Search By Emp Id'
            className='px-4 py-1 border'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className='space-x-3'>
            <button
              className={`px-4 py-1 rounded text-white ${
                statusFilter === 'Pending' ? 'bg-teal-600' : 'bg-teal-500'
              }`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending
            </button>
            <button
              className={`px-4 py-1 rounded text-white ${
                statusFilter === 'Approved' ? 'bg-teal-600' : 'bg-teal-500'
              }`}
              onClick={() => setStatusFilter('Approved')}
            >
              Approved
            </button>
            <button
              className={`px-4 py-1 rounded text-white ${
                statusFilter === 'Rejected' ? 'bg-teal-600' : 'bg-teal-500'
              }`}
              onClick={() => setStatusFilter('Rejected')}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className='mt-6'>
          <DataTable
            columns={columns}
            data={tableData}
            pagination
            highlightOnHover
            customStyles={{
              headCells: {
                style: {
                  fontSize: '14px',
                  fontWeight: 600,
                },
              },
              cells: {
                style: {
                  fontSize: '14px',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Table