import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../_helper/AuthContext";


const PrivateRoute = () => {
  
  const {role} = useContext(AuthContext);


  return(
    role !== '' && role && localStorage.getItem('token') ?
      <Outlet />
    : 
      <Navigate to={`/login`} />
  )
}
export default PrivateRoute;