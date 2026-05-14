import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";

import CustomButton from "../../components/CustomButton/CustomButton";

import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import ReactInputMask from "react-input-mask";
import { setPreContaJuridicaId } from "../../actions/actions";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";

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
    marginTop: "60px",
    alignContent: "center",
    justifyContent: "center",
  },
}));

export default function ConfirmarDadosEtapa({
  getNextEtapa,
  errorsEtapa2,
  modalVerificarContato,
  setModalVerificarContato,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const dadosEmpresa = useSelector((state) => state.cadastroEtapa1);
  const [loading, setLoading] = useState(false);
  const [dadosEtapa2, setDadosEtapa2] = useState({
    documento: dadosEmpresa.documento,
    nome: dadosEmpresa.nome,
    cnae: dadosEmpresa.cnae,
    celular: dadosEmpresa.celular_socio,
    email: dadosEmpresa.email_socio,
  });

  const handleContinuar = () => {
    setLoading(true);
    if (
      dadosEtapa2.nome === "" ||
      dadosEtapa2.documento === "" ||
      dadosEtapa2.celular === "" ||
      dadosEtapa2.cnae === "" ||
      dadosEtapa2.email === ""
    ) {
      toast.error("Preencha todos os campos");
    } else {
      dispatch(setPreContaJuridicaId(dadosEmpresa.id));
      getNextEtapa({ dadosEtapa2 });
    }
    setLoading(false);
  };

  const handleModalConfirmar = () => {
    if (
      dadosEtapa2.nome === undefined ||
      dadosEtapa2.documento === undefined ||
      dadosEtapa2.celular === undefined ||
      dadosEtapa2.cnae === undefined ||
      dadosEtapa2.email === undefined
    ) {
      toast.error("Preencha todos os campos");
    } else {
      setModalVerificarContato(true);
    }
  };

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.leftBox}>
        <Stepper
          activeStep={1}
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
            src={APP_CONFIG.assets.backgroundLogo}
            alt={""}
            className={classes.bigLogoImg}
          />
        </Box>
      </Box>

      <Box className={classes.rightBox}>
        <Box className={classes.smallLogoContainer}>
          <img src={APP_CONFIG.assets.smallColoredLogo} alt={"vBank Logo"} />
        </Box>

        <Box className={classes.titleContainer}>
          <Typography
            align="left"
            style={{
              fontSize: "29px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Confirme os dados da sua empresa.
          </Typography>

          <Box className={classes.fieldsContainer}>
            <Typography
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontSize: "16px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Dados da empresa
            </Typography>
            <Grid container spacing={4} style={{ marginTop: "10px" }}>
              <Grid item sm={6} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  required
                  variant="outlined"
                  label="CNPJ"
                  fullWidth
                  value={dadosEtapa2.documento}
                  error={errorsEtapa2.documento}
                  helperText={
                    errorsEtapa2.documento
                      ? errorsEtapa2.documento.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosEtapa2({
                      ...dadosEtapa2,
                      documento: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  required
                  variant="outlined"
                  label="Razão Social"
                  fullWidth
                  value={dadosEtapa2.nome}
                  error={errorsEtapa2.nome}
                  helperText={
                    errorsEtapa2.nome ? errorsEtapa2.nome.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosEtapa2({
                      ...dadosEtapa2,
                      nome: e.target.value,
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
                  label="E-mail"
                  fullWidth
                  value={dadosEtapa2.email}
                  error={errorsEtapa2.email}
                  helperText={
                    errorsEtapa2.email ? errorsEtapa2.email.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosEtapa2({
                      ...dadosEtapa2,
                      email: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <ReactInputMask
                  mask="(99) 99999-9999"
                  value={dadosEtapa2.celular}
                  onChange={(e) =>
                    setDadosEtapa2({
                      ...dadosEtapa2,
                      celular: e.target.value,
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
                      error={errorsEtapa2.celular}
                      helperText={
                        errorsEtapa2.celular
                          ? errorsEtapa2.celular.join(" ")
                          : null
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
                  label="CNAE"
                  fullWidth
                  value={dadosEtapa2.cnae}
                  error={errorsEtapa2.cnae}
                  helperText={
                    errorsEtapa2.cnae ? errorsEtapa2.cnae.join(" ") : null
                  }
                  onChange={(e) =>
                    setDadosEtapa2({
                      ...dadosEtapa2,
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
              onClick={() => handleModalConfirmar()}
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

      <VerificarContatoModal
        modalVerificarContato={modalVerificarContato}
        setModalVerificarContato={setModalVerificarContato}
        dadosEtapa2={dadosEtapa2}
        handleContinuar={handleContinuar}
      />
    </Box>
  );
}

function VerificarContatoModal({
  modalVerificarContato,
  setModalVerificarContato,
  dadosEtapa2,
  handleContinuar,
}) {
  return (
    <Dialog
      open={modalVerificarContato}
      onClose={() => setModalVerificarContato(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        style={{
          color: APP_CONFIG.mainCollors.primary,
          fontFamily: "Montserrat-SemiBold",
        }}
      >
        Confirme seus dados
      </DialogTitle>

      <DialogContent
        style={{
          minWidth: 500,
        }}
      >
        <Box display={"flex"}>
          <Typography
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            Documento:{" "}
          </Typography>
          <Typography style={{ marginLeft: "3px" }}>
            {dadosEtapa2.documento}
          </Typography>
        </Box>
        <Box display={"flex"} marginTop={"10px"}>
          <Typography
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            Email:{" "}
          </Typography>
          <Typography style={{ marginLeft: "3px" }}>
            {dadosEtapa2.email}
          </Typography>
        </Box>
        <Box display={"flex"} marginTop={"10px"}>
          <Typography
            style={{
              color: APP_CONFIG.mainCollors.primary,
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            Celular:{" "}
          </Typography>
          <Typography style={{ marginLeft: "3px" }}>
            {dadosEtapa2.celular}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleContinuar()}
          style={{ marginRight: "10px" }}
        >
          Confirmar
        </Button>
        <Button
          variant="outlined"
          onClick={() => setModalVerificarContato(false)}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
