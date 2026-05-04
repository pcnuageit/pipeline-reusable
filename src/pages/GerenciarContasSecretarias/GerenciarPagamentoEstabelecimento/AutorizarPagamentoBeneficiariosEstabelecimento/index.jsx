import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check, Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { loadUserData } from "../../../../actions/actions";
import CustomCollapseTable from "../../../../components/CustomCollapseTable/CustomCollapseTable";
import { MenuOptionsTable } from "../../../../components/MenuOptionsTable";
import { ModalManager } from "../../../../components/ModalManager";
import TableHeaderButton from "../../../../components/TableHeaderButton";
import { APP_CONFIG } from "../../../../constants/config";
import useAuth from "../../../../hooks/useAuth";
import useDebounce from "../../../../hooks/useDebounce";
import usePermission from "../../../../hooks/usePermission";
import {
  deletePagamentosEstabelecimento,
  getAutorizarPagamentosEstabelecimento,
  postAutorizarPagamentosEstabelecimento,
} from "../../../../services/beneficiarios";
import { documentMask } from "../../../../utils/documentMask";
import { errorMessageHelper } from "../../../../utils/errorMessageHelper";
import { phoneMask } from "../../../../utils/phoneMask";
import px2vw from "../../../../utils/px2vw";

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

const itemColumns = [
  {
    headerText: "Nome",
    key: "conta.razao_social",
    CustomValue: (nome) => (
      <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
    ),
  },
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
  {
    headerText: "",
    key: "menuCollapse",
  },
];

export default function ListaFolhaDePagamentoAutorizar() {
  const id = useParams()?.id ?? "";
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
    data_pagamento: "",
    descricao: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [aprovarTodos, setAprovarTodos] = useState(0);
  const [showAprovarModal, setShowAprovarModal] = useState(false);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token, dispatch]);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      created_at: "",
      data_pagamento: "",
      descricao: "",
      mostrar: "15",
    });
  };

  const filters = `created_at=${filter.created_at}&data_pagamento=${filter.data_pagamento}&descricao=${filter.descricao}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAutorizarPagamentosEstabelecimento(
        token,
        id,
        page,
        "",
        filters
      );
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  const handleDeleteFolha = async (idFolha) => {
    setLoading(true);
    try {
      await deletePagamentosEstabelecimento(token, idFolha);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleAprovarPagamento = async (dataToken) => {
    setLoading(true);
    try {
      await postAutorizarPagamentosEstabelecimento(
        token,
        id,
        dataToken,
        registros,
        aprovarTodos
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
            Aprovar pagamentos - Estabelecimentos
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
            <Grid container spacing={3}>
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
                  label="Pesquisar por data de pagamento"
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
                  value={filter.data_pagamento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      data_pagamento: e.target.value,
                    }));
                  }}
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por descrição"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.descricao}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }));
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <TableHeaderButton
                text="Limpar"
                color="red"
                onClick={resetFilters}
                Icon={Delete}
              />

              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.autorizar_pagamentos
                  .actions.approve_payment
              ) && (
                <TableHeaderButton
                  text="Aprovar"
                  onClick={() => {
                    setAprovarTodos(false);
                    setShowAprovarModal(true);
                  }}
                  Icon={Check}
                />
              )}

              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.autorizar_pagamentos
                  .actions.approve_all
              ) && (
                <TableHeaderButton
                  text="Aprovar todos"
                  onClick={() => {
                    setAprovarTodos(true);
                    setShowAprovarModal(true);
                  }}
                />
              )}
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
                  data={listaContas.data}
                  Editar={({ row }) => (
                    <MenuOptionsTable
                      row={row}
                      getData={getData}
                      deleteCallback={
                        row?.aprovado ? null : () => handleDeleteFolha(row?.id)
                      }
                    />
                  )}
                  EditarCollapse={({ row }) => (
                    <MenuOptionsTable
                      row={row?.reembolso_request?.demonstrativo}
                      infoTableColumns={[
                        {
                          headerText: "DAta",
                          key: "data_transacao",
                          CustomValue: (date) => (
                            <Typography>
                              {moment(date).format("DD/MM/YYYY, HH:mm")}
                            </Typography>
                          ),
                        },
                        { headerText: "NSU", key: "nsu" },
                        { headerText: "Cartão", key: "cd_cartao" },
                        { headerText: "Produto", key: "cd_produto" },
                        {
                          headerText: "Valor total",
                          key: "valor_transacao",
                          CustomValue: (value) => (
                            <>
                              <Typography>
                                R${" "}
                                {parseFloat(value).toLocaleString("pt-br", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Typography>
                            </>
                          ),
                        },
                        {
                          headerText: "Valor líquido",
                          key: "valor_liquido",
                          CustomValue: (value) => (
                            <>
                              <Typography>
                                R${" "}
                                {parseFloat(value).toLocaleString("pt-br", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Typography>
                            </>
                          ),
                        },
                      ]}
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
      </Box>

      <ModalManager.SenhaAprovar
        aprovarTodos={aprovarTodos}
        show={showAprovarModal}
        setShow={setShowAprovarModal}
        handleAprovarPagamento={handleAprovarPagamento}
      />
    </Box>
  );
}
