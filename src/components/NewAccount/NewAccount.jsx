import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPreContaID,
  loadPermissao,
  postAuthMeAction,
} from "../../actions/actions";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import PersonIcon from "@material-ui/icons/Person";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getCep } from "../../services/services";

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
  const userData = useSelector((state) => state.userData);
  const userPermissao = useSelector((state) => state.userPermissao);
  const [permissoes, setPermissoes] = useState([]);
  const is_estabelecimento = userData?.is_estabelecimento;

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
      toast.error("Error ao puxar dados do cep");
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
      <Box
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          style={{
            height: "100px",
            width: "100px",
            display: "flex",
            justifyContent: "center",
            borderRadius: 50,
            background: APP_CONFIG.mainCollors.secondaryGradient,
          }}
        >
          <PersonIcon
            style={{
              alignSelf: "center",
              fontSize: "40px",
              color: "white",
            }}
          />
        </Box>
        <Box style={{ marginLeft: "30px" }}>
          <Typography
            align="left"
            style={{
              marginTop: "12px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            {conta.razao_social}
          </Typography>
          <Box>
            {/* <Button
							disabled={disableEditar}
							variant="contained"
							style={{
								margin: '5px',
								borderRadius: '27px',
								backgroundColor: '#C9DBF2',
								color: '#75B1ED',
							}}
							onClick={() => setPessoaJuridica(false)}
						>
							Pessoa Física
						</Button> */}
            <Button
              disabled={disableEditar}
              style={{
                margin: "5px",
                borderRadius: "27px",
                color: "#009838",
                backgroundColor: "#C9E0D8",
              }}
              variant="contained"
              color="secondary"
              onClick={() => setPessoaJuridica(true)}
            >
              Pessoa Jurídica
            </Button>
          </Box>
        </Box>
        <Box style={{ marginLeft: "30px" }}>
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
      </Box>
      <form>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          style={{ marginTop: "30px" }}
        >
          <Grid container spacing={3}>
            <Grid item sm={4} xs={12}>
              <InputMask
                disabled={disableEditar}
                mask={"999.999.999-99"}
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
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    disabled={disableEditar}
                    error={errosConta.documento}
                    helperText={
                      errosConta.documento
                        ? errosConta.documento.join(" ")
                        : null
                    }
                    name="documento"
                    fullWidth
                    required
                    label={"CPF"}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta.nome}
                helperText={errosConta.nome ? errosConta.nome.join(" ") : null}
                value={conta.nome}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    nome: e.target.value,
                  })
                }
                fullWidth
                required
                label={"Primeiro e Segundo nome"}
                disabled={is_estabelecimento}
              />
            </Grid>
            {pessoaJuridica || conta.tipo === "Pessoa Jurídica" ? (
              <>
                <Grid item sm={4} xs={12}>
                  <InputMask
                    disabled={disableEditar}
                    mask={"99.999.999/9999-99"}
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
                          errosConta.cnpj ? errosConta.cnpj.join(" ") : null
                        }
                        name="CNPJ"
                        fullWidth
                        required
                        label={"CNPJ"}
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
                        ? errosConta.razao_social.join(" ")
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
                    label={"Razao Social"}
                    disabled={is_estabelecimento}
                  />
                </Grid>
              </>
            ) : null}
            <Grid item sm={4} xs={12}>
              <TextField
                variant="outlined"
                /* disabled={disableEditar} */
                error={errosConta.data_nascimento}
                helperText={
                  errosConta.data_nascimento
                    ? errosConta.data_nascimento.join(" ")
                    : null
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "",
                }}
                type="date"
                label="Data de abertura"
                value={conta.data_nascimento}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    data_nascimento: e.target.value,
                  })
                }
                disabled={is_estabelecimento}
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
                disabled={is_estabelecimento}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={errosConta["endereco.cep"]}
                    helperText={
                      errosConta["endereco.cep"]
                        ? errosConta["endereco.cep"].join(" ")
                        : null
                    }
                    fullWidth
                    required
                    label="CEP"
                    disabled={is_estabelecimento}
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item sm={4} xs={12}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta["endereco.rua"]}
                helperText={
                  errosConta["endereco.rua"]
                    ? errosConta["endereco.rua"].join(" ")
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
                disabled={is_estabelecimento}
              />
            </Grid>
            <Grid item sm={2} xs={12}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta["endereco.numero"]}
                helperText={
                  errosConta["endereco.numero"]
                    ? errosConta["endereco.numero"].join(" ")
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
                disabled={is_estabelecimento}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta["endereco.bairro"]}
                helperText={
                  errosConta["endereco.bairro"]
                    ? errosConta["endereco.bairro"].join(" ")
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
                disabled={is_estabelecimento}
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
                disabled={is_estabelecimento}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta["endereco.cidade"]}
                helperText={
                  errosConta["endereco.cidade"]
                    ? errosConta["endereco.cidade"].join(" ")
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
                disabled={is_estabelecimento}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta["endereco.estado"]}
                helperText={
                  errosConta["endereco.estado"]
                    ? errosConta["endereco.estado"].join(" ")
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
                disabled={is_estabelecimento}
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
                      errosConta.celular ? errosConta.celular.join(" ") : null
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
                  errosConta.email ? errosConta.email.join(" ") : null
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
                helperText={errosConta.site ? errosConta.site.join(" ") : null}
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
                disabled={is_estabelecimento}
              />
            </Grid>
            {/* <Grid item xs={12} sm={4}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								disabled={disableEditar}
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
						</Grid> */}
            {/* <Grid item xs={12} sm={4}>
							<TextField
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								shrink
								disabled={disableEditar}
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
						</Grid> */}
            {/* <Grid item xs={12} sm={4}>
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
						</Grid> */}
            <Grid item xs={12} sm={2}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                shrink
                disabled={disableEditar}
                value={conta.renda_mensal}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    renda_mensal: e.target.value,
                  })
                }
                fullWidth
                label="Renda Mensal"
              />
            </Grid>
            {/* <Grid item xs={12} sm={1}>
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
						</Grid> */}
            {/* <Grid item xs={12} sm={3}>
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
						</Grid> */}
            {/* <Grid item xs={12} sm={2}>
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
						</Grid> */}
            {/* <Grid item xs={12} sm={preConta ? 4 : 2}>
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
						</Grid> */}
            {/* {preConta
							? null
							: 
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
							  }} */}
            {preConta ? null : (
              <>
                {/* <Grid item xs={12} sm={2}>
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
								</Grid> */}
                <Grid item xs={12} sm={3}>
                  {/* <TextField
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										shrink
										disabled={disableEditar}
										value={conta.data_emissao}
										onChange={(e) =>
											setConta({
												...conta,
												data_emissao: e.target.value,
											})
										}
										fullWidth
										label="Data de Emissão"
									/> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <TextField
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
									/> */}
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
                            "Atendimento - Número da conta",
                          ) ||
                          permissoes.includes("Administrador - Acesso total")
                          ? conta.conta
                          : "Sem permissão"
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
              </>
            )}
            {preConta ? (
              <>
                <Grid item xs={12} sm={6}>
                  <Box
                    style={{
                      display: "flex",
                      width: "100%",

                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "row",

                        alignItems: "center",
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
                                conta.verifica_contato.data_envio_email,
                              ).toLocaleDateString("pt-br", {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              })
                            : "Não enviado"
                        }
                        fullWidth
                        label="E-mail enviado em"
                      />
                      <Typography
                        style={{
                          color:
                            conta.verifica_contato &&
                            conta.verifica_contato.email_verificado
                              ? "green"
                              : "red",
                        }}
                      >
                        Email{" "}
                        {conta.verifica_contato &&
                        conta.verifica_contato.email_verificado
                          ? `Verificado`
                          : `Não Verificado`}
                      </Typography>
                      {conta.verifica_contato &&
                      conta.verifica_contato.email_verificado ? (
                        <CheckIcon style={{ marginLeft: 5, color: "green" }} />
                      ) : (
                        <ClearIcon style={{ marginLeft: 5, color: "red" }} />
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={1}>
                  <Box
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
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
                            conta.verifica_contato.celular_verificado
                              ? "green"
                              : "red",
                        }}
                      >
                        Celular{" "}
                        {conta.verifica_contato &&
                        conta.verifica_contato.celular_verificado
                          ? `Verificado`
                          : `Não Verificado`}
                      </Typography>
                      {conta.verifica_contato &&
                      conta.verifica_contato.celular_verificado ? (
                        <CheckIcon style={{ marginLeft: 5, color: "green" }} />
                      ) : (
                        <ClearIcon style={{ marginLeft: 5, color: "red" }} />
                      )}
                    </Box>
                  </Box>
                </Grid>
              </>
            ) : null}
          </Grid>
        </Box>
      </form>
    </Box>
  ) : (
    <CircularProgress />
  );
};

export default NewAccount;
