import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete, Refresh } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { loadUserData } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  getBeneficiarios,
  getTransacoes,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";

import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomCollapseTable from "../../../components/CustomCollapseTable/CustomCollapseTable";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import TableHeaderButton from "../../../components/TableHeaderButton";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";

moment.locale();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "25px",
    width: px2vw("100%"),
    "@media (max-width: 1440px)": {
      width: "950px",
    },
    "@media (max-width: 1280px)": {
      width: "850px",
    },
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const columns = [
  {
    headerText: "Data da Transação",
    key: "data",
    CustomValue: (data) => {
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
    key: "user.nome",
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
  {
    headerText: "Cartão",
    key: "extratoable.external_msk",
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
  {
    headerText: <Typography variant="h6">Valor Transação</Typography>,
    key: "vlTransacao",
    CustomValue: (vlTransacao) => {
      return (
        <Box style={{ display: "flex" }}>
          <Typography
            variant=""
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: vlTransacao < 0 ? "red" : "green",
              marginLeft: "6px",
            }}
          >
            R${" "}
            {parseFloat(vlTransacao ?? 0).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
      );
    },
  },
  {
    headerText: <Typography variant="h6">Valor Saldo</Typography>,
    key: "vlSaldo",
    CustomValue: (vlSaldo) => {
      return (
        <Box style={{ display: "flex" }}>
          <Typography
            variant=""
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: vlSaldo < 0 ? "red" : "green",
              marginLeft: "6px",
            }}
          >
            R${" "}
            {parseFloat(vlSaldo ?? 0).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
      );
    },
  },
];

export default function ListaTransacoesCartao() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const [extratoConcorrencia, setExtratoConcorrencia] = useState("");
  const [page, setPage] = useState(1);
  const [showSelecionarBeneficiarioModal, setShowSelecionarBeneficiarioModal] =
    useState(false);
  const [filter, setFilter] = useState({
    id: "",
    day: " ",
    data_inicial: "",
    data_final: "",
    user_id: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const resetFilter = () => {
    setFilter({
      id: "",
      day: " ",
      data_inicial: "",
      data_final: "",
      user_id: "",
      mostrar: "15",
    });
  };

  const filters = `id=${filter.id}&day=${filter.day}&data_inicial=${filter.data_inicial}&data_final=${filter.data_final}&user_id=${filter.user_id}&mostrar=${filter.mostrar}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getTransacoes(token, page, filters);
      setExtratoConcorrencia(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token, dispatch]);

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>
            Transações Cartão
          </Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <Refresh />
            </IconButton>
          </Box>
        </Box>

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
                borderRadius: "17px",
                flexDirection: "column",
                width: "100%",
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
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  {hasPermission(PERMISSIONS.transacoes.cartoes.list.view) && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <InputLabel id="periodo_label" shrink="true">
                          Período
                        </InputLabel>
                        <Select
                          labelId="periodo_label"
                          variant="outlined"
                          fullWidth
                          value={filter.day}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              day: e.target.value,
                            })
                          }
                        >
                          <MenuItem value=" ">Todos</MenuItem>
                          <MenuItem value={1}>Hoje</MenuItem>
                          <MenuItem value={7}>Últimos 7 dias</MenuItem>
                          <MenuItem value={15}>Últimos 15 dias</MenuItem>
                          <MenuItem value={30}>Últimos 30 dias</MenuItem>
                          <MenuItem value={60}>Últimos 60 dias</MenuItem>
                          <MenuItem value={90}>Últimos 90 dias</MenuItem>
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
                          value={filter.data_inicial}
                          onChange={(e) => {
                            setPage(1);
                            setFilter({
                              ...filter,
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
                          value={filter.data_final}
                          onChange={(e) => {
                            setPage(1);
                            setFilter({
                              ...filter,
                              data_final: e.target.value,
                            });
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label="Filtrar por ID do beneficiário"
                          fullWidth
                          value={filter.user_id}
                          onClick={() =>
                            setShowSelecionarBeneficiarioModal(true)
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <InputLabel id="mostrar_label" shrink="true">
                          Itens por página
                        </InputLabel>
                        <Select
                          labelId="mostrar_label"
                          value={filter.mostrar}
                          onChange={(e) => {
                            setPage(1);
                            setFilter({ ...filter, mostrar: e.target.value });
                          }}
                          variant="outlined"
                          fullWidth
                        >
                          <MenuItem value={"15"}>15</MenuItem>
                          <MenuItem value={"30"}>30</MenuItem>
                          <MenuItem value={"45"}>45</MenuItem>
                          <MenuItem value={"50"}>50</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  )}

                  <Grid container spacing={3}>
                    {hasPermission(
                      PERMISSIONS.transacoes.cartoes.list.view
                    ) && (
                      <TableHeaderButton
                        text="Limpar"
                        onClick={resetFilter}
                        color="red"
                      />
                    )}

                    {hasPermission(
                      PERMISSIONS.transacoes.cartoes.actions.all
                    ) && (
                      <ExportTableButtons
                        token={token}
                        path={"extrato"}
                        page={page}
                        filters={filters}
                      />
                    )}
                  </Grid>
                </Box>
              </Box>

              {extratoConcorrencia && extratoConcorrencia.per_page ? (
                <>
                  <Box>
                    <CustomCollapseTable
                      itemColumns={itemColumns}
                      data={extratoConcorrencia.data}
                      columns={columns}
                    />
                  </Box>
                  <Box alignSelf="start" marginTop="8px">
                    {
                      <Pagination
                        variant="outlined"
                        color="secondary"
                        size="large"
                        count={extratoConcorrencia.last_page}
                        onChange={(e, value) => setPage(value)}
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

      <SelecionarBeneficiarioModal
        show={showSelecionarBeneficiarioModal}
        setShow={setShowSelecionarBeneficiarioModal}
        callback={(id) => {
          setPage(1);
          setFilter({
            ...filter,
            user_id: id,
          });
        }}
      />
    </Box>
  );
}

function SelecionarBeneficiarioModal({
  show = false,
  setShow = () => false,
  callback = () => null,
}) {
  const token = useAuth();
  const [listaBeneficiarios, setListaBeneficiarios] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
  });
  const debouncedFilter = useDebounce(filter, 800);

  const resetFilter = () => {
    setFilter({
      nome: "",
      documento: "",
    });
  };

  const filters = `nome=${filter.nome}&documento=${filter.documento}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getBeneficiarios(token, "", page, filters);
      setListaBeneficiarios(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShow(false);

  useEffect(() => {
    if (show) {
      getData(page);
    }
  }, [token, show, page, debouncedFilter]);

  const columns = [
    { headerText: "NOME", key: "nome" },
    {
      headerText: "DOCUMENTO",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
  ];

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"lg"}
      minWidth={"lg"}
      width={"lg"}
      scroll={"paper"}
    >
      <LoadingScreen isLoading={loading} />

      <DialogContent style={{ paddingBottom: 40, minWidth: "60%" }}>
        <Grid container spacing={4}>
          <Box>
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
                  borderRadius: "17px",
                  flexDirection: "column",
                  width: "100%",
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
                  <Box style={{ margin: 30 }}>
                    <Grid
                      container
                      spacing={4}
                      style={{ alignItems: "center", marginBottom: "8px" }}
                    >
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Pesquisar por nome"
                          value={filter.nome}
                          onChange={(e) => {
                            setPage(1);
                            setFilter((prev) => ({
                              ...prev,
                              nome: e.target.value,
                            }));
                          }}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Pesquisar por documento"
                          value={filter.documento}
                          onChange={(e) => {
                            setPage(1);
                            setFilter((prev) => ({
                              ...prev,
                              documento: e.target.value,
                            }));
                          }}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                          }}
                        >
                          <CustomButton color="red" onClick={resetFilter}>
                            <Box display="flex" alignItems="center">
                              <Delete />
                              Limpar
                            </Box>
                          </CustomButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {listaBeneficiarios && listaBeneficiarios.per_page ? (
                  <>
                    <Box>
                      <CustomTable
                        columns={columns}
                        data={listaBeneficiarios.data}
                        handleClickRow={(row) => {
                          handleClose();
                          callback(row.id);
                        }}
                      />
                    </Box>
                    <Box alignSelf="start" marginTop="8px">
                      {
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={listaBeneficiarios.last_page}
                          onChange={(e, value) => setPage(value)}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
