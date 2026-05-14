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
import SendIcon from "@mui/icons-material/Send";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import {
  getFolhaDePagamentoBeneAction,
  getFolhaDePagamentoShowAction,
  getTransferenciaExtratoAction,
  loadUserData,
  postEnviarComprovanteFolhaAction,
  setHeaderLike,
} from "../../actions/actions";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
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
  const listaFolhaDePagamento = useSelector(
    (state) => state.folhaDePagamentoBene,
  );
  const transferenciaExtrato = useSelector(
    (state) => state.transferenciaExtrato,
  );
  const [extratoModal, setExtratoModal] = useState(false);
  const headerLike = useSelector((state) => state.headerLike);
  const componentRef = useRef();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(getFolhaDePagamentoBeneAction(token, page, headerLike));
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

  const columns = [
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
      },
    },
    {
      headerText: "DESCRIÇÃO",
      key: "descricao",
    },
    { headerText: "STATUS", key: "status_aprovado" },
    {
      headerText: "DATA DE PAGAMENTO",
      key: "data_pagamento",
      CustomValue: (data_pagamento) => {
        return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
      },
    },
    {
      headerText: "Valor Total",
      key: "valor_total",
      CustomValue: (valor_total) => {
        return (
          <>
            R$
            {parseFloat(valor_total).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        );
      },
    },
    {
      headerText: "Sucesso",
      key: "status_sucesso",
    },
    {
      headerText: "Aguardando",
      key: "status_aguardando",
    },
    {
      headerText: "Falha",
      key: "status_falha",
    },
    // {
    //   headerText: "",
    //   key: "menu",
    // },
  ];

  const itemColumns = [
    {
      headerText: "Nome",
      key: "conta.nome",
      CustomValue: (nome) => (
        <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
      ),
    },
    // {
    //   headerText: "Agência",
    //   key: "conta.agencia",
    //   CustomValue: (documento) => (
    //     <Typography style={{ lineBreak: "anywhere" }}>{documento}</Typography>
    //   ),
    // },
    // {
    //   headerText: "Conta",
    //   key: "conta.conta",
    //   CustomValue: (celular) => (
    //     <Typography style={{ lineBreak: "anywhere" }}>{celular}</Typography>
    //   ),
    // },
    {
      headerText: "Email",
      key: "conta.email",
      CustomValue: (email) => (
        <Typography style={{ lineBreak: "anywhere" }}>{email}</Typography>
      ),
    },
    {
      headerText: "CNPJ",
      key: "conta.cnpj",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "Contato",
      key: "conta.celular",
      CustomValue: (celular) => (
        <Typography style={{ lineBreak: "anywhere" }}>
          {celular ? phoneMask(celular) : "*"}
        </Typography>
      ),
    },
    {
      headerText: "Valor",
      key: "valor_pagamento",
      CustomValue: (valor) => (
        <Typography style={{ lineBreak: "auto" }}>
          R$
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      ),
    },
    {
      headerText: "Tipo Pagamento",
      key: "tipo_pagamento",
      CustomValue: (tipo_pagamento) => (
        <Typography style={{ lineBreak: "loose" }}>{tipo_pagamento}</Typography>
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
      key: "menuCollapse",
    },
  ];

  const Editar = (row) => {
    const redirectPrintFolha = async () => {
      await dispatch(getFolhaDePagamentoShowAction(token, row.row.id));
      const path = generatePath("/dashboard/folha-de-pagamento/acao/print");
      history.push(path);
    };

    const enviarComprovanteFolha = async () => {
      setLoading(true);
      const resEnviarComprovante = await dispatch(
        postEnviarComprovanteFolhaAction(token, row.row.id),
      );
      if (resEnviarComprovante) {
        toast.error("Falha ao enviar comprovante");
        setLoading(false);
      } else {
        toast.success("Comprovante enviado!");
        setLoading(false);
      }
    };

    return (
      <Box style={{ display: "flex" }}>
        <Button onClick={() => redirectPrintFolha()}>
          <PrintIcon style={{ color: APP_CONFIG.mainCollors.primary }} />
        </Button>
        <Button onClick={() => enviarComprovanteFolha()}>
          <SendIcon style={{ color: APP_CONFIG.mainCollors.primary }} />
        </Button>
      </Box>
    );
  };

  const EditarCollapse = (row) => {
    const comprovanteFuncionario = async () => {
      if (row.row.response.DocumentNumber) {
        const resTransferenciaExtrato = await dispatch(
          getTransferenciaExtratoAction(token, row.row.response.DocumentNumber),
        );
        if (resTransferenciaExtrato) {
          toast.error("Erro ao carregar extrato");
        } else {
          setExtratoModal(true);
        }
      } else {
        toast.error("Falha ao carregar extrato");
      }
    };
    // return (
    // 	<Button
    // 		onClick={() => {
    // 			comprovanteFuncionario();
    // 		}}
    // 		variant="outlined"
    // 		color="primary"
    // 		style={{
    // 			fontFamily: 'Montserrat-Regular',
    // 			fontSize: '10px',
    // 			color: APP_CONFIG.mainCollors.primary,
    // 			borderRadius: 20,
    // 		}}
    // 	>
    // 		Visualizar
    // 	</Button>
    // );
    return <Box />;
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Pagamento de Estabelecimento"
          arquivosLote
          isSearchVisible={true}
          routeForGestao={"estabelecimento"}
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
                /* maxWidth: '90%', */
                minWidth: "100%",

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
                    {listaFolhaDePagamento.data &&
                    listaFolhaDePagamento.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomCollapseTable
                            compacta
                            columns={columns ? columns : null}
                            itemColumns={itemColumns}
                            data={listaFolhaDePagamento.data}
                            Editar={Editar}
                            EditarCollapse={EditarCollapse}
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
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        ref={componentRef}
        open={extratoModal}
        onClose={() => {
          setExtratoModal(false);
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
                  R$
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
