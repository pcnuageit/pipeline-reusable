import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  clearPreContaID,
  getEnviarFitbankAction,
  getSincronizarContaAction,
  loadContaId,
  postAuthMeAction,
} from "../../actions/actions";

import PersonIcon from "@material-ui/icons/Person";
import "moment/locale/pt-br";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getCep } from "../../services/services";

const useStyles = makeStyles(() => ({}));

const NewAccountRepresentante = ({
  conta,

  setConta,
  errosConta,
  disableEditar,
  preConta,
}) => {
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [dispatch, token]);

  const [pessoaJuridica, setPessoaJuridica] = useState(false);
  const handlerCep = async () => {
    try {
      const response = await getCep(conta.endereco.cep);
      setConta({
        ...conta,
        endereco: {
          ...conta.endereco,
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
      getEnviarFitbankAction(token, conta.id)
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
      getSincronizarContaAction(token, conta.id)
    );
    if (resSincronizar) {
      toast.error("Erro ao sincronizar dados");
      setLoading(false);
    } else {
      toast.success("Dados sincronizados com sucesso!");
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
          <Box>
            <Button
              disabled={pessoaJuridica}
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

            <Button
              disabled={pessoaJuridica === false}
              variant="contained"
              style={{
                margin: "5px",
                borderRadius: "27px",
                backgroundColor: "#C9DBF2",
                color: "#75B1ED",
              }}
              onClick={() => setPessoaJuridica(false)}
            >
              Pessoa Física
            </Button>
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
                          ? "1px solid red"
                          : "none",
                      borderRadius: "27px",
                    }}
                    InputLabelProps={{ shrink: true }}
                    disabled={disableEditar}
                    error={errosConta?.documento}
                    helperText={
                      errosConta?.documento
                        ? errosConta?.documento?.join(" ")
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
            <Grid item xs={12} sm={4}>
              <TextField
                style={{
                  border:
                    conta &&
                    conta.motivo_divergence &&
                    conta.motivo_divergence.Nome === false
                      ? "1px solid red"
                      : "none",
                  borderRadius: "27px",
                }}
                InputLabelProps={{ shrink: true }}
                error={errosConta?.nome}
                helperText={
                  errosConta?.nome ? errosConta?.nome?.join(" ") : null
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
                label={"Nome"}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                style={{
                  border:
                    conta &&
                    conta.motivo_divergence &&
                    conta.motivo_divergence.Nome === false
                      ? "1px solid red"
                      : "none",
                  borderRadius: "27px",
                }}
                InputLabelProps={{ shrink: true }}
                error={errosConta?.sobrenome}
                helperText={
                  errosConta?.sobrenome
                    ? errosConta?.sobrenome?.join(" ")
                    : null
                }
                value={conta.sobrenome}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    sobrenome: e.target.value,
                  })
                }
                fullWidth
                required
                label={"Sobrenome"}
              />
            </Grid>
            {pessoaJuridica ? (
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
                        InputLabelProps={{ shrink: true }}
                        disabled={disableEditar}
                        error={errosConta?.cnpj}
                        helperText={
                          errosConta?.cnpj ? errosConta?.cnpj?.join(" ") : null
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
                    InputLabelProps={{ shrink: true }}
                    error={errosConta?.razao_social}
                    helperText={
                      errosConta?.razao_social
                        ? errosConta?.razao_social?.join(" ")
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
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    error={errosConta?.descricao}
                    helperText={
                      errosConta?.descricao
                        ? errosConta?.descricao?.join(" ")
                        : null
                    }
                    value={conta.descricao}
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        descricao: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    label={"Descrição"}
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
                    conta.motivo_divergence.Data_de_Nascimento === false
                      ? "1px solid red"
                      : "none",
                  borderRadius: "27px",
                }}
                /* disabled={disableEditar} */
                error={errosConta?.data_nascimento}
                helperText={
                  errosConta?.data_nascimento
                    ? errosConta?.data_nascimento?.join(" ")
                    : null
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "",
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
                    InputLabelProps={{ shrink: true }}
                    error={errosConta?.endereco?.cep}
                    helperText={
                      errosConta?.endereco?.cep
                        ? errosConta?.endereco?.cep?.join(" ")
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
                InputLabelProps={{ shrink: true }}
                error={errosConta?.endereco?.rua}
                helperText={
                  errosConta?.endereco?.rua
                    ? errosConta?.endereco?.rua?.join(" ")
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
                InputLabelProps={{ shrink: true }}
                error={errosConta?.endereco?.numero}
                helperText={
                  errosConta?.endereco?.numero
                    ? errosConta?.endereco?.numero?.join(" ")
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
                InputLabelProps={{ shrink: true }}
                error={errosConta?.endereco?.bairro}
                helperText={
                  errosConta?.endereco?.bairro
                    ? errosConta?.endereco?.bairro?.join(" ")
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
                InputLabelProps={{ shrink: true }}
                error={errosConta?.endereco?.cidade}
                helperText={
                  errosConta?.endereco?.cidade
                    ? errosConta?.endereco?.cidade?.join(" ")
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
                InputLabelProps={{ shrink: true }}
                error={errosConta?.endereco?.estado}
                helperText={
                  errosConta?.endereco?.estado
                    ? errosConta?.endereco?.estado?.join(" ")
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
                    InputLabelProps={{ shrink: true }}
                    error={errosConta?.celular}
                    helperText={
                      errosConta?.celular
                        ? errosConta?.celular?.join(" ")
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
                InputLabelProps={{ shrink: true }}
                error={errosConta?.email}
                helperText={
                  errosConta?.email ? errosConta?.email?.join(" ") : null
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
                InputLabelProps={{ shrink: true }}
                error={errosConta?.site}
                helperText={
                  errosConta?.site ? errosConta?.site?.join(" ") : null
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
          </Grid>
        </Box>
      </form>
    </Box>
  ) : (
    <CircularProgress />
  );
};

export default NewAccountRepresentante;
