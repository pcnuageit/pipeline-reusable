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
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Check, Edit } from "@material-ui/icons";
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

import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import {
  ExportTableButtons,
  TableHeaderButton,
} from "../../../components/TableHeaderButtons";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";

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

const startDate = moment().startOf("month").format("YYYY-MM-DD");
const endDate = moment().endOf("month").format("YYYY-MM-DD");

export default function ListaContratoAluguel() {
  const token = useAuth();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [showNovaContaModal, setShowNovaContaModal] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [lista, setLista] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    data_inicio: startDate,
    data_fim: endDate,
    tipoData: 1,
    documento_locador: "",
    documento_beneficiario: "",
    documento_terceiro: "",
    mostrar: "15",
  });
  const debouncedFilters = useDebounce(filter, 800);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      data_inicio: startDate,
      data_fim: endDate,
      tipoData: 1,
      documento_locador: "",
      documento_beneficiario: "",
      documento_terceiro: "",
      mostrar: "15",
    });
  };

  const filters = `data_inicio=${filter.data_inicio}&data_fim=${filter.data_fim}&tipoData=${filter.tipoData}&documento_locador=${filter.documento_locador}&documento_beneficiario=${filter.documento_beneficiario}&documento_terceiro=${filter.documento_terceiro}&mostrar=${filter.mostrar}`;

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
      headerText: "TIPO",
      key: "tipo_transacao",
      CustomValue: (tipo) => (tipo === "Dict" ? "Pix" : "Manual"),
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
    const { hasPermission } = usePermission();
    const [showEditarStatusModal, setShowEditarStatusModal] = useState(false);
    const [showEditarContaModal, setShowEditarContaModal] = useState(false);
    const [showDeletarModal, setShowDeletarModal] = useState(false);

    return (
      <>
        {hasPermission() ? (
          <Box>
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

                <Edit
                  style={{
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                  onClick={() => setShowEditarContaModal(true)}
                />
              </>
            ) : null}

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
        ) : null}
      </>
    );
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Contrato de Aluguel"
          customButtons={[
            {
              text: "Arquivos em lote",
              callback: () => {
                const path = generatePath(
                  "lista-arquivos-de-lote?type=contrato_aluguel",
                );
                history.push(path);
              },
            },
            {
              callback: () => setShowNovaContaModal(true),
              icon: <Add style={{ color: "white", marginRight: "10px" }} />,
              text: "Novo contrato",
            },
          ]}
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
                        <Grid
                          container
                          spacing={3}
                          style={{ alignItems: "center", marginBottom: "8px" }}
                        >
                          <Grid item xs={12} sm={3}>
                            <InputLabel id="tipoData_label" shrink="true">
                              Pesquisar por data
                            </InputLabel>
                            <Select
                              labelId="tipoData_label"
                              t
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
                              <MenuItem value={1}>Fechamento</MenuItem>
                              <MenuItem value={2}>Vencimento</MenuItem>
                            </Select>
                          </Grid>

                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              InputLabelProps={{
                                shrink: true,
                                pattern: "d {4}- d {2}- d {2} ",
                              }}
                              type="date"
                              label="Data inicial"
                              value={filters.data_inicio}
                              onChange={(e) => {
                                setPage(1);
                                setFilter((prev) => ({
                                  ...prev,
                                  data_inicio: e.target.value,
                                }));
                              }}
                              defaultValue={startDate}
                            />
                          </Grid>

                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              InputLabelProps={{
                                shrink: true,
                                pattern: "d {4}- d {2}- d {2} ",
                              }}
                              type="date"
                              label="Data final"
                              value={filters.data_fim}
                              onChange={(e) => {
                                setPage(1);
                                setFilter((prev) => ({
                                  ...prev,
                                  data_fim: e.target.value,
                                }));
                              }}
                              defaultValue={endDate}
                            />
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

                          <TableHeaderButton
                            color="red"
                            text="Limpar"
                            onClick={resetFilters}
                          />

                          <ExportTableButtons
                            token={token}
                            path={"contrato-aluguel"}
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
                            Editar={Editar}
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
    documento_beneficiario: data?.locatario?.user?.documento ?? "",
    nome: data?.nome ?? "",
    documento: data?.documento ?? "",
    telefone: data?.telefone ?? "",
    data_inicio: data?.data_inicio
      ? moment(data?.data_inicio).format("YYYY-MM-DD")
      : "",
    data_fim: data?.data_fim ? moment(data?.data_fim).format("YYYY-MM-DD") : "",
    valor:
      parseFloat(data?.valor).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) ?? 0,
    tipo_transacao: data?.tipo_transacao ?? "Dict", // Manual || Dict
    is_terceiro_autorizado: data?.is_terceiro_autorizado ?? false,
    nome_conta: data?.nome_conta ?? "",
    documento_conta: data?.documento_conta ?? "",
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
      setConta({
        documento_beneficiario: "",
        nome: "",
        documento: "",
        telefone: "",
        data_inicio: "",
        data_fim: "",
        valor: 0,
        tipo_transacao: "Dict",
        is_terceiro_autorizado: false,
        nome_conta: "",
        documento_conta: "",
        agencia: "",
        conta: "",
        banco: "",
        chave_pix: "",
      });
    }
  };

  const handleCriarContrato = async (e) => {
    e.preventDefault();

    const startDateGreaterThanToday = new Date(conta?.data_inicio) > new Date();

    if (startDateGreaterThanToday) {
      setErrors({
        data_inicio: ["A data inicial não pode ser posterior ao dia de hoje"],
      });
      return;
    }

    const params = {
      documento_beneficiario: conta.documento_beneficiario,
      nome: conta.nome,
      documento: conta.documento,
      telefone: conta.telefone,
      data_inicio: conta.data_inicio,
      data_fim: conta.data_fim,
      is_terceiro_autorizado: conta.is_terceiro_autorizado,
      tipo_transacao: conta.tipo_transacao,
      ...(conta.tipo_transacao === "Dict"
        ? {
            // Pix
            chave_pix: conta.chave_pix,
          }
        : {
            // Manual
            agencia: conta.agencia,
            conta: conta.conta,
            banco: conta.banco,
          }),
      // Manual && Terceiro
      ...(conta.tipo_transacao === "Manual" && conta.is_terceiro_autorizado
        ? {
            nome_conta: conta.nome_conta,
            documento_conta: conta.documento_conta,
          }
        : {}),
      valor: conta.valor,
    };

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
      toast.error("Ocorreu um erro. Verifique os dados e tente novamente.");
      setErrors(err?.response?.data?.errors ?? {});
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
      <form onSubmit={handleCriarContrato}>
        <DialogContent style={{ overflow: "hidden" }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <ReactInputMask
                mask={"999.999.999-99"}
                value={conta?.documento_beneficiario}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    documento_beneficiario: e.target.value,
                  }))
                }
                disabled={update}
              >
                {() => (
                  <TextField
                    label={"Documento do beneficiário"}
                    error={errors?.documento_beneficiario}
                    helperText={
                      errors?.documento_beneficiario
                        ? errors?.documento_beneficiario?.join(" ")
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
                label={"Nome do locador"}
                value={conta?.nome}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    nome: e.target.value,
                  }))
                }
                error={errors?.nome}
                helperText={errors?.nome ? errors?.nome?.join(" ") : null}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <ReactInputMask
                mask={
                  conta?.documento?.length <= 14
                    ? "999.999.999-999"
                    : "99.999.999/9999-99"
                }
                maskChar=""
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
                    label={"Documento do locador"}
                    error={errors?.documento}
                    helperText={
                      errors?.documento ? errors?.documento?.join(" ") : null
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
                label={"Telefone do locador"}
                value={conta?.telefone}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    telefone: e.target.value,
                  }))
                }
                error={errors?.telefone}
                helperText={
                  errors?.telefone ? errors?.telefone?.join(" ") : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
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
                label="Data inicial"
                value={conta.data_inicio}
                onChange={(e) => {
                  setConta((prev) => ({
                    ...prev,
                    data_inicio: e.target.value,
                  }));
                }}
                error={errors?.data_inicio}
                helperText={
                  errors?.data_inicio ? errors?.data_inicio?.join(" ") : null
                }
                required
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
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Pagamento para terceiro?"
                fullWidth
                variant="outlined"
                value={conta?.is_terceiro_autorizado}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    is_terceiro_autorizado: e.target.value,
                  }))
                }
              >
                <MenuItem value={true}>Sim</MenuItem>
                <MenuItem value={false}>Não</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Tipo de transação"
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
              </TextField>
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
                  error={errors?.chave_pix}
                  helperText={
                    errors?.chave_pix ? errors?.chave_pix?.join(" ") : null
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
            ) : (
              <>
                {conta.is_terceiro_autorizado ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label={"Nome do recebedor"}
                        value={conta?.nome_conta}
                        onChange={(e) =>
                          setConta((prev) => ({
                            ...prev,
                            nome_conta: e.target.value,
                          }))
                        }
                        error={errors?.nome_conta}
                        helperText={
                          errors?.nome_conta
                            ? errors?.nome_conta?.join(" ")
                            : null
                        }
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label={"Documento do recebedor"}
                        value={conta?.documento_conta}
                        onChange={(e) =>
                          setConta((prev) => ({
                            ...prev,
                            documento_conta: e.target.value,
                          }))
                        }
                        error={errors?.documento_conta}
                        helperText={
                          errors?.documento_conta
                            ? errors?.documento_conta?.join(" ")
                            : null
                        }
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                      />
                    </Grid>
                  </>
                ) : null}

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
                    error={errors?.agencia}
                    helperText={
                      errors?.agencia ? errors?.agencia?.join(" ") : null
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
                    error={errors?.conta}
                    helperText={errors?.conta ? errors?.conta?.join(" ") : null}
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
                    error={errors?.banco}
                    helperText={errors?.banco ? errors?.banco?.join(" ") : null}
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
                  {errors?.valor?.join(" ")}
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
