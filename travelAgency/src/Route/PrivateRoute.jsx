import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../_helper/AuthContext";
import axios from "axios";
import { getRole } from "../Endpoint";

const PrivateRoute = () => {
  
  const {role, setRole} = useContext(AuthContext);


  useEffect(() => {

    fetchUserRole();
  
  }, [role, setRole]);

  async function fetchUserRole() {
    console.log(role);
      const response = await axios.get(getRole, { withCredentials: true })
      .catch(err => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
      });
      setRole(response?.data?.role);
      console.log(response?.data)
  }

  return(
    role !== '' && role?
      <Outlet />
    : 
      <Navigate to={`/login`} />
  )
}
export default PrivateRoute;