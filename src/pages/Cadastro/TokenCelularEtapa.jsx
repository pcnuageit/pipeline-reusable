import { Box, Typography, useTheme } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import CustomSideBar from "../../components/CustomSideBar/CustomSideBar";

import ReactCodeInput from "react-code-input";
import { postReenviarTokenAction } from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
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
  tokenBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "100px",
  },
}));
export default function TokenCelularEtapa({ getNextEtapa }) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const dadosCadastrais = useSelector((state) => state.cadastroEtapa2);

  const [dadosTokenCelular, setDadosTokenCelular] = useState({
    documento: dadosCadastrais.documento,
    tipo: "celular",
    token: "",
  });

  const handleReenviarToken = async () => {
    const resReenviarToken = await dispatch(
      postReenviarTokenAction(dadosCadastrais.documento, "celular"),
    );
    if (resReenviarToken) {
      toast.error("Erro ao reenviar token");
    } else {
      toast.success("Token enviado com sucesso");
    }
  };

  const handleValidarToken = () => {
    getNextEtapa({ dadosTokenCelular });
  };

  return (
    <Box className={classes.root}>
      <CustomSideBar cadastro />
      <Box className={classes.main}>
        <CustomHeader cadastro />
        <Box className={classes.tokenBox}>
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "17px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            Validação
          </Typography>
          <Box style={{ marginTop: "10px" }}>
            <Typography
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontSize: "14px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              Enviamos um código de 6 dígitos via SMS para o seu telefone
              cadastrado, insira-o no campo abaixo.
            </Typography>
          </Box>
          <ReactCodeInput
            value={dadosTokenCelular.token}
            onChange={(e) =>
              setDadosTokenCelular({
                ...dadosTokenCelular,
                token: e,
              })
            }
            type="number"
            fields={6}
            inputStyle={{
              fontFamily: "monospace",
              margin: "4px",
              marginTop: "30px",
              MozAppearance: "textfield",
              width: "30px",
              borderRadius: "28px",
              fontSize: "20px",
              height: "50px",
              paddingLeft: "7px",

              color: APP_CONFIG.mainCollors.primary,
              border: `1px solid ${APP_CONFIG.mainCollors.primary}`,
            }}
          />
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
            }}
          >
            <CustomButton
              variant="contained"
              color="purple"
              onClick={handleReenviarToken}
            >
              <Typography
                style={{
                  fontSize: "10px",
                  color: "white",
                }}
              >
                REENVIAR TOKEN
              </Typography>
            </CustomButton>
            <Box style={{ marginTop: "10px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                style={{ marginTop: "10px" }}
                onClick={handleValidarToken}
              >
                <Typography
                  style={{
                    fontSize: "10px",
                    color: "white",
                  }}
                >
                  ENVIAR
                </Typography>
              </CustomButton>
            </Box>
          </Box>
          <Box style={{ alignSelf: "center", marginTop: "50px" }}>
            <img
              src={APP_CONFIG.assets.tokenImageSvg}
              style={{ width: "80%" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
