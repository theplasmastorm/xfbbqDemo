import React from "react";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function Header() {
  const activeStyle = { color: "#5bffd5" };
  const login = useSelector((state) => state.login);

  return (
    <Navbar expand="lg" variant="dark" bg="primary" sticky="top">
      <LinkContainer to="/" exact>
        <Navbar.Brand>
          <i>xf</i>BBQ
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {login.Type <= 2 ? (
            <>
              <LinkContainer to="/BBQ" activeStyle={activeStyle}>
                <Nav.Link>BBQ</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/NewBBQForm" activeStyle={activeStyle}>
                <Nav.Link>New BBQ</Nav.Link>
              </LinkContainer>
            </>
          ) : (
            <></>
          )}
          {login.Type <= 3 ? (
            <>
              <LinkContainer to="/Favorite" activeStyle={activeStyle}>
                <Nav.Link>Favorite</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/Order" activeStyle={activeStyle}>
                <Nav.Link>Order</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/NewOrderForm" activeStyle={activeStyle}>
                <Nav.Link>New Order</Nav.Link>
              </LinkContainer>
            </>
          ) : (
            <></>
          )}
          {login.Type <= 1 ? (
            <LinkContainer to="/User" activeStyle={activeStyle}>
              <Nav.Link>User</Nav.Link>
            </LinkContainer>
          ) : (
            <></>
          )}
          <LinkContainer to="/UserRegistrationForm" activeStyle={activeStyle}>
            <Nav.Link>User Registration</Nav.Link>
          </LinkContainer>
          {login.Type ? (
            <LinkContainer to="/UserLogout" activeStyle={activeStyle}>
              <Nav.Link>User Logout</Nav.Link>
            </LinkContainer>
          ) : (
            <LinkContainer to="/UserLogin" activeStyle={activeStyle}>
              <Nav.Link>User Login</Nav.Link>
            </LinkContainer>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
