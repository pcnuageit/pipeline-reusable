import {
  Box,
  makeStyles,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import "moment/locale/pt-br";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import {
  postSegundaViaMarcarEntregue,
  postSegundaViaNegarSolicitacao,
  postSegundaViaSolicitar,
} from "../../../services/beneficiarios";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "25px",
    width: "100%",
    "@media (max-width: 1440px)": {
      width: "950px",
    },
    "@media (max-width: 1280px)": {
      width: "850px",
    },
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "10%",
    left: "35%",
    width: "30%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },
  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
}));

export function ModalManagerListaCartaoSegundaVia({
  show = false, // false, "solicitar", "negar", "enviado"
  setShow = () => null,
  getData = () => null,
  registros = [],
  setRegistros = () => null,
  row = {},
}) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const classes = styles();

  function handleClose() {
    setShow(false);
    setPassword("");
  }

  const message = () => {
    switch (show) {
      case "solicitar":
        return "solicitar segunda via";
      case "negar":
        return "negar segunda via";
      case "enviado":
        return "marcar segunda via como enviada";
      default:
        return "erro";
    }
  };

  async function handleSubmit() {
    setLoading(true);
    try {
      if (show === "solicitar") {
        await postSegundaViaSolicitar(token, password, registros);
      }
      if (show === "negar") {
        await postSegundaViaNegarSolicitacao(token, password, registros);
      }
      if (show === "enviado") {
        await postSegundaViaMarcarEntregue(token, password, registros);
      }
      toast.success(`Sucesso ao ${message()}!`);
      getData(token);
      setRegistros([]);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error(
        `Ocorreu um erro ao ${message()}. Tente novamente mais tarde`,
      );
    }
    setLoading(false);
  }

  function chooseText() {
    if (!registros?.length || registros?.length < 1)
      return `Você gostaria de ${message()} de todos os cartões filtrados?`;
    if (registros?.length === 1)
      return `Você gostaria de ${message()} de 1 cartão selecionado?`;
    if (registros?.length > 1)
      return `Você gostaria de ${message()} de ${
        registros?.length
      } cartões selecionados?`;
  }

  return (
    <Modal open={!!show} onClose={handleClose}>
      <Box className={classes.modal}>
        <Box className={classes.closeModalButton} onClick={handleClose}>
          <Close />
        </Box>

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
              textTransform: "initial",
            }}
          >
            {message().charAt(0).toLocaleUpperCase() + message().substring(1)}
          </Typography>

          <Typography style={{ marginBottom: "30px" }}>
            {chooseText()}
          </Typography>

          <Typography>Digite sua senha para confirmar.</Typography>
          <TextField
            fullWidth
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            required
            type="password"
          />

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Continuar
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
