import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/rootReducer";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import expireReducer from "redux-persist-expire";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import { saveAuthToken } from "./tokenMiddleware";
import initialState from "./reducers/initialState";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  debug: process.env.NODE_ENV !== "production",
  whitelist: ["login", "token"],
  transforms: [
    expireReducer("login", {
      expireSeconds: 60 * 60 * 24,
      expiredState: initialState.login,
      persistedAtKey: "loadedAt",
    }),
    expireReducer("token", {
      expireSeconds: 60 * 60 * 24,
      expiredState: initialState.token,
      persistedAtKey: "loadedAt",
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer());

// Add support for redux dev tools
const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    })) ||
  compose;

const enhancer = composeEnhancers(
  process.env.NODE_ENV === "production"
    ? applyMiddleware(thunk, saveAuthToken)
    : applyMiddleware(thunk, reduxImmutableStateInvariant(), saveAuthToken)
);

export const store = createStore(persistedReducer, enhancer);

export const persistor = persistStore(store);
