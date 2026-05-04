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
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import CustomButton from "../../components/CustomButton/CustomButton";
/* import CustomHeader from '../../components/CustomHeader/CustomHeader'; */
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

import {
  delDocumento,
  deleteUserRepresentanteAction,
  getReenviarDocumentoSocioAction,
  getReenviarTokenUsuarioAction,
  getSincronizarContaAction,
  loadContaId,
  loadUserData,
  postDocumentoActionAdm,
  postUserRepresentanteAction,
  updateConta,
} from "../../actions/actions";
import useAuth from "../../hooks/useAuth";

import ClearIcon from "@material-ui/icons/Clear";
import SettingsIcon from "@material-ui/icons/Settings";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { DropzoneAreaBase } from "material-ui-dropzone";
import SwipeableViews from "react-swipeable-views";
import CustomCloseButton from "../../components/CustomCloseButton/CustomCloseButton";
import CustomCollapseTableEditDocumentosRepresentantes from "../../components/CustomCollapseTableEditDocumentosRepresentantes/CustomCollapseTableEditDocumentosRepresentantes";
import CustomCollapseTableEditSocios from "../../components/CustomCollapseTableEditSocios/CustomCollapseTableEditSocios";
import NewAccount from "../../components/NewAccount/NewAccount";
import { APP_CONFIG } from "../../constants/config";
import usePermission from "../../hooks/usePermission";
import { putEditartUser } from "../../services/services";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",

    /* flexGrow: 1, */
    /* width: '100vw',
		height: '100vh', */
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
    marginTop: "0px",

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
}));

const a11yProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

const TabPanel = (props) => {
  const { children, value, index, show = false, ...other } = props;

  if (!show) return null;

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
export default function EditarDadosDaContaPj() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const contaId = useSelector((state) => state.conta);
  const userData = useSelector((state) => state.userData);
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [errosConta, setErrosConta] = useState({});
  const [errorsRepresentante, setErrorsRepresentante] = useState("");
  const { hasPermission, PERMISSIONS } = usePermission();
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
    conta_id: id,
    nome: "",
    documento: "",
    email: "",
    celular: "",
    permissao: null,
  });

  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [excluirId, setExcluirId] = useState("");

  useEffect(() => {
    setConta({ ...contaId });
  }, [contaId]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(loadContaId(token, id, true, false, true));
  }, [userData]);

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
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id, true, false, true));
    setLoading(false);
  };
  const onDropContratoSocial = async (picture) => {
    setLoading(true);

    const categoria = "PAGINA_CONTRATO_SOCIAL";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id, true, false, true));
    setLoading(false);
  };
  const onDropPaginaProcuracao = async (picture) => {
    setLoading(true);

    const categoria = "PAGINA_PROCURACAO";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id, true, false, true));
    setLoading(false);
  };
  const onDropPaginaAtaEleicaoDiretores = async (picture) => {
    setLoading(true);

    const categoria = "PAGINA_ATA_ELEICAO_DIRETORES";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id, true, false, true));
    setLoading(false);
  };

  const onDropComprovanteFaturamento = async (picture) => {
    setLoading(true);

    const categoria = "COMPROVANTE_FATURAMENTO";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id, true, false, true));
    setLoading(false);
  };
  //documentos PJ

  /* const onDropCNHfrente = async (picture) => {
		setLoading(true);

		const categoria = 'CNH_FRENTE';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id, true, false, true));
		setLoading(false);
	};

	const onDropCNHverso = async (picture) => {
		setLoading(true);

		const categoria = 'CNH_VERSO';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id, true, false, true));
		setLoading(false);
	};

	const onDropRGfrente = async (picture) => {
		setLoading(true);

		const categoria = 'RG_FRENTE';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id, true, false, true));
		setLoading(false);
	};

	const onDropRGverso = async (picture) => {
		setLoading(true);

		const categoria = 'RG_VERSO';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id, true, false, true));
		setLoading(false);
	};

	const onDropSelfie = async (picture) => {
		setLoading(true);

		const categoria = 'SELFIE';
		await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
		await dispatch(loadContaId(token, id, true, false, true));
		setLoading(false);
	}; */
  // documentos socio (removido)

  const handleExcluirArquivo = async (item) => {
    setLoading(true);
    const resExcluirArquivo = await dispatch(delDocumento(token, excluirId));
    if (resExcluirArquivo) {
      toast.error("Erro ao excluir documento");
      setLoading(false);
    } else {
      setOpenModalExcluir(false);
      toast.success("Documento excluído com sucesso!");
      setLoading(false);
      await dispatch(loadContaId(token, id, true, false, true));
    }
  };

  const handleAlterar = async () => {
    setLoading(true);
    const resConta = await dispatch(updateConta(token, conta, id));
    if (resConta) {
      setErrosConta(resConta);
      toast.error("Erro ao alterar dados");
      setLoading(false);
    } else {
      toast.success("Dados alterados com sucesso!");
      setLoading(false);
      await dispatch(loadContaId(token, id, true, false, true));
    }
  };

  const handleSincronizarDados = async () => {
    setLoading(true);
    const resSincronizar = await dispatch(getSincronizarContaAction(token, id));
    if (resSincronizar) {
      toast.error("Erro ao sincronizar dados");
      setLoading(false);
    } else {
      toast.success("Dados sincronizados com sucesso!");
      setLoading(false);
      dispatch(loadContaId(token, id, true, false, true));
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
      await dispatch(loadContaId(token, id, true, false, true));
      setOpenModal(false);
    }
  };

  const itemColumnsSocio = [
    {
      headerText: "Arquivo",
      key: "",
      FullObject: (item) => {
        return (
          <Card>
            <CardActionArea>
              <Box position="absolute">
                <IconButton
                  onClick={() => {
                    setOpenModalExcluir(true);
                    setExcluirId(item.id);
                  }}
                  size="small"
                  style={{
                    color: "white",
                    backgroundColor: "red",
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Box>
              {item.arquivo.includes(".pdf") ? (
                <>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100px",
                    }}
                    onClick={() => window.open(item.arquivo)}
                  >
                    <PictureAsPdfIcon
                      style={{
                        color: "black",
                        fontSize: "70px",
                      }}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <CardMedia
                    component="img"
                    alt="Arquivo de Identificação"
                    height="100"
                    image={item.arquivo}
                    onClick={() => window.open(item.arquivo)}
                  />
                </>
              )}
            </CardActionArea>
          </Card>
        );

        /* if (value.includes('.pdf')) {
					return (
						<Box
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								height: '100px',
							}}
							onClick={() => window.open(value)}
						>
							<PictureAsPdfIcon
								style={{
									color: 'black',
									fontSize: '70px',
								}}
							/>
						</Box>
					);
				} else {
					return (
						<CardMedia
							component="img"
							alt="Arquivo de Identificação"
							height="100"
							image={value}
							onClick={() => window.open(value)}
						/>
					);
				} */
      },
    },
    { headerText: "Tipo", key: "tipo" },
    { headerText: "Status", key: "status" },
  ];
  const itemColumnsRepresentante = [
    {
      headerText: "Arquivo",
      key: "operador_onboard.documento_frente_operador_onboard",
      CustomValue: (value) => {
        if (value.includes(".pdf")) {
          return (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100px",
              }}
              onClick={() => window.open(value)}
            >
              <PictureAsPdfIcon
                style={{
                  color: "black",
                  fontSize: "70px",
                }}
              />
            </Box>
          );
        } else {
          return (
            <CardMedia
              component="img"
              alt="Arquivo de Identificação"
              height="100"
              image={value}
              onClick={() => window.open(value)}
            />
          );
        }
      },
    },
    {
      headerText: "Tipo",
      key: "email",
      CustomValue: (value) => {
        return (
          <Typography style={{ lineBreak: "loose", fontSize: "0.7rem" }}>
            {value}
          </Typography>
        );
      },
    },
  ];
  const columnsSocio = [
    { headerText: "Nome", key: "nome" },
    {
      headerText: "Documento",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "E-mail", key: "email" },
    {
      headerText: "Celular",
      key: "telefone",
      CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
    },
    {
      headerText: "Admin",
      key: "admin",
      CustomValue: (value) => {
        if (value === true) {
          return "Sim";
        } else {
          return "Não";
        }
      },
    },
    { headerText: "", key: "menu" },
  ];
  const columnsRepresentante = [
    { headerText: "Nome", key: "nome" },
    { headerText: "Operador", key: "operador" },
    {
      headerText: "Documento",
      key: "documento_operador",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "E-mail",
      key: "email",
      CustomValue: (value) => {
        return (
          <Typography style={{ lineBreak: "loose", fontSize: "0.7rem" }}>
            {value}
          </Typography>
        );
      },
    },
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
    {
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
    },
    { headerText: "", key: "menu" },
  ];

  const EditarSocio = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleReenviarDocumentoSocio = async (row) => {
      setLoading(true);
      const resAprovar = await dispatch(
        getReenviarDocumentoSocioAction(token, row.row.id),
      );
      if (resAprovar) {
        toast.error("Falha ao reenviar documento");
        toast.warning(
          "Para reenviar documentos é necessário apagar fotos anexadas",
        );
        setLoading(false);
      } else {
        toast.success("Documento reenviado com sucesso!");
        await dispatch(loadContaId(token, id, true, false, true));
        setLoading(false);
      }
      setAnchorEl(null);
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
              handleReenviarDocumentoSocio(row);
            }}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Solicitar Reenvio de Documento Sócio
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [
      showModalEditarDadosRepresentante,
      setShowModalEditarDadosRepresentante,
    ] = useState(false);
    const [excluirId, setExcluirId] = useState("");

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleEditar = (row) => {
      setShowModalEditarDadosRepresentante({
        ...showModalEditarDadosRepresentante,
        nome: row.row.nome,
        documento: row.row.documento,
        email: row.row.email,
        celular: row.row.celular,
        permissao: row.row.permissao_master,
      });
    };

    const handleEditarRepresentante = async () => {
      setLoading(true);
      try {
        await putEditartUser(
          token,
          row.row.id,
          showModalEditarDadosRepresentante,
        );
        dispatch(loadContaId(token, id, true, false, true));
        toast.success("Representante editado com sucesso");
      } catch (err) {
        console.log(err);
        toast.error("Erro ao editar representante");
      }
      setShowModalEditarDadosRepresentante(false);
      setLoading(false);
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
        toast.success("Representante excluido com sucesso");
        await dispatch(loadContaId(token, id, true, false, true));
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
          <MenuItem
            onClick={() => handleEditar(row)}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Editar
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
          open={!!showModalEditarDadosRepresentante}
          onBackdropClick={() => setShowModalEditarDadosRepresentante(false)}
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
                  Editar representante
                </Typography>
                <Box>
                  <CustomCloseButton
                    color="purple"
                    onClick={() => setShowModalEditarDadosRepresentante(false)}
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
                  disabled
                  required
                  variant="standard"
                  label="Nome"
                  fullWidth
                  value={showModalEditarDadosRepresentante.nome}
                  onChange={(e) =>
                    setShowModalEditarDadosRepresentante({
                      ...showModalEditarDadosRepresentante,
                      nome: e.target.value,
                    })
                  }
                />
                <TextField
                  disabled
                  style={{ marginTop: "20px" }}
                  required
                  variant="standard"
                  label="CPF"
                  fullWidth
                  value={showModalEditarDadosRepresentante.documento}
                  onChange={(e) =>
                    setShowModalEditarDadosRepresentante({
                      ...showModalEditarDadosRepresentante,
                      documento: e.target.value,
                    })
                  }
                />

                <TextField
                  disabled
                  style={{ marginTop: "20px" }}
                  required
                  variant="standard"
                  label="E-mail"
                  fullWidth
                  value={showModalEditarDadosRepresentante.email}
                  onChange={(e) =>
                    setShowModalEditarDadosRepresentante({
                      ...showModalEditarDadosRepresentante,
                      email: e.target.value,
                    })
                  }
                />

                <TextField
                  disabled
                  style={{ marginTop: "20px" }}
                  required
                  variant="standard"
                  label="Celular"
                  fullWidth
                  value={showModalEditarDadosRepresentante.celular}
                  onChange={(e) =>
                    setShowModalEditarDadosRepresentante({
                      ...showModalEditarDadosRepresentante,
                      celular: e.target.value,
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

                <Box style={{ display: "flex", marginTop: "10px" }}>
                  <Checkbox
                    color="primary"
                    checked={showModalEditarDadosRepresentante?.permissao}
                    onChange={() => {
                      setShowModalEditarDadosRepresentante({
                        ...showModalEditarDadosRepresentante,
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
                    checked={!showModalEditarDadosRepresentante?.permissao}
                    onChange={() => {
                      setShowModalEditarDadosRepresentante({
                        ...showModalEditarDadosRepresentante,
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
                    color="purple"
                    onClick={handleEditarRepresentante}
                  >
                    <Typography
                      style={{
                        fontSize: "13px",
                        color: "white",
                      }}
                    >
                      Editar representante
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

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <Box className={classes.dadosBox}>
          <Paper
            className={classes.paper}
            style={
              /* value === 3
								? {
										width: '100%',
										borderTopRightRadius: 27,
										borderTopLeftRadius: 27,
								  }
								: */ {
                width: "100%",
                borderTopRightRadius: 27,
                borderTopLeftRadius: 27,
              }
            }
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
                indicatorcolor={APP_CONFIG.mainCollors.primary}
                //textColor="primary"
                variant="fullWidth"
              >
                <Tab
                  label="Dados Cadastrais"
                  style={{
                    width: "200%",
                    borderBottom: getIndicatorColor(0),
                  }}
                  {...a11yProps(0)}
                  disabled={!hasPermission(PERMISSIONS.contas.details.view)}
                />
                <Tab
                  label="Documentos"
                  style={{
                    width: "200%",
                    borderBottom: getIndicatorColor(1),
                  }}
                  {...a11yProps(1)}
                  disabled={
                    !hasPermission(PERMISSIONS.contas.details.view_documents)
                  }
                />
                <Tab
                  label="Sócios"
                  style={{
                    width: "200%",
                    borderBottom: getIndicatorColor(2),
                  }}
                  {...a11yProps(2)}
                  disabled={
                    !hasPermission(PERMISSIONS.contas.details.view_partners)
                  }
                />
                <Tab
                  label="Representantes"
                  style={{
                    width: "200%",
                    borderBottom: getIndicatorColor(3),
                  }}
                  {...a11yProps(3)}
                  disabled={
                    !hasPermission(
                      PERMISSIONS.contas.details.view_representatives,
                    )
                  }
                />
              </Tabs>
            </AppBar>

            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel
                value={value}
                index={0}
                dir={theme.direction}
                show={hasPermission(PERMISSIONS.contas.details.view)}
              >
                <NewAccount
                  conta={conta}
                  setConta={setConta}
                  errosConta={errosConta}
                  disableEditar="true"
                />

                <Box display="flex" justifyContent="flex-end" marginTop="16px">
                  {contaId &&
                  (contaId.status === "divergence" ||
                    contaId.status === "pending" ||
                    contaId.status === "incomplete") ? (
                    <CustomButton onClick={handleAlterar}>Alterar</CustomButton>
                  ) : (
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "Montserrat-Regular",
                          fontSize: "14px",
                          color: APP_CONFIG.mainCollors.primary,
                        }}
                      >
                        Para alteração de dados cadastrais em contas aprovadas,
                        será necessário solicitação via ticket no zendesk.
                      </Typography>
                      <Box style={{ marginTop: "10px" }}>
                        <CustomButton
                          onClick={handleSincronizarDados}
                          disabled={
                            !hasPermission(PERMISSIONS.contas.details.sync_data)
                          }
                        >
                          Sincronizar Dados
                        </CustomButton>
                      </Box>
                    </Box>
                  )}
                </Box>
              </TabPanel>

              <TabPanel
                value={value}
                index={1}
                dir={theme.direction}
                show={hasPermission(PERMISSIONS.contas.details.view_documents)}
              >
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
                          toast.error("Tamanho máximo: 3mb ");
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
                                        <Box position="absolute">
                                          <IconButton
                                            onClick={() => {
                                              setOpenModalExcluir(true);
                                              setExcluirId(item?.id);
                                            }}
                                            size="small"
                                            style={{
                                              color: "white",
                                              backgroundColor: "red",
                                            }}
                                          >
                                            <ClearIcon />
                                          </IconButton>
                                        </Box>
                                        {item.arquivo.includes(".pdf") ? (
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
                  <Grid item sm={6} xs={12}>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "12px",
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
                          toast.error("Tamanho máximo: 3mb ");
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
                                        <Box position="absolute">
                                          <IconButton
                                            onClick={() => {
                                              setOpenModalExcluir(true);
                                              setExcluirId(item?.id);
                                            }}
                                            size="small"
                                            style={{
                                              color: "white",
                                              backgroundColor: "red",
                                            }}
                                          >
                                            <ClearIcon />
                                          </IconButton>
                                        </Box>
                                        {item.arquivo.includes(".pdf") ? (
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
                          toast.error("Tamanho máximo: 3mb ");
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
                                        <Box position="absolute">
                                          <IconButton
                                            onClick={() => {
                                              setOpenModalExcluir(true);
                                              setExcluirId(item?.id);
                                            }}
                                            size="small"
                                            style={{
                                              color: "white",
                                              backgroundColor: "red",
                                            }}
                                          >
                                            <ClearIcon />
                                          </IconButton>
                                        </Box>
                                        {item.arquivo.includes(".pdf") ? (
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
                          toast.error("Tamanho máximo: 3mb ");
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
                                        <Box position="absolute">
                                          <IconButton
                                            onClick={() => {
                                              setOpenModalExcluir(true);
                                              setExcluirId(item?.id);
                                            }}
                                            size="small"
                                            style={{
                                              color: "white",
                                              backgroundColor: "red",
                                            }}
                                          >
                                            <ClearIcon />
                                          </IconButton>
                                        </Box>
                                        {item.arquivo.includes(".pdf") ? (
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
                  <Grid item sm={6} xs={12}>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "0px",
                      }}
                    >
                      Comprovante de Faturamento*
                    </Typography>
                    <Box className={classes.dropzoneContainer} boxShadow={3}>
                      <DropzoneAreaBase
                        dropzoneParagraphClass={classes.textoDropzone}
                        maxFileSize={3145728}
                        onDropRejected={() => {
                          toast.error("Tamanho máximo: 3mb ");
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
                                item.categoria === "COMPROVANTE_FATURAMENTO" ? (
                                  <Grid item xs={6}>
                                    <Card className={classes.card}>
                                      <CardActionArea>
                                        <Box position="absolute">
                                          <IconButton
                                            onClick={() => {
                                              setOpenModalExcluir(true);
                                              setExcluirId(item?.id);
                                            }}
                                            size="small"
                                            style={{
                                              color: "white",
                                              backgroundColor: "red",
                                            }}
                                          >
                                            <ClearIcon />
                                          </IconButton>
                                        </Box>
                                        {item.arquivo.includes(".pdf") ? (
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
                </Grid>
              </TabPanel>

              <TabPanel
                value={value}
                index={2}
                dir={theme.direction}
                show={hasPermission(PERMISSIONS.contas.details.view_partners)}
              >
                <Box
                  style={{
                    minHeight: 600,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "17px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "30px",
                        marginBottom: "20px",
                      }}
                    >
                      Sócios
                    </Typography>

                    <Box
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      {contaId.socio ? (
                        <Box>
                          <CustomCollapseTableEditSocios
                            itemColumns={itemColumnsSocio}
                            columns={columnsSocio ? columnsSocio : null}
                            data={contaId.socio}
                            Editar={EditarSocio}
                          />
                        </Box>
                      ) : (
                        <Box>
                          <LinearProgress color="secondary" />
                        </Box>
                      )}
                    </Box>

                    <Box
                      style={{
                        width: "100%",
                        alignSelf: "flex-end",
                        marginTop: "300px",
                      }}
                    ></Box>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel
                value={value}
                index={3}
                dir={theme.direction}
                show={hasPermission(
                  PERMISSIONS.contas.details.view_representatives,
                )}
              >
                <Box
                  style={{
                    minHeight: 600,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "17px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "30px",
                        marginBottom: "20px",
                      }}
                    >
                      Representantes
                    </Typography>

                    <Box
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      {contaId.representante ? (
                        <Box>
                          <CustomCollapseTableEditDocumentosRepresentantes
                            itemColumns={itemColumnsRepresentante}
                            columns={
                              columnsRepresentante ? columnsRepresentante : null
                            }
                            data={contaId.representante}
                            Editar={Editar}
                          />
                        </Box>
                      ) : (
                        <Box>
                          <LinearProgress color="secondary" />
                        </Box>
                      )}
                    </Box>

                    <Box
                      style={{
                        width: "100%",
                        alignSelf: "flex-end",
                        marginTop: "300px",
                      }}
                    ></Box>
                  </Box>
                </Box>
              </TabPanel>
            </SwipeableViews>
          </Paper>
        </Box>
      </Box>
      <Dialog
        open={openModalExcluir}
        onClose={() => setOpenModalExcluir(false)}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <LoadingScreen isLoading={loading} />
        <DialogTitle
          style={{
            color: APP_CONFIG.mainCollors.primary,
            fontFamily: "Montserrat-SemiBold",
          }}
        >
          Deseja excluir esse documento?
        </DialogTitle>

        <DialogContent
          style={{
            minWidth: 500,
          }}
        ></DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => handleExcluirArquivo()}
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
    </Box>
  );
}
