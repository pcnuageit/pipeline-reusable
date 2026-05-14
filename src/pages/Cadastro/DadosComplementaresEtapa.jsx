import {
  Box,
  FormHelperText,
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

import CurrencyInput from "react-currency-input";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import CustomFowardButton from "../../components/CustomFowardButton/CustomFowardButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import { APP_CONFIG } from "../../constants/config";

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
    minHeight: "500px",
    display: "flex",

    [theme.breakpoints.down("1024")]: {
      minHeight: "0px",
      height: "100%",
    },
  },
  currencyInput: {
    marginBottom: "6px",

    alignSelf: "center",
    textAlign: "center",
    height: 45,
    fontSize: 17,
    borderWidth: "1px !important",
    borderRadius: 27,
    border: "solid",
    color: APP_CONFIG.mainCollors.primary,
    backgroundColor: "transparent",
    fontFamily: "Montserrat-Regular",

    "&::placeholder": {
      color: APP_CONFIG.mainCollors.primary,
    },
  },
}));

export default function DadosComplementaresEtapa({
  getNextEtapa,
  errorsEtapa5,
}) {
  const classes = useStyles();
  const dadosCadastrais = useSelector((state) => state.cadastroEtapa2);
  const [dadosComplementares, setDadosComplementares] = useState({
    documento: dadosCadastrais.documento,
    data_nascimento: "",
    renda_mensal: null,
  });

  const handleContinuar = async () => {
    if (
      dadosComplementares.data_nascimento === "" ||
      dadosComplementares.renda_mensal === ""
    ) {
      toast.error("Preencha todos os campos");
    } else {
      getNextEtapa({ dadosComplementares });
    }
  };

  const handleVoltar = () => {
    getNextEtapa({ voltar: true });
  };

  const options = {
    /* thousandSeparator: '.',
		decimalSeparator: ',', */
    allowNegative: false,

    customInput: TextField,
    /* style: { width: '100%' }, */
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
              activeStep={4}
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
                Dados complementares
              </Typography>
              <Grid container spacing={2} style={{ marginTop: "15px" }}>
                <Grid item sm={6} xs={12} style={{ marginTop: "22px" }}>
                  {/* <TextField
										required
										variant="outlined"
										label="Data de criação da empresa"
										fullWidth
										value={dadosEndereco.cep}
										onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												cep: e.target.value,
											})
										}
									/> */}
                  <TextField
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data de criação"
                    value={dadosComplementares.data_nascimento}
                    error={errorsEtapa5.data_nascimento}
                    helperText={
                      errorsEtapa5.data_nascimento
                        ? errorsEtapa5.data_nascimento.join(" ")
                        : null
                    }
                    onChange={(e) =>
                      setDadosComplementares({
                        ...dadosComplementares,
                        data_nascimento: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormHelperText
                    style={{
                      fontSize: 12,

                      fontFamily: "Montserrat-ExtraBold",
                      color: APP_CONFIG.mainCollors.primary,
                      marginLeft: "10px",
                    }}
                  >
                    Faturamento Bruto Mensal
                  </FormHelperText>
                  <CurrencyInput
                    label="Faturamento Bruto Mensal"
                    placeHolder="R$0,00"
                    className={classes.currencyInput}
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    value={dadosComplementares.renda_mensal}
                    onChangeEvent={(event, maskedvalue, floatvalue) => {
                      setDadosComplementares({
                        ...dadosComplementares,
                        renda_mensal: floatvalue,
                      });
                    }}
                    error={errorsEtapa5.renda_mensal}
                    helperText={
                      errorsEtapa5.renda_mensal
                        ? errorsEtapa5.renda_mensal.join(" ")
                        : null
                    }
                  />
                  {/* <NumberFormat
										isNumericString={true}
										InputLabelProps={{ shrink: true }}
										{...options}
										variant="outlined"
										decimalPlacesShownOnFocus={0}
										maxLength={7}
										label="Valor Mensal"
										placeholder="R$"
										value={dadosComplementares.renda_mensal}
										error={errorsEtapa5.renda_mensal}
										helperText={
											errorsEtapa5.renda_mensal
												? errorsEtapa5.renda_mensal.join(' ')
												: null
										}
										onChange={(e) =>
											setDadosComplementares({
												...dadosComplementares,
												renda_mensal: Number(e.target.value),
											})
										}
									/> */}
                  {/* <CurrencyTextField
										variant="outlined"
										decimalPlacesShownOnFocus={0}
										currencySymbol="R$"
										maximumValue={1000000000}
										minimumValue={0}
										label="Renda mensal"
										decimalCharacter=","
										digitGroupSeparator="."
										value={dadosComplementares.renda_mensal}
										onChange={(e) =>
											setDadosComplementares({
												...dadosComplementares,
												renda_mensal: e.target.value,
											})
										}
									/> */}
                  {/* <TextField
										required
										variant="outlined"
										label="Renda mensal"
										fullWidth
										value={dadosEndereco.rua}
										onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												rua: e.target.value,
											})
										}
									/> */}
                </Grid>
              </Grid>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "200px",
                }}
              >
                <CustomBackButton color="purple" onClick={handleVoltar} />
                <CustomFowardButton color="purple" onClick={handleContinuar} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
