import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

// import AuthContext from "../_helper/AuthContext";


const PrivateRoute = () => {

  // const {auth, setAuth} = useContext(AuthContext);

  // useEffect(() => {
  //   setAuth(JSON.parse(localStorage.getItem('user')))
  // }, []);

  return(
    // (localStorage.getItem('token') && localStorage.getItem('token') !== '' && localStorage.getItem('token') !== 'undefined') && auth ?
      <Outlet />
    // : 
      // <Navigate to={`${process.env.PUBLIC_URL}/login`} />
  )
}

export default PrivateRoute;