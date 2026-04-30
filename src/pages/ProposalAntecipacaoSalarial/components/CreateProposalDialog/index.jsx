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
import React, { useState } from 'react';
import CurrencyFieldText from '../../../../modules/AntecipacaoSalarial/components/CurrencyField';
import { useCreateAntecipacaoSalarialProposalMutation } from '../../../../modules/AntecipacaoSalarialProposal/services/AntecipacaoSalarialProposal';
import { toast } from 'react-toastify';
import { Autocomplete } from '@material-ui/lab';
import Popover from '../../../../modules/AntecipacaoSalarial/components/Popover';
import { InfoOutlined } from '@material-ui/icons';
import { useEffect } from 'react';

const validationSchema = yup.object({
	nome: yup.string().required('Nome é obrigatório'),
	valor_inicial: yup
		.number()
		.moreThan(0, 'Valor incial da proposta deve ser maior que 0')
		.required('Valor inicial é obrigatório'),
	valor_final: yup
		.number()
		.moreThan(1, 'Valor final deve ser maior que 1')
		.required('Valor final é obrigatório'),
	valor_liberado: yup
		.number()
		.moreThan(4.99, 'Valor liberado deve ser pelo menos 5')
		.required('Valor liberado é obrigatório'),
	conta_debit_id: yup.string().required('Conta débito é obrigatória'),
	conta_credit_id: yup.string().required('Conta crédito é obrigatória'),
});

function CreateProposalDialog({
	filters,
	setFilters,
	open = false,
	onClose = () => {},
	accounts = [],
}) {
	const [createProposal] = useCreateAntecipacaoSalarialProposalMutation();
	const [errors, setErrors] = useState({});

	const formik = useFormik({
		initialValues: {
			nome: '',
			valor_inicial: '',
			valor_final: '',
			valor_liberado: '',
			conta_debit_id: '',
			conta_credit_id: '',
		},
		/* validationSchema: validationSchema, */
		onSubmit: async (values) => {
			try {
				await createProposal({
					nome: values.nome,
					valor_inicial: values.valor_inicial,
					valor_final: values.valor_final,
					valor_liberado: values.valor_liberado,
					conta_debit_id: values.conta_debit_id,
					conta_credit_id: values.conta_credit_id,
				}).unwrap();

				toast.success('Proposta criada com sucesso');
				onClose();
			} catch (e) {
				toast.error('Erro ao criar proposta');
				toast.error(e?.data?.message);
				setErrors(e.data.errors);
			}
		},
	});

	return accounts?.data ? (
		<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
			<DialogTitle
				style={{
					paddingBottom: 0,
				}}
			>
				Nova proposta de antecipação salarial
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
								helperText={errors?.nome ? errors.nome.join('') : null}
								error={errors?.nome ? errors.nome : null}
								/* error={
									formik.touched.nome && Boolean(formik.errors.nome)
								}
								helperText={formik.touched.nome && formik.errors.nome} */
							/>
						</Grid>
						<Grid item xs={4}>
							<CurrencyFieldText
								fullWidth
								id="valor_liberado"
								name="valor_liberado"
								label="Valor liberado"
								formik={formik}
								value={formik.valor_liberado}
								helperText={
									errors?.valor_liberado
										? errors.valor_liberado.join('')
										: null
								}
								error={
									errors?.valor_liberado ? errors.valor_liberado : null
								}
								/* error={
									formik.touched.valor_liberado &&
									Boolean(formik.errors.valor_liberado)
								}
								helperText={
									formik.touched.valor_liberado &&
									formik.errors.valor_liberado
								} */
							/>
						</Grid>

						<Grid item xs={4}>
							<CurrencyFieldText
								fullWidth
								id="valor_inicial"
								name="valor_inicial"
								label="Valor inicial"
								formik={formik}
								value={formik.valor_inicial}
								helperText={
									errors?.valor_inicial
										? errors.valor_inicial.join('')
										: null
								}
								error={
									errors?.valor_inicial ? errors.valor_inicial : null
								}
								/* error={
									formik.touched.valor_inicial &&
									Boolean(formik.errors.valor_inicial)
								}
								helperText={
									formik.touched.valor_inicial &&
									formik.errors.valor_inicial
								} */
							/>
						</Grid>
						<Grid item xs={4}>
							<CurrencyFieldText
								fullWidth
								id="valor_final"
								name="valor_final"
								label="Valor final"
								formik={formik}
								value={formik.valor_final}
								helperText={
									errors?.valor_final
										? errors.valor_final.join('')
										: null
								}
								error={errors?.valor_final ? errors.valor_final : null}
								/* error={
									formik.touched.valor_final &&
									Boolean(formik.errors.valor_final)
								}
								helperText={
									formik.touched.valor_final &&
									formik.errors.valor_final
								} */
							/>
						</Grid>

						<Grid item xs={12}>
							<Autocomplete
								fullWidth
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
										helperText={
											errors?.conta_debit_id
												? errors.conta_debit_id.join('')
												: null
										}
										error={
											errors?.conta_debit_id
												? errors.conta_debit_id
												: null
										}
										/* error={
											formik.touched.conta_credit_id &&
											Boolean(formik.errors.conta_credit_id)
										}
										helperText={
											formik.touched.conta_credit_id &&
											formik.errors.conta_credit_id
												? formik.errors.conta_credit_id
												: 'Conta de onde será debitado valor da proposta'
										} */
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12}>
							<Autocomplete
								fullWidth
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
										helperText={
											errors?.conta_credit_id
												? errors.conta_credit_id.join('')
												: null
										}
										error={
											errors?.conta_credit_id
												? errors.conta_credit_id
												: null
										}
										/* error={
											formik.touched.conta_credit_id &&
											Boolean(formik.errors.conta_credit_id)
										}
										helperText={
											formik.touched.conta_credit_id &&
											formik.errors.conta_credit_id
												? formik.errors.conta_credit_id
												: 'Conta onde será depositada o pagamento da proposta'
										} */
									/>
								)}
							/>
						</Grid>
						{/* 	<Grid item xs={12}>
							<Autocomplete
								fullWidth
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
										'taxAccount',
										option ? option.id : ''
									);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Conta Tarifa"
										error={
											formik.touched.taxAccount &&
											Boolean(formik.errors.taxAccount)
										}
										helperText={
											formik.touched.taxAccount &&
											formik.errors.taxAccount
												? formik.errors.taxAccount
												: 'Conta onde será depositada a tarifa'
										}
									/>
								)}
							/>
						</Grid> */}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={onClose}>
						Cancelar
					</Button>
					<Button variant="outlined" color="primary" type="submit">
						Criar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	) : null;
}

export default CreateProposalDialog;
