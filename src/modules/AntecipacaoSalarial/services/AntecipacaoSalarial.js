import { baseApi } from "../../../services/api";

const antecipacaoSalarial = baseApi.injectEndpoints({
  endpoints: (build) => ({
    aproveAntecipacaoSalarial: build.mutation({
      query: ({ id, aprove = true }) => ({
        method: "POST",
        url: `/credito/antecipacao-salarial/${id}/aprovar`,
        body: {
          aprovar: aprove,
        },
      }),
    }),
    cancelAntecipacaoSalarial: build.mutation({
      query: ({ id }) => ({
        method: "POST",
        url: `/credito/antecipacao-salarial/${id}/cancelar`,
      }),
    }),
    reactivateAntecipacaoSalarial: build.mutation({
      query: ({ id }) => ({
        method: "POST",
        url: `/credito/antecipacao-salarial/${id}/reactivate`,
      }),
    }),
    retryAntecipacaoSalarialTransfer: build.mutation({
      query: ({ id }) => ({
        method: "POST",
        url: `/credito/antecipacao-salarial/${id}/retry-transfer`,
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
    getAntecipacoesSalariais: build.query({
      query: ({
        proposalId,
        id,
        status,
        created_at,
        ec_like,
        valor_liberado,
        per_page = 15,
        page,
      }) => {
        const params = {
          per_page,
          page,
        };

        params["id"] = id;
        params["proposta_id"] = proposalId;
        params["status"] = status;
        params["ec_like"] = ec_like;
        params["created_at"] = created_at;
        params["valor_liberado"] = valor_liberado;

        return {
          url: "/credito/antecipacao-salarial",
          params,
        };
      },
    }),
    getExportAntecipacoesSalariais: build.mutation({
      query: ({
        proposalId,
        id,
        status = "",
        ec_like,
        created_at,
        valor_liberado,
      }) => {
        const params = {};
        params["id"] = id;
        params["proposta_id"] = proposalId;
        params["status"] = status;
        params["ec_like"] = ec_like;
        params["created_at"] = created_at;
        params["valor_liberado"] = valor_liberado;

        return {
          method: "POST",
          url: "/credito/antecipacao-salarial/export/get",
          params,
        };
      },
    }),
    getAntecipacaoSalarial: build.query({
      query: ({ id }) => ({
        url: `/credito/antecipacao-salarial/${id}`,
      }),
    }),
  }),
});

export const {
  useAproveAntecipacaoSalarialMutation,
  useGetAntecipacoesSalariaisQuery,
  useGetAntecipacaoSalarialQuery,
  useGetExportAntecipacoesSalariaisMutation,
  useCancelAntecipacaoSalarialMutation,
  useReactivateAntecipacaoSalarialMutation,
  useRetryAntecipacaoSalarialTransferMutation,
  useChargeTarifasMutation,
} = antecipacaoSalarial;
