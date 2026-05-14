import "moment/locale/pt-br";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import {
  AttachMoneyOutlined,
  CompareArrows,
  Pages,
  Receipt,
  Replay,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Pix } from "@mui/icons-material";
import moment from "moment";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { generatePath, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getListaBannerAction,
  loadExtratoFilter,
  loadUserData,
  setRedirecionarTransferencia,
  setRedirecionarValorTransferencia,
  UserTypeAction,
} from "../../actions/actions";
import CustomCard from "../../components/CustomCard/CustomCard";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

moment.locale();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dadosBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: "50px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
  currencyInput: {
    marginBottom: "6px",
    alignSelf: "center",
    textAlign: "center",
    height: 45,
    fontSize: 17,
    borderWidth: "1px !important",
    borderRadius: 27,
    border: "none",
    color: APP_CONFIG.mainCollors.primary,
    backgroundColor: "transparent",
    fontFamily: "Montserrat-Regular",
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector((state) => state.userData);
  const extrato = useSelector((state) => state.extrato);
  const listaBanner = useSelector((state) => state.listaBanner);
  const userType = useSelector((state) => state.userType);
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalRetirada, setModalRetirada] = useState(false);
  const [textRetirada, setTextRetirada] = useState(false);
  const [valorRetirada, setValorRetirada] = useState(null);
  const [tipoTransferencia, setTipoTransferencia] = useState("");

  const handleContinuar = () => {
    if (tipoTransferencia && valorRetirada) {
      dispatch(setRedirecionarTransferencia(true));
      dispatch(setRedirecionarValorTransferencia(valorRetirada));
      if (tipoTransferencia === "Pix") {
        const path = generatePath("/dashboard/pix");
        history.push(path);
      }
      if (tipoTransferencia === "TED") {
        const path = generatePath("/dashboard/extratoTED");
        history.push(path);
      }
      if (tipoTransferencia === "P2P") {
        const path = generatePath("/dashboard/extratoP2P");
        history.push(path);
      }
    } else {
      toast.error("Preencha todos os campos");
    }
  };

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    const isGestao =
      userData?.is_gestao_concorrencia === true &&
      userData?.is_estabelecimento === false;
    const isBanking =
      userData?.is_gestao_concorrencia === false &&
      userData?.is_estabelecimento === false;
    dispatch(UserTypeAction({ isGestao, isBanking }));
  }, [token, userData]);

  useEffect(() => {
    dispatch(loadExtratoFilter(token, "", "", "", "", "", "", "", "", ""));
  }, [token]);

  useEffect(() => {
    dispatch(getListaBannerAction(token, "", ""));
  }, [token]);

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {userType?.isBanking ? (
              <Grid container spacing={2} style={{ marginTop: "0px" }}>
                <Grid item sm={3} xs={12}>
                  <Box
                    style={{
                      display: "flex",
                      backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                      /* height: '100px', */
                      borderRadius: "17px",
                      flexDirection: "column",

                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "16px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "30px",
                      }}
                    >
                      Saldo disponível
                    </Typography>
                    <Box
                      style={{
                        width: "80%",
                        height: "1px",
                        backgroundColor: APP_CONFIG.mainCollors.primary,
                      }}
                    />

                    {userData?.saldo?.valor && (
                      <Typography
                        style={{
                          fontFamily: "Montserrat-Regular",
                          fontSize: "20px",
                          color: APP_CONFIG.mainCollors.primary,
                          marginTop: "35px",
                        }}
                      >
                        R$
                        {parseFloat(userData.saldo.valor).toLocaleString(
                          "pt-br",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </Typography>
                    )}

                    <Box
                      style={{
                        marginTop: "30px",
                        marginBottom: "25px",
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: APP_CONFIG.mainCollors.secondary,
                          borderRadius: "27px",
                          marginTop: "15px",
                        }}
                        color="purple"
                        onClick={() => {
                          setModalRetirada(true);
                          setTextRetirada(true);
                          setValorRetirada(null);
                        }}
                      >
                        <Typography
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: "16px",
                            color: "white",
                          }}
                        >
                          Retirada
                        </Typography>
                      </Button>
                    </Box>

                    <Dialog
                      open={modalRetirada}
                      onClose={() => {
                        setModalRetirada(false);
                        setTextRetirada(false);
                        setValorRetirada(null);
                      }}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                        id="form-dialog-title"
                      >
                        {textRetirada
                          ? "Método de retirada"
                          : "Método de transferência"}
                      </DialogTitle>
                      <form /* onSubmit={(e) => handleContinuar()} */>
                        <DialogContent>
                          {textRetirada ? (
                            <>
                              <DialogContentText
                                style={{
                                  color: APP_CONFIG.mainCollors.primary,
                                }}
                              >
                                Selecione um valor:
                              </DialogContentText>
                              <CurrencyInput
                                placeHolder="R$0,00"
                                className={classes.currencyInput}
                                decimalSeparator=","
                                thousandSeparator="."
                                prefix="R$ "
                                value={valorRetirada}
                                onChangeEvent={(
                                  event,
                                  maskedvalue,
                                  floatvalue,
                                ) => {
                                  setValorRetirada(floatvalue);
                                }}
                              />
                            </>
                          ) : null}

                          <DialogContentText
                            style={{
                              color: APP_CONFIG.mainCollors.primary,
                              marginTop: "10px",
                            }}
                          >
                            {textRetirada
                              ? "Escolha como fazer a retirada:"
                              : "Escolha como fazer a transferência:"}
                          </DialogContentText>
                          <Box>
                            <Box
                              style={{
                                display: "flex",
                                alignItems: "center",
                                alignSelf: "center",
                                marginTop: "30px",
                              }}
                            >
                              <Box>
                                <Select
                                  style={{ width: "200px" }}
                                  value={tipoTransferencia}
                                  label="Tipo"
                                  onChange={(e) =>
                                    setTipoTransferencia(e.target.value)
                                  }
                                >
                                  <MenuItem
                                    value={"Pix"}
                                    style={{
                                      color: APP_CONFIG.mainCollors.secondary,
                                      fontFamily: "Montserrat-Regular",
                                    }}
                                  >
                                    Pix
                                  </MenuItem>
                                  <MenuItem
                                    value={"TED"}
                                    style={{
                                      color: APP_CONFIG.mainCollors.secondary,
                                      fontFamily: "Montserrat-Regular",
                                    }}
                                  >
                                    TED
                                  </MenuItem>
                                  <MenuItem
                                    value={"P2P"}
                                    style={{
                                      color: APP_CONFIG.mainCollors.secondary,
                                      fontFamily: "Montserrat-Regular",
                                    }}
                                  >
                                    P2P
                                  </MenuItem>
                                </Select>
                              </Box>
                            </Box>
                          </Box>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setModalRetirada(false);
                              setTextRetirada(false);
                              setValorRetirada(null);
                            }}
                            color="primary"
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => {
                              setModalRetirada(false);
                              handleContinuar();
                            }}
                            color="primary"
                            /* type="submit" */
                          >
                            Continuar
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                  </Box>
                </Grid>

                <Grid item sm={4} xs={12}>
                  <Box
                    style={{
                      display: "flex",
                      backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                      /* height: '100px', */
                      borderRadius: "17px",
                      flexDirection: "column",

                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "16px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "30px",
                      }}
                    >
                      Transferências
                    </Typography>
                    <Box
                      style={{
                        width: "80%",
                        height: "1px",
                        backgroundColor: APP_CONFIG.mainCollors.primary,
                      }}
                    />
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "13px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "10px",
                      }}
                    >
                      Quanto você quer transferir?
                    </Typography>

                    <CurrencyInput
                      placeHolder="R$0,00"
                      style={{
                        alignSelf: "center",
                        textAlign: "center",
                        height: 45,
                        fontSize: "20px",
                        borderWidth: "1px !important",
                        borderRadius: 27,
                        border: "none",
                        color: APP_CONFIG.mainCollors.primary,
                        backgroundColor: "transparent",
                        fontFamily: "Montserrat-Regular",
                      }}
                      decimalSeparator=","
                      thousandSeparator="."
                      prefix="R$ "
                      value={textRetirada ? "" : valorRetirada}
                      onChangeEvent={(event, maskedvalue, floatvalue) => {
                        setValorRetirada(floatvalue);
                      }}
                    />
                    <Box
                      style={{
                        marginTop: "30px",
                        marginBottom: "30px",
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: APP_CONFIG.mainCollors.secondary,
                          borderRadius: "27px",
                        }}
                        color="purple"
                        onClick={() => {
                          setModalRetirada(true);
                          setTextRetirada(false);
                        }}
                      >
                        <Typography
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: "16px",
                            color: "white",
                          }}
                        >
                          Transferir
                        </Typography>
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid item sm={5} xs={12}>
                  <Box
                    style={{
                      display: "flex",
                      backgroundColor: APP_CONFIG.mainCollors.primary,
                      /* height: '100px', */
                      borderRadius: "17px",
                      flexDirection: "column",

                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "16px",
                        color: "white",
                        marginTop: "30px",
                      }}
                    >
                      Entradas e saídas
                    </Typography>
                    <Box
                      style={{
                        width: "80%",
                        height: "1px",
                        backgroundColor: "white",
                      }}
                    />

                    <Box
                      style={{
                        marginTop: "140px",
                        marginBottom: "30px",
                      }}
                    >
                      {/* <CustomLineChart /> */}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            ) : null}

            <Grid container spacing={2}>
              {userType.isBanking ? (
                <Grid item sm={5} xs={12}>
                  <Box
                    style={{
                      display: "flex",
                      backgroundColor: APP_CONFIG.mainCollors.primary,

                      borderRadius: "17px",
                      flexDirection: "column",

                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "100%",
                        marginTop: "10px",
                      }}
                    >
                      <Box style={{ width: "20px" }} />

                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: "18px",
                            color: "white",
                            marginTop: "0px",
                          }}
                        >
                          Extrato
                        </Typography>

                        <Typography
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: "16px",
                            color: "white",
                            marginTop: "30px",
                          }}
                        >
                          Últimas movimentações
                        </Typography>

                        <Box
                          style={{
                            width: "80%",
                            height: "1px",
                            backgroundColor: "white",
                          }}
                        />
                      </Box>

                      <Button
                        style={{
                          borderRadius: "60px",
                          backgroundColor: "white",
                          minWidth: "20px",
                          height: "40px",
                          display: "flex",
                        }}
                        onClick={() => history.push("extrato")}
                      >
                        <Pages
                          style={{
                            color: APP_CONFIG.mainCollors.primary,
                            fontSize: "30px",
                          }}
                        />
                      </Button>
                    </Box>

                    <Box
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {extrato?.data?.length > 0
                        ? extrato?.data?.slice(0, 1)?.map((item, index) => (
                            <>
                              <Typography
                                style={{
                                  fontFamily: "Montserrat-Regular",
                                  fontSize: "16px",
                                  color: "white",
                                  marginTop: "30px",
                                  marginLeft: "30px",
                                }}
                              >
                                {moment.utc(item.data).format("DD MMMM (dddd)")}
                              </Typography>
                              <Box
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: "17px",
                                    backgroundColor:
                                      APP_CONFIG.mainCollors.extratoHome,
                                    alignSelf: "center",
                                    width: "90%",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {item?.items?.length > 0
                                    ? item.items.map((subItem, index) => (
                                        <>
                                          <Box
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              padding: "16px",
                                            }}
                                          >
                                            <Box
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                              }}
                                            >
                                              <Typography
                                                style={{
                                                  fontFamily:
                                                    "Montserrat-Regular",
                                                  fontSize: "16px",
                                                  color: "white",
                                                }}
                                              >
                                                {console.log(subItem)}
                                                {subItem?.transaction_details
                                                  ?.receiver_name
                                                  ? subItem?.transaction_details
                                                      ?.receiver_name
                                                  : (subItem?.conta
                                                      ?.razao_social ??
                                                    subItem?.conta?.nome)}
                                              </Typography>
                                              <Box>
                                                <Typography
                                                  style={{
                                                    fontFamily:
                                                      "Montserrat-Regular",
                                                    fontSize: "16px",
                                                    color: "white",
                                                  }}
                                                >
                                                  R${" "}
                                                  {parseFloat(
                                                    subItem.transaction_amount,
                                                  ).toLocaleString("pt-br", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                  })}
                                                </Typography>
                                              </Box>
                                            </Box>
                                          </Box>
                                        </>
                                      ))
                                    : null}
                                </Box>
                              </Box>
                            </>
                          ))
                        : null}
                    </Box>
                  </Box>
                </Grid>
              ) : null}

              {userData?.is_estabelecimento ? null : (
                <Grid item sm={7} xs={12}>
                  {listaBanner?.data?.length > 0 ? (
                    <Carousel
                      autoPlay
                      showThumbs={false}
                      showArrows={false}
                      showIndicators={true}
                      showStatus={false}
                      interval={4000}
                      infiniteLoop
                    >
                      {listaBanner.data.map((item) => (
                        <CardMedia
                          style={{
                            display: "flex",
                            backgroundColor: "transparent",
                            height: "300px",
                            borderRadius: "17px",
                            flexDirection: "column",

                            alignItems: "center",
                            "&:hover": {
                              cursor: "pointer",
                            },
                          }}
                          image={item.imagem}
                          onClick={() =>
                            item.url ? window.open(item.url) : null
                          }
                        />
                      ))}
                    </Carousel>
                  ) : (
                    <Box
                      style={{
                        display: "flex",
                        backgroundColor: "transparent",
                        borderRadius: "17px",
                        flexDirection: "column",

                        alignItems: "center",
                      }}
                    />
                  )}
                </Grid>
              )}

              <Grid container spacing={2}>
                {userType.isBanking ? (
                  <CustomCard
                    Icon={CompareArrows}
                    title={"Transferências"}
                    onClick={() => history.push("extratoP2P")}
                  />
                ) : null}

                {userData?.is_estabelecimento ? (
                  <CustomCard
                    Icon={CompareArrows}
                    title="Histórico de Transações"
                    onClick={() =>
                      history.push("beneficiarios/acao/transacoes")
                    }
                  />
                ) : null}

                {userData?.is_estabelecimento ? (
                  <CustomCard
                    Icon={Replay}
                    title="Pagamentos Futuros"
                    onClick={() => history.push("pagamentos-futuros")}
                  />
                ) : null}

                {userData?.is_estabelecimento ? (
                  <CustomCard
                    Icon={AttachMoneyOutlined}
                    title="Pagamentos Recebidos"
                    onClick={() => history.push("pagamentos-recebidos")}
                  />
                ) : null}

                {userType.isBanking ? (
                  <>
                    <CustomCard
                      Icon={Receipt}
                      title="Pagamentos"
                      onClick={() => history.push("lista-pagamentos")}
                    />

                    <CustomCard
                      Icon={Pix}
                      title="Pix"
                      onClick={() => history.push("pix")}
                    />

                    <CustomCard
                      icon="boletos"
                      title="Boletos"
                      onClick={() => history.push("lista-boletos")}
                    />
                  </>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Link
          href={APP_CONFIG.linkPdfTermoContrato}
          target="_blank"
          style={{ width: "fit-content" }}
        >
          <Typography
            style={{
              fontSize: "15px",
              color: APP_CONFIG.mainCollors.primary,
              marginTop: "24px",
              marginBottom: "8px",
            }}
          >
            Política de privacidade
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
