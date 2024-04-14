import React from "react";
import {Navbar, Nav, NavLink, Container, NavbarBrand, NavbarToggle, NavbarCollapse, Button, NavItem} from 'react-bootstrap';
import { routes } from "../Route/routes";
import { Link } from "react-router-dom";
import { SignInButton, UserButton, useAuth } from "@clerk/clerk-react";

const Header = () => {
  const {userId} = useAuth()

  return(
    <Navbar variant="pills" expand="lg" fixed="top" className="navbar mb-5">
      <Container>
        <NavbarBrand>Travel Agency</NavbarBrand>
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
              {/* <Link className="nav-link" to='/sign-in'>
                <NavLink as='button' className="ms-5 btn btn-primary">
                  Log in
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