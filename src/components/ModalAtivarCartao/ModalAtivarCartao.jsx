import {
  Box,
  Button,
  makeStyles,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import ReactCodeInput from "react-code-input";
import { toast } from "react-toastify";
import instrucaoCartao from "../../assets/vBankPJAssets/instrucaoCartao.svg";
import instrucaoCartao2 from "../../assets/vBankPJAssets/instrucaoCartao2.svg";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { postAtivarCartao } from "../../services/services";
import CustomButton from "../CustomButton/CustomButton";

export default function ModalAtivarCartao({
  closeModal,
  isOpen,
  cartao,
  abrirModalSenha,
}) {
  const classes = useStyles();
  const [tokenApp, setTokenApp] = useState("");
  const [barcode, setBarcode] = useState("");
  const token = useAuth();
  const [modalInstrucao, setModalInstrucao] = useState(true);
  //integrar metodo de ativar cartao

  async function ativarCartao() {
    if (tokenApp == "" || barcode == "") {
      return toast.error("Dados obrigatórios.");
    }
    try {
      console.log(barcode);
      await postAtivarCartao(token, cartao.id, barcode, tokenApp);
      toast.success("Cartão ativado com sucesso.");
      abrirModalSenha();
      closeModal();
    } catch (error) {
      toast.error("Erro ao ativar o cartão, tente novamente.");
      console.log(error);
      closeModal();
    }
  }

  return (
    <Modal
      className={classes.modal}
      open={isOpen}
      onBackdropClick={() => {
        setModalInstrucao(true);
        closeModal();
      }}
    >
      {modalInstrucao ? (
        <Box className={classes.content}>
          <Typography style={{ color: "#9D9CC6", alignSelf: "baseline" }}>
            ATIVAR CARTÃO FÍSICO
          </Typography>
          <Box
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: "30px",
            }}
          >
            <img src={instrucaoCartao} style={{ width: "360px" }} />
            <img src={instrucaoCartao2} style={{ marginLeft: "30px" }} />
          </Box>
          <Typography
            style={{
              fontSize: 14,
              color: "#9D9CC6",
              marginTop: "30px",
            }}
          >
            Para ativação do seu cartão pré-pago, identifique o código de
            autenticação (Barcode) que está no verso do seu cartão. O número
            deve conter 9 dígitos.
          </Typography>
          <Box style={{ marginTop: "30px" }}>
            <Button
              className={classes.arrowButton}
              onClick={() => setModalInstrucao(false)}
            >
              <ArrowForwardIcon style={{ color: "white" }} />
            </Button>
          </Box>
        </Box>
      ) : (
        <Box className={classes.content}>
          <Typography className={classes.tituloModal}>
            Preencha o campo com o token do seu aplicativo e o barcode para
            ativar o seu cartão.
          </Typography>
          <Typography className={classes.inputLabel}>Barcode</Typography>
          <TextField
            variant="outlined"
            value={barcode}
            onChange={(e) => {
              setBarcode(e.target.value);
            }}
            type="number"
          />
          <Typography className={classes.inputLabel}>Token</Typography>
          <ReactCodeInput
            value={tokenApp}
            onChange={(e) => setTokenApp(e)}
            type="number"
            fields={6}
            inputStyle={{
              fontFamily: "monospace",
              margin: "4px",
              marginTop: "10px",
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
          <img src={APP_CONFIG.assets.tokenImageSvg} className={classes.img} />
          <CustomButton
            variant="contained"
            color="purple"
            onClick={ativarCartao}
          >
            <Typography className={classes.btnText}>Enviar</Typography>
          </CustomButton>
        </Box>
      )}
    </Modal>
  );
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputLabel: {
    fontFamily: "Montserrat-Regular",
    fontSize: "14px",
    color: APP_CONFIG.mainCollors.primary,
    marginTop: "10px",
  },
  btnText: {
    fontFamily: "Montserrat-Regular",
    fontSize: "14px",
    color: "white",
  },
  img: {
    marginTop: 20,
    marginBottom: 20,
    width: "50%",
  },
  content: {
    width: "100%",
    maxWidth: 800,
    background: "white",
    padding: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tituloModal: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: "16px",
    color: APP_CONFIG.mainCollors.primary,
  },
  arrowButton: {
    backgroundColor: "#05933E",
    borderRadius: "27px",
    minWidth: "20px !important",
    boxShadow: "none",
  },
}));
