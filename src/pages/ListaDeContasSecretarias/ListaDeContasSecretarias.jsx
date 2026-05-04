import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { Tooltip } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import { toast } from "react-toastify";

import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getContas, getContasExport } from "../../services/services";
import px2vw from "../../utils/px2vw";

import usePermission from "../../hooks/usePermission";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

moment.locale("pt-br");

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
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 27,
    padding: "16px",
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: "#35322f",
    height: "140px",
    "&:hover": {
      // cursor: "pointer",
      backgroundColor: theme.palette.secondary.light,
      transform: "scale(1.05)",
      color: "white",
    },
    transition: `${theme.transitions.create(["background-color", "transform"], {
      duration: theme.transitions.duration.standard,
    })}`,
    animation: `$myEffect 500ms ${theme.transitions.easing.easeInOut}`,
    [theme.breakpoints.down("md")]: {
      width: "170px",
      height: "100px",
      margin: "16px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100px",
      height: "110px",
      margin: "6px",
    },
  },
}));

const ListaDeContasSecretarias = () => {
  const [page, setPage] = useState(1);
  const token = useAuth();
  const conta = useSelector((state) => state.conta);
  const classes = useStyles();
  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "9",
    id: "",
    status: " ",
    numero_documento: "",
    tipo: " ",
    cnpj: "",
  });
  const [listaContas, setListaContas] = useState([]);
  const debouncedFilters = useDebounce(filters, 800);
  const [loading, setLoading] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const getData = async () => {
    setLoading(true);
    const { data } = await getContas(
      token,
      page,
      filters.like,
      filters.order,
      filters.mostrar,
      filters.id,
      "",
      "",
      "",
      filters.tipo,
      filters.cnpj,
      filters.status,
      false,
      "",
      false,
      true
    );
    setListaContas(data);
    try {
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page, debouncedFilters]);

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
        return <Typography>{data?.razao_social ?? data?.nome}</Typography>;
      },
    },
    // {
    //   headerText: "Status",
    //   key: "status_adquirencia",
    //   CustomValue: (value) => {
    //     if (
    //       hasPermission("Atendimento - Consulta de status da conta")
    //     ) {
    //       if (value === "pending") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#F1E3D4",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "orange", width: "100%" }}>
    //                 PENDENTE
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //       if (value === "incomplete") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#F1E3D4",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "orange", width: "100%" }}>
    //                 INCOMPLETO
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //       if (value === "active") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#C9DBF2",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "#75B1ED", width: "100%" }}>
    //                 ATIVO
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //       if (value === "enabled") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#C9DBF2",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "#75B1ED", width: "100%" }}>
    //                 HABILITADO
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //       if (value === "approved") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#C9ECE7",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "#00B57D", width: "100%" }}>
    //                 APROVADO
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //       if (value === "divergence") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#AA7EB3",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "#531A5F", width: "100%" }}>
    //                 DIVERGÊNCIA
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //       if (value === "denied") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#ECC9D2",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "#ED757D", width: "100%" }}>
    //                 NEGADO
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //       if (value === "deleted") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#ECC9D2",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "#ED757D", width: "100%" }}>
    //                 ENCERRADO
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //       if (value === "refused") {
    //         return (
    //           <Box
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               width: "100%",
    //             }}
    //           >
    //             <Box
    //               style={{
    //                 borderRadius: 32,
    //                 backgroundColor: "#DFB9D4",
    //                 maxWidth: "120px",
    //                 padding: "5px",
    //               }}
    //             >
    //               <Typography style={{ color: "#95407B", width: "100%" }}>
    //                 RECUSADO
    //               </Typography>
    //             </Box>
    //           </Box>
    //         );
    //       }
    //     } else {
    //       return null;
    //     }
    //   },
    // },
    {
      headerText: "Documento",
      key: "",
      FullObject: (data) => (
        <Typography>{documentMask(data.cnpj ?? data.documento)}</Typography>
      ),
    },
    {
      headerText: "Contato",
      key: "celular",
      CustomValue: (data) => <Typography>{phoneMask(data)}</Typography>,
    },
    // {
    //   headerText: "Segurança",
    //   key: "",
    //   FullObject: ({ user }) => {
    //     if (user) {
    //       if (user.verificar_device_bloqueado) {
    //         return (
    //           <Typography style={{ color: "red", fontSize: "0.7rem" }}>
    //             Dispositivo bloqueado
    //             <br />
    //             Aguardando Verificação
    //           </Typography>
    //         );
    //       }
    //       if (user.verificar_device_alterado) {
    //         return (
    //           <Typography style={{ color: "red", fontSize: "0.7rem" }}>
    //             Dispositivo alterado
    //             <br />
    //             Aguardando Verificação
    //           </Typography>
    //         );
    //       }

    //       if (user.aguardando_confirmacao_device) {
    //         return (
    //           <Typography
    //             style={{
    //               color: APP_CONFIG.mainCollors.primary,
    //               fontSize: "0.7rem",
    //             }}
    //           >
    //             Aguardando Confirmação
    //           </Typography>
    //         );
    //       }

    //       if (
    //         !user.verificar_device_alterado &&
    //         !user.verificar_device_bloqueado &&
    //         !user.aguardando_confirmacao_device
    //       ) {
    //         return <CheckIcon style={{ color: "green" }} />;
    //       }
    //     }
    //   },
    // },
    conta?.is_default_app_account
      ? {
          headerText: "QiTech",
          key: "",
          FullObject: (value) => {
            if (value.seller_id) {
              return (
                <Tooltip title="Cadastro conciliado com QiTech">
                  <CheckIcon style={{ color: "green" }} />
                </Tooltip>
              );
            } else {
              return (
                <Tooltip title="Aguardando envio do cadastro para conciliação com QiTech">
                  <PriorityHighIcon style={{ color: "orange" }} value />
                </Tooltip>
              );
            }
          },
        }
      : {},
  ];

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleExportar = async (type = "xlsx") => {
    toast.warning("A exportação pode demorar um pouco, por favor aguarde...");
    const { data } = await getContasExport(
      token,
      "",
      page,
      filters.like,
      filters.id,
      "",
      filters.status,
      "",
      filters.tipo,
      filters.order,
      filters.mostrar,
      filters.cnpj,
      type,
      "solicitado_adquirencia=false&is_estabelecimento=false&is_gestao_concorrencia=true"
    );
    const newWindow = window.open(data?.url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  // const Editar = (row) => {
  //   const [anchorEl, setAnchorEl] = useState(null);

  //   const handleClick = (event) => {
  //     setAnchorEl(event.currentTarget);
  //   };
  //   const handleClose = () => {
  //     setAnchorEl(null);
  //   };

  //   return (
  //     <Box>
  //       <IconButton
  //         style={{ height: "15px", width: "10px" }}
  //         aria-controls="simple-menu"
  //         aria-haspopup="true"
  //         onClick={handleClick}
  //       >
  //         <SettingsIcon
  //           style={{
  //             borderRadius: 33,
  //             fontSize: "35px",
  //             backgroundColor: APP_CONFIG.mainCollors.primary,
  //             color: "white",
  //           }}
  //         />
  //       </IconButton>

  //       <Menu
  //         onClick={() => {}}
  //         id="simple-menu"
  //         anchorEl={anchorEl}
  //         keepMounted
  //         open={Boolean(anchorEl)}
  //         onClose={handleClose}
  //       >
  //         <MenuItem
  //           onClick={() => handleEditarUsuario(row)}
  //           style={{ color: APP_CONFIG.mainCollors.secondary }}
  //         >
  //           Editar
  //         </MenuItem>
  //         <MenuItem
  //           onClick={() => handleGerenciarUsuario(row)}
  //           style={{ color: APP_CONFIG.mainCollors.secondary }}
  //         >
  //           Gerenciar
  //         </MenuItem>
  //       </Menu>
  //     </Box>
  //   );
  // };

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
            Contas Secretarias
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
            // backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            {/* <Grid container spacing={3}>
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
                <Select
                  style={{
                    marginTop: "10px",
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
         
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={4} />
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
                    color="purple"
                    onClick={() => handleExportar("pdf")}
                  >
                    <Box display="flex" alignItems="center">
                      <ViewListIcon />
                      Exportar PDF
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
                      setFilters({
                        like: "",
                        order: "",
                        mostrar: "",
                        id: "",
                        status: " ",
                        numero_documento: "",
                        tipo: " ",
                        cnpj: "",
                      });
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <DeleteIcon />
                      Limpar
                    </Box>
                  </CustomButton>
                </Box>
              </Grid>
            </Grid> */}
          </Box>

          {/* <Typography
            className={classes.pageTitle}
            style={{ marginLeft: "30px", marginBottom: "30px" }}
          >
            CONTAS RECENTES
          </Typography> */}
        </Box>

        {hasPermission(PERMISSIONS.secretarias.list.view) && (
          <Box className={classes.tableContainer}>
            {!loading && listaContas?.data && listaContas?.per_page ? (
              // <Box minWidth={!matches ? "800px" : null}>
              //   <TableContainer style={{ overflowX: "auto" }}>
              //     <CustomTable
              //       columns={columns ? columns : null}
              //       data={listaContas.data}
              //       Editar={Editar}
              //     />
              //   </TableContainer>
              // </Box>

              <>
                <Grid container spacing={2}>
                  {listaContas?.data?.map((obj) => (
                    <CardSecretaria item={obj} />
                  ))}
                </Grid>
              </>
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

export default ListaDeContasSecretarias;

function CardSecretaria({ item = {} }) {
  const history = useHistory();
  const classes = useStyles();
  const { hasPermission, PERMISSIONS } = usePermission();

  const handleEditarUsuario = (row) => {
    const path = generatePath(
      row.tipo === "Pessoa Jurídica"
        ? "/dashboard/editar-conta-pj-adquirencia/:id/editar"
        : "/dashboard/editar-conta-adquirencia/:id/editar",
      {
        id: row.id,
      }
    );
    history.push(path);
  };

  const handleGerenciarUsuario = (row) => {
    const path = generatePath(
      row.tipo === "Pessoa Jurídica"
        ? "/dashboard/gerenciar-contas/:id/lista-conta-juridica"
        : "/dashboard/gerenciar-contas/:id/listas",
      {
        id: row.id,
      }
    );
    history.push(path);
  };

  return (
    <Grid item xs={12} sm={4}>
      <Box className={classes.iconContainer}>
        <Typography color="primary">
          {item?.razao_social ?? item?.nome}
        </Typography>

        <Box style={{ display: "flex" }}>
          <MenuItem
            onClick={() => handleEditarUsuario(item)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={
              !(
                hasPermission(
                  "Atendimento - Consulta de dados cadastrais(E-mail, Telefone, Endereço e CPF)"
                ) || hasPermission(PERMISSIONS.secretarias.actions.edit)
              )
            }
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => handleGerenciarUsuario(item)}
            style={{ color: APP_CONFIG.mainCollors.secondary }}
            disabled={
              !(
                hasPermission(
                  "Operações - Histórico de transações, extrato, pix, cobrança recorrente, carnê, boleto, chave pix cadastrada, exceto permissão para aprovação de cadastro, reenvio de token de aprovação e editar"
                ) || hasPermission(PERMISSIONS.secretarias.actions.manage)
              )
            }
          >
            Gerenciar
          </MenuItem>
        </Box>
      </Box>
    </Grid>
  );
}
