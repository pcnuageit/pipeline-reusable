import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Divider,
	FormControlLabel,
	FormGroup,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	makeStyles,
	TextField,
	Tooltip,
	Typography,
} from '@material-ui/core';
import React from 'react';
import { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import CustomTable from '../../../../components/CustomTable/CustomTable';
import SupportStatusBadge from '../../components/SupportStatusBadge';
import {
	useAproveAntecipacaoSalarialMutation,
	useCancelAntecipacaoSalarialMutation,
	useGetAntecipacaoSalarialQuery,
} from '../../services/AntecipacaoSalarial';
import { formatMoney } from '../../utils/money';
import { format } from 'date-fns';
import usePermission from '../../../../hooks/usePermission';
import { PERMISSIONS } from '../../../../constants/permissions';
import { useState } from 'react';
import RetentarTransferenciaApoioDialog from './RetentarTransferenciaApoioDialog';
import { APP_CONFIG } from '../../../../constants/config';
import CustomListItem from './LogListItems/CustomListItem';
import Popover from '../../components/Popover';
import {
	AttachMoney,
	Block,
	BorderColor,
	Cancel,
	DoneAll,
	InfoOutlined,
	MoneyOff,
	Receipt,
} from '@material-ui/icons';
import FeeChargeListItemText from './LogListItems/FeeChargeListItemText';
import FinancialTransferListItemText from './LogListItems/FinancialTransferListItemText';
import DefaultListItemText from './LogListItems/DefaultListItemText';
import Check from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
	card: {
		display: 'flex',
		height: '100%',
		flexDirection: 'column',
		padding: 24,
		backgroundColor: APP_CONFIG.mainCollors.backgrounds,
		borderRadius: 16,
	},
	cardTitle: {
		fontSize: 24,
		fontWeight: 'medium',
		marginBottom: 16,
	},
}));

const AntecipacaoSalarialItemPage = () => {
	const { id } = useParams();
	const classes = useStyles();
	const history = useHistory();

	const [openTarifaDialog, setOpenTarifaDialog] = useState(false);
	const [openReativarDialog, setOpenReativarDialog] = useState(false);
	const [openRetentarTransferenciaDialog, setOpenRetentarTransferenciaDialog] =
		useState(false);

	const canManageFinancialSupport = usePermission([
		PERMISSIONS.MANAGE_FINANCIAL_SUPPORT,
		PERMISSIONS.FULL_ACCESS,
	]);

	const [aproveFinancialSupport] = useAproveAntecipacaoSalarialMutation();
	const [cancelFinancialSupport] = useCancelAntecipacaoSalarialMutation();

	const {
		data: financialSupport,
		isLoading,
		isError,
		refetch,
	} = useGetAntecipacaoSalarialQuery(
		{
			id,
		},
		{
			skip: !id,
		}
	);

	useEffect(() => {
		if (!isLoading && !financialSupport) {
			toast.error('Antecipação salarial não encontrada');
			history.goBack();
		}
	}, [isLoading, financialSupport, history]);

	/* 	const valorLiberado = useMemo(() => {
		if (
			financialSupport &&
			financialSupport.status !== 'pendente' &&
			financialSupport.status !== 'analise' &&
			financialSupport.status !== 'recusado' &&
			financialSupport.transferencia_apoio?.status === 'Sucesso'
		) {
			return financialSupport.proposta.valor_liberado;
		}

		return 0;
	}, [financialSupport]); */

	/* const valorUtilizado = useMemo(() => {
		if (!financialSupport) {
			return 0;
		}

		return (
			valorLiberado -
			Number(financialSupport.conta_saldo.valor_liberado)
		);
	}, [valorLiberado, financialSupport]); */

	/* const valorTarifas = useMemo(() => {
		if (!financialSupport || financialSupport.tarifas.length === 0) {
			return 0;
		}

		return financialSupport.tarifas.reduce(
			(acc, tarifa) =>
				tarifa.status == 'pago' && tarifa.transferencia?.valor
					? acc + Number(tarifa.transferencia.valor)
					: acc,
			0
		);
	}, [financialSupport]); */

	/* const hasDelayedTax =
		financialSupport &&
		financialSupport.tarifas.some((tarifa) => tarifa.status === 'atrasado'); */

	const handleAproveProposal = async () => {
		try {
			await aproveFinancialSupport({
				id,
			}).unwrap();

			toast.success('Antecipação salarial aprovada com sucesso!');
		} catch (e) {
			toast.error('Não foi possível aprovar a antecipação salarial!');
			if (e.status === 401 && e.data?.message) {
				return toast.error(e.data.message);
			}
		} finally {
			refetch();
		}
	};

	const handleRefuseProposal = async () => {
		try {
			await aproveFinancialSupport({
				id,
				aprove: false,
			}).unwrap();

			toast.success('Antecipação salarial recusada com sucesso!');
		} catch (e) {
			toast.error('Não foi possível recusar a antecipação salarial!');
			if (e.status === 401 && e.data?.message) {
				return toast.error(e.data.message);
			}
		} finally {
			refetch();
		}
	};

	const handleCancelProposal = async () => {
		try {
			await cancelFinancialSupport({
				id,
			}).unwrap();

			toast.success('Antecipação salarial cancelada com sucesso!');
		} catch (e) {
			toast.error('Não foi possível cancelar a antecipação salarial!');
		} finally {
			refetch();
		}
	};

	const handleReativeProposal = () => {
		setOpenReativarDialog(true);
	};

	const handleCobrarTarifaProposal = () => {
		setOpenTarifaDialog(true);
	};

	const handleRetentarTransferencia = () => {
		setOpenRetentarTransferenciaDialog(true);
	};

	return isLoading || isError ? (
		<div />
	) : (
		<Grid container spacing={2}>
			<RetentarTransferenciaApoioDialog
				open={openRetentarTransferenciaDialog}
				onClose={() => setOpenRetentarTransferenciaDialog(false)}
				financialSupport={financialSupport}
			/>

			<Grid item container spacing={2} xs={8}>
				<Grid item xs={12}>
					<Box className={classes.card}>
						<Typography className={classes.cardTitle}>
							<Box
								display="flex"
								alignItems="center"
								justifyContent="space-between"
							>
								Detalhes da antecipação
								<Box display="flex">
									<SupportStatusBadge
										padding="4px 24px"
										value={financialSupport.status}
									/>
								</Box>
							</Box>
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={12}>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label="Nome da proposta de antecipação"
										value={financialSupport?.proposta?.nome}
										disabled
									/>
								</Grid>
								<Box display="flex">
									<TextField
										fullWidth
										label="ID da Antecipação Salarial"
										value={financialSupport.id}
										disabled
									/>
									<Box display="flex" marginTop="24px">
										<Tooltip title="Copiar">
											<CopyToClipboard text={financialSupport.id}>
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
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Data da contratação"
									value={format(
										new Date(
											financialSupport.created_at.slice(0, -1)
										),
										'dd MMM yyyy, hh:mm'
									)}
									disabled
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Valor liberado"
									value={formatMoney(
										financialSupport.proposta.valor_liberado
									)}
									disabled
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Valor inicial"
									value={formatMoney(
										financialSupport.proposta.valor_inicial
									)}
									disabled
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Valor final"
									value={formatMoney(
										financialSupport.proposta.valor_final
									)}
									disabled
								/>
							</Grid>
						</Grid>
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box className={classes.card}>
						<Typography className={classes.cardTitle}>
							Detalhes do Tomador do crédito
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Box display="flex">
									<TextField
										fullWidth
										label="ID da conta"
										value={financialSupport.conta.id}
										disabled
									/>
									<Box display="flex" marginTop="24px">
										<Tooltip title="Copiar">
											<CopyToClipboard
												text={financialSupport.conta.id}
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
							</Grid>
							<Grid item xs={12}>
								<Box display="flex">
									<TextField
										fullWidth
										label="Nome"
										value={financialSupport.conta.nome}
										disabled
									/>
									<Box display="flex" marginTop="24px">
										<Tooltip title="Copiar">
											<CopyToClipboard
												text={financialSupport.conta.nome}
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
							</Grid>
							<Grid item xs={12}>
								<Box display="flex">
									<TextField
										fullWidth
										label="Email"
										value={financialSupport.conta.email}
										disabled
									/>
									<Box display="flex" marginTop="24px">
										<Tooltip title="Copiar">
											<CopyToClipboard
												text={financialSupport.conta.email}
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
							</Grid>
						</Grid>
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box display="flex" flexDirection="column">
						<Box className={classes.card}>
							<Typography className={classes.cardTitle}>
								Validações
							</Typography>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											color="primary"
											checked={
												financialSupport.validacoes.validacoes
													.vinculo_funcionario
											}
											name="gilad"
										/>
									}
									label="Vinculo de funcionário"
								/>

								<FormControlLabel
									control={
										<Checkbox
											color="primary"
											checked={
												financialSupport.validacoes.validacoes
													.situacao_regular
											}
											name="jason"
										/>
									}
									label="Situação cadastral regular"
								/>
								<FormControlLabel
									control={
										<Checkbox
											color="primary"
											checked={
												financialSupport.validacoes.validacoes
													.maior_de_18
											}
											name="jason"
										/>
									}
									label="Maior de 18 anos"
								/>
								<FormControlLabel
									control={
										<Checkbox
											color="primary"
											checked={
												financialSupport.validacoes.validacoes
													.saldo_medio
											}
											name="antoine"
										/>
									}
									label="Saldo médio validado"
								/>
							</FormGroup>
						</Box>
						{canManageFinancialSupport && (
							<Box className={classes.card} marginTop={2}>
								<Typography className={classes.cardTitle}>
									Ações
								</Typography>
								<Grid container spacing={2}>
									{(financialSupport.status === 'analise' ||
										financialSupport.status ===
											'validacao_negada') && (
										<>
											<Grid item xs={12}>
												<Button
													fullWidth
													variant="contained"
													onClick={handleAproveProposal}
													style={{
														backgroundColor: 'green',
														color: 'white',
													}}
												>
													Aprovar antecipação
												</Button>
											</Grid>
											<Grid item xs={12}>
												<Button
													fullWidth
													variant="contained"
													onClick={handleRefuseProposal}
													style={{
														backgroundColor: 'red',
														color: 'white',
													}}
												>
													Recusar antecipação
												</Button>
											</Grid>
										</>
									)}

									{financialSupport.status === 'ativo' &&
										financialSupport.transferencia_antecipação
											?.status !== 'Sucesso' && (
											<Grid item xs={12}>
												<Button
													fullWidth
													onClick={handleRetentarTransferencia}
													variant="contained"
													style={{
														backgroundColor: 'green',
														color: 'white',
													}}
												>
													Refazer Transferência
												</Button>
											</Grid>
										)}

									{financialSupport.status !== 'cancelado' &&
										financialSupport.status !== 'validacao_negada' &&
										financialSupport.status !== 'analise' &&
										financialSupport.status !== 'finalizado' &&
										financialSupport.status !== 'recusado' && (
											<Grid item xs={12}>
												<Button
													fullWidth
													variant="contained"
													onClick={handleCancelProposal}
													style={{
														backgroundColor: 'red',
														color: 'white',
													}}
												>
													Cancelar antecipação
												</Button>
											</Grid>
										)}
								</Grid>
							</Box>
						)}
					</Box>
				</Grid>
			</Grid>

			<Grid item xs={4}>
				<Box maxHeight="850px" overflow="auto" className={classes.card}>
					<Typography className={classes.cardTitle}>Histórico</Typography>
					<List className={classes.root}>
						{financialSupport.logs.map((log, index) => {
							return (
								<>
									{index !== 0 && (
										<Divider variant="inset" component="li" />
									)}
									<CustomListItem key={log.id} log={log} />
								</>
							);
						})}
					</List>
				</Box>
			</Grid>
			<Grid item xs={12}>
				{/* <Box className={classes.card}>
					<Typography className={classes.cardTitle}>Tarifas</Typography>
					<CustomTable
						columns={[
							{
								headerText: '#',
								key: 'ordem',
							},
							{
								headerText: 'Pago em',
								key: 'data_pagamento_efetivado',
								CustomValue: (value) => {
									if (!value) return null;
									const formated = format(
										new Date(value.slice(0, -1)),
										'dd MMM yyyy, HH:mm'
									);
									return <Typography>{formated}</Typography>;
								},
							},
							{
								headerText: 'Status Pagamento',
								key: 'status_pagamento',
							},
							{
								headerText: 'Metodo de Pagamento',
								key: 'tipo_pagamento',
							},
							{
								headerText: 'Valor',
								key: 'custom_valor',
								FullObject: (tarifa) => {
									return formatMoney(
										tarifa.is_valor_final_proposta
											? financialSupport.proposta_apoio_financeiro
													.valor
											: financialSupport.proposta_apoio_financeiro
													.valor_tarifa
									);
								},
							},
							{
								headerText: 'Mês',
								key: 'data_pagamento',
								CustomValue: (value) => {
									const splited = value.split('-');
									return (
										<Typography>
											{splited[2]}/{splited[1]}/{splited[0]}
										</Typography>
									);
								},
							},
							{
								headerText: 'Status',
								key: 'status',
								CustomValue: (value) => (
									<Box
										padding={'4px 8px'}
										borderRadius={28}
										bgcolor={
											value === 'pendente'
												? 'orange'
												: value === 'pago'
												? 'green'
												: 'red'
										}
									>
										<Typography variant="body2" color="secondary">
											{value}
										</Typography>
									</Box>
								),
							},
						]}
						data={financialSupport.tarifas}
					/>
				</Box> */}
			</Grid>
		</Grid>
	);
};

export default AntecipacaoSalarialItemPage;
