import {
	Box,
	Grid,
	IconButton,
	LinearProgress,
	TextField,
	Tooltip,
	Typography,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	faCalendarAlt,
	faQuestionCircle,
	faTable,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { generatePath, useHistory, useParams } from 'react-router';
import {
	loadExportHistoricoTransferencia,
	loadHistoricoTransferenciaFilters,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import CurrencyInput from 'react-currency-input';
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs/CustomBreadcrumbs';
import CustomTable from '../../components/CustomTable/CustomTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '@material-ui/lab/Pagination';
import { filters_historico_transferencia } from '../../constants/localStorageStrings';
import { isEqual } from 'lodash';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { APP_CONFIG } from '../../constants/config';
import moment from 'moment';
import 'moment/locale/pt-br';

const useStyles = makeStyles(() => ({
	currency: {
		font: 'inherit',
		color: 'currentColor',
		width: '100%',
		border: '0px',
		borderBottom: '1px solid gray',
		height: '1.1876em',
		margin: 0,
		display: 'block',
		padding: '6px 0 7px',
		minWidth: 0,
		background: 'none',
		boxSizing: 'content-box',
		animationName: 'mui-auto-fill-cancel',
		letterSpacing: 'inherit',
		animationDuration: '10ms',
		appearance: 'textfield',
		textAlign: 'start',
		paddingLeft: '5px',
	},
}));

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
				<>
					<Typography align="center"> {formatted}</Typography>
					<Typography align="center">
						{moment.utc(data).format('HH:mm:ss')}
					</Typography>
				</>
			);
		},
	},
	{
		headerText: 'Situação',
		key: 'status',
		CustomValue: (status) => {
			if (
				status === 'Bem sucedida' ||
				status === 'Sucesso' ||
				status === 'Confirmada' ||
				status === 'Aprovado' ||
				status === 'Criada'
			) {
				return (
					<Typography
						style={{
							color: 'green',
							fontWeight: 'bold',

							borderRadius: '27px',
						}}
					>
						{status}
					</Typography>
				);
			}
			if (status === 'Pendente') {
				return (
					<Typography
						style={{
							color: '#CCCC00',
							fontWeight: 'bold',

							borderRadius: '27px',
						}}
					>
						{status}
					</Typography>
				);
			}
			return (
				<Typography
					style={{
						color: 'red',
						fontWeight: 'bold',

						borderRadius: '27px',
					}}
				>
					{status}
				</Typography>
			);
		},
	},
	{
		headerText: 'Origem',
		key: 'origem',
		CustomValue: (origem) => {
			const { tipo, documento, nome, razao_social, cnpj } = origem;
			return (
				<Box>
					<Typography align="center">
						<b>
							{razao_social === null
								? nome
								: tipo === 'Pessoa Jurídica'
								? razao_social
								: nome}
						</b>
					</Typography>
					<Typography align="center">
						{cnpj === null
							? documento
							: tipo === 'Pessoa Jurídica'
							? cnpj
							: documento}
					</Typography>
				</Box>
			);
		},
	},
	{
		headerText: 'Destino',
		key: 'destino',
		CustomValue: (destino) => {
			const { tipo, documento, nome, razao_social, cnpj } = destino;
			return (
				<Box>
					<Typography align="center">
						<b>
							{razao_social === null
								? nome
								: tipo === 'Pessoa Jurídica'
								? razao_social
								: nome}
						</b>
					</Typography>
					<Typography align="center">
						{cnpj === null
							? documento
							: tipo === 'Pessoa Jurídica'
							? cnpj
							: documento}
					</Typography>
				</Box>
			);
		},
	},
	{ headerText: 'Tipo', key: 'tipo' },
	{
		headerText: 'Valor',
		key: 'valor',
		CustomValue: (valor) => {
			return (
				<>
					R${' '}
					{parseFloat(valor).toLocaleString('pt-br', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</>
			);
		},
	},
	{
		headerText: 'Descrição',
		key: 'descricao',
		CustomValue: (descricao) => {
			return (
				<Tooltip title={descricao ? descricao : 'Sem descrição'}>
					<Box>
						<FontAwesomeIcon icon={faQuestionCircle} />
					</Box>
				</Tooltip>
			);
		},
	},
];

const TransferHistory = () => {
	const classes = useStyles();
	const token = useAuth();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useDispatch();
	const historicoTransferencia = useSelector(
		(state) => state.historicoTransferencia
	);
	const userData = useSelector((state) => state.userData);
	const { id } = useParams();
	const exportTransferencia = useSelector(
		(state) => state.exportTransferencia
	);
	const [page, setPage] = useState(1);
	const history = useHistory();

	const [filters, setFilters] = useState({
		like: '',
		valor: '',
		data: '',
	});

	const [filtersComparation] = useState({
		like: '',
		valor: '',
		data: '',
	});

	const debouncedInputValue = useDebounce(filters.like, 800);

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	useEffect(() => {
		dispatch(
			loadHistoricoTransferenciaFilters(
				token,
				page,
				debouncedInputValue,
				filters.valor,
				filters.data,
				id
			)
		);
	}, [page, token, filters.valor, filters.data, debouncedInputValue, id]);

	const handleExportarTransferencia = async () => {
		const res = await dispatch(
			loadExportHistoricoTransferencia(
				token,
				page,
				debouncedInputValue,
				filters.valor,
				filters.data,
				id
			)
		);
		if (res && res.url !== undefined) {
			window.open(`${res.url}`, '', '');
		}
	};

	useEffect(() => {
		if (!isEqual(filters, filtersComparation)) {
			localStorage.setItem(
				filters_historico_transferencia,
				JSON.stringify({ ...filters })
			);
		}
	}, [filters]);

	useEffect(() => {
		const getLocalFilters = JSON.parse(
			localStorage.getItem(filters_historico_transferencia)
		);
		if (getLocalFilters) {
			setFilters(getLocalFilters);
		}
	}, []);

	const handleClickRow = (row) => {
		const path = generatePath(
			'/dashboard/gerenciar-contas/:id/detalhes-transferencia/:transferenciaId',
			{
				id: id,
				transferenciaId: row.id,
			}
		);

		history.push(path);
	};

	return (
		<Box display="flex" flexDirection="column">
			<Box
				display="flex"
				justifyContent="space-between"
				flexDirection={matches ? 'column' : null}
			>
				<Typography
					style={{
						marginTop: '8px',
						color: APP_CONFIG.mainCollors.primary,
						marginBottom: 30,
					}}
					variant="h4"
				>
					Histórico de Transferências
				</Typography>
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
					flexDirection={matches ? 'column' : null}
					alignContent="space-between"
					marginTop="16px"
					marginBottom="16px"
					style={{ margin: 30 }}
				>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={3}>
							<TextField
								variant="outlined"
								fullWidth
								InputLabelProps={{ shrink: true }}
								placeholder="Pesquisar por nome, documento..."
								value={filters.like}
								onChange={(e) =>
									setFilters({
										...filters,
										like: e.target.value,
									})
								}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								variant="outlined"
								fullWidth
								InputLabelProps={{
									shrink: true,
									pattern: 'd {4}- d {2}- d {2} ',
								}}
								type="date"
								label="Data"
								value={filters.data}
								onChange={(e) =>
									setFilters({ ...filters, data: e.target.value })
								}
							/>
						</Grid>
						<Grid item xs={12} sm={2}>
							<Typography
								style={{
									alignSelf: 'center',
									fontSize: '11px',
									color: 'gray',
								}}
							>
								Valor da Transferência
							</Typography>
							<CurrencyInput
								className={classes.currency}
								decimalSeparator=","
								thousandSeparator="."
								prefix="R$ "
								value={filters.valor}
								onChangeEvent={(event, maskedvalue, floatvalue) =>
									setFilters({ ...filters, valor: floatvalue })
								}
								style={{
									marginBottom: '6px',
									width: '100%',
									alignSelf: 'center',
								}}
							/>
						</Grid>
					</Grid>
					<Box display="flex">
						<Tooltip title="Limpar Filtros">
							<IconButton
								onClick={() =>
									setFilters({
										...filters,
										like: '',
										valor: '',
										data: '',
									})
								}
							>
								<FontAwesomeIcon icon={faTrash} color="gray" />
							</IconButton>
						</Tooltip>

						<Tooltip title="Exportar Excel">
							<IconButton
								variant="outlined"
								style={{ marginLeft: '6px' }}
								onClick={handleExportarTransferencia}
							>
								<FontAwesomeIcon icon={faTable} color="green" />
							</IconButton>
						</Tooltip>
					</Box>
				</Box>
			</Box>

			{historicoTransferencia.data && historicoTransferencia.per_page ? (
				<CustomTable
					columns={columns}
					data={historicoTransferencia.data}
					handleClickRow={handleClickRow}
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
						count={historicoTransferencia.last_page}
						onChange={handleChangePage}
						page={page}
					/>
				}
			</Box>
		</Box>
	);
};

export default TransferHistory;
