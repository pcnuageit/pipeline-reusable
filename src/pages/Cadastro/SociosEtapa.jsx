import {
  Box,
  Dialog,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import CustomSideBar from "../../components/CustomSideBar/CustomSideBar";

import SettingsIcon from "@material-ui/icons/Settings";
import CurrencyInput from "react-currency-input-field";
import {
  default as InputMask,
  default as ReactInputMask,
} from "react-input-mask";
import {
  deleteSocioAction,
  getSocioAction,
  postSocioAction,
  putSocioAction,
} from "../../actions/actions";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomCloseButton from "../../components/CustomCloseButton/CustomCloseButton";
import CustomFowardButton from "../../components/CustomFowardButton/CustomFowardButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import { getCep } from "../../services/services";
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
  currency: {},
  currencyInputContainer: {
    fontSize: "16px",
    fontColor: APP_CONFIG.mainCollors.primary,
    color: APP_CONFIG.mainCollors.primary,
    width: "100%",
    border: "0px",
    borderBottom: "1px solid gray",
    height: "1.1876em",
    marginTop: "14px",
    display: "block",
    padding: "6px 0 7px",
    minWidth: 0,
    background: "none",
    boxSizing: "content-box",
    animationName: "mui-auto-fill-cancel",
    letterSpacing: "inherit",
    animationDuration: "10ms",
    appearance: "textfield",
    textAlign: "start",
    paddingLeft: "5px",

    // styles for the container
  },
  input: {
    fontFamily: "Montserrat-Regular",
    // styles for the input field
    "&::placeholder": {
      color: APP_CONFIG.mainCollors.primary,

      fontFamily: "Montserrat-Thin",
      fontWeight: "bold",

      // Change this to your desired color
    },
  },
  inputAdornment: {
    pointerEvents: "none",
    opacity: 0,
  },

  adminSwitch: {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: theme.palette.secondary.main, // Change the checked color to secondary color
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: theme.palette.secondary.main, // Change the track color to secondary color when checked
    },
  },
}));

export default function SociosEtapa({ getNextEtapa }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const dadosCadastrais = useSelector((state) => state.cadastroEtapa2);
  const listaSocio = useSelector((state) => state.listaSocio);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const [dadosSocio, setDadosSocio] = useState({
    preconta_id: dadosCadastrais.id,
    admin: false,
    nome: "",
    nome_mae: "",
    percentual: "",
    documento: "",
    numero_identidade: "",
    renda_mensal: "",
    data_nascimento: "",
    email: "",
    telefone: "",
    endereco: {
      cep: "",
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  const formatMoney = (value) =>
    Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      value,
    );

  /* 	useEffect(() => {
		dispatch(getSocioAction(dadosCadastrais.id));
	}, [dadosCadastrais.id]); */
  useEffect(() => {
    dispatch(getSocioAction(dadosCadastrais.id));
  }, [dadosCadastrais.id]);

  const handleContinuar = () => {
    if (listaSocio?.data[0]?.todos_finalizado) {
      getNextEtapa({ voltar: false });
    } else {
      toast.error("Você precisa finalizar o cadastro de todos os sócios");
    }
  };

  const handleVoltar = () => {
    getNextEtapa({ voltar: true });
  };
  const handleOpenModal = () => {
    setDadosSocio({
      preconta_id: dadosCadastrais.id,
      admin: false,
      nome: "",
      nome_mae: "",
      percentual: "",
      documento: "",
      numero_identidade: "",
      renda_mensal: "",
      data_nascimento: "",
      email: "",
      telefone: "",
      endereco: {
        cep: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
    });
    setErrors({});
    setOpenModal(true);
  };

  const handleAdicionarSocio = async () => {
    if (
      dadosSocio.nome === "" ||
      dadosSocio.nome_mae === "" ||
      dadosSocio.percentual === "" ||
      dadosSocio.documento === "" ||
      dadosSocio.numero_identidade === "" ||
      dadosSocio.renda_mensal === "" ||
      dadosSocio.data_nascimento === "" ||
      dadosSocio.email === "" ||
      dadosSocio.telefone === "" ||
      dadosSocio.endereco.cep === "" ||
      dadosSocio.endereco.rua === "" ||
      dadosSocio.endereco.bairro === "" ||
      dadosSocio.endereco.cidade === "" ||
      dadosSocio.endereco.estado === ""
    ) {
      toast.error("Preencha todos os campos");
    } else {
      setLoading(true);
      const resSocio = await dispatch(postSocioAction(dadosSocio));
      if (resSocio) {
        setErrors(resSocio);
        toast.error("Erro ao cadastrar sócio");
        setLoading(false);
      } else {
        toast.success("Sócio cadastrado com sucesso");
        await dispatch(getSocioAction(dadosCadastrais.id));
        setOpenModal(false);
        setLoading(false);
        setDadosSocio({
          preconta_id: dadosCadastrais.id,
          admin: false,
          nome: "",
          nome_mae: "",
          percentual: "",
          documento: "",
          numero_identidade: "",
          renda_mensal: "",
          data_nascimento: "",
          email: "",
          telefone: "",
          endereco: {
            cep: "",
            rua: "",
            bairro: "",
            cidade: "",
            estado: "",
          },
        });
        setErrors({});
      }
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
    {
      headerText: "Situação",
      key: "finalizado",
      CustomValue: (value) => {
        return (
          <Typography>{value === true ? "Completo" : "Incompleto"}</Typography>
        );
      },
    },
    { headerText: "", key: "menu" },
  ];

  const handlerCep = async () => {
    setLoading(true);
    try {
      const response = await getCep(dadosSocio.endereco.cep);
      setDadosSocio({
        ...dadosSocio,
        endereco: {
          ...dadosSocio.endereco,
          cep: response.data.cep,
          rua: response.data.logradouro,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          estado: response.data.uf,
        },
      });
      setLoading(false);
    } catch (error) {
      toast.error("Error ao puxar dados do cep");
      setLoading(false);
    }
  };

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [errorsEditar, setErrorsEditar] = useState("");
    const [editarLoading, setEditarLoading] = useState(false);
    const [dadosSocioEditar, setDadosSocioEditar] = useState({
      admin: false,
      nome: "",
      nome_mae: "",
      percentual: "",
      documento: "",
      numero_identidade: "",
      renda_mensal: "",
      data_nascimento: "",
      email: "",
      telefone: "",
      endereco: {
        cep: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
    });

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleEditar = (row) => {
      setDadosSocioEditar({
        ...dadosSocioEditar,
        nome: row?.row?.nome,
        documento: row?.row?.documento,
        email: row?.row?.email,
        telefone: row?.row?.telefone,
        admin: row?.row?.admin,
        nome_mae: row?.row?.nome_mae,
        percentual: row?.row?.percentual,
        numero_identidade: row?.row?.numero_identidade,
        renda_mensal: row?.row?.renda_mensal,
        data_nascimento: row?.row?.data_nascimento,
        endereco: {
          cep: row?.row?.endereco?.cep,
          rua: row?.row?.endereco?.rua,
          bairro: row?.row?.endereco?.bairro,
          cidade: row?.row?.endereco?.cidade,
          estado: row?.row?.endereco?.estado,
        },
      });
      setOpenModalEditar(true);
    };

    const handlerEditarCep = async () => {
      setEditarLoading(true);
      try {
        const responseEditar = await getCep(dadosSocioEditar.endereco.cep);
        setDadosSocioEditar({
          ...dadosSocioEditar,
          endereco: {
            ...dadosSocioEditar.endereco,
            rua: responseEditar.data.logradouro,
            complemento: responseEditar.data.complemento,
            bairro: responseEditar.data.bairro,
            cidade: responseEditar.data.localidade,
            estado: responseEditar.data.uf,
          },
        });
        setEditarLoading(false);
      } catch (error) {
        setEditarLoading(false);
        toast.error("Error ao puxar dados do cep");
      }
    };

    const handleEditarSocio = async () => {
      setLoading(true);
      const resSocio = await dispatch(
        putSocioAction(dadosSocioEditar, row.row.id),
      );
      if (resSocio) {
        setErrorsEditar(resSocio);
        toast.error("Erro ao editar sócio");
        setLoading(false);
      } else {
        toast.success("Sócio editado com sucesso");
        setOpenModalEditar(false);
        await dispatch(getSocioAction(dadosCadastrais.id));
        setLoading(false);
      }
    };

    const handleExcluirSocio = async (item) => {
      setLoading(true);
      const resExcluir = await dispatch(deleteSocioAction(row.row.id));
      if (resExcluir) {
        toast.error("Erro ao excluir sócio");
        setLoading(false);
      } else {
        toast.success("Sócio excluído com sucesso");
        await dispatch(getSocioAction(dadosCadastrais.id));
        setLoading(false);
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
            onClick={() => {
              handleEditar(row);
            }}
            style={{
              color: APP_CONFIG.mainCollors.secondary,
              fontFamily: "Montserrat-Regular",
            }}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => handleExcluirSocio(row)}
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
          <LoadingScreen isLoading={editarLoading} />
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
                  Editar sócio
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
                  required
                  variant="standard"
                  label="Nome"
                  fullWidth
                  value={dadosSocioEditar?.nome}
                  error={errorsEditar?.nome}
                  helperText={
                    errorsEditar?.nome ? errorsEditar?.nome.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosSocioEditar({
                      ...dadosSocioEditar,
                      nome: e.target.value,
                    })
                  }
                />
                <TextField
                  style={{ marginTop: "10px" }}
                  className={classes.inputAutofill}
                  required
                  variant="standard"
                  label="Nome da mãe"
                  fullWidth
                  value={dadosSocioEditar?.nome_mae}
                  error={errorsEditar?.nome_mae}
                  helperText={
                    errorsEditar?.nome_mae
                      ? errorsEditar?.nome_mae.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosSocioEditar({
                      ...dadosSocioEditar,
                      nome_mae: e.target.value,
                    })
                  }
                />
                <TextField
                  className={classes.inputAutofill}
                  style={{ marginTop: "10px" }}
                  required
                  variant="standard"
                  label="E-mail"
                  fullWidth
                  value={dadosSocioEditar?.email}
                  error={errorsEditar?.email}
                  helperText={
                    errorsEditar?.email ? errorsEditar?.email.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosSocioEditar({
                      ...dadosSocioEditar,
                      email: e.target.value,
                    })
                  }
                />
                <Box style={{ display: "flex", marginTop: "10px" }}>
                  <ReactInputMask
                    mask="999.999.999-99"
                    value={dadosSocioEditar?.documento}
                    onChange={(e) =>
                      setDadosSocioEditar({
                        ...dadosSocioEditar,
                        documento: e.target.value,
                      })
                    }
                  >
                    {() => (
                      <TextField
                        className={classes.inputAutofill}
                        required
                        variant="standard"
                        label="CPF"
                        error={errorsEditar?.documento}
                        helperText={
                          errorsEditar?.documento
                            ? errorsEditar?.documento.join(" ")
                            : null
                        }
                      />
                    )}
                  </ReactInputMask>
                  <Box style={{ marginLeft: "10px" }}>
                    <ReactInputMask
                      mask="(99) 99999-9999"
                      value={dadosSocioEditar?.telefone}
                      onChange={(e) =>
                        setDadosSocioEditar({
                          ...dadosSocioEditar,
                          telefone: e.target.value,
                        })
                      }
                    >
                      {() => (
                        <TextField
                          className={classes.inputAutofill}
                          required
                          variant="standard"
                          label="Celular"
                          error={errorsEditar?.telefone}
                          helperText={
                            errorsEditar?.telefone
                              ? errorsEditar?.telefone.join(" ")
                              : null
                          }
                        />
                      )}
                    </ReactInputMask>
                  </Box>
                  <Box style={{ marginLeft: "10px" }}>
                    <TextField
                      className={classes.inputAutofill}
                      required
                      type="number"
                      variant="standard"
                      label="Nº Identidade"
                      fullWidth
                      value={dadosSocioEditar?.numero_identidade}
                      error={errorsEditar?.numero_identidade}
                      helperText={
                        errorsEditar?.numero_identidade
                          ? errorsEditar?.numero_identidade.join(" ")
                          : null
                      }
                      onChange={(e) =>
                        setDadosSocioEditar({
                          ...dadosSocioEditar,
                          numero_identidade: e.target.value,
                        })
                      }
                    />
                  </Box>
                </Box>
                <Box style={{ marginTop: "10px" }}>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                        ></InputAdornment>
                      ),
                    }}
                    style={{ marginTop: "10px" }}
                    variant="standard"
                    fullWidth
                    InputLabelProps={{
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data de nascimento"
                    value={dadosSocioEditar?.data_nascimento}
                    error={errorsEditar?.data_nascimento}
                    helperText={
                      errorsEditar?.data_nascimento
                        ? errorsEditar?.data_nascimento.join(" ")
                        : null
                    }
                    onChange={(e) =>
                      setDadosSocioEditar({
                        ...dadosSocioEditar,
                        data_nascimento: e.target.value,
                      })
                    }
                  />
                </Box>
                <Box style={{ display: "flex", marginTop: "10px" }}>
                  <Box style={{ width: "50%" }}>
                    <CurrencyInput
                      className={`${classes.currencyInputContainer} ${classes.input}`}
                      placeholder="Renda mensal"
                      variant="standard"
                      prefix="R$"
                      // decimalSeparator=","
                      // thousandSeparator="."
                      value={dadosSocioEditar?.renda_mensal}
                      onValueChange={(value) => {
                        setDadosSocioEditar({
                          ...dadosSocioEditar,
                          renda_mensal: value,
                        });
                      }}
                    />

                    {errorsEditar?.renda_mensal ? (
                      <FormHelperText
                        style={{
                          fontSize: 14,
                          textAlign: "center",
                          fontFamily: "Montserrat-ExtraBold",
                          color: "red",
                        }}
                      >
                        {errorsEditar?.renda_mensal.join(" ")}
                      </FormHelperText>
                    ) : null}
                  </Box>
                  <Box style={{ marginLeft: "5%", width: "44%" }}>
                    <CurrencyInput
                      className={`${classes.currencyInputContainer} ${classes.input}`}
                      placeholder="Percentual da empresa"
                      variant="standard"
                      suffix="%"
                      disableGroupSeparators
                      value={dadosSocioEditar?.percentual}
                      onValueChange={(value) => {
                        setDadosSocioEditar({
                          ...dadosSocioEditar,
                          percentual: value,
                        });
                      }}
                    />

                    {errorsEditar?.percentual ? (
                      <FormHelperText
                        style={{
                          fontSize: 14,
                          textAlign: "center",
                          fontFamily: "Montserrat-ExtraBold",
                          color: "red",
                        }}
                      >
                        {errorsEditar?.percentual.join(" ")}
                      </FormHelperText>
                    ) : null}
                  </Box>
                </Box>
                <Box style={{ marginTop: "10px" }}>
                  <InputMask
                    style={{ marginTop: "10px" }}
                    mask="99999-999"
                    maskChar=" "
                    value={dadosSocioEditar?.endereco?.cep}
                    onChange={(e) =>
                      setDadosSocioEditar({
                        ...dadosSocioEditar,
                        endereco: {
                          ...dadosSocioEditar?.endereco,
                          cep: e.target.value,
                        },
                      })
                    }
                    onBlur={() => handlerEditarCep()}
                  >
                    {() => (
                      <TextField
                        className={classes.inputAutofill}
                        variant="standard"
                        error={errorsEditar["endereco.cep"]}
                        helperText={
                          errorsEditar["endereco.cep"]
                            ? errorsEditar["endereco.cep"].join(" ")
                            : null
                        }
                        fullWidth
                        required
                        label="CEP"
                      />
                    )}
                  </InputMask>
                </Box>
                <Box style={{ display: "flex", marginTop: "10px" }}>
                  <TextField
                    variant="standard"
                    error={errorsEditar["endereco.rua"]}
                    helperText={
                      errorsEditar["endereco.rua"]
                        ? errorsEditar["endereco.rua"].join(" ")
                        : null
                    }
                    value={dadosSocioEditar?.endereco?.rua}
                    onChange={(e) =>
                      setDadosSocioEditar({
                        ...dadosSocioEditar,
                        endereco: {
                          ...dadosSocioEditar?.endereco,
                          rua: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    required
                    label="Rua"
                  />{" "}
                  <TextField
                    style={{ marginLeft: "10px" }}
                    variant="standard"
                    error={errorsEditar["endereco.bairro"]}
                    helperText={
                      errorsEditar["endereco.bairro"]
                        ? errorsEditar["endereco.bairro"].join(" ")
                        : null
                    }
                    value={dadosSocioEditar?.endereco?.bairro}
                    onChange={(e) =>
                      setDadosSocioEditar({
                        ...dadosSocioEditar,
                        endereco: {
                          ...dadosSocioEditar?.endereco,
                          bairro: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    required
                    label="Bairro"
                  />
                </Box>
                <Box style={{ display: "flex", marginTop: "10px" }}>
                  <TextField
                    variant="standard"
                    error={errorsEditar["endereco.cidade"]}
                    helperText={
                      errorsEditar["endereco.cidade"]
                        ? errorsEditar["endereco.cidade"].join(" ")
                        : null
                    }
                    value={dadosSocioEditar?.endereco?.cidade}
                    onChange={(e) =>
                      setDadosSocioEditar({
                        ...dadosSocioEditar,
                        endereco: {
                          ...dadosSocioEditar?.endereco,
                          cidade: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    required
                    label="Cidade"
                  />
                  <TextField
                    style={{ marginLeft: "10px" }}
                    variant="standard"
                    error={errorsEditar["endereco.estado"]}
                    helperText={
                      errorsEditar["endereco.estado"]
                        ? errorsEditar["endereco.estado"].join(" ")
                        : null
                    }
                    value={dadosSocioEditar?.endereco?.estado}
                    onChange={(e) =>
                      setDadosSocioEditar({
                        ...dadosSocioEditar,
                        endereco: {
                          ...dadosSocioEditar?.endereco,
                          estado: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    required
                    label="Estado"
                  />
                </Box>
              </Box>
              <Box style={{ marginTop: "20px" }}>
                <Box
                  style={{
                    display: "flex",
                    alignContent: "center",
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "10px",
                    }}
                  >
                    Sócio administrativo:
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "10px",
                      borderRadius: 27,
                      backgroundColor: APP_CONFIG.mainCollors.primary,
                    }}
                  >
                    <Switch
                      style={{
                        color: APP_CONFIG.mainCollors.backgrounds,
                      }}
                      checked={dadosSocioEditar.admin}
                      onChange={(e) => {
                        setDadosSocioEditar({
                          ...dadosSocioEditar,
                          admin: e.target.checked,
                        });
                      }}
                    />
                  </Box>
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
                    onClick={handleEditarSocio}
                  >
                    <Typography
                      style={{
                        fontSize: "13px",
                        color: "white",
                      }}
                    >
                      Editar sócio
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
      <LoadingScreen isLoading={loading} />
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
              activeStep={2}
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
                Cadastrar sócio
              </Typography>
              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "14px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "10px",
                }}
              >
                Você precisa cadastrar todos os sócios registrados no contrato
                sócial da empresa ou apenas o sócio com procuração ou ata
                registrada, dando plenos poderes para operar transações
                bancárias.
              </Typography>
              <Grid container spacing={2} style={{ marginTop: "50px" }}>
                <Grid item sm={12} xs={12}>
                  {listaSocio.data && listaSocio.total > 0 ? (
                    // <Box minWidth={!matches ? '800px' : null}>
                    <CustomTable
                      columns={columns ? columns : null}
                      data={listaSocio.data}
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
                    onClick={() => {
                      handleOpenModal();
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "15px",
                        color: "white",
                      }}
                    >
                      Cadastrar sócio
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
        <LoadingScreen isLoading={loading} />
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
                Adicionar sócio
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
                value={dadosSocio.nome}
                error={errors.nome}
                helperText={errors.nome ? errors.nome.join(" ") : null}
                onChange={(e) =>
                  setDadosSocio({
                    ...dadosSocio,
                    nome: e.target.value,
                  })
                }
              />
              <TextField
                style={{ marginTop: "10px" }}
                className={classes.inputAutofill}
                required
                variant="standard"
                label="Nome da mãe"
                fullWidth
                value={dadosSocio.nome_mae}
                error={errors.nome_mae}
                helperText={errors.nome_mae ? errors.nome_mae.join(" ") : null}
                onChange={(e) =>
                  setDadosSocio({
                    ...dadosSocio,
                    nome_mae: e.target.value,
                  })
                }
              />
              <TextField
                className={classes.inputAutofill}
                style={{ marginTop: "10px" }}
                required
                variant="standard"
                label="E-mail"
                fullWidth
                value={dadosSocio.email}
                error={errors.email}
                helperText={errors.email ? errors.email.join(" ") : null}
                onChange={(e) =>
                  setDadosSocio({
                    ...dadosSocio,
                    email: e.target.value,
                  })
                }
              />
              <Box style={{ display: "flex", marginTop: "10px" }}>
                <ReactInputMask
                  mask="999.999.999-99"
                  value={dadosSocio.documento}
                  onChange={(e) =>
                    setDadosSocio({
                      ...dadosSocio,
                      documento: e.target.value,
                    })
                  }
                >
                  {() => (
                    <TextField
                      className={classes.inputAutofill}
                      required
                      variant="standard"
                      label="CPF"
                      error={errors.documento}
                      helperText={
                        errors.documento ? errors.documento.join(" ") : null
                      }
                    />
                  )}
                </ReactInputMask>
                <Box style={{ marginLeft: "10px" }}>
                  <ReactInputMask
                    mask="(99) 99999-9999"
                    value={dadosSocio.telefone}
                    onChange={(e) =>
                      setDadosSocio({
                        ...dadosSocio,
                        telefone: e.target.value,
                      })
                    }
                  >
                    {() => (
                      <TextField
                        className={classes.inputAutofill}
                        required
                        variant="standard"
                        label="Celular"
                        error={errors.telefone}
                        helperText={
                          errors.telefone ? errors.telefone.join(" ") : null
                        }
                      />
                    )}
                  </ReactInputMask>
                </Box>
                <Box style={{ marginLeft: "10px" }}>
                  <TextField
                    className={classes.inputAutofill}
                    required
                    type="number"
                    variant="standard"
                    label="Nº Identidade"
                    fullWidth
                    value={dadosSocio.numero_identidade}
                    error={errors.numero_identidade}
                    helperText={
                      errors.numero_identidade
                        ? errors.numero_identidade.join(" ")
                        : null
                    }
                    onChange={(e) =>
                      setDadosSocio({
                        ...dadosSocio,
                        numero_identidade: e.target.value,
                      })
                    }
                  />
                </Box>
              </Box>
              <Box style={{ marginTop: "10px" }}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className={classes.inputAdornment}
                      ></InputAdornment>
                    ),
                  }}
                  style={{ marginTop: "10px" }}
                  variant="standard"
                  fullWidth
                  InputLabelProps={{
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  label="Data de nascimento"
                  value={dadosSocio.data_nascimento}
                  error={errors.data_nascimento}
                  helperText={
                    errors.data_nascimento
                      ? errors.data_nascimento.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosSocio({
                      ...dadosSocio,
                      data_nascimento: e.target.value,
                    })
                  }
                />
              </Box>
              <Box style={{ display: "flex", marginTop: "10px" }}>
                <Box style={{ width: "50%" }}>
                  <CurrencyInput
                    className={`${classes.currencyInputContainer} ${classes.input}`}
                    placeholder="Renda mensal"
                    variant="standard"
                    prefix="R$"
                    // decimalSeparator=","
                    // thousandSeparator="."
                    value={dadosSocio.renda_mensal}
                    onValueChange={(value) => {
                      setDadosSocio({
                        ...dadosSocio,
                        renda_mensal: value,
                      });
                    }}
                  />

                  {errors.renda_mensal ? (
                    <FormHelperText
                      style={{
                        fontSize: 14,
                        textAlign: "center",
                        fontFamily: "Montserrat-ExtraBold",
                        color: "red",
                      }}
                    >
                      {errors.renda_mensal.join(" ")}
                    </FormHelperText>
                  ) : null}
                </Box>
                <Box style={{ marginLeft: "5%", width: "44%" }}>
                  <CurrencyInput
                    className={`${classes.currencyInputContainer} ${classes.input}`}
                    placeholder="Percentual da empresa"
                    variant="standard"
                    suffix="%"
                    disableGroupSeparators
                    value={dadosSocio.percentual}
                    onValueChange={(value) => {
                      setDadosSocio({
                        ...dadosSocio,
                        percentual: value,
                      });
                    }}
                  />

                  {errors.percentual ? (
                    <FormHelperText
                      style={{
                        fontSize: 14,
                        textAlign: "center",
                        fontFamily: "Montserrat-ExtraBold",
                        color: "red",
                      }}
                    >
                      {errors.percentual.join(" ")}
                    </FormHelperText>
                  ) : null}
                </Box>
              </Box>
              <Box style={{ marginTop: "10px" }}>
                <InputMask
                  style={{ marginTop: "10px" }}
                  mask="99999-999"
                  maskChar=" "
                  value={dadosSocio.endereco?.cep}
                  onChange={(e) =>
                    setDadosSocio({
                      ...dadosSocio,
                      endereco: {
                        ...dadosSocio.endereco,
                        cep: e.target.value,
                      },
                    })
                  }
                  onBlur={handlerCep}
                >
                  {() => (
                    <TextField
                      className={classes.inputAutofill}
                      variant="standard"
                      error={errors["endereco.cep"]}
                      helperText={
                        errors["endereco.cep"]
                          ? errors["endereco.cep"].join(" ")
                          : null
                      }
                      fullWidth
                      required
                      label="CEP"
                    />
                  )}
                </InputMask>
              </Box>
              <Box style={{ display: "flex", marginTop: "10px" }}>
                <TextField
                  variant="standard"
                  error={errors["endereco.rua"]}
                  helperText={
                    errors["endereco.rua"]
                      ? errors["endereco.rua"].join(" ")
                      : null
                  }
                  value={dadosSocio.endereco?.rua}
                  onChange={(e) =>
                    setDadosSocio({
                      ...dadosSocio,
                      endereco: {
                        ...dadosSocio.endereco,
                        rua: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  required
                  label="Rua"
                />{" "}
                <TextField
                  style={{ marginLeft: "10px" }}
                  variant="standard"
                  error={errors["endereco.bairro"]}
                  helperText={
                    errors["endereco.bairro"]
                      ? errors["endereco.bairro"].join(" ")
                      : null
                  }
                  value={dadosSocio.endereco?.bairro}
                  onChange={(e) =>
                    setDadosSocio({
                      ...dadosSocio,
                      endereco: {
                        ...dadosSocio.endereco,
                        bairro: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  required
                  label="Bairro"
                />
              </Box>
              <Box style={{ display: "flex", marginTop: "10px" }}>
                <TextField
                  variant="standard"
                  error={errors["endereco.cidade"]}
                  helperText={
                    errors["endereco.cidade"]
                      ? errors["endereco.cidade"].join(" ")
                      : null
                  }
                  value={dadosSocio.endereco?.cidade}
                  onChange={(e) =>
                    setDadosSocio({
                      ...dadosSocio,
                      endereco: {
                        ...dadosSocio.endereco,
                        cidade: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  required
                  label="Cidade"
                />
                <TextField
                  style={{ marginLeft: "10px" }}
                  variant="standard"
                  error={errors["endereco.estado"]}
                  helperText={
                    errors["endereco.estado"]
                      ? errors["endereco.estado"].join(" ")
                      : null
                  }
                  value={dadosSocio.endereco?.estado}
                  onChange={(e) =>
                    setDadosSocio({
                      ...dadosSocio,
                      endereco: {
                        ...dadosSocio.endereco,
                        estado: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  required
                  label="Estado"
                />
              </Box>
            </Box>
            <Box style={{ marginTop: "20px" }}>
              <Box
                style={{
                  display: "flex",
                  alignContent: "center",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "10px",
                  }}
                >
                  Sócio administrativo:
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "10px",
                    borderRadius: 27,
                    backgroundColor: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  <Switch
                    style={{
                      color: APP_CONFIG.mainCollors.backgrounds,
                    }}
                    checked={dadosCadastrais.admin}
                    onChange={(e) => {
                      setDadosSocio({
                        ...dadosSocio,
                        admin: e.target.checked,
                      });
                    }}
                  />
                </Box>
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
                  onClick={handleAdicionarSocio}
                >
                  <Typography
                    style={{
                      fontSize: "13px",
                      color: "white",
                    }}
                  >
                    Adicionar sócio
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
