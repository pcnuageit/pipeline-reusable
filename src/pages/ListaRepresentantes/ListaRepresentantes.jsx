import '../../fonts/Montserrat-Regular.otf';

import {
	Box,
	Icon,
	IconButton,
	LinearProgress,
	Typography,
	makeStyles,
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	Menu,
	MenuItem,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router';
import {
	getContasAction,
	getRepresentantesAction,
	loadListaPreConta,
	loadPermissao,
	postAuthMeAction,
	postCriarRepresentanteAction,
	postImportarRepresentanteAction,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import { Autocomplete, Pagination } from '@material-ui/lab';
import RefreshIcon from '@material-ui/icons/Refresh';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { APP_CONFIG } from '../../constants/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import px2vw from '../../utils/px2vw';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import CustomButton from '../../components/CustomButton/CustomButton';
import { toast } from 'react-toastify';
import NewAccount from '../../components/NewAccount/NewAccount';
import NewAccountRepresentante from '../../components/NewRepresentante/NewRepresentante';
import SettingsIcon from '@material-ui/icons/Settings';

const columns = [
	{
		headerText: 'Nome',
		key: 'nome_key',
		FullObject: (row) => {
			return (
				<Typography align="center">
					{row.cnpj
						? row.business_name
						: `${row.owner_first_name} ${row.owner_last_name}`}
				</Typography>
			);
		},
	},
	{
		headerText: 'Documento',
		key: 'document_key',
		FullObject: (row) => {
			return (
				<Typography align="center">
					{row.cnpj ? row.cnpj : row.owner_cpf}
				</Typography>
			);
		},
	},
	{ headerText: 'E-mail', key: 'contact_email' },
	{ headerText: 'Criado por', key: 'created_by_email' },
	{
		headerText: 'Status',
		key: 'agent_account.status',
	},
	{ headerText: 'Ecs', key: 'ec_count' },
	{
		headerText: 'Criado',
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
			const [day, hour] = date
				.toLocaleDateString('pt-br', option)
				.split(' ');
			return (
				<>
					<Typography align="center">{day}</Typography>
					<Typography align="center">{hour}</Typography>
				</>
			);
		},
	},
	{
		headerText: 'Deletado',
		key: 'deleted_at',
		CustomValue: (data) => {
			if (data == null) return <Typography align="center">-</Typography>;
			const date = new Date(data);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			};
			const [day, hour] = date
				.toLocaleDateString('pt-br', option)
				.split(' ');
			return (
				<>
					<Typography align="center">{day}</Typography>
					<Typography align="center">{hour}</Typography>
				</>
			);
		},
	},
	{ headerText: '', key: 'menu' },
];

const ListaRepresentantes = () => {
	const token = useAuth();
	const dispatch = useDispatch();
	const representantes = useSelector((state) => state.representantes);
	const history = useHistory();
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState({
		like: '',
		trashed_agents: 0,
	});
	const debouncedLike = useDebounce(filters.like, 800);
	const [loadingImport, setLoadingImport] = useState(false);
	const [loadingCriar, setLoadingCriar] = useState(false);
	const [accountId, setAccountId] = useState('');
	const accounts = useSelector((state) => state.contas);
	const userPermissao = useSelector((state) => state.userPermissao);
	const me = useSelector((state) => state.me);
	const [permissoes, setPermissoes] = useState([]);
	const [importarModal, setImportarModal] = useState(false);
	const [criarModal, setCriarModal] = useState(false);
	const [errosConta, setErrosConta] = useState({});
	const [conta, setConta] = useState({
		documento: '',
		nome: '',
		razao_social: '',
		cnpj: '',
		celular: '',
		data_nascimento: '',
		email: '',
		site: '',
		endereco: {
			cep: '',
			rua: '',
			numero: '',
			complemento: '',
			bairro: '',
			cidade: '',
			estado: '',
		},
	});

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
		dialogHeader: {
			background: APP_CONFIG.mainCollors.primary,
			color: 'white',
		},
	}));
	const classes = useStyles();
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

	useEffect(() => {
		dispatch(
			getRepresentantesAction(
				token,
				page,
				debouncedLike,
				filters.trashed_agents
			)
		);
	}, [page, debouncedLike, filters.trashed_agents]);

	useEffect(() => {
		if (importarModal) {
			dispatch(
				getContasAction(
					token,
					'',
					debouncedLike,
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					true,
					''
				)
			);
		}
	}, [importarModal]);

	/* const handleClickRow = (row) => {
		const path = generatePath('/dashboard/detalhes-pre-conta/:id/ver', {
			id: row.id,
		});
		history.push(path);
	}; */

	const handleImportarRepresentante = async () => {
		setLoadingImport(true);
		const resImportarRepresentante = await dispatch(
			postImportarRepresentanteAction(token, accountId)
		);
		if (resImportarRepresentante) {
			toast.error('Erro ao importar representante');
			setLoadingImport(false);
		} else {
			toast.success('Representante importado com sucesso!');
			await dispatch(
				getRepresentantesAction(
					token,
					page,
					debouncedLike,
					filters.trashed_agents
				)
			);
			setImportarModal(false);
			setLoadingImport(false);
		}
	};

	const handleCriarRepresentante = async () => {
		setLoadingCriar(true);
		const resCriarRepresentante = await dispatch(
			postCriarRepresentanteAction(token, conta)
		);
		if (resCriarRepresentante) {
			toast.error('Erro ao criar representante');
			setLoadingCriar(false);
		} else {
			toast.success('Representante criado com sucesso!');
			setCriarModal(false);
			setLoadingCriar(false);
		}
	};

	const Editar = ({ row }) => {
		const [anchorEl, setAnchorEl] = useState(null);
		const [open, setOpen] = useState(false);
		const [openSplit, setOpenSplit] = useState(false);

		const handleClick = (event) => {
			setAnchorEl(event.currentTarget);
		};
		const handleClose = () => {
			setAnchorEl(null);
		};

		const handlePlanoDeVendas = (row) => {
			const path = generatePath(
				'/dashboard/representantes/:id/plano-vendas-representante',
				{
					id: row.id,
				}
			);

			history.push(path);
		};

		const handleGerenciarUsuario = (row) => {
			if (row.cnpj) {
				const path = generatePath(
					'/dashboard/gerenciar-contas/:id/lista-conta-juridica',
					{
						id: row.id,
					}
				);
				{
					permissoes.includes(
						'Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar'
					) || permissoes.includes('Administrador - Acesso total')
						? history.push(path)
						: toast.error('Permissão não concedida');
				}
			} else {
				const path = generatePath(
					'/dashboard/gerenciar-contas/:id/listas',
					{
						id: row.id,
					}
				);
				{
					permissoes.includes(
						'Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar'
					) || permissoes.includes('Administrador - Acesso total')
						? history.push(path)
						: toast.error('Permissão não concedida');
				}
			}
		};

		const handleEditarConta = (row) => {
			if (row.cnpj) {
				const path = generatePath('/dashboard/editar-conta-pj/:id/editar', {
					id: row.conta_id,
				});
				{
					permissoes.includes(
						'Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)'
					) || permissoes.includes('Administrador - Acesso total')
						? history.push(path)
						: toast.error('Permissão não concedida');
				}
			} else {
				const path = generatePath('/dashboard/editar-conta/:id/editar', {
					id: row.conta_id,
				});
				{
					permissoes.includes(
						'Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)'
					) || permissoes.includes('Administrador - Acesso total')
						? history.push(path)
						: toast.error('Permissão não concedida');
				}
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
					onClick={() => {}}
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={() => handleEditarConta(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Editar
					</MenuItem>

					<MenuItem
						onClick={() => handleGerenciarUsuario(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Gerenciar Conta
					</MenuItem>
					<MenuItem
						onClick={() => handlePlanoDeVendas(row)}
						style={{ color: APP_CONFIG.mainCollors.secondary }}
					>
						Plano de Vendas
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
					<Typography className={classes.pageTitle}>
						Representantes
					</Typography>
					<Box style={{ alignSelf: 'flex-end' }}>
						<IconButton
							style={{
								backgroundColor: APP_CONFIG.mainCollors.backgrounds,
								color: APP_CONFIG.mainCollors.primary,
							}}
							onClick={() => window.location.reload(false)}
						>
							<RefreshIcon />
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
						/>
						<Box style={{ display: 'flex' }}>
							<CustomButton
								size="small"
								color="purple"
								onClick={() => setImportarModal(true)}
							>
								Importar Representante
							</CustomButton>
							{/* 	<Box style={{ marginLeft: '10px' }}>
								<CustomButton
									size="small"
									color="purple"
									onClick={() => setCriarModal(true)}
								>
									Criar Representante
								</CustomButton>
							</Box> */}
						</Box>
					</Box>
				</Box>

				<Box className={classes.tableContainer}>
					{representantes.data && representantes.per_page ? (
						<CustomTable
							columns={columns ? columns : null}
							data={representantes.data}
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
							count={representantes.last_page}
							onChange={handleChangePage}
							page={page}
						/>
					</Box>
				</Box>
			</Box>
			{/* <Dialog
				maxWidth={false}
				open={criarModal}
				onBackdropClick={() => setCriarModal(false)}
			>
				<Box
					display="flex"
					flexDirection="column"
					width={'50vw'}
					style={{
						backgroundColor: APP_CONFIG.mainCollors.backgrounds,
						padding: '30px',
					}}
				>
					<LoadingScreen isLoading={loadingCriar} />
					<NewAccountRepresentante
						conta={conta}
						setConta={setConta}
						errosConta={errosConta}
					/>
					<Box alignSelf="end" display="flex" padding="12px 24px">
						<Box margin="6px 0" padding="0 12px">
							<Button
								style={{ borderRadius: '37px' }}
								variant="outlined"
								onClick={handleCriarRepresentante}
							>
								Criar
							</Button>
						</Box>
						<Box>
							<Button
								style={{ borderRadius: '37px', margin: '6px 0' }}
								variant="outlined"
								onClick={() => setCriarModal(false)}
							>
								Cancelar
							</Button>
						</Box>
					</Box>
				</Box>
			</Dialog> */}
			<Dialog
				open={importarModal}
				onBackdropClick={() => setImportarModal(false)}
				maxWidth={false}
			>
				<Box display="flex" flexDirection="column" width={'70vw'}>
					<LoadingScreen isLoading={loadingImport} />
					<DialogTitle className={classes.dialogHeader}>
						Importar Representante
					</DialogTitle>

					<DialogContent>
						<Box>
							<Typography align="center">
								Selecione a conta desejada para ser importado para o
								modelo de Representante.
							</Typography>
							<Typography
								align="center"
								style={{ color: 'red', margin: '10px 0' }}
							>
								ATENÇÃO: Uma conta importada para Representante não
								poderá ser revertida!
							</Typography>

							<Autocomplete
								freeSolo
								fullWidth
								options={
									accounts && accounts.data ? accounts.data : null
								}
								getOptionLabel={(account) =>
									account.razao_social ?? account.nome
								}
								onInputChange={(_event, value, reason) => {
									if (reason !== 'reset') {
										setFilters({ ...filters, like: value });
										setAccountId(null);
									}
								}}
								onChange={(_event, option) => {
									setAccountId(option ? option.id : null);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Escolher EC"
										margin="normal"
										variant="outlined"
									/>
								)}
							/>

							<Typography style={{ margin: '10px 0' }}>
								OBS: Para que uma conta seja importada, ela precisa
								atender os seguintes requisitos
							</Typography>
							<Typography>- estar ativa</Typography>
							<Typography>
								- não possuir vinculo com outro representante
							</Typography>
							<Typography>
								- não ser uma conta digital (conta filha vinculada a
								outro EC)
							</Typography>
						</Box>
					</DialogContent>

					<Box alignSelf="end" display="flex" padding="12px 24px">
						<Box margin="6px 0" padding="0 12px">
							<Button
								style={{ borderRadius: '37px' }}
								variant="outlined"
								onClick={handleImportarRepresentante}
							>
								Importar
							</Button>
						</Box>
						<Box>
							<Button
								style={{ borderRadius: '37px', margin: '6px 0' }}
								variant="outlined"
								onClick={() => setImportarModal(false)}
							>
								Cancelar
							</Button>
						</Box>
					</Box>
				</Box>
			</Dialog>
		</Box>
	);
};

export default ListaRepresentantes;
