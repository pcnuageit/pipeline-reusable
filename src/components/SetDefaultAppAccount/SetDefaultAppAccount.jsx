import React, { useEffect } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	Divider,
	makeStyles,
	Typography,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { APP_CONFIG } from '../../constants/config';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import {
	getContaPadraoAction,
	postSetContaPadraoAction,
} from '../../actions/actions';

const useStyles = makeStyles((theme) => ({
	dialogHeader: {
		background: APP_CONFIG.mainCollors.primary,
		color: 'white',
	},
}));

const SetDefaultAppAccount = ({
	openDialog,
	setOpenDialog,
	isLoading,
	setIsLoading,
}) => {
	const classes = useStyles();
	const defaultAccount = useSelector((state) => state.contaPadrao);
	const dispatch = useDispatch();
	const token = useAuth();

	useEffect(() => {
		dispatch(getContaPadraoAction(token));
	}, []);

	const handleSetDefaultAppAccount = async () => {
		setIsLoading(true);
		const resCriarTaxaPadrao = await dispatch(
			postSetContaPadraoAction(token, null)
		);
		if (resCriarTaxaPadrao) {
			toast.error('Erro ao definir conta padrão da aplicação!');
			setOpenDialog(false);
			setIsLoading(true);
		} else {
			toast.success('Conta padrão da aplicação definida!');
			setOpenDialog(false);
			setIsLoading(true);
		}
	};

	return (
		<Dialog
			open={openDialog}
			onClose={() => setOpenDialog(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			style={{ zIndex: 1000 }}
		>
			<Box width="600px">
				<DialogTitle className={classes.dialogHeader}>
					<Typography align="center" variant="h6">
						Conta Padrão da Aplicação
					</Typography>
				</DialogTitle>

				{defaultAccount && (
					<Box
						display="flex"
						alignItems="center"
						flexDirection="column"
						flexWrap="wrap"
						padding="6px 16px"
					>
						<Box>
							<Typography>Conta padrão atual:</Typography>
							<Typography variant="h6">
								{defaultAccount.razao_social ?? defaultAccount.nome}
							</Typography>
							<Typography>Documento:</Typography>
							<Typography variant="h6">
								{defaultAccount.cnpj ?? defaultAccount.documento}
							</Typography>
						</Box>
					</Box>
				)}

				<Box padding="6px 16px">
					<Divider />
				</Box>

				<Box display="flex" flexDirection="column" padding="6px 16px">
					<Typography align="center">
						Escolha um EC para defini-lo como conta padrão da aplicação!
					</Typography>

					<Typography
						align="center"
						style={{ margin: '20px', color: 'red' }}
					>
						Todos os MDRs da aplicação, são distribuidos para essa conta!
					</Typography>

					<DialogActions>
						<Button
							onClick={handleSetDefaultAppAccount}
							variant="outlined"
							color="default"
						>
							Definir
						</Button>
						<Button
							onClick={() => setOpenDialog(false)}
							color="default"
							variant="outlined"
							autoFocus
						>
							Cancelar
						</Button>
					</DialogActions>
				</Box>
			</Box>
		</Dialog>
	);
};

export default SetDefaultAppAccount;
