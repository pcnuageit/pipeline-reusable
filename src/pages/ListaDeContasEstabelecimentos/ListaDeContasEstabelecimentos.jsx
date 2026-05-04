import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Delete, ViewList } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";
import { Pagination } from "@material-ui/lab";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { Tooltip } from "@mui/material";
import { isEqual } from "lodash";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  getContasAction,
  getContasExportAction,
  getReenviarTokenUsuarioAction,
  postCriarSellerZoopAction,
  postRecusarSellerZoopAction,
} from "../../actions/actions";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import { filters_gerenciar_contas } from "../../constants/localStorageStrings";
import "../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import usePermission from "../../hooks/usePermission";
import {
  deleteConta,
  getAprovarConta,
  postAddRemoveFromBlacklist,
} from "../../services/services";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";
import px2vw from "../../utils/px2vw";

moment.locale("pt-br");

const ListaDeContasAdquirencia = () => {
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "15",
    id: "",
    seller: "",
    status: " ",
    status_adquirencia: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
    cpf: "",
    created_at: "",
  });

  const [filtersComparation] = useState({
    like: "",
    order: "",
    mostrar: "15",
    id: "",
    seller: "",
    status: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
    cpf: "",
    created_at: "",
  });

  const debouncedLike = useDebounce(filters.like, 800);
  const debouncedId = useDebounce(filters.id, 800);
  const debouncedSeller = useDebounce(filters.seller, 800);
  const debouncedNumeroDocumento = useDebounce(filters.numero_documento, 800);
  const { hasPermission, PERMISSIONS } = usePermission();
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const AbaGestao = APP_CONFIG.AbaGestao;
  const [page, setPage] = useState(1);
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const listaContas = useSelector((state) => state.contas);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
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
  const classes = useStyles();

  const getData = () => {
    dispatch(
      getContasAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        debouncedId,
        debouncedSeller,
        filters.status,
        debouncedNumeroDocumento,
        filters.tipo,
        filters.cnpj,
        "",
        false,
        "",
        true,
        false,
        "",
        filters.cpf,
        filters.created_at,
      ),
    );
  };

  useEffect(() => {
    getData();
  }, [
    page,
    debouncedLike,
    filters.order,
    filters.mostrar,
    debouncedId,
    debouncedSeller,
    filters.status,
    debouncedNumeroDocumento,
    filters.tipo,
    filters.cnpj,
    dispatch,
    token,
    filters.cpf,
    filters.created_at,
  ]);

  const columns = [
    { headerText: "", key: "menu" },
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faCalendar} size="lg" />
            <Typography
              style={{
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {moment.utc(data).format("DD")}&nbsp;
              {moment.utc(data).format("MMMM")}&nbsp;
              {moment.utc(data).format("YYYY")}
            </Typography>
            <Typography
              style={{
                display: "flex",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {moment.utc(data).format("HH:mm")}h
            </Typography>
          </Box>
        );
      },
    },
    { headerText: "E-mail", key: "email" },
    {
      headerText: "Empresa",
      key: "",
      FullObject: (data) => {
        return (
          <Typography>
            {data.tipo === "Pessoa Jurídica"
              ? data.razao_social
              : data.tipo === "Pessoa física"
                ? data.nome
                : null}
          </Typography>
        );
      },
    },
    { headerText: "Tipo", key: "tipo" },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (value) => {
        if (hasPermission("Atendimento - Consulta de status da conta")) {
          if (value === "pending") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#F1E3D4",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "orange", width: "100%" }}>
                    PENDENTE
                  </Typography>
                </Box>
              </Box>
            );
          }
          if (value === "incomplete") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#F1E3D4",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "orange", width: "100%" }}>
                    INCOMPLETO
                  </Typography>
                </Box>
              </Box>
            );
          }
          if (value === "active") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#C9DBF2",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "#75B1ED", width: "100%" }}>
                    ATIVO
                  </Typography>
                </Box>
              </Box>
            );
          }
          if (value === "enabled") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#C9DBF2",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "#75B1ED", width: "100%" }}>
                    HABILITADO
                  </Typography>
                </Box>
              </Box>
            );
          }
          if (value === "approved") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#C9ECE7",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "#00B57D", width: "100%" }}>
                    APROVADO
                  </Typography>
                </Box>
              </Box>
            );
          }
          if (value === "divergence") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#AA7EB3",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "#531A5F", width: "100%" }}>
                    DIVERGÊNCIA
                  </Typography>
                </Box>
              </Box>
            );
          }
          if (value === "denied") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#ECC9D2",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "#ED757D", width: "100%" }}>
                    NEGADO
                  </Typography>
                </Box>
              </Box>
            );
          }
          if (value === "deleted") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#ECC9D2",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "#ED757D", width: "100%" }}>
                    ENCERRADO
                  </Typography>
                </Box>
              </Box>
            );
          }
          if (value === "refused") {
            return (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    borderRadius: 32,
                    backgroundColor: "#DFB9D4",
                    maxWidth: "120px",
                    padding: "5px",
                  }}
                >
                  <Typography style={{ color: "#95407B", width: "100%" }}>
                    RECUSADO
                  </Typography>
                </Box>
              </Box>
            );
          }
        } else {
          return null;
        }
      },
    },
    // { headerText: "Número do Documento", key: "numero_documento" },
    {
      headerText: "Documento",
      key: "",
      FullObject: (data) => {
        return (
          <Typography>{documentMask(data.cnpj ?? data.documento)}</Typography>
        );
      },
    },
    {
      headerText: "Contato",
      key: "celular",
      CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
    },
    AbaGestao
      ? {}
      : {
          headerText: "ZOOP",
          key: "",
          FullObject: (value) => {
            if (value.seller_id) {
              return (
                <Tooltip title="Cadastro conciliado com ZOOP">
                  <CheckIcon style={{ color: "green" }} />
                </Tooltip>
              );
            } else {
              return (
                <Tooltip title="Aguardando envio do cadastro para conciliação com ZOOP">
                  <PriorityHighIcon style={{ color: "orange" }} value />
                </Tooltip>
              );
            }
          },
        },
    { key: "menu" },
  ];

  const handleCriarConta = () => {
    const path = generatePath("/dashboard/criar-conta-adquirencia");
    history.push(path);
  };

  const handleExportar = async () => {
    setLoading(true);
    const res = await dispatch(
      getContasExportAction(
        token,
        "",
        page,
        debouncedLike,
        filters.id,
        filters.seller,
        filters.status,
        filters.numero_documento,
        filters.tipo,
        filters.order,
        filters.mostrar,
        filters.cnpj,
        "xlsx",
        `solicitado_adquirencia=false&is_estabelecimento=true&created_at=${filters.created_at}`,
      ),
    );
    toast.warning(
      res?.message ??
        "A exportação pode demorar um pouco, por favor aguarde...",
    );
    if (res?.url) {
      window.open(`${res.url}`, "", "");
    } else {
    }
  };

  const handleExportarPdf = async () => {
    setLoading(true);
    const res = await dispatch(
      getContasExportAction(
        token,
        "",
        page,
        debouncedLike,
        filters.id,
        filters.seller,
        filters.status,
        filters.numero_documento,
        filters.tipo,
        filters.order,
        filters.mostrar,
        filters.cnpj,
        "pdf",
        `solicitado_adquirencia=false&is_estabelecimento=true&created_at=${filters.created_at}`,
      ),
    );
    toast.warning(
      res?.message ??
        "A exportação pode demorar um pouco, por favor aguarde...",
    );
    if (res?.url) {
      window.open(`${res.url}`, "", "");
    } else {
    }
  };

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false); //"deletar, "aprovar", "blacklist, "false;
    const [excluirId, setExcluirId] = useState("");

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleAddToBlacklist = async (row) => {
      setShowActionModal("adicionar à blacklist");
    };

    const handleEditarUsuario = (row) => {
      const path = generatePath(
        row.row.tipo === "Pessoa Jurídica"
          ? "/dashboard/editar-conta-pj-adquirencia/:id/editar"
          : "/dashboard/editar-conta-adquirencia/:id/editar",
        {
          id: row.row.id,
        },
      );
      history.push(path);
    };

    const handleEnviarSellerZoop = async (row) => {
      setLoading(true);
      const resEnviarSellerZoop = await dispatch(
        postCriarSellerZoopAction(token, row.row.id),
      );
      if (resEnviarSellerZoop) {
        setLoading(false);
        toast.error("Erro ao enviar seller para zoop");
        setAnchorEl(null);
      } else {
        setLoading(false);
        toast.success("Seller enviado para zoop");
        setAnchorEl(null);
      }
    };

    const handleRecusarSellerZoop = async () => {
      setLoading(true);
      const resRecusarSellerZoop = await dispatch(
        postRecusarSellerZoopAction(token, excluirId),
      );
      if (resRecusarSellerZoop) {
        setLoading(false);
        toast.error("Erro ao recusar solicitação de estabelecimento");
        setAnchorEl(null);
      } else {
        setLoading(false);
        toast.success("Solicitação de estabelecimento recusada");
        setAnchorEl(null);
      }
    };

    const handleGerenciarUsuario = (row) => {
      const path = generatePath(
        row.row.tipo === "Pessoa Jurídica"
          ? "/dashboard/gerenciar-contas/:id/lista-conta-juridica"
          : "/dashboard/gerenciar-contas/:id/listas",
        {
          id: row.row.id,
        },
      );
      history.push(path);
    };

    const handleReenviarToken = async (row) => {
      if (
        hasPermission(
          "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
        )
      ) {
        if (row.row.user && row.row.user.id) {
          const resAprovar = await dispatch(
            getReenviarTokenUsuarioAction(token, row.row.user.id),
          );
          if (resAprovar) {
            toast.error("Falha ao reenviar token");
          } else {
            toast.success("Token reenviado com sucesso!");
            getData();
          }
          setAnchorEl(null);
        } else {
          toast.error("Usuário negado");
          return;
        }
      } else {
        toast.error("Sem permissão para acessar essa funcionalidade");
      }
    };

    return (
      <>
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
            onClick={() => {}}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => handleEditarUsuario(row)}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
              disabled={
                !(
                  hasPermission(PERMISSIONS.estabelecimentos.actions) ||
                  hasPermission(
                    "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
                  )
                )
              }
            >
              Editar
            </MenuItem>

            <MenuItem
              onClick={() => setShowActionModal("aprovar")}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
              disabled={
                !(
                  hasPermission(PERMISSIONS.estabelecimentos.actions) ||
                  hasPermission(
                    "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
                  )
                )
              }
            >
              Aprovar
            </MenuItem>

            <MenuItem
              onClick={() => handleGerenciarUsuario(row)}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
              disabled={
                !(
                  hasPermission(PERMISSIONS.estabelecimentos.actions) ||
                  hasPermission(
                    "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
                  )
                )
              }
            >
              Gerenciar Conta
            </MenuItem>

            <MenuItem
              onClick={() => setShowActionModal("deletar")}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
              disabled={!hasPermission(PERMISSIONS.estabelecimentos.actions)}
            >
              Deletar
            </MenuItem>

            <MenuItem
              onClick={() => handleAddToBlacklist(row)}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
            >
              Adicionar à blacklist
            </MenuItem>

            {/* <MenuItem
              onClick={() => handleReenviarToken(row)}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
              disabled={!hasPermission(PERMISSIONS.estabelecimentos.actions)}
            >
              Reenviar Token
            </MenuItem>
            {!row?.row?.seller_id && (
            <>
              <MenuItem
                onClick={() => handleEnviarSellerZoop(row)}
                style={{ color: APP_CONFIG.mainCollors.secondary }}
              >
                Enviar Seller para ZOOP
              </MenuItem>
            )} 
              <MenuItem
                onClick={() => {
                  setOpenModalRecusar(true);
                  setExcluirId(row.row.id);
                }}
                // onClick={() => handleRecusarSellerZoop(row)} 
                style={{ color: APP_CONFIG.mainCollors.secondary }}
              >
                Recusar solicitação de estabelecimento
              </MenuItem>
            </>
					)} */}
          </Menu>

          {/* <Dialog
          open={openModalRecusar}
          onClose={() => setOpenModalRecusar(false)}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <DialogTitle
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            Deseja recusar essa solicitação de estabelecimento?
          </DialogTitle>

          <DialogContent
            style={{
              minWidth: 500,
            }}
          ></DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => handleRecusarSellerZoop()}
              style={{ marginRight: "10px" }}
            >
              Sim
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setOpenModalRecusar(false);
                setExcluirId("");
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog> */}
        </Box>

        <ActionModal
          show={showActionModal}
          setShow={setShowActionModal}
          row={row?.row}
          getData={getData}
        />
      </>
    );
  };

  useEffect(() => {
    if (!isEqual(filters, filtersComparation)) {
      localStorage.setItem(
        filters_gerenciar_contas,
        JSON.stringify({ ...filters }),
      );
    }
  }, [filters, filtersComparation]);

  useEffect(() => {
    const getLocalFilters = JSON.parse(
      localStorage.getItem(filters_gerenciar_contas),
    );
    if (getLocalFilters) {
      setFilters(getLocalFilters);
    }
  }, []);

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
            Contas Estabelecimentos
          </Typography>

          <Box style={{ alignSelf: "flex-end" }}>
            <IconButton
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                color: APP_CONFIG.mainCollors.primary,
              }}
              onClick={() => window.location.reload(false)}
            >
              <RefreshIcon></RefreshIcon>
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
            {hasPermission(PERMISSIONS.estabelecimentos.list.search) && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por nome, documento, email..."
                    size="small"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    value={filters.like}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({
                        ...filters,
                        like: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por ID Seller/Holder"
                    size="small"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    value={filters.seller}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({
                        ...filters,
                        seller: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputLabel id="tipo_label" shrink="true">
                    Tipo
                  </InputLabel>
                  <Select
                    labelId="tipo_label"
                    variant="outlined"
                    fullWidth
                    value={filters.tipo}
                    onChange={(e) =>
                      setFilters({ ...filters, tipo: e.target.value })
                    }
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"1"}>Pessoa Física</MenuItem>
                    <MenuItem value={"2"}>Pessoa Jurídica</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputLabel id="status_label" shrink="true">
                    Status
                  </InputLabel>
                  <Select
                    labelId="status_label"
                    variant="outlined"
                    fullWidth
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"active"}>Ativo</MenuItem>
                    <MenuItem value={"approved"}>Aprovado</MenuItem>
                    <MenuItem value={"divergence"}>Divergência</MenuItem>
                    <MenuItem value={"pending"}>Pendente</MenuItem>
                    <MenuItem value={"incomplete"}>Incompleto</MenuItem>
                    <MenuItem value={"refused"}>Recusado</MenuItem>
                    <MenuItem value={"deleted"}>Encerrado</MenuItem>
                    <MenuItem value={"denied"}>Negado</MenuItem>
                    <MenuItem value={"block"}>Bloqueado</MenuItem>
                  </Select>
                </Grid>

                {/* <Grid item xs={12} sm={2}>
								<Select
									style={{
										marginTop: '10px',
										color: APP_CONFIG.mainCollors.secondary,
									}}
									variant="outlined"
									fullWidth
									value={filters.status_adquirencia}
									onChange={(e) =>
										setFilters({
											...filters,
											status_adquirencia: e.target.value,
										})
									}
								>
									<MenuItem
										value={' '}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Status Estabelecimentos
									</MenuItem>
									<MenuItem
										value={'active'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Ativo
									</MenuItem>
									<MenuItem
										value={'approved'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Aprovado
									</MenuItem>
									<MenuItem
										value={'divergence'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Divergência
									</MenuItem>
									<MenuItem
										value={'pending'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Pendente
									</MenuItem>
									<MenuItem
										value={'incomplete'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Incompleto
									</MenuItem>
									<MenuItem
										value={'refused'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Recusado
									</MenuItem>
									<MenuItem
										value={'deleted'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Encerrado
									</MenuItem>
									<MenuItem
										value={'denied'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Negado
									</MenuItem>
									<MenuItem
										value={'block'}
										style={{
											color: APP_CONFIG.mainCollors.secondary,
										}}
									>
										Bloqueado
									</MenuItem>
								</Select>
							</Grid> */}

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por ID"
                    size="small"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    value={filters.id}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({
                        ...filters,
                        id: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por nº de documento"
                    size="small"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    value={filters.numero_documento}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({
                        ...filters,
                        numero_documento: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputMask
                    mask={"99.999.999/9999-99"}
                    value={filters.cnpj}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({
                        ...filters,
                        cnpj: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        placeholder="Pesquisar por CNPJ"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </InputMask>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputMask
                    mask={"999.999.999-99"}
                    value={filters.cpf}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({
                        ...filters,
                        cpf: e.target.value,
                      });
                    }}
                  >
                    {() => (
                      <TextField
                        fullWidth
                        placeholder="Pesquisar por CPF"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </InputMask>
                </Grid>

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
                    value={filters.created_at}
                    onChange={(e) => {
                      setPage(1);
                      setFilters((prev) => ({
                        ...prev,
                        created_at: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel id="mostrar_label" shrink="true">
                    Itens por página
                  </InputLabel>
                  <Select
                    labelId="mostrar_label"
                    value={filters.mostrar}
                    onChange={(e) =>
                      setFilters({ ...filters, mostrar: e.target.value })
                    }
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value={"15"}>15</MenuItem>
                    <MenuItem value={"30"}>30</MenuItem>
                    <MenuItem value={"45"}>45</MenuItem>
                    <MenuItem value={"50"}>50</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(PERMISSIONS.estabelecimentos.list.search) && (
                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={() => {
                    setFilters(filtersComparation);
                    localStorage.setItem(
                      filters_gerenciar_contas,
                      JSON.stringify({ ...filtersComparation }),
                    );
                  }}
                />
              )}

              {hasPermission(PERMISSIONS.estabelecimentos.list.create) && (
                <>
                  <TableHeaderButton
                    Icon={Add}
                    text="Criar conta Estabelecimento"
                    onClick={handleCriarConta}
                  />

                  <TableHeaderButton
                    text="Arquivos em lote"
                    onClick={() => {
                      const path = generatePath(
                        "lista-arquivos-de-lote?type=estabelecimento",
                      );
                      history.push(path);
                    }}
                  />
                </>
              )}

              {hasPermission(PERMISSIONS.estabelecimentos.list.export) && (
                <>
                  <TableHeaderButton
                    Icon={ViewList}
                    text="Exportar"
                    onClick={handleExportar}
                  />

                  <TableHeaderButton
                    Icon={ViewList}
                    text="Exportar PDF"
                    onClick={handleExportarPdf}
                  />
                </>
              )}
            </Grid>
          </Box>

          <Typography
            className={classes.pageTitle}
            style={{ marginLeft: "30px", marginBottom: "30px" }}
          >
            CONTAS RECENTES
          </Typography>
        </Box>

        {hasPermission(PERMISSIONS.estabelecimentos.list.view) && (
          <Box className={classes.tableContainer}>
            {listaContas?.data && listaContas?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={listaContas?.data}
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
                count={listaContas.last_page}
                onChange={(e, value) => setPage(value)}
                page={page}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ListaDeContasAdquirencia;

const ActionModal = ({
  show = false, //"deletar, "aprovar", "adicionar à blacklist", false;
  setShow = () => false,
  row = {},
  getData = async () => null,
}) => {
  const token = useAuth();
  const [loading, setLoading] = useState("");
  const [sendToken, setSendToken] = useState(true);
  const [addToBlacklist, setAddToBlacklist] = useState({
    titulo: "",
    motivo: "",
  });

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (show === "deletar") await deleteConta(token, row?.id);
      if (show === "aprovar") await getAprovarConta(token, row?.id, sendToken);
      if (show === "adicionar à blacklist")
        await postAddRemoveFromBlacklist(
          token,
          row?.id,
          addToBlacklist.titulo,
          addToBlacklist.motivo,
        );

      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(
        `Ocorreu um erro, não possivel ${show} o item. Tente novamente.`,
      );
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  const title = !!show ? show[0]?.toUpperCase() + show?.substring(1) : "";

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <LoadingScreen isLoading={loading} />
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent style={{ overflow: "hidden" }}>
          <DialogContentText>Você gostaria de {show} o item:</DialogContentText>

          <DialogContentText>
            {row?.nome_beneficio ? (
              <>
                {row?.nome_beneficio} <br />
              </>
            ) : null}
            {row?.nome_prefeitura ? (
              <>
                {row?.nome_prefeitura} - {row?.sigla} <br />
              </>
            ) : null}
            {row?.nome ? (
              <>
                {row?.nome} <br />
              </>
            ) : null}
            {row?.user?.nome ? (
              <>
                {row?.user?.nome} <br />
              </>
            ) : null}
            {row?.documento ? (
              <>
                {row?.documento} <br />
              </>
            ) : null}
            {row?.user?.documento ? (
              <>
                {row?.user?.documento} <br />
              </>
            ) : null}
            {row?.email ? (
              <>
                {row?.email} <br />
              </>
            ) : null}
            {row?.chave_pix ? (
              <>
                Chave Pix: {row?.chave_pix} <br />
              </>
            ) : null}
            {row?.descricao ? (
              <>
                {row?.descricao} <br />
              </>
            ) : null}
          </DialogContentText>

          {show === "aprovar" && (
            <FormControlLabel
              label="Enviar notificação para o usuário"
              control={
                <Checkbox
                  color="primary"
                  checked={sendToken}
                  onChange={() => setSendToken((prev) => !prev)}
                />
              }
            />
          )}

          {show === "adicionar à blacklist" && (
            <>
              <TextField
                label={"Título"}
                value={addToBlacklist?.titulo}
                onChange={(e) =>
                  setAddToBlacklist((prev) => ({
                    ...prev,
                    titulo: e.target.value,
                  }))
                }
                variant="outlined"
                fullWidth
              />
              <div style={{ marginBottom: "14px" }} />
              <TextField
                label={"Motivo"}
                value={addToBlacklist?.motivo}
                onChange={(e) =>
                  setAddToBlacklist((prev) => ({
                    ...prev,
                    motivo: e.target.value,
                  }))
                }
                variant="outlined"
                fullWidth
              />
            </>
          )}

          {show !== "adicionar à blacklist" && (
            <DialogContentText>Essa ação é irreversível.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            {title}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
