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
import { Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useRef, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { postAuthMeAction } from "../../../actions/actions";
import CustomCollapseTable from "../../../components/CustomCollapseTable/CustomCollapseTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import SelectBeneficio from "../../../components/SelectBeneficio";
import TableHeaderButton from "../../../components/TableHeaderButton";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import usePermission from "../../../hooks/usePermission";
import {
  deletePagamentosCartaoPrivado,
  getPagamentosCartaoPrivado,
} from "../../../services/beneficiarios";
import { documentMask } from "../../../utils/documentMask";
import { phoneMask } from "../../../utils/phoneMask";
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
  {
    headerText: "BENEFÍCIO",
    key: "",
    FullObject: (data) => (
      <Typography>
        {data?.beneficiarios[0]?.cartao?.tipo_beneficio?.nome_beneficio}
      </Typography>
    ),
  },
  { headerText: "STATUS", key: "status_aprovado" },
  {
    headerText: "DATA DE PAGAMENTO",
    key: "data_pagamento",
    CustomValue: (data_pagamento) => {
      return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
    },
  },
  { headerText: "competência", key: "competencia" },
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

const itemColumns = [
  {
    headerText: "Nome",
    key: "cartao.user.nome",
    CustomValue: (nome) => (
      <Typography style={{ lineBreak: "loose" }}>{nome}</Typography>
    ),
  },
  {
    headerText: "Cartão",
    key: "cartao.external_msk",
  },
  {
    headerText: "Cidade",
    key: "cartao.municipio",
  },
  {
    headerText: "CPF",
    key: "cartao.user.documento",
    CustomValue: (documento) => (
      <Typography style={{ lineBreak: "anywhere" }}>
        {documentMask(documento)}
      </Typography>
    ),
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
    headerText: "",
    key: "menuCollapse",
  },
];

export default function ListaBeneficiariosCartao({ tipo_beneficio_id = "" }) {
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
    competencia: "",
    descricao: "",
    tipo_beneficio_id: "",
    curso: "",
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
      competencia: "",
      descricao: "",
      tipo_beneficio_id: "",
      curso: "",
    });
  };

  const filters = `conta_id=${id}&created_at=${filter.created_at}&data_pagamento=${filter.data_pagamento}&status_aprovado=${filter.status_aprovado}&competencia=${filter.competencia}&descricao=${filter.descricao}&tipo_beneficio_id=${filter.tipo_beneficio_id}&cursos=${filter.curso}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getPagamentosCartaoPrivado(
        token,
        id,
        page,
        "",
        filters,
      );
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
            Pagamentos de Cartão
          </Typography>

          {hasPermission(
            PERMISSIONS.secretarias.pagamento_cartao.update_extract,
          ) && (
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
            {hasPermission(PERMISSIONS.secretarias.pagamento_cartao.search) && (
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
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"1"}>Aguardando</MenuItem>
                    <MenuItem value={"2"}>Aprovado</MenuItem>
                    <MenuItem value={"3"}>Falha</MenuItem>
                  </Select>
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
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por curso"
                    variant="outlined"
                    value={filter.curso}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        curso: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectBeneficio
                    state={filter?.tipo_beneficio_id}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        tipo_beneficio_id: e.target.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(
                PERMISSIONS.secretarias.pagamento_cartao.search,
              ) && (
                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilters}
                />
              )}

              <TableHeaderButton
                text="Arquivos em lote"
                onClick={() => {
                  const path = generatePath(
                    "lista-arquivos-de-lote?type=pagamento_cartao",
                  );
                  history.push(path);
                }}
              />

              <ExportTableButtons
                token={token}
                path={"cartao-privado-pagamento"}
                page={page}
                filters={filters}
                hasPermission={hasPermission(
                  PERMISSIONS.secretarias.cartoes.export,
                )}
              />

              <TableHeaderButton
                text="Aprovar carga"
                onClick={() => {
                  const path = generatePath(
                    "/dashboard/gerenciar-contas/:id/autorizar-pagamento-cartao",
                    {
                      id,
                    },
                  );
                  history.push(path);
                }}
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

        {hasPermission(PERMISSIONS.secretarias.pagamento_cartao.view) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaContas?.data && listaContas?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomCollapseTable
                    compacta
                    data={listaContas?.data}
                    columns={columns}
                    itemColumns={
                      hasPermission(
                        PERMISSIONS.secretarias.pagamento_cartao.view_details,
                      )
                        ? itemColumns
                        : []
                    }
                    Editar={({ row }) => (
                      <MenuOptionsTable
                        row={row}
                        getData={getData}
                        printType={
                          hasPermission(
                            PERMISSIONS.secretarias.pagamento_cartao.print,
                          )
                            ? "pagamento_cartao"
                            : null
                        }
                        deleteCallback={
                          hasPermission(
                            PERMISSIONS.secretarias.pagamento_cartao.delete,
                          )
                            ? deletePagamentosCartaoPrivado
                            : null
                        }
                        exportRow="cartao-privado-pagamento"
                      />
                    )}
                    EditarCollapse={({ row }) => (
                      <MenuOptionsTable
                        JSONResponse={
                          hasPermission(
                            PERMISSIONS.secretarias.pagamento_cartao
                              .view_return_message,
                          )
                            ? row?.response
                            : null
                        }
                      />
                    )}
                    conta={listaContas?.data?.conta}
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
