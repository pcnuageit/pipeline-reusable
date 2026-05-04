import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import { baseApi } from "../services/api";
import { combineReducers } from "../utils/redux";

import { INITIAL_STATE, rootReducer } from "./rootReducer";

const store = configureStore({
  reducer: combineReducers(
    {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    rootReducer,
    INITIAL_STATE
  ),
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk).concat(baseApi.middleware),
});

export default store;
