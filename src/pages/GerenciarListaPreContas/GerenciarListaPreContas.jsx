import '../../fonts/Montserrat-Regular.otf';

import {
	Box,
	Icon,
	IconButton,
	LinearProgress,
	Typography,
	makeStyles,
	TextField,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router';
import { loadListaPreConta, postAuthMeAction } from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import { Pagination } from '@material-ui/lab';
import RefreshIcon from '@material-ui/icons/Refresh';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { APP_CONFIG } from '../../constants/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import px2vw from '../../utils/px2vw';

const columns = [
	{
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (data) => {
			/* const date = new Date(data);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return (
				<Box display="flex" justifyContent="center">
					<FontAwesomeIcon icon={faCalendar} size="lg" />
					<Typography style={{ marginLeft: '6px' }}>
						{formatted}
					</Typography>
				</Box>
			); */

			return (
				<Box
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<FontAwesomeIcon icon={faCalendar} size="lg" />
					{moment.utc(data).format('DD MMMM YYYY, hh:mm')}
				</Box>
			);
		},
	},
	{
		headerText: 'Nome',
		key: 'nome',
		CustomValue: (value) => <Typography>{value}</Typography>,
	},
	{
		headerText: 'Documento',
		key: 'documento',
		CustomValue: (value) => {
			return (
				<Typography
					style={{ color: value ? APP_CONFIG.mainCollors.primary : 'red' }}
				>
					{value ? value : 'Não cadastrado'}
				</Typography>
			);
		},
	},
	{
		headerText: 'Contato',
		key: '',
		FullObject: ({ verifica_contato }) => {
			return verifica_contato ? (
				<Typography
					style={{
						color: verifica_contato.celular
							? APP_CONFIG.mainCollors.primary
							: 'red',
					}}
				>
					{verifica_contato.celular
						? verifica_contato.celular
						: 'Não cadastrado'}
				</Typography>
			) : (
				<Typography style={{ color: 'red' }}>Não Cadastrado</Typography>
			);
		},
	},
	{
		headerText: 'E-mail',
		key: '',
		FullObject: ({ verifica_contato }) => {
			return verifica_contato ? (
				<Typography
					style={{
						color: verifica_contato.email
							? APP_CONFIG.mainCollors.primary
							: 'red',
					}}
				>
					{verifica_contato.email
						? verifica_contato.email
						: 'Não cadastrado'}
				</Typography>
			) : (
				<Typography style={{ color: 'red' }}>Não Cadastrado</Typography>
			);
		},
	},
	{
		headerText: 'Verificado',
		key: '',
		FullObject: ({ verifica_contato }) => {
			return verifica_contato ? (
				<Box
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Typography
						style={{
							color: verifica_contato.email_verificado ? 'green' : 'red',
						}}
					>
						Email
					</Typography>
					{verifica_contato.email_verificado ? (
						<CheckIcon style={{ marginLeft: 5, color: 'green' }} />
					) : (
						<ClearIcon style={{ marginLeft: 5, color: 'red' }} />
					)}
					<Typography
						style={{
							color: verifica_contato.celular_verificado
								? 'green'
								: 'red',
						}}
					>
						Celular
					</Typography>
					{verifica_contato.celular_verificado ? (
						<CheckIcon style={{ marginLeft: 5, color: 'green' }} />
					) : (
						<ClearIcon style={{ marginLeft: 5, color: 'red' }} />
					)}
				</Box>
			) : (
				<Box
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Typography style={{ color: 'red' }}>Email</Typography>
					<ClearIcon style={{ marginLeft: 5, color: 'red' }} />
					<Typography style={{ color: 'red' }}>Celular</Typography>
					<ClearIcon style={{ marginLeft: 5, color: 'red' }} />
				</Box>
			);
		},
	},
];

const GerenciarListaPreContas = () => {
	const token = useAuth();

	const dispatch = useDispatch();
	const listaContas = useSelector((state) => state.listaPreContas);
	const history = useHistory();
	const [page, setPage] = useState(1);

	const [filters, setFilters] = useState({
		like: '',
		order: '',
		mostrar: '',
	});
	const debouncedLike = useDebounce(filters.like, 800);
	const useStyles = makeStyles(() => ({
		root: {
			display: 'flex',
			flexDirection: 'column',
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
	const handleChangePage = (e, value) => {
		setPage(value);
	};

	useEffect(() => {
		dispatch(
			loadListaPreConta(
				token,
				page,
				debouncedLike,
				filters.order,
				filters.mostrar
			)
		);
	}, [page, debouncedLike, filters.order, filters.mostrar]);

	const handleClickRow = (row) => {
		const path = generatePath('/dashboard/detalhes-pre-conta/:id/ver', {
			id: row.id,
		});
		history.push(path);
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
					<Typography className={classes.pageTitle}>Pré Contas</Typography>
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
							placeholder="Pesquisar por nome, documento, email..."
							size="small"
							variant="outlined"
							style={{
								backgroundColor: APP_CONFIG.mainCollors.backgrounds,
								width: '400px',
							}}
							onChange={(e) => {
								setPage(1);
								setFilters({
									...filters,
									like: e.target.value,
								});
							}}
						></TextField>
					</Box>
				</Box>

				<Box className={classes.tableContainer}>
					{listaContas.data && listaContas.per_page ? (
						<CustomTable
							columns={columns ? columns : null}
							data={listaContas.data}
							handleClickRow={handleClickRow}
						/>
					) : (
						<Box>
							<LinearProgress color="secondary" />
						</Box>
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
							count={listaContas.last_page}
							onChange={handleChangePage}
							page={page}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default GerenciarListaPreContas;
