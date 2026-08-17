import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

const Setting = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [passwordError, setPasswordError] = useState(null)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const getDashboardPath = () => {
        return user?.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordForm({ ...passwordForm, [name]: value })
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordError(null)

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Password not matched')
            return
        }

        setPasswordLoading(true)

        try {
            const response = await axios.post(
                'http://localhost:5000/api/setting/change-password',
                {
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            if (response.data?.success) {
                alert('Password changed successfully')
                setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
                navigate(getDashboardPath())
            } else {
                setPasswordError(response.data?.error || 'Unable to change password')
            }
        } catch (error) {
            setPasswordError(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Something went wrong'
            )
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-8">
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-2">Account Email</h2>
                <p className="text-sm text-gray-600 mb-1">
                    Current email: <span className="font-medium text-gray-800">{user?.email || 'Not available'}</span>
                </p>
                {user?.role !== 'admin' && (
                    <p className="text-sm text-amber-600">
                        Only admin can update email. Please contact your admin if you need to change it.
                    </p>
                )}
                {user?.role === 'admin' && (
                    <p className="text-sm text-gray-600">
                        To update an employee email, go to <strong>Employee → Edit</strong>.
                    </p>
                )}
            </div>

            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                {passwordError && <p className="text-red-500 mb-3 text-sm">{passwordError}</p>}
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Old Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            placeholder="Enter old password"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
                    >
                        {passwordLoading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Setting
