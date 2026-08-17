import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [resetUrl, setResetUrl] = useState(null)
    const [message, setMessage] = useState(null)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setResetUrl(null)
        setEmailSent(false)
        setLoading(true)

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/forgot-password',
                { email }
            )

            if (response.data.success) {
                setMessage(response.data.message)
                setEmailSent(response.data.emailSent === true)
                if (response.data.resetUrl) {
                    setResetUrl(response.data.resetUrl)
                }
            } else {
                setError(response.data.message || 'Unable to process request')
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

    const showForm = !message && !error

    return (
        <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
            <h2 className="font-pacifico text-3xl text-white">Employee Management System</h2>
            <div className="border shadow p-6 w-96 bg-white">
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Enter your registered email. A reset link will be sent to your inbox.
                </p>

                {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
                {message && (
                    <p className={`mb-3 text-sm ${emailSent ? 'text-green-600' : 'text-amber-600'}`}>
                        {message}
                    </p>
                )}

                {resetUrl && (
                    <div className="mb-4 p-3 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-700 mb-2">Click here to reset your password:</p>
                        <Link
                            to={`/reset-password?token=${resetUrl.split('token=')[1]}`}
                            className="text-teal-600 break-all text-sm underline font-medium"
                        >
                            Reset Password
                        </Link>
                    </div>
                )}

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-3 py-2 border"
                                placeholder="Enter registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-2 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                {(message || error) && (
                    <button
                        type="button"
                        onClick={() => {
                            setMessage(null)
                            setError(null)
                            setResetUrl(null)
                            setEmailSent(false)
                        }}
                        className="w-full border border-teal-600 text-teal-600 py-2 mb-3"
                    >
                        Try Another Email
                    </button>
                )}

                <Link to="/login" className="text-teal-600 text-sm">
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default ForgotPassword
