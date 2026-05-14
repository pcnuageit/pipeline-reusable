import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/styles";
import ArticleIcon from "@mui/icons-material/Article";
import DownloadIcon from "@mui/icons-material/Download";
import { Pagination } from "@mui/material";
import { DropzoneAreaBase } from "material-ui-dropzone";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { toast } from "react-toastify";
import {
  getArquivoLoteAction,
  getArquivoLoteComprovanteAction,
  getArquivoLoteFuncionarioAction,
  loadUserData,
  postFolhaDePagamentoLoteAction,
  postReenviarFolhaDePagamentoLoteAction,
  setCadastrarLoteModal,
} from "../../actions/actions";
import CustomCollapseTable from "../../components/CustomCollapseTable/CustomCollapseTable";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

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

export default function ListaArquivosLote() {
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
  const [loteArquivo, setLoteArquivo] = useState("");
  const debouncedId = useDebounce(filters.id, 800);
  const userData = useSelector((state) => state.userData);
  const arquivoLote = useSelector((state) => state.arquivoLote);
  const arquivoLoteFuncionario = useSelector(
    (state) => state.arquivoLoteFuncionario,
  );
  const arquivoLoteComprovante = useSelector(
    (state) => state.arquivoLoteComprovante,
  );
  const cadastrarLoteModal = useSelector((state) => state.cadastrarLoteModal);
  const [dadosArquivoLote, setDadosArquivoLote] = useState({
    descricao: "",
    data_pagamento: "",
  });
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);

  var cardImage = loteArquivo[0];

  moment.locale();

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token]);

  useEffect(() => {
    dispatch(getArquivoLoteAction(token, page));
  }, [token, page]);

  useEffect(() => {
    dispatch(getArquivoLoteFuncionarioAction(token, page));
  }, [token, page]);

  useEffect(() => {
    dispatch(getArquivoLoteComprovanteAction(token, page));
  }, [token, page]);

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

    await dispatch(
      postFolhaDePagamentoLoteAction(
        token,
        loteArquivo,
        dadosArquivoLote.descricao,
        dadosArquivoLote.data_pagamento,
      ),
    );
    await dispatch(getArquivoLoteAction(token, page));
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
    { headerText: "Nome", key: "name" },
    {
      headerText: "Processo",
      key: "processed",
      CustomValue: (processed) => {
        return (
          <Typography>
            {processed === 0
              ? "Processando"
              : processed === 1
                ? "Processado"
                : null}
          </Typography>
        );
      },
    },
    {
      headerText: "DATA DE PAGAMENTO",
      key: "data_pagamento",
      CustomValue: (data_pagamento) => {
        return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
      },
    },

    {
      headerText: "",
      key: "menu",
    },
  ];
  const columnsComprovantes = [
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (created_at) => {
        return <>{moment.utc(created_at).format("DD MMMM YYYY")}</>;
      },
    },
    { headerText: "Nome", key: "name" },
    {
      headerText: "Processo",
      key: "processed",
      CustomValue: (processed) => {
        return (
          <Typography>
            {processed === 0
              ? "Processando"
              : processed === 1
                ? "Processado"
                : null}
          </Typography>
        );
      },
    },
    {
      headerText: "DATA DE PAGAMENTO",
      key: "data_pagamento",
      CustomValue: (data_pagamento) => {
        return <>{moment.utc(data_pagamento).format("DD MMMM YYYY")}</>;
      },
    },
    {
      headerText: "",
      key: "menu",
    },
  ];

  const itemColumns = [
    {
      headerText: "Erros",
      key: "descricao",
      CustomValue: (erros) => <Typography>{erros}</Typography>,
    },
  ];

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleReenviarLote = async (row) => {
      const resReenviarLote = await dispatch(
        postReenviarFolhaDePagamentoLoteAction(token, row.row.id),
      );
      if (resReenviarLote) {
        toast.error("Falha ao reenviar lote");
      } else {
        toast.success("Lote reenviado com sucesso");
        await dispatch(getArquivoLoteAction(token, page));
      }
    };

    return (
      <>
        <Box
          onClick={handleClick}
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            height: "50px",
            width: "50px",
            cursor: "pointer",
            borderRadius: "32px",
            alignItems: "center",
            justifyContent: "center",

            "&:hover": {
              cursor: "pointer",
              backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
            },
          }}
        >
          <SettingsIcon
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontSize: "30px",
              "&:hover": {
                backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
              },
            }}
          />
        </Box>
        <Menu
          onClick={() => {}}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
            onClick={() => handleReenviarLote(row)}
          >
            Reenviar lote
          </MenuItem>
        </Menu>
      </>
    );
  };

  const EditarComprovantes = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Box
          onClick={handleClick}
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            height: "50px",
            width: "50px",
            cursor: "pointer",
            borderRadius: "32px",
            alignItems: "center",
            justifyContent: "center",

            "&:hover": {
              cursor: "pointer",
              backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
            },
          }}
        >
          <SettingsIcon
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontSize: "30px",
              "&:hover": {
                backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
              },
            }}
          />
        </Box>
        <Menu
          onClick={() => {}}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
            onClick={() => window.location.replace(row.row.arquivo)}
          >
            Baixar PDF
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Arquivos em lote"
          isSearchVisible={true}
          routeForCreatePayroll
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
                minWidth: "100%",

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
                      color="default"
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
                          width: "460px",
                          boxShadow: "none",
                        }}
                        value={value}
                        onChange={handleChange}
                        indicatorcolor={APP_CONFIG.mainCollors.primary}
                        //textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab
                          label="Folhas de pagamento"
                          style={{
                            width: "100%",
                            borderBottom: getIndicatorColor(0),
                          }}
                          {...a11yProps(0)}
                        />

                        <Tab
                          label="Funcionários"
                          style={{
                            width: "100%",
                            borderBottom: getIndicatorColor(1),
                          }}
                          {...a11yProps(1)}
                        />

                        <Tab
                          label="Comprovantes"
                          style={{
                            width: "100%",
                            borderBottom: getIndicatorColor(2),
                          }}
                          {...a11yProps(2)}
                        />
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        {arquivoLote.data && arquivoLote.per_page ? (
                          <>
                            <Box minWidth={!matches ? "800px" : null}>
                              <CustomCollapseTable
                                columns={columns ? columns : null}
                                itemColumns={itemColumns}
                                data={arquivoLote.data}
                                Editar={Editar}
                              />
                            </Box>
                            <Box alignSelf="flex-end" marginTop="8px">
                              <Pagination
                                variant="outlined"
                                color="secondary"
                                size="large"
                                count={arquivoLote.last_page}
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
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        {arquivoLoteFuncionario.data &&
                        arquivoLoteFuncionario.per_page ? (
                          <>
                            <Box minWidth={!matches ? "800px" : null}>
                              <CustomCollapseTable
                                columns={columns ? columns : null}
                                itemColumns={itemColumns}
                                data={arquivoLoteFuncionario.data}
                                Editar={Editar}
                              />
                            </Box>
                            <Box alignSelf="flex-end" marginTop="8px">
                              <Pagination
                                variant="outlined"
                                color="secondary"
                                size="large"
                                count={arquivoLoteFuncionario.last_page}
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
                      <TabPanel value={value} index={2} dir={theme.direction}>
                        {arquivoLoteComprovante.data &&
                        arquivoLoteComprovante.per_page ? (
                          <>
                            <Box minWidth={!matches ? "800px" : null}>
                              <CustomTable
                                columns={
                                  columnsComprovantes
                                    ? columnsComprovantes
                                    : null
                                }
                                data={arquivoLoteComprovante.data}
                                Editar={EditarComprovantes}
                              />
                            </Box>
                            <Box alignSelf="flex-end" marginTop="8px">
                              <Pagination
                                variant="outlined"
                                color="secondary"
                                size="large"
                                count={arquivoLoteComprovante.last_page}
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
              to="/arquivos/Instruções - Folha de Pagamento.xlsx"
            >
              <Button>
                <DownloadIcon />
                Instruções
              </Button>
            </Link>
            <Link
              target="_blank"
              download
              to="/arquivos/Arquivo Modelo - Folha de Pagamento.xlsx"
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
                              onClick={() => handleExcluirArquivo(loteArquivo)}
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
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: "30px",
                }}
              >
                <Box>
                  <TextField
                    required
                    style={{ width: "175px" }}
                    label="Descrição"
                    variant="outlined"
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                    }}
                    value={dadosArquivoLote.descricao}
                    onChange={(e) =>
                      setDadosArquivoLote({
                        ...dadosArquivoLote,
                        descricao: e.target.value,
                      })
                    }
                  />
                </Box>
                <Box style={{ marginLeft: "10px" }}>
                  <TextField
                    required
                    variant="outlined"
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    value={dadosArquivoLote.data_pagamento}
                    onChange={(e) =>
                      setDadosArquivoLote({
                        ...dadosArquivoLote,
                        data_pagamento: e.target.value,
                      })
                    }
                  />
                </Box>
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
  );
}
