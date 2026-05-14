/* eslint-disable no-lone-blocks */

import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Grid,
  IconButton,
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import {
  getContasAction,
  getContasExportAction,
  loadPermissao,
  postAuthMeAction,
} from "../../actions/actions";

import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Pagination } from "@material-ui/lab";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { Tooltip } from "@mui/material";
import { isEqual } from "lodash";
import moment from "moment";
import "moment/locale/pt-br";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import { filters_gerenciar_contas } from "../../constants/localStorageStrings";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";
import px2vw from "../../utils/px2vw";

const ListaDeContas = () => {
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
    id: "",
    seller: "",
    status: " ",
    status_adquirencia: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
  });

  const [filtersComparation] = useState({
    like: "",
    order: "",
    mostrar: "",
    id: "",
    seller: "",
    status: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
  });

  const debouncedLike = useDebounce(filters.like, 800);
  const debouncedId = useDebounce(filters.id, 800);
  const debouncedSeller = useDebounce(filters.seller, 800);
  const debouncedNumeroDocumento = useDebounce(filters.numero_documento, 800);

  const [loading, setLoading] = useState(false);
  const token = useAuth();

  const [page, setPage] = useState(1);
  const history = useHistory();
  const dispatch = useDispatch();
  const [permissoes, setPermissoes] = useState([]);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "0px",
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
  moment.locale("pt-br");

  useEffect(() => {
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
      ),
    );
  }, [
    page,
    debouncedLike,
    filters.order,
    filters.mostrar,
    debouncedId,
    debouncedSeller,
    filters.status,
    filters.status_adquirencia,
    debouncedNumeroDocumento,
    filters.tipo,
    filters.cnpj,
  ]);

  const columns = [
    { headerText: "Ação", key: "menu" },
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
            {moment.utc(data).format("DD MMMM YYYY, HH:mm")}
          </Box>
        );
      },
    },

    {
      headerText: "E-mail",
      key: "",
      FullObject: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "99px",
            }}
          >
            <Typography>{data.email}</Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Empresa",
      key: "",
      FullObject: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "99px",
            }}
          >
            <Typography>
              {data.tipo === "Pessoa Jurídica"
                ? data.razao_social
                : data.tipo === "Pessoa física"
                  ? data.nome
                  : null}
            </Typography>
          </Box>
        );
      },
    },
    { headerText: "Tipo", key: "tipo" },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (value) => {
        if (
          permissoes.includes("Atendimento - Consulta de status da conta") ||
          permissoes.includes("Administrador - Acesso total")
        ) {
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

    {
      headerText: "Número do Documento",
      key: "",
      FullObject: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "99px",
            }}
          >
            <Typography>{data.numero_documento}</Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Documento",
      key: "",
      FullObject: (data) => {
        return (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "99px",
            }}
          >
            <Typography>
              {documentMask(data?.cnpj ?? data?.documento)}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Contato",
      key: "celular",
      CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
    },
    {
      headerText: "Segurança",
      key: "",
      FullObject: ({ user }) => {
        if (user) {
          if (user.verificar_device_bloqueado) {
            return (
              <Typography style={{ color: "red", fontSize: "0.7rem" }}>
                Dispositivo bloqueado
                <br />
                Aguardando Verificação
              </Typography>
            );
          }
          if (user.verificar_device_alterado) {
            return (
              <Typography style={{ color: "red", fontSize: "0.7rem" }}>
                Dispositivo alterado
                <br />
                Aguardando Verificação
              </Typography>
            );
          }

          if (user.aguardando_confirmacao_device) {
            return (
              <Typography
                style={{
                  color: APP_CONFIG.mainCollors.primary,
                  fontSize: "0.7rem",
                }}
              >
                Aguardando Confirmação
              </Typography>
            );
          }

          if (
            !user.verificar_device_alterado &&
            !user.verificar_device_bloqueado &&
            !user.aguardando_confirmacao_device
          ) {
            return <CheckIcon style={{ color: "green" }} />;
          }
        }
      },
    },
    {
      headerText: "FitBank",
      key: "",
      FullObject: (value) => {
        if (value.fitbank_account_key && value.fitbank !== null) {
          return (
            <Tooltip title="Cadastro conciliado com FITBANK">
              <CheckIcon style={{ color: "green" }} />
            </Tooltip>
          );
        } else if (
          value.fitbank_account_key === null &&
          value.fitbank !== null
        ) {
          return (
            <Tooltip
              title={
                value.fitbank && value.fitbank.Message
                  ? value.fitbank.Message
                  : null
              }
            >
              <ClearIcon style={{ color: "red" }} value />
            </Tooltip>
          );
        } else if (
          value.fitbank_account_key === null &&
          value.fitbank === null
        ) {
          return (
            <Tooltip title="Aguardando finalização do cadastro para conciliação com FITBANK">
              <PriorityHighIcon style={{ color: "orange" }} value />
            </Tooltip>
          );
        }
      },
    },
  ];

  const listaContas = useSelector((state) => state.contas);
  const me = useSelector((state) => state.me);
  const userPermissao = useSelector((state) => state.userPermissao);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, []);

  useEffect(() => {
    if (me.id !== undefined) {
      dispatch(loadPermissao(token, me.id));
    }
  }, [me.id]);

  useEffect(() => {
    const { permissao } = userPermissao;
    setPermissoes(permissao.map((item) => item.tipo));
  }, [userPermissao]);

  const handleExportar = async () => {
    setLoading(true);
    toast.warning("A exportação pode demorar um pouco, por favor aguarde...");
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
      ),
    );
    if (res && res.url !== undefined) {
      window.open(`${res.url}`, "", "");
    } else {
    }
  };

  /* 	const handleClickRowUsuario = (data) => {
	
		if (data.tipo === 'Pessoa Jurídica') {
			const path = generatePath('/dashboard/editar-conta-pj/:id/editar', {
				id: data.id,
			});
			{
				permissoes.includes(
					'Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)'
				) || permissoes.includes('Administrador - Acesso total')
					? history.push(path)
					: toast.error('Permissão não concedida');
			}
		} else {
			const path = generatePath('/dashboard/editar-conta/:id/editar', {
				id: data.id,
			});
			{
				permissoes.includes(
					'Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)'
				) || permissoes.includes('Administrador - Acesso total')
					? history.push(path)
					: toast.error('Permissão não concedida');
			}
		}
	}; */

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleGerenciarUsuario = (row) => {
      if (row.row.tipo === "Pessoa Jurídica") {
        const path = generatePath(
          "/dashboard/gerenciar-contas/:id/lista-conta-juridica",
          {
            id: row.row.id,
          },
        );
        {
          permissoes.includes(
            "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
          ) || permissoes.includes("Administrador - Acesso total")
            ? history.push(path)
            : toast.error("Permissão não concedida");
        }
      } else {
        const path = generatePath("/dashboard/gerenciar-contas/:id/listas", {
          id: row.row.id,
        });
        {
          permissoes.includes(
            "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
          ) || permissoes.includes("Administrador - Acesso total")
            ? history.push(path)
            : toast.error("Permissão não concedida");
        }
      }
    };
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <Box>
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
          onClick={() => {}}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => handleGerenciarUsuario(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
          >
            Gerenciar Conta
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  useEffect(() => {
    if (!isEqual(filters, filtersComparation)) {
      localStorage.setItem(
        filters_gerenciar_contas,
        JSON.stringify({ ...filters }),
      );
    }
  }, [filters]);

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
        <Box style={{ marginBottom: "10px" }}>
          <CustomHeader pageTitle="Contas" />
        </Box>

        <Box style={{ alignSelf: "flex-end", marginBottom: "10px" }}>
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

        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Pesquisar por nome, documento, email..."
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
                  label="Pesquisar por ID Seller/Holder"
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
              <Grid item xs={12} sm={2}>
                <Select
                  style={{
                    color: APP_CONFIG.mainCollors.secondary,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filters.tipo}
                  onChange={(e) =>
                    setFilters({ ...filters, tipo: e.target.value })
                  }
                >
                  <MenuItem
                    value={" "}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Tipo
                  </MenuItem>
                  <MenuItem
                    value={"1"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pessoa Física
                  </MenuItem>
                  <MenuItem
                    value={"2"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pessoa Jurídica
                  </MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Select
                  style={{
                    color: APP_CONFIG.mainCollors.secondary,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <MenuItem
                    value={" "}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Status
                  </MenuItem>
                  <MenuItem
                    value={"active"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Ativo
                  </MenuItem>
                  <MenuItem
                    value={"approved"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Aprovado
                  </MenuItem>
                  <MenuItem
                    value={"divergence"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Divergência
                  </MenuItem>
                  <MenuItem
                    value={"pending"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pendente
                  </MenuItem>
                  <MenuItem
                    value={"incomplete"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Incompleto
                  </MenuItem>
                  <MenuItem
                    value={"refused"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Recusado
                  </MenuItem>
                  <MenuItem
                    value={"deleted"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Encerrado
                  </MenuItem>
                  <MenuItem
                    value={"denied"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Negado
                  </MenuItem>
                  <MenuItem
                    value={"block"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Bloqueado
                  </MenuItem>
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
										Status Adquirência
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

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Pesquisar por ID"
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
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Pesquisar por nº de documento"
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
              <Grid item xs={12} sm={2}>
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
                      label="Pesquisar por CNPJ"
                      size="small"
                      variant="outlined"
                      style={{
                        marginRight: "10px",
                      }}
                    />
                  )}
                </InputMask>
                {/* <TextField
								
									fullWidth
									label="Pesquisar por CNPJ"
									size="small"
									variant="outlined"
									style={{
										marginRight: '10px',
									}}
									value={filters.cnpj}
									onChange={(e) => {
										setPage(1);
										setFilters({
											...filters,
											cnpj: e.target.value,
										});
									}}
								/> */}
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
                  <CustomButton color="purple" onClick={handleExportar}>
                    <Box display="flex" alignItems="center">
                      <ViewListIcon />
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
                    color="red"
                    onClick={() => {
                      setFilters(filtersComparation);
                      localStorage.setItem(
                        filters_gerenciar_contas,
                        JSON.stringify({ ...filtersComparation }),
                      );
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <DeleteIcon />
                      Limpar
                    </Box>
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Typography
            className={classes.pageTitle}
            style={{ marginLeft: "30px", marginBottom: "30px" }}
          >
            CONTAS RECENTES
          </Typography>
        </Box>
        <Box className={classes.tableContainer}>
          {listaContas.data && listaContas.per_page ? (
            <Box minWidth={!matches ? "800px" : null}>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable
                  columns={columns ? columns : null}
                  data={listaContas.data}
                  Editar={Editar}
                />
              </TableContainer>
            </Box>
          ) : (
            <Box width="60vw">
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
              onChange={handleChangePage}
              page={page}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ListaDeContas;
