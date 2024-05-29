import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../_helper/AuthContext";

const PrivateRoute = () => {
  
  const {role, setRole} = useContext(AuthContext);


  useEffect(() => {
    if(role){
      console.log(role);
    } else{
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('userId');
    }
  }, [role, setRole]);

  return(
    role !== '' && role?
      <Outlet />
    : 
      <Navigate to={`/login`} />
  )
}
export default PrivateRoute;