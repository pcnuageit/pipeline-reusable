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
  Tooltip,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check, Delete, ReplayOutlined } from "@material-ui/icons";
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
import {
  getPagamentosEstabelecimentoDetalhamento,
  patchPagamentosVoucherStatusToCreatedLote,
} from "../../../../services/beneficiarios";
import px2vw from "../../../../utils/px2vw";

import { List, Pix } from "@mui/icons-material";
import ReactInputMask from "react-input-mask";
import {
  generatePath,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../../components/ExportTableButtons";
import TableHeaderButton from "../../../../components/TableHeaderButton";
import usePermission from "../../../../hooks/usePermission";
import { documentMask } from "../../../../utils/documentMask";
import { phoneMask } from "../../../../utils/phoneMask";
import { translateStatus } from "../../../../utils/translateStatus";

moment.locale("pt-br");

export default function ListaBeneficiariosEstabelecimentoDetalhamento() {
  const history = useHistory();
  const token = useAuth();
  const dispatch = useDispatch();
  const id = useParams()?.subsectionId ?? "";
  const { hasPermission, PERMISSIONS } = usePermission();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    external_id: "",
    documento: "",
    nome: "",
    email: "",
    status: " ",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [registros, setRegistros] = useState([]);
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
    setRegistros([]);
    setFilter({
      external_id: "",
      documento: "",
      nome: "",
      email: "",
      status: " ",
    });
  };

  const filters = `pagamento_estabelecimento_id=${id}&external_id=${filter.external_id}&documento=${filter.documento}&nome=${filter.nome}&email=${filter.email}&status=${filter.status}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getPagamentosEstabelecimentoDetalhamento(
        token,
        id,
        page,
        filters
      );
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    let arr = [];
    listaContas?.data.forEach((e) => {
      arr.push(e?.id);
    });
    setRegistros(arr);
  };

  const handleResetStatus = async (e) => {
    e.preventDefault();

    if (registros?.length < 1) {
      toast.error("Selecione pelo menos um item para reverter o status.");
      return;
    }

    setLoading(true);
    try {
      await patchPagamentosVoucherStatusToCreatedLote(token, registros);
      toast.success("O status dos items foram revertidos.");
      await getData(token);
      setRegistros([]);
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel alterar o status dos items. Tente novamente."
      );
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
      headerText: "",
      key: "",
      FullObject: (obj) => {
        return (
          <>
            <Box>
              <Checkbox
                color="primary"
                checked={registros.some((item) => item === obj?.id)}
                onChange={() => {
                  if (registros.some((item) => item === obj?.id)) {
                    setRegistros(registros.filter((item) => item !== obj?.id));
                  } else {
                    setRegistros([...registros, obj?.id]);
                  }
                }}
              />
            </Box>
          </>
        );
      },
    },
    {
      headerText: "ID",
      key: "external_id",
    },
    {
      headerText: "Nome",
      key: "conta",
      CustomValue: (conta) => (
        <Typography style={{ lineBreak: "loose" }}>
          {conta?.razao_social ?? conta?.nome}
        </Typography>
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
            Detalhamento Pagamento de Estabelecimento
          </Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <RefreshIcon></RefreshIcon>
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
                    label={"Pesquisar por ID"}
                    value={filter?.external_id}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        external_id: e.target.value,
                      });
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label={"Pesquisar por nome"}
                    value={filter?.nome}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        nome: e.target.value,
                      });
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label={"Pesquisar por email"}
                    value={filter?.email}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        email: e.target.value,
                      });
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <ReactInputMask
                    mask={"99.999.999/9999-99"}
                    value={filter?.documento}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        documento: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        name="Documento"
                        label={"Documento"}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </ReactInputMask>
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
                    <MenuItem value={"succeeded"}>
                      {translateStatus("succeeded")}
                    </MenuItem>
                    <MenuItem value={"pending"}>
                      {translateStatus("pending")}
                    </MenuItem>
                    <MenuItem value={"failed"}>
                      {translateStatus("failed")}
                    </MenuItem>
                    <MenuItem value={"rejected"}>
                      {translateStatus("rejected")}
                    </MenuItem>
                    <MenuItem value={"canceled"}>
                      {translateStatus("canceled")}
                    </MenuItem>
                  </Select>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(
                PERMISSIONS.pagamento_estabelecimento.todos_pagamentos.list.view
              ) && (
                <>
                  <TableHeaderButton
                    text="Limpar"
                    color="red"
                    onClick={resetFilters}
                    Icon={Delete}
                  />

                  <ExportTableButtons
                    token={token}
                    path={"estabelecimento-conta"}
                    page={page}
                    filters={filters}
                  />

                  <TableHeaderButton
                    text="Selecionar todos"
                    onClick={handleSelectAll}
                    Icon={Check}
                  />

                  <TableHeaderButton
                    text="Reverter selecionados"
                    onClick={handleResetStatus}
                    Icon={ReplayOutlined}
                  />
                </>
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

                          <Tooltip title="Pagamentos">
                            <Pix
                              style={{
                                color: APP_CONFIG.mainCollors.primary,
                                fontSize: "28px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const path = generatePath(
                                  "/dashboard/gerenciar-pagamento-estabelecimento/pagamento-beneficiarios-estabelecimento/pagamentos/:id",
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
    </Box>
  );
}
