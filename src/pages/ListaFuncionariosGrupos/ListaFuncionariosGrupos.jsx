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
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/styles";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import { Pagination } from "@mui/material";
import { DropzoneAreaBase } from "material-ui-dropzone";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { toast } from "react-toastify";
import {
  deleteFuncionarioAction,
  deleteFuncionarioGrupoAction,
  getFuncionarioAction,
  getFuncionarioGrupoAction,
  loadUserData,
  postFuncionarioLoteAction,
  putUpdateFuncionarioAction,
  putUpdateFuncionarioGrupoAction,
  setCadastrarLoteModal,
  setHeaderLike,
} from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";

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
    marginTop: "30px",
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

export default function ListaFuncionariosGrupos() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
    day: " ",
    order: "",
    mostrar: "",
    tipo: "",
  });
  const debouncedId = useDebounce(filters.id, 800);
  const userData = useSelector((state) => state.userData);
  const listaFuncionarios = useSelector((state) => state.funcionarios);
  const cadastrarLoteModal = useSelector((state) => state.cadastrarLoteModal);
  const headerLike = useSelector((state) => state.headerLike);
  const listaGrupos = useSelector((state) => state.grupos);
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);
  const [loteArquivo, setLoteArquivo] = useState("");

  var cardImage = loteArquivo[0];
  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(getFuncionarioAction(token, "", page, headerLike));
  }, [token, page, headerLike]);

  useEffect(() => {
    dispatch(getFuncionarioGrupoAction(token, page, headerLike));
  }, [token, page, headerLike]);

  useEffect(() => {
    return () => {
      dispatch(setHeaderLike(""));
    };
  }, []);

  const handleChangePage = (e, value) => {
    setPage(value);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const getIndicatorColor = (index) =>
    index === value ? `2px solid ${APP_CONFIG.mainCollors.primary}` : null;

  const onDropArquivo = async (arquivo) => {
    setLoading(true);

    setLoteArquivo(
      arquivo.map((item, index) => {
        return item;
      }),
    );

    setLoading(false);
  };

  const handleExcluirArquivo = async (item) => {
    setLoteArquivo("");
  };

  const criarLote = async (e) => {
    e.preventDefault();

    await dispatch(postFuncionarioLoteAction(token, loteArquivo));
    await dispatch(getFuncionarioAction(token));
    await dispatch(getFuncionarioGrupoAction(token));
  };

  /* 
	useEffect(() => {
		return () => {
			setFilters({ ...filters });
		};
	}, []); */

  const columns = [
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
      },
    },
    { headerText: "NOME", key: "funcionario.nome" },
    {
      headerText: "CPF",
      key: "funcionario.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "AGÊNCIA, CONTA E DÍGITO",
      key: "conta.conta", //
      CustomValue: (conta) => {
        return (
          <>
            {"0001 / "}
            {conta}
          </>
        );
      },
    },
    {
      headerText: "GRUPO",
      key: "grupo.nome",
      CustomValue: (nome) => {
        return <>{nome ?? "Não Tem"}</>;
      },
    },
    { headerText: "", key: "menu" },
  ];
  const columnsGrupos = [
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
      },
    },
    { headerText: "NOME DO GRUPO", key: "nome" },
    { headerText: "Descrição", key: "descricao" },
    { headerText: "PARTICIPANTES", key: "funcionario.documento" },
    { headerText: "", key: "menu" },
  ];

  /* const handleEditarFuncionario = async () => {
		const resEditarFuncionario = await dispatch(putUpdateFuncionarioAction(token,))
	}
 */

  const EditarFuncionario = (row) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState({
      id: "",
      nome: "",
    });
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [excluirId, setExcluirId] = useState("");

    const handleExcluirFuncionario = async () => {
      const resExcluir = await dispatch(
        deleteFuncionarioAction(token, excluirId),
      );
      if (resExcluir) {
        toast.error("Falha ao excluir funcionário");
      } else {
        toast.success("Funcionario excluído");
        dispatch(getFuncionarioAction(token));
      }
    };

    const handleEditarFuncionario = async () => {
      const resEditarFuncionario = await dispatch(
        putUpdateFuncionarioAction(token, selectedGroupId.id, row.row.id),
      );
      if (resEditarFuncionario) {
        toast.error("Falha ao selecionar grupo");
      } else {
        toast.success(
          /* `${row.row.funcionario.nome} agora está no grupo ${selectedGroup.nome}` */
          "Funcionário editado com sucesso",
        );
      }
    };

    return (
      <Box>
        <Box style={{ display: "flex" }}>
          <Box onClick={() => setOpenModal(true)}>
            <EditIcon
              style={{
                fontSize: "25px",

                color: APP_CONFIG.mainCollors.primary,
              }}
            />
          </Box>
          <Box
            style={{ marginLeft: "20px" }}
            onClick={() => {
              setOpenModalExcluir(true);
              setExcluirId(row.row.id);
            }}
          >
            <DeleteForeverIcon
              style={{
                fontSize: "25px",

                color: "#ED757D",
              }}
            />
          </Box>
        </Box>
        <Modal
          open={openModal}
          onBackdropClick={() => {
            setOpenModal(false);
            dispatch(getFuncionarioAction(token));
          }}
        >
          <Box className={classes.modal}>
            <Box
              className={classes.closeModalButton}
              onClick={() => {
                setOpenModal(false);
                dispatch(getFuncionarioAction(token));
              }}
            >
              <CloseIcon />
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              <Box style={{ display: "flex" }}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "16px",
                    color: APP_CONFIG.mainCollors.primary,
                    fontWeight: "bold",
                  }}
                >
                  Selecione um grupo para {row.row.funcionario.nome}
                </Typography>
                {/* <Typography
									style={{
										fontFamily: 'Montserrat-ExtraBold',
										fontSize: '16px',
										color: '#02953B',
										fontWeight: 'bold',
										marginLeft: '5px',
									}}
								>
									{row.row.funcionario.nome}
								</Typography> */}
              </Box>
              <Box
                style={{
                  width: "400px",
                  height: "500px",
                  display: "flex",
                  marginTop: "30px",
                  alignContent: "center",
                  flexDirection: "column",
                }}
              >
                {listaGrupos.data
                  ? listaGrupos.data.map((item, index) => (
                      <Box
                        style={{
                          height: "50px",
                          width: "300px",
                          border: "solid",
                          borderWidth: 1,
                          borderRadius: 17,
                          borderColor: APP_CONFIG.mainCollors.primary,
                          display: "flex",
                          marginTop: "10px",
                          alignSelf: "center",
                        }}
                      >
                        <Checkbox
                          color="primary"
                          checked={selectedGroup === index}
                          onChange={() => {
                            setSelectedGroup(
                              index === selectedGroup ? null : index,
                            );
                            setSelectedGroupId({
                              ...selectedGroupId,
                              id: item.id,
                              nome: item.nome,
                            });
                          }}
                        />
                        <Typography
                          style={{
                            fontFamily: "Montserrat-ExtraBold",
                            fontSize: "16px",
                            color: APP_CONFIG.mainCollors.primary,
                            alignSelf: "center",
                            marginLeft: "10px",
                          }}
                        >
                          {item.nome}
                        </Typography>
                      </Box>
                    ))
                  : null}
              </Box>

              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "30px",
                }}
              >
                <LoadingScreen isLoading={loading} />
                <Box style={{ marginTop: "10px" }}>
                  <CustomButton
                    variant="contained"
                    color="purple"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleEditarFuncionario()}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Selecionar
                    </Typography>
                  </CustomButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
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
            Deseja remover o funcionário?
          </DialogTitle>

          <DialogContent
            style={{
              minWidth: 500,
            }}
          ></DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => handleExcluirFuncionario()}
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
  };
  const EditarFuncionarioGrupo = (row) => {
    const [openModal, setOpenModal] = useState(false);
    const [editarGrupo, setEditarGrupo] = useState({
      nome: row.row.nome,
      descricao: row.row.descricao,
    });
    const [errors, setErrors] = useState({});
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [excluirId, setExcluirId] = useState("");

    const handleExcluirFuncionarioGrupo = async () => {
      setLoading(true);
      const resExcluir = await dispatch(
        deleteFuncionarioGrupoAction(token, excluirId),
      );
      if (resExcluir) {
        toast.error("Falha ao excluir grupo");
        setLoading(false);
      } else {
        toast.success("Grupo excluído");
        dispatch(getFuncionarioGrupoAction(token));
        setLoading(false);
      }
    };

    const handleEditarGrupo = async () => {
      const resEditarFuncionario = await dispatch(
        putUpdateFuncionarioGrupoAction(
          token,
          editarGrupo.nome,
          editarGrupo.descricao,
          row.row.id,
        ),
      );
      if (resEditarFuncionario) {
        toast.error("Falha ao editar grupo");
      } else {
        toast.success("Grupo editado com sucesso");
        dispatch(getFuncionarioGrupoAction(token));
      }
    };

    return (
      <Box>
        <Box style={{ display: "flex" }}>
          <Box onClick={() => setOpenModal(true)}>
            <EditIcon
              style={{
                fontSize: "25px",

                color: APP_CONFIG.mainCollors.primary,
              }}
            />
          </Box>
          <Box
            style={{ marginLeft: "20px" }}
            /* onClick={() => handleExcluirFuncionarioGrupo(row)} */
            onClick={() => {
              setOpenModalExcluir(true);
              setExcluirId(row.row.id);
            }}
          >
            <DeleteForeverIcon
              style={{
                fontSize: "25px",

                color: "#ED757D",
              }}
            />
          </Box>
        </Box>

        <Modal
          open={openModal}
          onBackdropClick={() => {
            setOpenModal(false);
            dispatch(getFuncionarioGrupoAction(token));
          }}
        >
          <Box className={classes.modal}>
            <Box
              className={classes.closeModalButton}
              onClick={() => {
                setOpenModal(false);
                dispatch(getFuncionarioGrupoAction(token));
              }}
            >
              <CloseIcon />
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              <Box style={{ display: "flex" }}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "16px",
                    color: APP_CONFIG.mainCollors.primary,
                    fontWeight: "bold",
                  }}
                >
                  Editar grupo
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "16px",
                    color: APP_CONFIG.mainCollors.primary,
                    fontWeight: "bold",
                    marginLeft: "5px",
                  }}
                >
                  {row.row.nome}
                </Typography>
              </Box>
              <Box
                style={{
                  width: "400px",

                  display: "flex",
                  marginTop: "160px",
                  alignContent: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  style={{
                    alignSelf: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    style={{ alignSelf: "center" }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    label="Nome"
                    value={editarGrupo.nome}
                    onChange={(e) =>
                      setEditarGrupo({
                        ...editarGrupo,
                        nome: e.target.value,
                      })
                    }
                    error={errors.nome}
                    helperText={errors.nome ? errors.nome.join(" ") : null}
                  />
                </Box>
                <Box
                  style={{
                    alignSelf: "center",
                    marginTop: "30px",
                  }}
                >
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    label="Descrição"
                    value={editarGrupo.descricao}
                    onChange={(e) =>
                      setEditarGrupo({
                        ...editarGrupo,
                        descricao: e.target.value,
                      })
                    }
                    error={errors.descricao}
                    helperText={
                      errors.descricao ? errors.descricao.join(" ") : null
                    }
                  />
                </Box>
              </Box>

              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "120px",
                }}
              >
                <LoadingScreen isLoading={loading} />
                <Box style={{ marginTop: "10px" }}>
                  <CustomButton
                    variant="contained"
                    color="purple"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleEditarGrupo()}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Editar
                    </Typography>
                  </CustomButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
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
            Deseja remover o grupo de funcionários?
          </DialogTitle>

          <DialogContent
            style={{
              minWidth: 500,
            }}
          ></DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => handleExcluirFuncionarioGrupo()}
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
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Funcionários e Grupos"
          isSearchVisible={true}
          routeForCreateEmployees
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
                alignItems: "center",
                borderRadius: "17px",
                flexDirection: "column",
                width: "90%",

                /* alignItems: 'center', */
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
                <Box
                  display="flex"
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Box
                    style={
                      value === 3
                        ? {
                            width: "100%",
                            borderTopRightRadius: 27,
                            borderTopLeftRadius: 27,
                          }
                        : {
                            width: "100%",
                            borderTopRightRadius: 27,
                            borderTopLeftRadius: 27,
                          }
                    }
                  >
                    <AppBar
                      position="static"
                      style={{
                        backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                        boxShadow: "none",
                        width: "100%",
                        /* borderTopRightRadius: 27,
												borderTopLeftRadius: 27, */
                      }}
                    >
                      <Tabs
                        style={{
                          color: APP_CONFIG.mainCollors.primary,
                          width: "300px",
                          boxShadow: "none",
                        }}
                        value={value}
                        onChange={handleChange}
                        indicatorcolor={APP_CONFIG.mainCollors.primary}
                        //textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab
                          label="Funcionários"
                          style={{
                            width: "200%",
                            borderBottom: getIndicatorColor(0),
                          }}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Grupos"
                          style={{
                            width: "200%",
                            borderBottom: getIndicatorColor(1),
                          }}
                          {...a11yProps(1)}
                        />
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        {listaFuncionarios.data &&
                        listaFuncionarios.per_page ? (
                          <>
                            <Box minWidth={!matches ? "800px" : null}>
                              <CustomTable
                                columns={columns ? columns : null}
                                data={listaFuncionarios.data}
                                Editar={EditarFuncionario}
                              />
                            </Box>
                            <Box alignSelf="flex-end" marginTop="8px">
                              <Pagination
                                variant="outlined"
                                color="secondary"
                                size="large"
                                count={listaFuncionarios.last_page}
                                onChange={handleChangePage}
                                page={page}
                              />
                            </Box>
                          </>
                        ) : (
                          <Box>
                            <LinearProgress color="primary" />
                          </Box>
                        )}
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        {listaGrupos.data && listaGrupos.per_page ? (
                          <>
                            <Box minWidth={!matches ? "800px" : null}>
                              <CustomTable
                                columns={columnsGrupos ? columnsGrupos : null}
                                data={listaGrupos.data}
                                Editar={EditarFuncionarioGrupo}
                              />
                            </Box>
                            <Box alignSelf="flex-end" marginTop="8px">
                              <Pagination
                                variant="outlined"
                                color="secondary"
                                size="large"
                                count={listaGrupos.last_page}
                                onChange={handleChangePage}
                                page={page}
                              />
                            </Box>
                          </>
                        ) : (
                          <Box>
                            <LinearProgress color="secondary" />
                          </Box>
                        )}
                      </TabPanel>
                    </SwipeableViews>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Dialog
          open={cadastrarLoteModal}
          onClose={() => {
            dispatch(setCadastrarLoteModal(false));
          }}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Cadastrar em lote por arquivo
          </DialogTitle>
          <form onSubmit={(e) => criarLote(e)}>
            <DialogContent>
              <DialogContentText>
                Siga as instruções e use o arquivo modelo:
              </DialogContentText>
              <Link
                target="_blank"
                download
                to="/arquivos/Instruções - Cadastro com arquivo csv.xlsx"
              >
                <Button>
                  <DownloadIcon />
                  Instruções
                </Button>
              </Link>
              <Link
                target="_blank"
                download
                to="/arquivos/Arquivo Modelo - Cadastro de Funcionario.xlsx"
              >
                <Button>
                  <DownloadIcon />
                  Arquivo modelo
                </Button>
              </Link>
              <DialogContentText>Insira o arquivo abaixo:</DialogContentText>
              <Box className={classes.dropzoneContainer}>
                <DropzoneAreaBase
                  dropzoneParagraphClass={classes.textoDropzone}
                  maxFileSize={3145728}
                  onDropRejected={() => {
                    toast.error("Tamanho máximo: 3mb");
                    toast.error("Arquivos suportados: .csv, .txt, .xls, .xlsx");
                  }}
                  acceptedFiles={[
                    "text/csv",
                    "text/plain",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  ]}
                  dropzoneClass={classes.dropzoneAreaBaseClasses}
                  onAdd={onDropArquivo}
                  filesLimit={1}
                  dropzoneText="Arraste e solte o arquivo aqui ou clique para escolher"
                  showPreviews={false}
                  showPreviewsInDropzone={false}
                />
                <Box width="300px" style={{ marginTop: "10px" }}>
                  <Grid container>
                    {loteArquivo ? (
                      <Grid item xs={6}>
                        <Card className={classes.card}>
                          <CardActionArea>
                            <Box position="absolute">
                              <IconButton
                                onClick={() =>
                                  handleExcluirArquivo(loteArquivo)
                                }
                                size="small"
                                style={{
                                  color: "white",
                                  backgroundColor: "red",
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                            </Box>
                            {cardImage.data.includes("text/csv") ? (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "100px",
                                  flexDirection: "column",
                                }}
                                onClick={() => window.open(cardImage.data)}
                              >
                                <ArticleIcon
                                  style={{
                                    color: "black",
                                    fontSize: "70px",
                                  }}
                                />
                                <Typography style={{ fontSize: 12 }}>
                                  {cardImage.file.name}
                                </Typography>
                              </Box>
                            ) : (
                              <CardMedia
                                component="img"
                                alt="Arquivo de Identificação"
                                height="100"
                                image={cardImage.data}
                                onClick={() => window.open(cardImage.data)}
                              />
                            )}
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ) : null}
                  </Grid>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  dispatch(setCadastrarLoteModal(false));
                }}
                color="primary"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  dispatch(setCadastrarLoteModal(false));
                }}
                color="primary"
                type="submit"
              >
                Enviar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
}
