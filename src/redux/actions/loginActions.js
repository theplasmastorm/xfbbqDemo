import * as type from "./actionTypes";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loginUserSuccess(login) {
  return { type: type.LOGIN_USER_SUCCESS, login };
}

export function logoutUserSuccess() {
  return { type: type.LOGOUT_USER_SUCCESS };
}

export function loginUser(user) {
  return async function(dispatch) {
    dispatch(beginApiCall());
    try {
      dispatch(loginUserSuccess(user));
    } catch (e) {
      dispatch(apiCallError(e));
      throw e;
    }
  };
}

export function logoutUser() {
  return async function(dispatch) {
    dispatch(beginApiCall());
    try {
      dispatch(logoutUserSuccess());
    } catch (e) {
      dispatch(apiCallError(e));
      throw e;
    }
  };
}
