import {
	Box,
	Button,
	Divider,
	LinearProgress,
	Paper,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { faCalendarAlt, faCopy } from '@fortawesome/free-solid-svg-icons';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import CustomBreadcrumbs from '../../../components/CustomBreadcrumbs/CustomBreadcrumbs';
import CustomTable from '../../../components/CustomTable/CustomTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { APP_CONFIG } from '../../../constants/config';

const columns = [
	{
		headerText: 'Criado em',
		key: 'transaction.created_at',
		CustomValue: (data) => {
			if (data) {
				const p = data.split(/\D/g);
				const dataFormatada = [p[2], p[1], p[0]].join('/');
				return (
					<Box display="flex" justifyContent="center">
						<FontAwesomeIcon icon={faCalendarAlt} size="lg" />
						<Typography style={{ marginLeft: '6px' }}>
							{dataFormatada}
						</Typography>
					</Box>
				);
			}
		},
	},
	{
		headerText: 'Situação',
		key: 'transaction.status',
		CustomValue: (status) => {
			if (status === 'succeeded') {
				return (
					<Typography
						style={{
							color: 'green',
						}}
					>
						SUCESSO
					</Typography>
				);
			}
			if (status === 'failed') {
				return (
					<Typography
						style={{
							color: 'red',
						}}
					>
						FALHADA
					</Typography>
				);
			}
			if (status === 'canceled') {
				return (
					<Typography
						style={{
							color: 'red',
						}}
					>
						CANCELADA
					</Typography>
				);
			}
			if (status === 'pending') {
				return (
					<Typography
						style={{
							color: '#dfad06',
						}}
					>
						PENDENTE
					</Typography>
				);
			}
			if (status === 'new') {
				return (
					<Typography
						style={{
							color: 'green',
						}}
					>
						NOVO
					</Typography>
				);
			}
			if (status === 'pre_authorized') {
				return (
					<Typography
						style={{
							color: '#dfad06',
						}}
					>
						PRÉ-AUTORIZADO
					</Typography>
				);
			}
			if (status === 'reversed') {
				return (
					<Typography
						style={{
							color: '',
						}}
					>
						REVERTIDO
					</Typography>
				);
			}
			if (status === 'refunded') {
				return (
					<Typography
						style={{
							color: '',
						}}
					>
						REEMBOLSADO
					</Typography>
				);
			}
			if (status === 'dispute') {
				return (
					<Typography
						style={{
							color: '',
						}}
					>
						DISPUTA
					</Typography>
				);
			}
			if (status === 'charged_back ') {
				return (
					<Typography
						style={{
							color: '',
						}}
					>
						DEBITADO
					</Typography>
				);
			}
		},
	},
	{
		headerText: 'Valor',
		key: 'transaction.amount',
		CustomValue: (amount) => {
			if (amount < 0) {
				return (
					<Typography
						variant=""
						style={{ fontSize: 17, fontWeight: 600, color: 'red' }}
					>
						R$ {amount}
					</Typography>
				);
			} else {
				return (
					<Typography
						variant=""
						style={{ fontSize: 17, fontWeight: 600, color: 'green' }}
					>
						R$ {amount}
					</Typography>
				);
			}
		},
	},
];

const TransactionDetailsCommission = ({ transacaoId }) => {
	const { transaction, conta } = transacaoId;
	const [arrayObjetos] = useState([transacaoId]);
	const [background, setBackground] = useState('');
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		if (transaction.status === 'succeeded') {
			setBackground('green');
		}
		if (transaction.status === 'failed') {
			setBackground('red');
		}
		if (transaction.status === 'canceled') {
			setBackground('red');
		}
		if (transaction.status === 'pending') {
			setBackground('#dfad06');
		}
		if (transaction.status === 'new') {
			setBackground('green');
		}
		if (transaction.status === 'pre_authorized') {
			setBackground('#dfad06');
		}

		if (transaction.status === 'reversed') {
			setBackground('red');
		}
		if (transaction.status === 'refunded') {
			setBackground('red');
		}
		if (transaction.status === 'dispute') {
			setBackground('red');
		}
		if (transaction.status === 'charged_back ') {
			setBackground('red');
		}
	}, [transaction.status]);

	return (
		<Box display="flex" flexDirection="column">
			<Paper
				style={{
					padding: '24px',
					margin: '12px 0',

					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Typography variant="h4"> Detalhes da Transação </Typography>

				<Box
					display="flex"
					marginTop="12px"
					style={matches ? { flexDirection: 'column' } : null}
				>
					<Box
						display="flex"
						flexDirection="column"
						style={{ width: '100%' }}
					>
						{transacaoId.created_at === undefined ? (
							<LinearProgress />
						) : (
							<CustomTable data={arrayObjetos} columns={columns} />
						)}
					</Box>

					<Box
						display="flex"
						flexDirection="column"
						style={{ marginLeft: '20px', width: '100%' }}
					>
						<Box
							style={{
								padding: '12px',
								borderRadius: '15px 15px 0 0 ',

								backgroundColor: background,
								color: 'white',
							}}
						>
							<Box>
								<Typography variant="h6" align="center">
									{transaction.payment_type === 'pix'
										? 'Pix'
										: 'Comissão'}
								</Typography>
							</Box>
						</Box>
						<Box display="flex" marginTop="6px" flexDirection="column">
							<Box>
								<Typography variant="h6">
									Valor: R${transaction.amount}
								</Typography>
							</Box>
							<Box display="flex" alignItems="center" width="100%">
								{transaction.transaction_number ? (
									<Box width="100%" display="flex" alignItems="center">
										<Typography variant="h6">
											Código de autorização:
											<br />
											<TextField
												fullWidth
												style={{ width: '60%' }}
												value={transaction.transaction_number}
											/>
											<Tooltip title="Copiar">
												<CopyToClipboard>
													<Button
														aria="Copiar"
														style={{
															marginLeft: '6px',
															width: '60px',
															height: '20px',
															alignSelf: 'center',
															color: 'green',
														}}
														onClick={() =>
															toast.success(
																'Copiado para area de transferência',
																{
																	autoClose: 2000,
																}
															)
														}
													>
														<FontAwesomeIcon
															style={{
																width: '60px',
																height: '20px',
															}}
															icon={faCopy}
														/>
													</Button>
												</CopyToClipboard>
											</Tooltip>
										</Typography>
									</Box>
								) : null}
							</Box>

							<Box
								display="flex"
								alignContent="center"
								marginTop="12px"
								style={matches ? { flexDirection: 'column' } : null}
							>
								<Typography variant="h6">
									ID da transação: <br />
									<TextField value={transaction.id} />
									<Tooltip title="Copiar">
										<CopyToClipboard text={transaction.id}>
											<Button
												aria="Copiar"
												style={{
													marginLeft: '6px',
													width: '60px',
													height: '20px',
													alignSelf: 'center',
													color: 'green',
												}}
												onClick={() =>
													toast.success(
														'Copiado para area de transferência',
														{
															autoClose: 2000,
														}
													)
												}
											>
												<FontAwesomeIcon
													style={{
														width: '60px',
														height: '20px',
													}}
													icon={faCopy}
												/>
											</Button>
										</CopyToClipboard>
									</Tooltip>
								</Typography>
							</Box>
							<Divider style={{ margin: '6px' }} />
							<Typography variant="h6" align="center">
								Conta
							</Typography>
							<Box>
								<Typography>Razao Social:</Typography>
								<Typography variant="h6">
									{conta.razao_social ? conta.razao_social : '-'}
								</Typography>

								<Typography>Nome:</Typography>
								<Typography variant="h6">
									{conta.nome ? conta.nome : '-'}
								</Typography>
								<Typography>Documento:</Typography>
								<Typography variant="h6">
									{conta.documento !== '..-' ? conta.documento : '-'}
								</Typography>
								<Typography>Cnpj:</Typography>
								<Typography variant="h6">
									{conta.cnpj ? conta.cnpj : '-'}
								</Typography>
								<Typography>E-mail:</Typography>
								<Typography variant="h6">
									{conta.email ? conta.email : '-'}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};

export default TransactionDetailsCommission;
