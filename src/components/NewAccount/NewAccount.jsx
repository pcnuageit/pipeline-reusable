import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPreContaID,
  getEnviarFitbankAction,
  getSincronizarContaAction,
  loadContaId,
  postAuthMeAction,
} from "../../actions/actions";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import PersonIcon from "@material-ui/icons/Person";
import moment from "moment";
import "moment/locale/pt-br";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import usePermission from "../../hooks/usePermission";
import { getCep } from "../../services/services";
import CustomCurrencyInput from "../CustomCurrencyInput";
import SelectBanco from "../SelectBanco";
import TextFieldCpfCnpj from "../TextFieldCpfCnpj";

const NewAccount = ({
  conta,
  setConta,
  errosConta,
  disableEditar,
  preConta,
}) => {
  const dispatch = useDispatch();
  const token = useAuth();
  const userConta = useSelector((state) => state.conta);
  const contaId = useSelector((state) => state.conta);
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(false);
  const [openModalDivergencia, setOpenModalDivergencia] = useState(false);
  const isAdquirencia = userConta?.solicitado_adquirencia;
  const isEstabelecimento = userConta?.is_estabelecimento;
  const isGestao = userConta?.is_gestao_concorrencia;
  const isBanking = !(isEstabelecimento || isGestao);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [dispatch, token]);

  const [pessoaJuridica, setPessoaJuridica] = useState(false);

  const handlerCep = async () => {
    try {
      const response = await getCep(conta?.endereco?.cep);
      setConta({
        ...conta,
        endereco: {
          ...conta?.endereco,
          cep: response.data.cep,
          rua: response.data.logradouro ?? response.data.street,
          complemento: response.data.complemento,
          bairro: response.data.bairro ?? response.data.neighborhood,
          cidade: response.data.localidade ?? response.data.city,
          estado: response.data.uf ?? response.data.state,
        },
      });
    } catch (error) {
      toast.error("Error ao puxar dados do cep");
    }
  };

  const handleEnviarFitbank = async () => {
    setLoading(true);
    const resEnviarFitbank = await dispatch(
      getEnviarFitbankAction(token, conta?.id),
    );
    if (resEnviarFitbank) {
      toast.error("Erro ao enviar para Qitech");
      setLoading(false);
    } else {
      toast.success("Conta enviada para Qitech");
      setLoading(false);
    }
  };

  const handleSincronizarDados = async () => {
    setLoading(true);
    const resSincronizar = await dispatch(
      getSincronizarContaAction(token, conta?.id),
    );
    if (resSincronizar) {
      toast.error("Erro ao sincronizar dados");
      setLoading(false);
    } else {
      toast.success("Dados sincronizados com sucesso!");
      setLoading(false);
      dispatch(loadContaId(token, conta?.id));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearPreContaID());
    };
  }, [dispatch]);

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
            background: APP_CONFIG.mainCollors.primaryGradient,
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
          {conta?.tipo === "Pessoa Jurídica" ? (
            <Typography
              align="left"
              style={{
                marginTop: "12px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {conta?.razao_social ?? ""}
            </Typography>
          ) : (
            <Typography
              align="left"
              style={{
                marginTop: "12px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {conta?.nome}
            </Typography>
          )}

          <Box>
            {conta?.tipo === "Pessoa Jurídica" ? (
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
                /* onClick={() => setPessoaJuridica(true)} */
              >
                Pessoa Jurídica
              </Button>
            ) : (
              <Button
                disabled={disableEditar}
                variant="contained"
                style={{
                  margin: "5px",
                  borderRadius: "27px",
                  backgroundColor: "#C9DBF2",
                  color: "#75B1ED",
                }}
                /* onClick={() => setPessoaJuridica(false)} */
              >
                Pessoa Física
              </Button>
            )}
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
              {conta?.email}
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
              {conta?.celular}
            </Typography>
          </Box>
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",

            marginLeft: "20px",
          }}
        >
          <Box>
            <Box style={{ display: "flex" }}>
              <Typography style={{ color: APP_CONFIG.mainCollors.secondary }}>
                Primeiro acesso
              </Typography>
              <Box>
                {conta?.user?.verificacao ? (
                  <CheckIcon style={{ color: "green", marginLeft: "10px" }} />
                ) : conta?.user?.verificacao === false ? (
                  <ClearIcon style={{ color: "red", marginLeft: "10px" }} />
                ) : conta?.user === null ? (
                  <ClearIcon style={{ color: "red", marginLeft: "10px" }} />
                ) : null}
              </Box>
            </Box>
            <Box style={{ display: "flex" }}>
              <Typography style={{ color: APP_CONFIG.mainCollors.secondary }}>
                Onboarding Sócio
              </Typography>
              <Box>
                {conta?.idwall_id ? (
                  <CheckIcon style={{ color: "green", marginLeft: "10px" }} />
                ) : (
                  <ClearIcon style={{ color: "red", marginLeft: "10px" }} />
                )}
              </Box>
            </Box>

            <Box
              style={{
                display: "flex",
                alignSelf: "center",
                marginTop: "25px",
              }}
            >
              {contaId &&
              contaId?.documentos[0] &&
              contaId?.fitbank_account_key === null &&
              contaId?.status !== "denied" ? (
                <Button
                  style={{
                    margin: "5px",
                    borderRadius: "27px",
                    backgroundColor: APP_CONFIG.mainCollors.disabledTextfields,
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                  onClick={() => handleEnviarFitbank()}
                >
                  <Typography style={{ fontSize: 12 }}>
                    Enviar Qitech
                  </Typography>
                </Button>
              ) : null}
              {contaId?.status === "pending" ? (
                <Box>
                  <Button
                    style={{
                      margin: "5px",
                      borderRadius: "27px",
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
          style={{ marginTop: "20px" }}
        >
          <Grid container spacing={3}>
            <Grid item sm={4} xs={12}>
              <InputMask
                disabled={disableEditar}
                mask={"999.999.999-99"}
                value={conta?.documento}
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
                        conta?.motivo_divergence &&
                        conta?.motivo_divergence.CPF === false
                          ? "1px solid red"
                          : "none",
                      borderRadius: "27px",
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    disabled={disableEditar}
                    error={errosConta?.documento}
                    helperText={
                      errosConta?.documento
                        ? errosConta?.documento.join(" ")
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
                style={{
                  border:
                    conta &&
                    conta?.motivo_divergence &&
                    conta?.motivo_divergence.Nome === false
                      ? "1px solid red"
                      : "none",
                  borderRadius: "27px",
                }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta?.nome}
                helperText={
                  errosConta?.nome ? errosConta?.nome.join(" ") : null
                }
                value={conta?.nome}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    nome: e.target.value,
                  })
                }
                fullWidth
                required
                label={"Primeiro e Segundo nome"}
              />
            </Grid>
            {pessoaJuridica || conta?.tipo === "Pessoa Jurídica" ? (
              <>
                <Grid item sm={4} xs={12}>
                  <InputMask
                    disabled={disableEditar}
                    mask={"99.999.999/9999-99"}
                    value={conta?.cnpj}
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
                        error={errosConta?.cnpj}
                        helperText={
                          errosConta?.cnpj ? errosConta?.cnpj.join(" ") : null
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
                    error={errosConta?.razao_social}
                    helperText={
                      errosConta?.razao_social
                        ? errosConta?.razao_social.join(" ")
                        : null
                    }
                    value={conta?.razao_social}
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        razao_social: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    label={"Razao Social"}
                  />
                </Grid>
              </>
            ) : null}
            <Grid item sm={4} xs={12}>
              <TextField
                style={{
                  border:
                    conta?.motivo_divergence?.Data_de_Nascimento === false
                      ? "1px solid red"
                      : "none",
                  borderRadius: "27px",
                }}
                variant="outlined"
                /* disabled={disableEditar} */
                error={errosConta?.data_nascimento}
                helperText={
                  errosConta?.data_nascimento
                    ? errosConta?.data_nascimento.join(" ")
                    : null
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "",
                }}
                type="date"
                label="Data de Nascimento"
                value={conta?.data_nascimento}
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
                value={conta?.endereco?.cep}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    endereco: {
                      ...conta?.endereco,
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
                    error={errosConta?.endereco?.cep}
                    helperText={
                      errosConta?.endereco?.cep
                        ? errosConta?.endereco?.cep.join(" ")
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
                error={errosConta?.endereco?.rua}
                helperText={
                  errosConta?.endereco?.rua
                    ? errosConta?.endereco?.rua.join(" ")
                    : null
                }
                value={conta?.endereco?.rua}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    endereco: {
                      ...conta?.endereco,
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
                error={errosConta?.endereco?.numero}
                helperText={
                  errosConta?.endereco?.numero
                    ? errosConta?.endereco?.numero.join(" ")
                    : null
                }
                value={conta?.endereco?.numero}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    endereco: {
                      ...conta?.endereco,
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
                error={errosConta?.endereco?.bairro}
                helperText={
                  errosConta?.endereco?.bairro
                    ? errosConta?.endereco?.bairro.join(" ")
                    : null
                }
                value={conta?.endereco?.bairro}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    endereco: {
                      ...conta?.endereco,
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
                value={conta?.endereco?.complemento}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    endereco: {
                      ...conta?.endereco,
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
                error={errosConta?.endereco?.cidade}
                helperText={
                  errosConta?.endereco?.cidade
                    ? errosConta?.endereco?.cidade.join(" ")
                    : null
                }
                value={conta?.endereco?.cidade}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    endereco: {
                      ...conta?.endereco,
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
                error={errosConta?.endereco?.estado}
                helperText={
                  errosConta?.endereco?.estado
                    ? errosConta?.endereco?.estado.join(" ")
                    : null
                }
                value={conta?.endereco?.estado}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    endereco: {
                      ...conta?.endereco,
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
                  conta?.verifica_contato &&
                  conta?.verifica_contato.celular
                    ? conta?.verifica_contato.celular
                    : conta?.celular
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
                    error={errosConta?.celular}
                    helperText={
                      errosConta?.celular ? errosConta?.celular.join(" ") : null
                    }
                    fullWidth
                    required
                    label="Celular"
                    type="tel"
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta?.email}
                helperText={
                  errosConta?.email ? errosConta?.email.join(" ") : null
                }
                value={
                  preConta &&
                  conta?.verifica_contato &&
                  conta?.verifica_contato.email
                    ? conta?.verifica_contato.email
                    : conta?.email
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
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta?.site}
                helperText={
                  errosConta?.site ? errosConta?.site.join(" ") : null
                }
                value={conta?.site}
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
                    conta?.motivo_divergence &&
                    conta?.motivo_divergence.Nome_da_Mae === false
                      ? "1px solid red"
                      : "none",
                  borderRadius: "27px",
                }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                shrink
                /* disabled={disableEditar} */
                value={conta?.nome_mae}
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
                value={conta?.nome_pai}
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
                value={conta?.cbo}
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
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                shrink
                disabled={disableEditar}
                value={conta?.cidade_naturalidade}
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
                value={conta?.uf_naturalidade}
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
                value={conta?.sexo}
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
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                shrink
                disabled={disableEditar}
                value={conta?.estado_civil}
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
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    disabled={disableEditar}
                    value={conta?.numero_documento}
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

                <Grid item xs={12} sm={3}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    disabled={disableEditar}
                    value={conta?.uf_documento}
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
                        conta?.motivo_divergence &&
                        conta?.motivo_divergence.Data_de_Expedicao === false
                          ? "1px solid red"
                          : "none",
                      borderRadius: "27px",
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    disabled={disableEditar}
                    value={moment.utc(conta?.data_emissao).format("DD/MM/YYYY")}
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        data_emissao: e.target.value,
                      })
                    }
                    fullWidth
                    label="Data de Emissão Documento"
                  />
                </Grid>

                <CustomCurrencyInput
                  label="Renda mensal*"
                  value={conta.renda_mensal}
                  onChangeEvent={(event, maskedvalue, floatvalue) =>
                    setConta({
                      ...conta,
                      renda_mensal: floatvalue,
                    })
                  }
                  error={errosConta?.renda_mensal}
                />

                <CustomCurrencyInput
                  label="Taxa transações*"
                  value={conta.taxa_transacao}
                  onChangeEvent={(event, maskedvalue, floatvalue) =>
                    setConta({
                      ...conta,
                      taxa_transacao: floatvalue,
                    })
                  }
                  error={errosConta?.taxa_transacao}
                  prefix="% "
                />

                {conta?.motivo_divergence ? (
                  <Grid item xs={12} sm={2}>
                    <Box
                      style={{
                        display: "flex",
                        alignSelf: "center",
                        justifyContent: "center",
                        marginTop: "15px",
                      }}
                    >
                      <Button
                        style={{
                          borderRadius: "27px",
                          backgroundColor: "#AA7EB3",
                          color: "#531A5F",
                        }}
                        onClick={() => setOpenModalDivergencia(true)}
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
            {conta?.qi_tech_account?.response?.checking?.account_info && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Conta bancária"
                    variant="outlined"
                    disabled={true}
                    value={
                      conta?.qi_tech_account?.response?.checking?.account_info
                        ?.account_number +
                      "-" +
                      conta?.qi_tech_account?.response?.checking?.account_info
                        ?.account_digit
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Agência"
                    variant="outlined"
                    disabled={true}
                    value={
                      conta?.qi_tech_account?.response?.checking?.account_info
                        ?.account_branch
                    }
                    fullWidth
                  />
                </Grid>
              </>
            )}
            {isBanking ? (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    disabled={disableEditar}
                    value={conta?.seller_id}
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

                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    disabled={disableEditar}
                    value={
                      conta?.conta
                        ? hasPermission("Atendimento - Número da conta")
                          ? conta?.conta
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
            ) : (
              <>
                <Grid item xs={12} sm={4}>
                  <Select
                    variant="outlined"
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      marginTop: "10px",
                    }}
                    fullWidth
                    error={errosConta?.tipo_transferencia}
                    helperText={
                      errosConta?.tipo_transferencia
                        ? errosConta?.tipo_transferencia.join(" ")
                        : null
                    }
                    value={conta?.tipo_transferencia ?? " "}
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        tipo_transferencia: e.target.value,
                      })
                    }
                  >
                    <MenuItem
                      value={" "}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Tipo de transferência
                    </MenuItem>
                    <MenuItem
                      value={"Manual"}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Dados bancários
                    </MenuItem>
                    <MenuItem
                      value={"Dict"}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Pix
                    </MenuItem>
                  </Select>
                </Grid>

                {conta?.tipo_transferencia === "Dict" ? (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Chave Pix"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      // type="number"
                      fullWidth
                      error={errosConta?.chave_pix}
                      helperText={
                        errosConta?.chave_pix
                          ? errosConta?.chave_pix.join(" ")
                          : null
                      }
                      required
                      value={conta?.chave_pix}
                      onChange={(e) =>
                        setConta({
                          ...conta,
                          chave_pix: e.target.value,
                        })
                      }
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <SelectBanco
                        value={conta.banco}
                        onChange={(e, value) =>
                          setConta({
                            ...conta,
                            banco: value?.valor ?? "",
                          })
                        }
                        error={errosConta?.banco}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Agência"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        error={errosConta?.agencia}
                        helperText={
                          errosConta?.agencia
                            ? errosConta?.agencia.join(" ")
                            : null
                        }
                        required
                        value={conta?.agencia}
                        onChange={(e) =>
                          setConta({
                            ...conta,
                            agencia: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Conta"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        error={errosConta?.conta}
                        helperText={
                          errosConta?.conta ? errosConta?.conta.join(" ") : null
                        }
                        required
                        value={conta?.conta}
                        onChange={(e) =>
                          setConta({
                            ...conta,
                            conta: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sm={6}>
                  <InputLabel id="isTerceiroLabel" shrink="true">
                    Transferência para terceiro?
                  </InputLabel>
                  <Select
                    labelId="isTerceiroLabel"
                    label="Pagamento para terceiro?"
                    variant="outlined"
                    fullWidth
                    error={errosConta?.is_terceiro_autorizado}
                    helperText={
                      errosConta?.is_terceiro_autorizado
                        ? errosConta?.is_terceiro_autorizado.join(" ")
                        : null
                    }
                    value={conta?.is_terceiro_autorizado ?? " "}
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        is_terceiro_autorizado: e.target.value,
                      })
                    }
                  >
                    <MenuItem
                      value={true}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Sim
                    </MenuItem>
                    <MenuItem
                      value={false}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Não
                    </MenuItem>
                  </Select>
                </Grid>

                {conta?.is_terceiro_autorizado ? (
                  <Grid item xs={12} sm={6}>
                    <TextFieldCpfCnpj
                      label="Documento da conta"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      fullWidth
                      error={errosConta?.documento_conta}
                      helperText={
                        errosConta?.documento_conta
                          ? errosConta?.documento_conta.join(" ")
                          : null
                      }
                      required
                      value={conta.documento_conta}
                      onChange={(e) =>
                        setConta({
                          ...conta,
                          documento_conta: e.target.value,
                        })
                      }
                    />
                  </Grid>
                ) : null}
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
                          conta?.verifica_contato &&
                          conta?.verifica_contato.data_envio_email
                            ? new Date(
                                conta?.verifica_contato.data_envio_email,
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
                            conta?.verifica_contato &&
                            conta?.verifica_contato.email_verificado
                              ? "green"
                              : "red",
                        }}
                      >
                        Email{" "}
                        {conta?.verifica_contato &&
                        conta?.verifica_contato.email_verificado
                          ? `Verificado`
                          : `Não Verificado`}
                      </Typography>
                      {conta?.verifica_contato &&
                      conta?.verifica_contato.email_verificado ? (
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
													conta?.verifica_contato && conta?.verifica_contato.data_envio_sms
														? new Date(
																conta?.verifica_contato.data_envio_sms
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
                            conta?.verifica_contato &&
                            conta?.verifica_contato.celular_verificado
                              ? "green"
                              : "red",
                        }}
                      >
                        Celular{" "}
                        {conta?.verifica_contato &&
                        conta?.verifica_contato.celular_verificado
                          ? `Verificado`
                          : `Não Verificado`}
                      </Typography>
                      {conta?.verifica_contato &&
                      conta?.verifica_contato.celular_verificado ? (
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

      <Dialog
        open={openModalDivergencia}
        onBackdropClick={() => setOpenModalDivergencia(false)}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <DialogTitle style={{ color: APP_CONFIG.mainCollors.primary }}>
            Divergência:
          </DialogTitle>
          <DialogContent>
            <Box>
              {conta?.motivo_divergence ? (
                <>
                  <Box style={{ display: "flex" }}>
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      CPF:
                    </Typography>
                    {conta?.motivo_divergence.CPF ? (
                      <CheckIcon
                        style={{
                          color: "green",
                          marginLeft: "10px",
                        }}
                      />
                    ) : (
                      <ClearIcon style={{ color: "red", marginLeft: "10px" }} />
                    )}
                  </Box>
                  <Box style={{ display: "flex" }}>
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      Nome:
                    </Typography>
                    {conta?.motivo_divergence.Nome ? (
                      <CheckIcon
                        style={{
                          color: "green",
                          marginLeft: "10px",
                        }}
                      />
                    ) : (
                      <ClearIcon style={{ color: "red", marginLeft: "10px" }} />
                    )}
                  </Box>
                  <Box style={{ display: "flex" }}>
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      Nome da mãe:
                    </Typography>
                    {conta?.motivo_divergence.Nome_da_Mae ? (
                      <CheckIcon
                        style={{
                          color: "green",
                          marginLeft: "10px",
                        }}
                      />
                    ) : (
                      <ClearIcon style={{ color: "red", marginLeft: "10px" }} />
                    )}
                  </Box>
                  <Box style={{ display: "flex" }}>
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      Data de nascimento:
                    </Typography>
                    {conta?.motivo_divergence.Data_de_Nascimento ? (
                      <CheckIcon
                        style={{
                          color: "green",
                          marginLeft: "10px",
                        }}
                      />
                    ) : (
                      <ClearIcon style={{ color: "red", marginLeft: "10px" }} />
                    )}
                  </Box>
                  <Box style={{ display: "flex" }}>
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      Data de emissão:
                    </Typography>
                    {conta?.motivo_divergence.Data_de_Expedicao ? (
                      <CheckIcon
                        style={{
                          color: "green",
                          marginLeft: "10px",
                        }}
                      />
                    ) : (
                      <ClearIcon style={{ color: "red", marginLeft: "10px" }} />
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
