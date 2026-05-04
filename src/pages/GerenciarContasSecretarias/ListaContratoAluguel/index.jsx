import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
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
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Check, Edit, Refresh } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Delete } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import ReactInputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import {
  generatePath,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

import { loadUserData } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  deleteContratoAluguel,
  getContratosAluguel,
  postContratosAluguel,
  updateContratosAluguel,
  updateStatusContratoAluguel,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";

import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import SelectCidade from "../../../components/SelectCidade";
import TableHeaderButton from "../../../components/TableHeaderButton";
import { documentMask } from "../../../utils/documentMask";
import pixKeyType from "../../../utils/pixKeyType";

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

// const startDate = moment().startOf("month").format("YYYY-MM-DD");
// const endDate = moment().endOf("month").format("YYYY-MM-DD");

export default function ListaContratoAluguel() {
  const token = useAuth();
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [showNovaContaModal, setShowNovaContaModal] = useState(false);
  const [lista, setLista] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    data_inicio: "",
    data_fim: "",
    tipoData: 1,
    documento_locador: "",
    documento_beneficiario: "",
    documento_terceiro: "",
    cidade: "",
    status: " ",
    chave_pix: "",
    tipo_chave_pix: " ",
  });
  const debouncedFilters = useDebounce(filter, 800);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      data_inicio: "",
      data_fim: "",
      tipoData: 1,
      documento_locador: "",
      documento_beneficiario: "",
      documento_terceiro: "",
      cidade: "",
      status: " ",
      chave_pix: "",
      tipo_chave_pix: " ",
    });
  };

  const filters = `conta_id=${id}&data_inicio=${filter.data_inicio}&data_fim=${filter.data_fim}&tipoData=${filter.tipoData}&documento_locador=${filter.documento_locador}&documento_beneficiario=${filter.documento_beneficiario}&documento_terceiro=${filter.documento_terceiro}&cidade=${filter.cidade}&status=${filter.status}&chave_pix=${filter.chave_pix}&tipo_chave_pix=${filter.tipo_chave_pix}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getContratosAluguel(token, id, page, filters);
      setLista(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [dispatch, token, page, debouncedFilters]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [dispatch, token]);

  const columns = [
    // {
    //   headerText: "",
    //   key: "id",
    //   CustomValue: (id) => {
    //     return (
    //       <>
    //         <Box>
    //           <Checkbox
    //             color="primary"
    //             checked={registros.includes(id)}
    //             onChange={() => {
    //               if (registros.includes(id)) {
    //                 setRegistros(registros.filter((item) => item !== id));
    //               } else {
    //                 setRegistros([...registros, id]);
    //               }
    //             }}
    //           />
    //         </Box>
    //       </>
    //     );
    //   },
    // },
    {
      headerText: "BENEFICIÁRIO",
      key: "locatario.user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "LOCADOR",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "TERCEIRO",
      key: "documento_conta",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "CIDADE",
      key: "locatario.user.concorrencia_endereco.cidade",
    },
    {
      headerText: "TIPO",
      key: "tipo_transacao",
      CustomValue: (tipo) => (tipo === "Dict" ? "Pix" : "Manual"),
    },
    {
      headerText: "TIPO DE CHAVE PIX",
      key: "",
      FullObject: (data) => {
        if (data?.tipo_transacao === "Manual") {
          return <Typography>-</Typography>;
        } else {
          return <Typography>{pixKeyType(data?.chave_pix)}</Typography>;
        }
      },
    },
    {
      headerText: "DADOS",
      key: "",
      FullObject: (data) =>
        data?.chave_pix ||
        `${data?.banco} ${data?.agencia} ${data?.conta_sem_digito}-${data?.digito_conta}`,
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
      headerText: "Valor disponível",
      key: "valor_disponivel",
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
      headerText: "Valor utilizado",
      key: "valor_utilizado",
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
      headerText: "Saldo remanescente",
      key: "saldo_remanescente",
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
          {moment.utc(data?.data_inicio).format("DD/MM/YY")} a{" "}
          {moment.utc(data?.data_fim).format("DD/MM/YY")}
        </>
      ),
    },
    { headerText: "STATUS", key: "status" },
    { headerText: "", key: "menu" },
  ];

  const Editar = ({ row }) => {
    const [showEditarStatusModal, setShowEditarStatusModal] = useState(false);
    const [showEditarContaModal, setShowEditarContaModal] = useState(false);
    const [showDeletarModal, setShowDeletarModal] = useState(false);

    return (
      <Box style={{ display: "flex", flexDirection: "row" }}>
        {row?.status === "pendente" ? (
          <>
            <Tooltip title="Aprovar ou recusar contrato">
              <Check
                style={{
                  color: APP_CONFIG.mainCollors.primary,
                }}
                onClick={() => setShowEditarStatusModal(true)}
              />
            </Tooltip>
          </>
        ) : null}

        <Edit
          style={{
            color: APP_CONFIG.mainCollors.primary,
          }}
          onClick={() => setShowEditarContaModal(true)}
        />

        <MenuOptionsTable sendSMS={row} />

        <Delete
          style={{
            color: "#ED757D",
          }}
          onClick={() => setShowDeletarModal(true)}
        />

        <ContaModal
          show={showEditarContaModal}
          setShow={setShowEditarContaModal}
          getData={getData}
          data={row}
          update
        />
        <EditarStatusModal
          show={showEditarStatusModal}
          setShow={setShowEditarStatusModal}
          getData={getData}
          data={row}
        />
        <DeletarModal
          show={showDeletarModal}
          setShow={setShowDeletarModal}
          getData={getData}
          data={row}
        />
      </Box>
    );
  };

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
            Contrato Aluguel
          </Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <Refresh />
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
                <Select
                  variant="outlined"
                  fullWidth
                  required
                  value={filter.tipoData}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      tipoData: e.target.value,
                    }));
                  }}
                >
                  <MenuItem value={1}>
                    Pesquisar por data de fechamento
                  </MenuItem>
                  <MenuItem value={2}>
                    Pesquisar por data de vencimento
                  </MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  label="Data inicial"
                  value={filter.data_inicio}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      data_inicio: e.target.value,
                    }));
                  }}
                //defaultValue={startDate}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  label="Data final"
                  value={filter.data_fim}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      data_fim: e.target.value,
                    }));
                  }}
                //defaultValue={endDate}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por documento do beneficiário"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.documento_beneficiario}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      documento_beneficiario: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por documento do locador"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
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
                  placeholder="Pesquisar por documento de terceiro"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filter.documento_terceiro}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      documento_terceiro: e.target.value,
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
                <InputLabel id="status-label" shrink="true">
                  Status
                </InputLabel>
                <Select
                  labelId="status-label"
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
                  <MenuItem value={"pendente"}>Pendente</MenuItem>
                  <MenuItem value={"aprovado"}>Aprovado</MenuItem>
                  <MenuItem value={"reprovado"}>Reprovado</MenuItem>
                  <MenuItem value={"excluido"}>Excluído</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={"Chave Pix"}
                  value={filter.chave_pix}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      chave_pix: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <InputLabel id="pix-type-label" shrink="true">
                  Tipo de transferência
                </InputLabel>
                <Select
                  fullWidth
                  variant="outlined"
                  label={"Tipo de Chave Pix"}
                  labelId="pix-type-label"
                  value={filter.tipo_chave_pix}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      tipo_chave_pix: e.target.value,
                    }));
                  }}
                >
                  <MenuItem value={" "}>Todos</MenuItem>
                  {/* <MenuItem value={"Emv"}>Emv</MenuItem> */}
                  <MenuItem value={"Dict"}>Pix</MenuItem>
                  <MenuItem value={"Manual"}>Manual</MenuItem>
                </Select>
              </Grid>

              <TableHeaderButton
                text="Limpar"
                color="red"
                onClick={resetFilters}
              />

              <ExportTableButtons
                token={token}
                path={"contrato-aluguel"}
                page={page}
                filters={filters}
              />

              {id ? (
                <>
                  <TableHeaderButton
                    text="Arquivos em lote"
                    onClick={() => {
                      const path = generatePath(
                        "lista-arquivos-de-lote?type=contrato_aluguel",
                      );
                      history.push(path);
                    }}
                    Icon={Add}
                  />

                  <TableHeaderButton
                    text="Arquivos em lote"
                    onClick={() => {
                      const path = generatePath(
                        "lista-arquivos-de-lote?type=contrato_aluguel_excluir",
                      );
                      history.push(path);
                    }}
                    Icon={Delete}
                    color="red"
                  />
                </>
              ) : null}
            </Grid>
          </Box>
        </Box>

        <Box className={classes.tableContainer}>
          {!loading && lista.data && lista.per_page ? (
            <>
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={lista.data}
                    Editar={Editar}
                  />
                </TableContainer>
              </Box>

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

      <ContaModal
        show={showNovaContaModal}
        setShow={setShowNovaContaModal}
        getData={getData}
        tipo_beneficio_id={id}
      />
    </Box>
  );
}

const ContaModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
  tipo_beneficio_id = "",
  update = false,
}) => {
  const token = useAuth();
  const [conta, setConta] = useState({
    data_inicio: data?.data_inicio
      ? moment(data?.data_inicio).format("YYYY-MM-DD")
      : "",
    data_fim: data?.data_fim ? moment(data?.data_fim).format("YYYY-MM-DD") : "",
    documento: data?.documento ?? "",
    telefone: data?.telefone ?? "",
    valor:
      parseFloat(data?.valor).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) ?? 0,
    tipo_transacao: data?.tipo_transacao ?? "Dict", // Manual || Dict
    nome: data?.nome ?? "",
    agencia: data?.agencia ?? "",
    conta: data?.conta ?? "",
    banco: data?.banco ?? "",
    chave_pix: data?.chave_pix ?? "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
    if (!update) {
      setConta({});
    }
  };

  const handleCriarBeneficiario = async (e) => {
    const params = {
      data_inicio: conta?.data_inicio,
      data_fim: conta?.data_fim,
      documento: conta?.documento,
      telefone: conta?.telefone,
      valor: conta?.valor,
      tipo_transacao: conta?.tipo_transacao,
      ...(conta?.tipo_transacao === "Manual"
        ? {
          nome: conta?.nome,
          agencia: conta?.agencia,
          conta: conta?.conta,
          banco: conta?.banco,
        }
        : { chave_pix: conta?.chave_pix }),
    };

    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      if (update) {
        await updateContratosAluguel(token, data?.id, params);
      } else {
        await postContratosAluguel(token, tipo_beneficio_id, params);
      }
      getData();
      handleClose();
    } catch (err) {
      console.log(err);
      setErrors(err?.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">
        {update ? "Editar" : "Cadastrar"} contrato
      </DialogTitle>
      <form onSubmit={handleCriarBeneficiario}>
        <DialogContent style={{ overflow: "hidden" }}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
                }}
                type="date"
                label="Data inicial"
                value={conta.data_inicio}
                onChange={(e) => {
                  setConta((prev) => ({
                    ...prev,
                    data_inicio: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
                }}
                type="date"
                label="Data final"
                value={conta.data_fim}
                onChange={(e) => {
                  setConta((prev) => ({
                    ...prev,
                    data_fim: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <ReactInputMask
                mask={"999.999.999-99"}
                value={conta?.documento}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    documento: e.target.value,
                  }))
                }
              >
                {() => (
                  <TextField
                    label={"Documento"}
                    error={errors?.["documento"]}
                    helperText={
                      errors?.["documento"]
                        ? errors?.["documento"]?.join(" ")
                        : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                )}
              </ReactInputMask>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Telefone"}
                value={conta?.telefone}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    telefone: e.target.value,
                  }))
                }
                error={errors?.["telefone"]}
                helperText={
                  errors?.["telefone"] ? errors?.["telefone"]?.join(" ") : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                fullWidth
                variant="outlined"
                value={conta?.tipo_transacao}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    tipo_transacao: e.target.value,
                  }))
                }
              >
                <MenuItem value={"Dict"}>Dict</MenuItem>
                <MenuItem value={"Manual"}>Manual</MenuItem>
              </Select>
            </Grid>

            {conta?.tipo_transacao === "Dict" ? (
              <Grid item xs={12}>
                <TextField
                  label={"Chave Pix"}
                  value={conta?.chave_pix}
                  onChange={(e) =>
                    setConta((prev) => ({
                      ...prev,
                      chave_pix: e.target.value,
                    }))
                  }
                  error={errors?.["chave_pix"]}
                  helperText={
                    errors?.["chave_pix"] ? errors?.["chave_pix"]?.join(" ") : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    label={"Nome"}
                    value={conta?.nome}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        nome: e.target.value,
                      }))
                    }
                    error={errors?.["nome"]}
                    helperText={
                      errors?.["nome"] ? errors?.["nome"]?.join(" ") : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label={"Agência"}
                    value={conta?.agencia}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        agencia: e.target.value,
                      }))
                    }
                    error={errors?.["agencia"]}
                    helperText={
                      errors?.["agencia"] ? errors?.["agencia"]?.join(" ") : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label={"Conta"}
                    value={conta?.conta}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        conta: e.target.value,
                      }))
                    }
                    error={errors?.["conta"]}
                    helperText={
                      errors?.["conta"] ? errors?.["conta"]?.join(" ") : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label={"Banco"}
                    value={conta?.banco}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        banco: e.target.value,
                      }))
                    }
                    error={errors?.["banco"]}
                    helperText={
                      errors?.["banco"] ? errors?.["banco"]?.join(" ") : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <CurrencyInput
                style={{
                  height: 40,
                  fontSize: 20,
                  border: "none",
                  backgroundColor: "transparent",
                  fontFamily: "Montserrat-Regular",
                }}
                prefix="R$"
                decimalSeparator=","
                thousandSeparator="."
                value={conta?.valor}
                onChange={(e, v) =>
                  setConta((prev) => ({
                    ...prev,
                    valor: v,
                  }))
                }
              />
              {errors?.valor ? (
                <FormHelperText
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    fontFamily: "Montserrat-ExtraBold",
                    color: "red",
                  }}
                >
                  {errors?.valor.join(" ")}
                </FormHelperText>
              ) : null}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Enviar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const DeletarModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
}) => {
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleDeletar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteContratoAluguel(token, data?.id);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel deletar o contrato. Tente novamente.",
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">Excluir contrato</DialogTitle>
      <form onSubmit={handleDeletar}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de excluir o contrato:
          </DialogContentText>
          <DialogContentText>
            {data?.documento}
            <br />
            {data?.tipo_transacao}
            <br />
            R${" "}
            {parseFloat(data?.valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <br />
            {data?.status}
          </DialogContentText>
          <DialogContentText>Essa ação é irreversível.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Excluir
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const EditarStatusModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
}) => {
  const token = useAuth();
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleUpdate = async (status) => {
    setLoading(true);
    try {
      await updateStatusContratoAluguel(
        token,
        data?.id,
        status, // "pendente" "reprovado" "aprovado"
      );
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel alterar o contrato. Tente novamente.",
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">
        Alterar status do contrato
      </DialogTitle>

      <DialogContent style={{ overflow: "hidden" }}>
        <DialogContentText>
          Você gostaria de{" "}
          {data?.status === "aprovado" ? "reprovar" : "aprovar"} o contrato?
        </DialogContentText>
        <DialogContentText>
          {data?.documento}
          <br />
          {data?.tipo_transacao}
          <br />
          R${" "}
          {parseFloat(data?.valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          <br />
          {data?.status}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        {data?.status === "reprovado" ? null : (
          <Button color="primary" onClick={() => handleUpdate("reprovado")}>
            Reprovar
          </Button>
        )}

        {data?.status === "aprovado" ? null : (
          <Button color="primary" onClick={() => handleUpdate("aprovado")}>
            Aprovar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
