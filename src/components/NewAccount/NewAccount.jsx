import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	makeStyles,
	Modal,
	TextField,
	Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
	clearPreContaID,
	getEnviarFitbankAction,
	getSincronizarContaAction,
	loadContaId,
	loadPermissao,
	loadPreContaId,
	postAuthMeAction,
} from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import InputMask from 'react-input-mask';
import { getCep } from '../../services/services';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import PersonIcon from '@material-ui/icons/Person';
import { APP_CONFIG } from '../../constants/config';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import moment from 'moment';
import 'moment/locale/pt-br';
import CurrencyInput from 'react-currency-input';

const NewAccount = ({
	conta,

	setConta,
	errosConta,
	disableEditar,
	preConta,
}) => {
	const dispatch = useDispatch();
	const token = useAuth();
	const me = useSelector((state) => state.me);
	const contaId = useSelector((state) => state.conta);
	const userPermissao = useSelector((state) => state.userPermissao);
	const [permissoes, setPermissoes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openModalDivergencia, setOpenModalDivergencia] = useState(false);

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

	const [pessoaJuridica, setPessoaJuridica] = useState(false);
	const handlerCep = async () => {
		try {
			const response = await getCep(conta.endereco.cep);
			setConta({
				...conta,
				endereco: {
					...conta.endereco,
					cep: response.data.cep,
					rua: response.data.logradouro,
					complemento: response.data.complemento,
					bairro: response.data.bairro,
					cidade: response.data.localidade,
					estado: response.data.uf,
				},
			});
		} catch (error) {
			toast.error('Error ao puxar dados do cep');
		}
	};

	const handleEnviarFitbank = async () => {
		setLoading(true);
		const resEnviarFitbank = await dispatch(
			getEnviarFitbankAction(token, conta.id)
		);
		if (resEnviarFitbank) {
			toast.error('Erro ao enviar para FITBANK');
			setLoading(false);
		} else {
			toast.success('Conta enviada para FITBANK');
			setLoading(false);
		}
	};

	const handleSincronizarDados = async () => {
		setLoading(true);
		const resSincronizar = await dispatch(
			getSincronizarContaAction(token, conta.id)
		);
		if (resSincronizar) {
			toast.error('Erro ao sincronizar dados');
			setLoading(false);
		} else {
			toast.success('Dados sincronizados com sucesso!');
			setLoading(false);
			dispatch(loadContaId(token, conta.id));
		}
	};

	useEffect(() => {
		return () => {
			dispatch(clearPreContaID());
		};
	}, []);

	return conta ? (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			style={{ backgroundColor: APP_CONFIG.mainCollors.backgrounds }}
		>
			<LoadingScreen isLoading={loading} />
			<Box
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Box
					style={{
						height: '100px',
						width: '100px',
						display: 'flex',
						justifyContent: 'center',
						borderRadius: 50,
						background: APP_CONFIG.mainCollors.primaryGradient,
					}}
				>
					<PersonIcon
						style={{
							alignSelf: 'center',
							fontSize: '40px',
							color: 'white',
						}}
					/>
				</Box>
				<Box style={{ marginLeft: '30px' }}>
					{conta.tipo === 'Pessoa Jurídica' ? (
						<Typography
							align="left"
							style={{
								marginTop: '12px',
								color: APP_CONFIG.mainCollors.primary,
							}}
						>
							{conta.razao_social && conta.razao_social}
						</Typography>
					) : (
						<Typography
							align="left"
							style={{
								marginTop: '12px',
								color: APP_CONFIG.mainCollors.primary,
							}}
						>
							{conta.nome}
						</Typography>
					)}

					<Box>
						{conta.tipo === 'Pessoa Jurídica' ? (
							<Button
								disabled={disableEditar}
								style={{
									margin: '5px',
									borderRadius: '27px',
									color: '#009838',
									backgroundColor: '#C9E0D8',
								}}
								variant="contained"
								color="secondary"
								/* onClick={() => setPessoaJuridica(true)} */
							>
								Pessoa Jurídica
							</Button>
						) : (
							<Button
								disabled={disableEditar}
								variant="contained"
								style={{
									margin: '5px',
									borderRadius: '27px',
									backgroundColor: '#C9DBF2',
									color: '#75B1ED',
								}}
								/* onClick={() => setPessoaJuridica(false)} */
							>
								Pessoa Física
							</Button>
						)}
					</Box>
				</Box>
				<Box style={{ marginLeft: '30px' }}>
					<Box>
						<Typography
							style={{
								color: APP_CONFIG.mainCollors.secondary,
								fontSize: 12,
							}}
						>
							E-mail
						</Typography>
						<Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
							{conta.email}
						</Typography>
					</Box>
					<Box>
						<Typography
							style={{
								color: APP_CONFIG.mainCollors.secondary,
								fontSize: 12,
							}}
						>
							Celular
						</Typography>
						<Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
							{conta.celular}
						</Typography>
					</Box>
				</Box>
				<Box
					style={{
						display: 'flex',
						flexDirection: 'row',

						marginLeft: '20px',
					}}
				>
					<Box>
						<Box style={{ display: 'flex' }}>
							<Typography
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Primeiro acesso
							</Typography>
							<Box>
								{conta.user && conta.user.verificacao ? (
									<CheckIcon
										style={{ color: 'green', marginLeft: '10px' }}
									/>
								) : conta.user && conta.user.verificacao === false ? (
									<ClearIcon
										style={{ color: 'red', marginLeft: '10px' }}
									/>
								) : conta.user === null ? (
									<ClearIcon
										style={{ color: 'red', marginLeft: '10px' }}
									/>
								) : null}
							</Box>
						</Box>
						<Box style={{ display: 'flex' }}>
							<Typography
								style={{ color: APP_CONFIG.mainCollors.secondary }}
							>
								Onboarding Sócio
							</Typography>
							<Box>
								{conta.idwall_id ? (
									<CheckIcon
										style={{ color: 'green', marginLeft: '10px' }}
									/>
								) : (
									<ClearIcon
										style={{ color: 'red', marginLeft: '10px' }}
									/>
								)}
							</Box>
						</Box>

						<Box
							style={{
								display: 'flex',
								alignSelf: 'center',
								marginTop: '25px',
							}}
						>
							{contaId &&
							contaId.documentos[0] &&
							contaId.fitbank_account_key === null &&
							contaId.status !== 'denied' ? (
								<Button
									style={{
										margin: '5px',
										borderRadius: '27px',
										backgroundColor:
											APP_CONFIG.mainCollors.disabledTextfields,
										color: APP_CONFIG.mainCollors.primary,
									}}
									onClick={() => handleEnviarFitbank()}
								>
									<Typography style={{ fontSize: 12 }}>
										Enviar Fitbank
									</Typography>
								</Button>
							) : null}
							{contaId.status === 'pending' ? (
								<Box>
									<Button
										style={{
											margin: '5px',
											borderRadius: '27px',
											backgroundColor:
												APP_CONFIG.mainCollors.disabledTextfields,
											color: APP_CONFIG.mainCollors.primary,
										}}
										onClick={() => handleSincronizarDados()}
									>
										<Typography style={{ fontSize: 12 }}>
											Sincronizar Dados
										</Typography>
									</Button>
								</Box>
							) : null}
						</Box>
					</Box>
				</Box>
			</Box>
			<form>
				<Box
					width="100%"
					display="flex"
					flexDirection="column"
					alignItems="center"
					style={{ marginTop: '20px' }}
				>
					<Grid container spacing={3}>
						<Grid item sm={4} xs={12}>
							<InputMask
								disabled={disableEditar}
								mask={'999.999.999-99'}
								value={conta.documento}
								onChange={(e) =>
									setConta({
										...conta,
										documento: e.target.value,
									})
								}
							>
								{() => (
									<TextField
										style={{
											border:
												conta &&
												conta.motivo_divergence &&
												conta.motivo_divergence.CPF === false
													? '1px solid red'
													: 'none',
											borderRadius: '27px',
										}}
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										disabled={disableEditar}
										error={errosConta.documento}
										helperText={
											errosConta.documento
												? errosConta.documento.join(' ')
												: null
										}
										name="documento"
										fullWidth
										required
										label={'CPF'}
									/>
								)}
							</InputMask>
						</Grid>
						<Grid item xs={12} sm={8}>
							<TextField
								style={{
									border:
										conta &&
										conta.motivo_divergence &&
										conta.motivo_divergence.Nome === false
											? '1px solid red'
											: 'none',
									borderRadius: '27px',
								}}
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								error={errosConta.nome}
								helperText={
									errosConta.nome ? errosConta.nome.join(' ') : null
								}
								value={conta.nome}
								onChange={(e) =>
									setConta({
										...conta,
										nome: e.target.value,
									})
								}
								fullWidth
								required
								label={'Primeiro e Segundo nome'}
							/>
						</Grid>
						{pessoaJuridica || conta.tipo === 'Pessoa Jurídica' ? (
							<>
								<Grid item sm={4} xs={12}>
									<InputMask
										disabled={disableEditar}
										mask={'99.999.999/9999-99'}
										value={conta.cnpj}
										onChange={(e) =>
											setConta({
												...conta,
												cnpj: e.target.value,
											})
										}
									>
										{() => (
											<TextField
												variant="outlined"
												InputLabelProps={{ shrink: true }}
												disabled={disableEditar}
												error={errosConta.cnpj}
												helperText={
													errosConta.cnpj
														? errosConta.cnpj.join(' ')
														: null
												}
												name="CNPJ"
												fullWidth
												required
												label={'CNPJ'}
											/>
										)}
									</InputMask>
								</Grid>
								<Grid item xs={12} sm={8}>
									<TextField
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										error={errosConta.razao_social}
										helperText={
											errosConta.razao_social
												? errosConta.razao_social.join(' ')
												: null
										}
										value={conta.razao_social}
										onChange={(e) =>
											setConta({
												...conta,
												razao_social: e.target.value,
											})
										}
										fullWidth
										required
										label={'Razao Social'}
									/>
								</Grid>
							</>
						) : null}
						<Grid item sm={4} xs={12}>
							<TextField
								style={{
									border:
										conta &&
										conta.motivo_divergence &&
										conta.motivo_divergence.Data_de_Nascimento ===
											false
											? '1px solid red'
											: 'none',
									borderRadius: '27px',
								}}
								variant="outlined"
								/* disabled={disableEditar} */
								error={errosConta.data_nascimento}
								helperText={
									errosConta.data_nascimento
										? errosConta.data_nascimento.join(' ')
										: null
								}
								fullWidth
								InputLabelProps={{
									shrink: true,
									pattern: '',
								}}
								type="date"
								label="Data de Nascimento"
								value={conta.data_nascimento}
								onChange={(e) =>
									setConta({
										...conta,
										data_nascimento: e.target.value,
									})
								}
							/>
						</Grid>
						<Grid item sm={4} xs={12}>
							<InputMask
								mask="99999-999"
								maskChar=" "
								value={conta.endereco.cep}
								onChange={(e) =>
									setConta({
										...conta,
										endereco: {
											...conta.endereco,
											cep: e.target.value,
										},
									})
								}
								onBlur={handlerCep}
							>
								{() => (
									<TextField
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										error={errosConta['endereco.cep']}
										helperText={
											errosConta['endereco.cep']
												? errosConta['endereco.cep'].join(' ')
												: null
										}
										fullWidth
										required
										label="CEP"
									/>
								)}
							</InputMask>
						</Grid>
						<Grid item sm={4} xs={12}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								error={errosConta['endereco.rua']}
								helperText={
									errosConta['endereco.rua']
										? errosConta['endereco.rua'].join(' ')
										: null
								}
								value={conta.endereco.rua}
								onChange={(e) =>
									setConta({
										...conta,
										endereco: {
											...conta.endereco,
											rua: e.target.value,
										},
									})
								}
								fullWidth
								required
								label="Rua"
							/>
						</Grid>
						<Grid item sm={2} xs={12}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								error={errosConta['endereco.numero']}
								helperText={
									errosConta['endereco.numero']
										? errosConta['endereco.numero'].join(' ')
										: null
								}
								value={conta.endereco.numero}
								onChange={(e) =>
									setConta({
										...conta,
										endereco: {
											...conta.endereco,
											numero: e.target.value,
										},
									})
								}
								fullWidth
								label="Número"
							/>
						</Grid>
						<Grid item xs={12} sm={5}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								error={errosConta['endereco.bairro']}
								helperText={
									errosConta['endereco.bairro']
										? errosConta['endereco.bairro'].join(' ')
										: null
								}
								value={conta.endereco.bairro}
								onChange={(e) =>
									setConta({
										...conta,
										endereco: {
											...conta.endereco,
											bairro: e.target.value,
										},
									})
								}
								fullWidth
								required
								label="Bairro"
							/>
						</Grid>
						<Grid item xs={12} sm={5}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								value={conta.endereco.complemento}
								onChange={(e) =>
									setConta({
										...conta,
										endereco: {
											...conta.endereco,
											complemento: e.target.value,
										},
									})
								}
								fullWidth
								label="Complemento"
							/>
						</Grid>
						<Grid item sm={4} xs={12}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								error={errosConta['endereco.cidade']}
								helperText={
									errosConta['endereco.cidade']
										? errosConta['endereco.cidade'].join(' ')
										: null
								}
								value={conta.endereco.cidade}
								onChange={(e) =>
									setConta({
										...conta,
										endereco: {
											...conta.endereco,
											cidade: e.target.value,
										},
									})
								}
								fullWidth
								required
								label="Cidade"
							/>
						</Grid>
						<Grid item sm={4} xs={12}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								error={errosConta['endereco.estado']}
								helperText={
									errosConta['endereco.estado']
										? errosConta['endereco.estado'].join(' ')
										: null
								}
								value={conta.endereco.estado}
								onChange={(e) =>
									setConta({
										...conta,
										endereco: {
											...conta.endereco,
											estado: e.target.value,
										},
									})
								}
								fullWidth
								required
								label="Estado"
							/>
						</Grid>
						<Grid item sm={4} xs={12}>
							<InputMask
								mask="(99) 99999-9999"
								value={
									preConta &&
									conta.verifica_contato &&
									conta.verifica_contato.celular
										? conta.verifica_contato.celular
										: conta.celular
								}
								onChange={(e) =>
									setConta({
										...conta,
										celular: e.target.value,
									})
								}
							>
								{() => (
									<TextField
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										error={errosConta.celular}
										helperText={
											errosConta.celular
												? errosConta.celular.join(' ')
												: null
										}
										fullWidth
										required
										label="Celular"
										type="tel"
									/>
								)}
							</InputMask>
						</Grid>
						<Grid item xs={12} sm={8}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								error={errosConta.email}
								helperText={
									errosConta.email ? errosConta.email.join(' ') : null
								}
								value={
									preConta &&
									conta.verifica_contato &&
									conta.verifica_contato.email
										? conta.verifica_contato.email
										: conta.email
								}
								onChange={(e) =>
									setConta({
										...conta,
										email: e.target.value,
									})
								}
								fullWidth
								required
								label="E-mail"
								type="email"
							/>
						</Grid>
						<Grid item sm={4} xs={12}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								error={errosConta.site}
								helperText={
									errosConta.site ? errosConta.site.join(' ') : null
								}
								value={conta.site}
								onChange={(e) =>
									setConta({
										...conta,
										site: e.target.value,
									})
								}
								fullWidth
								label="Site"
								type="site"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								style={{
									border:
										conta &&
										conta.motivo_divergence &&
										conta.motivo_divergence.Nome_da_Mae === false
											? '1px solid red'
											: 'none',
									borderRadius: '27px',
								}}
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								/* disabled={disableEditar} */
								value={conta.nome_mae}
								onChange={(e) =>
									setConta({
										...conta,
										nome_mae: e.target.value,
									})
								}
								fullWidth
								label="Nome da Mãe"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								/* disabled={disableEditar} */
								value={conta.nome_pai}
								onChange={(e) =>
									setConta({
										...conta,
										nome_pai: e.target.value,
									})
								}
								fullWidth
								label="Nome do Pai"
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								disabled={disableEditar}
								value={conta.cbo}
								onChange={(e) =>
									setConta({
										...conta,
										cbo: e.target.value,
									})
								}
								fullWidth
								label="CBO"
							/>
						</Grid>

						<Grid item xs={12} sm={1}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								disabled={disableEditar}
								value={conta.uf_naturalidade}
								onChange={(e) =>
									setConta({
										...conta,
										uf_naturalidade: e.target.value,
									})
								}
								fullWidth
								label="UF"
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								disabled={disableEditar}
								value={conta.cidade_naturalidade}
								onChange={(e) =>
									setConta({
										...conta,
										cidade_naturalidade: e.target.value,
									})
								}
								fullWidth
								label="Cidade Natal"
							/>
						</Grid>
						<Grid item xs={12} sm={2}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								disabled={disableEditar}
								value={conta.sexo}
								onChange={(e) =>
									setConta({
										...conta,
										sexo: e.target.value,
									})
								}
								fullWidth
								label="Sexo"
							/>
						</Grid>
						<Grid item xs={12} sm={preConta ? 4 : 2}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								disabled={disableEditar}
								value={conta.estado_civil}
								onChange={(e) =>
									setConta({
										...conta,
										estado_civil: e.target.value,
									})
								}
								fullWidth
								label="Estado Civil"
							/>
						</Grid>
						{preConta ? null : (
							<Grid item xs={12} sm={2}>
								<TextField
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									shrink
									disabled={disableEditar}
									value={conta.numero_documento}
									onChange={(e) =>
										setConta({
											...conta,
											numero_documento: e.target.value,
										})
									}
									fullWidth
									label="Número Documento"
								/>
							</Grid>
						)}
						{preConta ? null : (
							<>
								<Grid item xs={12} sm={2}>
									<TextField
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										shrink
										disabled={disableEditar}
										value={conta.uf_documento}
										onChange={(e) =>
											setConta({
												...conta,
												uf_documento: e.target.value,
											})
										}
										fullWidth
										label="UF Documento"
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<TextField
										style={{
											border:
												conta &&
												conta.motivo_divergence &&
												conta.motivo_divergence
													.Data_de_Expedicao === false
													? '1px solid red'
													: 'none',
											borderRadius: '27px',
										}}
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										shrink
										disabled={disableEditar}
										value={moment
											.utc(conta.data_emissao)
											.format('DD/MM/YYYY')}
										onChange={(e) =>
											setConta({
												...conta,
												data_emissao: e.target.value,
											})
										}
										fullWidth
										label="Data de Emissão"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										shrink
										disabled={disableEditar}
										value={conta.seller_id}
										onChange={(e) =>
											setConta({
												...conta,
												seller_id: e.target.value,
											})
										}
										fullWidth
										label="Seller/Holder"
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<TextField
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										shrink
										disabled={disableEditar}
										value={
											conta.conta
												? permissoes.includes(
														'Atendimento - Número da conta'
												  ) ||
												  permissoes.includes(
														'Administrador - Acesso total'
												  )
													? conta.conta
													: 'Sem permissão'
												: null
										}
										onChange={(e) =>
											setConta({
												...conta,
												numero_documento: e.target.value,
											})
										}
										fullWidth
										label="Número da Conta"
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<Typography
										style={{
											alignSelf: 'center',
											fontSize: '12px',
											fontWeight: 'bold',
											color: APP_CONFIG.mainCollors.primary,
											marginLeft: '15px',
										}}
									>
										Renda mensal
									</Typography>
									<CurrencyInput
										decimalSeparator=","
										thousandSeparator="."
										prefix="R$ "
										value={conta.renda_mensal}
										onChangeEvent={(event, maskedvalue, floatvalue) =>
											setConta({
												...conta,
												renda_mensal: floatvalue,
											})
										}
										style={{
											alignSelf: 'center',
											textAlign: 'center',
											height: 45,
											fontSize: 17,
											borderWidth: '1px !important',
											borderRadius: 27,
											border: '1px solid #fff',
											color: APP_CONFIG.mainCollors.primary,
											backgroundColor: 'transparent',
											fontWeight: 'bold',
										}}
									/>
								</Grid>
								{conta && conta.motivo_divergence ? (
									<Grid item xs={12} sm={2}>
										<Box
											style={{
												display: 'flex',
												alignSelf: 'center',
												justifyContent: 'center',
												marginTop: '15px',
											}}
										>
											<Button
												style={{
													borderRadius: '27px',
													backgroundColor: '#AA7EB3',
													color: '#531A5F',
												}}
												onClick={() =>
													setOpenModalDivergencia(true)
												}
											>
												<Typography style={{ fontSize: 12 }}>
													Divergência
												</Typography>
											</Button>
										</Box>
									</Grid>
								) : null}
							</>
						)}
						{preConta ? (
							<>
								<Grid item xs={12} sm={6}>
									<Box
										style={{
											display: 'flex',
											width: '100%',

											alignItems: 'center',
										}}
									>
										<Box
											style={{
												display: 'flex',
												flexDirection: 'row',

												alignItems: 'center',
											}}
										>
											<TextField
												variant="outlined"
												InputLabelProps={{
													shrink: true,
												}}
												shrink
												disabled={disableEditar}
												value={
													conta.verifica_contato &&
													conta.verifica_contato.data_envio_email
														? new Date(
																conta.verifica_contato.data_envio_email
														  ).toLocaleDateString('pt-br', {
																year: 'numeric',
																month: 'numeric',
																day: 'numeric',
																hour: 'numeric',
																minute: 'numeric',
														  })
														: 'Não enviado'
												}
												fullWidth
												label="E-mail enviado em"
											/>
											<Typography
												style={{
													color:
														conta.verifica_contato &&
														conta.verifica_contato
															.email_verificado
															? 'green'
															: 'red',
												}}
											>
												Email{' '}
												{conta.verifica_contato &&
												conta.verifica_contato.email_verificado
													? `Verificado`
													: `Não Verificado`}
											</Typography>
											{conta.verifica_contato &&
											conta.verifica_contato.email_verificado ? (
												<CheckIcon
													style={{ marginLeft: 5, color: 'green' }}
												/>
											) : (
												<ClearIcon
													style={{ marginLeft: 5, color: 'red' }}
												/>
											)}
										</Box>
									</Box>
								</Grid>

								<Grid item xs={12} sm={1}>
									<Box
										style={{
											display: 'flex',
											width: '100%',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Box
											style={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'center',
											}}
										>
											{/* <TextField
											variant='outlined'
												InputLabelProps={{
													shrink: true,
												}}
												shrink
												disabled={disableEditar}
												value={
													conta.verifica_contato && conta.verifica_contato.data_envio_sms
														? new Date(
																conta.verifica_contato.data_envio_sms
														  ).toLocaleDateString('pt-br', {
																year: 'numeric',
																month: 'numeric',
																day: 'numeric',
																hour: 'numeric',
																minute: 'numeric',
														  })
														: ''
												}
												fullWidth
												label="SMS enviado em"
											/> */}
											<Typography
												style={{
													color:
														conta.verifica_contato &&
														conta.verifica_contato
															.celular_verificado
															? 'green'
															: 'red',
												}}
											>
												Celular{' '}
												{conta.verifica_contato &&
												conta.verifica_contato.celular_verificado
													? `Verificado`
													: `Não Verificado`}
											</Typography>
											{conta.verifica_contato &&
											conta.verifica_contato.celular_verificado ? (
												<CheckIcon
													style={{ marginLeft: 5, color: 'green' }}
												/>
											) : (
												<ClearIcon
													style={{ marginLeft: 5, color: 'red' }}
												/>
											)}
										</Box>
									</Box>
								</Grid>
							</>
						) : null}
					</Grid>
				</Box>
			</form>

			<Dialog
				open={openModalDivergencia}
				onBackdropClick={() => setOpenModalDivergencia(false)}
			>
				<Box
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						alignSelf: 'center',
					}}
				>
					<DialogTitle style={{ color: APP_CONFIG.mainCollors.primary }}>
						Divergência:
					</DialogTitle>
					<DialogContent>
						<Box>
							{conta.motivo_divergence ? (
								<>
									<Box style={{ display: 'flex' }}>
										<Typography
											style={{
												color: APP_CONFIG.mainCollors.primary,
											}}
										>
											CPF:
										</Typography>
										{conta.motivo_divergence.CPF ? (
											<CheckIcon
												style={{
													color: 'green',
													marginLeft: '10px',
												}}
											/>
										) : (
											<ClearIcon
												style={{ color: 'red', marginLeft: '10px' }}
											/>
										)}
									</Box>
									<Box style={{ display: 'flex' }}>
										<Typography
											style={{
												color: APP_CONFIG.mainCollors.primary,
											}}
										>
											Nome:
										</Typography>
										{conta.motivo_divergence.Nome ? (
											<CheckIcon
												style={{
													color: 'green',
													marginLeft: '10px',
												}}
											/>
										) : (
											<ClearIcon
												style={{ color: 'red', marginLeft: '10px' }}
											/>
										)}
									</Box>
									<Box style={{ display: 'flex' }}>
										<Typography
											style={{
												color: APP_CONFIG.mainCollors.primary,
											}}
										>
											Nome da mãe:
										</Typography>
										{conta.motivo_divergence.Nome_da_Mae ? (
											<CheckIcon
												style={{
													color: 'green',
													marginLeft: '10px',
												}}
											/>
										) : (
											<ClearIcon
												style={{ color: 'red', marginLeft: '10px' }}
											/>
										)}
									</Box>
									<Box style={{ display: 'flex' }}>
										<Typography
											style={{
												color: APP_CONFIG.mainCollors.primary,
											}}
										>
											Data de nascimento:
										</Typography>
										{conta.motivo_divergence.Data_de_Nascimento ? (
											<CheckIcon
												style={{
													color: 'green',
													marginLeft: '10px',
												}}
											/>
										) : (
											<ClearIcon
												style={{ color: 'red', marginLeft: '10px' }}
											/>
										)}
									</Box>
									<Box style={{ display: 'flex' }}>
										<Typography
											style={{
												color: APP_CONFIG.mainCollors.primary,
											}}
										>
											Data de emissão:
										</Typography>
										{conta.motivo_divergence.Data_de_Expedicao ? (
											<CheckIcon
												style={{
													color: 'green',
													marginLeft: '10px',
												}}
											/>
										) : (
											<ClearIcon
												style={{ color: 'red', marginLeft: '10px' }}
											/>
										)}
									</Box>
								</>
							) : null}
						</Box>
					</DialogContent>
				</Box>

				<Box>
					<DialogActions>
						<Button
							style={{ color: APP_CONFIG.mainCollors.primary }}
							variant="outlined"
							onClick={() => setOpenModalDivergencia(false)}
						>
							Voltar
						</Button>
					</DialogActions>
				</Box>
			</Dialog>
		</Box>
	) : (
		<CircularProgress />
	);
};

export default NewAccount;
