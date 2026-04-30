import {
	Box,
	Button,
	Dialog,
	DialogActions,
	Grid,
	IconButton,
	InputLabel,
	LinearProgress,
	makeStyles,
	MenuItem,
	Modal,
	Select,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs/CustomBreadcrumbs';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFilePdf } from '@fortawesome/free-regular-svg-icons';
import CustomCollapseTable from '../../components/CustomCollapseTable/CustomCollapseTable';
import {
	faBan,
	faTable,
	faTrash,
	faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { generatePath, useHistory, useParams } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import {
	getPagamentoContaExtratoAction,
	getPagamentoContaExtratoActionClear,
	getPagamentoPixExtratoAction,
	getPagamentoPixExtratoActionClear,
	getSincronizarExtratoContaAction,
	getTedExtratoAction,
	getTedExtratoActionClear,
	getTransferenciaExtratoAction,
	getTransferenciaExtratoActionClear,
	loadExportExtrato,
	loadExtratoFilter,
} from '../../actions/actions';
import { toast } from 'react-toastify';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import vBankSmallLogo from '../../assets/vBankPJAssets/vBankSmallLogo.svg';
import moment from 'moment';
import 'moment/locale/pt-br';
import { APP_CONFIG } from '../../constants/config';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { pt } from 'date-fns/locale';
import { addDays, subDays } from 'date-fns';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import CustomButton from '../../components/CustomButton/CustomButton';
import ReceiptIcon from '@mui/icons-material/Receipt';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',

		/* flexGrow: 1, */
		/* width: '100vw',
		height: '100vh', */
	},

	header: {
		display: 'flex',
		alignContent: 'center',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%',
	},
	/* modalCalendar: {
		position: 'absolute',
top: '50%',
left: '50%',
transform: translate('-50%', '-50%'),
	}, */
}));
const columns = [
	{
		headerText: 'Detalhes da Transação',
		key: 'data',
		CustomValue: (data) => {
			const p = data.split(/\D/g);
			const dataFormatada = [p[2], p[1], p[0]].join('/');
			return (
				<Box
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography style={{ marginLeft: '6px' }}>
						{moment.utc(data).format('DD MMMM')}
					</Typography>
				</Box>
			);
		},
	},

	{
		headerText: 'Valor Bloqueado',
		key: 'valor_bloqueado',
		CustomValue: (value) => (
			<Box
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<FontAwesomeIcon icon={faBan} size="lg" />
				<Typography style={{ marginLeft: '6px', color: 'red' }}>
					R${' '}
					{parseFloat(value).toLocaleString('pt-br', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Typography>
			</Box>
		),
	},

	{
		headerText: 'Saldo do dia',
		key: 'saldo',
		CustomValue: (value) => (
			<Box
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<FontAwesomeIcon icon={faWallet} style={{ fontSize: '17px' }} />
				<Typography style={{ marginLeft: '6px' }}>
					R${' '}
					{parseFloat(value).toLocaleString('pt-br', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Typography>
			</Box>
		),
	},
];
const itemColumns = [
	{
		headerText: 'Descrição',
		key: 'description',
		CustomValue: (description) => {
			return (
				<Typography variant="" style={{ fontSize: 16 }}>
					{description}
				</Typography>
			);
		},
	},
	{
		headerText: <Typography variant="h6">Transação Id</Typography>,
		key: 'transaction_key',
		CustomValue: (id) => {
			return (
				<Typography variant="" style={{ fontSize: 16 }}>
					{id ? id : null}
				</Typography>
			);
		},
	},
	{
		headerText: <Typography variant="h6">NSU</Typography>,
		key: 'transaction_key',
		CustomValue: (nsu) => {
			return (
				<Typography variant="" style={{ fontSize: 16 }}>
					{nsu}
				</Typography>
			);
		},
	},
	{
		headerText: <Typography variant="h6">Taxas</Typography>,
		key: 'fee',
		CustomValue: (fee) => {
			if (fee > 0) {
				return (
					<Box style={{ display: 'flex' }}>
						<Typography
							variant=""
							style={{
								fontSize: 17,
								fontWeight: 600,
								color: 'red',
								marginLeft: '6px',
							}}
						>
							R$ 0,00{fee}
						</Typography>
					</Box>
				);
			} else {
				return (
					<Box style={{ display: 'flex' }}>
						<Typography
							variant=""
							style={{
								fontSize: 17,
								fontWeight: 600,
								color: 'green',
								marginLeft: '6px',
							}}
						>
							R$ 0,00 {fee}
						</Typography>
					</Box>
				);
			}
		},
	},
	{
		headerText: <Typography variant="h6">Valor</Typography>,
		key: 'transaction_amount',
		CustomValue: (amount) => {
			if (amount < 0) {
				return (
					<Box style={{ display: 'flex' }}>
						<Typography
							variant=""
							style={{
								fontSize: 17,
								fontWeight: 600,
								color: 'red',
								marginLeft: '6px',
							}}
						>
							R${' '}
							{parseFloat(amount).toLocaleString('pt-br', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Typography>
					</Box>
				);
			} else {
				return (
					<Box style={{ display: 'flex' }}>
						<Typography
							variant=""
							style={{
								fontSize: 17,
								fontWeight: 600,
								color: 'green',
								marginLeft: '6px',
							}}
						>
							R${' '}
							{parseFloat(amount).toLocaleString('pt-br', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Typography>
					</Box>
				);
			}
		},
	},

	{
		headerText: '',
		key: 'menuCollapse',
	},
];

const AccountStatement = () => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const token = useAuth();
	const theme = useTheme();
	const [page, setPage] = useState(1);
	const userExtrato = useSelector((state) => state.extrato);
	const userData = useSelector((state) => state.userData);
	const exportExtrato = useSelector((state) => state.exportExtrato);
	const transferenciaExtrato = useSelector(
		(state) => state.transferenciaExtrato
	);
	const tedExtrato = useSelector((state) => state.tedExtrato);
	const pagamentoContaExtrato = useSelector(
		(state) => state.pagamentoContaExtrato
	);
	const pagamentoPixExtrato = useSelector(
		(state) => state.pagamentoPixExtrato
	);
	const { id } = useParams();
	const history = useHistory();
	const [filters, setFilters] = useState({
		id: '',
		day: ' ',
		order: '',
		mostrar: '',
		tipo: '',
		data_inicial: '',
		data_final: '',
	});
	const debouncedId = useDebounce(filters.id, 800);
	const componentRef = useRef();
	const [extratoModal, setExtratoModal] = useState(false);
	const [semComprovante, setSemComprovante] = useState(false);
	const [operationType, setOperationType] = useState('');
	const [atualizarFitbankModal, setAtualizarFitbankModal] = useState(false);
	const [maxDate, setMaxDate] = useState(addDays(new Date(), 29));
	const [loading, setLoading] = useState(false);
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [state, setState] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection',
		},
	]);
	const [formatedStartDate, setFormatedStartDate] = useState('');
	const [formatedEndDate, setFormatedEndDate] = useState('');

	moment.locale('pt-br');

	const handleOnChange = (ranges) => {
		const { selection } = ranges;
		setMaxDate(addDays(selection.startDate, 29));
		setState([selection]);
	};

	useEffect(() => {
		setFormatedStartDate(moment.utc(state[0].startDate).format('YYYY-MM-DD'));
		setFormatedEndDate(moment.utc(state[0].endDate).format('YYYY-MM-DD'));
	}, [state]);

	useEffect(() => {
		dispatch(
			loadExtratoFilter(
				token,
				page,
				debouncedId,
				filters.day,
				filters.order,
				filters.mostrar,
				filters.tipo,
				id,
				filters.data_inicial,
				filters.data_final
			)
		);
	}, [
		filters.day,
		filters.order,
		filters.mostrar,
		filters.tipo,
		page,
		debouncedId,
		id,
		filters.data_inicial,
		filters.data_final,
	]);

	const handleSincronizarExtrato = async () => {
		setLoading(true);
		if (
			formatedStartDate === '' ||
			formatedEndDate === '' ||
			formatedStartDate === formatedEndDate
		) {
			toast.error('Selecione um intervalo válido');
			setLoading(false);
		} else {
			const resSincronizarExtrato = await dispatch(
				getSincronizarExtratoContaAction(
					token,
					id,
					formatedStartDate,
					formatedEndDate
				)
			);
			if (resSincronizarExtrato) {
				toast.error('Erro ao sincronizar extrato');
				setLoading(false);
			} else {
				toast.success('Extrato sincronizado com sucesso');
				setLoading(false);
			}
		}
	};

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	const handleClickRow = (row) => {
		if (row.transaction && row.transaction.id) {
			const path = generatePath('/dashboard/detalhes-transacao/:id/ver', {
				id: row.transaction.id,
			});
			history.push(path);
		} else {
			return null;
		}
	};

	const handleExportarExtrato = async () => {
		setLoading(true);
		const res = await dispatch(
			loadExportExtrato(
				token,
				page,
				debouncedId,
				filters.day,
				filters.order,
				filters.mostrar,
				filters.tipo,
				id,
				filters.data_inicial,
				filters.data_final
			)
		);
		if (res && res.url !== undefined) {
			window.open(`${res.url}`, '', '');
		}
		setLoading(false);
	};

	const handleExportarExtratoPDF = async () => {
		setLoading(true);
		const res = await dispatch(
			loadExportExtrato(
				token,
				page,
				debouncedId,
				filters.day,
				filters.order,
				filters.mostrar,
				filters.tipo,
				id,
				filters.data_inicial,
				filters.data_final,
				'pdf'
			)
		);
		if (res && res.url !== undefined) {
			window.open(`${res.url}`, '', '');
		}
		setLoading(false);
	};

	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []);

	const EditarCollapse = (row) => {
		const comprovanteExtrato = async () => {
			if (row.row.DocumentNumber || row.row.TransactionId) {
				if (row.row.OperationType === 6 || row.row.OperationType === 0) {
					await dispatch(getTransferenciaExtratoActionClear());
					const resTransferenciaExtrato = await dispatch(
						getTransferenciaExtratoAction(token, row.row.DocumentNumber)
					);
					if (resTransferenciaExtrato) {
						setSemComprovante(true);
					} else {
						setExtratoModal(true);
					}
				}
				if (row.row.OperationType === 3 || row.row.OperationType === 4) {
					await dispatch(getTedExtratoActionClear());
					const resTedExtrato = await dispatch(
						getTedExtratoAction(token, row.row.DocumentNumber)
					);
					if (resTedExtrato) {
						setSemComprovante(true);
					} else {
						setExtratoModal(true);
					}
				}
				if (row.row.OperationType === 2) {
					await dispatch(getPagamentoContaExtratoActionClear());
					const resPagamentoContaExtrato = await dispatch(
						getPagamentoContaExtratoAction(token, row.row.DocumentNumber)
					);
					if (resPagamentoContaExtrato) {
						setSemComprovante(true);
					} else {
						setExtratoModal(true);
					}
				}
				if (
					row.row.OperationType === 40 ||
					row.row.OperationType === 41 ||
					row.row.OperationType === 43
				) {
					await dispatch(getPagamentoPixExtratoActionClear());
					const resPagamentoPixExtrato = await dispatch(
						getPagamentoPixExtratoAction(token, row.row.TransactionId)
					);
					if (resPagamentoPixExtrato) {
						setSemComprovante(true);
					} else {
						setExtratoModal(true);
					}
				}
			} else {
				toast.error('Falha ao carregar extrato');
			}
		};
		return (
			<>
				{(row.row.DocumentNumber || row.row.TransactionId) &&
					row.row.OperationType && (
						<Button
							onClick={() => {
								comprovanteExtrato();
								setOperationType(row.row.OperationType);
							}}
							variant="outlined"
							color="primary"
							style={{
								fontFamily: 'Montserrat-Regular',
								fontSize: '10px',
								color: APP_CONFIG.mainCollors.primary,
								borderRadius: 20,
							}}
						>
							Visualizar
						</Button>
					)}
			</>
		);
	};

	return (
		<Box display="flex" flexDirection="column">
			<LoadingScreen isLoading={loading} />

			<Typography
				style={{
					marginTop: '8px',
					color: APP_CONFIG.mainCollors.primary,
					marginBottom: 30,
				}}
				variant="h4"
			>
				Extrato
			</Typography>
			<Box
				style={{
					width: '100%',
					backgroundColor: APP_CONFIG.mainCollors.backgrounds,
					borderTopLeftRadius: 27,
					borderTopRightRadius: 27,
				}}
			>
				<Box
					display="flex"
					style={{ marginTop: '10px', marginBottom: '16px', margin: 30 }}
				>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={2}>
							<TextField
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
								placeholder="Filtrar por ID da transação"
								fullWidth
								value={filters.id}
								onChange={(e) =>
									setFilters({ ...filters, id: e.target.value })
								}
							/>
						</Grid>
						<Grid item xs={12} sm={2}>
							<Select
								variant="outlined"
								style={{
									color: APP_CONFIG.mainCollors.secondary,
									marginTop: 10,
								}}
								fullWidth
								value={filters.day}
								onChange={(e) =>
									setFilters({ ...filters, day: e.target.value })
								}
							>
								<MenuItem
									value=" "
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Período
								</MenuItem>
								<MenuItem
									value={1}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Hoje
								</MenuItem>
								<MenuItem
									value={7}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Últimos 7 dias
								</MenuItem>
								<MenuItem
									value={15}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Últimos 15 dias
								</MenuItem>
								<MenuItem
									value={30}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Últimos 30 dias
								</MenuItem>
								<MenuItem
									value={60}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Últimos 60 dias
								</MenuItem>
								<MenuItem
									value={90}
									style={{ color: APP_CONFIG.mainCollors.secondary }}
								>
									Últimos 90 dias
								</MenuItem>
							</Select>
						</Grid>
						<Grid item xs={12} sm={2}>
							<TextField
								label="Data inicial"
								variant="outlined"
								fullWidth
								InputLabelProps={{
									shrink: true,
									pattern: 'd {4}- d {2}- d {2} ',
								}}
								type="date"
								value={filters.data_inicial}
								onChange={(e) =>
									setFilters({
										...filters,
										data_inicial: e.target.value,
									})
								}
							/>
						</Grid>
						<Grid item xs={12} sm={2}>
							<TextField
								label="Data final"
								variant="outlined"
								fullWidth
								InputLabelProps={{
									shrink: true,
									pattern: 'd {4}- d {2}- d {2} ',
								}}
								type="date"
								value={filters.data_final}
								onChange={(e) =>
									setFilters({
										...filters,
										data_final: e.target.value,
									})
								}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
							style={{ display: 'flex', justifyContent: 'flex-end' }}
						>
							<Tooltip title="Limpar Filtros">
								<IconButton
									onClick={() =>
										setFilters({
											...filters,
											id: '',
											day: ' ',
											order: '',
											mostrar: '',
											tipo: '',
											data_inicial: '',
											data_final: '',
										})
									}
								>
									<FontAwesomeIcon icon={faTrash} />
								</IconButton>
							</Tooltip>
							<Tooltip title="Exportar Excel">
								<IconButton
									variant="outlined"
									style={{ marginLeft: '6px' }}
									onClick={handleExportarExtrato}
								>
									<FontAwesomeIcon icon={faTable} color="green" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Exportar PDF">
								<IconButton
									variant="outlined"
									style={{ marginLeft: '6px' }}
									onClick={handleExportarExtratoPDF}
								>
									<FontAwesomeIcon icon={faFilePdf} color="red" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Atualizar extrato QiTech">
								<IconButton
									variant="outlined"
									style={{ marginLeft: '6px' }}
									onClick={() => setAtualizarFitbankModal(true)}
								>
									<RefreshIcon />
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
				</Box>
			</Box>

			{userExtrato && userExtrato.per_page ? (
				<CustomCollapseTable
					itemColumns={itemColumns}
					data={userExtrato.data}
					columns={columns}
					handleClickRow={handleClickRow}
					EditarCollapse={EditarCollapse}
				/>
			) : (
				<LinearProgress />
			)}
			<Box alignSelf="flex-end" marginTop="8px">
				{
					<Pagination
						variant="outlined"
						color="secondary"
						size="large"
						count={userExtrato.last_page}
						onChange={handleChangePage}
						page={page}
					/>
				}
			</Box>
			<Modal
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				open={atualizarFitbankModal}
				onClose={() => {
					setAtualizarFitbankModal(false);
				}}
			>
				<Box
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignSelf: 'center',
						backgroundColor: 'white',
						padding: 30,
						borderRadius: 27,
						//minWidth: '700px',
					}}
				>
					<Typography
						style={{
							color: APP_CONFIG.mainCollors.primary,
							marginTop: '10px',
							fontSize: 18,
						}}
					>
						Selecione o intervalo de tempo em que deseja atualizar o
						extrato (o intervalo não deve ser maior que 30 dias):
					</Typography>
					<Box
						style={{
							display: 'flex',
							width: '100%',
							height: '100%',
							marginTop: '10px',
							justifyContent: 'center',
						}}
					>
						<DateRange
							style={{ justifyContent: 'center' }}
							onChange={handleOnChange}
							maxDate={maxDate}
							showSelectionPreview={true}
							moveRangeOnFirstSelection={false}
							months={2}
							ranges={state}
							direction="horizontal"
							locale={pt}
							showMonthAndYearPickers={true}
							showDateDisplay={false}
							editableDateInputs={false}
							dateDisplayFormat={'P'}
						/>
					</Box>
					<Box
						style={{
							alignSelf: 'center',
							marginTop: '10px',
						}}
					>
						<CustomButton onClick={() => handleSincronizarExtrato()}>
							<Typography style={{ fontSize: 12 }}>
								Atualizar Extrato QiTech
							</Typography>
						</CustomButton>
					</Box>
				</Box>
			</Modal>
			{pagamentoPixExtrato ||
			pagamentoContaExtrato ||
			tedExtrato ||
			transferenciaExtrato ? (
				<Dialog
					ref={componentRef}
					open={extratoModal}
					onClose={() => {
						setExtratoModal(false);
					}}
					aria-labelledby="form-dialog-title"
				>
					{(operationType === 6 || operationType === 0) &&
					transferenciaExtrato &&
					transferenciaExtrato.origem &&
					transferenciaExtrato.destino ? (
						<Box
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignSelf: 'center',
								minWidth: '400px',
							}}
						>
							<Box style={{ marginTop: '30px', padding: '15px' }}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Box>
										<img
											src={APP_CONFIG.assets.smallColoredLogo}
										></img>
									</Box>
									<ReactToPrint
										trigger={() => {
											return (
												<Button>
													<PrintIcon
														style={{
															color: APP_CONFIG.mainCollors
																.primary,
														}}
													/>
												</Button>
											);
										}}
										content={() => componentRef.current}
									/>
								</Box>

								<Box style={{ marginTop: '20px' }}>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontSize: '20px',
										}}
									>
										{transferenciaExtrato.status === 'Falhou'
											? 'Comprovante de estorno'
											: 'Comprovante de transferência'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{moment
											.utc(transferenciaExtrato.created_at)
											.format('DD/MM/YYYY, hh:mm')}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Valor
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										R$ {transferenciaExtrato.valor}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Tipo de transferência
									</Typography>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											maxInlineSize: 'min-content',
										}}
									>
										{transferenciaExtrato.tipo}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										ID da transação
									</Typography>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											maxInlineSize: 'min-content',
										}}
									>
										{transferenciaExtrato.id}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Descrição
									</Typography>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											maxInlineSize: 'min-content',
										}}
									>
										{transferenciaExtrato.descricao}
									</Typography>
								</Box>

								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Destino
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Instituição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{transferenciaExtrato.destino.banco} - FITBANK
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										{transferenciaExtrato.destino.tipo ===
										'Pessoa Jurídica'
											? 'Razão Social'
											: 'Nome'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{transferenciaExtrato.destino.tipo ===
										'Pessoa Jurídica'
											? transferenciaExtrato.destino.razao_social
											: transferenciaExtrato.destino.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Agência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{transferenciaExtrato.destino.agencia}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Conta
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{transferenciaExtrato.destino.conta}
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Origem
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Instituição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{transferenciaExtrato.origem.banco} - FITBANK
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										{transferenciaExtrato.origem.tipo ===
										'Pessoa Jurídica'
											? 'Razão Social'
											: 'Nome'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{transferenciaExtrato.origem.tipo ===
										'Pessoa Jurídica'
											? transferenciaExtrato.origem.razao_social
											: transferenciaExtrato.origem.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Agência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{transferenciaExtrato.origem.agencia}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
										marginBottom: '40px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Conta
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{transferenciaExtrato.origem.conta}
									</Typography>
								</Box>
							</Box>
						</Box>
					) : operationType === 3 &&
					  tedExtrato &&
					  tedExtrato.conta_model ? (
						<Box
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignSelf: 'center',
								minWidth: '400px',
							}}
						>
							<Box style={{ marginTop: '30px', padding: '15px' }}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Box>
										<img
											src={APP_CONFIG.assets.smallColoredLogo}
										></img>
									</Box>
									<ReactToPrint
										trigger={() => {
											return (
												<Button>
													<PrintIcon
														style={{
															color: APP_CONFIG.mainCollors
																.primary,
														}}
													/>
												</Button>
											);
										}}
										content={() => componentRef.current}
									/>
								</Box>
								<Box style={{ marginTop: '20px' }}>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontSize: '20px',
										}}
									>
										{transferenciaExtrato.status === 'Falhou'
											? 'Comprovante de estorno'
											: 'Comprovante de transferência'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{moment
											.utc(tedExtrato.created_at)
											.format('DD/MM/YYYY, hh:mm')}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Valor
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										R$ {tedExtrato.valor}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Tipo de transferência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.tipo_conta}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										ID da transação
									</Typography>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											maxInlineSize: 'min-content',
										}}
									>
										{tedExtrato.id}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Descrição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.descricao}
									</Typography>
								</Box>

								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Destino
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Banco
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.banco}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Nome
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Agência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.agencia}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Conta
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta}
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Origem
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Banco
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta_model.banco} - FITBANK
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										{tedExtrato.conta_model.tipo === 'Pessoa Jurídica'
											? 'Razão Social'
											: 'Nome'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta_model.tipo === 'Pessoa Jurídica'
											? tedExtrato.conta_model.razao_social
											: tedExtrato.conta_model.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Agência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta_model.agencia}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
										marginBottom: '40px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Conta
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta_model.conta}
									</Typography>
								</Box>
							</Box>
						</Box>
					) : operationType === 4 &&
					  tedExtrato &&
					  tedExtrato.conta_model ? (
						<Box
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignSelf: 'center',
								minWidth: '400px',
							}}
						>
							<Box style={{ marginTop: '30px', padding: '15px' }}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Box>
										<img
											src={APP_CONFIG.assets.smallColoredLogo}
										></img>
									</Box>
									<ReactToPrint
										trigger={() => {
											return (
												<Button>
													<PrintIcon
														style={{
															color: APP_CONFIG.mainCollors
																.primary,
														}}
													/>
												</Button>
											);
										}}
										content={() => componentRef.current}
									/>
								</Box>
								<Box style={{ marginTop: '20px' }}>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontSize: '20px',
										}}
									>
										{transferenciaExtrato.status === 'Falhou'
											? 'Comprovante de estorno'
											: 'Comprovante de transferência'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{moment
											.utc(tedExtrato.created_at)
											.format('DD/MM/YYYY, hh:mm')}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Valor
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										R$ {tedExtrato.valor}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Tipo de transferência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.tipo_conta}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										ID da transação
									</Typography>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											maxInlineSize: 'min-content',
										}}
									>
										{tedExtrato.id}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Descrição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.descricao}
									</Typography>
								</Box>

								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Origem
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Banco
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.banco}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Nome
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Agência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.agencia}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Conta
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta}
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Destino
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Banco
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta_model.banco} - FITBANK
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										{tedExtrato.conta_model.tipo === 'Pessoa Jurídica'
											? 'Razão Social'
											: 'Nome'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta_model.tipo === 'Pessoa Jurídica'
											? tedExtrato.conta_model.razao_social
											: tedExtrato.conta_model.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Agência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta_model.agencia}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
										marginBottom: '40px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Conta
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{tedExtrato.conta_model.conta}
									</Typography>
								</Box>
							</Box>
						</Box>
					) : operationType === 2 &&
					  pagamentoContaExtrato &&
					  pagamentoContaExtrato.conta ? (
						<Box
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignSelf: 'center',
								minWidth: '400px',
							}}
						>
							<Box style={{ marginTop: '30px', padding: '15px' }}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Box>
										<img
											src={APP_CONFIG.assets.smallColoredLogo}
										></img>
									</Box>
									<ReactToPrint
										trigger={() => {
											return (
												<Button>
													<PrintIcon
														style={{
															color: APP_CONFIG.mainCollors
																.primary,
														}}
													/>
												</Button>
											);
										}}
										content={() => componentRef.current}
									/>
								</Box>
								<Box style={{ marginTop: '20px' }}>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontSize: '20px',
										}}
									>
										Boleto pago
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{moment
											.utc(pagamentoContaExtrato.created_at)
											.format('DD/MM/YYYY, hh:mm')}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Valor
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										R$ {pagamentoContaExtrato.valor}
									</Typography>
								</Box>

								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Dados do boleto
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Nome do pagador
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoContaExtrato.conta.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Documento do pagador
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										***
										{pagamentoContaExtrato.conta.documento.substring(
											3,
											6
										)}
										{pagamentoContaExtrato.conta.documento.substring(
											6,
											11
										)}
										-**
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Descrição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoContaExtrato.descricao}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
										marginBottom: '40px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										ID
									</Typography>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											maxInlineSize: 'min-content',
										}}
									>
										{pagamentoContaExtrato.id}
									</Typography>
								</Box>
							</Box>
						</Box>
					) : operationType === 40 &&
					  pagamentoPixExtrato.conta &&
					  pagamentoPixExtrato.response.consulta.Infos ? (
						<Box
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignSelf: 'center',
								minWidth: '400px',
							}}
						>
							<Box style={{ marginTop: '30px', padding: '15px' }}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Box>
										<img
											src={APP_CONFIG.assets.smallColoredLogo}
										></img>
									</Box>
									<ReactToPrint
										trigger={() => {
											return (
												<Button>
													<PrintIcon
														style={{
															color: APP_CONFIG.mainCollors
																.primary,
														}}
													/>
												</Button>
											);
										}}
										content={() => componentRef.current}
									/>
								</Box>
								<Box style={{ marginTop: '20px' }}>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontSize: '20px',
										}}
									>
										{transferenciaExtrato.status === 'Cancel'
											? 'Comprovante de estorno'
											: 'Comprovante de transferência'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{moment
											.utc(pagamentoPixExtrato.created_at)
											.format('DD/MM/YYYY, hh:mm')}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Valor
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										R$ {pagamentoPixExtrato.valor}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Tipo de transferência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.tipo_pix}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Descrição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.descricao}
									</Typography>
								</Box>

								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Destino
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Nome
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{
											pagamentoPixExtrato.response.consulta.Infos
												.ReceiverName
										}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Documento
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										***.
										{pagamentoPixExtrato.response.consulta.Infos.ReceiverTaxNumber.substring(
											3,
											6
										)}
										.
										{pagamentoPixExtrato.response.consulta.Infos.ReceiverTaxNumber.substring(
											6,
											9
										)}
										-**
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Instituição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{
											pagamentoPixExtrato.response.consulta.Infos
												.ReceiverBank
										}
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Origem
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										{pagamentoPixExtrato.conta.tipo ===
										'Pessoa Jurídica'
											? 'Razão Social'
											: 'Nome'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.conta.tipo ===
										'Pessoa Jurídica'
											? pagamentoPixExtrato.conta.razao_social
											: pagamentoPixExtrato.conta.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Documento
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										***
										{pagamentoPixExtrato.conta.documento.substring(
											3,
											6
										)}
										{pagamentoPixExtrato.conta.documento.substring(
											6,
											11
										)}
										-**
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
										marginBottom: '40px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Instituição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.banco_pagou}
									</Typography>
								</Box>
							</Box>
						</Box>
					) : operationType === 41 &&
					  pagamentoPixExtrato.conta &&
					  pagamentoPixExtrato.response &&
					  pagamentoPixExtrato.response.pix_out &&
					  pagamentoPixExtrato.response.pix_out.FromTaxNumber ? (
						<Box
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignSelf: 'center',
								minWidth: '400px',
							}}
						>
							<Box style={{ marginTop: '30px', padding: '15px' }}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Box>
										<img
											src={APP_CONFIG.assets.smallColoredLogo}
										></img>
									</Box>
									<ReactToPrint
										trigger={() => {
											return (
												<Button>
													<PrintIcon
														style={{
															color: APP_CONFIG.mainCollors
																.primary,
														}}
													/>
												</Button>
											);
										}}
										content={() => componentRef.current}
									/>
								</Box>
								<Box style={{ marginTop: '20px' }}>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontSize: '20px',
										}}
									>
										{transferenciaExtrato.status === 'Cancel'
											? 'Comprovante de estorno'
											: 'Comprovante de transferência'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{moment
											.utc(pagamentoPixExtrato.created_at)
											.format('DD/MM/YYYY, hh:mm')}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Valor
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										R$ {pagamentoPixExtrato.valor}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Tipo de transferência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.tipo_pix}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Descrição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.descricao}
									</Typography>
								</Box>

								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Destino
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Nome
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.conta.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Documento
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										***
										{pagamentoPixExtrato.conta.documento.substring(
											3,
											6
										)}
										{pagamentoPixExtrato.conta.documento.substring(
											6,
											11
										)}
										-**
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Instituição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.banco}
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Origem
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Nome
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.response.pix_out.FromName}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Documento
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										***.
										{pagamentoPixExtrato.response.pix_out.FromTaxNumber.substring(
											3,
											6
										)}
										.
										{pagamentoPixExtrato.response.pix_out.FromTaxNumber.substring(
											6,
											9
										)}
										-**
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
										marginBottom: '40px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Instituição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.banco_pagou}
									</Typography>
								</Box>
							</Box>
						</Box>
					) : operationType === 43 &&
					  pagamentoPixExtrato.conta &&
					  pagamentoPixExtrato.response.pix_out ? (
						<Box
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignSelf: 'center',
								minWidth: '400px',
							}}
						>
							<Box style={{ marginTop: '30px', padding: '15px' }}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Box>
										<img
											src={APP_CONFIG.assets.smallColoredLogo}
										></img>
									</Box>
									<ReactToPrint
										trigger={() => {
											return (
												<Button>
													<PrintIcon
														style={{
															color: APP_CONFIG.mainCollors
																.primary,
														}}
													/>
												</Button>
											);
										}}
										content={() => componentRef.current}
									/>
								</Box>
								<Box style={{ marginTop: '20px' }}>
									<Typography
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontSize: '20px',
										}}
									>
										{transferenciaExtrato.status === 'Cancel'
											? 'Comprovante de estorno'
											: 'Comprovante de transferência'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{moment
											.utc(pagamentoPixExtrato.created_at)
											.format('DD/MM/YYYY, hh:mm')}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Valor
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										R$ {pagamentoPixExtrato.valor}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Tipo de transferência
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.tipo_pix}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Descrição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.descricao}
									</Typography>
								</Box>

								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Destino
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Nome
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.response.pix_out.FromName}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Documento
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										***.
										{pagamentoPixExtrato.response.pix_out.FromTaxNumber.substring(
											3,
											6
										)}
										.
										{pagamentoPixExtrato.response.pix_out.FromTaxNumber.substring(
											6,
											9
										)}
										-**
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Instituição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.banco}
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
											marginTop: '20px',
											marginBottom: '10px',
										}}
									>
										Origem
									</Typography>
								</Box>
								<Box className={classes.lineGrey} />
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '20px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										{pagamentoPixExtrato.conta.tipo}
										{pagamentoPixExtrato.conta.tipo ===
										'Pessoa Jurídica'
											? 'Razão Social'
											: 'Nome'}
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.conta.tipo ===
										'Pessoa Jurídica'
											? pagamentoPixExtrato.conta.razao_social
											: pagamentoPixExtrato.conta.nome}
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Documento
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										***
										{pagamentoPixExtrato.conta.documento.substring(
											3,
											6
										)}
										{pagamentoPixExtrato.conta.documento.substring(
											6,
											11
										)}
										-**
									</Typography>
								</Box>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '10px',
										marginBottom: '40px',
									}}
								>
									<Typography
										style={{
											fontFamily: 'Montserrat-ExtraBold',
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Instituição
									</Typography>
									<Typography
										style={{ color: APP_CONFIG.mainCollors.primary }}
									>
										{pagamentoPixExtrato.banco_pagou}
									</Typography>
								</Box>
							</Box>
						</Box>
					) : null}
				</Dialog>
			) : null}

			<Dialog
				open={semComprovante}
				onClose={() => {
					setSemComprovante(false);
				}}
				aria-labelledby="form-dialog-title"
			>
				<Box style={{ padding: '15px' }}>
					<Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
						Comprovante não disponível
					</Typography>
				</Box>

				<DialogActions>
					<Button
						onClick={() => {
							setSemComprovante(false);
						}}
						color="primary"
					>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AccountStatement;
