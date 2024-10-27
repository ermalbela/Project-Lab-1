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
            {routes.filter(route => route.show).map(({path, name}, i) => (
              <NavLink as='div' key={i}>
                <Link className="nav-link" to={path}>{name}</Link>
              </NavLink>
            ))}
            <NavLink as="div" to='/'>
              <Link as='button' className=" nav-link btn btn-primary logout-button" onClick={handleLogout}>
                Log Out
              </Link>
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  )
}

export default Header;