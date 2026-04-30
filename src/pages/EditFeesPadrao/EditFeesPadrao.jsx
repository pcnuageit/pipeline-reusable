import '../../fonts/Montserrat-SemiBold.otf';

import {
	Box,
	Button,
	ButtonGroup,
	Grid,
	Paper,
	Typography,
	makeStyles,
	TextField,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	getContasAction,
	loadPerfilTaxaIdAction,
	loadPerfilTaxaPadraoIdAction,
	putPerfilTaxaAction,
	putPerfilTaxaPadraoAction,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import CurrencyFormat from 'react-currency-format';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { isNumber } from 'lodash';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { APP_CONFIG } from '../../constants/config';
import useDebounce from '../../hooks/useDebounce';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		position: 'relative',
		flexDirection: 'column',
	},
	headerContainer: {
		marginBottom: '25px',
	},
	pageTitle: {
		color: APP_CONFIG.mainCollors.primary,
		fontFamily: 'Montserrat-SemiBold',
	},
}));

const EditFeesPadrao = () => {
	const perfilTaxaPadraoId = useSelector((state) => state.perfilTaxaPadraoId);
	const accounts = useSelector((state) => state.contas);
	const [filters, setFilters] = useState({
		like: '',
	});
	const [contaId, setContaId] = useState(perfilTaxaPadraoId.conta_id);
	const [contaSelecionada, setContaSelecionada] = useState('');
	const debouncedLike = useDebounce(filters.like, 800);
	const token = useAuth();
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [tipoTaxa, setTipoTaxa] = useState({
		inBoleto: 1,
		inTed: 1,
		inPix: 1,
		inP2p: 1,
		inWallet: 1,
		outP2p: 1,
		outTed: 1,
		outPix: 1,
		outWallet: 1,
		outPagamentoConta: 1,
	});
	const { id } = useParams();
	const [errors, setErrors] = useState({});
	const [taxa, setTaxa] = useState({
		nome: '',
		cash_in_boleto: '0.00',
		cash_in_pix: '0.00',
		cash_in_p2p: '0.00',
		cash_out_p2p: '0.00',
		cash_out_pix: '0.00',
		cash_in_wallet: '0.00',
		cash_out_wallet: '0.00',
		cash_out_pagamento_conta: '0.00',
	});

	useEffect(() => {
		if (id) {
			const fetch = async () => {
				await dispatch(loadPerfilTaxaPadraoIdAction(token, id));
			};
			fetch();
		}
	}, [id]);

	useEffect(() => {
		dispatch(
			getContasAction(token, 1, debouncedLike, '', 10, '', '', 'approved')
		);
	}, []);

	useEffect(() => {
		setTaxa(perfilTaxaPadraoId);
	}, [perfilTaxaPadraoId]);

	useEffect(() => {
		setTipoTaxa({
			inBoleto: perfilTaxaPadraoId.tipo_cash_in_boleto,
			inTed: perfilTaxaPadraoId.tipo_cash_in_ted,
			inPix: perfilTaxaPadraoId.tipo_cash_in_pix,
			inP2p: perfilTaxaPadraoId.tipo_cash_in_p2p,
			inWallet: perfilTaxaPadraoId.tipo_cash_in_wallet,
			outP2p: perfilTaxaPadraoId.tipo_cash_out_p2p,
			outTed: perfilTaxaPadraoId.tipo_cash_out_ted,
			outPix: perfilTaxaPadraoId.tipo_cash_out_pix,
			outWallet: perfilTaxaPadraoId.tipo_cash_out_wallet,
			outPagamentoConta: perfilTaxaPadraoId.tipo_cash_out_pagamento_conta,
		});
	}, [perfilTaxaPadraoId]);

	const handleAlterar = async () => {
		setLoading(true);
		const res = await dispatch(
			putPerfilTaxaPadraoAction(
				token,

				tipoTaxa.inBoleto,
				isNumber(taxa.cash_in_boleto)
					? taxa.cash_in_boleto
					: parseFloat(taxa.cash_in_boleto),
				tipoTaxa.inPix,
				isNumber(taxa.cash_in_pix)
					? taxa.cash_in_pix
					: parseFloat(taxa.cash_in_pix),
				tipoTaxa.inP2p,
				isNumber(taxa.cash_in_p2p)
					? taxa.cash_in_p2p
					: parseFloat(taxa.cash_in_p2p),
				tipoTaxa.outP2p,
				isNumber(taxa.cash_out_p2p)
					? taxa.cash_out_p2p
					: parseFloat(taxa.cash_out_p2p),
				tipoTaxa.outPix,
				isNumber(taxa.cash_out_pix)
					? taxa.cash_out_pix
					: parseFloat(taxa.cash_out_pix),
				tipoTaxa.inWallet,
				isNumber(taxa.cash_in_wallet)
					? taxa.cash_in_wallet
					: parseFloat(taxa.cash_in_wallet),
				tipoTaxa.outWallet,
				isNumber(taxa.cash_out_wallet)
					? taxa.cash_out_wallet
					: parseFloat(taxa.cash_out_wallet),
				tipoTaxa.outPagamentoConta,
				isNumber(taxa.cash_out_pagamento_conta)
					? taxa.cash_out_pagamento_conta
					: parseFloat(taxa.cash_out_pagamento_conta),
				id,
				contaId
			)
		);
		if (res) {
			setErrors(res);
			toast.error('Erro ao alterar Tarifa');
			setLoading(false);
		} else {
			toast.success('Tarifa alterada com sucesso!');
			history.push('/dashboard/taxa-padrao');
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log(contaId);
	}, [contaId]);

	const options = {
		displayType: 'input',
		thousandSeparator: '.',
		decimalSeparator: ',',
		allowNegative: false,
		isNumericString: true,
		customInput: CustomTextField,
		style: { width: '100%' },
	};

	return (
		<Box className={classes.root}>
			<Box className={classes.headerContainer}>
				<Box style={{ marginBottom: '20px' }}>
					<Typography className={classes.pageTitle}>
						Editar Tarifa Padrão
					</Typography>
				</Box>
			</Box>
			<Paper
				style={{
					alignSelf: 'center',
					justifySelf: 'center',
					maxWidth: 800,
					padding: 50,
					backgroundColor: APP_CONFIG.mainCollors.backgrounds,
				}}
			>
				<Grid container spacing={4}>
					<Grid item xs={12}>
						<Typography
							align="center"
							variant="h5"
							style={{
								fontFamily: 'Montserrat-SemiBold',
							}}
						>
							Insira os dados da tarifa padrão
						</Typography>
					</Grid>
					<Typography
						style={{
							fontFamily: 'Montserrat-SemiBold',
							marginLeft: '15px',

							fontSize: 14,
							fontWeight: 'bold',
						}}
					>
						Selecione a conta que vai receber as transações das taxas
					</Typography>

					<Grid item xs={12} sm={12}>
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
								setContaId(option ? option.id : '');
								setContaSelecionada(
									option?.razao_social
										? option?.razao_social
										: option?.nome
										? option?.nome
										: null
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="outlined"
									placeholder={
										contaId ? perfilTaxaPadraoId?.conta?.nome : ''
									}
									helperText={
										errors?.conta_id ? errors.conta_id.join('') : null
									}
									error={errors?.conta_id ? errors.conta_id : null}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Typography
							style={{
								fontFamily: 'Montserrat-SemiBold',
								marginLeft: '15px',
								marginBottom: '5px',
								fontSize: 14,
								fontWeight: 'bold',
							}}
						>
							Recebimento Boleto
						</Typography>
						<ButtonGroup
							size="small"
							style={{
								marginBottom: '0px',
								marginLeft: '15px',

								fontSize: 5,
							}}
							color="primary"
							aria-label="outlined primary button group"
						>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.inBoleto === 1 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() =>
									setTipoTaxa({ ...tipoTaxa, inBoleto: 1 })
								}
								disabled={tipoTaxa.inBoleto === 1 ? true : false}
							>
								Fixo
							</Button>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.inBoleto === 2 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() =>
									setTipoTaxa({ ...tipoTaxa, inBoleto: 2 })
								}
								disabled={tipoTaxa.inBoleto === 2 ? true : false}
							>
								%
							</Button>
						</ButtonGroup>

						<CurrencyFormat
							{...options}
							prefix={tipoTaxa.inBoleto === 1 ? 'R$ ' : ''}
							suffix={tipoTaxa.inBoleto === 2 ? '%' : ''}
							value={taxa.cash_in_boleto}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_in_boleto: value,
								})
							}
							helperText={
								errors.cash_in_boleto
									? errors.cash_in_boleto.join('')
									: null
							}
							error={errors.cash_in_boleto}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Typography
							style={{
								fontFamily: 'Montserrat-SemiBold',
								marginLeft: '15px',
								marginBottom: '5px',
								fontSize: 14,
								fontWeight: 'bold',
							}}
						>
							Recebimento PIX
						</Typography>
						<ButtonGroup
							size="small"
							style={{ marginBottom: '0px', marginLeft: '15px' }}
							color="primary"
							aria-label="outlined primary button group"
						>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.inPix === 1 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() => setTipoTaxa({ ...tipoTaxa, inPix: 1 })}
								disabled={tipoTaxa.inPix === 1 ? true : false}
							>
								Fixo
							</Button>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.inPix === 2 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() => setTipoTaxa({ ...tipoTaxa, inPix: 2 })}
								disabled={tipoTaxa.inPix === 2 ? true : false}
							>
								%
							</Button>
						</ButtonGroup>
						<CurrencyFormat
							{...options}
							prefix={tipoTaxa.inPix === 1 ? 'R$ ' : ''}
							suffix={tipoTaxa.inPix === 2 ? '%' : ''}
							value={taxa.cash_in_pix}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_in_pix: value,
								})
							}
							helperText={
								errors.cash_in_pix ? errors.cash_in_pix.join('') : null
							}
							error={errors.cash_in_pix}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography
							style={{
								fontFamily: 'Montserrat-SemiBold',
								marginLeft: '15px',
								marginBottom: '5px',
								fontSize: 14,
								fontWeight: 'bold',
							}}
						>
							Recebimento P2P
						</Typography>
						<ButtonGroup
							size="small"
							style={{ marginBottom: '0px', marginLeft: '15px' }}
							color="primary"
							aria-label="outlined primary button group"
						>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.inP2p === 1 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() => setTipoTaxa({ ...tipoTaxa, inP2p: 1 })}
								disabled={tipoTaxa.inP2p === 1 ? true : false}
							>
								Fixo
							</Button>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.inP2p === 2 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() => setTipoTaxa({ ...tipoTaxa, inP2p: 2 })}
								disabled={tipoTaxa.inP2p === 2 ? true : false}
							>
								%
							</Button>
						</ButtonGroup>
						<CurrencyFormat
							{...options}
							prefix={tipoTaxa.inP2p === 1 ? 'R$ ' : ''}
							suffix={tipoTaxa.inP2p === 2 ? '%' : ''}
							value={taxa.cash_in_p2p}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_in_p2p: value,
								})
							}
							helperText={
								errors.cash_in_p2p ? errors.cash_in_p2p.join('') : null
							}
							error={errors.cash_in_p2p}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography
							style={{
								fontFamily: 'Montserrat-SemiBold',
								marginLeft: '15px',
								marginBottom: '5px',
								fontSize: 14,
								fontWeight: 'bold',
							}}
						>
							Transferência P2P
						</Typography>
						<ButtonGroup
							size="small"
							style={{ marginBottom: '0px', marginLeft: '15px' }}
							color="primary"
							aria-label="outlined primary button group"
						>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.outP2p === 1 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() => setTipoTaxa({ ...tipoTaxa, outP2p: 1 })}
								disabled={tipoTaxa.outP2p === 1 ? true : false}
							>
								Fixo
							</Button>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.outP2p === 2 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() => setTipoTaxa({ ...tipoTaxa, outP2p: 2 })}
								disabled={tipoTaxa.outP2p === 2 ? true : false}
							>
								%
							</Button>
						</ButtonGroup>
						<CurrencyFormat
							{...options}
							prefix={tipoTaxa.outP2p === 1 ? 'R$ ' : ''}
							suffix={tipoTaxa.outP2p === 2 ? '%' : ''}
							value={taxa.cash_out_p2p}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_out_p2p: value,
								})
							}
							helperText={
								errors.cash_out_p2p
									? errors.cash_out_p2p.join('')
									: null
							}
							error={errors.cash_out_p2p}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Typography
							style={{
								fontFamily: 'Montserrat-SemiBold',
								marginLeft: '15px',
								marginBottom: '5px',
								fontSize: 14,
								fontWeight: 'bold',
							}}
						>
							Transferência Pix
						</Typography>
						<ButtonGroup
							size="small"
							style={{ marginBottom: '0px', marginLeft: '15px' }}
							color="primary"
							aria-label="outlined primary button group"
						>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.outPix === 1 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() => setTipoTaxa({ ...tipoTaxa, outPix: 1 })}
								disabled={tipoTaxa.outPix === 1 ? true : false}
							>
								Fixo
							</Button>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.outPix === 2 ? 'black' : '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() => setTipoTaxa({ ...tipoTaxa, outPix: 2 })}
								disabled={tipoTaxa.outPix === 2 ? true : false}
							>
								%
							</Button>
						</ButtonGroup>
						<CurrencyFormat
							{...options}
							prefix={tipoTaxa.outPix === 1 ? 'R$ ' : ''}
							suffix={tipoTaxa.outPix === 2 ? '%' : ''}
							value={taxa.cash_out_pix}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_out_pix: value,
								})
							}
							helperText={
								errors.cash_out_pix
									? errors.cash_out_pix.join('')
									: null
							}
							error={errors.cash_out_pix}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography
							style={{
								fontFamily: 'Montserrat-SemiBold',
								marginLeft: '15px',
								marginBottom: '5px',
								fontSize: 14,
								fontWeight: 'bold',
								color: APP_CONFIG.mainCollors.primary,
							}}
						>
							Transferência Wallet Recebida
						</Typography>
						<ButtonGroup
							size="small"
							style={{
								marginBottom: '0px',
								marginLeft: '15px',

								fontSize: 5,
							}}
							color="primary"
							aria-label="outlined primary button group"
						>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.inWallet === 1
											? APP_CONFIG.mainCollors.primary
											: '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() =>
									setTipoTaxa({ ...tipoTaxa, inWallet: 1 })
								}
								disabled={tipoTaxa.inWallet === 1 ? true : false}
							>
								Fixo
							</Button>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.inWallet === 2
											? APP_CONFIG.mainCollors.primary
											: '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() =>
									setTipoTaxa({ ...tipoTaxa, inWallet: 2 })
								}
								disabled={tipoTaxa.inWallet === 2 ? true : false}
							>
								%
							</Button>
						</ButtonGroup>
						<CurrencyFormat
							variant="outlined"
							{...options}
							prefix={tipoTaxa.inWallet === 1 ? 'R$ ' : ''}
							suffix={tipoTaxa.inWallet === 2 ? '%' : ''}
							value={taxa.cash_in_wallet}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_in_wallet: value,
								})
							}
							helperText={
								errors.cash_in_wallet ? errors.cash_in_wallet[0] : null
							}
							error={errors.cash_in_wallet}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography
							style={{
								fontFamily: 'Montserrat-SemiBold',
								marginLeft: '15px',
								marginBottom: '5px',
								fontSize: 14,
								fontWeight: 'bold',
								color: APP_CONFIG.mainCollors.primary,
							}}
						>
							Transferência Wallet Efetuada
						</Typography>
						<ButtonGroup
							size="small"
							style={{
								marginBottom: '0px',
								marginLeft: '15px',

								fontSize: 5,
							}}
							color="primary"
							aria-label="outlined primary button group"
						>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.outWallet === 1
											? APP_CONFIG.mainCollors.primary
											: '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() =>
									setTipoTaxa({ ...tipoTaxa, outWallet: 1 })
								}
								disabled={tipoTaxa.outWallet === 1 ? true : false}
							>
								Fixo
							</Button>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.outWallet === 2
											? APP_CONFIG.mainCollors.primary
											: '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() =>
									setTipoTaxa({ ...tipoTaxa, outWallet: 2 })
								}
								disabled={tipoTaxa.outWallet === 2 ? true : false}
							>
								%
							</Button>
						</ButtonGroup>
						<CurrencyFormat
							variant="outlined"
							{...options}
							prefix={tipoTaxa.outWallet === 1 ? 'R$ ' : ''}
							suffix={tipoTaxa.outWallet === 2 ? '%' : ''}
							value={taxa.cash_out_wallet}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_out_wallet: value,
								})
							}
							helperText={
								errors.cash_out_wallet
									? errors.cash_out_wallet[0]
									: null
							}
							error={errors.cash_out_wallet}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography
							style={{
								fontFamily: 'Montserrat-SemiBold',
								marginLeft: '15px',
								marginBottom: '5px',
								fontSize: 14,
								fontWeight: 'bold',
								color: APP_CONFIG.mainCollors.primary,
							}}
						>
							Pagamento de Conta
						</Typography>
						<ButtonGroup
							size="small"
							style={{
								marginBottom: '0px',
								marginLeft: '15px',

								fontSize: 5,
							}}
							color="primary"
							aria-label="outlined primary button group"
						>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.outPagamentoConta === 1
											? APP_CONFIG.mainCollors.primary
											: '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() =>
									setTipoTaxa({ ...tipoTaxa, outPagamentoConta: 1 })
								}
								disabled={
									tipoTaxa.outPagamentoConta === 1 ? true : false
								}
							>
								Fixo
							</Button>
							<Button
								style={{
									backgroundColor: `${
										tipoTaxa.outPagamentoConta === 2
											? APP_CONFIG.mainCollors.primary
											: '#cfcfcf'
									}`,
									color: 'white',
								}}
								onClick={() =>
									setTipoTaxa({ ...tipoTaxa, outPagamentoConta: 2 })
								}
								disabled={
									tipoTaxa.outPagamentoConta === 2 ? true : false
								}
							>
								%
							</Button>
						</ButtonGroup>
						<CurrencyFormat
							variant="outlined"
							{...options}
							prefix={tipoTaxa.outPagamentoConta === 1 ? 'R$ ' : ''}
							suffix={tipoTaxa.outPagamentoConta === 2 ? '%' : ''}
							value={taxa.cash_out_pagamento_conta}
							onValueChange={({ value }) =>
								setTaxa({
									...taxa,
									cash_out_pagamento_conta: value,
								})
							}
							helperText={
								errors.cash_out_pagamento_conta
									? errors.cash_out_pagamento_conta[0]
									: null
							}
							error={errors.cash_out_pagamento_conta}
						/>
					</Grid>
					<Grid item xs={12}>
						<Box
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<CustomButton color="black" onClick={handleAlterar}>
								Editar
							</CustomButton>
						</Box>
					</Grid>
				</Grid>
			</Paper>
			<LoadingScreen isLoading={loading} />
		</Box>
	);
};

export default EditFeesPadrao;
