import initialState from "./initialState";
import * as type from "../actions/actionTypes";

export default function tokenReducer(state = initialState.token, action) {
  switch (action.type) {
    case type.GET_TOKEN_SUCCESS:
      return { ...action.token };
    case type.REMOVE_TOKEN_SUCCESS:
      return {};
    default:
      return state;
  }
}
