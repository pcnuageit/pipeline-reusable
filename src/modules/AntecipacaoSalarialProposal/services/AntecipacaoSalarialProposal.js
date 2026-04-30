import { baseApi } from '../../../services/api';

const antecipacaoSalarialProposalApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAntecipacaoSalarialProposals: build.query({
			query: () => ({
				url: '/credito/proposta-antecipacao-salarial',
			}),
		}),
		getAntecipacaoSalarialProposal: build.query({
			query: (proposalId) => ({
				url: `/credito/proposta-antecipacao-salarial/${proposalId}`,
			}),
		}),
		getAntecipacaoSalarialProposalAccounts: build.query({
			query: ({ proposalId }) => ({
				url: `/credito/proposta-antecipacao-salarial/${proposalId}/mostrar-contas-liberadas`,
			}),
		}),
		deleteAntecipacaoSalarialProposal: build.mutation({
			query: (proposalId) => ({
				method: 'DELETE',
				url: `/credito/proposta-antecipacao-salarial/${proposalId}`,
			}),
		}),
		addAntecipacaoSalarialProposalAccounts: build.mutation({
			query: ({ proposalId, accountIdList: conta_id_list }) => ({
				method: 'POST',
				url: `/credito/proposta-antecipacao-salarial/${proposalId}/liberar-contas`,
				body: {
					conta_id_list,
				},
			}),
		}),
		removeAntecipacaoSalarialProposalAccounts: build.mutation({
			query: ({ proposalId, accountIdList: conta_id_list }) => ({
				method: 'DELETE',
				url: `/credito/proposta-antecipacao-salarial/${proposalId}/remover-contas`,
				body: {
					conta_id_list,
				},
			}),
		}),
		createAntecipacaoSalarialProposal: build.mutation({
			query: ({
				nome,
				valor_inicial,
				valor_final,
				valor_liberado,
				conta_debit_id,
				conta_credit_id,
			}) => ({
				url: '/credito/proposta-antecipacao-salarial',
				method: 'POST',

				body: {
					nome,
					valor_inicial,
					valor_final,
					valor_liberado,
					conta_debit_id,
					conta_credit_id,
				},
			}),
		}),
		updateAntecipacaoSalarialProposal: build.mutation({
			query: ({
				id,
				nome,
				valor_inicial,
				valor_final,
				valor_liberado,
				conta_debit_id,
				conta_credit_id,
			}) => ({
				url: `/credito/proposta-antecipacao-salarial/${id}`,
				method: 'PUT',
				body: {
					nome,
					valor_inicial,
					valor_final,
					valor_liberado,
					conta_debit_id,
					conta_credit_id,
				},
			}),
		}),
		updateIsPublicInAntecipacaoSalarialProposal: build.mutation({
			query: ({ id, is_public }) => ({
				url: `/credito/proposta-antecipacao-salarial/${id}/update-public-status`,
				method: 'PUT',
				body: {
					is_public,
				},
			}),
		}),
	}),
});

export const {
	useGetAntecipacaoSalarialProposalsQuery,
	useCreateAntecipacaoSalarialProposalMutation,
	useGetAntecipacaoSalarialProposalQuery,
	useGetAntecipacaoSalarialProposalAccountsQuery,
	useUpdateAntecipacaoSalarialProposalMutation,
	useDeleteAntecipacaoSalarialProposalMutation,
	useAddAntecipacaoSalarialProposalAccountsMutation,
	useRemoveAntecipacaoSalarialProposalAccountsMutation,
	useUpdateIsPublicInAntecipacaoSalarialProposalMutation,
} = antecipacaoSalarialProposalApi;
