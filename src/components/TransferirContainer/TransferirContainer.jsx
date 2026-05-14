import {
  AppBar,
  Box,
  FormHelperText,
  InputLabel,
  makeStyles,
  Modal,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import CurrencyInput from "react-currency-input";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import { toast } from "react-toastify";
import {
  getConsultaChavePixAction,
  loadBancos,
  postPagamentoPixAction,
  setRedirecionarValorTransferencia,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { isCPF } from "../../utils/documentValidator";
import CustomButton from "../CustomButton/CustomButton";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import TextFieldCpfCnpj from "../TextFieldCpfCnpj";
import FavoritosPixTable from "./FavoritosPixTable";

const useStyles = makeStyles((theme) => ({
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "10%",
    left: "25%",
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },
  currencyField: {
    fontFamily: "Montserrat-Regular",
    /* fontWeight: 'bold', */
    color: "white",
  },
  subBoxFavorito: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
    padding: 10,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: APP_CONFIG.mainCollors.disabledTextfields,
      borderRadius: 27,
    },
  },
  boxDeleteIcon: {
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#E9C3C5",
      borderRadius: 27,
    },
  },
  chaveField: {
    fontFamily: "Montserrat-Thin",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    height: "45px",
    borderRadius: 27,
    "&$cssFocused $notchedOutline": {
      borderWidth: 1,
    },
    "&:not($error) $notchedOutline": {
      borderColor: APP_CONFIG.mainCollors.primary,

      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        borderColor: "rgba(0, 0, 0, 0.23)",
      },
    },

    borderWidth: "1px",
    "& :-webkit-autofill": {
      "-webkit-padding-after": "15px",
      "-webkit-padding-before": "18px",
      "-webkit-padding-end": "15px",
      "-webkit-padding-start": "15px",
      "-webkit-background-clip": "text",
      "-webkit-color": "white",
      "-webkit-text-fill-color": "white !important",
    },

    "& $notchedOutline": {
      borderColor: "white",
      borderWidth: 1,
    },
    "&:hover $notchedOutline": {
      borderColor: "white",
      borderWidth: 1,
    },
    "&$focused $notchedOutline": {
      borderColor: "white",
      borderWidth: 1,
    },
    focused: {
      borderWidth: "1px",
    },
    notchedOutline: {
      borderWidth: "1px",
    },
    "&::placeholder": {
      fontFamily: "Montserrat-Thin",
      textOverflow: "ellipsis !important",
      color: APP_CONFIG.mainCollors.primary,
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
}));

const a11yProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
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

const TransferirContainer = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const valorTransferencia = useSelector(
    (state) => state.redirecionarValorTransferencia,
  );
  const consultaChave = useSelector((state) => state.consultaChave);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState("");
  const [value, setValue] = useState(0);
  const listaBancos = useSelector((state) => state.bancos);
  const [mascara, setMascara] = useState("");
  const [transferenciaPix, setTransferenciaPix] = useState({
    chave_recebedor: "",
    valor: valorTransferencia ? valorTransferencia : "",
    favorito: false,
    descricao: "",
    dataToken: "",
    nome: "",
    tipo: "",
    tipo_transferencia: "Dict",
    documento_conta: "",
    agencia: "",
    conta: "",
    banco: "",
    digito_conta: "",
    tipo_conta: "",
  });
  const [tedErros, setTedErros] = useState({});

  useEffect(() => {
    dispatch(loadBancos(token));
  }, [token]);

  useEffect(() => {
    return () => {
      dispatch(setRedirecionarValorTransferencia(null));
    };
  }, []);

  const handleConsultarChave = async (chave) => {
    const resConsulta = await dispatch(getConsultaChavePixAction(token, chave));
    if (resConsulta === false) {
      toast.success("Chave encontrada!");
      setTransferenciaPix({
        ...transferenciaPix,
        nome: consultaChave?.owner_name ?? "",
        tipo: consultaChave?.tipo ?? "",
      });
      return true;
    } else {
      toast.error("Falha na consulta da chave");
      return false;
    }
  };

  const handlePagamentoPix = async (e) => {
    const pagador = {
      name: transferenciaPix.nome,
      ...(transferenciaPix.documento_conta?.length > 15
        ? { cnpj: transferenciaPix?.documento_conta }
        : { cpf: transferenciaPix?.documento_conta }),
      bankAccount: {
        branch: transferenciaPix?.agencia,
        number: transferenciaPix?.conta,
        ispb: transferenciaPix?.banco,
        digit: transferenciaPix?.digito_conta,
        type: parseTipoContaPayload(transferenciaPix?.tipo_conta),
      },
    };

    setLoading(true);
    const resPagamentoPix = await dispatch(
      postPagamentoPixAction(
        token,
        transferenciaPix.tipo_transferencia,
        transferenciaPix.tipo,
        transferenciaPix.chave_recebedor,
        transferenciaPix.valor,
        transferenciaPix.favorito,
        transferenciaPix.descricao,
        transferenciaPix.dataToken,
        pagador,
        "",
      ),
    );
    if (resPagamentoPix) {
      console.log(resPagamentoPix);
      setErrors(resPagamentoPix);
      setTedErros(resPagamentoPix);
      setLoading(false);
    } else {
      toast.success("Pix enviado!");
      changePath("aprovacoes");
      setLoading(false);
      setOpenModal(false);
    }
  };

  const applyMask = (value) => {
    if (value.includes("[a-zA-Z]")) {
      // Máscara para e-mail
      return value;
    } else if (isCPF(value)) {
      // Máscara para CPF
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
    } else if (value?.length >= 14 && value.match("^[^a-zA-Z@]+$")) {
      // Máscara para CNPJ
      setMascara("99.999.999/9999-99");
      return value;
    } else if (value?.length === 11 && value.match("^[^a-zA-Z@() ]+$")) {
      // Máscara para celular
      setMascara("(99) 99999-9999");
      return value;
    } else {
      // Chave aleatória (id) - não aplicar máscara
      setMascara("");
      return value;
    }
  };

  function formatarDocumento(doc) {
    let formatado = doc.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gi,
      "",
    );

    console.log(formatado);
    setTransferenciaPix({
      ...transferenciaPix,
      documento_conta: formatado,
    });
  }

  const handleSelectFavorito = async (item) => {
    //Manual
    if (!item?.chave_recebedor) {
      setValue(1);
      setTransferenciaPix({
        tipo_transferencia: "Manual",
        nome: item?.nome_conta ?? item?.nome,
        documento_conta: item?.documento_conta,
        banco: item?.banco,
        agencia: item?.agencia,
        conta: item?.conta_sem_digito,
        digito_conta: item?.digito_conta,
        tipo_conta: item?.tipo_conta,
      });
      return;
    }

    //Dict
    setLoading(true);

    try {
      const isValid = await handleConsultarChave(item?.chave_recebedor);
      if (isValid) {
        setValue(1);
        setTransferenciaPix({
          tipo_transferencia: "Dict",
          tipo: item?.tipo,
          nome: item?.nome,
          chave_recebedor: applyMask(item?.chave_recebedor),
        });
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const getIndicatorColor = (index) =>
    index === value ? `2px solid ${APP_CONFIG.mainCollors.primary}` : null;

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Box
        display="flex"
        style={{
          marginTop: "10px",
          marginBottom: "16px",
          margin: 30,
        }}
      >
        <Box
          style={{
            width: "100%",
            borderTopRightRadius: 27,
            borderTopLeftRadius: 27,
          }}
        >
          <AppBar
            position="static"
            color="default"
            style={{
              backgroundColor: APP_CONFIG.mainCollors.backgrounds,
              boxShadow: "none",
              width: "100%",
            }}
          >
            <Tabs
              style={{
                color: APP_CONFIG.mainCollors.primary,
                width: "460px",
                boxShadow: "none",
              }}
              value={value}
              onChange={handleChangeTab}
              variant="fullWidth"
            >
              <Tab
                label="Contas autorizadas"
                style={{
                  width: "100%",
                  borderBottom: getIndicatorColor(0),
                }}
                {...a11yProps(0)}
              />

              <Tab
                label="Transferir"
                style={{
                  width: "100%",
                  borderBottom: getIndicatorColor(1),
                }}
                {...a11yProps(1)}
                disabled
              />
            </Tabs>
          </AppBar>

          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <FavoritosPixTable callback={handleSelectFavorito} />
            </TabPanel>

            <TabPanel value={value} index={1} dir={theme.direction}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    style={{
                      backgroundColor: APP_CONFIG.mainCollors.primary,
                      display: "flex",
                      flexDirection: "column",
                      padding: "20px",
                      borderRadius: "17px",
                      alignItems: "center",
                      width: "100%",
                      maxWidth: 400,
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        fontSize: "13px",
                        color: "white",
                        marginTop: "10px",
                      }}
                    >
                      Valor a transferir
                    </Typography>

                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        alignSelf: "center",
                        width: "100%",
                      }}
                    >
                      <Box
                        style={{
                          marginTop: "20px",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                        }}
                      >
                        <CurrencyInput
                          style={{
                            marginBottom: "6px",
                            width: "80%",
                            alignSelf: "center",
                            textAlign: "center",
                            height: 40,
                            fontSize: 20,
                            border: "none",
                            color: "#fff",
                            backgroundColor: "transparent",
                            fontFamily: "Montserrat-Regular",
                          }}
                          decimalSeparator=","
                          thousandSeparator="."
                          prefix="R$ "
                          value={transferenciaPix.valor}
                          onChangeEvent={(event, maskedvalue, floatvalue) => {
                            setTransferenciaPix({
                              ...transferenciaPix,
                              valor: floatvalue,
                            });
                          }}
                        />
                        {errors.valor ? (
                          <FormHelperText
                            style={{
                              width: "300px",
                              fontSize: 14,
                              textAlign: "center",
                              fontFamily: "Montserrat-Regular",
                              color: "red",
                            }}
                          >
                            {errors.valor.join(" ")}
                          </FormHelperText>
                        ) : null}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box style={{ marginTop: "30px", width: "90%" }}>
                  <InputLabel id="tipo-transfer-select" shrink="true">
                    Tipo da transferência
                  </InputLabel>
                  <Select
                    labelId="tipo-transfer-select"
                    value={transferenciaPix.tipo_transferencia}
                    onChange={(e) => {
                      setTransferenciaPix({
                        ...transferenciaPix,
                        tipo_transferencia: e.target.value,
                      });
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    disabled
                  >
                    <MenuItem value={"Dict"}>Chave Pix</MenuItem>
                    <MenuItem value={"Manual"}>Agência e Conta</MenuItem>
                  </Select>
                </Box>

                <Box
                  style={{ display: "flex", marginTop: "30px", width: "90%" }}
                >
                  <TextField
                    label="Nome"
                    type="text"
                    error={tedErros.nome}
                    helperText={tedErros.nome ? tedErros.nome.join(" ") : null}
                    value={transferenciaPix.nome}
                    onChange={(e) => {
                      setTransferenciaPix({
                        ...transferenciaPix,
                        nome: e.target.value,
                      });
                    }}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Box>

                {transferenciaPix.tipo_transferencia == "Manual" ? (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "90%",
                    }}
                  >
                    <Box style={{ marginTop: "30px" }}>
                      <TextFieldCpfCnpj
                        label={"CPF/CNPJ"}
                        onChange={(e) => formatarDocumento(e.target.value)}
                        value={transferenciaPix?.documento_conta}
                        error={tedErros.documento}
                        helperText={
                          tedErros.documento
                            ? tedErros.documento.join(" ")
                            : null
                        }
                        required
                        disabled
                      />
                    </Box>

                    <Box style={{ marginTop: "30px" }}>
                      <InputLabel id="tipo-conta-select" shrink="true">
                        Tipo da conta
                      </InputLabel>
                      <Select
                        labelId="tipo-conta-select"
                        style={{
                          color: APP_CONFIG.mainCollors.secondary,
                        }}
                        value={transferenciaPix.tipo_conta}
                        onChange={(e) => {
                          setTransferenciaPix({
                            ...transferenciaPix,
                            tipo_conta: e.target.value,
                          });
                        }}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        disabled
                      >
                        <MenuItem
                          value={"conta_corrente"}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                            fontFamily: "Montserrat-Regular",
                          }}
                        >
                          Conta Corrente
                        </MenuItem>
                        <MenuItem
                          value={"conta_salario"}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                            fontFamily: "Montserrat-Regular",
                          }}
                        >
                          Conta-salário
                        </MenuItem>
                        <MenuItem
                          value={"conta_poupanca"}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                            fontFamily: "Montserrat-Regular",
                          }}
                        >
                          Conta poupança
                        </MenuItem>
                        <MenuItem
                          value={"conta_pagamento"}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                            fontFamily: "Montserrat-Regular",
                          }}
                        >
                          Conta pré-paga
                        </MenuItem>
                      </Select>
                    </Box>

                    <Box
                      style={{
                        marginTop: "30px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <TextField
                        style={{ marginRight: "8px" }}
                        variant="outlined"
                        error={tedErros.agencia}
                        helperText={
                          tedErros.agencia ? tedErros.agencia.join(" ") : null
                        }
                        label="Agência"
                        type="number"
                        value={transferenciaPix.agencia}
                        onChange={(e) => {
                          setTransferenciaPix({
                            ...transferenciaPix,
                            agencia: e.target.value.toString().slice(0, 5),
                          });
                        }}
                        disabled
                      />

                      <TextField
                        style={{ marginRight: "8px" }}
                        variant="outlined"
                        error={tedErros.conta}
                        helperText={
                          tedErros.conta ? tedErros.conta.join(" ") : null
                        }
                        label="Conta"
                        // type="number"
                        value={transferenciaPix.conta}
                        onChange={(e) => {
                          setTransferenciaPix({
                            ...transferenciaPix,
                            conta: e.target.value.toString().slice(0, 10),
                          });
                        }}
                        disabled
                      />

                      <TextField
                        variant="outlined"
                        label="Digito da conta"
                        type="number"
                        error={tedErros.conta}
                        helperText={
                          tedErros.conta ? tedErros.conta.join(" ") : null
                        }
                        value={transferenciaPix.digito_conta}
                        onChange={(e) => {
                          setTransferenciaPix({
                            ...transferenciaPix,
                            digito_conta: e.target.value.toString().slice(0, 1),
                          });
                        }}
                        disabled
                      />
                    </Box>

                    <FormControl
                      style={{ marginTop: 30 }}
                      error={tedErros.banco}
                    >
                      {listaBancos && (
                        <>
                          <Autocomplete
                            value={transferenciaPix.banco}
                            onChange={(e, value) =>
                              setTransferenciaPix({
                                ...transferenciaPix,
                                banco: value.id,
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
                                {...params}
                              />
                            )}
                            disabled
                          />
                          {tedErros.banco ? (
                            <FormHelperText>
                              {tedErros.banco.join(" ")}
                            </FormHelperText>
                          ) : null}
                        </>
                      )}
                    </FormControl>
                  </Box>
                ) : (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "90%",
                    }}
                  >
                    <Box style={{ marginTop: "30px" }}>
                      <InputLabel labelId="chave_pix_id" shrink>
                        {consultaChave?.tipo_label}
                      </InputLabel>
                      <InputMask
                        labelId="chave_pix_id"
                        style={{
                          flexShrink: true,
                          width: "100%",
                          padding: "15px",
                          marginBottom: "5px",
                        }}
                        placeholder="Email, CPF/CNPJ ou chave pix"
                        className={classes.chaveField}
                        fullWidth
                        variant="outlined"
                        error={
                          Array.isArray(errors.chave_recebedor)
                            ? errors.chave_recebedor.join(" ")
                            : errors.chave_recebedor
                        }
                        mask={mascara}
                        value={transferenciaPix.chave_recebedor}
                        onChange={(e) => {
                          setTransferenciaPix({
                            ...transferenciaPix,
                            chave_recebedor: e.target.value,
                          });
                        }}
                        maskPlaceholder={null}
                        checkText={(previous, next) => {
                          return next === `${previous} ` ? false : true;
                        }}
                        disabled
                      />
                    </Box>
                  </Box>
                )}

                <Box style={{ marginTop: "30px", width: "90%" }}>
                  <TextField
                    label="Descrição"
                    value={transferenciaPix.descricao}
                    error={errors.descricao}
                    helperText={
                      errors.descricao ? errors.descricao.join(" ") : null
                    }
                    onChange={(e) => {
                      setTransferenciaPix({
                        ...transferenciaPix,
                        descricao: e.target.value,
                      });
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Box>

                {/* <Box
                  style={{
                    marginTop: "30px",
                  }}
                >
                  <CustomButton
                    color="purple"
                    onChange={(e) => {
                      setTransferenciaPix({
                        ...transferenciaPix,
                        favorito: e.target.checked,
                      });
                    }}
                  >
                    <Typography>Favoritar</Typography>

                    <Switch checked={transferenciaPix.favorito} />
                  </CustomButton>
                </Box> */}

                <Box
                  style={{
                    marginTop: "30px",
                  }}
                >
                  <CustomButton
                    color="purple"
                    onClick={() => setOpenModal(true)}
                  >
                    <Typography>Continuar</Typography>
                  </CustomButton>
                </Box>
              </Box>

              <Box>
                <Modal
                  open={openModal}
                  onBackdropClick={() => setOpenModal(false)}
                >
                  <Box className={classes.modal}>
                    <LoadingScreen isLoading={loading} />
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        marginTop: "30px",
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "Montserrat-ExtraBold",
                          fontSize: "16px",
                          color: APP_CONFIG.mainCollors.primary,
                          fontWeight: "bold",
                        }}
                      >
                        Preencha o campo com o token do seu aplicativo.
                      </Typography>

                      <ReactCodeInput
                        value={transferenciaPix.dataToken}
                        onChange={(e) =>
                          setTransferenciaPix({
                            ...transferenciaPix,
                            dataToken: e,
                          })
                        }
                        type="number"
                        fields={6}
                        inputStyle={{
                          fontFamily: "monospace",
                          margin: "4px",
                          marginTop: "30px",
                          MozAppearance: "textfield",
                          width: "30px",
                          borderRadius: "28px",
                          fontSize: "20px",
                          height: "50px",
                          paddingLeft: "7px",

                          color: APP_CONFIG.mainCollors.primary,
                          border: `1px solid ${APP_CONFIG.mainCollors.primary}`,
                        }}
                      />
                      {errors.token ? (
                        <FormHelperText
                          style={{
                            fontSize: 14,
                            textAlign: "center",
                            fontFamily: "Montserrat-ExtraBold",
                            color: "red",
                          }}
                        >
                          {errors.token.join(" ")}
                        </FormHelperText>
                      ) : null}
                      {errors && errors.valor ? (
                        <FormHelperText
                          style={{
                            fontSize: 14,
                            textAlign: "center",
                            fontFamily: "Montserrat-ExtraBold",
                            color: "red",
                          }}
                        >
                          {errors.valor.join(" ")}
                        </FormHelperText>
                      ) : null}
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "30px",
                        }}
                      >
                        <LoadingScreen isLoading={loading} />
                        <Box style={{ marginTop: "10px" }}>
                          <CustomButton
                            disabled={loading}
                            variant="contained"
                            color="purple"
                            style={{ marginTop: "10px" }}
                            onClick={handlePagamentoPix}
                          >
                            <Typography
                              style={{
                                fontFamily: "Montserrat-Regular",
                                fontSize: "14px",
                                color: "white",
                              }}
                            >
                              Enviar
                            </Typography>
                          </CustomButton>
                        </Box>
                      </Box>
                      <Box
                        style={{
                          alignSelf: "center",
                          marginTop: "50px",
                        }}
                      >
                        <img
                          src={APP_CONFIG.assets.tokenImageSvg}
                          style={{ width: "80%" }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Modal>
              </Box>
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Box>

      {/* <Dialog
        open={openModalFavorito}
        onBackdropClick={() => setOpenModalFavorito(false)}
      >
        {infoFavoritos && infoFavoritos.contas && (
          <>
            <Box
              style={{
                padding: 30,
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
              }}
            >
              <Typography
                style={{
                  color: APP_CONFIG.mainCollors.primary,
                  fontSize: "20px",
                }}
              >
                {infoFavoritos.nome}
              </Typography>

              {infoFavoritos.contas.map((item) => (
                <>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      width={"90%"}
                      className={classes.subBoxFavorito}
                      onClick={() => handleSelectFavorito(item)}
                    >
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          style={{
                            color: APP_CONFIG.mainCollors.primary,
                            fontWeight: "bold",
                          }}
                        >
                          {item.tipo}
                        </Typography>
                        <Typography
                          style={{
                            color: APP_CONFIG.mainCollors.primary,
                          }}
                        >
                          {item.chave_recebedor}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      width={"10%"}
                      className={classes.boxDeleteIcon}
                      onClick={() => handleDeleteFavorito(item.id)}
                    >
                      <DeleteIcon style={{ color: "#ED757D" }} />
                    </Box>
                  </Box>
                </>
              ))}
            </Box>
          </>
        )}
      </Dialog> */}
    </>
  );
};

export default TransferirContainer;

function parseTipoContaPayload(type) {
  switch (type) {
    case "conta_corrente":
      return "checking_account";
    case "conta_salario":
      return "SLRY";
    case "conta_poupanca":
      return "SVGS";
    case "conta_pagamento":
      return "TRAN";
    default:
      return "";
  }
}
