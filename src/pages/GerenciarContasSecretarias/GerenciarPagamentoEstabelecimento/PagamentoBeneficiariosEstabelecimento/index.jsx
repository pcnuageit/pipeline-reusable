import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Delete, Visibility } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { postAuthMeAction } from "../../../../actions/actions";
import { APP_CONFIG } from "../../../../constants/config";
import useAuth from "../../../../hooks/useAuth";
import useDebounce from "../../../../hooks/useDebounce";
import { getPagamentosEstabelecimento } from "../../../../services/beneficiarios";
import px2vw from "../../../../utils/px2vw";

import { List, Pix } from "@mui/icons-material";
import {
  generatePath,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../../components/ExportTableButtons";
import TableHeaderButton from "../../../../components/TableHeaderButton";
import usePermission from "../../../../hooks/usePermission";
import { documentMask } from "../../../../utils/documentMask";
import { phoneMask } from "../../../../utils/phoneMask";
import ModalAprovadores from "./ModalAprovadores";

moment.locale("pt-br");

const itemColumns = [
  {
    headerText: "Nome",
    key: "conta.nome",
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
    headerText: "Documento",
    key: "conta",
    CustomValue: (conta) => (
      <Typography style={{ lineBreak: "loose" }}>
        {documentMask(conta?.cnpj ?? conta?.documento)}
      </Typography>
    ),
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
    headerText: "Quantidade",
    key: "reembolso_request.qtd",
    CustomValue: (v) => (
      <Typography style={{ textAlign: "center" }}>{v}</Typography>
    ),
  },
  {
    headerText: "",
    key: "menuCollapse",
  },
];

export default function ListaBeneficiariosEstabelecimento() {
  const history = useHistory();
  const token = useAuth();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const { hasPermission, PERMISSIONS } = usePermission();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    created_at: "",
    data_pagamento: "",
    status_aprovado: " ",
    descricao: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [showAprovadoresModal, setShowAprovadoresModal] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
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
  }))();

  const resetFilters = () => {
    setPage(1);
    setFilter({
      created_at: "",
      data_pagamento: "",
      status_aprovado: " ",
      descricao: "",
      mostrar: "15",
    });
  };

  const filters = `created_at=${filter.created_at}&data_pagamento=${filter.data_pagamento}&status_aprovado=${filter.status_aprovado}&descricao=${filter.descricao}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getPagamentosEstabelecimento(
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

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

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
      headerText: "Aprovadores",
      key: "",
      FullObject: (obj) => (
        <IconButton onClick={() => setShowAprovadoresModal(obj?.aprovacoes)}>
          <Visibility style={{ color: APP_CONFIG.mainCollors.primary }} />
        </IconButton>
      ),
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
    {
      headerText: "",
      key: "menu",
    },
  ];

  return (
    <Box className={useStyles.root}>
      <Box className={useStyles.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={useStyles.pageTitle}>
            Pagamentos de Estabelecimento
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
            {hasPermission(
              PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view
            ) && (
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

                <Grid item xs={12} sm={4}>
                  <InputLabel id="Status_label" shrink="true">
                    Status
                  </InputLabel>
                  <Select
                    labelId="Status_label"
                    variant="outlined"
                    fullWidth
                    required
                    value={filter.status_aprovado}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        status_aprovado: e.target.value,
                      }));
                    }}
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"1"}>Aguardando</MenuItem>
                    <MenuItem value={"2"}>Aprovado</MenuItem>
                    <MenuItem value={"3"}>Falha</MenuItem>
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

                {/* <TableHeaderButton
                text="Arquivos em lote"
                onClick={() => {
                  const path = generatePath(
                    "lista-arquivos-de-lote?type=pagamento_estabelecimento"
                  );
                  history.push(path);
                }}
              /> */}
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view
              ) && (
                <TableHeaderButton
                  text="Limpar"
                  color="red"
                  onClick={resetFilters}
                  Icon={Delete}
                />
              )}

              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.actions
                  .header
              ) && (
                <ExportTableButtons
                  token={token}
                  path={"pagamento-estabelecimento"}
                  page={page}
                  filters={filters}
                />
              )}
            </Grid>
          </Box>

          <Typography
            className={useStyles.pageTitle}
            style={{
              marginLeft: "30px",
              paddingBottom: "16px",
              marginBottom: "1px",
            }}
          >
            CONTAS RECENTES
          </Typography>
        </Box>

        {hasPermission(
          PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view
        ) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaContas?.data && listaContas?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    data={listaContas?.data}
                    columns={columns}
                    Editar={({ row }) => {
                      if (
                        !hasPermission(
                          PERMISSIONS.pagamento_estabelecimento.todos_pagamentos
                            .actions.row
                        )
                      ) {
                        return null;
                      }

                      return (
                        <Box style={{ display: "flex", flexDirection: "row" }}>
                          <Tooltip title="Detalhamento">
                            <List
                              style={{
                                color: APP_CONFIG.mainCollors.primary,
                                fontSize: "28px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const path = generatePath(
                                  "/dashboard/gerenciar-pagamento-estabelecimento/pagamento-beneficiarios-estabelecimento/detalhamento/:id",
                                  {
                                    id: row?.id,
                                  }
                                );
                                history.push(path);
                              }}
                            />
                          </Tooltip>

                          <Tooltip title="Transações">
                            <Pix
                              style={{
                                color: APP_CONFIG.mainCollors.primary,
                                fontSize: "28px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const path = generatePath(
                                  "/dashboard/gerenciar-pagamento-estabelecimento/pagamento-beneficiarios-estabelecimento/transacoes/:id",
                                  {
                                    id: row?.id,
                                  }
                                );
                                history.push(path);
                              }}
                            />
                          </Tooltip>
                        </Box>
                        // <MenuOptionsTable
                        //   row={row}
                        //   getData={getData}
                        //   printType={"pagamento_estabelecimento"}
                        //   deleteCallback={deletePagamentosEstabelecimento}
                        // />
                      );
                    }}
                    // EditarCollapse={({ row }) => {
                    //  if (
                    //     !hasPermission(
                    //       PERMISSIONS.pagamento_estabelecimento.todos_pagamentos
                    //         .actions.row
                    //     )
                    //   ) {
                    //     return null;
                    //   }
                    //   return (
                    //     <MenuOptionsTable
                    //       row={row?.reembolso_request?.demonstrativo}
                    //       infoTableColumns={[
                    //         {
                    //           headerText: "ID",
                    //           key: "idTransacao",
                    //         },
                    //         {
                    //           headerText: "NSU",
                    //           key: "nsu",
                    //         },
                    //         {
                    //           headerText: "Data",
                    //           key: "dtTransacao",
                    //         },
                    //         {
                    //           headerText: "Total",
                    //           key: "vlTransacao",
                    //           CustomValue: (valor) => (
                    //             <Typography style={{ marginLeft: "6px" }}>
                    //               R${" "}
                    //               {parseFloat(valor).toLocaleString("pt-br", {
                    //                 minimumFractionDigits: 2,
                    //                 maximumFractionDigits: 2,
                    //               })}
                    //             </Typography>
                    //           ),
                    //         },
                    //         {
                    //           headerText: "Taxa",
                    //           key: "vlTaxa",
                    //           CustomValue: (valor) => (
                    //             <Typography style={{ marginLeft: "6px" }}>
                    //               R${" "}
                    //               {parseFloat(valor).toLocaleString("pt-br", {
                    //                 minimumFractionDigits: 2,
                    //                 maximumFractionDigits: 2,
                    //               })}
                    //             </Typography>
                    //           ),
                    //         },
                    //         {
                    //           headerText: "Interconexão",
                    //           key: "vlInterconexao",
                    //           CustomValue: (valor) => (
                    //             <Typography style={{ marginLeft: "6px" }}>
                    //               R${" "}
                    //               {parseFloat(valor).toLocaleString("pt-br", {
                    //                 minimumFractionDigits: 2,
                    //                 maximumFractionDigits: 2,
                    //               })}
                    //             </Typography>
                    //           ),
                    //         },
                    //         {
                    //           headerText: "Líquido",
                    //           key: "vlLiquido",
                    //           CustomValue: (valor) => (
                    //             <Typography style={{ marginLeft: "6px" }}>
                    //               R${" "}
                    //               {parseFloat(valor).toLocaleString("pt-br", {
                    //                 minimumFractionDigits: 2,
                    //                 maximumFractionDigits: 2,
                    //               })}
                    //             </Typography>
                    //           ),
                    //         },
                    //       ]}
                    //       JSONResponse={row?.response}
                    //       navigateTo={{
                    //         icon: Edit,
                    //         path: generatePath(
                    //           "/dashboard/editar-conta-pj-adquirencia/:id/editar",
                    //           {
                    //             id: row?.conta_estabelecimento_id,
                    //           }
                    //         ),
                    //       }}
                    //     />
                    //   );
                    // }}
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
        )}
      </Box>

      <ModalAprovadores
        show={showAprovadoresModal}
        setShow={setShowAprovadoresModal}
      />
    </Box>
  );
}
