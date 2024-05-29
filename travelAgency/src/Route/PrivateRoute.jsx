import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../_helper/AuthContext";
import axios from "axios";
import { getRole } from "../Endpoint";

const PrivateRoute = () => {
  
  const {role, setRole} = useContext(AuthContext);


  useEffect(() => {
    fetchUserRole();

    if(role){
      console.log(role);
    } else{
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('userId');
      setRole('');
    }
  }, [role, setRole]);

  async function fetchUserRole() {
    console.log(role);
      try {
          const response = await axios.get(getRole, { withCredentials: true });
          setRole(response.data.role);
          console.log(response.data)
      } catch (error) {
          console.error('Error fetching user role:', error);
      }
  }

  return(
    role !== '' && role?
      <Outlet />
    : 
      <Navigate to={`/login`} />
  )
}
export default PrivateRoute;