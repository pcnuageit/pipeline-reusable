import '../../fonts/Montserrat-SemiBold.otf';

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	LinearProgress,
	Menu,
	MenuItem,
	TablePagination,
	TextField,
	Typography,
	makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	delAdmin,
	delDocumento,
	getAllContasAction,
	getAprovarContaAction,
	getBlacklistAction,
	getContasAction,
	getContasExportAction,
	getListaAdministradorAction,
	getReenviarTokenUsuarioAction,
	loadDocumentos,
	postCriarAdminAction,
} from '../../actions/actions';
import { generatePath, useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomSideBar from '../../components/CustomSideBar/CustomSideBar';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import { Pagination } from '@material-ui/lab';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewListIcon from '@material-ui/icons/ViewList';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import CheckIcon from '@material-ui/icons/Check';
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
	},
	tableContainer: { marginTop: '1px' },
	pageTitle: {
		color: APP_CONFIG.mainCollors.primary,
		fontFamily: 'Montserrat-SemiBold',
	},
}));

/* const columns = [
	{ headerText: 'E-mail', key: 'email' },

	{
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (data) => {
			const date = new Date(data);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			};
			const [dia] = date.toLocaleDateString('pt-br', option).split(' ');
			return <Typography align="center">{dia}</Typography>;
		},
	},

	{ headerText: '', key: 'menu' },
]; */

const Blacklist = () => {
	const [email, setEmail] = useState('');
	const [open, setOpen] = useState(false);
	const [filters, setFilters] = useState({
		like: '',
		order: '',
		mostrar: '',
	});
	const debouncedLike = useDebounce(filters.like, 800);
	const [loading, setLoading] = useState(false);
	const token = useAuth();
	const classes = useStyles();
	const [page, setPage] = useState(1);
	const history = useHistory();
	const [permissoes, setPermissoes] = useState([]);
	const userPermissao = useSelector((state) => state.userPermissao);
	const blacklist = useSelector((state) => state.blacklist);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(
			getBlacklistAction(
				token,
				page,

				debouncedLike,
				filters.order,
				filters.mostrar
			)
		);
	}, [page, debouncedLike, filters.order, filters.mostrar]);

	useEffect(() => {
		const { permissao } = userPermissao;
		setPermissoes(permissao.map((item) => item.tipo));
	}, [userPermissao]);

	const columns = [
		{ headerText: 'E-mail', key: 'conta.email' },
		{ headerText: 'Nome', key: 'conta.nome' },
		{ headerText: 'Tipo', key: 'conta.tipo' },
		{
			headerText: 'Status',
			key: 'conta.status',
			CustomValue: (value) => {
				if (
					permissoes.includes(
						'Atendimento - Consulta de status da conta'
					) ||
					permissoes.includes('Administrador - Acesso total')
				) {
					if (value === 'pending') {
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
										PENDENTE
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === 'active') {
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
										ATIVO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === 'enabled') {
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
										HABILITADO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === 'approved') {
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
										APROVADO
									</Typography>
								</Box>
							</Box>
						);
					}
					if (value === 'denied') {
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
										NEGADO
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
		{ headerText: 'Número do Documento', key: 'conta.numero_documento' },
		{ headerText: 'Documento', key: 'conta.documento' },
		{ headerText: 'Contato', key: 'conta.celular' },
		/* {
			headerText: 'Segurança',
			key: '',
			FullObject: ({ user }) => {
				if (user) {
					if (user.verificar_device_bloqueado) {
						return (
							<Typography style={{ color: 'red', fontSize: '0.7rem' }}>
								Dispositivo bloqueado
								<br />
								Aguardando Verificação
							</Typography>
						);
					}
					if (user.verificar_device_alterado) {
						return (
							<Typography style={{ color: 'red', fontSize: '0.7rem' }}>
								Dispositivo alterado
								<br />
								Aguardando Verificação
							</Typography>
						);
					}

					if (user.aguardando_confirmacao_device) {
						return (
							<Typography
								style={{ color: 'yellow', fontSize: '0.7rem' }}
							>
								Aguardando Confirmação
							</Typography>
						);
					}

					if (
						!user.verificar_device_alterado &&
						!user.verificar_device_bloqueado &&
						!user.aguardando_confirmacao_device
					) {
						return <CheckIcon style={{ color: 'green' }} />;
					}
				}
			},
		}, */
		/* { headerText: '', key: 'menu' }, */
	];

	/* const criarAdmin = async (e) => {
		e.preventDefault();

		const resCriarAdmin = await dispatch(postCriarAdminAction(token, email));
		if (resCriarAdmin) {
			toast.error('Falha ao enviar Token!');
		} else {
			toast.success('Token enviado com sucesso!');
		}
	}; */

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	const Editar = (row) => {
		const [anchorEl, setAnchorEl] = useState(null);
		const [disabled, setDisabled] = useState(false);

		const handleClick = (event) => {
			setAnchorEl(event.currentTarget);
		};
		const handleClose = () => {
			setAnchorEl(null);
		};

		const handleExcluirAdmin = async (item) => {
			await dispatch(delAdmin(token, row.row.id));
		};

		const handlePermissions = () => {
			const path = generatePath(
				'/dashboard/lista-de-administradores/:id/permissoes',
				{
					id: row.row.id,
				}
			);
			history.push(path);
		};

		const handleReenviarTokenUsuario = async (row) => {
			setLoading(true);
			const resReenviarToken = await dispatch(
				getReenviarTokenUsuarioAction(token, row.row.id)
			);
			if (resReenviarToken === false) {
				setDisabled(true);
				toast.success('Reenviado com sucesso');
				setLoading(false);
			} else {
				toast.error('Falha ao reenviar');
				setLoading(false);
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
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={() => handlePermissions(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Permissões
					</MenuItem>
					<MenuItem
						onClick={() => handleExcluirAdmin(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Excluir
					</MenuItem>

					<MenuItem
						onClick={() => handleReenviarTokenUsuario(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Reenviar Token de Confirmação
					</MenuItem>
				</Menu>
			</Box>
		);
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
					<Typography className={classes.pageTitle}>Blacklist</Typography>
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
						alignContent="center"
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
							/* onChange={(e) =>
							
							setFilters({
								...filters,
								like: e.target.value,
							})
						} */
							onChange={(e) => {
								setPage(1);
								setFilters({
									...filters,
									like: e.target.value,
								});
							}}
						></TextField>

						<Box>
							{/* 	<CustomButton
								onClick={() => {
									setOpen(true);
								}}
							>
								<Box display="flex" alignItems="center">
									Criar Administrador
								</Box>
							</CustomButton> */}
						</Box>

						{/* <Dialog
							open={open}
							onClose={() => {
								setOpen(false);
							}}
							aria-labelledby="form-dialog-title"
						>
							<DialogTitle id="form-dialog-title">
								Criar Administrador
							</DialogTitle>
							<form onSubmit={(e) => criarAdmin(e)}>
								<DialogContent>
									<DialogContentText>
										Para criar um administrador insira um e-mail.
										Enviaremos um token logo em seguida.
									</DialogContentText>

									<TextField
										onChange={(e) => setEmail(e.target.value)}
										autoFocus
										margin="dense"
										id="name"
										label="E-mail"
										type="email"
										fullWidth
									/>
								</DialogContent>
								<DialogActions>
									<Button
										onClick={() => {
											setOpen(false);
										}}
										color="primary"
									>
										Cancel
									</Button>
									<Button
										onClick={() => {
											setOpen(false);
										}}
										color="primary"
										type="submit"
									>
										Enviar
									</Button>
								</DialogActions>
							</form>
						</Dialog> */}
					</Box>
				</Box>
			</Box>

			<Box className={classes.tableContainer}>
				{blacklist.data && blacklist.per_page ? (
					<CustomTable
						columns={columns ? columns : null}
						data={blacklist.data}
						Editar={Editar}
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
						count={blacklist.last_page}
						onChange={handleChangePage}
						page={page}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default Blacklist;
