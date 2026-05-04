import { Paper, useTheme } from "@material-ui/core";
import { useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import { postRecuperarSenha } from "../../actions/actions";
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
    height: "500px",
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
  const { token } = useParams();
  const classes = useStyles();
  const [user, setUser] = useState({
    email: "",
    token: token,
    password: "",
    password_confirmation: "",
  });
  const theme = useTheme();
  const [errosUser, setErrosUser] = useState({});
  const history = useHistory();
  const [, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onRecuperar = async () => {
    setLoading(true);
    let newUser = user;
    const resUser = await dispatch(postRecuperarSenha(newUser));
    if (resUser) {
      setErrosUser(resUser);
      setLoading(false);
    } else {
      toast.success(
        "Senha redefinida com sucesso, faça login para ter acesso!"
      );
      history.push("/login");
      setLoading(false);
    }
  };

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
              Redefinir Senha
            </Typography>

            <form className={classes.form}>
              <TextField
                error={errosUser.email}
                helperText={errosUser.email ? errosUser.email.join(" ") : null}
                type="email"
                variant="outlined"
                margin="normal"
                fullWidth
                label="Digite seu email"
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
              <TextField
                error={errosUser.password}
                helperText={
                  errosUser.password ? errosUser.password.join(" ") : null
                }
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Digite sua senha"
                id="password"
                autoComplete="current-password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <TextField
                error={errosUser.password_confirmation}
                helperText={
                  errosUser.password_confirmation
                    ? errosUser.password_confirmation.join(" ")
                    : null
                }
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Confirmação de senha"
                id="password"
                autoComplete="current-password"
                value={user.password_confirmation}
                onChange={(e) =>
                  setUser({
                    ...user,
                    password_confirmation: e.target.value,
                  })
                }
              />
              <Button
                size="large"
                fullWidth
                variant="contained"
                className={classes.submit}
                style={{
                  borderRadius: "27px",
                  backgroundColor: APP_CONFIG.mainCollors.primary,
                  fontFamily: "Montserrat-Regular",
                  /* background: theme.gradient.main, */
                }}
                onClick={onRecuperar}
              >
                Redefinir Senha
              </Button>
            </form>
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
              Redefinição de Senha?
            </Typography>
            <Typography
              align="center"
              variant="h6"
              style={{ fontWeight: "100", color: "white" }}
            >
              Você está aqui porque recebeu um email de redefinição de senha
              para sua conta.
            </Typography>
            <Typography
              align="center"
              variant="h6"
              style={{ fontWeight: "100", color: "white" }}
            >
              Basta inserir o seu EMAIL e preencher os campos.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Cadastro;
