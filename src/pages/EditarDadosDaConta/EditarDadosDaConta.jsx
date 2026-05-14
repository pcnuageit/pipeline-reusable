import {
  AppBar,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  delDocumento,
  getEnviarDocumentoIdWallAction,
  loadContaId,
  loadPerfilTaxaAction,
  postDesvincularPerfilTaxaAction,
  postDocumentoActionAdm,
  postVincularPerfilTaxaAction,
  updateConta,
} from "../../actions/actions";

import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import ClearIcon from "@material-ui/icons/Clear";
import SettingsIcon from "@material-ui/icons/Settings";
import WarningIcon from "@material-ui/icons/Warning";
import { DropzoneAreaBase } from "material-ui-dropzone";
import CurrencyFormat from "react-currency-format";
import SwipeableViews from "react-swipeable-views";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import NewAccount from "../../components/NewAccount/NewAccount";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

const options = {
  displayType: "text",
  thousandSeparator: ".",
  decimalSeparator: ",",
  prefix: "R$ ",
  decimalScale: 2,
  fixedDecimalScale: true,
};

const taxaColumns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      const date = new Date(data);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const formatted = date.toLocaleDateString("pt-br", option);
      return (
        <Box display="flex" justifyContent="center">
          <FontAwesomeIcon icon={faCalendar} size="lg" />
          <Typography style={{ marginLeft: "6px" }}>{formatted}</Typography>
        </Box>
      );
    },
  },
  {
    headerText: "Nome",
    key: "nome",
    CustomValue: (nome) => <Typography>{nome}</Typography>,
  },
  {
    headerText: "Recebimento Maquina Virtual",
    key: "cash_in_payout_zoop",
    CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
  },
  {
    headerText: "Recebimento Boleto",
    key: "cash_in_boleto",
    CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
  },
  {
    headerText: "Recebimento TED",
    key: "cash_in_ted",
    CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
  },
  {
    headerText: "Recebimento PIX",
    key: "cash_in_pix",
    CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
  },
  {
    headerText: "Recebimento P2P",
    key: "cash_in_p2p",
    CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
  },
  {
    headerText: "Trânsferencia P2P",
    key: "cash_out_p2p",
    CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
  },
  {
    headerText: "Trânsferencia TED",
    key: "cash_out_ted",
    CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
  },
  {
    headerText: "Trânsferencia PIX",
    key: "cash_out_pix",
    CustomValue: (taxa) => <CurrencyFormat {...options} value={taxa} />,
  },
  {
    headerText: "Vincular",
    key: "menu",
  },
];

const itemColumns = [
  {
    headerText: "Nome",
    key: "nome",
    CustomValue: (nome) => <Typography>{nome}</Typography>,
  },
  {
    headerText: "Documento",
    key: "documento",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
  {
    headerText: "Celular",
    key: "celular",
    CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
  },
  {
    headerText: "Email",
    key: "email",
    CustomValue: (email) => <Typography>{email}</Typography>,
  },
  {
    headerText: "Razão Social",
    key: "razao_social",
    CustomValue: (razao_social) => (
      <Typography>{razao_social !== null ? razao_social : "*"}</Typography>
    ),
  },
  {
    headerText: "CNPJ",
    key: "cnpj",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  layout: {
    width: "800px",
    marginLeft: "auto",
    marginRight: "auto",
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

const EditarDadosDaConta = () => {
  const [disabled, setDisabled] = useState(false);
  const classes = useStyles();
  const { id } = useParams();
  const token = useAuth();
  const dispatch = useDispatch();
  const contaId = useSelector((state) => state.conta);
  const perfilTaxas = useSelector((state) => state.perfilTaxas);

  useEffect(() => {
    dispatch(loadContaId(token, id));
  }, []);

  const theme = useTheme();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [errosConta, setErrosConta] = useState({});
  const [page, setPage] = useState(1);
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

  const [contaBancaria, setContaBancaria] = useState({
    banco: "",
    agencia: "",
    tipo: "1",
    conta: "",
  });

  useEffect(() => {
    setConta({ ...contaId });
  }, [contaId]);

  useEffect(() => {
    dispatch(loadContaId(token, id));
  }, []);

  useEffect(() => {
    dispatch(loadPerfilTaxaAction(token, filters.like));
  }, [page, debouncedLike]);

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
      history.push("/dashboard/lista-de-contas");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const getIndicatorColor = (index) =>
    index === value ? `2px solid ${APP_CONFIG.mainCollors.primary}` : null;

  const handleExcluirArquivo = async (item) => {
    await dispatch(delDocumento(token, item.id));
  };

  const onDropCNHfrente = async (picture) => {
    setLoading(true);

    const categoria = "CNH_FRENTE";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id));
    setLoading(false);
  };

  const onDropCNHverso = async (picture) => {
    setLoading(true);

    const categoria = "CNH_VERSO";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id));
    setLoading(false);
  };

  const onDropRGfrente = async (picture) => {
    setLoading(true);

    const categoria = "RG_FRENTE";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id));
    setLoading(false);
  };

  const onDropRGverso = async (picture) => {
    setLoading(true);

    const categoria = "RG_VERSO";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id));
    setLoading(false);
  };

  const onDropSelfie = async (picture) => {
    setLoading(true);

    const categoria = "SELFIE";
    await dispatch(postDocumentoActionAdm(token, picture, categoria, id));
    await dispatch(loadContaId(token, id));
    setLoading(false);
  };

  const handleEnviarDocumentoIdWall = async () => {
    setLoading(true);
    const resIdWall = await dispatch(getEnviarDocumentoIdWallAction(token, id));
    if (resIdWall === false) {
      setDisabled(true);
      toast.success("Reenviado com sucesso");
      setLoading(false);
    } else {
      toast.error("Falha ao reenviar");
      setLoading(false);
    }
  };

  const Editar = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleVincular = async () => {
      setLoading(true);
      setAnchorEl(null);
      const res = await dispatch(
        postVincularPerfilTaxaAction(token, row.id, id),
      );
      if (res) {
        toast.error("Erro ao vincular taxa");
        setLoading(false);
      } else {
        toast.success("Taxa vinculada com sucesso");
        await dispatch(loadPerfilTaxaAction(token, ""));
        setLoading(false);
      }
    };

    const handleDesvincular = async () => {
      setLoading(true);
      setAnchorEl(null);
      const { success, status } = await dispatch(
        postDesvincularPerfilTaxaAction(token, id, row.id),
      );

      if (success) {
        setLoading(false);
        toast.success("Taxa desvinculada com sucesso!");
        await dispatch(loadPerfilTaxaAction(token, ""));
      } else {
        setLoading(false);
        toast.error(`Erro ao desvincular taxa: ${status}`);
      }
    };

    return (
      <Box>
        <>
          <IconButton
            style={{
              height: "15px",
              width: "10px",
            }}
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
            <MenuItem onClick={handleVincular}>Vincular</MenuItem>
            <MenuItem onClick={handleDesvincular}>Desvincular</MenuItem>
          </Menu>
        </>
      </Box>
    );
  };
  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />
      <Paper
        className={classes.paper}
        style={
          value === 3
            ? {
                width: "100%",
                borderTopRightRadius: 27,
                borderTopLeftRadius: 27,
              }
            : {
                width: "70%",
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
            />
            <Tab
              label="Documentos"
              style={{
                width: "200%",
                borderBottom: getIndicatorColor(1),
              }}
              {...a11yProps(1)}
            />
            <Tab
              label="IdWall"
              style={{
                width: "200%",
                borderBottom: getIndicatorColor(2),
              }}
              {...a11yProps(2)}
            />
            <Tab
              label="Taxas"
              style={{
                width: "200%",
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
              <CustomButton onClick={handleAlterar}>Alterar</CustomButton>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Box
              display="flex"
              style={matches ? { flexDirection: "column" } : null}
              justifyContent="center"
            >
              <Box display="flex" flexDirection="column" margin="8px">
                <Box className={classes.dropzoneContainer} boxShadow={3}>
                  <Typography
                    variant="h6"
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                  >
                    RG FRENTE
                  </Typography>

                  <DropzoneAreaBase
                    dropzoneParagraphClass={classes.textoDropzone}
                    maxFileSize={3145728}
                    onDropRejected={() => {
                      toast.error("Tamanho máximo: 3mb");
                      toast.error("Arquivos suportados: .pdf .png .jpg .jpeg");
                    }}
                    acceptedFiles={["image/*", "application/pdf"]}
                    dropzoneClass={classes.dropzoneAreaBaseClasses}
                    onAdd={onDropRGfrente}
                    filesLimit={1}
                    dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                    showPreviews={false}
                    showPreviewsInDropzone={false}
                  />
                  <Box width="300px">
                    <Grid container>
                      {contaId.documentos.map((item) =>
                        item.categoria === "RG_FRENTE" ? (
                          <Grid item xs={6}>
                            <Card className={classes.card}>
                              <CardActionArea>
                                <Box position="absolute">
                                  <IconButton
                                    onClick={() => handleExcluirArquivo(item)}
                                    size="small"
                                    style={{
                                      color: "white",
                                      backgroundColor: "red",
                                    }}
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                </Box>
                                <CardMedia
                                  component="img"
                                  alt="Arquivo de Identificação"
                                  height="100"
                                  image={item.arquivo}
                                  onClick={() => window.open(item.arquivo)}
                                />
                              </CardActionArea>
                            </Card>
                          </Grid>
                        ) : (
                          false
                        ),
                      )}
                    </Grid>
                  </Box>
                </Box>
                <Box className={classes.dropzoneContainer} boxShadow={3}>
                  <Typography
                    variant="h6"
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                  >
                    CNH
                  </Typography>

                  <DropzoneAreaBase
                    dropzoneParagraphClass={classes.textoDropzone}
                    maxFileSize={3145728}
                    onDropRejected={() => {
                      toast.error("Tamanho máximo: 3mb");
                      toast.error("Arquivos suportados: .pdf .png .jpg .jpeg");
                    }}
                    acceptedFiles={["image/*", "application/pdf"]}
                    dropzoneClass={classes.dropzoneAreaBaseClasses}
                    onAdd={onDropCNHfrente}
                    filesLimit={1}
                    dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                    showPreviews={false}
                    showPreviewsInDropzone={false}
                  />
                  <Box width="300px">
                    <Grid container>
                      {contaId.documentos.map((item) =>
                        item.categoria === "CNH_FRENTE" ? (
                          <Grid item xs={6}>
                            <Card className={classes.card}>
                              <CardActionArea>
                                <Box position="absolute">
                                  <IconButton
                                    onClick={() => handleExcluirArquivo(item)}
                                    size="small"
                                    style={{
                                      color: "white",
                                      backgroundColor: "red",
                                    }}
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                </Box>
                                <CardMedia
                                  component="img"
                                  alt="Arquivo de Identificação"
                                  height="100"
                                  image={item.arquivo}
                                  onClick={() => window.open(item.arquivo)}
                                />
                              </CardActionArea>
                            </Card>
                          </Grid>
                        ) : (
                          false
                        ),
                      )}
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" margin="8px">
                <Box className={classes.dropzoneContainer} boxShadow={3}>
                  <Typography
                    variant="h6"
                    style={{ color: APP_CONFIG.mainCollors.primary }}
                  >
                    RG VERSO
                  </Typography>

                  <DropzoneAreaBase
                    dropzoneParagraphClass={classes.textoDropzone}
                    maxFileSize={3145728}
                    onDropRejected={() => {
                      toast.error("Tamanho máximo: 3mb");
                      toast.error("Arquivos suportados: .pdf .png .jpg .jpeg");
                    }}
                    acceptedFiles={["image/*", "application/pdf"]}
                    dropzoneClass={classes.dropzoneAreaBaseClasses}
                    onAdd={onDropRGverso}
                    filesLimit={1}
                    dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                    showPreviews={false}
                    showPreviewsInDropzone={false}
                  />
                  <Box width="300px">
                    <Grid container>
                      {contaId.documentos.map((item) =>
                        item.categoria === "RG_VERSO" ? (
                          <Grid item xs={6}>
                            <Card className={classes.card}>
                              <CardActionArea>
                                <Box position="absolute">
                                  <IconButton
                                    onClick={() => handleExcluirArquivo(item)}
                                    size="small"
                                    style={{
                                      color: "white",
                                      backgroundColor: "red",
                                    }}
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                </Box>
                                <CardMedia
                                  component="img"
                                  alt="Arquivo de Identificação"
                                  height="100"
                                  image={item.arquivo}
                                  onClick={() => window.open(item.arquivo)}
                                />
                              </CardActionArea>
                            </Card>
                          </Grid>
                        ) : (
                          false
                        ),
                      )}
                    </Grid>
                  </Box>
                </Box>
                <Box style={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    /* style={{ width: '80%' }} */
                    className={classes.dropzoneContainer}
                    boxShadow={3}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      SELFIE
                    </Typography>

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
                      onAdd={onDropSelfie}
                      filesLimit={1}
                      dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                      showPreviews={false}
                      showPreviewsInDropzone={false}
                    />
                    <Box width="300px">
                      <Grid container>
                        {contaId.documentos.map((item) =>
                          item.categoria === "SELFIE" ? (
                            <Grid item xs={6}>
                              <Card className={classes.card}>
                                <CardActionArea>
                                  <Box position="absolute">
                                    <IconButton
                                      onClick={() => handleExcluirArquivo(item)}
                                      size="small"
                                      style={{
                                        color: "white",
                                        backgroundColor: "red",
                                      }}
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </Box>
                                  <CardMedia
                                    component="img"
                                    alt="Arquivo de Identificação"
                                    height="100"
                                    image={item.arquivo}
                                    onClick={() => window.open(item.arquivo)}
                                  />
                                </CardActionArea>
                              </Card>
                            </Grid>
                          ) : (
                            false
                          ),
                        )}
                      </Grid>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    width: "100%",
                    display: "flex",

                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    {contaId.validacao_idwall &&
                    contaId.validacao_idwall.mensagem
                      ? contaId.validacao_idwall.mensagem
                      : null}
                  </Box>
                  <Box>
                    {contaId.validacao_idwall &&
                    contaId.validacao_idwall.resultado &&
                    contaId.validacao_idwall.resultado === "VALID" ? (
                      <Typography style={{ color: "green" }}>VÁLIDO</Typography>
                    ) : contaId.validacao_idwall &&
                      contaId.validacao_idwall.resultado &&
                      contaId.validacao_idwall.resultado === "INVALID" ? (
                      <Typography style={{ color: "red" }}>INVÁLIDO</Typography>
                    ) : (
                      <Box display="flex" alignItems="center">
                        <WarningIcon
                          fontSize="large"
                          style={{
                            marginRight: "20px",
                            color: APP_CONFIG.mainCollors.primary,
                          }}
                        />
                        <Typography
                          style={{
                            color: APP_CONFIG.mainCollors.primary,
                          }}
                        >
                          Não há validação IdWall
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  {contaId.documentos.length > 0 && contaId.validacao_idwall
                    ? contaId.validacao_idwall.validacoes.map((item, index) => {
                        return (
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              width: "100%",
                            }}
                          >
                            <Card
                              style={{
                                padding: "10px",
                                marginTop: "10px",
                                width: "100%",
                              }}
                            >
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "10px",
                                }}
                              >
                                <AnnouncementIcon
                                  style={
                                    contaId.validacao_idwall.resultado ===
                                    "INVALID"
                                      ? { color: "red" }
                                      : {
                                          color: "#ffdc00",
                                        }
                                  }
                                />
                                <Box
                                  style={{
                                    marginLeft: "15px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Box>
                                    <Typography variant="h6">
                                      {item.nome}
                                    </Typography>
                                  </Box>
                                  <Box
                                    style={{
                                      marginTop: "5px",
                                    }}
                                  >
                                    <Typography>{item.descricao}</Typography>
                                  </Box>
                                  <Box
                                    style={{
                                      marginTop: "5px",
                                    }}
                                  >
                                    <Typography>
                                      {item.mensagem && item.mensagem}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Card>
                          </Box>
                        );
                      })
                    : null}
                </Box>
              </Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <CustomButton
                  disabled={disabled}
                  onClick={handleEnviarDocumentoIdWall}
                >
                  Reenviar
                </CustomButton>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={value} index={3} dir={theme.direction}>
            <Box
              style={{
                minHeight: 600,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  marginBottom: "20px",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Selecione a taxa para ser vinculada
              </Typography>
              {perfilTaxas && perfilTaxas.per_page ? (
                <Box minWidth={!matches ? "800px" : null}>
                  <CustomCollapseTable
                    data={perfilTaxas.data}
                    columns={taxaColumns}
                    itemColumns={itemColumns}
                    conta={true}
                    Editar={Editar}
                  />
                </Box>
              ) : (
                <LinearProgress />
              )}
            </Box>
          </TabPanel>
        </SwipeableViews>
      </Paper>
    </Box>
  );
};

export default EditarDadosDaConta;
