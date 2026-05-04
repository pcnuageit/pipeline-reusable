import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Autocomplete, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  loadBancos,
  postContaFisicaZoopAction,
  postContaJuridicaZoopAction,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getCep } from "../../services/services";

import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCurrencyInput from "../../components/CustomCurrencyInput";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";

const NovaConta = ({
  conta,
  setConta,
  errosConta,
  setErrosConta,
  activeStep,
  setActiveStep,
  disableEditar,
  loading,
  setLoading,
  setPessoaConfirmar,
}) => {
  const [pessoaJuridica, setPessoaJuridica] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const listaBancos = useSelector((state) => state.bancos);
  const token = useAuth();

  useEffect(() => {
    dispatch(loadBancos(token));
  }, [dispatch, token]);

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

  const handleCadastrarPessoaFisica = async () => {
    setLoading(true);
    const resCadastrarPessoaFisica = await dispatch(
      postContaFisicaZoopAction(
        token,
        conta.documento,
        conta.nome,
        conta.nome_mae,
        conta.nome_pai,
        conta.sexo,
        conta.estado_civil,
        conta.uf_naturalidade,
        conta.cidade_naturalidade,
        conta.numero_documento,
        conta.uf_documento,
        conta.data_emissao,
        conta.renda_mensal,
        conta.celular,
        conta.data_nascimento,
        conta.email,
        conta.site,
        conta.endereco.cep,
        conta.endereco.rua,
        conta.endereco.numero,
        conta.endereco.complemento,
        conta.endereco.bairro,
        conta.endereco.cidade,
        conta.endereco.estado,
        conta.banco?.id,
        conta.agencia,
        conta.conta,
        conta.tipo_transferencia,
        conta.chave_pix,
        conta.is_terceiro_autorizado,
        conta.documento_conta,
        conta.taxa_transacao,
      ),
    );
    if (resCadastrarPessoaFisica) {
      toast.error("Falha ao cadastrar");
      setErrosConta(resCadastrarPessoaFisica);
      setLoading(false);
    } else {
      setLoading(false);
      setPessoaConfirmar("fisica");
      setActiveStep(activeStep + 1);
    }
  };

  const handleCadastrarPessoaJuridica = async () => {
    setLoading(true);
    const resCadastrarPessoaJuridica = await dispatch(
      postContaJuridicaZoopAction(
        token,
        conta.documento,
        conta.cnpj,
        conta.razao_social,
        conta.nome,
        conta.renda_mensal,
        conta.celular,
        conta.data_nascimento,
        conta.email,
        conta.endereco.cep,
        conta.endereco.rua,
        conta.endereco.numero,
        conta.endereco.complemento,
        conta.endereco.bairro,
        conta.endereco.cidade,
        conta.endereco.estado,
        conta.banco?.id,
        conta.agencia,
        conta.conta,
        conta.tipo_transferencia,
        conta.chave_pix,
        conta.is_terceiro_autorizado,
        conta.documento_conta,
        conta.taxa_transacao,
      ),
    );
    if (resCadastrarPessoaJuridica) {
      toast.error("Falha ao cadastrar");
      setErrosConta(resCadastrarPessoaJuridica);
      setLoading(false);
    } else {
      setLoading(false);
      setActiveStep(activeStep + 1);
      setPessoaConfirmar("juridica");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      style={{ backgroundColor: APP_CONFIG.mainCollors.backgrounds }}
    >
      <Typography align="center" variant="h4" style={{ marginTop: "12px" }}>
        Dados da conta estabelecimento
      </Typography>

      <Box>
        <Button
          disabled={disableEditar}
          variant="contained"
          style={{
            margin: "5px",
            borderRadius: "27px",
            backgroundColor: pessoaJuridica ? "" : theme.palette.primary.main,
            color: "white",
          }}
          onClick={() => setPessoaJuridica(false)}
        >
          Pessoa Física
        </Button>

        <Button
          disabled={disableEditar}
          variant="contained"
          style={{
            margin: "5px",
            borderRadius: "27px",
            backgroundColor: pessoaJuridica ? theme.palette.primary.main : "",
            color: "white",
          }}
          onClick={() => setPessoaJuridica(true)}
        >
          Pessoa Jurídica
        </Button>
      </Box>

      <form>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          style={{ padding: "30px" }}
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
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={errosConta?.nome}
                helperText={
                  errosConta?.nome ? errosConta?.nome.join(" ") : null
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
                label={"Primeiro e Segundo nome"}
              />
            </Grid>
            {!pessoaJuridica ? (
              <>
                <Grid item xs={12} sm={5}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    /* disabled={disableEditar} */
                    error={errosConta?.nome_mae}
                    helperText={
                      errosConta?.nome_mae
                        ? errosConta?.nome_mae.join(" ")
                        : null
                    }
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
                <Grid item xs={12} sm={5}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    /* disabled={disableEditar} */
                    error={errosConta?.nome_pai}
                    helperText={
                      errosConta?.nome_pai
                        ? errosConta?.nome_pai.join(" ")
                        : null
                    }
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

                <Grid item xs={12} sm={2}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    disabled={disableEditar}
                    value={conta.uf_naturalidade}
                    error={errosConta?.uf_naturalidade}
                    helperText={
                      errosConta?.uf_naturalidade
                        ? errosConta?.uf_naturalidade.join(" ")
                        : null
                    }
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
                    error={errosConta?.cidade_naturalidade}
                    helperText={
                      errosConta?.cidade_naturalidade
                        ? errosConta?.cidade_naturalidade.join(" ")
                        : null
                    }
                    value={conta.cidade_naturalidade}
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        cidade_naturalidade: e.target.value,
                      })
                    }
                    fullWidth
                    label="Cidade Natal"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Select
                    variant="outlined"
                    disabled={disableEditar}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      marginTop: "10px",
                    }}
                    fullWidth
                    error={errosConta?.sexo}
                    helperText={
                      errosConta?.sexo ? errosConta?.sexo.join(" ") : null
                    }
                    value={conta.sexo}
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        sexo: e.target.value,
                      })
                    }
                    required
                  >
                    <MenuItem
                      value={" "}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Sexo
                    </MenuItem>
                    <MenuItem
                      value={"F"}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Feminino
                    </MenuItem>
                    <MenuItem
                      value={"M"}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Masculino
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Select
                    variant="outlined"
                    disabled={disableEditar}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      marginTop: "10px",
                    }}
                    fullWidth
                    value={conta.estado_civil}
                    error={errosConta?.estado_civil}
                    helperText={
                      errosConta?.estado_civil
                        ? errosConta?.estado_civil.join(" ")
                        : null
                    }
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        estado_civil: e.target.value,
                      })
                    }
                    required
                  >
                    <MenuItem
                      value={" "}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Estado civil
                    </MenuItem>
                    <MenuItem
                      value={1}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Solteiro
                    </MenuItem>
                    <MenuItem
                      value={2}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Casado
                    </MenuItem>
                    <MenuItem
                      value={3}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Divorciado
                    </MenuItem>
                    <MenuItem
                      value={4}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Viúvo
                    </MenuItem>
                    <MenuItem
                      value={5}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      União Estável
                    </MenuItem>
                    <MenuItem
                      value={6}
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                    >
                      Outros
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    disabled={disableEditar}
                    value={conta.numero_documento}
                    error={errosConta?.numero_documento}
                    helperText={
                      errosConta?.numero_documento
                        ? errosConta?.numero_documento.join(" ")
                        : null
                    }
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

                <Grid item xs={12} sm={2}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    shrink
                    disabled={disableEditar}
                    error={errosConta?.uf_documento}
                    helperText={
                      errosConta?.uf_documento
                        ? errosConta?.uf_documento.join(" ")
                        : null
                    }
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
                    variant="outlined"
                    shrink
                    disabled={disableEditar}
                    error={errosConta?.data_emissao}
                    helperText={
                      errosConta?.data_emissao
                        ? errosConta?.data_emissao.join(" ")
                        : null
                    }
                    value={conta.data_emissao}
                    onChange={(e) =>
                      setConta({
                        ...conta,
                        data_emissao: e.target.value,
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    fullWidth
                    label="Data de Emissão"
                  />
                </Grid>

                <Grid item sm={5} xs={12}>
                  <TextField
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={errosConta?.site}
                    helperText={
                      errosConta?.site ? errosConta?.site.join(" ") : null
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
              </>
            ) : null}

            {pessoaJuridica || conta.tipo === 2 ? (
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
              </>
            ) : null}

            <Grid item sm={4} xs={12}>
              <TextField
                variant="outlined"
                disabled={disableEditar}
                error={errosConta?.data_nascimento}
                helperText={
                  errosConta?.data_nascimento
                    ? errosConta?.data_nascimento.join(" ")
                    : null
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
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
                required
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

            <Grid item sm={6} xs={12}>
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
                      ...conta.endereco,
                      numero: e.target.value,
                    },
                  })
                }
                fullWidth
                label="Número"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                shrink
                value={conta?.endereco?.complemento}
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
                value={conta.celular}
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
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                disabled={disableEditar}
                error={errosConta?.email}
                helperText={
                  errosConta?.email ? errosConta?.email.join(" ") : null
                }
                value={conta.email}
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

            <Grid item xs={12} sm={8}>
              {listaBancos && (
                <>
                  <Autocomplete
                    value={conta.banco}
                    onChange={(e, value) =>
                      setConta({
                        ...conta,
                        banco: value,
                      })
                    }
                    options={listaBancos.map(({ nome, valor }) => ({
                      label: nome,
                      id: valor,
                    }))}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        label="Banco"
                        required
                        InputLabelProps={{ shrink: true }}
                        {...params}
                      />
                    )}
                  />
                  {errosConta?.banco ? (
                    <FormHelperText>
                      {errosConta?.banco.join(" ")}
                    </FormHelperText>
                  ) : null}
                </>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <InputMask
                mask={"9999"}
                value={conta.agencia}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    agencia: e.target.value,
                  })
                }
              >
                {() => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    error={errosConta?.agencia}
                    helperText={
                      errosConta?.agencia ? errosConta?.agencia.join(" ") : null
                    }
                    required
                    label="Agência"
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                type="number"
                fullWidth
                error={errosConta?.conta}
                helperText={
                  errosConta?.conta ? errosConta?.conta.join(" ") : null
                }
                required
                label="Conta"
                value={conta.conta}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    conta: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Select
                variant="outlined"
                disabled={disableEditar}
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
                value={conta.tipo_transferencia}
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

            {conta.tipo_transferencia === "Dict" ? (
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
                  value={conta.chave_pix}
                  onChange={(e) =>
                    setConta({
                      ...conta,
                      chave_pix: e.target.value,
                    })
                  }
                />
              </Grid>
            ) : null}

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
          </Grid>

          <Box style={{ marginTop: "30px" }}>
            <CustomButton
              color="purple"
              onClick={
                pessoaJuridica
                  ? handleCadastrarPessoaJuridica
                  : handleCadastrarPessoaFisica
              }
            >
              Cadastrar
            </CustomButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default NovaConta;
