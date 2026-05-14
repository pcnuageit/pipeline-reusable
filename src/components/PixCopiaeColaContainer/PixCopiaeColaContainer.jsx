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
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  postLerQrCodeAction,
  postPagamentoPixAction,
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
}));

const PixCopiaeColaContainer = ({ title, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState("");

  const [consultaCodigo, setConsultaCodigo] = useState({
    tipo: "",
    nome: "",
    valor: "",
    ExternalIdentifier: "",
    PixKeyValue: "",
  });

  const [transferenciaPix, setTransferenciaPix] = useState({
    favorito: false,
    dataToken: "",
  });

  const handleLerQrCode = async (e) => {
    try {
      const resLerQrCode = await dispatch(postLerQrCodeAction(token, e));

      setConsultaCodigo({
        ...consultaCodigo,
        nome: resLerQrCode?.qr_code_data?.target_name,
        chave_recebedor: resLerQrCode?.qr_code_key,
        emv: resLerQrCode?.qr_code_payload,
        ExternalIdentifier: resLerQrCode?.txId ?? "",
        PixKeyValue: resLerQrCode?.qr_code_key,
        valor: resLerQrCode?.qr_code_data?.amount,
      });
    } catch (err) {
      toast.error("Ocorreu um erro. Tente novamente mais tarde");
    }
  };

  const handlePagamentoPix = async () => {
    setLoading(true);
    console.log(consultaCodigo);
    const resPagamentoPix = await dispatch(
      postPagamentoPixAction(
        token,
        "Emv",
        0,
        consultaCodigo.PixKeyValue,
        consultaCodigo.valor,
        transferenciaPix.favorito,
        `Pix Qr Code - ${consultaCodigo.nome}`,
        transferenciaPix.dataToken,
        {},
        consultaCodigo.ExternalIdentifier,
        consultaCodigo.emv,
      ),
    );
    if (resPagamentoPix) {
      setErrors(resPagamentoPix);
      setLoading(false);
    } else {
      toast.success("Pix enviado!");
      setLoading(false);
      setOpenModal(false);
      window.location.reload(false);
    }
  };

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
        Pix Copia e Cola
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
          <Typography
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: "17px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            {consultaCodigo.nome}
          </Typography>
          <Box style={{ marginTop: "30px" }}>
            <TextField
              value={transferenciaPix.chave_recebedor}
              error={errors.chave_recebedor}
              helperText={
                errors.chave_recebedor ? errors.chave_recebedor.join(" ") : null
              }
              onChange={(e) => {
                setTransferenciaPix({
                  ...transferenciaPix,
                  chave_recebedor: e.target.value,
                });
                handleLerQrCode(e.target.value);
              }}
              variant="outlined"
              label="Código pix"
              fullWidth
              required
            />
          </Box>
          {/* <Box style={{ marginTop: '20px' }}>
						<TextField
							variant="outlined"
							fullWidth
							label="Descrição"
							value={transferenciaPix.descricao}
							onChange={(e) => {
								setTransferenciaPix({
									...transferenciaPix,
									descricao: e.target.value,
								});
							}}
						/>
					</Box> */}
          {/* <Box
						style={{
							display: 'flex',
							alignItems: 'center',
							marginTop: '20px',
							backgroundColor: APP_CONFIG.mainCollors.primary,
							width: '20%',
							borderRadius: '27px',
							justifyContent: 'center',
						}}
					>
						<Typography
							style={{
								fontFamily: 'Montserrat-Regular',
								fontSize: '16px',
								color: 'white',
							}}
						>
							Favoritar:
						</Typography>

						<Switch
							
							checked={transferenciaPix.favorito}
							onChange={(e) => {
								setTransferenciaPix({
									...transferenciaPix,
									favorito: e.target.checked,
								});
							}}
						/>
					</Box> */}
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
                value={transferenciaPix.dataToken}
                onChange={(e) =>
                  setTransferenciaPix({
                    ...transferenciaPix,
                    dataToken: e,
                  })
                }
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
                <LoadingScreen isLoading={loading} />
                <Box style={{ marginTop: "10px" }}>
                  <CustomButton
                    variant="contained"
                    color="purple"
                    style={{ marginTop: "10px" }}
                    onClick={handlePagamentoPix}
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

export default PixCopiaeColaContainer;
