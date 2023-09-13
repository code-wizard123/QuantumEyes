import React from "react"
import { Outlet, Navigate } from "react-router-dom"

import jwt_decode from 'jwt-decode'

const PrivateRoutes = () => {

    const verifyToken = (token) =>{
        
        if (token) {
            var decoded = jwt_decode(token)
            return (decoded.id)
        }
        else {
            return (null)
        }
    }

    const accept = verifyToken(localStorage.getItem('Token'))

    if(accept)
    {
        localStorage.setItem('ID' , accept)
    }

    return (accept ? <Outlet /> : <Navigate to="/login" />)
}

export default PrivateRoutes
