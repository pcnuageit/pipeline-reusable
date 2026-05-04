import {
  AppBar,
  Box,
  LinearProgress,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import SwipeableViews from "react-swipeable-views";
import {
  getFolhaDePagamentoAction,
  getFuncionarioAction,
  loadUserData,
} from "../../actions/actions";
import CustomCollapseTableEdit from "../../components/CustomCollapseTableEdit/CustomCollapseTableEdit";
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

    /* flexGrow: 1, */
    /* width: '100vw',
		height: '100vh', */
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
    /* alignItems: 'center', */
    /* justifyContent: 'center', */
    marginTop: "30px",
    marginLeft: "30px",
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
    /* [theme.breakpoints.down('sm')]: {
			width: '100%',
		}, */
  },
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",

    top: "10%",
    left: "35%",
    /* transform: 'translate(-50%, -50%)', */
    width: "30%",
    height: "80%",
    backgroundColor: "white",
    /* bgcolor: 'background.paper', */
    border: "0px solid #000",
    boxShadow: 24,
    /* p: 5, */
  },

  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primary,
      cursor: "pointer",
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

export default function ListaFolhaDePagamento() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const id = useParams()?.id ?? "";
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
  const debouncedId = useDebounce(filters.id, 800);
  const userData = useSelector((state) => state.userData);
  const listaFolhaDePagamento = useSelector((state) => state.folhaDePagamento);
  const listaFuncionarios = useSelector((state) => state.funcionarios);

  const [page, setPage] = useState(1);
  const [pageFuncionario, setPageFuncionario] = useState(1);
  const [value, setValue] = useState(0);

  moment.locale("pt-br");

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(getFolhaDePagamentoAction(token, page, id, filters.like));
  }, [token, page, id, filters.like]);

  useEffect(() => {
    dispatch(
      getFuncionarioAction(token, "", pageFuncionario, filters.like, "", "", id)
    );
  }, [token, pageFuncionario, id, filters.like]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };
  const handleChangePageFuncionario = (e, value) => {
    setPageFuncionario(value);
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
      headerText: "DATA",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
      },
    },
    { headerText: "DESCRIÇÃO", key: "descricao" },
    { headerText: "STATUS", key: "status_aprovado" },
    {
      headerText: "DATA DE PAGAMENTO",
      key: "data_pagamento",
      CustomValue: (data_pagamento) => {
        return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
      },
    },
  ];

  const itemColumns = [
    {
      headerText: "Nome",
      key: "conta.nome",
      CustomValue: (nome) => <Typography>{nome}</Typography>,
    },
    {
      headerText: "Agência",
      key: "conta.agencia",
      CustomValue: (documento) => <Typography>{documento}</Typography>,
    },
    {
      headerText: "Conta",
      key: "conta.conta",
      CustomValue: (conta) => <Typography>{conta}</Typography>,
    },
    {
      headerText: "Email",
      key: "conta.email",
      CustomValue: (email) => <Typography>{email}</Typography>,
    },
    {
      headerText: "CPF",
      key: "conta.documento",
      CustomValue: (documento) => (
        <Typography>{documentMask(documento)}</Typography>
      ),
    },
    {
      headerText: "Contato",
      key: "conta.celular",
      CustomValue: (celular) => (
        <Typography>{celular ? phoneMask(celular) : "*"}</Typography>
      ),
    },
    {
      headerText: "Tipo Pagamento",
      key: "tipo_pagamento",
      CustomValue: (tipo_pagamento) => (
        <Typography>{tipo_pagamento}</Typography>
      ),
    },
    {
      headerText: "Valor",
      key: "valor_pagamento",
      CustomValue: (valor) => {
        return (
          <>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        );
      },
    },
    {
      headerText: "Status Transação",
      key: "status",
      CustomValue: (status) => <Typography>{status}</Typography>,
    },
  ];

  const columnsFuncionarios = [
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
      },
    },
    { headerText: "NOME", key: "funcionario.nome" },
    {
      headerText: "CPF",
      key: "funcionario.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "AGÊNCIA, CONTA E DÍGITO",
      key: "conta.conta", //
      CustomValue: (conta) => {
        return (
          <>
            {"0001 / "}
            {conta}
          </>
        );
      },
    },
    {
      headerText: "GRUPO",
      key: "grupo.nome",
      CustomValue: (nome) => {
        return <>{nome ?? "Não Tem"}</>;
      },
    },
    { headerText: "", key: "menu" },
  ];

  const Editar = (row) => {
    return <Box></Box>;
  };
  const EditarFuncionario = (row) => {
    return <Box></Box>;
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <Box className={classes.dadosBox}>
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
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                alignItems: "center",
                borderRadius: "17px",
                flexDirection: "column",
                width: "90%",

                /* alignItems: 'center', */
              }}
            >
              <Box
                display="flex"
                alignSelf="start"
                alignContent="center"
                alignItems="center"
                style={{ margin: 30 }}
              >
                <TextField
                  placeholder="Pesquisar por descrição, status..."
                  size="small"
                  variant="outlined"
                  style={{
                    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                    width: "400px",
                  }}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({
                      ...filters,
                      like: e.target.value,
                    });
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
                    <AppBar
                      position="static"
                      color="default"
                      style={{
                        backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                        boxShadow: "none",
                        width: "100%",
                        marginLeft: "30px",
                        /* borderTopRightRadius: 27,
												borderTopLeftRadius: 27, */
                      }}
                    >
                      <Tabs
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                          width: "300px",
                          boxShadow: "none",
                        }}
                        value={value}
                        onChange={handleChange}
                        indicatorcolor={APP_CONFIG.mainCollors.primary}
                        //textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab
                          label="Folha de pagamento"
                          style={{
                            width: "200%",
                            borderBottom: getIndicatorColor(0),
                          }}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Funcionários"
                          style={{
                            width: "200%",
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
                        {listaFolhaDePagamento &&
                        listaFolhaDePagamento.to > 0 ? (
                          <>
                            <Box minWidth={!matches ? "800px" : null}>
                              <CustomCollapseTableEdit
                                columns={columns ? columns : null}
                                itemColumns={itemColumns}
                                data={listaFolhaDePagamento.data}
                                Editar={Editar}
                              />
                            </Box>
                            <Box alignSelf="flex-end" marginTop="8px">
                              <Pagination
                                variant="outlined"
                                color="secondary"
                                size="large"
                                count={listaFolhaDePagamento.last_page}
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
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        {listaFuncionarios && listaFuncionarios.to > 0 ? (
                          <>
                            <Box minWidth={!matches ? "800px" : null}>
                              <CustomTable
                                columns={columns ? columnsFuncionarios : null}
                                data={listaFuncionarios.data}
                                Editar={EditarFuncionario}
                              />
                            </Box>
                            <Box alignSelf="flex-end" marginTop="8px">
                              <Pagination
                                variant="outlined"
                                color="secondary"
                                size="large"
                                count={listaFuncionarios.last_page}
                                onChange={handleChangePageFuncionario}
                                page={pageFuncionario}
                              />
                            </Box>
                          </>
                        ) : (
                          <Box>
                            <LinearProgress color="secondary" />
                          </Box>
                        )}
                      </TabPanel>
                    </SwipeableViews>
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
