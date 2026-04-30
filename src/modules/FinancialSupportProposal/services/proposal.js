import { baseApi } from '../../../services/api';

const proposalApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getProposals: build.query({
			query: () => ({
				url: '/credito/proposta-apoio-financeiro',
			}),
		}),
		getProposal: build.query({
			query: (proposalId) => ({
				url: `/credito/proposta-apoio-financeiro/${proposalId}`,
			}),
		}),
		getProposalAccounts: build.query({
			query: ({ proposalId }) => ({
				url: `/credito/proposta-apoio-financeiro/${proposalId}/mostrar-contas-liberadas`,
			}),
		}),
		deleteProposal: build.mutation({
			query: (proposalId) => ({
				method: 'DELETE',
				url: `/credito/proposta-apoio-financeiro/${proposalId}`,
			}),
		}),
		addAccounts: build.mutation({
			query: ({ proposalId, accountIdList: conta_id_list }) => ({
				method: 'POST',
				url: `/credito/proposta-apoio-financeiro/${proposalId}/liberar-contas`,
				body: {
					conta_id_list,
				},
			}),
		}),
		removeAccounts: build.mutation({
			query: ({ proposalId, accountIdList: conta_id_list }) => ({
				method: 'DELETE',
				url: `/credito/proposta-apoio-financeiro/${proposalId}/remover-contas`,
				body: {
					conta_id_list,
				},
			}),
		}),
		createProposal: build.mutation({
			query: ({
				nome,
				active,
				valor,
				valor_tarifa,
				duracao_em_meses,
				conta_escrow_id,
				conta_tarifa_id,
				is_public,
				interval_days_when_refused,
			}) => ({
				url: '/credito/proposta-apoio-financeiro',
				method: 'POST',
				body: {
					nome,
					active,
					valor,
					valor_tarifa,
					duracao_em_meses,
					conta_escrow_id,
					conta_tarifa_id,
					is_public,
					interval_days_when_refused,
				},
			}),
		}),
		updateProposal: build.mutation({
			query: ({
				id,
				nome,
				active,
				valor,
				valor_tarifa,
				duracao_em_meses,
				conta_escrow_id,
				conta_tarifa_id,
				interval_days_when_refused,
			}) => ({
				url: `/credito/proposta-apoio-financeiro/${id}`,
				method: 'PUT',
				body: {
					nome,
					active,
					valor,
					valor_tarifa,
					duracao_em_meses,
					conta_escrow_id,
					conta_tarifa_id,
					interval_days_when_refused,
				},
			}),
		}),
		updateIsPublicInProposal: build.mutation({
			query: ({ id, is_public }) => ({
				url: `/credito/proposta-apoio-financeiro/${id}/update-public-status`,
				method: 'PUT',
				body: {
					is_public,
				},
			}),
		}),
	}),
});

export const {
	useGetProposalsQuery,
	useCreateProposalMutation,
	useGetProposalQuery,
	useGetProposalAccountsQuery,
	useUpdateProposalMutation,
	useDeleteProposalMutation,
	useAddAccountsMutation,
	useRemoveAccountsMutation,
	useUpdateIsPublicInProposalMutation,
} = proposalApi;
