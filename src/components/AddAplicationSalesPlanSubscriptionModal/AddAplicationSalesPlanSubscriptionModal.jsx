import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	makeStyles,
	TextField,
	Typography,
} from '@material-ui/core';
import { toast } from 'react-toastify';

import { Autocomplete } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import {
	getContasAction,
	postAssinaturaPlanoVendasAction,
} from '../../actions/actions';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	dialogHeader: {
		background: APP_CONFIG.mainCollors.primary,
		color: 'white',
	},
}));

const AddAplicationSalesPlanSubscriptionModal = ({
	openDialog,
	setOpenDialog,
	refetchSubscriptions,
	refetchSalesPlan,
	planId,
	isLoading,
	setIsLoading,
}) => {
	const classes = useStyles();
	const token = useAuth();
	const dispatch = useDispatch();
	const [accountId, setAccountId] = useState({});
	const [filters, setFilters] = useState({
		like: '',
	});
	const debouncedLike = useDebounce(filters.like, 800);
	const { data: contas } = useSelector((state) => state.contas);

	useEffect(() => {
		dispatch(
			getContasAction(
				token,
				'',
				debouncedLike,
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				true,
				''
			)
		);
	}, [debouncedLike]);

	/* const {
    data: contas,
  } = useIndexAllAccountsQuery(
    {
      like: debouncedLike,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  ); */

	/*  const handleAddEcSubscription = async () => {
    setIsLoading(true);
    try {
      await addEcSubscription({
        conta_id: accountId,
        plano_venda_id: planId,
      }).unwrap();
      toast.success("EC adicionado ao Plano de Venda!");
    } catch (e) {
      toast.error("Erro ao adicionar EC ao Plano de Venda!");
    } finally {
      refetchSubscriptions();
      refetchSalesPlan();
      setOpenDialog(false);
      setIsLoading(false);
    }
  }; */

	const handleAddEcSubscription = async () => {
		setIsLoading(true);
		const resPostAssinatura = await dispatch(
			postAssinaturaPlanoVendasAction(token, accountId, planId)
		);
		if (resPostAssinatura) {
			toast.error('Erro ao adicionar EC ao Plano de Venda!');
			setIsLoading(false);
			setOpenDialog(false);
		} else {
			toast.success('EC adicionado ao Plano de Venda!');
			setIsLoading(false);
			setOpenDialog(false);
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
						Adicionar assinatura
					</Typography>
				</DialogTitle>

				<Box
					display="flex"
					flexDirection="column"
					padding="6px 16px"
					style={{ backgroundColor: APP_CONFIG.mainCollors.backgrounds }}
				>
					<Typography>Escolha um EC para este Plano de Venda</Typography>

					<Autocomplete
						freeSolo
						fullWidth
						options={contas?.data}
						getOptionLabel={(conta) => conta.razao_social ?? conta.nome}
						onInputChange={(_event, value, reason) => {
							if (reason !== 'reset') {
								setFilters({ ...filters, like: value });
								setAccountId(null);
							}
						}}
						onChange={(_event, option) => {
							setAccountId(option ? option.id : null);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Escolher EC"
								margin="normal"
								variant="outlined"
							/>
						)}
					/>

					<DialogActions>
						<Button
							onClick={handleAddEcSubscription}
							variant="outlined"
							color="default"
							disabled={accountId === null}
						>
							Adicionar
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

export default AddAplicationSalesPlanSubscriptionModal;
