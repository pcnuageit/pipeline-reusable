import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormHelperText,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CurrencyInput from "react-currency-input";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearQrCodeCobrar,
  getChavesPixAction,
  postGerarQrCodeAction,
} from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
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
  currencyField: {
    fontFamily: "Montserrat-Regular",
    /* fontWeight: 'bold', */
    color: "white",
  },
}));

const DepositarContainer = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const qrCodeCobrar = useSelector((state) => state.qrCodeCobrar);
  const chavesPix = useSelector((state) => state.chavesPix);
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState("");
  const [validacaoChave, setValidacaoChave] = useState(null);
  const [validacaoChaveDialog, setValidacaoChaveDialog] = useState(false);

  const [cobrar, setCobrar] = useState({
    mensagem: "",
    valor: 0,
  });

  useEffect(() => {
    dispatch(getChavesPixAction(token, "", "", "", "", ""));
  }, [token]);

  useEffect(() => {
    if (chavesPix) {
      const validarChave = chavesPix.some((item) =>
        item.status.includes("Confirmado"),
      );
      setValidacaoChave(validarChave);
    }
  }, [chavesPix]);

  const handleGerarQrCode = async () => {
    if (validacaoChave) {
      setLoading(true);
      toast.warning("Gerando o código, por favor aguarde.");
      const resGerarQrCode = await dispatch(
        postGerarQrCodeAction(token, cobrar.mensagem, cobrar.valor, 3),
      );
      if (resGerarQrCode) {
        setErrors(resGerarQrCode);
        toast.error("Falha ao gerar código");
        setLoading(false);
      } else {
        toast.success("Código gerado com sucesso");
        setLoading(false);
        // changePath('aprovacoes');
      }
    } else {
      setValidacaoChaveDialog(true);
    }
  };

  useEffect(() => {
    dispatch(clearQrCodeCobrar());
  }, []);

  return (
    <>
      <Typography
        style={{
          fontFamily: "Montserrat-ExtraBold",
          fontSize: "16px",
          color: APP_CONFIG.mainCollors.primary,
          marginTop: "30px",
          marginLeft: "40px",
        }}
      >
        Depositar
      </Typography>
      <LoadingScreen isLoading={loading} />

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
              Valor a depositar
            </Typography>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Box style={{ marginTop: "20px" }}>
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
                  prefix="R$"
                  decimalSeparator=","
                  thousandSeparator="."
                  value={cobrar.valor}
                  onChange={(e, value) => {
                    setCobrar({
                      ...cobrar,
                      valor: value,
                    });
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
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          style={{
            marginTop: "30px",
            marginBottom: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {qrCodeCobrar && qrCodeCobrar.codigo ? (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: "20px",
              }}
            >
              <Box style={{ marginTop: "10px" }}>
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "16px",
                    color: APP_CONFIG.mainCollors.primary,
                  }}
                >
                  Código: {qrCodeCobrar.codigo}
                </Typography>
              </Box>
              <Box style={{ marginTop: "10px" }}>
                <CopyToClipboard text={qrCodeCobrar.codigo}>
                  <CustomButton
                    color="black"
                    onClick={() => {
                      /* navigator.clipboard.writeText(
											qrCodeCobrar.codigo
										); */
                      toast.success("Código copiado!");
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Copiar
                    </Typography>
                  </CustomButton>
                </CopyToClipboard>
              </Box>
            </Box>
          ) : null}

          <CustomButton color="purple" onClick={handleGerarQrCode}>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: "white",
              }}
            >
              Gerar Código
            </Typography>
          </CustomButton>
        </Box>
      </Box>
      <Dialog
        open={validacaoChaveDialog}
        onClose={() => setValidacaoChaveDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ zIndex: 1000 }}
      >
        <Box width="600px">
          <DialogTitle className={classes.dialogHeader}>
            <Typography align="center" variant="h6">
              Chave não cadastrada
            </Typography>
          </DialogTitle>

          <Box
            display="flex"
            flexDirection="column"
            padding="6px 16px"
            /* style={{ backgroundColor: APP_CONFIG.mainCollors.backgrounds }} */
          >
            <Typography>
              É necessário ter ao menos uma chave para gerar um depósito
            </Typography>
            <Typography>Deseja criar uma chave?</Typography>

            <DialogActions>
              <Button
                onClick={() => changePath("chaves")}
                variant="outlined"
                color="default"
              >
                Criar chave
              </Button>
              <Button
                onClick={() => setValidacaoChaveDialog(false)}
                color="default"
                variant="outlined"
                autoFocus
              >
                Cancelar
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default DepositarContainer;
