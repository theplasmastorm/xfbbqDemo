import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const login = useSelector((state) => state.login);

  return (
    <nav>
      <NavLink to="/" exact>
        <i>xf</i>BBQ
      </NavLink>
      {" | "}
      {login.Type <= 2 ? (
        <>
          <NavLink to="/BBQ">BBQ</NavLink>
          {" | "}
        </>
      ) : (
        <></>
      )}
      {login.Type <= 3 ? (
        <>
          <NavLink to="/Favorite">Favorite</NavLink>
          {" | "}
          <NavLink to="/Order">Order</NavLink>
          {" | "}
        </>
      ) : (
        <></>
      )}
      {login.Type <= 1 ? (
        <>
          <NavLink to="/User">User</NavLink>
          {" | "}
        </>
      ) : (
        <></>
      )}
      <NavLink to="/UserRegistrationForm">User Registration</NavLink>
      {login.Type ? (
        <>
          {" | "}
          <NavLink to="/UserLogout">User Logout</NavLink>
        </>
      ) : (
        <>
          {" | "}
          <NavLink to="/UserLogin">User Login</NavLink>
        </>
      )}
    </nav>
  );
}
