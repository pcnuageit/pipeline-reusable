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
	getContasAction,
	getContasExportAction,
	getListaAdministradorAction,
	getPlanosDeVendasAction,
	getReenviarTokenUsuarioAction,
	loadDocumentos,
	postCriarAdminAction,
} from '../../actions/actions';
import { generatePath, useHistory, useParams } from 'react-router';
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
import { APP_CONFIG } from '../../constants/config';
import InputMask from 'react-input-mask';
import SetDefaultAppAccount from '../../components/SetDefaultAppAccount/SetDefaultAppAccount';

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

const columns = [
	{ headerText: 'Nome', key: 'name' },
	{ headerText: 'ECs ativos', key: 'ec_count' },
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
			const [dia] = date.toLocaleDateString('pt-br', option).split(' ');
			return <Typography align="center">{dia}</Typography>;
		},
	},
];

const ListaPlanosDeVenda = () => {
	const [open, setOpen] = useState(false);
	const [filters, setFilters] = useState({
		plan_name: '',
		order: '',
		mostrar: '',
	});
	const debouncedPlanName = useDebounce(filters.plan_name, 800);
	const [loading, setLoading] = useState(false);
	const token = useAuth();
	const { id } = useParams();
	const classes = useStyles();
	const [page, setPage] = useState(1);
	const history = useHistory();
	const [errors, setErrors] = useState({});
	const [openDefaultAppAccountDialog, setOpenDefaultAppAccountDialog] =
		useState(false);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(
			getPlanosDeVendasAction(
				token,
				page,
				debouncedPlanName,
				filters.order,
				filters.mostrar,
				id ? id : ''
			)
		);
	}, [page, debouncedPlanName, filters.order, filters.mostrar]);

	const planoVendas = useSelector((state) => state.planoVendas);

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	const handleClickRow = (row) => {
		const path = generatePath('/dashboard/plano-de-venda/:id/detalhes', {
			id: row.id,
		});
		history.push(path);
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

		return (
			<Box>
				{/* 	<IconButton
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
				</Menu> */}
			</Box>
		);
	};

	return (
		<Box className={classes.root}>
			<SetDefaultAppAccount
				openDialog={openDefaultAppAccountDialog}
				setOpenDialog={setOpenDefaultAppAccountDialog}
				isLoading={loading}
				setIsLoading={setLoading}
			/>
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
						{id ? 'Plano de Vendas do Representante' : 'Plano de Vendas'}
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
						justifyContent="space-between"
						alignContent="center"
						alignItems="center"
						style={{ margin: 30 }}
					>
						<TextField
							placeholder="Pesquisar por nome do plano de vendas"
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
						{id ? null : (
							<Box style={{ display: 'flex' }}>
								<Box style={{ marginRight: '20px' }}>
									<CustomButton
										onClick={setOpenDefaultAppAccountDialog}
										color="purple"
									>
										<Box display="flex" alignItems="center">
											<Typography style={{ fontSize: '11px' }}>
												Definir Conta da Aplicação
											</Typography>
										</Box>
									</CustomButton>
								</Box>
								<CustomButton
									onClick={() => {
										history.push('/dashboard/plano-vendas-zoop');
									}}
									color="purple"
								>
									<Box display="flex" alignItems="center">
										<Typography style={{ fontSize: '11px' }}>
											Buscar novo plano de vendas
										</Typography>
									</Box>
								</CustomButton>
							</Box>
						)}

						<Dialog
							open={open}
							onClose={() => {
								setOpen(false);
							}}
							aria-labelledby="form-dialog-title"
						>
							<DialogTitle id="form-dialog-title">
								Criar Administrador
							</DialogTitle>
							<form /* onSubmit={(e) => criarAdmin(e)} */>
								{/* 	<DialogContent>
									<DialogContentText>
										Para criar um administrador preencha os campos
										abaixo. Enviaremos um token logo em seguida.
									</DialogContentText>

									<TextField
										InputLabelProps={{ shrink: true }}
										value={dadosAdministrador.email}
										onChange={(e) =>
											setDadosAdministrador({
												...dadosAdministrador,
												email: e.target.value,
											})
										}
										error={errors.email ? errors.email : null}
										helperText={
											errors.email ? errors.email.join(' ') : null
										}
										autoFocus
										margin="dense"
										label="E-mail"
										fullWidth
									/>

									<TextField
										InputLabelProps={{ shrink: true }}
										value={dadosAdministrador.nome}
										onChange={(e) =>
											setDadosAdministrador({
												...dadosAdministrador,
												nome: e.target.value,
											})
										}
										autoFocus
										margin="dense"
										label="Nome"
										fullWidth
									/>
									<InputMask
										maskChar=""
										mask={'999.999.999-99'}
										value={dadosAdministrador.documento}
										onChange={(e) =>
											setDadosAdministrador({
												...dadosAdministrador,
												documento: e.target.value,
											})
										}
									>
										{() => (
											<TextField
												InputLabelProps={{ shrink: true }}
												inputProps={{ backgroundColor: 'black' }}
												error={
													errors.documento
														? errors.documento
														: null
												}
												helperText={
													errors.documento
														? errors.documento.join(' ')
														: null
												}
												autoFocus
												label="Documento"
												fullWidth
											/>
										)}
									</InputMask>
									<InputMask
										maskChar=""
										mask="(99) 99999-9999"
										value={dadosAdministrador.celular}
										onChange={(e) =>
											setDadosAdministrador({
												...dadosAdministrador,
												celular: e.target.value,
											})
										}
									>
										{() => (
											<TextField
												InputLabelProps={{ shrink: true }}
												inputProps={{ backgroundColor: 'black' }}
												error={
													errors.celular ? errors.celular : null
												}
												helperText={
													errors.celular
														? errors.celular.join(' ')
														: null
												}
												autoFocus
												label="Celular"
												fullWidth
											/>
										)}
									</InputMask>
								</DialogContent> */}
								<DialogActions>
									<Button
										onClick={() => {
											setOpen(false);
										}}
										color="primary"
									>
										Cancel
									</Button>
									<Button color="primary" type="submit">
										Enviar
									</Button>
								</DialogActions>
							</form>
						</Dialog>
					</Box>
				</Box>
			</Box>

			<Box className={classes.tableContainer}>
				{planoVendas.data && planoVendas.per_page ? (
					<CustomTable
						columns={columns}
						data={planoVendas.data}
						Editar={Editar}
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
						count={planoVendas.last_page}
						onChange={handleChangePage}
						page={page}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default ListaPlanosDeVenda;
