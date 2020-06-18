import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {

  return (
    <nav>
      <NavLink to="/" exact>
        <i>xf</i>BBQ
      </NavLink>
      {" | "}
      <NavLink to="/BBQ">BBQ</NavLink>
      {" | "}
      <NavLink to="/Favorite">Favorite</NavLink>
      {" | "}
      <NavLink to="/Order">Order</NavLink>
      {" | "}
      <NavLink to="/User">User</NavLink>
      {" | "}
    </nav>
  );
}