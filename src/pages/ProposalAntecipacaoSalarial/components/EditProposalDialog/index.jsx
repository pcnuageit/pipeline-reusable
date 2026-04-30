import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	TextField,
	Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React from 'react';
import { toast } from 'react-toastify';
import CurrencyFieldText from '../../../../modules/AntecipacaoSalarial/components/CurrencyField';

import { Autocomplete } from '@material-ui/lab';
import Popover from '../../../../modules/AntecipacaoSalarial/components/Popover';
import { InfoOutlined } from '@material-ui/icons';
import {
	useUpdateAntecipacaoSalarialProposalMutation,
	useUpdateIsPublicInAntecipacaoSalarialProposalMutation,
} from '../../../../modules/AntecipacaoSalarialProposal/services/AntecipacaoSalarialProposal';

const validationSchema = yup.object({
	nome: yup.string().required('Nome é obrigatório'),
	valor_inicial: yup
		.number()
		.moreThan(0, 'Valor incial da proposta deve ser maior que 0')
		.required('Valor inicial é obrigatório'),
	valor_final: yup
		.number()
		.moreThan(0, 'Valor final deve ser maior que 0')
		.required('Valor final é obrigatório'),
	valor_liberado: yup
		.number()
		.moreThan(0, 'Valor liberado deve ser maior que 0')
		.required('Valor liberado é obrigatório'),
	conta_debit_id: yup.string().required('Conta débito é obrigatória'),
	conta_credit_id: yup.string().required('Conta crédito é obrigatória'),
});

function EditProposalDialog({
	filters,
	setFilters,
	open = false,
	onClose = () => {},
	accounts = [],
	proposal,
}) {
	const [updateProposal] = useUpdateAntecipacaoSalarialProposalMutation();
	const [updateIsPublic] =
		useUpdateIsPublicInAntecipacaoSalarialProposalMutation();
	const formik = useFormik({
		initialValues: {
			nome: proposal.nome,
			valor_inicial: proposal.valor_inicial,
			valor_final: proposal.valor_final,
			valor_liberado: proposal.valor_liberado,
			conta_debit_id: proposal.conta_debit_id,
			conta_credit_id: proposal.conta_credit_id,
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				await updateProposal({
					id: proposal.id,
					nome: values.nome,
					valor_inicial: values.valor_inicial,
					valor_final: values.valor_final,
					valor_liberado: values.valor_liberado,
					conta_debit_id: values.conta_debit_id,
					conta_credit_id: values.conta_credit_id,
				}).unwrap();

				toast.success('Proposta atualizada com sucesso');
				onClose();
			} catch (e) {
				toast.error('Não foi possível atualizar a Proposta');
				if (e.status === 401 && e.data?.message) {
					return toast.error(e.data.message);
				}
			}
		},
	});

	const handleChangePublicStatus = async () => {
		try {
			const lastPublicStatus = proposal.is_public;

			await updateIsPublic({
				id: proposal.id,
				is_public: !proposal.is_public,
			}).unwrap();

			if (lastPublicStatus) {
				toast.success(
					'Status público removido da Proposta de Antecipação Salarial!'
				);
			} else {
				toast.success(
					'Status público adicionado na Proposta de Antecipação Salarial!'
				);
			}
			onClose();
		} catch (e) {
			toast.error(
				'Erro ao modificar visualização da Proposta de Antecipação Salarial!'
			);
		}
	};

	return accounts?.data ? (
		<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
			<DialogTitle
				style={{
					paddingBottom: 0,
				}}
			>
				Editar proposta de antecipação salarial
			</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent
					style={{
						paddingTop: 0,
						minWidth: 500,
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								autoFocus
								fullWidth
								id="nome"
								name="nome"
								label="Nome"
								placeholder="Nome para identificar a proposta"
								value={formik.values.nome}
								onChange={formik.handleChange}
								error={
									formik.touched.nome && Boolean(formik.errors.nome)
								}
								helperText={formik.touched.nome && formik.errors.nome}
							/>
						</Grid>

						<Grid item xs={4}>
							<CurrencyFieldText
								disabled={proposal.valor_liberado === false}
								fullWidth
								id="valor_liberado"
								name="valor_liberado"
								label="Valor liberado"
								formik={formik}
								value={formik.values.valor_liberado}
								error={
									formik.touched.valor_liberado &&
									Boolean(formik.errors.valor_liberado)
								}
								helperText={
									formik.touched.valor_liberado &&
									formik.errors.valor_liberado
								}
							/>
						</Grid>
						<Grid item xs={4}>
							<CurrencyFieldText
								disabled={proposal.valor_inicial === false}
								fullWidth
								id="valor_inicial"
								name="valor_inicial"
								label="Valor inicial"
								formik={formik}
								value={formik.values.valor_inicial}
								error={
									formik.touched.valor_inicial &&
									Boolean(formik.errors.valor_inicial)
								}
								helperText={
									formik.touched.valor_inicial &&
									formik.errors.valor_inicial
								}
							/>
						</Grid>
						<Grid item xs={4}>
							<CurrencyFieldText
								disabled={proposal.valor_final === false}
								fullWidth
								id="valor_final"
								name="valor_final"
								label="Valor final"
								formik={formik}
								value={formik.values.valor_final}
								error={
									formik.touched.valor_final &&
									Boolean(formik.errors.valor_final)
								}
								helperText={
									formik.touched.valor_final &&
									formik.errors.valor_final
								}
							/>
						</Grid>

						<Grid item xs={12}>
							<Autocomplete
								disabled={proposal.conta_debit_id === false}
								fullWidth
								defaultValue={proposal.conta_debit}
								options={accounts.data}
								getOptionLabel={(account) =>
									account.razao_social
										? `${account.razao_social}, ${account.cnpj}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
										: `${account.nome}, ${account.documento}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
								}
								onInputChange={(_event, value, reason) => {
									if (reason !== 'reset') {
										setFilters({ ...filters, like: value });
									}
								}}
								onChange={(_event, option) => {
									formik.setFieldValue(
										'conta_debit_id',
										option ? option.id : ''
									);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Conta débito"
										error={
											formik.touched.conta_debit_id &&
											Boolean(formik.errors.conta_debit_id)
										}
										helperText={
											formik.touched.conta_debit_id &&
											formik.errors.conta_debit_id
												? formik.errors.conta_debit_id
												: 'Conta de onde será debitado valor da proposta'
										}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12}>
							<Autocomplete
								disabled={proposal.conta_credit_id === false}
								fullWidth
								defaultValue={proposal.conta_credit}
								options={accounts.data}
								getOptionLabel={(account) =>
									account.razao_social
										? `${account.razao_social}, ${account.cnpj}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
										: `${account.nome}, ${account.documento}, agência: ${account.agencia}, banco: ${account.banco}, conta: ${account.conta}`
								}
								onInputChange={(_event, value, reason) => {
									if (reason !== 'reset') {
										setFilters({ ...filters, like: value });
									}
								}}
								onChange={(_event, option) => {
									formik.setFieldValue(
										'conta_credit_id',
										option ? option.id : ''
									);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Conta crédito"
										error={
											formik.touched.conta_credit_id &&
											Boolean(formik.errors.conta_credit_id)
										}
										helperText={
											formik.touched.conta_credit_id &&
											formik.errors.conta_credit_id
												? formik.errors.conta_credit_id
												: 'Conta onde será depositada o pagamento da proposta'
										}
									/>
								)}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={onClose}>
						Cancelar
					</Button>
					<Button variant="outlined" color="primary" type="submit">
						Salvar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	) : null;
}

export default EditProposalDialog;
