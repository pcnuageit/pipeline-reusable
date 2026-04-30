import {
	Box,
	Typography,
	useTheme,
	useMediaQuery,
	Paper,
	AppBar,
	Tabs,
	Tab,
	Grid,
	Card,
	CardActionArea,
	IconButton,
	CardMedia,
	LinearProgress,
	Menu,
	MenuItem,
	Checkbox,
	Modal,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@material-ui/core';
import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../components/CustomButton/CustomButton';
/* import CustomHeader from '../../components/CustomHeader/CustomHeader'; */
import { getCep } from '../../services/services';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import CheckIcon from '@material-ui/icons/Check';

import {
	updateConta,
	loadContaId,
	loadUserData,
	deleteUserRepresentanteAction,
	postUserRepresentanteAction,
	getReenviarTokenUsuarioAction,
	postDocumentoActionAdm,
	getContaEmpresaAction,
	getSincronizarContaAction,
	delDocumento,
} from '../../actions/actions';
import useAuth from '../../hooks/useAuth';

import { DropzoneAreaBase } from 'material-ui-dropzone';
import ClearIcon from '@material-ui/icons/Clear';
import SwipeableViews from 'react-swipeable-views';
import NewAccount from '../../components/NewAccount/NewAccount';
import useDebounce from '../../hooks/useDebounce';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CustomTable from '../../components/CustomTable/CustomTable';
import SettingsIcon from '@material-ui/icons/Settings';
import CustomCloseButton from '../../components/CustomCloseButton/CustomCloseButton';
import ReactInputMask from 'react-input-mask';
import { APP_CONFIG } from '../../constants/config';
import CustomCollapseTable from '../../components/CustomCollapseTable/CustomCollapseTable';
import CustomCollapseTableEdit from '../../components/CustomCollapseTableEdit/CustomCollapseTableEdit';
import CustomCollapseTableEmpresa from '../../components/CustomCollapseTableEmpresa/CustomCollapseTable';
import CustomCollapseTableEditSocios from '../../components/CustomCollapseTableEditSocios/CustomCollapseTableEditSocios';
import CustomCollapseTableEditDocumentosRepresentantes from '../../components/CustomCollapseTableEditDocumentosRepresentantes/CustomCollapseTableEditDocumentosRepresentantes';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',

		/* flexGrow: 1, */
		/* width: '100vw',
		height: '100vh', */
	},
	main: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		padding: '10px',
	},
	header: {
		display: 'flex',
		alignContent: 'center',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%',
	},
	dadosBox: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '0px',

		width: '100%',
	},

	paper: {
		backgroundColor: APP_CONFIG.mainCollors.backgrounds,
		display: 'flex',
		flexDirection: 'column',

		borderRadius: '0px',
		alignSelf: 'center',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
	card: {
		margin: theme.spacing(1),
		padding: 0,
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

	indicator: {
		color: 'black',
	},

	media: {
		padding: '135px',
	},
	modal: {
		position: 'absolute',
		top: '55%',
		left: '85%',
		transform: 'translate(-50%, -50%)',
		width: '30%',
		height: '110%',
		backgroundColor: '#F6F6FA',
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 5,
	},
}));

const a11yProps = (index) => {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
};

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
};
export default function EditarDadosDaContaPjAdquirencia() {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const history = useHistory();
	const { id } = useParams();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
	const token = useAuth();
	const [loading, setLoading] = useState(false);
	const contaId = useSelector((state) => state.conta);
	const userData = useSelector((state) => state.userData);
	const [value, setValue] = useState(0);

	const [errosConta, setErrosConta] = useState({});

	const [filters, setFilters] = useState({
		like: '',
	});
	const debouncedLike = useDebounce(filters.like, 500);
	const [conta, setConta] = useState({
		documento: '',
		cnpj: '',
		razao_social: '',
		nome: '',
		nome_mae: '',
		nome_pai: '',
		sexo: ' ',
		estado_civil: ' ',
		uf_naturalidade: '',
		cidade_naturalidade: '',
		numero_documento: '',
		uf_documento: '',
		data_emissao: '',
		renda_mensal: '',
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

	const [openModalExcluir, setOpenModalExcluir] = useState(false);
	const [excluirId, setExcluirId] = useState('');

	useEffect(() => {
		setConta({ ...contaId });
	}, [contaId]);

	useEffect(() => {
		dispatch(loadUserData(token));
	}, [token]);

	useEffect(() => {
		dispatch(loadContaId(token, id));
	}, [userData]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleChangeIndex = (index) => {
		setValue(index);
	};

	const getIndicatorColor = (index) =>
		index === value ? `2px solid ${APP_CONFIG.mainCollors.primary}` : null;

	const onDropCartaoCNPJ = async (picture) => {
		setLoading(true);

		const categoria = 'CARTAO_CNPJ';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id));
		setLoading(false);
	};
	const onDropContratoSocial = async (picture) => {
		setLoading(true);

		const categoria = 'PAGINA_CONTRATO_SOCIAL';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id));
		setLoading(false);
	};
	const onDropPaginaProcuracao = async (picture) => {
		setLoading(true);

		const categoria = 'PAGINA_PROCURACAO';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id));
		setLoading(false);
	};
	const onDropPaginaAtaEleicaoDiretores = async (picture) => {
		setLoading(true);

		const categoria = 'PAGINA_ATA_ELEICAO_DIRETORES';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id));
		setLoading(false);
	};

	const onDropComprovanteFaturamento = async (picture) => {
		setLoading(true);

		const categoria = 'COMPROVANTE_FATURAMENTO';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id));
		setLoading(false);
	};
	//documentos PJ

	const handleExcluirArquivo = async (item) => {
		setLoading(true);
		const resExcluirArquivo = await dispatch(delDocumento(token, excluirId));
		if (resExcluirArquivo) {
			toast.error('Erro ao excluir documento');
			setLoading(false);
		} else {
			toast.success('Documento excluído com sucesso!');
			setLoading(false);
			setOpenModalExcluir(false);
			await dispatch(loadContaId(token, id));
		}
	};

	const handleAlterar = async () => {
		setLoading(true);
		const resConta = await dispatch(updateConta(token, conta, id));
		if (resConta) {
			setErrosConta(resConta);
			toast.error('Erro ao alterar dados');
			setLoading(false);
		} else {
			toast.success('Dados alterados com sucesso!');
			setLoading(false);
			await dispatch(loadContaId(token, id));
		}
	};

	const handleSincronizarDados = async () => {
		setLoading(true);
		const resSincronizar = await dispatch(
			getSincronizarContaAction(token, id)
		);
		if (resSincronizar) {
			toast.error('Erro ao sincronizar dados');
			setLoading(false);
		} else {
			toast.success('Dados sincronizados com sucesso!');
			setLoading(false);
			dispatch(loadContaId(token, id));
		}
	};

	const EditarSocio = (row) => {
		return null;
	};

	const Editar = (row) => {
		<></>;
	};

	return (
		<Box className={classes.root}>
			<LoadingScreen isLoading={loading} />

			<Box className={classes.main}>
				<Box className={classes.dadosBox}>
					<Paper
						className={classes.paper}
						style={{
							width: '100%',
							borderTopRightRadius: 27,
							borderTopLeftRadius: 27,
						}}
					>
						<AppBar
							position="static"
							color="default"
							style={{
								backgroundColor: APP_CONFIG.mainCollors.backgrounds,
								borderTopRightRadius: 27,
								borderTopLeftRadius: 27,
							}}
						>
							<Tabs
								style={{
									color: APP_CONFIG.mainCollors.primary,
									borderBottom: `1px solid ${APP_CONFIG.mainCollors.primary}`,
								}}
								value={value}
								onChange={handleChange}
								indicatorcolor={APP_CONFIG.mainCollors.primary}
								//textColor="primary"
								variant="fullWidth"
							>
								<Tab
									label="Dados Cadastrais"
									style={{
										width: '200%',
										borderBottom: getIndicatorColor(0),
									}}
									{...a11yProps(0)}
								/>
								<Tab
									label="Documentos"
									style={{
										width: '200%',
										borderBottom: getIndicatorColor(1),
									}}
									{...a11yProps(1)}
								/>
							</Tabs>
						</AppBar>
						<SwipeableViews
							axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
							index={value}
							onChangeIndex={handleChangeIndex}
						>
							<TabPanel value={value} index={0} dir={theme.direction}>
								<NewAccount
									conta={conta}
									setConta={setConta}
									errosConta={errosConta}
									disableEditar={false}
								/>
								<Box
									display="flex"
									justifyContent="flex-end"
									marginTop="16px"
								>
									{contaId &&
									(contaId.status === 'divergence' ||
										contaId.status === 'pending' ||
										contaId.status === 'incomplete') ? (
										<CustomButton onClick={handleAlterar}>
											Alterar
										</CustomButton>
									) : (
										<Box
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'flex-end',
											}}
										>
											<Typography
												style={{
													fontFamily: 'Montserrat-Regular',
													fontSize: '14px',
													color: APP_CONFIG.mainCollors.primary,
												}}
											>
												Para alteração de dados cadastrais em contas
												aprovadas, será necessário solicitação via
												ticket no zendesk.
											</Typography>
											<Box style={{ marginTop: '10px' }}>
												<CustomButton
													onClick={handleSincronizarDados}
												>
													Sincronizar Dados
												</CustomButton>
											</Box>
										</Box>
									)}
								</Box>
							</TabPanel>
							<TabPanel value={value} index={1} dir={theme.direction}>
								<Grid
									container
									spacing={2}
									style={{ marginTop: '15px' }}
								>
									<Grid item sm={6} xs={12}>
										<Typography
											style={{
												fontFamily: 'Montserrat-Regular',
												fontSize: '14px',
												color: APP_CONFIG.mainCollors.primary,
												marginTop: '0px',
											}}
										>
											Cartão CNPJ*
										</Typography>
										<Box
											className={classes.dropzoneContainer}
											boxShadow={3}
										>
											<DropzoneAreaBase
												dropzoneParagraphClass={
													classes.textoDropzone
												}
												maxFileSize={3145728}
												onDropRejected={() => {
													toast.error('Tamanho máximo: 3mb ');
													toast.error(
														'Arquivos suportados: .pdf .png .jpg .jpeg'
													);
												}}
												acceptedFiles={[
													'image/*',
													'application/pdf',
												]}
												dropzoneClass={
													classes.dropzoneAreaBaseClasses
												}
												onAdd={onDropCartaoCNPJ}
												filesLimit={1}
												dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
												showPreviews={false}
												showPreviewsInDropzone={false}
											/>
											<Box width="300px">
												<Grid container>
													{contaId.documentos &&
													contaId.documentos.length > 0
														? contaId.documentos.map((item) =>
																item.categoria ===
																'CARTAO_CNPJ' ? (
																	<Grid item xs={6}>
																		<Card
																			className={
																				classes.card
																			}
																		>
																			<CardActionArea>
																				<Box position="absolute">
																					<IconButton
																						onClick={() => {
																							setOpenModalExcluir(
																								true
																							);
																							setExcluirId(
																								item?.id
																							);
																						}}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box>
																				{item.arquivo.includes(
																					'.pdf'
																				) ? (
																					<>
																						<Box
																							style={{
																								display:
																									'flex',
																								alignItems:
																									'center',
																								justifyContent:
																									'center',
																								height:
																									'100px',
																							}}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						>
																							<PictureAsPdfIcon
																								style={{
																									color: 'black',
																									fontSize:
																										'70px',
																								}}
																							/>
																						</Box>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				) : (
																					<>
																						<CardMedia
																							component="img"
																							alt="Arquivo de Identificação"
																							height="100"
																							image={
																								item.arquivo
																							}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						/>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				)}
																			</CardActionArea>
																		</Card>
																	</Grid>
																) : (
																	false
																)
														  )
														: null}
												</Grid>
											</Box>
										</Box>
									</Grid>
									<Grid item sm={6} xs={12}>
										<Typography
											style={{
												fontFamily: 'Montserrat-Regular',
												fontSize: '12px',
												color: APP_CONFIG.mainCollors.primary,
												marginTop: '0px',
											}}
										>
											Contrato social ou certificado de condição do
											MEI*
										</Typography>
										<Box
											className={classes.dropzoneContainer}
											boxShadow={3}
										>
											<DropzoneAreaBase
												dropzoneParagraphClass={
													classes.textoDropzone
												}
												maxFileSize={3145728}
												onDropRejected={() => {
													toast.error('Tamanho máximo: 3mb ');
													toast.error(
														'Arquivos suportados: .pdf .png .jpg .jpeg'
													);
												}}
												acceptedFiles={[
													'image/*',
													'application/pdf',
												]}
												dropzoneClass={
													classes.dropzoneAreaBaseClasses
												}
												onAdd={onDropContratoSocial}
												filesLimit={1}
												dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
												showPreviews={false}
												showPreviewsInDropzone={false}
											/>
											<Box width="300px">
												<Grid container>
													{contaId.documentos &&
													contaId.documentos.length > 0
														? contaId.documentos.map((item) =>
																item.categoria ===
																'PAGINA_CONTRATO_SOCIAL' ? (
																	<Grid item xs={6}>
																		<Card
																			className={
																				classes.card
																			}
																		>
																			<CardActionArea>
																				<Box position="absolute">
																					<IconButton
																						onClick={() => {
																							setOpenModalExcluir(
																								true
																							);
																							setExcluirId(
																								item?.id
																							);
																						}}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box>
																				{item.arquivo.includes(
																					'.pdf'
																				) ? (
																					<>
																						<Box
																							style={{
																								display:
																									'flex',
																								alignItems:
																									'center',
																								justifyContent:
																									'center',
																								height:
																									'100px',
																							}}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						>
																							<PictureAsPdfIcon
																								style={{
																									color: 'black',
																									fontSize:
																										'70px',
																								}}
																							/>
																						</Box>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				) : (
																					<>
																						<CardMedia
																							component="img"
																							alt="Arquivo de Identificação"
																							height="100"
																							image={
																								item.arquivo
																							}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						/>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				)}
																			</CardActionArea>
																		</Card>
																	</Grid>
																) : (
																	false
																)
														  )
														: null}
												</Grid>
											</Box>
										</Box>
									</Grid>
								</Grid>
								<Grid
									container
									spacing={2}
									style={{ marginTop: '15px' }}
								>
									<Grid item sm={6} xs={12}>
										<Typography
											style={{
												fontFamily: 'Montserrat-Regular',
												fontSize: '14px',
												color: APP_CONFIG.mainCollors.primary,
												marginTop: '0px',
											}}
										>
											Procurações (se houver)
										</Typography>
										<Box
											className={classes.dropzoneContainer}
											boxShadow={3}
										>
											<DropzoneAreaBase
												dropzoneParagraphClass={
													classes.textoDropzone
												}
												maxFileSize={3145728}
												onDropRejected={() => {
													toast.error('Tamanho máximo: 3mb ');
													toast.error(
														'Arquivos suportados: .pdf .png .jpg .jpeg'
													);
												}}
												acceptedFiles={[
													'image/*',
													'application/pdf',
												]}
												dropzoneClass={
													classes.dropzoneAreaBaseClasses
												}
												onAdd={onDropPaginaProcuracao}
												filesLimit={1}
												dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
												showPreviews={false}
												showPreviewsInDropzone={false}
											/>
											<Box width="300px">
												<Grid container>
													{contaId.documentos &&
													contaId.documentos.length > 0
														? contaId.documentos.map((item) =>
																item.categoria ===
																'PAGINA_PROCURACAO' ? (
																	<Grid item xs={6}>
																		<Card
																			className={
																				classes.card
																			}
																		>
																			<CardActionArea>
																				<Box position="absolute">
																					<IconButton
																						onClick={() => {
																							setOpenModalExcluir(
																								true
																							);
																							setExcluirId(
																								item?.id
																							);
																						}}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box>
																				{item.arquivo.includes(
																					'.pdf'
																				) ? (
																					<>
																						<Box
																							style={{
																								display:
																									'flex',
																								alignItems:
																									'center',
																								justifyContent:
																									'center',
																								height:
																									'100px',
																							}}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						>
																							<PictureAsPdfIcon
																								style={{
																									color: 'black',
																									fontSize:
																										'70px',
																								}}
																							/>
																						</Box>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				) : (
																					<>
																						<CardMedia
																							component="img"
																							alt="Arquivo de Identificação"
																							height="100"
																							image={
																								item.arquivo
																							}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						/>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				)}
																			</CardActionArea>
																		</Card>
																	</Grid>
																) : (
																	false
																)
														  )
														: null}
												</Grid>
											</Box>
										</Box>
									</Grid>
									<Grid item sm={6} xs={12}>
										<Typography
											style={{
												fontFamily: 'Montserrat-Regular',
												fontSize: '14px',
												color: APP_CONFIG.mainCollors.primary,
												marginTop: '0px',
											}}
										>
											Ata de procuração da diretoria (se houver)
										</Typography>
										<Box
											className={classes.dropzoneContainer}
											boxShadow={3}
										>
											<DropzoneAreaBase
												dropzoneParagraphClass={
													classes.textoDropzone
												}
												maxFileSize={3145728}
												onDropRejected={() => {
													toast.error('Tamanho máximo: 3mb ');
													toast.error(
														'Arquivos suportados: .pdf .png .jpg .jpeg'
													);
												}}
												acceptedFiles={[
													'image/*',
													'application/pdf',
												]}
												dropzoneClass={
													classes.dropzoneAreaBaseClasses
												}
												onAdd={onDropPaginaAtaEleicaoDiretores}
												filesLimit={1}
												dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
												showPreviews={false}
												showPreviewsInDropzone={false}
											/>
											<Box width="300px">
												<Grid container>
													{contaId.documentos &&
													contaId.documentos.length > 0
														? contaId.documentos.map((item) =>
																item.categoria ===
																'PAGINA_ATA_ELEICAO_DIRETORES' ? (
																	<Grid item xs={6}>
																		<Card
																			className={
																				classes.card
																			}
																		>
																			<CardActionArea>
																				<Box position="absolute">
																					<IconButton
																						onClick={() => {
																							setOpenModalExcluir(
																								true
																							);
																							setExcluirId(
																								item?.id
																							);
																						}}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box>
																				{item.arquivo.includes(
																					'.pdf'
																				) ? (
																					<>
																						<Box
																							style={{
																								display:
																									'flex',
																								alignItems:
																									'center',
																								justifyContent:
																									'center',
																								height:
																									'100px',
																							}}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						>
																							<PictureAsPdfIcon
																								style={{
																									color: 'black',
																									fontSize:
																										'70px',
																								}}
																							/>
																						</Box>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				) : (
																					<>
																						<CardMedia
																							component="img"
																							alt="Arquivo de Identificação"
																							height="100"
																							image={
																								item.arquivo
																							}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						/>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				)}
																			</CardActionArea>
																		</Card>
																	</Grid>
																) : (
																	false
																)
														  )
														: null}
												</Grid>
											</Box>
										</Box>
									</Grid>
									<Grid item sm={6} xs={12}>
										<Typography
											style={{
												fontFamily: 'Montserrat-Regular',
												fontSize: '14px',
												color: APP_CONFIG.mainCollors.primary,
												marginTop: '0px',
											}}
										>
											Comprovante de Faturamento*
										</Typography>
										<Box
											className={classes.dropzoneContainer}
											boxShadow={3}
										>
											<DropzoneAreaBase
												dropzoneParagraphClass={
													classes.textoDropzone
												}
												maxFileSize={3145728}
												onDropRejected={() => {
													toast.error('Tamanho máximo: 3mb ');
													toast.error(
														'Arquivos suportados: .pdf .png .jpg .jpeg'
													);
												}}
												acceptedFiles={[
													'image/*',
													'application/pdf',
												]}
												dropzoneClass={
													classes.dropzoneAreaBaseClasses
												}
												onAdd={onDropComprovanteFaturamento}
												filesLimit={1}
												dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
												showPreviews={false}
												showPreviewsInDropzone={false}
											/>
											<Box width="300px">
												<Grid container>
													{contaId.documentos &&
													contaId.documentos.length > 0
														? contaId.documentos.map((item) =>
																item.categoria ===
																'COMPROVANTE_FATURAMENTO' ? (
																	<Grid item xs={6}>
																		<Card
																			className={
																				classes.card
																			}
																		>
																			<CardActionArea>
																				<Box position="absolute">
																					<IconButton
																						onClick={() => {
																							setOpenModalExcluir(
																								true
																							);
																							setExcluirId(
																								item?.id
																							);
																						}}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box>
																				{item.arquivo.includes(
																					'.pdf'
																				) ? (
																					<>
																						<Box
																							style={{
																								display:
																									'flex',
																								alignItems:
																									'center',
																								justifyContent:
																									'center',
																								height:
																									'100px',
																							}}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						>
																							<PictureAsPdfIcon
																								style={{
																									color: 'black',
																									fontSize:
																										'70px',
																								}}
																							/>
																						</Box>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				) : (
																					<>
																						<CardMedia
																							component="img"
																							alt="Arquivo de Identificação"
																							height="100"
																							image={
																								item.arquivo
																							}
																							onClick={() =>
																								window.open(
																									item.arquivo
																								)
																							}
																						/>
																						<Box
																							style={{
																								padding:
																									'10px',
																							}}
																						>
																							<Typography
																								style={{
																									color:
																										item.status ===
																										'Aguardando validação'
																											? '#F8D837'
																											: item.status ===
																											  'Validado'
																											? '#3EBA59'
																											: item.status ===
																											  'Inválido'
																											? '#B54444'
																											: item.status ===
																											  'Expirado'
																											? '#B54444'
																											: item.status ===
																											  'Enviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reenviado'
																											? '#3EBA59'
																											: item.status ===
																											  'Reprovado'
																											? '#B54444'
																											: item.status ===
																											  'Erro'
																											? '#B54444'
																											: item.status ===
																											  'Inexistente'
																											? '#B54444'
																											: item.status ===
																											  'Suspenso'
																											? '#F8D837'
																											: item.status ===
																											  'Resultado da tipificação'
																											? '#F8D837'
																											: null,
																								}}
																							>
																								{
																									item.status
																								}
																							</Typography>
																							<Typography
																								style={{
																									color: '#F8D837',
																								}}
																							>
																								{
																									item.rasao
																								}
																							</Typography>
																						</Box>
																					</>
																				)}
																			</CardActionArea>
																		</Card>
																	</Grid>
																) : (
																	false
																)
														  )
														: null}
												</Grid>
											</Box>
										</Box>
									</Grid>
								</Grid>
								<Dialog
									open={openModalExcluir}
									onClose={() => setOpenModalExcluir(false)}
									aria-labelledby="form-dialog-title"
									fullWidth
								>
									<DialogTitle
										style={{
											color: APP_CONFIG.mainCollors.primary,
											fontFamily: 'Montserrat-SemiBold',
										}}
									>
										Deseja excluir esse documento?
									</DialogTitle>

									<DialogContent
										style={{
											minWidth: 500,
										}}
									></DialogContent>

									<DialogActions>
										<Button
											color="primary"
											variant="outlined"
											onClick={() => handleExcluirArquivo()}
											style={{ marginRight: '10px' }}
										>
											Sim
										</Button>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => {
												setOpenModalExcluir(false);
												setExcluirId('');
											}}
										>
											Cancelar
										</Button>
									</DialogActions>
								</Dialog>
							</TabPanel>
						</SwipeableViews>
					</Paper>
				</Box>
			</Box>
		</Box>
	);
}
