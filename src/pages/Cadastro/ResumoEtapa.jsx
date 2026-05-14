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
import { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import "moment/locale/pt-br";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

import {
  loadPreContaJuridicaId,
  postContaPJAction,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";

import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomSideBar from "../../components/CustomSideBar/CustomSideBar";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

moment.locale();

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

    /* width: '70%', */
    /* marginTop: '100px', */
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
  },
}));
export default function ResumoEtapa({ getNextEtapa }) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const dadosCadastrais = useSelector((state) => state.cadastroEtapa2);
  const setPreContaJuridicaId = useSelector(
    (state) => state.setPreContaJuridicaId,
  );
  const preContaJuridicaId = useSelector((state) => state.preContaJuridicaId);

  const [errors, setErrors] = useState("");
  const [cadastroContaPJ, setCadastroContaPJ] = useState({
    documento: dadosCadastrais.documento_socio,
    cnpj: dadosCadastrais.documento,
    razao_social: dadosCadastrais.nome,
    cnae: dadosCadastrais.cnae,
    nome: dadosCadastrais.nome_socio,
    renda_mensal: preContaJuridicaId.renda_mensal,
    celular: dadosCadastrais.celular,
    data_nascimento: preContaJuridicaId.data_nascimento,
    email: dadosCadastrais.email,
    endereco: {
      cep: preContaJuridicaId.cep,
      rua: preContaJuridicaId.rua,
      bairro: preContaJuridicaId.bairro,
      numero: preContaJuridicaId.numero,
      complemento: preContaJuridicaId.complemento,
      cidade: preContaJuridicaId.cidade,
      estado: preContaJuridicaId.estado,
    },
  });

  useEffect(() => {
    dispatch(loadPreContaJuridicaId(setPreContaJuridicaId));
  }, [dadosCadastrais]);

  /* 	const handleCep = async () => {
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
			toast.error('Dados inválidos');
			setLoading(false);
		}
	}; */

  const handleRegistrar = async () => {
    const cadastroContaPJ = {
      documento: dadosCadastrais.documento_socio,
      cnpj: dadosCadastrais.documento,
      razao_social: dadosCadastrais.nome,
      cnae: dadosCadastrais.cnae,
      nome: dadosCadastrais.nome_socio,
      renda_mensal: preContaJuridicaId.renda_mensal,
      celular: dadosCadastrais.celular,
      data_nascimento: preContaJuridicaId.data_nascimento,
      email: dadosCadastrais.email,
      endereco: {
        cep: preContaJuridicaId.cep,
        rua: preContaJuridicaId.rua,
        bairro: preContaJuridicaId.bairro,
        numero: preContaJuridicaId.numero,
        complemento: preContaJuridicaId.complemento,
        cidade: preContaJuridicaId.cidade,
        estado: preContaJuridicaId.estado,
      },
    };

    console.log(cadastroContaPJ);
    const resContaPJ = await dispatch(postContaPJAction(cadastroContaPJ));
    if (resContaPJ) {
      setErrors(resContaPJ);
      toast.error("Falha ao registrar conta jurídica");
    } else {
      toast.success("Conta jurídica registrada com sucesso!");
      // getNextEtapa({ voltar: false });
      history.push("../");
    }
  };
  const handleVoltar = async () => {
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
              activeStep={6}
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
                  fontSize: "18px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "30px",
                }}
              >
                Resumo
              </Typography>
              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "14px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "10px",
                }}
              >
                Verifique se seus dados estão corretos.
              </Typography>
              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "16px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "30px",
                }}
              >
                Endereço
              </Typography>
              <Grid container spacing={4} style={{ marginTop: "20px" }}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="CEP"
                    fullWidth
                    value={preContaJuridicaId.cep}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												cep: e.target.value,
											})
										}  */
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="Rua"
                    fullWidth
                    value={preContaJuridicaId.rua}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												rua: e.target.value,
											})
										} */
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container spacing={2}> */}
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="Bairro"
                    fullWidth
                    value={preContaJuridicaId.bairro}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												bairro: e.target.value,
											})
										} */
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="Número"
                    fullWidth
                    value={preContaJuridicaId.numero}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												numero: Number(e.target.value),
											})
										} */
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container spacing={2}> */}
                <Grid item sm={4} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="Estado"
                    fullWidth
                    value={preContaJuridicaId.estado}
                    /* 	onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												estado: e.target.value,
											})
										} */
                  />
                </Grid>
                <Grid item sm={8} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="Cidade"
                    fullWidth
                    value={preContaJuridicaId.cidade}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												cidade: e.target.value,
											})
										} */
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container spacing={2} style={{ marginTop: '20px' }}> */}
                <Grid item sm={12} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    variant="outlined"
                    label="Complemento"
                    fullWidth
                    value={preContaJuridicaId.complemento}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												complemento: e.target.value,
											})
										} */
                  />
                </Grid>
              </Grid>
              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "16px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "30px",
                }}
              >
                Dados da empresa
              </Typography>
              <Grid container spacing={4} style={{ marginTop: "20px" }}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="CPNJ"
                    fullWidth
                    value={dadosCadastrais.documento}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												cep: e.target.value,
											})
										} */
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="CNAE"
                    fullWidth
                    value={dadosCadastrais.cnae}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												rua: e.target.value,
											})
										} */
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="Nome"
                    fullWidth
                    value={dadosCadastrais.nome}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												rua: e.target.value,
											})
										} */
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container spacing={2}> */}
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="E-mail"
                    fullWidth
                    value={dadosCadastrais.email}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												bairro: e.target.value,
											})
										} */
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="Celular"
                    fullWidth
                    value={dadosCadastrais.celular}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												numero: Number(e.target.value),
											})
										} */
                  />
                </Grid>
              </Grid>

              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "16px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "30px",
                }}
              >
                Dados do sócio administrador
              </Typography>
              <Grid container spacing={4} style={{ marginTop: "20px" }}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="CPF"
                    fullWidth
                    value={dadosCadastrais.documento_socio}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												cep: e.target.value,
											})
										} */
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="Nome"
                    fullWidth
                    value={dadosCadastrais.nome_socio}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												rua: e.target.value,
											})
										} */
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container spacing={2}> */}
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="E-mail"
                    fullWidth
                    value={dadosCadastrais.email_socio}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												bairro: e.target.value,
											})
										} */
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                    variant="outlined"
                    label="celular"
                    fullWidth
                    value={dadosCadastrais.celular_socio}
                    /* onChange={(e) =>
											setDadosEndereco({
												...dadosEndereco,
												numero: Number(e.target.value),
											})
										} */
                  />
                </Grid>
              </Grid>

              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "16px",
                  color: APP_CONFIG.mainCollors.primary,
                  marginTop: "30px",
                }}
              >
                Dados complementares
              </Typography>
              <Grid container spacing={4} style={{ marginTop: "20px" }}>
                <Grid item sm={4} xs={12} style={{ marginTop: "-23px" }}>
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
                    value={preContaJuridicaId.renda_mensal}
                  />
                  {/* <NumberFormat
										disabled
										isNumericString={true}
										InputLabelProps={{ shrink: true }}
										{...options}
										variant="outlined"
										decimalPlacesShownOnFocus={0}
										maxLength={7}
										label="Renda mensal"
										placeholder="R$"
										decimalSeparator=","
										thousandSeparator="."
										value={preContaJuridicaId.renda_mensal}
										
										
									/> */}
                </Grid>
                <Grid item sm={3} xs={0} />
                <Grid item sm={4} xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    label="Data de criação"
                    value={preContaJuridicaId.data_nascimento}
                  />
                </Grid>
              </Grid>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "80px",
                }}
              >
                <CustomBackButton color="purple" onClick={handleVoltar} />
                <CustomButton color="purple" onClick={handleRegistrar}>
                  <Typography
                    style={{
                      fontSize: "13px",
                      color: "white",
                    }}
                  >
                    Registrar conta
                  </Typography>
                </CustomButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
