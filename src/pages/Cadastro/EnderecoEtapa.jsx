import {
  Box,
  Checkbox,
  Grid,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";

import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import CustomSideBar from "../../components/CustomSideBar/CustomSideBar";

import ReactInputMask from "react-input-mask";
import CustomFowardButton from "../../components/CustomFowardButton/CustomFowardButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import { getCep } from "../../services/services";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",

    flexGrow: 1,
    // width: '100vw',
    // height: '100vh',
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
    },
  },
  stepper: {
    backgroundColor: "inherit",
    /* minHeight: '600px', */
    height: "800px",
    /* width: '70%', */
    /* marginTop: '100px', */
    display: "flex",

    /* [theme.breakpoints.down('1024')]: {
			minHeight: '0px',
			height: '100%',
		}, */
  },
  inputAutofill: {
    "& :-webkit-autofill": {
      "-webkit-text-fill-color": `${APP_CONFIG.mainCollors.primary} !important`,
    },
  },
}));

export default function EnderecoEtapa({ getNextEtapa, errorsEtapa4 }) {
  const classes = useStyles();
  const [fillCheckboxSemNumero, setFillCheckboxSemNumero] = useState(false);
  const dadosCadastrais = useSelector((state) => state.cadastroEtapa2);
  const [loading, setLoading] = useState(false);
  const [isNumero, setIsNumero] = useState(false);
  const [dadosEndereco, setDadosEndereco] = useState({
    documento: dadosCadastrais.documento,
    cep: "",
    rua: "",
    bairro: "",
    numero: null,
    complemento: "",
    cidade: "",
    estado: "",
  });

  const handleCep = async () => {
    setLoading(true);
    try {
      const response = await getCep(dadosEndereco.cep);
      setDadosEndereco({
        ...dadosEndereco,
        cep: response.data.cep,
        rua: response.data.logradouro,
        complemento: response.data.complemento,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        estado: response.data.uf,
      });
      setLoading(false);
    } catch (error) {
      toast.error("Dados inválidos");
      setLoading(false);
    }
  };

  const handleContinuar = async () => {
    if (
      dadosEndereco.cep === "" ||
      dadosEndereco.rua === "" ||
      dadosEndereco.bairro === "" ||
      dadosEndereco.numero === null ||
      dadosEndereco.cidade === "" ||
      dadosEndereco.estado === ""
    ) {
      toast.error("Preencha todos os campos");
    } else {
      getNextEtapa({ dadosEndereco });
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
      description: "",
    },
    {
      label: "Dados complementares",
      description: "",
    },
    // {
    //   label: "Envio de documentos",
    //   description: "",
    // },
    {
      label: "Resumo",
      description: "",
    },
  ];

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
              activeStep={1}
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
                Endereço comercial
              </Typography>
              <Grid container spacing={4} style={{ marginTop: "15px" }}>
                <Grid item sm={6} xs={12}>
                  <ReactInputMask
                    mask="99999-999"
                    value={dadosEndereco.cep}
                    onBlur={handleCep}
                    onChange={(e) =>
                      setDadosEndereco({
                        ...dadosEndereco,
                        cep: e.target.value,
                      })
                    }
                  >
                    {() => (
                      <TextField
                        className={classes.inputAutofill}
                        required
                        variant="outlined"
                        label="CEP"
                        fullWidth
                        error={errorsEtapa4.cep}
                        helperText={
                          errorsEtapa4.cep ? errorsEtapa4.cep.join(" ") : null
                        }
                      />
                    )}
                  </ReactInputMask>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    className={classes.inputAutofill}
                    required
                    variant="outlined"
                    label="Rua"
                    fullWidth
                    value={dadosEndereco.rua}
                    error={errorsEtapa4.rua}
                    helperText={
                      errorsEtapa4.rua ? errorsEtapa4.rua.join(" ") : null
                    }
                    onChange={(e) =>
                      setDadosEndereco({
                        ...dadosEndereco,
                        rua: e.target.value,
                      })
                    }
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container spacing={2}> */}
                <Grid item sm={6} xs={12}>
                  <TextField
                    className={classes.inputAutofill}
                    required
                    variant="outlined"
                    label="Bairro"
                    fullWidth
                    value={dadosEndereco.bairro}
                    error={errorsEtapa4.bairro}
                    helperText={
                      errorsEtapa4.bairro ? errorsEtapa4.bairro.join(" ") : null
                    }
                    onChange={(e) =>
                      setDadosEndereco({
                        ...dadosEndereco,
                        bairro: e.target.value,
                      })
                    }
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container spacing={2}> */}
                <Grid item sm={2} xs={12}>
                  <TextField
                    className={classes.inputAutofill}
                    disabled={isNumero}
                    required
                    variant="outlined"
                    label={isNumero ? "" : "Número"}
                    fullWidth
                    value={dadosEndereco.numero}
                    error={errorsEtapa4.numero}
                    helperText={
                      errorsEtapa4.numero ? errorsEtapa4.numero.join(" ") : null
                    }
                    onChange={(e) =>
                      setDadosEndereco({
                        ...dadosEndereco,
                        numero: Number(e.target.value),
                      })
                    }
                  />
                </Grid>
                <Grid item sm={2} xs={12}>
                  <Box style={{ display: "flex" }}>
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: APP_CONFIG.mainCollors.primary,
                        marginTop: "10px",
                      }}
                    >
                      Sem nº
                    </Typography>
                    <Checkbox
                      color="primary"
                      checked={fillCheckboxSemNumero}
                      onChange={() => {
                        setFillCheckboxSemNumero(!fillCheckboxSemNumero);
                        setIsNumero(!isNumero);

                        setDadosEndereco(
                          fillCheckboxSemNumero
                            ? {
                                ...dadosEndereco,
                                numero: "",
                              }
                            : {
                                ...dadosEndereco,
                                numero: 0,
                              },
                        );
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={4} style={{ marginTop: "20px" }}>
                <Grid item sm={4} xs={12}>
                  <TextField
                    className={classes.inputAutofill}
                    required
                    variant="outlined"
                    label="Estado"
                    fullWidth
                    value={dadosEndereco.estado}
                    error={errorsEtapa4.estado}
                    helperText={
                      errorsEtapa4.estado ? errorsEtapa4.estado.join(" ") : null
                    }
                    onChange={(e) =>
                      setDadosEndereco({
                        ...dadosEndereco,
                        estado: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item sm={8} xs={12}>
                  <TextField
                    className={classes.inputAutofill}
                    required
                    variant="outlined"
                    label="Cidade"
                    fullWidth
                    value={dadosEndereco.cidade}
                    error={errorsEtapa4.cidade}
                    helperText={
                      errorsEtapa4.cidade ? errorsEtapa4.cidade.join(" ") : null
                    }
                    onChange={(e) =>
                      setDadosEndereco({
                        ...dadosEndereco,
                        cidade: e.target.value,
                      })
                    }
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container spacing={2} style={{ marginTop: '20px' }}> */}
                <Grid item sm={12} xs={12}>
                  <TextField
                    className={classes.inputAutofill}
                    variant="outlined"
                    label="Complemento"
                    fullWidth
                    value={dadosEndereco.complemento}
                    error={errorsEtapa4.complemento}
                    helperText={
                      errorsEtapa4.complemento
                        ? errorsEtapa4.complemento.join(" ")
                        : null
                    }
                    onChange={(e) =>
                      setDadosEndereco({
                        ...dadosEndereco,
                        complemento: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "80px",
                }}
              >
                <CustomFowardButton color="purple" onClick={handleContinuar} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
