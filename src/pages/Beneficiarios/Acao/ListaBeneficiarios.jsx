import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { Delete, DeleteForever, Edit } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import { Handshake, ViewList } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { loadUserData } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  deleteBeneficiario,
  getBeneficiarios,
  getExportTable,
  getTransacaoVoucherBeneficiario,
  postAddBeneficiario,
  putUpdateBeneficiario,
} from "../../../services/beneficiarios";
import { getCep } from "../../../services/services";

import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import SelectBeneficio from "../../../components/SelectBeneficio";
import SelectCidade from "../../../components/SelectCidade";
import TableHeaderButton from "../../../components/TableHeaderButtons/TableHeaderButton";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";
import { phoneMask } from "../../../utils/phoneMask";

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

const parseProgramas = (data) => {
  let programas = "";

  data?.concorrencia_cartao.forEach((obj) => {
    const beneficio = obj?.tipo_beneficio?.nome_beneficio;
    if (beneficio) programas += beneficio + "\n";
  });
  data?.concorrencia_conta.forEach((obj) => {
    const beneficio = obj?.tipo_beneficio?.nome_beneficio;
    if (beneficio) programas += beneficio + "\n";
  });

  return programas;
};

const columns = [
  { headerText: "NOME", key: "nome" },
  { headerText: "EMAIL", key: "email" },
  {
    headerText: "CPF",
    key: "documento",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
  {
    headerText: "CELULAR",
    key: "celular",
    CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
  },
  { headerText: "CIDADE", key: "concorrencia_endereco.cidade" },
  {
    headerText: "BENEFÍCIOS",
    key: "",
    FullObject: (data) => (
      <Typography style={{ whiteSpace: "pre-line" }}>
        {parseProgramas(data)}
      </Typography>
    ),
  },
  // {
  //   headerText: "SALDO",
  //   key: "concorrencia_saldo.valor",
  //   CustomValue: (valor) => {
  //     return (
  //       <>
  //         <Typography
  //           style={{
  //             fontFamily: "Montserrat-Regular",
  //             fontSize: "15px",
  //             color: APP_CONFIG.mainCollors.primary,
  //           }}
  //         >
  //           R${" "}
  //           {parseFloat(valor).toLocaleString("pt-br", {
  //             minimumFractionDigits: 2,
  //             maximumFractionDigits: 2,
  //           })}
  //         </Typography>
  //       </>
  //     );
  //   },
  // },
  { headerText: "", key: "menu" },
];

const BeneficiarioModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
  tipo_beneficio_id = "",
  update = false,
}) => {
  const token = useAuth();
  const [conta, setConta] = useState({
    beneficiario: {
      nome: data?.nome,
      email: data?.email,
      data_nascimento: data?.data_nascimento
        ? moment(data.data_nascimento, "YYYY-MM-DD").format("DD/MM/YYYY")
        : "",
      documento: data?.documento,
      celular: data?.celular,
    },
    endereco: {
      cep: data?.concorrencia_endereco?.cep,
      rua: data?.concorrencia_endereco?.rua,
      numero: data?.concorrencia_endereco?.numero,
      complemento: data?.concorrencia_endereco?.complemento,
      bairro: data?.concorrencia_endereco?.bairro,
      cidade: data?.concorrencia_endereco?.cidade,
      estado: data?.concorrencia_endereco?.estado,
    },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
    if (!update) {
      setConta({ beneficiario: {}, endereco: {} });
    }
  };

  const handleCep = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({
      ...prev,
      "endereco.cep": null,
    }));

    try {
      const response = await getCep(e.target.value);
      setConta((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          rua: response.data.logradouro,
          complemento: response.data.complemento,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          estado: response.data.uf,
        },
      }));
    } catch (err) {
      console.log(err);
      setErrors((prev) => ({
        ...prev,
        "endereco.cep": ["Erro ao buscar dados do CEP"],
      }));
    }
  };

  const handleCriarBeneficiario = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      if (update) {
        await putUpdateBeneficiario(token, data?.id, conta);
      } else {
        await postAddBeneficiario(token, tipo_beneficio_id, conta);
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
        {update ? "Editar" : "Cadastrar"} beneficiário
      </DialogTitle>
      <form onSubmit={handleCriarBeneficiario}>
        <DialogContent style={{ overflow: "hidden" }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                label={"Nome completo"}
                value={conta?.beneficiario?.nome}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      nome: e.target.value,
                    },
                  }))
                }
                error={errors["beneficiario.nome"]}
                helperText={
                  errors["beneficiario.nome"]
                    ? errors["beneficiario.nome"]?.join(" ")
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
                label={"Email"}
                value={conta?.beneficiario?.email}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      email: e.target.value,
                    },
                  }))
                }
                error={errors["beneficiario.email"]}
                helperText={
                  errors["beneficiario.email"]
                    ? errors["beneficiario.email"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <ReactInputMask
                mask={"99/99/9999"}
                value={conta?.beneficiario?.data_nascimento}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      data_nascimento: e.target.value,
                    },
                  }))
                }
              >
                {() => (
                  <TextField
                    label={"Data de nascimento"}
                    error={errors["beneficiario.data_nascimento"]}
                    helperText={
                      errors["beneficiario.data_nascimento"]
                        ? errors["beneficiario.data_nascimento"]?.join(" ")
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
              <ReactInputMask
                mask={"999.999.999-99"}
                value={conta?.beneficiario?.documento}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      documento: e.target.value,
                    },
                  }))
                }
                disabled={update ? true : false}
              >
                {() => (
                  <TextField
                    label={"Documento"}
                    error={errors["beneficiario.documento"]}
                    helperText={
                      errors["beneficiario.documento"]
                        ? errors["beneficiario.documento"]?.join(" ")
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
                label={"Celular"}
                value={conta?.beneficiario?.celular}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    beneficiario: {
                      ...prev.beneficiario,
                      celular: e.target.value,
                    },
                  }))
                }
                error={errors["beneficiario.celular"]}
                helperText={
                  errors["beneficiario.celular"]
                    ? errors["beneficiario.celular"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <ReactInputMask
                mask={"99999-999"}
                value={conta?.endereco?.cep}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      cep: e.target.value,
                    },
                  }))
                }
                onBlur={(e) => handleCep(e)}
              >
                {() => (
                  <TextField
                    label={"CEP"}
                    error={errors["endereco.cep"]}
                    helperText={
                      errors["endereco.cep"]
                        ? errors["endereco.cep"]?.join(" ")
                        : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                )}
              </ReactInputMask>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Rua"}
                value={conta?.endereco?.rua}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      rua: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.rua"]}
                helperText={
                  errors["endereco.rua"]
                    ? errors["endereco.rua"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled={true}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={"Número"}
                value={conta?.endereco?.numero}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      numero: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.numero"]}
                helperText={
                  errors["endereco.numero"]
                    ? errors["endereco.numero"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Complemento"}
                value={conta?.endereco?.complemento}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      complemento: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.complemento"]}
                helperText={
                  errors["endereco.complemento"]
                    ? errors["endereco.complemento"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Bairro"}
                value={conta?.endereco?.bairro}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      bairro: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.bairro"]}
                helperText={
                  errors["endereco.bairro"]
                    ? errors["endereco.bairro"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Cidade"}
                value={conta?.endereco?.cidade}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      cidade: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.cidade"]}
                helperText={
                  errors["endereco.cidade"]
                    ? errors["endereco.cidade"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Estado"}
                value={conta?.endereco?.estado}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    endereco: {
                      ...prev.endereco,
                      estado: e.target.value,
                    },
                  }))
                }
                error={errors["endereco.estado"]}
                helperText={
                  errors["endereco.estado"]
                    ? errors["endereco.estado"]?.join(" ")
                    : null
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled={true}
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

const ExtratoVoucherBeneficiarioModal = ({
  show = false,
  setShow = () => false,
  getData = () => null,
  data = {},
}) => {
  const token = useAuth();
  const [dataBeneficiario, setDataBeneficiario] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleLoadExtrato = async () => {
    setLoading(true);
    try {
      const res = await getTransacaoVoucherBeneficiario(token, data?.id, page);
      setDataBeneficiario(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      handleLoadExtrato();
    }
  }, [token, show, page]);

  const columns = [
    {
      headerText: "Data do Pagamento",
      key: "folha.data_pagamento",
      CustomValue: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography style={{ marginLeft: "6px" }}>
              {moment.utc(data).format("DD MMMM")}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (nome) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography style={{ marginLeft: "6px" }}>{nome}</Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Valor",
      key: "valor_pagamento",
      CustomValue: (valor) => (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon icon={faWallet} style={{ fontSize: "17px" }} />
          <Typography style={{ marginLeft: "6px" }}>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"lg"}
      minWidth={"lg"}
      width={"lg"}
      scroll={"paper"}
    >
      <LoadingScreen isLoading={loading} />

      <DialogContent style={{ paddingBottom: 40, minWidth: "60%" }}>
        <Grid container spacing={4}>
          <Box>
            <Box
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                    borderTopLeftRadius: 27,
                    borderTopRightRadius: 27,
                  }}
                ></Box>

                {dataBeneficiario && dataBeneficiario.per_page ? (
                  <>
                    <Box>
                      <CustomTable
                        columns={columns}
                        data={dataBeneficiario.data}
                      />
                    </Box>
                    <Box alignSelf="start" marginTop="8px">
                      {
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={dataBeneficiario.last_page}
                          onChange={(e, value) => setPage(value)}
                          page={page}
                        />
                      }
                    </Box>
                  </>
                ) : (
                  <LinearProgress />
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeletarBeneficiarioModal = ({
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

  const handleDeletarBeneficiario = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteBeneficiario(token, data?.id);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel deletar o beneficiário. Tente novamente.",
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
      <DialogTitle id="form-dialog-title">Excluir beneficiário</DialogTitle>
      <form onSubmit={handleDeletarBeneficiario}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de excluir o beneficiário:
          </DialogContentText>
          <DialogContentText>
            {data?.nome}
            <br />
            {data?.documento}
            <br />
            {data?.email}
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
  const [showEditarBeneficiarioModal, setShowEditarBeneficiarioModal] =
    useState(false);
  const [showDeletarBeneficiarioModal, setShowDeletarBeneficiarioModal] =
    useState(false);
  const [showTransacoesModal, setShowTrasacoesModal] = useState(false);
  const [showTransacoesVoucherModal, setShowTrasacoesVoucherModal] =
    useState(false);

  return (
    <Box>
      {hasPermission && (
        <Edit
          style={{
            fontSize: "25px",
            color: APP_CONFIG.mainCollors.primary,
          }}
          onClick={() => setShowEditarBeneficiarioModal(true)}
        />
      )}

      {hasPermission && (
        <DeleteForever
          style={{
            fontSize: "25px",
            color: "#ED757D",
          }}
          onClick={() => {
            setShowDeletarBeneficiarioModal(true);
          }}
        />
      )}

      <MenuOptionsTable
        row={row}
        getData={getData}
        hasPermission={hasPermission}
        transactionsType="beneficiario"
      />

      {row?.concorrencia_conta.length === 0 ? null : (
        <>
          <Tooltip title="Extrato aluguel">
            <Handshake
              style={{
                fontSize: "25px",
                color: "#202020",
              }}
              onClick={() => {
                setShowTrasacoesVoucherModal(true);
              }}
            />
          </Tooltip>

          <ExtratoVoucherBeneficiarioModal
            show={showTransacoesVoucherModal}
            setShow={setShowTrasacoesVoucherModal}
            getData={getData}
            data={row}
          />
        </>
      )}

      <BeneficiarioModal
        show={showEditarBeneficiarioModal}
        setShow={setShowEditarBeneficiarioModal}
        getData={getData}
        data={row}
        update
      />
      <DeletarBeneficiarioModal
        show={showDeletarBeneficiarioModal}
        setShow={setShowDeletarBeneficiarioModal}
        getData={getData}
        data={row}
      />
    </Box>
  );
};

export default function ListaBeneficiarios() {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(false);
  const [showCadastrarBeneficiarioModal, setShowCadastrarBeneficiarioModal] =
    useState(false);
  const [listaBeneficiarios, setListaBeneficiarios] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    razao_social: "",
    email: "",
    celular: "",
    tipo_beneficio_id: id ? [id] : [],
    cidade: [],
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      nome: "",
      documento: "",
      razao_social: "",
      email: "",
      celular: "",
      tipo_beneficio_id: id ? [id] : [],
      cidade: [],
      mostrar: "15",
    });
  };

  const filters = `nome=${filter.nome}&documento=${filter.documento}&email=${filter.email
    }&celular=${filter.celular}&razao_social=${filter.razao_social
    }&tipo_beneficio_id=${JSON.stringify(
      filter.tipo_beneficio_id,
    )}&cidade=${JSON.stringify(filter.cidade)}&mostrar=${filter.mostrar}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getBeneficiarios(token, "[]", page, filters);
      setListaBeneficiarios(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTable = async (type) => {
    toast.warn(
      `Exportando arquivo ${type}. Você poderá fazer o download na área "Arquivos exportados"`,
    );
    let url = `${process.env.REACT_APP_API_URL}/concorrencia/beneficiario/export`;
    try {
      await getExportTable(token, url, type, page, filters);
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro ao exportar o arquivo. Tente novamente.");
    }
  };

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    getData(page);
  }, [token, page, debouncedFilter]);

  const beneficiarioButtons = id
    ? [
      {
        text: "Arquivos em lote",
        callback: () => {
          const path = generatePath(
            "lista-arquivos-de-lote?type=beneficiario",
          );
          history.push(path);
        },
      },
      {
        text: "Novo cadastro",
        callback: () => setShowCadastrarBeneficiarioModal(true),
        color: "horizontalGradient",
        icon: <AddIcon style={{ color: "white", marginRight: "10px" }} />,
      },
    ]
    : [];

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Beneficiários"
          customButtons={beneficiarioButtons}
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
                <Box style={{ margin: 30 }}>
                  <Grid
                    container
                    spacing={4}
                    style={{ alignItems: "center", marginBottom: "8px" }}
                  >
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Pesquisar por documento"
                        value={filter.documento}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            documento: e.target.value,
                          }));
                        }}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Pesquisar por nome"
                        value={filter.nome}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            nome: e.target.value,
                          }));
                        }}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <CustomButton
                          color="purple"
                          onClick={() => handleExportTable("xlsx")}
                        >
                          <Box display="flex" alignItems="center">
                            <ViewList />
                            Exportar
                          </Box>
                        </CustomButton>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <CustomButton
                          color="purple"
                          onClick={() => handleExportTable("pdf")}
                        >
                          <Box display="flex" alignItems="center">
                            <ViewList />
                            Exportar PDF
                          </Box>
                        </CustomButton>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Pesquisar por email"
                        value={filter.email}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                        }}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Pesquisar por celular"
                        value={filter.celular}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            celular: e.target.value,
                          }));
                        }}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>

                    {/* <Grid item xs={12} sm={4}>
                      <TextField
                        label="Pesquisar por secretaria"
                        value={filter.razao_social}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            razao_social: e.target.value,
                          }));
                        }}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid> */}

                    {id ? null : (
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
                          multiple
                        />
                      </Grid>
                    )}

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
                        multiple
                      />
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

                    <TableHeaderButton
                      text="Limpar"
                      onClick={resetFilters}
                      Icon={Delete}
                      color="red"
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
                    {!loading &&
                      listaBeneficiarios.data &&
                      listaBeneficiarios.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns ? columns : null}
                            data={listaBeneficiarios.data}
                            Editar={({ row }) => (
                              <MenuTable
                                getData={getData}
                                row={row}
                                hasPermission={hasPermission()}
                              />
                            )}
                          />
                        </Box>

                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={listaBeneficiarios.last_page}
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

      <BeneficiarioModal
        show={showCadastrarBeneficiarioModal}
        setShow={setShowCadastrarBeneficiarioModal}
        getData={getData}
        tipo_beneficio_id={id}
      />
    </Box>
  );
}
