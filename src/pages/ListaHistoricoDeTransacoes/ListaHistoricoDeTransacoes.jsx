import { faTable, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loadHistoricoTransacaoFilter,
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
export default function ListaHistoricoDeTransacoes() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [data_liberacao, setData_liberacao] = useState("");
  const historico = useSelector((state) => state.historicoTransacao);
  const userData = useSelector((state) => state.userData);
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({
    day: " ",
    order: "",
    mostrar: "",
    status: " ",
    like: "",
    payment_type: " ",
    data_inicial: "",
    data_final: "",
    id: "",
    terminal_id: "",
    documento: "",
    vencimento_inicial: "",
    vencimento_final: "",
    pagamento_inicial: "",
    pagamento_final: "",
    seller_like: "",
    holder_name: "",
    is_physical_sale: " ",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const debouncedId = useDebounce(filters.id, 800);
  const debouncedTerminalId = useDebounce(filters.terminal_id, 800);
  const debouncedHolderName = useDebounce(filters.holder_name, 800);

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(
      loadHistoricoTransacaoFilter(
        token,
        page,
        filters.day,
        filters.order,
        filters.mostrar,
        filters.status,
        debouncedLike,
        filters.payment_type,
        filters.data_inicial,
        filters.data_final,
        debouncedId,
        filters.documento,
        filters.vencimento_inicial,
        filters.vencimento_final,
        filters.pagamento_inicial,
        filters.pagamento_final,
        userData.id,
      ),
    );
  }, [
    token,
    page,
    filters.day,
    filters.order,
    filters.mostrar,
    filters.status,
    debouncedLike,
    filters.payment_type,
    filters.data_incial,
    filters.data_final,
    debouncedId,
    filters.documento,
    filters.vencimento_inicial,
    filters.vencimento_final,
    filters.pagamento_inicial,
    filters.pagamento_final,
    userData.id,
  ]);

  useEffect(() => {
    return () => {
      dispatch(setHeaderLike(""));
    };
  }, []);

  const handleClickRow = (row) => {
    if (row.transaction.id) {
      const path = generatePath(
        "/dashboard/adquirencia/acao/maquina-virtual-cartao/:id",
        {
          id: row.transaction.id,
        },
      );
      history.push(path);
    }
  };

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
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (data_criacao) => {
        const date = new Date(data_criacao);
        const option = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        const formatted = date.toLocaleDateString("pt-br", option);
        return <Typography align="center">{formatted}</Typography>;
      },
    },
    {
      headerText: "Pagador",
      key: "pagador",
      CustomValue: (pagador) => (
        <Box display="flex" flexDirection="column">
          <Typography>{pagador ? pagador.nome : null}</Typography>
          <Typography>{pagador ? pagador.documento : null}</Typography>
        </Box>
      ),
    },
    {
      headerText: "Situação",
      key: "transaction.status",
      CustomValue: (status) => {
        if (status === "succeeded") {
          return (
            <Typography
              style={{
                color: "green",
                borderRadius: "27px",
              }}
            >
              SUCESSO
            </Typography>
          );
        }
        if (status === "failed") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              FALHADA
            </Typography>
          );
        }
        if (status === "canceled") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              CANCELADA
            </Typography>
          );
        }
        if (status === "pending") {
          return (
            <Typography
              style={{
                color: "#dfad06",
                borderRadius: "27px",
              }}
            >
              PENDENTE
            </Typography>
          );
        }
        if (status === "new") {
          return (
            <Typography
              style={{
                color: "green",
                borderRadius: "27px",
              }}
            >
              NOVO
            </Typography>
          );
        }
        if (status === "pre_authorized") {
          return (
            <Typography
              style={{
                color: "#dfad06",
                borderRadius: "27px",
              }}
            >
              PRÉ-AUTORIZADO
            </Typography>
          );
        }
        if (status === "reversed") {
          return (
            <Typography
              style={{
                color: "",
                borderRadius: "27px",
              }}
            >
              REVERTIDO
            </Typography>
          );
        }
        if (status === "refunded") {
          return (
            <Typography
              style={{
                color: "",
                borderRadius: "27px",
              }}
            >
              REEMBOLSADO
            </Typography>
          );
        }
        if (status === "dispute") {
          return (
            <Typography
              style={{
                color: "",
                borderRadius: "27px",
              }}
            >
              DISPUTA
            </Typography>
          );
        }
        if (status === "charged_back") {
          return (
            <Typography
              style={{
                color: "",
                borderRadius: "27px",
              }}
            >
              DEBITADO
            </Typography>
          );
        }
        if (status === "requested") {
          return (
            <Typography
              style={{
                color: "#dfad06",
                borderRadius: "27px",
              }}
            >
              CANC. SOLICITADO
            </Typography>
          );
        }
        if (status === "refused") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              CANC. RECUSADO POR STATUS
            </Typography>
          );
        }
        if (status === "rejected") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              CANC. REJEITADO
            </Typography>
          );
        }
        if (status === "error") {
          return (
            <Typography
              style={{
                color: "red",
                borderRadius: "27px",
              }}
            >
              ERRO CANCELAMENTO
            </Typography>
          );
        }
        if (status === "finished") {
          return (
            <Typography
              style={{
                color: "green",
                borderRadius: "27px",
              }}
            >
              CANC. FINALIZADO
            </Typography>
          );
        }
      },
    },
    {
      headerText: "Tipo",
      key: "transaction",
      CustomValue: (transaction) => {
        const type = transaction.payment_type;
        if (type === "credit") {
          const installments = transaction.installment_plan
            ? transaction.installment_plan.number_installments
            : 1;
          const flag = transaction.payment_method.card_brand;
          return (
            <Typography>
              Crédito {installments}x - {flag}
            </Typography>
          );
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
    {
      headerText: "Valor Bruto",
      key: "transaction.amount",
      CustomValue: (value) => <Typography>R${value}</Typography>,
    },
    {
      headerText: "Valor da taxa",
      key: "transaction.fees",
      CustomValue: (value) => <Typography>R${value}</Typography>,
    },

    {
      headerText: "Valor Líquido",
      key: "transaction",
      CustomValue: (transaction) => {
        const { fees, amount } = transaction;
        const valorLiquido = (amount - fees).toFixed(2);
        return <Typography>R${valorLiquido}</Typography>;
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
                    InputLabelProps={{ color: "grey" }}
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
        <CustomHeader pageTitle="Histórico de Transações" />

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
                style={{ marginTop: "10px", padding: "16px" }}
                display="flex"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Pagador"
                      value={filters.like}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          like: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="ID da transação ou conciliação"
                      value={filters.id}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          id: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      variant="outlined"
                      fullWidth
                      value={filters.day}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          day: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=" ">Período</MenuItem>
                      <MenuItem value={1}>Hoje</MenuItem>
                      <MenuItem value={7}>Últimos 7 dias</MenuItem>
                      <MenuItem value={15}>Últimos 15 dias</MenuItem>
                      <MenuItem value={30}>Últimos 30 dias</MenuItem>
                      <MenuItem value={60}>Últimos 60 dias</MenuItem>
                      <MenuItem value={90}>Últimos 90 dias</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      variant="outlined"
                      fullWidth
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=" ">Situação</MenuItem>
                      <MenuItem value="succeeded">Sucesso</MenuItem>
                      <MenuItem value="canceled">Cancelada</MenuItem>
                      <MenuItem value="failed">Falhada</MenuItem>
                      <MenuItem value="charged_back">Charged Back</MenuItem>
                      <MenuItem value="dispute">Em Disputa</MenuItem>
                      <MenuItem value="pending">Pendente</MenuItem>
                      <MenuItem value="pre_authorized">
                        Pré-autorização
                      </MenuItem>
                      <MenuItem value="reversed">Revertida</MenuItem>
                      <MenuItem value="new">Nova</MenuItem>
                      <MenuItem value="requested">
                        Boleto - Canc. Solicitado
                      </MenuItem>
                      <MenuItem value="refused">
                        Boleto - Canc. Recusado por status
                      </MenuItem>
                      <MenuItem value="rejected">
                        Boleto - Canc. Rejeitado
                      </MenuItem>
                      <MenuItem value="error">
                        Boleto - Erro Cancelamento
                      </MenuItem>
                      <MenuItem value="finished">
                        Boleto - Canc. Finalizado
                      </MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      variant="outlined"
                      fullWidth
                      value={filters.payment_type}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          payment_type: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=" ">Método</MenuItem>
                      <MenuItem value="debit">Débito</MenuItem>
                      <MenuItem value="credit">Crédito</MenuItem>
                      {/* <MenuItem value="boleto">Boleto</MenuItem> */}
                      <MenuItem value="commission">Comissão</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      variant="outlined"
                      fullWidth
                      value={filters.is_physical_sale}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          is_physical_sale: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=" ">Tipo de Venda</MenuItem>
                      <MenuItem value="1">CP - Captura Presencial</MenuItem>
                      <MenuItem value="0">
                        CNP - Captura Não Presencial
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
                      label="Data Inicial"
                      value={filters.data_inicial}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          data_inicial: e.target.value,
                        })
                      }
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
                      label="Data Final"
                      value={filters.data_final}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          data_final: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  {filters.payment_type === "boleto" ||
                  filters.payment_type === "credit" ||
                  filters.payment_type === "debit" ? null : (
                    <>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          variant="outlined"
                          InputLabelProps={{}}
                          fullWidth
                          label="ID do POS"
                          value={filters.terminal_id}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              terminal_id: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </>
                  )}

                  {filters.payment_type === "credit" ||
                  filters.payment_type === "debit" ? (
                    <>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          variant="outlined"
                          InputLabelProps={{}}
                          fullWidth
                          label="Portador do Cartão"
                          value={filters.holder_name}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              holder_name: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </>
                  ) : null}

                  {filters.payment_type === "boleto" ? (
                    <>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                            pattern: "d {4}- d {2}- d {2} ",
                          }}
                          type="date"
                          label="Vencimento Data Inicial"
                          value={filters.vencimento_inicial}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              vencimento_inicial: e.target.value,
                            })
                          }
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
                          label="Vencimento Data Final"
                          value={filters.vencimento_final}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              vencimento_final: e.target.value,
                            })
                          }
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
                          label="Pagamento Data Inicial"
                          value={filters.pagamento_inicial}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              pagamento_inicial: e.target.value,
                            })
                          }
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
                          label="Pagamento Data Final"
                          value={filters.pagamento_final}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              pagamento_final: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          variant="outlined"
                          InputLabelProps={{}}
                          fullWidth
                          label="N° Documento"
                          value={filters.documento}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              documento: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </>
                  ) : null}
                  <Grid item xs={12} sm={2}>
                    <Box display="flex">
                      <Tooltip title="Limpar Filtros">
                        <IconButton
                          onClick={() =>
                            setFilters({
                              ...filters,
                              id: "",
                              day: " ",
                              order: " ",
                              mostrar: " ",
                              status: " ",
                              like: "",
                              payment_type: " ",
                              data_inicial: "",
                              data_final: "",
                              documento: "",
                              vencimento_final: "",
                              vencimento_inicial: "",
                              terminal_id: "",
                              terminal_name: "",
                              holder_name: "",
                              is_physical_sale: "",
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
                          //onClick={handleExportarTransacao}
                        >
                          <FontAwesomeIcon icon={faTable} color="green" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
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
                    {historico.data && historico.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            handleClickRow={handleClickRow}
                            data={historico.data}
                            columns={columns}
                          />
                        </Box>
                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={historico.last_page}
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
