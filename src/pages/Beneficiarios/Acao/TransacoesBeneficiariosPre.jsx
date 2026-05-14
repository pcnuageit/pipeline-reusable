import {
  faFilePdf,
  faTable,
  faTrash,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import {
  getPagamentoContaExtratoAction,
  getPagamentoContaExtratoActionClear,
  getPagamentoPixExtratoAction,
  getPagamentoPixExtratoActionClear,
  getTransferenciaExtratoAction,
  getTransferenciaExtratoActionClear,
  loadExportExtrato,
  loadExtratoFilter,
  loadUserData,
} from "../../../actions/actions";
import CustomCollapseTable from "../../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import { getTransacoes } from "../../../services/beneficiarios";

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

    marginTop: "100px",
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
}));
export default function AccountStatement() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [metodosPix, setMetodosPix] = useState("extrato");
  const [filters, setFilters] = useState({
    id: "",
    day: " ",
    order: "",
    mostrar: "",
    tipo: "",
    data_inicial: "",
    data_final: "",
  });
  const debouncedId = useDebounce(filters.id, 800);
  //const userExtrato = useSelector((state) => state.extrato);
  const [extratoConcorrencia, setExtratoConcorrencia] = useState("");
  const headerLike = useSelector((state) => state.headerLike);
  const userData = useSelector((state) => state.userData);
  const exportExtrato = useSelector((state) => state.exportExtrato);
  const transferenciaExtrato = useSelector(
    (state) => state.transferenciaExtrato,
  );
  const tedExtrato = useSelector((state) => state.tedExtrato);
  const pagamentoContaExtrato = useSelector(
    (state) => state.pagamentoContaExtrato,
  );
  const pagamentoPixExtrato = useSelector((state) => state.pagamentoPixExtrato);
  const [page, setPage] = useState(1);
  const componentRef = useRef();

  const [extratoModal, setExtratoModal] = useState(false);
  const [semComprovante, setSemComprovante] = useState(false);
  const [operationType, setOperationType] = useState("");

  moment.locale();

  const columns = [
    {
      headerText: "Data da Transação",
      key: "data",
      CustomValue: (data) => {
        const p = data.split(/\D/g);
        const dataFormatada = [p[2], p[1], p[0]].join("/");
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <FontAwesomeIcon icon={faCalendarAlt} size="lg" /> */}
            <Typography style={{ marginLeft: "6px" }}>
              {moment.utc(data).format("DD MMMM")}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Beneficiário",
      key: "extratoable.nome",
      CustomValue: (nome) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography style={{ marginLeft: "6px" }}>{nome}</Typography>
          </Box>
        );
      },
    },

    // {
    // 	headerText: 'Valor Bloqueado',
    // 	key: 'valor_bloqueado',
    // 	CustomValue: (value) => (
    // 		<Box
    // 			style={{
    // 				display: 'flex',
    // 				flexDirection: 'row',
    // 				alignItems: 'center',
    // 				justifyContent: 'center',
    // 			}}
    // 		>
    // 			<FontAwesomeIcon icon={faBan} size="lg" />
    // 			<Typography style={{ marginLeft: '6px', color: 'red' }}>
    // 				R${' '}
    // 				{parseFloat(value).toLocaleString('pt-br', {
    // 					minimumFractionDigits: 2,
    // 					maximumFractionDigits: 2,
    // 				})}
    // 			</Typography>
    // 		</Box>
    // 	),
    // },

    {
      headerText: "Saldo do dia",
      key: "valor",
      CustomValue: (valor) => (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon icon={faWallet} style={{ fontSize: "17px" }} />
          <Typography style={{ marginLeft: "6px" }}>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
      ),
    },
  ];
  const itemColumns = [
    {
      headerText: "Descrição",
      key: "nmDescricao",
      CustomValue: (nmDescricao) => {
        return (
          <Typography variant="" style={{ fontSize: 16 }}>
            {nmDescricao}
          </Typography>
        );
      },
    },
    {
      headerText: <Typography variant="h6">Transação Id</Typography>,
      key: "idTransacao",
      CustomValue: (idTransacao) => {
        return (
          <Typography variant="" style={{ fontSize: 16 }}>
            {idTransacao ? idTransacao : null}
          </Typography>
        );
      },
    },
    {
      headerText: <Typography variant="h6">Data e hora</Typography>,
      key: "dtTransacao",
      CustomValue: (dtTransacao) => {
        return (
          <Typography variant="" style={{ fontSize: 16 }}>
            {dtTransacao ? dtTransacao : null}
          </Typography>
        );
      },
    },
    {
      headerText: <Typography variant="h6">NSU</Typography>,
      key: "nsu",
      CustomValue: (nsu) => {
        return (
          <Typography variant="" style={{ fontSize: 16 }}>
            {nsu}
          </Typography>
        );
      },
    },
    // {
    // 	headerText: <Typography variant="h6">Taxas</Typography>,
    // 	key: 'fee',
    // 	CustomValue: (fee) => {
    // 		if (fee > 0) {
    // 			return (
    // 				<Box style={{ display: 'flex' }}>
    // 					<Typography
    // 						variant=""
    // 						style={{
    // 							fontSize: 17,
    // 							fontWeight: 600,
    // 							color: 'red',
    // 							marginLeft: '6px',
    // 						}}
    // 					>
    // 						R$ 0,00{fee}
    // 					</Typography>
    // 				</Box>
    // 			);
    // 		} else {
    // 			return (
    // 				<Box style={{ display: 'flex' }}>
    // 					<Typography
    // 						variant=""
    // 						style={{
    // 							fontSize: 17,
    // 							fontWeight: 600,
    // 							color: 'green',
    // 							marginLeft: '6px',
    // 						}}
    // 					>
    // 						R$ 0,00 {fee}
    // 					</Typography>
    // 				</Box>
    // 			);
    // 		}
    // 	},
    // },
    {
      headerText: <Typography variant="h6">Valor Transação</Typography>,
      key: "vlTransacao",
      CustomValue: (vlTransacao) => {
        if (vlTransacao < 0) {
          return (
            <Box style={{ display: "flex" }}>
              <Typography
                variant=""
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "red",
                  marginLeft: "6px",
                }}
              >
                R${" "}
                {parseFloat(
                  vlTransacao == null ? 0 : vlTransacao,
                ).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          );
        } else {
          return (
            <Box style={{ display: "flex" }}>
              <Typography
                variant=""
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "green",
                  marginLeft: "6px",
                }}
              >
                R${" "}
                {parseFloat(
                  vlTransacao == null ? 0 : vlTransacao,
                ).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          );
        }
      },
    },
    {
      headerText: <Typography variant="h6">Valor Saldo</Typography>,
      key: "vlSaldo",
      CustomValue: (vlSaldo) => {
        if (vlSaldo < 0) {
          return (
            <Box style={{ display: "flex" }}>
              <Typography
                variant=""
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "red",
                  marginLeft: "6px",
                }}
              >
                R${" "}
                {parseFloat(vlSaldo == null ? 0 : vlSaldo).toLocaleString(
                  "pt-br",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </Typography>
            </Box>
          );
        } else {
          return (
            <Box style={{ display: "flex" }}>
              <Typography
                variant=""
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "green",
                  marginLeft: "6px",
                }}
              >
                R${" "}
                {parseFloat(vlSaldo == null ? 0 : vlSaldo).toLocaleString(
                  "pt-br",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </Typography>
            </Box>
          );
        }
      },
    },

    {
      headerText: "",
      key: "menuCollapse",
    },
  ];

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  const getData = async (page = 1, headerLike = "") => {
    setLoading(true);
    try {
      const res = await getTransacoes(token, page, headerLike);
      setExtratoConcorrencia(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page, headerLike);
  }, [token, page, headerLike]);

  useEffect(() => {
    dispatch(
      loadExtratoFilter(
        token,
        page,
        debouncedId,
        filters.day,
        filters.order,
        filters.mostrar,
        filters.tipo,
        userData.id,
        filters.data_inicial,
        filters.data_final,
      ),
    );
  }, [
    filters.day,
    filters.order,
    filters.mostrar,
    filters.tipo,
    page,
    debouncedId,
    userData.id,
    filters.data_inicial,
    filters.data_final,
  ]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  /* const handleClickRow = (row) => {
		if (row.transaction && row.transaction.id) {
			const path = generatePath('/dashboard/detalhes-transacao/:id/ver', {
				id: row.transaction.id,
			});
			history.push(path);
		} else {
			return null;
		}
	}; */

  const handleExportarExtrato = async () => {
    const res = await dispatch(
      loadExportExtrato(
        token,
        page,
        debouncedId,
        filters.day,
        filters.order,
        filters.mostrar,
        filters.tipo,
        userData.id,
        filters.data_inicial,
        filters.data_final,
      ),
    );
    if (res && res.url !== undefined) {
      window.open(`${res.url}`, "", "");
    }
  };

  const handleExportarExtratoPDF = async () => {
    const res = await dispatch(
      loadExportExtrato(
        token,
        page,
        debouncedId,
        filters.day,
        filters.order,
        filters.mostrar,
        filters.tipo,
        userData.id,
        filters.data_inicial,
        filters.data_final,
        "pdf",
      ),
    );
    if (res && res.url !== undefined) {
      window.open(`${res.url}`, "", "");
    }
  };

  useEffect(() => {
    return () => {
      setFilters({ ...filters });
    };
  }, []);

  const EditarCollapse = (row) => {
    const comprovanteExtrato = async () => {
      if (
        row.row.externalId &&
        (row.row.description === "Internal in out" ||
          row.row.description === "Payment boleto" ||
          row.row.description === "Refund out Pix" ||
          row.row.description === "Cashin Pix" ||
          row.row.description === "Cashout Pix")
      ) {
        if (row.row.description === "Internal in out") {
          await dispatch(getTransferenciaExtratoActionClear());
          const resTransferenciaExtrato = await dispatch(
            getTransferenciaExtratoAction(token, row.row.externalId),
          );
          if (resTransferenciaExtrato) {
            setSemComprovante(true);
          } else {
            setExtratoModal(true);
          }
        }
        /* if (row.row.description === 3 || row.row.description === 4) {
					await dispatch(getTedExtratoActionClear());
					const resTedExtrato = await dispatch(
						getTedExtratoAction(token, row.row.externalId)
					);
					if (resTedExtrato) {
						setSemComprovante(true);
					} else {
						setExtratoModal(true);
					}
				} */
        if (row.row.description === "Payment boleto") {
          await dispatch(getPagamentoContaExtratoActionClear());
          const resPagamentoContaExtrato = await dispatch(
            getPagamentoContaExtratoAction(token, row.row.externalId),
          );
          if (resPagamentoContaExtrato) {
            setSemComprovante(true);
          } else {
            setExtratoModal(true);
          }
        }
        if (
          row.row.description === "Cashin Pix" ||
          row.row.description === "Cashout Pix" ||
          row.row.description === "Refund out Pix"
        ) {
          await dispatch(getPagamentoPixExtratoActionClear());
          const resPagamentoPixExtrato = await dispatch(
            getPagamentoPixExtratoAction(token, row.row.externalId),
          );
          if (resPagamentoPixExtrato) {
            setSemComprovante(true);
          } else {
            setExtratoModal(true);
          }
        }
      } else {
        toast.error("Falha ao carregar extrato");
        setSemComprovante(true);
      }
    };
    return (
      <>
        {row.row.externalId && row.row.description && (
          <Button
            onClick={() => {
              comprovanteExtrato();
              setOperationType(row.row.description);
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
        )}
      </>
    );
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader pageTitle="Transações" />

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
                /* alignItems: 'center', */
                borderRadius: "17px",
                flexDirection: "column",
                width: "100%",

                /* alignItems: 'center', */
              }}
            >
              <Box
                style={{
                  width: "100%",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
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
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label="Filtrar por ID da transação"
                        fullWidth
                        value={filters.id}
                        onChange={(e) => {
                          setPage(1);
                          setFilters({
                            ...filters,
                            id: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Select
                        variant="outlined"
                        style={{
                          color: APP_CONFIG.mainCollors.secondary,
                        }}
                        fullWidth
                        value={filters.day}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            day: e.target.value,
                          })
                        }
                      >
                        <MenuItem
                          value=" "
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                          }}
                        >
                          Período
                        </MenuItem>
                        <MenuItem
                          value={1}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                          }}
                        >
                          Hoje
                        </MenuItem>
                        <MenuItem
                          value={7}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                          }}
                        >
                          Últimos 7 dias
                        </MenuItem>
                        <MenuItem
                          value={15}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                          }}
                        >
                          Últimos 15 dias
                        </MenuItem>
                        <MenuItem
                          value={30}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                          }}
                        >
                          Últimos 30 dias
                        </MenuItem>
                        <MenuItem
                          value={60}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                          }}
                        >
                          Últimos 60 dias
                        </MenuItem>
                        <MenuItem
                          value={90}
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                          }}
                        >
                          Últimos 90 dias
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                          pattern: "d {4}- d {2}- d {2} ",
                        }}
                        type="date"
                        label="Data inicial"
                        value={filters.data_inicial}
                        onChange={(e) => {
                          setPage(1);
                          setFilters({
                            ...filters,
                            data_inicial: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                          pattern: "d {4}- d {2}- d {2} ",
                        }}
                        type="date"
                        label="Data final"
                        value={filters.data_final}
                        onChange={(e) => {
                          setPage(1);
                          setFilters({
                            ...filters,
                            data_final: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Tooltip title="Limpar Filtros">
                        <IconButton
                          onClick={() =>
                            setFilters({
                              ...filters,
                              id: "",
                              day: " ",
                              order: "",
                              mostrar: "",
                              tipo: "",
                              data_inicial: "",
                              data_final: "",
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Exportar Excel">
                        <IconButton
                          variant="outlined"
                          style={{ marginLeft: "6px" }}
                          onClick={handleExportarExtrato}
                        >
                          <FontAwesomeIcon icon={faTable} color="green" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Exportar PDF">
                        <IconButton
                          variant="outlined"
                          style={{ marginLeft: "6px" }}
                          onClick={handleExportarExtratoPDF}
                        >
                          <FontAwesomeIcon icon={faFilePdf} color="red" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {extratoConcorrencia && extratoConcorrencia.per_page ? (
                <>
                  <Box /* minWidth={!matches ? '500px' : null} */>
                    <CustomCollapseTable
                      itemColumns={itemColumns}
                      data={extratoConcorrencia.data}
                      columns={columns}
                      EditarCollapse={EditarCollapse}
                      /* handleClickRow={handleClickRow} */
                    />
                  </Box>
                  <Box alignSelf="start" marginTop="8px">
                    {
                      <Pagination
                        variant="outlined"
                        color="secondary"
                        size="large"
                        count={extratoConcorrencia.last_page}
                        onChange={handleChangePage}
                        page={page}
                      />
                    }
                  </Box>
                </>
              ) : (
                <LinearProgress />
              )}
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
        {operationType === "Internal in out" &&
        transferenciaExtrato?.origem &&
        transferenciaExtrato?.destino ? (
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
        ) : operationType === "Payment boleto" &&
          pagamentoContaExtrato?.conta ? (
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
                  Boleto pago
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {moment
                    .utc(pagamentoContaExtrato.created_at)
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
                  {parseFloat(pagamentoContaExtrato.valor).toLocaleString(
                    "pt-br",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
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
                  Dados do boleto
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
                  Nome do pagador
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoContaExtrato.conta.nome}
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
                  Documento do pagador
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  ***
                  {pagamentoContaExtrato.conta.documento.substring(3, 6)}
                  {pagamentoContaExtrato.conta.documento.substring(6, 11)}
                  -**
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
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoContaExtrato.descricao}
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
                  ID
                </Typography>
                <Typography
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                    maxInlineSize: "min-content",
                  }}
                >
                  {pagamentoContaExtrato.id}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : operationType === "Cashin Pix" &&
          pagamentoPixExtrato.conta &&
          pagamentoPixExtrato.response?.pix_in ? (
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
                  {transferenciaExtrato.status === "Cancel"
                    ? "Comprovante de estorno"
                    : "Comprovante de transferência"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {moment
                    .utc(pagamentoPixExtrato.created_at)
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
                  {parseFloat(pagamentoPixExtrato.valor).toLocaleString(
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
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.tipo_pix}
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
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.descricao}
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
                  {pagamentoPixExtrato.conta.tipo === "Pessoa Jurídica"
                    ? "Razão Social"
                    : "Nome"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.conta.tipo === "Pessoa Jurídica"
                    ? pagamentoPixExtrato.conta.razao_social
                    : pagamentoPixExtrato.conta.nome}
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
                  Documento
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.conta.documento.length < 12 ||
                  pagamentoPixExtrato.conta.documento.includes("-") ? (
                    <>
                      ***
                      {pagamentoPixExtrato.conta.documento.substring(3, 6)}
                      {pagamentoPixExtrato.conta.documento.substring(6, 11)}
                      -**
                    </>
                  ) : (
                    pagamentoPixExtrato.conta.documento
                  )}
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
                  ISPB
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_in.PayerBankIspb}
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
                  Nome
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_in.PayeeName}
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
                  Documento
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_in.PayeeDocument.length <
                    12 ||
                  pagamentoPixExtrato.response.pix_in.PayeeDocument.includes(
                    "-",
                  ) ? (
                    <>
                      ***
                      {pagamentoPixExtrato.response.pix_in.PayeeDocument.substring(
                        3,
                        6,
                      )}
                      {pagamentoPixExtrato.response.pix_in.PayeeDocument.substring(
                        6,
                        11,
                      )}
                      -**
                    </>
                  ) : (
                    pagamentoPixExtrato.response.pix_in.PayeeDocument.substring(
                      0,
                      2,
                    ) +
                    "." +
                    pagamentoPixExtrato.response.pix_in.PayeeDocument.substring(
                      2,
                      5,
                    ) +
                    "." +
                    pagamentoPixExtrato.response.pix_in.PayeeDocument.substring(
                      5,
                      8,
                    ) +
                    "/" +
                    pagamentoPixExtrato.response.pix_in.PayeeDocument.substring(
                      8,
                      12,
                    ) +
                    "-" +
                    pagamentoPixExtrato.response.pix_in.PayeeDocument.substring(
                      12,
                      14,
                    )
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
                  ISPB
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_in.PayeeBankIspb}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : operationType === "Cashout Pix" &&
          pagamentoPixExtrato?.conta &&
          pagamentoPixExtrato?.response?.pix_out?.payee?.account ? (
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
                  {transferenciaExtrato.status === "Cancel"
                    ? "Comprovante de estorno"
                    : "Comprovante de transferência"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {moment
                    .utc(pagamentoPixExtrato.created_at)
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
                  {parseFloat(pagamentoPixExtrato.valor).toLocaleString(
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
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.tipo_pix}
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
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.descricao}
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
                  {pagamentoPixExtrato.conta.tipo === "Pessoa Jurídica"
                    ? "Razão Social"
                    : "Nome"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.conta.tipo === "Pessoa Jurídica"
                    ? pagamentoPixExtrato.conta.razao_social
                    : pagamentoPixExtrato.conta.nome}
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
                  Documento
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.conta.documento.length < 12 ||
                  pagamentoPixExtrato.conta.documento.includes("-") ? (
                    <>
                      ***
                      {pagamentoPixExtrato.conta.documento.substring(3, 6)}
                      {pagamentoPixExtrato.conta.documento.substring(6, 11)}
                      -**
                    </>
                  ) : (
                    pagamentoPixExtrato.conta.documento
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
                  ISPB
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_out.payer.account.ispb}
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
                  Nome
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_out.payee.name}
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
                  Documento
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_out.payee.document.length <
                    12 ||
                  pagamentoPixExtrato.response.pix_out.payee.document.includes(
                    "-",
                  ) ? (
                    <>
                      ***
                      {pagamentoPixExtrato.response.pix_out.payee.document.substring(
                        3,
                        6,
                      )}
                      {pagamentoPixExtrato.response.pix_out.payee.document.substring(
                        6,
                        11,
                      )}
                      -**
                    </>
                  ) : (
                    pagamentoPixExtrato.response.pix_out.payee.document.substring(
                      0,
                      2,
                    ) +
                    "." +
                    pagamentoPixExtrato.response.pix_out.payee.document.substring(
                      2,
                      5,
                    ) +
                    "." +
                    pagamentoPixExtrato.response.pix_out.payee.document.substring(
                      5,
                      8,
                    ) +
                    "/" +
                    pagamentoPixExtrato.response.pix_out.payee.document.substring(
                      8,
                      12,
                    ) +
                    "-" +
                    pagamentoPixExtrato.response.pix_out.payee.document.substring(
                      12,
                      14,
                    )
                  )}
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
                  ISPB
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_out.payee.account.ispb}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : operationType === "Refund out Pix" &&
          pagamentoPixExtrato?.conta &&
          pagamentoPixExtrato?.response?.pix_refund ? (
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
                  {transferenciaExtrato.status === "Cancel"
                    ? "Comprovante de estorno"
                    : "Comprovante de transferência"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {moment
                    .utc(pagamentoPixExtrato.created_at)
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
                  {parseFloat(pagamentoPixExtrato.valor).toLocaleString(
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
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.tipo_pix}
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
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.descricao}
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
                  Nome
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_refund.PayeeName}
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
                  Documento
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_refund.PayeeDocument
                    .length < 12 ||
                  pagamentoPixExtrato.response.pix_refund.PayeeDocument.includes(
                    "-",
                  ) ? (
                    <>
                      ***
                      {pagamentoPixExtrato.response.pix_refund.PayeeDocument.substring(
                        3,
                        6,
                      )}
                      {pagamentoPixExtrato.response.pix_refund.PayeeDocument.substring(
                        6,
                        11,
                      )}
                      -**
                    </>
                  ) : (
                    pagamentoPixExtrato.response.pix_refund.PayeeDocument.substring(
                      0,
                      2,
                    ) +
                    "." +
                    pagamentoPixExtrato.response.pix_refund.PayeeDocument.substring(
                      2,
                      5,
                    ) +
                    "." +
                    pagamentoPixExtrato.response.pix_refund.PayeeDocument.substring(
                      5,
                      8,
                    ) +
                    "/" +
                    pagamentoPixExtrato.response.pix_refund.PayeeDocument.substring(
                      8,
                      12,
                    ) +
                    "-" +
                    pagamentoPixExtrato.response.pix_refund.PayeeDocument.substring(
                      12,
                      14,
                    )
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
                  ISPB
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_refund.PayeeBankIspb}
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
                  {pagamentoPixExtrato.response.pix_refund.PayerDocumentType ===
                  "Cnpj"
                    ? "Razão Social"
                    : "Nome"}
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_refund.PayerName}
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
                  Documento
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_refund.PayerDocument
                    .length < 12 ||
                  pagamentoPixExtrato.response.pix_refund.PayerDocument.includes(
                    "-",
                  ) ? (
                    <>
                      ***
                      {pagamentoPixExtrato.response.pix_refund.PayerDocument.substring(
                        3,
                        6,
                      )}
                      {pagamentoPixExtrato.response.pix_refund.PayerDocument.substring(
                        6,
                        11,
                      )}
                      -**
                    </>
                  ) : (
                    pagamentoPixExtrato.response.pix_refund.PayerDocument.substring(
                      0,
                      2,
                    ) +
                    "." +
                    pagamentoPixExtrato.response.pix_refund.PayerDocument.substring(
                      2,
                      5,
                    ) +
                    "." +
                    pagamentoPixExtrato.response.pix_refund.PayerDocument.substring(
                      5,
                      8,
                    ) +
                    "/" +
                    pagamentoPixExtrato.response.pix_refund.PayerDocument.substring(
                      8,
                      12,
                    ) +
                    "-" +
                    pagamentoPixExtrato.response.pix_refund.PayerDocument.substring(
                      12,
                      14,
                    )
                  )}
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
                  ISPB
                </Typography>
                <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
                  {pagamentoPixExtrato.response.pix_refund.PayerBankIspb}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : null}
      </Dialog>
      <Dialog
        open={semComprovante}
        onClose={() => {
          setSemComprovante(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <Box style={{ padding: "15px" }}>
          <Typography style={{ color: APP_CONFIG.mainCollors.primary }}>
            Comprovante não disponível
          </Typography>
        </Box>

        <DialogActions>
          <Button
            onClick={() => {
              setSemComprovante(false);
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
