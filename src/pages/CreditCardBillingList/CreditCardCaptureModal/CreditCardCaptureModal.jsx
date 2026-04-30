import {
	Box,
	Dialog,
	DialogTitle,
	TextField,
	Typography,
	makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';

import CurrencyInput from 'react-currency-input';
import GradientButton from '../../../components/CustomButton/CustomButton';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import { postCapturaCobrancaAction } from '../../../actions/actions';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { APP_CONFIG } from '../../../constants/config';

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
	saqueModal: {
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
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const CreditCardCaptureModal = ({ open, onClose, selectedValue, row }) => {
	const token = useAuth();
	const classes = useStyles();

	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [captura, setCaptura] = useState({
		valor: 0,
	});

	const handleClose = () => {
		onClose(selectedValue);
	};

	const handleCaptura = async () => {
		setLoading(true);
		if (row.status === 'Pago') {
			toast.error('Cobrança já capturada');
			onClose(selectedValue);
		} else {
			const resCaptura = await dispatch(
				postCapturaCobrancaAction(token, row.id, captura.valor)
			);
			if (resCaptura) {
				toast.error('Erro ao capturar');
				setLoading(false);
			} else {
				toast.success('Captura realizada com sucesso!');
				setLoading(false);
				onClose(selectedValue);
			}
		}
	};

	return (
		<>
			<LoadingScreen isLoading={loading} />
			<Dialog
				onClose={handleClose}
				open={open}
				className={classes.saqueModal}
			>
				<Box width="500px">
					<DialogTitle className={classes.saqueHeader}>
						<Typography align="center" variant="h6">
							Realizar Captura
						</Typography>
					</DialogTitle>
					<Box display="flex" flexDirection="column" padding="24px">
						<Box display="flex" flexDirection="column">
							<TextField
								disabled
								fullWidth
								InputLabelProps={{ shrink: true }}
								label="Valor da cobrança"
								value={'R$ ' + row.valor}
								style={{
									marginBottom: '6px',
									width: '60%',
									alignSelf: 'center',
								}}
							/>

							<Typography
								style={{
									alignSelf: 'center',
								}}
							>
								Valor da Captura
							</Typography>
							<CurrencyInput
								className={classes.currency}
								decimalSeparator=","
								thousandSeparator="."
								prefix="R$ "
								value={captura.valor}
								onChangeEvent={(event, maskedvalue, floatvalue) =>
									setCaptura({
										...captura,
										valor: floatvalue,
									})
								}
								style={{
									marginBottom: '6px',
									width: '60%',
									alignSelf: 'center',
								}}
							/>

							<Box alignSelf="center" marginTop="6px">
								<GradientButton
									buttonText="Capturar"
									onClick={handleCaptura}
								/>
							</Box>
						</Box>
					</Box>
				</Box>
			</Dialog>
		</>
	);
};

export default CreditCardCaptureModal;
