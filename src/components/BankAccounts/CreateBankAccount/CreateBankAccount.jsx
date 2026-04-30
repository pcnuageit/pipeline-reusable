import {
	Box,
	FormControl,
	FormControlLabel,
	Grid,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	loadBancos,
	loadContaBancaria,
	postContaBancariaAction,
} from '../../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../CustomButton/CustomButton';
import LoadingScreen from '../../LoadingScreen/LoadingScreen';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import { useParams } from 'react-router';
import { APP_CONFIG } from '../../../constants/config';

const CreateBankAccount = ({
	contaBancaria,
	setContaBancaria,
	disableCadastro,
	setDisableCadastro,
}) => {
	const token = useAuth();
	const { id } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadBancos(token));
	}, []);

	const [errosContaBancaria, setErrosContaBancaria] = useState({});

	const Listbancos = useSelector((state) => state.bancos);
	const [loading, setLoading] = useState(false);

	const handleCadastrarConta = async () => {
		setLoading(true);
		const res = await dispatch(
			postContaBancariaAction(token, contaBancaria, id)
		);
		if (res) {
			setErrosContaBancaria(res);
			toast.error('Erro ao cadastrar conta bancaria');
			setLoading(false);
		} else {
			toast.success('Conta criada com sucesso');
			if (disableCadastro) {
				setDisableCadastro(true);
			}
			await dispatch(loadContaBancaria(token, id));
			setLoading(false);
		}
	};

	return (
		<Box
			display="flex"
			alignItems="center"
			alignContent="center"
			justifyContent="center"
			flexDirection="column"
		>
			<LoadingScreen isLoading={loading} />
			<Typography align="center">Cadastrar conta bancária</Typography>

			<FormControl>
				<RadioGroup
					style={{ alignSelf: 'center' }}
					value={contaBancaria.tipo}
					onChange={(e) =>
						setContaBancaria({ ...contaBancaria, tipo: e.target.value })
					}
				>
					<FormControlLabel
						value="1"
						control={<Radio />}
						label="Conta Corrente"
					/>
					<FormControlLabel
						value="2"
						control={<Radio />}
						label="Conta Poupança"
					/>
				</RadioGroup>
			</FormControl>
			<Grid container>
				<Grid item xs={12}>
					<Select
						fullWidth
						variant="standard"
						onChange={(e) =>
							setContaBancaria({
								...contaBancaria,
								banco: e.target.value,
							})
						}
					>
						{Object.entries(Listbancos)
							.sort((a, b) => a[0] - b[0])
							.map((item) => (
								<MenuItem key={item[0]} value={item[0]}>
									{item[1]}
								</MenuItem>
							))}
					</Select>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						error={errosContaBancaria.agencia}
						helperText={
							errosContaBancaria.agencia
								? errosContaBancaria.agencia.join(' ')
								: null
						}
						required
						label="Agência"
						value={contaBancaria.agencia}
						onChange={(e) =>
							setContaBancaria({
								...contaBancaria,
								agencia: e.target.value,
							})
						}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						error={errosContaBancaria.conta}
						helperText={
							errosContaBancaria.conta
								? errosContaBancaria.conta.join(' ')
								: null
						}
						required
						label="Conta"
						value={contaBancaria.conta}
						onChange={(e) =>
							setContaBancaria({
								...contaBancaria,
								conta: e.target.value,
							})
						}
					/>
				</Grid>
			</Grid>
			<Box marginTop="8px">
				<CustomButton
					buttonText="Cadastrar"
					onClick={handleCadastrarConta}
					disabled={disableCadastro}
				/>
			</Box>
		</Box>
	);
};

export default CreateBankAccount;
