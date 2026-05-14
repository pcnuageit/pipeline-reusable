import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Ativar from "../../assets/vBankPJAssets/ativarCartao.svg";
import Bloquear from "../../assets/vBankPJAssets/bloquearCartao.svg";
import Cancelar from "../../assets/vBankPJAssets/cancelarCartao.svg";
import Senha from "../../assets/vBankPJAssets/senhaCartao.svg";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

export default function OpcaoCartao({ icone, texto, cartao, funcao }) {
  const classes = useStyles();
  const [disabled, setDisable] = useState(true);
  const token = useAuth();
  const statusCartao = useSelector((state) => state.statusCartaoPre);

  useEffect(() => {
    (async () => {
      await checarCartao();
    })();
  }, [cartao]);

  async function checarCartao() {
    try {
      if (cartao == null) {
        return setDisable(true);
      } else {
        //const data = statusCartao;
        if (cartao?.response?.card_type == "VIRTUAL") {
          return setDisable(false);
        } else if (
          cartao?.response?.status == "EMBOSSED" &&
          texto == "Ativar cartão"
        ) {
          return setDisable(false);
        } else if (
          cartao?.response?.status == "ACTIVE" &&
          texto == "Ativar cartão"
        ) {
          return setDisable(true);
        } else if (cartao?.response?.status == "ACTIVE") {
          return setDisable(false);
        } else if (cartao?.response?.status == "CREATED") {
          return setDisable(false);
        } else {
          return setDisable(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  function executarFuncao() {
    if (disabled == false) {
      funcao();
    }
  }

  return (
    <Box className={classes.opcaoCartao} onClick={executarFuncao}>
      <Button
        disabled={disabled}
        className={
          disabled == false
            ? classes.opcaoCartaoIcone
            : classes.opcaoCartaoIconeDesabilitado
        }
      >
        {icone == "ativar" ? (
          <img src={Ativar} style={{ width: "85%" }} />
        ) : icone == "bloquear" ? (
          <img src={Bloquear} style={{ width: "75%" }} />
        ) : icone == "cancelar" ? (
          <img
            src={Cancelar}
            style={{
              width: "90%",
              position: "relative",
              marginLeft: 5,
              marginTop: 5,
            }}
          />
        ) : icone == "senha" ? (
          <img src={Senha} style={{ width: "80%" }} />
        ) : (
          <></>
        )}
      </Button>
      <Typography className={classes.textoOpcaoCartao}>{texto}</Typography>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  opcaoCartao: {
    width: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  opcaoCartaoIcone: {
    maxWidth: 60,
    height: 60,
    width: 60,
    minWidth: 20,
    borderRadius: "50%",
    background: APP_CONFIG.mainCollors.primary,
    marginBottom: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  opcaoCartaoIconeDesabilitado: {
    maxWidth: 60,
    height: 60,
    width: 60,
    minWidth: 20,
    borderRadius: "50%",
    backgroundColor: APP_CONFIG.mainCollors.disabledTextfields,
    marginBottom: 5,
  },
  textoOpcaoCartao: {
    fontSize: 10,
    textAlign: "center",
    color: APP_CONFIG.mainCollors.primary,
  },
}));
