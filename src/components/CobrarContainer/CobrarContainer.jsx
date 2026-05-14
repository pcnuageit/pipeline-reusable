import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormHelperText,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import ReactInputMask from "react-input-mask";
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

const CobrarContainer = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const qrCodeCobrar = useSelector((state) => state.qrCodeCobrar);
  const chavesPix = useSelector((state) => state.chavesPix);
  const [validacaoChave, setValidacaoChave] = useState(null);
  const [validacaoChaveDialog, setValidacaoChaveDialog] = useState(false);
  const [addPayer, setAddPayer] = useState(false);
  const [errors, setErrors] = useState("");

  const [cobrar, setCobrar] = useState({
    mensagem: "",
    valor: 0,
    expiracao_data: "",
    pagador: {
      nome: "",
      documento: "",
    },
  });

  const getTipoCashIn = () => {
    if (addPayer && cobrar.expiracao_data) return 2;
    if (addPayer) return 1;
    return 3;
  };

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
      toast.warning("Gerando QrCode, por favor aguarde.");
      const resGerarQrCode = await dispatch(
        postGerarQrCodeAction(
          token,
          cobrar.mensagem,
          cobrar.valor,
          getTipoCashIn(),
          cobrar.expiracao_data,
          cobrar.pagador,
        ),
      );
      if (resGerarQrCode) {
        setErrors(resGerarQrCode);
        toast.error("Falha ao gerar QrCode");
        setLoading(false);
      } else {
        toast.success("QrCode gerado com sucesso");
        setLoading(false);
        // changePath('aprovacoes');
      }
    } else {
      setValidacaoChaveDialog(true);
    }
  };

  const downloadQrCode = (contentType, base64Data, fileName) => {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const copyQrCode = async (code) => {
    const decoded = atob(code);

    try {
      await navigator.clipboard.writeText(decoded);
      toast.success("Código Pix copiado para a área de transferência!");
    } catch (err) {
      toast.success(`Não foi possível copiar o código Pix: ${decoded}`);
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
        Cobrar
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
              Valor a cobrar
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
          {addPayer && cobrar.valor === 0 && (
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: APP_CONFIG.mainCollors.primary,
                marginTop: "10px",
              }}
            >
              O QR Code precisa ter um valor
            </Typography>
          )}
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
              value={cobrar.mensagem}
              error={errors.mensagem}
              helperText={errors.mensagem ? errors.mensagem.join(" ") : null}
              onChange={(e) => {
                setCobrar({
                  ...cobrar,
                  mensagem: e.target.value,
                });
              }}
            />
          </Box>

          <Box
            style={{ marginTop: "20px", display: "flex", flexDirection: "row" }}
          >
            <Checkbox
              color="primary"
              checked={addPayer}
              onChange={() => setAddPayer((prev) => !prev)}
            />
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: APP_CONFIG.mainCollors.primary,
                marginTop: "10px",
              }}
            >
              Adicionar pagador
            </Typography>
          </Box>

          {addPayer && (
            <>
              <Box style={{ marginTop: "24px" }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Nome*"
                  value={cobrar.pagador.nome}
                  error={errors?.pagador?.nome}
                  helperText={
                    errors?.pagador?.nome
                      ? errors?.pagador?.nome?.join(" ")
                      : null
                  }
                  onChange={(e) => {
                    setCobrar((prev) => ({
                      ...prev,
                      pagador: {
                        ...prev.pagador,
                        nome: e.target.value,
                      },
                    }));
                  }}
                />
              </Box>
              <Box style={{ marginTop: "24px" }}>
                <ReactInputMask
                  value={cobrar.pagador.documento}
                  onChange={(e) => {
                    setCobrar((prev) => ({
                      ...prev,
                      pagador: {
                        ...prev.pagador,
                        documento: e.target.value,
                      },
                    }));
                  }}
                  maskChar={null}
                  mask={
                    cobrar?.pagador?.documento?.length <= 14
                      ? "999.999.999-999"
                      : "99.999.999/9999-99"
                  }
                >
                  {() => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Documento*"
                      error={errors?.pagador?.documento}
                      helperText={
                        errors?.pagador?.documento
                          ? errors?.pagador?.documento?.join(" ")
                          : null
                      }
                    />
                  )}
                </ReactInputMask>
              </Box>
              <Box style={{ marginTop: "24px" }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label={"Data de vencimento"}
                  InputLabelProps={{ shrink: true }}
                  value={cobrar.pagador.expiracao_data}
                  error={errors?.pagador?.expiracao_data}
                  helperText={
                    errors?.pagador?.expiracao_data
                      ? errors?.pagador?.expiracao_data?.join(" ")
                      : null
                  }
                  onChange={(e) => {
                    setCobrar((prev) => ({
                      ...prev,
                      expiracao_data: e.target.value,
                    }));
                  }}
                  type="date"
                />
              </Box>
            </>
          )}
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
          {qrCodeCobrar?.qrcode?.image ? (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: "20px",
              }}
            >
              <img
                src={`data:image/png;base64,${qrCodeCobrar?.qrcode?.image}`}
                alt="QR Code"
                id="qr-gen"
              />

              <Box style={{ marginTop: "10px" }}>
                <CustomButton
                  color="black"
                  onClick={() =>
                    downloadQrCode(
                      "image/png",
                      qrCodeCobrar?.qrcode?.image,
                      "QrCode",
                    )
                  }
                >
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: "white",
                    }}
                  >
                    Baixar QrCode
                  </Typography>
                </CustomButton>
              </Box>

              <Box style={{ marginTop: "10px" }}>
                <CustomButton
                  color="black"
                  onClick={() =>
                    copyQrCode(
                      qrCodeCobrar?.qrcode?.payload ??
                        qrCodeCobrar?.qrcode?.base_64,
                    )
                  }
                >
                  <Typography
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: "14px",
                      color: "white",
                    }}
                  >
                    Copiar código Copia e Cola
                  </Typography>
                </CustomButton>
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
              Gerar QrCode
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

export default CobrarContainer;
