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
	CardMedia,
	Select,
	Grid,
	Card,
	CardActionArea,
	FormControl,
	FormHelperText,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	delAdmin,
	delBannerAction,
	delDocumento,
	getAllContasAction,
	getAprovarContaAction,
	getContasAction,
	getContasExportAction,
	getListaAdministradorAction,
	getListaBannerAction,
	getReenviarTokenUsuarioAction,
	loadDocumentos,
	postBannerAction,
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import ClearIcon from '@material-ui/icons/Clear';
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
	dropzoneAreaBaseClasses: {
		width: '70%',
		height: '250px',
		backgroundColor: APP_CONFIG.mainCollors.backgrounds,
	},
	dropzoneContainer: {
		margin: '6px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '12px',
		minHeight: '422px',
		fontSize: '12px',
	},
	textoDropzone: {
		fontSize: '1.2rem',
		color: APP_CONFIG.mainCollors.primary,
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
				hour: 'numeric',
				minute: 'numeric',
			};
			const [dia] = date.toLocaleDateString('pt-br', option).split(' ');
			return <Typography align="center">{dia}</Typography>;
		},
	},

	{
		headerText: 'Imagem',
		key: 'imagem',
		CustomValue: (imagem) => {
			return (
				<Box
					style={{
						display: 'flex',
						width: '100px',
						height: '100px',
						alignSelf: 'center',
					}}
				>
					<CardMedia
						style={{
							alignSelf: 'center',
							/* width: '100%', */
							marginLeft: '147px',
						}}
						component="img"
						alt="Arquivo de Identificação"
						height="100"
						width="100"
						image={imagem}
						onClick={() => window.open(imagem)}
					/>
				</Box>
			);
		},
	},
	{
		headerText: 'Tipo',
		key: 'tipo',
		CustomValue: (tipo) => {
			return (
				<Typography>
					{tipo === 'home'
						? 'Página inicial'
						: tipo === 'home_app_pf'
						? 'Banner APP PF'
						: tipo === 'home_app_pj'
						? 'Banner APP PJ'
						: tipo === 'home_web_pj'
						? 'Banner Internet Banking PJ'
						: null}
				</Typography>
			);
		},
	},
	{ headerText: '', key: 'menu' },
];

const ListaDeBanners = () => {
	const [tipo, setTipo] = useState(' ');
	const [urlBanner, setUrlBanner] = useState('');
	const [imagemBanner, setImagemBanner] = useState('');
	const [open, setOpen] = useState(false);
	const [filters, setFilters] = useState({
		like: ' ',
		order: '',
		mostrar: '',
		tipo: ' ',
	});

	const debouncedLike = useDebounce(filters.like, 800);
	const [loading, setLoading] = useState(false);
	const token = useAuth();
	const classes = useStyles();
	const [page, setPage] = useState(1);
	const history = useHistory();
	const dispatch = useDispatch();
	const listaBanner = useSelector((state) => state.listaBanner);
	const [errors, setErrors] = useState({});

	var firstBanner = imagemBanner[0];
	useEffect(() => {
		dispatch(
			getListaBannerAction(
				token,
				page,

				debouncedLike,
				filters.order,
				filters.mostrar,
				filters.tipo
			)
		);
	}, [page, debouncedLike, filters.order, filters.mostrar, filters.tipo]);

	const handleExcluirArquivo = async (item) => {
		setImagemBanner('');
	};

	const onDropBanner = async (picture) => {
		setLoading(true);

		setImagemBanner(
			picture.map((item, index) => {
				return item;
			})
		);

		setLoading(false);
	};

	const criarBanner = async (e) => {
		e.preventDefault();
		setLoading(true);

		const postBanner = await dispatch(
			postBannerAction(token, imagemBanner, tipo, urlBanner)
		);
		if (postBanner) {
			setLoading(false);
			setErrors(postBanner);
			toast.error('Erro ao adicionar banner');
		} else {
			toast.success('Banner adicionado com sucesso!');
			setLoading(false);
			setOpen(false);
		}
		await dispatch(
			getListaBannerAction(
				token,
				page,

				debouncedLike,
				filters.order,
				filters.mostrar,
				filters.tipo
			)
		);
	};

	const handleChangePage = (e, value) => {
		setPage(value);
	};

	const Editar = (row) => {
		const handleExcluirBanner = async (item) => {
			await dispatch(delBannerAction(token, row.row.id));
			await dispatch(
				getListaBannerAction(
					token,
					page,

					debouncedLike,
					filters.order,
					filters.mostrar,
					filters.tipo
				)
			);
		};

		return (
			<Box>
				<IconButton
					style={{ height: '15px', width: '10px' }}
					aria-controls="simple-menu"
					aria-haspopup="true"
					onClick={() => handleExcluirBanner()}
				>
					<DeleteForeverIcon
						style={{
							borderRadius: 33,
							fontSize: '35px',

							color: '#ED757D',
						}}
					/>
				</IconButton>
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
					<Typography className={classes.pageTitle}>Banners</Typography>
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
						<Select
							label="Filtrar por tipo"
							style={{
								marginTop: '10px',
								color: APP_CONFIG.mainCollors.secondary,
								border: 'solid',

								borderWidth: '2px',
								width: '300px',
							}}
							variant="outlined"
							value={filters.tipo}
							onChange={(e) =>
								setFilters({ ...filters, tipo: e.target.value })
							}
						>
							<MenuItem
								value={' '}
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Filtrar por tipo
							</MenuItem>
							<MenuItem
								value={'home'}
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Página inicial
							</MenuItem>
							<MenuItem
								value={'home_app_pf'}
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Banner APP PF
							</MenuItem>
							<MenuItem
								value={'home_app_pj'}
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Banner APP PJ
							</MenuItem>
							<MenuItem
								value={'home_web_pj'}
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Banner Internet Banking PJ
							</MenuItem>
						</Select>

						<Box>
							<CustomButton
								onClick={() => {
									{
										setImagemBanner('');
										setOpen(true);
									}
								}}
							>
								<Box display="flex" alignItems="center">
									Criar Banner
								</Box>
							</CustomButton>
						</Box>

						<Dialog
							open={open}
							onClose={() => {
								setOpen(false);
							}}
							aria-labelledby="form-dialog-title"
						>
							<DialogTitle id="form-dialog-title">
								Criar Banner
							</DialogTitle>
							<form onSubmit={(e) => criarBanner(e)}>
								<DialogContent>
									<DialogContentText>
										Para criar um Banner insira um arquivo e o tipo.
									</DialogContentText>
									<Box className={classes.dropzoneContainer}>
										<DropzoneAreaBase
											dropzoneParagraphClass={classes.textoDropzone}
											maxFileSize={3145728}
											onDropRejected={() => {
												toast.error('Tamanho máximo: 3mb ');
												toast.error(
													'Arquivos suportados: .pdf .png .jpg .jpeg'
												);
											}}
											acceptedFiles={['image/*', 'application/pdf']}
											dropzoneClass={classes.dropzoneAreaBaseClasses}
											onAdd={onDropBanner}
											filesLimit={1}
											dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
											showPreviews={false}
											showPreviewsInDropzone={false}
										/>
										<Box width="300px" style={{ marginTop: '10px' }}>
											<Grid container>
												{imagemBanner ? (
													<Grid item xs={6}>
														<Card className={classes.card}>
															<CardActionArea>
																<Box position="absolute">
																	<IconButton
																		onClick={() =>
																			handleExcluirArquivo(
																				imagemBanner
																			)
																		}
																		size="small"
																		style={{
																			color: 'white',
																			backgroundColor: 'red',
																		}}
																	>
																		<ClearIcon />
																	</IconButton>
																</Box>
																<CardMedia
																	component="img"
																	alt="Arquivo de Identificação"
																	height="100"
																	image={firstBanner.data}
																	onClick={() =>
																		window.open(
																			firstBanner.data
																		)
																	}
																/>
															</CardActionArea>
														</Card>
													</Grid>
												) : null}
											</Grid>
										</Box>
									</Box>
									<TextField
										error={errors.url ? errors.url : null}
										/* helperText={
											errors.url ? errors.url.join(' ') : null
										} */
										fullWidth
										style={{
											marginTop: '20px',
											color: APP_CONFIG.mainCollors.secondary,
											border: 'solid',
											borderRadius: '25px',
											borderWidth: '2px',
										}}
										InputLabelProps={{ shrink: true }}
										variant="outlined"
										placeholder="https://exemplo.com.br"
										label="Adicionar um link"
										value={urlBanner}
										onChange={(e) => setUrlBanner(e.target.value)}
									/>
									{errors.url ? (
										<FormHelperText
											style={{
												fontSize: 14,

												fontFamily: 'Montserrat-ExtraBold',
												color: 'red',
											}}
										>
											{errors.url.join(' ')}
										</FormHelperText>
									) : null}

									<Select
										required
										style={{
											marginTop: '20px',
											color: APP_CONFIG.mainCollors.secondary,
											border: 'solid',

											borderWidth: '2px',
										}}
										variant="outlined"
										fullWidth
										value={tipo}
										onChange={(e) => setTipo(e.target.value)}
									>
										<MenuItem
											value={' '}
											style={{
												color: APP_CONFIG.mainCollors.secondary,
											}}
										>
											Tipo
										</MenuItem>
										<MenuItem
											value={'home'}
											style={{
												color: APP_CONFIG.mainCollors.secondary,
											}}
										>
											Página inicial
										</MenuItem>
										<MenuItem
											value={'home_app_pf'}
											style={{
												color: APP_CONFIG.mainCollors.secondary,
											}}
										>
											Banner APP PF
										</MenuItem>
										<MenuItem
											value={'home_app_pj'}
											style={{
												color: APP_CONFIG.mainCollors.secondary,
											}}
										>
											Banner APP PJ
										</MenuItem>
										<MenuItem
											value={'home_web_pj'}
											style={{
												color: APP_CONFIG.mainCollors.secondary,
											}}
										>
											Banner Internet Banking PJ
										</MenuItem>
									</Select>
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
				{listaBanner.data && listaBanner.per_page ? (
					<CustomTable
						columns={columns}
						data={listaBanner.data}
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
						count={listaBanner.last_page}
						onChange={handleChangePage}
						page={page}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default ListaDeBanners;
