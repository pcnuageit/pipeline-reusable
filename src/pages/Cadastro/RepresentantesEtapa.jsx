import {
  Box,
  Checkbox,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import CustomSideBar from "../../components/CustomSideBar/CustomSideBar";

import SettingsIcon from "@material-ui/icons/Settings";
import ReactInputMask from "react-input-mask";
import {
  deleteRepresentanteAction,
  getRepresentanteAction,
  postPreContaRepresentanteAction,
  putRepresentanteAction,
} from "../../actions/actions";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCloseButton from "../../components/CustomCloseButton/CustomCloseButton";
import CustomFowardButton from "../../components/CustomFowardButton/CustomFowardButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",

    flexGrow: 1,
    // width: '100vw',
    // height: '100vh',

    [theme.breakpoints.down("1024")]: {
      width: "100vw",
    },
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "20px",
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

    marginTop: "100px",

    [theme.breakpoints.down("1024")]: {
      flexDirection: "column",
      marginTop: "15px",
    },
  },
  form: {
    borderRadius: 20,
    backgroundColor: "#F6F6FA",
    width: "80%",

    [theme.breakpoints.down("1024")]: {
      width: "100%",
      overflowX: "auto",
    },
  },
  stepper: {
    backgroundColor: "inherit",
    minHeight: "500px",

    /* width: '70%', */
    /* marginTop: '100px', */
    display: "flex",

    [theme.breakpoints.down("1024")]: {
      minHeight: "0px",
      height: "100%",
    },
  },
  inputAutofill: {
    "& :-webkit-autofill": {
      "-webkit-text-fill-color": `${APP_CONFIG.mainCollors.primary} !important`,
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "85%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: "100vh",
    backgroundColor: "#F6F6FA",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 5,
    overflowY: "auto",

    [theme.breakpoints.down("1024")]: {
      top: 0,
      left: 0,
      transform: "translate(0, 0)",
      width: "100%",
      height: "100%",
    },
  },
}));

export default function RepresentantesEtapa({ getNextEtapa }) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const dadosCadastrais = useSelector((state) => state.cadastroEtapa2);
  const listaRepresentante = useSelector((state) => state.listaRepresentante);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [fillCheckboxSim, setFillCheckboxSim] = useState(false);
  const [fillCheckboxNao, setFillCheckboxNao] = useState(false);
  const [fillCheckboxSimEditar, setFillCheckboxSimEditar] = useState(false);
  const [fillCheckboxNaoEditar, setFillCheckboxNaoEditar] = useState(false);
  const [errors, setErrors] = useState("");
  const [errorsEditar, setErrorsEditar] = useState("");

  const [dadosRepresentante, setDadosRepresentante] = useState({
    preconta_id: dadosCadastrais.id,
    nome: "",
    documento: "",
    email: "",
    celular: "",
    permissao: null,
  });

  const [dadosRepresentanteEditar, setDadosRepresentanteEditar] = useState({
    nome: "",
    documento: "",
    email: "",
    celular: "",
    permissao: null,
  });

  useEffect(() => {
    dispatch(getRepresentanteAction(dadosCadastrais.id));
  }, [dadosCadastrais.id]);

  const handleContinuar = () => {
    if (listaRepresentante.total > 0) {
      getNextEtapa({ voltar: false });
    } else {
      toast.error("Você precisa cadastrar pelo menos um representante");
    }
  };

  const handleVoltar = () => {
    getNextEtapa({ voltar: true });
  };

  const handleAdicionarRepresentante = async () => {
    const resRepresentante = await dispatch(
      postPreContaRepresentanteAction(dadosRepresentante),
    );
    if (resRepresentante) {
      setErrors(resRepresentante);
      toast.error("Erro ao adicionar representante");
    } else {
      toast.success("Representante adicionado com sucesso");
      await dispatch(getRepresentanteAction(dadosCadastrais.id));
      setOpenModal(false);
    }
  };

  const steps = [
    {
      label: "Dados gerais",
      description: (
        <Box
          style={{
            backgroundColor: "#00FF80",
            display: "flex",
            borderRadius: 20,
            justifyContent: "center",
          }}
        >
          <Typography
            style={{
              fontSize: "15  px",
              fontFamily: "Montserrat-Regular",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Concluído
          </Typography>
        </Box>
      ),
    },
    {
      label: "Endereço comercial",
      description: "",
    },
    {
      label: "Cadastrar Sócios",
      description: "",
    },
    {
      label: "Representantes",
      description: ``,
    },
    {
      label: "Dados complementares",
      description: ``,
    },
    // {
    //   label: "Envio de documentos",
    //   description: ``,
    // },
    {
      label: "Resumo",
      description: ``,
    },
  ];

  const columns = [
    { headerText: "Nome", key: "nome" },
    {
      headerText: "Documento",
      key: "documento",
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
      key: "permissao",
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

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleEditar = (row) => {
      setDadosRepresentanteEditar({
        ...dadosRepresentanteEditar,
        nome: row.row.nome,
        documento: row.row.documento,
        email: row.row.email,
        celular: row.row.celular,
        permissao: row.row.permissao,
      });
      setOpenModalEditar(true);
    };

    const handleEditarRepresentante = async () => {
      const resRepresentante = await dispatch(
        putRepresentanteAction(dadosRepresentanteEditar, row.row.id),
      );
      if (resRepresentante) {
        setErrorsEditar(resRepresentante);
        toast.error("Erro ao editar representante");
      } else {
        toast.success("Representante editado com sucesso");
      }
    };

    const handleExcluirRepresentante = async (item) => {
      const resExcluir = await dispatch(deleteRepresentanteAction(row.row.id));
      if (resExcluir) {
        toast.error("Erro ao excluir representante");
      } else {
        toast.success("Representante excluído com sucesso");
        await dispatch(getRepresentanteAction(dadosCadastrais.id));
      }
    };
    /*
		const handlePermissions = () => {
			const path = generatePath(
				'/dashboard/lista-de-administradores/:id/permissoes',
				{
					id: row.row.id,
				}
			);
			history.push(path);
		};

		const handleReenviarTokenUsuario = async (row) => {
			setLoading(true);
			const resReenviarToken = await dispatch(
				getReenviarTokenUsuarioAction(token, row.row.id)
			);
			if (resReenviarToken === false) {
				setDisabled(true);
				toast.success('Reenviado com sucesso');
				setLoading(false);
			} else {
				toast.error('Falha ao reenviar');
				setLoading(false);
			}
		}; */

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
            onClick={() => handleExcluirRepresentante(row)}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Excluir
          </MenuItem>
        </Menu>
        <Dialog
          open={openModalEditar}
          onBackdropClick={() => setOpenModalEditar(false)}
        >
          <Box /* className={classes.modal} */>
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
                    onClick={() => setOpenModalEditar(false)}
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
                  className={classes.inputAutofill}
                  required
                  variant="standard"
                  label="Nome"
                  fullWidth
                  value={dadosRepresentanteEditar.nome}
                  error={errorsEditar.nome}
                  helperText={
                    errorsEditar.nome ? errorsEditar.nome.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosRepresentanteEditar({
                      ...dadosRepresentanteEditar,
                      nome: e.target.value,
                    })
                  }
                />
                <TextField
                  className={classes.inputAutofill}
                  style={{ marginTop: "20px" }}
                  required
                  variant="standard"
                  label="CPF"
                  fullWidth
                  value={dadosRepresentanteEditar.documento}
                  error={errorsEditar.documento}
                  helperText={
                    errorsEditar.documento
                      ? errorsEditar.documento.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosRepresentanteEditar({
                      ...dadosRepresentanteEditar,
                      documento: e.target.value,
                    })
                  }
                />
                <TextField
                  className={classes.inputAutofill}
                  style={{ marginTop: "20px" }}
                  required
                  variant="standard"
                  label="E-mail"
                  fullWidth
                  value={dadosRepresentanteEditar.email}
                  error={errorsEditar.email}
                  helperText={
                    errorsEditar.email ? errorsEditar.email.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosRepresentanteEditar({
                      ...dadosRepresentanteEditar,
                      email: e.target.value,
                    })
                  }
                />
                <TextField
                  className={classes.inputAutofill}
                  style={{ marginTop: "20px" }}
                  required
                  variant="standard"
                  label="Celular"
                  fullWidth
                  value={dadosRepresentanteEditar.celular}
                  error={errorsEditar.celular}
                  helperText={
                    errorsEditar.celular ? errorsEditar.celular.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosRepresentanteEditar({
                      ...dadosRepresentanteEditar,
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
                    checked={fillCheckboxSimEditar}
                    onChange={() => {
                      setFillCheckboxSimEditar(true);
                      setFillCheckboxNaoEditar(false);
                      setDadosRepresentanteEditar({
                        ...dadosRepresentanteEditar,
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
                    checked={fillCheckboxNaoEditar}
                    onChange={() => {
                      setFillCheckboxSimEditar(false);
                      setFillCheckboxNaoEditar(true);
                      setDadosRepresentanteEditar({
                        ...dadosRepresentanteEditar,
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
        </Dialog>
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <CustomSideBar cadastro />
      <Box className={classes.main}>
        <CustomHeader cadastro />
        <Box className={classes.dadosBox}>
          <Box
            style={{
              display: "flex",
              justifyContent: "left",
              /* 	maxWidth: 400,
							minWidth: 400, */
            }}
          >
            <Stepper
              activeStep={3}
              connector
              orientation="vertical"
              className={classes.stepper}
            >
              {steps.map((step, index) => (
                <Step
                  key={step.label}
                  style={{
                    backgroundColor: "inherit",
                    /* width: '70%', */

                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <StepLabel
                  /* optional={
											index === 5 ? (
												<Typography
													style={{
														fontFamily: 'Montserrat-Thin',
														color: APP_CONFIG.mainCollors.primary,
													}}
												>
													Última etapa
												</Typography>
											) : null
										} */
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                  </StepContent>
                  {index === steps.length - 1 ? null : (
                    <StepConnector orientation="vertical" />
                  )}
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box className={classes.form}>
            <Box style={{ padding: "10px", marginLeft: "20px" }}>
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: "16px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "30px",
                }}
              >
                Criar representante
              </Typography>
              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "14px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "10px",
                }}
              >
                Você precisa cadastrar pelo menos um representante que tem poder
                para fazer operações bancárias.
              </Typography>
              <Grid container spacing={2} style={{ marginTop: "50px" }}>
                <Grid item sm={12} xs={12}>
                  {listaRepresentante.data && listaRepresentante.total > 0 ? (
                    // <Box minWidth={!matches ? '800px' : null}>
                    <CustomTable
                      columns={columns ? columns : null}
                      data={listaRepresentante.data}
                      Editar={Editar}
                    />
                  ) : (
                    // </Box>
                    <Box
                      width="80%"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <LinearProgress color="secondary" />
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Box
                style={{
                  width: "100%",
                  alignSelf: "flex-end",
                  marginTop: "100px",
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
                </Box>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "30px",
                  }}
                >
                  <CustomBackButton color="purple" onClick={handleVoltar} />
                  <CustomFowardButton
                    color="purple"
                    onClick={handleContinuar}
                  />
                </Box>
                {/* <Box
									style={{
										display: 'flex',
										justifyContent: 'end',
										marginTop: '200px',
									}}
								></Box> */}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={openModal} onBackdropClick={() => setOpenModal(false)}>
        <Box>
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
                className={classes.inputAutofill}
                required
                variant="standard"
                label="Nome"
                fullWidth
                value={dadosRepresentante.nome}
                error={errors.nome}
                helperText={errors.nome ? errors.nome.join(" ") : null}
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
                    className={classes.inputAutofill}
                    style={{ marginTop: "20px" }}
                    required
                    variant="standard"
                    label="CPF"
                    fullWidth
                    error={errors.documento}
                    helperText={
                      errors.documento ? errors.documento.join(" ") : null
                    }
                  />
                )}
              </ReactInputMask>
              <TextField
                className={classes.inputAutofill}
                style={{ marginTop: "20px" }}
                required
                variant="standard"
                label="E-mail"
                fullWidth
                value={dadosRepresentante.email}
                error={errors.email}
                helperText={errors.email ? errors.email.join(" ") : null}
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
                    className={classes.inputAutofill}
                    style={{ marginTop: "20px" }}
                    required
                    variant="standard"
                    label="Celular"
                    fullWidth
                    error={errors.celular}
                    helperText={
                      errors.celular ? errors.celular.join(" ") : null
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
                Representante tem amplos poderes para fazer operações bancárias
                em nome da empresa?
              </Typography>
              <Box style={{ display: "flex", marginTop: "10px" }}>
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
      </Dialog>
      {/*  Modal editar */}
    </Box>
  );
}
