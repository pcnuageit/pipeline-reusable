import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

export default function StepperCartaoPre({ cartao, confirmarCartao }) {
  const classes = useStyles();
  const [etapa, setEtapa] = useState(0);
  const token = useAuth();
  const statusCartao = useSelector((state) => state.statusCartaoPre);

  useEffect(() => {
    (async () => {
      await verificaEtapa();
    })();
  }, [cartao, statusCartao]);

  async function verificaEtapa() {
    try {
      //const res = await postCartaoStatus(token, cartao.id);

      if (statusCartao != null) {
        if (statusCartao.status == "Created" || cartao.status == "0") {
          setEtapa(0);
        } else if (statusCartao.status == "Requested") {
          setEtapa(1);
        } else if (
          statusCartao.status == "Generated" ||
          statusCartao.status == "Active"
        ) {
          setEtapa(2);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Stepper className={classes.root} activeStep={etapa} alternativeLabel>
      <Step>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StepLabel
            StepIconProps={{ style: { color: "#4b4b96" } }}
          ></StepLabel>
          <Typography className={classes.labelStepper}>
            Confirmar cartão
          </Typography>
          {etapa == 0 && (
            <Button
              className={classes.botaoConfirmarCartao}
              variant="contained"
              onClick={() => {
                confirmarCartao(cartao.id);
              }}
            >
              <Typography className={classes.textobotaoNovoCartao}>
                Confirmar
              </Typography>
            </Button>
          )}
        </Box>
      </Step>
      <Step>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StepLabel
            StepIconProps={{ style: { color: "#4b4b96" } }}
          ></StepLabel>
          <Typography className={classes.labelStepper}>
            Cartão confirmado
          </Typography>
        </Box>
      </Step>
      <Step>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StepLabel
            StepIconProps={{ style: { color: "#4b4b96" } }}
          ></StepLabel>
          <Typography className={classes.labelStepper}>
            Cartão gerado
          </Typography>
        </Box>
      </Step>
    </Stepper>
  );
}

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    background: "red",
  },
  textobotaoNovoCartao: {
    fontSize: 10,
    color: "white",
    fontFamily: "Montserrat-Regular",
    textTransform: "uppercase",
  },
  botaoConfirmarCartao: {
    width: 100,
    marginTop: 10,
    background: APP_CONFIG.mainCollors.buttonGradientVariant,
    borderRadius: 27,
  },
  labelStepper: {
    color: "#4b4b96",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    marginTop: 10,
  },
  root: {
    marginTop: 40,
  },
}));
