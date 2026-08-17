import React from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return null
}

export default Navbar
