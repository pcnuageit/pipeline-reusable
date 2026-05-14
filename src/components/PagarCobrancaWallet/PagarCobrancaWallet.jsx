import {
  Box,
  FormHelperText,
  makeStyles,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useState } from "react";
import ReactCodeInput from "react-code-input";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { postPagarComSaldo } from "../../services/services";
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
}));

const PagarCobrancaWallet = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [errors, setErrors] = useState({});
  const cobranca = useSelector((state) => state.cobrancaDados);

  const [openModal, setOpenModal] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [tokenApp, setTokenApp] = useState("");

  async function handlePagar() {
    if (tokenApp != "") {
      try {
        setOpenModal(false);
        setLoading(true);

        await postPagarComSaldo(token, tokenApp, cobranca.id, cobranca.valor);
        toast.success("Pagamento efetuado com sucesso!");
        setLoading(false);
        changePath("listaCobrancasRecebidas");
      } catch (err) {
        setErrors(err.response.data.errors);
        setTokenApp("");
        setLoading(false);
        console.log(err);
        toast.error("Erro ao efetuar pagamento, tente novamente.");
      }
    } else {
      toast.error("Verifique os dados e tente novamente.");
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
        Pagar
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
            flexDirection: "column",
            width: "90%",
            marginTop: "30px",
          }}
        >
          {cobranca.conta && (
            <>
              <Box
                style={{
                  display: "flex",
                  width: "60%",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  backgroundColor: APP_CONFIG.mainCollors.primary,
                  padding: 30,
                  borderRadius: 5,
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    fontSize: "25px",
                    color: "white",
                  }}
                >
                  R${" "}
                  {parseFloat(cobranca.valor).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Box>

              <Typography
                style={{
                  marginTop: 20,
                  fontFamily: "Montserrat-Regular",
                  fontSize: "17px",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Nome: {cobranca.conta.nome}
                <br />
                Descrição: {cobranca.descricao}
                <br />
              </Typography>
              {errors.token && (
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "17px",
                    color: "red",
                  }}
                >
                  {errors.token.join(" ")}
                </Typography>
              )}
            </>
          )}

          <Box style={{ marginTop: "20px" }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Descrição"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
            />
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
              backgroundColor: APP_CONFIG.mainCollors.primary,
              width: "20%",
              borderRadius: "27px",
              justifyContent: "center",
            }}
          ></Box>
        </Box>

        <Box
          style={{
            marginTop: "30px",
            marginBottom: "15px",
          }}
        >
          <CustomButton color="purple" onClick={() => setOpenModal(true)}>
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
              <Typography
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: "16px",
                  color: APP_CONFIG.mainCollors.primary,
                  fontWeight: "bold",
                }}
              >
                Preencha o campo com o token do seu aplicativo.
              </Typography>

              <ReactCodeInput
                value={tokenApp}
                onChange={(e) => setTokenApp(e)}
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
              {errors.token ? (
                <FormHelperText
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    fontFamily: "Montserrat-ExtraBold",
                    color: "red",
                  }}
                >
                  {errors.token.join(" ")}
                </FormHelperText>
              ) : null}
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
              <Box style={{ alignSelf: "center", marginTop: "50px" }}>
                <img
                  src={APP_CONFIG.assets.tokenImageSvg}
                  style={{ width: "80%" }}
                />
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default PagarCobrancaWallet;
