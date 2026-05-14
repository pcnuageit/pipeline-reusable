import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import { baseApi, sgaApi } from "../services/api";
import { combineReducers } from "../utils/redux";

import { INITIAL_STATE, rootReducer } from "./rootReducer";

const storeReduxJs = configureStore({
  reducer: combineReducers(
    {
      [baseApi.reducerPath]: baseApi.reducer,
      [sgaApi.reducerPath]: sgaApi.reducer,
    },
    rootReducer,
    INITIAL_STATE,
  ),
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(thunk)
      .concat(baseApi.middleware)
      .concat(sgaApi.middleware),
});

export default storeReduxJs;
