import {
	AppBar,
	Box,
	Button,
	LinearProgress,
	Menu,
	MenuItem,
	Tab,
	Tabs,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	faCalendarAlt,
	faInfo,
	faDownload,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import {
	getAllContasAction,
	getExportacoesSolicitadasAction,
	getExportDownloadAction,
	getTerminaisPOSFilterAction,
	loadBoletosFilter,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import CustomBreadcrumbs from '../../components/CustomBreadcrumbs/CustomBreadcrumbs';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '@material-ui/lab/Pagination';
import SplitModal from '../../components/SplitModal/SplitModal';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { APP_CONFIG } from '../../constants/config';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { toast } from 'react-toastify';

const typeMapper = {
	statement: 'Extrato',
	transfer: 'Transferência',
	transaction: 'Transação',
};

const a11yProps = (index) => {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
};

const ListaExportacoesSolicitadas = () => {
	const token = useAuth();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const history = useHistory();
	const exportacoesSolicitadas = useSelector(
		(state) => state.exportacoesSolicitadas
	);
	const contasUser = useSelector((state) => state.contas);
	const userData = useSelector((state) => state.userData);
	const [value, setValue] = useState(0);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	useEffect(() => {
		dispatch(getAllContasAction(token));
	}, []);
	const [filters, setFilters] = useState({
		like: '',
		order: '',
		mostrar: '',
		type: '',
	});

	const debouncedLike = useDebounce(filters.like, 800);

	useEffect(() => {
		dispatch(
			getExportacoesSolicitadasAction(
				token,
				page,
				debouncedLike,
				'',
				'',
				filters.type,
				id
			)
		);
	}, [page, debouncedLike, filters.type, id]);

	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []);

	const handleChangePage = (e, value) => {
		setPage(value);
	};
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const getIndicatorColor = (index) =>
		index === value ? `2px solid ${APP_CONFIG.mainCollors.primary}` : null;

	const handleExportDownload = async (data) => {
		setLoading(true);
		const resExportDownload = await dispatch(
			getExportDownloadAction(token, data.conta_id, data.id)
		);
		if (resExportDownload) {
			toast.success('Arquivo baixado!');
			setLoading(false);
			window.open(resExportDownload, '_blank');
		} else {
			toast.error('Erro ao baixar arquivo');
			setLoading(false);
		}
	};
	const Editar = ({ row }) => {
		return <></>;
	};

	const columns = [
		{
			headerText: 'Tipo',
			key: 'type',
			CustomValue: (value) => (
				<Box display="flex" justifyContent="center">
					<Typography style={{ textTransform: 'capitalize' }}>
						{typeMapper[value]}
					</Typography>
				</Box>
			),
		},
		{
			headerText: 'Identificador da Exportação',
			key: 'id',
		},
		{
			headerText: 'Solicitado em',
			key: 'created_at',
			CustomValue: (data) => {
				const dataFormatada = moment
					.utc(data)
					.format('dd/MM/yyyy HH:mm:ss');
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
			headerText: 'Download',
			key: '',
			FullObject: (data) => (
				<Box display="flex" justifyContent="center">
					{data ? (
						<Link href="#" onClick={() => handleExportDownload(data)}>
							<FontAwesomeIcon icon={faDownload} size="lg" />
							<Typography style={{ marginLeft: '6px' }}>
								Download
							</Typography>
						</Link>
					) : (
						<FontAwesomeIcon spin icon={faSpinner} size="lg" />
					)}
				</Box>
			),
		},
	];

	return (
		<Box display="flex" flexDirection="column">
			<LoadingScreen isLoading={loading} />{' '}
			<Box
				display="flex"
				justifyContent="space-between"
				flexDirection={matches ? 'column' : null}
			>
				<Typography
					style={{
						marginTop: '8px',
						marginBottom: 30,
						color: APP_CONFIG.mainCollors.primary,
					}}
					variant="h4"
				>
					Exportações Solicitadas
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
					style={{
						marginTop: '10px',
						padding: '16px',
						alignSelf: 'baseline',
					}}
					display="flex"
				>
					<AppBar
						position="static"
						color="default"
						style={{
							backgroundColor: APP_CONFIG.mainCollors.backgrounds,
							boxShadow: 'none',
							width: '100%',

							/* borderTopRightRadius: 27,
                                       borderTopLeftRadius: 27, */
						}}
					>
						<Tabs
							style={{
								color: APP_CONFIG.mainCollors.primary,
								width: '100%',
								boxShadow: 'none',
							}}
							value={value}
							onChange={handleChange}
							indicatorcolor={APP_CONFIG.mainCollors.primary}
							//textColor="primary"
							variant="fullWidth"
						>
							<Tab
								onClick={() => setFilters({ ...filters, type: '' })}
								label="Todos"
								style={{
									width: '100%',
									borderBottom: getIndicatorColor(0),
								}}
								{...a11yProps(0)}
							/>

							<Tab
								onClick={() =>
									setFilters({
										...filters,
										type: 'statement',
									})
								}
								label="Extrato"
								style={{
									width: '100%',
									borderBottom: getIndicatorColor(1),
								}}
								{...a11yProps(1)}
							/>
							<Tab
								onClick={() =>
									setFilters({
										...filters,
										type: 'transfer',
									})
								}
								label="Transferência"
								style={{
									width: '100%',
									borderBottom: getIndicatorColor(2),
								}}
								{...a11yProps(2)}
							/>
							<Tab
								onClick={() =>
									setFilters({
										...filters,
										type: 'transaction',
									})
								}
								label="Transação"
								style={{
									width: '100%',
									borderBottom: getIndicatorColor(3),
								}}
								{...a11yProps(3)}
							/>
						</Tabs>
					</AppBar>
				</Box>
			</Box>
			<>
				{exportacoesSolicitadas.data && exportacoesSolicitadas.per_page ? (
					<CustomTable
						columns={columns}
						data={exportacoesSolicitadas.data}
						Editar={Editar}
					/>
				) : (
					<LinearProgress />
				)}
				<Box alignSelf="flex-end" marginTop="8px">
					<Pagination
						variant="outlined"
						color="secondary"
						size="large"
						count={exportacoesSolicitadas.last_page}
						onChange={handleChangePage}
						page={page}
					/>
				</Box>
			</>
		</Box>
	);
};

export default ListaExportacoesSolicitadas;
