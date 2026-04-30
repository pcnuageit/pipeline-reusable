import '../../fonts/Montserrat-SemiBold.otf';

import {
	Box,
	IconButton,
	LinearProgress,
	Menu,
	MenuItem,
	Typography,
	makeStyles,
	TextField,
	useMediaQuery,
	useTheme,
	Grid,
	Tooltip,
	Select,
	TableRow,
	TableCell,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	delPerfilTaxa,
	getTransacaoTarifasAction,
	loadPerfilTaxaAction,
} from '../../actions/actions';
import { generatePath, useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import CurrencyFormat from 'react-currency-format';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomCollapseTable from '../../components/CustomCollapseTable/CustomCollapseTable';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from '@material-ui/lab';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { APP_CONFIG } from '../../constants/config';
import px2vw from '../../utils/px2vw';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomTable from '../../components/CustomTable/CustomTable';
import moment from 'moment/moment';
import 'moment/locale/pt-br';

const options = {
	displayType: 'text',
	/* thousandSeparator: '.', */
	/* decimalSeparator: ',,', */
	/* prefix: 'R$ ',
	decimalScale: 2,
	fixedDecimalScale: true, */
};

const columns = [
	{
		headerText: <FontAwesomeIcon icon={faCalendar} size="lg" />,
		key: 'created_at',
		CustomValue: (value) => {
			return (
				<Box
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					{moment.utc(value).format('DD/MM/YYYY HH:mm')}
				</Box>
			);
		},
	},
	{
		headerText: 'Id',
		key: 'id',
		CustomValue: (value) => <Typography>{value}</Typography>,
	},

	{
		headerText: 'Tipo',
		key: 'tipo',
		CustomValue: (value) => (
			<Typography>
				{value === 'cash_in_boleto'
					? 'Boleto Recebido'
					: value === 'cash_in_pix'
					? 'Pix Recebido'
					: value === 'cash_in_p2p'
					? 'Transferência P2P Recebida'
					: value === 'cash_out_pagamento_conta'
					? 'Pagamento de Conta'
					: value === 'cash_out_pix'
					? 'Pagamento Pix'
					: value === 'cash_out_p2p'
					? 'Transferência P2P Efetuada'
					: value === 'cash_out_wallet'
					? 'Transferência Wallet Efetuada'
					: null}
			</Typography>
		),
	},
	{
		headerText: 'Taxa padrão',
		key: 'taxa_padrao',
		CustomValue: (value) => <Typography>R$ {value}</Typography>,
	},
	{
		headerText: 'Valor',
		key: 'valor',
		CustomValue: (value) => <Typography>R$ {value}</Typography>,
	},
	{
		headerText: 'Nome conta',
		key: 'conta.nome',
		CustomValue: (value) => <Typography>{value}</Typography>,
	},
	{
		headerText: 'Id da transação',
		key: 'transactionable_id',
		CustomValue: (value) => <Typography>{value}</Typography>,
	},
	{
		headerText: 'Nome taxa',
		key: 'perfil_taxa.nome',
		CustomValue: (value) => <Typography>{value}</Typography>,
	},
];

const TransacoesTarifas = () => {
	const token = useAuth();

	const history = useHistory();
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const transacoesTarifas = useSelector((state) => state.transacoesTarifas);
	const perfilTaxas = useSelector((state) => state.perfilTaxas);
	const [filters, setFilters] = useState({
		like: '',
		transacao_id: '',
		conta_perfil_taxa_id: ' ',
		data_inicial: '',
		data_final: '',
		tipo: ' ',
		order: '',
		mostrar: '',
	});
	const debouncedLike = useDebounce(filters.like, 800);
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('md'));
	const useStyles = makeStyles(() => ({
		root: {
			display: 'flex',
			flexDirection: 'column',
			paddingRight: 50,
		},
		headerContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			marginBottom: '0px',
			width: px2vw('100%'),
			'@media (max-width: 1440px)': {
				width: '950px',
			},
			'@media (max-width: 1280px)': {
				width: '850px',
			},
		},
		tableContainer: { marginTop: '1px' },
		pageTitle: {
			color: APP_CONFIG.mainCollors.primary,
			fontFamily: 'Montserrat-SemiBold',
		},
	}));
	const classes = useStyles();
	useEffect(() => {
		dispatch(
			getTransacaoTarifasAction(
				token,
				page,
				filters.like,
				filters.transacao_id,
				filters.conta_perfil_taxa_id,
				filters.data_inicial,
				filters.data_final,
				filters.tipo,
				filters.mostrar,
				filters.order
			)
		);
	}, [
		page,
		debouncedLike,
		filters.transacao_id,
		filters.conta_perfil_taxa_id,
		filters.data_inicial,
		filters.data_final,
		filters.order,
		filters.mostrar,
		filters.tipo,
	]);

	useEffect(() => {
		dispatch(loadPerfilTaxaAction(token, filters.like));
	}, [page, debouncedLike]);

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	useEffect(() => {
		console.log(transacoesTarifas);
	}, [transacoesTarifas]);

	const Editar = ({ row }) => {
		return <></>;
	};

	return (
		<Box className={classes.root}>
			<Box className={classes.headerContainer}>
				<Box
					style={{
						marginBottom: '20px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography className={classes.pageTitle}>
						Transações Tarifas
					</Typography>
					<Box style={{ alignSelf: 'flex-end' }}>
						<IconButton
							style={{
								backgroundColor: APP_CONFIG.mainCollors.backgrounds,
								color: APP_CONFIG.mainCollors.primary,
							}}
							onClick={() => window.location.reload(false)}
						>
							<RefreshIcon></RefreshIcon>
						</IconButton>
					</Box>
				</Box>
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
						style={{
							marginTop: '10px',
							marginBottom: '16px',
							margin: 30,
						}}
					>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={3}>
								<TextField
									variant="outlined"
									InputLabelProps={{
										shrink: true,
									}}
									placeholder="Filtrar por ID da transação"
									fullWidth
									value={filters.transacao_id}
									onChange={(e) =>
										setFilters({
											...filters,
											transacao_id: e.target.value,
										})
									}
								/>
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
							<Grid item xs={12} sm={4}>
								<Select
									variant="outlined"
									style={{
										color: APP_CONFIG.mainCollors.secondary,
										marginTop: 10,
									}}
									fullWidth
									value={filters.conta_perfil_taxa_id}
									onChange={(e) =>
										setFilters({
											...filters,
											conta_perfil_taxa_id: e.target.value,
										})
									}
								>
									<MenuItem
										value={' '}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										<Typography
											style={{
												color: APP_CONFIG.mainCollors.black,
											}}
										>
											Conta Perfil Taxa
										</Typography>
									</MenuItem>
									{perfilTaxas?.data &&
										perfilTaxas.data.map((item) => {
											return (
												<MenuItem
													value={item.id}
													style={{
														color: APP_CONFIG.mainCollors
															.secondary,
													}}
												>
													<Typography
														style={{
															color: APP_CONFIG.mainCollors
																.black,
														}}
													>
														{item.nome}
													</Typography>
												</MenuItem>
											);
										})}
								</Select>
							</Grid>
							<Grid
								item
								xs={12}
								sm={1}
								style={{ display: 'flex', justifyContent: 'flex-end' }}
							>
								<Tooltip title="Limpar Filtros">
									<IconButton
										onClick={() =>
											setFilters({
												...filters,
												like: '',
												transacao_id: '',
												conta_perfil_taxa_id: ' ',
												data_inicial: '',
												data_final: '',
												tipo: ' ',
											})
										}
									>
										<FontAwesomeIcon icon={faTrash} />
									</IconButton>
								</Tooltip>
							</Grid>
							<Grid item xs={12} sm={3}>
								<Select
									variant="outlined"
									style={{
										color: APP_CONFIG.mainCollors.secondary,
										marginTop: 10,
									}}
									fullWidth
									value={filters.tipo}
									onChange={(e) =>
										setFilters({ ...filters, tipo: e.target.value })
									}
								>
									<MenuItem
										value=" "
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Tipo
									</MenuItem>
									<MenuItem
										value={'cash_in_boleto'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Boleto Recebido
									</MenuItem>
									<MenuItem
										value={'cash_in_pix'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Pix Recebido
									</MenuItem>
									<MenuItem
										value={'cash_in_p2p'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Transferência P2P Recebida
									</MenuItem>
									<MenuItem
										value={'cash_in_wallet'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Transferência Wallet Recebida
									</MenuItem>
									<MenuItem
										value={'cash_out_pagamento_conta'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Pagamento de Conta
									</MenuItem>
									<MenuItem
										value={'Pagamento Pix'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Pagamento Pix
									</MenuItem>
									<MenuItem
										value={'cash_out_p2p'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Transferência P2P Efetuada
									</MenuItem>
									<MenuItem
										value={'cash_out_wallet'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Transferência Wallet Efetuada
									</MenuItem>
								</Select>
							</Grid>
						</Grid>
					</Box>
				</Box>

				<Box className={classes.tableContainer}>
					{transacoesTarifas.data && transacoesTarifas.data.length > 0 ? (
						<Box minWidth={!matches ? '800px' : null}>
							<CustomTable
								data={transacoesTarifas.data}
								columns={columns}
								conta={true}
								Editar={Editar}
							/>
						</Box>
					) : (
						<TableRow>
							<TableCell colSpan={columns.length}>
								<Box
									display="flex"
									flexDirection="column"
									alignItems="center"
								>
									<Typography
										variant="h6"
										style={{
											color: APP_CONFIG.mainCollors.primary,
										}}
									>
										Não há dados para serem exibidos
									</Typography>
								</Box>
							</TableCell>
						</TableRow>
					)}
					<Box
						display="flex"
						alignSelf="flex-end"
						marginTop="8px"
						justifyContent="space-between"
					>
						<Pagination
							variant="outlined"
							color="secondary"
							size="large"
							count={transacoesTarifas.last_page}
							onChange={handleChangePage}
							page={page}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default TransacoesTarifas;
