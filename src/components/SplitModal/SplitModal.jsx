import {
	Box,
	Dialog,
	DialogTitle,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import CurrencyInput from 'react-currency-input';
import CustomButton from '../CustomButton/CustomButton';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { postSplitAction } from '../../actions/actions';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	UserInfosContainer: {
		width: '40%',
		display: 'flex',
		flexDirection: 'column',
		color: theme.palette.primary.main,
	},
	userContentsContainer: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#ddf0f4',
		padding: '8px',
		borderRadius: '27px',
	},
	userContentItem: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme.palette.background.paper,
		padding: '12px',
		margin: '8px',
		borderRadius: '27px',
	},
	SplitModal: {
		padding: '20px',
	},
	saqueHeader: {
		background: theme.gradient.main,
		color: 'white',
	},
	currency: {
		font: 'inherit',
		color: 'currentColor',
		width: '100%',
		border: '0px',
		borderBottom: '1px solid gray',
		height: '1.1876em',
		margin: 0,
		display: 'block',
		padding: '6px 0 7px',
		minWidth: 0,
		background: 'none',
		boxSizing: 'content-box',
		animationName: 'mui-auto-fill-cancel',
		letterSpacing: 'inherit',
		animationDuration: '10ms',
		appearance: 'textfield',
		textAlign: 'start',
		paddingLeft: '5px',
	},
}));

const SplitModal = ({ open, onClose, selectedValue, row, contasUser }) => {
	// modal do saque
	const token = useAuth();
	const classes = useStyles();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [errosSplit, setErrosSplit] = useState({});

	const [transacaoInfos, setTransacaoInfos] = useState({
		cobranca_boleto_ou_cartao_id: '',
		conta_id: '',
		porcentagem: 0,
		valor: 0,
		responsavel_pelo_prejuizo: false,
		usar_valor_liquido: false,
	});

	useEffect(() => {
		setTransacaoInfos({
			...transacaoInfos,
			cobranca_boleto_ou_cartao_id: row.id,
		});
	}, [row.id]);

	const [tipoSplit, setTipoSplit] = useState('valor');
	const handleClose = () => {
		onClose(selectedValue);
	};
	const handleSplit = async () => {
		setLoading(true);
		const resSplit = await dispatch(postSplitAction(token, transacaoInfos));

		if (resSplit) {
			setErrosSplit(resSplit);
			setLoading(false);
		} else {
			toast.success('Valor repartido com sucesso!');
			handleClose();
			setLoading(false);
		}
	};
	return (
		<Dialog onClose={handleClose} open={open} className={classes.SplitModal}>
			<Box width="500px">
				<LoadingScreen isLoading={loading} />
				<DialogTitle className={classes.saqueHeader}>
					<Typography align="center" variant="h6">
						Repartir valor
					</Typography>
				</DialogTitle>
				<Box display="flex" flexDirection="column" padding="12px 24px">
					<Box display="flex" flexDirection="column">
						<Box margin="6px 0">
							<FormControl
								fullWidth
								error={errosSplit.valor || errosSplit.porcentagem}
							>
								<InputLabel>Tipo de repartição</InputLabel>
								<Select
									style={{ color: APP_CONFIG.mainCollors.secondary }}
									fullWidth
									value={tipoSplit}
									onChange={(e) => {
										setTipoSplit(e.target.value);
										setTransacaoInfos({
											...transacaoInfos,
											valor: 0,
											porcentagem: 0,
										});
									}}
								>
									<MenuItem
										value="valor"
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Valor
									</MenuItem>
									<MenuItem
										value="porcentagem"
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Porcentagem
									</MenuItem>
								</Select>
							</FormControl>
						</Box>

						{tipoSplit === 'valor' ? (
							<Box margin="6px 0">
								<FormControl fullWidth error={errosSplit.valor}>
									<Typography
										style={{
											alignSelf: 'center',
										}}
									>
										Valor a ser repartido
									</Typography>
									<CurrencyInput
										className={classes.currency}
										decimalSeparator=","
										thousandSeparator="."
										prefix="R$ "
										value={transacaoInfos.valor}
										onChangeEvent={(event, maskedvalue, floatvalue) =>
											setTransacaoInfos({
												...transacaoInfos,
												valor: floatvalue,
											})
										}
										style={{
											marginBottom: '6px',
											width: '60%',
											alignSelf: 'center',
										}}
									/>
									<FormHelperText
										style={{
											marginBottom: '6px',
											width: '60%',
											alignSelf: 'center',
										}}
									>
										{errosSplit.valor
											? errosSplit.valor.join(' ')
											: null}
									</FormHelperText>
								</FormControl>
							</Box>
						) : (
							<Box margin="6px 0">
								<FormControl fullWidth error={errosSplit.porcentagem}>
									<Typography
										style={{
											alignSelf: 'center',
										}}
									>
										Porcentagem a ser repartida
									</Typography>
									<CurrencyInput
										className={classes.currency}
										decimalSeparator=","
										thousandSeparator="."
										suffix=" %"
										value={transacaoInfos.porcentagem}
										onChangeEvent={(event, maskedvalue, floatvalue) =>
											setTransacaoInfos({
												...transacaoInfos,
												porcentagem: floatvalue,
											})
										}
										style={{
											marginBottom: '6px',
											width: '60%',
											alignSelf: 'center',
										}}
									/>
									<FormHelperText
										style={{
											marginBottom: '6px',
											width: '60%',
											alignSelf: 'center',
										}}
									>
										{errosSplit.porcentagem
											? errosSplit.porcentagem.join(' ')
											: null}
									</FormHelperText>
								</FormControl>
							</Box>
						)}

						<Box margin="6px 0">
							<InputLabel>Responsável pelo prejuizo ?</InputLabel>
							<Select
								style={{ color: APP_CONFIG.mainCollors.secondary }}
								fullWidth
								value={transacaoInfos.responsavel_pelo_prejuizo}
								onChange={(e) =>
									setTransacaoInfos({
										...transacaoInfos,
										responsavel_pelo_prejuizo: e.target.value,
									})
								}
							>
								<MenuItem
									value={true}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Sim
								</MenuItem>
								<MenuItem
									value={false}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Não
								</MenuItem>
							</Select>
						</Box>
						<Box margin="6px 0">
							<InputLabel>Usar valor líquido ?</InputLabel>
							<Select
								style={{ color: APP_CONFIG.mainCollors.secondary }}
								fullWidth
								value={transacaoInfos.usar_valor_liquido}
								onChange={(e) =>
									setTransacaoInfos({
										...transacaoInfos,
										usar_valor_liquido: e.target.value,
									})
								}
							>
								<MenuItem
									value={true}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Sim
								</MenuItem>
								<MenuItem
									value={false}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Não
								</MenuItem>
							</Select>
						</Box>
					</Box>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="center"
						marginTop="20px"
					>
						<Typography variant="h6">Escolha a conta</Typography>
						<FormControl fullWidth error={errosSplit.conta_id}>
							<InputLabel>Conta</InputLabel>
							<Select
								style={{ color: APP_CONFIG.mainCollors.secondary }}
								fullWidth
								value={transacaoInfos.conta_id}
								onChange={(e) =>
									setTransacaoInfos({
										...transacaoInfos,
										conta_id: e.target.value,
									})
								}
							>
								{contasUser
									? contasUser.map((conta) => {
											return (
												<MenuItem key={conta.id} value={conta.id}>
													{conta.nome}
												</MenuItem>
											);
									  })
									: null}
							</Select>
							<FormHelperText
								style={{
									marginBottom: '6px',
									width: '60%',
									alignSelf: 'center',
								}}
							>
								{errosSplit.conta_id
									? errosSplit.conta_id.join(' ')
									: null}
							</FormHelperText>
						</FormControl>
					</Box>

					<Box alignSelf="flex-end" margin="6px 0">
						<CustomButton buttonText="Repartir" onClick={handleSplit} />
					</Box>
				</Box>
			</Box>
		</Dialog>
	);
};

export default SplitModal;
