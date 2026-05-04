import {
  Box,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

import { Lock } from "@material-ui/icons";
import CustomButton from "../../components/CustomButton/CustomButton";
import { APP_CONFIG } from "../../constants/config";

const useStyles = makeStyles((theme) => ({
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

export function SenhaAprovar({
  aprovarTodos = true,
  show = false,
  setShow = () => null,
  handleAprovarPagamento = () => null,
  customText = "pagamentos",
  approve = true,
}) {
  const classes = useStyles();
  const [dataToken, setDataToken] = useState("");
  const [clicked, setClicked] = useState(false);

  const textApprove = () => (approve ? "autorizar" : "rejeitar");

  const handelCLickDebounce = () => {
    setClicked(true);
    setTimeout(() => {
      setDataToken("");
      setClicked((prev) => !prev);
    }, 2000);
  };

  return (
    <Modal open={show} onBackdropClick={() => setShow(false)}>
      <Box className={classes.modal}>
        <Box
          className={classes.closeModalButton}
          onClick={() => setShow(false)}
        >
          <CloseIcon />
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
            }}
          >
            Preencha o campo com a senha do seu aplicativo.
          </Typography>

          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: "#F1C40F",
              fontWeight: "bold",
            }}
          >
            {aprovarTodos
              ? `Você irá ${textApprove()} TODOS os ${customText}`
              : `Você irá ${textApprove()} apenas os ${customText} selecionados`}
          </Typography>

          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <TextField
              type="hidden"
              InputProps={{
                type: "hidden",
                display: "none",
              }}
            />

            <TextField
              // fullWidth
              placeholder="Senha"
              size="small"
              variant="outlined"
              type="password"
              autoComplete="off"
              value={dataToken}
              onChange={(e) => setDataToken(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
          </form>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
            }}
          >
            <Box style={{ marginTop: "10px" }}>
              <CustomButton
                variant="contained"
                color={approve ? "purple" : "red"}
                style={{ marginTop: "10px", textTransform: "capitalize" }}
                onClick={() => {
                  handelCLickDebounce();
                  handleAprovarPagamento(dataToken);
                }}
                disabled={clicked}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  {textApprove()}
                </Typography>
              </CustomButton>
            </Box>
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <img
              src={APP_CONFIG.assets.tokenImageSvg}
              style={{ width: "60%" }}
              alt={"Imagem do token"}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
