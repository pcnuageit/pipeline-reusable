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
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { delPerfilTaxa, loadPerfilTaxaAction } from '../../actions/actions';
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
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

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
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (data) => {
			const date = new Date(data);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return (
				<Box display="flex" justifyContent="center">
					<FontAwesomeIcon icon={faCalendar} size="lg" />
					<Typography style={{ marginLeft: '6px' }}>
						{formatted}
					</Typography>
				</Box>
			);
		},
	},
	{
		headerText: 'Nome',
		key: 'nome',
		CustomValue: (nome) => <Typography>{nome}</Typography>,
	},
	/* {
		headerText: 'Recebimento Maquina Virtual',
		key: '',
		CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
	}, */
	{
		headerText: 'Recebimento Boleto',
		key: '',
		FullObject: (row) => (
			<CurrencyFormat
				{...options}
				value={row.cash_in_boleto}
				prefix={row.tipo_cash_in_boleto === 1 ? 'R$ ' : ''}
				suffix={row.tipo_cash_in_boleto === 2 ? '%' : ''}
			/>
		),
	},
	{
		headerText: 'Recebimento PIX',
		key: '',
		FullObject: (row) => (
			<CurrencyFormat
				{...options}
				value={row.cash_in_pix}
				prefix={row.tipo_cash_in_pix === 1 ? 'R$ ' : ''}
				suffix={row.tipo_cash_in_pix === 2 ? '%' : ''}
			/>
		),
	},
	{
		headerText: 'Recebimento P2P',
		key: '',
		FullObject: (row) => (
			<CurrencyFormat
				{...options}
				value={row.cash_in_p2p}
				prefix={row.tipo_cash_in_p2p === 1 ? 'R$ ' : ''}
				suffix={row.tipo_cash_in_p2p === 2 ? '%' : ''}
			/>
		),
	},
	{
		headerText: 'Trânsferencia P2P',
		key: '',
		FullObject: (row) => (
			<CurrencyFormat
				{...options}
				value={row.cash_out_p2p}
				prefix={row.tipo_cash_out_p2p === 1 ? 'R$ ' : ''}
				suffix={row.tipo_cash_out_p2p === 2 ? '%' : ''}
			/>
		),
	},
	{
		headerText: 'Trânsferencia PIX',
		key: '',
		FullObject: (row) => (
			<CurrencyFormat
				{...options}
				value={row.cash_out_pix}
				prefix={row.tipo_cash_out_pix === 1 ? 'R$ ' : ''}
				suffix={row.tipo_cash_out_pix === 2 ? '%' : ''}
			/>
		),
	},
	{
		headerText: 'Transferência Wallet Recebida',
		key: '',
		FullObject: (row) => (
			<CurrencyFormat
				{...options}
				value={row.cash_in_wallet}
				prefix={row.tipo_cash_in_wallet === 1 ? 'R$ ' : ''}
				suffix={row.tipo_cash_in_wallet === 2 ? '%' : ''}
			/>
		),
	},
	{
		headerText: 'Transferência Wallet Efetuada',
		key: '',
		FullObject: (row) => (
			<CurrencyFormat
				{...options}
				value={row.cash_out_wallet}
				prefix={row.tipo_cash_out_wallet === 1 ? 'R$ ' : ''}
				suffix={row.tipo_cash_out_wallet === 2 ? '%' : ''}
			/>
		),
	},
	{
		headerText: 'Pagamento de Conta',
		key: '',
		FullObject: (row) => (
			<CurrencyFormat
				{...options}
				value={row.cash_out_pagamento_conta}
				prefix={row.tipo_cash_out_pagamento_conta === 1 ? 'R$ ' : ''}
				suffix={row.tipo_cash_out_pagamento_conta === 2 ? '%' : ''}
			/>
		),
	},
	{
		headerText: '',
		key: 'menu',
	},
];

const itemColumns = [
	{
		headerText: 'Nome',
		key: 'nome',
		CustomValue: (nome) => <Typography>{nome}</Typography>,
	},
	{
		headerText: 'Documento',
		key: 'documento',
		CustomValue: (documento) => <Typography>{documento}</Typography>,
	},
	{
		headerText: 'Celular',
		key: 'celular',
		CustomValue: (celular) => <Typography>{celular}</Typography>,
	},
	{
		headerText: 'Email',
		key: 'email',
		CustomValue: (email) => <Typography>{email}</Typography>,
	},
	{
		headerText: 'Razão Social',
		key: 'razao_social',
		CustomValue: (razao_social) => (
			<Typography>{razao_social !== null ? razao_social : '*'}</Typography>
		),
	},
	{
		headerText: 'CNPJ',
		key: 'cnpj',
		CustomValue: (cnpj) => (
			<Typography>{cnpj !== null ? cnpj : '*'}</Typography>
		),
	},
];

const ManageFees = () => {
	const token = useAuth();

	const history = useHistory();
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const perfilTaxas = useSelector((state) => state.perfilTaxas);
	const [filters, setFilters] = useState({
		like: '',
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
		dispatch(loadPerfilTaxaAction(token, filters.like));
	}, [page, debouncedLike]);

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	useEffect(() => {
		console.log(perfilTaxas);
	}, [perfilTaxas]);

	const Editar = ({ row }) => {
		const [anchorEl, setAnchorEl] = useState(null);

		const handleEditar = (event) => {
			const path = generatePath('/dashboard/taxa/:id/editar', {
				id: row.id,
			});
			history.push(path);
		};
		const handleClick = (event) => {
			setAnchorEl(event.currentTarget);
		};
		const handleClose = () => {
			setAnchorEl(null);
		};

		const handleExcluir = async () => {
			setLoading(true);
			const { success, status } = await dispatch(
				delPerfilTaxa(token, row.id)
			);
			if (success) {
				toast.success('Taxa excluida com sucesso!');
				setLoading(false);
				dispatch(loadPerfilTaxaAction(token, filters.like));
			} else {
				toast.error(`Erro ao excluir taxa: ${status}`);
				setLoading(false);
			}
		};

		return (
			<Box>
				<IconButton
					style={{
						height: '15px',
						width: '10px',
					}}
					aria-controls="simple-menu"
					aria-haspopup="true"
					onClick={handleClick}
				>
					<SettingsIcon
						style={{
							borderRadius: 33,
							fontSize: '35px',
							backgroundColor: APP_CONFIG.mainCollors.primary,
							color: 'white',
						}}
					/>
				</IconButton>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={handleEditar}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Editar
					</MenuItem>
					<MenuItem
						onClick={handleExcluir}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Excluir
					</MenuItem>
				</Menu>
			</Box>
		);
	};

	return (
		<Box className={classes.root}>
			<LoadingScreen isLoading={loading} />
			<Box className={classes.headerContainer}>
				<Box
					style={{
						marginBottom: '20px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography className={classes.pageTitle}>Taxas</Typography>
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
						justifyContent="space-between"
						alignItems="center"
						style={{ margin: 30 }}
					>
						<TextField
							placeholder="Pesquisar por nome..."
							size="small"
							variant="outlined"
							style={{
								backgroundColor: APP_CONFIG.mainCollors.backgrounds,
								width: '400px',
							}}
							onChange={(e) =>
								setFilters({
									...filters,
									like: e.target.value,
								})
							}
						/>

						<CustomButton
							onClick={() => history.push('/dashboard/nova-taxa')}
						>
							Nova Tarifa
						</CustomButton>
					</Box>
				</Box>

				<Box className={classes.tableContainer}>
					{perfilTaxas && perfilTaxas.per_page ? (
						<Box minWidth={!matches ? '800px' : null}>
							<CustomCollapseTable
								data={perfilTaxas.data}
								columns={columns}
								itemColumns={itemColumns}
								conta={true}
								Editar={Editar}
							/>
						</Box>
					) : (
						<LinearProgress />
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
							count={perfilTaxas.last_page}
							onChange={handleChangePage}
							page={page}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ManageFees;
