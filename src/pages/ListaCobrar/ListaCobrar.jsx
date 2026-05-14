import {
  Box,
  Dialog,
  DialogTitle,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loadPagadoresFilter,
  loadPagadorId,
  loadUserData,
  postCapturaCobrancaAction,
  setHeaderLike,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

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
export default function ListaCobrar() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
    like: "",
    day: " ",
    order: "",
    mostrar: "",
    tipo: "",
  });
  const pagadoresList = useSelector((state) => state.pagadores);
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);
  const debouncedLike = useDebounce(filters.like, 800);
  const shrink = filters.like.length > 0;

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(
      loadPagadoresFilter(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        undefined,
      ),
    );
  }, [page, filters.order, filters.mostrar, debouncedLike]);

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
      headerText: "Nome",
      key: "nome",
    },
    {
      headerText: "Documento",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "E-mail", key: "email" },

    {
      headerText: "Contato",
      key: "celular",
      CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
    },

    {
      headerText: "Cobrar",
      key: "menu",
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

    const handleCobrar = async (row) => {
      const resLoadPagador = await dispatch(loadPagadorId(token, row.row.id));
      if (resLoadPagador) {
        toast.error("Erro ao carregar pagador");
      } else {
        const path = generatePath(
          "/dashboard/adquirencia/acao/cobrar/:subsectionId",
          {
            subsectionId: row.row.id,
          },
        );
        history.push(path);
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
            onClick={() => handleCobrar(row)}
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
        <CustomHeader pageTitle="Cobrar via Máquina virtual / Cartão" />

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
                <TextField
                  fullWidth
                  value={filters.like}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      like: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: shrink,
                    className: shrink ? undefined : classes.inputLabelNoShrink,
                  }}
                  variant="outlined"
                  label="Buscar por nome, documento..."
                  style={{ width: "100%" }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        style={{
                          fontSize: "30px",
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      />
                    ),
                  }}
                />
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
                  <Box
                    style={
                      value === 3
                        ? {
                            width: "100%",
                            borderTopRightRadius: 27,
                            borderTopLeftRadius: 27,
                          }
                        : {
                            width: "100%",
                            borderTopRightRadius: 27,
                            borderTopLeftRadius: 27,
                          }
                    }
                  >
                    {pagadoresList.data && pagadoresList.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns ? columns : null}
                            data={pagadoresList.data}
                            Editar={Editar}
                          />
                        </Box>
                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={pagadoresList.last_page}
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
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
