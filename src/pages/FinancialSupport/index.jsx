import React from 'react';
import {
	Box,
	Grid,
	Typography,
	makeStyles,
	TextField,
	Button,
	Tooltip,
} from '@material-ui/core';
import CustomCard from '../../components/CustomCard/CustomCard';
import { PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';
import CustomBarChart from './components/CustomBarChart/CustomBarChart';
import CustomLineChart from './components/CustomLineChart/CustomLineChart';
import { useParams } from 'react-router';
import { formatMoney } from '../../modules/FinancialSupport/utils/money';
import { Link } from 'react-router-dom';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTable from '../../components/CustomTable/CustomTable';
import { useGetProposalQuery } from '../../modules/FinancialSupportProposal/services/proposal';
import { useGetFinancialSupportsQuery } from '../../modules/FinancialSupport/services/financialSupport';
import { APP_CONFIG } from '../../constants/config';
import { toast } from 'react-toastify';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	headerContainer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
	},
	contadorStyle: {
		display: 'flex',
		fontSize: '24px',
		fontFamily: 'Montserrat-SemiBold',
	},
	pageTitle: {
		color: APP_CONFIG.mainCollors.primary,
		fontFamily: 'Montserrat-SemiBold',
		fontSize: 32,
	},
	sectionTitle: {
		color: APP_CONFIG.mainCollors.primary,
		fontFamily: 'Montserrat-SemiBold',
		fontSize: 16,
	},
	card: {
		display: 'flex',
		height: '100%',
		flexDirection: 'column',
		padding: 24,
		backgroundColor: APP_CONFIG.mainCollors.backgrounds,
		borderRadius: 16,
		marginTop: '20px',
	},
	cardContainer: {
		display: 'flex',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
	},
	bodyContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		marginTop: '20px',
	},
}));

function FinancialSupport() {
	const classes = useStyles();
	const { id } = useParams();
	const { data: proposal, isLoading } = useGetProposalQuery(id, {
		skip: !id,
	});
	const { data: financialSupports } = useGetFinancialSupportsQuery({
		proposalId: id,
		status: 'atrasado',
		per_page: 10,
	});

	const canManageFinancialSupport = usePermission([
		PERMISSIONS.MANAGE_FINANCIAL_SUPPORT,
		PERMISSIONS.FULL_ACCESS,
	]);

	const linkToSupportList = (status) => {
		return canManageFinancialSupport
			? `/dashboard/apoio-financeiro/${id}/listagem?status=${status}`
			: '#';
	};

	return (
		!isLoading &&
		proposal && (
			<Box className={classes.root}>
				<Box display="flex" size="small" justifyContent="space-between">
					<Typography className={classes.pageTitle}>
						{proposal.nome}
					</Typography>
					{canManageFinancialSupport && (
						<Link to={linkToSupportList('')}>
							<CustomButton size="small" color="purple">
								Gerênciar Apoios
							</CustomButton>
						</Link>
					)}
				</Box>
				<Box className={classes.headerContainer}>
					<Box className={classes.card}>
						<Box>
							<Typography className={classes.sectionTitle}>
								Detalhes da Proposta
							</Typography>
						</Box>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<Box display="flex">
									<TextField
										fullWidth
										label="ID da Proposta de Apoio Financeiro"
										value={proposal?.id}
										disabled
									/>
									<Box display="flex" marginTop="24px">
										<Tooltip title="Copiar">
											<CopyToClipboard text={proposal?.id}>
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
									label="Nome da proposta"
									value={proposal?.nome}
									disabled
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Valor da proposta"
									value={formatMoney(proposal?.valor)}
									disabled
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Valor da tarifa"
									value={formatMoney(proposal?.valor_tarifa)}
									disabled
								/>
							</Grid>
							<Grid item xs={4} sm={4}>
								<TextField
									fullWidth
									label="Contas Liberadas"
									value={proposal?.qty_contas_liberadas}
									disabled
								/>
							</Grid>
							<Grid item xs={4} sm={4}>
								<TextField
									fullWidth
									label="Contas PJ Liberadas"
									value={proposal?.qty_contas_liberadas_pj}
									disabled
								/>
							</Grid>
							<Grid item xs={4} sm={4}>
								<TextField
									fullWidth
									label="Contas PF Liberadas"
									value={proposal?.qty_contas_liberadas_pf}
									disabled
								/>
							</Grid>
						</Grid>
						<Box marginTop={2}>
							<Typography className={classes.sectionTitle}>
								Status da Conta Bolsão
							</Typography>
						</Box>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label="Montante disponível"
									value={formatMoney(
										proposal.saldo_conta_escrow.valor_disponivel
									)}
									disabled
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label="Montante usado"
									value={formatMoney(
										proposal.saldo_conta_escrow.valor_usado
									)}
									disabled
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label="Tarifa recebida"
									value={formatMoney(
										proposal.saldo_conta_escrow.valor_tarifa_recebido
									)}
									disabled
								/>
							</Grid>
						</Grid>
					</Box>

					<Box className={classes.card}>
						<Typography className={classes.sectionTitle}>
							Situação dos Apoios Financeiros
						</Typography>
						<Grid container spacing={0}>
							<Grid item xs={12} sm={4}>
								<Link to={linkToSupportList('pendente')}>
									<CustomCard text="Pendentes" iconColor="orange">
										<Box className={classes.cardContainer}>
											<Typography className={classes.contadorStyle}>
												{proposal.apoios_status.pendente}
											</Typography>
										</Box>
									</CustomCard>
								</Link>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Link to={linkToSupportList('analise')}>
									<CustomCard text="Em Analise" iconColor="yellow">
										<Box className={classes.cardContainer}>
											<Typography className={classes.contadorStyle}>
												{proposal.apoios_status.analise}
											</Typography>
										</Box>
									</CustomCard>
								</Link>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Link to={linkToSupportList('ativo')}>
									<CustomCard text="Ativas" iconColor="green">
										<Box className={classes.cardContainer}>
											<Typography className={classes.contadorStyle}>
												{proposal.apoios_status.ativo}
											</Typography>
										</Box>
									</CustomCard>
								</Link>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Link to={linkToSupportList('recusado')}>
									<CustomCard text="Recusadas" iconColor="deepPurple">
										<Box className={classes.cardContainer}>
											<Typography className={classes.contadorStyle}>
												{proposal.apoios_status.recusado}
											</Typography>
										</Box>
									</CustomCard>
								</Link>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Link to={linkToSupportList('atrasado')}>
									<CustomCard text="Atrasadas" iconColor="red">
										<Box className={classes.cardContainer}>
											<Typography className={classes.contadorStyle}>
												{proposal.apoios_status.atrasado}
											</Typography>
										</Box>
									</CustomCard>
								</Link>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Link to={linkToSupportList('cancelado')}>
									<CustomCard text="Canceladas" iconColor="black">
										<Box className={classes.cardContainer}>
											<Typography className={classes.contadorStyle}>
												{proposal.apoios_status.cancelado}
											</Typography>
										</Box>
									</CustomCard>
								</Link>
							</Grid>
						</Grid>
					</Box>

					<Box className={classes.bodyContainer}>
						<Box display="flex">
							<Grid container>
								<Grid xs={8}>
									<CustomLineChart data={proposal.resumo_line_chart} />
								</Grid>
								<Grid xs={4}>
									<CustomBarChart data={proposal.apoios_status} />
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Box>
				{canManageFinancialSupport && (
					<Box
						display="flex"
						style={{ height: '100%', marginTop: '20px' }}
					>
						<Grid container>
							<Grid xs={12}>
								<Box
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between',

										height: '75px',
										backgroundColor:
											APP_CONFIG.mainCollors.backgrounds,
										borderTopRightRadius: 27,
										borderTopLeftRadius: 27,
									}}
								>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontFamily: 'Montserrat-SemiBold',
											marginTop: '20px',
											alignSelf: 'center',
											marginLeft: '30px',
										}}
									>
										APOIOS EM ATRASO
									</Typography>

									<Box
										style={{
											marginTop: '20px',
											marginRight: '10px',
										}}
									>
										<Link to={linkToSupportList('')}>
											<CustomButton size="small" color="purple">
												VER TODOS
											</CustomButton>
										</Link>
									</Box>
								</Box>
								<Box style={{ marginBottom: '40px', width: '100%' }}>
									<CustomTable
										boxShadowTop={true}
										columns={[
											{ headerText: 'E-mail', key: 'conta.email' },
											{ headerText: 'Nome', key: 'conta.nome' },
											{ headerText: 'Status', key: 'tipo_status' },
											{
												headerText: 'Parcelas Atrasadas',
												key: 'tarifas_status_qty',
												CustomValue: (tarifas_status_qty) =>
													tarifas_status_qty.atrasado,
											},
											{
												headerText: 'Valor Disponível / Total',
												key: 'custom_valor_e_total',
												FullObject: (apoio) => {
													return (
														`${formatMoney(
															apoio.conta_saldo
																.valor_apoio_financeiro
														)} / ${formatMoney(
															proposal ? proposal.valor : 0
														)}` ?? '0.00 / 0.00'
													);
												},
											},
										]}
										data={
											financialSupports ? financialSupports.data : []
										}
									/>
								</Box>
							</Grid>
						</Grid>
					</Box>
				)}
			</Box>
		)
	);
}

export default FinancialSupport;
