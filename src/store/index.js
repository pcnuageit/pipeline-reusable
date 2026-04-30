import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import { combineReducers } from "../utils/redux";
import { baseApi } from "../services/api";

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
