import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Axios from "axios";
import { getAuthToken, getSgaAuthToken } from "../utils/token";
import {
  cancelarAproveckBoletoMutation,
  editAproveckAssociadoMutation,
  editarSituacaoAproveckBoletoMutation,
  editarVencimentoAproveckBoletoMutation,
  getAproveckAssociadoQuery,
  getAproveckBoletoQuery,
  getAproveckIndicacaoQuery,
  getAproveckVeiculoQuery,
  indexAproveckBoletosQuery,
  indexAproveckEventosQuery,
  indexAproveckIndicacoesQuery,
  indexAproveckVeiculosQuery,
  sendAproveckBoletoByEmailMutation,
  sgaLoginMutation,
  storeAproveckBoletoMutation,
  updateAproveckBoletoMutation,
} from "./aproveck";
import {
  exportArquivoRetornoQuery,
  getArquivoRemessaQuery,
  getArquivoRetornoQuery,
  getItemRemessaQuery,
  getPagadoresRemessaQuery,
  getRetryItemsQuery,
  showArquivoRemessaQuery,
  storeArquivoRemessaMutation,
  uploadArquivoRemessaMutation,
} from "./cnba400";

const BASE_URL = process.env.REACT_APP_API_URL;
const SGA_BASE_URL = process.env.REACT_APP_SGA_API_BASE_URL;

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

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const logout = () => {
      localStorage.removeItem("@auth");
      window.location = "/login";
    };

    if (
      error?.response?.data?.error &&
      (error?.response?.data?.session === false ||
        error?.response?.data?.session === "false")
    )
      logout();
    if (error?.response?.status === 401) logout();

    return Promise.reject(error);
  },
);

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
    uploadArquivoRemessa: builder.mutation({
      query: uploadArquivoRemessaMutation,
    }),
    storeArquivoRemessa: builder.mutation({
      query: storeArquivoRemessaMutation,
    }),
    indexArquivoRemessa: builder.query({
      query: getArquivoRemessaQuery,
    }),
    showArquivoRemessa: builder.query({
      query: showArquivoRemessaQuery,
    }),
    indexPagadoresRemessa: builder.query({
      query: getPagadoresRemessaQuery,
    }),
    indexItemRemessa: builder.query({
      query: getItemRemessaQuery,
    }),
    retryItemsRemessa: builder.query({
      query: getRetryItemsQuery,
    }),
    indexArquivoRetorno: builder.query({
      query: getArquivoRetornoQuery,
    }),
    exportArquivoRetorno: builder.mutation({
      query: exportArquivoRetornoQuery,
    }),

    // Aproveck ---------------
    sgaLogin: builder.mutation({
      query: sgaLoginMutation,
    }),
    storeAproveckBoleto: builder.mutation({
      query: storeAproveckBoletoMutation,
    }),
    updateAproveckBoleto: builder.mutation({
      query: updateAproveckBoletoMutation,
    }),
    cancelarAproveckBoleto: builder.mutation({
      query: cancelarAproveckBoletoMutation,
    }),
    sendAproveckBoletoByEmail: builder.mutation({
      query: sendAproveckBoletoByEmailMutation,
    }),
  }),
});

export const sgaApi = createApi({
  reducerPath: "sgaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SGA_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getSgaAuthToken();

      console.log({ token });

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("accept", "application/json");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    indexAproveckBoletos: builder.query({
      query: indexAproveckBoletosQuery,
    }),
    getAproveckBoleto: builder.query({
      query: getAproveckBoletoQuery,
    }),
    editarVencimentoAproveckBoleto: builder.mutation({
      query: editarVencimentoAproveckBoletoMutation,
    }),
    editarSituacaoAproveckBoleto: builder.mutation({
      query: editarSituacaoAproveckBoletoMutation,
    }),
    getAproveckAssociado: builder.query({
      query: getAproveckAssociadoQuery,
    }),
    editAproveckAssociado: builder.mutation({
      query: editAproveckAssociadoMutation,
    }),
    indexAproveckVeiculos: builder.query({
      query: indexAproveckVeiculosQuery,
    }),
    getAproveckVeiculo: builder.query({
      query: getAproveckVeiculoQuery,
    }),
    indexAproveckIndicacoes: builder.query({
      query: indexAproveckIndicacoesQuery,
    }),
    getAproveckIndicacao: builder.query({
      query: getAproveckIndicacaoQuery,
    }),
    indexAproveckEventos: builder.query({
      query: indexAproveckEventosQuery,
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useStoreArquivoRemessaMutation,
  useUploadArquivoRemessaMutation,
  useIndexArquivoRemessaQuery,
  useShowArquivoRemessaQuery,
  useLazyShowArquivoRemessaQuery,
  useIndexItemRemessaQuery,
  useExportArquivoRetornoMutation,
  useIndexArquivoRetornoQuery,
  useIndexPagadoresRemessaQuery,
  useLazyRetryItemsRemessaQuery,

  useSgaLoginMutation,
  useStoreAproveckBoletoMutation,
  useUpdateAproveckBoletoMutation,
  useCancelarAproveckBoletoMutation,
  useSendAproveckBoletoByEmailMutation,
} = baseApi;

export const {
  useIndexAproveckBoletosQuery,
  useGetAproveckBoletoQuery,
  useEditarVencimentoAproveckBoletoMutation,
  useEditarSituacaoAproveckBoletoMutation,
  useIndexAproveckVeiculosQuery,
  useGetAproveckVeiculoQuery,
  useGetAproveckAssociadoQuery,
  useEditAproveckAssociadoMutation,
  useIndexAproveckIndicacoesQuery,
  useGetAproveckIndicacaoQuery,
  useIndexAproveckEventosQuery,
} = sgaApi;
