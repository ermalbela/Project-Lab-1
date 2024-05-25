import React, { useContext } from "react";
import {Navbar, Nav, NavLink, Container, NavbarBrand, NavbarToggle, NavbarCollapse, Button, NavItem} from 'react-bootstrap';
import { routes } from "../Route/routes";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
=======
import axios from "axios";
import { logoutUser } from "../Endpoint";
import AuthContext from "../_helper/AuthContext";
>>>>>>> 698a96ff1a44a7e8521bfbf79ba2a056b5f0025c

const Header = () => {
  const {userId} = useAuth()

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
<<<<<<< HEAD
              {/* <Link className="nav-link" to='/sign-in'>
                <NavLink as='button' className="ms-5 btn btn-primary">
                  Log in
=======
              <Link className="nav-link" to='/'>
                <NavLink as='button' className="ms-5 btn btn-primary" onClick={handleLogout}>
                  Log Out
>>>>>>> 698a96ff1a44a7e8521bfbf79ba2a056b5f0025c
                </NavLink>
              </Link> */}
              {!userId ? (
                <SignInButton className="ms-5 btn btn-primary" mode='modal' redirectUrl="/" />
              ) : (
                <UserButton afterSignOutUrl="/" />
              )} 
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  )
}

export default Header;