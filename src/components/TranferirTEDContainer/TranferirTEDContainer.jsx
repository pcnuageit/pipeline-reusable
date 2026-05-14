import {
  AppBar,
  Box,
  Dialog,
  FormHelperText,
  //InputLabel,
  makeStyles,
  //MenuItem,
  Modal,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  delFavoritoTEDAction,
  getFavoritosTEDAction,
  loadBancos,
  setRedirecionarValorTransferencia,
} from "../../actions/actions";
import useAuth from "../../hooks/useAuth";
import { postTransacaoTed } from "../../services/services";
import CustomButton from "../CustomButton/CustomButton";

import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import CurrencyInput from "react-currency-input";
import InputMask from "react-input-mask";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
//import SelectSearch from 'react-select-search';
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@material-ui/icons/Person";
import { Autocomplete } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { APP_CONFIG } from "../../constants/config";

const useStyles = makeStyles((theme) => ({
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",

    top: "10%",
    left: "25%",
    /* transform: 'translate(-50%, -50%)', */
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    /* bgcolor: 'background.paper', */
    border: "0px solid #000",
    boxShadow: 24,
    /* p: 5, */
  },
  boxFavorito: {
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

const TransferirTEDContainer = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const listaBancos = useSelector((state) => state.bancos);
  const valorTransferencia = useSelector(
    (state) => state.redirecionarValorTransferencia,
  );
  const favoritosTED = useSelector((state) => state.favoritosTED);
  const token = useAuth();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tedErros, setTedErros] = useState({});
  const [docTransferirDados, setDocTransferirDados] = useState({
    banco: "",
    agencia: "",
    conta: "",
    digitoConta: "",
    tipo_conta: " ",
    documento: "",
    nome: "",
    valor: valorTransferencia ? valorTransferencia : "",
    favorito: false,
    token: "",
  });
  const [bankOptions, setBankOptions] = useState([]);
  const [value, setValue] = useState(0);
  const [openModalFavorito, setOpenModalFavorito] = useState(false);
  const [infoFavoritos, setInfoFavoritos] = useState({
    nome: "",
    contas: [],
  });

  useEffect(() => {
    dispatch(getFavoritosTEDAction(token));
  }, [token]);

  const handleSetFavorito = (item) => {
    setLoading(true);
    setDocTransferirDados({
      ...docTransferirDados,
      documento: item.documento,
      nome: item.nome,
      agencia: item.agencia,
      conta: item.conta,
      tipo_conta: item.tipo_conta,
      digitoConta: item.digito_conta,
      banco: item.banco,
    });
    setValue(0);
    setOpenModalFavorito(false);
    setLoading(false);
  };

  const handleDeleteFavorito = async (id) => {
    setLoading(true);
    const resDeleteFavorito = await dispatch(delFavoritoTEDAction(token, id));
    if (resDeleteFavorito) {
      toast.error("Erro ao excluir contato dos favoritos");
      setLoading(false);
    } else {
      toast.success("Contato excluído dos favoritos");
      setLoading(false);
      setOpenModalFavorito(false);
      await dispatch(getFavoritosTEDAction(token));
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const getIndicatorColor = (index) =>
    index === value ? `2px solid ${APP_CONFIG.mainCollors.primary}` : null;

  function formatarDocumento(doc) {
    let formatado = doc.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gi,
      "",
    );

    console.log(formatado);
    setDocTransferirDados({
      ...docTransferirDados,
      documento: formatado,
    });
  }
  useEffect(() => {
    dispatch(loadBancos(token));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setRedirecionarValorTransferencia(null));
    };
  }, []);

  useEffect(() => {
    if (listaBancos) {
      setBankOptions(
        listaBancos.map((item) => {
          return { name: item.nome, value: item.valor };
        }),
      );
    }
  }, [listaBancos]);

  function clearData() {
    setDocTransferirDados({
      ...docTransferirDados,
      token: "",
    });
  }

  async function handleTransferir() {
    if (
      docTransferirDados.nome !== "" &&
      docTransferirDados.agencia !== "" &&
      docTransferirDados.conta !== "" &&
      docTransferirDados.banco !== "" &&
      docTransferirDados.digitoConta !== "" &&
      docTransferirDados.tipo_conta !== " " &&
      docTransferirDados.documento !== "" &&
      docTransferirDados.token !== ""
    ) {
      try {
        setLoading(true);
        await postTransacaoTed(
          token,
          docTransferirDados.token,
          docTransferirDados.banco,
          docTransferirDados.agencia,
          docTransferirDados.conta,
          docTransferirDados.digitoConta,
          docTransferirDados.tipo_conta,
          docTransferirDados.documento,
          docTransferirDados.nome,
          docTransferirDados.valor,
          docTransferirDados.favorito,
        );

        toast.success("Transferência aguardando aprovação!");
        setLoading(false);
        changePath("aprovacoes");
      } catch (err) {
        setLoading(false);
        setTedErros(err.response.data.errors);
        if (err.response && err.response.status === 400) {
          if (err.response.data.result) {
            toast.error(err.response.data.message);
          }
        } else if (err.response && err.response.status === 422) {
          if (err.response.data.result) {
            toast.error(err.response.data.message);
          }
        } else {
          toast.error(
            "Erro ao efetuar transferência, verifique o token e tente novamente.",
          );
        }

        //clearData();
      }
    } else {
      toast.error("Erro, verifique os dados e tente novamente.");
    }
  }

  function handleModal() {
    if (docTransferirDados.valor < 0) {
      return toast.error("Digite um valor para transferir");
    }
    if (
      docTransferirDados.nome === "" ||
      docTransferirDados.agencia === "" ||
      docTransferirDados.conta === "" ||
      docTransferirDados.banco === "" ||
      docTransferirDados.digitoConta === "" ||
      docTransferirDados.tipo_conta === " " ||
      docTransferirDados.documento === ""
    ) {
      return toast.error(
        "Todos os dados são obrigátorios, revise os dados por favor.",
      );
    }

    setOpenModal(true);
  }
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
              /* borderTopRightRadius: 27,
												borderTopLeftRadius: 27, */
            }}
          >
            <Tabs
              style={{
                color: APP_CONFIG.mainCollors.primary,
                width: "460px",
                boxShadow: "none",
              }}
              value={value}
              onChange={handleChange}
              indicatorcolor={APP_CONFIG.mainCollors.primary}
              //textColor="primary"
              variant="fullWidth"
            >
              <Tab
                label="Transferir"
                style={{
                  width: "100%",
                  borderBottom: getIndicatorColor(0),
                }}
                {...a11yProps(0)}
              />

              <Tab
                label="Favoritos"
                style={{
                  width: "100%",
                  borderBottom: getIndicatorColor(1),
                }}
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {/* <Box
					style={{
						width: '90%',
						height: '1px',
						backgroundColor: APP_CONFIG.mainCollors.primary,
					}}
				/> */}

                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    style={{
                      backgroundColor: APP_CONFIG.mainCollors.primary,
                      display: "flex",
                      flexDirection: "column",
                      /* height: '200px', */
                      padding: "20px",
                      borderRadius: "17px",
                      alignItems: "center",
                      width: "100%",
                      maxWidth: 400,
                      /* justifyContent: 'center', */
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
                        <FormControl fullWidth error={tedErros.valor}>
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
                            value={docTransferirDados.valor}
                            onChangeEvent={(event, maskedvalue, floatvalue) => {
                              setDocTransferirDados({
                                ...docTransferirDados,
                                valor: floatvalue,
                              });
                            }}
                          />
                          {tedErros.valor ? (
                            <FormHelperText
                              style={{
                                fontSize: 14,
                                textAlign: "center",
                                fontFamily: "Montserrat-ExtraBold",
                                color: "red",
                              }}
                            >
                              {tedErros.valor.join(" ")}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "90%",
                    marginTop: "30px",
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "17px",
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  ></Typography>

                  <Box style={{ marginTop: "30px" }}>
                    <InputMask
                      maskChar=" "
                      mask={
                        docTransferirDados.documento.length <= 11
                          ? "999.999.999-999"
                          : "99.999.999/9999-99"
                      }
                      onChange={(e) => formatarDocumento(e.target.value)}
                      value={docTransferirDados.documento}
                    >
                      {() => (
                        <TextField
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          error={tedErros.documento}
                          helperText={
                            tedErros.documento
                              ? tedErros.documento.join(" ")
                              : null
                          }
                          name="documento"
                          fullWidth
                          required
                          label={"CPF/CNPJ"}
                        />
                      )}
                    </InputMask>
                  </Box>
                  <Box style={{ marginTop: "20px" }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Nome"
                      type="text"
                      error={tedErros.nome}
                      helperText={
                        tedErros.nome ? tedErros.nome.join(" ") : null
                      }
                      value={docTransferirDados.nome}
                      onChange={(e) => {
                        setDocTransferirDados({
                          ...docTransferirDados,
                          nome: e.target.value,
                        });
                      }}
                    />
                  </Box>
                  <Box
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      error={tedErros.agencia}
                      helperText={
                        tedErros.agencia ? tedErros.agencia.join(" ") : null
                      }
                      label="Agência"
                      type="number"
                      value={docTransferirDados.agencia}
                      onChange={(e) => {
                        setDocTransferirDados({
                          ...docTransferirDados,
                          agencia: e.target.value.toString().slice(0, 5),
                        });
                      }}
                    />
                    <TextField
                      variant="outlined"
                      error={tedErros.conta}
                      helperText={
                        tedErros.conta ? tedErros.conta.join(" ") : null
                      }
                      label="Conta"
                      type="number"
                      value={docTransferirDados.conta}
                      onChange={(e) => {
                        setDocTransferirDados({
                          ...docTransferirDados,
                          conta: e.target.value.toString().slice(0, 10),
                        });
                      }}
                    />
                    <TextField
                      variant="outlined"
                      label="Digito da conta"
                      type="number"
                      error={tedErros.conta}
                      helperText={
                        tedErros.conta ? tedErros.conta.join(" ") : null
                      }
                      value={docTransferirDados.digitoConta}
                      onChange={(e) => {
                        setDocTransferirDados({
                          ...docTransferirDados,
                          digitoConta: e.target.value.toString().slice(0, 1),
                        });
                      }}
                    />
                    <Select
                      style={{
                        color: APP_CONFIG.mainCollors.secondary,
                      }}
                      variant="outlined"
                      value={docTransferirDados.tipo_conta}
                      label="Tipo da conta"
                      onChange={(e) => {
                        setDocTransferirDados({
                          ...docTransferirDados,
                          tipo_conta: e.target.value,
                        });
                      }}
                    >
                      <MenuItem
                        value={" "}
                        style={{
                          color: APP_CONFIG.mainCollors.secondary,
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        Tipo da conta
                      </MenuItem>
                      <MenuItem
                        value={0}
                        style={{
                          color: APP_CONFIG.mainCollors.secondary,
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        Conta Corrente
                      </MenuItem>
                      <MenuItem
                        value={1}
                        style={{
                          color: APP_CONFIG.mainCollors.secondary,
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        Conta Poupança
                      </MenuItem>
                    </Select>
                  </Box>

                  <FormControl style={{ marginTop: 20 }} error={tedErros.banco}>
                    {listaBancos && (
                      <>
                        <Autocomplete
                          value={docTransferirDados.banco}
                          onChange={(e, value) =>
                            setDocTransferirDados({
                              ...docTransferirDados,
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
                        />
                        {tedErros.banco ? (
                          <FormHelperText>
                            {tedErros.banco.join(" ")}
                          </FormHelperText>
                        ) : null}
                      </>
                    )}

                    {/* {listaBancos && (
							<>
								<InputLabel id="demo-simple-select-label">
									Banco
								</InputLabel>
								<Select
									fullWidth
									onChange={(e) =>
										setDocTransferirDados({
											...docTransferirDados,
											banco: e.target.value,
										})
									}
									variant="outlined"
									style={{
										borderRadius: 24,
									}}
									labelId="demo-simple-select-label"
								>
									{listaBancos.map((item) => (
										<MenuItem value={item.valor}>
											{item.nome}
										</MenuItem>
									))}
								</Select>
								{tedErros.banco ? (
									<FormHelperText>
										{tedErros.banco.join(' ')}
									</FormHelperText>
								) : null}
							</>
						)} */}
                  </FormControl>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "20px",
                      backgroundColor: APP_CONFIG.mainCollors.primary,
                      width: "150px",
                      borderRadius: "27px",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "16px",
                        color: "white",
                      }}
                    >
                      Favoritar:
                    </Typography>

                    <Switch
                      checked={docTransferirDados.favorito}
                      onChange={(e) => {
                        setDocTransferirDados({
                          ...docTransferirDados,
                          favorito: e.target.checked,
                        });
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  style={{
                    marginTop: "30px",
                    marginBottom: "15px",
                  }}
                >
                  <CustomButton color="purple" onClick={() => handleModal()}>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Continuar
                    </Typography>
                  </CustomButton>
                </Box>
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
                        value={docTransferirDados.token}
                        onChange={(e) =>
                          setDocTransferirDados({
                            ...docTransferirDados,
                            token: e,
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
                      {tedErros.token ? (
                        <FormHelperText
                          style={{
                            fontSize: 14,
                            textAlign: "center",
                            fontFamily: "Montserrat-ExtraBold",
                            color: "red",
                          }}
                        >
                          {tedErros.token.join(" ")}
                        </FormHelperText>
                      ) : null}

                      {tedErros && tedErros.valor ? (
                        <FormHelperText
                          style={{
                            fontSize: 14,
                            textAlign: "center",
                            fontFamily: "Montserrat-ExtraBold",
                            color: "red",
                          }}
                        >
                          {tedErros.valor.join(" ")}
                        </FormHelperText>
                      ) : null}

                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "30px",
                        }}
                      >
                        <Box style={{ marginTop: "10px" }}>
                          <CustomButton
                            disabled={loading}
                            variant="contained"
                            color="purple"
                            style={{ marginTop: "10px" }}
                            onClick={handleTransferir}
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
            <TabPanel value={value} index={1} dir={theme.direction}>
              <>
                {favoritosTED && favoritosTED.length > 0 && (
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    Todos os contatos:
                  </Typography>
                )}

                <Box style={{ display: "flex", flexDirection: "column" }}>
                  {favoritosTED && favoritosTED.length > 0 ? (
                    <>
                      {favoritosTED.map((item) => (
                        <>
                          <Box
                            className={classes.boxFavorito}
                            onClick={() => {
                              setInfoFavoritos({
                                ...infoFavoritos,
                                nome: item.nome,
                                contas: item.contas,
                              });
                              setOpenModalFavorito(true);
                            }}
                          >
                            <Box
                              style={{
                                backgroundColor: APP_CONFIG.mainCollors.primary,
                                display: "flex",
                                flexDirection: "column",
                                height: "50px",
                                width: "50px",
                                borderRadius: "32px",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <PersonIcon
                                style={{
                                  color: "white",
                                  fontSize: "30px",
                                }}
                              />
                            </Box>

                            <Typography
                              style={{
                                color: APP_CONFIG.mainCollors.primary,
                                marginLeft: "10px",
                              }}
                            >
                              {item.nome}
                            </Typography>
                          </Box>
                        </>
                      ))}
                    </>
                  ) : (
                    <Typography
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      Você não tem contatos favoritos.
                    </Typography>
                  )}
                </Box>
              </>
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Box>
      <Dialog
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
                      onClick={() => {
                        handleSetFavorito(item);
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            style={{
                              color: APP_CONFIG.mainCollors.primary,
                            }}
                          >
                            {item.nome}
                          </Typography>
                          <Typography
                            style={{
                              color: APP_CONFIG.mainCollors.primary,
                            }}
                          >
                            {item.documento}
                          </Typography>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            style={{
                              color: APP_CONFIG.mainCollors.primary,
                            }}
                          >
                            Agência: {item.agencia}
                          </Typography>
                          <Typography
                            style={{
                              color: APP_CONFIG.mainCollors.primary,
                            }}
                          >
                            Conta: {item.conta}
                          </Typography>
                          <Typography
                            style={{
                              color: APP_CONFIG.mainCollors.primary,
                            }}
                          >
                            Dígito Conta: {item.digito_conta}
                          </Typography>
                          <Typography
                            style={{
                              color: APP_CONFIG.mainCollors.primary,
                            }}
                          >
                            Banco: {item.nome_banco}
                          </Typography>
                        </Box>
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
      </Dialog>
      {/* <Typography
				style={{
					fontFamily: 'Montserrat-ExtraBold',
					fontSize: '16px',
					color: APP_CONFIG.mainCollors.primary,
					marginTop: '30px',
					marginLeft: '40px',
				}}
			>
				Transferir
			</Typography> */}
    </>
  );
};

export default TransferirTEDContainer;
