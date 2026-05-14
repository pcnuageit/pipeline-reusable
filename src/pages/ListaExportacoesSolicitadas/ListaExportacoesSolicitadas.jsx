import {
  AppBar,
  Box,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

import {
  getExportacoesSolicitadasAction,
  getExportDownloadAction,
  loadUserData,
  setHeaderLike,
} from "../../actions/actions";
import useAuth from "../../hooks/useAuth";

import {
  faCalendarAlt,
  faDownload,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";

import moment from "moment";

import CustomTable from "../../components/CustomTable/CustomTable";

import { APP_CONFIG } from "../../constants/config";

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

export default function ListaExportacoesSolicitadas() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [data_liberacao, setData_liberacao] = useState("");
  const exportacoesSolicitadas = useSelector(
    (state) => state.exportacoesSolicitadas,
  );
  const userData = useSelector((state) => state.userData);
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({
    order: "",
    mostrar: "",
    like: "",
    type: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(
      getExportacoesSolicitadasAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        filters.type,
        userData.id,
      ),
    );
  }, [
    token,
    page,
    filters.order,
    filters.mostrar,
    filters.status,
    debouncedLike,
    filters.type,
    userData.id,
  ]);

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

  const handleExportDownload = async (data) => {
    setLoading(true);
    const resExportDownload = await dispatch(
      getExportDownloadAction(token, data.conta_id, data.id),
    );
    if (resExportDownload) {
      toast.success("Arquivo baixado!");
      setLoading(false);
      window.open(resExportDownload, "_blank");
    } else {
      toast.error("Erro ao baixar arquivo");
      setLoading(false);
    }
  };
  /* 
	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []); */

  const typeMapper = {
    statement: "Extrato",
    transfer: "Transferência",
    transaction: "Transação",
  };

  const columns = [
    {
      headerText: "Tipo",
      key: "type",
      CustomValue: (value) => (
        <Box display="flex" justifyContent="center">
          <Typography style={{ textTransform: "capitalize" }}>
            {typeMapper[value]}
          </Typography>
        </Box>
      ),
    },
    {
      headerText: "Identificador da Exportação",
      key: "id",
    },
    {
      headerText: "Solicitado em",
      key: "created_at",
      CustomValue: (data) => {
        const dataFormatada = moment.utc(data).format("dd/MM/yyyy HH:mm:ss");
        return (
          <Box display="flex" justifyContent="center">
            <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
            <Typography style={{ marginLeft: "6px" }}>
              {dataFormatada}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Download",
      key: "",
      FullObject: (data) => (
        <Box display="flex" justifyContent="center">
          {data ? (
            <Link href="#" onClick={() => handleExportDownload(data)}>
              <FontAwesomeIcon icon={faDownload} size="lg" />
              <Typography style={{ marginLeft: "6px" }}>Download</Typography>
            </Link>
          ) : (
            <FontAwesomeIcon spin icon={faSpinner} size="lg" />
          )}
        </Box>
      ),
    },
  ];

  const Editar = (row) => {
    return <></>;
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Exportações Solicitadas" />

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
                  marginTop: "10px",
                  padding: "16px",
                  alignSelf: "baseline",
                }}
                display="flex"
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
                      width: "100%",
                      boxShadow: "none",
                    }}
                    value={value}
                    onChange={handleChange}
                    indicatorcolor={APP_CONFIG.mainCollors.primary}
                    //textColor="primary"
                    variant="fullWidth"
                  >
                    <Tab
                      onClick={() => setFilters({ ...filters, type: "" })}
                      label="Todos"
                      style={{
                        width: "100%",
                        borderBottom: getIndicatorColor(0),
                      }}
                      {...a11yProps(0)}
                    />

                    <Tab
                      onClick={() =>
                        setFilters({
                          ...filters,
                          type: "statement",
                        })
                      }
                      label="Extrato"
                      style={{
                        width: "100%",
                        borderBottom: getIndicatorColor(1),
                      }}
                      {...a11yProps(1)}
                    />
                    <Tab
                      onClick={() =>
                        setFilters({
                          ...filters,
                          type: "transfer",
                        })
                      }
                      label="Transferência"
                      style={{
                        width: "100%",
                        borderBottom: getIndicatorColor(2),
                      }}
                      {...a11yProps(2)}
                    />
                    <Tab
                      onClick={() =>
                        setFilters({
                          ...filters,
                          type: "transaction",
                        })
                      }
                      label="Transação"
                      style={{
                        width: "100%",
                        borderBottom: getIndicatorColor(3),
                      }}
                      {...a11yProps(3)}
                    />
                  </Tabs>
                </AppBar>
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
                    {exportacoesSolicitadas.data &&
                    exportacoesSolicitadas.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            data={exportacoesSolicitadas.data}
                            columns={columns}
                          />
                        </Box>
                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={exportacoesSolicitadas.last_page}
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
