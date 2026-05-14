import {
  Box,
  FormHelperText,
  makeStyles,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import { useState } from "react";
import ReactCodeInput from "react-code-input";
import CurrencyInput from "react-currency-input";
import InputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { postPagamentoBoletoAction } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import { getConsultarCodigoDeBarras } from "../../services/services";
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

const PagarBoletos = ({ title, changePath, ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [tokenApp, setTokenApp] = useState("");
  const [docPagamento, setDocPagamento] = useState("");
  const [docValido, setDocValido] = useState(false);
  const [errors, setErrors] = useState("");
  const [dadosBoleto, setDadosBoleto] = useState({
    bankName: "",
    boletoStatus: "",
    bonusValue: "",
    calculatedValue: "",
    digitableLine: "",
    discountValue: "",
    dueDate: "",
    expectedPaymentDate: "",
    fineValue: "",
    id: "",
    interestValue: "",
    payeeCnpj: "",
    payeeName: "",
    rebateValue: "",
    receiverCompe: "",
  });

  async function verificarDocumentoParaPagamento(doc) {
    if (doc !== "") {
      try {
        setLoading(true);
        const { data } = await getConsultarCodigoDeBarras(token, docPagamento);

        await setDadosBoleto(data);
        console.log(dadosBoleto);
        setDocValido(true);
      } catch (err) {
        setDocValido(false);
        toast.error("Não encontramos esse documento para pagamento");
      } finally {
        setLoading(false);
      }
    }
  }

  const handlePagar = async (e) => {
    if (
      (dadosBoleto.Barcode !== "", dadosBoleto.Value !== 0.0, tokenApp !== "")
    ) {
      setLoading(true);

      const resPagamentoBoleto = await dispatch(
        postPagamentoBoletoAction(
          token,
          0,
          dadosBoleto?.discountValue,
          dadosBoleto?.digitable_line?.replace(/\D/g, ""),
          dadosBoleto?.total_amount || dadosBoleto?.Value,
          descricao,
          dadosBoleto?.expiration_date,
          tokenApp,
        ),
      );
      if (resPagamentoBoleto === false) {
        toast.success("Pagamento enviado!");
        setLoading(false);
        setOpenModal(false);
        changePath("aprovacoes");
      } else {
        console.log(resPagamentoBoleto);
        setErrors(resPagamentoBoleto);
        setLoading(false);
        toast.error(resPagamentoBoleto.message);
      }
    }
  };

  function formatarDocumento(doc) {
    let formatado = doc.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gi,
      "",
    );
    setDocPagamento(formatado);
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
          {dadosBoleto.BankCode !== "" && (
            <>
              <Typography
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "17px",
                  color: APP_CONFIG.mainCollors.primary,
                }}
              >
                Nome:{" "}
                {dadosBoleto?.beneficiary_name ??
                  dadosBoleto?.beneficiary_trading_name}
                <br />
                Linha Digitavel: {dadosBoleto.digitable_line}
                <br />
                Vencimento:{" "}
                {moment.utc(dadosBoleto.expiration_date).format("DD/MM/YYYY")}
                <br />
              </Typography>
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
                  alignSelf: "center",
                  marginTop: "10px",
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
                  Valor a pagar
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
                      flexDirection: "column",
                    }}
                  >
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
                      value={dadosBoleto?.total_amount || dadosBoleto?.Value}
                      onChangeEvent={(event, maskedvalue, floatvalue) => {
                        setDadosBoleto({
                          ...dadosBoleto,
                          Value: floatvalue,
                        });
                      }}
                    />

                    {errors.valor ? (
                      <FormHelperText
                        style={{
                          width: "300px",
                          fontSize: 14,
                          textAlign: "center",
                          fontFamily: "Montserrat-Regular",
                          color: "red",
                        }}
                      >
                        {errors.valor.join(" ")}
                      </FormHelperText>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            </>
          )}

          <Box style={{ marginTop: "30px" }}>
            <InputMask
              maskChar=" "
              mask="99999.99999 99999.999999 99999.999999 9 9999999999999999999999999"
              onChange={(e) => {
                formatarDocumento(e.target.value);
              }}
              onBlur={(value) => verificarDocumentoParaPagamento(value)}
            >
              {() => (
                <TextField
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  name="documento"
                  fullWidth
                  required
                  label={"Boleto"}
                />
              )}
            </InputMask>
          </Box>
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
          <CustomButton
            color="purple"
            onClick={() => setOpenModal(true)}
            disabled={!docValido}
          >
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "14px",
                color: "white",
                opacity: !docValido ? 0.3 : 1,
              }}
            >
              Continuar
            </Typography>
          </CustomButton>
        </Box>
        <Modal open={openModal} onBackdropClick={() => setOpenModal(false)}>
          <Box className={classes.modal}>
            <LoadingScreen isLoading={loading} />
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
              {errors && errors.valor ? (
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
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "30px",
                }}
              >
                <Box style={{ marginTop: "10px" }}>
                  <CustomButton
                    disabled={loading}
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

export default PagarBoletos;
