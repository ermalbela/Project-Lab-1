import React, { useContext } from "react";
import {Navbar, Nav, NavLink, Container, NavbarBrand, NavbarToggle, NavbarCollapse, Button, NavItem} from 'react-bootstrap';
import { routes } from "../Route/routes";
import { Link } from "react-router-dom";
import axios from "axios";
import { logoutUser } from "../Endpoint";
import AuthContext from "../_helper/AuthContext";

const Header = () => {
  

  const {setRole} = useContext(AuthContext);

  const handleLogout = async () => {
    try {
        const response = await axios.get(logoutUser, { withCredentials: true });
            localStorage.removeItem('name');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            setRole('');

      } catch (error) {
        console.error('Error logging out:', error);
    }

};


  return(
    <Navbar variant="pills" expand="lg" fixed="top" className="navbar mb-5">
      <Container>
        <NavbarBrand><Link className="nav-link" to='/'>Travel Agency</Link></NavbarBrand>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ms-auto justify-content-center align-items-center">
            <NavLink as='div' className="nav-link-md">
              <Link className="nav-link" to='/'>Home</Link>
            </NavLink>
            {routes.map(({path, name}, i) => (
              <NavLink as='div' key={i}>
                <Link className="nav-link" to={path}>{name}</Link>
              </NavLink>
            ))}
              <Link className="nav-link" to='/'>
                <NavLink as='button' className="ms-5 btn btn-primary" onClick={handleLogout}>
                  Log Out
                </NavLink>
              </Link> 
             
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  )
}

export default Header;