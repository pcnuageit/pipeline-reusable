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
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import { ArrowRightRounded } from "@mui/icons-material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useRef, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { postAuthMeAction } from "../../../actions/actions";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import TableHeaderButton from "../../../components/TableHeaderButton";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import usePermission from "../../../hooks/usePermission";
import {
  deletePagamentosVoucher,
  getPagamentosVoucher,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";

moment.locale("pt-br");

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
  // { headerText: "STATUS", key: "status_aprovado" },
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
    headerText: "competencia",
    key: "competencia",
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
    headerText: "Rejeitado",
    key: "status_rejeitado",
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

// const itemColumns = [
//   {
//     headerText: "Nome",
//     key: "conta.user.nome",
//     CustomValue: (nome) => (
//       <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
//     ),
//   },
//   {
//     headerText: "Email",
//     key: "conta.user.email",
//     CustomValue: (email) => (
//       <Typography style={{ lineBreak: "anywhere" }}>{email}</Typography>
//     ),
//   },
//   {
//     headerText: "CPF",
//     key: "conta.user.documento",
//     CustomValue: (documento) => (
//       <Typography style={{ lineBreak: "anywhere" }}>
//         {documentMask(documento)}
//       </Typography>
//     ),
//   },
//   {
//     headerText: "Contato",
//     key: "conta.user.celular",
//     CustomValue: (celular) => (
//       <Typography style={{ lineBreak: "anywhere" }}>
//         {celular ? phoneMask(celular) : "*"}
//       </Typography>
//     ),
//   },
//   {
//     headerText: "TIPO DE CHAVE PIX",
//     key: "conta",
//     CustomValue: (conta) => {
//       if (conta?.tipo_transferencia === "Manual") {
//         return <Typography>-</Typography>;
//       } else {
//         return <Typography>{pixKeyType(conta?.chave_pix)}</Typography>;
//       }
//     },
//   },
//   {
//     headerText: "Dados",
//     key: "conta",
//     CustomValue: (conta) => {
//       if (conta?.tipo_transferencia === "Manual") {
//         return (
//           <Typography>{`${conta?.banco} ${conta?.agencia} ${conta?.conta_sem_digito}-${conta?.digito_conta}`}</Typography>
//         );
//       } else {
//         return <Typography>{conta?.chave_pix}</Typography>;
//       }
//     },
//   },
//   {
//     headerText: "Valor",
//     key: "valor_pagamento",
//     CustomValue: (valor) => (
//       <Typography style={{ lineBreak: "auto" }}>
//         R$
//         {parseFloat(valor).toLocaleString("pt-br", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}
//       </Typography>
//     ),
//   },
//   {
//     headerText: "Tipo Pagamento",
//     key: "tipo_pagamento",
//     CustomValue: (tipo_pagamento) => (
//       <Typography style={{ lineBreak: "loose" }}>{tipo_pagamento}</Typography>
//     ),
//   },
//   {
//     headerText: "Status Transação",
//     key: "status",
//     CustomValue: (status) => (
//       <Typography style={{ lineBreak: "loose" }}>
//         {status === "Pedente" ? "Pendente" : status}
//       </Typography>
//     ),
//   },
//   {
//     headerText: "",
//     key: "menuCollapse",
//   },
// ];

export default function ListaBeneficiariosVoucher({ tipo_beneficio_id = "" }) {
  const token = useAuth();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? tipo_beneficio_id;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    created_at: "",
    data_pagamento: "",
    status_aprovado: " ",
    documento: "",
    descricao: "",
    competencia: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const { hasPermission, PERMISSIONS } = usePermission();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const isInitialMount = useRef(true);
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
      documento: "",
      descricao: "",
      competencia: "",
    });
  };

  const filters = `created_at=${filter.created_at}&data_pagamento=${filter.data_pagamento}&status_aprovado=${filter.status_aprovado}&documento=${filter.documento}&descricao=${filter.descricao}&competencia=${filter.competencia}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getPagamentosVoucher(token, id, page, "", filters);
      console.log(data);
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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    resetFilters();
  }, [id]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

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
            Pagamentos de Voucher
          </Typography>

          {hasPermission(PERMISSIONS.secretarias.pagamento_voucher.actions) && (
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
          )}
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
            {hasPermission(PERMISSIONS.secretarias.pagamento_voucher.view) && (
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
                  <InputLabel id="select-label" shrink="true">
                    Status
                  </InputLabel>
                  <Select
                    labelId="select-label"
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
                    <MenuItem value={" "}>Status</MenuItem>
                    <MenuItem value={"1"}>Aguardando</MenuItem>
                    <MenuItem value={"2"}>Aprovado</MenuItem>
                    {/* <MenuItem value={"3"}>Cancelado</MenuItem> */}
                    {/* <MenuItem value={"4"}>Error</MenuItem> */}
                    <MenuItem value={"3"}>Rejeitado</MenuItem>
                    <MenuItem value={"4"}>Falha</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por documento"
                    size="small"
                    variant="outlined"
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

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por descrição"
                    size="small"
                    variant="outlined"
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
                  <ReactInputMask
                    mask={"99/9999"}
                    value={filter.competencia}
                    onChange={(e) => {
                      setPage(1);
                      setFilter({
                        ...filter,
                        competencia: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        placeholder="Pesquisar por competência"
                        variant="outlined"
                      />
                    )}
                  </ReactInputMask>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(
                PERMISSIONS.secretarias.pagamento_voucher.view,
              ) && (
                <TableHeaderButton
                  text="Limpar"
                  onClick={resetFilters}
                  color="red"
                />
              )}

              {id &&
              hasPermission(
                PERMISSIONS.secretarias.pagamento_voucher.view_batch_files,
              ) ? (
                <TableHeaderButton
                  text="Arquivos em lote"
                  onClick={() => {
                    const path = generatePath(
                      "lista-arquivos-de-lote?type=pagamento_voucher",
                    );
                    history.push(path);
                  }}
                />
              ) : null}

              <ExportTableButtons
                token={token}
                path={"pagamento-aluguel"}
                page={page}
                filters={filters + `&conta_id=${id}`}
                hasPermission={hasPermission(
                  PERMISSIONS.secretarias.pagamento_voucher.export,
                )}
              />
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

        {hasPermission(PERMISSIONS.secretarias.pagamento_voucher.view) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaContas?.data && listaContas?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    compacta
                    data={listaContas?.data}
                    columns={columns}
                    // itemColumns={itemColumns}
                    Editar={({ row }) => (
                      <MenuOptionsTable
                        row={row}
                        getData={getData}
                        printType={"pagamento_voucher"}
                        deleteCallback={deletePagamentosVoucher}
                        navigateTo={{
                          icon: ArrowRightRounded,
                          path: generatePath(
                            "/dashboard/gerenciar-contas/:id/pagamento-beneficiarios-voucher/:subsectionId",
                            {
                              id: id,
                              subsectionId: row?.id,
                            },
                          ),
                        }}
                        exportRow="pagamento-aluguel"
                      />
                    )}
                    // EditarCollapse={({ row }) => (
                    //   <MenuOptionsTable
                    //     row={row}
                    //     getData={getData}
                    //     patchStatus={
                    //       row?.status === "Aprovado" ? null : "voucher"
                    //     }
                    //     JSONResponse={row?.response}
                    //   />
                    // )}
                    // conta={listaContas?.data?.conta}
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
