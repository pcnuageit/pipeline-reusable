import {
  Box,
  Grid,
  LinearProgress,
  TableContainer,
  TextField,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { generatePath } from "react-router-dom";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

import { ArrowRightRounded } from "@mui/icons-material";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../components/MenuOptionsTable";
import {
  ExportTableButtons,
  TableHeaderButton,
} from "../../components/TableHeaderButtons";
import useDebounce from "../../hooks/useDebounce";
import { getPagamentosVoucher } from "../../services/beneficiarios";

moment.locale("pt-br");

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
    marginTop: "30px",
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
    headerText: "Falha",
    key: "status_falha",
  },
  {
    headerText: "",
    key: "menu",
  },
];

export default function ListaFolhaDePagamentoVoucher() {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    created_at: "",
    data_pagamento: "",
    status_aprovado: " ",
    documento: "",
    descricao: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      created_at: "",
      data_pagamento: "",
      status_aprovado: " ",
      documento: "",
      descricao: "",
    });
  };

  const filters = `created_at=${filter.created_at}&data_pagamento=${filter.data_pagamento}&status_aprovado=${filter.status_aprovado}&documento=${filter.documento}&descricao=${filter.descricao}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getPagamentosVoucher(token, page, "", filters);
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

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Pagamentos de Voucher"
          arquivosLote
          routeForGestao={"voucher"}
        />

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
                }}
              >
                <Box style={{ margin: "30px" }}>
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

                    {/* <Grid item xs={12} sm={4}>
                  <Select
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
                    <MenuItem value={"3"}>Cancelado</MenuItem>
                    <MenuItem value={"4"}>Error</MenuItem>
                  </Select>
                </Grid> */}

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

                    <TableHeaderButton
                      text="Limpar"
                      onClick={resetFilters}
                      color="red"
                    />

                    <ExportTableButtons
                      token={token}
                      path={"pagamento-aluguel"}
                      page={page}
                      filters={filters}
                    />
                  </Grid>
                </Box>

                <Box
                  style={{
                    width: "100%",
                    borderTopRightRadius: 27,
                    borderTopLeftRadius: 27,
                  }}
                >
                  {!loading && listaContas?.data && listaContas?.per_page ? (
                    <>
                      <Box minWidth={!matches ? "800px" : null}>
                        <TableContainer style={{ overflowX: "auto" }}>
                          <CustomTable
                            data={listaContas?.data}
                            columns={columns}
                            Editar={({ row }) => (
                              <MenuOptionsTable
                                row={row}
                                getData={getData}
                                printType={"pagamento_voucher"}
                                // deleteCallback={deletePagamentosVoucher}
                                navigateTo={{
                                  icon: ArrowRightRounded,
                                  path: generatePath(
                                    "/dashboard/folha-de-pagamento/acao/lista-folhas-de-pagamento-voucher/:subsectionId",
                                    {
                                      subsectionId: row?.id,
                                    },
                                  ),
                                }}
                              />
                            )}
                          />
                        </TableContainer>
                      </Box>
                      <Box alignSelf="flex-end" marginTop="8px">
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={listaContas?.last_page}
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
  );
}
