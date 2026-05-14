import {
  Box,
  Button,
  Dialog,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import {
  getFolhaDePagamentoFuncionarioAction,
  getTransferenciaExtratoAction,
  loadUserData,
  setHeaderLike,
} from "../../actions/actions";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";

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

export default function ListaConsultaPagamento() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
    day: " ",
    order: "",
    mostrar: "",
    tipo: "",
  });
  const debouncedId = useDebounce(filters.id, 800);
  const userData = useSelector((state) => state.userData);
  const headerLike = useSelector((state) => state.headerLike);
  const listaConsultaPagamento = useSelector(
    (state) => state.folhaDePagamentoFuncionario,
  );
  const transferenciaExtrato = useSelector(
    (state) => state.transferenciaExtrato,
  );
  const componentRef = useRef();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);
  const [comprovanteModal, setComprovanteModal] = useState(false);
  const [comprovanteData, setComprovanteData] = useState({});

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(getFolhaDePagamentoFuncionarioAction(token, page, headerLike));
  }, [token, page, headerLike]);

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

  const comprovanteConsulta = async (data) => {
    if (data && data.response && data.response.DocumentNumber) {
      const resTransferenciaExtrato = await dispatch(
        getTransferenciaExtratoAction(token, data.response.DocumentNumber),
      );
      if (resTransferenciaExtrato) {
        toast.error("Erro ao carregar comprovante");
      } else {
        setComprovanteModal(true);
      }
    } else {
      toast.error("Falha ao carregar comprovante");
    }
  };

  const columns = [
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
    // {
    // 	headerText: 'Email',
    // 	key: 'conta.email',
    // 	CustomValue: (email) => <Typography>{email}</Typography>,
    // },
    {
      headerText: "CPF",
      key: "conta.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
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
      CustomValue: (valor) => (
        <Typography>
          R$
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      ),
    },
    {
      headerText: "Nome da folha",
      key: "folha.descricao",
      CustomValue: (valor_pagamento) => (
        <Typography>{valor_pagamento}</Typography>
      ),
    },
    {
      headerText: "Status Transação",
      key: "status",
      CustomValue: (status) => (
        <Typography style={{ lineBreak: "loose" }}>{status}</Typography>
      ),
    },
    {
      headerText: "",
      key: "",
      FullObject: (data) => {
        return (
          <>
            <Button
              onClick={() => {
                comprovanteConsulta(data);
              }}
              variant="outlined"
              color="primary"
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "10px",
                color: APP_CONFIG.mainCollors.primary,
                borderRadius: 20,
              }}
            >
              Visualizar
            </Button>
          </>
        );
      },
    },
  ];

  const Editar = (row) => {
    return <Box></Box>;
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Consulta de Pagamento"
          isSearchVisible={true}
          routeForCreatePayroll
        />

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
                width: "100%",

                /* alignItems: 'center', */
              }}
            >
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
                    {listaConsultaPagamento.data &&
                    listaConsultaPagamento.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns ? columns : null}
                            data={listaConsultaPagamento.data}
                            Editar={Editar}
                          />
                        </Box>
                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={listaConsultaPagamento.last_page}
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
      <Dialog
        ref={componentRef}
        open={comprovanteModal}
        onClose={() => {
          setComprovanteModal(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        {transferenciaExtrato &&
        transferenciaExtrato.origem &&
        transferenciaExtrato.destino ? (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center",
              minWidth: "400px",
            }}
          >
            <Box style={{ marginTop: "30px", padding: "15px" }}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <img src={APP_CONFIG.assets.smallColoredLogo}></img>
                </Box>
                <ReactToPrint
                  trigger={() => {
                    return (
                      <Button>
                        <PrintIcon
                          style={{
                            color: APP_CONFIG.mainCollors.primary,
                          }}
                        />
                      </Button>
                    );
                  }}
                  content={() => componentRef.current}
                />
              </Box>
              <Box style={{ marginTop: "20px" }}>
                <Typography
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                    fontSize: "20px",
                  }}
                >
                  {transferenciaExtrato.status === "Falhou"
                    ? "Comprovante de estorno"
                    : "Comprovante de transferência"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {moment
                    .utc(transferenciaExtrato.created_at)
                    .format("DD/MM/YYYY")}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Valor
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  R${" "}
                  {parseFloat(transferenciaExtrato.valor).toLocaleString(
                    "pt-br",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Tipo de transferência
                </Typography>
                <Typography
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                    maxInlineSize: "min-content",
                  }}
                >
                  {transferenciaExtrato.tipo}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  ID da transação
                </Typography>
                <Typography
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                    maxInlineSize: "min-content",
                  }}
                >
                  {transferenciaExtrato.id}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Descrição
                </Typography>
                <Typography
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                    maxInlineSize: "min-content",
                  }}
                >
                  {transferenciaExtrato.descricao}
                </Typography>
              </Box>

              <Box className={classes.lineGrey} />
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  Destino
                </Typography>
              </Box>
              <Box className={classes.lineGrey} />
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Instituição
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {transferenciaExtrato.destino.banco} - FITBANK
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  {transferenciaExtrato.destino.tipo === "Pessoa Jurídica"
                    ? "Razão Social"
                    : "Nome"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {transferenciaExtrato.destino.tipo === "Pessoa Jurídica"
                    ? transferenciaExtrato.destino.razao_social
                    : transferenciaExtrato.destino.nome}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Agência
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {transferenciaExtrato.destino.agencia}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Conta
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {transferenciaExtrato.destino.conta}
                </Typography>
              </Box>
              <Box className={classes.lineGrey} />
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  Origem
                </Typography>
              </Box>
              <Box className={classes.lineGrey} />
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Instituição
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {transferenciaExtrato.origem.banco} - FITBANK
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  {transferenciaExtrato.origem.tipo === "Pessoa Jurídica"
                    ? "Razão Social"
                    : "Nome"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {transferenciaExtrato.origem.tipo === "Pessoa Jurídica"
                    ? transferenciaExtrato.origem.razao_social
                    : transferenciaExtrato.origem.nome}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Agência
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {transferenciaExtrato.origem.agencia}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                  marginBottom: "40px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Conta
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {transferenciaExtrato.origem.conta}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : null}
      </Dialog>
    </Box>
  );
}
