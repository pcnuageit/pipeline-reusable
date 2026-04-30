import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import { clearTransacao, loadTransacaoId } from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import TransactionDetailsCard from './TransactionDetailsCard/TransactionDetailsCard';
import TransactionDetailsCommission from './TransactionDetailsCommission/TransactionDetailsCommission';
import TransactionDetailsSlip from './TransactionDetailsSlip/TransactionDetailsSlip';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router';
import { APP_CONFIG } from '../../constants/config';

const TransactionDetails = () => {
	const token = useAuth();
	const dispatch = useDispatch();
	const { id, subsectionId } = useParams();
	const transacaoId = useSelector((state) => state.transacao);

	useEffect(() => {
		dispatch(loadTransacaoId(token, subsectionId ? subsectionId : id));
	}, [subsectionId, id]);

	useEffect(() => {
		return () => {
			dispatch(clearTransacao());
		};
	}, []);

	if (transacaoId === undefined || transacaoId.id === undefined) {
		return (
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				style={{ position: 'absolute' }}
			>
				<CircularProgress />
			</Box>
		);
	} else {
		const tipo = transacaoId.transaction.payment_type;
		if (tipo === 'boleto') {
			return (
				<Box style={{ position: 'absolute' }}>
					<TransactionDetailsSlip transacaoId={transacaoId} />
				</Box>
			);
		}
		if (tipo === 'credit' || tipo === 'debit') {
			return (
				<Box style={{ position: 'absolute' }}>
					<TransactionDetailsCard transacaoId={transacaoId} />;
				</Box>
			);
		}
		if (tipo === 'commission') {
			return (
				<Box style={{ position: 'absolute' }}>
					<TransactionDetailsCommission transacaoId={transacaoId} />;
				</Box>
			);
		}
		if (tipo === 'pix') {
			return (
				<Box style={{ position: 'absolute' }}>
					<TransactionDetailsCommission transacaoId={transacaoId} />;
				</Box>
			);
		} else {
			return (
				<Box
					style={{
						width: '300px',
						height: '200px',
						backgroundColor: 'red',
					}}
				/>
			);
		}
	}
};

export default TransactionDetails;
