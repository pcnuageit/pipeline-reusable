import { baseApi } from "../../../services/api";

const financialSupport = baseApi.injectEndpoints({
  endpoints: (build) => ({
    aproveFinancialSupport: build.mutation({
      query: ({ id, aprove = true }) => ({
        method: "POST",
        url: `/credito/apoio-financeiros/${id}/aprovar`,
        body: {
          aprovar: aprove,
        },
      }),
    }),
    cancelFinancialSupport: build.mutation({
      query: ({ id }) => ({
        method: "POST",
        url: `/credito/apoio-financeiros/${id}/cancelar`,
      }),
    }),
    reactivateFinancialSupport: build.mutation({
      query: ({ id }) => ({
        method: "POST",
        url: `/credito/apoio-financeiros/${id}/reactivate`,
      }),
    }),
    retryFinancialSupportTransfer: build.mutation({
      query: ({ id }) => ({
        method: "POST",
        url: `/credito/apoio-financeiros/${id}/retry-transfer`,
      }),
    }),
    chargeTarifas: build.mutation({
      query: ({ ids }) => ({
        method: "POST",
        url: `/credito/tarifa-apoio-financeiros/cobrar`,
        body: {
          tarifas: ids,
        },
      }),
    }),
    getFinancialSupports: build.query({
      query: ({
        proposalId,
        id,
        status,
        created_at,
        ec_like,
        valor_disponivel,
        per_page = 15,
        page,
      }) => {
        const params = {
          per_page,
          page,
        };

        params["filter[id]"] = id;
        params["filter[proposta_id]"] = proposalId;
        params["filter[status]"] = status;
        params["filter[ec_like]"] = ec_like;
        params["filter[created_at]"] = created_at;
        params["filter[valor_disponivel]"] = valor_disponivel;

        return {
          url: "/credito/apoio-financeiros",
          params,
        };
      },
    }),
    getExportFinancialSupports: build.mutation({
      query: ({
        proposalId,
        id,
        status,
        ec_like,
        created_at,
        valor_disponivel,
      }) => {
        const params = {};
        params["filter[id]"] = id;
        params["filter[proposta_id]"] = proposalId;
        params["filter[status]"] = status;
        params["filter[ec_like]"] = ec_like;
        params["filter[created_at]"] = created_at;
        params["filter[valor_disponivel]"] = valor_disponivel;

        return {
          method: "POST",
          url: "/credito/apoio-financeiros/export/get",
          params,
        };
      },
    }),
    getFinancialSupport: build.query({
      query: ({ id }) => ({
        url: `/credito/apoio-financeiros/${id}`,
      }),
    }),
  }),
});

export const {
  useAproveFinancialSupportMutation,
  useGetFinancialSupportsQuery,
  useGetFinancialSupportQuery,
  useGetExportFinancialSupportsMutation,
  useCancelFinancialSupportMutation,
  useReactivateFinancialSupportMutation,
  useRetryFinancialSupportTransferMutation,
  useChargeTarifasMutation,
} = financialSupport;
