import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Axios from "axios";
import { getAuthToken } from "../utils/token";

const BASE_URL = process.env.REACT_APP_API_URL;

export const api = Axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return config;
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = getAuthToken();

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("accept", "application/json");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAccounts: builder.query({
      query: (params = {}) => ({
        url: "/contas",
        params,
      }),
    }),
  }),
});

export const { useGetAccountsQuery } = baseApi;
