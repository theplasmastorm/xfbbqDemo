import React from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/loginActions";
import { removeToken } from "../../redux/actions/tokenActions";

import Jumbotron from "react-bootstrap/Jumbotron";
import Spinner from "react-bootstrap/Spinner";

export default function UserLogout() {
  document.title = "𝘹𝘧BBQ - Logout";

  const history = useHistory();
  const dispatch = useDispatch();

  setTimeout(() => {
    dispatch(logoutUser());
    dispatch(removeToken());
    history.push("/");
    toast.success("Successfully logged out");
  }, 2500);

  return (
    <Jumbotron>
      <center>
        <h2>Logging you out...</h2>
        <br />
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </center>
    </Jumbotron>
  );
}
