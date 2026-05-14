import { Box, Stepper, Typography, useTheme } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

import CustomButton from "../../components/CustomButton/CustomButton";

import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";

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
    justifyContent: "center",

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
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "5%",
    paddingRight: "5%",
    alignContent: "center",
    justifyContent: "center",
  },

  qrCodeContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "30px",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
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
  link: {
    fontFamily: "Montserrat-Regular",
    fontSize: "20px",
    marginTop: "3px",
    marginLeft: "6px",
    textDecorationLine: "underline",
  },
}));
export default function ContaCadastradaEtapa() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();

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
          {/* <Step style={{ color: 'white' }}>
						<StepLabel>
							<Typography style={{ color: 'white' }}>
								Seus dados
							</Typography>
						</StepLabel>
					</Step>
					<Step>
						<StepLabel>
							<Typography style={{ color: 'white' }}>
								Dados da empresa
							</Typography>
						</StepLabel>
					</Step>
					<Step>
						<StepLabel>
							<Typography style={{ color: 'white' }}>Senha</Typography>
						</StepLabel>
					</Step> */}
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
        <Typography
          align="center"
          style={{
            fontSize: "20px",
            color: APP_CONFIG.mainCollors.primary,

            marginTop: "70px",
            marginBottom: "30px",
          }}
        >
          Recebemos sua solicitação!
        </Typography>
        <Box className={classes.titleContainer}>
          <Box
            style={{
              alignSelf: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={APP_CONFIG.assets.tokenImageSvg}
              style={{
                width: "50%",
              }}
            />
          </Box>
          <Typography
            align="center"
            style={{
              fontSize: "20px",
              color: APP_CONFIG.mainCollors.primary,

              marginTop: "30px",
            }}
          >
            Em breve, você vai receber a confirmação no e-mail cadastrado na sua
            Conta Digital Pessoa Física.
          </Typography>
          <Box
            style={{
              display: "flex",
              marginTop: "30px",
              alignSelf: "center",
            }}
          >
            <Typography
              style={{
                fontSize: "20px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Para finalizar seu cadastro acesse o link clicando
            </Typography>
            <Link
              className={classes.link}
              style={{ textDecorationLine: "underline" }}
              variant="body2"
              onClick={() => (window.location.href = APP_CONFIG.linkApp)}
            >
              aqui.
            </Link>
          </Box>

          <Box
            style={{
              width: "40%",
              alignSelf: "center",
              display: "flex",
              marginTop: "30px",

              justifyContent: "center",
            }}
          >
            <CustomButton
              variant="contained"
              color="purple"
              onClick={() => history.push("/login")}
            >
              <Typography
                style={{
                  fontSize: "10px",
                  color: "white",
                }}
              >
                VOLTAR
              </Typography>
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
