import {
  Box,
  makeStyles,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { FormControl, FormHelperText } from "@mui/material";
import { useState } from "react";
import CurrencyInput from "react-currency-input";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setCobrancaQrCode } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { postCobrancaCompartilhada } from "../../services/services";
import CustomButton from "../CustomButton/CustomButton";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const useStyles = makeStyles((theme) => ({
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",

    top: "10%",
    left: "25%",
    /* transform: 'translate(-50%, -50%)', */
    width: "50%",
    height: "80%",
    backgroundColor: "white",
    /* bgcolor: 'background.paper', */
    border: "0px solid #000",
    boxShadow: 24,
    /* p: 5, */
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    fontSize: "20px",
    color: APP_CONFIG.mainCollors.primary,
    fontWeight: "bold",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    color: APP_CONFIG.mainCollors.primary,
    fontWeight: "normal",
  },
}));

const WalletNovaCobrancaCompartilhada = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0.0);

  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});

  function handleOpenModal() {
    if (descricao == "") {
      return toast.error("Descrição obrigatória");
    }
    setOpenModal(true);
  }

  async function handlePagar() {
    try {
      setOpenModal(false);
      setLoading(true);
      const { data } = await postCobrancaCompartilhada(token, valor, descricao);
      console.log(data);
      toast.success("Cobrança gerada com sucesso!");
      setLoading(false);
      dispatch(setCobrancaQrCode(data));
      changePath("cobrancaGerada");
    } catch (err) {
      setErrors(err.response.data.errors);
      setLoading(false);
      console.log(err);
      toast.error("Erro ao gerar cobrança, tente novamente.");
    }
  }

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        Gerar cobrança
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Box
          style={{
            width: "90%",
            height: "1px",
            backgroundColor: APP_CONFIG.mainCollors.primary,
          }}
        />

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            style={{
              backgroundColor: APP_CONFIG.mainCollors.primary,
              display: "flex",
              flexDirection: "column",
              /* height: '200px', */
              padding: "20px",
              borderRadius: "17px",
              alignItems: "center",
              width: "100%",
              maxWidth: 400,
              /* justifyContent: 'center', */
            }}
          >
            <Typography
              style={{
                fontFamily: "Montserrat-ExtraBold",
                fontSize: "13px",
                color: "white",
                marginTop: "10px",
              }}
            >
              Valor da cobrança
            </Typography>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Box
                style={{
                  marginTop: "20px",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <FormControl fullWidth>
                  <CurrencyInput
                    style={{
                      marginBottom: "6px",
                      width: "80%",
                      alignSelf: "center",
                      textAlign: "center",
                      height: 40,
                      fontSize: 20,
                      border: "none",
                      color: "#fff",
                      backgroundColor: "transparent",
                      fontFamily: "Montserrat-Regular",
                    }}
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    value={valor}
                    onChangeEvent={(event, maskedvalue, floatvalue) => {
                      setValor(floatvalue);
                    }}
                  />
                  {errors.valor ? (
                    <FormHelperText
                      style={{
                        fontSize: 14,
                        textAlign: "center",
                        fontFamily: "Montserrat-ExtraBold",
                        color: "red",
                      }}
                    >
                      {errors.valor.join(" ")}
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            width: "90%",
            marginTop: "30px",
          }}
        >
          <Box style={{ marginTop: "20px" }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Descrição"
              error={errors.descricao}
              helperText={errors.descricao ? errors.descricao.join(" ") : null}
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box
          style={{
            marginTop: "30px",
            marginBottom: "15px",
          }}
        >
          <CustomButton color="purple" onClick={() => handleOpenModal()}>
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
        <Modal open={openModal} onBackdropClick={() => setOpenModal(false)}>
          <Box className={classes.modal}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              <Typography className={classes.title}>
                Confirme os dados.
              </Typography>
              <Box
                style={{
                  width: "90%",
                  height: "1px",
                  backgroundColor: APP_CONFIG.mainCollors.primary,
                }}
              />
              <Box
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "end",
                  width: "100%",
                }}
              >
                <Box width={"45%"}>
                  <Typography className={classes.title}>Descrição:</Typography>
                  <Typography className={classes.text}>{descricao}</Typography>
                </Box>
                <Box width={"45%"}>
                  <Typography className={classes.title}>Valor:</Typography>
                  <Typography className={classes.text}>
                    R${" "}
                    {parseFloat(valor).toLocaleString("pt-br", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              </Box>
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
                    color="purple"
                    style={{ marginTop: "10px" }}
                    onClick={handlePagar}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Enviar
                    </Typography>
                  </CustomButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default WalletNovaCobrancaCompartilhada;
