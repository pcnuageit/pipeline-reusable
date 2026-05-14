import {
  AppBar,
  Box,
  FormHelperText,
  makeStyles,
  Modal,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@material-ui/icons/Person";
import { useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import CurrencyInput from "react-currency-input";
import ReactInputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { toast } from "react-toastify";
import {
  delFavoritoP2PAction,
  getFavoritosP2PAction,
  setRedirecionarValorTransferencia,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { postBuscarConta, postTransferenciaP2P } from "../../services/services";
import CustomButton from "../CustomButton/CustomButton";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

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
  textField: {
    borderBottom: "3px",
    borderBottomColor: "white",
    borderRadius: "0px",

    /* boxShadow: '0px 0px 5px 0.5px grey', */
    height: "45px !important",
    borderColor: "white",
    borderWidth: "1px",
    "& .MuiInput-underline:before": {
      borderBottom: "0px solid white",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "0px solid yellow",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "0px solid green",
    },
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
    width: "30px",
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

const TransferirP2PContainer = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const consultaChave = useSelector((state) => state.consultaChave);
  const valorTransferencia = useSelector(
    (state) => state.redirecionarValorTransferencia,
  );
  const favoritosP2P = useSelector((state) => state.favoritosP2P);
  const token = useAuth();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [openModal, setOpenModal] = useState(false);
  const [docTransferir, setDocTransferir] = useState("");
  const [docValido, setDocValido] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [docTransferirDados, setDocTransferirDados] = useState({
    conta_destino_id: "",
    valor: valorTransferencia ? valorTransferencia : "",
    descricao: "",
    favorito: false,
    tokenTotp: "",
  });

  let deboundedDoc = useDebounce(docTransferir, 1000);
  const [dadosDestinatario, setDadodosDestinatario] = useState({
    documento: "",
    email: "",
    nome: "",
  });
  const [value, setValue] = useState(0);

  const [infoFavoritos, setInfoFavoritos] = useState({
    nome: "",
    contas: [],
  });

  useEffect(() => {
    dispatch(getFavoritosP2PAction(token));
  }, [token]);

  /* useEffect(() => {
		(async () => {
			verificarDocumentoParaTransferencia(deboundedDoc);
		})();
	}, [deboundedDoc]); */

  const handleSetFavorito = (item) => {
    setLoading(true);
    console.log(item);
    formatarDocumento(item.destino.documento);

    setValue(0);

    setLoading(false);
  };

  const handleDeleteFavorito = async (id) => {
    setLoading(true);
    const resDeleteFavorito = await dispatch(delFavoritoP2PAction(token, id));
    if (resDeleteFavorito) {
      toast.error("Erro ao excluir contato dos favoritos");
      setLoading(false);
    } else {
      toast.success("Contato excluído dos favoritos");
      setLoading(false);

      await dispatch(getFavoritosP2PAction(token));
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

  async function verificarDocumentoParaTransferencia(doc) {
    if (doc != "") {
      try {
        setLoading(true);
        const { data } = await postBuscarConta(docTransferir);
        if (data.status === "approved") {
          setDadodosDestinatario(data);
          setDocTransferirDados({
            ...docTransferirDados,
            conta_destino_id: data.id,
          });
          setDocValido(true);
        }
      } catch (err) {
        setDocValido(false);
        toast.error("Não encontramos esse cpf para transferência");
      } finally {
        setLoading(false);
      }
    }
  }
  function formatarDocumento(doc) {
    let formatado = doc.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gi,
      "",
    );

    console.log(formatado);
    setDocTransferir(formatado);
  }
  function handleOpenModal() {
    if (docTransferirDados.valor < 0) {
      return toast.error("Digite um valor para transferir.");
    } else {
      setOpenModal(true);
    }
  }

  async function handleTransferir() {
    if (
      docTransferirDados.tokenTotp !== "" &&
      docTransferirDados.conta_destino_id !== ""
    ) {
      try {
        setLoading(true);

        await postTransferenciaP2P(
          token,
          docTransferirDados.conta_destino_id,
          docTransferirDados.valor,
          docTransferirDados.descricao,
          docTransferirDados.favorito,
          docTransferirDados.tokenTotp,
        );

        toast.success("Transferência aguardando aprovação!");
        //clearData();
        setLoading(false);
        changePath("aprovacoes");
      } catch (err) {
        setErrors(err.response.data.errors);
        console.log(err);
        setLoading(false);
        /* setDocTransferirDados({
					...docTransferirDados,
					tokenTotp: '',
				}); */
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
        /* toast.error('Erro ao efetuar transferência, tente novamente.'); */
      }
    } else {
      console.log("erro");
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setRedirecionarValorTransferencia(null));
    };
  }, []);

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

                        {/* <CustomTextField
									value={docTransferirDados.valor}
									onChange={(e) => {
										setDocTransferirDados({
											...docTransferirDados,
											valor: e.target.value,
										});
									}}
								/> */}
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
                  {dadosDestinatario.documento != "" && (
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "17px",
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      Documento: {dadosDestinatario.documento}
                      <br />
                      E-mail: {dadosDestinatario.email}
                      <br />
                      Nome: {dadosDestinatario.nome}
                    </Typography>
                  )}
                  <Box style={{ marginTop: "30px" }}>
                    <ReactInputMask
                      maskChar=" "
                      mask={
                        docTransferir.length <= 11
                          ? "999.999.999-999"
                          : "99.999.999/9999-99"
                      }
                      onChange={(e) => formatarDocumento(e.target.value)}
                      onBlur={(e) =>
                        verificarDocumentoParaTransferencia(e.target.value)
                      }
                      value={docTransferir}
                    >
                      {() => (
                        <TextField
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          name="documento"
                          fullWidth
                          required
                          label={"CPF/CNPJ"}
                        />
                      )}
                    </ReactInputMask>
                  </Box>
                  <Box style={{ marginTop: "20px" }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Descrição"
                      value={docTransferirDados.descricao}
                      onChange={(e) => {
                        setDocTransferirDados({
                          ...docTransferirDados,
                          descricao: e.target.value,
                        });
                      }}
                    />
                  </Box>

                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "20px",
                      backgroundColor: APP_CONFIG.mainCollors.primary,
                      width: "20%",
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
                      /* style={{ color: APP_CONFIG.mainCollors.primary }} */
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
                  <CustomButton
                    color={"purple"}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                    disabled={!docValido}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                        opacity: !docValido ? 0.3 : 1,
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
                        value={docTransferirDados.tokenTotp}
                        onChange={(e) =>
                          setDocTransferirDados({
                            ...docTransferirDados,
                            tokenTotp: e,
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

                      {errors && errors.token ? (
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
                {favoritosP2P && favoritosP2P.data && (
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    Todos os contatos:
                  </Typography>
                )}

                <Box style={{ display: "flex", flexDirection: "column" }}>
                  {favoritosP2P &&
                  favoritosP2P.data &&
                  favoritosP2P.data.length > 0 ? (
                    <>
                      {favoritosP2P.data.map((item) => (
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            width="90%"
                            className={classes.boxFavorito}
                            onClick={() => {
                              handleSetFavorito(item);
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
                              {item.destino.nome}
                            </Typography>
                          </Box>
                          <Box
                            width={"10%"}
                            /* height={'70px'} */
                            className={classes.boxDeleteIcon}
                            onClick={() => handleDeleteFavorito(item.id)}
                          >
                            <DeleteIcon style={{ color: "#ED757D" }} />
                          </Box>
                        </Box>
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

export default TransferirP2PContainer;
