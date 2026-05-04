import {
  Grid,
  LinearProgress,
  Paper,
  TextField,
  useTheme,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import { passwordStrength } from "check-password-strength";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { postPrimeiroAcesso } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    background: APP_CONFIG.mainCollors.primaryGradient,
    margin: "0px",
    padding: "0px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
    },
  },

  colorPrimary: {
    backgroundColor: "#00695C",
  },
  barColorPrimary: {
    backgroundColor: "#B2DFDB",
  },

  text: {
    color: APP_CONFIG.mainCollors.primary,
  },

  rightSide: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "55%",
    height: "100vh",

    color: "#35322f",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      height: "100vh",
    },
  },
  leftSideText: {},
  leftSide: {
    display: "flex",
    justifyContent: "center",
    width: "45%",

    padding: "80px",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      height: "100vh",
      padding: "0px",
    },
  },

  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    height: "600px",
    alignItems: "center",
    padding: "40px",
    width: "60%",
    borderRadius: "27px",
    animation: `$myEffect 1000ms ${theme.transitions.easing.easeInOut}`,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: APP_CONFIG.mainCollors.primary,
    color: "white",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  "@keyframes myEffect": {
    "0%": {
      opacity: 0,
      transform: "translateX(-10%)",
    },
    "100%": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
}));

const Cadastro = () => {
  const [forcaSenha, setForcaSenha] = useState({
    id: 0,
    value: "",
    contains: [""],
    length: 0,
  });
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState("red");

  const classes = useStyles();
  const [user, setUser] = useState({
    email: "",
    token: "",
    password: "",
    password_confirmation: "",
  });
  const theme = useTheme();
  const [errosUser, setErrosUser] = useState({});
  const history = useHistory();
  const [, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onCadastrar = async () => {
    setLoading(true);
    let newUser = user;
    const resUser = await dispatch(postPrimeiroAcesso(newUser));
    if (resUser) {
      setErrosUser(resUser);
      setLoading(false);
    } else {
      toast.success(
        "Cadastro efetuado com sucesso, faça login para ter acesso!"
      );
      history.push("/login");
      setLoading(false);
    }
  };

  useEffect(() => {
    setForcaSenha({
      ...forcaSenha,
      ...passwordStrength(user.password, [
        {
          id: 0,
          value: "Senha muito fraca",
          minDiversity: 0,
          minLength: 0,
        },
        { id: 1, value: "Senha fraca", minDiversity: 2, minLength: 8 },
        { id: 2, value: "Senha média", minDiversity: 3, minLength: 8 },
        { id: 3, value: "Senha forte", minDiversity: 4, minLength: 8 },
      ]),
    });
    // scrollRef.current.scrollToEnd({});
  }, [user.password]);

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
        : "red"
    );
  }, [forcaSenha.id]);

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.leftSide}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar} />
            <Typography
              component="h1"
              variant="h5"
              style={{ marginBottom: "4px" }}
            >
              Cadastrar
            </Typography>

            <Grid container spacing={5} className={classes.form}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  error={errosUser.token}
                  helperText={
                    errosUser.token ? errosUser.token.join(" ") : null
                  }
                  autoFocus
                  label="Código de verificação enviado por e-mail"
                  fullWidth
                  required
                  value={user.token}
                  onChange={(e) => setUser({ ...user, token: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  error={errosUser.email}
                  helperText={
                    errosUser.email ? errosUser.email.join(" ") : null
                  }
                  type="email"
                  fullWidth
                  label="Digite seu email"
                  name="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  error={errosUser.password}
                  helperText={
                    errosUser.password ? errosUser.password.join(" ") : null
                  }
                  required
                  fullWidth
                  name="password"
                  label="Digite sua senha"
                  id="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                {user.password !== "" || user.password_confirmation !== "" ? (
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
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  variant="outlined"
                  error={errosUser.password_confirmation}
                  helperText={
                    errosUser.password_confirmation
                      ? errosUser.password_confirmation.join(" ")
                      : null
                  }
                  required
                  fullWidth
                  name="password"
                  label="Confirmação de senha"
                  id="password"
                  value={user.password_confirmation}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </Grid>
              <Button
                size="large"
                fullWidth
                variant="contained"
                className={classes.submit}
                style={{
                  borderRadius: "27px",
                  backgroundColor: APP_CONFIG.mainCollors.primary,
                  fontFamily: "Montserrat-Regular",
                }}
                onClick={onCadastrar}
              >
                <Typography align="center" style={{ color: "white" }}>
                  Cadastrar
                </Typography>
              </Button>
            </Grid>
          </Paper>
        </Box>
        <Box className={classes.rightSide}>
          <Box>
            <img
              style={{
                width: "200px",
                justifySelf: "flex-start",
                marginTop: "100px",
              }}
              src={APP_CONFIG.assets.smallColoredLogo}
              alt="Itapemirim logo"
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginTop="150px"
          >
            <Typography variant="h3" align="center" style={{ color: "white" }}>
              Primero acesso?
            </Typography>
            <Typography
              align="center"
              variant="h6"
              style={{ fontWeight: "100", color: "white" }}
            >
              Bem-vindo! Falta pouco para finalizar seu cadastro.
            </Typography>
            <Typography
              align="center"
              variant="h6"
              style={{ fontWeight: "100", color: "white" }}
            >
              Basta inserir o código enviado via EMAIL e preencher os campos.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Cadastro;
