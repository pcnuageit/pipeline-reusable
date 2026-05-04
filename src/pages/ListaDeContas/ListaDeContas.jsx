/* eslint-disable no-lone-blocks */

import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormHelperText,
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import {
  getAprovarContaAction,
  getContasAction,
  getContasExportAction,
  getFinalizarCadastroContaAction,
  getReaprovarContaAction,
  getReenviarDocumentoAction,
  getReenviarTokenUsuarioAction,
  postBlackListSelfieAction,
  postBloquearDeviceAdmAction,
  postDesbloquearDeviceAdmAction,
  postUserBloquearDesbloquearAction,
} from "../../actions/actions";

import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Delete } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
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
import CustomTable from "../../components/CustomTable/CustomTable";
import SelectBeneficio from "../../components/SelectBeneficio";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import { filters_gerenciar_contas } from "../../constants/localStorageStrings";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import usePermission from "../../hooks/usePermission";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";
import px2vw from "../../utils/px2vw";

const ListaDeContas = () => {
  const [filters, setFilters] = useState({
    like: "",
    tipo_beneficio_id: "",
    order: "",
    mostrar: "15",
    id: "",
    seller: "",
    status: " ",
    status_adquirencia: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
    created_at: "",
  });

  const [filtersComparation] = useState({
    like: "",
    order: "",
    tipo_beneficio_id: "",
    mostrar: "15",
    id: "",
    seller: "",
    status: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
    created_at: "",
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
  const { hasPermission, PERMISSIONS } = usePermission();
  const listaContas = useSelector((state) => state.contas);
  const theme = useTheme();
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
        "",
        "",
        "",
        "",
        "",
        filters.tipo_beneficio_id,
        "",
        filters.created_at,
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
    dispatch,
    token,
    filters.tipo_beneficio_id,
    filters.created_at,
  ]);

  const [isModalFitBank, setIsModalFitBank] = useState(false);

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
            onClick={() => handleClickRowUsuario(data)}
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
            onClick={() => handleClickRowUsuario(data)}
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
    {
      headerText: "Programa",
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
              {data.tipo_beneficio
                ? data.tipo_beneficio.nome_beneficio
                : data.tipo_beneficio_mdr
                  ? data.tipo_beneficio_mdr.nome_beneficio
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
          hasPermission(
            "Atendimento - Consulta de status da conta" ||
              hasPermission(PERMISSIONS.contas.actions.manage),
          )
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

    // {
    //   headerText: "Número do Documento",
    //   key: "",
    //   FullObject: (data) => {
    //     return (
    //       <Box
    //         style={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           height: "99px",
    //         }}
    //         onClick={() => handleClickRowUsuario(data)}
    //       >
    //         <Typography>{data.numero_documento}</Typography>
    //       </Box>
    //     );
    //   },
    // },
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
            onClick={() => handleClickRowUsuario(data)}
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
      headerText: APP_CONFIG.headerListaContas,
      key: "",
      FullObject: (value) => {
        if (value.payment_account) {
          return (
            <Tooltip title="Cadastro conciliado com BAAS">
              <CheckIcon style={{ color: "green" }} />
            </Tooltip>
          );

          // return (
          // 	<div>
          // 		<ClearIcon style={{ color: 'red' }} onClick={() => setIsModalFitBank(true)} />
          // 		<Dialog open={isModalFitBank}>
          // 		<Box
          // 			width="500px"
          // 			padding="20px"
          // 			justifyContent="center"
          // 			alignItems="center"
          // 		>
          // 			<DialogTitle>Desbloquear Dispositivo</DialogTitle>
          // 			<Typography style={{ textAlign: 'center' }}>
          // 				Deseja adicionar a foto desse usuário na BlackList{' '}
          // 				<b>
          // 					{
          // 						'(bloquear a foto do usuário em todos os outros/próximos cadastros)'
          // 					}
          // 				</b>
          // 				?
          // 			</Typography>
          // 			<Box
          // 				style={{
          // 					display: 'flex',
          // 					justifyContent: 'center',
          // 					alignItems: 'center',
          // 					flexDirection: 'column',
          // 				}}
          // 			>
          // 				{/* <Box style={{ marginTop: '5px', marginBottom: '5px' }}>
          // 					<Button
          // 						variant="contained"
          // 						style={{
          // 							backgroundColor: APP_CONFIG.mainCollors.primary,
          // 							color: 'white',
          // 						}}
          // 					>
          // 						Bloquear e não Adicionar à BlackList
          // 					</Button>
          // 				</Box>
          // 				<Box style={{ marginTop: '5px', marginBottom: '5px' }}>
          // 					<Button
          // 						variant="contained"
          // 						style={{
          // 							backgroundColor: 'black',
          // 							color: 'white',
          // 						}}
          // 					>
          // 						Bloquear e Adicionar à BlackList
          // 					</Button>
          // 				</Box> */}

          // 				<Box style={{ marginTop: '5px', marginBottom: '5px' }}>
          // 					<Button
          // 						variant="contained"
          // 						style={{
          // 							backgroundColor: '',
          // 						}}
          // 						onClick={() => {
          // 							setIsModalFitBank(false);
          // 						}}
          // 					>
          // 						Voltar
          // 					</Button>
          // 				</Box>
          // 			</Box>
          // 		</Box>
          // 		</Dialog>
          // 	</div>
          // );
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
        } else if (value.payment_account === null) {
          return (
            <Tooltip title="Aguardando finalização do cadastro para conciliação com BAAS">
              <PriorityHighIcon style={{ color: "orange" }} value />
            </Tooltip>
          );
        }
      },
    },
  ];

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleCriarConta = () => {
    const path = generatePath("/dashboard/criar-conta");
    history.push(path);
  };

  const filter = `solicitado_adquirencia=&agent_id=&is_estabelecimento=false&is_gestao_concorrencia=false&like=${filters?.like}&tipo_beneficio_id=${filters?.tipo_beneficio_id}&order=${filters?.order}&mostrar=${filters?.mostrar}&id=${filters?.id}&seller=${filters?.seller}&status=${filters?.status}&status_adquirencia=${filters?.status_adquirencia}&numero_documento=${filters?.numero_documento}&tipo=${filters?.tipo}&cnpj=${filters?.cnpj}&created_at=${filters?.created_at}`;

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
        filter,
      ),
    );
    toast.warning(
      res?.message ??
        "A exportação pode demorar um pouco, por favor aguarde...",
    );

    if (res.url !== undefined) {
      window.open(`${res.url}`, "", "");
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
        filter,
      ),
    );

    toast.warning(
      res?.message ??
        "A exportação pode demorar um pouco, por favor aguarde...",
    );

    if (res?.url) {
      window.open(`${res.url}`, "", "");
    }
  };

  const handleClickRowUsuario = (data) => {
    if (data.tipo === "Pessoa Jurídica") {
      const path = generatePath("/dashboard/editar-conta-pj/:id/editar", {
        id: data.id,
      });
      {
        hasPermission(
          "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
        ) || hasPermission(PERMISSIONS.contas.actions.edit)
          ? history.push(path)
          : toast.error("Permissão não concedida");
      }
    } else {
      const path = generatePath("/dashboard/editar-conta/:id/editar", {
        id: data.id,
      });
      {
        hasPermission(
          "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
        ) || hasPermission(PERMISSIONS.contas.actions.edit)
          ? history.push(path)
          : toast.error("Permissão não concedida");
      }
    }
  };

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalBloquearDispositivoOpen, setIsModalBloquearDispositivoOpen] =
      useState(false);
    const [isModalBloquearOpen, setIsModalBloquearOpen] = useState(false);
    const [bloquerDispositivoData, setBloquerDispositivoData] = useState({
      conta_id: "",
      descricao: "",
    });
    const [bloquearErrors, setBloquearErrors] = useState({});
    const [isModalDesbloquearOpen, setIsModalDesbloquearOpen] = useState(false);
    const [desbloquerId, setDesbloquerId] = useState({
      conta_id: "",
      verificacao_seguranca: {},
    });
    const [bloquear, setBloquear] = useState({});
    const [isModalBlackListOpen, setIsModalBlackListOpen] = useState(false);
    const [negarCadastroId, setNegarCadastroId] = useState("");

    const handleEditarUsuario = (row) => {
      if (row.row.tipo === "Pessoa Jurídica") {
        const path = generatePath("/dashboard/editar-conta-pj/:id/editar", {
          id: row.row.id,
        });
        {
          hasPermission(
            "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
          ) || hasPermission(PERMISSIONS.contas.actions.edit)
            ? history.push(path)
            : toast.error("Permissão não concedida");
        }
      } else {
        const path = generatePath("/dashboard/editar-conta/:id/editar", {
          id: row.row.id,
        });
        {
          hasPermission(
            "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)",
          ) || hasPermission(PERMISSIONS.contas.actions.edit)
            ? history.push(path)
            : toast.error("Permissão não concedida");
        }
      }
    };

    /* const handleGerenciarUsuario = () => {
			const path = generatePath('/dashboard/gerenciar-contas/:id/listas', {
				id: row.row.id,
			});
			history.push(path);
		}; */

    const handleGerenciarUsuario = (row) => {
      if (row.row.tipo === "Pessoa Jurídica") {
        const path = generatePath(
          "/dashboard/gerenciar-contas/:id/lista-conta-juridica",
          {
            id: row.row.id,
          },
        );

        hasPermission(PERMISSIONS.contas.actions.manage)
          ? history.push(path)
          : toast.error("Permissão não concedida");
      } else {
        const path = generatePath("/dashboard/gerenciar-contas/:id/listas", {
          id: row.row.id,
        });

        hasPermission(PERMISSIONS.contas.actions.manage)
          ? history.push(path)
          : toast.error("Permissão não concedida");
      }
    };
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleAprovar = async (row) => {
      if (
        hasPermission(
          "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
        ) ||
        hasPermission(PERMISSIONS.contas.actions.manage)
      ) {
        const resAprovar = await dispatch(
          getAprovarContaAction(token, row.row.id),
        );

        if (resAprovar && resAprovar.success === true) {
          toast.success("Usuário aprovado com sucesso!");
          await dispatch(
            getContasAction(
              token,
              page,
              debouncedLike,
              filters.order,
              filters.mostrar,
              filters.id,
              filters.seller,
              filters.status,
              filters.numero_documento,
              filters.tipo,
              filters.cnpj,
            ),
          );
        } else {
          toast.error("Falha ao aprovar usuário");
        }

        setAnchorEl(null);
      } else {
        toast.error("Sem permissão para acessar essa funcionalidade");
      }
    };

    const handleReaprovar = async (row) => {
      if (
        hasPermission(
          "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
        ) ||
        hasPermission(PERMISSIONS.contas.actions.manage)
      ) {
        const resAprovar = await dispatch(
          getReaprovarContaAction(token, row.row.id),
        );
        if (resAprovar && resAprovar.success === true) {
          toast.success("Usuário aprovado com sucesso!");
          await dispatch(
            getContasAction(
              token,
              page,
              debouncedLike,
              filters.order,
              filters.mostrar,
              filters.id,
              filters.seller,
              filters.status,
              filters.numero_documento,
              filters.tipo,
              filters.cnpj,
            ),
          );
        } else {
          toast.error("Falha ao reaprovar usuário");
        }
        setAnchorEl(null);
      } else {
        toast.error("Sem permissão para acessar essa funcionalidade");
      }
    };

    const handleReenviarToken = async (row) => {
      if (
        hasPermission(
          "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar",
        ) ||
        hasPermission(PERMISSIONS.contas.actions.manage)
      ) {
        if (row.row.user && row.row.user.id) {
          const resAprovar = await dispatch(
            getReenviarTokenUsuarioAction(token, row.row.user.id),
          );
          if (resAprovar) {
            toast.error("Falha ao reenviar token");
          } else {
            toast.success("Token reenviado com sucesso!");
            await dispatch(
              getContasAction(
                token,
                page,
                debouncedLike,
                filters.order,
                filters.mostrar,
                filters.id,
                filters.seller,
                filters.status,
                filters.numero_documento,
                filters.tipo,
                filters.cnpj,
              ),
            );
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

    const handleBloquearDesbloquear = async () => {
      console.log(bloquear);

      if (!bloquear?.id) return;

      setLoading(true);
      try {
        await dispatch(postUserBloquearDesbloquearAction(token, bloquear.id));

        toast.success(
          !bloquear?.bloqueado ? "Usuário bloqueado!" : "Usuário desbloqueado!",
        );

        await dispatch(
          getContasAction(
            token,
            page,
            debouncedLike,
            filters.order,
            filters.mostrar,
            filters.id,
            filters.seller,
            filters.status,
            filters.numero_documento,
            filters.tipo,
            filters.cnpj,
          ),
        );
      } catch (err) {
        console.log(err);
        toast.error("Ocorreu um erro. Tente novamente mais tarde");
      }

      setLoading(false);
      setAnchorEl(null);
    };

    const handleFinalizar = async (row) => {
      const resAprovar = await dispatch(
        getFinalizarCadastroContaAction(token, row.row.id),
      );
      if (resAprovar && resAprovar.success === true) {
        toast.success("Solicitação de finalizar cadastro enviado com sucesso!");
        await dispatch(
          getContasAction(
            token,
            page,
            debouncedLike,
            filters.order,
            filters.mostrar,
            filters.id,
            filters.seller,
            filters.status,
            filters.numero_documento,
            filters.tipo,
            filters.cnpj,
          ),
        );
      } else {
        toast.error("Falha ao enviar solicitação de finalizar cadastro");
      }
      setAnchorEl(null);
    };

    const handleReenviarDocumento = async (row) => {
      const resAprovar = await dispatch(
        getReenviarDocumentoAction(token, row.row.id),
      );
      if (resAprovar) {
        toast.error("Falha ao reenviar documento");
        toast.warning(
          "Para reenviar documentos é necessário apagar fotos anexadas",
        );
      } else {
        toast.success("Documento reenviado com sucesso!");
        await dispatch(
          getContasAction(
            token,
            page,
            debouncedLike,
            filters.order,
            filters.mostrar,
            filters.id,
            filters.seller,
            filters.status,
            filters.numero_documento,
            filters.tipo,
            filters.cnpj,
          ),
        );
      }
      setAnchorEl(null);
    };

    const handleBloquearDispositivo = async (row) => {
      const { success, errors, status } = await dispatch(
        postBloquearDeviceAdmAction(
          token,
          bloquerDispositivoData.conta_id,
          bloquerDispositivoData.descricao,
        ),
      );
      if (success) {
        toast.success("Dispositivo bloqueado com sucesso!");
        setFilters(filtersComparation);
      } else {
        setBloquearErrors({ ...errors });
        toast.error(`Erro ao bloquear dispositivo: ${status}`);
      }
    };

    const handleDesbloquearDispositivo = async (row) => {
      const { success, status } = await dispatch(
        postDesbloquearDeviceAdmAction(token, desbloquerId.conta_id),
      );
      if (success) {
        toast.success("Dispositivo desbloqueado com sucesso!");
        setFilters(filtersComparation);
      } else {
        toast.error(`Erro ao desbloquear dispositivo: ${status}`);
      }
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
            onClick={() => handleEditarUsuario(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={!hasPermission(PERMISSIONS.contas.actions.edit)}
          >
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => handleAprovar(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={!hasPermission(PERMISSIONS.contas.actions.approve)}
          >
            Aprovar
          </MenuItem>

          <MenuItem
            onClick={() => {
              setBloquear(row?.row?.user);
              setAnchorEl(null);
              setIsModalBloquearOpen(true);
            }}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={!hasPermission(PERMISSIONS.contas.actions.block)}
          >
            {row?.row?.user?.bloqueado ? "Desbloquear" : "Bloquear"}
          </MenuItem>

          <MenuItem
            onClick={() => handleReenviarDocumento(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={
              !hasPermission(PERMISSIONS.contas.actions.request_document_resend)
            }
          >
            Solicitar Reenvio de Documento
          </MenuItem>

          <MenuItem
            onClick={() => handleReenviarToken(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={
              !hasPermission(PERMISSIONS.contas.actions.resend_approval_token)
            }
          >
            Reenviar Token de Aprovação
          </MenuItem>
          {row?.row?.status === "pending" ? (
            <MenuItem
              onClick={() => handleFinalizar(row)}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
            >
              Solicitar Finalização Cadastro. DOC.
            </MenuItem>
          ) : null}
          {row?.row?.status === "denied" ? (
            <MenuItem
              onClick={() => handleReaprovar(row)}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
            >
              Reaprovar cadastro
            </MenuItem>
          ) : null}
          <MenuItem
            onClick={() => handleGerenciarUsuario(row)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={!hasPermission(PERMISSIONS.contas.actions.manage)}
          >
            Gerenciar Conta
          </MenuItem>
          {row?.row?.user?.aguardando_confirmacao_device ? (
            <MenuItem
              onClick={() => {
                setDesbloquerId({
                  ...desbloquerId,
                  conta_id: row.row.id,
                  verificacao_seguranca: {
                    ...row.row.verificacao_seguranca,
                  },
                });
                setAnchorEl(null);
                setIsModalDesbloquearOpen(true);
              }}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
            >
              Desbloquear Dispositivo
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                setBloquerDispositivoData({
                  ...bloquerDispositivoData,
                  conta_id: row.row.id,
                });
                setAnchorEl(null);
                setIsModalBloquearDispositivoOpen(true);
              }}
              style={{ color: APP_CONFIG.mainCollors.secondary }}
            >
              Bloquear Dispositivo
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              setIsModalBlackListOpen(true);
              setAnchorEl(false);
              setNegarCadastroId(row.row.id);
            }}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={!hasPermission(PERMISSIONS.contas.actions.deny)}
          >
            Negar Cadastro
          </MenuItem>
        </Menu>

        <Dialog
          open={isModalDesbloquearOpen}
          onBackdropClick={() => {
            setIsModalDesbloquearOpen(false);
            setDesbloquerId({
              conta_id: "",
              verificacao_seguranca: {},
            });
          }}
        >
          <Box width="500px" padding="20px">
            <DialogTitle>Desbloquear Dispositivo</DialogTitle>
            <Box style={{ display: "flex", flexDirection: "row" }}>
              <Typography style={{ marginRight: "10px" }}>
                Dados Verificados:
              </Typography>
              <Typography
                style={{
                  color: desbloquerId.verificacao_seguranca.email_verificado
                    ? "green"
                    : "red",
                }}
              >
                Email
              </Typography>
              {desbloquerId.verificacao_seguranca.email_verificado ? (
                <CheckIcon style={{ marginLeft: 5, color: "green" }} />
              ) : (
                <ClearIcon style={{ marginLeft: 5, color: "red" }} />
              )}
              <Typography
                style={{
                  color: desbloquerId.verificacao_seguranca.celular_verificado
                    ? "green"
                    : "red",
                }}
              >
                Celular
              </Typography>
              {desbloquerId.verificacao_seguranca.celular_verificado ? (
                <CheckIcon style={{ marginLeft: 5, color: "green" }} />
              ) : (
                <ClearIcon style={{ marginLeft: 5, color: "red" }} />
              )}
            </Box>
            <Box display="flex" justifyContent="space-around" marginTop="20px">
              <CustomButton
                color="black"
                onClick={() => {
                  setIsModalDesbloquearOpen(false);
                  setDesbloquerId({
                    conta_id: "",
                    verificacao_seguranca: {},
                  });
                }}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                color="purple"
                onClick={handleDesbloquearDispositivo}
              >
                Confirmar
              </CustomButton>
            </Box>
          </Box>
        </Dialog>
        <Dialog
          open={isModalBloquearDispositivoOpen}
          onBackdropClick={() => {
            setIsModalBloquearDispositivoOpen(false);
            setBloquerDispositivoData({
              conta_id: "",
              descricao: "",
            });
          }}
        >
          <Box width="500px" padding="20px">
            <DialogTitle>Bloquear Dispositivo</DialogTitle>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <TextField
                inputProps={{ maxLength: 5000 }}
                label="Descrição"
                value={bloquerDispositivoData.descricao}
                onChange={(e) =>
                  setBloquerDispositivoData({
                    ...bloquerDispositivoData,
                    descricao: e.target.value,
                  })
                }
                error={bloquearErrors.descricao ? true : false}
              />
              <FormHelperText
                style={{
                  marginBottom: "6px",

                  alignSelf: "center",
                  color: "red",
                }}
              >
                {bloquearErrors.descricao
                  ? bloquearErrors.descricao.join(" ")
                  : ""}
              </FormHelperText>
            </Box>
            <Box display="flex" justifyContent="space-around" marginTop="20px">
              <CustomButton
                color="black"
                onClick={() => {
                  setIsModalBloquearDispositivoOpen(false);
                  setBloquerDispositivoData({
                    conta_id: "",
                    descricao: "",
                  });
                }}
              >
                Cancelar
              </CustomButton>
              <CustomButton color="purple" onClick={handleBloquearDispositivo}>
                Confirmar
              </CustomButton>
            </Box>
          </Box>
        </Dialog>
        <Dialog
          open={isModalBloquearOpen}
          onBackdropClick={() => {
            setIsModalBloquearOpen(false);
            setBloquear({});
          }}
        >
          <Box width="500px" padding="20px">
            <DialogTitle>
              {bloquear && bloquear.bloqueado === false
                ? "Deseja bloquear esse usuário?"
                : "Deseja desbloquear esse usuário?"}
            </DialogTitle>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <FormHelperText
                style={{
                  marginBottom: "6px",

                  alignSelf: "center",
                  color: "red",
                }}
              >
                {bloquearErrors.descricao
                  ? bloquearErrors.descricao.join(" ")
                  : ""}
              </FormHelperText>
            </Box>
            <Box display="flex" justifyContent="space-around" marginTop="20px">
              <CustomButton
                color="black"
                onClick={() => {
                  setIsModalBloquearOpen(false);
                  setBloquear({});
                }}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                color="purple"
                onClick={() => handleBloquearDesbloquear()}
              >
                Sim
              </CustomButton>
            </Box>
          </Box>
        </Dialog>
        <Dialog
          open={isModalBlackListOpen}
          onBackdropClick={() => {
            setNegarCadastroId("");
            setIsModalBlackListOpen(false);
          }}
        >
          <Box
            width="500px"
            padding="20px"
            justifyContent="center"
            alignItems="center"
          >
            <DialogTitle>Desbloquear Dispositivo</DialogTitle>
            <Typography style={{ textAlign: "center" }}>
              Deseja adicionar a foto desse usuário na BlackList{" "}
              <b>
                {
                  "(bloquear a foto do usuário em todos os outros/próximos cadastros)"
                }
              </b>
              ?
            </Typography>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box style={{ marginTop: "5px", marginBottom: "5px" }}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: APP_CONFIG.mainCollors.primary,
                    color: "white",
                  }}
                  onClick={async () => {
                    const { success, status } = await dispatch(
                      postBlackListSelfieAction(token, negarCadastroId, false),
                    );
                    if (success) {
                      toast.success("Cadastro negado com sucesso!");
                      setNegarCadastroId("");
                      setIsModalBlackListOpen(false);
                    } else {
                      toast.error("Algo de errado aconteceu!" + status);
                      setNegarCadastroId("");
                      setIsModalBlackListOpen(false);
                    }
                  }}
                >
                  Bloquear e não Adicionar à BlackList
                </Button>
              </Box>
              <Box style={{ marginTop: "5px", marginBottom: "5px" }}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                  onClick={async () => {
                    const { success, status } = await dispatch(
                      postBlackListSelfieAction(token, negarCadastroId, true),
                    );
                    if (success) {
                      toast.success(
                        "Cadastro negado com sucesso! Foto adicionada à blacklist",
                      );
                      setNegarCadastroId("");
                      setIsModalBlackListOpen(false);
                    } else {
                      toast.error("Algo de errado aconteceu!" + status);
                      setNegarCadastroId("");
                      setIsModalBlackListOpen(false);
                    }
                  }}
                >
                  Bloquear e Adicionar à BlackList
                </Button>
              </Box>

              <Box style={{ marginTop: "5px", marginBottom: "5px" }}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "",
                  }}
                  onClick={() => {
                    setNegarCadastroId("");
                    setIsModalBlackListOpen(false);
                  }}
                >
                  Voltar
                </Button>
              </Box>
            </Box>
          </Box>
        </Dialog>
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
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>Contas</Typography>
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
            {hasPermission(PERMISSIONS.contas.list.search) && (
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

                <Grid item xs={12} sm={6}>
                  <SelectBeneficio
                    state={filters?.tipo_beneficio_id}
                    setState={(e) => {
                      setPage(1);
                      setFilters((prev) => ({
                        ...prev,
                        tipo_beneficio_id: e.target.value,
                      }));
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

                <Grid item xs={12} sm={3}>
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
                        style={{
                          marginRight: "10px",
                        }}
                      />
                    )}
                  </InputMask>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(PERMISSIONS.contas.list.search) && (
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

              {hasPermission(PERMISSIONS.contas.list.export) && (
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
              )}

              {hasPermission(PERMISSIONS.contas.list.export) && (
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
                    <CustomButton color="purple" onClick={handleExportarPdf}>
                      <Box display="flex" alignItems="center">
                        <ViewListIcon />
                        Exportar PDF
                      </Box>
                    </CustomButton>
                  </Box>
                </Grid>
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

        {hasPermission(PERMISSIONS.contas.list.view) && (
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
                onChange={handleChangePage}
                page={page}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ListaDeContas;
