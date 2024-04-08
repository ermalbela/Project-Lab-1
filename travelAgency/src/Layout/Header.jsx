import React from "react";
import {Navbar, Nav, NavLink, Container, NavbarBrand, NavbarToggle, NavbarCollapse, Button} from 'react-bootstrap';

const Header = () => {

  return(
    <Navbar variant="pills" expand="lg" fixed="top" className="navbar mb-5">
      <Container>
        <NavbarBrand>Travel Agency</NavbarBrand>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ms-auto justify-content-center">
            <NavLink to="/" className="nav-link-md">Home</NavLink>
            <NavLink to="/">Link</NavLink>
            <NavLink to="/">Travel</NavLink>
            <NavLink to="/" className="ms-5">
              <Button>Log in</Button>
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  )
}

export default Header;