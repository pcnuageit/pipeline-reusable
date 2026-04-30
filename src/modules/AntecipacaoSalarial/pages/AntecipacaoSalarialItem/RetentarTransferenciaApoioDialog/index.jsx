import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRetryAntecipacaoSalarialTransferMutation } from '../../../services/AntecipacaoSalarial';

function RetentarTransferenciaApoioDialog({
	open = false,
	onClose = () => {},
	financialSupport,
}) {
	const [retryFinancialSupportTransfer] =
		useRetryAntecipacaoSalarialTransferMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await retryFinancialSupportTransfer({
				id: financialSupport.id,
			}).unwrap();
			toast.success('Transferência realizada com sucesso!');
			onClose();
		} catch (e) {
			toast.error('Não foi possível efetuar a transferência!');
			if (e.status === 401 && e.data?.message) {
				return toast.error(e.data.message);
			}
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
			<DialogTitle
				style={{
					paddingBottom: 0,
				}}
			>
				Transferência do Antecipação Salarial
			</DialogTitle>
			<DialogContent
				style={{
					paddingTop: 0,
					minWidth: 500,
				}}
			>
				<Typography>
					{`Deseja realizar a tranferência do Antecipação Salarial ${financialSupport.proposta.nome} novamente para este EC?`}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={onClose}>
					Cancelar
				</Button>
				<Button
					disabled={isSubmitting}
					variant="outlined"
					color="primary"
					onClick={handleSubmit}
				>
					Reativar
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default RetentarTransferenciaApoioDialog;
