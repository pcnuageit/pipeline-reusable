import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import CustomButton from "../../components/CustomButton/CustomButton";

import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { passwordStrength } from "check-password-strength";
import { useEffect } from "react";
import { APP_CONFIG } from "../../constants/config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",

    // flexGrow: 1,
    // width: '100vw',
    // height: '100vh',

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

  stepsContainer: {
    marginTop: "60px",
    flexDirection: "column",
    display: "flex",
  },

  stepContainer: {
    marginTop: "10px",
    flexDirection: "row",
    display: "flex",
    alignSelf: "flex-start",
  },
}));
export default function TerceiraEtapa({ getNextEtapa, errorsEtapa3 }) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const dadosCadastrais = useSelector((state) => state.cadastroEtapa2);
  const [dadosEtapa3, setDadosEtapa3] = useState({
    documento: dadosCadastrais.documento,
    password: "",
    password_confirmation: "",
  });

  const [verificarContato, setVerificarContato] = useState({
    documento: dadosCadastrais.documento,
    email: dadosCadastrais.email,
    celular: dadosCadastrais.celular,
  });
  const [viewPassword, setViewPassword] = useState("password");
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState("red");
  const [forcaSenha, setForcaSenha] = useState({
    id: 0,
    value: "",
    contains: [""],
    length: 0,
  });

  useEffect(() => {
    setForcaSenha({
      ...forcaSenha,
      ...passwordStrength(dadosEtapa3.password, [
        {
          id: 0,
          value: "Senha muito fraca",
          minDiversity: 0,
          minLength: 0,
        },
        { id: 1, value: "Senha fraca", minDiversity: 2, minLength: 6 },
        { id: 2, value: "Senha média", minDiversity: 3, minLength: 7 },
        { id: 3, value: "Senha forte", minDiversity: 4, minLength: 8 },
      ]),
    });
    // scrollRef.current.scrollToEnd({});
  }, [dadosEtapa3.password]);

  useEffect(() => {
    setProgress(forcaSenha.id);
  }, [forcaSenha.id]);

  useEffect(() => {
    setColor(
      forcaSenha.id === 0
        ? "red"
        : forcaSenha.id === 1
          ? "orange"
          : forcaSenha.id === 2
            ? "green"
            : forcaSenha.id === 3
              ? "yellowgreen"
              : "red",
    );
  }, [forcaSenha.id]);

  const handleContinuar = () => {
    getNextEtapa({ dadosEtapa3, verificarContato });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.leftBox}>
        <Stepper
          activeStep={2}
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
            Agora, cadastre uma senha de acesso.
          </Typography>

          <Box className={classes.fieldsContainer}>
            <Grid container spacing={4} style={{ marginTop: "10px" }}>
              <Grid item sm={5} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  type={viewPassword}
                  variant="outlined"
                  label="Senha"
                  fullWidth
                  value={dadosEtapa3.password}
                  error={errorsEtapa3.password}
                  helperText={
                    errorsEtapa3.password
                      ? errorsEtapa3.password.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosEtapa3({
                      ...dadosEtapa3,
                      password: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item sm={2} xs={2}>
                <Box
                  style={{
                    display: "flex",
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setViewPassword(
                        viewPassword === "Password" ? "" : "Password",
                      );
                    }}
                  >
                    <VisibilityIcon
                      style={{
                        color: APP_CONFIG.mainCollors.primary,
                      }}
                    />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item sm={5} xs={12}>
                <TextField
                  className={classes.inputAutofill}
                  type="password"
                  variant="outlined"
                  label="Repetir a senha"
                  fullWidth
                  value={dadosEtapa3.password_confirmation}
                  error={errorsEtapa3.password_confirmation}
                  helperText={
                    errorsEtapa3.password_confirmation
                      ? errorsEtapa3.password_confirmation.join(" ")
                      : null
                  }
                  onChange={(e) =>
                    setDadosEtapa3({
                      ...dadosEtapa3,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid item sm={5} xs={12}>
              {dadosEtapa3.password !== "" ||
              dadosEtapa3.password_confirmation !== "" ? (
                <Box
                  style={{
                    width: "100%",
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}
                >
                  <LinearProgress
                    value={progress * 30}
                    variant="determinate"
                    style={{
                      backgroundColor: color,
                    }}
                  />
                  <Box style={{ marginTop: 5 }}>
                    <Typography className={classes.text}>
                      {forcaSenha.value}
                    </Typography>
                  </Box>
                  {!forcaSenha.contains.includes("lowercase") ? (
                    <Typography className={classes.text}>
                      * Adicione uma letra minuscula
                    </Typography>
                  ) : null}
                  {!forcaSenha.contains.includes("uppercase") ? (
                    <Typography className={classes.text}>
                      * Adicione uma letra maiúscula
                    </Typography>
                  ) : null}
                  {!forcaSenha.contains.includes("symbol") ? (
                    <Typography className={classes.text}>
                      * Adicione um símbolo
                    </Typography>
                  ) : null}
                  {!forcaSenha.contains.includes("number") ? (
                    <Typography className={classes.text}>
                      * Adicione um número
                    </Typography>
                  ) : null}
                  {forcaSenha.length < 8 ? (
                    <Typography className={classes.text}>
                      * Senha muito curta
                    </Typography>
                  ) : null}
                </Box>
              ) : (
                <Box />
              )}
            </Grid>
          </Box>
          <Box
            style={{
              width: "40%",
              alignSelf: "center",
              display: "flex",
              marginTop: "100px",

              justifyContent: "center",
            }}
          >
            <CustomButton
              variant="contained"
              color="purple"
              onClick={handleContinuar}
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
