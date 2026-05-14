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
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import { Delete, DeleteForever, Edit } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { loadPermissaoGerenciar, loadUserData } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  deleteVoucher,
  getVouchers,
  postAddVoucher,
  putUpdateVoucher,
} from "../../../services/beneficiarios";

import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import ExportTableButtons from "../../../components/TableHeaderButtons/ExportTableButtons";
import TableHeaderButton from "../../../components/TableHeaderButtons/TableHeaderButton";
import TextFieldCpfCnpj from "../../../components/TextFieldCpfCnpj";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";

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

const columns = [
  { headerText: "Nome", key: "user.nome" },
  {
    headerText: "CPF",
    key: "user.documento",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
  { headerText: "Chave Pix", key: "chave_pix" },
  { headerText: "", key: "menu" },
];

const VoucherModal = ({
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
    tipo_transferencia: data?.tipo_transferencia ?? "Dict",
    chave_pix: data?.chave_pix,
    nome_conta: data?.nome_conta,
    documento_conta: data?.documento_conta,
    banco: data?.banco,
    agencia: data?.agencia,
    conta: data?.conta,
    conta_digito: data?.conta_digito,
    tipo_conta: data?.tipo_conta,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState("");

  const handleClose = () => {
    setShow(false);
    setErrors({});

    if (!update) {
      setConta({
        documento: "",
        tipo_transferencia: "Dict",
        chave_pix: "",
        nome_conta: "",
        documento_conta: "",
        banco: "",
        agencia: "",
        conta: "",
        conta_digito: "",
        tipo_conta: "",
      });
    }
  };

  const handleCriarVoucher = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      if (update) {
        await putUpdateVoucher(token, data.id, conta);
      } else {
        await postAddVoucher(token, tipo_beneficio_id, conta);
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
        {update ? "Editar" : "Cadastrar"} voucher
      </DialogTitle>

      <form onSubmit={handleCriarVoucher}>
        <DialogContent style={{ overflow: "hidden" }}>
          <Grid container spacing={4}>
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
                disabled={update}
              >
                {() => (
                  <TextField
                    label="Documento"
                    error={errors?.documento}
                    helperText={
                      errors?.documento ? errors?.documento?.join(" ") : null
                    }
                    variant="outlined"
                    //InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                )}
              </ReactInputMask>
            </Grid>

            <Grid item xs={12}>
              <InputLabel id="select-transfer-type" shrink="true">
                Tipo de transferência
              </InputLabel>
              <Select
                labelId="select-transfer-type"
                variant="outlined"
                fullWidth
                required
                value={conta?.tipo_transferencia}
                onChange={(e) =>
                  setConta((prev) => ({
                    ...prev,
                    tipo_transferencia: e.target.value,
                  }))
                }
              >
                <MenuItem key={0} value={"Dict"}>
                  Pix
                </MenuItem>
                <MenuItem key={1} value={"Manual"}>
                  Manual
                </MenuItem>
              </Select>
            </Grid>

            {conta?.tipo_transferencia === "Dict" ? (
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
                  error={errors["chave_pix"]}
                  helperText={
                    errors["chave_pix"] ? errors["chave_pix"]?.join(" ") : null
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
                    label={"Nome do recebedor"}
                    value={conta?.nome_conta}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        nome_conta: e.target.value,
                      }))
                    }
                    error={errors["nome_conta"]}
                    helperText={
                      errors["nome_conta"]
                        ? errors["nome_conta"]?.join(" ")
                        : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextFieldCpfCnpj
                    label={"Documento do recebedor"}
                    value={conta?.documento_conta}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        documento_conta: e.target.value,
                      }))
                    }
                    error={errors["documento_conta"]}
                    helperText={
                      errors["documento_conta"]
                        ? errors["documento_conta"]?.join(" ")
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
                    label={"Banco"}
                    value={conta?.banco}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        banco: e.target.value,
                      }))
                    }
                    error={errors["banco"]}
                    helperText={
                      errors["banco"] ? errors["banco"]?.join(" ") : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputLabel id="select-transfer-type" shrink="true">
                    Tipo de conta
                  </InputLabel>
                  <Select
                    labelId="select-transfer-type"
                    variant="outlined"
                    fullWidth
                    value={conta?.tipo_conta}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        tipo_conta: e.target.value,
                      }))
                    }
                    error={errors["tipo_conta"]}
                    helperText={
                      errors["tipo_conta"]
                        ? errors["tipo_conta"]?.join(" ")
                        : null
                    }
                  >
                    <MenuItem key={0} value={"conta_corrente"}>
                      Corrente
                    </MenuItem>
                    <MenuItem key={1} value={"conta_poupanca"}>
                      Poupança
                    </MenuItem>
                    <MenuItem key={0} value={"conta_salario"}>
                      Salário
                    </MenuItem>
                    <MenuItem key={1} value={"conta_pagamento"}>
                      Pagamento
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label={"Agência"}
                    value={conta?.agencia}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        agencia: e.target.value,
                      }))
                    }
                    error={errors["agencia"]}
                    helperText={
                      errors["agencia"] ? errors["agencia"]?.join(" ") : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    label={"Conta"}
                    value={conta?.conta}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        conta: e.target.value,
                      }))
                    }
                    error={errors["conta"]}
                    helperText={
                      errors["conta"] ? errors["conta"]?.join(" ") : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label={"Dígito"}
                    value={conta?.conta_digito}
                    onChange={(e) =>
                      setConta((prev) => ({
                        ...prev,
                        conta_digito: e.target.value,
                      }))
                    }
                    error={errors["conta_digito"]}
                    helperText={
                      errors["conta_digito"]
                        ? errors["conta_digito"]?.join(" ")
                        : null
                    }
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}
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

const DeletarVoucherModal = ({
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

  const handleDeletarVoucher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteVoucher(token, data?.id);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel deletar o voucher. Tente novamente.",
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
      <DialogTitle id="form-dialog-title">Excluir voucher</DialogTitle>
      <form onSubmit={handleDeletarVoucher}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>
            Você gostaria de excluir o voucher:
          </DialogContentText>
          <DialogContentText>
            {data?.user?.nome}
            <br />
            {data?.user?.documento}
            <br />
            Pix: {data?.chave_pix}
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
  const [showEditarVoucherModal, setShowEditarVoucherModal] = useState(false);
  const [showDeletarVoucherModal, setShowDeletarVoucherModal] = useState(false);

  return (
    <Box>
      {hasPermission && (
        <DeleteForever
          style={{
            fontSize: "25px",
            color: "#ED757D",
          }}
          onClick={() => setShowDeletarVoucherModal(true)}
        />
      )}

      {hasPermission && (
        <Edit
          style={{
            fontSize: "25px",
            color: APP_CONFIG.mainCollors.primary,
          }}
          onClick={() => setShowEditarVoucherModal(true)}
        />
      )}

      <VoucherModal
        show={showEditarVoucherModal}
        setShow={setShowEditarVoucherModal}
        getData={getData}
        data={row}
        update
      />
      <DeletarVoucherModal
        show={showDeletarVoucherModal}
        setShow={setShowDeletarVoucherModal}
        getData={getData}
        data={row}
      />
    </Box>
  );
};

export default function ListaVouchers() {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const gerenciarPermissao = useSelector((state) => state.gerenciarPermissao);
  const token = useAuth();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(false);
  const [showCadastrarVoucherModal, setShowCadastrarVoucherModal] =
    useState(false);
  const usuario = useSelector((state) => state.userData);
  const [listaVouchers, setListaVouchers] = useState([]);
  const [page, setPage] = useState(1);
  const [, setPermissoes] = useState([]);
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    chave_pix: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);

  const filters = `nome=${filter?.nome}&documento=${filter?.documento}&chave_pix=${filter?.chave_pix}&mostrar=${filter.mostrar}`;

  const resetFilter = () =>
    setFilter({
      nome: "",
      documento: "",
      chave_pix: "",
      mostrar: "15",
    });

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getVouchers(token, id, page, filters);
      setListaVouchers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getDataCallback = useCallback(getData, [filters, id, token]);

  useEffect(() => {
    getDataCallback(page);
  }, [token, page, getDataCallback, debouncedFilter]);

  useEffect(() => {
    dispatch(loadPermissaoGerenciar(token, usuario.id));
  }, [dispatch, token, usuario.id]);

  useEffect(() => {
    const { permissao } = gerenciarPermissao;
    setPermissoes(permissao.map((item) => item.tipo));
  }, [gerenciarPermissao, gerenciarPermissao.permissao.length]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [dispatch, token]);

  const VoucherButtons = [
    {
      text: "Arquivos em lote",
      callback: () => {
        const path = generatePath("lista-arquivos-de-lote?type=voucher");
        history.push(path);
      },
    },
    {
      text: "Novo cadastro",
      callback: () => setShowCadastrarVoucherModal(true),
      color: "horizontalGradient",
      icon: <AddIcon style={{ color: "white", marginRight: "10px" }} />,
    },
  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Vouchers" customButtons={VoucherButtons} />

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
                    spacing={2}
                    style={{ alignItems: "center", marginBottom: "8px" }}
                  >
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Nome"
                        value={filter.nome}
                        onChange={(e) =>
                          setFilter((prev) => ({
                            ...prev,
                            nome: e.target.value,
                          }))
                        }
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <ReactInputMask
                        maskChar=""
                        mask={"999.999.999-99"}
                        value={filter.documento}
                        onChange={(e) =>
                          setFilter((prev) => ({
                            ...prev,
                            documento: e.target.value,
                          }))
                        }
                      >
                        {() => (
                          <TextField
                            label="Documento"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                          />
                        )}
                      </ReactInputMask>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Chave Pix"
                        value={filter.chave_pix}
                        onChange={(e) =>
                          setFilter((prev) => ({
                            ...prev,
                            chave_pix: e.target.value,
                          }))
                        }
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
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
                      onClick={resetFilter}
                      Icon={Delete}
                      color="red"
                    />

                    <ExportTableButtons
                      token={token}
                      path={"beneficiario/contas"}
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
                    {!loading &&
                    listaVouchers?.data &&
                    listaVouchers?.per_page ? (
                      <>
                        <Box minWidth={!matches ? "800px" : null}>
                          <CustomTable
                            columns={columns}
                            data={listaVouchers.data}
                            Editar={(props) => (
                              <MenuTable
                                getData={getData}
                                hasPermission={hasPermission()}
                                {...props}
                              />
                            )}
                          />
                        </Box>

                        <Box alignSelf="flex-end" marginTop="8px">
                          <Pagination
                            variant="outlined"
                            color="secondary"
                            size="large"
                            count={listaVouchers.last_page}
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

      <VoucherModal
        show={showCadastrarVoucherModal}
        setShow={setShowCadastrarVoucherModal}
        getData={getData}
        tipo_beneficio_id={id}
      />
    </Box>
  );
}
