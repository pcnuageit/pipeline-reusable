import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  LinearProgress,
  TableContainer,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { loadUserData } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  deletePagamentosVoucherLote,
  getAutorizarPagamentosVoucher,
  postAutorizarPagamentosVoucher,
} from "../../../services/beneficiarios";
import { errorMessageHelper } from "../../../utils/errorMessageHelper";
import px2vw from "../../../utils/px2vw";

import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import { ModalManager } from "../../../components/ModalManager";
import TableFloatingActionButtons from "../../../components/TableFloatingActionButtons";
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

export default function ListaFolhaDePagamentoAutorizar({
  tipo_beneficio_id = "",
}) {
  const id = useParams()?.id ?? tipo_beneficio_id;
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const { hasPermission, PERMISSIONS } = usePermission();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    created_at: "",
    nome: "",
    chave_pix: "",
    documento: "",
    celular: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [aprovarTodos, setAprovarTodos] = useState(0);
  const [showAprovarModal, setShowAprovarModal] = useState(false);
  const [approvePayment, setApprovePayment] = useState(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token, dispatch]);

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      created_at: "",
      nome: "",
      chave_pix: "",
      documento: "",
      celular: "",
    });
  };

  const filters = `conta_id=${id}&created_at=${filter.created_at}&nome=${filter.nome}&chave_pix=${filter.chave_pix}&documento=${filter.documento}&celular=${filter.celular}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAutorizarPagamentosVoucher(
        token,
        id,
        page,
        "",
        filters,
      );
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const selected = listaContas?.data?.map((obj) => obj?.id);
    setRegistros(selected);
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    resetFilters();
  }, [id]);

  const handleAprovarPagamento = async (dataToken) => {
    setLoading(true);
    try {
      await postAutorizarPagamentosVoucher(
        token,
        id,
        dataToken,
        registros,
        aprovarTodos,
        approvePayment,
        filters,
      );

      toast.success("Pagamentos aprovados");
      setRegistros([]);
      await getData(token, 1, "");
    } catch (err) {
      console.log(err);
      toast.error(errorMessageHelper(err));
    } finally {
      setShowAprovarModal(false);
      setLoading(false);
    }
  };

  const handleDeleteRow = async (id) => {
    setLoading(true);
    try {
      await deletePagamentosVoucherLote(token, id);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const columns = [
    {
      headerText: "",
      key: "id",
      CustomValue: (id) => {
        return (
          <>
            <Box>
              <Checkbox
                color="primary"
                checked={registros.includes(id)}
                onChange={() => {
                  if (registros.includes(id)) {
                    setRegistros(registros.filter((item) => item !== id));
                  } else {
                    setRegistros([...registros, id]);
                  }
                }}
              />
            </Box>
          </>
        );
      },
    },
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
      },
    },
    {
      headerText: "Nome",
      key: "conta.user.nome",
      CustomValue: (nome) => (
        <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
      ),
    },
    {
      headerText: "Chave Pix",
      key: "conta.chave_pix",
      CustomValue: (email) => (
        <Typography style={{ lineBreak: "anywhere" }}>{email}</Typography>
      ),
    },
    {
      headerText: "CPF",
      key: "conta.user.documento",
      CustomValue: (documento) => (
        <Typography style={{ lineBreak: "anywhere" }}>
          {documentMask(documento)}
        </Typography>
      ),
    },
    {
      headerText: "Contato",
      key: "conta.user.celular",
      CustomValue: (celular) => (
        <Typography style={{ lineBreak: "anywhere" }}>
          {celular ? phoneMask(celular) : "*"}
        </Typography>
      ),
    },
    // {
    //   headerText: "Tipo Pagamento",
    //   key: "conta.documento",
    //   CustomValue: (tipo_pagamento) => (
    //     <Typography style={{ lineBreak: "loose" }}>{"Benefício"}</Typography>
    //   ),
    // },
    {
      headerText: "Valor",
      key: "valor_pagamento",
      CustomValue: (valor) => (
        <Typography style={{ lineBreak: "loose" }}>
          R$
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      ),
    },
    {
      headerText: "Status Transação",
      key: "status",
      CustomValue: (status) => (
        <Typography style={{ lineBreak: "loose" }}>
          {status === "Pedente" ? "Pendente" : status}
        </Typography>
      ),
    },
    { headerText: "", key: "menu" },
  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>
            Aprovar pagamentos - Vouchers
          </Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            <Grid
              container
              spacing={3}
              style={{ alignItems: "center", marginBottom: "8px" }}
            >
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pesquisar por data"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  value={filter.created_at}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      created_at: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por contato"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.celular}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      celular: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por nome"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.nome}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      nome: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por chave Pix"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.chave_pix}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      chave_pix: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por documento"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.documento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      documento: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <TableHeaderButton
                text="Limpar"
                color="red"
                onClick={resetFilters}
              />

              <TableHeaderButton
                text="Selecionar página"
                onClick={handleSelectAll}
                Icon={Check}
              />

              {!tipo_beneficio_id && (
                <TableHeaderButton
                  text="Aprovar Selecionados"
                  onClick={() => {
                    setAprovarTodos(false);
                    setShowAprovarModal(true);
                  }}
                  Icon={Check}
                />
              )}

              <TableHeaderButton
                text="Aprovar todos (Filtro)"
                onClick={() => {
                  setAprovarTodos(true);
                  setShowAprovarModal(true);
                }}
              />

              <ExportTableButtons
                token={token}
                path={"pagamento-aluguel"}
                page={page}
                filters={filters + "&status=default"}
                hasPermission={hasPermission(
                  PERMISSIONS.secretarias.autorizar_pagamento_voucher.export,
                )}
              />
            </Grid>
          </Box>

          <Typography
            className={classes.pageTitle}
            style={{
              marginLeft: "30px",
              paddingBottom: "16px",
              marginBottom: "1px",
            }}
          >
            CONTAS RECENTES
          </Typography>
        </Box>

        <Box className={classes.tableContainer}>
          {!loading && listaContas?.data && listaContas?.per_page ? (
            <Box minWidth={!matches ? "800px" : null}>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable
                  compacta
                  data={listaContas?.data}
                  columns={columns}
                  conta={listaContas?.data?.conta}
                  Editar={({ row }) => (
                    <MenuOptionsTable
                      row={row}
                      getData={getData}
                      deleteCallback={() => handleDeleteRow(row?.id)}
                    />
                  )}
                />
              </TableContainer>
            </Box>
          ) : (
            <Box>
              <LinearProgress color="secondary" />
            </Box>
          )}

          <Box
            display="flex"
            alignSelf="flex-end"
            marginTop="8px"
            justifyContent="space-between"
          >
            <Pagination
              variant="outlined"
              color="secondary"
              size="large"
              count={listaContas?.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </Box>
        </Box>

        {tipo_beneficio_id && (
          <TableFloatingActionButtons
            approveCallback={() => {
              setApprovePayment(true);
              setAprovarTodos(false);
              setShowAprovarModal(true);
            }}
            rejectCallback={() => {
              setApprovePayment(false);
              setAprovarTodos(false);
              setShowAprovarModal(true);
            }}
          />
        )}
      </Box>

      <ModalManager.SenhaAprovar
        aprovarTodos={aprovarTodos}
        show={showAprovarModal}
        setShow={setShowAprovarModal}
        handleAprovarPagamento={handleAprovarPagamento}
        approve={approvePayment}
      />
    </Box>
  );
}
