import * as type from "./actions/actionTypes";
import * as tokenApi from "../api/tokenApi";

export function saveAuthToken() {
  return function (next) {
    return function (action) {
      if (action.type === "persist/REHYDRATE")
        tokenApi.setToken(action?.payload?.token?.token);
      else if (action.type === type.GET_TOKEN_SUCCESS)
        tokenApi.setToken(action.token.token);

      // Continue processing
      return next(action);
    };
  };
}
