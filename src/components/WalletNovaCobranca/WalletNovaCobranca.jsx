import {
  AppBar,
  Box,
  makeStyles,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonIcon from "@material-ui/icons/Person";
import { FormControl, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { toast } from "react-toastify";
import {
  delFavoritoWalletAction,
  getFavoritosWalletAction,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  postBuscarContaQrCode,
  postEfetuarPagamentoWallet,
} from "../../services/services";
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
  title: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: "20px",
    color: APP_CONFIG.mainCollors.primary,
    fontWeight: "bold",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    color: APP_CONFIG.mainCollors.primary,
    fontWeight: "normal",
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

const WalletNovaCobranca = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const favoritosWallet = useSelector((state) => state.favoritosWallet);
  const [documento, setDocumento] = useState("");
  const [dadosPagador, setDadosPagador] = useState({});
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0.0);

  const [maskType, setMaskType] = useState("cpf");
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(0);
  const [openModalFavorito, setOpenModalFavorito] = useState(false);
  const [infoFavoritos, setInfoFavoritos] = useState({
    nome: "",
    contas: [],
  });

  let debounceDoc = useDebounce(documento, 1000);

  useEffect(() => {
    dispatch(getFavoritosWalletAction(token));
  }, [token]);

  useEffect(() => {
    if (debounceDoc != "") {
      (async () => {
        await buscarConta();
      })();
    }
  }, [debounceDoc]);

  async function buscarConta() {
    const { data } = await postBuscarContaQrCode(token, debounceDoc);

    if (data.data.length == 0) {
      setErrors({
        documento: ["Pagador não encontrado."],
      });
      setDadosPagador({});
    } else {
      setErrors({});
      setDadosPagador(data.data[0]);
    }
  }

  function verificarTipoDocumento(doc) {
    let formatado = doc.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gi,
      "",
    );

    if (formatado.length <= 11) {
      if (maskType !== "cpf") {
        setMaskType("cpf");
      }
    } else {
      if (maskType !== "cnpj") {
        setMaskType("cnpj");
      }
    }
    setDocumento(doc);
  }

  function handleOpenModal() {
    if (valor == 0) {
      return toast.error("Preencha um valor maior que zero");
    }
    if (Object.keys(dadosPagador).length == 0) {
      return toast.error("Pagador não encontrado");
    }
    if (descricao == "") {
      return toast.error("Descrição obrigatória");
    }

    setOpenModal(true);
  }

  async function handlePagar() {
    try {
      setOpenModal(false);
      setLoading(true);
      const { data } = await postEfetuarPagamentoWallet(
        token,
        dadosPagador.id,
        valor,
        descricao,
      );
      console.log("pago com sucesso", data);
      toast.success("Pagamento efetuado com sucesso!");
      setLoading(false);
      changePath("listaCobrancasEnviadas");
    } catch (err) {
      setErrors(err.response.data.errors);
      setLoading(false);
      console.log(err);
      toast.error("Erro ao efetuar pagamento, tente novamente.");
    }
  }

  const handleSetFavorito = (item) => {
    setLoading(true);
    console.log(item);
    verificarTipoDocumento(item.destino.documento);
    setValue(0);

    setLoading(false);
  };

  const handleDeleteFavorito = async (id) => {
    setLoading(true);
    const resDeleteFavorito = await dispatch(
      delFavoritoWalletAction(token, id),
    );
    if (resDeleteFavorito) {
      toast.error("Erro ao excluir contato dos favoritos");
      setLoading(false);
    } else {
      toast.success("Contato excluído dos favoritos");
      setLoading(false);

      await dispatch(getFavoritosWalletAction(token));
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
                      Valor da cobrança
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
                        <FormControl fullWidth>
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
                            value={valor}
                            onChangeEvent={(event, maskedvalue, floatvalue) => {
                              setValor(floatvalue);
                            }}
                          />
                          {errors.valor ? (
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
                  {dadosPagador.nome && (
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "15px",
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      ID: {dadosPagador.id} <br />
                      Nome: {dadosPagador.nome}
                    </Typography>
                  )}

                  <Box style={{ marginTop: "30px" }}>
                    <InputMask
                      maskChar=" "
                      mask={
                        maskType === "cpf"
                          ? "999.999.999-999"
                          : "99.999.999/9999-99"
                      }
                      onChange={(e) => verificarTipoDocumento(e.target.value)}
                      value={documento}
                    >
                      {() => (
                        <TextField
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          error={errors.documento}
                          helperText={
                            errors.documento ? errors.documento.join(" ") : null
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
                      label="Descrição"
                      error={errors.descricao}
                      helperText={
                        errors.descricao ? errors.descricao.join(" ") : null
                      }
                      value={descricao}
                      onChange={(e) => {
                        setDescricao(e.target.value);
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
                    color="purple"
                    onClick={() => handleOpenModal()}
                  >
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
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        marginTop: "30px",
                      }}
                    >
                      <Typography className={classes.title}>
                        Confirme os dados.
                      </Typography>
                      <Box
                        style={{
                          width: "90%",
                          height: "1px",
                          backgroundColor: APP_CONFIG.mainCollors.primary,
                        }}
                      />
                      <Box
                        style={{
                          display: "flex",
                          marginTop: 20,
                          justifyContent: "end",
                          width: "100%",
                        }}
                      >
                        <Box width={"45%"}>
                          <Typography className={classes.title}>
                            Nome:
                          </Typography>
                          <Typography className={classes.text}>
                            {dadosPagador.nome}
                          </Typography>
                        </Box>
                        <Box width={"45%"}>
                          <Typography className={classes.title}>
                            Documento:
                          </Typography>
                          <Typography className={classes.text}>
                            {documento}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          marginTop: 20,
                          justifyContent: "end",
                          width: "100%",
                        }}
                      >
                        <Box width={"45%"}>
                          <Typography className={classes.title}>
                            Descrição:
                          </Typography>
                          <Typography className={classes.text}>
                            {descricao}
                          </Typography>
                        </Box>
                        <Box width={"45%"}>
                          <Typography className={classes.title}>
                            Valor:
                          </Typography>
                          <Typography className={classes.text}>
                            R${" "}
                            {parseFloat(valor).toLocaleString("pt-br", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "30px",
                        }}
                      >
                        <Box style={{ marginTop: "10px" }}>
                          <CustomButton
                            variant="contained"
                            color="purple"
                            style={{ marginTop: "10px" }}
                            onClick={handlePagar}
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
                {favoritosWallet && favoritosWallet.data && (
                  <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                    Todos os contatos:
                  </Typography>
                )}

                <Box style={{ display: "flex", flexDirection: "column" }}>
                  {favoritosWallet &&
                  favoritosWallet.data &&
                  favoritosWallet.data.length > 0 ? (
                    <>
                      {favoritosWallet.data.map((item) => (
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
				Cobrar pagador
			</Typography> */}
    </>
  );
};

export default WalletNovaCobranca;
