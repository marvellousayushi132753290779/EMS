import React from 'react'
import { FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/authContext.jsx'

const SummaryCard = ({ icon, text, number, color }) => {
    const { user } = useAuth()

    if (text != null && number != null) {
        return (
            <div className='rounded-lg flex bg-white shadow overflow-hidden'>
                <div className={`text-3xl flex justify-center items-center ${color || 'bg-teal-600'} text-white px-6 py-4`}>
                    {icon}
                </div>
                <div className='pl-4 py-4 flex-1'>
                    <p className='text-sm text-gray-500'>{text}</p>
                    <p className='text-2xl font-bold'>{number}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='rounded flex bg-white'>
            <div className='text-3xl flex justify-center items-center bg-teal-600 text-white px-4'>
                <FaUser/>
            </div>
            <div className='pl-4 py-1'>
                <p className='text-lg font-semibold'>Welcome Back</p>
                <p className='text-xl font-bold'>{user?.name}</p>
            </div>
        </div>
    )
}

export default SummaryCard