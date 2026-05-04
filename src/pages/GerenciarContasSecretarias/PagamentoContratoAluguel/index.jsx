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
import { Check, Delete, Description, ReplayOutlined } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  generatePath,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { loadUserData } from "../../../actions/actions";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import SelectBeneficio from "../../../components/SelectBeneficio";
import SelectCidade from "../../../components/SelectCidade";
import TableHeaderButton from "../../../components/TableHeaderButton";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import useQuery from "../../../modules/FinancialSupport/hooks/useQuery";
import {
  deletePagamentosContratoAluguel,
  getPagamentosContratoAluguel,
  patchPagamentosContratoAluguelStatusToCreatedLote,
} from "../../../services/beneficiarios";
import { documentMask } from "../../../utils/documentMask";
import pixKeyType from "../../../utils/pixKeyType";
import px2vw from "../../../utils/px2vw";
import { translateStatus } from "../../../utils/translateStatus";

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

export default function PagamentoContratoAluguel({ tipo_beneficio_id = "" }) {
  const queryParams = useQuery();
  const descricao = queryParams.get("descricao") ?? "";
  const id = useParams()?.id ?? tipo_beneficio_id;
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    created_at: "",
    data_inicio: "",
    data_fim: "",
    status: " ",
    contrato_aluguel_id: "",
    documento_locador: "",
    nome_beneficiario: "",
    cidade: "",
    tipo_beneficio_id: "",
    competencia: "",
    descricao: descricao,
    chave_pix: " ",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [registros, setRegistros] = useState([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token, dispatch]);

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      created_at: "",
      data_inicio: "",
      data_fim: "",
      status: " ",
      contrato_aluguel_id: "",
      documento_locador: "",
      nome_beneficiario: "",
      cidade: "",
      tipo_beneficio_id: "",
      competencia: "",
      descricao: "",
      chave_pix: " ",
    });
  };

  const filters = `conta_id=${id}&created_at=${filter.created_at}&data_inicio=${filter.data_inicio}&data_fim=${filter.data_fim}&contrato_aluguel_id=${filter.contrato_aluguel_id}&status=${filter.status}&documento_locador=${filter.documento_locador}&nome_beneficiario=${filter.nome_beneficiario}&cidade=${filter.cidade}&tipo_beneficio_id=${filter.tipo_beneficio_id}&competencia=${filter.competencia}&descricao=${filter.descricao}&chave_pix=${filter.chave_pix}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getPagamentosContratoAluguel(
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
      await patchPagamentosContratoAluguelStatusToCreatedLote(token, registros);
      toast.success("O status dos items foram revertidos.");
      await getData(token);
      setRegistros([]);
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel alterar o status dos items. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePagamento = async (id) => {
    setLoading(true);
    try {
      await deletePagamentosContratoAluguel(token, id);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

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
      headerText: "CRIADO EM",
      key: "created_at",
      CustomValue: (date) => {
        return <>{moment.utc(date).format("DD MMMM YYYY")}</>;
      },
    },
    {
      headerText: "DATA PAGAMENTO",
      key: "data_pagamento",
      CustomValue: (date) => {
        return <>{moment.utc(date).format("DD MMMM YYYY")}</>;
      },
    },
    {
      headerText: "competência",
      key: "competencia",
    },
    {
      headerText: "descrição",
      key: "descricao",
    },
    { headerText: "NOME LOCADOR", key: "contrato_aluguel.nome" },
    {
      headerText: "DOCUMENTO LOCADOR",
      key: "contrato_aluguel.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "NOME BENEFICIÁRIO",
      key: "contrato_aluguel.locatario.user.nome",
    },
    {
      headerText: "DOCUMENTO BENEFICIÁRIO",
      key: "contrato_aluguel.locatario.user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "CIDADE",
      key: "contrato_aluguel.locatario.user.concorrencia_endereco.cidade",
    },
    {
      headerText: "TIPO",
      key: "contrato_aluguel.tipo_transacao",
      CustomValue: (tipo) => (tipo === "Dict" ? "Pix" : "Manual"),
    },
    {
      headerText: "TIPO DE CHAVE PIX",
      key: "",
      FullObject: (data) => {
        if (data?.contrato_aluguel?.tipo_transacao === "Manual") {
          return <Typography>-</Typography>;
        } else {
          return (
            <Typography>
              {pixKeyType(data?.contrato_aluguel?.chave_pix)}
            </Typography>
          );
        }
      },
    },
    {
      headerText: "DADOS",
      key: "",
      FullObject: (data) => {
        if (data?.contrato_aluguel?.tipo_transacao === "Manual") {
          return (
            <Typography>{`${data?.contrato_aluguel?.banco} ${data?.contrato_aluguel?.agencia} ${data?.contrato_aluguel?.conta_sem_digito}-${data?.contrato_aluguel?.digito_conta}`}</Typography>
          );
        } else {
          return <Typography>{data?.contrato_aluguel?.chave_pix}</Typography>;
        }
      },
    },
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <Box>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Box>
        );
      },
    },
    {
      headerText: "DURAÇÃO",
      key: "",
      FullObject: (data) => (
        <>
          {moment.utc(data?.contrato_aluguel?.data_inicio).format("DD/MM/YY")} a{" "}
          {moment.utc(data?.contrato_aluguel?.data_fim).format("DD/MM/YY")}
        </>
      ),
    },
    {
      headerText: "STATUS",
      key: "status",
      CustomValue: (status) => translateStatus(status),
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
            Pagamentos - Contrato Aluguel
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
                  label="Data de criação"
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
                  label="Data de pagamento inicial"
                  variant="outlined"
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  value={filter.data_inicio}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      data_inicio: e.target.value,
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Data de pagamento final"
                  variant="outlined"
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  value={filter.data_fim}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      data_fim: e.target.value,
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel id="status-label" shrink="true">
                  Status
                </InputLabel>
                <Select
                  fullWidth
                  variant="outlined"
                  label={"Status"}
                  labelId="status-label"
                  value={filter.status}
                  placeholder="Status"
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }));
                  }}
                >
                  <MenuItem value={" "}>Todos</MenuItem>
                  <MenuItem value={"Aguardando"}>
                    {translateStatus("Aguardando")}
                  </MenuItem>
                  <MenuItem value={"created"}>
                    {translateStatus("created")}
                  </MenuItem>
                  <MenuItem value={"succeeded"}>
                    {translateStatus("succeeded")}
                  </MenuItem>
                  <MenuItem value={"confirmed"}>
                    {translateStatus("confirmed")}
                  </MenuItem>
                  <MenuItem value={"pending"}>
                    {translateStatus("pending")}
                  </MenuItem>
                  <MenuItem value={"rejected"}>
                    {translateStatus("rejected")}
                  </MenuItem>
                  <MenuItem value={"failed"}>
                    {translateStatus("failed")}
                  </MenuItem>
                  <MenuItem value={"excluido"}>Excluido</MenuItem>
                  <MenuItem value={"ErrorBalance"}>
                    {translateStatus("ErrorBalance")}
                  </MenuItem>
                  <MenuItem value={"Error"}>
                    {translateStatus("Error")}
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por ID do contrato"
                  variant="outlined"
                  value={filter.contrato_aluguel_id}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      contrato_aluguel_id: e.target.value,
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por locador"
                  variant="outlined"
                  value={filter.documento_locador}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      documento_locador: e.target.value,
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por beneficiário"
                  variant="outlined"
                  value={filter.nome_beneficiario}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      nome_beneficiario: e.target.value,
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectCidade
                  state={filter.cidade}
                  setState={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      cidade: e.target.value,
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

              <Grid item xs={4}>
                <InputLabel id="pix-type-label" shrink="true">
                  Tipo de Chave Pix
                </InputLabel>
                <Select
                  fullWidth
                  variant="outlined"
                  label={"Tipo de Chave Pix"}
                  labelId="pix-type-label"
                  value={filter.chave_pix}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      chave_pix: e.target.value,
                    }));
                  }}
                >
                  <MenuItem value={" "}>Todos</MenuItem>
                  <MenuItem value={"cnpj"}>CNPJ</MenuItem>
                  <MenuItem value={"cpf"}>CPF</MenuItem>
                  <MenuItem value={"celular"}>Celular</MenuItem>
                  <MenuItem value={"email"}>Email</MenuItem>
                  <MenuItem value={"chave aleatória"}>Chave aleatória</MenuItem>
                </Select>
              </Grid>

              <TableHeaderButton
                text="Limpar"
                color="red"
                onClick={resetFilters}
                Icon={Delete}
              />
              <TableHeaderButton
                text="Arquivos em lote"
                onClick={() => {
                  const path = generatePath(
                    "lista-arquivos-de-lote?type=pagamento_contrato_aluguel",
                  );
                  history.push(path);
                }}
              />
              <ExportTableButtons
                token={token}
                path={"contrato-aluguel-pagamento"}
                page={page}
                filters={filters}
              />
              <TableHeaderButton
                text="Selecionar página"
                onClick={handleSelectAll}
                Icon={Check}
              />
              <TableHeaderButton
                text="Reverter selecionados"
                onClick={handleResetStatus}
                Icon={ReplayOutlined}
              />
              <TableHeaderButton
                text="Pagamento por Descrição"
                onClick={() => {
                  const path = generatePath(
                    "/dashboard/gerenciar-contas/:id/pagamento-contrato-aluguel-descricao",
                    {
                      id,
                    },
                  );
                  history.push(path);
                }}
                Icon={Description}
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
                  Editar={({ row }) => (
                    <MenuOptionsTable
                      row={row}
                      getData={getData}
                      patchStatus={
                        row.status === "succeeded" ? null : "contrato"
                      }
                      JSONResponse={
                        row.status === "succeeded" || row.status === "rejected"
                          ? row?.pagamento_pix?.response
                          : row?.response
                      }
                      deleteCallback={() => handleDeletePagamento(row?.id)}
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
    </Box>
  );
}
