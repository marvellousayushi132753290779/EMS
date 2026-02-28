import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'


const Setting = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [setting, setSetting] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSetting({ ...setting, [name]: value});
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      if (setting.newPassword !== setting.confirmPassword) {
        setError("Password not matched");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
            "http://localhost:5000/api/setting/change-password",
            { 
                oldPassword: setting.oldPassword, 
                newPassword: setting.newPassword 
            },
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }}
        )

        if (response.data?.success) {
          alert("Password changed successfully");
          navigate("/admin-dashboard/employees");
        } else {
          setError(response.data?.error || "Unable to change password");
        }
      } catch (error) {
        const msg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-6'>Change Password</h2>
        <p className='text-red-500'>{error}</p>
        <form onSubmit={handleSubmit}>
            {/* Department Name */}
            <div>
                <label className='text-sm font-medium text-gray-700'>
                    Old Password
                </label>
                <input
                   type='password'
                   name='oldPassword'
                   placeholder='Change Password'
                   onChange={handleChange}
                   className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                   required
                />   
            </div>

            <div>
                <label className='text-sm font-medium text-gray-700'>
                    New Password
                </label>
                <input 
                    type='password'
                    name='newPassword'
                    placeholder='New Password'
                    onChange={handleChange}
                    className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                    required
                />    
            </div>

            <div>
                <label className='text-sm font-medium text-gray-700'>
                    Confirm Password
                </label>
                <input
                    type='password'
                    name='confirmPassword'
                    placeholder='Confirm Password'
                    onChange={handleChange}
                    className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                    required
                />    
            </div>

            <button
                type='submit'
                disabled={loading}
                className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded disabled:opacity-70'
            >
                {loading ? "Changing..." : "Change Password"}
            </button>    
        </form>
    </div>
  )
}

export default Setting