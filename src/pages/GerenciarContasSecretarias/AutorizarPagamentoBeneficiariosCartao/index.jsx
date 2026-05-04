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
  getAutorizarPagamentosCartaoPrivado,
  postAutorizarPagamentosCartaoPrivado,
} from "../../../services/beneficiarios";
import { errorMessageHelper } from "../../../utils/errorMessageHelper";
import px2vw from "../../../utils/px2vw";

import CustomCollapseTable from "../../../components/CustomCollapseTable/CustomCollapseTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import { ModalManager } from "../../../components/ModalManager";
import TableFloatingActionButtons from "../../../components/TableFloatingActionButtons";
import TableHeaderButton from "../../../components/TableHeaderButton";
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

export default function AutorizarPagamentoBeneficiariosCartao({
  tipo_beneficio_id = "",
}) {
  const id = useParams()?.id ?? tipo_beneficio_id;
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    created_at: "",
    like: "",
    mostrar: "15",
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
      like: "",
      mostrar: "15",
    });
  };

  const filters = `created_at=${filter.created_at}&like=${filter.like}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAutorizarPagamentosCartaoPrivado(
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
      await postAutorizarPagamentosCartaoPrivado(
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
    { headerText: "DESCRIÇÃO", key: "descricao" },
    { headerText: "STATUS", key: "status_aprovado" },
    {
      headerText: "DATA DE PAGAMENTO",
      key: "data_pagamento",
      CustomValue: (data_pagamento) => {
        return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
      },
    },
    { headerText: "", key: "menu" },
  ];

  const itemColumns = [
    {
      headerText: "Nome",
      key: "cartao.user.nome",
      CustomValue: (nome) => (
        <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
      ),
    },
    {
      headerText: "Email",
      key: "cartao.user.email",
      CustomValue: (email) => (
        <Typography style={{ lineBreak: "anywhere" }}>{email}</Typography>
      ),
    },
    {
      headerText: "CPF",
      key: "cartao.user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "Contato",
      key: "cartao.user.celular",
      CustomValue: (celular) => (
        <Typography style={{ lineBreak: "anywhere" }}>
          {celular ? phoneMask(celular) : "*"}
        </Typography>
      ),
    },
    {
      headerText: "Tipo Pagamento",
      key: "conta.documento",
      CustomValue: (tipo_pagamento) => (
        <Typography style={{ lineBreak: "loose" }}>{"Benefício"}</Typography>
      ),
    },
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
        <Typography style={{ lineBreak: "loose" }}>{status}</Typography>
      ),
    },
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
            Aprovar pagamentos - Cartão Privado
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pesquisar por nome, documento, email..."
                  size="small"
                  variant="outlined"
                  value={filter.like}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      like: e.target.value,
                    });
                  }}
                />
              </Grid>

              <TableHeaderButton
                text="Limpar"
                color="red"
                onClick={resetFilters}
              />

              <TableHeaderButton
                text="Selecionar todos"
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
                text="Aprovar todos"
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
                <CustomCollapseTable
                  columns={columns}
                  itemColumns={itemColumns}
                  data={listaContas?.data}
                  Editar={() => null}
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
