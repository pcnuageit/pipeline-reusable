import DateFnsUtils from "@date-io/date-fns";
import {
  faCalendarAlt,
  faCopy,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import { format } from "date-fns";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loadLancamentosFuturos,
  loadUserData,
  postCapturaCobrancaAction,
  setHeaderLike,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import FullTransactionSummary from "../../components/FullTransactionSummary/FullTransactionSummary";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

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
    marginTop: "30px",
    marginLeft: "0px",
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
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    boxShadow: "none",
    borderRadius: "0px",
    alignSelf: "center",
    modal: {
      outline: " none",
      display: "flex",
      flexDirection: "column",
      alignSelf: "center",
      position: "absolute",
      top: "10%",
      left: "35%",
      width: "30%",
      height: "80%",
      backgroundColor: "white",
      border: "0px solid #000",
      boxShadow: 24,
    },

    closeModalButton: {
      alignSelf: "end",
      padding: "5px",
      "&:hover": {
        backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
        cursor: "pointer",
      },
    },
    inputLabelNoShrink: {
      transform: "translate(45px, 15px) scale(1)",
    },
    currencyInput: {
      marginBottom: "6px",

      alignSelf: "center",
      textAlign: "center",
      height: 45,
      fontSize: 17,
      borderWidth: "0px !important",
      borderRadius: 27,

      color: APP_CONFIG.mainCollors.primary,
      backgroundColor: "transparent",
      fontFamily: "Montserrat-Regular",
    },
  },
}));
export default function ListaLancamentosFuturos() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [data_liberacao, setData_liberacao] = useState("");
  const userLancamentosFuturos = useSelector(
    (state) => state.lancamentosFuturos,
  );
  const [filters, setFilters] = useState({
    data_liberacao_inicial: "",
    data_liberacao_final: "",
    esperado_em: new Date(),
  });

  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);
  const [lancamentosFuturos, setLancamentosFuturos] = useState(true);
  const formatedDate = useMemo(
    () => format(filters.esperado_em, "yyyy-MM-dd"),
    [filters.esperado_em],
  );
  const [openReleaseDetails, setOpenReleaseDetails] = useState(false);
  const [dateOnCalendar, setDateOnCalendar] = useState(new Date());

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(
      loadLancamentosFuturos(
        token,
        page,
        filters.data_liberacao_inicial,
        filters.data_liberacao_final,
      ),
    );
  }, [page, filters, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setHeaderLike(""));
    };
  }, []);

  const handleChangePage = (e, value) => {
    setPage(value);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const getIndicatorColor = (index) =>
    index === value ? `2px solid ${APP_CONFIG.mainCollors.primary}` : null;

  /* 
	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []); */

  const columns = [
    {
      headerText: "Data de Liberação",
      key: "data_liberacao",
      CustomValue: (data_liberacao) => {
        const date = new Date(data_liberacao);
        const option = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };
        const formatted = date.toLocaleDateString("pt-br", option);
        return (
          <Box display="flex" justifyContent="center">
            <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
            <Typography style={{ marginLeft: "6px" }}>{formatted}</Typography>
          </Box>
        );
      },
    },
    {},
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <Typography
            variant=""
            style={{ fontSize: 17, color: "green", fontWeight: "bold" }}
          >
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      },
    },
  ];

  const itemColumns = [
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (data) => {
        const date = new Date(data);
        const option = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };
        const formatted = date.toLocaleDateString("pt-br", option);
        return (
          <Box display="flex">
            <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
            <Typography style={{ marginLeft: "6px" }}>{formatted}</Typography>
          </Box>
        );
      },
    },
    {
      headerText: "ID da transação",
      key: "id",
      CustomValue: (id) => {
        return (
          <Box display="flex" alignItems="center">
            <TextField id value={id} />
            <Tooltip title="Copiar">
              <CopyToClipboard text={id}>
                <Button
                  aria="Copiar"
                  style={{
                    marginLeft: "6px",
                    width: "60px",
                    height: "20px",
                    alignSelf: "center",
                    color: "green",
                  }}
                  onClick={() =>
                    toast.success("Link copiado com sucesso", {
                      autoClose: 2000,
                    })
                  }
                >
                  <FontAwesomeIcon
                    style={{ width: "60px", height: "20px" }}
                    icon={faCopy}
                  />
                </Button>
              </CopyToClipboard>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      headerText: "Tipo",
      key: "payment_type",
      CustomValue: (type) => {
        if (type === "credit") {
          return <Typography>Crédito</Typography>;
        }
        if (type === "debit") {
          return <Typography>Débito</Typography>;
        }
        if (type === "boleto") {
          return <Typography>Boleto</Typography>;
        }
        if (type === "commission") {
          return <Typography>Comissão</Typography>;
        }
      },
    },
  ];

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalCapturar, setModalCapturar] = useState(false);
    const [captura, setCaptura] = useState("");

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleCaptura = async () => {
      setLoading(true);
      if (row.row.status === "Pago") {
        toast.error("Cobrança já capturada");
        setLoading(false);
        setModalCapturar(false);
      } else {
        const resCaptura = await dispatch(
          postCapturaCobrancaAction(row.row.id, captura.valor),
        );
        if (resCaptura) {
          toast.error("Erro ao capturar");
          setLoading(false);
          setModalCapturar(false);
        } else {
          toast.success("Captura realizada com sucesso!");
          setLoading(false);
          setModalCapturar(false);
        }
      }
    };

    return (
      <>
        <Box
          onClick={handleClick}
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            height: "50px",
            width: "50px",
            cursor: "pointer",
            borderRadius: "32px",
            alignItems: "center",
            justifyContent: "center",

            "&:hover": {
              cursor: "pointer",
              backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
            },
          }}
        >
          <SettingsIcon
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontSize: "30px",
              "&:hover": {
                backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
              },
            }}
          />
        </Box>
        <Menu
          onClick={() => {}}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
            /* onClick={() => setIsModalConfirmarPropriedadeOpen(true)} */
          >
            Cobrar
          </MenuItem>
        </Menu>
        <>
          <LoadingScreen isLoading={loading} />
          <Dialog
            onClose={() => setModalCapturar(false)}
            open={modalCapturar}
            onBackdropClick={() => setModalCapturar(false)}
          >
            <Box width="500px">
              <DialogTitle>
                <Typography
                  align="center"
                  variant="h6"
                  style={{ color: APP_CONFIG.mainCollors.primary }}
                >
                  Realizar Captura
                </Typography>
              </DialogTitle>
              <Box display="flex" flexDirection="column" padding="24px">
                <Box display="flex" flexDirection="column">
                  <TextField
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true, color: "grey" }}
                    label="Valor da cobrança"
                    value={"R$ " + row.row.valor}
                    style={{
                      marginBottom: "6px",
                      width: "60%",
                      alignSelf: "center",
                      color: "grey",
                    }}
                  />

                  <Typography
                    style={{
                      alignSelf: "center",
                      color: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    Valor da Captura
                  </Typography>
                  <CurrencyInput
                    label="Valor Mensal"
                    placeHolder="R$0,00"
                    className={classes.currencyInput}
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    value={captura.valor}
                    onChangeEvent={(event, maskedvalue, floatvalue) =>
                      setCaptura({
                        ...captura,
                        valor: floatvalue,
                      })
                    }
                  />

                  {/* <CurrencyInput
										variant="outlined"
										className={classes.currency}
										decimalSeparator=","
										thousandSeparator="."
										prefix="R$ "
										value={captura.valor}
										onChangeEvent={(event, maskedvalue, floatvalue) =>
											setCaptura({
												...captura,
												valor: floatvalue,
											})
										}
										style={{
											marginBottom: '6px',
											width: '60%',
											alignSelf: 'center',
										}}
									/> */}

                  <Box alignSelf="center" marginTop="6px">
                    <CustomButton
                      color="purple"
                      onClick={() => handleCaptura()}
                    >
                      <Typography>Capturar</Typography>
                    </CustomButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Dialog>
        </>
      </>
    );
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Lançamentos Futuros" />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                alignItems: "center",
                borderRadius: "17px",
                flexDirection: "column",
                /* maxWidth: '90%', */
                minWidth: "100%",

                /* alignItems: 'center', */
              }}
            >
              <Box
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "30px",
                }}
              >
                <Box style={{ display: "flex" }}>
                  {lancamentosFuturos ? (
                    <>
                      <TextField
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                          pattern: "d {4}- d {2}- d {2} ",
                        }}
                        type="date"
                        label="Data inicial"
                        value={filters.data_liberacao_inicial}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            data_liberacao_inicial: e.target.value,
                          })
                        }
                      />
                      <Box style={{ marginLeft: "10px" }}>
                        <TextField
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                            pattern: "d {4}- d {2}- d {2} ",
                          }}
                          type="date"
                          label="Data final"
                          value={filters.data_liberacao_final}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              data_liberacao_final: e.target.value,
                            })
                          }
                        />
                      </Box>
                    </>
                  ) : (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        views={["month", "year"]}
                        format="MM/yyyy"
                        label="Data de Liberação"
                        value={filters.esperado_em}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            esperado_em: e,
                          })
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  )}

                  <Box style={{ marginLeft: "10px" }}>
                    <Tooltip title="Limpar Filtros">
                      <IconButton
                        onClick={() =>
                          setFilters({
                            ...filters,
                            data_liberacao_inicial: "",
                            data_liberacao_final: "",
                            esperado_em: new Date(),
                          })
                        }
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{
                            color: APP_CONFIG.mainCollors.primary,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box style={{ display: "flex" }}>
                  <CustomButton
                    disabled={lancamentosFuturos === false}
                    color="purple"
                    onClick={() => {
                      setLancamentosFuturos(false);
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Agenda Recebíveis
                    </Typography>
                  </CustomButton>
                  <Box style={{ marginLeft: "10px" }}>
                    <CustomButton
                      disabled={lancamentosFuturos}
                      color="purple"
                      onClick={() => {
                        setLancamentosFuturos(true);
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "Montserrat-Regular",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        Lançamentos Futuros
                      </Typography>
                    </CustomButton>
                  </Box>
                </Box>
              </Box>
              <Box
                style={{
                  width: "100%",

                  borderRadius: 27,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box
                  display="flex"
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  {lancamentosFuturos ? (
                    <Box
                      style={{
                        width: "100%",
                        borderTopRightRadius: 27,
                        borderTopLeftRadius: 27,
                      }}
                    >
                      {userLancamentosFuturos.data &&
                      userLancamentosFuturos.per_page ? (
                        <>
                          <Box minWidth={!matches ? "800px" : null}>
                            <CustomCollapseTable
                              itemColumns={itemColumns}
                              data={userLancamentosFuturos.data}
                              columns={columns}
                            />
                          </Box>
                          <Box alignSelf="flex-end" marginTop="8px">
                            <Pagination
                              variant="outlined"
                              color="secondary"
                              size="large"
                              count={userLancamentosFuturos.last_page}
                              onChange={handleChangePage}
                              page={page}
                            />
                          </Box>
                        </>
                      ) : (
                        <Box>
                          <LinearProgress color="secondary" />
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        borderTopRightRadius: 27,
                        borderTopLeftRadius: 27,
                      }}
                    >
                      <FullTransactionSummary date={formatedDate} />
                      <CustomCalendar
                        date={formatedDate}
                        modalVisible={openReleaseDetails}
                        handleModalVisible={setOpenReleaseDetails}
                        handleSelectedCalendarDate={setDateOnCalendar}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
