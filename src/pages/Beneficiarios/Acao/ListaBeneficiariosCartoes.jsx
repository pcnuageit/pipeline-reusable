import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check, Close, Delete, ListAlt } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  deleteCartao,
  getCartoes,
  postAddCartao,
  postCartoesTrocarStatus,
  postSegundaViaCriar,
} from "../../../services/beneficiarios";
import { documentMask } from "../../../utils/documentMask";

import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import SelectCidade from "../../../components/SelectCidade";
import SelectSegundaViaMotivo from "../../../components/SelectSegundaViaMotivo";
import ExportTableButtons from "../../../components/TableHeaderButtons/ExportTableButtons";
import TableHeaderButton from "../../../components/TableHeaderButtons/TableHeaderButton";
import usePermission from "../../../hooks/usePermission";

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
  dropzoneAreaBaseClasses: {
    width: "70%",
    height: "250px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
  },
  dropzoneContainer: {
    margin: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px",
    minHeight: "422px",
    fontSize: "12px",
  },
  textoDropzone: {
    fontSize: "1.2rem",
    color: APP_CONFIG.mainCollors.primary,
  },
}));

const CartaoModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
  tipo_beneficio_id = "",
  update = false,
}) => {
  const token = useAuth();
  const [conta, setConta] = useState({
    documento: data?.user?.documento,
    data_solicitacao: "",
    // vlSaldo: data?.user?.concorrencia_saldo?.valor?.replace(/\./g, ",") ?? 0.0,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);

    if (!update) {
      setConta({
        documento: "",
        // cdCartao: "",
        // externoMsk: "",
        // vlSaldo: 0.0,
      });
    }
  };

  const handleCriarCartao = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      if (update) {
        // await putUpdateCartao(token, data?.id, conta);
        return;
      } else {
        await postAddCartao(token, tipo_beneficio_id, conta);
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
        {update ? "Editar" : "Cadastrar"} cartão
      </DialogTitle>
      <form onSubmit={handleCriarCartao}>
        <DialogContent style={{ overflow: "hidden" }}>
          <Grid container spacing={4}>
            {/* <Grid item xs={12}>
              <InputLabel
                style={{
                  color: "#15191E",
                  transform: "translate(14px) scale(0.8)",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                Saldo
              </InputLabel>
              <CurrencyInput
                style={{
                  height: 40,
                  fontSize: 20,
                  border: "none",
                  color: "rgba(0, 0, 0, 0.87)",
                  backgroundColor: "transparent",
                  fontFamily: "Montserrat-Regular",
                }}
                prefix="R$"
                decimalSeparator=","
                thousandSeparator="."
                value={conta.vlSaldo}
                onChange={(e, value) => {
                  setConta((prev) => ({
                    ...prev,
                    vlSaldo: value,
                  }));
                }}
              />
              {errors?.vlSaldo ? (
                <FormHelperText
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    fontFamily: "Montserrat-ExtraBold",
                    color: "red",
                  }}
                >
                  {errors?.vlSaldo?.join(" ")}
                </FormHelperText>
              ) : null}
            </Grid> */}

            <Grid item xs={12}>
              <ReactInputMask
                mask={"999.999.999-99"}
                value={conta.documento}
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
              <ReactInputMask
                mask={"99/99/9999"}
                value={conta.data_solicitacao}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    data_solicitacao: e.target.value,
                  }))
                }
              >
                {() => (
                  <TextField
                    label={"Data da solicitação"}
                    error={errors?.data_solicitacao}
                    helperText={
                      errors?.data_solicitacao
                        ? errors?.data_solicitacao?.join(" ")
                        : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                )}
              </ReactInputMask>
              <Typography style={{ fontSize: 14 }}>
                A data de solicitação deve ser em no mínimo 10 dias e deve ser
                um dia útil
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Município"}
                value={conta?.municipio}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    municipio: e.target.value,
                  }))
                }
                error={errors["municipio"]}
                helperText={
                  errors["municipio"] ? errors["municipio"]?.join(" ") : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
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

const DeletarCartaoModal = ({
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

  const handleDeletarCartao = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteCartao(token, data?.id);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel deletar o cartão. Tente novamente.",
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
      <DialogTitle id="form-dialog-title">Excluir cartão</DialogTitle>
      <form onSubmit={handleDeletarCartao}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de excluir o cartão:
          </DialogContentText>
          <DialogContentText>
            ID: {data?.external_id}
            <br />
            Final: {data?.external_msk?.replace(/\*/g, "")}
            <br />
            {data?.user?.nome}
            <br />
            {data?.user?.documento}
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

const MenuTable = ({ getData, row, hasPermission }) => {
  const [showEditarCartaoModal, setShowEditarCartaoModal] = useState(false);
  const [showDeletarCartaoModal, setShowDeletarCartaoModal] = useState(false);

  return (
    <Box>
      <Box style={{ display: "flex" }}>
        {hasPermission && (
          <DeleteForeverIcon
            onClick={() => {
              setShowDeletarCartaoModal(true);
            }}
            style={{
              fontSize: "25px",
              color: "#ED757D",
            }}
          />
        )}
      </Box>

      <CartaoModal
        show={showEditarCartaoModal}
        setShow={setShowEditarCartaoModal}
        getData={getData}
        data={row}
        update
      />
      <DeletarCartaoModal
        show={showDeletarCartaoModal}
        setShow={setShowDeletarCartaoModal}
        getData={getData}
        data={row}
      />
    </Box>
  );
};

export default function ListaCartoes() {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { id } = useParams();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(false);
  const [showCadastrarCartaoModal, setShowCadastrarCartaoModal] =
    useState(false);
  const [listaCartoes, setListaCartoes] = useState([]);
  const [showAlterarSelecionadosModal, setShowAlterarSelecionadosModal] =
    useState(false);
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    documento: "",
    status: " ",
    cidade: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      documento: "",
      status: " ",
      cidade: "",
      mostrar: "15",
    });
  };

  const filters = `tipo_beneficio_id=${id}&documento=${debouncedFilter.documento}&status=${debouncedFilter.status}&cidade=${debouncedFilter.cidade}&mostrar=${filter.mostrar}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getCartoes(token, page, "", filters);
      setListaCartoes(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [token, page, debouncedFilter]);

  const handleSelectAll = () => {
    const selected = listaCartoes?.data?.map((obj) => obj?.id);
    setRegistros(selected);
  };

  const CartaoButtons = [
    {
      text: "Arquivos em lote",
      callback: () => {
        const path = generatePath("lista-arquivos-de-lote?type=cartao");
        history.push(path);
      },
    },
    {
      text: "Novo cadastro",
      callback: () => setShowCadastrarCartaoModal(true),
      color: "horizontalGradient",
      icon: <AddIcon style={{ color: "white", marginRight: "10px" }} />,
    },
  ];

  const columns = [
    {
      headerText: "",
      key: "",
      FullObject: (obj) => {
        const checked = registros.some((item) => item === obj?.id);

        return (
          <>
            <Box>
              <Checkbox
                color="primary"
                checked={checked}
                onChange={() => {
                  if (checked) {
                    setRegistros(registros.filter((item) => item !== obj?.id));
                  } else {
                    console.log(obj.id);
                    setRegistros((prev) => [...prev, obj?.id]);
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
      CustomValue: (valor) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {valor || "Processando"}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "FINAL",
      key: "external_msk",
      CustomValue: (valor) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {valor ? valor?.replace(/\*/g, "") : "Processando"}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "SALDO",
      key: "concorrencia_saldo.valor",
      CustomValue: (valor) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              R${" "}
              {parseFloat(valor).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </>
        );
      },
    },
    { headerText: "STATUS", key: "status" },
    { headerText: "NOME", key: "user.nome" },
    {
      headerText: "CPF",
      key: "user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "CIDADE",
      key: "user.concorrencia_endereco.cidade",
    },

    { headerText: "", key: "menu" },
  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Cartões" customButtons={CartaoButtons} />

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
                <Box style={{ marginTop: "8px", margin: 30 }} display="flex">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <SelectCidade
                        state={filter?.cidade}
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
                      <InputLabel id="status_label" shrink="true">
                        Status
                      </InputLabel>
                      <Select
                        labelId="status_label"
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
                        <MenuItem value={"aguardando"}>Aguardando</MenuItem>
                        <MenuItem value={"ativo"}>Ativo</MenuItem>
                        <MenuItem value={"bloqueado"}>Bloqueado</MenuItem>
                        <MenuItem value={"bloqueado_tentativas"}>
                          Bloqueado tentativas
                        </MenuItem>
                        <MenuItem value={"bloqueio_administrativo"}>
                          Bloqueio administrativo
                        </MenuItem>
                        <MenuItem value={"pendente"}>Pendente</MenuItem>
                        <MenuItem value={"error_interno"}>
                          Erro interno
                        </MenuItem>
                        <MenuItem value={"error"}>Erro</MenuItem>
                        <MenuItem value={"cancelado"}>Cancelado</MenuItem>
                        <MenuItem value={"excluido"}>Excluído</MenuItem>
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

                    <Grid item xs={12} sm={6}>
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
                        maskChar={null}
                      >
                        {() => (
                          <TextField
                            fullWidth
                            placeholder="Pesquisar por beneficiário"
                            variant="outlined"
                          />
                        )}
                      </ReactInputMask>
                    </Grid>

                    <TableHeaderButton
                      text="Limpar"
                      onClick={resetFilters}
                      Icon={Delete}
                      color="red"
                    />

                    <TableHeaderButton
                      text="Selecionar todos"
                      onClick={handleSelectAll}
                      Icon={Check}
                    />

                    <TableHeaderButton
                      text="Atualizar status"
                      onClick={() => setShowAlterarSelecionadosModal("status")}
                    />

                    <TableHeaderButton
                      text="Solicitar segunda via"
                      onClick={() => {
                        if (registros.length === 0) {
                          toast.warning(
                            "Selecione algum cartão para continuar",
                          );
                          return;
                        }
                        setShowAlterarSelecionadosModal("segunda_via");
                      }}
                    />

                    <TableHeaderButton
                      text="Segunda via"
                      onClick={() => {
                        const path = generatePath(
                          "/dashboard/beneficiarios/:id/acao/lista-cartoes-segunda-via",
                          {
                            id,
                          },
                        );

                        history.push(path);
                      }}
                      Icon={ListAlt}
                    />

                    <ExportTableButtons
                      token={token}
                      path={"beneficiario/cartoes-privados"}
                      page={page}
                      filters={filters + `&tipo_beneficio_id=${id}`}
                    />
                  </Grid>
                </Box>

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
                    {!loading && listaCartoes.data && listaCartoes.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns}
                            data={listaCartoes.data}
                            Editar={(props) => (
                              <Box style={{ display: "flex" }}>
                                <MenuTable
                                  getData={getData}
                                  hasPermission={hasPermission()}
                                  {...props}
                                />
                                <MenuOptionsTable
                                  row={props?.row}
                                  getData={getData}
                                  hasPermission={hasPermission()}
                                  JSONResponse={props?.row?.response}
                                  blockUnblockCard
                                />
                              </Box>
                            )}
                          />
                        </Box>

                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={listaCartoes.last_page}
                            onChange={(e, v) => setPage(v)}
                            page={page}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <LinearProgress color="primary" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <CartaoModal
        show={showCadastrarCartaoModal}
        setShow={setShowCadastrarCartaoModal}
        getData={getData}
        tipo_beneficio_id={id}
      />

      <AlterarSelecionadosModal
        show={showAlterarSelecionadosModal}
        setShow={setShowAlterarSelecionadosModal}
        getData={getData}
        filters={filters}
        registros={registros}
        setRegistros={setRegistros}
      />
    </Box>
  );
}

function AlterarSelecionadosModal({
  show = false, // false, status, segunda_via
  setShow = () => null,
  getData = () => null,
  filters = "",
  registros = [],
  setRegistros = () => null,
}) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [novoStatus, setNovoStatus] = useState("aguardando"); //“aguardando” “bloqueado”.
  const [motivo, setMotivo] = useState({
    id: 0,
    nome: "",
    exigeDescricao: false,
    descricao: "",
  });
  const classes = useStyles();

  function handleClose() {
    setShow(false);
    setNovoStatus("aguardando");
    setMotivo({
      id: 0,
      nome: "",
      exigeDescricao: false,
      descricao: "", // Se exigeDescricao for true
    });
  }

  const message = () => {
    switch (show) {
      case "status":
        return "alterar o status";
      case "segunda_via":
        return "solicitar segunda via";
      default:
        return "erro";
    }
  };

  async function handleSubmit() {
    setLoading(true);
    try {
      if (show === "status") {
        await postCartoesTrocarStatus(
          token,
          "", //id comes from filters
          "", //all pages
          filters,
          novoStatus,
          registros,
        );
      }
      if (show === "segunda_via") {
        await postSegundaViaCriar(
          token,
          motivo?.id,
          registros,
          motivo?.descricao,
        );
      }
      toast.success(`Sucesso ao ${message()}!`);
      getData(token);
      setRegistros([]);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error(
        `Ocorreu um erro ao ${message()}. Tente novamente mais tarde`,
      );
    }
    setLoading(false);
  }

  function chooseText() {
    if (!registros?.length || registros?.length < 1)
      return `Você gostaria de ${message()} de todos os cartões filtrados?`;
    if (registros?.length === 1)
      return `Você gostaria de ${message()} de 1 cartão selecionado?`;
    if (registros?.length > 1)
      return `Você gostaria de ${message()} de ${
        registros?.length
      } cartões selecionados?`;
  }

  return (
    <Modal open={!!show} onClose={handleClose}>
      <Box className={classes.modal}>
        <Box className={classes.closeModalButton} onClick={handleClose}>
          <Close />
        </Box>

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
              textTransform: "initial",
            }}
          >
            {message().charAt(0).toLocaleUpperCase() + message().substring(1)}
          </Typography>

          <Typography style={{ marginBottom: "30px" }}>
            {chooseText()}
          </Typography>

          {show === "segunda_via" && (
            <SelectSegundaViaMotivo
              state={motivo}
              setState={(e) => setMotivo(e.target.value)}
            />
          )}
          {show === "segunda_via" && motivo.exigeDescricao && (
            <TextField
              fullWidth
              placeholder="Descrição"
              variant="outlined"
              value={motivo.descricao}
              onChange={(e) => {
                setMotivo((prev) => ({
                  ...prev,
                  descricao: e.target.value,
                }));
              }}
            />
          )}

          {show === "status" && (
            <>
              <InputLabel id="status-label" shrink="true">
                Novo status
              </InputLabel>
              <Select
                labelId="status-label"
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value)}
                variant="outlined"
                fullWidth
              >
                <MenuItem value={"aguardando"}>Aguardando</MenuItem>
                <MenuItem value={"bloqueado"}>Bloqueado</MenuItem>
              </Select>
            </>
          )}

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Continuar
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
