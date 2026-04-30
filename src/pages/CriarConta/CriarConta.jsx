import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	makeStyles,
	Paper,
	Step,
	StepLabel,
	Stepper,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';

import { DropzoneAreaBase } from 'material-ui-dropzone';
import ClearIcon from '@material-ui/icons/Clear';

import { PictureAsPdf } from '@material-ui/icons';
import CustomButton from '../../components/CustomButton/CustomButton';
import NewAccount from '../../components/NewAccount/NewAccount';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import {
	delDocumento,
	loadContaId,
	postDocumentoActionAdm,
} from '../../actions/actions';
import useAuth from '../../hooks/useAuth';
import NovaConta from '../NovaConta/NovaConta';
import { APP_CONFIG } from '../../constants/config';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
	layout: {
		width: '800px',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	card: {
		margin: theme.spacing(1),
		padding: 0,
	},
	paper: {
		backgroundColor: APP_CONFIG.mainCollors.backgrounds,
		marginBottom: theme.spacing(6),
		padding: theme.spacing(3),
		borderRadius: '27px',
		width: '850px',
		alignSelf: 'center',
		display: 'flex',
		flexDirection: 'column',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
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
		minHeight: '400px',
		fontSize: '12px',
	},
	textoDropzone: {
		fontSize: '1.2rem',
	},
}));

const STEPS = {
	DADOS_DA_CONTA: 'Dados da Conta',
	DOCUMENTOS: 'Documentos',
};

const CriarConta = () => {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const history = useHistory();
	const { id } = useParams();
	const token = useAuth();
	const [excluirId, setExcluirId] = useState('');
	const [loading, setLoading] = useState(false);
	const [errosConta, setErrosConta] = useState({});
	const [steps, setsteps] = useState([STEPS.DADOS_DA_CONTA, STEPS.DOCUMENTOS]);
	const [activeStep, setActiveStep] = useState(0);
	const [pessoaConfirmar, setPessoaConfirmar] = useState('');
	/* const [novaContaId, setNovaContaId] = useState(''); */
	const [novaContaId, setNovaContaId] = useState('');
	const [openModalExcluir, setOpenModalExcluir] = useState(false);
	const contaId = useSelector((state) => state.conta);
	const novaContaAdquirencia = useSelector(
		(state) => state.novaContaAdquirencia
	);
	const matches = useMediaQuery(theme.breakpoints.down('sm'));
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
		banco: ' ',
		agencia: '',
		conta: '',
	});

	useEffect(() => {
		console.log(conta?.banco?.id);
	}, [conta]);

	/* 	const handleClick = async () => {
		setLoading(true);
		setErrosConta({});

		if (activeStep === 0) {
			let newConta = conta;
			const resConta = await dispatch(postNewConta(newConta));
			if (resConta) {
				setErrosConta(getResponseError(resConta));
			} else {
				toast.success('Cadastro efetuado com sucesso!');
				setActiveStep(activeStep + 1);
			}
		}
		if (activeStep === 1) {
			history.push('/dashboard/contas');
		}

		setLoading(false);
	}; */

	/* const arquivoDocumento = useSelector((state) => state.arquivoDocumento);

	const contaCriada = useSelector((state) => state.conta);

	useEffect(() => {
		if (contaCriada?.id) {
			dispatch(loadDocumentos(contaCriada.id));
		}
	}, [contaCriada.id]); */

	useEffect(() => {
		dispatch(loadContaId(token, novaContaAdquirencia.id));
	}, [token, novaContaAdquirencia.id]);

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
			await dispatch(loadContaId(token, novaContaAdquirencia.id));
		}
	};

	const onDropCNHfrente = async (picture) => {
		setLoading(true);

		const categoria = 'CNH_FRENTE';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};

	const onDropCNHverso = async (picture) => {
		setLoading(true);

		const categoria = 'CNH_VERSO';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};

	const onDropRGfrente = async (picture) => {
		setLoading(true);

		const categoria = 'RG_FRENTE';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};

	const onDropRGverso = async (picture) => {
		setLoading(true);

		const categoria = 'RG_VERSO';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};

	const onDropSelfie = async (picture) => {
		setLoading(true);

		const categoria = 'SELFIE';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};

	const onDropCPF = async (picture) => {
		setLoading(true);

		const categoria = 'CPF';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};

	const onDropCartaoCNPJ = async (picture) => {
		setLoading(true);

		const categoria = 'CARTAO_CNPJ';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};
	const onDropContratoSocial = async (picture) => {
		setLoading(true);

		const categoria = 'PAGINA_CONTRATO_SOCIAL';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};
	const onDropPaginaProcuracao = async (picture) => {
		setLoading(true);

		const categoria = 'PAGINA_PROCURACAO';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};
	const onDropPaginaAtaEleicaoDiretores = async (picture) => {
		setLoading(true);

		const categoria = 'PAGINA_ATA_ELEICAO_DIRETORES';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};

	const onDropComprovanteFaturamento = async (picture) => {
		setLoading(true);

		const categoria = 'COMPROVANTE_FATURAMENTO';
		await dispatch(
			postDocumentoActionAdm(
				token,
				picture,
				categoria,
				novaContaAdquirencia.id
			)
		);
		await dispatch(loadContaId(token, novaContaAdquirencia.id));
		setLoading(false);
	};

	const STEPS_COMPONENTS = {
		[STEPS.DADOS_DA_CONTA]: (
			<NovaConta
				conta={conta}
				setConta={setConta}
				errosConta={errosConta}
				setErrosConta={setErrosConta}
				loading={loading}
				setLoading={setLoading}
				activeStep={activeStep}
				setActiveStep={setActiveStep}
				setPessoaConfirmar={setPessoaConfirmar}
			/>
		),
		[STEPS.DOCUMENTOS]: (
			<>
				{pessoaConfirmar === 'fisica' ? (
					<>
						<Grid container spacing={2} style={{ marginTop: '15px' }}>
							<Grid item sm={6} xs={12}>
								<Typography
									style={{
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
										marginTop: '0px',
									}}
								>
									RG FRENTE
								</Typography>
								<Box
									className={classes.dropzoneContainer}
									boxShadow={3}
								>
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
										onAdd={onDropRGfrente}
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
														item.categoria === 'RG_FRENTE' ? (
															<Grid item xs={6}>
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
									RG VERSO
								</Typography>
								<Box
									className={classes.dropzoneContainer}
									boxShadow={3}
								>
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
										onAdd={onDropRGverso}
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
														item.categoria === 'RG_VERSO' ? (
															<Grid item xs={6}>
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
						<Grid container spacing={2} style={{ marginTop: '15px' }}>
							<Grid item sm={6} xs={12}>
								<Typography
									style={{
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
										marginTop: '0px',
									}}
								>
									CNH FRENTE
								</Typography>
								<Box
									className={classes.dropzoneContainer}
									boxShadow={3}
								>
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
										onAdd={onDropCNHfrente}
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
														item.categoria === 'CNH_FRENTE' ? (
															<Grid item xs={6}>
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
									CNH VERSO
								</Typography>
								<Box
									className={classes.dropzoneContainer}
									boxShadow={3}
								>
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
										onAdd={onDropCNHverso}
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
														item.categoria === 'CNH_VERSO' ? (
															<Grid item xs={6}>
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
						<Grid container spacing={2} style={{ marginTop: '15px' }}>
							<Grid item sm={6} xs={12}>
								<Typography
									style={{
										fontFamily: 'Montserrat-Regular',
										fontSize: '14px',
										color: APP_CONFIG.mainCollors.primary,
										marginTop: '0px',
									}}
								>
									SELFIE
								</Typography>
								<Box
									className={classes.dropzoneContainer}
									boxShadow={3}
								>
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
										onAdd={onDropSelfie}
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
														item.categoria === 'SELFIE' ? (
															<Grid item xs={6}>
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
									Documento Complementar
								</Typography>
								<Box
									className={classes.dropzoneContainer}
									boxShadow={3}
								>
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
										onAdd={onDropCPF}
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
														item.categoria === 'CPF' ? (
															<Grid item xs={6}>
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
					</>
				) : pessoaConfirmar === 'juridica' ? (
					<>
						<Grid container spacing={2} style={{ marginTop: '15px' }}>
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
														item.categoria === 'CARTAO_CNPJ' ? (
															<Grid item xs={6}>
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
									Contrato social ou certificado de condição do MEI*
								</Typography>
								<Box
									className={classes.dropzoneContainer}
									boxShadow={3}
								>
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
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
						<Grid container spacing={2} style={{ marginTop: '15px' }}>
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
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																<Card className={classes.card}>
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
																						{item.status}
																					</Typography>
																					<Typography
																						style={{
																							color: '#F8D837',
																						}}
																					>
																						{item.rasao}
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
					</>
				) : null}
				<Box
					style={{
						display: 'flex',
						alignItems: 'center',
						alignSelf: 'center',
						marginTop: '30px',
					}}
				>
					<CustomButton
						color="purple"
						onClick={() =>
							history.push('/dashboard/lista-de-contas-adquirencia')
						}
					>
						Finalizar
					</CustomButton>
				</Box>
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
			</>
		),
	};

	return (
		<Box className={classes.root}>
			<LoadingScreen isLoading={loading} />
			<Paper className={classes.paper}>
				<Stepper
					className={classes.stepper}
					activeStep={activeStep}
					alternativeLabel
					style={{ backgroundColor: APP_CONFIG.mainCollors.backgrounds }}
				>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{STEPS_COMPONENTS[steps[activeStep]]}
				{/* <Box alignSelf="flex-end" marginTop="16px">
					<CustomButton

					onClick={handleClick}
					>
						{activeStep === 0 ? 'Cadastrar' : 'Finalizar'}
					</CustomButton>
				</Box> */}
			</Paper>
		</Box>
	);
};
export default CriarConta;
