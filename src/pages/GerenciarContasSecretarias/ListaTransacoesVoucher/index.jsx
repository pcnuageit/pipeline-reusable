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
  getTransacoesVoucher,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";

import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import TableHeaderButton from "../../../components/TableHeaderButton";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";
import { phoneMask } from "../../../utils/phoneMask";

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
    headerText: "Data",
    key: "data",
    CustomValue: (data) => (
      <Typography>{moment.utc(data).format("DD MMMM")}</Typography>
    ),
  },
  {
    headerText: "Descrição",
    key: "folha.descricao",
  },
  {
    headerText: "Nome",
    key: "conta.user.nome",
    CustomValue: (nome) => <Typography>{nome}</Typography>,
  },
  {
    headerText: "CPF",
    key: "conta.user.documento",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
  {
    headerText: "Contato",
    key: "conta.user.celular",
    CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
  },
  {
    headerText: "Chave Pix",
    key: "conta.chave_pix",
  },
  {
    headerText: "Valor",
    key: "valor_pagamento",
    CustomValue: (valor) => (
      <Typography>
        R${" "}
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },
  {
    headerText: "Tipo de pagamento",
    key: "tipo_pagamento",
  },
  {
    headerText: "Status da transação",
    key: "status",
  },
  {
    headerText: "",
    key: "menu",
  },
];

export default function ListaTransacoesVoucher() {
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
    status: " ",
    descricao: "",
    mostrar: "15",
    // pagamento_aluguel_id
  });
  const debouncedFilter = useDebounce(filter, 800);
  const resetFilter = () => {
    setPage(1);
    setFilter({
      id: "",
      day: " ",
      data_inicial: "",
      data_final: "",
      user_id: "",
      status: " ",
      descricao: " ",
      mostrar: "15",
    });
  };

  const filters = `id=${filter.id}&day=${filter.day}&data_inicial=${filter.data_inicial}&data_final=${filter.data_final}&user_id=${filter.user_id}&status=${filter.status}&descricao=${filter.descricao}&mostrar=${filter.mostrar}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getTransacoesVoucher(token, page, filters);
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
            Transações Voucher
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
                  {hasPermission(PERMISSIONS.transacoes.voucher.list.view) && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <InputLabel id="periodo_label" shrink="true">
                          Período
                        </InputLabel>
                        <Select
                          labelId="periodo_label"
                          variant="outlined"
                          style={{
                            color: APP_CONFIG.mainCollors.secondary,
                          }}
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
                          label="Filtrar por ID do beneficiário"
                          fullWidth
                          value={filter.user_id}
                          onClick={() =>
                            setShowSelecionarBeneficiarioModal(true)
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          variant="outlined"
                          label="Filtrar por descrição"
                          fullWidth
                          value={filter.descricao}
                          onChange={(e) => {
                            setPage(1);
                            setFilter({
                              ...filter,
                              descricao: e.target.value,
                            });
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <InputLabel id="status_label" shrink="true">
                          Status
                        </InputLabel>
                        <Select
                          labelId="status_label"
                          variant="outlined"
                          fullWidth
                          required
                          value={filter.status}
                          onChange={(e) => {
                            setPage(1);
                            setFilter((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }));
                          }}
                        >
                          <MenuItem value={" "}>Todos</MenuItem>
                          <MenuItem value={"created"}>Aguardando</MenuItem>
                          <MenuItem value={"confirmed"}>Confirmado</MenuItem>
                          <MenuItem value={"pending"}>Pendente</MenuItem>
                          <MenuItem value={"succeeded"}>Aprovado</MenuItem>
                          <MenuItem value={"failed"}>Falha</MenuItem>
                          <MenuItem value={"rejected"}>Rejeitado</MenuItem>
                          <MenuItem value={"excluido"}>Excluído</MenuItem>
                          <MenuItem value={"ErrorBalance"}>Erro Saldo</MenuItem>
                          <MenuItem value={"Error"}>Erro</MenuItem>
                        </Select>
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
                      PERMISSIONS.transacoes.voucher.list.view,
                    ) && (
                      <TableHeaderButton
                        text="Limpar"
                        onClick={resetFilter}
                        color="red"
                      />
                    )}

                    {hasPermission(
                      PERMISSIONS.transacoes.voucher.actions.all,
                    ) && (
                      <ExportTableButtons
                        token={token}
                        path={"aluguel-conta"}
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
                    <CustomTable
                      data={extratoConcorrencia.data}
                      columns={columns}
                      Editar={({ row }) => (
                        <MenuOptionsTable
                          row={row}
                          getData={getData}
                          patchStatus={
                            row?.status === "Aprovado" ? null : "voucher"
                          }
                          JSONResponse={row?.response}
                        />
                      )}
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
