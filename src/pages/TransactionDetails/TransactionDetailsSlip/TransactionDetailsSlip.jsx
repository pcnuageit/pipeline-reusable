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
import {
	faBarcode,
	faCalendarAlt,
	faCopy,
} from '@fortawesome/free-solid-svg-icons';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import CustomBreadcrumbs from '../../../components/CustomBreadcrumbs/CustomBreadcrumbs';
import CustomTable from '../../../components/CustomTable/CustomTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GradientButton from '../../../components/CustomButton/CustomButton';
import { toast } from 'react-toastify';
import { APP_CONFIG } from '../../../constants/config';

const columnsSplit = [
	{
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (data) => {
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
		},
	},
	{
		headerText: 'ID Conta repartida',
		key: 'conta',
		CustomValue: (conta) => {
			return (
				<Box>
					<Typography>{conta.nome ? conta.nome : null}</Typography>
					<Typography>
						{conta.documento ? conta.documento : null}
					</Typography>
				</Box>
			);
		},
	},
	{
		headerText: 'Arcou com Prejuizo',
		key: 'responsavel_pelo_prejuizo',
		CustomValue: (responsavel) => {
			if (responsavel === true) {
				return <Typography>Sim</Typography>;
			} else {
				return <Typography>Não</Typography>;
			}
		},
	},
	{
		headerText: 'Valor repartido',
		key: 'split.receivable_amount',
		CustomValue: (valor) => <Typography>R$ {valor}</Typography>,
	},
];
const columns = [
	{
		headerText: 'Criado em',
		key: 'created_at',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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
							borderRadius: '27px',
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

const TransactionDetailsSlip = ({ transacaoId }) => {
	const { transaction, pagador, split, conta } = transacaoId;
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

	const formatDate = () => {
		const date = new Date(transaction.payment_method.expiration_date);
		const option = {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		};
		const formatted = date.toLocaleDateString('pt-br', option);
		return <Typography variant="h6">{formatted}</Typography>;
	};

	return (
		<Box display="flex" flexDirection="column">
			<Paper
				style={{
					padding: '24px',
					margin: '12px 0',
					borderRadius: '27px',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
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
						<Box marginTop="18px">
							<Typography style={{ margin: '6px 0' }} variant="h4">
								Repartições de valor
							</Typography>
							{split ? (
								<CustomTable data={split} columns={columnsSplit} />
							) : null}
						</Box>
					</Box>

					<Box
						display="flex"
						flexDirection="column"
						style={{
							marginLeft: '20px',
							width: '100%',
						}}
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
									Boleto
								</Typography>
							</Box>
						</Box>
						<Box display="flex" marginTop="6px" flexDirection="column">
							<Box display="flex" alignItems="center" width="100%">
								<Box marginRight="6px">
									<FontAwesomeIcon icon={faBarcode} size="2x" />
								</Box>
								<p style={{ marginRight: '6px' }}>Código: </p>
								<Box width="100%" display="flex" alignItems="center">
									<TextField
										fullWidth
										style={{ width: '60%' }}
										value={transaction.payment_method.barcode}
									/>
									<Tooltip title="Copiar">
										<CopyToClipboard
											text={transaction.payment_method.barcode}
										>
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
								</Box>
							</Box>
							<Box
								margin="12px"
								width="100%"
								display="flex"
								justifyContent="center"
							>
								<GradientButton
									buttonText="2° Via do Boleto"
									onClick={() =>
										window.open(
											`${transaction.payment_method.url}`,
											'Boleto',
											'height=1000,width=1000'
										)
									}
								>
									2° Via do Boleto
								</GradientButton>
							</Box>
							<Box
								display="flex"
								justifyContent="space-between"
								flexDirection={matches ? 'column' : null}
							>
								<Box
									display="flex"
									flexDirection="column"
									justifyContent="center"
								>
									<Typography variant="h6">Vencimento:</Typography>

									<> {formatDate()}</>
								</Box>
								<Box
									display="flex"
									flexDirection="column"
									justifyContent="center"
								>
									<Typography variant="h6">N° Documento:</Typography>
									<Box>
										<TextField
											style={{ width: '40%' }}
											value={
												transaction.payment_method.document_number
											}
										/>
										<Tooltip title="Copiar">
											<CopyToClipboard
												text={
													transaction.payment_method
														.document_number
												}
											>
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
									</Box>
								</Box>
							</Box>
							<Box display="flex" alignContent="center" marginTop="12px">
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
							<Box
								display="flex"
								flexDirection="column"
								justifyContent="center"
								marginTop="10px"
							>
								<Typography variant="h6">ID do Vendedor:</Typography>
								{conta.id ? conta.id : ''}
							</Box>
							<Box
								display="flex"
								flexDirection="column"
								justifyContent="center"
								marginTop="10px"
							>
								<Typography variant="h6">
									Código de autorização
								</Typography>
								{transaction.payment_authorization
									? transaction.payment_authorization
									: 'Não autorizada'}
							</Box>
							<Divider style={{ marginTop: '6px' }} />
							<Typography variant="h6" align="center">
								Pagador
							</Typography>
							<Box>
								<Typography>Nome:</Typography>
								<Typography variant="h6">
									{pagador.nome ? pagador.nome : '-'}
								</Typography>
								<Typography>Id:</Typography>
								<Typography variant="h6">
									{pagador.id ? pagador.id : '-'}
								</Typography>
								<Typography>Documento:</Typography>
								<Typography variant="h6">
									{pagador.documento !== '..-'
										? pagador.documento
										: '-'}
								</Typography>
								<Typography>E-mail:</Typography>
								<Typography variant="h6">
									{pagador.email ? pagador.email : '-'}
								</Typography>
								<Typography>Contato:</Typography>
								<Typography variant="h6">
									{pagador.celular ? pagador.celular : '-'}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};

export default TransactionDetailsSlip;
