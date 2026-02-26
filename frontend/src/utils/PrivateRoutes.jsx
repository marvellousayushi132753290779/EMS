import React from 'react'
import {useAuth} from '../context/authContext'
import {Navigate} from 'react-router-dom'

const PrivateRoutes = ({children}) => {
  const {user, loading} = useAuth()

  console.log("User in PrivateRoutes:", user)
  console.log("Loading:", loading)

  if(loading) {
    return <div>Loading ....</div>
  }

  return user ? children : <Navigate to = "/login" />
}

export default PrivateRoutes