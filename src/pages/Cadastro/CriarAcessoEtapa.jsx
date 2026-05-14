import {
  Box,
  Checkbox,
  Dialog,
  Grid,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import CustomButton from "../../components/CustomButton/CustomButton";

import { makeStyles } from "@material-ui/styles";
import ReactInputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  postAceitarTermoAberturaAction,
  postBuscarContaCNPJAction,
  postBuscarContaCPFAction,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";

import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",

    [theme.breakpoints.down("1024")]: {
      flexDirection: "column",
    },
  },
  leftBox: {
    display: "flex",
    background: APP_CONFIG.mainCollors.primaryGradient,
    width: "50%",
    minHeight: "100vh",
    height: "auto",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",

    [theme.breakpoints.down("1024")]: {
      width: "100%",
      minHeight: "0px",
      height: "100%",
    },
  },
  rightBox: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    width: "50%",

    [theme.breakpoints.down("1024")]: {
      width: "100%",
    },
  },
  smallLogoContainer: {
    display: "flex",
    alignSelf: "flex-end",
    width: "100px",
    height: "100px",
    alignItems: "center",
    justifyContent: "center",
  },
  bigLogoImg: {
    marginBottom: "-4px",
  },
  inputAutofill: {
    "& :-webkit-autofill": {
      "-webkit-text-fill-color": `${APP_CONFIG.mainCollors.primary} !important`,
    },
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "5%",
    paddingRight: "5%",
    alignContent: "center",
    justifyContent: "center",
  },
  fieldsContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
    alignContent: "center",
    justifyContent: "center",
  },
}));

export default function CriarAcessoEtapa({ getNextEtapa, errorsEtapa1 }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [modalTermos, setModalTermos] = useState(false);
  const [pagePdf, setPagePdf] = useState(null);
  const [showAceitarContrato, setShowAceitarContrato] = useState(false);
  const [validarConfirmacaoEmail, setValidarConfirmacaoEmail] = useState("");
  const [dadosEtapa1, setDadosEtapa1] = useState({
    nome: "",
    documento: "",
    nome_socio: "",
    documento_socio: "",
    email_socio: "",
    celular_socio: "",
    tipo_empresa: "",
    consultor: false,
    cnae: "",
    is_estabelecimento: true,
  });
  const responseVerificarCNPJ = useSelector((state) => state.verificarCNPJ);

  const handleAceitarContrato = async () => {
    const resAceitarContrato = await dispatch(
      postAceitarTermoAberturaAction(
        dadosEtapa1.nome,
        dadosEtapa1.documento_socio,
      ),
    );
    if (resAceitarContrato) {
      toast.error("Falha ao aceitar termos e condições");
    } else {
      setModalTermos(false);
      getNextEtapa({ dadosEtapa1 });
    }
  };

  const handleContinuar = async () => {
    setLoading(true);
    let resBuscarCPF;
    if (APP_CONFIG.isEstabelecimento) {
      resBuscarCPF = true;
    } else {
      resBuscarCPF = await dispatch(
        postBuscarContaCPFAction(dadosEtapa1.documento_socio),
      );
    }

    if (resBuscarCPF) {
      const resBuscarCNPJ = await dispatch(
        postBuscarContaCNPJAction(dadosEtapa1.documento),
      );
      if (resBuscarCNPJ) {
        if (
          dadosEtapa1.nome === "" ||
          dadosEtapa1.documento === "" ||
          dadosEtapa1.nome_socio === "" ||
          dadosEtapa1.cnae === "" ||
          dadosEtapa1.documento_socio === "" ||
          dadosEtapa1.email_socio === "" ||
          dadosEtapa1.celular_socio === "" ||
          dadosEtapa1.tipo_empresa === ""
        ) {
          toast.error("Preencha todos os campos");
        } else {
          if (dadosEtapa1.email_socio === validarConfirmacaoEmail) {
            setModalTermos(true);
          } else {
            toast.error("Campo confirmar e-mail não confere");
          }
        }
      } else {
        if (responseVerificarCNPJ.status === "pending") {
          history.push("/cadastro/conta-cadastrada");
        } else {
          toast.error("CNPJ já possui cadastro de conta");
        }
      }
    } else {
      history.push("/cadastro/criar-conta-pj");
    }
    setLoading(false);
  };

  const onLoadPdf = (e) => {
    setPagePdf(e._pdfInfo.numPages);
    setShowAceitarContrato(true);
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.leftBox}>
        <Dialog
          open={modalTermos}
          style={{ width: "100%" }}
          onClose={() => setModalTermos(false)}
        >
          <Box style={{ alignSelf: "flex-end" }}>
            <Document
              file={APP_CONFIG.linkPdfTermoContrato}
              onLoadError={(e) => console.log(e)}
              onLoadSuccess={(e) => onLoadPdf(e)}
            >
              {new Array(pagePdf).fill(0).map((_, index) => (
                <Page pageNumber={index + 1} key={index} />
              ))}
            </Document>
          </Box>
          <Box
            style={{
              alignSelf: "center",
              marginBottom: "30px",
            }}
          >
            {showAceitarContrato && (
              <CustomButton color="purple" onClick={handleAceitarContrato}>
                Aceitar termos e condições
              </CustomButton>
            )}
          </Box>
        </Dialog>
        <Stepper
          alternativeLabel
          style={{
            backgroundColor: "inherit",
            width: "70%",
            marginTop: "100px",
          }}
        >
          <Step style={{ color: "white" }}>
            <StepLabel>
              <Typography style={{ color: "white" }}>Seus dados</Typography>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              <Typography style={{ color: "white" }}>
                Dados da empresa
              </Typography>
            </StepLabel>
          </Step>
        </Stepper>
        <Box
          style={{
            width: "50%",
            alignSelf: "flex-end",
          }}
        >
          <img
            className={classes.bigLogoImg}
            src={APP_CONFIG.assets.backgroundLogo}
            alt={""}
          />
        </Box>
      </Box>

      <Box className={classes.rightBox}>
        <Box className={classes.smallLogoContainer}>
          <img src={APP_CONFIG.assets.smallColoredLogo} alt={"Logo"} />
        </Box>

        <Box className={classes.titleContainer}>
          <Typography
            align="left"
            style={{
              fontSize: "29px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Para criarmos seu acesso, é necessário que preencha o formulário
            abaixo
          </Typography>

          <Box className={classes.fieldsContainer}>
            <Typography
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontSize: "16px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Dados do sócio administrador
            </Typography>
            <Grid container spacing={4} style={{ marginTop: "25px" }}>
              <Grid item sm={6} xs={12}>
                <ReactInputMask
                  mask="999.999.999-99"
                  value={dadosEtapa1.documento_socio}
                  onChange={(e) =>
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      documento_socio: e.target.value,
                    })
                  }
                >
                  {() => (
                    <TextField
                      className={classes.inputAutofill}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      required
                      label="CPF"
                      error={errorsEtapa1.documento_socio}
                      helperText={
                        errorsEtapa1.documento_socio
                          ? errorsEtapa1.documento_socio.join(" ")
                          : null
                      }
                    />
                  )}
                </ReactInputMask>
                {/* <TextField
									className={classes.inputAutofill}
									required
									variant="outlined"
									label="CPF"
									fullWidth
									value={dadosEtapa1.documento_socio}
									error={errorsEtapa1.documento_socio}
									helperText={
										errorsEtapa1.documento_socio
											? errorsEtapa1.documento_socio.join(' ')
											: null
									}
									onChange={(e) =>
										setDadosEtapa1({
											...dadosEtapa1,
											documento_socio: e.target.value,
										})
									}
								/> */}
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  required
                  variant="outlined"
                  label="Nome"
                  fullWidth
                  value={dadosEtapa1.nome_socio}
                  error={errorsEtapa1.nome_socio}
                  helperText={
                    errorsEtapa1.nome_socio
                      ? errorsEtapa1.nome_socio.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      nome_socio: e.target.value,
                    })
                  }
                />
              </Grid>
              {/* </Grid> */}
              {/* <Grid container spacing={2}style={{ marginTop: '25px' }} > */}
              <Grid item sm={6} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  required
                  variant="outlined"
                  label="E-mail"
                  fullWidth
                  value={dadosEtapa1.email_socio}
                  error={errorsEtapa1.email_socio}
                  helperText={
                    errorsEtapa1.email_socio
                      ? errorsEtapa1.email_socio.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      email_socio: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  required
                  variant="outlined"
                  label="Confirmação do e-mail"
                  fullWidth
                  value={validarConfirmacaoEmail}
                  onChange={(e) => setValidarConfirmacaoEmail(e.target.value)}
                />
              </Grid>
              {/* </Grid> */}
              {/* <Grid container spacing={2} > */}
              <Grid item sm={6} xs={12}>
                <ReactInputMask
                  mask="(99) 99999-9999"
                  value={dadosEtapa1.celular_socio}
                  onChange={(e) =>
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      celular_socio: e.target.value,
                    })
                  }
                >
                  {() => (
                    <TextField
                      className={classes.inputAutofill}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      required
                      label="Celular"
                      type="tel"
                      error={errorsEtapa1.celular_socio}
                      helperText={
                        errorsEtapa1.celular_socio
                          ? errorsEtapa1.celular_socio.join(" ")
                          : null
                      }
                    />
                  )}
                </ReactInputMask>
              </Grid>
            </Grid>
            <Grid item sm={8} xs={12} style={{ marginTop: "10px" }}>
              <Box style={{ display: "flex" }}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: APP_CONFIG.mainCollors.primary,
                    marginTop: "10px",
                  }}
                >
                  Esse será o cadastro master?
                </Typography>
                <Checkbox
                  color="primary"
                  checked={dadosEtapa1.consultor}
                  onChange={() => {
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      consultor: true,
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
                  checked={!dadosEtapa1.consultor}
                  onChange={() => {
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      consultor: false,
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
            </Grid>

            {/* {APP_CONFIG.isEstabelecimento ? (
              <Grid item sm={8} xs={12} style={{ marginTop: "10px" }}>
                <Box style={{ display: "flex" }}>
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: APP_CONFIG.mainCollors.primary,
                      marginTop: "10px",
                    }}
                  >
                    Essa é uma conta de estabelecimento?
                  </Typography>
                  <Checkbox
                    color="primary"
                    checked={dadosEtapa1.is_estabelecimento}
                    onChange={() => {
                      setDadosEtapa1({
                        ...dadosEtapa1,
                        is_estabelecimento: true,
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
                    checked={!dadosEtapa1.is_estabelecimento}
                    onChange={() => {
                      setDadosEtapa1({
                        ...dadosEtapa1,
                        is_estabelecimento: false,
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
              </Grid>
            ) : null} */}

            <Typography
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontSize: "16px",
                color: APP_CONFIG.mainCollors.primary,
                marginTop: "30px",
              }}
            >
              Dados da empresa
            </Typography>
            <Grid container spacing={4} style={{ marginTop: "25px" }}>
              <Grid item sm={6} xs={12}>
                <ReactInputMask
                  mask="99.999.999/9999-99"
                  value={dadosEtapa1.documento}
                  onChange={(e) =>
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      documento: e.target.value,
                    })
                  }
                >
                  {() => (
                    <TextField
                      className={classes.inputAutofill}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      required
                      label="CNPJ"
                      error={errorsEtapa1.documento}
                      helperText={
                        errorsEtapa1.documento
                          ? errorsEtapa1.documento.join(" ")
                          : null
                      }
                    />
                  )}
                </ReactInputMask>
                {/* <TextField
									className={classes.inputAutofill}
									required
									variant="outlined"
									label="CNPJ"
									fullWidth
									value={dadosEtapa1.documento}
									error={errorsEtapa1.documento}
									helperText={
										errorsEtapa1.documento
											? errorsEtapa1.documento.join(' ')
											: null
									}
									onChange={(e) =>
										setDadosEtapa1({
											...dadosEtapa1,
											documento: e.target.value,
										})
									}
								/> */}
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  required
                  variant="outlined"
                  label="Razão social"
                  fullWidth
                  value={dadosEtapa1.nome}
                  error={errorsEtapa1.nome}
                  helperText={
                    errorsEtapa1.nome ? errorsEtapa1.nome.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      nome: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={4} style={{ marginTop: "25px" }}>
              <Grid item sm={6} xs={12}>
                <Select
                  variant="outlined"
                  fullWidth
                  value={dadosEtapa1.tipo_empresa}
                  label="Tipo"
                  onChange={(e) =>
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      tipo_empresa: e.target.value,
                    })
                  }
                >
                  <MenuItem
                    value={" "}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    Tipo da empresa
                  </MenuItem>
                  <MenuItem
                    value={0}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    SA
                  </MenuItem>
                  <MenuItem
                    value={1}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    LTDA
                  </MenuItem>
                  <MenuItem
                    value={2}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    MEI
                  </MenuItem>
                  <MenuItem
                    value={3}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    ME
                  </MenuItem>
                  <MenuItem
                    value={4}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    EIRELI
                  </MenuItem>
                  <MenuItem
                    value={5}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    Condomínio
                  </MenuItem>
                  <MenuItem
                    value={6}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    SA_Fechada
                  </MenuItem>
                  <MenuItem
                    value={7}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    EIRELI_Simples
                  </MenuItem>
                  <MenuItem
                    value={8}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    Outros
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  required
                  variant="outlined"
                  label="CNAE"
                  fullWidth
                  value={dadosEtapa1.cnae}
                  error={errorsEtapa1.cnae}
                  helperText={
                    errorsEtapa1.cnae ? errorsEtapa1.cnae.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosEtapa1({
                      ...dadosEtapa1,
                      cnae: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            style={{
              width: "30%",
              alignSelf: "center",
              display: "flex",
              marginTop: "40px",

              justifyContent: "center",
            }}
          >
            <CustomButton
              variant="contained"
              color="purple"
              onClick={handleContinuar}
              /* onClick={() => handleAbrirModalTermos()} */
            >
              <Typography
                style={{
                  fontSize: "10px",
                  color: "white",
                }}
              >
                CONTINUAR
              </Typography>
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
