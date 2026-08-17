import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!token) {
            setError('Invalid reset link. Please request a new one.')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/reset-password',
                { token, newPassword }
            )

            if (response.data.success) {
                alert('Password reset successfully. Please login with your new password.')
                navigate('/login')
            } else {
                setError(response.data.message || 'Unable to reset password')
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Server error'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
            <h2 className="font-pacifico text-3xl text-white">Employee Management System</h2>
            <div className="border shadow p-6 w-80 bg-white">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

                {error && <p className="text-red-500 mb-3">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            className="w-full px-3 py-2 border"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="w-full px-3 py-2 border"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white py-2 mb-3"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <Link to="/login" className="text-teal-600 text-sm">
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default ResetPassword
