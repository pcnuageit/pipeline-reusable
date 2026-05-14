/* eslint-disable no-lone-blocks */

import "../../../fonts/Montserrat-SemiBold.otf";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Grid,
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
import { Print } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useCallback, useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import {
  generatePath,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";

import { loadPermissao, postAuthMeAction } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import { getPagamentoPix } from "../../../services/services";
import { documentMask } from "../../../utils/documentMask";

import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import {
  ExportTableButtons,
  TableHeaderButton,
} from "../../../components/TableHeaderButtons";

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
    marginTop: "16px",
    marginBottom: "16px",
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
}));

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const date = new Date(data);
      const formatted = date.toLocaleDateString("pt-br");
      return (
        <>
          <Typography align="center"> {formatted}</Typography>
          <Typography align="center">
            {moment.utc(data).format("HH:mm:ss")}
          </Typography>
        </>
      );
    },
  },
  {
    headerText: "Nome",
    key: "nome_recebedor",
  },
  {
    headerText: "Documento",
    key: "documento_recebedor",
    CustomValue: (value) => <Typography>{documentMask(value)}</Typography>,
  },
  {
    headerText: "E-mail",
    key: "conta.email",
    CustomValue: (value) => <Typography>{value}</Typography>,
  },
  {
    headerText: "Status",
    key: "status",
    CustomValue: (value) => {
      if (value === "Created") {
        return (
          <Typography
            style={{
              color: "orange",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pendente
          </Typography>
        );
      }
      if (value === "CanBeRegister") {
        return (
          <Typography
            style={{
              color: "orange",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pendente
          </Typography>
        );
      }
      if (value === "pending") {
        return (
          <Typography
            style={{
              color: "orange",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pendente
          </Typography>
        );
      }
      if (value === "sent") {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Concluído
          </Typography>
        );
      }
      if (value === "succeeded") {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Pago
          </Typography>
        );
      }
      if (value === "received") {
        return (
          <Typography
            style={{
              color: "green",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Concluído
          </Typography>
        );
      }
      if (value === "rejected") {
        return (
          <Typography
            style={{
              color: "red",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Rejeitado
          </Typography>
        );
      }
      if (value === "Cancel") {
        return (
          <Typography
            style={{
              color: "blue",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Estornado
          </Typography>
        );
      }
      if (value === "Error") {
        return (
          <Typography
            style={{
              color: "red",
              fontWeight: "bold",
              borderRadius: "27px",
            }}
          >
            Erro
          </Typography>
        );
      }
    },
  },
  {
    headerText: "Tipo",
    key: "tipo",
    CustomValue: (value) => <Typography>{value}</Typography>,
  },

  {
    headerText: "Situação",
    key: "response",
    CustomValue: (response) => {
      return response ? (
        <Typography
          style={{
            borderRadius: "27px",
          }}
        >
          Registrado
        </Typography>
      ) : !response ? (
        <Typography
          style={{
            borderRadius: "27px",
          }}
        >
          Falha
        </Typography>
      ) : null;
    },
  },

  {
    headerText: "Valor",
    key: "valor",
    CustomValue: (valor) => {
      return (
        <>
          R${" "}
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
  // {
  //   headerText: "Destino",
  //   key: "",
  //   FullObject: (value) => {
  //     return (
  //       <Box>
  //         <Typography align="center">
  //           <b>{value?.nome_recebedor}</b>
  //         </Typography>
  //         <Typography align="center">{value?.documento_recebedor}</Typography>
  //       </Box>
  //     );
  //   },
  // },
  {
    headerText: "Dados Pix",
    key: "chave_recebedor",
    CustomValue: (value) => <p>{value}</p>,
  },
  {
    headerText: "Tipo Pix",
    key: "tipo_pix",
    CustomValue: (value) => <p>{value}</p>,
  },
  {
    headerText: "Id da transação",
    key: "id",
    CustomValue: (value) => (
      <Typography style={{ lineBreak: "anywhere" }}>{value}</Typography>
    ),
  },
  {
    headerText: "Descrição",
    key: "descricao",
    CustomValue: (descricao) => {
      return (
        <Tooltip title={descricao ? descricao : "Sem descrição"}>
          <Box>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Box>
        </Tooltip>
      );
    },
  },
  {
    headerText: "Aprovação",
    key: "aprovado",
    CustomValue: (value) => {
      return value === true ? (
        <Tooltip title="Transação Aprovada">
          <CheckIcon style={{ color: "green" }} value />
        </Tooltip>
      ) : value === false ? (
        <Tooltip title="Transação Não Aprovada">
          <ClearIcon style={{ color: "red" }} value />
        </Tooltip>
      ) : null;
    },
  },
  {
    headerText: "",
    key: "menu",
  },
];

const ListaTransacaoPix = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const me = useSelector((state) => state.me);
  const userPermissao = useSelector((state) => state.userPermissao);
  const id = useParams()?.id ?? "";
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const token = useAuth();
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    cnpj: "",
    documento_beneficiario: "",
    email: "",
    id: "",
    status: " ",
    data_inicial: "",
    data_final: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [, setPermissoes] = useState([]);
  const [pagamentoPix, setPagamentoPix] = useState([]);

  const resetFilter = () =>
    setFilter({
      nome: "",
      documento: "",
      cnpj: "",
      documento_beneficiario: "",
      email: "",
      id: "",
      status: " ",
      data_inicial: "",
      data_final: "",
      mostrar: "15",
    });

  const filters = `nome=${debouncedFilter.nome}&documento=${debouncedFilter.documento}&cnpj=${debouncedFilter.cnpj}&email=${debouncedFilter.email}&documento_beneficiario=${debouncedFilter.documento_beneficiario}&id=${debouncedFilter.id}&status=${debouncedFilter.status}&data_inicial=${debouncedFilter.data_inicial}&data_final=${debouncedFilter.data_final}&tipo_beneficio_id=${id}&mostrar=${debouncedFilter.mostrar}`;

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await getPagamentoPix(token, page, filters);
      setPagamentoPix(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getDataCallback = useCallback(getData, [token, page, filters]);

  useEffect(() => {
    getDataCallback();
  }, [getDataCallback, debouncedFilter]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (me.id !== undefined) {
      dispatch(loadPermissao(token, me.id));
    }
  }, [dispatch, me.id, token]);

  useEffect(() => {
    const { permissao } = userPermissao;
    setPermissoes(permissao.map((item) => item.tipo));
  }, [userPermissao]);

  const Editar = ({ row }) => {
    const redirectPrintFolha = () => {
      const path = generatePath(`/dashboard/print/:id??type=comprovante_pix`, {
        id: row?.id,
      });

      const newWindow = window.open(path, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    };

    return (
      <Print
        onClick={redirectPrintFolha}
        style={{ color: APP_CONFIG.mainCollors.primary }}
      />
    );
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Pagamentos Agendados" />

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
                borderRadius: "17px",
                flexDirection: "column",
                width: "100%",
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
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                            pattern: "d {4}- d {2}- d {2} ",
                          }}
                          type="date"
                          label="Data de criação inicial"
                          value={filter.data_inicial}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              data_inicial: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            color: APP_CONFIG.mainCollors.secondary,
                            shrink: true,
                            pattern: "d {4}- d {2}- d {2} ",
                          }}
                          type="date"
                          label="Data de criação final"
                          value={filter.data_final}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              data_final: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <InputLabel id="status_label" shrink="true">
                          Status
                        </InputLabel>
                        <Select
                          labelId="status_label"
                          variant="outlined"
                          fullWidth
                          value={filter.status}
                          onChange={(e) =>
                            setFilter({ ...filter, status: e.target.value })
                          }
                        >
                          <MenuItem value={" "}>Todos</MenuItem>
                          <MenuItem value={"pending"}>Pendente</MenuItem>
                          <MenuItem value={"succeeded"}>Pago</MenuItem>
                          {/* <MenuItem value={"received"}>Concluído</MenuItem>   */}
                          <MenuItem value={"sent"}>Concluído</MenuItem>
                          <MenuItem value={"rejected"}>Estornado</MenuItem>
                          <MenuItem value={"Error"}>Error</MenuItem>
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

                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          placeholder="Pesquisar por nome ou razão social"
                          size="small"
                          variant="outlined"
                          style={{
                            marginRight: "10px",
                          }}
                          value={filter.nome}
                          onChange={(e) => {
                            setPage(1);
                            setFilter({
                              ...filter,
                              nome: e.target.value,
                            });
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <ReactInputMask
                          mask={"999.999.999-99"}
                          value={filter.documento}
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
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              placeholder="Pesquisar por CPF"
                              size="small"
                              style={{
                                marginRight: "10px",
                              }}
                            />
                          )}
                        </ReactInputMask>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <ReactInputMask
                          mask={"99.999.999/9999-99"}
                          value={filter.cnpj}
                          onChange={(e) => {
                            setPage(1);
                            setFilter({
                              ...filter,
                              cnpj: e.target.value,
                            });
                          }}
                        >
                          {() => (
                            <TextField
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              placeholder="Pesquisar por CNPJ"
                              size="small"
                              style={{
                                marginRight: "10px",
                              }}
                            />
                          )}
                        </ReactInputMask>
                      </Grid>

                      {/* <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por ID"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.id}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      id: e.target.value,
                    });
                  }}
                />
              </Grid> */}

                      <Grid item xs={12} sm={3}>
                        <ReactInputMask
                          mask={"999.999.999-99"}
                          value={filter.documento_beneficiario}
                          onChange={(e) => {
                            setPage(1);
                            setFilter({
                              ...filter,
                              documento_beneficiario: e.target.value,
                            });
                          }}
                        >
                          {() => (
                            <TextField
                              fullWidth
                              placeholder="Pesquisar por beneficiário"
                              size="small"
                              variant="outlined"
                              style={{
                                marginRight: "10px",
                              }}
                            />
                          )}
                        </ReactInputMask>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          placeholder="Pesquisar por E-mail"
                          size="small"
                          variant="outlined"
                          style={{
                            marginRight: "10px",
                          }}
                          value={filter.email}
                          onChange={(e) => {
                            setPage(1);
                            setFilter({
                              ...filter,
                              email: e.target.value,
                            });
                          }}
                        />
                      </Grid>

                      <TableHeaderButton
                        Icon={DeleteIcon}
                        color="red"
                        text="Limpar"
                        onClick={resetFilter}
                      />

                      <ExportTableButtons
                        token={token}
                        apiPath={"pagamento-pix"}
                        page={page}
                        filters={filters}
                      />
                    </Grid>
                  </Box>
                </Box>

                <Box className={classes.tableContainer}>
                  {!loading && pagamentoPix.data && pagamentoPix.per_page ? (
                    <Box minWidth={!matches ? "800px" : null}>
                      <TableContainer style={{ overflowX: "auto" }}>
                        <CustomTable
                          columns={columns ? columns : null}
                          data={pagamentoPix.data}
                          Editar={Editar}
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
                      count={pagamentoPix.last_page}
                      onChange={(e, value) => setPage(value)}
                      page={page}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ListaTransacaoPix;
