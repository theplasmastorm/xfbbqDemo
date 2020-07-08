import React from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/loginActions";
import { removeToken } from "../../redux/actions/tokenActions";

export default function UserLogout() {
  const history = useHistory();
  const dispatch = useDispatch();

  setTimeout(() => {
    dispatch(logoutUser());
    dispatch(removeToken());
    history.push("/");
    toast.success("Successfully logged out");
  }, 2500);

  return (
    <>
      <center>
        <h2>Logging you out...</h2>
      </center>
    </>
  );
}
