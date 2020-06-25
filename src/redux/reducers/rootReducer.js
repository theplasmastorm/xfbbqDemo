import { combineReducers } from "redux";

import login from "./loginReducer";

export default function rootReducer() {
  return combineReducers({
    login
  });
}
