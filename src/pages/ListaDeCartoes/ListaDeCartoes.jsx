/* eslint-disable no-lone-blocks */

import '../../fonts/Montserrat-SemiBold.otf';

import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	FormHelperText,
	Grid,
	IconButton,
	InputLabel,
	LinearProgress,
	Menu,
	MenuItem,
	Select,
	TextField,
	Typography,
	makeStyles,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router';
import {
	getAprovarContaAction,
	getCartaoExportAction,
	getCartoesAction,
	getContasAction,
	getContasExportAction,
	getFinalizarCadastroContaAction,
	getReaprovarContaAction,
	getReenviarTokenUsuarioAction,
	loadPermissao,
	postAuthMeAction,
	postBlackListSelfieAction,
	postBloquearDeviceAdmAction,
	postCancelCardAction,
	postConfirmRequestCardAction,
	postDesbloquearDeviceAdmAction,
	postUserBloquearDesbloquearAction,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import DeleteIcon from '@material-ui/icons/Delete';
import { Pagination } from '@material-ui/lab';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewListIcon from '@material-ui/icons/ViewList';
import { filters_gerenciar_contas } from '../../constants/localStorageStrings';
import { isEqual } from 'lodash';
import { postBloquearDeviceAdm } from '../../services/services';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import { APP_CONFIG } from '../../constants/config';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
	headerContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginBottom: '25px',
	},
	tableContainer: { marginTop: '1px' },
	pageTitle: {
		color: APP_CONFIG.mainCollors.primary,
		fontFamily: 'Montserrat-SemiBold',
	},
}));

const ListaDeCartoes = () => {
	const [filters, setFilters] = useState({
		like: '',
		order: '',
		mostrar: '',
		id: '',
		identificador: '',
		seller: '',
		status: ' ',
		numero_documento: '',
		tipo: ' ',
	});

	const [filtersComparation] = useState({
		like: '',
		order: '',
		mostrar: '',
		id: '',
		identificador: '',
		seller: '',
		status: ' ',
		numero_documento: '',
		tipo: ' ',
	});

	const debouncedLike = useDebounce(filters.like, 800);
	const debouncedId = useDebounce(filters.id, 800);
	const debouncedIdentificador = useDebounce(filters.identificador, 800);
	const debouncedSeller = useDebounce(filters.seller, 800);
	const debouncedNumeroDocumento = useDebounce(filters.numero_documento, 800);

	const [loading, setLoading] = useState(false);
	const token = useAuth();
	const classes = useStyles();
	const [page, setPage] = useState(1);
	const history = useHistory();
	const dispatch = useDispatch();
	const [permissoes, setPermissoes] = useState([]);
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('md'));

	moment.locale('pt-br');

	useEffect(() => {
		dispatch(
			getCartoesAction(
				token,
				page,
				debouncedLike,
				filters.order,
				filters.mostrar,
				debouncedId,
				debouncedIdentificador,
				debouncedSeller,
				filters.status,
				debouncedNumeroDocumento,
				filters.tipo
			)
		);
	}, [
		page,
		debouncedLike,
		filters.order,
		filters.mostrar,
		debouncedId,
		debouncedIdentificador,
		debouncedSeller,
		filters.status,
		debouncedNumeroDocumento,
		filters.tipo,
	]);

	const [isModalFitBank, setIsModalFitBank] = useState(false);

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

		{ headerText: 'Identificador', key: 'identificador_cartao' },

		{
			headerText: 'Nome',
			key: '',
			FullObject: (data) => {
				return (
					<Typography>
						{data.conta.tipo === 'Pessoa Jurídica'
							? data.conta.razao_social
							: data.conta.tipo === 'Pessoa física'
							? data.conta.nome
							: null}
					</Typography>
				);
			},
		},

		{
			headerText: 'Documento',
			key: '',
			FullObject: (data) => {
				return (
					<Typography>
						{data.conta.tipo === 'Pessoa Jurídica'
							? data.conta.cnpj
							: data.conta.tipo === 'Pessoa física'
							? data.conta.documento
							: null}
					</Typography>
				);
			},
		},
		{
			headerText: 'Status',
			key: 'status',
			CustomValue: (value) => {
				if (
					permissoes.includes(
						'Atendimento - Consulta de status da conta'
					) ||
					permissoes.includes('Administrador - Acesso total')
				) {
					if (value === '0') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#F1E3D4',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: 'orange', width: '100%' }}
									>
										CRIADO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '1') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#C9DBF2',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#75B1ED', width: '100%' }}
									>
										SOLICITADO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '2') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#C9DBF2',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#75B1ED', width: '100%' }}
									>
										GERADO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '3') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#C9ECE7',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#00B57D', width: '100%' }}
									>
										EM PROCESSO DE VÍNCULO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '4') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#C9ECE7',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#00B57D', width: '100%' }}
									>
										ATIVO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '5') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#ECC9D2',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#ED757D', width: '100%' }}
									>
										ERRO NO VÍNCULO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '6') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#905F81',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#95407B', width: '100%' }}
									>
										ERRO NA SOLICITAÇÃO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '7') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#905F81',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#95407B', width: '100%' }}
									>
										INATIVO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '8') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#A557B5',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#531A5F', width: '100%' }}
									>
										VINCULADO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '9') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#905F81',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#95407B', width: '100%' }}
									>
										PRÉ ERROR
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === '10') {
						return (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<Box
									style={{
										borderRadius: 32,
										backgroundColor: '#A557B5',
										maxWidth: '120px',
										padding: '5px',
									}}
								>
									<Typography
										style={{ color: '#531A5F', width: '100%' }}
									>
										PRÉ CRIADO
									</Typography>
								</Box>
							</Box>
						);
					}
				} else {
					return null;
				}
			},
		},

		{ headerText: '', key: 'menu' },
	];

	const listaCartoes = useSelector((state) => state.listaCartoes);

	const me = useSelector((state) => state.me);
	const userPermissao = useSelector((state) => state.userPermissao);

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	useEffect(() => {
		dispatch(postAuthMeAction(token));
	}, []);

	useEffect(() => {
		if (me.id !== undefined) {
			dispatch(loadPermissao(token, me.id));
		}
	}, [me.id]);

	useEffect(() => {
		const { permissao } = userPermissao;
		setPermissoes(permissao.map((item) => item.tipo));
	}, [userPermissao]);

	/* const handleExportar = async () => {
		setLoading(true);
		toast.warning('A exportação pode demorar um pouco, por favor aguarde...');
		const res = await dispatch(
			getCartaoExportAction(
				token,
				'',
				page,
				debouncedLike,
				filters.id,
				filters.seller,
				filters.status,
				filters.numero_documento,
				filters.tipo,
				filters.order,
				filters.mostrar
			)
		);
		if (res && res.url !== undefined) {
			window.open(`${res.url}`, '', '');
		} else {
		}
	}; */

	const Editar = (row) => {
		const [anchorEl, setAnchorEl] = useState(null);
		const [isModalBloquearOpen, setIsModalBloquearOpen] = useState(false);
		const [bloquerDispositivoData, setBloquerDispositivoData] = useState({
			conta_id: '',
			descricao: '',
		});
		const [bloquearErrors, setBloquearErrors] = useState({});
		const [isModalDesbloquearOpen, setIsModalDesbloquearOpen] =
			useState(false);
		const [desbloquerId, setDesbloquerId] = useState({
			conta_id: '',
			verificacao_seguranca: {},
		});
		const [isModalBlackListOpen, setIsModalBlackListOpen] = useState(false);
		const [negarCadastroId, setNegarCadastroId] = useState('');

		const handleClick = (event) => {
			setAnchorEl(event.currentTarget);
		};
		const handleClose = () => {
			setAnchorEl(null);
		};

		const handleConfirmarSolicitacao = async (row) => {
			setLoading(true);
			const resConfirmarSolicitacao = await dispatch(
				postConfirmRequestCardAction(token, row.row.id)
			);
			if (resConfirmarSolicitacao) {
				toast.error('Erro ao confirmar solicitação');
				setLoading(false);
				setAnchorEl(null);
			} else {
				toast.success('Solicitação confirmada com sucesso');
				setLoading(false);
				dispatch(
					getCartoesAction(
						token,
						page,
						debouncedLike,
						filters.order,
						filters.mostrar,
						debouncedId,
						debouncedSeller,
						filters.status,
						debouncedNumeroDocumento,
						filters.tipo
					)
				);
				setAnchorEl(null);
			}
		};

		const handleExcluirSolicitacao = async (row) => {
			setLoading(true);
			const resExcluirSolicitacao = await dispatch(
				postCancelCardAction(token, row.row.id)
			);
			if (resExcluirSolicitacao) {
				toast.error('Erro ao excluir solicitação');
				setLoading(false);
				setAnchorEl(null);
			} else {
				toast.success('Solicitação excluída com sucesso');
				setLoading(false);
				dispatch(
					getCartoesAction(
						token,
						page,
						debouncedLike,
						filters.order,
						filters.mostrar,
						debouncedId,
						debouncedSeller,
						filters.status,
						debouncedNumeroDocumento,
						filters.tipo
					)
				);
				setAnchorEl(null);
			}
		};

		return (
			<Box>
				<IconButton
					style={{ height: '15px', width: '10px' }}
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
					onClick={() => {}}
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					{row.row.status === '0' || row.row.status === '10' ? (
						<>
							<MenuItem
								onClick={() => handleConfirmarSolicitacao(row)}
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Confirmar Solicitação
							</MenuItem>
							<MenuItem
								onClick={() => handleExcluirSolicitacao(row)}
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Cancelar Solicitação
							</MenuItem>
						</>
					) : null}
				</Menu>
			</Box>
		);
	};

	useEffect(() => {
		if (!isEqual(filters, filtersComparation)) {
			localStorage.setItem(
				filters_gerenciar_contas,
				JSON.stringify({ ...filters })
			);
		}
	}, [filters]);

	useEffect(() => {
		const getLocalFilters = JSON.parse(
			localStorage.getItem(filters_gerenciar_contas)
		);
		if (getLocalFilters) {
			setFilters(getLocalFilters);
		}
	}, []);

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
					<Typography className={classes.pageTitle}>Cartões</Typography>
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
					<Box style={{ margin: 30 }}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={5}>
								<TextField
									fullWidth
									placeholder="Pesquisar por nome, documento..."
									size="small"
									variant="outlined"
									style={{
										marginRight: '10px',
									}}
									value={filters.like}
									onChange={(e) => {
										setPage(1);
										setFilters({
											...filters,
											like: e.target.value,
										});
									}}
								/>
							</Grid>

							<Grid item xs={12} sm={2}>
								<Select
									style={{
										marginTop: '10px',
										color: APP_CONFIG.mainCollors.secondary,
									}}
									variant="outlined"
									fullWidth
									value={filters.status}
									onChange={(e) =>
										setFilters({ ...filters, status: e.target.value })
									}
								>
									<MenuItem
										value={' '}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Status
									</MenuItem>
									<MenuItem
										value={'11'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Criado
									</MenuItem>
									<MenuItem
										value={'1'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Solicitado
									</MenuItem>
									<MenuItem
										value={'2'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Gerado
									</MenuItem>
									<MenuItem
										value={'3'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Em processo de vínculo
									</MenuItem>
									<MenuItem
										value={'4'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Ativo
									</MenuItem>
									<MenuItem
										value={'5'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Erro no vínculo
									</MenuItem>
									<MenuItem
										value={'6'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Erro na solicitação
									</MenuItem>
									<MenuItem
										value={'7'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Inativo
									</MenuItem>
									<MenuItem
										value={'8'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Vinculado
									</MenuItem>
									<MenuItem
										value={'9'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Pré Error
									</MenuItem>
									<MenuItem
										value={'10'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Pré Criado
									</MenuItem>
								</Select>
							</Grid>

							{/* <Grid item xs={12} sm={2}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
										alignItems: 'center',
										height: '100%',
										width: '100%',
									}}
								>
									<CustomButton
										color="purple"
										onClick={handleExportar}
									>
										<Box display="flex" alignItems="center">
											<ViewListIcon />
											Exportar
										</Box>
									</CustomButton>
								</Box>
							</Grid> */}
							<Grid item xs={12} sm={2}>
								<Box
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
										alignItems: 'center',
										height: '100%',
										width: '100%',
									}}
								>
									<CustomButton
										color="red"
										onClick={() => {
											setFilters(filtersComparation);
											localStorage.setItem(
												filters_gerenciar_contas,
												JSON.stringify({ ...filtersComparation })
											);
										}}
									>
										<Box display="flex" alignItems="center">
											<DeleteIcon />
											Limpar
										</Box>
									</CustomButton>
								</Box>
							</Grid>
							<Grid item xs={12} sm={5}>
								<TextField
									fullWidth
									placeholder="Pesquisar por identificador"
									size="small"
									variant="outlined"
									style={{
										marginRight: '10px',
									}}
									value={filters.identificador}
									onChange={(e) => {
										setPage(1);
										setFilters({
											...filters,
											identificador: e.target.value,
										});
									}}
								/>
							</Grid>
						</Grid>
					</Box>
					<Typography
						className={classes.pageTitle}
						style={{ marginLeft: '30px', marginBottom: '30px' }}
					>
						CARTÕES RECENTES
					</Typography>
				</Box>
				<Box className={classes.tableContainer}>
					{listaCartoes.data && listaCartoes.per_page ? (
						<Box minWidth={!matches ? '800px' : null}>
							<CustomTable
								columns={columns ? columns : null}
								data={listaCartoes.data}
								Editar={Editar}
							/>
						</Box>
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
							count={listaCartoes.last_page}
							onChange={handleChangePage}
							page={page}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ListaDeCartoes;
