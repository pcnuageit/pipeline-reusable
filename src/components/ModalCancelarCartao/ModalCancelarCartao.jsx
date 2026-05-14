import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { atualizarView } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { delCancelarCartao } from "../../services/services";
import CustomButton from "../CustomButton/CustomButton";

export default function ModalCancelarCartao({ closeModal, isOpen, cartao }) {
  const classes = useStyles();

  const [pin, setPin] = useState("");
  const [confirmarPin, setConfirmarPin] = useState("");
  const [motivo, setMotivo] = useState("2");
  const token = useAuth();
  const updater = useSelector((state) => state.atualizarView);
  const dispatch = useDispatch();

  async function submit() {
    // if (pin == "" || confirmarPin == "") {
    //   return toast.error("Dados obrigatórios.");
    // }
    // if (pin.length > 4) {
    //   return toast.error("A senha deve ter 4 digitos.");
    // }
    // if (pin != confirmarPin) {
    //   return toast.error("As senhas não correspondem.");
    // }

    try {
      await delCancelarCartao(token, cartao.id, pin, motivo);
      toast.success("Cartão cancelado.");
      dispatch(atualizarView(!updater));
      closeModal();
    } catch (error) {
      toast.error("Erro ao executar ação, tente novamente.");
      console.log(error);
      closeModal();
    }
  }

  return (
    <Modal className={classes.modal} open={isOpen} onBackdropClick={closeModal}>
      <Box className={classes.content}>
        <Typography className={classes.tituloModal}>Cancelamento</Typography>
        {/* <Box className={classes.inputsWrapper}>
          <Box>
            <Typography className={classes.inputLabel}>
              Insira sua senha
            </Typography>
            <TextField
              variant="outlined"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
              }}
              type="number"
            />
          </Box>
          <Box>
            <Typography className={classes.inputLabel}>
              Confirme sua senha
            </Typography>
            <TextField
              variant="outlined"
              value={confirmarPin}
              onChange={(e) => {
                setConfirmarPin(e.target.value);
              }}
              type="number"
            />
          </Box>
        </Box> */}

        <FormControl
          style={{
            width: "100%",
          }}
        >
          <FormLabel id="demo-controlled-radio-buttons-group">
            Motivo do cancelamento:
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
            }}
          >
            <FormControlLabel
              value="2"
              style={{ color: APP_CONFIG.mainCollors.primary }}
              control={<Radio color={"primary"} />}
              label="Cartão perdido"
            />
            <FormControlLabel
              value="3"
              style={{ color: APP_CONFIG.mainCollors.primary }}
              control={<Radio color={"primary"} />}
              label="Cartão roubado"
            />
            <FormControlLabel
              value="4"
              style={{ color: APP_CONFIG.mainCollors.primary }}
              control={<Radio color={"primary"} />}
              label="Cartão quebrado"
            />
            <FormControlLabel
              value="5"
              style={{ color: APP_CONFIG.mainCollors.primary }}
              control={<Radio color={"primary"} />}
              label="Atualização de cartão"
            />
            <FormControlLabel
              value="6"
              style={{ color: APP_CONFIG.mainCollors.primary }}
              control={<Radio color={"primary"} />}
              label="Motivos pessoais"
            />
          </RadioGroup>
        </FormControl>

        <CustomButton variant="contained" color="purple" onClick={submit}>
          <Typography className={classes.btnText}>Enviar</Typography>
        </CustomButton>
      </Box>
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
    padding: "50px 100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tituloModal: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: "16px",
    color: APP_CONFIG.mainCollors.primary,
  },
  inputsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    marginBottom: 20,
  },
}));
