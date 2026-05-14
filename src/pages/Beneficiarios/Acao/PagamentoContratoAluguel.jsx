import {
  Box,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Delete } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  generatePath,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";

import { loadUserData } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import { getPagamentosContratoAluguel } from "../../../services/beneficiarios";

import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import {
  ExportTableButtons,
  TableHeaderButton,
} from "../../../components/TableHeaderButtons";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";
import { translateStatus } from "../../../utils/translateStatus";

moment.locale();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dadosBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: "24px",
    marginLeft: "0px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    boxShadow: "none",
    borderRadius: "0px",
    alignSelf: "center",
  },
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "10%",
    left: "35%",
    width: "30%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },
  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
}));

const columns = [
  {
    headerText: "DATA",
    key: "created_at",
    CustomValue: (created_at) => {
      return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
    },
  },
  {
    headerText: "DATA PAGAMENTO",
    key: "data_pagamento",
    CustomValue: (date) => {
      return <>{moment.utc(date).format("DD MMMM YYYY")}</>;
    },
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
    headerText: "TIPO",
    key: "contrato_aluguel.tipo_transacao",
    CustomValue: (tipo) => (tipo === "Dict" ? "Pix" : "Manual"),
  },
  {
    headerText: "DADOS",
    key: "",
    FullObject: (data) =>
      data?.contrato_aluguel?.chave_pix ||
      `${data?.contrato_aluguel?.banco} ${data?.contrato_aluguel?.agencia} ${data?.contrato_aluguel?.conta_sem_digito}-${data?.contrato_aluguel?.digito_conta}`,
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
  {
    headerText: "competência",
    key: "competencia",
  },
  { headerText: "", key: "menu" },
];

export default function PagamentoContratoAluguel() {
  const id = useParams()?.id ?? "";
  const history = useHistory();
  const token = useAuth();
  const { hasPermission } = usePermission();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [lista, setLista] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    created_at: "",
    data_pagamento: "",
    status: " ",
    contrato_aluguel_id: "",
    like: "",
    nome_beneficiario: "",
    mostrar: "15",
  });
  const debouncedFilters = useDebounce(filter, 800);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      created_at: "",
      data_pagamento: "",
      status: " ",
      contrato_aluguel_id: "",
      like: "",
      nome_beneficiario: "",
      mostrar: "15",
    });
  };

  const filters = `created_at=${filter.created_at}&data_pagamento=${filter.data_pagamento}&contrato_aluguel_id=${filter.contrato_aluguel_id}&status=${filter.status}&like=${filter.like}&nome_beneficiario=${filter.nome_beneficiario}&mostrar=${filter.mostrar}`;

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
      setLista(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilters]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [dispatch, token]);

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Pagamento Contrato de Aluguel" />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                alignItems: "center",
                borderRadius: "17px",
                flexDirection: "column",
                minWidth: "100%",
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
                <Box
                  display="flex"
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Box
                    style={{
                      width: "100%",
                      borderTopRightRadius: 27,
                      borderTopLeftRadius: 27,
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
                      <Box style={{ margin: 30 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={3}>
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

                          <Grid item xs={12} sm={3}>
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

                          <Grid item xs={3}>
                            <InputLabel id="status-label" shrink="true">
                              Status
                            </InputLabel>
                            <Select
                              fullWidth
                              variant="outlined"
                              label={"Status"}
                              labelId="status-label"
                              value={filter.status}
                              size="small"
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
                              <MenuItem value={"ErrorBalance"}>
                                {translateStatus("ErrorBalance")}
                              </MenuItem>
                              <MenuItem value={"Error"}>
                                {translateStatus("Error")}
                              </MenuItem>
                            </Select>
                          </Grid>

                          <Grid item xs={12} sm={3}>
                            <InputLabel id="mostrar_label" shrink="true">
                              Itens por página
                            </InputLabel>
                            <Select
                              labelId="mostrar_label"
                              value={filter.mostrar}
                              onChange={(e) => {
                                setPage(1);
                                setFilter({
                                  ...filter,
                                  mostrar: e.target.value,
                                });
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

                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              placeholder="Pesquisar por ID do contrato"
                              size="small"
                              variant="outlined"
                              style={{
                                marginRight: "10px",
                              }}
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
                              size="small"
                              variant="outlined"
                              style={{
                                marginRight: "10px",
                              }}
                              value={filter.like}
                              onChange={(e) => {
                                setPage(1);
                                setFilter((prev) => ({
                                  ...prev,
                                  like: e.target.value,
                                }));
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              placeholder="Pesquisar por beneficiário"
                              size="small"
                              variant="outlined"
                              style={{
                                marginRight: "10px",
                              }}
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
                            disabled={!hasPermission()}
                          />

                          <ExportTableButtons
                            token={token}
                            path={"contrato-aluguel-pagamento"}
                            page={page}
                            filters={filters}
                          />
                        </Grid>
                      </Box>
                    </Box>

                    {!loading && lista?.data && lista?.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns}
                            data={lista?.data}
                            Editar={({ row }) => (
                              <MenuOptionsTable
                                row={row}
                                getData={getData}
                                JSONResponse={
                                  row.status === "succeeded" ||
                                  row.status === "rejected"
                                    ? row?.pagamento_pix?.response
                                    : row?.response
                                }
                                patchStatus={
                                  row.status === "failed" ||
                                  row.status === "rejected" ||
                                  row.status === "ErrorBalance" ||
                                  row.status === "Error"
                                    ? "contrato"
                                    : null
                                }
                              />
                            )}
                          />
                        </Box>

                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={lista.last_page}
                            onChange={(e, value) => setPage(value)}
                            page={page}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <LinearProgress color="secondary" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
