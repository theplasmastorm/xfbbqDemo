import * as type from "./actionTypes";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function getTokenSuccess(token) {
  return { type: type.GET_TOKEN_SUCCESS, token };
}

export function removeTokenSuccess() {
  return { type: type.REMOVE_TOKEN_SUCCESS };
}

export function getToken(token) {
  return async function (dispatch) {
    dispatch(beginApiCall());
    try {
      dispatch(getTokenSuccess(token));
    } catch (e) {
      dispatch(apiCallError(e));
      throw e;
    }
  };
}

export function removeToken() {
  return async function (dispatch) {
    dispatch(beginApiCall());
    try {
      dispatch(removeTokenSuccess());
    } catch (e) {
      dispatch(apiCallError(e));
      throw e;
    }
  };
}
