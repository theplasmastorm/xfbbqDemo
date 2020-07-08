import { combineReducers } from "redux";

import login from "./loginReducer";
import token from "./tokenReducer";

export default function rootReducer() {
  return combineReducers({
    login,
    token
  });
}
