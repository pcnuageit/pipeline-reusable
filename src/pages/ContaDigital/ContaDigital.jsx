import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Tab,
  TableContainer,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import CheckIcon from "@material-ui/icons/Check";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";

import {
  deleteUserRepresentanteAction,
  delGerarTokenAction,
  getGerarTokenAction,
  getReenviarTokenUsuarioAction,
  loadContaId,
  loadUserData,
  postDocumentoActionAdm,
  postGerarTokenAction,
  postUserRepresentanteAction,
  putUserOperadorAction,
  updateConta,
} from "../../actions/actions";
import useAuth from "../../hooks/useAuth";

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SettingsIcon from "@material-ui/icons/Settings";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { DropzoneAreaBase } from "material-ui-dropzone";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactInputMask from "react-input-mask";
import SwipeableViews from "react-swipeable-views";
import CustomCloseButton from "../../components/CustomCloseButton/CustomCloseButton";
import CustomTable from "../../components/CustomTable/CustomTable";
import NewAccount from "../../components/NewAccount/NewAccount";
import useDebounce from "../../hooks/useDebounce";
import usePermission from "../../hooks/usePermission";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

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
    alignItems: "center",
    justifyContent: "center",
    marginTop: "50px",

    width: "100%",
  },

  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    flexDirection: "column",

    borderRadius: "0px",
    alignSelf: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  card: {
    margin: theme.spacing(1),
    padding: 0,
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

  indicator: {
    color: "black",
  },

  media: {
    padding: "135px",
  },
  modal: {
    position: "absolute",
    top: "55%",
    left: "85%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: "110%",
    backgroundColor: "#F6F6FA",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 5,
  },
  tableContainer: { marginTop: "50px" },
}));

const a11yProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default function ContaDigital() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const { hasPermission } = usePermission();
  const [lidoOperadores, setLidoOperadores] = useState(false);
  const contaId = useSelector((state) => state.conta);
  const [operadoresData, setOperadoresData] = useState("");
  const userType = useSelector((state) => state.userType);
  const userData = useSelector((state) => state.userData);
  const gerarToken = useSelector((state) => state.gerarToken);
  const publicToken = useSelector((state) => state.publicToken);
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [errosConta, setErrosConta] = useState({});
  const [errorsRepresentante, setErrorsRepresentante] = useState("");
  const [errorsGerarToken, setErrorsGerarToken] = useState("");
  const [fillCheckboxSim, setFillCheckboxSim] = useState(false);
  const [fillCheckboxNao, setFillCheckboxNao] = useState(false);
  const [filters, setFilters] = useState({
    like: "",
  });
  const debouncedLike = useDebounce(filters.like, 500);
  const [conta, setConta] = useState({
    documento: "",
    nome: "",
    razao_social: "",
    cnpj: "",
    celular: "",
    data_nascimento: "",
    email: "",
    site: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  const [dadosRepresentante, setDadosRepresentante] = useState({
    conta_id: userData.id,
    nome: "",
    documento: "",
    email: "",
    celular: "",
    permissao: null,
  });

  const [nomeToken, setNomeToken] = useState("");
  const [modalToken, setModalToken] = useState(false);
  const [modalCopiarToken, setModalCopiarToken] = useState(false);

  useEffect(() => {
    setConta({ ...contaId });
    setOperadoresData([]);
    if (contaId.representante != undefined)
      contaId.representante.forEach((item) => {
        if (item.onboard_operador)
          setOperadoresData((operadoresData) => [...operadoresData, item]);
      });
  }, [contaId]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(loadContaId(token, userData.id, true));
  }, [userData]);

  useEffect(() => {
    dispatch(getGerarTokenAction(token));
  }, [token]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const getIndicatorColor = (index) =>
    index === value ? `2px solid ${APP_CONFIG.mainCollors.primary}` : null;

  const onDropCartaoCNPJ = async (picture) => {
    setLoading(true);

    const categoria = "CARTAO_CNPJ";
    await dispatch(
      postDocumentoActionAdm(token, picture, categoria, userData.id),
    );
    await dispatch(loadContaId(token, userData.id, true));
    setLoading(false);
  };
  const onDropContratoSocial = async (picture) => {
    setLoading(true);

    const categoria = "PAGINA_CONTRATO_SOCIAL";
    await dispatch(
      postDocumentoActionAdm(token, picture, categoria, userData.id),
    );
    await dispatch(loadContaId(token, userData.id, true));
    setLoading(false);
  };
  const onDropPaginaProcuracao = async (picture) => {
    setLoading(true);

    const categoria = "PAGINA_PROCURACAO";
    await dispatch(
      postDocumentoActionAdm(token, picture, categoria, userData.id),
    );
    await dispatch(loadContaId(token, userData.id, true));
    setLoading(false);
  };
  const onDropPaginaAtaEleicaoDiretores = async (picture) => {
    setLoading(true);

    const categoria = "PAGINA_ATA_ELEICAO_DIRETORES";
    await dispatch(
      postDocumentoActionAdm(token, picture, categoria, userData.id),
    );
    await dispatch(loadContaId(token, userData.id, true));
    setLoading(false);
  };

  const onDropComprovanteFaturamento = async (picture) => {
    setLoading(true);

    const categoria = "COMPROVANTE_FATURAMENTO";
    await dispatch(
      postDocumentoActionAdm(token, picture, categoria, userData.id),
    );
    await dispatch(loadContaId(token, userData.id, true));
    setLoading(false);
  };

  const handleAlterar = async () => {
    setLoading(true);
    const resConta = await dispatch(updateConta(token, conta, userData.id));
    if (resConta) {
      setErrosConta(resConta);
      toast.error("Erro ao alterar dados");
      setLoading(false);
    } else {
      toast.success("Dados alterados com sucesso!");
      setLoading(false);
      await dispatch(loadContaId(token, userData.id, true));
    }
  };

  const handleAdicionarRepresentante = async () => {
    const resRepresentante = await dispatch(
      postUserRepresentanteAction(token, dadosRepresentante),
    );
    if (resRepresentante) {
      setErrorsRepresentante(resRepresentante);
      toast.error("Erro ao adicionar representante");
    } else {
      toast.success("Representante adicionado com sucesso");
      await dispatch(loadContaId(token, userData.id, true));
      setOpenModal(false);
    }
  };

  const handleCriarToken = async () => {
    const resGerarToken = await dispatch(
      postGerarTokenAction(token, nomeToken),
    );
    if (resGerarToken) {
      setErrorsGerarToken(resGerarToken);
      toast.error("Erro ao adicionar token");
    } else {
      toast.success("Token adicionado com sucesso");
      await dispatch(getGerarTokenAction(token));
      setModalToken(false);
      setNomeToken("");
      setModalCopiarToken(true);
    }
  };

  const columns = [
    { headerText: "Nome", key: "nome" },
    {
      headerText: "Documento",
      key: "operador",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "E-mail", key: "email" },
    {
      headerText: "Celular",
      key: "celular",
      CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
    },
    {
      headerText: "Permissão",
      key: "permissao_master",
      CustomValue: (value) => {
        if (value === true) {
          return "Sim";
        } else {
          return "Não";
        }
      },
    },
    userType.isBanking
      ? {
          headerText: "Verificação Onboard",
          key: "onboard_operador",
          CustomValue: (value) => {
            if (value === true) {
              return <CheckIcon style={{ color: "green" }} />;
            } else {
              return (
                <Typography style={{ color: "red", fontSize: "0.7rem" }}>
                  Aguardando Verificação
                </Typography>
              );
            }
          },
        }
      : {},
    hasPermission() ? { headerText: "", key: "menu" } : {},
  ];

  const columnsToken = [
    { headerText: "Nome", key: "name" },

    { headerText: "", key: "menu" },
  ];

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [excluirId, setExcluirId] = useState("");
    const [openModalAlterarRepresentante, setOpenModalAlterarRepresentante] =
      useState(false);
    const [dadosAlterarRepresentante, setDadosAlterarRepresentante] = useState(
      {},
    );
    const [errorsAlterarRepresentante, setErrorsAlterarRepresentante] =
      useState("");

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    // const handlePermissoes = async (event) => {
    // 	setLoading(true);
    // 	if (permissoes.includes(event.target.name)) {
    // 		await dispatch(delPermissao(token, id, event.target.value));
    // 		await dispatch(loadPermissaoGerenciar(token, id));
    // 		setLoading(false);
    // 	} else {
    // 		await dispatch(postPermissaoAction(token, id, event.target.value));
    // 		await dispatch(loadPermissaoGerenciar(token, id));
    // 		setLoading(false);
    // 	}
    // };

    /* const handleEditar = (row) => {
			setDadosRepresentanteEditar({
				...dadosRepresentanteEditar,
				nome: row.row.nome,
				documento: row.row.documento,
				email: row.row.email,
				celular: row.row.celular,
				permissao: row.row.permissao,
			});
			setOpenModalEditar(true);
		}; */

    /* const handleEditarRepresentante = async () => {
			const resRepresentante = await dispatch(
				putRepresentanteAction(dadosRepresentanteEditar, row.row.id)
			);
			if (resRepresentante) {
				toast.error('Erro ao editar representante');
			} else {
				toast.success('Representante editado com sucesso');
			}
		}; */

    const handleAlterarRepresentante = async () => {
      setLoading(true);
      const resAlterarRepresentante = await dispatch(
        putUserOperadorAction(
          token,
          dadosAlterarRepresentante.id,
          dadosAlterarRepresentante.nome,
          dadosAlterarRepresentante.permissao_master,
        ),
      );
      if (resAlterarRepresentante) {
        setErrorsAlterarRepresentante(resAlterarRepresentante);
        toast.error("Erro ao alterar representante");
        setLoading(false);
      } else {
        toast.success("Representante alterado com sucesso");
        await dispatch(loadContaId(token, userData.id, true));
        setOpenModalAlterarRepresentante(false);
        setLoading(false);
      }
    };

    const handleReenviarToken = async () => {
      const resRepresentante = await dispatch(
        getReenviarTokenUsuarioAction(token, row.row.id),
      );
      if (resRepresentante) {
        toast.error("Erro ao reenviar token");
      } else {
        toast.success("Token enviado com sucesso");
      }
    };

    const handleExcluirRepresentante = async (item) => {
      setLoading(true);
      const resExcluir = await dispatch(
        deleteUserRepresentanteAction(token, excluirId),
      );
      if (resExcluir) {
        toast.error("Erro ao excluir representante");
        setOpenModalExcluir(false);
        setLoading(false);
      } else {
        toast.success("Representante excluído com sucesso");
        await dispatch(loadContaId(token, userData.id, true));
        setOpenModalExcluir(false);
        setLoading(false);
      }
    };

    return (
      <Box>
        <IconButton
          style={{ height: "15px", width: "10px" }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <SettingsIcon
            style={{
              borderRadius: 33,
              fontSize: "35px",
              backgroundColor: APP_CONFIG.mainCollors.primary,
              color: "white",
            }}
          />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {/* <MenuItem
            onClick={() => {
              history.push(`/dashboard/permissao-beneficiario/${row.row.id}`);
            }}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Permissões
          </MenuItem> */}
          <MenuItem
            onClick={() => {
              setOpenModalAlterarRepresentante(true);
              setDadosAlterarRepresentante(row.row);
            }}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Alterar
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenModalExcluir(true);
              setExcluirId(row.row.id);
            }}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Excluir
          </MenuItem>
          <MenuItem
            onClick={() => handleReenviarToken(row)}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Reenviar Token
          </MenuItem>
        </Menu>
        <Dialog
          open={openModalExcluir}
          onClose={() => setOpenModalExcluir(false)}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <DialogTitle
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            Deseja excluir esse representante?
          </DialogTitle>

          <DialogContent
            style={{
              minWidth: 500,
            }}
          ></DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => handleExcluirRepresentante()}
              style={{ marginRight: "10px" }}
            >
              Sim
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setOpenModalExcluir(false);
                setExcluirId("");
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
        <Modal
          open={openModalAlterarRepresentante}
          onBackdropClick={() => setOpenModalAlterarRepresentante(false)}
        >
          <Box className={classes.modal}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "5%",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "19px",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "30px",
                  }}
                >
                  Alterar representante
                </Typography>
                <Box>
                  <CustomCloseButton
                    color="purple"
                    onClick={() => setOpenModalAlterarRepresentante(false)}
                  />
                </Box>
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "30px",
                }}
              >
                <TextField
                  required
                  variant="standard"
                  label="Nome"
                  fullWidth
                  value={dadosAlterarRepresentante.nome}
                  error={errorsAlterarRepresentante.nome}
                  helperText={
                    errorsAlterarRepresentante.nome
                      ? errorsAlterarRepresentante.nome.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosAlterarRepresentante({
                      ...dadosAlterarRepresentante,
                      nome: e.target.value,
                    })
                  }
                />
              </Box>
              <Box style={{ marginTop: "20px" }}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "10px",
                  }}
                >
                  Representante tem amplos poderes para fazer operações
                  bancárias em nome da empresa?
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  <Checkbox
                    color="primary"
                    checked={dadosAlterarRepresentante.permissao_master}
                    onChange={() => {
                      setDadosAlterarRepresentante({
                        ...dadosAlterarRepresentante,
                        permissao_master: true,
                      });
                    }}
                  />
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "10px",
                    }}
                  >
                    Sim
                  </Typography>

                  <Checkbox
                    color="primary"
                    checked={
                      dadosAlterarRepresentante.permissao_master === false
                    }
                    onChange={() => {
                      setDadosAlterarRepresentante({
                        ...dadosAlterarRepresentante,
                        permissao_master: false,
                      });
                    }}
                  />
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "10px",
                    }}
                  >
                    Não
                  </Typography>
                </Box>
                {/* 
								<Box display="flex" alignItems="center">
									<AccountCollectionItem text="Acesso total" icon={faCreditCard} />
									<Switch
										name={'Administrador - Acesso total'}
										value={1}
										checked={
											permissoes.includes('Administrador - Acesso total')
												? true
												: false
										}
										onClick={handlePermissoes}
									/>
								</Box> */}

                <Box
                  style={{
                    display: "flex",
                    marginTop: "50px",
                    justifyContent: "center",
                  }}
                >
                  <CustomButton
                    variant="contained"
                    /* type="submit" */
                    color="purple"
                    onClick={handleAlterarRepresentante}
                  >
                    <Typography
                      style={{
                        fontSize: "13px",
                        color: "white",
                      }}
                    >
                      Alterar representante
                    </Typography>
                  </CustomButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    );
  };
  const EditarToken = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleExcluirToken = async (row) => {
      setLoading(true);
      const resExcluirToken = await dispatch(
        delGerarTokenAction(token, row.row.id),
      );
      if (resExcluirToken) {
        setLoading(false);
      } else {
        toast.success("Token excluído com sucesso");
        setLoading(false);
        await dispatch(getGerarTokenAction(token));
      }
    };

    return (
      <Box>
        <IconButton
          style={{ height: "15px", width: "10px" }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <SettingsIcon
            style={{
              borderRadius: 33,
              fontSize: "35px",
              backgroundColor: APP_CONFIG.mainCollors.primary,
              color: "white",
            }}
          />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleExcluirToken(row);
            }}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Excluir
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle={userType.isBanking ? "Conta digital" : "Perfil"}
        />
        <Box className={classes.dadosBox}>
          <Paper
            className={classes.paper}
            style={{
              width: "100%",
              borderTopRightRadius: 27,
              borderTopLeftRadius: 27,
            }}
          >
            <AppBar
              position="static"
              color="default"
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                borderTopRightRadius: 27,
                borderTopLeftRadius: 27,
              }}
            >
              <Tabs
                style={{
                  color: APP_CONFIG.mainCollors.primary,
                  borderBottom: `1px solid ${APP_CONFIG.mainCollors.primary}`,
                }}
                value={value}
                onChange={handleChange}
                indicatorColor={APP_CONFIG.mainCollors.primary}
                variant="scrollable"
              >
                <Tab
                  label="Dados Cadastrais"
                  style={{
                    width: "60%",
                    borderBottom: getIndicatorColor(0),
                  }}
                  {...a11yProps(0)}
                />
                <Tab
                  label="Documentos"
                  style={{
                    width: "60%",
                    borderBottom: getIndicatorColor(1),
                  }}
                  {...a11yProps(1)}
                />

                <Tab
                  label="Representantes"
                  style={{
                    width: "60%",
                    borderBottom: getIndicatorColor(2),
                  }}
                  {...a11yProps(2)}
                />

                <Tab
                  label="Tokens Públicos"
                  style={{
                    width: "60%",
                    borderBottom: getIndicatorColor(3),
                  }}
                  {...a11yProps(3)}
                />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <NewAccount
                  conta={conta}
                  setConta={setConta}
                  errosConta={errosConta}
                  disableEditar="true"
                />
                <Box display="flex" justifyContent="flex-end" marginTop="16px">
                  <CustomButton onClick={handleAlterar} color="purple">
                    Alterar
                  </CustomButton>
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <Grid container spacing={2} style={{ marginTop: "15px" }}>
                  <Grid item sm={6} xs={12}>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "0px",
                      }}
                    >
                      Cartão CNPJ*
                    </Typography>
                    <Box className={classes.dropzoneContainer} boxShadow={3}>
                      <DropzoneAreaBase
                        dropzoneParagraphClass={classes.textoDropzone}
                        maxFileSize={3145728}
                        onDropRejected={() => {
                          toast.error("Tamanho máximo: 3mb");
                          toast.error(
                            "Arquivos suportados: .pdf .png .jpg .jpeg",
                          );
                        }}
                        acceptedFiles={["image/*", "application/pdf"]}
                        dropzoneClass={classes.dropzoneAreaBaseClasses}
                        onAdd={onDropCartaoCNPJ}
                        filesLimit={1}
                        dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                        showPreviews={false}
                        showPreviewsInDropzone={false}
                      />
                      <Box width="300px">
                        <Grid container>
                          {contaId.documentos && contaId.documentos.length > 0
                            ? contaId.documentos.map((item) =>
                                item.categoria === "CARTAO_CNPJ" ? (
                                  <Grid item xs={6}>
                                    <Card className={classes.card}>
                                      <CardActionArea>
                                        {/* <Box position="absolute">
																					<IconButton
																						onClick={() =>
																						handleExcluirArquivo(
																							item
																						)
																					}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box> */}
                                        {item.descricao ===
                                        "application/pdf" ? (
                                          <Box
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              height: "100px",
                                            }}
                                            onClick={() =>
                                              window.open(item.arquivo)
                                            }
                                          >
                                            <PictureAsPdfIcon
                                              style={{
                                                color: "black",
                                                fontSize: "70px",
                                              }}
                                            />
                                          </Box>
                                        ) : (
                                          <CardMedia
                                            component="img"
                                            alt="Arquivo de Identificação"
                                            height="100"
                                            image={item.arquivo}
                                            onClick={() =>
                                              window.open(item.arquivo)
                                            }
                                          />
                                        )}
                                      </CardActionArea>
                                    </Card>
                                  </Grid>
                                ) : (
                                  false
                                ),
                              )
                            : null}
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "0px",
                      }}
                    >
                      Contrato social ou certificado de condição do MEI*
                    </Typography>
                    <Box className={classes.dropzoneContainer} boxShadow={3}>
                      <DropzoneAreaBase
                        dropzoneParagraphClass={classes.textoDropzone}
                        maxFileSize={3145728}
                        onDropRejected={() => {
                          toast.error("Tamanho máximo: 3mb");
                          toast.error(
                            "Arquivos suportados: .pdf .png .jpg .jpeg",
                          );
                        }}
                        acceptedFiles={["image/*", "application/pdf"]}
                        dropzoneClass={classes.dropzoneAreaBaseClasses}
                        onAdd={onDropContratoSocial}
                        filesLimit={1}
                        dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                        showPreviews={false}
                        showPreviewsInDropzone={false}
                      />
                      <Box width="300px">
                        <Grid container>
                          {contaId.documentos && contaId.documentos.length > 0
                            ? contaId.documentos.map((item) =>
                                item.categoria === "PAGINA_CONTRATO_SOCIAL" ? (
                                  <Grid item xs={6}>
                                    <Card className={classes.card}>
                                      <CardActionArea>
                                        {/* <Box position="absolute">
																					<IconButton
																						onClick={() =>
																						handleExcluirArquivo(
																							item
																						)
																					}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box> */}
                                        {item.descricao ===
                                        "application/pdf" ? (
                                          <Box
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              height: "100px",
                                            }}
                                            onClick={() =>
                                              window.open(item.arquivo)
                                            }
                                          >
                                            <PictureAsPdfIcon
                                              style={{
                                                color: "black",
                                                fontSize: "70px",
                                              }}
                                            />
                                          </Box>
                                        ) : (
                                          <CardMedia
                                            component="img"
                                            alt="Arquivo de Identificação"
                                            height="100"
                                            image={item.arquivo}
                                            onClick={() =>
                                              window.open(item.arquivo)
                                            }
                                          />
                                        )}
                                      </CardActionArea>
                                    </Card>
                                  </Grid>
                                ) : (
                                  false
                                ),
                              )
                            : null}
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: "15px" }}>
                  <Grid item sm={6} xs={12}>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "0px",
                      }}
                    >
                      Procurações (se houver)
                    </Typography>
                    <Box className={classes.dropzoneContainer} boxShadow={3}>
                      <DropzoneAreaBase
                        dropzoneParagraphClass={classes.textoDropzone}
                        maxFileSize={3145728}
                        onDropRejected={() => {
                          toast.error("Tamanho máximo: 3mb");
                          toast.error(
                            "Arquivos suportados: .pdf .png .jpg .jpeg",
                          );
                        }}
                        acceptedFiles={["image/*", "application/pdf"]}
                        dropzoneClass={classes.dropzoneAreaBaseClasses}
                        onAdd={onDropPaginaProcuracao}
                        filesLimit={1}
                        dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                        showPreviews={false}
                        showPreviewsInDropzone={false}
                      />
                      <Box width="300px">
                        <Grid container>
                          {contaId.documentos && contaId.documentos.length > 0
                            ? contaId.documentos.map((item) =>
                                item.categoria === "PAGINA_PROCURACAO" ? (
                                  <Grid item xs={6}>
                                    <Card className={classes.card}>
                                      <CardActionArea>
                                        {/* <Box position="absolute">
																					<IconButton
																						onClick={() =>
																						handleExcluirArquivo(
																							item
																						)
																					}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box> */}
                                        {item.descricao ===
                                        "application/pdf" ? (
                                          <Box
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              height: "100px",
                                            }}
                                            onClick={() =>
                                              window.open(item.arquivo)
                                            }
                                          >
                                            <PictureAsPdfIcon
                                              style={{
                                                color: "black",
                                                fontSize: "70px",
                                              }}
                                            />
                                          </Box>
                                        ) : (
                                          <CardMedia
                                            component="img"
                                            alt="Arquivo de Identificação"
                                            height="100"
                                            image={item.arquivo}
                                            onClick={() =>
                                              window.open(item.arquivo)
                                            }
                                          />
                                        )}
                                      </CardActionArea>
                                    </Card>
                                  </Grid>
                                ) : (
                                  false
                                ),
                              )
                            : null}
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "0px",
                      }}
                    >
                      Ata de procuração da diretoria (se houver)
                    </Typography>
                    <Box className={classes.dropzoneContainer} boxShadow={3}>
                      <DropzoneAreaBase
                        dropzoneParagraphClass={classes.textoDropzone}
                        maxFileSize={3145728}
                        onDropRejected={() => {
                          toast.error("Tamanho máximo: 3mb");
                          toast.error(
                            "Arquivos suportados: .pdf .png .jpg .jpeg",
                          );
                        }}
                        acceptedFiles={["image/*", "application/pdf"]}
                        dropzoneClass={classes.dropzoneAreaBaseClasses}
                        onAdd={onDropPaginaAtaEleicaoDiretores}
                        filesLimit={1}
                        dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                        showPreviews={false}
                        showPreviewsInDropzone={false}
                      />
                      <Box width="300px">
                        <Grid container>
                          {contaId.documentos && contaId.documentos.length > 0
                            ? contaId.documentos.map((item) =>
                                item.categoria ===
                                "PAGINA_ATA_ELEICAO_DIRETORES" ? (
                                  <Grid item xs={6}>
                                    <Card className={classes.card}>
                                      <CardActionArea>
                                        {/* <Box position="absolute">
																					<IconButton
																						onClick={() =>
																						handleExcluirArquivo(
																							item
																						)
																					}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box> */}
                                        {item.descricao ===
                                        "application/pdf" ? (
                                          <Box
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              height: "100px",
                                            }}
                                            onClick={() =>
                                              window.open(item.arquivo)
                                            }
                                          >
                                            <PictureAsPdfIcon
                                              style={{
                                                color: "black",
                                                fontSize: "70px",
                                              }}
                                            />
                                          </Box>
                                        ) : (
                                          <CardMedia
                                            component="img"
                                            alt="Arquivo de Identificação"
                                            height="100"
                                            image={item.arquivo}
                                            onClick={() =>
                                              window.open(item.arquivo)
                                            }
                                          />
                                        )}
                                      </CardActionArea>
                                    </Card>
                                  </Grid>
                                ) : (
                                  false
                                ),
                              )
                            : null}
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                  {userType.isBanking ? (
                    <Grid item sm={6} xs={12}>
                      <Typography
                        style={{
                          fontFamily: "Montserrat-Regular",
                          fontSize: "14px",
                          color: APP_CONFIG.mainCollors.primary,
                          marginTop: "0px",
                        }}
                      >
                        Comprovante de Faturamento
                      </Typography>
                      <Box className={classes.dropzoneContainer} boxShadow={3}>
                        <DropzoneAreaBase
                          dropzoneParagraphClass={classes.textoDropzone}
                          maxFileSize={3145728}
                          onDropRejected={() => {
                            toast.error("Tamanho máximo: 3mb");
                            toast.error(
                              "Arquivos suportados: .pdf .png .jpg .jpeg",
                            );
                          }}
                          acceptedFiles={["image/*", "application/pdf"]}
                          dropzoneClass={classes.dropzoneAreaBaseClasses}
                          onAdd={onDropComprovanteFaturamento}
                          filesLimit={1}
                          dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                          showPreviews={false}
                          showPreviewsInDropzone={false}
                        />
                        <Box width="300px">
                          <Grid container>
                            {contaId.documentos && contaId.documentos.length > 0
                              ? contaId.documentos.map((item) =>
                                  item.categoria ===
                                  "COMPROVANTE_FATURAMENTO" ? (
                                    <Grid item xs={6}>
                                      <Card className={classes.card}>
                                        <CardActionArea>
                                          {/* <Box position="absolute">
																					<IconButton
																						onClick={() =>
																							handleExcluirArquivo(
																								item
																							)
																						}
																						size="small"
																						style={{
																							color: 'white',
																							backgroundColor:
																								'red',
																						}}
																					>
																						<ClearIcon />
																					</IconButton>
																				</Box> */}
                                          {item.descricao ===
                                          "application/pdf" ? (
                                            <>
                                              <Box
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  height: "100px",
                                                }}
                                                onClick={() =>
                                                  window.open(item.arquivo)
                                                }
                                              >
                                                <PictureAsPdfIcon
                                                  style={{
                                                    color: "black",
                                                    fontSize: "70px",
                                                  }}
                                                />
                                              </Box>
                                              <Box
                                                style={{
                                                  padding: "10px",
                                                }}
                                              >
                                                <Typography
                                                  style={{
                                                    color:
                                                      item.status ===
                                                      "Aguardando validação"
                                                        ? "#F8D837"
                                                        : item.status ===
                                                            "Validado"
                                                          ? "#3EBA59"
                                                          : item.status ===
                                                              "Inválido"
                                                            ? "#B54444"
                                                            : item.status ===
                                                                "Expirado"
                                                              ? "#B54444"
                                                              : item.status ===
                                                                  "Enviado"
                                                                ? "#3EBA59"
                                                                : item.status ===
                                                                    "Reenviado"
                                                                  ? "#3EBA59"
                                                                  : item.status ===
                                                                      "Reprovado"
                                                                    ? "#B54444"
                                                                    : item.status ===
                                                                        "Erro"
                                                                      ? "#B54444"
                                                                      : item.status ===
                                                                          "Inexistente"
                                                                        ? "#B54444"
                                                                        : item.status ===
                                                                            "Suspenso"
                                                                          ? "#F8D837"
                                                                          : item.status ===
                                                                              "Resultado da tipificação"
                                                                            ? "#F8D837"
                                                                            : null,
                                                  }}
                                                >
                                                  {item.status}
                                                </Typography>
                                                <Typography
                                                  style={{
                                                    color: "#F8D837",
                                                  }}
                                                >
                                                  {item.rasao}
                                                </Typography>
                                              </Box>
                                            </>
                                          ) : (
                                            <>
                                              <CardMedia
                                                component="img"
                                                alt="Arquivo de Identificação"
                                                height="100"
                                                image={item.arquivo}
                                                onClick={() =>
                                                  window.open(item.arquivo)
                                                }
                                              />
                                              <Box
                                                style={{
                                                  padding: "10px",
                                                }}
                                              >
                                                <Typography
                                                  style={{
                                                    color:
                                                      item.status ===
                                                      "Aguardando validação"
                                                        ? "#F8D837"
                                                        : item.status ===
                                                            "Validado"
                                                          ? "#3EBA59"
                                                          : item.status ===
                                                              "Inválido"
                                                            ? "#B54444"
                                                            : item.status ===
                                                                "Expirado"
                                                              ? "#B54444"
                                                              : item.status ===
                                                                  "Enviado"
                                                                ? "#3EBA59"
                                                                : item.status ===
                                                                    "Reenviado"
                                                                  ? "#3EBA59"
                                                                  : item.status ===
                                                                      "Reprovado"
                                                                    ? "#B54444"
                                                                    : item.status ===
                                                                        "Erro"
                                                                      ? "#B54444"
                                                                      : item.status ===
                                                                          "Inexistente"
                                                                        ? "#B54444"
                                                                        : item.status ===
                                                                            "Suspenso"
                                                                          ? "#F8D837"
                                                                          : item.status ===
                                                                              "Resultado da tipificação"
                                                                            ? "#F8D837"
                                                                            : null,
                                                  }}
                                                >
                                                  {item.status}
                                                </Typography>
                                                <Typography
                                                  style={{
                                                    color: "#F8D837",
                                                  }}
                                                >
                                                  {item.rasao}
                                                </Typography>
                                              </Box>
                                            </>
                                          )}
                                        </CardActionArea>
                                      </Card>
                                    </Grid>
                                  ) : (
                                    false
                                  ),
                                )
                              : null}
                          </Grid>
                        </Box>
                      </Box>
                    </Grid>
                  ) : null}
                </Grid>
              </TabPanel>

              <TabPanel value={value} index={2} dir={theme.direction}>
                <Box>
                  <Typography
                    style={{
                      fontFamily: "Montserrat-ExtraBold",
                      fontSize: "16px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "30px",
                    }}
                  >
                    Representantes
                  </Typography>

                  <Box className={classes.tableContainer}>
                    {contaId.representante ? (
                      <Box minWidth={!matches ? "800px" : null}>
                        <TableContainer style={{ overflowX: "auto" }}>
                          <CustomTable
                            columns={columns}
                            data={operadoresData}
                            Editar={Editar}
                          />
                        </TableContainer>
                      </Box>
                    ) : (
                      <Box width="60vw">
                        <LinearProgress color="secondary" />
                      </Box>
                    )}

                    {/* <Box
												display="flex"
												alignSelf="flex-end"
												marginTop="8px"
												justifyContent="space-between"
											>
												<Pagination
													variant="outlined"
													color="secondary"
													size="large"
													count={listaContas.last_page}
													onChange={handleChangePage}
													page={page}
												/>
											</Box> */}
                  </Box>

                  <Box
                    style={{
                      width: "100%",
                      alignSelf: "flex-end",
                      marginTop: "50px",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        /* marginTop: '200px', */
                      }}
                    >
                      {hasPermission() ? (
                        <CustomButton
                          variant="contained"
                          /* type="submit" */
                          color="purple"
                          onClick={() => setOpenModal(true)}
                        >
                          <Typography
                            style={{
                              fontSize: "15px",
                              color: "white",
                            }}
                          >
                            Criar representante
                          </Typography>
                        </CustomButton>
                      ) : null}
                    </Box>

                    <Modal
                      open={openModal}
                      onBackdropClick={() => setOpenModal(false)}
                    >
                      <Box className={classes.modal}>
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "5%",
                          }}
                        >
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "baseline",
                            }}
                          >
                            <Typography
                              style={{
                                fontFamily: "Montserrat-Regular",
                                fontSize: "19px",
                                color: APP_CONFIG.mainCollors.primary,
                                marginTop: "30px",
                              }}
                            >
                              Adicionar representante
                            </Typography>
                            <Box>
                              <CustomCloseButton
                                color="purple"
                                onClick={() => setOpenModal(false)}
                              />
                            </Box>
                          </Box>
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginTop: "30px",
                            }}
                          >
                            <TextField
                              required
                              variant="standard"
                              label="Nome"
                              fullWidth
                              value={dadosRepresentante.nome}
                              error={errorsRepresentante.nome}
                              helperText={
                                errorsRepresentante.nome
                                  ? errorsRepresentante.nome.join(" ")
                                  : null
                              }
                              onChange={(e) =>
                                setDadosRepresentante({
                                  ...dadosRepresentante,
                                  nome: e.target.value,
                                })
                              }
                            />
                            <ReactInputMask
                              mask="999.999.999-99"
                              value={dadosRepresentante.documento}
                              onChange={(e) =>
                                setDadosRepresentante({
                                  ...dadosRepresentante,
                                  documento: e.target.value,
                                })
                              }
                            >
                              {() => (
                                <TextField
                                  style={{
                                    marginTop: "20px",
                                  }}
                                  required
                                  variant="standard"
                                  label="CPF"
                                  fullWidth
                                  error={errorsRepresentante.documento}
                                  helperText={
                                    errorsRepresentante.documento
                                      ? errorsRepresentante.documento.join(" ")
                                      : null
                                  }
                                />
                              )}
                            </ReactInputMask>
                            <TextField
                              style={{ marginTop: "20px" }}
                              required
                              variant="standard"
                              label="E-mail"
                              fullWidth
                              value={dadosRepresentante.email}
                              error={errorsRepresentante.email}
                              helperText={
                                errorsRepresentante.email
                                  ? errorsRepresentante.email.join(" ")
                                  : null
                              }
                              onChange={(e) =>
                                setDadosRepresentante({
                                  ...dadosRepresentante,
                                  email: e.target.value,
                                })
                              }
                            />
                            <ReactInputMask
                              mask="(99) 99999-9999"
                              value={dadosRepresentante.celular}
                              onChange={(e) =>
                                setDadosRepresentante({
                                  ...dadosRepresentante,
                                  celular: e.target.value,
                                })
                              }
                            >
                              {() => (
                                <TextField
                                  style={{
                                    marginTop: "20px",
                                  }}
                                  required
                                  variant="standard"
                                  label="Celular"
                                  fullWidth
                                  error={errorsRepresentante.celular}
                                  helperText={
                                    errorsRepresentante.celular
                                      ? errorsRepresentante.celular.join(" ")
                                      : null
                                  }
                                />
                              )}
                            </ReactInputMask>
                          </Box>
                          <Box style={{ marginTop: "20px" }}>
                            <Typography
                              style={{
                                fontFamily: "Montserrat-Regular",
                                fontSize: "14px",
                                color: APP_CONFIG.mainCollors.primary,
                                marginTop: "10px",
                              }}
                            >
                              Representante tem amplos poderes para fazer
                              operações bancárias em nome da empresa?
                            </Typography>
                            <Box
                              style={{
                                display: "flex",
                                marginTop: "10px",
                              }}
                            >
                              <Checkbox
                                color="primary"
                                checked={fillCheckboxSim}
                                onChange={() => {
                                  setFillCheckboxSim(true);
                                  setFillCheckboxNao(false);
                                  setDadosRepresentante({
                                    ...dadosRepresentante,
                                    permissao: true,
                                  });
                                }}
                              />
                              <Typography
                                style={{
                                  fontFamily: "Montserrat-Regular",
                                  fontSize: "14px",
                                  color: APP_CONFIG.mainCollors.primary,
                                  marginTop: "10px",
                                }}
                              >
                                Sim
                              </Typography>

                              <Checkbox
                                color="primary"
                                checked={fillCheckboxNao}
                                onChange={() => {
                                  setFillCheckboxSim(false);
                                  setFillCheckboxNao(true);
                                  setDadosRepresentante({
                                    ...dadosRepresentante,
                                    permissao: false,
                                  });
                                }}
                              />
                              <Typography
                                style={{
                                  fontFamily: "Montserrat-Regular",
                                  fontSize: "14px",
                                  color: APP_CONFIG.mainCollors.primary,
                                  marginTop: "10px",
                                }}
                              >
                                Não
                              </Typography>
                            </Box>
                            <Box
                              style={{
                                display: "flex",
                                marginTop: "50px",
                                justifyContent: "center",
                              }}
                            >
                              <CustomButton
                                variant="contained"
                                /* type="submit" */
                                color="purple"
                                onClick={handleAdicionarRepresentante}
                              >
                                <Typography
                                  style={{
                                    fontSize: "13px",
                                    color: "white",
                                  }}
                                >
                                  Adicionar representante
                                </Typography>
                              </CustomButton>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Modal>
                  </Box>
                  {/* </Box> */}
                </Box>
              </TabPanel>
              <TabPanel value={value} index={3} dir={theme.direction}>
                <Box
                  style={{
                    minHeight: 600,
                    display: "flex",
                    flexDirection: "column",

                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
                        fontSize: "16px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "30px",
                      }}
                    >
                      Tokens Públicos
                    </Typography>
                    <Box className={classes.tableContainer}>
                      {gerarToken ? (
                        <Box minWidth={!matches ? "800px" : null}>
                          <TableContainer style={{ overflowX: "auto" }}>
                            <CustomTable
                              columns={columnsToken ? columnsToken : null}
                              data={gerarToken}
                              Editar={EditarToken}
                            />
                          </TableContainer>
                        </Box>
                      ) : (
                        <Box width="60vw">
                          <LinearProgress color="secondary" />
                        </Box>
                      )}
                    </Box>

                    <Box
                      style={{
                        width: "100%",
                        alignSelf: "flex-end",
                        marginTop: "50px",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <CustomButton
                          variant="contained"
                          color="purple"
                          onClick={() => setModalToken(true)}
                        >
                          <Typography
                            style={{
                              fontSize: "15px",
                              color: "white",
                            }}
                          >
                            Gerar Token
                          </Typography>
                        </CustomButton>
                      </Box>

                      <Modal
                        open={modalToken}
                        onBackdropClick={() => setModalToken(false)}
                      >
                        <Box className={classes.modal}>
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "5%",
                            }}
                          >
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                              }}
                            >
                              <Typography
                                style={{
                                  fontFamily: "Montserrat-Regular",
                                  fontSize: "19px",
                                  color: APP_CONFIG.mainCollors.primary,
                                  marginTop: "30px",
                                }}
                              >
                                Gerar Token
                              </Typography>
                              <Box>
                                <CustomCloseButton
                                  color="purple"
                                  onClick={() => setModalToken(false)}
                                />
                              </Box>
                            </Box>
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "30px",
                              }}
                            >
                              <TextField
                                required
                                variant="standard"
                                label="Nome"
                                fullWidth
                                value={nomeToken}
                                error={errorsGerarToken.nome}
                                helperText={
                                  errorsGerarToken.nome
                                    ? errorsGerarToken.nome.join(" ")
                                    : null
                                }
                                onChange={(e) => setNomeToken(e.target.value)}
                              />
                            </Box>
                            <Box
                              style={{
                                display: "flex",
                                marginTop: "50px",
                                justifyContent: "center",
                              }}
                            >
                              <CustomButton
                                variant="contained"
                                color="purple"
                                onClick={handleCriarToken}
                              >
                                <Typography
                                  style={{
                                    fontSize: "13px",
                                    color: "white",
                                  }}
                                >
                                  Adicionar Token
                                </Typography>
                              </CustomButton>
                            </Box>
                          </Box>
                        </Box>
                      </Modal>
                      <Dialog
                        open={modalCopiarToken}
                        style={{
                          paddingTop: 0,
                          minWidth: 600, // Ajuste este valor conforme necessário
                          wordWrap: "break-word", // Permitir quebras de palavra
                        }}
                      >
                        <DialogTitle
                          style={{
                            paddingBottom: 0,
                          }}
                        >
                          Gerar Token
                        </DialogTitle>
                        <DialogContent
                          style={{
                            paddingTop: 0,
                            minWidth: 500,
                          }}
                        >
                          <Typography style={{ lineBreak: true }}>
                            Código do token: {publicToken.token}
                          </Typography>
                          <Tooltip title="Copiar">
                            <CopyToClipboard text={publicToken.token}>
                              <Button
                                aria="Copiar"
                                style={{
                                  marginLeft: "6px",
                                  width: "60px",
                                  height: "20px",
                                  alignSelf: "center",
                                  color: "green",
                                }}
                                onClick={() =>
                                  toast.success("Link copiado com sucesso", {
                                    autoClose: 2000,
                                  })
                                }
                              >
                                <FontAwesomeIcon
                                  style={{
                                    width: "60px",
                                    height: "20px",
                                  }}
                                  icon={faCopy}
                                />
                              </Button>
                            </CopyToClipboard>
                          </Tooltip>

                          <Typography variant="overline">
                            Importante: O código só poderá ser acessado desta
                            vez, então salve em um arquivo de texto separado.
                          </Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            variant="outlined"
                            onClick={() => setModalCopiarToken(false)}
                          >
                            Fechar
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                    {/* </Box> */}
                  </Box>
                </Box>
              </TabPanel>
            </SwipeableViews>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
